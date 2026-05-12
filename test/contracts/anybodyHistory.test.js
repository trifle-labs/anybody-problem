import { expect } from 'chai'
import hre from 'hardhat'
import { describe, it } from 'mocha'
const { ethers } = hre

const ZERO_BYTES32 =
  '0x0000000000000000000000000000000000000000000000000000000000000000'

const makeBody = (i) => ({
  bodyIndex: i,
  px: 100 + i,
  py: 200 + i,
  vx: 300 + i,
  vy: 400 + i,
  radius: 10 + i,
  seed: ethers.utils.hexZeroPad(ethers.utils.hexlify(i + 1), 32)
})

const makeLevel = (idx, time) => ({
  solved: true,
  time,
  seed: ethers.utils.hexZeroPad(ethers.utils.hexlify(idx + 1), 32),
  tmpInflightMissile: [0, 0, 0, 0, 0],
  tmpBodyData: [
    makeBody(0),
    makeBody(1),
    makeBody(2),
    makeBody(3),
    makeBody(4),
    makeBody(5)
  ]
})

const deployStub = async (kind) => {
  const Factory = await ethers.getContractFactory(
    kind === 'v0' ? 'HistoryStubV0' : 'HistoryStubV1Plus'
  )
  const stub = await Factory.deploy()
  await stub.deployed()
  return stub
}

const deployResolver = async (history) => {
  const Factory = await ethers.getContractFactory('AnybodyHistory')
  const resolver = await Factory.deploy(history.map((c) => c.address))
  await resolver.deployed()
  return resolver
}

