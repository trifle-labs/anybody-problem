import Q5 from './q5.min.js'
import { Anybody } from './anybody.js'

const q5 = new Q5()
const hash = window.location.hash.slice(1)
const day = hash.split('-')[0]
let todaysRecords
try {
  const baseURLScores = hash.split('-')[1]
  const scores = Buffer.from(baseURLScores, 'base64').toString('utf-8')
  todaysRecords = JSON.parse(scores)
} catch (error) {
  console.log(`parsing hash failed`, { hash, error })
}
window.anybody

q5.setup = () => {
  const options = {
    level: 5,
    opensea: true,
    todaysRecords
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
