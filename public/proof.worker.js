// import { groth16 } from './snarkjs'

importScripts('snarkjs.min.js')

// worker.js
self.onmessage = async function (e) {
  console.log('Message received from main script', e.data)
  // console.log('index is', e.data.index)
  try {
    const index = e.data.index
    const sampleInput = e.data.sampleInput
    const finalBodies = e.data.finalBodies
    const wasmPath = `${e.data.circuit}.wasm`
    const zkeyPath = `${e.data.circuit}_final.zkey`
    const { proof: _proof, publicSignals: _publicSignals } = await snarkjs.groth16.fullProve(
      sampleInput,
      wasmPath,
      zkeyPath
    )
    const calldata = await snarkjs.groth16.exportSolidityCallData(_proof, _publicSignals)

    const argv = calldata
      .replace(/["[\]\s]/g, '')
      .split(',')
      .map((x) => BigInt(x).toString())

    const a = [argv[0], argv[1]]
    const b = [
      [argv[2], argv[3]],
      [argv[4], argv[5]]
    ]
    const c = [argv[6], argv[7]]
    const Input = []

    for (let i = 8; i < argv.length; i++) {
      Input.push(argv[i])
    }

    const dataResult = {
      a,
      b,
      c,
      Input,
      sampleInput,
      finalBodies,
      index,
      proof: _proof,
      publicSignals: _publicSignals,
      complete: true
    }
    self.postMessage(dataResult)
  } catch (error) {
    console.log({ error })
  }
}
