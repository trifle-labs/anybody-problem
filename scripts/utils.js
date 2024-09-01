import { ethers } from 'ethers'
import hre from 'hardhat'
import path from 'node:path'
import { promises as fs } from 'fs'
import { Anybody } from '../dist/module.js'
import { exportCallDataGroth16 } from './circuits.js'

const __dirname = path.resolve()

const correctPrice = ethers.utils.parseEther('0.0025')

const proverTickIndex = {
  2: 250,
  3: 250,
  4: 250,
  5: 125,
  6: 125
}
const MAX_BODY_COUNT = 6

const getTicksRun = async (bodyCount) => {
  const ignoreTesting = global.ignoreTesting
  const networkInfo = await hre.ethers.provider.getNetwork()
  if (networkInfo['chainId'] == 12345 && !ignoreTesting) {
    return 20
  } else {
    return proverTickIndex[bodyCount]
  }
}

const testJson = (tJson) => {
  try {
    JSON.parse(tJson)
  } catch (e) {
    return false
  }
  return true
}

const getPathABI = async (name) => {
  var networkinfo = await hre.ethers.provider.getNetwork()
  var savePath = path.join(
    __dirname,
    'server',
    'contractData',
    'ABI-' + String(networkinfo['chainId']) + '-' + String(name) + '.json'
  )
  return savePath
}

async function readData(path) {
  const Newdata = await fs.readFile(path, 'utf8')
  return Newdata
}

const getPathAddress = async (name) => {
  var networkinfo = await hre.ethers.provider.getNetwork()
  var savePath = path.join(
    __dirname,
    'server',
    'contractData',
    String(networkinfo['chainId']) + '-' + String(name) + '.json'
  )
  return savePath
}

const initContracts = async () => {
  let [owner] = await hre.ethers.getSigners()

  const contractNames = [
    'AnybodyProblemV0',
    'AnybodyProblem',
    'Speedruns',
    'ExternalMetadata'
  ]
  for (let i = 3; i <= 6; i++) {
    const ticks = await getTicksRun(i)
    contractNames.push(`Game_${i}_${ticks}Verifier`)
  }

  let returnObject = {}

  for (let i = 0; i < contractNames.length; i++) {
    try {
      const address = JSON.parse(
        await readData(await getPathAddress(contractNames[i]))
      )['address']
      const abi = JSON.parse(
        await readData(await getPathABI(contractNames[i]))
      )['abi']
      returnObject[contractNames[i]] = new ethers.Contract(address, abi, owner)
    } catch (e) {
      console.log({ e })
    }
  }

  return returnObject
}

const decodeUri = (decodedJson) => {
  const metaWithoutDataURL = decodedJson.substring(decodedJson.indexOf(',') + 1)
  let buff = Buffer.from(metaWithoutDataURL, 'base64')
  let text = buff.toString('ascii')
  return text
}

const getThemeName = (chainId) => {
  switch (chainId) {
    case 1:
      return 'contracts/ThemeGroupDefault.sol:ThemeGroup'
    case 84532:
    case 8453:
    case 12345:
    default:
      return 'contracts/ThemeGroupBlues.sol:ThemeGroup'
  }
}

