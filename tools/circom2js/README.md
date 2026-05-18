# circom2js

A small Circom 2.x → JavaScript (BigInt) transpiler. Targets the witness-
generation case: you have a circuit, you need the same computation in JS at
FPS rates, and the WASM witness calculator is too slow to load and run in
a browser game loop.

**Status: working proof-of-concept.** Transpiles the full anybody-problem
`approxMath.circom` and `helpers.circom`. Differential tests pass against the
hand-written `src/calculations.js` oracle on 1,000+ randomized inputs.
See `test/diff.test.mjs`.

## Quick start

```bash
# Transpile a file
node tools/circom2js/src/cli.js circuits/approxMath.circom \
  -o tools/circom2js/examples/approxMath.js \
  --runtime '../runtime/circomlib.js'

# Run differential tests
node --test tools/circom2js/test/diff.test.mjs
```

## What gets generated

Given this circom:

```circom
template AbsoluteValueSubtraction(n) {
  signal input in[2];
  signal output out;

  component lessThan = LessThan(n);
  lessThan.in[0] <== in[0];
  lessThan.in[1] <== in[1];
  ...
  out <== greaterValue - lesserValue;
}
```

You get this JS:

```js
export function AbsoluteValueSubtraction(n) {
  return function compute(inputs) {
    const _in = inputs.in          // `in` is a JS reserved word → rename
    let out
    let lessThan = LazyComponent(() => LessThan(n), ['in'], ['out'])
    lessThan.in[0n] = _in[0n]
    lessThan.in[1n] = _in[1n]
    ...
    out = (greaterValue - lesserValue)
    return { out }
  }
}
```

All values are BigInt. Every template is a factory: call it with its template
parameters, get back a `compute(inputs)` function.

## What it covers

- `pragma`, `include` (recorded, not followed — transpile each file separately)
- `template`, `function` declarations, with numeric template parameters
- `signal input`, `signal output`, intermediate signals, 1D/2D arrays
- `var` declarations, `for` / `while` / `if` / `else` / `return`
- All arithmetic (+ - * / \ % **), comparison, logical, bitwise, shift
- Circom assignment operators: `<==`, `<--`, `===`, `==>`, `-->`, `=`, `+=`
- `component foo = Template(args)`, nested input/output access
- `component foo[n];` declaration (with manual filling in a loop)

## What it doesn't cover (yet)

- `bus` declarations
- `parallel` components
- Anonymous components / custom templates passed as values
- Tag attributes on signals (`signal input {value} x`)
- Multi-file transpilation with automatic include resolution
- `assert()` (parses as identifier; add to builtins if needed)
- `log()` (parses as identifier; will error if called — add a no-op if needed)

## How components are modeled

Circom's dataflow model — any-order input assignment followed by output
reads — is emulated with a lazy wrapper in `runtime/component.js`. When a
component's output property is first read, the compute function runs with
all inputs that were written up to that point. This matches the typical
circom style: declare, wire inputs, then read outputs.

```js
const comp = LazyComponent(() => LessThan(20n), ['in'], ['out'])
comp.in[0] = 5n    // no compute
comp.in[1] = 10n   // no compute
const r = comp.out // compute now, r === 1n
```

## Performance

BigInt is slower than Number, but still ~1-2 orders of magnitude faster than
the WASM witness calculator for the size of circuits here. Rough benchmark:
running the `calculateForce` equivalent on random inputs is a few µs per call
in JS BigInt, vs. ~10ms WASM cold-start + ~ms/call after that.

For truly performance-sensitive loops, swap BigInt for fixed-size integer
math (emitting TypedArray-backed `number` when you can prove values stay
under 2^53). That's out of scope for this first cut; use the BigInt output
as the correctness oracle while you hand-optimize.

## Extending the runtime

To support a circomlib template this transpiler doesn't know yet:

1. Add its pure-JS equivalent to `runtime/circomlib.js`.
2. Add its `inputs` / `outputs` field lists to `BUILTIN_IO` in
   `src/emitter.js`.

## Why this over a full-blown IR?

This transpiler treats witness generation as straight-line arithmetic and
ignores the constraint-system side entirely. That's what makes it small
(~900 LOC) and fast to develop, but also why it's the right tool for "run my
physics at 60fps in the browser" rather than "build a new proving system."
