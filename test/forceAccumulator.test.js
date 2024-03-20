// const hre = require('hardhat')
import hre from 'hardhat'
// const { assert } = require('chai')
// const { describe, it, before } = require('mocha')

// const {
//   calculateTime,
//   convertScaledStringArrayToBody,
//   convertScaledBigIntBodyToArray,
//   forceAccumulatorBigInts
// } = require('../docs/index.cjs')
import index from '../docs/index.cjs'
const {
	calculateTime,
	convertScaledStringArrayToBody,
	convertScaledBigIntBodyToArray,
	forceAccumulatorBigInts
} = index

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
		circuit = await hre.circuitTest.setup('forceAccumulatorMain')
	})

	it('produces a witness with valid constraints', async () => {
		const witness = await circuit.calculateWitness(sampleInput, sanityCheck)
		const inputs = sampleInput.bodies.length * sampleInput.bodies[0].length
		const perStep = witness.length - inputs
		const secRounded = calculateTime(perStep)
		console.log(`| forceAccumulator(3) | ${perStep} | ${secRounded} |`)
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

	it.skip('has the correct output', async () => {
		const bodies = sampleInput.bodies.map(convertScaledStringArrayToBody)
		// console.dir({ bodies }, { depth: null })

		const out_bodies = forceAccumulatorBigInts(bodies).map(
			convertScaledBigIntBodyToArray
		)
		// console.log({ out_bodies })
		const expected = { out_bodies }
		const witness = await circuit.calculateWitness(sampleInput, sanityCheck)
		await circuit.assertOut(witness, expected)
	})
})
