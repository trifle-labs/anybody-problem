import { expect } from 'chai'
import { beforeEach, afterEach, describe, it } from 'mocha'
import hre from 'hardhat'
import { time, takeSnapshot } from '@nomicfoundation/hardhat-network-helpers'
// import withArgs from '@nomicfoundation/hardhat-chai-matchers'
// console.log({ withArgs })
// const { anyValue } = withArgs

const ethers = hre.ethers
// import ethers from '@nomicfoundation/hardhat-ignition-ethers'
// console.log({ ethers })

import {
  deployContracts,
  getParsedEventLogs,
  earlyMonday
  // generateProof
} from '../../scripts/utils.js'

const SECONDS_IN_DAY = 86400
const actualMonday = 1731283200 // Mon Nov 11 2024 00:00:00 GMT+0000

// const daysInContest = 7
// const minimumDaysPlayed = 3

const divRound = (a, b) => {
  if (a.isBigNumber) a = a.toBigInt()
  if (b.isBigNumber) b = b.toBigInt()
  if (typeof a !== 'bigint') a = BigInt(a)
  if (typeof b !== 'bigint') b = BigInt(b)
  if (a == 0n || b == 0n) return 0
  let result = a / b // integer division is same as Math.floor
  if ((a % b) * 2n >= b) result++
  if (result > BigInt(Number.MAX_SAFE_INTEGER)) {
    return ethers.BigNumber.from(result)
  }
  return parseInt(result)
}

function seededRandom(seed) {
  let m = 0x80000000 // 2^31
  let a = 1103515245
  let c = 12345

  // Use the seed to initialize the state
  let state = seed ? seed : Math.floor(Math.random() * (m - 1))

  // Generate the next random number
  return function () {
    state = (a * state + c) % m
    return state / (m - 1)
  }
}

const dayOfTheWeek = (day, daysInContest) => {
  return ((day - earlyMonday) / SECONDS_IN_DAY) % daysInContest
}
const dayFromTime = (time) => {
  return time - (time % SECONDS_IN_DAY)
}
const incrementTilMonday = async (daysInContest) => {
  const now = await time.latest()
  const day = dayFromTime(now)
  let dayOfWeek = dayOfTheWeek(day, daysInContest)

  // make sure test starts on a Monday
  const forward = SECONDS_IN_DAY * (daysInContest - dayOfWeek)
  await time.increase(forward)

  const newNow = await time.latest()
  const newDay = dayFromTime(newNow)
  const newDayOfWeek = dayOfTheWeek(newDay, daysInContest)
  expect(newDayOfWeek).to.equal(0) // Monday
}

