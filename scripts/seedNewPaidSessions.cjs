// Push compacted historical seed samples into a fresh PaidSessions deployment.
//
//   POOL=0x... [SEED_WEIGHT=500000] npx hardhat run scripts/seedNewPaidSessions.cjs --network baseSepolia
//
// SEED_WEIGHT (USDC base units) is the per-sample weight written into the
// EMA buffer. Defaults to 500_000 (= $0.50, the smallest tier's netCost) so
// each seed sample carries roughly one organic game's worth of distribution
// evidence. With 200 samples this leaves ~800 ring-buffer slots for organic
// play to overwrite the seed before wrapping.
const fs = require('fs')
const path = require('path')

const ABI = [
  'function seedSamples((uint128 score, uint128 weight)[] long_, (uint128 score, uint128 weight)[] short_)',
  'function lastSessionId() view returns (uint256)',
  'function longCursor() view returns (uint256)',
  'function shortCursor() view returns (uint256)',
  'function shortWindowSize() view returns (uint256)',
  'function owner() view returns (address)'
]

async function main() {
  const POOL = process.env.POOL
  if (!POOL) throw new Error('Missing POOL env (new PaidSessions address)')
  const SEED_WEIGHT = BigInt(process.env.SEED_WEIGHT || '500000')
  const seedPath = path.join(__dirname, 'seedSamples.json')
  const seed = JSON.parse(fs.readFileSync(seedPath, 'utf8'))
  const samples = seed.samples

  const [signer] = await hre.ethers.getSigners()
  const addr = await signer.getAddress()
  const pool = new hre.ethers.Contract(POOL, ABI, signer)

  const owner = await pool.owner()
  if (owner.toLowerCase() !== addr.toLowerCase()) {
    throw new Error(`signer ${addr} is not owner ${owner}`)
  }
  const last = (await pool.lastSessionId()).toString()
  if (last !== '0') {
    throw new Error(`pool already has sessions (lastSessionId=${last}); cannot seed`)
  }

  const shortWindow = Number(await pool.shortWindowSize())
  console.log(
    `pool=${POOL} owner=${owner} shortWindow=${shortWindow} samples=${samples.length} weight=${SEED_WEIGHT}`
  )

  // Long array: all K samples in quantile order, equal weight.
  // Short array: last `shortWindow` samples (top quantiles) so the short
  // percentile starts pessimistic — the player has to do well vs the
  // historical top players to earn a short-window multiplier.
  // (After ~shortWindow real plays it'll be replaced organically anyway.)
  const longArr = samples.map((s) => ({
    score: BigInt(s.value),
    weight: SEED_WEIGHT
  }))
  const shortArr = samples
    .slice(-shortWindow)
    .map((s) => ({ score: BigInt(s.value), weight: SEED_WEIGHT }))

  // Try one batch first; fall back to splitting if it estimates over block
  // gas. 200 samples × ~50k each ≈ 10M gas, well under Base's 30M.
  console.log(`seedSamples(long=${longArr.length}, short=${shortArr.length}) ...`)
  const tx = await pool.seedSamples(longArr, shortArr)
  console.log(`tx ${tx.hash}`)
  const rcpt = await tx.wait()
  console.log(`mined block=${rcpt.blockNumber} gasUsed=${rcpt.gasUsed.toString()}`)

  const longCursor = (await pool.longCursor()).toString()
  const shortCursor = (await pool.shortCursor()).toString()
  console.log(`longCursor=${longCursor} shortCursor=${shortCursor}`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
