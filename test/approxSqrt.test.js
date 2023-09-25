const hre = require("hardhat");
const { assert } = require("chai");

describe("approxSqrt circuit", () => {
  let circuit;

  const sampleInput = {
    squared: "992744209590",
    calculatedRoot: "996366",
  };
  const sanityCheck = true;

  before(async () => {
    circuit = await hre.circuitTest.setup("approxSqrt");

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
    assert.propertyVal(witness, "main.squared", sampleInput.squared);
    assert.propertyVal(witness, "main.calculatedRoot", sampleInput.calculatedRoot);
    assert.propertyVal(witness, "main.calculatedSquared", (sampleInput.calculatedRoot ** 2).toString())
    assert.propertyVal(witness, "main.result", "1");
  });

  it("has the correct output", async () => {
    const expected = { result: 1 };
    const witness = await circuit.calculateWitness(sampleInput, sanityCheck);
    await circuit.assertOut(witness, expected);
  });
});
