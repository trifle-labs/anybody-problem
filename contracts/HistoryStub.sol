// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import './AnybodyTypes.sol';

/// @dev Minimal stubs used only by `anybodyHistory.test.js` to exercise
/// `AnybodyHistory` against the two on-chain shapes the resolver probes:
///   - V0 shape: no-underscore mapping getters returning 3-field Record /
///     5-flat-field run / `fastestByDay(uint256,uint256)`.
///   - V1+ shape: underscore mapping getters returning 4-field Record /
///     5-flat-field run / `fastestByDay_(uint256,uint256)`.
///
/// Each stub exposes only one shape so the resolver's fallback path is
/// covered when mixing them in a single history chain.

contract HistoryStubV0 {
    mapping(address => uint256) private _total;
    mapping(address => uint256) private _lastPlayed;
    mapping(address => uint256) private _streak;

    mapping(uint256 => RunWithoutLevels) private _runs;
    mapping(uint256 => Level[]) private _levels;
    mapping(uint256 => mapping(uint256 => uint256)) private _fastestByDay;

    function setGamesPlayed(
        address player,
        uint256 total,
        uint256 lastPlayed,
        uint256 streak
    ) external {
        _total[player] = total;
        _lastPlayed[player] = lastPlayed;
        _streak[player] = streak;
    }

    function setRun(
        uint256 runId,
        address owner,
        bool solved,
        uint256 accumulativeTime,
        bytes32 seed,
        uint256 day
    ) external {
        _runs[runId] = RunWithoutLevels({
            owner: owner,
            solved: solved,
            accumulativeTime: accumulativeTime,
            seed: seed,
            day: day
        });
    }

    function pushLevel(uint256 runId, Level memory level) external {
        _levels[runId].push(level);
    }

    function setFastestByDay(uint256 day, uint256 slot, uint256 value) external {
        _fastestByDay[day][slot] = value;
    }

    function gamesPlayed(
        address player
    ) external view returns (uint256, uint256, uint256) {
        return (_total[player], _lastPlayed[player], _streak[player]);
    }

    function runs(
        uint256 runId
    ) external view returns (address, bool, uint256, bytes32, uint256) {
        RunWithoutLevels memory r = _runs[runId];
        return (r.owner, r.solved, r.accumulativeTime, r.seed, r.day);
    }

    function getLevelsData(uint256 runId) external view returns (Level[] memory) {
        return _levels[runId];
    }

    function fastestByDay(uint256 day, uint256 slot) external view returns (uint256) {
        return _fastestByDay[day][slot];
    }
}

contract HistoryStubV1Plus {
    mapping(address => Record) private _games;

    mapping(uint256 => RunWithoutLevels) private _runs;
    mapping(uint256 => Level[]) private _levels;
    mapping(uint256 => mapping(uint256 => uint256)) private _fastestByDay;

    function setGamesPlayed(
        address player,
        uint256 total,
        uint256 lastPlayed,
        uint256 streak
    ) external {
        _games[player] = Record({
            updated: true,
            total: total,
            lastPlayed: lastPlayed,
            streak: streak
        });
    }

    function setRun(
        uint256 runId,
        address owner,
        bool solved,
        uint256 accumulativeTime,
        bytes32 seed,
        uint256 day
    ) external {
        _runs[runId] = RunWithoutLevels({
            owner: owner,
            solved: solved,
            accumulativeTime: accumulativeTime,
            seed: seed,
            day: day
        });
    }

    function pushLevel(uint256 runId, Level memory level) external {
        _levels[runId].push(level);
    }

    function setFastestByDay(uint256 day, uint256 slot, uint256 value) external {
        _fastestByDay[day][slot] = value;
    }

    function gamesPlayed_(
        address player
    ) external view returns (bool, uint256, uint256, uint256) {
        Record memory r = _games[player];
        return (r.updated, r.total, r.lastPlayed, r.streak);
    }

    function runs_(
        uint256 runId
    ) external view returns (address, bool, uint256, bytes32, uint256) {
        RunWithoutLevels memory r = _runs[runId];
        return (r.owner, r.solved, r.accumulativeTime, r.seed, r.day);
    }

    function getLevelsData(uint256 runId) external view returns (Level[] memory) {
        return _levels[runId];
    }

    function fastestByDay_(
        uint256 day,
        uint256 slot
    ) external view returns (uint256) {
        return _fastestByDay[day][slot];
    }
}
