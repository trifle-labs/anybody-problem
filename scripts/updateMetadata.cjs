const { ethers } = require('hardhat')

async function main() {
  const { deployMetadata, verifyContracts, copyABI, saveAddress } =
    await import('./utils.js')
  const { AnybodyProblem: AnybodyProblemContract, Speedruns } = await import(
    '../dist/module.js'
  )

  // Deploy the metadata contract
  const {
    externalMetadata,
    assets1,
    assets2,
    assets3,
    assets4,
    assets5,
    themeAddress
  } = await deployMetadata(false)
  const returnObject = {
    ExternalMetadata: externalMetadata,
    Assets1: assets1,
    Assets2: assets2,
    Assets3: assets3,
    Assets4: assets4,
    Assets5: assets5
  }
  // Get the currently deployed anybodyProblem contract
  const AnybodyProblem = await ethers.getContractFactory('AnybodyProblem')

  const network = await ethers.provider.getNetwork()

  // update ExternalMetadata
  const anybodyAddress =
    AnybodyProblemContract.networks[network.chainId].address
  await externalMetadata.updateAnybodyProblemAddress(anybodyAddress)
  console.log('AnybodyProblem address updated')

  const speedrunAddress = Speedruns.networks[network.chainId].address
  await externalMetadata.updateSpeedrunsAddress(speedrunAddress)
  console.log('Speedruns address updated')

  await copyABI('ExternalMetadata')
  const contract = returnObject.ExternalMetadata
  await saveAddress(contract, 'ExternalMetadata')

  const anybodyProblem = AnybodyProblem.attach(anybodyAddress)
  await anybodyProblem.updateExternalMetadata(
    returnObject['ExternalMetadata'].address
  )

  await anybodyProblem.emitBatchMetadataUpdate()
  console.log('Batch metadata update emitted')

  const verificationData = [
    {
      name: 'ExternalMetadata',
      constructorArguments: [themeAddress]
    }
  ]
  returnObject['verificationData'] = verificationData

  // Verify the contracts
  await verifyContracts(returnObject, externalMetadata)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