const deployAnybodyProblemV1 = async (options) => {
  const defaultOptions = { mock: false, ignoreTesting: false }
  const { mock, ignoreTesting } = Object.assign(defaultOptions, options)
  global.ignoreTesting = ignoreTesting
  global.networkinfo = await hre.ethers.provider.getNetwork()
  log('Deploying v1 contracts')

  const [deployer] = await hre.ethers.getSigners()

  const returnObject = {}
  const verifiers = []
  const verifiersTicks = []
  const verifiersBodies = []

  // redeploy the verifiers, this time only 2 of them
  for (let i = 2; i <= MAX_BODY_COUNT; i++) {
    if (i !== 4 && i !== 6) continue
    const ticks = await getTicksRun(i, ignoreTesting)
    const name = `Game_${i}_${ticks}Verifier`
    const path = `contracts/${name}.sol:Groth16Verifier`
    const verifier = await hre.ethers.getContractFactory(path)
    const verifierContract = await verifier.deploy()
    await verifierContract.deployed()
    log(`Verifier ${i} deployed at ${verifierContract.address}`)
    verifiers.push(verifierContract.address)
    log(`with ${ticks} ticks`)
    verifiersTicks.push(ticks)
    verifiersBodies.push(i)
    log(`and ${i} bodies`)

    returnObject[name] = verifierContract
  }
  returnObject.verifiers = verifiers
  returnObject.verifiersTicks = verifiersTicks
  returnObject.verifiersBodies = verifiersBodies

  // use the already deployed speedruns contract and external metadata contract
  const {
    Speedruns: speedruns,
    ExternalMetadata: externalMetadata,
    AnybodyProblemV0: anybodyProblemV0
  } = await initContracts()

  // deploy AnybodyProblem
  const AnybodyProblem = await hre.ethers.getContractFactory(
    mock ? 'AnybodyProblemMock' : 'AnybodyProblem'
  )

  const constructorArguments = [
    deployer.address,
    speedruns.address,
    externalMetadata.address,
    verifiers,
    verifiersTicks,
    verifiersBodies,
    anybodyProblemV0.address
  ]

  const anybodyProblem = await AnybodyProblem.deploy(...constructorArguments)
  await anybodyProblem.deployed()

  returnObject['AnybodyProblem'] = anybodyProblem

  log(
    'AnybodyProblem Deployed at ' +
      String(anybodyProblem.address) +
      ` with speedrunsAddress ${speedruns.address} and externalMetdataAddress ${externalMetadata.address} and verifiers ${verifiers} and verifiersTicks ${verifiersTicks} and verifiersBodies ${verifiersBodies} and anybodyProblemV0Address ${anybodyProblemV0.Address}`
  )

  // update Speedruns
  await speedruns.updateAnybodyProblemAddress(anybodyProblem.address)
  log('AnybodyProblem address updated in Speedruns')

  // update ExternalMetadata
  await externalMetadata.updateAnybodyProblemAddress(anybodyProblem.address)
  log('AnybodyProblem address updated in ExternalMetadata')

  // // ensure v0 is properly saved before overwriting it
  // const pathAddress = await getPathAddress('AnybodyProblem-v0')
  // const originalAbiPath = await getPathABI('AnybodyProblem-v0')
  // try {
  //   JSON.parse(await readData(pathAddress))
  //   await readData(originalAbiPath)
  // } catch (e) {
  //   throw new Error('Dont overwrite AnybodyProblem until v0 exists')
  // }

  await copyABI('AnybodyProblem')
  await saveAddress(anybodyProblem, 'AnybodyProblem')

  const verificationData = [
    {
      name: 'AnybodyProblem',
      constructorArguments
    }
  ]
  returnObject['verificationData'] = verificationData

  return returnObject
}

