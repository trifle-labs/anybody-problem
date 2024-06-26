// import hre from 'hardhat'

import { wasm as wasm_tester } from 'circom_tester'

import { Anybody } from '../../src/anybody.js'

// const p = 21888242871839275222246405745257275088548364400416034343698204186575808495617n

describe('forceAccumulatorMain circuit', () => {
  let circuit

  const sampleInput = {
    bodies: [
      ['226000', '42000', '8670', '3710', '100000'],
      ['363000', '658000', '6680', '13740', '75000'],
      ['679000', '500000', '12290', '12520', '50000']
    ]
  }
  const sanityCheck = true

  before(async () => {
    circuit = await wasm_tester('circuits/forceAccumulatorMain.circom')
  })

  it('produces a witness with valid constraints', async () => {
    const witness = await circuit.calculateWitness(sampleInput, sanityCheck)
    // const inputs = sampleInput.bodies.length * sampleInput.bodies[0].length
    // const perStep = witness.length - inputs
    // const secRounded = calculateTime(perStep)
    // console.log(`| forceAccumulator(3) | ${perStep} | ${secRounded} |`)
    await circuit.checkConstraints(witness)
  })

  it('has the correct output', async () => {
    const anybody = new Anybody(null, { util: true })
    const bodies = sampleInput.bodies.map(
      anybody.convertScaledStringArrayToBody.bind(anybody)
    )
    // console.dir({ bodies }, { depth: null })

    const out_bodies = anybody
      .forceAccumulatorBigInts(bodies)
      .map(anybody.convertScaledBigIntBodyToArray.bind(anybody))
    // console.log({ out_bodies })
    const expected = { out_bodies }
    const witness = await circuit.calculateWitness(sampleInput, sanityCheck)
    await circuit.assertOut(witness, expected)
  })
})
