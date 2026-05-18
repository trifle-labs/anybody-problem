// Withdraw surplus from an existing PaidSessions deployment.
//   POOL=0x... AMOUNT_USDC=20 npx hardhat run scripts/withdrawPaidSessions.cjs --network baseSepolia
// AMOUNT_USDC=ALL withdraws the full available surplus (balance - totalLiabilities).
const DEFAULT_POOL = '0x7bDa19093FC83842BBC496Fd7cd406BdB5f0aDDA'
const USDC = '0x036CbD53842c5426634e7929541eC2318f3dCF7e'

const POOL_ABI = [
  'function withdrawSurplus(address to, uint256 amount)',
  'function totalLiabilities() view returns (uint256)',
  'function owner() view returns (address)'
]
const USDC_ABI = ['function balanceOf(address) view returns (uint256)']

async function main() {
  const [signer] = await hre.ethers.getSigners()
  const addr = await signer.getAddress()
  const POOL = process.env.POOL || DEFAULT_POOL
  const usdc = new hre.ethers.Contract(USDC, USDC_ABI, signer)
  const pool = new hre.ethers.Contract(POOL, POOL_ABI, signer)

  const owner = await pool.owner()
  console.log(`pool=${POOL} owner=${owner} signer=${addr}`)
  if (owner.toLowerCase() !== addr.toLowerCase()) {
    throw new Error(`signer ${addr} is not owner ${owner}`)
  }

  const bal = BigInt((await usdc.balanceOf(POOL)).toString())
  const liab = BigInt((await pool.totalLiabilities()).toString())
  const surplus = bal > liab ? bal - liab : 0n
  console.log(`pool USDC bal=${bal} totalLiabilities=${liab} surplus=${surplus}`)

  const want = process.env.AMOUNT_USDC || 'ALL'
  let amount
  if (want === 'ALL') {
    amount = surplus
  } else {
    const dollars = Number(want)
    if (!(dollars > 0)) throw new Error('AMOUNT_USDC must be > 0 or ALL')
    amount = BigInt(Math.round(dollars * 1e6))
  }
  if (amount === 0n) throw new Error('Nothing to withdraw')
  if (amount > surplus) {
    throw new Error(`requested ${amount} exceeds surplus ${surplus}`)
  }

  console.log(`withdrawSurplus(${addr}, ${amount}) ...`)
  const tx = await pool.withdrawSurplus(addr, amount)
  console.log(`tx ${tx.hash}`)
  await tx.wait()

  const balAfter = BigInt((await usdc.balanceOf(POOL)).toString())
  const myBal = BigInt((await usdc.balanceOf(addr)).toString())
  console.log(`pool bal after=${balAfter} | my bal=${myBal}`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
