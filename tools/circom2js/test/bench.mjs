// Benchmark: WASM witness calculator vs hand-written JS BigInt vs transpiled JS.
//
// What we're comparing (all do the same 4-body, 250-step physics):
//
//   1. WASM witness calculator (game_4_250.wasm) — what runs in the browser
//      today when you generate a proof.
//   2. Hand-written JS (calculations.js style) — what the user maintains by
//      hand and runs at FPS rates.
//   3. Transpiled JS (approxSqrt/approxDiv from circom2js) — to show the
//      transpiler doesn't add overhead vs hand-written JS.
//
// Runs each implementation N times and reports cold-init + warm per-call.

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { approxSqrt as transpiledApproxSqrt, approxDiv as transpiledApproxDiv } from '../examples/approxMath.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const repoRoot = path.resolve(__dirname, '../../..')

// ---------- helpers ----------

function ms(t) {
  return (t / 1e6).toFixed(3) + ' ms'
}
function us(t) {
  return (t / 1e3).toFixed(2) + ' µs'
}

function bench(name, n, fn) {
  // Warmup.
  for (let i = 0; i < Math.min(3, n); i++) fn()
  const t0 = process.hrtime.bigint()
  for (let i = 0; i < n; i++) fn()
  const t1 = process.hrtime.bigint()
  const total = Number(t1 - t0)
  const per = total / n
  console.log(
    `  ${name.padEnd(40)} ${n} iters | ${ms(total)} total | ${per > 1e6 ? ms(per) : us(per)} / call`
  )
  return per
}

// ---------- WASM witness calculator ----------

async function loadWasmCalculator() {
  const wasmBuffer = fs.readFileSync(path.join(repoRoot, 'game_4_250_js/game_4_250.wasm'))
  // The repo's witness_calculator.js is CJS but package.json sets type:module.
  // We keep an unmodified .cjs copy alongside the bench so node loads it
  // correctly without touching the original artifact.
  const { createRequire } = await import('node:module')
  const require = createRequire(import.meta.url)
  const wc = require('./witness_calculator.cjs')
  return wc(wasmBuffer)
}

function loadSampleInput() {
  // The on-disk sample (server-prover/sample/game_4_250_input.json) has missile
  // velocities that violate the current circuit's missile-limit constraint, so
  // we build a clean input here. 4 bodies, no in-flight missile, all 251
  // queued missiles inert. This is a valid witness for game_4_250.
  const STEPS = 250
  const bodies = [
    ['467446', '437848', '21329', '19892', '36000'],
    ['132246', '763106', '22342', '12690', '13000'],
    ['41536', '553684', '8556', '10016', '11000'],
    ['931417', '831774', '28154', '20639', '17000'],
  ]
  const inert = ['0', '0', '0']
  const missiles = new Array(STEPS + 1).fill(0).map(() => [...inert])
  return {
    bodies,
    missiles,
    inflightMissile: ['0', '0', '0', '0', '0'],
    address: '0xFa398d672936Dcf428116F687244034961545D91',
  }
}

// ---------- hand-written JS: full forceAccumulator + position update ----------
// Lifted from src/calculations.js with the `this` references bound to constants
// so it runs standalone. Same algorithm, same math.

const SF = 1000n
const G = 100n
const GScaled = G * SF
const minDistance = 200n
const minDistanceScaled_sq = minDistance * minDistance * SF * SF
const speedFactor = 2n
const speedLimit = 10n
const vectorLimitScaled = speedLimit * speedFactor * SF
const windowWidthScaled = 1000n * SF

function _approxSqrt(n) {
  if (n === 0n) return 0n
  let lo = 0n
  let hi = n >> 1n
  let mid, midSquared
  while (lo <= hi) {
    mid = (lo + hi) >> 1n
    midSquared = mid * mid
    if (midSquared === n) return mid
    else if (midSquared < n) lo = mid + 1n
    else hi = mid - 1n
  }
  return mid
}

function _approxDiv(dividend, divisor) {
  if (dividend === 0n) return 0n
  let lo = 0n
  let hi = dividend
  let mid, testProduct
  while (lo < hi) {
    mid = (hi + lo + 1n) >> 1n
    testProduct = mid * divisor
    if (testProduct > dividend) hi = mid - 1n
    else lo = mid
  }
  return lo
}

function calculateForceBigInt(b1, b2) {
  const dx = b2.px - b1.px
  const dy = b2.py - b1.py
  const dxAbs = dx > 0n ? dx : -dx
  const dyAbs = dy > 0n ? dy : -dy
  const unboundDistanceSquared = dx * dx + dy * dy
  const distanceSquared =
    unboundDistanceSquared < minDistanceScaled_sq ? minDistanceScaled_sq : unboundDistanceSquared
  const distance = _approxSqrt(distanceSquared)
  const bodies_sum = b1.r === 0n || b2.r === 0n ? 0n : (b1.r + b2.r) * 4n
  const distSqAvgDenom = distanceSquared * 2n
  const forceMag_num = GScaled * bodies_sum * SF
  const forceDenom = distSqAvgDenom * distance
  const forceXunsigned = _approxDiv(dxAbs * forceMag_num, forceDenom)
  const forceYunsigned = _approxDiv(dyAbs * forceMag_num, forceDenom)
  const forceX = dx < 0n ? -forceXunsigned : forceXunsigned
  const forceY = dy < 0n ? -forceYunsigned : forceYunsigned
  return [forceX, forceY]
}

