# Anybody Problem

Anybody Problem is a circom project that models the movement of any number of `n` bodies using classic newtonian-like physics over any number of `s` steps. There are two versions:

## Anybody Problem NFT

The Anybody Problem NFT is a simulation of the bodies moving in space over time. Proofs are generated over `s` steps with `n` bodies and verified on-chain. This version is represented in the top level `nft.circom` circuit [here](./circuits/nft.circom).

## Anybody Problem Game

The Anybody Problem Game adds an additional `missiles` input that allows a user to fire missiles at the bodies in order to destroy them. This version is represented in the top level `stepState.circom` circuit [here](./circuits/stepState.circom). A very rough draft of the game can be played at https://okwme.github.io/anybody-problem.

## Circuits

There are a number of circuits involved in Anybody Problem. They're listed below with links and short descriptions.

> NOTICE: **Scaling Factor**  
> Due to the lack of float values in circom, the values are scaled up by a factor of 10\*\*8. This means that the values are integers and the decimal point is implied. For example, the value `1.5` would be represented as `150000000`.

> NOTICE: **Negative Values**
> Due to the nature of finite field arithmetic, negative values are represented as `p-n` where `p` is the prime number used in the finite field and `n` is the absolute value of the negative number.
>
> For example, `-1` would be represented as: `21888242871839275222246405745257275088548364400416034343698204186575808495617 - 1`  
> or  
> `21888242871839275222246405745257275088548364400416034343698204186575808495616`.

### [AbsoluteValueSubtraction(n)](./circuits/approxMath.circom:79)

This circuit finds the absolute value difference between two numbers.

- `n` - The maximum number of bits for each input value
- `input in[2]` - An array of length 2 for each input value
- `output out` - The difference between the two values

### [AcceptableMarginOfError(n)](./circuits/approxMath.circom:60)

This circuit is used in tandem with `approxDiv` and `approxSqrt` which are both defined in [`approxMath.circom`](./circuits/approxMath.circom). When finding the approximate solution to division or the approximate square root of a value, there is an acceptable margin of error to be expected. This circuit ensures the value is within that range.

- `n` - The maximum number of bits for each input value
- `input expected` - The expected value
- `input actual` - The actual value
- `input marginOfError` - The margin of error
- `output out` - The output value is `0` when the difference is outside the margin of error and `1` when within the margin of error.

### [CalculateForce()](./circuits/calculateForce.circom)

This circuit calculates the gravitational force between two bodies based on their mass and position in space.

- `input in_bodies[2][5]` - An array of length 2 for each body. Each body has 5 inputs: `position_x`, `position_y`, `vector_x`, `vector_y` and `radius/mass`. These are all scaled up by a factor of 10\*\*8.
- `output out_forces` - An array of length 2 for each force, `force_x` and `force_y`

### [DetectCollision(totalBodies)](./circuits/detectCollision.circom)

This circuit detects if a body and a missile are colliding. It does this by calculating the distance between the two and comparing it to the sum of their radii. If a collision is detected, the radius/mass of the body and the missile are returned as 0.

- `totalBodies` - The total number of bodies in the simulation
- `input bodies[totalBodies][5]` - An array of length `totalBodies` for each body. Each body has 5 inputs: `position_x`, `position_y`, `vector_x`, `vector_y` and `radius/mass`
- `input missile[5]` - An array of length 5 for the missile. Each missile has 5 inputs: `position_x`, `position_y`, `vector_x`, `vector_y` and `radius/mass`. These are all scaled up by a factor of 10\*\*8.
- `output out_bodies[totalBodies][5]` - An array of length `totalBodies` for each body. Each body has 5 outputs: `position_x`, `position_y`, `vector_x`, `vector_y` and `radius/mass`. These are all scaled up by a factor of 10\*\*8.
- `output out_missile[5]` - An array of length 5 for the missile. Each missile has 5 outputs: `position_x`, `position_y`, `vector_x`, `vector_y` and `radius/mass`. These are all scaled up by a factor of 10\*\*8.

### [ForceAccumulator(totalBodies)](./circuits/forceAccumulator.circom)

