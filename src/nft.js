import Q5 from './q5.js'
import { Anybody } from './anybody.js'

const q5 = new Q5()

window.anybody
q5.setup = () => {
  window.anybody = new Anybody(q5, {
    mode: 'game',
    // showLives: true,
    // target: 'inside',
    // globalStyle: 'psycho',
    alreadyRun: Math.floor(Math.random() * 20000),
    // seed: 0n,
    startingBodies: Math.floor(Math.random() * 7) + 3
  })
}
q5.draw = () => {
  window.anybody.draw()
}
