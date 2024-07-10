import { expect } from 'chai'
import hre from 'hardhat'
const ethers = hre.ethers

import {
  deployContracts
  // correctPrice
  // getParsedEventLogs,
  // mintProblem
} from '../../scripts/utils.js'

// let tx
describe('Speedruns Tests', function () {
  this.timeout(50000000)

  it('onlyAnybodyProblem functions can only be called by AnybodyProblem address', async function () {
    const [owner, acct1, acct2] = await ethers.getSigners()
    const { Speedruns: speedruns } = await deployContracts()
    const functions = [
      {
        name: '__mint',
        args: [1, acct1.address]
      },
      {
        name: '__mint',
        args: [2, acct2.address]
      },
      {
        name: '__burn',
        args: [2]
      },
      {
        name: '__approve',
        args: [owner.address, 1]
      },
      {
        name: '__transfer_single',
        args: [acct1.address, acct2.address, 1, 1, '']
      },
      {
        name: 'emitGenericEvent',
        args: [[], '0x']
      }
    ]

    for (const { name, args } of functions) {
      await expect(speedruns[name](...args)).to.be.revertedWith(
        'Only Anybody Problem can call'
      )
    }

    await speedruns.updateAnybodyProblemAddress(owner.address)

    for (const { name, args } of functions) {
      await expect(speedruns[name](...args)).to.not.be.reverted
    }
  })

  it('has all the correct interfaces', async () => {
    const interfaces = [
      { name: 'ERC165', id: '0x01ffc9a7', supported: true },
      { name: 'ERC721', id: '0x80ac58cd', supported: true },
      { name: 'ERC721Metadata', id: '0x5b5e139f', supported: true },
      { name: 'ERC4906MetadataUpdate', id: '0x49064906', supported: true },
      { name: 'ERC721Enumerable', id: '0x780e9d63', supported: false },
      { name: 'ERC2981', id: '0x2a55205a', supported: true },
      { name: 'ERC20', id: '0x36372b07', supported: false }
    ]
    const { Speedruns: speedruns } = await deployContracts()

    for (let i = 0; i < interfaces.length; i++) {
      const { name, id, supported } = interfaces[i]

      const supportsInterface2 = await speedruns.supportsInterface(id)
      expect(name + supportsInterface2).to.equal(name + supported)
    }
  })

  it('has a token with id 0 that is owned by itself', async () => {
    const { Speedruns: speedruns } = await deployContracts()
    const owner = await speedruns.ownerOf(0)
    expect(owner).to.equal(speedruns.address)
  })
})
