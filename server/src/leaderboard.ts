import { Chain } from '../shovel-config'
import db from './db'
import { currentDayInUnixTime } from './util'

type LeaderboardLine = {
  player: string
}

type SpeedScore = LeaderboardLine & {
  player: string
  time: number
  runId: number | null
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
  slowest: SpeedScore[]
  streaks: { player: string; streak: number }[]
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
          ROW_NUMBER() OVER (ORDER BY accumulative_time ASC) AS rank,
          ROW_NUMBER() OVER (ORDER BY accumulative_time DESC) AS reverse_rank
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
  slowest_runs AS (
    SELECT run_id, player, total_time
    FROM ranked_cumulative_times
    WHERE reverse_rank <= 10
  ),
  -- Select the level times for the fastest run of the day
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
  -- Select the fastest time for each level across all runs on the day
  all_level_times_ranked AS (
    SELECT
        level,
        time,
        run_id,
        player,
        day,
        ROW_NUMBER() OVER (PARTITION BY level ORDER BY time ASC) AS rn  -- Rank times for each level
    FROM anybody_problem_level_solved
    WHERE day = ${day}
  ),
  all_level_times AS (
    -- Select only the fastest time for each level
    SELECT
        level,
        time,
        run_id,
        player,
        day
    FROM all_level_times_ranked
    WHERE rn = 1  -- Only the fastest time (row number 1)
  ),
  daily_activity AS (
    SELECT DISTINCT player, day
    FROM anybody_problem_run_solved
    WHERE src_name = $1 AND day <= ${day}
    ORDER BY player, day
  ),
  streak_calc AS (
    SELECT
        player,
        day,
        day - LAG(day, 1, day - 86400) OVER (PARTITION BY player ORDER BY day) AS day_diff
    FROM daily_activity
  ),
  streak_groups AS (
    SELECT
        player,
        day,
        SUM(CASE WHEN day_diff > 86400 THEN 1 ELSE 0 END) OVER (PARTITION BY player ORDER BY day) AS streak_group
    FROM streak_calc
  ),
  streak_lengths AS (
    SELECT
        player,
        streak_group,
        COUNT(*) AS streak_length,
        MAX(day) AS streak_end
    FROM streak_groups
    GROUP BY player, streak_group
  ),
  player_streaks AS (
    SELECT
        player,
        MAX(streak_length) AS longest_streak,
        CASE 
            WHEN MAX(streak_end) = ${day}
            THEN MAX(CASE WHEN streak_end = ${day} THEN streak_length ELSE 0 END)
            ELSE 0
        END AS current_streak
    FROM streak_lengths
    GROUP BY player
  ),
  top_streaks AS (
    SELECT player, current_streak
    FROM player_streaks
    WHERE current_streak > 0
    ORDER BY current_streak DESC, player
    LIMIT 10
  ),
  leaderboard AS (
      SELECT
          level,
          run_id,
          time,
          player,
          'level_times' AS type
      FROM
          level_times
      UNION ALL
      SELECT
          level,
          run_id,
          time,
          player,
          'all_level_times' AS type
      FROM
          all_level_times
      UNION ALL
      SELECT 
          NULL AS level,
          run_id,
          total_time AS time,
          player,
          'cumulative' AS type
      FROM 
          ranked_cumulative_times
      WHERE rank <= ${DAILY_CATEGORY_LIMIT}
      UNION ALL
      SELECT
          -1 AS level,
          run_id,
          total_time AS time,
          player,
          'slowest' AS type
      FROM
          slowest_runs
      UNION ALL
      SELECT
          -2 AS level,
          NULL AS run_id,
          current_streak AS time,
          player,
          'streaks' AS type
      FROM
          top_streaks
  )
  SELECT 
      leaderboard.level,
      leaderboard.run_id,
      leaderboard.time,
      concat('0x', encode(leaderboard.player, 'hex')) as player,
      leaderboard.type
  FROM
      leaderboard;
  `

  const result = await db.query(q, [chain])
  function scores(rows: any[], type: string): SpeedScore[] {
    return rows
      .filter((r: any) => r.type === type)
      .map((r: any) => ({
        level: parseInt(r.level),
        runId: r.run_id ? parseInt(r.run_id) : null,
        day,
        date: new Date(day * 1000).toISOString().split('T')[0],
        time: parseInt(r.time),
        player: r.player
      }))
  }

  const levels: LevelLeaderboard[] = []
  const allLevels: LevelLeaderboard[] = []
  const includeLevelScores = today === day
  if (includeLevelScores) {
    for (let i = 1; i < MAX_BODY_COUNT; i++) {
      const events = scores(result.rows, 'level_times').filter(
        (r: any) => r.level === i
      )
      const allEvents = scores(result.rows, 'all_level_times').filter(
        (r: any) => r.level === i
      )

      if (events.length) {
        levels.push({
          level: i,
          events
        })
      }

      if (allEvents.length) {
        allLevels.push({
          level: i,
          events: allEvents
        })
      }
    }
  }
  const cumulativeEvents = scores(result.rows, 'cumulative')
  const slowestEvents = scores(result.rows, 'slowest')
  const streaks = result.rows
    .filter((r: any) => r.type === 'streaks')
    .map((r: any) => ({ player: r.player, streak: parseInt(r.time) }))

  return {
    levels,
    allLevels, // Include the new allLevels array
    cumulative: cumulativeEvents,
    slowest: slowestEvents,
    streaks
  }
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
