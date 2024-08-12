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
        SaturatedExcludeDarks,
        PastelHighlighterMarker,
        MarkerPastelHighlighter,
        ShadowHighlighterMarker,
        Berlin
    }
    uint8 public constant themeCount = 5;
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
        ThemeSpecs memory satXDark = ThemeSpecs({
            hueStart: 0,
            hueEnd: 359,
            saturationStart: 80,
            saturationEnd: 100,
            lightnessStart: 32,
            lightnessEnd: 100
        });

        //SaturatedExcludeDarks

        colourThemes[ThemeName.SaturatedExcludeDarks][ThemeLayer.BG] = satXDark;
        colourThemes[ThemeName.SaturatedExcludeDarks][
            ThemeLayer.Core
        ] = satXDark;
        colourThemes[ThemeName.SaturatedExcludeDarks][ThemeLayer.FG] = satXDark;

        //PastelHighlighterMarker

        colourThemes[ThemeName.PastelHighlighterMarker][
            ThemeLayer.BG
        ] = satXDark;
        colourThemes[ThemeName.PastelHighlighterMarker][ThemeLayer.BG]
            .saturationStart = 80;
        colourThemes[ThemeName.PastelHighlighterMarker][ThemeLayer.BG]
            .saturationEnd = 100;
        colourThemes[ThemeName.PastelHighlighterMarker][ThemeLayer.BG]
            .lightnessStart = 85;
        colourThemes[ThemeName.PastelHighlighterMarker][ThemeLayer.BG]
            .lightnessEnd = 95;

        colourThemes[ThemeName.PastelHighlighterMarker][
            ThemeLayer.Core
        ] = satXDark;
        colourThemes[ThemeName.PastelHighlighterMarker][ThemeLayer.Core]
            .saturationStart = 100;
        colourThemes[ThemeName.PastelHighlighterMarker][ThemeLayer.Core]
            .saturationEnd = 100;
        colourThemes[ThemeName.PastelHighlighterMarker][ThemeLayer.Core]
            .lightnessStart = 55;
        colourThemes[ThemeName.PastelHighlighterMarker][ThemeLayer.Core]
            .lightnessEnd = 60;

        colourThemes[ThemeName.PastelHighlighterMarker][
            ThemeLayer.FG
        ] = satXDark;
        colourThemes[ThemeName.PastelHighlighterMarker][ThemeLayer.FG]
            .saturationStart = 70;
        colourThemes[ThemeName.PastelHighlighterMarker][ThemeLayer.FG]
            .saturationEnd = 90;
        colourThemes[ThemeName.PastelHighlighterMarker][ThemeLayer.FG]
            .lightnessStart = 67;
        colourThemes[ThemeName.PastelHighlighterMarker][ThemeLayer.FG]
            .lightnessEnd = 67;

        //MarkerPastelHighlighter

        colourThemes[ThemeName.MarkerPastelHighlighter][
            ThemeLayer.BG
        ] = satXDark;
        colourThemes[ThemeName.MarkerPastelHighlighter][ThemeLayer.BG]
            .saturationStart = 100;
        colourThemes[ThemeName.MarkerPastelHighlighter][ThemeLayer.BG]
            .saturationEnd = 100;
        colourThemes[ThemeName.MarkerPastelHighlighter][ThemeLayer.BG]
            .lightnessStart = 60;
        colourThemes[ThemeName.MarkerPastelHighlighter][ThemeLayer.BG]
            .lightnessEnd = 60;

        colourThemes[ThemeName.MarkerPastelHighlighter][
            ThemeLayer.Core
        ] = satXDark;
        colourThemes[ThemeName.MarkerPastelHighlighter][ThemeLayer.Core]
            .saturationStart = 100;
        colourThemes[ThemeName.MarkerPastelHighlighter][ThemeLayer.Core]
            .saturationEnd = 100;
        colourThemes[ThemeName.MarkerPastelHighlighter][ThemeLayer.Core]
            .lightnessStart = 90;
        colourThemes[ThemeName.MarkerPastelHighlighter][ThemeLayer.Core]
            .lightnessEnd = 95;

        colourThemes[ThemeName.MarkerPastelHighlighter][
            ThemeLayer.FG
        ] = satXDark;
        colourThemes[ThemeName.MarkerPastelHighlighter][ThemeLayer.FG]
            .saturationStart = 100;
        colourThemes[ThemeName.MarkerPastelHighlighter][ThemeLayer.FG]
            .saturationEnd = 100;
        colourThemes[ThemeName.MarkerPastelHighlighter][ThemeLayer.FG]
            .lightnessStart = 55;
        colourThemes[ThemeName.MarkerPastelHighlighter][ThemeLayer.FG]
            .lightnessEnd = 60;

        //ShadowHighlighterMarker

        colourThemes[ThemeName.ShadowHighlighterMarker][
            ThemeLayer.BG
        ] = satXDark;
        colourThemes[ThemeName.ShadowHighlighterMarker][ThemeLayer.BG]
            .saturationStart = 80;
        colourThemes[ThemeName.ShadowHighlighterMarker][ThemeLayer.BG]
            .saturationEnd = 100;
        colourThemes[ThemeName.ShadowHighlighterMarker][ThemeLayer.BG]
            .lightnessStart = 32;
        colourThemes[ThemeName.ShadowHighlighterMarker][ThemeLayer.BG]
            .lightnessEnd = 32;

        colourThemes[ThemeName.ShadowHighlighterMarker][
            ThemeLayer.Core
        ] = satXDark;
        colourThemes[ThemeName.ShadowHighlighterMarker][ThemeLayer.Core]
            .saturationStart = 100;
        colourThemes[ThemeName.ShadowHighlighterMarker][ThemeLayer.Core]
            .saturationEnd = 100;
        colourThemes[ThemeName.ShadowHighlighterMarker][ThemeLayer.Core]
            .lightnessStart = 55;
        colourThemes[ThemeName.ShadowHighlighterMarker][ThemeLayer.Core]
            .lightnessEnd = 60;

        colourThemes[ThemeName.ShadowHighlighterMarker][
            ThemeLayer.FG
        ] = satXDark;
        colourThemes[ThemeName.ShadowHighlighterMarker][ThemeLayer.FG]
            .saturationStart = 70;
        colourThemes[ThemeName.ShadowHighlighterMarker][ThemeLayer.FG]
            .saturationEnd = 90;
        colourThemes[ThemeName.ShadowHighlighterMarker][ThemeLayer.FG]
            .lightnessStart = 67;
        colourThemes[ThemeName.ShadowHighlighterMarker][ThemeLayer.FG]
            .lightnessEnd = 67;

        //ShadowHighlighterMarker

        colourThemes[ThemeName.Berlin][ThemeLayer.BG] = satXDark;
        colourThemes[ThemeName.Berlin][ThemeLayer.BG].saturationStart = 100;
        colourThemes[ThemeName.Berlin][ThemeLayer.BG].saturationEnd = 100;
        colourThemes[ThemeName.Berlin][ThemeLayer.BG].lightnessStart = 32;
        colourThemes[ThemeName.Berlin][ThemeLayer.BG].lightnessEnd = 32;

        colourThemes[ThemeName.Berlin][ThemeLayer.Core] = satXDark;
        colourThemes[ThemeName.Berlin][ThemeLayer.Core].saturationStart = 100;
        colourThemes[ThemeName.Berlin][ThemeLayer.Core].saturationEnd = 100;
        colourThemes[ThemeName.Berlin][ThemeLayer.Core].lightnessStart = 45;
        colourThemes[ThemeName.Berlin][ThemeLayer.Core].lightnessEnd = 45;

        colourThemes[ThemeName.Berlin][ThemeLayer.FG] = satXDark;
        colourThemes[ThemeName.Berlin][ThemeLayer.FG].saturationStart = 100;
        colourThemes[ThemeName.Berlin][ThemeLayer.FG].saturationEnd = 100;
        colourThemes[ThemeName.Berlin][ThemeLayer.FG].lightnessStart = 36;
        colourThemes[ThemeName.Berlin][ThemeLayer.FG].lightnessEnd = 36;
    }
}
