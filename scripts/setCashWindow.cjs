// Bump PaidSessions commit window to 1 hour while we're developing. Owner-only.
//   npx hardhat run scripts/setCashWindow.cjs --network baseSepolia
const POOL = '0x7bDa19093FC83842BBC496Fd7cd406BdB5f0aDDA'

const ABI = [
  'function setCommitWindow(uint256 seconds_)',
  'function commitWindowSeconds() view returns (uint256)',
  'function COMMIT_WINDOW_MAX_SECONDS() view returns (uint256)',
  'function owner() view returns (address)'
]

const TARGET_SECONDS = 3600

async function main() {
  const [signer] = await hre.ethers.getSigners()
  const ps = new hre.ethers.Contract(POOL, ABI, signer)

  const owner = await ps.owner()
  if (owner.toLowerCase() !== (await signer.getAddress()).toLowerCase()) {
    throw new Error(`signer ${await signer.getAddress()} is not owner ${owner}`)
  }

  const max = await ps.COMMIT_WINDOW_MAX_SECONDS()
  if (BigInt(TARGET_SECONDS) > BigInt(max)) {
    throw new Error(`target ${TARGET_SECONDS} exceeds contract max ${max}`)
  }

  const before = await ps.commitWindowSeconds()
  console.log(`current commitWindowSeconds=${before}`)
  const tx = await ps.setCommitWindow(TARGET_SECONDS)
  console.log(`setCommitWindow(${TARGET_SECONDS}) → ${tx.hash}`)
  await tx.wait()
  const after = await ps.commitWindowSeconds()
  console.log(`new commitWindowSeconds=${after}`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
