# circuits/games/

Per-game circom for the demos in `demos/`. Each circuit pairs with a preset
in `physics/presets/` and verifies a recorded play of that game.

## Status

These files declare the **contract** — the public/private inputs, the output
shape, and the per-step / total-game template structure — but the body of
each `*Step` template is currently a TODO. The skeleton compiles
syntactically (so circom won't reject it) but produces a degenerate
"identity" circuit that doesn't enforce gameplay invariants yet.

Filling them in is the next chunk of work. The recipe per game is:

1. **Velocity update.** For dynamic objects, add gravity to vy each tick and
   clamp velocity component-wise to `maxSpeed * dt * SF`. Use the existing
   `circuits/limiter.circom` (`Limiter(n)`).
2. **Input application.** Each discrete input is a bit per tick. For
   `impulse`, mux between current velocity and the impulse value when the
   bit is 1 (and any cooldown counter is 0). For `setVelocity`, similar.
3. **Position update.** Add velocity to position each tick.
4. **Boundary handling.** For each axis, check `LessThan(extent)` and mux:
   - `wrap`: if `p < 0`, add extent; if `p >= extent`, subtract extent.
   - `clamp`: if out of bounds, clamp to bounds and zero the velocity.
   - `destroy`: if out of bounds, set `alive = 0`.
5. **Kinematic objects.** Their velocity is fixed by the spec. Just add it
   to position each tick.
6. **Collision detection.** For each declared collision pair, use
   `circuits/getDistance.circom` to compute distance, then `LessThan` to
   compare against the sum of radii. On collision, mux the response:
   - `gameOver`: set a `gameOver` output to 1.
   - `block`: separate (subtract overlap from position) and zero relevant
     velocity component.
   - `block-from-above`: only if vy > 0 and player above target, snap to
     top and zero vy.
   - `destroy-*`: zero the radius (matches the existing pattern in
     `detectCollision.circom`).
7. **Termination.** Sum the `alive` flags or `gameOver` bits across steps
   and emit the result as a public output.

## Compiling

```bash
yarn circom flappy        # produces flappy.r1cs, flappy.wasm, flappy_final.zkey
yarn circom dino          # same for dino
yarn circom platformer    # same for platformer
```

`scripts/3_copy_files_to_public.sh` then copies the artifacts into
`public/` where the demos can fetch them at runtime.

## Why this is sketched and not finished

Building the full step-state for three new games is roughly the same effort
that went into the original `circuits/stepState.circom` — around 200 lines
of careful circom per game, and all three need their own custom collision
matrices. That's a follow-up PR. What this PR ships is the contract, the
demo harness, the deterministic JS engine that produces the witness
inputs, and the proof-gen wiring that activates as soon as the circuit
artifacts land in `public/`.
