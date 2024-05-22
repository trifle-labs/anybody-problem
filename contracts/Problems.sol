// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./ProblemMetadata.sol";

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./Bodies.sol";
import "./Solver.sol";

import "hardhat/console.sol";

contract Problems is ERC721, Ownable {
    bool public paused;
    // TODO: update with actual start date
    uint256 public startDate = 0; //4070908800; // Thu Jan 01 2099 00:00:00 GMT+0000 (___ CEST Berlin, ___ London, ___ NYC, ___ LA)
    uint256 constant public SECONDS_IN_A_DAY = 86400;
    uint256 constant public MAX_BODY_COUNT = 3; // TODO: change back to 10
    uint256 public problemSupply;

    address public bodies;
    address public solver;
    address public problemMetadata;

    address public proceedRecipient;

    uint256 public price = 0.01 ether;

    // TODO: confirm bodyIndex matches anybody.js for proof generation
    struct Body {
        uint256 bodyId;
        uint256 mintedBodyIndex;
        uint256 bodyIndex;
        uint256 px;
        uint256 py;
        uint256 vx;
        uint256 vy;
        uint256 radius;
        bytes32 seed;
    }

    struct Problem {
        bool solved;
        bytes32 seed;
        uint256 day;
        uint256 bodyCount;
        uint256 mintedBodiesIndex;
        mapping(uint256 => Body) bodyData;
        uint256[10] bodyIds;
        uint256[10] times;
        uint256 tickCount;
    }

    mapping(uint256 => Problem) public problems;
    // mapping is body count to tickcount to address
    mapping(uint256 => mapping(uint256 => address)) public verifiers;

    uint256 public constant maxVector = 10;
    uint256 public constant scalingFactor = 10 ** 3;
    uint256 public constant windowWidth = 1000 * scalingFactor;
    // uint256 public constant maxRadius = 13;
    uint256 public constant startingRadius = 2;

    event problemCreated(
        uint256 problemId,
        uint256 day,
        bytes32 seed
    );

    event bodyAdded(
        uint256 problemId,
        uint256 bodyId,
        uint256 mintedBodyIndex,
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

    modifier notWhileInPlay(uint256 problemId) {
        require(!Solver(solver).inProgress(problemId), "Problem currently in play");
        _;
    }

    modifier onlySolver() {
        require(msg.sender == solver, "Only Solver can call");
        _;
    }

    modifier initialized() {
        require(solver != address(0), "Not initialized");
        require(bodies != address(0), "Not initialized");
        require(problemMetadata != address(0), "Not initialized");
        require(proceedRecipient != address(0), "Not initialized");
        _;
    }

    event EthMoved(
        address indexed to,
        bool indexed success,
        bytes returnData,
        uint256 amount
    );

    constructor(
        address problemMetadata_,
        address[] memory verifiers_,
        uint256[] memory verifiersTicks,
        uint256[] memory verifiersBodies
    ) ERC721("Anybody Problem", "ANY") {
        require(problemMetadata_ != address(0), "Invalid problemMetadata");
        proceedRecipient = msg.sender;
        problemMetadata = problemMetadata_;
        for (uint256 i = 0; i < verifiers_.length; i++) {
            require(verifiersTicks[i] > 0, "Invalid verifier");
            require(verifiers_[i] != address(0), "Invalid verifier");
            verifiers[verifiersBodies[i]][verifiersTicks[i]] = verifiers_[i];
        }
    }

    receive() external payable {
        mint();
    }

    function currentDay() public view returns (uint256) {
        return block.timestamp - (block.timestamp % SECONDS_IN_A_DAY);
    }

    function tokenURI(
        uint256 id
    ) public view override(ERC721) returns (string memory) {
        return ProblemMetadata(problemMetadata).getProblemMetadata(id);
    }

    function updatePrice(uint256 price_) public onlyOwner {
        price = price_;
    }

    function updatePaused(bool paused_) public onlyOwner {
        paused = paused_;
    }

    function updateStartDate(uint256 startDate_) public onlyOwner {
        startDate = startDate_;
    }

    function updateVerifier(
        address verifier_,
        uint256 verifierBodies,
        uint256 verifierTicks
    ) public onlyOwner {
        verifiers[verifierBodies][verifierTicks] = verifier_;
    }

    function updateSolverAddress(address solver_) public onlyOwner {
        solver = solver_;
    }

    function updateProblemMetadataAddress(address problemMetadata_) public onlyOwner {
        problemMetadata = problemMetadata_;
    }

    function updateBodiesAddress(address bodies_) public onlyOwner {
        bodies = bodies_;
    }

    function updateProceedRecipientAddress(
        address proceedRecipient_
    ) public onlyOwner {
        proceedRecipient = proceedRecipient_;
    }

    function generateSeed(uint256 tokenId) internal view returns (bytes32) {
        return
            keccak256(abi.encodePacked(tokenId, blockhash(block.number - 1)));
    }

    function mint() public payable {
        mint(msg.sender, 1);
    }

    function mint(address recipient) public payable initialized {
        mint(recipient, 1);
    }

    function mint(
        address recipient,
        uint256 quantity
    ) public payable initialized {
        require(quantity <= 5, "Max 5");
        require(!paused, "Paused");
        require(block.timestamp >= startDate, "Not started");
        require(msg.value == quantity * price, "Invalid price");
        (bool sent, bytes memory data) = proceedRecipient.call{
            value: msg.value
        }("");
        emit EthMoved(proceedRecipient, sent, data, msg.value);
        for (uint256 i = 0; i < quantity; i++) {
            _internalMint(recipient);
        }
    }

    function adminMint(address recipient) public initialized onlyOwner {
        _internalMint(recipient);
    }

    function _internalMint(address recipient) internal {
        problemSupply++;
        _mint(recipient, problemSupply);
        
        problems[problemSupply].day = currentDay();
        problems[problemSupply].seed = generateSeed(problemSupply);

        emit problemCreated(problemSupply, problems[problemSupply].day, problems[problemSupply].seed);

        (uint256 bodyId, bytes32 bodySeed) = Bodies(bodies)
            .mintAndAddToProblem(
                recipient,
                problemSupply, // problemId
                0
            );
        _addBody(
            problemSupply, // problemId
            bodyId,
            0,
            bodySeed,
            0 // bodyIndex == mintedBodyIndex when minting
        );
    }

    function mintBodyToProblem(uint256 problemId) internal {
        require(!paused, "Paused");
        uint256 mintedBodyIndex = problems[problemId].mintedBodiesIndex;
        require(mintedBodyIndex < MAX_BODY_COUNT, "Problem already minted 10 bodies");
        address owner = ownerOf(problemId);
        (uint256 bodyId, bytes32 bodySeed) = Bodies(bodies)
            .mintAndAddToProblem(owner, problemId, mintedBodyIndex);
        uint256 bodyIndex = problems[problemId].bodyCount;

        _addBody(
            problemId,
            bodyId,
            mintedBodyIndex,
            bodySeed,
            bodyIndex
        );
    }

    function getLevelSeed(uint256 day, uint256 mintedBodiesIndex, uint256 bodyIndex) public pure returns (bytes32) {
        return keccak256(abi.encodePacked(day, mintedBodiesIndex, bodyIndex));
    }

    /**
     * @dev Internal function to add a body to a problem, whether that body is new or old
     * @param problemId The ID of the problem.
     * @param bodyId The ID of the body to be added.
     * @param mintedBodyIndex The nth body minted from this problem.
     * @param bodySeed The seed of the body.
     * @param bodyIndex The index of the body in the problem's body list.
     */
    function _addBody(
        uint256 problemId,
        uint256 bodyId,
        uint256 mintedBodyIndex,
        bytes32 bodySeed,
        uint256 bodyIndex
    ) internal {
        bytes32 levelSeed = getLevelSeed(problems[problemId].day, problems[problemId].mintedBodiesIndex, bodyIndex);
          bytes32 bodyIndexRand = keccak256(abi.encodePacked(problems[problemId].day, bodyIndex));
        Body memory bodyData = getRandomValues(levelSeed, bodyIndexRand);
        
        bodyData.seed = bodySeed;
        bodyData.bodyId = bodyId;
        bodyData.mintedBodyIndex = mintedBodyIndex;
        bodyData.bodyIndex = bodyIndex;

        problems[problemId].bodyData[bodyId] = bodyData;
        problems[problemId].bodyIds[bodyIndex] = bodyId;
        problems[problemId].bodyCount++;
        problems[problemId].mintedBodiesIndex += 1;

        emit bodyAdded(
            problemId,
            bodyId,
            mintedBodyIndex,
            problems[problemId].tickCount,
            bodyData.px,
            bodyData.py,
            bodyData.radius,
            bodySeed
        );
    }

        // NOTE: radius is a function of the seed of the body so it stays the
        // same no matter what problem it enters
    function genRadius(bytes32 seed) public pure returns (uint256) {
        // TODO: confirm whether radius should remain only one of 3 sizes
        uint256 randRadius = randomRange(1, 3, seed);
        randRadius = (randRadius) * 5 + startingRadius;
        return randRadius * scalingFactor;
    }

    // NOTE: this function uses a seed consisting of the day + the mintedBodyIndex + 
    // actual bodyIndex which means that all problems of the same level on the same day 
    // will have bodies with the same positions, velocities and radii.
    function getRandomValues(bytes32 rand, bytes32 bodyIndexRand) public pure returns (Body memory) {
        Body memory body;

        body.radius = genRadius(bodyIndexRand);

        rand = keccak256(abi.encodePacked(rand));
        body.px = randomRange(0, windowWidth, rand);

        rand = keccak256(abi.encodePacked(rand));
        body.py = randomRange(0, windowWidth, rand);

         // this is actually a range of -1/2 to 1/2 of maxVector since negative offset
        rand = keccak256(abi.encodePacked(rand));
        body.vx = randomRange(0, maxVector * scalingFactor, rand);

        rand = keccak256(abi.encodePacked(rand));
        body.vy = randomRange(0, maxVector * scalingFactor, rand);

        return body;
    }

    function randomRange(
        uint256 min,
        uint256 max,
        bytes32 rand
    ) internal pure returns (uint256) {
        return min + (uint256(rand) % (max - min));
    }

    function getProblemMintedBodiesIndex(
        uint256 problemId
    ) public view returns (uint256) {
        return problems[problemId].mintedBodiesIndex;
    }

    function getProblemBodyIds(
        uint256 problemId
    ) public view returns (uint256[10] memory) {
        return problems[problemId].bodyIds;
    }

    function getProblemTimes(
        uint256 problemId
    ) public view returns (uint256[10] memory) {
        return problems[problemId].times;
    }

    function getProblemBodyData(
        uint256 problemId,
        uint256 bodyId
    ) public view returns (Body memory) {
        return problems[problemId].bodyData[bodyId];
    }

    function updateProblemBodyCount(
        uint256 problemId,
        uint256 bodyCount
    ) public onlySolver {
        problems[problemId].bodyCount = bodyCount;
    }

    function updateProblemBodyIds(
        uint256 problemId,
        uint256[10] memory bodyIds
    ) public onlySolver {
        problems[problemId].bodyIds = bodyIds;
    }

    function updateProblemTickCount(
        uint256 problemId,
        uint256 tickCount
    ) public onlySolver {
        problems[problemId].tickCount = tickCount;
    }

    function updateProblemBody(
        uint256 problemId,
        uint256 bodyId,
        Body memory body
    ) public onlySolver {
        problems[problemId].bodyData[bodyId] = body;
    }

    function restoreValues(uint256 problemId) public onlySolver {

      uint256 max = problems[problemId].bodyCount  == MAX_BODY_COUNT ? MAX_BODY_COUNT : problems[problemId].bodyCount - 1;
      // -1 because the newly added body is already in the correct level position
      for (uint256 i = 0; i < max; i++) {
        uint256 bodyId = problems[problemId].bodyIds[i];
        bytes32 levelSeed = getLevelSeed(problems[problemId].day, problems[problemId].mintedBodiesIndex, i);
        bytes32 bodyIndexRand = keccak256(abi.encodePacked(problems[problemId].day, i));
        Body memory bodyData = getRandomValues(levelSeed, bodyIndexRand);
        problems[problemId].bodyData[bodyId].px = bodyData.px;
        problems[problemId].bodyData[bodyId].py = bodyData.py;
        problems[problemId].bodyData[bodyId].vx = bodyData.vx;
        problems[problemId].bodyData[bodyId].vy = bodyData.vy;
        problems[problemId].bodyData[bodyId].radius = bodyData.radius;
      }
    }

    function levelUp(uint256 problemId, uint256 time) public onlySolver {
      uint256 bodyCount = problems[problemId].bodyCount;
      problems[problemId].times[bodyCount] = time;
      if (bodyCount == MAX_BODY_COUNT) {
        problemSolved(problemId);
      } else {
        mintBodyToProblem(problemId);
      }
    }

    function problemSolved(uint256 problemId) internal {
      problems[problemId].solved = true;
      for (uint256 i = 0; i < MAX_BODY_COUNT; i++) {
        uint256 bodyId = problems[problemId].bodyIds[i];
        Bodies(bodies).moveBodyFromProblem(
          ownerOf(problemId),
          bodyId,
          problemId
        );
      }
    }

    /// @dev if mint fails to send eth to splitter, admin can recover
    // This should not be necessary but Berlin hardfork broke split before so this
    // is extra precaution.
    function recoverUnsuccessfulMintPayment(
        address payable _to
    ) public onlyOwner {
        uint256 amount = address(this).balance;
        (bool sent, bytes memory data) = _to.call{value: amount}("");
        emit EthMoved(_to, sent, data, amount);
    }
}
