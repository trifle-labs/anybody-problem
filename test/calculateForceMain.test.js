// import hre from 'hardhat'
// import { assert } from 'chai';
// import { describe, it, before } from 'mocha';

import { Anybody } from '../src/anybody.js'
import {wasm as wasm_tester } from "circom_tester";
import { /*_calculateTime,*/ _convertBigIntToModP } from '../src/calculations.js'

// const p = 21888242871839275222246405745257275088548364400416034343698204186575808495617n;

describe('calculateForceMain circuit', () => {
  let circuit
  // NOTE: velocities are offset by 10_000 to avoid negative numbers
  // sample inputs can have 0 and 0 for velocities since calculateForce doesn't involve velocity
  const sampleInputs = [
    {
      in_bodies: [
        ['326000', '62000', '8670', '3710', '100000'],
        ['263000', '158000', '6680', '6260', '75000']
      ]
    },
    {
      in_bodies: [
        ['363000', '658000', '10000', '10000', '75000'],
        ['679000', '500000', '10000', '10000', '50000']
      ]
    },
    {
      in_bodies: [
        ['226000', '42000', '10000', '10000', '100000'],
        ['363000', '658000', '10000', '10000', '75000']
      ]
    },
    {
      in_bodies: [
        ['226000', '42000', '8670', '3710', '100000'],
        ['363000', '658000', '6680', '13740', '75000']
      ]
    }
  ]
  const sanityCheck = true

  before(async () => {
    circuit = await wasm_tester('circuits/calculateForceMain.circom')
  })

  it('produces a witness with valid constraints', async () => {
    const witness = await circuit.calculateWitness(sampleInputs[0], sanityCheck)
    // get the number of inputs
    // const inputs =
      // sampleInputs[0].in_bodies.length * sampleInputs[0].in_bodies[0].length
    // const perStep = witness.length - inputs
    // const secRounded = _calculateTime(perStep)
    // console.log(`| calculateForce() | ${perStep} | ${secRounded} |`)
    await circuit.checkConstraints(witness)
  })

  it('has the correct output', async () => {
    for (let i = 0; i < sampleInputs.length; i++) {
      const sampleInput = sampleInputs[i]

      const anybody = new Anybody(null, { util: true })
      let bodies = sampleInput.in_bodies.map(
        anybody.convertScaledStringArrayToBody.bind(anybody)
      )

      const out_forces = anybody.calculateForceBigInt(bodies[0], bodies[1]).map(v => {
        if (v < 0n) {
          return [1, _convertBigIntToModP(v * -1n)].map(n => n.toString())
        } else {
          return [0, _convertBigIntToModP(v)].map(n => n.toString())
        }
      })
      const expected = { out_forces }
      const witness = await circuit.calculateWitness(sampleInput, sanityCheck)
      await circuit.assertOut(witness, expected)
    }
  })
})
