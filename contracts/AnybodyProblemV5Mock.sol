// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import './AnybodyProblemV5.sol';
import './AnybodyTypes.sol';

contract AnybodyProblemV5Mock is AnybodyProblemV5 {
    bool public foo = true;

    constructor(
        address usdc_,
        address payable speedruns_,
        address externalMetadata_,
        address[] memory verifiers_,
        uint256[] memory verifiersTicks,
        uint256[] memory verifiersBodies,
        address historyResolver_,
        address payable proceedRecipient_
    )
        AnybodyProblemV5(
            usdc_,
            speedruns_,
            externalMetadata_,
            verifiers_,
            verifiersTicks,
            verifiersBodies,
            historyResolver_,
            proceedRecipient_
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

    function setFastestByDay(uint256 day, uint256 slot, uint256 runId) public {
        require(slot < 3, 'slot oob');
        fastestByDay_[day][slot] = runId;
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
        override(AnybodyProblemV5)
        returns (Body[6] memory bodyData, uint256 bodyCount)
    {
        if (mockedBodyDataByLevel[level - 1][0].seed == bytes32(0)) {
            return super.generateLevelData(day, level);
        }
        return (mockedBodyDataByLevel[level - 1], level + 2);
    }
}
