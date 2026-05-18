// Deterministic fixed-point physics engine, schema-driven.
//
// Consumes a validated GameSpec (from physics/schema.js) and runs one tick
// at a time. Every value is BigInt — same arithmetic the circuit will
// enforce. The render layer converts BigInts → Numbers for drawing only.
//
// What's supported (covers flappy / dino / platformer):
//   forces:     gravity-constant, drag-linear
//   objects:    static, kinematic (with respawn), dynamic
//   boundaries: wrap, clamp, destroy
//   collisions: circle → gameOver | block | block-from-above | destroy-*
//   inputs:     discrete with impulse / setVelocity / cooldownTicks
//
// What's not (yet — anybody-problem has its own impl):
//   pairwise gravity, bounce boundary, continuous inputs, AABB collisions.

/** Construct an initial state for a spec, given per-kind initial placements. */
export function newState(spec, initial) {
  const SF = BigInt(spec.precision.scalingFactor)
  const objects = {}
  for (const [name, kind] of Object.entries(spec.objects)) {
    const list = initial[name] ?? []
    objects[name] = list.map((o, i) => ({
      id: `${name}-${i}`,
      kind: name,
      px: BigInt(Math.round(o.px ?? 0)) * SF,
      py: BigInt(Math.round(o.py ?? 0)) * SF,
      vx: BigInt(Math.round(o.vx ?? 0)) * SF,
      vy: BigInt(Math.round(o.vy ?? 0)) * SF,
      r: BigInt(Math.round(o.r ?? kind.maxRadius)) * SF,
      alive: o.alive ?? true,
      cooldowns: {},
    }))
  }
  return {
    spec,
    SF,
    tick: 0,
    objects,
    outcome: null, // 'win' | 'lose' | null
    score: 0,
  }
}

/**
 * Run one physics tick. Returns the same state object, mutated in-place for
 * speed (cheap when you're rendering and recording each tick anyway).
 *
 * @param state    from newState
 * @param inputs   { <inputName>: boolean } — true = pressed this tick
 */
