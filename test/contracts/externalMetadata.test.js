import { expect } from 'chai'
import hre from 'hardhat'
const { ethers } = hre
import { DOMParser } from 'xmldom'
// import { Anybody } from '../../dist/module.js'

import {
  deployContracts,
  solveLevel,
  getParsedEventLogs,
  deployContractsV0,
  deployAnybodyProblemV1
} from '../../scripts/utils.js'
import fs from 'fs'
import prettier from 'prettier'
// let tx
describe('ExternalMetadata Tests', function () {
  this.timeout(50000000)

  it('has the correct anybodyProblem and speedruns addresses', async () => {
    const {
      AnybodyProblem: anybodyProblem,
      Speedruns: speedruns,
      ExternalMetadata: externalMetadata
    } = await deployContracts()
    const anybodyProblemAddress = await externalMetadata.anybodyProblem()
    expect(anybodyProblemAddress).to.equal(anybodyProblem.address)

    const speedrunsAddress = await externalMetadata.speedruns()
    expect(speedrunsAddress).to.equal(speedruns.address)
  })

  it('onlyOwner functions are really only Owner', async function () {
    const [, addr1] = await ethers.getSigners()
    const { ExternalMetadata: externalMetadata } = await deployContracts()

    await expect(
      externalMetadata.connect(addr1).updateAnybodyProblemAddress(addr1.address)
    ).to.be.revertedWith('Ownable: caller is not the owner')
    await expect(externalMetadata.updateAnybodyProblemAddress(addr1.address)).to
      .not.be.reverted
    await expect(
      externalMetadata.connect(addr1).updateSpeedrunsAddress(addr1.address)
    ).to.be.revertedWith('Ownable: caller is not the owner')
    await expect(externalMetadata.updateSpeedrunsAddress(addr1.address)).to.not
      .be.reverted
  })

  it('has valid json', async function () {
    const [owner] = await ethers.getSigners()

    const { AnybodyProblemV0, ExternalMetadata, Speedruns } =
      await deployContractsV0({ mock: true, verbose: true })

    const { AnybodyProblem: anybodyProblem } = await deployAnybodyProblemV1({
      ExternalMetadata,
      AnybodyProblemV0,
      Speedruns,
      mock: true,
      verbose: true
    })
    const finalArgs = [null, true, 0, [], [], [], [], []]
    let runId = 0
    for (let i = 0; i < 5; i++) {
      const level = i + 1
      const solvedReturn = await solveLevel(
        owner.address,
        anybodyProblem,
        expect,
        runId,
        level,
        false
      )
      const args = solvedReturn.args
      finalArgs[0] = runId
      finalArgs[1] = true // alsoMint
      finalArgs[2] = 0 // day
      finalArgs[3].push(args[3][0])
      finalArgs[4].push(args[4][0])
      finalArgs[5].push(args[5][0])
      finalArgs[6].push(args[6][0])
      finalArgs[7].push(args[7][0])
    }
    const price = await anybodyProblem.priceToMint()
    const tx = await anybodyProblem.batchSolve(...finalArgs, { value: price })
    const receipt = await tx.wait()
    const events = getParsedEventLogs(receipt, anybodyProblem, 'RunCreated')
    const day = events[0].args.day

    const anybodyProblemAddress = await ExternalMetadata.anybodyProblem()
    expect(anybodyProblemAddress).to.equal(anybodyProblem.address)
    const base64Json = await Speedruns.uri(day)

    const utf8Json = Buffer.from(
      base64Json.replace('data:application/json;base64,', ''),
      'base64'
    ).toString('utf-8')
    // console.dir({ utf8Json }, { depth: null })
    const json = JSON.parse(utf8Json)
    // console.dir({ json }, { depth: null })
    const base64SVG = json.image

    // console.log('-----base64 image-----')
    // console.table( base64SVG )

    const SVG = Buffer.from(
      base64SVG.replace('data:image/svg+xml;base64,', ''),
      'base64'
    ).toString('utf-8')
    //console.log("---------image----------")
    //console.table({ SVG })

    const isValidSVG = (svg) => {
      try {
        const parser = new DOMParser()
        const doc = parser.parseFromString(svg, 'image/svg+xml')
        return doc.documentElement.tagName.toLowerCase() === 'svg'
      } catch (error) {
        //console.log({ error })
        return false
      }
    }

    const isSVGValid = isValidSVG(SVG)
    expect(isSVGValid).to.be.true
    const yearMonth = json.attributes[2].value
    const YYYY_MM = new Date().toISOString().slice(0, 7)
    expect(yearMonth).to.equal(YYYY_MM) //'1970-01'

    let svg = await ExternalMetadata.getSVG(day)
    svg = svg.replace('data:image/svg+xml;base64,', '')
    const base64ToString = (base64) => {
      const buff = Buffer.from(base64, 'base64')
      return buff.toString('utf-8')
    }

    const svgString = await prettier.format(base64ToString(svg), {
      parser: 'html'
    })

    fs.writeFileSync('problem-test.svg', svgString)

    const animation_url = json.animation_url
    const baseURLScores = animation_url.split('-').pop()
    const scores = Buffer.from(baseURLScores, 'base64').toString('utf-8')
    const scoresAsJson = JSON.parse(scores)
    expect(scoresAsJson.levels.length).to.equal(5)
    // const anybody = new Anybody(null, { util: true, day })
    // console.log(anybody.bodies[0].c)
  })
})
