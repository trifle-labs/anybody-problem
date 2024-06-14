// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import {Groth16Verifier as Groth16Verifier2} from "./Game_2_20Verifier.sol";
import {Groth16Verifier as Groth16Verifier3} from "./Game_3_20Verifier.sol";
import {Groth16Verifier as Groth16Verifier4} from "./Game_4_20Verifier.sol";
import {Groth16Verifier as Groth16Verifier5} from "./Game_5_20Verifier.sol";
import {Groth16Verifier as Groth16Verifier6} from "./Game_6_20Verifier.sol";

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "./Bodies.sol";

// contract Bodies is ERC721, Ownable {
//     address anybodyProblem;
//     constructor(address _anybodyProblem) ERC721("Anybody Problem Bodies", "APB"){
//         anybodyProblem = _anybodyProblem;
//     }
//     function tokenURI(uint256 id) public view override(ERC721) returns (string memory) {
//         return AnybodyProblem(anybodyProblem).getBodyMetadata(id);
//     }
//     function mint(uint256 id, address recipient) public {
//         // mint logic
//     }
// }

contract AnybodyProblem is Ownable {

  uint256 public constant LEVELS = 5;
  uint256 constant public SECONDS_IN_A_DAY = 86400;

  uint256 price = 0.0005 ether;
  address payable proceedRecipient;
  address bodies;
  uint256 public constant maxTick = 25 * 60; // 25 fps * 60 sec = 1,500 ticks max
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
  }

  // NOTE: initialize with length of 1 so Runs are not 0 indexed (runId == index of the run array)
  Run[] public runs = new Run[](1);
  // mapping is body count to tickcount to address
  mapping(uint256 => mapping(uint256 => address)) public verifiers;

  constructor(
    address payable proceedRecipient_,
    address bodies_,
    address[] memory verifiers_,
    uint256[] memory verifiersTicks,
    uint256[] memory verifiersBodies) 
  {
    proceedRecipient = proceedRecipient_;
    bodies = bodies_;
    for (uint256 i = 0; i < verifiers_.length; i++) {
      require(verifiersTicks[i] > 0, "Invalid verifier");
      require(verifiers_[i] != address(0), "Invalid verifier");
      verifiers[verifiersBodies[i]][verifiersTicks[i]] = verifiers_[i];
    }
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

  function getLevelData(uint256 day, uint256 level) public pure returns (Body[6] memory bodyData) {
    // NOTE: <= becuase level 5 has 6 bodies
    for (uint256 i = 0; i <= level; i++) {
      bytes32 levelSeed = getLevelSeed(day, level, i);
      bytes32 bodyIndexRand = keccak256(abi.encodePacked(day, i));
      bodyData[i] = getRandomValues(levelSeed, bodyIndexRand, i);
    }
  }
  function getLevelSeed(uint256 day, uint256 level, uint256 bodyIndex) public pure returns (bytes32) {
      return keccak256(abi.encodePacked(day, level, bodyIndex));
  }
  function getRandomValues(bytes32 rand, bytes32 bodyIndexRand, uint256 index) public pure returns (Body memory) {
      // NOTE: this function uses a seed consisting of the day + bodyIndex which means 
      // that all problems of the same level on the same day will have bodies with the same 
      // positions, velocities and radii.
      Body memory body;

      body.radius = genRadius(bodyIndexRand, index);

      rand = keccak256(abi.encodePacked(rand));
      body.px = randomRange(0, windowWidth, rand);

      rand = keccak256(abi.encodePacked(rand));
      body.py = randomRange(0, windowWidth, rand);

      rand = keccak256(abi.encodePacked(rand));
      // this is actually a range of -1/2 to 1/2 of maxVector since negative offset
      // -maxVector = 0
      // 0 = maxVector
      // maxVector = 2 * maxVector
      body.vx = randomRange(maxVector * scalingFactor / 2, 3 * maxVector * scalingFactor / 2, rand);

      rand = keccak256(abi.encodePacked(rand));
      body.vy = randomRange(maxVector * scalingFactor / 2, 3 * maxVector * scalingFactor / 2, rand);

      return body;
  }
  function genRadius(bytes32 seed, uint256 index) public pure returns (uint256) {
      // TODO: confirm whether radius should remain only one of 3 sizes
      uint256 randRadius = randomRange(1, 3, seed);
      randRadius = index == 0 ? 36 : (randRadius) * 5 + startingRadius;
      return randRadius * scalingFactor;
  }
  function randomRange(uint256 min,uint256 max,bytes32 rand) internal pure returns (uint256) {
      return min + (uint256(rand) % (max - min));
  }
  function currentLevel(uint256 runId) public view returns (uint256) {
      return runs[runId].levels.length;
  }
  function generateSeed(uint256 id, uint256 index) internal view returns (bytes32) {
      return keccak256(abi.encodePacked(id, index, blockhash(block.number - 1)));
  }
  function currentDay() public view returns (uint256) {
      return block.timestamp - (block.timestamp % SECONDS_IN_A_DAY);
  }
  function addNewLevelData(uint256 runId) internal {
    uint256 day = runs[runId].day;
    uint256 level = currentLevel(runId) + 1;
    Level memory levelData;
    levelData.seed = generateSeed(runId, level);
    levelData.tmpBodyData = getLevelData(day, level);
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
  function batchSolve(uint256 runId, uint256[] memory tickCounts, uint[2][] memory a, uint[2][2][] memory b, uint[2][] memory c, uint[][] memory input) public payable {
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
  }
  function verifyLevelChunk(uint256 runId, uint256 tickCount, uint256 day, uint[2] memory a, uint[2][2] memory b, uint[2] memory c, uint[] memory input) internal {
      uint256 intendedLevel = getLevelFromInputs(input.length);
      uint256 level = currentLevel(runId);

      require(intendedLevel == level, "Previous level not yet complete");

      uint256 levelIndex = level - 1;
      require(!runs[runId].levels[levelIndex].solved, "Level already solved");
      
      uint256 bodyCount = level + 1;
      address verifier = verifiers[bodyCount][tickCount];
      require(verifier != address(0), "Invalid verifier");
      require(address(uint160(input[5 + bodyCount * 5 + 1])) == msg.sender, "Owner of this proof is not the sender");


      // confirm current inflightMissile == previous outflightMissile
      // or confirm that curren inflightMissile (x, y) == (0, windowHeight)
      uint256[5] memory storedOutflightMissile = runs[runId].levels[levelIndex].tmpInflightMissile;
      uint256[5] memory newInflightMissile = [
          input[5 + 2 * bodyCount * 5 + 2 + 0],
          input[5 + 2 * bodyCount * 5 + 2 + 1],
          input[5 + 2 * bodyCount * 5 + 2 + 2],
          input[5 + 2 * bodyCount * 5 + 2 + 3],
          input[5 + 2 * bodyCount * 5 + 2 + 4]
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

        uint256 time = input[5 + bodyCount * 5];

        verifyProof(bodyCount, verifier, a, b, c, input);

        Level memory levelData = runs[runId].levels[levelIndex];

        levelData.time += time;
        require(levelData.time <= maxTick, "Time limit exceeded");

        uint256 bodiesGone;
        Body memory bodyData;
        for (uint256 i = 0; i < bodyCount; i++) {
            bodyData = levelData.tmpBodyData[i];

            verifyBodyDataMatches(bodyData, input, bodyCount, i);
            bodyData = updateBodyData(bodyData, input, i);

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
            Bodies(bodies).mint(runId, msg.sender);
            emit EthMoved(proceedRecipient, sent, data, msg.value);
            emit RunSolved(msg.sender, runId, runs[runId].accumulativeTime, day);
          } else {
            addNewLevelData(runId);
          }
        }
  }
  function updateBodyData(Body memory bodyData, uint[] memory input, uint256 i) internal pure returns (Body memory){
    bodyData.px = input[5 + i * 5 + 0];
    bodyData.py = input[5 + i * 5 + 1];
    bodyData.vx = input[5 + i * 5 + 2];
    bodyData.vy = input[5 + i * 5 + 3];
    bodyData.radius = input[5 + i * 5 + 4];
    return bodyData;
  }
  function verifyBodyDataMatches(Body memory bodyData, uint[] memory input, uint256 bodyCount, uint256 i) internal pure {
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
  function verifyProof(uint256 bodyCount, address verifier, uint[2] memory a, uint[2][2] memory b, uint[2] memory c, uint[] memory input) internal view {

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
  function getLevelFromInputs(uint256 inputLength) internal pure returns (uint256) {
    // inputLength = bodyCount * 5 * 2 + 1 + 1 + 5 + 5;
    // inputLength = 10 * bodyCount + 12;
    // 10 * bodyCount = inputLength - 12;
    uint256 bodyCount = (inputLength - 12) / 10;
    return bodyCount - 1;
  }
  function getProblemMetadata(uint256 id) public view returns (string memory) {
    // return string(abi.encodePacked("https://api.bodies.io/problems/", uint2str(id)));
  }
  function getBodyMetadata(uint256 id) public view returns (string memory) {
    // return string(abi.encodePacked("https://api.bodies.io/bodies/", uint2str(id)));
  }
  function convertTo22(uint[] memory input) internal pure returns (uint[22] memory) {
      uint[22] memory input_;
      for (uint256 i = 0; i < 22; i++) {
          input_[i] = input[i];
      }
      return input_;
  }
  function convertTo32(uint[] memory input) internal pure returns (uint[32] memory) {
      uint[32] memory input_;
      for (uint256 i = 0; i < 32; i++) {
          input_[i] = input[i];
      }
      return input_;
  }
  function convertTo42(uint[] memory input) internal pure returns (uint[42] memory) {
      uint[42] memory input_;
      for (uint256 i = 0; i < 42; i++) {
          input_[i] = input[i];
      }
      return input_;
  }
  function convertTo52(uint[] memory input) internal pure returns (uint[52] memory) {
      uint[52] memory input_;
      for (uint256 i = 0; i < 52; i++) {
          input_[i] = input[i];
      }
      return input_;
  }
  function convertTo62(uint[] memory input) internal pure returns (uint[62] memory) {
      uint[62] memory input_;
      for (uint256 i = 0; i < 62; i++) {
          input_[i] = input[i];
      }
      return input_;
  }
  function convertTo72(uint[] memory input) internal pure returns (uint[72] memory) {
      uint[72] memory input_;
      for (uint256 i = 0; i < 72; i++) {
          input_[i] = input[i];
      }
      return input_;
  }
  function convertTo82(uint[] memory input) internal pure returns (uint[82] memory) {
      uint[82] memory input_;
      for (uint256 i = 0; i < 82; i++) {
          input_[i] = input[i];
      }
      return input_;
  }
  function convertTo92(uint[] memory input) internal pure returns (uint[92] memory) {
      uint[92] memory input_;
      for (uint256 i = 0; i < 92; i++) {
          input_[i] = input[i];
      }
      return input_;
  }
  function convertTo102(uint[] memory input) internal pure returns (uint[102] memory) {
      uint[102] memory input_;
      for (uint256 i = 0; i < 102; i++) {
          input_[i] = input[i];
      }
      return input_;
  }
  function convertTo112(uint[] memory input) internal pure returns (uint[112] memory) {
      uint[112] memory input_;
      for (uint256 i = 0; i < 112; i++) {
          input_[i] = input[i];
      }
      return input_;
  }
}