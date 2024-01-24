// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Metadata.sol";
import {Groth16Verifier as Groth16Verifier3} from "./Nft_3_20Verifier.sol";
import {Groth16Verifier as Groth16Verifier4} from "./Nft_4_20Verifier.sol";
import {Groth16Verifier as Groth16Verifier5} from "./Nft_5_20Verifier.sol";
import {Groth16Verifier as Groth16Verifier6} from "./Nft_6_20Verifier.sol";
import {Groth16Verifier as Groth16Verifier7} from "./Nft_7_20Verifier.sol";
import {Groth16Verifier as Groth16Verifier8} from "./Nft_8_20Verifier.sol";
import {Groth16Verifier as Groth16Verifier9} from "./Nft_9_20Verifier.sol";
import {Groth16Verifier as Groth16Verifier10} from "./Nft_10_20Verifier.sol";

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./Bodies.sol";
import "./Ticks.sol";
import "./Solver.sol";

contract Problems is ERC721, Ownable {
    uint256 public problemSupply;

    address public bodies;
    address public ticks;
    address public metadata;

    address public wallet;

    uint256 public price = 0 ether;

    struct Body {
        uint256 bodyId;
        uint256 bodyIndex;
        uint256 px;
        uint256 py;
        uint256 vx;
        uint256 vy;
        uint256 radius;
        bytes32 seed;
    }

    struct Problem {
        bytes32 seed;
        uint256 bodies;
        mapping(uint256 => Body) bodyData;
        uint256[10] bodyIds;
        uint256 ticks;
    }

    mapping(uint256 => Problem) public problems;

    // mapping is body count to ticks to address
    mapping(uint256 => mapping(uint256 => address)) public verifiers;

    uint256 public constant scalingFactor = 3 ** 10;
    uint256 public constant windowWidth = 1000 * scalingFactor;
    uint256 public constant maxRadius = 13;

    event bodyAdded(
        uint256 problemId,
        uint256 tick,
        uint256 px,
        uint256 py,
        uint256 radius,
        bytes32 seed
    );

    event bodyRemoved(
        uint256 problemId,
        uint256 tick,
        uint256 bodyId,
        bytes32 seed
    );

    constructor(
        address wallet_,
        address metadata_,
        address[] memory verifiers_,
        uint256[] memory verifiersTicks,
        uint256[] memory verifiersBodies
    ) ERC721("Anybody Problem", "ANY") {
        require(wallet_ != address(0), "Invalid wallet");
        require(metadata_ != address(0), "Invalid metadata");
        wallet = wallet_;
        metadata = metadata_;
        for (uint256 i = 0; i < verifiers_.length; i++) {
            require(verifiersTicks[i] > 0, "Invalid verifier ticks");
            require(verifiers_[i] != address(0), "Invalid verifier");
            verifiers[verifiersBodies[i]][verifiersTicks[i]] = verifiers_[i];
        }
    }

    function tokenURI(
        uint256 id
    ) public view override(ERC721) returns (string memory) {
        return Metadata(metadata).getMetadata(id);
    }

    function updatePrice(uint256 price_) public onlyOwner {
        price = price_;
    }

    function updateVerifier(
        uint256 index,
        address verifier_,
        uint256 verifierBodies,
        uint256 verifierTicks
    ) public onlyOwner {
        verifiers[verifierBodies][verifierTicks] = verifier_;
    }

    function updateMetadataAddress(address metadata_) public onlyOwner {
        metadata = metadata_;
    }

    function updateBodiesAddress(address bodies_) public onlyOwner {
        bodies = bodies_;
    }

    function updateTicksAddress(address ticks_) public onlyOwner {
        ticks = ticks_;
    }

    function generateSeed(uint256 tokenId) public view returns (bytes32) {
        return
            keccak256(abi.encodePacked(tokenId, blockhash(block.number - 1)));
    }

    function mint() public payable {
        require(msg.value == price, "Invalid price");
        // (bool sent, bytes memory data) = wallet.call{value: msg.value}("");
        (bool sent, bytes memory data) = wallet.call{value: msg.value}("");
        problemSupply++;
        _mint(msg.sender, problemSupply);

        for (uint256 i = 0; i < 3; i++) {
            uint256 bodyId = Bodies(bodies).mintAndBurn(
                msg.sender,
                problemSupply
            );
            _addBody(problemSupply, bodyId);
            // bytes32 bodySeed = Bodies(bodies).seeds(bodyId);
            // problems[problemSupply].bodyData[bodyId] = getRandomValues(
            //     bodyId,
            //     bodySeed,
            //     i
            // );
            // problems[problemSupply].bodyIds[i] = bodyId;
        }
        problems[problemSupply].seed = generateSeed(problemSupply);
        problems[problemSupply].bodies = 3;
    }

    function mintBody(uint256 problemId) public {
        require(ownerOf(problemId) == msg.sender, "Not owner");
        uint256 bodyId = Bodies(bodies).mintAndBurn(msg.sender, problemId);
        _addBody(problemId, bodyId);
    }

    function addBody(uint256 problemId, uint256 bodyId) public {
        require(ownerOf(problemId) == msg.sender, "Not owner");
        require(Bodies(bodies).ownerOf(bodyId) == msg.sender, "Not owner");
        Bodies(bodies).burn(bodyId);
        _addBody(problemId, bodyId);
    }

    function removeBody(uint256 problemId, uint256 bodyId) public {
        require(ownerOf(problemId) == msg.sender, "Not owner");
        Bodies(bodies).problemMint(msg.sender, bodyId);
        emit bodyRemoved(
            problemId,
            problems[problemId].ticks,
            bodyId,
            problems[problemId].seed
        );
        uint256 bodyIndex = problems[problemId].bodyData[bodyId].bodyIndex;
        problems[problemId].bodies--;
        problems[problemId].bodyIds = removeElement(
            problems[problemId].bodyIds,
            bodyIndex
        );
        delete problems[problemId].bodyData[bodyId];
    }

    function removeElement(
        uint256[10] memory array,
        uint256 index
    ) internal pure returns (uint256[10] memory) {
        for (uint256 i = index; i < array.length - 1; i++) {
            array[i] = array[i + 1];
        }
        delete array[array.length - 1];
        return array;
    }

    function _addBody(uint256 problemId, uint256 bodyId) internal {
        bytes32 bodySeed = Bodies(bodies).seeds(bodyId);
        uint256 tick = problems[problemId].ticks;
        Body memory bodyData;
        uint256 i = problems[problemId].bodies;
        bodyData = getRandomValues(bodyId, bodySeed, i);
        problems[problemId].bodyData[bodyId] = bodyData;
        problems[problemId].bodyIds[i] = bodyId;
        problems[problemId].bodies++;
        emit bodyAdded(
            problemId,
            tick,
            bodyData.px,
            bodyData.py,
            bodyData.radius,
            bodySeed
        );
    }

    function getRand(uint256 blockNumber) public view returns (bytes32) {
        return keccak256(abi.encodePacked(blockhash(blockNumber)));
    }

    // NOTE: this function uses i as input for radius, which means it's possible
    // for an owner to remove a body at index 0 and add back with a greater index
    // the greater index may collide with the index originally used or another body
    // the result is that there may be bodies with the same radius which is acceptable
    function getRandomValues(
        uint256 bodyId,
        bytes32 seed,
        uint256 i
    ) public pure returns (Body memory) {
        Body memory body;
        body.seed = seed;

        bytes32 rand = keccak256(abi.encodePacked(seed, i));
        uint256 x = randomRange(0, windowWidth, rand);
        rand = keccak256(abi.encodePacked(rand));
        uint256 y = randomRange(0, windowWidth, rand);
        uint256 r = (maxRadius - i) * scalingFactor;

        body.bodyId = bodyId;
        body.px = x;
        body.py = y;
        body.radius = r;
        body.bodyIndex = i;

        return body;
    }

    function randomRange(
        uint256 min,
        uint256 max,
        bytes32 rand
    ) internal pure returns (uint256) {
        return min + (uint256(rand) % (max - min));
    }

    function solveProblem(
        uint256 problemId,
        uint256 tickCount,
        uint[2] memory a,
        uint[2][2] memory b,
        uint[2] memory c,
        uint[] memory input
    ) public {
        uint256 numberOfBodies = problems[problemId].bodies;
        uint256 numberOfInputs = numberOfBodies * 5 * 2;
        require(input.length == numberOfInputs, "Invalid input length");
        address verifier = verifiers[numberOfBodies][tickCount];

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

        Problem storage problem = problems[problemId];
        problem.ticks += tickCount;
        Ticks(ticks).mint(msg.sender, tickCount);

        for (uint256 i = 0; i < numberOfBodies; i++) {
            // px
            // confirm previously stored values were used as input to the proof
            require(
                problem.bodyData[i].px == input[i * numberOfBodies + 0],
                "Invalid position"
            );
            // update stored values
            problem.bodyData[i].px = input[
                5 * numberOfBodies + i * numberOfBodies + 0
            ];

            // py
            // confirm previously stored values were used as input to the proof
            require(
                problem.bodyData[i].py == input[i * numberOfBodies + 1],
                "Invalid position"
            );
            // update stored values
            problem.bodyData[i].py = input[
                5 * numberOfBodies + i * numberOfBodies + 1
            ];

            // vx
            // confirm previously stored values were used as input to the proof
            require(
                problem.bodyData[i].vx == input[i * numberOfBodies + 2],
                "Invalid position"
            );
            // update stored values
            problem.bodyData[i].vx = input[
                5 * numberOfBodies + i * numberOfBodies + 2
            ];

            // vy
            // confirm previously stored values were used as input to the proof
            require(
                problem.bodyData[i].vy == input[i * numberOfBodies + 3],
                "Invalid position"
            );
            // update stored values
            problem.bodyData[i].vy = input[
                5 * numberOfBodies + i * numberOfBodies + 3
            ];

            // radius
            // confirm previously stored values were used as input to the proof
            require(
                problem.bodyData[i].radius == input[i * numberOfBodies + 4],
                "Invalid position"
            );
            // update stored values
            problem.bodyData[i].radius = input[
                5 * numberOfBodies + i * numberOfBodies + 4
            ];
        }
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
