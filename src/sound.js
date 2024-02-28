const { el } = require('@elemaudio/core')
const WebRenderer = require('@elemaudio/web-renderer').default

const ctx = new AudioContext()
const core = new WebRenderer()

const FILES = [
  'whistle/whistle_4_T3.wav',
  'whistle/whistle_7_T6.wav',
  'whistle/whistle_8_T7.wav',
  'whistle/whistle_12_T11.wav',
  'whistle/whistle_15_Delay_Reverb.wav'
]

export default class Sound {
  constructor() {
    this.initAudio()
  }

  // this function must be called in response to a user action
  // for the audio to be enabled
  resume() {
    ctx.resume()
    this.render()
  }

  pause() {
    core.render()
  }

  async loadFile(path) {
    let response = await fetch(path)
    let sampleBuffer = await ctx.decodeAudioData(await response.arrayBuffer())
    return [path, sampleBuffer.getChannelData(0)]
  }

  async getVirtualFileSystem() {
    const files = await Promise.all(FILES.map(this.loadFile))
    let virtualFileSystem = {}
    for (let [path, data] of files) {
      virtualFileSystem[path] = data
    }
    return virtualFileSystem
  }

  async initAudio() {
    const virtualFileSystem = await this.getVirtualFileSystem()
    let node = await core.initialize(ctx, {
      numberOfInputs: 0,
      numberOfOutputs: 1,
      outputChannelCount: [2],
      sampleRate: 48000,
      processorOptions: {
        virtualFileSystem
      }
    })
  
    node.connect(ctx.destination)
  }

  // given the state of anybody, render the sound
  // TODO: anybody as prop here
  render() {
    console.log("Sound#render")
    // A "time" value that counts in seconds and loops in the
    // range [0s, 10s)
    let time = el.train(1/7)

    const samples = FILES.map(path => el.sample({path}, time, 1))
    const sampleSum = el.add(...samples)

    const left = el.compress(10, 100, -48, 4, sampleSum, sampleSum);
    const right = left
    core?.render(left, right)
  }
}