export function step(state, inputs = {}) {
  if (state.outcome) return state // game over — no more physics
  const spec = state.spec
  const SF = state.SF
  const dt = BigInt(spec.time.dt)
  const dims = spec.world.dimensions
  const axes = ['x', 'y', 'z'].slice(0, dims)

  // --- 1. Decrement cooldowns (independent of whether input is pressed) ---
  for (const [name, kind] of Object.entries(spec.objects)) {
    if (kind.kind !== 'dynamic' || !kind.inputs?.length) continue
    for (const inst of state.objects[name]) {
      for (const inp of kind.inputs) {
        const cd = inst.cooldowns[inp.name] || 0
        if (cd > 0) inst.cooldowns[inp.name] = cd - 1
      }
    }
  }

  // --- 2. Apply forces ---
  for (const f of spec.forces) {
    if (f.kind === 'gravity-constant') {
      const gx = BigInt(Math.round(f.vec[0])) * SF
      const gy = dims >= 2 ? BigInt(Math.round(f.vec[1])) * SF : 0n
      for (const target of f.appliesTo) {
        for (const inst of state.objects[target]) {
          if (!inst.alive) continue
          inst.vx += gx * dt
          inst.vy += gy * dt
        }
      }
    } else if (f.kind === 'drag-linear') {
      const DENOM = 10000n
      const num = BigInt(Math.round(f.coeff * Number(DENOM)))
      const factor = DENOM - num
      for (const target of f.appliesTo) {
        for (const inst of state.objects[target]) {
          if (!inst.alive) continue
          inst.vx = (inst.vx * factor) / DENOM
          inst.vy = (inst.vy * factor) / DENOM
        }
      }
    }
  }

  // --- 3. Clamp velocity from forces (input can still override below) ---
  for (const [name, kind] of Object.entries(spec.objects)) {
    if (kind.kind !== 'dynamic') continue
    const max = BigInt(Math.round(kind.maxSpeed)) * dt * SF
    for (const inst of state.objects[name]) {
      if (!inst.alive) continue
      if (inst.vx > max) inst.vx = max
      if (inst.vx < -max) inst.vx = -max
      if (inst.vy > max) inst.vy = max
      if (inst.vy < -max) inst.vy = -max
    }
  }

  // --- 3.5. Apply inputs LAST so they override force-derived velocity ---
  // The player's tap should authoritatively set vy this tick, not be
  // mixed with whatever gravity contributed.
  for (const [name, kind] of Object.entries(spec.objects)) {
    if (kind.kind !== 'dynamic' || !kind.inputs?.length) continue
    for (const inst of state.objects[name]) {
      if (!inst.alive) continue
      for (const inp of kind.inputs) {
        if (!inputs[inp.name]) continue
        const cd = inst.cooldowns[inp.name] || 0
        if (cd > 0) continue
        if (inp.impulse) {
          if (inp.impulse.vx != null)
            inst.vx = BigInt(Math.round(inp.impulse.vx)) * SF
          if (inp.impulse.vy != null)
            inst.vy = BigInt(Math.round(inp.impulse.vy)) * SF
          if (inp.cooldownTicks) inst.cooldowns[inp.name] = inp.cooldownTicks
        }
        if (inp.setVelocity) {
          if (inp.setVelocity.vx != null)
            inst.vx = BigInt(Math.round(inp.setVelocity.vx)) * SF
          if (inp.setVelocity.vy != null)
            inst.vy = BigInt(Math.round(inp.setVelocity.vy)) * SF
        }
      }
    }
  }

  // --- 4. Kinematic objects: velocity is fixed, set from spec each tick ---
  for (const [name, kind] of Object.entries(spec.objects)) {
    if (kind.kind !== 'kinematic') continue
    const vx = BigInt(Math.round(kind.velocity[0])) * SF
    const vy = dims >= 2 ? BigInt(Math.round(kind.velocity[1])) * SF : 0n
    for (const inst of state.objects[name]) {
      if (!inst.alive) continue
      inst.vx = vx
      inst.vy = vy
    }
  }

  // --- 5. Position update ---
  for (const list of Object.values(state.objects)) {
    for (const inst of list) {
      if (!inst.alive) continue
      const kind = spec.objects[inst.kind]
      if (kind.kind === 'static') continue
      inst.px += inst.vx
      inst.py += inst.vy
    }
  }

  // --- 6. Boundary handling per axis ---
  const bx = spec.world.boundary.x
  const by = spec.world.boundary.y ?? 'wrap'
  const wx = BigInt(spec.world.extent.x) * SF
  const wy = BigInt(spec.world.extent.y ?? 0) * SF
  for (const list of Object.values(state.objects)) {
    for (const inst of list) {
      if (!inst.alive) continue
      const kind = spec.objects[inst.kind]
      if (kind.kind === 'static') continue
      applyBoundary(inst, 'x', bx, wx, kind, state)
      if (dims >= 2) applyBoundary(inst, 'y', by, wy, kind, state)
    }
  }

  // --- 7. Kinematic respawn (for endless content) ---
  for (const [name, kind] of Object.entries(spec.objects)) {
    if (kind.kind !== 'kinematic' || !kind.respawn) continue
    for (const inst of state.objects[name]) {
      if (!inst.alive) continue
      // For now: respawn happens via boundary='wrap' which preserves the
      // pipe at x ≈ extent.x. Spec.respawn.interval is a hint for the
      // initial layout. (Full procedural respawn needs randomness which
      // the schema doesn't yet model.)
    }
  }

  // --- 8. Collisions ---
  for (const c of spec.collisions ?? []) {
    const aList = state.objects[c.a]
    const bList = state.objects[c.b]
    for (const a of aList) {
      if (!a.alive) continue
      for (const b of bList) {
        if (!b.alive) continue
        if (a === b) continue
        if (!collides(a, b, spec.objects[c.b])) continue
        applyCollisionResponse(state, a, b, c)
      }
    }
  }

  // --- 9. Termination check ---
  for (const t of spec.termination ?? []) {
    if (state.outcome) break
    if (t.kind === 'destroyed' && state.objects[t.target]) {
      const all = state.objects[t.target]
      const anyAlive = all.some((o) => o.alive)
      if (!anyAlive) state.outcome = t.outcome
    } else if (t.kind === 'allDestroyed' && state.objects[t.target]) {
      const all = state.objects[t.target]
      const anyAlive = all.some((o) => o.alive)
      if (!anyAlive) state.outcome = t.outcome
    } else if (t.kind === 'timeout') {
      if (state.tick + 1 >= spec.time.stepsPerProof) state.outcome = t.outcome
    }
  }

  state.tick++
  // Default scoring: ticks survived
  if (!state.outcome) state.score = state.tick
  return state
}

