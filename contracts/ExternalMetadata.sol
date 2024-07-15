//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "base64-sol/base64.sol";
import "./AnybodyProblem.sol";
import "./Speedruns.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./BokkyPooBahsDateTimeLibrary.sol";
import "./StringsExtended.sol";
// import "hardhat/console.sol";

/// @title ExternalMetadata
/// @notice
/// @author @okwme
/// @dev The updateable and replaceable problemMetadata contract

contract ExternalMetadata is Ownable {
    using BokkyPooBahsDateTimeLibrary for uint;
    address payable public anybodyProblem;
    address payable public speedruns;
    uint256 constant radiusMultiplyer = 100;

    constructor() {}

    // string public baseURI = "https://";

    // /// @dev sets the baseURI can only be called by the owner
    // /// @param baseURI_ the new baseURI
    // function setbaseURI(string memory baseURI_) public onlyOwner {
    //     baseURI = baseURI_;
    // }

    // /// @dev generates the problemMetadata
    // /// @param tokenId the tokenId
    // /// @return _ the problemMetadata
    // function getProblemMetadata(uint256 tokenId) public view returns (string memory) {
    //     return
    //         string(
    //             abi.encodePacked(baseURI, StringsExtended.toString(tokenId), ".json")
    //         );
    // }

    /// @dev generates the problemMetadata
    /// @param date the date
    function getMetadata(
        uint256 date
    ) public view returns (string memory) {
        return
            string(
                abi.encodePacked(
                    "data:application/json;base64,",
                    Base64.encode(
                        abi.encodePacked(
                            '{"name":"',getName(date), '",',
                            '"description": "Anybody Problem (https://anybody.trifle.life)",',
                            '"image": "',getSVG(date),'",',
                            '"image_url": "',getSVG(date),'",',
                            '"home_url": "https://anybody.trifle.life",',
                            '"external_url": "https://anybody.trifle.life",',
                            // '"animation_url": "', getHTML(tokenId), '",',
                            '"attributes": ', getAttributes(date), '}'
                        )
                    )
                )
            );
    }

    function getName(uint256 date) public pure returns (string memory) {
        (uint year, uint month, uint day) = BokkyPooBahsDateTimeLibrary.timestampToDate(date);
        return
            string(
                abi.encodePacked(StringsExtended.toString(year),"-",StringsExtended.toString(month),"-",StringsExtended.toString(day))
            );
    }

    function getHTML(uint256 date) public view returns (string memory) {
        return
            string(
                abi.encodePacked(
                    "data:text/html;base64,",
                    Base64.encode(
                        abi.encodePacked(
                            "<html><body><img src='",
                            getSVG(date),
                            "'></body></html>"
                        )
                    )
                )
            );
    }

    /// @dev function to generate a SVG String
    function getSVG(
        uint256 date
    ) public view returns (string memory) {
        return
            string(
                abi.encodePacked(
                    "data:image/svg+xml;base64,",
                    Base64.encode(
                        abi.encodePacked(
                            '<?xml version="1.0" encoding="utf-8"?><svg xmlns="http://www.w3.org/2000/svg"  height="100%" width="100%" viewBox="0 0 1000 1000" style="background-color:grey;"><style></style>',
                            getPath(date),
                            '<text x="50" y="550" class="name">',
                            getName(date),
                            "</text></svg>"
                        )
                    )
                )
            );
    }

    function getPath(uint256 date) public view returns (string memory) {
        // const { seed, bodyCount, tickCount, mintedBodiesIndex } = problem
        string memory path = "";
        uint256 scalingFactor = AnybodyProblem(anybodyProblem).scalingFactor();
        uint256 level = AnybodyProblem(anybodyProblem).LEVELS();
        (AnybodyProblem.Body[6] memory bodies, uint256 bodyCount) = AnybodyProblem(anybodyProblem).generateLevelData(date, level);
        for (uint256 i = 0; i < bodyCount; i++) {
            AnybodyProblem.Body memory body = bodies[i];
            uint256 scaledRadius = body.radius *
                4 +
                radiusMultiplyer *
                scalingFactor;
            uint256 radiusRounded = (scaledRadius / scalingFactor);
            string memory radius = StringsExtended.toString(radiusRounded);
            string memory radiusDecimalsString = StringsExtended.toString(
                scaledRadius - (radiusRounded * scalingFactor)
            );

            uint256 pxScaled = body.px / scalingFactor;
            uint256 pxDecimals = body.px - (pxScaled * scalingFactor);
            string memory pxString = string(
                abi.encodePacked(
                    StringsExtended.toString(pxScaled),
                    ".",
                    StringsExtended.toString(pxDecimals)
                )
            );
            uint256 pyScaled = body.py / scalingFactor;
            uint256 pyDecimals = body.py - (pyScaled * scalingFactor);
            string memory pyString = string(
                abi.encodePacked(
                    StringsExtended.toString(pyScaled),
                    ".",
                    StringsExtended.toString(pyDecimals)
                )
            );
            string memory bodyIDString = StringsExtended.toString(body.bodyIndex);
            string memory transformOrigin = string(
                abi.encodePacked(
                    "transform-origin: ",
                    pxString,
                    "px ",
                    pyString,
                    "px; "
                )
            );
            path = string(
                abi.encodePacked(
                    path,
                    "<style> @keyframes moveEllipse",
                    bodyIDString,
                    " { 0% { ",
                    transformOrigin,
                    " transform: rotate(0deg) translate(0px, 10px); } 100% { ",
                    transformOrigin,
                    " transform: rotate(360deg) translate(0px, 10px); } }",
                    "ellipse#id-",
                    bodyIDString,
                    " { animation: moveEllipse",
                    bodyIDString,
                    " 4s infinite linear; animation-delay: -",
                    StringsExtended.toString(i),
                    "s; }</style>",
                    '<ellipse id="id-',
                    bodyIDString,
                    '" ry="',
                    radius,
                    ".",
                    radiusDecimalsString,
                    '" rx="',
                    radius,
                    ".",
                    radiusDecimalsString,
                    '" cy="',
                    pyString,
                    '" cx="',
                    pxString,
                    '" fill="',
                    seedToColor(body.seed),
                    '" />'
                )
            );
        }

        return path;
    }

    function seedToColor(bytes32 seed) public pure returns (string memory) {
        uint256 blocker = 0xffff;
        uint256 color = (uint256(seed) & blocker) % 360;
        uint256 saturation = ((uint256(seed) >> 16) & blocker) % 100;
        uint256 lightness = (((uint256(seed) >> 32) & blocker) % 40) + 40;
        string memory result = string(
          abi.encodePacked(
            "hsl(",
            StringsExtended.toString(color),
            ",",
            StringsExtended.toString(saturation),
            "%,",
            StringsExtended.toString(lightness),
            "%)"
          )
        );
        return result;
    }

    // function seedToColor(bytes32 seed) public view returns (string memory) {
    //     string memory result = StringsExtended.toHexString(
    //         uint256(seed) & 0xffffff,
    //         3
    //     );
    //     return result;
    // }

    /// @dev generates the attributes as JSON String
    function getAttributes(
        uint256 date
    ) internal view returns (string memory) {
        (uint year, uint month, uint day) = BokkyPooBahsDateTimeLibrary.timestampToDate(date);
        uint256 fastestRunId = AnybodyProblem(anybodyProblem).fastestByDay(date, 0);
        uint256 secondFastestRunId = AnybodyProblem(anybodyProblem).fastestByDay(date, 1);
        uint256 thirdFastestRunId = AnybodyProblem(anybodyProblem).fastestByDay(date, 2);
        (address fastestAddress, , uint256 fastestTime, , ) = AnybodyProblem(anybodyProblem).runs(fastestRunId);
        (address secondFastestAddress, , uint256 secondFastestTime, , ) = AnybodyProblem(anybodyProblem).runs(secondFastestRunId);
        (address thirdFastestAddress, , uint256 thirdFastestTime, , ) = AnybodyProblem(anybodyProblem).runs(thirdFastestRunId);

        return
            string(
                abi.encodePacked(
                    "[",
                    '{"trait_type":"Day","value":"',
                    StringsExtended.toString(date),
                    '"}, {"trait_type":"Month","value":"',
                    StringsExtended.toString(year),
                    '-',
                    Math.log10(month) + 1 == 1 ? "0" : "",
                    StringsExtended.toString(month),
                    '"}, {"trait_type":"1st Place","value":"',
                    StringsExtended.toHexString(fastestAddress),
                    '"}, {"trait_type":"1st Place Time","value":"',
                    StringsExtended.toString(fastestTime),
                    '"}, {"trait_type":"2nd Place","value":"',
                    StringsExtended.toHexString(secondFastestAddress),
                    '"}, {"trait_type":"2nd Place Time","value":"',
                    StringsExtended.toString(secondFastestTime),
                    '"}, {"trait_type":"3rd Place","value":"',
                    StringsExtended.toHexString(thirdFastestAddress),
                    '"}, {"trait_type":"3rd Place Time","value":"',
                    StringsExtended.toString(thirdFastestTime),
                    '"}]'
                )
            );
    }

    function updateAnybodyProblemAddress(address payable anybodyProblem_) public onlyOwner {
        anybodyProblem = anybodyProblem_;
    }
    function updateSpeedrunsAddress(address payable speedruns_) public onlyOwner {
        speedruns = speedruns_;
    }
}
