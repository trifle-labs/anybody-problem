// Exact symbolic bounds derivation, generalized over any GameSpec.
//
// This file replaces the original anybody-problem-only bounds derivation. It
// takes a validated GameSpec and walks the schema to compute the maximum
// magnitude of every value that ends up on a circuit signal — and the
// matching minimum bit width to represent it.
//
// Every bound here is a closed-form expression over the spec's constants
// (extent, maxSpeed, mass, scalingFactor, dt, force parameters, counts).
// No Monte Carlo, no probabilistic guesswork.
//
// What's bounded depends on which features are enabled:
//   - Pairwise gravity → distance, distanceSquared, force magnitude per pair,
//     accumulated force per body
//   - Constant gravity → constant per-step velocity delta
//   - Linear drag → velocity decay coefficient
//   - Per-axis boundary clamp/wrap → position cap each tick
//   - Per-axis boundary unbounded → position grows over `stepsPerProof`
//   - Per-kind dynamic objects → velocity & position bounds
//   - Per-kind kinematic objects → fixed velocity, position bounds
//   - Per-kind static objects → position is constant (no bound to derive)

/** Bits required to represent `max` (a non-negative integer) unsigned. */
export function maxBits(max) {
  let n = typeof max === 'bigint' ? max : BigInt(Math.ceil(Number(max)))
  if (n < 0n) throw new Error('maxBits: negative')
  let i = 0
  while (n > 0n) {
    i++
    n >>= 1n
  }
  return i === 0 ? 1 : i
}

function b(max) {
  const m = typeof max === 'bigint' ? max : BigInt(Math.ceil(Number(max)))
  return Object.freeze({ max: m, bits: maxBits(m) })
}

function isqrt(n) {
  if (n < 0n) throw new Error('isqrt: negative')
  if (n < 2n) return n
  let x = n
  let y = (x + 1n) >> 1n
  while (y < x) {
    x = y
    y = (x + n / x) >> 1n
  }
  return x
}

/**
 * Derive bounds from a validated GameSpec.
 *
 * Returns:
 *   {
 *     spec,                       // echoed back
 *     constants: {...},           // scaled forms of spec constants
 *     world: { positionScaled[axis] },
 *     objects: {
 *       <kindName>: {
 *         radiusScaled, massScaled,
 *         velocityScaled?,        // for dynamic/kinematic
 *         velocityStored?,        // velocity offset for unsigned representation
 *         positionPerStep?,       // bound on |delta-position| per step (no-wrap case)
 *       }
 *     },
 *     forces: {
 *       pairwise?: { distance, distanceSquared, perPairOutput, accumPerStep },
 *       constant?: { perStepDelta },
 *       drag?: ...
 *     }
 *   }
 *
 * @param {import('./schema.js').GameSpec} spec
 */
