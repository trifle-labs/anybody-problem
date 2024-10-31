// import hre from 'hardhat'

import { wasm as wasm_tester } from 'circom_tester'
import { describe, it, before } from 'mocha'

describe('lowerLimiterMain circuit', () => {
  let circuit

  const sampleInputs = [
    {
      expectedResult: '1300000000',
      sampleInput: {
        in: '1300000000',
        limit: '700000000',
        rather: '400000000'
      }
    },
    {
      expectedResult: '400000000',
      sampleInput: {
        in: '1300000000',
        limit: '1300000001',
        rather: '400000000'
      }
    },
    {
      expectedResult: '1400000000',
      sampleInput: {
        in: '600000000',
        limit: '700000000',
        rather: '1400000000'
      }
    }
  ]
  const sanityCheck = true

  before(async () => {
    circuit = await wasm_tester('circuits/lowerLimiterMain.circom')
  })

  it('produces a witness with valid constraints', async () => {
    const witness = await circuit.calculateWitness(
      sampleInputs[0].sampleInput,
      sanityCheck
    )
    // const inputs = Object.keys(sampleInputs[0].sampleInput).length
    // const perStep = witness.length - inputs
    // const secRounded = calculateTime(perStep)
    // console.log(`| lowerLimiter(252) | ${perStep} | ${secRounded}|`)
    await circuit.checkConstraints(witness)
  })

  it('has the correct output', async () => {
    for (let i = 0; i < sampleInputs.length; i++) {
      const expected = { out: sampleInputs[i].expectedResult }
      const witness = await circuit.calculateWitness(
        sampleInputs[i].sampleInput,
        sanityCheck
      )
      await circuit.assertOut(witness, expected)
    }
  })
})
