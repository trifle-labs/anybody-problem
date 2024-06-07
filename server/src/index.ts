import { Hono } from 'hono'
import { serveStatic } from 'hono/bun'
import { SSEStreamingApi, streamSSE } from 'hono/streaming'
import db from './db'
import { leaderboards, updateLeaderboard } from './leaderboard'
import { Chain, sources } from '../shovel-config'
import { publish, addSubscriber, unsubscribe } from './publish'
import { cors } from 'hono/cors'

// This is a read-only API server that serves the leaderboard state, including all problems and owners.
// It uses Server Sent Events (SSE) to push updates to the client.

// Design notes:
// - Shared process state for the leaderboard
// - Leaderboard re-queries the DB on each contract event
// - Leaderboard queries touch more records
// - Re-publish leaderboard to all subscribers on each contract event

// Optimization ideas to explore if we need to scale further:
// - Add indexes to the DB for the most common queries
// - Bigger server
// - Cache aggregated state and incrementally update with each DB notification
// - Materialized view for leaderboard to scale horizontally

async function setupListener() {
  db.on('notification', async (msg) => {
    console.log('[DB notification]', msg)
    await Promise.all(
      sources.map((source) => updateLeaderboard(source.name as Chain))
    )
    await publish()
  })
  for (const source of sources) {
    db.query(`LISTEN "${source.name}-problems_transfer"`)
    db.query(`LISTEN "${source.name}-problems_body_added"`)
    db.query(`LISTEN "${source.name}-problems_body_removed"`)
    db.query(`LISTEN "${source.name}-solver_solved"`)
    db.query(`LISTEN "${source.name}-bodies_transfer"`)
  }

  await Promise.all(
    sources.map((source) => updateLeaderboard(source.name as Chain))
  )
}

setupListener()

// uncomment to test the connection
// setInterval(async () => {
//   await updateLeaderboard('sepolia')
//   await publish()
// }, 3000)

let id = 0
async function* streamGenerator(
  abortSignal: AbortSignal,
  chain: Chain,
  address?: string
) {
  yield {
    data: JSON.stringify({
      leaderboard: leaderboards[chain],
      address
    }),
    event: 'message',
    id: String(id++)
  }
  const clientStream = new ReadableStream({
    start(controller) {
      addSubscriber(controller)
      this.controller = controller
      abortSignal.addEventListener('abort', () => {
        this.cancel()
      })
    },
    cancel() {
      unsubscribe(this.controller)
    }
  })

  for await (const _chunk of clientStream) {
    yield {
      data: JSON.stringify({
        leaderboard: leaderboards[chain],
        address
      }),
      event: 'message',
      id: String(id++)
    }
  }
}

function streamHandler(
  abortSignal: AbortSignal,
  chain: Chain,
  address?: string
) {
  return async (stream: SSEStreamingApi) => {
    for await (const message of streamGenerator(abortSignal, chain, address)) {
      if (abortSignal.aborted) {
        stream.close()
      }
      await stream.writeSSE(message)
    }
  }
}

const app = new Hono()
app.use(
  '*',
  cors({
    origin: [
      'http://localhost:5173',
      'https://anybody.trifle.life',
      'https://starfish-app-3vq2e.ondigitalocean.app',
      '*' // TODO: remove before going live
    ],
    allowMethods: ['GET', 'POST', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Cache-Control', 'Keep-Alive']
  })
)

app.post('/sse/:chain', async (c) => {
  const chain = c.req.param('chain') as Chain
  return streamSSE(c, streamHandler(c.req.raw.signal, chain))
})

app.get('/', serveStatic({ path: './src/demo.html' }))

export default {
  port: process.env.PORT || 8712,
  fetch: app.fetch
}
