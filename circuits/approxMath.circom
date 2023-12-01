pragma circom 2.1.6;
include "../node_modules/circomlib/circuits/mux1.circom";
include "../node_modules/circomlib/circuits/comparators.circom";
include "../node_modules/circomlib/circuits/gates.circom";
include "helpers.circom";

function approxSqrt(n) {
    if (n == 0) {
        return [0,0,0];
    }

    var lo = 0;
    var hi = n >> 1;
    var mid, midSquared;

    while (lo <= hi) {
        mid = (lo + hi) >> 1; // multiplication by multiplicative inverse is not what we want so we use >>
        // TODO: Make more accurate by checking if lo + hi is odd or even before bit shifting
        midSquared = (mid * mid);
        if (midSquared == n) {
            return [lo,mid,hi]; // Exact square root found
        } else if (midSquared < n) {
            lo = mid + 1; // Adjust lower bound
        } else {
            hi = mid - 1; // Adjust upper bound
        }
    }
    // If we reach here, no exact square root was found.
    // return the closest approximation
    return [lo, mid, hi];
}


function approxDiv(dividend, divisor) {
  if (dividend == 0) {
    return 0;
  }

  // Create internal signals for our binary search
  var lo, hi, mid, testProduct;

  // Initialize our search space
  lo = 0;
  hi = dividend;  // Assuming worst case where divisor = 1

  while (lo < hi) {  // 32 iterations for 32-bit numbers as an example
    mid = (hi + lo + 1) >> 1;
    testProduct = mid * divisor;

    // Adjust our bounds based on the test product
    if (testProduct > dividend) {
      hi = mid - 1;
    } else {
      lo = mid;
    }
  }
  // Output the lo as our approximated quotient after iterations
  // quotient <== lo;
  return lo;
}

template Div() {
  signal input dividend;
  signal input divisor;
  signal output quotient;

  quotient <-- approxDiv(dividend, divisor); // maxBits: 64 (maxNum: 10_400_000_000_000_000_000)

// NOTE: the following constraints the approxDiv to ensure it's within the acceptable error of margin
  signal approxNumerator1 <== quotient * divisor; // maxBits: 126 (maxNum: 58_831_302_400_000_000_000_000_000_000_000_000_000)
  
  // NOTE: approxDiv always rounds down so the approximate quotient will always be less
  // than the actual quotient.
  signal diff <== dividend - quotient;
  // log("diff    ", diff);
  // log("dividend", dividend);
  // log("divisor", divisor);
  // log("quotient", quotient);

  component lessThan = LessEqThan(64); // forceXnum; // maxBits: 64
  lessThan.in[0] <== diff;
  lessThan.in[1] <== dividend;
  // log("lessThan", lessThan.out, "\n");

  component isZero = IsZero();
  isZero.in <== dividend;

  component or = OR();
  or.a <== isZero.out;
  or.b <== lessThan.out;
  or.out === 1;
}

