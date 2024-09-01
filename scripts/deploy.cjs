const hre = require('hardhat')

async function main() {
  const [deployer] = await hre.ethers.getSigners()
  console.log({ deployer: deployer.address })
  console.log('Deploy to chain:')
  const networkInfo = await hre.ethers.provider.getNetwork()
  console.log({ networkInfo })
  const { deployContracts } = await import('./utils.js')
  await deployContracts({ ignoreTesting: true })
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
