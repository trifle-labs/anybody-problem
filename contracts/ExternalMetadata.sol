//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import '@openzeppelin/contracts/access/Ownable.sol';
import 'base64-sol/base64.sol';
import './AnybodyProblem.sol';
import './Assets1.sol';
import './Assets2.sol';
import './Assets3.sol';
import './Assets4.sol';
import './Assets5.sol';
import './Speedruns.sol';
import './BokkyPooBahsDateTimeLibrary.sol';
import './StringsExtended.sol';
import 'hardhat/console.sol';

/// @title ExternalMetadata
/// @notice
/// @author @okwme & @dataexcess
/// @dev The updateable and replaceable problemMetadata contract

contract ExternalMetadata is Ownable {
    using BokkyPooBahsDateTimeLibrary for uint;
    address payable public anybodyProblem;
    address payable public speedruns;
    address public assets1;
    address public assets2;
    address public assets3;
    address public assets4;
    address public assets5;

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
        FG,
        Face
    }

    struct ThemeSpecs {
        uint256 hueStart;
        uint256 hueEnd;
        uint256 saturationStart;
        uint256 saturationEnd;
        uint256 lightnessStart;
        uint256 lightnessEnd;
    }

    mapping(ThemeLayer => uint256) private svgShapeCategorySizes;
    mapping(ThemeLayer => string[]) private svgShapes;
    mapping(ThemeName => mapping(ThemeLayer => ThemeSpecs)) private colourThemes;

    constructor(
        address _assets1, 
        address _assets2, 
        address _assets3, 
        address _assets4, 
        address _assets5
    ) 
    {
        assets1 = _assets1;
        assets2 = _assets2;
        assets3 = _assets3;
        assets4 = _assets4;
        assets5 = _assets5;

        setupSVGPaths();
        setupColorThemes();
    }

    function setupSVGPaths() 
        internal 
    {
        svgShapeCategorySizes[ThemeLayer.Face] = 14;
        svgShapeCategorySizes[ThemeLayer.BG] = 10;
        svgShapeCategorySizes[ThemeLayer.FG] = 10;
        svgShapeCategorySizes[ThemeLayer.Core] = 1;

        string[] storage faceShapes = svgShapes[ThemeLayer.Face];
        faceShapes.push(Assets5(assets5).FACE_SHAPE_1());
        faceShapes.push(Assets4(assets4).FACE_SHAPE_2());
        faceShapes.push(Assets4(assets4).FACE_SHAPE_3());
        faceShapes.push(Assets4(assets4).FACE_SHAPE_4());
        faceShapes.push(Assets4(assets4).FACE_SHAPE_5());
        faceShapes.push(Assets4(assets4).FACE_SHAPE_6());
        faceShapes.push(Assets4(assets4).FACE_SHAPE_7());
        faceShapes.push(Assets4(assets4).FACE_SHAPE_8());
        faceShapes.push(Assets5(assets5).FACE_SHAPE_9());
        faceShapes.push(Assets5(assets5).FACE_SHAPE_10());
        faceShapes.push(Assets5(assets5).FACE_SHAPE_11());
        faceShapes.push(Assets5(assets5).FACE_SHAPE_12());
        faceShapes.push(Assets5(assets5).FACE_SHAPE_13());
        faceShapes.push(Assets5(assets5).FACE_SHAPE_14());

        string[] storage bgShapes = svgShapes[ThemeLayer.BG];
        bgShapes.push(Assets1(assets1).BG_SHAPE_1());
        bgShapes.push(Assets1(assets1).BG_SHAPE_2());
        bgShapes.push(Assets1(assets1).BG_SHAPE_3());
        bgShapes.push(Assets1(assets1).BG_SHAPE_4());
        bgShapes.push(Assets1(assets1).BG_SHAPE_5());
        bgShapes.push(Assets1(assets1).BG_SHAPE_6());
        bgShapes.push(Assets1(assets1).BG_SHAPE_7());
        bgShapes.push(Assets1(assets1).BG_SHAPE_8());
        bgShapes.push(Assets1(assets1).BG_SHAPE_9());
        bgShapes.push(Assets1(assets1).BG_SHAPE_10());

        string[] storage coreShapes = svgShapes[ThemeLayer.Core];
        coreShapes.push(Assets2(assets2).CORE_SHAPE_1());

        string[] storage fgShapes = svgShapes[ThemeLayer.FG];
        fgShapes.push(Assets2(assets2).FG_SHAPE_1());
        fgShapes.push(Assets2(assets2).FG_SHAPE_2());
        fgShapes.push(Assets1(assets1).FG_SHAPE_3());
        fgShapes.push(Assets2(assets2).FG_SHAPE_4());
        fgShapes.push(Assets2(assets2).FG_SHAPE_5());
        fgShapes.push(Assets3(assets3).FG_SHAPE_6());
        fgShapes.push(Assets3(assets3).FG_SHAPE_7());
        fgShapes.push(Assets3(assets3).FG_SHAPE_8());
        fgShapes.push(Assets2(assets2).FG_SHAPE_9());
        fgShapes.push(Assets2(assets2).FG_SHAPE_10());
    }

    function setupColorThemes() 
        internal 
    {

        ThemeSpecs memory satXDark = ThemeSpecs({
            hueStart: 0,
            hueEnd: 360,
            saturationStart: 80,
            saturationEnd: 100,
            lightnessStart: 18,
            lightnessEnd: 100
        });

        //SaturatedExcludeDarks

        colourThemes[ThemeName.SaturatedExcludeDarks][ThemeLayer.BG] = satXDark;
        colourThemes[ThemeName.SaturatedExcludeDarks][ThemeLayer.Core] = satXDark;
        colourThemes[ThemeName.SaturatedExcludeDarks][ThemeLayer.FG] = satXDark;

        //PastelHighlighterMarker

        colourThemes[ThemeName.PastelHighlighterMarker][ThemeLayer.BG] = satXDark;
        colourThemes[ThemeName.PastelHighlighterMarker][ThemeLayer.BG].saturationStart = 80;
        colourThemes[ThemeName.PastelHighlighterMarker][ThemeLayer.BG].saturationEnd = 100;
        colourThemes[ThemeName.PastelHighlighterMarker][ThemeLayer.BG].lightnessStart = 85;
        colourThemes[ThemeName.PastelHighlighterMarker][ThemeLayer.BG].lightnessEnd = 95;

        colourThemes[ThemeName.PastelHighlighterMarker][ThemeLayer.Core] = satXDark;
        colourThemes[ThemeName.PastelHighlighterMarker][ThemeLayer.Core].saturationStart = 100;
        colourThemes[ThemeName.PastelHighlighterMarker][ThemeLayer.Core].saturationEnd = 100;
        colourThemes[ThemeName.PastelHighlighterMarker][ThemeLayer.Core].lightnessStart = 55;
        colourThemes[ThemeName.PastelHighlighterMarker][ThemeLayer.Core].lightnessEnd = 60;

        colourThemes[ThemeName.PastelHighlighterMarker][ThemeLayer.FG] = satXDark;
        colourThemes[ThemeName.PastelHighlighterMarker][ThemeLayer.FG].saturationStart = 70;
        colourThemes[ThemeName.PastelHighlighterMarker][ThemeLayer.FG].saturationEnd = 90;
        colourThemes[ThemeName.PastelHighlighterMarker][ThemeLayer.FG].lightnessStart = 67;
        colourThemes[ThemeName.PastelHighlighterMarker][ThemeLayer.FG].lightnessEnd = 67;

        //MarkerPastelHighlighter

        colourThemes[ThemeName.MarkerPastelHighlighter][ThemeLayer.BG] = satXDark;
        colourThemes[ThemeName.MarkerPastelHighlighter][ThemeLayer.BG].saturationStart = 100;
        colourThemes[ThemeName.MarkerPastelHighlighter][ThemeLayer.BG].saturationEnd = 100;
        colourThemes[ThemeName.MarkerPastelHighlighter][ThemeLayer.BG].lightnessStart = 60;
        colourThemes[ThemeName.MarkerPastelHighlighter][ThemeLayer.BG].lightnessEnd = 60;

        colourThemes[ThemeName.MarkerPastelHighlighter][ThemeLayer.Core] = satXDark;
        colourThemes[ThemeName.MarkerPastelHighlighter][ThemeLayer.Core].saturationStart = 100;
        colourThemes[ThemeName.MarkerPastelHighlighter][ThemeLayer.Core].saturationEnd = 100;
        colourThemes[ThemeName.MarkerPastelHighlighter][ThemeLayer.Core].lightnessStart = 90;
        colourThemes[ThemeName.MarkerPastelHighlighter][ThemeLayer.Core].lightnessEnd = 95;

        colourThemes[ThemeName.MarkerPastelHighlighter][ThemeLayer.FG] = satXDark;
        colourThemes[ThemeName.MarkerPastelHighlighter][ThemeLayer.FG].saturationStart = 100;
        colourThemes[ThemeName.MarkerPastelHighlighter][ThemeLayer.FG].saturationEnd = 100;
        colourThemes[ThemeName.MarkerPastelHighlighter][ThemeLayer.FG].lightnessStart = 55;
        colourThemes[ThemeName.MarkerPastelHighlighter][ThemeLayer.FG].lightnessEnd = 60;

        //ShadowHighlighterMarker

        colourThemes[ThemeName.ShadowHighlighterMarker][ThemeLayer.BG] = satXDark;
        colourThemes[ThemeName.ShadowHighlighterMarker][ThemeLayer.BG].saturationStart = 80;
        colourThemes[ThemeName.ShadowHighlighterMarker][ThemeLayer.BG].saturationEnd = 100;
        colourThemes[ThemeName.ShadowHighlighterMarker][ThemeLayer.BG].lightnessStart = 18;
        colourThemes[ThemeName.ShadowHighlighterMarker][ThemeLayer.BG].lightnessEnd = 25;

        colourThemes[ThemeName.ShadowHighlighterMarker][ThemeLayer.Core] = satXDark;
        colourThemes[ThemeName.ShadowHighlighterMarker][ThemeLayer.Core].saturationStart = 100;
        colourThemes[ThemeName.ShadowHighlighterMarker][ThemeLayer.Core].saturationEnd = 100;
        colourThemes[ThemeName.ShadowHighlighterMarker][ThemeLayer.Core].lightnessStart = 55;
        colourThemes[ThemeName.ShadowHighlighterMarker][ThemeLayer.Core].lightnessEnd = 60;

        colourThemes[ThemeName.ShadowHighlighterMarker][ThemeLayer.FG] = satXDark;
        colourThemes[ThemeName.ShadowHighlighterMarker][ThemeLayer.FG].saturationStart = 70;
        colourThemes[ThemeName.ShadowHighlighterMarker][ThemeLayer.FG].saturationEnd = 90;
        colourThemes[ThemeName.ShadowHighlighterMarker][ThemeLayer.FG].lightnessStart = 67;
        colourThemes[ThemeName.ShadowHighlighterMarker][ThemeLayer.FG].lightnessEnd = 67;

        //ShadowHighlighterMarker

        colourThemes[ThemeName.Berlin][ThemeLayer.BG] = satXDark;
        colourThemes[ThemeName.Berlin][ThemeLayer.BG].saturationStart = 100;
        colourThemes[ThemeName.Berlin][ThemeLayer.BG].saturationEnd = 100;
        colourThemes[ThemeName.Berlin][ThemeLayer.BG].lightnessStart = 18;
        colourThemes[ThemeName.Berlin][ThemeLayer.BG].lightnessEnd = 18;

        colourThemes[ThemeName.Berlin][ThemeLayer.Core] = satXDark;
        colourThemes[ThemeName.Berlin][ThemeLayer.Core].saturationStart = 100;
        colourThemes[ThemeName.Berlin][ThemeLayer.Core].saturationEnd = 100;
        colourThemes[ThemeName.Berlin][ThemeLayer.Core].lightnessStart = 45;
        colourThemes[ThemeName.Berlin][ThemeLayer.Core].lightnessEnd = 45;

        colourThemes[ThemeName.Berlin][ThemeLayer.FG] = satXDark;
        colourThemes[ThemeName.Berlin][ThemeLayer.FG].saturationStart = 100;
        colourThemes[ThemeName.Berlin][ThemeLayer.FG].saturationEnd = 100;
        colourThemes[ThemeName.Berlin][ThemeLayer.FG].lightnessStart = 30;
        colourThemes[ThemeName.Berlin][ThemeLayer.FG].lightnessEnd = 30;
    }

    /// @dev generates the problemMetadata
    /// @param date the date
    function getMetadata(uint256 date) 
        public 
        view 
        returns (string memory)
    {
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

    function getName(uint256 date) 
        public 
        pure 
        returns (string memory) 
    {
        (uint year, uint month, uint day) = BokkyPooBahsDateTimeLibrary.timestampToDate(date);
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

    function getHTML(uint256 date) 
        public 
        view 
        returns (string memory) 
    {
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
    function getSVG(uint256 date) 
        public 
        view 
        returns (string memory) 
    {
        return
            string(
                abi.encodePacked(
                    'data:image/svg+xml;base64,',
                    Base64.encode(
                        abi.encodePacked(
                            '<?xml version="1.0" encoding="utf-8"?>',
                            '<svg xmlns="http://www.w3.org/2000/svg"  height="100%" width="100%" viewBox="0 0 1000 1000" style="background-color:transparent;">',
                                getPath(date),
                            // '<text x="50" y="550" class="name">',
                            // getName(date),
                            // '</text>','
                            '</svg>'
                        )
                    )
                )
            );
    }

    function getPath(uint256 date) 
        internal 
        view 
        returns (string memory) 
    {
        uint256 level = AnybodyProblem(anybodyProblem).LEVELS();
        (
            AnybodyProblem.Body[6] memory bodies,
            uint256 bodyCount
        ) = AnybodyProblem(anybodyProblem).generateLevelData(date, level);

        AnybodyProblem.Body memory heroBody = bodies[0];
        string memory bodyIDString = StringsExtended.toString(heroBody.bodyIndex);

        string memory path = string(
            abi.encodePacked(
                '<style>',
                    '#id-hero ',
                    '{ ',
                        'transform-origin: 300px 300px; ',
                        'transform: translate(200px, 200px) scale(1.8); ', 
                    '}',
                '</style>'
                '<g id="id-hero">',
                    getHeroBodyPath(date),
                '</g>'
            )
        );

        return path;
    }

    function getHeroBodyPath(uint256 date) 
        internal 
        view
        returns (string memory) 
    {
        //FACE SHAPE
        bytes32 rand = keccak256(abi.encodePacked(date));
        uint256 pathIdxFace = randomRange(0, svgShapeCategorySizes[ThemeLayer.Face] - 1, rand);
        string memory pathFace = svgShapes[ThemeLayer.Face][pathIdxFace];

        //BACKGROUND SHAPE
        rand = keccak256(abi.encodePacked(rand));
        uint256 pathIdxBG = randomRange(0, svgShapeCategorySizes[ThemeLayer.BG] - 1, rand);
        string memory pathBG = svgShapes[ThemeLayer.BG][pathIdxBG];

        //FOREGROUND SHAPE
        rand = keccak256(abi.encodePacked(rand));
        uint256 pathIdxFG = randomRange(0, svgShapeCategorySizes[ThemeLayer.FG] - 1, rand);
        string memory pathFG = svgShapes[ThemeLayer.FG][pathIdxFG];

        //CORE SHAPE
        rand = keccak256(abi.encodePacked(rand));
        uint256 pathIdxCore = randomRange(0, svgShapeCategorySizes[ThemeLayer.Core] - 1, rand);
        string memory pathCore = svgShapes[ThemeLayer.Core][pathIdxCore];

        //DAILY COLOR THEME
        rand = keccak256(abi.encodePacked(rand));
        uint8 themegroupsAmount = 5;
        ThemeName currentDayTheme = ThemeName(randomRange(0, themegroupsAmount - 1, rand));

        //BACKGROUND COLOR
        uint256[3] memory colorsBGValues; 
        (colorsBGValues, rand) = getHeroBodyLayerColor(rand, currentDayTheme, ThemeLayer.BG);
        string memory colorsBG = string(
            abi.encodePacked(
                'hsl(', 
                StringsExtended.toString(colorsBGValues[0]), ',', 
                StringsExtended.toString(colorsBGValues[1]), '%,', 
                StringsExtended.toString(colorsBGValues[2]), '%)'
            )
        );

        //CORE COLOR
        uint256[3] memory colorsCoreValues; 
        (colorsCoreValues, rand) = getHeroBodyLayerColor(rand, currentDayTheme, ThemeLayer.Core);
        string memory colorsCore= string(
            abi.encodePacked(
                'hsl(', 
                StringsExtended.toString(colorsCoreValues[0]), ',', 
                StringsExtended.toString(colorsCoreValues[1]), '%,', 
                StringsExtended.toString(colorsCoreValues[2]), '%)'
            )
        ); 

        //FOREGROUND COLOR
        uint256[3] memory colorsFGValues; 
        (colorsFGValues, rand) = getHeroBodyLayerColor(rand, currentDayTheme, ThemeLayer.FG);
        string memory colorsFG = string(
            abi.encodePacked(
                'hsl(', 
                StringsExtended.toString(colorsFGValues[0]), ',', 
                StringsExtended.toString(colorsFGValues[1]), '%,', 
                StringsExtended.toString(colorsFGValues[2]), '%)'
            )
        ); 

        string memory path = string(
            abi.encodePacked(
                getRotationAnimation('BG', '300px 300px', '0px, 0px', '12', '0', 'reverse' ),
                '<g id="id-BG" fill="', colorsBG ,'" >',
                    pathBG,
                '</g>',
                getRotationAnimation('Core', '113px 113px', '187px, 187px', '34', '0', 'normal' ),
                '<g id="id-Core" fill="', colorsCore ,'" >',
                    pathCore,
                '</g>',
                getRotationAnimation('FG', '300px 300px', '0px,0px', '8', '0', 'normal' ),
                '<g id="id-FG" fill="', colorsFG ,'" >',
                    pathFG,
                '</g>',
                '<g id="id-Face">',
                    pathFace,
                '</g>'
            )
        );

        return path; 
    }

    function getRotationAnimation(
        string memory bodyId, 
        string memory transformOrigin, 
        string memory translation,
        string memory duration,
        string memory delay,
        string memory direction
    )   internal  
        pure
        returns (string memory) 
    {
        string memory path = string(
            abi.encodePacked(
                '<style> @keyframes move', bodyId, ' ',
                    '{ ',
                        '0% { ',
                            'transform-origin: ', transformOrigin ,';',
                            'transform: translate(', translation, ') rotate(0deg); }', 
                        '100% {',
                            'transform-origin: ', transformOrigin ,';',
                            'transform: translate(', translation, ') rotate(360deg); }',
                    '} ',
                    '#id-', bodyId, ' ',
                    '{ ',
                        'animation: move', bodyId, ' ', duration, 's infinite linear; ', 
                        'animation-delay: ', delay, 's; ',
                        'animation-direction: ', direction, '; ',
                    '}',
                '</style>'
            )
        );
        return path;
    }

    /// @dev generates the attributes as JSON String
    function getAttributes(uint256 date) 
        internal 
        view 
        returns (string memory) 
    {
        (uint year, uint month, uint day) = BokkyPooBahsDateTimeLibrary.timestampToDate(date);
        uint256 fastestRunId = AnybodyProblem(anybodyProblem).fastestByDay(date, 0);
        uint256 secondFastestRunId = AnybodyProblem(anybodyProblem).fastestByDay(date, 1);
        uint256 thirdFastestRunId = AnybodyProblem(anybodyProblem).fastestByDay(date, 2);
        (address fastestAddress, , uint256 fastestTime, , ) = AnybodyProblem(anybodyProblem).runs(fastestRunId);
        (address secondFastestAddress, , uint256 secondFastestTime, , ) = AnybodyProblem(anybodyProblem).runs(secondFastestRunId);
        (address thirdFastestAddress, , uint256 thirdFastestTime, , ) = AnybodyProblem(anybodyProblem).runs(thirdFastestRunId);
        return string(
            abi.encodePacked(
                '[',
                    '{"trait_type":"Day","value":"',
                    StringsExtended.toString(date),
                    '"}, {"trait_type":"Year-Month","value":"',
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

    function getHeroBodyLayerColor(
        bytes32 seed,
        ThemeName theme,
        ThemeLayer layer
    )   public view returns (uint256[3] memory, bytes32) {
        
        bytes32 rand = keccak256(abi.encodePacked(seed));
        uint256 hue = randomRange(
            colourThemes[theme][layer].hueStart, 
            colourThemes[theme][layer].hueEnd, 
            rand
        );

        rand = keccak256(abi.encodePacked(rand));
        uint256 sat = randomRange(
            colourThemes[theme][layer].saturationStart, 
            colourThemes[theme][layer].saturationEnd, 
            rand
        );

        rand = keccak256(abi.encodePacked(rand));
        uint256 light = randomRange(
            colourThemes[theme][layer].lightnessStart, 
            colourThemes[theme][layer].lightnessEnd, 
            rand
        );

        return ([hue, sat, light], rand);
    }

    function getBaddieBodyColor(
        uint256 day,
        uint256 bodyIndex
    )   internal 
        pure 
        returns (uint256[3] memory hsl) 
    {
        bytes32 rand = keccak256(abi.encodePacked(day, bodyIndex));
        uint256 hue = randomRange(0, 359, rand);
        
        rand = keccak256(abi.encodePacked(rand));
        uint256 saturation = randomRange(90, 100, rand);

        rand = keccak256(abi.encodePacked(rand));
        uint256 lightness = randomRange(55, 60, rand);

        return [hue, saturation, lightness];
    }

    function randomRange(
        uint256 min, 
        uint256 max, 
        bytes32 seed
    )   internal 
        pure returns (uint256) 
    {
        require(min <= max, "Min should be less than or equal to max");
        if (min == max) { return min; }
        uint256 range = max - min;
        uint256 randomValue = (uint256(seed) % range) + min;        
        return randomValue;
    }

    function updateAnybodyProblemAddress(address payable anybodyProblem_) 
        public 
        onlyOwner 
    {
        anybodyProblem = anybodyProblem_;
    }

    function updateSpeedrunsAddress(address payable speedruns_) 
        public 
        onlyOwner 
    {
        speedruns = speedruns_;
    }
}
