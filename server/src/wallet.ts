import { Chain } from '../shovel-config'
import db from './db'
import { currentDayInUnixTime } from './util'

async function getScores(chain: Chain, address?: string) {
  if (!address) return []

  const today = currentDayInUnixTime()
  const yesterday = today - 24 * 60 * 60

  const problems = await db.query(
    `
WITH player_current_streaks AS (
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
        src_name = $1 AND player = decode($2, 'hex')
    ) AS subquery
    GROUP BY
      player, streak
    HAVING MAX(day) = $3 OR MAX(day) = $4 -- ensure the streak is current
  ) AS streaks
  GROUP BY
    player
),
player_streaks AS (
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
        src_name = $1 AND player = decode($2, 'hex')
    ) AS subquery
    GROUP BY
      player, streak
  ) AS streaks
  GROUP BY
    player
),
player_fastest_completed AS (
  SELECT
    run_id,
    player,
    accumulative_time as time,
    day
  FROM
    anybody_problem_run_solved
  WHERE
    src_name = $1 AND player = decode($2, 'hex')
  ORDER BY
    time ASC
  LIMIT 1
),
player_days_played AS (
  SELECT
    player,
    COUNT(DISTINCT day) AS days_played
  FROM
    anybody_problem_level_solved
  WHERE
    src_name = $1 AND player = decode($2, 'hex')
  GROUP BY
    player
),
player_levels_solved AS (
  SELECT
    player,
    COUNT(DISTINCT (run_id, level)) AS solve_count
  FROM
    anybody_problem_level_solved
  WHERE
    src_name = $1 AND player = decode($2, 'hex')
  GROUP BY
    player
),
player_stats AS (
  SELECT
    'Current Streak' AS category,
    player,
    current_streak AS metric,
    NULL::jsonb AS additional_info
  FROM
    player_current_streaks
  UNION ALL
  SELECT
    'Longest Streak' AS category,
    player,
    current_streak AS metric,
    NULL::jsonb AS additional_info
  FROM
    player_streaks
  UNION ALL
  SELECT
    'Fastest Completed Problem' AS category,
    player,
    time AS metric,
    jsonb_build_object('runId', run_id, 'day', day) AS additional_info
  FROM
    player_fastest_completed
  UNION ALL
  SELECT
    'Days Played' AS category,
    player,
    days_played AS metric,
    NULL::jsonb AS additional_info
  FROM
    player_days_played
  UNION ALL
  SELECT
    'Levels Solved' AS category,
    player,
    solve_count AS metric,
    NULL::jsonb AS additional_info
  FROM
    player_levels_solved
)
SELECT
  category,
  CONCAT('0x', encode(player, 'hex')) as player,
  metric,
  additional_info->>'runId' AS runId,
  additional_info->>'day' AS day
FROM
  player_stats;`,
    [chain, address.replace(/^0x/, ''), today, yesterday]
  )

  return {
    currentStreak: parseInt(
      problems.rows.find((r) => r.category === 'Current Streak')?.metric
    ),
    longestStreak: parseInt(
      problems.rows.find((r) => r.category === 'Longest Streak')?.metric
    ),
    fastestCompleted: parseInt(
      problems.rows.find((r) => r.category === 'Fastest Completed Problem')
        ?.metric
    ),
    daysPlayed: parseInt(
      problems.rows.find((r) => r.category === 'Days Played')?.metric
    ),
    levelsSolved: parseInt(
      problems.rows.find((r) => r.category === 'Levels Solved')?.metric
    )
  }
}

export default async function wallet(chain: Chain, address?: string) {
  if (!address) return {}
  const start = Date.now()
  const scores = await getScores(chain, address)
  console.log('wallet', address, 'queried in', Date.now() - start, 'ms')
  return scores
}
