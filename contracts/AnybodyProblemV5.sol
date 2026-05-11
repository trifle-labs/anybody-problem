// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import {Groth16Verifier as Groth16Verifier4} from './Game_4_20Verifier.sol';
import {Groth16Verifier as Groth16Verifier6} from './Game_6_20Verifier.sol';

import '@openzeppelin/contracts/token/common/ERC2981.sol';
import '@openzeppelin/contracts/access/Ownable.sol';
import '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import '@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol';
import '@openzeppelin/contracts/token/ERC1155/ERC1155.sol';
import './Speedruns.sol';
import './ExternalMetadata.sol';
import './AnybodyProblemV4.sol';

contract AnybodyProblemV5 is Ownable, ERC2981 {
    using SafeERC20 for IERC20;

    uint256 public constant LEVELS = 4;
    uint256 public constant SECONDS_IN_A_DAY = 86400;
    uint256 public constant FIRST_SUNDAY_AT_6_PM_UTC = 324000;
    uint256 public constant FIRST_DAY = 1723766400; // Fri Aug 16 2024 00:00:00 GMT+0000

    bool public paused = false;

    // USDC (6 decimals)
    IERC20 public usdc;
    uint256 public playPrice = 500_000; // $0.50
    uint256 public dailyPrizeRate = 1_000_000; // $1.00
    uint256 public prefundedPrizePool;
    mapping(uint256 => uint256) public dailyPool; // day => USDC accumulated
    mapping(uint256 => bool) public daySeeded; // day => has been seeded from prefundedPrizePool
    mapping(uint256 => bool) public dailyPoolClaimed; // day => claimed by fastest

    /// @dev Basis points (10_000 = 100%). Cut of every play fee + NFT mint fee that goes to proceedRecipient. Default 0.
    uint256 public proceedRate;
    uint256 public constant BPS_DENOMINATOR = 10_000;

    uint256 public deployDay;
    address payable public previousAB;
    address payable public proceedRecipient;
    address public externalMetadata;
    address payable public speedruns;

    uint256 public counterForOrdering;

    uint256[5] public maxTicksByLevelIndex = [
        1 * 10 * 25,
        2 * 10 * 25,
        3 * 10 * 25,
        4 * 10 * 25
    ];
    uint256 public constant speedFactor = 2;
    uint256 public constant scalingFactor = 10 ** 3;
    uint256 public constant maxVector = 10 * speedFactor;
    uint256 public constant maxVectorScaled = maxVector * scalingFactor;
    uint256 public constant windowWidth = 1000 * scalingFactor;
    uint256 public constant startingRadius = 2;

    struct Run {
        address owner;
        bool solved;
        uint256 accumulativeTime;
        bytes32 seed;
        uint256 day;
        Level[] levels;
    }
    struct RunWithoutLevels {
        address owner;
        bool solved;
        uint256 accumulativeTime;
        bytes32 seed;
        uint256 day;
    }
    struct Level {
        bool solved;
        uint256 time;
        bytes32 seed;
        uint256[5] tmpInflightMissile;
        Body[6] tmpBodyData;
    }
    struct Body {
        uint256 bodyIndex;
        uint256 px;
        uint256 py;
        uint256 vx;
        uint256 vy;
        uint256 radius;
        bytes32 seed;
    }

    struct Record {
        bool updated;
        uint256 total;
        uint256 lastPlayed;
        uint256 streak;
    }

    struct OldRecordType {
        uint256 total;
        uint256 lastPlayed;
        uint256 streak;
    }

    mapping(uint256 => uint256[3]) public fastestByDay_; // day => [fastest, 2nd, 3rd runId]
    address[3] public mostGames;
    address[3] public longestStreak;

    mapping(address => Record) public gamesPlayed_;
    mapping(uint256 => Run) public runs_;
    uint256 public totalRuns;

    mapping(uint256 => mapping(uint256 => address)) public verifiers;
    mapping(bytes32 => bool) public usedProofs;

    // Authorized writers (e.g., PaidSessions)
    mapping(address => bool) public authorizedWriter;

    event RunCreated(uint256 runId, uint256 day, bytes32 seed);
    event RunSolved(
        address indexed player,
        uint256 indexed runId,
        uint256 accumulativeTime,
        uint256 day,
        uint256 streak
    );
    event LevelCreated(uint256 runId, uint256 level, bytes32 seed, uint256 day);
    event LevelSolved(
        address indexed player,
        uint256 indexed runId,
        uint256 indexed level,
        uint256 time,
        uint256 day
    );
    event PrizeDeposited(address indexed from, uint256 amount, uint256 newPrefundedTotal);
    event DailyPoolSeeded(uint256 indexed day, uint256 amount);
    event DailyPoolFunded(uint256 indexed day, address indexed payer, uint256 amount);
    event DailyPrizeClaimed(uint256 indexed day, address indexed winner, uint256 amount);
    event AuthorizedWriterUpdated(address indexed writer, bool authorized);
    event ProofConsumed(address indexed by, bytes32 indexed proofHash);
    event EthMoved(
        address indexed to,
        bool indexed success,
        bytes returnData,
        uint256 amount
    );

    constructor(
        address usdc_,
        address payable speedruns_,
        address externalMetadata_,
        address[] memory verifiers_,
        uint256[] memory verifiersTicks,
        uint256[] memory verifiersBodies,
        address payable previousAB_,
        address payable proceedRecipient_
    ) {
        require(usdc_ != address(0), 'Invalid USDC');
        usdc = IERC20(usdc_);
        deployDay = currentDay();
        updatePreviousAB(previousAB_);
        updateProceedRecipient(proceedRecipient_);
        if (previousAB != address(0)) {
            totalRuns = AnybodyProblemV4(previousAB).runCount();
            longestStreak[0] = AnybodyProblemV4(previousAB).longestStreak(0);
            longestStreak[1] = AnybodyProblemV4(previousAB).longestStreak(1);
            longestStreak[2] = AnybodyProblemV4(previousAB).longestStreak(2);
            mostGames[0] = AnybodyProblemV4(previousAB).mostGames(0);
            mostGames[1] = AnybodyProblemV4(previousAB).mostGames(1);
            mostGames[2] = AnybodyProblemV4(previousAB).mostGames(2);
        }

        updateSpeedrunsAddress(speedruns_);
        updateExternalMetadata(externalMetadata_);
        for (uint256 i = 0; i < verifiers_.length; i++) {
            require(verifiersTicks[i] > 0, 'Invalid verifier');
            require(verifiers_[i] != address(0), 'Invalid verifier');
            verifiers[verifiersBodies[i]][verifiersTicks[i]] = verifiers_[i];
        }
    }

    receive() external payable {
        revert('no receive thank you');
    }

    fallback() external {
        revert('no fallback thank you');
    }

    // ============ History reads (chains through previousAB) ============

    function runs(uint256 runId) public view returns (Run memory) {
        if (runs_[runId].owner == address(0)) {
            (bool success, bytes memory data) = previousAB.staticcall(
                abi.encodeWithSignature('runs(uint256)', runId)
            );
            if (success && data.length > 0) {
                Run memory r = abi.decode(data, (Run));
                Run memory run = Run({
                    owner: r.owner,
                    solved: r.solved,
                    accumulativeTime: r.accumulativeTime,
                    seed: r.seed,
                    day: r.day,
                    levels: getLevelsData(runId)
                });
                return run;
            } else {
                return runs_[runId];
            }
        } else {
            return runs_[runId];
        }
    }

    function gamesPlayed(address player) public view returns (Record memory) {
        Record memory record = gamesPlayed_[player];
        if (!record.updated) {
            (bool success, bytes memory data) = previousAB.staticcall(
                abi.encodeWithSignature('gamesPlayed(address)', player)
            );
            OldRecordType memory previousRecord;
            if (success && data.length > 0) {
                previousRecord = abi.decode(data, (OldRecordType));
            }
            Record memory combinedRecord = Record({
                updated: false,
                total: record.total + previousRecord.total,
                lastPlayed: previousRecord.lastPlayed,
                streak: previousRecord.streak
            });
            return combinedRecord;
        } else {
            return record;
        }
    }

    function fastestByDay(
        uint256 day
    ) public view returns (uint256[3] memory fastest) {
        uint256[3] memory localFastest = fastestByDay_[day];
        for (uint256 i = 0; i < 3; i++) {
            if (localFastest[i] == 0) {
                (bool success, bytes memory data) = previousAB.staticcall(
                    abi.encodeWithSignature(
                        'fastestByDay(uint256,uint256)',
                        day,
                        i
                    )
                );
                if (success && data.length > 0) {
                    fastest[i] = abi.decode(data, (uint256));
                }
            } else {
                fastest[i] = localFastest[i];
            }
        }
        return fastest;
    }

    function nextRunId() public view returns (uint256) {
        return runCount() + 1;
    }

    function runCount() public view returns (uint256) {
        return totalRuns;
    }

    function getLevelsData(
        uint256 runId
    ) public view returns (Level[] memory levels) {
        if (!runExists(runId)) {
            (bool success, bytes memory data) = previousAB.staticcall(
                abi.encodeWithSignature('getLevelsData(uint256)', runId)
            );
            if (success && data.length > 0) {
                return abi.decode(data, (Level[]));
            } else {
                return runs_[runId].levels;
            }
        } else {
            return runs_[runId].levels;
        }
    }

    function runExists(uint256 runId) public view returns (bool) {
        return runs_[runId].owner != address(0);
    }

    // ============ Game state generation ============

    function generateLevelData(
        uint256 day,
        uint256 level
    ) public view virtual returns (Body[6] memory bodyData, uint256 bodyCount) {
        for (uint256 i = 0; i <= level + 1; i++) {
            bytes32 dayLevelIndexSeed = getLevelSeed(day, level, i);
            bodyData[i] = getRandomValues(dayLevelIndexSeed, i, day);
        }
        bodyCount = level + 2;
    }

    function getLevelSeed(
        uint256 day,
        uint256 level,
        uint256 bodyIndex
    ) public pure returns (bytes32) {
        return keccak256(abi.encodePacked(day, level, bodyIndex));
    }

    function getRandomValues(
        bytes32 dayLevelIndexSeed,
        uint256 index,
        uint256 day
    ) public pure returns (Body memory) {
        Body memory body;

        body.bodyIndex = index;
        body.seed = dayLevelIndexSeed;

        body.radius = genRadius(index);

        bytes32 rand = keccak256(abi.encodePacked(dayLevelIndexSeed));
        body.px = randomRange(0, windowWidth, rand, day);

        rand = keccak256(abi.encodePacked(rand));
        body.py = randomRange(0, windowWidth, rand, day);

        rand = keccak256(abi.encodePacked(rand));
        body.vx = randomRange(
            maxVectorScaled / 2,
            (3 * maxVectorScaled) / 2,
            rand,
            day
        );

        rand = keccak256(abi.encodePacked(rand));
        body.vy = randomRange(
            maxVectorScaled / 2,
            (3 * maxVectorScaled) / 2,
            rand,
            day
        );

        return body;
    }

    function genRadius(uint256 index) public pure returns (uint256) {
        uint8[6] memory radii = [36, 30, 27, 24, 21, 18];
        return radii[index % radii.length] * scalingFactor;
    }

    function randomRange(
        uint256 min,
        uint256 max,
        bytes32 seed,
        uint256 day
    ) public pure returns (uint256) {
        uint256 fuckup = day == 1723766400 ? 0 : 1;
        if (min == max) {
            return min;
        } else if (min < max) {
            uint256 range = max - min + fuckup;
            return (uint256(seed) % range) + min;
        } else {
            uint256 range = 359 - (min - max + fuckup);
            uint256 output = uint256(seed) % range;
            if (output < max) {
                return output;
            } else {
                return min - max + output;
            }
        }
    }

    function currentLevel(uint256 runId) public view returns (uint256) {
        return getLevelsData(runId).length;
    }

    function generateSeed(
        uint256 id,
        uint256 index
    ) public view returns (bytes32) {
        return
            keccak256(abi.encodePacked(id, index, blockhash(block.number - 1)));
    }

    function currentDay() public view returns (uint256) {
        return block.timestamp - (block.timestamp % SECONDS_IN_A_DAY);
    }

    // ============ Run lifecycle ============

    function addNewLevelData(uint256 runId) internal {
        uint256 day = runs(runId).day;
        uint256 level = currentLevel(runId) + 1;
        Level memory levelData;
        levelData.seed = generateSeed(runId, level);
        (levelData.tmpBodyData, ) = generateLevelData(day, level);
        runs_[runId].levels.push(levelData);
        emit LevelCreated(runId, level, levelData.seed, day);
    }

    function addNewRun(uint256 day) internal returns (uint256 runId) {
        runId = nextRunId();
        Run memory run;
        run.owner = msg.sender;
        run.seed = generateSeed(runId, 0);
        run.day = day;
        runs_[runId] = run;
        totalRuns++;
        emit RunCreated(runId, day, run.seed);
        return runId;
    }

    struct VerifyLevelChunk {
        uint256 runId;
        uint256 tickCount;
        uint256 day;
        uint[2] a;
        uint[2][2] b;
        uint[2] c;
        uint[] input;
    }

    function verifyLevelChunk(VerifyLevelChunk memory v) internal {
        bytes32 proofHash = keccak256(abi.encodePacked(v.a, v.b, v.c, v.input));
        require(!usedProofs[proofHash], 'Proof already used');
        usedProofs[proofHash] = true;

        (uint256 intendedLevel, uint256 dummyCount) = getLevelFromInputs(
            v.input
        );
        uint256 level = currentLevel(v.runId);
        require(intendedLevel == level, 'Previous level not yet complete');

        Level[] memory levelsData = getLevelsData(v.runId);

        uint256 levelIndex = level - 1;
        require(!levelsData[levelIndex].solved, 'Level already solved');

        uint256 bodyCount = level + 2;
        address verifier = verifiers[bodyCount + dummyCount][v.tickCount];
        require(verifier != address(0), 'Invalid verifier, address == 0');
        require(
            address(uint160(v.input[5 + (bodyCount + dummyCount) * 5 + 1])) ==
                msg.sender,
            'Owner of this proof is not the sender'
        );

        uint256[5] memory storedOutflightMissile = levelsData[levelIndex]
            .tmpInflightMissile;
        uint256[5] memory newInflightMissile = [
            v.input[5 + 2 * (bodyCount + dummyCount) * 5 + 2 + 0],
            v.input[5 + 2 * (bodyCount + dummyCount) * 5 + 2 + 1],
            v.input[5 + 2 * (bodyCount + dummyCount) * 5 + 2 + 2],
            v.input[5 + 2 * (bodyCount + dummyCount) * 5 + 2 + 3],
            v.input[5 + 2 * (bodyCount + dummyCount) * 5 + 2 + 4]
        ];
        if (newInflightMissile[4] != 0) {
            bool matchesStoredOutflightMissile = storedOutflightMissile[0] ==
                newInflightMissile[0] &&
                storedOutflightMissile[1] == newInflightMissile[1] &&
                storedOutflightMissile[2] == newInflightMissile[2] &&
                storedOutflightMissile[3] == newInflightMissile[3] &&
                storedOutflightMissile[4] == newInflightMissile[4];

            bool newMissile = newInflightMissile[0] == 0 &&
                newInflightMissile[1] == windowWidth;
            require(
                newMissile || matchesStoredOutflightMissile,
                'Invalid inflightMissile'
            );
        }
        uint256[5] memory newOutflightMissile = [
            v.input[0],
            v.input[1],
            v.input[2],
            v.input[3],
            v.input[4]
        ];
        runs_[v.runId]
            .levels[levelIndex]
            .tmpInflightMissile = newOutflightMissile;
        levelsData[levelIndex].tmpInflightMissile = newOutflightMissile;

        verifyProof((bodyCount + dummyCount), verifier, v.a, v.b, v.c, v.input);

        Level memory levelData = levelsData[levelIndex];

        levelData.time += v.input[5 + (bodyCount + dummyCount) * 5];
        require(
            levelData.time <= maxTicksByLevelIndex[levelIndex],
            'Time limit exceeded'
        );

        uint256 bodiesGone;
        Body memory bodyData;
        for (uint256 i = 0; i < bodyCount; i++) {
            bodyData = levelData.tmpBodyData[i];

            verifyBodyDataMatches(
                bodyData,
                v.input,
                (bodyCount + dummyCount),
                i
            );
            bodyData = extractBodyData(bodyData, v.input, i);
            if (i == 0) {
                require(
                    bodyData.radius != 0,
                    'You shot the body you should protect'
                );
            }
            if (bodyData.radius == 0) {
                bodiesGone++;
            }
            levelData.tmpBodyData[i] = bodyData;
        }
        runs_[v.runId].levels[levelIndex] = levelData;
        if (bodiesGone == level + 1) {
            runs_[v.runId].levels[levelIndex].solved = true;
            emit LevelSolved(msg.sender, v.runId, level, levelData.time, v.day);
            runs_[v.runId].accumulativeTime += levelData.time;
            if (level == LEVELS) {
                runs_[v.runId].solved = true;
                gamesPlayed_[msg.sender].total++;
                addToLeaderboard(v.runId);
                emit RunSolved(
                    msg.sender,
                    v.runId,
                    runs_[v.runId].accumulativeTime,
                    v.day,
                    gamesPlayed(msg.sender).streak
                );
                // V5: every save mints an NFT and pays the flat playPrice
                _payAndMint(v.day);
            } else {
                addNewLevelData(v.runId);
            }
        }
    }

    function _payAndMint(uint256 day) internal {
        require(day == currentDay(), 'Can only mint on the current day');
        _seedDay(day);
        _payPlayPrice(msg.sender, day);
        Speedruns(speedruns).__mint(msg.sender, day, 1, '');
    }

    // Standalone NFT mint (no game played)
    function mint() public {
        require(!paused, 'Contract is paused');
        _payAndMint(currentDay());
    }

    function batchSolve(
        uint256 runId,
        uint256 day,
        uint256[] memory tickCounts,
        uint[2][] memory a,
        uint[2][2][] memory b,
        uint[2][] memory c,
        uint[][] memory input
    ) public {
        if (day == 0) {
            day = currentDay();
        }
        require(
            day % SECONDS_IN_A_DAY == 0,
            'One problem per day, invalid day'
        );
        require(day == currentDay(), 'V5 only allows current-day plays');
        require(!paused, 'Contract is paused');
        if (runId == 0) {
            runId = addNewRun(day);
            addNewLevelData(runId);
        }
        require(
            runs(runId).owner == msg.sender,
            'Only the owner of the run can solve it'
        );
        require(!runs(runId).solved, 'Run already solved');

        require(
            day == runs(runId).day,
            'Can only solve runs on the current day'
        );

        for (uint256 i = 0; i < input.length; i++) {
            verifyLevelChunk(
                VerifyLevelChunk({
                    runId: runId,
                    tickCount: tickCounts[i],
                    day: day,
                    a: a[i],
                    b: b[i],
                    c: c[i],
                    input: input[i]
                })
            );
        }
        if (!isTest) {
            require(
                runs(runId).solved,
                'Must solve all levels to complete run'
            );
        }
    }

    bool isTest = false;

    function setTest(bool test) public onlyOwner {
        isTest = test;
    }

    // ============ Leaderboard ============

    function addToLeaderboard(uint256 runId) internal {
        counterForOrdering++;
        addToFastestByDay(runId);
        addToLongestStreak(runId);
        addToMostPlayed();
    }

    function addToFastestByDay(uint256 runId) internal {
        Run memory run = runs(runId);
        uint256[3] memory f = fastestByDay(run.day);
        bool recordBroken;
        for (uint256 i = 0; i < 3; i++) {
            Run memory recordRun = runs(f[i]);
            if (
                run.accumulativeTime < recordRun.accumulativeTime ||
                recordRun.accumulativeTime == 0
            ) {
                recordBroken = true;
                for (uint256 j = fastestByDay(run.day).length - 1; j > i; j--) {
                    fastestByDay_[run.day][j] = fastestByDay(run.day)[j - 1];
                }
                fastestByDay_[run.day][i] = runId;
                break;
            }
        }
        if (recordBroken) {
            emitMetadataUpdate(run.day);
        }
    }

    function addToLongestStreak(uint256 runId) internal {
        uint256 day = runs(runId).day;
        if (day != currentDay()) {
            return;
        }
        Record memory record = gamesPlayed(msg.sender);
        if (record.lastPlayed + SECONDS_IN_A_DAY != day) {
            record.streak = 1;
        } else {
            record.streak++;
        }
        record.lastPlayed = day;
        if (!record.updated) {
            record.updated = true;
        }
        gamesPlayed_[msg.sender] = record;

        bool recordBroken;
        for (uint256 i = 0; i < longestStreak.length; i++) {
            Record memory previousLongestStreak = gamesPlayed(longestStreak[i]);
            if (record.streak > previousLongestStreak.streak) {
                recordBroken = true;
                for (uint256 j = longestStreak.length - 1; j > i; j--) {
                    longestStreak[j] = longestStreak[j - 1];
                }
                longestStreak[i] = msg.sender;
                break;
            }
        }
        if (recordBroken) {
            emitMetadataUpdate(day);
        }
    }

    function addToMostPlayed() internal {
        Record memory record = gamesPlayed(msg.sender);
        bool recordBroken;
        for (uint256 i = 0; i < mostGames.length; i++) {
            address player = mostGames[i];
            if (record.total > gamesPlayed(player).total) {
                recordBroken = true;
                for (uint256 j = mostGames.length - 1; j > i; j--) {
                    mostGames[j] = mostGames[j - 1];
                }
                mostGames[i] = msg.sender;
                break;
            }
        }
        if (recordBroken) {
            emitMetadataUpdate(currentDay());
        }
    }

    // ============ Prize pool ============

    function depositPrize(uint256 amount) external {
        require(amount > 0, 'Zero deposit');
        usdc.safeTransferFrom(msg.sender, address(this), amount);
        prefundedPrizePool += amount;
        emit PrizeDeposited(msg.sender, amount, prefundedPrizePool);
    }

    function claimDailyPrize(uint256 day) external {
        require(!paused, 'Contract is paused');
        require(day < currentDay(), 'Day not yet over');
        require(!dailyPoolClaimed[day], 'Already claimed');
        uint256[3] memory winners = fastestByDay(day);
        uint256 winningRunId = winners[0];
        require(winningRunId != 0, 'No winner for that day');
        Run memory winningRun = runs(winningRunId);
        require(winningRun.owner == msg.sender, 'Not the winner');
        uint256 amount = dailyPool[day];
        require(amount > 0, 'Empty pool');
        dailyPoolClaimed[day] = true;
        dailyPool[day] = 0;
        usdc.safeTransfer(msg.sender, amount);
        emit DailyPrizeClaimed(day, msg.sender, amount);
    }

    function _seedDay(uint256 day) internal {
        if (daySeeded[day]) return;
        daySeeded[day] = true;
        uint256 amount = dailyPrizeRate;
        if (amount > prefundedPrizePool) amount = prefundedPrizePool;
        if (amount > 0) {
            prefundedPrizePool -= amount;
            dailyPool[day] += amount;
            emit DailyPoolSeeded(day, amount);
        }
    }

    function _payPlayPrice(address payer, uint256 day) internal {
        if (playPrice == 0) return;
        usdc.safeTransferFrom(payer, address(this), playPrice);
        uint256 toRecipient = 0;
        if (proceedRate > 0 && proceedRecipient != address(0)) {
            toRecipient = (playPrice * proceedRate) / BPS_DENOMINATOR;
            if (toRecipient > 0) {
                usdc.safeTransfer(proceedRecipient, toRecipient);
            }
        }
        uint256 toPool = playPrice - toRecipient;
        dailyPool[day] += toPool;
        emit DailyPoolFunded(day, payer, toPool);
    }

    // ============ Interface for PaidSessions and other authorized writers ============

    modifier onlyAuthorizedWriter() {
        require(authorizedWriter[msg.sender], 'Not an authorized writer');
        _;
    }

    function setAuthorizedWriter(
        address writer,
        bool authorized
    ) external onlyOwner {
        authorizedWriter[writer] = authorized;
        emit AuthorizedWriterUpdated(writer, authorized);
    }

    function consumeProof(bytes32 proofHash) external onlyAuthorizedWriter {
        require(!paused, 'Contract is paused');
        require(!usedProofs[proofHash], 'Proof already used');
        usedProofs[proofHash] = true;
        emit ProofConsumed(msg.sender, proofHash);
    }

    function generateBody(
        uint256 seed,
        uint256 level,
        uint256 bodyIndex
    ) external pure returns (Body memory) {
        bytes32 dayLevelIndexSeed = keccak256(
            abi.encodePacked(seed, level, bodyIndex)
        );
        // PaidSessions has no per-day "fuckup" carve-out; pass 0 to ensure the
        // corrected (fuckup = 1) range is used consistently.
        return getRandomValues(dayLevelIndexSeed, bodyIndex, 0);
    }

    function verifyProofPublic(
        uint[2] calldata a,
        uint[2][2] calldata b,
        uint[2] calldata c,
        uint[] calldata input,
        uint256 bodyTotal,
        uint256 tickCount
    ) external view returns (bool) {
        address verifier = verifiers[bodyTotal][tickCount];
        require(verifier != address(0), 'Invalid verifier');
        if (bodyTotal == 4) {
            return
                Groth16Verifier4(verifier).verifyProof(
                    a,
                    b,
                    c,
                    convertTo52(input)
                );
        } else if (bodyTotal == 6) {
            return
                Groth16Verifier6(verifier).verifyProof(
                    a,
                    b,
                    c,
                    convertTo72(input)
                );
        }
        revert('Invalid number of bodies');
    }

    // ============ Proof / verifier helpers (carried) ============

    function extractBodyData(
        Body memory bodyData,
        uint[] memory input,
        uint256 i
    ) public pure returns (Body memory) {
        bodyData.px = input[5 + i * 5 + 0];
        bodyData.py = input[5 + i * 5 + 1];
        bodyData.vx = input[5 + i * 5 + 2];
        bodyData.vy = input[5 + i * 5 + 3];
        bodyData.radius = input[5 + i * 5 + 4];
        return bodyData;
    }

    function verifyBodyDataMatches(
        Body memory bodyData,
        uint[] memory input,
        uint256 bodyCount,
        uint256 i
    ) public pure {
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

    function verifyProof(
        uint256 bodyCount,
        address verifier,
        uint[2] memory a,
        uint[2][2] memory b,
        uint[2] memory c,
        uint[] memory input
    ) public view {
        if (bodyCount == 2 || bodyCount == 3 || bodyCount == 5) {
            revert('all proofs are 4 bodies or 6 bodies');
        } else if (bodyCount == 4) {
            require(
                Groth16Verifier4(verifier).verifyProof(
                    a,
                    b,
                    c,
                    convertTo52(input)
                ),
                'Invalid 4 body proof'
            );
        } else if (bodyCount == 6) {
            require(
                Groth16Verifier6(verifier).verifyProof(
                    a,
                    b,
                    c,
                    convertTo72(input)
                ),
                'Invalid 6 body proof'
            );
        } else {
            revert('Invalid number of bodies');
        }
    }

    function getLevelFromInputs(
        uint[] memory input
    ) public pure returns (uint256 bodyCount, uint256 dummyCount) {
        bodyCount = ((input.length - 12) / 10) - 1;
        dummyCount = 0;
        uint256 tally = 0;
        for (uint256 i = input.length - 1 - 5; i > input.length / 2; i--) {
            if (tally % 5 == 0) {
                if (
                    input[i] == 0 &&
                    input[i - 1] == 20000 &&
                    input[i - 2] == 20000 &&
                    input[i - 3] == 0 &&
                    input[i - 4] == 0
                ) {
                    dummyCount++;
                }
            }
            tally++;
        }
        return (bodyCount - dummyCount - 1, dummyCount);
    }

    function convertTo52(
        uint[] memory input
    ) public pure returns (uint[52] memory) {
        uint[52] memory input_;
        for (uint256 i = 0; i < 52; i++) {
            input_[i] = input[i];
        }
        return input_;
    }

    function convertTo72(
        uint[] memory input
    ) public pure returns (uint[72] memory) {
        uint[72] memory input_;
        for (uint256 i = 0; i < 72; i++) {
            input_[i] = input[i];
        }
        return input_;
    }

    // ============ Speedruns NFT helpers ============

    function speedrunsSupportsInterface(
        bytes4 interfaceId
    ) public pure returns (bool) {
        return
            interfaceId == type(IERC165).interfaceId ||
            interfaceId == type(IERC1155).interfaceId ||
            interfaceId == type(IERC1155MetadataURI).interfaceId ||
            interfaceId == type(IERC2981).interfaceId ||
            interfaceId == bytes4(0x49064906);
    }

    function speedrunsTokenURI(uint256 id) public view returns (string memory) {
        return ExternalMetadata(externalMetadata).getMetadata(id);
    }

    function emitBatchMetadataUpdate() public onlyOwner {
        bytes32 topic = keccak256('BatchMetadataUpdate(uint256,uint256)');
        uint256 today = currentDay();
        bytes memory data = abi.encode(0, today);
        bytes32[] memory topics = new bytes32[](1);
        topics[0] = topic;
        Speedruns(speedruns).emitGenericEvent(topics, data);
    }

    function emitMetadataUpdate(uint256 tokenId) internal {
        // Reserved for ERC-4906 single-token metadata updates if needed.
    }

    // ============ Owner setters ============

    function updateExternalMetadata(
        address externalMetadata_
    ) public onlyOwner {
        externalMetadata = externalMetadata_;
    }

    function updatePreviousAB(address payable previousAB_) public onlyOwner {
        previousAB = previousAB_;
    }

    function updateProceedRecipient(
        address payable proceedRecipient_
    ) public onlyOwner {
        proceedRecipient = proceedRecipient_;
    }

    function updateProceedRate(uint256 proceedRate_) public onlyOwner {
        require(proceedRate_ <= BPS_DENOMINATOR, 'Rate exceeds 100%');
        proceedRate = proceedRate_;
    }

    function updateSpeedrunsAddress(
        address payable speedruns_
    ) public onlyOwner {
        speedruns = speedruns_;
    }

    function updateUSDC(address usdc_) public onlyOwner {
        require(usdc_ != address(0), 'Invalid USDC');
        usdc = IERC20(usdc_);
    }

    function updateVerifier(
        address verifier_,
        uint256 verifierBodies,
        uint256 verifierTicks
    ) public onlyOwner {
        verifiers[verifierBodies][verifierTicks] = verifier_;
    }

    function updatePlayPrice(uint256 playPrice_) public onlyOwner {
        playPrice = playPrice_;
    }

    function updateDailyPrizeRate(uint256 dailyPrizeRate_) public onlyOwner {
        dailyPrizeRate = dailyPrizeRate_;
    }

    function updatePaused(bool paused_) public onlyOwner {
        paused = paused_;
    }

    /// @dev If ETH is accidentally trapped in the contract, admin can recover.
    function recoverUnsuccessfulPayment(address payable _to) public onlyOwner {
        uint256 amount = address(this).balance;
        (bool sent, bytes memory data) = _to.call{value: amount}('');
        emit EthMoved(_to, sent, data, amount);
    }
}
