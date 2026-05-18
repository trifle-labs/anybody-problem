// Pulls all historical Base mainnet LevelSolved events across V0..V4 via the
// IndexSupply SQL-over-events API, groups them into runs, takes the last 4
// levels of each run (post 1-baddie-removal shape), and outputs:
//   - N: total runs (per-version and grand total)
//   - K compacted seed samples for PaidSessions's EMA buffers (equal weight)
//
// Run:
//   VITE_INDEXSUPPLY=<key> node scripts/scrapeDailyPlays.cjs > seedSamples.json
//
// VITE_INDEXSUPPLY can be set in the frontend's .env and exported, or passed
// inline. The script does not need hardhat.
//
// Output JSON shape:
//   {
//     totals: { V0, V1, V2, V3, V4, grand },
//     runs: number,        // runs with >=4 levels
//     scoreStats: { min, max, mean, p10, p50, p90 },  // score = MAX_TICKS - sum
//     samples: [ { value, weight }, ... ]  // K samples for seedSamples()
//   }
const fs = require('fs')
const path = require('path')

const ADDRS = {
  V0: '0xf5d27243F39E8143AdcC96b9145536c24b1D9Def',
  V1: '0x7E5C0306E843712CF372F38CD0FB76c7305d3970',
  V2: '0xe0C18338bAbEb30E0E13e791eD9C91fb0D83b687',
  V3: '0x0b62e06a8da04A42393960E240025319544BB168',
  V4: '0x92F7B2e7eBbd246C592EbCA95E123b624bA4520B'
}

const CHAIN = 8453 // Base mainnet
const API = process.env.VITE_INDEXSUPPLY || process.env.INDEXSUPPLY_API
if (!API) {
  console.error('Missing VITE_INDEXSUPPLY env (IndexSupply API key)')
  process.exit(1)
}

const LEVEL_SOLVED_SIG =
  'LevelSolved(address indexed player, uint256 indexed runId, uint256 indexed level, uint256 time, uint256 day)'

// Per-V5 PaidSessions: 4 levels with caps 250+500+750+1000 = 2500.
const MAX_TICKS = 2500n
// Number of compacted samples to seed each ring buffer with. PaidSessions
// caps the ring at W_LONG=1000 so we have room for organic plays to overwrite.
// Equal-weight quantiles → K=200 keeps the distribution shape without
// dominating the buffer.
const K = Number(process.env.SEED_K || 200)

async function query(sql) {
  const url =
    `https://api.indexsupply.net/query` +
    `?api-key=${API}` +
    `&query=${encodeURIComponent(sql)}` +
    `&event_signatures=${encodeURIComponent(LEVEL_SOLVED_SIG)}` +
    `&chain=${CHAIN}`
  const res = await fetch(url)
  if (!res.ok) {
    const body = await res.text()
    throw new Error(`HTTP ${res.status}: ${body.slice(0, 200)}`)
  }
  const json = await res.json()
  if (json.message) throw new Error(`API: ${json.message}`)
  const [[, ...rows]] = json.result // first inner row is column names
  return rows
}

// Pull all LevelSolved rows for one address, paging by (block_num, log_idx)
// to avoid the count(*) timeout we hit on big tables. Tune PAGE if needed.
async function fetchAllLevels(addr) {
  const PAGE = 5000
  const all = []
  let lastKey = null // [block_num, log_idx]
  // We need: runId, level, time, player, day, block_num, log_idx
  // IndexSupply event-derived tables include `block_num`, `log_idx`
  // synthetic columns for pagination.
  for (;;) {
    const where = `address = '${addr}'` +
      (lastKey
        ? ` AND (block_num, log_idx) > (${lastKey[0]}, ${lastKey[1]})`
        : '')
    const sql =
      `SELECT block_num, log_idx, player, runId, level, time, day ` +
      `FROM levelsolved WHERE ${where} ` +
      `ORDER BY block_num, log_idx LIMIT ${PAGE}`
    const rows = await query(sql)
    if (!rows.length) break
    for (const r of rows) {
      all.push({
        block_num: Number(r[0]),
        log_idx: Number(r[1]),
        player: r[2],
        runId: BigInt(r[3]),
        level: Number(r[4]),
        time: Number(r[5]),
        day: Number(r[6])
      })
    }
    const last = rows[rows.length - 1]
    lastKey = [Number(last[0]), Number(last[1])]
    process.stderr.write(`  fetched ${all.length}\r`)
    if (rows.length < PAGE) break
  }
  process.stderr.write('\n')
  return all
}

function quantile(sortedAsc, q) {
  if (!sortedAsc.length) return null
  const idx = Math.min(sortedAsc.length - 1, Math.floor(q * sortedAsc.length))
  return sortedAsc[idx]
}

async function main() {
  const totals = { V0: 0, V1: 0, V2: 0, V3: 0, V4: 0, grand: 0 }
  // Group by (version, player, runId) — runId is unique per-contract.
  const runs = new Map() // key → array of {level, time}
  for (const [v, addr] of Object.entries(ADDRS)) {
    console.error(`\n== ${v} ${addr} ==`)
    const events = await fetchAllLevels(addr)
    console.error(`  ${events.length} LevelSolved events`)
    for (const e of events) {
      const key = `${v}:${e.player.toLowerCase()}:${e.runId.toString()}`
      let arr = runs.get(key)
      if (!arr) {
        arr = []
        runs.set(key, arr)
      }
      arr.push({ level: e.level, time: e.time })
      totals[v]++
    }
  }
  totals.grand = totals.V0 + totals.V1 + totals.V2 + totals.V3 + totals.V4
  console.error('\n=== EVENT TOTALS ===')
  for (const [v, n] of Object.entries(totals)) console.error(`  ${v}: ${n}`)

  // Build per-run accumulative time using the LAST 4 levels (drops the
  // 1-baddie level that 5-level runs started with).
  const accums = []
  let dropped = 0
  for (const arr of runs.values()) {
    if (arr.length < 4) {
      dropped++
      continue
    }
    arr.sort((a, b) => a.level - b.level)
    const last4 = arr.slice(-4)
    const sum = last4.reduce((s, l) => s + l.time, 0)
    accums.push(sum)
  }
  console.error(`\nruns with >=4 levels: ${accums.length}   (dropped ${dropped} incomplete)`)
  if (!accums.length) {
    console.error('No runs to summarize.')
    return
  }

  // score = MAX_TICKS - accumulativeTime  (higher = faster)
  const scores = accums.map((t) => Number(MAX_TICKS) - t).filter((s) => s > 0)
  scores.sort((a, b) => a - b)
  const sum = scores.reduce((s, x) => s + x, 0)
  const stats = {
    n: scores.length,
    min: scores[0],
    max: scores[scores.length - 1],
    mean: sum / scores.length,
    p10: quantile(scores, 0.1),
    p50: quantile(scores, 0.5),
    p90: quantile(scores, 0.9)
  }
  console.error('\nscore stats (MAX_TICKS - sum):', stats)

  // Compact to K equal-weight quantile samples.
  const samples = []
  for (let i = 0; i < K; i++) {
    const q = (i + 0.5) / K
    samples.push({ value: quantile(scores, q), weight: 1 })
  }

  const out = {
    chain: CHAIN,
    addresses: ADDRS,
    totals,
    runs: accums.length,
    droppedIncompleteRuns: dropped,
    K,
    scoreStats: stats,
    samples
  }
  process.stdout.write(JSON.stringify(out, null, 2))
  console.error(
    `\nWrote ${samples.length} compacted samples to stdout (pipe to seedSamples.json).`
  )
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
