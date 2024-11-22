const wc = require('../game_4_250_js/witness_calculator.js')
// const { readFileSync } = require('fs')
// import snarkjs from '../public/snarkjs.min.js'

import wasm_4_250 from 'data-url:/public/game_4_250.wasm'
import wasm_6_250 from 'data-url:/public/game_6_250.wasm'

export async function genwit(input) {
  console.log({ input })
  const len = input.bodies.length
  console.log({ len })
  let useCircuit = len <= 4 ? 4 : 6
  console.log({ useCircuit })
  if (useCircuit !== len) {
    const diff = useCircuit - len
    console.log({ diff })
    for (let i = 0; i < diff; i++) {
      input.bodies.push(['0', '0', '20000', '20000', '0'])
    }
  }
  console.log({ bodies: input.bodies })
  const url = useCircuit == 4 ? wasm_4_250 : wasm_6_250

  const res = await fetch(url)
  const buffer = new Uint8Array(await res.arrayBuffer())

  // let buffer = await response.arrayBuffer()
  const witnessCalculator = await wc(buffer)
  const buff = await witnessCalculator.calculateWitness(input, 0)
  return buff
}
