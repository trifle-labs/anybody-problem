// const hre = require('hardhat')

// const { deployContracts } = require('./utils')
const { Anybody } = require('../src/anybody.js')
const { exportCallDataGroth16 } = require('../scripts/circuits.js')

async function main() {
  // const [owner] = await hre.ethers.getSigners()
  // const { Solver: solver } = await deployContracts()

  const bodyBoost = [
    0, // 0th body, just for easier indexing
    0, // 1st body
    0, // 2nd body
    1, // 3rd body
    2, // 4th body
    4, // 5th body
    8, // 6th body
    16, // 7th body
    32, // 8th body
    64, //9th body
    128 // 10th body
  ]

  const ticksRun = 20
  const sampleSize = 100
  const startingSize = 3
  const maxSize = 10

  const seed = 0n

  for (let i = startingSize; i <= maxSize; i++) {
    const bodyCount = i
    let totalTime = 0
    for (let j = 0; j < sampleSize; j++) {
      const anybody = new Anybody(null, {
        totalBodies: i,
        seed,
        util: true,
      })
      const inputData = { bodies: anybody.bodyInits }
      const startTime = Date.now()
      await exportCallDataGroth16(
        inputData,
        `./public/nft_${bodyCount}_${ticksRun}.wasm`,
        `./public/nft_${bodyCount}_${ticksRun}_final.zkey`
      )
      const endTime = Date.now()
      const difference = endTime - startTime
      totalTime += difference
    }
    const difference = totalTime / sampleSize
    const differenceInReadableText = `${Math.floor(difference / 60_000)}m ${Math.floor(difference / 1000)}s ${(difference % 1000).toFixed(0)}ms`
    console.log(`Generated proof in ${differenceInReadableText} for ${ticksRun} ticks with ${bodyCount} bodies`)
    const tickRate = ticksRun / (difference / 1000)
    console.log(`Tick rate: ${tickRate.toFixed(2)} ticks/s`)
    const tickRatePerBody = tickRate / bodyCount
    console.log(`Tick rate per body: ${tickRatePerBody.toFixed(2)} ticks/s`)
    const boostAmount = bodyBoost[bodyCount]
    const tockRate = boostAmount * tickRate
    console.log(`Tock rate: ${tockRate.toFixed(2)} tocks/s`)
    const tockRatePerBody = tockRate / bodyCount
    console.log(`Tock rate per body: ${tockRatePerBody.toFixed(2)} tocks/s`)
    console.log('wait 10 seconds\n\n')
    await new Promise((resolve) => setTimeout(resolve, 10_000))
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
