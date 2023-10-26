const hre = require("hardhat");
const { assert } = require("chai");
const {
  calculateTime,
  detectCollisionBigInt,
  convertScaledStringArrayToBody,
  convertScaledBigIntBodyToArray
} = require("../docs/index.js");
const modp = 21888242871839275222246405745257275088548364400416034343698204186575808495617n;
describe("detectCollisionMain circuit", () => {
  let circuit, p

  const sampleInput = {
    "bodies": [
      ["226000", "42000", "100000"],
      ["363000", "658000", "75000"],
      ["679000", "500000", "50000"]
    ],
    "missile": ["226000", "42000", "100000"]
  };
  const jsSampleInput = JSON.parse(JSON.stringify(sampleInput))
  jsSampleInput.bodies[0].splice(2, 0, "9999", "3710")
  jsSampleInput.bodies[1].splice(2, 0, "6680", "13740")
  jsSampleInput.bodies[2].splice(2, 0, "12290", "12520")
  jsSampleInput.missile.splice(2, 0, "10000", "10000")

  const sanityCheck = true;

  before(async () => {
    circuit = await hre.circuitTest.setup("detectCollisionMain");
  });

  it("produces a witness with valid constraints", async () => {
    const witness = await circuit.calculateWitness(sampleInput, sanityCheck);
    const inputs = sampleInput.bodies.length * sampleInput.bodies[0].length + sampleInput.missile.length
    const perStep = witness.length - inputs
    const secRounded = calculateTime(perStep)
    console.log(`| detectCollision(3) | ${perStep} | ${secRounded} |`)
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
      bodiesBefore.push(convertScaledStringArrayToBody(jsSampleInput.bodies[i]))
    }
    const missiles = [convertScaledStringArrayToBody(jsSampleInput.missile)]
    // console.dir({ bodiesBefore, missiles }, { depth: null })
    const results = detectCollisionBigInt(bodiesBefore, missiles)
    // console.log({ results })
    let out_bodies = results.bodies.map(convertScaledBigIntBodyToArray)
    out_bodies.forEach(b => b.splice(2, 2))
    let out_missile = results.missiles.map(convertScaledBigIntBodyToArray)[0]
    out_missile.splice(2, 2)
    // console.log({ out_bodies })
    // console.log({ out_missile })
    const expected = { out_bodies, out_missile };
    const witness = await circuit.calculateWitness(sampleInput, sanityCheck);
    await circuit.assertOut(witness, expected);
  });
});