const deployMetadata = async () => {
  let externalMetadata, assets1, assets2, assets3, assets4, assets5
  try {
    const network = await hre.ethers.provider.getNetwork()
    let themeName = getThemeName(network['chainId'])

    const Theme = await hre.ethers.getContractFactory(themeName)
    const theme = await Theme.deploy()
    await theme.deployed()
    var themeAddress = theme.address
    log(themeName + ' Deployed at ' + String(themeAddress))

    // deploy Assets1
    const Assets1 = await hre.ethers.getContractFactory('Assets1')
    let byteSize = Buffer.from(Assets1.bytecode.slice(2), 'hex').length
    log(`Assets1 byte size: ${byteSize} bytes`)
    assets1 = await Assets1.deploy()
    await assets1.deployed()
    var assets1Address = assets1.address
    log('Assets1 Deployed at ' + String(assets1Address))

    // deploy Assets2
    const Assets2 = await hre.ethers.getContractFactory('Assets2')
    byteSize = Buffer.from(Assets2.bytecode.slice(2), 'hex').length
    log(`Assets2 byte size: ${byteSize} bytes`)
    assets2 = await Assets2.deploy()
    await assets2.deployed()
    var assets2Address = assets2.address
    log('Assets2 Deployed at ' + String(assets2Address))

    // deploy Assets3
    const Assets3 = await hre.ethers.getContractFactory('Assets3')
    byteSize = Buffer.from(Assets3.bytecode.slice(2), 'hex').length
    log(`Assets3 byte size: ${byteSize} bytes`)
    assets3 = await Assets3.deploy()
    await assets3.deployed()
    var assets3Address = assets3.address
    log('Assets3 Deployed at ' + String(assets3Address))

    // deploy Assets4
    const Assets4 = await hre.ethers.getContractFactory('Assets4')
    byteSize = Buffer.from(Assets4.bytecode.slice(2), 'hex').length
    log(`Assets4 byte size: ${byteSize} bytes`)
    assets4 = await Assets4.deploy()
    await assets4.deployed()
    var assets4Address = assets4.address
    log('Assets4 Deployed at ' + String(assets4Address))

    // deploy Assets5
    const Assets5 = await hre.ethers.getContractFactory('Assets5')
    byteSize = Buffer.from(Assets5.bytecode.slice(2), 'hex').length
    log(`Assets5 byte size: ${byteSize} bytes`)
    assets5 = await Assets5.deploy()
    await assets5.deployed()
    var assets5Address = assets5.address
    log('Assets5 Deployed at ' + String(assets5Address))

    // deploy ExternalMetadata
    const ExternalMetadata =
      await hre.ethers.getContractFactory('ExternalMetadata')
    byteSize = Buffer.from(ExternalMetadata.bytecode.slice(2), 'hex').length
    log(`ExternalMetadata byte size: ${byteSize} bytes`)
    externalMetadata = await ExternalMetadata.deploy(themeAddress)
    await externalMetadata.deployed()

    log('ExternalMetadata Deployed at ' + String(externalMetadata.address))

    await externalMetadata.setAssets([
      assets1Address,
      assets2Address,
      assets3Address,
      assets4Address,
      assets5Address
    ])
    log('Assets set')

    const tx = await externalMetadata.setupSVGPaths()
    await tx.wait()
    log('SVG Paths setup')
  } catch (e) {
    console.error(e)
  }

  return {
    externalMetadata,
    themeAddress,
    assets1,
    assets2,
    assets3,
    assets4,
    assets5
  }
}

const deployContracts = async (options) => {
  const deployedContracts0 = await deployContractsV0(options)
  await saveAndVerifyContracts(deployedContracts0)
  const deployedContracts1 = await deployAnybodyProblemV1(options)
  await saveAndVerifyContracts(deployedContracts0)
  return { ...deployedContracts0, ...deployedContracts1 }
}

const saveAndVerifyContracts = async (deployedContracts) => {
  const networkInfo = await hre.ethers.provider.getNetwork()
  for (const contractName in deployedContracts) {
    if (
      contractName == 'verificationData' ||
      contractName == 'verifiers' ||
      contractName == 'verifiersTicks' ||
      contractName == 'verifiersBodies'
    )
      continue
    if (contractName.indexOf('Verifier') > -1) {
      await copyABI(contractName, 'Groth16Verifier')
    } else if (contractName.indexOf('ThemeGroup') > -1) {
      const theme = getThemeName(networkInfo['chainId'])
      const genericName = theme.split(':')[1]
      const regex = /\/(.*?)\.sol/
      const match = theme.match(regex)
      const themeName = match ? match[1] : ''
      await copyABI(themeName, genericName)
    } else {
      await copyABI(contractName)
    }
    const contract = deployedContracts[contractName]
    await saveAddress(contract, contractName)
  }
  if (deployedContracts.verificationData) {
    await verifyContracts(deployedContracts)
  }
}

