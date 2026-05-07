pragma circom 2.1.6;

include "mux1.circom";
include "comparators.circom";

template Limiter(n) {
  signal input in;
  signal input limit;
  signal input rather;
  signal output out;
  signal output ltOut; // 1 if in < limit (no clamping), 0 if in >= limit (clamped to rather)

  component lessThan = LessThan(n);
  lessThan.in[0] <== in;
  lessThan.in[1] <== limit;
  ltOut <== lessThan.out;

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
  signal output ltOut; // 1 iff limit < in (no clamping), 0 iff limit >= in (clamped to rather)

  component lessThan = LessThan(n);
  lessThan.in[0] <== limit;
  lessThan.in[1] <== in;

  component mux = Mux1();
  mux.c[0] <== rather;
  mux.c[1] <== in;
  mux.s <== lessThan.out;
  out <== mux.out;
  ltOut <== lessThan.out;
}