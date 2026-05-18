// Reconstructs the long/short EMA buffers from SessionSettled logs and shows
// where a given score lands, plus the payout math.
//   SCORE=1339 NETCOST=478500 npx hardhat run scripts/explainPayout.cjs --network baseSepolia
const POOL = process.env.POOL || '0xc444C3692F3A2B4C7d5d33bfBbc03D9DCb1320dF'
const MY_SCORE = BigInt(process.env.SCORE || '1339')
const MAX_TICKS = 2500n
const MUL_ONE = 10n ** 18n

async function main() {
  const abi = [
    'function W_LONG() view returns (uint256)',
    'function longCursor() view returns (uint256)',
    'function longFilled() view returns (bool)',
    'function shortCursor() view returns (uint256)',
    'function shortFilled() view returns (bool)',
    'function percentileLong(uint256) view returns (uint256)',
    'function percentileShort(uint256) view returns (uint256)',
    'function f(uint256) view returns (uint256)',
    'function estimatePayout(uint16,uint256) view returns (uint256)',
    'event SessionSettled(uint256 indexed sessionId, address indexed player, uint256 score, uint256 pLong, uint256 pShort, uint256 payout)'
  ]
  const p = new hre.ethers.Contract(POOL, abi, hre.ethers.provider)

  // Pull all SessionSettled events; chunk because Base Sepolia RPC limits
  // queryFilter to 2000-block windows.
  const filter = p.filters.SessionSettled()
  const head = await hre.ethers.provider.getBlockNumber()
  // Pool was deployed recently; start a few weeks back and walk forward in
  // 1900-block chunks (~1h of base-sepolia 2s blocks per chunk).
  const START = Math.max(0, head - 300_000)
  const CHUNK = 1900
  const logs = []
  for (let from = START; from <= head; from += CHUNK + 1) {
    const to = Math.min(head, from + CHUNK)
    const part = await p.queryFilter(filter, from, to)
    if (part.length) logs.push(...part)
  }
  console.log(`SessionSettled events: ${logs.length}`)
  console.log()
  console.log('all settled scores (older → newer):')
  for (const l of logs) {
    const { sessionId, player, score, pLong, pShort, payout } = l.args
    console.log(
      `  #${sessionId} player=${player.slice(0, 10)} score=${score}  pLong=${(Number(pLong) / 1e18).toFixed(4)} pShort=${(Number(pShort) / 1e18).toFixed(4)}  payout=$${(Number(payout) / 1e6).toFixed(4)}`
    )
  }
  console.log()

  // Sort scores ascending so we can show MY_SCORE's rank
  const scores = logs.map((l) => Number(l.args.score)).sort((a, b) => a - b)
  const my = Number(MY_SCORE)
  const below = scores.filter((s) => s < my).length
  const atOrBelow = scores.filter((s) => s <= my).length
  console.log(`distribution (n=${scores.length}):`)
  for (const s of scores) {
    const mark = s === my ? '  <-- YOU' : ''
    const bar = '█'.repeat(Math.max(1, Math.round(s / 50)))
    console.log(`  ${s.toString().padStart(5)} ${bar}${mark}`)
  }
  if (!scores.includes(my)) {
    console.log(`  ${my.toString().padStart(5)} <-- YOU (not in buffer yet — these are PRE-your-settle samples)`)
  }
  console.log()
  console.log(`  scores strictly below ${my}: ${below}`)
  console.log(`  scores at-or-below ${my}: ${atOrBelow}`)
  console.log()

  // Pull buffer state + live percentile lookups
  const [pLong, pShort, lc, lf, sc, sf] = await Promise.all([
    p.percentileLong(MY_SCORE),
    p.percentileShort(MY_SCORE),
    p.longCursor(),
    p.longFilled(),
    p.shortCursor(),
    p.shortFilled()
  ])
  const mLong = await p.f(pLong)
  const mShort = await p.f(pShort)
  console.log(`buffer state:`)
  console.log(`  long:  cursor=${lc} filled=${lf}`)
  console.log(`  short: cursor=${sc} filled=${sf}`)
  console.log()
  console.log(`your score ${MY_SCORE} (= MAX_TICKS ${MAX_TICKS} - accTime ${MAX_TICKS - MY_SCORE}):`)
  console.log(`  percentileLong  = ${(Number(pLong) / 1e18).toFixed(6)}  → f(p) = ${(Number(mLong) / 1e18).toFixed(6)}`)
  console.log(`  percentileShort = ${(Number(pShort) / 1e18).toFixed(6)}  → f(p) = ${(Number(mShort) / 1e18).toFixed(6)}`)
  console.log()
  console.log(`payout formula: netCost × f(pLong)/1e18 × f(pShort)/1e18`)
  if (process.env.NETCOST) {
    const nc = BigInt(process.env.NETCOST)
    const raw = ((nc * BigInt(mLong)) / MUL_ONE) * BigInt(mShort) / MUL_ONE
    console.log(`  netCost = $${(Number(nc) / 1e6).toFixed(6)}`)
    console.log(`  raw payout = $${(Number(raw) / 1e6).toFixed(6)}`)
  } else {
    console.log(`  (set NETCOST=... to compute raw payout)`)
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
