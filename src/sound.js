import * as Tone from 'tone'
const {
  Player,
  PanVol,
  Panner,
  Reverb,
  Compressor,
  Volume,
  Loop,
  start,
  loaded
} = Tone

import whistle_8_T7 from 'data-url:/public/sound/whistle/whistle_8_T7.mp3'
import whistle_4_T3 from 'data-url:/public/sound/whistle/whistle_4_T3.mp3'
import whistle_7_T6 from 'data-url:/public/sound/whistle/whistle_7_T6.mp3'
import whistle_12_T11 from 'data-url:/public/sound/whistle/whistle_12_T11.mp3'
import whistle_8_T7_B from 'data-url:/public/sound/whistle/whistle_8_T7_B.mp3'
import wii_2_T1 from 'data-url:/public/sound/wii/wii_2_T1.mp3'
import wii_4_T3 from 'data-url:/public/sound/wii/wii_4_T3.mp3'
import wii_8_T7 from 'data-url:/public/sound/wii/wii_8_T7.mp3'
import wii_10_T9 from 'data-url:/public/sound/wii/wii_10_T9.mp3'
import wii_12_T11 from 'data-url:/public/sound/wii/wii_12_T11.mp3'
import wii_T5 from 'data-url:/public/sound/wii/wii_T5.mp3'
import wii_chord from 'data-url:/public/sound/wii/wii_chord.mp3'
import ipod_2_T1 from 'data-url:/public/sound/ipod/ipod_2_T1.mp3'
import ipod_5_T4 from 'data-url:/public/sound/ipod/ipod_5_T4.mp3'
import ipod_7_T6 from 'data-url:/public/sound/ipod/ipod_7_T6.mp3'
import ipod_8_T7 from 'data-url:/public/sound/ipod/ipod_8_T7.mp3'
import ipod_14_FX from 'data-url:/public/sound/ipod/ipod_14_FX.mp3'
import ipod_15_Delay_Reverb from 'data-url:/public/sound/ipod/ipod_15_Delay_Reverb.mp3'
import ipod_hiss from 'data-url:/public/sound/ipod/ipod_hiss.mp3'
import orbit_3_Audio from 'data-url:/public/sound/orbit/orbit_3-Audio.mp3'
import orbit_8_DT1 from 'data-url:/public/sound/orbit/orbit_8_DT1.mp3'
import orbit_9_DT2 from 'data-url:/public/sound/orbit/orbit_9_DT2.mp3'
import orbit_10_DT6 from 'data-url:/public/sound/orbit/orbit_10_DT6.mp3'
import coinBox from 'data-url:/public/sound/fx/coin-box.mp3'
import bongoHard from 'data-url:/public/sound/fx/SC_CP_perc_bongo_loud_tap.mp3'
import bubble from 'data-url:/public/sound/fx/DSC_GST_one_shot_perc_water.mp3'
import coin from 'data-url:/public/sound/fx/ESM_Game_Notification_83_Coin_Blip_Select_Tap_Button.mp3'
import bottlerocket2 from 'data-url:/public/sound/fx/space/BottleRocket_S011FI.5.mp3'
import bomb from 'data-url:/public/sound/fx/space/ESM_Builder_Game_Fireworks_Bomb_Explosion_2_Fire_Bomb_Explosive_War_Battle_Rocket_Mortar_Tank_Cannon.mp3'
import affirmative from 'data-url:/public/sound/fx/space/ESM_Digital_Game_Affirmation_Sound_Sci_fi_Military_Robotic_Robot_Cyber_Futuristic_Transition.mp3'

const base64Files = [
  whistle_8_T7,
  whistle_4_T3,
  whistle_7_T6,
  whistle_12_T11,
  whistle_8_T7_B,
  wii_2_T1,
  wii_4_T3,
  wii_8_T7,
  wii_10_T9,
  wii_12_T11,
  wii_T5,
  wii_chord,
  ipod_2_T1,
  ipod_5_T4,
  ipod_7_T6,
  ipod_8_T7,
  ipod_14_FX,
  ipod_15_Delay_Reverb,
  ipod_hiss,
  orbit_3_Audio,
  orbit_8_DT1,
  orbit_9_DT2,
  orbit_10_DT6,
  coinBox,
  bongoHard,
  bubble,
  coin,
  bottlerocket2,
  bomb,
  affirmative
]

