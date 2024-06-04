// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import {Groth16Verifier as Groth16Verifier2} from "./Game_2_20Verifier.sol";
import {Groth16Verifier as Groth16Verifier3} from "./Game_3_20Verifier.sol";
import {Groth16Verifier as Groth16Verifier4} from "./Game_4_20Verifier.sol";
import {Groth16Verifier as Groth16Verifier5} from "./Game_5_20Verifier.sol";
import {Groth16Verifier as Groth16Verifier6} from "./Game_6_20Verifier.sol";
import {Groth16Verifier as Groth16Verifier7} from "./Game_7_20Verifier.sol";
import {Groth16Verifier as Groth16Verifier8} from "./Game_8_20Verifier.sol";
import {Groth16Verifier as Groth16Verifier9} from "./Game_9_20Verifier.sol";
import {Groth16Verifier as Groth16Verifier10} from "./Game_10_20Verifier.sol";

import "@openzeppelin/contracts/access/Ownable.sol";

import "./Problems.sol";
import "hardhat/console.sol";

contract Solver is Ownable {
    address payable public problems;
    uint256 public constant decimals = 10 ** 18;
    uint256 public constant maxTick = 25 * 60; // 25 fps * 60 sec = 1,500 ticks max

    struct Match {
        bool inProgress;
        uint256 problemId;
        uint256 startingTick;
        uint256[5] inflightMissile;
    }

    mapping(uint256 => Match) public matches;

    event Solved(
        address indexed solver,
        uint256 indexed problemId,
        uint256 indexed level,
        uint256 ticksInThisMatch,
        uint256 day
    );

    constructor(address payable problems_) {
        problems = problems_;
    }

    fallback() external {
        revert("no fallback function");
    }

    function updateProblemsAddress(address payable problems_) public onlyOwner {
        problems = problems_;
    }


    function inProgress(uint256 problemId) public view returns (bool) {
        return matches[problemId].inProgress;
    }

    function batchSolve(uint256 problemId, uint256 tickCount, uint[2][] memory a, uint[2][2][] memory b, uint[2][] memory c, uint[][] memory input) public {
        for(uint256 i = 0; i < input.length; i++) {
            solveProblem(problemId, tickCount, a[i], b[i], c[i], input[i]);
        }
    }

    function solveProblem(
        uint256 problemId,
        uint256 tickCount,
        uint[2] memory a,
        uint[2][2] memory b,
        uint[2] memory c,
        uint[] memory input
    ) public {
        
        require(Problems(problems).ownerOf(problemId) == msg.sender, "Not the owner");

        (bool solved, , uint256 day, uint256 bodyCount, , uint256 previousTickCount) = Problems(problems)
            .problems(problemId);
        require(!solved, "Already solved");
        require(Problems(problems).currentDay() == day, "No longer accepting submissions for today");

        uint256 numberOfInputs = bodyCount * 5 * 2 + 1 + 1 + 5 + 5;
        require(input.length == numberOfInputs, "Invalid proof input length");
        address verifier = Problems(problems).verifiers(
            bodyCount,
            tickCount
        );

        require(verifier != address(0), "Invalid verifier");
        
        require(address(uint160(input[5 + bodyCount * 5 + 1])) == msg.sender, "Invalid solver");

        // TODO: get previous outflightMissile
        // confirm current inflightMissile == previous outflightMissile
        // or confirm that curren inflightMissile (x, y) == (0, windowHeight)
        uint256[5] memory storedOutflightMissile = matches[problemId].inflightMissile;
        uint256[5] memory newInflightMissile = [
            input[5 + 2 * bodyCount * 5 + 2 + 0],
            input[5 + 2 * bodyCount * 5 + 2 + 1],
            input[5 + 2 * bodyCount * 5 + 2 + 2],
            input[5 + 2 * bodyCount * 5 + 2 + 3],
            input[5 + 2 * bodyCount * 5 + 2 + 4]
        ];

        if (newInflightMissile[4] != 0) {
            bool matchesStoredOutflightMissile =  storedOutflightMissile[0] == newInflightMissile[0] &&
                                                  storedOutflightMissile[1] == newInflightMissile[1] &&
                                                  storedOutflightMissile[2] == newInflightMissile[2] &&
                                                  storedOutflightMissile[3] == newInflightMissile[3] &&
                                                  storedOutflightMissile[4] == newInflightMissile[4];

            bool newMissile = newInflightMissile[0] == 0 && newInflightMissile[1] == Problems(problems).windowWidth();
            require(newMissile || matchesStoredOutflightMissile, "Invalid inflightMissile");
        }

        uint256[5] memory newOutflightMissile = [
            input[0],
            input[1],
            input[2],
            input[3],
            input[4]
        ];
        matches[problemId].inflightMissile = newOutflightMissile;


        uint256 time = input[5 + bodyCount * 5];
        
        if (bodyCount == 2) {
            //require(
                //Groth16Verifier2(verifier).verifyProof(
                //    a,
                //    b,
                //    c,
                //    convertTo32(input)
                //),
                //"Invalid 2 body proof"
            //);
        } else if (bodyCount == 3) {
            //require(
                //Groth16Verifier3(verifier).verifyProof(
                //    a,
                //    b,
                //    c,
                //    convertTo42(input)
                //),
                //"Invalid 3 body proof"
            //);
        } else if (bodyCount == 4) {
            //require(
                //Groth16Verifier4(verifier).verifyProof(
                //    a,
                //    b,
                //    c,
                //    convertTo52(input)
                //),
                //"Invalid 4 body proof"
            //);
        } else if (bodyCount == 5) {
            //require(
                //Groth16Verifier5(verifier).verifyProof(
                //    a,
                //    b,
                //    c,
                //    convertTo62(input)
                //),
                //"Invalid 5 body proof"
            //);
        } else if (bodyCount == 6) {
            //require(
                //Groth16Verifier6(verifier).verifyProof(
                //    a,
                //    b,
                //    c,
                //    convertTo72(input)
                //),
                //"Invalid 6 body proof"
            //);
        } else if (bodyCount == 7) {
            //require(
                //Groth16Verifier7(verifier).verifyProof(
                //    a,
                //    b,
                //    c,
                //    convertTo82(input)
                //),
                //"Invalid 7 body proof"
            //);
        } else if (bodyCount == 8) {
            //require(
                //Groth16Verifier8(verifier).verifyProof(
                //    a,
                //    b,
                //    c,
                //    convertTo92(input)
                //),
                //"Invalid 8 body proof"
            //);
        } else if (bodyCount == 9) {
            //require(
                //Groth16Verifier9(verifier).verifyProof(
                //    a,
                //    b,
                //    c,
                //    convertTo102(input)
                //),
                //"Invalid 9 body proof"
            //);
        } else if (bodyCount == 10) {
            //require(
                //Groth16Verifier10(verifier).verifyProof(
                //    a,
                //    b,
                //    c,
                //    convertTo112(input)
                //),
                //"Invalid 10 body proof"
            //);
        } else {
            revert("Invalid number of bodies");
        }


        Match memory currentMatch = matches[problemId];

        if (!currentMatch.inProgress) {
          currentMatch.inProgress = true;
          currentMatch.startingTick = previousTickCount;
          matches[problemId] = currentMatch;
        }

        uint256 newTotalTicks = previousTickCount + time;
        uint256 ticksInThisMatch = newTotalTicks - currentMatch.startingTick;
        if(ticksInThisMatch > maxTick) {
          revert("Max tick exceeded");
        }

        uint256[10] memory bodyIds = Problems(problems).getProblemBodyIds(
            problemId
        );

        Problems(problems).updateProblemTickCount(
            problemId,
            newTotalTicks
        );

        uint256 bodiesGone;
        Problems.Body memory bodyData;

        for (uint256 i = 0; i < bodyCount; i++) {
            bodyData = Problems(problems).getProblemBodyData(
                problemId,
                bodyIds[i]
            );

            // px
            // confirm previously stored values were used as input to the proof
            // uint256 pxIndex = 5 * bodyCount + i * 5 + 0 + 1 (for time);
            require(
                bodyData.px == input[5 + 5 * bodyCount + i * 5 + 0 + 2],
                "Invalid position x"
            );
            // update stored values
            bodyData.px = input[5 + i * 5 + 0];

            // py
            // confirm previously stored values were used as input to the proof
            // uint256 pyIndex = 5 * bodyCount + i * 5 + 1 + 1 (for time);
            require(
                bodyData.py == input[5 + 5 * bodyCount + i * 5 + 1 + 2],
                "Invalid position y"
            );
            // update stored values
            bodyData.py = input[5 + i * 5 + 1];

            // vx
            // confirm previously stored values were used as input to the proof
            // uint256 vxIndex = 5 * bodyCount + i * 5 + 2 + 1 (for time);
            require(
                bodyData.vx == input[5 + 5 * bodyCount + i * 5 + 2 + 2],
                "Invalid vector x"
            );
            // update stored values
            bodyData.vx = input[5 + i * 5 + 2];

            // vy
            // confirm previously stored values were used as input to the proof
            // uint256 vyIndex = 5 * bodyCount + i * 5 + 3 + 1 (for time);
            require(
                bodyData.vy == input[5 + 5 * bodyCount + i * 5 + 3 + 2],
                "Invalid vector y"
            );
            // update stored values
            bodyData.vy = input[5 + i * 5 + 3];

            // radius
            // confirm previously stored values were used as input to the proof
            // uint256 radiusIndex = 5 * bodyCount + i * 5 + 4 + 1 (for time);
            require(
                bodyData.radius == input[5 + 5 * bodyCount + i * 5 + 4 + 2],
                "Invalid radius"
            );
            // update stored values
            bodyData.radius = input[5 + i * 5 + 4];
            Problems(problems).updateProblemBody(
                problemId,
                bodyIds[i],
                bodyData
            );
            if (bodyData.radius == 0) {
              bodiesGone++;
            }
        }

        // beat the level
        if(bodiesGone == bodyCount) {
          Problems(problems).levelUp(problemId, ticksInThisMatch);
          Problems(problems).restoreValues(problemId);
          delete matches[problemId];
          emit Solved(msg.sender, problemId, bodyCount, ticksInThisMatch, day);
        }
    }

    function deleteMatch(uint256 problemId) public {
      require(msg.sender == Problems(problems).ownerOf(problemId), "Not the owner");
      require(matches[problemId].inProgress, "Match not in progress");
      Problems(problems).restoreValues(problemId);
      delete matches[problemId];
    }

    function convertTo22(
        uint[] memory input
    ) internal pure returns (uint[22] memory) {
        uint[22] memory input_;
        for (uint256 i = 0; i < 22; i++) {
            input_[i] = input[i];
        }
        return input_;
    }

    function convertTo32(
        uint[] memory input
    ) internal pure returns (uint[32] memory) {
        uint[32] memory input_;
        for (uint256 i = 0; i < 32; i++) {
            input_[i] = input[i];
        }
        return input_;
    }

    function convertTo42(
        uint[] memory input
    ) internal pure returns (uint[42] memory) {
        uint[42] memory input_;
        for (uint256 i = 0; i < 42; i++) {
            input_[i] = input[i];
        }
        return input_;
    }

    function convertTo52(
        uint[] memory input
    ) internal pure returns (uint[52] memory) {
        uint[52] memory input_;
        for (uint256 i = 0; i < 52; i++) {
            input_[i] = input[i];
        }
        return input_;
    }

    function convertTo62(
        uint[] memory input
    ) internal pure returns (uint[62] memory) {
        uint[62] memory input_;
        for (uint256 i = 0; i < 62; i++) {
            input_[i] = input[i];
        }
        return input_;
    }

    function convertTo72(
        uint[] memory input
    ) internal pure returns (uint[72] memory) {
        uint[72] memory input_;
        for (uint256 i = 0; i < 72; i++) {
            input_[i] = input[i];
        }
        return input_;
    }

    function convertTo82(
        uint[] memory input
    ) internal pure returns (uint[82] memory) {
        uint[82] memory input_;
        for (uint256 i = 0; i < 82; i++) {
            input_[i] = input[i];
        }
        return input_;
    }

    function convertTo92(
        uint[] memory input
    ) internal pure returns (uint[92] memory) {
        uint[92] memory input_;
        for (uint256 i = 0; i < 92; i++) {
            input_[i] = input[i];
        }
        return input_;
    }

    function convertTo102(
        uint[] memory input
    ) internal pure returns (uint[102] memory) {
        uint[102] memory input_;
        for (uint256 i = 0; i < 102; i++) {
            input_[i] = input[i];
        }
        return input_;
    }

    function convertTo112(
        uint[] memory input
    ) internal pure returns (uint[112] memory) {
        uint[112] memory input_;
        for (uint256 i = 0; i < 112; i++) {
            input_[i] = input[i];
        }
        return input_;
    }

    // function convertToN(
    //     uint[] memory input,
    //     uint256 n
    // ) internal pure returns (uint[n] memory) {
    //     uint[n] memory input_;
    //     for (uint256 i = 0; i < n; i++) {
    //         input_[i] = input[i];
    //     }
    //     return input_;
    // }
}
