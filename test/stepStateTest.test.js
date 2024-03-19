// const hre = require('hardhat')
// const path = require('path')
// const fs = require('fs')
// import fs from 'fs'
// import path from 'path'
// const {
//   calculateTime,
//   runComputationBigInt,
//   convertScaledStringArrayToBody,
//   convertScaledBigIntBodyToArray,
// } = require('../docs/index.cjs')

import hre from "hardhat";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

// import { assert } from 'chai';
// import { describe, it, before } from 'mocha';

import index from "../docs/index.cjs";
import { writeFileSync } from "fs";
const {
  calculateTime,
  // detectCollisionBigInt,
  runComputationBigInt,
  convertScaledStringArrayToBody,
  convertScaledBigIntBodyToArray,
} = index;
// const p = 21888242871839275222246405745257275088548364400416034343698204186575808495617n
const totalSteps = 20; //487
// const { describe, it, before } = require('mocha')

describe("stepStateTest circuit", () => {
  let circuit;

  const missiles = new Array(totalSteps + 1)
    .fill(0)
    .map(() => new Array(5).fill("0"));
  missiles[0] = ["226000", "42000", "10000", "10000", "100000"];
  const sampleInput = {
    bodies: [
      ["226000", "42000", "8670", "3710", "100000"],
      ["363000", "658000", "6680", "13740", "75000"],
      ["679000", "500000", "12290", "12520", "50000"],
    ],

    // NOTE: need to have array of 2 when step = 1 because missiles need to be n + 1
    missiles,
  };

  // write sampleInput to circuits/stepStateTest.json
  writeFileSync(
    join(__dirname, "../circuits/stepStateTest.json"),
    JSON.stringify(sampleInput, null, 2),
  );
  // console.dir({ sampleInput }, { depth: null })

  const sanityCheck = true;

  before(async () => {
    circuit = await hre.circuitTest.setup("stepStateTest");
  });

  const steps = sampleInput.missiles.length - 1;

  it("produces a witness with valid constraints", async () => {
    const witness = await circuit.calculateWitness(sampleInput, sanityCheck);
    const inputs =
      sampleInput.bodies.length * sampleInput.bodies[0].length +
      sampleInput.missiles.length * sampleInput.missiles[0].length;
    const perStep = witness.length - inputs;
    const secRounded = calculateTime(perStep, steps);
    console.log(`| stepState(3, ${steps}) | ${perStep} | ${secRounded} |`);
    await circuit.checkConstraints(witness);
  });

  it.skip("has expected witness values", async () => {
    const witness = await circuit.calculateLabeledWitness(
      sampleInput,
      sanityCheck,
    );
    console.dir({ witness: witness._labels }, { depth: null });

    // assert.propertyVal(witness, "main.squared", sampleInput.squared);
    // assert.propertyVal(witness, "main.calculatedRoot", sampleInput.calculatedRoot);
    // assert.propertyVal(witness, "main.calculatedSquared", (sampleInput.calculatedRoot ** 2).toString())
    // assert.propertyVal(witness, "main.out", "1");
  });

  it.skip("has the correct output", async () => {
    let bodies = sampleInput.bodies.map(convertScaledStringArrayToBody);
    let missiles = sampleInput.missiles.map(convertScaledStringArrayToBody);
    // console.dir({ bodies }, { depth: null })
    // console.dir({ missiles }, { depth: null })

    for (let i = 0; i < steps; i++) {
      // console.dir({ 'bodies[0]': bodies[0] }, { depth: null })
      const results = runComputationBigInt(bodies, missiles);
      bodies = results.bodies;
      missiles = results.missiles;
    }
    const out_bodies = bodies.map(convertScaledBigIntBodyToArray);
    const expected = { out_bodies };
    const witness = await circuit.calculateWitness(sampleInput, sanityCheck);
    await circuit.assertOut(witness, expected);
  });
});
