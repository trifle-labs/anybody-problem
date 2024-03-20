import { expect } from 'chai'
import hre from 'hardhat'
const ethers = hre.ethers

import {
	deployContracts,
	correctPrice,
	getParsedEventLogs,
	prepareMintBody,
	mintProblem
} from '../scripts/utils.js'

// let tx
describe('Bodies Tests', function () {
	this.timeout(50000000)
	it('has the correct bodies, tocks addresses', async () => {
		const deployedContracts = await deployContracts()

		const { Bodies: bodies } = deployedContracts

		for (const [name, contract] of Object.entries(deployedContracts)) {
			if (name === 'Problems' || name === 'Tocks') {
				const functionName = name.toLowerCase()
				let storedAddress = await bodies[`${functionName}()`]()
				const actualAddress = contract.address
				expect(storedAddress).to.equal(actualAddress)
			}
		}
	})

	it('onlyOwner functions are really only Owner', async function () {
		const [, addr1] = await ethers.getSigners()
		const { Bodies: bodies } = await deployContracts()

		await expect(
			bodies.connect(addr1).updateTockPrice(0, 0)
		).to.be.revertedWith('Ownable: caller is not the owner')

		await expect(
			bodies.connect(addr1).updateProblemsAddress(addr1.address)
		).to.be.revertedWith('Ownable: caller is not the owner')

		await expect(
			bodies.connect(addr1).updateTocksAddress(addr1.address)
		).to.be.revertedWith('Ownable: caller is not the owner')

		await expect(bodies.updateTockPrice(0, 0)).to.not.be.reverted

		await expect(bodies.updateProblemsAddress(addr1.address)).to.not.be.reverted

		await expect(bodies.updateTocksAddress(addr1.address)).to.not.be.reverted
	})

	it('updates tock price correctly', async () => {
		const { Bodies: bodies } = await deployContracts()
		const tockPriceIndex = 0
		const newPrice = 1000
		const oldPrice = await bodies.tockPrice(tockPriceIndex)
		expect(oldPrice.toNumber()).to.not.equal(newPrice)
		await bodies.updateTockPrice(tockPriceIndex, newPrice)
		const updatedPrice = await bodies.tockPrice(tockPriceIndex)
		expect(updatedPrice.toNumber()).to.equal(newPrice)

		const outOfRangeIndex = 10
		await expect(
			bodies.updateTockPrice(outOfRangeIndex, newPrice)
		).to.be.revertedWith('Invalid index')
	})

	it('has all the correct interfaces', async () => {
		const interfaces = [
			{ name: 'ERC165', id: '0x01ffc9a7', supported: true },
			{ name: 'ERC721', id: '0x80ac58cd', supported: true },
			{ name: 'ERC721Metadata', id: '0x5b5e139f', supported: true },
			{ name: 'ERC4906MetadataUpdate', id: '0x49064906', supported: false },
			{ name: 'ERC721Enumerable', id: '0x780e9d63', supported: false },
			{ name: 'ERC2981', id: '0x2a55205a', supported: false },
			{ name: 'ERC20', id: '0x36372b07', supported: false }
		]

		for (let i = 0; i < interfaces.length; i++) {
			const { name, id, supported } = interfaces[i]
			const { Bodies: bodies } = await deployContracts()
			const supportsInterface = await bodies.supportsInterface(id)
			expect(name + supportsInterface).to.equal(name + supported)
		}
	})

	it('fallback and receive functions revert', async () => {
		const [owner] = await ethers.getSigners()
		const { Bodies: bodies } = await deployContracts()
		await expect(
			owner.sendTransaction({ to: bodies.address, value: '1' })
		).to.be.revertedWith(
			"there's no receive function, fallback function is not payable and was called with value 1"
		)
		await expect(
			owner.sendTransaction({ to: bodies.address, value: '0' })
		).to.be.revertedWith('no fallback function')
	})

	it('onlyProblem functions can only be called by Problems address', async function () {
		const [owner] = await ethers.getSigners()
		const { Bodies: bodies } = await deployContracts()

		await expect(
			bodies.mintAndAddToProblem(owner.address, 0, 0)
		).to.be.revertedWith('Only Problems can call')

		await expect(bodies.burn(owner.address)).to.be.revertedWith(
			'Only Problems can call'
		)

		await expect(bodies.problemMint(owner.address, 0)).to.be.revertedWith(
			'Only Problems can call'
		)

		await bodies.updateProblemsAddress(owner.address)

		// NOTE: this scenario is non-sensical but sufficient to test the modifier
		await expect(bodies.mintAndAddToProblem(owner.address, 0, 0)).to.not.be
			.reverted

		await expect(bodies.burn(0)).to.be.revertedWith('ERC721: invalid token ID')

		await expect(bodies.problemMint(owner.address, 0)).to.not.be.reverted
	})

	//
	// Minting Tests
	//

	it('matches seeds between Bodies and Problems contracts', async function () {
		const { Bodies: bodies, Problems: problems } = await deployContracts()
		await problems.updatePaused(false)
		await problems.updateStartDate(0)
		await problems['mint()']({ value: correctPrice })
		const problemId = await problems.problemSupply()
		const bodyIds = await problems.getProblemBodyIds(problemId)
		const { bodyCount } = await problems.problems(problemId)
		for (let i = 0; i < bodyCount; i++) {
			const bodyId = bodyIds[i]
			const { seed: problemSeed } = await problems.getProblemBodyData(
				problemId,
				bodyId
			)
			const { seed: bodySeed } = await bodies.bodies(bodyId)

			expect(problemSeed).to.equal(bodySeed)
		}
	})

	it('mints a new body after receiving Tocks', async () => {
		const [owner, acct1] = await ethers.getSigners()
		const {
			Tocks: tocks,
			Bodies: bodies,
			Problems: problems
		} = await deployContracts()
		await problems.updatePaused(false)
		await problems.updateStartDate(0)
		await problems.connect(acct1)['mint()']({ value: correctPrice })
		const problemId = await problems.problemSupply()

		await tocks.updateSolverAddress(owner.address)
		const { mintedBodiesIndex } = await problems.problems(problemId)
		// NOTE: purposefully forgot to multiply by decimals here
		const tockPrice = await bodies.tockPrice(mintedBodiesIndex)

		await tocks.mint(acct1.address, tockPrice)

		let promise = problems.connect(acct1).mintBodyOutsideProblem(problemId)

		await expect(promise).to.be.revertedWith(
			'ERC20: burn amount exceeds balance'
		)

		const decimals = await bodies.decimals()
		const updatedPrice = tockPrice.mul(decimals)
		const difference = updatedPrice.sub(tockPrice)
		await tocks.mint(acct1.address, difference)

		const tockBalance = await tocks.balanceOf(acct1.address)
		expect(tockBalance).to.equal(updatedPrice)

		promise = problems.connect(acct1).mintBodyOutsideProblem(problemId)
		await expect(promise).to.not.be.reverted

		let tx = await promise
		const receipt = await tx.wait()

		const transferEvents = getParsedEventLogs(receipt, bodies, 'Transfer')
		const tokenId = transferEvents[0].args.tokenId

		const tokenOwner = await bodies.ownerOf(tokenId)
		expect(tokenOwner).to.equal(acct1.address)

		const balance = await bodies.balanceOf(acct1.address)
		expect(balance).to.equal(1)

		// token id is correctly correlated
		const counter = await bodies.counter()
		expect(counter).to.equal(tokenId)

		// seed is not empty
		const { seed } = await bodies.bodies(tokenId)
		expect(seed).to.not.equal(0)

		// all tocks were spent
		const tockBalanceAfter = await tocks.balanceOf(acct1.address)
		expect(tockBalanceAfter).to.equal(0)
	})

	it('fails when you try to mint a body for a problem you do not own', async () => {
		const signers = await ethers.getSigners()
		const [, acct1] = signers
		const deployedContracts = await deployContracts()
		const { Problems: problems } = deployedContracts
		const { problemId } = await mintProblem(signers, deployedContracts, acct1)
		await prepareMintBody(signers, deployedContracts, problemId)
		await expect(problems.mintBodyOutsideProblem(problemId)).to.be.revertedWith(
			'Not problem owner'
		)
	})

	it('validate second mint event', async function () {
		const signers = await ethers.getSigners()
		// const [, acct1] = signers
		const deployedContracts = await deployContracts()
		const { Problems: problems } = deployedContracts
		const { problemId } = await mintProblem(signers, deployedContracts)
		await prepareMintBody(signers, deployedContracts, problemId)
		await expect(problems.mintBodyOutsideProblem(problemId)).to.not.be.reverted
		await prepareMintBody(signers, deployedContracts, problemId)
		await expect(problems.mintBodyOutsideProblem(problemId)).to.not.be.reverted
	})

	it('succeeds adding a body into a problem', async () => {
		const signers = await ethers.getSigners()
		const deployedContracts = await deployContracts()
		const { Problems: problems, Bodies: bodies } = deployedContracts
		const { problemId } = await mintProblem(signers, deployedContracts)
		await prepareMintBody(signers, deployedContracts, problemId)
		const tx = await problems.mintBodyOutsideProblem(problemId)
		const receipt = await tx.wait()
		const bodyId = getParsedEventLogs(receipt, bodies, 'Transfer')[0].args
			.tokenId

		await expect(problems.addExistingBody(problemId, bodyId)).to.not.be.reverted

		const custodyAddress = bodies.address
		const bodyOwner = await bodies.ownerOf(bodyId)
		expect(bodyOwner).to.eq(custodyAddress)

		const problem = await problems.problems(problemId)
		const { bodyCount, tickCount } = problem
		expect(bodyCount).to.equal(4)
		expect(tickCount).to.equal(0)

		const scalingFactor = await problems.scalingFactor()
		const maxVector = await problems.maxVector()
		const startingRadius = await problems.startingRadius()
		const maxRadius = ethers.BigNumber.from(3 * 5).add(startingRadius)

		const windowWidth = await problems.windowWidth()

		const initialVelocity = maxVector.mul(scalingFactor)

		const bodyIDs = await problems.getProblemBodyIds(problemId)
		let smallestRadius = startingRadius.mul(scalingFactor)
		for (let i = 0; i < bodyCount; i++) {
			const currentBodyId = bodyIDs[i]
			const bodyData = await problems.getProblemBodyData(
				problemId,
				currentBodyId
			)
			const { bodyId, bodyIndex, px, py, vx, vy, radius, seed } = bodyData

			expect(bodyId).to.equal(currentBodyId)
			expect(bodyIndex).to.equal(i)

			expect(px).to.not.equal(0)
			expect(px.lt(windowWidth)).to.be.true

			expect(py).to.not.equal(0)
			expect(py.lt(windowWidth)).to.be.true

			expect(px).to.not.equal(py)

			expect(vx).to.equal(initialVelocity)
			expect(vy).to.equal(initialVelocity)

			expect(radius).to.not.equal(0)
			expect(radius.lte(maxRadius.mul(scalingFactor))).to.be.true
			expect(radius.gte(smallestRadius)).to.be.true

			expect(seed).to.not.equal(0)
		}
	})

	it('removes a body that was added into a problem', async () => {
		const signers = await ethers.getSigners()
		const [owner] = signers
		const deployedContracts = await deployContracts()
		const { Problems: problems, Bodies: bodies } = deployedContracts
		const { problemId } = await mintProblem(signers, deployedContracts)
		await prepareMintBody(signers, deployedContracts, problemId)
		let tx = await problems.mintBodyOutsideProblem(problemId)
		let receipt = await tx.wait()
		const bodyId = getParsedEventLogs(receipt, bodies, 'Transfer')[0].args
			.tokenId

		await problems.addExistingBody(problemId, bodyId)

		const bodyIds = await problems.getProblemBodyIds(problemId)

		let bodyIdToRemove
		for (let i = 0; i < bodyIds.length; i++) {
			if (bodyIds[i] !== bodyId) {
				bodyIdToRemove = bodyIds[i]
				break
			}
		}
		tx = await problems.removeBody(problemId, bodyIdToRemove)
		receipt = await tx.wait()
		const bodyIdMinted = getParsedEventLogs(receipt, bodies, 'Transfer')[0].args
			.tokenId
		expect(bodyIdMinted).to.equal(bodyIdToRemove)
		const ownerOfBodyIdMinted = await bodies.ownerOf(bodyIdMinted)
		expect(ownerOfBodyIdMinted).to.equal(owner.address)

		const problem = await problems.problems(problemId)
		const { bodyCount } = problem
		expect(bodyCount).to.equal(3)
		const bodyData = await problems.getProblemBodyData(
			problemId,
			bodyIdToRemove
		)
		const { bodyIndex, px, py, vx, vy, radius, seed } = bodyData
		expect(radius).to.equal(0)
		expect(bodyIndex).to.equal(0)
		expect(px).to.equal(0)
		expect(py).to.equal(0)
		expect(vx).to.equal(0)
		expect(vy).to.equal(0)
		expect(Number(seed)).to.equal(0)
	})

	it('mints a body, adds it to a problem, then mints another body', async () => {
		const signers = await ethers.getSigners()
		// const [owner, acct1] = signers
		const deployedContracts = await deployContracts()
		const { Problems: problems, Bodies: bodies } = deployedContracts
		const { problemId } = await mintProblem(signers, deployedContracts)
		await prepareMintBody(signers, deployedContracts, problemId)
		let tx = await problems.mintBodyOutsideProblem(problemId)
		let receipt = await tx.wait()
		const bodyId1 = getParsedEventLogs(receipt, bodies, 'Transfer')[0].args
			.tokenId
		await problems.addExistingBody(problemId, bodyId1)

		await prepareMintBody(signers, deployedContracts, problemId)
		tx = await problems.mintBodyOutsideProblem(problemId)
		receipt = await tx.wait()
		const bodyId2 = getParsedEventLogs(receipt, bodies, 'Transfer')[0].args
			.tokenId

		expect(bodyId2.gt(bodyId1)).to.be.true
	})

	it.skip('combines two bodies correctly', async () => {
		const signers = await ethers.getSigners()
		const [owner, acct1] = signers
		const deployedContracts = await deployContracts()
		const { Bodies: bodies, Problems: problems } = deployedContracts
		const { problemId } = await mintProblem(signers, deployedContracts)
		await prepareMintBody(signers, deployedContracts, problemId)
		let tx = await problems.mintBodyOutsideProblem(problemId)
		let receipt = await tx.wait()
		const persistBodyId = getParsedEventLogs(receipt, bodies, 'Transfer')[0]
			.args.tokenId

		await expect(
			bodies.upgrade(persistBodyId, persistBodyId)
		).to.be.revertedWith('Same body')

		await prepareMintBody(signers, deployedContracts, problemId)
		tx = await problems.mintBodyOutsideProblem(problemId)
		receipt = await tx.wait()
		const burnBodyId = getParsedEventLogs(receipt, bodies, 'Transfer')[0].args
			.tokenId

		const balance = await bodies.balanceOf(owner.address)
		expect(balance).to.equal(2)

		const { mintedBodyIndex } = await bodies.bodies(persistBodyId)

		await expect(bodies.upgrade(persistBodyId, burnBodyId))
			.to.emit(bodies, 'Upgrade')
			.withArgs(persistBodyId, burnBodyId, mintedBodyIndex + 1)

		const newBalance = await bodies.balanceOf(owner.address)
		expect(newBalance).to.equal(1)

		await prepareMintBody(signers, deployedContracts, problemId)
		tx = await problems.mintBodyOutsideProblem(problemId)
		receipt = await tx.wait()
		const newBodyId = getParsedEventLogs(receipt, bodies, 'Transfer')[0].args
			.tokenId

		const ownerOfNewBodyId = await bodies.ownerOf(newBodyId)
		expect(ownerOfNewBodyId).to.equal(owner.address)

		const ownerOfPersistBodyId = await bodies.ownerOf(persistBodyId)
		expect(ownerOfPersistBodyId).to.equal(owner.address)

		await expect(bodies.upgrade(persistBodyId, newBodyId)).to.be.revertedWith(
			'Different mintedBodyIndexes'
		)

		const { problemId: problemId2 } = await mintProblem(
			signers,
			deployedContracts,
			acct1
		)

		await prepareMintBody(signers, deployedContracts, problemId2, acct1)
		tx = await problems.connect(acct1).mintBodyOutsideProblem(problemId2)
		receipt = await tx.wait()
		const newBodyId2 = getParsedEventLogs(receipt, bodies, 'Transfer')[0].args
			.tokenId

		await expect(bodies.upgrade(newBodyId, newBodyId2)).to.be.revertedWith(
			'Not burnBody owner'
		)

		await expect(bodies.upgrade(newBodyId2, newBodyId)).to.be.revertedWith(
			'Not persistBody owner'
		)
	})

	it('fails to mint an 11th body', async () => {
		const signers = await ethers.getSigners()
		const deployedContracts = await deployContracts()
		const { Problems: problems, Bodies: bodies } = deployedContracts
		const { problemId } = await mintProblem(signers, deployedContracts)
		let bodyIds = []
		for (let i = 0; i < 7; i++) {
			await prepareMintBody(signers, deployedContracts, problemId)
			const tx = await problems.mintBodyOutsideProblem(problemId)
			const receipt = await tx.wait()
			const event = getParsedEventLogs(receipt, bodies, 'Transfer')[0].args
			const tokenId = event.tokenId
			bodyIds.push(tokenId)
		}
		await expect(problems.mintBodyOutsideProblem(problemId)).to.be.revertedWith(
			'Problem already minted 10 bodies'
		)

		const balance = await bodies.balanceOf(signers[0].address)
		expect(balance).to.equal(7)

		for (let i = 0; i < 7; i++) {
			await problems.addExistingBody(problemId, bodyIds[i])
		}

		const { problemId: problemId2 } = await mintProblem(
			signers,
			deployedContracts
		)
		await prepareMintBody(signers, deployedContracts, problemId2)
		const tx = await problems.mintBodyOutsideProblem(problemId2)
		const receipt = await tx.wait()
		const tokenId = getParsedEventLogs(receipt, bodies, 'Transfer')[0].args
			.tokenId
		await expect(
			problems.addExistingBody(problemId, tokenId)
		).to.be.revertedWith('Cannot have more than 10 bodies')
	})
})
