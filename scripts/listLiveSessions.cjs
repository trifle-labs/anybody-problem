// Walks sessions 1..lastSessionId on PaidSessions and prints the ones the
// contract still treats as live (Open or Committed) vs. expired-pending-forfeit.
//   POOL=0x... npx hardhat run scripts/listLiveSessions.cjs --network baseSepolia
const DEFAULT_POOL = '0xc444C3692F3A2B4C7d5d33bfBbc03D9DCb1320dF'
const STATUS = ['None', 'Open', 'Committed', 'Settled', 'Forfeited']

async function main() {
  const POOL = process.env.POOL || DEFAULT_POOL
  const p = new hre.ethers.Contract(
    POOL,
    [
      'function lastSessionId() view returns (uint256)',
      'function totalLiabilities() view returns (uint256)',
      'function forfeitCursor() view returns (uint256)',
      'function sessions(uint256) view returns (address player, uint16 tier, uint256 startBlock, uint256 commitDeadline, uint256 proofDeadline, bytes32 seed, bytes32 scoreCommit, uint256 accumulativeTime, uint256 finalScore, uint256 netCost, uint256 reserved, uint256 payout, bool solved, uint8 status)'
    ],
    hre.ethers.provider
  )
  const USDC = new hre.ethers.Contract(
    '0x036CbD53842c5426634e7929541eC2318f3dCF7e',
    ['function balanceOf(address) view returns (uint256)'],
    hre.ethers.provider
  )
  const fmt = (v) => `$${(Number(v) / 1e6).toFixed(6)}`

  const [bal, liab, cursor, lastId] = await Promise.all([
    USDC.balanceOf(POOL),
    p.totalLiabilities(),
    p.forfeitCursor(),
    p.lastSessionId()
  ])
  const now = Math.floor(Date.now() / 1000)
  const block = await hre.ethers.provider.getBlock('latest')

  console.log(`pool ${POOL}`)
  console.log(`  balanceUSDC      = ${fmt(bal)}`)
  console.log(`  totalLiabilities = ${fmt(liab)}`)
  console.log(`  forfeitCursor    = ${cursor.toString()}`)
  console.log(`  lastSessionId    = ${lastId.toString()}`)
  console.log(`  block.timestamp  = ${block.timestamp} (now=${now}, drift=${block.timestamp - now}s)`)
  console.log()

  let liveTotal = 0n
  let pendingForfeitTotal = 0n
  const n = Number(lastId)
  for (let i = 1; i <= n; i++) {
    const s = await p.sessions(i)
    const status = Number(s.status)
    if (status !== 1 && status !== 2) continue
    const commitDL = Number(s.commitDeadline)
    const proofDL = Number(s.proofDeadline)
    const expired = status === 1 ? block.timestamp > commitDL : block.timestamp > proofDL
    const reserved = BigInt(s.reserved.toString())
    if (expired) pendingForfeitTotal += reserved
    else liveTotal += reserved
    console.log(
      `  session ${i} player=${s.player} tier=${s.tier} status=${STATUS[status]} reserved=${fmt(s.reserved)} ` +
        `commitDL=${commitDL} proofDL=${proofDL} expired=${expired}`
    )
  }
  console.log()
  console.log(`SUM live (in-window) reserved        = ${fmt(liveTotal)}`)
  console.log(`SUM pending-forfeit reserved         = ${fmt(pendingForfeitTotal)}`)
  console.log(`SUM live + pending = totalLiabilities? ${liveTotal + pendingForfeitTotal === BigInt(liab.toString())}`)
  console.log()
  console.log(`Pool (balance):              ${fmt(bal)}`)
  console.log(`Available (bal - live):      ${fmt(BigInt(bal.toString()) - liveTotal)}`)
}
main().catch((e) => {
  console.error(e)
  process.exit(1)
})
