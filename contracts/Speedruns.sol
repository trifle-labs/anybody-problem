// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import '@openzeppelin/contracts/token/ERC1155/ERC1155.sol';
import '@openzeppelin/contracts/access/Ownable.sol';
import 'hardhat/console.sol';

import './AnybodyProblem.sol';

contract Speedruns is ERC1155, Ownable {
    address payable public anybodyProblem;

    constructor() ERC1155('') {}

    modifier onlyAnybody() {
        require(msg.sender == anybodyProblem, 'Only Anybody Problem can call');
        _;
    }

    function __mint(
        address to,
        uint256 id,
        uint256 amount,
        bytes memory data
    ) external onlyAnybody {
        _mint(to, id, amount, data);
    }

    function __burn(
        address from,
        uint256 id,
        uint256 amount
    ) external onlyAnybody {
        _burn(from, id, amount);
    }

    function __safeTransferFrom(
        address from,
        address to,
        uint256 tokenId,
        uint256 amount,
        bytes memory data
    ) external onlyAnybody {
        _safeTransferFrom(from, to, tokenId, amount, data);
    }

    function __setApprovalForAll(
        address owner,
        address operator,
        bool approved
    ) external onlyAnybody {
        _setApprovalForAll(owner, operator, approved);
    }

    function updateAnybodyProblemAddress(
        address payable anybodyProblem_
    ) public onlyOwner {
        anybodyProblem = anybodyProblem_;
    }

    // fallback and receive both forward undefined methods to the AnybodyProblem contract
    // this allows future functionality to be added to the NFT by augmenting AnybodyProblem
    // caveat: you lose the original msg.sender when calling the AnybodyProblem contract
    receive() external payable {
        (bool success, ) = anybodyProblem.call{value: msg.value}('');
        require(success, 'Call to anybodyProblem failed');
    }

    fallback() external {
        (bool success, ) = anybodyProblem.call(msg.data);
        require(success, 'Call to anybodyProblem failed');
    }

    // override all ERC1155 functions to call the AnybodyProblem contract first
    function uri(
        uint256 tokenId
    ) public view override(ERC1155) returns (string memory) {
        (bool success, bytes memory data) = anybodyProblem.staticcall(
            abi.encodeWithSignature('speedrunsTokenURI(uint256)', tokenId)
        );
        if (success) {
            return abi.decode(data, (string));
        } else {
            return super.uri(tokenId);
        }
    }

    function supportsInterface(
        bytes4 interfaceId
    ) public view override(ERC1155) returns (bool) {
        (bool success, bytes memory data) = anybodyProblem.staticcall(
            abi.encodeWithSignature(
                'speedrunsSupportsInterface(bytes4)',
                interfaceId
            )
        );
        if (success) {
            return abi.decode(data, (bool));
        } else {
            return super.supportsInterface(interfaceId);
        }
    }

    function isApprovedForAll(
        address account,
        address operator
    ) public view override(ERC1155) returns (bool) {
        (bool success, bytes memory data) = anybodyProblem.staticcall(
            abi.encodeWithSignature(
                'speedrunsIsApprovedForAll(address,address)',
                account,
                operator
            )
        );
        if (success) {
            return abi.decode(data, (bool));
        } else {
            return super.isApprovedForAll(account, operator);
        }
    }

    function setApprovalForAll(
        address operator,
        bool approved
    ) public override(ERC1155) {
        (bool success, bytes memory data) = anybodyProblem.call(
            abi.encodeWithSignature(
                'speedrunsSetApprovalForAll(address,bool)',
                operator,
                approved
            )
        );
        if (!success) {
            return super.setApprovalForAll(operator, approved);
        }
    }

    function safeTransferFrom(
        address from,
        address to,
        uint256 tokenId,
        uint256 amount,
        bytes memory data
    ) public override(ERC1155) {
        (bool success, ) = anybodyProblem.call(
            abi.encodeWithSignature(
                'speedrunsSafeTransferFrom(address,address,uint256,uint256,bytes)',
                from,
                to,
                tokenId,
                amount,
                data
            )
        );
        if (!success) {
            return super.safeTransferFrom(from, to, tokenId, amount, data);
        }
    }

    function emitGenericEvent(
        bytes32[] calldata topics,
        bytes calldata logData
    ) external onlyAnybody {
        require(topics.length <= 4, 'Too many topics');
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
                log2(
                    dataPtr,
                    logDataLength,
                    calldataload(topics.offset),
                    calldataload(add(topics.offset, 32))
                )
            }
            case 3 {
                log3(
                    dataPtr,
                    logDataLength,
                    calldataload(topics.offset),
                    calldataload(add(topics.offset, 32)),
                    calldataload(add(topics.offset, 64))
                )
            }
            case 4 {
                log4(
                    dataPtr,
                    logDataLength,
                    calldataload(topics.offset),
                    calldataload(add(topics.offset, 32)),
                    calldataload(add(topics.offset, 64)),
                    calldataload(add(topics.offset, 96))
                )
            }
        }
    }
}
