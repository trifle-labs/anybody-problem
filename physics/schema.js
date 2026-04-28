// Schema definition + validation for a generalized 2D physics game spec.
//
// A game spec is the *single source of truth* for everything downstream:
// bit-width derivation, constraint count estimation, circuit code-gen, and
// JS simulation. The schema is intentionally explicit — every dimension that
// has a circuit-size cost shows up as a config field.
//
// Use `defineGame(spec)` to validate + normalize. See QUESTIONNAIRE.md for
// the question-by-question walkthrough that produces a spec.

/**
 * @typedef {'none' | 'wrap' | 'clamp' | 'destroy' | 'bounce'} BoundaryMode
 *
 * - none:    no enforcement; positions can grow unboundedly. Bit widths grow
 *            with step count. Almost never what you want.
 * - wrap:    Pac-Man / Asteroids / anybody-problem. Cheapest after `none`.
 * - clamp:   walls block movement (Pong, platformer side walls). Cheap.
 * - destroy: position out-of-bounds → object removed (radius=0). Cheap.
 * - bounce:  reflect velocity at the boundary (Pong). Medium cost.
 */

/**
 * @typedef {Object} World
 * @property {1 | 2 | 3} dimensions
 * @property {{x: number, y?: number, z?: number}} extent
 *   World extent per axis (pre-scale). Position is bounded to [0, extent].
 * @property {{x: BoundaryMode, y?: BoundaryMode, z?: BoundaryMode}} boundary
 *   Per-axis boundary mode.
 * @property {'screen' | 'math'} coordinates
 *   'screen' = y-axis points down (canvas, top-left origin).
 *   'math'   = y-axis points up.
 */

/**
 * @typedef {Object} Time
 * @property {number} fps             Physics ticks per second of real time.
 * @property {number} stepsPerProof   Ticks covered by one generated proof.
 *                                    This directly multiplies circuit size.
 * @property {number} [dt]            Integration multiplier (default 1).
 */

/**
 * @typedef {Object} Precision
 * @property {number} scalingFactor       Fixed-point scale, e.g. 1000.
 * @property {number} constraintBudget    Hard cap, e.g. 1_000_000.
 * @property {number} [fileSizeBudgetMB]  Soft cap on R1CS+wasm size.
 */

/**
 * @typedef {Object} ConstantGravity
 * @property {'gravity-constant'} kind
 * @property {number[]} vec        Acceleration vector (pre-scale).
 *                                 e.g. [0, 800] for 800 units/s² downward.
 * @property {string[]} appliesTo  Object-kind names this force affects.
 */

/**
 * @typedef {Object} PairwiseGravity
 * @property {'gravity-pairwise'} kind
 * @property {number} G            Gravitational constant.
 * @property {number} minDistance  Distance floor (singularity guard).
 * @property {string[]} appliesTo  Object-kind names this force affects
 *                                 (must be ≥ 2 dynamic kinds).
 */

/**
 * @typedef {Object} LinearDrag
 * @property {'drag-linear'} kind
 * @property {number} coeff        Per-tick fraction velocity loses.
 * @property {string[]} appliesTo
 */

/**
 * @typedef {ConstantGravity | PairwiseGravity | LinearDrag} Force
 */

/**
 * @typedef {Object} DiscreteInput
 * @property {string} name                 e.g. 'jump'
 * @property {'discrete'} kind             One bit per tick (button down).
 * @property {Object} [impulse]            Apply once on press: { vx?, vy? }
 * @property {Object} [setVelocity]        Replace velocity component while held
 * @property {number} [cooldownTicks]      Optional rate limit
 */

/**
 * @typedef {Object} ContinuousInput
 * @property {string} name
 * @property {'continuous'} kind
 * @property {number} max                  Per-axis magnitude limit
 */

/**
 * @typedef {DiscreteInput | ContinuousInput} Input
 */

/**
 * @typedef {Object} ObjectKind
 * @property {'static' | 'kinematic' | 'dynamic'} kind
 *   - static:    never moves (walls, ground). Zero per-step cost.
 *   - kinematic: scripted velocity, ignores forces (scrolling obstacles).
 *   - dynamic:   full integration with forces.
 * @property {number} maxCount        How many of this kind exist.
 * @property {number} [maxSpeed]      Per-axis cap (required for dynamic).
 * @property {number} maxRadius       Visual + collision radius.
 * @property {number} [mass]          Used by pairwise forces.
 * @property {number[]} [velocity]    For kinematic: fixed scrolling velocity.
 * @property {Object} [shape]         For static: `{kind:'plane', y: ...}` or
 *                                    `{kind:'box', ...}`. Optional for others.
 * @property {Input[]} [inputs]       For dynamic player-controlled kinds.
 * @property {Object} [respawn]       For kinematic endless content:
 *                                    {side: 'right', interval: <ticks>}.
 */

