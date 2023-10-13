const hre = require("hardhat");
const { assert } = require("chai");
const {
  detectCollisionBigInt,
  convertScaledStringArrayToBody,
  convertScaledBigIntBodyToArray
} = require("../docs/index.js");
const modp = 21888242871839275222246405745257275088548364400416034343698204186575808495617n;
describe("detectCollisionMain circuit", () => {
  let circuit, p

  const sampleInput = {
    "bodies": [
      ["22600000000", "4200000000", "-1", "-629000000", "10000000000"],
      ["36300000000", "65800000000", "-332000000", "374000000", "7500000000"],
      ["67900000000", "50000000000", "229000000", "252000000", "5000000000"]
    ],
    "missile": ["22600000000", "4200000000", "0", "0", "10000000000"]
  };
  const sanityCheck = true;

  before(async () => {
    circuit = await hre.circuitTest.setup("detectCollisionMain");
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

    // assert.propertyVal(witness, "main.squared", sampleInput.squared);
    // assert.propertyVal(witness, "main.calculatedRoot", sampleInput.calculatedRoot);
    // assert.propertyVal(witness, "main.calculatedSquared", (sampleInput.calculatedRoot ** 2).toString())
    // assert.propertyVal(witness, "main.out", "1");
  });

  it("has the correct output", async () => {
    const bodiesBefore = []
    for (let i = 0; i < sampleInput.bodies.length; i++) {
      bodiesBefore.push(convertScaledStringArrayToBody(sampleInput.bodies[i]))
    }
    const missiles = [convertScaledStringArrayToBody(sampleInput.missile)]
    // console.log({ bodiesBefore, missiles })
    const results = detectCollisionBigInt(bodiesBefore, missiles)
    // console.log({ results })
    const out_bodies = results.bodies.map(convertScaledBigIntBodyToArray)
    const out_missile = results.missiles.map(convertScaledBigIntBodyToArray)[0]
    // console.log({ out_bodies })
    // console.log({ out_missile })
    const expected = { out_bodies, out_missile };
    const witness = await circuit.calculateWitness(sampleInput, sanityCheck);
    await circuit.assertOut(witness, expected);
  });
});
