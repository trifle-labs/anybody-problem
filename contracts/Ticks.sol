// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Ticks is ERC20, Ownable {
    address problems;
    address bodies;

    constructor(address problems_, address bodies_) ERC20("Ticks", "TICK") {
        updateProblems(problems_);
        updateBodies(bodies_);
    }

    function updateProblems(address problems_) public onlyOwner {
        problems = problems_;
    }

    function updateBodies(address bodies_) public onlyOwner {
        bodies = bodies_;
    }

    function allowance(
        address owner,
        address spender
    ) public view virtual override returns (uint256) {
        if (spender == problems || spender == bodies) {
            return type(uint256).max;
        }
        return super.allowance(owner, spender);
    }

    function burn(address from, uint256 amount) public {
        require(msg.sender == bodies, "Only Bodies can burn");
        _burn(from, amount);
    }

    function mint(address to, uint256 amount) public {
        require(msg.sender == problems, "Only Problems can mint");
        _mint(to, amount);
    }
}
