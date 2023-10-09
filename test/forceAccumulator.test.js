

const hre = require("hardhat");
const { assert } = require("chai");
const {
  calculateForce,
  sqrtApprox,
  scalingFactor,
  convertScaledStringArrayToBody,
  convertScaledBigIntBodyToArray,
  forceAccumulatorBigInts
} = require("../docs/index.js");
const p = 21888242871839275222246405745257275088548364400416034343698204186575808495617n;

describe("forceAccumulatorMain circuit", () => {
  let circuit;

  const sampleInput = {
    bodies: [
      ["22600000000", "4200000000", "-133000000", "-629000000", "10000000000"],
      ["36300000000", "65800000000", "-332000000", "374000000", "7500000000"],
      ["67900000000", "50000000000", "229000000", "252000000", "5000000000"]
    ]
  };
  const sanityCheck = true;

  before(async () => {
    circuit = await hre.circuitTest.setup("forceAccumulatorMain");

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
    const bodies = sampleInput.bodies.map(convertScaledStringArrayToBody)
    // console.dir({ bodies }, { depth: null })

    const out_bodies = forceAccumulatorBigInts(bodies).map(convertScaledBigIntBodyToArray)
    console.log({ out_bodies })
    const expected = { out_bodies };
    const witness = await circuit.calculateWitness(sampleInput, sanityCheck);
    await circuit.assertOut(witness, expected);
  });
});