function applyBoundary(inst, axis, mode, extent, kind, state) {
  const p = axis === 'x' ? inst.px : inst.py
  switch (mode) {
    case 'wrap':
      if (p >= extent) inst[axis === 'x' ? 'px' : 'py'] = p - extent
      else if (p < 0n) inst[axis === 'x' ? 'px' : 'py'] = p + extent
      break
    case 'clamp':
      if (p >= extent) {
        inst[axis === 'x' ? 'px' : 'py'] = extent
        inst[axis === 'x' ? 'vx' : 'vy'] = 0n
      } else if (p < 0n) {
        inst[axis === 'x' ? 'px' : 'py'] = 0n
        inst[axis === 'x' ? 'vx' : 'vy'] = 0n
      }
      break
    case 'destroy':
      if (p >= extent || p < 0n) inst.alive = false
      break
    case 'bounce':
      if (p >= extent) {
        inst[axis === 'x' ? 'px' : 'py'] = extent
        if (axis === 'x') inst.vx = -inst.vx
        else inst.vy = -inst.vy
      } else if (p < 0n) {
        inst[axis === 'x' ? 'px' : 'py'] = 0n
        if (axis === 'x') inst.vx = -inst.vx
        else inst.vy = -inst.vy
      }
      break
    case 'none':
      break
  }
}

function collides(a, b, _bKind) {
  const dx = a.px - b.px
  const dy = a.py - b.py
  const r = a.r + b.r
  return dx * dx + dy * dy < r * r
}

function applyCollisionResponse(state, a, b, c) {
  switch (c.response) {
    case 'gameOver':
      state.outcome = 'lose'
      break
    case 'destroy-a':
      a.alive = false
      break
    case 'destroy-b':
      b.alive = false
      break
    case 'destroy-both':
      a.alive = false
      b.alive = false
      break
    case 'block':
      // Crude push-back: separate along the axis with greatest overlap.
      // Good enough for tile-grid platforms; not for arbitrary shapes.
      separate(a, b)
      // Zero out the velocity component pointing into the surface
      if (Math.abs(Number(a.px - b.px)) > Math.abs(Number(a.py - b.py))) {
        a.vx = 0n
      } else {
        a.vy = 0n
      }
      break
    case 'block-from-above':
      // Only blocks if `a` is moving downward and is above `b`.
      // (Y-down screen coords: 'above' means smaller y.)
      if (a.vy > 0n && a.py < b.py) {
        a.py = b.py - a.r - b.r
        a.vy = 0n
      }
      break
    case 'pass-through':
    default:
      break
  }
}

function separate(a, b) {
  const dx = a.px - b.px
  const dy = a.py - b.py
  const ax = dx < 0n ? -dx : dx
  const ay = dy < 0n ? -dy : dy
  const r = a.r + b.r
  if (ax > ay) {
    a.px += dx > 0n ? r - ax : -(r - ax)
  } else {
    a.py += dy > 0n ? r - ay : -(r - ay)
  }
}
