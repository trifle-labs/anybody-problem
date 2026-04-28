#!/usr/bin/env node
// Tiny static file server for the demos. No bundler needed — modern
// browsers handle ESM with relative imports natively.
//
// Usage:
//   node scripts/serve-demos.js [port]
//
// Then open http://localhost:8080/demos/

import http from 'node:http'
import fs from 'node:fs'
import path from 'node:path'
import url from 'node:url'

const PORT = Number(process.argv[2] ?? 8080)
const ROOT = path.resolve(path.dirname(url.fileURLToPath(import.meta.url)), '..')

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json',
  '.wasm': 'application/wasm',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.ico': 'image/x-icon',
}

http
  .createServer((req, res) => {
    let urlPath = decodeURIComponent(req.url.split('?')[0])
    if (urlPath === '/') urlPath = '/demos/'
    if (urlPath.endsWith('/')) urlPath += 'index.html'

    // Try resolving against repo root, and also against /public for the
    // snarkjs / wasm files referenced as e.g. "/snarkjs.min.js".
    const candidates = [
      path.join(ROOT, urlPath),
      path.join(ROOT, 'public', urlPath),
    ]
    let found = null
    for (const p of candidates) {
      if (
        p.startsWith(ROOT) &&
        fs.existsSync(p) &&
        fs.statSync(p).isFile()
      ) {
        found = p
        break
      }
    }
    if (!found) {
      res.writeHead(404, { 'content-type': 'text/plain' })
      res.end('404 ' + urlPath)
      return
    }
    const ext = path.extname(found)
    res.writeHead(200, {
      'content-type': MIME[ext] ?? 'application/octet-stream',
      'cache-control': 'no-store',
    })
    fs.createReadStream(found).pipe(res)
  })
  .listen(PORT, () => {
    console.log(`demos serving: http://localhost:${PORT}/demos/`)
  })