/**
 * @typedef {'pass-through' | 'block' | 'block-from-above' | 'bounce' | 'destroy-a' | 'destroy-b' | 'destroy-both' | 'gameOver'} CollisionResponse
 */

/**
 * @typedef {Object} CollisionRule
 * @property {string} a                    Object kind A
 * @property {string} b                    Object kind B
 * @property {'circle' | 'aabb'} [shape]   Detection shape (default circle)
 * @property {CollisionResponse} response
 */

/**
 * @typedef {Object} TerminationRule
 * @property {'destroyed' | 'allDestroyed' | 'timeout' | 'reachedGoal'} kind
 * @property {string} [target]             Object kind to track
 * @property {Object} [goal]               For reachedGoal: e.g. {x: 1000}
 * @property {'win' | 'lose'} [outcome]    Defaults to 'lose'.
 */

/**
 * @typedef {Object} GameSpec
 * @property {string} name
 * @property {World} world
 * @property {Time} time
 * @property {Precision} precision
 * @property {Force[]} forces
 * @property {Record<string, ObjectKind>} objects
 * @property {CollisionRule[]} [collisions]
 * @property {TerminationRule[]} [termination]
 * @property {Object} [randomness]
 */

const VALID_BOUNDARIES = new Set(['none', 'wrap', 'clamp', 'destroy', 'bounce'])
const VALID_KINDS = new Set(['static', 'kinematic', 'dynamic'])
const VALID_FORCE_KINDS = new Set([
  'gravity-constant',
  'gravity-pairwise',
  'drag-linear',
])

/**
 * Validate a GameSpec and return a normalized copy. Throws on any invalid or
 * incomplete field. The normalization fills defaults (dt=1, dimensions=2, etc.)
 * and freezes the result.
 */
export function defineGame(spec) {
  if (!spec || typeof spec !== 'object') throw err('spec must be an object')
  const out = { name: spec.name ?? 'unnamed' }

  // --- world ---
  if (!spec.world) throw err('world is required')
  const w = spec.world
  const dims = w.dimensions ?? 2
  if (![1, 2, 3].includes(dims)) throw err('world.dimensions must be 1/2/3')
  if (!w.extent || typeof w.extent.x !== 'number') {
    throw err('world.extent.x is required')
  }
  if (dims >= 2 && typeof w.extent.y !== 'number') {
    throw err('world.extent.y is required for 2D+')
  }
  if (dims === 3 && typeof w.extent.z !== 'number') {
    throw err('world.extent.z is required for 3D')
  }
  if (!w.boundary || !VALID_BOUNDARIES.has(w.boundary.x)) {
    throw err(`world.boundary.x must be one of ${[...VALID_BOUNDARIES]}`)
  }
  if (dims >= 2 && !VALID_BOUNDARIES.has(w.boundary.y)) {
    throw err(`world.boundary.y must be one of ${[...VALID_BOUNDARIES]}`)
  }
  out.world = {
    dimensions: dims,
    extent: { ...w.extent },
    boundary: { ...w.boundary },
    coordinates: w.coordinates ?? 'screen',
  }

  // --- time ---
  const t = spec.time ?? {}
  if (!Number.isFinite(t.fps) || t.fps <= 0) throw err('time.fps required > 0')
  if (!Number.isInteger(t.stepsPerProof) || t.stepsPerProof < 1) {
    throw err('time.stepsPerProof must be a positive integer')
  }
  out.time = { fps: t.fps, stepsPerProof: t.stepsPerProof, dt: t.dt ?? 1 }

  // --- precision ---
  const p = spec.precision ?? {}
  if (!Number.isInteger(p.scalingFactor) || p.scalingFactor < 1) {
    throw err('precision.scalingFactor must be a positive integer')
  }
  out.precision = {
    scalingFactor: p.scalingFactor,
    constraintBudget: p.constraintBudget ?? 1_000_000,
    fileSizeBudgetMB: p.fileSizeBudgetMB ?? 1024,
  }

  // --- forces ---
  if (!Array.isArray(spec.forces)) throw err('forces must be an array (may be empty)')
  out.forces = spec.forces.map((f, i) => validateForce(f, i))

  // --- objects ---
  if (!spec.objects || typeof spec.objects !== 'object') {
    throw err('objects must be an object map')
  }
  const objNames = Object.keys(spec.objects)
  if (objNames.length === 0) throw err('at least one object kind required')
  out.objects = {}
  for (const [name, obj] of Object.entries(spec.objects)) {
    out.objects[name] = validateObject(name, obj, dims)
  }

  // Cross-check: forces.appliesTo must reference declared object kinds, and
  // pairwise gravity needs at least 2 dynamic instances total.
  for (const f of out.forces) {
    let totalAffected = 0
    for (const target of f.appliesTo) {
      if (!out.objects[target]) {
        throw err(`force ${f.kind}: appliesTo '${target}' is not a declared object kind`)
      }
      totalAffected += out.objects[target].maxCount
    }
    if (f.kind === 'gravity-pairwise' && totalAffected < 2) {
      throw err(
        `force gravity-pairwise: needs ≥ 2 affected instances total (got ${totalAffected})`
      )
    }
  }

  // --- collisions ---
  out.collisions = (spec.collisions ?? []).map((c, i) => {
    if (!out.objects[c.a]) throw err(`collisions[${i}].a '${c.a}' is not declared`)
    if (!out.objects[c.b]) throw err(`collisions[${i}].b '${c.b}' is not declared`)
    return {
      a: c.a,
      b: c.b,
      shape: c.shape ?? 'circle',
      response: c.response,
    }
  })

  // --- termination ---
  out.termination = (spec.termination ?? []).map((r) => ({
    kind: r.kind,
    target: r.target,
    goal: r.goal,
    outcome: r.outcome ?? 'lose',
  }))

  // --- randomness ---
  out.randomness = spec.randomness ?? { kind: 'none' }

  return Object.freeze(out)
}

