import { expect } from 'chai'
import hre from 'hardhat'
const { ethers } = hre

import { deployContracts, mintProblem } from '../scripts/utils.js'
import fs from 'fs'
import prettier from 'prettier'
// let tx
describe('BodyMetadata Tests', function () {
  this.timeout(50000000)

  it('has the correct problems and bodies addresses', async () => {
    const {
      BodyMetadata: bodyMetadata,
      Bodies: bodies,
      Problems: problems
    } = await deployContracts()
    const problemsAddress = await bodyMetadata.problems()
    expect(problemsAddress).to.equal(problems.address)
    const bodiesAddress = await bodyMetadata.bodies()
    expect(bodiesAddress).to.equal(bodies.address)
  })

  it('onlyOwner functions are really only Owner', async function () {
    const [, addr1] = await ethers.getSigners()
    const { BodyMetadata: bodyMetadata } = await deployContracts()
    await expect(
      bodyMetadata.connect(addr1).updateProblemsAddress(addr1.address)
    ).to.be.revertedWith('Ownable: caller is not the owner')
    await expect(bodyMetadata.updateProblemsAddress(addr1.address)).to.not.be
      .reverted
    await expect(
      bodyMetadata.connect(addr1).updateBodiesAddress(addr1.address)
    ).to.be.revertedWith('Ownable: caller is not the owner')
    await expect(bodyMetadata.updateBodiesAddress(addr1.address)).to.not.be
      .reverted
  })

  it.only('creates an SVG', async function () {
    const signers = await ethers.getSigners()
    const deployedContracts = await deployContracts()
    const { BodyMetadata: bodyMetadata } = deployedContracts

    await mintProblem(signers, deployedContracts)

    let svg = await bodyMetadata.getSVG(1)
    svg = svg.replace('data:image/svg+xml;base64,', '')
    const base64ToString = (base64) => {
      const buff = Buffer.from(base64, 'base64')
      return buff.toString('utf-8')
    }

    const svgString = await prettier.format(base64ToString(svg), {
      parser: 'html'
    })

    fs.writeFileSync('body-test.svg', svgString)
  })
})