const audioBuffers = {}

const hash = (str) => {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i)
    hash |= 0 // Convert to 32bit integer
  }
  return hash
}

for (const file of base64Files) {
  audioBuffers[hash(file)] = file
  continue
}
const SONGS = {
  // whistle: {
  //   bpm: 70,
  //   parts: [
  //     [
  //       // each part consists of a set of tracks
  //       // type Track: [sample, probability, introProbability?]
  //       [whistle_8_T7, 1, 0],
  //       [whistle_4_T3, 0.9, 1],
  //       [whistle_7_T6, 0.7, 1],
  //       [whistle_12_T11, 0.7, 0]
  //     ],
  //     [
  //       [whistle_8_T7_B, 1, 0],
  //       [whistle_4_T3, 0.7, 1],
  //       [whistle_7_T6, 0.7, 1],
  //       [whistle_12_T11, 0.7, 0]
  //     ]
  //   ]
  // },
  wii: {
    bpm: 70,
    parts: [
      [
        [wii_2_T1, 1, 0],
        [wii_4_T3, 0.9, 1],
        [whistle_7_T6, 0.7, 0],
        [wii_12_T11, 0.7, 1],
        [wii_10_T9, 0.9, 1],
        [wii_T5, 0.2, 0]
      ],
      [
        [wii_2_T1, 1, 1],
        [wii_4_T3, 0.9, 1],
        [wii_8_T7, 1, 1],
        [whistle_7_T6, 0.7, 0],
        [wii_12_T11, 0.8, 0],
        [wii_10_T9, 0.7, 1],
        [wii_chord, 1, 1]
      ]
    ]
  },
  ipod: {
    bpm: 113,
    interval: '4m',
    gameoverSpeed: 0.5,
    parts: [
      [
        [ipod_2_T1, 0.9, 0],
        [ipod_5_T4, 0.9, 1],
        [ipod_7_T6, 0.7, 1],
        [ipod_8_T7, 0.7, 0],
        [ipod_14_FX, 0.5, 0],
        [ipod_15_Delay_Reverb, 1, 0],
        [ipod_hiss, 0.5, 0]
      ]
    ]
  },
  orbit: {
    bpm: 96,
    interval: '4m',
    volume: -6,
    parts: [
      [
        [orbit_3_Audio, 1, 1],
        [orbit_8_DT1, 0.6, 0],
        [orbit_9_DT2, 0.7, 0],
        [orbit_10_DT6, 0.7, 0]
      ]
    ]
  }
}

const TRACK_VOLUME = 3 //db
const MAX_VOLUME = 8 //db
// const INTRO_LENGTH = 1 // measures
const PAN_RANGE = 1.4 // 2 is hard L/R panning

