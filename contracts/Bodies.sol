// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./Dust.sol";
import "./Problems.sol";
import "./BodyMetadata.sol";

// import "hardhat/console.sol";

contract Bodies is ERC721, Ownable {
    address payable public problems;
    address public bodyMetadata;
    address public dust;

    struct Body {
        uint256 problemId;
        uint256 mintedBodyIndex;
        uint256 starLvl;
        uint256 maxStarLvl;
        bytes32 seed;
    }
    mapping(uint256 => Body) public bodies;

    uint256 public counter;
    uint256 public constant decimals = 10 ** 18;
    uint256[10] public dustPrice = [
        0, // 1st body
        0, // 2nd body
        0, // 3rd body
        2, // 4th body
        4, // 5th body
        8, // 6th body
        16, // 7th body
        32, // 8th body
        64, // 9th body
        128 // 10th body
    ];

    uint256[10] public starLvls = [
        4, // 1st body
        4, // 2nd body
        4, // 3rd body
        4, // 4th body
        5, // 5th body
        6, // 6th body
        7, // 7th body
        8, // 8th body
        9, // 9th body
        10 // 10th body
    ];

    event bodyBorn(
        uint256 indexed bodyId,
        uint256 indexed problemId,
        uint256 indexed mintedBodyIndex,
        uint256 maxStarLvl,
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

    function updateDustPrice(uint256 index, uint256 price) public onlyOwner {
        require(index < 10, "Invalid index");
        dustPrice[index] = price;
    }

    function updateBodyMaxStarLvl(uint256 index, uint256 maxStarLvl) public onlyOwner {
        require(index < 10, "Invalid index");
        starLvls[index] = maxStarLvl;
    }

    function updateProblemsAddress(address payable problems_) public onlyOwner {
        problems = problems_;
    }

    function updateBodyMetadataAddress(address bodyMetadata_) public onlyOwner {
        bodyMetadata = bodyMetadata_;
    }

    function updateDustAddress(address dust_) public onlyOwner {
        dust = dust_;
    }

    function generateSeed(uint256 tokenId) public view returns (bytes32) {
        return
            keccak256((abi.encodePacked(tokenId, blockhash(block.number - 1))));
    }

    function processPayment(address from, uint256 mintedBodyIndex) internal {
        require(mintedBodyIndex < 10, "Problem already minted 10 bodies");
        uint256 problemPrice = dustPrice[mintedBodyIndex] * decimals;
        if (problemPrice > 0) {
            Dust(dust).burn(from, problemPrice);
        }
    }

    function mint(
        address owner,
        uint256 problemId,
        uint256 mintedBodyIndex
    ) public onlyProblems {
        // TODO: combine ownerOf with BodiesProduced with previous external read to reduce cost
        processPayment(owner, mintedBodyIndex);
        counter++; // bodyId
        bodies[counter] = Body({
            problemId: 0,
            mintedBodyIndex: mintedBodyIndex,
            starLvl: 0,
            maxStarLvl: starLvls[mintedBodyIndex],
            seed: generateSeed(counter)
        });
        _mint(owner, counter);
        emit bodyBorn(
            counter,
            problemId,
            mintedBodyIndex,
            starLvls[mintedBodyIndex],
            bodies[counter].seed,
            false
        );
    }

    function mintAndAddToProblem(
        address owner,
        uint256 problemId,
        uint256 mintedBodyIndex
    ) public onlyProblems returns (uint256 bodyId, uint256 maxStarLvl, bytes32 seed) {
        // NOTE: Problems already confirms this problem exists and is owned by the owner
        processPayment(owner, mintedBodyIndex);
        counter++; // bodyId
        maxStarLvl = starLvls[mintedBodyIndex];
        seed = generateSeed(counter);
        bodies[counter] = Body({
            problemId: problemId,
            mintedBodyIndex: mintedBodyIndex,
            starLvl: 0,
            maxStarLvl: maxStarLvl,
            seed: seed
        });

        _mint(owner, counter);
        _transfer(owner, address(this), counter);
        emit bodyBorn(counter, problemId, mintedBodyIndex, maxStarLvl, seed, true);
        return (counter, maxStarLvl, seed);
    }

    function moveBodyToProblem(
        uint256 bodyId,
        address owner,
        uint256 problemId
    )
        public
        onlyProblems
        returns (uint256 mintedBodyIndex, uint256 starLvl, uint256 maxStarLvl, bytes32 seed)
    {
        require(ownerOf(bodyId) == owner, "Not body owner");
        bodies[bodyId].problemId = problemId;
        _transfer(owner, address(this), bodyId);
        return (
            bodies[bodyId].mintedBodyIndex,
            bodies[bodyId].starLvl,
            bodies[bodyId].maxStarLvl,
            bodies[bodyId].seed
        );
    }

    // NOTE: At this moment, it is possible for a body to reach star level but not be cemented in the
    // problem. It allows people to "solve" a body, then sell the star version to someone else.
    // UPDATE: I think this is an impossible situation to get into since bodies are converted
    // to stars in the solver contract as soon as they occur.
    // TODO: Decide whether we like this mechanic or not.
    function moveBodyFromProblem(
        address owner,
        uint256 bodyId,
        uint256 problemId,
        uint256 starLvl
    ) public onlyProblems {
        require(ownerOf(bodyId) == address(this), "Not body owner");
        require(bodies[bodyId].problemId == problemId, "Not in problem");
        bodies[bodyId].problemId = 0;
        bodies[bodyId].starLvl = starLvl;
        _transfer(address(this), owner, bodyId);
    }

    function burn(uint256 bodyID) public onlyProblems {
        _burn(bodyID);
    }

    function problemMint(address owner, uint256 bodyId) public onlyProblems {
        _mint(owner, bodyId);
    }
}
