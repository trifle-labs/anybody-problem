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
        setupSVGPaths();
    }

    function setupSVGPaths() internal {

        svgSizes[ThemeLayer.BG] = 10;
        svgPaths[ThemeLayer.BG].push('M510.575 257.189C503.007 253.114 494.192 252.116 485.876 253.946C470.492 257.355 430.742 266.17 385.836 276.316C379.849 277.646 373.778 274.569 371.366 268.915C371.283 268.665 371.2 268.416 371.034 268.249C368.373 262.428 370.618 255.526 376.107 252.116C406.127 233.655 438.642 213.531 462.592 198.063C467.997 194.57 472.488 189.747 475.315 183.926C480.97 172.533 484.712 153.24 463.34 131.869C463.34 131.869 442.883 113.158 419.931 119.894C411.699 122.305 404.796 127.877 400.139 135.112C391.574 148.5 369.454 183.261 344.589 222.595C341.263 227.834 334.61 229.913 328.872 227.501C328.789 227.501 328.706 227.418 328.706 227.418C322.802 225.007 319.475 218.77 320.889 212.533C329.122 178.105 337.937 140.434 344.007 112.409C345.338 106.089 345.088 99.5196 343.009 93.3659C338.934 81.391 327.874 65.0918 297.688 65.0918C297.688 65.0918 269.912 66.3392 258.52 87.2953C254.445 94.8627 253.447 103.678 255.276 111.993C258.686 127.461 267.584 167.377 277.729 212.616C279.143 218.77 275.817 224.923 269.996 227.252C269.497 227.418 268.998 227.668 268.499 227.834C262.678 230.329 255.942 228.167 252.615 222.761C234.154 192.741 213.946 160.143 198.479 136.193C194.986 130.787 190.163 126.297 184.342 123.469C172.949 117.815 153.656 114.072 132.284 135.444C132.284 135.444 113.573 155.901 120.309 178.853C122.721 187.086 128.293 193.988 135.527 198.645C148.833 207.127 183.011 228.915 221.847 253.447C227.169 256.857 229.165 263.592 226.67 269.414C226.587 269.58 226.503 269.829 226.42 269.996C224.009 275.817 217.772 279.06 211.701 277.563C177.606 269.414 140.6 260.765 112.908 254.778C106.588 253.447 100.019 253.696 93.8648 255.775C81.8067 259.85 65.5076 270.827 65.5076 301.097C65.5076 301.097 66.755 328.872 87.711 340.265C95.2785 344.34 104.093 345.338 112.409 343.508C127.627 340.099 166.629 331.45 211.036 321.471C217.19 320.057 223.427 323.467 225.755 329.371C225.838 329.704 226.004 329.953 226.088 330.286C228.499 336.107 226.337 342.76 221.015 346.086C191.41 364.215 159.394 384.09 135.777 399.391C130.372 402.884 125.881 407.707 123.054 413.528C117.399 424.921 113.657 444.214 135.029 465.586C135.029 465.586 155.486 484.297 178.438 477.561C186.67 475.149 193.572 469.577 198.229 462.343C206.545 449.287 227.834 415.857 251.95 377.687C255.276 372.364 262.096 370.285 267.833 372.78C268.332 373.03 268.831 373.196 269.33 373.362C275.151 375.774 278.395 382.011 276.898 388.165C268.831 421.927 260.266 458.434 254.362 485.793C253.031 492.113 253.281 498.683 255.36 504.837C259.434 516.895 270.411 533.194 300.681 533.194C300.681 533.194 328.456 531.947 339.849 510.991C343.924 503.423 344.922 494.608 343.092 486.292C339.766 471.074 331.117 432.322 321.138 388.165C319.808 382.094 322.968 375.94 328.706 373.612C329.454 373.279 330.203 373.03 330.951 372.697C336.772 370.119 343.674 372.198 347.001 377.687C365.13 407.125 384.755 438.725 399.89 462.176C403.383 467.582 408.206 472.072 414.027 474.9C425.42 480.554 444.713 484.297 466.085 462.925C466.085 462.925 484.795 442.468 478.059 419.516C475.648 411.283 470.076 404.381 462.841 399.724C449.619 391.325 415.857 369.787 377.271 345.421C372.115 342.178 369.953 335.608 372.281 329.953C372.531 329.371 372.78 328.789 372.947 328.207C375.192 322.136 381.595 318.727 387.832 320.224C421.595 328.29 458.018 336.772 485.461 342.677C491.781 344.007 498.35 343.758 504.504 341.679C516.562 337.604 532.861 326.627 532.861 296.357C532.778 296.357 531.531 268.582 510.575 257.189Z');
        svgPaths[ThemeLayer.BG].push('M525.793 298.935H454.276C452.031 298.935 450.95 296.191 452.613 294.611C453.195 294.029 453.86 293.53 454.442 292.948C454.442 292.948 532.612 226.503 462.758 138.854C461.844 137.69 460.097 137.606 459.099 138.688L409.038 188.749C407.458 190.329 404.713 189.165 404.88 186.92C404.88 186.338 404.963 185.756 404.963 185.173C404.963 185.173 413.279 82.971 301.929 70.3308C300.515 70.1645 299.184 71.3287 299.184 72.7424V142.929C299.184 145.174 296.44 146.255 294.943 144.592C294.444 144.01 293.945 143.511 293.447 142.929C293.447 142.929 227.002 64.7592 139.353 134.613C138.189 135.527 138.105 137.274 139.186 138.272L189.914 188.999C191.494 190.579 190.329 193.323 188.084 193.157C187.086 193.074 186.088 193.074 185.173 193.074C185.173 193.074 82.971 184.758 70.3308 296.108C70.1645 297.521 71.3287 298.852 72.7424 298.852H142.929C145.174 298.852 146.172 301.596 144.592 303.093C144.592 303.093 144.592 303.093 144.509 303.176C144.509 303.176 66.3392 369.62 136.193 457.27C137.108 458.434 138.854 458.517 139.852 457.436L189.914 407.374C191.494 405.794 194.238 406.959 194.071 409.204C193.988 410.368 193.988 411.449 193.905 412.613C193.905 412.613 185.589 514.816 296.939 527.456C298.353 527.622 299.683 526.458 299.683 525.044V454.027C299.683 451.781 302.428 450.7 303.925 452.363C304.424 452.946 305.006 453.528 305.505 454.11C305.505 454.11 371.949 532.279 459.598 462.426C460.762 461.511 460.846 459.765 459.765 458.767L409.869 408.871C408.289 407.291 409.453 404.547 411.699 404.713C412.281 404.713 412.863 404.796 413.445 404.796C413.445 404.796 515.647 413.112 528.288 301.762C528.454 300.266 527.29 298.935 525.793 298.935Z');
        svgPaths[ThemeLayer.BG].push('M429.661 319.142V279.226H470.741L501.261 182.429L402.218 160.558L381.678 196.067L347.167 176.109L367.707 140.6L299.184 65.7568L230.661 140.6L251.202 176.109L216.607 196.067L196.067 160.558L97.0248 182.429L127.544 279.226H168.625V319.142H127.544L97.0248 415.856L196.067 437.81L216.607 402.218L251.202 422.176L230.661 457.769L299.184 532.528L367.707 457.769L347.167 422.176L381.678 402.218L402.218 437.81L501.261 415.856L470.741 319.142H429.661Z');
        svgPaths[ThemeLayer.BG].push('M482.006 363.921L451.575 300.331L482.171 236.41C485.562 238.89 489.779 240.379 494.327 240.379C505.738 240.379 515 231.117 515 219.706C515 208.294 505.738 199.033 494.327 199.033C483.825 199.033 475.225 206.806 473.819 216.894L407.252 193.41L383.519 126.263C387.819 125.685 391.954 123.7 395.179 120.392C403.283 112.288 403.283 99.2231 395.179 91.1192C387.075 83.0154 374.01 83.0154 365.906 91.1192C358.463 98.5615 357.885 110.387 364.252 118.49L300.248 149.087L236.079 118.408C238.808 114.852 240.462 110.469 240.462 105.673C240.462 94.2615 231.2 85 219.788 85C208.377 85 199.115 94.2615 199.115 105.673C199.115 116.258 207.054 124.94 217.308 126.181L193.575 193.492L126.512 217.142C126.015 212.594 124.031 208.129 120.558 204.656C112.454 196.552 99.3885 196.552 91.2846 204.656C83.1808 212.76 83.1808 225.825 91.2846 233.929C98.6442 241.288 110.221 241.95 118.325 235.831L149.252 300.413L118.738 364.169C115.183 361.275 110.635 359.538 105.673 359.538C94.2615 359.538 85 368.8 85 380.212C85 391.623 94.2615 400.885 105.673 400.885C115.927 400.885 124.527 393.36 126.098 383.519L193.575 407.335L216.977 473.654C212.512 474.15 208.212 476.135 204.738 479.525C196.635 487.629 196.635 500.694 204.738 508.798C212.842 516.902 225.908 516.902 234.012 508.798C241.206 501.604 241.95 490.44 236.327 482.337L300.496 451.658L363.756 481.923C361.11 485.396 359.621 489.696 359.621 494.41C359.621 505.821 368.883 515.083 380.294 515.083C391.706 515.083 400.967 505.821 400.967 494.41C400.967 484.238 393.608 475.721 383.85 474.067L407.335 407.417L473.737 384.015C474.398 388.233 476.3 392.202 479.525 395.427C487.629 403.531 500.694 403.531 508.798 395.427C516.902 387.323 516.902 374.258 508.798 366.154C501.521 358.712 490.11 358.05 482.006 363.921Z');
        svgPaths[ThemeLayer.BG].push('M488.787 242.969C485.71 240.64 484.463 236.649 485.627 232.907C508.163 160.808 455.773 149.332 455.773 149.332C424.588 141.348 402.138 160.724 389.249 175.194C399.561 158.895 412.034 129.872 395.236 101.848C395.236 101.848 369.207 54.863 306.589 96.9415C303.346 99.1036 299.188 99.0205 296.111 96.7752C281.142 85.7982 236.319 59.1873 204.968 106.089C204.968 106.089 184.927 137.773 208.627 174.529C195.571 160.142 170.454 141.515 139.769 149.415C139.769 149.415 87.3784 160.974 109.914 232.99C111.079 236.649 109.831 240.64 106.754 243.052C91.7858 254.195 53.4495 289.621 89.5405 332.947C89.5405 332.947 108.833 354.901 142.18 351.658C125.964 360.556 108.251 376.106 106.006 402.218C106.006 402.218 99.6028 455.523 175.111 458.018C178.936 458.184 182.346 460.679 183.51 464.338C189.248 481.968 210.038 529.867 262.844 510.076C262.844 510.076 291.534 498.516 298.436 463.673C305.421 498.516 334.028 510.076 334.028 510.076C386.834 529.867 407.624 482.051 413.362 464.338C414.526 460.679 417.936 458.184 421.761 458.018C497.186 455.523 490.866 402.218 490.866 402.218C488.704 376.273 471.157 360.722 455.024 351.824C487.207 354.069 505.668 332.947 505.668 332.947C541.842 289.621 503.506 254.195 488.787 242.969Z');
        svgPaths[ThemeLayer.BG].push('M525.793 299.517L438.476 219.019L412.78 103.095L299.434 138.438L186.171 102.763L160.143 218.603L72.576 298.852L159.893 379.35L185.589 495.273L298.935 459.931L412.198 495.606L438.226 379.765L525.793 299.517Z');
        svgPaths[ThemeLayer.BG].push('M532.446 299.184C532.446 278.228 486.542 259.933 418.102 249.871C459.432 194.404 478.891 148.999 464.089 134.197C449.286 119.395 403.882 138.854 348.415 180.184C338.436 111.744 320.141 65.9233 299.184 65.9233C278.228 65.9233 259.933 111.827 249.871 180.267C194.404 138.854 148.999 119.395 134.197 134.197C119.395 148.999 138.854 194.404 180.184 249.871C111.744 259.85 65.9233 278.228 65.9233 299.184C65.9233 320.141 111.827 338.435 180.267 348.498C138.854 403.882 119.395 449.286 134.197 464.089C148.999 478.891 194.404 459.432 249.871 418.102C259.85 486.542 278.145 532.446 299.184 532.446C320.224 532.446 338.435 486.542 348.498 418.102C403.965 459.432 449.37 478.891 464.172 464.089C478.974 449.286 459.515 403.882 418.185 348.415C486.542 338.436 532.446 320.141 532.446 299.184Z');
        svgPaths[ThemeLayer.BG].push('M299.184 70.4971L333.945 124.135L386.668 87.8773L398.31 150.829L460.846 137.44L447.54 200.059L510.408 211.618L474.151 264.341L527.872 299.184L474.151 333.945L510.408 386.668L447.54 398.31L460.846 460.846L398.31 447.54L386.668 510.408L333.945 474.151L299.184 527.872L264.341 474.151L211.618 510.408L200.059 447.54L137.44 460.846L150.829 398.31L87.8773 386.668L124.135 333.945L70.4971 299.184L124.135 264.341L87.8773 211.618L150.829 200.059L137.44 137.44L200.059 150.829L211.618 87.8773L264.341 124.135L299.184 70.4971Z');
        svgPaths[ThemeLayer.BG].push('M302.261 70.6635L305.588 91.7858C312.573 136.359 369.038 151.494 397.395 116.401L410.784 99.7691C413.029 97.0249 417.353 99.5196 416.106 102.846L408.455 122.721C392.239 164.799 433.57 206.13 475.648 189.914L495.523 182.263C498.849 181.015 501.344 185.34 498.6 187.585L481.968 200.974C446.875 229.248 462.01 285.796 506.583 292.781L527.706 296.108C531.198 296.69 531.198 301.679 527.706 302.261L506.583 305.588C462.01 312.573 446.875 369.038 481.968 397.395L498.6 410.784C501.344 413.029 498.849 417.353 495.523 416.106L475.648 408.455C433.57 392.239 392.239 433.57 408.455 475.648L416.106 495.523C417.353 498.849 413.029 501.344 410.784 498.6L397.395 481.968C369.121 446.875 312.573 462.01 305.588 506.583L302.261 527.706C301.679 531.198 296.69 531.198 296.108 527.706L292.781 506.583C285.796 462.01 229.331 446.875 200.974 481.968L187.585 498.6C185.34 501.344 181.015 498.849 182.263 495.523L189.914 475.648C206.13 433.57 164.799 392.239 122.721 408.455L102.846 416.106C99.5196 417.353 97.0249 413.029 99.7691 410.784L116.401 397.395C151.494 369.121 136.359 312.573 91.7858 305.588L70.6635 302.261C67.1708 301.679 67.1708 296.69 70.6635 296.108L91.7858 292.781C136.359 285.796 151.494 229.331 116.401 200.974L99.7691 187.585C97.0249 185.34 99.5196 181.015 102.846 182.263L122.721 189.914C164.799 206.13 206.13 164.799 189.914 122.721L182.263 102.846C181.015 99.5196 185.34 97.0249 187.585 99.7691L200.974 116.401C229.248 151.494 285.796 136.359 292.781 91.7858L296.108 70.6635C296.607 67.1708 301.679 67.1708 302.261 70.6635Z');
        svgPaths[ThemeLayer.BG].push('M319.641 87.2122L332.365 103.844C345.171 120.559 366.959 127.711 387.167 121.64L407.291 115.653C423.59 110.829 440.056 122.721 440.472 139.769L440.97 160.725C441.469 181.764 454.941 200.309 474.816 207.377L494.608 214.362C510.658 220.017 516.895 239.393 507.248 253.364L495.357 270.578C483.382 287.958 483.382 310.827 495.357 328.207L507.248 345.421C516.895 359.392 510.575 378.768 494.608 384.423L474.816 391.408C454.941 398.393 441.469 416.938 440.97 438.06L440.472 459.016C440.056 475.981 423.59 487.956 407.291 483.132L387.167 477.145C366.959 471.157 345.171 478.226 332.365 494.941L319.641 511.573C309.33 525.045 288.956 525.045 278.644 511.573L265.921 494.941C253.114 478.226 231.327 471.074 211.119 477.145L190.994 483.132C174.695 487.956 158.23 476.064 157.814 459.016L157.315 438.06C156.816 417.021 143.344 398.476 123.469 391.408L103.677 384.423C87.6277 378.768 81.3908 359.392 91.0372 345.421L102.929 328.207C114.904 310.827 114.904 287.958 102.929 270.578L91.0372 253.364C81.3908 239.393 87.7109 220.017 103.677 214.362L123.469 207.377C143.344 200.392 156.816 181.847 157.315 160.725L157.814 139.769C158.23 122.804 174.695 110.829 190.994 115.653L211.119 121.64C231.327 127.628 253.114 120.559 265.921 103.844L278.644 87.2122C288.956 73.7405 309.33 73.7405 319.641 87.2122Z');

        svgSizes[ThemeLayer.Core] = 1;
        svgPaths[ThemeLayer.Core].push('M510.575 257.189C503.007 253.114 494.192 252.116 485.876 253.946C470.492 257.355 430.742 266.17 385.836 276.316C379.849 277.646 373.778 274.569 371.366 268.915C371.283 268.665 371.2 268.416 371.034 268.249C368.373 262.428 370.618 255.526 376.107 252.116C406.127 233.655 438.642 213.531 462.592 198.063C467.997 194.57 472.488 189.747 475.315 183.926C480.97 172.533 484.712 153.24 463.34 131.869C463.34 131.869 442.883 113.158 419.931 119.894C411.699 122.305 404.796 127.877 400.139 135.112C391.574 148.5 369.454 183.261 344.589 222.595C341.263 227.834 334.61 229.913 328.872 227.501C328.789 227.501 328.706 227.418 328.706 227.418C322.802 225.007 319.475 218.77 320.889 212.533C329.122 178.105 337.937 140.434 344.007 112.409C345.338 106.089 345.088 99.5196 343.009 93.3659C338.934 81.391 327.874 65.0918 297.688 65.0918C297.688 65.0918 269.912 66.3392 258.52 87.2953C254.445 94.8627 253.447 103.678 255.276 111.993C258.686 127.461 267.584 167.377 277.729 212.616C279.143 218.77 275.817 224.923 269.996 227.252C269.497 227.418 268.998 227.668 268.499 227.834C262.678 230.329 255.942 228.167 252.615 222.761C234.154 192.741 213.946 160.143 198.479 136.193C194.986 130.787 190.163 126.297 184.342 123.469C172.949 117.815 153.656 114.072 132.284 135.444C132.284 135.444 113.573 155.901 120.309 178.853C122.721 187.086 128.293 193.988 135.527 198.645C148.833 207.127 183.011 228.915 221.847 253.447C227.169 256.857 229.165 263.592 226.67 269.414C226.587 269.58 226.503 269.829 226.42 269.996C224.009 275.817 217.772 279.06 211.701 277.563C177.606 269.414 140.6 260.765 112.908 254.778C106.588 253.447 100.019 253.696 93.8648 255.775C81.8067 259.85 65.5076 270.827 65.5076 301.097C65.5076 301.097 66.755 328.872 87.711 340.265C95.2785 344.34 104.093 345.338 112.409 343.508C127.627 340.099 166.629 331.45 211.036 321.471C217.19 320.057 223.427 323.467 225.755 329.371C225.838 329.704 226.004 329.953 226.088 330.286C228.499 336.107 226.337 342.76 221.015 346.086C191.41 364.215 159.394 384.09 135.777 399.391C130.372 402.884 125.881 407.707 123.054 413.528C117.399 424.921 113.657 444.214 135.029 465.586C135.029 465.586 155.486 484.297 178.438 477.561C186.67 475.149 193.572 469.577 198.229 462.343C206.545 449.287 227.834 415.857 251.95 377.687C255.276 372.364 262.096 370.285 267.833 372.78C268.332 373.03 268.831 373.196 269.33 373.362C275.151 375.774 278.395 382.011 276.898 388.165C268.831 421.927 260.266 458.434 254.362 485.793C253.031 492.113 253.281 498.683 255.36 504.837C259.434 516.895 270.411 533.194 300.681 533.194C300.681 533.194 328.456 531.947 339.849 510.991C343.924 503.423 344.922 494.608 343.092 486.292C339.766 471.074 331.117 432.322 321.138 388.165C319.808 382.094 322.968 375.94 328.706 373.612C329.454 373.279 330.203 373.03 330.951 372.697C336.772 370.119 343.674 372.198 347.001 377.687C365.13 407.125 384.755 438.725 399.89 462.176C403.383 467.582 408.206 472.072 414.027 474.9C425.42 480.554 444.713 484.297 466.085 462.925C466.085 462.925 484.795 442.468 478.059 419.516C475.648 411.283 470.076 404.381 462.841 399.724C449.619 391.325 415.857 369.787 377.271 345.421C372.115 342.178 369.953 335.608 372.281 329.953C372.531 329.371 372.78 328.789 372.947 328.207C375.192 322.136 381.595 318.727 387.832 320.224C421.595 328.29 458.018 336.772 485.461 342.677C491.781 344.007 498.35 343.758 504.504 341.679C516.562 337.604 532.861 326.627 532.861 296.357C532.778 296.357 531.531 268.582 510.575 257.189Z');

        svgSizes[ThemeLayer.FG] = 1;
        svgPaths[ThemeLayer.FG].push('M510.575 257.189C503.007 253.114 494.192 252.116 485.876 253.946C470.492 257.355 430.742 266.17 385.836 276.316C379.849 277.646 373.778 274.569 371.366 268.915C371.283 268.665 371.2 268.416 371.034 268.249C368.373 262.428 370.618 255.526 376.107 252.116C406.127 233.655 438.642 213.531 462.592 198.063C467.997 194.57 472.488 189.747 475.315 183.926C480.97 172.533 484.712 153.24 463.34 131.869C463.34 131.869 442.883 113.158 419.931 119.894C411.699 122.305 404.796 127.877 400.139 135.112C391.574 148.5 369.454 183.261 344.589 222.595C341.263 227.834 334.61 229.913 328.872 227.501C328.789 227.501 328.706 227.418 328.706 227.418C322.802 225.007 319.475 218.77 320.889 212.533C329.122 178.105 337.937 140.434 344.007 112.409C345.338 106.089 345.088 99.5196 343.009 93.3659C338.934 81.391 327.874 65.0918 297.688 65.0918C297.688 65.0918 269.912 66.3392 258.52 87.2953C254.445 94.8627 253.447 103.678 255.276 111.993C258.686 127.461 267.584 167.377 277.729 212.616C279.143 218.77 275.817 224.923 269.996 227.252C269.497 227.418 268.998 227.668 268.499 227.834C262.678 230.329 255.942 228.167 252.615 222.761C234.154 192.741 213.946 160.143 198.479 136.193C194.986 130.787 190.163 126.297 184.342 123.469C172.949 117.815 153.656 114.072 132.284 135.444C132.284 135.444 113.573 155.901 120.309 178.853C122.721 187.086 128.293 193.988 135.527 198.645C148.833 207.127 183.011 228.915 221.847 253.447C227.169 256.857 229.165 263.592 226.67 269.414C226.587 269.58 226.503 269.829 226.42 269.996C224.009 275.817 217.772 279.06 211.701 277.563C177.606 269.414 140.6 260.765 112.908 254.778C106.588 253.447 100.019 253.696 93.8648 255.775C81.8067 259.85 65.5076 270.827 65.5076 301.097C65.5076 301.097 66.755 328.872 87.711 340.265C95.2785 344.34 104.093 345.338 112.409 343.508C127.627 340.099 166.629 331.45 211.036 321.471C217.19 320.057 223.427 323.467 225.755 329.371C225.838 329.704 226.004 329.953 226.088 330.286C228.499 336.107 226.337 342.76 221.015 346.086C191.41 364.215 159.394 384.09 135.777 399.391C130.372 402.884 125.881 407.707 123.054 413.528C117.399 424.921 113.657 444.214 135.029 465.586C135.029 465.586 155.486 484.297 178.438 477.561C186.67 475.149 193.572 469.577 198.229 462.343C206.545 449.287 227.834 415.857 251.95 377.687C255.276 372.364 262.096 370.285 267.833 372.78C268.332 373.03 268.831 373.196 269.33 373.362C275.151 375.774 278.395 382.011 276.898 388.165C268.831 421.927 260.266 458.434 254.362 485.793C253.031 492.113 253.281 498.683 255.36 504.837C259.434 516.895 270.411 533.194 300.681 533.194C300.681 533.194 328.456 531.947 339.849 510.991C343.924 503.423 344.922 494.608 343.092 486.292C339.766 471.074 331.117 432.322 321.138 388.165C319.808 382.094 322.968 375.94 328.706 373.612C329.454 373.279 330.203 373.03 330.951 372.697C336.772 370.119 343.674 372.198 347.001 377.687C365.13 407.125 384.755 438.725 399.89 462.176C403.383 467.582 408.206 472.072 414.027 474.9C425.42 480.554 444.713 484.297 466.085 462.925C466.085 462.925 484.795 442.468 478.059 419.516C475.648 411.283 470.076 404.381 462.841 399.724C449.619 391.325 415.857 369.787 377.271 345.421C372.115 342.178 369.953 335.608 372.281 329.953C372.531 329.371 372.78 328.789 372.947 328.207C375.192 322.136 381.595 318.727 387.832 320.224C421.595 328.29 458.018 336.772 485.461 342.677C491.781 344.007 498.35 343.758 504.504 341.679C516.562 337.604 532.861 326.627 532.861 296.357C532.778 296.357 531.531 268.582 510.575 257.189Z');
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

            uint256 pxOffset = body.px - 300;
            uint256 pxScaled = pxOffset / scalingFactor;
            uint256 pxDecimals = pxOffset - (pxScaled * scalingFactor);
            string memory pxString = string(
                abi.encodePacked(
                    StringsExtended.toString(pxScaled),
                    '.',
                    StringsExtended.toString(pxDecimals)
                )
            );

            uint256 pyOffset = body.py - 300;
            uint256 pyScaled = pyOffset / scalingFactor;
            uint256 pyDecimals = pyOffset - (pyScaled * scalingFactor);
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
                    'transform-origin: 300px 300px;'
                )
            );

            string memory bodyVectorPath = getHeroBodyLayerPath(date, ThemeLayer.BG);

            path = string(
                abi.encodePacked(
                    path,
                    '<style> @keyframes moveBody',
                    bodyIDString,
                    ' { 0% { ',
                    transformOrigin,
                    'transform: rotate(0deg) translate(0px, 10px); } 100% {',
                    transformOrigin,
                    'transform: rotate(360deg) translate(0px, 10px); } } ',
                    'g#id-',
                    bodyIDString,
                    ' { animation: moveBody',
                    bodyIDString,
                    ' 4s infinite linear; animation-delay: -',
                    StringsExtended.toString(i),
                    's; }</style>',
                    '<g id="id-',
                    bodyIDString,
                    '">',
                    
                    //  transform="translate(',
                    // pxString,
                    // ',',
                    // pyString,
                    // ')">',
                    // '<path d="',
                    // bodyVectorPath,
                    // '" ',
                    // 'fill="',
                    // seedToColor(body.seed),
                    // '" />'
                    getHeroBodyLayerPath(),
                    '</g>'
                )
            );
        }

        return path;
    }

    function getHeroBodyLayerPath(uint256 date) public view returns (string memory) {
        string memory path = '';

        string memory bodyVectorPathBG = getHeroBodyLayerPath(date, ThemeLayer.BG);
        string memory bodyVectorPathBG = getHeroBodyLayerPath(date, ThemeLayer.Core);
        string memory bodyVectorPathBG = getHeroBodyLayerPath(date, ThemeLayer.FG);

        path = string(
            abi.encodePacked(
                '<path d="',
                bodyVectorPath,
                '" />',
                '<path d="',
                bodyVectorPath,
                '" />',
                '<path d="',
                bodyVectorPath,
                '" />',
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

        return [hue, saturation, lightness];
    }

    function getHeroBodyLayerPath(
        uint256 seed,
        ThemeLayer layer
    ) public view returns (string memory) {
        uint256 options = svgSizes[layer];
        uint256 rand = uint256(keccak256(abi.encodePacked(seed)));
        randomRange(0, options - 1, rand);
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
