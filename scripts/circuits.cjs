const { groth16 } = require('snarkjs')


async function exportCallDataGroth16(input, wasmPath, zkeyPath) {
  const { proof: _proof, publicSignals: _publicSignals } =
    await groth16.fullProve(input, wasmPath, zkeyPath)
  const calldata = await groth16.exportSolidityCallData(_proof, _publicSignals)

  const argv = calldata
    .replace(/["[\]\s]/g, '')
    .split(',')
    .map((x) => BigInt(x).toString())

  const a = [argv[0], argv[1]]
  const b = [
    [argv[2], argv[3]],
    [argv[4], argv[5]],
  ]
  const c = [argv[6], argv[7]]
  const Input = []

  for (let i = 8; i < argv.length; i++) {
    Input.push(argv[i])
  }

  return { a, b, c, Input, proof: _proof, publicSignals: _publicSignals }
}

async function verify(verificationPath, publicSignals, proof) {

  const vkey = await fetch(verificationPath).then(function (res) {
    return res.json()
  })


  const res = await groth16.verify(vkey, publicSignals, proof)
  return res
}

module.exports = {
  exportCallDataGroth16,
  verify
}