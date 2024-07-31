import $2MC12$events from "events";
import {utils as $2MC12$utils} from "ethers";
import * as $2MC12$tone from "tone";


function $parcel$interopDefault(a) {
  return a && a.__esModule ? a.default : a;
}

function $parcel$export(e, n, v, s) {
  Object.defineProperty(e, n, {get: v, set: s, enumerable: true, configurable: true});
}


const { Player: $71ffd51f0c004c8c$var$Player, PanVol: $71ffd51f0c004c8c$var$PanVol, Panner: $71ffd51f0c004c8c$var$Panner, Reverb: $71ffd51f0c004c8c$var$Reverb, Compressor: $71ffd51f0c004c8c$var$Compressor, Volume: $71ffd51f0c004c8c$var$Volume, Loop: $71ffd51f0c004c8c$var$Loop, start: $71ffd51f0c004c8c$var$start, loaded: $71ffd51f0c004c8c$var$loaded } = $2MC12$tone;
const $71ffd51f0c004c8c$var$whistle_8_T7 = new URL("whistle_8_T7.6dda6168.mp3", import.meta.url).href;
const $71ffd51f0c004c8c$var$whistle_4_T3 = new URL("whistle_4_T3.daa3ba4f.mp3", import.meta.url).href;
const $71ffd51f0c004c8c$var$whistle_7_T6 = new URL("whistle_7_T6.956fd548.mp3", import.meta.url).href;
const $71ffd51f0c004c8c$var$whistle_12_T11 = new URL("whistle_12_T11.166966b5.mp3", import.meta.url).href;
const $71ffd51f0c004c8c$var$whistle_8_T7_B = new URL("whistle_8_T7_B.8d71c1c3.mp3", import.meta.url).href;
const $71ffd51f0c004c8c$var$wii_2_T1 = new URL("wii_2_T1.6394b1ce.mp3", import.meta.url).href;
const $71ffd51f0c004c8c$var$wii_4_T3 = new URL("wii_4_T3.0377cb2a.mp3", import.meta.url).href;
const $71ffd51f0c004c8c$var$wii_8_T7 = new URL("wii_8_T7.e86f5592.mp3", import.meta.url).href;
const $71ffd51f0c004c8c$var$wii_10_T9 = new URL("wii_10_T9.e5a189b0.mp3", import.meta.url).href;
const $71ffd51f0c004c8c$var$wii_12_T11 = new URL("wii_12_T11.cbca1864.mp3", import.meta.url).href;
const $71ffd51f0c004c8c$var$wii_T5 = new URL("wii_T5.70956d48.mp3", import.meta.url).href;
const $71ffd51f0c004c8c$var$wii_chord = new URL("wii_chord.acbc73b6.mp3", import.meta.url).href;
const $71ffd51f0c004c8c$var$ipod_2_T1 = new URL("ipod_2_T1.cbbf3dd8.mp3", import.meta.url).href;
const $71ffd51f0c004c8c$var$ipod_5_T4 = new URL("ipod_5_T4.d6f398e1.mp3", import.meta.url).href;
const $71ffd51f0c004c8c$var$ipod_7_T6 = new URL("ipod_7_T6.e4e6f4b4.mp3", import.meta.url).href;
const $71ffd51f0c004c8c$var$ipod_8_T7 = new URL("ipod_8_T7.bf410e86.mp3", import.meta.url).href;
const $71ffd51f0c004c8c$var$ipod_14_FX = new URL("ipod_14_FX.f5d7fb6f.mp3", import.meta.url).href;
const $71ffd51f0c004c8c$var$ipod_15_Delay_Reverb = new URL("ipod_15_Delay_Reverb.68f080f3.mp3", import.meta.url).href;
const $71ffd51f0c004c8c$var$ipod_hiss = new URL("ipod_hiss.18219278.mp3", import.meta.url).href;
const $71ffd51f0c004c8c$var$orbit_3_Audio = new URL("orbit_3-Audio.00c60f10.mp3", import.meta.url).href;
const $71ffd51f0c004c8c$var$orbit_8_DT1 = new URL("orbit_8_DT1.102303a3.mp3", import.meta.url).href;
const $71ffd51f0c004c8c$var$orbit_9_DT2 = new URL("orbit_9_DT2.62be7c0c.mp3", import.meta.url).href;
const $71ffd51f0c004c8c$var$orbit_10_DT6 = new URL("orbit_10_DT6.0b4bb121.mp3", import.meta.url).href;
const $71ffd51f0c004c8c$var$coinBox = new URL("coin-box.7ef4330e.mp3", import.meta.url).href;
const $71ffd51f0c004c8c$var$bongoHard = new URL("SC_CP_perc_bongo_loud_tap.cb198476.mp3", import.meta.url).href;
const $71ffd51f0c004c8c$var$bubble = new URL("DSC_GST_one_shot_perc_water.d8e0986b.mp3", import.meta.url).href;
const $71ffd51f0c004c8c$var$coin = new URL("ESM_Game_Notification_83_Coin_Blip_Select_Tap_Button.e205b996.mp3", import.meta.url).href;
// const bottlerocket = new URL(
//   '/public/sound/fx/space/BottleRocket_BW.60057.mp3',
//   import.meta.url
// ).href
// const bottlerocket1 = new URL(
//   '/public/sound/fx/space/BottleRocket_BW.60058.mp3',
//   import.meta.url
// ).href
const $71ffd51f0c004c8c$var$bottlerocket2 = new URL("BottleRocket_S011FI.5.622e4440.mp3", import.meta.url).href;
// const heavy = new URL(
//   '/public/sound/fx/space/ESM_GW_heavy_weapon_one_shot_rocket_launcher_launching_3_rocket_shot_clicky_long_gas_3.mp3',
//   import.meta.url
// ).href
const $71ffd51f0c004c8c$var$bomb = new URL("ESM_Builder_Game_Fireworks_Bomb_Explosion_2_Fire_Bomb_Explosive_War_Battle_Rocket_Mortar_Tank_Cannon.b36a683e.mp3", import.meta.url).href;
const $71ffd51f0c004c8c$var$affirmative = new URL("ESM_Digital_Game_Affirmation_Sound_Sci_fi_Military_Robotic_Robot_Cyber_Futuristic_Transition.47c5e407.mp3", import.meta.url).href;
const $71ffd51f0c004c8c$var$SONGS = {
    whistle: {
        bpm: 70,
        parts: [
            [
                // each part consists of a set of tracks
                // type Track: [sample, probability, introProbability?]
                [
                    $71ffd51f0c004c8c$var$whistle_8_T7,
                    1,
                    0
                ],
                [
                    $71ffd51f0c004c8c$var$whistle_4_T3,
                    0.9,
                    1
                ],
                [
                    $71ffd51f0c004c8c$var$whistle_7_T6,
                    0.7,
                    1
                ],
                [
                    $71ffd51f0c004c8c$var$whistle_12_T11,
                    0.7,
                    0
                ]
            ],
            [
                [
                    $71ffd51f0c004c8c$var$whistle_8_T7_B,
                    1,
                    0
                ],
                [
                    $71ffd51f0c004c8c$var$whistle_4_T3,
                    0.7,
                    1
                ],
                [
                    $71ffd51f0c004c8c$var$whistle_7_T6,
                    0.7,
                    1
                ],
                [
                    $71ffd51f0c004c8c$var$whistle_12_T11,
                    0.7,
                    0
                ]
            ]
        ]
    },
    wii: {
        bpm: 70,
        parts: [
            [
                [
                    $71ffd51f0c004c8c$var$wii_2_T1,
                    1,
                    0
                ],
                [
                    $71ffd51f0c004c8c$var$wii_4_T3,
                    0.9,
                    1
                ],
                [
                    $71ffd51f0c004c8c$var$whistle_7_T6,
                    0.7,
                    0
                ],
                [
                    $71ffd51f0c004c8c$var$wii_12_T11,
                    0.7,
                    1
                ],
                [
                    $71ffd51f0c004c8c$var$wii_10_T9,
                    0.9,
                    1
                ],
                [
                    $71ffd51f0c004c8c$var$wii_T5,
                    0.2,
                    0
                ]
            ],
            [
                [
                    $71ffd51f0c004c8c$var$wii_2_T1,
                    1,
                    1
                ],
                [
                    $71ffd51f0c004c8c$var$wii_4_T3,
                    0.9,
                    1
                ],
                [
                    $71ffd51f0c004c8c$var$wii_8_T7,
                    1,
                    1
                ],
                [
                    $71ffd51f0c004c8c$var$whistle_7_T6,
                    0.7,
                    0
                ],
                [
                    $71ffd51f0c004c8c$var$wii_12_T11,
                    0.8,
                    0
                ],
                [
                    $71ffd51f0c004c8c$var$wii_10_T9,
                    0.7,
                    1
                ],
                [
                    $71ffd51f0c004c8c$var$wii_chord,
                    1,
                    1
                ]
            ]
        ]
    },
    ipod: {
        bpm: 113,
        interval: "4m",
        gameoverSpeed: 0.5,
        parts: [
            [
                [
                    $71ffd51f0c004c8c$var$ipod_2_T1,
                    0.9,
                    0
                ],
                [
                    $71ffd51f0c004c8c$var$ipod_5_T4,
                    0.9,
                    1
                ],
                [
                    $71ffd51f0c004c8c$var$ipod_7_T6,
                    0.7,
                    1
                ],
                [
                    $71ffd51f0c004c8c$var$ipod_8_T7,
                    0.7,
                    0
                ],
                [
                    $71ffd51f0c004c8c$var$ipod_14_FX,
                    0.5,
                    0
                ],
                [
                    $71ffd51f0c004c8c$var$ipod_15_Delay_Reverb,
                    1,
                    0
                ],
                [
                    $71ffd51f0c004c8c$var$ipod_hiss,
                    0.5,
                    0
                ]
            ]
        ]
    },
    orbit: {
        bpm: 96,
        interval: "4m",
        volume: -6,
        parts: [
            [
                [
                    $71ffd51f0c004c8c$var$orbit_3_Audio,
                    1,
                    1
                ],
                [
                    $71ffd51f0c004c8c$var$orbit_8_DT1,
                    0.6,
                    0
                ],
                [
                    $71ffd51f0c004c8c$var$orbit_9_DT2,
                    0.7,
                    0
                ],
                [
                    $71ffd51f0c004c8c$var$orbit_10_DT6,
                    0.7,
                    0
                ]
            ]
        ]
    }
};
const $71ffd51f0c004c8c$var$TRACK_VOLUME = 3 //db
;
const $71ffd51f0c004c8c$var$MAX_VOLUME = 8 //db
;
const $71ffd51f0c004c8c$var$INTRO_LENGTH = 1 // measures
;
const $71ffd51f0c004c8c$var$PAN_RANGE = 1.4 // 2 is hard L/R panning
;
function $71ffd51f0c004c8c$var$random(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}
class $71ffd51f0c004c8c$export$2e2bcd8739ae039 {
    currentMeasure = 0;
    constructor(anybody){
        if (typeof window === "undefined") return;
        this.anybody = anybody;
        window.addEventListener("keydown", this.handleKeyDown);
        this.setSong();
    }
    setSong() {
        const songs = Object.values($71ffd51f0c004c8c$var$SONGS);
        const songIndex = (3 + this.anybody.level) % songs.length;
        this.currentSong = songs[songIndex];
    }
    handleKeyDown = (e)=>{
        if (this.anybody.paused) return;
        if (e.key === "1") {
            this.stop();
            this.play($71ffd51f0c004c8c$var$SONGS.whistle);
        } else if (e.key === "2") {
            this.stop();
            this.play($71ffd51f0c004c8c$var$SONGS.wii);
        } else if (e.key === "3") {
            this.stop();
            this.play($71ffd51f0c004c8c$var$SONGS.ipod);
        } else if (e.key === "4") {
            this.stop();
            this.play($71ffd51f0c004c8c$var$SONGS.orbit);
        }
    };
    // this function must be called in response to a user action
    // otherwise safari and chrome will block the audio
    resume() {
        this.play(this.currentSong);
        this.playOneShot($71ffd51f0c004c8c$var$bongoHard, -20);
    }
    pause() {
        $2MC12$tone.getTransport().stop();
        this.voices?.forEach((voice)=>voice.player.stop());
        this.playOneShot($71ffd51f0c004c8c$var$bongoHard, -22);
    }
    async playMissile() {
        this.missilePanner = this.missilePanner || new $71ffd51f0c004c8c$var$Panner().connect(this.master);
        this.missilePanner.pan.value = -$71ffd51f0c004c8c$var$PAN_RANGE / 2;
        let player;
        if (this.anybody.sfx === "space") player = await this.playOneShot($71ffd51f0c004c8c$var$bottlerocket2, -24, {
            playbackRate: $71ffd51f0c004c8c$var$random([
                1,
                2,
                3
            ])
        });
        else player = await this.playOneShot($71ffd51f0c004c8c$var$bubble, -26, {
            playbackRate: $71ffd51f0c004c8c$var$random([
                1,
                0.9,
                1.3
            ])
        });
        // pan sound left to right
        if (player) {
            player.disconnect();
            player.connect(this.missilePanner);
            this.missilePanner.pan.rampTo($71ffd51f0c004c8c$var$PAN_RANGE / 2, 0.3);
        }
    }
    async playExplosion(x) {
        if (this.anybody.sfx === "space") {
            const player = await this.playOneShot($71ffd51f0c004c8c$var$bomb, -20, {
                playbackRate: $71ffd51f0c004c8c$var$random([
                    1,
                    1.4,
                    0.8
                ])
            });
            if (!player) return;
            const panner = new $71ffd51f0c004c8c$var$Panner().connect(this.master);
            player.disconnect();
            player.connect(panner);
            panner.pan.value = x / this.anybody.windowWidth * 2 - 1;
        } else {
            this.playOneShot($71ffd51f0c004c8c$var$bubble, -36, {
                playbackRate: 2.3
            });
            this.playOneShot($71ffd51f0c004c8c$var$bubble, -36, {
                playbackRate: 4.5
            });
            this.playOneShot($71ffd51f0c004c8c$var$bubble, -16, {
                playbackRate: 0.2
            });
            await new Promise((resolve)=>setTimeout(resolve, 100));
            this.playOneShot($71ffd51f0c004c8c$var$bubble, -26, {
                playbackRate: 1
            });
            this.playOneShot($71ffd51f0c004c8c$var$bubble, -26, {
                playbackRate: 5.5
            });
            await new Promise((resolve)=>setTimeout(resolve, 200));
            this.playOneShot($71ffd51f0c004c8c$var$bubble, -26, {
                playbackRate: 2.3
            });
            this.playOneShot($71ffd51f0c004c8c$var$bubble, -26, {
                playbackRate: 5.5
            });
        }
    }
    async playOneShot(url, volume, opts = false) {
        await $71ffd51f0c004c8c$var$start();
        this.oneShots = this.oneShots || {};
        const key = `${url}-${volume}-${opts && JSON.stringify(opts)}`;
        if (!this.oneShots[key]) this.oneShots[key] = new $71ffd51f0c004c8c$var$Player({
            url: url,
            volume: volume,
            ...opts
        }).toDestination();
        // play if it's been loaded or loads quickly, otherwise load and skip
        const now = Date.now();
        await $71ffd51f0c004c8c$var$loaded();
        if (Date.now() - now < 200) {
            this.oneShots[key].start();
            return this.oneShots[key];
        }
    }
    async playGameOver({ win: win }) {
        if (this.playedGameOver) return;
        this.playedGameOver = true;
        $2MC12$tone.getTransport().stop();
        $2MC12$tone.getTransport().cancel();
        this.voices?.forEach((voice)=>voice.player.stop());
        // speed up the voices
        const playbackRate = this.currentSong?.gameoverSpeed || 2;
        this.voices?.forEach((voice)=>{
            voice.player.playbackRate = playbackRate;
        });
        $2MC12$tone.getTransport().bpm.rampTo($2MC12$tone.getTransport().bpm.value *= playbackRate, 0.5);
        this.loop?.stop();
        this.loop?.cancel();
        this.loop?.start();
        $2MC12$tone.getTransport().start();
        if (this.anybody.sfx === "space") {
            this.playOneShot($71ffd51f0c004c8c$var$affirmative, -22, {
                playbackRate: 1
            });
            this.playOneShot($71ffd51f0c004c8c$var$affirmative, -22, {
                playbackRate: 2
            });
            this.playOneShot($71ffd51f0c004c8c$var$affirmative, -22, {
                playbackRate: 0.5
            });
        } else if (win) {
            this.playOneShot($71ffd51f0c004c8c$var$coin, -20);
            this.playOneShot($71ffd51f0c004c8c$var$coinBox, -26);
        } else {
            // play the bubble sample as a descending melody
            this.playOneShot($71ffd51f0c004c8c$var$ipod_hiss, -20);
            this.playOneShot($71ffd51f0c004c8c$var$bubble, -26, {
                playbackRate: 4
            });
            await new Promise((resolve)=>setTimeout(resolve, 200));
            this.playOneShot($71ffd51f0c004c8c$var$bubble, -26, {
                playbackRate: 1
            });
            await new Promise((resolve)=>setTimeout(resolve, 200));
            this.playOneShot($71ffd51f0c004c8c$var$bubble, -26, {
                playbackRate: 0.8
            });
            await new Promise((resolve)=>setTimeout(resolve, 200));
            this.playOneShot($71ffd51f0c004c8c$var$bubble, -26, {
                playbackRate: 0.6
            });
            await new Promise((resolve)=>setTimeout(resolve, 1000));
        }
    }
    async playStart() {
        if (this.anybody.sfx === "space") {
            this.playOneShot($71ffd51f0c004c8c$var$affirmative, -22, {
                playbackRate: 1
            });
            this.playOneShot($71ffd51f0c004c8c$var$affirmative, -22, {
                playbackRate: 2
            });
            this.playOneShot($71ffd51f0c004c8c$var$affirmative, -22, {
                playbackRate: 0.5
            });
        } else this.playOneShot($71ffd51f0c004c8c$var$coin, -20);
    }
    async playStat() {
        if (this.anybody.sfx === "space") this.playOneShot($71ffd51f0c004c8c$var$bottlerocket2, -24, {
            playbackRate: $71ffd51f0c004c8c$var$random([
                5,
                10,
                7
            ])
        });
        else this.playOneShot($71ffd51f0c004c8c$var$bubble, -26, {
            playbackRate: $71ffd51f0c004c8c$var$random([
                3,
                5,
                10.5
            ])
        });
    }
    async playSuccess() {
        if (this.anybody.sfx === "space") this.playOneShot($71ffd51f0c004c8c$var$affirmative, -22, {
            playbackRate: 1
        });
        else this.playOneShot($71ffd51f0c004c8c$var$coinBox, -28);
    }
    voiceFromFile(file) {
        const voice = {
            file: file,
            player: new $71ffd51f0c004c8c$var$Player({
                url: `${file}`,
                fadeOut: 0.1
            }),
            panVol: new $71ffd51f0c004c8c$var$PanVol()
        };
        voice.panVol.volume.value = -Infinity;
        return voice;
    }
    stop() {
        $2MC12$tone.getTransport().cancel();
        $2MC12$tone.getTransport().stop();
        this.loop?.dispose();
        this.voices?.forEach((voice)=>{
            voice.player.stop();
            voice.player.dispose();
            voice.panVol.dispose();
        });
        this.voices = null;
        this.currentMeasure = 0;
        this.playedGameOver = false;
    }
    async play(song) {
        // only start if it hasn't started yet
        // if (Tone.getTransport().state === 'started') return
        await $71ffd51f0c004c8c$var$start();
        this.playingGameOver = false;
        // if song is different from last one, dispose of old voices
        if (this.currentSong && this.currentSong !== song) this.stop();
        this.currentSong = song;
        if (!this.voices) {
            const parts = song.parts[0];
            this.voices = parts.map((part)=>this.voiceFromFile(part[0]));
            // master output
            this.reverb ||= new $71ffd51f0c004c8c$var$Reverb(0.5);
            this.reverb.wet.value = 0.15;
            this.compressor ||= new $71ffd51f0c004c8c$var$Compressor();
            this.compressor.threshold.value = -24;
            this.compressor.ratio.value = 2;
            this.compressor.attack.value = 1;
            this.compressor.release.value = 0.1;
            this.masterVolume?.dispose();
            this.masterVolume = new $71ffd51f0c004c8c$var$Volume(song.volume || 0).toDestination();
            this.masterVolume.volume.rampTo(song.volume || $71ffd51f0c004c8c$var$MAX_VOLUME, 3);
            this.master = this.reverb.connect(this.compressor).connect(this.masterVolume);
            $2MC12$tone.getTransport().bpm.value = song.bpm;
            await $71ffd51f0c004c8c$var$loaded();
            this.loop = new $71ffd51f0c004c8c$var$Loop((time)=>{
                this.currentMeasure++;
                this.voices.forEach((voice, i)=>{
                    // just step through parts
                    const part = song.parts[this.currentMeasure % song.parts.length][i];
                    const url = part[0];
                    if (url) voice.player.load(url);
                    else voice.player.stop();
                    voice.player.chain(voice.panVol);
                    voice.panVol.connect(this.master);
                    // randomly mute some voices, but keep most on
                    const probability = this.currentMeasure <= $71ffd51f0c004c8c$var$INTRO_LENGTH && typeof part[2] === "number" ? part[2] : part[1];
                    if (Math.random() > probability) voice.panVol.volume.linearRampTo(-Infinity, 0.1, time);
                    else voice.panVol.volume.linearRampTo($71ffd51f0c004c8c$var$TRACK_VOLUME, 0.1, time);
                    voice.player.start(time);
                });
            }, song.interval || "2m").start();
        }
        // PLAY
        $2MC12$tone.getTransport().start();
    }
}


const $d60e3aa22c788113$var$iris_50 = "rgba(121, 88, 255, 1)";
const $d60e3aa22c788113$var$iris_100 = "rgba(25, 15, 66, 1)";
const $d60e3aa22c788113$var$iris_60 = "rgba(88, 59, 209, 1)";
const $d60e3aa22c788113$var$iris_30 = "rgba(163, 140, 222, 1)";
const $d60e3aa22c788113$var$teal_50 = "rgba(137, 255, 248, 1)";
const $d60e3aa22c788113$var$teal_75 = "rgba(13, 61, 58, 1)";
const $d60e3aa22c788113$var$flame_50 = "rgba(255, 88, 88, 1)";
const $d60e3aa22c788113$var$flame_75 = "rgba(70, 12, 12, 1)";
const $d60e3aa22c788113$var$pink_50 = "rgba(255, 105, 177, 1)";
const $d60e3aa22c788113$var$pink_75 = "rgba(59, 29, 43, 1)";
const $d60e3aa22c788113$var$green_50 = "rgba(125, 241, 115, 1)";
const $d60e3aa22c788113$var$green_75 = "rgba(4, 53, 0, 1)";
const $d60e3aa22c788113$var$yellow_50 = "rgba(252, 255, 105, 1)";
const $d60e3aa22c788113$var$yellow_75 = "rgba(58, 59, 29, 1)";
const $d60e3aa22c788113$var$violet_25 = "rgba(236, 205, 255, 1)";
const $d60e3aa22c788113$var$violet_50 = "rgba(160, 67, 232, 1)";
const $d60e3aa22c788113$export$5714e40777c1bcc2 = {
    bg: "rgb(20,20,20)",
    fg: "white",
    bodiesTheme: "default",
    border: $d60e3aa22c788113$var$iris_60,
    // colors
    lime: "rgba(125, 241, 115, 1)",
    lime_40: "rgba(125, 241, 115, 0.4)",
    pink: "rgba(236, 205, 255, 1)",
    pink_40: "rgba(219, 115, 255, 1)",
    fuschia: "rgba(160, 67, 232, 1)",
    red: "rgba(255, 88, 88, 1)",
    maroon: "rgba(53, 20, 20, 1)",
    textFg: $d60e3aa22c788113$var$iris_50,
    textBg: $d60e3aa22c788113$var$iris_100,
    iris_30: $d60e3aa22c788113$var$iris_30,
    iris_60: $d60e3aa22c788113$var$iris_60,
    teal_50: $d60e3aa22c788113$var$teal_50,
    teal_75: $d60e3aa22c788113$var$teal_75,
    flame_50: $d60e3aa22c788113$var$flame_50,
    flame_75: $d60e3aa22c788113$var$flame_75,
    pink_50: $d60e3aa22c788113$var$pink_50,
    pink_75: $d60e3aa22c788113$var$pink_75,
    green_50: $d60e3aa22c788113$var$green_50,
    green_75: $d60e3aa22c788113$var$green_75,
    yellow_50: $d60e3aa22c788113$var$yellow_50,
    violet_25: $d60e3aa22c788113$var$violet_25,
    violet_50: $d60e3aa22c788113$var$violet_50
};
const $d60e3aa22c788113$export$d9a33280f07116d9 = {
    bodies: {
        // random hues
        default: {
            "saturated-exclude-darks": {
                bg: [
                    undefined,
                    "80-100",
                    "18-100"
                ],
                cr: [
                    undefined,
                    "80-100",
                    "18-100"
                ],
                fg: [
                    undefined,
                    "80-100",
                    "18-100"
                ]
            },
            pastel_highlighter_marker: {
                bg: [
                    undefined,
                    "80-100",
                    "85-95"
                ],
                cr: [
                    undefined,
                    "100-100",
                    "55-60"
                ],
                fg: [
                    undefined,
                    "70-90",
                    "67-67"
                ]
            },
            marker_pastel_highlighter: {
                bg: [
                    undefined,
                    "100-100",
                    "60-60"
                ],
                cr: [
                    undefined,
                    "100-100",
                    "90-95"
                ],
                fg: [
                    undefined,
                    "100-100",
                    "55-60"
                ]
            },
            shadow_highlighter_marker: {
                bg: [
                    undefined,
                    "80-100",
                    "18-25"
                ],
                cr: [
                    undefined,
                    "100-100",
                    "55-60"
                ],
                fg: [
                    undefined,
                    "70-90",
                    "67-67"
                ]
            },
            berlin: {
                bg: [
                    undefined,
                    "100-100",
                    "18-18"
                ],
                cr: [
                    undefined,
                    "100-100",
                    "45-45"
                ],
                fg: [
                    undefined,
                    "100-100",
                    "30-30"
                ]
            }
        },
        // reds / OPTIMISM
        reds: {
            "bg:red-wide": {
                bg: [
                    "300-20",
                    "90",
                    "50"
                ],
                cr: [
                    undefined,
                    "80",
                    "90"
                ],
                fg: [
                    undefined,
                    "80",
                    "60"
                ]
            }
        },
        // yellows / BLAST
        yellows: {
            "bg:yellow-narrow": {
                bg: [
                    "40-60",
                    "95-100",
                    "50-60"
                ],
                cr: [
                    undefined,
                    "90-100",
                    "85-95"
                ],
                fg: [
                    undefined,
                    "90",
                    "60"
                ]
            }
        }
    },
    buttons: {
        teal: {
            fg: $d60e3aa22c788113$var$teal_50,
            bg: $d60e3aa22c788113$var$teal_75
        },
        flame: {
            fg: $d60e3aa22c788113$var$flame_50,
            bg: $d60e3aa22c788113$var$flame_75
        },
        pink: {
            fg: $d60e3aa22c788113$var$pink_50,
            bg: $d60e3aa22c788113$var$pink_75
        },
        green: {
            fg: $d60e3aa22c788113$var$green_50,
            bg: $d60e3aa22c788113$var$green_75
        },
        yellow: {
            fg: $d60e3aa22c788113$var$yellow_50,
            bg: $d60e3aa22c788113$var$yellow_75
        }
    }
};
const $d60e3aa22c788113$export$5ff5d5398b3247da = $d60e3aa22c788113$export$d9a33280f07116d9.bodies[$d60e3aa22c788113$export$5714e40777c1bcc2.bodiesTheme];
function $d60e3aa22c788113$export$29fb7152bd3f781a(values, alpha = 1) {
    let [h, s, l] = values;
    s /= 100;
    l /= 100;
    let c = (1 - Math.abs(2 * l - 1)) * s;
    let x = c * (1 - Math.abs(h / 60 % 2 - 1));
    let m = l - c / 2;
    let r = 0, g = 0, b = 0;
    if (0 <= h && h < 60) {
        r = c;
        g = x;
        b = 0;
    } else if (60 <= h && h < 120) {
        r = x;
        g = c;
        b = 0;
    } else if (120 <= h && h < 180) {
        r = 0;
        g = c;
        b = x;
    } else if (180 <= h && h < 240) {
        r = 0;
        g = x;
        b = c;
    } else if (240 <= h && h < 300) {
        r = x;
        g = 0;
        b = c;
    } else if (300 <= h && h < 360) {
        r = c;
        g = 0;
        b = x;
    }
    r = Math.round((r + m) * 255);
    g = Math.round((g + m) * 255);
    b = Math.round((b + m) * 255);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
function $d60e3aa22c788113$var$randInt(min, max) {
    // min and max included
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
function $d60e3aa22c788113$export$159f6df82777d1d0(ranges) {
    let hues = ranges[0] ?? "0-359";
    let sats = ranges[1] ?? "0-100";
    let lights = ranges[2] ?? "0-100";
    // NOTE: hue:360 = black
    hues = hues.split("-").map((s)=>Number(s));
    sats = sats.split("-").map((s)=>Number(s));
    lights = lights.split("-").map((s)=>Number(s));
    // if hue range loops (350-10), randomly select a position from the two sections (0-10, 350-359)
    if (hues[0] > hues[1]) {
        hues = [
            $d60e3aa22c788113$var$randInt(0, hues[1]),
            $d60e3aa22c788113$var$randInt(hues[0], "359")
        ][$d60e3aa22c788113$var$randInt(0, 1)];
        hues = [
            hues
        ];
    }
    // generate in ranges
    const h = $d60e3aa22c788113$var$randInt(hues[0], hues[1] || hues[0]);
    const s = $d60e3aa22c788113$var$randInt(sats[0], sats[1] || sats[0]);
    const l = $d60e3aa22c788113$var$randInt(lights[0], lights[1] || lights[0]);
    return `hsl(${h},${s}%,${l}%)`;
}
function $d60e3aa22c788113$export$c08c384652f6dae3(color, opacity) {
    const [r, g, b] = color.split(",").map((s)=>Number(s.replace(/\D/g, "")));
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}


const $7bebc3cf49080e6e$var$bodyFontURL = new URL("Space-Notorious-rounded.f75db838.otf", import.meta.url).href;
// n.b. to make this font load, I had to remove the leading numbers from the filename
const $7bebc3cf49080e6e$var$dotFontURL = new URL("A000-Dots-edited-subsetAlphaNumPuncSimple.34d1b399.ttf", import.meta.url).href;
const $7bebc3cf49080e6e$export$f45fbea8fe20ca8a = {
    body: null,
    dot: null
};
function $7bebc3cf49080e6e$export$90b262450ff54847(p) {
    const toLoad = {
        body: $7bebc3cf49080e6e$var$bodyFontURL,
        dot: $7bebc3cf49080e6e$var$dotFontURL
    };
    for(const fontName in toLoad){
        if ($7bebc3cf49080e6e$export$f45fbea8fe20ca8a[fontName]) continue;
        const url = toLoad[fontName];
        const handleError = (err)=>{
            console.log("font load error", err);
            // fall back to sans
            $7bebc3cf49080e6e$export$f45fbea8fe20ca8a[fontName] = "sans-serif";
        };
        p.loadFont(url, (font)=>{
            $7bebc3cf49080e6e$export$f45fbea8fe20ca8a[fontName] = font;
        }, handleError);
    }
}
function $7bebc3cf49080e6e$export$da5f36cd073f8491(p, text, x, y, kerning) {
    let start = x;
    for (const char of text.split("")){
        p.text(char, start, y);
        start += p.textWidth(char) + kerning;
    }
}


var $24fac91916510773$exports = {};
$24fac91916510773$exports = "<svg width=\"600\" height=\"600\" viewBox=\"0 0 600 600\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<path d=\"M510.575 257.189C503.007 253.114 494.192 252.116 485.876 253.946C470.492 257.355 430.742 266.17 385.836 276.316C379.849 277.646 373.778 274.569 371.366 268.915C371.283 268.665 371.2 268.416 371.034 268.249C368.373 262.428 370.618 255.526 376.107 252.116C406.127 233.655 438.642 213.531 462.592 198.063C467.997 194.57 472.488 189.747 475.315 183.926C480.97 172.533 484.712 153.24 463.34 131.869C463.34 131.869 442.883 113.158 419.931 119.894C411.699 122.305 404.796 127.877 400.139 135.112C391.574 148.5 369.454 183.261 344.589 222.595C341.263 227.834 334.61 229.913 328.872 227.501C328.789 227.501 328.706 227.418 328.706 227.418C322.802 225.007 319.475 218.77 320.889 212.533C329.122 178.105 337.937 140.434 344.007 112.409C345.338 106.089 345.088 99.5196 343.009 93.3659C338.934 81.391 327.874 65.0918 297.688 65.0918C297.688 65.0918 269.912 66.3392 258.52 87.2953C254.445 94.8627 253.447 103.678 255.276 111.993C258.686 127.461 267.584 167.377 277.729 212.616C279.143 218.77 275.817 224.923 269.996 227.252C269.497 227.418 268.998 227.668 268.499 227.834C262.678 230.329 255.942 228.167 252.615 222.761C234.154 192.741 213.946 160.143 198.479 136.193C194.986 130.787 190.163 126.297 184.342 123.469C172.949 117.815 153.656 114.072 132.284 135.444C132.284 135.444 113.573 155.901 120.309 178.853C122.721 187.086 128.293 193.988 135.527 198.645C148.833 207.127 183.011 228.915 221.847 253.447C227.169 256.857 229.165 263.592 226.67 269.414C226.587 269.58 226.503 269.829 226.42 269.996C224.009 275.817 217.772 279.06 211.701 277.563C177.606 269.414 140.6 260.765 112.908 254.778C106.588 253.447 100.019 253.696 93.8648 255.775C81.8067 259.85 65.5076 270.827 65.5076 301.097C65.5076 301.097 66.755 328.872 87.711 340.265C95.2785 344.34 104.093 345.338 112.409 343.508C127.627 340.099 166.629 331.45 211.036 321.471C217.19 320.057 223.427 323.467 225.755 329.371C225.838 329.704 226.004 329.953 226.088 330.286C228.499 336.107 226.337 342.76 221.015 346.086C191.41 364.215 159.394 384.09 135.777 399.391C130.372 402.884 125.881 407.707 123.054 413.528C117.399 424.921 113.657 444.214 135.029 465.586C135.029 465.586 155.486 484.297 178.438 477.561C186.67 475.149 193.572 469.577 198.229 462.343C206.545 449.287 227.834 415.857 251.95 377.687C255.276 372.364 262.096 370.285 267.833 372.78C268.332 373.03 268.831 373.196 269.33 373.362C275.151 375.774 278.395 382.011 276.898 388.165C268.831 421.927 260.266 458.434 254.362 485.793C253.031 492.113 253.281 498.683 255.36 504.837C259.434 516.895 270.411 533.194 300.681 533.194C300.681 533.194 328.456 531.947 339.849 510.991C343.924 503.423 344.922 494.608 343.092 486.292C339.766 471.074 331.117 432.322 321.138 388.165C319.808 382.094 322.968 375.94 328.706 373.612C329.454 373.279 330.203 373.03 330.951 372.697C336.772 370.119 343.674 372.198 347.001 377.687C365.13 407.125 384.755 438.725 399.89 462.176C403.383 467.582 408.206 472.072 414.027 474.9C425.42 480.554 444.713 484.297 466.085 462.925C466.085 462.925 484.795 442.468 478.059 419.516C475.648 411.283 470.076 404.381 462.841 399.724C449.619 391.325 415.857 369.787 377.271 345.421C372.115 342.178 369.953 335.608 372.281 329.953C372.531 329.371 372.78 328.789 372.947 328.207C375.192 322.136 381.595 318.727 387.832 320.224C421.595 328.29 458.018 336.772 485.461 342.677C491.781 344.007 498.35 343.758 504.504 341.679C516.562 337.604 532.861 326.627 532.861 296.357C532.778 296.357 531.531 268.582 510.575 257.189Z\" fill=\"#D9D9D9\" stroke=\"black\" stroke-width=\"0.75\" stroke-miterlimit=\"10\"></path>\n</svg>\n";


var $606fb671979169db$exports = {};
$606fb671979169db$exports = "<svg width=\"600\" height=\"600\" viewBox=\"0 0 600 600\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<path d=\"M525.793 298.935H454.276C452.031 298.935 450.95 296.191 452.613 294.611C453.195 294.029 453.86 293.53 454.442 292.948C454.442 292.948 532.612 226.503 462.758 138.854C461.844 137.69 460.097 137.606 459.099 138.688L409.038 188.749C407.458 190.329 404.713 189.165 404.88 186.92C404.88 186.338 404.963 185.756 404.963 185.173C404.963 185.173 413.279 82.971 301.929 70.3308C300.515 70.1645 299.184 71.3287 299.184 72.7424V142.929C299.184 145.174 296.44 146.255 294.943 144.592C294.444 144.01 293.945 143.511 293.447 142.929C293.447 142.929 227.002 64.7592 139.353 134.613C138.189 135.527 138.105 137.274 139.186 138.272L189.914 188.999C191.494 190.579 190.329 193.323 188.084 193.157C187.086 193.074 186.088 193.074 185.173 193.074C185.173 193.074 82.971 184.758 70.3308 296.108C70.1645 297.521 71.3287 298.852 72.7424 298.852H142.929C145.174 298.852 146.172 301.596 144.592 303.093C144.592 303.093 144.592 303.093 144.509 303.176C144.509 303.176 66.3392 369.62 136.193 457.27C137.108 458.434 138.854 458.517 139.852 457.436L189.914 407.374C191.494 405.794 194.238 406.959 194.071 409.204C193.988 410.368 193.988 411.449 193.905 412.613C193.905 412.613 185.589 514.816 296.939 527.456C298.353 527.622 299.683 526.458 299.683 525.044V454.027C299.683 451.781 302.428 450.7 303.925 452.363C304.424 452.946 305.006 453.528 305.505 454.11C305.505 454.11 371.949 532.279 459.598 462.426C460.762 461.511 460.846 459.765 459.765 458.767L409.869 408.871C408.289 407.291 409.453 404.547 411.699 404.713C412.281 404.713 412.863 404.796 413.445 404.796C413.445 404.796 515.647 413.112 528.288 301.762C528.454 300.266 527.29 298.935 525.793 298.935Z\" fill=\"#D9D9D9\" stroke=\"black\" stroke-width=\"0.75\" stroke-miterlimit=\"10\"></path>\n</svg>\n";


var $c79ba3aa7a32c09e$exports = {};
$c79ba3aa7a32c09e$exports = "<svg width=\"600\" height=\"600\" viewBox=\"0 0 600 600\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<path d=\"M429.661 319.142V279.226H470.741L501.261 182.429L402.218 160.558L381.678 196.067L347.167 176.109L367.707 140.6L299.184 65.7568L230.661 140.6L251.202 176.109L216.607 196.067L196.067 160.558L97.0248 182.429L127.544 279.226H168.625V319.142H127.544L97.0248 415.856L196.067 437.81L216.607 402.218L251.202 422.176L230.661 457.769L299.184 532.528L367.707 457.769L347.167 422.176L381.678 402.218L402.218 437.81L501.261 415.856L470.741 319.142H429.661Z\" fill=\"#D9D9D9\" stroke=\"black\" stroke-width=\"0.75\" stroke-miterlimit=\"10\"></path>\n</svg>\n";


var $4a3db75e624ce7f0$exports = {};
$4a3db75e624ce7f0$exports = "<svg width=\"600\" height=\"600\" viewBox=\"0 0 600 600\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<path d=\"M482.006 363.921L451.575 300.331L482.171 236.41C485.562 238.89 489.779 240.379 494.327 240.379C505.738 240.379 515 231.117 515 219.706C515 208.294 505.738 199.033 494.327 199.033C483.825 199.033 475.225 206.806 473.819 216.894L407.252 193.41L383.519 126.263C387.819 125.685 391.954 123.7 395.179 120.392C403.283 112.288 403.283 99.2231 395.179 91.1192C387.075 83.0154 374.01 83.0154 365.906 91.1192C358.463 98.5615 357.885 110.387 364.252 118.49L300.248 149.087L236.079 118.408C238.808 114.852 240.462 110.469 240.462 105.673C240.462 94.2615 231.2 85 219.788 85C208.377 85 199.115 94.2615 199.115 105.673C199.115 116.258 207.054 124.94 217.308 126.181L193.575 193.492L126.512 217.142C126.015 212.594 124.031 208.129 120.558 204.656C112.454 196.552 99.3885 196.552 91.2846 204.656C83.1808 212.76 83.1808 225.825 91.2846 233.929C98.6442 241.288 110.221 241.95 118.325 235.831L149.252 300.413L118.738 364.169C115.183 361.275 110.635 359.538 105.673 359.538C94.2615 359.538 85 368.8 85 380.212C85 391.623 94.2615 400.885 105.673 400.885C115.927 400.885 124.527 393.36 126.098 383.519L193.575 407.335L216.977 473.654C212.512 474.15 208.212 476.135 204.738 479.525C196.635 487.629 196.635 500.694 204.738 508.798C212.842 516.902 225.908 516.902 234.012 508.798C241.206 501.604 241.95 490.44 236.327 482.337L300.496 451.658L363.756 481.923C361.11 485.396 359.621 489.696 359.621 494.41C359.621 505.821 368.883 515.083 380.294 515.083C391.706 515.083 400.967 505.821 400.967 494.41C400.967 484.238 393.608 475.721 383.85 474.067L407.335 407.417L473.737 384.015C474.398 388.233 476.3 392.202 479.525 395.427C487.629 403.531 500.694 403.531 508.798 395.427C516.902 387.323 516.902 374.258 508.798 366.154C501.521 358.712 490.11 358.05 482.006 363.921Z\" fill=\"#D9D9D9\" stroke=\"#231F20\" stroke-miterlimit=\"10\"></path>\n</svg>\n";


var $983c31a1bd7b5434$exports = {};
$983c31a1bd7b5434$exports = "<svg width=\"600\" height=\"600\" viewBox=\"0 0 600 600\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<path d=\"M488.787 242.969C485.71 240.64 484.463 236.649 485.627 232.907C508.163 160.808 455.773 149.332 455.773 149.332C424.588 141.348 402.138 160.724 389.249 175.194C399.561 158.895 412.034 129.872 395.236 101.848C395.236 101.848 369.207 54.863 306.589 96.9415C303.346 99.1036 299.188 99.0205 296.111 96.7752C281.142 85.7982 236.319 59.1873 204.968 106.089C204.968 106.089 184.927 137.773 208.627 174.529C195.571 160.142 170.454 141.515 139.769 149.415C139.769 149.415 87.3784 160.974 109.914 232.99C111.079 236.649 109.831 240.64 106.754 243.052C91.7858 254.195 53.4495 289.621 89.5405 332.947C89.5405 332.947 108.833 354.901 142.18 351.658C125.964 360.556 108.251 376.106 106.006 402.218C106.006 402.218 99.6028 455.523 175.111 458.018C178.936 458.184 182.346 460.679 183.51 464.338C189.248 481.968 210.038 529.867 262.844 510.076C262.844 510.076 291.534 498.516 298.436 463.673C305.421 498.516 334.028 510.076 334.028 510.076C386.834 529.867 407.624 482.051 413.362 464.338C414.526 460.679 417.936 458.184 421.761 458.018C497.186 455.523 490.866 402.218 490.866 402.218C488.704 376.273 471.157 360.722 455.024 351.824C487.207 354.069 505.668 332.947 505.668 332.947C541.842 289.621 503.506 254.195 488.787 242.969Z\" fill=\"#D9D9D9\" stroke=\"black\" stroke-width=\"0.75\" stroke-miterlimit=\"10\"></path>\n</svg>\n";


var $5da37ce79facd1a0$exports = {};
$5da37ce79facd1a0$exports = "<svg width=\"600\" height=\"600\" viewBox=\"0 0 600 600\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<path d=\"M525.793 299.517L438.476 219.019L412.78 103.095L299.434 138.438L186.171 102.763L160.143 218.603L72.576 298.852L159.893 379.35L185.589 495.273L298.935 459.931L412.198 495.606L438.226 379.765L525.793 299.517Z\" fill=\"#D9D9D9\" stroke=\"black\" stroke-width=\"0.75\" stroke-miterlimit=\"10\"></path>\n</svg>\n";


var $093551ee879ffa74$exports = {};
$093551ee879ffa74$exports = "<svg width=\"600\" height=\"600\" viewBox=\"0 0 600 600\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<path d=\"M532.446 299.184C532.446 278.228 486.542 259.933 418.102 249.871C459.432 194.404 478.891 148.999 464.089 134.197C449.286 119.395 403.882 138.854 348.415 180.184C338.436 111.744 320.141 65.9233 299.184 65.9233C278.228 65.9233 259.933 111.827 249.871 180.267C194.404 138.854 148.999 119.395 134.197 134.197C119.395 148.999 138.854 194.404 180.184 249.871C111.744 259.85 65.9233 278.228 65.9233 299.184C65.9233 320.141 111.827 338.435 180.267 348.498C138.854 403.882 119.395 449.286 134.197 464.089C148.999 478.891 194.404 459.432 249.871 418.102C259.85 486.542 278.145 532.446 299.184 532.446C320.224 532.446 338.435 486.542 348.498 418.102C403.965 459.432 449.37 478.891 464.172 464.089C478.974 449.286 459.515 403.882 418.185 348.415C486.542 338.436 532.446 320.141 532.446 299.184Z\" fill=\"#D9D9D9\" stroke=\"black\" stroke-width=\"0.75\" stroke-miterlimit=\"10\"></path>\n</svg>\n";


var $a9e239461e86411f$exports = {};
$a9e239461e86411f$exports = "<svg width=\"600\" height=\"600\" viewBox=\"0 0 600 600\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<path d=\"M299.184 70.4971L333.945 124.135L386.668 87.8773L398.31 150.829L460.846 137.44L447.54 200.059L510.408 211.618L474.151 264.341L527.872 299.184L474.151 333.945L510.408 386.668L447.54 398.31L460.846 460.846L398.31 447.54L386.668 510.408L333.945 474.151L299.184 527.872L264.341 474.151L211.618 510.408L200.059 447.54L137.44 460.846L150.829 398.31L87.8773 386.668L124.135 333.945L70.4971 299.184L124.135 264.341L87.8773 211.618L150.829 200.059L137.44 137.44L200.059 150.829L211.618 87.8773L264.341 124.135L299.184 70.4971Z\" fill=\"#D9D9D9\" stroke=\"black\" stroke-width=\"0.75\" stroke-miterlimit=\"10\"></path>\n</svg>\n";


var $83828c5f4a5cba60$exports = {};
$83828c5f4a5cba60$exports = "<svg width=\"600\" height=\"600\" viewBox=\"0 0 600 600\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<path d=\"M302.261 70.6635L305.588 91.7858C312.573 136.359 369.038 151.494 397.395 116.401L410.784 99.7691C413.029 97.0249 417.353 99.5196 416.106 102.846L408.455 122.721C392.239 164.799 433.57 206.13 475.648 189.914L495.523 182.263C498.849 181.015 501.344 185.34 498.6 187.585L481.968 200.974C446.875 229.248 462.01 285.796 506.583 292.781L527.706 296.108C531.198 296.69 531.198 301.679 527.706 302.261L506.583 305.588C462.01 312.573 446.875 369.038 481.968 397.395L498.6 410.784C501.344 413.029 498.849 417.353 495.523 416.106L475.648 408.455C433.57 392.239 392.239 433.57 408.455 475.648L416.106 495.523C417.353 498.849 413.029 501.344 410.784 498.6L397.395 481.968C369.121 446.875 312.573 462.01 305.588 506.583L302.261 527.706C301.679 531.198 296.69 531.198 296.108 527.706L292.781 506.583C285.796 462.01 229.331 446.875 200.974 481.968L187.585 498.6C185.34 501.344 181.015 498.849 182.263 495.523L189.914 475.648C206.13 433.57 164.799 392.239 122.721 408.455L102.846 416.106C99.5196 417.353 97.0249 413.029 99.7691 410.784L116.401 397.395C151.494 369.121 136.359 312.573 91.7858 305.588L70.6635 302.261C67.1708 301.679 67.1708 296.69 70.6635 296.108L91.7858 292.781C136.359 285.796 151.494 229.331 116.401 200.974L99.7691 187.585C97.0249 185.34 99.5196 181.015 102.846 182.263L122.721 189.914C164.799 206.13 206.13 164.799 189.914 122.721L182.263 102.846C181.015 99.5196 185.34 97.0249 187.585 99.7691L200.974 116.401C229.248 151.494 285.796 136.359 292.781 91.7858L296.108 70.6635C296.607 67.1708 301.679 67.1708 302.261 70.6635Z\" fill=\"#D9D9D9\" stroke=\"black\" stroke-width=\"0.75\" stroke-miterlimit=\"10\"></path>\n</svg>\n";


var $d0ca0a5da62347cc$exports = {};
$d0ca0a5da62347cc$exports = "<svg width=\"600\" height=\"600\" viewBox=\"0 0 600 600\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<path d=\"M319.641 87.2122L332.365 103.844C345.171 120.559 366.959 127.711 387.167 121.64L407.291 115.653C423.59 110.829 440.056 122.721 440.472 139.769L440.97 160.725C441.469 181.764 454.941 200.309 474.816 207.377L494.608 214.362C510.658 220.017 516.895 239.393 507.248 253.364L495.357 270.578C483.382 287.958 483.382 310.827 495.357 328.207L507.248 345.421C516.895 359.392 510.575 378.768 494.608 384.423L474.816 391.408C454.941 398.393 441.469 416.938 440.97 438.06L440.472 459.016C440.056 475.981 423.59 487.956 407.291 483.132L387.167 477.145C366.959 471.157 345.171 478.226 332.365 494.941L319.641 511.573C309.33 525.045 288.956 525.045 278.644 511.573L265.921 494.941C253.114 478.226 231.327 471.074 211.119 477.145L190.994 483.132C174.695 487.956 158.23 476.064 157.814 459.016L157.315 438.06C156.816 417.021 143.344 398.476 123.469 391.408L103.677 384.423C87.6277 378.768 81.3908 359.392 91.0372 345.421L102.929 328.207C114.904 310.827 114.904 287.958 102.929 270.578L91.0372 253.364C81.3908 239.393 87.7109 220.017 103.677 214.362L123.469 207.377C143.344 200.392 156.816 181.847 157.315 160.725L157.814 139.769C158.23 122.804 174.695 110.829 190.994 115.653L211.119 121.64C231.327 127.628 253.114 120.559 265.921 103.844L278.644 87.2122C288.956 73.7405 309.33 73.7405 319.641 87.2122Z\" fill=\"#D9D9D9\" stroke=\"black\" stroke-width=\"0.75\" stroke-miterlimit=\"10\"></path>\n</svg>\n";


var $3552c8b8474f03c7$exports = {};
$3552c8b8474f03c7$exports = "<svg width=\"600\" height=\"600\" viewBox=\"0 0 600 600\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<path d=\"M298.8 168.6C299 169.7 300.6 169.7 300.8 168.5C303.3 146.3 308.7 72.5999 277 36.5999C277 36.5999 264.9 21.6999 249 28.3999C249 28.3999 221.1 34.2999 208.8 106.6C208.5 108.2 210.7 108.9 211.5 107.5C218.3 94.1999 232.6 70.8999 250.1 71.2999C250.1 71.3999 280.2 69.8999 298.8 168.6Z\" fill=\"#D9D9D9\"></path>\n<path d=\"M206.3 207.9C207.2 208.5 208.4 207.4 207.6 206.5C193.7 189.1 145.4 133.1 97.4999 130.1C97.4999 130.1 78.3999 128.1 71.8999 144.1C71.8999 144.1 56.2999 168 98.7999 227.8C99.6999 229.1 101.8 228.1 101.3 226.5C96.6999 212.3 90.3999 185.7 103 173.6C103.1 173.7 123.3 151.3 206.3 207.9Z\" fill=\"#D9D9D9\"></path>\n<path d=\"M168.6 301.2C169.7 301 169.7 299.4 168.5 299.2C146.3 296.7 72.5999 291.3 36.5999 323C36.5999 323 21.6999 335.1 28.3999 351C28.3999 351 34.2999 378.9 106.6 391.2C108.2 391.5 108.9 389.3 107.5 388.5C94.1999 381.7 70.8999 367.4 71.2999 349.9C71.3999 349.9 69.8999 319.8 168.6 301.2Z\" fill=\"#D9D9D9\"></path>\n<path d=\"M207.9 393.7C208.5 392.8 207.4 391.6 206.5 392.4C189.1 406.3 133.1 454.6 130.1 502.5C130.1 502.5 128.1 521.6 144.1 528.1C144.1 528.1 168 543.7 227.8 501.2C229.1 500.3 228.1 498.2 226.5 498.7C212.3 503.3 185.7 509.6 173.6 497C173.7 496.9 151.3 476.7 207.9 393.7Z\" fill=\"#D9D9D9\"></path>\n<path d=\"M301.2 431.4C301 430.3 299.4 430.3 299.2 431.5C296.7 453.7 291.3 527.4 323 563.4C323 563.4 335.1 578.3 351 571.6C351 571.6 378.9 565.7 391.2 493.4C391.5 491.8 389.3 491.1 388.5 492.5C381.7 505.8 367.4 529.1 349.9 528.7C349.9 528.6 319.8 530.1 301.2 431.4Z\" fill=\"#D9D9D9\"></path>\n<path d=\"M393.7 392.1C392.8 391.5 391.6 392.6 392.4 393.5C406.3 410.9 454.6 466.9 502.5 469.9C502.5 469.9 521.6 471.9 528.1 455.9C528.1 455.9 543.7 432 501.2 372.2C500.3 370.9 498.2 371.9 498.7 373.5C503.3 387.7 509.6 414.3 497 426.4C496.9 426.3 476.7 448.7 393.7 392.1Z\" fill=\"#D9D9D9\"></path>\n<path d=\"M431.4 298.8C430.3 299 430.3 300.6 431.5 300.8C453.7 303.3 527.4 308.7 563.4 277C563.4 277 578.3 264.9 571.6 249C571.6 249 565.7 221.1 493.4 208.8C491.8 208.5 491.1 210.7 492.5 211.5C505.8 218.3 529.1 232.6 528.7 250.1C528.6 250.1 530.1 280.2 431.4 298.8Z\" fill=\"#D9D9D9\"></path>\n<path d=\"M392.1 206.3C391.5 207.2 392.6 208.4 393.5 207.6C410.9 193.7 466.9 145.4 469.9 97.4999C469.9 97.4999 471.9 78.3999 455.9 71.8999C455.9 71.8999 432 56.2999 372.2 98.7999C370.9 99.6999 371.9 101.8 373.5 101.3C387.7 96.6999 414.3 90.3999 426.4 103C426.3 103.1 448.7 123.3 392.1 206.3Z\" fill=\"#D9D9D9\"></path>\n<path d=\"M196.8 61.1999L208.6 56.7999L202.4 67.6999L210.2 77.4999L197.9 74.9999L191 85.4999L189.6 72.9999L177.5 69.6999L188.9 64.4999L188.3 51.8999L196.8 61.1999Z\" fill=\"#D9D9D9\"></path>\n<path d=\"M191.9 96.5999L195.3 89.6999L197.2 97.1999L204.9 98.2999L198.3 102.4L199.6 110L193.7 105L186.9 108.7L189.8 101.5L184.2 96.0999L191.9 96.5999Z\" fill=\"#D9D9D9\"></path>\n<path d=\"M237.4 89.9999L240.8 82.9999L242.7 90.4999L250.4 91.5999L243.8 95.6999L245.1 103.3L239.2 98.3999L232.4 102L235.3 94.7999L229.7 89.3999L237.4 89.9999Z\" fill=\"#D9D9D9\"></path>\n<path d=\"M58.1999 204.1L63.3999 192.7L66.6999 204.7L79.1999 206.1L68.6999 213.1L71.2999 225.4L61.3999 217.6L50.4999 223.8L54.8999 212L45.5999 203.5L58.1999 204.1Z\" fill=\"#D9D9D9\"></path>\n<path d=\"M79.7999 232.6L77.1999 225.3L83.8999 229.3L90.0999 224.6L88.2999 232.2L94.6999 236.6L86.9999 237.3L84.6999 244.7L81.6999 237.6L73.8999 237.7L79.7999 232.6Z\" fill=\"#D9D9D9\"></path>\n<path d=\"M107.2 195.7L104.7 188.4L111.4 192.4L117.5 187.7L115.8 195.3L122.1 199.7L114.4 200.4L112.2 207.8L109.1 200.7L101.4 200.8L107.2 195.7Z\" fill=\"#D9D9D9\"></path>\n<path d=\"M61.1999 403.2L56.7999 391.4L67.6999 397.6L77.4999 389.8L74.9999 402.1L85.4999 409L72.9999 410.4L69.6999 422.5L64.4999 411.1L51.8999 411.7L61.1999 403.2Z\" fill=\"#D9D9D9\"></path>\n<path d=\"M96.5999 408.1L89.6999 404.7L97.1999 402.8L98.2999 395.1L102.4 401.7L110 400.4L105 406.3L108.7 413.1L101.5 410.2L96.0999 415.8L96.5999 408.1Z\" fill=\"#D9D9D9\"></path>\n<path d=\"M89.9999 362.6L82.9999 359.2L90.4999 357.3L91.5999 349.6L95.6999 356.2L103.3 354.9L98.3999 360.8L102 367.6L94.7999 364.7L89.3999 370.3L89.9999 362.6Z\" fill=\"#D9D9D9\"></path>\n<path d=\"M204.1 541.8L192.7 536.6L204.7 533.3L206.1 520.8L213.1 531.3L225.4 528.7L217.6 538.6L223.8 549.5L212 545.1L203.5 554.4L204.1 541.8Z\" fill=\"#D9D9D9\"></path>\n<path d=\"M232.6 520.2L225.3 522.8L229.3 516.1L224.6 509.9L232.2 511.7L236.6 505.3L237.3 513L244.7 515.3L237.6 518.3L237.7 526.1L232.6 520.2Z\" fill=\"#D9D9D9\"></path>\n<path d=\"M195.7 492.8L188.4 495.3L192.4 488.6L187.7 482.5L195.3 484.2L199.7 477.9L200.4 485.6L207.8 487.8L200.7 490.9L200.8 498.6L195.7 492.8Z\" fill=\"#D9D9D9\"></path>\n<path d=\"M403.2 538.8L391.4 543.2L397.6 532.3L389.8 522.5L402.1 525L409 514.5L410.4 527L422.5 530.3L411.1 535.5L411.7 548.1L403.2 538.8Z\" fill=\"#D9D9D9\"></path>\n<path d=\"M408.1 503.4L404.7 510.3L402.8 502.8L395.1 501.7L401.7 497.6L400.4 490L406.3 495L413.1 491.3L410.2 498.5L415.8 503.9L408.1 503.4Z\" fill=\"#D9D9D9\"></path>\n<path d=\"M362.6 510L359.2 517L357.3 509.5L349.6 508.4L356.2 504.3L354.9 496.7L360.8 501.6L367.6 498L364.7 505.2L370.3 510.6L362.6 510Z\" fill=\"#D9D9D9\"></path>\n<path d=\"M541.8 395.9L536.6 407.3L533.3 395.3L520.8 393.9L531.3 386.9L528.7 374.6L538.6 382.4L549.5 376.2L545.1 388L554.4 396.5L541.8 395.9Z\" fill=\"#D9D9D9\"></path>\n<path d=\"M520.2 367.4L522.8 374.7L516.1 370.7L509.9 375.4L511.7 367.8L505.3 363.4L513 362.7L515.3 355.3L518.3 362.4L526.1 362.3L520.2 367.4Z\" fill=\"#D9D9D9\"></path>\n<path d=\"M492.8 404.3L495.3 411.6L488.6 407.6L482.5 412.3L484.2 404.7L477.9 400.3L485.6 399.6L487.8 392.2L490.9 399.3L498.6 399.2L492.8 404.3Z\" fill=\"#D9D9D9\"></path>\n<path d=\"M538.8 196.8L543.2 208.6L532.3 202.4L522.5 210.2L525 197.9L514.5 191L527 189.6L530.3 177.5L535.5 188.9L548.1 188.3L538.8 196.8Z\" fill=\"#D9D9D9\"></path>\n<path d=\"M503.4 191.9L510.3 195.3L502.8 197.2L501.7 204.9L497.6 198.3L490 199.6L495 193.7L491.3 186.9L498.5 189.8L503.9 184.2L503.4 191.9Z\" fill=\"#D9D9D9\"></path>\n<path d=\"M510 237.4L517 240.8L509.5 242.7L508.4 250.4L504.3 243.8L496.7 245.1L501.6 239.2L498 232.4L505.2 235.3L510.6 229.7L510 237.4Z\" fill=\"#D9D9D9\"></path>\n<path d=\"M395.9 58.1999L407.3 63.3999L395.3 66.6999L393.9 79.1999L386.9 68.6999L374.6 71.2999L382.4 61.3999L376.2 50.4999L388 54.8999L396.5 45.5999L395.9 58.1999Z\" fill=\"#D9D9D9\"></path>\n<path d=\"M367.4 79.7999L374.7 77.1999L370.7 83.8999L375.4 90.0999L367.8 88.2999L363.4 94.6999L362.7 86.9999L355.3 84.6999L362.4 81.6999L362.3 73.8999L367.4 79.7999Z\" fill=\"#D9D9D9\"></path>\n<path d=\"M404.3 107.2L411.6 104.7L407.6 111.4L412.3 117.5L404.7 115.8L400.3 122.1L399.6 114.4L392.2 112.2L399.3 109.1L399.2 101.4L404.3 107.2Z\" fill=\"#D9D9D9\"></path>\n<path d=\"M298.8 168.6C299 169.7 300.6 169.7 300.8 168.5C303.3 146.3 308.7 72.5999 277 36.5999C277 36.5999 264.9 21.6999 249 28.3999C249 28.3999 221.1 34.2999 208.8 106.6C208.5 108.2 210.7 108.9 211.5 107.5C218.3 94.1999 232.6 70.8999 250.1 71.2999C250.1 71.3999 280.2 69.8999 298.8 168.6Z\" stroke=\"black\" stroke-width=\"0.5\" stroke-miterlimit=\"10\"></path>\n<path d=\"M206.3 207.9C207.2 208.5 208.4 207.4 207.6 206.5C193.7 189.1 145.4 133.1 97.4999 130.1C97.4999 130.1 78.3999 128.1 71.8999 144.1C71.8999 144.1 56.2999 168 98.7999 227.8C99.6999 229.1 101.8 228.1 101.3 226.5C96.6999 212.3 90.3999 185.7 103 173.6C103.1 173.7 123.3 151.3 206.3 207.9Z\" stroke=\"black\" stroke-width=\"0.5\" stroke-miterlimit=\"10\"></path>\n<path d=\"M168.6 301.2C169.7 301 169.7 299.4 168.5 299.2C146.3 296.7 72.5999 291.3 36.5999 323C36.5999 323 21.6999 335.1 28.3999 351C28.3999 351 34.2999 378.9 106.6 391.2C108.2 391.5 108.9 389.3 107.5 388.5C94.1999 381.7 70.8999 367.4 71.2999 349.9C71.3999 349.9 69.8999 319.8 168.6 301.2Z\" stroke=\"black\" stroke-width=\"0.5\" stroke-miterlimit=\"10\"></path>\n<path d=\"M207.9 393.7C208.5 392.8 207.4 391.6 206.5 392.4C189.1 406.3 133.1 454.6 130.1 502.5C130.1 502.5 128.1 521.6 144.1 528.1C144.1 528.1 168 543.7 227.8 501.2C229.1 500.3 228.1 498.2 226.5 498.7C212.3 503.3 185.7 509.6 173.6 497C173.7 496.9 151.3 476.7 207.9 393.7Z\" stroke=\"black\" stroke-width=\"0.5\" stroke-miterlimit=\"10\"></path>\n<path d=\"M301.2 431.4C301 430.3 299.4 430.3 299.2 431.5C296.7 453.7 291.3 527.4 323 563.4C323 563.4 335.1 578.3 351 571.6C351 571.6 378.9 565.7 391.2 493.4C391.5 491.8 389.3 491.1 388.5 492.5C381.7 505.8 367.4 529.1 349.9 528.7C349.9 528.6 319.8 530.1 301.2 431.4Z\" stroke=\"black\" stroke-width=\"0.5\" stroke-miterlimit=\"10\"></path>\n<path d=\"M393.7 392.1C392.8 391.5 391.6 392.6 392.4 393.5C406.3 410.9 454.6 466.9 502.5 469.9C502.5 469.9 521.6 471.9 528.1 455.9C528.1 455.9 543.7 432 501.2 372.2C500.3 370.9 498.2 371.9 498.7 373.5C503.3 387.7 509.6 414.3 497 426.4C496.9 426.3 476.7 448.7 393.7 392.1Z\" stroke=\"black\" stroke-width=\"0.5\" stroke-miterlimit=\"10\"></path>\n<path d=\"M431.4 298.8C430.3 299 430.3 300.6 431.5 300.8C453.7 303.3 527.4 308.7 563.4 277C563.4 277 578.3 264.9 571.6 249C571.6 249 565.7 221.1 493.4 208.8C491.8 208.5 491.1 210.7 492.5 211.5C505.8 218.3 529.1 232.6 528.7 250.1C528.6 250.1 530.1 280.2 431.4 298.8Z\" stroke=\"black\" stroke-width=\"0.5\" stroke-miterlimit=\"10\"></path>\n<path d=\"M392.1 206.3C391.5 207.2 392.6 208.4 393.5 207.6C410.9 193.7 466.9 145.4 469.9 97.4999C469.9 97.4999 471.9 78.3999 455.9 71.8999C455.9 71.8999 432 56.2999 372.2 98.7999C370.9 99.6999 371.9 101.8 373.5 101.3C387.7 96.6999 414.3 90.3999 426.4 103C426.3 103.1 448.7 123.3 392.1 206.3Z\" stroke=\"black\" stroke-width=\"0.5\" stroke-miterlimit=\"10\"></path>\n<path d=\"M196.8 61.1999L208.6 56.7999L202.4 67.6999L210.2 77.4999L197.9 74.9999L191 85.4999L189.6 72.9999L177.5 69.6999L188.9 64.4999L188.3 51.8999L196.8 61.1999Z\" stroke=\"black\" stroke-width=\"0.5\" stroke-miterlimit=\"10\"></path>\n<path d=\"M191.9 96.5999L195.3 89.6999L197.2 97.1999L204.9 98.2999L198.3 102.4L199.6 110L193.7 105L186.9 108.7L189.8 101.5L184.2 96.0999L191.9 96.5999Z\" stroke=\"black\" stroke-width=\"0.5\" stroke-miterlimit=\"10\"></path>\n<path d=\"M237.4 89.9999L240.8 82.9999L242.7 90.4999L250.4 91.5999L243.8 95.6999L245.1 103.3L239.2 98.3999L232.4 102L235.3 94.7999L229.7 89.3999L237.4 89.9999Z\" stroke=\"black\" stroke-width=\"0.5\" stroke-miterlimit=\"10\"></path>\n<path d=\"M58.1999 204.1L63.3999 192.7L66.6999 204.7L79.1999 206.1L68.6999 213.1L71.2999 225.4L61.3999 217.6L50.4999 223.8L54.8999 212L45.5999 203.5L58.1999 204.1Z\" stroke=\"black\" stroke-width=\"0.5\" stroke-miterlimit=\"10\"></path>\n<path d=\"M79.7999 232.6L77.1999 225.3L83.8999 229.3L90.0999 224.6L88.2999 232.2L94.6999 236.6L86.9999 237.3L84.6999 244.7L81.6999 237.6L73.8999 237.7L79.7999 232.6Z\" stroke=\"black\" stroke-width=\"0.5\" stroke-miterlimit=\"10\"></path>\n<path d=\"M107.2 195.7L104.7 188.4L111.4 192.4L117.5 187.7L115.8 195.3L122.1 199.7L114.4 200.4L112.2 207.8L109.1 200.7L101.4 200.8L107.2 195.7Z\" stroke=\"black\" stroke-width=\"0.5\" stroke-miterlimit=\"10\"></path>\n<path d=\"M61.1999 403.2L56.7999 391.4L67.6999 397.6L77.4999 389.8L74.9999 402.1L85.4999 409L72.9999 410.4L69.6999 422.5L64.4999 411.1L51.8999 411.7L61.1999 403.2Z\" stroke=\"black\" stroke-width=\"0.5\" stroke-miterlimit=\"10\"></path>\n<path d=\"M96.5999 408.1L89.6999 404.7L97.1999 402.8L98.2999 395.1L102.4 401.7L110 400.4L105 406.3L108.7 413.1L101.5 410.2L96.0999 415.8L96.5999 408.1Z\" stroke=\"black\" stroke-width=\"0.5\" stroke-miterlimit=\"10\"></path>\n<path d=\"M89.9999 362.6L82.9999 359.2L90.4999 357.3L91.5999 349.6L95.6999 356.2L103.3 354.9L98.3999 360.8L102 367.6L94.7999 364.7L89.3999 370.3L89.9999 362.6Z\" stroke=\"black\" stroke-width=\"0.5\" stroke-miterlimit=\"10\"></path>\n<path d=\"M204.1 541.8L192.7 536.6L204.7 533.3L206.1 520.8L213.1 531.3L225.4 528.7L217.6 538.6L223.8 549.5L212 545.1L203.5 554.4L204.1 541.8Z\" stroke=\"black\" stroke-width=\"0.5\" stroke-miterlimit=\"10\"></path>\n<path d=\"M232.6 520.2L225.3 522.8L229.3 516.1L224.6 509.9L232.2 511.7L236.6 505.3L237.3 513L244.7 515.3L237.6 518.3L237.7 526.1L232.6 520.2Z\" stroke=\"black\" stroke-width=\"0.5\" stroke-miterlimit=\"10\"></path>\n<path d=\"M195.7 492.8L188.4 495.3L192.4 488.6L187.7 482.5L195.3 484.2L199.7 477.9L200.4 485.6L207.8 487.8L200.7 490.9L200.8 498.6L195.7 492.8Z\" stroke=\"black\" stroke-width=\"0.5\" stroke-miterlimit=\"10\"></path>\n<path d=\"M403.2 538.8L391.4 543.2L397.6 532.3L389.8 522.5L402.1 525L409 514.5L410.4 527L422.5 530.3L411.1 535.5L411.7 548.1L403.2 538.8Z\" stroke=\"black\" stroke-width=\"0.5\" stroke-miterlimit=\"10\"></path>\n<path d=\"M408.1 503.4L404.7 510.3L402.8 502.8L395.1 501.7L401.7 497.6L400.4 490L406.3 495L413.1 491.3L410.2 498.5L415.8 503.9L408.1 503.4Z\" stroke=\"black\" stroke-width=\"0.5\" stroke-miterlimit=\"10\"></path>\n<path d=\"M362.6 510L359.2 517L357.3 509.5L349.6 508.4L356.2 504.3L354.9 496.7L360.8 501.6L367.6 498L364.7 505.2L370.3 510.6L362.6 510Z\" stroke=\"black\" stroke-width=\"0.5\" stroke-miterlimit=\"10\"></path>\n<path d=\"M541.8 395.9L536.6 407.3L533.3 395.3L520.8 393.9L531.3 386.9L528.7 374.6L538.6 382.4L549.5 376.2L545.1 388L554.4 396.5L541.8 395.9Z\" stroke=\"black\" stroke-width=\"0.5\" stroke-miterlimit=\"10\"></path>\n<path d=\"M520.2 367.4L522.8 374.7L516.1 370.7L509.9 375.4L511.7 367.8L505.3 363.4L513 362.7L515.3 355.3L518.3 362.4L526.1 362.3L520.2 367.4Z\" stroke=\"black\" stroke-width=\"0.5\" stroke-miterlimit=\"10\"></path>\n<path d=\"M492.8 404.3L495.3 411.6L488.6 407.6L482.5 412.3L484.2 404.7L477.9 400.3L485.6 399.6L487.8 392.2L490.9 399.3L498.6 399.2L492.8 404.3Z\" stroke=\"black\" stroke-width=\"0.5\" stroke-miterlimit=\"10\"></path>\n<path d=\"M538.8 196.8L543.2 208.6L532.3 202.4L522.5 210.2L525 197.9L514.5 191L527 189.6L530.3 177.5L535.5 188.9L548.1 188.3L538.8 196.8Z\" stroke=\"black\" stroke-width=\"0.5\" stroke-miterlimit=\"10\"></path>\n<path d=\"M503.4 191.9L510.3 195.3L502.8 197.2L501.7 204.9L497.6 198.3L490 199.6L495 193.7L491.3 186.9L498.5 189.8L503.9 184.2L503.4 191.9Z\" stroke=\"black\" stroke-width=\"0.5\" stroke-miterlimit=\"10\"></path>\n<path d=\"M510 237.4L517 240.8L509.5 242.7L508.4 250.4L504.3 243.8L496.7 245.1L501.6 239.2L498 232.4L505.2 235.3L510.6 229.7L510 237.4Z\" stroke=\"black\" stroke-width=\"0.5\" stroke-miterlimit=\"10\"></path>\n<path d=\"M395.9 58.1999L407.3 63.3999L395.3 66.6999L393.9 79.1999L386.9 68.6999L374.6 71.2999L382.4 61.3999L376.2 50.4999L388 54.8999L396.5 45.5999L395.9 58.1999Z\" stroke=\"black\" stroke-width=\"0.5\" stroke-miterlimit=\"10\"></path>\n<path d=\"M367.4 79.7999L374.7 77.1999L370.7 83.8999L375.4 90.0999L367.8 88.2999L363.4 94.6999L362.7 86.9999L355.3 84.6999L362.4 81.6999L362.3 73.8999L367.4 79.7999Z\" stroke=\"black\" stroke-width=\"0.5\" stroke-miterlimit=\"10\"></path>\n<path d=\"M404.3 107.2L411.6 104.7L407.6 111.4L412.3 117.5L404.7 115.8L400.3 122.1L399.6 114.4L392.2 112.2L399.3 109.1L399.2 101.4L404.3 107.2Z\" stroke=\"black\" stroke-width=\"0.5\" stroke-miterlimit=\"10\"></path>\n</svg>\n";


var $84d626029e66eee6$exports = {};
$84d626029e66eee6$exports = "<svg width=\"600\" height=\"600\" viewBox=\"0 0 600 600\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<path d=\"M189.027 234.634L254.492 219.63L217.249 275.449L251.723 333.055L187.062 314.925L143.031 365.475L140.263 298.402L78.5486 272.145L141.513 248.835L147.408 181.94L189.027 234.634Z\" fill=\"#D9D9D9\"></path>\n<path d=\"M288.341 394.055L336.837 424.421L280.75 435.674L266.817 491.136L238.773 441.301L181.703 445.141L220.464 403.075L199.119 350.024L251.098 373.96L295.04 337.164L288.341 394.055Z\" fill=\"#D9D9D9\"></path>\n<path d=\"M338.356 463.718L355.146 474.257L335.766 478.097L330.943 497.299L321.297 480.062L301.559 481.401L314.956 466.844L307.543 448.535L325.495 456.752L340.678 444.069L338.356 463.718Z\" fill=\"#D9D9D9\"></path>\n<path d=\"M377.295 499.085L383.994 509.356L372.115 506.498L364.435 516.054L363.452 503.819L352.02 499.442L363.273 494.798L363.899 482.563L371.847 491.851L383.636 488.636L377.295 499.085Z\" fill=\"#D9D9D9\"></path>\n<path d=\"M415.699 491.494L425.166 499.264L412.931 500.157L408.465 511.499L403.91 500.157L391.674 499.442L401.052 491.583L398.016 479.705L408.376 486.224L418.647 479.615L415.699 491.494Z\" fill=\"#D9D9D9\"></path>\n<path d=\"M194.832 183.012L193.939 163.185L208.139 176.939L226.627 170.062L217.964 187.835L230.289 203.286L210.73 200.517L199.834 216.95L196.44 197.48L177.327 192.211L194.832 183.012Z\" fill=\"#D9D9D9\"></path>\n<path d=\"M201.798 130.854L206.443 119.512L210.819 130.943L223.055 131.836L213.587 139.607L216.535 151.485L206.175 144.876L195.815 151.306L198.94 139.428L189.563 131.569L201.798 130.854Z\" fill=\"#D9D9D9\"></path>\n<path d=\"M173.755 103.525L174.826 91.3784L182.418 100.935L194.296 98.1661L187.598 108.348L193.939 118.886L182.15 115.582L174.112 124.87L173.576 112.635L162.323 107.901L173.755 103.525Z\" fill=\"#D9D9D9\"></path>\n<path d=\"M132.225 397.806L162.769 395.663L142.049 418.258L153.481 446.659L125.616 433.888L102.127 453.536L105.699 423.081L79.7096 406.826L109.718 400.753L117.22 371.013L132.225 397.806Z\" fill=\"#D9D9D9\"></path>\n<path d=\"M320.225 267.59L342.107 289.025L311.473 288.489L297.897 315.997L288.877 286.703L258.511 282.237L283.608 264.643L278.517 234.455L302.988 252.854L330.139 238.564L320.225 267.59Z\" fill=\"#D9D9D9\"></path>\n<path d=\"M189.027 234.634L254.492 219.63L217.249 275.449L251.723 333.055L187.062 314.925L143.031 365.475L140.263 298.402L78.5486 272.145L141.513 248.835L147.408 181.94L189.027 234.634Z\" stroke=\"black\" stroke-width=\"0.5\" stroke-miterlimit=\"10\"></path>\n<path d=\"M288.341 394.055L336.837 424.421L280.75 435.674L266.817 491.136L238.773 441.301L181.703 445.141L220.464 403.075L199.119 350.024L251.098 373.96L295.04 337.164L288.341 394.055Z\" stroke=\"black\" stroke-width=\"0.5\" stroke-miterlimit=\"10\"></path>\n<path d=\"M338.356 463.718L355.146 474.257L335.766 478.097L330.943 497.299L321.297 480.062L301.559 481.401L314.956 466.844L307.543 448.535L325.495 456.752L340.678 444.069L338.356 463.718Z\" stroke=\"black\" stroke-width=\"0.5\" stroke-miterlimit=\"10\"></path>\n<path d=\"M377.295 499.085L383.994 509.356L372.115 506.498L364.435 516.054L363.452 503.819L352.02 499.442L363.273 494.798L363.899 482.563L371.847 491.851L383.636 488.636L377.295 499.085Z\" stroke=\"black\" stroke-width=\"0.5\" stroke-miterlimit=\"10\"></path>\n<path d=\"M415.699 491.494L425.166 499.264L412.931 500.157L408.465 511.499L403.91 500.157L391.674 499.442L401.052 491.583L398.016 479.705L408.376 486.224L418.647 479.615L415.699 491.494Z\" stroke=\"black\" stroke-width=\"0.5\" stroke-miterlimit=\"10\"></path>\n<path d=\"M194.832 183.012L193.939 163.185L208.139 176.939L226.627 170.062L217.964 187.835L230.289 203.286L210.73 200.517L199.834 216.95L196.44 197.48L177.327 192.211L194.832 183.012Z\" stroke=\"black\" stroke-width=\"0.5\" stroke-miterlimit=\"10\"></path>\n<path d=\"M201.798 130.854L206.443 119.512L210.819 130.943L223.055 131.836L213.587 139.607L216.535 151.485L206.175 144.876L195.815 151.306L198.94 139.428L189.563 131.569L201.798 130.854Z\" stroke=\"black\" stroke-width=\"0.5\" stroke-miterlimit=\"10\"></path>\n<path d=\"M173.755 103.525L174.826 91.3784L182.418 100.935L194.296 98.1661L187.598 108.348L193.939 118.886L182.15 115.582L174.112 124.87L173.576 112.635L162.323 107.901L173.755 103.525Z\" stroke=\"black\" stroke-width=\"0.5\" stroke-miterlimit=\"10\"></path>\n<path d=\"M132.225 397.806L162.769 395.663L142.049 418.258L153.481 446.659L125.616 433.888L102.127 453.536L105.699 423.081L79.7096 406.826L109.718 400.753L117.22 371.013L132.225 397.806Z\" stroke=\"black\" stroke-width=\"0.5\" stroke-miterlimit=\"10\"></path>\n<path d=\"M320.225 267.59L342.107 289.025L311.473 288.489L297.897 315.997L288.877 286.703L258.511 282.237L283.608 264.643L278.517 234.455L302.988 252.854L330.139 238.564L320.225 267.59Z\" stroke=\"black\" stroke-width=\"0.5\" stroke-miterlimit=\"10\"></path>\n</svg>\n";


var $5cd5d5a39d9a3609$exports = {};
$5cd5d5a39d9a3609$exports = "<svg width=\"600\" height=\"600\" viewBox=\"0 0 600 600\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<path d=\"M321.055 143.427L344.506 131.785L320.889 120.06L329.953 100.351L311.741 108.75C309.746 84.634 304.673 67.5864 298.769 67.5864C292.864 67.5864 287.792 84.634 285.796 108.833L267.584 100.434L276.648 120.143L253.031 131.785L276.482 143.427L267.584 162.804L285.63 154.488C287.542 179.518 292.698 197.481 298.769 197.481C304.839 197.481 309.995 179.602 311.908 154.488L329.953 162.804L321.055 143.427Z\" fill=\"#D9D9D9\"></path>\n<path d=\"M175.277 202.304L176.941 176.192L154.987 190.745L142.43 173.115L140.6 193.073C118.729 182.762 101.349 178.604 98.4385 183.76C95.4448 188.915 107.752 201.805 127.627 215.609L111.328 227.169L132.866 229.164L131.203 255.443L152.991 240.973L165.298 258.353L167.128 238.561C189.747 249.372 207.876 253.946 210.87 248.707C213.863 243.468 200.974 230.079 180.267 215.859L196.483 204.383L175.277 202.304Z\" fill=\"#D9D9D9\"></path>\n<path d=\"M153.323 358.061L131.536 343.591L133.199 369.87L111.661 371.865L127.96 383.424C108.085 397.229 95.7774 410.202 98.7712 415.274C101.765 420.43 119.062 416.189 140.933 405.961L142.762 425.919L155.319 408.206L177.273 422.759L175.61 396.647L196.816 394.651L180.683 383.175C201.389 368.955 214.362 355.566 211.285 350.327C208.208 345.088 190.163 349.579 167.544 360.473L165.714 340.681L153.323 358.061Z\" fill=\"#D9D9D9\"></path>\n<path d=\"M277.23 454.858L253.78 466.5L277.397 478.226L268.332 497.934L286.544 489.535C288.623 513.651 293.613 530.782 299.517 530.782C305.421 530.782 310.494 513.735 312.49 489.535L330.702 497.934L321.637 478.226L345.255 466.5L321.804 454.858L330.702 435.482L312.656 443.798C310.744 418.767 305.588 400.805 299.517 400.805C293.446 400.805 288.291 418.684 286.378 443.798L268.332 435.482L277.23 454.858Z\" fill=\"#D9D9D9\"></path>\n<path d=\"M423.008 395.981L421.345 422.093L443.299 407.541L455.856 425.253L457.686 405.295C479.556 415.607 496.937 419.765 499.847 414.609C502.841 409.453 490.533 396.564 470.658 382.759L486.957 371.2L465.419 369.204L467.082 342.926L445.295 357.396L432.987 340.015L431.158 359.807C408.539 348.997 390.41 344.423 387.416 349.662C384.422 354.901 397.312 368.289 418.019 382.51L401.803 393.986L423.008 395.981Z\" fill=\"#D9D9D9\"></path>\n<path d=\"M444.962 240.308L466.75 254.777L465.087 228.499L486.625 226.503L470.326 214.944C490.201 201.14 502.508 188.167 499.515 183.094C496.521 177.938 479.224 182.18 457.353 192.408L455.523 172.45L442.966 190.163L421.012 175.527L422.676 201.639L401.47 203.635L417.686 215.111C396.979 229.331 384.007 242.719 387.084 247.958C390.16 253.197 408.206 248.707 430.825 237.813L432.655 257.605L444.962 240.308Z\" fill=\"#D9D9D9\"></path>\n<path d=\"M321.055 143.427L344.506 131.785L320.889 120.06L329.953 100.351L311.741 108.75C309.746 84.634 304.673 67.5864 298.769 67.5864C292.864 67.5864 287.792 84.634 285.796 108.833L267.584 100.434L276.648 120.143L253.031 131.785L276.482 143.427L267.584 162.804L285.63 154.488C287.542 179.518 292.698 197.481 298.769 197.481C304.839 197.481 309.995 179.602 311.908 154.488L329.953 162.804L321.055 143.427Z\" stroke=\"black\" stroke-width=\"0.5\" stroke-miterlimit=\"10\"></path>\n<path d=\"M175.277 202.304L176.941 176.192L154.987 190.745L142.43 173.115L140.6 193.073C118.729 182.762 101.349 178.604 98.4385 183.76C95.4448 188.915 107.752 201.805 127.627 215.609L111.328 227.169L132.866 229.164L131.203 255.443L152.991 240.973L165.298 258.353L167.128 238.561C189.747 249.372 207.876 253.946 210.87 248.707C213.863 243.468 200.974 230.079 180.267 215.859L196.483 204.383L175.277 202.304Z\" stroke=\"black\" stroke-width=\"0.5\" stroke-miterlimit=\"10\"></path>\n<path d=\"M153.323 358.061L131.536 343.591L133.199 369.87L111.661 371.865L127.96 383.424C108.085 397.229 95.7774 410.202 98.7712 415.274C101.765 420.43 119.062 416.189 140.933 405.961L142.762 425.919L155.319 408.206L177.273 422.759L175.61 396.647L196.816 394.651L180.683 383.175C201.389 368.955 214.362 355.566 211.285 350.327C208.208 345.088 190.163 349.579 167.544 360.473L165.714 340.681L153.323 358.061Z\" stroke=\"black\" stroke-width=\"0.5\" stroke-miterlimit=\"10\"></path>\n<path d=\"M277.23 454.858L253.78 466.5L277.397 478.226L268.332 497.934L286.544 489.535C288.623 513.651 293.613 530.782 299.517 530.782C305.421 530.782 310.494 513.735 312.49 489.535L330.702 497.934L321.637 478.226L345.255 466.5L321.804 454.858L330.702 435.482L312.656 443.798C310.744 418.767 305.588 400.805 299.517 400.805C293.446 400.805 288.291 418.684 286.378 443.798L268.332 435.482L277.23 454.858Z\" stroke=\"black\" stroke-width=\"0.5\" stroke-miterlimit=\"10\"></path>\n<path d=\"M423.008 395.981L421.345 422.093L443.299 407.541L455.856 425.253L457.686 405.295C479.556 415.607 496.937 419.765 499.847 414.609C502.841 409.453 490.533 396.564 470.658 382.759L486.957 371.2L465.419 369.204L467.082 342.926L445.295 357.396L432.987 340.015L431.158 359.807C408.539 348.997 390.41 344.423 387.416 349.662C384.422 354.901 397.312 368.289 418.019 382.51L401.803 393.986L423.008 395.981Z\" stroke=\"black\" stroke-width=\"0.5\" stroke-miterlimit=\"10\"></path>\n<path d=\"M444.962 240.308L466.75 254.777L465.087 228.499L486.625 226.503L470.326 214.944C490.201 201.14 502.508 188.167 499.515 183.094C496.521 177.938 479.224 182.18 457.353 192.408L455.523 172.45L442.966 190.163L421.012 175.527L422.676 201.639L401.47 203.635L417.686 215.111C396.979 229.331 384.007 242.719 387.084 247.958C390.16 253.197 408.206 248.707 430.825 237.813L432.655 257.605L444.962 240.308Z\" stroke=\"black\" stroke-width=\"0.5\" stroke-miterlimit=\"10\"></path>\n</svg>\n";


var $3d64790b2c72e50e$exports = {};
$3d64790b2c72e50e$exports = "<svg width=\"600\" height=\"600\" viewBox=\"0 0 600 600\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<path d=\"M111.2 130.4L122.5 148.5L126.5 132.4L134.6 152.5L114 177.2L146.2 174.9L163.2 202.2L170.3 174L202.5 214.6C206.3 210.3 210.3 206.2 214.6 202.5L174 170.3L202.1 163.2L174.8 146.2L177.1 114L152.4 134.6L132.3 126.5L148.4 122.5L130.3 111.2L131.8 89.9002L115.5 103.6L95.7 95.6002L103.7 115.4L90 131.9L111.2 130.4Z\" fill=\"#D9D9D9\"></path>\n<path d=\"M134.2 327.6L119.3 302.7L170.7 308.6C170.5 305.7 170.4 302.9 170.4 299.9C170.4 297 170.5 294.1 170.7 291.2L119.3 297.1L134.2 272.2L102.9 279.5L81.7 255.3L78.9 287.4L58.9 295.9L67.4 281.7L46.7 286.5L32.7 270.4L30.8 291.7L11.1 300L30.7 308.3L32.6 329.6L46.6 313.5L67.3 318.3L58.8 304.1L78.8 312.6L81.6 344.7L102.8 320.4L134.2 327.6Z\" fill=\"#D9D9D9\"></path>\n<path d=\"M255.3 81.7002L279.6 102.9L272.3 134.2L297.2 119.3L291.3 170.7C294.2 170.5 297 170.4 300 170.4C303 170.4 306 170.5 308.9 170.7L303 119.6L327.8 134.5L320.5 103.2L344.6 81.7002L312.5 78.9002L304 58.9002L318.2 67.4002L313.4 46.7002L329.5 32.7002L308.2 30.8002L299.9 11.2002L291.6 30.8002L270.3 32.7002L286.4 46.7002L281.6 67.4002L295.8 58.9002L287.3 78.9002L255.3 81.7002Z\" fill=\"#D9D9D9\"></path>\n<path d=\"M426.2 170.5L385.7 202.7C390 206.5 394 210.5 397.7 214.7L429.9 174.2L437 202.3L454 175L486.2 177.3L465.6 152.6L473.7 132.5L477.7 148.6L489 130.5L510.3 132L496.6 115.7L504.6 95.9002L484.8 103.9L468.5 90.2002L470 111.5L451.9 122.8L468 126.8L447.9 134.9L423 114.2L425.3 146.4L398 163.4L426.2 170.5Z\" fill=\"#D9D9D9\"></path>\n<path d=\"M488.7 469.9L477.4 451.8L473.4 467.9L465.3 447.8L485.9 423.1L453.7 425.4L436.7 398.1L429.6 426.2L397.4 385.6C393.6 389.9 389.6 393.9 385.3 397.6L426 429.9L397.8 437L425.1 454L422.8 486.2L447.5 465.6L467.6 473.7L451.5 477.7L469.6 489L468.1 510.3L484.4 496.6L504.2 504.6L496.2 484.8L509.9 468.5L488.7 469.9Z\" fill=\"#D9D9D9\"></path>\n<path d=\"M569.3 291.8L567.4 270.5L553.4 286.6L532.7 281.8L541.2 296L521.2 287.5L518.4 255.4L497.2 279.7L465.9 272.4L480.8 297.3L429.4 291.4C429.6 294.2 429.7 297.1 429.7 300C429.7 303 429.6 306 429.4 308.9L480.6 303L465.6 328L496.9 320.7L518.1 345L520.9 312.9L540.9 304.4L532.4 318.6L553.1 313.8L567.1 329.9L569 308.6L588.6 300.3L569.3 291.8Z\" fill=\"#D9D9D9\"></path>\n<path d=\"M344.7 518.4L320.4 497.2L327.7 465.9L302.9 480.8L308.8 429.3C305.9 429.5 303 429.6 300 429.6C297.1 429.6 294.2 429.5 291.3 429.3L297.2 480.7L272.3 465.8L279.6 497.1L255.3 518.4L287.4 521.2L295.9 541.2L281.7 532.7L286.5 553.4L270.5 567.4L291.8 569.3L300.1 588.9L308.4 569.3L329.7 567.4L313.6 553.4L318.4 532.7L304.2 541.2L312.7 521.2L344.7 518.4Z\" fill=\"#D9D9D9\"></path>\n<path d=\"M174 429.7L214.6 397.5C210.3 393.7 206.2 389.7 202.5 385.4L170.3 426L163.2 397.8L146.2 425.1L114 422.8L134.6 447.5L126.5 467.6L122.5 451.5L111.2 469.7L90 468.2L103.7 484.5L95.7 504.3L115.5 496.3L131.8 510L130.3 488.7L148.4 477.4L132.3 473.4L152.4 465.3L177.1 485.9L174.8 453.7L202.1 436.7L174 429.7Z\" fill=\"#D9D9D9\"></path>\n<path d=\"M111.2 130.4L122.5 148.5L126.5 132.4L134.6 152.5L114 177.2L146.2 174.9L163.2 202.2L170.3 174L202.5 214.6C206.3 210.3 210.3 206.2 214.6 202.5L174 170.3L202.1 163.2L174.8 146.2L177.1 114L152.4 134.6L132.3 126.5L148.4 122.5L130.3 111.2L131.8 89.9002L115.5 103.6L95.7 95.6002L103.7 115.4L90 131.9L111.2 130.4Z\" stroke=\"black\" stroke-width=\"0.5\" stroke-miterlimit=\"10\"></path>\n<path d=\"M134.2 327.6L119.3 302.7L170.7 308.6C170.5 305.7 170.4 302.9 170.4 299.9C170.4 297 170.5 294.1 170.7 291.2L119.3 297.1L134.2 272.2L102.9 279.5L81.7 255.3L78.9 287.4L58.9 295.9L67.4 281.7L46.7 286.5L32.7 270.4L30.8 291.7L11.1 300L30.7 308.3L32.6 329.6L46.6 313.5L67.3 318.3L58.8 304.1L78.8 312.6L81.6 344.7L102.8 320.4L134.2 327.6Z\" stroke=\"black\" stroke-width=\"0.5\" stroke-miterlimit=\"10\"></path>\n<path d=\"M255.3 81.7002L279.6 102.9L272.3 134.2L297.2 119.3L291.3 170.7C294.2 170.5 297 170.4 300 170.4C303 170.4 306 170.5 308.9 170.7L303 119.6L327.8 134.5L320.5 103.2L344.6 81.7002L312.5 78.9002L304 58.9002L318.2 67.4002L313.4 46.7002L329.5 32.7002L308.2 30.8002L299.9 11.2002L291.6 30.8002L270.3 32.7002L286.4 46.7002L281.6 67.4002L295.8 58.9002L287.3 78.9002L255.3 81.7002Z\" stroke=\"black\" stroke-width=\"0.5\" stroke-miterlimit=\"10\"></path>\n<path d=\"M426.2 170.5L385.7 202.7C390 206.5 394 210.5 397.7 214.7L429.9 174.2L437 202.3L454 175L486.2 177.3L465.6 152.6L473.7 132.5L477.7 148.6L489 130.5L510.3 132L496.6 115.7L504.6 95.9002L484.8 103.9L468.5 90.2002L470 111.5L451.9 122.8L468 126.8L447.9 134.9L423 114.2L425.3 146.4L398 163.4L426.2 170.5Z\" stroke=\"black\" stroke-width=\"0.5\" stroke-miterlimit=\"10\"></path>\n<path d=\"M488.7 469.9L477.4 451.8L473.4 467.9L465.3 447.8L485.9 423.1L453.7 425.4L436.7 398.1L429.6 426.2L397.4 385.6C393.6 389.9 389.6 393.9 385.3 397.6L426 429.9L397.8 437L425.1 454L422.8 486.2L447.5 465.6L467.6 473.7L451.5 477.7L469.6 489L468.1 510.3L484.4 496.6L504.2 504.6L496.2 484.8L509.9 468.5L488.7 469.9Z\" stroke=\"black\" stroke-width=\"0.5\" stroke-miterlimit=\"10\"></path>\n<path d=\"M569.3 291.8L567.4 270.5L553.4 286.6L532.7 281.8L541.2 296L521.2 287.5L518.4 255.4L497.2 279.7L465.9 272.4L480.8 297.3L429.4 291.4C429.6 294.2 429.7 297.1 429.7 300C429.7 303 429.6 306 429.4 308.9L480.6 303L465.6 328L496.9 320.7L518.1 345L520.9 312.9L540.9 304.4L532.4 318.6L553.1 313.8L567.1 329.9L569 308.6L588.6 300.3L569.3 291.8Z\" stroke=\"black\" stroke-width=\"0.5\" stroke-miterlimit=\"10\"></path>\n<path d=\"M344.7 518.4L320.4 497.2L327.7 465.9L302.9 480.8L308.8 429.3C305.9 429.5 303 429.6 300 429.6C297.1 429.6 294.2 429.5 291.3 429.3L297.2 480.7L272.3 465.8L279.6 497.1L255.3 518.4L287.4 521.2L295.9 541.2L281.7 532.7L286.5 553.4L270.5 567.4L291.8 569.3L300.1 588.9L308.4 569.3L329.7 567.4L313.6 553.4L318.4 532.7L304.2 541.2L312.7 521.2L344.7 518.4Z\" stroke=\"black\" stroke-width=\"0.5\" stroke-miterlimit=\"10\"></path>\n<path d=\"M174 429.7L214.6 397.5C210.3 393.7 206.2 389.7 202.5 385.4L170.3 426L163.2 397.8L146.2 425.1L114 422.8L134.6 447.5L126.5 467.6L122.5 451.5L111.2 469.7L90 468.2L103.7 484.5L95.7 504.3L115.5 496.3L131.8 510L130.3 488.7L148.4 477.4L132.3 473.4L152.4 465.3L177.1 485.9L174.8 453.7L202.1 436.7L174 429.7Z\" stroke=\"black\" stroke-width=\"0.5\" stroke-miterlimit=\"10\"></path>\n</svg>\n";


var $541c554e7117d234$exports = {};
$541c554e7117d234$exports = "<svg width=\"600\" height=\"600\" viewBox=\"0 0 600 600\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<path d=\"M461.428 461.261C463.257 459.432 415.108 408.123 347.749 339.683C431.906 334.194 499.681 321.637 499.681 299.184C499.681 276.731 431.823 264.174 347.666 258.686C415.191 190.246 463.424 138.854 461.511 136.941C459.598 135.028 408.289 183.344 339.766 250.786C334.194 166.546 321.637 98.688 299.184 98.688C276.732 98.688 264.174 166.463 258.686 250.62C190.246 183.178 138.937 135.028 137.107 136.941C135.278 138.771 183.51 190.163 250.952 258.686C166.629 264.174 98.7712 276.731 98.7712 299.184C98.7712 321.637 166.629 334.194 250.786 339.683C183.344 408.04 135.195 459.349 137.107 461.261C138.937 463.091 190.246 414.942 258.686 347.583C264.174 431.823 276.732 499.598 299.184 499.598C321.721 499.598 334.194 431.657 339.683 347.417C408.206 414.859 459.515 463.091 461.428 461.261Z\" fill=\"#D9D9D9\" stroke=\"black\" stroke-width=\"0.5\" stroke-miterlimit=\"10\"></path>\n</svg>\n";


var $23a52e4b08eba078$exports = {};
$23a52e4b08eba078$exports = "<svg width=\"600\" height=\"600\" viewBox=\"0 0 600 600\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<path d=\"M250.1 67.6999L270 69.2999C274.4 69.6999 275.9 75.2999 272.3 77.7999L255.9 89.0999L254.3 109C253.9 113.4 248.3 114.9 245.8 111.3L234.5 94.8999L214.6 93.2999C210.2 92.8999 208.7 87.2999 212.3 84.7999L228.7 73.4999L230.3 53.5999C230.7 49.1999 236.3 47.6999 238.8 51.2999L250.1 67.6999Z\" fill=\"#D9D9D9\"></path>\n<path d=\"M265.4 132.8L281.6 134.1C285.2 134.4 286.4 139 283.5 141L270.1 150.2L268.8 166.4C268.5 170 263.9 171.2 261.9 168.3L252.7 154.9L236.5 153.6C232.9 153.3 231.7 148.7 234.6 146.7L248 137.5L249.3 121.3C249.6 117.7 254.2 116.5 256.2 119.4L265.4 132.8Z\" fill=\"#D9D9D9\"></path>\n<path d=\"M140.6 123.8L158.6 115.2C162.6 113.3 166.7 117.5 164.8 121.4L156.2 139.4L164.8 157.4C166.7 161.4 162.5 165.5 158.6 163.6L140.6 155L122.6 163.6C118.6 165.5 114.5 161.3 116.4 157.4L125 139.4L116.4 121.4C114.5 117.4 118.7 113.3 122.6 115.2L140.6 123.8Z\" fill=\"#D9D9D9\"></path>\n<path d=\"M186.4 172.5L201.1 165.5C204.3 164 207.7 167.3 206.2 170.6L199.2 185.3L206.2 200C207.7 203.2 204.4 206.6 201.1 205.1L186.4 198.1L171.7 205.1C168.5 206.6 165.1 203.3 166.6 200L173.6 185.3L166.6 170.6C165.1 167.4 168.4 164 171.7 165.5L186.4 172.5Z\" fill=\"#D9D9D9\"></path>\n<path d=\"M73.9 227.1L85.2 210.7C87.7 207.1 93.4 208.6 93.7 213L95.3 232.9L111.7 244.2C115.3 246.7 113.8 252.4 109.4 252.7L89.5 254.3L78.2 270.7C75.7 274.3 70 272.8 69.7 268.4L68.1 248.5L51.7 237.2C48.1 234.7 49.6 229 54 228.7L73.9 227.1Z\" fill=\"#D9D9D9\"></path>\n<path d=\"M137.9 246.4L147.1 233C149.1 230.1 153.7 231.3 154 234.9L155.3 251.1L168.7 260.3C171.6 262.3 170.4 266.9 166.8 267.2L150.6 268.5L141.4 281.9C139.4 284.8 134.8 283.6 134.5 280L133.2 263.8L119.8 254.6C116.9 252.6 118.1 248 121.7 247.7L137.9 246.4Z\" fill=\"#D9D9D9\"></path>\n<path d=\"M67.7 349.9L69.3 330C69.7 325.6 75.3 324.1 77.8 327.7L89.1 344.1L109 345.7C113.4 346.1 114.9 351.7 111.3 354.2L94.9 365.5L93.3 385.4C92.9 389.8 87.3 391.3 84.8 387.7L73.5 371.3L53.6 369.7C49.2 369.3 47.7 363.7 51.3 361.2L67.7 349.9Z\" fill=\"#D9D9D9\"></path>\n<path d=\"M132.8 334.6L134.1 318.4C134.4 314.8 139 313.6 141 316.5L150.2 329.9L166.4 331.2C170 331.5 171.2 336.1 168.3 338.1L154.9 347.3L153.6 363.5C153.3 367.1 148.7 368.3 146.7 365.4L137.5 352L121.3 350.7C117.7 350.4 116.5 345.8 119.4 343.8L132.8 334.6Z\" fill=\"#D9D9D9\"></path>\n<path d=\"M123.8 459.4L115.2 441.4C113.3 437.4 117.5 433.3 121.4 435.2L139.4 443.8L157.4 435.2C161.4 433.3 165.5 437.5 163.6 441.4L155 459.4L163.6 477.4C165.5 481.4 161.3 485.5 157.4 483.6L139.4 475L121.4 483.6C117.4 485.5 113.3 481.3 115.2 477.4L123.8 459.4Z\" fill=\"#D9D9D9\"></path>\n<path d=\"M172.5 413.6L165.5 398.9C164 395.7 167.3 392.3 170.6 393.8L185.3 400.8L200 393.8C203.2 392.3 206.6 395.6 205.1 398.9L198.1 413.6L205.1 428.3C206.6 431.5 203.3 434.9 200 433.4L185.3 426.4L170.6 433.4C167.4 434.9 164 431.6 165.5 428.3L172.5 413.6Z\" fill=\"#D9D9D9\"></path>\n<path d=\"M227.1 526.1L210.7 514.8C207.1 512.3 208.6 506.6 213 506.3L232.9 504.7L244.2 488.3C246.7 484.7 252.4 486.2 252.7 490.6L254.3 510.5L270.7 521.8C274.3 524.3 272.8 530 268.4 530.3L248.5 531.9L237.2 548.3C234.7 551.9 229 550.4 228.7 546L227.1 526.1Z\" fill=\"#D9D9D9\"></path>\n<path d=\"M246.4 462.1L233 452.9C230.1 450.9 231.3 446.3 234.9 446L251.1 444.7L260.3 431.3C262.3 428.4 266.9 429.6 267.2 433.2L268.5 449.4L281.9 458.6C284.8 460.6 283.6 465.2 280 465.5L263.8 466.8L254.6 480.2C252.6 483.1 248 481.9 247.7 478.3L246.4 462.1Z\" fill=\"#D9D9D9\"></path>\n<path d=\"M349.9 532.3L330 530.7C325.6 530.3 324.1 524.7 327.7 522.2L344.1 510.9L345.7 491C346.1 486.6 351.7 485.1 354.2 488.7L365.5 505.1L385.4 506.7C389.8 507.1 391.3 512.7 387.7 515.2L371.3 526.5L369.7 546.4C369.3 550.8 363.7 552.3 361.2 548.7L349.9 532.3Z\" fill=\"#D9D9D9\"></path>\n<path d=\"M334.6 467.2L318.4 465.9C314.8 465.6 313.6 461 316.5 459L329.9 449.8L331.2 433.6C331.5 430 336.1 428.8 338.1 431.7L347.3 445.1L363.5 446.4C367.1 446.7 368.3 451.3 365.4 453.3L352 462.5L350.7 478.7C350.4 482.3 345.8 483.5 343.8 480.6L334.6 467.2Z\" fill=\"#D9D9D9\"></path>\n<path d=\"M459.4 476.2L441.4 484.8C437.4 486.7 433.3 482.5 435.2 478.6L443.8 460.6L435.2 442.6C433.3 438.6 437.5 434.5 441.4 436.4L459.4 445L477.4 436.4C481.4 434.5 485.5 438.7 483.6 442.6L475 460.6L483.6 478.6C485.5 482.6 481.3 486.7 477.4 484.8L459.4 476.2Z\" fill=\"#D9D9D9\"></path>\n<path d=\"M413.6 427.5L398.9 434.5C395.7 436 392.3 432.7 393.8 429.4L400.8 414.7L393.8 400C392.3 396.8 395.6 393.4 398.9 394.9L413.6 401.9L428.3 394.9C431.5 393.4 434.9 396.7 433.4 400L426.4 414.7L433.4 429.4C434.9 432.6 431.6 436 428.3 434.5L413.6 427.5Z\" fill=\"#D9D9D9\"></path>\n<path d=\"M526.1 372.9L514.8 389.3C512.3 392.9 506.6 391.4 506.3 387L504.7 367.1L488.3 355.8C484.7 353.3 486.2 347.6 490.6 347.3L510.5 345.7L521.8 329.3C524.3 325.7 530 327.2 530.3 331.6L531.9 351.5L548.3 362.8C551.9 365.3 550.4 371 546 371.3L526.1 372.9Z\" fill=\"#D9D9D9\"></path>\n<path d=\"M462.1 353.6L452.9 367C450.9 369.9 446.3 368.7 446 365.1L444.7 348.9L431.3 339.7C428.4 337.7 429.6 333.1 433.2 332.8L449.4 331.5L458.6 318.1C460.6 315.2 465.2 316.4 465.5 320L466.8 336.2L480.2 345.4C483.1 347.4 481.9 352 478.3 352.3L462.1 353.6Z\" fill=\"#D9D9D9\"></path>\n<path d=\"M532.3 250.1L530.7 270C530.3 274.4 524.7 275.9 522.2 272.3L510.9 255.9L491 254.3C486.6 253.9 485.1 248.3 488.7 245.8L505.1 234.5L506.7 214.6C507.1 210.2 512.7 208.7 515.2 212.3L526.5 228.7L546.4 230.3C550.8 230.7 552.3 236.3 548.7 238.8L532.3 250.1Z\" fill=\"#D9D9D9\"></path>\n<path d=\"M467.2 265.4L465.9 281.6C465.6 285.2 461 286.4 459 283.5L449.8 270.1L433.6 268.8C430 268.5 428.8 263.9 431.7 261.9L445.1 252.7L446.4 236.5C446.7 232.9 451.3 231.7 453.3 234.6L462.5 248L478.7 249.3C482.3 249.6 483.5 254.2 480.6 256.2L467.2 265.4Z\" fill=\"#D9D9D9\"></path>\n<path d=\"M476.2 140.6L484.8 158.6C486.7 162.6 482.5 166.7 478.6 164.8L460.6 156.2L442.6 164.8C438.6 166.7 434.5 162.5 436.4 158.6L445 140.6L436.4 122.6C434.5 118.6 438.7 114.5 442.6 116.4L460.6 125L478.6 116.4C482.6 114.5 486.7 118.7 484.8 122.6L476.2 140.6Z\" fill=\"#D9D9D9\"></path>\n<path d=\"M427.5 186.4L434.5 201.1C436 204.3 432.7 207.7 429.4 206.2L414.7 199.2L400 206.2C396.8 207.7 393.4 204.4 394.9 201.1L401.9 186.4L394.9 171.7C393.4 168.5 396.7 165.1 400 166.6L414.7 173.6L429.4 166.6C432.6 165.1 436 168.4 434.5 171.7L427.5 186.4Z\" fill=\"#D9D9D9\"></path>\n<path d=\"M372.9 73.8999L389.3 85.1999C392.9 87.6999 391.4 93.3999 387 93.6999L367.1 95.2999L355.8 111.7C353.3 115.3 347.6 113.8 347.3 109.4L345.7 89.4999L329.3 78.1999C325.7 75.6999 327.2 69.9999 331.6 69.6999L351.5 68.0999L362.8 51.6999C365.3 48.0999 371 49.5999 371.3 53.9999L372.9 73.8999Z\" fill=\"#D9D9D9\"></path>\n<path d=\"M353.6 137.9L367 147.1C369.9 149.1 368.7 153.7 365.1 154L348.9 155.3L339.7 168.7C337.7 171.6 333.1 170.4 332.8 166.8L331.5 150.6L318.1 141.4C315.2 139.4 316.4 134.8 320 134.5L336.2 133.2L345.4 119.8C347.4 116.9 352 118.1 352.3 121.7L353.6 137.9Z\" fill=\"#D9D9D9\"></path>\n<path d=\"M250.1 67.6999L270 69.2999C274.4 69.6999 275.9 75.2999 272.3 77.7999L255.9 89.0999L254.3 109C253.9 113.4 248.3 114.9 245.8 111.3L234.5 94.8999L214.6 93.2999C210.2 92.8999 208.7 87.2999 212.3 84.7999L228.7 73.4999L230.3 53.5999C230.7 49.1999 236.3 47.6999 238.8 51.2999L250.1 67.6999Z\" stroke=\"black\" stroke-width=\"0.3439\" stroke-miterlimit=\"10\"></path>\n<path d=\"M265.4 132.8L281.6 134.1C285.2 134.4 286.4 139 283.5 141L270.1 150.2L268.8 166.4C268.5 170 263.9 171.2 261.9 168.3L252.7 154.9L236.5 153.6C232.9 153.3 231.7 148.7 234.6 146.7L248 137.5L249.3 121.3C249.6 117.7 254.2 116.5 256.2 119.4L265.4 132.8Z\" stroke=\"black\" stroke-width=\"0.3439\" stroke-miterlimit=\"10\"></path>\n<path d=\"M140.6 123.8L158.6 115.2C162.6 113.3 166.7 117.5 164.8 121.4L156.2 139.4L164.8 157.4C166.7 161.4 162.5 165.5 158.6 163.6L140.6 155L122.6 163.6C118.6 165.5 114.5 161.3 116.4 157.4L125 139.4L116.4 121.4C114.5 117.4 118.7 113.3 122.6 115.2L140.6 123.8Z\" stroke=\"black\" stroke-width=\"0.3439\" stroke-miterlimit=\"10\"></path>\n<path d=\"M186.4 172.5L201.1 165.5C204.3 164 207.7 167.3 206.2 170.6L199.2 185.3L206.2 200C207.7 203.2 204.4 206.6 201.1 205.1L186.4 198.1L171.7 205.1C168.5 206.6 165.1 203.3 166.6 200L173.6 185.3L166.6 170.6C165.1 167.4 168.4 164 171.7 165.5L186.4 172.5Z\" stroke=\"black\" stroke-width=\"0.3439\" stroke-miterlimit=\"10\"></path>\n<path d=\"M73.9 227.1L85.2 210.7C87.7 207.1 93.4 208.6 93.7 213L95.3 232.9L111.7 244.2C115.3 246.7 113.8 252.4 109.4 252.7L89.5 254.3L78.2 270.7C75.7 274.3 70 272.8 69.7 268.4L68.1 248.5L51.7 237.2C48.1 234.7 49.6 229 54 228.7L73.9 227.1Z\" stroke=\"black\" stroke-width=\"0.3439\" stroke-miterlimit=\"10\"></path>\n<path d=\"M137.9 246.4L147.1 233C149.1 230.1 153.7 231.3 154 234.9L155.3 251.1L168.7 260.3C171.6 262.3 170.4 266.9 166.8 267.2L150.6 268.5L141.4 281.9C139.4 284.8 134.8 283.6 134.5 280L133.2 263.8L119.8 254.6C116.9 252.6 118.1 248 121.7 247.7L137.9 246.4Z\" stroke=\"black\" stroke-width=\"0.3439\" stroke-miterlimit=\"10\"></path>\n<path d=\"M67.7 349.9L69.3 330C69.7 325.6 75.3 324.1 77.8 327.7L89.1 344.1L109 345.7C113.4 346.1 114.9 351.7 111.3 354.2L94.9 365.5L93.3 385.4C92.9 389.8 87.3 391.3 84.8 387.7L73.5 371.3L53.6 369.7C49.2 369.3 47.7 363.7 51.3 361.2L67.7 349.9Z\" stroke=\"black\" stroke-width=\"0.3439\" stroke-miterlimit=\"10\"></path>\n<path d=\"M132.8 334.6L134.1 318.4C134.4 314.8 139 313.6 141 316.5L150.2 329.9L166.4 331.2C170 331.5 171.2 336.1 168.3 338.1L154.9 347.3L153.6 363.5C153.3 367.1 148.7 368.3 146.7 365.4L137.5 352L121.3 350.7C117.7 350.4 116.5 345.8 119.4 343.8L132.8 334.6Z\" stroke=\"black\" stroke-width=\"0.3439\" stroke-miterlimit=\"10\"></path>\n<path d=\"M123.8 459.4L115.2 441.4C113.3 437.4 117.5 433.3 121.4 435.2L139.4 443.8L157.4 435.2C161.4 433.3 165.5 437.5 163.6 441.4L155 459.4L163.6 477.4C165.5 481.4 161.3 485.5 157.4 483.6L139.4 475L121.4 483.6C117.4 485.5 113.3 481.3 115.2 477.4L123.8 459.4Z\" stroke=\"black\" stroke-width=\"0.3439\" stroke-miterlimit=\"10\"></path>\n<path d=\"M172.5 413.6L165.5 398.9C164 395.7 167.3 392.3 170.6 393.8L185.3 400.8L200 393.8C203.2 392.3 206.6 395.6 205.1 398.9L198.1 413.6L205.1 428.3C206.6 431.5 203.3 434.9 200 433.4L185.3 426.4L170.6 433.4C167.4 434.9 164 431.6 165.5 428.3L172.5 413.6Z\" stroke=\"black\" stroke-width=\"0.3439\" stroke-miterlimit=\"10\"></path>\n<path d=\"M227.1 526.1L210.7 514.8C207.1 512.3 208.6 506.6 213 506.3L232.9 504.7L244.2 488.3C246.7 484.7 252.4 486.2 252.7 490.6L254.3 510.5L270.7 521.8C274.3 524.3 272.8 530 268.4 530.3L248.5 531.9L237.2 548.3C234.7 551.9 229 550.4 228.7 546L227.1 526.1Z\" stroke=\"black\" stroke-width=\"0.3439\" stroke-miterlimit=\"10\"></path>\n<path d=\"M246.4 462.1L233 452.9C230.1 450.9 231.3 446.3 234.9 446L251.1 444.7L260.3 431.3C262.3 428.4 266.9 429.6 267.2 433.2L268.5 449.4L281.9 458.6C284.8 460.6 283.6 465.2 280 465.5L263.8 466.8L254.6 480.2C252.6 483.1 248 481.9 247.7 478.3L246.4 462.1Z\" stroke=\"black\" stroke-width=\"0.3439\" stroke-miterlimit=\"10\"></path>\n<path d=\"M349.9 532.3L330 530.7C325.6 530.3 324.1 524.7 327.7 522.2L344.1 510.9L345.7 491C346.1 486.6 351.7 485.1 354.2 488.7L365.5 505.1L385.4 506.7C389.8 507.1 391.3 512.7 387.7 515.2L371.3 526.5L369.7 546.4C369.3 550.8 363.7 552.3 361.2 548.7L349.9 532.3Z\" stroke=\"black\" stroke-width=\"0.3439\" stroke-miterlimit=\"10\"></path>\n<path d=\"M334.6 467.2L318.4 465.9C314.8 465.6 313.6 461 316.5 459L329.9 449.8L331.2 433.6C331.5 430 336.1 428.8 338.1 431.7L347.3 445.1L363.5 446.4C367.1 446.7 368.3 451.3 365.4 453.3L352 462.5L350.7 478.7C350.4 482.3 345.8 483.5 343.8 480.6L334.6 467.2Z\" stroke=\"black\" stroke-width=\"0.3439\" stroke-miterlimit=\"10\"></path>\n<path d=\"M459.4 476.2L441.4 484.8C437.4 486.7 433.3 482.5 435.2 478.6L443.8 460.6L435.2 442.6C433.3 438.6 437.5 434.5 441.4 436.4L459.4 445L477.4 436.4C481.4 434.5 485.5 438.7 483.6 442.6L475 460.6L483.6 478.6C485.5 482.6 481.3 486.7 477.4 484.8L459.4 476.2Z\" stroke=\"black\" stroke-width=\"0.3439\" stroke-miterlimit=\"10\"></path>\n<path d=\"M413.6 427.5L398.9 434.5C395.7 436 392.3 432.7 393.8 429.4L400.8 414.7L393.8 400C392.3 396.8 395.6 393.4 398.9 394.9L413.6 401.9L428.3 394.9C431.5 393.4 434.9 396.7 433.4 400L426.4 414.7L433.4 429.4C434.9 432.6 431.6 436 428.3 434.5L413.6 427.5Z\" stroke=\"black\" stroke-width=\"0.3439\" stroke-miterlimit=\"10\"></path>\n<path d=\"M526.1 372.9L514.8 389.3C512.3 392.9 506.6 391.4 506.3 387L504.7 367.1L488.3 355.8C484.7 353.3 486.2 347.6 490.6 347.3L510.5 345.7L521.8 329.3C524.3 325.7 530 327.2 530.3 331.6L531.9 351.5L548.3 362.8C551.9 365.3 550.4 371 546 371.3L526.1 372.9Z\" stroke=\"black\" stroke-width=\"0.3439\" stroke-miterlimit=\"10\"></path>\n<path d=\"M462.1 353.6L452.9 367C450.9 369.9 446.3 368.7 446 365.1L444.7 348.9L431.3 339.7C428.4 337.7 429.6 333.1 433.2 332.8L449.4 331.5L458.6 318.1C460.6 315.2 465.2 316.4 465.5 320L466.8 336.2L480.2 345.4C483.1 347.4 481.9 352 478.3 352.3L462.1 353.6Z\" stroke=\"black\" stroke-width=\"0.3439\" stroke-miterlimit=\"10\"></path>\n<path d=\"M532.3 250.1L530.7 270C530.3 274.4 524.7 275.9 522.2 272.3L510.9 255.9L491 254.3C486.6 253.9 485.1 248.3 488.7 245.8L505.1 234.5L506.7 214.6C507.1 210.2 512.7 208.7 515.2 212.3L526.5 228.7L546.4 230.3C550.8 230.7 552.3 236.3 548.7 238.8L532.3 250.1Z\" stroke=\"black\" stroke-width=\"0.3439\" stroke-miterlimit=\"10\"></path>\n<path d=\"M467.2 265.4L465.9 281.6C465.6 285.2 461 286.4 459 283.5L449.8 270.1L433.6 268.8C430 268.5 428.8 263.9 431.7 261.9L445.1 252.7L446.4 236.5C446.7 232.9 451.3 231.7 453.3 234.6L462.5 248L478.7 249.3C482.3 249.6 483.5 254.2 480.6 256.2L467.2 265.4Z\" stroke=\"black\" stroke-width=\"0.3439\" stroke-miterlimit=\"10\"></path>\n<path d=\"M476.2 140.6L484.8 158.6C486.7 162.6 482.5 166.7 478.6 164.8L460.6 156.2L442.6 164.8C438.6 166.7 434.5 162.5 436.4 158.6L445 140.6L436.4 122.6C434.5 118.6 438.7 114.5 442.6 116.4L460.6 125L478.6 116.4C482.6 114.5 486.7 118.7 484.8 122.6L476.2 140.6Z\" stroke=\"black\" stroke-width=\"0.3439\" stroke-miterlimit=\"10\"></path>\n<path d=\"M427.5 186.4L434.5 201.1C436 204.3 432.7 207.7 429.4 206.2L414.7 199.2L400 206.2C396.8 207.7 393.4 204.4 394.9 201.1L401.9 186.4L394.9 171.7C393.4 168.5 396.7 165.1 400 166.6L414.7 173.6L429.4 166.6C432.6 165.1 436 168.4 434.5 171.7L427.5 186.4Z\" stroke=\"black\" stroke-width=\"0.3439\" stroke-miterlimit=\"10\"></path>\n<path d=\"M372.9 73.8999L389.3 85.1999C392.9 87.6999 391.4 93.3999 387 93.6999L367.1 95.2999L355.8 111.7C353.3 115.3 347.6 113.8 347.3 109.4L345.7 89.4999L329.3 78.1999C325.7 75.6999 327.2 69.9999 331.6 69.6999L351.5 68.0999L362.8 51.6999C365.3 48.0999 371 49.5999 371.3 53.9999L372.9 73.8999Z\" stroke=\"black\" stroke-width=\"0.3439\" stroke-miterlimit=\"10\"></path>\n<path d=\"M353.6 137.9L367 147.1C369.9 149.1 368.7 153.7 365.1 154L348.9 155.3L339.7 168.7C337.7 171.6 333.1 170.4 332.8 166.8L331.5 150.6L318.1 141.4C315.2 139.4 316.4 134.8 320 134.5L336.2 133.2L345.4 119.8C347.4 116.9 352 118.1 352.3 121.7L353.6 137.9Z\" stroke=\"black\" stroke-width=\"0.3439\" stroke-miterlimit=\"10\"></path>\n</svg>\n";


var $75738f56e414472f$exports = {};
$75738f56e414472f$exports = "<svg width=\"600\" height=\"600\" viewBox=\"0 0 600 600\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<path d=\"M300 242.7L446.3 128.9C462.5 118.5 481.5 137.5 471.1 153.7L357.3 300L471.1 446.3C481.5 462.5 462.5 481.5 446.3 471.1L300 357.3L153.7 471.1C137.5 481.5 118.5 462.5 128.9 446.3L242.7 300L128.9 153.7C118.5 137.5 137.5 118.5 153.7 128.9L300 242.7Z\" fill=\"#D9D9D9\"></path>\n<path d=\"M327.4 118.9C327.4 107.1 320 97.1001 309.6 93.2001C320 89.3001 327.4 79.3001 327.4 67.5001C327.4 52.4001 315.1 40.1001 300 40.1001C284.9 40.1001 272.6 52.4001 272.6 67.5001C272.6 79.3001 280 89.3001 290.4 93.2001C280 97.1001 272.6 107.1 272.6 118.9C272.6 130.7 280 140.7 290.4 144.6C280 148.5 272.6 158.5 272.6 170.3C272.6 185.4 284.9 197.7 300 197.7C315.1 197.7 327.4 185.4 327.4 170.3C327.4 158.5 320 148.5 309.6 144.6C320 140.6 327.4 130.6 327.4 118.9ZM286.9 85.2001L291.8 70.2001L279 60.9001C278.8 60.8001 278.9 60.5001 279.1 60.5001H294.9L299.8 45.5001C299.9 45.3001 300.1 45.3001 300.2 45.5001L305.1 60.5001H320.9C321.1 60.5001 321.2 60.7001 321 60.9001L308.2 70.2001L313.1 85.2001C313.2 85.4001 313 85.5001 312.8 85.4001L300 76.1001L287.2 85.4001C287.1 85.5001 286.9 85.4001 286.9 85.2001ZM313.2 165.2L305.1 171.1L308.2 180.6C308.2 180.7 308.1 180.8 308 180.7L299.9 174.8L291.8 180.7C291.7 180.8 291.6 180.7 291.6 180.6L294.7 171.1L286.6 165.2C286.5 165.1 286.6 165 286.7 165H296.7L299.8 155.5C299.8 155.4 300 155.4 300 155.5L303.1 165H313.1C313.3 165 313.3 165.2 313.2 165.2ZM316.5 113.2L306.5 120.5L310.3 132.3C310.3 132.4 310.2 132.6 310.1 132.5L300.1 125.2L290.1 132.5C290 132.6 289.8 132.5 289.9 132.3L293.7 120.5L283.7 113.2C283.6 113.1 283.6 112.9 283.8 112.9H296L299.8 101.1C299.8 101 300 101 300.1 101.1L303.9 112.9H316.3C316.5 112.9 316.6 113.1 316.5 113.2Z\" fill=\"#D9D9D9\"></path>\n<path d=\"M118.9 272.6C107.1 272.6 97.1 280 93.2 290.4C89.3 280 79.3 272.6 67.5 272.6C52.4 272.6 40.1 284.9 40.1 300C40.1 315.1 52.4 327.4 67.5 327.4C79.3 327.4 89.3 320 93.2 309.6C97.1 320 107.1 327.4 118.9 327.4C130.7 327.4 140.7 320 144.6 309.6C148.5 320 158.5 327.4 170.3 327.4C185.4 327.4 197.7 315.1 197.7 300C197.7 284.9 185.4 272.6 170.3 272.6C158.5 272.6 148.5 280 144.6 290.4C140.6 280 130.6 272.6 118.9 272.6ZM85.2 313.1L70.2 308.2L60.9 321C60.8 321.2 60.5 321.1 60.5 320.9V305.1L45.5 300.2C45.3 300.1 45.3 299.9 45.5 299.8L60.5 294.9V279.1C60.5 278.9 60.7 278.8 60.9 279L70.2 291.8L85.2 286.9C85.4 286.8 85.5 287 85.4 287.2L76.1 300L85.4 312.8C85.5 312.9 85.4 313.1 85.2 313.1ZM165.2 286.8L171.1 294.9L180.6 291.8C180.7 291.8 180.8 291.9 180.7 292L174.8 300.1L180.7 308.2C180.8 308.3 180.7 308.4 180.6 308.4L171.1 305.3L165.2 313.4C165.1 313.5 165 313.4 165 313.3V303.3L155.5 300.2C155.4 300.2 155.4 300 155.5 300L165 296.9V286.9C165 286.7 165.2 286.7 165.2 286.8ZM113.2 283.5L120.5 293.5L132.3 289.7C132.4 289.7 132.6 289.8 132.5 289.9L125.2 299.9L132.5 309.9C132.6 310 132.5 310.2 132.3 310.1L120.5 306.3L113.2 316.3C113.1 316.4 112.9 316.4 112.9 316.2V304L101.1 300.2C101 300.2 101 300 101.1 299.9L112.9 296.1V283.7C112.9 283.5 113.1 283.4 113.2 283.5Z\" fill=\"#D9D9D9\"></path>\n<path d=\"M272.6 481.1C272.6 492.9 280 502.9 290.4 506.8C280 510.7 272.6 520.7 272.6 532.5C272.6 547.6 284.9 559.9 300 559.9C315.1 559.9 327.4 547.6 327.4 532.5C327.4 520.7 320 510.7 309.6 506.8C320 502.9 327.4 492.9 327.4 481.1C327.4 469.3 320 459.3 309.6 455.4C320 451.5 327.4 441.5 327.4 429.7C327.4 414.6 315.1 402.3 300 402.3C284.9 402.3 272.6 414.6 272.6 429.7C272.6 441.5 280 451.5 290.4 455.4C280 459.4 272.6 469.4 272.6 481.1ZM313.1 514.8L308.2 529.8L321 539.1C321.2 539.2 321.1 539.5 320.9 539.5H305.1L300.2 554.5C300.1 554.7 299.9 554.7 299.8 554.5L294.9 539.5H279.1C278.9 539.5 278.8 539.3 279 539.1L291.8 529.8L286.9 514.8C286.8 514.6 287 514.5 287.2 514.6L300 523.9L312.8 514.6C312.9 514.5 313.1 514.6 313.1 514.8ZM286.8 434.8L294.9 428.9L291.8 419.4C291.8 419.3 291.9 419.2 292 419.3L300.1 425.2L308.2 419.3C308.3 419.2 308.4 419.3 308.4 419.4L305.3 428.9L313.4 434.8C313.5 434.9 313.4 435 313.3 435H303.3L300.2 444.5C300.2 444.6 300 444.6 300 444.5L296.9 435H286.9C286.7 435 286.7 434.8 286.8 434.8ZM283.5 486.8L293.5 479.5L289.7 467.7C289.7 467.6 289.8 467.4 289.9 467.5L299.9 474.8L309.9 467.5C310 467.4 310.2 467.5 310.1 467.7L306.3 479.5L316.3 486.8C316.4 486.9 316.4 487.1 316.2 487.1H304L300.2 498.9C300.2 499 300 499 299.9 498.9L296.1 487.1H283.7C283.5 487.1 283.4 486.9 283.5 486.8Z\" fill=\"#D9D9D9\"></path>\n<path d=\"M481.1 327.4C492.9 327.4 502.9 320 506.8 309.6C510.7 320 520.7 327.4 532.5 327.4C547.6 327.4 559.9 315.1 559.9 300C559.9 284.9 547.6 272.6 532.5 272.6C520.7 272.6 510.7 280 506.8 290.4C502.9 280 492.9 272.6 481.1 272.6C469.3 272.6 459.3 280 455.4 290.4C451.5 280 441.5 272.6 429.7 272.6C414.6 272.6 402.3 284.9 402.3 300C402.3 315.1 414.6 327.4 429.7 327.4C441.5 327.4 451.5 320 455.4 309.6C459.4 320 469.4 327.4 481.1 327.4ZM514.8 286.9L529.8 291.8L539.1 279C539.2 278.8 539.5 278.9 539.5 279.1V294.9L554.5 299.8C554.7 299.9 554.7 300.1 554.5 300.2L539.5 305.1V320.9C539.5 321.1 539.3 321.2 539.1 321L529.8 308.2L514.8 313.1C514.6 313.2 514.5 313 514.6 312.8L523.9 300L514.6 287.2C514.5 287.1 514.6 286.9 514.8 286.9ZM434.8 313.2L428.9 305.1L419.4 308.2C419.3 308.2 419.2 308.1 419.3 308L425.2 299.9L419.3 291.8C419.2 291.7 419.3 291.6 419.4 291.6L428.9 294.7L434.8 286.6C434.9 286.5 435 286.6 435 286.7V296.7L444.5 299.8C444.6 299.8 444.6 300 444.5 300L435 303.1V313.1C435 313.3 434.8 313.3 434.8 313.2ZM486.8 316.5L479.5 306.5L467.7 310.3C467.6 310.3 467.4 310.2 467.5 310.1L474.8 300.1L467.5 290.1C467.4 290 467.5 289.8 467.7 289.9L479.5 293.7L486.8 283.7C486.9 283.6 487.1 283.6 487.1 283.8V296L498.9 299.8C499 299.8 499 300 498.9 300.1L487.1 303.9V316.3C487.1 316.5 486.9 316.6 486.8 316.5Z\" fill=\"#D9D9D9\"></path>\n<path d=\"M300 242.7L446.3 128.9C462.5 118.5 481.5 137.5 471.1 153.7L357.3 300L471.1 446.3C481.5 462.5 462.5 481.5 446.3 471.1L300 357.3L153.7 471.1C137.5 481.5 118.5 462.5 128.9 446.3L242.7 300L128.9 153.7C118.5 137.5 137.5 118.5 153.7 128.9L300 242.7Z\" stroke=\"black\" stroke-width=\"0.5\" stroke-miterlimit=\"10\"></path>\n<path d=\"M327.4 118.9C327.4 107.1 320 97.1001 309.6 93.2001C320 89.3001 327.4 79.3001 327.4 67.5001C327.4 52.4001 315.1 40.1001 300 40.1001C284.9 40.1001 272.6 52.4001 272.6 67.5001C272.6 79.3001 280 89.3001 290.4 93.2001C280 97.1001 272.6 107.1 272.6 118.9C272.6 130.7 280 140.7 290.4 144.6C280 148.5 272.6 158.5 272.6 170.3C272.6 185.4 284.9 197.7 300 197.7C315.1 197.7 327.4 185.4 327.4 170.3C327.4 158.5 320 148.5 309.6 144.6C320 140.6 327.4 130.6 327.4 118.9ZM286.9 85.2001L291.8 70.2001L279 60.9001C278.8 60.8001 278.9 60.5001 279.1 60.5001H294.9L299.8 45.5001C299.9 45.3001 300.1 45.3001 300.2 45.5001L305.1 60.5001H320.9C321.1 60.5001 321.2 60.7001 321 60.9001L308.2 70.2001L313.1 85.2001C313.2 85.4001 313 85.5001 312.8 85.4001L300 76.1001L287.2 85.4001C287.1 85.5001 286.9 85.4001 286.9 85.2001ZM313.2 165.2L305.1 171.1L308.2 180.6C308.2 180.7 308.1 180.8 308 180.7L299.9 174.8L291.8 180.7C291.7 180.8 291.6 180.7 291.6 180.6L294.7 171.1L286.6 165.2C286.5 165.1 286.6 165 286.7 165H296.7L299.8 155.5C299.8 155.4 300 155.4 300 155.5L303.1 165H313.1C313.3 165 313.3 165.2 313.2 165.2ZM316.5 113.2L306.5 120.5L310.3 132.3C310.3 132.4 310.2 132.6 310.1 132.5L300.1 125.2L290.1 132.5C290 132.6 289.8 132.5 289.9 132.3L293.7 120.5L283.7 113.2C283.6 113.1 283.6 112.9 283.8 112.9H296L299.8 101.1C299.8 101 300 101 300.1 101.1L303.9 112.9H316.3C316.5 112.9 316.6 113.1 316.5 113.2Z\" stroke=\"black\" stroke-width=\"0.5\" stroke-miterlimit=\"10\"></path>\n<path d=\"M118.9 272.6C107.1 272.6 97.1 280 93.2 290.4C89.3 280 79.3 272.6 67.5 272.6C52.4 272.6 40.1 284.9 40.1 300C40.1 315.1 52.4 327.4 67.5 327.4C79.3 327.4 89.3 320 93.2 309.6C97.1 320 107.1 327.4 118.9 327.4C130.7 327.4 140.7 320 144.6 309.6C148.5 320 158.5 327.4 170.3 327.4C185.4 327.4 197.7 315.1 197.7 300C197.7 284.9 185.4 272.6 170.3 272.6C158.5 272.6 148.5 280 144.6 290.4C140.6 280 130.6 272.6 118.9 272.6ZM85.2 313.1L70.2 308.2L60.9 321C60.8 321.2 60.5 321.1 60.5 320.9V305.1L45.5 300.2C45.3 300.1 45.3 299.9 45.5 299.8L60.5 294.9V279.1C60.5 278.9 60.7 278.8 60.9 279L70.2 291.8L85.2 286.9C85.4 286.8 85.5 287 85.4 287.2L76.1 300L85.4 312.8C85.5 312.9 85.4 313.1 85.2 313.1ZM165.2 286.8L171.1 294.9L180.6 291.8C180.7 291.8 180.8 291.9 180.7 292L174.8 300.1L180.7 308.2C180.8 308.3 180.7 308.4 180.6 308.4L171.1 305.3L165.2 313.4C165.1 313.5 165 313.4 165 313.3V303.3L155.5 300.2C155.4 300.2 155.4 300 155.5 300L165 296.9V286.9C165 286.7 165.2 286.7 165.2 286.8ZM113.2 283.5L120.5 293.5L132.3 289.7C132.4 289.7 132.6 289.8 132.5 289.9L125.2 299.9L132.5 309.9C132.6 310 132.5 310.2 132.3 310.1L120.5 306.3L113.2 316.3C113.1 316.4 112.9 316.4 112.9 316.2V304L101.1 300.2C101 300.2 101 300 101.1 299.9L112.9 296.1V283.7C112.9 283.5 113.1 283.4 113.2 283.5Z\" stroke=\"black\" stroke-width=\"0.5\" stroke-miterlimit=\"10\"></path>\n<path d=\"M272.6 481.1C272.6 492.9 280 502.9 290.4 506.8C280 510.7 272.6 520.7 272.6 532.5C272.6 547.6 284.9 559.9 300 559.9C315.1 559.9 327.4 547.6 327.4 532.5C327.4 520.7 320 510.7 309.6 506.8C320 502.9 327.4 492.9 327.4 481.1C327.4 469.3 320 459.3 309.6 455.4C320 451.5 327.4 441.5 327.4 429.7C327.4 414.6 315.1 402.3 300 402.3C284.9 402.3 272.6 414.6 272.6 429.7C272.6 441.5 280 451.5 290.4 455.4C280 459.4 272.6 469.4 272.6 481.1ZM313.1 514.8L308.2 529.8L321 539.1C321.2 539.2 321.1 539.5 320.9 539.5H305.1L300.2 554.5C300.1 554.7 299.9 554.7 299.8 554.5L294.9 539.5H279.1C278.9 539.5 278.8 539.3 279 539.1L291.8 529.8L286.9 514.8C286.8 514.6 287 514.5 287.2 514.6L300 523.9L312.8 514.6C312.9 514.5 313.1 514.6 313.1 514.8ZM286.8 434.8L294.9 428.9L291.8 419.4C291.8 419.3 291.9 419.2 292 419.3L300.1 425.2L308.2 419.3C308.3 419.2 308.4 419.3 308.4 419.4L305.3 428.9L313.4 434.8C313.5 434.9 313.4 435 313.3 435H303.3L300.2 444.5C300.2 444.6 300 444.6 300 444.5L296.9 435H286.9C286.7 435 286.7 434.8 286.8 434.8ZM283.5 486.8L293.5 479.5L289.7 467.7C289.7 467.6 289.8 467.4 289.9 467.5L299.9 474.8L309.9 467.5C310 467.4 310.2 467.5 310.1 467.7L306.3 479.5L316.3 486.8C316.4 486.9 316.4 487.1 316.2 487.1H304L300.2 498.9C300.2 499 300 499 299.9 498.9L296.1 487.1H283.7C283.5 487.1 283.4 486.9 283.5 486.8Z\" stroke=\"black\" stroke-width=\"0.5\" stroke-miterlimit=\"10\"></path>\n<path d=\"M481.1 327.4C492.9 327.4 502.9 320 506.8 309.6C510.7 320 520.7 327.4 532.5 327.4C547.6 327.4 559.9 315.1 559.9 300C559.9 284.9 547.6 272.6 532.5 272.6C520.7 272.6 510.7 280 506.8 290.4C502.9 280 492.9 272.6 481.1 272.6C469.3 272.6 459.3 280 455.4 290.4C451.5 280 441.5 272.6 429.7 272.6C414.6 272.6 402.3 284.9 402.3 300C402.3 315.1 414.6 327.4 429.7 327.4C441.5 327.4 451.5 320 455.4 309.6C459.4 320 469.4 327.4 481.1 327.4ZM514.8 286.9L529.8 291.8L539.1 279C539.2 278.8 539.5 278.9 539.5 279.1V294.9L554.5 299.8C554.7 299.9 554.7 300.1 554.5 300.2L539.5 305.1V320.9C539.5 321.1 539.3 321.2 539.1 321L529.8 308.2L514.8 313.1C514.6 313.2 514.5 313 514.6 312.8L523.9 300L514.6 287.2C514.5 287.1 514.6 286.9 514.8 286.9ZM434.8 313.2L428.9 305.1L419.4 308.2C419.3 308.2 419.2 308.1 419.3 308L425.2 299.9L419.3 291.8C419.2 291.7 419.3 291.6 419.4 291.6L428.9 294.7L434.8 286.6C434.9 286.5 435 286.6 435 286.7V296.7L444.5 299.8C444.6 299.8 444.6 300 444.5 300L435 303.1V313.1C435 313.3 434.8 313.3 434.8 313.2ZM486.8 316.5L479.5 306.5L467.7 310.3C467.6 310.3 467.4 310.2 467.5 310.1L474.8 300.1L467.5 290.1C467.4 290 467.5 289.8 467.7 289.9L479.5 293.7L486.8 283.7C486.9 283.6 487.1 283.6 487.1 283.8V296L498.9 299.8C499 299.8 499 300 498.9 300.1L487.1 303.9V316.3C487.1 316.5 486.9 316.6 486.8 316.5Z\" stroke=\"black\" stroke-width=\"0.5\" stroke-miterlimit=\"10\"></path>\n</svg>\n";


var $d775b5e6c3ea5c01$exports = {};
$d775b5e6c3ea5c01$exports = "<svg width=\"600\" height=\"600\" viewBox=\"0 0 600 600\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<path d=\"M499.911 260.114C492.775 247.031 482.529 236.602 470.636 229.284C480.608 186.836 455.541 142.924 413.185 130.482C398.822 126.274 384.276 126.091 370.645 129.293C347.683 92.2423 298.923 78.8858 260.134 100.11C247.052 107.245 236.623 117.492 229.304 129.384C186.856 119.413 142.944 144.479 130.502 186.836C126.294 201.198 126.111 215.744 129.313 229.375C92.2625 252.337 78.906 301.098 100.13 339.887C107.266 352.969 117.512 363.398 129.405 370.716C119.433 413.165 144.499 457.076 186.856 469.518C201.219 473.726 215.765 473.909 229.395 470.707C252.358 507.758 301.118 521.115 339.907 499.89C352.989 492.755 363.418 482.509 370.737 470.616C413.185 480.588 457.097 455.521 469.538 413.165C473.746 398.802 473.929 384.256 470.728 370.625C507.778 347.663 521.043 298.902 499.911 260.114ZM465.33 355.073C462.677 349.309 459.384 343.912 455.541 338.88C454.352 337.325 451.882 338.606 452.522 340.436C454.992 348.212 456.365 356.445 456.548 364.77C450.693 370.259 444.014 375.108 436.604 379.041H436.513C434.775 379.956 435.598 382.518 437.519 382.335C443.74 381.511 449.869 380.048 455.907 377.761C455.267 382.975 454.169 388.19 452.522 393.404C441.727 428.076 411.812 451.587 377.872 455.704C380.068 449.758 381.623 443.628 382.446 437.316C382.721 435.395 380.068 434.572 379.153 436.31C375.311 443.537 370.554 450.307 364.79 456.345C356.74 456.162 348.598 454.881 340.547 452.319H340.456C338.626 451.77 337.345 454.149 338.901 455.338C343.841 459.181 349.238 462.474 355.093 465.127C350.976 468.329 346.494 471.256 341.645 473.818C309.443 490.742 271.752 486.168 244.856 465.127C250.62 462.474 256.017 459.181 261.049 455.338C262.604 454.149 261.323 451.679 259.493 452.319C251.717 454.789 243.484 456.162 235.159 456.345C229.67 450.49 224.821 443.811 220.888 436.401V436.31C219.973 434.572 217.411 435.395 217.594 437.316C218.417 443.537 219.881 449.666 222.168 455.704C216.954 455.064 211.739 453.966 206.525 452.319C171.853 441.524 148.342 411.609 144.225 377.669C150.171 379.865 156.301 381.42 162.613 382.243C164.534 382.518 165.357 379.865 163.619 378.95C156.392 375.108 149.622 370.351 143.584 364.587C143.767 356.537 145.048 348.395 147.61 340.344V340.253C148.159 338.423 145.78 337.142 144.591 338.697C140.748 343.638 137.455 349.035 134.802 354.89C131.6 350.773 128.673 346.291 126.111 341.442C109.187 309.24 113.761 271.549 134.802 244.653C137.455 250.416 140.748 255.814 144.591 260.845C145.78 262.401 148.25 261.12 147.61 259.29C145.14 251.514 143.767 243.281 143.584 234.956C149.439 229.467 156.118 224.618 163.528 220.684H163.619C165.357 219.77 164.534 217.208 162.613 217.391C156.392 218.214 150.263 219.678 144.225 221.965C144.865 216.751 145.963 211.536 147.61 206.322C158.405 171.649 188.32 148.138 222.26 144.022C220.064 149.968 218.509 156.097 217.686 162.41C217.411 164.331 220.064 165.154 220.979 163.416C224.821 156.189 229.578 149.419 235.342 143.381C243.392 143.564 251.534 144.845 259.585 147.407H259.676C261.506 147.955 262.787 145.577 261.232 144.388C256.291 140.545 250.894 137.252 245.039 134.599C249.156 131.397 253.638 128.47 258.487 125.908C290.689 108.984 328.38 113.558 355.276 134.599C349.513 137.252 344.115 140.545 339.084 144.388C337.528 145.577 338.809 148.047 340.639 147.407C348.415 144.936 356.648 143.564 364.973 143.381C370.462 149.236 375.311 155.914 379.245 163.325V163.416C380.159 165.154 382.721 164.331 382.538 162.41C381.715 156.189 380.251 150.06 377.964 144.022C383.178 144.662 388.393 145.76 393.607 147.407C428.279 158.202 451.791 188.116 455.907 222.057C449.961 219.861 443.832 218.306 437.519 217.482C435.598 217.208 434.775 219.861 436.513 220.776C443.74 224.618 450.51 229.375 456.548 235.139C456.365 243.189 455.084 251.331 452.522 259.382V259.473C451.974 261.303 454.352 262.584 455.541 261.028C459.384 256.088 462.677 250.691 465.33 244.836C468.532 248.953 471.459 253.435 474.021 258.284C490.945 290.394 486.371 328.177 465.33 355.073Z\" fill=\"#D9D9D9\"></path>\n<path d=\"M211.3 67.7001L227.5 62.4001L219.2 77.2001L229.2 91.0001L212.5 87.7001L202.5 101.5L200.5 84.5001L184.3 79.3001L199.8 72.2001V55.1001L211.3 67.7001Z\" fill=\"#D9D9D9\"></path>\n<path d=\"M73 198.4L80.8 183.2L85.4 199.6L102.2 202.3L88 211.7L90.7 228.6L77.3 218L62.1 225.7L68 209.8L56 197.7L73 198.4Z\" fill=\"#D9D9D9\"></path>\n<path d=\"M67.7 388.7L62.4 372.5L77.2 380.8L91 370.8L87.7 387.5L101.5 397.5L84.5 399.5L79.3 415.7L72.2 400.2H55.1L67.7 388.7Z\" fill=\"#D9D9D9\"></path>\n<path d=\"M198.4 527L183.2 519.2L199.6 514.6L202.3 497.8L211.7 512L228.6 509.3L218 522.7L225.7 537.9L209.8 532L197.7 544L198.4 527Z\" fill=\"#D9D9D9\"></path>\n<path d=\"M388.7 532.3L372.5 537.6L380.8 522.8L370.8 509L387.5 512.3L397.5 498.5L399.5 515.5L415.7 520.7L400.2 527.8V544.9L388.7 532.3Z\" fill=\"#D9D9D9\"></path>\n<path d=\"M527 401.6L519.2 416.8L514.6 400.4L497.8 397.7L512 388.3L509.3 371.4L522.7 382L537.9 374.3L532 390.2L544 402.3L527 401.6Z\" fill=\"#D9D9D9\"></path>\n<path d=\"M532.3 211.3L537.6 227.5L522.8 219.2L509 229.2L512.3 212.5L498.5 202.5L515.5 200.5L520.7 184.3L527.8 199.8H544.9L532.3 211.3Z\" fill=\"#D9D9D9\"></path>\n<path d=\"M401.6 73.0001L416.8 80.8001L400.4 85.4001L397.7 102.2L388.3 88.0001L371.4 90.7001L382 77.3001L374.3 62.1001L390.2 68.0001L402.3 56.0001L401.6 73.0001Z\" fill=\"#D9D9D9\"></path>\n<path d=\"M499.911 260.114C492.775 247.031 482.529 236.602 470.636 229.284C480.608 186.836 455.541 142.924 413.185 130.482C398.822 126.274 384.276 126.091 370.645 129.293C347.683 92.2423 298.923 78.8858 260.134 100.11C247.052 107.245 236.623 117.492 229.304 129.384C186.856 119.413 142.944 144.479 130.502 186.836C126.294 201.198 126.111 215.744 129.313 229.375C92.2625 252.337 78.906 301.098 100.13 339.887C107.266 352.969 117.512 363.398 129.405 370.716C119.433 413.165 144.499 457.076 186.856 469.518C201.219 473.726 215.765 473.909 229.395 470.707C252.358 507.758 301.118 521.115 339.907 499.89C352.989 492.755 363.418 482.509 370.737 470.616C413.185 480.588 457.097 455.521 469.538 413.165C473.746 398.802 473.929 384.256 470.728 370.625C507.778 347.663 521.043 298.902 499.911 260.114ZM465.33 355.073C462.677 349.309 459.384 343.912 455.541 338.88C454.352 337.325 451.882 338.606 452.522 340.436C454.992 348.212 456.365 356.445 456.548 364.77C450.693 370.259 444.014 375.108 436.604 379.041H436.513C434.775 379.956 435.598 382.518 437.519 382.335C443.74 381.511 449.869 380.048 455.907 377.761C455.267 382.975 454.169 388.19 452.522 393.404C441.727 428.076 411.812 451.587 377.872 455.704C380.068 449.758 381.623 443.628 382.446 437.316C382.721 435.395 380.068 434.572 379.153 436.31C375.311 443.537 370.554 450.307 364.79 456.345C356.74 456.162 348.598 454.881 340.547 452.319H340.456C338.626 451.77 337.345 454.149 338.901 455.338C343.841 459.181 349.238 462.474 355.093 465.127C350.976 468.329 346.494 471.256 341.645 473.818C309.443 490.742 271.752 486.168 244.856 465.127C250.62 462.474 256.017 459.181 261.049 455.338C262.604 454.149 261.323 451.679 259.493 452.319C251.717 454.789 243.484 456.162 235.159 456.345C229.67 450.49 224.821 443.811 220.888 436.401V436.31C219.973 434.572 217.411 435.395 217.594 437.316C218.417 443.537 219.881 449.666 222.168 455.704C216.954 455.064 211.739 453.966 206.525 452.319C171.853 441.524 148.342 411.609 144.225 377.669C150.171 379.865 156.301 381.42 162.613 382.243C164.534 382.518 165.357 379.865 163.619 378.95C156.392 375.108 149.622 370.351 143.584 364.587C143.767 356.537 145.048 348.395 147.61 340.344V340.253C148.159 338.423 145.78 337.142 144.591 338.697C140.748 343.638 137.455 349.035 134.802 354.89C131.6 350.773 128.673 346.291 126.111 341.442C109.187 309.24 113.761 271.549 134.802 244.653C137.455 250.416 140.748 255.814 144.591 260.845C145.78 262.401 148.25 261.12 147.61 259.29C145.14 251.514 143.767 243.281 143.584 234.956C149.439 229.467 156.118 224.618 163.528 220.684H163.619C165.357 219.77 164.534 217.208 162.613 217.391C156.392 218.214 150.263 219.678 144.225 221.965C144.865 216.751 145.963 211.536 147.61 206.322C158.405 171.649 188.32 148.138 222.26 144.022C220.064 149.968 218.509 156.097 217.686 162.41C217.411 164.331 220.064 165.154 220.979 163.416C224.821 156.189 229.578 149.419 235.342 143.381C243.392 143.564 251.534 144.845 259.585 147.407H259.676C261.506 147.955 262.787 145.577 261.232 144.388C256.291 140.545 250.894 137.252 245.039 134.599C249.156 131.397 253.638 128.47 258.487 125.908C290.689 108.984 328.38 113.558 355.276 134.599C349.513 137.252 344.115 140.545 339.084 144.388C337.528 145.577 338.809 148.047 340.639 147.407C348.415 144.936 356.648 143.564 364.973 143.381C370.462 149.236 375.311 155.914 379.245 163.325V163.416C380.159 165.154 382.721 164.331 382.538 162.41C381.715 156.189 380.251 150.06 377.964 144.022C383.178 144.662 388.393 145.76 393.607 147.407C428.279 158.202 451.791 188.116 455.907 222.057C449.961 219.861 443.832 218.306 437.519 217.482C435.598 217.208 434.775 219.861 436.513 220.776C443.74 224.618 450.51 229.375 456.548 235.139C456.365 243.189 455.084 251.331 452.522 259.382V259.473C451.974 261.303 454.352 262.584 455.541 261.028C459.384 256.088 462.677 250.691 465.33 244.836C468.532 248.953 471.459 253.435 474.021 258.284C490.945 290.394 486.371 328.177 465.33 355.073Z\" stroke=\"black\" stroke-width=\"0.5\" stroke-miterlimit=\"10\"></path>\n<path d=\"M211.3 67.7001L227.5 62.4001L219.2 77.2001L229.2 91.0001L212.5 87.7001L202.5 101.5L200.5 84.5001L184.3 79.3001L199.8 72.2001V55.1001L211.3 67.7001Z\" stroke=\"black\" stroke-width=\"0.5\" stroke-miterlimit=\"10\"></path>\n<path d=\"M73 198.4L80.8 183.2L85.4 199.6L102.2 202.3L88 211.7L90.7 228.6L77.3 218L62.1 225.7L68 209.8L56 197.7L73 198.4Z\" stroke=\"black\" stroke-width=\"0.5\" stroke-miterlimit=\"10\"></path>\n<path d=\"M67.7 388.7L62.4 372.5L77.2 380.8L91 370.8L87.7 387.5L101.5 397.5L84.5 399.5L79.3 415.7L72.2 400.2H55.1L67.7 388.7Z\" stroke=\"black\" stroke-width=\"0.5\" stroke-miterlimit=\"10\"></path>\n<path d=\"M198.4 527L183.2 519.2L199.6 514.6L202.3 497.8L211.7 512L228.6 509.3L218 522.7L225.7 537.9L209.8 532L197.7 544L198.4 527Z\" stroke=\"black\" stroke-width=\"0.5\" stroke-miterlimit=\"10\"></path>\n<path d=\"M388.7 532.3L372.5 537.6L380.8 522.8L370.8 509L387.5 512.3L397.5 498.5L399.5 515.5L415.7 520.7L400.2 527.8V544.9L388.7 532.3Z\" stroke=\"black\" stroke-width=\"0.5\" stroke-miterlimit=\"10\"></path>\n<path d=\"M527 401.6L519.2 416.8L514.6 400.4L497.8 397.7L512 388.3L509.3 371.4L522.7 382L537.9 374.3L532 390.2L544 402.3L527 401.6Z\" stroke=\"black\" stroke-width=\"0.5\" stroke-miterlimit=\"10\"></path>\n<path d=\"M532.3 211.3L537.6 227.5L522.8 219.2L509 229.2L512.3 212.5L498.5 202.5L515.5 200.5L520.7 184.3L527.8 199.8H544.9L532.3 211.3Z\" stroke=\"black\" stroke-width=\"0.5\" stroke-miterlimit=\"10\"></path>\n<path d=\"M401.6 73.0001L416.8 80.8001L400.4 85.4001L397.7 102.2L388.3 88.0001L371.4 90.7001L382 77.3001L374.3 62.1001L390.2 68.0001L402.3 56.0001L401.6 73.0001Z\" stroke=\"black\" stroke-width=\"0.5\" stroke-miterlimit=\"10\"></path>\n</svg>\n";


var $3607475d23d1679f$exports = {};
$3607475d23d1679f$exports = "<svg width=\"600\" height=\"600\" viewBox=\"0 0 600 600\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<path d=\"M434.9 184.2L413.1 188.9L408.9 213.4L404.8 188.9L383 184.2L404.8 179.5L408.9 155L413.1 179.5L434.9 184.2Z\" fill=\"#D9D9D9\"></path>\n<path d=\"M437.9 147.7L400.3 134.6L374.4 164.7L387.5 127.2L357.4 101.2L394.9 114.3L420.9 84.2002L407.8 121.8L437.9 147.7Z\" fill=\"#D9D9D9\"></path>\n<path d=\"M311.2 543.9L292.3 519.1L262.9 529.3L280.7 503.7L261.8 478.9L291.7 487.9L309.5 462.3L310.1 493.5L340 502.5L310.5 512.7L311.2 543.9Z\" fill=\"#D9D9D9\"></path>\n<path d=\"M170.9 404L170.5 384.7L152.1 379.1L170.3 372.8L169.9 353.5L181.5 368.9L199.7 362.6L188.7 378.4L200.4 393.7L181.9 388.2L170.9 404Z\" fill=\"#D9D9D9\"></path>\n<path d=\"M104 350.5L108 380.8L131.9 388L107.6 393.6L101.5 423.6L97.4001 393.3L73.6001 386.1L97.9001 380.5L104 350.5Z\" fill=\"#D9D9D9\"></path>\n<path d=\"M283.1 51.5L300.5 79.3L324.8 57.2L313.9 88.2L346.3 93.4L315.3 104.2L331.4 132.8L303.7 115.3L291.3 145.7L287.7 113.1L256.2 122.5L279.5 99.3L252.6 80.5L285.2 84.2L283.1 51.5Z\" fill=\"#D9D9D9\"></path>\n<path d=\"M189.4 408.2L197.3 447.8L234.9 433.1L208.8 463.9L243.8 484.1L203.4 482.9L209.4 522.8L185.2 490.6L157.7 520.2L167.8 481.1L127.6 478.1L164.4 461.6L141.7 428.3L177.5 446.8L189.4 408.2Z\" fill=\"#D9D9D9\"></path>\n<path d=\"M500.6 168.7L487.3 193.6L514.2 202.3L486.4 207.5L496.5 233.9L475.1 215.4L460.7 239.7L461.8 211.5L433.8 215.4L456.6 198.7L436.1 179.2L463.4 186.6L465.8 158.4L477 184.4L500.6 168.7Z\" fill=\"#D9D9D9\"></path>\n<path d=\"M229.1 149L201.7 132L177 152.9L184.7 121.6L157.2 104.6L189.4 102.2L197.1 70.7998L209.3 100.7L241.5 98.2998L216.9 119.2L229.1 149Z\" fill=\"#D9D9D9\"></path>\n<path d=\"M102.7 474.4C110.708 474.4 117.2 467.908 117.2 459.9C117.2 451.892 110.708 445.4 102.7 445.4C94.6918 445.4 88.2 451.892 88.2 459.9C88.2 467.908 94.6918 474.4 102.7 474.4Z\" fill=\"#D9D9D9\"></path>\n<path d=\"M258.9 202.3C274.53 202.3 287.2 189.63 287.2 174C287.2 158.371 274.53 145.7 258.9 145.7C243.27 145.7 230.6 158.371 230.6 174C230.6 189.63 243.27 202.3 258.9 202.3Z\" fill=\"#D9D9D9\"></path>\n<path d=\"M381.3 89.0001C391.352 89.0001 399.5 80.8517 399.5 70.8001C399.5 60.7485 391.352 52.6001 381.3 52.6001C371.248 52.6001 363.1 60.7485 363.1 70.8001C363.1 80.8517 371.248 89.0001 381.3 89.0001Z\" fill=\"#D9D9D9\"></path>\n<path d=\"M269.1 464.3C282.355 464.3 293.1 453.555 293.1 440.3C293.1 427.045 282.355 416.3 269.1 416.3C255.845 416.3 245.1 427.045 245.1 440.3C245.1 453.555 255.845 464.3 269.1 464.3Z\" fill=\"#D9D9D9\"></path>\n<path d=\"M384.7 514.8C396.685 514.8 406.4 505.084 406.4 493.1C406.4 481.115 396.685 471.4 384.7 471.4C372.715 471.4 363 481.115 363 493.1C363 505.084 372.715 514.8 384.7 514.8Z\" fill=\"#D9D9D9\"></path>\n<path d=\"M434.9 184.2L413.1 188.9L408.9 213.4L404.8 188.9L383 184.2L404.8 179.5L408.9 155L413.1 179.5L434.9 184.2Z\" stroke=\"black\" stroke-width=\"0.5\" stroke-miterlimit=\"10\"></path>\n<path d=\"M437.9 147.7L400.3 134.6L374.4 164.7L387.5 127.2L357.4 101.2L394.9 114.3L420.9 84.2002L407.8 121.8L437.9 147.7Z\" stroke=\"black\" stroke-width=\"0.5\" stroke-miterlimit=\"10\"></path>\n<path d=\"M311.2 543.9L292.3 519.1L262.9 529.3L280.7 503.7L261.8 478.9L291.7 487.9L309.5 462.3L310.1 493.5L340 502.5L310.5 512.7L311.2 543.9Z\" stroke=\"black\" stroke-width=\"0.5\" stroke-miterlimit=\"10\"></path>\n<path d=\"M170.9 404L170.5 384.7L152.1 379.1L170.3 372.8L169.9 353.5L181.5 368.9L199.7 362.6L188.7 378.4L200.4 393.7L181.9 388.2L170.9 404Z\" stroke=\"black\" stroke-width=\"0.5\" stroke-miterlimit=\"10\"></path>\n<path d=\"M104 350.5L108 380.8L131.9 388L107.6 393.6L101.5 423.6L97.4001 393.3L73.6001 386.1L97.9001 380.5L104 350.5Z\" stroke=\"black\" stroke-width=\"0.5\" stroke-miterlimit=\"10\"></path>\n<path d=\"M283.1 51.5L300.5 79.3L324.8 57.2L313.9 88.2L346.3 93.4L315.3 104.2L331.4 132.8L303.7 115.3L291.3 145.7L287.7 113.1L256.2 122.5L279.5 99.3L252.6 80.5L285.2 84.2L283.1 51.5Z\" stroke=\"black\" stroke-width=\"0.5\" stroke-miterlimit=\"10\"></path>\n<path d=\"M189.4 408.2L197.3 447.8L234.9 433.1L208.8 463.9L243.8 484.1L203.4 482.9L209.4 522.8L185.2 490.6L157.7 520.2L167.8 481.1L127.6 478.1L164.4 461.6L141.7 428.3L177.5 446.8L189.4 408.2Z\" stroke=\"black\" stroke-width=\"0.5\" stroke-miterlimit=\"10\"></path>\n<path d=\"M500.6 168.7L487.3 193.6L514.2 202.3L486.4 207.5L496.5 233.9L475.1 215.4L460.7 239.7L461.8 211.5L433.8 215.4L456.6 198.7L436.1 179.2L463.4 186.6L465.8 158.4L477 184.4L500.6 168.7Z\" stroke=\"black\" stroke-width=\"0.5\" stroke-miterlimit=\"10\"></path>\n<path d=\"M229.1 149L201.7 132L177 152.9L184.7 121.6L157.2 104.6L189.4 102.2L197.1 70.7998L209.3 100.7L241.5 98.2998L216.9 119.2L229.1 149Z\" stroke=\"black\" stroke-width=\"0.5\" stroke-miterlimit=\"10\"></path>\n<path d=\"M102.7 474.4C110.708 474.4 117.2 467.908 117.2 459.9C117.2 451.892 110.708 445.4 102.7 445.4C94.6918 445.4 88.2 451.892 88.2 459.9C88.2 467.908 94.6918 474.4 102.7 474.4Z\" stroke=\"black\" stroke-width=\"0.5\" stroke-miterlimit=\"10\"></path>\n<path d=\"M258.9 202.3C274.53 202.3 287.2 189.63 287.2 174C287.2 158.371 274.53 145.7 258.9 145.7C243.27 145.7 230.6 158.371 230.6 174C230.6 189.63 243.27 202.3 258.9 202.3Z\" stroke=\"black\" stroke-width=\"0.5\" stroke-miterlimit=\"10\"></path>\n<path d=\"M381.3 89.0001C391.352 89.0001 399.5 80.8517 399.5 70.8001C399.5 60.7485 391.352 52.6001 381.3 52.6001C371.248 52.6001 363.1 60.7485 363.1 70.8001C363.1 80.8517 371.248 89.0001 381.3 89.0001Z\" stroke=\"black\" stroke-width=\"0.5\" stroke-miterlimit=\"10\"></path>\n<path d=\"M269.1 464.3C282.355 464.3 293.1 453.555 293.1 440.3C293.1 427.045 282.355 416.3 269.1 416.3C255.845 416.3 245.1 427.045 245.1 440.3C245.1 453.555 255.845 464.3 269.1 464.3Z\" stroke=\"black\" stroke-width=\"0.5\" stroke-miterlimit=\"10\"></path>\n<path d=\"M384.7 514.8C396.685 514.8 406.4 505.084 406.4 493.1C406.4 481.115 396.685 471.4 384.7 471.4C372.715 471.4 363 481.115 363 493.1C363 505.084 372.715 514.8 384.7 514.8Z\" stroke=\"black\" stroke-width=\"0.5\" stroke-miterlimit=\"10\"></path>\n</svg>\n";


var $bc6313acfb197bb4$exports = {};
$bc6313acfb197bb4$exports = "<svg width=\"600\" height=\"600\" viewBox=\"0 0 600 600\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<path d=\"M430.578 66.9826L409.281 64.7661L411.208 43.4689L396.271 58.695L380.756 43.9507L383.358 65.1516L362.157 68.0426L375.841 76.4266C345.775 80.7632 294.411 99.8439 300.578 179.444C300.578 179.444 310.022 116.997 378.154 83.1723L369.577 97.6275L389.718 90.3999L397.235 110.444L404.077 90.2072L424.411 96.7602L412.847 78.7394L430.578 66.9826Z\" fill=\"#D9D9D9\"></path>\n<path d=\"M227.628 42.891L211.053 56.3825L197.368 40L197.561 61.3936L176.168 61.8755L193.032 75.0778L180.119 92.1349L195.73 88.4729C177.613 112.854 154.678 162.676 215.293 214.522C215.293 214.522 177.806 163.64 201.994 91.6531L206.138 107.939L215.197 88.5693L234.663 97.3388L225.219 78.1616L244.3 68.4285L223.291 63.8992L227.628 42.891Z\" fill=\"#D9D9D9\"></path>\n<path d=\"M66.983 169.422L64.7666 190.719L43.4693 188.792L58.6954 203.729L43.9512 219.244L65.1521 216.642L68.0431 237.843L76.4271 224.158C80.7636 254.225 99.8444 305.589 179.444 299.422C179.444 299.422 116.998 289.978 83.1728 221.846L97.628 230.422L90.4004 210.282L110.445 202.765L90.2077 195.923L96.7607 175.589L78.7399 187.153L66.983 169.422Z\" fill=\"#D9D9D9\"></path>\n<path d=\"M42.891 372.372L56.3825 388.947L40 402.631L61.3936 402.439L61.8755 423.832L75.0778 406.968L92.1349 419.881L88.4729 404.27C112.854 422.387 162.676 445.322 214.522 384.707C214.522 384.707 163.64 422.194 91.6531 398.006L107.939 393.862L88.4729 384.803L97.2424 365.337L78.0652 374.781L68.3321 355.7L63.8992 376.708L42.891 372.372Z\" fill=\"#D9D9D9\"></path>\n<path d=\"M169.422 533.017L190.719 535.233L188.792 556.531L203.729 541.305L219.244 556.049L216.642 534.848L237.843 531.957L224.159 523.573C254.225 519.236 305.589 500.156 299.422 420.556C299.422 420.556 289.978 483.002 221.846 516.827L230.423 502.372L210.282 509.6L202.765 489.555L195.923 509.792L175.589 503.239L187.153 521.26L169.422 533.017Z\" fill=\"#D9D9D9\"></path>\n<path d=\"M372.372 557.109L388.947 543.617L402.632 560L402.439 538.606L423.833 538.125L406.968 524.922L419.882 507.865L404.27 511.527C422.387 487.146 445.323 437.324 384.707 385.478C384.707 385.478 422.194 436.36 398.006 508.347L393.862 492.061L384.804 511.431L365.337 502.661L374.781 521.838L355.701 531.572L376.612 536.101L372.372 557.109Z\" fill=\"#D9D9D9\"></path>\n<path d=\"M533.017 430.578L535.234 409.281L556.531 411.208L541.305 396.271L556.049 380.756L534.848 383.358L531.957 362.157L523.573 375.841C519.237 345.775 500.156 294.411 420.556 300.578C420.556 300.578 483.002 310.022 516.827 378.154L502.372 369.577L509.6 389.718L489.555 397.235L509.793 404.077L503.24 424.411L521.26 412.847L533.017 430.578Z\" fill=\"#D9D9D9\"></path>\n<path d=\"M557.109 227.627L543.617 211.052L560 197.368L538.606 197.561L538.125 176.167L524.922 193.031L507.865 180.118L511.527 195.73C487.146 177.613 437.324 154.677 385.478 215.292C385.478 215.292 436.36 177.805 508.347 201.994L492.061 206.137L511.431 215.196L502.661 234.662L521.838 225.218L531.572 244.299L536.101 223.387L557.109 227.627Z\" fill=\"#D9D9D9\"></path>\n<path d=\"M430.578 66.9826L409.281 64.7661L411.208 43.4689L396.271 58.695L380.756 43.9507L383.358 65.1516L362.157 68.0426L375.841 76.4266C345.775 80.7632 294.411 99.8439 300.578 179.444C300.578 179.444 310.022 116.997 378.154 83.1723L369.577 97.6275L389.718 90.3999L397.235 110.444L404.077 90.2072L424.411 96.7602L412.847 78.7394L430.578 66.9826Z\" stroke=\"#231F20\" stroke-width=\"0.5\" stroke-miterlimit=\"10\"></path>\n<path d=\"M227.628 42.891L211.053 56.3825L197.368 40L197.561 61.3936L176.168 61.8755L193.032 75.0778L180.119 92.1349L195.73 88.4729C177.613 112.854 154.678 162.676 215.293 214.522C215.293 214.522 177.806 163.64 201.994 91.6531L206.138 107.939L215.197 88.5693L234.663 97.3388L225.219 78.1616L244.3 68.4285L223.291 63.8992L227.628 42.891Z\" stroke=\"#231F20\" stroke-width=\"0.5\" stroke-miterlimit=\"10\"></path>\n<path d=\"M66.983 169.422L64.7666 190.719L43.4693 188.792L58.6954 203.729L43.9512 219.244L65.1521 216.642L68.0431 237.843L76.4271 224.158C80.7636 254.225 99.8444 305.589 179.444 299.422C179.444 299.422 116.998 289.978 83.1728 221.846L97.628 230.422L90.4004 210.282L110.445 202.765L90.2077 195.923L96.7607 175.589L78.7399 187.153L66.983 169.422Z\" stroke=\"#231F20\" stroke-width=\"0.5\" stroke-miterlimit=\"10\"></path>\n<path d=\"M42.891 372.372L56.3825 388.947L40 402.631L61.3936 402.439L61.8755 423.832L75.0778 406.968L92.1349 419.881L88.4729 404.27C112.854 422.387 162.676 445.322 214.522 384.707C214.522 384.707 163.64 422.194 91.6531 398.006L107.939 393.862L88.4729 384.803L97.2424 365.337L78.0652 374.781L68.3321 355.7L63.8992 376.708L42.891 372.372Z\" stroke=\"#231F20\" stroke-width=\"0.5\" stroke-miterlimit=\"10\"></path>\n<path d=\"M169.422 533.017L190.719 535.233L188.792 556.531L203.729 541.305L219.244 556.049L216.642 534.848L237.843 531.957L224.159 523.573C254.225 519.236 305.589 500.156 299.422 420.556C299.422 420.556 289.978 483.002 221.846 516.827L230.423 502.372L210.282 509.6L202.765 489.555L195.923 509.792L175.589 503.239L187.153 521.26L169.422 533.017Z\" stroke=\"#231F20\" stroke-width=\"0.5\" stroke-miterlimit=\"10\"></path>\n<path d=\"M372.372 557.109L388.947 543.617L402.632 560L402.439 538.606L423.833 538.125L406.968 524.922L419.882 507.865L404.27 511.527C422.387 487.146 445.323 437.324 384.707 385.478C384.707 385.478 422.194 436.36 398.006 508.347L393.862 492.061L384.804 511.431L365.337 502.661L374.781 521.838L355.701 531.572L376.612 536.101L372.372 557.109Z\" stroke=\"#231F20\" stroke-width=\"0.5\" stroke-miterlimit=\"10\"></path>\n<path d=\"M533.017 430.578L535.234 409.281L556.531 411.208L541.305 396.271L556.049 380.756L534.848 383.358L531.957 362.157L523.573 375.841C519.237 345.775 500.156 294.411 420.556 300.578C420.556 300.578 483.002 310.022 516.827 378.154L502.372 369.577L509.6 389.718L489.555 397.235L509.793 404.077L503.24 424.411L521.26 412.847L533.017 430.578Z\" stroke=\"#231F20\" stroke-width=\"0.5\" stroke-miterlimit=\"10\"></path>\n<path d=\"M557.109 227.627L543.617 211.052L560 197.368L538.606 197.561L538.125 176.167L524.922 193.031L507.865 180.118L511.527 195.73C487.146 177.613 437.324 154.677 385.478 215.292C385.478 215.292 436.36 177.805 508.347 201.994L492.061 206.137L511.431 215.196L502.661 234.662L521.838 225.218L531.572 244.299L536.101 223.387L557.109 227.627Z\" stroke=\"#231F20\" stroke-width=\"0.5\" stroke-miterlimit=\"10\"></path>\n</svg>\n";


var $31ca591cbd92cc5b$exports = {};
$31ca591cbd92cc5b$exports = "<svg width=\"600\" height=\"600\" viewBox=\"0 0 600 600\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<path d=\"M223.32 297.089C240.68 297.089 254.754 283.016 254.754 265.655C254.754 248.294 240.68 234.221 223.32 234.221C205.959 234.221 191.886 248.294 191.886 265.655C191.886 283.016 205.959 297.089 223.32 297.089Z\" fill=\"white\"></path>\n<path d=\"M374.669 297.089C392.03 297.089 406.103 283.016 406.103 265.655C406.103 248.294 392.03 234.221 374.669 234.221C357.309 234.221 343.235 248.294 343.235 265.655C343.235 283.016 357.309 297.089 374.669 297.089Z\" fill=\"white\"></path>\n<path d=\"M213.159 293.808C212.736 293.596 212.207 293.385 211.678 293.173C211.678 293.173 212.207 293.385 213.159 293.808Z\" fill=\"black\"></path>\n<path d=\"M232.634 297.195C256.553 294.549 258.882 262.056 258.882 262.056C257.612 266.184 256.13 269.889 254.542 273.17C256.553 267.56 257.717 260.786 256.13 254.224C257.4 255.706 258.776 257.294 260.046 258.987C260.046 258.987 258.458 256.024 255.495 252.002C252.637 243.641 244.805 235.808 227.871 231.046C227.871 231.046 230.623 232.21 234.221 234.538C227.236 231.998 219.086 231.787 210.196 236.761C215.17 233.268 221.415 230.305 229.247 228.082C229.247 228.082 202.999 228.506 193.367 248.403C193.685 246.287 194.108 244.487 194.426 243.111C200.141 234.962 212.101 224.695 235.174 227.976C235.174 227.976 198.13 216.44 189.875 251.896C189.875 251.896 190.721 248.932 193.05 245.122C191.039 250.203 189.981 254.859 189.451 259.093C188.393 250.732 189.24 244.276 189.24 244.276C186.488 259.728 187.864 270.735 191.462 278.462C191.78 280.049 192.203 281.742 192.732 283.436C186.7 275.18 185.747 266.184 185.747 266.184C186.065 278.673 189.981 286.188 195.061 290.739C195.167 291.162 195.273 291.374 195.273 291.374C195.167 291.162 195.167 290.95 195.061 290.739C197.813 293.173 200.882 294.655 203.846 295.607C210.09 298.994 221.309 302.804 232.634 297.195ZM208.291 294.972C207.762 294.549 207.338 294.126 206.809 293.702C210.302 295.29 213.794 296.137 217.075 296.666C213.9 296.454 210.937 295.819 208.291 294.972ZM218.557 297.089C218.769 297.089 218.98 296.983 219.086 296.983C219.298 296.983 219.51 297.089 219.827 297.089C219.404 297.089 218.98 297.089 218.557 297.089ZM245.017 243.746C252.002 251.79 257.188 263.644 250.944 279.732C248.721 283.224 246.287 285.976 243.747 288.199C244.064 287.775 244.382 287.352 244.699 287.034C244.699 287.034 242.053 290.104 236.867 292.856C226.601 297.936 216.652 295.184 213.053 293.808C214.218 294.231 215.382 294.655 216.44 295.078C207.656 292.538 201.729 287.669 197.601 281.848C194.638 276.027 193.262 269.889 192.732 264.173C194.003 256.341 197.389 248.086 204.798 241.1C213.477 235.703 227.977 231.046 245.017 243.746ZM193.473 284.494C193.262 283.436 193.05 282.378 192.838 281.213C195.484 285.976 199.083 289.257 202.999 291.691C204.586 292.961 206.068 293.914 207.232 294.549C200.988 292.326 196.543 288.516 193.473 284.494Z\" fill=\"black\"></path>\n<path d=\"M222.05 231.046C222.05 231.046 247.451 227.447 258.988 254.648C258.882 254.648 253.696 224.06 222.05 231.046Z\" fill=\"black\"></path>\n<path d=\"M261.21 254.648C261.21 254.648 264.809 292.432 231.999 299.312C231.999 299.206 269.783 300.37 261.21 254.648Z\" fill=\"black\"></path>\n<path d=\"M364.826 293.808C364.403 293.596 363.874 293.385 363.345 293.173C363.45 293.173 363.874 293.385 364.826 293.808Z\" fill=\"black\"></path>\n<path d=\"M384.406 297.195C408.326 294.549 410.654 262.056 410.654 262.056C409.384 266.184 407.903 269.889 406.315 273.17C408.326 267.56 409.49 260.786 407.903 254.224C409.173 255.706 410.549 257.294 411.819 258.987C411.819 258.987 410.231 256.024 407.268 252.002C404.41 243.641 396.578 235.808 379.644 231.046C379.644 231.046 382.396 232.21 385.994 234.538C379.009 231.998 370.859 231.787 361.969 236.761C366.943 233.268 373.188 230.305 381.02 228.082C381.02 228.082 354.772 228.506 345.14 248.403C345.458 246.287 345.881 244.487 346.199 243.111C351.914 234.962 363.874 224.695 386.947 227.976C386.947 227.976 349.903 216.44 341.648 251.896C341.648 251.896 342.494 248.932 344.823 245.122C342.812 250.203 341.753 254.859 341.224 259.093C340.166 250.732 341.013 244.276 341.013 244.276C338.261 259.728 339.637 270.735 343.235 278.462C343.553 280.049 343.976 281.742 344.505 283.436C338.472 275.18 337.52 266.184 337.52 266.184C337.837 278.673 341.753 286.188 346.834 290.739C346.94 291.162 347.045 291.374 347.045 291.374C346.94 291.162 346.94 290.95 346.834 290.739C349.586 293.173 352.655 294.655 355.618 295.607C361.863 298.994 373.082 302.804 384.406 297.195ZM360.064 294.972C359.534 294.549 359.111 294.126 358.582 293.702C362.074 295.29 365.567 296.137 368.848 296.666C365.673 296.454 362.71 295.819 360.064 294.972ZM370.33 297.089C370.542 297.089 370.753 296.983 370.859 296.983C371.071 296.983 371.282 297.089 371.6 297.089C371.177 297.089 370.753 297.089 370.33 297.089ZM396.79 243.746C403.775 251.79 408.961 263.644 402.717 279.732C400.494 283.224 398.06 285.976 395.52 288.199C395.837 287.775 396.155 287.352 396.472 287.034C396.472 287.034 393.826 290.104 388.64 292.856C378.374 297.936 368.425 295.184 364.826 293.808C365.991 294.231 367.155 294.655 368.213 295.078C359.428 292.538 353.502 287.669 349.374 281.848C346.41 276.027 345.034 269.889 344.505 264.173C345.775 256.341 349.162 248.086 356.571 241.1C365.25 235.703 379.75 231.046 396.79 243.746ZM345.14 284.494C344.929 283.436 344.717 282.378 344.505 281.213C347.151 285.976 350.75 289.257 354.666 291.691C356.253 292.961 357.735 293.914 358.899 294.549C352.761 292.326 348.315 288.516 345.14 284.494Z\" fill=\"black\"></path>\n<path d=\"M373.717 231.046C373.717 231.046 399.118 227.447 410.654 254.648C410.654 254.648 405.468 224.06 373.717 231.046Z\" fill=\"black\"></path>\n<path d=\"M412.983 254.648C412.983 254.648 416.581 292.432 383.771 299.312C383.666 299.206 421.556 300.37 412.983 254.648Z\" fill=\"black\"></path>\n<path d=\"M337.202 381.019H262.904C260.787 381.019 259.199 379.114 259.517 376.997L267.137 334.239C267.455 332.651 268.831 331.381 270.524 331.381H329.688C331.381 331.381 332.757 332.545 333.075 334.239L340.695 376.997C340.907 379.114 339.319 381.019 337.202 381.019Z\" fill=\"black\"></path>\n</svg>\n";


var $dc8b3e81fa0aa1c5$exports = {};
$dc8b3e81fa0aa1c5$exports = "<svg width=\"600\" height=\"600\" viewBox=\"0 0 600 600\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<path d=\"M248.1 332.101C246.3 333.101 245.1 334.901 245 336.901C245 337.401 245 337.901 245 338.501C245 362.401 269.6 381.801 300 381.801C330.4 381.801 355 362.401 355 338.501C355 337.801 355 337.201 354.9 336.501C354.8 334.401 353.6 332.601 351.8 331.601C305.8 306.901 266 322.201 248.1 332.101Z\" fill=\"#FF4040\"></path>\n<path d=\"M300 346.8C318.1 346.8 334.2 353.7 344.2 364.3C351 357.1 355 348.2 355 338.5C355 337.8 355 337.2 354.9 336.5C354.8 334.4 353.5 332.7 351.8 331.6C303.1 301.6 269 319.7 248 332C246.2 333 245 334.8 244.9 336.8C244.9 337.3 244.9 337.8 244.9 338.4C244.9 348.1 248.9 357 255.7 364.2C265.8 353.7 281.9 346.8 300 346.8Z\" fill=\"black\"></path>\n<path d=\"M203.6 227.5C207.7 228.2 215.6 230 223.7 234.2C224 234.4 223.9 234.9 223.5 234.8C221.9 234.6 220.4 234.5 218.7 234.6C202.9 235.1 190.8 248.6 191.6 264.4C192.4 279.3 205 291 220 290.9C235.9 290.7 248.4 277.5 247.7 261.8C247.7 261.8 247.9 224 203.5 227C203.2 226.8 203.2 227.4 203.6 227.5Z\" fill=\"black\"></path>\n<path d=\"M227.7 247.2L230.8 252.5L236.8 253.9C238 254.2 238.5 255.6 237.6 256.5L233.6 261.1L234.2 267.2C234.3 268.5 233 269.3 232 268.9L226.4 266.5L220.8 268.9C219.6 269.4 218.4 268.5 218.6 267.2L219.2 261.1L215.2 256.5C214.4 255.5 214.9 254.1 216 253.9L222 252.5L225.1 247.2C225.4 246.1 227 246.1 227.7 247.2Z\" fill=\"white\"></path>\n<path d=\"M364.1 229.099C368.2 229.799 376.1 231.599 384.2 235.799C384.5 235.999 384.4 236.499 384 236.399C382.4 236.199 380.9 236.099 379.2 236.199C363.4 236.699 351.3 250.199 352.1 265.999C352.9 280.899 365.5 292.599 380.5 292.499C396.4 292.299 408.9 279.099 408.2 263.399C408.2 263.399 408.4 225.599 364 228.599C363.8 228.499 363.7 229.099 364.1 229.099Z\" fill=\"black\"></path>\n<path d=\"M388.1 248.9L391.2 254.2L397.2 255.6C398.4 255.9 398.9 257.3 398 258.2L394 262.8L394.6 268.9C394.7 270.2 393.4 271 392.4 270.6L386.8 268.2L381.2 270.6C380 271.1 378.8 270.2 379 268.9L379.6 262.8L375.6 258.2C374.8 257.2 375.3 255.8 376.4 255.6L382.4 254.2L385.5 248.9C386 247.7 387.5 247.7 388.1 248.9Z\" fill=\"white\"></path>\n</svg>\n";


var $20b034a9e9a3f9e6$exports = {};
$20b034a9e9a3f9e6$exports = "<svg width=\"600\" height=\"600\" viewBox=\"0 0 600 600\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<path d=\"M226.072 350.961H373.928C381.655 350.961 385.253 343.552 379.432 339.636C352.972 321.855 292.856 293.914 220.78 339.53C214.747 343.447 218.24 350.961 226.072 350.961Z\" fill=\"black\"></path>\n<path d=\"M256.447 260.469C256.447 260.469 251.367 243.641 213.9 250.943C213.9 250.943 176.433 257.717 177.915 278.462C177.915 278.462 178.762 299.1 218.24 289.68C218.24 289.68 264.809 278.885 256.447 260.469Z\" fill=\"black\"></path>\n<path d=\"M220.356 258.881L221.626 262.268L225.013 263.538C227.448 264.491 227.448 267.878 225.013 268.83L221.626 270.1L220.356 273.487C219.404 275.921 216.017 275.921 215.064 273.487L213.794 270.1L210.407 268.83C207.973 267.878 207.973 264.491 210.407 263.538L213.794 262.268L215.064 258.881C216.017 256.447 219.404 256.447 220.356 258.881Z\" fill=\"white\"></path>\n<path d=\"M343.553 260.469C343.553 260.469 348.633 243.641 386.1 250.943C386.1 250.943 423.567 257.717 422.085 278.462C422.085 278.462 421.238 299.1 381.76 289.68C381.76 289.68 335.191 278.885 343.553 260.469Z\" fill=\"black\"></path>\n<path d=\"M379.644 258.881L378.374 262.268L374.987 263.538C372.552 264.491 372.552 267.878 374.987 268.83L378.374 270.1L379.644 273.487C380.596 275.921 383.983 275.921 384.936 273.487L386.206 270.1L389.593 268.83C392.027 267.878 392.027 264.491 389.593 263.538L386.206 262.268L384.936 258.881C384.089 256.447 380.596 256.447 379.644 258.881Z\" fill=\"white\"></path>\n<path d=\"M226.072 350.961H373.928C381.655 350.961 385.253 343.552 379.432 339.636C352.972 321.855 292.856 293.914 220.78 339.53C214.747 343.447 218.24 350.961 226.072 350.961Z\" stroke=\"black\" stroke-width=\"0.1479\" stroke-miterlimit=\"10\"></path>\n<path d=\"M256.447 260.469C256.447 260.469 251.367 243.641 213.9 250.943C213.9 250.943 176.433 257.717 177.915 278.462C177.915 278.462 178.762 299.1 218.24 289.68C218.24 289.68 264.809 278.885 256.447 260.469Z\" stroke=\"black\" stroke-width=\"0.1479\" stroke-miterlimit=\"10\"></path>\n<path d=\"M220.356 258.881L221.626 262.268L225.013 263.538C227.448 264.491 227.448 267.878 225.013 268.83L221.626 270.1L220.356 273.487C219.404 275.921 216.017 275.921 215.064 273.487L213.794 270.1L210.407 268.83C207.973 267.878 207.973 264.491 210.407 263.538L213.794 262.268L215.064 258.881C216.017 256.447 219.404 256.447 220.356 258.881Z\" stroke=\"black\" stroke-width=\"0.1479\" stroke-miterlimit=\"10\"></path>\n<path d=\"M343.553 260.469C343.553 260.469 348.633 243.641 386.1 250.943C386.1 250.943 423.567 257.717 422.085 278.462C422.085 278.462 421.238 299.1 381.76 289.68C381.76 289.68 335.191 278.885 343.553 260.469Z\" stroke=\"black\" stroke-width=\"0.1479\" stroke-miterlimit=\"10\"></path>\n<path d=\"M379.644 258.881L378.374 262.268L374.987 263.538C372.552 264.491 372.552 267.878 374.987 268.83L378.374 270.1L379.644 273.487C380.596 275.921 383.983 275.921 384.936 273.487L386.206 270.1L389.593 268.83C392.027 267.878 392.027 264.491 389.593 263.538L386.206 262.268L384.936 258.881C384.089 256.447 380.596 256.447 379.644 258.881Z\" stroke=\"black\" stroke-width=\"0.1479\" stroke-miterlimit=\"10\"></path>\n</svg>\n";


var $fe2f959314b6fd76$exports = {};
$fe2f959314b6fd76$exports = "<svg width=\"600\" height=\"600\" viewBox=\"0 0 600 600\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<path d=\"M302.717 418.487C319.786 418.487 333.622 397.779 333.622 372.235C333.622 346.691 319.786 325.984 302.717 325.984C285.649 325.984 271.812 346.691 271.812 372.235C271.812 397.779 285.649 418.487 302.717 418.487Z\" fill=\"black\"></path>\n<path d=\"M259.206 270.06C273.456 238.846 270.782 207.048 253.235 199.037C235.687 191.026 209.91 209.836 195.66 241.049C181.41 272.263 184.084 304.061 201.632 312.072C219.179 320.083 244.956 301.273 259.206 270.06Z\" fill=\"black\"></path>\n<path d=\"M239.531 214.747L241.754 225.649C242.601 229.882 245.353 233.587 249.269 235.597L255.619 238.878C256.36 239.302 256.36 240.36 255.619 240.784L249.269 244.065C245.353 246.076 242.601 249.674 241.754 254.013L239.531 264.915C239.32 266.079 237.626 266.079 237.415 264.915L235.192 254.013C234.345 249.78 231.594 246.076 227.678 244.065L221.327 240.784C220.586 240.36 220.586 239.302 221.327 238.878L227.678 235.597C231.594 233.587 234.345 229.988 235.192 225.649L237.415 214.747C237.732 213.583 239.32 213.583 239.531 214.747Z\" fill=\"white\"></path>\n<path d=\"M207.039 290.528C210.312 290.528 212.966 287.874 212.966 284.601C212.966 281.327 210.312 278.674 207.039 278.674C203.766 278.674 201.112 281.327 201.112 284.601C201.112 287.874 203.766 290.528 207.039 290.528Z\" fill=\"white\"></path>\n<path d=\"M398.368 312.117C415.916 304.106 418.59 272.308 404.34 241.095C390.09 209.881 364.313 191.072 346.766 199.083C329.218 207.093 326.544 238.891 340.794 270.105C355.044 301.318 380.821 320.128 398.368 312.117Z\" fill=\"black\"></path>\n<path d=\"M360.399 214.747L358.177 225.649C357.33 229.882 354.578 233.587 350.662 235.597L344.312 238.878C343.571 239.302 343.571 240.36 344.312 240.784L350.662 244.065C354.578 246.076 357.33 249.674 358.177 254.013L360.399 264.915C360.611 266.079 362.304 266.079 362.516 264.915L364.739 254.013C365.585 249.78 368.337 246.076 372.253 244.065L378.604 240.784C379.344 240.36 379.344 239.302 378.604 238.878L372.253 235.597C368.337 233.587 365.585 229.988 364.739 225.649L362.516 214.747C362.199 213.583 360.611 213.583 360.399 214.747Z\" fill=\"white\"></path>\n<path d=\"M392.892 290.528C396.165 290.528 398.819 287.874 398.819 284.601C398.819 281.327 396.165 278.674 392.892 278.674C389.618 278.674 386.965 281.327 386.965 284.601C386.965 287.874 389.618 290.528 392.892 290.528Z\" fill=\"white\"></path>\n</svg>\n";


var $4a17508d1c9a9d0d$exports = {};
$4a17508d1c9a9d0d$exports = "<svg width=\"600\" height=\"600\" viewBox=\"0 0 600 600\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<path d=\"M210.937 322.914C237.884 322.914 259.728 301.07 259.728 274.123C259.728 247.176 237.884 225.331 210.937 225.331C183.99 225.331 162.145 247.176 162.145 274.123C162.145 301.07 183.99 322.914 210.937 322.914Z\" fill=\"black\"></path>\n<path d=\"M235.915 252.214L236.655 256.236C237.82 262.163 241.947 267.032 247.663 268.937L248.827 269.36C249.144 269.466 249.144 269.889 248.827 269.995L247.663 270.418C241.947 272.323 237.82 277.192 236.655 283.119L235.915 287.141C235.809 287.564 235.28 287.564 235.28 287.141L234.539 283.119C233.374 277.192 229.247 272.323 223.531 270.418L222.367 269.995C222.05 269.889 222.05 269.466 222.367 269.36L223.531 268.937C229.247 267.032 233.374 262.163 234.539 256.236L235.28 252.214C235.28 251.791 235.809 251.791 235.915 252.214Z\" fill=\"white\"></path>\n<path d=\"M195.273 266.079C201.585 266.079 206.703 260.961 206.703 254.648C206.703 248.335 201.585 243.218 195.273 243.218C188.96 243.218 183.842 248.335 183.842 254.648C183.842 260.961 188.96 266.079 195.273 266.079Z\" fill=\"white\"></path>\n<path d=\"M201.2 307.991C204.473 307.991 207.126 305.338 207.126 302.064C207.126 298.791 204.473 296.137 201.2 296.137C197.926 296.137 195.273 298.791 195.273 302.064C195.273 305.338 197.926 307.991 201.2 307.991Z\" fill=\"white\"></path>\n<path d=\"M389.063 322.914C416.01 322.914 437.855 301.07 437.855 274.123C437.855 247.176 416.01 225.331 389.063 225.331C362.116 225.331 340.272 247.176 340.272 274.123C340.272 301.07 362.116 322.914 389.063 322.914Z\" fill=\"black\"></path>\n<path d=\"M414.041 252.214L414.782 256.236C415.946 262.163 420.074 267.032 425.789 268.937L426.954 269.36C427.271 269.466 427.271 269.889 426.954 269.995L425.789 270.418C420.074 272.323 415.946 277.192 414.782 283.119L414.041 287.141C413.935 287.564 413.406 287.564 413.406 287.141L412.665 283.119C411.501 277.192 407.373 272.323 401.658 270.418L400.494 269.995C400.176 269.889 400.176 269.466 400.494 269.36L401.658 268.937C407.373 267.032 411.501 262.163 412.665 256.236L413.406 252.214C413.406 251.791 413.935 251.791 414.041 252.214Z\" fill=\"white\"></path>\n<path d=\"M373.399 266.079C379.712 266.079 384.83 260.961 384.83 254.648C384.83 248.335 379.712 243.218 373.399 243.218C367.086 243.218 361.969 248.335 361.969 254.648C361.969 260.961 367.086 266.079 373.399 266.079Z\" fill=\"white\"></path>\n<path d=\"M379.326 307.991C382.6 307.991 385.253 305.338 385.253 302.064C385.253 298.791 382.6 296.137 379.326 296.137C376.053 296.137 373.399 298.791 373.399 302.064C373.399 305.338 376.053 307.991 379.326 307.991Z\" fill=\"white\"></path>\n<path d=\"M301.535 343.659C291.692 343.659 283.754 357.524 283.754 374.67H319.21C319.316 357.524 311.378 343.659 301.535 343.659Z\" fill=\"black\"></path>\n</svg>\n";


var $96f680ab433e6798$exports = {};
$96f680ab433e6798$exports = "<svg width=\"600\" height=\"600\" viewBox=\"0 0 600 600\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<path d=\"M211.36 301.852C245.73 301.852 273.593 288.916 273.593 272.958C273.593 257.001 245.73 244.064 211.36 244.064C176.99 244.064 149.127 257.001 149.127 272.958C149.127 288.916 176.99 301.852 211.36 301.852Z\" fill=\"black\"></path>\n<path d=\"M183.63 272.958C183.63 264.491 187.44 256.871 193.473 251.791C172.517 254.86 157.382 263.221 157.382 272.958C157.382 282.696 172.411 291.057 193.473 294.126C187.44 289.046 183.63 281.426 183.63 272.958Z\" fill=\"white\"></path>\n<path d=\"M229.353 251.791C233.692 255.389 236.761 260.364 238.243 265.973L224.061 272.958L238.243 279.944C236.761 285.553 233.586 290.528 229.353 294.126C250.309 291.057 265.444 282.696 265.444 272.958C265.444 263.221 250.415 254.86 229.353 251.791Z\" fill=\"white\"></path>\n<path d=\"M388.64 301.852C423.01 301.852 450.873 288.916 450.873 272.958C450.873 257.001 423.01 244.064 388.64 244.064C354.27 244.064 326.407 257.001 326.407 272.958C326.407 288.916 354.27 301.852 388.64 301.852Z\" fill=\"black\"></path>\n<path d=\"M360.91 272.958C360.91 264.491 364.72 256.871 370.753 251.791C349.797 254.86 334.662 263.221 334.662 272.958C334.662 282.696 349.691 291.057 370.753 294.126C364.72 289.046 360.91 281.426 360.91 272.958Z\" fill=\"white\"></path>\n<path d=\"M406.633 251.791C410.972 255.389 414.041 260.364 415.523 265.973L401.341 272.958L415.523 279.944C414.041 285.553 410.866 290.528 406.633 294.126C427.589 291.057 442.724 282.696 442.724 272.958C442.618 263.221 427.589 254.86 406.633 251.791Z\" fill=\"white\"></path>\n<path d=\"M337.308 350.115H262.798V355.936H337.308V350.115Z\" fill=\"black\"></path>\n</svg>\n";


var $4454a8662bcb05a5$exports = {};
$4454a8662bcb05a5$exports = "<svg width=\"600\" height=\"600\" viewBox=\"0 0 600 600\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<path d=\"M210.937 283.064C229.759 283.064 245.017 272.165 245.017 258.721C245.017 245.277 229.759 234.378 210.937 234.378C192.115 234.378 176.857 245.277 176.857 258.721C176.857 272.165 192.115 283.064 210.937 283.064Z\" fill=\"black\"></path>\n<path d=\"M226.072 243.586L228.506 249.936L235.385 250.36C236.126 250.36 236.444 251.418 235.915 251.841L230.623 256.181L232.422 262.849C232.634 263.589 231.787 264.224 231.152 263.801L225.437 260.097L219.721 263.801C219.086 264.224 218.24 263.589 218.451 262.849L220.25 256.181L214.959 251.841C214.323 251.312 214.641 250.36 215.488 250.36L222.367 249.936L224.802 243.586C224.802 242.845 225.754 242.845 226.072 243.586Z\" fill=\"white\"></path>\n<path d=\"M193.262 273.644C195.658 273.644 197.601 271.701 197.601 269.305C197.601 266.908 195.658 264.965 193.262 264.965C190.865 264.965 188.922 266.908 188.922 269.305C188.922 271.701 190.865 273.644 193.262 273.644Z\" fill=\"white\"></path>\n<path d=\"M389.063 283.064C407.885 283.064 423.143 272.165 423.143 258.721C423.143 245.277 407.885 234.378 389.063 234.378C370.241 234.378 354.983 245.277 354.983 258.721C354.983 272.165 370.241 283.064 389.063 283.064Z\" fill=\"black\"></path>\n<path d=\"M404.198 243.586L406.633 249.936L413.512 250.36C414.253 250.36 414.57 251.418 414.041 251.841L408.749 256.181L410.549 262.849C410.76 263.589 409.914 264.224 409.279 263.801L403.563 260.097L397.848 263.801C397.213 264.224 396.366 263.589 396.578 262.849L398.377 256.181L393.085 251.841C392.45 251.312 392.768 250.36 393.614 250.36L400.494 249.936L402.928 243.586C402.928 242.845 403.881 242.845 404.198 243.586Z\" fill=\"white\"></path>\n<path d=\"M371.388 273.644C373.785 273.644 375.728 271.701 375.728 269.305C375.728 266.908 373.785 264.965 371.388 264.965C368.992 264.965 367.049 266.908 367.049 269.305C367.049 271.701 368.992 273.644 371.388 273.644Z\" fill=\"white\"></path>\n<path d=\"M353.925 326.987C353.925 322.542 351.596 320.319 350.115 323.071C345.246 332.067 336.144 338.206 325.772 338.206C315.717 338.206 306.932 332.49 301.958 324.023C301.535 322.647 300.794 321.907 300.053 321.907C299.312 321.907 298.571 322.647 298.148 324.023C293.173 332.596 284.389 338.206 274.334 338.206C263.962 338.206 254.86 332.173 249.991 323.071C248.509 320.319 246.181 322.542 246.181 326.987V327.093C246.181 343.921 258.776 357.468 274.334 357.468C276.345 357.468 278.356 357.257 280.261 356.833C280.155 357.892 280.049 358.95 280.049 360.009C280.049 374.085 289.046 385.622 300.053 385.622C311.06 385.622 320.056 374.191 320.056 360.009C320.056 358.95 319.951 357.892 319.845 356.833C321.75 357.257 323.761 357.468 325.772 357.468C341.33 357.574 353.925 343.921 353.925 326.987C353.925 327.093 353.925 327.093 353.925 326.987Z\" fill=\"black\"></path>\n</svg>\n";


var $e18649a10a80c8f1$exports = {};
$e18649a10a80c8f1$exports = "<svg width=\"600\" height=\"600\" viewBox=\"0 0 600 600\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<path d=\"M221.521 303.914C248.404 303.914 270.206 282.112 270.206 255.229H172.729C172.729 282.112 194.638 303.914 221.521 303.914Z\" fill=\"black\"></path>\n<path d=\"M241.101 259.674C241.207 260.626 241.312 261.579 241.312 262.531C241.312 273.433 232.422 282.323 221.521 282.323C210.619 282.323 201.729 273.433 201.729 262.531C201.729 261.579 201.835 260.626 201.94 259.674H178.444C178.444 281.582 199.718 299.363 221.626 299.363C243.535 299.363 264.809 281.582 264.809 259.674H241.101Z\" fill=\"white\"></path>\n<path d=\"M378.479 303.914C405.363 303.914 427.165 282.112 427.165 255.229H329.688C329.794 282.112 351.596 303.914 378.479 303.914Z\" fill=\"black\"></path>\n<path d=\"M398.165 259.674C398.271 260.626 398.377 261.579 398.377 262.531C398.377 273.433 389.487 282.323 378.585 282.323C367.684 282.323 358.793 273.433 358.793 262.531C358.793 261.579 358.899 260.626 359.005 259.674H335.509C335.509 281.582 356.782 299.363 378.691 299.363C400.6 299.363 421.873 281.582 421.873 259.674H398.165Z\" fill=\"white\"></path>\n<path d=\"M262.057 332.914C265.232 351.013 281.002 364.877 299.947 364.877C318.892 364.877 334.768 351.118 337.837 332.914H262.057Z\" fill=\"black\"></path>\n</svg>\n";


var $d83fdf83df3a4f53$exports = {};
$d83fdf83df3a4f53$exports = "<svg width=\"600\" height=\"600\" viewBox=\"0 0 600 600\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<path d=\"M300.1 372.8C309.4 372.8 316.8 359.4 316.8 342.7H283.2C283.2 359.3 290.7 372.8 300.1 372.8Z\" fill=\"black\"></path>\n<path d=\"M219.5 320.8C244.6 320.8 265 300.4 265 275.3C265 250.2 244.6 229.8 219.5 229.8C194.4 229.8 174 250.2 174 275.3C174 300.4 194.4 320.8 219.5 320.8Z\" fill=\"black\"></path>\n<path d=\"M219.5 318.199C243.2 318.199 262.4 298.999 262.4 275.299C262.4 251.599 243.2 232.399 219.5 232.399C195.8 232.399 176.6 251.599 176.6 275.299C176.6 298.999 195.8 318.199 219.5 318.199Z\" fill=\"white\"></path>\n<path d=\"M231 275.3L248.1 265.5C244 253.6 232.8 245.1 219.4 245.1C202.7 245.1 189 258.6 189 275.5C189 292.4 202.5 305.9 219.4 305.9C232.6 305.9 244 297.3 248.1 285.5L231 275.3Z\" fill=\"black\"></path>\n<path d=\"M211.1 256.3L215.5 253.1L213.8 258.2L218.2 261.4H212.8L211.1 266.6L209.5 261.4H204L208.4 258.2L206.7 253.1L211.1 256.3Z\" fill=\"white\"></path>\n<path d=\"M205.4 275.9L211.5 273.2L210.8 279.8L215.2 284.8L208.8 286.2L205.4 291.9L202.1 286.2L195.6 284.8L200 279.8L199.4 273.2L205.4 275.9Z\" fill=\"white\"></path>\n<path d=\"M380.5 320.8C405.6 320.8 426 300.4 426 275.3C426 250.2 405.6 229.8 380.5 229.8C355.4 229.8 335 250.2 335 275.3C335 300.4 355.4 320.8 380.5 320.8Z\" fill=\"black\"></path>\n<path d=\"M380.5 318.199C404.2 318.199 423.4 298.999 423.4 275.299C423.4 251.599 404.2 232.399 380.5 232.399C356.8 232.399 337.6 251.599 337.6 275.299C337.6 298.999 356.8 318.199 380.5 318.199Z\" fill=\"white\"></path>\n<path d=\"M392 275.3L409.1 265.5C405 253.6 393.8 245.1 380.4 245.1C363.7 245.1 350 258.6 350 275.5C350 292.4 363.5 305.9 380.4 305.9C393.6 305.9 405 297.3 409.1 285.5L392 275.3Z\" fill=\"black\"></path>\n<path d=\"M372.1 256.3L376.5 253.1L374.8 258.2L379.2 261.4H373.8L372.1 266.6L370.4 261.4H365L369.4 258.2L367.7 253.1L372.1 256.3Z\" fill=\"white\"></path>\n<path d=\"M366.4 275.9L372.5 273.2L371.8 279.8L376.2 284.8L369.7 286.2L366.4 291.9L363.1 286.2L356.6 284.8L361 279.8L360.3 273.2L366.4 275.9Z\" fill=\"white\"></path>\n</svg>\n";


var $0ef0c6c65d5fff9a$exports = {};
$0ef0c6c65d5fff9a$exports = "<svg width=\"600\" height=\"600\" viewBox=\"0 0 600 600\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<path d=\"M192.415 286.612C214.429 311.801 249.25 317.305 270.206 298.995L190.404 207.974C169.342 226.178 170.295 261.422 192.415 286.612Z\" fill=\"black\"></path>\n<path d=\"M217.393 247.663L213.688 254.543C213.265 255.284 213.159 256.236 213.477 257.083L216.229 264.386C216.652 265.55 215.382 266.714 214.324 266.079L207.444 262.375C206.703 261.951 205.751 261.846 204.904 262.163L197.601 264.915C196.437 265.338 195.273 264.068 195.908 263.01L199.612 256.13C200.035 255.389 200.141 254.437 199.824 253.59L197.072 246.287C196.648 245.123 197.919 243.959 198.977 244.594L205.856 248.298C206.597 248.722 207.55 248.827 208.397 248.51L215.699 245.758C216.864 245.335 218.028 246.605 217.393 247.663Z\" fill=\"white\"></path>\n<path d=\"M407.691 286.612C385.676 311.801 350.856 317.305 329.899 298.995L409.702 207.974C430.658 226.178 429.705 261.422 407.691 286.612Z\" fill=\"black\"></path>\n<path d=\"M382.607 247.663L386.311 254.543C386.735 255.284 386.841 256.236 386.523 257.083L383.771 264.386C383.348 265.55 384.618 266.714 385.676 266.079L392.556 262.375C393.297 261.951 394.249 261.846 395.096 262.163L402.399 264.915C403.563 265.338 404.727 264.068 404.092 263.01L400.388 256.13C399.965 255.389 399.859 254.437 400.176 253.59L402.928 246.287C403.352 245.123 402.081 243.959 401.023 244.594L394.144 248.298C393.403 248.722 392.45 248.827 391.603 248.51L384.301 245.758C383.136 245.335 382.078 246.605 382.607 247.663Z\" fill=\"white\"></path>\n<path d=\"M288.093 351.279L264.491 392.133H335.509L311.907 351.279C306.615 342.071 293.385 342.071 288.093 351.279Z\" fill=\"black\"></path>\n</svg>\n";


var $39ddbcba7b1507d3$exports = {};
$39ddbcba7b1507d3$exports = "<svg width=\"600\" height=\"600\" viewBox=\"0 0 600 600\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<path d=\"M212.1 295.9C224.1 298.6 234.4 303 241.3 307.9C243.2 309.3 245.9 308.9 247.3 307.1C252.6 300.4 256.6 292.2 258.7 282.9C264.9 255.1 251.3 228.4 228.3 223.3C205.3 218.2 181.6 236.6 175.4 264.4C173.3 273.7 173.5 282.9 175.5 291.1C176.1 293.4 178.3 294.9 180.6 294.4C188.9 292.8 200.1 293.2 212.1 295.9Z\" fill=\"white\"></path>\n<path d=\"M257.1 250.9C257.1 250.9 262.9 265.5 258.7 282.9C256.5 292.1 252.6 300.4 247.3 307.1C245.8 309 243.2 309.4 241.2 308C241.2 308 220.8 292.8 187.1 293.7C187.1 293.7 181.7 240.5 221.6 222.5C221.7 222.4 246.5 221.6 257.1 250.9Z\" fill=\"black\"></path>\n<path d=\"M228.4 267.5L229.4 277.8L239.5 280L230 284.2L231 294.4L224.1 286.7L214.7 290.8L219.9 281.9L213.1 274.2L223.2 276.4L228.4 267.5Z\" fill=\"white\"></path>\n<path d=\"M236.853 256.762C239.163 249.21 231.488 240.167 219.71 236.564C207.932 232.962 196.512 236.164 194.202 243.717C191.892 251.269 199.567 260.312 211.345 263.914C223.122 267.517 234.543 264.315 236.853 256.762Z\" fill=\"white\"></path>\n<path d=\"M387.9 295.9C375.9 298.6 365.6 303 358.7 307.9C356.8 309.3 354.1 308.9 352.7 307.1C347.4 300.4 343.4 292.2 341.3 282.9C335.1 255.1 348.7 228.4 371.7 223.3C394.7 218.2 418.4 236.6 424.6 264.4C426.7 273.7 426.5 282.9 424.5 291.1C423.9 293.4 421.7 294.9 419.4 294.4C411.1 292.8 399.9 293.2 387.9 295.9Z\" fill=\"white\"></path>\n<path d=\"M342.9 250.9C342.9 250.9 337.1 265.5 341.3 282.9C343.5 292.1 347.4 300.4 352.7 307.1C354.2 309 356.8 309.4 358.8 308C358.8 308 379.2 292.8 412.9 293.7C412.9 293.7 418.3 240.5 378.4 222.5C378.3 222.4 353.5 221.6 342.9 250.9Z\" fill=\"black\"></path>\n<path d=\"M371.6 267.5L370.6 277.8L360.5 280L370 284.2L369 294.4L375.9 286.7L385.3 290.8L380.1 281.9L386.9 274.2L376.8 276.4L371.6 267.5Z\" fill=\"white\"></path>\n<path d=\"M388.694 263.865C400.472 260.263 408.147 251.22 405.837 243.667C403.527 236.115 392.106 232.912 380.329 236.515C368.551 240.117 360.876 249.16 363.186 256.713C365.496 264.265 376.916 267.467 388.694 263.865Z\" fill=\"white\"></path>\n<path d=\"M300 399.7C310.935 399.7 319.8 383.985 319.8 364.6C319.8 345.215 310.935 329.5 300 329.5C289.065 329.5 280.2 345.215 280.2 364.6C280.2 383.985 289.065 399.7 300 399.7Z\" fill=\"black\"></path>\n</svg>\n";


var $aec7e37f762540d2$exports = {};
$aec7e37f762540d2$exports = "<svg width=\"600\" height=\"600\" viewBox=\"0 0 600 600\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<path d=\"M300.053 365.724C339.108 365.724 371.494 348.26 377.844 325.293C379.009 321.166 375.834 316.932 371.494 316.932H228.506C224.167 316.932 220.991 321.06 222.156 325.293C228.612 348.26 260.999 365.724 300.053 365.724Z\" fill=\"black\"></path>\n<path d=\"M239.302 257.662C239.302 257.662 245.017 248.454 210.831 261.049C210.831 261.049 176.963 273.327 166.061 285.815C166.061 285.815 154.842 298.304 191.78 284.016C191.674 283.91 235.174 267.188 239.302 257.662Z\" fill=\"black\"></path>\n<path d=\"M196.437 303.279C207.952 303.279 217.287 300.483 217.287 297.034C217.287 293.586 207.952 290.79 196.437 290.79C184.922 290.79 175.587 293.586 175.587 297.034C175.587 300.483 184.922 303.279 196.437 303.279Z\" fill=\"#FF4D4D\"></path>\n<path d=\"M360.804 257.662C360.804 257.662 355.089 248.454 389.275 261.049C389.275 261.049 423.143 273.327 434.045 285.815C434.045 285.815 445.264 298.304 408.326 284.016C408.326 283.91 364.826 267.188 360.804 257.662Z\" fill=\"black\"></path>\n<path d=\"M403.669 303.279C415.184 303.279 424.519 300.483 424.519 297.034C424.519 293.586 415.184 290.79 403.669 290.79C392.154 290.79 382.819 293.586 382.819 297.034C382.819 300.483 392.154 303.279 403.669 303.279Z\" fill=\"#FF4D4D\"></path>\n</svg>\n";


var $041ef4b4b97b4215$exports = {};
$041ef4b4b97b4215$exports = "<svg width=\"600\" height=\"600\" viewBox=\"0 0 600 600\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<path d=\"M210.4 239.6C217.5 242.6 223.5 248.3 227.9 255.7C224.9 239.1 213.2 226.8 199.2 226.8C185.2 226.8 173.6 239.1 170.5 255.7C174.8 248.2 180.9 242.6 188 239.6C179.6 244.3 173.9 254.2 173.9 265.6C173.9 281.6 185.2 294.6 199.2 294.6C213.2 294.6 224.5 281.6 224.5 265.6C224.5 254.2 218.7 244.4 210.4 239.6Z\" fill=\"black\"></path>\n<path d=\"M202.5 263.7C206.918 263.7 210.5 260.118 210.5 255.7C210.5 251.282 206.918 247.7 202.5 247.7C198.082 247.7 194.5 251.282 194.5 255.7C194.5 260.118 198.082 263.7 202.5 263.7Z\" fill=\"white\"></path>\n<path d=\"M188.1 282.9C190.143 282.9 191.8 281.243 191.8 279.2C191.8 277.157 190.143 275.5 188.1 275.5C186.056 275.5 184.4 277.157 184.4 279.2C184.4 281.243 186.056 282.9 188.1 282.9Z\" fill=\"white\"></path>\n<path d=\"M209.2 275.8L213.4 272.8L211.8 277.7L215.9 280.7H210.8L209.2 285.6L207.6 280.7H202.5L206.7 277.7L205.1 272.8L209.2 275.8Z\" fill=\"#FFDD33\"></path>\n<path d=\"M412 239.6C419.1 242.6 425.1 248.3 429.5 255.7C426.5 239.1 414.8 226.8 400.8 226.8C386.8 226.8 375.2 239.1 372.1 255.7C376.4 248.2 382.5 242.6 389.6 239.6C381.2 244.3 375.5 254.2 375.5 265.6C375.5 281.6 386.8 294.6 400.8 294.6C414.8 294.6 426.1 281.6 426.1 265.6C426.2 254.2 420.4 244.4 412 239.6Z\" fill=\"black\"></path>\n<path d=\"M404.1 263.7C408.518 263.7 412.1 260.118 412.1 255.7C412.1 251.282 408.518 247.7 404.1 247.7C399.682 247.7 396.1 251.282 396.1 255.7C396.1 260.118 399.682 263.7 404.1 263.7Z\" fill=\"white\"></path>\n<path d=\"M389.7 282.9C391.743 282.9 393.4 281.243 393.4 279.2C393.4 277.157 391.743 275.5 389.7 275.5C387.657 275.5 386 277.157 386 279.2C386 281.243 387.657 282.9 389.7 282.9Z\" fill=\"white\"></path>\n<path d=\"M410.9 275.8L415 272.8L413.4 277.7L417.6 280.7H412.5L410.9 285.6L409.3 280.7H404.1L408.3 277.7L406.7 272.8L410.9 275.8Z\" fill=\"#FFDD33\"></path>\n<path d=\"M343.8 347.4C339.9 348.3 336.1 347.8 333.4 345.5C330.7 343.2 329.5 339.7 329.7 335.6C329.7 335 328.9 334.7 328.6 335.3C326.7 339.6 326.5 344 328.1 347.1C320.6 354.6 310 359.4 298.3 359.4C285.7 359.4 274.4 354 266.8 345.4C266.5 345.1 265.9 345.4 266.1 345.8C269.8 359.5 282.8 369.7 298.3 369.7C312.6 369.7 324.7 361.1 329.5 349C329.7 349.2 329.9 349.3 330 349.5C333.5 352.4 339.2 351.8 344.2 348.4C344.8 348.1 344.4 347.3 343.8 347.4Z\" fill=\"black\"></path>\n</svg>\n";


var $38a26c3bc65c2d53$exports = {};
$38a26c3bc65c2d53$exports = "<svg width=\"600\" height=\"600\" viewBox=\"0 0 600 600\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<path d=\"M212.207 220.886C210.196 220.886 208.291 221.203 206.386 221.838C205.433 222.156 204.375 222.368 203.317 222.579C195.061 223.955 176.328 224.59 167.12 205.222C167.12 205.222 173.47 229.459 192.309 234.327C189.557 239.408 187.97 245.652 187.97 252.32C187.97 269.677 198.765 283.648 212.101 283.648C225.437 283.648 236.232 269.572 236.232 252.32C236.232 235.068 225.543 220.886 212.207 220.886Z\" fill=\"black\"></path>\n<path d=\"M212.948 261.422C217.215 261.422 220.674 257.963 220.674 253.696C220.674 249.429 217.215 245.97 212.948 245.97C208.681 245.97 205.222 249.429 205.222 253.696C205.222 257.963 208.681 261.422 212.948 261.422Z\" fill=\"#8DC406\"></path>\n<path d=\"M218.346 250.521C223.139 250.521 227.024 246.635 227.024 241.842C227.024 237.049 223.139 233.163 218.346 233.163C213.552 233.163 209.667 237.049 209.667 241.842C209.667 246.635 213.552 250.521 218.346 250.521Z\" fill=\"white\"></path>\n<path d=\"M199.189 271.688C201.936 271.688 204.163 269.461 204.163 266.714C204.163 263.967 201.936 261.74 199.189 261.74C196.441 261.74 194.214 263.967 194.214 266.714C194.214 269.461 196.441 271.688 199.189 271.688Z\" fill=\"white\"></path>\n<path d=\"M387.793 220.886C389.804 220.886 391.71 221.203 393.615 221.838C394.567 222.156 395.626 222.368 396.684 222.579C404.939 223.955 423.673 224.59 432.881 205.222C432.881 205.222 426.53 229.459 407.691 234.327C410.443 239.408 412.031 245.652 412.031 252.32C412.031 269.677 401.235 283.648 387.899 283.648C374.564 283.648 363.768 269.572 363.768 252.32C363.768 235.068 374.458 220.886 387.793 220.886Z\" fill=\"black\"></path>\n<path d=\"M386.1 261.422C390.367 261.422 393.826 257.963 393.826 253.696C393.826 249.429 390.367 245.97 386.1 245.97C381.833 245.97 378.374 249.429 378.374 253.696C378.374 257.963 381.833 261.422 386.1 261.422Z\" fill=\"#8DC406\"></path>\n<path d=\"M381.761 250.521C386.554 250.521 390.439 246.635 390.439 241.842C390.439 237.049 386.554 233.163 381.761 233.163C376.968 233.163 373.082 237.049 373.082 241.842C373.082 246.635 376.968 250.521 381.761 250.521Z\" fill=\"white\"></path>\n<path d=\"M401.023 271.688C403.771 271.688 405.998 269.461 405.998 266.714C405.998 263.967 403.771 261.74 401.023 261.74C398.276 261.74 396.049 263.967 396.049 266.714C396.049 269.461 398.276 271.688 401.023 271.688Z\" fill=\"white\"></path>\n<path d=\"M300.053 394.885C336.937 394.885 366.837 375.504 366.837 351.597C366.837 327.689 336.937 308.309 300.053 308.309C263.169 308.309 233.269 327.689 233.269 351.597C233.269 375.504 263.169 394.885 300.053 394.885Z\" fill=\"white\"></path>\n<path d=\"M355.089 327.042L342.6 339.002C341.224 340.272 338.578 339.954 337.838 338.367L325.984 311.695C318.046 309.473 309.261 308.309 300.053 308.309C290.845 308.309 282.061 309.473 274.017 311.695L262.163 338.261C261.422 339.849 258.776 340.272 257.4 338.896L244.911 327.042C237.502 334.027 233.163 342.389 233.163 351.491C233.163 375.41 263.115 394.779 299.947 394.779C336.779 394.779 366.732 375.41 366.732 351.491C366.837 342.495 362.498 334.027 355.089 327.042Z\" fill=\"black\"></path>\n</svg>\n";


var $b79d573bdaa407de$exports = {};
$b79d573bdaa407de$exports = "<svg width=\"600\" height=\"600\" viewBox=\"0 0 600 600\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<path d=\"M364.8 293.8C364.4 293.6 363.8 293.4 363.3 293.2C363.5 293.2 363.9 293.4 364.8 293.8Z\" fill=\"black\"></path>\n<path d=\"M337.2 381H262.9C260.8 381 259.2 379.1 259.5 377L267.1 334.2C267.4 332.6 268.8 331.3 270.5 331.3H329.7C331.4 331.3 332.8 332.5 333.1 334.2L340.7 377C340.9 379.1 339.3 381 337.2 381Z\" fill=\"black\"></path>\n<path d=\"M210.6 301.8C210.2 301.6 209.6 301.4 209.1 301.2C209.2 301.2 209.7 301.4 210.6 301.8Z\" fill=\"black\"></path>\n<path d=\"M190.3 276.2C190.3 276.2 225.8 273.7 242.2 276.2C242.2 276.2 198.4 278.9 190.3 276.2Z\" fill=\"black\"></path>\n<path d=\"M250.9 269.2C246.8 268.3 242.6 267.7 238.3 267.3C242.1 267.1 245.7 266.9 248.9 266.4C248.9 266.4 233 262.7 215.7 264.2C210.4 263.5 199 262.6 186.8 265.7C186.8 265.7 194.5 265.2 206.9 265.4C205.4 265.7 203.9 266 202.5 266.4C202.5 266.4 204.5 266.6 207.6 266.7C193.5 267.4 183.2 269.1 183.2 269.1C187 269.7 199.1 270.2 212.2 270.4C203.5 271.2 197.5 272.4 197.5 272.4L251.2 273.5C247.7 272.2 243.8 271.4 239.9 270.8C248.3 270.9 254.2 270.9 254.2 270.9C254.2 270.9 280.5 275.5 250.9 269.2Z\" fill=\"black\"></path>\n<path d=\"M210.6 262.6C210.6 262.6 238.8 261.2 252.2 263.8C252.2 263.9 225.7 256.9 210.6 262.6Z\" fill=\"black\"></path>\n<path d=\"M362.4 301.8C362 301.6 361.4 301.4 360.9 301.2C360.9 301.2 361.5 301.4 362.4 301.8Z\" fill=\"black\"></path>\n<path d=\"M342.1 276.2C342.1 276.2 377.6 273.7 394 276.2C394 276.2 350.2 278.9 342.1 276.2Z\" fill=\"black\"></path>\n<path d=\"M402.7 269.2C398.6 268.3 394.4 267.7 390.1 267.3C393.9 267.1 397.5 266.9 400.7 266.4C400.7 266.4 384.8 262.7 367.5 264.2C362.2 263.5 350.8 262.6 338.6 265.7C338.6 265.7 346.3 265.2 358.7 265.4C357.2 265.7 355.7 266 354.3 266.4C354.3 266.4 356.3 266.6 359.4 266.7C345.3 267.4 335 269.1 335 269.1C338.8 269.7 350.9 270.2 364 270.4C355.3 271.2 349.3 272.4 349.3 272.4L403 273.5C399.5 272.2 395.6 271.4 391.7 270.8C400.1 270.9 406 270.9 406 270.9C406 270.9 432.3 275.5 402.7 269.2Z\" fill=\"black\"></path>\n<path d=\"M362.4 262.6C362.4 262.6 390.6 261.2 404 263.8C404 263.9 377.4 256.9 362.4 262.6Z\" fill=\"black\"></path>\n</svg>\n";


var $9d97e8282715b617$exports = {};
$9d97e8282715b617$exports = "<svg width=\"600\" height=\"600\" viewBox=\"0 0 600 600\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<path d=\"M219.3 276.6C209 276.5 200 272.4 194 266.2C198.2 275.8 207.6 282.7 218.8 283.1C220.5 283.2 222 283.1 223.6 282.9C224 282.8 224.1 283.3 223.8 283.5C215.7 287.6 207.8 289.4 203.7 290.2C203.3 290.3 203.3 290.9 203.6 290.7C233.6 292.7 243.2 276.2 246.4 265.2C240.1 272.2 230.3 276.7 219.3 276.6Z\" fill=\"black\"></path>\n<path d=\"M379.7 278.2C369.4 278.1 360.4 274 354.4 267.8C358.6 277.4 368 284.3 379.2 284.7C380.9 284.8 382.4 284.7 384 284.5C384.4 284.4 384.5 284.9 384.2 285.1C376.1 289.2 368.2 291 364.1 291.8C363.7 291.9 363.7 292.5 364 292.3C394 294.3 403.6 277.8 406.8 266.8C400.5 273.8 390.7 278.2 379.7 278.2Z\" fill=\"black\"></path>\n<path d=\"M248.1 332.101C246.3 333.101 245.1 334.901 245 336.901C245 337.401 245 337.901 245 338.501C245 362.401 269.6 381.801 300 381.801C330.4 381.801 355 362.401 355 338.501C355 337.801 355 337.201 354.9 336.501C354.8 334.401 353.6 332.601 351.8 331.601C305.8 306.901 266 322.201 248.1 332.101Z\" fill=\"#FF4040\"></path>\n<path d=\"M300 346.8C318.1 346.8 334.2 353.7 344.2 364.3C351 357.1 355 348.2 355 338.5C355 337.8 355 337.2 354.9 336.5C354.8 334.4 353.5 332.7 351.8 331.6C303.1 301.6 269 319.7 248 332C246.2 333 245 334.8 244.9 336.8C244.9 337.3 244.9 337.8 244.9 338.4C244.9 348.1 248.9 357 255.7 364.2C265.8 353.7 281.9 346.8 300 346.8Z\" fill=\"black\"></path>\n</svg>\n";


var $0504228cf2ecfe0d$exports = {};
$0504228cf2ecfe0d$exports = "<svg width=\"600\" height=\"600\" viewBox=\"0 0 600 600\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<path d=\"M226.1 351H374C381.7 351 385.3 343.6 379.5 339.7C353 321.9 292.9 294 220.8 339.6C214.7 343.4 218.2 351 226.1 351Z\" fill=\"black\"></path>\n<path d=\"M226.1 351H374C381.7 351 385.3 343.6 379.5 339.7C353 321.9 292.9 294 220.8 339.6C214.7 343.4 218.2 351 226.1 351Z\" stroke=\"black\" stroke-width=\"0.1479\" stroke-miterlimit=\"10\"></path>\n<path d=\"M220.491 288.288C241.345 282.684 257.89 276.801 257.446 275.148C257.002 273.495 239.736 276.697 218.883 282.301C198.029 287.905 181.484 293.788 181.928 295.441C182.372 297.094 199.638 293.892 220.491 288.288Z\" fill=\"black\"></path>\n<path d=\"M418.01 295.453C418.454 293.799 401.909 287.916 381.056 282.312C360.202 276.709 342.937 273.506 342.492 275.16C342.048 276.813 358.593 282.696 379.447 288.3C400.3 293.903 417.566 297.106 418.01 295.453Z\" fill=\"black\"></path>\n</svg>\n";


var $c84b315a9edda562$exports = {};
$c84b315a9edda562$exports = "<svg width=\"600\" height=\"600\" viewBox=\"0 0 600 600\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<path d=\"M302.7 418.5C319.8 418.5 333.6 397.8 333.6 372.2C333.6 346.7 319.8 325.9 302.7 325.9C285.6 325.9 271.8 346.6 271.8 372.2C271.8 397.8 285.6 418.5 302.7 418.5Z\" fill=\"black\"></path>\n<path d=\"M199.8 300.5C194.5 298.3 190.2 294.5 187.1 289.5C188.9 300.3 193.7 308.5 201.5 312C217.4 319.3 240.1 304.5 254.8 278.3C237.3 297.7 215.9 307.2 199.8 300.5Z\" fill=\"black\"></path>\n<path d=\"M400.2 300.5C405.5 298.3 409.8 294.5 412.9 289.5C411.1 300.3 406.3 308.5 398.5 312C382.6 319.3 359.9 304.5 345.2 278.3C362.7 297.7 384.1 307.2 400.2 300.5Z\" fill=\"black\"></path>\n</svg>\n";


var $340c7240e284f5b6$exports = {};
$340c7240e284f5b6$exports = "<svg width=\"600\" height=\"600\" viewBox=\"0 0 600 600\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<path d=\"M210.9 312.3C192.7 312.3 176.4 304.3 165.4 291.6C172.4 309.9 190.2 322.9 210.9 322.9C231.7 322.9 249.4 309.9 256.4 291.6C245.4 304.3 229.1 312.3 210.9 312.3Z\" fill=\"black\"></path>\n<path d=\"M389.1 312.3C370.9 312.3 354.6 304.3 343.6 291.6C350.6 309.9 368.4 322.9 389.1 322.9C409.9 322.9 427.6 309.9 434.6 291.6C423.5 304.3 407.2 312.3 389.1 312.3Z\" fill=\"black\"></path>\n<path d=\"M301.5 343.7C291.7 343.7 283.7 357.6 283.7 374.7H319.2C319.3 357.5 311.4 343.7 301.5 343.7Z\" fill=\"black\"></path>\n</svg>\n";


var $b9a9c8f05a36dc94$exports = {};
$b9a9c8f05a36dc94$exports = "<svg width=\"600\" height=\"600\" viewBox=\"0 0 600 600\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<path d=\"M337.3 350.1H262.8V355.9H337.3V350.1Z\" fill=\"black\"></path>\n<path d=\"M271.9 276.4H150.7C149.9 276.4 149.2 277.1 149.2 277.9V280.8C149.2 281.6 149.9 282.3 150.7 282.3H271.9C272.7 282.3 273.4 281.6 273.4 280.8V277.9C273.4 277.1 272.7 276.4 271.9 276.4Z\" fill=\"black\"></path>\n<path d=\"M449.3 276.4H328.1C327.3 276.4 326.6 277.1 326.6 277.9V280.8C326.6 281.6 327.3 282.3 328.1 282.3H449.3C450.1 282.3 450.8 281.6 450.8 280.8V277.9C450.8 277.1 450.1 276.4 449.3 276.4Z\" fill=\"black\"></path>\n</svg>\n";


var $186d6b8c098a700a$exports = {};
$186d6b8c098a700a$exports = "<svg width=\"600\" height=\"600\" viewBox=\"0 0 600 600\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<path d=\"M210.9 272.3C196 272.3 183.1 266.2 176.9 257.2C176.9 257.7 176.8 258.2 176.8 258.6C176.8 272 192.1 282.9 210.9 282.9C229.7 282.9 245 272 245 258.6C245 258.1 245 257.6 244.9 257.2C238.7 266.2 225.8 272.3 210.9 272.3Z\" fill=\"black\"></path>\n<path d=\"M389 272.3C374.1 272.3 361.2 266.2 355 257.2C355 257.7 354.9 258.2 354.9 258.6C354.9 272 370.2 282.9 389 282.9C407.8 282.9 423.1 272 423.1 258.6C423.1 258.1 423.1 257.6 423 257.2C416.8 266.2 403.9 272.3 389 272.3Z\" fill=\"black\"></path>\n<path d=\"M353.9 327C353.9 322.6 351.6 320.3 350.1 323.1C345.2 332.1 336.1 338.2 325.8 338.2C315.7 338.2 307 332.5 302 324C301.6 322.6 300.8 321.9 300.1 321.9C299.4 321.9 298.6 322.6 298.2 324C293.2 332.6 284.4 338.2 274.4 338.2C264 338.2 254.9 332.2 250.1 323.1C248.6 320.3 246.3 322.6 246.3 327V327.1C246.3 343.9 258.9 357.5 274.5 357.5C276.5 357.5 278.5 357.3 280.4 356.9C280.3 358 280.2 359 280.2 360.1C280.2 374.2 289.2 385.7 300.2 385.7C311.2 385.7 320.2 374.3 320.2 360.1C320.2 359 320.1 358 320 356.9C321.9 357.3 323.9 357.5 325.9 357.5C341.3 357.6 353.9 343.9 353.9 327C353.9 327.1 353.9 327.1 353.9 327Z\" fill=\"black\"></path>\n</svg>\n";


var $31d3ed1a88ca5eec$exports = {};
$31d3ed1a88ca5eec$exports = "<svg width=\"600\" height=\"600\" viewBox=\"0 0 600 600\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<path d=\"M262.1 332.9C265.3 351 281 364.9 300 364.9C318.9 364.9 334.8 351.1 337.9 332.9H262.1Z\" fill=\"black\"></path>\n<path d=\"M270 286.7C270.1 285.2 270.2 283.8 270.2 282.3H172.7C172.7 283.8 172.8 285.3 172.9 286.7H270Z\" fill=\"black\"></path>\n<path d=\"M427 286.7C427.1 285.2 427.2 283.8 427.2 282.3H329.7C329.7 283.8 329.8 285.3 329.9 286.7H427Z\" fill=\"black\"></path>\n</svg>\n";


var $47f8ace5f882f953$exports = {};
$47f8ace5f882f953$exports = "<svg width=\"600\" height=\"600\" viewBox=\"0 0 600 600\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<path d=\"M300.1 372.8C309.4 372.8 316.8 359.4 316.8 342.7H283.2C283.2 359.3 290.7 372.8 300.1 372.8Z\" fill=\"black\"></path>\n<path d=\"M174 275.3H265\" stroke=\"black\" stroke-width=\"3\" stroke-miterlimit=\"10\"></path>\n<path d=\"M335 275.3H426\" stroke=\"black\" stroke-width=\"3\" stroke-miterlimit=\"10\"></path>\n</svg>\n";


var $131bd80b28bbd8f9$exports = {};
$131bd80b28bbd8f9$exports = "<svg width=\"600\" height=\"600\" viewBox=\"0 0 600 600\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<path d=\"M186.7 274.6C184.1 271.8 181.7 268.8 179.6 265.8C182.5 273.1 186.7 280.1 192.4 286.5C214.4 311.7 249.2 317.2 270.2 298.9L265.2 293.2C264.3 292.2 262.8 291.9 261.5 292.5C239 303.7 207.5 296.8 186.7 274.6Z\" fill=\"black\"></path>\n<path d=\"M413.4 274.6C416 271.8 418.4 268.8 420.5 265.8C417.6 273.1 413.4 280.1 407.7 286.5C385.7 311.7 350.9 317.2 329.9 298.9L334.9 293.2C335.8 292.2 337.3 291.9 338.6 292.5C361.1 303.7 392.6 296.8 413.4 274.6Z\" fill=\"black\"></path>\n<path d=\"M288.1 351.3L264.5 392.2H335.5L311.9 351.3C306.6 342.1 293.4 342.1 288.1 351.3Z\" fill=\"black\"></path>\n</svg>\n";


var $1a0bdb3785aceb06$exports = {};
$1a0bdb3785aceb06$exports = "<svg width=\"600\" height=\"600\" viewBox=\"0 0 600 600\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<path d=\"M175.5 284.1C176.1 286.4 178.3 287.9 180.6 287.4C188.9 285.8 200.1 286.2 212.1 288.9C224.1 291.6 234.4 296 241.3 300.9C243.2 302.3 245.9 301.9 247.3 300.1C213.1 274 175.5 284.1 175.5 284.1Z\" fill=\"white\" stroke=\"black\" stroke-width=\"2.4046\" stroke-miterlimit=\"10\"></path>\n<path d=\"M187.5 282.1C187.5 282.1 186.3 286.9 188.6 286.4C197.8 286.7 201.2 286.4 212.1 288.9C224.1 291.6 234.4 296 241.3 300.9C243.2 302.3 245.9 301.9 247.3 300.1C219.7 278.9 187.5 282.1 187.5 282.1Z\" fill=\"black\"></path>\n<path d=\"M352.7 300.1C354.1 301.9 356.8 302.3 358.7 300.9C365.6 296 375.9 291.6 387.9 288.9C399.9 286.2 411.1 285.8 419.4 287.4C421.7 287.9 423.9 286.4 424.5 284.1C424.5 284.1 386.9 273.9 352.7 300.1Z\" fill=\"white\" stroke=\"black\" stroke-width=\"2.4046\" stroke-miterlimit=\"10\"></path>\n<path d=\"M352.7 300.1C354.1 301.9 356.8 302.3 358.7 300.9C365.6 296 375.9 291.6 387.9 288.9C398.8 286.4 402.2 286.7 411.4 286.4C413.7 286.9 412.5 282.1 412.5 282.1C412.5 282.1 380.3 278.9 352.7 300.1Z\" fill=\"black\"></path>\n<path d=\"M300 392.7C310.935 392.7 319.8 376.985 319.8 357.6C319.8 338.215 310.935 322.5 300 322.5C289.065 322.5 280.2 338.215 280.2 357.6C280.2 376.985 289.065 392.7 300 392.7Z\" fill=\"black\"></path>\n</svg>\n";


var $9b528f7f944b02ae$exports = {};
$9b528f7f944b02ae$exports = "<svg width=\"600\" height=\"600\" viewBox=\"0 0 600 600\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<path d=\"M300.1 365.7C339.2 365.7 371.5 348.2 377.9 325.3C379.1 321.2 375.9 316.9 371.5 316.9H228.5C224.2 316.9 221 321 222.2 325.3C228.6 348.3 261 365.7 300.1 365.7Z\" fill=\"black\"></path>\n<path d=\"M196.4 303.3C207.9 303.3 217.3 300.5 217.3 297.1C217.3 293.7 208 290.9 196.4 290.9C184.8 290.9 175.6 293.7 175.6 297.1C175.6 300.5 184.9 303.3 196.4 303.3Z\" fill=\"#FF4D4D\"></path>\n<path d=\"M361.7 262.3C361.7 262.3 356.7 259 388.5 273.1C388.5 273.1 420 287.1 429.7 292.7C429.7 292.7 439.7 298.4 405.4 283.1C405.4 283.1 365.1 265 361.7 262.3Z\" fill=\"black\"></path>\n<path d=\"M194.7 283.1C160.4 298.4 170.4 292.7 170.4 292.7C180.1 287.1 211.6 273.1 211.6 273.1C243.3 259 238.4 262.3 238.4 262.3C235 265 194.7 283.1 194.7 283.1Z\" fill=\"black\"></path>\n<path d=\"M403.7 303.3C415.2 303.3 424.6 300.5 424.6 297.1C424.6 293.7 415.3 290.9 403.7 290.9C392.2 290.9 382.8 293.7 382.8 297.1C382.8 300.5 392.2 303.3 403.7 303.3Z\" fill=\"#FF4D4D\"></path>\n</svg>\n";


var $e63dd1094dd1f770$exports = {};
$e63dd1094dd1f770$exports = "<svg width=\"600\" height=\"600\" viewBox=\"0 0 600 600\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<path d=\"M343.8 347.4C339.9 348.3 336.1 347.8 333.4 345.5C330.7 343.2 329.5 339.7 329.7 335.6C329.7 335 328.9 334.7 328.6 335.3C326.7 339.6 326.5 344 328.1 347.1C320.6 354.6 310 359.4 298.3 359.4C285.7 359.4 274.4 354 266.8 345.4C266.5 345.1 265.9 345.4 266.1 345.8C269.8 359.5 282.8 369.7 298.3 369.7C312.6 369.7 324.7 361.1 329.5 349C329.7 349.2 329.9 349.3 330 349.5C333.5 352.4 339.2 351.8 344.2 348.4C344.8 348.1 344.4 347.3 343.8 347.4Z\" fill=\"black\"></path>\n<path d=\"M227.8 263.8C196 278.5 170.5 263.8 170.5 263.8C175.3 268.7 180.1 272 184.8 274C177.7 271.7 173.5 268.5 173.5 268.5C199.2 299.1 224.9 268.5 224.9 268.5C219.8 271.5 215 273.4 210.4 274.6C220.9 270.9 227.8 263.8 227.8 263.8Z\" fill=\"black\"></path>\n<path d=\"M429.5 263.8C397.7 278.5 372.2 263.8 372.2 263.8C377 268.7 381.8 272 386.5 274C379.4 271.7 375.2 268.5 375.2 268.5C400.9 299.1 426.6 268.5 426.6 268.5C421.5 271.5 416.7 273.4 412.1 274.6C422.5 270.9 429.5 263.8 429.5 263.8Z\" fill=\"black\"></path>\n</svg>\n";


var $a897b9db826d5985$exports = {};
$a897b9db826d5985$exports = "<svg width=\"600\" height=\"600\" viewBox=\"0 0 600 600\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<path d=\"M300.1 394.9C337 394.9 366.9 375.5 366.9 351.6C366.9 327.7 337 308.3 300.1 308.3C263.2 308.3 233.3 327.7 233.3 351.6C233.3 375.5 263.2 394.9 300.1 394.9Z\" fill=\"white\"></path>\n<path d=\"M355.1 327L342.6 339C341.2 340.3 338.6 340 337.8 338.4L326 311.7C318.1 309.5 309.3 308.3 300.1 308.3C290.9 308.3 282.1 309.5 274.1 311.7L262.2 338.3C261.5 339.9 258.8 340.3 257.4 338.9L244.9 327C237.5 334 233.2 342.3 233.2 351.4C233.2 375.3 263.2 394.7 300 394.7C336.8 394.7 366.8 375.3 366.8 351.4C366.8 342.5 362.5 334 355.1 327Z\" fill=\"black\"></path>\n<path d=\"M211.8 275.2C201.8 275.2 192.7 272 186 266.9C186.8 268.7 187.8 270.4 189 271.9C186.1 274.5 179 279.5 168.6 277.9C168.6 277.9 179.9 284.3 194.3 277.4C199.2 281.3 205.3 283.6 211.9 283.6C223.3 283.6 233.1 276.8 237.8 266.9C230.9 272.1 221.8 275.2 211.8 275.2Z\" fill=\"black\"></path>\n<path d=\"M388.2 275.2C398.2 275.2 407.3 272 414 266.9C413.2 268.7 412.2 270.4 411 271.9C413.9 274.5 421 279.5 431.4 277.9C431.4 277.9 420.1 284.3 405.7 277.4C400.8 281.3 394.7 283.6 388.1 283.6C376.7 283.6 366.9 276.8 362.2 266.9C369.1 272.1 378.2 275.2 388.2 275.2Z\" fill=\"black\"></path>\n</svg>\n";


var $e6788dce3b76cf82$exports = {};
$e6788dce3b76cf82$exports = "<svg width=\"600\" height=\"600\" viewBox=\"0 0 600 600\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<path d=\"M203.2 268.5L197.4 371H248.2L243.3 268.1L203.2 268.5Z\" fill=\"white\"></path>\n<path d=\"M203.2 268.5C203.2 268.5 202.9 335.2 197.4 378.2C197.4 378.2 197.5 291.8 203.2 268.5Z\" fill=\"black\"></path>\n<path d=\"M197.4 287.4C197.4 287.4 196.6 323.4 197.4 347.2C197.4 347.2 201.7 309.2 197.4 287.4Z\" fill=\"black\"></path>\n<path d=\"M204.7 276.2C204.7 276.2 200.1 346.6 200.3 367.1C200.3 367.1 207.7 278.7 207.7 268.7C207.7 268.7 206.4 272.7 204.7 276.2Z\" fill=\"black\"></path>\n<path d=\"M243.3 271.2C243.3 271.2 243 326.6 245.6 352.4C245.6 352.4 247.6 309.8 243.3 271.2Z\" fill=\"black\"></path>\n<path d=\"M243.3 268.1C243.3 268.1 245.2 345.9 248.2 381C248.2 381 251.9 295 243.3 268.1Z\" fill=\"black\"></path>\n<path d=\"M240.3 268.5C240.3 268.5 240 339.9 243.3 366C243.3 366 245.3 295.2 240.3 268.5Z\" fill=\"black\"></path>\n<path d=\"M357.1 268.5L351.4 371H402.2L397.3 268.1L357.1 268.5Z\" fill=\"white\"></path>\n<path d=\"M357.1 268.5C357.1 268.5 356.8 335.2 351.3 378.2C351.4 378.2 351.5 291.8 357.1 268.5Z\" fill=\"black\"></path>\n<path d=\"M351.4 287.4C351.4 287.4 350.6 323.4 351.4 347.2C351.4 347.2 355.7 309.2 351.4 287.4Z\" fill=\"black\"></path>\n<path d=\"M358.7 276.2C358.7 276.2 354.1 346.6 354.3 367.1C354.3 367.1 361.7 278.7 361.7 268.7C361.7 268.7 360.4 272.7 358.7 276.2Z\" fill=\"black\"></path>\n<path d=\"M397.3 271.2C397.3 271.2 397 326.6 399.6 352.4C399.6 352.4 401.6 309.8 397.3 271.2Z\" fill=\"black\"></path>\n<path d=\"M397.3 268.1C397.3 268.1 399.2 345.9 402.2 381C402.2 381 405.9 295 397.3 268.1Z\" fill=\"black\"></path>\n<path d=\"M394.3 268.5C394.3 268.5 394 339.9 397.3 366C397.3 366 399.3 295.2 394.3 268.5Z\" fill=\"black\"></path>\n<path d=\"M364.8 293.8C364.4 293.6 363.8 293.4 363.3 293.2C363.5 293.2 363.9 293.4 364.8 293.8Z\" fill=\"black\"></path>\n<path d=\"M337.2 381H262.9C260.8 381 259.2 379.1 259.5 377L267.1 334.2C267.4 332.6 268.8 331.3 270.5 331.3H329.7C331.4 331.3 332.8 332.5 333.1 334.2L340.7 377C340.9 379.1 339.3 381 337.2 381Z\" fill=\"black\"></path>\n<path d=\"M202.7 301.8C202.1 301.6 201.2 301.4 200.4 301.2C200.6 301.2 201.3 301.4 202.7 301.8Z\" fill=\"black\"></path>\n<path d=\"M172.1 276.2C172.1 276.2 225.6 273.7 250.3 276.2C250.3 276.2 184.3 278.9 172.1 276.2Z\" fill=\"black\"></path>\n<path d=\"M263.4 269.2C257.2 268.3 250.9 267.7 244.4 267.3C250.1 267.1 255.6 266.9 260.4 266.4C260.4 266.4 236.4 262.7 210.4 264.2C202.4 263.5 185.2 262.6 166.8 265.7C166.8 265.7 178.4 265.2 197.1 265.4C194.8 265.7 192.6 266 190.5 266.4C190.5 266.4 193.5 266.6 198.2 266.7C176.9 267.4 161.4 269.1 161.4 269.1C167.1 269.7 185.4 270.2 205.1 270.4C192 271.2 182.9 272.4 182.9 272.4L263.8 273.5C258.5 272.2 252.6 271.4 246.8 270.8C259.5 270.9 268.4 270.9 268.4 270.9C268.4 270.9 308 275.5 263.4 269.2Z\" fill=\"black\"></path>\n<path d=\"M202.7 262.6C202.7 262.6 245.2 261.2 265.4 263.8C265.4 263.9 225.4 256.9 202.7 262.6Z\" fill=\"black\"></path>\n<path d=\"M356.7 301.8C356.1 301.6 355.2 301.4 354.4 301.2C354.6 301.2 355.3 301.4 356.7 301.8Z\" fill=\"black\"></path>\n<path d=\"M326.1 276.2C326.1 276.2 379.6 273.7 404.3 276.2C404.3 276.2 338.3 278.9 326.1 276.2Z\" fill=\"black\"></path>\n<path d=\"M417.4 269.2C411.2 268.3 404.9 267.7 398.4 267.3C404.1 267.1 409.6 266.9 414.4 266.4C414.4 266.4 390.4 262.7 364.4 264.2C356.4 263.5 339.2 262.6 320.8 265.7C320.8 265.7 332.4 265.2 351.1 265.4C348.8 265.7 346.6 266 344.5 266.4C344.5 266.4 347.5 266.6 352.2 266.7C330.9 267.4 315.4 269.1 315.4 269.1C321.1 269.7 339.4 270.2 359.1 270.4C346 271.2 336.9 272.4 336.9 272.4L417.8 273.5C412.5 272.2 406.6 271.4 400.8 270.8C413.5 270.9 422.4 270.9 422.4 270.9C422.4 270.9 462 275.5 417.4 269.2Z\" fill=\"black\"></path>\n<path d=\"M356.7 262.6C356.7 262.6 399.2 261.2 419.4 263.8C419.4 263.9 379.4 256.9 356.7 262.6Z\" fill=\"black\"></path>\n</svg>\n";


var $81fad595cad17dd4$exports = {};
$81fad595cad17dd4$exports = "<svg width=\"600\" height=\"600\" viewBox=\"0 0 600 600\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<path d=\"M300.1 393.3C330.5 393.3 355.1 373.9 355.1 350C355.1 326.1 330.5 306.7 300.1 306.7C269.7 306.7 245.1 326.1 245.1 350C245 374 269.7 393.3 300.1 393.3Z\" fill=\"#FF4040\"></path>\n<path d=\"M300.1 347.6C321.2 347.6 339.4 356.9 348.7 370.6C352.8 364.6 355.2 357.6 355.2 350.2C355.2 326.3 330.5 306.9 300.2 306.9C269.8 306.9 245.2 326.3 245.2 350.2C245.2 357.6 247.5 364.5 251.7 370.6C260.7 356.8 279 347.6 300.1 347.6Z\" fill=\"black\"></path>\n<path d=\"M219.3 281.1C209 281.2 200 285.3 194 291.5C198.2 281.9 207.6 275 218.8 274.6C220.5 274.5 222 274.6 223.6 274.8C224 274.9 224.1 274.4 223.8 274.2C215.7 270.1 207.8 268.3 203.7 267.5C203.3 267.4 203.3 266.8 203.6 267C233.6 265 243.2 281.5 246.4 292.5C240.1 285.5 230.3 281.1 219.3 281.1Z\" fill=\"black\"></path>\n<path d=\"M379.7 279.5C369.4 279.6 360.4 283.7 354.4 289.9C358.6 280.3 368 273.4 379.2 273C380.9 272.9 382.4 273 384 273.2C384.4 273.3 384.5 272.8 384.2 272.6C376.1 268.5 368.2 266.7 364.1 265.9C363.7 265.8 363.7 265.2 364 265.4C394 263.4 403.6 279.9 406.8 290.9C400.5 283.9 390.7 279.5 379.7 279.5Z\" fill=\"black\"></path>\n<path d=\"M219.6 297.2C232.082 297.2 242.2 293.395 242.2 288.7C242.2 284.006 232.082 280.2 219.6 280.2C207.118 280.2 197 284.006 197 288.7C197 293.395 207.118 297.2 219.6 297.2Z\" fill=\"white\"></path>\n<path d=\"M195 308.5C199.694 308.5 203.5 304.694 203.5 300C203.5 295.306 199.694 291.5 195 291.5C190.306 291.5 186.5 295.306 186.5 300C186.5 304.694 190.306 308.5 195 308.5Z\" fill=\"white\"></path>\n<path d=\"M214.9 305.7C219.594 305.7 223.4 301.895 223.4 297.2C223.4 292.506 219.594 288.7 214.9 288.7C210.205 288.7 206.4 292.506 206.4 297.2C206.4 301.895 210.205 305.7 214.9 305.7Z\" fill=\"white\"></path>\n<path d=\"M206.4 324.3C210.432 324.3 213.7 321.032 213.7 317C213.7 312.969 210.432 309.7 206.4 309.7C202.368 309.7 199.1 312.969 199.1 317C199.1 321.032 202.368 324.3 206.4 324.3Z\" fill=\"white\"></path>\n<path d=\"M191.7 334.6C194.572 334.6 196.9 332.272 196.9 329.4C196.9 326.528 194.572 324.2 191.7 324.2C188.828 324.2 186.5 326.528 186.5 329.4C186.5 332.272 188.828 334.6 191.7 334.6Z\" fill=\"white\"></path>\n<path d=\"M380.5 296.2C392.982 296.2 403.1 292.395 403.1 287.7C403.1 283.006 392.982 279.2 380.5 279.2C368.018 279.2 357.9 283.006 357.9 287.7C357.9 292.395 368.018 296.2 380.5 296.2Z\" fill=\"white\"></path>\n<path d=\"M405.1 307.5C409.794 307.5 413.6 303.694 413.6 299C413.6 294.306 409.794 290.5 405.1 290.5C400.405 290.5 396.6 294.306 396.6 299C396.6 303.694 400.405 307.5 405.1 307.5Z\" fill=\"white\"></path>\n<path d=\"M385.2 304.7C389.894 304.7 393.7 300.895 393.7 296.2C393.7 291.506 389.894 287.7 385.2 287.7C380.506 287.7 376.7 291.506 376.7 296.2C376.7 300.895 380.506 304.7 385.2 304.7Z\" fill=\"white\"></path>\n<path d=\"M393.7 323.3C397.732 323.3 401 320.032 401 316C401 311.969 397.732 308.7 393.7 308.7C389.668 308.7 386.4 311.969 386.4 316C386.4 320.032 389.668 323.3 393.7 323.3Z\" fill=\"white\"></path>\n<path d=\"M408.4 333.6C411.272 333.6 413.6 331.272 413.6 328.4C413.6 325.528 411.272 323.2 408.4 323.2C405.528 323.2 403.2 325.528 403.2 328.4C403.2 331.272 405.528 333.6 408.4 333.6Z\" fill=\"white\"></path>\n</svg>\n";


var $6f9f86c785ea4cb4$exports = {};
$6f9f86c785ea4cb4$exports = "<svg width=\"600\" height=\"600\" viewBox=\"0 0 600 600\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<path d=\"M212.1 354.4H388.1C397.3 354.4 401.5 344.5 394.6 339.2C363.1 315.3 291.6 277.9 205.8 339.1C198.5 344.2 202.7 354.4 212.1 354.4Z\" fill=\"black\"></path>\n<path d=\"M256.4 260.5C256.4 260.5 251.3 243.7 213.9 251C213.9 251 176.4 257.8 177.9 278.5C177.9 278.5 178.7 299.1 218.2 289.7C218.2 289.7 264.8 278.9 256.4 260.5Z\" fill=\"black\"></path>\n<path d=\"M256.4 260.5C256.4 260.5 251.3 243.7 213.9 251C213.9 251 176.4 257.8 177.9 278.5C177.9 278.5 178.7 299.1 218.2 289.7C218.2 289.7 264.8 278.9 256.4 260.5Z\" fill=\"black\"></path>\n<path d=\"M256.5 261.2C256.5 261.2 251.5 244.8 215 251.9C215 251.9 178.4 258.5 179.9 278.8C179.9 278.8 180.7 298.9 219.3 289.7C219.2 289.7 264.6 279.2 256.5 261.2Z\" fill=\"white\"></path>\n<path d=\"M218.6 278.1C222.742 278.1 226.1 274.742 226.1 270.6C226.1 266.457 222.742 263.1 218.6 263.1C214.458 263.1 211.1 266.457 211.1 270.6C211.1 274.742 214.458 278.1 218.6 278.1Z\" fill=\"black\"></path>\n<path d=\"M381.9 289.7C421.4 299.1 422.2 278.5 422.2 278.5C423.7 257.8 386.2 251 386.2 251C348.7 243.7 343.7 260.5 343.7 260.5C335.3 278.9 381.9 289.7 381.9 289.7Z\" fill=\"black\"></path>\n<path d=\"M381.9 289.7C421.4 299.1 422.2 278.5 422.2 278.5C423.7 257.8 386.2 251 386.2 251C348.7 243.7 343.7 260.5 343.7 260.5C335.3 278.9 381.9 289.7 381.9 289.7Z\" fill=\"black\"></path>\n<path d=\"M380.9 289.7C419.4 298.9 420.3 278.8 420.3 278.8C421.7 258.6 385.2 251.9 385.2 251.9C348.6 244.8 343.7 261.2 343.7 261.2C335.5 279.2 380.9 289.7 380.9 289.7Z\" fill=\"white\"></path>\n<path d=\"M381.5 278.1C385.642 278.1 389 274.742 389 270.6C389 266.457 385.642 263.1 381.5 263.1C377.358 263.1 374 266.457 374 270.6C374 274.742 377.358 278.1 381.5 278.1Z\" fill=\"black\"></path>\n</svg>\n";


var $ecf8032f8f5d59c3$exports = {};
$ecf8032f8f5d59c3$exports = "<svg width=\"600\" height=\"600\" viewBox=\"0 0 600 600\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<path d=\"M302.7 372.4C317.2 372.4 328.9 396.2 328.9 374.5C328.9 352.8 317.2 335.3 302.7 335.3C288.2 335.3 276.5 352.9 276.5 374.5C276.5 396.1 288.2 372.4 302.7 372.4Z\" fill=\"black\"></path>\n<path d=\"M195.7 241C181.5 272.2 184.1 304 201.7 312C219.2 320 245 301.2 259.3 270C259.3 270 270.4 246.4 268.2 225.1C267.9 222.5 265.4 220.7 262.8 221.3C252.2 223.8 235.1 230.2 205.3 229.2C203.1 229.1 201 230.3 199.9 232.3C198.9 234.1 197.5 236.9 195.7 241Z\" fill=\"black\"></path>\n<path d=\"M207 289.7C209.8 289.7 212.1 287.4 212.1 284.6C212.1 281.8 209.8 279.5 207 279.5C204.2 279.5 201.9 281.8 201.9 284.6C202 287.4 204.2 289.7 207 289.7Z\" fill=\"white\"></path>\n<path d=\"M227.7 235.6L221.3 238.9C220.6 239.3 220.6 240.4 221.3 240.8L227.7 244.1C231.6 246.1 234.4 249.8 235.2 254L237.4 264.9C237.6 266.1 239.3 266.1 239.5 264.9L241.7 254C242.5 249.7 245.3 246.1 249.2 244.1L255.6 240.8C256.3 240.4 256.3 239.3 255.6 238.9L249.2 235.6C245.5 233.7 242.9 230.4 241.9 226.5C239.6 227 237.1 227.4 234.5 227.8C233.4 231.1 230.9 233.9 227.7 235.6Z\" fill=\"white\"></path>\n<path d=\"M400.2 232.4C399.1 230.4 397 229.3 394.8 229.3C364.9 230.3 347.9 223.9 337.3 221.4C334.7 220.8 332.2 222.5 331.9 225.2C329.7 246.5 340.8 270.1 340.8 270.1C355 301.3 380.8 320.1 398.4 312.1C415.9 304.1 418.6 272.3 404.4 241.1C402.5 236.9 401.1 234.1 400.2 232.4Z\" fill=\"black\"></path>\n<path d=\"M398 284.6C398 281.8 395.7 279.5 392.9 279.5C390.1 279.5 387.8 281.8 387.8 284.6C387.8 287.4 390.1 289.7 392.9 289.7C395.8 289.7 398 287.4 398 284.6Z\" fill=\"white\"></path>\n<path d=\"M372.3 235.6L378.7 238.9C379.4 239.3 379.4 240.4 378.7 240.8L372.3 244.1C368.4 246.1 365.6 249.8 364.8 254L362.6 264.9C362.4 266.1 360.7 266.1 360.5 264.9L358.3 254C357.5 249.7 354.7 246.1 350.8 244.1L344.4 240.8C343.7 240.4 343.7 239.3 344.4 238.9L350.8 235.6C354.5 233.7 357.1 230.4 358.1 226.5C360.4 227 362.9 227.4 365.5 227.8C366.7 231.1 369.1 233.9 372.3 235.6Z\" fill=\"white\"></path>\n</svg>\n";


var $425650c39ecebf73$exports = {};
$425650c39ecebf73$exports = "<svg width=\"600\" height=\"600\" viewBox=\"0 0 600 600\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<path d=\"M237.4 313.7H190V386.8H237.4V313.7Z\" fill=\"white\"></path>\n<path d=\"M410 313.7H362.6V386.8H410V313.7Z\" fill=\"white\"></path>\n<path d=\"M210.9 312.3C192.7 312.3 176.4 304.3 165.4 291.6C172.4 309.9 190.2 322.9 210.9 322.9C231.7 322.9 249.4 309.9 256.4 291.6C245.4 304.3 229.1 312.3 210.9 312.3Z\" fill=\"black\"></path>\n<path d=\"M389.1 312.3C370.9 312.3 354.6 304.3 343.6 291.6C350.6 309.9 368.4 322.9 389.1 322.9C409.9 322.9 427.6 309.9 434.6 291.6C423.5 304.3 407.2 312.3 389.1 312.3Z\" fill=\"black\"></path>\n<path d=\"M301.5 367.4C308.9 367.4 315.4 370.2 319.2 374.4C319.2 357.3 311.4 343.7 301.5 343.7C291.8 343.7 283.8 357.5 283.7 374.4C287.6 370.2 294.1 367.4 301.5 367.4Z\" fill=\"black\"></path>\n</svg>\n";


var $0c2c5df9c2381dee$exports = {};
$0c2c5df9c2381dee$exports = "<svg width=\"600\" height=\"600\" viewBox=\"0 0 600 600\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<path d=\"M337.3 350.1H262.8V355.9H337.3V350.1Z\" fill=\"black\"></path>\n<path d=\"M211.3 301.8C245.7 301.8 273.5 288.9 273.5 272.9C273.5 256.9 245.6 244 211.3 244C177 244 149 256.9 149 272.9C149 288.8 176.9 301.8 211.3 301.8Z\" fill=\"black\"></path>\n<path d=\"M211.046 298.036C241.394 298.036 266 286.644 266 272.518C266 258.392 241.394 247 211.046 247C180.698 247 156 258.392 156 272.518C156 286.553 180.606 298.036 211.046 298.036Z\" fill=\"white\"></path>\n<path d=\"M211.4 280.099C215.321 280.099 218.5 276.921 218.5 272.999C218.5 269.078 215.321 265.899 211.4 265.899C207.479 265.899 204.3 269.078 204.3 272.999C204.3 276.921 207.479 280.099 211.4 280.099Z\" fill=\"black\"></path>\n<path d=\"M388.2 301.8C422.6 301.8 450.4 288.9 450.4 272.9C450.4 256.9 422.5 244 388.2 244C353.9 244 326 256.9 326 272.9C326 288.8 353.9 301.8 388.2 301.8Z\" fill=\"black\"></path>\n<path d=\"M389 298.078C419.373 298.078 444 286.677 444 272.539C444 258.401 419.373 247 389 247C358.627 247 334 258.401 334 272.539C334 286.585 358.627 298.078 389 298.078Z\" fill=\"white\"></path>\n<path d=\"M388.6 280.099C392.521 280.099 395.7 276.921 395.7 272.999C395.7 269.078 392.521 265.899 388.6 265.899C384.679 265.899 381.5 269.078 381.5 272.999C381.5 276.921 384.679 280.099 388.6 280.099Z\" fill=\"black\"></path>\n</svg>\n";


var $35d36fb309e8fd30$exports = {};
$35d36fb309e8fd30$exports = "<svg width=\"600\" height=\"600\" viewBox=\"0 0 600 600\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<path d=\"M210.9 283.1C229.7 283.1 245 272.2 245 258.8C245 245.4 229.7 234.5 210.9 234.5C192.1 234.5 176.8 245.4 176.8 258.8C176.9 272.2 192.1 283.1 210.9 283.1Z\" fill=\"black\"></path>\n<path d=\"M212 283.1C230.2 283.1 245 272.5 245 259.5C245 246.5 230.2 235.9 212 235.9C193.8 235.9 179 246.5 179 259.5C179 272.5 193.8 283.1 212 283.1Z\" fill=\"white\"></path>\n<path d=\"M210.9 267C215.042 267 218.4 263.642 218.4 259.5C218.4 255.358 215.042 252 210.9 252C206.758 252 203.4 255.358 203.4 259.5C203.4 263.642 206.758 267 210.9 267Z\" fill=\"black\"></path>\n<path d=\"M423.1 258.7C423.1 245.3 407.8 234.4 389 234.4C370.2 234.4 354.9 245.3 354.9 258.7C354.9 272.1 370.2 283 389 283C407.8 283 423.1 272.2 423.1 258.7Z\" fill=\"black\"></path>\n<path d=\"M421 259.5C421 246.5 406.2 235.9 388 235.9C369.8 235.9 355 246.5 355 259.5C355 272.5 369.8 283.1 388 283.1C406.2 283.1 421 272.5 421 259.5Z\" fill=\"white\"></path>\n<path d=\"M389.1 267C393.242 267 396.6 263.642 396.6 259.5C396.6 255.358 393.242 252 389.1 252C384.958 252 381.6 255.358 381.6 259.5C381.6 263.642 384.958 267 389.1 267Z\" fill=\"black\"></path>\n<path d=\"M353.9 327C353.9 322.6 351.6 320.3 350.1 323.1C345.2 332.1 336.1 338.2 325.8 338.2C315.7 338.2 307 332.5 302 324C301.6 322.6 300.8 321.9 300.1 321.9C299.4 321.9 298.6 322.6 298.2 324C293.2 332.6 284.4 338.2 274.4 338.2C264 338.2 254.9 332.2 250.1 323.1C248.6 320.3 246.3 322.6 246.3 327V327.1C246.3 343.9 258.9 351.5 274.5 351.5C274.8 351.5 275 351.5 275.3 351.5L269.8 399C269.6 400.2 270.6 401.2 271.7 401.2H328.6C329.8 401.2 330.7 400.2 330.5 399L325 351.5C325.3 351.5 325.5 351.5 325.8 351.5C341.3 351.6 353.9 343.9 353.9 327Z\" fill=\"black\"></path>\n</svg>\n";


var $2733aad9d952cc25$exports = {};
$2733aad9d952cc25$exports = "<svg width=\"600\" height=\"600\" viewBox=\"0 0 600 600\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<path d=\"M221.5 303.9C248.4 303.9 270.2 282.1 270.2 255.2H172.7C172.7 282.1 194.6 303.9 221.5 303.9Z\" fill=\"black\"></path>\n<path d=\"M222.1 304.3C248.1 304.3 269.2 283.9 269.2 258.8H175C175 283.9 196.1 304.3 222.1 304.3Z\" fill=\"white\"></path>\n<path d=\"M221.5 283.601C225.366 283.601 228.5 280.467 228.5 276.601C228.5 272.735 225.366 269.601 221.5 269.601C217.634 269.601 214.5 272.735 214.5 276.601C214.5 280.467 217.634 283.601 221.5 283.601Z\" fill=\"black\"></path>\n<path d=\"M378.5 303.9C405.4 303.9 427.2 282.1 427.2 255.2H329.7C329.7 282.1 351.6 303.9 378.5 303.9Z\" fill=\"black\"></path>\n<path d=\"M379.1 304.3C405.1 304.3 426.2 283.9 426.2 258.8H332C331.9 283.9 353.1 304.3 379.1 304.3Z\" fill=\"white\"></path>\n<path d=\"M378.4 283.601C382.266 283.601 385.4 280.467 385.4 276.601C385.4 272.735 382.266 269.601 378.4 269.601C374.534 269.601 371.4 272.735 371.4 276.601C371.4 280.467 374.534 283.601 378.4 283.601Z\" fill=\"black\"></path>\n<path d=\"M299.9 370.5C308.46 370.5 315.4 360.829 315.4 348.9C315.4 336.97 308.46 327.3 299.9 327.3C291.34 327.3 284.4 336.97 284.4 348.9C284.4 360.829 291.34 370.5 299.9 370.5Z\" fill=\"black\"></path>\n</svg>\n";


var $aa5efcd29add21f7$exports = {};
$aa5efcd29add21f7$exports = "<svg width=\"600\" height=\"600\" viewBox=\"0 0 600 600\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<path d=\"M219.5 320.8C244.6 320.8 265 300.4 265 275.3C265 250.2 244.6 229.8 219.5 229.8C194.4 229.8 174 250.2 174 275.3C174 300.4 194.4 320.8 219.5 320.8Z\" fill=\"black\"></path>\n<path d=\"M380.5 320.8C405.6 320.8 426 300.4 426 275.3C426 250.2 405.6 229.8 380.5 229.8C355.4 229.8 335 250.2 335 275.3C335 300.4 355.4 320.8 380.5 320.8Z\" fill=\"black\"></path>\n<path d=\"M299.9 336.8C287 336.8 276.7 355.5 276.7 378.6H323.3C323.3 355.5 312.9 336.8 299.9 336.8Z\" fill=\"black\"></path>\n<path d=\"M219.5 318.2C243.2 318.2 262.4 299 262.4 275.3C262.4 251.6 243.2 232.4 219.5 232.4C195.8 232.4 176.6 251.6 176.6 275.3C176.6 299 195.8 318.2 219.5 318.2Z\" fill=\"white\"></path>\n<path d=\"M219.5 283.9C224.25 283.9 228.1 280.05 228.1 275.3C228.1 270.551 224.25 266.7 219.5 266.7C214.75 266.7 210.9 270.551 210.9 275.3C210.9 280.05 214.75 283.9 219.5 283.9Z\" fill=\"black\"></path>\n<path d=\"M380.5 318.2C404.2 318.2 423.4 299 423.4 275.3C423.4 251.6 404.2 232.4 380.5 232.4C356.8 232.4 337.6 251.6 337.6 275.3C337.6 299 356.8 318.2 380.5 318.2Z\" fill=\"white\"></path>\n<path d=\"M380.5 283.9C385.25 283.9 389.1 280.05 389.1 275.3C389.1 270.551 385.25 266.7 380.5 266.7C375.75 266.7 371.9 270.551 371.9 275.3C371.9 280.05 375.75 283.9 380.5 283.9Z\" fill=\"black\"></path>\n</svg>\n";


var $0d0bcd71fd1fded5$exports = {};
$0d0bcd71fd1fded5$exports = "<svg width=\"600\" height=\"600\" viewBox=\"0 0 600 600\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<path d=\"M288.1 351.3L264.5 392.2H335.5L311.9 351.3C306.6 342.1 293.4 342.1 288.1 351.3Z\" fill=\"black\"></path>\n<path d=\"M192.4 286.6C214.4 311.8 249.2 317.3 270.2 299L190.4 208C169.3 226.2 170.3 261.4 192.4 286.6Z\" fill=\"black\"></path>\n<path d=\"M191.3 288.1C211.9 311.7 244.5 316.8 264.1 299.7L189.4 214.5C169.7 231.5 170.6 264.5 191.3 288.1Z\" fill=\"white\"></path>\n<path d=\"M213.1 272.4C217.905 272.4 221.8 268.505 221.8 263.7C221.8 258.895 217.905 255 213.1 255C208.295 255 204.4 258.895 204.4 263.7C204.4 268.505 208.295 272.4 213.1 272.4Z\" fill=\"black\"></path>\n<path d=\"M409.7 208L329.9 299C350.9 317.3 385.7 311.8 407.7 286.6C429.8 261.4 430.7 226.2 409.7 208Z\" fill=\"black\"></path>\n<path d=\"M410.6 214.5L336 299.7C355.6 316.8 388.2 311.7 408.8 288.1C429.5 264.5 430.3 231.5 410.6 214.5Z\" fill=\"white\"></path>\n<path d=\"M387 272.4C391.805 272.4 395.7 268.505 395.7 263.7C395.7 258.895 391.805 255 387 255C382.195 255 378.3 258.895 378.3 263.7C378.3 268.505 382.195 272.4 387 272.4Z\" fill=\"black\"></path>\n</svg>\n";


var $8b97ebce8a33c024$exports = {};
$8b97ebce8a33c024$exports = "<svg width=\"600\" height=\"600\" viewBox=\"0 0 600 600\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<path d=\"M300 399.7C310.9 399.7 319.8 384 319.8 364.6C319.8 345.2 310.9 329.5 300 329.5C289.1 329.5 280.2 345.2 280.2 364.6C280.2 384 289.1 399.7 300 399.7Z\" fill=\"black\"></path>\n<path d=\"M212.1 295.9C224.1 298.6 234.4 303 241.3 307.9C243.2 309.3 245.9 308.9 247.3 307.1C252.6 300.4 256.6 292.2 258.7 282.9C264.9 255.1 251.3 228.4 228.3 223.3C205.3 218.2 181.6 236.6 175.4 264.4C173.3 273.7 173.5 282.9 175.5 291.1C176.1 293.4 178.3 294.9 180.6 294.4C188.9 292.8 200.1 293.2 212.1 295.9Z\" fill=\"black\"></path>\n<path d=\"M213.4 297.401C224.5 300.601 234 305.201 240.2 310.201C241.9 311.601 244.5 311.401 245.9 309.801C251.2 303.801 255.4 296.301 257.9 287.701C265.2 261.901 253.8 236.201 232.5 230.201C211.2 224.201 188 240.201 180.7 266.001C178.2 274.601 177.9 283.301 179.4 291.101C179.8 293.301 181.8 294.801 184 294.501C191.8 293.201 202.3 294.201 213.4 297.401Z\" fill=\"white\"></path>\n<path d=\"M219.2 279.901C224.668 279.901 229.1 275.468 229.1 270.001C229.1 264.533 224.668 260.101 219.2 260.101C213.732 260.101 209.3 264.533 209.3 270.001C209.3 275.468 213.732 279.901 219.2 279.901Z\" fill=\"black\"></path>\n<path d=\"M419.4 294.4C421.7 294.9 423.9 293.4 424.5 291.1C426.5 282.9 426.7 273.7 424.6 264.4C418.4 236.6 394.7 218.2 371.7 223.3C348.7 228.4 335.1 255.1 341.3 282.9C343.4 292.2 347.4 300.4 352.7 307.1C354.1 308.9 356.8 309.3 358.7 307.9C365.6 303 375.9 298.6 387.9 295.9C399.9 293.2 411.1 292.8 419.4 294.4Z\" fill=\"black\"></path>\n<path d=\"M416.1 294.3C418.3 294.6 420.3 293.1 420.7 290.9C422.1 283.1 421.8 274.5 419.4 265.8C412.1 240 388.9 224 367.6 230C346.3 236 334.9 261.8 342.2 287.5C344.7 296.1 348.8 303.6 354.2 309.6C355.6 311.2 358.2 311.4 359.9 310C366.1 305 375.6 300.4 386.7 297.2C397.7 294.2 408.2 293.2 416.1 294.3Z\" fill=\"white\"></path>\n<path d=\"M380.8 279.901C386.268 279.901 390.7 275.468 390.7 270.001C390.7 264.533 386.268 260.101 380.8 260.101C375.332 260.101 370.9 264.533 370.9 270.001C370.9 275.468 375.332 279.901 380.8 279.901Z\" fill=\"black\"></path>\n</svg>\n";


var $a8fa36c28a96e9e2$exports = {};
$a8fa36c28a96e9e2$exports = "<svg width=\"600\" height=\"600\" viewBox=\"0 0 600 600\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<path d=\"M299.9 312.4C253.7 312.4 215.4 333.1 207.9 360.2C206.5 365 210.3 370.1 215.5 370.1H384.6C389.7 370.1 393.5 365.3 392.2 360.2C384.5 333.1 346.1 312.4 299.9 312.4Z\" fill=\"black\"></path>\n<path d=\"M183.6 308.2C200.6 308.2 214.4 304.1 214.4 299.1C214.4 294.1 200.7 290 183.6 290C166.5 290 152.9 294.1 152.9 299.1C153 304.1 166.7 308.2 183.6 308.2Z\" fill=\"#FF4D4D\"></path>\n<path d=\"M416.4 308.2C433.4 308.2 447.2 304.1 447.2 299.1C447.2 294.1 433.5 290 416.4 290C399.4 290 385.6 294.1 385.6 299.1C385.6 304.1 399.5 308.2 416.4 308.2Z\" fill=\"#FF4D4D\"></path>\n<path d=\"M239.5 244.2C239.5 244.2 243.2 219.7 209 237.7C209 237.7 172.4 256.8 165.2 273C165.2 273 155 302.2 191.9 281.8C191.9 281.5 238.9 257.7 239.5 244.2Z\" fill=\"black\"></path>\n<path d=\"M237.6 246.5C237.6 246.5 240.9 223.7 208.1 241.2C208.1 241.2 173.1 259.8 166.3 274.9C166.3 274.9 156.8 302.2 192.2 282.3C192.1 282.3 237.2 259.1 237.6 246.5Z\" fill=\"white\"></path>\n<path d=\"M201.4 267.5C205.542 267.5 208.9 264.142 208.9 260C208.9 255.858 205.542 252.5 201.4 252.5C197.258 252.5 193.9 255.858 193.9 260C193.9 264.142 197.258 267.5 201.4 267.5Z\" fill=\"black\"></path>\n<path d=\"M408 281.601C444.9 301.9 434.7 272.8 434.7 272.8C427.6 256.7 391 237.5 391 237.5C356.8 219.6 360.5 244 360.5 244C361.1 257.7 408.1 281.501 408 281.601Z\" fill=\"black\"></path>\n<path d=\"M407.8 282.5C443.2 302.3 433.7 275.1 433.7 275.1C427 260 391.9 241.4 391.9 241.4C359.2 223.9 362.4 246.7 362.4 246.7C362.8 259.1 407.9 282.3 407.8 282.5Z\" fill=\"white\"></path>\n<path d=\"M398.6 267.5C402.742 267.5 406.1 264.142 406.1 260C406.1 255.858 402.742 252.5 398.6 252.5C394.458 252.5 391.1 255.858 391.1 260C391.1 264.142 394.458 267.5 398.6 267.5Z\" fill=\"black\"></path>\n</svg>\n";


var $4a72ca62f05f102f$exports = {};
$4a72ca62f05f102f$exports = "<svg width=\"600\" height=\"600\" viewBox=\"0 0 600 600\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<path d=\"M300 355.9C313.2 355.9 324.8 363.5 331.8 375.1C329.6 357 316.2 343.2 300 343.2C283.8 343.2 270.4 357.1 268.2 375.1C275.2 363.5 286.8 355.9 300 355.9Z\" fill=\"black\"></path>\n<path d=\"M162.7 230.5C162.7 230.5 197.9 201.4 235.8 230.5C235.7 230.5 199.8 223 162.7 230.5Z\" fill=\"black\"></path>\n<path d=\"M215 303.9H183.4C174.9 303.9 167.9 296.9 167.9 288.4V249.7C167.9 241.2 174.9 234.2 183.4 234.2H215C223.5 234.2 230.5 241.2 230.5 249.7V288.4C230.5 296.9 223.5 303.9 215 303.9Z\" fill=\"black\"></path>\n<path d=\"M207 264.5H199.8C196.2 264.5 193.2 261.5 193.2 257.9V250.7C193.2 247.1 196.2 244.1 199.8 244.1H207C210.6 244.1 213.6 247.1 213.6 250.7V257.9C213.6 261.6 210.6 264.5 207 264.5Z\" fill=\"white\"></path>\n<path d=\"M186.7 289H183.5C181.8 289 180.4 287.6 180.4 285.9V282.7C180.4 281 181.8 279.6 183.5 279.6H186.7C188.4 279.6 189.8 281 189.8 282.7V285.9C189.8 287.6 188.4 289 186.7 289Z\" fill=\"white\"></path>\n<path d=\"M214.3 280.1L220.1 280.9C221.1 281 221.4 282.4 220.5 282.9L215.5 286.1L214.7 291.9C214.6 292.9 213.2 293.2 212.7 292.3L209.5 287.3L203.7 286.5C202.7 286.4 202.4 285 203.3 284.5L208.3 281.3L209.1 275.5C209.2 274.5 210.6 274.2 211.1 275.1L214.3 280.1Z\" fill=\"#B58A00\"></path>\n<path d=\"M364.3 230.5C364.3 230.5 399.5 201.4 437.4 230.5C437.3 230.5 401.4 223 364.3 230.5Z\" fill=\"black\"></path>\n<path d=\"M416.6 303.9H385C376.5 303.9 369.5 296.9 369.5 288.4V249.7C369.5 241.2 376.5 234.2 385 234.2H416.6C425.1 234.2 432.1 241.2 432.1 249.7V288.4C432.1 296.9 425.1 303.9 416.6 303.9Z\" fill=\"black\"></path>\n<path d=\"M408.6 264.5H401.4C397.8 264.5 394.8 261.5 394.8 257.9V250.7C394.8 247.1 397.8 244.1 401.4 244.1H408.6C412.2 244.1 415.2 247.1 415.2 250.7V257.9C415.2 261.6 412.2 264.5 408.6 264.5Z\" fill=\"white\"></path>\n<path d=\"M388.3 289H385.1C383.4 289 382 287.6 382 285.9V282.7C382 281 383.4 279.6 385.1 279.6H388.3C390 279.6 391.4 281 391.4 282.7V285.9C391.4 287.6 390 289 388.3 289Z\" fill=\"white\"></path>\n<path d=\"M415.9 280.1L421.7 280.9C422.7 281 423 282.4 422.1 282.9L417.1 286.1L416.3 291.9C416.2 292.9 414.8 293.2 414.3 292.3L411.1 287.3L405.3 286.5C404.3 286.4 404 285 404.9 284.5L409.9 281.3L410.7 275.5C410.8 274.5 412.2 274.2 412.7 275.1L415.9 280.1Z\" fill=\"#B58A00\"></path>\n</svg>\n";


var $5f068f1719a1ec64$exports = {};
$5f068f1719a1ec64$exports = "<svg width=\"600\" height=\"600\" viewBox=\"0 0 600 600\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<path d=\"M224.8 277.4H194.1V394.9H224.8V277.4Z\" fill=\"white\"></path>\n<path d=\"M405.9 277.4H375.2V394.9H405.9V277.4Z\" fill=\"white\"></path>\n<path d=\"M211.8 275.2C201.8 275.2 192.7 272 186 266.9C186.8 268.7 187.8 270.4 189 271.9C186.1 274.5 179 279.5 168.6 277.9C168.6 277.9 179.9 284.3 194.3 277.4C199.2 281.3 205.3 283.6 211.9 283.6C223.3 283.6 233.1 276.8 237.8 266.9C230.9 272.1 221.8 275.2 211.8 275.2Z\" fill=\"black\"></path>\n<path d=\"M388.2 275.2C398.2 275.2 407.3 272 414 266.9C413.2 268.7 412.2 270.4 411 271.9C413.9 274.5 421 279.5 431.4 277.9C431.4 277.9 420.1 284.3 405.7 277.4C400.8 281.3 394.7 283.6 388.1 283.6C376.7 283.6 366.9 276.8 362.2 266.9C369.1 272.1 378.2 275.2 388.2 275.2Z\" fill=\"black\"></path>\n<path d=\"M300 321.3C263.1 321.3 233.2 340.7 233.2 364.6H366.9C366.9 340.7 337 321.3 300 321.3Z\" fill=\"white\"></path>\n<path d=\"M341.5 330.599L334.2 339.099C333.9 339.499 333.2 339.399 333 338.899L328.9 325.899L328.8 325.599C320.1 322.899 310.3 321.399 300.1 321.399C289.8 321.399 280.1 322.899 271.4 325.599C271.3 325.599 271.3 325.599 271.2 325.599L271.1 325.899L267 338.899C266.8 339.399 266.2 339.499 265.8 339.099L258.5 330.599C246.5 336.799 237.8 345.499 234.6 355.599C233.2 359.999 236.4 364.499 241 364.499H359C363.6 364.499 366.8 359.999 365.4 355.599C362.2 345.599 353.5 336.799 341.5 330.599Z\" fill=\"black\"></path>\n</svg>\n";


var $19e45f8acff8aafc$exports = {};
$19e45f8acff8aafc$exports = "<svg width=\"226\" height=\"226\" viewBox=\"0 0 226 226\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<path d=\"M113 4.44099L135.393 0.5L154.561 12.682L176.774 17.697L189.672 36.328L208.303 49.226L213.318 71.439L225.5 90.607L221.559 113L225.5 135.393L213.318 154.561L208.303 176.774L189.672 189.672L176.774 208.303L154.561 213.318L135.393 225.5L113 221.559L90.607 225.5L71.439 213.318L49.226 208.303L36.328 189.672L17.697 176.774L12.682 154.561L0.5 135.393L4.44099 113L0.5 90.607L12.682 71.439L17.697 49.226L36.328 36.328L49.226 17.697L71.439 12.682L90.607 0.5L113 4.44099Z\" fill=\"#D9D9D9\" stroke=\"black\" stroke-width=\"0.5\" stroke-miterlimit=\"10\"></path>\n</svg>\n";


var $05d4e0276be0fba5$exports = {};
$05d4e0276be0fba5$exports = "<svg width=\"311\" height=\"310\" viewBox=\"0 0 311 310\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n\n  <path stroke-width=\"1\" stroke=\"#000000\" d=\"M213.16 179.8L254.36 190.8L209.06 169.7L259.06 173.2L220.06 162L310.76 155L217.96 147.8L259.06 136.7L209.26 141.1L254.36 119.1L214.96 128.9L290.06 77.5L206.06 117.7L236.16 87.5L195.16 116.2L223.26 74.6L193.96 102.8L233.26 20.7L180.66 97.6L191.66 56.4L170.56 101.7L173.96 51.7L162.76 90.7L155.76 0L148.66 92.8L137.56 51.7L141.96 101.5L119.96 56.4L129.76 95.8L78.26 20.7L118.56 104.7L88.36 74.6L117.06 115.6L75.46 87.5L103.66 116.8L21.56 77.5L98.36 130.1L57.26 119.1L102.56 140.2L52.46 136.7L91.56 147.9L0.76001 155L93.66 162.1L52.46 173.2L102.36 168.8L57.26 190.8L96.66 181L21.56 232.5L105.56 192.2L75.46 222.4L116.46 193.7L88.36 235.3L117.56 207.1L78.26 289.2L130.96 212.4L119.96 253.5L141.06 208.2L137.56 258.3L148.76 219.2L155.76 310L162.96 217.1L173.96 258.2L169.66 208.4L191.66 253.5L181.86 214.1L233.26 289.2L193.06 205.2L223.26 235.3L194.56 194.3L236.16 222.4L207.96 193.1L290.06 232.5L213.16 179.8Z\" fill=\"#D0D0D0\"></path>\n</svg>";


var $bcd860fc9816ccdc$exports = {};
$bcd860fc9816ccdc$exports = "<svg width=\"113\" height=\"112\" viewBox=\"0 0 113 112\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n  <path stroke-width=\"1\" stroke=\"#000000\" d=\"M56.5136 0L63.2136 13.5L73.7136 2.7L75.8136 17.6L89.2136 10.6L86.6136 25.5L101.514 22.9L94.4136 36.2L109.414 38.4L98.5136 48.9L112.114 55.6L98.5136 62.2L109.414 72.7L94.4136 74.9L101.514 88.2L86.6136 85.7L89.2136 100.5L75.8136 93.5L73.7136 108.4L63.2136 97.6L56.5136 111.2L49.9136 97.6L39.3136 108.4L37.2136 93.5L23.8136 100.5L26.4136 85.7L11.5136 88.2L18.6136 74.9L3.61357 72.7L14.5136 62.2L0.913574 55.6L14.5136 48.9L3.61357 38.4L18.6136 36.2L11.5136 22.9L26.4136 25.5L23.8136 10.6L37.2136 17.6L39.3136 2.7L49.9136 13.5L56.5136 0Z\" fill=\"#CCCCCC\"></path>\n</svg>";


var $938ede6ee416a731$exports = {};
$938ede6ee416a731$exports = "<svg width=\"113\" height=\"112\" viewBox=\"0 0 113 112\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<path d=\"M39.0136 68.4303C47.1874 68.4303 53.8136 60.9534 53.8136 51.7303C53.8136 42.5071 47.1874 35.0303 39.0136 35.0303C30.8398 35.0303 24.2136 42.5071 24.2136 51.7303C24.2136 60.9534 30.8398 68.4303 39.0136 68.4303Z\" fill=\"white\"></path>\n<path d=\"M47.3137 59.1305C49.2467 59.1305 50.8137 57.4739 50.8137 55.4305C50.8137 53.387 49.2467 51.7305 47.3137 51.7305C45.3807 51.7305 43.8137 53.387 43.8137 55.4305C43.8137 57.4739 45.3807 59.1305 47.3137 59.1305Z\" fill=\"black\"></path>\n<path d=\"M74.0136 68.4303C82.1874 68.4303 88.8136 60.9534 88.8136 51.7303C88.8136 42.5071 82.1874 35.0303 74.0136 35.0303C65.8398 35.0303 59.2136 42.5071 59.2136 51.7303C59.2136 60.9534 65.8398 68.4303 74.0136 68.4303Z\" fill=\"white\"></path>\n<path d=\"M65.7136 59.1305C67.6466 59.1305 69.2136 57.4739 69.2136 55.4305C69.2136 53.387 67.6466 51.7305 65.7136 51.7305C63.7806 51.7305 62.2136 53.387 62.2136 55.4305C62.2136 57.4739 63.7806 59.1305 65.7136 59.1305Z\" fill=\"black\"></path>\n</svg>\n";


const $123b50dec58735f8$var$BODY_SCALE = 4 // match to calculations.js !!
;
const $123b50dec58735f8$var$WITHERING_STEPS = 3000;
const $123b50dec58735f8$var$GAME_LENGTH_BY_LEVEL_INDEX = [
    30,
    10,
    20,
    30,
    40,
    50
];
const $123b50dec58735f8$var$LEVELS = $123b50dec58735f8$var$GAME_LENGTH_BY_LEVEL_INDEX.length - 1;
const $123b50dec58735f8$var$rot = {
    fg: {
        direction: 1,
        speed: 25
    },
    bg: {
        direction: -1,
        speed: 35
    },
    core: {
        direction: 1,
        speed: 100
    }
};
const $123b50dec58735f8$var$rotOverride = {
    fg: {
        1: {
            speed: 0
        },
        8: {
            speed: 0
        },
        9: {
            direction: -1
        }
    }
};
const $123b50dec58735f8$var$BG_SVGS = [
    (0, (/*@__PURE__*/$parcel$interopDefault($24fac91916510773$exports))),
    (0, (/*@__PURE__*/$parcel$interopDefault($606fb671979169db$exports))),
    (0, (/*@__PURE__*/$parcel$interopDefault($c79ba3aa7a32c09e$exports))),
    (0, (/*@__PURE__*/$parcel$interopDefault($4a3db75e624ce7f0$exports))),
    (0, (/*@__PURE__*/$parcel$interopDefault($983c31a1bd7b5434$exports))),
    (0, (/*@__PURE__*/$parcel$interopDefault($5da37ce79facd1a0$exports))),
    (0, (/*@__PURE__*/$parcel$interopDefault($093551ee879ffa74$exports))),
    (0, (/*@__PURE__*/$parcel$interopDefault($a9e239461e86411f$exports))),
    (0, (/*@__PURE__*/$parcel$interopDefault($83828c5f4a5cba60$exports))),
    (0, (/*@__PURE__*/$parcel$interopDefault($d0ca0a5da62347cc$exports)))
];
const $123b50dec58735f8$var$FG_SVGS = [
    (0, (/*@__PURE__*/$parcel$interopDefault($3552c8b8474f03c7$exports))),
    (0, (/*@__PURE__*/$parcel$interopDefault($84d626029e66eee6$exports))),
    (0, (/*@__PURE__*/$parcel$interopDefault($5cd5d5a39d9a3609$exports))),
    (0, (/*@__PURE__*/$parcel$interopDefault($3d64790b2c72e50e$exports))),
    (0, (/*@__PURE__*/$parcel$interopDefault($541c554e7117d234$exports))),
    (0, (/*@__PURE__*/$parcel$interopDefault($23a52e4b08eba078$exports))),
    (0, (/*@__PURE__*/$parcel$interopDefault($75738f56e414472f$exports))),
    (0, (/*@__PURE__*/$parcel$interopDefault($d775b5e6c3ea5c01$exports))),
    (0, (/*@__PURE__*/$parcel$interopDefault($3607475d23d1679f$exports))),
    (0, (/*@__PURE__*/$parcel$interopDefault($bc6313acfb197bb4$exports)))
];
const $123b50dec58735f8$var$FACE_SVGS = [
    (0, (/*@__PURE__*/$parcel$interopDefault($31ca591cbd92cc5b$exports))),
    (0, (/*@__PURE__*/$parcel$interopDefault($dc8b3e81fa0aa1c5$exports))),
    (0, (/*@__PURE__*/$parcel$interopDefault($20b034a9e9a3f9e6$exports))),
    (0, (/*@__PURE__*/$parcel$interopDefault($fe2f959314b6fd76$exports))),
    (0, (/*@__PURE__*/$parcel$interopDefault($4a17508d1c9a9d0d$exports))),
    (0, (/*@__PURE__*/$parcel$interopDefault($96f680ab433e6798$exports))),
    (0, (/*@__PURE__*/$parcel$interopDefault($4454a8662bcb05a5$exports))),
    (0, (/*@__PURE__*/$parcel$interopDefault($e18649a10a80c8f1$exports))),
    (0, (/*@__PURE__*/$parcel$interopDefault($d83fdf83df3a4f53$exports))),
    (0, (/*@__PURE__*/$parcel$interopDefault($0ef0c6c65d5fff9a$exports))),
    (0, (/*@__PURE__*/$parcel$interopDefault($39ddbcba7b1507d3$exports))),
    (0, (/*@__PURE__*/$parcel$interopDefault($aec7e37f762540d2$exports))),
    (0, (/*@__PURE__*/$parcel$interopDefault($041ef4b4b97b4215$exports))),
    (0, (/*@__PURE__*/$parcel$interopDefault($38a26c3bc65c2d53$exports)))
];
const $123b50dec58735f8$var$FACE_BLINK_SVGS = [
    (0, (/*@__PURE__*/$parcel$interopDefault($b79d573bdaa407de$exports))),
    (0, (/*@__PURE__*/$parcel$interopDefault($9d97e8282715b617$exports))),
    (0, (/*@__PURE__*/$parcel$interopDefault($0504228cf2ecfe0d$exports))),
    (0, (/*@__PURE__*/$parcel$interopDefault($c84b315a9edda562$exports))),
    (0, (/*@__PURE__*/$parcel$interopDefault($340c7240e284f5b6$exports))),
    (0, (/*@__PURE__*/$parcel$interopDefault($b9a9c8f05a36dc94$exports))),
    (0, (/*@__PURE__*/$parcel$interopDefault($186d6b8c098a700a$exports))),
    (0, (/*@__PURE__*/$parcel$interopDefault($31d3ed1a88ca5eec$exports))),
    (0, (/*@__PURE__*/$parcel$interopDefault($47f8ace5f882f953$exports))),
    (0, (/*@__PURE__*/$parcel$interopDefault($131bd80b28bbd8f9$exports))),
    (0, (/*@__PURE__*/$parcel$interopDefault($1a0bdb3785aceb06$exports))),
    (0, (/*@__PURE__*/$parcel$interopDefault($9b528f7f944b02ae$exports))),
    (0, (/*@__PURE__*/$parcel$interopDefault($e63dd1094dd1f770$exports))),
    (0, (/*@__PURE__*/$parcel$interopDefault($a897b9db826d5985$exports)))
];
const $123b50dec58735f8$var$FACE_SHOT_SVGS = [
    (0, (/*@__PURE__*/$parcel$interopDefault($e6788dce3b76cf82$exports))),
    (0, (/*@__PURE__*/$parcel$interopDefault($81fad595cad17dd4$exports))),
    (0, (/*@__PURE__*/$parcel$interopDefault($6f9f86c785ea4cb4$exports))),
    (0, (/*@__PURE__*/$parcel$interopDefault($ecf8032f8f5d59c3$exports))),
    (0, (/*@__PURE__*/$parcel$interopDefault($425650c39ecebf73$exports))),
    (0, (/*@__PURE__*/$parcel$interopDefault($0c2c5df9c2381dee$exports))),
    (0, (/*@__PURE__*/$parcel$interopDefault($35d36fb309e8fd30$exports))),
    (0, (/*@__PURE__*/$parcel$interopDefault($2733aad9d952cc25$exports))),
    (0, (/*@__PURE__*/$parcel$interopDefault($aa5efcd29add21f7$exports))),
    (0, (/*@__PURE__*/$parcel$interopDefault($0d0bcd71fd1fded5$exports))),
    (0, (/*@__PURE__*/$parcel$interopDefault($8b97ebce8a33c024$exports))),
    (0, (/*@__PURE__*/$parcel$interopDefault($a8fa36c28a96e9e2$exports))),
    (0, (/*@__PURE__*/$parcel$interopDefault($4a72ca62f05f102f$exports))),
    (0, (/*@__PURE__*/$parcel$interopDefault($5f068f1719a1ec64$exports)))
];
const $123b50dec58735f8$var$CORE_SVGS = [
    (0, (/*@__PURE__*/$parcel$interopDefault($19e45f8acff8aafc$exports)))
];
const $123b50dec58735f8$var$BADDIE_SVG = {
    bg: (0, (/*@__PURE__*/$parcel$interopDefault($05d4e0276be0fba5$exports))),
    core: (0, (/*@__PURE__*/$parcel$interopDefault($bcd860fc9816ccdc$exports))),
    face: (0, (/*@__PURE__*/$parcel$interopDefault($938ede6ee416a731$exports)))
};
const $123b50dec58735f8$var$replaceAttribute = (string, key, color)=>string.replaceAll(new RegExp(`${key}="(?!none)([^"]+)"`, "g"), `${key}="${color}"`);
const $123b50dec58735f8$export$1c8732ad58967379 = {
    async draw () {
        for(const key in this.buttons){
            const button = this.buttons[key];
            button.visible = false;
        }
        if (!this.showIt) return;
        if (!this.firstFrame && !this.hasStarted) {
            this.hasStarted = true;
            this.started();
        }
        if (!this.paused && this.p5Frames % this.P5_FPS_MULTIPLIER == 0) {
            this.firstFrame = false;
            this.frames++;
            const results = this.step(this.bodies, this.missiles);
            this.bodies = results.bodies || [];
            this.missiles = results.missiles || [];
        }
        this.p.noFill();
        this.drawBg();
        if (this.globalStyle == "psycho") this.p.blendMode(this.p.DIFFERENCE);
        if (this.globalStyle == "psycho") this.p.blendMode(this.p.BLEND);
        this.p5Frames++;
        // if (
        //   this.mode == 'game' &&
        //   this.target == 'inside' &&
        //   !this.firstFrame &&
        //   this.globalStyle !== 'psycho'
        // ) {
        //   for (let i = 0; i < this.bodies.length; i++) {
        //     const body = this.bodies[i]
        //     this.drawCenter(body)
        //   }
        // }
        if (!this.paused) this.drawBodies();
        if (this.mode == "game" && this.target == "outside" && !this.firstFrame && this.globalStyle !== "psycho") for(let i = 0; i < this.bodies.length; i++){
            const body = this.bodies[i];
            this.drawCenter(body);
        }
        this.drawWitheringBodies();
        this.drawPause();
        this.drawScore();
        this.drawPopup();
        this.drawGun();
        if (this.mode == "game" && this.frames - this.startingFrame + this.FPS < this.timer && this.bodies.reduce((a, c)=>a + c.radius, 0) != 0) this.drawMissiles();
        this.drawExplosions();
        const notPaused = !this.paused;
        const framesIsAtStopEveryInterval = (this.frames - this.startingFrame) % this.stopEvery == 0 && this.p5Frames % this.P5_FPS_MULTIPLIER == 0;
        const didNotJustPause = !this.justPaused;
        const ranOutOfTime = this.frames - this.startingFrame + this.FPS >= this.timer;
        const hitHeroBody = this.bodies[0].radius == 0 && this.level !== 0;
        if ((ranOutOfTime || hitHeroBody) && !this.handledGameOver) this.handleGameOver({
            won: false,
            ranOutOfTime: ranOutOfTime,
            hitHeroBody: hitHeroBody
        });
        if (!this.won && this.mode == "game" && this.bodies.slice(this.level == 0 ? 0 : 1).reduce((a, c)=>a + c.radius, 0) == 0 && !this.handledGameOver) this.handleGameOver({
            won: true
        });
        if (!this.firstFrame && notPaused && framesIsAtStopEveryInterval && didNotJustPause && !ranOutOfTime && !this.handledGameOver) this.finish();
        else this.justPaused = false;
    },
    drawPause () {
        if (!(0, $7bebc3cf49080e6e$export$f45fbea8fe20ca8a).dot || !this.paused || this.showProblemRankingsScreenAt !== -1) return;
        this.pauseGraphic ||= this.p.createGraphics(this.windowWidth, this.windowHeight);
        this.pauseGraphic.pixelDensity(this.pixelDensity);
        this.pauseGraphic.clear();
        const p = this.pauseGraphic;
        const unpauseDuration = this.level == 0 ? 2 : 0;
        const unpauseFrames = unpauseDuration * this.P5_FPS;
        if (this.willUnpause && !this.beganUnpauseAt) {
            this.willUnpause = true;
            this.beganUnpauseAt = this.p5Frames;
        }
        // pause and return when unpause finished
        if (this.beganUnpauseAt + unpauseFrames < this.p5Frames) {
            this.paused = false;
            this.willUnpause = false;
            return;
        } else if (this.willUnpause) {
            // fade text out
            const fadeOutFrames = unpauseFrames / 4 * 3;
            const fadeOutStart = this.beganUnpauseAt;
            const fadeOutProgress = this.p5Frames - fadeOutStart;
            const fadeOut = this.p.map(fadeOutProgress, 0, fadeOutFrames, 1, 0);
            p.fill((0, $d60e3aa22c788113$export$c08c384652f6dae3)((0, $d60e3aa22c788113$export$5714e40777c1bcc2).pink, fadeOut));
        } else p.fill((0, $d60e3aa22c788113$export$5714e40777c1bcc2).pink);
        this.drawPauseBodies();
        // draw logo
        p.textFont((0, $7bebc3cf49080e6e$export$f45fbea8fe20ca8a).dot);
        p.textSize(200);
        p.textAlign(p.LEFT, p.TOP);
        p.noStroke();
        const titleY = this.windowHeight / 2 - 270;
        (0, $7bebc3cf49080e6e$export$da5f36cd073f8491)(p, "Anybody", 46, titleY, 0.8);
        (0, $7bebc3cf49080e6e$export$da5f36cd073f8491)(p, "Problem", 46, titleY + 240, 2);
        if (!this.willUnpause) {
            // play button
            this.drawFatButton({
                text: "PLAY",
                onClick: ()=>{
                    if (!this.playerName) {
                        // open connect wallet popup
                        this.popup = {
                            header: "Play Onchain",
                            body: [
                                "Free to play!  ...or practice!",
                                "Connect a wallet to validate your wins."
                            ],
                            buttons: [
                                {
                                    text: "PRACTICE",
                                    fg: (0, $d60e3aa22c788113$export$5714e40777c1bcc2).violet_50,
                                    bg: (0, $d60e3aa22c788113$export$5714e40777c1bcc2).violet_25,
                                    stroke: (0, $d60e3aa22c788113$export$5714e40777c1bcc2).violet_50,
                                    onClick: ()=>{
                                        // start practice mode
                                        this.popup = null;
                                        this.sound?.playStart();
                                        this.setPause(false);
                                        this.practiceMode = true;
                                    }
                                },
                                {
                                    text: "CONNECT",
                                    fg: (0, $d60e3aa22c788113$export$5714e40777c1bcc2).violet_25,
                                    bg: (0, $d60e3aa22c788113$export$5714e40777c1bcc2).violet_50,
                                    stroke: (0, $d60e3aa22c788113$export$5714e40777c1bcc2).violet_50,
                                    onClick: ()=>{
                                        this.emit("connect-wallet");
                                    }
                                }
                            ]
                        };
                        return;
                    }
                    // start play
                    this.sound?.playStart();
                    this.setPause(false);
                    this.practiceMode = false;
                },
                fg: (0, $d60e3aa22c788113$export$5714e40777c1bcc2).fuschia,
                bg: (0, $d60e3aa22c788113$export$5714e40777c1bcc2).pink,
                bottom: 120,
                p: p
            });
            // date
            p.textFont((0, $7bebc3cf49080e6e$export$f45fbea8fe20ca8a).body);
            p.textSize(24);
            const dateWidth = p.textWidth(this.date);
            const dateBgWidth = dateWidth + 48;
            const dateBgHeight = 32;
            const dateBottomY = this.windowHeight - 58;
            p.fill((0, $d60e3aa22c788113$export$5714e40777c1bcc2).textBg);
            p.rect(this.windowWidth / 2 - dateBgWidth / 2, dateBottomY - dateBgHeight / 2, dateBgWidth, dateBgHeight, 20);
            p.textAlign(p.CENTER, p.CENTER);
            p.fill((0, $d60e3aa22c788113$export$5714e40777c1bcc2).textFg);
            p.text(this.date, this.windowWidth / 2, dateBottomY);
        }
        this.p.image(this.pauseGraphic, 0, 0);
    },
    drawBodyOutlines () {
        for(let i = 0; i < this.bodies.length; i++){
            const body = this.bodies[i];
            const radius = body.radius * 4;
            this.p.stroke(this.getGrey());
            this.p.stroke("black");
            this.p.strokeWeight(1);
            this.p.color("rgba(0,0,0,0)");
            this.p.ellipse(body.position.x, body.position.y, radius, radius);
        }
    },
    drawBg () {
        this.p.background((0, $d60e3aa22c788113$export$5714e40777c1bcc2).bg);
        if (!this.starBG) {
            this.starBG = this.p.createGraphics(this.windowWidth, this.windowHeight);
            this.starBG.pixelDensity(this.pixelDensity);
            for(let i = 0; i < 200; i++){
                // this.starBG.stroke('black')
                this.starBG.noStroke();
                // this.starBG.fill('rgba(255,255,255,0.6)')
                // this.starBG.fill('black')
                this.starBG.fill((0, $d60e3aa22c788113$export$5714e40777c1bcc2).fg);
                this.starBG.textSize(15);
                const strings = [
                    ",",
                    ".",
                    "*"
                ];
                this.starBG.text(strings[Math.floor(Math.random() * strings.length)], Math.floor(Math.random() * this.windowWidth), Math.floor(Math.random() * this.windowHeight));
            }
        //   const totalLines = 6
        //   for (let i = 0; i < totalLines; i++) {
        //     if (i % 5 == 5) {
        //       this.starBG.strokeWeight(1)
        //       // this.starBG.stroke(`hsl(${i * (360 / totalLines)}, 100%, 50%)`)
        //     } else {
        //       this.starBG.strokeWeight(1)
        //       // this.starBG.stroke('rgba(0,0,0,0.1)')
        //     }
        //     this.starBG.line(i * (this.windowWidth / totalLines), 0, i * (this.windowWidth / totalLines), this.windowHeight)
        //     this.starBG.line(0, i * (this.windowHeight / totalLines), this.windowWidth, i * (this.windowHeight / totalLines))
        //   }
        // }
        }
        const basicX = 0;
        // Math.floor((this.frames / FPS) * (this.frames / FPS)) % this.windowWidth
        const basicY = 0;
        // Math.floor((this.frames / FPS) * (this.frames / FPS)) % this.windowHeight
        // const basicX = this.accumX % this.windowWidth
        // const basicY = this.accumY % this.windowHeight
        // const Xleft = basicX - this.windowWidth
        // const Xright = basicX + this.windowWidth
        // const Ytop = basicY - this.windowHeight
        // const Ybottom = basicY + this.windowHeight
        // this.confirmedStarPositions ||= []
        // for (let i = 0; i < this.starPositions?.length; i++) {
        //   if (i < this.confirmedStarPositions.length) continue
        //   const starBody = this.starPositions[i]
        //   const radius = starBody.radius * 4
        //   if (Xleft < 10) {
        //     this.drawBodiesLooped(starBody, radius, this.drawStarOnBG)
        //     if (this.loaded) {
        //       this.confirmedStarPositions.push(this.starPositions[i])
        //     }
        //   } else {
        //     this.drawBodiesLooped(starBody, radius, this.drawStarOnTopOfBG)
        //   }
        // }
        this.p.image(this.starBG, basicX, basicY, this.windowWidth, this.windowHeight);
    // this.p.image(
    //   this.starBG,
    //   Xleft,
    //   basicY,
    //   this.windowWidth,
    //   this.windowHeight
    // )
    // this.p.image(
    //   this.starBG,
    //   Xright,
    //   basicY,
    //   this.windowWidth,
    //   this.windowHeight
    // )
    // this.p.image(this.starBG, basicX, Ytop, this.windowWidth, this.windowHeight)
    // this.p.image(
    //   this.starBG,
    //   basicX,
    //   Ybottom,
    //   this.windowWidth,
    //   this.windowHeight
    // )
    // this.p.image(this.starBG, Xleft, Ytop, this.windowWidth, this.windowHeight)
    // this.p.image(this.starBG, Xright, Ytop, this.windowWidth, this.windowHeight)
    // this.p.image(
    //   this.starBG,
    //   Xleft,
    //   Ybottom,
    //   this.windowWidth,
    //   this.windowHeight
    // )
    // this.p.image(
    //   this.starBG,
    //   Xright,
    //   Ybottom,
    //   this.windowWidth,
    //   this.windowHeight
    // )
    // // Grid lines, uncomment for visual debugging and alignment
    // const boxCount = 6
    // // this.p.stroke('black')
    // this.p.stroke('white')
    // for (let i = 1; i < boxCount; i++) {
    //   if (i % 5 == 5) {
    //     this.p.strokeWeight(1)
    //     // this.starBG.stroke(`hsl(${i * (360 / totalLines)}, 100%, 50%)`)
    //   } else {
    //     this.p.strokeWeight(1)
    //   }
    //   this.p.line(
    //     i * (this.windowWidth / boxCount),
    //     0,
    //     i * (this.windowWidth / boxCount),
    //     this.windowHeight
    //   )
    //   this.p.line(
    //     0,
    //     i * (this.windowHeight / boxCount),
    //     this.windowWidth,
    //     i * (this.windowHeight / boxCount)
    //   )
    // }
    },
    drawPopup () {
        if (!this.popup) return;
        const { p: p, popup: popup } = this;
        // animate in
        const animDuration = 0.2 // seconds
        ;
        const justEntered = popup.lastVisibleFrame !== this.p5Frames - 1;
        if (justEntered) popup.visibleForFrames = 0;
        popup.visibleForFrames++;
        popup.lastVisibleFrame = this.p5Frames;
        const alpha = Math.min(0.75, popup.visibleForFrames / (animDuration * this.P5_FPS));
        p.fill(`rgba(20, 4, 32, ${alpha})`);
        p.noStroke();
        p.rect(0, 0, this.windowWidth, this.windowHeight);
        const x = 180;
        const w = 640;
        const pad = [
            36,
            48,
            120,
            48
        ];
        const fz = [
            72,
            32
        ];
        const bg = popup.bg ?? (0, $d60e3aa22c788113$export$5714e40777c1bcc2).violet_25;
        const fg = popup.fg ?? (0, $d60e3aa22c788113$export$5714e40777c1bcc2).violet_50;
        const stroke = popup.stroke ?? fg;
        const h = pad[0] + fz[0] + fz[1] * popup.body.length + pad[2];
        const animY = Math.max(0, 50 - 50 / (animDuration * this.P5_FPS) * popup.visibleForFrames);
        const y = (this.windowHeight - h) / 2 + animY;
        // modal
        p.fill(bg);
        p.stroke(stroke);
        p.strokeWeight(3);
        p.rect(x, y, w, h, 24, 24, 24, 24);
        // heading
        if (!(0, $7bebc3cf49080e6e$export$f45fbea8fe20ca8a).dot) return;
        p.textFont((0, $7bebc3cf49080e6e$export$f45fbea8fe20ca8a).dot);
        p.fill(popup.fg ?? fg);
        p.textSize(fz[0]);
        p.textAlign(p.CENTER, p.TOP);
        p.noStroke();
        p.text(popup.header, x + w / 2, y + pad[0]);
        // body
        if (!(0, $7bebc3cf49080e6e$export$f45fbea8fe20ca8a).body) return;
        p.textFont((0, $7bebc3cf49080e6e$export$f45fbea8fe20ca8a).body);
        p.textSize(fz[1]);
        p.textAlign(p.CENTER, p.TOP);
        popup.body.forEach((text, i)=>{
            const lineGap = parseInt(fz[1] * 0.25);
            const y1 = y + pad[0] + fz[0] + fz[1] * (i + 1) + lineGap * (i + 1) - 10;
            p.text(text, x + w / 2, y1);
        });
        // buttons (max 2)
        const btnGutter = 10;
        const btnW = w / 2 - pad[1] / 2 - btnGutter / 2;
        const defaultOptions = {
            height: 84,
            width: btnW,
            y: y + h - 42,
            fg: fg,
            bg: bg,
            stroke: stroke
        };
        popup.buttons.slice(0, 2).forEach((options, i)=>{
            this.drawButton({
                x: popup.buttons.length > 1 ? x + pad[1] / 2 + (btnW + btnGutter) * i : x + w / 2 - btnW / 2,
                ...defaultOptions,
                ...options
            });
        });
        p.pop();
    },
    getColorDir (chunk) {
        return Math.floor(this.frames / (255 * chunk)) % 2 == 0;
    },
    getGrey () {
        if (this.getColorDir(this.chunk)) return 255 - Math.floor(this.frames / this.chunk) % 255;
        else return Math.floor(this.frames / this.chunk) % 255;
    },
    drawScore () {
        if (this.paused) return;
        const { p: p } = this;
        p.push();
        p.fill("white");
        p.noStroke();
        p.textAlign(p.LEFT, p.TOP);
        this.drawProblemRankingsScreen();
        const runningFrames = this.frames - this.startingFrame;
        const seconds = (this.framesTook || runningFrames) / this.FPS;
        const secondsLeft = (this.level > 5 ? 60 : $123b50dec58735f8$var$GAME_LENGTH_BY_LEVEL_INDEX[this.level]) - seconds;
        if (this.gameOver) {
            this.scoreSize = this.initialScoreSize;
            p.pop();
            this.won ? this.drawWinScreen() : this.drawLoseScreen();
            if (!this.celebrating) return;
        }
        // flash the score red and white
        if (this.won) {
            const flash = Math.floor(this.frames / 10) % 2 == 0;
            p.fill(flash ? (0, $d60e3aa22c788113$export$5714e40777c1bcc2).red : "white");
        }
        p.textFont((0, $7bebc3cf49080e6e$export$f45fbea8fe20ca8a).body);
        p.textSize(this.scoreSize);
        if (runningFrames > 2 && (!this.gameOver || this.gameOver && this.won && !this.skipAhead)) {
            if (this.won) {
                p.textSize(this.scoreSize * 2);
                p.text(seconds.toFixed(2) + "s", 20, 10);
            } else {
                p.text(secondsLeft.toFixed(2), 20, 10);
                p.textAlign(p.RIGHT, p.TOP);
                p.text("Lvl " + this.level, this.windowWidth - 20, 10);
            }
        }
        p.pop();
    },
    drawWinScreen () {
        if (this.showProblemRankingsScreenAt >= 0) return;
        const justEntered = this.winScreenLastVisibleFrame !== this.p5Frames - 1;
        if (justEntered) this.winScreenVisibleForFrames = 0;
        this.winScreenVisibleForFrames++;
        this.winScreenLastVisibleFrame = this.p5Frames;
        const celebrationTime = 5 // seconds
        ;
        this.celebrating = this.winScreenVisibleForFrames / this.P5_FPS < celebrationTime;
        if (this.celebrating && !this.skipAhead) this.drawGameOverTicker({
            text: "                 YES  YES  YES  YES  YES  YES  YES  YES",
            bottom: true,
            fg: (0, $d60e3aa22c788113$export$5714e40777c1bcc2).iris_30
        });
        else if (this.level == 0) {
            this.level++;
            this.restart(null, false);
        } else this.drawStatsScreen();
    },
    drawStatsScreen () {
        const { p: p } = this;
        const justEntered = this.statsScreenLastVisibleFrame !== this.p5Frames - 1;
        if (justEntered) {
            this.statsScreenVisibleForFrames = 0;
            this.P5_FPS = this.FPS * this.P5_FPS_MULTIPLIER;
            this.p.frameRate(this.P5_FPS);
        }
        this.statsScreenVisibleForFrames++;
        this.statsScreenLastVisibleFrame = this.p5Frames;
        const entranceTime = 0.4 // seconds
        ;
        const scale = Math.min(1, this.statsScreenVisibleForFrames / (entranceTime * this.P5_FPS));
        p.push();
        p.noStroke();
        p.fill("white");
        // logo at top
        if (!(0, $7bebc3cf49080e6e$export$f45fbea8fe20ca8a).dot) return;
        p.textFont((0, $7bebc3cf49080e6e$export$f45fbea8fe20ca8a).dot);
        p.fill((0, $d60e3aa22c788113$export$5714e40777c1bcc2).pink);
        p.textSize(60);
        p.textAlign(p.LEFT, p.TOP);
        const logoY = p.map(scale, 0, 1, -100, 22);
        (0, $7bebc3cf49080e6e$export$da5f36cd073f8491)(p, "Anybody", 334, logoY, 0.8);
        (0, $7bebc3cf49080e6e$export$da5f36cd073f8491)(p, "Problem", 640, logoY, 2);
        // bordered boxes
        p.fill("black");
        p.stroke((0, $d60e3aa22c788113$export$5714e40777c1bcc2).border);
        p.strokeWeight(1);
        const gutter = 22;
        const middleBoxY = 320;
        p.rect(gutter, 104, this.windowWidth - gutter * 2, 144, 24);
        if (this.showShare) p.rect(gutter, 320, this.windowWidth - gutter * 2, 524, 24);
        else {
            p.rect(gutter, 320, this.windowWidth - gutter * 2, 444, 24);
            p.rect(gutter, 796, this.windowWidth - gutter * 2, 64, 24);
        }
        // upper box text
        p.textSize(32);
        p.noStroke();
        if (!(0, $7bebc3cf49080e6e$export$f45fbea8fe20ca8a).body) return;
        p.textFont((0, $7bebc3cf49080e6e$export$f45fbea8fe20ca8a).body);
        p.fill((0, $d60e3aa22c788113$export$5714e40777c1bcc2).iris_60);
        // upper box text - labels
        p.text("problem", 330, 132);
        p.text("solver", 330, 192);
        // upper box text - values
        p.textSize(54);
        p.fill((0, $d60e3aa22c788113$export$5714e40777c1bcc2).iris_30);
        const date = new Date(this.date);
        const options = {
            month: "short",
            day: "2-digit",
            year: "numeric"
        };
        const formattedDate = date.toLocaleDateString("en-US", options).toUpperCase().replace(", ", "-").replace(" ", "-");
        p.text(formattedDate, 454, 114);
        p.text(this.playerName ?? "YOU", 454, 174);
        // end upper box text
        // middle box text
        p.textSize(48);
        p.fill((0, $d60e3aa22c788113$export$5714e40777c1bcc2).iris_60);
        p.textAlign(p.RIGHT, p.TOP);
        const col1X = 580;
        const col2X = 770;
        const col3X = 960;
        // middle box text - labels
        p.text("time", col1X, 264);
        p.text("best", col2X, 264);
        p.text("+/-", col3X, 264);
        // middle box text - values
        const levelTimes = this.levelSpeeds.map((result)=>result?.framesTook / this.FPS).filter((l)=>l !== undefined);
        const bestTimes = this.todaysRecords?.levels?.map((l)=>l.events[0].time / this.FPS) || Array.from({
            length: 5
        }, (_, i)=>levelTimes[i] || 0);
        const plusMinus = bestTimes.map((best, i)=>{
            if (i >= levelTimes.length) return "";
            const time = levelTimes[i];
            const diff = time - best;
            const sign = diff > 0 ? "+" : "";
            return sign + diff.toFixed(2);
        }).filter(Boolean);
        const problemComplete = levelTimes.length >= $123b50dec58735f8$var$LEVELS;
        const rowHeight = 72;
        // middle box text - highlight current row
        p.fill("rgba(146, 118, 255, 0.2)");
        p.rect(gutter, middleBoxY + (levelTimes.length - 1) * rowHeight, this.windowWidth - gutter * 2, rowHeight);
        // middle box text - value text
        p.push();
        p.textAlign(p.RIGHT, p.CENTER);
        p.textSize(44);
        // const middleBoxPadding = 12
        // p.translate(0, middleBoxPadding)
        for(let i = 0; i < $123b50dec58735f8$var$LEVELS; i++){
            const time = i < levelTimes.length ? levelTimes[i].toFixed(2) : "-";
            const light = i % 2 == 0;
            p.fill(light ? (0, $d60e3aa22c788113$export$5714e40777c1bcc2).iris_30 : (0, $d60e3aa22c788113$export$5714e40777c1bcc2).iris_60);
            p.text(time, col1X, middleBoxY + rowHeight * i + rowHeight / 2, 150, rowHeight);
        }
        for(let i = 0; i < $123b50dec58735f8$var$LEVELS; i++){
            const best = i < bestTimes.length ? bestTimes[i] : "-";
            const light = i % 2 == 1 && i < levelTimes.length;
            p.fill(light ? (0, $d60e3aa22c788113$export$5714e40777c1bcc2).iris_30 : (0, $d60e3aa22c788113$export$5714e40777c1bcc2).iris_60);
            p.text(best.toFixed(2), col2X, middleBoxY + rowHeight * i + rowHeight / 2, 150, rowHeight);
        }
        for(let i = 0; i < $123b50dec58735f8$var$LEVELS; i++){
            const diff = plusMinus[i] || "-";
            if (i === levelTimes.length - 1) p.fill(/^-/.test(diff) ? (0, $d60e3aa22c788113$export$5714e40777c1bcc2).lime : (0, $d60e3aa22c788113$export$5714e40777c1bcc2).flame_50);
            else p.fill(/^-/.test(diff) ? (0, $d60e3aa22c788113$export$5714e40777c1bcc2).green_75 : (0, $d60e3aa22c788113$export$5714e40777c1bcc2).flame_75);
            p.text(diff, col3X, middleBoxY + rowHeight * i + rowHeight / 2, 150, rowHeight);
        }
        p.textSize(64);
        // middle box text - sum line
        const bestTime = bestTimes.slice(0, levelTimes.length).reduce((a, b)=>a + b, 0);
        const levelTimeSum = levelTimes.reduce((a, b)=>a + b, 0);
        const sumLine = [
            levelTimeSum.toFixed(2),
            bestTime.toFixed(2),
            (levelTimeSum - bestTime).toFixed(2)
        ];
        const sumLineY = middleBoxY + rowHeight * bestTimes.length + rowHeight / 2;
        const sumLineHeight = 80;
        p.textAlign(p.LEFT, p.CENTER);
        p.fill((0, $d60e3aa22c788113$export$5714e40777c1bcc2).iris_30);
        p.text(problemComplete ? "solved in" : "current time", 44, sumLineY);
        p.textAlign(p.RIGHT, p.CENTER);
        for (const [i, col] of [
            col1X,
            col2X,
            col3X
        ].entries()){
            if (i == 0) p.fill("white");
            else if (i == 1) p.fill((0, $d60e3aa22c788113$export$5714e40777c1bcc2).iris_60);
            else p.fill(/^-/.test(sumLine[i]) ? (0, $d60e3aa22c788113$export$5714e40777c1bcc2).lime : (0, $d60e3aa22c788113$export$5714e40777c1bcc2).flame_75);
            p.text(sumLine[i], col, sumLineY, 150, sumLineHeight);
        }
        p.pop();
        // end middle box text
        // draw hero this.bodies[0]
        const body = this.getDisplayHero();
        const radius = this.getBodyRadius(body.radius);
        const xWobble = p.sin(p.frameCount / this.P5_FPS) * (5 + body.bodyIndex);
        const yWobble = p.cos(p.frameCount / this.P5_FPS + body.bodyIndex * 3) * (6 + body.bodyIndex);
        body.position = {
            x: p.map(scale, 0, 1, -140, 170) + xWobble,
            y: 180 + yWobble
        };
        this.bodiesGraphic ||= this.p.createGraphics(this.windowWidth, this.windowHeight);
        this.drawBodiesLooped(body, radius, this.drawBody);
        // begin middle box baddie body pyramid
        this.winScreenBaddies ||= this.getDisplayBaddies();
        const baddies = this.winScreenBaddies;
        for(let i = 0; i < baddies.length; i++){
            const row = baddies[i];
            for(let j = 0; j < row.length; j++){
                const body = row[row.length - 1 - j];
                body.position = this.createVector(64 + j * 72, middleBoxY + i * rowHeight + rowHeight / 2);
                body.velocity = this.createVector(0, 1);
                body.radius = 6.5;
                this.drawBodiesLooped(body, 3, this.drawBody);
            }
        }
        p.image(this.bodiesGraphic, 0, 0);
        this.bodiesGraphic.clear();
        // overlay transparent black box to dim past last levelTimes
        p.fill("rgba(0,0,0,0.6)");
        p.rect(gutter, middleBoxY + rowHeight * levelTimes.length, this.windowWidth - gutter * 2, rowHeight * ($123b50dec58735f8$var$LEVELS - levelTimes.length));
        // bottom box ticker text
        this.winTickerGraphic ||= this.p.createGraphics(this.windowWidth, this.windowHeight);
        p.textAlign(p.LEFT, p.TOP);
        p.textSize(32);
        p.fill((0, $d60e3aa22c788113$export$5714e40777c1bcc2).iris_30);
        p.text(this.level == 5 ? "CONGRATS!!! SAVE YOUR GAME TO SOLVE THE PROBLEM!!!!" : "NICE JOB!!!!    Keep going!!!   Solve this problem and climb the leaderboard.", 44, 811);
        // bottom buttons
        if (this.level >= 5) this.showShare = true;
        const buttonCount = this.showShare ? 4 : 3;
        this.drawBottomButton({
            text: "RETRY",
            onClick: ()=>{
                this.restart(null, false);
            },
            ...(0, $d60e3aa22c788113$export$d9a33280f07116d9).buttons.teal,
            columns: buttonCount,
            column: 0
        });
        this.drawBottomButton({
            text: "RESTART",
            onClick: ()=>{
                // confirm in popup
                this.popup = {
                    bg: (0, $d60e3aa22c788113$export$5714e40777c1bcc2).flame_75,
                    fg: (0, $d60e3aa22c788113$export$5714e40777c1bcc2).flame_50,
                    stroke: (0, $d60e3aa22c788113$export$5714e40777c1bcc2).flame_50,
                    header: "Start Over?",
                    body: [
                        "Any progress will be lost!"
                    ],
                    buttons: [
                        {
                            text: "CLOSE",
                            fg: (0, $d60e3aa22c788113$export$5714e40777c1bcc2).flame_50,
                            bg: (0, $d60e3aa22c788113$export$5714e40777c1bcc2).flame_75,
                            stroke: (0, $d60e3aa22c788113$export$5714e40777c1bcc2).flame_50,
                            onClick: ()=>{
                                this.popup = null;
                            }
                        },
                        {
                            text: "RESTART",
                            fg: (0, $d60e3aa22c788113$export$5714e40777c1bcc2).flame_75,
                            bg: (0, $d60e3aa22c788113$export$5714e40777c1bcc2).flame_50,
                            stroke: (0, $d60e3aa22c788113$export$5714e40777c1bcc2).flame_50,
                            onClick: ()=>{
                                this.popup = null;
                                this.level = 1;
                                this.restart(null, false);
                            }
                        }
                    ]
                };
            },
            ...(0, $d60e3aa22c788113$export$d9a33280f07116d9).buttons.flame,
            columns: buttonCount,
            column: 1
        });
        if (this.showShare) this.drawBottomButton({
            text: "SHARE",
            onClick: ()=>{
                // TODO: hide bottom btns / paint a promo-message over them
                this.shareCanvas();
            },
            ...(0, $d60e3aa22c788113$export$d9a33280f07116d9).buttons.pink,
            columns: buttonCount,
            column: 2
        });
        if (this.level < 5) this.drawBottomButton({
            text: "NEXT",
            onClick: ()=>{
                this.level++;
                if (this.level > 5) this.showProblemRankingsScreenAt = this.p5Frames;
                else this.restart(null, false);
            },
            ...(0, $d60e3aa22c788113$export$d9a33280f07116d9).buttons.green,
            columns: buttonCount,
            column: buttonCount - 1
        });
        else // parent app should handle waiting to save
        this.drawBottomButton({
            text: "SAVE",
            onClick: ()=>{
                this.emit("save");
            },
            ...(0, $d60e3aa22c788113$export$d9a33280f07116d9).buttons.green,
            columns: buttonCount,
            column: buttonCount - 1
        });
        p.pop();
    },
    drawProblemRankingsScreen () {
        if (this.showProblemRankingsScreenAt === -1) return;
        const { p: p } = this;
        const entranceTime = 1.5 // seconds
        ;
        const scale = Math.min(1, (this.p5Frames - this.showProblemRankingsScreenAt) / (entranceTime * this.P5_FPS));
        p.push();
        p.noStroke();
        p.fill("white");
        // bordered boxes
        p.fill("black");
        p.stroke((0, $d60e3aa22c788113$export$5714e40777c1bcc2).border);
        p.strokeWeight(1);
        const gutter = 22;
        const middleBoxY = 155;
        const rowHeight = 72;
        const rows = 3;
        p.rect(gutter, 28, this.windowWidth - gutter * 2, 103, 24);
        p.rect(gutter, middleBoxY, this.windowWidth - gutter * 2, rows * rowHeight, 24);
        p.rect(gutter, 179 + rows * rowHeight, this.windowWidth - gutter * 2, rowHeight, 24);
        // logo at top
        if (!(0, $7bebc3cf49080e6e$export$f45fbea8fe20ca8a).dot) return;
        p.textFont((0, $7bebc3cf49080e6e$export$f45fbea8fe20ca8a).dot);
        const logoOpacity = p.map(scale, 0, 1, 0, 1);
        p.fill((0, $d60e3aa22c788113$export$c08c384652f6dae3)((0, $d60e3aa22c788113$export$5714e40777c1bcc2).pink, logoOpacity));
        p.textSize(60);
        p.textAlign(p.LEFT, p.TOP);
        (0, $7bebc3cf49080e6e$export$da5f36cd073f8491)(p, "Anybody", 46, 44, 0.8);
        (0, $7bebc3cf49080e6e$export$da5f36cd073f8491)(p, "Problem", 352, 44, 2);
        // upper box text - date
        p.textSize(56);
        p.noStroke();
        if (!(0, $7bebc3cf49080e6e$export$f45fbea8fe20ca8a).body) return;
        p.textFont((0, $7bebc3cf49080e6e$export$f45fbea8fe20ca8a).body);
        p.fill((0, $d60e3aa22c788113$export$5714e40777c1bcc2).iris_30);
        p.textAlign(p.RIGHT, p.TOP);
        p.text(this.date, this.windowWidth - 42, 48);
        // middle box text
        p.textSize(44);
        p.textAlign(p.RIGHT, p.TOP);
        const col1X = 42;
        const col2X = 187;
        const col3X = this.windowWidth - col1X // right aligned
        ;
        // middle box text - values
        const scores = [
            {
                rank: 1,
                name: "0xABCD-1234",
                time: 188.889192912
            },
            {
                rank: 2,
                name: "longassensnamethatgoesofftherowalllllllls",
                time: 189.889192912
            },
            {
                rank: 3,
                name: "0xABCD-1234",
                time: 198.889192912
            },
            {
                rank: 999998,
                name: "petersugihara.eth",
                time: 260.889192912
            }
        ];
        // middle box text - value text
        for (const [rowNumber, score] of scores.entries()){
            const rowY = rowHeight * rowNumber + rowHeight / 2 + (rowNumber === 3 ? 24 : 0);
            p.textAlign(p.LEFT, p.CENTER);
            p.fill((0, $d60e3aa22c788113$export$5714e40777c1bcc2).iris_60);
            const rankText = score.rank === 1 ? "1st" : score.rank === 2 ? "2nd" : score.rank === 3 ? "3rd" : `${score.rank.toLocaleString()}`;
            p.text(rankText, col1X, middleBoxY + rowY);
            p.fill((0, $d60e3aa22c788113$export$5714e40777c1bcc2).iris_30);
            let nameText = score.name // truncate to fit
            ;
            while(p.textWidth(nameText) > 656)nameText = `${nameText.replaceAll(/\.\.\.$/g, "").slice(0, -1)}...`;
            p.text(nameText, col2X, middleBoxY + rowY);
            p.textAlign(p.RIGHT, p.CENTER);
            p.fill((0, $d60e3aa22c788113$export$5714e40777c1bcc2).iris_60);
            p.text(score.time.toFixed(2), col3X, middleBoxY + rowY);
            // bottom divider line
            if (rowNumber < 2) {
                p.fill((0, $d60e3aa22c788113$export$5714e40777c1bcc2).iris_60);
                p.rect(gutter, middleBoxY + rowHeight * (rowNumber + 1), this.windowWidth - gutter * 2, 1);
            }
        }
        // end middle box text
        // draw hero body
        const body = this.getDisplayHero({
            radius: 33
        });
        const radius = this.getBodyRadius(body.radius);
        const xWobble = p.sin(p.frameCount / this.P5_FPS) * (5 + body.bodyIndex);
        const yWobble = p.cos(p.frameCount / this.P5_FPS + body.bodyIndex * 3) * (6 + body.bodyIndex);
        body.position = {
            x: p.map(scale ** 3, 0, 1, -140, 180) + xWobble,
            y: 670 + yWobble
        };
        this.bodiesGraphic ||= this.p.createGraphics(this.windowWidth, this.windowHeight);
        this.drawBodiesLooped(body, radius, this.drawBody);
        p.image(this.bodiesGraphic, 0, 0);
        this.bodiesGraphic.clear();
        this.drawMessageBox ||= ({ lines: lines, x: x, y: y, color: color, start: start, textWidth: textWidth })=>{
            if (start !== -1 && this.p5Frames < start) return;
            const padding = 20;
            const paddingLeft = 24;
            p.textSize(32);
            p.textAlign(p.LEFT, p.TOP);
            p.textLeading(36);
            p.fill("black");
            p.stroke(color);
            p.strokeWeight(1);
            const joined = lines.join("\n");
            const messageText = joined.slice(0, Math.floor((this.p5Frames - start) / 2));
            if (this.p5Frames % Math.floor(this.P5_FPS / 8) === 0 && joined.length > messageText.length) this.sound?.playStat();
            const longestLine = lines.sort((a, b)=>b.length - a.length)[0];
            p.rect(x, y, (textWidth || p.textWidth(longestLine)) + paddingLeft + padding, lines.length * 36 + padding * 2, 20);
            // console.log({ h: lines.length * 36 + padding * 2 })
            p.fill(color);
            p.text(messageText, x + paddingLeft, y + padding);
        };
        if (this.saveStatus === "unsaved") {
            // draw messages from hero that
            const message1Entrance = 1.5;
            const message1 = [
                "wOwOwoWwwww ! ! ! !",
                "you solved the daily problem !"
            ];
            const message1Frame = this.showProblemRankingsScreenAt + message1Entrance * this.P5_FPS;
            const message2Entrance = 3;
            const message2 = [
                "SAVE your score to the leaderboard",
                "and receive today's celestial body !"
            ];
            const message2Frame = this.showProblemRankingsScreenAt + message2Entrance * this.P5_FPS;
            const message3Entrance = 5.5;
            const message3 = [
                "replay as many times as you'd like",
                "before tomorrow's problem..."
            ];
            const message3Frame = this.showProblemRankingsScreenAt + message3Entrance * this.P5_FPS;
            this.drawMessageBox({
                lines: message1,
                x: 344,
                y: 504,
                color: (0, $d60e3aa22c788113$export$5714e40777c1bcc2).iris_30,
                start: message1Frame
            });
            this.drawMessageBox({
                lines: message3,
                x: 370,
                y: 704,
                color: (0, $d60e3aa22c788113$export$5714e40777c1bcc2).pink,
                start: message3Frame
            });
            this.drawMessageBox({
                lines: message2,
                x: 484,
                y: 604,
                color: (0, $d60e3aa22c788113$export$5714e40777c1bcc2).green_50,
                start: message2Frame,
                textWidth: 451
            });
        }
        if (this.saveStatus === "validating") {
            this.validatingAt ||= this.p5Frames;
            this.drawMessageBox({
                lines: [
                    "validating your score..."
                ],
                x: 344,
                y: 504,
                color: (0, $d60e3aa22c788113$export$5714e40777c1bcc2).iris_30,
                start: this.validatingAt
            });
        }
        if (this.saveStatus === "validated" || this.saveStatus === "saved" || this.saveStatus === "saving") {
            this.validatedAt ||= this.p5Frames;
            this.drawMessageBox({
                lines: [
                    "score validated!"
                ],
                x: 344,
                y: 504,
                color: (0, $d60e3aa22c788113$export$5714e40777c1bcc2).iris_30,
                start: -1
            });
        }
        if (this.saveStatus === "validated" && this.validatedAt) {
            const message2Frame = this.validatedAt + 1 * this.P5_FPS;
            this.drawMessageBox({
                lines: [
                    "you can now save your score"
                ],
                x: 484,
                y: 566,
                color: (0, $d60e3aa22c788113$export$5714e40777c1bcc2).green_50,
                start: message2Frame
            });
        } else if (this.saveStatus === "saving") {
            this.savingAt ||= this.p5Frames;
            this.drawMessageBox({
                lines: [
                    "saving your score..."
                ],
                x: 484,
                y: 566,
                color: (0, $d60e3aa22c788113$export$5714e40777c1bcc2).green_50,
                start: this.savingAt
            });
        } else if (this.saveStatus === "saved") {
            this.savedAt ||= this.p5Frames;
            this.drawMessageBox({
                lines: [
                    "score SAVED!"
                ],
                x: 478,
                y: 566,
                color: (0, $d60e3aa22c788113$export$5714e40777c1bcc2).green_50,
                start: this.savedAt
            });
            const message2Frame = this.savedAt + 1 * this.P5_FPS;
            this.drawMessageBox({
                lines: [
                    "this body is now in your wallet !"
                ],
                x: 414,
                y: 653,
                color: (0, $d60e3aa22c788113$export$5714e40777c1bcc2).pink_40,
                start: message2Frame
            });
            const message3Frame = this.savedAt + 2 * this.P5_FPS;
            this.drawMessageBox({
                lines: [
                    "but, maybe you can do better ??"
                ],
                x: 545,
                y: 757,
                color: (0, $d60e3aa22c788113$export$5714e40777c1bcc2).yellow_50,
                start: message3Frame
            });
        }
        if (this.saveStatus !== "saved") {
            // bottom buttons
            const buttonCount = 2;
            this.drawBottomButton({
                text: "BACK",
                onClick: ()=>{
                    this.restart(null, false);
                },
                ...(0, $d60e3aa22c788113$export$d9a33280f07116d9).buttons.teal,
                columns: buttonCount,
                column: 0
            });
            this.drawBottomButton({
                text: this.saveStatus === "unsaved" ? "SAVE" : this.saveStatus === "validated" ? "SAVE" // TODO: is it confusing that this label doesn't change?
                 : `${this.saveStatus.toUpperCase()}...`,
                onClick: ()=>{
                    this.handleSave();
                },
                ...(0, $d60e3aa22c788113$export$d9a33280f07116d9).buttons.green,
                disabled: this.saveStatus !== "unsaved" && this.saveStatus !== "validated",
                columns: buttonCount,
                column: 1,
                key: "problem-save"
            });
        } else this.drawBottomButton({
            text: "NEW GAME",
            onClick: ()=>{
                this.restart();
            },
            ...(0, $d60e3aa22c788113$export$d9a33280f07116d9).buttons.yellow,
            columns: 1,
            column: 0
        });
        p.pop();
    },
    getDisplayHero ({ radius: radius } = {
        radius: 33
    }) {
        const body = this.bodies[0];
        const bodyCopy = JSON.parse(JSON.stringify(body, (key, value)=>typeof value === "bigint" ? value.toString() : value // return everything else unchanged
        ));
        bodyCopy.position = this.p.createVector(body.position.x, body.position.y);
        bodyCopy.velocity = this.p.createVector(body.velocity.x, body.velocity.y);
        bodyCopy.radius = radius;
        return bodyCopy;
    },
    getDisplayBaddies () {
        const baddies = [];
        const fallbackBody = this.bodies[this.bodies.length - 1];
        if (!fallbackBody) return [];
        const str = JSON.stringify(fallbackBody);
        for(let i = 0; i < $123b50dec58735f8$var$LEVELS; i++){
            baddies.push([]);
            for(let j = 0; j < i + 1; j++){
                const bodyCopy = j >= this.bodies.length - 1 ? JSON.parse(str) : JSON.parse(JSON.stringify(this.bodies[j + 1]));
                // bodyCopy.position = this.p.createVector(
                //   body.position.x,
                //   body.position.y
                // )
                // bodyCopy.velocity = this.p.createVector(
                //   body.velocity.x,
                //   body.velocity.y
                // )
                baddies[i].push(bodyCopy);
            }
        }
        return baddies;
    },
    drawGameOverTicker ({ text: text, bottom: bottom = false, fg: fg }) {
        const doubleText = `${text} ${text} `;
        const { p: p } = this;
        p.noStroke();
        p.fill(fg);
        p.textSize(200);
        p.textAlign(p.LEFT, p.TOP);
        p.textFont((0, $7bebc3cf49080e6e$export$f45fbea8fe20ca8a).body);
        const tickerSpeed = -600 / this.P5_FPS;
        const textWidth = p.textWidth(doubleText);
        if (!this.gameoverTickerX || this.gameoverTickerX + tickerSpeed < -textWidth / 2) this.gameoverTickerX = 0;
        this.gameoverTickerX += tickerSpeed;
        p.text(doubleText, this.gameoverTickerX, bottom ? this.windowHeight - 80 - 120 : 80);
    },
    drawLoseScreen () {
        const { p: p } = this;
        p.push();
        p.noStroke();
        const text = this.bodies[0].radius == 0 ? "NOOO, KILL BADDIES NOT BODY!!" : "TIME IS UP   TIME IS UP  TIME IS UP";
        this.drawGameOverTicker({
            text: "                 " + text,
            fg: (0, $d60e3aa22c788113$export$5714e40777c1bcc2).red
        });
        this.drawFatButton({
            text: "RETRY",
            onClick: ()=>this.restart(null, false),
            fg: (0, $d60e3aa22c788113$export$5714e40777c1bcc2).red,
            bg: (0, $d60e3aa22c788113$export$5714e40777c1bcc2).maroon
        });
        p.pop();
    },
    scaleX (val) {
        const { canvas: canvas } = this.p;
        return val / canvas.offsetWidth * this.windowWidth;
    },
    scaleY (val) {
        const { canvas: canvas } = this.p;
        return val / canvas.offsetHeight * this.windowHeight;
    },
    drawGun () {
        this.p.stroke("rgba(200,200,200,1)");
        this.p.strokeCap(this.p.SQUARE);
        if (this.p.mouseX <= 0 && this.p.mouseY <= 0) return;
        // Bottom left corner coordinates
        let startX = 0;
        let startY = this.windowHeight;
        this.p.strokeWeight(2);
        const crossHairSize = 25;
        // Calculate direction from bottom left to mouse
        let dirX = this.scaleX(this.p.mouseX) - startX;
        let dirY = this.scaleY(this.p.mouseY) - startY;
        this.p.line(this.scaleX(this.p.mouseX) - crossHairSize, this.scaleX(this.p.mouseY), this.scaleX(this.p.mouseX) + crossHairSize, this.scaleX(this.p.mouseY));
        this.p.line(this.scaleX(this.p.mouseX), this.scaleX(this.p.mouseY) - crossHairSize, this.scaleX(this.p.mouseX), this.scaleX(this.p.mouseY) + crossHairSize);
        if (this.paused || this.gameOver) return;
        // Draw the line
        const drawingContext = this.p.canvas.getContext("2d");
        const chunk = this.windowWidth / 100;
        drawingContext.setLineDash([
            chunk
        ]);
        if (this.aimHelper) drawingContext.lineDashOffset = -(this.frames * 10);
        this.p.line(startX, startY, startX + dirX, startY + dirY);
        drawingContext.setLineDash([]);
        drawingContext.lineDashOffset = 0;
        this.p.strokeWeight(0);
    },
    hslToGrayscale (hslArray) {
        if (typeof hslArray == "string") {
            hslArray = hslArray.split(",");
            hslArray[0] = parseInt(hslArray[0].split("(")[1]);
            hslArray[1] = parseInt(hslArray[1]);
            hslArray[2] = parseInt(hslArray[2].split(")")[0]);
            return `hsl(${hslArray[0]},0%,${hslArray[2]}%)`;
        }
        return [
            hslArray[0],
            0,
            hslArray[2]
        ];
    },
    rgbaToGrayscale (rgba, split = 3) {
        const rgbaArray = rgba.split(",");
        const r = parseInt(rgbaArray[0].split("(")[1]);
        const g = parseInt(rgbaArray[1]);
        const b = parseInt(rgbaArray[2]);
        const a = parseFloat(rgbaArray[3].split(")")[0]);
        const avg = Math.min(Math.floor((r + g + b) / split), 255);
        return `rgba(${avg},${avg},${avg},${a})`;
    },
    drawExplosions () {
        if (this.paused || this.gameOver && (!this.celebrating || this.skipAhead) && this.won) return;
        const { explosions: explosions } = this;
        for(let i = 0; i < explosions.length; i++){
            const v = explosions[i].velocity;
            const _explosion = JSON.parse(JSON.stringify(explosions[i]));
            _explosion.velocity = v;
            _explosion.c.bg = this.hslToGrayscale(explosions[i].c.bg, 1.5);
            _explosion.c.fg = this.hslToGrayscale(explosions[i].c.fg);
            _explosion.c.core = this.hslToGrayscale(explosions[i].c.core);
            _explosion.c.baddie = this.hslToGrayscale(explosions[i].c.baddie);
            this.drawBody(_explosion.position.x, _explosion.position.y, _explosion.v, _explosion.radius, _explosion);
        // const bomb = _explosion[0]
        // p.fill('rgba(255,255,255,0.5)')
        // p.stroke('white')
        // p.strokeWeight(2)
        // p.ellipse(bomb.x, bomb.y, bomb.i * 2, bomb.i * 2)
        // p.ellipse(bomb.x, bomb.y, bomb.i * 1.8, bomb.i * 1.8)
        // p.ellipse(bomb.x, bomb.y, bomb.i * 1.6, bomb.i * 1.6)
        // p.ellipse(bomb.x, bomb.y, bomb.i * 1.4, bomb.i * 1.4)
        // p.ellipse(bomb.x, bomb.y, bomb.i * 1.6, bomb.i * 1.6)
        // p.fill('rgba(255,255,255,0.9)')
        // p.ellipse(bomb.x, bomb.y, bomb.i * 1.4, bomb.i * 1.4)
        // _explosion.shift()
        // if (_explosion.length == 0) {
        //   explosions.splice(i, 1)
        // }
        }
    },
    drawMissiles () {
        if (this.paused || this.gameOver) return;
        this.p.noStroke();
        this.p.strokeWeight(0);
        // const missileReverbLevels = 20
        // const green = '2,247,123'
        // const yellow = '255,255,0'
        // const color = yellow
        // const c =
        //   Math.floor(this.frames / missileReverbLevels) % 2 == 0
        //     ? `rgb(${color})`
        //     : 'white'
        const starRadius = 10;
        const star = (x, y, radius1, radius2, npoints, color, rotateBy, index)=>{
            const { p: p } = this;
            let angle = p.TWO_PI / npoints;
            let halfAngle = angle / 2.0;
            p.beginShape();
            if (index == 0) p.fill(color);
            else {
                p.noFill();
                p.strokeWeight(2);
                p.stroke(color);
            }
            for(let a = rotateBy; a < p.TWO_PI + rotateBy; a += angle){
                let sx = x + p.cos(a) * radius2;
                let sy = y + p.sin(a) * radius2;
                p.vertex(sx, sy);
                sx = x + p.cos(a + halfAngle) * radius1;
                sy = y + p.sin(a + halfAngle) * radius1;
                p.vertex(sx, sy);
            }
            p.endShape(p.CLOSE);
            return p;
        };
        //   for (let i = 0; i < missileReverbLevels; i++) {
        //     const alpha = 1 //(missileReverbLevels - i) / missileReverbLevels
        //     console.log({ alpha })
        //     const rainbowColor = `hsla(${(i / missileReverbLevels) * 360}, 100%, 50%, ${alpha})`
        //     const maxStarRadius = starRadius * missileReverbLevels
        //     this.starMissile.push(
        //       this.p.createGraphics(maxStarRadius * 2, maxStarRadius * 2)
        //     )
        //     this.starMissile[i].noStroke()
        //     this.starMissile[i].fill(rainbowColor)
        //     // if (i == 0) {
        //     //   this.starMissile[i].stroke('black')
        //     //   this.starMissile[i].strokeWeight(20)
        //     //   this.starMissile[i].fill(`rgba(255,255,255,1)`)
        //     // }
        //     // this.starMissile.rect(0, 0, maxStarRadius * 2, maxStarRadius * 2)
        //     this.starMissile[i] = star(
        //       this.starMissile[i],
        //       maxStarRadius,
        //       maxStarRadius,
        //       maxStarRadius,
        //       maxStarRadius / 2,
        //       5
        //     )
        //   }
        // }
        const maxLife = 60;
        // const colors = ['white', 'cyan', 'yellow', 'magenta']
        // const colors = ['255,255,255', '0,255,255', '255,255,0', '255,0,255']
        for(let i = 0; i < this.stillVisibleMissiles.length; i++){
            const body = this.stillVisibleMissiles[i];
            if (!body.phase) {
                const life = 0;
                const color = (0, $d60e3aa22c788113$export$159f6df82777d1d0)((0, $d60e3aa22c788113$export$d9a33280f07116d9).bodies.default["pastel_highlighter_marker"].cr);
                const rotateBy = this.frames % 360;
                body.phase = {
                    color: color,
                    life: life,
                    rotateBy: rotateBy
                };
            } else if (!this.paused) {
                body.phase.life++;
                if (body.phase.life >= maxLife) {
                    this.stillVisibleMissiles.splice(i, 1);
                    i--;
                    continue;
                }
            }
            this.stillVisibleMissiles[i] = body;
            // const alpha = 1 //(maxLife - body.phase.life) / maxLife
            // const rainbowColor = `hsla(${body.phase.color}, 100%, 50%, ${alpha})`
            const rainbowColor = body.phase.color //`rgba(${body.phase.color},${alpha})`
            ;
            const thisRadius = starRadius / 1.5 + starRadius * (body.phase.life / 25 * body.phase.life / 25);
            this.p.push();
            this.p.translate(body.position.x, body.position.y);
            // const rotateBy = (i * 2 + this.frames / 4) % 360
            // this.p.rotate(body.phase.rotateBy)
            // const modulo = missileReverbLevels
            // const n = missileReverbLevels + Math.floor(this.frames / 1.8) - i
            // const n = i
            // const index = n % modulo
            star(0, 0, thisRadius, thisRadius / 2, 5, rainbowColor, body.phase.rotateBy, body.phase.life);
            this.p.pop();
        }
    // this.p.push()
    // // const c =
    // //   Math.floor((this.frames - i) / missileReverbLevels) % 2 == 0
    // //     ? `rgba(${color},${(missileReverbLevels - i) / missileReverbLevels})`
    // //     : `rgba(255,255,255,${(missileReverbLevels - i) / missileReverbLevels})`
    // // this.p.stroke(c)
    // this.p.translate(body.position.x, body.position.y)
    // const rotateBy = (this.frames * 2) % 360
    // this.p.rotate(rotateBy)
    // this.p.image(
    //   this.starMissile[0],
    //   -starRadius / 2,
    //   -starRadius / 2,
    //   starRadius,
    //   starRadius
    // )
    // this.p.pop()
    },
    isMissileClose (body) {
        const minDistance = 300;
        let closeEnough = false;
        for(let i = 0; i < this.missiles.length; i++){
            const missile = this.missiles[i];
            const distance = this.p.dist(body.position.x, body.position.y, missile.position.x, missile.position.y);
            if (distance < minDistance) {
                closeEnough = true;
                break;
            }
        }
        return closeEnough;
    },
    drawImageAsset (svg, width, fill, myP = this.bodiesGraphic, strokeWidth = 1) {
        function hashString(str) {
            let hash = 0;
            for(let i = 0; i < str.length; i++){
                const char = str.charCodeAt(i);
                hash = (hash << 5) - hash + char;
                hash |= 0 // Convert to 32bit integer
                ;
            }
            return hash.toString();
        }
        this.imgAssets ||= {};
        // TODO: remove width from ID when colors aren't temp-random
        const assetHash = hashString(svg);
        const id = assetHash + width + fill;
        const loaded = this.imgAssets[id];
        if (!loaded) {
            this.imgAssets[id] = "loading";
            svg = fill ? $123b50dec58735f8$var$replaceAttribute(svg, "fill", fill) : svg;
            svg = $123b50dec58735f8$var$replaceAttribute(svg, "stroke-width", strokeWidth);
            svg = "data:image/svg+xml," + encodeURIComponent(svg);
            try {
                this.p.loadImage(svg, (img)=>{
                    const width = img.width;
                    const height = img.height;
                    const foo = this.p.createGraphics(width, height);
                    foo.pixelDensity(this.pixelDensity);
                    foo.image(img, 0, 0, width, height);
                    this.imgAssets[id] = foo;
                });
            } catch (e) {
                console.error(e);
                this.imgAssets[id] = undefined;
            }
        }
        if (loaded && loaded !== "loading") myP.image(loaded, -width / 2, -width / 2, width, width);
    },
    closeTo (body) {
        let isClose = false;
        const minDistance = body.radius * 2;
        for(let i = 1; i < this.bodies.length; i++){
            const other = this.bodies[i];
            if (other.radius == 0) continue;
            const specificDistance = minDistance + other.radius * 4;
            const distance = this.p.dist(body.position.x, body.position.y, other.position.x, other.position.y);
            if (distance <= specificDistance) {
                isClose = true;
                break;
            }
        }
        return isClose;
    },
    drawFaceSvg (body, width) {
        this.fIndex = body.c.fIndex;
        const { fIndex: fIndex } = this;
        const graphic = body.graphic || this.bodiesGraphic;
        const baddiesNear = this.closeTo(body);
        if (baddiesNear && !this.paused || this.gameOver && !this.won && !this.skipAhead) {
            this.drawImageAsset($123b50dec58735f8$var$FACE_SHOT_SVGS[this.fIndex], width, null, graphic);
            return;
        }
        const x = 5 // every 5 seconds it blinks
        ;
        const m = this.P5_FPS // for 25 frames (1 second)
        ;
        // uncomment the following line to rotate face
        // this.bodiesGraphic.push()
        // this.bodiesGraphic.rotate(body.velocity.heading() + this.p.PI / 2)
        if (Math.floor(this.p5Frames / x) % m == 0 || Math.floor(this.p5Frames / x) % m == 2) this.drawImageAsset($123b50dec58735f8$var$FACE_BLINK_SVGS[fIndex], width, null, graphic);
        else this.drawImageAsset($123b50dec58735f8$var$FACE_SVGS[fIndex], width, null, graphic);
    // this.bodiesGraphic.pop()
    },
    drawStarForegroundSvg (width, body) {
        const fill = body.c.fg;
        const graphic = body.graphic || this.bodiesGraphic;
        graphic.push();
        this.fgIndex = body.c.fgIndex;
        const { fgIndex: fgIndex } = this;
        const r = {
            ...$123b50dec58735f8$var$rot.fg,
            ...$123b50dec58735f8$var$rotOverride?.fg?.[fgIndex] ?? {}
        };
        const rotateBy = r.speed == 0 ? 0 : this.p5Frames / this.P5_FPS_MULTIPLIER / r.speed % 360;
        graphic.rotate(r.direction * rotateBy);
        this.drawImageAsset($123b50dec58735f8$var$FG_SVGS[fgIndex], width, fill, graphic);
        graphic.pop();
    },
    drawCoreSvg (width, body) {
        const fill = body.c.core;
        const graphic = body.graphic || this.bodiesGraphic;
        graphic.push();
        const r = {
            ...$123b50dec58735f8$var$rot.core,
            ...$123b50dec58735f8$var$rotOverride?.core?.[0] ?? {}
        };
        const rotateBy = r.speed == 0 ? 0 : this.p5Frames / this.P5_FPS_MULTIPLIER / r.speed % 360;
        graphic.rotate(r.direction * rotateBy);
        this.drawImageAsset($123b50dec58735f8$var$CORE_SVGS[0], width, fill, graphic);
        graphic.pop();
    },
    drawStarBackgroundSvg (width, body) {
        const fill = body.c.bg;
        const graphic = body.graphic || this.bodiesGraphic;
        graphic.push();
        this.bgIndex = body.c.bgIndex;
        const { bgIndex: bgIndex } = this;
        const r = {
            ...$123b50dec58735f8$var$rot.bg,
            ...$123b50dec58735f8$var$rotOverride?.bg?.[bgIndex] ?? {}
        };
        const rotateBy = r.speed == 0 ? 0 : this.p5Frames / this.P5_FPS_MULTIPLIER / r.speed % 360;
        graphic.rotate(r.direction * rotateBy);
        this.drawImageAsset($123b50dec58735f8$var$BG_SVGS[bgIndex], width, fill, graphic);
        graphic.pop();
    },
    moveAndRotate_PopAfter (graphic, x, y /*v*/ ) {
        graphic.push();
        graphic.translate(x, y);
    // rotate body in vector direction
    // const angle = v.heading() + this.p.PI / 2
    // graphic.rotate(angle)
    // if (v.x > 0) {
    //   graphic.scale(-1, 1)
    // }
    // if (v.y > 0) {
    //   graphic.scale(1, -1)
    // }
    },
    exportBody (day, shouldRotate = true, width = this.windowWidth, height = this.windowHeight) {
        // const graphic = this.p.createGraphics(width, height)
        // if (!this.starBG) {
        //   throw new Error('no starbg')
        // }
        // const starBGpixelData = this.starBG.drawingContext.getImageData(
        //   0,
        //   0,
        //   width,
        //   height
        // ).data
        const bodyData = this.generateLevelData(day, 1);
        const bodies = bodyData.map((b)=>this.bodyDataToBodies.call(this, b, day));
        const heroBody = bodies[0];
        console.log({
            heroBody: heroBody
        });
        // create an SVG element with a black background
        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute("width", width);
        svg.setAttribute("height", height);
        svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
        svg.setAttribute("xmlns:xlink", "http://www.w3.org/1999/xlink");
        svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
        svg.setAttribute("version", "1.1");
        // make svg have a black background
        // const bgRect = document.createElementNS(
        //   'http://www.w3.org/2000/svg',
        //   'rect'
        // )
        // bgRect.setAttribute('x', 0)
        // bgRect.setAttribute('y', 0)
        // bgRect.setAttribute('width', width)
        // bgRect.setAttribute('height', height)
        // bgRect.setAttribute('fill', 'black')
        // svg.appendChild(bgRect)
        // add starBGpixelData as PNG to the SVG
        // const starBG = document.createElementNS(
        //   'http://www.w3.org/2000/svg',
        //   'image'
        // )
        // starBG.setAttribute('x', 0)
        // starBG.setAttribute('y', 0)
        // starBG.setAttribute('width', width)
        // starBG.setAttribute('height', height)
        // starBG.setAttribute('href', this.starBG.canvas.toDataURL('image/png'))
        // svg.appendChild(starBG)
        // add hero body to the SVG
        const bgIndex = heroBody.c.bgIndex;
        const coreIndex = heroBody.c.coreIndex;
        const fgIndex = heroBody.c.fgIndex;
        const faceIndex = heroBody.c.fIndex;
        const prefix = (svg)=>`data:image/svg+xml;base64,${btoa(svg)}`;
        const bgSVG = prefix($123b50dec58735f8$var$replaceAttribute($123b50dec58735f8$var$BG_SVGS[bgIndex], "fill", heroBody.c.bg));
        const coreSVG = prefix($123b50dec58735f8$var$replaceAttribute($123b50dec58735f8$var$CORE_SVGS[coreIndex], "fill", heroBody.c.core));
        const fgSVG = prefix($123b50dec58735f8$var$replaceAttribute($123b50dec58735f8$var$FG_SVGS[fgIndex], "fill", heroBody.c.fg));
        const faceSVG = prefix($123b50dec58735f8$var$FACE_SVGS[faceIndex]);
        const uuid = ()=>Math.random().toString(36).substr(2, 9);
        const bgId = `bg-${bgIndex}-${uuid()}`;
        const coreId = `core-${coreIndex}-${uuid()}`;
        const fgId = `fg-${fgIndex}-${uuid()}`;
        const faceId = `f-${faceIndex}-${uuid()}`;
        const bgRatio = 1;
        const coreRatio = 0.375;
        const fgRatio = 1;
        const faceRatio = 1;
        // add the svg elements to the parent svg
        const bg = document.createElementNS("http://www.w3.org/2000/svg", "image");
        const bgWidth = width * bgRatio;
        const bgHeight = height * bgRatio;
        const bgOffset = (width - bgWidth) / 2;
        const bgYOffset = (height - bgHeight) / 2;
        bg.setAttribute("id", bgId);
        bg.setAttribute("x", bgOffset);
        bg.setAttribute("y", bgYOffset);
        bg.setAttribute("width", bgWidth);
        bg.setAttribute("height", bgHeight);
        bg.setAttribute("href", bgSVG);
        svg.appendChild(bg);
        const core = document.createElementNS("http://www.w3.org/2000/svg", "image");
        const coreWidth = width * coreRatio;
        const coreHeight = height * coreRatio;
        const coreOffset = (width - coreWidth) / 2;
        const coreYOffset = (height - coreHeight) / 2;
        core.setAttribute("id", coreId);
        core.setAttribute("x", coreOffset);
        core.setAttribute("y", coreYOffset);
        core.setAttribute("width", coreWidth);
        core.setAttribute("height", coreHeight);
        core.setAttribute("href", coreSVG);
        svg.appendChild(core);
        const fg = document.createElementNS("http://www.w3.org/2000/svg", "image");
        const fgWidth = width * fgRatio;
        const fgHeight = height * fgRatio;
        const fgOffset = (width - fgWidth) / 2;
        const fgYOffset = (height - fgHeight) / 2;
        fg.setAttribute("id", fgId);
        fg.setAttribute("x", fgOffset);
        fg.setAttribute("y", fgYOffset);
        fg.setAttribute("width", fgWidth);
        fg.setAttribute("height", fgHeight);
        fg.setAttribute("href", fgSVG);
        svg.appendChild(fg);
        const face = document.createElementNS("http://www.w3.org/2000/svg", "image");
        const faceWidth = width * faceRatio;
        const faceHeight = height * faceRatio;
        const faceOffset = (width - faceWidth) / 2;
        const faceYOffset = (height - faceHeight) / 2;
        face.setAttribute("id", faceId);
        face.setAttribute("x", faceOffset);
        face.setAttribute("y", faceYOffset);
        face.setAttribute("width", faceWidth);
        face.setAttribute("height", faceHeight);
        face.setAttribute("href", faceSVG);
        svg.appendChild(face);
        if (shouldRotate) {
            const fgSpin = {
                ...$123b50dec58735f8$var$rot.fg,
                ...$123b50dec58735f8$var$rotOverride?.fg?.[fgIndex] ?? {}
            };
            const fgAnimation = fgSpin.direction < 0 ? "fullRotateR" : "fullRotate";
            const fgSpeed = (fgSpin.speed / 3).toFixed(2);
            const bgSpin = {
                ...$123b50dec58735f8$var$rot.bg,
                ...$123b50dec58735f8$var$rotOverride?.bg?.[bgIndex] ?? {}
            };
            const bgAnimation = bgSpin.direction < 0 ? "fullRotateR" : "fullRotate";
            const bgSpeed = (bgSpin.speed / 3).toFixed(2);
            const coreSpin = {
                ...$123b50dec58735f8$var$rot.core
            };
            const coreAnimation = "fullRotate";
            const coreSpeed = (coreSpin.speed / 3).toFixed(2);
            // add css to the svg that makes each element rotate
            const css = document.createElement("style");
            css.innerHTML = `
@keyframes fullRotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@keyframes fullRotateR {
  from {
    transform: rotate(360deg);
  }
  to {
    transform: rotate(0deg);
  }
}
#${bgId} {
  animation: ${bgAnimation} ${bgSpeed}s linear infinite;
  transform-origin: center center; 
}
#${coreId} {
  animation: ${coreAnimation} ${coreSpeed}s linear infinite;
  transform-origin: center center; 
}
#${fgId} {
  animation: ${fgAnimation} ${fgSpeed}s linear infinite;
  transform-origin: center center; 
}`;
            svg.appendChild(css);
        }
        return svg;
    },
    drawBody (x, y, v, radius, body) {
        const graphic = body.graphic || this.bodiesGraphic;
        this.moveAndRotate_PopAfter(graphic, x, y, v);
        // y-offset of face relative to center
        // const offset = this.getOffset(radius)
        if ((body.bodyIndex === 0 || body.hero) && (this.level !== 0 || this.paused)) {
            // draw hero
            const size = Math.floor(body.radius * $123b50dec58735f8$var$BODY_SCALE * 2.66);
            this.drawStarBackgroundSvg(size, body);
            if (!body.backgroundOnly) this.drawCoreSvg(body.radius * $123b50dec58735f8$var$BODY_SCALE, body);
            this.drawStarForegroundSvg(size, body);
            if (!body.backgroundOnly) this.drawFaceSvg(body, size);
        } else this.drawBaddie(body);
        graphic.pop();
    },
    getBodyRadius (actualRadius) {
        return actualRadius * 4;
    },
    drawBodiesLooped (body, radius, drawFunction) {
        body.backgroundOnly = false;
        drawFunction = drawFunction.bind(this);
        drawFunction(body.position.x, body.position.y, body.velocity, radius, body);
        if (this.paused) return;
        if (this.gameOver) return;
        if (body.bodyIndex !== 0 || this.level == 0) return;
        let loopedX = false, loopedY = false, loopX = body.position.x, loopY = body.position.y;
        const loopGap = radius * 1.5;
        body.backgroundOnly = true;
        // crosses right, draw on left
        if (body.position.x > this.windowWidth - loopGap) {
            loopedX = true;
            loopX = body.position.x - this.windowWidth;
            drawFunction(loopX, body.position.y, body.velocity, radius, body);
        // crosses left, draw on right
        } else if (body.position.x < loopGap) {
            loopedX = true;
            loopX = body.position.x + this.windowWidth;
            drawFunction(loopX, body.position.y, body.velocity, radius, body);
        }
        // crosses bottom, draw on top
        if (body.position.y > this.windowHeight - loopGap) {
            loopedY = true;
            loopY = body.position.y - this.windowHeight;
            drawFunction(body.position.x, loopY, body.velocity, radius, body);
        // crosses top, draw on bottom
        } else if (body.position.y < loopGap) {
            loopedY = true;
            loopY = body.position.y + this.windowHeight;
            drawFunction(body.position.x, loopY, body.velocity, radius, body);
        }
        // crosses corner, draw opposite corner
        if (loopedX && loopedY) drawFunction(loopX, loopY, body.velocity, radius, body);
    },
    // TODO: add this back as part of a end game animation
    drawWitheringBodies () {
        if (this.gameOver) return;
        const { p: p } = this;
        this.bodiesGraphic ||= p.createGraphics(this.windowWidth, this.windowHeight);
        this.bodiesGraphic.drawingContext.msImageSmoothingEnabled = false;
        this.bodiesGraphic.drawingContext.mozImageSmoothingEnabled = false;
        this.bodiesGraphic.drawingContext.webkitImageSmoothingEnabled = false;
        this.bodiesGraphic.drawingContext.imageSmoothingEnabled = false;
        // this.bodiesGraphic.pixelDensity(0.2)
        this.bodiesGraphic.drawingContext.msImageSmoothingEnabled = false;
        this.bodiesGraphic.drawingContext.mozImageSmoothingEnabled = false;
        this.bodiesGraphic.drawingContext.webkitImageSmoothingEnabled = false;
        this.bodiesGraphic.drawingContext.imageSmoothingEnabled = false;
        this.bodiesGraphic.noStroke();
        for (const body of this.witheringBodies){
            p.push();
            p.translate(body.position.x, body.position.y);
            body.witherSteps ||= 0;
            body.witherSteps++;
            if (body.witherSteps > $123b50dec58735f8$var$WITHERING_STEPS) {
                this.witheringBodies = this.witheringBodies.filter((b)=>b !== body);
                p.pop();
                continue;
            }
            // the body should shrink to nothing over WITHERING_STEPS
            const radius = p.map($123b50dec58735f8$var$WITHERING_STEPS - body.witherSteps, 0, $123b50dec58735f8$var$WITHERING_STEPS, 1, 30 // start radius
            );
            // the ghost body pulses a little bit, isn't totally round
            body.zoff ||= 0;
            p.stroke(255);
            p.noFill();
            p.fill(255, 255, 255, 230);
            p.beginShape();
            for(let a = 0; a < p.TWO_PI; a += 0.02){
                let xoff = p.map(p.cos(a), -1, 1, 0, 2);
                let yoff = p.map(p.sin(a), -1, 1, 0, 2);
                const r = p.map(p.noise(xoff, yoff, body.zoff), 0, 1, radius - 10, radius);
                let x = r * p.cos(a);
                let y = r * p.sin(a);
                p.vertex(x, y);
            }
            p.endShape(p.CLOSE);
            body.zoff += 0.01;
            p.pop();
        }
    },
    async drawBodies (attachToCanvas = true) {
        if (this.won && (!this.celebrating || this.skipAhead)) return;
        this.bodiesGraphic ||= this.p.createGraphics(this.windowWidth, this.windowHeight);
        this.bodiesGraphic.noStroke();
        const bodyCopies = [];
        for(let i = 0; i < this.bodies.length; i++){
            // const body = this.bodies.sort((a, b) => b.radius - a.radius)[i]
            const body = this.bodies[i];
            // after final proof is sent, don't draw upgradable bodies
            if (body.radius == 0) continue;
            const bodyRadius = this.bodyCopies.filter((b)=>b.bodyIndex == body.bodyIndex)[0]?.radius;
            const radius = this.getBodyRadius(bodyRadius);
            this.drawBodiesLooped(body, radius, this.drawBody);
            const bodyCopy = JSON.parse(JSON.stringify(body, (key, value)=>typeof value === "bigint" ? value.toString() : value // return everything else unchanged
            ));
            bodyCopy.position = this.p.createVector(body.position.x, body.position.y);
            bodyCopy.velocity = this.p.createVector(body.velocity.x, body.velocity.y);
            bodyCopies.push(bodyCopy);
        }
        if (attachToCanvas) this.p.image(this.bodiesGraphic, 0, 0);
        this.bodiesGraphic.clear();
    },
    drawPauseBodies () {
        this.pauseGraphic.noStroke();
        for (const [i, body] of this.pauseBodies.entries()){
            this.pauseGraphic.push();
            body.position.x;
            // after final proof is sent, don't draw upgradable bodies
            if (body.radius == 0) continue;
            const bodyRadius = this.bodyCopies.filter((b)=>b.bodyIndex == body.bodyIndex)[0]?.radius;
            // TODO: often there is no bodyRadius because bodyIndex doesn't match
            // what is going on there?
            // if (!bodyRadius) {
            //   throw new Error('no body matches')
            // }
            const radius = this.getBodyRadius(bodyRadius);
            // calculate x and y wobble factors based on this.p5Frames to make the pause bodies look like they're bobbing around
            const xWobble = this.p.sin(this.p.frameCount / this.P5_FPS) * (10 + body.bodyIndex);
            const yWobble = this.p.cos(this.p.frameCount / this.P5_FPS + body.bodyIndex * 3) * (16 + body.bodyIndex);
            // if not paused, bodies should flee to the nearest side of the screen
            const fleeDuration = 1.5 // seconds
            ;
            const xFlee = this.willUnpause && this.beganUnpauseAt ? this.p.map(this.p5Frames - this.beganUnpauseAt, 0, this.P5_FPS * fleeDuration, 0, body.position.x > this.windowWidth / 2 ? this.windowWidth + 300 : -300) : 0;
            const yFlee = this.willUnpause && this.beganUnpauseAt ? this.p.map(this.p5Frames - this.beganUnpauseAt, 0, this.P5_FPS * fleeDuration, 0, body.position.y > this.windowHeight / 2 ? this.windowHeight + 300 : -300) : 0;
            const bodyCopy = JSON.parse(JSON.stringify(body, (key, value)=>typeof value === "bigint" ? value.toString() : value // return everything else unchanged
            ));
            bodyCopy.position = this.p.createVector(body.position.x + xWobble + xFlee, body.position.y + yWobble + yFlee);
            bodyCopy.velocity = this.p.createVector(body.velocity.x, body.velocity.y);
            bodyCopy.graphic = this.pauseGraphic;
            bodyCopy.hero = i < 3;
            this.drawBodiesLooped(bodyCopy, radius, this.drawBody);
            this.pauseGraphic.pop();
        }
    },
    replaceOpacity (c, opacity) {
        const isHSLA = c.includes("hsla");
        const prefix = isHSLA ? "hsla" : "rgba";
        let cc = c.split(",").map((c)=>parseFloat(c.replace(")", "").replace(prefix + "(", "")));
        if (cc.length !== 4) throw new Error("Color must have alpha value format, instead it has " + c);
        cc[3] = opacity;
        if (isHSLA) {
            cc[1] = cc[1] + "%";
            cc[2] = cc[2] + "%";
        }
        return `${prefix}(${cc.join(",")})`;
    },
    brighten (c, amount = 20) {
        let cc = c;
        let inhsla = false;
        if (c.includes("rgba")) {
            inhsla = true;
            cc = c.split(",").map((c)=>parseFloat(c.replace(")", "").replace("hsla(", "")));
        } else cc = cc.map((c)=>{
            return parseFloat(("" + c).replace("%", ""));
        });
        cc[2] = cc[2] + amount;
        cc[1] = cc[1] + (inhsla ? "%" : "");
        cc[2] = cc[2] + (inhsla ? "%" : "");
        return inhsla ? `hsla(${cc.join(",")})` : cc;
    },
    drawBaddie (body) {
        const graphic = body.graphic || this.bodiesGraphic;
        const colorHSL = body.c.baddie;
        const coreWidth = body.radius * $123b50dec58735f8$var$BODY_SCALE;
        let bgColor = (0, $d60e3aa22c788113$export$29fb7152bd3f781a)(this.brighten(colorHSL, -20), 1);
        const coreColor = `hsl(${colorHSL[0]},${colorHSL[1]}%,${colorHSL[2]}%)`;
        graphic.push();
        const rotate = this.p5Frames / this.P5_FPS_MULTIPLIER / 30 % 360;
        graphic.rotate(rotate);
        this.drawImageAsset($123b50dec58735f8$var$BADDIE_SVG.bg, Math.floor(coreWidth * (310 / 111.2)), bgColor, graphic, "0.5");
        graphic.push();
        const heading = this.level == 0 ? -this.p.PI / 2 : body.velocity.heading();
        graphic.rotate(-rotate + heading + this.p.PI / 2);
        if (!body.backgroundOnly) {
            this.drawImageAsset($123b50dec58735f8$var$BADDIE_SVG.core, coreWidth, coreColor, graphic, "0.5");
            this.drawImageAsset($123b50dec58735f8$var$BADDIE_SVG.face, coreWidth, coreColor, graphic);
            // pupils always looking at missile, if no missile, look at mouse
            const target = this.missiles.length > 0 ? this.missiles[0].position : {
                x: this.scaleX(this.p.mouseX),
                y: this.scaleY(this.p.mouseY)
            };
            const bx = body.position.x;
            const by = body.position.y;
            const leftEye = [
                -body.radius * 0.6,
                -body.radius * 0.15
            ];
            const rightEye = [
                body.radius * 0.6,
                -body.radius * 0.15
            ];
            graphic.fill("white");
            graphic.strokeWeight(1);
            graphic.stroke("black");
            graphic.circle(leftEye[0], leftEye[1], body.radius);
            graphic.circle(rightEye[0], rightEye[1], body.radius);
            const angle = Math.atan2(target.y - by, target.x - bx) - heading - this.p.PI / 2;
            const distance = body.radius * 0.2;
            const leftX = distance * Math.cos(angle);
            const leftY = distance * Math.sin(angle);
            graphic.fill("black");
            graphic.circle(leftX + leftEye[0], leftY + leftEye[1], body.radius * 0.5);
            graphic.circle(leftX + rightEye[0], leftY + rightEye[1], body.radius * 0.5);
        // const heroBody = this.bodies[0]
        // const minDistance = heroBody.radius * 2 + body.radius * 4
        // const currentDistance = graphic.dist(
        //   heroBody.position.x,
        //   heroBody.position.y,
        //   body.position.x,
        //   body.position.y
        // )
        // const closeToBody = currentDistance <= minDistance
        // if (true) {
        // graphic.noStroke()
        // graphic.fill(coreColor)
        // graphic.triangle(
        //   0,
        //   -body.radius * 0.2,
        //   leftEye[0] * 2,
        //   -body.radius * 0.8,
        //   rightEye[0] * 2,
        //   -body.radius * 0.8
        // )
        // }
        }
        graphic.pop();
        graphic.pop();
    },
    drawCenter (b, p = this.bodiesGraphic, x = 0, y = 0) {
        let closeEnough = false //this.isMissileClose(b)
        ;
        // this.p.blendMode(this.p.DIFFERENCE)
        p.noStroke();
        x = x == undefined ? b.position.x : x;
        y = y == undefined ? b.position.y : y;
        const r = b.radius * $123b50dec58735f8$var$BODY_SCALE // b.radius * 4
        ;
        if (r == 0) return;
        // let c = this.brighten(b.c).replace(this.opac, 1)
        let darker = this.brighten(b.c, -30).replace(this.opac, 1);
        p.fill(darker);
        p.ellipse(x, y, r);
        if (closeEnough) {
            // draw teeth
            const teeth = 10;
            const toothSize = r / 4.5;
            // if (closeEnough) {
            p.fill(darker);
            p.ellipse(x, y, r);
            for(let i = 0; i < teeth; i++){
                if (i == Math.floor(teeth / 4)) continue;
                if (i == Math.ceil(teeth / 4)) continue;
                if (i == Math.floor(3 * teeth / 4)) continue;
                if (i == Math.ceil(3 * teeth / 4)) continue;
                p.fill("white");
                // draw each tooth
                const angle = i * this.p.TWO_PI / teeth;
                // add some rotation depending on vector of body
                const rotatedAngle = angle + b.velocity.heading();
                const x1 = x + r / 2.3 * this.p.cos(rotatedAngle);
                const y1 = y + r / 2.3 * this.p.sin(rotatedAngle);
                p.ellipse(x1, y1, toothSize);
            }
            p.stroke(darker);
            p.strokeWeight(r / 12);
            p.noFill();
            p.ellipse(x, y, r);
        } else {
            /** DRAW TARGET */ // const width = r / 2
            // const rotatedAngle = b.velocity.heading()
            // p.push()
            // p.translate(x, y)
            // p.rotate(rotatedAngle + p.PI / 2)
            // const teeth = 6
            // for (let i = 0; i < teeth; i++) {
            //   p.fill('white')
            //   const xx = 0 - width / (teeth / 2) + ((i % (teeth / 2)) * width) / 2
            //   const yy =
            //     -width / (teeth / 2) - ((i < teeth / 2 ? -1 : 1) * width) / 5
            //   p.ellipse(xx - width / teeth / 2, yy + width / 4, width / (teeth / 3))
            // }
            // p.fill(darker)
            // p.rect(0 - width / 1.5, 0 - width / 1.5, width * 1.5, width / 3)
            // p.rect(0 - width / 1.5, 0 + width / 4, width * 1.5, width / 3)
            // p.strokeWeight(15)
            // p.noFill()
            // p.stroke(darker)
            // p.ellipse(0, 0, r - 7)
            // p.pop()
            p.strokeWeight(0);
            const count = 3;
            for(let i = 0; i < count; i++){
                if (i % 2 == 1) p.fill("white");
                else p.fill(darker);
                p.ellipse(x, y, r - i * r / count);
            }
        }
    // p.blendMode(p.BLEND)
    },
    colorArrayToTxt (cc) {
        // let cc = baseColor.map(c => c + start + (chunk * i))
        cc.push(this.opac);
        cc = `hsla(${cc.join(",")})`;
        return cc;
    },
    createVector (x, y) {
        if (this.p) return this.p.createVector(x, y);
        else return {
            x: x,
            y: y
        };
    },
    frameRate () {
        this.lastFrameRateCheckAt ||= {
            frames: this.frames,
            time: Date.now()
        };
        this.lastFrameRate ||= 0;
        if (this.frames - this.lastFrameRateCheckAt.frames > 30) {
            const diff = Date.now() - this.lastFrameRateCheckAt.time;
            this.lastFrameRate = (this.frames - this.lastFrameRateCheckAt.frames) / diff * 1000;
            this.lastFrameRateCheckAt = {
                frames: this.frames,
                time: Date.now()
            };
        }
        return this.lastFrameRate;
    },
    shareCanvas () {
        const canvas = this.p.canvas;
        canvas.toBlob((blob)=>{
            const file = new File([
                blob
            ], "p5canvas.png", {
                type: "image/png"
            });
            if (navigator.share) {
                console.log("sharing canvas...");
                navigator.share({
                    files: [
                        file
                    ]
                }).catch((error)=>console.error("Error sharing:", error));
            } else if (navigator.clipboard && navigator.clipboard.write) try {
                console.log("writing canvas to clipboard...");
                navigator.clipboard.write([
                    new ClipboardItem({
                        "image/png": blob
                    })
                ]);
                this.popup = {
                    header: "Go Share!",
                    body: [
                        "Copied results to your clipboard."
                    ],
                    fg: (0, $d60e3aa22c788113$export$5714e40777c1bcc2).pink_50,
                    bg: (0, $d60e3aa22c788113$export$5714e40777c1bcc2).pink_75,
                    buttons: [
                        {
                            text: "CLOSE",
                            onClick: ()=>{
                                this.popup = null;
                            }
                        }
                    ]
                };
            } catch (error) {
                console.error("Error copying to clipboard:", error);
                this.popup = {
                    header: "Hmmm",
                    body: [
                        "Couldn\u2019t copy results to your clipboard."
                    ],
                    buttons: [
                        {
                            text: "CLOSE",
                            onClick: ()=>{
                                this.popup = null;
                            }
                        }
                    ]
                };
            }
            else console.error("no options to share canvas!");
        }, "image/png");
    }
};


const $2e7936229def99fa$export$1270c16ec3b4f45a = {
    forceAccumulator (bodies = this.bodies) {
        bodies = this.convertBodiesToBigInts(bodies);
        bodies = this.forceAccumulatorBigInts(bodies);
        bodies = this.convertBigIntsToBodies(bodies);
        return bodies;
    },
    forceAccumulatorBigInts (bodies) {
        const vectorLimitScaled = this.convertFloatToScaledBigInt(this.vectorLimit);
        let accumulativeForces = [];
        for(let i = 0; i < bodies.length; i++)accumulativeForces.push([
            0n,
            0n
        ]);
        const time = BigInt(this.speedFactor);
        for(let i = 0; i < bodies.length; i++){
            const body = bodies[i];
            for(let j = i + 1; j < bodies.length; j++){
                const otherBody = bodies[j];
                const force = this.calculateForceBigInt(body, otherBody);
                const bodyVelocity = [
                    time * force[0],
                    time * force[1]
                ];
                const otherBodyVelocity = [
                    time * -force[0],
                    time * -force[1]
                ];
                accumulativeForces[i] = $2e7936229def99fa$export$240a15193e06bf11(accumulativeForces[i], bodyVelocity);
                accumulativeForces[j] = $2e7936229def99fa$export$240a15193e06bf11(accumulativeForces[j], otherBodyVelocity);
            }
        }
        for(let i = 0; i < bodies.length; i++){
            const body = bodies[i];
            const body_velocity = $2e7936229def99fa$export$240a15193e06bf11([
                body.velocity.x,
                body.velocity.y
            ], accumulativeForces[i]);
            body.velocity.x = body_velocity[0];
            body.velocity.y = body_velocity[1];
            const body_velocity_x_abs = body.velocity.x > 0n ? body.velocity.x : -1n * body.velocity.x;
            if (body_velocity_x_abs > vectorLimitScaled) body.velocity.x = body_velocity_x_abs / body.velocity.x * vectorLimitScaled;
            const body_velocity_y_abs = body.velocity.y > 0n ? body.velocity.y : -1n * body.velocity.y;
            if (body_velocity_y_abs > vectorLimitScaled) body.velocity.y = body_velocity_y_abs / body.velocity.y * vectorLimitScaled;
            const body_position = $2e7936229def99fa$export$240a15193e06bf11([
                body.position.x,
                body.position.y
            ], [
                body.velocity.x,
                body.velocity.y
            ]);
            body.position.x = body_position[0];
            body.position.y = body_position[1];
        }
        const scaledWindowWidth = this.convertFloatToScaledBigInt(this.windowWidth);
        for(let i = 0; i < bodies.length; i++){
            const body = bodies[i];
            if (body.position.x > scaledWindowWidth) body.position.x = 0n;
            else if (body.position.x < 0n) body.position.x = scaledWindowWidth;
            if (body.position.y > scaledWindowWidth) body.position.y = 0n;
            else if (body.position.y < 0n) body.position.y = scaledWindowWidth;
        }
        return bodies;
    },
    calculateBodyFinal () {
        this.bodies.sort((a, b)=>a.bodyIndex - b.bodyIndex);
        const bodiesAsBigInts = this.convertBodiesToBigInts(this.bodies);
        this.bodyFinal = bodiesAsBigInts.map((b)=>{
            b = this.convertScaledBigIntBodyToArray(b);
            b[2] = BigInt(b[2]).toString();
            b[3] = BigInt(b[3]).toString();
            return b;
        });
    },
    // Calculate the gravitational force between two bodies
    calculateForceBigInt (body1, body2) {
        const GScaled = BigInt(Math.floor(this.G * parseInt(this.scalingFactor)));
        let minDistanceScaled = BigInt(this.minDistanceSquared) * this.scalingFactor ** 2n // when the original gets squared, the scaling factor gets squared
        ;
        const position1 = body1.position;
        const body1_position_x = position1.x;
        const body1_position_y = position1.y;
        const body1_radius = body1.radius;
        const position2 = body2.position;
        const body2_position_x = position2.x;
        const body2_position_y = position2.y;
        const body2_radius = body2.radius;
        let dx = body2_position_x - body1_position_x;
        let dy = body2_position_y - body1_position_y;
        const dxAbs = dx > 0n ? dx : -1n * dx;
        const dyAbs = dy > 0n ? dy : -1n * dy;
        const dxs = dx * dx;
        const dys = dy * dy;
        let distanceSquared;
        const unboundDistanceSquared = dxs + dys;
        if (unboundDistanceSquared < minDistanceScaled) distanceSquared = minDistanceScaled;
        else distanceSquared = unboundDistanceSquared;
        let distance = $2e7936229def99fa$export$8fa9c237d5a45d55(distanceSquared);
        const bodies_sum = body1_radius == 0n || body2_radius == 0n ? 0n : (body1_radius + body2_radius) * 4n // NOTE: this could be tweaked as a variable for "liveliness" of bodies
        ;
        const distanceSquared_with_avg_denom = distanceSquared * 2n // NOTE: this is a result of moving division to the end of the calculation
        ;
        const forceMag_numerator = GScaled * bodies_sum * this.scalingFactor // distance should be divided by scaling factor but this preserves rounding with integer error
        ;
        const forceDenom = distanceSquared_with_avg_denom * distance;
        const forceXnum = dxAbs * forceMag_numerator;
        const forceXunsigned = $2e7936229def99fa$export$c869c44f9b0ac403(forceXnum, forceDenom);
        const forceX = dx < 0n ? -forceXunsigned : forceXunsigned;
        const forceYnum = dyAbs * forceMag_numerator;
        const forceYunsigned = $2e7936229def99fa$export$c869c44f9b0ac403(forceYnum, forceDenom);
        const forceY = dy < 0n ? -forceYunsigned : forceYunsigned;
        return [
            forceX,
            forceY
        ];
    },
    convertScaledStringArrayToMissile (missile) {
        return this.convertScaledStringArrayToBody(missile, this.missileVectorLimit);
    },
    convertScaledStringArrayToBody (body, vectorLimit = this.vectorLimit) {
        const maxVectorScaled = this.convertFloatToScaledBigInt(vectorLimit);
        return {
            position: {
                x: BigInt(body[0]),
                y: BigInt(body[1])
            },
            velocity: {
                x: BigInt(body[2]) - maxVectorScaled,
                y: BigInt(body[3]) - maxVectorScaled
            },
            radius: BigInt(body[4])
        };
    },
    convertScaledBigIntMissileToArray (m) {
        return this.convertScaledBigIntBodyToArray(m, this.missileVectorLimit);
    },
    convertScaledBigIntBodyToArray (b, vectorLimit = this.vectorLimit) {
        const maxVectorScaled = this.convertFloatToScaledBigInt(vectorLimit);
        const bodyArray = [];
        const noNegativeVelocityX = b.velocity.x + maxVectorScaled;
        const noNegativeVelocityY = b.velocity.y + maxVectorScaled;
        bodyArray.push($2e7936229def99fa$export$a8f58c7a5ea1bb66(b.position.x), $2e7936229def99fa$export$a8f58c7a5ea1bb66(b.position.y), $2e7936229def99fa$export$a8f58c7a5ea1bb66(noNegativeVelocityX), $2e7936229def99fa$export$a8f58c7a5ea1bb66(noNegativeVelocityY), $2e7936229def99fa$export$a8f58c7a5ea1bb66(b.radius));
        return bodyArray.map((b)=>b.toString());
    },
    convertScaledStringToBigInt (value) {
        return BigInt(value);
    },
    convertMissileScaledStringArrayToFloat (missile) {
        const maxMissileVectorScaled = this.convertFloatToScaledBigInt(this.missileVectorLimit);
        missile = missile.map(this.convertScaledStringToBigInt.bind(this));
        return {
            position: {
                x: 0,
                y: this.windowWidth
            },
            velocity: {
                x: this.convertScaledBigIntToFloat(missile[0] - maxMissileVectorScaled),
                y: this.convertScaledBigIntToFloat(missile[1] - maxMissileVectorScaled)
            },
            radius: parseInt(missile[2])
        };
    },
    convertScaledStringArrayToFloat (body) {
        const maxVectorScaled = this.convertFloatToScaledBigInt(this.vectorLimit);
        body = body.map(this.convertScaledStringToBigInt.bind(this));
        return {
            position: {
                x: this.convertScaledBigIntToFloat(body[0]),
                y: this.convertScaledBigIntToFloat(body[1])
            },
            velocity: {
                x: this.convertScaledBigIntToFloat(body[2] - maxVectorScaled),
                y: this.convertScaledBigIntToFloat(body[3] - maxVectorScaled)
            },
            radius: this.convertScaledBigIntToFloat(body[4])
        };
    },
    convertBigIntsToBodies (bigBodies) {
        const bodies = [];
        for(let i = 0; i < bigBodies.length; i++){
            const body = bigBodies[i];
            const newBody = {
                bodyIndex: i,
                position: {},
                velocity: {},
                radius: null
            };
            newBody.px = body.position.x;
            newBody.position.x = this.convertScaledBigIntToFloat(body.position.x);
            newBody.py = body.position.y;
            newBody.position.y = this.convertScaledBigIntToFloat(body.position.y);
            newBody.position = this.createVector(newBody.position.x, newBody.position.y);
            newBody.vx = body.velocity.x;
            newBody.velocity.x = this.convertScaledBigIntToFloat(body.velocity.x);
            newBody.vy = body.velocity.y;
            newBody.velocity.y = this.convertScaledBigIntToFloat(body.velocity.y);
            newBody.velocity = this.createVector(newBody.velocity.x, newBody.velocity.y);
            if (!this.accumX) {
                this.accumX = 0;
                this.accumY = 0;
            }
            this.accumX += newBody.velocity.x;
            this.accumY += newBody.velocity.y;
            newBody.radius = this.convertScaledBigIntToFloat(body.radius);
            if (body.c) newBody.c = body.c;
            newBody.seed = body.seed;
            newBody.bodyIndex = body.bodyIndex;
            // newBody.faceIndex = body.faceIndex
            bodies.push(newBody);
        }
        return bodies;
    },
    convertFloatToScaledBigInt (value) {
        // changed from Math.floor to Math.round, TODO: look here in case there's rounding error
        return BigInt(Math.round(value * parseInt(this.scalingFactor)));
    // let maybeNegative = BigInt(Math.floor(value * parseInt(scalingFactor))) % p
    // while (maybeNegative < 0n) {
    //   maybeNegative += p
    // }
    // return maybeNegative
    },
    convertScaledBigIntToFloat (value) {
        return parseFloat(value) / parseFloat(this.scalingFactor);
    },
    convertBodiesToBigInts (bodies) {
        const bigBodies = [];
        const skipCopying = [
            "px",
            "py",
            "vx",
            "vy"
        ];
        for(let i = 0; i < bodies.length; i++){
            const body = bodies[i];
            const newBody = {
                position: {},
                velocity: {}
            };
            newBody.position.x = body.px || this.convertFloatToScaledBigInt(body.position.x);
            newBody.position.y = body.py || this.convertFloatToScaledBigInt(body.position.y);
            newBody.velocity.x = body.vx || this.convertFloatToScaledBigInt(body.velocity.x);
            newBody.velocity.y = body.vy || this.convertFloatToScaledBigInt(body.velocity.y);
            newBody.radius = this.convertFloatToScaledBigInt(body.radius);
            // copy over any other properties on body
            for(const key in body){
                if (typeof newBody[key] !== "undefined" || skipCopying.includes(key)) continue;
                const value = body[key];
                newBody[key] = value;
            }
            bigBodies.push(newBody);
        }
        return bigBodies;
    },
    detectCollision (bodies = this.bodies, missiles = this.missiles) {
        let bigBodies = this.convertBodiesToBigInts(bodies);
        const bigMissiles = this.convertBodiesToBigInts(missiles);
        const { bodies: newBigBodies, missiles: newBigMissiles } = this.detectCollisionBigInt(bigBodies, bigMissiles);
        bodies = this.convertBigIntsToBodies(newBigBodies);
        missiles = this.convertBigIntsToBodies(newBigMissiles);
        // console.dir(
        //   { bodies_out: bodies, missile_out: missiles[0] },
        //   { depth: null }
        // )
        return {
            bodies: bodies,
            missiles: missiles
        };
    },
    detectCollisionBigInt (bodies, missiles) {
        if (missiles.length == 0) return {
            bodies: bodies,
            missiles: missiles
        };
        const missile = missiles[0];
        // console.dir({ missile_in: missile }, { depth: null })
        missile.position.x += missile.velocity.x;
        missile.position.y += missile.velocity.y;
        if (missile.position.x > BigInt(this.windowWidth) * this.scalingFactor || missile.position.y < 0n) missile.radius = 0n;
        for(let j = 0; j < bodies.length; j++){
            const body = bodies[j];
            const distance = $2e7936229def99fa$export$33eb29c3f3d542b8(missile.position.x, missile.position.y, body.position.x, body.position.y);
            // console.log({
            //   p_x: body.position.x,
            //   p_y: body.position.y,
            //   m_x: missile.position.x,
            //   m_y: missile.position.y
            // })
            // console.log({ distance })
            // NOTE: this is to match the circuit. If the missile is gone, set minDist to 0
            // Need to make sure comparison of distance is < and not <= for this to work
            // because they may by chance be at the exact same coordinates and should still
            // not trigger an _explosion since the missile is already gone.
            const minDist = missile.radius == 0n ? 0n : body.radius * 2n;
            // console.log({ minDist })
            if (distance < minDist) {
                missile.radius = 0n;
                const x = this.convertScaledBigIntToFloat(body.position.x);
                const y = this.convertScaledBigIntToFloat(body.position.y);
                this.explosions.push(...this.convertBigIntsToBodies([
                    JSON.parse(JSON.stringify(body))
                ]));
                this.sound?.playExplosion(x, y);
                bodies[j].radius = 0n;
            }
            missiles[0] = missile;
        }
        return {
            bodies: bodies,
            missiles: missiles
        };
    }
};
// ------
/// functional utils
// ------
function $2e7936229def99fa$export$a8f58c7a5ea1bb66(v) {
    const prime = 21888242871839275222246405745257275088548364400416034343698204186575808495617n;
    let vmp = v % prime;
    while(vmp < 0n)vmp += prime;
    return vmp;
}
function $2e7936229def99fa$export$33eb29c3f3d542b8(x1, y1, x2, y2) {
    const absX = x1 > x2 ? x1 - x2 : x2 - x1;
    const absY = y1 > y2 ? y1 - y2 : y2 - y1;
    const dxs = absX * absX;
    const dys = absY * absY;
    const distanceSquared = dxs + dys;
    const distance = $2e7936229def99fa$export$8fa9c237d5a45d55(distanceSquared);
    return distance;
}
function $2e7936229def99fa$export$8fa9c237d5a45d55(n) {
    if (n == 0n) return 0n;
    var lo = 0n;
    var hi = n >> 1n;
    var mid, midSquared;
    while(lo <= hi){
        mid = lo + hi >> 1n // multiplication by multiplicative inverse is not what we want so we use >>
        ;
        // TODO: Make more accurate by checking if lo + hi is odd or even before bit shifting
        midSquared = mid * mid;
        if (midSquared == n) return mid // Exact square root found
        ;
        else if (midSquared < n) lo = mid + 1n // Adjust lower bound
        ;
        else hi = mid - 1n // Adjust upper bound
        ;
    }
    // If we reach here, no exact square root was found.
    // return the closest approximation
    // console.log(`final approx`, { lo, mid, hi })
    return mid;
}
function $2e7936229def99fa$export$c869c44f9b0ac403(dividend, divisor) {
    if (dividend == 0n) return 0n;
    // Create internal signals for our binary search
    var lo, hi, mid, testProduct;
    // Initialize our search space
    lo = 0n;
    hi = dividend // Assuming worst case where divisor = 1
    ;
    while(lo < hi){
        // 32 iterations for 32-bit numbers as an example
        mid = hi + lo + 1n >> 1n;
        testProduct = mid * divisor;
        // Adjust our bounds based on the test product
        if (testProduct > dividend) hi = mid - 1n;
        else lo = mid;
    }
    // console.log({ lo, mid, hi })
    // Output the lo as our approximated quotient after iterations
    // quotient <== lo;
    return lo;
}
function $2e7936229def99fa$export$b97f7eb3b20729e2(constraints, steps = 1) {
    const totalSteps = steps * 1000000 / constraints;
    const fps = 25;
    const sec = totalSteps / fps;
    return Math.round(sec * 100) / 100;
}
function $2e7936229def99fa$export$237b26cd1c2a885e(x, y, radius) {
    let bombs = [];
    for(let i = 0; i < 100; i++)bombs.push({
        x: x,
        y: y,
        i: i,
        radius: radius
    });
    return bombs;
}
function $2e7936229def99fa$export$240a15193e06bf11(v1, v2) {
    return [
        v1[0] + v2[0],
        v1[1] + v2[1]
    ];
}
function $2e7936229def99fa$export$f3e1b21b4093c118(seed) {
    const error = "Seed must be a 32-byte value";
    // ensure that the seed is a 32-byte value
    if (typeof seed === "string") {
        if (seed.length !== 66) throw new Error(error + " (1)");
        // confirm that all characters are hex characters
        if (seed.substring(2, 66).match(/[^0-9A-Fa-f]/)) throw new Error(error + " (2)");
        if (seed.substring(0, 2) !== "0x") throw new Error(error + " (3)");
        seed = BigInt(seed);
    }
    if (typeof seed === "bigint") {
        if (seed < 0n) throw new Error(error + " (4)");
        if (seed > 0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffn) // if (seed > 115792089237316195423570985008687907853269984665640564039457584007913129639935n) {
        throw new Error(error + " (5)");
    } else throw new Error(error + " (6)");
}







const $20e10bf2352e139a$export$665d5a662b7213f3 = {
    drawButton ({ text: text, x: x, y: y, textSize: textSize = 48, height: height, width: width, onClick: onClick, fg: fg = "black", bg: bg = "white", stroke: stroke, fgHover: fgHover = "rgba(160, 67, 232, 0.25)", p: p = this.p, disabled: disabled = false, key: key = `${text}-${x}-${y}-${height}-${width}` }) {
        // register the button if it's not registered
        let button = this.buttons[key];
        if (!button) {
            this.buttons[key] = {
                x: x,
                y: y,
                height: height,
                width: width,
                onClick: onClick.bind(this)
            };
            button = this.buttons[key];
        }
        button.visible = true;
        button.disabled = disabled;
        const justEntered = button.lastVisibleFrame !== this.p5Frames - 1;
        if (justEntered) button.visibleForFrames = 0;
        button.visibleForFrames++;
        button.lastVisibleFrame = this.p5Frames;
        const entranceTime = 0.4 // seconds
        ;
        // animate in button when it is visible
        const scale = Math.min(1, button.visibleForFrames / (entranceTime * this.P5_FPS));
        const isAnimating = scale < 1;
        const scaledWidth = width * scale;
        const scaledHeight = height * scale;
        p.push();
        p.noStroke();
        p.strokeWeight(button.active ? 1 : 3);
        p.textSize(textSize * scale);
        p.fill(button.disabled ? (0, $d60e3aa22c788113$export$c08c384652f6dae3)(bg, 0.4) : bg);
        if (stroke) p.stroke(stroke);
        p.rect(x + width / 2 - scaledWidth / 2, y + height / 2 - scaledHeight / 2, scaledWidth, scaledHeight, height / 2);
        p.noStroke();
        if (scale >= 0.3 && (0, $7bebc3cf49080e6e$export$f45fbea8fe20ca8a).dot) {
            p.textFont((0, $7bebc3cf49080e6e$export$f45fbea8fe20ca8a).dot);
            p.fill(button.disabled ? (0, $d60e3aa22c788113$export$c08c384652f6dae3)(fg, 0.4) : fg);
            p.textAlign(p.CENTER, p.CENTER);
            p.text(text, // tweak to center, somethign about the font
            x + width / 2 + textSize * 0.13, y + height / 2 + textSize * 0.05);
        }
        if (!isAnimating && !button.disabled && button.hover) {
            p.fill(fgHover);
            p.rect(x, y, width, height, height / 2);
        }
        if (!isAnimating && !button.disabled && button.active) {
            p.fill((0, $d60e3aa22c788113$export$c08c384652f6dae3)(bg, 0.3));
            p.rect(x, y, width, height, height / 2);
        }
        p.pop();
    },
    // single button with a fat appearance (retry, start)
    drawFatButton (buttonOptions) {
        const { bottom: bottom } = buttonOptions;
        const bottomPadding = bottom || 80;
        this.drawButton({
            height: 96,
            textSize: 48,
            width: 275,
            y: this.windowHeight - 96 - bottomPadding,
            x: this.windowWidth / 2 - 137.5,
            ...buttonOptions
        });
    },
    // buttons that are drawn at the bottom of the screen (win screen)
    drawBottomButton (buttonOptions) {
        const { columns: columns, column: column } = buttonOptions;
        const gutter = 24;
        const interButtonGutter = 6;
        const frameWidth = this.windowWidth - 2 * gutter;
        const width = (frameWidth - (columns - 1) * interButtonGutter) / columns;
        this.drawButton({
            height: 84,
            textSize: 44,
            width: width,
            y: this.windowHeight - gutter - 84,
            x: gutter + column * (width + interButtonGutter),
            ...buttonOptions
        });
    }
};


// import wc from './witness_calculator.js'
const $ac5f4ce0676496f6$var$GAME_LENGTH_BY_LEVEL_INDEX = [
    30,
    10,
    20,
    30,
    40,
    50
];
const $ac5f4ce0676496f6$var$NORMAL_GRAVITY = 100;
const $ac5f4ce0676496f6$var$proverTickIndex = {
    2: 250,
    3: 250,
    4: 250,
    5: 125,
    6: 125
};
function $ac5f4ce0676496f6$var$intersectsButton(button, x, y) {
    return x > button.x && x < button.x + button.width && y > button.y && y < button.y + button.height;
}
const $ac5f4ce0676496f6$var$PAUSE_BODY_DATA = [
    {
        bodyIndex: 0,
        radius: 36000,
        px: 149311,
        py: 901865,
        vx: 0,
        vy: 0
    },
    {
        bodyIndex: 1,
        radius: 32000,
        px: 309311,
        py: 121865,
        vx: 0,
        vy: 0
    },
    {
        bodyIndex: 2,
        radius: 30000,
        px: 850311,
        py: 811865,
        vx: 0,
        vy: 0
    },
    {
        bodyIndex: 3,
        radius: 7000,
        px: 833406,
        py: 103029,
        vx: 0,
        vy: 0
    },
    {
        bodyIndex: 4,
        radius: 20000,
        px: 705620,
        py: 178711,
        vx: -100000,
        vy: -1111000
    },
    {
        bodyIndex: 5,
        radius: 17000,
        px: 139878,
        py: 454946,
        vx: 0,
        vy: 0
    },
    {
        bodyIndex: 6,
        radius: 9000,
        px: 289878,
        py: 694946,
        vx: 0,
        vy: 0
    },
    {
        bodyIndex: 7,
        radius: 14000,
        px: 589878,
        py: 694946,
        vx: -100000,
        vy: -1111000
    }
];
class $ac5f4ce0676496f6$export$52baafc80d354d7 extends (0, $2MC12$events) {
    constructor(p, options = {}){
        super();
        Object.assign(this, (0, $123b50dec58735f8$export$1c8732ad58967379));
        Object.assign(this, (0, $2e7936229def99fa$export$1270c16ec3b4f45a));
        Object.assign(this, (0, $20e10bf2352e139a$export$665d5a662b7213f3));
        this.setOptions(options);
        // Add other constructor logic here
        this.p = p;
        !this.util && (0, $7bebc3cf49080e6e$export$90b262450ff54847)(this.p);
        // this.p.blendMode(this.p.DIFFERENCE)
        this.levelSpeeds = new Array(5);
        this.clearValues();
        !this.util && this.prepareP5();
        this.sound = new (0, $71ffd51f0c004c8c$export$2e2bcd8739ae039)(this);
        this.init();
        !this.util && this.start();
    }
    proverTickIndex(i) {
        return $ac5f4ce0676496f6$var$proverTickIndex[i];
    }
    setOptions(options = {}) {
        const defaultOptions = {
            day: 324000,
            level: 0,
            bodyData: null,
            todaysRecords: {},
            // Add default properties and their initial values here
            startingBodies: 1,
            windowWidth: 1000,
            windowHeight: 1000,
            pixelDensity: typeof window !== "undefined" ? window.devicePixelRatio < 2 ? 2 : window.devicePixelRatio : 2,
            scalingFactor: 10n ** 3n,
            minDistanceSquared: 40000,
            G: $ac5f4ce0676496f6$var$NORMAL_GRAVITY,
            mode: "game",
            admin: false,
            solved: false,
            clearBG: true,
            colorStyle: "!squiggle",
            preRun: 0,
            alreadyRun: 0,
            paintSteps: 0,
            chunk: 1,
            mute: true,
            freeze: false,
            test: false,
            util: false,
            paused: true,
            globalStyle: "default",
            aimHelper: false,
            target: "inside",
            faceRotation: "mania",
            sfx: "bubble",
            playerName: undefined,
            practiceMode: false,
            bestTimes: null,
            popup: null
        };
        // Merge the default options with the provided options
        const mergedOptions = {
            ...defaultOptions,
            ...options
        };
        // Assign the merged options to the instance properties
        Object.assign(this, mergedOptions);
    }
    setPlayer(name) {
        this.playerName = name;
    }
    removeCSS() {
        if (typeof document === "undefined") return;
        const style = document.getElementById("canvas-cursor");
        style && document.head.removeChild(style);
    }
    addCSS() {
        if (typeof document === "undefined") return;
        if (document.getElementById("canvas-cursor")) return;
        const style = document.createElement("style");
        style.id = "canvas-cursor" // Add an id to the style element
        ;
        style.innerHTML = `
      #canvas, canvas {
        cursor: none;
      }
    `;
        document.head.appendChild(style);
    }
    // run whenever the class should be reset
    clearValues() {
        if (this.level <= 1) this.levelSpeeds = new Array(5);
        this.lastMissileCantBeUndone = false;
        this.speedFactor = 2;
        this.speedLimit = 10;
        this.missileSpeed = 15;
        this.G = $ac5f4ce0676496f6$var$NORMAL_GRAVITY;
        this.vectorLimit = this.speedLimit * this.speedFactor;
        this.missileVectorLimit = this.missileSpeed * this.speedFactor;
        this.FPS = 25;
        this.P5_FPS_MULTIPLIER = 3;
        this.P5_FPS = this.FPS * this.P5_FPS_MULTIPLIER;
        this.p?.frameRate(this.P5_FPS);
        this.timer = (this.level > 5 ? 60 : $ac5f4ce0676496f6$var$GAME_LENGTH_BY_LEVEL_INDEX[this.level]) * this.FPS;
        this.deadOpacity = "0.9";
        this.initialScoreSize = 120;
        this.scoreSize = this.initialScoreSize;
        this.opac = this.globalStyle == "psycho" ? 1 : 1;
        this.tailLength = 1;
        this.tailMod = this.globalStyle == "psycho" ? 2 : 1;
        this.explosions = [];
        this.missiles = [];
        this.stillVisibleMissiles = [];
        this.missileInits = [];
        this.bodies = [];
        this.witheringBodies = [];
        this.bodyInits = [];
        this.bodyFinal = [];
        this.missileCount = 0;
        this.frames = 0;
        this.p5Frames = 0;
        this.showIt = true;
        this.justStopped = false;
        this.gameOver = false;
        this.firstFrame = true;
        this.loaded = false;
        this.showPlayAgain = false;
        this.handledGameOver = false;
        this.statsText = "";
        this.hasStarted = false;
        this.buttons = {};
        this.won = false;
        this.finalBatchSent = false;
        this.solved = false;
        this.date = new Date(this.day * 1000).toISOString().split("T")[0].replace(/-/g, ".");
        this.framesTook = false;
        this.showProblemRankingsScreenAt = -1;
        this.saveStatus = "unsaved" // 'unsaved' -> 'validating' -> 'validated' -> 'saving' -> 'saved' | 'error'
        ;
        delete this.validatedAt;
        delete this.validatingAt;
        delete this.savingAt;
        delete this.savedAt;
    // uncomment to work on the game over screen
    // setTimeout(() => {
    //   this.handleGameOver({ won: true })
    // }, 500)
    // uncomment to work on the problem-ranking screen
    // setTimeout(() => {
    //   this.showProblemRankingsScreenAt = this.p5Frames
    // }, 500)
    }
    // run once at initilization
    init() {
        this.skipAhead = false;
        this.winScreenBaddies = undefined;
        this.seed = (0, $2MC12$utils).solidityKeccak256([
            "uint256"
        ], [
            this.day
        ]);
        this.generateBodies();
        this.frames = this.alreadyRun;
        this.startingFrame = this.alreadyRun;
        this.stopEvery = this.test ? 20 : this.proverTickIndex(this.level + 1);
        // const vectorLimitScaled = this.convertFloatToScaledBigInt(this.vectorLimit)
        this.setPause(this.paused, true);
        this.storeInits();
    // this.prepareWitness()
    }
    async start() {
        this.addCSS();
        this.addListeners();
        this.runSteps(this.preRun);
        // this.paintAtOnce(this.paintSteps)
        if (this.freeze) this.setPause(true, true);
    }
    destroy() {
        this.setPause(true);
        this.p.noLoop();
        this.removeListener();
        this.sound.stop();
        this.sound = null;
        this.p.remove();
    }
    storeInits() {
        this.bodyCopies = JSON.parse(JSON.stringify(this.bodies));
        this.bodyInits = this.processInits(this.bodies);
    }
    processInits(bodies) {
        return this.convertBodiesToBigInts(bodies).map((b)=>{
            b = this.convertScaledBigIntBodyToArray(b);
            b[2] = BigInt(b[2]).toString();
            b[3] = BigInt(b[3]).toString();
            return b;
        });
    }
    runSteps(n = this.preRun) {
        let runIndex = 0;
        let keepSimulating = true;
        this.showIt = false;
        while(keepSimulating){
            runIndex++;
            if (runIndex > n) {
                keepSimulating = false;
                this.showIt = true;
            // n > 0 && console.log(`${n.toLocaleString()} runs`)
            } else {
                const results = this.step(this.bodies, this.missiles);
                this.frames++;
                this.bodies = results.bodies;
                this.missiles = results.missiles || [];
            }
        }
    }
    addListeners() {
        const { canvas: canvas } = this.p;
        // binding dummy handlers is necessary for p5 to listen to touchmove
        // and track mouseX and mouseY
        this.p.touchStarted = ()=>{};
        this.p.mouseMoved = this.handleMouseMove;
        this.p.touchMoved = this.handleMouseMove;
        this.p.mousePressed = this.handleMousePressed;
        this.p.mouseReleased = this.handleMouseReleased;
        this.p.touchEnded = ()=>{};
        if (typeof window !== "undefined" && this.mode == "game") {
            canvas.removeEventListener("click", this.handleNFTClick);
            canvas.addEventListener("click", this.handleGameClick);
            canvas.addEventListener("touchend", this.handleGameClick);
            window.addEventListener("keydown", this.handleGameKeyDown);
        } else {
            canvas.removeEventListener("click", this.handleGameClick);
            window?.removeEventListener("keydown", this.handleGameKeyDown);
            canvas.addEventListener("click", this.handleGameClick);
        }
    }
    removeListener() {
        const { canvas: canvas } = this.p;
        canvas?.removeEventListener("click", this.handleNFTClick);
        canvas?.removeEventListener("click", this.handleGameClick);
        canvas?.removeEventListener("touchend", this.handleGameClick);
        window?.removeEventListener("keydown", this.handleGameKeyDown);
        window?.removeEventListener("keydown", this.sound.handleKeyDown);
    }
    getXY(e) {
        // e may be a touch event or a click event
        if (e.touches) e = e.touches[0] || e.changedTouches[0];
        let x = e.offsetX || e.pageX;
        let y = e.offsetY || e.pageY;
        const rect = e.target.getBoundingClientRect();
        const actualWidth = rect.width;
        x = x * this.windowWidth / actualWidth;
        y = y * this.windowWidth / actualWidth;
        return {
            x: x,
            y: y
        };
    }
    handleMouseMove = (e)=>{
        const { x: x, y: y } = this.getXY(e);
        this.mouseX = x;
        this.mouseY = y;
        // check if mouse is inside any of the buttons
        for(const key in this.buttons){
            const button = this.buttons[key];
            button.hover = $ac5f4ce0676496f6$var$intersectsButton(button, x, y);
        }
    };
    handleMousePressed = (e)=>{
        const { x: x, y: y } = this.getXY(e);
        for(const key in this.buttons){
            const button = this.buttons[key];
            button.active = $ac5f4ce0676496f6$var$intersectsButton(button, x, y);
        }
    };
    handleMouseReleased = ()=>{
        for(const key in this.buttons){
            const button = this.buttons[key];
            if (button.active) button.active = false;
        }
    };
    handleGameClick = (e)=>{
        if (this.gameOver && this.won) this.skipAhead = true;
        const { x: x, y: y } = this.getXY(e);
        // if mouse is inside of a button, call the button's handler
        for(const key in this.buttons){
            const button = this.buttons[key];
            if (button.visible && $ac5f4ce0676496f6$var$intersectsButton(button, x, y) && !button.disabled) {
                button.onClick();
                return;
            }
        }
        if (this.paused || this.gameOver) return;
        this.missileClick(x, y);
    };
    handleNFTClick = ()=>{
        this.setPause();
    };
    handleGameKeyDown = (e)=>{
        if (this.gameOver && this.won) this.skipAhead = true;
        const modifierKeyActive = e.shiftKey && e.altKey && e.ctrlKey && e.metaKey;
        if (modifierKeyActive) return;
        switch(e.code){
            case "Space":
                if (this.mouseX || this.mouseY) {
                    e.preventDefault();
                    this.missileClick(this.mouseX, this.mouseY);
                }
                break;
            case "KeyR":
                if (!this.gameOver || !this.won) this.restart(null, false);
                break;
            case "KeyP":
                if (!this.gameOver) this.setPause();
                break;
        }
    };
    handleGameOver = ({ won: won })=>{
        if (this.handledGameOver) return;
        this.handledGameOver = true;
        this.gameoverTickerX = 0;
        this.sound?.playGameOver({
            won: won
        });
        this.gameOver = true;
        this.won = won;
        if (this.level !== 0 && !this.won) {
            const gravityIndex = this.bodies.slice(1).filter((b)=>b.radius !== 0n).length;
            const newBodies = this.generateLevelData(this.day, 6 - gravityIndex).slice(1);
            this.bodies.push(...newBodies.map((b)=>this.bodyDataToBodies.call(this, b)).map((b)=>{
                b.position.x = 0;
                b.position.y = 0;
                b.py = 0n;
                b.px = 0n;
                return b;
            }));
        }
        this.P5_FPS *= 2;
        this.p.frameRate(this.P5_FPS);
        var dust = 0;
        var timeTook = 0;
        const stats = this.calculateStats();
        dust = stats.dust;
        timeTook = stats.timeTook;
        this.framesTook = stats.framesTook;
        this.emit("done", {
            level: this.level,
            won: won,
            ticks: this.frames - this.startingFrame,
            dust: dust,
            timeTook: timeTook,
            framesTook: this.framesTook
        });
        if (won) {
            this.bodyData = null;
            this.finish();
        }
    };
    restart = (options, beginPaused = true)=>{
        if (options) this.setOptions(options);
        this.clearValues();
        this.sound?.stop();
        this.sound?.playStart();
        this.sound?.setSong();
        this.init();
        this.draw();
        if (!beginPaused) this.setPause(false);
        this.addCSS();
    };
    doubleTextInverted(text) {
        return text.slice(0, -1) + text.split("").reverse().join("");
    }
    setPause(newPauseState = !this.paused, mute = false) {
        if (typeof newPauseState !== "boolean") newPauseState = !this.paused;
        if (newPauseState) {
            this.pauseBodies = $ac5f4ce0676496f6$var$PAUSE_BODY_DATA.map((b)=>this.bodyDataToBodies.call(this, b));
            this.pauseBodies[1].c = this.getBodyColor(this.day + 1, 0);
            this.pauseBodies[2].c = this.getBodyColor(this.day + 2, 0);
            this.paused = newPauseState;
            this.willUnpause = false;
            delete this.beganUnpauseAt;
        } else {
            this.justPaused = true;
            this.willUnpause = true;
        }
        this.emit("paused", newPauseState);
        if (newPauseState) {
            if (!mute) this.sound?.pause();
        } else if (!mute) this.sound?.resume();
    }
    step() {
        // this.steps ||= 0
        // console.log({ steps: this.steps })
        // this.steps++
        // console.dir(
        //   { bodies: this.bodies, missiles: this.missiles[0] },
        //   { depth: null }
        // )
        if (this.missiles.length == 0 && this.lastMissileCantBeUndone) {
            console.log("LASTMISSILECANTBEUNDONE = FALSE");
            this.lastMissileCantBeUndone = false;
        }
        this.bodies = this.forceAccumulator(this.bodies);
        var results = this.detectCollision(this.bodies, this.missiles);
        this.bodies = results.bodies;
        this.missiles = results.missiles || [];
        if (this.missiles.length > 0) {
            const missileCopy = JSON.parse(JSON.stringify(this.missiles[0]));
            this.stillVisibleMissiles.push(missileCopy);
        }
        if (this.missiles.length > 0 && this.missiles[0].radius == 0) this.missiles.splice(0, 1);
        else if (this.missiles.length > 1 && this.missiles[0].radius !== 0) {
            // NOTE: follows logic of circuit
            const newMissile = this.missiles.splice(0, 1);
            this.missiles.splice(0, 1, newMissile[0]);
        }
        return {
            bodies: this.bodies,
            missiles: this.missiles
        };
    }
    started() {
        this.emit("started", {
            day: this.day,
            level: this.level,
            bodyInits: JSON.parse(JSON.stringify(this.bodyInits))
        });
    }
    processMissileInits(missiles) {
        const radius = 10;
        return missiles.map((b)=>{
            const maxMissileVectorScaled = this.convertFloatToScaledBigInt(this.missileVectorLimit);
            return {
                step: b.step,
                x: this.convertFloatToScaledBigInt(b.position.x).toString(),
                y: this.convertFloatToScaledBigInt(b.position.y).toString(),
                vx: (this.convertFloatToScaledBigInt(b.velocity.x) + maxMissileVectorScaled).toString(),
                vy: (this.convertFloatToScaledBigInt(b.velocity.y) + maxMissileVectorScaled).toString(),
                radius: radius.toString()
            };
        });
    }
    finish() {
        if (this.finalBatchSent) return;
        // this.finished = true
        // this.setPause(true)
        const maxMissileVectorScaled = parseInt(this.convertFloatToScaledBigInt(this.missileVectorLimit)).toString();
        this.calculateBodyFinal();
        const missileInputs = [];
        if (this.mode == "game") {
            let missileIndex = 0;
            // loop through all the steps that were just played since the last chunk
            for(let i = this.alreadyRun; i < this.alreadyRun + this.stopEvery; i++)// if the step index matches the step where a missile was shot, add the missile to the missileInputs
            // otherwise fill the missileInit array with an empty missile
            if (this.missileInits[missileIndex]?.step == i) {
                const missile = this.missileInits[missileIndex];
                missileInputs.push([
                    missile.vx,
                    missile.vy,
                    missile.radius
                ]);
                missileIndex++;
            } else missileInputs.push([
                maxMissileVectorScaled,
                maxMissileVectorScaled,
                "0"
            ]);
            // add one more because missileInits contains one extra for circuit
            missileInputs.push([
                maxMissileVectorScaled,
                maxMissileVectorScaled,
                "0"
            ]);
        }
        // define the inflightMissile for the proof from the first missile shot during this chunk
        // if the first missile shot was shot at step == alreadyRun (start of this chunk)
        // add it as an inflightMissile otherwise add a dummy missile
        let inflightMissile = this.missileInits[0]?.step == this.alreadyRun ? this.missileInits[0] : {
            x: "0",
            y: (this.windowWidth * parseInt(this.scalingFactor)).toString(),
            vx: maxMissileVectorScaled,
            vy: maxMissileVectorScaled,
            radius: "0"
        };
        inflightMissile = [
            inflightMissile.x,
            inflightMissile.y,
            inflightMissile.vx,
            inflightMissile.vy,
            inflightMissile.radius
        ];
        // defind outflightMissile for the proof from the currently flying missiles
        // if there is no missile flying, add a dummy missile
        const outflightMissileTmp = this.missiles[0] || {
            px: "0",
            py: (this.windowWidth * parseInt(this.scalingFactor)).toString(),
            vx: maxMissileVectorScaled,
            vy: maxMissileVectorScaled,
            radius: "0"
        };
        const outflightMissile = [
            outflightMissileTmp.px,
            outflightMissileTmp.py,
            outflightMissileTmp.vx,
            outflightMissileTmp.vy,
            outflightMissileTmp.radius
        ];
        const { day: day, level: level, bodyInits: bodyInits, bodyFinal: bodyFinal, framesTook: framesTook } = this;
        const results = JSON.parse(JSON.stringify({
            day: day,
            level: level,
            inflightMissile: inflightMissile,
            missiles: missileInputs,
            bodyInits: bodyInits,
            bodyFinal: bodyFinal,
            framesTook: framesTook,
            outflightMissile: outflightMissile
        }));
        this.bodyInits = JSON.parse(JSON.stringify(this.bodyFinal));
        this.alreadyRun = this.frames;
        // this.missileInits is initialized with the currently in flight missiles
        this.missileInits = this.processMissileInits(this.missiles).map((m)=>{
            m.step = this.frames;
            return m;
        });
        this.emit("chunk", results);
        this.bodyFinal = [];
        // this.setPause(false)
        if (this.mode == "game" && this.bodies.slice(this.level == 0 ? 0 : 1).reduce((a, c)=>a + c.radius, 0) == 0) this.finalBatchSent = true;
        // if missiles.length > 0 that means that there is currently a missile in flight
        // and so you can't add a new missile until the current missile has been finished.
        // it is finished when this.missiles.length == 0, as checked in step() and missileClick()
        // If a missile is shot while lastMissileCantBeUndone is true, then an event is emittied
        // to notify the proving system to remove the last shot from the last chunk and the missile
        // is removed from the missileInits array to prevent it from being used as incoming missile
        // during the next chunk.
        if (this.missiles.length > 0) {
            console.log("LASTMISSILECANTBEUNDONE = TRUE");
            this.lastMissileCantBeUndone = true;
        }
        if (level !== 0) this.levelSpeeds[level - 1] = results;
        return results;
    }
    generateLevelData(day, level) {
        const bodyData = [];
        for(let i = 0; i <= level; i++){
            const dayLevelIndexSeed = (0, $2MC12$utils).solidityKeccak256([
                "uint256",
                "uint256",
                "uint256"
            ], [
                day,
                level,
                i
            ]);
            bodyData.push(this.getRandomValues(dayLevelIndexSeed, i, level));
        }
        return bodyData;
    }
    getRandomValues(dayLevelIndexSeed, index, level = this.level) {
        const maxVectorScaled = this.convertFloatToScaledBigInt(this.vectorLimit);
        const body = {};
        body.bodyIndex = index;
        body.seed = dayLevelIndexSeed;
        body.radius = this.genRadius(index, level);
        if (level == 0) {
            body.px = parseInt(BigInt(this.windowWidth) * this.scalingFactor / 2n);
            body.py = parseInt(BigInt(this.windowWidth) * this.scalingFactor / 2n);
            body.vx = parseInt(maxVectorScaled) - 5000;
            body.vy = parseInt(maxVectorScaled);
            return body;
        }
        let rand = (0, $2MC12$utils).solidityKeccak256([
            "bytes32"
        ], [
            dayLevelIndexSeed
        ]);
        body.px = this.randomRange(0, BigInt(this.windowWidth) * this.scalingFactor, rand);
        rand = (0, $2MC12$utils).solidityKeccak256([
            "bytes32"
        ], [
            rand
        ]);
        body.py = this.randomRange(0, BigInt(this.windowWidth) * this.scalingFactor, rand);
        rand = (0, $2MC12$utils).solidityKeccak256([
            "bytes32"
        ], [
            rand
        ]);
        body.vx = this.randomRange(maxVectorScaled / 2n, maxVectorScaled * 3n / 2n, rand);
        rand = (0, $2MC12$utils).solidityKeccak256([
            "bytes32"
        ], [
            rand
        ]);
        body.vy = this.randomRange(maxVectorScaled / 2n, maxVectorScaled * 3n / 2n, rand);
        return body;
    }
    genRadius(index, level = this.level) {
        const radii = [
            36n,
            27n,
            22n,
            17n,
            12n,
            7n
        ] // n * 5 + 2
        ;
        let size = level == 0 ? 27n : radii[index % radii.length];
        return parseInt(size * BigInt(this.scalingFactor));
    }
    randomRange(minBigInt, maxBigInt, seed) {
        if (minBigInt == maxBigInt) return minBigInt;
        minBigInt = typeof minBigInt === "bigint" ? minBigInt : BigInt(minBigInt);
        maxBigInt = typeof maxBigInt === "bigint" ? maxBigInt : BigInt(maxBigInt);
        seed = typeof seed === "bigint" ? seed : BigInt(seed);
        return parseInt(seed % (maxBigInt - minBigInt) + minBigInt);
    }
    generateBodies() {
        this.bodyData = this.bodyData || this.generateLevelData(this.day, this.level);
        this.bodies = this.bodyData.map((b)=>this.bodyDataToBodies.call(this, b));
        this.startingBodies = this.bodies.length;
    }
    bodyDataToBodies(b, day = this.day) {
        const bodyIndex = b.bodyIndex;
        const px = b.px / parseInt(this.scalingFactor);
        const py = b.py / parseInt(this.scalingFactor);
        const vx = (b.vx - this.vectorLimit * parseInt(this.scalingFactor)) / parseInt(this.scalingFactor);
        const vy = (b.vy - this.vectorLimit * parseInt(this.scalingFactor)) / parseInt(this.scalingFactor);
        const radius = b.radius / parseInt(this.scalingFactor);
        // const faceIndex = this.getFaceIdx(b.seed)
        return {
            seed: b.seed,
            // faceIndex,
            bodyIndex: bodyIndex,
            position: this.createVector(px, py),
            velocity: this.createVector(vx, vy),
            radius: radius,
            c: this.getBodyColor(day, bodyIndex)
        };
    }
    getBodyColor(day, bodyIndex = 0) {
        let baddieSeed = (0, $2MC12$utils).solidityKeccak256([
            "uint256",
            "uint256"
        ], [
            day,
            bodyIndex
        ]);
        const baddieHue = this.randomRange(0, 359, baddieSeed);
        baddieSeed = (0, $2MC12$utils).solidityKeccak256([
            "bytes32"
        ], [
            baddieSeed
        ]);
        const baddieSaturation = this.randomRange(90, 100, baddieSeed);
        baddieSeed = (0, $2MC12$utils).solidityKeccak256([
            "bytes32"
        ], [
            baddieSeed
        ]);
        const baddieLightness = this.randomRange(55, 60, baddieSeed);
        // hero body info
        const themes = Object.keys((0, $d60e3aa22c788113$export$5ff5d5398b3247da));
        const numberOfThemes = themes.length;
        let rand = (0, $2MC12$utils).solidityKeccak256([
            "uint256"
        ], [
            day
        ]);
        const faceOptions = 14;
        const bgOptions = 10;
        const fgOptions = 10;
        const coreOptions = 1;
        const fIndex = this.randomRange(0, faceOptions - 1, rand);
        rand = (0, $2MC12$utils).solidityKeccak256([
            "bytes32"
        ], [
            rand
        ]);
        const bgIndex = this.randomRange(0, bgOptions - 1, rand);
        rand = (0, $2MC12$utils).solidityKeccak256([
            "bytes32"
        ], [
            rand
        ]);
        const fgIndex = this.randomRange(0, fgOptions - 1, rand);
        rand = (0, $2MC12$utils).solidityKeccak256([
            "bytes32"
        ], [
            rand
        ]);
        const coreIndex = this.randomRange(0, coreOptions - 1, rand);
        const dailyThemeIndex = this.randomRange(0, numberOfThemes - 1, rand);
        const themeName = themes[dailyThemeIndex];
        const theme = (0, $d60e3aa22c788113$export$5ff5d5398b3247da)[themeName];
        rand = (0, $2MC12$utils).solidityKeccak256([
            "bytes32"
        ], [
            rand
        ]);
        const bgHue = this.randomRange(0, 359, rand);
        rand = (0, $2MC12$utils).solidityKeccak256([
            "bytes32"
        ], [
            rand
        ]);
        const bgSaturationRange = theme.bg[1].split("-");
        const bgSaturation = this.randomRange(bgSaturationRange[0], bgSaturationRange[1], rand);
        rand = (0, $2MC12$utils).solidityKeccak256([
            "bytes32"
        ], [
            rand
        ]);
        const bgLightnessRange = theme.bg[2].split("-");
        const bgLightness = this.randomRange(bgLightnessRange[0], bgLightnessRange[1], rand);
        rand = (0, $2MC12$utils).solidityKeccak256([
            "bytes32"
        ], [
            rand
        ]);
        const coreHue = this.randomRange(0, 359, rand);
        rand = (0, $2MC12$utils).solidityKeccak256([
            "bytes32"
        ], [
            rand
        ]);
        const coreSaturationRange = theme.cr[1].split("-");
        const coreSaturation = this.randomRange(coreSaturationRange[0], coreSaturationRange[1], rand);
        rand = (0, $2MC12$utils).solidityKeccak256([
            "bytes32"
        ], [
            rand
        ]);
        const coreLightnessRange = theme.cr[2].split("-");
        const coreLightness = this.randomRange(coreLightnessRange[0], coreLightnessRange[1], rand);
        rand = (0, $2MC12$utils).solidityKeccak256([
            "bytes32"
        ], [
            rand
        ]);
        const fgHue = this.randomRange(0, 359, rand);
        rand = (0, $2MC12$utils).solidityKeccak256([
            "bytes32"
        ], [
            rand
        ]);
        const fgSaturationRange = theme.fg[1].split("-");
        const fgSaturation = this.randomRange(fgSaturationRange[0], fgSaturationRange[1], rand);
        rand = (0, $2MC12$utils).solidityKeccak256([
            "bytes32"
        ], [
            rand
        ]);
        const fgLightnessRange = theme.fg[2].split("-");
        const fgLightness = this.randomRange(fgLightnessRange[0], fgLightnessRange[1], rand);
        const info = {
            fIndex: fIndex,
            bgIndex: bgIndex,
            fgIndex: fgIndex,
            coreIndex: coreIndex,
            bg: `hsl(${bgHue},${bgSaturation}%,${bgLightness}%`,
            core: `hsl(${coreHue},${coreSaturation}%,${coreLightness}%`,
            fg: `hsl(${fgHue},${fgSaturation}%,${fgLightness}%`,
            baddie: [
                baddieHue,
                baddieSaturation,
                baddieLightness
            ]
        };
        return info;
    }
    prepareP5() {
        this.p.frameRate(this.P5_FPS);
        this.p.createCanvas(this.windowWidth, this.windowWidth);
        this.p.pixelDensity(this.pixelDensity);
        this.p.background("white");
    }
    missileClick(x, y) {
        if (this.gameOver) return;
        if (this.paused) {
            this.setPause(false);
            return;
        }
        if (this.bodies.reduce((a, c)=>a + c.radius, 0) == 0 || this.frames - this.startingFrame >= this.timer) return;
        // if (this.missiles.length > 0 && !this.admin) {
        //   // this is a hack to prevent multiple missiles from being fired
        //   this.missiles = []
        //   // remove latest missile from missileInits
        //   this.missileInits.pop()
        // }
        if (this.missiles.length > 0) {
            if (this.lastMissileCantBeUndone) {
                this.emit("remove-last-missile");
                this.lastMissileCantBeUndone = false;
                console.log("LASTMISSILECANTBEUNDONE = FALSE");
            }
            this.missileInits.pop();
            this.missileCount--;
        }
        this.missileCount++;
        const radius = 10;
        const b = {
            step: this.frames,
            position: this.p.createVector(0, this.windowWidth),
            velocity: this.p.createVector(x, y - this.windowWidth),
            radius: radius
        };
        // b.velocity.setMag(this.speedLimit * this.speedFactor)
        b.velocity.limit(this.missileSpeed * this.speedFactor);
        // const bodyCount = this.bodies.filter((b) => b.radius !== 0).length - 1
        // this.missiles = this.missiles.slice(0, bodyCount)
        // this.missiles = this.missiles.slice(-bodyCount)
        // NOTE: this is stupid
        this.missiles.push(b);
        this.missiles = this.missiles.slice(-1);
        this.sound?.playMissile();
        this.missileInits.push(...this.processMissileInits([
            b
        ]));
    }
    calculateStats = ()=>{
        // n.b. this needs to match the contract in check_boost.cjs
        const BODY_BOOST = [
            0,
            0,
            0,
            1,
            2,
            4,
            8,
            16,
            32,
            64,
            128 // 10th body
        ];
        const SPEED_BOOST = [
            1,
            2,
            3,
            4,
            5,
            6 // < 60s left
        ];
        const bodiesIncluded = this.bodies.length;
        const bodiesBoost = BODY_BOOST[bodiesIncluded];
        const { startingFrame: startingFrame, timer: timer, frames: frames } = this;
        const secondsLeft = (startingFrame + timer - frames) / this.FPS;
        const framesTook = frames - startingFrame - 1 // -1 because the first frame is the starting frame
        ;
        const timeTook = framesTook / this.FPS;
        const speedBoostIndex = Math.floor(secondsLeft / 10);
        const speedBoost = SPEED_BOOST[speedBoostIndex];
        let dust = /*bodiesIncluded **/ bodiesBoost * speedBoost;
        const missilesShot = this.missileInits.reduce((p, c)=>c[0] == 0 ? p : p + 1, 0);
        return {
            missilesShot: missilesShot,
            bodiesIncluded: bodiesIncluded,
            bodiesBoost: bodiesBoost,
            speedBoost: speedBoost,
            dust: dust,
            timeTook: timeTook,
            framesTook: framesTook
        };
    };
    handleSave = ()=>{
        // mock for testing visuals
        if (this.saveStatus == "unsaved") {
            this.saveStatus = "validating";
            setTimeout(()=>{
                this.saveStatus = "validated";
            }, 2000);
        } else if (this.saveStatus == "validated") {
            this.saveStatus = "saving";
            setTimeout(()=>{
                this.saveStatus = "saved";
            }, 2000);
        }
    };
}
if (typeof window !== "undefined") window.Anybody = $ac5f4ce0676496f6$export$52baafc80d354d7;
BigInt.prototype.toJSON = function() {
    return this.toString();
};


var $cc3991c226a3f988$exports = {};

$parcel$export($cc3991c226a3f988$exports, "AnybodyProblem", function () { return $cc3991c226a3f988$export$3f0c1cee0e40865b; });
$parcel$export($cc3991c226a3f988$exports, "Speedruns", function () { return $cc3991c226a3f988$export$67258bae168725a6; });
var $c4098317b891c28e$exports = {};
$c4098317b891c28e$exports = JSON.parse('{"_format":"hh-sol-artifact-1","contractName":"AnybodyProblem","sourceName":"contracts/AnybodyProblem.sol","abi":[{"inputs":[{"internalType":"address payable","name":"proceedRecipient_","type":"address"},{"internalType":"address payable","name":"speedruns_","type":"address"},{"internalType":"address","name":"externalMetadata_","type":"address"},{"internalType":"address[]","name":"verifiers_","type":"address[]"},{"internalType":"uint256[]","name":"verifiersTicks","type":"uint256[]"},{"internalType":"uint256[]","name":"verifiersBodies","type":"uint256[]"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":true,"internalType":"bool","name":"success","type":"bool"},{"indexed":false,"internalType":"bytes","name":"returnData","type":"bytes"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"EthMoved","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"runId","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"level","type":"uint256"},{"indexed":false,"internalType":"bytes32","name":"seed","type":"bytes32"},{"indexed":false,"internalType":"uint256","name":"day","type":"uint256"}],"name":"LevelCreated","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"player","type":"address"},{"indexed":true,"internalType":"uint256","name":"runId","type":"uint256"},{"indexed":true,"internalType":"uint256","name":"level","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"time","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"day","type":"uint256"}],"name":"LevelSolved","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"runId","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"day","type":"uint256"},{"indexed":false,"internalType":"bytes32","name":"seed","type":"bytes32"}],"name":"RunCreated","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"player","type":"address"},{"indexed":true,"internalType":"uint256","name":"runId","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"accumulativeTime","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"day","type":"uint256"}],"name":"RunSolved","type":"event"},{"stateMutability":"nonpayable","type":"fallback"},{"inputs":[],"name":"FIRST_SUNDAY_AT_6_PM_UTC","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"LEVELS","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"SECONDS_IN_A_DAY","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"SECONDS_IN_A_WEEK","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"runId","type":"uint256"},{"internalType":"uint256[]","name":"tickCounts","type":"uint256[]"},{"internalType":"uint256[2][]","name":"a","type":"uint256[2][]"},{"internalType":"uint256[2][2][]","name":"b","type":"uint256[2][2][]"},{"internalType":"uint256[2][]","name":"c","type":"uint256[2][]"},{"internalType":"uint256[][]","name":"input","type":"uint256[][]"}],"name":"batchSolve","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"uint256[]","name":"input","type":"uint256[]"}],"name":"convertTo102","outputs":[{"internalType":"uint256[102]","name":"","type":"uint256[102]"}],"stateMutability":"pure","type":"function"},{"inputs":[{"internalType":"uint256[]","name":"input","type":"uint256[]"}],"name":"convertTo112","outputs":[{"internalType":"uint256[112]","name":"","type":"uint256[112]"}],"stateMutability":"pure","type":"function"},{"inputs":[{"internalType":"uint256[]","name":"input","type":"uint256[]"}],"name":"convertTo22","outputs":[{"internalType":"uint256[22]","name":"","type":"uint256[22]"}],"stateMutability":"pure","type":"function"},{"inputs":[{"internalType":"uint256[]","name":"input","type":"uint256[]"}],"name":"convertTo32","outputs":[{"internalType":"uint256[32]","name":"","type":"uint256[32]"}],"stateMutability":"pure","type":"function"},{"inputs":[{"internalType":"uint256[]","name":"input","type":"uint256[]"}],"name":"convertTo42","outputs":[{"internalType":"uint256[42]","name":"","type":"uint256[42]"}],"stateMutability":"pure","type":"function"},{"inputs":[{"internalType":"uint256[]","name":"input","type":"uint256[]"}],"name":"convertTo52","outputs":[{"internalType":"uint256[52]","name":"","type":"uint256[52]"}],"stateMutability":"pure","type":"function"},{"inputs":[{"internalType":"uint256[]","name":"input","type":"uint256[]"}],"name":"convertTo62","outputs":[{"internalType":"uint256[62]","name":"","type":"uint256[62]"}],"stateMutability":"pure","type":"function"},{"inputs":[{"internalType":"uint256[]","name":"input","type":"uint256[]"}],"name":"convertTo72","outputs":[{"internalType":"uint256[72]","name":"","type":"uint256[72]"}],"stateMutability":"pure","type":"function"},{"inputs":[{"internalType":"uint256[]","name":"input","type":"uint256[]"}],"name":"convertTo82","outputs":[{"internalType":"uint256[82]","name":"","type":"uint256[82]"}],"stateMutability":"pure","type":"function"},{"inputs":[{"internalType":"uint256[]","name":"input","type":"uint256[]"}],"name":"convertTo92","outputs":[{"internalType":"uint256[92]","name":"","type":"uint256[92]"}],"stateMutability":"pure","type":"function"},{"inputs":[],"name":"currentDay","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"runId","type":"uint256"}],"name":"currentLevel","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"currentWeek","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"externalMetadata","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"components":[{"internalType":"uint256","name":"bodyIndex","type":"uint256"},{"internalType":"uint256","name":"px","type":"uint256"},{"internalType":"uint256","name":"py","type":"uint256"},{"internalType":"uint256","name":"vx","type":"uint256"},{"internalType":"uint256","name":"vy","type":"uint256"},{"internalType":"uint256","name":"radius","type":"uint256"},{"internalType":"bytes32","name":"seed","type":"bytes32"}],"internalType":"struct AnybodyProblem.Body","name":"bodyData","type":"tuple"},{"internalType":"uint256[]","name":"input","type":"uint256[]"},{"internalType":"uint256","name":"i","type":"uint256"}],"name":"extractBodyData","outputs":[{"components":[{"internalType":"uint256","name":"bodyIndex","type":"uint256"},{"internalType":"uint256","name":"px","type":"uint256"},{"internalType":"uint256","name":"py","type":"uint256"},{"internalType":"uint256","name":"vx","type":"uint256"},{"internalType":"uint256","name":"vy","type":"uint256"},{"internalType":"uint256","name":"radius","type":"uint256"},{"internalType":"bytes32","name":"seed","type":"bytes32"}],"internalType":"struct AnybodyProblem.Body","name":"","type":"tuple"}],"stateMutability":"pure","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"}],"name":"fastestByDay","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"}],"name":"fastestByWeek","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"gamesPlayed","outputs":[{"internalType":"uint256","name":"total","type":"uint256"},{"internalType":"uint256","name":"lastPlayed","type":"uint256"},{"internalType":"uint256","name":"streak","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"index","type":"uint256"}],"name":"genRadius","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"pure","type":"function"},{"inputs":[{"internalType":"uint256","name":"day","type":"uint256"},{"internalType":"uint256","name":"level","type":"uint256"}],"name":"generateLevelData","outputs":[{"components":[{"internalType":"uint256","name":"bodyIndex","type":"uint256"},{"internalType":"uint256","name":"px","type":"uint256"},{"internalType":"uint256","name":"py","type":"uint256"},{"internalType":"uint256","name":"vx","type":"uint256"},{"internalType":"uint256","name":"vy","type":"uint256"},{"internalType":"uint256","name":"radius","type":"uint256"},{"internalType":"bytes32","name":"seed","type":"bytes32"}],"internalType":"struct AnybodyProblem.Body[6]","name":"bodyData","type":"tuple[6]"},{"internalType":"uint256","name":"bodyCount","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"id","type":"uint256"},{"internalType":"uint256","name":"index","type":"uint256"}],"name":"generateSeed","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256[]","name":"input","type":"uint256[]"}],"name":"getLevelFromInputs","outputs":[{"internalType":"uint256","name":"bodyCount","type":"uint256"},{"internalType":"uint256","name":"dummyCount","type":"uint256"}],"stateMutability":"pure","type":"function"},{"inputs":[{"internalType":"uint256","name":"day","type":"uint256"},{"internalType":"uint256","name":"level","type":"uint256"},{"internalType":"uint256","name":"bodyIndex","type":"uint256"}],"name":"getLevelSeed","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"pure","type":"function"},{"inputs":[{"internalType":"uint256","name":"runId","type":"uint256"}],"name":"getLevelsData","outputs":[{"components":[{"internalType":"bool","name":"solved","type":"bool"},{"internalType":"uint256","name":"time","type":"uint256"},{"internalType":"bytes32","name":"seed","type":"bytes32"},{"internalType":"uint256[5]","name":"tmpInflightMissile","type":"uint256[5]"},{"components":[{"internalType":"uint256","name":"bodyIndex","type":"uint256"},{"internalType":"uint256","name":"px","type":"uint256"},{"internalType":"uint256","name":"py","type":"uint256"},{"internalType":"uint256","name":"vx","type":"uint256"},{"internalType":"uint256","name":"vy","type":"uint256"},{"internalType":"uint256","name":"radius","type":"uint256"},{"internalType":"bytes32","name":"seed","type":"bytes32"}],"internalType":"struct AnybodyProblem.Body[6]","name":"tmpBodyData","type":"tuple[6]"}],"internalType":"struct AnybodyProblem.Level[]","name":"levels","type":"tuple[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"dayLevelIndexSeed","type":"bytes32"},{"internalType":"uint256","name":"index","type":"uint256"}],"name":"getRandomValues","outputs":[{"components":[{"internalType":"uint256","name":"bodyIndex","type":"uint256"},{"internalType":"uint256","name":"px","type":"uint256"},{"internalType":"uint256","name":"py","type":"uint256"},{"internalType":"uint256","name":"vx","type":"uint256"},{"internalType":"uint256","name":"vy","type":"uint256"},{"internalType":"uint256","name":"radius","type":"uint256"},{"internalType":"bytes32","name":"seed","type":"bytes32"}],"internalType":"struct AnybodyProblem.Body","name":"","type":"tuple"}],"stateMutability":"pure","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"longestStreak","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"maxTicksByLevelIndex","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"maxVector","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"maxVectorScaled","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"mostGames","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"paused","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"price","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"proceedRecipient","outputs":[{"internalType":"address payable","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"min","type":"uint256"},{"internalType":"uint256","name":"max","type":"uint256"},{"internalType":"bytes32","name":"rand","type":"bytes32"}],"name":"randomRange","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"pure","type":"function"},{"inputs":[{"internalType":"address payable","name":"_to","type":"address"}],"name":"recoverUnsuccessfulPayment","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"},{"internalType":"uint256","name":"salePrice","type":"uint256"}],"name":"royaltyInfo","outputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"runCount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"runs","outputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"bool","name":"solved","type":"bool"},{"internalType":"uint256","name":"accumulativeTime","type":"uint256"},{"internalType":"bytes32","name":"seed","type":"bytes32"},{"internalType":"uint256","name":"day","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"scalingFactor","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"speedFactor","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"speedruns","outputs":[{"internalType":"address payable","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes4","name":"interfaceId","type":"bytes4"}],"name":"speedrunsSupportsInterface","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"pure","type":"function"},{"inputs":[{"internalType":"uint256","name":"id","type":"uint256"}],"name":"speedrunsTokenURI","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"startingRadius","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes4","name":"interfaceId","type":"bytes4"}],"name":"supportsInterface","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"timeUntilEndOfWeek","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"externalMetadata_","type":"address"}],"name":"updateExternalMetadata","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bool","name":"paused_","type":"bool"}],"name":"updatePaused","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"price_","type":"uint256"}],"name":"updatePrice","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address payable","name":"proceedRecipient_","type":"address"}],"name":"updateProceedRecipient","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address payable","name":"speedruns_","type":"address"}],"name":"updateSpeedrunsAddress","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"verifier_","type":"address"},{"internalType":"uint256","name":"verifierBodies","type":"uint256"},{"internalType":"uint256","name":"verifierTicks","type":"uint256"}],"name":"updateVerifier","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"}],"name":"verifiers","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"components":[{"internalType":"uint256","name":"bodyIndex","type":"uint256"},{"internalType":"uint256","name":"px","type":"uint256"},{"internalType":"uint256","name":"py","type":"uint256"},{"internalType":"uint256","name":"vx","type":"uint256"},{"internalType":"uint256","name":"vy","type":"uint256"},{"internalType":"uint256","name":"radius","type":"uint256"},{"internalType":"bytes32","name":"seed","type":"bytes32"}],"internalType":"struct AnybodyProblem.Body","name":"bodyData","type":"tuple"},{"internalType":"uint256[]","name":"input","type":"uint256[]"},{"internalType":"uint256","name":"bodyCount","type":"uint256"},{"internalType":"uint256","name":"i","type":"uint256"}],"name":"verifyBodyDataMatches","outputs":[],"stateMutability":"pure","type":"function"},{"inputs":[{"internalType":"uint256","name":"bodyCount","type":"uint256"},{"internalType":"address","name":"verifier","type":"address"},{"internalType":"uint256[2]","name":"a","type":"uint256[2]"},{"internalType":"uint256[2][2]","name":"b","type":"uint256[2][2]"},{"internalType":"uint256[2]","name":"c","type":"uint256[2]"},{"internalType":"uint256[]","name":"input","type":"uint256[]"}],"name":"verifyProof","outputs":[],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"}],"name":"weeklyRecords","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"windowWidth","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"stateMutability":"payable","type":"receive"}],"bytecode":"0x610120604052346200071d57620050fc803803806200001e816200073d565b928339810160c0828203126200071d57620000398262000763565b90620000486020840162000763565b620000566040850162000763565b60e05260608401516001600160401b0381116200071d5784019382601f860112156200071d57845194620000946200008e8762000778565b6200073d565b9560208088838152019160051b830101918583116200071d57602001905b828210620007225750505060808101516001600160401b0381116200071d5783620000df91830162000790565b60a08201519093906001600160401b0381116200071d5762000102920162000790565b60008054336001600160a01b03198216811783556040519396939290916001600160a01b0316907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e09084a36003805460ff191690556608e1bc9bf040006004556001600160401b0360a0820190811190821117620005bd5760a0810160405260fa81526101f460208201526102ee60408201526103e860608201526104e260808201526008906000905b600582106200070257505060408051915081018082116001600160401b0390911117620005bd57604081016040526001815260005b60208110620006a95750805190680100000000000000008211620005bd5760175482601755808310620005d3575b5060176000908152600080516020620050dc83398151915292916020015b8282106200039257505050506200024362000911565b60e051600680546001600160a01b0319166001600160a01b03929092169190911790556200027062000911565b600580546001600160a01b0319166001600160a01b03929092169190911790556200029a62000911565b600780546001600160a01b0319166001600160a01b039290921691909117905560005b83518110156200038257620002e0620002d78284620008a6565b511515620008d1565b620003026001600160a01b03620002f88387620008a6565b51161515620008d1565b6001600160a01b03620003168286620008a6565b5116620003248285620008a6565b51600052601860205260406000206200033e8385620008a6565b5160005260205260406000209060018060a01b031982541617905560001981146200036c57600101620002bd565b634e487b7160e01b600052601160045260246000fd5b60405161477190816200096b8239f35b60a08151600180831b0381511686549060ff841b60208401511515851b169160018060a81b031916171786556040810151600187015560608101516002870155608081015160038701550151805190680100000000000000008211620005bd57600486015482600488015580831062000547575b50602001906004860160005260206000206000915b8083106200043b575050505060056020600192019401910190926200022d565b969593949a91989b929990978a518051151560ff80198c54169116178a55602081015160018b0155604081015160028b0155606081015160805260038a0160c05260005b6005811062000526575060800151610100526008890160a05260005b60068110156200050557600190600761010051602081519160c083519360a051948555838101518886015560408101516002860155606081015160038601556080810151600486015560a081015160058601550151600684015501610100520160a052016200049b565b5097929b989099603260206001929d97969899949d0194019101916200041b565b60019081608051602081519160c051928355016080520160c052016200047f565b62000552906200081e565b6200055d836200081e565b906004880160005260206000209182015b81830181106200058057505062000406565b806000603292556000600182015560006002820155620005b660088201620005ac81600385016200084f565b8383019062000868565b016200056e565b634e487b7160e01b600052604160045260246000fd5b620005de90620007ed565b620005e983620007ed565b6017600052600080516020620050dc833981519152919082015b8183018110620006155750506200020f565b60008155600060018201556000600282015560006003820155600481015460006004830155806200064b575b5060050162000603565b62000656906200081e565b600482016000526020600020908101905b81811062000676575062000641565b806000603292556000600182015560006002820155620006a260088201620005ac81600385016200084f565b0162000667565b604051906001600160401b0360c0830190811190831117620005bd578160c06020930160405260008152600083820152600060408201526000606082015260006080820152606060a082015282828501015201620001e1565b600160208261ffff83945116865501930191019091620001ac565b600080fd5b60208091620007318462000763565b815201910190620000b2565b6040519190601f01601f191682016001600160401b03811183821017620005bd57604052565b51906001600160a01b03821682036200071d57565b6001600160401b038111620005bd5760051b60200190565b9080601f830112156200071d57815190620007af6200008e8362000778565b9182938184526020808095019260051b8201019283116200071d578301905b828210620007dd575050505090565b81518152908301908301620007ce565b7f333333333333333333333333333333333333333333333333333333333333333381116001166200036c5760050290565b7f051eb851eb851eb851eb851eb851eb851eb851eb851eb851eb851eb851eb851e81116001166200036c5760320290565b8181106200085b575050565b600081556001016200084f565b81811062000874575050565b600790600080825580600183015580600283015580600383015580600483015580600583015560068201550162000868565b8051821015620008bb5760209160051b010190565b634e487b7160e01b600052603260045260246000fd5b15620008d957565b60405162461bcd60e51b815260206004820152601060248201526f24b73b30b634b2103b32b934b334b2b960811b6044820152606490fd5b6000546001600160a01b031633036200092657565b606460405162461bcd60e51b815260206004820152602060248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e65726044820152fdfe60806040526004361015610097575b361561005b57346100565760405162461bcd60e51b81526020600482015260156024820152746e6f2066616c6c6261636b207468616e6b20796f7560581b6044820152606490fd5b600080fd5b60405162461bcd60e51b81526020600482015260146024820152736e6f2072656365697665207468616e6b20796f7560601b6044820152606490fd5b60003560e01c8063010520a114612cc5578063014a30d214612c7d57806301ffc9a714612c28578063041df08214612c0f57806306575c8914612bf457806308cdc2a814612bb9578063098b5e9314612b185780630b27ce3f14612aef57806310d80a5514612ac5578063132d5ed914612aa7578063158b38b614612a64578063159f82b114612a1e5780632a55205a1461297b5780632b057afa1461292d5780632e93a492146128f7578063355f7407146126d857806335d6f0cc146128d65780633ef2570b146128b257806343569ffb146128775780634b9862d91461285b5780634caa028b146128135780634dbe7f73146127e45780635103d6ea146127515780635120a26114612734578063530ab7dc146126e657806353e52f09146126d85780635542437b146126945780635bd6b2ea1461264c5780635c9302c91461262a5780635c975abb146126075780636498c128146125d15780636ef24f2d1461253057806370180bc1146124df578063715018a61461248057806371b8ccb014612436578063770c5da1146124005780637a19b1901461235f578063861f75561461224f57806387b07780146122265780638cc52cf3146122085780638d6cc56d146121e75780638da5cb5b146121be578063907311b11461211d5780639196b700146120f25780639654c1f7146120c65780639691f1ab146120a057806398a6a641146120595780639bc4961714612030578063a035b1fe14612012578063ac4a604714611fca578063adcbb85b14611f40578063ae66f57c14611e59578063b24f67b814611d78578063bd2c955214611cab578063c8b90ebb14611bfd578063cc80b8ea14611bb9578063d8531e6e14611b6f578063de89d1c114610582578063e2adba8c14610566578063ed3437f814610549578063f2fde38b14610481578063f6fbc39a146103e3578063f81c8ec3146103c5578063f9cfa06f146103a75763ffd73d3b0361000e57346100565761037536612fa1565b90600052600d6020526040600020600382101561005657602091610398916131be565b90549060031b1c604051908152f35b34610056576000366003190112610056576020604051620151808152f35b34610056576000366003190112610056576020604051620f42408152f35b346100565760203660031901126100565760043563ffffffff60e01b8116809103610056576020906301ffc9a760e01b8114908115610470575b811561045f575b811561044e575b811561043d575b506040519015158152f35b632483248360e11b14905082610432565b63152a902d60e11b8114915061042b565b6303a24d0760e21b81149150610424565b636cdb3d1360e11b8114915061041d565b346100565760203660031901126100565761049a613044565b6104a2613364565b6001600160a01b039081169081156104f557600080546001600160a01b031981168417825560405191939192167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e08484a3f35b60405162461bcd60e51b815260206004820152602660248201527f4f776e61626c653a206e6577206f776e657220697320746865207a65726f206160448201526564647265737360d01b6064820152608490fd5b346100565760003660031901126100565760206040516103e88152f35b3461005657600036600319011261005657602060405160058152f35b60c0366003190112610056576024356001600160401b038111610056576105ad903690600401612f17565b6044356001600160401b038111610056576105cc9036906004016132f8565b606435906001600160401b0382116100565736602383011215610056578160040135916105f883612f00565b926106066040519485612edf565b80845260208401913660248360071b830101116100565760248101925b60248360071b8301018410611b1357505050506084356001600160401b038111610056576106559036906004016132f8565b906001600160401b0360a435116100565736602360a4350112156100565760a4356004013561068381612f00565b906106916040519283612edf565b80825260208201903660248260051b60a43501011161005657602460a43501915b60248260051b60a43501018310611ae0575050506004359360ff60035416611aa6576106e3620151804206426133ec565b93851561173d575b6106f48661323b565b50546001600160a01b031633036116e95760ff6107108761323b565b505460a01c166116af5760036107258761323b565b500154850361165b5760005b83518110156116595786610745828a6133d8565b5161075083886133d8565b519061080161075f85886133d8565b5161076a86886133d8565b5190610776878b6133d8565b519360046107838661436a565b9590986107b760405161079581612d76565b601081526f7665726966794c6576656c4368756e6b60801b60208201526146ff565b6107c08a6146c4565b6107c9876146c4565b6107f36040516107d881612d76565b60098152681d1a58dad0dbdd5b9d60ba1b60208201526146ff565b6107fc846146c4565b61323b565b50015480970361161457600187106111355760ff6108318f6108229061323b565b506000198a01906004016137f1565b5054166115d85760011987116111355761084e84600189016135ee565b600052601860205260406000209060005260205260018060a01b03604060002054169182156115a05761088c6108878560018a016135ee565b612fe7565b80196005116111355760011960058201116111355733906001600160a01b03906108b990600601886133d8565b51160361154d576108e860038f6108d26108e19161323b565b506000198b01906004016137f1565b50016133f7565b604051906108f582612d2d565b61090d6108876109088860018d016135ee565b612ffd565b801960051161113557600219600582011161113557600761092f9101886133d8565b5182526109456108876109088860018d016135ee565b80196005116111355760021960058201116111355760011960078201116111355760086109739101886133d8565b51602083015261098c6108876109088860018d016135ee565b80196005116111355760021960058201116111355760021960078201116111355760096109ba9101886133d8565b5160408301526109d36108876109088860018d016135ee565b801960051161113557600219600582011161113557600319600782011161113557600a610a019101886133d8565b516060830152610a1a6108876109088860018d016135ee565b801960051161113557600219600582011161113557600419600782011161113557600b610a489101886133d8565b5180608084015280611467575b505050604051610a6481612d2d565b610a6d866133cb565b51815285516001101561111f576040860151602082015285516002101561111f576060860151604082015285516003101561111f576080860151606082015285516004101561111f5760038f6108d2610acf9160a08a0151608086015261323b565b50016000915b6005831061145157505050610af06108878560018a016135ee565b918219600511611135578592600501610b0990846133d8565b5196610b188660018b016135ee565b94610b2295613ef5565b610b2b8b61323b565b50610b3e906000198601906004016137f1565b50610b489061343c565b92602084015190610b58916135ee565b80602085015260001985016005111561111f576007850154106114165790828b8593600093610b85613564565b5060005b6001870181106113255750505090610bb5610ba6610bbb9361323b565b506000198601906004016137f1565b9061380d565b610be6604051610bca81612d76565b600a815269626f64696573476f6e6560b01b60208201526146ff565b610bef816146c4565b14610c05575b5050610c00906133bc565b610731565b906020600592610c30610c218c9b989c9d99969d9a979a61323b565b506000198501906004016137f1565b50600160ff19825416179055828a8383015160405190815289858201527f416328325568dd8681e48de39e8d89a80ddf01a688fbcb49c28c621071c9333b60403392a40151610c8d6001610c838b61323b565b50019182546135ee565b90550361130b57610c9d8661323b565b50805460ff60a01b1916600160a01b17905560045434036112d2576005546040516000918291829134906001600160a01b03165af1610cda613a00565b6007546001600160a01b0316803b15610056576000809160a46040518094819363093ccd3160e41b83523360048401528b602484015260016044840152608060648401528160848401525af1801561121f576112c3575b507fb08889abce443443404b2caf69aa3ccfb9ebfdf1ad2a634d06e11e24c1067938610d7660018060a01b0360055416926040519182916040835260408301906132ab565b943460208301521515940390a3856001610d8f8261323b565b5001546040519081528460208201527f7f05a2f6290fe88fe25ed1665c50706361d709c5003e3067340b9053916fd70760403392a33360005260146020526040600020610ddc81546133bc565b9055610df0610dea8761323b565b50613a3d565b9660005b6080890151600052600d60205260038110156112b4576080890151600052610e32610dea610e268360406000206131be565b90549060031b1c61323b565b6040808b01519101518091109081156112ab575b50610e5957610e54906133bc565b610df4565b96889194976080829a9b94979b9895980151600052600d60205260025b818111611247575090610eb8610e9f8493608080960151600052600d60205260406000206131be565b819391549060031b600019811b9283911b169119161790565b9055015160405190602082015260208152610ed281612d76565b604051610ede81612d76565b60018152602036818301377ff8e1a15aba9398e019f0b49df1a4fde98ee17ae345cb5f6b5e2c27f5033e8ce7610f13826133cb565b526007546001600160a01b031690813b15610056579160405192839163b46f007160e01b8352604483016040600485015282518091526020606485019301906000905b80821061122b57505050600083610f7c82969482946003198483030160248501526132ab565b03925af1801561121f57611210575b505b6003610f988861323b565b50015433600052601460205260406000209060405191610fb783612d5b565b805483526002600182015491826020860152015460408401526201518019811161113557620151800181146111f957600160408301525b6020820152336000526014602052604060002081518155602082015160018201556002604083015191015560005b6003811061114b575b5050336000526014602052604060002060026040519161104483612d5b565b80548352600181015460208401520154604082015260005b60038110611073575b5050610c00905b9089610bf5565b8151600e8201546001600160a01b0316600090815260146020526040902054106110a5576110a0906133bc565b61105c565b905060025b8181116110ce5750600e0180546001600160a01b03191633179055610c0089611065565b600181106111355760036000198201101561111f57600d8101546001600160a01b031690600381101561111f5761111a9181600e01906001600160601b0360a01b825416179055613a30565b6110aa565b634e487b7160e01b600052603260045260246000fd5b634e487b7160e01b600052601160045260246000fd5b604082015160018060a01b038260110154166000526014602052600260406000200154106111815761117c906133bc565b61101c565b905060025b8181116111a8575060110180546001600160a01b031916331790558880611025565b600181106111355760036000198201101561111f5760108101546001600160a01b031690600381101561111f576111f49181601101906001600160601b0360a01b825416179055613a30565b611186565b61120660408301516133bc565b6040830152610fee565b61121990612d48565b88610f8b565b6040513d6000823e3d90fd5b8251855287955060209485019490920191600190910190610f56565b9091506080830151600052600d60205260406000209060018110611135576112776112a3926000198301906131be565b90549060031b1c6080850151600052600d60205261129c610e9f8360406000206131be565b9055613a30565b908991610e76565b9050158b610e46565b50929596509296939093610f8d565b6112cc90612d48565b8a610d31565b60405162461bcd60e51b8152602060048201526011602482015270125b98dbdc9c9958dd081c185e5b595b9d607a1b6044820152606490fd5b9296610c0090611320879894979693966138f0565b61106c565b925092838295966113578561135061135c966001611348846080819a01516135ce565b5195016135ee565b8484613b86565b613a94565b81156113bc575b60a08101511561139f575b9061138d816113939360808901519061138783836135ce565b526135ce565b506133bc565b85939285928e92610b89565b939061138d816113b1611393946133bc565b96925092505061136e565b60a08101516113635760405162461bcd60e51b8152602060048201526024808201527f596f752073686f742074686520626f647920796f752073686f756c642070726f6044820152631d1958dd60e21b6064820152608490fd5b60405162461bcd60e51b8152602060048201526013602482015272151a5b59481b1a5b5a5d08195e18d959591959606a1b6044820152606490fd5b6001602082829351855501920192019190610ad5565b8151908351809214928361153a575b83611527575b83611514575b83611506575b50501591826114f5575b5081156114ed575b50156114a8578f8080610a55565b60405162461bcd60e51b815260206004820152601760248201527f496e76616c696420696e666c696768744d697373696c650000000000000000006044820152606490fd5b90503861149a565b60200151620f424014915038611492565b608001511491503880611488565b9250606083015160608501511492611482565b925060408301516040850151149261147c565b9250602083015160208501511492611476565b60405162461bcd60e51b815260206004820152602560248201527f4f776e6572206f6620746869732070726f6f66206973206e6f7420746865207360448201526432b73232b960d91b6064820152608490fd5b60405162461bcd60e51b815260206004820152601060248201526f24b73b30b634b2103b32b934b334b2b960811b6044820152606490fd5b60405162461bcd60e51b815260206004820152601460248201527313195d995b08185b1c9958591e481cdbdb1d995960621b6044820152606490fd5b60405162461bcd60e51b815260206004820152601f60248201527f50726576696f7573206c6576656c206e6f742079657420636f6d706c657465006044820152606490fd5b005b60405162461bcd60e51b815260206004820152602660248201527f43616e206f6e6c7920736f6c76652072756e73206f6e207468652063757272656044820152656e742064617960d01b6064820152608490fd5b60405162461bcd60e51b8152602060048201526012602482015271149d5b88185b1c9958591e481cdbdb1d995960721b6044820152606490fd5b60405162461bcd60e51b815260206004820152602660248201527f4f6e6c7920746865206f776e6572206f66207468652072756e2063616e20736f6044820152651b1d99481a5d60d21b6064820152608490fd5b94506017549460405161174f81612d12565b60006020820152600060408201526000606082015260006080820152606060a08201523381526001431061113557604051876020820152600060408201526000194301406060820152606081528060808101106001600160401b03608083011117611a7a5760808101604052602081519101206060820152856080820152600160401b871015611a7a57600187016017556117e98761323b565b611a90578151815460208401516001600160a81b03199091166001600160a01b03929092169190911790151560a090811b60ff60a01b16919091178255604083015160018301556060830151600283015560808301516003830155820151805190600160401b8211611a7a5760048301548260048501558083106119ca575b50602060049101920160005260206000206000905b8282106118d057505050506060807fbe33ae7a5df03243155e17a5896a63473638d0a5042d1504b59ea59ff0f2b0a5920151604051908982528860208301526040820152a16118cb866138f0565b6106eb565b95839a939b94959892999b979197516118f881511515899060ff801983541691151516179055565b60208101516001890155604081015160028901556060810151600389016000915b600583106119b4575050506080015198600888019660009a5b60068c101561199357600760208260c0600194518d815190558d86858301519101558d600260408301519101558d600360608301519101558d600460808301519101558d600560a0830151910155015160068d01550199019b019a97611932565b50959c9a92989399509550959299603260206001920194019201909161187d565b8051825560019283019290910190602001611919565b6119d390612fb7565b6119dc83612fb7565b906004850160005260206000209182015b81830181106119fd575050611868565b600081556000600182015560006002820155600381015b600882018110611a6e5750600881015b603282018110611a3757506032016119ed565b8060006007925560006001820155600060028201556000600382015560006004820155600060058201556000600682015501611a24565b60008155600101611a14565b634e487b7160e01b600052604160045260246000fd5b634e487b7160e01b600052600060045260246000fd5b60405162461bcd60e51b815260206004820152601260248201527110dbdb9d1c9858dd081a5cc81c185d5cd95960721b6044820152606490fd5b6001600160401b0383351161005657602080602492611b063685883560a4350101612f17565b81520193019290506106b2565b36601f8501121561005657604051611b2a81612d76565b803660808701116100565785905b608087018210611b55575050815260809390930192602001610623565b6020604091611b6436856131ce565b815201910190611b38565b34610056576020366003190112610056576004356001600160401b03811161005657611baa611ba5610680923690600401612f17565b6145ec565b611bb760405180926132d0565bf35b34610056576020366003190112610056576004356001600160a01b0381169081900361005657611be7613364565b600580546001600160a01b031916919091179055005b3461005657602080600319360112610056576004356001600160401b03811161005657611c2e903690600401612f17565b9060405191611c3c83612e1c565b610a40809336903760405190611c5182612e1c565b8336833760005b60528110611c8b575050604051916000835b60528210611c76578585f35b82806001928651815201940191019092611c6a565b80611c99611ca692846133d8565b518160051b8501526133bc565b611c58565b346100565760208060031936011261005657611cd36004611ccc813561323b565b500161350e565b906040519181839283018184528251809152816040850193019160005b828110611cff57505050500390f35b919390838194965051805115158352818101518284015260408101516040840152606080820151908401906000915b60058310611d6257505050600192611d5260806106409301516101008301906130c9565b0195019101918594939192611cf0565b8151815287946001909301929182019101611d2e565b34610056576020806003193601126100565760065460405163295d33a960e21b815260048035908201529190600090839060249082906001600160a01b03165afa91821561121f57600092611de1575b50611ddd6040519282849384528301906132ab565b0390f35b9091503d806000833e611df48183612edf565b8101908281830312610056578051906001600160401b038211610056570181601f82011215610056578051611e28816139e5565b92611e366040519485612edf565b81845284828401011161005657611e5291848085019101613276565b9082611dc8565b346100565760203660031901126100565760043560175481101561005657600560a091601760005202807fc624b66cc0138b8fabc209247f72d758e1cf3343756d543badbf24212bed8c150154907fc624b66cc0138b8fabc209247f72d758e1cf3343756d543badbf24212bed8c16810154907fc624b66cc0138b8fabc209247f72d758e1cf3343756d543badbf24212bed8c187fc624b66cc0138b8fabc209247f72d758e1cf3343756d543badbf24212bed8c178201549101549160ff60405194600180881b0381168652861c1615156020850152604084015260608301526080820152f35b34610056576020366003190112610056576004356001600160a01b0381169081900361005657611f6e613364565b47907fb08889abce443443404b2caf69aa3ccfb9ebfdf1ad2a634d06e11e24c1067938611fbc6000808060405187875af1611fa7613a00565b906040519283926040845260408401906132ab565b9560208301521515940390a3005b34610056576020366003190112610056576004356001600160401b038111610056576120056120006107c0923690600401612f17565b614634565b611bb76040518092613213565b34610056576000366003190112610056576020600454604051908152f35b34610056576000366003190112610056576006546040516001600160a01b039091168152602090f35b34610056576120673661305a565b9160018060a01b031660005260156020526040600020906000526020526040600020906007811015610056576020910154604051908152f35b346100565760203660031901126100565760206120be600435613742565b604051908152f35b346100565760203660031901126100565760043560058110156100565760209060080154604051908152f35b3461005657600036600319011261005657601754600181106111355760209060405190600019018152f35b3461005657602080600319360112610056576004356001600160401b0381116100565761214e903690600401612f17565b906040519161215c83612e00565b610b8080933690376040519061217182612e00565b8336833760005b605c81106121ab575050604051916000835b605c8210612196578585f35b8280600192865181520194019101909261218a565b80611c996121b992846133d8565b612178565b34610056576000366003190112610056576000546040516001600160a01b039091168152602090f35b3461005657602036600319011261005657612200613364565b600480359055005b346100565760003660031901126100565760206040516204f1a08152f35b34610056576000366003190112610056576007546040516001600160a01b039091168152602090f35b3461005657610160366003190112610056576024356001600160a01b0381168103610056573660631215610056576040519061228a82612d76565b608482368211610056576044905b82821061234f5750503660a31215610056576040516122b681612d76565b806101049236841161005657905b83821061233557505036610123121561005657604051916122e483612d76565b826101449136831161005657905b82821061232557505035936001600160401b0385116100565761231c611659953690600401612f17565b93600435613ef5565b81358152602091820191016122f2565b602060409161234436856131ce565b8152019101906122c4565b8135815260209182019101612298565b3461005657602080600319360112610056576004356001600160401b03811161005657612390903690600401612f17565b906040519161239e83612de4565b6102c08093369037604051906123b382612de4565b8336833760005b601681106123ed575050604051916000835b601682106123d8578585f35b828060019286518152019401910190926123cc565b80611c996123fb92846133d8565b6123ba565b3461005657602036600319011261005657600435600381101561005657600e01546040516001600160a01b039091168152602090f35b346100565761244436612fa1565b9060005260166020526040600020600382101561005657602091612467916131be565b905460405160039290921b1c6001600160a01b03168152f35b3461005657600036600319011261005657612499613364565b600080546001600160a01b0319811682556040519082906001600160a01b03167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e08284a3f35b34610056576020366003190112610056576001600160a01b03612500613044565b16600052601460205260606040600020805490600260018201549101549060405192835260208301526040820152f35b3461005657602080600319360112610056576004356001600160401b03811161005657612561903690600401612f17565b906040519161256f83612dc8565b610cc080933690376040519061258482612dc8565b8336833760005b606681106125be575050604051916000835b606682106125a9578585f35b8280600192865181520194019101909261259d565b80611c996125cc92846133d8565b61258b565b3461005657602036600319011261005657600435600381101561005657601101546040516001600160a01b039091168152602090f35b3461005657600036600319011261005657602060ff600354166040519015158152f35b346100565760003660031901126100565760206120be620151804206426133ec565b34610056576020366003190112610056576004356001600160401b03811161005657612687612682610900923690600401612f17565b61467c565b611bb76040518092613196565b34610056576020366003190112610056576004356001600160a01b03811690819003610056576126c2613364565b600780546001600160a01b031916919091179055005b506126e1613084565b61000e565b34610056576101403660031901126100565761270136613135565b60e435906001600160401b03821161005657612724611659923690600401612f17565b9061012435916101043591613b86565b34610056576000366003190112610056576020604051614e208152f35b34610056576101203660031901126100565761276c36613135565b60e4356001600160401b0381116100565760e09161279161279b923690600401612f17565b6101043591613a94565b611bb7604051809260c08091805184526020810151602085015260408101516040850152606081015160608501526080810151608085015260a081015160a08501520151910152565b34610056576105606127fe6127f836612fa1565b906135fa565b61280b60405180936130c9565b610540820152f35b34610056576020366003190112610056576004356001600160401b0381116100565761284e612849610540923690600401612f17565b6145a4565b611bb760405180926130a1565b3461005657600036600319011261005657602060405160148152f35b346100565761288536612fa1565b906000526018602052604060002090600052602052602060018060a01b0360406000205416604051908152f35b346100565760603660031901126100565760206120be604435602435600435613653565b346100565760403660031901126100565760e061279b60243560043561367c565b34610056576000366003190112610056576129106137cf565b62093a80198111611135576120be60209162093a804291016133ec565b346100565761293b3661305a565b90612944613364565b60009081526018602090815260408083209383529290522080546001600160a01b0319166001600160a01b03909216919091179055005b346100565761298936612fa1565b906000526002602052604060002090604051916129a583612d76565b546001600160a01b0380821680855260a09290921c60208501529290156129fc575b6001600160601b0360208201511682600019048111831515166111355760409361271092511692845193845202046020820152f35b50604051612a0981612d76565b600154838116825260a01c60208201526129c7565b34610056576020366003190112610056576004356001600160401b03811161005657612a58612a536040923690600401612f17565b61436a565b82519182526020820152f35b3461005657602036600319011261005657612a7d613044565b612a85613364565b600680546001600160a01b0319166001600160a01b0392909216919091179055005b3461005657600036600319011261005657602060405162093a808152f35b346100565760203660031901126100565760206004612ae4813561323b565b500154604051908152f35b34610056576000366003190112610056576005546040516001600160a01b039091168152602090f35b3461005657602080600319360112610056576004356001600160401b03811161005657612b49903690600401612f17565b9060405191612b5783612dac565b610e00809336903760405190612b6c82612dac565b8336833760005b60708110612ba6575050604051916000835b60708210612b91578585f35b82806001928651815201940191019092612b85565b80611c99612bb492846133d8565b612b73565b346100565760203660031901126100565760043580151580910361005657612bdf613364565b60ff8019600354169116176003556000604051f35b346100565760003660031901126100565760206120be6137cf565b346100565760206120be612c2236612fa1565b9061379e565b346100565760203660031901126100565760043563ffffffff60e01b81168091036100565760209063152a902d60e11b8114908115612c6c57506040519015158152f35b6301ffc9a760e01b14905082610432565b34610056576020366003190112610056576004356001600160401b03811161005657612cb8612cb3610400923690600401612f17565b61454f565b611bb76040518092612f75565b3461005657606036600319011261005657600435612ce5816024356133ec565b8015612cfc576020916120be9160443506906135ee565b634e487b7160e01b600052601260045260246000fd5b60c081019081106001600160401b03821117611a7a57604052565b60a081019081106001600160401b03821117611a7a57604052565b6001600160401b038111611a7a57604052565b606081019081106001600160401b03821117611a7a57604052565b604081019081106001600160401b03821117611a7a57604052565b60e081019081106001600160401b03821117611a7a57604052565b610e0081019081106001600160401b03821117611a7a57604052565b610cc081019081106001600160401b03821117611a7a57604052565b6102c081019081106001600160401b03821117611a7a57604052565b610b8081019081106001600160401b03821117611a7a57604052565b610a4081019081106001600160401b03821117611a7a57604052565b608081019081106001600160401b03821117611a7a57604052565b61040081019081106001600160401b03821117611a7a57604052565b61054081019081106001600160401b03821117611a7a57604052565b61068081019081106001600160401b03821117611a7a57604052565b6107c081019081106001600160401b03821117611a7a57604052565b61090081019081106001600160401b03821117611a7a57604052565b90601f801991011681019081106001600160401b03821117611a7a57604052565b6001600160401b038111611a7a5760051b60200190565b81601f8201121561005657803591612f2e83612f00565b92612f3c6040519485612edf565b808452602092838086019260051b820101928311610056578301905b828210612f66575050505090565b81358152908301908301612f58565b916000915b60209081841015612f9a5790806001928651815201940192019192612f7a565b5050915050565b6040906003190112610056576004359060243590565b7f051eb851eb851eb851eb851eb851eb851eb851eb851eb851eb851eb851eb851e81116001166111355760320290565b8060001904600511811515166111355760050290565b6001600160ff1b0381116001166111355760011b90565b7f333333333333333333333333333333333333333333333333333333333333333381116001166111355760050290565b600435906001600160a01b038216820361005657565b6060906003190112610056576004356001600160a01b038116810361005657906024359060443590565b503461005657600036600319011261005657602060405160028152f35b6000915b602a83106130b257505050565b6001908251815260208091019201920191906130a5565b906000905b600682106130db57505050565b602060e082613129600194875160c08091805184526020810151602085015260408101516040850152606081015160608501526080810151608085015260a081015160a08501520151910152565b019301910190916130ce565b60e0906003190112610056576040519060e082018281106001600160401b03821117611a7a57604052816004358152602435602082015260443560408201526064356060820152608435608082015260a43560a082015260c060c435910152565b6000915b604883106131a757505050565b60019082518152602080910192019201919061319a565b600382101561111f570190600090565b9080601f8301121561005657604051916131e783612d76565b82906040810192831161005657905b8282106132035750505090565b81358152602091820191016131f6565b6000915b603e831061322457505050565b600190825181526020809101920192019190613217565b60175481101561111f576005906017600052027fc624b66cc0138b8fabc209247f72d758e1cf3343756d543badbf24212bed8c150190600090565b918091926000905b82821061329657501161328f575050565b6000910152565b9150806020918301518186015201829161327e565b906020916132c481518092818552858086019101613276565b601f01601f1916010190565b6000915b603483106132e157505050565b6001908251815260208091019201920191906132d4565b81601f820112156100565780359061330f82612f00565b9260409261331f84519586612edf565b808552602091828087019260061b85010193818511610056578301915b84831061334c5750505050505090565b83869161335984866131ce565b81520192019161333c565b6000546001600160a01b0316330361337857565b606460405162461bcd60e51b815260206004820152602060248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e65726044820152fd5b60001981146111355760010190565b80511561111f5760200190565b805182101561111f5760209160051b010190565b818110611135570390565b60405191906000835b600582106134265750505060a082018281106001600160401b03821117611a7a57604052565b6001602081928554815201930191019091613400565b90604080519261344b84612d2d565b8360ff825416151581526001938483015491602092838201526002908185015486820152600361347c8187016133f7565b906060918284015287519761349089612d12565b60009760080195895b6006808b10156134fb57898d926007928651906134b582612d91565b8c548252858d0154848301528b8d015488830152888d01548a83015260048d0154608083015260058d015460a08301528c015460c0820152815201980199019896613499565b5050995050505092505050608091500152565b90815461351a81612f00565b926135286040519485612edf565b818452600090815260208082208186015b848410613547575050505050565b6032836001926135568561343c565b815201920193019290613539565b6040519061357182612d91565b8160c06000918281528260208201528260408201528260608201528260808201528260a08201520152565b604051906135a982612d12565b8160005b60c081106135b9575050565b6020906135c4613564565b81840152016135ad565b90600681101561111f5760051b0190565b61271081198111611135570190565b81198111611135570190565b919061360461359c565b9260005b8281111561362157505060011981116111355760010190565b806136398161363461364e948787613653565b61367c565b61364382886135ce565b5261138d81876135ce565b613608565b916040519160208301938452604083015260608201526060815261367681612e38565b51902090565b61373a90613688613564565b506136a3613694613564565b938085528260c0860152613742565b60a0840152604051906020918281019182528281526136c181612d76565b519020620f424090818106838601526040518381019182528381526136e581612d76565b519020908106604085015260405182810191825282815261370581612d76565b519020614e20916137178383066135df565b606086015260405190808201928352815261373181612d76565b519020066135df565b608082015290565b61378560ff9160066040519161375783612d12565b60248352601b60208401526016604084015260116060840152600c6080840152600760a084015206906135ce565b51166103e8908060001904821181151516611135570290565b9060014310611135576040519060208201928352604082015260001943014060608201526060815261367681612e38565b6204f1a04210611135576137ee62093a806204f19f19420106426133ec565b90565b805482101561111f576000526032602060002091020190600090565b9290611a905761382e829392511515839060ff801983541691151516179055565b6020918284015192600193848301556040948581015193600294858501556060918281015160039081870190896000915b600583106138dc575050505060086080809301519601936000965b6006808910156138ce57815180518855888101518c8901558c8101518b890155838101518589015585810151600489015560a0810151600589015560c001519087015596890196600790950194860161387a565b505050505095505050505050565b80518455928101929101908a90880161385f565b60036138fb8261323b565b50015490600461390a8261323b565b500154600119811161113557600101906040519261392784612d2d565b600084526000602085015260408401926000845260405161394781612d2d565b60a036823760608601526080850161395d61359c565b8152613969828561379e565b855261397582846135fa565b50905260046139838461323b565b5001938454600160401b811015611a7a577f70f3b6a85b7a5047df9e61440f8b6480a7cd8a96f849a4092d0a22303a5dbb0f96610bb58260809860016139cb950181556137f1565b5190604051938452602084015260408301526060820152a1565b6001600160401b038111611a7a57601f01601f191660200190565b3d15613a2b573d90613a11826139e5565b91613a1f6040519384612edf565b82523d6000602084013e565b606090565b8015611135576000190190565b90604051613a4a81612d12565b60a0613a8f6004839560ff8154600180871b0381168752851c16151560208601526001810154604086015260028101546060860152600381015460808601520161350e565b910152565b9190613a9e613564565b50613aa882612fe7565b916005928019841161113557613ac0908401836133d8565b516020850152613acf81612fe7565b801984116111355760011984820111611135576006613aef9101836133d8565b516040850152613afe81612fe7565b801984116111355760021984820111611135576007613b1e9101836133d8565b516060850152613b2d81612fe7565b9081198411611135576003198483011161113557613b516008613b5c9301846133d8565b516080860152612fe7565b91821981116111355760041990830111611135576009613b7d9201906133d8565b5160a082015290565b9291906020928385015190613b9a84613014565b906005918019831161113557613bbb90613bb383612fe7565b9084016135ee565b6002199390848111611135576002613bd49101866133d8565b5103613e4b576040870151613be886613014565b8019841161113557613c0590613bfd84612fe7565b9085016135ee565b600119811161113557846001820111611135576003613c259101866133d8565b5103613e1157606087015196613c3a86613014565b8019841161113557613c4f90613bfd84612fe7565b97848911611135578460028a011161113557613c6f6004809a01876133d8565b5103613dda576080810151613c8387613014565b80198511613dc557613ca090613c9885612fe7565b9086016135ee565b6003198111613dc557856003820111613dc55784613cbf9101876133d8565b5103613d8e5760a0613cd391015195613014565b9081198311613d795790613cea613cf19392612fe7565b91016135ee565b906004198211613d645785820111613d4f57906006613d119201906133d8565b5103613d1b575050565b60405162461bcd60e51b815291820152600e60248201526d496e76616c69642072616469757360901b604482015260649150fd5b601185634e487b7160e01b6000525260246000fd5b601186634e487b7160e01b6000525260246000fd5b601188634e487b7160e01b6000525260246000fd5b60405162461bcd60e51b8152808901889052601060248201526f496e76616c696420766563746f72207960801b6044820152606490fd5b60118a634e487b7160e01b6000525260246000fd5b60405162461bcd60e51b8152808901889052601060248201526f092dcecc2d8d2c840eccac6e8dee440f60831b6044820152606490fd5b60405162461bcd60e51b8152600481018790526012602482015271496e76616c696420706f736974696f6e207960701b6044820152606490fd5b60405162461bcd60e51b8152600481018790526012602482015271092dcecc2d8d2c840e0dee6d2e8d2dedc40f60731b6044820152606490fd5b90816020910312610056575180151581036100565790565b6000915b60028310613eae57505050565b600190825181526020809101920192019190613ea1565b906000905b60028210613ed757505050565b6020604082613ee96001948751613e9d565b01930191019091613eca565b939091929360028114600014613fec57509161050491613f60613f4194613f55613f216020989961454f565b91613f4b6040519a8b998a98630f3022c960e21b8a5260048a0190613e9d565b6044880190613ec5565b60c4860190613e9d565b610104840190612f75565b6001600160a01b03165afa90811561121f57600091613fbe575b5015613f8257565b60405162461bcd60e51b815260206004820152601460248201527324b73b30b634b21019103137b23c90383937b7b360611b6044820152606490fd5b613fdf915060203d8111613fe5575b613fd78183612edf565b810190613e85565b38613f7a565b503d613fcd565b600381036140b75750916106449161403b613f4194614030614010602098996145a4565b91613f4b6040519a8b998a986371dd4db160e11b8a5260048a0190613e9d565b6101048401906130a1565b6001600160a01b03165afa90811561121f57600091614099575b501561405d57565b60405162461bcd60e51b815260206004820152601460248201527324b73b30b634b21019903137b23c90383937b7b360611b6044820152606490fd5b6140b1915060203d8111613fe557613fd78183612edf565b38614055565b929390600495848780961460001461418b57509261410f6107849361410460209794613f4b6140e9613f419b996145ec565b936040519b8c9a8b99632a6d5ed560e01b8b528a0190613e9d565b6101048401906132d0565b6001600160a01b03165afa90811561121f5760009161416d575b50156141325750565b60649060206040519162461bcd60e51b8352820152601460248201527324b73b30b634b2101a103137b23c90383937b7b360611b6044820152fd5b614185915060203d8111613fe557613fd78183612edf565b38614129565b600581036142555750926141d96108c4936141ce60209794613f4b6141b3613f419b99614634565b936040519b8c9a8b9963ea59061d60e01b8b528a0190613e9d565b610104840190613213565b6001600160a01b03165afa90811561121f57600091614237575b50156141fc5750565b60649060206040519162461bcd60e51b8352820152601460248201527324b73b30b634b2101a903137b23c90383937b7b360611b6044820152fd5b61424f915060203d8111613fe557613fd78183612edf565b386141f3565b600691929394955014600014614326576020936142aa613f41969461429f610a0495613f4b6142848c9761467c565b936040519b8c9a8b996311b5352360e01b8b528a0190613e9d565b610104840190613196565b6001600160a01b03165afa90811561121f57600091614308575b50156142cd5750565b60649060206040519162461bcd60e51b8352820152601460248201527324b73b30b634b2101b103137b23c90383937b7b360611b6044820152fd5b614320915060203d8111613fe557613fd78183612edf565b386142c4565b60405162461bcd60e51b8152602081880152601860248201527f496e76616c6964206e756d626572206f6620626f6469657300000000000000006044820152606490fd5b908151600c811061113557600a90600b19010460019081811061113557600019809101916143b860405161439d81612d76565b6009815268189bd91e50dbdd5b9d60ba1b60208201526146ff565b6143c1836146c4565b6000948592815183811061453b57600590818382011061452757908896958594939260051901955b614402575b505050505050906143fe916133ec565b9190565b8351851c86111561452257849596975081810615614437575b61442761442d916133bc565b96613a30565b94958997966143e9565b909192935061444686856133d8565b511580614504575b806144e3575b806144c5575b80614490575b61446f575b908493929161441b565b979061442d614427614483879695946133bc565b9a92939495505050614465565b5060048087106144b057506144a96003198701856133d8565b5115614460565b601190634e487b7160e01b6000525260246000fd5b5060038610611135576144dc6002198701856133d8565b511561445a565b506002861061113557614e206144fd6001198801866133d8565b5114614454565b5084861061113557614e2061451b848801866133d8565b511461444e565b6143ee565b634e487b7160e01b89526011600452602489fd5b634e487b7160e01b88526011600452602488fd5b9060405161455c81612e53565b61040080913690376040519061457182612e53565b36823760005b6020811061458457509150565b8061459261459f92866133d8565b518160051b8401526133bc565b614577565b906040516145b181612e6f565b6105408091369037604051906145c682612e6f565b36823760005b602a81106145d957509150565b806145926145e792866133d8565b6145cc565b906040516145f981612e8b565b61068080913690376040519061460e82612e8b565b36823760005b6034811061462157509150565b8061459261462f92866133d8565b614614565b9060405161464181612ea7565b6107c080913690376040519061465682612ea7565b36823760005b603e811061466957509150565b8061459261467792866133d8565b61465c565b9060405161468981612ec3565b61090080913690376040519061469e82612ec3565b36823760005b604881106146b157509150565b806145926146bf92866133d8565b6146a4565b60008091604051602081019163f82c50f160e01b83526024820152602481526146ec81612d5b565b51906a636f6e736f6c652e6c6f675afa50565b600080916040516146ec8161472d602082019463104c13eb60e21b86526020602484015260448301906132ab565b03601f198101835282612edf56fea26469706673582212201d1e534cd54c747258bc0370ad60097334da8ed5670c570fe6940368a54195ef64736f6c634300080f0033c624b66cc0138b8fabc209247f72d758e1cf3343756d543badbf24212bed8c15","deployedBytecode":"0x60806040526004361015610097575b361561005b57346100565760405162461bcd60e51b81526020600482015260156024820152746e6f2066616c6c6261636b207468616e6b20796f7560581b6044820152606490fd5b600080fd5b60405162461bcd60e51b81526020600482015260146024820152736e6f2072656365697665207468616e6b20796f7560601b6044820152606490fd5b60003560e01c8063010520a114612cc5578063014a30d214612c7d57806301ffc9a714612c28578063041df08214612c0f57806306575c8914612bf457806308cdc2a814612bb9578063098b5e9314612b185780630b27ce3f14612aef57806310d80a5514612ac5578063132d5ed914612aa7578063158b38b614612a64578063159f82b114612a1e5780632a55205a1461297b5780632b057afa1461292d5780632e93a492146128f7578063355f7407146126d857806335d6f0cc146128d65780633ef2570b146128b257806343569ffb146128775780634b9862d91461285b5780634caa028b146128135780634dbe7f73146127e45780635103d6ea146127515780635120a26114612734578063530ab7dc146126e657806353e52f09146126d85780635542437b146126945780635bd6b2ea1461264c5780635c9302c91461262a5780635c975abb146126075780636498c128146125d15780636ef24f2d1461253057806370180bc1146124df578063715018a61461248057806371b8ccb014612436578063770c5da1146124005780637a19b1901461235f578063861f75561461224f57806387b07780146122265780638cc52cf3146122085780638d6cc56d146121e75780638da5cb5b146121be578063907311b11461211d5780639196b700146120f25780639654c1f7146120c65780639691f1ab146120a057806398a6a641146120595780639bc4961714612030578063a035b1fe14612012578063ac4a604714611fca578063adcbb85b14611f40578063ae66f57c14611e59578063b24f67b814611d78578063bd2c955214611cab578063c8b90ebb14611bfd578063cc80b8ea14611bb9578063d8531e6e14611b6f578063de89d1c114610582578063e2adba8c14610566578063ed3437f814610549578063f2fde38b14610481578063f6fbc39a146103e3578063f81c8ec3146103c5578063f9cfa06f146103a75763ffd73d3b0361000e57346100565761037536612fa1565b90600052600d6020526040600020600382101561005657602091610398916131be565b90549060031b1c604051908152f35b34610056576000366003190112610056576020604051620151808152f35b34610056576000366003190112610056576020604051620f42408152f35b346100565760203660031901126100565760043563ffffffff60e01b8116809103610056576020906301ffc9a760e01b8114908115610470575b811561045f575b811561044e575b811561043d575b506040519015158152f35b632483248360e11b14905082610432565b63152a902d60e11b8114915061042b565b6303a24d0760e21b81149150610424565b636cdb3d1360e11b8114915061041d565b346100565760203660031901126100565761049a613044565b6104a2613364565b6001600160a01b039081169081156104f557600080546001600160a01b031981168417825560405191939192167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e08484a3f35b60405162461bcd60e51b815260206004820152602660248201527f4f776e61626c653a206e6577206f776e657220697320746865207a65726f206160448201526564647265737360d01b6064820152608490fd5b346100565760003660031901126100565760206040516103e88152f35b3461005657600036600319011261005657602060405160058152f35b60c0366003190112610056576024356001600160401b038111610056576105ad903690600401612f17565b6044356001600160401b038111610056576105cc9036906004016132f8565b606435906001600160401b0382116100565736602383011215610056578160040135916105f883612f00565b926106066040519485612edf565b80845260208401913660248360071b830101116100565760248101925b60248360071b8301018410611b1357505050506084356001600160401b038111610056576106559036906004016132f8565b906001600160401b0360a435116100565736602360a4350112156100565760a4356004013561068381612f00565b906106916040519283612edf565b80825260208201903660248260051b60a43501011161005657602460a43501915b60248260051b60a43501018310611ae0575050506004359360ff60035416611aa6576106e3620151804206426133ec565b93851561173d575b6106f48661323b565b50546001600160a01b031633036116e95760ff6107108761323b565b505460a01c166116af5760036107258761323b565b500154850361165b5760005b83518110156116595786610745828a6133d8565b5161075083886133d8565b519061080161075f85886133d8565b5161076a86886133d8565b5190610776878b6133d8565b519360046107838661436a565b9590986107b760405161079581612d76565b601081526f7665726966794c6576656c4368756e6b60801b60208201526146ff565b6107c08a6146c4565b6107c9876146c4565b6107f36040516107d881612d76565b60098152681d1a58dad0dbdd5b9d60ba1b60208201526146ff565b6107fc846146c4565b61323b565b50015480970361161457600187106111355760ff6108318f6108229061323b565b506000198a01906004016137f1565b5054166115d85760011987116111355761084e84600189016135ee565b600052601860205260406000209060005260205260018060a01b03604060002054169182156115a05761088c6108878560018a016135ee565b612fe7565b80196005116111355760011960058201116111355733906001600160a01b03906108b990600601886133d8565b51160361154d576108e860038f6108d26108e19161323b565b506000198b01906004016137f1565b50016133f7565b604051906108f582612d2d565b61090d6108876109088860018d016135ee565b612ffd565b801960051161113557600219600582011161113557600761092f9101886133d8565b5182526109456108876109088860018d016135ee565b80196005116111355760021960058201116111355760011960078201116111355760086109739101886133d8565b51602083015261098c6108876109088860018d016135ee565b80196005116111355760021960058201116111355760021960078201116111355760096109ba9101886133d8565b5160408301526109d36108876109088860018d016135ee565b801960051161113557600219600582011161113557600319600782011161113557600a610a019101886133d8565b516060830152610a1a6108876109088860018d016135ee565b801960051161113557600219600582011161113557600419600782011161113557600b610a489101886133d8565b5180608084015280611467575b505050604051610a6481612d2d565b610a6d866133cb565b51815285516001101561111f576040860151602082015285516002101561111f576060860151604082015285516003101561111f576080860151606082015285516004101561111f5760038f6108d2610acf9160a08a0151608086015261323b565b50016000915b6005831061145157505050610af06108878560018a016135ee565b918219600511611135578592600501610b0990846133d8565b5196610b188660018b016135ee565b94610b2295613ef5565b610b2b8b61323b565b50610b3e906000198601906004016137f1565b50610b489061343c565b92602084015190610b58916135ee565b80602085015260001985016005111561111f576007850154106114165790828b8593600093610b85613564565b5060005b6001870181106113255750505090610bb5610ba6610bbb9361323b565b506000198601906004016137f1565b9061380d565b610be6604051610bca81612d76565b600a815269626f64696573476f6e6560b01b60208201526146ff565b610bef816146c4565b14610c05575b5050610c00906133bc565b610731565b906020600592610c30610c218c9b989c9d99969d9a979a61323b565b506000198501906004016137f1565b50600160ff19825416179055828a8383015160405190815289858201527f416328325568dd8681e48de39e8d89a80ddf01a688fbcb49c28c621071c9333b60403392a40151610c8d6001610c838b61323b565b50019182546135ee565b90550361130b57610c9d8661323b565b50805460ff60a01b1916600160a01b17905560045434036112d2576005546040516000918291829134906001600160a01b03165af1610cda613a00565b6007546001600160a01b0316803b15610056576000809160a46040518094819363093ccd3160e41b83523360048401528b602484015260016044840152608060648401528160848401525af1801561121f576112c3575b507fb08889abce443443404b2caf69aa3ccfb9ebfdf1ad2a634d06e11e24c1067938610d7660018060a01b0360055416926040519182916040835260408301906132ab565b943460208301521515940390a3856001610d8f8261323b565b5001546040519081528460208201527f7f05a2f6290fe88fe25ed1665c50706361d709c5003e3067340b9053916fd70760403392a33360005260146020526040600020610ddc81546133bc565b9055610df0610dea8761323b565b50613a3d565b9660005b6080890151600052600d60205260038110156112b4576080890151600052610e32610dea610e268360406000206131be565b90549060031b1c61323b565b6040808b01519101518091109081156112ab575b50610e5957610e54906133bc565b610df4565b96889194976080829a9b94979b9895980151600052600d60205260025b818111611247575090610eb8610e9f8493608080960151600052600d60205260406000206131be565b819391549060031b600019811b9283911b169119161790565b9055015160405190602082015260208152610ed281612d76565b604051610ede81612d76565b60018152602036818301377ff8e1a15aba9398e019f0b49df1a4fde98ee17ae345cb5f6b5e2c27f5033e8ce7610f13826133cb565b526007546001600160a01b031690813b15610056579160405192839163b46f007160e01b8352604483016040600485015282518091526020606485019301906000905b80821061122b57505050600083610f7c82969482946003198483030160248501526132ab565b03925af1801561121f57611210575b505b6003610f988861323b565b50015433600052601460205260406000209060405191610fb783612d5b565b805483526002600182015491826020860152015460408401526201518019811161113557620151800181146111f957600160408301525b6020820152336000526014602052604060002081518155602082015160018201556002604083015191015560005b6003811061114b575b5050336000526014602052604060002060026040519161104483612d5b565b80548352600181015460208401520154604082015260005b60038110611073575b5050610c00905b9089610bf5565b8151600e8201546001600160a01b0316600090815260146020526040902054106110a5576110a0906133bc565b61105c565b905060025b8181116110ce5750600e0180546001600160a01b03191633179055610c0089611065565b600181106111355760036000198201101561111f57600d8101546001600160a01b031690600381101561111f5761111a9181600e01906001600160601b0360a01b825416179055613a30565b6110aa565b634e487b7160e01b600052603260045260246000fd5b634e487b7160e01b600052601160045260246000fd5b604082015160018060a01b038260110154166000526014602052600260406000200154106111815761117c906133bc565b61101c565b905060025b8181116111a8575060110180546001600160a01b031916331790558880611025565b600181106111355760036000198201101561111f5760108101546001600160a01b031690600381101561111f576111f49181601101906001600160601b0360a01b825416179055613a30565b611186565b61120660408301516133bc565b6040830152610fee565b61121990612d48565b88610f8b565b6040513d6000823e3d90fd5b8251855287955060209485019490920191600190910190610f56565b9091506080830151600052600d60205260406000209060018110611135576112776112a3926000198301906131be565b90549060031b1c6080850151600052600d60205261129c610e9f8360406000206131be565b9055613a30565b908991610e76565b9050158b610e46565b50929596509296939093610f8d565b6112cc90612d48565b8a610d31565b60405162461bcd60e51b8152602060048201526011602482015270125b98dbdc9c9958dd081c185e5b595b9d607a1b6044820152606490fd5b9296610c0090611320879894979693966138f0565b61106c565b925092838295966113578561135061135c966001611348846080819a01516135ce565b5195016135ee565b8484613b86565b613a94565b81156113bc575b60a08101511561139f575b9061138d816113939360808901519061138783836135ce565b526135ce565b506133bc565b85939285928e92610b89565b939061138d816113b1611393946133bc565b96925092505061136e565b60a08101516113635760405162461bcd60e51b8152602060048201526024808201527f596f752073686f742074686520626f647920796f752073686f756c642070726f6044820152631d1958dd60e21b6064820152608490fd5b60405162461bcd60e51b8152602060048201526013602482015272151a5b59481b1a5b5a5d08195e18d959591959606a1b6044820152606490fd5b6001602082829351855501920192019190610ad5565b8151908351809214928361153a575b83611527575b83611514575b83611506575b50501591826114f5575b5081156114ed575b50156114a8578f8080610a55565b60405162461bcd60e51b815260206004820152601760248201527f496e76616c696420696e666c696768744d697373696c650000000000000000006044820152606490fd5b90503861149a565b60200151620f424014915038611492565b608001511491503880611488565b9250606083015160608501511492611482565b925060408301516040850151149261147c565b9250602083015160208501511492611476565b60405162461bcd60e51b815260206004820152602560248201527f4f776e6572206f6620746869732070726f6f66206973206e6f7420746865207360448201526432b73232b960d91b6064820152608490fd5b60405162461bcd60e51b815260206004820152601060248201526f24b73b30b634b2103b32b934b334b2b960811b6044820152606490fd5b60405162461bcd60e51b815260206004820152601460248201527313195d995b08185b1c9958591e481cdbdb1d995960621b6044820152606490fd5b60405162461bcd60e51b815260206004820152601f60248201527f50726576696f7573206c6576656c206e6f742079657420636f6d706c657465006044820152606490fd5b005b60405162461bcd60e51b815260206004820152602660248201527f43616e206f6e6c7920736f6c76652072756e73206f6e207468652063757272656044820152656e742064617960d01b6064820152608490fd5b60405162461bcd60e51b8152602060048201526012602482015271149d5b88185b1c9958591e481cdbdb1d995960721b6044820152606490fd5b60405162461bcd60e51b815260206004820152602660248201527f4f6e6c7920746865206f776e6572206f66207468652072756e2063616e20736f6044820152651b1d99481a5d60d21b6064820152608490fd5b94506017549460405161174f81612d12565b60006020820152600060408201526000606082015260006080820152606060a08201523381526001431061113557604051876020820152600060408201526000194301406060820152606081528060808101106001600160401b03608083011117611a7a5760808101604052602081519101206060820152856080820152600160401b871015611a7a57600187016017556117e98761323b565b611a90578151815460208401516001600160a81b03199091166001600160a01b03929092169190911790151560a090811b60ff60a01b16919091178255604083015160018301556060830151600283015560808301516003830155820151805190600160401b8211611a7a5760048301548260048501558083106119ca575b50602060049101920160005260206000206000905b8282106118d057505050506060807fbe33ae7a5df03243155e17a5896a63473638d0a5042d1504b59ea59ff0f2b0a5920151604051908982528860208301526040820152a16118cb866138f0565b6106eb565b95839a939b94959892999b979197516118f881511515899060ff801983541691151516179055565b60208101516001890155604081015160028901556060810151600389016000915b600583106119b4575050506080015198600888019660009a5b60068c101561199357600760208260c0600194518d815190558d86858301519101558d600260408301519101558d600360608301519101558d600460808301519101558d600560a0830151910155015160068d01550199019b019a97611932565b50959c9a92989399509550959299603260206001920194019201909161187d565b8051825560019283019290910190602001611919565b6119d390612fb7565b6119dc83612fb7565b906004850160005260206000209182015b81830181106119fd575050611868565b600081556000600182015560006002820155600381015b600882018110611a6e5750600881015b603282018110611a3757506032016119ed565b8060006007925560006001820155600060028201556000600382015560006004820155600060058201556000600682015501611a24565b60008155600101611a14565b634e487b7160e01b600052604160045260246000fd5b634e487b7160e01b600052600060045260246000fd5b60405162461bcd60e51b815260206004820152601260248201527110dbdb9d1c9858dd081a5cc81c185d5cd95960721b6044820152606490fd5b6001600160401b0383351161005657602080602492611b063685883560a4350101612f17565b81520193019290506106b2565b36601f8501121561005657604051611b2a81612d76565b803660808701116100565785905b608087018210611b55575050815260809390930192602001610623565b6020604091611b6436856131ce565b815201910190611b38565b34610056576020366003190112610056576004356001600160401b03811161005657611baa611ba5610680923690600401612f17565b6145ec565b611bb760405180926132d0565bf35b34610056576020366003190112610056576004356001600160a01b0381169081900361005657611be7613364565b600580546001600160a01b031916919091179055005b3461005657602080600319360112610056576004356001600160401b03811161005657611c2e903690600401612f17565b9060405191611c3c83612e1c565b610a40809336903760405190611c5182612e1c565b8336833760005b60528110611c8b575050604051916000835b60528210611c76578585f35b82806001928651815201940191019092611c6a565b80611c99611ca692846133d8565b518160051b8501526133bc565b611c58565b346100565760208060031936011261005657611cd36004611ccc813561323b565b500161350e565b906040519181839283018184528251809152816040850193019160005b828110611cff57505050500390f35b919390838194965051805115158352818101518284015260408101516040840152606080820151908401906000915b60058310611d6257505050600192611d5260806106409301516101008301906130c9565b0195019101918594939192611cf0565b8151815287946001909301929182019101611d2e565b34610056576020806003193601126100565760065460405163295d33a960e21b815260048035908201529190600090839060249082906001600160a01b03165afa91821561121f57600092611de1575b50611ddd6040519282849384528301906132ab565b0390f35b9091503d806000833e611df48183612edf565b8101908281830312610056578051906001600160401b038211610056570181601f82011215610056578051611e28816139e5565b92611e366040519485612edf565b81845284828401011161005657611e5291848085019101613276565b9082611dc8565b346100565760203660031901126100565760043560175481101561005657600560a091601760005202807fc624b66cc0138b8fabc209247f72d758e1cf3343756d543badbf24212bed8c150154907fc624b66cc0138b8fabc209247f72d758e1cf3343756d543badbf24212bed8c16810154907fc624b66cc0138b8fabc209247f72d758e1cf3343756d543badbf24212bed8c187fc624b66cc0138b8fabc209247f72d758e1cf3343756d543badbf24212bed8c178201549101549160ff60405194600180881b0381168652861c1615156020850152604084015260608301526080820152f35b34610056576020366003190112610056576004356001600160a01b0381169081900361005657611f6e613364565b47907fb08889abce443443404b2caf69aa3ccfb9ebfdf1ad2a634d06e11e24c1067938611fbc6000808060405187875af1611fa7613a00565b906040519283926040845260408401906132ab565b9560208301521515940390a3005b34610056576020366003190112610056576004356001600160401b038111610056576120056120006107c0923690600401612f17565b614634565b611bb76040518092613213565b34610056576000366003190112610056576020600454604051908152f35b34610056576000366003190112610056576006546040516001600160a01b039091168152602090f35b34610056576120673661305a565b9160018060a01b031660005260156020526040600020906000526020526040600020906007811015610056576020910154604051908152f35b346100565760203660031901126100565760206120be600435613742565b604051908152f35b346100565760203660031901126100565760043560058110156100565760209060080154604051908152f35b3461005657600036600319011261005657601754600181106111355760209060405190600019018152f35b3461005657602080600319360112610056576004356001600160401b0381116100565761214e903690600401612f17565b906040519161215c83612e00565b610b8080933690376040519061217182612e00565b8336833760005b605c81106121ab575050604051916000835b605c8210612196578585f35b8280600192865181520194019101909261218a565b80611c996121b992846133d8565b612178565b34610056576000366003190112610056576000546040516001600160a01b039091168152602090f35b3461005657602036600319011261005657612200613364565b600480359055005b346100565760003660031901126100565760206040516204f1a08152f35b34610056576000366003190112610056576007546040516001600160a01b039091168152602090f35b3461005657610160366003190112610056576024356001600160a01b0381168103610056573660631215610056576040519061228a82612d76565b608482368211610056576044905b82821061234f5750503660a31215610056576040516122b681612d76565b806101049236841161005657905b83821061233557505036610123121561005657604051916122e483612d76565b826101449136831161005657905b82821061232557505035936001600160401b0385116100565761231c611659953690600401612f17565b93600435613ef5565b81358152602091820191016122f2565b602060409161234436856131ce565b8152019101906122c4565b8135815260209182019101612298565b3461005657602080600319360112610056576004356001600160401b03811161005657612390903690600401612f17565b906040519161239e83612de4565b6102c08093369037604051906123b382612de4565b8336833760005b601681106123ed575050604051916000835b601682106123d8578585f35b828060019286518152019401910190926123cc565b80611c996123fb92846133d8565b6123ba565b3461005657602036600319011261005657600435600381101561005657600e01546040516001600160a01b039091168152602090f35b346100565761244436612fa1565b9060005260166020526040600020600382101561005657602091612467916131be565b905460405160039290921b1c6001600160a01b03168152f35b3461005657600036600319011261005657612499613364565b600080546001600160a01b0319811682556040519082906001600160a01b03167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e08284a3f35b34610056576020366003190112610056576001600160a01b03612500613044565b16600052601460205260606040600020805490600260018201549101549060405192835260208301526040820152f35b3461005657602080600319360112610056576004356001600160401b03811161005657612561903690600401612f17565b906040519161256f83612dc8565b610cc080933690376040519061258482612dc8565b8336833760005b606681106125be575050604051916000835b606682106125a9578585f35b8280600192865181520194019101909261259d565b80611c996125cc92846133d8565b61258b565b3461005657602036600319011261005657600435600381101561005657601101546040516001600160a01b039091168152602090f35b3461005657600036600319011261005657602060ff600354166040519015158152f35b346100565760003660031901126100565760206120be620151804206426133ec565b34610056576020366003190112610056576004356001600160401b03811161005657612687612682610900923690600401612f17565b61467c565b611bb76040518092613196565b34610056576020366003190112610056576004356001600160a01b03811690819003610056576126c2613364565b600780546001600160a01b031916919091179055005b506126e1613084565b61000e565b34610056576101403660031901126100565761270136613135565b60e435906001600160401b03821161005657612724611659923690600401612f17565b9061012435916101043591613b86565b34610056576000366003190112610056576020604051614e208152f35b34610056576101203660031901126100565761276c36613135565b60e4356001600160401b0381116100565760e09161279161279b923690600401612f17565b6101043591613a94565b611bb7604051809260c08091805184526020810151602085015260408101516040850152606081015160608501526080810151608085015260a081015160a08501520151910152565b34610056576105606127fe6127f836612fa1565b906135fa565b61280b60405180936130c9565b610540820152f35b34610056576020366003190112610056576004356001600160401b0381116100565761284e612849610540923690600401612f17565b6145a4565b611bb760405180926130a1565b3461005657600036600319011261005657602060405160148152f35b346100565761288536612fa1565b906000526018602052604060002090600052602052602060018060a01b0360406000205416604051908152f35b346100565760603660031901126100565760206120be604435602435600435613653565b346100565760403660031901126100565760e061279b60243560043561367c565b34610056576000366003190112610056576129106137cf565b62093a80198111611135576120be60209162093a804291016133ec565b346100565761293b3661305a565b90612944613364565b60009081526018602090815260408083209383529290522080546001600160a01b0319166001600160a01b03909216919091179055005b346100565761298936612fa1565b906000526002602052604060002090604051916129a583612d76565b546001600160a01b0380821680855260a09290921c60208501529290156129fc575b6001600160601b0360208201511682600019048111831515166111355760409361271092511692845193845202046020820152f35b50604051612a0981612d76565b600154838116825260a01c60208201526129c7565b34610056576020366003190112610056576004356001600160401b03811161005657612a58612a536040923690600401612f17565b61436a565b82519182526020820152f35b3461005657602036600319011261005657612a7d613044565b612a85613364565b600680546001600160a01b0319166001600160a01b0392909216919091179055005b3461005657600036600319011261005657602060405162093a808152f35b346100565760203660031901126100565760206004612ae4813561323b565b500154604051908152f35b34610056576000366003190112610056576005546040516001600160a01b039091168152602090f35b3461005657602080600319360112610056576004356001600160401b03811161005657612b49903690600401612f17565b9060405191612b5783612dac565b610e00809336903760405190612b6c82612dac565b8336833760005b60708110612ba6575050604051916000835b60708210612b91578585f35b82806001928651815201940191019092612b85565b80611c99612bb492846133d8565b612b73565b346100565760203660031901126100565760043580151580910361005657612bdf613364565b60ff8019600354169116176003556000604051f35b346100565760003660031901126100565760206120be6137cf565b346100565760206120be612c2236612fa1565b9061379e565b346100565760203660031901126100565760043563ffffffff60e01b81168091036100565760209063152a902d60e11b8114908115612c6c57506040519015158152f35b6301ffc9a760e01b14905082610432565b34610056576020366003190112610056576004356001600160401b03811161005657612cb8612cb3610400923690600401612f17565b61454f565b611bb76040518092612f75565b3461005657606036600319011261005657600435612ce5816024356133ec565b8015612cfc576020916120be9160443506906135ee565b634e487b7160e01b600052601260045260246000fd5b60c081019081106001600160401b03821117611a7a57604052565b60a081019081106001600160401b03821117611a7a57604052565b6001600160401b038111611a7a57604052565b606081019081106001600160401b03821117611a7a57604052565b604081019081106001600160401b03821117611a7a57604052565b60e081019081106001600160401b03821117611a7a57604052565b610e0081019081106001600160401b03821117611a7a57604052565b610cc081019081106001600160401b03821117611a7a57604052565b6102c081019081106001600160401b03821117611a7a57604052565b610b8081019081106001600160401b03821117611a7a57604052565b610a4081019081106001600160401b03821117611a7a57604052565b608081019081106001600160401b03821117611a7a57604052565b61040081019081106001600160401b03821117611a7a57604052565b61054081019081106001600160401b03821117611a7a57604052565b61068081019081106001600160401b03821117611a7a57604052565b6107c081019081106001600160401b03821117611a7a57604052565b61090081019081106001600160401b03821117611a7a57604052565b90601f801991011681019081106001600160401b03821117611a7a57604052565b6001600160401b038111611a7a5760051b60200190565b81601f8201121561005657803591612f2e83612f00565b92612f3c6040519485612edf565b808452602092838086019260051b820101928311610056578301905b828210612f66575050505090565b81358152908301908301612f58565b916000915b60209081841015612f9a5790806001928651815201940192019192612f7a565b5050915050565b6040906003190112610056576004359060243590565b7f051eb851eb851eb851eb851eb851eb851eb851eb851eb851eb851eb851eb851e81116001166111355760320290565b8060001904600511811515166111355760050290565b6001600160ff1b0381116001166111355760011b90565b7f333333333333333333333333333333333333333333333333333333333333333381116001166111355760050290565b600435906001600160a01b038216820361005657565b6060906003190112610056576004356001600160a01b038116810361005657906024359060443590565b503461005657600036600319011261005657602060405160028152f35b6000915b602a83106130b257505050565b6001908251815260208091019201920191906130a5565b906000905b600682106130db57505050565b602060e082613129600194875160c08091805184526020810151602085015260408101516040850152606081015160608501526080810151608085015260a081015160a08501520151910152565b019301910190916130ce565b60e0906003190112610056576040519060e082018281106001600160401b03821117611a7a57604052816004358152602435602082015260443560408201526064356060820152608435608082015260a43560a082015260c060c435910152565b6000915b604883106131a757505050565b60019082518152602080910192019201919061319a565b600382101561111f570190600090565b9080601f8301121561005657604051916131e783612d76565b82906040810192831161005657905b8282106132035750505090565b81358152602091820191016131f6565b6000915b603e831061322457505050565b600190825181526020809101920192019190613217565b60175481101561111f576005906017600052027fc624b66cc0138b8fabc209247f72d758e1cf3343756d543badbf24212bed8c150190600090565b918091926000905b82821061329657501161328f575050565b6000910152565b9150806020918301518186015201829161327e565b906020916132c481518092818552858086019101613276565b601f01601f1916010190565b6000915b603483106132e157505050565b6001908251815260208091019201920191906132d4565b81601f820112156100565780359061330f82612f00565b9260409261331f84519586612edf565b808552602091828087019260061b85010193818511610056578301915b84831061334c5750505050505090565b83869161335984866131ce565b81520192019161333c565b6000546001600160a01b0316330361337857565b606460405162461bcd60e51b815260206004820152602060248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e65726044820152fd5b60001981146111355760010190565b80511561111f5760200190565b805182101561111f5760209160051b010190565b818110611135570390565b60405191906000835b600582106134265750505060a082018281106001600160401b03821117611a7a57604052565b6001602081928554815201930191019091613400565b90604080519261344b84612d2d565b8360ff825416151581526001938483015491602092838201526002908185015486820152600361347c8187016133f7565b906060918284015287519761349089612d12565b60009760080195895b6006808b10156134fb57898d926007928651906134b582612d91565b8c548252858d0154848301528b8d015488830152888d01548a83015260048d0154608083015260058d015460a08301528c015460c0820152815201980199019896613499565b5050995050505092505050608091500152565b90815461351a81612f00565b926135286040519485612edf565b818452600090815260208082208186015b848410613547575050505050565b6032836001926135568561343c565b815201920193019290613539565b6040519061357182612d91565b8160c06000918281528260208201528260408201528260608201528260808201528260a08201520152565b604051906135a982612d12565b8160005b60c081106135b9575050565b6020906135c4613564565b81840152016135ad565b90600681101561111f5760051b0190565b61271081198111611135570190565b81198111611135570190565b919061360461359c565b9260005b8281111561362157505060011981116111355760010190565b806136398161363461364e948787613653565b61367c565b61364382886135ce565b5261138d81876135ce565b613608565b916040519160208301938452604083015260608201526060815261367681612e38565b51902090565b61373a90613688613564565b506136a3613694613564565b938085528260c0860152613742565b60a0840152604051906020918281019182528281526136c181612d76565b519020620f424090818106838601526040518381019182528381526136e581612d76565b519020908106604085015260405182810191825282815261370581612d76565b519020614e20916137178383066135df565b606086015260405190808201928352815261373181612d76565b519020066135df565b608082015290565b61378560ff9160066040519161375783612d12565b60248352601b60208401526016604084015260116060840152600c6080840152600760a084015206906135ce565b51166103e8908060001904821181151516611135570290565b9060014310611135576040519060208201928352604082015260001943014060608201526060815261367681612e38565b6204f1a04210611135576137ee62093a806204f19f19420106426133ec565b90565b805482101561111f576000526032602060002091020190600090565b9290611a905761382e829392511515839060ff801983541691151516179055565b6020918284015192600193848301556040948581015193600294858501556060918281015160039081870190896000915b600583106138dc575050505060086080809301519601936000965b6006808910156138ce57815180518855888101518c8901558c8101518b890155838101518589015585810151600489015560a0810151600589015560c001519087015596890196600790950194860161387a565b505050505095505050505050565b80518455928101929101908a90880161385f565b60036138fb8261323b565b50015490600461390a8261323b565b500154600119811161113557600101906040519261392784612d2d565b600084526000602085015260408401926000845260405161394781612d2d565b60a036823760608601526080850161395d61359c565b8152613969828561379e565b855261397582846135fa565b50905260046139838461323b565b5001938454600160401b811015611a7a577f70f3b6a85b7a5047df9e61440f8b6480a7cd8a96f849a4092d0a22303a5dbb0f96610bb58260809860016139cb950181556137f1565b5190604051938452602084015260408301526060820152a1565b6001600160401b038111611a7a57601f01601f191660200190565b3d15613a2b573d90613a11826139e5565b91613a1f6040519384612edf565b82523d6000602084013e565b606090565b8015611135576000190190565b90604051613a4a81612d12565b60a0613a8f6004839560ff8154600180871b0381168752851c16151560208601526001810154604086015260028101546060860152600381015460808601520161350e565b910152565b9190613a9e613564565b50613aa882612fe7565b916005928019841161113557613ac0908401836133d8565b516020850152613acf81612fe7565b801984116111355760011984820111611135576006613aef9101836133d8565b516040850152613afe81612fe7565b801984116111355760021984820111611135576007613b1e9101836133d8565b516060850152613b2d81612fe7565b9081198411611135576003198483011161113557613b516008613b5c9301846133d8565b516080860152612fe7565b91821981116111355760041990830111611135576009613b7d9201906133d8565b5160a082015290565b9291906020928385015190613b9a84613014565b906005918019831161113557613bbb90613bb383612fe7565b9084016135ee565b6002199390848111611135576002613bd49101866133d8565b5103613e4b576040870151613be886613014565b8019841161113557613c0590613bfd84612fe7565b9085016135ee565b600119811161113557846001820111611135576003613c259101866133d8565b5103613e1157606087015196613c3a86613014565b8019841161113557613c4f90613bfd84612fe7565b97848911611135578460028a011161113557613c6f6004809a01876133d8565b5103613dda576080810151613c8387613014565b80198511613dc557613ca090613c9885612fe7565b9086016135ee565b6003198111613dc557856003820111613dc55784613cbf9101876133d8565b5103613d8e5760a0613cd391015195613014565b9081198311613d795790613cea613cf19392612fe7565b91016135ee565b906004198211613d645785820111613d4f57906006613d119201906133d8565b5103613d1b575050565b60405162461bcd60e51b815291820152600e60248201526d496e76616c69642072616469757360901b604482015260649150fd5b601185634e487b7160e01b6000525260246000fd5b601186634e487b7160e01b6000525260246000fd5b601188634e487b7160e01b6000525260246000fd5b60405162461bcd60e51b8152808901889052601060248201526f496e76616c696420766563746f72207960801b6044820152606490fd5b60118a634e487b7160e01b6000525260246000fd5b60405162461bcd60e51b8152808901889052601060248201526f092dcecc2d8d2c840eccac6e8dee440f60831b6044820152606490fd5b60405162461bcd60e51b8152600481018790526012602482015271496e76616c696420706f736974696f6e207960701b6044820152606490fd5b60405162461bcd60e51b8152600481018790526012602482015271092dcecc2d8d2c840e0dee6d2e8d2dedc40f60731b6044820152606490fd5b90816020910312610056575180151581036100565790565b6000915b60028310613eae57505050565b600190825181526020809101920192019190613ea1565b906000905b60028210613ed757505050565b6020604082613ee96001948751613e9d565b01930191019091613eca565b939091929360028114600014613fec57509161050491613f60613f4194613f55613f216020989961454f565b91613f4b6040519a8b998a98630f3022c960e21b8a5260048a0190613e9d565b6044880190613ec5565b60c4860190613e9d565b610104840190612f75565b6001600160a01b03165afa90811561121f57600091613fbe575b5015613f8257565b60405162461bcd60e51b815260206004820152601460248201527324b73b30b634b21019103137b23c90383937b7b360611b6044820152606490fd5b613fdf915060203d8111613fe5575b613fd78183612edf565b810190613e85565b38613f7a565b503d613fcd565b600381036140b75750916106449161403b613f4194614030614010602098996145a4565b91613f4b6040519a8b998a986371dd4db160e11b8a5260048a0190613e9d565b6101048401906130a1565b6001600160a01b03165afa90811561121f57600091614099575b501561405d57565b60405162461bcd60e51b815260206004820152601460248201527324b73b30b634b21019903137b23c90383937b7b360611b6044820152606490fd5b6140b1915060203d8111613fe557613fd78183612edf565b38614055565b929390600495848780961460001461418b57509261410f6107849361410460209794613f4b6140e9613f419b996145ec565b936040519b8c9a8b99632a6d5ed560e01b8b528a0190613e9d565b6101048401906132d0565b6001600160a01b03165afa90811561121f5760009161416d575b50156141325750565b60649060206040519162461bcd60e51b8352820152601460248201527324b73b30b634b2101a103137b23c90383937b7b360611b6044820152fd5b614185915060203d8111613fe557613fd78183612edf565b38614129565b600581036142555750926141d96108c4936141ce60209794613f4b6141b3613f419b99614634565b936040519b8c9a8b9963ea59061d60e01b8b528a0190613e9d565b610104840190613213565b6001600160a01b03165afa90811561121f57600091614237575b50156141fc5750565b60649060206040519162461bcd60e51b8352820152601460248201527324b73b30b634b2101a903137b23c90383937b7b360611b6044820152fd5b61424f915060203d8111613fe557613fd78183612edf565b386141f3565b600691929394955014600014614326576020936142aa613f41969461429f610a0495613f4b6142848c9761467c565b936040519b8c9a8b996311b5352360e01b8b528a0190613e9d565b610104840190613196565b6001600160a01b03165afa90811561121f57600091614308575b50156142cd5750565b60649060206040519162461bcd60e51b8352820152601460248201527324b73b30b634b2101b103137b23c90383937b7b360611b6044820152fd5b614320915060203d8111613fe557613fd78183612edf565b386142c4565b60405162461bcd60e51b8152602081880152601860248201527f496e76616c6964206e756d626572206f6620626f6469657300000000000000006044820152606490fd5b908151600c811061113557600a90600b19010460019081811061113557600019809101916143b860405161439d81612d76565b6009815268189bd91e50dbdd5b9d60ba1b60208201526146ff565b6143c1836146c4565b6000948592815183811061453b57600590818382011061452757908896958594939260051901955b614402575b505050505050906143fe916133ec565b9190565b8351851c86111561452257849596975081810615614437575b61442761442d916133bc565b96613a30565b94958997966143e9565b909192935061444686856133d8565b511580614504575b806144e3575b806144c5575b80614490575b61446f575b908493929161441b565b979061442d614427614483879695946133bc565b9a92939495505050614465565b5060048087106144b057506144a96003198701856133d8565b5115614460565b601190634e487b7160e01b6000525260246000fd5b5060038610611135576144dc6002198701856133d8565b511561445a565b506002861061113557614e206144fd6001198801866133d8565b5114614454565b5084861061113557614e2061451b848801866133d8565b511461444e565b6143ee565b634e487b7160e01b89526011600452602489fd5b634e487b7160e01b88526011600452602488fd5b9060405161455c81612e53565b61040080913690376040519061457182612e53565b36823760005b6020811061458457509150565b8061459261459f92866133d8565b518160051b8401526133bc565b614577565b906040516145b181612e6f565b6105408091369037604051906145c682612e6f565b36823760005b602a81106145d957509150565b806145926145e792866133d8565b6145cc565b906040516145f981612e8b565b61068080913690376040519061460e82612e8b565b36823760005b6034811061462157509150565b8061459261462f92866133d8565b614614565b9060405161464181612ea7565b6107c080913690376040519061465682612ea7565b36823760005b603e811061466957509150565b8061459261467792866133d8565b61465c565b9060405161468981612ec3565b61090080913690376040519061469e82612ec3565b36823760005b604881106146b157509150565b806145926146bf92866133d8565b6146a4565b60008091604051602081019163f82c50f160e01b83526024820152602481526146ec81612d5b565b51906a636f6e736f6c652e6c6f675afa50565b600080916040516146ec8161472d602082019463104c13eb60e21b86526020602484015260448301906132ab565b03601f198101835282612edf56fea26469706673582212201d1e534cd54c747258bc0370ad60097334da8ed5670c570fe6940368a54195ef64736f6c634300080f0033","linkReferences":{},"deployedLinkReferences":{}}');


var $65dedfb414d33d87$exports = {};
$65dedfb414d33d87$exports = JSON.parse('{"address":"0x88d070d211d0C48f29Ef935a608FC44f03dc1B52","chain":{"chainId":84532,"name":"unknown"}}');


var $873972b41cad680d$exports = {};
$873972b41cad680d$exports = JSON.parse('{"address":"0xEd7C419987D0F765F5001f110a5925aD892a83F9","chain":{"chainId":12345,"name":"unknown"}}');


var $e4d77455981ac505$exports = {};
$e4d77455981ac505$exports = JSON.parse('{"_format":"hh-sol-artifact-1","contractName":"Speedruns","sourceName":"contracts/Speedruns.sol","abi":[{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"account","type":"address"},{"indexed":true,"internalType":"address","name":"operator","type":"address"},{"indexed":false,"internalType":"bool","name":"approved","type":"bool"}],"name":"ApprovalForAll","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"operator","type":"address"},{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256[]","name":"ids","type":"uint256[]"},{"indexed":false,"internalType":"uint256[]","name":"values","type":"uint256[]"}],"name":"TransferBatch","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"operator","type":"address"},{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"id","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"TransferSingle","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"string","name":"value","type":"string"},{"indexed":true,"internalType":"uint256","name":"id","type":"uint256"}],"name":"URI","type":"event"},{"stateMutability":"nonpayable","type":"fallback"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"uint256","name":"id","type":"uint256"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"__burn","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"id","type":"uint256"},{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"bytes","name":"data","type":"bytes"}],"name":"__mint","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"},{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"bytes","name":"data","type":"bytes"}],"name":"__safeTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"operator","type":"address"},{"internalType":"bool","name":"approved","type":"bool"}],"name":"__setApprovalForAll","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"},{"internalType":"uint256","name":"id","type":"uint256"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address[]","name":"accounts","type":"address[]"},{"internalType":"uint256[]","name":"ids","type":"uint256[]"}],"name":"balanceOfBatch","outputs":[{"internalType":"uint256[]","name":"","type":"uint256[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32[]","name":"topics","type":"bytes32[]"},{"internalType":"bytes","name":"logData","type":"bytes"}],"name":"emitGenericEvent","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"},{"internalType":"address","name":"operator","type":"address"}],"name":"isApprovedForAll","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256[]","name":"ids","type":"uint256[]"},{"internalType":"uint256[]","name":"amounts","type":"uint256[]"},{"internalType":"bytes","name":"data","type":"bytes"}],"name":"safeBatchTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"},{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"bytes","name":"data","type":"bytes"}],"name":"safeTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"operator","type":"address"},{"internalType":"bool","name":"approved","type":"bool"}],"name":"setApprovalForAll","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes4","name":"interfaceId","type":"bytes4"}],"name":"supportsInterface","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address payable","name":"anybodyProblem_","type":"address"}],"name":"updateAnybodyProblemAddress","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"uri","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"stateMutability":"payable","type":"receive"}],"bytecode":"0x6080346200012657602081016001600160401b03811182821017620001105760405260008091526002546001908181811c9116801562000105575b6020821014620000f157601f8111620000a7575b600283905560038054336001600160a01b03198216811790925560405191906001600160a01b03167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e08684a3611ea190816200012c8239f35b60028352601f0160051c7f405787fa12a823e0f2b7631cc41b3ba8828b3321ca811111fa75cd3aa3bb5ace908101905b818110620000e657506200004e565b8381558201620000d7565b634e487b7160e01b83526022600452602483fd5b90607f16906200003a565b634e487b7160e01b600052604160045260246000fd5b600080fdfe60806040526004361015610030575b3615610028573461002357610021611980565b005b600080fd5b610021611958565b60003560e01c8062fdd58e1461018357806301ffc9a71461017a5780630e89341c146101715780632eb2c2d6146101685780634e1273f41461015f57806356d5f24b146101565780635abc08191461014d578063715018a6146101445780638da5cb5b1461013b57806393ccd31014610132578063a22cb46514610129578063b46f007114610120578063c12e5c6814610117578063e2ce81a51461010e578063e985e9c514610105578063f242432a146100fc5763f2fde38b0361000e576100f7610b06565b61000e565b506100f7610aeb565b506100f7610ab6565b506100f7610a6e565b506100f7610930565b506100f76108be565b506100f761085e565b506100f761071b565b506100f76106f1565b506100f761068c565b506100f761065c565b506100f76105bc565b506100f76104f6565b506100f761042b565b506100f7610283565b506100f76101e3565b506100f761019d565b6001600160a01b0381160361002357565b50346100235760403660031901126100235760206101c96004356101c08161018c565b60243590610c33565b604051908152f35b6001600160e01b031981160361002357565b503461002357602036600319011261002357602061020b600435610206816101d1565b611b75565b6040519015158152f35b918091926000905b82821061023557501161022e575050565b6000910152565b9150806020918301518186015201829161021d565b9060209161026381518092818552858086019101610215565b601f01601f1916010190565b90602061028092818152019061024a565b90565b5034610023576020366003190112610023576102b76102a3600435611a0a565b60405191829160208352602083019061024a565b0390f35b50634e487b7160e01b600052604160045260246000fd5b606081019081106001600160401b038211176102ed57604052565b6102f56102bb565b604052565b608081019081106001600160401b038211176102ed57604052565b90601f801991011681019081106001600160401b038211176102ed57604052565b6020906001600160401b03811161034f575b60051b0190565b6103576102bb565b610348565b81601f820112156100235780359161037383610336565b926103816040519485610315565b808452602092838086019260051b820101928311610023578301905b8282106103ab575050505090565b8135815290830190830161039d565b6020906001600160401b0381116103d7575b601f01601f19160190565b6103df6102bb565b6103cc565b81601f82011215610023578035906103fb826103ba565b926104096040519485610315565b8284526020838301011161002357816000926020809301838601378301015290565b50346100235760a0366003190112610023576004356104498161018c565b602435906104568261018c565b6001600160401b03916044358381116100235761047790369060040161035c565b6064358481116100235761048f90369060040161035c565b91608435948511610023576104ab6100219536906004016103e4565b93610e88565b90815180825260208080930193019160005b8281106104d1575050505090565b8351855293810193928101926001016104c3565b9060206102809281815201906104b1565b5034610023576040366003190112610023576004356001600160401b03808211610023573660238301121561002357816004013561053381610336565b926105416040519485610315565b81845260209160248386019160051b8301019136831161002357602401905b8282106105995785602435868111610023576102b79161058761058d92369060040161035c565b90610d5d565b604051918291826104e5565b83809183356105a78161018c565b815201910190610560565b8015150361002357565b5034610023576060366003190112610023576100216004356105dd8161018c565b6024356105e98161018c565b604435916105f6836105b2565b61060b60018060a01b036004541633146113af565b611810565b60a0600319820112610023576004356106288161018c565b916024356106358161018c565b916044359160643591608435906001600160401b03821161002357610280916004016103e4565b50346100235761002161066e36610610565b9361068760018060a09694961b036004541633146113af565b61160b565b5034610023576000806003193601126106ee576106a7610bdb565b600380546001600160a01b031981169091556040519082906001600160a01b03167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e08284a3f35b80fd5b5034610023576000366003190112610023576003546040516001600160a01b039091168152602090f35b5034610023576080366003190112610023576004356107398161018c565b6024356044356064356001600160401b0381116100235761075e9036906004016103e4565b9160018060a01b03610775816004541633146113af565b841693841561080f576100219461078b83611533565b5061079584611533565b506107c5826107ae856000526000602052604060002090565b9060018060a01b0316600052602052604060002090565b6107d08582546110d0565b9055604080518481526020810186905260009133917fc3d58168c5ae7397731d063d5bbf3d657854427343f4c083240f7aacaa2d0f629190a43361145f565b60405162461bcd60e51b815260206004820152602160248201527f455243313135353a206d696e7420746f20746865207a65726f206164647265736044820152607360f81b6064820152608490fd5b50346100235760403660031901126100235761002160043561087f8161018c565b6024359061088c826105b2565b611ca4565b9181601f84011215610023578235916001600160401b038311610023576020838186019501011161002357565b5034610023576040366003190112610023576004356001600160401b03808211610023573660238301121561002357816004013591818311610023573660248460051b830101116100235760243591821161002357610021926109276024933690600401610891565b93909201611d97565b50346100235760603660031901126100235760043561094e8161018c565b6024356044359060018060a01b0361096b816004541633146113af565b8316918215610a1d57610a127fc3d58168c5ae7397731d063d5bbf3d657854427343f4c083240f7aacaa2d0f62916000956109a585611533565b506109af82611533565b506109b8611582565b506109f8826109d5836107ae896000526000602052604060002090565b546109e2828210156115b3565b03916107ae876000526000602052604060002090565b556040805194855260208501919091523393918291820190565b0390a4610021611582565b60405162461bcd60e51b815260206004820152602360248201527f455243313135353a206275726e2066726f6d20746865207a65726f206164647260448201526265737360e81b6064820152608490fd5b503461002357602036600319011261002357600435610a8c8161018c565b610a94610bdb565b600480546001600160a01b0319166001600160a01b0392909216919091179055005b503461002357604036600319011261002357602061020b600435610ad98161018c565b60243590610ae68261018c565b611c15565b503461002357610021610afd36610610565b93929092611d04565b503461002357602036600319011261002357600435610b248161018c565b610b2c610bdb565b6001600160a01b03908116908115610b875760009160035491816bffffffffffffffffffffffff60a01b84161760035560405192167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e08484a3f35b60405162461bcd60e51b815260206004820152602660248201527f4f776e61626c653a206e6577206f776e657220697320746865207a65726f206160448201526564647265737360d01b6064820152608490fd5b6003546001600160a01b03163303610bef57565b606460405162461bcd60e51b815260206004820152602060248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e65726044820152fd5b6001600160a01b03811615610c67576000918252602082815260408084206001600160a01b03909316845291905290205490565b60405162461bcd60e51b815260206004820152602a60248201527f455243313135353a2061646472657373207a65726f206973206e6f742061207660448201526930b634b21037bbb732b960b11b6064820152608490fd5b90610cc982610336565b610cd66040519182610315565b8281528092610ce7601f1991610336565b0190602036910137565b50634e487b7160e01b600052601160045260246000fd5b6001906000198114610d18570190565b610d20610cf1565b0190565b50634e487b7160e01b600052603260045260246000fd5b6020918151811015610d50575b60051b010190565b610d58610d24565b610d48565b9190918051835103610dce57610d738151610cbf565b9060005b8151811015610dc75780610db2610da1610d94610dc29486610d3b565b516001600160a01b031690565b610dab8389610d3b565b5190610c33565b610dbc8286610d3b565b52610d08565b610d77565b5090925050565b60405162461bcd60e51b815260206004820152602960248201527f455243313135353a206163636f756e747320616e6420696473206c656e677468604482015268040dad2e6dac2e8c6d60bb1b6064820152608490fd5b15610e2c57565b60405162461bcd60e51b815260206004820152602e60248201527f455243313135353a2063616c6c6572206973206e6f7420746f6b656e206f776e60448201526d195c881bdc88185c1c1c9bdd995960921b6064820152608490fd5b6001600160a01b0380821696919592949392903388148015610fa5575b610eae90610e25565b610ebb8451865114610fba565b8516610ec8811515611017565b60005b8451811015610f5f578088610f53610f4b8a6107ae8b610ef987610ef2610f5a9a8f610d3b565b5192610d3b565b5195610f3a87610f17836107ae866000526000602052604060002090565b54610f2482821015611071565b03916107ae846000526000602052604060002090565b556000526000602052604060002090565b9182546110d0565b9055610d08565b610ecb565b50610fa396919592976040517f4a39dc06d4c0dbc64b70af90fd698a233a518aa5d07e595d983b8c0526c8f7fb339180610f9a8a8a836110dc565b0390a43361128e565b565b50610eae610fb33389611c15565b9050610ea5565b15610fc157565b60405162461bcd60e51b815260206004820152602860248201527f455243313135353a2069647320616e6420616d6f756e7473206c656e677468206044820152670dad2e6dac2e8c6d60c31b6064820152608490fd5b1561101e57565b60405162461bcd60e51b815260206004820152602560248201527f455243313135353a207472616e7366657220746f20746865207a65726f206164604482015264647265737360d81b6064820152608490fd5b1561107857565b60405162461bcd60e51b815260206004820152602a60248201527f455243313135353a20696e73756666696369656e742062616c616e636520666f60448201526939103a3930b739b332b960b11b6064820152608490fd5b81198111610d18570190565b90916110f3610280936040845260408401906104b1565b9160208184039101526104b1565b908160209103126100235751610280816101d1565b93906102809593611148916111569460018060a01b03809216885216602087015260a0604087015260a08601906104b1565b9084820360608601526104b1565b91608081840391015261024a565b60809060208152602860208201527f455243313135353a204552433131353552656365697665722072656a656374656040820152676420746f6b656e7360c01b60608201520190565b60009060033d116111ba57565b905060046000803e60005160e01c90565b600060443d1061028057604051600319913d83016004833e81516001600160401b03918282113d60248401111761122857818401948551938411611230573d85010160208487010111611228575061028092910160200190610315565b949350505050565b50949350505050565b60809060208152603460208201527f455243313135353a207472616e7366657220746f206e6f6e2d455243313135356040820152732932b1b2b4bb32b91034b6b83632b6b2b73a32b960611b60608201520190565b9493919092813b6112a2575b505050505050565b60006020946112c96040519788968795869463bc197c8160e01b9c8d875260048701611116565b03926001600160a01b03165af16000918161137f575b5061135757505060016112f06111ad565b6308c379a014611328575b61130b575b38808080808061129a565b60405162461bcd60e51b81528061132460048201611239565b0390fd5b6113306111cb565b8061133b57506112fb565b60405162461bcd60e51b8152908190611324906004830161026f565b6001600160e01b031916146113005760405162461bcd60e51b81528061132460048201611164565b6113a191925060203d81116113a8575b6113998183610315565b810190611101565b90386112df565b503d61138f565b156113b657565b60405162461bcd60e51b815260206004820152601d60248201527f4f6e6c7920416e79626f64792050726f626c656d2063616e2063616c6c0000006044820152606490fd5b909260a0926102809594600180861b031683526000602084015260408301526060820152816080820152019061024a565b919261028095949160a094600180871b03809216855216602084015260408301526060820152816080820152019061024a565b9390803b61146f575b5050505050565b6114979360006020946040519687958694859363f23a6e6160e01b9b8c8652600486016113fb565b03926001600160a01b03165af160009181611513575b506114eb57505060016114be6111ad565b6308c379a0146114d8575b61130b575b3880808080611468565b6114e06111cb565b8061133b57506114c9565b6001600160e01b031916146114ce5760405162461bcd60e51b81528061132460048201611164565b61152c91925060203d81116113a8576113998183610315565b90386114ad565b60405190604082018281106001600160401b03821117611575575b60405260018252602082016020368237825115611569575290565b611571610d24565b5290565b61157d6102bb565b61154e565b60405190602082018281106001600160401b038211176115a6575b60405260008252565b6115ae6102bb565b61159d565b156115ba57565b60405162461bcd60e51b8152602060048201526024808201527f455243313135353a206275726e20616d6f756e7420657863656564732062616c604482015263616e636560e01b6064820152608490fd5b6001600160a01b039485831694919391929190611629861515611017565b61163282611533565b5061163c84611533565b50600095828752602093878552816040998761166c8a8d8d209060018060a01b0316600052602052604060002090565b5461167982821015611071565b878c528b89520361169e8a8d8d209060018060a01b0316600052602052604060002090565b55858a528987528a8a206001600160a01b0384166000908152602091909152604090206116cc8982546110d0565b90558a51868152602081018990529089169033907fc3d58168c5ae7397731d063d5bbf3d657854427343f4c083240f7aacaa2d0f6290604090a43b611716575b5050505050505050565b61173c948785948a519788958694859363f23a6e6160e01b9c8d8652336004870161142c565b03925af191829185936117f1575b50506117c357505060019061175d6111ad565b6308c379a014611793575b5061177c57505b388080808080808061170c565b5162461bcd60e51b81528061132460048201611239565b61179b6111cb565b90816117a75750611768565b50825162461bcd60e51b8152908190611324906004830161026f565b6001600160e01b0319160390506117da575061176f565b5162461bcd60e51b81528061132460048201611164565b611808929350803d106113a8576113998183610315565b90388061174a565b6001600160a01b038083169390821692908385146118855761186b6020926107ae7f17307eab39ab6107e8899845ad3d59bd9653f200f220920489ca2b5937696c319560018060a01b03166000526001602052604060002090565b9015159060ff1981541660ff8316179055604051908152a3565b60405162461bcd60e51b815260206004820152602960248201527f455243313135353a2073657474696e6720617070726f76616c20737461747573604482015268103337b91039b2b63360b91b6064820152608490fd5b3d15611907573d906118ed826103ba565b916118fb6040519384610315565b82523d6000602084013e565b606090565b1561191357565b60405162461bcd60e51b815260206004820152601d60248201527f43616c6c20746f20616e79626f647950726f626c656d206661696c65640000006044820152606490fd5b610fa36000808060018060a01b03600454166040519034905af161197a6118dc565b5061190c565b610fa360008060018060a01b036004541660405136838237828136810182815203925af161197a6118dc565b602081830312610023578051906001600160401b038211610023570181601f820112156100235780516119de816103ba565b926119ec6040519485610315565b81845260208284010111610023576102809160208085019101610215565b9060018060a01b0360045416916040519060209182810191631649ecf760e31b8352602482015260248152611a3e816102d2565b6000948592839251915afa90611a526118dc565b9115611a6b5761028092935080825183010191016119ac565b9050604051908360025460019281841c93808316928315611b56575b8286108414611b425797869798611aa48789989960209181520190565b94908115611b215750600114611ac5575b5050505061028092500382610315565b60026000527f405787fa12a823e0f2b7631cc41b3ba8828b3321ca811111fa75cd3aa3bb5ace9690945091905b828510611b0b5750505061028093500138808080611ab5565b8654858501529586019587955093810193611af2565b93505050506102809491925060ff19168252151560051b0138808080611ab5565b634e487b7160e01b89526022600452602489fd5b94607f1694611a87565b908160209103126100235751610280816105b2565b60008060018060a01b0360045416604051936020850190637b7de1cd60e11b825263ffffffff60e01b169485602482015260248152611bb3816102d2565b51915afa611bbf6118dc565b9015611bd957610280915060208082518301019101611b60565b50636cdb3d1360e11b8114908115611c04575b8115611bf6575090565b6301ffc9a760e01b14919050565b6303a24d0760e21b81149150611bec565b9060008060018060a01b038060045416906040516020810191630bd1274f60e31b835280881660248301528616604482015260448152611c54816102fa565b51915afa90611c616118dc565b9115611c7c5750610280915060208082518301019101611b60565b611c9f91506107ae60ff9360018060a01b03166000526001602052604060002090565b541690565b9060008060018060a01b0380600454169082604051602081019263ceab69ff60e01b845288166024820152861515604482015260448152611ce4816102fa565b51925af1611cf06118dc565b5015611cfa575050565b610fa39133611810565b92919060008060018060a01b03968682611d41611d4f8b60045416946040519283918c8c8c6020860199634a940b5f60e11b8b526024870161142c565b03601f198101835282610315565b51925af193611d5c6118dc565b9415611d6a57505050505050565b610fa395811633148015611d82575b61068790610e25565b50610687611d903383611c15565b9050611d79565b90929192611db060018060a01b036004541633146113af565b60048111611e3457826040519485378383016040528015611e2e5780600114611e285780600214611e1a5780600314611e0657600414611def57505050565b6060810135926040820135926020830135923591a4565b5090916040820135926020830135923591a3565b5091906020830135923591a2565b503591a1565b505090a0565b60405162461bcd60e51b815260206004820152600f60248201526e546f6f206d616e7920746f7069637360881b6044820152606490fdfea26469706673582212200f50e1f41d5554fcc2b74696e75b168a1261a29643ba2be76b7e6dc7505ac7cd64736f6c634300080f0033","deployedBytecode":"0x60806040526004361015610030575b3615610028573461002357610021611980565b005b600080fd5b610021611958565b60003560e01c8062fdd58e1461018357806301ffc9a71461017a5780630e89341c146101715780632eb2c2d6146101685780634e1273f41461015f57806356d5f24b146101565780635abc08191461014d578063715018a6146101445780638da5cb5b1461013b57806393ccd31014610132578063a22cb46514610129578063b46f007114610120578063c12e5c6814610117578063e2ce81a51461010e578063e985e9c514610105578063f242432a146100fc5763f2fde38b0361000e576100f7610b06565b61000e565b506100f7610aeb565b506100f7610ab6565b506100f7610a6e565b506100f7610930565b506100f76108be565b506100f761085e565b506100f761071b565b506100f76106f1565b506100f761068c565b506100f761065c565b506100f76105bc565b506100f76104f6565b506100f761042b565b506100f7610283565b506100f76101e3565b506100f761019d565b6001600160a01b0381160361002357565b50346100235760403660031901126100235760206101c96004356101c08161018c565b60243590610c33565b604051908152f35b6001600160e01b031981160361002357565b503461002357602036600319011261002357602061020b600435610206816101d1565b611b75565b6040519015158152f35b918091926000905b82821061023557501161022e575050565b6000910152565b9150806020918301518186015201829161021d565b9060209161026381518092818552858086019101610215565b601f01601f1916010190565b90602061028092818152019061024a565b90565b5034610023576020366003190112610023576102b76102a3600435611a0a565b60405191829160208352602083019061024a565b0390f35b50634e487b7160e01b600052604160045260246000fd5b606081019081106001600160401b038211176102ed57604052565b6102f56102bb565b604052565b608081019081106001600160401b038211176102ed57604052565b90601f801991011681019081106001600160401b038211176102ed57604052565b6020906001600160401b03811161034f575b60051b0190565b6103576102bb565b610348565b81601f820112156100235780359161037383610336565b926103816040519485610315565b808452602092838086019260051b820101928311610023578301905b8282106103ab575050505090565b8135815290830190830161039d565b6020906001600160401b0381116103d7575b601f01601f19160190565b6103df6102bb565b6103cc565b81601f82011215610023578035906103fb826103ba565b926104096040519485610315565b8284526020838301011161002357816000926020809301838601378301015290565b50346100235760a0366003190112610023576004356104498161018c565b602435906104568261018c565b6001600160401b03916044358381116100235761047790369060040161035c565b6064358481116100235761048f90369060040161035c565b91608435948511610023576104ab6100219536906004016103e4565b93610e88565b90815180825260208080930193019160005b8281106104d1575050505090565b8351855293810193928101926001016104c3565b9060206102809281815201906104b1565b5034610023576040366003190112610023576004356001600160401b03808211610023573660238301121561002357816004013561053381610336565b926105416040519485610315565b81845260209160248386019160051b8301019136831161002357602401905b8282106105995785602435868111610023576102b79161058761058d92369060040161035c565b90610d5d565b604051918291826104e5565b83809183356105a78161018c565b815201910190610560565b8015150361002357565b5034610023576060366003190112610023576100216004356105dd8161018c565b6024356105e98161018c565b604435916105f6836105b2565b61060b60018060a01b036004541633146113af565b611810565b60a0600319820112610023576004356106288161018c565b916024356106358161018c565b916044359160643591608435906001600160401b03821161002357610280916004016103e4565b50346100235761002161066e36610610565b9361068760018060a09694961b036004541633146113af565b61160b565b5034610023576000806003193601126106ee576106a7610bdb565b600380546001600160a01b031981169091556040519082906001600160a01b03167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e08284a3f35b80fd5b5034610023576000366003190112610023576003546040516001600160a01b039091168152602090f35b5034610023576080366003190112610023576004356107398161018c565b6024356044356064356001600160401b0381116100235761075e9036906004016103e4565b9160018060a01b03610775816004541633146113af565b841693841561080f576100219461078b83611533565b5061079584611533565b506107c5826107ae856000526000602052604060002090565b9060018060a01b0316600052602052604060002090565b6107d08582546110d0565b9055604080518481526020810186905260009133917fc3d58168c5ae7397731d063d5bbf3d657854427343f4c083240f7aacaa2d0f629190a43361145f565b60405162461bcd60e51b815260206004820152602160248201527f455243313135353a206d696e7420746f20746865207a65726f206164647265736044820152607360f81b6064820152608490fd5b50346100235760403660031901126100235761002160043561087f8161018c565b6024359061088c826105b2565b611ca4565b9181601f84011215610023578235916001600160401b038311610023576020838186019501011161002357565b5034610023576040366003190112610023576004356001600160401b03808211610023573660238301121561002357816004013591818311610023573660248460051b830101116100235760243591821161002357610021926109276024933690600401610891565b93909201611d97565b50346100235760603660031901126100235760043561094e8161018c565b6024356044359060018060a01b0361096b816004541633146113af565b8316918215610a1d57610a127fc3d58168c5ae7397731d063d5bbf3d657854427343f4c083240f7aacaa2d0f62916000956109a585611533565b506109af82611533565b506109b8611582565b506109f8826109d5836107ae896000526000602052604060002090565b546109e2828210156115b3565b03916107ae876000526000602052604060002090565b556040805194855260208501919091523393918291820190565b0390a4610021611582565b60405162461bcd60e51b815260206004820152602360248201527f455243313135353a206275726e2066726f6d20746865207a65726f206164647260448201526265737360e81b6064820152608490fd5b503461002357602036600319011261002357600435610a8c8161018c565b610a94610bdb565b600480546001600160a01b0319166001600160a01b0392909216919091179055005b503461002357604036600319011261002357602061020b600435610ad98161018c565b60243590610ae68261018c565b611c15565b503461002357610021610afd36610610565b93929092611d04565b503461002357602036600319011261002357600435610b248161018c565b610b2c610bdb565b6001600160a01b03908116908115610b875760009160035491816bffffffffffffffffffffffff60a01b84161760035560405192167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e08484a3f35b60405162461bcd60e51b815260206004820152602660248201527f4f776e61626c653a206e6577206f776e657220697320746865207a65726f206160448201526564647265737360d01b6064820152608490fd5b6003546001600160a01b03163303610bef57565b606460405162461bcd60e51b815260206004820152602060248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e65726044820152fd5b6001600160a01b03811615610c67576000918252602082815260408084206001600160a01b03909316845291905290205490565b60405162461bcd60e51b815260206004820152602a60248201527f455243313135353a2061646472657373207a65726f206973206e6f742061207660448201526930b634b21037bbb732b960b11b6064820152608490fd5b90610cc982610336565b610cd66040519182610315565b8281528092610ce7601f1991610336565b0190602036910137565b50634e487b7160e01b600052601160045260246000fd5b6001906000198114610d18570190565b610d20610cf1565b0190565b50634e487b7160e01b600052603260045260246000fd5b6020918151811015610d50575b60051b010190565b610d58610d24565b610d48565b9190918051835103610dce57610d738151610cbf565b9060005b8151811015610dc75780610db2610da1610d94610dc29486610d3b565b516001600160a01b031690565b610dab8389610d3b565b5190610c33565b610dbc8286610d3b565b52610d08565b610d77565b5090925050565b60405162461bcd60e51b815260206004820152602960248201527f455243313135353a206163636f756e747320616e6420696473206c656e677468604482015268040dad2e6dac2e8c6d60bb1b6064820152608490fd5b15610e2c57565b60405162461bcd60e51b815260206004820152602e60248201527f455243313135353a2063616c6c6572206973206e6f7420746f6b656e206f776e60448201526d195c881bdc88185c1c1c9bdd995960921b6064820152608490fd5b6001600160a01b0380821696919592949392903388148015610fa5575b610eae90610e25565b610ebb8451865114610fba565b8516610ec8811515611017565b60005b8451811015610f5f578088610f53610f4b8a6107ae8b610ef987610ef2610f5a9a8f610d3b565b5192610d3b565b5195610f3a87610f17836107ae866000526000602052604060002090565b54610f2482821015611071565b03916107ae846000526000602052604060002090565b556000526000602052604060002090565b9182546110d0565b9055610d08565b610ecb565b50610fa396919592976040517f4a39dc06d4c0dbc64b70af90fd698a233a518aa5d07e595d983b8c0526c8f7fb339180610f9a8a8a836110dc565b0390a43361128e565b565b50610eae610fb33389611c15565b9050610ea5565b15610fc157565b60405162461bcd60e51b815260206004820152602860248201527f455243313135353a2069647320616e6420616d6f756e7473206c656e677468206044820152670dad2e6dac2e8c6d60c31b6064820152608490fd5b1561101e57565b60405162461bcd60e51b815260206004820152602560248201527f455243313135353a207472616e7366657220746f20746865207a65726f206164604482015264647265737360d81b6064820152608490fd5b1561107857565b60405162461bcd60e51b815260206004820152602a60248201527f455243313135353a20696e73756666696369656e742062616c616e636520666f60448201526939103a3930b739b332b960b11b6064820152608490fd5b81198111610d18570190565b90916110f3610280936040845260408401906104b1565b9160208184039101526104b1565b908160209103126100235751610280816101d1565b93906102809593611148916111569460018060a01b03809216885216602087015260a0604087015260a08601906104b1565b9084820360608601526104b1565b91608081840391015261024a565b60809060208152602860208201527f455243313135353a204552433131353552656365697665722072656a656374656040820152676420746f6b656e7360c01b60608201520190565b60009060033d116111ba57565b905060046000803e60005160e01c90565b600060443d1061028057604051600319913d83016004833e81516001600160401b03918282113d60248401111761122857818401948551938411611230573d85010160208487010111611228575061028092910160200190610315565b949350505050565b50949350505050565b60809060208152603460208201527f455243313135353a207472616e7366657220746f206e6f6e2d455243313135356040820152732932b1b2b4bb32b91034b6b83632b6b2b73a32b960611b60608201520190565b9493919092813b6112a2575b505050505050565b60006020946112c96040519788968795869463bc197c8160e01b9c8d875260048701611116565b03926001600160a01b03165af16000918161137f575b5061135757505060016112f06111ad565b6308c379a014611328575b61130b575b38808080808061129a565b60405162461bcd60e51b81528061132460048201611239565b0390fd5b6113306111cb565b8061133b57506112fb565b60405162461bcd60e51b8152908190611324906004830161026f565b6001600160e01b031916146113005760405162461bcd60e51b81528061132460048201611164565b6113a191925060203d81116113a8575b6113998183610315565b810190611101565b90386112df565b503d61138f565b156113b657565b60405162461bcd60e51b815260206004820152601d60248201527f4f6e6c7920416e79626f64792050726f626c656d2063616e2063616c6c0000006044820152606490fd5b909260a0926102809594600180861b031683526000602084015260408301526060820152816080820152019061024a565b919261028095949160a094600180871b03809216855216602084015260408301526060820152816080820152019061024a565b9390803b61146f575b5050505050565b6114979360006020946040519687958694859363f23a6e6160e01b9b8c8652600486016113fb565b03926001600160a01b03165af160009181611513575b506114eb57505060016114be6111ad565b6308c379a0146114d8575b61130b575b3880808080611468565b6114e06111cb565b8061133b57506114c9565b6001600160e01b031916146114ce5760405162461bcd60e51b81528061132460048201611164565b61152c91925060203d81116113a8576113998183610315565b90386114ad565b60405190604082018281106001600160401b03821117611575575b60405260018252602082016020368237825115611569575290565b611571610d24565b5290565b61157d6102bb565b61154e565b60405190602082018281106001600160401b038211176115a6575b60405260008252565b6115ae6102bb565b61159d565b156115ba57565b60405162461bcd60e51b8152602060048201526024808201527f455243313135353a206275726e20616d6f756e7420657863656564732062616c604482015263616e636560e01b6064820152608490fd5b6001600160a01b039485831694919391929190611629861515611017565b61163282611533565b5061163c84611533565b50600095828752602093878552816040998761166c8a8d8d209060018060a01b0316600052602052604060002090565b5461167982821015611071565b878c528b89520361169e8a8d8d209060018060a01b0316600052602052604060002090565b55858a528987528a8a206001600160a01b0384166000908152602091909152604090206116cc8982546110d0565b90558a51868152602081018990529089169033907fc3d58168c5ae7397731d063d5bbf3d657854427343f4c083240f7aacaa2d0f6290604090a43b611716575b5050505050505050565b61173c948785948a519788958694859363f23a6e6160e01b9c8d8652336004870161142c565b03925af191829185936117f1575b50506117c357505060019061175d6111ad565b6308c379a014611793575b5061177c57505b388080808080808061170c565b5162461bcd60e51b81528061132460048201611239565b61179b6111cb565b90816117a75750611768565b50825162461bcd60e51b8152908190611324906004830161026f565b6001600160e01b0319160390506117da575061176f565b5162461bcd60e51b81528061132460048201611164565b611808929350803d106113a8576113998183610315565b90388061174a565b6001600160a01b038083169390821692908385146118855761186b6020926107ae7f17307eab39ab6107e8899845ad3d59bd9653f200f220920489ca2b5937696c319560018060a01b03166000526001602052604060002090565b9015159060ff1981541660ff8316179055604051908152a3565b60405162461bcd60e51b815260206004820152602960248201527f455243313135353a2073657474696e6720617070726f76616c20737461747573604482015268103337b91039b2b63360b91b6064820152608490fd5b3d15611907573d906118ed826103ba565b916118fb6040519384610315565b82523d6000602084013e565b606090565b1561191357565b60405162461bcd60e51b815260206004820152601d60248201527f43616c6c20746f20616e79626f647950726f626c656d206661696c65640000006044820152606490fd5b610fa36000808060018060a01b03600454166040519034905af161197a6118dc565b5061190c565b610fa360008060018060a01b036004541660405136838237828136810182815203925af161197a6118dc565b602081830312610023578051906001600160401b038211610023570181601f820112156100235780516119de816103ba565b926119ec6040519485610315565b81845260208284010111610023576102809160208085019101610215565b9060018060a01b0360045416916040519060209182810191631649ecf760e31b8352602482015260248152611a3e816102d2565b6000948592839251915afa90611a526118dc565b9115611a6b5761028092935080825183010191016119ac565b9050604051908360025460019281841c93808316928315611b56575b8286108414611b425797869798611aa48789989960209181520190565b94908115611b215750600114611ac5575b5050505061028092500382610315565b60026000527f405787fa12a823e0f2b7631cc41b3ba8828b3321ca811111fa75cd3aa3bb5ace9690945091905b828510611b0b5750505061028093500138808080611ab5565b8654858501529586019587955093810193611af2565b93505050506102809491925060ff19168252151560051b0138808080611ab5565b634e487b7160e01b89526022600452602489fd5b94607f1694611a87565b908160209103126100235751610280816105b2565b60008060018060a01b0360045416604051936020850190637b7de1cd60e11b825263ffffffff60e01b169485602482015260248152611bb3816102d2565b51915afa611bbf6118dc565b9015611bd957610280915060208082518301019101611b60565b50636cdb3d1360e11b8114908115611c04575b8115611bf6575090565b6301ffc9a760e01b14919050565b6303a24d0760e21b81149150611bec565b9060008060018060a01b038060045416906040516020810191630bd1274f60e31b835280881660248301528616604482015260448152611c54816102fa565b51915afa90611c616118dc565b9115611c7c5750610280915060208082518301019101611b60565b611c9f91506107ae60ff9360018060a01b03166000526001602052604060002090565b541690565b9060008060018060a01b0380600454169082604051602081019263ceab69ff60e01b845288166024820152861515604482015260448152611ce4816102fa565b51925af1611cf06118dc565b5015611cfa575050565b610fa39133611810565b92919060008060018060a01b03968682611d41611d4f8b60045416946040519283918c8c8c6020860199634a940b5f60e11b8b526024870161142c565b03601f198101835282610315565b51925af193611d5c6118dc565b9415611d6a57505050505050565b610fa395811633148015611d82575b61068790610e25565b50610687611d903383611c15565b9050611d79565b90929192611db060018060a01b036004541633146113af565b60048111611e3457826040519485378383016040528015611e2e5780600114611e285780600214611e1a5780600314611e0657600414611def57505050565b6060810135926040820135926020830135923591a4565b5090916040820135926020830135923591a3565b5091906020830135923591a2565b503591a1565b505090a0565b60405162461bcd60e51b815260206004820152600f60248201526e546f6f206d616e7920746f7069637360881b6044820152606490fdfea26469706673582212200f50e1f41d5554fcc2b74696e75b168a1261a29643ba2be76b7e6dc7505ac7cd64736f6c634300080f0033","linkReferences":{},"deployedLinkReferences":{}}');


var $4d9f72d46483e98d$exports = {};
$4d9f72d46483e98d$exports = JSON.parse('{"address":"0xd28e9E8Ddcb512a0BF4bFCf80BCB802Bc2C109dc","chain":{"chainId":84532,"name":"unknown"}}');


var $9d02f3f8b4863df1$exports = {};
$9d02f3f8b4863df1$exports = JSON.parse('{"address":"0x2C05F9a7dE1EA42Ab57fce1B25565C085728D0af","chain":{"chainId":12345,"name":"unknown"}}');


const $cc3991c226a3f988$export$3f0c1cee0e40865b = {
    abi: (0, (/*@__PURE__*/$parcel$interopDefault($c4098317b891c28e$exports))),
    networks: {
        84532: (0, (/*@__PURE__*/$parcel$interopDefault($65dedfb414d33d87$exports))),
        12345: (0, (/*@__PURE__*/$parcel$interopDefault($873972b41cad680d$exports)))
    }
};
const $cc3991c226a3f988$export$67258bae168725a6 = {
    abi: (0, (/*@__PURE__*/$parcel$interopDefault($e4d77455981ac505$exports))),
    networks: {
        84532: (0, (/*@__PURE__*/$parcel$interopDefault($4d9f72d46483e98d$exports))),
        12345: (0, (/*@__PURE__*/$parcel$interopDefault($9d02f3f8b4863df1$exports)))
    }
};




export {$ac5f4ce0676496f6$export$52baafc80d354d7 as Anybody, $cc3991c226a3f988$export$3f0c1cee0e40865b as AnybodyProblem, $cc3991c226a3f988$export$67258bae168725a6 as Speedruns};
//# sourceMappingURL=module.js.map
