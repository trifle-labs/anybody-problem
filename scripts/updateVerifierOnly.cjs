const hre = require('hardhat')

async function main() {
  const chainId = hre.network.config.chainId || (await hre.ethers.provider.getNetwork()).chainId
  console.log(`Updating verifier on chain ${chainId}...`)

  const anybodyProblemAddress = chainId === 84532
    ? '0x9966916e93085255833EFCe47c83f66e7680AEca'
    : '0x92F7B2e7eBbd246C592EbCA95E123b624bA4520B'

  const newVerifierAddress = '0x5890383C21814b976aED44a12099A292cD07b521'

  const [signer] = await hre.ethers.getSigners()
  const anybodyProblem = await hre.ethers.getContractAt(
    ['function updateVerifier(address verifier_, uint256 verifierBodies, uint256 verifierTicks) public'],
    anybodyProblemAddress,
    signer
  )

  console.log(`Calling updateVerifier(${newVerifierAddress}, 6, 250)...`)
  const tx = await anybodyProblem.updateVerifier(newVerifierAddress, 6, 250, {
    gasPrice: hre.ethers.utils.parseUnits('0.5', 'gwei')
  })
  console.log(`tx hash: ${tx.hash}`)
  await tx.wait()
  console.log('Done!')
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
