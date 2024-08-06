// to deploy local
//npx hardhat node
//npx hardhat run --network localhost scripts/deploy.js
const hre = require('hardhat')

// async function copyContractABI(a, b) {
//   try {
//     await fs.copyFile(a, b)
//   } catch (e) {
//     console.log('e', e)
//   }
// }

async function main() {
  const [deployer] = await hre.ethers.getSigners()
  console.log({ deployer: deployer.address })
  console.log('Deploy to chain:')
  const networkInfo = await hre.ethers.provider.getNetwork()
  console.log({ networkInfo })
  const { deployContracts, verifyContracts, copyABI, saveAddress } =
    await import('./utils.js')

  const deployedContracts = await deployContracts({ ignoreTesting: true })
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
    } else {
      await copyABI(contractName)
    }
    const contract = deployedContracts[contractName]
    await saveAddress(contract, contractName)
  }
  if (deployedContracts.verificationData) {
    await verifyContracts(deployedContracts, deployedContracts.AnybodyProblem)
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
