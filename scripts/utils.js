// import { builtinModules } from "node:module";
const ethers = require('ethers')
const hre = require('hardhat')
const path = require('node:path')
const fs = require('fs').promises

const correctPrice = ethers.utils.parseEther('0.01')
// TODO: change this to the splitter address
const splitterAddress = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'

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

const initContracts = async () => {
  const [owner] = await hre.ethers.getSigners()

  const contractNames = ['Problems', 'Bodies', 'Tocks', 'Solver', 'Metadata']
  for (let i = 3; i <= 10; i++) {
    contractNames.push(`Nft_${i}_20Verifier.sol`)
  }

  let returnObject = {}

  for (let i = 0; i < contractNames.length; i++) {
    const address = JSON.parse(await readData(await getPathAddress(contractNames[i])))['address']
    const abi = JSON.parse(await readData(await getPathABI(contractNames[i])))['abi']
    returnObject[contractNames[i]] = new ethers.Contract(address, abi, owner)
  }

  return returnObject
}


const decodeUri = (decodedJson) => {
  const metaWithoutDataURL = decodedJson.substring(decodedJson.indexOf(',') + 1)
  let buff = Buffer.from(metaWithoutDataURL, 'base64')
  let text = buff.toString('ascii')
  return text
}


const deployContracts = async () => {
  var networkinfo = await hre.ethers.provider.getNetwork()
  const blocksToWaitBeforeVerify = 0

  const testing = networkinfo['chainId'] == 12345

  // const [owner] = await hre.ethers.getSigners()

  // order of deployment + constructor arguments

  // Nft_3_20Verifier (no args)
  // ...
  // Nft_10_20Verifier (no args)
  // Metadata (no args)
  // Problems (metadata.address, address[10] verifiers)
  // Bodies(problems.address)
  // Tocks (problems.address, bodies.address)
  // Solver (problems.address, tocks.address)

  // Problems.updateBodies(bodies.address)
  // Problems.updateSolver(solver.address)

  // Bodies.updateTocks(tocks.address)

  // Tocks.updateSolver(solver.address)

  const returnObject = {}
  const verifiers = []
  const verifiersTicks = []
  const verifiersBodies = []

  for (let i = 3; i <= 10; i++) {
    const name = `Nft_${i}_20Verifier`
    const path = `contracts/${name}.sol:Groth16Verifier`
    const verifier = await hre.ethers.getContractFactory(path)
    const verifierContract = await verifier.deploy()
    await verifierContract.deployed()
    !testing && log(`Verifier ${i} deployed at ${verifierContract.address}`)
    verifiers.push(verifierContract.address)
    verifiersTicks.push(20)
    verifiersBodies.push(i)
    returnObject[name] = verifierContract
  }

  // deploy Metadata
  const Metadata = await hre.ethers.getContractFactory('Metadata')
  const metadata = await Metadata.deploy()
  await metadata.deployed()
  var metadataAddress = metadata.address
  returnObject['Metadata'] = metadata
  !testing && log('Metadata Deployed at ' + String(metadataAddress))

  // deploy Problems
  const Problems = await hre.ethers.getContractFactory('Problems')
  const problems = await Problems.deploy(metadataAddress, verifiers, verifiersTicks, verifiersBodies)
  await problems.deployed()
  var problemsAddress = problems.address
  returnObject['Problems'] = problems
  !testing && log('Problems Deployed at ' + String(problemsAddress) + ` with metadata ${metadataAddress} and verifiers ${verifiers} and verifiersTicks ${verifiersTicks} and verifiersBodies ${verifiersBodies}`)

  // deploy Bodies
  const Bodies = await hre.ethers.getContractFactory('Bodies')
  const bodies = await Bodies.deploy(problemsAddress)
  await bodies.deployed()
  const bodiesAddress = bodies.address
  returnObject['Bodies'] = bodies
  !testing && log(`Bodies deployed at ${bodiesAddress} with problemsAddress ${problemsAddress} and metadataAddress ${metadataAddress}`)

  // deploy Tocks
  const Tocks = await hre.ethers.getContractFactory('Tocks')
  const tocks = await Tocks.deploy(problemsAddress, bodiesAddress)
  await tocks.deployed()
  const tocksAddress = tocks.address
  returnObject['Tocks'] = tocks
  !testing && log(`Tocks deployed at ${tocksAddress} with problemsAddress ${problemsAddress} and bodiesAddress ${bodiesAddress}`)

  // deploy Solver
  const Solver = await hre.ethers.getContractFactory('Solver')
  const solver = await Solver.deploy(problemsAddress, tocksAddress)
  await solver.deployed()
  const solverAddress = solver.address
  returnObject['Solver'] = solver
  !testing && log(`Solver deployed at ${solverAddress} with problemsAddress ${problemsAddress} and tocksAddress ${tocksAddress}`)

  // configure Problems
  await problems.updateBodiesAddress(bodiesAddress)
  !testing && log(`Problems configured with bodiesAddress ${bodiesAddress}`)
  await problems.updateSolverAddress(solverAddress)
  !testing && log(`Problems configured with solverAddress ${solverAddress}`)

  // configure Bodies
  await bodies.updateTocksAddress(tocksAddress)
  !testing && log(`Bodies configured with tocksAddress ${tocksAddress}`)

  // configure Tocks
  await tocks.updateSolverAddress(solverAddress)
  !testing && log(`Tocks configured with solverAddress ${solverAddress}`)


  // verify contract if network ID is mainnet goerli or sepolia
  if (networkinfo['chainId'] == 5 || networkinfo['chainId'] == 1 || networkinfo['chainId'] == 11155111) {

    const verificationData = [
      {
        name: 'Metadata',
        constructorArguments: [],
      },
      {
        name: 'Problems',
        constructorArguments: [metadataAddress, verifiers, verifiersTicks, verifiersBodies],
      },
      {
        name: 'Bodies',
        constructorArguments: [problemsAddress],
      },
      {
        name: 'Tocks',
        constructorArguments: [problemsAddress, bodiesAddress],
      },
      {
        name: 'Solver',
        constructorArguments: [problemsAddress, tocksAddress],
      },
    ]

    for (let i = 0; i < verificationData.length; i++) {
      await solver.deployTransaction.wait(blocksToWaitBeforeVerify)
      !testing && log(`Verifying ${verificationData[i].name} Contract`)
      try {
        await hre.run('verify:verify', {
          address: returnObject[verificationData[i].name].address,
          constructorArguments: verificationData[i].constructorArguments,
        })
      } catch (e) {
        !testing && log({ e })
      }
    }
  }

  return returnObject
}

const log = (message) => {
  const printLogs = process.env.npm_lifecycle_event !== 'test'
  printLogs && console.log(message)
}

const getParsedEventLogs = (receipt, contract, eventName) => {
  const events = receipt.events.filter((x) => x.address === contract.address).map((log) => contract.interface.parseLog(log))
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
  const problemId = getParsedEventLogs(receipt, problems, 'Transfer')[0].args.tokenId
  return { problemId }
}

const prepareMintBody = async (signers, deployedContracts, problemId, acct) => {
  const [owner] = signers
  acct = acct || owner
  const { Tocks: tocks, Bodies: bodies } = deployedContracts
  const tockPriceIndex = await bodies.problemPriceLevels(problemId)
  const decimals = await bodies.decimals()
  const tockPrice = await bodies.tockPrice(tockPriceIndex)
  const tockPriceWithDecimals = tockPrice.mul(decimals)
  await tocks.updateSolverAddress(owner.address)
  await tocks.mint(acct.address, tockPriceWithDecimals)
}


module.exports = {

  prepareMintBody,
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
  splitterAddress
}

