# demos/

Three browser-playable games built on `@anybody/physics`: Flappy Bird,
Chrome Dino, and a tiny platformer. Each one:

- loads its preset from `physics/presets/<game>.js`,
- runs deterministic fixed-point BigInt physics that matches what the
  matching circom circuit will verify,
- records every input tick so the run can be replayed inside the circuit,
- exposes a "generate proof" button that loads snarkjs and proves the
  recorded run *if* the matching circuit has been compiled to
  `public/<game>.{wasm,_final.zkey}`.

## Run locally

```bash
yarn demos          # starts http://localhost:8080/demos/
```

Then click flappy / dino / platformer.

## Generate a proof

The proof button is gated on circuit artifacts being present in `public/`.
Compile the circuits first:

```bash
yarn circom flappy
yarn circom dino
yarn circom platformer
```

That runs `scripts/basic_circom.sh` against each `circuits/games/<game>.circom`,
producing `<game>.wasm`, `<game>_final.zkey`, and copying them to `public/`.
After they exist, the demo's "generate proof" button will run
`snarkjs.groth16.fullProve(input, wasmPath, zkeyPath)` and report success
+ public signals.

If you click the button before compiling, you'll get a friendly:

> ✗ /flappy.wasm not found. Compile the circuit first: yarn circom flappy

## Layout

```
demos/
├── index.html              # landing page (links to each game)
├── shared/
│   ├── engine.js           # deterministic BigInt physics engine
│   ├── render.js           # canvas + keyboard + run recorder
│   ├── prover.js           # snarkjs wrapper, gated on artifacts
│   └── style.css
├── flappy/
│   ├── index.html
│   └── flappy.js
├── dino/
│   ├── index.html
│   └── dino.js
├── platformer/
│   ├── index.html
│   └── platformer.js
└── test/
    └── engine.test.mjs     # determinism + invariant tests (9 tests)
```

## What's verified vs what isn't

Verified (run `yarn test:demos` and `yarn test:physics`):
- Engine determinism: same inputs → byte-identical state.
- Per-game invariants: gravity pulls, kinematic objects scroll, flap
  impulse sets vy to a fixed value, jump cooldown blocks double-jump,
  drag reduces velocity, setVelocity overrides force-derived vx.
- All four physics presets validate, derive bounds, fit their constraint
  budget.

Not verified in this PR:
- Circom circuits for the new games are **skeletons** — the contract is
  defined (inputs / outputs / step chaining) but each `*Step` template
  body is a TODO. Compiling them will produce a valid R1CS but it
  doesn't enforce game logic yet. See `circuits/games/README.md` for the
  per-game recipe to fill them in.
- I could not test the demos in a real browser from this environment.
  The dev server serves all assets (verified via curl), every JS file
  passes `node --check`, and the engine tests prove the math. But you
  need to actually click through the gameplay to confirm rendering and
  input feel right.

## Why JS BigInt for the demo physics

Two reasons:

1. **Matches the circuit byte-for-byte.** The circom circuit will do
   integer arithmetic mod a large prime, but for the value ranges in
   these games (well under 2^200) integer math and field math agree.
   Running the physics in BigInt JS means whatever you see in the
   browser is exactly what the circuit will sign off on.
2. **Fast enough.** The earlier benchmark
   (`tools/circom2js/test/bench.mjs`) found JS BigInt is ~64× faster
   than the WASM witness calculator for equivalent physics. Browsers
   can run these games at 60 fps with headroom.
