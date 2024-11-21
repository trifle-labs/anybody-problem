# Anybody Problem

Anybody Problem is a circom project that models the movement of any number of `n` bodies using classic newtonian-like physics over any number of `s` steps.

## Anybody Problem Game

The Anybody Problem Game adds an additional `missiles` input that allows a user to fire missiles at the bodies in order to destroy them. This version is represented in the top level `stepState.circom` circuit [here](./circuits/stepState.circom). The game is live at [anybody.gg](https://anybody.gg)

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

### [StepState(totalBodies, steps)](./circuits/stepState.circom)

This is the top level circuit for the game version of Anybody Problem. It takes in the initial state of the bodies, the number of steps to simulate and the missiles to fire and outputs the resulting bodies.

- `totalBodies` - The total number of bodies in the simulation.
- `steps` - The total number of steps to simulate.
- `input bodies[totalBodies][5]` - An array of length `totalBodies` for each body. Each body has 5 inputs: `position_x`, `position_y`, `vector_x`, `vector_y` and `radius/mass`. These are all scaled up by a factor of 10\*\*8.
- `input missiles[steps + 1][5]` - An array of length `steps + 1` for each missile. Each missile has 5 inputs: `position_x`, `position_y`, `vector_x`, `vector_y` and `radius/mass`. These are all scaled up by a factor of 10\*\*8.
- `output out_bodies[totalBodies][5]` - An array of length `totalBodies` for each body. Each body has 5 outputs: `position_x`, `position_y`, `vector_x`, `vector_y` and `radius/mass`. These are all scaled up by a factor of 10\*\*8.

## Compilation

### Development

In order to run tests you need to have compiled circuits generated. You can do this by running:

```bash
yarn circom:game-test
```

This will generate smaller versions of the circuits, each only covering 20 frames of gameplay at a time. These should allow you to run most tests, the exception being `stepstate.test.js` where there is a test used to check proofs generated from real games called "passes one off check input".

### Production

To prepare for production, run the following command:

```bash
yarn circom:game-prod
```

This might take a while to generate but it will only produce proofs for 4 bodies at 250 frames of gameplay and 6 bodies at 125 frames of gameplay. All levels can be proven with these two circuits because the missing bodies are added with radius of 0 so they don't impact the simulation.

### Sindri

While games can be proven in browser, the variation of hardware prevents accurate prognosis of which machines are capabale of doing so in a reasonable time. As such we are using the service [Sindri](https://sindri.app) to generate proofs reliably fast. To ensure Sindri is unable to generate valid but incorrect proofs, we generate the prover files locally and then upload them to Sindri. To do this ensure the `zkey` file is named the same as the circuit file and is referenced with the same name as that used in `circuitPath` in the `sindri.json` file. For example, when uploading the zkey for `game_4_250.circom` that contains the `StepState` circuit, the `sindri.json` looks like this:

```json
{
  "$schema": "https://forge.sindri.app/api/v1/sindri-manifest-schema.json",
  "name": "game_4_250_v7",
  "circuitType": "circom",
  "circuitPath": "./game_4_250.circom",
  "curve": "bn254",
  "provingScheme": "groth16",
  "witnessCompiler": "c++"
}
```

and the `zkey` is saved at `./circuits/game_4_250.zkey`.

## Tests

To run rudimentary tests on the various circuits use the following command:

```bash
yarn test
```

You should see something like:

```bash
> yarn test
yarn run v1.22.22
$ hardhat test
 ·------------------------|--------------------------------|--------------------------------·
 |  Solc version: 0.6.11  ·  Optimizer enabled: false      ·  Runs: 200                     │
 ·························|································|·································
 |  Contract Name         ·  Deployed size (KiB) (change)  ·  Initcode size (KiB) (change)  │
 ·························|································|·································
 |  AnybodyProblem        ·                19.820 (0.000)  ·                21.935 (0.000)  │
 ·························|································|·································
 |  AnybodyProblemMock    ·                20.123 (0.000)  ·                22.237 (0.000)  │
 ·························|································|·································
 |  AnybodyProblemV0      ·                18.953 (0.000)  ·                21.295 (0.000)  │
 ·························|································|·································
 |  AnybodyProblemV0Mock  ·                19.200 (0.000)  ·                21.542 (0.000)  │
 ·························|································|·································
 |  Assets1               ·                19.754 (0.000)  ·                19.781 (0.000)  │
 ·························|································|·································
 |  Assets2               ·                23.139 (0.000)  ·                23.167 (0.000)  │
 ·························|································|·································
 |  Assets3               ·                20.617 (0.000)  ·                20.645 (0.000)  │
 ·························|································|·································
 |  Assets4               ·                16.870 (0.000)  ·                16.897 (0.000)  │
 ·························|································|·································
 |  Assets5               ·                16.719 (0.000)  ·                16.746 (0.000)  │
 ·························|································|·································
 |  ExternalMetadata      ·                18.384 (0.000)  ·                18.580 (0.000)  │
 ·························|································|·································
 |  Speedruns             ·                 7.716 (0.000)  ·                 8.009 (0.000)  │
 ·------------------------|--------------------------------|--------------------------------·

  absoluteValueSubtraction circuit
    ✔ produces a witness with valid constraints
    ✔ has the correct output

  acceptableMarginOfError circuit
    ✔ produces a witness with valid constraints
    ✔ has the correct output

  calculateForceMain circuit
    ✔ produces a witness with valid constraints
    - can check the differnce in speed calculating with witness vs anybody.js
    ✔ has the correct output

  detectCollisionMain circuit
    ✔ produces a witness with valid constraints
    ✔ has the correct output

  forceAccumulatorMain circuit
    ✔ produces a witness with valid constraints (41ms)
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

  nft circuit
    - produces a witness with valid constraints
    - has the correct output
    - NftVerifier.sol works

  stepStateTest circuit
    ✔ produces a witness with valid constraints (277ms)
    ✔ passes one off check input (24710ms)
    ✔ has the correct output when one body and missile positioned to hit and it returns correct number of steps (70ms)

  AnybodyProblem Tests
    ✔ has the correct verifiers, externalMetadata, speedruns addresses (397ms)
    ✔ stores the verifiers in the correct order of the mapping (300ms)
    - starts week correctly
    ✔ has the correct Speedruns addresses (303ms)
    ✔ onlyOwner functions are really only Owner (397ms)
    ✔ fallback and receive functions revert (312ms)
    ✔ creates a proof for level 1 (2680ms)
    ✔ solves the first level using mock (4518ms)
    ✔ must be unpaused (334ms)
    ✔ solves all levels async using mock (26775ms)
    ✔ solves all levels in a single tx (14845ms)
    ✔ has the same results for generateLevelData as anybody.js (392ms)
    ✔ has correct getLevelFromInputs with no dummy (312ms)
    ✔ has correct getLevelFromInputs with dummy (309ms)
    ✔ returns correct currentLevel (4577ms)
    ✔ performs an upgrade and the records are correct (29157ms)
    - emits arbitrary events within Speedruns
    - tests an arbitrary tx

  ExternalMetadata Tests
    ✔ has the correct anybodyProblem and speedruns addresses (355ms)
    ✔ onlyOwner functions are really only Owner (339ms)
    ✔ has valid json (17636ms)

  Speedruns Tests
    ✔ onlyAnybodyProblem functions can only be called by AnybodyProblem address (387ms)
    ✔ has all the correct interfaces (354ms)


  39 passing (2m)
  7 pending

······························································································································································································
|  Solidity and Network Configuration                                                                                                                                                        │
·········································································································|·················|···············|·················|································
|  Solidity: 0.6.11                                                                                      ·  Optim: false   ·  Runs: 200    ·  viaIR: false   ·     Block: 20,000,000 gas     │
·········································································································|·················|···············|·················|································
|  Network: ETHEREUM                                                                                     ·  L1: 0.10000 gwei               ·                 ·        2521.10 usd/eth        │
·········································································································|·················|···············|·················|················|···············
|  Contracts / Methods                                                                                   ·  Min            ·  Max          ·  Avg            ·  # calls       ·  usd (avg)   │
·········································································································|·················|···············|·················|················|···············
|  AnybodyProblem                                                                                        ·                                                                                   │
·········································································································|·················|···············|·················|················|···············
|      batchSolve(uint256,bool,uint256,uint256[],uint256[2][],uint256[2][2][],uint256[2][],uint256[][])  ·              -  ·            -  ·      1,263,522  ·             2  ·        0.32  │
·········································································································|·················|···············|·················|················|···············
|      recoverUnsuccessfulPayment(address)                                                               ·              -  ·            -  ·         30,247  ·             2  ·        0.01  │
·········································································································|·················|···············|·················|················|···············
|      updateDiscount(uint256)                                                                           ·              -  ·            -  ·         24,462  ·             2  ·        0.01  │
·········································································································|·················|···············|·················|················|···············
|      updatePaused(bool)                                                                                ·              -  ·            -  ·         45,769  ·             2  ·        0.01  │
·········································································································|·················|···············|·················|················|···············
|      updatePriceToMint(uint256)                                                                        ·              -  ·            -  ·         24,924  ·             2  ·        0.01  │
·········································································································|·················|···············|·················|················|···············
|      updatePriceToSave(uint256)                                                                        ·              -  ·            -  ·         27,232  ·             2  ·        0.01  │
·········································································································|·················|···············|·················|················|···············
|      updateProceedRecipient(address)                                                                   ·              -  ·            -  ·         30,194  ·             2  ·        0.01  │
·········································································································|·················|···············|·················|················|···············
|      updateSpeedrunsAddress(address)                                                                   ·              -  ·            -  ·         29,490  ·             2  ·        0.01  │
·········································································································|·················|···············|·················|················|···············
|      updateVerifier(address,uint256,uint256)                                                           ·              -  ·            -  ·         46,664  ·             2  ·        0.01  │
·········································································································|·················|···············|·················|················|···············
|  AnybodyProblemMock                                                                                    ·                                                                                   │
·········································································································|·················|···············|·················|················|···············
|      batchSolve(uint256,bool,uint256,uint256[],uint256[2][],uint256[2][2][],uint256[2][],uint256[][])  ·      1,902,008  ·    9,547,209  ·      4,452,577  ·            37  ·        1.12  │
·········································································································|·················|···············|·················|················|···············
|      setMockedBodyDataByLevel(uint256,(uint256,uint256,uint256,uint256,uint256,uint256,bytes32)[6])    ·        124,905  ·      942,401  ·        556,054  ·            28  ·        0.14  │
·········································································································|·················|···············|·················|················|···············
|      updatePaused(bool)                                                                                ·              -  ·            -  ·         45,763  ·             1  ·        0.01  │
·········································································································|·················|···············|·················|················|···············
|      updateProceedRecipient(address)                                                                   ·              -  ·            -  ·         30,232  ·             1  ·        0.01  │
·········································································································|·················|···············|·················|················|···············
|  AnybodyProblemV0Mock                                                                                  ·                                                                                   │
·········································································································|·················|···············|·················|················|···············
|      batchSolve(uint256,bool,uint256,uint256[],uint256[2][],uint256[2][2][],uint256[2][],uint256[][])  ·              -  ·            -  ·      8,031,319  ·             3  ·        2.02  │
·········································································································|·················|···············|·················|················|···············
|      setMockedBodyDataByLevel(uint256,(uint256,uint256,uint256,uint256,uint256,uint256,bytes32)[6])    ·        383,080  ·      942,416  ·        662,753  ·             5  ·        0.17  │
·········································································································|·················|···············|·················|················|···············
|  ExternalMetadata                                                                                      ·                                                                                   │
·········································································································|·················|···············|·················|················|···············
|      setAssets(address[5])                                                                             ·        137,001  ·      137,013  ·        137,011  ·            20  ·        0.03  │
·········································································································|·················|···············|·················|················|···············
|      setupSVGPaths()                                                                                   ·              -  ·            -  ·      1,806,648  ·            40  ·        0.46  │
·········································································································|·················|···············|·················|················|···············
|      updateAnybodyProblemAddress(address)                                                              ·         29,326  ·       46,438  ·         37,479  ·            42  ·        0.01  │
·········································································································|·················|···············|·················|················|···············
|      updateSpeedrunsAddress(address)                                                                   ·         29,008  ·       46,108  ·         44,553  ·            22  ·        0.01  │
·········································································································|·················|···············|·················|················|···············
|      __burn(address,uint256,uint256)                                                                   ·              -  ·            -  ·         28,073  ·             2  ·        0.01  │
·········································································································|·················|···············|·················|················|···············
|      __mint(address,uint256,uint256,bytes)                                                             ·              -  ·            -  ·         52,830  ·             4  ·        0.01  │
·········································································································|·················|···············|·················|················|···············
|      __safeTransferFrom(address,address,uint256,uint256,bytes)                                         ·              -  ·            -  ·         53,906  ·             2  ·        0.01  │
·········································································································|·················|···············|·················|················|···············
|      __setApprovalForAll(address,address,bool)                                                         ·              -  ·            -  ·         48,789  ·             2  ·        0.01  │
·········································································································|·················|···············|·················|················|···············
|  Speedruns                                                                                             ·                                                                                   │
·········································································································|·················|···············|·················|················|···············
|      emitGenericEvent(bytes32[],bytes)                                                                 ·              -  ·            -  ·         25,003  ·             2  ·        0.01  │
·········································································································|·················|···············|·················|················|···············
|      updateAnybodyProblemAddress(address)                                                              ·         29,172  ·       46,284  ·         37,524  ·            41  ·        0.01  │
·········································································································|·················|···············|·················|················|···············
|  Deployments                                                                                                             ·                                 ·  % of limit    ·              │
·········································································································|·················|···············|·················|················|···············
|  AnybodyProblem                                                                                        ·      4,863,675  ·    4,863,699  ·      4,863,698  ·        24.3 %  ·        1.23  │
·········································································································|·················|···············|·················|················|···············
|  AnybodyProblemMock                                                                                    ·      4,931,197  ·    4,990,909  ·      4,943,147  ·        24.7 %  ·        1.25  │
·········································································································|·················|···············|·················|················|···············
|  AnybodyProblemV0                                                                                      ·      4,688,531  ·    4,688,543  ·      4,688,539  ·        23.4 %  ·        1.18  │
·········································································································|·················|···············|·················|················|···············
|  AnybodyProblemV0Mock                                                                                  ·      4,743,168  ·    4,743,192  ·      4,743,183  ·        23.7 %  ·        1.20  │
·········································································································|·················|···············|·················|················|···············
|  Assets1                                                                                               ·              -  ·            -  ·      4,427,169  ·        22.1 %  ·        1.12  │
·········································································································|·················|···············|·················|················|···············
|  Assets2                                                                                               ·              -  ·            -  ·      5,177,023  ·        25.9 %  ·        1.31  │
·········································································································|·················|···············|·················|················|···············
|  Assets3                                                                                               ·              -  ·            -  ·      4,618,748  ·        23.1 %  ·        1.16  │
·········································································································|·················|···············|·················|················|···············
|  Assets4                                                                                               ·              -  ·            -  ·      3,788,953  ·        18.9 %  ·        0.96  │
·········································································································|·················|···············|·················|················|···············
|  Assets5                                                                                               ·              -  ·            -  ·      3,755,434  ·        18.8 %  ·        0.95  │
·········································································································|·················|···············|·················|················|···············
|  ExternalMetadata                                                                                      ·      4,170,569  ·    4,170,581  ·      4,170,580  ·        20.9 %  ·        1.05  │
·········································································································|·················|···············|·················|················|···············
|  Game_2_20Verifier.sol:Groth16Verifier                                                                 ·              -  ·            -  ·      1,389,269  ·         6.9 %  ·        0.35  │
·········································································································|·················|···············|·················|················|···············
|  Game_3_20Verifier.sol:Groth16Verifier                                                                 ·              -  ·            -  ·      1,739,395  ·         8.7 %  ·        0.44  │
·········································································································|·················|···············|·················|················|···············
|  Game_4_20Verifier.sol:Groth16Verifier                                                                 ·              -  ·            -  ·      2,089,585  ·        10.4 %  ·        0.53  │
·········································································································|·················|···············|·················|················|···············
|  Game_5_20Verifier.sol:Groth16Verifier                                                                 ·              -  ·            -  ·      2,440,280  ·        12.2 %  ·        0.62  │
·········································································································|·················|···············|·················|················|···············
|  Game_6_20Verifier.sol:Groth16Verifier                                                                 ·              -  ·            -  ·      2,790,971  ·          14 %  ·        0.70  │
·········································································································|·················|···············|·················|················|···············
|  Speedruns                                                                                             ·              -  ·            -  ·      1,790,475  ·           9 %  ·        0.45  │
·········································································································|·················|···············|·················|················|···············
|  ThemeGroupBlues.sol:ThemeGroup                                                                        ·              -  ·            -  ·      1,002,009  ·           5 %  ·        0.25  │
·········································································································|·················|···············|·················|················|···············
|  Key                                                                                                                                                                                       │
······························································································································································································
|  ◯  Execution gas for this method does not include intrinsic gas overhead                                                                                                                  │
······························································································································································································
|  △  Cost was non-zero but below the precision setting for the currency display (see options)                                                                                               │
······························································································································································································
|  Toolchain:  hardhat                                                                                                                                                                       │
······························································································································································································
✨  Done in 133.89s.
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
| stepState(3, 10)              | 19_121                 | 20.92                                  |
