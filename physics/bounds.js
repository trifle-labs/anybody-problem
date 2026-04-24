// Exact symbolic bounds derivation for the physics library.
//
// Given a PhysicsConfig, this module computes the maximum magnitude of every
// intermediate value in the engine, and the corresponding minimum bit width
// required to represent it unsigned.
//
// Why symbolic and not Monte Carlo? Because every value is a closed-form
// expression over the config constants plus (sometimes) N and dt. Pair
// distances are bounded by the window diagonal. Force magnitude is bounded by
// G·mass/minDistance². Accumulated force is bounded by per-pair force times
// (N−1). Etc. You don't need to sample — you just evaluate the algebra.
//
// Every bound here matches the hand-computed values in the `// maxBits: ...`
// comments throughout circuits/*.circom. The test suite verifies that match.

import { validateConfig } from './config.js'

/** Bits required to represent `max` (a non-negative integer) unsigned. */
export function maxBits(max) {
  if (max < 0n && typeof max === 'bigint') throw new Error('negative')
  if (typeof max === 'number' && max < 0) throw new Error('negative')
  let n = typeof max === 'bigint' ? max : BigInt(Math.ceil(max))
  let i = 0
  while (n > 0n) {
    i++
    n >>= 1n
  }
  return i === 0 ? 1 : i // one bit for 0 as well
}

/** Build a Bound: an object with {max, bits}. */
function b(max) {
  const m = typeof max === 'bigint' ? max : BigInt(Math.ceil(max))
  return Object.freeze({ max: m, bits: maxBits(m) })
}

/**
 * Derive all bounds from a config. Every field is {max: bigint, bits: number}.
 *
 * Naming convention: `fooScaled` means value after fixed-point scaling (as
 * stored on circuit signals). `foo` without Scaled means the pre-scale number.
 *
 * @param {import('./config.js').PhysicsConfig} cfg
 */
