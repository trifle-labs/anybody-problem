// Hand-written JS equivalents of the circomlib primitives used by the
// anybody-problem circuits. Transpiled user code imports these instead of
// traversing them at the bit level — that would be pointless for a witness
// calculator, since these are well-known functions of their inputs.
//
// All templates follow the same shape: a template-param factory returns a
// compute function `(inputs) => outputs`.
//
// Bit widths are ignored at the JS level (everything is BigInt). They're
// only relevant inside the circuit for constraint counting.

import { LazyComponent } from './component.js'

// ------- comparators.circom -------

export function IsZero() {
  return function compute(inputs) {
    return { out: inputs.in === 0n ? 1n : 0n }
  }
}

export function IsEqual() {
  return function compute(inputs) {
    return { out: inputs.in[0] === inputs.in[1] ? 1n : 0n }
  }
}

export function LessThan(_n) {
  return function compute(inputs) {
    return { out: inputs.in[0] < inputs.in[1] ? 1n : 0n }
  }
}

export function LessEqThan(_n) {
  return function compute(inputs) {
    return { out: inputs.in[0] <= inputs.in[1] ? 1n : 0n }
  }
}

export function GreaterThan(_n) {
  return function compute(inputs) {
    return { out: inputs.in[0] > inputs.in[1] ? 1n : 0n }
  }
}

export function GreaterEqThan(_n) {
  return function compute(inputs) {
    return { out: inputs.in[0] >= inputs.in[1] ? 1n : 0n }
  }
}

// ------- gates.circom -------

export function AND() {
  return function compute(inputs) {
    return { out: inputs.a * inputs.b }
  }
}

export function OR() {
  return function compute(inputs) {
    return { out: inputs.a + inputs.b - inputs.a * inputs.b }
  }
}

export function XOR() {
  return function compute(inputs) {
    return { out: inputs.a + inputs.b - 2n * inputs.a * inputs.b }
  }
}

export function NOT() {
  return function compute(inputs) {
    return { out: 1n - inputs.in }
  }
}

export function NAND() {
  return function compute(inputs) {
    return { out: 1n - inputs.a * inputs.b }
  }
}

export function NOR() {
  return function compute(inputs) {
    return { out: 1n - (inputs.a + inputs.b - inputs.a * inputs.b) }
  }
}

export function MultiAND(_n) {
  return function compute(inputs) {
    let out = 1n
    for (const v of inputs.in) out = out * v
    return { out }
  }
}

// ------- mux1.circom -------

export function Mux1() {
  return function compute(inputs) {
    // s selects between c[0] and c[1]
    return { out: inputs.s === 1n ? inputs.c[1] : inputs.c[0] }
  }
}

export function MultiMux1(n) {
  return function compute(inputs) {
    const out = new Array(Number(n))
    for (let i = 0; i < Number(n); i++) {
      out[i] = inputs.s === 1n ? inputs.c[i][1] : inputs.c[i][0]
    }
    return { out }
  }
}

// ------- bitify.circom -------

export function Num2Bits(n) {
  const N = Number(n)
  return function compute(inputs) {
    const out = new Array(N)
    let v = inputs.in
    for (let i = 0; i < N; i++) {
      out[i] = v & 1n
      v >>= 1n
    }
    return { out }
  }
}

export function Num2Bits_strict() {
  return Num2Bits(254n)
}

export function Bits2Num(n) {
  const N = Number(n)
  return function compute(inputs) {
    let out = 0n
    for (let i = 0; i < N; i++) {
      out |= BigInt(inputs.in[i]) << BigInt(i)
    }
    return { out }
  }
}

export function Bits2Num_strict() {
  return Bits2Num(254n)
}

// ------- aliascheck / compconstant -------
// These are constraint-only templates (no meaningful witness output beyond
// "constraints held"). We stub them to no-ops that return an empty outputs
// object. The transpiler should treat `=== 1` checks as assertions if
// emitted in checked mode.

export function AliasCheck() {
  return function compute(_inputs) {
    return {}
  }
}

export function CompConstant(_k) {
  return function compute(inputs) {
    // Emulate the boundary check: out = 1 if in is ≥ 2^253 (the field's
    // "most-positive" boundary), else 0. For our use, inputs are BigInt so
    // we can compute directly. Most callers ignore this output.
    const threshold = 1n << 253n
    let v = 0n
    if (inputs.in && Array.isArray(inputs.in)) {
      for (let i = 0; i < inputs.in.length; i++) {
        if (inputs.in[i] !== 0n) v |= 1n << BigInt(i)
      }
    } else {
      v = inputs.in ?? 0n
    }
    return { out: v >= threshold ? 1n : 0n }
  }
}

// Re-export component helper for emitted code.
export { LazyComponent }