const deployContractsV0 = async (options) => {
  const defaultOptions = { mock: false, ignoreTesting: false }
  const { mock, ignoreTesting } = Object.assign(defaultOptions, options)
  global.ignoreTesting = ignoreTesting
  const networkinfo = await hre.ethers.provider.getNetwork()
  global.networkinfo = networkinfo
  log('Deploying v0 contracts')

  const [deployer] = await hre.ethers.getSigners()

  const returnObject = {}
  const verifiers = []
  const verifiersTicks = []
  const verifiersBodies = []

  for (let i = 2; i <= MAX_BODY_COUNT; i++) {
    const ticks = await getTicksRun(i)
    const name = `Game_${i}_${ticks}Verifier`
    const path = `contracts/${name}.sol:Groth16Verifier`
    const verifier = await hre.ethers.getContractFactory(path)
    const verifierContract = await verifier.deploy()
    await verifierContract.deployed()
    log(`Verifier ${i} deployed at ${verifierContract.address}`)
    verifiers.push(verifierContract.address)
    log(`with ${ticks} ticks`)
    verifiersTicks.push(ticks)
    verifiersBodies.push(i)
    log(`and ${i} bodies`)

    returnObject[name] = verifierContract
  }
  returnObject.verifiers = verifiers
  returnObject.verifiersTicks = verifiersTicks
  returnObject.verifiersBodies = verifiersBodies

  // deploy Speedruns
  const Speedruns = await hre.ethers.getContractFactory('Speedruns')
  const speedruns = await Speedruns.deploy()
  await speedruns.deployed()
  returnObject['Speedruns'] = speedruns
  log('Speedruns Deployed at ' + String(speedruns.address))

  // deploy Metadata
  const {
    externalMetadata,
    assets1,
    assets2,
    assets3,
    assets4,
    assets5,
    themeAddress
  } = await deployMetadata()

  returnObject['ExternalMetadata'] = externalMetadata
  returnObject['Assets1'] = assets1
  returnObject['Assets2'] = assets2
  returnObject['Assets3'] = assets3
  returnObject['Assets4'] = assets4
  returnObject['Assets5'] = assets5
  returnObject['ThemeGroup'] = themeAddress

  // const pathAddress = (await getPathAddress('AnybodyProblem-v0'))
  //   .replace(networkinfo.name, '8453')
  //   .replace(networkinfo.chainId, '8453')
  // const contractData = JSON.parse(await readData(pathAddress))
  // const creationBytecode = contractData.contractCreation
  // const originalAbiPath = (await getPathABI('AnybodyProblem-v0'))
  //   .replace(networkinfo.name, '8453')
  //   .replace(networkinfo.chainId, '8453')
  // const originalAbi = await readData(originalAbiPath)
  // const constructorArgs = [
  //   deployer.address,
  //   speedrunsAddress,
  //   externalMetadataAddress,
  //   verifiers,
  //   verifiersTicks,
  //   verifiersBodies
  // ]
  // const iface = new ethers.utils.Interface(originalAbi)
  // const encodedArgs = iface.encodeDeploy(constructorArgs)
  // const deploymentBytecode = '0x' + creationBytecode + encodedArgs.slice(2) // Remove '0x' from encoded args
  // const tx = await deployer.sendTransaction({
  //   data: deploymentBytecode
  // })
  // const receipt = await tx.wait()
  // const anybodyProblem = new ethers.Contract(
  //   receipt.contractAddress,
  //   originalAbi,
  //   deployer
  // )

  // deploy AnybodyProblem
  const AnybodyProblemV0 = await hre.ethers.getContractFactory(
    mock ? 'AnybodyProblemMock' : 'AnybodyProblemV0'
  )

  const constructorArgs = [
    deployer.address,
    speedruns.address,
    externalMetadata.address,
    verifiers,
    verifiersTicks,
    verifiersBodies
  ]

  const anybodyProblemV0 = await AnybodyProblemV0.deploy(...constructorArgs)
  await anybodyProblemV0.deployed()

  returnObject['AnybodyProblemV0'] = anybodyProblemV0

  log(
    'AnybodyProblemV0 Deployed at ' +
      String(anybodyProblemV0.address) +
      ` with speedrunsAddress ${speedruns.address} and externalMetdataAddress ${externalMetadata.address} and verifiers ${verifiers} and verifiersTicks ${verifiersTicks} and verifiersBodies ${verifiersBodies}`
  )

  // update Speedruns
  await speedruns.updateAnybodyProblemAddress(anybodyProblemV0.address)
  log('AnybodyProblemV0 address updated in Speedruns')

  // update ExternalMetadata
  await externalMetadata.updateAnybodyProblemAddress(anybodyProblemV0.address)
  log('AnybodyProblemV0 address updated in ExternalMetadata')
  await externalMetadata.updateSpeedrunsAddress(speedruns.address)
  log('Speedruns address updated in ExternalMetadata')

  const verificationData = [
    {
      name: 'ExternalMetadata',
      constructorArguments: [themeAddress]
    },
    {
      name: 'Speedruns',
      constructorArguments: []
    },
    {
      name: 'AnybodyProblemV0',
      constructorArguments: constructorArgs
    }
  ]

  returnObject.verificationData = verificationData

  return returnObject
}

