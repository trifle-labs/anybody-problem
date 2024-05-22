import { Client } from 'pg'

const pgClient = new Client(process.env.DATABASE_URL)

export default pgClient
