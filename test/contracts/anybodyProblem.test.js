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
    const deployedContracts = await deployContractsV0()

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
      anybodyProblemV0: anybodyProblemV0,
      speedruns: deployedContracts.Speedruns,
      externalMetadata: deployedContracts.ExternalMetadata
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

    // console.log({ bodyCount, proofLength })

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
      '0x52d3e4ef000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000066d3ae80000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000004200000000000000000000000000000000000000000000000000000000000000a4000000000000000000000000000000000000000000000000000000000000016600000000000000000000000000000000000000000000000000000000000001c80000000000000000000000000000000000000000000000000000000000000001800000000000000000000000000000000000000000000000000000000000000fa00000000000000000000000000000000000000000000000000000000000000fa00000000000000000000000000000000000000000000000000000000000000fa00000000000000000000000000000000000000000000000000000000000000fa00000000000000000000000000000000000000000000000000000000000000fa00000000000000000000000000000000000000000000000000000000000000fa000000000000000000000000000000000000000000000000000000000000007d000000000000000000000000000000000000000000000000000000000000007d000000000000000000000000000000000000000000000000000000000000007d000000000000000000000000000000000000000000000000000000000000007d000000000000000000000000000000000000000000000000000000000000007d000000000000000000000000000000000000000000000000000000000000007d000000000000000000000000000000000000000000000000000000000000007d000000000000000000000000000000000000000000000000000000000000007d000000000000000000000000000000000000000000000000000000000000007d000000000000000000000000000000000000000000000000000000000000007d000000000000000000000000000000000000000000000000000000000000007d000000000000000000000000000000000000000000000000000000000000007d000000000000000000000000000000000000000000000000000000000000007d000000000000000000000000000000000000000000000000000000000000007d000000000000000000000000000000000000000000000000000000000000007d000000000000000000000000000000000000000000000000000000000000007d000000000000000000000000000000000000000000000000000000000000007d000000000000000000000000000000000000000000000000000000000000007d00000000000000000000000000000000000000000000000000000000000000182fb2ee99183705bd7ce77b209b2b2f06e673d78dc467e6c92e441fb64081f0a00901a0a5ad63ee06a3ed12b6a43d526f5bbb871a8896f680e813c74ed1b558db2f0fa32af6dced2c243f91a860998544dc72194aba443734bb19205e0999598925d0e6277eb8f198d9dc08a63f7cb7d812cfabe348d85c10513c362af14179ca2cf7a1a946308db46d7d5c93f5e7fde42a39260b3d7f7761b27edf155e773cf10d6204191115689c1e429deff9f365609d4512a77d1d5f4b55eaa91253bfc71c16ad63d5edc1a2b5258e7f625ef6665b272a87fd24c86aea6a6094a90dfd2cc72cbc9f8ed3acb40125f10dac56f0f42b9426dd7155f395e8209bac3391b694e90a2eb124dc11a3980ac6e07e230a97a05ba35f273cc3ae8eda995e412be705d411d2591dea6849f6548a99c46c85273e8003fd037cad0b4753b1970a639e3ae11d89d9fb86123384b15fcfe17a76deed8d9639fb559d10f927f92d34f92ba7c52e5fdcb023f0a86643d2c92499d5c0bdba87d3deeb63be765e98b65d50f731760f436443d133f7b919bb9cae93a1af66e0f9c145bbaadb805f38efa3cfe79ba028fa595ce9afa12fd80ef6a43f97b89ec4e94e175a857d69699ff1df2bc36ef92dedb49c2c4acd3485e42a9203f3144f1a3f2a102ca2f4c864734124e1121fe22eda130fa3051a3ca60e50f731a9c50d5ef1fba7ea47d3e1ff3af851e737cd71060a25bd68b0c3e45a069c80bed8c57501810d1e167da147cffe8b8f5c26ff600193225085b0a07a5f62d5faa6396865869681c1fb4bc55fc334f5b7e53d40c81b69b2e4550ef5f2478bb010666925ac06bd4a0b5d43b9315398fdc535d1e29d0e7ef44218946394fb828458b390b4b7bbb227f869f9883365932f95def5207006ee0eef12c4f2777063c6171a1823347e728a2265465b0b07840be64e0852b102762b51c84e5a23dbca6a7113a073fc17fa7a785aaa1f422d5722fd80e9c60d2db47ab64b64ff655fa97800ab829615200ae784b9104deba4acf979ebdaef4e2352bba301d83d8992e0e77d5f023e4f1eb7aa61b455350100ea978fe3c52bab0c7a0bd21b52a6331202330c872f2ff886abb10fe93e82462062f0406d1f3361281a8b4021634e932fb858599db33a3660e0da97cc47aad4ef4c74f322394be3300280c11cd9414baecab8709d63740573da9b02bcaa35c0260d2909fc73e9cd0daece51350e3861678eb67741d37a58bfaf86a6958c9816d036be989bef0b442f72d2730ad4ac962e314257163943cd933272073645c0da0d681527cd14b9501cba3149d9e0ec7bd103f5a9379a8a41ec591e466bf7c2038c20c4b9f279653d047c833c4b85d8129db1c405340a031fc2bb56791261c772606f2afc33899f49072d32cf321f626d31d04308ed3f4ce0791a4efbe3fa67db99abf6a9e80422131dc906d09bdee9e45f9c93a545d6fa68ed6963579e74606dbb383a0985c6a3910842df5867bd55da3a976648fae9607abb39b5c6db8ba47fa3f9a0cb20ab1722194f5cf220f55758a7d4cc65511055ec26447ee409f5a6c647ce22899873cc2c05bc3affbc06370f1d681735ab5a14b085ae0b9729d304714803538cf4a40f031c920f898eb1a371c26b90403ea7468afb7a2fdd6a9845a86337351ec69d485b1693f857b8377c74c285c00cc78c28d93880f7a6d5b4796ad24b05036c8328421c3d063413544384683a7f446592b74bf5a29368910eeba74bf47078ff4cd7d801726d0b0fa9377d1e2a9159a34b34bc575965c46bcb365dae8ab44c115d05bb10a82f353cb916ce7c4c308993cb339355f2b64efa5f96d3c0538912a2e1c6962139d6c43276e221d894687f521e07213d75bddd3f4c4f45fd9eef2f997d2dde0e11844a8797af5959d82697cd7f85be89a827e860dc331c472d18c592285e8315f3cbfebe5d0cd6ea60b3e8c0c0c5632db24039b6daa9a578ad310d8a28c48b1a65fd76e60227f57961d891767ca0d0d7463205ad5267fe6b6a8188b306c2a408b577899bc56b600d8812938210f6d80f25a22174074b9acfb7d372223d17270999fed36629fc6529548650cdd4821d125e8f37049fdc98876e6a3857a94fac0fbb0b56bfba55bc484be30a5f8a270eba36e58b4a4a26a6b4bcc1205fe8931f00000000000000000000000000000000000000000000000000000000000000180481cc73a3d4e471b15c0773b39488c99f0d78d7dcfa01f880d4ea921be162810327da63e718da3bcc31a1e274085043b2c72420ed5155a661b6d5ff35b2b4e90e66b1c55b8f7bd6cb0b5cf361c13264ff991e8b5409949481e9d0e2dad5536c22611915eb5361fe844c4278e4ce61604bb208b2bd01b10966b3ec7ee376ddf01ce9815e5a5b128ad82144cebe2f4c686b7baa3609d38cf7be837a0d4ce6ee502d93f50ce538088e0b064674780807c5ae8098c148510b7ec09d0f916e6239c81a2b11b4d800dfda3ea631974b9535ebc2b3aae81aa0d30556cffcf6581663ef2f47b6021ebd5567fe3bb6f71394f96089e73bb73e00854764539bb82b73a499193ece51644190b6ee4aa892d14a762113ea0750a79a1ad64fde478e0899c6af0eb0dd742d9f6e368a2b2e88da360bebebbe8e7dda08102af85e6c4f2b1170190d3a35877d15ebb1e848020115e41328e97a0a6ba26a4133adec990b84d4f5ab0ad0f8d12af1df75f2dc89f72306b9dcdbfb93e9c4335ced2c853b968d8c845e1190b29ae5d893f363e0a4afe23ae14600adddbbcceb20b9b9ac31d27057af0400fdc7be567a4a0353c0bcfa2ce2af7a375e621433b0e06c06eb977acd608e4a2eb791b0d2052a73f057e3189d92d320930bddebe4f5f50a0f63f61e1a5ee12d0095ceb64003038b1997a398f6f14fc1108f7a954d865b9eccd63bc13d46d4bd0a456462f3a3670a70fb31d48baf70de1e8079c0f7d366077a477fe2d20591800180ea5812b12a1e75518a02737af3d182e0a35c2284d4a0f826f715981bcee32fa83194d9fef6f66f925ff90484b71e1ecfcfe132936b55fabd670cd4f891a61d0c7646a6abe45789d29681bf9f9d4c76a6c6f79a50d44eabbf406aa1c1a49425e69b487c70103d2f0689a66e2c35c317e395480916f1af06c4e03e96b8cb3c2e225076f75e1d94e475b60b06ab5033e14a8ae3e7536390960c06e0492f2604194ddd7a233ccd469b989d3899b779ff55aafac58064187b4f77dfa47a77560f2efddce38920feb1934ff11be5c0b461e99eb53c0591c6dc25e354d4e0543cf818e671c715d9b882b72b2f6e27ea056dcaf8161002da102dcf7b46d78203ddc2228e682c09d99d178394095022cb85a4c5981ce5b8d70bb7f7d5eb8512f8e40904d50343981bbca41b7513fbe21aeb985afdc936d2db4f0e96cf17a0fbcee77308c7ade36a03dab97cbbf7b921c2b4acb5af83727a0f0cb2db7e6ff3acd170fc15dd84ef92d5c8df8ba121a65805843078e7ecf928774e6395a5287e1365039a19b630819c1e54395cfa66b14fc6db10ca9bd5a941d84b1d157e5d4d617e9a00261e00f8d9fb74751e1e74871e3f68291182deaa485e841566c6cf052141bab21d938329a31b676c99ef6b9fa6c55d6416b81a86490d6a00b282a78d8c4b8df815f7498b53214282f4408fb043872ee7b6094dc0a6582c1e2dece236063b030d0ffbaa9f3a363d339597d428911cd889de7ee1c5f197216adb23a9aa4feb813a0f4b306ffbd61b695738e1adf5279e20fa9885657f3fe0600fb8404ddd32407506d16bdbe2ad4a33561b6c6b165271e32c96fac6f13cbaee3b3ae2cd549b8a2923000827b1e9c1df8034c0917acc04f884d4180d9d0c09308362623b191e1c491c6f83e83561adf2d22bfb59ece3241399911cfd6ce0dd6df2ec9448cbca7af42f7cacf655efab869e70561231c03b0382927cd9dd9744afdb983ea15ec0445b1589b2190635a3fd3d8159e14bbe7e84a89c3c16ca91d06fef3077e3d136236d1db8abccc7ac79c169a8db4fcdb0d3b7a043057214114e53496fc8562fff9d5d18690c4024bfa298aad7c49dcb989df82882209832979b217d3c045166ff35fe13608eb609366a4f76c002f4e0975826f86155433879bfb40d32d93d4551ffe41b35175bafca856180587bcf39f3c388207e573c19b608f7c37bfcc405890a8f06a11987a89d40eb0e775c56cf7d54047f97396dbb68c97631699555197fa49e17c887beb83e6202680e981f3e24c4c37d6e7ef814383a0a3362e0316f6f25e42c26fcdf535d889803191c01e0d22353f5d3e085363add0614943862f9a03f461728124f3440950b9fc81bbdebc89671a0d96759270614ebca43383a838e8d8a21e8787c9a84b12789a602fa9d9ad55e96ef1862a0d58359847e303b089c2d9715ab3ffc7f728d6de3c01bbe6e2f4ad939c32122e8f9825dc9d3b427a257b54c006f21aefbb8572ed80698293b8e656ad851d97d2d31c8f8d8dbfc6b00acf31a2f96235c6027363172b7780c6764dfaac5fdd1727dbe1fe19255924f5edd400b126c3525958c3c3642ae54883b7b423472f237663ab9a4a9c20fe8d8a551bf430f1965065071433b7870f6bb8ef41f917754941f97a4e6ecb3ce1907d7452ef521e58b1578eee3e8990ff2d5c137f882b826586450e03d96de486274cb3561351181040e98ecab54f88c0fbefdfbf8469158a0dc1411d09e1d5fcb25392f54a4008e3891d9c523f74101fd45095c5e8f4c001b6c381d13ba5f5298e3b79bd2bf11ec1ec7232e110590b997786ecb6e7e71ebac636292f2cb59cf2bdca300e8072a81c10890fac6bd86fd2af3d726f73e4bf63d604b09209b26320c0c71d64b0b037737162583a7da77026a1ef0b010c4863bd3fc2e5dd902c704b0719e6dbda71a83ecc43193bf81ddd418bdec787736071056be52fd87fae5c8d042a70928762b139d0dd18f6ff36414876b2537192ce472c1c92de8abbf1c18707af4c9b2362e195577c11465f0235ea15697cfeb99e43bc93f787d463d972eeede32bfca1a17140214afaeeb7f58eef0bd8d793828fa517183362aa2b06c97f7bc03c7d757019da7d1b687dac9bfd2400d20564c58f881e2900609f08b47f170f444b805a22dfd06d8aa15f139117ff674d8bc494a8af19b66ec3efe94e269f6cb4dfca56503e68bc2db35b0ae806ee6a299ba1bd6f2373f621b1e9348c274eb6ed614a79d2bbc276222ee0e3320b5a4d8d05651c6e37dd19f07422a9e61abbfe7df7a869c30426a3f101254789036df49b2d300852d476552ba0ef4a4169917fb6a4f782c166deeeb97705a861d9b9e9b50e361c8d773c1fd1f1cdd669c2379fe1d01708029b9b138f9645733c77e09d6509b001ed71587ada225a32c91f5f07ce7e6524f05e6892f508f211abe7a494ad96eda50c631f22d6c3875f95ebd6df55afd4b7e06083ae81656a613af1cca6aff1cf8eb7a747149d99a3bded6293ec8e429ce2921e9d56d07cc08dcdd899985bdd850c54dcf28225ea07b1479abe6906527a4190511595155462991d554f851e7d2c3739b834128033abe20705339363e9edb8c1faf0e4425bea2592c5913cc967e7909ceb3a5baa7420815f0524ccbcd97f70615071040b09f01a4e9dd27c24f6bdeddd56895966503f5169b1c60f6c295d821079f8206e47a2bc28c678e649a858f047f531fff6741e31a688ea99ee33eafed1dd662f4e4a9e0d195c4e5cefd41d30405bb2426792d628fe2e98c33d1e1f6ae1b4558cce06e7e8892c76526aea8f1687bc58a150909cdb9613472ef2828fff5012c38a0c7498b3c032697c43ed094953da7145b5ffe1d3b23781e3602df267417397815ce336b27788a164e888750ee98970ffd42ab6f258ba56b721e615a9723ad5460f85be06b1161d15cc5fa9de0c80b18f8946de143d01e354b85c08d0c105953d4c0581c435c1c5b1366e5b960f92cd255126680e41db680994b1aa9f70bd581f4d62a8cc44c1b398ddcbd3f4ce73e5f652989f5461c5586392b7cb8021d3310e7649cd64ad4ccc7ea2fae30bad11d6a81d68f67220f9c2314b539536f2e901e04da24edc929037195a0e7b5dc57d07edd6ffc028392aa5c2f8fedbb550bedab7c7d51a9250f8e463a4c3d1bd1841f27e295f2c42f0112d0977732e07a045ce15eeef21f52b3b3518218a0bc9476d457572a1866d7a64a4aacee2479cc21d8dfd904c1f49d5f48b5d1aec009104f398b0d2792cb58f21f71320366f84027068df696631e6a4c9c2d03216cc35e8acbaad6751fde9f266793ed86e855de0c8faab5fd974afb7353c5d2efda0f60855f0822fff9cab8276dbb6e25d4fc9f2a681af7995e43303b104b43fd7e00c01963afd03f248ee9a9315e7364f59ee826b5631a77640d2fcb8b09e9ab1ea7d599984ccfa9a8ac81e96eca59314e52470978ca9745782c1539f7792535fb177c4aef2c85f8609d951a41231a9aaa983a27daf2ef2ded947f7e4eb9e38263f653bc8dbab42c36393b34f9a92e0b4ace2c00000000000000000000000000000000000000000000000000000000000000180bad623c8d4e58654a305914077ce9a5c54fcbe1cc6dfc07e51584e3093fc29d1d71af21c2de9ba39fb1642925872b8ce7161384deda93b16db8b060452b617a1759a119d21348217da8366e85a972908cdd2beedd912dc5264b67cd0370adba1169c277a932e1504894c88829bb1771db2e2c899c3f82e15a1cbbc49be21800301c372653e3021b4635406c6c11ce89c5f224213751e3fe9ea7ae5ee30e45b505b5c162b03a615c7c55801e39726a338b475fb15cb9fcbb7a72f505a991092c1208f7c0b6082dc0b4111ae3a384a070dedbcc53a7a934dc0ac5df93e95db76a13024633da82e7bf1c43a42db7f0e15f938d87753497661c0c025734138bb42f0b8adfb58cc3d1e5e7b5e3f407624fcca516def57f7d874d6a2eb2c4111234332859e0888fa77668a05e89e45d5bc15b596e9ef5479b9b60c94dc7a5b913ee641c16add73b5ef6b7cd594526dddef93d28f4042987a4532beeb8bc7e9b75261524b082b9843acdd3cd95189c6c45aaf44a8cebee6dfa5ddf55dfb7b07858203c2005f0e31ae5d2e53e2884e43d6cce9b74c616f9898f5aa105bbf9ba8f1a3a7a0708cb6857e94f5b1f535e62dccf62f6f86b10805b2f6860f8b7f415c923d6ea09dc1f621e51cfde3c9defb0df16e4b0f051e20989640978598f469ad1aa97eb0cb9613ea50bf1b3c5c38135b2c0437583561c625c591692885504344dbf4dfa0f8eebfdf1be842957bd5d7be6eff01a1eb28de6e50718ef6b5828c6a71553822d8ecdee2040bae49652cf152e0403a472bdd2d11a12f67e647528bbb5c81bc7228cb9b49c063e76d2f0afa49647de9db71ecda7c229383325932a5cc1610b800ebade4c0118190bf7f657d96337a70a5b4e0b017b61111bbd29ec492aba92081538ed7d4acc92a27d4a2c8ef0f74a9c3a3849a89cddda5bd25d224a2e47f7ed0b0eda582c760ba8b3a278cf685a27aff6dfd7fd820c67d08d728d58790822620746e29d2ee7f0a9754b4f9c7d0da24e4fe8c794f8c849bb18277b2b114a438e28274f92326c471e76252f353e3b0dcbf147edd078dae380fb24cf6b44c9d2a80b798ea0f1f68b540f8bb8f2380692aaa030453d75fbe2b714acdf474a5e48ac2bfb02fdbbf54a728c672e2af08f64e071e4037d5e664c9d9572e0f91e53747a1c3a719ab3b8f43578bd119e1ac656e55d873f1544c3b33683d554d9756404841ae8da1c29f81a222ec4545a31601ef4a12e80d656beec01688d2ca7272c70a62de38e4e23f3b5b08ff314e7802464625f555726e29ba88c239aa6c55b6fb9a025a87ca56eb01c77533d576b40f409ee372b29389681a00bbfb8b0ee570066860ccbdddd355f0ae3d6ab94e34b81577d0dc767631e79bc618aa6dcb520d103bf00c762f43329f857348e037617c01c617c77319fa6c2f5a309f3021a73b7790b1ef3c69e1a35659282664545a9cb1d1fc8b7a58e53595e821546d830db6106ce13b26ef62b1d6508a1fbca7265f35b471cfe8cd234f14dcc785d449dc99ca1812e792020ea6f4c980c0707e4ed93315f735da1753cf773ea56e46c666791598a2c93faa8a616bf3f72dc47b4023856eb3f1035cac3a8355bb35c694da6ec30a9276195a3cfa9b66ac6d4238ff7899049670b1804f69f4e80da63cef5fabcf6f21098b1ee83cd3c9ecd55181a2e0780b40bc5d17fecaa70d7112580884760d29e2286adc3691eda0f0547ef42ebf3b7cf05b26d789f8b0ce1d52878eb09235c140c3f92546edce7b197097f21d081146a2b87cc645cf5935b63fc3085321782e91a3a1f33f0368e2cf257fc3610eb07987e6f99f30f476c6cfa8c430c9481d58809d6472e58897d91442a853daae657470dfb7f738814043f3ec819b1c859ffa70b500b6dd9d5fbdfbcdfb55738c5bd912c1cf76221f32397150cd7c96e45ff0219b48fd05973e28f8cf701d3282705640817a9261429245f38786bf0daa44de41877b56e31cf0ad2ddfe5d361a5da04827b0c830bc41e6d22192b2eaaf1a5ffd1bb5f9476cc33c2cdca397da50bbc360a525442da0dc5e94d42de9a2accbcff2109f753f4fdc34dfdf9dbf251abba5ae644c5bfeb067a964160b89b3d356082e07128cb7afa580b11ee05265f3ad766edeeb3fdab7a615f9532a8d7ea8155dc50000000000000000000000000000000000000000000000000000000000000018000000000000000000000000000000000000000000000000000000000000030000000000000000000000000000000000000000000000000000000000000009a0000000000000000000000000000000000000000000000000000000000000104000000000000000000000000000000000000000000000000000000000000016e00000000000000000000000000000000000000000000000000000000000001d8000000000000000000000000000000000000000000000000000000000000024200000000000000000000000000000000000000000000000000000000000002ac000000000000000000000000000000000000000000000000000000000000033e00000000000000000000000000000000000000000000000000000000000003d0000000000000000000000000000000000000000000000000000000000000046200000000000000000000000000000000000000000000000000000000000004f40000000000000000000000000000000000000000000000000000000000000586000000000000000000000000000000000000000000000000000000000000061800000000000000000000000000000000000000000000000000000000000006aa000000000000000000000000000000000000000000000000000000000000073c00000000000000000000000000000000000000000000000000000000000007ce000000000000000000000000000000000000000000000000000000000000086000000000000000000000000000000000000000000000000000000000000008f200000000000000000000000000000000000000000000000000000000000009840000000000000000000000000000000000000000000000000000000000000a160000000000000000000000000000000000000000000000000000000000000aa80000000000000000000000000000000000000000000000000000000000000b3a0000000000000000000000000000000000000000000000000000000000000bcc0000000000000000000000000000000000000000000000000000000000000c5e00000000000000000000000000000000000000000000000000000000000000034000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000f42400000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000021030000000000000000000000000000000000000000000000000000000000001ffd00000000000000000000000000000000000000000000000000000000000006b780000000000000000000000000000000000000000000000000000000000003a720000000000000000000000000000000000000000000000000000000000008ca0000000000000000000000000000000000000000000000000000000000006308600000000000000000000000000000000000000000000000000000000000a451500000000000000000000000000000000000000000000000000000000000039680000000000000000000000000000000000000000000000000000000000002d490000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000004e200000000000000000000000000000000000000000000000000000000000004e200000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000004e200000000000000000000000000000000000000000000000000000000000004e20000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000d90000000000000000000000005b1b8283b0c9fdf0de950b891ee97cc151345c16000000000000000000000000000000000000000000000000000000000003bc9a00000000000000000000000000000000000000000000000000000000000ea87e000000000000000000000000000000000000000000000000000000000000571c00000000000000000000000000000000000000000000000000000000000030940000000000000000000000000000000000000000000000000000000000008ca000000000000000000000000000000000000000000000000000000000000b62f0000000000000000000000000000000000000000000000000000000000002f2bc0000000000000000000000000000000000000000000000000000000000004dc400000000000000000000000000000000000000000000000000000000000037270000000000000000000000000000000000000000000000000000000000006978000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000004e200000000000000000000000000000000000000000000000000000000000004e200000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000004e200000000000000000000000000000000000000000000000000000000000004e200000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000f42400000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000034000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000f4240000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000004a93e00000000000000000000000000000000000000000000000000000000000a1c5a0000000000000000000000000000000000000000000000000000000000005c2100000000000000000000000000000000000000000000000000000000000074700000000000000000000000000000000000000000000000000000000000008ca0000000000000000000000000000000000000000000000000000000000008516000000000000000000000000000000000000000000000000000000000000d58ee000000000000000000000000000000000000000000000000000000000000313c000000000000000000000000000000000000000000000000000000000000287a0000000000000000000000000000000000000000000000000000000000006978000000000000000000000000000000000000000000000000000000000004d7ee0000000000000000000000000000000000000000000000000000000000047c170000000000000000000000000000000000000000000000000000000000005dd200000000000000000000000000000000000000000000000000000000000073290000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000004e200000000000000000000000000000000000000000000000000000000000004e20000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000fa0000000000000000000000005b1b8283b0c9fdf0de950b891ee97cc151345c16000000000000000000000000000000000000000000000000000000000000f3ac0000000000000000000000000000000000000000000000000000000000073b7e0000000000000000000000000000000000000000000000000000000000004bbd000000000000000000000000000000000000000000000000000000000000718e0000000000000000000000000000000000000000000000000000000000008ca000000000000000000000000000000000000000000000000000000000000b73be00000000000000000000000000000000000000000000000000000000000eca860000000000000000000000000000000000000000000000000000000000003f86000000000000000000000000000000000000000000000000000000000000356e00000000000000000000000000000000000000000000000000000000000069780000000000000000000000000000000000000000000000000000000000049f4e00000000000000000000000000000000000000000000000000000000000f19410000000000000000000000000000000000000000000000000000000000005fec000000000000000000000000000000000000000000000000000000000000691700000000000000000000000000000000000000000000000000000000000059d8000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000004e200000000000000000000000000000000000000000000000000000000000004e200000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000f42400000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000034000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000f424000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000e1c1100000000000000000000000000000000000000000000000000000000000c5d2a0000000000000000000000000000000000000000000000000000000000006d8b0000000000000000000000000000000000000000000000000000000000007cdc0000000000000000000000000000000000000000000000000000000000008ca000000000000000000000000000000000000000000000000000000000000ee5a400000000000000000000000000000000000000000000000000000000000ba8d80000000000000000000000000000000000000000000000000000000000001fd2000000000000000000000000000000000000000000000000000000000000200e0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000004e7a0000000000000000000000000000000000000000000000000000000000009fb6d0000000000000000000000000000000000000000000000000000000000005dd200000000000000000000000000000000000000000000000000000000000073290000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000004e200000000000000000000000000000000000000000000000000000000000004e20000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000cf0000000000000000000000005b1b8283b0c9fdf0de950b891ee97cc151345c16000000000000000000000000000000000000000000000000000000000004a93e00000000000000000000000000000000000000000000000000000000000a1c5a0000000000000000000000000000000000000000000000000000000000005c2100000000000000000000000000000000000000000000000000000000000074700000000000000000000000000000000000000000000000000000000000008ca0000000000000000000000000000000000000000000000000000000000008516000000000000000000000000000000000000000000000000000000000000d58ee000000000000000000000000000000000000000000000000000000000000313c000000000000000000000000000000000000000000000000000000000000287a0000000000000000000000000000000000000000000000000000000000006978000000000000000000000000000000000000000000000000000000000004d7ee0000000000000000000000000000000000000000000000000000000000047c170000000000000000000000000000000000000000000000000000000000005dd200000000000000000000000000000000000000000000000000000000000073290000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000004e200000000000000000000000000000000000000000000000000000000000004e200000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000f42400000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000034000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000f424000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000c25f1000000000000000000000000000000000000000000000000000000000003cfb800000000000000000000000000000000000000000000000000000000000045f2000000000000000000000000000000000000000000000000000000000000146a0000000000000000000000000000000000000000000000000000000000008ca0000000000000000000000000000000000000000000000000000000000008e85f00000000000000000000000000000000000000000000000000000000000ea1c500000000000000000000000000000000000000000000000000000000000055b30000000000000000000000000000000000000000000000000000000000006a43000000000000000000000000000000000000000000000000000000000000697800000000000000000000000000000000000000000000000000000000000f09250000000000000000000000000000000000000000000000000000000000095efc00000000000000000000000000000000000000000000000000000000000048ef0000000000000000000000000000000000000000000000000000000000003501000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000b660c00000000000000000000000000000000000000000000000000000000000135f80000000000000000000000000000000000000000000000000000000000003b1f000000000000000000000000000000000000000000000000000000000000459b000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000fa0000000000000000000000005b1b8283b0c9fdf0de950b891ee97cc151345c1600000000000000000000000000000000000000000000000000000000000f313d0000000000000000000000000000000000000000000000000000000000013bca00000000000000000000000000000000000000000000000000000000000042760000000000000000000000000000000000000000000000000000000000002bdc0000000000000000000000000000000000000000000000000000000000008ca0000000000000000000000000000000000000000000000000000000000003fce900000000000000000000000000000000000000000000000000000000000003350000000000000000000000000000000000000000000000000000000000006c6d0000000000000000000000000000000000000000000000000000000000004d6f000000000000000000000000000000000000000000000000000000000000697800000000000000000000000000000000000000000000000000000000000758c0000000000000000000000000000000000000000000000000000000000002ce9e00000000000000000000000000000000000000000000000000000000000033cb00000000000000000000000000000000000000000000000000000000000044ed00000000000000000000000000000000000000000000000000000000000059d800000000000000000000000000000000000000000000000000000000000ea04400000000000000000000000000000000000000000000000000000000000abf240000000000000000000000000000000000000000000000000000000000003d050000000000000000000000000000000000000000000000000000000000003a050000000000000000000000000000000000000000000000000000000000004a38000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000f42400000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000034000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000f424000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000e0581000000000000000000000000000000000000000000000000000000000000901800000000000000000000000000000000000000000000000000000000000057ba0000000000000000000000000000000000000000000000000000000000000f120000000000000000000000000000000000000000000000000000000000008ca00000000000000000000000000000000000000000000000000000000000067171000000000000000000000000000000000000000000000000000000000004ac1b00000000000000000000000000000000000000000000000000000000000043eb0000000000000000000000000000000000000000000000000000000000006f9b0000000000000000000000000000000000000000000000000000000000006978000000000000000000000000000000000000000000000000000000000009f74b000000000000000000000000000000000000000000000000000000000000259a00000000000000000000000000000000000000000000000000000000000048ef0000000000000000000000000000000000000000000000000000000000003501000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000821e00000000000000000000000000000000000000000000000000000000000082b970000000000000000000000000000000000000000000000000000000000003b1f000000000000000000000000000000000000000000000000000000000000459b000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000fa0000000000000000000000005b1b8283b0c9fdf0de950b891ee97cc151345c1600000000000000000000000000000000000000000000000000000000000c25f1000000000000000000000000000000000000000000000000000000000003cfb800000000000000000000000000000000000000000000000000000000000045f2000000000000000000000000000000000000000000000000000000000000146a0000000000000000000000000000000000000000000000000000000000008ca0000000000000000000000000000000000000000000000000000000000008e85f00000000000000000000000000000000000000000000000000000000000ea1c500000000000000000000000000000000000000000000000000000000000055b30000000000000000000000000000000000000000000000000000000000006a43000000000000000000000000000000000000000000000000000000000000697800000000000000000000000000000000000000000000000000000000000f09250000000000000000000000000000000000000000000000000000000000095efc00000000000000000000000000000000000000000000000000000000000048ef0000000000000000000000000000000000000000000000000000000000003501000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000b660c00000000000000000000000000000000000000000000000000000000000135f80000000000000000000000000000000000000000000000000000000000003b1f000000000000000000000000000000000000000000000000000000000000459b0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000f42400000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000034000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000f424000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000cbfd7000000000000000000000000000000000000000000000000000000000000d2740000000000000000000000000000000000000000000000000000000000004b120000000000000000000000000000000000000000000000000000000000000f7c0000000000000000000000000000000000000000000000000000000000008ca00000000000000000000000000000000000000000000000000000000000071fbd000000000000000000000000000000000000000000000000000000000006966300000000000000000000000000000000000000000000000000000000000050930000000000000000000000000000000000000000000000000000000000006f310000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000004e5710000000000000000000000000000000000000000000000000000000000063b1c00000000000000000000000000000000000000000000000000000000000048ef00000000000000000000000000000000000000000000000000000000000035010000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000004ddb400000000000000000000000000000000000000000000000000000000000f202c0000000000000000000000000000000000000000000000000000000000003b1f000000000000000000000000000000000000000000000000000000000000459b000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000480000000000000000000000005b1b8283b0c9fdf0de950b891ee97cc151345c1600000000000000000000000000000000000000000000000000000000000e0581000000000000000000000000000000000000000000000000000000000000901800000000000000000000000000000000000000000000000000000000000057ba0000000000000000000000000000000000000000000000000000000000000f120000000000000000000000000000000000000000000000000000000000008ca00000000000000000000000000000000000000000000000000000000000067171000000000000000000000000000000000000000000000000000000000004ac1b00000000000000000000000000000000000000000000000000000000000043eb0000000000000000000000000000000000000000000000000000000000006f9b0000000000000000000000000000000000000000000000000000000000006978000000000000000000000000000000000000000000000000000000000009f74b000000000000000000000000000000000000000000000000000000000000259a00000000000000000000000000000000000000000000000000000000000048ef0000000000000000000000000000000000000000000000000000000000003501000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000821e00000000000000000000000000000000000000000000000000000000000082b970000000000000000000000000000000000000000000000000000000000003b1f000000000000000000000000000000000000000000000000000000000000459b0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000f42400000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000048000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000f42400000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000050b8e0000000000000000000000000000000000000000000000000000000000085e41000000000000000000000000000000000000000000000000000000000000622200000000000000000000000000000000000000000000000000000000000051b70000000000000000000000000000000000000000000000000000000000008ca00000000000000000000000000000000000000000000000000000000000078ed700000000000000000000000000000000000000000000000000000000000c45bf0000000000000000000000000000000000000000000000000000000000004fbb0000000000000000000000000000000000000000000000000000000000004e070000000000000000000000000000000000000000000000000000000000006978000000000000000000000000000000000000000000000000000000000006b0e000000000000000000000000000000000000000000000000000000000000d359400000000000000000000000000000000000000000000000000000000000009950000000000000000000000000000000000000000000000000000000000004f420000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000005003b00000000000000000000000000000000000000000000000000000000000405af000000000000000000000000000000000000000000000000000000000000516d0000000000000000000000000000000000000000000000000000000000002cdd00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000099af200000000000000000000000000000000000000000000000000000000000910ac0000000000000000000000000000000000000000000000000000000000003bce0000000000000000000000000000000000000000000000000000000000004153000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000f424000000000000000000000000000000000000000000000000000000000000f42400000000000000000000000000000000000000000000000000000000000004e200000000000000000000000000000000000000000000000000000000000004e200000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000007d0000000000000000000000005b1b8283b0c9fdf0de950b891ee97cc151345c16000000000000000000000000000000000000000000000000000000000002345a00000000000000000000000000000000000000000000000000000000000db89e000000000000000000000000000000000000000000000000000000000000277400000000000000000000000000000000000000000000000000000000000045710000000000000000000000000000000000000000000000000000000000008ca0000000000000000000000000000000000000000000000000000000000004ca84000000000000000000000000000000000000000000000000000000000000754a00000000000000000000000000000000000000000000000000000000000037550000000000000000000000000000000000000000000000000000000000002aaf000000000000000000000000000000000000000000000000000000000000697800000000000000000000000000000000000000000000000000000000000651d800000000000000000000000000000000000000000000000000000000000bfb5200000000000000000000000000000000000000000000000000000000000050a300000000000000000000000000000000000000000000000000000000000048ee00000000000000000000000000000000000000000000000000000000000059d8000000000000000000000000000000000000000000000000000000000001964200000000000000000000000000000000000000000000000000000000000a87160000000000000000000000000000000000000000000000000000000000005c6f00000000000000000000000000000000000000000000000000000000000054790000000000000000000000000000000000000000000000000000000000004a380000000000000000000000000000000000000000000000000000000000033fb600000000000000000000000000000000000000000000000000000000000f25030000000000000000000000000000000000000000000000000000000000003cd20000000000000000000000000000000000000000000000000000000000004fa90000000000000000000000000000000000000000000000000000000000003a98000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000004e200000000000000000000000000000000000000000000000000000000000004e200000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000f42400000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000048000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000f424000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000b5fcc000000000000000000000000000000000000000000000000000000000008cea40000000000000000000000000000000000000000000000000000000000005fb600000000000000000000000000000000000000000000000000000000000053bd0000000000000000000000000000000000000000000000000000000000008ca000000000000000000000000000000000000000000000000000000000000bc84200000000000000000000000000000000000000000000000000000000000d89e200000000000000000000000000000000000000000000000000000000000052270000000000000000000000000000000000000000000000000000000000004c010000000000000000000000000000000000000000000000000000000000006978000000000000000000000000000000000000000000000000000000000003bee700000000000000000000000000000000000000000000000000000000000dc32e00000000000000000000000000000000000000000000000000000000000009950000000000000000000000000000000000000000000000000000000000004f4200000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000069cd40000000000000000000000000000000000000000000000000000000000030ba6000000000000000000000000000000000000000000000000000000000000516d0000000000000000000000000000000000000000000000000000000000002cdd0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000a8e8000000000000000000000000000000000000000000000000000000000002d0930000000000000000000000000000000000000000000000000000000000003bce0000000000000000000000000000000000000000000000000000000000004153000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000f424000000000000000000000000000000000000000000000000000000000000f42400000000000000000000000000000000000000000000000000000000000004e200000000000000000000000000000000000000000000000000000000000004e200000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000007d0000000000000000000000005b1b8283b0c9fdf0de950b891ee97cc151345c160000000000000000000000000000000000000000000000000000000000050b8e0000000000000000000000000000000000000000000000000000000000085e41000000000000000000000000000000000000000000000000000000000000622200000000000000000000000000000000000000000000000000000000000051b70000000000000000000000000000000000000000000000000000000000008ca00000000000000000000000000000000000000000000000000000000000078ed700000000000000000000000000000000000000000000000000000000000c45bf0000000000000000000000000000000000000000000000000000000000004fbb0000000000000000000000000000000000000000000000000000000000004e070000000000000000000000000000000000000000000000000000000000006978000000000000000000000000000000000000000000000000000000000006b0e000000000000000000000000000000000000000000000000000000000000d359400000000000000000000000000000000000000000000000000000000000009950000000000000000000000000000000000000000000000000000000000004f420000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000005003b00000000000000000000000000000000000000000000000000000000000405af000000000000000000000000000000000000000000000000000000000000516d0000000000000000000000000000000000000000000000000000000000002cdd00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000099af200000000000000000000000000000000000000000000000000000000000910ac0000000000000000000000000000000000000000000000000000000000003bce00000000000000000000000000000000000000000000000000000000000041530000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000004e200000000000000000000000000000000000000000000000000000000000004e200000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000f42400000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000048000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000f424000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000f15ce00000000000000000000000000000000000000000000000000000000000a6cc30000000000000000000000000000000000000000000000000000000000004f8e0000000000000000000000000000000000000000000000000000000000003eab0000000000000000000000000000000000000000000000000000000000008ca00000000000000000000000000000000000000000000000000000000000035bd100000000000000000000000000000000000000000000000000000000000da049000000000000000000000000000000000000000000000000000000000000624f00000000000000000000000000000000000000000000000000000000000061130000000000000000000000000000000000000000000000000000000000006978000000000000000000000000000000000000000000000000000000000000ccee00000000000000000000000000000000000000000000000000000000000e50c800000000000000000000000000000000000000000000000000000000000009950000000000000000000000000000000000000000000000000000000000004f420000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000008396d00000000000000000000000000000000000000000000000000000000000222d1000000000000000000000000000000000000000000000000000000000000516d0000000000000000000000000000000000000000000000000000000000002cdd0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000007076a00000000000000000000000000000000000000000000000000000000000bdbcc0000000000000000000000000000000000000000000000000000000000003bce0000000000000000000000000000000000000000000000000000000000004153000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000f424000000000000000000000000000000000000000000000000000000000000f42400000000000000000000000000000000000000000000000000000000000004e200000000000000000000000000000000000000000000000000000000000004e200000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000007d0000000000000000000000005b1b8283b0c9fdf0de950b891ee97cc151345c1600000000000000000000000000000000000000000000000000000000000b5fcc000000000000000000000000000000000000000000000000000000000008cea40000000000000000000000000000000000000000000000000000000000005fb600000000000000000000000000000000000000000000000000000000000053bd0000000000000000000000000000000000000000000000000000000000008ca000000000000000000000000000000000000000000000000000000000000bc84200000000000000000000000000000000000000000000000000000000000d89e200000000000000000000000000000000000000000000000000000000000052270000000000000000000000000000000000000000000000000000000000004c010000000000000000000000000000000000000000000000000000000000006978000000000000000000000000000000000000000000000000000000000003bee700000000000000000000000000000000000000000000000000000000000dc32e00000000000000000000000000000000000000000000000000000000000009950000000000000000000000000000000000000000000000000000000000004f4200000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000069cd40000000000000000000000000000000000000000000000000000000000030ba6000000000000000000000000000000000000000000000000000000000000516d0000000000000000000000000000000000000000000000000000000000002cdd0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000a8e8000000000000000000000000000000000000000000000000000000000002d0930000000000000000000000000000000000000000000000000000000000003bce00000000000000000000000000000000000000000000000000000000000041530000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000004e200000000000000000000000000000000000000000000000000000000000004e200000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000f42400000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000048000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000f4240000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000008e6ea000000000000000000000000000000000000000000000000000000000002113a00000000000000000000000000000000000000000000000000000000000035e4000000000000000000000000000000000000000000000000000000000000451b0000000000000000000000000000000000000000000000000000000000008ca0000000000000000000000000000000000000000000000000000000000004b02a0000000000000000000000000000000000000000000000000000000000086af60000000000000000000000000000000000000000000000000000000000007bf90000000000000000000000000000000000000000000000000000000000005aa3000000000000000000000000000000000000000000000000000000000000697800000000000000000000000000000000000000000000000000000000000d1de800000000000000000000000000000000000000000000000000000000000ede6200000000000000000000000000000000000000000000000000000000000009950000000000000000000000000000000000000000000000000000000000004f420000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000009d60600000000000000000000000000000000000000000000000000000000000139fc000000000000000000000000000000000000000000000000000000000000516d0000000000000000000000000000000000000000000000000000000000002cdd000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000d65ec0000000000000000000000000000000000000000000000000000000000059bb30000000000000000000000000000000000000000000000000000000000003bce0000000000000000000000000000000000000000000000000000000000004153000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000f424000000000000000000000000000000000000000000000000000000000000f42400000000000000000000000000000000000000000000000000000000000004e200000000000000000000000000000000000000000000000000000000000004e200000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000007d0000000000000000000000005b1b8283b0c9fdf0de950b891ee97cc151345c1600000000000000000000000000000000000000000000000000000000000f15ce00000000000000000000000000000000000000000000000000000000000a6cc30000000000000000000000000000000000000000000000000000000000004f8e0000000000000000000000000000000000000000000000000000000000003eab0000000000000000000000000000000000000000000000000000000000008ca00000000000000000000000000000000000000000000000000000000000035bd100000000000000000000000000000000000000000000000000000000000da049000000000000000000000000000000000000000000000000000000000000624f00000000000000000000000000000000000000000000000000000000000061130000000000000000000000000000000000000000000000000000000000006978000000000000000000000000000000000000000000000000000000000000ccee00000000000000000000000000000000000000000000000000000000000e50c800000000000000000000000000000000000000000000000000000000000009950000000000000000000000000000000000000000000000000000000000004f420000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000008396d00000000000000000000000000000000000000000000000000000000000222d1000000000000000000000000000000000000000000000000000000000000516d0000000000000000000000000000000000000000000000000000000000002cdd0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000007076a00000000000000000000000000000000000000000000000000000000000bdbcc0000000000000000000000000000000000000000000000000000000000003bce00000000000000000000000000000000000000000000000000000000000041530000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000004e200000000000000000000000000000000000000000000000000000000000004e200000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000f42400000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000048000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000f424000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000e85ee000000000000000000000000000000000000000000000000000000000007dc0d0000000000000000000000000000000000000000000000000000000000003f3c000000000000000000000000000000000000000000000000000000000000682f0000000000000000000000000000000000000000000000000000000000008ca0000000000000000000000000000000000000000000000000000000000009812b00000000000000000000000000000000000000000000000000000000000454a900000000000000000000000000000000000000000000000000000000000072a1000000000000000000000000000000000000000000000000000000000000378f000000000000000000000000000000000000000000000000000000000000697800000000000000000000000000000000000000000000000000000000000a2bef00000000000000000000000000000000000000000000000000000000000028c800000000000000000000000000000000000000000000000000000000000009950000000000000000000000000000000000000000000000000000000000004f42000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000b729f0000000000000000000000000000000000000000000000000000000000005127000000000000000000000000000000000000000000000000000000000000516d0000000000000000000000000000000000000000000000000000000000002cdd000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000473e200000000000000000000000000000000000000000000000000000000000ea8a40000000000000000000000000000000000000000000000000000000000003bce0000000000000000000000000000000000000000000000000000000000004153000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000f424000000000000000000000000000000000000000000000000000000000000f42400000000000000000000000000000000000000000000000000000000000004e200000000000000000000000000000000000000000000000000000000000004e200000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000007d0000000000000000000000005b1b8283b0c9fdf0de950b891ee97cc151345c16000000000000000000000000000000000000000000000000000000000008e6ea000000000000000000000000000000000000000000000000000000000002113a00000000000000000000000000000000000000000000000000000000000035e4000000000000000000000000000000000000000000000000000000000000451b0000000000000000000000000000000000000000000000000000000000008ca0000000000000000000000000000000000000000000000000000000000004b02a0000000000000000000000000000000000000000000000000000000000086af60000000000000000000000000000000000000000000000000000000000007bf90000000000000000000000000000000000000000000000000000000000005aa3000000000000000000000000000000000000000000000000000000000000697800000000000000000000000000000000000000000000000000000000000d1de800000000000000000000000000000000000000000000000000000000000ede6200000000000000000000000000000000000000000000000000000000000009950000000000000000000000000000000000000000000000000000000000004f420000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000009d60600000000000000000000000000000000000000000000000000000000000139fc000000000000000000000000000000000000000000000000000000000000516d0000000000000000000000000000000000000000000000000000000000002cdd000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000d65ec0000000000000000000000000000000000000000000000000000000000059bb30000000000000000000000000000000000000000000000000000000000003bce00000000000000000000000000000000000000000000000000000000000041530000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000004e200000000000000000000000000000000000000000000000000000000000004e200000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000f42400000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000048000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000f4240000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000004128600000000000000000000000000000000000000000000000000000000000afc4600000000000000000000000000000000000000000000000000000000000039f400000000000000000000000000000000000000000000000000000000000048f70000000000000000000000000000000000000000000000000000000000008ca000000000000000000000000000000000000000000000000000000000000f35e1000000000000000000000000000000000000000000000000000000000002e8f600000000000000000000000000000000000000000000000000000000000077e900000000000000000000000000000000000000000000000000000000000056c7000000000000000000000000000000000000000000000000000000000000697800000000000000000000000000000000000000000000000000000000000739f6000000000000000000000000000000000000000000000000000000000000b66200000000000000000000000000000000000000000000000000000000000009950000000000000000000000000000000000000000000000000000000000004f42000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000d0f3800000000000000000000000000000000000000000000000000000000000ebd34000000000000000000000000000000000000000000000000000000000000516d0000000000000000000000000000000000000000000000000000000000002cdd000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000ad264000000000000000000000000000000000000000000000000000000000008688b0000000000000000000000000000000000000000000000000000000000003bce0000000000000000000000000000000000000000000000000000000000004153000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000f424000000000000000000000000000000000000000000000000000000000000f42400000000000000000000000000000000000000000000000000000000000004e200000000000000000000000000000000000000000000000000000000000004e200000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000007d0000000000000000000000005b1b8283b0c9fdf0de950b891ee97cc151345c1600000000000000000000000000000000000000000000000000000000000e85ee000000000000000000000000000000000000000000000000000000000007dc0d0000000000000000000000000000000000000000000000000000000000003f3c000000000000000000000000000000000000000000000000000000000000682f0000000000000000000000000000000000000000000000000000000000008ca0000000000000000000000000000000000000000000000000000000000009812b00000000000000000000000000000000000000000000000000000000000454a900000000000000000000000000000000000000000000000000000000000072a1000000000000000000000000000000000000000000000000000000000000378f000000000000000000000000000000000000000000000000000000000000697800000000000000000000000000000000000000000000000000000000000a2bef00000000000000000000000000000000000000000000000000000000000028c800000000000000000000000000000000000000000000000000000000000009950000000000000000000000000000000000000000000000000000000000004f42000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000b729f0000000000000000000000000000000000000000000000000000000000005127000000000000000000000000000000000000000000000000000000000000516d0000000000000000000000000000000000000000000000000000000000002cdd000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000473e200000000000000000000000000000000000000000000000000000000000ea8a40000000000000000000000000000000000000000000000000000000000003bce00000000000000000000000000000000000000000000000000000000000041530000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000004e200000000000000000000000000000000000000000000000000000000000004e200000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000f42400000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000048000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000f424000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000afe1600000000000000000000000000000000000000000000000000000000000450b900000000000000000000000000000000000000000000000000000000000038b40000000000000000000000000000000000000000000000000000000000004d830000000000000000000000000000000000000000000000000000000000008ca00000000000000000000000000000000000000000000000000000000000036b8100000000000000000000000000000000000000000000000000000000000b49090000000000000000000000000000000000000000000000000000000000007929000000000000000000000000000000000000000000000000000000000000523b000000000000000000000000000000000000000000000000000000000000697800000000000000000000000000000000000000000000000000000000000447fd00000000000000000000000000000000000000000000000000000000000143fc00000000000000000000000000000000000000000000000000000000000009950000000000000000000000000000000000000000000000000000000000004f42000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000eabd100000000000000000000000000000000000000000000000000000000000dd45f000000000000000000000000000000000000000000000000000000000000516d0000000000000000000000000000000000000000000000000000000000002cdd0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001e05a00000000000000000000000000000000000000000000000000000000000228720000000000000000000000000000000000000000000000000000000000003bce0000000000000000000000000000000000000000000000000000000000004153000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000f424000000000000000000000000000000000000000000000000000000000000f42400000000000000000000000000000000000000000000000000000000000004e200000000000000000000000000000000000000000000000000000000000004e200000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000007d0000000000000000000000005b1b8283b0c9fdf0de950b891ee97cc151345c16000000000000000000000000000000000000000000000000000000000004128600000000000000000000000000000000000000000000000000000000000afc4600000000000000000000000000000000000000000000000000000000000039f400000000000000000000000000000000000000000000000000000000000048f70000000000000000000000000000000000000000000000000000000000008ca000000000000000000000000000000000000000000000000000000000000f35e1000000000000000000000000000000000000000000000000000000000002e8f600000000000000000000000000000000000000000000000000000000000077e900000000000000000000000000000000000000000000000000000000000056c7000000000000000000000000000000000000000000000000000000000000697800000000000000000000000000000000000000000000000000000000000739f6000000000000000000000000000000000000000000000000000000000000b66200000000000000000000000000000000000000000000000000000000000009950000000000000000000000000000000000000000000000000000000000004f42000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000d0f3800000000000000000000000000000000000000000000000000000000000ebd34000000000000000000000000000000000000000000000000000000000000516d0000000000000000000000000000000000000000000000000000000000002cdd000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000ad264000000000000000000000000000000000000000000000000000000000008688b0000000000000000000000000000000000000000000000000000000000003bce00000000000000000000000000000000000000000000000000000000000041530000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000004e200000000000000000000000000000000000000000000000000000000000004e200000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000f42400000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000048000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000f424000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000e7fc00000000000000000000000000000000000000000000000000000000000097cfe00000000000000000000000000000000000000000000000000000000000035d00000000000000000000000000000000000000000000000000000000000005b2b0000000000000000000000000000000000000000000000000000000000008ca000000000000000000000000000000000000000000000000000000000000a67b2000000000000000000000000000000000000000000000000000000000007d14a0000000000000000000000000000000000000000000000000000000000007c0d000000000000000000000000000000000000000000000000000000000000449300000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000015604000000000000000000000000000000000000000000000000000000000001d19600000000000000000000000000000000000000000000000000000000000009950000000000000000000000000000000000000000000000000000000000004f42000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000104c300000000000000000000000000000000000000000000000000000000000ceb8a000000000000000000000000000000000000000000000000000000000000516d0000000000000000000000000000000000000000000000000000000000002cdd00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000083edc00000000000000000000000000000000000000000000000000000000000b35630000000000000000000000000000000000000000000000000000000000003bce0000000000000000000000000000000000000000000000000000000000004153000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000f424000000000000000000000000000000000000000000000000000000000000f42400000000000000000000000000000000000000000000000000000000000004e200000000000000000000000000000000000000000000000000000000000004e20000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000250000000000000000000000005b1b8283b0c9fdf0de950b891ee97cc151345c1600000000000000000000000000000000000000000000000000000000000afe1600000000000000000000000000000000000000000000000000000000000450b900000000000000000000000000000000000000000000000000000000000038b40000000000000000000000000000000000000000000000000000000000004d830000000000000000000000000000000000000000000000000000000000008ca00000000000000000000000000000000000000000000000000000000000036b8100000000000000000000000000000000000000000000000000000000000b49090000000000000000000000000000000000000000000000000000000000007929000000000000000000000000000000000000000000000000000000000000523b000000000000000000000000000000000000000000000000000000000000697800000000000000000000000000000000000000000000000000000000000447fd00000000000000000000000000000000000000000000000000000000000143fc00000000000000000000000000000000000000000000000000000000000009950000000000000000000000000000000000000000000000000000000000004f42000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000eabd100000000000000000000000000000000000000000000000000000000000dd45f000000000000000000000000000000000000000000000000000000000000516d0000000000000000000000000000000000000000000000000000000000002cdd0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001e05a00000000000000000000000000000000000000000000000000000000000228720000000000000000000000000000000000000000000000000000000000003bce00000000000000000000000000000000000000000000000000000000000041530000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000004e200000000000000000000000000000000000000000000000000000000000004e200000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000f42400000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000048000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000f424000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000c679d00000000000000000000000000000000000000000000000000000000000a8e6e0000000000000000000000000000000000000000000000000000000000006fd50000000000000000000000000000000000000000000000000000000000004a9d0000000000000000000000000000000000000000000000000000000000008ca00000000000000000000000000000000000000000000000000000000000012e73000000000000000000000000000000000000000000000000000000000006dd5b0000000000000000000000000000000000000000000000000000000000003a7900000000000000000000000000000000000000000000000000000000000082330000000000000000000000000000000000000000000000000000000000006978000000000000000000000000000000000000000000000000000000000003055000000000000000000000000000000000000000000000000000000000000969a30000000000000000000000000000000000000000000000000000000000002e2800000000000000000000000000000000000000000000000000000000000063730000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000006026c000000000000000000000000000000000000000000000000000000000007094d0000000000000000000000000000000000000000000000000000000000002097000000000000000000000000000000000000000000000000000000000000645d00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000043a1c0000000000000000000000000000000000000000000000000000000000022e32000000000000000000000000000000000000000000000000000000000000662c0000000000000000000000000000000000000000000000000000000000005796000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000e7351000000000000000000000000000000000000000000000000000000000001eab60000000000000000000000000000000000000000000000000000000000003e35000000000000000000000000000000000000000000000000000000000000657e0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000007d0000000000000000000000005b1b8283b0c9fdf0de950b891ee97cc151345c16000000000000000000000000000000000000000000000000000000000000b16a00000000000000000000000000000000000000000000000000000000000afa810000000000000000000000000000000000000000000000000000000000003ac100000000000000000000000000000000000000000000000000000000000058e90000000000000000000000000000000000000000000000000000000000008ca00000000000000000000000000000000000000000000000000000000000066b74000000000000000000000000000000000000000000000000000000000004e5aa00000000000000000000000000000000000000000000000000000000000038a50000000000000000000000000000000000000000000000000000000000004eed00000000000000000000000000000000000000000000000000000000000069780000000000000000000000000000000000000000000000000000000000035b1100000000000000000000000000000000000000000000000000000000000e38770000000000000000000000000000000000000000000000000000000000002e140000000000000000000000000000000000000000000000000000000000006d5b00000000000000000000000000000000000000000000000000000000000059d800000000000000000000000000000000000000000000000000000000000bfe4100000000000000000000000000000000000000000000000000000000000b0d3400000000000000000000000000000000000000000000000000000000000038230000000000000000000000000000000000000000000000000000000000006c9d0000000000000000000000000000000000000000000000000000000000004a3800000000000000000000000000000000000000000000000000000000000650a900000000000000000000000000000000000000000000000000000000000b44c40000000000000000000000000000000000000000000000000000000000006e7c000000000000000000000000000000000000000000000000000000000000659e0000000000000000000000000000000000000000000000000000000000003a98000000000000000000000000000000000000000000000000000000000008ff7f0000000000000000000000000000000000000000000000000000000000011e0400000000000000000000000000000000000000000000000000000000000055550000000000000000000000000000000000000000000000000000000000006a480000000000000000000000000000000000000000000000000000000000002af8000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000f42400000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000048000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000f424000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000eff96000000000000000000000000000000000000000000000000000000000007d1910000000000000000000000000000000000000000000000000000000000006deb000000000000000000000000000000000000000000000000000000000000476d0000000000000000000000000000000000000000000000000000000000008ca00000000000000000000000000000000000000000000000000000000000056d6a0000000000000000000000000000000000000000000000000000000000028fd20000000000000000000000000000000000000000000000000000000000003c6300000000000000000000000000000000000000000000000000000000000085630000000000000000000000000000000000000000000000000000000000006978000000000000000000000000000000000000000000000000000000000002c5600000000000000000000000000000000000000000000000000000000000047f820000000000000000000000000000000000000000000000000000000000002e280000000000000000000000000000000000000000000000000000000000006373000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000e5e930000000000000000000000000000000000000000000000000000000000029b260000000000000000000000000000000000000000000000000000000000002097000000000000000000000000000000000000000000000000000000000000645d0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000a854000000000000000000000000000000000000000000000000000000000006ccd0000000000000000000000000000000000000000000000000000000000000662c00000000000000000000000000000000000000000000000000000000000057960000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000006ad9200000000000000000000000000000000000000000000000000000000000d539c0000000000000000000000000000000000000000000000000000000000003e35000000000000000000000000000000000000000000000000000000000000657e0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000007d0000000000000000000000005b1b8283b0c9fdf0de950b891ee97cc151345c1600000000000000000000000000000000000000000000000000000000000c679d00000000000000000000000000000000000000000000000000000000000a8e6e0000000000000000000000000000000000000000000000000000000000006fd50000000000000000000000000000000000000000000000000000000000004a9d0000000000000000000000000000000000000000000000000000000000008ca00000000000000000000000000000000000000000000000000000000000012e73000000000000000000000000000000000000000000000000000000000006dd5b0000000000000000000000000000000000000000000000000000000000003a7900000000000000000000000000000000000000000000000000000000000082330000000000000000000000000000000000000000000000000000000000006978000000000000000000000000000000000000000000000000000000000003055000000000000000000000000000000000000000000000000000000000000969a30000000000000000000000000000000000000000000000000000000000002e2800000000000000000000000000000000000000000000000000000000000063730000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000006026c000000000000000000000000000000000000000000000000000000000007094d0000000000000000000000000000000000000000000000000000000000002097000000000000000000000000000000000000000000000000000000000000645d00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000043a1c0000000000000000000000000000000000000000000000000000000000022e32000000000000000000000000000000000000000000000000000000000000662c0000000000000000000000000000000000000000000000000000000000005796000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000e7351000000000000000000000000000000000000000000000000000000000001eab60000000000000000000000000000000000000000000000000000000000003e35000000000000000000000000000000000000000000000000000000000000657e0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000f42400000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000048000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000f424000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000080850000000000000000000000000000000000000000000000000000000000045972000000000000000000000000000000000000000000000000000000000000588b000000000000000000000000000000000000000000000000000000000000417b0000000000000000000000000000000000000000000000000000000000008ca000000000000000000000000000000000000000000000000000000000000b6e0500000000000000000000000000000000000000000000000000000000000e598400000000000000000000000000000000000000000000000000000000000051c30000000000000000000000000000000000000000000000000000000000008b550000000000000000000000000000000000000000000000000000000000006978000000000000000000000000000000000000000000000000000000000002857000000000000000000000000000000000000000000000000000000000000ee9090000000000000000000000000000000000000000000000000000000000002e28000000000000000000000000000000000000000000000000000000000000637300000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000076eb400000000000000000000000000000000000000000000000000000000000d76ef0000000000000000000000000000000000000000000000000000000000002097000000000000000000000000000000000000000000000000000000000000645d000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000c663000000000000000000000000000000000000000000000000000000000000b6b6e000000000000000000000000000000000000000000000000000000000000662c0000000000000000000000000000000000000000000000000000000000005796000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000e33a500000000000000000000000000000000000000000000000000000000000966d20000000000000000000000000000000000000000000000000000000000003e35000000000000000000000000000000000000000000000000000000000000657e0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000007d0000000000000000000000005b1b8283b0c9fdf0de950b891ee97cc151345c1600000000000000000000000000000000000000000000000000000000000eff96000000000000000000000000000000000000000000000000000000000007d1910000000000000000000000000000000000000000000000000000000000006deb000000000000000000000000000000000000000000000000000000000000476d0000000000000000000000000000000000000000000000000000000000008ca00000000000000000000000000000000000000000000000000000000000056d6a0000000000000000000000000000000000000000000000000000000000028fd20000000000000000000000000000000000000000000000000000000000003c6300000000000000000000000000000000000000000000000000000000000085630000000000000000000000000000000000000000000000000000000000006978000000000000000000000000000000000000000000000000000000000002c5600000000000000000000000000000000000000000000000000000000000047f820000000000000000000000000000000000000000000000000000000000002e280000000000000000000000000000000000000000000000000000000000006373000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000e5e930000000000000000000000000000000000000000000000000000000000029b260000000000000000000000000000000000000000000000000000000000002097000000000000000000000000000000000000000000000000000000000000645d0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000a854000000000000000000000000000000000000000000000000000000000006ccd0000000000000000000000000000000000000000000000000000000000000662c00000000000000000000000000000000000000000000000000000000000057960000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000006ad9200000000000000000000000000000000000000000000000000000000000d539c0000000000000000000000000000000000000000000000000000000000003e35000000000000000000000000000000000000000000000000000000000000657e0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000f42400000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000048000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000f424000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000c94ee0000000000000000000000000000000000000000000000000000000000024e1100000000000000000000000000000000000000000000000000000000000072c3000000000000000000000000000000000000000000000000000000000000610f0000000000000000000000000000000000000000000000000000000000008ca000000000000000000000000000000000000000000000000000000000000636720000000000000000000000000000000000000000000000000000000000095dcf000000000000000000000000000000000000000000000000000000000000378b0000000000000000000000000000000000000000000000000000000000006bc100000000000000000000000000000000000000000000000000000000000069780000000000000000000000000000000000000000000000000000000000024580000000000000000000000000000000000000000000000000000000000009fee80000000000000000000000000000000000000000000000000000000000002e28000000000000000000000000000000000000000000000000000000000000637300000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000007ed500000000000000000000000000000000000000000000000000000000000908c80000000000000000000000000000000000000000000000000000000000002097000000000000000000000000000000000000000000000000000000000000645d0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000008d468000000000000000000000000000000000000000000000000000000000000c6ae000000000000000000000000000000000000000000000000000000000000662c000000000000000000000000000000000000000000000000000000000000579600000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000066de60000000000000000000000000000000000000000000000000000000000057a080000000000000000000000000000000000000000000000000000000000003e35000000000000000000000000000000000000000000000000000000000000657e0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000007d0000000000000000000000005b1b8283b0c9fdf0de950b891ee97cc151345c1600000000000000000000000000000000000000000000000000000000000080850000000000000000000000000000000000000000000000000000000000045972000000000000000000000000000000000000000000000000000000000000588b000000000000000000000000000000000000000000000000000000000000417b0000000000000000000000000000000000000000000000000000000000008ca000000000000000000000000000000000000000000000000000000000000b6e0500000000000000000000000000000000000000000000000000000000000e598400000000000000000000000000000000000000000000000000000000000051c30000000000000000000000000000000000000000000000000000000000008b550000000000000000000000000000000000000000000000000000000000006978000000000000000000000000000000000000000000000000000000000002857000000000000000000000000000000000000000000000000000000000000ee9090000000000000000000000000000000000000000000000000000000000002e28000000000000000000000000000000000000000000000000000000000000637300000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000076eb400000000000000000000000000000000000000000000000000000000000d76ef0000000000000000000000000000000000000000000000000000000000002097000000000000000000000000000000000000000000000000000000000000645d000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000c663000000000000000000000000000000000000000000000000000000000000b6b6e000000000000000000000000000000000000000000000000000000000000662c0000000000000000000000000000000000000000000000000000000000005796000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000e33a500000000000000000000000000000000000000000000000000000000000966d20000000000000000000000000000000000000000000000000000000000003e35000000000000000000000000000000000000000000000000000000000000657e0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000f42400000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000048000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000f424000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000db9910000000000000000000000000000000000000000000000000000000000027cff0000000000000000000000000000000000000000000000000000000000006d1b0000000000000000000000000000000000000000000000000000000000007c750000000000000000000000000000000000000000000000000000000000008ca000000000000000000000000000000000000000000000000000000000000bec060000000000000000000000000000000000000000000000000000000000024cd00000000000000000000000000000000000000000000000000000000000003d33000000000000000000000000000000000000000000000000000000000000505b0000000000000000000000000000000000000000000000000000000000006978000000000000000000000000000000000000000000000000000000000002059000000000000000000000000000000000000000000000000000000000000514c70000000000000000000000000000000000000000000000000000000000002e2800000000000000000000000000000000000000000000000000000000000063730000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000008dafc0000000000000000000000000000000000000000000000000000000000049aa10000000000000000000000000000000000000000000000000000000000002097000000000000000000000000000000000000000000000000000000000000645d000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000542a0000000000000000000000000000000000000000000000000000000000005654c000000000000000000000000000000000000000000000000000000000000662c0000000000000000000000000000000000000000000000000000000000005796000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000df3f90000000000000000000000000000000000000000000000000000000000018d3e0000000000000000000000000000000000000000000000000000000000003e35000000000000000000000000000000000000000000000000000000000000657e0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000007d0000000000000000000000005b1b8283b0c9fdf0de950b891ee97cc151345c1600000000000000000000000000000000000000000000000000000000000c94ee0000000000000000000000000000000000000000000000000000000000024e1100000000000000000000000000000000000000000000000000000000000072c3000000000000000000000000000000000000000000000000000000000000610f0000000000000000000000000000000000000000000000000000000000008ca000000000000000000000000000000000000000000000000000000000000636720000000000000000000000000000000000000000000000000000000000095dcf000000000000000000000000000000000000000000000000000000000000378b0000000000000000000000000000000000000000000000000000000000006bc100000000000000000000000000000000000000000000000000000000000069780000000000000000000000000000000000000000000000000000000000024580000000000000000000000000000000000000000000000000000000000009fee80000000000000000000000000000000000000000000000000000000000002e28000000000000000000000000000000000000000000000000000000000000637300000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000007ed500000000000000000000000000000000000000000000000000000000000908c80000000000000000000000000000000000000000000000000000000000002097000000000000000000000000000000000000000000000000000000000000645d0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000008d468000000000000000000000000000000000000000000000000000000000000c6ae000000000000000000000000000000000000000000000000000000000000662c000000000000000000000000000000000000000000000000000000000000579600000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000066de60000000000000000000000000000000000000000000000000000000000057a080000000000000000000000000000000000000000000000000000000000003e35000000000000000000000000000000000000000000000000000000000000657e0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000f42400000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000048000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000f424000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000845ee0000000000000000000000000000000000000000000000000000000000067bd40000000000000000000000000000000000000000000000000000000000002f450000000000000000000000000000000000000000000000000000000000003d770000000000000000000000000000000000000000000000000000000000008ca0000000000000000000000000000000000000000000000000000000000008f086000000000000000000000000000000000000000000000000000000000006b36d0000000000000000000000000000000000000000000000000000000000007b090000000000000000000000000000000000000000000000000000000000008f590000000000000000000000000000000000000000000000000000000000006978000000000000000000000000000000000000000000000000000000000001c5a00000000000000000000000000000000000000000000000000000000000002aa60000000000000000000000000000000000000000000000000000000000002e2800000000000000000000000000000000000000000000000000000000000063730000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001eb1d0000000000000000000000000000000000000000000000000000000000002c7a0000000000000000000000000000000000000000000000000000000000002097000000000000000000000000000000000000000000000000000000000000645d0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001b0d800000000000000000000000000000000000000000000000000000000000a03ea000000000000000000000000000000000000000000000000000000000000662c000000000000000000000000000000000000000000000000000000000000579600000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000062e3a00000000000000000000000000000000000000000000000000000000000cf6240000000000000000000000000000000000000000000000000000000000003e35000000000000000000000000000000000000000000000000000000000000657e0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000007d0000000000000000000000005b1b8283b0c9fdf0de950b891ee97cc151345c1600000000000000000000000000000000000000000000000000000000000db9910000000000000000000000000000000000000000000000000000000000027cff0000000000000000000000000000000000000000000000000000000000006d1b0000000000000000000000000000000000000000000000000000000000007c750000000000000000000000000000000000000000000000000000000000008ca000000000000000000000000000000000000000000000000000000000000bec060000000000000000000000000000000000000000000000000000000000024cd00000000000000000000000000000000000000000000000000000000000003d33000000000000000000000000000000000000000000000000000000000000505b0000000000000000000000000000000000000000000000000000000000006978000000000000000000000000000000000000000000000000000000000002059000000000000000000000000000000000000000000000000000000000000514c70000000000000000000000000000000000000000000000000000000000002e2800000000000000000000000000000000000000000000000000000000000063730000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000008dafc0000000000000000000000000000000000000000000000000000000000049aa10000000000000000000000000000000000000000000000000000000000002097000000000000000000000000000000000000000000000000000000000000645d000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000542a0000000000000000000000000000000000000000000000000000000000005654c000000000000000000000000000000000000000000000000000000000000662c0000000000000000000000000000000000000000000000000000000000005796000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000df3f90000000000000000000000000000000000000000000000000000000000018d3e0000000000000000000000000000000000000000000000000000000000003e35000000000000000000000000000000000000000000000000000000000000657e0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000f42400000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000048000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000f424000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000f08280000000000000000000000000000000000000000000000000000000000093b5d0000000000000000000000000000000000000000000000000000000000003ef900000000000000000000000000000000000000000000000000000000000068930000000000000000000000000000000000000000000000000000000000008ca00000000000000000000000000000000000000000000000000000000000090cfe00000000000000000000000000000000000000000000000000000000000c4b2a0000000000000000000000000000000000000000000000000000000000006b55000000000000000000000000000000000000000000000000000000000000643d000000000000000000000000000000000000000000000000000000000000697800000000000000000000000000000000000000000000000000000000000185b000000000000000000000000000000000000000000000000000000000000a942d0000000000000000000000000000000000000000000000000000000000002e280000000000000000000000000000000000000000000000000000000000006373000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000a474400000000000000000000000000000000000000000000000000000000000b08430000000000000000000000000000000000000000000000000000000000002097000000000000000000000000000000000000000000000000000000000000645d000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000d6eb400000000000000000000000000000000000000000000000000000000000ea288000000000000000000000000000000000000000000000000000000000000662c0000000000000000000000000000000000000000000000000000000000005796000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000db44d000000000000000000000000000000000000000000000000000000000009095a0000000000000000000000000000000000000000000000000000000000003e35000000000000000000000000000000000000000000000000000000000000657e0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000007d0000000000000000000000005b1b8283b0c9fdf0de950b891ee97cc151345c1600000000000000000000000000000000000000000000000000000000000845ee0000000000000000000000000000000000000000000000000000000000067bd40000000000000000000000000000000000000000000000000000000000002f450000000000000000000000000000000000000000000000000000000000003d770000000000000000000000000000000000000000000000000000000000008ca0000000000000000000000000000000000000000000000000000000000008f086000000000000000000000000000000000000000000000000000000000006b36d0000000000000000000000000000000000000000000000000000000000007b090000000000000000000000000000000000000000000000000000000000008f590000000000000000000000000000000000000000000000000000000000006978000000000000000000000000000000000000000000000000000000000001c5a00000000000000000000000000000000000000000000000000000000000002aa60000000000000000000000000000000000000000000000000000000000002e2800000000000000000000000000000000000000000000000000000000000063730000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001eb1d0000000000000000000000000000000000000000000000000000000000002c7a0000000000000000000000000000000000000000000000000000000000002097000000000000000000000000000000000000000000000000000000000000645d0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001b0d800000000000000000000000000000000000000000000000000000000000a03ea000000000000000000000000000000000000000000000000000000000000662c000000000000000000000000000000000000000000000000000000000000579600000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000062e3a00000000000000000000000000000000000000000000000000000000000cf6240000000000000000000000000000000000000000000000000000000000003e35000000000000000000000000000000000000000000000000000000000000657e0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000f42400000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000048000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000f42400000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000052c29000000000000000000000000000000000000000000000000000000000003802a00000000000000000000000000000000000000000000000000000000000040cb0000000000000000000000000000000000000000000000000000000000008f6b0000000000000000000000000000000000000000000000000000000000008ca000000000000000000000000000000000000000000000000000000000000a780c00000000000000000000000000000000000000000000000000000000000af31900000000000000000000000000000000000000000000000000000000000069830000000000000000000000000000000000000000000000000000000000003d65000000000000000000000000000000000000000000000000000000000000697800000000000000000000000000000000000000000000000000000000000145c0000000000000000000000000000000000000000000000000000000000005aa0c0000000000000000000000000000000000000000000000000000000000002e280000000000000000000000000000000000000000000000000000000000006373000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000357650000000000000000000000000000000000000000000000000000000000069a1c0000000000000000000000000000000000000000000000000000000000002097000000000000000000000000000000000000000000000000000000000000645d0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000009dcec000000000000000000000000000000000000000000000000000000000003fdc8000000000000000000000000000000000000000000000000000000000000662c00000000000000000000000000000000000000000000000000000000000057960000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000005ee8e0000000000000000000000000000000000000000000000000000000000051c900000000000000000000000000000000000000000000000000000000000003e35000000000000000000000000000000000000000000000000000000000000657e0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000007d0000000000000000000000005b1b8283b0c9fdf0de950b891ee97cc151345c1600000000000000000000000000000000000000000000000000000000000f08280000000000000000000000000000000000000000000000000000000000093b5d0000000000000000000000000000000000000000000000000000000000003ef900000000000000000000000000000000000000000000000000000000000068930000000000000000000000000000000000000000000000000000000000008ca00000000000000000000000000000000000000000000000000000000000090cfe00000000000000000000000000000000000000000000000000000000000c4b2a0000000000000000000000000000000000000000000000000000000000006b55000000000000000000000000000000000000000000000000000000000000643d000000000000000000000000000000000000000000000000000000000000697800000000000000000000000000000000000000000000000000000000000185b000000000000000000000000000000000000000000000000000000000000a942d0000000000000000000000000000000000000000000000000000000000002e280000000000000000000000000000000000000000000000000000000000006373000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000a474400000000000000000000000000000000000000000000000000000000000b08430000000000000000000000000000000000000000000000000000000000002097000000000000000000000000000000000000000000000000000000000000645d000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000d6eb400000000000000000000000000000000000000000000000000000000000ea288000000000000000000000000000000000000000000000000000000000000662c0000000000000000000000000000000000000000000000000000000000005796000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000db44d000000000000000000000000000000000000000000000000000000000009095a0000000000000000000000000000000000000000000000000000000000003e35000000000000000000000000000000000000000000000000000000000000657e0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000f42400000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000048000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000f424000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000e849b000000000000000000000000000000000000000000000000000000000001d25900000000000000000000000000000000000000000000000000000000000037f7000000000000000000000000000000000000000000000000000000000000794d0000000000000000000000000000000000000000000000000000000000008ca0000000000000000000000000000000000000000000000000000000000007f91b000000000000000000000000000000000000000000000000000000000005a7ae00000000000000000000000000000000000000000000000000000000000072570000000000000000000000000000000000000000000000000000000000005383000000000000000000000000000000000000000000000000000000000000697800000000000000000000000000000000000000000000000000000000000105d0000000000000000000000000000000000000000000000000000000000000bfeb0000000000000000000000000000000000000000000000000000000000002e280000000000000000000000000000000000000000000000000000000000006373000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000bb38c0000000000000000000000000000000000000000000000000000000000022bf50000000000000000000000000000000000000000000000000000000000002097000000000000000000000000000000000000000000000000000000000000645d00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000064b240000000000000000000000000000000000000000000000000000000000089c66000000000000000000000000000000000000000000000000000000000000662c0000000000000000000000000000000000000000000000000000000000005796000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000d74a10000000000000000000000000000000000000000000000000000000000012fc60000000000000000000000000000000000000000000000000000000000003e35000000000000000000000000000000000000000000000000000000000000657e0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000007d0000000000000000000000005b1b8283b0c9fdf0de950b891ee97cc151345c160000000000000000000000000000000000000000000000000000000000052c29000000000000000000000000000000000000000000000000000000000003802a00000000000000000000000000000000000000000000000000000000000040cb0000000000000000000000000000000000000000000000000000000000008f6b0000000000000000000000000000000000000000000000000000000000008ca000000000000000000000000000000000000000000000000000000000000a780c00000000000000000000000000000000000000000000000000000000000af31900000000000000000000000000000000000000000000000000000000000069830000000000000000000000000000000000000000000000000000000000003d65000000000000000000000000000000000000000000000000000000000000697800000000000000000000000000000000000000000000000000000000000145c0000000000000000000000000000000000000000000000000000000000005aa0c0000000000000000000000000000000000000000000000000000000000002e280000000000000000000000000000000000000000000000000000000000006373000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000357650000000000000000000000000000000000000000000000000000000000069a1c0000000000000000000000000000000000000000000000000000000000002097000000000000000000000000000000000000000000000000000000000000645d0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000009dcec000000000000000000000000000000000000000000000000000000000003fdc8000000000000000000000000000000000000000000000000000000000000662c00000000000000000000000000000000000000000000000000000000000057960000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000005ee8e0000000000000000000000000000000000000000000000000000000000051c900000000000000000000000000000000000000000000000000000000000003e35000000000000000000000000000000000000000000000000000000000000657e0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000f42400000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000048000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000f424000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000ec3f4000000000000000000000000000000000000000000000000000000000004b6ae0000000000000000000000000000000000000000000000000000000000002e8d0000000000000000000000000000000000000000000000000000000000006adb0000000000000000000000000000000000000000000000000000000000008ca000000000000000000000000000000000000000000000000000000000000ea39e00000000000000000000000000000000000000000000000000000000000b2ea50000000000000000000000000000000000000000000000000000000000007bc100000000000000000000000000000000000000000000000000000000000061f50000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000c5e000000000000000000000000000000000000000000000000000000000000b29720000000000000000000000000000000000000000000000000000000000002e2800000000000000000000000000000000000000000000000000000000000063730000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000004c3ad00000000000000000000000000000000000000000000000000000000000d07be0000000000000000000000000000000000000000000000000000000000002097000000000000000000000000000000000000000000000000000000000000645d0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002b95c00000000000000000000000000000000000000000000000000000000000d3b04000000000000000000000000000000000000000000000000000000000000662c00000000000000000000000000000000000000000000000000000000000057960000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000005aee200000000000000000000000000000000000000000000000000000000000c98ac0000000000000000000000000000000000000000000000000000000000003e35000000000000000000000000000000000000000000000000000000000000657e000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000500000000000000000000000005b1b8283b0c9fdf0de950b891ee97cc151345c1600000000000000000000000000000000000000000000000000000000000e849b000000000000000000000000000000000000000000000000000000000001d25900000000000000000000000000000000000000000000000000000000000037f7000000000000000000000000000000000000000000000000000000000000794d0000000000000000000000000000000000000000000000000000000000008ca0000000000000000000000000000000000000000000000000000000000007f91b000000000000000000000000000000000000000000000000000000000005a7ae00000000000000000000000000000000000000000000000000000000000072570000000000000000000000000000000000000000000000000000000000005383000000000000000000000000000000000000000000000000000000000000697800000000000000000000000000000000000000000000000000000000000105d0000000000000000000000000000000000000000000000000000000000000bfeb0000000000000000000000000000000000000000000000000000000000002e280000000000000000000000000000000000000000000000000000000000006373000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000bb38c0000000000000000000000000000000000000000000000000000000000022bf50000000000000000000000000000000000000000000000000000000000002097000000000000000000000000000000000000000000000000000000000000645d00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000064b240000000000000000000000000000000000000000000000000000000000089c66000000000000000000000000000000000000000000000000000000000000662c0000000000000000000000000000000000000000000000000000000000005796000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000d74a10000000000000000000000000000000000000000000000000000000000012fc60000000000000000000000000000000000000000000000000000000000003e35000000000000000000000000000000000000000000000000000000000000657e0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000f4240000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000'
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
