import { Chain } from '../shovel-config'
import db from './db'
import { currentDayInUnixTime } from './util'

async function getScores(chain: Chain, address?: string) {
  if (!address) return []

  const today = currentDayInUnixTime()
  const yesterday = today - 24 * 60 * 60

  const problems = await db.query(
    `
  WITH player_data AS (
    SELECT *
    FROM anybody_problem_run_solved
    WHERE src_name = $1 AND player = decode($2, 'hex')
),
daily_activity AS (
    SELECT DISTINCT day
    FROM player_data
    ORDER BY day
),
streak_calc AS (
    SELECT
        day,
        day - LAG(day, 1, day - 86400) OVER (ORDER BY day) AS day_diff
    FROM daily_activity
),
streak_groups AS (
    SELECT
        day,
        SUM(CASE WHEN day_diff > 86400 THEN 1 ELSE 0 END) OVER (ORDER BY day) AS streak_group
    FROM streak_calc
),
streak_lengths AS (
    SELECT
        streak_group,
        COUNT(*) AS streak_length,
        MAX(day) AS streak_end
    FROM streak_groups
    GROUP BY streak_group
),
streak_stats AS (
    SELECT
        MAX(streak_length) AS longest_streak,
        CASE 
            WHEN MAX(streak_end) IN ($3, $4)
            THEN MAX(CASE WHEN streak_end IN ($3, $4) THEN streak_length ELSE 0 END)
            ELSE 0
        END AS current_streak
    FROM streak_lengths
),
fastest_completed AS (
    SELECT accumulative_time AS time, run_id, day
    FROM player_data
    ORDER BY accumulative_time ASC
    LIMIT 1
),
player_stats AS (
    SELECT
      'Current Streak' AS category,
      current_streak AS metric,
      NULL::jsonb AS additional_info
    FROM streak_stats
    UNION ALL
    SELECT
      'Longest Streak' AS category,
      longest_streak AS metric,
      NULL::jsonb AS additional_info
    FROM streak_stats
    UNION ALL
    SELECT
      'Fastest Completed Problem' AS category, 
      time AS metric, 
      jsonb_build_object('runId', run_id, 'day', day) AS additional_info
    FROM fastest_completed
    UNION ALL
    SELECT
      'Days Played' AS category, 
      COUNT(DISTINCT day) AS metric, 
      jsonb_build_object('days', jsonb_agg(DISTINCT day ORDER BY day)) AS additional_info
    FROM player_data
    UNION ALL
    SELECT
      'Runs Solved' AS category, 
      COUNT(*) AS metric, 
      NULL::jsonb AS additional_info
    FROM player_data
)
SELECT
    category,
    COALESCE(metric, 0) as metric,
    additional_info->>'runId' AS runId,
    additional_info->>'day' AS day,
    additional_info->'days' AS days
FROM player_stats;
`,
    [chain, address.replace(/^0x/, ''), today, yesterday]
  )

  const fastestCompleted = problems.rows.find(
    (r) => r.category === 'Fastest Completed Problem'
  )

  return {
    currentStreak:
      parseInt(
        problems.rows.find((r) => r.category === 'Current Streak')?.metric
      ) || 0,
    longestStreak:
      parseInt(
        problems.rows.find((r) => r.category === 'Longest Streak')?.metric
      ) || 0,
    fastestCompleted: {
      runId: fastestCompleted?.runid,
      day: fastestCompleted?.day,
      time: parseInt(fastestCompleted?.metric)
    },
    daysPlayed:
      problems.rows.find((r) => r.category === 'Days Played')?.days || [],
    runsSolved:
      parseInt(
        problems.rows.find((r) => r.category === 'Runs Solved')?.metric
      ) || 0
  }
}

export default async function wallet(chain: Chain, address?: string) {
  if (!address) return {}
  const start = Date.now()
  const scores = await getScores(chain, address)
  console.log('wallet', address, 'queried in', Date.now() - start, 'ms')
  return scores
}
