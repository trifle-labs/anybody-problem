// import { groth16 } from './snarkjs'

importScripts('snarkjs.min.js')


// worker.js
self.onmessage = async function (e) {
  console.log('Message received from main script', e.data)
  // console.log('index is', e.data.index)
  try {
    const input = e.data.sampleInput
    const wasmPath = `${e.data.circuit}.wasm`
    const zkeyPath = `${e.data.circuit}_final.zkey`
    const { proof: _proof, publicSignals: _publicSignals } = await snarkjs.groth16.fullProve(input, wasmPath, zkeyPath)
    const dataResult = {
      input,
      proof: _proof,
      publicSignals: _publicSignals,
      finalBodies: e.data.finalBodies,
      index: e.data.index,
      complete: true
    }
    self.postMessage(dataResult)
  } catch (error) {
    console.log({ error })
  }
}
