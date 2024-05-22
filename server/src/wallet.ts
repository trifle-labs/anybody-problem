import db from './db'

export async function queryOwnedProblems(address?: string) {
  if (!address) return []

  const problems = await db.query(
    `
    WITH latest_transactions AS (
      SELECT
          token_id,
          "to",
          ROW_NUMBER() OVER (PARTITION BY token_id ORDER BY block_num DESC, tx_idx DESC, log_idx DESC) AS rn
      FROM
      problems_transfer
  ),
  current_owners AS (
      SELECT
          token_id
      FROM
          latest_transactions
      WHERE
          rn = 1
          AND "to" = decode($1, 'hex')
  ),
  latest_body_status AS (
      SELECT
          ba.problem_id,
          ba.body_id,
          ba.block_num,
          ba.tx_idx,
          ba.log_idx,
          'added' AS status
      FROM
      problems_body_added ba
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
  ),
  body_final_status AS (
      SELECT
          problem_id,
          body_id,
          status,
          ROW_NUMBER() OVER (PARTITION BY problem_id, body_id ORDER BY block_num DESC, tx_idx DESC, log_idx DESC) AS rn
      FROM
          latest_body_status
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
      CONCAT('0x', encode(ba.log_addr, 'hex')) AS log_addr
  FROM
    problems_body_added ba
  JOIN
      current_owners co ON ba.problem_id = co.token_id
  JOIN
      body_final_status bfs ON ba.problem_id = bfs.problem_id AND ba.body_id = bfs.body_id
  WHERE
      bfs.rn = 1
      AND bfs.status = 'added';`,
    [address.replace(/^0x/, '')]
  )

  console.log(
    'wallet.ts queryOwnedProblems problems.rows: ',
    address,
    problems.rows
  )

  return problems.rows
}
