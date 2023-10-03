const hre = require("hardhat");
const { assert } = require("chai");
const { calculateForce, sqrtApprox, scalingFactor, runComputation } = require("../docs/index.js");
const modp = 21888242871839275222246405745257275088548364400416034343698204186575808495617n;
const p5 = require('node-p5');
describe("stepStateMain circuit", () => {
  let circuit;

  const sampleInput = {
    bodies: [
      ["22600000000", "4200000000", "-133000000", "-629000000", "10000000000"],
      ["36300000000", "65800000000", "-332000000", "374000000", "7500000000"],
      ["67900000000", "50000000000", "229000000", "252000000", "5000000000"]
    ],
    missiles: [
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      // [0, 0, 0, 0, 0],
      // [0, 0, 0, 0, 0],
      // [0, 0, 0, 0, 0],
      // [0, 0, 0, 0, 0],
      // [0, 0, 0, 0, 0],
      // [0, 0, 0, 0, 0],
      // [0, 0, 0, 0, 0],
      // [0, 0, 0, 0, 0],
      // [0, 0, 0, 0, 0],
    ]
  };
  const sanityCheck = true;

  before(async () => {
    circuit = await hre.circuitTest.setup("stepStateMain");
    console.log({ circuit })
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
    const body1 = {
      position: {
        x: parseInt(BigInt(sampleInput.bodies[0][0]) / scalingFactor),
        y: parseInt(BigInt(sampleInput.bodies[0][1]) / scalingFactor)
      },
      velocity: {
        x: 0, y: 0
      },
      radius: parseInt(BigInt(sampleInput.bodies[0][4]) / scalingFactor)
    }
    const body2 = {
      position: {
        x: parseInt(BigInt(sampleInput.bodies[1][0]) / scalingFactor),
        y: parseInt(BigInt(sampleInput.bodies[1][1]) / scalingFactor)
      },
      velocity: {
        x: 0, y: 0
      },
      radius: parseInt(BigInt(sampleInput.bodies[1][4]) / scalingFactor)
    }

    const body3 = {
      position: {
        x: parseInt(BigInt(sampleInput.bodies[2][0]) / scalingFactor),
        y: parseInt(BigInt(sampleInput.bodies[2][1]) / scalingFactor)
      },
      velocity: {
        x: 0, y: 0
      },
      radius: parseInt(BigInt(sampleInput.bodies[2][4]) / scalingFactor)
    }
    const bodiesBefore = [body1, body2, body3]
    let out_bodies = bodiesBefore;
    // NOTE: 10 is number in stepStateMain.circom
    for (let i = 0; i < 10; i++) {
      out_bodies = runComputation(out_bodies, p5).map(b => {
        const bodyArray = []
        b.position.x = BigInt(Math.floor(b.position.x * parseInt(scalingFactor)))
        b.position.y = BigInt(Math.floor(b.position.y * parseInt(scalingFactor)))
        b.velocity.x = BigInt(Math.floor(b.velocity.x * parseInt(scalingFactor)))
        while (b.velocity.x < 0n) {
          b.velocity.x += modp
        }
        b.velocity.y = BigInt(Math.floor(b.velocity.y * parseInt(scalingFactor)))
        while (b.velocity.y < 0n) {
          b.velocity.y += modp
        }
        b.radius = BigInt(b.radius * parseInt(scalingFactor))
        bodyArray.push(b.position.x, b.position.y, b.velocity.x, b.velocity.y, b.radius)
        return bodyArray.map(b => b.toString())
      })
    }
    console.log({ out_bodies })
    const expected = { out_bodies };
    const witness = await circuit.calculateWitness(sampleInput, sanityCheck);
    await circuit.assertOut(witness, expected);
  });
});
