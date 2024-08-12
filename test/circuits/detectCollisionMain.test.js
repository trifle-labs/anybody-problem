// import hre from 'hardhat'
// import { assert } from 'chai';
// import { describe, it, before } from 'mocha';
import { wasm as wasm_tester } from 'circom_tester'
import { Anybody } from '../../dist/module.js'
// const modp = 21888242871839275222246405745257275088548364400416034343698204186575808495617n
describe('detectCollisionMain circuit', () => {
  let circuit

  const sampleInput = {
    bodies: [
      ['226000', '42000', '100000'],
      ['363000', '658000', '75000'],
      ['679000', '500000', '50000']
    ],
    missile: ['26000', '22000', '100000']
  }
  const jsSampleInput = JSON.parse(JSON.stringify(sampleInput))
  // make velocity 0 for all bodies and missiles for sake of test
  jsSampleInput.bodies[0].splice(2, 0, '20000', '20000')
  jsSampleInput.bodies[1].splice(2, 0, '20000', '20000')
  jsSampleInput.bodies[2].splice(2, 0, '20000', '20000')
  jsSampleInput.missile.splice(2, 0, '0', '0')

  const sanityCheck = true

  before(async () => {
    circuit = await wasm_tester('circuits/detectCollisionMain.circom')
  })

  it('produces a witness with valid constraints', async () => {
    const witness = await circuit.calculateWitness(sampleInput, sanityCheck)
    // const inputs =
    //   sampleInput.bodies.length * sampleInput.bodies[0].length +
    //   sampleInput.missile.length
    // const perStep = witness.length - inputs
    // const secRounded = calculateTime(perStep)
    // console.log(`| detectCollision(3) | ${perStep} | ${secRounded} |`)
    await circuit.checkConstraints(witness)
  })

  it('has the correct output', async () => {
    const anybody = new Anybody(null, { util: true })
    const bodiesBefore = []
    for (let i = 0; i < sampleInput.bodies.length; i++) {
      bodiesBefore.push(
        anybody.convertScaledStringArrayToBody.call(
          anybody,
          jsSampleInput.bodies[i]
        )
      )
    }
    const missiles = [
      anybody.convertScaledStringArrayToMissile.call(
        anybody,
        jsSampleInput.missile
      )
    ]

    // console.dir({ bodiesBefore, missiles }, { depth: null })
    const results = anybody.detectCollisionBigInt.call(
      anybody,
      bodiesBefore,
      missiles
    )
    // console.dir({ results }, { depth: null })
    let out_bodies = results.bodies.map((body) =>
      anybody.convertScaledBigIntBodyToArray.call(anybody, body)
    )
    out_bodies.forEach((b) => b.splice(2, 2))
    let out_missile = results.missiles.map((missile) =>
      anybody.convertScaledBigIntMissileToArray.call(anybody, missile)
    )[0]
    out_missile.splice(2, 2)
    // console.log({ out_bodies })
    // console.log({ out_missile })
    const expected = { out_bodies, out_missile }
    const witness = await circuit.calculateWitness(sampleInput, sanityCheck)
    await circuit.assertOut(witness, expected)
  })
})
