import { Chain } from '../shovel-config'
import db from './db'

async function getOwnedBodies(chain: Chain, address?: string) {
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
      WHERE
        "to" = decode($1, 'hex')
        AND src_name = '${chain}'
  ),
  current_owners AS (
      SELECT
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
      WHERE src_name = '${chain}'
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
      WHERE src_name = '${chain}'
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

  return problems.rows
}

export default async function wallet(chain: Chain, address?: string) {
  if (!address) return {}
  const start = Date.now()
  const bodies = await getOwnedBodies(chain, address)
  console.log('wallet', address, 'queried in', Date.now() - start, 'ms')
  return { bodies }
}
