import { expect } from 'chai'
import hre from 'hardhat'
const ethers = hre.ethers

import {
  deployContracts
  // generateProof
} from '../../scripts/utils.js'

const earlyMonday = 1728864000 // Mon Oct 14 2024 00:00:00 GMT+0000
const actualMonday = 1730678400 // Mon Nov 04 2024 00:00:00 GMT+0000

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
    const { Tournament } = await deployContracts({
      mock: true
    })
    const firstMonday = await Tournament.firstMonday()
    expect(firstMonday).to.equal(actualMonday)

    await Tournament.setVars(earlyMonday)
    const firstMonday_ = await Tournament.firstMonday()
    expect(firstMonday_).to.equal(earlyMonday)
  })

  it('only allows AnybodyProblem to execute the onlyAnybodyProblem methods', async () => {
    const { Tournament, AnybodyProblemV2 } = await deployContracts({
      mock: true
    })
    await Tournament.setVars(earlyMonday)

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
    await Tournament.setVars(earlyMonday)
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

    const currentWinner = await Tournament.mostAverageByWeek(week)
    expect(currentWinner).to.equal(owner.address)
  })

  it('adds and updates averages, confirms closest search and tree index works', async () => {
    const { Tournament, AnybodyProblemV2 } = await deployContracts({
      mock: true
    })
    await Tournament.setVars(earlyMonday)
    const [acct1, acct2, acct3, acct4] = await ethers.getSigners()
    const day = await AnybodyProblemV2.currentDay()
    const runs = [
      { runId: 1, accumulativeTime: 100, day, player: acct1.address },
      { runId: 2, accumulativeTime: 300, day, player: acct1.address },
      { runId: 3, accumulativeTime: 268, day, player: acct2.address }, // player 2 will win
      { runId: 4, accumulativeTime: 400, day, player: acct3.address }
    ]
    const average = Math.round(
      runs.reduce((acc, run) => acc + run.accumulativeTime, 0) / runs.length
    )
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

    const mostAverageByWeek = await Tournament.mostAverageByWeek(week)
    expect(mostAverageByWeek).to.equal(acct2.address)
    const globalAverage = Math.round(
      runs.reduce((acc, run) => acc + run.accumulativeTime, 0) / runs.length
    )

    // now add someone who is same distance from average as current winner
    // and in the same direction. However the new person should not be the new winner
    // because the original winner was first (has lower index)

    const newest = {
      runId: 5,
      accumulativeTime: globalAverage + 1, // this makes the average 268m like current winner average
      day,
      player: acct4.address
    }
    expect(newest.accumulativeTime).to.equal(268)

    await AnybodyProblemV2.setRunData(
      newest.runId,
      newest.day,
      newest.accumulativeTime,
      newest.player
    )
    await Tournament.addToLeaderboard(newest.runId)
    const mostAverageByWeek_ = await Tournament.mostAverageByWeek(week)
    expect(mostAverageByWeek_).to.equal(acct2.address)

    // now add that same person enough times to tip the average into their favor

    const enoughRunsToTipTheAverage = [
      {
        runId: 6,
        accumulativeTime: globalAverage - 3, // should equal 264, this brings local average down to 266
        day,
        player: acct4.address
      },
      {
        runId: 7,
        accumulativeTime: globalAverage - 1, // the rest of these bring global average down to 266.4, rounded to 266
        day,
        player: acct4.address
      },
      {
        runId: 8,
        accumulativeTime: globalAverage - 1,
        day,
        player: acct4.address
      },
      {
        runId: 9,
        accumulativeTime: globalAverage - 1,
        day,
        player: acct4.address
      }
    ]
    expect(enoughRunsToTipTheAverage[0].accumulativeTime).to.equal(264)

    for (const run of enoughRunsToTipTheAverage) {
      await AnybodyProblemV2.setRunData(
        run.runId,
        run.day,
        run.accumulativeTime,
        run.player
      )
      await Tournament.addToLeaderboard(run.runId)
    }

    const newAverageShouldBe = Math.round(
      runs
        .concat(...enoughRunsToTipTheAverage)
        .concat(newest)
        .reduce((acc, run) => acc + run.accumulativeTime, 0) /
        (runs.length + enoughRunsToTipTheAverage.length + 1)
    )

    const mostAverageByWeek__ = await Tournament.weeklyAverage(week)
    expect(mostAverageByWeek__).to.equal(globalAverage - 1)
    expect(newAverageShouldBe).to.equal(mostAverageByWeek__)
    const newestWeeklyAverage = await Tournament.mostAverageByWeek(week)
    expect(newestWeeklyAverage).to.equal(acct4.address)
  })

  // it('waits until week is over to pay, doesnt allow paying twice')
  // it('confirms all functions of tree')
  // it('adds and updates fastest')
  // it('adds and updates slowest')
})