// let tx
describe('Tournament Tests', function () {
  this.timeout(50000000)
  let lastSnapshot
  beforeEach(async () => {
    lastSnapshot = await takeSnapshot()
  })
  afterEach(async () => {
    await lastSnapshot.restore()
  })

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

    await Tournament.setFirstMonday(earlyMonday)
    const firstMonday_ = await Tournament.firstMonday()
    expect(firstMonday_).to.equal(earlyMonday)
  })

  it('only allows AnybodyProblem to execute the onlyAnybodyProblem methods', async () => {
    const { Tournament, AnybodyProblemV2 } = await deployContracts({
      mock: true
    })
    await Tournament.setFirstMonday(earlyMonday)

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
    await Tournament.setFirstMonday(earlyMonday)
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
    const average = divRound(speed, 1)
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
    await Tournament.setFirstMonday(earlyMonday)
    const [acct1, acct2, acct3, acct4] = await ethers.getSigners()
    const day = await AnybodyProblemV2.currentDay()
    const runs = [
      { runId: 1, accumulativeTime: 100, day, player: acct1.address },
      { runId: 2, accumulativeTime: 300, day, player: acct1.address },
      { runId: 3, accumulativeTime: 268, day, player: acct2.address }, // player 2 will win
      { runId: 4, accumulativeTime: 400, day, player: acct3.address }
    ]
    const average = divRound(
      runs.reduce((acc, run) => acc + run.accumulativeTime, 0),
      runs.length
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
    const globalAverage = divRound(
      runs.reduce((acc, run) => acc + run.accumulativeTime, 0),
      runs.length
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
    await Tournament.setFirstMonday(earlyMonday)

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
    await Tournament.setFirstMonday(earlyMonday)

    const daysInContest = await Tournament.daysInContest()

    await incrementTilMonday(daysInContest)
    const day = await AnybodyProblemV2.currentDay()
    const week = await Tournament.currentWeek()

    const [acct1, acct2, acct3] = await ethers.getSigners()

    await Tournament.setFirstMonday(earlyMonday)
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
    const winnerAcct = acct2
    const winner = winnerAcct.address

    const winnersAverage = divRound(
      days.reduce(
        (acc, day) =>
          acc +
          day
            .filter((run) => run.player == winner)
            .reduce((acc, run) => acc + run.accumulativeTime, 0),
        0
      ),
      3
    )
    const globalAverage = divRound(
      days.reduce(
        (acc, day) =>
          acc + day.reduce((acc, run) => acc + run.accumulativeTime, 0),
        0
      ),
      9
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
    await time.increase((daysInContest - 1) * SECONDS_IN_DAY)
    // check that contest payout fails
    const currentWeekNow = await Tournament.currentWeek()
    expect(currentWeekNow).to.equal(week)

    await expect(
      Tournament.connect(winnerAcct).payoutAverage(week)
    ).to.be.revertedWith('Contest is not over')

    // final day fast forward
    await time.increase(SECONDS_IN_DAY)

    const [mostAverageByWeek] = await Tournament.mostAverageByWeek(week)
    expect(mostAverageByWeek).to.equal(winner)
    const winnerBalanceBefore = await acct2.getBalance()

    await expect(Tournament.payoutAverage(week)).to.be.revertedWith(
      'Only winner can withdraw'
    )

    const tx2 = await Tournament.connect(winnerAcct).payoutAverage(week)
    await expect(tx2)
      .to.emit(Tournament, 'EthMoved')
      .withArgs(winner, true, '0x', prizePortion)
      .to.emit(Tournament, 'ClaimedPrize')
      .withArgs(week, winner, prizePortion, 'average')

    const receipt = await tx2.wait()
    /*const events =*/ getParsedEventLogs(receipt, Tournament, 'RecordBroken')
    // console.dir({ events }, { depth: null })

    const winnerBalanceAfter = await acct2.getBalance()
    const gasUsed = receipt.gasUsed.mul(receipt.effectiveGasPrice)
    expect(winnerBalanceAfter.sub(winnerBalanceBefore)).to.equal(
      prizePortion.sub(gasUsed)
    )

    await expect(
      Tournament.connect(winnerAcct).payoutAverage(week)
    ).to.be.revertedWith('Already paid out average')
  })
  it('adds and updates fastest and slowest', async () => {
    const { Tournament, AnybodyProblemV2 } = await deployContracts({
      mock: true
    })
    await Tournament.setDisableForTesting(true)
    await Tournament.setFirstMonday(earlyMonday)
    const daysInContest = await Tournament.daysInContest()
    const [, acct1, acct2, acct3] = await ethers.getSigners()
    await incrementTilMonday(daysInContest)

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
    await time.increase((daysInContest - 1) * SECONDS_IN_DAY)
    // check that contest payout fails
    const currentWeekNow = await Tournament.currentWeek()
    expect(currentWeekNow).to.equal(week)

    await expect(
      Tournament.connect(fastest).payoutFastest(week)
    ).to.be.revertedWith('Contest is not over')
    await expect(
      Tournament.connect(slowest).payoutSlowest(week)
    ).to.be.revertedWith('Contest is not over')

    // final day fast forward
    await time.increase(SECONDS_IN_DAY)

    const fastestBalanceBefore = await fastest.getBalance()
    let tx = await Tournament.connect(fastest).payoutFastest(week)
    let receipt = await tx.wait()
    await expect(tx)
      .to.emit(Tournament, 'EthMoved')
      .withArgs(fastest.address, true, '0x', prizePortion)

    const fastestBalanceAfter = await fastest.getBalance()
    let gasUsed = receipt.gasUsed.mul(receipt.effectiveGasPrice)
    expect(fastestBalanceAfter.sub(fastestBalanceBefore)).to.equal(
      prizePortion.sub(gasUsed)
    )

    await expect(
      Tournament.connect(fastest).payoutFastest(week)
    ).to.be.revertedWith('Already paid out fastest')

    const slowestBalanceBefore = await slowest.getBalance()
    tx = await Tournament.connect(slowest).payoutSlowest(week)
    receipt = await tx.wait()
    await expect(tx)
      .to.emit(Tournament, 'EthMoved')
      .withArgs(slowest.address, true, '0x', prizePortion)
    const slowestBalanceAfter = await slowest.getBalance()
    gasUsed = receipt.gasUsed.mul(receipt.effectiveGasPrice)
    expect(slowestBalanceAfter.sub(slowestBalanceBefore)).to.equal(
      prizePortion.sub(gasUsed)
    )
  })
  it('doesnt save your score if you dont buy a ticket', async () => {
    const [, acct1] = await ethers.getSigners()

    const { Tournament, AnybodyProblemV2 } = await deployContracts({
      mock: true
    })
    await Tournament.setDisableForTesting(true)
    await AnybodyProblemV2.setTest(true)
    await Tournament.setFirstMonday(earlyMonday)
    const daysInContest = await Tournament.daysInContest()
    const newPrice = ethers.utils.parseEther('0.01')
    const newPercent = 0.5 // 500 / 1000 = 50%
    const FACTOR = await Tournament.FACTOR()
    const newPercentInt = FACTOR.toNumber() * newPercent
    await Tournament.updateEntryPrice(newPrice)
    await Tournament.updateEntryPercent(newPercentInt)

    await incrementTilMonday(daysInContest)

    let day = await AnybodyProblemV2.currentDay()
    let week = await Tournament.currentWeek()

    const minimumDaysPlayed = await Tournament.minimumDaysPlayed()
    // starting on first day of the contest

    let runId = 0
    for (let i = 0; i < minimumDaysPlayed.toNumber(); i++) {
      runId++
      const runFail = {
        runId,
        day: day.add(i * SECONDS_IN_DAY),
        speed: Math.floor(Math.random() * 1000) + 1,
        player: acct1.address
      }
      await AnybodyProblemV2.setRunData(
        runFail.runId,
        runFail.day,
        runFail.speed,
        runFail.player
      )
      await Tournament.addToLeaderboard(runFail.runId)
    }

    // even though they played the minimum number of days, they didn't buy a ticket
    // so they aren't recorded as the fastest
    const fastest = await Tournament.fastestByWeek(week)
    expect(fastest).to.equal(ethers.constants.AddressZero)

    const slowest = await Tournament.slowestByWeek(week)
    expect(slowest).to.equal(ethers.constants.AddressZero)

    const [mostAverage] = await Tournament.mostAverageByWeek(week)
    expect(mostAverage).to.equal(ethers.constants.AddressZero)
  })

  it('doesnt save your score if you dont do minimum number of days', async () => {
    const [, acct1, acct2] = await ethers.getSigners()
    // console.log({ acct1: acct1.address, acct2: acct2.address })
    const { Tournament, AnybodyProblemV2 } = await deployContracts({
      mock: true
    })
    await Tournament.setDisableForTesting(true)
    await AnybodyProblemV2.setTest(true)
    await Tournament.setFirstMonday(earlyMonday)
    const daysInContest = await Tournament.daysInContest()
    // const newPrice = ethers.utils.parseEther('0.01')
    const newPercent = 0.5 // 500 / 1000 = 50%
    const FACTOR = await Tournament.FACTOR()
    const newPercentInt = FACTOR.toNumber() * newPercent
    // await Tournament.updateEntryPrice(newPrice)
    await Tournament.updateEntryPercent(newPercentInt)

    await incrementTilMonday(daysInContest)

    let day = await AnybodyProblemV2.currentDay()
    let week = await Tournament.currentWeek()

    const minimumDaysPlayedInt = 2
    await Tournament.updateMinimumNumberOfDays(minimumDaysPlayedInt)

    const minimumDaysPlayed = await Tournament.minimumDaysPlayed()
    expect(minimumDaysPlayed).eq(minimumDaysPlayedInt)

    let runId = 0
    const missingDays = 1
    for (let i = 0; i < minimumDaysPlayed.sub(missingDays).toNumber(); i++) {
      runId++
      const runFail = {
        runId,
        day,
        speed: 50,
        player: acct1.address
      }
      await AnybodyProblemV2.setRunData(
        runFail.runId,
        runFail.day,
        runFail.speed,
        runFail.player
      )
      await Tournament.addToLeaderboard(runFail.runId)
      day = day.add(SECONDS_IN_DAY)
    }

    // even though they played the minimum number of days, they didn't buy a ticket
    // so they aren't recorded as the fastest
    const fastest = await Tournament.fastestByWeek(week)
    expect(fastest).to.equal(ethers.constants.AddressZero)

    const slowest = await Tournament.slowestByWeek(week)
    expect(slowest).to.equal(ethers.constants.AddressZero)

    const [mostAverage] = await Tournament.mostAverageByWeek(week)
    expect(mostAverage).to.equal(ethers.constants.AddressZero)

    // add someone in between with worse scores
    // this is to ensure that even though they completed the minimum number of days
    // they aren't kept as the winner. Important to note that the original player
    // had a winning score before they reached minimum number of days, the one they
    // add at the end is not a winner compared to this middle player.

    let day2 = await AnybodyProblemV2.currentDay()
    for (let i = 0; i < minimumDaysPlayed.toNumber(); i++) {
      runId++
      const run = {
        runId,
        day: day2,
        speed: 75,
        player: acct2.address
      }
      await AnybodyProblemV2.setRunData(
        run.runId,
        run.day,
        run.speed,
        run.player
      )
      await Tournament.addToLeaderboard(run.runId)
      day2 = day2.add(SECONDS_IN_DAY)
    }

    const fastest2 = await Tournament.fastestByWeek(week)
    expect(fastest2).to.equal(acct2.address)

    const slowest2 = await Tournament.slowestByWeek(week)
    expect(slowest2).to.equal(acct2.address)

    const [mostAverage2] = await Tournament.mostAverageByWeek(week)
    expect(mostAverage2).to.equal(acct2.address)

    // now finally add the missing days for the player that has ties the fastest,
    // slowest and most average (total is 150 over 2 runs for each of them).
    // All categories are tied, player 1 began first, but player 2
    // finalized their weekly tallied scores first.

    // now add the missing days
    for (let i = 0; i < missingDays; i++) {
      runId++
      const runFail = {
        runId,
        day,
        speed: 100,
        player: acct1.address
      }
      await AnybodyProblemV2.setRunData(
        runFail.runId,
        runFail.day,
        runFail.speed,
        runFail.player
      )
      await Tournament.addToLeaderboard(runFail.runId)
      day = day.add(SECONDS_IN_DAY)
    }

    const fastest3 = await Tournament.fastestByWeek(week)
    expect(fastest3).to.equal(acct2.address)

    const slowest3 = await Tournament.slowestByWeek(week)
    expect(slowest3).to.equal(acct2.address)

    const [mostAverage3] = await Tournament.mostAverageByWeek(week)
    expect(mostAverage3).to.equal(acct2.address)
  })
  it('pays out prize + tickets to winners', async () => {
    const [, acct1, acct2, acct3] = await ethers.getSigners()
    const accounts = [acct1, acct2, acct3]

    const { Tournament, AnybodyProblem } = await deployContracts({
      mock: true
    })
    await Tournament.setDisableForTesting(true)
    await AnybodyProblem.setTest(true)
    await Tournament.setFirstMonday(earlyMonday)

    const enforceDaysInContest = 7
    const enforceMinimumDaysPlayed = 3
    await Tournament.updateMinimumNumberOfDays(enforceMinimumDaysPlayed)
    await Tournament.updateDaysInContest(enforceDaysInContest)

    const newPrice = ethers.utils.parseEther('0.01')
    const newPercent = 0.1 // 500 / 1000 = 50%
    const FACTOR = await Tournament.FACTOR()
    const newPercentInt = FACTOR.toNumber() * newPercent
    await Tournament.updateEntryPrice(newPrice)
    await Tournament.updateEntryPercent(newPercentInt)

    // ff the clock to the first day of the contest
    const daysInContest = await Tournament.daysInContest()
    const minimumDaysPlayed = await Tournament.minimumDaysPlayed()

    await incrementTilMonday(daysInContest)

    const proceedRecipient = await AnybodyProblem.proceedRecipient()
    const proceedPortion = newPrice.mul(newPercentInt).div(FACTOR)

    for (let i = 0; i < accounts.length; i++) {
      await expect(
        Tournament.connect(accounts[i]).buyTicket({ value: newPrice })
      )
        .to.emit(Tournament, 'EthMoved')
        .withNamedArgs({
          success: true,
          to: Tournament.address,
          amount: newPrice.sub(proceedPortion)
        })
        .withNamedArgs({
          success: true,
          to: proceedRecipient,
          amount: proceedPortion
        })
    }

    let day = await AnybodyProblem.currentDay()
    let week = await Tournament.currentWeek()
    const random = seededRandom(week.toNumber())
    let runId = 0
    let records = {}
    for (let i = 0; i < daysInContest.toNumber(); i++) {
      // const unixTimeToText = new Date(day.toNumber() * 1000)
      //   .toString()
      //   .substring(0, 15)
      // console.log('day is ', unixTimeToText)
      // console.log('week is ', week.toString())
      for (let j = 0; j < accounts.length; j++) {
        runId++
        const run = {
          runId,
          day,
          time: Math.floor(random() * 1000) + 1,
          player: accounts[j].address
        }
        if (!records[run.player]) records[run.player] = []
        records[run.player].push(run)
        await AnybodyProblem.setRunData(
          run.runId,
          run.day,
          run.time,
          run.player
        )
        await Tournament.addToLeaderboard(run.runId)
      }
      if (i < daysInContest.toNumber() - 1) {
        await time.increase(SECONDS_IN_DAY)
      }
      day = await AnybodyProblem.currentDay()
      week = await Tournament.currentWeek()
    }

    const { fastest, slowest, mostAverage } = ((records) => {
      const sortedRecords = Object.entries(records).map(([player, runs]) => {
        runs.sort((a, b) => parseInt(a.time) - parseInt(b.time))
        const fastestTotal = runs
          .slice(0, minimumDaysPlayed)
          .reduce((acc, run) => {
            return acc + parseInt(run.time)
          }, 0)
        const slowestTotal = runs
          .slice()
          .reverse()
          .slice(0, minimumDaysPlayed)
          .reduce((acc, run) => {
            return acc + parseInt(run.time)
          }, 0)
        const average = divRound(
          runs.reduce((acc, run) => {
            return acc + parseInt(run.time)
          }, 0),
          runs.length
        )
        return {
          player,
          fastestTotal,
          slowestTotal,
          average,
          minimumDaysMet: runs.length >= minimumDaysPlayed
        }
      })
      sortedRecords.sort(
        (a, b) => parseInt(a.fastestTotal) - parseInt(b.fastestTotal)
      )
      const fastest = sortedRecords.slice()
      sortedRecords.sort(
        (a, b) => parseInt(b.slowestTotal) - parseInt(a.slowestTotal)
      )
      const slowest = sortedRecords.slice()
      let totalRuns = 0
      const globalAverage = divRound(
        Object.entries(records)
          .map(([, runs]) => {
            totalRuns += runs.length
            return runs.reduce((acc, run) => acc + run.time, 0)
          })
          .reduce((acc, time) => acc + time, 0),
        totalRuns
      )
      const mostAverage = sortedRecords.sort(
        (a, b) =>
          Math.abs(a.average - globalAverage) -
          Math.abs(b.average - globalAverage)
      )
      return { fastest, slowest, mostAverage, globalAverage }
    })(records)

    // console.dir({ records }, { depth: null })
    // console.dir({ fastest, slowest, mostAverage }, { depth: null })
    // console.log('-------------------')
    // for (let i = 0; i < accounts.length; i++) {
    //   const account = accounts[i]
    //   console.log({ account: account.address })
    //   const weekAverageStats = await Tournament.weeklyStatsByPlayer(
    //     week,
    //     account.address
    //   )
    //   console.log({ weekAverageStats })
    //   for (let j = 0; j < daysInContest.toNumber(); j++) {
    //     const weekFastestStats = await Tournament.fastestByWeekByPlayer(
    //       week,
    //       account.address,
    //       j
    //     )
    //     console.log({ weekFastestStats })
    //     const weekSlowestStats = await Tournament.slowestByWeekByPlayer(
    //       week,
    //       account.address,
    //       j
    //     )
    //     console.log({ weekSlowestStats })
    //   }
    // }

    const fastest_ = await Tournament.fastestByWeek(week)
    const slowest_ = await Tournament.slowestByWeek(week)
    const [mostAverage_] = await Tournament.mostAverageByWeek(week)
    // console.log({ fastest_, slowest_, mostAverage_ })
    expect(fastest_.toString()).to.equal(fastest[0].player)

    expect(slowest_.toString()).to.equal(slowest[0].player)

    expect(mostAverage_.toString()).to.equal(mostAverage[0].player)

    await expect(Tournament.payoutFastest(week)).to.be.revertedWith(
      'Contest is not over'
    )
    await expect(Tournament.payoutSlowest(week)).to.be.revertedWith(
      'Contest is not over'
    )
    await expect(Tournament.payoutAverage(week)).to.be.revertedWith(
      'Contest is not over'
    )

    // fast forward to first day of next week, contest is over
    await time.increase(SECONDS_IN_DAY)

    const prizeTotal = newPrice.sub(proceedPortion).mul(accounts.length)

    const contractBalanceBefore = await ethers.provider.getBalance(
      Tournament.address
    )
    expect(contractBalanceBefore).to.equal(prizeTotal)

    const prizeStored = await Tournament.prizes(week)
    expect(prizeStored).to.equal(prizeTotal)

    const prizePortion = ethers.BigNumber.from(
      divRound(prizeTotal.toBigInt(), 3)
    )

    const fastestAccount = accounts.find(
      (account) => account.address === fastest[0].player
    )
    const slowestAccount = accounts.find(
      (account) => account.address === slowest[0].player
    )
    const mostAverageAccount = accounts.find(
      (account) => account.address === mostAverage[0].player
    )

    await expect(Tournament.payoutFastest(week)).to.be.revertedWith(
      'Only winner can withdraw'
    )
    await expect(Tournament.payoutSlowest(week)).to.be.revertedWith(
      'Only winner can withdraw'
    )
    await expect(Tournament.payoutAverage(week)).to.be.revertedWith(
      'Only winner can withdraw'
    )

    const fastestBalanceBefore = await fastestAccount.getBalance()
    let tx = await Tournament.connect(fastestAccount).payoutFastest(week)
    let receipt = await tx.wait()
    let gasUsed = receipt.gasUsed.mul(receipt.effectiveGasPrice)
    expect(tx)
      .to.emit(Tournament, 'EthMoved')
      .withNamedArgs({
        to: fastestAccount.address,
        success: true,
        amount: prizePortion
      })
      .to.emit(Tournament, 'ClaimedPrize')
      .withNamedArgs({
        week,
        player: fastestAccount.address,
        prizeAmount: prizePortion,
        category: 'fastest'
      })
    const fastestBalanceAfter = await fastestAccount.getBalance()
    expect(fastestBalanceAfter.sub(fastestBalanceBefore)).to.equal(
      prizePortion.sub(gasUsed)
    )

    const slowestBalanceBefore = await slowestAccount.getBalance()
    tx = await Tournament.connect(slowestAccount).payoutSlowest(week)
    receipt = await tx.wait()
    gasUsed = receipt.gasUsed.mul(receipt.effectiveGasPrice)
    expect(tx)
      .to.emit(Tournament, 'EthMoved')
      .withNamedArgs({
        to: slowestAccount.address,
        success: true,
        amount: prizePortion
      })
      .to.emit(Tournament, 'ClaimedPrize')
      .withNamedArgs({
        week,
        player: slowestAccount.address,
        prizeAmount: prizePortion,
        category: 'slowest'
      })
    const slowestBalanceAfter = await slowestAccount.getBalance()
    expect(slowestBalanceAfter.sub(slowestBalanceBefore)).to.equal(
      prizePortion.sub(gasUsed)
    )

    const mostAverageBalanceBefore = await mostAverageAccount.getBalance()

    tx = await Tournament.connect(mostAverageAccount).payoutAverage(week)
    receipt = await tx.wait()
    gasUsed = receipt.gasUsed.mul(receipt.effectiveGasPrice)
    expect(tx)
      .to.emit(Tournament, 'EthMoved')
      .withNamedArgs({
        to: mostAverageAccount.address,
        success: true,
        amount: prizePortion
      })
      .to.emit(Tournament, 'ClaimedPrize')
      .withNamedArgs({
        week,
        player: mostAverageAccount.address,
        prizeAmount: prizePortion,
        category: 'average'
      })
    const mostAverageBalanceAfter = await mostAverageAccount.getBalance()
    expect(mostAverageBalanceAfter.sub(mostAverageBalanceBefore)).to.equal(
      prizePortion.sub(gasUsed)
    )
    const contractBalanceAfter = await ethers.provider.getBalance(
      Tournament.address
    )
    expect(contractBalanceAfter).to.equal(0)

    await expect(
      Tournament.connect(fastestAccount).payoutFastest(week)
    ).to.be.revertedWith('Already paid out fastest')
    await expect(
      Tournament.connect(slowestAccount).payoutSlowest(week)
    ).to.be.revertedWith('Already paid out slowest')
    await expect(
      Tournament.connect(mostAverageAccount).payoutAverage(week)
    ).to.be.revertedWith('Already paid out average')
  })
  it.skip('revokes mistaken prize')
  it.skip('refund unclaimed prize')
  it.skip('confirms all functions of tree')
})
