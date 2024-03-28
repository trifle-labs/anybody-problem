import Q5 from './q5.js'
import { Anybody } from './anybody.js'

const q5 = new Q5()
q5.touchStarted = () => {}
q5.touchMoved = () => {}
q5.touchEnded = () => {}

window.anybody
q5.setup = () => {
  window.anybody = new Anybody(q5, {
    mode: 'game',
    seed: 0n
    // startingBodies: 1
  })
}
q5.draw = () => {
  window.anybody.draw()
}
