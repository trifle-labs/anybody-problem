// SPDX-License-Identifier: MIT

import '@openzeppelin/contracts/access/Ownable.sol';
import './Points.sol';
import './AnybodyProblem.sol';
import 'hardhat/console.sol';

pragma solidity ^0.8.0;

contract PointsController is Ownable {
    address payable public anybodyProblem;
    Points public points;
    uint256 public availableCoin;

    event EthMoved(
        address indexed to,
        bool indexed success,
        bytes returnData,
        uint256 amount
    );
    event UpdatePrice(
        address indexed player,
        uint256 priceBefore,
        uint256 pointPrice,
        int128 pointChange,
        int128 coinChange,
        uint256 pointsSupply,
        uint256 coinSupply
    );

    modifier onlyAnybodyProblem() {
        require(msg.sender == anybodyProblem, 'Only AnybodyProblem');
        _;
    }

    constructor(address payable anybodyProblem_, address points_) {
        updateAnybodyProblemAddress(anybodyProblem_);
        updatePointsAddress(points_);
    }

    function updateAnybodyProblemAddress(
        address payable anybodyProblem_
    ) public onlyOwner {
        anybodyProblem = anybodyProblem_;
    }

    function updatePointsAddress(address points_) public onlyOwner {
        points = Points(points_);
    }

    mapping(uint256 => uint256) public tmpCoin;

    function userPays(
        uint256 runId,
        uint256 amount
    ) public payable onlyAnybodyProblem {
        require(amount == msg.value, 'money not included');
        tmpCoin[runId] += amount;
    }

    function rewardPoints(
        uint256 runId,
        address player,
        uint256 amount
    ) public onlyAnybodyProblem {
        uint256 priceBefore = pointPrice();
        points.mint(player, amount);
        uint256 coin = tmpCoin[runId];
        // require(coin !== 0, 'no coin'); // NOTE: commented out in case gameplay is free
        tmpCoin[runId] = 0;
        availableCoin += coin;
        emit UpdatePrice(
            player,
            priceBefore,
            pointPrice(),
            int128(uint128(amount)),
            int128(uint128(coin)),
            points.totalSupply(),
            availableCoin
        );
    }

    function pointPrice() public view returns (uint256) {
        return points.totalSupply() / availableCoin;
    }

    function withdrawCoin(uint256 pointAmount) public {
        require(
            points.balanceOf(msg.sender) >= pointAmount,
            'not enough points'
        );
        uint256 priceBefore = pointPrice();
        address payable caller = payable(msg.sender);
        uint256 price = pointPrice();
        uint256 coinAmount = pointAmount * price;
        require(coinAmount <= availableCoin, 'not enough coin');
        points.burn(msg.sender, pointAmount);
        availableCoin -= coinAmount;
        (bool sent, bytes memory data) = caller.call{value: coinAmount}('');
        emit EthMoved(caller, sent, data, coinAmount);
        emit UpdatePrice(
            caller,
            priceBefore,
            pointPrice(),
            int128(uint128(pointAmount)),
            int128(uint128(coinAmount)),
            points.totalSupply(),
            availableCoin
        );
    }
}
