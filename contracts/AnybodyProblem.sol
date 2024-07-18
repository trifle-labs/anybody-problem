// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import {Groth16Verifier as Groth16Verifier2} from "./Game_2_20Verifier.sol";
import {Groth16Verifier as Groth16Verifier3} from "./Game_3_20Verifier.sol";
import {Groth16Verifier as Groth16Verifier4} from "./Game_4_20Verifier.sol";
import {Groth16Verifier as Groth16Verifier5} from "./Game_5_20Verifier.sol";
import {Groth16Verifier as Groth16Verifier6} from "./Game_6_20Verifier.sol";

import "@openzeppelin/contracts/token/common/ERC2981.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "./Speedruns.sol";
import "./ExternalMetadata.sol";

contract AnybodyProblem is Ownable, ERC2981 {

  uint256 public constant LEVELS = 5;
  uint256 public constant SECONDS_IN_A_DAY = 86400;
  uint256 public constant SECONDS_IN_A_WEEK = SECONDS_IN_A_DAY * 7;
  uint256 public constant FIRST_SUNDAY_AT_6_PM_UTC = 324000;

  bool public paused = false;
  uint256 public price = 0.0025 ether;
  address payable public proceedRecipient;
  address public externalMetadata;
  address payable public speedruns;
  // uint256 public constant maxTick = 25 * 60; // 25 fps * 60 sec = 1,500 ticks max
  // level duration is numberOfBaddies * 10sec (multiplied by 25 because of 25 FPS)
  uint256[5] public maxTicksByLevelIndex = [1 * 10 * 25, 2 * 10 * 25, 3 * 10 * 25, 4 * 10 * 25, 5 * 10 * 25];
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

  mapping(uint256 => uint256[3]) public fastestByDay; // day => [fastest, 2nd fastest, 3rd fastest runId]
  address[3] public mostGames;
  address[3] public longestStreak;

  struct Record {
    uint256 total;
    uint256 lastPlayed;
    uint256 streak;
  }
  mapping(address => Record) public gamesPlayed;
  mapping(address => mapping(uint256 => uint256[7])) public weeklyRecords;
  mapping(uint256 => address[3]) public fastestByWeek;

  // NOTE: initialize with length of 1 so Runs are not 0 indexed (runId == index of the run array)
  Run[] public runs = new Run[](1);

  // mapping is body count to tickcount to address
  mapping(uint256 => mapping(uint256 => address)) public verifiers;

  constructor(
    address payable proceedRecipient_,
    address payable speedruns_,
    address externalMetadata_,
    address[] memory verifiers_,
    uint256[] memory verifiersTicks,
    uint256[] memory verifiersBodies) 
  {
    updateExternalMetadata(externalMetadata_);
    updateProceedRecipient(proceedRecipient_);
    updateSpeedrunsAddress(speedruns_);
    for (uint256 i = 0; i < verifiers_.length; i++) {
      require(verifiersTicks[i] > 0, "Invalid verifier");
      require(verifiers_[i] != address(0), "Invalid verifier");
      verifiers[verifiersBodies[i]][verifiersTicks[i]] = verifiers_[i];
    }
  }

  receive() external payable {
    revert('no receive thank you');
  }
  fallback() external {
    revert('no fallback thank you');
  }

  event RunCreated(
    uint256 runId,
    uint256 day,
    bytes32 seed
  );
  event RunSolved(
    address indexed player,
    uint256 indexed runId,
    uint256 accumulativeTime,
    uint256 day
  );
  event LevelCreated(
    uint256 runId,
    uint256 level,
    bytes32 seed,
    uint256 day
  );
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

  // NOTE: the only publicly available function that isn't protected by a modifier
  function batchSolve(uint256 runId, uint256[] memory tickCounts, uint[2][] memory a, uint[2][2][] memory b, uint[2][] memory c, uint[][] memory input) public payable {
      require(!paused, "Contract is paused");
      uint256 day = currentDay();
      if (runId == 0) {
          runId = addNewRun(day);
          addNewLevelData(runId);
      }
      require(runs[runId].owner == msg.sender, "Only the owner of the run can solve it");
      require(!runs[runId].solved, "Run already solved");

      require(day == runs[runId].day, "Can only solve runs on the current day");

      for(uint256 i = 0; i < input.length; i++) {
          verifyLevelChunk(runId, tickCounts[i], day, a[i], b[i], c[i], input[i]);
      }
      // TODO: decide whether this is necessary
      // require(runs[runId].solved, "Must solve all levels to complete run");

      // TODO: make a hash of all proof data to ensure this proof hasn't been used before
  }
  function runCount() public view returns (uint256) {
    return runs.length - 1;
  }
  function getLevelsData(uint256 runId) public view returns(Level[] memory levels) {
    return runs[runId].levels;
  }
  function generateLevelData(uint256 day, uint256 level) public view virtual returns (Body[6] memory bodyData, uint256 bodyCount) {
    // NOTE: <= becuase level 5 has 6 bodies
    for (uint256 i = 0; i <= level; i++) {
      bytes32 dayLevelIndexSeed = getLevelSeed(day, level, i);
      bodyData[i] = getRandomValues(dayLevelIndexSeed, i);
    }
    bodyCount = level + 1;
  }
  function getLevelSeed(uint256 day, uint256 level, uint256 bodyIndex) public pure returns (bytes32) {
      return keccak256(abi.encodePacked(day, level, bodyIndex));
  }
  function getRandomValues(bytes32 dayLevelIndexSeed, uint256 index) public pure returns (Body memory) {
      // NOTE: this function uses a seed consisting of the day + bodyIndex which means 
      // that all problems of the same level on the same day will have bodies with the same 
      // positions, velocities and radii.
      Body memory body;

      body.bodyIndex = index;
      body.seed = dayLevelIndexSeed;

      body.radius = genRadius(index);

      bytes32 rand = keccak256(abi.encodePacked(dayLevelIndexSeed));
      body.px = randomRange(0, windowWidth, rand);

      rand = keccak256(abi.encodePacked(rand));
      body.py = randomRange(0, windowWidth, rand);

      rand = keccak256(abi.encodePacked(rand));
      // this is actually a range of -1/2 to 1/2 of maxVector since negative offset
      // -maxVector = 0
      // 0 = maxVector
      // maxVector = 2 * maxVector
      body.vx = randomRange(maxVectorScaled / 2, 3 * maxVectorScaled / 2, rand);

      rand = keccak256(abi.encodePacked(rand));
      body.vy = randomRange(maxVectorScaled / 2, 3 * maxVectorScaled / 2, rand);

      return body;
  }
  function genRadius(uint256 index) public pure returns (uint256) {
      uint8[6] memory radii = [36, 27, 22, 17, 12, 7]; // n * 5 + 2
      return radii[index % radii.length] * scalingFactor;
  }
  function randomRange(uint256 min,uint256 max, bytes32 rand) public pure returns (uint256) {
      return min + (uint256(rand) % (max - min));
  }
  function currentLevel(uint256 runId) public view returns (uint256) {
      return runs[runId].levels.length;
  }
  function generateSeed(uint256 id, uint256 index) public view returns (bytes32) {
      return keccak256(abi.encodePacked(id, index, blockhash(block.number - 1)));
  }
  // TODO: fix day and week so that days and week begin at same time
  function currentWeek() public view returns (uint256) {
    return block.timestamp - ((block.timestamp - FIRST_SUNDAY_AT_6_PM_UTC) % SECONDS_IN_A_WEEK);
  }
  function timeUntilEndOfWeek() public view returns(uint256) {
    return currentWeek() + SECONDS_IN_A_WEEK - block.timestamp;
  }
  function currentDay() public view returns (uint256) {
      return block.timestamp - (block.timestamp % SECONDS_IN_A_DAY);
  }
  function addNewLevelData(uint256 runId) internal {
    uint256 day = runs[runId].day;
    uint256 level = currentLevel(runId) + 1;
    Level memory levelData;
    levelData.seed = generateSeed(runId, level);
    (levelData.tmpBodyData, ) = generateLevelData(day, level);
    runs[runId].levels.push(levelData);
    emit LevelCreated(runId, level, levelData.seed, day);
  }
  function addNewRun(uint256 day) internal returns (uint256 runId) {
    runId = runs.length;
    Run memory run;
    run.owner = msg.sender;
    run.seed = generateSeed(runId, 0);
    run.day = day;
    runs.push(run);
    emit RunCreated(runId, day, run.seed);
    return runId;
  }
  function verifyLevelChunk(uint256 runId, uint256 tickCount, uint256 day, uint[2] memory a, uint[2][2] memory b, uint[2] memory c, uint[] memory input) internal {
    (uint256 intendedLevel, uint256 dummyCount) = getLevelFromInputs(input);
    uint256 level = currentLevel(runId);

    require(intendedLevel == level, "Previous level not yet complete");

    uint256 levelIndex = level - 1;
    require(!runs[runId].levels[levelIndex].solved, "Level already solved");
    
    uint256 bodyCount = level + 1;
    address verifier = verifiers[bodyCount + dummyCount][tickCount];
    require(verifier != address(0), "Invalid verifier");
    require(address(uint160(input[5 + (bodyCount + dummyCount) * 5 + 1])) == msg.sender, "Owner of this proof is not the sender");

    // confirm current inflightMissile == previous outflightMissile
    // or confirm that curren inflightMissile (x, y) == (0, windowHeight)
    uint256[5] memory storedOutflightMissile = runs[runId].levels[levelIndex].tmpInflightMissile;
    uint256[5] memory newInflightMissile = [
        input[5 + 2 * (bodyCount + dummyCount) * 5 + 2 + 0],
        input[5 + 2 * (bodyCount + dummyCount) * 5 + 2 + 1],
        input[5 + 2 * (bodyCount + dummyCount) * 5 + 2 + 2],
        input[5 + 2 * (bodyCount + dummyCount) * 5 + 2 + 3],
        input[5 + 2 * (bodyCount + dummyCount) * 5 + 2 + 4]
    ];
    // if there is an inflight missile, it either needs to match the outflight or start
    // from the corner
    if (newInflightMissile[4] != 0) {
        bool matchesStoredOutflightMissile =  storedOutflightMissile[0] == newInflightMissile[0] &&
                                              storedOutflightMissile[1] == newInflightMissile[1] &&
                                              storedOutflightMissile[2] == newInflightMissile[2] &&
                                              storedOutflightMissile[3] == newInflightMissile[3] &&
                                              storedOutflightMissile[4] == newInflightMissile[4];

        bool newMissile = newInflightMissile[0] == 0 && newInflightMissile[1] == windowWidth;
        require(newMissile || matchesStoredOutflightMissile, "Invalid inflightMissile");
    }
    // update inflightMissile with new outflight missile
    uint256[5] memory newOutflightMissile = [
        input[0],
        input[1],
        input[2],
        input[3],
        input[4]
    ];
    runs[runId].levels[levelIndex].tmpInflightMissile = newOutflightMissile;

    uint256 time = input[5 + (bodyCount + dummyCount) * 5];

    verifyProof((bodyCount + dummyCount), verifier, a, b, c, input);

    Level memory levelData = runs[runId].levels[levelIndex];

    levelData.time += time;
    require(levelData.time <= maxTicksByLevelIndex[levelIndex], "Time limit exceeded");

    uint256 bodiesGone;
    Body memory bodyData;
    for (uint256 i = 0; i < bodyCount; i++) {
        bodyData = levelData.tmpBodyData[i];

        verifyBodyDataMatches(bodyData, input, (bodyCount + dummyCount), i);
        bodyData = extractBodyData(bodyData, input, i);

        if (i == 0) {
          require(bodyData.radius != 0, "You shot the body you should protect");
        }
        if (bodyData.radius == 0) {
            bodiesGone++;
        }
        levelData.tmpBodyData[i] = bodyData;
    }
    runs[runId].levels[levelIndex] = levelData;

    if (bodiesGone == level) {
      runs[runId].levels[levelIndex].solved = true;
      emit LevelSolved(msg.sender, runId, level, levelData.time, day);
      runs[runId].accumulativeTime += levelData.time;
      if (level == LEVELS) {
        runs[runId].solved = true;
        require(msg.value == price, "Incorrect payment");
        (bool sent, bytes memory data) = proceedRecipient.call{
            value: msg.value
        }("");
        Speedruns(speedruns).__mint(msg.sender, day, 1, "");
        emit EthMoved(proceedRecipient, sent, data, msg.value);
        emit RunSolved(msg.sender, runId, runs[runId].accumulativeTime, day);
        gamesPlayed[msg.sender].total++;
        addToLeaderboard(runId);

      } else {
        addNewLevelData(runId);
      }
    }
  }
  function addToLeaderboard(uint256 runId) internal {
    addToFastestByDay(runId);
    addToLongestStreak(runId);
    addToMostPlayed();
  }
  function addToLongestStreak(uint256 runId) internal {
    uint256 day = runs[runId].day;
    Record memory record = gamesPlayed[msg.sender];
    if (record.lastPlayed + SECONDS_IN_A_DAY != day) {
      record.streak = 1;
    } else {
      record.streak++;
    }
    record.lastPlayed = day;
    gamesPlayed[msg.sender] = record;

    for (uint256 i = 0; i < longestStreak.length; i++) {
      if (record.streak > gamesPlayed[longestStreak[i]].streak) {
        for (uint256 j = longestStreak.length - 1; j > i; j--) {
          longestStreak[j] = longestStreak[j - 1];
        }
        longestStreak[i] = msg.sender;
        break;
      }
    }
  }
  function addToMostPlayed() internal {
    Record memory record = gamesPlayed[msg.sender];
    for (uint256 i = 0; i < mostGames.length; i++) {
      if (record.total > gamesPlayed[mostGames[i]].total) {
        for (uint256 j = mostGames.length - 1; j > i; j--) {
          mostGames[j] = mostGames[j - 1];
        }
        mostGames[i] = msg.sender;
        break;
      }
    }
  }
  function addToFastestByDay(uint256 runId) internal {
    Run memory run = runs[runId];
    for (uint256 i = 0; i < fastestByDay[run.day].length; i++) {
      Run memory recordRun = runs[fastestByDay[run.day][i]];
      // if run is faster, or if previous run is unset
      if (run.accumulativeTime < recordRun.accumulativeTime || recordRun.accumulativeTime == 0) {
        for (uint256 j = fastestByDay[run.day].length - 1; j > i; j--) {
          fastestByDay[run.day][j] = fastestByDay[run.day][j - 1];
        }
        fastestByDay[run.day][i] = runId;
        emitMetadataUpdate(run.day);
        break;
      }
    }
  }
  function extractBodyData(Body memory bodyData, uint[] memory input, uint256 i) public pure returns (Body memory){
    bodyData.px = input[5 + i * 5 + 0];
    bodyData.py = input[5 + i * 5 + 1];
    bodyData.vx = input[5 + i * 5 + 2];
    bodyData.vy = input[5 + i * 5 + 3];
    bodyData.radius = input[5 + i * 5 + 4];
    return bodyData;
  }
  function verifyBodyDataMatches(Body memory bodyData, uint[] memory input, uint256 bodyCount, uint256 i) public pure {
    // px
    // confirm previously stored values were used as input to the proof
    // uint256 pxIndex = 5 * bodyCount + i * 5 + 0 + 1 (for time);
    require(
        bodyData.px == input[5 + 5 * bodyCount + i * 5 + 0 + 2],
        "Invalid position x"
    );
    // py
    // confirm previously stored values were used as input to the proof
    // uint256 pyIndex = 5 * bodyCount + i * 5 + 1 + 1 (for time);
    require(
        bodyData.py == input[5 + 5 * bodyCount + i * 5 + 1 + 2],
        "Invalid position y"
    );
    // vx
    // confirm previously stored values were used as input to the proof
    // uint256 vxIndex = 5 * bodyCount + i * 5 + 2 + 1 (for time);
    require(
        bodyData.vx == input[5 + 5 * bodyCount + i * 5 + 2 + 2],
        "Invalid vector x"
    );
    // vy
    // confirm previously stored values were used as input to the proof
    // uint256 vyIndex = 5 * bodyCount + i * 5 + 3 + 1 (for time);
    require(
        bodyData.vy == input[5 + 5 * bodyCount + i * 5 + 3 + 2],
        "Invalid vector y"
    );
    // radius
    // confirm previously stored values were used as input to the proof
    // uint256 radiusIndex = 5 * bodyCount + i * 5 + 4 + 1 (for time);
    require(
        bodyData.radius == input[5 + 5 * bodyCount + i * 5 + 4 + 2],
        "Invalid radius"
    );
  }
  function verifyProof(uint256 bodyCount, address verifier, uint[2] memory a, uint[2][2] memory b, uint[2] memory c, uint[] memory input) public view {
        if (bodyCount == 2) {
            require(
                Groth16Verifier2(verifier).verifyProof(
                   a,
                   b,
                   c,
                   convertTo32(input)
                ),
                "Invalid 2 body proof"
            );
        } else if (bodyCount == 3) {
            require(
                Groth16Verifier3(verifier).verifyProof(
                   a,
                   b,
                   c,
                   convertTo42(input)
                ),
                "Invalid 3 body proof"
            );
        } else if (bodyCount == 4) {
            require(
                Groth16Verifier4(verifier).verifyProof(
                   a,
                   b,
                   c,
                   convertTo52(input)
                ),
                "Invalid 4 body proof"
            );
        } else if (bodyCount == 5) {
            require(
                Groth16Verifier5(verifier).verifyProof(
                   a,
                   b,
                   c,
                   convertTo62(input)
                ),
                "Invalid 5 body proof"
            );
        } else if (bodyCount == 6) {
            require(
                Groth16Verifier6(verifier).verifyProof(
                   a,
                   b,
                   c,
                   convertTo72(input)
                ),
                "Invalid 6 body proof"
            );
        } else {
            revert("Invalid number of bodies");
        }
  }
  function getLevelFromInputs(uint[] memory input) public pure returns (uint256 bodyCount, uint256 dummyCount) {
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
    uint256 bodyCount =  ((input.length - 12) / 10) - 1;
    uint256 dummyCount = 0;
    uint256 tally = 0;
    // start i at end of input array but before the final 5 elements of the missile input
    // count backwards checking every 5 whether a body is completely empty
    // if so consider this a "dummy" body and remove it from the count
    for (uint256 i = input.length - 1 - 5; i > input.length / 2; i--) {
      if (tally % 5 == 0) {
        if (
          input[i] == 0 // radius
          && input[i-1] == 0 // vy
          && input[i-2] == 0 // vx
          && input[i-3] == 0 // py
          && input[i-4] == 0 // px
        ) {
          dummyCount++;
        }
      }
      tally++;
    }

    return (bodyCount - dummyCount, dummyCount);
  }
  function convertTo22(uint[] memory input) public pure returns (uint[22] memory) {
      uint[22] memory input_;
      for (uint256 i = 0; i < 22; i++) {
          input_[i] = input[i];
      }
      return input_;
  }
  function convertTo32(uint[] memory input) public pure returns (uint[32] memory) {
      uint[32] memory input_;
      for (uint256 i = 0; i < 32; i++) {
          input_[i] = input[i];
      }
      return input_;
  }
  function convertTo42(uint[] memory input) public pure returns (uint[42] memory) {
      uint[42] memory input_;
      for (uint256 i = 0; i < 42; i++) {
          input_[i] = input[i];
      }
      return input_;
  }
  function convertTo52(uint[] memory input) public pure returns (uint[52] memory) {
      uint[52] memory input_;
      for (uint256 i = 0; i < 52; i++) {
          input_[i] = input[i];
      }
      return input_;
  }
  function convertTo62(uint[] memory input) public pure returns (uint[62] memory) {
      uint[62] memory input_;
      for (uint256 i = 0; i < 62; i++) {
          input_[i] = input[i];
      }
      return input_;
  }
  function convertTo72(uint[] memory input) public pure returns (uint[72] memory) {
      uint[72] memory input_;
      for (uint256 i = 0; i < 72; i++) {
          input_[i] = input[i];
      }
      return input_;
  }
  function convertTo82(uint[] memory input) public pure returns (uint[82] memory) {
      uint[82] memory input_;
      for (uint256 i = 0; i < 82; i++) {
          input_[i] = input[i];
      }
      return input_;
  }
  function convertTo92(uint[] memory input) public pure returns (uint[92] memory) {
      uint[92] memory input_;
      for (uint256 i = 0; i < 92; i++) {
          input_[i] = input[i];
      }
      return input_;
  }
  function convertTo102(uint[] memory input) public pure returns (uint[102] memory) {
      uint[102] memory input_;
      for (uint256 i = 0; i < 102; i++) {
          input_[i] = input[i];
      }
      return input_;
  }
  function convertTo112(uint[] memory input) public pure returns (uint[112] memory) {
      uint[112] memory input_;
      for (uint256 i = 0; i < 112; i++) {
          input_[i] = input[i];
      }
      return input_;
  }

  // Speedruns NFT functions

  function speedrunsSupportsInterface(bytes4 interfaceId) public pure returns (bool) {
    return
      interfaceId == type(IERC165).interfaceId ||
      interfaceId == type(IERC1155).interfaceId ||
      interfaceId == type(IERC1155MetadataURI).interfaceId ||
      interfaceId == type(IERC2981).interfaceId ||
      interfaceId == bytes4(0x49064906); // IERC4906 MetadataUpdate
  }
  // TODO: add external metadata contract for easier upgrades
  function speedrunsTokenURI(uint256 id) public view returns (string memory) {
    return ExternalMetadata(externalMetadata).getMetadata(id);
  }
  function emitMetadataUpdate(uint256 tokenId) internal {
    bytes32 topic = keccak256("MetadataUpdate(uint256)");
    bytes memory data = abi.encode(tokenId);
    bytes32[] memory topics = new bytes32[](1);
    topics[0] = topic;
    Speedruns(speedruns).emitGenericEvent(topics, data);
  }
  // function emitBatchMetadataUpdate(uint256 _fromTokenId, uint256 _toTokenId) internal {
  //   bytes32 topic = keccak256("BatchMetadataUpdate(uint256,uint256)");
  //   bytes memory data = abi.encode(_fromTokenId, _toTokenId);
  //     bytes32[] memory topics = new bytes32[](1);
  //     topics[0] = topic;
  //   Speedruns(speedruns).emitGenericEvent(topics, data);
  // }
  // function exampleEmitMultipleIndexEvent(uint256 _fromTokenId, uint256 _toTokenId, address who) internal {
  //     bytes32 topic = keccak256("BatchMetadataUpdateIndexed(uint256,uint256,address)");
  //     bytes32 topicFrom = bytes32(abi.encode(_fromTokenId));
  //     bytes32 topicTo = bytes32(abi.encode(_toTokenId));
  //     bytes memory data = abi.encode(who);
  //     bytes32[] memory topics = new bytes32[](3);
  //     topics[0] = topic;
  //     topics[1] = topicFrom;
  //     topics[2] = topicTo;
  //     Speedruns(speedruns).emitGenericEvent(topics, data);
  // }
  function updateExternalMetadata(address externalMetadata_) public onlyOwner {
    externalMetadata = externalMetadata_;
  }
  function updateProceedRecipient(address payable proceedRecipient_) public onlyOwner {
    proceedRecipient = proceedRecipient_;
  }
  function updateSpeedrunsAddress(address payable speedruns_) public onlyOwner {
    speedruns = speedruns_;
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
  function recoverUnsuccessfulPayment(
      address payable _to
  ) public onlyOwner {
      uint256 amount = address(this).balance;
      (bool sent, bytes memory data) = _to.call{value: amount}("");
      emit EthMoved(_to, sent, data, amount);
  }
  function updatePrice(uint256 price_) public onlyOwner {
    price = price_;
  }
  function updatePaused(bool paused_) public onlyOwner {
      paused = paused_;
  }
}