template Sqrt(unboundDistanceSquaredMax) {
  signal input squaredValue;
  signal output root;
  signal approxSqrtResults[3];
  approxSqrtResults <-- approxSqrt(squaredValue);
  // approxSqrtResults[0] = lo
  // approxSqrtResults[1] = mid
  // approxSqrtResults[2] = hi
  log("squaredValue", squaredValue);
  log("approxSqrtResults[0]", approxSqrtResults[0]);
  log("approxSqrtResults[1]", approxSqrtResults[1]);
  log("approxSqrtResults[2]", approxSqrtResults[2]);
  root <-- approxSqrtResults[1];

  var distanceResults[3];
  distanceResults = approxSqrt(unboundDistanceSquaredMax);
  var distanceMax = distanceResults[1]; // maxNum = 1414214n
  var distanceMaxBits = maxBits(distanceMax);

  log("root**2", root**2);

  component isPerfect = IsZero();
  isPerfect.in <== (root**2) - squaredValue;
  // signal perfectSquare <== isPerfect.out;
  // log("isPerfect", isPerfect.out);

  // perfectSquare is true, absDiff = 0
  // OR
  // if lo - mid == 0, absDiff = mid**2 - actual
  // if hi - mid == 0, absDiff = actual - mid**2
  component isZeroDiff2 = IsZero();
  isZeroDiff2.in <== approxSqrtResults[0] - approxSqrtResults[1]; // lo - mid

  // need to constrain that if isZeroDiff2 is not 0 then hi - mid is 0
  component isZeroDiff3 = IsZero();
  isZeroDiff3.in <== approxSqrtResults[2] - approxSqrtResults[1]; // hi - mid

  // firstCondition is XOR
  // (isZeroDiff2 == 1 AND isZeroDiff3 == 0) OR (isZeroDiff2 == 0 AND isZeroDiff3 == 1)
  // secondCondition
  // OR (isPerfect = 1)

  component firstCondition = XOR();
  firstCondition.a <== isZeroDiff2.out;
  firstCondition.b <== isZeroDiff3.out;

  // one must be true;
  component secondCondition = OR();
  secondCondition.a <== firstCondition.out;
  secondCondition.b <== isPerfect.out;
  secondCondition.out === 1;


  log("isZeroDiff2.out", isZeroDiff2.out);
  log("isZeroDiff3.out", isZeroDiff3.out);
  log("firstCondition.out", firstCondition.out);

  log("isPerfect.out", isPerfect.out);


  log("squaredValue", squaredValue );
  log("(approxSqrtResults[1] ** 2)", (approxSqrtResults[1] ** 2));

  log("(approxSqrtResults[1] ** 2) - squaredValue",  (approxSqrtResults[1] ** 2) - squaredValue);
  log("squaredValue - (approxSqrtResults[1] ** 2)", squaredValue - (approxSqrtResults[1] ** 2));

  component diffMux = Mux1();
  diffMux.c[0] <== (approxSqrtResults[1] ** 2) - squaredValue; // mid**2 - actual
  diffMux.c[1] <== squaredValue - (approxSqrtResults[1] ** 2); // actual - mid**2
  diffMux.s <== isZeroDiff3.out;
  signal imperfectDiff <== diffMux.out;
  log("imperfectDiff", imperfectDiff);
  // difference is 0 if perfect square is true
  component diffMux2 = Mux1();
  diffMux2.c[0] <== imperfectDiff;
  diffMux2.c[1] <== 0;
  diffMux2.s <== isPerfect.out;
  signal diff <== diffMux2.out;

  var distanceMaxDoubleMax = distanceMax*2; // maxNum: 2,828,428
  var distanceMaxSquaredMaxBits = maxBits(distanceMaxDoubleMax); // maxBits: 22
  log("distanceMaxSquaredMaxBits", distanceMaxSquaredMaxBits);
  log("diff", diff);
  log("root*2", root*2);
  component lessThan2 = LessEqThan(distanceMaxSquaredMaxBits);
  lessThan2.in[0] <== diff;
  lessThan2.in[1] <== root*2; // maxBits: 22 (maxNum: 2_828_428)
  // diff must be less than root*2 as the acceptable margin of error
  lessThan2.out === 1;
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

    component lessThan = LessThan(n);
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

// NOTE: This isn't an efficient system because LessThan has max 252 bits, which could be overridden but still not ideal
// template AbsoluteValue() {
//   signal input in;
//   signal output out;
//   signal most_positive_number <== 10944121435919637611123202872628637544274182200208017171849102093287904247808;
//   // p = 21888242871839275222246405745257275088548364400416034343698204186575808495617;
//   // p_minus_one = 21888242871839275222246405745257275088548364400416034343698204186575808495616;

//   component lessThan = LessThan(252); // TODO: confirm this is necessary for most_positive_number
//   lessThan.in[0] <== in;
//   lessThan.in[1] <== most_positive_number;

//   component myMux = Mux1();
//   myMux.c[0] <== in * -1;
//   myMux.c[1] <== in; // TODO: confirm whether cheaper to do p - in using p as signal
//   myMux.s <== lessThan.out;

//   out <== myMux.out;
// }

