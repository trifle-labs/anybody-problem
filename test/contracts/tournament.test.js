import { expect } from 'chai'
import hre from 'hardhat'
const ethers = hre.ethers

import {
  deployContracts
  // generateProof
} from '../../scripts/utils.js'

// let tx
describe('AnybodyProblem Tests', function () {
  this.timeout(50000000)

  it('uses the mock correctly', async () => {
    const [owner] = await ethers.getSigners()
    const { AnybodyProblemV2 } = await deployContracts({
      mock: true
    })
    const run = {
      runId: 1,
      day: 1,
      accumulativeTime: 1,
      owner: owner.address
    }
    await AnybodyProblemV2.setRunData(
      run.runId,
      run.day,
      run.accumulativeTime,
      run.owner
    )
    const runData = await AnybodyProblemV2.runs(run.runId)
    expect(runData.day).to.equal(run.day)
    expect(runData.accumulativeTime).to.equal(run.accumulativeTime)
    expect(runData.owner).to.equal(run.owner)
  })

  it('sets anybodyProblemAddress correctly', async () => {
    const { Tournament, AnybodyProblemV2 } = await deployContracts({
      mock: true
    })
    expect(await Tournament.anybodyProblem()).to.equal(AnybodyProblemV2.address)
  })

  it('sets tournament Vars from AnybodyProblem', async () => {
    const { Tournament, AnybodyProblemV2 } = await deployContracts({
      mock: true
    })
    const FIRST_DAY = await Tournament.FIRST_DAY()
    const FIRST_DAY_ = await AnybodyProblemV2.FIRST_DAY()
    expect(FIRST_DAY).to.equal(FIRST_DAY_)

    const SECONDS_IN_A_DAY = await Tournament.SECONDS_IN_A_DAY()
    const SECONDS_IN_A_DAY_ = await AnybodyProblemV2.SECONDS_IN_A_DAY()
    expect(SECONDS_IN_A_DAY).to.equal(SECONDS_IN_A_DAY_)
  })

  it('only allows AnybodyProblem to execute the onlyAnybodyProblem methods', async () => {
    const { Tournament, AnybodyProblemV2 } = await deployContracts({
      mock: true
    })

    const [owner] = await ethers.getSigners()

    await expect(Tournament.addToLeaderboard(1)).to.be.revertedWith(
      'Only the AnybodyProblemV2 contract can call this function'
    )

    const day = await AnybodyProblemV2.currentDay()
    const runId = 1
    const speed = 1
    await AnybodyProblemV2.setRunData(runId, day, speed, owner.address)

    await Tournament.setDisableForTesting(true)
    await expect(Tournament.addToLeaderboard(runId)).to.not.be.reverted
  })

  it('adds 1 run to the leaderboards, confirms average values', async () => {
    const { Tournament, AnybodyProblemV2 } = await deployContracts({
      mock: true
    })
    const [owner] = await ethers.getSigners()
    const runId = 1
    const speed = 50
    const day = await AnybodyProblemV2.currentDay()
    const player = owner.address
    await AnybodyProblemV2.setRunData(runId, day, speed, player)
    await Tournament.setDisableForTesting(true)
    await Tournament.addToLeaderboard(runId)

    const week = await Tournament.dayToWeek(day)

    // weeklyUserAverage
    const weeklyStatsByPlayer = await Tournament.weeklyStatsByPlayer(
      week,
      player
    )
    console.log({ weeklyStatsByPlayer })
    expect(weeklyStatsByPlayer.totalPlays).to.equal(1)
    expect(weeklyStatsByPlayer.totalTime).to.equal(speed)

    const lastUpdated = await AnybodyProblemV2.counterForOrdering()
    expect(weeklyStatsByPlayer.lastUpdated).to.equal(lastUpdated)

    const weeklyStats = await Tournament.weeklyStats(week)
    expect(weeklyStats.totalPlays).to.equal(1)
    expect(weeklyStats.totalTime).to.equal(speed)
    expect(weeklyStats.lastUpdated).to.equal(lastUpdated)

    // const tree = await Tournament.weeklyStatsSortedTree(week)
    const average = speed / 1
    const exists = await Tournament.exists(week, average)
    expect(exists).to.equal(true)

    const ownerAddressAsKey = '0x'.concat(
      owner.address.slice(2).padStart(64, '0').toLowerCase()
    )
    const keyExists = await Tournament.keyExists(
      week,
      ownerAddressAsKey,
      average
    )
    expect(keyExists).to.equal(true)

    const getNodeCount = await Tournament.getNodeCount(week, average)
    expect(getNodeCount).to.equal(1)

    const valueKeyAtIndex = await Tournament.valueKeyAtIndex(week, average, 0)
    expect(valueKeyAtIndex).to.equal(ownerAddressAsKey)

    const currentWinner = await Tournament.mostAverageByWeek(week)
    expect(currentWinner).to.equal(owner.address)
  })

  it.only('adds 3 runs to the leaderboards, confirms average values', async () => {
    const { Tournament, AnybodyProblemV2 } = await deployContracts({
      mock: true
    })
    const [acct1, acct2, acct3] = await ethers.getSigners()
    const day = await AnybodyProblemV2.currentDay()
    const runs = [
      { runId: 1, accumulativeTime: 100, day, player: acct1.address },
      { runId: 2, accumulativeTime: 300, day, player: acct1.address },
      { runId: 3, accumulativeTime: 268, day, player: acct2.address }, // player 2 will win
      { runId: 4, accumulativeTime: 400, day, player: acct3.address }
    ]
    const average = Math.floor(
      runs.reduce((acc, run) => acc + run.accumulativeTime, 0) / runs.length
    )
    console.log({ average })
    expect(average).to.equal(267)
    await Tournament.setDisableForTesting(true)
    for (const run of runs) {
      await AnybodyProblemV2.setRunData(
        run.runId,
        run.day,
        run.accumulativeTime,
        run.player
      )
      await Tournament.addToLeaderboard(run.runId)
    }

    const week = await Tournament.dayToWeek(day)

    // first check average of player 1
    const weeklyStatsByPlayer = await Tournament.weeklyStatsByPlayer(
      week,
      acct1.address
    )
    console.log({ weeklyStatsByPlayer })
    const player1Plays = runs.filter(
      (run) => run.player === acct1.address
    ).length
    expect(weeklyStatsByPlayer.totalPlays).to.equal(player1Plays)
    const player1Time = runs
      .filter((run) => run.player === acct1.address)
      .reduce((acc, run) => acc + run.accumulativeTime, 0)
    expect(weeklyStatsByPlayer.totalTime).to.equal(player1Time)
    expect(weeklyStatsByPlayer.lastUpdated).to.equal(player1Plays)

    // then check average of all players

    const weeklyStats = await Tournament.weeklyStats(week)
    expect(weeklyStats.totalPlays).to.equal(runs.length)
    const totalTime = runs.reduce((acc, run) => acc + run.accumulativeTime, 0)
    expect(weeklyStats.totalTime).to.equal(totalTime)
    expect(weeklyStats.lastUpdated).to.equal(runs.length)

    // const globalAverage = Math.floor(totalTime / runs.length)
    // const exists = await Tournament.exists(week, globalAverage)
    // expect(exists).to.equal(false)

    // const existingAverage = runs[runs.length - 1].accumulativeTime
    // console.log({ existingAverage })

    // const doesExist = await Tournament.exists(week, existingAverage)
    // expect(doesExist).to.equal(true)

    // const node = await Tournament.getNode(week, existingAverage)
    // console.log({ node })

    // const rank = await Tournament.rank(week, globalAverage)
    // console.log({ rank })

    // const rankAt = await Tournament.atRank(week, rank)
    // console.log({ rankAt })

    // const above = await Tournament.atRank(week, rank + 1)
    // console.log({ above })

    // const below = await Tournament.atRank(week, rank - 1)
    // console.log({ below })

    // const prevValue = await Tournament.prev(week, existingAverage)
    // console.log({ prevValue })

    // const nextValue = await Tournament.next(week, existingAverage)
    // console.log({ nextValue })

    // const belowValue = await Tournament.below(week, existingAverage)
    // console.log({ belowValue })

    // const aboveValue = await Tournament.above(week, existingAverage)
    // console.log({ aboveValue })

    const mostAverageByWeek = await Tournament.mostAverageByWeek(week)
    expect(mostAverageByWeek).to.equal(acct2.address)
  })
})
