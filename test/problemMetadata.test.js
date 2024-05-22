import { expect } from 'chai'
import hre from 'hardhat'
const { ethers } = hre
import { DOMParser } from 'xmldom'

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

  it('has valid json', async function () {
    const signers = await ethers.getSigners()

    const deployedContracts = await deployContracts()
    await mintProblem(signers, deployedContracts)
    const { ProblemMetadata: problemMetadata, Problems: problems } =
      deployedContracts

    const problemId = 1

    const base64Json = await problemMetadata.getProblemMetadata(problemId)
    // console.log({ base64Json })
    const utf8Json = Buffer.from(
      base64Json.replace('data:application/json;base64,', ''),
      'base64'
    ).toString('utf-8')
    // console.dir({ utf8Json }, { depth: null })
    const json = JSON.parse(utf8Json)
    // console.dir({ json }, { depth: null })
    const base64SVG = json.image
    const SVG = Buffer.from(
      base64SVG.replace('data:image/svg+xml;base64,', ''),
      'base64'
    ).toString('utf-8')
    // console.log({ SVG })
    const isValidSVG = (svg) => {
      try {
        const parser = new DOMParser()
        const doc = parser.parseFromString(svg, 'image/svg+xml')
        return doc.documentElement.tagName.toLowerCase() === 'svg'
      } catch (error) {
        console.log({ error })
        return false
      }
    }

    const isSVGValid = isValidSVG(SVG)
    expect(isSVGValid).to.be.true
    const jsonSeed = json.attributes[1].value
    const { seed } = await problems.problems(problemId)
    expect(jsonSeed).to.equal(seed.toString())
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
