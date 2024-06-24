import hre from 'hardhat'
const { ethers } = hre
import { expect } from 'chai'
import { exportCallDataGroth16 } from '../../scripts/circuits.js'
// import { mine } from '@nomicfoundation/hardhat-network-helpers'
import { wasm as wasm_tester } from 'circom_tester'

import { Anybody } from '../../src/anybody.js'
// import { _calculateTime } from '../src/calculations.js'

// const p = 21888242871839275222246405745257275088548364400416034343698204186575808495617n;
const steps = 20

// Doesn't make sense to use while stepState returns a time parameter
describe.skip('nft circuit', () => {
  let circuit
  // NOTE: velocities are offset by 10_000 to avoid negative numbers
  const sampleInput = {
    // bodies: [
    //   ['326000', '42000', '8670', '3710', '100000'],
    //   ['363000', '658000', '6680', '13740', '75000'],
    //   ['679000', '500000', '12290', '12520', '50000']
    // ]
    bodies: [
      ['700501', '604025', '10167', '11594', '12000'],
      ['811208', '285147', '20000', '11243', '2000'],
      ['759904', '489069', '10890', '5409', '2000']
    ]
  }
  const sanityCheck = true

  before(async () => {
    circuit = await wasm_tester(
      `circuits/nft_${sampleInput.bodies.length}_${steps}.circom`
    )
  })

  it('produces a witness with valid constraints', async () => {
    const witness = await circuit.calculateWitness(sampleInput, sanityCheck)
    // const inputs = sampleInput.bodies.length * sampleInput.bodies[0].length
    // const perStep = witness.length - inputs
    // const secRounded = _calculateTime(perStep, steps)
    // console.log(`| nft(3, ${steps}) | ${perStep} | ${secRounded} |`)
    await circuit.checkConstraints(witness)
  })
  it('has the correct output', async () => {
    const anybody = new Anybody(null, { util: true })
    let bodies = sampleInput.bodies.map(
      anybody.convertScaledStringArrayToBody.bind(anybody)
    )
    // console.dir({ bodies }, { depth: null })
    for (let i = 0; i < steps; i++) {
      bodies = anybody.forceAccumulatorBigInts(bodies)
    }
    const out_bodies = bodies.map(
      anybody.convertScaledBigIntBodyToArray.bind(anybody)
    )
    // console.log({ out_bodies })
    const expected = { out_bodies }
    const witness = await circuit.calculateWitness(sampleInput, sanityCheck)
    await circuit.assertOut(witness, expected)
  })

  it('NftVerifier.sol works', async () => {
    const NftVerifier = await ethers.getContractFactory(
      `contracts/Nft_3_${steps}Verifier.sol:Groth16Verifier`
    )
    const nftVerifier = await NftVerifier.deploy()
    await nftVerifier.deployed()

    let dataResult = await exportCallDataGroth16(
      sampleInput,
      `./public/nft_3_${steps}.wasm`,
      `./public/nft_3_${steps}_final.zkey`
    )
    let result = await nftVerifier.verifyProof(
      dataResult.a,
      dataResult.b,
      dataResult.c,
      dataResult.Input
    )
    expect(result).to.equal(true)
  })
})