This circuit calculates the total force on each body based on the gravitational force between each pair of bodies. It limits the vector by a maximum value and updates the position of each body based on its accumulated force. If the new position is outside the boundary of the simulation, it is updated to be on the opposite side as if the area was a torus.

- `totalBodies` - The total number of bodies in the simulation
- `input in_bodies[totalBodies][5]` - An array of length `totalBodies` for each body. Each body has 5 inputs: `position_x`, `position_y`, `vector_x`, `vector_y` and `radius/mass`. These are all scaled up by a factor of 10\*\*8.
- `output out_bodies[totalBodies][5]` - An array of length `totalBodies` for each body. Each body has 5 outputs: `position_x`, `position_y`, `vector_x`, `vector_y` and `radius/mass`. These are all scaled up by a factor of 10\*\*8.

### [GetDistance(n)](./circuits/getDistance.circom)

This circuit calculates the distance between two coordinate points using `approxSqrt()` and checking the result is within an acceptable margin of error using `AcceptableMarginOfError()`.

- `n` - The maximum number of bits for each input value and expected output value.
- `input x1` - The x coordinate of the first point
- `input y1` - The y coordinate of the first point
- `input x2` - The x coordinate of the second point
- `input y2` - The y coordinate of the second point
- `output distance` - The distance between the two points

### [Limiter(n)](./circuits/limiter.circom)

This circuit limits the value of an input to a maximum value. It also accepts an alternative value that is returned if the input value is greater than the maximum.

- `n` - The maximum number of bits for each input value and expected output value.
- `input in` - The input value
- `input limit` - The maximum value
- `input rather` - The alternative value
- `output out` - The output value

### [LowerLimiter(n)](./circuits/limiter.circom:23)

This circuit limits the value of an input to a minimum value. It also accepts an alternative value that is returned if the input value is less than the minimum.

- `n` - The maximum number of bits for each input value and expected output value.
- `input in` - The input value
- `input limit` - The minimum value
- `input rather` - The alternative value
- `output out` - The output value

### [nft(totalBodies, steps)](./circuits/nft.circom)

This circuit is the top level circuit for the NFT version of Anybody Problem. It takes in the initial state of the bodies and the number of steps to simulate and outputs the resulting bodies.

- `totalBodies` - The total number of bodies in the simulation
- `steps` - The total number of steps to simulate
- `input bodies[totalBodies][5]` - An array of length `totalBodies` for each body. Each body has 5 inputs: `position_x`, `position_y`, `vector_x`, `vector_y` and `radius/mass`. These are all scaled up by a factor of 10\*\*8.
- `output out_bodies[totalBodies][5]` - An array of length `totalBodies` for each body. Each body has 5 outputs: `position_x`, `position_y`, `vector_x`, `vector_y` and `radius/mass`. These are all scaled up by a factor of 10\*\*8.

### [StepState(totalBodies, steps)](./circuits/stepState.circom)

This is the top level circuit for the game version of Anybody Problem. It takes in the initial state of the bodies, the number of steps to simulate and the missiles to fire and outputs the resulting bodies.

- `totalBodies` - The total number of bodies in the simulation.
- `steps` - The total number of steps to simulate.
- `input bodies[totalBodies][5]` - An array of length `totalBodies` for each body. Each body has 5 inputs: `position_x`, `position_y`, `vector_x`, `vector_y` and `radius/mass`. These are all scaled up by a factor of 10\*\*8.
- `input missiles[steps + 1][5]` - An array of length `steps + 1` for each missile. Each missile has 5 inputs: `position_x`, `position_y`, `vector_x`, `vector_y` and `radius/mass`. These are all scaled up by a factor of 10\*\*8.
- `output out_bodies[totalBodies][5]` - An array of length `totalBodies` for each body. Each body has 5 outputs: `position_x`, `position_y`, `vector_x`, `vector_y` and `radius/mass`. These are all scaled up by a factor of 10\*\*8.

## Tests

To run rudimentary tests on the various circuits use the following command:

```bash
yarn test
```

You should see something like:

