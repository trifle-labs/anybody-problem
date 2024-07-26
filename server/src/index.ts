import { Hono } from 'hono'
import { serveStatic } from 'hono/bun'
import { SSEStreamingApi, streamSSE } from 'hono/streaming'
import db from './db'
import { leaderboards, rankToday, updateLeaderboard } from './leaderboard'
import { Chain, sources } from '../shovel-config'
import { publish, addSubscriber, unsubscribe } from './publish'
import { cors } from 'hono/cors'
import wallet from './wallet'

// This is a read-only API server that serves the leaderboard state and wallet state.
// It uses Server Sent Events (SSE) to push updates to the client.

// Design notes:
// - Shared process state for the leaderboard
// - Leaderboard re-queries the DB on each contract event
// - Leaderboard queries touch more records
// - Re-publish leaderboard to all subscribers on each contract event

// Optimization ideas to explore if we need to scale further:
// - Add indexes to the DB for the most common queries
// - Bigger server
// - Only publish SSE when change effects leaderboard or user's wallet
// - Cache aggregated state and incrementally update with each DB notification
// - Materialized view for leaderboard to scale horizontally
// - Do not calculate wallets, pass the events to the client and let the client calculate the wallets

async function setupListener() {
  db.on('notification', async (msg) => {
    console.log('[DB notification]', msg)
    await Promise.all(
      sources.map((source) => updateLeaderboard(source.name as Chain))
    )
    await publish()
  })
  for (const source of sources) {
    db.query(`LISTEN "${source.name}-anybody_problem_level_created"`)
    db.query(`LISTEN "${source.name}-anybody_problem_level_solved"`)
    db.query(`LISTEN "${source.name}-anybody_problem_run_created"`)
    db.query(`LISTEN "${source.name}-anybody_problem_run_solved"`)
    db.query(`LISTEN "${source.name}-speedruns_transfer_single"`)
  }

  await Promise.all(
    sources.map((source) => updateLeaderboard(source.name as Chain))
  )
}

setupListener()

// uncomment to test the connection
// setInterval(async () => {
//   await updateLeaderboard('base_sepolia')
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
      wallet: await wallet(chain, address),
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
        wallet: await wallet(chain, address),
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
    origin: '*',
    allowMethods: ['GET', 'POST', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Cache-Control', 'Keep-Alive']
  })
)

app.post('/sse/:chain', async (c) => {
  c.header('X-Accel-Buffering', 'no')
  const chain = c.req.param('chain') as Chain
  return streamSSE(c, streamHandler(c.req.raw.signal, chain))
})

app.post('/sse/:chain/:address', async (c) => {
  c.header('X-Accel-Buffering', 'no')
  const address = c.req.param('address')
  const chain = c.req.param('chain') as Chain
  return streamSSE(c, streamHandler(c.req.raw.signal, chain, address))
})

// return the rank for a certain time
app.get('/rank', async (c) => {
  // never cache
  c.header('Cache-Control', 'no-store')

  const { time } = c.req.query()
  if (!time) {
    return c.json({ error: 'time is required' })
  }
  const rank = await rankToday(parseInt(time))
  return c.json({ time, rank })
})

app.get('/', serveStatic({ path: './src/demo.html' }))

export default {
  port: process.env.PORT || 8712,
  fetch: app.fetch
}
