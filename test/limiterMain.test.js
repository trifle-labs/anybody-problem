const hre = require('hardhat')
// const { assert } = require('chai')
// const { describe, it, before } = require('mocha')

const { calculateTime } = require('../old/index.js')

describe('limiterMain circuit', () => {
  let circuit

  const sampleInputs = [
    {
      expectedResult: '400000000',
      sampleInput: {
        in: '1300000000',
        limit: '700000000',
        rather: '400000000'
      }
    },
    {
      expectedResult: '1300000000',
      sampleInput: {
        in: '1300000000',
        limit: '1300000001',
        rather: '400000000'
      }
    },
    {
      expectedResult: '1400000000',
      sampleInput: {
        in: '1300000000',
        limit: '700000000',
        rather: '1400000000'
      }
    }
  ]
  const sanityCheck = true

  before(async () => {
    circuit = await hre.circuitTest.setup('limiterMain')
  })

  it('produces a witness with valid constraints', async () => {
    const witness = await circuit.calculateWitness(sampleInputs[0].sampleInput, sanityCheck)
    const inputs = Object.keys(sampleInputs[0].sampleInput).length
    const perStep = witness.length - inputs
    const secRounded = calculateTime(perStep)
    console.log(`| limiter(252) | ${perStep} | ${secRounded}|`)
    await circuit.checkConstraints(witness)
  })

  it('has expected witness values', async () => {
    // const witness = await circuit.calculateLabeledWitness(
    //   sampleInputs[0].sampleInput,
    //   sanityCheck
    // )
    // assert.propertyVal(witness, "main.x1", sampleInput.x1);
    // assert.propertyVal(witness, "main.x2", sampleInput.x2);
    // assert.propertyVal(witness, "main.x3", sampleInput.x3);
    // assert.propertyVal(witness, "main.x4", sampleInput.x4);
    // assert.propertyVal(witness, "main.y1", undefined);
    // assert.propertyVal(witness, "main.y2", undefined);
    // assert.propertyVal(witness, "main.out", "3");
  })

  it('has the correct output', async () => {
    for (let i = 0; i < sampleInputs.length; i++) {
      const expected = { out: sampleInputs[i].expectedResult }
      const witness = await circuit.calculateWitness(sampleInputs[i].sampleInput, sanityCheck)
      await circuit.assertOut(witness, expected)
    }
  })
})
