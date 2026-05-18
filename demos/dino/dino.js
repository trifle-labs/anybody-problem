import { chromeDino as spec } from '../../physics/presets/chromeDino.js'
import { newState, step } from '../shared/engine.js'
import { makeRenderer, makeInput, makeRecorder } from '../shared/render.js'
import { generateProof, buildCircuitInput } from '../shared/prover.js'

const canvas = document.getElementById('canvas')
canvas.width = spec.world.extent.x
canvas.height = spec.world.extent.y * 2

const r = makeRenderer(canvas, spec)
const input = makeInput({ jump: 'Space', duck: 'ArrowDown' })

let state, recorder, paused

function reset() {
  const initial = {
    dino: [{ px: 60, py: 110 }],
    cactus: [
      { px: 280, py: 115 },
      { px: 380, py: 115 },
      { px: 500, py: 115 },
    ],
    ground: [{ px: spec.world.extent.x / 2, py: 130, r: 0 }],
  }
  state = newState(spec, initial)
  recorder = makeRecorder(spec, initial, input.bindings)
  paused = false
  setStatus('Press SPACE to jump')
}

function setStatus(m) { document.getElementById('status').textContent = m }
function setProofStatus(m) { document.getElementById('proof-status').textContent = m }

function loop() {
  requestAnimationFrame(loop)
  draw()
  if (paused || state.outcome) return
  const ins = input.snapshot()
  recorder.record(ins)
  step(state, ins)
  if (state.outcome) {
    setStatus(`game over after ${state.tick} ticks (score: ${state.score})`)
  }
}

function draw() {
  r.clear('#f7f7f7')
  // ground line
  r.drawLine(0, 130, spec.world.extent.x, 130, '#333')
  for (const c of state.objects.cactus) r.drawCircle(c, '#0a0', { stroke: '#070' })
  for (const d of state.objects.dino) r.drawCircle(d, '#222', { stroke: '#000' })
  r.text(`tick ${state.tick} / ${spec.time.stepsPerProof}`, 10, 20, '#000')
  r.text(`score ${state.score}`, 10, 40, '#000')
  if (state.outcome) r.text(`GAME OVER`, canvas.width / 2 - 40, 60, '#a00', 18)
}

document.getElementById('reset').addEventListener('click', reset)
document.getElementById('prove').addEventListener('click', async () => {
  if (!state.outcome && state.tick < 30) {
    setProofStatus('play a few ticks before proving')
    return
  }
  paused = true
  setProofStatus('generating proof…')
  const ci = buildCircuitInput(spec, {
    initial: recorder.initialPlacement,
    inputs: recorder.ticks.slice(),
  })
  const res = await generateProof('dino', ci)
  if (res.error) setProofStatus(`✗ ${res.error}`)
  else setProofStatus(`✓ proof generated (${res.publicSignals.length} public signals)`)
})
document.getElementById('download').addEventListener('click', () =>
  recorder.download(`dino-run-${Date.now()}.json`)
)

reset()
loop()
