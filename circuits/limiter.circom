pragma circom 2.1.6;

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
  mux.c[0] <== rather;
  mux.c[1] <== in;
  mux.s <== lessThan.out;
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
  mux.c[0] <== rather;
  mux.c[1] <== in;
  mux.s <== lessThan.out;
  out <== mux.out;
}