// SPDX-License-Identifier: MIT

import '@openzeppelin/contracts/access/Ownable.sol';
import './AnybodyProblemV2.sol';
import './HitchensOrderStatisticsTreeLib.sol';
import 'hardhat/console.sol';

pragma solidity ^0.8.0;

contract Tournament is Ownable {
    using HitchensOrderStatisticsTreeLib for HitchensOrderStatisticsTreeLib.Tree;
    uint256 public FIRST_DAY;
    uint256 public SECONDS_IN_A_DAY;
    address payable public anybodyProblem;
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

    function getWeeklyFastestSlowestByPlayer(
        uint256 week,
        address player
    )
        public
        view
        returns (uint256[3] memory fastest, uint256[3] memory slowest)
    {
        return (
            weeklyStatsByPlayer[week][player].fastest,
            weeklyStatsByPlayer[week][player].slowest
        );
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

    bool disableForTesting = false;

    modifier onlyAnybodyProblem() {
        require(
            msg.sender == anybodyProblem || disableForTesting,
            'Only the AnybodyProblemV2 contract can call this function'
        );
        _;
    }

    constructor() {}

    function setVars() public onlyOwner {
        FIRST_DAY = AnybodyProblemV2(anybodyProblem).FIRST_DAY();
        SECONDS_IN_A_DAY = AnybodyProblemV2(anybodyProblem).SECONDS_IN_A_DAY();
    }

    function setDisableForTesting(bool _disableForTesting) public onlyOwner {
        disableForTesting = _disableForTesting;
    }

    function addToLeaderboard(uint256 runId) public onlyAnybodyProblem {
        uint256 currentWeek = dayToWeek(
            AnybodyProblemV2(anybodyProblem).runs(runId).day
        );
        addRunToWeeklyUserAverage(runId, currentWeek);
        // addToFastestByWeekByPlayer(runId, currentWeek);
        // addToSlowestByWeekByPlayer(runId, currentWeek);
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
        uint256 closest = tree.atRank(tree.rank(requestedValue));
        return keyToAddress(tree.valueKeyAtIndex(closest, 0));
    }

    function dayToWeek(uint256 day) public view returns (uint256) {
        return (day - FIRST_DAY) / 7;
    }

    function runs(
        uint256 runId
    ) public view returns (AnybodyProblemV2.Run memory) {
        return AnybodyProblemV2(anybodyProblem).runs(runId);
    }

    function addRunToWeeklyUserAverage(uint256 runId, uint256 week) internal {
        address player = runs(runId).owner;
        Week memory weekStatsByPlayer = weeklyStatsByPlayer[week][player];
        uint256 oldAverage = weekStatsByPlayer.totalPlays > 0
            ? weekStatsByPlayer.totalTime / weekStatsByPlayer.totalPlays
            : 0;

        weekStatsByPlayer.totalPlays++;
        uint256 accumulativeTime = runs(runId).accumulativeTime;
        weekStatsByPlayer.totalTime += accumulativeTime;
        uint256 counterForOrdering = AnybodyProblemV2(anybodyProblem)
            .counterForOrdering();
        weekStatsByPlayer.lastUpdated = counterForOrdering;
        weeklyStatsByPlayer[week][player] = weekStatsByPlayer;

        uint256 newAverage = weekStatsByPlayer.totalTime /
            weekStatsByPlayer.totalPlays;

        // if key exists, remove it
        HitchensOrderStatisticsTreeLib.Tree
            storage tree = weeklyStatsSortedTree[week];

        bytes32 userAsKey = addressToKey(player);
        if (oldAverage != 0) {
            tree.remove(userAsKey, oldAverage);
        }
        // add key with new value
        tree.insert(userAsKey, newAverage);
        // TODO: confirm that this is updated since it's storage instead of memory now
        // weeklyStatsSortedTree[week] = HitchensOrderStatisticsTreeLib.Tree();

        weeklyStats[week].totalPlays++;
        weeklyStats[week].totalTime += accumulativeTime;
        weeklyStats[week].lastUpdated = counterForOrdering;
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
        AnybodyProblemV2.Run memory run = runs(runId);
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
        AnybodyProblemV2.Run memory run = runs(runId);
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

    function first(uint256 week) public view returns (uint) {
        return weeklyStatsSortedTree[week].first();
    }

    function last(uint256 week) public view returns (uint) {
        return weeklyStatsSortedTree[week].last();
    }

    function next(uint256 week, uint value) public view returns (uint) {
        return weeklyStatsSortedTree[week].next(value);
    }

    function prev(uint256 week, uint value) public view returns (uint) {
        return weeklyStatsSortedTree[week].prev(value);
    }

    function exists(uint256 week, uint value) public view returns (bool) {
        return weeklyStatsSortedTree[week].exists(value);
    }

    function keyExists(
        uint256 week,
        bytes32 key,
        uint value
    ) public view returns (bool) {
        return weeklyStatsSortedTree[week].keyExists(key, value);
    }

    function getNode(
        uint256 week,
        uint value
    )
        public
        view
        returns (
            uint _parent,
            uint _left,
            uint _right,
            bool _red,
            uint keyCount,
            uint _count
        )
    {
        return weeklyStatsSortedTree[week].getNode(value);
    }

    function getNodeCount(uint256 week, uint value) public view returns (uint) {
        return weeklyStatsSortedTree[week].getNodeCount(value);
    }

    function valueKeyAtIndex(
        uint256 week,
        uint value,
        uint index
    ) public view returns (bytes32) {
        return weeklyStatsSortedTree[week].valueKeyAtIndex(value, index);
    }

    function count(uint256 week) public view returns (uint) {
        return weeklyStatsSortedTree[week].count();
    }

    function percentile(uint256 week, uint value) public view returns (uint) {
        return weeklyStatsSortedTree[week].percentile(value);
    }

    function permil(uint256 week, uint value) public view returns (uint) {
        return weeklyStatsSortedTree[week].permil(value);
    }

    function atPercentile(
        uint256 week,
        uint _percentile
    ) public view returns (uint) {
        return weeklyStatsSortedTree[week].atPercentile(_percentile);
    }

    function atPermil(uint256 week, uint _permil) public view returns (uint) {
        return weeklyStatsSortedTree[week].atPermil(_permil);
    }

    function median(uint256 week) public view returns (uint) {
        return weeklyStatsSortedTree[week].median();
    }

    function below(uint256 week, uint value) public view returns (uint) {
        return weeklyStatsSortedTree[week].below(value);
    }

    function above(uint256 week, uint value) public view returns (uint) {
        return weeklyStatsSortedTree[week].above(value);
    }

    function rank(uint256 week, uint value) public view returns (uint) {
        return weeklyStatsSortedTree[week].rank(value);
    }

    function atRank(uint256 week, uint _rank) public view returns (uint) {
        return weeklyStatsSortedTree[week].atRank(_rank);
    }
}
