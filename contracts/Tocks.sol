// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Tocks is ERC20, Ownable {
    address public solver;
    address payable public problems;
    address public bodies;

    modifier onlySolver() {
        require(msg.sender == solver, "Only Solver can call");
        _;
    }

    modifier onlyBodies() {
        require(msg.sender == bodies, "Only Bodies can call");
        _;
    }

    constructor(
        address payable problems_,
        address bodies_
    ) ERC20("Tocks", "TOCK") {
        updateProblemsAddress(problems_);
        updateBodiesAddress(bodies_);
    }

    function updateProblemsAddress(address payable problems_) public onlyOwner {
        problems = problems_;
    }

    function updateBodiesAddress(address bodies_) public onlyOwner {
        bodies = bodies_;
    }

    function updateSolverAddress(address solver_) public onlyOwner {
        solver = solver_;
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

    function burn(address from, uint256 amount) public onlyBodies {
        _burn(from, amount);
    }

    function mint(address to, uint256 amount) public onlySolver {
        _mint(to, amount);
    }
}