const verifyContracts = async (returnObject) => {
  const networkinfo = await hre.ethers.provider.getNetwork()
  const deployer = await hre.ethers.getSigner()
  // verify contract if network ID is mainnet goerli or sepolia
  if (
    networkinfo['chainId'] == 5 ||
    networkinfo['chainId'] == 1 ||
    networkinfo['chainId'] == 11155111 ||
    networkinfo['chainId'] == 17069 ||
    networkinfo['chainId'] == 84532 ||
    networkinfo['chainId'] == 8453
  ) {
    const verificationData = returnObject.verificationData
    for (let i = 0; i < verificationData.length; i++) {
      await new Promise((r) => setTimeout(r, 1000))
      log(`Verifying ${verificationData[i].name} Contract`)
      try {
        await hre.run('verify:verify', {
          address: returnObject[verificationData[i].name].address,
          constructorArguments: verificationData[i].constructorArguments
        })
      } catch (e) {
        i--
        await new Promise((r) => setTimeout(r, 1000))
        log({ e, verificationData: verificationData[i] })
      }
    }
  } else if (networkinfo['chainId'] == 12345) {
    // This is so dev accounts have spending money on local chain
    await deployer.sendTransaction({
      to: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
      value: ethers.utils.parseEther('1.0')
    })
    await deployer.sendTransaction({
      to: '0xc795344b1b30E3CfEE1AFA1D5204B141940CF445',
      value: ethers.utils.parseEther('1.0')
    })
  }
}

