const hre = require("hardhat");
const { assert } = require("chai");

describe("acceptableErrorOfMargin circuit", () => {
  let circuit;

  const sampleInput = {
    val1: "992744209590",
    val2: "992745205956",
    marginOfError: "1992732"
  };
  const sanityCheck = true;

  before(async () => {
    circuit = await hre.circuitTest.setup("acceptableErrorOfMargin");

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
    assert.propertyVal(witness, "main.val1", sampleInput.val1);
    assert.propertyVal(witness, "main.val2", sampleInput.val2);
    assert.propertyVal(witness, "main.marginOfError", sampleInput.marginOfError);
    assert.propertyVal(witness, "main.out", "1");
  });

  it("has the correct output", async () => {
    const expected = { out: 1 };
    const witness = await circuit.calculateWitness(sampleInput, sanityCheck);
    await circuit.assertOut(witness, expected);
  });
});
