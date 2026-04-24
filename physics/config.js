// Physics library config schema.
//
// A physics config describes *what the world is*, not *how the circuit is
// sized*. Bit widths are derived from these fields by `bounds.js`.
//
// All fields are plain numbers (pre-scaling). The library multiplies by
// `scalingFactor` internally to get the on-signal representation.

/**
 * @typedef {Object} Invariants
 * @property {boolean} velocityLimiter  If true, every tick clamps velocity to
 *   ±maxSpeed·SF. Bounds derivation assumes this to keep velocity bit width
 *   constant across ticks. If false, velocity bounds grow with step count.
 * @property {boolean} positionWrap     If true, position is wrapped to
 *   [0, W·SF) each tick. If false, position can grow unboundedly.
 * @property {boolean} minDistanceClamp If true, distanceSquared is clamped to
 *   at least `minDistance²·SF²` before force division. Required for gravity
 *   to have a finite upper bound (1/r² singularity).
 */

/**
 * @typedef {Object} PhysicsConfig
 * @property {number} scalingFactor  Fixed-point scale, e.g. 1000 for 3dp.
 * @property {number} windowWidth    World extent (square, W × W).
 * @property {number} maxSpeed       Max velocity magnitude, per axis, pre-scale.
 * @property {number} maxRadius      Max body radius / mass, pre-scale.
 * @property {number} gravity        Gravitational constant G, pre-scale.
 * @property {number} minDistance    Distance floor below which force clamps.
 * @property {number} dt             Integration time step (velocity multiplier).
 * @property {number} maxBodies      N, max number of bodies.
 * @property {number} [maxMissileSpeed]  Optional projectile speed cap.
 * @property {Invariants} invariants
 */

/** Defaults matching circuits/*.circom in this repo. */
export const ANYBODY_DEFAULTS = Object.freeze({
  scalingFactor: 1000,
  windowWidth: 1000,
  maxSpeed: 10,
  maxRadius: 13,
  gravity: 100,
  minDistance: 200,
  dt: 2,
  maxBodies: 6,
  maxMissileSpeed: 15,
  invariants: Object.freeze({
    velocityLimiter: true,
    positionWrap: true,
    minDistanceClamp: true,
  }),
})

/** Validate a config object; throw with a clear message on failure. */
export function validateConfig(cfg) {
  const required = [
    'scalingFactor',
    'windowWidth',
    'maxSpeed',
    'maxRadius',
    'gravity',
    'minDistance',
    'dt',
    'maxBodies',
  ]
  for (const k of required) {
    if (typeof cfg[k] !== 'number' || !Number.isFinite(cfg[k]) || cfg[k] < 0) {
      throw new Error(`physics config: ${k} must be a non-negative finite number`)
    }
  }
  if (!Number.isInteger(cfg.scalingFactor) || cfg.scalingFactor < 1) {
    throw new Error('physics config: scalingFactor must be a positive integer')
  }
  if (cfg.maxBodies < 2) {
    throw new Error('physics config: maxBodies must be at least 2')
  }
  if (cfg.minDistance <= 0) {
    throw new Error(
      'physics config: minDistance must be > 0 (required for gravity bound)'
    )
  }
  if (!cfg.invariants || typeof cfg.invariants !== 'object') {
    throw new Error('physics config: invariants object is required')
  }
  if (!cfg.invariants.velocityLimiter) {
    // Not a hard error — the library supports it — but velocity bit widths
    // then depend on step count and the user needs to pass `steps` in too.
    // We surface this as a hint in deriveBounds.
  }
  return cfg
}
