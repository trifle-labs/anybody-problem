import { expect } from 'chai'
import hre from 'hardhat'
const ethers = hre.ethers

import {
  deployContracts,
  /*splitterAddress,*/
  getParsedEventLogs,
  solveLevel,
  // mintProblem,
  generateAndSubmitProof,
  getTicksRun
  // generateProof
} from '../scripts/utils.js'

// import { Anybody } from '../src/anybody.js'

// let tx
describe('AnybodyProblem Tests', function () {
  this.timeout(50000000)

  it('starts week correctly', async () => {
    // const [owner] = await ethers.getSigners()
    const { AnybodyProblem: anybodyProblem } = await deployContracts()
    const SECONDS_IN_A_WEEK = await anybodyProblem.SECONDS_IN_A_WEEK()
    const week = await anybodyProblem.currentWeek()
    // const latestBlock = await hre.ethers.provider.getBlock('latest')
    // const timeUntilEndOfWeek = await anybodyProblem.timeUntilEndOfWeek()

    const nextSundayAt6pmUTC = new Date()
    nextSundayAt6pmUTC.setUTCHours(18, 0, 0, 0)
    nextSundayAt6pmUTC.setDate(
      nextSundayAt6pmUTC.getDate() +
        ((7 - nextSundayAt6pmUTC.getUTCDay() + 7) % 7)
    )
    const unixTime = Math.floor(nextSundayAt6pmUTC.getTime() / 1000)

    expect(unixTime).to.equal(week.add(SECONDS_IN_A_WEEK))
  })

  it('has the correct Speedruns addresses', async () => {
    const deployedContracts = await deployContracts()

    const { Speedruns: speedruns, AnybodyProblem: anybodyProblem } =
      deployedContracts
    const speedrunsAddress = await anybodyProblem.speedruns()
    expect(speedrunsAddress).to.equal(speedruns.address)
  })

  it('onlyOwner functions are really only Owner', async function () {
    const [, addr1] = await ethers.getSigners()
    const { AnybodyProblem: anybodyProblem } = await deployContracts()

    const functions = [
      { name: 'emitMetadataUpdate', args: [0] },
      { name: 'emitBatchMetadataUpdate', args: [0, 0] },
      { name: 'exampleEmitMultipleIndexEvent', args: [0, 0] },
      { name: 'updateProceedRecipient', args: [addr1.address] },
      { name: 'updateSpeedrunsAddress', args: [addr1.address] },
      { name: 'updateVerifier', args: [addr1.address, 0, 0] },
      { name: 'recoverUnsuccessfulPayment', args: [addr1.address] },
      { name: 'updatePrice', args: [0] },
      { name: 'updatePaused', args: [true] }
    ]

    for (const { name, args } of functions) {
      // console.log({ name, args })
      await expect(
        anybodyProblem.connect(addr1)[name](...args)
      ).to.be.revertedWith('Ownable: caller is not the owner')
      await expect(anybodyProblem[name](...args)).to.not.be.reverted
    }
  })

  it('fallback and receive functions revert', async () => {
    const [owner] = await ethers.getSigners()
    const { AnybodyProblem: anybodyProlem } = await deployContracts()
    await expect(
      owner.sendTransaction({ to: anybodyProlem.address, value: '1' })
    ).to.be.reverted
    await expect(
      owner.sendTransaction({ to: anybodyProlem.address, value: '0' })
    ).to.be.reverted
  })

  it('creates a proof for 1 bodies', async () => {
    const signers = await ethers.getSigners()
    const [owner] = signers
    const deployedContracts = await deployContracts()
    const { AnybodyProblem: anybodyProblem } = deployedContracts

    const day = await anybodyProblem.currentDay()
    let { bodyData, bodyCount } = await anybodyProblem.generateLevelData(day, 1)
    bodyData = bodyData.slice(0, bodyCount)

    const seed = '0x' + '0'.repeat(64)
    const proofLength = await getTicksRun(bodyCount)

    const { tx, bodyFinal } = await generateAndSubmitProof(
      owner.address,
      seed,
      expect,
      deployedContracts,
      0,
      proofLength,
      bodyData
    )

    const receipt = await tx.wait()
    const events = getParsedEventLogs(receipt, anybodyProblem, 'RunCreated')
    // console.dir({ events }, { depth: null })
    const runId = events[0].args.runId
    // console.log({ runId })
    // const run = await anybodyProblem.runs(runId)
    // console.dir({ run }, { depth: null })
    const allLevelData = await anybodyProblem.getLevelsData(runId)
    const level = await anybodyProblem.currentLevel(runId)
    const levelIndex = level - 1
    const levelData = allLevelData[levelIndex]
    // console.dir({ levelData }, { depth: null })

    expect(levelData.solved).to.equal(false)
    expect(
      levelData.tmpBodyData.filter((b) => parseInt(b.seed) !== 0).length
    ).to.equal(bodyCount)
    expect(levelData.time).to.equal(proofLength)

    // confirm new values are stored correctly
    for (let i = 0; i < bodyCount; i++) {
      const bodyData = levelData.tmpBodyData[i]
      const { px, py, vx, vy, radius } = bodyData
      expect(px).to.equal(bodyFinal[i][0].toString())
      expect(py).to.equal(bodyFinal[i][1].toString())
      expect(vx).to.equal(bodyFinal[i][2].toString())
      expect(vy).to.equal(bodyFinal[i][3].toString())
      expect(radius).to.equal(bodyFinal[i][4].toString())
    }
  })

  it('solves the first level', async () => {
    const [owner] = await ethers.getSigners()
    const { AnybodyProblem: anybodyProblem } = await deployContracts()
    let runId = 0
    const day = await anybodyProblem.currentDay()

    const solvedReturn = await solveLevel(anybodyProblem, expect, runId)
    runId = solvedReturn.runId
    const tx = solvedReturn.tx
    const time = solvedReturn.time
    await expect(tx)
      .to.emit(anybodyProblem, 'LevelSolved')
      .withArgs(owner.address, runId, 1, time, day)
  })

  it.only('solves all levels', async () => {
    const [owner] = await ethers.getSigners()
    const { AnybodyProblem: anybodyProblem, Speedruns: speedruns } =
      await deployContracts()
    let runId = 0,
      tx
    const day = await anybodyProblem.currentDay()
    let accumulativeTime = 0
    for (let i = 0; i < 5; i++) {
      const solvedReturn = await solveLevel(anybodyProblem, expect, runId)
      runId = solvedReturn.runId
      tx = solvedReturn.tx
      accumulativeTime += parseInt(solvedReturn.time)
    }
    await expect(tx)
      .to.emit(anybodyProblem, 'RunSolved')
      .withArgs(owner.address, runId, accumulativeTime, day)

    const price = await anybodyProblem.price()
    await expect(tx)
      .to.emit(anybodyProblem, 'EthMoved')
      .withArgs(owner.address, true, '0x', price)

    const speedrunBalance = await speedruns.balanceOf(owner.address)
    expect(speedrunBalance).to.equal(1)

    const fastestRun = await anybodyProblem.fastestByDay(day, 0)
    expect(fastestRun).to.equal(runId)

    const mostGames = await anybodyProblem.mostGames(0)
    expect(mostGames).to.equal(owner.address)

    const gamesPlayed = await anybodyProblem.gamesPlayed(owner.address)
    expect(gamesPlayed.total).to.equal(1)
    expect(gamesPlayed.lastPlayed).to.equal(day)
    expect(gamesPlayed.streak).to.equal(1)
  })

  it('solves all levels in a single tx', async () => {})
})
