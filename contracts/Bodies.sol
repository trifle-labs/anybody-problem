// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./Problems.sol";
import "./BodyMetadata.sol";

// import "hardhat/console.sol";

contract Bodies is ERC721, Ownable {
    address payable public problems;
    address public bodyMetadata;

    struct Body {
        uint256 problemId;
        uint256 mintedBodyIndex;
        bytes32 seed;
    }
    mapping(uint256 => Body) public bodies;

    uint256 public counter;
    uint256 public constant decimals = 10 ** 18;

    event bodyBorn(
        uint256 indexed bodyId,
        uint256 indexed problemId,
        uint256 indexed mintedBodyIndex,
        bytes32 seed,
        bool addedToProblem
    );

    modifier onlyProblems() {
        require(msg.sender == problems, "Only Problems can call");
        _;
    }

    // TODO: add back
    // event Upgrade(
    //     uint256 indexed persistBodyId,
    //     uint256 indexed burnBodyId,
    //     uint256 indexed mintedBodyIndex
    // );

    constructor(address bodyMetadata_, address payable problems_) ERC721("Bodies", "BOD") {
        updateBodyMetadataAddress(bodyMetadata_);
        updateProblemsAddress(problems_);
    }

    fallback() external {
        revert("no fallback function");
    }


    function tokenURI(
        uint256 id
    ) public view override(ERC721) returns (string memory) {
        return BodyMetadata(bodyMetadata).getBodyMetadata(id);
    }


    function updateProblemsAddress(address payable problems_) public onlyOwner {
        problems = problems_;
    }

    function updateBodyMetadataAddress(address bodyMetadata_) public onlyOwner {
        bodyMetadata = bodyMetadata_;
    }

    function generateSeed(uint256 tokenId) public view returns (bytes32) {
        return
            keccak256((abi.encodePacked(tokenId, blockhash(block.number - 1))));
    }

    function mintAndAddToProblem(
        address owner,
        uint256 problemId,
        uint256 mintedBodyIndex
    ) public onlyProblems returns (uint256 bodyId, bytes32 seed) {
        // NOTE: Problems already confirms this problem exists and is owned by the owner
        counter++; // bodyId
        seed = generateSeed(counter);
        bodies[counter] = Body({
            problemId: problemId,
            mintedBodyIndex: mintedBodyIndex,
            seed: seed
        });

        _mint(owner, counter);
        _transfer(owner, address(this), counter);
        emit bodyBorn(counter, problemId, mintedBodyIndex, seed, true);
        return (counter, seed);
    }

    function moveBodyToProblem(
        uint256 bodyId,
        address owner,
        uint256 problemId
    )
        public
        onlyProblems
        returns (uint256 mintedBodyIndex, bytes32 seed)
    {
        require(ownerOf(bodyId) == owner, "Not body owner");
        bodies[bodyId].problemId = problemId;
        _transfer(owner, address(this), bodyId);
        return (
            bodies[bodyId].mintedBodyIndex,
            bodies[bodyId].seed
        );
    }

    function moveBodyFromProblem(
        address owner,
        uint256 bodyId,
        uint256 problemId
    ) public onlyProblems {
        require(ownerOf(bodyId) == address(this), "Not body owner");
        require(bodies[bodyId].problemId == problemId, "Not in problem");
        bodies[bodyId].problemId = 0;
        _transfer(address(this), owner, bodyId);
    }

    function burn(uint256 bodyID) public onlyProblems {
        _burn(bodyID);
    }

    function problemMint(address owner, uint256 bodyId) public onlyProblems {
        _mint(owner, bodyId);
    }
}
