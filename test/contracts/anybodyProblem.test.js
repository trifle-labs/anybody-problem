import { expect } from 'chai'
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
  getTicksRun
  // generateProof
} from '../../scripts/utils.js'

import { Anybody } from '../../dist/module.js'

// let tx
describe('AnybodyProblem Tests', function () {
  this.timeout(50000000)

  it('has the correct verifiers, externalMetadata, speedruns addresses', async () => {
    const deployedContracts = await deployContractsV0({ verbose: false })
    const { AnybodyProblemV0: anybodyProblemV0 } = deployedContracts
    for (const [name, contract] of Object.entries(deployedContracts)) {
      if (name === 'AnybodyProblemV0') continue
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
      if (name === 'AnybodyProblem') continue
      if (name === 'ThemeGroup') continue
      if (name === 'verifiers') continue
      if (name === 'verifiersTicks') continue
      if (name === 'verifiersBodies') continue
      if (name === 'verificationData') continue
      if (name.indexOf('Assets') > -1) continue
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
    const { AnybodyProblem: anybodyProblem } = deployedContracts
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
    const startingRadius = await anybodyProblem.startingRadius()
    const maxRadius = ethers.BigNumber.from(5 * 5).add(startingRadius)
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
      .withArgs(owner.address, runId, 1, time, day)
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
    const { AnybodyProblem: anybodyProblem, Speedruns: speedruns } =
      await deployContracts({ mock: true })
    await anybodyProblem.updateProceedRecipient(acct1.address)

    const proceedRecipient = await anybodyProblem.proceedRecipient()
    const balanceBefore = await ethers.provider.getBalance(proceedRecipient)

    let runId = 0,
      tx
    const day = await anybodyProblem.currentDay()

    let accumulativeTime = 0
    for (let i = 0; i < 5; i++) {
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

    await expect(tx)
      .to.emit(anybodyProblem, 'RunSolved')
      .withArgs(owner.address, runId, accumulativeTime, day)
    const mintingFee = await anybodyProblem.priceToSave()
    const discount = await anybodyProblem.discount()
    const price = (await anybodyProblem.priceToMint())
      .div(discount)
      .add(mintingFee)

    // as first run it will be fastest and thus price is waived

    await expect(tx)
      .to.emit(anybodyProblem, 'EthMoved')
      .withArgs(proceedRecipient, true, '0x', 0)

    await expect(tx)
      .to.emit(anybodyProblem, 'EthMoved')
      .withArgs(owner.address, true, '0x', price)

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
    const { AnybodyProblem: anybodyProblem, Speedruns: speedruns } =
      await deployContracts({ mock: true, verbose: false })
    let runId = 0
    const day = await anybodyProblem.currentDay()
    let accumulativeTime = 0
    const finalArgs = [null, true, 0, [], [], [], [], []]
    let finalRunId
    for (let i = 0; i < 5; i++) {
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

    const tx = await anybodyProblem.batchSolve(...finalArgs, { value: price })
    await tx.wait()

    await expect(tx)
      .to.emit(anybodyProblem, 'RunSolved')
      .withArgs(owner.address, finalRunId, accumulativeTime, day)

    // as first run, it will be fastest and thus price is waived
    const proceedRecipient = await anybodyProblem.proceedRecipient()

    await expect(tx)
      .to.emit(anybodyProblem, 'EthMoved')
      .withArgs(proceedRecipient, true, '0x', 0)

    await expect(tx)
      .to.emit(anybodyProblem, 'EthMoved')
      .withArgs(owner.address, true, '0x', price)

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
    const contractBodyData = contractLevelData.bodyData
      .slice(0, level + 1)
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
    const level = await anybodyProblem.getLevelFromInputs(Input)
    expect(level[0]).to.equal(1)
    expect(level[1]).to.equal(0)
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
    const level = await anybodyProblem.getLevelFromInputs(Input)
    expect(level[0]).to.equal(1)
    expect(level[1]).to.equal(1)
  })

  it('returns correct currentLevel', async () => {
    const [owner] = await ethers.getSigners()
    const { AnybodyProblem: anybodyProblem } = await deployContracts({
      mock: true
    })

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

  it('performs an upgrade and the records are correct', async () => {
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
    for (let i = 0; i < 5; i++) {
      const level = i + 1
      const solvedReturn = await solveLevel(
        owner.address,
        AnybodyProblemV0,
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

    const mintingFee = await AnybodyProblemV0.priceToSave()
    const discount = await AnybodyProblemV0.discount()
    const price = (await AnybodyProblemV0.priceToMint())
      .div(discount)
      .add(mintingFee)
    expect(finalArgs.length).to.equal(8)

    const tx = await AnybodyProblemV0.batchSolve(...finalArgs, { value: price })

    await expect(tx)
      .to.emit(AnybodyProblemV0, 'RunSolved')
      .withArgs(owner.address, finalRunId, accumulativeTime, day)

    const speedrunBalance = await Speedruns.balanceOf(owner.address, day)
    expect(speedrunBalance).to.equal(1)

    const proceedRecipient = await AnybodyProblemV0.proceedRecipient()
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
    expect(gamesPlayed.streak).to.equal(1)

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
      for (let i = 0; i < 5; i++) {
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

  it.skip('tests an arbitrary tx', async () => {
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
