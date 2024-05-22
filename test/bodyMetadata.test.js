import { expect } from 'chai'
import hre from 'hardhat'
const { ethers } = hre

import { deployContracts, mintProblem } from '../scripts/utils.js'
import fs from 'fs'
import prettier from 'prettier'
import { DOMParser } from 'xmldom'
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

  it('has valid json', async function () {
    const signers = await ethers.getSigners()

    const deployedContracts = await deployContracts()
    await mintProblem(signers, deployedContracts)
    const { BodyMetadata: bodyMetadata, Bodies: bodies } = deployedContracts

    const bodyId = 1

    const base64Json = await bodyMetadata.getBodyMetadata(bodyId)

    const utf8Json = Buffer.from(
      base64Json.replace('data:application/json;base64,', ''),
      'base64'
    ).toString('utf-8')
    const json = JSON.parse(utf8Json)
    const base64SVG = json.image
    const SVG = Buffer.from(
      base64SVG.replace('data:image/svg+xml;base64,', ''),
      'base64'
    ).toString('utf-8')
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
    const jsonSeed = json.attributes[2].value
    const { seed } = await bodies.bodies(bodyId)
    expect(jsonSeed).to.equal(seed.toString())
  })

  it('creates an SVG', async function () {
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
