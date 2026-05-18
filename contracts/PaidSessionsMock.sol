// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import './PaidSessions.sol';

contract PaidSessionsMock is PaidSessions {
    constructor(
        AnybodyProblemV5 anybody_,
        IERC20 usdc_,
        address feeRecipient_,
        uint256 shortWindowSize_,
        uint16 houseFeeBps_,
        uint16 concentrationBps_
    )
        PaidSessions(
            anybody_,
            usdc_,
            feeRecipient_,
            shortWindowSize_,
            houseFeeBps_,
            concentrationBps_
        )
    {}

    /// @dev Test helpers for forcing session state without driving the lifecycle.
    function setSeedForTest(uint256 sessionId, bytes32 seed) external {
        sessions[sessionId].seed = seed;
    }

    function setStatusForTest(uint256 sessionId, Status status) external {
        sessions[sessionId].status = status;
    }

    function setDeadlinesForTest(
        uint256 sessionId,
        uint256 commitDeadline,
        uint256 proofDeadline
    ) external {
        sessions[sessionId].commitDeadline = commitDeadline;
        sessions[sessionId].proofDeadline = proofDeadline;
    }

    function exposedReadBlockhash(
        uint256 blockNumber
    ) external view returns (bytes32) {
        return _readBlockhash(blockNumber);
    }

    /// @dev Drive _settle directly with a chosen score, bypassing the ZK proof path.
    function exposedSettle(uint256 sessionId, uint256 score) external {
        _settle(sessionId, score);
    }

    /// @dev Push a score into the long buffer without going through settle.
    /// Useful for pre-loading a synthetic distribution for percentile tests.
    /// Defaults weight to 1 so existing tests keep equal-weight semantics.
    function pushLongForTest(uint256 score) external {
        _pushLong(score, 1);
    }

    function pushShortForTest(uint256 score) external {
        _pushShort(score, 1);
    }

    /// @dev Weighted variants for exploit/regression tests of netCost weighting.
    function pushLongWeightedForTest(uint256 score, uint256 weight) external {
        _pushLong(score, weight);
    }

    function pushShortWeightedForTest(uint256 score, uint256 weight) external {
        _pushShort(score, weight);
    }

    function _pushLong(uint256 score, uint256 weight) internal {
        longBuffer[longCursor] = Sample({
            score: uint128(score),
            weight: uint128(weight)
        });
        if (longCursor + 1 >= W_LONG) longFilled = true;
        longCursor = (longCursor + 1) % W_LONG;
    }

    function _pushShort(uint256 score, uint256 weight) internal {
        uint256 sLen = shortBuffer.length;
        shortBuffer[shortCursor] = Sample({
            score: uint128(score),
            weight: uint128(weight)
        });
        if (shortCursor + 1 >= sLen) shortFilled = true;
        shortCursor = (shortCursor + 1) % sLen;
    }
}
