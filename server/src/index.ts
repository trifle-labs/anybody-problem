import { Hono } from 'hono'
import { serveStatic } from 'hono/bun'
import { streamSSE } from 'hono/streaming'
import db from './db'

const app = new Hono()

async function setupListener() {
  await db.connect()
  console.log('Setting up listener')
  db.on('notification', async (msg) => {
    console.log('Received notification:', msg)
  })
  console.log('Listening for notifications')
  db.query('LISTEN "sepolia-problems_transfer"')
  console.log('HELLO')
}

const problemsStream = new WritableStream()

setupListener()

app.get('/leaderboard', async (c) => {
  return streamSSE(c, async (stream) => {
    // while (true) {
    //   const message = `It is ${new Date().toISOString()}`
    //   await stream.writeSSE({
    //     data: message,
    //     event: 'time-update',
    //     id: String(id++)
    //   })
    //   await stream.sleep(1000)
    // }
    await stream.pipe(anotherReadableStream)
  })
})

app.get('/', serveStatic({ path: './src/demo.html' }))

export default app