```bash
  absoluteValueSubtraction circuit
    ✔ produces a witness with valid constraints
    ✔ has the correct output

  acceptableMarginOfError circuit
    ✔ produces a witness with valid constraints
    ✔ has the correct output

  Bodies Tests
    ✔ has the correct bodies, dust addresses
    ✔ onlyOwner functions are really only Owner
    ✔ updates dust price correctly
    ✔ has all the correct interfaces
    ✔ fallback and receive functions revert
    ✔ onlyProblem functions can only be called by Problems address
    ✔ matches seeds between Bodies and Problems contracts
    ✔ mints a new body after receiving Dust
    ✔ fails when you try to mint a body for a problem you do not own
    ✔ validate second mint event
    ✔ succeeds adding a body into a problem
    ✔ removes a body that was added into a problem
    ✔ mints a body, adds it to a problem, then mints another body
    - combines two bodies correctly
    ✔ fails to mint an 11th body

  calculateForceMain circuit
    ✔ produces a witness with valid constraints
    ✔ has the correct output

  detectCollisionMain circuit
    ✔ produces a witness with valid constraints
    ✔ has the correct output

  forceAccumulatorMain circuit
    ✔ produces a witness with valid constraints
    ✔ has the correct output

  getDistanceMain circuit
    ✔ produces a witness with valid constraints
    ✔ has the correct output

  limiterMain circuit
    ✔ produces a witness with valid constraints
    ✔ has the correct output

  lowerLimiterMain circuit
    ✔ produces a witness with valid constraints
    ✔ has the correct output

  Metadata Tests
    ✔ has the correct problems address
    ✔ onlyOwner functions are really only Owner
    ✔ creates an SVG

  nft circuit
    ✔ produces a witness with valid constraints
    ✔ has the correct output
    ✔ NftVerifier.sol works

  Problem Tests
    ✔ has the correct verifiers metadata, bodies, dust, solver addresses
    ✔ onlyOwner functions are really only Owner
    ✔ onlySolver functions are really only Solver
    ✔ has all the correct interfaces
    ✔ emits 'EthMoved' events when eth is moved
    ✔ fails when unitialized
    ✔ fails to adminMint when uninitialized
    ✔ fails to adminMint when not owner
    - sends money to splitter correctly
    ✔ must be unpaused
    ✔ succeeds to mint
    ✔ succeeds to mint with fallback method
    ✔ succeeds to mint with explicit recipient
    ✔ token ID is correctly correlated
    ✔ validate second mint event
    ✔ checks whether mint fails with wrong price and succeeds even when price = 0
    ✔ adminMint from owner address
    ✔ stores the verifiers in the correct order of the mapping
    ✔ mints bodies that contain valid values
    ✔ mints a body via mintBodyToProblem

  Solver Tests
    ✔ has the correct problems, dust addresses
    ✔ onlyOwner functions are really only Owner
    ✔ fallback and receive functions revert
    ✔ creates a proof for 3 bodies
    ✔ creates multiple proofs in a row
    ✔ creates proofs for multiple bodies
    ✔ has the correct body boost amount
    ✔ adds a body, removes a body, creates a proof
    - adds two bodies, removes first body, creates a proof

  stepStateTest circuit
    ✔ produces a witness with valid constraints
    ✔ has the correct output

  Utilities work as expected
    ✔ should only allow valid seeds

  66 passing (1m)
  3 pending

✨  Done in 64.01s.
```

## Performance

