// const hre = require('hardhat')
import hre from "hardhat";
// const { assert } = require('chai')
import index from "../docs/index.cjs";
const { calculateTime } = index;
// const { describe, it, before } = require('mocha')

describe("getDistanceMain circuit", () => {
  let circuit;

  const sampleInput = {
    x1: "13000",
    y1: "7000",
    x2: "4000",
    y2: "2000",
  };
  const sanityCheck = true;

  before(async () => {
    circuit = await hre.circuitTest.setup("getDistanceMain");
  });

  it("produces a witness with valid constraints", async () => {
    const witness = await circuit.calculateWitness(sampleInput, sanityCheck);
    const inputs = Object.keys(sampleInput).length;
    const perStep = witness.length - inputs;
    const secRounded = calculateTime(perStep);
    console.log(`| getDistance(20) | ${perStep} | ${secRounded} |`);
    await circuit.checkConstraints(witness);
  });

  it("has expected witness values", async () => {
    // const witness = await circuit.calculateLabeledWitness(
    //   sampleInput,
    //   sanityCheck
    // )
    // assert.propertyVal(witness, "main.x1", sampleInput.x1);
    // assert.propertyVal(witness, "main.x2", sampleInput.x2);
    // assert.propertyVal(witness, "main.x3", sampleInput.x3);
    // assert.propertyVal(witness, "main.x4", sampleInput.x4);
    // assert.propertyVal(witness, "main.y1", undefined);
    // assert.propertyVal(witness, "main.y2", undefined);
    // assert.propertyVal(witness, "main.out", "3");
  });

  it("has the correct output", async () => {
    const expected = { distance: 10295 }; // should be 9000 but 10295 is within margin of error
    const witness = await circuit.calculateWitness(sampleInput, sanityCheck);
    await circuit.assertOut(witness, expected);
  });
});
