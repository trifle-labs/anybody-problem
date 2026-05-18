// Counts Base mainnet RunSolved events across V0..V4 AnybodyProblem
// deployments so we can size the seed for PaidSessions's EMA buffers.
// Run: BASE_RPC=https://mainnet.base.org npx hardhat run scripts/countDailyRuns.cjs --network base
//   (or any node with --network defining `base` in hardhat.config that points
//   at a Base RPC. Falls back to BASE_RPC env var if --network not configured.)
const ADDRS = {
  V0: '0xf5d27243F39E8143AdcC96b9145536c24b1D9Def',
  V1: '0x7E5C0306E843712CF372F38CD0FB76c7305d3970',
  V2: '0xe0C18338bAbEb30E0E13e791eD9C91fb0D83b687',
  V3: '0x0b62e06a8da04A42393960E240025319544BB168',
  V4: '0x92F7B2e7eBbd246C592EbCA95E123b624bA4520B'
}

async function main() {
  const provider = hre.ethers.provider
  console.log('using RPC:', provider.connection?.url || '(hardhat default)')

  const abi = [
    'event RunSolved(address indexed player, uint256 indexed runId, uint256 accumulativeTime, uint256 day, uint256 streak)'
  ]
  const head = await provider.getBlockNumber()
  console.log('head block:', head)

  // Base mainnet ~2s blocks; first daily play deployment Nov 11 2024.
  // Pick a comfortably-earlier start so we don't miss V0 deploy.
  const SEARCH_FROM = Math.max(0, head - 23_000_000) // ~18mo of base @2s blocks
  const CHUNK = 1900 // public Base RPC is fussy; small chunks are reliable

  const totals = {}
  for (const [v, addr] of Object.entries(ADDRS)) {
    console.log(`\n== ${v} ${addr} ==`)
    const c = new hre.ethers.Contract(addr, abi, provider)
    const filter = c.filters.RunSolved()
    let count = 0
    let firstBlock = null
    let lastBlock = null
    for (let from = SEARCH_FROM; from <= head; from += CHUNK + 1) {
      const to = Math.min(head, from + CHUNK)
      let logs
      try {
        logs = await c.queryFilter(filter, from, to)
      } catch (e) {
        console.warn(`  chunk ${from}-${to} failed: ${e.message?.slice(0,80)}`)
        continue
      }
      if (logs.length) {
        if (firstBlock == null) firstBlock = logs[0].blockNumber
        lastBlock = logs[logs.length - 1].blockNumber
        count += logs.length
        process.stdout.write(`.`)
      }
    }
    console.log(`\n  RunSolved count: ${count}  blocks=${firstBlock}..${lastBlock}`)
    totals[v] = count
  }
  console.log('\n=== TOTALS ===')
  let grand = 0
  for (const [v, n] of Object.entries(totals)) {
    console.log(`  ${v}: ${n}`)
    grand += n
  }
  console.log(`  grand total: ${grand}`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