const solveLevel = async (
  owner,
  anybodyProblem,
  expect,
  runId,
  level,
  execute = true
) => {
  const day = await anybodyProblem.currentDay()
  const levelData = await anybodyProblem.generateLevelData(day, level)
  const { bodyCount, bodyData } = levelData

  const ticksRun = await getTicksRun(bodyCount)
  let missileInits = []
  const anybody = new Anybody(null, {
    util: true,
    stopEvery: ticksRun,
    test: ticksRun == 20
  })
  const newBodyData = []
  const scalingFactor = await anybodyProblem.scalingFactor()
  const maxVector = await anybodyProblem.maxVector()
  const windowWidth = ethers.BigNumber.from(anybody.windowWidth)
  for (let i = 0; i < bodyCount; i++) {
    let body = bodyData[i]
    const newRadius = ethers.BigNumber.from(10).mul(scalingFactor)

    // position x will be 3/4 of the way across the screen for the hero body
    // position x will be increments of the radius for the other bodies
    // position y will all be at the exact bottom of the screen so the gravity
    // does not affect any bodies in a vertical direction
    const pos =
      i == 0
        ? windowWidth.mul(3).div(4).mul(scalingFactor)
        : ethers.BigNumber.from(i)
            .mul(newRadius.mul(1).div(scalingFactor))
            .mul(scalingFactor)

    body = {
      bodyIndex: body.bodyIndex,
      px: pos,
      py: windowWidth.mul(scalingFactor),
      vx: ethers.BigNumber.from(1).mul(maxVector).mul(scalingFactor),
      vy: ethers.BigNumber.from(1).mul(maxVector).mul(scalingFactor),
      radius: newRadius,
      seed: body.seed
    }
    newBodyData.push(body)

    const missile = {
      step: i * 2,
      position: anybody.createVector(0, windowWidth),
      velocity: anybody.createVector(ethers.BigNumber.from(10), 0),
      radius: newRadius
    }
    missileInits.push(missile)
  }

  missileInits = anybody.processMissileInits(missileInits)
  anybody.missileInits = missileInits
  const { missiles, inflightMissile } = anybody.finish()
  const { dataResult } = await generateProof(
    owner,
    '0x' + '0'.repeat(64), // seed doesn't matter
    bodyCount,
    ticksRun,
    newBodyData,
    missiles,
    inflightMissile
  )
  for (let i = 1; i < bodyCount; i++) {
    const radiusIndex = 5 + i * 5 + 4
    expect(dataResult.publicSignals[radiusIndex]).to.equal('0')
  }

  const newBodyDataLength6 = newBodyData.concat(bodyData.slice(level + 1, 6))
  await anybodyProblem.setMockedBodyDataByLevel(level, newBodyDataLength6)

  // 0—4: missile output
  // 5—9: body 1 output
  // 10—14: body 2 output
  // 15: time output (5 + bodyCount * 5 + 1)
  // 16: address input (5 + bodyCount * 5 + 2)
  // 17—21: body 1 input
  // 22—26: body 2 input
  // 27—31: missile input (5 + 2 * bodyCount * 5 + 2)

  const paddedBodyCount = bodyCount <= 4 ? 4 : 6

  const time = dataResult.Input[5 + paddedBodyCount * 5]
  const mintingFee = await anybodyProblem.priceToSave()
  const discount = await anybodyProblem.discount()
  const price = (await anybodyProblem.priceToMint())
    .div(discount)
    .add(mintingFee)

  const tickCounts = [ticksRun]
  const a = [dataResult.a]
  const b = [dataResult.b]
  const c = [dataResult.c]
  const Input = [dataResult.Input]
  const alsoMint = true
  const args = [runId, alsoMint, 0, tickCounts, a, b, c, Input]

  if (runId == 0) {
    runId = 1
  }
  let tx3
  if (execute) {
    if (level !== 5) {
      await solveLevel(owner, anybodyProblem, expect, runId, level + 1, false)
    }
    if (level == 5) {
      await expect(
        anybodyProblem.batchSolve(...args, {
          value: price.sub(1)
        })
      ).to.be.revertedWith('Incorrect payment')
    }
    const value = level == 5 ? price : 0
    tx3 = await anybodyProblem.batchSolve(...args, {
      value
    })
    /*const receipt =*/ await tx3.wait()
    // const logs = getParsedEventLogs(receipt, anybodyProblem, 'LevelSolved')
    // console.dir({ logs }, { depth: null })
    // console.log({ owner, runId, level, time, day })
    await expect(tx3)
      .to.emit(anybodyProblem, 'LevelSolved')
      .withArgs(owner, runId, level, time, day)
  }
  return { runId, tx: tx3, time, args }
}

const log = (message) => {
  const ignoreTesting = global.ignoreTesting
  const networkinfo = global.networkinfo
  if (!networkinfo || (networkinfo['chainId'] == 12345 && !ignoreTesting))
    return
  console.log(message)
}

const getParsedEventLogs = (receipt, contract, eventName) => {
  const events = receipt.events
    .filter((x) => x.address === contract.address)
    .map((log) => contract.interface.parseLog(log))
  return eventName ? events.filter((x) => x.name === eventName) : events
}

const mintProblem = async (/*signers, deployedContracts, acct*/) => {
  // const [owner] = signers
  // acct = acct || owner
  // const { Problems: problems } = deployedContracts
  // await problems.updatePaused(false)
  // await problems.updateStartDate(0)
  // const tx = await problems.connect(acct)['mint()']({ value: correctPrice })
  // const receipt = await tx.wait()
  // const runId = getParsedEventLogs(receipt, problems, 'Transfer')[0].args
  //   .tokenId
  // return { receipt, runId }
}

const generateWitness = async (
  seed,
  bodyCount,
  ticksRun,
  bodyData,
  mode = 'nft'
) => {
  const anybody = new Anybody(null, {
    bodyData,
    seed,
    util: true
  })

  const inputData = { bodies: anybody.bodyInits }
  anybody.runSteps(ticksRun)
  anybody.calculateBodyFinal()

  const bodyFinal = anybody.bodyFinal
  const dataResult = await exportCallDataGroth16(
    inputData,
    `./public/${mode}_${bodyCount}_${ticksRun}.wasm`,
    `./public/${mode}_${bodyCount}_${ticksRun}_final.zkey`
  )
  return { inputData, bodyFinal, dataResult }
}

