// Quick read of an existing PaidSessions deployment.
//   POOL=0x... npx hardhat run scripts/checkPaidSessions.cjs --network baseSepolia
const DEFAULT_POOL = '0x7bDa19093FC83842BBC496Fd7cd406BdB5f0aDDA'
const USDC = '0x036CbD53842c5426634e7929541eC2318f3dCF7e'

async function main() {
  const POOL = process.env.POOL || DEFAULT_POOL
  const provider = hre.ethers.provider
  const u = new hre.ethers.Contract(
    USDC,
    ['function balanceOf(address) view returns (uint256)'],
    provider
  )
  const p = new hre.ethers.Contract(
    POOL,
    [
      'function totalLiabilities() view returns (uint256)',
      'function owner() view returns (address)',
      'function tierCount() view returns (uint256)'
    ],
    provider
  )
  const bal = BigInt((await u.balanceOf(POOL)).toString())
  const liab = BigInt((await p.totalLiabilities()).toString())
  console.log(`pool=${POOL}`)
  console.log(`USDC bal=${bal} (${Number(bal) / 1e6} USDC)`)
  console.log(`totalLiabilities=${liab} (${Number(liab) / 1e6} USDC)`)
  console.log(`surplus=${bal - liab} (${Number(bal - liab) / 1e6} USDC)`)
  console.log(`owner=${await p.owner()}`)
  console.log(`tierCount=${(await p.tierCount()).toString()}`)
}
main().catch((e) => {
  console.error(e)
  process.exit(1)
})
