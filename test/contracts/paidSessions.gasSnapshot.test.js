import { expect } from 'chai'
import { describe, it, before } from 'mocha'
import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

import hre from 'hardhat'
const ethers = hre.ethers

import { deployContractsV5, deployPaidSessions } from '../../scripts/utils.js'

/// Bytecode-size + gas-cost regression fence.
///
/// Bumps to these thresholds should be intentional — bump only with a note
/// in the commit explaining what got more expensive and why it's acceptable.

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const USDC = (n) => ethers.utils.parseUnits(n.toString(), 6)

// EIP-170 deployed-code-size cap.
const EIP_170 = 24_576

// PaidSessions snapshot (deployed bytecode bytes). Headroom ≈ 1KB.
// Production contract (no Mock) — measured 2026-05.
const PAID_SESSIONS_SIZE_MAX = 21_500

// Gas snapshot for the lifecycle hot path. Measured on the in-memory hardhat
// network with viaIR + optimizer (the production config). Includes ~10% headroom.
// `exposedSettle` includes the full 1000-element long-buffer scan plus an N-element
// short-buffer scan, so it dominates. ~2.5M is expected at W_LONG=1000.
const GAS_BUDGETS = {
  buyIn: 320_000,
  commit: 220_000,
  exposedSettle: 2_800_000,
  processForfeits: 90_000
}

const advanceTime = async (seconds) => {
  await hre.network.provider.send('evm_increaseTime', [seconds])
  await hre.network.provider.send('evm_mine')
}

const mineOne = async () => {
  await hre.network.provider.send('evm_mine')
}

describe('PaidSessions gas + size snapshot', function () {
  this.timeout(50_000_000)

  describe('deployed bytecode size', () => {
    it('production PaidSessions fits well under EIP-170', async () => {
      const artifactPath = path.resolve(
        __dirname,
        '../../artifacts/contracts/PaidSessions.sol/PaidSessions.json'
      )
      const artifact = JSON.parse(await fs.readFile(artifactPath, 'utf8'))
      const deployedSize =
        artifact.deployedBytecode.length / 2 -
        (artifact.deployedBytecode.startsWith('0x') ? 1 : 0)

      expect(deployedSize).to.be.lessThan(EIP_170)
      expect(deployedSize).to.be.lessThan(
        PAID_SESSIONS_SIZE_MAX,
        `PaidSessions deployed size grew to ${deployedSize} bytes ` +
          `(threshold ${PAID_SESSIONS_SIZE_MAX}). ` +
          `Bump PAID_SESSIONS_SIZE_MAX intentionally if this is expected.`
      )
    })
  })

  describe('lifecycle gas costs', () => {
    let env, player, sessionId

    before(async () => {
      env = await deployContractsV5({ mock: true, verbose: false })
      const { PaidSessions } = await deployPaidSessions({
        AnybodyProblemV5: env.AnybodyProblemV5,
        MockUSDC: env.MockUSDC,
        mock: true
      })
      env.PaidSessions = PaidSessions

      const [owner, p1] = await ethers.getSigners()
      player = p1
      await env.MockUSDC.mint(owner.address, USDC(50_000))
      await env.MockUSDC.approve(env.PaidSessions.address, USDC(50_000))
      await env.PaidSessions.fundPrizePool(USDC(50_000))

      await env.MockUSDC.mint(player.address, USDC(100))
      await env.MockUSDC.connect(player).approve(
        env.PaidSessions.address,
        USDC(100)
      )

      // Pre-seed buffers so percentile lookups in settle hit the full scan path
      // (this is the actual cost we care about regressing).
      for (let i = 0; i < 1000; i++) {
        await env.PaidSessions.pushLongForTest(1000 + (i % 1000))
      }
      for (let i = 0; i < 10; i++) {
        await env.PaidSessions.pushShortForTest(1000 + i * 100)
      }
    })

    it(`buyIn ≤ ${GAS_BUDGETS.buyIn.toLocaleString()} gas`, async () => {
      const tx = await env.PaidSessions.connect(player).buyIn(2)
      const rcpt = await tx.wait()
      sessionId = rcpt.events.find((e) => e.event === 'SessionStarted').args
        .sessionId
      expect(rcpt.gasUsed.toNumber()).to.be.lessThan(GAS_BUDGETS.buyIn)
    })

    it(`commit ≤ ${GAS_BUDGETS.commit.toLocaleString()} gas`, async () => {
      await mineOne()
      const salt = ethers.utils.hexZeroPad('0x1', 32)
      const scoreCommit = ethers.utils.solidityKeccak256(
        ['uint256', 'bytes32'],
        [0, salt]
      )
      const tx = await env.PaidSessions.connect(player).commit(
        sessionId,
        scoreCommit
      )
      const rcpt = await tx.wait()
      expect(rcpt.gasUsed.toNumber()).to.be.lessThan(GAS_BUDGETS.commit)
    })

    it(`exposedSettle (full 1000-elem long scan) ≤ ${GAS_BUDGETS.exposedSettle.toLocaleString()} gas`, async () => {
      const tx = await env.PaidSessions.exposedSettle(sessionId, 1500)
      const rcpt = await tx.wait()
      expect(rcpt.gasUsed.toNumber()).to.be.lessThan(GAS_BUDGETS.exposedSettle)
    })

    it(`processForfeits (single-session sweep) ≤ ${GAS_BUDGETS.processForfeits.toLocaleString()} gas`, async () => {
      // Set up a forfeit candidate.
      await env.PaidSessions.connect(player).buyIn(2)
      await advanceTime(301)
      const tx = await env.PaidSessions.processForfeits(50)
      const rcpt = await tx.wait()
      expect(rcpt.gasUsed.toNumber()).to.be.lessThan(GAS_BUDGETS.processForfeits)
    })
  })
})