const generateProof = async (
  address,
  seed,
  bodyCount,
  proofLength,
  bodyData,
  missiles = null,
  inflightMissile = null
) => {
  const anybody = new Anybody(null, {
    bodyData,
    seed,
    util: true,
    test: proofLength == 20,
    stopEvery: proofLength
  })
  anybody.storeInits()
  anybody.runSteps(proofLength)
  const results = anybody.finish()
  const inputData = {
    address,
    bodies: results.bodyInits,
    missiles: missiles || results.missiles
  }
  inputData.inflightMissile = inflightMissile || [
    '0',
    (anybody.windowHeight * parseInt(anybody.scalingFactor)).toString(),
    ...(inputData.missiles.length > 0 ? inputData.missiles[0] : [0, 0, 0])
  ]

  const bodyFinal = results.bodyFinal

  let useCircuit = bodyCount <= 4 ? 4 : 6
  if (useCircuit !== inputData.bodies.length) {
    const diff = useCircuit - inputData.bodies.length
    for (let i = 0; i < diff; i++) {
      inputData.bodies.push(['0', '0', '20000', '20000', '0'])
    }
  }

  // const outflightMissile = results.outflightMissiles
  // const startTime = Date.now()
  const dataResult = await exportCallDataGroth16(
    inputData,
    `./public/game_${useCircuit}_${proofLength}.wasm`,
    `./public/game_${useCircuit}_${proofLength}_final.zkey`
  )
  // bodyCount = bodyCount.toNumber()
  // const endTime = Date.now()
  // const difference = endTime - startTime
  // const differenceInReadableText = `${Math.floor(difference / 60_000)}m ${Math.floor(difference / 1000)}s ${difference % 1000}ms`
  // console.log(`Generated proof in ${differenceInReadableText} for ${ticksRun} ticks with ${bodyCount} bodies`)
  // const tickRate = ticksRun / (difference / 1000)
  // console.log(`Tick rate: ${tickRate.toFixed(2)} ticks/s`)
  // const tickRatePerBody = tickRate / bodyCount
  // console.log(`Tick rate per body: ${tickRatePerBody.toFixed(2)} ticks/s`)
  // const boostAmount = await solver.bodyBoost(bodyCount)
  return { inputData, bodyFinal, dataResult }
}

