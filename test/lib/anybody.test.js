import { describe, it } from 'mocha'
import { expect } from 'chai'
import { calculateRecords } from '../../src/calculations.js'
import { days } from './days.js' // Assuming days.js exports the data as 'days'
// Example data for chains and appChainId, replace with actual relevant data if needed
const exampleChains = {
  8453: {
    data: {
      tournament: {
        startDate: new Date(Date.UTC(2024, 10, 11)).getTime() / 1000, // November 11, 2024 in UTC
        daysInWeek: 7,
        minDays: 3
      }
    }
  }
} // Provide relevant chain data structure
const exampleAppChainId = 8453 // Provide relevant appChainId

describe('Anybody Calculations', () => {
  describe('calculateRecords', () => {
    it('fastest should be sorted correctly', () => {
      // You might need to adjust the chains and appChainId based on your actual requirements
      const records = calculateRecords(days, exampleChains, exampleAppChainId)
      expect(Object.keys(records).length).to.equal(25)
      const weekInQuestion = records[23]
      const fastest = weekInQuestion.fastest
      const first = fastest[0].fastestDays.reduce(
        (acc, curr) => acc + curr.time,
        0
      )
      const second = fastest[1].fastestDays.reduce(
        (acc, curr) => acc + curr.time,
        0
      )
      const third = fastest[2].fastestDays.reduce(
        (acc, curr) => acc + curr.time,
        0
      )
      const fourth = fastest[3].fastestDays.reduce(
        (acc, curr) => acc + curr.time,
        0
      )
      const fifth = fastest[4].fastestDays.reduce(
        (acc, curr) => acc + curr.time,
        0
      )
      expect(first).to.be.lte(second)
      expect(second).to.be.lte(third)
      expect(third).to.be.lte(fourth)
      expect(fourth).to.be.lte(fifth)

      expect(fastest[0].fastestDays.length).to.equal(3)
      expect(fastest[0].minimumDaysMet).to.be.true
    })
    it.only('should contain correct recordsBroken', () => {
      const records = calculateRecords(days, exampleChains, exampleAppChainId)
      const weekInQuestion = records[23].recordsBroken
      console.log({ weekInQuestion })
    })
  })

  // Add more describe blocks for other functions from calculations.js or anybody.js
  // describe('otherFunction', () => {
  //     it('should do something correctly', () => {
  //         // test code
  //     });
  // });
})
