import { expect } from 'chai'
import hre from 'hardhat'
const ethers = hre.ethers

import {
  deployContracts,
  correctPrice
  // getParsedEventLogs,
  // mintProblem
} from '../scripts/utils.js'

// let tx
describe('Bodies Tests', function () {
  this.timeout(50000000)
  it('has the correct bodies', async () => {
    const deployedContracts = await deployContracts()

    const { Bodies: bodies } = deployedContracts

    for (const [name, contract] of Object.entries(deployedContracts)) {
      if (name === 'Problems') {
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
      bodies.connect(addr1).updateProblemsAddress(addr1.address)
    ).to.be.revertedWith('Ownable: caller is not the owner')

    await expect(bodies.updateProblemsAddress(addr1.address)).to.not.be.reverted
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
    await expect(owner.sendTransaction({ to: bodies.address, value: '1' })).to
      .be.reverted
    await expect(owner.sendTransaction({ to: bodies.address, value: '0' })).to
      .be.reverted
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
})
