import { ethers } from 'ethers'
import hre from 'hardhat'
import path from 'node:path'
import { promises as fs } from 'fs'
import { Anybody } from '../dist/module.js'
import { exportCallDataGroth16 } from './circuits.js'
import { LEVELS } from '../src/calculations.js'

const __dirname = path.resolve()

const correctPrice = ethers.utils.parseEther('0.0025')
const proceedRecipient = '0x6421b5Dd0872a23f952cA43d18e79A9690B2bD53' // Safe on Base

const proverTickIndex = {
  2: 250,
  3: 250,
  4: 250,
  5: 250,
  6: 250
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

const deployVerifiers = async ({
  skipVerifiers,
  deployedContracts,
  returnObject,
  ignoreTesting,
  verbose
}) => {
  ignoreTesting = ignoreTesting ?? false
  global.ignoreTesting = ignoreTesting
  verbose = verbose ?? false
  global.verbose = verbose
  skipVerifiers = skipVerifiers ?? false
  deployedContracts = deployedContracts ?? {}
  returnObject = returnObject ?? {}

  const verifiers = []
  const verifiersTicks = []
  const verifiersBodies = []

  // redeploy the verifiers, this time only 2 of them
  for (let i = 2; i <= MAX_BODY_COUNT; i++) {
    if (i !== 4 && i !== 6) continue
    const ticks = await getTicksRun(i)
    const name = `Game_${i}_${ticks}Verifier`
    const path = `contracts/${name}.sol:Groth16Verifier`
    let verifier, verifierContract
    if (skipVerifiers) {
      verifierContract = deployedContracts[name]
    } else {
      verifier = await hre.ethers.getContractFactory(path)
      verifierContract = await verifier.deploy()
      await verifierContract.deployed()
      log(`Verifier ${i} deployed at ${verifierContract.address}`)
    }
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
  return {
    verifiers,
    verifiersTicks,
    verifiersBodies,
    returnObject
  }
}

const initContracts = async (
  contractNames = [
    'AnybodyProblemV0',
    'AnybodyProblem',
    'Speedruns',
    'ExternalMetadata',
    'ThemeGroup',
    'Tournament'
  ],
  skipErrors = false // skipErrors
) => {
  let [deployer] = await hre.ethers.getSigners()

  for (let i = 3; i <= 6; i++) {
    if (i !== 4 && i !== 6) continue
    const ticks = await getTicksRun(i)
    contractNames.push(`Game_${i}_${ticks}Verifier`)
  }

  if (contractNames.includes('ThemeGroup')) {
    for (let i = 0; i < 5; i++) {
      const asset = `Assets${i + 1}`
      contractNames.push(asset)
    }
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
      returnObject[contractNames[i]] = new ethers.Contract(
        address,
        abi,
        deployer
      )
    } catch (e) {
      if (!skipErrors) {
        console.log({ e })
      }
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
  const defaultOptions = {
    mock: false,
    ignoreTesting: false,
    verbose: false,
    AnybodyProblemV0: null,
    Speedruns: null,
    ExternalMetadata: null
  }
  let {
    mock,
    ignoreTesting,
    verbose,
    AnybodyProblemV0,
    Speedruns,
    ExternalMetadata
  } = Object.assign(defaultOptions, options)
  global.ignoreTesting = ignoreTesting
  global.networkinfo = await hre.ethers.provider.getNetwork()
  global.verbose = verbose
  log('Deploying v1 contracts')

  const [deployer] = await hre.ethers.getSigners()

  const returnObject = {}
  const verifiers = []
  const verifiersTicks = []
  const verifiersBodies = []

  // redeploy the verifiers, this time only 2 of them
  for (let i = 2; i <= MAX_BODY_COUNT; i++) {
    if (i !== 4 && i !== 6) continue
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

  // use the already deployed speedruns contract and external metadata contract
  const {
    Speedruns: speedrunsDeployed,
    ExternalMetadata: externalMetadataDeployed,
    AnybodyProblemV0: anybodyProblemV0Deployed
  } = await initContracts(['AnybodyProblemV0', 'Speedruns', 'ExternalMetadata'])

  if (!Speedruns) Speedruns = speedrunsDeployed
  returnObject['Speedruns'] = Speedruns
  if (!ExternalMetadata) ExternalMetadata = externalMetadataDeployed
  returnObject['ExternalMetadata'] = ExternalMetadata
  if (!AnybodyProblemV0) AnybodyProblemV0 = anybodyProblemV0Deployed
  returnObject['AnybodyProblemV0'] = AnybodyProblemV0

  log(mock ? 'Deploying AnybodyProblemV1Mock' : 'Deploying AnybodyProblemV1')
  // deploy AnybodyProblem
  const AnybodyProblemV1 = await hre.ethers.getContractFactory(
    mock ? 'AnybodyProblemV1Mock' : 'AnybodyProblemV1'
  )

  const constructorArguments = [
    deployer.address,
    Speedruns.address,
    ExternalMetadata.address,
    verifiers,
    verifiersTicks,
    verifiersBodies,
    AnybodyProblemV0.address
  ]

  const anybodyProblemV1 = await AnybodyProblemV1.deploy(
    ...constructorArguments
  )
  await anybodyProblemV1.deployed()

  returnObject['AnybodyProblemV1'] = anybodyProblemV1

  log(
    'AnybodyProblemV1 Deployed at ' +
      String(anybodyProblemV1.address) +
      ` with speedrunsAddress ${Speedruns.address} and externalMetdataAddress ${ExternalMetadata.address} and verifiers ${verifiers} and verifiersTicks ${verifiersTicks} and verifiersBodies ${verifiersBodies} and anybodyProblemV0Address ${AnybodyProblemV0.address}`
  )

  // update AnybodyProblemV1 with proceedRecipient
  await anybodyProblemV1.updateProceedRecipient(proceedRecipient)
  log(`AnybodyProblemV1 ProceedRecipient updated to ${proceedRecipient}`)

  // update Speedruns
  await Speedruns.updateAnybodyProblemAddress(anybodyProblemV1.address)
  log(
    `AnybodyProblemV1 address updated in Speedruns to ${anybodyProblemV1.address}`
  )

  // update ExternalMetadata
  await ExternalMetadata.updateAnybodyProblemAddress(anybodyProblemV1.address)
  log(
    `AnybodyProblemV1 address updated in ExternalMetadata to ${anybodyProblemV1.address}`
  )

  // // ensure v0 is properly saved before overwriting it
  // const pathAddress = await getPathAddress('AnybodyProblem-v0')
  // const originalAbiPath = await getPathABI('AnybodyProblem-v0')
  // try {
  //   JSON.parse(await readData(pathAddress))
  //   await readData(originalAbiPath)
  // } catch (e) {
  //   throw new Error('Dont overwrite AnybodyProblem until v0 exists')
  // }

  const verificationData = [
    {
      name: 'AnybodyProblemV1',
      constructorArguments
    }
  ]
  returnObject['verificationData'] = verificationData

  if (returnObject['AnybodyProblemV3']) {
    returnObject['AnybodyProblem'] = returnObject['AnybodyProblemV3']
  } else if (returnObject['AnybodyProblemV2']) {
    returnObject['AnybodyProblem'] = returnObject['AnybodyProblemV2']
  } else if (returnObject['AnybodyProblemV1']) {
    returnObject['AnybodyProblem'] = returnObject['AnybodyProblemV1']
  }

  return returnObject
}

const deployAnybodyProblemV2 = async (options) => {
  const defaultOptions = {
    mock: false,
    ignoreTesting: false,
    skipVerifiers: false,
    verbose: false,
    AnybodyProblemV1: null,
    Speedruns: null,
    ExternalMetadata: null
  }
  let {
    mock,
    ignoreTesting,
    skipVerifiers,
    verbose,
    AnybodyProblemV0,
    AnybodyProblemV1,
    Speedruns,
    ExternalMetadata
  } = Object.assign(defaultOptions, options)
  global.ignoreTesting = ignoreTesting
  global.networkinfo = await hre.ethers.provider.getNetwork()
  global.verbose = verbose
  log('Deploying v2 contracts')

  const [deployer] = await hre.ethers.getSigners()

  // use the already deployed speedruns contract and external metadata contract
  const deployedContracts = await initContracts([
    'AnybodyProblemV0',
    'AnybodyProblemV1',
    'Speedruns',
    'ExternalMetadata'
  ])

  const { verifiers, verifiersTicks, verifiersBodies, returnObject } =
    await deployVerifiers({
      skipVerifiers,
      deployedContracts,
      ignoreTesting,
      verbose
    })

  if (!AnybodyProblemV0) AnybodyProblemV0 = deployedContracts.AnybodyProblemV0
  returnObject['AnybodyProblemV0'] = AnybodyProblemV0

  if (!Speedruns) Speedruns = deployedContracts.Speedruns
  returnObject['Speedruns'] = Speedruns

  if (!ExternalMetadata) ExternalMetadata = deployedContracts.ExternalMetadata
  returnObject['ExternalMetadata'] = ExternalMetadata

  if (!AnybodyProblemV1) AnybodyProblemV1 = deployedContracts.AnybodyProblemV1
  returnObject['AnybodyProblemV1'] = AnybodyProblemV1

  const HitchensOrderStatisticsTreeLib = await hre.ethers.getContractFactory(
    'HitchensOrderStatisticsTreeLib'
  )
  const hitchensOrderStatisticsTreeLib =
    await HitchensOrderStatisticsTreeLib.deploy()
  returnObject['HitchensOrderStatisticsTreeLib'] =
    hitchensOrderStatisticsTreeLib

  const Tournament = await hre.ethers.getContractFactory('Tournament', {
    // TODO: why did i need to do this at one point and not now?
    // libraries: {
    //   HitchensOrderStatisticsTreeLib: hitchensOrderStatisticsTreeLib.address
    // }
  })
  const tournament = await Tournament.deploy()
  log('Tournament Deployed at ' + String(tournament.address))
  returnObject['Tournament'] = tournament

  log(mock ? 'Deploying AnybodyProblemV2Mock' : 'Deploying AnybodyProblemV2')
  // deploy AnybodyProblem
  const AnybodyProblemV2 = await hre.ethers.getContractFactory(
    mock ? 'AnybodyProblemV2Mock' : 'AnybodyProblemV2'
  )

  const constructorArguments = [
    deployer.address,
    Speedruns.address,
    ExternalMetadata.address,
    tournament.address,
    verifiers,
    verifiersTicks,
    verifiersBodies,
    AnybodyProblemV1.address
  ]

  const anybodyProblemV2 = await AnybodyProblemV2.deploy(
    ...constructorArguments
  )
  await anybodyProblemV2.deployed()

  returnObject['AnybodyProblemV2'] = anybodyProblemV2

  log(
    'AnybodyProblemV2 Deployed at ' +
      String(anybodyProblemV2.address) +
      ` with speedrunsAddress ${Speedruns.address} and externalMetdataAddress ${ExternalMetadata.address} and tournamentAddress ${tournament.address} and verifiers ${verifiers} and verifiersTicks ${verifiersTicks} and verifiersBodies ${verifiersBodies} and anybodyProblemV0Address ${AnybodyProblemV1.address}`
  )

  // update AnybodyProblemV2 with proceedRecipient
  await anybodyProblemV2.updateProceedRecipient(proceedRecipient)
  log(`AnybodyProblemV2 ProceedRecipient updated to ${proceedRecipient}`)

  // update Speedruns
  await Speedruns.updateAnybodyProblemAddress(anybodyProblemV2.address)
  log(
    `AnybodyProblemV2 address updated in Speedruns to ${anybodyProblemV2.address}`
  )

  // update ExternalMetadata
  await ExternalMetadata.updateAnybodyProblemAddress(anybodyProblemV2.address)
  log(
    `AnybodyProblemV2 address updated in ExternalMetadata to ${anybodyProblemV2.address}`
  )

  // update Tournament
  await tournament.updateAnybodyProblemAddress(anybodyProblemV2.address)
  log(
    `AnybodyProblemV2 address updated in Tournament to ${anybodyProblemV2.address}`
  )

  // // ensure v0 is properly saved before overwriting it
  // const pathAddress = await getPathAddress('AnybodyProblem-v0')
  // const originalAbiPath = await getPathABI('AnybodyProblem-v0')
  // try {
  //   JSON.parse(await readData(pathAddress))
  //   await readData(originalAbiPath)
  // } catch (e) {
  //   throw new Error('Dont overwrite AnybodyProblem until v0 exists')
  // }

  const verificationData = [
    {
      name: 'AnybodyProblemV2',
      constructorArguments
    },
    {
      name: 'Tournament',
      constructorArguments: []
    }
  ]
  returnObject['verificationData'] = verificationData
  if (returnObject['AnybodyProblemV2']) {
    returnObject['AnybodyProblem'] = returnObject['AnybodyProblemV2']
  } else if (returnObject['AnybodyProblemV1']) {
    returnObject['AnybodyProblem'] = returnObject['AnybodyProblemV1']
  } else if (returnObject['AnybodyProblemV0']) {
    returnObject['AnybodyProblem'] = returnObject['AnybodyProblemV0']
  }
  return returnObject
}

const deployAnybodyProblemV3 = async (options) => {
  options.version = 3
  return await deployAnybodyProblemV3_4(options)
}

const deployAnybodyProblemV4 = async (options) => {
  options.version = 4
  return await deployAnybodyProblemV3_4(options)
}

const deployAnybodyProblemV3_4 = async (options) => {
  const defaultOptions = {
    version: 4,
    mock: false,
    ignoreTesting: false,
    skipVerifiers: false,
    verbose: false,
    AnybodyProblems: [],
    Speedruns: null,
    ExternalMetadata: null
  }
  let {
    version,
    mock,
    ignoreTesting,
    skipVerifiers,
    verbose,
    AnybodyProblems,
    Speedruns,
    ExternalMetadata
  } = Object.assign(defaultOptions, options)
  global.ignoreTesting = ignoreTesting
  global.networkinfo = await hre.ethers.provider.getNetwork()
  global.verbose = verbose
  log(`Deploying v${version} contracts`)

  const [deployer] = await hre.ethers.getSigners()

  const initContractsNames = ['Speedruns', 'ExternalMetadata']
  for (let i = 0; i < version; i++) {
    const name = `AnybodyProblemV${i}`
    initContractsNames.push(name)
  }
  // use the already deployed speedruns contract and external metadata contract
  let deployedContracts = await initContracts(initContractsNames, true)
  const { verifiers, verifiersTicks, verifiersBodies, returnObject } =
    await deployVerifiers({
      skipVerifiers,
      deployedContracts,
      ignoreTesting,
      verbose
    })

  if (!Speedruns) Speedruns = deployedContracts.Speedruns
  returnObject['Speedruns'] = Speedruns

  if (!ExternalMetadata) ExternalMetadata = deployedContracts.ExternalMetadata
  returnObject['ExternalMetadata'] = ExternalMetadata

  for (let i = 0; i < version; i++) {
    const targetName = `AnybodyProblemV${i}`
    let found = false
    for (let j = 0; j < AnybodyProblems.length; j++) {
      const name = AnybodyProblems[j].name
      if (name === targetName) {
        found = true
        returnObject[targetName] = AnybodyProblems[j].contract
      }
    }
    if (!found) {
      returnObject[targetName] = deployedContracts[targetName]
    }
  }

  const HitchensOrderStatisticsTreeLib = await hre.ethers.getContractFactory(
    'HitchensOrderStatisticsTreeLib'
  )
  const hitchensOrderStatisticsTreeLib =
    await HitchensOrderStatisticsTreeLib.deploy()
  returnObject['HitchensOrderStatisticsTreeLib'] =
    hitchensOrderStatisticsTreeLib

  const Tournament = await hre.ethers.getContractFactory('Tournament', {
    // TODO: why did i need to do this at one point and not now?
    // libraries: {
    //   HitchensOrderStatisticsTreeLib: hitchensOrderStatisticsTreeLib.address
    // }
  })
  const tournament = await Tournament.deploy()
  log('Tournament Deployed at ' + String(tournament.address))
  returnObject['Tournament'] = tournament

  log(
    mock
      ? `Deploying AnybodyProblemV${version}Mock`
      : `Deploying AnybodyProblemV${version}`
  )
  // deploy AnybodyProblem
  const AnybodyProblem = await hre.ethers.getContractFactory(
    mock ? `AnybodyProblemV${version}Mock` : 'AnybodyProblemV' + version
  )
  let previousVersion = AnybodyProblems.find(
    (p) => p.name == `AnybodyProblemV${version - 1}`
  )
  if (!previousVersion) {
    previousVersion = deployedContracts[`AnybodyProblemV${version - 1}`]
    if (!previousVersion) {
      throw new Error(`previous version (v${version - 1})  not found`)
    }
  } else {
    previousVersion = previousVersion.contract
  }

  const constructorArguments = [
    deployer.address,
    Speedruns.address,
    ExternalMetadata.address,
    tournament.address,
    verifiers,
    verifiersTicks,
    verifiersBodies,
    previousVersion.address
  ]

  const anybodyProblem = await AnybodyProblem.deploy(...constructorArguments)
  await anybodyProblem.deployed()

  returnObject['AnybodyProblemV' + version] = anybodyProblem

  log(
    `AnybodyProblemV${version} Deployed at ` +
      String(anybodyProblem.address) +
      ` with speedrunsAddress ${Speedruns.address} and externalMetdataAddress ${ExternalMetadata.address} and tournamentAddress ${tournament.address} and verifiers ${verifiers} and verifiersTicks ${verifiersTicks} and verifiersBodies ${verifiersBodies} and anybodyProblemV${version - 1}Address ${previousVersion.address}`
  )

  // update anybodyProblem with proceedRecipient
  await anybodyProblem.updateProceedRecipient(proceedRecipient)
  log(
    `AnybodyProblemV${version} ProceedRecipient updated to ${proceedRecipient}`
  )

  // update Speedruns
  await Speedruns.updateAnybodyProblemAddress(anybodyProblem.address)
  log(
    `AnybodyProblemV${version} address updated in Speedruns to ${anybodyProblem.address}`
  )

  // update ExternalMetadata
  await ExternalMetadata.updateAnybodyProblemAddress(anybodyProblem.address)
  log(
    `AnybodyProblemV${version} address updated in ExternalMetadata to ${anybodyProblem.address}`
  )

  // update Tournament
  await tournament.updateAnybodyProblemAddress(anybodyProblem.address)
  log(
    `AnybodyProblemV${version} address updated in Tournament to ${anybodyProblem.address}`
  )

  const verificationData = [
    {
      name: 'AnybodyProblemV' + version,
      constructorArguments
    },
    {
      name: 'Tournament',
      constructorArguments: []
    }
  ]
  returnObject['verificationData'] = verificationData
  returnObject['AnybodyProblem'] = anybodyProblem
  AnybodyProblems.push({
    name: `AnybodyProblemV${version}`,
    contract: anybodyProblem
  })
  returnObject['AnybodyProblems'] = AnybodyProblems
  for (let i = 0; i < AnybodyProblems.length; i++) {
    returnObject[AnybodyProblems[i].name] = AnybodyProblems[i].contract
  }
  return returnObject
}

const deployMetadata = async (skipAssets = false) => {
  let externalMetadata,
    themeAddress,
    assets1,
    assets2,
    assets3,
    assets4,
    assets5
  try {
    const network = await hre.ethers.provider.getNetwork()
    global.networkinfo = network
    let themeName = getThemeName(network['chainId'])

    let byteSize, theme
    if (skipAssets) {
      const { ExternalMetadata } = await initContracts(['ExternalMetadata'])

      themeAddress = await ExternalMetadata.themeGroup()
      assets1 = { address: await ExternalMetadata.assets1() }
      assets2 = { address: await ExternalMetadata.assets2() }
      assets3 = { address: await ExternalMetadata.assets3() }
      assets4 = { address: await ExternalMetadata.assets4() }
      assets5 = { address: await ExternalMetadata.assets5() }
    } else {
      const Theme = await hre.ethers.getContractFactory(themeName)
      theme = await Theme.deploy()
      await theme.deployed()
      themeAddress = theme.address
      log(themeName + ' Deployed at ' + String(themeAddress))

      // deploy Assets1
      const Assets1 = await hre.ethers.getContractFactory('Assets1')
      let byteSize = Buffer.from(Assets1.bytecode.slice(2), 'hex').length
      log(`Assets1 byte size: ${byteSize} bytes`)
      assets1 = await Assets1.deploy()
      await assets1.deployed()
      log('Assets1 Deployed at ' + String(assets1.address))

      // deploy Assets2
      const Assets2 = await hre.ethers.getContractFactory('Assets2')
      byteSize = Buffer.from(Assets2.bytecode.slice(2), 'hex').length
      log(`Assets2 byte size: ${byteSize} bytes`)
      assets2 = await Assets2.deploy()
      await assets2.deployed()
      log('Assets2 Deployed at ' + String(assets2.address))

      // deploy Assets3
      const Assets3 = await hre.ethers.getContractFactory('Assets3')
      byteSize = Buffer.from(Assets3.bytecode.slice(2), 'hex').length
      log(`Assets3 byte size: ${byteSize} bytes`)
      assets3 = await Assets3.deploy()
      await assets3.deployed()
      log('Assets3 Deployed at ' + String(assets3.address))

      // deploy Assets4
      const Assets4 = await hre.ethers.getContractFactory('Assets4')
      byteSize = Buffer.from(Assets4.bytecode.slice(2), 'hex').length
      log(`Assets4 byte size: ${byteSize} bytes`)
      assets4 = await Assets4.deploy()
      await assets4.deployed()
      log('Assets4 Deployed at ' + String(assets4.address))

      // deploy Assets5
      const Assets5 = await hre.ethers.getContractFactory('Assets5')
      byteSize = Buffer.from(Assets5.bytecode.slice(2), 'hex').length
      log(`Assets5 byte size: ${byteSize} bytes`)
      assets5 = await Assets5.deploy()
      await assets5.deployed()
      log('Assets5 Deployed at ' + String(assets5.address))
    }

    // deploy ExternalMetadata
    const ExternalMetadata =
      await hre.ethers.getContractFactory('ExternalMetadata')
    byteSize = Buffer.from(ExternalMetadata.bytecode.slice(2), 'hex').length
    log(`ExternalMetadata byte size: ${byteSize} bytes`)
    externalMetadata = await ExternalMetadata.deploy(themeAddress)
    await externalMetadata.deployed()

    log('ExternalMetadata Deployed at ' + String(externalMetadata.address))
    await externalMetadata.setAssets([
      assets1.address,
      assets2.address,
      assets3.address,
      assets4.address,
      assets5.address
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
  if (options?.saveAndVerify) {
    await saveAndVerifyContracts(deployedContracts0)
  }
  const deployedContracts1 = await deployAnybodyProblemV1({
    ...options,
    ...deployedContracts0
  })
  if (options?.saveAndVerify) {
    await saveAndVerifyContracts(deployedContracts1)
  }
  const deployedContracts2 = await deployAnybodyProblemV2({
    ...options,
    ...deployedContracts1
  })
  if (options?.saveAndVerify) {
    await saveAndVerifyContracts(deployedContracts2)
  }
  const AnybodyProblems = [
    { name: 'AnybodyProblemV0', contract: deployedContracts0.AnybodyProblemV0 },
    { name: 'AnybodyProblemV1', contract: deployedContracts1.AnybodyProblemV1 },
    { name: 'AnybodyProblemV2', contract: deployedContracts2.AnybodyProblemV2 }
  ]
  deployedContracts2.AnybodyProblems = AnybodyProblems
  const deployedContracts3 = await deployAnybodyProblemV3({
    ...options,
    ...deployedContracts2
  })
  if (options?.saveAndVerify) {
    await saveAndVerifyContracts(deployedContracts3)
  }
  const deployedContracts4 = await deployAnybodyProblemV4({
    ...options,
    ...deployedContracts3
  })
  if (options?.saveAndVerify) {
    await saveAndVerifyContracts(deployedContracts4)
  }
  const returnValue = {
    ...deployedContracts0,
    ...deployedContracts1,
    ...deployedContracts2,
    ...deployedContracts3,
    ...deployedContracts4
  }
  return returnValue
}

const saveAndVerifyContracts = async (deployedContracts) => {
  const networkInfo = await hre.ethers.provider.getNetwork()
  for (const contractName in deployedContracts) {
    if (
      contractName == 'verificationData' ||
      contractName == 'verifiers' ||
      contractName == 'verifiersTicks' ||
      contractName == 'verifiersBodies' ||
      contractName == 'AnybodyProblem' // this is just an alias for most recent version
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
  const defaultOptions = { mock: false, ignoreTesting: false, verbose: false }
  const { mock, ignoreTesting, verbose } = Object.assign(
    defaultOptions,
    options
  )
  global.ignoreTesting = ignoreTesting
  global.verbose = verbose
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
    mock ? 'AnybodyProblemV0Mock' : 'AnybodyProblemV0'
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

  // update AnybodyProblemV1 with proceedRecipient
  await anybodyProblemV0.updateProceedRecipient(proceedRecipient)
  log(`AnybodyProblemV0 ProceedRecipient updated to ${proceedRecipient}`)

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
        await new Promise((r) => setTimeout(r, 1000))
        log({ e, verificationData: verificationData[i] })
        i--
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
  execute = true,
  skipAssert = false
) => {
  const day = await anybodyProblem.currentDay()
  const levelData = await anybodyProblem.generateLevelData(day, level)
  const { bodyCount, bodyData } = levelData
  if (!skipAssert) expect(bodyCount).to.equal(level + 2)
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
    const missileInit = anybody.processMissileInit(missile)
    missileInits.push(missileInit)
  }

  anybody.missileInits = missileInits
  const { sampleInput } = anybody.finish()
  const { inflightMissile, missiles } = sampleInput
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
    if (!skipAssert) expect(dataResult.publicSignals[radiusIndex]).to.equal('0')
  }

  const newBodyDataLength6 = newBodyData.concat(bodyData.slice(level + 2, 6))
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
    runId = (await anybodyProblem.runCount()).add(1).toNumber()
    // runId = 1
  }
  let tx3
  if (execute) {
    if (level !== LEVELS) {
      await solveLevel(
        owner,
        anybodyProblem,
        expect,
        runId,
        level + 1,
        false,
        skipAssert
      )
    }
    if (level == LEVELS) {
      // will not revert since this is likely the fastest run and price is waived
      // await expect(
      //   anybodyProblem.batchSolve(...args, {
      //     value: price.sub(1)
      //   })
      // ).to.be.revertedWith('Incorrect payment')
    }
    const value = level == LEVELS ? price : 0
    tx3 = await anybodyProblem.batchSolve(...args, {
      value
    })
    /*const receipt =*/ await tx3.wait()
    // const logs = getParsedEventLogs(receipt, anybodyProblem, 'LevelSolved')
    // console.dir({ logs }, { depth: null })
    // console.log({ owner, runId, level, time, day })
    if (!skipAssert) {
      await expect(tx3)
        .to.emit(anybodyProblem, 'LevelSolved')
        .withArgs(owner, runId, level, time, day)
    } else {
      await tx3.wait()
    }
  }
  return { runId, tx: tx3, time, args }
}

const log = (message) => {
  const ignoreTesting = global.ignoreTesting
  const networkinfo = global.networkinfo
  const verbose = global.verbose
  if (
    !verbose &&
    (!networkinfo || (networkinfo['chainId'] == 12345 && !ignoreTesting))
  )
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
    bodies: results.sampleInput.bodies,
    missiles: missiles || results.sampleInput.missiles
  }
  inputData.inflightMissile = inflightMissile || [
    '0',
    (anybody.windowHeight * parseInt(anybody.scalingFactor)).toString(),
    ...(inputData.missiles.length > 0 ? inputData.missiles[0] : [0, 0, 0])
  ]

  const bodyFinal = results.sampleOutput.bodyFinal

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
  try {
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
  } catch (e) {
    console.error('Failed to copy ABI' + name, { e })
  }
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
    console.error('Failed to write file' + path, { e })
  }
}

const earlyMonday = 1704067200 // Mon Jan 01 2024 00:00:00 GMT+0000

export {
  earlyMonday,
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
  deployAnybodyProblemV1,
  deployAnybodyProblemV2,
  deployAnybodyProblemV3,
  deployAnybodyProblemV4,
  saveAndVerifyContracts,
  proceedRecipient,
  deployVerifiers
  // splitterAddress
}
