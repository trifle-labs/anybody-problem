const hre = require('hardhat')

async function main() {
  const chainId = hre.network.config.chainId || (await hre.ethers.provider.getNetwork()).chainId
  console.log(`Deploying to chain ${chainId}...`)

  // AnybodyProblemV4 addresses
  const anybodyProblemAddress = chainId === 84532
    ? '0x9966916e93085255833EFCe47c83f66e7680AEca'  // Base Sepolia
    : '0x92F7B2e7eBbd246C592EbCA95E123b624bA4520B'  // Base Mainnet

  // Deploy Game_6_250Verifier
  console.log('Deploying Game_6_250Verifier...')
  const Verifier6Factory = await hre.ethers.getContractFactory('contracts/Game_6_250Verifier.sol:Groth16Verifier')
  const verifier6 = await Verifier6Factory.deploy()
  await verifier6.deployed()
  const verifier6Address = verifier6.address
  console.log(`Game_6_250Verifier deployed to: ${verifier6Address}`)

  // Update AnybodyProblemV4 to point to new verifier
  console.log('Updating AnybodyProblemV4 verifier mapping...')
  const anybodyProblem = await hre.ethers.getContractAt(
    ['function updateVerifier(address verifier_, uint256 verifierBodies, uint256 verifierTicks) public'],
    anybodyProblemAddress
  )
  const tx = await anybodyProblem.updateVerifier(verifier6Address, 6, 250)
  await tx.wait()
  console.log(`Updated verifiers[6][250] = ${verifier6Address}`)

  console.log('\nDone! Save this address:')
  console.log(`  Game_6_250Verifier: ${verifier6Address}`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
