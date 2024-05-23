import { ethers } from 'ethers'
import hre from 'hardhat'
import path from 'node:path'
import { promises as fs } from 'fs'
import { Anybody } from '../src/anybody.js'
import { exportCallDataGroth16 } from './circuits.js'

const correctPrice = ethers.utils.parseEther('0.01')
// TODO: change this to the splitter address
// const splitterAddress = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'

const proverTickIndex = {
  1: 300,
  2: 300,
  3: 300,
  4: 300,
  5: 100,
  6: 100,
  7: 100,
  8: 50,
  9: 50,
  10: 50
}

const getTicksRun = async (bodyCount, ignoreTesting = false) => {
  const networkInfo = await hre.ethers.provider.getNetwork()
  if (!ignoreTesting && networkInfo['chainId'] == 12345) {
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
    '..',
    'contractData',
    'ABI-' + String(networkinfo['name']) + '-' + String(name) + '.json'
  )
  return savePath
}

async function readData(path) {
  try {
    const Newdata = await fs.readFile(path, 'utf8')
    return Newdata
  } catch (e) {
    console.log('e', e)
  }
}

const getPathAddress = async (name) => {
  var networkinfo = await hre.ethers.provider.getNetwork()
  var savePath = path.join(
    __dirname,
    '..',
    'contractData',
    String(networkinfo['name']) + '-' + String(name) + '.json'
  )
  return savePath
}

