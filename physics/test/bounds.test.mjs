// Unit tests for physics/bounds.js.
//
// These tests verify that deriveBounds() produces bit widths that match the
// values used in circuits/*.circom so the library can safely replace the
// hard-coded widths.

import { test } from 'node:test'
import assert from 'node:assert/strict'
import { deriveBounds, maxBits } from '../bounds.js'
import { ANYBODY_DEFAULTS } from '../config.js'

test('maxBits computes ceil(log2(n+1))', () => {
  assert.equal(maxBits(0n), 1) // 0 still needs a wire
  assert.equal(maxBits(1n), 1)
  assert.equal(maxBits(2n), 2)
  assert.equal(maxBits(3n), 2)
  assert.equal(maxBits(4n), 3)
  assert.equal(maxBits(1_000_000n), 20)
  assert.equal(maxBits(1_048_575n), 20)
  assert.equal(maxBits(1_048_576n), 21)
  assert.equal(maxBits(2_000_000_000_000n), 41)
})

test('deriveBounds matches hand-computed widths in the existing circuits', () => {
  const bounds = deriveBounds(ANYBODY_DEFAULTS)

  // Constants declared inline across the circuits
  assert.equal(bounds.constants.windowWidthScaled.max, 1_000_000n)
  assert.equal(bounds.constants.windowWidthScaled.bits, 20)

  assert.equal(bounds.constants.maxRadiusScaled.max, 13_000n)
  assert.equal(bounds.constants.maxRadiusScaled.bits, 14)

  assert.equal(bounds.constants.GScaled.max, 100_000n)
  assert.equal(bounds.constants.GScaled.bits, 17)

  // minDistance² · SF² = 200² · 1000² = 40_000_000_000 → 36 bits
  assert.equal(bounds.constants.minDistanceSquaredScaled.max, 40_000_000_000n)
  assert.equal(bounds.constants.minDistanceSquaredScaled.bits, 36)

  // maxVectorScaled = maxSpeed · dt · SF = 10 · 2 · 1000 = 20_000 → 15 bits
  assert.equal(bounds.constants.maxVectorScaled.max, 20_000n)
  assert.equal(bounds.constants.maxVectorScaled.bits, 15)
})

test('position and distance derivations match circuits/getDistance.circom', () => {
  const bounds = deriveBounds(ANYBODY_DEFAULTS)

  // dxAbs/dyAbs — maxBits: 20 (getDistance.circom:22,28)
  assert.equal(bounds.position.deltaAbs.bits, 20)
  assert.equal(bounds.position.deltaAbs.max, 1_000_000n)

  // dxs = dxAbs² — maxBits: 40 (getDistance.circom:30)
  assert.equal(bounds.position.deltaSquared.bits, 40)
  assert.equal(bounds.position.deltaSquared.max, 1_000_000_000_000n)

  // distanceSquared = dxs + dys — maxBits: 41 (getDistance.circom:33)
  assert.equal(bounds.position.distanceSquared.bits, 41)
  assert.equal(bounds.position.distanceSquared.max, 2_000_000_000_000n)

  // distance — maxBits: 21 (maxNum: 1_414_214) — approxMath comment
  assert.equal(bounds.position.distance.bits, 21)
  assert.ok(
    bounds.position.distance.max >= 1_414_213n &&
      bounds.position.distance.max <= 1_414_215n,
    `distance max within expected range, got ${bounds.position.distance.max}`
  )
})

test('force bounds match calculateForce.circom commentary', () => {
  const bounds = deriveBounds(ANYBODY_DEFAULTS)

  // forceDenom = 2 · distSq · distance → 63 bits (calculateForce.circom:181)
  // Circuit comment: maxNum 5_656_856_000_000_000_000
  assert.equal(bounds.force.denominator.bits, 63)

  // forceXnum = dxAbs · forceMagNumerator → 64 bits (calculateForce.circom:184)
  // Circuit comment: maxNum 10_400_000_000_000_000_000
  assert.equal(bounds.force.componentNumerator.bits, 64)
  assert.equal(
    bounds.force.componentNumerator.max,
    10_400_000_000_000_000_000n
  )
})

test('tight force output bound is far smaller than circuit overallocation', () => {
  // Notable: circuit uses LessEqThan(64) for the Div quotient even though
  // the actual quotient — once you plug in the minDistance clamp — is tiny.
  // This is where the library's bounds derivation adds value: it lets you
  // shrink the constraint system.
  const bounds = deriveBounds(ANYBODY_DEFAULTS)
  assert.ok(
    bounds.force.perPairOutput.bits < 64,
    `per-pair force output should be far less than 64 bits, got ${bounds.force.perPairOutput.bits}`
  )
})

test('changing config changes bounds predictably', () => {
  const smaller = deriveBounds({
    ...ANYBODY_DEFAULTS,
    scalingFactor: 100, // 10x less precision
    windowWidth: 500, // 2x smaller world
  })
  // positionScaled = 500 · 100 = 50_000 → 16 bits
  assert.equal(smaller.constants.windowWidthScaled.max, 50_000n)
  assert.equal(smaller.constants.windowWidthScaled.bits, 16)
})

test('missile bounds appear only when maxMissileSpeed is configured', () => {
  const withMissile = deriveBounds(ANYBODY_DEFAULTS)
  assert.ok(withMissile.missile, 'missile bounds present')
  // maxMissileVectorScaled = 15 · 2 · 1000 = 30_000 → 15 bits
  assert.equal(withMissile.missile.velocityScaled.max, 30_000n)
  assert.equal(withMissile.missile.velocityScaled.bits, 15)

  const noMissile = deriveBounds({ ...ANYBODY_DEFAULTS, maxMissileSpeed: 0 })
  assert.equal(noMissile.missile, null)
})

test('validateConfig rejects obviously bad inputs', () => {
  assert.throws(() =>
    deriveBounds({ ...ANYBODY_DEFAULTS, scalingFactor: 0 })
  )
  assert.throws(() =>
    deriveBounds({ ...ANYBODY_DEFAULTS, minDistance: 0 })
  )
  assert.throws(() =>
    deriveBounds({ ...ANYBODY_DEFAULTS, maxBodies: 1 })
  )
})
