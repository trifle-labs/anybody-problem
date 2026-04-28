// Bounds tests against the anybody-problem preset. Verifies that the new
// schema-driven derivation produces the same bit widths that are
// hand-computed in circuits/*.circom comments.

import { test } from 'node:test'
import assert from 'node:assert/strict'
import { deriveBounds, maxBits } from '../bounds.js'
import { anybody } from '../presets/anybody.js'

test('maxBits computes ceil(log2(n+1))', () => {
  assert.equal(maxBits(0n), 1)
  assert.equal(maxBits(1n), 1)
  assert.equal(maxBits(2n), 2)
  assert.equal(maxBits(1_000_000n), 20)
  assert.equal(maxBits(1_048_575n), 20)
  assert.equal(maxBits(1_048_576n), 21)
  assert.equal(maxBits(2_000_000_000_000n), 41)
})

test('anybody preset: world position bounds match circuits', () => {
  const bounds = deriveBounds(anybody)

  // windowWidth · scalingFactor = 1000 · 1000 = 1_000_000 → 20 bits
  // (matches stepState.circom:32, calculateForce.circom:53, etc.)
  assert.equal(bounds.world.extentScaled.x.max, 1_000_000n)
  assert.equal(bounds.world.extentScaled.x.bits, 20)
  assert.equal(bounds.world.extentScaled.y.bits, 20)
})

test('anybody preset: pairwise gravity force bounds match circuits', () => {
  const bounds = deriveBounds(anybody)
  const f = bounds.forces.pairwise

  // distanceSquared = 2 · 10^12 → 41 bits (getDistance.circom:33)
  assert.equal(f.distanceSquared.bits, 41)
  assert.equal(f.distanceSquared.max, 2_000_000_000_000n)

  // distance ≈ √2 · 10^6 ≈ 1_414_214 → 21 bits (approxMath comment)
  assert.equal(f.distance.bits, 21)

  // forceXNumerator = dxAbs · GScaled · massSum · SF
  //                 = 1e6 · 100_000 · 104_000 · 1000 = 1.04 · 10^19 → 64 bits
  // matches calculateForce.circom:184
  assert.equal(f.forceXNumerator.max, 10_400_000_000_000_000_000n)
  assert.equal(f.forceXNumerator.bits, 64)
})

test('anybody preset: dynamic body velocity bounds', () => {
  const bounds = deriveBounds(anybody)
  // maxSpeed=10, dt=2, SF=1000 → 20_000 → 15 bits
  assert.equal(bounds.objects.body.velocityScaled.max, 20_000n)
  assert.equal(bounds.objects.body.velocityScaled.bits, 15)
})

test('anybody preset: kinematic missile velocity bounds', () => {
  const bounds = deriveBounds(anybody)
  // missile velocity vector = [15, 15], so per-component max = 15
  // maxSpeed→velocity = max·dt·SF = 15·2·1000 = 30_000 → 15 bits
  assert.equal(bounds.objects.missile.velocityScaled.max, 30_000n)
  assert.equal(bounds.objects.missile.velocityScaled.bits, 15)
})
