// to deploy local
//npx hardhat node
//npx hardhat run --network localhost scripts/deploy.js
const hre = require('hardhat')
const path = require('node:path')

const fs = require('fs').promises

const { deployContracts } = require('./utils')

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

async function copyContractABI(a, b) {
  try {
    await fs.copyFile(a, b)
  } catch (e) {
    console.log('e', e)
  }
}

async function copyABI(name, contractName) {
  contractName = contractName || name

  var networkinfo = await hre.ethers.provider.getNetwork()
  console.log(`--copy ${name} ABI`)
  var pathname = path.join(
    __dirname,
    '..',
    'artifacts',
    'contracts',
    `${name}.sol`,
    `${contractName}.json`
  )
  var copy = path.join(
    __dirname,
    '..',
    'contractData',
    'ABI-' + String(networkinfo['name']) + `-${name}.json`
  )
  await copyContractABI(pathname, copy)
  console.log('-- OK')
}

async function saveAddress(contract, name) {
  console.log('-save json for ' + name)
  var networkinfo = await hre.ethers.provider.getNetwork()
  var newAddress = await contract.address
  var savePath = path.join(
    __dirname,
    '..',
    'contractData',
    String(networkinfo['name']) + '-' + String(name) + '.json'
  )
  var objToWrite = {
    address: newAddress,
    chain: networkinfo,
  }
  await writedata(savePath, JSON.stringify(objToWrite))
}

async function main() {
  console.log('Deploy to chain:')
  console.log(await hre.ethers.provider.getNetwork())
  const deployedContracts = await deployContracts()
  for (const contractName in deployedContracts) {
    if (contractName.indexOf('Verifier') > -1) {
      await copyABI(contractName, 'Groth16Verifier')
    } else {
      await copyABI(contractName)
    }
    const contract = deployedContracts[contractName]
    await saveAddress(contract, contractName)
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })

module.exports = { deployContracts }
