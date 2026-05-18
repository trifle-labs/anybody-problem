// Returns the deploy block number for a contract address by scanning code.
//   ADDR=0x... npx hardhat run scripts/getDeployBlock.cjs --network baseSepolia
async function main() {
  const ADDR = process.env.ADDR
  if (!ADDR) throw new Error('ADDR required')
  const provider = hre.ethers.provider
  const latest = await provider.getBlockNumber()
  // Binary search for the first block where code at ADDR is non-empty.
  let lo = 0
  let hi = latest
  while (lo < hi) {
    const mid = Math.floor((lo + hi) / 2)
    const code = await provider.getCode(ADDR, mid)
    if (code && code !== '0x') hi = mid
    else lo = mid + 1
  }
  console.log(`deploy block for ${ADDR}: ${lo}`)
  // Sanity check
  const code = await provider.getCode(ADDR, lo)
  console.log(`code length at block ${lo}: ${(code.length - 2) / 2}`)
}
main().catch((e) => {
  console.error(e)
  process.exit(1)
})
