// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import './AnybodyTypes.sol';

/// @title AnybodyHistory
/// @notice Read-only resolver that walks a fixed list of historical
/// AnybodyProblem deployments (V0..V4) and returns combined player records
/// and per-runId / per-day data. Bypasses each version's recursive combined
/// getters (whose `OldRecordType` decoding was structurally mismatched after
/// V1) by calling each version's raw public mapping auto-getters.
///
/// History array convention: most-recent first, e.g. [V4, V3, V2, V1, V0].
/// Per-shape probing inside this contract handles V0's no-underscore mapping
/// vs V1+'s underscore mapping for `gamesPlayed`, `runs`, `fastestByDay`.
contract AnybodyHistory {
    address[] private _history;

    constructor(address[] memory history_) {
        for (uint256 i = 0; i < history_.length; i++) {
            require(history_[i] != address(0), 'AH: zero history entry');
            _history.push(history_[i]);
        }
    }

    function history(uint256 i) external view returns (address) {
        return _history[i];
    }

    function historyLength() external view returns (uint256) {
        return _history.length;
    }

    /// @notice Sum of every historical version's local `total` plus the
    /// streak/lastPlayed pair from whichever version has the most recent
    /// `lastPlayed`. `updated` is always false on the returned record;
    /// callers cache locally if desired.
    function gamesPlayed(address player) external view returns (Record memory acc) {
        for (uint256 i = 0; i < _history.length; i++) {
            (uint256 t, uint256 lp, uint256 s) = _readGamesPlayed(_history[i], player);
            acc.total += t;
            if (lp > acc.lastPlayed) {
                acc.lastPlayed = lp;
                acc.streak = s;
            }
        }
    }

    /// @notice First version (most-recent-first) that locally owns this runId.
    /// Returns an empty `Run` if no version owns it.
    function runs(uint256 runId) external view returns (Run memory r) {
        for (uint256 i = 0; i < _history.length; i++) {
            address ab = _history[i];
            r = _readRunHeader(ab, runId);
            if (r.owner != address(0)) {
                r.levels = _readLevels(ab, runId);
                return r;
            }
        }
    }

    /// @notice Per-slot probe: for each of [0, 1, 2] return the first
    /// non-zero entry encountered walking newest-to-oldest.
    function fastestByDay(uint256 day) external view returns (uint256[3] memory out) {
        for (uint256 slot = 0; slot < 3; slot++) {
            for (uint256 h = 0; h < _history.length; h++) {
                uint256 v = _readFastestByDay(_history[h], day, slot);
                if (v != 0) {
                    out[slot] = v;
                    break;
                }
            }
        }
    }

    function getLevelsData(uint256 runId) external view returns (Level[] memory) {
        for (uint256 i = 0; i < _history.length; i++) {
            address ab = _history[i];
            Run memory r = _readRunHeader(ab, runId);
            if (r.owner != address(0)) {
                return _readLevels(ab, runId);
            }
        }
        Level[] memory empty;
        return empty;
    }

    function runExists(uint256 runId) external view returns (bool) {
        for (uint256 i = 0; i < _history.length; i++) {
            Run memory r = _readRunHeader(_history[i], runId);
            if (r.owner != address(0)) return true;
        }
        return false;
    }

    // ============ Shape probing ============

    /// @dev Returns (total, lastPlayed, streak). Tries V1+ shape first
    /// (underscore mapping returning 4 fields), then falls back to V0 shape
    /// (no-underscore mapping returning 3 fields).
    function _readGamesPlayed(
        address ab,
        address player
    ) internal view returns (uint256 total, uint256 lastPlayed, uint256 streak) {
        (bool ok, bytes memory data) = ab.staticcall(
            abi.encodeWithSignature('gamesPlayed_(address)', player)
        );
        if (ok && data.length >= 128) {
            (, total, lastPlayed, streak) = abi.decode(data, (bool, uint256, uint256, uint256));
            return (total, lastPlayed, streak);
        }
        (ok, data) = ab.staticcall(
            abi.encodeWithSignature('gamesPlayed(address)', player)
        );
        if (ok && data.length >= 96) {
            (total, lastPlayed, streak) = abi.decode(data, (uint256, uint256, uint256));
        }
    }

    /// @dev Reads a run's header fields (no levels). Tries V1+ shape
    /// `runs_(uint256)` auto-getter first, then V0's `runs(uint256)` array
    /// auto-getter. Both return the same five-flat-field tuple.
    function _readRunHeader(
        address ab,
        uint256 runId
    ) internal view returns (Run memory r) {
        (bool ok, bytes memory data) = ab.staticcall(
            abi.encodeWithSignature('runs_(uint256)', runId)
        );
        if (!ok || data.length < 160) {
            (ok, data) = ab.staticcall(
                abi.encodeWithSignature('runs(uint256)', runId)
            );
        }
        if (!ok || data.length < 160) return r;
        (r.owner, r.solved, r.accumulativeTime, r.seed, r.day) = abi.decode(
            data,
            (address, bool, uint256, bytes32, uint256)
        );
    }

    function _readLevels(
        address ab,
        uint256 runId
    ) internal view returns (Level[] memory) {
        (bool ok, bytes memory data) = ab.staticcall(
            abi.encodeWithSignature('getLevelsData(uint256)', runId)
        );
        if (ok && data.length > 0) {
            return abi.decode(data, (Level[]));
        }
        Level[] memory empty;
        return empty;
    }

    function _readFastestByDay(
        address ab,
        uint256 day,
        uint256 slot
    ) internal view returns (uint256) {
        (bool ok, bytes memory data) = ab.staticcall(
            abi.encodeWithSignature('fastestByDay_(uint256,uint256)', day, slot)
        );
        if (!ok || data.length < 32) {
            (ok, data) = ab.staticcall(
                abi.encodeWithSignature('fastestByDay(uint256,uint256)', day, slot)
            );
        }
        if (!ok || data.length < 32) return 0;
        return abi.decode(data, (uint256));
    }
}
