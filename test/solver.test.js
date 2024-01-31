const { expect } = require('chai')
const { ethers } = require('hardhat')
// const { describe, it } = require('mocha')
const { deployContracts, mintProblem, getParsedEventLogs, prepareMintBody, generateAndSubmitProof } = require('../scripts/utils.js')

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

    const ticksRun = 20

    const signers = await ethers.getSigners()
    const deployedContracts = await deployContracts()
    const { Problems: problems, Solver: solver, Tocks: tocks } = deployedContracts
    const { problemId } = await mintProblem(signers, deployedContracts)

    const bodyData = []
    const { bodyCount, tickCount } = await problems.problems(problemId)
    const bodyIds = await problems.getProblemBodyIds(problemId)
    for (let i = 0; i < bodyCount; i++) {
      const bodyId = bodyIds[i]
      const body = await problems.getProblemBodyData(problemId, bodyId)
      bodyData.push(body)
    }

    const { tx, bodyFinal } = await generateAndSubmitProof(expect, deployedContracts, problemId, bodyCount, ticksRun, bodyData)

    await expect(tx)
      .to.emit(solver, 'Solved')
      .withArgs(problemId, tickCount, ticksRun)
    const receipt = await tx.wait()

    // user earned new balance in Tocks token
    const tockCount = getParsedEventLogs(receipt, tocks, 'Transfer')[0].args.value
    const { bodyCount: newBodyCount } = await problems.problems(problemId)
    const boostAmount = await solver.bodyBoost(newBodyCount)
    const expectedTockCount = ticksRun * boostAmount
    expect(tockCount).to.equal(expectedTockCount)
    expect(tockCount.gt(0)).to.equal(true)

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

    // confirm tickCount has been incremented by correct amount
    const { tickCount: newTickCount } = await problems.problems(problemId)
    expect(newTickCount).to.equal(tickCount + ticksRun)
  })

  it('creates multiple proofs in a row', async () => {

    const ticksRun = 20

    const signers = await ethers.getSigners()
    const deployedContracts = await deployContracts()
    const { Problems: problems, Solver: solver, Tocks: tocks } = deployedContracts
    const { problemId } = await mintProblem(signers, deployedContracts)

    const { bodyCount, tickCount } = await problems.problems(problemId)

    const totalTicks = 2 * ticksRun
    let totalTockCount = 0, runningTickCount = tickCount
    for (let i = 0; i < totalTicks; i += ticksRun) {

      const bodyData = []
      const bodyIds = await problems.getProblemBodyIds(problemId)
      for (let j = 0; j < bodyCount; j++) {
        const bodyId = bodyIds[j]
        const body = await problems.getProblemBodyData(problemId, bodyId)
        bodyData.push(body)
      }

      // console.log({ bodyData })
      const { tx, bodyFinal } = await generateAndSubmitProof(expect, deployedContracts, problemId, bodyCount, ticksRun, bodyData)
      // console.log({ bodyFinal })
      await expect(tx)
        .to.emit(solver, 'Solved')
        .withArgs(problemId, runningTickCount, ticksRun)
      const receipt = await tx.wait()
      runningTickCount = parseInt(runningTickCount) + parseInt(ticksRun)

      // user earned new balance in Tocks token
      const tockCount = getParsedEventLogs(receipt, tocks, 'Transfer')[0].args.value
      totalTockCount += tockCount.toNumber()
      const { bodyCount: newBodyCount } = await problems.problems(problemId)
      const boostAmount = await solver.bodyBoost(newBodyCount)
      const expectedTockCount = boostAmount.mul(ticksRun)
      expect(tockCount).to.equal(expectedTockCount)

      // confirm new values are stored correctly
      for (let j = 0; j < bodyCount; j++) {
        const bodyId = bodyIds[j]
        const body = await problems.getProblemBodyData(problemId, bodyId)
        const { px, py, vx, vy, radius } = body
        expect(px).to.equal(bodyFinal[j][0].toString())
        expect(py).to.equal(bodyFinal[j][1].toString())
        expect(vx).to.equal(bodyFinal[j][2].toString())
        expect(vy).to.equal(bodyFinal[j][3].toString())
        expect(radius).to.equal(bodyFinal[j][4].toString())
      }
    }

    const tockBalance = await tocks.balanceOf(signers[0].address)
    expect(tockBalance).to.equal(totalTockCount)



    // confirm tickCount has been incremented by correct amount
    const { tickCount: newTickCount } = await problems.problems(problemId)
    expect(newTickCount).to.equal(runningTickCount)

  })
  it.only('creates proofs for multiple bodies', async () => {

    const ticksRun = 20

    const signers = await ethers.getSigners()
    const deployedContracts = await deployContracts()
    const { Problems: problems, Solver: solver, Tocks: tocks, Bodies: bodies } = deployedContracts
    const { problemId } = await mintProblem(signers, deployedContracts)

    const { bodyCount, tickCount } = await problems.problems(problemId)

    const initialBodyCount = bodyCount
    let totalTockCount = 0, runningTickCount = tickCount
    const totalBodies = 10 - bodyCount
    // make a proof for each body quantity
    // mint enough tocks to mint and add a new body before next loop
    for (let i = 0; i <= totalBodies; i++) {
      const { bodyCount } = await problems.problems(problemId)
      expect(bodyCount).to.equal(initialBodyCount.add(i))
      const bodyData = []
      const bodyIds = await problems.getProblemBodyIds(problemId)
      for (let j = 0; j < bodyCount; j++) {
        const bodyId = bodyIds[j]
        const body = await problems.getProblemBodyData(problemId, bodyId)
        bodyData.push(body)
      }
      // console.log({ bodyData })
      let { tx, bodyFinal } = await generateAndSubmitProof(expect, deployedContracts, problemId, bodyCount, ticksRun, bodyData)
      // console.log({ bodyFinal })
      await expect(tx)
        .to.emit(solver, 'Solved')
        .withArgs(problemId, runningTickCount, ticksRun)
      let receipt = await tx.wait()
      runningTickCount = parseInt(runningTickCount) + parseInt(ticksRun)

      // user earned new balance in Tocks token
      const tockCount = getParsedEventLogs(receipt, tocks, 'Transfer')[0].args.value

      totalTockCount = tockCount.add(totalTockCount)
      const boostAmount = await solver.bodyBoost(bodyCount)
      const expectedTockCount = boostAmount.mul(ticksRun)
      expect(tockCount).to.equal(expectedTockCount)

      // confirm new values are stored correctly
      for (let j = 0; j < bodyCount; j++) {
        const bodyId = bodyIds[j]
        const body = await problems.getProblemBodyData(problemId, bodyId)
        const { px, py, vx, vy, radius } = body
        expect(px).to.equal(bodyFinal[j][0].toString())
        expect(py).to.equal(bodyFinal[j][1].toString())
        expect(vx).to.equal(bodyFinal[j][2].toString())
        expect(vy).to.equal(bodyFinal[j][3].toString())
        expect(radius).to.equal(bodyFinal[j][4].toString())
      }

      // add new body
      if (bodyCount.lt(10)) {
        let { tx } = await prepareMintBody(signers, deployedContracts, problemId)
        receipt = await tx.wait()
        const additionalTock = getParsedEventLogs(receipt, tocks, 'Transfer')[0].args.value
        totalTockCount = additionalTock.add(totalTockCount)
        const decimals = await bodies.decimals()
        const bodyCost = await bodies.tockPrice(bodyCount)
        const bodyCostDecimals = bodyCost.mul(decimals)
        tx = await problems.mintBody(problemId)
        receipt = await tx.wait()
        const bodyId = getParsedEventLogs(receipt, bodies, 'Transfer')[0].args.tokenId
        await expect(tx)
          .to.emit(bodies, 'Transfer')
          .withArgs(ethers.constants.AddressZero, signers[0].address, bodyId)
        const tockPaid = getParsedEventLogs(receipt, tocks, 'Transfer')[0].args.value
        expect(tockPaid).to.equal(bodyCostDecimals)
      }
    }
    await expect(prepareMintBody(signers, deployedContracts, problemId))
      .to.be.reverted
    await tocks.updateSolverAddress(signers[0].address)
    await tocks.mint(signers[0].address, (15_625_000n * (10n ** 18n)).toString())
    await tocks.updateSolverAddress(solver.address)

    await expect(problems.mintBody(problemId))
      .to.be.revertedWith('Cannot have more than 10 bodies')

    await expect(bodies.mint(problemId))
      .to.be.revertedWith('Problem already minted 10 bodies')
  })

  it('has the correct body boost amount', async () => {
    const deployedContracts = await deployContracts()
    const { Solver: solver } = deployedContracts
    for (let i = 1; i <= 10; i++) {
      const boostAmount = await solver.bodyBoost(i)
      if (i < 3) {
        expect(boostAmount.eq(0)).to.equal(true)
      } else {
        expect(boostAmount.eq(i)).to.equal(true)
      }
    }
  })
  it.skip('adds a body, removes a body, creates a proof', async () => { })
  it.skip('adds two bodies, removes first body, creates a proof', async () => { })






})
