import { Chain } from '../shovel-config'
import db from './db'

type LeaderboardLine = {
  problemId: string
  owner: string
}

type SpeedScore = LeaderboardLine & { ticks: number }

type SolvedScore = LeaderboardLine & { solved: number }

type StreakScore = LeaderboardLine & { streak: number }

type DailyLeaderboard = {
  oneBody: SpeedScore[]
  twoBody: SpeedScore[]
  threeBody: SpeedScore[]
  cumulative: SpeedScore[]
}

type Leaderboard = {
  daily: Record<number, DailyLeaderboard>
  allTime: {
    mostSolved: SolvedScore[]
    currentStreak: StreakScore[]
    fastest: SpeedScore[]
  }
}

export const leaderboard: Leaderboard = {
  daily: {},
  allTime: {
    mostSolved: [],
    currentStreak: [],
    fastest: []
  }
}

function beginningOfTodayInUTCSeconds(): number {
  const now = new Date()
  const startOfTodayUTC = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())
  )
  return Math.floor(startOfTodayUTC.getTime() / 1000)
}

async function calculateDailyLeaderboard(day: number, chain: Chain) {
  const result = await db.query(`
  WITH fastest_times AS (
    SELECT 
        problem_id,
        level,
        MIN(ticks_in_this_match) AS fastest_time
    FROM 
        solver_solved
    WHERE 
        level IN (1, 2, 3)
        AND day = ${day}
        AND src_name = '${chain}'
    GROUP BY 
        problem_id, level
  ),
  cumulative_times AS (
      SELECT 
          problem_id,
          SUM(ticks_in_this_match) AS total_time
      FROM 
          solver_solved
      WHERE 
          day = ${day}
          AND src_name = '${chain}'
      GROUP BY 
          problem_id
      HAVING 
          COUNT(level) = 3
  ),
  ranked_fastest_times AS (
      SELECT 
          problem_id,
          level,
          fastest_time,
          ROW_NUMBER() OVER (PARTITION BY level ORDER BY fastest_time) AS rank
      FROM 
          fastest_times
  ),
  ranked_cumulative_times AS (
      SELECT 
          problem_id,
          total_time,
          ROW_NUMBER() OVER (ORDER BY total_time) AS rank
      FROM 
          cumulative_times
  ),
  leaderboard AS (
    SELECT 
        'Level 1' AS category,
        problem_id,
        fastest_time AS time
    FROM 
        ranked_fastest_times
    WHERE 
        level = 1 AND rank <= 3
    UNION ALL
    SELECT 
        'Level 2' AS category,
        problem_id,
        fastest_time AS time
    FROM 
        ranked_fastest_times
    WHERE 
        level = 2 AND rank <= 3
    UNION ALL
    SELECT 
        'Level 3' AS category,
        problem_id,
        fastest_time AS time
    FROM 
        ranked_fastest_times
    WHERE 
        level = 3 AND rank <= 3
    UNION ALL
    SELECT 
        'Cumulative' AS category,
        problem_id,
        total_time AS time
    FROM 
        ranked_cumulative_times
    WHERE 
        rank <= 3
    ORDER BY 
        category, time
  ),
  latest_transactions AS (
    SELECT
        token_id,
        "to",
        ROW_NUMBER() OVER (PARTITION BY token_id ORDER BY block_num DESC, tx_idx DESC, log_idx DESC) AS rn
    FROM
      problems_transfer
    WHERE
      token_id IN (SELECT problem_id FROM leaderboard)
      AND src_name = '${chain}'
  ),
  current_owners AS (
      SELECT
          token_id,
          concat('0x', encode("to", 'hex')) as owner
      FROM
          latest_transactions
      WHERE
          rn = 1
  )
  SELECT 
      *
  FROM
    leaderboard
  LEFT JOIN current_owners ON leaderboard.problem_id = current_owners.token_id
  `)

  function scores(rows: any[]): SpeedScore[] {
    return rows.map((r: any) => ({
      problemId: r.problem_id,
      ticks: r.time,
      owner: r.owner
    }))
  }

  return {
    oneBody: scores(result.rows.filter((r: any) => r.category === 'Level 1')),
    twoBody: scores(result.rows.filter((r: any) => r.category === 'Level 2')),
    threeBody: scores(result.rows.filter((r: any) => r.category === 'Level 3')),
    cumulative: scores(
      result.rows.filter((r: any) => r.category === 'Cumulative')
    )
  }
}

