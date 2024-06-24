// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "hardhat/console.sol";

import "./AnybodyProblem.sol";

contract Speedruns is ERC721, Ownable {
  address payable anybodyProblem;
  constructor() ERC721("Anybody Problem Speedruns", "APS") {
    _mint(address(this), 0); // universal interface NFT
  }
  modifier onlyAnybody() {
    require(msg.sender == anybodyProblem, "Only Anybody Problem can call");
    _;
  }

  function __mint(uint256 tokenId, address to) external onlyAnybody {
    _mint(to, tokenId);
  }
  function __burn(uint256 tokenId) external onlyAnybody {
    _burn(tokenId);
  }
  function __transfer(address from, address to, uint256 tokenId) external onlyAnybody {
    _transfer(from, to, tokenId);
  }
  function __approve(address to, uint256 tokenId) external onlyAnybody {
    _approve(to, tokenId);
  }

  function updateAnybodyProblemAddress(address payable anybodyProblem_) public onlyOwner {
    anybodyProblem = anybodyProblem_;
  }

  // fallback and receive both forward undefined methods to the AnybodyProblem contract
  // this allows future functionality to be added to the NFT by augmenting AnybodyProblem
  // caveat: you lose the original msg.sender when calling the AnybodyProblem contract
  receive() external payable {
      (bool success, ) = anybodyProblem.call{value: msg.value}("");
      require(success, "Call to anybodyProblem failed");
  }
  fallback() external {
    (bool success, ) = anybodyProblem.call(msg.data);
    require(success, "Call to anybodyProblem failed");
  }

  // override all ERC721 functions to call the AnybodyProblem contract first
  function tokenURI(uint256 tokenId) public view override(ERC721) returns (string memory) {
    (bool success, bytes memory data) = anybodyProblem.staticcall(abi.encodeWithSignature("speedrunsTokenURI(uint256)", tokenId));
    if (success) {
      return abi.decode(data, (string));
    } else {
      return super.tokenURI(tokenId);
    }
  }
  function supportsInterface(bytes4 interfaceId) public view override(ERC721) returns (bool) {
    (bool success, bytes memory data) = anybodyProblem.staticcall(abi.encodeWithSignature("speedrunsSupportsInterface(bytes4)", interfaceId));
    if (success) {
      return abi.decode(data, (bool));
    } else {
      return super.supportsInterface(interfaceId);
    }
  }
  function name() public view override(ERC721) returns (string memory) {
    (bool success, bytes memory data) = anybodyProblem.staticcall(abi.encodeWithSignature("speedrunsName()"));
    if (success) {
      return abi.decode(data, (string));
    } else {
      return super.name();
    }
  }
  function symbol() public view override(ERC721) returns (string memory) {
    (bool success, bytes memory data) = anybodyProblem.staticcall(abi.encodeWithSignature("speedrunsSymbol()"));
    if (success) {
      return abi.decode(data, (string));
    } else {
      return super.symbol();
    }
  }
  function getApproved(uint256 tokenId) public view override(ERC721) returns (address) {
    (bool success, bytes memory data) = anybodyProblem.staticcall(abi.encodeWithSignature("speedrunsGetApproved(uint256)", tokenId));
    if (success) {
      return abi.decode(data, (address));
    } else {
      return super.getApproved(tokenId);
    }
  }
  function isApprovedForAll(address owner, address operator) public view override(ERC721) returns (bool) {
    (bool success, bytes memory data) = anybodyProblem.staticcall(abi.encodeWithSignature("speedrunsIsApprovedForAll(address,address)", owner, operator));
    if (success) {
      return abi.decode(data, (bool));
    } else {
      return super.isApprovedForAll(owner, operator);
    }
  }
  function approve(address to, uint256 tokenId) public override(ERC721) {
    (bool success, bytes memory data) = anybodyProblem.call(abi.encodeWithSignature("speedrunsApprove(address,uint256)", to, tokenId));
    if (!success) {
      return super.approve(to, tokenId);
    }
  }
  function setApprovalForAll(address operator, bool approved) public override(ERC721) {
    (bool success, bytes memory data) = anybodyProblem.call(abi.encodeWithSignature("speedrunsSetApprovalForAll(address,bool)", operator, approved));
    if (!success) {
      return super.setApprovalForAll(operator, approved);
    }
  }
  function transferFrom(address from, address to, uint256 tokenId) public override(ERC721) {
    (bool success, bytes memory data) = anybodyProblem.call(abi.encodeWithSignature("speedrunsTransferFrom(address,address,uint256)", from, to, tokenId));
    if (!success) {
      return super.transferFrom(from, to, tokenId);
    }
  }
  function safeTransferFrom(address from, address to, uint256 tokenId) public override(ERC721) {
    (bool success, bytes memory data) = anybodyProblem.call(abi.encodeWithSignature("speedrunsSafeTransferFrom(address,address,uint256)", from, to, tokenId));
    if (!success) {
      return super.safeTransferFrom(from, to, tokenId);
    }
  }
  function safeTransferFrom(address from, address to, uint256 tokenId, bytes memory _data) public override(ERC721) {
    (bool success, bytes memory data) = anybodyProblem.call(abi.encodeWithSignature("speedrunsSafeTransferFrom(address,address,uint256)", from, to, tokenId, _data));
    if (!success) {
      return super.safeTransferFrom(from, to, tokenId, _data);
    }
  }

function emitGenericEvent(bytes32[] calldata topics, bytes calldata logData) external onlyAnybody {
    require(topics.length <= 4, "Too many topics");
    assembly {
        // Allocate memory for the logData
        let dataPtr := mload(0x40)
        let logDataLength := logData.length
        calldatacopy(dataPtr, logData.offset, logDataLength)

        // Updating the free mem pointer (probably not needed)
        mstore(0x40, add(dataPtr, logDataLength))

        let topicsLength := topics.length
        switch topicsLength
        case 0 {
            log0(dataPtr, logDataLength)
        }
        case 1 {
            log1(dataPtr, logDataLength, calldataload(topics.offset))
        }
        case 2 {
            log2(dataPtr, logDataLength, calldataload(topics.offset), calldataload(add(topics.offset, 32)))
        }
        case 3 {
            log3(dataPtr, logDataLength, calldataload(topics.offset), calldataload(add(topics.offset, 32)), calldataload(add(topics.offset, 64)))
        }
        case 4 {
            log4(dataPtr, logDataLength, calldataload(topics.offset), calldataload(add(topics.offset, 32)), calldataload(add(topics.offset, 64)), calldataload(add(topics.offset, 96)))
        }
    }
  }

}
