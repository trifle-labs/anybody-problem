import { expect } from 'chai'
import hre from 'hardhat'
const { ethers } = hre

import { deployContracts, mintProblem } from '../scripts/utils.js'
import fs from 'fs'
import prettier from 'prettier'
// let tx
describe('Metadata Tests', function () {
  this.timeout(50000000)

  it('has the correct problems address', async () => {
    const { Metadata: metadata, Problems: problems } = await deployContracts()
    const problemsAddress = await metadata.problems()
    expect(problemsAddress).to.equal(problems.address)
  })

  it('onlyOwner functions are really only Owner', async function () {
    const [, addr1] = await ethers.getSigners()
    const { Metadata: metadata } = await deployContracts()
    await expect(
      metadata.connect(addr1).updateProblemsAddress(addr1.address)
    ).to.be.revertedWith('Ownable: caller is not the owner')
    await expect(metadata.updateProblemsAddress(addr1.address)).to.not.be
      .reverted
  })

  it('creates an SVG', async function () {
    const signers = await ethers.getSigners()
    const deployedContracts = await deployContracts()
    const { Metadata: metadata } = deployedContracts

    const { problemId } = await mintProblem(signers, deployedContracts)

    let svg = await metadata.getSVG(problemId)
    svg = svg.replace('data:image/svg+xml;base64,', '')
    const base64ToString = (base64) => {
      const buff = Buffer.from(base64, 'base64')
      return buff.toString('utf-8')
    }

    const svgString = await prettier.format(base64ToString(svg), {
      parser: 'html'
    })

    fs.writeFileSync('test.svg', svgString)
  })
})
