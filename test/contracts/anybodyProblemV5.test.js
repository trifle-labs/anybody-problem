import { expect } from 'chai'
import { describe, it } from 'mocha'

import hre from 'hardhat'
const ethers = hre.ethers

import { deployContractsV5 } from '../../scripts/utils.js'

const USDC = (n) => ethers.utils.parseUnits(n.toString(), 6)
const BPS = 10_000

const setup = async (options = {}) =>
  deployContractsV5({ mock: true, verbose: false, ...options })

const fundUSDC = async (mockUsdc, account, amount) => {
  await mockUsdc.mint(account.address, amount)
}

const approve = async (mockUsdc, owner, spender, amount) => {
  await mockUsdc.connect(owner).approve(spender, amount)
}

describe('AnybodyProblemV5: new feature tests', function () {
  this.timeout(50_000_000)

  describe('constructor wiring', () => {
    it('sets USDC, deployDay, historyResolver, proceedRecipient, default proceedRate=0', async () => {
      const { AnybodyProblemV5, AnybodyProblemV4, AnybodyHistory, MockUSDC } =
        await setup()
      expect(await AnybodyProblemV5.usdc()).to.equal(MockUSDC.address)
      expect(await AnybodyProblemV5.historyResolver()).to.equal(
        AnybodyHistory.address
      )
      expect(await AnybodyHistory.historyLength()).to.equal(5)
      expect(await AnybodyHistory.history(0)).to.equal(AnybodyProblemV4.address)
      expect(await AnybodyProblemV5.proceedRate()).to.equal(0)
      expect(await AnybodyProblemV5.proceedRecipient()).to.not.equal(
        ethers.constants.AddressZero
      )
      const today = await AnybodyProblemV5.currentDay()
      expect(await AnybodyProblemV5.deployDay()).to.equal(today)
    })

    it('points Speedruns and ExternalMetadata at V5 after deploy', async () => {
      const { AnybodyProblemV5, Speedruns, ExternalMetadata } = await setup()
      expect(await Speedruns.anybodyProblem()).to.equal(AnybodyProblemV5.address)
      expect(await ExternalMetadata.anybodyProblem()).to.equal(
        AnybodyProblemV5.address
      )
    })

    it('rejects zero USDC in constructor', async () => {
      const AnybodyProblemV5Factory = await ethers.getContractFactory(
        'AnybodyProblemV5Mock'
      )
      const [owner] = await ethers.getSigners()
      await expect(
        AnybodyProblemV5Factory.deploy(
          ethers.constants.AddressZero,
          owner.address,
          owner.address,
          [],
          [],
          [],
          owner.address,
          owner.address
        )
      ).to.be.revertedWith('Invalid USDC')
    })
  })

  describe('owner setter access control', () => {
    let env
    before(async () => {
      env = await setup()
    })

    it('blocks non-owners from sensitive setters', async () => {
      const [, attacker] = await ethers.getSigners()
      const ab = env.AnybodyProblemV5.connect(attacker)
      await expect(ab.updatePlayPrice(0)).to.be.revertedWith(
        'Ownable: caller is not the owner'
      )
      await expect(ab.updateDailyPrizeRate(0)).to.be.revertedWith(
        'Ownable: caller is not the owner'
      )
      await expect(ab.updateProceedRate(100)).to.be.revertedWith(
        'Ownable: caller is not the owner'
      )
      await expect(
        ab.updateProceedRecipient(attacker.address)
      ).to.be.revertedWith('Ownable: caller is not the owner')
      await expect(ab.updateUSDC(attacker.address)).to.be.revertedWith(
        'Ownable: caller is not the owner'
      )
      await expect(ab.updatePaused(true)).to.be.revertedWith(
        'Ownable: caller is not the owner'
      )
      await expect(
        ab.setAuthorizedWriter(attacker.address, true)
      ).to.be.revertedWith('Ownable: caller is not the owner')
    })

    it('rejects proceedRate > BPS_DENOMINATOR', async () => {
      await expect(env.AnybodyProblemV5.updateProceedRate(BPS + 1)).to.be
        .revertedWith('Rate exceeds 100%')
      // Boundary: BPS_DENOMINATOR exactly is allowed.
      await env.AnybodyProblemV5.updateProceedRate(BPS)
      expect(await env.AnybodyProblemV5.proceedRate()).to.equal(BPS)
      await env.AnybodyProblemV5.updateProceedRate(0)
    })

    it('rejects zero address for USDC update', async () => {
      await expect(
        env.AnybodyProblemV5.updateUSDC(ethers.constants.AddressZero)
      ).to.be.revertedWith('Invalid USDC')
    })
  })

  describe('USDC play price split via mint()', () => {
    it('routes 100% of playPrice to dailyPool when proceedRate is 0', async () => {
      const { AnybodyProblemV5, MockUSDC } = await setup()
      const [, player] = await ethers.getSigners()
      const day = await AnybodyProblemV5.currentDay()
      const playPrice = await AnybodyProblemV5.playPrice()
      await fundUSDC(MockUSDC, player, playPrice)
      await approve(MockUSDC, player, AnybodyProblemV5.address, playPrice)

      const recipient = await AnybodyProblemV5.proceedRecipient()
      const recipientBefore = await MockUSDC.balanceOf(recipient)

      await expect(AnybodyProblemV5.connect(player).mint())
        .to.emit(AnybodyProblemV5, 'DailyPoolFunded')
        .withArgs(day, player.address, playPrice)

      expect(await AnybodyProblemV5.dailyPool(day)).to.equal(playPrice)
      expect(await MockUSDC.balanceOf(recipient)).to.equal(recipientBefore)
    })

    it('splits playPrice when proceedRate is 30%', async () => {
      const { AnybodyProblemV5, MockUSDC } = await setup()
      const [owner, player] = await ethers.getSigners()
      const rate = 3000 // 30%
      await AnybodyProblemV5.updateProceedRate(rate)
      // Use a known recipient we control so balance assertions are independent.
      await AnybodyProblemV5.updateProceedRecipient(owner.address)
      const day = await AnybodyProblemV5.currentDay()
      const playPrice = await AnybodyProblemV5.playPrice()
      await fundUSDC(MockUSDC, player, playPrice)
      await approve(MockUSDC, player, AnybodyProblemV5.address, playPrice)
      const expectedToRecipient = playPrice.mul(rate).div(BPS)
      const expectedToPool = playPrice.sub(expectedToRecipient)

      const recipientBefore = await MockUSDC.balanceOf(owner.address)
      await AnybodyProblemV5.connect(player).mint()
      expect(await MockUSDC.balanceOf(owner.address)).to.equal(
        recipientBefore.add(expectedToRecipient)
      )
      expect(await AnybodyProblemV5.dailyPool(day)).to.equal(expectedToPool)
    })

    it('routes 100% of playPrice to recipient at 100%', async () => {
      const { AnybodyProblemV5, MockUSDC } = await setup()
      const [owner, player] = await ethers.getSigners()
      await AnybodyProblemV5.updateProceedRate(BPS)
      await AnybodyProblemV5.updateProceedRecipient(owner.address)
      const day = await AnybodyProblemV5.currentDay()
      const playPrice = await AnybodyProblemV5.playPrice()
      await fundUSDC(MockUSDC, player, playPrice)
      await approve(MockUSDC, player, AnybodyProblemV5.address, playPrice)

      const recipientBefore = await MockUSDC.balanceOf(owner.address)
      await AnybodyProblemV5.connect(player).mint()
      expect(await MockUSDC.balanceOf(owner.address)).to.equal(
        recipientBefore.add(playPrice)
      )
      expect(await AnybodyProblemV5.dailyPool(day)).to.equal(0)
    })

    it('skips transfer when proceedRecipient is unset, regardless of rate', async () => {
      const { AnybodyProblemV5, MockUSDC } = await setup()
      const [, player] = await ethers.getSigners()
      await AnybodyProblemV5.updateProceedRate(5000)
      await AnybodyProblemV5.updateProceedRecipient(ethers.constants.AddressZero)
      const day = await AnybodyProblemV5.currentDay()
      const playPrice = await AnybodyProblemV5.playPrice()
      await fundUSDC(MockUSDC, player, playPrice)
      await approve(MockUSDC, player, AnybodyProblemV5.address, playPrice)
      await AnybodyProblemV5.connect(player).mint()
      expect(await AnybodyProblemV5.dailyPool(day)).to.equal(playPrice)
    })

    it('reverts when player lacks approval', async () => {
      const { AnybodyProblemV5, MockUSDC } = await setup()
      const [, player] = await ethers.getSigners()
      const playPrice = await AnybodyProblemV5.playPrice()
      await fundUSDC(MockUSDC, player, playPrice)
      // No approve.
      await expect(AnybodyProblemV5.connect(player).mint()).to.be.reverted
    })

    it('reverts when playPrice updated to 0 still allows mint with no transfer', async () => {
      const { AnybodyProblemV5, MockUSDC, Speedruns } = await setup()
      const [, player] = await ethers.getSigners()
      await AnybodyProblemV5.updatePlayPrice(0)
      const day = await AnybodyProblemV5.currentDay()
      const before = await MockUSDC.balanceOf(player.address)
      await AnybodyProblemV5.connect(player).mint()
      // No USDC moved.
      expect(await MockUSDC.balanceOf(player.address)).to.equal(before)
      // NFT still minted.
      expect(await Speedruns.balanceOf(player.address, day)).to.equal(1)
    })
  })

  describe('depositPrize', () => {
    it('allows anyone to deposit, increments prefundedPrizePool, emits event', async () => {
      const { AnybodyProblemV5, MockUSDC } = await setup()
      const [, donor] = await ethers.getSigners()
      const amount = USDC(10)
      await fundUSDC(MockUSDC, donor, amount)
      await approve(MockUSDC, donor, AnybodyProblemV5.address, amount)
      await expect(AnybodyProblemV5.connect(donor).depositPrize(amount))
        .to.emit(AnybodyProblemV5, 'PrizeDeposited')
        .withArgs(donor.address, amount, amount)
      expect(await AnybodyProblemV5.prefundedPrizePool()).to.equal(amount)

      // Second deposit accumulates.
      await fundUSDC(MockUSDC, donor, amount)
      await approve(MockUSDC, donor, AnybodyProblemV5.address, amount)
      await AnybodyProblemV5.connect(donor).depositPrize(amount)
      expect(await AnybodyProblemV5.prefundedPrizePool()).to.equal(
        amount.mul(2)
      )
    })

    it('rejects zero deposit', async () => {
      const { AnybodyProblemV5 } = await setup()
      await expect(AnybodyProblemV5.depositPrize(0)).to.be.revertedWith(
        'Zero deposit'
      )
    })
  })

  describe('daily pool seeding + claim', () => {
    const seedAndPlay = async (env, donor, player, prefund) => {
      const { AnybodyProblemV5, MockUSDC } = env
      // Donor seeds the prize pool first.
      await fundUSDC(MockUSDC, donor, prefund)
      await approve(MockUSDC, donor, AnybodyProblemV5.address, prefund)
      await AnybodyProblemV5.connect(donor).depositPrize(prefund)
      // Player mints — first play of the day, triggers _seedDay.
      const playPrice = await AnybodyProblemV5.playPrice()
      await fundUSDC(MockUSDC, player, playPrice)
      await approve(MockUSDC, player, AnybodyProblemV5.address, playPrice)
      await AnybodyProblemV5.connect(player).mint()
    }

    it('seeds dailyPool from prefundedPrizePool up to dailyPrizeRate on first play', async () => {
      const env = await setup()
      const { AnybodyProblemV5 } = env
      const [, donor, player] = await ethers.getSigners()
      const dailyPrizeRate = await AnybodyProblemV5.dailyPrizeRate()
      const prefund = dailyPrizeRate.mul(3) // > 1 day's worth
      await seedAndPlay(env, donor, player, prefund)
      const day = await AnybodyProblemV5.currentDay()
      const playPrice = await AnybodyProblemV5.playPrice()
      // dailyPool = seed + (playPrice cut to pool) = dailyPrizeRate + playPrice
      expect(await AnybodyProblemV5.dailyPool(day)).to.equal(
        dailyPrizeRate.add(playPrice)
      )
      expect(await AnybodyProblemV5.prefundedPrizePool()).to.equal(
        prefund.sub(dailyPrizeRate)
      )
      expect(await AnybodyProblemV5.daySeeded(day)).to.equal(true)
    })

    it('caps seed at remaining prefundedPrizePool when below dailyPrizeRate', async () => {
      const env = await setup()
      const { AnybodyProblemV5 } = env
      const [, donor, player] = await ethers.getSigners()
      const dailyPrizeRate = await AnybodyProblemV5.dailyPrizeRate()
      const prefund = dailyPrizeRate.div(4) // less than a day
      await seedAndPlay(env, donor, player, prefund)
      const day = await AnybodyProblemV5.currentDay()
      const playPrice = await AnybodyProblemV5.playPrice()
      expect(await AnybodyProblemV5.dailyPool(day)).to.equal(
        prefund.add(playPrice)
      )
      expect(await AnybodyProblemV5.prefundedPrizePool()).to.equal(0)
    })

    it('seeds only once per day even with many plays', async () => {
      const env = await setup()
      const { AnybodyProblemV5, MockUSDC } = env
      const [, donor, p1, p2] = await ethers.getSigners()
      const dailyPrizeRate = await AnybodyProblemV5.dailyPrizeRate()
      await seedAndPlay(env, donor, p1, dailyPrizeRate.mul(2))
      const day = await AnybodyProblemV5.currentDay()
      const afterFirstPool = await AnybodyProblemV5.dailyPool(day)
      const prefundedAfterSeed = await AnybodyProblemV5.prefundedPrizePool()
      // Second player mints same day.
      const playPrice = await AnybodyProblemV5.playPrice()
      await fundUSDC(MockUSDC, p2, playPrice)
      await approve(MockUSDC, p2, AnybodyProblemV5.address, playPrice)
      await AnybodyProblemV5.connect(p2).mint()
      // Pool only grew by playPrice — no second seeding.
      expect(await AnybodyProblemV5.dailyPool(day)).to.equal(
        afterFirstPool.add(playPrice)
      )
      expect(await AnybodyProblemV5.prefundedPrizePool()).to.equal(
        prefundedAfterSeed
      )
    })

    it('claimDailyPrize reverts before day ends', async () => {
      const env = await setup()
      const { AnybodyProblemV5 } = env
      const today = await AnybodyProblemV5.currentDay()
      await expect(AnybodyProblemV5.claimDailyPrize(today)).to.be.revertedWith(
        'Day not yet over'
      )
    })

    it('claimDailyPrize reverts when no winner exists', async () => {
      const env = await setup()
      const { AnybodyProblemV5 } = env
      const today = await AnybodyProblemV5.currentDay()
      const yesterday = today.sub(86400)
      await expect(
        AnybodyProblemV5.claimDailyPrize(yesterday)
      ).to.be.revertedWith('No winner for that day')
    })

    it('claimDailyPrize: only winner can claim, transfers and flags claimed', async () => {
      const env = await setup()
      const { AnybodyProblemV5, MockUSDC } = env
      const [, donor, winner, attacker] = await ethers.getSigners()

      // Fund prefundedPrizePool and trigger _seedDay(today) via winner.mint().
      const prefund = USDC(50)
      await fundUSDC(MockUSDC, donor, prefund)
      await approve(MockUSDC, donor, AnybodyProblemV5.address, prefund)
      await AnybodyProblemV5.connect(donor).depositPrize(prefund)

      const playPrice = await AnybodyProblemV5.playPrice()
      await fundUSDC(MockUSDC, winner, playPrice)
      await approve(MockUSDC, winner, AnybodyProblemV5.address, playPrice)
      await AnybodyProblemV5.connect(winner).mint()

      const today = await AnybodyProblemV5.currentDay()
      const poolBefore = await AnybodyProblemV5.dailyPool(today)
      expect(poolBefore).to.be.gt(0)

      // Plant winner: runs_[runId].owner = winner; fastestByDay_[today][0] = runId.
      const runId = 1
      await AnybodyProblemV5.setRunData(runId, today, 100, winner.address)
      await AnybodyProblemV5.setFastestByDay(today, 0, runId)

      // Time-travel past today's window so claim is allowed.
      await hre.network.provider.send('evm_increaseTime', [86400])
      await hre.network.provider.send('evm_mine')

      // Attacker is rejected.
      await expect(
        AnybodyProblemV5.connect(attacker).claimDailyPrize(today)
      ).to.be.revertedWith('Not the winner')

      // Winner claims: USDC moves, flag flips, pool zeroes, event emits.
      const winnerBalBefore = await MockUSDC.balanceOf(winner.address)
      await expect(AnybodyProblemV5.connect(winner).claimDailyPrize(today))
        .to.emit(AnybodyProblemV5, 'DailyPrizeClaimed')
        .withArgs(today, winner.address, poolBefore)
      const winnerBalAfter = await MockUSDC.balanceOf(winner.address)
      expect(winnerBalAfter.sub(winnerBalBefore)).to.equal(poolBefore)
      expect(await AnybodyProblemV5.dailyPool(today)).to.equal(0)
      expect(await AnybodyProblemV5.dailyPoolClaimed(today)).to.equal(true)

      // Second claim by winner is blocked.
      await expect(
        AnybodyProblemV5.connect(winner).claimDailyPrize(today)
      ).to.be.revertedWith('Already claimed')
    })

    it('claimDailyPrize blocked while paused', async () => {
      const env = await setup()
      const { AnybodyProblemV5 } = env
      const today = await AnybodyProblemV5.currentDay()
      await env.AnybodyProblemV5.updatePaused(true)
      await expect(
        AnybodyProblemV5.claimDailyPrize(today.sub(86400))
      ).to.be.revertedWith('Contract is paused')
    })
  })

  describe('authorized writer surface', () => {
    it('setAuthorizedWriter is owner-only and emits event', async () => {
      const { AnybodyProblemV5 } = await setup()
      const [owner, writer, attacker] = await ethers.getSigners()
      await expect(
        AnybodyProblemV5.connect(attacker).setAuthorizedWriter(
          writer.address,
          true
        )
      ).to.be.revertedWith('Ownable: caller is not the owner')
      await expect(
        AnybodyProblemV5.connect(owner).setAuthorizedWriter(writer.address, true)
      )
        .to.emit(AnybodyProblemV5, 'AuthorizedWriterUpdated')
        .withArgs(writer.address, true)
      expect(await AnybodyProblemV5.authorizedWriter(writer.address)).to.equal(
        true
      )
    })

    it('consumeProof requires authorization', async () => {
      const { AnybodyProblemV5 } = await setup()
      const [, attacker] = await ethers.getSigners()
      const hash = ethers.utils.keccak256('0xdeadbeef')
      await expect(
        AnybodyProblemV5.connect(attacker).consumeProof(hash)
      ).to.be.revertedWith('Not an authorized writer')
    })

    it('consumeProof marks usedProofs, second consume reverts', async () => {
      const { AnybodyProblemV5 } = await setup()
      const [, writer] = await ethers.getSigners()
      await AnybodyProblemV5.setAuthorizedWriter(writer.address, true)
      const hash = ethers.utils.keccak256('0xdeadbeef')
      await expect(AnybodyProblemV5.connect(writer).consumeProof(hash))
        .to.emit(AnybodyProblemV5, 'ProofConsumed')
        .withArgs(writer.address, hash)
      expect(await AnybodyProblemV5.usedProofs(hash)).to.equal(true)
      await expect(
        AnybodyProblemV5.connect(writer).consumeProof(hash)
      ).to.be.revertedWith('Proof already used')
    })

    it('consumeProof blocked while paused', async () => {
      const { AnybodyProblemV5 } = await setup()
      const [, writer] = await ethers.getSigners()
      await AnybodyProblemV5.setAuthorizedWriter(writer.address, true)
      await AnybodyProblemV5.updatePaused(true)
      const hash = ethers.utils.keccak256('0xc0ffee')
      await expect(
        AnybodyProblemV5.connect(writer).consumeProof(hash)
      ).to.be.revertedWith('Contract is paused')
    })

    it('generateBody is deterministic for fixed (seed, level, idx)', async () => {
      const { AnybodyProblemV5 } = await setup()
      const seed = 1234567890n
      const a = await AnybodyProblemV5.generateBody(seed, 1, 0)
      const b = await AnybodyProblemV5.generateBody(seed, 1, 0)
      expect(a.px).to.equal(b.px)
      expect(a.py).to.equal(b.py)
      expect(a.vx).to.equal(b.vx)
      expect(a.vy).to.equal(b.vy)
      expect(a.radius).to.equal(b.radius)
    })

    it('generateBody varies with seed and index', async () => {
      const { AnybodyProblemV5 } = await setup()
      const a = await AnybodyProblemV5.generateBody(1, 1, 0)
      const b = await AnybodyProblemV5.generateBody(1, 1, 1)
      const c = await AnybodyProblemV5.generateBody(2, 1, 0)
      expect(a.seed).to.not.equal(b.seed)
      expect(a.seed).to.not.equal(c.seed)
    })

    it('verifyProofPublic reverts when no verifier registered for (bodyTotal, ticks)', async () => {
      const { AnybodyProblemV5 } = await setup()
      // 99 bodies @ 99 ticks — definitely not registered.
      const dummy = Array(52).fill(0)
      await expect(
        AnybodyProblemV5.verifyProofPublic(
          [0, 0],
          [
            [0, 0],
            [0, 0]
          ],
          [0, 0],
          dummy,
          99,
          99
        )
      ).to.be.revertedWith('Invalid verifier')
    })
  })

  describe('paused gating', () => {
    it('mint blocked when paused', async () => {
      const { AnybodyProblemV5 } = await setup()
      await AnybodyProblemV5.updatePaused(true)
      await expect(AnybodyProblemV5.mint()).to.be.revertedWith(
        'Contract is paused'
      )
    })

    it('batchSolve blocked when paused', async () => {
      const { AnybodyProblemV5 } = await setup()
      await AnybodyProblemV5.updatePaused(true)
      await expect(
        AnybodyProblemV5.batchSolve(0, 0, [], [], [], [], [])
      ).to.be.revertedWith('Contract is paused')
    })

    it('depositPrize NOT gated by paused (donations always welcome)', async () => {
      const { AnybodyProblemV5, MockUSDC } = await setup()
      const [, donor] = await ethers.getSigners()
      await AnybodyProblemV5.updatePaused(true)
      const amount = USDC(1)
      await fundUSDC(MockUSDC, donor, amount)
      await approve(MockUSDC, donor, AnybodyProblemV5.address, amount)
      await AnybodyProblemV5.connect(donor).depositPrize(amount)
      expect(await AnybodyProblemV5.prefundedPrizePool()).to.equal(amount)
    })
  })

  describe('history chain to V4', () => {
    it('runs(unknown id) returns an empty Run via the resolver', async () => {
      const { AnybodyProblemV5 } = await setup()
      const r = await AnybodyProblemV5.runs(99999)
      expect(r.owner).to.equal(ethers.constants.AddressZero)
    })

    it('runs(planted id) reads local V5 storage', async () => {
      const { AnybodyProblemV5 } = await setup()
      const [, player] = await ethers.getSigners()
      const day = await AnybodyProblemV5.currentDay()
      const runId = 1
      await AnybodyProblemV5.setRunData(runId, day, 1234, player.address)
      const r = await AnybodyProblemV5.runs(runId)
      expect(r.owner).to.equal(player.address)
      expect(r.day).to.equal(day)
      expect(r.accumulativeTime).to.equal(1234)
    })

    it('gamesPlayed(unknown player) falls through to history resolver returning empty', async () => {
      const { AnybodyProblemV5 } = await setup()
      const [, fresh] = await ethers.getSigners()
      const rec = await AnybodyProblemV5.gamesPlayed(fresh.address)
      expect(rec.total).to.equal(0)
      expect(rec.streak).to.equal(0)
    })

    it('fastestByDay(empty day) returns zeros via fallthrough', async () => {
      const { AnybodyProblemV5 } = await setup()
      const day = (await AnybodyProblemV5.currentDay()).sub(86400 * 7)
      const f = await AnybodyProblemV5.fastestByDay(day)
      expect(f[0]).to.equal(0)
      expect(f[1]).to.equal(0)
      expect(f[2]).to.equal(0)
    })

    it('runCount inherits from V4 totalRuns at deploy', async () => {
      const { AnybodyProblemV5, AnybodyProblemV4 } = await setup()
      // Fresh deploy — V4 has no runs. nextRunId == 1.
      expect(await AnybodyProblemV5.runCount()).to.equal(
        await AnybodyProblemV4.runCount()
      )
      expect(await AnybodyProblemV5.nextRunId()).to.equal(
        (await AnybodyProblemV5.runCount()).add(1)
      )
    })
  })
})
