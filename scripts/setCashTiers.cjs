// Owner-only: re-tune live tier table to [$0.05, $0.50, $1, $2, $5, $10].
//   npx hardhat run scripts/setCashTiers.cjs --network baseSepolia
const POOL = '0x7bDa19093FC83842BBC496Fd7cd406BdB5f0aDDA'

const ABI = [
  'function setTier(uint16 tier, uint256 entryFee, bool enabled)',
  'function tiers(uint256) view returns (uint256 entryFee, bool enabled)',
  'function tierCount() view returns (uint256)',
  'function owner() view returns (address)'
]

// USDC base units (6 decimals)
const TIERS = [50_000, 500_000, 1_000_000, 2_000_000, 5_000_000, 10_000_000]

async function main() {
  const [signer] = await hre.ethers.getSigners()
  const ps = new hre.ethers.Contract(POOL, ABI, signer)

  const owner = await ps.owner()
  if (owner.toLowerCase() !== (await signer.getAddress()).toLowerCase()) {
    throw new Error(`signer ${await signer.getAddress()} is not owner ${owner}`)
  }

  for (let i = 0; i < TIERS.length; i++) {
    const tierId = i + 1
    const entryFee = TIERS[i]
    const tx = await ps.setTier(tierId, entryFee, true)
    console.log(`setTier(${tierId}, ${entryFee}, true) → ${tx.hash}`)
    await tx.wait()
  }

  const count = await ps.tierCount()
  console.log(`tierCount=${count}`)
  for (let i = 1; i < count; i++) {
    const t = await ps.tiers(i)
    console.log(`  tier ${i}: entryFee=${t.entryFee.toString()} enabled=${t.enabled}`)
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
