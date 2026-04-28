# Project-start questionnaire

When you start a new game on `@anybody/physics`, work through these
questions in order. Each one corresponds to one or more fields in the spec
that `defineGame()` consumes. The answers determine how big your circuit
will be — so where a question affects circuit size, that's noted.

If you'd rather start from a known-good baseline, copy a preset:

```js
import { flappyBird } from '@anybody/physics/presets/flappyBird.js'
```

…then change one field at a time and re-run `estimateBudget(deriveBounds(spec))`
between edits.

---

## §1 The world (5 questions)

**1.1 How many spatial dimensions?**
1, 2, or 3. Most browser games are 2. 1D is the dino runner (player x is locked).
3D works but is ~50% more bits per vector op.
→ `world.dimensions`

**1.2 How big is the world along each axis?**
In game-units (pre-scaling). Smaller is cheaper.
→ `world.extent.x`, `world.extent.y`, `world.extent.z`

**1.3 What happens at each edge?**
Per-axis: `wrap` (Asteroids), `clamp` (walls block), `destroy` (fall off →
gone), `bounce` (Pong), or `none` (unbounded — discouraged because position
bits grow over the proof window).
→ `world.boundary.x`, `world.boundary.y`

**1.4 Y-axis up or down?**
Browser/canvas games are screen coords (y down, top-left origin).
Math/physics simulators are math coords (y up).
→ `world.coordinates`

**1.5 Is the world infinite (procedural)?**
If yes, what's the player's frame of reference? Most "endless" games
(Flappy Bird, Dino, Mario) actually keep the player nearly stationary in x
and scroll the world past — so x can `wrap` to a small width. Avoid
`boundary: 'none'` unless you really mean it.

---

## §2 Time and proof granularity (3 questions)

**2.1 Physics tick rate (FPS)?**
How many discrete physics updates per second of real time. 25–60 is normal.
Doesn't directly affect circuit size — but combined with stepsPerProof it
sets how much wall-clock the proof covers.
→ `time.fps`

**2.2 Steps per proof?**
**THIS IS THE BIGGEST CIRCUIT-SIZE KNOB.** Total constraints scale linearly.
A 30 fps game with 300 stepsPerProof covers 10 real seconds; halving
stepsPerProof halves the circuit size and you generate proofs twice as often.
→ `time.stepsPerProof`

**2.3 Integration multiplier (dt)?**
Almost always 1. The original anybody-problem uses 2 to push velocity
further per step. Increasing dt makes physics coarser but doesn't reduce
circuit size on its own. Default 1.
→ `time.dt`

---

## §3 Numeric precision (2 questions)

**3.1 Fixed-point scaling factor?**
How many decimal places of precision your math needs. 100 = 2dp, 1000 = 3dp,
1_000_000 = 6dp. Bigger SF means more bit width per signal — every position,
velocity, and force gets `log2(SF)` more bits. Pick the smallest SF that
keeps your physics looking right.
→ `precision.scalingFactor`

**3.2 Constraint budget?**
Hard cap on R1CS constraints. 1_000_000 ≈ ~250 MB R1CS file ≈ ~1 GB total
artifacts including ptau, witness, pkey. Above 1M you start running into
trusted-setup file sizes and proof-gen times that exceed browser memory.
→ `precision.constraintBudget`

---

## §4 Forces (variable — depends on what your physics does)

**4.1 What forces exist in your world?**
Pick zero or more from:
- `gravity-constant`: a fixed acceleration vector applied each tick.
  Cheap. Used by: platformers, Flappy Bird, Dino, Mario.
- `gravity-pairwise`: every pair of dynamic bodies attracts (Newtonian).
  **Expensive — N² scaling.** Used by: anybody-problem, planetary sims.
- `drag-linear`: each tick velocity *= (1 - coeff). Useful for friction.
  Cheap.
→ `forces` array

**4.2 If you have constant gravity, what direction and magnitude?**
Vector (pre-scale). For screen-coords platformers: `[0, 800]` is gravity
pulling things down at 800 units/s².
→ `forces[i].vec`

**4.3 If you have pairwise gravity, what's G and minDistance?**
G is the gravitational constant. `minDistance` is the floor on r below which
the inverse-square term clamps (otherwise force → ∞ at r = 0).
→ `forces[i].G`, `forces[i].minDistance`