describe('AnybodyHistory resolver', function () {
  this.timeout(60_000)

  it('rejects zero-address entries in constructor', async () => {
    const Factory = await ethers.getContractFactory('AnybodyHistory')
    await expect(
      Factory.deploy([ethers.constants.AddressZero])
    ).to.be.revertedWith('AH: zero history entry')
  })

  it('exposes the history array (newest-first)', async () => {
    const [v0, v1, v2] = await Promise.all([
      deployStub('v0'),
      deployStub('v1'),
      deployStub('v1')
    ])
    const resolver = await deployResolver([v2, v1, v0])

    expect(await resolver.historyLength()).to.equal(3)
    expect(await resolver.history(0)).to.equal(v2.address)
    expect(await resolver.history(1)).to.equal(v1.address)
    expect(await resolver.history(2)).to.equal(v0.address)
  })

  describe('gamesPlayed', () => {
    it('sums totals across mixed-shape versions', async () => {
      const [, player] = await ethers.getSigners()
      const v0 = await deployStub('v0')
      const v1 = await deployStub('v1')
      const v2 = await deployStub('v1')
      await v0.setGamesPlayed(player.address, 3, 1000, 1)
      await v1.setGamesPlayed(player.address, 5, 2000, 2)
      await v2.setGamesPlayed(player.address, 7, 1500, 4)

      const resolver = await deployResolver([v2, v1, v0])
      const r = await resolver.gamesPlayed(player.address)
      expect(r.total).to.equal(15)
      expect(r.lastPlayed).to.equal(2000)
      expect(r.streak).to.equal(2)
      expect(r.updated).to.equal(false)
    })

    it('pairs streak with the most-recent lastPlayed regardless of position', async () => {
      const [, player] = await ethers.getSigners()
      const v0 = await deployStub('v0')
      const v1 = await deployStub('v1')
      await v1.setGamesPlayed(player.address, 1, 500, 9)
      await v0.setGamesPlayed(player.address, 1, 9999, 42)

      const resolver = await deployResolver([v1, v0])
      const r = await resolver.gamesPlayed(player.address)
      expect(r.total).to.equal(2)
      expect(r.lastPlayed).to.equal(9999)
      expect(r.streak).to.equal(42)
    })

    it('returns zeroed record for unknown player', async () => {
      const [, , unknown] = await ethers.getSigners()
      const v0 = await deployStub('v0')
      const v1 = await deployStub('v1')
      const resolver = await deployResolver([v1, v0])

      const r = await resolver.gamesPlayed(unknown.address)
      expect(r.total).to.equal(0)
      expect(r.lastPlayed).to.equal(0)
      expect(r.streak).to.equal(0)
    })
  })

  describe('runs / runExists / getLevelsData', () => {
    it('returns the first version (newest-first) that owns the runId', async () => {
      const [, alice, bob] = await ethers.getSigners()
      const v0 = await deployStub('v0')
      const v1 = await deployStub('v1')

      const seed = ethers.utils.hexZeroPad('0xabcd', 32)
      await v0.setRun(42, alice.address, true, 1234, seed, 7)
      await v0.pushLevel(42, makeLevel(0, 600))
      await v0.pushLevel(42, makeLevel(1, 634))

      await v1.setRun(99, bob.address, true, 555, seed, 8)
      await v1.pushLevel(99, makeLevel(0, 555))

      const resolver = await deployResolver([v1, v0])

      const r42 = await resolver.runs(42)
      expect(r42.owner).to.equal(alice.address)
      expect(r42.solved).to.equal(true)
      expect(r42.accumulativeTime).to.equal(1234)
      expect(r42.seed).to.equal(seed)
      expect(r42.day).to.equal(7)
      expect(r42.levels.length).to.equal(2)
      expect(r42.levels[0].time).to.equal(600)
      expect(r42.levels[1].time).to.equal(634)

      const r99 = await resolver.runs(99)
      expect(r99.owner).to.equal(bob.address)
      expect(r99.levels.length).to.equal(1)
    })

    it('prefers the newest version that owns a runId when multiple have one', async () => {
      const [, alice, bob] = await ethers.getSigners()
      const v0 = await deployStub('v0')
      const v1 = await deployStub('v1')

      const seed0 = ethers.utils.hexZeroPad('0x01', 32)
      const seed1 = ethers.utils.hexZeroPad('0x02', 32)
      await v0.setRun(7, alice.address, false, 100, seed0, 1)
      await v1.setRun(7, bob.address, true, 200, seed1, 2)

      const resolver = await deployResolver([v1, v0])
      const r = await resolver.runs(7)
      expect(r.owner).to.equal(bob.address)
      expect(r.accumulativeTime).to.equal(200)
      expect(r.seed).to.equal(seed1)
      expect(r.day).to.equal(2)
    })

    it('returns empty run + false for an unknown runId', async () => {
      const v0 = await deployStub('v0')
      const v1 = await deployStub('v1')
      const resolver = await deployResolver([v1, v0])

      const r = await resolver.runs(123)
      expect(r.owner).to.equal(ethers.constants.AddressZero)
      expect(r.levels.length).to.equal(0)
      expect(await resolver.runExists(123)).to.equal(false)
    })

    it('runExists is true when any version owns the runId', async () => {
      const [, alice] = await ethers.getSigners()
      const v0 = await deployStub('v0')
      const v1 = await deployStub('v1')
      await v0.setRun(33, alice.address, true, 1, ZERO_BYTES32, 1)

      const resolver = await deployResolver([v1, v0])
      expect(await resolver.runExists(33)).to.equal(true)
    })

    it('getLevelsData reads from the version that owns the runId', async () => {
      const [, alice] = await ethers.getSigners()
      const v0 = await deployStub('v0')
      const v1 = await deployStub('v1')

      await v0.setRun(11, alice.address, true, 10, ZERO_BYTES32, 1)
      await v0.pushLevel(11, makeLevel(0, 333))
      await v0.pushLevel(11, makeLevel(1, 444))
      await v0.pushLevel(11, makeLevel(2, 555))

      const resolver = await deployResolver([v1, v0])
      const levels = await resolver.getLevelsData(11)
      expect(levels.length).to.equal(3)
      expect(levels.map((l) => l.time.toNumber())).to.deep.equal([333, 444, 555])
    })

    it('getLevelsData returns empty for an unknown runId', async () => {
      const v0 = await deployStub('v0')
      const v1 = await deployStub('v1')
      const resolver = await deployResolver([v1, v0])
      const levels = await resolver.getLevelsData(999)
      expect(levels.length).to.equal(0)
    })
  })

  describe('fastestByDay', () => {
    it('per-slot probe: first non-zero entry walking newest-to-oldest wins', async () => {
      const v0 = await deployStub('v0')
      const v1 = await deployStub('v1')
      const v2 = await deployStub('v1')

      // day 5 slot 0: only v0 has it -> falls through
      await v0.setFastestByDay(5, 0, 111)
      // day 5 slot 1: v1 and v2 both have it, newest (v2) wins
      await v1.setFastestByDay(5, 1, 222)
      await v2.setFastestByDay(5, 1, 999)
      // day 5 slot 2: only v1
      await v1.setFastestByDay(5, 2, 333)

      const resolver = await deployResolver([v2, v1, v0])
      const out = await resolver.fastestByDay(5)
      expect(out[0]).to.equal(111)
      expect(out[1]).to.equal(999)
      expect(out[2]).to.equal(333)
    })

    it('returns zeros when nothing is set for a day', async () => {
      const v0 = await deployStub('v0')
      const v1 = await deployStub('v1')
      const resolver = await deployResolver([v1, v0])
      const out = await resolver.fastestByDay(77)
      expect(out[0]).to.equal(0)
      expect(out[1]).to.equal(0)
      expect(out[2]).to.equal(0)
    })
  })
})
