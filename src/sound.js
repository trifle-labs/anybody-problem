const { el } = require('@elemaudio/core')
const WebRenderer = require('@elemaudio/web-renderer').default

const ctx = new AudioContext()
const core = new WebRenderer()

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

  // given the state of anybody, render the sound
  render() {
    core.render(el.cycle(440), el.cycle(441))
  }

  async initAudio() {
    let node = await core.initialize(ctx, {
      numberOfInputs: 0,
      numberOfOutputs: 1,
      outputChannelCount: [2]
    })
  
    node.connect(ctx.destination)
  }
}