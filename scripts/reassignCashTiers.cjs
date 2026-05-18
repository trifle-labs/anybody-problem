// One-shot: reassign PaidSessions tiers to a cheap Sepolia testing ladder.
// Run as the contract owner:
//   npx hardhat run scripts/reassignCashTiers.cjs --network baseSepolia
//
// Reassigns: t1=$0.05, t2=$0.10, t3=$0.50. Higher tiers (4=$5, 5=$10) are
// left in place — the UI auto-disables them while the pool is too thin.
const POOL = '0x67c927926e83Fd125c3D0e9FE164717D217264bc'

const ABI = [
  'function setTier(uint16 tier, uint256 entryFee, bool enabled)',
  'function tiers(uint256) view returns (uint256 entryFee, bool enabled)',
  'function owner() view returns (address)'
]

async function main() {
  const [signer] = await hre.ethers.getSigners()
  const ps = new hre.ethers.Contract(POOL, ABI, signer)

  const owner = await ps.owner()
  if (owner.toLowerCase() !== (await signer.getAddress()).toLowerCase()) {
    throw new Error(`signer ${await signer.getAddress()} is not owner ${owner}`)
  }

  const targets = [
    { tier: 1, fee: 50_000n, label: '$0.05' },
    { tier: 2, fee: 100_000n, label: '$0.10' },
    { tier: 3, fee: 500_000n, label: '$0.50' }
  ]

  for (const t of targets) {
    const tx = await ps.setTier(t.tier, t.fee, true)
    console.log(`setTier(${t.tier}, ${t.label}) → ${tx.hash}`)
    await tx.wait()
  }

  for (let i = 0; i < 6; i++) {
    const [fee, enabled] = await ps.tiers(i)
    console.log(`  tier ${i}: ${(Number(fee) / 1e6).toFixed(2)} USDC enabled=${enabled}`)
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
