
import { utils } from '../src/anybody.js'
const _validateSeed = utils._validateSeed
// const { describe, it } = require('mocha')
//jest
import { expect } from 'chai'

describe('Utilities work as expected', () => {
  it('should only allow valid seeds', async () => {
    const seeds = [
      { seed: '0x0000000000000000000000000000000000000000000000000000000000000000', valid: true },
      { seed: '0x8e1f6167233de553d850aab3ae16768f18e5c6417c905ad8ceeaee173aaaf9d4', valid: true },
      { seed: '0x8e1f6167233de553d850aab3ae16768f18e5c6417c905ad8ceeaee173aaaf9d', valid: false },
      { seed: '8e1f6167233de553d850aab3ae16768f18e5c6417c905ad8ceeaee173aaaf9d4', valid: false },
      { seed: '0x8e1f6167233de553d850aab3ae16768f18e5c6417c905ad8ceeaee173aaaf9dz', valid: false },
      { seed: '0y8e1f6167233de553d850aab3ae16768f18e5c6417c905ad8ceeaee173aaaf9d4', valid: false },
      { seed: 4017741812988343445777915824879947022053757317635066333357807822927668359069n, valid: true },
      { seed: 115792089237316195423570985008687907853269984665640564039457584007913129639935n, valid: true },
      { seed: -1n, valid: false },
      { seed: 115792089237316195423570985008687907853269984665640564039457584007913129639936n, valid: false },
      { seed: 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFn, valid: true },
      { seed: 1, valid: false }
    ]

    for (let i = 0; i < seeds.length; i++) {
      const seed = seeds[i]
      let valid
      try {
        _validateSeed(seed.seed)
        valid = true
      } catch (_) {
        valid = false
      }
      expect(valid).to.equal(seed.valid)
    }
  })
})