function random(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

export default class Sound {
  currentMeasure = 0

  constructor(anybody) {
    if (typeof window === 'undefined') return
    this.anybody = anybody
    this.setSong()
  }

  setSong(index) {
    const songs = Object.values(SONGS)
    index = index ?? (3 + this.anybody.level) % songs.length
    this.currentSong = songs[index]
    console.log('currentSong:', Object.keys(SONGS)[index])
  }

  // handleKeyDown = (e) => {
  //   if (this.anybody.paused) return

  //   if (e.key === '1') {
  //     this.stop()
  //     this.play(SONGS.whistle)
  //   } else if (e.key === '2') {
  //     this.stop()
  //     this.play(SONGS.wii)
  //   } else if (e.key === '3') {
  //     this.stop()
  //     this.play(SONGS.ipod)
  //   } else if (e.key === '4') {
  //     this.stop()
  //     this.play(SONGS.orbit)
  //   }
  // }

  // this function must be called in response to a user action
  // otherwise safari and chrome will block the audio
  resume() {
    this.play(this.currentSong)
    this.playOneShot(bongoHard, -20)
  }

  pause() {
    Tone.getTransport().stop()
    for (let i = 0; i < this.voices?.length; i++) {
      this.voices[i].player.stop()
    }
    this.playOneShot(bongoHard, -22)
  }

  async playMissile(vectorMagnitude) {
    this.missilePanner = this.missilePanner || new Panner().connect(this.master)
    this.missilePanner.pan.value = -PAN_RANGE / 2
    let player
    if (this.anybody.sfx === 'space') {
      const playbackRate =
        vectorMagnitude < 666_666 ? 3 : vectorMagnitude < 1_333_332 ? 2 : 1
      player = await this.playOneShot(bottlerocket2, -24, {
        playbackRate
      })
    } else {
      player = await this.playOneShot(bubble, -26, {
        playbackRate: random([1, 0.9, 1.3])
      })
    }
    // pan sound left to right
    if (player) {
      player.disconnect()
      player.connect(this.missilePanner)
      this.missilePanner.pan.rampTo(PAN_RANGE / 2, 0.3)
    }
  }

  async playExplosion(x) {
    if (this.anybody.sfx === 'space') {
      const player = await this.playOneShot(coin, -20, {
        playbackRate: random([1, 1.4, 0.8])
      })
      if (!player) return
      const panner = new Panner().connect(this.master)
      player.disconnect()
      player.connect(panner)
      panner.pan.value = (x / this.anybody.windowWidth) * 2 - 1
    } else {
      this.playOneShot(bubble, -36, { playbackRate: 2.3 })
      this.playOneShot(bubble, -36, { playbackRate: 4.5 })
      this.playOneShot(bubble, -16, { playbackRate: 0.2 })
      await new Promise((resolve) => setTimeout(resolve, 100))
      this.playOneShot(bubble, -26, { playbackRate: 1 })
      this.playOneShot(bubble, -26, { playbackRate: 5.5 })
      await new Promise((resolve) => setTimeout(resolve, 200))
      this.playOneShot(bubble, -26, { playbackRate: 2.3 })
      this.playOneShot(bubble, -26, { playbackRate: 5.5 })
    }
  }

  async playOneShot(url, volume, opts = false) {
    const audioBuffer = audioBuffers[hash(url)]
    await start()
    this.oneShots = this.oneShots || {}
    const urlHash = hash(url)
    const key = `${urlHash}-${volume}-${opts && JSON.stringify(opts)}`
    if (!this.oneShots[key]) {
      this.oneShots[key] = new Player({
        url: audioBuffer,
        volume,
        ...opts
      }).toDestination()
    }

    // play if it's been loaded or loads quickly, otherwise load and skip
    const now = Date.now()
    await loaded()
    if (Date.now() - now < 200) {
      this.oneShots[key].start()
      return this.oneShots[key]
    }
  }

  async playNormalSpeed() {
    for (let i = 0; i < this.voices?.length; i++) {
      this.voices[i].player.playbackRate = 1
    }
  }

  async playGameOver({ win }) {
    if (this.playedGameOver) return
    this.playedGameOver = true
    Tone.getTransport().stop()
    Tone.getTransport().cancel()
    for (let i = 0; i < this.voices?.length; i++) {
      this.voices[i].player.stop()
    }

    // speed up the voices

    const playbackRate = this.currentSong?.gameoverSpeed || 2
    for (let i = 0; i < this.voices?.length; i++) {
      this.voices[i].player.playbackRate = playbackRate
    }
    Tone.getTransport().bpm.rampTo(
      (Tone.getTransport().bpm.value *= playbackRate),
      0.5
    )

    this.loop?.stop()
    this.loop?.cancel()
    this.loop?.start()

    Tone.getTransport().start()

    if (this.anybody.sfx === 'space') {
      this.playOneShot(affirmative, -22, { playbackRate: 1 })
      this.playOneShot(affirmative, -22, { playbackRate: 2 })
      this.playOneShot(affirmative, -22, { playbackRate: 0.5 })
    } else {
      if (win) {
        this.playOneShot(coin, -20)
        this.playOneShot(coinBox, -26)
      } else {
        // play the bubble sample as a descending melody
        this.playOneShot(ipod_hiss, -20)
        this.playOneShot(bubble, -26, { playbackRate: 4 })
        await new Promise((resolve) => setTimeout(resolve, 200))
        this.playOneShot(bubble, -26, { playbackRate: 1 })
        await new Promise((resolve) => setTimeout(resolve, 200))
        this.playOneShot(bubble, -26, { playbackRate: 0.8 })
        await new Promise((resolve) => setTimeout(resolve, 200))
        this.playOneShot(bubble, -26, { playbackRate: 0.6 })
        await new Promise((resolve) => setTimeout(resolve, 1000))
      }
    }
  }

  async playStart() {
    // if (this.anybody.sfx === 'space') {
    //   this.playOneShot(affirmative, -22, { playbackRate: 1 })
    //   this.playOneShot(affirmative, -22, { playbackRate: 2 })
    //   this.playOneShot(affirmative, -22, { playbackRate: 0.5 })
    // } else {
    this.playOneShot(coin, -20)
    // }
  }

  async playStat() {
    // if (this.anybody.sfx === 'space') {
    //   this.playOneShot(bottlerocket2, -24, {
    //     playbackRate: random([5, 10, 7])
    //   })
    // } else {
    this.playOneShot(bubble, -26, { playbackRate: random([3, 5, 10.5]) })
    // }
  }

  async playSuccess() {
    // if (this.anybody.sfx === 'space') {
    //   this.playOneShot(affirmative, -22, { playbackRate: 1 })
    // } else {
    this.playOneShot(coinBox, -28)
    // }
  }

  voiceFromFile(file) {
    const voice = {
      file: file,
      player: new Player({
        url: file,
        fadeOut: 0.1
      }),
      panVol: new PanVol()
    }
    voice.panVol.volume.value = TRACK_VOLUME
    return voice
  }

  stop() {
    Tone.getTransport().cancel()
    Tone.getTransport().stop()
    this.loop?.dispose()
    for (let i = 0; i < this.voices?.length; i++) {
      const voice = this.voices[i]
      voice.player.stop()
      voice.player.dispose()
      voice.panVol.dispose()
    }
    this.voices = null
    this.currentMeasure = 0
    this.playedGameOver = false
  }

  async play(song) {
    // only start if it hasn't started yet
    // if (Tone.getTransport().state === 'started') return
    await start()
    this.playingGameOver = false

    // if song is different from last one, dispose of old voices
    if (this.currentSong && this.currentSong !== song) {
      this.stop()
    }

    this.currentSong = song

    if (!this.voices) {
      const parts = song.parts[0]
      this.voices = parts.map((part) =>
        this.voiceFromFile(audioBuffers[hash(part[0])])
      )

      // master output
      this.reverb ||= new Reverb(0.5)
      this.reverb.wet.value = 0.15
      this.compressor ||= new Compressor()
      this.compressor.threshold.value = -24
      this.compressor.ratio.value = 2
      this.compressor.attack.value = 1
      this.compressor.release.value = 0.1
      this.masterVolume?.dispose()
      this.masterVolume = new Volume(song.volume || 0).toDestination()
      this.masterVolume.volume.rampTo(song.volume || MAX_VOLUME, 3)
      this.master = this.reverb
        .connect(this.compressor)
        .connect(this.masterVolume)

      Tone.getTransport().bpm.value = song.bpm

      await loaded()
      this.loop = new Loop((time) => {
        this.currentMeasure++
        for (let i = 0; i < this.voices?.length; i++) {
          const voice = this.voices[i]
          // just step through parts
          const part = song.parts[this.currentMeasure % song.parts.length][i]
          const url = audioBuffers[hash(part[0])]
          if (url) {
            // TODO: is ok to not do this now that we're not using URLs?
            // it throws an error because url is not a url
            // voice.player.load(url)
          } else {
            voice.player.stop()
          }
          voice.player.chain(voice.panVol)
          voice.panVol.connect(this.master)

          // randomly mute some voices, but keep most on
          // const probability =
          //   this.currentMeasure <= INTRO_LENGTH && typeof part[2] === 'number'
          //     ? part[2]
          //     : part[1]
          // if (Math.random() > probability) {
          //   voice.panVol.volume.linearRampTo(-Infinity, 0.1, time)
          // } else {
          //   voice.panVol.volume.linearRampTo(TRACK_VOLUME, 0.1, time)
          // }

          voice.player.start(time)
        }
      }, song.interval || '2m').start()
    }

    // PLAY
    Tone.getTransport().start()
  }
}
