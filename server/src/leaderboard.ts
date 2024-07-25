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

type SolvedScore = LeaderboardLine & { solved: number }

type StreakScore = LeaderboardLine & { player: string; streak: number }

type DaysPlayedScore = LeaderboardLine & { daysPlayed: number }

type LevelLeaderboard = {
  level: number
  events: SpeedScore[]
}

type DailyLeaderboard = {
  cumulative: SpeedScore[]
}

type Leaderboard = {
  daily: Record<number, DailyLeaderboard>
  allTime: {
    mostSolved: SolvedScore[]
    currentStreak: StreakScore[]
    longestStreak: StreakScore[]
    fastest: SpeedScore[]
    daysPlayed: DaysPlayedScore[]
  }
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

async function calculateAllTimeLeaderboard(
  today: number,
  chain: Chain
): Promise<Leaderboard['allTime']> {
  const yesterday = today - 24 * 60 * 60
  const n = 10
  const result = await db.query(
    `
WITH current_streaks AS (
    SELECT
        player,
        MAX(streak_length) AS current_streak
    FROM (
        SELECT
            player,
            COUNT(*) AS streak_length
        FROM (
            SELECT
                day,
                player,
                ROW_NUMBER() OVER (PARTITION BY run_id ORDER BY day) -
                ROW_NUMBER() OVER (PARTITION BY run_id, day ORDER BY day) AS streak
            FROM
                anybody_problem_run_solved
            WHERE
                src_name = $1
        ) AS subquery
        GROUP BY
            player, streak
        HAVING MAX(day) = ${today} OR MAX(day) = ${yesterday} -- ensure the streak is current
    ) AS streaks
    GROUP BY 
        player
    ORDER BY 
        current_streak DESC
    LIMIT ${n}
),
longest_streaks AS (
    SELECT
        player,
        MAX(streak_length) AS current_streak
    FROM (
        SELECT
            player,
            COUNT(*) AS streak_length
        FROM (
            SELECT
                day,
                player,
                ROW_NUMBER() OVER (PARTITION BY run_id ORDER BY day) -
                ROW_NUMBER() OVER (PARTITION BY run_id, day ORDER BY day) AS streak
            FROM
                anybody_problem_run_solved
            WHERE
                src_name = $1
        ) AS subquery
        GROUP BY
            player, streak
    ) AS streaks
    GROUP BY
        player
    ORDER BY
        current_streak DESC
    LIMIT ${n}
),
fastest_completed AS (
    SELECT
        run_id,
        player,
        accumulative_time as time,
        day
    FROM
        anybody_problem_run_solved
    WHERE
        src_name = $1
    ORDER BY
        time ASC
    LIMIT ${n}
),
players_with_most_days_played AS (
  SELECT
      player,
      COUNT(DISTINCT day) AS days_played
  FROM
      anybody_problem_level_solved
  WHERE
      src_name = $1
  GROUP BY
      player
  ORDER BY
      days_played DESC
  LIMIT ${n}
),
players_with_most_levels_solved AS (
  SELECT
      player,
      COUNT(DISTINCT (run_id, level)) AS solve_count
  FROM
      anybody_problem_level_solved
  WHERE
      src_name = $1
  GROUP BY
      player
  ORDER BY
      solve_count DESC
  LIMIT ${n}
),
leaderboard AS (
    SELECT
        'Current Streak' AS category,
        player,
        current_streak AS metric,
        NULL::jsonb AS additional_info
    FROM
        current_streaks
    UNION ALL
    SELECT
        'Longest Streak' AS category,
        player,
        current_streak AS metric,
        NULL::jsonb AS additional_info
    FROM
        longest_streaks
    UNION ALL
    SELECT
        'Fastest Completed Problem' AS category,
        player,
        time AS metric,
        jsonb_build_object('runId', run_id, 'day', day) AS additional_info
    FROM
        fastest_completed
    UNION ALL
    SELECT
        'Most Days Played' AS category,
        player,
        days_played AS metric,
        NULL::jsonb AS additional_info
    FROM
        players_with_most_days_played
    UNION ALL
    SELECT
        'Most Solved' AS category,
        player,
        solve_count AS metric,
        NULL::jsonb AS additional_info
    FROM
        players_with_most_levels_solved
)
SELECT
    category,
    CONCAT('0x', encode(player, 'hex')) as player,
    metric,
    additional_info->>'runId' AS runId,
    additional_info->>'day' AS day
FROM
    leaderboard;
`,
    [chain]
  )
  return {
    mostSolved: result.rows
      .filter((r: any) => r.category === 'Most Solved')
      .map((r: any) => ({
        solved: parseInt(r.metric),
        player: r.player
      })),
    currentStreak: result.rows
      .filter((r: any) => r.category === 'Current Streak')
      .map((r: any) => ({
        runId: r.run_id,
        streak: parseInt(r.metric),
        player: r.player
      })),
    longestStreak: result.rows
      .filter((r: any) => r.category === 'Longest Streak')
      .map((r: any) => ({
        runId: r.run_id,
        streak: parseInt(r.metric),
        player: r.player
      })),
    fastest: result.rows
      .filter((r: any) => r.category === 'Fastest Completed Problem')
      .map((r: any) => ({
        runId: r.runId,
        day: r.day,
        date: new Date(r.day * 1000).toISOString().split('T')[0],
        time: parseInt(r.metric),
        player: r.player
      })),
    daysPlayed: result.rows
      .filter((r: any) => r.category === 'Most Days Played')
      .map((r: any) => ({
        player: r.player,
        daysPlayed: parseInt(r.metric)
      }))
  }
}

export async function recentSolvesToday(chain: Chain) {
  const today = currentDayInUnixTime()
  const result = await db.query(
    `
    SELECT
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

  const [allTime, feed] = await Promise.all([
    calculateAllTimeLeaderboard(today, chain),
    recentSolvesToday(chain)
  ])

  leaderboards[chain] = {
    daily,
    feed,
    allTime
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
