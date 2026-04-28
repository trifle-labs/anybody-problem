// Constraint count estimator.
//
// Given a validated GameSpec (and the bounds it produces), estimate the
// total R1CS constraint count. Numbers are rough — within ~25% of a real
// circom compile based on counts observed in this repo and circomlib —
// but useful enough to flag "you'll bust the 1M budget" before the user
// burns 10 minutes compiling.
//
// To improve: as you actually compile circuits and see real numbers, plug
// them into the COSTS table. The shape stays the same.
//
// Source of estimates:
//   - LessThan(n) ≈ n+1 constraints (n bits + 1 alias check)
//   - Num2Bits(n) ≈ n constraints
//   - Mux1 ≈ 1 constraint
//   - IsZero ≈ 3 constraints
//   - Sqrt(maxBits) ≈ 2·maxBits (binary-search constrain + 1 LessEqThan)
//   - Div ≈ 64 + 1 LessEqThan ≈ 130 constraints
//   - AbsoluteValueSubtraction(n) ≈ n + 5
//   - Multiplication ≈ 1
//   - Addition (linear combination) ≈ 0
//   - Boundary clamp (LessThan + Mux per axis) ≈ ~30 per axis
//   - Boundary wrap (similar) ≈ ~30 per axis
//   - Linear-combo limiter (anybody-problem velocity limiter) ≈ ~50 per axis
//
// Note: these are *circuit* costs. JS witness time is essentially free in
// comparison and is bench-marked separately.

import { maxBits } from './bounds.js'

const COSTS = {
  lessThan: (bits) => bits + 1,
  num2Bits: (bits) => bits,
  isZero: 3,
  mux1: 1,
  multiply: 1,
  sqrt: (bits) => bits * 2 + 22, // root constraints + margin-of-error check
  div: 130,
  absSub: (bits) => bits + 5,
  limiter: (bits) => bits + 8,
  positionWrap: (bits) => bits + 30, // LessThan + Mux1 + isZero
  positionClamp: (bits) => bits + 25,
  positionDestroy: (bits) => bits + 15,
  positionBounce: (bits) => bits + 50, // reflect + clamp
  inputDiscrete: 5, // bit unpack + impulse mux
  inputContinuous: (bits) => bits + 10,
  collisionCircle: (distBits) => distBits + 30, // GetDistance + LessThan + mux
  collisionAabb: (posBits) => posBits * 4 + 20, // 4 LessThans + AND
}

/**
 * Estimate constraints for a single integration step over the whole spec.
 * Multiply by stepsPerProof for the total.
 */
