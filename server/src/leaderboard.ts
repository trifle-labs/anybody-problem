import { Chain } from '../shovel-config'
import db from './db'
import { currentDayInUnixTime } from './util'

type LeaderboardLine = {
  player: string
}

type SpeedScore = LeaderboardLine & {
  player: string
  time: number
  runId: number
  date: string
  day: number
}

type DailyLeaderboard = {
  cumulative: SpeedScore[]
}

type Leaderboard = {
  daily: Record<number, DailyLeaderboard>
}

// TODO: pull this from the contract
const MAX_BODY_COUNT = 6
const DAILY_CATEGORY_LIMIT = 10

export const leaderboards: Record<Chain, Leaderboard> | {} = {}

async function calculateDailyLeaderboard(day: number, chain: Chain) {
  const q = `
  WITH ranked_cumulative_times AS (
      SELECT 
          run_id,
          accumulative_time AS total_time,
          player
      FROM 
        anybody_problem_run_solved
      WHERE 
        day = ${day}
        AND src_name = $1
    ORDER BY total_time ASC
      LIMIT ${DAILY_CATEGORY_LIMIT}
  ),
  leaderboard AS (
      SELECT 
          NULL AS level,
          run_id,
          total_time AS time,
          player
      FROM 
          ranked_cumulative_times
  )
  SELECT 
      leaderboard.level,
      leaderboard.run_id,
      leaderboard.time,
      concat('0x', encode(player, 'hex')) as player
  FROM
      leaderboard;
  `
  const result = await db.query(q, [chain])
  function scores(rows: any[]): SpeedScore[] {
    return rows.map((r: any) => ({
      runId: parseInt(r.run_id),
      day,
      date: new Date(day * 1000).toISOString().split('T')[0],
      time: parseInt(r.time),
      player: r.player
    }))
  }

  const cumulativeEvents = scores(result.rows.filter((r: any) => !r.level))

  return { cumulative: cumulativeEvents }
}

export async function recentSolvesToday(chain: Chain) {
  const today = currentDayInUnixTime()
  const result = await db.query(
    `
    SELECT
        rank() OVER (ORDER BY accumulative_time ASC) as rank,
        run_id,
        CONCAT('0x', encode(player, 'hex')) as player,
        accumulative_time as time,
        day
    FROM
        anybody_problem_run_solved
    WHERE
        src_name = $1
        AND day = ${today}
    ORDER BY
        run_id DESC
    LIMIT 20
    `,
    [chain]
  )
  return result.rows.map((r: any) => ({
    rank: parseInt(r.rank),
    runId: parseInt(r.run_id),
    day: parseInt(r.day),
    date: new Date(r.day * 1000).toISOString().split('T')[0],
    time: parseInt(r.time),
    player: r.player
  }))
}

export async function updateLeaderboard(chain: Chain) {
  const start = Date.now()

  // calculate daily leaderboards
  const today = currentDayInUnixTime()
  const daysSoFar: number[] = []
  const ONE_DAY_SECONDS = 86400
  for (let i = today; i > today - ONE_DAY_SECONDS * 21; i -= ONE_DAY_SECONDS) {
    daysSoFar.push(i)
  }

  const dailies = await Promise.all(
    daysSoFar.map(async (day) => {
      return calculateDailyLeaderboard(day, chain)
    })
  )

  const doneWithDaily = Date.now()

  const daily = daysSoFar.reduce(
    (acc, day, idx) => {
      acc[day] = dailies[idx]
      return acc
    },
    {} as Record<number, DailyLeaderboard>
  )

  const feed = await recentSolvesToday(chain)

  leaderboards[chain] = {
    daily,
    feed
  }

  console.log(
    `[${today}]:`,
    chain,
    'leaderboard updated in',
    Date.now() - start,
    'ms with',
    `(${doneWithDaily - start}ms for ${dailies.length} days)`
  )
}
