//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "base64-sol/base64.sol";
import "./Bodies.sol";
import "./Problems.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./StringsExtended.sol";
import "hardhat/console.sol";

/// @title BodyMetadata
/// @notice
/// @author @okwme
/// @dev The updateable and replaceable bodyMetadata contract

contract BodyMetadata is Ownable {
    address payable public bodies;
    address payable public problems;
    uint256 constant radiusMultiplyer = 100;

    constructor() {}

    /**
     * @dev Throws if id doesn't exist
     */
    modifier existsModifier(uint256 id) {
        require(exists(id), "DOES NOT EXIST");
        _;
    }

    function exists(uint256 id) public view returns (bool) {
        return Bodies(bodies).ownerOf(id) != address(0);
    }

    /// @dev generates the problemMetadata
    /// @param tokenId the tokenId
    function getBodyMetadata(
        uint256 tokenId
    ) public view existsModifier(tokenId) returns (string memory) {
        return
            string(
                abi.encodePacked(
                    "data:application/json;base64,",
                    Base64.encode(
                        abi.encodePacked(
                            '{"name":"',
                            getName(tokenId),
                            '", "description": "asdf", "image": "',
                            getSVG(tokenId),
                            '",',
                            '"animation_url": "',
                            getHTML(tokenId),
                            '",',
                            '"attributes": ',
                            getAttributes(tokenId),
                            "}"
                        )
                    )
                )
            );
    }

    function getName(uint256 tokenId) public view returns (string memory) {
        return
            string(
                abi.encodePacked("Body #", StringsExtended.toString(tokenId))
            );
    }

    function getHTML(uint256 tokenId) public view returns (string memory) {
        return
            string(
                abi.encodePacked(
                    "data:text/html;base64,",
                    Base64.encode(
                        abi.encodePacked(
                            "<html><body><img src='",
                            getSVG(tokenId),
                            "'></body></html>"
                        )
                    )
                )
            );
    }

    /// @dev function to generate a SVG String
    function getSVG(
        uint256 tokenId
    ) public view existsModifier(tokenId) returns (string memory) {
        return
            string(
                abi.encodePacked(
                    "data:image/svg+xml;base64,",
                    Base64.encode(
                        abi.encodePacked(
                            '<?xml version="1.0" encoding="utf-8"?><svg xmlns="http://www.w3.org/2000/svg"  height="100%" width="100%" viewBox="0 0 1000 1000" style="background-color:grey;"><style></style>',
                            getPath(tokenId),
                            '<text x="50" y="550" class="name">',
                            getName(tokenId),
                            "</text></svg>"
                        )
                    )
                )
            );
    }

    function getPath(uint256 tokenId) public view returns (string memory) {
        string memory path = "";
        uint256 scalingFactor = Problems(problems).scalingFactor();

          (uint256 body_problemId, uint256 body_mintedBodyIndex, uint256 body_starLvl, uint256 body_maxStarLvl, bytes32 body_seed) = Bodies(bodies).bodies(tokenId);
          uint256 body_radius = Problems(problems).genRadius(body_seed);
          uint256 scaledRadius = body_radius *
              4 +
              radiusMultiplyer *
              scalingFactor;
          uint256 radiusRounded = (scaledRadius / scalingFactor);
          string memory radius = StringsExtended.toString(radiusRounded);
          string memory radiusDecimalsString = StringsExtended.toString(
              scaledRadius - (radiusRounded * scalingFactor)
          );
          string memory pxString = "500";
          string memory pyString = "500";

          string memory bodyIDString = StringsExtended.toString(tokenId);
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
                  " 4s infinite linear; animation-delay: -0s; }</style>",
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
                  seedToColor(body_seed),
                  '" />'
              )
          );
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
        uint256 tokenId
    ) internal view returns (string memory) {
          uint256 scalingFactor = Problems(problems).scalingFactor();
          (uint256 body_problemId, uint256 body_mintedBodyIndex, uint256 body_starLvl, uint256 body_maxStarLvl, bytes32 body_seed) = Bodies(bodies).bodies(tokenId);
          uint256 body_radius = Problems(problems).genRadius(body_seed);
          uint256 scaledRadius = body_radius *
              4 +
              radiusMultiplyer *
              scalingFactor;


        return
            string(
                abi.encodePacked(
                    "[",
                    '{"trait_type":"ProblemId","value":"',
                    StringsExtended.toString(body_problemId),
                    '"}, {"trait_type":"mintedBodyIndex","value":"',
                    StringsExtended.toString(body_mintedBodyIndex),
                    '"}, {"trait_type":"starLvl","value":"',
                    StringsExtended.toString(body_starLvl),
                    '"}, {"trait_type":"maxStarLvl","value":"',
                    StringsExtended.toString(body_maxStarLvl),
                    '"}, {"trait_type":"seed","value":"',
                    StringsExtended.toHexStringWithPrefix(uint256(body_seed), 32),
                    '"}, {"trait_type":"radius","value":"',
                    StringsExtended.toString(scaledRadius),
                    '"}, {"trait_type":"color","value":"',
                    seedToColor(body_seed),
                    '"}]'
                )
            );
    }

    function updateProblemsAddress(address payable problems_) public onlyOwner {
        problems = problems_;
    }
    function updateBodiesAddress(address payable bodies_) public onlyOwner {
        bodies = bodies_;
    }

}
