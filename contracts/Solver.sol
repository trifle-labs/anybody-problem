// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import {Groth16Verifier as Groth16Verifier1} from "./Game_1_20Verifier.sol";
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

    uint256[11] public bodyBoost = [
        0, // 0th body, just for easier indexing
        0, // 1st body
        0, // 2nd body
        1, // 3rd body
        2, // 4th body
        4, // 5th body
        8, // 6th body
        16, // 7th body
        32, // 8th body
        64, //9th body
        128 // 10th body
    ];

    uint256 public constant maxTick = 50 * 60; // 50 fps * 60 sec = 3,000 ticks max

    struct Match {
        bool inProgress;
        uint256 problemId;
        uint256 startingTick;
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
        

        address owner = Problems(problems).ownerOf(problemId);
        require(owner == msg.sender, "Not the owner");

        (bool solved, , uint256 day, uint256 bodyCount, , uint256 previousTickCount) = Problems(problems)
            .problems(problemId);
        require(!solved, "Already solved");
        require(Problems(problems).currentDay() == day, "No longer accepting submissions for today");

        uint256 numberOfInputs = bodyCount * 5 * 2 + 1;
        require(input.length == numberOfInputs, "Invalid input length");
        address verifier = Problems(problems).verifiers(
            bodyCount,
            tickCount
        );

        require(verifier != address(0), "Invalid verifier");

        uint256 time = input[bodyCount * 5];

        if (bodyCount == 1) {
            //require(
                //Groth16Verifier1(verifier).verifyProof(
                //    a,
                //    b,
                //    c,
                //    convertTo11(input)
                //),
                //"Invalid 1 body proof"
            //);
        } else if (bodyCount == 2) {
            //require(
                //Groth16Verifier2(verifier).verifyProof(
                //    a,
                //    b,
                //    c,
                //    convertTo21(input)
                //),
                //"Invalid 2 body proof"
            //);
        } else if (bodyCount == 3) {
            //require(
                //Groth16Verifier3(verifier).verifyProof(
                //    a,
                //    b,
                //    c,
                //    convertTo31(input)
                //),
                //"Invalid 3 body proof"
            //);
        } else if (bodyCount == 4) {
            //require(
                //Groth16Verifier4(verifier).verifyProof(
                //    a,
                //    b,
                //    c,
                //    convertTo41(input)
                //),
                //"Invalid 4 body proof"
            //);
        } else if (bodyCount == 5) {
            //require(
                //Groth16Verifier5(verifier).verifyProof(
                //    a,
                //    b,
                //    c,
                //    convertTo51(input)
                //),
                //"Invalid 5 body proof"
            //);
        } else if (bodyCount == 6) {
            //require(
                //Groth16Verifier6(verifier).verifyProof(
                //    a,
                //    b,
                //    c,
                //    convertTo61(input)
                //),
                //"Invalid 6 body proof"
            //);
        } else if (bodyCount == 7) {
            //require(
                //Groth16Verifier7(verifier).verifyProof(
                //    a,
                //    b,
                //    c,
                //    convertTo71(input)
                //),
                //"Invalid 7 body proof"
            //);
        } else if (bodyCount == 8) {
            //require(
                //Groth16Verifier8(verifier).verifyProof(
                //    a,
                //    b,
                //    c,
                //    convertTo81(input)
                //),
                //"Invalid 8 body proof"
            //);
        } else if (bodyCount == 9) {
            //require(
                //Groth16Verifier9(verifier).verifyProof(
                //    a,
                //    b,
                //    c,
                //    convertTo91(input)
                //),
                //"Invalid 9 body proof"
            //);
        } else if (bodyCount == 10) {
            //require(
                //Groth16Verifier10(verifier).verifyProof(
                //    a,
                //    b,
                //    c,
                //    convertTo101(input)
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
                bodyData.px == input[5 * bodyCount + i * 5 + 0 + 1],
                "Invalid position x"
            );
            // update stored values
            bodyData.px = input[i * 5 + 0];

            // py
            // confirm previously stored values were used as input to the proof
            // uint256 pyIndex = 5 * bodyCount + i * 5 + 1 + 1 (for time);
            require(
                bodyData.py == input[5 * bodyCount + i * 5 + 1 + 1],
                "Invalid position y"
            );
            // update stored values
            bodyData.py = input[i * 5 + 1];

            // vx
            // confirm previously stored values were used as input to the proof
            // uint256 vxIndex = 5 * bodyCount + i * 5 + 2 + 1 (for time);
            require(
                bodyData.vx == input[5 * bodyCount + i * 5 + 2 + 1],
                "Invalid vector x"
            );
            // update stored values
            bodyData.vx = input[i * 5 + 2];

            // vy
            // confirm previously stored values were used as input to the proof
            // uint256 vyIndex = 5 * bodyCount + i * 5 + 3 + 1 (for time);
            require(
                bodyData.vy == input[5 * bodyCount + i * 5 + 3 + 1],
                "Invalid vector y"
            );
            // update stored values
            bodyData.vy = input[i * 5 + 3];

            // radius
            // confirm previously stored values were used as input to the proof
            // uint256 radiusIndex = 5 * bodyCount + i * 5 + 4 + 1 (for time);
            require(
                bodyData.radius == input[5 * bodyCount + i * 5 + 4 + 1],
                "Invalid radius"
            );
            // update stored values
            bodyData.radius = input[i * 5 + 4];
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

    function convertTo11(
        uint[] memory input
    ) internal pure returns (uint[11] memory) {
        uint[11] memory input_;
        for (uint256 i = 0; i < 11; i++) {
            input_[i] = input[i];
        }
        return input_;
    }

    function convertTo21(
        uint[] memory input
    ) internal pure returns (uint[21] memory) {
        uint[21] memory input_;
        for (uint256 i = 0; i < 21; i++) {
            input_[i] = input[i];
        }
        return input_;
    }

    function convertTo31(
        uint[] memory input
    ) internal pure returns (uint[31] memory) {
        uint[31] memory input_;
        for (uint256 i = 0; i < 31; i++) {
            input_[i] = input[i];
        }
        return input_;
    }

    function convertTo41(
        uint[] memory input
    ) internal pure returns (uint[41] memory) {
        uint[41] memory input_;
        for (uint256 i = 0; i < 41; i++) {
            input_[i] = input[i];
        }
        return input_;
    }

    function convertTo51(
        uint[] memory input
    ) internal pure returns (uint[51] memory) {
        uint[51] memory input_;
        for (uint256 i = 0; i < 51; i++) {
            input_[i] = input[i];
        }
        return input_;
    }

    function convertTo61(
        uint[] memory input
    ) internal pure returns (uint[61] memory) {
        uint[61] memory input_;
        for (uint256 i = 0; i < 61; i++) {
            input_[i] = input[i];
        }
        return input_;
    }

    function convertTo71(
        uint[] memory input
    ) internal pure returns (uint[71] memory) {
        uint[71] memory input_;
        for (uint256 i = 0; i < 71; i++) {
            input_[i] = input[i];
        }
        return input_;
    }

    function convertTo81(
        uint[] memory input
    ) internal pure returns (uint[81] memory) {
        uint[81] memory input_;
        for (uint256 i = 0; i < 81; i++) {
            input_[i] = input[i];
        }
        return input_;
    }

    function convertTo91(
        uint[] memory input
    ) internal pure returns (uint[91] memory) {
        uint[91] memory input_;
        for (uint256 i = 0; i < 91; i++) {
            input_[i] = input[i];
        }
        return input_;
    }

    function convertTo101(
        uint[] memory input
    ) internal pure returns (uint[101] memory) {
        uint[101] memory input_;
        for (uint256 i = 0; i < 101; i++) {
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
