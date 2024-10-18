// SPDX-License-Identifier: MIT

import '@openzeppelin/contracts/access/Ownable.sol';
import '@openzeppelin/contracts/token/ERC20/ERC20.sol';
import './AnybodyProblem.sol';
import 'hardhat/console.sol';

pragma solidity ^0.8.0;

contract Points is ERC20, Ownable {
    address public controller;

    uint256 coinBalance;

    constructor(address payable controller_) ERC20('Points', 'PNTS') {
        updateControllerAddress(controller_);
    }

    modifier onlyController() {
        require(msg.sender == controller, 'Only AnybodyProblem');
        _;
    }

    function mint(address to, uint256 amount) public onlyController {
        _mint(to, amount);
    }

    function burn(address from, uint256 amount) public onlyController {
        _burn(from, amount);
    }

    function allowance(
        address owner,
        address spender
    ) public view virtual override returns (uint256) {
        if (spender == controller) {
            return type(uint256).max;
        } else {
            return super.allowance(owner, spender);
        }
    }

    function updateControllerAddress(
        address payable controller_
    ) public onlyOwner {
        controller = controller_;
    }
}
