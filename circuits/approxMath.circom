pragma circom 2.1.6;
include "../node_modules/circomlib/circuits/mux1.circom";
include "../node_modules/circomlib/circuits/comparators.circom";

function approxSqrt(n) {
    if (n == 0) {
        return 0;
    }

    var lo = 0;
    var hi = n >> 1;
    var mid, midSquared;

    while (lo <= hi) {
        mid = (lo + hi) >> 1; // multiplication by multiplicative inverse is not what we want so we use >>
        // TODO: Make more accurate by checking if lo + hi is odd or even before bit shifting
        midSquared = (mid * mid);
        if (midSquared == n) {
            return mid; // Exact square root found
        } else if (midSquared < n) {
            lo = mid + 1; // Adjust lower bound
        } else {
            hi = mid - 1; // Adjust upper bound
        }
    }
    // If we reach here, no exact square root was found.
    // return the closest approximation
    return mid;
}

function approxDiv(dividend, divisor) {
  var bitsDivident = 0;
  var dividendCopy = dividend;
  while(dividendCopy > 0) {
    bitsDivident++;
    dividendCopy = dividendCopy >> 1;
  }
  // Create internal signals for our binary search
  var lowerBound, upperBound, midPoint, testProduct;
  // Initialize our search space
  lowerBound = 0;
  upperBound = dividend;  // Assuming worst case where divisor = 1

  for (var i = 0; i < bitsDivident; i++) {  // 32 iterations for 32-bit numbers as an example
      midPoint = (upperBound + lowerBound) >> 1;
      testProduct = midPoint * divisor;
      // Adjust our bounds based on the test product
      if (testProduct > dividend) {
          upperBound = midPoint;
      } else {
          lowerBound = midPoint;
      }
  }

  // Output the midpoint as our approximated quotient after iterations
  return midPoint;
}


template AcceptableMarginOfError (n) {
    signal input expected;
    signal input actual;
    signal input marginOfError;
    signal output out;


  // The following is to ensure diff = Abs(actual - expected)
    component absoluteValueSubtraction = AbsoluteValueSubtraction(n);
    absoluteValueSubtraction.in[0] <== expected;
    absoluteValueSubtraction.in[1] <== actual;

    // Now ensure that the diff is less than the margin of error
    component lessThan2  = LessEqThan(n);
    lessThan2.in[0] <== absoluteValueSubtraction.out;
    lessThan2.in[1] <== marginOfError;
    out <== lessThan2.out;
}

template AbsoluteValueSubtraction (n) {
    signal input in[2];
    signal output out;

    component lessThan = LessThan(n); // TODO: test limits of squares
    lessThan.in[0] <== in[0];
    lessThan.in[1] <== in[1];
    signal lessThanResult <== lessThan.out;

    component myMux = Mux1();
    myMux.c[0] <== in[0];
    myMux.c[1] <== in[1];
    myMux.s <== lessThanResult;
    signal greaterValue <== myMux.out;

    component isZero = IsZero();
    isZero.in <== greaterValue - in[0];

    component myMux2 = Mux1();
    myMux2.c[0] <== in[0];
    myMux2.c[1] <== in[1];
    myMux2.s <== isZero.out;
    signal lesserValue <== myMux2.out;

    out <== greaterValue - lesserValue;
}

// TODO: Confirm this doesn't work because most_positive_number is too large for LessThan circuit
template AbsoluteValue() {
  signal input in;
  signal output out;
  signal most_positive_number <== 10944121435919637611123202872628637544274182200208017171849102093287904247808;
  // p = 21888242871839275222246405745257275088548364400416034343698204186575808495617;
  // p_minus_one = 21888242871839275222246405745257275088548364400416034343698204186575808495616;

  component lessThan = LessThan(252); // TODO: confirm this is necessary for most_positive_number
  lessThan.in[0] <== in;
  lessThan.in[1] <== most_positive_number;

  component myMux = Mux1();
  myMux.c[0] <== in * -1;
  myMux.c[1] <== in; // TODO: confirm whether cheaper to do p - in using p as signal
  myMux.s <== lessThan.out;

  out <== myMux.out;
}

