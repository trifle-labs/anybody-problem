//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import 'base64-sol/base64.sol';
import './AnybodyProblem.sol';
import './Speedruns.sol';
import '@openzeppelin/contracts/access/Ownable.sol';
import './BokkyPooBahsDateTimeLibrary.sol';
import './StringsExtended.sol';

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

    enum ThemeName {
        SaturatedExcludeDarks,
        PastelHighlighterMarker,
        MarkerPastelHighlighter,
        ShadowHighlighterMarker,
        Berlin
    }

    enum ThemeLayer {
        BG,
        Core,
        FG
    }

    mapping(ThemeLayer => uint256) private svgSizes;
    mapping(ThemeLayer => string[]) private svgPaths;

    struct ThemeGroup {
        ThemeName name;
        Theme[3] themes;
    }

    struct Theme {
        ThemeLayer layer;
        uint256 hueStart;
        uint256 hueEnd;
        uint256 saturationStart;
        uint256 saturationEnd;
        uint256 lightnessStart;
        uint256 lightnessEnd;
    }

    ThemeGroup[] public themeGroups;

    constructor() {
        setupColorThemes();
    }

    function setupSVGPaths() internal {

        // svgSizes[ThemeLayer.BG] = 7;
        // svgPaths[ThemeLayer.BG].push('<svg>...</svg>');
        // svgPaths[ThemeLayer.BG].push('<svg>...</svg>');
        // svgPaths[ThemeLayer.BG].push('<svg>...</svg>');
        // svgPaths[ThemeLayer.BG].push('<svg>...</svg>');
        // svgPaths[ThemeLayer.BG].push('<svg>...</svg>');
        // svgPaths[ThemeLayer.BG].push('<svg>...</svg>');
        // svgPaths[ThemeLayer.BG].push('<svg>...</svg>');

        // svgSizes[ThemeLayer.Core] = 3;
        // svgPaths[ThemeLayer.Core].push('<svg>...</svg>');
        // svgPaths[ThemeLayer.Core].push('<svg>...</svg>');
        // svgPaths[ThemeLayer.Core].push('<svg>...</svg>');

        // svgSizes[ThemeLayer.FG] = 4;
        // svgPaths[ThemeLayer.FG].push('<svg>...</svg>');
        // svgPaths[ThemeLayer.FG].push('<svg>...</svg>');
        // svgPaths[ThemeLayer.FG].push('<svg>...</svg>');
        // svgPaths[ThemeLayer.FG].push('<svg>...</svg>');
    }

    function setupColorThemes() internal {

        Theme memory saturated = Theme({
            layer: ThemeLayer.BG,
            hueStart: 0,
            hueEnd: 360,
            saturationStart: 80,
            saturationEnd: 100,
            lightnessStart: 18,
            lightnessEnd: 100
        });

        ThemeGroup memory saturatedGroup = ThemeGroup({
            name: ThemeName.SaturatedExcludeDarks,
            themes: [saturated, saturated, saturated]
        });
        saturatedGroup.themes[0].layer = ThemeLayer.BG;
        saturatedGroup.themes[1].layer = ThemeLayer.Core;
        saturatedGroup.themes[2].layer = ThemeLayer.FG;
        themeGroups.push(saturatedGroup);

        Theme memory pastelTemplate;
        pastelTemplate.hueStart = 0;
        pastelTemplate.hueEnd = 360;

        ThemeGroup memory pastelGroup = ThemeGroup({
            name: ThemeName.PastelHighlighterMarker,
            themes: [pastelTemplate, pastelTemplate, pastelTemplate]
        });
        pastelGroup.themes[0].layer = ThemeLayer.BG;
        pastelGroup.themes[0].saturationStart = 80;
        pastelGroup.themes[0].saturationEnd = 100;
        pastelGroup.themes[0].lightnessStart = 85;
        pastelGroup.themes[0].lightnessEnd = 95;

        pastelGroup.themes[1].layer = ThemeLayer.Core;
        pastelGroup.themes[1].saturationStart = 100;
        pastelGroup.themes[1].saturationEnd = 100;
        pastelGroup.themes[1].lightnessStart = 55;
        pastelGroup.themes[1].lightnessEnd = 60;

        pastelGroup.themes[2].layer = ThemeLayer.FG;
        pastelGroup.themes[2].saturationStart = 70;
        pastelGroup.themes[2].saturationEnd = 90;
        pastelGroup.themes[2].lightnessStart = 67;
        pastelGroup.themes[2].lightnessEnd = 67;
        themeGroups.push(pastelGroup);

        ThemeGroup memory markerGroup = ThemeGroup({
            name: ThemeName.MarkerPastelHighlighter,
            themes: [pastelTemplate, pastelTemplate, pastelTemplate]
        });
        markerGroup.themes[0].layer = ThemeLayer.BG;
        markerGroup.themes[0].saturationStart = 100;
        markerGroup.themes[0].saturationEnd = 100;
        markerGroup.themes[0].lightnessStart = 60;
        markerGroup.themes[0].lightnessEnd = 60;

        markerGroup.themes[1].layer = ThemeLayer.Core;
        markerGroup.themes[1].saturationStart = 100;
        markerGroup.themes[1].saturationEnd = 100;
        markerGroup.themes[1].lightnessStart = 90;
        markerGroup.themes[1].lightnessEnd = 95;

        markerGroup.themes[2].layer = ThemeLayer.FG;
        markerGroup.themes[2].saturationStart = 100;
        markerGroup.themes[2].saturationEnd = 100;
        markerGroup.themes[2].lightnessStart = 55;
        markerGroup.themes[2].lightnessEnd = 60;
        themeGroups.push(markerGroup);

        ThemeGroup memory shadowGroup = ThemeGroup({
            name: ThemeName.ShadowHighlighterMarker,
            themes: [pastelTemplate, pastelTemplate, pastelTemplate]
        });
        shadowGroup.themes[0].layer = ThemeLayer.BG;
        shadowGroup.themes[0].saturationStart = 80;
        shadowGroup.themes[0].saturationEnd = 100;
        shadowGroup.themes[0].lightnessStart = 18;
        shadowGroup.themes[0].lightnessEnd = 25;

        shadowGroup.themes[1].layer = ThemeLayer.Core;
        shadowGroup.themes[1].saturationStart = 100;
        shadowGroup.themes[1].saturationEnd = 100;
        shadowGroup.themes[1].lightnessStart = 55;
        shadowGroup.themes[1].lightnessEnd = 60;

        shadowGroup.themes[2].layer = ThemeLayer.FG;
        shadowGroup.themes[2].saturationStart = 70;
        shadowGroup.themes[2].saturationEnd = 90;
        shadowGroup.themes[2].lightnessStart = 67;
        shadowGroup.themes[2].lightnessEnd = 67;
        themeGroups.push(shadowGroup);

        ThemeGroup memory berlinGroup = ThemeGroup({
            name: ThemeName.Berlin,
            themes: [pastelTemplate, pastelTemplate, pastelTemplate]
        });
        berlinGroup.themes[0].layer = ThemeLayer.BG;
        berlinGroup.themes[0].saturationStart = 100;
        berlinGroup.themes[0].saturationEnd = 100;
        berlinGroup.themes[0].lightnessStart = 18;
        berlinGroup.themes[0].lightnessEnd = 18;

        berlinGroup.themes[1].layer = ThemeLayer.Core;
        berlinGroup.themes[1].saturationStart = 100;
        berlinGroup.themes[1].saturationEnd = 100;
        berlinGroup.themes[1].lightnessStart = 45;
        berlinGroup.themes[1].lightnessEnd = 45;

        berlinGroup.themes[2].layer = ThemeLayer.FG;
        berlinGroup.themes[2].saturationStart = 100;
        berlinGroup.themes[2].saturationEnd = 100;
        berlinGroup.themes[2].lightnessStart = 30;
        berlinGroup.themes[2].lightnessEnd = 30;
        themeGroups.push(berlinGroup);
    }

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
    function getMetadata(uint256 date) public view returns (string memory) {
        return
            string(
                abi.encodePacked(
                    'data:application/json;base64,',
                    Base64.encode(
                        abi.encodePacked(
                            '{"name":"',
                            getName(date),
                            '",',
                            '"description": "Anybody Problem (https://anybody.trifle.life)",',
                            '"image": "',
                            getSVG(date),
                            '",',
                            '"image_url": "',
                            getSVG(date),
                            '",',
                            '"home_url": "https://anybody.trifle.life",',
                            '"external_url": "https://anybody.trifle.life",',
                            // '"animation_url": "', getHTML(tokenId), '",',
                            '"attributes": ',
                            getAttributes(date),
                            '}'
                        )
                    )
                )
            );
    }

    function getName(uint256 date) public pure returns (string memory) {
        (uint year, uint month, uint day) = BokkyPooBahsDateTimeLibrary
            .timestampToDate(date);
        return
            string(
                abi.encodePacked(
                    StringsExtended.toString(year),
                    '-',
                    StringsExtended.toString(month),
                    '-',
                    StringsExtended.toString(day)
                )
            );
    }

    function getHTML(uint256 date) public view returns (string memory) {
        return
            string(
                abi.encodePacked(
                    'data:text/html;base64,',
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
    function getSVG(uint256 date) public view returns (string memory) {
        return
            string(
                abi.encodePacked(
                    'data:image/svg+xml;base64,',
                    Base64.encode(
                        abi.encodePacked(
                            '<?xml version="1.0" encoding="utf-8"?><svg xmlns="http://www.w3.org/2000/svg"  height="100%" width="100%" viewBox="0 0 1000 1000" style="background-color:grey;"><style></style>',
                            getPath(date),
                            '<text x="50" y="550" class="name">',
                            getName(date),
                            '</text></svg>'
                        )
                    )
                )
            );
    }

    function getPath(uint256 date) public view returns (string memory) {
        // const { seed, bodyCount, tickCount, mintedBodiesIndex } = problem
        string memory path = '';
        uint256 scalingFactor = AnybodyProblem(anybodyProblem).scalingFactor();
        uint256 level = AnybodyProblem(anybodyProblem).LEVELS();
        (
            AnybodyProblem.Body[6] memory bodies,
            uint256 bodyCount
        ) = AnybodyProblem(anybodyProblem).generateLevelData(date, level);
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
                    '.',
                    StringsExtended.toString(pxDecimals)
                )
            );
            uint256 pyScaled = body.py / scalingFactor;
            uint256 pyDecimals = body.py - (pyScaled * scalingFactor);
            string memory pyString = string(
                abi.encodePacked(
                    StringsExtended.toString(pyScaled),
                    '.',
                    StringsExtended.toString(pyDecimals)
                )
            );
            string memory bodyIDString = StringsExtended.toString(
                body.bodyIndex
            );
            string memory transformOrigin = string(
                abi.encodePacked(
                    'transform-origin: ',
                    pxString,
                    'px ',
                    pyString,
                    'px; '
                )
            );
            path = string(
                abi.encodePacked(
                    path,
                    '<style> @keyframes moveEllipse',
                    bodyIDString,
                    ' { 0% { ',
                    transformOrigin,
                    ' transform: rotate(0deg) translate(0px, 10px); } 100% { ',
                    transformOrigin,
                    ' transform: rotate(360deg) translate(0px, 10px); } }',
                    'ellipse#id-',
                    bodyIDString,
                    ' { animation: moveEllipse',
                    bodyIDString,
                    ' 4s infinite linear; animation-delay: -',
                    StringsExtended.toString(i),
                    's; }</style>',
                    '<ellipse id="id-',
                    bodyIDString,
                    '" ry="',
                    radius,
                    '.',
                    radiusDecimalsString,
                    '" rx="',
                    radius,
                    '.',
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
                'hsl(',
                StringsExtended.toString(color),
                ',',
                StringsExtended.toString(saturation),
                '%,',
                StringsExtended.toString(lightness),
                '%)'
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
    function getAttributes(uint256 date) internal view returns (string memory) {
        (uint year, uint month, uint day) = BokkyPooBahsDateTimeLibrary
            .timestampToDate(date);
        uint256 fastestRunId = AnybodyProblem(anybodyProblem).fastestByDay(
            date,
            0
        );
        uint256 secondFastestRunId = AnybodyProblem(anybodyProblem)
            .fastestByDay(date, 1);
        uint256 thirdFastestRunId = AnybodyProblem(anybodyProblem).fastestByDay(
            date,
            2
        );
        (address fastestAddress, , uint256 fastestTime, , ) = AnybodyProblem(
            anybodyProblem
        ).runs(fastestRunId);
        (
            address secondFastestAddress,
            ,
            uint256 secondFastestTime,
            ,

        ) = AnybodyProblem(anybodyProblem).runs(secondFastestRunId);
        (
            address thirdFastestAddress,
            ,
            uint256 thirdFastestTime,
            ,

        ) = AnybodyProblem(anybodyProblem).runs(thirdFastestRunId);

        return
            string(
                abi.encodePacked(
                    '[',
                    '{"trait_type":"Day","value":"',
                    StringsExtended.toString(date),
                    '"}, {"trait_type":"Month","value":"',
                    StringsExtended.toString(year),
                    '-',
                    Math.log10(month) + 1 == 1 ? '0' : '',
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

    function updateAnybodyProblemAddress(
        address payable anybodyProblem_
    ) public onlyOwner {
        anybodyProblem = anybodyProblem_;
    }

    function updateSpeedrunsAddress(
        address payable speedruns_
    ) public onlyOwner {
        speedruns = speedruns_;
    }

    function getHeroBodyLayerColor(
        uint256 seed,
        uint256 dayThemeGroupIdx,
        ThemeLayer layer
    ) public view returns (uint256[3] memory hsl) {
        uint256 rand = uint256(keccak256(abi.encodePacked(seed)));
        uint256 dayThemeIndex = randomRange(0, themeGroups.length - 1, rand);
        Theme storage theme = themeGroups[dayThemeIndex].themes[uint256(layer)];
        
        rand = uint256(keccak256(abi.encodePacked(rand)));
        uint256 hue = randomRange(theme.hueStart, theme.hueEnd, rand);

        rand = uint256(keccak256(abi.encodePacked(rand)));
        uint256 saturation = randomRange(theme.saturationStart, theme.saturationEnd, rand);

        rand = uint256(keccak256(abi.encodePacked(rand)));
        uint256 lightness = randomRange(theme.lightnessStart, theme.lightnessEnd, rand);

        hsl = [hue, saturation, lightness];
    }

    function getHeroBodyLayerPath(
        uint256 seed,
        ThemeLayer layer
    ) public view returns (string memory) {
        uint256 options = svgSizes[layer];
        uint256 rand = uint256(keccak256(abi.encodePacked(seed)));
        uint256 pathIdx = randomRange(0, options - 1, rand);
        return svgPaths[layer][pathIdx];
    }

    function getHeroBodySVG(
        uint256 day
    ) internal view returns (string memory) {
        uint256 rand = uint256(keccak256(abi.encodePacked(day)));
        uint256 themeGroupOfDay = randomRange(0, themeGroups.length - 1, rand);

        // BG
        rand = uint256(keccak256(abi.encodePacked(rand)));
        string memory bgPath = getHeroBodyLayerPath(rand, ThemeLayer.BG);

        rand = uint256(keccak256(abi.encodePacked(rand)));
        uint256[3] memory bgColor = getHeroBodyLayerColor(rand, themeGroupOfDay, ThemeLayer.BG);

        // CORE
        rand = uint256(keccak256(abi.encodePacked(rand)));
        string memory corePath = getHeroBodyLayerPath(rand, ThemeLayer.Core);

        rand = uint256(keccak256(abi.encodePacked(rand)));
        uint256[3] memory coreColor = getHeroBodyLayerColor(rand, themeGroupOfDay, ThemeLayer.Core);

        // FG
        rand = uint256(keccak256(abi.encodePacked(rand)));
        string memory fgPath = getHeroBodyLayerPath(rand, ThemeLayer.FG);

        rand = uint256(keccak256(abi.encodePacked(rand)));
        uint256[3] memory fgColor = getHeroBodyLayerColor(rand, themeGroupOfDay, ThemeLayer.FG);

        //TODO: compose total SVG here
        return "edfddfd";
    }

    function getBaddieBodyColor(
        uint256 day,
        uint256 bodyIndex
    ) internal pure returns (uint256[3] memory hsl) {
        uint256 rand = uint256(keccak256(abi.encodePacked(day, bodyIndex)));
        uint256 hue = randomRange(0, 359, rand);
        
        rand = uint256(keccak256(abi.encodePacked(rand)));
        uint256 saturation = randomRange(90, 100, rand);

        rand = uint256(keccak256(abi.encodePacked(rand)));
        uint256 lightness = randomRange(55, 60, rand);

        return [hue, saturation, lightness];
    }

    function randomRange(
        uint256 min, 
        uint256 max, 
        uint256 seed
    ) internal pure returns (uint256) {
        require(min <= max, "Min should be less than or equal to max");
        uint256 range = max - min;
        uint256 randomValue = (seed % range) + min;        
        return randomValue;
    }
}
