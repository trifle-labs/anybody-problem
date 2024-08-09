pragma circom 2.1.6;

include "mux1.circom";
include "comparators.circom";

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