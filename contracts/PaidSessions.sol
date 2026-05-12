// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import '@openzeppelin/contracts/access/Ownable.sol';
import '@openzeppelin/contracts/security/ReentrancyGuard.sol';
import '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import '@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol';
import './AnybodyProblemV5.sol';
import './AnybodyTypes.sol';

/// @notice Pay-per-play sibling controller for AnybodyProblemV5 with built-in
/// percentile-based payout. A buy-in mints a tiered ticket, a commit locks a
/// per-session entropy seed (blockhash(startBlock+1)), and a successful
/// submitProof verifies the ZK proof and settles payout against two recent
/// score windows. Settlement uses `score = MAX_TICKS - accumulativeTime`
/// (lower time = higher score). Payout = netCost × f(p_long) × f(p_short),
/// capped by a per-ticket reservation and a pool-concentration ceiling.
contract PaidSessions is Ownable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    // ============ External wiring ============

    AnybodyProblemV5 public anybody;
    IERC20 public usdc;

    // ============ Game constants ============

    uint256 public constant LEVELS = 4;
    /// @dev Sum of maxTicksByLevelIndex (250 + 500 + 750 + 1000). Score = MAX_TICKS - accumulativeTime.
    uint256 public constant MAX_TICKS = 2500;
    /// @dev Mirrors AnybodyProblemV5.windowWidth. Inlined to avoid an external call per chunk.
    uint256 public constant WINDOW_WIDTH = 1_000_000;
    /// @dev EIP-2935 stores the last 8192 blocks. On Base (2s blocks) that's
    /// ~16384 seconds. We cap commit window at 8000s (~2.2h) so a worst-case
    /// late commit can still read blockhash(startBlock+1) via EIP-2935 even if
    /// block production slows temporarily.
    uint256 public constant COMMIT_WINDOW_MAX_SECONDS = 8000;
    /// @dev EIP-2935 history storage system contract — same address on every chain that activated the EIP.
    address public constant HISTORY_STORAGE =
        0x0000F90827F1C53a10cb7A02335B175320002935;

    // ============ Payout constants ============

    /// @notice Multiplier and percentile precision. MUL_ONE units = 1.0.
    uint256 public constant MUL_ONE = 1e18;
    /// @notice Basis-points unit.
    uint16 public constant BPS = 10_000;
    /// @notice Long-window buffer size. Slow-moving distribution reference.
    uint256 public constant W_LONG = 1000;

    // Curve constants — see PercentilePayoutSystem reference for derivation.
    uint256 public constant CURVE_A = 21_000_000_000_000;
    uint256 public constant CURVE_M = 1_100_000_000_000_000_000;
    uint256 public constant CURVE_L = 1_849_700_000_000_000_000;
    uint256 public constant CURVE_C = 0;
    uint256 public constant CURVE_K = 5;
    /// @dev sqrt(10) × 1e18, so combined max = 10× netCost.
    uint256 public constant CURVE_TOP = 3_162_277_660_168_379_392;
    /// @dev 0.01 × 1e18 — top 1% of each axis is held flat at TOP.
    uint256 public constant CURVE_CAP_PCT = 10_000_000_000_000_000;
    /// @dev Precomputed M^K = 1.61051 × 1e18.
    uint256 public constant CURVE_M_POW_K = 1_610_510_000_000_000_000;

    // ============ Session lifecycle config ============

    uint256 public commitWindowSeconds = 300;   // 5 min
    uint256 public proofWindowSeconds = 3600;   // 1 hour

    bool public paused = false;

    enum Status {
        None,
        Open,
        Committed,
        Settled,
        Forfeited
    }

    struct PaidLevel {
        bool solved;
        uint256 time;
        uint256[5] tmpInflightMissile;
        Body[6] tmpBodyData;
    }

    struct Tier {
        uint256 entryFee;       // USDC fee (6 decimals)
        bool    enabled;
    }

    struct Session {
        address player;
        uint16  tier;
        uint256 startBlock;
        uint256 commitDeadline;
        uint256 proofDeadline;
        bytes32 seed;
        bytes32 scoreCommit;
        uint256 accumulativeTime;
        uint256 finalScore;       // MAX_TICKS - accumulativeTime, set on settle
        uint256 netCost;          // amount that entered the pool (post fee)
        uint256 reserved;         // worst-case payout reserved at buy
        uint256 payout;           // final payout, set on settle
        bool    solved;
        Status  status;
    }

    // ============ Storage: sessions ============

    mapping(uint256 => Session) public sessions;
    mapping(uint256 => PaidLevel[]) internal sessionLevels;
    uint256 public lastSessionId;

    /// @dev Lowest sessionId not yet definitively advanced past by the auto-forfeit walker.
    uint256 public forfeitCursor = 1;
    /// @dev Max number of session entries scanned per auto-forfeit pass triggered by lifecycle calls.
    uint256 public maxAutoScan = 50;

    // ============ Storage: payout ============

    Tier[] public tiers; // 1-indexed; tiers[0] unused

    /// @notice Long-window circular buffer of recent settled scores.
    uint256[W_LONG] internal longBuffer;
    uint256 public longCursor;
    bool public longFilled;

    /// @notice Short-window state. Size adjustable, default 10.
    uint256[] internal shortBuffer;
    uint256 public shortCursor;
    bool public shortFilled;
    uint256 public shortWindowSize;

    /// @notice Operator fee (BPS of net entry). Default 0; revenue extraction is via withdrawSurplus.
    uint16 public houseFeeBps;
    address public feeRecipient;

    /// @notice Concentration cap. Max single payout = freeBalance × this / BPS.
    uint16 public concentrationBps;

    /// @notice Total reserved payout for unsettled+unclaimed sessions.
    uint256 public totalLiabilities;

    // ============ Events ============

    event SessionStarted(
        uint256 indexed sessionId,
        address indexed player,
        uint16 tier,
        uint256 netCost,
        uint256 reserved,
        uint256 fee,
        uint256 startBlock,
        uint256 commitDeadline
    );
    event SessionCommitted(
        uint256 indexed sessionId,
        bytes32 seed,
        bytes32 scoreCommit,
        uint256 proofDeadline
    );
    event PaidLevelSolved(
        uint256 indexed sessionId,
        uint256 indexed level,
        uint256 time
    );
    event SessionProven(
        uint256 indexed sessionId,
        address indexed player,
        uint256 accumulativeTime
    );
    event SessionSettled(
        uint256 indexed sessionId,
        address indexed player,
        uint256 score,
        uint256 pLong,
        uint256 pShort,
        uint256 payout
    );
    /// @param reason 0 = commit window expired, 1 = proof window expired
    event SessionForfeited(uint256 indexed sessionId, uint256 reason);

    event TierSet(uint16 indexed tier, uint256 entryFee, bool enabled);
    event ShortWindowSizeSet(uint256 size);
    event HouseFeeSet(uint16 bps, address recipient);
    event ConcentrationSet(uint16 bps);
    event PrizePoolFunded(address indexed from, uint256 amount);
    event PrizePoolWithdrawn(address indexed to, uint256 amount);

    event ConfigUpdated(string indexed what, uint256 value);
    event AnybodyUpdated(address indexed previous, address indexed next);
    event USDCUpdated(address indexed previous, address indexed next);

    modifier whenNotPaused() {
        require(!paused, 'Contract is paused');
        _;
    }

    constructor(
        AnybodyProblemV5 anybody_,
        IERC20 usdc_,
        address feeRecipient_,
        uint256 shortWindowSize_,
        uint16 houseFeeBps_,
        uint16 concentrationBps_
    ) {
        require(address(anybody_) != address(0), 'Invalid anybody');
        require(address(usdc_) != address(0), 'Invalid USDC');
        require(feeRecipient_ != address(0), 'Invalid fee recipient');
        require(houseFeeBps_ <= BPS, 'fee>100%');
        require(
            concentrationBps_ > 0 && concentrationBps_ <= BPS,
            'Invalid concentration'
        );
        require(shortWindowSize_ >= 2, 'Short window<2');

        anybody = anybody_;
        usdc = usdc_;
        feeRecipient = feeRecipient_;
        houseFeeBps = houseFeeBps_;
        concentrationBps = concentrationBps_;
        shortWindowSize = shortWindowSize_;
        shortBuffer = new uint256[](shortWindowSize_);

        tiers.push(); // burn index 0

        // Launch tiers (USDC has 6 decimals): $0.50, $1, $2, $5, $10.
        // Owner can re-tune via setTier post-deploy.
        _initTier(500_000);
        _initTier(1_000_000);
        _initTier(2_000_000);
        _initTier(5_000_000);
        _initTier(10_000_000);

        emit HouseFeeSet(houseFeeBps_, feeRecipient_);
        emit ConcentrationSet(concentrationBps_);
        emit ShortWindowSizeSet(shortWindowSize_);
    }

    function _initTier(uint256 entryFee) internal {
        tiers.push(Tier({entryFee: entryFee, enabled: true}));
        emit TierSet(uint16(tiers.length - 1), entryFee, true);
    }

    // ============ Curve evaluation ============

    /// @notice Compute f(p) where p is in MUL_ONE units (0..MUL_ONE).
    /// @dev Fixed-point, ~5k gas. Top 1% capped at CURVE_TOP.
    function f(uint256 pScaled) public pure returns (uint256) {
        if (pScaled > MUL_ONE - CURVE_CAP_PCT) {
            return CURVE_TOP;
        }
        uint256 diff = CURVE_M - pScaled;
        uint256 diffPowK = diff;
        for (uint256 i = 1; i < CURVE_K; i++) {
            diffPowK = (diffPowK * diff) / MUL_ONE;
        }
        uint256 term1 = (CURVE_A * MUL_ONE) / diffPowK;
        uint256 term2 = (CURVE_A * MUL_ONE) / CURVE_M_POW_K;
        uint256 term3 = (CURVE_L * pScaled) / MUL_ONE;
        return term1 - term2 + term3 + CURVE_C;
    }

    // ============ Lifecycle ============

    function buyIn(
        uint16 tier
    ) external whenNotPaused nonReentrant returns (uint256 sessionId) {
        _processForfeits(maxAutoScan);

        require(tier >= 1 && tier < tiers.length, 'Bad tier');
        Tier memory t = tiers[tier];
        require(t.enabled, 'Tier disabled');
        require(t.entryFee > 0, 'Tier unset');

        uint256 fee = (t.entryFee * houseFeeBps) / BPS;
        uint256 toPool = t.entryFee - fee;

        usdc.safeTransferFrom(msg.sender, address(this), t.entryFee);
        if (fee > 0) {
            usdc.safeTransfer(feeRecipient, fee);
        }

        // Worst-case reservation: top × top × netCost.
        uint256 maxMultProduct = (CURVE_TOP * CURVE_TOP) / MUL_ONE;
        uint256 reserved = (toPool * maxMultProduct) / MUL_ONE;

        // Layer 1: per-ticket reservation must fit in pool.
        uint256 bal = usdc.balanceOf(address(this));
        require(bal >= totalLiabilities + reserved, 'Pool underfunded');

        // Layer 2: concentration cap.
        uint256 freeBalance = bal - totalLiabilities;
        uint256 concentrationCap = (freeBalance * concentrationBps) / BPS;
        require(reserved <= concentrationCap, 'Exceeds concentration cap');

        totalLiabilities += reserved;

        sessionId = ++lastSessionId;
        Session storage s = sessions[sessionId];
        s.player = msg.sender;
        s.tier = tier;
        s.startBlock = block.number;
        s.commitDeadline = block.timestamp + commitWindowSeconds;
        s.netCost = toPool;
        s.reserved = reserved;
        s.status = Status.Open;

        emit SessionStarted(
            sessionId,
            msg.sender,
            tier,
            toPool,
            reserved,
            fee,
            s.startBlock,
            s.commitDeadline
        );
    }

    /// @notice Commit a score hash and lock in the on-chain seed for this session.
    /// `submitProof` (the default revealer) expects
    /// `scoreCommit == keccak256(abi.encodePacked(claimedTime, salt))`.
    function commit(
        uint256 sessionId,
        bytes32 scoreCommit
    ) external whenNotPaused {
        _processForfeits(maxAutoScan);
        Session storage s = sessions[sessionId];
        require(s.player == msg.sender, 'Not session owner');
        require(s.status == Status.Open, 'Session not open');
        require(block.number > s.startBlock, 'Wait one block to commit');
        require(block.timestamp <= s.commitDeadline, 'Commit window expired');

        bytes32 entropy = _readBlockhash(s.startBlock + 1);
        require(entropy != bytes32(0), 'Blockhash unavailable');

        s.seed = keccak256(abi.encodePacked(msg.sender, sessionId, entropy));
        s.scoreCommit = scoreCommit;
        s.proofDeadline = block.timestamp + proofWindowSeconds;
        s.status = Status.Committed;
        emit SessionCommitted(sessionId, s.seed, scoreCommit, s.proofDeadline);
    }

    function submitProof(
        uint256 sessionId,
        uint256 claimedTime,
        bytes32 salt,
        uint256[] calldata tickCounts,
        uint[2][] calldata a,
        uint[2][2][] calldata b,
        uint[2][] calldata c,
        uint[][] calldata input
    ) external whenNotPaused nonReentrant {
        _processForfeits(maxAutoScan);
        Session storage s = sessions[sessionId];
        require(s.player == msg.sender, 'Not session owner');
        require(s.status == Status.Committed, 'Session not committed');
        require(block.timestamp <= s.proofDeadline, 'Proof window expired');

        require(
            keccak256(abi.encodePacked(claimedTime, salt)) == s.scoreCommit,
            'Score commitment mismatch'
        );

        for (uint256 i = 0; i < input.length; i++) {
            _verifyChunk(
                sessionId,
                tickCounts[i],
                a[i],
                b[i],
                c[i],
                input[i]
            );
        }

        require(s.solved, 'Not all levels solved');
        require(
            s.accumulativeTime == claimedTime,
            'Score does not match proof time'
        );

        emit SessionProven(sessionId, msg.sender, s.accumulativeTime);

        // Settle: score = MAX_TICKS - accumulativeTime (lower time = higher score).
        // accumulativeTime is bounded ≤ MAX_TICKS by per-level time-limit checks.
        _settle(sessionId, MAX_TICKS - s.accumulativeTime);
    }

    // ============ Settle ============

    function _settle(uint256 sessionId, uint256 score) internal {
        Session storage s = sessions[sessionId];

        // Compute percentiles BEFORE updating buffers, so the player isn't
        // measured against their own current score.
        uint256 pLong = _percentileLong(score);
        uint256 pShort = _percentileShort(score);

        uint256 mLong = f(pLong);
        uint256 mShort = f(pShort);

        uint256 rawPayout = (s.netCost * mLong / MUL_ONE) * mShort / MUL_ONE;

        // Settle-time concentration cap: include this session's own
        // reservation in free balance (it's about to be released).
        uint256 bal = usdc.balanceOf(address(this));
        uint256 freeIncludingThis = bal - totalLiabilities + s.reserved;
        uint256 concentrationCap = (freeIncludingThis * concentrationBps) / BPS;

        uint256 finalPayout = rawPayout < concentrationCap ? rawPayout : concentrationCap;
        if (finalPayout > s.reserved) {
            finalPayout = s.reserved;
        }

        // Update buffers AFTER lookup.
        longBuffer[longCursor] = score;
        if (longCursor + 1 >= W_LONG) longFilled = true;
        longCursor = (longCursor + 1) % W_LONG;

        shortBuffer[shortCursor] = score;
        uint256 sLen = shortBuffer.length;
        if (shortCursor + 1 >= sLen) shortFilled = true;
        shortCursor = (shortCursor + 1) % sLen;

        // Release the full reservation: unused portion stays in the pool, the
        // payout portion is transferred to the player below.
        totalLiabilities -= s.reserved;
        s.reserved = 0;
        s.finalScore = score;
        s.payout = finalPayout;
        s.status = Status.Settled;

        emit SessionSettled(sessionId, s.player, score, pLong, pShort, finalPayout);

        if (finalPayout > 0) {
            usdc.safeTransfer(s.player, finalPayout);
        }
    }

    // ============ Auto-forfeit ============

    /// @notice Walk forward from `forfeitCursor`, scanning up to `maxScan` sessions,
    /// marking expired Open/Committed sessions as Forfeited and releasing their
    /// reservation. The cursor stops at the first session that is still pending.
    function processForfeits(uint256 maxScan) external {
        _processForfeits(maxScan);
    }

    function _processForfeits(uint256 maxScan) internal {
        uint256 cursor = forfeitCursor;
        uint256 maxId = lastSessionId;
        if (cursor > maxId || maxScan == 0) return;
        uint256 stopId = cursor + maxScan;
        if (stopId > maxId + 1) stopId = maxId + 1;
        for (uint256 id = cursor; id < stopId; id++) {
            Session storage s = sessions[id];
            Status st = s.status;
            if (st == Status.Open) {
                if (block.timestamp > s.commitDeadline) {
                    s.status = Status.Forfeited;
                    totalLiabilities -= s.reserved;
                    s.reserved = 0;
                    emit SessionForfeited(id, 0);
                } else {
                    forfeitCursor = id;
                    return;
                }
            } else if (st == Status.Committed) {
                if (block.timestamp > s.proofDeadline) {
                    s.status = Status.Forfeited;
                    totalLiabilities -= s.reserved;
                    s.reserved = 0;
                    emit SessionForfeited(id, 1);
                } else {
                    forfeitCursor = id;
                    return;
                }
            }
            // Settled or Forfeited — already resolved, advance.
        }
        forfeitCursor = stopId;
    }

    /// @notice Number of sessions that would be auto-forfeited if `_processForfeits`
    /// were called now with `maxScan`. Counts all expired Open/Committed sessions
    /// in the window — does NOT early-stop at the first still-pending one.
    function pendingForfeitCount(
        uint256 maxScan
    ) public view returns (uint256 staged) {
        uint256 cursor = forfeitCursor;
        uint256 maxId = lastSessionId;
        if (cursor > maxId || maxScan == 0) return 0;
        uint256 stopId = cursor + maxScan;
        if (stopId > maxId + 1) stopId = maxId + 1;
        for (uint256 id = cursor; id < stopId; id++) {
            Session storage s = sessions[id];
            if (s.status == Status.Open) {
                if (block.timestamp > s.commitDeadline) staged += 1;
            } else if (s.status == Status.Committed) {
                if (block.timestamp > s.proofDeadline) staged += 1;
            }
        }
    }

    // ============ Internals ============

    function _readBlockhash(
        uint256 blockNumber
    ) internal view returns (bytes32) {
        require(blockNumber < block.number, 'Block not yet produced');
        if (block.number - blockNumber <= 256) {
            return blockhash(blockNumber);
        }
        (bool ok, bytes memory data) = HISTORY_STORAGE.staticcall(
            abi.encode(blockNumber)
        );
        if (ok && data.length == 32) {
            return abi.decode(data, (bytes32));
        }
        return bytes32(0);
    }

    function _verifyChunk(
        uint256 sessionId,
        uint256 tickCount,
        uint[2] memory a,
        uint[2][2] memory b,
        uint[2] memory c,
        uint[] memory input
    ) internal {
        Session storage s = sessions[sessionId];

        bytes32 proofHash = keccak256(abi.encodePacked(a, b, c, input));
        anybody.consumeProof(proofHash);

        (uint256 intendedLevel, uint256 dummyCount) = anybody
            .getLevelFromInputs(input);
        require(
            intendedLevel >= 1 && intendedLevel <= LEVELS,
            'Invalid level'
        );

        PaidLevel[] storage levels = sessionLevels[sessionId];
        if (levels.length < intendedLevel) {
            require(
                levels.length == intendedLevel - 1,
                'Skipping a level not allowed'
            );
            _initLevel(sessionId, intendedLevel, s.seed);
        }

        uint256 levelIdx = intendedLevel - 1;
        PaidLevel storage levelData = sessionLevels[sessionId][levelIdx];
        require(!levelData.solved, 'Level already solved');

        uint256 bodyCount = intendedLevel + 2; // includes protectee
        require(
            address(uint160(input[5 + (bodyCount + dummyCount) * 5 + 1])) ==
                msg.sender,
            'Owner of this proof is not the sender'
        );

        // Inflight missile chain verification — must match the previous chunk's
        // outflight, or be a fresh missile starting from the corner.
        {
            uint256[5] memory storedOut = levelData.tmpInflightMissile;
            uint256[5] memory newIn = [
                input[5 + 2 * (bodyCount + dummyCount) * 5 + 2 + 0],
                input[5 + 2 * (bodyCount + dummyCount) * 5 + 2 + 1],
                input[5 + 2 * (bodyCount + dummyCount) * 5 + 2 + 2],
                input[5 + 2 * (bodyCount + dummyCount) * 5 + 2 + 3],
                input[5 + 2 * (bodyCount + dummyCount) * 5 + 2 + 4]
            ];
            if (newIn[4] != 0) {
                bool matchesStored = storedOut[0] == newIn[0] &&
                    storedOut[1] == newIn[1] &&
                    storedOut[2] == newIn[2] &&
                    storedOut[3] == newIn[3] &&
                    storedOut[4] == newIn[4];
                bool freshMissile = newIn[0] == 0 && newIn[1] == WINDOW_WIDTH;
                require(
                    freshMissile || matchesStored,
                    'Invalid inflightMissile'
                );
            }
        }
        levelData.tmpInflightMissile = [
            input[0],
            input[1],
            input[2],
            input[3],
            input[4]
        ];

        require(
            anybody.verifyProofPublic(
                a,
                b,
                c,
                input,
                bodyCount + dummyCount,
                tickCount
            ),
            'Invalid proof'
        );

        levelData.time += input[5 + (bodyCount + dummyCount) * 5];
        require(
            levelData.time <= anybody.maxTicksByLevelIndex(levelIdx),
            'Time limit exceeded'
        );

        uint256 bodiesGone = 0;
        for (uint256 i = 0; i < bodyCount; i++) {
            Body memory bd = levelData.tmpBodyData[i];
            _verifyBodyDataMatches(bd, input, bodyCount + dummyCount, i);
            bd = _extractBodyData(bd, input, i);
            if (i == 0) {
                require(bd.radius != 0, 'You shot the protectee');
            }
            if (bd.radius == 0) {
                bodiesGone++;
            }
            levelData.tmpBodyData[i] = bd;
        }

        if (bodiesGone == intendedLevel + 1) {
            levelData.solved = true;
            s.accumulativeTime += levelData.time;
            emit PaidLevelSolved(sessionId, intendedLevel, levelData.time);
            if (intendedLevel == LEVELS) {
                s.solved = true;
            }
        }
    }

    function _initLevel(
        uint256 sessionId,
        uint256 level,
        bytes32 seed
    ) internal {
        sessionLevels[sessionId].push();
        PaidLevel storage newLvl = sessionLevels[sessionId][
            sessionLevels[sessionId].length - 1
        ];
        for (uint256 j = 0; j <= level + 1; j++) {
            newLvl.tmpBodyData[j] = anybody.generateBody(
                uint256(seed),
                level,
                j
            );
        }
    }

    function _verifyBodyDataMatches(
        Body memory bodyData,
        uint[] memory input,
        uint256 bodyCount,
        uint256 i
    ) internal pure {
        require(
            bodyData.px == input[5 + 5 * bodyCount + i * 5 + 0 + 2],
            'Invalid position x'
        );
        require(
            bodyData.py == input[5 + 5 * bodyCount + i * 5 + 1 + 2],
            'Invalid position y'
        );
        require(
            bodyData.vx == input[5 + 5 * bodyCount + i * 5 + 2 + 2],
            'Invalid vector x'
        );
        require(
            bodyData.vy == input[5 + 5 * bodyCount + i * 5 + 3 + 2],
            'Invalid vector y'
        );
        require(
            bodyData.radius == input[5 + 5 * bodyCount + i * 5 + 4 + 2],
            'Invalid radius'
        );
    }

    function _extractBodyData(
        Body memory bodyData,
        uint[] memory input,
        uint256 i
    ) internal pure returns (Body memory) {
        bodyData.px = input[5 + i * 5 + 0];
        bodyData.py = input[5 + i * 5 + 1];
        bodyData.vx = input[5 + i * 5 + 2];
        bodyData.vy = input[5 + i * 5 + 3];
        bodyData.radius = input[5 + i * 5 + 4];
        return bodyData;
    }

    function _percentileLong(uint256 score) internal view returns (uint256) {
        uint256 n = longFilled ? W_LONG : longCursor;
        if (n == 0) return MUL_ONE / 2;
        uint256 below = 0;
        uint256 atOrBelow = 0;
        for (uint256 i = 0; i < n; i++) {
            uint256 sc = longBuffer[i];
            if (sc < score) below++;
            if (sc <= score) atOrBelow++;
        }
        return ((below + atOrBelow) * MUL_ONE) / (2 * n);
    }

    function _percentileShort(uint256 score) internal view returns (uint256) {
        uint256 capacity = shortBuffer.length;
        uint256 n = shortFilled ? capacity : shortCursor;
        if (n == 0) return MUL_ONE / 2;
        uint256 below = 0;
        uint256 atOrBelow = 0;
        for (uint256 i = 0; i < n; i++) {
            uint256 sc = shortBuffer[i];
            if (sc < score) below++;
            if (sc <= score) atOrBelow++;
        }
        return ((below + atOrBelow) * MUL_ONE) / (2 * n);
    }

    // ============ Views ============

    function getSessionLevels(
        uint256 sessionId
    ) external view returns (PaidLevel[] memory) {
        return sessionLevels[sessionId];
    }

    function sessionLevelCount(
        uint256 sessionId
    ) external view returns (uint256) {
        return sessionLevels[sessionId].length;
    }

    function tierCount() external view returns (uint256) {
        return tiers.length;
    }

    function percentileLong(uint256 score) external view returns (uint256) {
        return _percentileLong(score);
    }

    function percentileShort(uint256 score) external view returns (uint256) {
        return _percentileShort(score);
    }

    /// @notice Estimated payout for `score` at `tier` against current buffer state.
    function estimatePayout(uint16 tier, uint256 score) external view returns (uint256) {
        Tier memory t = tiers[tier];
        uint256 fee = (t.entryFee * houseFeeBps) / BPS;
        uint256 toPool = t.entryFee - fee;

        uint256 pLong = _percentileLong(score);
        uint256 pShort = _percentileShort(score);
        uint256 mLong = f(pLong);
        uint256 mShort = f(pShort);
        uint256 raw = (toPool * mLong / MUL_ONE) * mShort / MUL_ONE;

        uint256 bal = usdc.balanceOf(address(this));
        uint256 free = bal - totalLiabilities;
        uint256 cap = (free * concentrationBps) / BPS;
        return raw < cap ? raw : cap;
    }

    /// @notice Largest tier currently buyable (worst-case reservation fits in
    /// the concentration cap). Returns 0 if nothing is buyable.
    function maxAffordableTier() external view returns (uint16) {
        uint256 bal = usdc.balanceOf(address(this));
        uint256 free = bal - totalLiabilities;
        uint256 cap = (free * concentrationBps) / BPS;
        uint256 maxMultProduct = (CURVE_TOP * CURVE_TOP) / MUL_ONE;

        if (tiers.length < 2) return 0;
        for (uint256 t = tiers.length - 1; t >= 1; t--) {
            Tier memory tier = tiers[t];
            if (tier.enabled && tier.entryFee > 0) {
                uint256 feeAmt = (tier.entryFee * houseFeeBps) / BPS;
                uint256 toPool = tier.entryFee - feeAmt;
                uint256 reserved = (toPool * maxMultProduct) / MUL_ONE;
                if (reserved <= cap) return uint16(t);
            }
            if (t == 1) break;
        }
        return 0;
    }

    // ============ Owner setters: payout ============

    function setTier(
        uint16 tier,
        uint256 entryFee,
        bool enabled
    ) external onlyOwner {
        require(tier >= 1, 'tier<1');
        while (tiers.length <= tier) tiers.push();
        tiers[tier] = Tier({entryFee: entryFee, enabled: enabled});
        emit TierSet(tier, entryFee, enabled);
    }

    function setShortWindowSize(uint256 size_) external onlyOwner {
        require(size_ >= 2, 'short<2');
        require(totalLiabilities == 0, 'Outstanding liabilities');
        shortBuffer = new uint256[](size_);
        shortWindowSize = size_;
        shortCursor = 0;
        shortFilled = false;
        emit ShortWindowSizeSet(size_);
    }

    function setHouseFee(uint16 bps_, address recipient_) external onlyOwner {
        require(bps_ <= BPS, 'fee>100%');
        require(recipient_ != address(0), 'recipient=0');
        houseFeeBps = bps_;
        feeRecipient = recipient_;
        emit HouseFeeSet(bps_, recipient_);
    }

    function setConcentration(uint16 bps_) external onlyOwner {
        require(bps_ > 0 && bps_ <= BPS, 'Invalid concentration');
        concentrationBps = bps_;
        emit ConcentrationSet(bps_);
    }

    function fundPrizePool(uint256 amount) external nonReentrant {
        usdc.safeTransferFrom(msg.sender, address(this), amount);
        emit PrizePoolFunded(msg.sender, amount);
    }

    /// @notice Withdraw pool surplus (curve edge accumulated as profit).
    /// Cannot underfund liabilities.
    function withdrawSurplus(address to, uint256 amount) external onlyOwner nonReentrant {
        require(to != address(0), 'to=0');
        uint256 bal = usdc.balanceOf(address(this));
        require(bal >= totalLiabilities + amount, 'would underfund');
        usdc.safeTransfer(to, amount);
        emit PrizePoolWithdrawn(to, amount);
    }

    // ============ Owner setters: lifecycle ============

    function setCommitWindow(uint256 seconds_) external onlyOwner {
        require(
            seconds_ > 0 && seconds_ <= COMMIT_WINDOW_MAX_SECONDS,
            'Out of range'
        );
        commitWindowSeconds = seconds_;
        emit ConfigUpdated('commitWindowSeconds', seconds_);
    }

    function setProofWindow(uint256 seconds_) external onlyOwner {
        require(seconds_ > 0, 'Zero window');
        proofWindowSeconds = seconds_;
        emit ConfigUpdated('proofWindowSeconds', seconds_);
    }

    function setMaxAutoScan(uint256 n) external onlyOwner {
        maxAutoScan = n;
        emit ConfigUpdated('maxAutoScan', n);
    }

    function updateAnybody(AnybodyProblemV5 anybody_) external onlyOwner {
        require(address(anybody_) != address(0), 'Invalid anybody');
        emit AnybodyUpdated(address(anybody), address(anybody_));
        anybody = anybody_;
    }

    function updateUSDC(IERC20 usdc_) external onlyOwner {
        require(address(usdc_) != address(0), 'Invalid USDC');
        require(totalLiabilities == 0, 'Outstanding liabilities');
        emit USDCUpdated(address(usdc), address(usdc_));
        usdc = usdc_;
    }

    function updatePaused(bool paused_) external onlyOwner {
        paused = paused_;
    }
}
