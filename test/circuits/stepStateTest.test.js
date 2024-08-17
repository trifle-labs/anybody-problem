// import hre from 'hardhat'
import { wasm as wasm_tester } from 'circom_tester'
import { Anybody } from '../../dist/module.js'
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
    const m = new Array(3).fill('0')
    m[0] = '0'
    m[1] = '0'
    m[2] = '0'
    return m
  })

  const k = sampleInputBodies.length - 1

  const inflightMissile = [
    sampleInputBodies[k][0],
    sampleInputBodies[k][1],
    (parseInt(sampleInputBodies[k][2]) - 20000).toString(),
    -(parseInt(sampleInputBodies[k][3]) - 20000).toString(),
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
    -(parseInt(sampleInputBodies[k][3]) - 20000) * missileStep
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

  sampleInput.missiles = sampleInput.missiles.map((m) =>
    m.length == 5
      ? [
          (parseInt(m[2]) - 20000).toString(), // body position is offset by 20_000, so remove it for missile velocity
          (parseInt(m[3]) - 20000).toString(),
          m[4]
        ]
      : m
  )
  sampleInput.missiles = sampleInput.missiles.map((m) => {
    if (m.length == 5) {
      throw new Error('should not have 5')
    }
    if (parseInt(m[2]) === 0) {
      m[0] = '0'
      m[1] = '0'
    } else {
      // return [
      //   (parseInt(m[0]) + 10000).toString(),
      //   (parseInt(m[1]) + 10000).toString(),
      //   m[2]
      // ]
    }
    return m
  })
  const sanityCheck = true
  const steps = sampleInput.missiles.length - 1
  const bodies = sampleInput.bodies.length

  // the following input is from shooting in a real game
  const checkSampleInput = {
    bodies: [
      ['707626', '1000000', '27722', '5734', '36000'],
      ['961060', '239919', '12212', '15279', '0'],
      ['116574', '545686', '17604', '4334', '0'],
      ['199683', '990450', '18896', '30176', '19000'],
      ['49752', '597944', '18567', '27292', '0'],
      ['339375', '966527', '20291', '28511', '0']
    ],
    missiles: [
      ['29652', 4558, '10'],
      ['0', '0', '0'],
      ['0', '0', '0'],
      ['0', '0', '0'],
      ['0', '0', '0'],
      ['0', '0', '0'],
      ['0', '0', '0'],
      ['0', '0', '0'],
      ['0', '0', '0'],
      ['0', '0', '0'],
      ['0', '0', '0'],
      ['0', '0', '0'],
      ['0', '0', '0'],
      ['0', '0', '0'],
      ['0', '0', '0'],
      ['0', '0', '0'],
      ['0', '0', '0'],
      ['0', '0', '0'],
      ['0', '0', '0'],
      ['0', '0', '0'],
      ['0', '0', '0'],
      ['0', '0', '0'],
      ['0', '0', '0'],
      ['0', '0', '0'],
      ['0', '0', '0'],
      ['0', '0', '0'],
      ['0', '0', '0'],
      ['0', '0', '0'],
      ['0', '0', '0'],
      ['0', '0', '0'],
      ['0', '0', '0'],
      ['0', '0', '0'],
      ['0', '0', '0'],
      ['0', '0', '0'],
      ['0', '0', '0'],
      ['0', '0', '0'],
      ['0', '0', '0'],
      ['0', '0', '0'],
      ['0', '0', '0'],
      ['0', '0', '0'],
      ['0', '0', '0'],
      ['0', '0', '0'],
      ['0', '0', '0'],
      ['0', '0', '0'],
      ['0', '0', '0'],
      ['0', '0', '0'],
      ['0', '0', '0'],
      ['0', '0', '0'],
      ['0', '0', '0'],
      ['0', '0', '0'],
      ['0', '0', '0'],
      ['0', '0', '0'],
      ['0', '0', '0'],
      ['0', '0', '0'],
      ['0', '0', '0'],
      ['0', '0', '0'],
      ['0', '0', '0'],
      ['0', '0', '0'],
      ['0', '0', '0'],
      ['0', '0', '0'],
      ['0', '0', '0'],
      ['0', '0', '0'],
      ['0', '0', '0'],
      ['0', '0', '0'],
      ['0', '0', '0'],
      ['0', '0', '0'],
      ['0', '0', '0'],
      ['0', '0', '0'],
      ['0', '0', '0'],
      ['0', '0', '0'],
      ['0', '0', '0'],
      ['0', '0', '0'],
      ['0', '0', '0'],
      ['0', '0', '0'],
      ['0', '0', '0'],
      ['0', '0', '0'],
      ['0', '0', '0'],
      ['0', '0', '0'],
      ['0', '0', '0'],
      ['0', '0', '0'],
      ['0', '0', '0'],
      ['0', '0', '0'],
      ['0', '0', '0'],
      ['0', '0', '0'],
      ['0', '0', '0'],
      ['0', '0', '0'],
      ['0', '0', '0'],
      ['0', '0', '0'],
      ['0', '0', '0'],
      ['0', '0', '0'],
      ['0', '0', '0'],
      ['0', '0', '0'],
      ['4761', 29620, '10'],
      ['0', '0', '0'],
      ['0', '0', '0'],
      ['0', '0', '0'],
      ['0', '0', '0'],
      ['0', '0', '0'],
      ['0', '0', '0'],
      ['0', '0', '0'],
      ['0', '0', '0'],
      ['0', '0', '0'],
      ['0', '0', '0'],
      ['0', '0', '0'],
      ['0', '0', '0'],
      ['0', '0', '0'],
      ['0', '0', '0'],
      ['0', '0', '0'],
      ['0', '0', '0'],
      ['0', '0', '0'],
      ['0', '0', '0'],
      ['0', '0', '0'],
      ['0', '0', '0'],
      ['0', '0', '0'],
      ['0', '0', '0'],
      ['0', '0', '0'],
      ['0', '0', '0'],
      ['0', '0', '0'],
      ['0', '0', '0'],
      ['0', '0', '0'],
      ['0', '0', '0'],
      ['0', '0', '0'],
      ['0', '0', '0'],
      ['0', '0', '0'],
      ['0', '0', '0'],
      ['0', '0', '0']
    ],
    inflightMissile: ['29652', '995442', '29652', 4558, '10'],
    address: '0x66da63b03feca7dd44a5bb023bb3645d3252fa32'
  }
  // inflightMissile: ['0', '1000000', '0', 0, '0'],
  //   address: '0x66da63b03feca7dd44a5bb023bb3645d3252fa32'
  // }
  before(async () => {
    circuit = await wasm_tester(`circuits/game_${bodies}_${steps}.circom`)
  })

  it('produces a witness with valid constraints', async () => {
    const witness = await circuit.calculateWitness(sampleInput, sanityCheck)
    // const inputs =
    //   sampleInput.bodies.length * sampleInput.bodies[0].length +
    //   sampleInput.missiles.length * sampleInput.missiles[0].length
    // const perStep = witness.length - inputs
    // const secRounded = calculateTime(perStep, steps)
    // console.log(`| stepState(3, ${steps}) | ${perStep} | ${secRounded} |`)
    await circuit.checkConstraints(witness)
  })

  it.only('passes one off check input', async () => {
    const inflightMissile = checkSampleInput.inflightMissile

    const steps = checkSampleInput.missiles.length - 1
    const bodies = checkSampleInput.bodies.length
    const circuitName = `circuits/game_${bodies}_${steps}.circom`
    // console.log({ circuitName })
    const circuit = await wasm_tester(circuitName)

    const witness = await circuit.calculateWitness(
      checkSampleInput,
      sanityCheck
    )
    await circuit.checkConstraints(witness)

    const anybody = new Anybody(null, { util: true })
    let abBodies = checkSampleInput.bodies.map((body) =>
      anybody.convertScaledStringArrayToFloat.call(anybody, body)
    )
    let abMissiles = checkSampleInput.missiles.map((missile) =>
      anybody.convertMissileScaledStringArrayToFloat.call(anybody, missile)
    )
    // console.dir({ abMissiles_00: abMissiles[0] }, { depth: null })
    // console.log({ inflightMissile })
    if (parseInt(checkSampleInput.inflightMissile[4]) !== 0) {
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
      const nonZeroBodies = abBodies.filter((b) => b.radius !== 0).length
      if (nonZeroBodies == 1) {
        stepsSinceWin += 1
      }
    }

    const time = steps - stepsSinceWin

    abBodies = anybody.convertBodiesToBigInts(abBodies)
    const out_bodies = abBodies.map((body) =>
      anybody.convertScaledBigIntBodyToArray.call(anybody, body)
    )
    const expected = {
      out_bodies,
      time,
      outflightMissile: [
        abMissiles[0].px,
        abMissiles[0].py,
        parseInt(abMissiles[0].vx),
        -parseInt(abMissiles[0].vy),
        abMissiles[0].radius
      ]
    }
    console.dir({ expected }, { depth: null })
    await circuit.assertOut(witness, expected)
  })

  it('has the correct output when one body and missile positioned to hit and it returns correct number of steps', async () => {
    const anybody = new Anybody(null, { util: true })
    let bodies = sampleInput.bodies.map((body) =>
      anybody.convertScaledStringArrayToFloat.call(anybody, body)
    )
    let abMissiles = sampleInput.missiles.map((missile) =>
      anybody.convertMissileScaledStringArrayToFloat.call(anybody, missile)
    )
    abMissiles[0].position.x = anybody.convertScaledBigIntToFloat(
      inflightMissile[0]
    )
    abMissiles[0].position.y = anybody.convertScaledBigIntToFloat(
      inflightMissile[1]
    )
    abMissiles[0].velocity.x = anybody.convertScaledBigIntToFloat(
      inflightMissile[2] // get real value after removine body maxVelocity offset
    )
    abMissiles[0].velocity.y = -anybody.convertScaledBigIntToFloat(
      inflightMissile[3] // get real value after removine body maxVelocity offset
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
    const out_bodies = bodies.map((body) =>
      anybody.convertScaledBigIntBodyToArray.call(anybody, body)
    )
    const expected = {
      out_bodies,
      time: missileStep,
      outflightMissile: [
        abMissiles[0].px,
        abMissiles[0].py,
        parseInt(abMissiles[0].vx),
        -parseInt(abMissiles[0].vy),
        abMissiles[0].radius
      ]
    }
    const witness = await circuit.calculateWitness(sampleInput, sanityCheck)
    await circuit.assertOut(witness, expected)
  })
})
