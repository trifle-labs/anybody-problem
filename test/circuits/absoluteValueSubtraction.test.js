// import hre from 'hardhat'
// import { _calculateTime } from '../src/calculations.js'
import { describe, it, before } from 'mocha'

import { wasm as wasm_tester } from 'circom_tester'

describe('absoluteValueSubtraction circuit', () => {
  let circuit

  const sampleInput = [
    {
      in: { in: ['13', '3'] },
      out: { out: '10' }
    },
    {
      in: { in: ['3', '13'] },
      out: { out: '10' }
    }
  ]
  const sanityCheck = true

  before(async () => {
    circuit = await wasm_tester('circuits/absoluteValueSubtraction.circom')
  })

  it('produces a witness with valid constraints', async () => {
    const witness = await circuit.calculateWitness(
      sampleInput[0].in,
      sanityCheck
    )
    // const inputs = sampleInput[0].in.in.length
    // const perStep = witness.length - inputs
    // const secRounded = _calculateTime(perStep)
    // console.log(`| absoluteValueSubtraction(252) | ${perStep} | ${secRounded} |`)
    await circuit.checkConstraints(witness)
  })

  it('has the correct output', async () => {
    for (let i = 0; i < sampleInput.length; i++) {
      const expected = sampleInput[i].out
      const witness = await circuit.calculateWitness(
        sampleInput[i].in,
        sanityCheck
      )
      await circuit.assertOut(witness, expected)
    }
  })
})
