import * as Tone from 'tone'
const {
  Player,
  PanVol,
  Panner,
  Volume,
  Loop,
  start,
  loaded
} = Tone

//import whistle from 'data-url:/public/sound/tracks/whistle.mp3'
import orbit from 'data-url:/public/sound/tracks/orbit.mp3'
import ipod from 'data-url:/public/sound/tracks/ipod.mp3'
import wii from 'data-url:/public/sound/tracks/wii.mp3'
import coinBox from 'data-url:/public/sound/fx/coin-box.mp3'
import bongoHard from 'data-url:/public/sound/fx/SC_CP_perc_bongo_loud_tap.mp3'
import bubble from 'data-url:/public/sound/fx/DSC_GST_one_shot_perc_water.mp3'
import coin from 'data-url:/public/sound/fx/ESM_Game_Notification_83_Coin_Blip_Select_Tap_Button.mp3'
import bottlerocket2 from 'data-url:/public/sound/fx/space/BottleRocket_S011FI.5.mp3'
import ipod_hiss from 'data-url:/public/sound/ipod/ipod_hiss.mp3'
import affirmative from 'data-url:/public/sound/fx/space/ESM_Digital_Game_Affirmation_Sound_Sci_fi_Military_Robotic_Robot_Cyber_Futuristic_Transition.mp3'

const hash = (str) => {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i)
    hash |= 0 // Convert to 32bit integer
  }
  return hash
}

function random(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

const SONGS = {
  // whistle: {
  //   bpm: 70,
  //   audio: whistle
  // },
  wii: {
    bpm: 70,
    interval: '2m',
    audio: wii,
  },
  ipod: {
    bpm: 113,
    interval: '4m',
    gameoverSpeed: 0.5,
    audio: ipod
  },
  orbit: {
    bpm: 96,
    interval: '4m',
    volume: -6,
    audio: orbit
  }
}

const PAN_RANGE = 1.4 // 2 is hard L/R panning

export default class Sound {

  constructor(anybody) {
    if (typeof window === 'undefined') return
    this.anybody = anybody
    this.createPlayer()
    window.addEventListener('keydown', this.handleKeyDown)
    this.setSong()
  }

  async prepareForPlayback() {
    if (Tone.getContext().state !== "running") {
      await start()
      console.log('ready for audio playback')
    }
  }

  createPlayer() {
    this.master = new Volume().toDestination()
    this.panner = new PanVol()
    this.player = new Player({ fadeOut: 0.1 })
    this.player.chain(this.panner)
    this.panner.connect(this.master)
  }

  setSong(index) {
    const songs = Object.values(SONGS)
    index = index ?? (3 + this.anybody.level) % songs.length
    this.currentSong = songs[index]
    console.log('currentSong:', Object.keys(SONGS)[index])
  }

  handleKeyDown = (e) => {
    if (this.anybody.paused) return

    if (e.key === '1') {
      this.stop()
      this.playSong(SONGS.whistle)
    } else if (e.key === '2') {
      this.stop()
      this.playSong(SONGS.wii)
    } else if (e.key === '3') {
      this.stop()
      this.playSong(SONGS.ipod)
    } else if (e.key === '4') {
      this.stop()
      this.playSong(SONGS.orbit)
    }
  }

  // this function must be called in response to a user action
  // otherwise safari and chrome will block the audio
  resume() {
    this.playSong(this.currentSong)
    this.playOneShot(bongoHard, -20)
  }

  pause() {
    Tone.getTransport().stop()
    this.player.stop()
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
    // prepare playback
    this.prepareForPlayback()

    this.oneShots = this.oneShots || {}
    const key = `${hash(url)}-${volume}-${opts && JSON.stringify(opts)}`
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
    if (Date.now() - now < 200) {
      this.oneShots[key].start()
      return this.oneShots[key]
    }
  }

  async playGameOver({ win }) {

    // prepare playback
    this.prepareForPlayback()

    // first stop current player
    this.stop()

    // speed up the voices
    const playbackRate = this.currentSong?.gameoverSpeed || 2

    // set new gameover playback rate
    this.player.playbackRate = playbackRate

    // speed up the BPM w ramp
    Tone.getTransport().bpm.rampTo(
      (Tone.getTransport().bpm.value *= playbackRate),
      0.5
    )

    // this.loop?.stop()
    // this.loop?.cancel()
    this.loop?.start()

    // play the transport
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
    this.playOneShot(coin, -20)
  }

  async playStat() {
    this.playOneShot(bubble, -26, { playbackRate: random([3, 5, 10.5]) })
  }

  async playSuccess() {
    this.playOneShot(coinBox, -28)
  }

  stop() {
    Tone.getTransport().cancel()
    Tone.getTransport().stop()
    this.loop.stop()
    this.loop?.dispose()
    this.player.stop()
  }

  async playSong(song) {
    // prepare playback
    this.prepareForPlayback()

    // if song is different from last one, restart player
    if (this.currentSong && this.currentSong !== song) {
      this.stop()
    }

    // set current song
    this.currentSong = song

    // set the transport BPM
    Tone.getTransport().bpm.value = this.currentSong.bpm

    // reset playback-rate (after game-over)
    this.player.playbackRate = 1

    // load the current song
    await this.player.load(this.currentSong.audio);

    // play the song in a loop 
    this.loop = new Loop((time) => {
        this.player.start(time)
    }, song.interval || '2m').start()

    // play the transport
    Tone.getTransport().start()
  }
}
