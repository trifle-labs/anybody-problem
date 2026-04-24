# @anybody/physics

A **circom-native 2D physics library**, factored out of the circuits that power
the anybody-problem game. Think of it as a toolbox of provable primitives —
vectors, fixed-point math, collision, integration, gravity — plus the helpers
you need to wire them together into a game-sized circuit without blowing up
constraint counts.

This package has two halves:

1. **`physics/circuits/`** — parameterized circom templates (bit widths, scaling
   factor, gravity constant, window size, etc. are all template/config-driven
   rather than hard-coded).
2. **`physics/bounds.js`** — a pure-JS tool that, given a game config, derives
   exact bit widths for every intermediate signal by algebra. No Monte Carlo,
   no guessing — every bound falls out of the config invariants.

## Why a library?

The existing `circuits/` folder in this repo is effectively a 2D n-body engine
in circom. The same primitives (gravity, circle-circle collision, position
wrap, velocity clamp, fixed-point sqrt/div) are the building blocks of most
2D provable games. The only thing keeping them from being reusable is that
`windowWidth = 1000`, `scalingFactor = 1000`, `G = 100`, etc. are declared
inline in each template. Pulling those out into a config struct and deriving
bit widths from them is the whole lift.

## Design principles

1. **Fixed-point integer only.** No float, no field division. Every value is
   `actual × scalingFactor`. The scaling factor is a library-wide constant you
   pick at config time.
2. **Bit widths are derived, not declared.** You state the physical invariants
   (max speed, window size, max radius, min distance) and a function returns
   the exact `maxBits(·)` for every signal. Library users never write
   `LessThan(21)` — they write `LessThan(bounds.distance.bits)`.
3. **Invariants are explicit.** Each template documents which invariants it
   assumes and which it produces. `velocityAfterForceStep` assumes
   `velocity ∈ [-maxSpeed·SF, maxSpeed·SF]` on input and produces the same on
   output — but only because a limiter is applied every tick. Remove the
   limiter and the bound is gone.
4. **Composability over completeness.** We ship `gravity`, `circleCollision`,
   `eulerStep`, `positionWrap`, `velocityLimiter`, `missile`. We do not ship
   rigid bodies, joints, or a scene graph. Users compose primitives into a
   `StepState`-shaped template.

## What "exact bounds" means

Given this config:

```js
{
  scalingFactor: 1000,   // 3 decimal places of fixed-point precision
  windowWidth: 1000,     // world is 1000 × 1000 units
  maxSpeed: 10,          // velocity clamped to ±10 units/tick
  maxRadius: 13,
  gravity: 100,
  minDistance: 200,      // below this, gravity clamps (no singularity)
  dt: 2,                 // integration time step
  maxBodies: 6,          // N
}
```

`deriveBounds(config)` returns, for every intermediate signal in the engine,
the exact maximum value and the `ceil(log2(max+1))` bit width. For instance:

- `position.scaled ∈ [0, W·SF] = [0, 1_000_000]` → 20 bits
- `dxAbs ∈ [0, W·SF] = [0, 1_000_000]` → 20 bits
- `distanceSquared ∈ [0, 2·(W·SF)²] = [0, 2·10¹²]` → 41 bits
- `distance ∈ [0, √2·W·SF] ≈ [0, 1_414_214]` → 21 bits
- `massSum = 2·maxR·SF·4 = 104_000` → 17 bits (`·4` from the "liveliness"
  multiplier in `calculateForce`)
- `forceDenom = 2·distanceSquared·distance` → 63 bits
- `forceNumerator = G·SF² · massSum · (W·SF)` → 64 bits
- `accumulatedForce = force · (N−1) · dt` (before offset for sign) → 69 bits

Every one of these is an exact max, derived by following the arithmetic. The
game config is the root of a pure function that knows all of them.

## What the user still has to supply

Beyond "max speed + screen dimensions", the minimum config set is:

| Field           | Why it matters for bit widths                                             |
| --------------- | ------------------------------------------------------------------------- |
| `scalingFactor` | sets the fixed-point scale; bit widths grow as log₂(SF)                   |
| `windowWidth`   | bounds positions and position deltas                                      |
| `maxSpeed`      | bounds velocities (only if limiter is applied every tick)                 |
| `maxRadius`     | bounds mass/collision radius and feeds into force magnitude               |
| `gravity`       | force magnitude numerator                                                 |
| `minDistance`   | floor on distance — without it, `1/r²` has no upper bound                 |
| `dt`            | multiplies force→velocity and velocity→position per tick                  |
| `maxBodies`     | (N−1) pair-forces accumulate per body per tick                           |

Plus an **invariants declaration** — which clamps/wraps are in place each tick.
The bounds derivation uses these to assume post-step state stays inside the
declared envelope. Listed in `physics/config.js` as `invariants`.

## Status

This is the initial extract. Currently shipping:

- `config.js` — config schema + defaults matching the current anybody-problem
  game.
- `bounds.js` — exact symbolic bounds derivation; tested against the hand-
  computed bit widths already in `circuits/*.circom` comments.
- `circuits/gravity.circom` — `Gravity(cfg)` — parameterized version of
  `calculateForce`. Bit widths come from the config via `maxBits` functions.

On the roadmap:

- `circuits/integrator.circom` — parameterized `StepState`
- `circuits/collision.circom` — `CircleCircle(n)` collision
- `circuits/boundary.circom` — `Wrap(W)` and `Clamp(min,max)`
- `circuits/projectile.circom` — generalized missile

See also `tools/circom2js/` for the sibling effort: a circom→JS transpiler so
you can simulate circuits at FPS rates without the WASM witness calculator.
