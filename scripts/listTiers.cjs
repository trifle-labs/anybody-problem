// Print tier table for an existing PaidSessions deployment.
//   POOL=0x... npx hardhat run scripts/listTiers.cjs --network baseSepolia
const DEFAULT_POOL = '0xc444C3692F3A2B4C7d5d33bfBbc03D9DCb1320dF'

async function main() {
  const POOL = process.env.POOL || DEFAULT_POOL
  const p = new hre.ethers.Contract(
    POOL,
    [
      'function tierCount() view returns (uint256)',
      'function tiers(uint256) view returns (uint256 entryFee, bool enabled)',
      'function maxAffordableTier() view returns (uint16)'
    ],
    hre.ethers.provider
  )
  const n = (await p.tierCount()).toNumber()
  console.log(`pool=${POOL} tierCount=${n}`)
  for (let i = 0; i < n; i++) {
    const t = await p.tiers(i)
    const fee = BigInt(t.entryFee.toString())
    console.log(
      `  tier[${i}] entryFee=${fee} ($${(Number(fee) / 1e6).toFixed(2)}) enabled=${t.enabled}`
    )
  }
  console.log(`maxAffordableTier=${(await p.maxAffordableTier()).toString()}`)
}
main().catch((e) => {
  console.error(e)
  process.exit(1)
})
