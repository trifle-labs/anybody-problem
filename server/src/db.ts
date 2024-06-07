import { Client } from 'pg'

const pgClient = new Client({
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

pgClient.connect()

export default pgClient
