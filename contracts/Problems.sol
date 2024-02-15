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
    uint256 public startDate = 4070908800; // Thu Jan 01 2099 00:00:00 GMT+0000 (___ CEST Berlin, ___ London, ___ NYC, ___ LA)

    uint256 public problemSupply;

    address public bodies;
    address public solver;
    address public metadata;

    address public proceedRecipient;

    uint256 public price = 0.01 ether;

    // TODO: confirm bodyIndex matches anybody.js for proof generation
    struct Body {
        uint256 bodyId;
        uint256 bodyStyle;
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
        uint256 bodyCount;
        uint256 bodiesProduced;
        mapping(uint256 => Body) bodyData;
        uint256[10] bodyIds;
        uint256 tickCount;
    }

    mapping(uint256 => Problem) public problems;
    // mapping is body count to tocks to address
    mapping(uint256 => mapping(uint256 => address)) public verifiers;

    uint256 public constant maxVector = 10;
    uint256 public constant scalingFactor = 10 ** 3;
    uint256 public constant windowWidth = 1000 * scalingFactor;
    // uint256 public constant maxRadius = 13;
    uint256 public constant startingRadius = 2;

    event bodyAdded(
        uint256 problemId,
        uint256 bodyId,
        uint256 bodyStyle,
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
            require(verifiersTicks[i] > 0, "Invalid verifier tocks");
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
        // TODO: add back blockhash
        return keccak256(abi.encodePacked(tokenId)); //, blockhash(block.number - 1)));
    }

    function mint() public payable {
        mint(msg.sender, 1);
    }

    function mint(
        address recipient,
        uint256 quantity
    ) public payable initialized {
        require(quantity <= 5, "Max 5");
        require(!paused, "Paused");
        require(block.timestamp >= startDate, "Not started");
        require(msg.value == quantity * price, "Invalid price");
        // (bool sent, bytes memory data) = proceedRecipient.call{value: msg.value}("");
        (bool sent, bytes memory data) = proceedRecipient.call{
            value: msg.value
        }("");
        emit EthMoved(proceedRecipient, sent, data, msg.value);
        for (uint256 i = 0; i < quantity; i++) {
            _internalMint(recipient);
        }
    }

    function mint(address recipient) public payable initialized {
        mint(recipient, 1);
    }

    function adminMint(address recipient) public initialized onlyOwner {
        _internalMint(recipient);
    }

    function _internalMint(address recipient) internal {
        problemSupply++;
        _mint(recipient, problemSupply);

        for (uint256 i = 0; i < 3; i++) {
            uint256 bodyId = Bodies(bodies).mintAndBurn(
                recipient,
                problemSupply
            );
            _addBody(problemSupply, bodyId, i, 1);
        }
        problems[problemSupply].seed = generateSeed(problemSupply);
        problems[problemSupply].bodyCount = 3;
    }

    function mintBody(uint256 problemId) public {
        require(!paused, "Paused");
        require(ownerOf(problemId) == msg.sender, "Not problem owner");
        require(
            problems[problemId].bodyCount < 10,
            "Cannot have more than 10 bodies"
        );
        uint256 bodyId = Bodies(bodies).mintAndBurn(msg.sender, problemId);
        uint256 i = problems[problemId].bodyCount;
        _addBody(problemId, bodyId, i, 1);
    }

    function addBody(uint256 problemId, uint256 bodyId) public {
        require(!paused, "Paused");
        require(ownerOf(problemId) == msg.sender, "Not problem owner");
        require(Bodies(bodies).ownerOf(bodyId) == msg.sender, "Not body owner");
        require(
            problems[problemId].bodyCount < 10,
            "Cannot have more than 10 bodies"
        );
        Bodies(bodies).burn(bodyId);
        uint256 i = problems[problemId].bodyCount;
        _addBody(problemId, bodyId, i, 0);
    }

    function removeBody(uint256 problemId, uint256 bodyId) public {
        require(!paused, "Paused");
        require(ownerOf(problemId) == msg.sender, "Not problem owner");
        require(
            problems[problemId].bodyCount > 3,
            "Cannot have less than 3 bodies"
        );
        Bodies(bodies).problemMint(msg.sender, bodyId);
        emit bodyRemoved(
            problemId,
            problems[problemId].tickCount,
            bodyId,
            problems[problemId].seed
        );
        uint256 bodyIndex = problems[problemId].bodyData[bodyId].bodyIndex;
        problems[problemId].bodyCount--;
        problems[problemId].bodyIds = _removeElement(
            problems[problemId].bodyIds,
            bodyIndex
        );
        delete problems[problemId].bodyData[bodyId];
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

    function _addBody(
        uint256 problemId,
        uint256 bodyId,
        uint256 i,
        uint256 incrementBodiesProduced
    ) internal {
        bytes32 bodySeed = Bodies(bodies).seeds(bodyId);
        uint256 bodyStyle = Bodies(bodies).styles(bodyId);
        uint256 tickCount = problems[problemId].tickCount;
        Body memory bodyData;
        bodyData = getRandomValues(bodyId, bodySeed, bodyStyle, i);
        problems[problemId].bodyData[bodyId] = bodyData;
        problems[problemId].bodyIds[i] = bodyId;
        problems[problemId].bodyCount++;
        problems[problemId].bodiesProduced += incrementBodiesProduced;
        emit bodyAdded(
            problemId,
            bodyId,
            bodyStyle,
            tickCount,
            bodyData.px,
            bodyData.py,
            bodyData.radius,
            bodySeed
        );
    }

    // NOTE: this function uses i as input for radius, which means it's possible
    // for an owner to remove a body at index 0 and add back with a greater index
    // the greater index may collide with the index originally used or another body
    // the result is that there may be bodies with the same radius which is acceptable
    function getRandomValues(
        uint256 bodyId,
        bytes32 seed,
        uint256 bodyStyle,
        uint256 i
    ) public pure returns (Body memory) {
        Body memory body;
        body.seed = seed;

        bytes32 rand = keccak256(abi.encodePacked(seed, i));
        uint256 x = randomRange(0, windowWidth, rand);

        rand = keccak256(abi.encodePacked(rand));
        uint256 y = randomRange(0, windowWidth, rand);

        rand = keccak256(abi.encodePacked(rand));
        // console.log("rand");
        // console.logBytes32(rand);
        uint256 randRadius = randomRange(0, 3, rand);
        // console.log("randRadius");
        // console.log(randRadius);
        randRadius = (randRadius) * 5 + startingRadius;
        // console.log("randRadius");
        // console.log(randRadius);
        uint256 r = randRadius * scalingFactor;

        // console.log("maxVectorScaled");
        // console.log(maxVector * scalingFactor);
        body.bodyId = bodyId;
        body.bodyStyle = bodyStyle;
        body.px = x;
        body.py = y;
        body.vx = maxVector * scalingFactor;
        body.vy = maxVector * scalingFactor;
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
