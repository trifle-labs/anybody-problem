# @anybody/physics

A circom-native 2D (and 1D / 3D) physics library for provable browser games.
Originally factored out of the anybody-problem n-body circuits, now generalized
to cover platformers, runners, Flappy-Bird-likes, Asteroids-likes, and so on.

This package has three halves you'll use directly:

1. **`schema.js` (`defineGame`)** — declarative spec for a whole game's
   physics: world, time, forces, object kinds, collisions, termination.
2. **`bounds.js`** — given a validated spec, derive the **exact** maximum
   value (and bit width) of every signal your circuit will hold. Pure
   algebra, no Monte Carlo.
3. **`budget.js`** — given those bounds, estimate the constraint count of
   the eventual R1CS so you can stay under your file-size + proving-time
   budget *before* you compile.

Plus four presets that double as worked examples (`presets/`): the original
n-body, Flappy Bird, the Chrome dino game, a tiny platformer. They cover
every dimension of the schema.

## Quick start

```js
import { flappyBird } from '@anybody/physics/presets/flappyBird.js'
import { deriveBounds } from '@anybody/physics/bounds.js'
import { estimateBudget } from '@anybody/physics/budget.js'

const bounds = deriveBounds(flappyBird)
const est = estimateBudget(bounds)
console.log(est)
// { stepConstraints: 1140,
//   totalConstraints: 342000,
//   budget: 1000000,
//   withinBudget: true,
//   ... }
```

To author your own game, see [`QUESTIONNAIRE.md`](./QUESTIONNAIRE.md) — it
walks through every field of the schema as a series of questions to answer.

## Where the answers go

Every "question" the user must answer at project-start is one of these:

| Section | Question                                  | Schema field                           | Affects circuit size?           |
| ------- | ----------------------------------------- | -------------------------------------- | ------------------------------- |
| World   | Spatial dimensions (1/2/3)?               | `world.dimensions`                     | Yes (linear)                    |
|         | World size per axis?                      | `world.extent.{x,y,z}`                 | Yes (log scale per axis)        |
|         | What happens at the edge per axis?        | `world.boundary.{x,y,z}`               | Yes (clamp/wrap/bounce/destroy) |
|         | Y up or down?                             | `world.coordinates`                    | No                              |
| Time    | Physics tick rate?                        | `time.fps`                             | No                              |
|         | Ticks per proof?                          | `time.stepsPerProof`                   | **Yes (linear, biggest knob)**  |
|         | dt multiplier?                            | `time.dt`                              | No                              |
| Numeric | Fixed-point precision?                    | `precision.scalingFactor`              | Yes (log per signal)            |
|         | Constraint budget?                        | `precision.constraintBudget`           | Hard cap                        |
| Forces  | Constant gravity / pairwise / drag?       | `forces[].kind`                        | **Yes (huge for pairwise)**     |
|         | Force parameters?                         | `forces[].{vec,G,minDistance,coeff}`   | Yes                             |
|         | Which object kinds?                       | `forces[].appliesTo`                   | Yes                             |
| Objects | Static / kinematic / dynamic per kind?    | `objects.<kind>.kind`                  | **Yes (static is free)**        |
|         | Max instance count?                       | `objects.<kind>.maxCount`              | **Yes (squared for pairwise)**  |
|         | Max speed / radius / mass?                | `objects.<kind>.{maxSpeed,maxRadius}`  | Yes (log)                       |
|         | Inputs (jump, left, right…)?              | `objects.<kind>.inputs`                | Yes (per-tick witness)          |
| Collisions | Which pairs collide?                   | `collisions[].{a,b}`                   | Yes (count × pair-cost)         |
|         | Detection shape & response?               | `collisions[].{shape,response}`        | Yes (aabb < circle)             |
| Termination | What ends the level?                  | `termination[].kind`                   | Small                           |
| Randomness | Procedural content?                    | `randomness.kind`                      | TBD                             |

## What the bounds and budget tools tell you

`deriveBounds(spec)` returns an object whose every leaf is `{max, bits}`
— the algebraic maximum of that signal under the spec's constants, plus
the minimum bit width to represent it. You feed those bit widths into
`LessThan(...)`, `Sqrt(...)`, etc. when generating the circom.

`estimateBudget(bounds)` returns an estimate of the total constraint count,
broken down by step component, with suggestions if you're over budget.
The estimator is **conservative** (overcounts pairwise gravity ~2× vs
real circomlib output) so when it says you fit, you fit.

## Status & roadmap

- **Done:** schema, validation, bounds derivation, budget estimator, four
  presets, all unit tests pass.
- **Next:** circuit code-gen — emit a complete `stepState`-shape circom
  from any validated spec. Today the library tells you what bit widths to
  use; soon it'll write the circuits for you.
- **Also next:** integrate with `tools/circom2js/` so the generated circom
  can also produce its JS-BigInt simulator side-by-side.

See `presets/anybody.js` for how the existing anybody-problem game maps
onto the new schema. See `presets/flappyBird.js`, `chromeDino.js`,
`platformer.js` for examples of game types in genres the library now
supports.
