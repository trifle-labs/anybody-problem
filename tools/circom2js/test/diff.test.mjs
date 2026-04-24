// Differential tests: the transpiled JS must produce identical outputs to
// the hand-written calculations.js oracle (and, transitively, to the circom
// witness calculator). If any input diverges, the transpiler has a bug.

import { test } from 'node:test'
import assert from 'node:assert/strict'

import { approxSqrt, approxDiv, AbsoluteValueSubtraction } from '../examples/approxMath.js'

// Hand-rewrites of the oracle from src/calculations.js — copied inline so the
// test is self-contained and does not depend on the game's ESM entry.
function oracleApproxSqrt(n) {
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

function oracleApproxDiv(dividend, divisor) {
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

// --- tests ---

test('approxSqrt matches oracle on fixed cases', () => {
  const cases = [
    0n,
    1n,
    2n,
    3n,
    4n,
    9n,
    10n,
    99n,
    100n,
    10_000n,
    1_000_000n,
    2_000_000_000_000n, // max distanceSquared in the anybody-problem
    999_999_999_999_999_999n,
  ]
  for (const n of cases) {
    // Transpiled approxSqrt returns [lo, mid, hi]; oracle returns mid.
    const [, mid] = approxSqrt(n)
    const oracle = oracleApproxSqrt(n)
    assert.equal(mid, oracle, `approxSqrt(${n}): transpiled mid=${mid}, oracle=${oracle}`)
  }
})

test('approxSqrt matches oracle on randomized inputs', () => {
  // deterministic LCG for reproducibility
  let seed = 0xcafebabe
  const rand64 = () => {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff
    let v = BigInt(seed)
    seed = (seed * 1103515245 + 12345) & 0x7fffffff
    v = (v << 32n) | BigInt(seed)
    return v
  }
  for (let i = 0; i < 500; i++) {
    const n = rand64()
    const [, mid] = approxSqrt(n)
    assert.equal(mid, oracleApproxSqrt(n))
  }
})

test('approxDiv matches oracle on fixed cases', () => {
  const cases = [
    [0n, 1n],
    [1n, 1n],
    [10n, 3n],
    [100n, 7n],
    [1_000_000_000n, 12345n],
    [10_400_000_000_000_000_000n, 5_656_856_000_000_000_000n], // the force-denom divide
  ]
  for (const [a, b] of cases) {
    const t = approxDiv(a, b)
    const o = oracleApproxDiv(a, b)
    assert.equal(t, o, `approxDiv(${a}, ${b}): transpiled=${t}, oracle=${o}`)
  }
})

test('approxDiv matches oracle on randomized inputs', () => {
  let seed = 0xfeedface
  const rand = (max) => {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff
    return BigInt(seed) % max + 1n
  }
  for (let i = 0; i < 500; i++) {
    const a = rand(1_000_000_000n)
    const b = rand(1_000_000n)
    assert.equal(approxDiv(a, b), oracleApproxDiv(a, b))
  }
})

test('AbsoluteValueSubtraction template matches oracle', () => {
  const tpl = AbsoluteValueSubtraction(20n)
  const cases = [
    [0n, 0n],
    [5n, 3n],
    [3n, 5n],
    [1_000_000n, 1n],
    [1n, 1_000_000n],
    [500_000n, 500_001n],
  ]
  for (const [a, b] of cases) {
    const out = tpl({ in: [a, b] })
    const expected = a > b ? a - b : b - a
    assert.equal(out.out, expected, `|${a} - ${b}|: got ${out.out}, expected ${expected}`)
  }
})
