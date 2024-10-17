import { expect } from 'chai'
import hre from 'hardhat'
import { time } from '@nomicfoundation/hardhat-network-helpers'

const ethers = hre.ethers

import {
  deployContracts,
  getParsedEventLogs
  // generateProof
} from '../../scripts/utils.js'

const SECONDS_IN_DAY = 86400
const earlyMonday = 1728259200 // Mon Oct 7 2024 00:00:00 GMT+0000
const actualMonday = 1730678400 // Mon Nov 04 2024 00:00:00 GMT+0000
const dayOfTheWeek = (day) => {
  return ((day - earlyMonday) / SECONDS_IN_DAY) % 7
}
const dayFromTime = (time) => {
  return time - (time % SECONDS_IN_DAY)
}
const incrementTilMonday = async () => {
  const now = await time.latest()
  const day = dayFromTime(now)
  let dayOfWeek = dayOfTheWeek(day)

  // make sure test starts on a Monday
  const forward = SECONDS_IN_DAY * (7 - dayOfWeek)
  await time.increase(forward)

  const newNow = await time.latest()
  const newDay = dayFromTime(newNow)
  const newDayOfWeek = dayOfTheWeek(newDay)
  expect(newDayOfWeek).to.equal(0) // Monday
}

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

    const [currentWinner] = await Tournament.mostAverageByWeek(week)
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

    const [mostAverageByWeek] = await Tournament.mostAverageByWeek(week)
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
    const [mostAverageByWeek_] = await Tournament.mostAverageByWeek(week)
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
    const [newestWeeklyAverage] = await Tournament.mostAverageByWeek(week)
    expect(newestWeeklyAverage).to.equal(acct4.address)
  })

  it('waits until week is over to pay, doesnt allow paying twice', async () => {
    const { Tournament, AnybodyProblemV2 } = await deployContracts({
      mock: true
    })
    const day = await AnybodyProblemV2.currentDay()
    await Tournament.setVars(earlyMonday)

    const prize = ethers.utils.parseEther('0.1')
    const week = await Tournament.dayToWeek(day)
    await Tournament.fillPrize(week, { value: prize })
    const prize_ = await Tournament.prizes(week)
    expect(prize_).to.equal(prize)

    const secondPrize = ethers.utils.parseEther('0.05')
    await Tournament.fillPrize(week, { value: secondPrize })
    const totalPrize = await Tournament.prizes(week)
    expect(totalPrize).to.equal(prize.add(secondPrize))
  })

  it('prize pays out', async () => {
    const { Tournament, AnybodyProblemV2 } = await deployContracts({
      mock: true
    })
    await Tournament.setDisableForTesting(true)
    await Tournament.setVars(earlyMonday)

    // let day = await AnybodyProblemV2.currentDay()
    // let dayOfWeek = await Tournament.dayOfTheWeek(day)

    // // make sure test starts on a Monday
    // const forward = SECONDS_IN_DAY * (7 - dayOfWeek.toNumber())
    // await time.increase(forward)

    // day = await AnybodyProblemV2.currentDay()
    // dayOfWeek = await Tournament.dayOfTheWeek(day)
    // expect(dayOfWeek).to.equal(0) // Monday
    await incrementTilMonday()
    const day = await AnybodyProblemV2.currentDay()
    const week = await Tournament.currentWeek()

    const [acct1, acct2, acct3] = await ethers.getSigners()

    await Tournament.setVars(earlyMonday)
    const days = [
      [
        { accumulativeTime: 100, player: acct1.address },
        { accumulativeTime: 268, player: acct2.address },
        { accumulativeTime: 400, player: acct3.address }
      ],
      [
        { accumulativeTime: 300, player: acct1.address },
        { accumulativeTime: 268, player: acct2.address },
        { accumulativeTime: 400, player: acct3.address }
      ],
      [
        { accumulativeTime: 300, player: acct1.address },
        { accumulativeTime: 268, player: acct2.address },
        { accumulativeTime: 400, player: acct3.address }
      ]
    ]
    let runId = 0
    let tx
    for (let i = 0; i < days.length; i++) {
      const today = day.add(i * SECONDS_IN_DAY)
      const runs = days[i]
      for (let j = 0; j < runs.length; j++) {
        const run = runs[j]
        runId++
        await AnybodyProblemV2.setRunData(
          runId,
          today,
          run.accumulativeTime,
          run.player
        )
        tx = await Tournament.addToLeaderboard(runId)
      }
    }

    const winner = acct2.address

    const winnersAverage = Math.round(
      days.reduce(
        (acc, day) =>
          acc +
          day
            .filter((run) => run.player == winner)
            .reduce((acc, run) => acc + run.accumulativeTime, 0),
        0
      ) / 3
    )
    const globalAverage = Math.round(
      days.reduce(
        (acc, day) =>
          acc + day.reduce((acc, run) => acc + run.accumulativeTime, 0),
        0
      ) / 9
    )

    await expect(tx)
      .to.emit(Tournament, 'RecordBroken')
      .withArgs('average', week, winner, globalAverage, winnersAverage)

    const prizeAmount = ethers.utils.parseEther('0.1')
    await Tournament.fillPrize(week, { value: prizeAmount })
    const prize_ = await Tournament.prizes(week)
    expect(prize_).to.equal(prizeAmount)
    const prizePortion = prizeAmount.div(3)

    // fast forward to last day and ensure contest isn't over
    await time.increase(6 * SECONDS_IN_DAY)
    // check that contest payout fails
    const currentWeekNow = await Tournament.currentWeek()
    expect(currentWeekNow).to.equal(week)

    await expect(Tournament.payoutAverage(week)).to.be.revertedWith(
      'Contest is not over'
    )

    // final day fast forward
    await time.increase(SECONDS_IN_DAY)

    const [mostAverageByWeek] = await Tournament.mostAverageByWeek(week)
    expect(mostAverageByWeek).to.equal(winner)
    const winnerBalanceBefore = await acct2.getBalance()
    const tx2 = await Tournament.payoutAverage(week)
    await expect(tx2)
      .to.emit(Tournament, 'EthMoved')
      .withArgs(winner, true, '0x', prizePortion)

    const receipt = await tx2.wait()
    /*const events =*/ getParsedEventLogs(receipt, Tournament, 'RecordBroken')
    // console.dir({ events }, { depth: null })
    const winnerBalanceAfter = await acct2.getBalance()
    expect(winnerBalanceAfter.sub(winnerBalanceBefore)).to.equal(prizePortion)

    await expect(Tournament.payoutAverage(week)).to.be.revertedWith(
      'Already paid out average'
    )
  })
  it('adds and updates fastest and slowest', async () => {
    const { Tournament, AnybodyProblemV2 } = await deployContracts({
      mock: true
    })
    await Tournament.setDisableForTesting(true)
    await Tournament.setVars(earlyMonday)
    const [, acct1, acct2, acct3] = await ethers.getSigners()
    await incrementTilMonday()

    const day = await AnybodyProblemV2.currentDay()
    const week = await Tournament.currentWeek()
    const days = [
      [
        { accumulativeTime: 100, player: acct1.address }, // fastest
        { accumulativeTime: 268, player: acct2.address },
        { accumulativeTime: 400, player: acct3.address } // slowest
      ],
      [
        { accumulativeTime: 300, player: acct1.address },
        { accumulativeTime: 268, player: acct2.address },
        { accumulativeTime: 400, player: acct3.address }
      ],
      [
        { accumulativeTime: 300, player: acct1.address },
        { accumulativeTime: 268, player: acct2.address },
        { accumulativeTime: 400, player: acct3.address }
      ]
    ]
    let runId = 0
    for (let i = 0; i < days.length; i++) {
      const today = day.add(i * SECONDS_IN_DAY)
      const runs = days[i]
      for (let j = 0; j < runs.length; j++) {
        const run = runs[j]
        runId++
        await AnybodyProblemV2.setRunData(
          runId,
          today,
          run.accumulativeTime,
          run.player
        )
        await Tournament.addToLeaderboard(runId)
      }
    }

    const fastest = acct1
    const slowest = acct3

    const fastestAddress = await Tournament.fastestByWeek(week)
    expect(fastestAddress).to.equal(fastest.address)

    const slowestAddress = await Tournament.slowestByWeek(week)
    expect(slowestAddress).to.equal(slowest.address)

    // prizes
    const prizeAmount = ethers.utils.parseEther('0.1')
    await Tournament.fillPrize(week, { value: prizeAmount })
    const prize_ = await Tournament.prizes(week)
    expect(prize_).to.equal(prizeAmount)
    const prizePortion = prizeAmount.div(3)

    // fast forward to last day and ensure contest isn't over
    await time.increase(6 * SECONDS_IN_DAY)
    // check that contest payout fails
    const currentWeekNow = await Tournament.currentWeek()
    expect(currentWeekNow).to.equal(week)

    await expect(Tournament.payoutFastest(week)).to.be.revertedWith(
      'Contest is not over'
    )
    await expect(Tournament.payoutSlowest(week)).to.be.revertedWith(
      'Contest is not over'
    )

    // final day fast forward
    await time.increase(SECONDS_IN_DAY)

    const fastestBalanceBefore = await fastest.getBalance()
    await expect(Tournament.payoutFastest(week))
      .to.emit(Tournament, 'EthMoved')
      .withArgs(fastest.address, true, '0x', prizePortion)

    const fastestBalanceAfter = await fastest.getBalance()
    expect(fastestBalanceAfter.sub(fastestBalanceBefore)).to.equal(prizePortion)

    await expect(Tournament.payoutFastest(week)).to.be.revertedWith(
      'Already paid out fastest'
    )

    const slowestBalanceBefore = await slowest.getBalance()
    await expect(Tournament.payoutSlowest(week))
      .to.emit(Tournament, 'EthMoved')
      .withArgs(slowest.address, true, '0x', prizePortion)
    const slowestBalanceAfter = await slowest.getBalance()
    expect(slowestBalanceAfter.sub(slowestBalanceBefore)).to.equal(prizePortion)
  })
  // it('confirms all functions of tree')
})
