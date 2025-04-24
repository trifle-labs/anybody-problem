// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import {Groth16Verifier as Groth16Verifier4} from './Game_4_20Verifier.sol';
import {Groth16Verifier as Groth16Verifier6} from './Game_6_20Verifier.sol';

import '@openzeppelin/contracts/token/common/ERC2981.sol';
import '@openzeppelin/contracts/access/Ownable.sol';
import '@openzeppelin/contracts/token/ERC1155/ERC1155.sol';
import './Speedruns.sol';
import './ExternalMetadata.sol';
import './Tournament.sol';
import './AnybodyProblemV2.sol';
import 'hardhat/console.sol';

contract AnybodyProblemV4 is Ownable, ERC2981 {
    uint256 public constant LEVELS = 4;
    uint256 public constant SECONDS_IN_A_DAY = 86400;
    uint256 public constant FIRST_SUNDAY_AT_6_PM_UTC = 324000;

    bool public paused = false;
    uint256 public priceToMint = 0.0025 ether;
    uint256 public priceToSave = 0 ether;
    uint256 public discount = 5; // should result in price of 0.0025 / 5 = 0.0005

    uint256 public constant FIRST_DAY = 1723766400; // Fri Aug 16 2024 00:00:00 GMT+0000
    uint256 public deployDay;
    address payable public previousAB;
    address payable public proceedRecipient;
    address public externalMetadata;
    address payable public speedruns;
    address payable public tournament;

    uint256 public counterForOrdering;

    // uint256 public constant maxTick = 25 * 60; // 25 fps * 60 sec = 1,500 ticks max
    // level duration is numberOfBaddies * 10sec (multiplied by 25 because of 25 FPS)
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
        bool solved; // redundant by accumulating A
        uint256 accumulativeTime; // redundant by accumulating C
        bytes32 seed;
        uint256 day;
        Level[] levels;
    }
    struct RunWithoutLevels {
        address owner;
        bool solved; // redundant by accumulating A
        uint256 accumulativeTime; // redundant by accumulating C
        bytes32 seed;
        uint256 day;
    }
    struct Level {
        bool solved; // redundant A
        uint256 time; // redundant C
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

    mapping(uint256 => uint256[3]) public fastestByDay_; // day => [fastest, 2nd fastest, 3rd fastest runId]
    mapping(uint256 => uint256[3]) public slowestByDay_; // day => [slowest, 2nd slowest, 3rd slowest runId]
    address[3] public mostGames;
    address[3] public longestStreak;

    mapping(uint256 => mapping(address => bool)) public claimedByLeader; // day => player => claimed
    mapping(address => Record) public gamesPlayed_;
    mapping(uint256 => Run) public runs_; // indexed on RunId
    uint256 public totalRuns;

    // mapping is body count to tickcount to address
    mapping(uint256 => mapping(uint256 => address)) public verifiers;
    mapping(bytes32 => bool) public usedProofs;

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
    event EthMoved(
        address indexed to,
        bool indexed success,
        bytes returnData,
        uint256 amount
    );

    constructor(
        address payable proceedRecipient_,
        address payable speedruns_,
        address externalMetadata_,
        address payable tournament_,
        address[] memory verifiers_,
        uint256[] memory verifiersTicks,
        uint256[] memory verifiersBodies,
        address payable previousAB_
    ) {
        deployDay = currentDay();
        updatePreviousAB(previousAB_);
        if (previousAB != address(0)) {
            totalRuns = AnybodyProblemV2(previousAB).runCount();
            longestStreak[0] = AnybodyProblemV2(previousAB).longestStreak(0);
            longestStreak[1] = AnybodyProblemV2(previousAB).longestStreak(1);
            longestStreak[2] = AnybodyProblemV2(previousAB).longestStreak(2);
            mostGames[0] = AnybodyProblemV2(previousAB).mostGames(0);
            mostGames[1] = AnybodyProblemV2(previousAB).mostGames(1);
            mostGames[2] = AnybodyProblemV2(previousAB).mostGames(2);
        }

        updateProceedRecipient(proceedRecipient_);
        updateSpeedrunsAddress(speedruns_);
        updateExternalMetadata(externalMetadata_);
        updateTournamentAddress(tournament_);
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

    function slowestByDay(uint256 day) public view returns (uint256[3] memory) {
        return slowestByDay_[day];
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

    function generateLevelData(
        uint256 day,
        uint256 level
    ) public view virtual returns (Body[6] memory bodyData, uint256 bodyCount) {
        // NOTE: <= becuase level 5 has 6 bodies
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
        // NOTE: this function uses a seed consisting of the day + bodyIndex which means
        // that all problems of the same level on the same day will have bodies with the same
        // positions, velocities and radii.
        Body memory body;

        body.bodyIndex = index;
        body.seed = dayLevelIndexSeed;

        body.radius = genRadius(index);

        bytes32 rand = keccak256(abi.encodePacked(dayLevelIndexSeed));
        body.px = randomRange(0, windowWidth, rand, day);

        rand = keccak256(abi.encodePacked(rand));
        body.py = randomRange(0, windowWidth, rand, day);

        rand = keccak256(abi.encodePacked(rand));
        // this is actually a range of -1/2 to 1/2 of maxVector since negative offset
        // -maxVector = 0
        // 0 = maxVector
        // maxVector = 2 * maxVector
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
        uint8[6] memory radii = [36, 30, 27, 24, 21, 18]; // n * 4 + 2
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
        // new Run ID is length of run array. at start it is 1. so first run is 1, then array is 2.
        // After new deploy, the length of the initial deploy array will be 2. The new array should be 0
        // and then the new ID will be previous length + new length (2)
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
        bool alsoMint;
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

        // confirm current inflightMissile == previous outflightMissile
        // or confirm that curren inflightMissile (x, y) == (0, windowHeight)
        uint256[5] memory storedOutflightMissile = levelsData[levelIndex]
            .tmpInflightMissile;
        uint256[5] memory newInflightMissile = [
            v.input[5 + 2 * (bodyCount + dummyCount) * 5 + 2 + 0],
            v.input[5 + 2 * (bodyCount + dummyCount) * 5 + 2 + 1],
            v.input[5 + 2 * (bodyCount + dummyCount) * 5 + 2 + 2],
            v.input[5 + 2 * (bodyCount + dummyCount) * 5 + 2 + 3],
            v.input[5 + 2 * (bodyCount + dummyCount) * 5 + 2 + 4]
        ];
        // if there is an inflight missile, it either needs to match the outflight or start
        // from the corner
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
        // update inflightMissile with new outflight missile
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

        // uint256 time = v.input[5 + (bodyCount + dummyCount) * 5];

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
                if (v.alsoMint) {
                    bool playerIsLeader = isLeader(v.runId);
                    uint256 priceToPay = playerIsLeader
                        ? 0
                        : priceToSave + (priceToMint / discount);
                    if (playerIsLeader) {
                        claimedByLeader[v.day][msg.sender] = true;
                    }
                    mint(priceToPay, v.day);
                } else if (priceToSave > 0) {
                    makePayment(priceToSave);
                }
            } else {
                addNewLevelData(v.runId);
            }
        }
    }

    function makePayment(uint256 payment) internal {
        require(msg.value >= payment, 'Incorrect payment');
        require(proceedRecipient != address(0), 'Invalid recipient');
        (bool sent, bytes memory data) = proceedRecipient.call{value: payment}(
            ''
        );
        emit EthMoved(proceedRecipient, sent, data, payment);
        if (msg.value > payment) {
            (sent, data) = msg.sender.call{value: msg.value - payment}('');
            emit EthMoved(msg.sender, sent, data, msg.value - payment);
        }
    }

    function mint(uint256 payment, uint256 day) internal {
        require(day == currentDay(), 'Can only mint on the current day');
        Speedruns(speedruns).__mint(msg.sender, day, 1, '');
        makePayment(payment);
    }

    // NOTE: mint and batchSolve are the only publicly available functions

    function mint() public payable {
        require(!paused, 'Contract is paused');
        mint(priceToMint, currentDay());
    }

    function batchSolve(
        uint256 runId,
        bool alsoMint,
        uint256 day,
        uint256[] memory tickCounts,
        uint[2][] memory a,
        uint[2][2][] memory b,
        uint[2][] memory c,
        uint[][] memory input
    ) public payable {
        if (day == 0) {
            day = currentDay();
        }
        require(
            day % SECONDS_IN_A_DAY == 0,
            'One problem per day, invalid day'
        );
        // TODO: confirm whether we want to only allow range of days
        // require(day >= FIRST_DAY, 'Day is too early');
        require(day <= currentDay(), 'Cannot solve future problems');
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
                    alsoMint: alsoMint,
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

    function addToLeaderboard(uint256 runId) internal {
        counterForOrdering++;
        addToFastestByDay(runId);
        addToLongestStreak(runId);
        addToMostPlayed();
        addToSlowestByDay(runId);
        // Tournament(tournament).addToLeaderboard(runId);
    }

    function isLeader(uint256 runId) public view returns (bool) {
        if (claimedByLeader[runs(runId).day][msg.sender]) {
            return false;
        }
        // fastest
        uint256[3] memory f = fastestByDay(runs(runId).day);
        if (f[0] == runId) {
            return true;
        }
        // slowest
        uint256[3] memory s = slowestByDay(runs(runId).day);
        if (s[0] == runId) {
            return true;
        }
        // TODO: decide if we want to add this?
        // // most played
        // if (mostGames[0] == msg.sender) {
        //     return true;
        // }
        // longest streak
        if (longestStreak[0] == msg.sender) {
            return true;
        }
        return false;
    }

    function addToSlowestByDay(uint256 runId) internal {
        Run memory run = runs(runId);
        uint256[3] memory s = slowestByDay(run.day);
        bool recordBroken;
        for (uint256 i = 0; i < 3; i++) {
            Run memory recordRun = runs(s[i]);
            // if run is slower, or if previous run is unset
            if (run.accumulativeTime > recordRun.accumulativeTime) {
                recordBroken = true;
                for (uint256 j = slowestByDay(run.day).length - 1; j > i; j--) {
                    slowestByDay_[run.day][j] = slowestByDay(run.day)[j - 1];
                }
                slowestByDay_[run.day][i] = runId;
                break;
            }
        }
        if (recordBroken) {
            emitMetadataUpdate(run.day);
        }
    }

    function addToFastestByDay(uint256 runId) internal {
        Run memory run = runs(runId);
        uint256[3] memory f = fastestByDay(run.day);
        bool recordBroken;
        for (uint256 i = 0; i < 3; i++) {
            Run memory recordRun = runs(f[i]);
            // if run is faster, or if previous run is unset
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
            // if the run was not completed today, don't update the streak
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
        // px
        // confirm previously stored values were used as input to the proof
        // uint256 pxIndex = 5 * bodyCount + i * 5 + 0 + 1 (for time);
        require(
            bodyData.px == input[5 + 5 * bodyCount + i * 5 + 0 + 2],
            'Invalid position x'
        );
        // py
        // confirm previously stored values were used as input to the proof
        // uint256 pyIndex = 5 * bodyCount + i * 5 + 1 + 1 (for time);
        require(
            bodyData.py == input[5 + 5 * bodyCount + i * 5 + 1 + 2],
            'Invalid position y'
        );
        // vx
        // confirm previously stored values were used as input to the proof
        // uint256 vxIndex = 5 * bodyCount + i * 5 + 2 + 1 (for time);
        require(
            bodyData.vx == input[5 + 5 * bodyCount + i * 5 + 2 + 2],
            'Invalid vector x'
        );
        // vy
        // confirm previously stored values were used as input to the proof
        // uint256 vyIndex = 5 * bodyCount + i * 5 + 3 + 1 (for time);
        require(
            bodyData.vy == input[5 + 5 * bodyCount + i * 5 + 3 + 2],
            'Invalid vector y'
        );
        // radius
        // confirm previously stored values were used as input to the proof
        // uint256 radiusIndex = 5 * bodyCount + i * 5 + 4 + 1 (for time);
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
        // 0—4: missile output
        // 5—9: body 1 output
        // 10—14: body 2 output
        // 15: time output (5 + bodyCount * 5 + 1)
        // 16: address input (5 + bodyCount * 5 + 2)
        // 17—21: body 1 input
        // 22—26: body 2 input
        // 27—31: missile input (5 + 2 * bodyCount * 5 + 2)

        // inputLength = bodyCount * 5 * 2 + 1 + 1 + 5 + 5;
        // inputLength = 10 * bodyCount + 12;
        // 10 * bodyCount = inputLength - 12;
        bodyCount = ((input.length - 12) / 10) - 1;
        dummyCount = 0;
        uint256 tally = 0;
        // start i at end of input array but before the final 5 elements of the missile input
        // count backwards checking every 5 whether a body is completely empty
        // if so consider this a "dummy" body and remove it from the count
        for (uint256 i = input.length - 1 - 5; i > input.length / 2; i--) {
            if (tally % 5 == 0) {
                if (
                    input[i] == 0 && // radius
                    input[i - 1] == 20000 && // vy
                    input[i - 2] == 20000 && // vx
                    input[i - 3] == 0 && // py
                    input[i - 4] == 0 // px
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

    // Speedruns NFT functions

    function speedrunsSupportsInterface(
        bytes4 interfaceId
    ) public pure returns (bool) {
        return
            interfaceId == type(IERC165).interfaceId ||
            interfaceId == type(IERC1155).interfaceId ||
            interfaceId == type(IERC1155MetadataURI).interfaceId ||
            interfaceId == type(IERC2981).interfaceId ||
            interfaceId == bytes4(0x49064906); // IERC4906 MetadataUpdate
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
        // bytes32 topic = keccak256('MetadataUpdate(uint256)');
        // bytes memory data = abi.encode(tokenId);
        // bytes32[] memory topics = new bytes32[](1);
        // topics[0] = topic;
        // Speedruns(speedruns).emitGenericEvent(topics, data);
    }

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

    function updateSpeedrunsAddress(
        address payable speedruns_
    ) public onlyOwner {
        speedruns = speedruns_;
    }

    function updateTournamentAddress(
        address payable tournament_
    ) public onlyOwner {
        tournament = tournament_;
    }

    function updateVerifier(
        address verifier_,
        uint256 verifierBodies,
        uint256 verifierTicks
    ) public onlyOwner {
        verifiers[verifierBodies][verifierTicks] = verifier_;
    }

    /// @dev if mint fails to send eth to splitter, admin can recover
    // This should not be necessary but Berlin hardfork broke split before so this
    // is extra precaution.
    function recoverUnsuccessfulPayment(address payable _to) public onlyOwner {
        uint256 amount = address(this).balance;
        (bool sent, bytes memory data) = _to.call{value: amount}('');
        emit EthMoved(_to, sent, data, amount);
    }

    function updateDiscount(uint256 discount_) public onlyOwner {
        discount = discount_;
    }

    function updatePriceToSave(uint256 priceToSave_) public onlyOwner {
        priceToSave = priceToSave_;
    }

    function updatePriceToMint(uint256 priceToMint_) public onlyOwner {
        priceToMint = priceToMint_;
    }

    function updatePaused(bool paused_) public onlyOwner {
        paused = paused_;
    }
}
