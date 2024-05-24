import { Pool } from 'pg'

const pgClient = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: process.env.NODE_ENV === 'production',
    ca: process.env.CA_CERT
  }
})

export default pgClient
