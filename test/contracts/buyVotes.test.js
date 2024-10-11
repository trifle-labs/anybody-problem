// import { expect } from 'chai'
// import hre from 'hardhat'
// const ethers = hre.ethers

import {
  deployBuyVotes
  // getParsedEventLogs,
  // mintProblem
} from '../../scripts/utils.js'

// let tx
describe('BuyVotes Tests', function () {
  this.timeout(50000000)

  it.only('deployBuyVotes', async function () {
    await deployBuyVotes()
  })
})
