import { expect } from 'chai'
import hre from 'hardhat'
const ethers = hre.ethers

import {
  deployContracts,
  /*splitterAddress,*/ getParsedEventLogs,
  prepareMintBody,
  mintProblem,
  generateAndSubmitProof,
  getTicksRun,
  generateProof
} from '../scripts/utils.js'

import { Anybody } from '../src/anybody.js'

// let tx
describe('Solver Tests', function () {
  this.timeout(50000000)

  it('has the correct problems, dust addresses', async () => {
    const deployedContracts = await deployContracts()

    const { Solver: solver } = deployedContracts

    for (const [name, contract] of Object.entries(deployedContracts)) {
      if (name === 'Problems' || name === 'Dust') {
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
      solver.connect(addr1).updateDustAddress(addr1.address)
    ).to.be.revertedWith('Ownable: caller is not the owner')

    await expect(solver.updateProblemsAddress(addr1.address)).to.not.be.reverted

    await expect(solver.updateDustAddress(addr1.address)).to.not.be.reverted
  })

  it('fallback and receive functions revert', async () => {
    const [owner] = await ethers.getSigners()
    const { Solver: solver } = await deployContracts()
    await expect(owner.sendTransaction({ to: solver.address, value: '1' })).to
      .be.reverted
    await expect(owner.sendTransaction({ to: solver.address, value: '0' })).to
      .be.reverted
  })

  it('creates a proof for 3 bodies', async () => {
    const signers = await ethers.getSigners()
    const deployedContracts = await deployContracts()
    const {
      Problems: problems
      // Solver: solver,
      // Dust: dust
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

    const ticksRun = await getTicksRun(bodyCount.toNumber())

    const { tx, bodyFinal } = await generateAndSubmitProof(
      expect,
      deployedContracts,
      problemId,
      bodyCount,
      ticksRun,
      bodyData
    )

    // await expect(tx)
    //   .to.emit(solver, 'Solved')
    //   .withArgs(problemId, tickCount, ticksRun)
    // const receipt = await tx.wait()
    await tx.wait()

    // user earned new balance in Dust token
    // const dustCount = getParsedEventLogs(receipt, dust, 'Transfer')[0].args
    //   .value
    // const { bodyCount: newBodyCount } = await problems.problems(problemId)
    // const decimals = await solver.decimals()
    // const boostAmount = await solver.bodyBoost(newBodyCount)
    // const expectedDustCount = boostAmount.mul(decimals.mul(ticksRun))
    // expect(dustCount).to.equal(expectedDustCount)
    // expect(dustCount.gt(0)).to.equal(true)

    const { tickCount: tickCountAfter } = await problems.problems(problemId)

    expect(tickCountAfter).to.equal(tickCount.add(ticksRun))

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

  it('shoots 3 missiles and hits 3 bodies in 1 proof', async () => {
    const signers = await ethers.getSigners()
    const deployedContracts = await deployContracts()
    const { Problems: problems, Solver: solver, Dust: dust } = deployedContracts
    const { problemId } = await mintProblem(signers, deployedContracts)

    // we're spoofing the solver address to overwrite the starting positions of the bodies
    // so that we can guarantee that the missiles in place will hit them
    // TODO: this exposes a flaw in the circuit, the missiles must begin at the corner
    const [owner] = signers
    await problems.updateSolverAddress(owner.address)

    const { bodyCount, seed } = await problems.problems(problemId)
    const ticksRun = await getTicksRun(bodyCount)
    const bodyIds = await problems.getProblemBodyIds(problemId)
    let missileInits = []
    const anybody = new Anybody(null, {
      util: true,
      mode: 'game',
      stopEvery: ticksRun
    })

    const bodyData = []
    for (let i = 0; i < bodyCount; i++) {
      const bodyId = bodyIds[i]
      let body = await problems.getProblemBodyData(problemId, bodyId)
      const scalingFactor = await problems.scalingFactor()
      const pos = ethers.BigNumber.from(i + 1)
        .mul(body.radius.mul(2).div(scalingFactor))
        .add(10)

      const windowWidth = ethers.BigNumber.from(anybody.windowWidth)
      const mid = windowWidth.div(2)

      body = {
        bodyId: body.bodyId,
        mintedBodyIndex: body.mintedBodyIndex,
        bodyIndex: body.bodyIndex,
        px: scalingFactor.mul(pos),
        py: scalingFactor.mul(mid),
        vx: body.vx,
        vy: body.vy,
        radius: body.radius,
        starLvl: body.starLvl,
        maxStarLvl: body.maxStarLvl,
        seed: body.seed
      }
      bodyData.push(body)

      await problems.updateProblemBody(problemId, bodyId, body)

      const radius = 10
      const missilePos = pos.sub(body.radius.div(scalingFactor).div(2))

      const missile = {
        step: i * 2,
        position: anybody.createVector(missilePos, mid),
        velocity: anybody.createVector(1, 0),
        radius
      }
      missileInits.push(missile)
    }

    // restore the correct solver address after overwriting the body positions
    await problems.updateSolverAddress(solver.address)

    missileInits = anybody.processMissileInits(missileInits)
    anybody.missileInits = missileInits
    const { missiles } = anybody.finish()
    const { dataResult } = await generateProof(
      seed,
      bodyCount,
      ticksRun,
      bodyData,
      'game',
      missiles
    )
    for (let i = 0; i < bodyCount; i++) {
      const radiusIndex = i * 5 + 4
      expect(dataResult.publicSignals[radiusIndex]).to.equal('0')
    }

    const tx = await solver.solveProblem(
      problemId,
      ticksRun,
      dataResult.a,
      dataResult.b,
      dataResult.c,
      dataResult.Input
    )

    const receipt = await tx.wait()

    // user earned new balance in Dust token
    const dustCount = getParsedEventLogs(receipt, dust, 'Transfer')[0].args
      .value

    const speedBoost = await solver.getSpeedBoost(ticksRun)
    expect(speedBoost).to.equal(6)

    const bodyBoost = await solver.bodyBoost(bodyCount)
    expect(bodyBoost).to.equal(1)

    const decimals = await solver.decimals()
    expect(decimals).to.equal(ethers.BigNumber.from(10).pow(18))

    const expectedDustCount = bodyCount.mul(speedBoost).mul(bodyBoost)
    expect(expectedDustCount).to.equal(3 * 6 * 1)

    expect(dustCount).to.equal(expectedDustCount.mul(decimals))

    await expect(tx).to.emit(solver, 'Solved')
    // .withArgs(problemId, runningTickCount, ticksRun)
  })

  it('shoots 4 missiles and hits 4 bodies in 3 proofs', async () => {
    const params = [
      '1',
      300,
      [
        [
          '11406441073632636054785043687037415681059320080183196557357177686873031545114',
          '12347980993067629024933241365593894873087075221326507215042062372296871903495'
        ],
        [
          '15261363253950989142005688394549427629310525404944664203183747377193654998664',
          '12137760860986070006158696995874988734179661758888148984844875981145002346879'
        ],
        [
          '16246931609221274247499149114165580770578075111237355088607243275089205780630',
          '2104127996008392958345836988921891531341481632907446443674606477937171514444'
        ]
      ],
      [
        [
          [
            '19151099716705975359931104913721610710938431920242229522559705589912813148609',
            '3177287224827158768923337106590951392752708634128980770526331175208780937144'
          ],
          [
            '16059595155176117703898135537221874173498028002428221044819295805096614793305',
            '11400265460099275466879951619978770696805313455399128081229987568280024622809'
          ]
        ],
        [
          [
            '8364982996301787739906174134492113727380633184105637631396672974493078058190',
            '15555051875908758103312404406888934573829832747522855658789980955284251786434'
          ],
          [
            '2359543416670367032401750474992596196317531698383140441041709813817984088200',
            '396848734139445205866487559406220354291267116815027463239501322486778152674'
          ]
        ],
        [
          [
            '11503658638353706112908546910316310714524825276014047802446977487522057078050',
            '21616818622710997040118926070875679846551192098621833213953814528995514459254'
          ],
          [
            '18499037497941172234868872132075707549252642701243311496884599887296445002065',
            '20019714680422696764758988290584098858184291164385943002505217161274636605532'
          ]
        ]
      ],
      [
        [
          '16224014869229354081623039554383508210384941957674596962851766716358824931637',
          '18015708890834172552695539310892481394915413215989077362809536258518073069149'
        ],
        [
          '4968736126745506686743827642118882623406694005087848318481979193483345809281',
          '17588741629055896788671841097116556282248518028516527307178092074599451737251'
        ],
        [
          '1564353057094845605772263486327790530304659503632133987497375991003496791614',
          '16399413438360213481235547382433326613409275026695733232508282146321049234396'
        ]
      ],
      [
        [
          '287194',
          '386421',
          '15690',
          '10234',
          '12000',
          '776070',
          '535496',
          '18323',
          '5657',
          '12000',
          '654727',
          '610376',
          '11059',
          '6813',
          '0',
          '851567',
          '252655',
          '5860',
          '13038',
          '12000',
          '262252', // first body, starting position x
          '35080',
          '8812',
          '7756',
          '12000',
          '93450',
          '484930',
          '14450',
          '10355',
          '12000',
          '46020',
          '230075',
          '17670',
          '7631',
          '7000',
          '894391',
          '311426',
          '10000',
          '10000',
          '12000'
        ],
        [
          '407934',
          '73896',
          '17574',
          '13079',
          '0',
          '718679',
          '638160',
          '15770',
          '3537',
          '12000',
          '972427',
          '655804',
          '11059',
          '6813',
          '0',
          '732733',
          '143406',
          '6529',
          '12313',
          '0',
          '287194',
          '386421',
          '15690',
          '10234',
          '12000',
          '776070',
          '535496',
          '18323',
          '5657',
          '12000',
          '654727',
          '610376',
          '11059',
          '6813',
          '0',
          '851567',
          '252655',
          '5860',
          '13038',
          '12000'
        ],
        [
          '666512',
          '997596',
          '17574',
          '13079',
          '0',
          '444290',
          '702702',
          '15770',
          '3537',
          '0',
          '289107',
          '700422',
          '11059',
          '6813',
          '0',
          '694552',
          '837306',
          '6529',
          '12313',
          '0',
          '407934',
          '73896',
          '17574',
          '13079',
          '0',
          '718679',
          '638160',
          '15770',
          '3537',
          '12000',
          '972427',
          '655804',
          '11059',
          '6813',
          '0',
          '732733',
          '143406',
          '6529',
          '12313',
          '0'
        ]
      ]
    ]

    const signers = await ethers.getSigners()
    const deployedContracts = await deployContracts(true)
    const { problemId } = await mintProblem(signers, deployedContracts)
    const {
      Dust: dust,
      Problems: problems,
      Bodies: bodies,
      Solver: solver
    } = deployedContracts
    await dust.updateSolverAddress(signers[0].address)
    const { bodyCount } = await problems.problems(problemId)
    const dustPrice = await bodies.dustPrice(bodyCount)
    const decimals = await bodies.decimals()
    const dustAmount = dustPrice.mul(decimals)
    await dust.mint(signers[0].address, dustAmount)
    await dust.updateSolverAddress(deployedContracts.Solver.address)
    await problems.mintBodyToProblem(problemId)

    await problems.updateSolverAddress(signers[0].address)
    const { bodyCount: newBodyCount } = await problems.problems(problemId)
    expect(newBodyCount).to.equal(bodyCount.add(1))
    for (let i = 0; i < newBodyCount.toNumber(); i++) {
      const invertedBodyId = i + 1
      const { bodyId, mintedBodyIndex, bodyIndex, starLvl, maxStarLvl, seed } =
        await problems.getProblemBodyData(problemId, invertedBodyId)

      const newX = params[5][0][5 * 4 + i * 5 + 0]
      const newY = params[5][0][5 * 4 + i * 5 + 1]
      const newVX = params[5][0][5 * 4 + i * 5 + 2]
      const newVY = params[5][0][5 * 4 + i * 5 + 3]
      const newRadius = params[5][0][5 * 4 + i * 5 + 4]
      if (i == 0) {
        expect(newX).to.equal('262252')
      }

      const body = {
        bodyId,
        mintedBodyIndex,
        bodyIndex,
        px: newX,
        py: newY,
        vx: newVX,
        vy: newVY,
        radius: newRadius,
        starLvl,
        maxStarLvl,
        seed
      }
      await problems.updateProblemBody(problemId, invertedBodyId, body)
      const { px, py, vx, vy, radius } = await problems.getProblemBodyData(
        problemId,
        invertedBodyId
      )
      expect(px).to.equal(newX)
      expect(py).to.equal(newY)
      expect(vx).to.equal(newVX)
      expect(vy).to.equal(newVY)
      expect(radius).to.equal(newRadius)
    }
    await problems.updateSolverAddress(deployedContracts.Solver.address)

    const tx = await solver.batchSolve(...params)

    const receipt = await tx.wait()

    // user earned new balance in Dust token
    const dustCount = getParsedEventLogs(receipt, dust, 'Transfer')[0].args
      .value

    const ticksRun = params[1] * params[2].length

    const speedBoost = await solver.getSpeedBoost(ticksRun)
    expect(speedBoost).to.equal(5)

    const bodyBoost = await solver.bodyBoost(newBodyCount)
    expect(bodyBoost).to.equal(2)

    const expectedDustCount = newBodyCount.mul(speedBoost).mul(bodyBoost)
    expect(expectedDustCount).to.equal(4 * 5 * 2)

    expect(dustCount).to.equal(expectedDustCount.mul(decimals))

    await expect(tx).to.emit(solver, 'Solved')
  })

  it('creates multiple proofs in a row', async () => {
    const signers = await ethers.getSigners()
    const deployedContracts = await deployContracts()
    const {
      Problems: problems
      // Solver: solver,
      // Dust: dust
    } = deployedContracts
    const { problemId } = await mintProblem(signers, deployedContracts)

    const { bodyCount, tickCount } = await problems.problems(problemId)
    const ticksRun = await getTicksRun(bodyCount.toNumber())
    const totalTicks = 2 * ticksRun
    // let totalDustCount = ethers.BigNumber.from(0),
    let runningTickCount = tickCount
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
      // await expect(tx)
      //   .to.emit(solver, 'Solved')
      //   .withArgs(problemId, runningTickCount, ticksRun)
      // const receipt = await tx.wait()
      await tx.wait()
      runningTickCount = runningTickCount.add(ticksRun)

      // user earned new balance in Dust token
      // const dustCount = getParsedEventLogs(receipt, dust, 'Transfer')[0].args
      //   .value
      // totalDustCount = totalDustCount.add(dustCount)
      // const { bodyCount: newBodyCount } = await problems.problems(problemId)

      // const decimals = await solver.decimals()
      // const boostAmount = await solver.bodyBoost(newBodyCount)
      // const expectedDustCount = boostAmount.mul(decimals.mul(ticksRun))
      // expect(dustCount).to.equal(expectedDustCount)

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

    // const dustBalance = await dust.balanceOf(signers[0].address)
    // expect(dustBalance).to.equal(totalDustCount)

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
      Dust: dust,
      Bodies: bodies
    } = deployedContracts
    const { problemId } = await mintProblem(signers, deployedContracts)

    const { bodyCount, tickCount } = await problems.problems(problemId)

    const initialBodyCount = bodyCount
    let totalDustCount = 0,
      runningTickCount = tickCount
    const totalBodies = 10 - bodyCount
    // make a proof for each body quantity
    // mint enough dust to mint and add a new body before next loop
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
      const ticksRun = await getTicksRun(bodyCount.toNumber())
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
      // await expect(tx)
      //   .to.emit(solver, 'Solved')
      //   .withArgs(problemId, runningTickCount, ticksRun)
      let receipt = await tx.wait()
      runningTickCount = parseInt(runningTickCount) + parseInt(ticksRun)

      // user earned new balance in Dust token
      // const dustCount = getParsedEventLogs(receipt, dust, 'Transfer')[0].args
      //   .value

      // totalDustCount = dustCount.add(totalDustCount)
      // const decimals = await solver.decimals()
      // const boostAmount = await solver.bodyBoost(bodyCount)
      // const expectedDustCount = boostAmount.mul(decimals.mul(ticksRun))
      // expect(dustCount).to.equal(expectedDustCount)

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
        const additionalDust = getParsedEventLogs(receipt, dust, 'Transfer')[0]
          .args.value
        totalDustCount = additionalDust.add(totalDustCount)
        const decimals = await bodies.decimals()
        const bodyCost = await bodies.dustPrice(bodyCount)
        const bodyCostDecimals = bodyCost.mul(decimals)
        tx = await problems.mintBodyToProblem(problemId)
        receipt = await tx.wait()
        const bodyId = getParsedEventLogs(receipt, bodies, 'Transfer')[0].args
          .tokenId
        await expect(tx)
          .to.emit(bodies, 'Transfer')
          .withArgs(ethers.constants.AddressZero, signers[0].address, bodyId)
        const dustPaid = getParsedEventLogs(receipt, dust, 'Transfer')[0].args
          .value
        expect(dustPaid).to.equal(bodyCostDecimals)
      }
    }
    await expect(prepareMintBody(signers, deployedContracts, problemId)).to.be
      .reverted
    await dust.updateSolverAddress(signers[0].address)
    await dust.mint(signers[0].address, (15_625_000n * 10n ** 18n).toString())
    await dust.updateSolverAddress(solver.address)

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
  it('has the correct speed boost amount', async () => {
    const deployedContracts = await deployContracts()
    const { Solver: solver } = deployedContracts
    // chunks of 500
    const expectedResults = [
      { ticks: 500, boost: 6 },
      { ticks: 1000, boost: 5 },
      { ticks: 1500, boost: 4 },
      { ticks: 2000, boost: 3 },
      { ticks: 2500, boost: 2 },
      { ticks: 3000, boost: 1 }
    ]
    for (const { ticks, boost } of expectedResults) {
      const speedBoost = await solver.getSpeedBoost(ticks)
      expect(speedBoost.eq(boost)).to.equal(true)
    }
  })

  it('adds a body, removes a body, creates a proof', async () => {
    const signers = await ethers.getSigners()
    const deployedContracts = await deployContracts()
    const {
      Problems: problems,
      Bodies: bodies
      // Solver: solver
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
    const ticksRunA = await getTicksRun(bodyData.length)

    // console.log({ bodyData })
    ;({ tx } = await generateAndSubmitProof(
      expect,
      deployedContracts,
      problemId,
      bodyCount,
      ticksRunA,
      bodyData
    ))
    // console.log({ bodyFinal })
    // await expect(tx).to.emit(solver, 'Solved').withArgs(problemId, 0, ticksRunA)

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
    const ticksRunB = await getTicksRun(bodyData.length)
    // console.log({ bodyData })
    ;({ tx } = await generateAndSubmitProof(
      expect,
      deployedContracts,
      problemId,
      newBodyCount,
      ticksRunB,
      bodyData
    ))

    // await expect(tx)
    //   .to.emit(solver, 'Solved')
    //   .withArgs(problemId, ticksRunA, ticksRunB)

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
    const ticksRunC = await getTicksRun(bodyData.length)
    try {
      await generateAndSubmitProof(
        expect,
        deployedContracts,
        problemId,
        newBodyCount,
        ticksRunC,
        bodyData
      )
      expect.fail('should have reverted')
    } catch (e) {
      expect(e).to.be.an('error')
    }
  })
  // it.skip('adds two bodies, removes first body, creates a proof', async () => {})
})
