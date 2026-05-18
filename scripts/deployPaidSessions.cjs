async function main() {
  const { deployPaidSessions, saveAndVerifyContracts } = await import(
    './utils.js'
  )
  const networkInfo = await hre.ethers.provider.getNetwork()
  const chainId = networkInfo.chainId

  // Seed the prize pool on Base Sepolia (testnet); skip on mainnet and other
  // chains so the operator can fund manually after deploy. Faucet-rate-limited
  // testnet USDC so the seed is intentionally small.
  // Operator can fund the prize pool manually after deploy via PaidSessions.fundPrizePool(amount).
  const fundPrizePool = 0

  const deployedContracts = await deployPaidSessions({
    ignoreTesting: true,
    mock: false,
    houseFeeBps: 0,
    concentrationBps: 1000,
    shortWindowSize: 10,
    fundPrizePool,
    verbose: true
  })
  await saveAndVerifyContracts(deployedContracts)
}
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
