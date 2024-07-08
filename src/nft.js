import Q5 from './q5.min.js'
import { Anybody } from './anybody.js'

const q5 = new Q5()
const seed = window.location.hash.slice(1)

window.anybody

q5.setup = () => {
  window.anybody = new Anybody(q5, {
    mode: 'game',
    // target: 'inside',
    // globalStyle: 'psycho',
    day: Math.floor(Math.random() * 10000000),
    level: 1, //Math.floor(Math.random() * 4) + 1,
    alreadyRun: 0, //Math.floor(Math.random() * 20000),
    seed: seed || null,
    startingBodies: Math.floor(Math.random() * 8) + 2
    // bestTimes: [1.45, 2.44, 16.79, 23.45, 36.45]
  })
  if (!seed) {
    window.location.hash =
      '0x' + window.anybody.seed.toString().padStart(64, '0')
  }
}
q5.draw = () => {
  window.anybody.draw()
}
