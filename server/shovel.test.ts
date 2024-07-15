import { expect, test, describe } from 'bun:test'
import db from './src/db'

describe('shovel sanity test', () => {
  test('db exists', () => {
    expect(db).toBeDefined()
  })

  test('events got pulled into tables', async () => {
    const { rows, rowCount } = await db.query(
      `
      WITH tbl AS
        (SELECT table_schema,
                TABLE_NAME
        FROM information_schema.tables
        WHERE TABLE_NAME not like 'pg_%'
          AND table_schema in ('public'))
      SELECT table_schema,
            TABLE_NAME,
            (xpath('/row/c/text()', query_to_xml(format('select count(*) as c from %I.%I', table_schema, TABLE_NAME), FALSE, TRUE, '')))[1]::text::int AS rows_n
      FROM tbl
      ORDER BY rows_n DESC;`
    )

    // should look something like this:
    // table_schema |      table_name       | rows_n
    // --------------+-----------------------+--------
    //  public       | bodies_transfer       |      9
    //  public       | bodies_body_born      |      3
    //  public       | problems_body_added   |      3
    //  public       | solver_solved         |      2
    //  public       | problems_transfer     |      1
    //  public       | problems_body_removed |      0

    expect(rows).toBeDefined()
    expect(rowCount).toBeGreaterThanOrEqual(4)

    // TODO: uncomment when there's data
    // const tablesWithRows = rows.filter((row) => row.rows_n > 0)
    // expect(tablesWithRows.length).toBeGreaterThanOrEqual(5)
  })
})
