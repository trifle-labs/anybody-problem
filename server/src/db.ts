import { Pool } from 'pg'

const pgClient = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: parseInt(process.env.PGPORT),
  ssl: process.env.NODE_ENV === 'production' && {
    rejectUnauthorized: true,
    ca: process.env.CA_CERT
  }
})

export default pgClient
