pragma solidity ^0.8.0;

import "./Metadata.sol";
import "./NftVerifier.sol";
import "./Trigonometry.sol";
// import "./node_modules/solidity-trigonometry/Trigonometry.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NFT is Verifier, ERC721, Ownable {
    // array of Body
    uint256[5][3][] public bodies;
    // 3 bodies
    // bodies[0] = [body1, body2, body3]
    // bodies[0][0] = [pos_x, pos_y, vec_x, vec_y, radius]
    uint256[] public steps;
    uint256 constant PROOF_STEP = 10;
    address public metadata;
    mapping(address => uint256) commits;

    constructor(
        address metadata_
    ) Ownable(msg.sender) ERC721("Anybody Problem", "ANY") {
        metadata = metadata_;
    }

    function tokenURI(
        uint256 id
    ) public view override(ERC721) returns (string memory) {
        return Metadata(metadata).getMetadata(id);
    }

    function getStep(uint256 tokenId) public view returns (uint256) {
        return steps[tokenId - 1];
    }

    function setMetadata(address metadata_) public onlyOwner {
        metadata = metadata_;
    }

    function commit() public {
        commits[msg.sender] = block.number + 1;
    }

    function mint() public {
        uint256 blockNumber = commits[msg.sender];
        // if user waited too long to mint, restart process
        if (block.number - 256 > blockNumber) {
            commit();
        } else {
            commits[msg.sender] = 0;
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
            uint256 x = randomRange(0, windowWidth, rand);
            rand = keccak256(abi.encodePacked(rand));
            uint256 y = randomRange(0, windowWidth, rand);
            rand = keccak256(abi.encodePacked(rand));
            uint256 dist = randomRange(
                (windowWidth * 47) / 100,
                (windowWidth * 55) / 100,
                rand
            );
            rand = keccak256(abi.encodePacked(rand));
            uint256 angle = randomRange(0, 360, rand);
            uint256 vx = uint256(
                int256(positionOffset) +
                    (int256(dist) * Trigonometry.cos(angle)) /
                    int256(scalingFactor)
            );
            uint256 vy = uint256(
                int256(positionOffset) +
                    (int256(dist) * Trigonometry.sin(angle)) /
                    int256(scalingFactor)
            );

            uint256 r = (maxRadius - i) * scalingFactor;
            body[i] = [x, y, vx, vy, r];
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
}
