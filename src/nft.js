import Q5 from './q5.min.js'
import { Anybody } from './anybody.js'

const q5 = new Q5()
const day = window.location.hash.slice(1)
window.anybody

q5.setup = () => {
  const options = {
    level: 1,
    bestTimes: [1.45, 2.44, 16.79, 23.45, 36.45]
  }
  if (day && day !== '') {
    options.day = parseInt(day)
  }
  window.anybody = new Anybody(q5, options)
  if (!day) {
    window.location.hash = window.anybody.day.toString()
  }
}
q5.draw = () => {
  window.anybody.draw()
}
