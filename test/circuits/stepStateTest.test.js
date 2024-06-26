// import hre from 'hardhat'
import { wasm as wasm_tester } from 'circom_tester'
import { Anybody } from '../../src/anybody.js'
// const p = 21888242871839275222246405745257275088548364400416034343698204186575808495617n

import { expect } from 'chai'

describe('stepStateTest circuit', () => {
  let circuit

  const totalSteps = 20
  const missileStep = 0
  const sampleInputBodies = [
    ['126000', '32000', '22000', '12000', '8000'],
    ['226000', '42000', '21000', '11000', '7000']
  ]
  // NOTE: need to have array of length totalSteps + 1 because missiles need to be
  // 1 more than actual number of steps

  const sampleInputMissiles = new Array(totalSteps + 1).fill(0).map(() => {
    const m = new Array(5).fill('0')
    m[2] = '20000'
    m[3] = '20000'
    return m
  })

  const k = sampleInputBodies.length - 1

  const inflightMissile = [
    sampleInputBodies[k][0],
    sampleInputBodies[k][1],
    sampleInputBodies[k][2],
    sampleInputBodies[k][3],
    sampleInputBodies[k][4]
  ]
  sampleInputMissiles[missileStep] = inflightMissile

  // move position of missile by velocity of body, the number of missileSteps
  sampleInputMissiles[missileStep][0] = (
    parseInt(sampleInputMissiles[missileStep][0]) +
    (parseInt(sampleInputBodies[k][2]) - 20000) * missileStep
  ).toString()
  sampleInputMissiles[missileStep][1] = (
    parseInt(sampleInputMissiles[missileStep][1]) +
    (parseInt(sampleInputBodies[k][3]) - 20000) * missileStep
  ).toString()

  // set radius of missile
  sampleInputMissiles[missileStep][4] = '10000'

  const sampleInput = {
    address: '0xFa398d672936Dcf428116F687244034961545D91',
    bodies: sampleInputBodies,
    missiles: sampleInputMissiles.map((m) =>
      m.length == 5 ? [m[2], m[3], m[4]] : m
    ),
    inflightMissile: sampleInputMissiles[0]
  }

  // console.dir({ sampleInput }, { depth: null })

  const sanityCheck = true
  const steps = sampleInput.missiles.length - 1
  const bodies = sampleInput.bodies.length

  const checkSampleInput = {
    bodies: [
      ['160320', '282650', '31655', '21164', '36000'],
      ['519382', '747824', '12536', '30094', '7000']
    ],
    missiles: [
      ['31838', '3880', '10'],
      ['20000', '20000', '0'],
      ['20000', '20000', '0'],
      ['20000', '20000', '0'],
      ['20000', '20000', '0'],
      ['20000', '20000', '0'],
      ['20000', '20000', '0'],
      ['20000', '20000', '0'],
      ['20000', '20000', '0'],
      ['20000', '20000', '0'],
      ['20000', '20000', '0'],
      ['20000', '20000', '0'],
      ['20000', '20000', '0'],
      ['20000', '20000', '0'],
      ['20000', '20000', '0'],
      ['20000', '20000', '0'],
      ['20000', '20000', '0'],
      ['20000', '20000', '0'],
      ['20000', '20000', '0'],
      ['20000', '20000', '0'],
      ['20000', '20000', '0'],
      ['20000', '20000', '0'],
      ['20000', '20000', '0'],
      ['20000', '20000', '0'],
      ['20000', '20000', '0'],
      ['20000', '20000', '0'],
      ['20000', '20000', '0'],
      ['20000', '20000', '0'],
      ['20000', '20000', '0'],
      ['20000', '20000', '0'],
      ['20000', '20000', '0'],
      ['20000', '20000', '0'],
      ['20000', '20000', '0'],
      ['20000', '20000', '0'],
      ['20000', '20000', '0'],
      ['20000', '20000', '0'],
      ['20000', '20000', '0'],
      ['20000', '20000', '0'],
      ['20000', '20000', '0'],
      ['20000', '20000', '0'],
      ['20000', '20000', '0'],
      ['20000', '20000', '0'],
      ['20000', '20000', '0'],
      ['20000', '20000', '0'],
      ['20000', '20000', '0'],
      ['20000', '20000', '0'],
      ['20000', '20000', '0'],
      ['20000', '20000', '0'],
      ['20000', '20000', '0'],
      ['20000', '20000', '0'],
      ['20000', '20000', '0'],
      ['20000', '20000', '0'],
      ['20000', '20000', '0'],
      ['20000', '20000', '0'],
      ['20000', '20000', '0'],
      ['20000', '20000', '0'],
      ['20000', '20000', '0'],
      ['31838', '3880', '10'],
      ['20000', '20000', '0'],
      ['20000', '20000', '0'],
      ['20000', '20000', '0'],
      ['31838', '3880', '10'],
      ['20000', '20000', '0'],
      ['20000', '20000', '0'],
      ['20000', '20000', '0'],
      ['20000', '20000', '0'],
      ['31838', '3880', '10'],
      ['20000', '20000', '0'],
      ['20000', '20000', '0'],
      ['20000', '20000', '0'],
      ['31838', '3880', '10'],
      ['20000', '20000', '0'],
      ['20000', '20000', '0'],
      ['20000', '20000', '0'],
      ['20000', '20000', '0'],
      ['31838', '3880', '10'],
      ['20000', '20000', '0'],
      ['20000', '20000', '0'],
      ['20000', '20000', '0'],
      ['31838', '3880', '10'],
      ['20000', '20000', '0'],
      ['20000', '20000', '0'],
      ['20000', '20000', '0'],
      ['20000', '20000', '0'],
      ['31838', '3880', '10'],
      ['20000', '20000', '0'],
      ['20000', '20000', '0'],
      ['20000', '20000', '0'],
      ['20000', '20000', '0'],
      ['31838', '3880', '10'],
      ['20000', '20000', '0'],
      ['20000', '20000', '0'],
      ['20000', '20000', '0'],
      ['20000', '20000', '0'],
      ['20000', '20000', '0'],
      ['20000', '20000', '0'],
      ['31838', '3880', '10'],
      ['20000', '20000', '0'],
      ['20000', '20000', '0'],
      ['20000', '20000', '0'],
      ['20000', '20000', '0'],
      ['31838', '3880', '10'],
      ['20000', '20000', '0'],
      ['20000', '20000', '0'],
      ['20000', '20000', '0'],
      ['31838', '3880', '10'],
      ['20000', '20000', '0'],
      ['20000', '20000', '0'],
      ['20000', '20000', '0'],
      ['20000', '20000', '0'],
      ['31838', '3880', '10'],
      ['20000', '20000', '0'],
      ['20000', '20000', '0'],
      ['20000', '20000', '0'],
      ['31838', '3880', '10'],
      ['20000', '20000', '0'],
      ['20000', '20000', '0'],
      ['20000', '20000', '0'],
      ['20000', '20000', '0'],
      ['31838', '3880', '10'],
      ['20000', '20000', '0'],
      ['20000', '20000', '0'],
      ['20000', '20000', '0'],
      ['20000', '20000', '0'],
      ['31838', '3880', '10'],
      ['20000', '20000', '0'],
      ['20000', '20000', '0'],
      ['20000', '20000', '0'],
      ['20000', '20000', '0'],
      ['31838', '3880', '10'],
      ['20000', '20000', '0'],
      ['20000', '20000', '0'],
      ['20000', '20000', '0'],
      ['31838', '3880', '10'],
      ['20000', '20000', '0'],
      ['20000', '20000', '0'],
      ['20000', '20000', '0'],
      ['20000', '20000', '0'],
      ['20000', '20000', '0'],
      ['20000', '20000', '0'],
      ['20000', '20000', '0'],
      ['20000', '20000', '0'],
      ['20000', '20000', '0'],
      ['20000', '20000', '0'],
      ['20000', '20000', '0'],
      ['20000', '20000', '0'],
      ['20000', '20000', '0'],
      ['20000', '20000', '0'],
      ['20000', '20000', '0'],
      ['20000', '20000', '0'],
      ['20000', '20000', '0'],
      ['20000', '20000', '0'],
      ['20000', '20000', '0'],
      ['20000', '20000', '0'],
      ['20000', '20000', '0'],
      ['20000', '20000', '0'],
      ['20000', '20000', '0'],
      ['20000', '20000', '0'],
      ['20000', '20000', '0'],
      ['20000', '20000', '0'],
      ['20000', '20000', '0'],
      ['20000', '20000', '0'],
      ['20000', '20000', '0'],
      ['20000', '20000', '0'],
      ['20000', '20000', '0'],
      ['20000', '20000', '0'],
      ['20000', '20000', '0'],
      ['20000', '20000', '0'],
      ['20000', '20000', '0'],
      ['20000', '20000', '0'],
      ['20000', '20000', '0'],
      ['20000', '20000', '0'],
      ['20000', '20000', '0'],
      ['20000', '20000', '0'],
      ['20000', '20000', '0'],
      ['20000', '20000', '0'],
      ['20000', '20000', '0'],
      ['20000', '20000', '0'],
      ['20000', '20000', '0'],
      ['20000', '20000', '0'],
      ['20000', '20000', '0'],
      ['20000', '20000', '0'],
      ['20000', '20000', '0'],
      ['20000', '20000', '0'],
      ['20000', '20000', '0'],
      ['20000', '20000', '0'],
      ['20000', '20000', '0'],
      ['20000', '20000', '0'],
      ['20000', '20000', '0'],
      ['20000', '20000', '0'],
      ['20000', '20000', '0'],
      ['20000', '20000', '0'],
      ['20000', '20000', '0'],
      ['20000', '20000', '0'],
      ['20000', '20000', '0'],
      ['20000', '20000', '0'],
      ['20000', '20000', '0'],
      ['20000', '20000', '0'],
      ['20000', '20000', '0'],
      ['20000', '20000', '0'],
      ['20000', '20000', '0'],
      ['20000', '20000', '0'],
      ['20000', '20000', '0'],
      ['20000', '20000', '0'],
      ['20000', '20000', '0'],
      ['20000', '20000', '0'],
      ['20000', '20000', '0'],
      ['20000', '20000', '0'],
      ['20000', '20000', '0'],
      ['20000', '20000', '0'],
      ['20000', '20000', '0'],
      ['20000', '20000', '0'],
      ['20000', '20000', '0'],
      ['20000', '20000', '0'],
      ['20000', '20000', '0'],
      ['20000', '20000', '0'],
      ['20000', '20000', '0'],
      ['20000', '20000', '0'],
      ['20000', '20000', '0'],
      ['20000', '20000', '0'],
      ['20000', '20000', '0'],
      ['20000', '20000', '0'],
      ['20000', '20000', '0'],
      ['20000', '20000', '0'],
      ['20000', '20000', '0'],
      ['20000', '20000', '0'],
      ['20000', '20000', '0'],
      ['20000', '20000', '0'],
      ['20000', '20000', '0'],
      ['20000', '20000', '0'],
      ['20000', '20000', '0'],
      ['20000', '20000', '0'],
      ['20000', '20000', '0'],
      ['20000', '20000', '0'],
      ['20000', '20000', '0'],
      ['20000', '20000', '0'],
      ['20000', '20000', '0'],
      ['20000', '20000', '0'],
      ['20000', '20000', '0'],
      ['20000', '20000', '0'],
      ['20000', '20000', '0'],
      ['20000', '20000', '0'],
      ['20000', '20000', '0'],
      ['20000', '20000', '0'],
      ['20000', '20000', '0'],
      ['20000', '20000', '0'],
      ['20000', '20000', '0'],
      ['20000', '20000', '0'],
      ['20000', '20000', '0'],
      ['20000', '20000', '0'],
      ['20000', '20000', '0']
    ],
    inflightMissile: ['71028', '903280', '31838', '3880', '10'],
    address: '0xfa398d672936dcf428116f687244034961545d91'
  }

  before(async () => {
    circuit = await wasm_tester(`circuits/game_${bodies}_${steps}.circom`)
  })

  it('produces a witness with valid constraints', async () => {
    sampleInput.missiles = sampleInput.missiles.map((m) =>
      m.length == 5 ? [m[2], m[3], m[4]] : m
    )
    sampleInput.missiles = sampleInput.missiles.map((m) => {
      if (parseInt(m[2]) === 0) {
        m[0] = '20000'
        m[1] = '20000'
      }
      return m
    })

    const witness = await circuit.calculateWitness(sampleInput, sanityCheck)
    // const inputs =
    //   sampleInput.bodies.length * sampleInput.bodies[0].length +
    //   sampleInput.missiles.length * sampleInput.missiles[0].length
    // const perStep = witness.length - inputs
    // const secRounded = calculateTime(perStep, steps)
    // console.log(`| stepState(3, ${steps}) | ${perStep} | ${secRounded} |`)
    await circuit.checkConstraints(witness)
  })

  it('passes one off check input', async () => {
    const sampleInput = checkSampleInput
    const inflightMissile = sampleInput.inflightMissile

    const steps = sampleInput.missiles.length - 1
    const bodies = sampleInput.bodies.length
    const circuitName = `circuits/game_${bodies}_${steps}.circom`
    // console.log({ circuitName })
    const circuit = await wasm_tester(circuitName)

    const witness = await circuit.calculateWitness(sampleInput, sanityCheck)
    await circuit.checkConstraints(witness)

    const anybody = new Anybody(null, { util: true })
    let abBodies = sampleInput.bodies.map(
      anybody.convertScaledStringArrayToFloat.bind(anybody)
    )
    let abMissiles = sampleInput.missiles.map(
      anybody.convertMissileScaledStringArrayToFloat.bind(anybody)
    )
    // console.dir({ abMissiles_00: abMissiles[0] }, { depth: null })
    // console.log({ inflightMissile })
    if (parseInt(sampleInput.inflightMissile[4]) !== 0) {
      abMissiles[0].position.x = anybody.convertScaledBigIntToFloat(
        inflightMissile[0]
      )
      abMissiles[0].position.y = anybody.convertScaledBigIntToFloat(
        inflightMissile[1]
      )
    }
    // console.dir({ abMissiles_0: abMissiles[0] }, { depth: null })
    let stepsSinceWin = 0
    for (let i = 0; i < steps; i++) {
      // console.dir(
      //   { step: i, bodies_in: abBodies, missile_in: abMissiles[0] },
      //   { depth: null }
      // )
      anybody.bodies = abBodies
      anybody.missiles = abMissiles
      const results = anybody.step()
      abBodies = results.bodies
      abMissiles = results.missiles
      if (abBodies.filter((b) => b.radius === 0).length == 1) {
        stepsSinceWin += 1
      }
    }

    const time = steps - stepsSinceWin

    abBodies = anybody.convertBodiesToBigInts(abBodies)
    const out_bodies = abBodies.map(
      anybody.convertScaledBigIntBodyToArray.bind(anybody)
    )
    const expected = {
      out_bodies,
      time,
      outflightMissile: [
        abMissiles[0].px,
        abMissiles[0].py,
        parseInt(abMissiles[0].vx) + 20000,
        parseInt(abMissiles[0].vy) + 20000,
        abMissiles[0].radius
      ]
    }
    // console.dir({ sampleInput }, { depth: null })
    await circuit.assertOut(witness, expected)
  })

  it('has the correct output when one body and missile positioned to hit and it returns correct number of steps', async () => {
    const anybody = new Anybody(null, { util: true })
    let bodies = sampleInput.bodies.map(
      anybody.convertScaledStringArrayToFloat.bind(anybody)
    )
    let abMissiles = sampleInput.missiles.map(
      anybody.convertMissileScaledStringArrayToFloat.bind(anybody)
    )
    abMissiles[0].position.x = anybody.convertScaledBigIntToFloat(
      inflightMissile[0]
    )
    abMissiles[0].position.y = anybody.convertScaledBigIntToFloat(
      inflightMissile[1]
    )
    abMissiles[0].velocity.x = anybody.convertScaledBigIntToFloat(
      inflightMissile[2] - 20000
    )
    abMissiles[0].velocity.y = anybody.convertScaledBigIntToFloat(
      inflightMissile[3] - 20000
    )
    abMissiles[0].radius = anybody.convertScaledBigIntToFloat(
      inflightMissile[4]
    )

    for (let i = 0; i < steps; i++) {
      anybody.bodies = bodies
      anybody.missiles = abMissiles
      const results = anybody.step()
      bodies = results.bodies
      abMissiles = results.missiles
    }

    // missile should have hit body
    // make sure that the body didn't wrap around screen before missile could hit it
    expect(bodies[k].radius).to.eq(0)

    bodies = anybody.convertBodiesToBigInts(bodies)
    const out_bodies = bodies.map(
      anybody.convertScaledBigIntBodyToArray.bind(anybody)
    )
    const expected = {
      out_bodies,
      time: missileStep,
      outflightMissile: [
        abMissiles[0].px,
        abMissiles[0].py,
        parseInt(abMissiles[0].vx) + 20000,
        parseInt(abMissiles[0].vy) + 20000,
        abMissiles[0].radius
      ]
    }
    const witness = await circuit.calculateWitness(sampleInput, sanityCheck)
    await circuit.assertOut(witness, expected)
  })
})
