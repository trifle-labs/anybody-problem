import db from './db'

export const leaderboard = {
  mostProblems: []
}

export async function updateLeaderboard() {
  const start = Date.now()
  const mostProblems = await db.query(
    `
  WITH latest_transactions AS (
      SELECT
          token_id,
          "to",
          ROW_NUMBER() OVER (PARTITION BY token_id ORDER BY block_num DESC, tx_idx DESC, log_idx DESC) AS rn
      FROM
          problems_transfer
  )
  SELECT
      CONCAT('0x', encode("to", 'hex')) AS owner_address,
      COUNT(DISTINCT token_id) AS problem_count
  FROM
      latest_transactions
  WHERE
      rn = 1
  GROUP BY
      "to"
  ORDER BY
      problem_count DESC
  LIMIT 200;`
  )

  leaderboard.mostProblems = mostProblems.rows

  console.log('leaderboard updated in', Date.now() - start, 'ms')
}
