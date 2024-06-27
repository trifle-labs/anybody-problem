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
} from '../../scripts/utils.js'

import { Anybody } from '../../src/anybody.js'

// let tx
describe('AnybodyProblem Tests', function () {
  this.timeout(50000000)

  it('has the correct verifiers, externalMetadata, speedruns addresses', async () => {
    const deployedContracts = await deployContracts()

    const { AnybodyProblem: anybodyProblem } = deployedContracts
    for (const [name, contract] of Object.entries(deployedContracts)) {
      if (name === 'AnybodyProblem') continue
      if (name === 'verifiers') continue
      if (name === 'verifiersTicks') continue
      if (name === 'verifiersBodies') continue
      let storedAddress
      if (name.indexOf('Verifier') > -1) {
        const bodyCount = name.split('_')[1]
        storedAddress = await anybodyProblem.verifiers(
          bodyCount,
          await getTicksRun(bodyCount)
        )
      } else {
        const functionName = name.charAt(0).toLowerCase() + name.slice(1)
        storedAddress = await anybodyProblem[`${functionName}()`]()
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
      const bodyCount = name.split('_')[1]
      const tickCount = await getTicksRun(bodyCount)
      const storedAddress = await anybodyProblem.verifiers(bodyCount, tickCount)
      const actualAddress = contract.address
      expect(storedAddress).to.equal(actualAddress)
    }
  })

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
      { name: 'exampleEmitMultipleIndexEvent', args: [0, 0, addr1.address] },
      { name: 'updateProceedRecipient', args: [addr1.address] },
      { name: 'updateSpeedrunsAddress', args: [addr1.address] },
      { name: 'updateVerifier', args: [addr1.address, 0, 0] },
      { name: 'recoverUnsuccessfulPayment', args: [addr1.address] },
      { name: 'updatePrice', args: [0] },
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
      anybodyProblem.batchSolve(0, [], [], [], [], [])
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

    const price = await anybodyProblem.price()
    await expect(tx)
      .to.emit(anybodyProblem, 'EthMoved')
      .withArgs(acct1.address, true, '0x', price)

    const balanceAfter = await ethers.provider.getBalance(proceedRecipient)
    expect(balanceAfter.sub(balanceBefore)).to.equal(price)

    const speedrunBalance = await speedruns.balanceOf(owner.address)
    expect(speedrunBalance).to.equal(1)

    const expectedTokenId = runId
    const ownerOfToken = await speedruns.ownerOf(expectedTokenId)
    expect(ownerOfToken).to.equal(owner.address)

    const fastestRun = await anybodyProblem.fastestByDay(day, 0)
    expect(fastestRun).to.equal(runId)

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
      await deployContracts({ mock: true })
    let runId = 0
    const day = await anybodyProblem.currentDay()
    let accumulativeTime = 0
    const finalArgs = [null, [], [], [], [], []]
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
      finalArgs[1].push(args[1][0])
      finalArgs[2].push(args[2][0])
      finalArgs[3].push(args[3][0])
      finalArgs[4].push(args[4][0])
      finalArgs[5].push(args[5][0])
    }
    const price = await anybodyProblem.price()
    expect(finalArgs.length).to.equal(6)
    const tx = await anybodyProblem.batchSolve(...finalArgs, { value: price })
    await expect(tx)
      .to.emit(anybodyProblem, 'RunSolved')
      .withArgs(owner.address, finalRunId, accumulativeTime, day)

    await expect(tx)
      .to.emit(anybodyProblem, 'EthMoved')
      .withArgs(owner.address, true, '0x', price)

    const speedrunBalance = await speedruns.balanceOf(owner.address)
    expect(speedrunBalance).to.equal(1)

    const fastestRun = await anybodyProblem.fastestByDay(day, 0)
    expect(fastestRun).to.equal(finalRunId)

    const mostGames = await anybodyProblem.mostGames(0)
    expect(mostGames).to.equal(owner.address)

    const gamesPlayed = await anybodyProblem.gamesPlayed(owner.address)
    expect(gamesPlayed.total).to.equal(1)
    expect(gamesPlayed.lastPlayed).to.equal(day)
    expect(gamesPlayed.streak).to.equal(1)
  })

  it('has the same results for generateLevelData as anybody.js', async () => {
    const SECONDS_IN_A_DAY = 86400
    const day = Math.floor(Date.now() / 1000 / SECONDS_IN_A_DAY)
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

  it('has correct getLevelFromInputs', async () => {
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
    const level = await anybodyProblem.getLevelFromInputs(Input.length)
    expect(level).to.equal(1)
  })

  it('returns correct currentLevel', async () => {
    const [owner] = await ethers.getSigners()
    const { AnybodyProblem: anybodyProblem } = await deployContracts({
      mock: true
    })
    const currentLevel = await anybodyProblem.currentLevel(0)
    expect(currentLevel).to.equal(0)
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

  // TODO: add exhaustive tests for topic and types
  it('emits arbitrary events within Speedruns', async () => {
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
})
