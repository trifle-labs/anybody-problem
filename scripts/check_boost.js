// const hre = require('hardhat')

// const { deployContracts } = require('./utils')
// const { Anybody } = require('../src/anybody.js')
import { Anybody } from '../src/anybody.js'
// const { exportCallDataGroth16 } = require('./circuits.js')
import { exportCallDataGroth16 } from './circuits.js'

async function main() {
  // const [owner] = await hre.ethers.getSigners()
  // const { Solver: solver } = await deployContracts()

  // const bodyBoost = [
  //   0, // 0th body, just for easier indexing
  //   0, // 1st body
  //   0, // 2nd body
  //   1, // 3rd body
  //   2, // 4th body
  //   4, // 5th body
  //   8, // 6th body
  //   16, // 7th body
  //   32, // 8th body
  //   64, //9th body
  //   128 // 10th body
  // ]

  const ticks = [20, 500]
  const sampleSize = 10
  const startingSize = 3
  const maxSize = 3

  const seed = 0n

  for (let i = startingSize; i <= maxSize; i++) {
    for (let j = 0; j < ticks.length; j++) {
      const ticksRun = ticks[j]
      const bodyCount = i
      let totalTime = 0
      for (let j = 0; j < sampleSize; j++) {
        const anybody = new Anybody(null, {
          totalBodies: i,
          seed,
          util: true
        })

        const missiles = new Array(ticksRun + 1)
          .fill(0)
          .map(() => new Array(5).fill('0'))
        const inputData = { bodies: anybody.bodyInits, missiles }
        const startTime = Date.now()
        await exportCallDataGroth16(
          inputData,
          `./public/game_${bodyCount}_${ticksRun}.wasm`,
          `./public/game_${bodyCount}_${ticksRun}_final.zkey`
        )
        const endTime = Date.now()
        const difference = endTime - startTime
        totalTime += difference
      }
      const difference = totalTime / sampleSize
      const differenceInReadableText = `${Math.floor(difference / 60_000)}m ${Math.floor(difference / 1000)}s ${(difference % 1000).toFixed(0)}ms`
      console.log(
        `Generated proof in ${differenceInReadableText} for ${ticksRun} ticks with ${bodyCount} bodies`
      )
      const tickRate = ticksRun / (difference / 1000)
      console.log(`Tick rate: ${tickRate.toFixed(2)} ticks/s`)
      const tickRatePerBody = tickRate / bodyCount
      console.log(`Tick rate per body: ${tickRatePerBody.toFixed(2)} ticks/s`)
      console.log('wait 10 seconds\n\n')
      await new Promise((resolve) => setTimeout(resolve, 10_000))
    }
    // const boostAmount = bodyBoost[bodyCount]
    // const dustRate = boostAmount * tickRate
    // console.log(`Dust rate: ${dustRate.toFixed(2)} dust/s`)
    // const dustRatePerBody = dustRate / bodyCount
    // console.log(`Dust rate per body: ${dustRatePerBody.toFixed(2)} dust/s`)
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
