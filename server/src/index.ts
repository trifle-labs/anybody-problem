import { Hono } from 'hono'
import { serveStatic } from 'hono/bun'
import { SSEStreamingApi, streamSSE } from 'hono/streaming'
import db from './db'
import { wallet } from './wallet'
import { leaderboard, updateLeaderboard } from './leaderboard'
import { source } from '../shovel-config'

// Optimization ideas to explore if we need to scale:
// - Only push SSE when change effects leaderboard or user's wallet
// - Cache aggregated state and incrementally update with each DB notification

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
  db.query(`LISTEN "${source.name}-problems_transfer"`)
  db.query(`LISTEN "${source.name}-problems_body_added"`)
  db.query(`LISTEN "${source.name}-problems_body_removed"`)
  db.query(`LISTEN "${source.name}-solver_solved"`)
  db.query(`LISTEN "${source.name}-bodies_transfer"`)

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
  yield {
    data: JSON.stringify({
      leaderboard,
      wallet: await wallet(address),
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
  for await (const _chunk of clientStream) {
    yield {
      data: JSON.stringify({
        leaderboard,
        wallet: await wallet(address),
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
  return c.json(await wallet(address))
})

app.get('/', serveStatic({ path: './src/demo.html' }))

export default {
  port: 8712,
  fetch: app.fetch
}
