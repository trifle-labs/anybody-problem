const hre = require("hardhat");
const { assert } = require("chai");
const { calculateForce, sqrtApprox, scalingFactor } = require("../p5/index.js");
const p = 21888242871839275222246405745257275088548364400416034343698204186575808495617n;

describe("calculateForce circuit", () => {
  let circuit;

  const sampleInput = {
    in_bodies: [
      ["82600000000", "4200000000", "-133000000", "-629000000", "10000000000"],
      ["36300000000", "65800000000", "-332000000", "374000000", "7500000000"]
    ]
  };
  const sanityCheck = true;

  before(async () => {
    circuit = await hre.circuitTest.setup("calculateForce");

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
    console.log({ witness })
    // assert.propertyVal(witness, "main.squared", sampleInput.squared);
    // assert.propertyVal(witness, "main.calculatedRoot", sampleInput.calculatedRoot);
    // assert.propertyVal(witness, "main.calculatedSquared", (sampleInput.calculatedRoot ** 2).toString())
    // assert.propertyVal(witness, "main.result", "1");
  });

  it("has the correct output", async () => {
    const body1 = {
      position: {
        x: parseInt(BigInt(sampleInput.in_bodies[0][0]) / scalingFactor),
        y: parseInt(BigInt(sampleInput.in_bodies[0][1]) / scalingFactor)
      },
      radius: parseInt(BigInt(sampleInput.in_bodies[0][4]) / scalingFactor)
    }
    const body2 = {
      position: {
        x: parseInt(BigInt(sampleInput.in_bodies[1][0]) / scalingFactor),
        y: parseInt(BigInt(sampleInput.in_bodies[1][1]) / scalingFactor)
      },
      radius: parseInt(BigInt(sampleInput.in_bodies[1][4]) / scalingFactor)
    }
    const out_forces = calculateForce(body1, body2).map(v => BigInt(v * parseInt(scalingFactor)))

    while (out_forces[0] < 0n) {
      out_forces[0] += p
    }
    while (out_forces[1] < 0n) {
      out_forces[1] += p
    }
    console.log({ out_forces })
    const expected = { out_forces: [out_forces[0].toString(), out_forces[1].toString()] };
    const witness = await circuit.calculateWitness(sampleInput, sanityCheck);
    await circuit.assertOut(witness, expected);
  });
});
