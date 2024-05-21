import { Client } from 'pg'

console.log('DATABASE_URL:', process.env.DATABASE_URL)
const pgClient = new Client(process.env.DATABASE_URL)
console.log('Connected to database')
export default pgClient
