import { expect } from 'chai'
import hre from 'hardhat'
const ethers = hre.ethers

import {
  deployContracts,
  /*splitterAddress,*/ getParsedEventLogs,
  prepareMintBody,
  mintProblem,
  generateAndSubmitProof
} from '../scripts/utils.js'
const proverTickIndex = {
  3: 500,
  4: 100,
  5: 100,
  6: 100,
  7: 100,
  8: 100,
  9: 50,
  10: 50
}

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

    await expect(
      solver.connect(addr1).updateProblemsAddress(addr1.address)
    ).to.be.revertedWith('Ownable: caller is not the owner')

    await expect(
      solver.connect(addr1).updateTocksAddress(addr1.address)
    ).to.be.revertedWith('Ownable: caller is not the owner')

    await expect(solver.updateProblemsAddress(addr1.address)).to.not.be.reverted

    await expect(solver.updateTocksAddress(addr1.address)).to.not.be.reverted
  })

  it('fallback and receive functions revert', async () => {
    const [owner] = await ethers.getSigners()
    const { Solver: solver } = await deployContracts()
    await expect(owner.sendTransaction({ to: solver.address, value: '1' })).to
      .be.reverted
    await expect(owner.sendTransaction({ to: solver.address, value: '0' })).to
      .be.reverted
  })

  it.only('creates a proof for 3 bodies', async () => {
    const signers = await ethers.getSigners()
    const deployedContracts = await deployContracts()
    const {
      Problems: problems,
      Solver: solver,
      Tocks: tocks
    } = deployedContracts
    const { problemId } = await mintProblem(signers, deployedContracts)

    const bodyData = []
    const { bodyCount, tickCount } = await problems.problems(problemId)
    const bodyIds = await problems.getProblemBodyIds(problemId)
    for (let i = 0; i < bodyCount; i++) {
      const bodyId = bodyIds[i]
      const body = await problems.getProblemBodyData(problemId, bodyId)
      bodyData.push(body)
    }

    const ticksRun = proverTickIndex[bodyCount.toNumber()]

    const { tx, bodyFinal } = await generateAndSubmitProof(
      expect,
      deployedContracts,
      problemId,
      bodyCount,
      ticksRun,
      bodyData
    )

    await expect(tx)
      .to.emit(solver, 'Solved')
      .withArgs(problemId, tickCount, ticksRun)
    const receipt = await tx.wait()

    // user earned new balance in Tocks token
    const tockCount = getParsedEventLogs(receipt, tocks, 'Transfer')[0].args
      .value
    const { bodyCount: newBodyCount } = await problems.problems(problemId)
    const decimals = await solver.decimals()
    const boostAmount = await solver.bodyBoost(newBodyCount)
    const expectedTockCount = boostAmount.mul(decimals.mul(ticksRun))
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
    const signers = await ethers.getSigners()
    const deployedContracts = await deployContracts()
    const {
      Problems: problems,
      Solver: solver,
      Tocks: tocks
    } = deployedContracts
    const { problemId } = await mintProblem(signers, deployedContracts)

    const { bodyCount, tickCount } = await problems.problems(problemId)
    const ticksRun = proverTickIndex[bodyCount.toNumber()]
    const totalTicks = 2 * ticksRun
    let totalTockCount = ethers.BigNumber.from(0),
      runningTickCount = tickCount
    for (let i = 0; i < totalTicks; i += ticksRun) {
      const bodyData = []
      const bodyIds = await problems.getProblemBodyIds(problemId)
      for (let j = 0; j < bodyCount; j++) {
        const bodyId = bodyIds[j]
        const body = await problems.getProblemBodyData(problemId, bodyId)
        bodyData.push(body)
      }

      // console.log({ bodyData })
      const { tx, bodyFinal } = await generateAndSubmitProof(
        expect,
        deployedContracts,
        problemId,
        bodyCount,
        ticksRun,
        bodyData
      )
      // console.log({ bodyFinal })
      await expect(tx)
        .to.emit(solver, 'Solved')
        .withArgs(problemId, runningTickCount, ticksRun)
      const receipt = await tx.wait()
      runningTickCount = runningTickCount.add(ticksRun)

      // user earned new balance in Tocks token
      const tockCount = getParsedEventLogs(receipt, tocks, 'Transfer')[0].args
        .value
      totalTockCount = totalTockCount.add(tockCount)
      const { bodyCount: newBodyCount } = await problems.problems(problemId)

      const decimals = await solver.decimals()
      const boostAmount = await solver.bodyBoost(newBodyCount)
      const expectedTockCount = boostAmount.mul(decimals.mul(ticksRun))
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
  it('creates proofs for multiple bodies', async () => {
    const signers = await ethers.getSigners()
    const deployedContracts = await deployContracts()
    const {
      Problems: problems,
      Solver: solver,
      Tocks: tocks,
      Bodies: bodies
    } = deployedContracts
    const { problemId } = await mintProblem(signers, deployedContracts)

    const { bodyCount, tickCount } = await problems.problems(problemId)

    const initialBodyCount = bodyCount
    let totalTockCount = 0,
      runningTickCount = tickCount
    const totalBodies = 10 - bodyCount
    // make a proof for each body quantity
    // mint enough tocks to mint and add a new body before next loop
    for (let i = 0; i <= totalBodies; i++) {
      const { bodyCount } = await problems.problems(problemId)
      // console.log({ bodyCount: bodyCount.toString(), initialBodyCount: initialBodyCount.toString(), i, add: initialBodyCount.add(i).toString() })
      expect(bodyCount.toString()).to.equal(initialBodyCount.add(i).toString())
      const bodyData = []
      const bodyIds = await problems.getProblemBodyIds(problemId)
      for (let j = 0; j < bodyCount; j++) {
        const bodyId = bodyIds[j]
        const body = await problems.getProblemBodyData(problemId, bodyId)
        bodyData.push(body)
      }
      const ticksRun = proverTickIndex[bodyCount.toNumber()]
      // console.log({ bodyData })
      let { tx, bodyFinal } = await generateAndSubmitProof(
        expect,
        deployedContracts,
        problemId,
        bodyCount,
        ticksRun,
        bodyData
      )
      // console.log({ bodyFinal })
      await expect(tx)
        .to.emit(solver, 'Solved')
        .withArgs(problemId, runningTickCount, ticksRun)
      let receipt = await tx.wait()
      runningTickCount = parseInt(runningTickCount) + parseInt(ticksRun)

      // user earned new balance in Tocks token
      const tockCount = getParsedEventLogs(receipt, tocks, 'Transfer')[0].args
        .value

      totalTockCount = tockCount.add(totalTockCount)
      const decimals = await solver.decimals()
      const boostAmount = await solver.bodyBoost(bodyCount)
      const expectedTockCount = boostAmount.mul(decimals.mul(ticksRun))
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
        let { tx } = await prepareMintBody(
          signers,
          deployedContracts,
          problemId
        )
        receipt = await tx.wait()
        const additionalTock = getParsedEventLogs(receipt, tocks, 'Transfer')[0]
          .args.value
        totalTockCount = additionalTock.add(totalTockCount)
        const decimals = await bodies.decimals()
        const bodyCost = await bodies.tockPrice(bodyCount)
        const bodyCostDecimals = bodyCost.mul(decimals)
        tx = await problems.mintBodyToProblem(problemId)
        receipt = await tx.wait()
        const bodyId = getParsedEventLogs(receipt, bodies, 'Transfer')[0].args
          .tokenId
        await expect(tx)
          .to.emit(bodies, 'Transfer')
          .withArgs(ethers.constants.AddressZero, signers[0].address, bodyId)
        const tockPaid = getParsedEventLogs(receipt, tocks, 'Transfer')[0].args
          .value
        expect(tockPaid).to.equal(bodyCostDecimals)
      }
    }
    await expect(prepareMintBody(signers, deployedContracts, problemId)).to.be
      .reverted
    await tocks.updateSolverAddress(signers[0].address)
    await tocks.mint(signers[0].address, (15_625_000n * 10n ** 18n).toString())
    await tocks.updateSolverAddress(solver.address)

    await expect(problems.mintBodyToProblem(problemId)).to.be.revertedWith(
      'Cannot have more than 10 bodies'
    )

    await expect(problems.mintBodyOutsideProblem(problemId)).to.be.revertedWith(
      'Cannot have more than 10 bodies'
    )
  })

  it('has the correct body boost amount', async () => {
    const deployedContracts = await deployContracts()
    const { Solver: solver } = deployedContracts
    for (let i = 1; i <= 10; i++) {
      const boostAmount = await solver.bodyBoost(i)
      if (i < 3) {
        expect(boostAmount.eq(0)).to.equal(true)
      } else {
        const boosted = 2 ** (i - 3)
        expect(boostAmount.eq(boosted)).to.equal(true)
      }
    }
  })
  it('adds a body, removes a body, creates a proof', async () => {
    const signers = await ethers.getSigners()
    const deployedContracts = await deployContracts()
    const {
      Problems: problems,
      Bodies: bodies,
      Solver: solver
    } = deployedContracts
    let { problemId, receipt } = await mintProblem(signers, deployedContracts)
    let bodyIds = await getParsedEventLogs(receipt, bodies, 'Transfer')
    // make bodyIds array unique
    bodyIds = [...new Set(bodyIds.map((body) => body.args.tokenId.toNumber()))]
    expect(bodyIds.length).to.equal(3)
    await prepareMintBody(signers, deployedContracts, problemId)
    let tx = await problems.mintBodyToProblem(problemId)
    receipt = await tx.wait()
    const newBodyId = await getParsedEventLogs(receipt, bodies, 'Transfer')[0]
      .args.tokenId

    const removedBodyId = bodyIds[0]
    await expect(problems.removeBody(problemId, removedBodyId)).to.not.be
      .reverted

    await expect(problems.removeBody(problemId, bodyIds[1])).to.be.revertedWith(
      'Cannot have less than 3 bodies'
    )

    let { bodyCount } = await problems.problems(problemId)
    expect(bodyCount).to.equal(3)
    let bodyData = []
    let newBodyIds = await problems.getProblemBodyIds(problemId)
    for (let j = 0; j < bodyCount; j++) {
      const bodyId = newBodyIds[j]
      const body = await problems.getProblemBodyData(problemId, bodyId)
      bodyData.push(body)
    }
    const ticksRun = proverTickIndex[bodyCount.toNumber()]

    // console.log({ bodyData })
    ;({ tx } = await generateAndSubmitProof(
      expect,
      deployedContracts,
      problemId,
      bodyCount,
      ticksRun,
      bodyData
    ))
    // console.log({ bodyFinal })
    await expect(tx).to.emit(solver, 'Solved').withArgs(problemId, 0, ticksRun)

    await expect(problems.addExistingBody(problemId, removedBodyId)).to.not.be
      .reverted

    const { bodyCount: newBodyCount } = await problems.problems(problemId)
    expect(newBodyCount).to.equal(4)

    bodyData = []
    newBodyIds = await problems.getProblemBodyIds(problemId)
    for (let j = 0; j < newBodyCount; j++) {
      const bodyId = newBodyIds[j]
      const body = await problems.getProblemBodyData(problemId, bodyId)
      bodyData.push(body)
    }
    // console.log({ bodyData })
    ;({ tx } = await generateAndSubmitProof(
      expect,
      deployedContracts,
      problemId,
      newBodyCount,
      ticksRun,
      bodyData
    ))

    await expect(tx)
      .to.emit(solver, 'Solved')
      .withArgs(problemId, ticksRun, ticksRun)

    const problemBodyIds = await problems.getProblemBodyIds(problemId)
    expect(problemBodyIds[0]).to.equal(2)
    expect(problemBodyIds[1]).to.equal(3)
    expect(problemBodyIds[2]).to.equal(newBodyId)
    expect(problemBodyIds[3]).to.equal(removedBodyId)

    bodyData = []
    const wrongBodyIds = [1, 2, 3, 4]
    for (let j = 0; j < newBodyCount; j++) {
      const bodyId = wrongBodyIds[j]
      const body = await problems.getProblemBodyData(problemId, bodyId)
      bodyData.push(body)
    }
    try {
      await generateAndSubmitProof(
        expect,
        deployedContracts,
        problemId,
        newBodyCount,
        ticksRun,
        bodyData
      )
      expect.fail('should have reverted')
    } catch (e) {
      expect(e).to.be.an('error')
    }
  })
  it.skip('adds two bodies, removes first body, creates a proof', async () => {})
})
