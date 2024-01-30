const { expect } = require('chai')
const { ethers } = require('hardhat')
// const { describe, it } = require('mocha')
const { Anybody } = require('../src/anybody.js')
const { deployContracts, mintProblem } = require('../scripts/utils.js')
const { exportCallDataGroth16 } = require('../scripts/circuits.js')

// let tx
describe('Solver Tests', function () {
  this.timeout(50000000)

  it('has the correct problems, tocks addresses', async () => {

    const deployedContracts = await deployContracts()

    const { Solver: solver } = deployedContracts

    for (const [name, contract] of Object.entries(deployedContracts)) {
      if (name === 'Problems' || name === 'Tocks') {
        const functionName = name.toLowerCase()
        let storedAddress = await solver[`${functionName}()`]()
        const actualAddress = contract.address
        expect(storedAddress).to.equal(actualAddress)
      }
    }
  })

  it('onlyOwner functions are really only Owner', async function () {
    const [, addr1] = await ethers.getSigners()
    const { Solver: solver } = await deployContracts()

    await expect(solver.connect(addr1).updateProblemsAddress(addr1.address))
      .to.be.revertedWith('Ownable: caller is not the owner')

    await expect(solver.connect(addr1).updateTocksAddress(addr1.address))
      .to.be.revertedWith('Ownable: caller is not the owner')

    await expect(solver.updateProblemsAddress(addr1.address))
      .to.not.be.reverted

    await expect(solver.updateTocksAddress(addr1.address))
      .to.not.be.reverted
  })


  it('fallback and receive functions revert', async () => {
    const [owner] = await ethers.getSigners()
    const { Solver: solver } = await deployContracts()
    await expect(owner.sendTransaction({ to: solver.address, value: '1' }))
      .to.be.revertedWith('there\'s no receive function, fallback function is not payable and was called with value 1')
    await expect(owner.sendTransaction({ to: solver.address, value: '0' }))
      .to.be.revertedWith('no fallback function')
  })

  it('creates a proof for 3 bodies', async () => {

    const proofLength = 20

    const signers = await ethers.getSigners()
    const [owner] = signers
    const deployedContracts = await deployContracts()
    const { Problems: problems, Solver: solver, Tocks: tocks } = deployedContracts
    const { problemId } = await mintProblem(signers, deployedContracts)
    // await prepareMintBody(signers, deployedContracts, problemId)
    // await bodies.mint(problemId)

    const { seed: problemSeed } = await problems.problems(problemId)

    const bodyData = []
    const { bodyCount, tickCount } = await problems.problems(problemId)
    const bodyIds = await problems.getProblemBodyIds(problemId)
    for (let i = 0; i < bodyCount; i++) {
      const bodyId = bodyIds[i]
      const body = await problems.getProblemBodyData(problemId, bodyId)
      bodyData.push(body)
    }


    const anybody = new Anybody(null, {
      bodyData,
      seed: problemSeed,
      util: true,
    })

    const inputData = { bodies: anybody.bodyInits }
    anybody.runSteps(proofLength)
    anybody.calculateBodyFinal()

    const bodyFinal = anybody.bodyFinal
    const dataResult = await exportCallDataGroth16(
      inputData,
      './public/nft_3_20.wasm',
      './public/nft_3_20_final.zkey'
    )
    // console.dir({ bodyData, inputData, bodyFinal, dataResult }, { depth: null })
    for (let i = 0; i < dataResult.Input.length; i++) {
      if (i < dataResult.Input.length / 2) {
        const bodyIndex = Math.floor(i / 5)
        const body = bodyFinal[bodyIndex]
        const bodyDataIndex = i - bodyIndex * 5
        expect(dataResult.Input[i]).to.equal(body[bodyDataIndex].toString())
      } else {
        const bodyIndex = Math.floor((i - dataResult.Input.length / 2) / 5)
        const body = inputData.bodies[bodyIndex]
        const bodyDataIndex = i - dataResult.Input.length / 2 - bodyIndex * 5
        expect(dataResult.Input[i]).to.equal(body[bodyDataIndex].toString())
      }
    }

    await expect(solver.solveProblem(problemId, proofLength, dataResult.a, dataResult.b, dataResult.c, dataResult.Input))
      .to.emit(solver, 'Solved')
      .withArgs(problemId, tickCount, proofLength)
    // console.log({ bodyFinal })
    // confirm new values are stored correctly
    for (let i = 0; i < bodyCount; i++) {
      const bodyId = bodyIds[i]
      const bodyData = await problems.getProblemBodyData(problemId, bodyId)
      // console.log({ bodyData })
      const { px, py, vx, vy, radius } = bodyData
      expect(px).to.equal(bodyFinal[i][0].toString())
      expect(py).to.equal(bodyFinal[i][1].toString())
      expect(vx).to.equal(bodyFinal[i][2].toString())
      expect(vy).to.equal(bodyFinal[i][3].toString())
      expect(radius).to.equal(bodyFinal[i][4].toString())
    }

    // confirm tocks have been incremented by correct amount
    const { tickCount: newTickCount } = await problems.problems(problemId)
    expect(newTickCount).to.equal(tickCount + proofLength)

    // user earned new balance in Tocks token
    const balance = await tocks.balanceOf(owner.address)
    expect(balance).to.equal(proofLength)
  })

  it.skip('creates multiple proofs in a row', async () => { })
  it.skip('creates proofs for multiple bodies', async () => { })
  it.skip('adds a body, removes a body, creates a proof', async () => { })
  it.skip('adds two bodies, removes first body, creates a proof', async () => { })






})
