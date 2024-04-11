// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Metadata.sol";

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./Bodies.sol";
import "./Solver.sol";

import "hardhat/console.sol";

contract Problems is ERC721, Ownable {
    bool public paused;
    // TODO: update with actual start date
    uint256 public startDate = 0; //4070908800; // Thu Jan 01 2099 00:00:00 GMT+0000 (___ CEST Berlin, ___ London, ___ NYC, ___ LA)

    uint256 public problemSupply;

    address public bodies;
    address public solver;
    address public metadata;

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
        uint256 starLvl;
        uint256 maxStarLvl;
        bytes32 seed;
    }

    struct Problem {
        bytes32 seed;
        uint256 bodyCount;
        uint256 mintedBodiesIndex;
        Body[] starData;
        mapping(uint256 => Body) bodyData;
        uint256[10] bodyIds;
        uint256 tickCount;
    }

    mapping(uint256 => Problem) public problems;
    // mapping is body count to dust to address
    mapping(uint256 => mapping(uint256 => address)) public verifiers;

    uint256 public constant maxVector = 10;
    uint256 public constant scalingFactor = 10 ** 3;
    uint256 public constant windowWidth = 1000 * scalingFactor;
    // uint256 public constant maxRadius = 13;
    uint256 public constant startingRadius = 2;

    event bodyAdded(
        uint256 problemId,
        uint256 bodyId,
        uint256 mintedBodyIndex,
        uint256 tick,
        uint256 px,
        uint256 py,
        uint256 radius,
        uint256 starLvl,
        uint256 maxStarLvl,
        bytes32 seed
    );

    event bodyRemoved(
        uint256 problemId,
        uint256 tick,
        uint256 bodyId,
        uint256 starLvl,
        uint256 maxStarLvl,
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
        require(metadata != address(0), "Not initialized");
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
        address metadata_,
        address[] memory verifiers_,
        uint256[] memory verifiersTicks,
        uint256[] memory verifiersBodies
    ) ERC721("Anybody Problem", "ANY") {
        require(metadata_ != address(0), "Invalid metadata");
        proceedRecipient = msg.sender;
        metadata = metadata_;
        for (uint256 i = 0; i < verifiers_.length; i++) {
            require(verifiersTicks[i] > 0, "Invalid verifier dust");
            require(verifiers_[i] != address(0), "Invalid verifier");
            verifiers[verifiersBodies[i]][verifiersTicks[i]] = verifiers_[i];
        }
    }

    receive() external payable {
        mint();
    }

    function tokenURI(
        uint256 id
    ) public view override(ERC721) returns (string memory) {
        return Metadata(metadata).getMetadata(id);
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

    function updateMetadataAddress(address metadata_) public onlyOwner {
        metadata = metadata_;
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

        for (
            uint256 mintedBodyIndex = 0;
            mintedBodyIndex < 3;
            mintedBodyIndex++
        ) {
            (uint256 bodyId, uint256 maxStarLvl, bytes32 bodySeed) = Bodies(bodies)
                .mintAndAddToProblem(
                    recipient,
                    problemSupply, // problemId
                    mintedBodyIndex
                );
            _addBody(
                problemSupply, // problemId
                bodyId,
                mintedBodyIndex,
                0, // starLvl is 0 for initial bodies
                maxStarLvl,
                bodySeed,
                mintedBodyIndex, // bodyIndex == mintedBodyIndex when minting
                1
            );
        }
        problems[problemSupply].seed = generateSeed(problemSupply);
        problems[problemSupply].bodyCount = 3;
    }

    function mintBodyToProblem(uint256 problemId) public notWhileInPlay(problemId) {
        require(!paused, "Paused");
        require(ownerOf(problemId) == msg.sender, "Not problem owner");
        require(
            problems[problemId].bodyCount < 10,
            "Cannot have more than 10 bodies"
        );
        uint256 mintedBodyIndex = problems[problemId].mintedBodiesIndex;
        // TODO: confirm this should be 10 instead of 9
        require(mintedBodyIndex < 10, "Problem already minted 10 bodies");
        (uint256 bodyId, uint256 maxStarLvl, bytes32 bodySeed) = Bodies(bodies)
            .mintAndAddToProblem(msg.sender, problemId, mintedBodyIndex);
        uint256 bodyIndex = problems[problemId].bodyCount;

        _addBody(
            problemId,
            bodyId,
            mintedBodyIndex,
            0,
            maxStarLvl,
            bodySeed,
            bodyIndex,
            1
        );
    }

    function mintBodyOutsideProblem(uint256 problemId) public notWhileInPlay(problemId) {
        require(!paused, "Paused");
        require(ownerOf(problemId) == msg.sender, "Not problem owner");
        require(
            problems[problemId].bodyCount < 10,
            "Cannot have more than 10 bodies"
        ); // TODO: confirm this should be 10 instead of 9
        uint256 mintedBodyIndex = problems[problemId].mintedBodiesIndex;
        require(mintedBodyIndex < 10, "Problem already minted 10 bodies");
        Bodies(bodies).mint(msg.sender, problemId, mintedBodyIndex);
        problems[problemId].mintedBodiesIndex++;
    }

    function addExistingBody(uint256 problemId, uint256 bodyId) public {
        require(!paused, "Paused");
        require(ownerOf(problemId) == msg.sender, "Not problem owner");
        require(
            problems[problemId].bodyCount < 10,
            "Cannot have more than 10 bodies"
        );
        (uint256 mintedBodyIndex, uint256 starLvl, uint256 maxStarLvl, bytes32 seed) = Bodies(bodies)
            .moveBodyToProblem(bodyId, msg.sender, problemId);
        uint256 bodyIndex = problems[problemId].bodyCount;
        _addBody(problemId, bodyId, mintedBodyIndex, starLvl, maxStarLvl, seed, bodyIndex, 0);
    }

    function convertBodiesToStars(uint256 problemId) public notWhileInPlay(problemId) {
        require(ownerOf(problemId) == msg.sender, "Not problem owner");
        for (uint256 i = 0; i < problems[problemId].bodyCount; i++) {
            uint256 bodyId = problems[problemId].bodyIds[i];
            if (problems[problemId].bodyData[bodyId].starLvl == problems[problemId].bodyData[bodyId].maxStarLvl) {
                Body memory bodyData = problems[problemId].bodyData[bodyId];
                internalRemoveBody(problemId, bodyId);
                problems[problemId].starData.push(bodyData);
            }
        }
    }

    function removeBody(uint256 problemId, uint256 bodyId) public notWhileInPlay(problemId) {
        require(
            problems[problemId].bodyCount > 3,
            "Cannot have less than 3 bodies"
        );
        require(ownerOf(problemId) == msg.sender, "Not problem owner");
        internalRemoveBody(problemId, bodyId);
    }

    function internalRemoveBody(uint256 problemId, uint256 bodyId) internal {
        require(!paused, "Paused");

        Body memory bodyData = problems[problemId].bodyData[bodyId];
        require(bodyData.bodyId == bodyId, "Body not in problem");

        Bodies(bodies).moveBodyFromProblem(
            msg.sender,
            bodyId,
            problemId,
            bodyData.starLvl
        );
        emit bodyRemoved(
            problemId,
            problems[problemId].tickCount,
            bodyId,
            bodyData.starLvl,
            bodyData.maxStarLvl,
            problems[problemId].seed
        );
        uint256 bodyIndex = problems[problemId].bodyData[bodyId].bodyIndex;
        problems[problemId].bodyCount--;
        problems[problemId].bodyIds = _removeElement(
            problems[problemId].bodyIds,
            bodyIndex
        );
        delete problems[problemId].bodyData[bodyId];

        // TODO: add tests for this
        // TODO: confirm this is necessary, maybe another way to ensure order of
        // bodies is by just sorting by ID whenever proof is generated
        for (uint256 i = bodyIndex; i < problems[problemId].bodyCount; i++) {
            problems[problemId]
                .bodyData[problems[problemId].bodyIds[i]]
                .bodyIndex = i;
        }
    }

    function _removeElement(
        uint256[10] memory array,
        uint256 index
    ) internal pure returns (uint256[10] memory) {
        for (uint256 i = index; i < array.length - 1; i++) {
            array[i] = array[i + 1];
        }
        delete array[array.length - 1];
        return array;
    }

    /**
     * @dev Internal function to add a body to a problem, whether that body is new or old
     * @param problemId The ID of the problem.
     * @param bodyId The ID of the body to be added.
     * @param mintedBodyIndex The nth body minted from this problem.
     * @param starLvl The starLvl of the body.
     * @param maxStarLvl The maxStarLvl of the body.
     * @param bodySeed The seed of the body.
     * @param bodyIndex The index of the body in the problem's body list.
     * @param incrementBodiesProduced The number of bodies produced to increment the problem's counter.
     */
    function _addBody(
        uint256 problemId,
        uint256 bodyId,
        uint256 mintedBodyIndex,
        uint256 starLvl,
        uint256 maxStarLvl,
        bytes32 bodySeed,
        uint256 bodyIndex,
        uint256 incrementBodiesProduced
    ) internal {
        // getRandomValues adds seed, px, py & radius to bodyData
        // vx and vy are left empty to be 0 when a body is added
        Body memory bodyData = getRandomValues(bodySeed);

        bodyData.bodyId = bodyId;
        bodyData.mintedBodyIndex = mintedBodyIndex;
        bodyData.starLvl = starLvl;
        bodyData.maxStarLvl = maxStarLvl;
        bodyData.bodyIndex = bodyIndex;

        problems[problemId].bodyData[bodyId] = bodyData;
        problems[problemId].bodyIds[bodyIndex] = bodyId;
        problems[problemId].bodyCount++;
        problems[problemId].mintedBodiesIndex += incrementBodiesProduced;

        emit bodyAdded(
            problemId,
            bodyId,
            mintedBodyIndex,
            problems[problemId].tickCount,
            bodyData.px,
            bodyData.py,
            bodyData.radius,
            bodyData.starLvl,
            bodyData.maxStarLvl,
            bodySeed
        );
    }

        // NOTE: radius is a function of the seed of the body so it stays the
        // same no matter what problem it enters
    function genRadius(bytes32 seed) internal pure returns (uint256) {
        // TODO: confirm whether radius should remain only one of 3 sizes
        uint256 randRadius = randomRange(1, 3, seed);
        randRadius = (randRadius) * 5 + startingRadius;
        return randRadius * scalingFactor;
    }

    // NOTE: this function uses i as input for radius, which means it's possible
    // for an owner to remove a body at index 0 and add back with a greater index
    // the greater index may collide with the index originally used or another body
    // the result is that there may be bodies with the same radius which is acceptable
    function getRandomValues(bytes32 seed) public view returns (Body memory) {
        Body memory body;
        body.seed = seed;

        uint256 r = genRadius(seed);

        // this ensures location is random each time body is added to problem
        bytes32 rand = keccak256(
            abi.encodePacked(seed, blockhash(block.number - 1))
        );
        uint256 x = randomRange(0, windowWidth, rand);

        rand = keccak256(abi.encodePacked(rand));
        uint256 y = randomRange(0, windowWidth, rand);

        body.px = x;
        body.py = y;
        body.vx = maxVector * scalingFactor; // NOTE: this is offset by maxVector so actually is 0
        body.vy = maxVector * scalingFactor; // NOTE: this is offset by maxVector so actually is 0
        body.radius = r;

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

    function getProblemBodyData(
        uint256 problemId,
        uint256 bodyId
    ) public view returns (Body memory) {
        return problems[problemId].bodyData[bodyId];
    }

    function getProblemStarData(
        uint256 problemId
    ) public view returns (Body[] memory) {
        return problems[problemId].starData;
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

    function restoreRadius(uint256 problemId) public onlySolver {
        for (uint256 i = 0; i < problems[problemId].bodyCount; i++) {
            uint256 bodyId = problems[problemId].bodyIds[i];
            problems[problemId].bodyData[bodyId].radius = genRadius(
                problems[problemId].bodyData[bodyId].seed
            );
        }
    }

    function levelUp(uint256 problemId) public onlySolver {
      uint256 deletionCount = 0;
      uint256 bodyCount = problems[problemId].bodyCount;
       for (uint256 i = 0; i < bodyCount; i++) {
            uint256 bodyId = problems[problemId].bodyIds[i - deletionCount];
            problems[problemId].bodyData[bodyId].starLvl++;
            if (problems[problemId].bodyData[bodyId].starLvl == problems[problemId].bodyData[bodyId].maxStarLvl) {
                Body memory bodyData = problems[problemId].bodyData[bodyId];
                internalRemoveBody(problemId, bodyId);
                deletionCount++;
                problems[problemId].starData.push(bodyData);
            }
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
