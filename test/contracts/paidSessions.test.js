import { expect } from 'chai'
import { describe, it, before, beforeEach } from 'mocha'

import hre from 'hardhat'
const ethers = hre.ethers

import { deployContractsV5, deployPaidSessions } from '../../scripts/utils.js'

const USDC = (n) => ethers.utils.parseUnits(n.toString(), 6)
const BPS = 10_000
const MUL_ONE = ethers.BigNumber.from(10).pow(18)

const Status = {
  None: 0,
  Open: 1,
  Committed: 2,
  Settled: 3,
  Forfeited: 4
}

const setup = async (options = {}) =>
  deployContractsV5({ mock: true, verbose: false, ...options })

const fundUSDC = async (mockUsdc, account, amount) => {
  await mockUsdc.mint(account.address, amount)
}

const approve = async (mockUsdc, owner, spender, amount) => {
  await mockUsdc.connect(owner).approve(spender, amount)
}

const advanceTime = async (seconds) => {
  await hre.network.provider.send('evm_increaseTime', [seconds])
  await hre.network.provider.send('evm_mine')
}

const mineOne = async () => {
  await hre.network.provider.send('evm_mine')
}

/// Deploy the V5 chain plus a PaidSessionsMock wired to it. Optionally seed the
/// prize pool with `poolFund` USDC so tiers are immediately buyable.
const deployAll = async (options = {}) => {
  const env = await setup(options.v5Options || {})
  const { PaidSessions } = await deployPaidSessions({
    AnybodyProblemV5: env.AnybodyProblemV5,
    MockUSDC: env.MockUSDC,
    shortWindowSize: options.shortWindowSize ?? 10,
    houseFeeBps: options.houseFeeBps ?? 0,
    concentrationBps: options.concentrationBps ?? 1000,
    feeRecipient: options.feeRecipient,
    mock: true
  })

  if (options.poolFund) {
    const [owner] = await ethers.getSigners()
    await fundUSDC(env.MockUSDC, owner, options.poolFund)
    await approve(env.MockUSDC, owner, PaidSessions.address, options.poolFund)
    await PaidSessions.fundPrizePool(options.poolFund)
  }

  if (options.tiers) {
    for (const [tier, entryFee, enabled] of options.tiers) {
      await PaidSessions.setTier(tier, entryFee, enabled)
    }
  }

  return { ...env, PaidSessions }
}

