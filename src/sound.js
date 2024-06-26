import * as Tone from 'tone'
const {
  Transport,
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
import Prando from 'prando'

const whistle_8_T7 = new URL(
  '/public/sound/whistle/whistle_8_T7.mp3',
  import.meta.url
).href
const whistle_4_T3 = new URL(
  '/public/sound/whistle/whistle_4_T3.mp3',
  import.meta.url
).href
const whistle_7_T6 = new URL(
  '/public/sound/whistle/whistle_7_T6.mp3',
  import.meta.url
).href
const whistle_12_T11 = new URL(
  '/public/sound/whistle/whistle_12_T11.mp3',
  import.meta.url
).href
const whistle_8_T7_B = new URL(
  '/public/sound/whistle/whistle_8_T7_B.mp3',
  import.meta.url
).href

const wii_2_T1 = new URL('/public/sound/wii/wii_2_T1.mp3', import.meta.url).href
const wii_4_T3 = new URL('/public/sound/wii/wii_4_T3.mp3', import.meta.url).href
const wii_8_T7 = new URL('/public/sound/wii/wii_8_T7.mp3', import.meta.url).href
const wii_10_T9 = new URL('/public/sound/wii/wii_10_T9.mp3', import.meta.url)
  .href
const wii_12_T11 = new URL('/public/sound/wii/wii_12_T11.mp3', import.meta.url)
  .href
const wii_T5 = new URL('/public/sound/wii/wii_T5.mp3', import.meta.url).href
const wii_chord = new URL('/public/sound/wii/wii_chord.mp3', import.meta.url)
  .href

const ipod_2_T1 = new URL('/public/sound/ipod/ipod_2_T1.mp3', import.meta.url)
  .href
const ipod_5_T4 = new URL('/public/sound/ipod/ipod_5_T4.mp3', import.meta.url)
  .href
const ipod_7_T6 = new URL('/public/sound/ipod/ipod_7_T6.mp3', import.meta.url)
  .href
const ipod_8_T7 = new URL('/public/sound/ipod/ipod_8_T7.mp3', import.meta.url)
  .href
const ipod_14_FX = new URL('/public/sound/ipod/ipod_14_FX.mp3', import.meta.url)
  .href
const ipod_15_Delay_Reverb = new URL(
  '/public/sound/ipod/ipod_15_Delay_Reverb.mp3',
  import.meta.url
).href
const ipod_hiss = new URL('/public/sound/ipod/ipod_hiss.mp3', import.meta.url)
  .href

const orbit_3_Audio = new URL(
  '/public/sound/orbit/orbit_3-Audio.mp3',
  import.meta.url
).href
const orbit_8_DT1 = new URL(
  '/public/sound/orbit/orbit_8_DT1.mp3',
  import.meta.url
).href
const orbit_9_DT2 = new URL(
  '/public/sound/orbit/orbit_9_DT2.mp3',
  import.meta.url
).href
const orbit_10_DT6 = new URL(
  '/public/sound/orbit/orbit_10_DT6.mp3',
  import.meta.url
).href

const coinBox = new URL('/public/sound/fx/coin-box.mp3', import.meta.url).href
const bongoHard = new URL(
  '/public/sound/fx/SC_CP_perc_bongo_loud_tap.mp3',
  import.meta.url
).href
const bubble = new URL(
  '/public/sound/fx/DSC_GST_one_shot_perc_water.mp3',
  import.meta.url
).href
const coin = new URL(
  '/public/sound/fx/ESM_Game_Notification_83_Coin_Blip_Select_Tap_Button.mp3',
  import.meta.url
).href
// const bottlerocket = new URL(
//   '/public/sound/fx/space/BottleRocket_BW.60057.mp3',
//   import.meta.url
// ).href
// const bottlerocket1 = new URL(
//   '/public/sound/fx/space/BottleRocket_BW.60058.mp3',
//   import.meta.url
// ).href
const bottlerocket2 = new URL(
  '/public/sound/fx/space/BottleRocket_S011FI.5.mp3',
  import.meta.url
).href
// const heavy = new URL(
//   '/public/sound/fx/space/ESM_GW_heavy_weapon_one_shot_rocket_launcher_launching_3_rocket_shot_clicky_long_gas_3.mp3',
//   import.meta.url
// ).href
const bomb = new URL(
  '/public/sound/fx/space/ESM_Builder_Game_Fireworks_Bomb_Explosion_2_Fire_Bomb_Explosive_War_Battle_Rocket_Mortar_Tank_Cannon.mp3',
  import.meta.url
).href
const affirmative = new URL(
  '/public/sound/fx/space/ESM_Digital_Game_Affirmation_Sound_Sci_fi_Military_Robotic_Robot_Cyber_Futuristic_Transition.mp3',
  import.meta.url
).href

const SONGS = {
  whistle: {
    bpm: 70,
    parts: [
      [
        // each part consists of a set of tracks
        // type Track: [sample, probability, introProbability?]
        [whistle_8_T7, 1, 0],
        [whistle_4_T3, 0.9, 1],
        [whistle_7_T6, 0.7, 1],
        [whistle_12_T11, 0.7, 0]
      ],
      [
        [whistle_8_T7_B, 1, 0],
        [whistle_4_T3, 0.7, 1],
        [whistle_7_T6, 0.7, 1],
        [whistle_12_T11, 0.7, 0]
      ]
    ]
  },
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
const INTRO_LENGTH = 1 // measures
const PAN_RANGE = 1.4 // 2 is hard L/R panning

function random(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

export default class Sound {
  currentMeasure = 0

  constructor(anybody) {
    if (typeof window === 'undefined') return
    this.anybody = anybody
    window.addEventListener('keydown', this.handleKeyDown)
    // const rng = new Prando(anybody.seed?.toString(16))
    // TODO: change back if you want each day to have one song
    const rng = new Prando()
    const songs = Object.values(SONGS)
    const rand = rng.nextInt(0, songs.length - 1)
    this.currentSong = songs[rand]
  }

  handleKeyDown = (e) => {
    if (this.anybody.paused) return

    if (e.key === '1') {
      this.stop()
      this.play(SONGS.whistle)
    } else if (e.key === '2') {
      this.stop()
      this.play(SONGS.wii)
    } else if (e.key === '3') {
      this.stop()
      this.play(SONGS.ipod)
    } else if (e.key === '4') {
      this.stop()
      this.play(SONGS.orbit)
    }
  }

  // this function must be called in response to a user action
  // otherwise safari and chrome will block the audio
  resume() {
    this.play(this.currentSong)
    this.playOneShot(bongoHard, -20)
  }

  pause() {
    Transport?.stop()
    this.voices?.forEach((voice) => voice.player.stop())
    this.playOneShot(bongoHard, -22)
  }

  async playMissile() {
    this.missilePanner = this.missilePanner || new Panner().connect(this.master)
    this.missilePanner.pan.value = -PAN_RANGE / 2
    let player
    if (this.anybody.sfx === 'space') {
      player = await this.playOneShot(bottlerocket2, -24, {
        playbackRate: random([1, 2, 3])
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
      const player = await this.playOneShot(bomb, -20, {
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
    this.oneShots = this.oneShots || {}
    const key = `${url}-${volume}-${opts && JSON.stringify(opts)}`
    if (!this.oneShots[key]) {
      this.oneShots[key] = new Player({
        url,
        volume,
        ...opts
      }).toDestination()
    }

    // play if it's been loaded or loads quickly, otherwise load and skip
    const now = Date.now()
    await loaded()
    if (Date.now() - now < 40) {
      // if (!this.anybody.gameOver) {
      this.oneShots[key].start()
      return this.oneShots[key]
      // }
    }
  }

  async playGameOver({ win }) {
    if (this.playedGameOver) return
    this.playedGameOver = true
    Transport.stop()
    this.voices?.forEach((voice) => voice.player.stop())

    // speed up the voices

    const playbackRate = this.currentSong?.gameoverSpeed || 2
    this.voices?.forEach((voice) => {
      voice.player.playbackRate = playbackRate
    })
    Transport.bpm.value *= playbackRate

    Transport.start()

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
    if (this.anybody.sfx === 'space') {
      this.playOneShot(affirmative, -22, { playbackRate: 1 })
      this.playOneShot(affirmative, -22, { playbackRate: 2 })
      this.playOneShot(affirmative, -22, { playbackRate: 0.5 })
    } else {
      this.playOneShot(coin, -20)
    }
  }

  async playStat() {
    if (this.anybody.sfx === 'space') {
      this.playOneShot(bottlerocket2, -24, {
        playbackRate: random([5, 10, 7])
      })
    } else {
      this.playOneShot(bubble, -26, { playbackRate: random([3, 5, 10.5]) })
    }
  }

  async playSuccess() {
    if (this.anybody.sfx === 'space') {
      this.playOneShot(affirmative, -22, { playbackRate: 1 })
    } else {
      this.playOneShot(coinBox, -28)
    }
  }

  voiceFromFile(file) {
    const voice = {
      file: file,
      player: new Player({
        url: `${file}`,
        fadeOut: 0.1
      }),
      panVol: new PanVol()
    }
    voice.panVol.volume.value = -Infinity
    return voice
  }

  stop() {
    Transport?.stop()
    this.loop?.dispose()
    this.voices?.forEach((voice) => {
      voice.player.stop()
      voice.player.dispose()
      voice.panVol.dispose()
    })
    this.voices = null
    this.currentMeasure = 0
    this.playedGameOver = false
  }

  async play(song) {
    // only start if it hasn't started yet
    if (Transport.state === 'started') return
    await start()
    this.playingGameOver = false

    // if song is different from last one, dispose of old voices
    if (this.currentSong && this.currentSong !== song) {
      this.stop()
    }

    this.currentSong = song

    if (!this.voices) {
      const parts = song.parts[0]
      this.voices = parts.map((part) => this.voiceFromFile(part[0]))

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

      Transport.bpm.value = song.bpm

      await loaded()

      this.loop = new Loop((time) => {
        this.currentMeasure++
        this.voices.forEach((voice, i) => {
          // just step through parts
          const part = song.parts[this.currentMeasure % song.parts.length][i]
          const url = part[0]
          if (url) {
            voice.player.load(url)
          } else {
            voice.player.stop()
          }
          voice.player.chain(voice.panVol)
          voice.panVol.connect(this.master)

          // randomly mute some voices, but keep most on
          const probability =
            this.currentMeasure <= INTRO_LENGTH && typeof part[2] === 'number'
              ? part[2]
              : part[1]
          if (Math.random() > probability) {
            voice.panVol.volume.linearRampTo(-Infinity, 0.1)
          } else {
            voice.panVol.volume.linearRampTo(TRACK_VOLUME, 0.1)
          }

          voice.player.start(time)
        })
      }, song.interval || '2m').start(0)
    }

    // PLAY
    Transport.start()
  }

  // given the state of anybody, modify voices
  async render(anybody) {
    if (!this.voices) return

    // map the x position of each body to a voice's panning
    this.voices.forEach((voice, i) => {
      const body = anybody.bodies[i]
      if (!body) return
      const { x } = body.position

      const xFactor = x / anybody.windowWidth

      // panning
      voice.panVol.pan.linearRampTo(xFactor * PAN_RANGE - PAN_RANGE / 2, 0.5)
    })
  }
}