const initContracts = async (getSigners = true) => {
  let owner
  if (getSigners) {
    ;[owner] = await hre.ethers.getSigners()
  }

  const contractNames = [
    'Problems',
    'Bodies',
    'Dust',
    'Solver',
    'ProblemMetadata',
    'BodyMetadata'
  ]
  for (let i = 3; i <= 10; i++) {
    contractNames.push(`Game_${i}_20Verifier.sol`)
  }

  let returnObject = {}

  for (let i = 0; i < contractNames.length; i++) {
    const address = JSON.parse(
      await readData(await getPathAddress(contractNames[i]))
    )['address']
    const abi = JSON.parse(await readData(await getPathABI(contractNames[i])))[
      'abi'
    ]
    if (getSigners) {
      returnObject[contractNames[i]] = new ethers.Contract(address, abi, owner)
    } else {
      returnObject[contractNames[i]] = new ethers.Contract(address, abi)
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

const deployContracts = async (ignoreTesting = false) => {
  var networkinfo = await hre.ethers.provider.getNetwork()
  const testing = !ignoreTesting && networkinfo['chainId'] == 12345
  // const [owner] = await hre.ethers.getSigners()

  // order of deployment + constructor arguments

  // Nft_3_20Verifier (no args)
  // ...
  // Nft_10_20Verifier (no args)
  // ProblemMetadata (no args)
  // BodyMetadata (no args)
  // Problems (problemMetadata.address, address[10] verifiers)
  // Bodies(bodyMetadata.address, problems.address)
  // Dust (problems.address, bodies.address)
  // Solver (problems.address, dust.address)

  // Problems.updateBodies(bodies.address)
  // Problems.updateSolver(solver.address)

  // Bodies.updateDust(dust.address)

  // Dust.updateSolver(solver.address)

  const returnObject = {}
  const verifiers = []
  const verifiersTicks = []
  const verifiersBodies = []

  const maxbodies = 5 // TODO: make back to 10 when verifier contracts are fixed

  for (let i = 1; i <= maxbodies; i++) {
    const ticks = await getTicksRun(i, ignoreTesting)
    const name = `Game_${i}_${ticks}Verifier`
    const path = `contracts/${name}.sol:Groth16Verifier`
    const verifier = await hre.ethers.getContractFactory(path)
    const verifierContract = await verifier.deploy()
    await verifierContract.deployed()
    !testing && log(`Verifier ${i} deployed at ${verifierContract.address}`)
    verifiers.push(verifierContract.address)
    verifiersTicks.push(ticks)
    verifiersBodies.push(i)
    returnObject[name] = verifierContract
  }

  // deploy ProblemMetadata
  const ProblemMetadata = await hre.ethers.getContractFactory('ProblemMetadata')
  const problemMetadata = await ProblemMetadata.deploy()
  await problemMetadata.deployed()
  var problemMetadataAddress = problemMetadata.address
  returnObject['ProblemMetadata'] = problemMetadata
  !testing &&
    log('ProblemMetadata Deployed at ' + String(problemMetadataAddress))

  // deploy BodyMetadata
  const BodyMetadata = await hre.ethers.getContractFactory('BodyMetadata')
  const bodyMetadata = await BodyMetadata.deploy()
  await bodyMetadata.deployed()
  var bodyMetadataAddress = bodyMetadata.address
  returnObject['BodyMetadata'] = bodyMetadata
  !testing && log('BodyMetadata Deployed at ' + String(bodyMetadataAddress))

  // deploy Problems
  const Problems = await hre.ethers.getContractFactory('Problems')
  const problems = await Problems.deploy(
    problemMetadataAddress,
    verifiers,
    verifiersTicks,
    verifiersBodies
  )
  await problems.deployed()
  var problemsAddress = problems.address
  returnObject['Problems'] = problems
  !testing &&
    log(
      'Problems Deployed at ' +
        String(problemsAddress) +
        ` with problemMetadata ${problemMetadataAddress} and verifiers ${verifiers} and verifiersTicks ${verifiersTicks} and verifiersBodies ${verifiersBodies}`
    )

  // deploy Bodies
  const Bodies = await hre.ethers.getContractFactory('Bodies')
  const bodies = await Bodies.deploy(bodyMetadataAddress, problemsAddress)
  await bodies.deployed()
  const bodiesAddress = bodies.address
  returnObject['Bodies'] = bodies
  !testing &&
    log(
      `Bodies deployed at ${bodiesAddress} with bodyMetadata ${bodyMetadataAddress} and problemsAddress ${problemsAddress}`
    )

  // deploy Dust
  const Dust = await hre.ethers.getContractFactory('Dust')
  const dust = await Dust.deploy(problemsAddress, bodiesAddress)
  await dust.deployed()
  const dustAddress = dust.address
  returnObject['Dust'] = dust
  !testing &&
    log(
      `Dust deployed at ${dustAddress} with problemsAddress ${problemsAddress} and bodiesAddress ${bodiesAddress}`
    )

  // deploy Solver
  const Solver = await hre.ethers.getContractFactory('Solver')
  const solver = await Solver.deploy(problemsAddress)
  await solver.deployed()
  const solverAddress = solver.address
  returnObject['Solver'] = solver
  !testing &&
    log(
      `Solver deployed at ${solverAddress} with problemsAddress ${problemsAddress}`
    )

  // configure ProblemMetadata
  await problemMetadata.updateProblemsAddress(problemsAddress)
  !testing &&
    log(`ProblemMetadata configured with problemsAddress ${problemsAddress}`)

  // configure BodiesMetadata
  await bodyMetadata.updateProblemsAddress(problemsAddress)
  !testing &&
    log(`BodyMetadata configured with problemsAddress ${problemsAddress}`)
  await bodyMetadata.updateBodiesAddress(bodiesAddress)
  !testing && log(`BodyMetadata configured with bodiesAddress ${bodiesAddress}`)

  // configure Problems
  await problems.updateBodiesAddress(bodiesAddress)
  !testing && log(`Problems configured with bodiesAddress ${bodiesAddress}`)
  await problems.updateSolverAddress(solverAddress)
  !testing && log(`Problems configured with solverAddress ${solverAddress}`)

  // configure Dust
  await dust.updateSolverAddress(solverAddress)
  !testing && log(`Dust configured with solverAddress ${solverAddress}`)

  // verify contract if network ID is mainnet goerli or sepolia
  if (
    networkinfo['chainId'] == 5 ||
    networkinfo['chainId'] == 1 ||
    networkinfo['chainId'] == 11155111 ||
    networkinfo['chainId'] == 17069
  ) {
    const verificationData = [
      {
        name: 'ProblemMetadata',
        constructorArguments: []
      },
      {
        name: 'BodyMetadata',
        constructorArguments: []
      },
      {
        name: 'Problems',
        constructorArguments: [
          problemMetadataAddress,
          verifiers,
          verifiersTicks,
          verifiersBodies
        ]
      },
      {
        name: 'Bodies',
        constructorArguments: [bodyMetadataAddress, problemsAddress]
      },
      {
        name: 'Dust',
        constructorArguments: [problemsAddress, bodiesAddress]
      },
      {
        name: 'Solver',
        constructorArguments: [problemsAddress]
      }
    ]

    returnObject.verificationData = verificationData
  }

  return returnObject
}

const verifyContracts = async (returnObject) => {
  const blocksToWaitBeforeVerify = 0
  const verificationData = returnObject.verificationData
  const problemMetadata = returnObject.ProblemMetadata
  for (let i = 0; i < verificationData.length; i++) {
    await problemMetadata.deployTransaction.wait(blocksToWaitBeforeVerify)
    log(`Verifying ${verificationData[i].name} Contract`)
    try {
      await hre.run('verify:verify', {
        address: returnObject[verificationData[i].name].address,
        constructorArguments: verificationData[i].constructorArguments
      })
    } catch (e) {
      log({ e, verificationData: verificationData[i] })
    }
  }
}

const log = (message) => {
  const printLogs = process.env.npm_lifecycle_event !== 'test'
  printLogs && console.log(message)
}

const getParsedEventLogs = (receipt, contract, eventName) => {
  const events = receipt.events
    .filter((x) => x.address === contract.address)
    .map((log) => contract.interface.parseLog(log))
  return events.filter((x) => x.name === eventName)
}

const mintProblem = async (signers, deployedContracts, acct) => {
  const [owner] = signers
  acct = acct || owner
  const { Problems: problems } = deployedContracts
  await problems.updatePaused(false)
  await problems.updateStartDate(0)
  const tx = await problems.connect(acct)['mint()']({ value: correctPrice })
  const receipt = await tx.wait()
  const problemId = getParsedEventLogs(receipt, problems, 'Transfer')[0].args
    .tokenId
  return { receipt, problemId }
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
  seed,
  bodyCount,
  ticksRun,
  bodyData,
  mode = 'nft',
  missiles = null
) => {
  const anybody = new Anybody(null, {
    bodyData,
    seed,
    util: true,
    stopEvery: ticksRun,
    mode
  })
  anybody.storeInits()
  anybody.runSteps(ticksRun)
  const results = anybody.finish()
  const inputData = {
    bodies: results.bodyInits,
    missiles: missiles || results.missiles
  }
  const bodyFinal = results.bodyFinal
  // const startTime = Date.now()
  const dataResult = await exportCallDataGroth16(
    inputData,
    `./public/${mode}_${bodyCount}_${ticksRun}.wasm`,
    `./public/${mode}_${bodyCount}_${ticksRun}_final.zkey`
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
  // const dustRate = boostAmount * tickRate
  // console.log(`Dust rate: ${dustRate.toFixed(2)} dust/s`)
  // const dustRatePerBody = dustRate / bodyCount
  // console.log(`Dust rate per body: ${dustRatePerBody.toFixed(2)} dust/s`)
  return { inputData, bodyFinal, dataResult }
}

const generateAndSubmitProof = async (
  expect,
  deployedContracts,
  problemId,
  bodyCount,
  ticksRun,
  bodyData
) => {
  const { Problems: problems, Solver: solver } = deployedContracts
  const { seed } = await problems.problems(problemId)
  const { inputData, bodyFinal, dataResult } = await generateProof(
    seed,
    bodyCount,
    ticksRun,
    bodyData,
    'game'
  )
  for (let i = 0; i < dataResult.Input.length; i++) {
    const speedIndex = (dataResult.Input.length - 1) / 2
    if (i < speedIndex) {
      const bodyIndex = Math.floor(i / 5)
      const body = bodyFinal[bodyIndex]
      const bodyDataIndex = i % 5
      expect(dataResult.Input[i]).to.equal(body[bodyDataIndex].toString())
    } else if (i == speedIndex) {
      // TODO: check the speed here?
      continue
    } else {
      const ii = i - speedIndex
      const bodyIndex = Math.floor((ii - 1) / 5)
      const body = inputData.bodies[bodyIndex]
      const bodyDataIndex = (ii - 1) % 5
      expect(dataResult.Input[i]).to.equal(body[bodyDataIndex].toString())
    }
  }

  const tx = await solver.solveProblem(
    problemId,
    ticksRun,
    dataResult.a,
    dataResult.b,
    dataResult.c,
    dataResult.Input
  )
  return { tx, bodyFinal }
}

export {
  getTicksRun,
  proverTickIndex,
  generateProof,
  generateAndSubmitProof,
  mintProblem,
  getParsedEventLogs,
  decodeUri,
  initContracts,
  deployContracts,
  getPathABI,
  getPathAddress,
  readData,
  testJson,
  correctPrice,
  generateWitness,
  verifyContracts
  // splitterAddress
}
