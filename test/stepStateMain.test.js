

const hre = require("hardhat");
const { assert } = require("chai");
const {
  runComputationBigInt,
  convertScaledStringArrayToBody,
  convertScaledBigIntBodyToArray,
} = require("../docs/index.js");
const p = 21888242871839275222246405745257275088548364400416034343698204186575808495617n;

describe("stepStateMain circuit", () => {
  let circuit;

  const sampleInput = {
    bodies: [
      ["22600000000", "4200000000", "-133000000", "-629000000", "10000000000"],
      ["36300000000", "65800000000", "-332000000", "374000000", "7500000000"],
      ["67900000000", "50000000000", "229000000", "252000000", "5000000000"]
    ],

    // NOTE: need to have array of 11 when step = 10 because missiles need to be n + 1
    missiles: [
      ["22600000000", "4200000000", "0", "0", "10000000000"],
      ["0", "0", "0", "0", "0"],
      ["0", "0", "0", "0", "0"],
      ["0", "0", "0", "0", "0"],
      ["0", "0", "0", "0", "0"],
      ["0", "0", "0", "0", "0"],
      ["0", "0", "0", "0", "0"],
      ["0", "0", "0", "0", "0"],
      ["0", "0", "0", "0", "0"],
      ["0", "0", "0", "0", "0"],
      ["0", "0", "0", "0", "0"]
    ]
  };
  const sanityCheck = true;

  before(async () => {
    circuit = await hre.circuitTest.setup("stepStateMain");

  });

  it("produces a witness with valid constraints", async () => {
    const witness = await circuit.calculateWitness(sampleInput, sanityCheck);
    await circuit.checkConstraints(witness);
  });

  it("has expected witness values", async () => {
    const witness = await circuit.calculateLabeledWitness(
      sampleInput,
      sanityCheck
    );
    // console.log({ witness })

    // assert.propertyVal(witness, "main.squared", sampleInput.squared);
    // assert.propertyVal(witness, "main.calculatedRoot", sampleInput.calculatedRoot);
    // assert.propertyVal(witness, "main.calculatedSquared", (sampleInput.calculatedRoot ** 2).toString())
    // assert.propertyVal(witness, "main.out", "1");
  });

  it("has the correct output", async () => {
    let bodies = sampleInput.bodies.map(convertScaledStringArrayToBody)
    let missiles = sampleInput.missiles.map(convertScaledStringArrayToBody)
    // console.dir({ bodies }, { depth: null })
    // console.dir({ missiles }, { depth: null })
    for (let i = 0; i < 10; i++) {
      const results = runComputationBigInt(bodies, missiles)
      bodies = results.bodies
      missiles = results.missiles
    }
    const out_bodies = bodies.map(convertScaledBigIntBodyToArray)
    // console.log({ out_bodies })
    const expected = { out_bodies };
    const witness = await circuit.calculateWitness(sampleInput, sanityCheck);
    await circuit.assertOut(witness, expected);
  });
});
