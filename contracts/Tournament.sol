// SPDX-License-Identifier: MIT

import '@openzeppelin/contracts/access/Ownable.sol';
import './AnybodyProblem.sol';
import './HitchensOrderStatisticsTreeLib.sol';

pragma solidity ^0.8.0;

contract Tournament is Ownable {
    using HitchensOrderStatisticsTreeLib for HitchensOrderStatisticsTreeLib.Tree;
    uint256 public FIRST_DAY;
    uint256 public SECONDS_IN_A_DAY;
    address payable anybodyProblem;
    event RecordBroken(
        string recordType,
        uint256 week,
        address player,
        uint256 value
    );

    struct Week {
        uint256 totalPlays;
        uint256 totalTime;
        uint256 lastUpdated;
        uint256[3] fastest;
        uint256[3] slowest;
    }

    mapping(uint256 => Week) public weeklyStats;
    mapping(uint256 => mapping(address => Week)) public weeklyStatsByPlayer;
    mapping(uint256 => HitchensOrderStatisticsTreeLib.Tree)
        public weeklyStatsSortedTree;
    mapping(uint256 => mapping(address => uint256)) public fastestByDayByPlayer; // day => player => runId
    mapping(uint256 => mapping(address => uint256[3]))
        public fastestByDayByPlayerIndex; // day => player => [fastest, 2nd fastest, 3rd fastest runId]

    struct Paidout {
        address fastest;
        address slowest;
        address average;
    }
    mapping(uint256 => Paidout) public paidOutByWeek;
    mapping(uint256 => uint256) public prizes;

    modifier onlyAnybodyProblem() {
        require(
            msg.sender == anybodyProblem,
            'Only the AnybodyProblem contract can call this function'
        );
        _;
    }

    constructor() {}

    function setVars() public onlyOwner {
        FIRST_DAY = AnybodyProblem(anybodyProblem).FIRST_DAY();
        SECONDS_IN_A_DAY = AnybodyProblem(anybodyProblem).SECONDS_IN_A_DAY();
    }

    function addToLeaderboard(uint256 runId) public onlyAnybodyProblem {
        uint256 currentWeek = dayToWeek(
            AnybodyProblem(anybodyProblem).runs(runId).day
        );
        addRunToWeeklyUserAverage(runId, currentWeek);
        addToFastestByWeekByPlayer(runId, currentWeek);
        addToSlowestByWeekByPlayer(runId, currentWeek);
    }

    function payoutAverage(uint256 week) public {
        require(paidOutByWeek[week].average == address(0), 'Already paid out');
        address winner = mostAverageByWeek(week);
        paidOutByWeek[week].average = winner;
        uint256 prizeAmount = prizes[week] / 3;
        (bool sent, ) = winner.call{value: prizeAmount}('');
        require(sent, 'Failed to send Ether');
    }

    function payoutFastest(uint256 week) public {
        require(paidOutByWeek[week].fastest == address(0), 'Already paid out');
        address winner = fastestByWeek(week);
        paidOutByWeek[week].fastest = winner;
        uint256 prizeAmount = prizes[week] / 3;
        (bool sent, ) = winner.call{value: prizeAmount}('');
        require(sent, 'Failed to send Ether');
    }

    function payoutSlowest(uint256 week) public {
        require(paidOutByWeek[week].slowest == address(0), 'Already paid out');
        address winner = slowestByWeek(week);
        paidOutByWeek[week].slowest = winner;
        uint256 prizeAmount = prizes[week] / 3;
        (bool sent, ) = winner.call{value: prizeAmount}('');
        require(sent, 'Failed to send Ether');
    }

    function fastestByWeek(uint256 week) public view returns (address winner) {}

    function slowestByWeek(uint256 week) public view returns (address winner) {}

    function mostAverageByWeek(
        uint256 week
    ) public view returns (address winner) {
        uint256 globalAverage = weeklyStats[week].totalTime /
            weeklyStats[week].totalPlays;
        return findClosestKey(globalAverage, week);
    }

    function findClosestKey(
        uint requestedValue,
        uint256 week
    ) public view returns (address closestAddress) {
        HitchensOrderStatisticsTreeLib.Tree
            storage tree = weeklyStatsSortedTree[week];
        if (tree.exists(requestedValue)) {
            // If the value exists in the tree, return the first key associated with it
            return keyToAddress(tree.valueKeyAtIndex(requestedValue, 0)); // oldest entry wins
        } else {
            // If the value doesn't exist, find the next and previous values
            uint prevValue = tree.prev(requestedValue);
            uint nextValue = tree.next(requestedValue);
            address prevAddr = keyToAddress(tree.valueKeyAtIndex(prevValue, 0)); // oldest entry wins
            address nextAddr = keyToAddress(tree.valueKeyAtIndex(nextValue, 0)); // oldest entry wins

            // Edge cases where requestedValue is outside the range of values in the tree
            if (prevValue == 0) {
                // No previous value, so return the key for the next value
                return nextAddr;
            }
            if (nextValue == 0) {
                // No next value, so return the key for the previous value
                return prevAddr;
            }

            // Now, compare which of prevValue or nextValue is closer to requestedValue
            uint diffPrev = requestedValue > prevValue
                ? requestedValue - prevValue
                : prevValue - requestedValue;
            uint diffNext = requestedValue > nextValue
                ? requestedValue - nextValue
                : nextValue - requestedValue;

            if (diffPrev < diffNext) {
                // prevValue is closer or equal, return the key associated with prevValue
                return prevAddr;
            } else if (diffNext < diffPrev) {
                // nextValue is closer, return the key associated with nextValue
                return nextAddr;
            } else {
                // return the older of the two
                uint256 prevLastUpdated = weeklyStatsByPlayer[week][prevAddr]
                    .lastUpdated;
                uint256 nextLastUpdated = weeklyStatsByPlayer[week][nextAddr]
                    .lastUpdated;
                if (prevLastUpdated < nextLastUpdated) {
                    return prevAddr;
                } else {
                    return nextAddr;
                }
            }
        }
    }

    function dayToWeek(uint256 day) public view returns (uint256) {
        return (day - FIRST_DAY) / 7;
    }

    function runs(
        uint256 runId
    ) public view returns (AnybodyProblem.Run memory) {
        return AnybodyProblem(anybodyProblem).runs(runId);
    }

    function addRunToWeeklyUserAverage(uint256 runId, uint256 week) internal {
        Week memory weekStats = weeklyStatsByPlayer[week][msg.sender];
        uint256 oldAverage = weekStats.totalTime / weekStats.totalPlays;

        weekStats.totalPlays++;
        weekStats.totalTime += runs(runId).accumulativeTime;
        weekStats.lastUpdated = AnybodyProblem(anybodyProblem)
            .counterForOrdering();
        weeklyStatsByPlayer[week][msg.sender] = weekStats;

        uint256 newAverage = weekStats.totalTime / weekStats.totalPlays;

        // if key exists, remove it
        HitchensOrderStatisticsTreeLib.Tree
            storage tree = weeklyStatsSortedTree[week];

        bytes32 userAsKey = addressToKey(msg.sender);
        if (oldAverage != 0) {
            tree.remove(userAsKey, oldAverage);
        }
        // add key with new value
        tree.insert(userAsKey, newAverage);
        // TODO: confirm that this is updated since it's storage instead of memory now
        // weeklyStatsSortedTree[week] = HitchensOrderStatisticsTreeLib.Tree();
    }

    function addressToKey(address addr) public pure returns (bytes32) {
        return bytes32(uint256(uint160(addr)));
    }

    function keyToAddress(bytes32 key) public pure returns (address) {
        return address(uint160(uint256(key)));
    }

    struct WeeklyRecord {
        address player;
        uint256 accumulativeTime;
    }

    mapping(uint256 => mapping(address => uint256[7]))
        public fastestByWeekByPlayer;
    mapping(uint256 => WeeklyRecord) public weeklyFastest;

    mapping(uint256 => mapping(address => uint256[7]))
        public slowestByWeekByPlayer;
    mapping(uint256 => WeeklyRecord) public weeklySlowest;

    function addToSlowestByWeekByPlayer(uint256 runId, uint256 week) internal {
        AnybodyProblem.Run memory run = runs(runId);
        uint256 dayOfTheWeek = (run.day - week) / SECONDS_IN_A_DAY;
        uint256 dayOfTheWeekSpeed = slowestByWeekByPlayer[week][run.owner][
            dayOfTheWeek
        ];

        if (
            dayOfTheWeekSpeed == 0 || run.accumulativeTime > dayOfTheWeekSpeed
        ) {
            slowestByWeekByPlayer[week][run.owner][dayOfTheWeek] = run
                .accumulativeTime;

            // if record is broken, ensure weekly best is checked
            uint256[3] memory best3ThisWeek;
            for (uint256 i = 0; i < 7; i++) {
                uint256 speed = slowestByWeekByPlayer[week][run.owner][i];
                if (speed == 0) {
                    continue;
                }
                if (best3ThisWeek[0] == 0) {
                    best3ThisWeek[0] = speed;
                } else if (speed > best3ThisWeek[0]) {
                    best3ThisWeek[2] = best3ThisWeek[1];
                    best3ThisWeek[1] = best3ThisWeek[0];
                    best3ThisWeek[0] = speed;
                } else if (best3ThisWeek[1] == 0) {
                    best3ThisWeek[1] = speed;
                } else if (speed > best3ThisWeek[1]) {
                    best3ThisWeek[2] = best3ThisWeek[1];
                    best3ThisWeek[1] = speed;
                } else if (speed > best3ThisWeek[2] || best3ThisWeek[2] == 0) {
                    best3ThisWeek[2] = speed;
                }
            }
            uint256 one = best3ThisWeek[0];
            uint256 two = best3ThisWeek[1];
            uint256 three = best3ThisWeek[2];
            if (one == 0 || two == 0 || three == 0) {
                return;
            }
            if (one + two + three > weeklySlowest[week].accumulativeTime) {
                weeklySlowest[week] = WeeklyRecord({
                    player: run.owner,
                    accumulativeTime: one + two + three
                });
                emit RecordBroken(
                    'slowest',
                    week,
                    run.owner,
                    one + two + three
                );
            }
        }
    }

    function addToFastestByWeekByPlayer(uint256 runId, uint256 week) internal {
        AnybodyProblem.Run memory run = runs(runId);
        uint256 dayOfTheWeek = (run.day - week) / SECONDS_IN_A_DAY;
        uint256 dayOfTheWeekSpeed = fastestByWeekByPlayer[week][run.owner][
            dayOfTheWeek
        ];

        if (
            dayOfTheWeekSpeed == 0 || run.accumulativeTime < dayOfTheWeekSpeed
        ) {
            fastestByWeekByPlayer[week][run.owner][dayOfTheWeek] = run
                .accumulativeTime;

            // if record is broken, ensure weekly best is checked
            uint256[3] memory best3ThisWeek;
            for (uint256 i = 0; i < 7; i++) {
                uint256 speed = fastestByWeekByPlayer[week][run.owner][i];
                if (speed == 0) {
                    continue;
                }
                if (best3ThisWeek[0] == 0) {
                    best3ThisWeek[0] = speed;
                } else if (speed < best3ThisWeek[0]) {
                    best3ThisWeek[2] = best3ThisWeek[1];
                    best3ThisWeek[1] = best3ThisWeek[0];
                    best3ThisWeek[0] = speed;
                } else if (best3ThisWeek[1] == 0) {
                    best3ThisWeek[1] = speed;
                } else if (speed < best3ThisWeek[1]) {
                    best3ThisWeek[2] = best3ThisWeek[1];
                    best3ThisWeek[1] = speed;
                } else if (speed < best3ThisWeek[2] || best3ThisWeek[2] == 0) {
                    best3ThisWeek[2] = speed;
                }
            }
            uint256 one = best3ThisWeek[0];
            uint256 two = best3ThisWeek[1];
            uint256 three = best3ThisWeek[2];
            if (one == 0 || two == 0 || three == 0) {
                return;
            }
            if (one + two + three < weeklyFastest[week].accumulativeTime) {
                weeklyFastest[week] = WeeklyRecord({
                    player: run.owner,
                    accumulativeTime: one + two + three
                });
                emit RecordBroken(
                    'fastest',
                    week,
                    run.owner,
                    one + two + three
                );
            }
        }
    }

    function updateAnybodyProblemAddress(
        address payable _anybodyProblem
    ) public onlyOwner {
        anybodyProblem = _anybodyProblem;
    }
}