async function calculateAllTimeLeaderboard(
  today: number,
  chain: Chain
): Promise<Leaderboard['allTime']> {
  const n = 10
  const result = await db.query(`
  WITH most_solved AS (
    SELECT 
        problem_id,
        COUNT(*) AS solve_count
    FROM 
        solver_solved
    WHERE
        src_name = '${chain}'
    GROUP BY 
        problem_id
    ORDER BY 
        solve_count DESC
    LIMIT ${n}
),
current_streaks AS (
    SELECT
        problem_id,
        MAX(streak_length) AS current_streak
    FROM (
        SELECT
            problem_id,
            COUNT(*) AS streak_length
        FROM (
            SELECT
                problem_id,
                day,
                ROW_NUMBER() OVER (PARTITION BY problem_id ORDER BY day) - 
                ROW_NUMBER() OVER (PARTITION BY problem_id, day ORDER BY day) AS streak
            FROM
                solver_solved
            WHERE
                day <= ${today}
                AND src_name = '${chain}'
        ) AS subquery
        GROUP BY
            problem_id, streak
        HAVING
            MAX(day) = ${today}
    ) AS streaks
    GROUP BY 
        problem_id
    ORDER BY 
        current_streak DESC
    LIMIT ${n}
),
fastest_completed AS (
    SELECT 
        problem_id,
        SUM(ticks_in_this_match) AS total_time
    FROM 
        solver_solved
    WHERE
        src_name = '${chain}'
    GROUP BY 
        problem_id
    HAVING 
        COUNT(level) = 3
    ORDER BY 
        total_time ASC
    LIMIT ${n}
),
leaderboard AS (
  SELECT 
      'Most Solved' AS category,
      problem_id,
      solve_count AS metric
  FROM 
      most_solved
  UNION ALL
  SELECT 
      'Current Streak' AS category,
      problem_id,
      current_streak AS metric
  FROM 
      current_streaks
  UNION ALL
  SELECT 
      'Fastest Completed Problem' AS category,
      problem_id,
      total_time AS metric
  FROM 
      fastest_completed
)
SELECT 
    *
FROM
  leaderboard`)
  return {
    mostSolved: result.rows
      .filter((r: any) => r.category === 'Most Solved')
      .map((r: any) => ({
        problemId: r.problem_id,
        solved: parseInt(r.metric, 10),
        owner: r.owner
      })),
    currentStreak: result.rows
      .filter((r: any) => r.category === 'Current Streak')
      .map((r: any) => ({
        problemId: r.problem_id,
        streak: parseInt(r.metric, 10),
        owner: r.owner
      })),
    fastest: result.rows
      .filter((r: any) => r.category === 'Fastest Completed Problem')
      .map((r: any) => ({
        problemId: r.problem_id,
        ticks: parseInt(r.metric, 10),
        owner: r.owner
      }))
  }
}

export async function updateLeaderboard(chain: Chain) {
  const start = Date.now()

  const seasonStart = 1716336000

  // calculate daily leaderboards
  const today = beginningOfTodayInUTCSeconds()
  const daysSoFar: number[] = []
  for (let i = seasonStart; i < today; i += 86400) {
    daysSoFar.push(i)
  }

  const dailies = await Promise.all(
    daysSoFar.map(async (day) => {
      return calculateDailyLeaderboard(day, chain)
    })
  )

  leaderboard.daily = daysSoFar.reduce(
    (acc, day, idx) => {
      acc[day] = dailies[idx]
      return acc
    },
    {} as Record<number, DailyLeaderboard>
  )

  // calculate all-time leaderboards
  const allTime = await calculateAllTimeLeaderboard(today, chain)
  leaderboard.allTime = allTime

  console.log(chain, 'leaderboard updated in', Date.now() - start, 'ms')
}
