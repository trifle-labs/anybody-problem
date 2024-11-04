// SPDX-License-Identifier: MIT

import '@openzeppelin/contracts/access/Ownable.sol';
import './AnybodyProblemV2.sol';
import './HitchensOrderStatisticsTreeLib.sol';
import 'hardhat/console.sol';

pragma solidity ^0.8.0;

contract Tournament is Ownable {
    using HitchensOrderStatisticsTreeLib for HitchensOrderStatisticsTreeLib.Tree;
    uint256 public firstMonday = 1730678400; // Mon Nov 04 2024 00:00:00 GMT+0000
    uint256 public constant SECONDS_IN_A_DAY = 86400;
    address payable public anybodyProblem;
    uint256 public daysInContest = 2;
    uint256 public minimumDaysPlayed = 1;
    uint256 public entryPrice = 0; // 0.005 ether; // ~$10
    uint256 public entryPercent = 0; // 0 / 1000 = 0%
    uint256 public constant FACTOR = 1000;

    event RecordBroken(
        string recordType,
        uint256 week,
        address player,
        uint256 value,
        uint256 extraValue
    );

    event boughtTicket(address indexed player, uint256 week, uint256 amount);

    event EthMoved(
        address indexed to,
        bool indexed success,
        bytes returnData,
        uint256 amount
    );

    struct WeekTotal {
        uint256 totalPlays;
        uint256 totalTime;
        uint256 lastUpdated;
    }
    mapping(uint256 => mapping(address => bool)) public tickets;
    mapping(uint256 => WeekTotal) public weeklyStats;
    mapping(uint256 => mapping(address => WeekTotal))
        public weeklyStatsByPlayer;
    mapping(uint256 => HitchensOrderStatisticsTreeLib.Tree)
        public weeklyStatsSortedTree;

    struct WeekSpeed {
        address player;
        uint256 accumulativeTime;
    }

    mapping(uint256 => mapping(address => uint256[])) // array length not enforced so tournament can be variable number of days
        public fastestByWeekByPlayer; // week => player => [mon, tue, wed, thu, fri, sat, sun]
    mapping(uint256 => WeekSpeed) public weeklyFastest; // week => WeekSpeed

    mapping(uint256 => mapping(address => uint256[])) // array length not enforced so tournament can be variable number of days
        public slowestByWeekByPlayer;
    mapping(uint256 => WeekSpeed) public weeklySlowest;

    struct Paidout {
        address fastest;
        address slowest;
        address average;
    }
    mapping(uint256 => Paidout) public paidOutByWeek;
    mapping(uint256 => uint256) public prizes; // week

    function currentWeek() public view returns (uint256) {
        uint256 currentDay = AnybodyProblemV2(anybodyProblem).currentDay();
        return dayToWeek(currentDay);
    }

    function fillPrize_(uint256 week, uint256 amount) internal {
        uint256 currentWeek_ = currentWeek();
        require(week >= currentWeek_, 'Cannot fill prize for past week');
        prizes[week] += amount;
        emit EthMoved(address(this), true, '', amount);
    }

    function fillPrize(uint256 week) public payable {
        fillPrize_(week, msg.value);
    }

    bool disableForTesting = false;

    modifier onlyAnybodyProblem() {
        require(
            msg.sender == anybodyProblem || disableForTesting,
            'Only the AnybodyProblemV2 contract can call this function'
        );
        _;
    }

    constructor() {}

    receive() external payable {
        fillPrize_(currentWeek(), msg.value);
    }

    function setFirstMonday(uint256 firstMonday_) public onlyOwner {
        firstMonday = firstMonday_;
    }

    function setDisableForTesting(bool _disableForTesting) public onlyOwner {
        disableForTesting = _disableForTesting;
    }

    function addToLeaderboard(uint256 runId) public onlyAnybodyProblem {
        uint256 currentWeek_ = currentWeek();
        AnybodyProblemV2.Run memory run = runs(runId);

        // score isn't saved unless you have a ticket
        if (!tickets[currentWeek_][run.owner] && entryPrice != 0) {
            return;
        }
        // NOTE: not necessary to check since addToLeaderboard is only called on currentDay
        // require(currentWeek_ == dayToWeek(runs(runId).day), 'Run is not in current week');
        addToAverageByWeekByPlayer(runId, currentWeek_, run);
        addToFastestByWeekByPlayer(runId, currentWeek_, run);
        addToSlowestByWeekByPlayer(runId, currentWeek_, run);
    }

    function buyTicket() public payable {
        require(msg.value == entryPrice, 'Incorrect entry price');
        uint256 currentWeek_ = currentWeek();
        require(
            !tickets[currentWeek_][msg.sender],
            'You already have a ticket for this week'
        );
        tickets[currentWeek_][msg.sender] = true;
        uint256 percentageKept = (entryPrice * entryPercent) / FACTOR;
        uint256 amountToSplit = entryPrice - percentageKept;
        fillPrize_(currentWeek_, amountToSplit);
        emit boughtTicket(msg.sender, currentWeek_, msg.value);
        if (percentageKept > 0) {
            address payable proceedRecipient = AnybodyProblemV2(anybodyProblem)
                .proceedRecipient();
            (bool sent, bytes memory data) = proceedRecipient.call{
                value: percentageKept
            }('');
            require(sent, 'Failed to send Ether');
            emit EthMoved(proceedRecipient, sent, data, percentageKept);
        }
    }

    function payoutAverage(uint256 week) public {
        require(week < currentWeek(), 'Contest is not over');
        require(
            paidOutByWeek[week].average == address(0),
            'Already paid out average'
        );
        (address winner, ) = mostAverageByWeek(week);
        paidOutByWeek[week].average = winner;
        uint256 prizeAmount = divRound(prizes[week], 3); // round down is what we want, dust will be minimal
        require(prizeAmount > 0, 'No prize to pay out');
        (bool sent, ) = winner.call{value: prizeAmount}('');
        emit EthMoved(winner, sent, '', prizeAmount);
        require(sent, 'Failed to send Ether');
    }

    function payoutFastest(uint256 week) public {
        require(week < currentWeek(), 'Contest is not over');
        require(
            paidOutByWeek[week].fastest == address(0),
            'Already paid out fastest'
        );
        address winner = fastestByWeek(week);
        paidOutByWeek[week].fastest = winner;
        uint256 prizeAmount = divRound(prizes[week], 3); // round down is what we want, dust will be minimal
        require(prizeAmount > 0, 'No prize to pay out');
        (bool sent, ) = winner.call{value: prizeAmount}('');
        emit EthMoved(winner, sent, '', prizeAmount);
        require(sent, 'Failed to send Ether');
    }

    function payoutSlowest(uint256 week) public {
        require(week < currentWeek(), 'Contest is not over');
        require(
            paidOutByWeek[week].slowest == address(0),
            'Already paid out slowest'
        );
        address winner = slowestByWeek(week);
        paidOutByWeek[week].slowest = winner;
        uint256 prizeAmount = divRound(prizes[week], 3); // round down is what we want, dust will be minimal
        require(prizeAmount > 0, 'No prize to pay out');
        (bool sent, ) = winner.call{value: prizeAmount}('');
        emit EthMoved(winner, sent, '', prizeAmount);
        require(sent, 'Failed to send Ether');
    }

    function fastestByWeek(uint256 week) public view returns (address winner) {
        return weeklyFastest[week].player;
    }

    function slowestByWeek(uint256 week) public view returns (address winner) {
        return weeklySlowest[week].player;
    }

    function weeklyAverage(uint256 week) public view returns (uint256) {
        return
            divRound(weeklyStats[week].totalTime, weeklyStats[week].totalPlays);
    }

    function mostAverageByWeek(
        uint256 week
    ) public view returns (address winner, uint256 average) {
        (winner, average) = findClosestKey(weeklyAverage(week), week);
    }

    function divRound(
        uint256 numerator,
        uint256 denominator
    ) public pure returns (uint256) {
        if (numerator == 0 || denominator == 0) return 0;
        // Perform the division and check for rounding
        uint256 result = numerator / denominator;

        // Check if there is a remainder and if the fractional part is >= 0.5
        // If true, add 1 to the result to round up
        if ((numerator % denominator) * 2 >= denominator) {
            result += 1;
        }

        return result;
    }

    function findClosestKey(
        uint requestedValue,
        uint256 week
    ) public view returns (address closestAddress, uint256 closest) {
        HitchensOrderStatisticsTreeLib.Tree
            storage tree = weeklyStatsSortedTree[week];
        if (tree.count() == 0) {
            return (address(0), 0);
        }
        bool closestFound = false;
        uint256 indexOffset = 0;
        uint256 rankOffset = 0;
        uint256 rank = tree.rank(requestedValue);
        uint256 count = tree.count();
        for (uint256 i = 0; i < count; i++) {
            closest = tree.atRank(rank + rankOffset);
            // uint256 closest2 = tree.atPercentile(tree.percentile(requestedValue));
            // require(closest == closest2, 'Rank and Percentile do not match');
            address player = keyToAddress(
                tree.valueKeyAtIndex(closest, indexOffset)
            );
            bool enoughDays = false;
            uint256 totalDays = 0;
            for (
                uint256 j = 0;
                j < fastestByWeekByPlayer[week][player].length;
                j++
            ) {
                if (fastestByWeekByPlayer[week][player][j] != 0) {
                    totalDays++;
                    if (totalDays >= minimumDaysPlayed) {
                        enoughDays = true;
                        break;
                    }
                }
            }
            if (!enoughDays) {
                if (tree.getNodeKeysLength(closest) > indexOffset + 1) {
                    indexOffset++;
                } else {
                    rankOffset++;
                    indexOffset = 0;
                }
            } else {
                return (
                    keyToAddress(tree.valueKeyAtIndex(closest, 0)),
                    closest
                );
                closestFound = true;
            }
        }
        return (address(0), 0);
    }

    function dayToWeek(uint256 day) public view returns (uint256) {
        require(day >= firstMonday, 'Day is before firstMonday');
        return ((day - firstMonday) / SECONDS_IN_A_DAY) / daysInContest; // rounding down is important here
    }

    function dayOfTheWeek(uint256 day) public view returns (uint256) {
        return ((day - firstMonday) / SECONDS_IN_A_DAY) % daysInContest; // Monday = 0, Sunday = 6
    }

    function runs(
        uint256 runId
    ) public view returns (AnybodyProblemV2.Run memory) {
        return AnybodyProblemV2(anybodyProblem).runs(runId);
    }

    function addToAverageByWeekByPlayer(
        uint256 runId,
        uint256 week,
        AnybodyProblemV2.Run memory run
    ) internal {
        address player = run.owner;
        WeekTotal storage weekStatsByPlayer = weeklyStatsByPlayer[week][player];
        uint256 oldAverage = weekStatsByPlayer.totalPlays > 0
            ? divRound(
                weekStatsByPlayer.totalTime,
                weekStatsByPlayer.totalPlays
            )
            : 0;

        weekStatsByPlayer.totalPlays++;
        uint256 accumulativeTime = run.accumulativeTime;
        weekStatsByPlayer.totalTime += accumulativeTime;
        uint256 counterForOrdering = AnybodyProblemV2(anybodyProblem)
            .counterForOrdering();
        weekStatsByPlayer.lastUpdated = counterForOrdering;
        weeklyStatsByPlayer[week][player] = weekStatsByPlayer;

        uint256 newAverage = divRound(
            weekStatsByPlayer.totalTime,
            weekStatsByPlayer.totalPlays
        );

        // if key exists, remove it
        HitchensOrderStatisticsTreeLib.Tree
            storage tree = weeklyStatsSortedTree[week];

        bytes32 userAsKey = addressToKey(player);
        if (oldAverage != 0) {
            tree.remove(userAsKey, oldAverage);
        }
        // add key with new value
        tree.insert(userAsKey, newAverage);

        weeklyStats[week].totalPlays++;
        weeklyStats[week].totalTime += accumulativeTime;
        weeklyStats[week].lastUpdated = counterForOrdering;

        uint256 newGlobalAverage = weeklyAverage(week);
        (address currentWinner, uint closestAverage) = mostAverageByWeek(week);
        emit RecordBroken(
            'average',
            week,
            currentWinner,
            newGlobalAverage,
            closestAverage
        );
    }

    function addressToKey(address addr) public pure returns (bytes32) {
        return bytes32(uint256(uint160(addr)));
    }

    function keyToAddress(bytes32 key) public pure returns (address) {
        return address(uint160(uint256(key)));
    }

    function addToSlowestByWeekByPlayer(
        uint256 runId,
        uint256 week,
        AnybodyProblemV2.Run memory run
    ) internal {
        uint256 dayOfTheWeek_ = dayOfTheWeek(run.day);

        // First it's important to track whether this is the slowest speed for the day
        // for the specific player. All of the player's slowest times for each day are
        // what are eventually compared for weekly best.
        if (slowestByWeekByPlayer[week][run.owner].length == 0) {
            for (uint256 i = 0; i < daysInContest; i++) {
                slowestByWeekByPlayer[week][run.owner].push(0);
            }
        }
        uint256 previousBest = slowestByWeekByPlayer[week][run.owner][
            dayOfTheWeek_
        ];

        if (run.accumulativeTime > previousBest) {
            slowestByWeekByPlayer[week][run.owner][dayOfTheWeek_] = run
                .accumulativeTime;
            // if record is broken, ensure player's weekly best is checked
            uint256[] memory bestTimes = new uint256[](minimumDaysPlayed);
            uint256 daysRecorded = 0;
            for (uint256 i = 0; i < daysInContest; i++) {
                uint256 speed = slowestByWeekByPlayer[week][run.owner][i];
                if (speed == 0) {
                    continue;
                }
                daysRecorded++;
                for (uint256 j = 0; j < minimumDaysPlayed; j++) {
                    if (bestTimes[j] == 0) {
                        bestTimes[j] = speed;
                        break;
                    } else if (speed > bestTimes[j]) {
                        for (uint256 k = minimumDaysPlayed - 1; k > j; k--) {
                            bestTimes[k] = bestTimes[k - 1];
                        }
                        bestTimes[j] = speed;
                        break;
                    }
                }
            }
            if (daysRecorded < minimumDaysPlayed) {
                // player hasn't completed minimum number of days
                return;
            }
            uint256 totalTime = 0;
            for (uint256 i = 0; i < bestTimes.length; i++) {
                totalTime += bestTimes[i];
            }
            if (totalTime > weeklySlowest[week].accumulativeTime) {
                weeklySlowest[week] = WeekSpeed({
                    player: run.owner,
                    accumulativeTime: totalTime
                });
                emit RecordBroken('slowest', week, run.owner, totalTime, 0);
            }
        }
    }

    function addToFastestByWeekByPlayer(
        uint256 runId,
        uint256 week,
        AnybodyProblemV2.Run memory run
    ) internal {
        uint256 dayOfTheWeek_ = dayOfTheWeek(run.day);

        // First it's important to track whether this is the fastest speed for the day
        // for the specific player. All of the player's fastest times for each day are
        // what are eventually compared for weekly best.
        if (fastestByWeekByPlayer[week][run.owner].length == 0) {
            for (uint256 i = 0; i < daysInContest; i++) {
                fastestByWeekByPlayer[week][run.owner].push(0);
            }
        }

        uint256 previousBest = fastestByWeekByPlayer[week][run.owner][
            dayOfTheWeek_
        ];

        if (previousBest == 0 || run.accumulativeTime < previousBest) {
            fastestByWeekByPlayer[week][run.owner][dayOfTheWeek_] = run
                .accumulativeTime;

            // if record is broken, ensure player's weekly best is checked
            uint256[] memory bestTimes = new uint256[](minimumDaysPlayed);
            uint256 daysRecorded = 0;
            for (uint256 i = 0; i < daysInContest; i++) {
                uint256 speed = fastestByWeekByPlayer[week][run.owner][i];
                if (speed == 0) {
                    continue;
                }
                daysRecorded++;
                for (uint256 j = 0; j < minimumDaysPlayed; j++) {
                    if (bestTimes[j] == 0) {
                        bestTimes[j] = speed;
                        break;
                    } else if (speed < bestTimes[j]) {
                        for (uint256 k = minimumDaysPlayed - 1; k > j; k--) {
                            bestTimes[k] = bestTimes[k - 1];
                        }
                        bestTimes[j] = speed;
                        break;
                    }
                }
            }
            if (daysRecorded < minimumDaysPlayed) {
                // player hasn't completed minimum number of days
                return;
            }
            uint256 totalTime = 0;
            for (uint256 i = 0; i < bestTimes.length; i++) {
                totalTime += bestTimes[i];
            }
            if (
                totalTime < weeklyFastest[week].accumulativeTime ||
                weeklyFastest[week].accumulativeTime == 0
            ) {
                weeklyFastest[week] = WeekSpeed({
                    player: run.owner,
                    accumulativeTime: totalTime
                });
                emit RecordBroken('fastest', week, run.owner, totalTime, 0);
            }
        }
    }

    function updateMinimumNumberOfDays(
        uint256 _minimumDaysPlayed
    ) public onlyOwner {
        minimumDaysPlayed = _minimumDaysPlayed;
    }

    function updateDaysInContest(uint256 _daysInContest) public onlyOwner {
        daysInContest = _daysInContest;
    }

    function updateEntryPrice(uint256 _entryPrice) public onlyOwner {
        entryPrice = _entryPrice;
    }

    function updateEntryPercent(uint256 _entryPercent) public onlyOwner {
        entryPercent = _entryPercent;
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

    function root(uint256 week) public view returns (uint) {
        return weeklyStatsSortedTree[week].root;
    }

    /// @dev if mint fails to send eth to splitter, admin can recover
    // This should not be necessary but Berlin hardfork broke split before so this
    // is extra precaution.
    function recoverUnsuccessfulPayment(address payable _to) public onlyOwner {
        uint256 amount = address(this).balance;
        (bool sent, bytes memory data) = _to.call{value: amount}('');
        emit EthMoved(_to, sent, data, amount);
    }
}