function validateForce(f, i) {
  if (!f || typeof f !== 'object') throw err(`forces[${i}] must be an object`)
  if (!VALID_FORCE_KINDS.has(f.kind)) {
    throw err(`forces[${i}].kind must be one of ${[...VALID_FORCE_KINDS]}`)
  }
  if (!Array.isArray(f.appliesTo) || f.appliesTo.length === 0) {
    throw err(`forces[${i}].appliesTo must be a non-empty array`)
  }
  switch (f.kind) {
    case 'gravity-constant':
      if (!Array.isArray(f.vec)) throw err(`forces[${i}].vec must be a vector`)
      return { kind: f.kind, vec: [...f.vec], appliesTo: [...f.appliesTo] }
    case 'gravity-pairwise':
      if (!Number.isFinite(f.G) || f.G <= 0) throw err(`forces[${i}].G > 0`)
      if (!Number.isFinite(f.minDistance) || f.minDistance <= 0) {
        throw err(`forces[${i}].minDistance > 0`)
      }
      // Total-instance-count check happens after object validation.
      return {
        kind: f.kind,
        G: f.G,
        minDistance: f.minDistance,
        appliesTo: [...f.appliesTo],
      }
    case 'drag-linear':
      if (!Number.isFinite(f.coeff) || f.coeff < 0 || f.coeff > 1) {
        throw err(`forces[${i}].coeff must be in [0, 1]`)
      }
      return { kind: f.kind, coeff: f.coeff, appliesTo: [...f.appliesTo] }
  }
  throw err(`unreachable: ${f.kind}`)
}

function validateObject(name, o, dims) {
  if (!VALID_KINDS.has(o.kind)) {
    throw err(`object '${name}': kind must be one of ${[...VALID_KINDS]}`)
  }
  if (!Number.isInteger(o.maxCount) || o.maxCount < 1) {
    throw err(`object '${name}': maxCount must be a positive integer`)
  }
  if (!Number.isFinite(o.maxRadius) || o.maxRadius < 0) {
    throw err(`object '${name}': maxRadius required ≥ 0`)
  }
  if (o.kind === 'dynamic') {
    if (!Number.isFinite(o.maxSpeed) || o.maxSpeed < 0) {
      throw err(`object '${name}': maxSpeed required for dynamic kinds`)
    }
  }
  if (o.kind === 'kinematic') {
    if (!Array.isArray(o.velocity) || o.velocity.length < dims) {
      throw err(
        `object '${name}': kinematic kinds need a velocity vector of length ${dims}`
      )
    }
  }
  return Object.freeze({
    kind: o.kind,
    maxCount: o.maxCount,
    maxSpeed: o.maxSpeed ?? 0,
    maxRadius: o.maxRadius,
    mass: o.mass ?? 1,
    velocity: o.velocity ? [...o.velocity] : null,
    shape: o.shape ?? null,
    inputs: o.inputs ? [...o.inputs] : [],
    respawn: o.respawn ?? null,
  })
}

function err(msg) {
  return new Error(`physics config: ${msg}`)
}
