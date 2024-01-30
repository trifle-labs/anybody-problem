const { expect } = require('chai')
const { ethers } = require('hardhat')
// const { describe, it } = require('mocha')

const { deployContracts, correctPrice, splitterAddress, getParsedEventLogs, prepareMintBody, mintProblem } = require('../scripts/utils.js')
let tx
describe('Problem Tests', function () {
  this.timeout(50000000)

  it('has the correct verifiers metadata, bodies, tocks, solver addresses', async () => {

    const deployedContracts = await deployContracts()

    const { Problems: problems } = deployedContracts
    for (const [name, contract] of Object.entries(deployedContracts)) {
      if (name === 'Problems') continue
      if (name === 'Tocks') continue
      let storedAddress
      if (name.indexOf('Verifier') > -1) {
        const bodyCount = name.split('_')[1]
        storedAddress = await problems.verifiers(bodyCount, 20)
      } else {
        const functionName = name.toLowerCase()
        storedAddress = await problems[`${functionName}()`]()
      }
      const actualAddress = contract.address
      expect(storedAddress).to.equal(actualAddress)
    }

    // TODO: update with actual start date
    const startDate = await problems.startDate()
    const actualStartDate = 'Thu Jan 01 2099 00:00:00 GMT+0000'
    const actualStartDateInUnixTime = Date.parse(actualStartDate) / 1000
    expect(startDate).to.equal(actualStartDateInUnixTime)
  })

  it('onlyOwner functions are really only Owner', async function () {
    const [, addr1] = await ethers.getSigners()
    const { Problems: problems } = await deployContracts()

    await expect(problems.connect(addr1).updatePrice(0))
      .to.be.revertedWith('Ownable: caller is not the owner')

    await expect(problems.connect(addr1).updatePaused(true))
      .to.be.revertedWith('Ownable: caller is not the owner')

    await expect(problems.connect(addr1).updateStartDate(0))
      .to.be.revertedWith('Ownable: caller is not the owner')

    await expect(problems.connect(addr1).updateVerifier(addr1.address, 0, 0))
      .to.be.revertedWith('Ownable: caller is not the owner')

    await expect(problems.connect(addr1).updateSolverAddress(addr1.address))
      .to.be.revertedWith('Ownable: caller is not the owner')

    await expect(problems.connect(addr1).updateMetadataAddress(addr1.address))
      .to.be.revertedWith('Ownable: caller is not the owner')

    await expect(problems.connect(addr1).updateBodiesAddress(addr1.address))
      .to.be.revertedWith('Ownable: caller is not the owner')

    await expect(problems.connect(addr1).updateWalletAddress(addr1.address))
      .to.be.revertedWith('Ownable: caller is not the owner')


    await expect(problems.updatePrice(0))
      .to.not.be.reverted

    await expect(problems.updatePaused(true))
      .to.not.be.reverted

    await expect(problems.updateStartDate(0))
      .to.not.be.reverted

    await expect(problems.updateVerifier(addr1.address, 0, 0))
      .to.not.be.reverted

    await expect(problems.updateSolverAddress(addr1.address))
      .to.not.be.reverted

    await expect(problems.updateMetadataAddress(addr1.address))
      .to.not.be.reverted

    await expect(problems.updateBodiesAddress(addr1.address))
      .to.not.be.reverted

    await expect(problems.updateWalletAddress(addr1.address))
      .to.not.be.reverted

  })

  it('onlySolver functions are really only Solver', async () => {
    const [owner, addr1] = await ethers.getSigners()
    const { Problems: problems } = await deployContracts()

    const { problemId } = await mintProblem([addr1], { Problems: problems }, addr1)
    await problems.updateSolverAddress(owner.address)

    await expect(problems.connect(addr1).updateProblemBodyCount(problemId, 1))
      .to.be.revertedWith('Only Solver can call')
    const newBodyCount = 1
    await expect(problems.updateProblemBodyCount(problemId, newBodyCount))
      .to.not.be.reverted
    const { bodyCount } = await problems.problems(problemId)
    expect(bodyCount).to.equal(newBodyCount)

    const newBodyIds = [9, 8, 7, 6, 5, 4, 3, 2, 1, 1111]
    await expect(problems.connect(addr1).updateProblemBodyIds(problemId, newBodyIds))
      .to.be.revertedWith('Only Solver can call')
    await expect(problems.updateProblemBodyIds(problemId, newBodyIds))
      .to.not.be.reverted
    const returnedBodyIds = await problems.getProblemBodyIds(problemId)
    for (let i = 0; i < newBodyIds.length; i++) {
      expect(returnedBodyIds[i]).to.equal(newBodyIds[i])
    }

    const newTickCount = 999
    await expect(problems.connect(addr1).updateProblemTickCount(problemId, newTickCount))
      .to.be.revertedWith('Only Solver can call')
    await expect(problems.updateProblemTickCount(problemId, newTickCount))
      .to.not.be.reverted
    const { tickCount } = await problems.problems(problemId)
    expect(tickCount).to.equal(newTickCount)

    const newBodyData = {
      bodyId: 8,
      bodyStyle: 9,
      bodyIndex: 10,
      px: 11,
      py: 12,
      vx: 13,
      vy: 14,
      radius: 15,
      seed: '0x' + (666).toString(16).padStart(64, '0')
    }
    await expect(problems.connect(addr1).updateProblemBody(problemId, 1, newBodyData))
      .to.be.revertedWith('Only Solver can call')
    await expect(problems.updateProblemBody(problemId, 0, newBodyData))
      .to.not.be.reverted
    const bodyData = await problems.getProblemBodyData(problemId, 0)
    expect(bodyData.bodyId).to.equal(newBodyData.bodyId)
    expect(bodyData.bodyStyle).to.equal(newBodyData.bodyStyle)
    expect(bodyData.bodyIndex).to.equal(newBodyData.bodyIndex)
    expect(bodyData.px).to.equal(newBodyData.px)
    expect(bodyData.py).to.equal(newBodyData.py)
    expect(bodyData.vx).to.equal(newBodyData.vx)
    expect(bodyData.vy).to.equal(newBodyData.vy)
    expect(bodyData.radius).to.equal(newBodyData.radius)
    expect(bodyData.seed).to.equal(newBodyData.seed)

  })


  it('has all the correct interfaces', async () => {
    const interfaces = [
      { name: 'ERC165', id: '0x01ffc9a7', supported: true },
      { name: 'ERC721', id: '0x80ac58cd', supported: true },
      { name: 'ERC721Metadata', id: '0x5b5e139f', supported: true },
      { name: 'ERC4906MetadataUpdate', id: '0x49064906', supported: false },
      { name: 'ERC721Enumerable', id: '0x780e9d63', supported: false },
      { name: 'ERC2981', id: '0x2a55205a', supported: false },
      { name: 'ERC20', id: '0x36372b07', supported: false },
    ]

    for (let i = 0; i < interfaces.length; i++) {
      const { name, id, supported } = interfaces[i]
      const { Problems: problems } = await deployContracts()
      const supportsInterface = await problems.supportsInterface(id)
      expect(name + supportsInterface).to.equal(name + supported)
    }
  })


  it('emits \'EthMoved\' events when eth is moved', async () => {
    const [, addr1] = await ethers.getSigners()
    const { Problems: problems, Metadata: metadata } = await deployContracts()

    // set splitter to metadata address which cannot recive eth
    await problems.updateWalletAddress(metadata.address)

    await problems.updatePaused(false)
    await problems.updateStartDate(0)

    const balanceBefore = await ethers.provider.getBalance(problems.address)
    expect(balanceBefore).to.equal(0)

    // mint will succeed but the EthMoved event will show the eth transfer failed
    tx = problems['mint()']({ value: correctPrice })
    await expect(tx)
      .to.emit(problems, 'EthMoved')
      .withArgs(metadata.address, false, '0x', correctPrice)

    // problems still has the eth
    const balanceAfter = await ethers.provider.getBalance(problems.address)
    expect(balanceAfter).to.equal(correctPrice)

    // only owner can call recoverUnsuccessfulMintPayment
    await expect(problems.connect(addr1).recoverUnsuccessfulMintPayment(addr1.address))
      .to.be.revertedWith('Ownable: caller is not the owner')


    // get the balance of the eventual recipient
    const balanceOfAddr1Before = await ethers.provider.getBalance(addr1.address)

    // recover eth stuck in problems and send to addr1 using owner address
    tx = problems.recoverUnsuccessfulMintPayment(addr1.address)
    await expect(tx)
      .to.emit(problems, 'EthMoved')
      .withArgs(addr1.address, true, '0x', correctPrice)

    const balanceOfAddr1After = await ethers.provider.getBalance(addr1.address)
    expect(balanceOfAddr1After.sub(balanceOfAddr1Before)).to.equal(correctPrice)
  })

  it('fails when unitialized', async function () {
    const [owner] = await ethers.getSigners()
    // deploy Problems without setting bodies
    const Problems = await ethers.getContractFactory('Problems')
    const problems = await Problems.deploy(owner.address, [owner.address], [1], [1])
    await problems.deployed()
    await problems.updatePaused(false)
    await problems.updateStartDate(0)
    await expect(problems['mint()']({ value: correctPrice }))
      .to.be.revertedWith('Not initialized')
  })

  it('fails to adminMint when uninitialized', async function () {
    const [owner, , , addr3] = await ethers.getSigners()
    // deploy Problems without setting Bodies
    const Problems = await ethers.getContractFactory('Problems')
    const problems = await Problems.deploy(owner.address, [owner.address], [1], [1])
    await problems.deployed()

    await expect(problems.adminMint(addr3.address))
      .to.be.revertedWith('Not initialized')
  })

  it('fails to adminMint when not owner', async function () {
    const [, , , addr3,] = await ethers.getSigners()
    const { Problems: problems } = await deployContracts()
    await expect(problems.connect(addr3).adminMint(addr3.address))
      .to.be.revertedWith('Ownable: caller is not the owner')
  })

  it('sends money to splitter correctly', async function () {
    const [, , , addr3] = await ethers.getSigners()
    const { Problems: problems } = await deployContracts()
    await problems.updatePaused(false)
    await problems.updateStartDate(0)
    await problems.connect(addr3)['mint()']({ value: correctPrice })
    expect(await problems.ownerOf(1)).to.equal(addr3.address)
    var splitterBalance = await ethers.provider.getBalance(splitterAddress)
    expect(splitterBalance == correctPrice)
  })

  it('must be unpaused', async function () {
    const [, addr1] = await ethers.getSigners()
    const { Problems: problems } = await deployContracts()
    await problems.updatePaused(true)
    await problems.updateStartDate(0)
    await expect(problems.connect(addr1)['mint()']({ value: correctPrice }))
      .to.be.revertedWith('Paused')
  })

  //
  // Minting tests
  //

  it('succeeds to mint', async function () {
    const [owner] = await ethers.getSigners()
    const { Problems: problems } = await deployContracts()
    await problems.updatePaused(true)

    await expect(problems['mint()']({ value: correctPrice }))
      .to.be.revertedWith('Paused')

    await problems.updatePaused(false)
    await problems.updateStartDate(0)
    await expect(problems['mint()']({ value: correctPrice }))
      .to.emit(problems, 'Transfer')
      .withArgs(ethers.constants.AddressZero, owner.address, 1)
  })

  it('succeeds to mint with fallback method', async function () {
    const [, , addr2] = await ethers.getSigners()
    const { Problems: problems } = await deployContracts()
    await problems.updatePaused(false)
    await problems.updateStartDate(0)

    await expect(addr2.sendTransaction({ to: problems.address, value: 0 }))
      .to.be.revertedWith('Invalid price')

    const correctPrice = await problems.price()
    // send ether to an address
    await expect(addr2.sendTransaction({ to: problems.address, value: correctPrice }))
      .to.emit(problems, 'Transfer')
      .withArgs(ethers.constants.AddressZero, addr2.address, 1)

    const balance = await problems.balanceOf(addr2.address)
    expect(balance).to.equal(1)

  })


  it('succeeds to mint with explicit recipient', async function () {
    const [, addr1] = await ethers.getSigners()
    const { Problems: problems } = await deployContracts()
    await problems.updatePaused(true)
    await expect(problems['mint(address)'](addr1.address, { value: correctPrice }))
      .to.be.revertedWith('Paused')

    await problems.updatePaused(false)
    await problems.updateStartDate(0)
    await expect(problems['mint(address)'](addr1.address, { value: correctPrice }))
      .to.emit(problems, 'Transfer')
      .withArgs(ethers.constants.AddressZero, addr1.address, 1)
  })

  it('token ID is correctly correlated', async function () {
    const { Problems: problems } = await deployContracts()
    await problems.updatePaused(false)
    await problems.updateStartDate(0)
    await problems['mint()']({ value: correctPrice })
    const tokenID = await problems.problemSupply()
    expect(tokenID).to.equal(1)
  })

  it('validate second mint event', async function () {
    const [owner, addr1] = await ethers.getSigners()
    const { Problems: problems } = await deployContracts()
    await problems.updatePaused(false)
    await problems.updateStartDate(0)
    await expect(problems['mint()']({ value: correctPrice }))
      .to.emit(problems, 'Transfer')
      .withArgs(ethers.constants.AddressZero, owner.address, 1)
    await expect(problems.connect(addr1)['mint()']({ value: correctPrice }))
      .to.emit(problems, 'Transfer')
      .withArgs(ethers.constants.AddressZero, addr1.address, 2)
  })

  it('checks whether mint fails with wrong price and succeeds even when price = 0', async function () {
    const [owner] = await ethers.getSigners()
    const { Problems: problems } = await deployContracts()
    await problems.updatePaused(false)
    await problems.updateStartDate(0)
    await expect(problems['mint()']())
      .to.be.revertedWith('Invalid price')
    await problems.updatePrice('0')

    await expect(problems['mint()']()).to.emit(problems, 'Transfer')
      .withArgs(ethers.constants.AddressZero, owner.address, 1)
  })

  it('adminMint from owner address', async function () {
    const [, addr1] = await ethers.getSigners()
    const { Problems: problems } = await deployContracts()
    await problems.adminMint(addr1.address)
    expect(await problems.ownerOf(1)).to.equal(addr1.address)
  })


  // anybody relevant logic

  it('stores the verifiers in the correct order of the mapping', async () => {
    const deployedContracts = await deployContracts()
    const { Problems: problems } = deployedContracts
    const tickCount = 20
    for (const [name, contract] of Object.entries(deployedContracts)) {
      if (name.indexOf('Verifier') === -1) continue
      const bodyCount = name.split('_')[1]
      const storedAddress = await problems.verifiers(bodyCount, tickCount)
      const actualAddress = contract.address
      expect(storedAddress).to.equal(actualAddress)
    }
  })

  it('mints bodies that contain valid values', async () => {
    const { Problems: problems } = await deployContracts()
    await problems.updatePaused(false)
    await problems.updateStartDate(0)
    await problems['mint()']({ value: correctPrice })
    const problemId = await problems.problemSupply()
    const problem = await problems.problems(problemId)
    const { seed, bodyCount, tickCount, bodiesProduced } = problem
    expect(parseInt(seed, 16)).to.not.equal(0)
    expect(bodyCount).to.equal(3)
    expect(bodiesProduced).to.equal(3)
    expect(tickCount).to.equal(0)

    const scalingFactor = await problems.scalingFactor()
    const maxVector = await problems.maxVector()
    const maxRadius = await problems.maxRadius()
    const windowWidth = await problems.windowWidth()

    const bodyIDs = await problems.getProblemBodyIds(problemId)

    const initialVelocity = maxVector.mul(scalingFactor)
    for (let i = 0; i < bodyCount; i++) {
      const currentBodyId = bodyIDs[i]
      const bodyData = await problems.getProblemBodyData(problemId, currentBodyId)
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

      expect(seed).to.not.equal(0)
    }
  })

  it('mints a body via mintBody', async () => {
    const signers = await ethers.getSigners()
    // const [, acct1] = signers
    const deployedContracts = await deployContracts()
    const { Bodies: bodies, Problems: problems } = deployedContracts
    const { problemId } = await mintProblem(signers, deployedContracts)

    const scalingFactor = await problems.scalingFactor()
    const maxVector = await problems.maxVector()
    const maxRadius = await problems.maxRadius()
    const windowWidth = await problems.windowWidth()
    const initialVelocity = maxVector.mul(scalingFactor)

    const bodyIds = await problems.getProblemBodyIds(problemId)
    const { bodyCount } = await problems.problems(problemId)
    await prepareMintBody(signers, deployedContracts, problemId)
    const tx = await problems.mintBody(problemId)
    const receipt = await tx.wait()
    const newBodyId = getParsedEventLogs(receipt, bodies, 'Transfer')[0].args.tokenId
    const { bodyCount: newBodyCount } = await problems.problems(problemId)
    expect(newBodyCount).to.equal(bodyCount.add(1))

    const newBodyIds = await problems.getProblemBodyIds(problemId)
    for (let i = 0; i < newBodyCount; i++) {
      const newBodyId = newBodyIds[i]
      const oldBodyId = i >= bodyCount ? newBodyId : bodyIds[i]
      expect(newBodyId).to.equal(oldBodyId)
    }

    const bodyData = await problems.getProblemBodyData(problemId, newBodyId)
    const { bodyId, bodyIndex, px, py, vx, vy, radius, seed } = bodyData

    expect(bodyId).to.equal(newBodyId)
    expect(bodyIndex).to.equal(newBodyCount.sub(1))

    expect(px).to.not.equal(0)
    expect(px.lt(windowWidth)).to.be.true

    expect(py).to.not.equal(0)
    expect(py.lt(windowWidth)).to.be.true

    expect(px).to.not.equal(py)

    expect(vx).to.equal(initialVelocity)
    expect(vy).to.equal(initialVelocity)

    expect(radius).to.not.equal(0)
    expect(radius.lte(maxRadius.mul(scalingFactor))).to.be.true

    expect(seed).to.not.equal(0)

  })




})
