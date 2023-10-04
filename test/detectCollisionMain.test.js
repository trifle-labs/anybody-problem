const hre = require("hardhat");
const { assert } = require("chai");
const { calculateForce, sqrtApprox, scalingFactor, detectCollision } = require("../docs/index.js");
const modp = 21888242871839275222246405745257275088548364400416034343698204186575808495617n;
const p5 = require('node-p5');
describe("detectCollisionMain circuit", () => {
  let circuit, p

  const sampleInput = {
    "bodies": [
      ["22600000000", "4200000000", "-133000000", "-629000000", "10000000000"],
      ["36300000000", "65800000000", "-332000000", "374000000", "7500000000"],
      ["67900000000", "50000000000", "229000000", "252000000", "5000000000"]
    ],
    "missile": ["22600000000", "4200000000", "0", "0", "10000000000"]
  };
  const sanityCheck = true;

  before(async () => {
    console.log(hre.circom)
    circuit = await hre.circuitTest.setup("detectCollisionMain");
    function sketch(pp) {
      p = pp
      pp.setup = async () => { pp.noLoop() }
      pp.draw = () => { }
    }
    p5.createSketch(sketch)
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
        x: parseFloat(sampleInput.bodies[0][0]) / (parseFloat(scalingFactor)),
        y: parseFloat(sampleInput.bodies[0][1]) / (parseFloat(scalingFactor))
      },
      velocity: {
        x: parseFloat(sampleInput.bodies[0][2]) / (parseFloat(scalingFactor)),
        y: parseFloat(sampleInput.bodies[0][3]) / (parseFloat(scalingFactor))
      },
      radius: parseFloat(sampleInput.bodies[0][4]) / (parseFloat(scalingFactor))
    }
    const body2 = {
      position: {
        x: parseFloat(sampleInput.bodies[1][0]) / (parseFloat(scalingFactor)),
        y: parseFloat(sampleInput.bodies[1][1]) / (parseFloat(scalingFactor))
      },
      velocity: {
        x: parseFloat(sampleInput.bodies[1][2]) / (parseFloat(scalingFactor)),
        y: parseFloat(sampleInput.bodies[1][3]) / (parseFloat(scalingFactor))
      },
      radius: parseFloat(sampleInput.bodies[1][4]) / (parseFloat(scalingFactor))
    }
    const body3 = {
      position: {
        x: parseFloat(sampleInput.bodies[2][0]) / (parseFloat(scalingFactor)),
        y: parseFloat(sampleInput.bodies[2][1]) / (parseFloat(scalingFactor))
      },
      velocity: {
        x: parseFloat(sampleInput.bodies[2][2]) / (parseFloat(scalingFactor)),
        y: parseFloat(sampleInput.bodies[2][3]) / (parseFloat(scalingFactor))
      },
      radius: parseFloat(sampleInput.bodies[2][4]) / (parseFloat(scalingFactor))
    }
    const bodiesBefore = [{ body: body1 }, { body: body2 }, { body: body3 }]

    const missiles = [{
      position: p.createVector(parseFloat(BigInt(sampleInput.missile[0]) / scalingFactor), parseFloat(BigInt(sampleInput.missile[1]) / scalingFactor)),
      velocity: p.createVector(parseFloat(BigInt(sampleInput.missile[2]) / scalingFactor), parseFloat(BigInt(sampleInput.missile[3]) / scalingFactor)),
      radius: parseFloat(BigInt(sampleInput.missile[4]) / scalingFactor)
    }]
    let out_bodies = bodiesBefore;
    // NOTE: 10 is number in detectCollisionMain.circom
    const results = detectCollision(out_bodies, missiles, p)
    out_bodies = results.bodies
    out_bodies = out_bodies.map(body => {
      const b = body.body
      const bodyArray = []
      b.position.x = BigInt(Math.floor(b.position.x * parseInt(scalingFactor))) % modp
      b.position.y = BigInt(Math.floor(b.position.y * parseInt(scalingFactor))) % modp
      b.velocity.x = BigInt(Math.floor(b.velocity.x * parseInt(scalingFactor))) % modp
      while (b.velocity.x < 0n) {
        b.velocity.x += modp
      }
      b.velocity.y = BigInt(Math.floor(b.velocity.y * parseInt(scalingFactor))) % modp
      while (b.velocity.y < 0n) {
        b.velocity.y += modp
      }
      b.radius = BigInt(b.radius * parseInt(scalingFactor))
      bodyArray.push(b.position.x, b.position.y, b.velocity.x, b.velocity.y, b.radius)
      return bodyArray.map(b => b.toString())
    })
    console.log({ out_bodies })
    const expected = { out_bodies };
    const witness = await circuit.calculateWitness(sampleInput, sanityCheck);
    await circuit.assertOut(witness, expected);
  });
});
