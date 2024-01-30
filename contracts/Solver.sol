// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import {Groth16Verifier as Groth16Verifier3} from "./Nft_3_20Verifier.sol";
import {Groth16Verifier as Groth16Verifier4} from "./Nft_4_20Verifier.sol";
import {Groth16Verifier as Groth16Verifier5} from "./Nft_5_20Verifier.sol";
import {Groth16Verifier as Groth16Verifier6} from "./Nft_6_20Verifier.sol";
import {Groth16Verifier as Groth16Verifier7} from "./Nft_7_20Verifier.sol";
import {Groth16Verifier as Groth16Verifier8} from "./Nft_8_20Verifier.sol";
import {Groth16Verifier as Groth16Verifier9} from "./Nft_9_20Verifier.sol";
import {Groth16Verifier as Groth16Verifier10} from "./Nft_10_20Verifier.sol";

import "@openzeppelin/contracts/access/Ownable.sol";

import "./Problems.sol";
import "./Tocks.sol";
import "hardhat/console.sol";

contract Solver is Ownable {
    address payable public problems;
    address public tocks;

    uint256[10] public bodyBoost = [
        0, // 1st body
        0, // 2nd body
        3, // 3rd body
        4, // 4th body
        5, // 5th body
        6, // 6th body
        7, // 7th body
        8, // 8th body
        9, //9th body
        10 // 10th body
    ];

    event Solved(
        uint256 indexed problemId,
        uint256 indexed previousTickCount,
        uint256 indexed tickCount
    );

    constructor(address payable problems_, address tocks_) {
        problems = problems_;
        tocks = tocks_;
    }

    fallback() external {
        revert("no fallback function");
    }

    function updateProblemsAddress(address payable problems_) public onlyOwner {
        problems = problems_;
    }

    function updateTocksAddress(address tocks_) public onlyOwner {
        tocks = tocks_;
    }

    function solveProblem(
        uint256 problemId,
        uint256 tickCount,
        uint[2] memory a,
        uint[2][2] memory b,
        uint[2] memory c,
        uint[] memory input
    ) public {
        (, uint256 bodyCount, , uint256 previousTickCount) = Problems(problems)
            .problems(problemId);
        uint256 numberOfBodies = bodyCount;

        uint256 numberOfInputs = numberOfBodies * 5 * 2;
        require(input.length == numberOfInputs, "Invalid input length");
        address verifier = Problems(problems).verifiers(
            numberOfBodies,
            tickCount
        );

        if (numberOfBodies == 3) {
            require(
                Groth16Verifier3(verifier).verifyProof(
                    a,
                    b,
                    c,
                    convertTo30(input)
                ),
                "Invalid 3 body proof"
            );
        } else if (numberOfBodies == 4) {
            require(
                Groth16Verifier4(verifier).verifyProof(
                    a,
                    b,
                    c,
                    convertTo40(input)
                ),
                "Invalid 4 body proof"
            );
        } else if (numberOfBodies == 5) {
            require(
                Groth16Verifier5(verifier).verifyProof(
                    a,
                    b,
                    c,
                    convertTo50(input)
                ),
                "Invalid 5 body proof"
            );
        } else if (numberOfBodies == 6) {
            require(
                Groth16Verifier6(verifier).verifyProof(
                    a,
                    b,
                    c,
                    convertTo60(input)
                ),
                "Invalid 6 body proof"
            );
        } else if (numberOfBodies == 7) {
            require(
                Groth16Verifier7(verifier).verifyProof(
                    a,
                    b,
                    c,
                    convertTo70(input)
                ),
                "Invalid 7 body proof"
            );
        } else if (numberOfBodies == 8) {
            require(
                Groth16Verifier8(verifier).verifyProof(
                    a,
                    b,
                    c,
                    convertTo80(input)
                ),
                "Invalid 8 body proof"
            );
        } else if (numberOfBodies == 9) {
            require(
                Groth16Verifier9(verifier).verifyProof(
                    a,
                    b,
                    c,
                    convertTo90(input)
                ),
                "Invalid 9 body proof"
            );
        } else if (numberOfBodies == 10) {
            require(
                Groth16Verifier10(verifier).verifyProof(
                    a,
                    b,
                    c,
                    convertTo100(input)
                ),
                "Invalid 10 body proof"
            );
        } else {
            revert("Invalid number of bodies");
        }
        uint256[10] memory bodyIds = Problems(problems).getProblemBodyIds(
            problemId
        );

        Problems(problems).updateProblemTickCount(
            problemId,
            previousTickCount + tickCount
        );

        Tocks(tocks).mint(msg.sender, tickCount * bodyBoost[bodyCount]);

        // uint256 traits = 5;
        Problems.Body memory bodyData;
        for (uint256 i = 0; i < numberOfBodies; i++) {
            bodyData = Problems(problems).getProblemBodyData(
                problemId,
                bodyIds[i]
            );

            // px
            // confirm previously stored values were used as input to the proof
            // uint256 pxIndex = 5 * numberOfBodies + i * 5 + 0;
            // console.log("px");
            // console.log(bodyData.px);
            // console.log(input[5 * numberOfBodies + i * 5 + 0]);
            require(
                bodyData.px == input[5 * numberOfBodies + i * 5 + 0],
                "Invalid position x"
            );
            // update stored values
            bodyData.px = input[i * 5 + 0];

            // py
            // confirm previously stored values were used as input to the proof
            // uint256 pyIndex = 5 * numberOfBodies + i * 5 + 1;
            require(
                bodyData.py == input[5 * numberOfBodies + i * 5 + 1],
                "Invalid position y"
            );
            // update stored values
            bodyData.py = input[i * 5 + 1];

            // vx
            // confirm previously stored values were used as input to the proof
            // uint256 vxIndex = 5 * numberOfBodies + i * 5 + 2;
            // console.log("vx");
            // console.log(bodyData.vx);
            // console.log(input[5 * numberOfBodies + i * 5 + 2]);
            // console.log(input[i * 5 + 2]);
            require(
                bodyData.vx == input[5 * numberOfBodies + i * 5 + 2],
                "Invalid vector x"
            );
            // update stored values
            bodyData.vx = input[i * 5 + 2];

            // vy
            // confirm previously stored values were used as input to the proof
            // uint256 vyIndex = 5 * numberOfBodies + i * 5 + 3;
            require(
                bodyData.vy == input[5 * numberOfBodies + i * 5 + 3],
                "Invalid vector y"
            );
            // update stored values
            bodyData.vy = input[i * 5 + 3];

            // radius
            // confirm previously stored values were used as input to the proof
            // uint256 radiusIndex = 5 * numberOfBodies + i * 5 + 4;
            require(
                bodyData.radius == input[5 * numberOfBodies + i * 5 + 4],
                "Invalid radius"
            );
            // update stored values
            bodyData.radius = input[i * 5 + 4];
            Problems(problems).updateProblemBody(
                problemId,
                bodyIds[i],
                bodyData
            );
        }
        emit Solved(problemId, previousTickCount, tickCount);
    }

    function convertTo30(
        uint[] memory input
    ) internal pure returns (uint[30] memory) {
        uint[30] memory input_;
        for (uint256 i = 0; i < 30; i++) {
            input_[i] = input[i];
        }
        return input_;
    }

    function convertTo40(
        uint[] memory input
    ) internal pure returns (uint[40] memory) {
        uint[40] memory input_;
        for (uint256 i = 0; i < 40; i++) {
            input_[i] = input[i];
        }
        return input_;
    }

    function convertTo50(
        uint[] memory input
    ) internal pure returns (uint[50] memory) {
        uint[50] memory input_;
        for (uint256 i = 0; i < 50; i++) {
            input_[i] = input[i];
        }
        return input_;
    }

    function convertTo60(
        uint[] memory input
    ) internal pure returns (uint[60] memory) {
        uint[60] memory input_;
        for (uint256 i = 0; i < 60; i++) {
            input_[i] = input[i];
        }
        return input_;
    }

    function convertTo70(
        uint[] memory input
    ) internal pure returns (uint[70] memory) {
        uint[70] memory input_;
        for (uint256 i = 0; i < 70; i++) {
            input_[i] = input[i];
        }
        return input_;
    }

    function convertTo80(
        uint[] memory input
    ) internal pure returns (uint[80] memory) {
        uint[80] memory input_;
        for (uint256 i = 0; i < 80; i++) {
            input_[i] = input[i];
        }
        return input_;
    }

    function convertTo90(
        uint[] memory input
    ) internal pure returns (uint[90] memory) {
        uint[90] memory input_;
        for (uint256 i = 0; i < 90; i++) {
            input_[i] = input[i];
        }
        return input_;
    }

    function convertTo100(
        uint[] memory input
    ) internal pure returns (uint[100] memory) {
        uint[100] memory input_;
        for (uint256 i = 0; i < 100; i++) {
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
