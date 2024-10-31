// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import './AnybodyProblemV2.sol';

contract AnybodyProblemV2Mock is AnybodyProblemV2 {
    bool public foo = true;

    constructor(
        address payable proceedRecipient_,
        address payable speedruns_,
        address externalMetadata_,
        address payable tournament_,
        address[] memory verifiers_,
        uint256[] memory verifiersTicks,
        uint256[] memory verifiersBodies,
        address payable previousAB_
    )
        AnybodyProblemV2(
            proceedRecipient_,
            speedruns_,
            externalMetadata_,
            tournament_,
            verifiers_,
            verifiersTicks,
            verifiersBodies,
            previousAB_
        )
    {}

    Body[6][5] public mockedBodyDataByLevel;

    function setRunData(
        uint256 runId,
        uint256 day,
        uint256 accumulativeTime,
        address owner
    ) public {
        if (runs_[runId].day == 0) {
            counterForOrdering++;
        }
        runs_[runId].day = day;
        runs_[runId].accumulativeTime = accumulativeTime;
        runs_[runId].owner = owner;
    }

    function setMockedBodyDataByLevel(
        uint256 level,
        Body[6] memory bodyData
    ) public {
        mockedBodyDataByLevel[level - 1] = bodyData;
    }

    function generateLevelData(
        uint256 day,
        uint256 level
    )
        public
        view
        override(AnybodyProblemV2)
        returns (AnybodyProblemV2.Body[6] memory bodyData, uint256 bodyCount)
    {
        if (mockedBodyDataByLevel[level - 1][0].seed == bytes32(0)) {
            return super.generateLevelData(day, level);
        }
        return (mockedBodyDataByLevel[level - 1], level + 1);
    }
}
