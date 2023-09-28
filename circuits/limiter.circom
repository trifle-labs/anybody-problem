pragma circom 2.1.0;

include "../node_modules/circomlib/circuits/mux1.circom";
include "../node_modules/circomlib/circuits/comparators.circom";

template Limiter(n) {
  signal input in;
  signal input limit;
  signal input rather;
  signal output out;

  component lessThan = LessThan(n);
  lessThan.in[0] <== in;
  lessThan.in[1] <== limit;

  component mux = Mux1();
  mux.in[0] <== in;
  mux.in[1] <== rather;
  mux.sel <== lessThan.out;
  out <== mux.out;
}

template LowerLimiter(n) {
  signal input in;
  signal input limit;
  signal input rather;
  signal output out;

  component lessThan = LessThan(n);
  lessThan.in[0] <== limit;
  lessThan.in[1] <== in;

  component mux = Mux1();
  mux.in[0] <== in;
  mux.in[1] <== rather;
  mux.sel <== lessThan.out;
  out <== mux.out;
}