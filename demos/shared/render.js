// Tiny canvas renderer + keyboard input + run recorder. ESM.
//
// Renderer: takes a state and a per-kind draw function, draws everything to
// a 2D canvas. Coordinates are in *display pixels* — convert from BigInt
// scaled by dividing by SF then by extent/canvasSize ratio.
//
// Input: subscribes to keydown/keyup, exposes `pressed[name]` and the
// just-pressed/released edges. Re-binds on construction.
//
// Recorder: stores the initial state and a per-tick input bitmask. The
// JSON it exports is the witness input that the circuit will be invoked
// with for proof generation.

// ---------- Canvas renderer ----------

export function makeRenderer(canvas, spec) {
  const ctx = canvas.getContext('2d')
  const SF = Number(spec.precision.scalingFactor)
  const Wx = spec.world.extent.x
  const Wy = spec.world.extent.y ?? Wx
  // Map world units → canvas pixels
  const sx = canvas.width / Wx
  const sy = canvas.height / Wy

  function clear(bg = '#111') {
    ctx.fillStyle = bg
    ctx.fillRect(0, 0, canvas.width, canvas.height)
  }

  function px(v) {
    return Number(v) / SF
  }

  function drawCircle(inst, color, opts = {}) {
    if (!inst.alive) return
    ctx.beginPath()
    ctx.arc(px(inst.px) * sx, px(inst.py) * sy, px(inst.r) * sx, 0, Math.PI * 2)
    ctx.fillStyle = color
    ctx.fill()
    if (opts.stroke) {
      ctx.strokeStyle = opts.stroke
      ctx.lineWidth = 2
      ctx.stroke()
    }
  }

  function drawRect(inst, color, w, h) {
    if (!inst.alive) return
    const x = px(inst.px) * sx
    const y = px(inst.py) * sy
    ctx.fillStyle = color
    ctx.fillRect(x - (w * sx) / 2, y - (h * sy) / 2, w * sx, h * sy)
  }

  function drawLine(x1, y1, x2, y2, color = '#fff') {
    ctx.strokeStyle = color
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(x1 * sx, y1 * sy)
    ctx.lineTo(x2 * sx, y2 * sy)
    ctx.stroke()
  }

  function text(s, x, y, color = '#fff', size = 14) {
    ctx.fillStyle = color
    ctx.font = `${size}px ui-monospace, monospace`
    ctx.fillText(s, x, y)
  }

  return { ctx, canvas, SF, sx, sy, clear, drawCircle, drawRect, drawLine, text, px }
}

// ---------- Input (keyboard) ----------

export function makeInput(bindings) {
  // bindings: { jump: 'Space', left: 'ArrowLeft', ... }
  const pressed = {}
  const justPressed = {}
  const justReleased = {}
  for (const k of Object.keys(bindings)) {
    pressed[k] = false
    justPressed[k] = false
    justReleased[k] = false
  }

  function onKey(e, down) {
    for (const [name, key] of Object.entries(bindings)) {
      if (e.code === key || e.key === key) {
        if (down && !pressed[name]) justPressed[name] = true
        if (!down && pressed[name]) justReleased[name] = true
        pressed[name] = down
        e.preventDefault()
        break
      }
    }
  }

  window.addEventListener('keydown', (e) => onKey(e, true))
  window.addEventListener('keyup', (e) => onKey(e, false))

  // Snapshot of inputs for one tick. Call once per tick; clears edges.
  function snapshot() {
    const snap = { ...pressed }
    for (const k of Object.keys(bindings)) {
      justPressed[k] = false
      justReleased[k] = false
    }
    return snap
  }

  return { pressed, justPressed, justReleased, snapshot, bindings }
}

// ---------- Run recorder ----------
//
// Stores initial state + per-tick input bitmask. On `serialize()`, returns
// a JSON string that's the input to the circuit's witness calculator.

export function makeRecorder(spec, initialPlacement, inputBindings) {
  const inputNames = []
  for (const kind of Object.values(spec.objects)) {
    if (kind.inputs) for (const inp of kind.inputs) inputNames.push(inp.name)
  }
  const ticks = []
  const rec = {
    inputNames,
    initialPlacement,
    ticks,
    record(inputSnapshot) {
      // Pack into a bitmask in the order inputNames declared.
      let mask = 0
      for (let i = 0; i < inputNames.length; i++) {
        if (inputSnapshot[inputNames[i]]) mask |= 1 << i
      }
      ticks.push(mask)
    },
    serialize() {
      return JSON.stringify(
        {
          spec: spec.name,
          initial: initialPlacement,
          inputs: ticks,
          inputNames,
          inputBindings,
        },
        null,
        2
      )
    },
    download(filename) {
      const blob = new Blob([rec.serialize()], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = filename
      a.click()
      URL.revokeObjectURL(url)
    },
    tickCount: () => ticks.length,
  }
  return rec
}
