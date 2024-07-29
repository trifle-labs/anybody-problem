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

type LevelLeaderboard = {
  level: number
  events: SpeedScore[]
}

type DailyLeaderboard = {
  levels: LevelLeaderboard[]
  cumulative: SpeedScore[]
}

type Leaderboard = {
  daily: Record<number, DailyLeaderboard>
}

// TODO: pull this from the contract
const MAX_BODY_COUNT = 6
const DAILY_CATEGORY_LIMIT = 10

export const leaderboards: Record<Chain, Leaderboard> | {} = {}

async function calculateDailyLeaderboard(
  day: number,
  chain: Chain,
  today: number
) {
  const q = `
  WITH ranked_cumulative_times AS (
      SELECT 
          run_id,
          accumulative_time AS total_time,
          player,
          ROW_NUMBER() OVER (ORDER BY accumulative_time ASC) AS rank
      FROM 
        anybody_problem_run_solved
      WHERE 
        day = ${day}
        AND src_name = $1
  ),
  fastest_run AS (
    SELECT run_id, player, total_time
    FROM ranked_cumulative_times
    WHERE rank = 1
  ),
  level_times AS (
    SELECT
        level,
        time,
        run_id,
        player,
        day
    FROM anybody_problem_level_solved
    WHERE day = ${day} AND run_id = (SELECT run_id FROM fastest_run)
  ),
  leaderboard AS (
      SELECT
          level,
          run_id,
          time,
          player
      FROM
          level_times
      UNION ALL
      SELECT 
          NULL AS level,
          run_id,
          total_time AS time,
          player
      FROM 
          ranked_cumulative_times
      WHERE rank <= ${DAILY_CATEGORY_LIMIT}
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

  const levels: LevelLeaderboard[] = []
  // delete the if to include level scores for every day
  const includeLevelScores = today === day
  if (includeLevelScores) {
    for (let i = 1; i <= MAX_BODY_COUNT; i++) {
      const events = scores(result.rows.filter((r: any) => r.level === `${i}`))
      if (!events.length) continue
      levels.push({
        level: i,
        events
      })
    }
  }
  const cumulativeEvents = scores(result.rows.filter((r: any) => !r.level))

  return { levels, cumulative: cumulativeEvents }
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
      return calculateDailyLeaderboard(day, chain, today)
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

export async function rankToday(time) {
  const today = currentDayInUnixTime()
  const query = `
  SELECT
      COUNT(*) + 1 as rank
  FROM
      anybody_problem_run_solved
  WHERE
      day = $1
      AND accumulative_time < $2
  `

  const result = await db.query(query, [today, time])

  return result.rows[0].rank
}
