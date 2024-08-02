// import hre from 'hardhat'
// import { assert } from 'chai';
// import { describe, it, before } from 'mocha';

import { Anybody } from '../../dist/module.js'
import { wasm as wasm_tester } from 'circom_tester'
import fs from 'fs'
import {
  /*_calculateTime,*/ _convertBigIntToModP
} from '../../src/calculations.js'

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

  it.skip('can check the differnce in speed calculating with witness vs anybody.js', async () => {
    const dir = circuit.dir
    // list contents of dir
    const files = fs.readdirSync(dir)
    console.log({ files })
    const suffixes = ['.r1cs', '.sym', '_js']
    for (let i = 0; i < suffixes.length; i++) {
      const suffix = suffixes[i]
      const file = dir + '/calculateForceMain' + suffix
      const isFile = suffix.indexOf('.') > -1
      const files = isFile
        ? fs.readFileSync(file, { encoding: 'utf8' })
        : fs.readdirSync(file)
      if (!isFile) {
        for (let j = 0; j < files.length; j++) {
          const file = dir + '/calculateForceMain' + suffix + '/' + files[j]
          const contents = fs.readFileSync(file, { encoding: 'utf8' })
          console.log({ file })
          console.log({ contents })
        }
      } else {
        console.log({ files })
      }
    }

    const pad = 1000
    let start = Date.now()
    for (let i = 0; i < sampleInputs.length * pad; i++) {
      const sampleInput = sampleInputs[i % sampleInputs.length]
      await circuit.calculateWitness(sampleInput)
    }
    let end = Date.now()
    let executionTimeA = end - start
    console.log(`Execution time: ${executionTimeA} milliseconds`)
    console.log(
      `Average witness execution time: ${executionTimeA / (sampleInputs.length * pad)} milliseconds`
    )

    const anybody = new Anybody(null, { util: true })
    start = Date.now()
    for (let i = 0; i < sampleInputs.length * pad; i++) {
      const sampleInput = sampleInputs[i % sampleInputs.length]
      let bodies = sampleInput.in_bodies.map((body) =>
        anybody.convertScaledStringArrayToBody.call(anybody, body)
      )
      anybody.calculateForceBigInt(bodies[0], bodies[1])
    }
    end = Date.now()
    let executionTimeB = end - start
    console.log(`Execution time: ${executionTimeB} milliseconds`)
    console.log(
      `Average calculation execution time: ${executionTimeB / (sampleInputs.length * pad)} milliseconds`
    )

    console.log(
      `calculation is ${executionTimeA / executionTimeB} times faster than witness genreation`
    )
  })

  it('has the correct output', async () => {
    for (let i = 0; i < sampleInputs.length; i++) {
      const sampleInput = sampleInputs[i]

      const anybody = new Anybody(null, { util: true })
      let bodies = sampleInput.in_bodies.map((body) =>
        anybody.convertScaledStringArrayToBody.call(anybody, body)
      )

      const out_forces = anybody
        .calculateForceBigInt(bodies[0], bodies[1])
        .map((v) => {
          if (v < 0n) {
            return [1, _convertBigIntToModP(v * -1n)].map((n) => n.toString())
          } else {
            return [0, _convertBigIntToModP(v)].map((n) => n.toString())
          }
        })
      const expected = { out_forces }
      const witness = await circuit.calculateWitness(sampleInput, sanityCheck)
      await circuit.assertOut(witness, expected)
    }
  })
})
