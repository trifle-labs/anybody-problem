const hre = require("hardhat");
const { assert } = require("chai");
const { calculateForceBigInt, sqrtApprox, scalingFactor, convertBigIntToModP, convertScaledStringArrayToBody, convertScaledBigIntBodyToArray } = require("../docs/index.js");
const p = 21888242871839275222246405745257275088548364400416034343698204186575808495617n;

describe("calculateForceMain circuit", () => {
  let circuit;

  // sample inputs can have 0 and 0 for velocities since calculateForce doesn't involve velocity
  const sampleInputs = [
    //   {
    //   in_bodies: [
    //     ["32600000000", "6200000000", "-133000000", "-629000000", "10000000000"],
    //     ["26300000000", "15800000000", "-332000000", "-374000000", "7500000000"]
    //   ]
    // }, 
    {
      in_bodies: [
        ["36300000000", "65800000000", "0", "0", "7500000000"],
        ["67900000000", "50000000000", "0", "0", "5000000000"]
      ]
    },
    // {
    //   in_bodies: [
    //     ["22600000000", "4200000000", "0", "0", "10000000000"],
    //     ["36300000000", "65800000000", "0", "0", "7500000000"]
    //   ]
    // }
  ];
  const sanityCheck = true;

  before(async () => {
    circuit = await hre.circuitTest.setup("calculateForceMain");
  });

  it("produces a witness with valid constraints", async () => {
    const witness = await circuit.calculateWitness(sampleInputs[0], sanityCheck);
    await circuit.checkConstraints(witness);
  });

  it("has expected witness values", async () => {
    const witness = await circuit.calculateLabeledWitness(
      sampleInputs[0],
      sanityCheck
    );
    // console.log({ witness })

    // assert.propertyVal(witness, "main.squared", sampleInput.squared);
    // assert.propertyVal(witness, "main.calculatedRoot", sampleInput.calculatedRoot);
    // assert.propertyVal(witness, "main.calculatedSquared", (sampleInput.calculatedRoot ** 2).toString())
    // assert.propertyVal(witness, "main.out", "1");
  });

  it("has the correct output", async () => {

    for (let i = 0; i < sampleInputs.length; i++) {
      const sampleInput = sampleInputs[i]
      const bodies = sampleInput.in_bodies.map(convertScaledStringArrayToBody)
      const out_forces = calculateForceBigInt(bodies[0], bodies[1]).map(convertBigIntToModP)
      const expected = { out_forces: [out_forces[0].toString(), out_forces[1].toString()] };
      const witness = await circuit.calculateWitness(sampleInput, sanityCheck);
      await circuit.assertOut(witness, expected);
    }
  });
});
