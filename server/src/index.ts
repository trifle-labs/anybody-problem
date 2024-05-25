import { Hono } from 'hono'
import { serveStatic } from 'hono/bun'
import { SSEStreamingApi, streamSSE } from 'hono/streaming'
import db from './db'
import { wallet } from './wallet'
import { leaderboard, updateLeaderboard } from './leaderboard'
import { Chain, sources } from '../shovel-config'
import { publish, addSubscriber, unsubscribe } from './publish'
import { cors } from 'hono/cors'

// This is a read-only API server that serves the leaderboard and wallet states.
// It uses Server Sent Events (SSE) to push updates to the client.

// Design notes:
// - Shared process state for the leaderboard
// - Leaderboard re-queries the DB on each contract event
// - Leaderboard queries touch more records
// - Publish leaderboard and wallet states to all subscribers on each contract event

// Optimization ideas to explore if we need to scale further:
// - Add indexes to the DB for the most common queries
// - Bigger server
// - Only publish SSE when change effects leaderboard or user's wallet
// - Cache aggregated state and incrementally update with each DB notification
// - Materialized view for leaderboard to scale horizontally

async function setupListener() {
  await db.connect()
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
//   await updateLeaderboard()
//   await publish()
// }, 3000)

let id = 0
async function* streamGenerator(chain: Chain, address?: string) {
  yield {
    data: JSON.stringify({
      leaderboard,
      wallet: await wallet(chain, address),
      address
    }),
    event: 'message',
    id: String(id++)
  }

  const clientStream = new ReadableStream({
    start(controller) {
      addSubscriber(controller)
    },
    cancel() {
      unsubscribe(this)
    }
  })
  for await (const _chunk of clientStream) {
    yield {
      data: JSON.stringify({
        leaderboard,
        wallet: await wallet(chain, address),
        address
      }),
      event: 'message',
      id: String(id++)
    }
  }
}

function streamHandler(chain: Chain, address?: string) {
  return async (stream: SSEStreamingApi) => {
    for await (const message of streamGenerator(chain, address)) {
      await stream.writeSSE(message)
    }
  }
}

const app = new Hono()
app.use(
  '*',
  cors({
    origin: [
      'http://localhost',
      'https://anybody.trifle.life',
      'https://starfish-app-3vq2e.ondigitalocean.app'
    ],
    allowMethods: ['GET', 'POST'],
    allowHeaders: ['Content-Type', 'Authorization']
  })
)

app.post('/sse/:chain/:address', async (c) => {
  const address = c.req.param('address')
  const chain = c.req.param('chain') as Chain
  return streamSSE(c, streamHandler(chain, address))
})

app.post('/sse/:chain', async (c) => {
  const chain = c.req.param('chain') as Chain
  return streamSSE(c, streamHandler(chain))
})

app.get('/wallet/:chain/:address', async (c) => {
  const address = c.req.param('address')
  const chain = c.req.param('chain') as Chain
  return c.json(await wallet(chain, address))
})

app.get('/', serveStatic({ path: './src/demo.html' }))

export default {
  port: process.env.PORT || 8712,
  fetch: app.fetch
}
