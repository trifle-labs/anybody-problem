import { expect } from 'chai'
import hre from 'hardhat'
const { ethers } = hre

import { deployContracts, mintProblem } from '../scripts/utils.js'
import fs from 'fs'
import prettier from 'prettier'
// let tx
describe('ProblemMetadata Tests', function () {
  this.timeout(50000000)

  it('has the correct problems address', async () => {
    const { ProblemMetadata: problemMetadata, Problems: problems } =
      await deployContracts()
    const problemsAddress = await problemMetadata.problems()
    expect(problemsAddress).to.equal(problems.address)
  })

  it('onlyOwner functions are really only Owner', async function () {
    const [, addr1] = await ethers.getSigners()
    const { ProblemMetadata: problemMetadata } = await deployContracts()
    await expect(
      problemMetadata.connect(addr1).updateProblemsAddress(addr1.address)
    ).to.be.revertedWith('Ownable: caller is not the owner')
    await expect(problemMetadata.updateProblemsAddress(addr1.address)).to.not.be
      .reverted
  })

  it('creates an SVG', async function () {
    const signers = await ethers.getSigners()
    const deployedContracts = await deployContracts()
    const { ProblemMetadata: problemMetadata } = deployedContracts

    const { problemId } = await mintProblem(signers, deployedContracts)

    let svg = await problemMetadata.getSVG(problemId)
    svg = svg.replace('data:image/svg+xml;base64,', '')
    const base64ToString = (base64) => {
      const buff = Buffer.from(base64, 'base64')
      return buff.toString('utf-8')
    }

    const svgString = await prettier.format(base64ToString(svg), {
      parser: 'html'
    })

    fs.writeFileSync('problem-test.svg', svgString)
  })
})
