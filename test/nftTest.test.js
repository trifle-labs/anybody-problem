

// const { describe, before, it } = require('mocha')
// const hre = require('hardhat')
// const { ethers } = require('hardhat')
// const { exportCallDataGroth16 } = require('../scripts/circuits.cjs')
// const { mine } = require('@nomicfoundation/hardhat-network-helpers')
import { expect } from 'chai'

import hre from 'hardhat'
const { ethers } = hre
import { exportCallDataGroth16 } from '../scripts/circuits.cjs'
import { mine } from '@nomicfoundation/hardhat-network-helpers'

// const hre = require('hardhat');

// const { assert, expect } = require('chai')
// const {
//   Anybody,
//   _calculateTime,
// } = require('../src/anybody.js')
import { Anybody, utils } from '../src/anybody.js'
const _calculateTime = utils._calculateTime

// const p = 21888242871839275222246405745257275088548364400416034343698204186575808495617n;
const steps = 20

describe('nft circuit', () => {
  let circuit
  // NOTE: velocities are offset by 10_000 to avoid negative numbers
  const sampleInput = {
    // bodies: [
    //   ['326000', '42000', '8670', '3710', '100000'],
    //   ['363000', '658000', '6680', '13740', '75000'],
    //   ['679000', '500000', '12290', '12520', '50000']
    // ]
    bodies: [
      ['523444', '630395', '0', '19433', '13000'],
      ['570102', '453205', '19804', '367', '12000'],
      ['268103', '465485', '20000', '20000', '11000']
    ]
  }
  const sanityCheck = true

  before(async () => {
    circuit = await hre.circuitTest.setup('nft_3_20')
  })

  it('produces a witness with valid constraints', async () => {
    const witness = await circuit.calculateWitness(sampleInput, sanityCheck)
    const inputs = sampleInput.bodies.length * sampleInput.bodies[0].length
    const perStep = witness.length - inputs
    const secRounded = _calculateTime(perStep, steps)
    console.log(`| nft(3, ${steps}) | ${perStep} | ${secRounded} |`)
    await circuit.checkConstraints(witness)
  })

  it.skip('has expected witness values', async () => {
    const witness = await circuit.calculateLabeledWitness(
      sampleInput,
      sanityCheck
    )
    console.log({ witness })

    // assert.propertyVal(witness, "main.squared", sampleInput.squared);
    // assert.propertyVal(witness, "main.calculatedRoot", sampleInput.calculatedRoot);
    // assert.propertyVal(witness, "main.calculatedSquared", (sampleInput.calculatedRoot ** 2).toString())
    // assert.propertyVal(witness, "main.out", "1");
  })

  it('has the correct output', async () => {
    const anybody = new Anybody(null, { util: true })
    let bodies = sampleInput.bodies.map(anybody.convertScaledStringArrayToBody.bind(anybody))
    // console.dir({ bodies }, { depth: null })
    for (let i = 0; i < steps; i++) {
      bodies = anybody.forceAccumulatorBigInts(bodies)
    }
    const out_bodies = bodies.map(anybody.convertScaledBigIntBodyToArray.bind(anybody))
    // console.log({ out_bodies })
    const expected = { out_bodies }
    const witness = await circuit.calculateWitness(sampleInput, sanityCheck)
    await circuit.assertOut(witness, expected)
  })

  it.skip('NftVerifier.sol works', async () => {

    const NftVerifier = await ethers.getContractFactory('contracts/NftTestVerifier.sol:Groth16Verifier')
    const nftVerifier = await NftVerifier.deploy()
    await nftVerifier.deployed()

    let dataResult = await exportCallDataGroth16(
      sampleInput,
      './nftTest_js/nftTest.wasm',
      './nftTest_final.zkey'
    )
    let result = await nftVerifier.verifyProof(
      dataResult.a,
      dataResult.b,
      dataResult.c,
      dataResult.Input
    )
    assert.equal(result, true)

  })



  it.skip('nft.sol works', async () => {
    const NftVerifier = await ethers.getContractFactory('contracts/NftVerifier.sol:Groth16Verifier')
    const nftVerifier = await NftVerifier.deploy()
    await nftVerifier.deployed()

    const Metadata = await ethers.getContractFactory('Metadata')
    const metadata = await Metadata.deploy()
    await metadata.deployed()

    const Nft = await ethers.getContractFactory('NFT')
    const nft = await Nft.deploy(metadata.address, nftVerifier.address)
    await nft.deployed()

    console.log('committing...')
    await expect(nft.commit())
      .to.not.be.reverted

    const blockBefore = await ethers.provider.getBlock()
    console.log('waiting one block')
    await mine()
    const blockAfter = await ethers.provider.getBlock()

    // make sure block incremented by 1
    assert.equal(blockAfter.number, blockBefore.number + 1)

    console.log('minting...')

    await expect(nft.mint())
      .to.not.be.reverted
    const block = await ethers.provider.getBlock()
    console.log({ block: block.number })

    const body = await nft.getBody(1)
    console.log({ body })

    // let dataResult = await exportCallDataGroth16(
    //   sampleInput,
    //   "./circuits/nft.wasm",
    //   "./circuits/nft.zkey"
    // );
    // let result = await nftVerifier.verifyProof(
    //   dataResult.a,
    //   dataResult.b,
    //   dataResult.c,
    //   dataResult.Input
    // );
    // assert.equal(result, true);
  })



})
