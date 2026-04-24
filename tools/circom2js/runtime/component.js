// Runtime helper: lazy components.
//
// Circom has a dataflow model — component inputs get assigned in any order,
// and outputs become available after all inputs are set. In JS we simulate
// this by deferring the actual computation until the first output read.
//
// Usage (emitted by the transpiler):
//
//   const myComp = LazyComponent(
//     () => Foo(param1, param2),    // the template-instantiated function
//     ['a', 'b'],                    // input field names
//     ['out']                        // output field names
//   )
//   myComp.a = 3n
//   myComp.b[0] = 5n
//   const z = myComp.out  // triggers compute with { a: 3n, b: [5n] }

export function LazyComponent(fnThunk, inputFields, outputFields) {
  const inputs = {}
  let outputs = null
  let computed = false

  const obj = {}

  for (const f of inputFields) {
    Object.defineProperty(obj, f, {
      enumerable: true,
      configurable: false,
      get() {
        // Auto-vivify arrays/objects for array-valued inputs so that
        // `comp.in[0] = x; comp.in[1] = y;` works without declaration.
        if (inputs[f] === undefined) inputs[f] = []
        return inputs[f]
      },
      set(v) {
        inputs[f] = v
      },
    })
  }

  for (const f of outputFields) {
    Object.defineProperty(obj, f, {
      enumerable: true,
      configurable: false,
      get() {
        if (!computed) {
          outputs = fnThunk()(inputs)
          computed = true
        }
        return outputs[f]
      },
    })
  }

  return obj
}

/** Allocate an array of placeholder components (e.g. `component foo[n];`). */
export function LazyComponentArray(n) {
  // Holds slots; emitter later does `comps[i] = LazyComponent(...)`.
  return new Array(n)
}
