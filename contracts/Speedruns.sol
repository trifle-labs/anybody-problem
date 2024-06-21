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
    (bool success, bytes memory data) = anybodyProblem.staticcall(abi.encodeWithSignature("speedrunsTokenURI()"));
    if (success) {
      return abi.decode(data, (string));
    } else {
      return super.tokenURI(tokenId);
    }
  }
  function supportsInterface(bytes4 interfaceId) public view override(ERC721) returns (bool) {
    (bool success, bytes memory data) = anybodyProblem.staticcall(abi.encodeWithSignature("speedrunsSupportsInterface()"));
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
    (bool success, bytes memory data) = anybodyProblem.staticcall(abi.encodeWithSignature("speedrunsGetApproved()"));
    if (success) {
      return abi.decode(data, (address));
    } else {
      return super.getApproved(tokenId);
    }
  }
  function isApprovedForAll(address owner, address operator) public view override(ERC721) returns (bool) {
    (bool success, bytes memory data) = anybodyProblem.staticcall(abi.encodeWithSignature("speedrunsIsApprovedForAll()"));
    if (success) {
      return abi.decode(data, (bool));
    } else {
      return super.isApprovedForAll(owner, operator);
    }
  }
  function approve(address to, uint256 tokenId) public override(ERC721) {
    (bool success, bytes memory data) = anybodyProblem.call(abi.encodeWithSignature("speedrunsApprove()"));
    if (!success) {
      return super.approve(to, tokenId);
    }
  }
  function setApprovalForAll(address operator, bool approved) public override(ERC721) {
    (bool success, bytes memory data) = anybodyProblem.call(abi.encodeWithSignature("speedrunsSetApprovalForAll()"));
    if (!success) {
      return super.setApprovalForAll(operator, approved);
    }
  }
  function transferFrom(address from, address to, uint256 tokenId) public override(ERC721) {
    (bool success, bytes memory data) = anybodyProblem.call(abi.encodeWithSignature("speedrunsTransferFrom()"));
    if (!success) {
      return super.transferFrom(from, to, tokenId);
    }
  }
  function safeTransferFrom(address from, address to, uint256 tokenId) public override(ERC721) {
    (bool success, bytes memory data) = anybodyProblem.call(abi.encodeWithSignature("speedrunsSafeTransferFrom()"));
    if (!success) {
      return super.safeTransferFrom(from, to, tokenId);
    }
  }
  function safeTransferFrom(address from, address to, uint256 tokenId, bytes memory _data) public override(ERC721) {
    (bool success, bytes memory data) = anybodyProblem.call(abi.encodeWithSignature("speedrunsSafeTransferFrom()"));
    if (!success) {
      return super.safeTransferFrom(from, to, tokenId, _data);
    }
  }

  function emitGenericEvent(bytes32[] calldata topics, bytes calldata logData) external onlyAnybody {
    // require(topics.length <= 4, "Too many topics");
    // assembly {
    //   // Allocate memory for the logData
    //   let dataPtr := mload(0x40)
    //   let logDataLength := calldataload(logData.offset)
    //   calldatacopy(dataPtr, add(logData.offset, 32), logDataLength)

    //   // Calculate the pointer for topics, ensuring no overlap
    //   let topicsPtr := add(dataPtr, add(logDataLength, 32))
    //   let topicsLength := calldataload(topics.offset)
    //   calldatacopy(topicsPtr, add(topics.offset, 32), mul(topicsLength, 32))

    //   // Update the free memory pointer
    //   mstore(0x40, add(topicsPtr, mul(topicsLength, 32)))

    //   switch topicsLength
    //   case 0 {
    //       log0(dataPtr, logDataLength)
    //   }
    //   case 1 {
    //       log1(dataPtr, logDataLength, mload(topicsPtr))
    //   }
    //   case 2 {
    //       log2(dataPtr, logDataLength, mload(topicsPtr), mload(add(topicsPtr, 32)))
    //   }
    //   case 3 {
    //       log3(dataPtr, logDataLength, mload(topicsPtr), mload(add(topicsPtr, 32)), mload(add(topicsPtr, 64)))
    //   }
    //   case 4 {
    //       log4(dataPtr, logDataLength, mload(topicsPtr), mload(add(topicsPtr, 32)), mload(add(topicsPtr, 64)), mload(add(topicsPtr, 96)))
    //   }
    // }
  }

}
