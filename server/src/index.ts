import { Hono } from 'hono'
import { serveStatic } from 'hono/bun'
import { SSEStreamingApi, streamSSE } from 'hono/streaming'
import db from './db'
import { queryOwnedProblems } from './wallet'
import { leaderboard, updateLeaderboard } from './leaderboard'

const app = new Hono()

async function setupListener() {
  await db.connect()
  db.on('notification', async (msg) => {
    console.log('Received notification:', msg)
    await updateLeaderboard()
    for (const subscriber of subscribers) {
      subscriber.enqueue(`lets-update`)
    }
  })
  db.query('LISTEN "sepolia-problems_transfer"')
  db.query('LISTEN "sepolia-problems_body_added"')
  db.query('LISTEN "sepolia-problems_body_removed"')
  db.query('LISTEN "sepolia-solver_solved"')
  db.query('LISTEN "sepolia-bodies_transfer"')

  await updateLeaderboard()
}
setupListener()

// uncomment to test the connection
// setInterval(async () => {
//   for (const subscriber of subscribers) {
//     console.log('Sending update to subscriber')
//     subscriber.enqueue(`lets-update`)
//   }
//   await updateLeaderboard()
// }, 3000)

let id = 0
// TODO: subscribers should be removed when the connection is closed
const subscribers = new Set<ReadableStreamDefaultController>()

async function* streamGenerator(address) {
  const problems = await queryOwnedProblems(address)
  yield {
    data: JSON.stringify({
      leaderboard,
      problems,
      address
    }),
    event: 'message',
    id: String(id++)
  }

  const clientStream = new ReadableStream({
    start(controller) {
      subscribers.add(controller)
    },
    cancel() {
      subscribers.delete(this)
    }
  })
  for await (const chunk of clientStream) {
    yield {
      data: JSON.stringify({
        leaderboard,
        problems: await queryOwnedProblems(address),
        address
      }),
      event: 'message',
      id: String(id++)
    }
  }
}

function streamHandler(address = null) {
  return async (stream: SSEStreamingApi) => {
    for await (const message of streamGenerator(address)) {
      console.log('Sending message:', message)
      await stream.writeSSE(message)
    }
  }
}

app.get('/sse/:address', async (c) => {
  const address = c.req.param('address')
  return streamSSE(c, streamHandler(address))
})

app.get('/sse', async (c) => {
  return streamSSE(c, streamHandler())
})

app.get('/wallet/:address', async (c) => {
  const address = c.req.param('address')
  const problems = await queryOwnedProblems(address)
  return c.json({ problems })
})

app.get('/', serveStatic({ path: './src/demo.html' }))

export default {
  port: 8712,
  fetch: app.fetch
}
