const hre = require("hardhat");
const { assert } = require("chai");

describe("absoluteValueSubtraction circuit", () => {
  let circuit;

  const sampleInput = [
    {
      in: { in: ["13", "3"] },
      out: { out: "10" }
    },
    {
      in: { in: ["3", "13"] },
      out: { out: "10" }
    }
  ]
  const sanityCheck = true;

  before(async () => {
    circuit = await hre.circuitTest.setup("absoluteValueSubtraction");
  });

  it("produces a witness with valid constraints", async () => {
    const witness = await circuit.calculateWitness(sampleInput[0].in, sanityCheck);
    await circuit.checkConstraints(witness);
  });

  it("has expected witness values", async () => {
    const witness = await circuit.calculateLabeledWitness(
      sampleInput[0].in,
      sanityCheck
    );
    // assert.propertyVal(witness, "main.x1", sampleInput.x1);
    // assert.propertyVal(witness, "main.x2", sampleInput.x2);
    // assert.propertyVal(witness, "main.x3", sampleInput.x3);
    // assert.propertyVal(witness, "main.x4", sampleInput.x4);
    // assert.propertyVal(witness, "main.y1", undefined);
    // assert.propertyVal(witness, "main.y2", undefined);
    // assert.propertyVal(witness, "main.out", "3");
  });

  it("has the correct output", async () => {
    for (let i = 0; i < sampleInput.length; i++) {
      const expected = sampleInput[i].out;
      const witness = await circuit.calculateWitness(sampleInput[i].in, sanityCheck);
      await circuit.assertOut(witness, expected);
    }
  });
});
