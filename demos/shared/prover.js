// Browser-side proof generation, using snarkjs that the repo already ships
// in public/snarkjs.min.js. Mirrors the existing public/proof.worker.js but
// is parameterized by game name so each demo can produce its own proof.
//
// Requires that the user has compiled the matching circuit:
//   yarn circom flappy   # produces flappy.wasm + flappy_final.zkey in public/
//   yarn circom dino
//   yarn circom platformer

/**
 * Build a snarkjs-compatible input from a recorded run + the game's preset.
 * The shape is what the circuit's main template declares as `signal input`.
 *
 * For now this is a placeholder shape — the actual circuit input layout is
 * defined per-game in circuits/games/<game>.circom and this needs to mirror
 * it field-by-field. See README in this folder for the contract.
 */
export function buildCircuitInput(spec, recorded) {
  return {
    initial: recorded.initial,
    inputs: recorded.inputs,
    // Everything else (e.g. address, score commitments) is filled in by
    // the per-game adapter.
  }
}

/**
 * Generate a Groth16 proof for the recorded run.
 *
 * Returns { proof, publicSignals, calldata } on success, or { error } if
 * the circuit artifacts aren't available yet.
 */
export async function generateProof(gameName, circuitInput, opts = {}) {
  if (typeof window === 'undefined' || typeof snarkjs === 'undefined') {
    return { error: 'snarkjs not loaded — include public/snarkjs.min.js' }
  }
  const wasmPath = opts.wasmPath ?? `/${gameName}.wasm`
  const zkeyPath = opts.zkeyPath ?? `/${gameName}_final.zkey`
  // Probe — fail with a useful message if circuits aren't compiled.
  try {
    const r = await fetch(wasmPath, { method: 'HEAD' })
    if (!r.ok) {
      return {
        error:
          `${wasmPath} not found. Compile the circuit first:\n  yarn circom ${gameName}`,
      }
    }
  } catch (e) {
    return { error: `Could not probe ${wasmPath}: ${e.message}` }
  }
  try {
    const { proof, publicSignals } = await snarkjs.groth16.fullProve(
      circuitInput,
      wasmPath,
      zkeyPath
    )
    let calldata = null
    try {
      calldata = await snarkjs.groth16.exportSolidityCallData(proof, publicSignals)
    } catch (_) {
      /* optional */
    }
    return { proof, publicSignals, calldata }
  } catch (e) {
    return { error: `proof generation failed: ${e.message}` }
  }
}
