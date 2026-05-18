import { platformer as spec } from '../../physics/presets/platformer.js'
import { newState, step } from '../shared/engine.js'
import { makeRenderer, makeInput, makeRecorder } from '../shared/render.js'
import { generateProof, buildCircuitInput } from '../shared/prover.js'

const canvas = document.getElementById('canvas')
canvas.width = spec.world.extent.x
canvas.height = spec.world.extent.y

const r = makeRenderer(canvas, spec)
const input = makeInput({ left: 'ArrowLeft', right: 'ArrowRight', jump: 'Space' })

let state, recorder, paused

function reset() {
  const initial = {
    player: [{ px: 100, py: 400 }],
    enemy: [
      { px: 600, py: 200 },
      { px: 700, py: 100 },
    ],
    platform: [
      { px: 400, py: 580, r: 200 },  // floor
      { px: 200, py: 400, r: 60 },   // ledge L
      { px: 600, py: 350, r: 60 },   // ledge R
      { px: 400, py: 250, r: 80 },   // upper
    ],
  }
  state = newState(spec, initial)
  recorder = makeRecorder(spec, initial, input.bindings)
  paused = false
  setStatus('arrows to move, SPACE to jump')
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
    setStatus(`${state.outcome === 'win' ? 'WIN' : 'GAME OVER'} (tick ${state.tick}, score ${state.score})`)
  }
}

function draw() {
  r.clear('#28304a')
  for (const p of state.objects.platform) r.drawCircle(p, '#888')
  for (const e of state.objects.enemy) r.drawCircle(e, '#e44', { stroke: '#600' })
  for (const p of state.objects.player) r.drawCircle(p, '#4cf', { stroke: '#08a' })
  r.text(`tick ${state.tick} / ${spec.time.stepsPerProof}`, 10, 20, '#fff')
  r.text(`enemies: ${state.objects.enemy.filter(e => e.alive).length}`, 10, 40, '#fff')
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
  const res = await generateProof('platformer', ci)
  if (res.error) setProofStatus(`✗ ${res.error}`)
  else setProofStatus(`✓ proof generated (${res.publicSignals.length} public signals)`)
})
document.getElementById('download').addEventListener('click', () =>
  recorder.download(`platformer-run-${Date.now()}.json`)
)

reset()
loop()
