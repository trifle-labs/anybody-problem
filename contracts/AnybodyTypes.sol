// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

/// @dev Shared file-level structs used by AnybodyProblemV5 and AnybodyHistory.
/// File-level definitions let both the resolver and the main contract reference
/// the same nominal types so memory values flow between them without conversion.

struct Body {
    uint256 bodyIndex;
    uint256 px;
    uint256 py;
    uint256 vx;
    uint256 vy;
    uint256 radius;
    bytes32 seed;
}

struct Level {
    bool solved;
    uint256 time;
    bytes32 seed;
    uint256[5] tmpInflightMissile;
    Body[6] tmpBodyData;
}

struct Run {
    address owner;
    bool solved;
    uint256 accumulativeTime;
    bytes32 seed;
    uint256 day;
    Level[] levels;
}

struct RunWithoutLevels {
    address owner;
    bool solved;
    uint256 accumulativeTime;
    bytes32 seed;
    uint256 day;
}

struct Record {
    bool updated;
    uint256 total;
    uint256 lastPlayed;
    uint256 streak;
}
