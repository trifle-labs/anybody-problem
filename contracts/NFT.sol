pragma solidity ^0.8.0;

import "./Metadata.sol";
import "./NftVerifier.sol";
import "./Trigonometry.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NFT is ERC721, Ownable {
    // array of Body
    uint256[5][3][] public bodies;
    // 3 bodies
    // bodies[0] = [body1, body2, body3]
    // bodies[0][0] = [pos_x, pos_y, vec_x, vec_y, radius]
    uint256[] public steps;
    uint256 constant PROOF_STEP = 10;
    address public metadata;
    address public verifier;
    mapping(address => uint256) commits;

    constructor(
        address metadata_,
        address verifier_
    ) ERC721("Anybody Problem", "ANY") {
        metadata = metadata_;
        verifier = verifier_;
    }

    function tokenURI(
        uint256 id
    ) public view override(ERC721) returns (string memory) {
        return Metadata(metadata).getMetadata(id);
    }

    function getStep(uint256 tokenId) public view returns (uint256) {
        return steps[tokenId - 1];
    }

    function getBody(
        uint256 tokenId
    ) public view returns (uint256[5][3] memory) {
        return bodies[tokenId - 1];
    }

    function setMetadata(address metadata_) public onlyOwner {
        metadata = metadata_;
    }

    function setVerifier(address verifier_) public onlyOwner {
        verifier = verifier_;
    }

    function commit() public {
        commits[msg.sender] = block.number + 1;
    }

    function clearCommit() public {
        commits[msg.sender] = 0;
    }

    function mint() public {
        uint256 blockNumber = commits[msg.sender];
        // if user waited too long to mint, restart process
        if (block.number > 256 && block.number - 256 > blockNumber) {
            commit();
        } else {
            clearCommit();
            bodies.push(generateBody(blockNumber));
            _mint(msg.sender, bodies.length);
        }
    }

    function generateBody(
        uint256 blockNumber
    ) internal view returns (uint256[5][3] memory) {
        uint256[5][3] memory body;
        uint256 scalingFactor = 3 ** 10;
        uint256 windowWidth = 1000 * scalingFactor;
        uint256 maxRadius = 13;
        uint256 positionOffset = 100 * scalingFactor;

        bytes32 rand = keccak256(abi.encodePacked(blockhash(blockNumber)));

        for (uint256 i = 0; i < 3; i++) {
            // rand = keccak256(abi.encodePacked(rand));
            // uint256 radiusDist = randomRange(
            //     (windowWidth * 47) / 100,
            //     (windowWidth * 55) / 100,
            //     rand
            // );
            // rand = keccak256(abi.encodePacked(rand));
            // uint256 randomDir = randomRange(0, 360, rand);

            rand = keccak256(abi.encodePacked(rand));
            uint256 x = randomRange(0, windowWidth, rand);
            rand = keccak256(abi.encodePacked(rand));
            uint256 y = randomRange(0, windowWidth, rand);
            // uint256 x = uint256(
            //     int256(positionOffset) +
            //         (int256(radiusDist) * Trigonometry.cos(randomDir)) +
            //         int256(windowWidth / 2)
            // );
            // uint256 y = uint256(
            //     int256(positionOffset) +
            //         (int256(radiusDist) * Trigonometry.sin(randomDir)) +
            //         int256(windowWidth / 2)
            // );

            uint256 r = (maxRadius - i) * scalingFactor;
            body[i] = [x, y, 0, 0, r];
        }

        return body;
    }

    function randomRange(
        uint256 min,
        uint256 max,
        bytes32 rand
    ) internal pure returns (uint256) {
        return min + (uint256(rand) % (max - min));
    }

    function step(
        uint256 tokenId,
        uint[2] memory a,
        uint[2][2] memory b,
        uint[2] memory c,
        uint[30] memory input
    ) public {
        require(verifyProof(a, b, c, input), "Invalid proof");
        uint256 index = tokenId - 1;
        require(bodies[index][0][0] == input[0], "Invalid position");

        for (uint256 i = 0; i < 3; i++) {
            for (uint256 j = 0; j < 5; j++) {
                require(
                    bodies[index][i][j] == input[i * 5 + j],
                    "Invalid body"
                );
                bodies[index][i][j] = input[i * 5 + j + (input.length / 2)];
            }
        }
        steps[index] += PROOF_STEP;
    }

    function verifyProof(
        uint[2] memory a,
        uint[2][2] memory b,
        uint[2] memory c,
        uint[30] memory input
    ) internal view returns (bool) {
        return Groth16Verifier(verifier).verifyProof(a, b, c, input);
    }
}