const generateAndSubmitProof = async (
  address,
  seed,
  expect,
  deployedContracts,
  problemId,
  proofLength,
  bodyData
) => {
  const bodyCount = bodyData.length
  // console.log('generateAndSubmitProof')
  const { AnybodyProblem: anybodyProblem } = deployedContracts
  const { inputData, bodyFinal, dataResult } = await generateProof(
    address,
    seed,
    bodyCount,
    proofLength,
    bodyData
  )

  const paddedBodyCount = bodyCount <= 4 ? 4 : 6
  // 0—4: missile output
  // 5—9: body 1 output
  // 10—14: body 2 output
  // 15: time output (5 + bodyCount * 5 + 1)
  // 16: address input (5 + bodyCount * 5 + 2)
  // 17—21: body 1 input
  // 22—26: body 2 input
  // 27—31: missile input (5 + 2 * bodyCount * 5 + 2)

  const missileOutputIndex = 4
  const bodyOutputIndex = missileOutputIndex + bodyCount * 5
  const paddedBodyOutputIndex = missileOutputIndex + paddedBodyCount * 5
  const timeOutputIndex = paddedBodyOutputIndex + 1
  const addressInputIndex = timeOutputIndex + 1
  const bodyInputIndex = addressInputIndex + bodyCount * 5
  const paddedBodyInputIndex = addressInputIndex + paddedBodyCount * 5
  const missileInputIndex = paddedBodyInputIndex + 5
  // console.dir({ bodyFinal }, { depth: null })
  // console.dir({ inputData }, { depth: null })
  // console.dir({ dataResult: dataResult.Input }, { depth: null })
  // console.log({
  //   missileOutputIndex,
  //   bodyOutputIndex,
  //   timeOutputIndex,
  //   addressInputIndex,
  //   bodyInputIndex,
  //   missileInputIndex
  // })

  for (let i = 0; i < dataResult.Input.length; i++) {
    if (i <= missileOutputIndex) {
      // console.log({ i }, '<= missileOutputIndex')
      // TODO: check the missile output here?
      continue
    } else if (i <= bodyOutputIndex) {
      // console.log({ i }, '<= bodyOutputIndex')
      const bodyIndex = Math.floor((i - 5) / 5)
      const body = bodyFinal[bodyIndex]
      const bodyDataIndex = (i - 5) % 5
      // console.log({ i, bodyIndex, bodyDataIndex })
      expect(dataResult.Input[i]).to.equal(body[bodyDataIndex].toString())
    } else if (i <= timeOutputIndex) {
      // console.log({ i }, '<= timeOutputIndex')

      // TODO: check the speed here?
      continue
    } else if (i <= addressInputIndex) {
      // console.log({ i }, '<= addressInputIndex')

      // TODO: check the address input here?
      continue
    } else if (i <= bodyInputIndex) {
      // console.log({ i }, '<= bodyInputIndex')

      const ii = i - addressInputIndex
      const bodyIndex = Math.floor((ii - 1) / 5)
      const body = inputData.bodies[bodyIndex]
      const bodyDataIndex = (ii - 1) % 5
      // console.log({ i, ii, bodyIndex, bodyDataIndex })
      expect(dataResult.Input[i]).to.equal(body[bodyDataIndex].toString())
    } else if (i <= missileInputIndex) {
      // console.log({ i }, '<= missileInputIndex')
      // TODO: check the missile input here?
      continue
    } else {
      throw new Error(`Invalid index ${i}`)
    }
  }
  const batchLength = 1

  const proofLengths = []
  const a = []
  const b = []
  const c = []
  const Input = []
  for (let i = 0; i < batchLength; i++) {
    proofLengths.push(proofLength)
    a.push(dataResult.a)
    b.push(dataResult.b)
    c.push(dataResult.c)
    Input.push(dataResult.Input)
  }
  const alsoMint = true
  const tx = await anybodyProblem.batchSolve(
    problemId,
    alsoMint,
    0,
    proofLengths,
    a,
    b,
    c,
    Input
  )
  return { tx, bodyFinal }
}

async function copyABI(name, contractName) {
  contractName = contractName || name

  var networkinfo = await hre.ethers.provider.getNetwork()
  log(`--copy ${name} ABI`)
  var pathname = path.join(
    __dirname,
    'artifacts',
    'contracts',
    `${name}.sol`,
    `${contractName}.json`
  )
  const readABI = await fs.readFile(pathname)
  const parsedABI = JSON.parse(readABI)
  const abi = parsedABI['abi']

  const newContent = { contractName, abi }

  var copy = path.join(
    __dirname,
    'server',
    'contractData',
    'ABI-' + String(networkinfo['chainId']) + `-${name}.json`
  )
  // write the new content to the new file
  await writedata(copy, JSON.stringify(newContent))

  // await copyContractABI(pathname, copy)
  log('-- OK')
}

async function saveAddress(contract, name) {
  var networkinfo = await hre.ethers.provider.getNetwork()
  log('-save json for ' + name)
  var newAddress = await contract.address
  var savePath = path.join(
    __dirname,
    'server',
    'contractData',
    String(networkinfo['chainId']) + '-' + String(name) + '.json'
  )
  var objToWrite = {
    address: newAddress,
    chain: networkinfo
  }
  await writedata(savePath, JSON.stringify(objToWrite))
}

async function writedata(path, data) {
  // await fs.writeFile(path, data, function (err, result) {
  //   if (err) console.log('error', err);
  // })
  try {
    await fs.writeFile(path, data)
  } catch (e) {
    console.log('e', e)
  }
}

export {
  saveAddress,
  copyABI,
  getTicksRun,
  proverTickIndex,
  generateProof,
  generateAndSubmitProof,
  mintProblem,
  getParsedEventLogs,
  decodeUri,
  initContracts,
  deployContractsV0,
  deployContracts,
  getPathABI,
  getPathAddress,
  readData,
  testJson,
  correctPrice,
  generateWitness,
  verifyContracts,
  solveLevel,
  deployMetadata,
  getThemeName,
  deployAnybodyProblemV1
  // splitterAddress
}
