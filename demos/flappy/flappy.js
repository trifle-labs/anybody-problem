import { flappyBird as spec } from '../../physics/presets/flappyBird.js'
import { newState, step } from '../shared/engine.js'
import { makeRenderer, makeInput, makeRecorder } from '../shared/render.js'
import { generateProof, buildCircuitInput } from '../shared/prover.js'

const canvas = document.getElementById('canvas')
canvas.width = spec.world.extent.x * 1.5
canvas.height = spec.world.extent.y * 1.5

const r = makeRenderer(canvas, spec)
const input = makeInput({ flap: 'Space' })

let state, recorder, paused, proofResult

function reset() {
  // Initial layout: 3 pipes spaced across the world width, alternating gap heights
  const initial = {
    player: [{ px: 80, py: 200 }],
    pipe: [
      { px: 200, py: 100, r: 30 },
      { px: 200, py: 500, r: 30 },
      { px: 320, py: 200, r: 30 },
      { px: 320, py: 540, r: 30 },
      { px: 440, py: 50, r: 30 },
      { px: 440, py: 420, r: 30 },
      { px: 560, py: 200, r: 30 },
      { px: 560, py: 540, r: 30 },
    ],
  }
  state = newState(spec, initial)
  recorder = makeRecorder(spec, initial, input.bindings)
  paused = false
  proofResult = null
  setStatus('Press SPACE to flap')
}

function setStatus(msg) {
  document.getElementById('status').textContent = msg
}
function setProofStatus(msg) {
  document.getElementById('proof-status').textContent = msg
}

function loop() {
  requestAnimationFrame(loop)
  draw()
  if (paused || state.outcome) return
  const inputs = input.snapshot()
  recorder.record(inputs)
  step(state, inputs)
  if (state.outcome) {
    setStatus(`game over after ${state.tick} ticks (score: ${state.score})`)
  }
}

function draw() {
  r.clear('#7ec0ee')
  // ground line
  r.drawLine(0, spec.world.extent.y - 5, spec.world.extent.x, spec.world.extent.y - 5, '#3a5')
  // pipes
  for (const pipe of state.objects.pipe) r.drawCircle(pipe, '#3a5', { stroke: '#053' })
  // player
  for (const p of state.objects.player) r.drawCircle(p, '#fc0', { stroke: '#a70' })
  r.text(`tick ${state.tick} / ${spec.time.stepsPerProof}`, 10, 20, '#000')
  r.text(`score ${state.score}`, 10, 40, '#000')
}

document.getElementById('reset').addEventListener('click', reset)
document.getElementById('prove').addEventListener('click', async () => {
  if (!state.outcome && state.tick < 30) {
    setProofStatus('play a few ticks before proving')
    return
  }
  paused = true
  setProofStatus('generating proof… (first time may take a minute)')
  const ci = buildCircuitInput(spec, {
    initial: recorder.initialPlacement,
    inputs: ticksAsBitArray(recorder),
  })
  proofResult = await generateProof('flappy', ci)
  if (proofResult.error) setProofStatus(`✗ ${proofResult.error}`)
  else setProofStatus(`✓ proof generated (${proofResult.publicSignals.length} public signals)`)
})
document.getElementById('download').addEventListener('click', () => {
  recorder.download(`flappy-run-${Date.now()}.json`)
})

function ticksAsBitArray(rec) {
  // The circuit expects per-tick input bits: array length stepsPerProof,
  // each element 0 or 1 (flappy has one input). Pad with 0 if early-end.
  const out = new Array(spec.time.stepsPerProof).fill(0)
  for (let i = 0; i < rec.ticks.length && i < out.length; i++) {
    out[i] = rec.ticks[i] & 1
  }
  return out
}

reset()
loop()