function stepOnce(bodies) {
  const N = bodies.length
  const accum = new Array(N)
  for (let i = 0; i < N; i++) accum[i] = [0n, 0n]
  for (let i = 0; i < N; i++) {
    for (let j = i + 1; j < N; j++) {
      const f = calculateForceBigInt(bodies[i], bodies[j])
      const fx = speedFactor * f[0]
      const fy = speedFactor * f[1]
      accum[i][0] += fx
      accum[i][1] += fy
      accum[j][0] -= fx
      accum[j][1] -= fy
    }
  }
  for (let i = 0; i < N; i++) {
    const b = bodies[i]
    b.vx += accum[i][0]
    b.vy += accum[i][1]
    const vxAbs = b.vx > 0n ? b.vx : -b.vx
    if (vxAbs > vectorLimitScaled) b.vx = (vxAbs / b.vx) * vectorLimitScaled
    const vyAbs = b.vy > 0n ? b.vy : -b.vy
    if (vyAbs > vectorLimitScaled) b.vy = (vyAbs / b.vy) * vectorLimitScaled
    b.px += b.vx
    b.py += b.vy
    if (b.px >= windowWidthScaled) b.px = 0n
    else if (b.px <= 0n) b.px = windowWidthScaled
    if (b.py >= windowWidthScaled) b.py = 0n
    else if (b.py <= 0n) b.py = windowWidthScaled
  }
  return bodies
}

function loadJsBodies() {
  // Same initial state as the WASM input. Velocities in the input are stored
  // offset by maxVectorScaled (20_000); decode for plain math.
  const sample = loadSampleInput()
  return sample.bodies.map((b) => ({
    px: BigInt(b[0]),
    py: BigInt(b[1]),
    vx: BigInt(b[2]) - vectorLimitScaled, // un-offset
    vy: BigInt(b[3]) - vectorLimitScaled,
    r: BigInt(b[4]),
  }))
}

function runJsSteps(steps) {
  const bodies = loadJsBodies()
  for (let s = 0; s < steps; s++) stepOnce(bodies)
  return bodies
}

// ---------- main ----------

async function main() {
  console.log('=== circom witness-gen vs JS BigInt — game_4_250 (4 bodies, 250 steps) ===\n')

  // 1. WASM cold init
  console.log('[1] WASM witness calculator')
  const t0 = process.hrtime.bigint()
  const calc = await loadWasmCalculator()
  const t1 = process.hrtime.bigint()
  console.log(`  cold init (load .wasm + instantiate)     ${ms(Number(t1 - t0))}`)

  const sample = loadSampleInput()
  // Warm: run once to be sure it works
  await calc.calculateWitness(sample, 0)

  // Per-call timing — keep N modest because each call is heavy
  const wasmN = 5
  const wasmPer = await (async () => {
    for (let i = 0; i < 2; i++) await calc.calculateWitness(sample, 0)
    const ts = process.hrtime.bigint()
    for (let i = 0; i < wasmN; i++) await calc.calculateWitness(sample, 0)
    const te = process.hrtime.bigint()
    const total = Number(te - ts)
    const per = total / wasmN
    console.log(
      `  calculateWitness (warm)                  ${wasmN} iters | ${ms(total)} total | ${ms(per)} / call`
    )
    return per
  })()

  console.log()

  // 2. Hand-written JS BigInt — the same 250 steps
  console.log('[2] Hand-written JS BigInt (calculations.js style)')
  const jsPer = bench('full 250-step simulation', 100, () => runJsSteps(250))
  bench('  one step (subset)', 10000, () => stepOnce(loadJsBodies()))
  console.log()

  // 3. Transpiled JS pure functions (approxSqrt, approxDiv)
  console.log('[3] Transpiled JS — pure functions vs hand-written')
  const sqrtArg = 1_999_999_999_999n
  const divNum = 10_400_000_000_000_000_000n
  const divDen = 5_656_856_000_000_000_000n
  bench('hand-written _approxSqrt (~41-bit)', 100000, () => _approxSqrt(sqrtArg))
  bench('transpiled approxSqrt (~41-bit)', 100000, () => transpiledApproxSqrt(sqrtArg))
  bench('hand-written _approxDiv', 100000, () => _approxDiv(divNum, divDen))
  bench('transpiled approxDiv', 100000, () => transpiledApproxDiv(divNum, divDen))
  console.log()

  // Headline ratio
  console.log('=== Summary ===')
  console.log(`WASM calculateWitness (warm):      ${ms(wasmPer)}`)
  console.log(`Hand-written JS BigInt (250 steps): ${ms(jsPer)}`)
  console.log(`Speedup of JS over WASM:           ${(wasmPer / jsPer).toFixed(1)}x`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