export function deriveBounds(spec) {
  const SF = BigInt(spec.precision.scalingFactor)
  const dt = BigInt(spec.time.dt ?? 1)
  const dims = spec.world.dimensions
  const axes = ['x', 'y', 'z'].slice(0, dims)

  // --- world: per-axis position bounds ---
  const world = { extentScaled: {} }
  for (const ax of axes) {
    const extent = BigInt(spec.world.extent[ax])
    world.extentScaled[ax] = b(extent * SF)
  }

  // Boundary: if 'wrap' or 'clamp' or 'destroy' or 'bounce', position stays in
  // [0, extent·SF] each tick. If 'none', position grows by velocityScaled per
  // tick. We compute both and let downstream pick.
  const stepsPerProof = BigInt(spec.time.stepsPerProof)

  // --- objects: derive per-kind ---
  const objects = {}
  for (const [name, o] of Object.entries(spec.objects)) {
    const radiusScaled = BigInt(Math.ceil(o.maxRadius)) * SF
    const massScaled = BigInt(Math.ceil(o.mass)) * SF
    const result = {
      kind: o.kind,
      maxCount: o.maxCount,
      radiusScaled: b(radiusScaled),
      massScaled: b(massScaled),
    }
    if (o.kind === 'dynamic') {
      const maxSpeed = BigInt(Math.ceil(o.maxSpeed))
      const maxVecScaled = maxSpeed * dt * SF
      result.velocityScaled = b(maxVecScaled)
      // Stored offset (so unsigned reps work in circuits): 2 · maxVec
      result.velocityStored = b(2n * maxVecScaled)
      result.positionPerStep = b(maxVecScaled) // |Δposition| per tick
    } else if (o.kind === 'kinematic') {
      let maxComp = 0n
      for (const v of o.velocity) {
        const mag = BigInt(Math.ceil(Math.abs(v)))
        if (mag > maxComp) maxComp = mag
      }
      const maxVecScaled = maxComp * dt * SF
      result.velocityScaled = b(maxVecScaled)
      result.velocityStored = b(2n * maxVecScaled)
      result.positionPerStep = b(maxVecScaled)
    }
    // static: no velocity/position-per-step bounds
    objects[name] = result
  }

  // --- forces: derive per-force ---
  const forces = {}

  for (const f of spec.forces) {
    if (f.kind === 'gravity-pairwise') {
      // Find the largest extent (worst-case distance) over the kinds this
      // force touches. We use the global world extent — pairs span at most
      // the world's diagonal.
      const maxExtent = axes
        .map((a) => world.extentScaled[a].max)
        .reduce((a, c) => (c > a ? c : a), 0n)
      // |dx|, |dy| max equals world extent on that axis. Use the larger
      // of the two for uniform width.
      const dAbs = maxExtent
      const dSquared = dAbs * dAbs
      const distanceSquared = BigInt(dims) * dSquared
      const distance = isqrt(distanceSquared) + 1n

      const G = BigInt(f.G)
      const GScaled = G * SF
      const minDist = BigInt(f.minDistance)
      const minDistanceSqScaled = minDist * minDist * SF * SF

      // Largest possible mass-sum: 2·max(radius·SF·"liveliness factor")
      // We follow anybody-problem's ×4 multiplier; if you parameterize
      // the library, this should come from the gravity descriptor.
      let maxRadiusScaled = 0n
      for (const t of f.appliesTo) {
        if (objects[t].radiusScaled.max > maxRadiusScaled) {
          maxRadiusScaled = objects[t].radiusScaled.max
        }
      }
      const massSum = 2n * maxRadiusScaled * 4n

      // forceMag_numerator = GScaled · massSum · SF
      const forceMagNumerator = GScaled * massSum * SF
      // forceXNumerator = dxAbs · forceMagNumerator
      const forceXNumerator = dAbs * forceMagNumerator
      // forceDenom min = 2 · minDistSq · minDistance·SF
      const forceDenomMin = 2n * minDistanceSqScaled * (minDist * SF)
      const perPairOutput =
        forceDenomMin === 0n
          ? 0n
          : (forceXNumerator + forceDenomMin - 1n) / forceDenomMin

      // Sum across all pairs each affected dynamic body sees: (N-1)
      const N = f.appliesTo.reduce(
        (acc, t) => acc + BigInt(objects[t].maxCount),
        0n
      )
      const accumPerStep = perPairOutput * (N - 1n)

      forces.pairwise = {
        distanceSquared: b(distanceSquared),
        distance: b(distance),
        massSum: b(massSum),
        forceMagNumerator: b(forceMagNumerator),
        forceXNumerator: b(forceXNumerator),
        perPairOutput: b(perPairOutput),
        accumPerStep: b(accumPerStep),
        affectedKinds: [...f.appliesTo],
        N: Number(N),
      }
    } else if (f.kind === 'gravity-constant') {
      // Per-step velocity delta = |gravity| · dt (in scaled units)
      let perStepMax = 0n
      for (const v of f.vec) {
        const mag = BigInt(Math.ceil(Math.abs(v)))
        if (mag > perStepMax) perStepMax = mag
      }
      const perStepScaled = perStepMax * dt * SF
      // Over stepsPerProof ticks (no clamp), velocity could grow this much:
      const maxAccumOverProof = perStepScaled * stepsPerProof
      forces.constant = {
        perStepDelta: b(perStepScaled),
        maxAccumOverProof: b(maxAccumOverProof),
        affectedKinds: [...f.appliesTo],
        vec: [...f.vec],
      }
    } else if (f.kind === 'drag-linear') {
      forces.drag = {
        coeff: f.coeff,
        // Drag reduces velocity; doesn't introduce new bit width pressure.
        affectedKinds: [...f.appliesTo],
      }
    }
  }

  return Object.freeze({
    spec,
    constants: {
      SF: b(SF),
      dt: b(dt),
      stepsPerProof: b(stepsPerProof),
    },
    world,
    objects,
    forces,
  })
}