**4.4 Which object kinds does each force affect?**
A force only applies to listed object kinds. Static and kinematic objects
ignore forces by definition (they don't have velocity-from-force). List
only `dynamic` kinds.
→ `forces[i].appliesTo`

---

## §5 Object kinds (per kind, ~5 questions)

For each *kind* of object in your game (player, enemy, obstacle, ground,
projectile, particle, etc.):

**5.1 Static, kinematic, or dynamic?**
- `static`: never moves. Walls, ground, scenery. **Zero per-step cost.**
- `kinematic`: scripted movement (fixed velocity). Scrolling obstacles,
  moving platforms. Cheap — one position add per step.
- `dynamic`: full force-based integration. Players, balls, bodies. Most
  expensive — depends on which forces apply.
→ `objects.<kind>.kind`

**5.2 How many instances at most?**
Hard cap. Pairwise forces and per-pair collisions scale with N². Six
n-body bodies is reasonable; sixty is not.
→ `objects.<kind>.maxCount`

**5.3 Max speed?**
Per-axis cap on velocity (pre-scale). Required for dynamic objects so
velocity bit width stays bounded across ticks (assumes a velocity limiter
runs each tick).
→ `objects.<kind>.maxSpeed`

**5.4 Max radius / collision size?**
Required for collision detection. Also feeds into pairwise force magnitude
(via the mass-sum term).
→ `objects.<kind>.maxRadius`

**5.5 Mass (for pairwise forces only)?**
Used by `gravity-pairwise`. Optional otherwise; default 1.
→ `objects.<kind>.mass`

**5.6 If kinematic: what's the velocity vector?**
Constant velocity, ignored by forces. e.g. `[-10, 0]` for left-scrolling
obstacles.
→ `objects.<kind>.velocity`

**5.7 If static and a wall/ground: what shape?**
A `plane`, `box`, etc. Used by collision and rendering. Optional today —
collision response handles most cases via `block-from-above` etc.
→ `objects.<kind>.shape`

**5.8 If dynamic and player-controlled: what inputs does it have?**
Each input is one of:
- `discrete`: a button. Encodes as 1 bit per tick. Optional `impulse: {vy: …}`
  (set on press) or `setVelocity: {vx: …}` (apply while held).
- `continuous`: an analog axis. Encodes as N bits per tick. Use
  `max: <number>` to cap magnitude.

Each input adds witness signals × stepsPerProof. Cheap individually but
they add up if you have many.
→ `objects.<kind>.inputs`

---

## §6 Collisions (per pair)

**6.1 Which pairs of object kinds can collide?**
List unordered pairs of kind names. Pairs not listed pass through each other
freely (and cost nothing).
→ `collisions[i].a`, `collisions[i].b`

**6.2 What shape is collision checked against?**
- `circle` (default): distance between centers vs sum of radii. Uses sqrt.
- `aabb`: axis-aligned bounding boxes. Cheaper than circle, no sqrt.
→ `collisions[i].shape`

**6.3 What's the response on collision?**
- `pass-through`: no-op (useful if you want the event but no physics)
- `block`: solid wall behavior (player can't enter)
- `block-from-above`: only blocks downward motion (a platform you can jump up through)
- `bounce`: reflect velocities (Pong's paddles)
- `destroy-a` / `destroy-b` / `destroy-both`: zero out the radius
- `gameOver`: fire the lose-condition
→ `collisions[i].response`

---

## §7 Termination (per condition)

**7.1 What ends a level?**
Zero or more conditions. The first to trigger wins. Each is one of:
- `destroyed` of `target`: object kind `target` is fully gone (radius=0)
- `allDestroyed` of `target`: every instance of `target` is gone
- `timeout`: `stepsPerProof` ticks elapsed
- `reachedGoal` of `target` to `goal: {x: 1000}`: position threshold
→ `termination[i].kind`, `termination[i].target`, `termination[i].goal`

**7.2 Is each condition a win or a lose?**
→ `termination[i].outcome`: `win` or `lose`. Default `lose`.

---

## §8 Randomness (optional)

**8.1 Is there procedural content (random obstacle spawn, level generation)?**
If yes, your seed has to be a circuit input that's committed before play
starts (else the prover could cheat by retroactively choosing favorable
RNG). The library doesn't ship a randomness primitive yet — open question.

---

## Sanity-check after answering

Once you've assembled a spec:

```js
import { defineGame } from '@anybody/physics'
import { deriveBounds } from '@anybody/physics/bounds.js'
import { estimateBudget } from '@anybody/physics/budget.js'

const game = defineGame({ /* your answers above */ })
const bounds = deriveBounds(game)
const est = estimateBudget(bounds)

console.log(`step: ${est.stepConstraints}`)
console.log(`total: ${est.totalConstraints} / ${est.budget}`)
console.log(`R1CS ≈ ${est.estR1csMB.toFixed(0)} MB`)
if (!est.withinBudget) console.log(est.suggestions)
```

The estimator is intentionally conservative (overcounts ~2× on pairwise
gravity vs the actual compiled circuits). When it says you fit, you fit.
When it says you don't, look at the breakdown — usually the answer is:

- Cut `time.stepsPerProof` in half and prove twice as often
- Lower `objects.<kind>.maxCount` for the heaviest kind
- Drop `precision.scalingFactor` to the minimum your gameplay needs
- Switch a pairwise force to constant gravity if N is large
