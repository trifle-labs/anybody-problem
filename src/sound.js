import { Transport, MultibandCompressor, Loop, Player, Reverb, Filter, Volume, PanVol, start, loaded} from 'tone'
import whistle_8_T7 from '../public/whistle/whistle_8_T7.mp3'
import whistle_4_T3 from '../public/whistle/whistle_4_T3.mp3'
import whistle_7_T6 from '../public/whistle/whistle_7_T6.mp3'
import whistle_12_T11 from '../public/whistle/whistle_12_T11.mp3'
import whistle_8_T7_B from '../public/whistle/whistle_8_T7_B.mp3'

const SONGS = {
  whistle: {
    bpm: 70,
    parts: [[
      // each part consists of a set of tracks
      // type Track: [sample, probability, introProbability?]
      [whistle_8_T7, 1, 0],
      [whistle_4_T3, 0.9, 1],
      [whistle_7_T6, 0.8, 1],
      [whistle_12_T11, 0.7, 0],
    ], [
      [whistle_8_T7_B, 1, 0],
      [whistle_4_T3, 0.9, 1],
      [whistle_7_T6, 0.8, 1],
      [whistle_12_T11, 0.7, 0],
    ]],
  },
  wii: {}
}

const MAX_VOLUME = 24 //db

export default class Sound {
  constructor() {
    this.currentMeasure = 0
  }

  // this function must be called in response to a user action
  // otherwise safari and chrome will block the audio
  resume() {
    this.play(SONGS.whistle)
  }

  pause() {
    Transport.stop()
    this.voices?.forEach(voice => voice.player.stop())
  }

  voiceFromFile(file) {
    const voice = {
      file: file,
      player: new Player(`${window.location.origin}${file}`),
      filter: new Filter(500, 'highpass'),
      panVol: new PanVol()
    }
    voice.panVol.volume.value = -Infinity
    return voice
  }

  async play(song) {
    // only start if it hasn't started yet
    if (Transport.state === 'started') return
    await start()

    if (!this.voices) {
      const parts = song.parts[0]
      this.voices = parts.map(part => this.voiceFromFile(part[0]))
      
      // master output
      const reverb = new Reverb(1)
      reverb.wet.value = 0.1
      this.masterVolume = new Volume(0).toDestination()
      this.masterVolume.volume.rampTo(MAX_VOLUME, 3)
      this.master = reverb
        .connect(new MultibandCompressor())
        .connect(this.masterVolume)
  
      Transport.bpm.value = song.bpm

      await loaded()

      new Loop(time => {
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
          voice.player.chain(voice.filter, voice.panVol)
          voice.panVol.connect(this.master)

          // randomly mute some voices, but keep most on
          const probability = this.currentMeasure <= 2 && typeof part[2] === 'number' ? part[2] : part[1]
          if (Math.random() > probability) {
            voice.panVol.volume.linearRampTo(-Infinity, 0.1)
          } else {
            voice.panVol.volume.linearRampTo(0, 0.1)
          }

          voice.player.start(time)
        })
      }, '2m').start(0)
    }
  
    // PLAY
    Transport.start()
  }

  // given the state of anybody, modify voices
  async render(anybody) {
    if (!this.voices) return

    // map the x/y position of each body to a voice's panning and filter frequency
    this.voices.forEach((voice, i) => {
      const body = anybody.bodies[i]
      if (!body) return
      const { x } = body.position
      const speed = body.velocity.mag()

      const xFactor = x/anybody.windowWidth
      const speedFactor = speed/anybody.vectorLimit

      // panning
      const panRange = 1.92 // 2 allows hard L/R panning
      voice.panVol.pan.linearRampTo(xFactor * panRange - panRange/2, 0.1)

      // filter frequency
      voice.filter.Q.value = 13
      const filterFreq = 600 + speedFactor * 1000
      voice.filter.frequency.linearRampTo(filterFreq, 0.1)
    })
  }
}