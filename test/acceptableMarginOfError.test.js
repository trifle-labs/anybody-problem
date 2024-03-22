// import hre from 'hardhat'
// import { assert } from 'chai'
// import { _calculateTime } from '../src/calculations.js'
import {wasm as wasm_tester } from "circom_tester";

describe('acceptableMarginOfError circuit', () => {
  let circuit

  const sampleInput = {
    expected: '992744209590',
    actual: '992745205956',
    marginOfError: '1992732'
  }
  const sanityCheck = true

  before(async () => {
    circuit = await wasm_tester('circuits/acceptableMarginOfError.circom')
  })

  it('produces a witness with valid constraints', async () => {
    const witness = await circuit.calculateWitness(sampleInput, sanityCheck)
    // get the number of inputs
    // const inputs = Object.keys(sampleInput).length
    // const perStep = witness.length - inputs
    // const secRounded = _calculateTime(perStep)
    // console.log(`| acceptableMarginOfError(60) | ${perStep} | ${secRounded} |`)
    await circuit.checkConstraints(witness)
  })


  it('has the correct output', async () => {
    const expected = { out: 1 }
    const witness = await circuit.calculateWitness(sampleInput, sanityCheck)
    await circuit.assertOut(witness, expected)
  })
})