describe('PaidSessions', function () {
  this.timeout(50_000_000)

  // ============================================================
  describe('constructor', () => {
    it('wires up anybody, usdc, fee recipient, and payout config', async () => {
      const { AnybodyProblemV5, MockUSDC } = await setup()
      const [owner] = await ethers.getSigners()
      const Factory = await ethers.getContractFactory('PaidSessionsMock')
      const ps = await Factory.deploy(
        AnybodyProblemV5.address,
        MockUSDC.address,
        owner.address,
        10,
        0,
        1000
      )
      await ps.deployed()

      expect(await ps.anybody()).to.equal(AnybodyProblemV5.address)
      expect(await ps.usdc()).to.equal(MockUSDC.address)
      expect(await ps.feeRecipient()).to.equal(owner.address)
      expect(await ps.shortWindowSize()).to.equal(10)
      expect(await ps.houseFeeBps()).to.equal(0)
      expect(await ps.concentrationBps()).to.equal(1000)
      expect(await ps.commitWindowSeconds()).to.equal(300)
      expect(await ps.proofWindowSeconds()).to.equal(3600)
      expect(await ps.lastSessionId()).to.equal(0)
      expect(await ps.forfeitCursor()).to.equal(1)
      // Index 0 reserved + 5 launch tiers ($0.50, $1, $2, $5, $10).
      expect(await ps.tierCount()).to.equal(6)
      const t1 = await ps.tiers(1)
      expect(t1.entryFee).to.equal(USDC(0.5))
      expect(t1.enabled).to.equal(true)
      const t5 = await ps.tiers(5)
      expect(t5.entryFee).to.equal(USDC(10))
      expect(t5.enabled).to.equal(true)
    })

    it('rejects invalid constructor args', async () => {
      const { AnybodyProblemV5, MockUSDC } = await setup()
      const [owner] = await ethers.getSigners()
      const Factory = await ethers.getContractFactory('PaidSessionsMock')
      const ZERO = ethers.constants.AddressZero

      await expect(
        Factory.deploy(ZERO, MockUSDC.address, owner.address, 10, 0, 1000)
      ).to.be.revertedWith('Invalid anybody')

      await expect(
        Factory.deploy(AnybodyProblemV5.address, ZERO, owner.address, 10, 0, 1000)
      ).to.be.revertedWith('Invalid USDC')

      await expect(
        Factory.deploy(
          AnybodyProblemV5.address,
          MockUSDC.address,
          ZERO,
          10,
          0,
          1000
        )
      ).to.be.revertedWith('Invalid fee recipient')

      await expect(
        Factory.deploy(
          AnybodyProblemV5.address,
          MockUSDC.address,
          owner.address,
          10,
          BPS + 1,
          1000
        )
      ).to.be.revertedWith('fee>100%')

      await expect(
        Factory.deploy(
          AnybodyProblemV5.address,
          MockUSDC.address,
          owner.address,
          10,
          0,
          0
        )
      ).to.be.revertedWith('Invalid concentration')

      await expect(
        Factory.deploy(
          AnybodyProblemV5.address,
          MockUSDC.address,
          owner.address,
          10,
          0,
          BPS + 1
        )
      ).to.be.revertedWith('Invalid concentration')

      await expect(
        Factory.deploy(
          AnybodyProblemV5.address,
          MockUSDC.address,
          owner.address,
          1,
          0,
          1000
        )
      ).to.be.revertedWith('Short window<2')
    })
  })

  // ============================================================
  describe('owner-only setters', () => {
    let env, attacker
    before(async () => {
      env = await deployAll()
      ;[, attacker] = await ethers.getSigners()
    })

    it('blocks non-owners from owner-only setters', async () => {
      const ps = env.PaidSessions.connect(attacker)
      await expect(ps.setTier(1, USDC(1), true)).to.be.revertedWith(
        'Ownable: caller is not the owner'
      )
      await expect(ps.setShortWindowSize(20)).to.be.revertedWith(
        'Ownable: caller is not the owner'
      )
      await expect(ps.setHouseFee(0, attacker.address)).to.be.revertedWith(
        'Ownable: caller is not the owner'
      )
      await expect(ps.setConcentration(500)).to.be.revertedWith(
        'Ownable: caller is not the owner'
      )
      await expect(ps.setCommitWindow(120)).to.be.revertedWith(
        'Ownable: caller is not the owner'
      )
      await expect(ps.setProofWindow(120)).to.be.revertedWith(
        'Ownable: caller is not the owner'
      )
      await expect(ps.setMaxAutoScan(10)).to.be.revertedWith(
        'Ownable: caller is not the owner'
      )
      await expect(
        ps.withdrawSurplus(attacker.address, 1)
      ).to.be.revertedWith('Ownable: caller is not the owner')
      await expect(ps.updateAnybody(attacker.address)).to.be.revertedWith(
        'Ownable: caller is not the owner'
      )
      await expect(ps.updateUSDC(attacker.address)).to.be.revertedWith(
        'Ownable: caller is not the owner'
      )
      await expect(ps.updatePaused(true)).to.be.revertedWith(
        'Ownable: caller is not the owner'
      )
    })
  })

  // ============================================================
  describe('setTier', () => {
    let env
    beforeEach(async () => {
      env = await deployAll()
    })

    it('creates and updates tiers, indexes from 1', async () => {
      // Constructor pre-populates indices 1..5; setTier(6, ...) extends.
      await expect(env.PaidSessions.setTier(6, USDC(25), true))
        .to.emit(env.PaidSessions, 'TierSet')
        .withArgs(6, USDC(25), true)
      expect(await env.PaidSessions.tierCount()).to.equal(7) // 0..6
      const t6 = await env.PaidSessions.tiers(6)
      expect(t6.entryFee).to.equal(USDC(25))
      expect(t6.enabled).to.equal(true)

      // Reassigning an existing tier overwrites.
      await env.PaidSessions.setTier(1, USDC(2), false)
      const t1b = await env.PaidSessions.tiers(1)
      expect(t1b.entryFee).to.equal(USDC(2))
      expect(t1b.enabled).to.equal(false)
    })

    it('rejects tier index 0', async () => {
      await expect(env.PaidSessions.setTier(0, USDC(1), true)).to.be.revertedWith(
        'tier<1'
      )
    })

    it('grows tiers array sparsely if the next assignment skips ahead', async () => {
      // Constructor pre-populates 1..5. Skip to index 8.
      await env.PaidSessions.setTier(8, USDC(100), true)
      expect(await env.PaidSessions.tierCount()).to.equal(9)
      // Indices 6..7 created blank.
      const t6 = await env.PaidSessions.tiers(6)
      expect(t6.entryFee).to.equal(0)
      expect(t6.enabled).to.equal(false)
    })
  })

  // ============================================================
  describe('lifecycle window setters', () => {
    let env
    beforeEach(async () => {
      env = await deployAll()
    })

    it('setCommitWindow respects [1, COMMIT_WINDOW_MAX_SECONDS]', async () => {
      await expect(env.PaidSessions.setCommitWindow(0)).to.be.revertedWith(
        'Out of range'
      )
      await expect(env.PaidSessions.setCommitWindow(8001)).to.be.revertedWith(
        'Out of range'
      )
      await env.PaidSessions.setCommitWindow(120)
      expect(await env.PaidSessions.commitWindowSeconds()).to.equal(120)
      await env.PaidSessions.setCommitWindow(8000)
      expect(await env.PaidSessions.commitWindowSeconds()).to.equal(8000)
    })

    it('setProofWindow rejects 0', async () => {
      await expect(env.PaidSessions.setProofWindow(0)).to.be.revertedWith(
        'Zero window'
      )
      await env.PaidSessions.setProofWindow(60)
      expect(await env.PaidSessions.proofWindowSeconds()).to.equal(60)
    })

    it('setMaxAutoScan updates the cap', async () => {
      await env.PaidSessions.setMaxAutoScan(7)
      expect(await env.PaidSessions.maxAutoScan()).to.equal(7)
    })

    it('updatePaused gates lifecycle calls', async () => {
      await env.PaidSessions.setTier(1, USDC(1), true)
      await env.PaidSessions.updatePaused(true)
      const [, player] = await ethers.getSigners()
      await fundUSDC(env.MockUSDC, player, USDC(1))
      await approve(env.MockUSDC, player, env.PaidSessions.address, USDC(1))
      await expect(
        env.PaidSessions.connect(player).buyIn(1)
      ).to.be.revertedWith('Contract is paused')
      await env.PaidSessions.updatePaused(false)
    })
  })

  // ============================================================
  describe('payout config setters', () => {
    let env
    beforeEach(async () => {
      env = await deployAll()
    })

    it('setHouseFee bounds + zero recipient', async () => {
      const [, alice] = await ethers.getSigners()
      await expect(
        env.PaidSessions.setHouseFee(BPS + 1, alice.address)
      ).to.be.revertedWith('fee>100%')
      await expect(
        env.PaidSessions.setHouseFee(100, ethers.constants.AddressZero)
      ).to.be.revertedWith('recipient=0')
      await expect(env.PaidSessions.setHouseFee(250, alice.address))
        .to.emit(env.PaidSessions, 'HouseFeeSet')
        .withArgs(250, alice.address)
      expect(await env.PaidSessions.houseFeeBps()).to.equal(250)
      expect(await env.PaidSessions.feeRecipient()).to.equal(alice.address)
    })

    it('setConcentration bounds (0, BPS]', async () => {
      await expect(env.PaidSessions.setConcentration(0)).to.be.revertedWith(
        'Invalid concentration'
      )
      await expect(
        env.PaidSessions.setConcentration(BPS + 1)
      ).to.be.revertedWith('Invalid concentration')
      await env.PaidSessions.setConcentration(2500)
      expect(await env.PaidSessions.concentrationBps()).to.equal(2500)
    })

    it('setShortWindowSize blocked while liabilities outstanding', async () => {
      await env.PaidSessions.setTier(1, USDC(1), true)
      // Fund pool so a buyIn can succeed.
      const [owner, player] = await ethers.getSigners()
      await fundUSDC(env.MockUSDC, owner, USDC(1000))
      await approve(env.MockUSDC, owner, env.PaidSessions.address, USDC(1000))
      await env.PaidSessions.fundPrizePool(USDC(1000))

      await fundUSDC(env.MockUSDC, player, USDC(1))
      await approve(env.MockUSDC, player, env.PaidSessions.address, USDC(1))
      await env.PaidSessions.connect(player).buyIn(1)

      await expect(env.PaidSessions.setShortWindowSize(20)).to.be.revertedWith(
        'Outstanding liabilities'
      )
    })

    it('setShortWindowSize updates buffer and resets state', async () => {
      await env.PaidSessions.setShortWindowSize(20)
      expect(await env.PaidSessions.shortWindowSize()).to.equal(20)
      expect(await env.PaidSessions.shortCursor()).to.equal(0)
      expect(await env.PaidSessions.shortFilled()).to.equal(false)
      await expect(env.PaidSessions.setShortWindowSize(1)).to.be.revertedWith(
        'short<2'
      )
    })
  })

  // ============================================================
  describe('fundPrizePool / withdrawSurplus', () => {
    let env, owner, anyone
    beforeEach(async () => {
      env = await deployAll()
      ;[owner, anyone] = await ethers.getSigners()
    })

    it('anyone can fund', async () => {
      await fundUSDC(env.MockUSDC, anyone, USDC(50))
      await approve(env.MockUSDC, anyone, env.PaidSessions.address, USDC(50))
      await expect(env.PaidSessions.connect(anyone).fundPrizePool(USDC(50)))
        .to.emit(env.PaidSessions, 'PrizePoolFunded')
        .withArgs(anyone.address, USDC(50))
      expect(await env.MockUSDC.balanceOf(env.PaidSessions.address)).to.equal(
        USDC(50)
      )
    })

    it('withdrawSurplus respects liabilities and rejects to=0', async () => {
      // Fund enough that a $1 tier (reservation $10) fits under the 10% cap:
      // need free ≥ $100 after the locked reservation.
      await fundUSDC(env.MockUSDC, owner, USDC(500))
      await approve(env.MockUSDC, owner, env.PaidSessions.address, USDC(500))
      await env.PaidSessions.fundPrizePool(USDC(500))

      await expect(
        env.PaidSessions.withdrawSurplus(
          ethers.constants.AddressZero,
          USDC(1)
        )
      ).to.be.revertedWith('to=0')

      // No liabilities: full balance available.
      await env.PaidSessions.withdrawSurplus(anyone.address, USDC(40))
      expect(await env.MockUSDC.balanceOf(anyone.address)).to.equal(USDC(40))

      // Lock some via a buyIn → should refuse withdrawing past free balance.
      await env.PaidSessions.setTier(1, USDC(1), true)
      const [, , player] = await ethers.getSigners()
      await fundUSDC(env.MockUSDC, player, USDC(1))
      await approve(env.MockUSDC, player, env.PaidSessions.address, USDC(1))
      await env.PaidSessions.connect(player).buyIn(1)

      const reserved = USDC(10) // top² × $1 net = $10
      const bal = await env.MockUSDC.balanceOf(env.PaidSessions.address)
      const surplus = bal.sub(reserved)
      await expect(
        env.PaidSessions.withdrawSurplus(anyone.address, surplus.add(1))
      ).to.be.revertedWith('would underfund')
      await env.PaidSessions.withdrawSurplus(anyone.address, surplus)
    })
  })

  // ============================================================
  describe('curve f(p)', () => {
    let env
    before(async () => {
      env = await deployAll()
    })

    // Reference values from the README table: each axis multiplier.
    const samples = [
      { p: 0.0, want: 0.0 },
      { p: 0.1, want: 0.18 },
      { p: 0.25, want: 0.46 },
      { p: 0.5, want: 0.93 },
      { p: 0.75, want: 1.39 },
      { p: 0.9, want: 1.73 },
      { p: 0.95, want: 2.03 },
      { p: 0.99, want: 3.1623 } // capped at sqrt(10)
    ]

    for (const { p, want } of samples) {
      it(`f(${p}) ≈ ${want}× (within 5%)`, async () => {
        const pScaled = MUL_ONE.mul(Math.round(p * 1e6)).div(1e6)
        const got = await env.PaidSessions.f(pScaled)
        const gotFloat = Number(got.toString()) / 1e18

        if (want === 0) {
          expect(gotFloat).to.be.lessThan(0.01)
        } else {
          const tol = want * 0.05
          expect(gotFloat).to.be.greaterThan(want - tol)
          expect(gotFloat).to.be.lessThan(want + tol)
        }
      })
    }

    it('caps top 1% at CURVE_TOP', async () => {
      const top = await env.PaidSessions.CURVE_TOP()
      // p > 0.99 → flat-capped.
      const got = await env.PaidSessions.f(MUL_ONE.mul(995).div(1000))
      expect(got).to.equal(top)
      const got2 = await env.PaidSessions.f(MUL_ONE)
      expect(got2).to.equal(top)
    })
  })

  // ============================================================
  describe('percentile windows', () => {
    let env
    beforeEach(async () => {
      env = await deployAll()
    })

    it('returns 0.5 for empty buffers', async () => {
      const half = MUL_ONE.div(2)
      expect(await env.PaidSessions.percentileLong(100)).to.equal(half)
      expect(await env.PaidSessions.percentileShort(100)).to.equal(half)
    })

    it('short percentile reflects loaded distribution', async () => {
      // shortWindowSize default = 10. Load uniform 0..9.
      for (let i = 0; i < 10; i++) {
        await env.PaidSessions.pushShortForTest(i)
      }
      // Score 5: midpoint percentile = (below=5 + atOrBelow=6) / (2 * 10) = 11/20 = 0.55
      const p = await env.PaidSessions.percentileShort(5)
      expect(p).to.equal(MUL_ONE.mul(11).div(20))

      // Score below all: 0.5/10 = 0.05.
      // For score=-1: below=0, atOrBelow=0, p = 0/20 = 0.
      const pZero = await env.PaidSessions.percentileShort(0)
      // below=0, atOrBelow=1 → 1/20 = 0.05.
      expect(pZero).to.equal(MUL_ONE.div(20))

      // Score above all: below=10, atOrBelow=10 → 20/20 = 1.0.
      const pTop = await env.PaidSessions.percentileShort(99)
      expect(pTop).to.equal(MUL_ONE)
    })

    it('long percentile reflects loaded distribution', async () => {
      // Load 50 distinct scores 0..49 into long buffer.
      for (let i = 0; i < 50; i++) {
        await env.PaidSessions.pushLongForTest(i)
      }
      // Score=24: below=24, atOrBelow=25, p = 49/100 = 0.49.
      const p = await env.PaidSessions.percentileLong(24)
      expect(p).to.equal(MUL_ONE.mul(49).div(100))
    })
  })

  // ============================================================
  describe('buyIn', () => {
    let env, owner, player
    beforeEach(async () => {
      env = await deployAll({
        poolFund: USDC(10_000),
        tiers: [
          [1, USDC(0.5), true],
          [2, USDC(1), true],
          [3, USDC(2), true],
          [4, USDC(5), true],
          [5, USDC(10), true],
          [6, USDC(50), false] // disabled
        ]
      })
      ;[owner, player] = await ethers.getSigners()
    })

    it('charges entry fee, reserves netCost × top² (≈10×), accumulates liabilities', async () => {
      await fundUSDC(env.MockUSDC, player, USDC(1))
      await approve(env.MockUSDC, player, env.PaidSessions.address, USDC(1))

      const balBefore = await env.MockUSDC.balanceOf(env.PaidSessions.address)
      const tx = await env.PaidSessions.connect(player).buyIn(2)
      const rcpt = await tx.wait()
      const ev = rcpt.events.find((e) => e.event === 'SessionStarted')
      expect(ev).to.not.equal(undefined)
      expect(ev.args.player).to.equal(player.address)
      expect(ev.args.tier).to.equal(2)
      expect(ev.args.netCost).to.equal(USDC(1))
      expect(ev.args.fee).to.equal(0)
      // Reserved = netCost × top² = $10 (top² = sqrt(10)² = 10).
      expect(ev.args.reserved).to.equal(USDC(10))

      // Player paid the full entry fee.
      expect(await env.MockUSDC.balanceOf(player.address)).to.equal(0)
      // Pool received it.
      expect(await env.MockUSDC.balanceOf(env.PaidSessions.address)).to.equal(
        balBefore.add(USDC(1))
      )
      expect(await env.PaidSessions.totalLiabilities()).to.equal(USDC(10))

      const sId = ev.args.sessionId
      const s = await env.PaidSessions.sessions(sId)
      expect(s.player).to.equal(player.address)
      expect(s.status).to.equal(Status.Open)
      expect(s.netCost).to.equal(USDC(1))
      expect(s.reserved).to.equal(USDC(10))
    })

    it('rejects bad tier indices', async () => {
      await fundUSDC(env.MockUSDC, player, USDC(10))
      await approve(env.MockUSDC, player, env.PaidSessions.address, USDC(10))
      await expect(env.PaidSessions.connect(player).buyIn(0)).to.be.revertedWith(
        'Bad tier'
      )
      await expect(
        env.PaidSessions.connect(player).buyIn(99)
      ).to.be.revertedWith('Bad tier')
      await expect(env.PaidSessions.connect(player).buyIn(6)).to.be.revertedWith(
        'Tier disabled'
      )
    })

    it('rejects when reservation exceeds concentration cap', async () => {
      // concentration default = 10% of free. Free ≈ $10,000 → cap = $1,000.
      // Reserved per ticket = entry × 10. So tier with entry > $100 should fail.
      await env.PaidSessions.setTier(7, USDC(150), true)
      await fundUSDC(env.MockUSDC, player, USDC(150))
      await approve(env.MockUSDC, player, env.PaidSessions.address, USDC(150))
      await expect(env.PaidSessions.connect(player).buyIn(7)).to.be.revertedWith(
        'Exceeds concentration cap'
      )
    })

    it('splits to fee recipient when houseFeeBps > 0', async () => {
      const [, , feeReceiver] = await ethers.getSigners()
      await env.PaidSessions.setHouseFee(1000, feeReceiver.address) // 10%
      await fundUSDC(env.MockUSDC, player, USDC(1))
      await approve(env.MockUSDC, player, env.PaidSessions.address, USDC(1))
      const before = await env.MockUSDC.balanceOf(feeReceiver.address)
      const tx = await env.PaidSessions.connect(player).buyIn(2)
      const rcpt = await tx.wait()
      const ev = rcpt.events.find((e) => e.event === 'SessionStarted')
      expect(ev.args.fee).to.equal(USDC(0.1))
      expect(ev.args.netCost).to.equal(USDC(0.9))
      expect(await env.MockUSDC.balanceOf(feeReceiver.address)).to.equal(
        before.add(USDC(0.1))
      )
      // Reserved = netCost × 10 = $9.
      expect(ev.args.reserved).to.equal(USDC(9))
    })

    it('rejects when pool is underfunded for the reservation (layer 1)', async () => {
      // Drain pool below the reservation requirement. Reservation = $10.
      const bal = await env.MockUSDC.balanceOf(env.PaidSessions.address)
      await env.PaidSessions.withdrawSurplus(owner.address, bal.sub(USDC(5)))
      // Now total balance = $5, totalLiabilities = 0, reserved = $10
      // → bal < totalLiabilities + reserved → 'Pool underfunded'.
      await fundUSDC(env.MockUSDC, player, USDC(1))
      await approve(env.MockUSDC, player, env.PaidSessions.address, USDC(1))
      await expect(env.PaidSessions.connect(player).buyIn(2)).to.be.revertedWith(
        'Pool underfunded'
      )
    })
  })

  // ============================================================
  describe('maxAffordableTier', () => {
    it('returns 0 with no funded pool / no tiers', async () => {
      const env = await deployAll()
      expect(await env.PaidSessions.maxAffordableTier()).to.equal(0)
      await env.PaidSessions.setTier(1, USDC(1), true)
      // Pool empty → free balance = 0.
      expect(await env.PaidSessions.maxAffordableTier()).to.equal(0)
    })

    it('greys out tiers whose reservation exceeds concentration cap', async () => {
      // concentration = 10%. Pool = $1000 → cap = $100. Reservation = entry × 10.
      // So entry up to $10 is buyable.
      const env = await deployAll({
        poolFund: USDC(1000),
        tiers: [
          [1, USDC(0.5), true],
          [2, USDC(1), true],
          [3, USDC(2), true],
          [4, USDC(5), true],
          [5, USDC(10), true],
          [6, USDC(50), true]
        ]
      })
      // Tier 6 reserves $500, > $100 cap. Tier 5 reserves $100, ≤ $100.
      expect(await env.PaidSessions.maxAffordableTier()).to.equal(5)
    })

    it('skips disabled or unset tiers', async () => {
      // Constructor pre-populates tiers 1..5 enabled. Disable everything
      // above tier 2 so we can observe the skip behavior.
      const env = await deployAll({
        poolFund: USDC(1000),
        tiers: [
          [1, USDC(0.5), true],
          [2, USDC(1), true],
          [3, USDC(2), false], // disabled — skip
          [4, USDC(5), false],
          [5, USDC(10), false]
        ]
      })
      expect(await env.PaidSessions.maxAffordableTier()).to.equal(2)
    })
  })

  // ============================================================
  describe('estimatePayout', () => {
    let env
    beforeEach(async () => {
      env = await deployAll({
        poolFund: USDC(10_000),
        tiers: [[1, USDC(1), true]]
      })
    })

    it('matches netCost × f(pLong) × f(pShort) (concentration cap not binding)', async () => {
      // Empty buffers → both percentiles default 0.5 → multiplier f(0.5) ≈ 0.93.
      // Combined ≈ 0.86×, payout ≈ $0.86.
      const got = await env.PaidSessions.estimatePayout(1, 1234)
      const f05 = await env.PaidSessions.f(MUL_ONE.div(2))
      const expected = USDC(1).mul(f05).div(MUL_ONE).mul(f05).div(MUL_ONE)
      expect(got).to.equal(expected)
    })

    it('honors concentration cap when raw payout would exceed it', async () => {
      // Raw max payout = $1 entry × 10× = $10. Need cap < $10 to bind.
      // Free pool = $10,000. concentration = 5 bps → cap = $5.
      await env.PaidSessions.setConcentration(5)
      // Push max scores so percentiles → 1 (f → CURVE_TOP).
      for (let i = 0; i < 10; i++) {
        await env.PaidSessions.pushShortForTest(0)
      }
      for (let i = 0; i < 10; i++) {
        await env.PaidSessions.pushLongForTest(0)
      }
      // For score=10 (above all loaded zeros), percentiles → 1.0 → f → CURVE_TOP.
      const got = await env.PaidSessions.estimatePayout(1, 10)
      const bal = await env.MockUSDC.balanceOf(env.PaidSessions.address)
      const free = bal.sub(await env.PaidSessions.totalLiabilities())
      const cap = free.mul(5).div(BPS)
      expect(got).to.equal(cap)
    })
  })

  // ============================================================
  describe('commit', () => {
    let env, player, sessionId
    beforeEach(async () => {
      env = await deployAll({
        poolFund: USDC(10_000),
        tiers: [[1, USDC(1), true]]
      })
      ;[, player] = await ethers.getSigners()
      await fundUSDC(env.MockUSDC, player, USDC(10))
      await approve(env.MockUSDC, player, env.PaidSessions.address, USDC(10))
      const tx = await env.PaidSessions.connect(player).buyIn(1)
      const rcpt = await tx.wait()
      sessionId = rcpt.events.find((e) => e.event === 'SessionStarted').args
        .sessionId
    })

    it('rejects non-owner', async () => {
      await mineOne()
      const fakeCommit = ethers.utils.keccak256('0x1234')
      const [, , attacker] = await ethers.getSigners()
      await expect(
        env.PaidSessions.connect(attacker).commit(sessionId, fakeCommit)
      ).to.be.revertedWith('Not session owner')
    })

    it('rejects same-block commit (callStatic — block.number == s.startBlock)', async () => {
      const fakeCommit = ethers.utils.keccak256('0x1234')
      // The session was created in the previous block by `beforeEach`. Mine
      // a single block with both a fresh buyIn and a commit on it: with
      // automine off, both txs land in the same block, so commit's
      // block.number == s.startBlock and the require trips. We use eth_sendTransaction
      // returning a tx hash (no .wait()) so we can mine manually.
      await hre.network.provider.send('evm_setAutomine', [false])
      try {
        // Fund / approve again for the second buyIn.
        await fundUSDC(env.MockUSDC, player, USDC(1))
        await approve(env.MockUSDC, player, env.PaidSessions.address, USDC(1))

        // Send (don't await receipt) buyIn first, then commit.
        const buyTx = await env.PaidSessions.connect(player).populateTransaction.buyIn(1)
        const commitTx = await env.PaidSessions.connect(player).populateTransaction.commit(
          2,
          fakeCommit
        )
        const buyHash = await player.sendTransaction(buyTx)
        const commitHash = await player.sendTransaction({ ...commitTx, gasLimit: 500_000 })

        // Mine both in one block.
        await hre.network.provider.send('evm_mine')

        // The commit tx should have reverted with 'Wait one block to commit'.
        const rcpt = await hre.network.provider.send('eth_getTransactionReceipt', [
          commitHash.hash
        ])
        expect(rcpt.status).to.equal('0x0')
        const buyRcpt = await hre.network.provider.send('eth_getTransactionReceipt', [
          buyHash.hash
        ])
        expect(buyRcpt.status).to.equal('0x1')
      } finally {
        await hre.network.provider.send('evm_setAutomine', [true])
      }
    })

    it('rejects expired commit window', async () => {
      await mineOne()
      const fakeCommit = ethers.utils.keccak256('0x1234')
      // Disable the auto-forfeit walker so the explicit deadline check trips
      // instead of `Session not open` after the walker forfeits it.
      await env.PaidSessions.setMaxAutoScan(0)
      // Default commit window = 300s. Advance well past it.
      await advanceTime(301)
      await expect(
        env.PaidSessions.connect(player).commit(sessionId, fakeCommit)
      ).to.be.revertedWith('Commit window expired')
    })

    it('auto-forfeits before commit when scan is enabled (Session not open)', async () => {
      await mineOne()
      const fakeCommit = ethers.utils.keccak256('0x1234')
      await advanceTime(301)
      await expect(
        env.PaidSessions.connect(player).commit(sessionId, fakeCommit)
      ).to.be.revertedWith('Session not open')
    })

    it('locks seed, scoreCommit, proofDeadline; emits SessionCommitted', async () => {
      await mineOne()
      const scoreCommit = ethers.utils.keccak256('0xdeadbeef')
      await expect(env.PaidSessions.connect(player).commit(sessionId, scoreCommit))
        .to.emit(env.PaidSessions, 'SessionCommitted')

      const s = await env.PaidSessions.sessions(sessionId)
      expect(s.status).to.equal(Status.Committed)
      expect(s.scoreCommit).to.equal(scoreCommit)
      expect(s.seed).to.not.equal(ethers.constants.HashZero)
      expect(s.proofDeadline).to.be.gt(0)
    })

    it('rejects commit on wrong status (already committed)', async () => {
      await mineOne()
      const scoreCommit = ethers.utils.keccak256('0xdeadbeef')
      await env.PaidSessions.connect(player).commit(sessionId, scoreCommit)
      await expect(
        env.PaidSessions.connect(player).commit(sessionId, scoreCommit)
      ).to.be.revertedWith('Session not open')
    })
  })

  // ============================================================
  describe('submitProof guards', () => {
    // We can't generate ZK proofs in unit tests, but we can exercise the
    // pre-verification guards: ownership, status, deadline, scoreCommit match.
    let env, player, sessionId
    beforeEach(async () => {
      env = await deployAll({
        poolFund: USDC(10_000),
        tiers: [[1, USDC(1), true]]
      })
      ;[, player] = await ethers.getSigners()
      await fundUSDC(env.MockUSDC, player, USDC(10))
      await approve(env.MockUSDC, player, env.PaidSessions.address, USDC(10))
      const tx = await env.PaidSessions.connect(player).buyIn(1)
      const rcpt = await tx.wait()
      sessionId = rcpt.events.find((e) => e.event === 'SessionStarted').args
        .sessionId
    })

    const emptyProofArgs = (sessionId, claimedTime, salt) => [
      sessionId,
      claimedTime,
      salt,
      [],
      [],
      [],
      [],
      []
    ]

    it('rejects if session not committed', async () => {
      const salt = ethers.utils.hexZeroPad('0x1', 32)
      await expect(
        env.PaidSessions.connect(player).submitProof(
          ...emptyProofArgs(sessionId, 100, salt)
        )
      ).to.be.revertedWith('Session not committed')
    })

    it('rejects if not session owner', async () => {
      await mineOne()
      const salt = ethers.utils.hexZeroPad('0x1', 32)
      const claimedTime = 100
      const scoreCommit = ethers.utils.solidityKeccak256(
        ['uint256', 'bytes32'],
        [claimedTime, salt]
      )
      await env.PaidSessions.connect(player).commit(sessionId, scoreCommit)
      const [, , attacker] = await ethers.getSigners()
      await expect(
        env.PaidSessions.connect(attacker).submitProof(
          ...emptyProofArgs(sessionId, claimedTime, salt)
        )
      ).to.be.revertedWith('Not session owner')
    })

    it('rejects if scoreCommit mismatches reveal', async () => {
      await mineOne()
      const goodSalt = ethers.utils.hexZeroPad('0x1', 32)
      const badSalt = ethers.utils.hexZeroPad('0x2', 32)
      const claimedTime = 100
      const scoreCommit = ethers.utils.solidityKeccak256(
        ['uint256', 'bytes32'],
        [claimedTime, goodSalt]
      )
      await env.PaidSessions.connect(player).commit(sessionId, scoreCommit)
      await expect(
        env.PaidSessions.connect(player).submitProof(
          ...emptyProofArgs(sessionId, claimedTime, badSalt)
        )
      ).to.be.revertedWith('Score commitment mismatch')
    })

    it('rejects after proof window expires', async () => {
      await mineOne()
      const salt = ethers.utils.hexZeroPad('0x1', 32)
      const claimedTime = 100
      const scoreCommit = ethers.utils.solidityKeccak256(
        ['uint256', 'bytes32'],
        [claimedTime, salt]
      )
      await env.PaidSessions.connect(player).commit(sessionId, scoreCommit)
      // Disable auto-forfeit so the explicit deadline check trips
      // (otherwise the walker forfeits the session and `Session not committed` fires).
      await env.PaidSessions.setMaxAutoScan(0)
      // Default proofWindowSeconds = 3600.
      await advanceTime(3601)
      await expect(
        env.PaidSessions.connect(player).submitProof(
          ...emptyProofArgs(sessionId, claimedTime, salt)
        )
      ).to.be.revertedWith('Proof window expired')
    })
  })

  // ============================================================
  describe('auto-forfeit cursor', () => {
    let env, player
    beforeEach(async () => {
      env = await deployAll({
        poolFund: USDC(10_000),
        tiers: [[1, USDC(1), true]]
      })
      ;[, player] = await ethers.getSigners()
      await fundUSDC(env.MockUSDC, player, USDC(100))
      await approve(env.MockUSDC, player, env.PaidSessions.address, USDC(100))
    })

    it('returns 0 pending while sessions are still within the commit window', async () => {
      await env.PaidSessions.connect(player).buyIn(1)
      await env.PaidSessions.connect(player).buyIn(1)
      expect(await env.PaidSessions.pendingForfeitCount(50)).to.equal(0)
    })

    it('counts sessions whose commit window has expired', async () => {
      await env.PaidSessions.connect(player).buyIn(1)
      await env.PaidSessions.connect(player).buyIn(1)
      await advanceTime(301)
      expect(await env.PaidSessions.pendingForfeitCount(50)).to.equal(2)
    })

    it('processForfeits walks forward, releases reservations, advances cursor', async () => {
      await env.PaidSessions.connect(player).buyIn(1)
      await env.PaidSessions.connect(player).buyIn(1)
      await advanceTime(301)
      const liabBefore = await env.PaidSessions.totalLiabilities()
      expect(liabBefore).to.equal(USDC(20))

      await expect(env.PaidSessions.processForfeits(50))
        .to.emit(env.PaidSessions, 'SessionForfeited')
        .withArgs(1, 0)
        .and.to.emit(env.PaidSessions, 'SessionForfeited')
        .withArgs(2, 0)

      expect(await env.PaidSessions.totalLiabilities()).to.equal(0)
      expect(await env.PaidSessions.forfeitCursor()).to.equal(3)

      const s1 = await env.PaidSessions.sessions(1)
      expect(s1.status).to.equal(Status.Forfeited)
      expect(s1.reserved).to.equal(0)
    })

    it('cursor stops at the first still-pending session and resumes later', async () => {
      // First session: expire it.
      await env.PaidSessions.connect(player).buyIn(1)
      await advanceTime(301)
      // Second session: fresh, still pending.
      await env.PaidSessions.connect(player).buyIn(1)

      await env.PaidSessions.processForfeits(50)
      // Session 1 forfeited; cursor pinned at session 2.
      expect(await env.PaidSessions.forfeitCursor()).to.equal(2)
      const s2 = await env.PaidSessions.sessions(2)
      expect(s2.status).to.equal(Status.Open)

      // Now expire session 2 too.
      await advanceTime(301)
      await env.PaidSessions.processForfeits(50)
      expect(await env.PaidSessions.forfeitCursor()).to.equal(3)
      expect((await env.PaidSessions.sessions(2)).status).to.equal(
        Status.Forfeited
      )
      expect(await env.PaidSessions.totalLiabilities()).to.equal(0)
    })

    it('auto-forfeits committed sessions whose proof window expired', async () => {
      await env.PaidSessions.connect(player).buyIn(1)
      await mineOne()
      const scoreCommit = ethers.utils.keccak256('0xab')
      await env.PaidSessions.connect(player).commit(1, scoreCommit)
      await advanceTime(3601)
      await expect(env.PaidSessions.processForfeits(50))
        .to.emit(env.PaidSessions, 'SessionForfeited')
        .withArgs(1, 1) // reason = 1 (proof window)
      const s = await env.PaidSessions.sessions(1)
      expect(s.status).to.equal(Status.Forfeited)
      expect(s.reserved).to.equal(0)
    })

    it('processForfeits with maxScan=0 is a no-op', async () => {
      await env.PaidSessions.connect(player).buyIn(1)
      await advanceTime(301)
      await env.PaidSessions.processForfeits(0)
      expect(await env.PaidSessions.forfeitCursor()).to.equal(1)
    })
  })

  // ============================================================
  describe('_settle (via mock helper)', () => {
    let env, player
    beforeEach(async () => {
      env = await deployAll({
        poolFund: USDC(10_000),
        tiers: [[1, USDC(1), true]]
      })
      ;[, player] = await ethers.getSigners()
      await fundUSDC(env.MockUSDC, player, USDC(100))
      await approve(env.MockUSDC, player, env.PaidSessions.address, USDC(100))
      await env.PaidSessions.connect(player).buyIn(1)
    })

    it('updates buffers, releases reservation, transfers payout, emits SessionSettled', async () => {
      const playerBalBefore = await env.MockUSDC.balanceOf(player.address)
      const liabBefore = await env.PaidSessions.totalLiabilities()
      expect(liabBefore).to.equal(USDC(10))

      // Empty buffers → both percentiles = 0.5 → f(0.5) ≈ 0.93. Combined ≈ 0.86.
      await expect(env.PaidSessions.exposedSettle(1, 100)).to.emit(
        env.PaidSessions,
        'SessionSettled'
      )

      const s = await env.PaidSessions.sessions(1)
      expect(s.status).to.equal(Status.Settled)
      expect(s.reserved).to.equal(0)
      expect(s.finalScore).to.equal(100)

      // Liability fully released.
      expect(await env.PaidSessions.totalLiabilities()).to.equal(0)

      // Buffers updated.
      expect(await env.PaidSessions.longCursor()).to.equal(1)
      expect(await env.PaidSessions.shortCursor()).to.equal(1)

      // Payout transferred.
      const f05 = await env.PaidSessions.f(MUL_ONE.div(2))
      const expectedPayout = USDC(1).mul(f05).div(MUL_ONE).mul(f05).div(MUL_ONE)
      expect(s.payout).to.equal(expectedPayout)
      expect(await env.MockUSDC.balanceOf(player.address)).to.equal(
        playerBalBefore.add(expectedPayout)
      )
    })

    it('clamps payout at the per-ticket reservation', async () => {
      // Force percentiles → 1.0 → CURVE_TOP each → combined = 10× netCost = $10.
      // That's exactly the reservation, so capping shouldn't change anything,
      // but let's verify by pre-loading buffers with low scores and settling high.
      for (let i = 0; i < 10; i++) {
        await env.PaidSessions.pushShortForTest(0)
      }
      for (let i = 0; i < 50; i++) {
        await env.PaidSessions.pushLongForTest(0)
      }
      const playerBalBefore = await env.MockUSDC.balanceOf(player.address)
      await env.PaidSessions.exposedSettle(1, 999)
      const s = await env.PaidSessions.sessions(1)
      expect(s.payout).to.be.lte(USDC(10))
      expect(await env.MockUSDC.balanceOf(player.address)).to.equal(
        playerBalBefore.add(s.payout)
      )
    })

    it('clamps payout at the concentration cap when very tight', async () => {
      // Raw max = $1 × 10 = $10. To force cap to bind, free × bps < $10.
      // Free + reserved ≈ $10,001 → cap < $10 needs bps < 10. Use 5 bps → cap ≈ $5.
      await env.PaidSessions.setConcentration(5)
      for (let i = 0; i < 10; i++) {
        await env.PaidSessions.pushShortForTest(0)
      }
      for (let i = 0; i < 50; i++) {
        await env.PaidSessions.pushLongForTest(0)
      }
      const bal = await env.MockUSDC.balanceOf(env.PaidSessions.address)
      const liab = await env.PaidSessions.totalLiabilities()
      const reserved = USDC(10) // this session's reservation
      const freeIncludingThis = bal.sub(liab).add(reserved)
      const cap = freeIncludingThis.mul(5).div(BPS)

      await env.PaidSessions.exposedSettle(1, 999)
      const s = await env.PaidSessions.sessions(1)
      expect(s.payout).to.equal(cap)
    })

    it('zero score ⇒ zero payout, but still settles cleanly', async () => {
      // Pre-load high scores. Score 0 has percentile 0 → f(0) ≈ 0 → payout 0.
      for (let i = 0; i < 10; i++) {
        await env.PaidSessions.pushShortForTest(1000)
      }
      for (let i = 0; i < 50; i++) {
        await env.PaidSessions.pushLongForTest(1000)
      }
      const balBefore = await env.MockUSDC.balanceOf(player.address)
      await env.PaidSessions.exposedSettle(1, 0)
      const s = await env.PaidSessions.sessions(1)
      expect(s.status).to.equal(Status.Settled)
      expect(s.payout).to.equal(0)
      expect(await env.MockUSDC.balanceOf(player.address)).to.equal(balBefore)
      expect(await env.PaidSessions.totalLiabilities()).to.equal(0)
    })
  })

  // ============================================================
  describe('updateAnybody / updateUSDC', () => {
    it('updateUSDC blocked while liabilities outstanding', async () => {
      const env = await deployAll({
        poolFund: USDC(10_000),
        tiers: [[1, USDC(1), true]]
      })
      const [, player] = await ethers.getSigners()
      await fundUSDC(env.MockUSDC, player, USDC(1))
      await approve(env.MockUSDC, player, env.PaidSessions.address, USDC(1))
      await env.PaidSessions.connect(player).buyIn(1)
      await expect(
        env.PaidSessions.updateUSDC(env.MockUSDC.address)
      ).to.be.revertedWith('Outstanding liabilities')
    })

    it('updateAnybody rejects zero', async () => {
      const env = await deployAll()
      await expect(
        env.PaidSessions.updateAnybody(ethers.constants.AddressZero)
      ).to.be.revertedWith('Invalid anybody')
    })
  })
})
