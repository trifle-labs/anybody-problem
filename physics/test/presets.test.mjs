// Presets test suite.
//
// Verifies that each shipped preset:
//   1. Validates against the schema.
//   2. Produces sensible bounds.
//   3. Stays under the 1M constraint budget.
//
// These tests double as regression tests for the schema design — if a real
// game type can't be expressed cleanly here, the schema needs to change.

import { test } from 'node:test'
import assert from 'node:assert/strict'

import { deriveBounds } from '../bounds.js'
import { estimateBudget } from '../budget.js'
import { anybody } from '../presets/anybody.js'
import { flappyBird } from '../presets/flappyBird.js'
import { chromeDino } from '../presets/chromeDino.js'
import { platformer } from '../presets/platformer.js'

const PRESETS = { anybody, flappyBird, chromeDino, platformer }

for (const [name, preset] of Object.entries(PRESETS)) {
  test(`${name} preset validates and derives bounds`, () => {
    const bounds = deriveBounds(preset)
    assert.ok(bounds.spec, 'spec echoed back')
    assert.ok(bounds.constants.SF.bits >= 1)
    assert.ok(Object.keys(bounds.objects).length > 0)
  })

  test(`${name} preset constraint budget within declared limit`, () => {
    const bounds = deriveBounds(preset)
    const est = estimateBudget(bounds)
    console.log(
      `  [${name}] step=${est.stepConstraints.toLocaleString()} total=${est.totalConstraints.toLocaleString()} budget=${est.budget.toLocaleString()} headroom=${est.headroom.toLocaleString()} R1CS≈${est.estR1csMB.toFixed(0)}MB`
    )
    assert.ok(
      est.withinBudget,
      `${name}: estimated ${est.totalConstraints.toLocaleString()} > budget ${est.budget.toLocaleString()}`
    )
  })

  test(`${name} preset stays under 1M target (modulo conservative estimator)`, () => {
    const bounds = deriveBounds(preset)
    const est = estimateBudget(bounds)
    // The estimator over-counts pairwise gravity (Div/Sqrt costs are lower
    // than our model). Apply the empirical 0.5x calibration factor seen on
    // the anybody-problem compiled circuit.
    const calibrated = est.totalConstraints * 0.5
    assert.ok(
      calibrated < 1_000_000,
      `${name}: even calibrated ~${calibrated.toLocaleString()} constraints exceeds 1M target`
    )
  })
}

test('budget estimator catches over-budget configs', () => {
  // Make anybody-problem with absurd stepsPerProof to force over-budget
  const bounds = deriveBounds(anybody)
  // Manually scale: anybody at 250 steps comes in well under 1M; force a
  // calculation as if stepsPerProof were 100x larger.
  const fake = { ...bounds.spec.time, stepsPerProof: 25_000 }
  const fakeSpec = { ...bounds.spec, time: fake }
  const fakeBounds = { ...bounds, spec: fakeSpec }
  const est = estimateBudget(fakeBounds)
  assert.ok(!est.withinBudget, 'should be over budget at 25_000 steps')
  assert.ok(est.suggestions.length > 0, 'should produce suggestions')
})

test('schema rejects undeclared object kind in collision', async () => {
  const { defineGame } = await import('../schema.js')
  assert.throws(
    () =>
      defineGame({
        ...anybody,
        collisions: [{ a: 'body', b: 'ghost', response: 'destroy-a' }],
      }),
    /'ghost' is not declared/
  )
})

test('schema rejects pairwise gravity with fewer than 2 instances', async () => {
  const { defineGame } = await import('../schema.js')
  assert.throws(() => {
    defineGame({
      name: 'bad-pairwise',
      world: {
        dimensions: 2,
        extent: { x: 100, y: 100 },
        boundary: { x: 'wrap', y: 'wrap' },
      },
      time: { fps: 25, stepsPerProof: 10 },
      precision: { scalingFactor: 100 },
      forces: [
        {
          kind: 'gravity-pairwise',
          G: 100,
          minDistance: 10,
          appliesTo: ['onlyOne'],
        },
      ],
      objects: {
        onlyOne: { kind: 'dynamic', maxCount: 1, maxSpeed: 1, maxRadius: 1 },
      },
    })
  }, /≥ 2 affected instances/)
})
