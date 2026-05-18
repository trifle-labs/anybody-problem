#!/usr/bin/env node
// Minimal CLI: node cli.js <input.circom> [-o out.js] [--checked]
//
// Reads a single circom file and writes its JS transpile.

import fs from 'node:fs'
import path from 'node:path'
import { parse } from './parser.js'
import { emit } from './emitter.js'

function main(argv) {
  const args = argv.slice(2)
  let input = null
  let output = null
  let checked = false
  let runtimePath = null
  for (let i = 0; i < args.length; i++) {
    const a = args[i]
    if (a === '-o' || a === '--output') output = args[++i]
    else if (a === '--checked') checked = true
    else if (a === '--runtime') runtimePath = args[++i]
    else if (a === '-h' || a === '--help') {
      console.log(`Usage: circom2js <input.circom> [-o out.js] [--checked] [--runtime <path>]`)
      return 0
    } else if (a.startsWith('-')) {
      console.error(`unknown flag: ${a}`)
      return 2
    } else {
      input = a
    }
  }
  if (!input) {
    console.error(`usage: circom2js <input.circom> [-o out.js]`)
    return 2
  }
  const src = fs.readFileSync(input, 'utf-8')
  const ast = parse(src, path.basename(input))
  const js = emit(ast, { checked, runtimePath: runtimePath ?? undefined })
  if (output) {
    fs.writeFileSync(output, js)
    console.error(`wrote ${output} (${js.length} bytes)`)
  } else {
    process.stdout.write(js)
  }
  return 0
}

process.exit(main(process.argv))
