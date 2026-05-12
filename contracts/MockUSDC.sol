// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import '@openzeppelin/contracts/token/ERC20/ERC20.sol';
import '@openzeppelin/contracts/access/Ownable.sol';

/// @notice 6-decimal ERC20 used as a USDC stand-in on local networks.
/// Anyone can mint to themselves so tests and local frontends can fund accounts.
contract MockUSDC is ERC20, Ownable {
    constructor() ERC20('Mock USDC', 'USDC') {}

    function decimals() public pure override returns (uint8) {
        return 6;
    }

    function mint(address to, uint256 amount) external {
        _mint(to, amount);
    }
}
