import { Hono } from 'hono'
import { serveStatic } from 'hono/bun'
import { cors } from 'hono/cors'
const wc = require('../../game_4_250_js/witness_calculator.js')
const { readFileSync, writeFileSync, unlinkSync, existsSync } = require('fs')
const { exec } = require('child_process')
const util = require('util')
const execPromise = util.promisify(exec)

const bigFiles = ['game_4_250', 'game_6_125']
bigFiles.forEach((baseName) => {
  const path = `../../${baseName}_final.zkey`
  const fileExists = existsSync(path)
  if (!fileExists) {
    console.error(`File ${path} does not exist`)
    process.exit(1)
  }
})

const app = new Hono()
app.use(
  '*',
  cors({
    origin: '*',
    allowMethods: ['GET', 'POST', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Cache-Control', 'Keep-Alive']
  })
)

app.post('/prove', async (c) => {
  // never cache
  c.header('Cache-Control', 'no-store')
  let uid
  try {
    const { input } = await c.req.json()

    if (!input) {
      return c.json({ error: 'input is required' })
    }
    const len = input.bodies.length
    if (len !== 4 && len !== 6) {
      return c.json({ error: 'input must have 4 or 6 bodies' })
    }
    const baseName = `game_${len == 4 ? '4_250' : '6_125'}`
    const wasmPath = `../${baseName}_js/${baseName}.wasm`

    const buffer = readFileSync(wasmPath)
    uid = Math.random().toString(36).substring(7)
    const witnessCalculator = await wc(buffer)
    const buff = await witnessCalculator.calculateWTNSBin(input, 0)
    writeFileSync(`tmp/${uid}.wtns`, buff)

    const command = `../../rapidsnark/package/bin/prover ../../${baseName}_final.zkey tmp/${uid}.wtns tmp/${uid}_proof.json tmp/${uid}_public.json`
    const { stderr } = await execPromise(command)

    if (stderr) {
      console.error(`rapidsnark stderr: ${stderr}`)
      return
    }
    // console.log(`rapidsnark stdout: ${stdout}`)
    const proof = readFileSync(`tmp/${uid}_proof.json`)
    const publicInput = readFileSync(`tmp/${uid}_public.json`)
    // Delete the files
    unlinkSync(`tmp/${uid}.wtns`)
    unlinkSync(`tmp/${uid}_proof.json`)
    unlinkSync(`tmp/${uid}_public.json`)
    return c.json({
      proof: JSON.parse(proof),
      publicInput: JSON.parse(publicInput)
    })
  } catch (e) {
    console.error(e)
    if (uid) {
      try {
        unlinkSync(`tmp/${uid}.wtns`)
        unlinkSync(`tmp/${uid}_proof.json`)
        unlinkSync(`tmp/${uid}_public.json`)
      } catch (e) {
        console.error(e)
      }
    }
    return c.json({ error: e.message })
  }
})

app.get('/', serveStatic({ path: './src/index.html' }))

export default {
  port: process.env.PROOF_PORT || 4242,
  fetch: app.fetch
}