function estimateStepConstraints(bounds) {
  const spec = bounds.spec
  const dims = spec.world.dimensions
  const axes = ['x', 'y', 'z'].slice(0, dims)
  let total = 0
  const breakdown = {}

  // --- forces ---

  if (bounds.forces.pairwise) {
    const f = bounds.forces.pairwise
    const N = f.N
    const pairs = (N * (N - 1)) / 2

    // Per-pair force computation (CalculateForce equivalent)
    let perPair = 0
    perPair += dims * COSTS.absSub(bounds.world.extentScaled[axes[0]].bits) // |dx|, |dy|
    perPair += dims * COSTS.multiply // dxs, dys
    perPair += COSTS.lessThan(f.distanceSquared.bits) // minDist clamp check
    perPair += COSTS.mux1 // minDist clamp mux
    perPair += COSTS.sqrt(f.distance.bits) // distance
    perPair += 2 * COSTS.isZero + 2 * COSTS.mux1 // bodies-sum mass guard
    perPair += COSTS.multiply * 4 // numerator/denominator builds
    perPair += dims * COSTS.div // one Div per axis
    perPair += dims * COSTS.isZero // sign extraction
    breakdown.pairwiseForce = perPair * pairs
    total += breakdown.pairwiseForce
  }

  if (bounds.forces.constant) {
    const f = bounds.forces.constant
    let dynamicAffected = 0
    for (const t of f.affectedKinds) {
      if (bounds.objects[t].kind === 'dynamic') {
        dynamicAffected += spec.objects[t].maxCount
      }
    }
    // Cheapest force: per dimension per affected dynamic body, one signed add
    breakdown.constantForce = dynamicAffected * dims * 2 // add + sign-handling
    total += breakdown.constantForce
  }

  if (bounds.forces.drag) {
    const f = bounds.forces.drag
    let dynamicAffected = 0
    for (const t of f.affectedKinds) {
      if (bounds.objects[t].kind === 'dynamic') {
        dynamicAffected += spec.objects[t].maxCount
      }
    }
    // Drag: multiply by (1 - coeff) — a multiplication and a Div if non-power-of-2
    breakdown.drag = dynamicAffected * dims * (COSTS.multiply + COSTS.div)
    total += breakdown.drag
  }

  // --- velocity update + clamp + position update + boundary ---

  for (const [name, ob] of Object.entries(spec.objects)) {
    const ow = bounds.objects[name]
    if (ow.kind === 'static') continue
    const N = ob.maxCount

    let perObject = 0
    if (ow.kind === 'dynamic') {
      // velocity += force; then clamp velocity component-wise to maxSpeed
      perObject += dims * 2 // signed accumulate
      perObject += dims * COSTS.limiter(ow.velocityScaled.bits)
    }
    // position += velocity
    perObject += dims * 1
    // boundary check per axis
    for (const ax of axes) {
      const mode = spec.world.boundary[ax]
      const posBits = bounds.world.extentScaled[ax].bits
      switch (mode) {
        case 'wrap':
          perObject += COSTS.positionWrap(posBits)
          break
        case 'clamp':
          perObject += COSTS.positionClamp(posBits)
          break
        case 'destroy':
          perObject += COSTS.positionDestroy(posBits)
          break
        case 'bounce':
          perObject += COSTS.positionBounce(posBits)
          break
        case 'none':
          // no boundary work, but position bits will grow over stepsPerProof.
          // Caller is on the hook for that growth elsewhere.
          break
      }
    }

    // Inputs (per-step witness handling)
    for (const inp of ob.inputs ?? []) {
      if (inp.kind === 'discrete') perObject += COSTS.inputDiscrete
      else if (inp.kind === 'continuous')
        perObject += COSTS.inputContinuous(ow.velocityScaled.bits)
    }

    breakdown[`object:${name}`] = perObject * N
    total += breakdown[`object:${name}`]
  }

  // --- collisions ---
  for (const c of spec.collisions ?? []) {
    const a = spec.objects[c.a]
    const bobj = spec.objects[c.b]
    const aw = bounds.objects[c.a]
    const bw = bounds.objects[c.b]
    const pairs = a.maxCount * bobj.maxCount
    const distBits = Math.max(
      ...axes.map((ax) => bounds.world.extentScaled[ax].bits)
    )
    const cost =
      c.shape === 'aabb'
        ? COSTS.collisionAabb(distBits)
        : COSTS.collisionCircle(distBits + 1)
    breakdown[`collision:${c.a}-${c.b}`] = cost * pairs
    total += breakdown[`collision:${c.a}-${c.b}`]
  }

  return { total, breakdown }
}

/**
 * Estimate the full circuit constraint count and check it against the spec's
 * constraintBudget. Returns { stepConstraints, totalConstraints, withinBudget,
 * breakdown, headroom, suggestions[] }.
 *
 * @param {ReturnType<typeof import('./bounds.js').deriveBounds>} bounds
 */
export function estimateBudget(bounds) {
  const { total: stepConstraints, breakdown } = estimateStepConstraints(bounds)
  const totalConstraints = stepConstraints * bounds.spec.time.stepsPerProof
  const budget = bounds.spec.precision.constraintBudget
  const withinBudget = totalConstraints <= budget
  const headroom = budget - totalConstraints

  const suggestions = []
  if (!withinBudget) {
    const overBy = totalConstraints - budget
    suggestions.push(
      `Over budget by ${overBy.toLocaleString()} constraints (${((overBy / budget) * 100).toFixed(1)}% over).`
    )
    // Top contributor
    const ranked = Object.entries(breakdown).sort((a, b) => b[1] - a[1])
    if (ranked.length) {
      const [topName, topCost] = ranked[0]
      suggestions.push(
        `Largest per-step contributor: ${topName} (${topCost.toLocaleString()}/step). Reducing its count or scope will help most.`
      )
    }
    // stepsPerProof is always a knob
    const halfStepsTotal = Math.floor(totalConstraints / 2)
    suggestions.push(
      `Halving time.stepsPerProof (currently ${bounds.spec.time.stepsPerProof}) drops total to ~${halfStepsTotal.toLocaleString()}.`
    )
  } else if (headroom < budget * 0.1) {
    suggestions.push(
      `Within budget but tight (${((headroom / budget) * 100).toFixed(1)}% headroom). Future feature additions will likely require trimming.`
    )
  }

  // Rough R1CS file size — historically 1M constraints ≈ 200-400 MB R1CS
  // alone (snarkjs ptau-paired); keep this very loose.
  const estR1csMB = (totalConstraints / 1_000_000) * 250

  return {
    stepConstraints,
    totalConstraints,
    budget,
    withinBudget,
    headroom,
    breakdown,
    estR1csMB,
    suggestions,
  }
}