Currently the project is targeting [powersOfTau28_hez_final_20.ptau](https://github.com/iden3/snarkjs/blob/master/README.md#7-prepare-phase-2) which has a limit of 1MM constraints. Below is a table of the number of constraints used by each circuit.

| Circuit                       | Non-Linear Constraints | seconds at 25fps under 1MM constraints |
| ----------------------------- | ---------------------- | -------------------------------------- |
| absoluteValueSubtraction(252) | 257                    | 155.64                                 |
| acceptableMarginOfError(60)   | 125                    | 320                                    |
| calculateForce()              | 279                    | 143.37                                 |
| detectCollision(3)            | 348                    | 114.94                                 |
| forceAccumulator(3)           | 1_522                  | 26.28                                  |
| getDistance(20)               | 88                     | 454.55                                 |
| limiter(252)                  | 254                    | 157.48                                 |
| lowerLimiter(252)             | 254                    | 157.48                                 |
| nft(3, 10)                    | 15_184                 | 26.34                                  |
| stepState(3, 10)              | 19_121                 | 20.92                                  |
| nft_3_20                      | 33_060                 |                                        |
| nft_4_20                      | 55_480                 |                                        |

### Tick to Dust Body Boost Chart

```
Generated proof in 0m 3s 121ms for 20 ticks with 3 bodies
Tick rate: 6.41 ticks/s
Tick rate per body: 2.14 ticks/s
Dust rate: 6.41 dust/s
Dust rate per body: 2.14 dust/s

Generated proof in 0m 3s 894ms for 20 ticks with 4 bodies
Tick rate: 5.14 ticks/s
Tick rate per body: 1.28 ticks/s
Dust rate: 10.27 dust/s
Dust rate per body: 2.57 dust/s

Generated proof in 0m 6s 701ms for 20 ticks with 5 bodies
Tick rate: 2.98 ticks/s
Tick rate per body: 0.60 ticks/s
Dust rate: 11.94 dust/s
Dust rate per body: 2.39 dust/s

Generated proof in 0m 7s 910ms for 20 ticks with 6 bodies
Tick rate: 2.53 ticks/s
Tick rate per body: 0.42 ticks/s
Dust rate: 20.23 dust/s
Dust rate per body: 3.37 dust/s

Generated proof in 0m 12s 961ms for 20 ticks with 7 bodies
Tick rate: 1.54 ticks/s
Tick rate per body: 0.22 ticks/s
Dust rate: 24.69 dust/s
Dust rate per body: 3.53 dust/s

Generated proof in 0m 14s 497ms for 20 ticks with 8 bodies
Tick rate: 1.38 ticks/s
Tick rate per body: 0.17 ticks/s
Dust rate: 44.15 dust/s
Dust rate per body: 5.52 dust/s

Generated proof in 0m 16s 339ms for 20 ticks with 9 bodies
Tick rate: 1.22 ticks/s
Tick rate per body: 0.14 ticks/s
Dust rate: 78.34 dust/s
Dust rate per body: 8.70 dust/s

Generated proof in 0m 25s 522ms for 20 ticks with 10 bodies
Tick rate: 0.78 ticks/s
Tick rate per body: 0.08 ticks/s
Dust rate: 100.31 dust/s
Dust rate per body: 10.03 dust/s
```

# built using circom-starter

A basic circom project using [Hardhat](https://github.com/nomiclabs/hardhat) and [hardhat-circom](https://github.com/projectsophon/hardhat-circom). This combines the multiple steps of the [Circom](https://github.com/iden3/circom) and [SnarkJS](https://github.com/iden3/snarkjs) workflow into your [Hardhat](https://hardhat.org) workflow.

By providing configuration containing your Phase 1 Powers of Tau and circuits, this plugin will:

1. Compile the circuits
2. Apply the final beacon
3. Output your `wasm` and `zkey` files
4. Generate and output a `Verifier.sol`

## Documentation

See the source projects for full documentation and configuration

# Circom + Contracts setup

## Install

`yarn` to install dependencies

## Development builds

`yarn circom:dev` to build deterministic development circuits.

Further, for debugging purposes, you may wish to inspect the intermediate files. This is possible with the `--debug` flag which the `circom:dev` task enables by default. You'll find them (by default) in `artifacts/circom/`

To build a single circuit during development, you can use the `--circuit` CLI parameter. For example, if you make a change to `hash.circom` and you want to _only_ rebuild that, you can run `yarn circom:dev --circuit hash`.

## Production builds

`yarn circom:prod` for production builds (using `Date.now()` as entropy)

# Webapp setup

```
yarn install
```

### Compiles and hot-reloads for development

```
yarn serve
```

### Compiles and minifies for production

```
yarn build
```

### Lints and fixes files

```
yarn lint
```

### Customize configuration

See [Configuration Reference](https://cli.vuejs.org/config/).
