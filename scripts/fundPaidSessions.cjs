// One-shot funding for PaidSessions on Base Sepolia. Reserved per buy is
// entryFee × ~10× (CURVE_TOP² / MUL_ONE), so $5 USDC unlocks $0.50 tier, $10
// covers $0.50/$1, $20 covers $0.50/$1/$2, $100 covers all tiers.
//   AMOUNT_USDC=10 npx hardhat run scripts/fundPaidSessions.cjs --network baseSepolia
const POOL = process.env.POOL || '0xc444C3692F3A2B4C7d5d33bfBbc03D9DCb1320dF'
const USDC = '0x036CbD53842c5426634e7929541eC2318f3dCF7e'

const POOL_ABI = [
  'function fundPrizePool(uint256 amount)',
  'function totalLiabilities() view returns (uint256)'
]
const USDC_ABI = [
  'function approve(address,uint256) returns (bool)',
  'function balanceOf(address) view returns (uint256)',
  'function decimals() view returns (uint8)'
]

async function main() {
  const [signer] = await hre.ethers.getSigners()
  const addr = await signer.getAddress()
  const dollars = Number(process.env.AMOUNT_USDC || '10')
  if (!(dollars > 0)) throw new Error('AMOUNT_USDC must be > 0')
  const amount = BigInt(Math.round(dollars * 1e6))

  const usdc = new hre.ethers.Contract(USDC, USDC_ABI, signer)
  const pool = new hre.ethers.Contract(POOL, POOL_ABI, signer)

  const bal = BigInt((await usdc.balanceOf(addr)).toString())
  console.log(`deployer ${addr} USDC balance=${bal} (need ${amount})`)
  if (bal < amount) throw new Error(`insufficient USDC: have ${bal}, need ${amount}`)

  const poolBalBefore = BigInt((await usdc.balanceOf(POOL)).toString())
  console.log(`pool balance before=${poolBalBefore}`)

  console.log(`approving ${amount}...`)
  const a = await usdc.approve(POOL, amount)
  await a.wait()

  console.log(`fundPrizePool(${amount})...`)
  const f = await pool.fundPrizePool(amount)
  console.log(`tx ${f.hash}`)
  await f.wait()

  const poolBalAfter = BigInt((await usdc.balanceOf(POOL)).toString())
  console.log(`pool balance after=${poolBalAfter}`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