export function deriveBounds(cfg) {
  validateConfig(cfg)

  const SF = BigInt(cfg.scalingFactor)
  const W = BigInt(cfg.windowWidth)
  const G = BigInt(cfg.gravity)
  const maxSpeed = BigInt(cfg.maxSpeed)
  const maxR = BigInt(cfg.maxRadius)
  const minDist = BigInt(cfg.minDistance)
  const dt = BigInt(cfg.dt)
  const N = BigInt(cfg.maxBodies)

  // --- Primary scaled quantities ---
  const WScaled = W * SF // world extent, scaled
  const positionScaled = WScaled
  const maxRadiusScaled = maxR * SF
  const GScaled = G * SF
  const minDistanceScaled = minDist * SF // linear, not squared
  const minDistanceSquaredScaled = minDist * minDist * SF * SF
  const maxSpeedScaled = maxSpeed * SF
  const maxVectorScaled = maxSpeed * dt * SF // velocity includes dt multiplier

  // --- Position deltas and distance ---
  // dx, dy absolute values: bounded by the world extent
  const dAbs = WScaled
  // dx², dy²: square of that
  const dSquared = dAbs * dAbs
  // distanceSquared = dx² + dy² -> up to 2·(W·SF)²
  const distanceSquared = 2n * dSquared
  // distance = sqrt(distanceSquared) -> up to √2·W·SF (we take ceil via int)
  // For bit counting purposes, ceil(sqrt(distanceSquared)) is enough.
  const distance = isqrt(distanceSquared) + 1n
  // scaled per-body distance after minDistance clamp: same upper bound
  const distanceSquaredClamped = distanceSquared

  // --- Mass / collision ---
  // massSum = (r1 + r2) · 4 — the "liveliness" multiplier in calculateForce.
  // We preserve that so the bound matches the existing circuit.
  const massSum = 2n * maxRadiusScaled * 4n

  // --- Force magnitude (per pair) ---
  // Circuit form: forceNum = GScaled · massSum · SF
  //               forceDenom = 2 · distSq · distance
  //               forceX = (dxAbs · forceNum) / forceDenom
  // Numerator upper bound: dxAbs · GScaled · massSum · SF
  const forceMagNumerator = GScaled * massSum * SF
  const forceDenom = 2n * distanceSquared * distance // worst case (no minDist clamp at top)
  const forceXNumerator = dAbs * forceMagNumerator
  // The actual quotient is bounded by forceXNumerator / minForceDenom, where
  // minForceDenom uses the minDistance clamp. The output (force) is smaller
  // than its numerator — but for the purposes of the R1CS Div template,
  // the quotient bit width needs to accommodate the worst quotient.
  //
  // Upper bound on quotient: swap in the minDistance clamp:
  //   forceDenomMin = 2 · minDistSqScaled · minDistScaled
  //                 = 2 · (minDist·SF)² · (minDist·SF)
  //                 = 2 · minDist³ · SF³
  // forceMax = (dAbs · GScaled · massSum · SF) / forceDenomMin
  const forceDenomMin = 2n * minDistanceSquaredScaled * (minDist * SF)
  const forcePerPairOutput = forceDenomMin === 0n
    ? 0n
    : (forceXNumerator + forceDenomMin - 1n) / forceDenomMin
  // The circuit carries forceXNumerator through multiplication before dividing,
  // so we also expose its width separately.

  // --- Accumulated force per tick ---
  // Each body receives forces from up to (N−1) others. Each is signed,
  // represented as (signBit, magnitude). Accumulation offsets by a constant
  // "maximum_accumulated_possible" to keep values non-negative.
  const accumulatedForceUnsigned = forcePerPairOutput * (N - 1n)

  // --- Velocity / position updates ---
  // velocity += forceAccumulated · dt  (then clamped)
  // If velocityLimiter invariant holds: velocity stays in [-maxVScaled, +maxVScaled]
  // stored offset by maxVectorScaled -> [0, 2·maxVectorScaled]
  const velocityStored = 2n * maxVectorScaled

  // If no limiter, velocity grows by accumulatedForce·dt per step. We expose
  // both bounds and let the caller pick based on their invariants.
  const velocityNoLimiterPerStep = accumulatedForceUnsigned * dt

  // position += velocity  (then wrapped if positionWrap invariant holds)
  // With wrap: position stays in [0, WScaled].
  // Without wrap: grows by velocity per tick.
  const positionNoWrapPerStep = velocityStored

  // --- Projectile (optional) ---
  let missile = null
  if (cfg.maxMissileSpeed) {
    const mSpd = BigInt(cfg.maxMissileSpeed)
    const maxMissileVectorScaled = mSpd * dt * SF
    // Missile magnitude constraint: √2 · maxMissileVectorScaled (rounded up)
    const missileMagnitude = isqrt(2n * maxMissileVectorScaled * maxMissileVectorScaled) + 1n
    missile = {
      velocityScaled: b(maxMissileVectorScaled),
      magnitudeLimit: b(missileMagnitude),
    }
  }

  return {
    config: cfg,
    constants: {
      SF: b(SF),
      windowWidthScaled: b(WScaled),
      maxRadiusScaled: b(maxRadiusScaled),
      GScaled: b(GScaled),
      minDistanceScaled: b(minDistanceScaled),
      minDistanceSquaredScaled: b(minDistanceSquaredScaled),
      maxSpeedScaled: b(maxSpeedScaled),
      maxVectorScaled: b(maxVectorScaled),
    },
    position: {
      scaled: b(positionScaled),
      deltaAbs: b(dAbs),
      deltaSquared: b(dSquared),
      distanceSquared: b(distanceSquared),
      distanceSquaredClamped: b(distanceSquaredClamped),
      distance: b(distance),
    },
    mass: {
      radiusScaled: b(maxRadiusScaled),
      massSum: b(massSum),
    },
    force: {
      magNumerator: b(forceMagNumerator),
      denominator: b(forceDenom),
      componentNumerator: b(forceXNumerator),
      perPairOutput: b(forcePerPairOutput),
      accumulatedPerStep: b(accumulatedForceUnsigned),
    },
    velocity: {
      storedWithOffset: b(velocityStored),
      unlimitedPerStep: b(velocityNoLimiterPerStep),
    },
    positionUpdate: {
      unwrappedPerStep: b(positionNoWrapPerStep),
    },
    missile,
  }
}

/** Integer sqrt (floor) for bigint. Used only for bound computation. */
function isqrt(n) {
  if (n < 0n) throw new Error('isqrt: negative')
  if (n < 2n) return n
  // Newton iteration
  let x = n
  let y = (x + 1n) >> 1n
  while (y < x) {
    x = y
    y = (x + n / x) >> 1n
  }
  return x
}
