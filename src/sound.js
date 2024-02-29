const Tone = require('tone')

const FILES = [
  '/whistle/whistle_4_T3.wav',
  '/whistle/whistle_7_T6.wav',
  '/whistle/whistle_8_T7.wav',
  '/whistle/whistle_12_T11.wav',
  '/whistle/whistle_15_Delay_Reverb.wav'
]

const MAX_VOLUME = 24 //db

export default class Sound {
  // this function must be called in response to a user action
  // otherwise safari and chrome will block the audio
  resume() {
    this.play()
  }

  pause() {
    console.log('Sound#pause')

    this.sampler?.releaseAll()
    Tone.Transport.stop()
    this.voices?.forEach(voice => voice.player.stop())
  }

  async play() {
    console.log('Sound#play')

    // only start if it hasn't started yet
    if (Tone.Transport.state === 'started') return
    await Tone.start()

    if (!this.voices) {
      this.voices = FILES.map(file => ({
        player: new Tone.Player(`${window.location.origin}${file}`),
        filter: new Tone.Filter(500, 'highpass'),
        panVol: new Tone.PanVol()
      }))

      // master output
      const reverb = new Tone.Reverb(1)
      reverb.wet.value = 0.1
      this.masterVolume = new Tone.Volume(0).toDestination()
      this.masterVolume.volume.rampTo(MAX_VOLUME, 3)

      this.master = reverb
        .connect(new Tone.MultibandCompressor())
        .connect(this.masterVolume)
  
      Tone.Transport.bpm.value = 70

      await Tone.loaded()
      // start every sample at the same time every other bar
      // loop every 2 measures
      new Tone.Loop(time => {
        this.voices.forEach(voice => {
          voice.player.start(time)
          voice.player.chain(voice.filter, voice.panVol)
          voice.panVol.connect(this.master)
        })
      }, '2m').start(0)
    }
  
    // PLAY
    Tone.Transport.start()
  }

  // given the state of anybody, modify voices
  async render(anybody) {
    if (!this.voices) return

    // map the x/y position of each body to a voice's panning and filter frequency
    this.voices.forEach((voice, i) => {
      const body = anybody.bodies[i]
      if (!body) return
      const { x, y} = body.position
      const speed = body.velocity.mag()

      const xFactor = x/anybody.windowWidth
      const yFactor = y/anybody.windowHeight
      const speedFactor = speed/anybody.vectorLimit

      // panning
      voice.panVol.pan.linearRampTo(xFactor * 1.9 - 0.95, 0.1)

      const volRange = 4
      voice.panVol.volume.linearRampTo(-(volRange/2) + yFactor * volRange, 0.1)
      
      // filter frequency
      voice.filter.Q.value = 13
      const filterFreq = 600 + speedFactor * 1000
      voice.filter.frequency.linearRampTo(filterFreq, 0.1)
    })
  }
}