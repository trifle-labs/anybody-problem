import db from './db'

type LeaderboardLine = {
  problemId: string
  tokenId: string
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

async function calculateDailyLeaderboard(day: number) {
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
      tokenId: r.token_id,
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
  today: number
): Promise<Leaderboard['allTime']> {
  return {
    mostSolved: [],
    currentStreak: [],
    fastest: []
  }
}

export async function updateLeaderboard() {
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
      return calculateDailyLeaderboard(day)
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
  const allTime = await calculateAllTimeLeaderboard(today)
  leaderboard.allTime = allTime

  console.log('leaderboard updated in', Date.now() - start, 'ms')
}
