//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

contract ThemeGroup {
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
    enum ThemeName {
        BlueBGDark,
        BlueBGLight
    }
    uint8 public constant themeCount = 2;
    mapping(ThemeName => mapping(ThemeLayer => ThemeSpecs)) public colourThemes;

    function getColourThemes(
        ThemeName themeName,
        ThemeLayer themeLayer
    ) public view returns (ThemeSpecs memory) {
        return colourThemes[themeName][themeLayer];
    }

    constructor() {
        setupColorThemes();
    }

    function setupColorThemes() private {
        ThemeSpecs memory bluesGeneric = ThemeSpecs({
            hueStart: 135,
            hueEnd: 105,
            saturationStart: 95,
            saturationEnd: 100,
            lightnessStart: 50,
            lightnessEnd: 60
        });

        // BlueBGDark

        // BlueBGDark BG
        colourThemes[ThemeName.BlueBGDark][ThemeLayer.BG] = bluesGeneric;
        colourThemes[ThemeName.BlueBGDark][ThemeLayer.BG].hueStart = 175;
        colourThemes[ThemeName.BlueBGDark][ThemeLayer.BG].hueEnd = 270;
        colourThemes[ThemeName.BlueBGDark][ThemeLayer.BG].lightnessEnd = 55;

        // BlueBGDark Core
        colourThemes[ThemeName.BlueBGDark][ThemeLayer.Core] = bluesGeneric;
        colourThemes[ThemeName.BlueBGDark][ThemeLayer.Core]
            .saturationStart = 100;
        colourThemes[ThemeName.BlueBGDark][ThemeLayer.Core].lightnessStart = 85;
        colourThemes[ThemeName.BlueBGDark][ThemeLayer.Core].lightnessEnd = 90;

        // BlueBGDark FG
        colourThemes[ThemeName.BlueBGDark][ThemeLayer.FG] = bluesGeneric;
        colourThemes[ThemeName.BlueBGDark][ThemeLayer.FG].lightnessStart = 55;

        // ------------------------------

        //BlueBGLight

        // BlueBGLight BG
        colourThemes[ThemeName.BlueBGLight][ThemeLayer.Core] = bluesGeneric;
        colourThemes[ThemeName.BlueBGLight][ThemeLayer.Core].hueStart = 180;
        colourThemes[ThemeName.BlueBGLight][ThemeLayer.Core].hueEnd = 250;
        colourThemes[ThemeName.BlueBGLight][ThemeLayer.Core]
            .saturationStart = 100;
        colourThemes[ThemeName.BlueBGLight][ThemeLayer.Core]
            .lightnessStart = 55;
        colourThemes[ThemeName.BlueBGLight][ThemeLayer.Core].lightnessEnd = 95;

        // BlueBGLight Core
        colourThemes[ThemeName.BlueBGLight][ThemeLayer.BG] = bluesGeneric;

        // BlueBGLight FG
        colourThemes[ThemeName.BlueBGLight][ThemeLayer.FG] = bluesGeneric;
    }
}
