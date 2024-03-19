import hre from "hardhat";
import { assert } from "chai";
import { _calculateTime } from "../src/calculations.js";
// const { describe, it, before } = require('mocha')

describe("acceptableMarginOfError circuit", () => {
  let circuit;

  const sampleInput = {
    expected: "992744209590",
    actual: "992745205956",
    marginOfError: "1992732",
  };
  const sanityCheck = true;

  before(async () => {
    console.log("before 2)");
    circuit = await hre.circuitTest.setup("acceptableMarginOfError");
  });

  it("produces a witness with valid constraints", async () => {
    console.log("before 3");
    const witness = await circuit.calculateWitness(sampleInput, sanityCheck);
    // get the number of inputs
    const inputs = Object.keys(sampleInput).length;
    const perStep = witness.length - inputs;
    const secRounded = _calculateTime(perStep);
    console.log(`| acceptableMarginOfError(60) | ${perStep} | ${secRounded} |`);
    await circuit.checkConstraints(witness);
  });

  it("has expected witness values", async () => {
    const witness = await circuit.calculateLabeledWitness(
      sampleInput,
      sanityCheck,
    );
    assert.propertyVal(witness, "main.expected", sampleInput.expected);
    assert.propertyVal(witness, "main.actual", sampleInput.actual);
    assert.propertyVal(
      witness,
      "main.marginOfError",
      sampleInput.marginOfError,
    );
    assert.propertyVal(witness, "main.out", "1");
  });

  it("has the correct output", async () => {
    const expected = { out: 1 };
    const witness = await circuit.calculateWitness(sampleInput, sanityCheck);
    await circuit.assertOut(witness, expected);
  });
});
