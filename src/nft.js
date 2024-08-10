import Q5 from './q5.min.js'
import { Anybody } from './anybody.js'

const q5 = new Q5()
const day = window.location.hash.slice(1)
window.anybody

q5.setup = () => {
  const options = {
    level: 5
  }
  if (day && day !== '') {
    options.day = parseInt(day)
  }
  window.anybody = new Anybody(q5, options)
  if (!day) {
    console.log('no day!')
    window.location.hash = window.anybody.day.toString()
  }
}
q5.draw = () => {
  window.anybody.draw()
}
