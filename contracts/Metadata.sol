//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

/// @title Metadata
/// @notice
/// @author @okwme
/// @dev The updateable and replaceable metadata contract

contract Metadata is Ownable {
    constructor() Ownable(msg.sender) {}

    string public baseURI = "https://";

    /// @dev sets the baseURI can only be called by the owner
    /// @param baseURI_ the new baseURI
    function setbaseURI(string memory baseURI_) public onlyOwner {
        baseURI = baseURI_;
    }

    /// @dev generates the metadata
    /// @param tokenId the tokenId
    /// @return _ the metadata
    function getMetadata(uint256 tokenId) public view returns (string memory) {
        return
            string(
                abi.encodePacked(baseURI, Strings.toString(tokenId), ".json")
            );
    }
}
