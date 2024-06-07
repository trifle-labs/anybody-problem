import { Chain } from '../shovel-config'
import db from './db'

type LeaderboardLine = {
  problemId: string
  owner: string
}

type Body = {
  problemId: string
  bodyId: string
  tick: number
  px: number
  py: number
  radius: number
  seed: string
  owner: string
  mintedBodyIndex: number
}

type Problems = Record<
  string, // problemId
  {
    owner: string
    bodies: Body[]
  }
>

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
  problems: Problems
  daily: Record<number, DailyLeaderboard>
  allTime: {
    mostSolved: SolvedScore[]
    currentStreak: StreakScore[]
    fastest: SpeedScore[]
  }
}

// TODO: pull this from the contract
const MAX_BODY_COUNT = 3
const DAILY_CATEGORY_LIMIT = 3

export const leaderboards: Record<Chain, Leaderboard> | {} = {}

function currentDayInUnixTime() {
  const date = new Date()
  date.setUTCHours(0, 0, 0, 0)
  return date.getTime() / 1000
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
          day = ${day}
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
          COUNT(level) = ${MAX_BODY_COUNT}
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
          level,
          problem_id,
          fastest_time AS time
      FROM
          ranked_fastest_times
      WHERE
          rank <= ${DAILY_CATEGORY_LIMIT}
      UNION ALL
      SELECT 
          NULL AS level,
          problem_id,
          total_time AS time
      FROM 
          ranked_cumulative_times
      WHERE 
          rank <= ${DAILY_CATEGORY_LIMIT}
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
      leaderboard.level,
      leaderboard.problem_id,
      leaderboard.time,
      current_owners.owner
  FROM
      leaderboard
  LEFT JOIN current_owners ON leaderboard.problem_id = current_owners.token_id
  ORDER BY
      COALESCE(leaderboard.level, 0), leaderboard.time;
  `)

  function scores(rows: any[]): SpeedScore[] {
    return rows.map((r: any) => ({
      problemId: r.problem_id,
      ticks: parseInt(r.time),
      owner: r.owner
    }))
  }

  const levels = []
  for (let i = 1; i <= MAX_BODY_COUNT; i++) {
    const events = scores(result.rows.filter((r: any) => r.level === `${i}`))
    if (events.length) {
      levels.push({
        level: i,
        events
      })
    }
  }
  const cumulativeEvents = scores(result.rows.filter((r: any) => !r.level))

  return { levels, cumulative: cumulativeEvents }
}

async function calculateAllTimeLeaderboard(
  today: number,
  chain: Chain
): Promise<Leaderboard['allTime']> {
  const n = 10
  const result = await db.query(
    `
  WITH most_solved AS (
    SELECT 
        problem_id,
        COUNT(*) AS solve_count
    FROM 
        solver_solved
    WHERE
        src_name = $1
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
                AND src_name = $1
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
        src_name = $1
    GROUP BY 
        problem_id
    HAVING 
        COUNT(level) = ${MAX_BODY_COUNT}
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
  leaderboard`,
    [chain]
  )
  return {
    mostSolved: result.rows
      .filter((r: any) => r.category === 'Most Solved')
      .map((r: any) => ({
        problemId: r.problem_id,
        solved: parseInt(r.metric),
        owner: r.owner
      })),
    currentStreak: result.rows
      .filter((r: any) => r.category === 'Current Streak')
      .map((r: any) => ({
        problemId: r.problem_id,
        streak: parseInt(r.metric),
        owner: r.owner
      })),
    fastest: result.rows
      .filter((r: any) => r.category === 'Fastest Completed Problem')
      .map((r: any) => ({
        problemId: r.problem_id,
        ticks: parseInt(r.metric),
        owner: r.owner
      }))
  }
}

export async function getProblems(chain: Chain) {
  const bodies = await db.query(
    `
    WITH latest_transactions AS (
      SELECT
          token_id,
          "to",
          ROW_NUMBER() OVER (PARTITION BY token_id ORDER BY block_num DESC, tx_idx DESC, log_idx DESC) AS rn
      FROM
        problems_transfer
      WHERE
        src_name = $1
  ),
  current_owners AS (
      SELECT
          "to",
          token_id
      FROM
          latest_transactions
      WHERE
          rn = 1
  ),
  body_add_remove_events AS (
      SELECT
          ba.problem_id,
          ba.body_id,
          ba.block_num,
          ba.tx_idx,
          ba.log_idx,
          'added' AS status
      FROM
      problems_body_added ba
      WHERE src_name = $1
      UNION ALL
      SELECT
          br.problem_id,
          br.body_id,
          br.block_num,
          br.tx_idx,
          br.log_idx,
          'removed' AS status
      FROM
      problems_body_removed br
      WHERE src_name = $1
  ),
  body_final_status AS (
      SELECT
          problem_id,
          body_id,
          status,
          ROW_NUMBER() OVER (PARTITION BY problem_id, body_id ORDER BY block_num DESC, tx_idx DESC, log_idx DESC) AS rn
      FROM
          body_add_remove_events
  )
  SELECT
      ba.problem_id,
      ba.body_id,
      ba.minted_body_index,
      ba.tick,
      ba.px,
      ba.py,
      ba.radius,
      CONCAT('0x', encode(ba.seed, 'hex')) AS seed,
      CONCAT('0x', encode(ba.log_addr, 'hex')) AS log_addr,
      CONCAT('0x', encode(co."to", 'hex')) AS owner
  FROM
    problems_body_added ba
  JOIN
      current_owners co ON ba.problem_id = co.token_id
  JOIN
      body_final_status bfs ON ba.problem_id = bfs.problem_id AND ba.body_id = bfs.body_id
  WHERE
      bfs.rn = 1
      AND bfs.status = 'added';`,
    [chain]
  )

  function bodyFromRow(row: Record<string, string>): Body {
    return {
      problemId: row.problem_id,
      bodyId: row.body_id,
      tick: parseInt(row.tick),
      px: parseInt(row.px),
      py: parseInt(row.py),
      radius: parseInt(row.radius),
      seed: row.seed,
      owner: row.owner,
      mintedBodyIndex: parseInt(row.minted_body_index)
    }
  }

  const problems: Problems = {}
  for (const row of bodies.rows) {
    const body = bodyFromRow(row)
    const problem = problems[row.problem_id]
    if (!problem) {
      problems[row.problem_id] = {
        owner: body.owner,
        bodies: [body]
      }
    } else {
      problem.bodies.push(body)
    }
  }

  return problems
}

export async function updateLeaderboard(chain: Chain) {
  const start = Date.now()

  const seasonStart = 1717632000

  // calculate daily leaderboards
  const today = currentDayInUnixTime()
  const daysSoFar: number[] = []
  const ONE_DAY_SECONDS = 86400
  for (let i = seasonStart; i <= today; i += ONE_DAY_SECONDS) {
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

  const allTime = await calculateAllTimeLeaderboard(today, chain)
  const problems = await getProblems(chain)

  leaderboards[chain] = {
    daily,
    allTime,
    problems
  }

  console.log(
    chain,
    'leaderboard updated in',
    Date.now() - start,
    'ms with',
    Object.keys(problems).length,
    'problems',
    'daily took',
    doneWithDaily - start
  )
}
