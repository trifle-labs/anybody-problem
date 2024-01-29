const { expect } = require('chai')
const { ethers } = require('hardhat')
const { Anybody } = require('../src/anybody.js')
const { deployContracts, mintProblem } = require('../scripts/utils.js')
const { exportCallDataGroth16 } = require('../scripts/circuits')

// let tx
describe('Solver Tests', function () {
  this.timeout(50000000)

  it('has the correct problems, ticks addresses', async () => {

    const deployedContracts = await deployContracts()

    const { Solver: solver } = deployedContracts

    for (const [name, contract] of Object.entries(deployedContracts)) {
      if (name === 'Problems' || name === 'Ticks') {
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

    await expect(solver.connect(addr1).updateTicksAddress(addr1.address))
      .to.be.revertedWith('Ownable: caller is not the owner')

    await expect(solver.updateProblemsAddress(addr1.address))
      .to.not.be.reverted

    await expect(solver.updateTicksAddress(addr1.address))
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

  it.only('creates a proof for 3 bodies', async () => {

    const proofLength = 20

    const signers = await ethers.getSigners()
    // const [, acct1] = signers
    const deployedContracts = await deployContracts()
    const { Problems: problems, Solver: solver } = deployedContracts
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

    // TODO: confirm new values are stored correctly
    // confirm ticks have been incremented by correct amount

  })




})
