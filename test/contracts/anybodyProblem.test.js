import { expect } from 'chai'
import { describe, it } from 'mocha'

import hre from 'hardhat'
const ethers = hre.ethers

import {
  deployContracts,
  deployContractsV0,
  deployAnybodyProblemV1,
  /*splitterAddress,*/
  getParsedEventLogs,
  solveLevel,
  // mintProblem,
  generateAndSubmitProof,
  getTicksRun,
  proceedRecipient,
  earlyMonday
  // generateProof
} from '../../scripts/utils.js'

import { Anybody, LEVELS } from '../../dist/module.js'

// let tx
describe('AnybodyProblem Tests', function () {
  this.timeout(50000000)

  it('has the correct verifiers, externalMetadata, speedruns addresses', async () => {
    const deployedContracts = await deployContractsV0({ verbose: false })
    const { AnybodyProblemV0: anybodyProblemV0 } = deployedContracts
    for (const [name, contract] of Object.entries(deployedContracts)) {
      if (name === 'AnybodyProblem') continue
      if (name === 'AnybodyProblemV0') continue
      if (name === 'AnybodyProblemV1') continue
      if (name === 'AnybodyProblemV2') continue
      if (name === 'ThemeGroup') continue
      if (name === 'verifiers') continue
      if (name === 'verifiersTicks') continue
      if (name === 'verifiersBodies') continue
      if (name === 'verificationData') continue
      if (name.indexOf('Assets') > -1) continue
      let storedAddress
      if (name.indexOf('Verifier') > -1) {
        const bodyCount = name.split('_')[1]
        storedAddress = await anybodyProblemV0.verifiers(
          bodyCount,
          await getTicksRun(bodyCount)
        )
      } else {
        const functionName = name.charAt(0).toLowerCase() + name.slice(1)
        try {
          storedAddress = await anybodyProblemV0[`${functionName}()`]()
        } catch (e) {
          console.error({ functionName, e })
        }
      }
      const actualAddress = contract.address
      expect(storedAddress).to.equal(actualAddress)
    }

    const upgradedContracts = await deployAnybodyProblemV1({
      verbose: false,
      AnybodyProblemV0: anybodyProblemV0,
      Speedruns: deployedContracts.Speedruns,
      ExternalMetadata: deployedContracts.ExternalMetadata
    })

    const { AnybodyProblem: anybodyProblem } = upgradedContracts
    for (const [name, contract] of Object.entries(upgradedContracts)) {
      if (name === 'ThemeGroup') continue
      if (name === 'verifiers') continue
      if (name === 'verifiersTicks') continue
      if (name === 'verifiersBodies') continue
      if (name === 'verificationData') continue
      if (name.indexOf('Assets') > -1) continue
      if (name.indexOf('AnybodyProblem') > -1) continue
      let storedAddress
      if (name.indexOf('Verifier') > -1) {
        const bodyCount = name.split('_')[1]
        storedAddress = await anybodyProblem.verifiers(
          bodyCount,
          await getTicksRun(bodyCount)
        )
      } else {
        const functionName = name.charAt(0).toLowerCase() + name.slice(1)
        try {
          storedAddress = await anybodyProblem[`${functionName}()`]()
        } catch (e) {
          console.error({ functionName, e })
        }
      }
      const actualAddress = contract.address
      expect(storedAddress).to.equal(actualAddress)
    }
  })

  it('stores the verifiers in the correct order of the mapping', async () => {
    const deployedContracts = await deployContracts()
    const { AnybodyProblem: anybodyProblem, AnybodyProblemV4 } =
      deployedContracts
    expect(AnybodyProblemV4.address).to.equal(anybodyProblem.address)
    for (const [name, contract] of Object.entries(deployedContracts)) {
      if (name.indexOf('Verifier') === -1) continue
      const bodyCount = parseInt(name.split('_')[1])
      if (!(bodyCount == 4 || bodyCount == 6)) continue
      const tickCount = await getTicksRun(bodyCount)
      const storedAddress = await anybodyProblem.verifiers(bodyCount, tickCount)
      const actualAddress = contract.address
      expect(storedAddress).to.equal(actualAddress)
    }
  })

  it.skip('starts week correctly', async () => {
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
      { name: 'updateProceedRecipient', args: [addr1.address] },
      { name: 'updateSpeedrunsAddress', args: [addr1.address] },
      { name: 'updateVerifier', args: [addr1.address, 0, 0] },
      { name: 'recoverUnsuccessfulPayment', args: [addr1.address] },
      { name: 'updateDiscount', args: [0] },
      { name: 'updatePriceToSave', args: [0] },
      { name: 'updatePriceToMint', args: [0] },
      { name: 'updatePaused', args: [true] }
    ]

    for (const { name, args } of functions) {
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

  it('creates a proof for level 1', async () => {
    const signers = await ethers.getSigners()
    const [owner] = signers
    const deployedContracts = await deployContracts()
    const { AnybodyProblem: anybodyProblem } = deployedContracts
    await anybodyProblem.setTest(true)

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
    const allLevelData = await anybodyProblem.getLevelsData(runId)
    const level = await anybodyProblem.currentLevel(runId)
    const levelIndex = level - 1
    const levelData = allLevelData[levelIndex]
    // console.dir({ levelData }, { depth: null })
    const windowWidth = await anybodyProblem.windowWidth()
    const maxVector = await anybodyProblem.maxVector()
    const scalingFactor = await anybodyProblem.scalingFactor()

    const maxVectorScaled = maxVector.mul(scalingFactor)

    expect(levelData.solved).to.equal(false)
    expect(
      levelData.tmpBodyData.filter((b) => parseInt(b.seed) !== 0).length
    ).to.equal(bodyCount)
    expect(levelData.time).to.equal(proofLength)
    // const startingRadius = await anybodyProblem.startingRadius()
    const maxRadius = ethers.BigNumber.from(30)
    const firstBodyRadius = ethers.BigNumber.from(36)

    // confirm new values are stored correctly
    for (let i = 0; i < bodyCount; i++) {
      const bodyData = levelData.tmpBodyData[i]
      const { bodyIndex, px, py, vx, vy, radius, seed } = bodyData
      expect(i).to.equal(bodyIndex)
      expect(seed).to.not.equal(0)

      expect(px).to.equal(bodyFinal[i][0].toString())
      expect(px).to.not.equal(0)
      expect(px.lt(windowWidth)).to.be.true

      expect(py).to.equal(bodyFinal[i][1].toString())
      expect(py).to.not.equal(0)
      expect(py.lt(windowWidth)).to.be.true

      expect(vx).to.equal(bodyFinal[i][2].toString())
      expect(vy).to.equal(bodyFinal[i][3].toString())

      expect(vx.lte(maxVectorScaled.mul(2))).to.be.true
      expect(vy.lte(maxVectorScaled.mul(2))).to.be.true

      expect(radius).to.equal(bodyFinal[i][4].toString())

      expect(radius).to.not.equal(0)
      if (i !== 0) {
        expect(radius.lte(maxRadius.mul(scalingFactor))).to.be.true
      } else {
        expect(radius.eq(firstBodyRadius.mul(scalingFactor))).to.be.true
      }
    }
  })

  it('solves the first level using mock', async () => {
    const [owner] = await ethers.getSigners()
    const { AnybodyProblem: anybodyProblem } = await deployContracts({
      mock: true
    })

    await anybodyProblem.setTest(true)

    let runId = 0
    const day = await anybodyProblem.currentDay()
    const level = 1
    const solvedReturn = await solveLevel(
      owner.address,
      anybodyProblem,
      expect,
      runId,
      level
    )
    runId = solvedReturn.runId
    const tx = solvedReturn.tx
    const time = solvedReturn.time
    await expect(tx)
      .to.emit(anybodyProblem, 'LevelSolved')
      .withArgs(owner.address, runId, level, time, day)
  })

  it('must be unpaused', async function () {
    // const [owner] = await ethers.getSigners()
    const { AnybodyProblem: anybodyProblem } = await deployContracts({
      mock: true
    })
    await anybodyProblem.updatePaused(true)
    await expect(
      anybodyProblem.batchSolve(0, true, 0, [], [], [], [], [])
    ).to.be.revertedWith('Contract is paused')
  })

  it('solves all levels async using mock', async () => {
    const [owner, acct1] = await ethers.getSigners()
    const {
      AnybodyProblem: anybodyProblem,
      AnybodyProblemV0: anybodyProblemV0,
      AnybodyProblemV1: anybodyProblemV1,
      AnybodyProblemV2: anybodyProblemV2,
      AnybodyProblemV3: anybodyProblemV3,
      AnybodyProblemV4: anybodyProblemV4,
      Speedruns: speedruns,
      Tournament
    } = await deployContracts({ mock: true, verbose: false })
    await Tournament.setFirstMonday(earlyMonday)
    await anybodyProblem.setTest(true)

    await anybodyProblem.setTest(true)

    const levelTest = 2
    const [, bodyCount] = await anybodyProblem.generateLevelData(0, levelTest)
    expect(bodyCount).to.equal(levelTest + 2)

    await anybodyProblem.updateProceedRecipient(acct1.address)

    const anybodyProblemV1Prev = await anybodyProblemV1.previousAB()
    expect(anybodyProblemV1Prev).to.equal(anybodyProblemV0.address)

    const anybodyProblemV2Prev = await anybodyProblemV2.previousAB()
    expect(anybodyProblemV2Prev).to.equal(anybodyProblemV1.address)

    const anybodyProblemV3Prev = await anybodyProblemV3.previousAB()
    expect(anybodyProblemV3Prev).to.equal(anybodyProblemV2.address)

    const anybodyProblemV4Prev = await anybodyProblemV4.previousAB()
    expect(anybodyProblemV4Prev).to.equal(anybodyProblemV3.address)

    expect(anybodyProblemV4.address).to.equal(anybodyProblem.address)

    const proceedRecipient = await anybodyProblem.proceedRecipient()
    const balanceBefore = await ethers.provider.getBalance(proceedRecipient)

    let runId = 0,
      tx
    const day = await anybodyProblem.currentDay()
    const speedrunsAddress = await anybodyProblem.speedruns()
    expect(speedrunsAddress).to.equal(speedruns.address)

    const anybodyAddressInSpeedruns = await speedruns.anybodyProblem()
    expect(anybodyAddressInSpeedruns).to.equal(anybodyProblem.address)

    let accumulativeTime = 0
    for (let i = 0; i < LEVELS; i++) {
      const level = i + 1
      const solvedReturn = await solveLevel(
        owner.address,
        anybodyProblem,
        expect,
        runId,
        level
      )
      runId = solvedReturn.runId
      tx = solvedReturn.tx
      accumulativeTime += parseInt(solvedReturn.time)
    }
    const streak = 1

    await expect(tx)
      .to.emit(anybodyProblem, 'RunSolved')
      .withArgs(owner.address, runId, accumulativeTime, day, streak)
    const mintingFee = await anybodyProblem.priceToSave()
    const discount = await anybodyProblem.discount()
    const price = (await anybodyProblem.priceToMint())
      .div(discount)
      .add(mintingFee)

    expect(price).to.equal(0)

    // as first run it will be fastest and thus price is waived

    await expect(tx)
      .to.emit(anybodyProblem, 'EthMoved')
      .withArgs(proceedRecipient, true, '0x', 0)

    if (!price.eq(0)) {
      await expect(tx)
        .to.emit(anybodyProblem, 'EthMoved')
        .withArgs(owner.address, true, '0x', price)
    }

    const balanceAfter = await ethers.provider.getBalance(proceedRecipient)
    expect(balanceAfter.sub(balanceBefore)).to.equal(0)

    const speedrunBalance = await speedruns.balanceOf(owner.address, day)
    expect(speedrunBalance).to.equal(1)

    const fastestRuns = await anybodyProblem.fastestByDay(day)
    expect(fastestRuns[0]).to.equal(runId)

    const mostGames = await anybodyProblem.mostGames(0)
    expect(mostGames).to.equal(owner.address)
    const gamesPlayed = await anybodyProblem.gamesPlayed(owner.address)
    expect(gamesPlayed.total).to.equal(1)
    expect(gamesPlayed.lastPlayed).to.equal(day)
    expect(gamesPlayed.streak).to.equal(1)
  })

  it('solves all levels in a single tx', async () => {
    const [owner] = await ethers.getSigners()
    const {
      AnybodyProblem: anybodyProblem,
      Speedruns: speedruns,
      Tournament
    } = await deployContracts({ mock: true, verbose: false })
    await Tournament.setFirstMonday(earlyMonday)

    await anybodyProblem.setTest(true)

    let runId = 0
    const day = await anybodyProblem.currentDay()
    let accumulativeTime = 0
    const finalArgs = [null, true, 0, [], [], [], [], []]
    let finalRunId
    for (let i = 0; i < LEVELS; i++) {
      const level = i + 1
      const solvedReturn = await solveLevel(
        owner.address,
        anybodyProblem,
        expect,
        runId,
        level,
        false
      )
      const args = solvedReturn.args
      const time = solvedReturn.time
      finalRunId = solvedReturn.runId
      accumulativeTime += parseInt(time)
      finalArgs[0] = runId
      finalArgs[1] = true // alsoMint
      finalArgs[2] = 0 // day
      finalArgs[3].push(args[3][0])
      finalArgs[4].push(args[4][0])
      finalArgs[5].push(args[5][0])
      finalArgs[6].push(args[6][0])
      finalArgs[7].push(args[7][0])
    }

    const mintingFee = await anybodyProblem.priceToSave()
    const discount = await anybodyProblem.discount()
    const price = (await anybodyProblem.priceToMint())
      .div(discount)
      .add(mintingFee)

    expect(finalArgs.length).to.equal(8)

    expect(price).to.equal(0)

    const tx = await anybodyProblem.batchSolve(...finalArgs, { value: price })
    await tx.wait()

    const streak = 1

    await expect(tx)
      .to.emit(anybodyProblem, 'RunSolved')
      .withArgs(owner.address, finalRunId, accumulativeTime, day, streak)

    // as first run, it will be fastest and thus price is waived
    // const proceedRecipient = await anybodyProblem.proceedRecipient()

    await expect(tx)
      .to.emit(anybodyProblem, 'EthMoved')
      .withArgs(proceedRecipient, true, '0x', 0)
    if (!price.eq(0)) {
      await expect(tx)
        .to.emit(anybodyProblem, 'EthMoved')
        .withArgs(owner.address, true, '0x', price)
    }
    const speedrunBalance = await speedruns.balanceOf(owner.address, day)
    expect(speedrunBalance).to.equal(1)

    const fastestRuns = await anybodyProblem.fastestByDay(day)
    expect(fastestRuns[0]).to.equal(finalRunId)

    const mostGames = await anybodyProblem.mostGames(0)
    expect(mostGames).to.equal(owner.address)

    const gamesPlayed = await anybodyProblem.gamesPlayed(owner.address)
    expect(gamesPlayed.total).to.equal(1)
    expect(gamesPlayed.lastPlayed).to.equal(day)
    expect(gamesPlayed.streak).to.equal(1)
  })

  it('has the same results for generateLevelData as anybody.js', async () => {
    const SECONDS_IN_A_DAY = 86400
    const day =
      Math.floor(Date.now() / 1000) -
      (Math.floor(Date.now() / 1000) % SECONDS_IN_A_DAY)
    const level = 1
    const { AnybodyProblem: anybodyProblem } = await deployContracts()
    const contractLevelData = await anybodyProblem.generateLevelData(day, level)
    const bodyCount = contractLevelData.bodyCount
    const contractBodyData = contractLevelData.bodyData
      .slice(0, bodyCount.toNumber())
      .map((body) => {
        const newBody = {}
        newBody.bodyIndex = body.bodyIndex.toNumber()
        newBody.px = body.px.toNumber()
        newBody.py = body.py.toNumber()
        newBody.vx = body.vx.toNumber()
        newBody.vy = body.vy.toNumber()
        newBody.radius = body.radius.toNumber()
        newBody.seed = body.seed
        return newBody
      })

    const anybody = new Anybody(null, {
      util: true
    })
    const anybodyLevelData = anybody.generateLevelData(day, level)
    expect(contractBodyData).to.deep.equal(anybodyLevelData)
  })

  it('has correct getLevelFromInputs with no dummy', async () => {
    const Input = [
      '0',
      '1000000',
      '20000',
      '20000',
      '0',
      '754480',
      '773335',
      '14544',
      '14963',
      '36000',
      '820297',
      '695735',
      '15617',
      '15319',
      '0',
      '26',
      '1428531153118459510960519782658600836333166681489',
      '338153',
      '247056',
      '19800',
      '18689',
      '36000',
      '174915',
      '126128',
      '10361',
      '11593',
      '17000',
      '0',
      '1000000',
      '20000',
      '20000',
      '0'
    ]

    const { AnybodyProblem: anybodyProblem } = await deployContracts()
    const [intendedLevel, dummyCount] =
      await anybodyProblem.getLevelFromInputs(Input)
    expect(intendedLevel).to.equal(0) // would be level 0 since there are only 2 bodies
    expect(dummyCount).to.equal(0)
  })

  it('has correct getLevelFromInputs with dummy', async () => {
    const Input = [
      '0',
      '1000000',
      '20000',
      '20000',
      '0',
      '754480',
      '773335',
      '14544',
      '14963',
      '36000',
      '820297',
      '695735',
      '15617',
      '15319',
      '0',
      '0', // dummy x
      '0', // dummy y
      '20000', // dummy vx
      '20000', // dummy vy
      '0', // dummy radius
      '26',
      '1428531153118459510960519782658600836333166681489',
      '338153',
      '247056',
      '19800',
      '18689',
      '36000',
      '174915',
      '126128',
      '10361',
      '11593',
      '17000',
      '0', // dummy x
      '0', // dummy y
      '20000', // dummy vx
      '20000', // dummy vy
      '0', // dummy radius
      '0',
      '1000000',
      '20000',
      '20000',
      '0'
    ]

    const { AnybodyProblem: anybodyProblem } = await deployContracts()

    const [intendedLevel, dummyCount] =
      await anybodyProblem.getLevelFromInputs(Input)
    expect(intendedLevel).to.equal(0)
    expect(dummyCount).to.equal(1)
  })

  it('returns correct currentLevel', async () => {
    const [owner] = await ethers.getSigners()
    const { AnybodyProblem: anybodyProblem } = await deployContracts({
      mock: true
    })
    await anybodyProblem.setTest(true)

    let runId = 0
    let level = 1
    const solvedReturn = await solveLevel(
      owner.address,
      anybodyProblem,
      expect,
      runId,
      level
    )
    runId = solvedReturn.runId
    const newCurrentLevel = await anybodyProblem.currentLevel(runId)
    expect(newCurrentLevel).to.equal(2)
  })

  // this test doesn't make sense when migrating from 5 levels to 4
  it.skip('performs an upgrade and the records are correct', async () => {
    const [owner, acct2] = await ethers.getSigners()
    // play a game on v0 contract
    const { AnybodyProblemV0, Speedruns, ExternalMetadata } =
      await deployContractsV0({
        mock: true,
        verbose: false
      })

    let runId = 0
    const day = await AnybodyProblemV0.currentDay()
    let accumulativeTime = 0
    const finalArgs = [null, true, 0, [], [], [], [], []]
    let finalRunId
    for (let i = 0; i < LEVELS; i++) {
      const level = i + 1
      const solvedReturn = await solveLevel(
        owner.address,
        AnybodyProblemV0,
        expect,
        runId,
        level,
        false,
        true
      )
      const args = solvedReturn.args
      const time = solvedReturn.time
      finalRunId = solvedReturn.runId
      accumulativeTime += parseInt(time)
      finalArgs[0] = runId
      finalArgs[1] = true // alsoMint
      finalArgs[2] = 0 // day
      finalArgs[3].push(args[3][0])
      finalArgs[4].push(args[4][0])
      finalArgs[5].push(args[5][0])
      finalArgs[6].push(args[6][0])
      finalArgs[7].push(args[7][0])
    }

    const mintingFee = await AnybodyProblemV0.priceToSave()
    const discount = await AnybodyProblemV0.discount()
    const price = (await AnybodyProblemV0.priceToMint())
      .div(discount)
      .add(mintingFee)
    expect(finalArgs.length).to.equal(8)

    const tx = await AnybodyProblemV0.batchSolve(...finalArgs, { value: price })
    const streak = 1
    await expect(tx)
      .to.emit(AnybodyProblemV0, 'RunSolved')
      .withArgs(owner.address, finalRunId, accumulativeTime, day)

    const speedrunBalance = await Speedruns.balanceOf(owner.address, day)
    expect(speedrunBalance).to.equal(1)

    // const proceedRecipient = await AnybodyProblemV0.proceedRecipient()
    // in v0, the price is NOT waived for a winning run
    await expect(tx)
      .to.emit(AnybodyProblemV0, 'EthMoved')
      .withArgs(proceedRecipient, true, '0x', price)

    // check whether game is fastest, slowest and longest streak
    const fastestRuns = await AnybodyProblemV0.fastestByDay(day, 0)
    expect(fastestRuns).to.equal(finalRunId)

    const mostGames = await AnybodyProblemV0.mostGames(0)
    expect(mostGames).to.equal(owner.address)

    const gamesPlayed = await AnybodyProblemV0.gamesPlayed(owner.address)
    expect(gamesPlayed.total).to.equal(1)
    expect(gamesPlayed.lastPlayed).to.equal(day)
    expect(gamesPlayed.streak).to.equal(streak)

    const firstRunId = finalRunId

    const { AnybodyProblem: anybodyProblem } = await deployAnybodyProblemV1({
      mock: true,
      verbose: false,
      AnybodyProblemV0,
      Speedruns,
      ExternalMetadata
    })

    // play a game on upgraded contract that is faster (or same)
    if (anybodyProblem !== null) {
      let runId = 0
      const day = await anybodyProblem.currentDay()
      let accumulativeTime = 0
      const finalArgs = [null, true, 0, [], [], [], [], []]
      let finalRunId
      for (let i = 0; i < LEVELS; i++) {
        const level = i + 1
        const solvedReturn = await solveLevel(
          acct2.address,
          anybodyProblem,
          expect,
          runId,
          level,
          false
        )
        const args = solvedReturn.args
        const time = solvedReturn.time
        finalRunId = solvedReturn.runId
        accumulativeTime += parseInt(time)
        finalArgs[0] = runId
        finalArgs[1] = true // alsoMint
        finalArgs[2] = 0 // day
        finalArgs[3].push(args[3][0])
        finalArgs[4].push(args[4][0])
        finalArgs[5].push(args[5][0])
        finalArgs[6].push(args[6][0])
        finalArgs[7].push(args[7][0])
      }
      expect(firstRunId).to.not.equal(finalRunId)

      const mintingFee = await anybodyProblem.priceToSave()
      const discount = await anybodyProblem.discount()
      const price = (await anybodyProblem.priceToMint())
        .div(discount)
        .add(mintingFee)
      expect(finalArgs.length).to.equal(8)

      const tx = await anybodyProblem.connect(acct2).batchSolve(...finalArgs, {
        value: price
      })
      await tx.wait()

      await expect(tx)
        .to.emit(anybodyProblem, 'RunSolved')
        .withArgs(acct2.address, finalRunId, accumulativeTime, day)

      // price is 0 with winning run
      await expect(tx)
        .to.emit(anybodyProblem, 'EthMoved')
        .withArgs(proceedRecipient, true, '0x', 0)

      // refund is value attached to original tx
      await expect(tx)
        .to.emit(anybodyProblem, 'EthMoved')
        .withArgs(acct2.address, true, '0x', price)

      //check whether both players are included in fastest, slowest and longest streak
      const fastestRuns = await anybodyProblem.fastestByDay(day)
      expect(fastestRuns[0]).to.equal(firstRunId)
      expect(fastestRuns[1]).to.equal(finalRunId)

      const mostGames = await anybodyProblem.mostGames(0)
      expect(mostGames).to.equal(owner.address)

      const mostGames2 = await anybodyProblem.mostGames(1)
      expect(mostGames2).to.equal(acct2.address)

      const gamesPlayed = await anybodyProblem.gamesPlayed(acct2.address)
      expect(gamesPlayed.total).to.equal(1)
      expect(gamesPlayed.lastPlayed).to.equal(day)
      expect(gamesPlayed.streak).to.equal(1)

      const gamesPlayed2 = await anybodyProblem.gamesPlayed(owner.address)
      expect(gamesPlayed2.total).to.equal(1)
      expect(gamesPlayed2.lastPlayed).to.equal(day)
      expect(gamesPlayed2.streak).to.equal(1)
    }
  })

  // TODO: add exhaustive tests for topic and types
  // NOTE: this was changed to internal function so can't be tested as easily
  it.skip('emits arbitrary events within Speedruns', async () => {
    const [owner] = await ethers.getSigners()
    const { AnybodyProblem: anybodyProblem, Speedruns: speedruns } =
      await deployContracts()

    const metadataUpdateEvent = [
      {
        anonymous: false,
        inputs: [
          {
            indexed: false,
            name: 'tokenId',
            type: 'uint256'
          }
        ],
        name: 'MetadataUpdate',
        type: 'event'
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: false,
            name: '_fromTokenId',
            type: 'uint256'
          },
          {
            indexed: false,
            name: '_toTokenId',
            type: 'uint256'
          }
        ],
        name: 'BatchMetadataUpdate',
        type: 'event'
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            name: '_fromTokenId',
            type: 'uint256'
          },
          {
            indexed: true,
            name: '_toTokenId',
            type: 'uint256'
          },
          {
            indexed: false,
            name: 'who',
            type: 'address'
          }
        ],
        name: 'BatchMetadataUpdateIndexed',
        type: 'event'
      }
    ]
    const speedrunsABI = speedruns.interface.fragments.map((fragment) =>
      JSON.parse(fragment.format(ethers.utils.FormatTypes.json))
    )
    // Adding the new event to the ABI
    speedrunsABI.push(...metadataUpdateEvent)

    // Creating a new Interface with the updated ABI
    const mergedInterface = new ethers.utils.Interface(speedrunsABI)

    // Creating a new contract instance with the merged Interface
    const newSpeedrunsContract = new ethers.Contract(
      speedruns.address,
      mergedInterface,
      speedruns.signer
    )

    const tokenId = 1
    const tx = await anybodyProblem.emitMetadataUpdate(tokenId)
    await expect(tx)
      .to.emit(newSpeedrunsContract, 'MetadataUpdate')
      .withArgs(tokenId)

    const fromTokenId = 1
    const toTokenId = 100
    const tx2 = await anybodyProblem.emitBatchMetadataUpdate(
      fromTokenId,
      toTokenId
    )
    await expect(tx2)
      .to.emit(newSpeedrunsContract, 'BatchMetadataUpdate')
      .withArgs(fromTokenId, toTokenId)

    const tx3 = await anybodyProblem.exampleEmitMultipleIndexEvent(
      fromTokenId,
      toTokenId,
      owner.address
    )
    await expect(tx3)
      .to.emit(newSpeedrunsContract, 'BatchMetadataUpdateIndexed')
      .withArgs(fromTokenId, toTokenId, owner.address)
  })

  it.only('tests an arbitrary tx with args', async () => {
    const args = [
      0,
      true,
      1744848000,
      [250, 250, 250, 250, 250, 250],
      [
        [
          '5942448753533082852075323015781746162710171578928033467282160129170388911745',
          '8489177710005796140783604269754475372912989615866296189138012203791593492493'
        ],
        [
          '10018691713230542803887788004761546384485046063144612537029440372346506116686',
          '12078850300006225714861477859735664701415641864747928886496943876884316890376'
        ],
        [
          '8461202648241997437896093353935563791351272056387084544267907283920512692763',
          '3073377348612181941816486698432755840824578587355711718169541792739336859261'
        ],
        [
          '17994444056277897020424974863530732243405869735580092010999258114485313432174',
          '1287769939957751038920378604865313552436318014591235713434390980551310656785'
        ],
        [
          '4117704517869751521167853051606503266832067468142597431935444387765883703200',
          '9523286429501116955898842142393660405470305045845619560962586038812844259649'
        ],
        [
          '7061968620776141839354332758153689295199112839020465652428524109091580259130',
          '7197231713337970390984027807167548356456338517930434246715138323630606074833'
        ]
      ],
      [
        [
          [
            '20204633264679259804077513443110577412680372144198058234016165042141296482448',
            '3224105055732826432940131829542514570983510839649582503779529378254185344554'
          ],
          [
            '523377145271283122065209020350556221410881327045356730857769871439727540889',
            '8891272101408581066059019053351093804597767617121288233791206998396647277210'
          ]
        ],
        [
          [
            '14051562903680258128515428092669615455019237512390519229701699103189762809060',
            '14472140988580488546404311438420862462787428015077055132115071175997175050648'
          ],
          [
            '3195850968824508944526259736014328049348482169833263721307334868405399476466',
            '600366708881760144368971214917209912126678878719596569960723151647569694152'
          ]
        ],
        [
          [
            '17069634188520035483993783618165362847915594119579814378104964774744459723766',
            '17389447256613094876398507190160005297857007098051165972249384811881396747565'
          ],
          [
            '4331496336715835817543722527064905075935163168754592382765333881908885065795',
            '6008982331740332993381831577299068124210601163493118636386385276685640644288'
          ]
        ],
        [
          [
            '83708816223721399508327978315298622972940364253108483211600240740242728087',
            '14804723687564355424936092841595422968498901452982558529205803115740475761071'
          ],
          [
            '20112347356527665158507363131109699514331153347588439864768506787758203457755',
            '1864132328722055778464912470097624889935538677190917117819044796585168951071'
          ]
        ],
        [
          [
            '12303839148585303565300941839213731723763950220866666369187157623059923473439',
            '8043138412612071558273692203846554560673930733298736837022407283553753319495'
          ],
          [
            '11035459469528317437920708251301170761693770661759079574126835266463782664723',
            '13938781713136586026366656520089188237009261141772367376093835288000765389658'
          ]
        ],
        [
          [
            '633562332179125699416586937129706159887266035764432680562508059991103308214',
            '18500176874117485205038206069946289561336546162859839884098942046650637350485'
          ],
          [
            '3517135360927862359864620092120903704123836265438833623642658100481877281698',
            '6503601374194494737861154582094853540368601086991787261998064604539965262318'
          ]
        ]
      ],
      [
        [
          '1307255306903779936539971288589864472443402376469812228352669020658509743457',
          '17976214137230486747135055745467101433288688282698631653002444887807998484040'
        ],
        [
          '17670346010115054814819822708121451479507771008002331344904583806766721620191',
          '8452365534113811643217578230058325920516302485820650961798553266774979790705'
        ],
        [
          '10893013849598373455960910364945973638846258344331291446631086556785189534981',
          '19777247766346897611465038664715766908136363968646623744852464200424247956114'
        ],
        [
          '8356218386901553292960348508223730638144564798725993852931532249753076110881',
          '10823393117905693192975118062437907483167971221535563337630135895339929985870'
        ],
        [
          '5300175674217923931396085369186838974845828110744248516604914558847781164456',
          '273248876243664723207353522124609386972240180105263596032274653432785592392'
        ],
        [
          '8522055072631095986311414642716344232377122976184392734233709871902699662261',
          '13112535590901481273156475602412202885939571707517896710796270581555769337754'
        ]
      ],
      [
        [
          '0',
          '1000000',
          '0',
          '0',
          '0',
          '253394',
          '381312',
          '24087',
          '25296',
          '36000',
          '691320',
          '545315',
          '26584',
          '14095',
          '0',
          '8116',
          '327873',
          '22029',
          '23603',
          '0',
          '0',
          '0',
          '20000',
          '20000',
          '0',
          '68',
          '415051056843691714604327534844311119133868074016',
          '428254',
          '371406',
          '25073',
          '26138',
          '36000',
          '60288',
          '992677',
          '25478',
          '16307',
          '30000',
          '294596',
          '146662',
          '22149',
          '20549',
          '27000',
          '0',
          '0',
          '20000',
          '20000',
          '0',
          '0',
          '1000000',
          '0',
          '0',
          '0'
        ],
        [
          '0',
          '1000000',
          '0',
          '0',
          '0',
          '131376',
          '372610',
          '23128',
          '22009',
          '36000',
          '893800',
          '967279',
          '28200',
          '19959',
          '0',
          '349560',
          '458816',
          '29710',
          '10336',
          '0',
          '766370',
          '80717',
          '18085',
          '18183',
          '0',
          '120',
          '415051056843691714604327534844311119133868074016',
          '61152',
          '735216',
          '26382',
          '12553',
          '36000',
          '837546',
          '966769',
          '29284',
          '20965',
          '30000',
          '94132',
          '375161',
          '18340',
          '16958',
          '27000',
          '376247',
          '166291',
          '25117',
          '20011',
          '24000',
          '0',
          '1000000',
          '0',
          '0',
          '0'
        ],
        [
          '0',
          '1000000',
          '0',
          '0',
          '0',
          '792079',
          '862903',
          '27289',
          '24699',
          '36000',
          '294348',
          '748840',
          '20839',
          '16360',
          '0',
          '84980',
          '117960',
          '32140',
          '23932',
          '0',
          '471636',
          '212690',
          '28734',
          '13990',
          '0',
          '701431',
          '972251',
          '12315',
          '29149',
          '21000',
          '0',
          '0',
          '20000',
          '20000',
          '0',
          '250',
          '415051056843691714604327534844311119133868074016',
          '336919',
          '431353',
          '16491',
          '21719',
          '36000',
          '519772',
          '520361',
          '20251',
          '22098',
          '30000',
          '23010',
          '286047',
          '29600',
          '12600',
          '27000',
          '232234',
          '575045',
          '28614',
          '28040',
          '24000',
          '920285',
          '74882',
          '26361',
          '23673',
          '21000',
          '0',
          '0',
          '20000',
          '20000',
          '0',
          '0',
          '1000000',
          '0',
          '0',
          '0'
        ],
        [
          '0',
          '1000000',
          '0',
          '0',
          '0',
          '307450',
          '441388',
          '26149',
          '26491',
          '36000',
          '504098',
          '839840',
          '20839',
          '16360',
          '0',
          '97120',
          '98300',
          '32140',
          '23932',
          '0',
          '646316',
          '717530',
          '28734',
          '13990',
          '0',
          '90245',
          '838698',
          '13455',
          '27357',
          '0',
          '0',
          '0',
          '20000',
          '20000',
          '0',
          '48',
          '415051056843691714604327534844311119133868074016',
          '792079',
          '862903',
          '27289',
          '24699',
          '36000',
          '294348',
          '748840',
          '20839',
          '16360',
          '0',
          '84980',
          '117960',
          '32140',
          '23932',
          '0',
          '471636',
          '212690',
          '28734',
          '13990',
          '0',
          '701431',
          '972251',
          '12315',
          '29149',
          '21000',
          '0',
          '0',
          '20000',
          '20000',
          '0',
          '0',
          '1000000',
          '0',
          '0',
          '0'
        ],
        [
          '0',
          '1000000',
          '0',
          '0',
          '0',
          '799607',
          '495049',
          '25698',
          '21767',
          '36000',
          '751746',
          '820916',
          '17359',
          '28923',
          '0',
          '463532',
          '6931',
          '7524',
          '17464',
          '0',
          '940171',
          '244072',
          '19100',
          '27129',
          '24000',
          '219262',
          '284766',
          '34294',
          '5792',
          '21000',
          '759466',
          '818020',
          '2819',
          '31686',
          '0',
          '250',
          '415051056843691714604327534844311119133868074016',
          '403593',
          '51511',
          '22798',
          '25519',
          '36000',
          '785306',
          '495034',
          '24253',
          '17503',
          '30000',
          '545609',
          '239239',
          '24434',
          '18246',
          '27000',
          '98595',
          '328604',
          '12406',
          '24557',
          '24000',
          '114725',
          '282446',
          '24204',
          '25938',
          '21000',
          '942060',
          '93505',
          '10565',
          '20998',
          '18000',
          '0',
          '1000000',
          '0',
          '0',
          '0'
        ],
        [
          '0',
          '1000000',
          '0',
          '0',
          '0',
          '190940',
          '336583',
          '37602',
          '17715',
          '36000',
          '91496',
          '26769',
          '17359',
          '28923',
          '0',
          '376200',
          '373608',
          '7524',
          '17464',
          '0',
          '151123',
          '863997',
          '16658',
          '29931',
          '0',
          '283284',
          '614300',
          '24002',
          '7842',
          '0',
          '518932',
          '724532',
          '2819',
          '31686',
          '0',
          '247',
          '415051056843691714604327534844311119133868074016',
          '799607',
          '495049',
          '25698',
          '21767',
          '36000',
          '751746',
          '820916',
          '17359',
          '28923',
          '0',
          '463532',
          '6931',
          '7524',
          '17464',
          '0',
          '940171',
          '244072',
          '19100',
          '27129',
          '24000',
          '219262',
          '284766',
          '34294',
          '5792',
          '21000',
          '759466',
          '818020',
          '2819',
          '31686',
          '0',
          '0',
          '1000000',
          '0',
          '0',
          '0'
        ]
      ]
    ]

    const { AnybodyProblem: anybodyProblem } = await deployContracts({
      ignoreTesting: true
    })
    const tx = await anybodyProblem.batchSolve(...args)
    const receipt = await tx.wait()
    console.log({ receipt })
  })

  it.skip('tests an arbitrary tx with calldata', async () => {
    const data =
      '0xde89d1c1000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000c00000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000016000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000260000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000fa00000000000000000000000000000000000000000000000000000000000000010797708a8b4a5b5ca4d130516a67ec91479019237198043b206ecc778ad0fbab2aa7eb946891a657887d21e684d942e1d5c15a5a98eefc30f6229103df1d665f00000000000000000000000000000000000000000000000000000000000000010e01da515cffa24143ebaad38d1943686c53add8b3fba76971d26c2702416bf1213800b6edad0c16e0642e85ea71cc996cfc94ee9c7ac5c1f04a3cf8dcc66ae80c47814cab6702c7edc4db42142cd6f1e3ecce33973e42f3939bbae6efc8816d2db68caa7b405f717a6d5371c15a610ce18c2f0eaef91de5e70e1dccfeb2a494000000000000000000000000000000000000000000000000000000000000000112fe3a36a5144a89156bc90bef8f6c325b1b6a8d6feafdea9405b39d1c8dca4e19f13c9b709d4065996c7fe17bb8f310d2169c585d66ee3b38318050d23d1da1000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000034000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000f4240000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002a73e000000000000000000000000000000000000000000000000000000000007d610000000000000000000000000000000000000000000000000000000000000576e00000000000000000000000000000000000000000000000000000000000077eb0000000000000000000000000000000000000000000000000000000000008ca000000000000000000000000000000000000000000000000000000000000a011300000000000000000000000000000000000000000000000000000000000147b100000000000000000000000000000000000000000000000000000000000053c900000000000000000000000000000000000000000000000000000000000047440000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000004e200000000000000000000000000000000000000000000000000000000000004e200000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000004e200000000000000000000000000000000000000000000000000000000000004e2000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000053000000000000000000000000fa398d672936dcf428116f687244034961545d910000000000000000000000000000000000000000000000000000000000022770000000000000000000000000000000000000000000000000000000000002d54e00000000000000000000000000000000000000000000000000000000000066f800000000000000000000000000000000000000000000000000000000000051bf0000000000000000000000000000000000000000000000000000000000008ca000000000000000000000000000000000000000000000000000000000000b2ae7000000000000000000000000000000000000000000000000000000000002cf87000000000000000000000000000000000000000000000000000000000000443f0000000000000000000000000000000000000000000000000000000000006d700000000000000000000000000000000000000000000000000000000000006978000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000004e200000000000000000000000000000000000000000000000000000000000004e200000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000004e200000000000000000000000000000000000000000000000000000000000004e200000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000f4240000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000'
    const [owner] = await ethers.getSigners()
    const { AnybodyProblem: anybodyProblem } = await deployContracts({
      ignoreTesting: true
    })

    const tx = await owner.sendTransaction({
      to: anybodyProblem.address,
      data,
      value: ethers.utils.parseEther('0.0025'),
      from: owner.address
    })
    const receipt = await tx.wait()
    console.log({ receipt })
  })
})
