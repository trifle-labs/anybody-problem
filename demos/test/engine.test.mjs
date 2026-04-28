// Engine determinism + correctness tests.
//
// The whole proof story rests on one claim: the JS engine produces the same
// output as the circuit will, given the same initial state + input
// sequence. This file verifies the JS is at least deterministic and
// reproduces the obvious gameplay invariants of each preset.

import { test } from 'node:test'
import assert from 'node:assert/strict'

import { newState, step } from '../shared/engine.js'
import { flappyBird } from '../../physics/presets/flappyBird.js'
import { chromeDino } from '../../physics/presets/chromeDino.js'
import { platformer } from '../../physics/presets/platformer.js'

function clone(o) {
  return JSON.parse(JSON.stringify(o, (_, v) => typeof v === 'bigint' ? `${v}n` : v))
}

test('engine is deterministic — same inputs, same outputs', () => {
  const initial = {
    player: [{ px: 80, py: 200 }],
    pipe: [{ px: 200, py: 100, r: 30 }, { px: 200, py: 500, r: 30 }],
  }
  const inputs = []
  for (let i = 0; i < 100; i++) inputs.push({ flap: i % 12 === 0 })

  const s1 = newState(flappyBird, initial)
  for (const ins of inputs) step(s1, ins)
  const s2 = newState(flappyBird, initial)
  for (const ins of inputs) step(s2, ins)

  assert.deepEqual(clone(s1.objects), clone(s2.objects))
  assert.equal(s1.tick, s2.tick)
  assert.equal(s1.outcome, s2.outcome)
  assert.equal(s1.score, s2.score)
})

test('flappy: gravity pulls player down without flap', () => {
  const s = newState(flappyBird, { player: [{ px: 80, py: 100 }], pipe: [] })
  for (let i = 0; i < 5; i++) step(s, {})
  // py should have grown (downward in screen coords)
  const startPy = 100n * s.SF
  assert.ok(s.objects.player[0].py > startPy, 'player should fall under gravity')
})

test('flappy: flap impulse sets vy to a fixed upward value', () => {
  const s = newState(flappyBird, { player: [{ px: 80, py: 300 }], pipe: [] })
  step(s, { flap: true })
  // After flap, vy should be set to -25*SF
  assert.equal(s.objects.player[0].vy, -25n * s.SF)
})

test('flappy: kinematic pipes scroll left at fixed velocity', () => {
  const s = newState(flappyBird, {
    player: [{ px: 80, py: 300 }],
    pipe: [{ px: 200, py: 100, r: 30 }],
  })
  const startPx = s.objects.pipe[0].px
  step(s, {})
  step(s, {})
  step(s, {})
  // After 3 ticks at vx=-8 unscaled, should have moved -24 unscaled
  assert.equal(s.objects.pipe[0].px, startPx - 3n * 8n * s.SF)
})

test('flappy: collision with pipe → outcome=lose', () => {
  // Place pipe right on top of player so collision happens immediately
  const s = newState(flappyBird, {
    player: [{ px: 100, py: 100 }],
    pipe: [{ px: 100, py: 100, r: 30 }],
  })
  step(s, {})
  assert.equal(s.outcome, 'lose')
})

test('flappy: pipe wraps from x=0 back to x=extent', () => {
  const s = newState(flappyBird, {
    player: [{ px: 80, py: 300 }],
    pipe: [{ px: 1, py: 100, r: 30 }], // 1 unit from left edge
  })
  // pipe vx = -8/tick, so after 1 tick it's at -7 → wraps to extent + (-7) = 393
  step(s, {})
  // Worth noting: pipe.px in scaled units, extent.x = 400, SF = 100
  // Initial: 1*100=100. After tick: 100 - 8*100=−700. Wrap: -700 + 400*100 = 39300.
  // = 393 unscaled. ✓
  assert.equal(s.objects.pipe[0].px, 39300n)
})

test('dino: jump cooldown prevents double-jump', () => {
  const s = newState(chromeDino, {
    dino: [{ px: 60, py: 110 }],
    cactus: [],
    ground: [{ px: 300, py: 130, r: 0 }],
  })
  step(s, { jump: true }) // first jump triggers
  const vyAfterFirst = s.objects.dino[0].vy
  assert.equal(vyAfterFirst, -22n * s.SF)
  // The cooldown is 30 ticks. Try to jump again immediately — shouldn't change vy
  // (since cooldown > 0 prevents the impulse)
  step(s, { jump: true })
  // vy will have changed due to gravity, but should NOT have been re-set to -22*SF
  assert.notEqual(s.objects.dino[0].vy, -22n * s.SF, 'cooldown should prevent re-jump')
})

test('platformer: drag reduces velocity each tick', () => {
  const s = newState(platformer, {
    player: [{ px: 100, py: 100, vx: 10 }],
    enemy: [],
    platform: [],
  })
  const v0 = s.objects.player[0].vx
  step(s, {})
  const v1 = s.objects.player[0].vx
  // Drag should reduce vx (less than v0 in absolute value).
  // (Gravity also runs, but vy is the affected component for that.)
  assert.ok(v1 < v0, `drag should reduce vx; got ${v0} → ${v1}`)
})

test('platformer: setVelocity input overrides current vx', () => {
  const s = newState(platformer, {
    player: [{ px: 100, py: 100 }],
    enemy: [],
    platform: [],
  })
  step(s, { right: true })
  // setVelocity { vx: 15 } should set vx to 15*SF
  assert.equal(s.objects.player[0].vx, 15n * s.SF)
})
