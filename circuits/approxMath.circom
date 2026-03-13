pragma circom 2.1.6;
include "mux1.circom";
include "comparators.circom";
include "gates.circom";
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

// Returns the floor integer square root of n (i.e. the largest r such that r*r <= n).
// approxSqrt sometimes returns the ceiling (when its binary search ends with lo==mid),
// so we adjust downward by 1 when mid^2 > n.
function floorSqrt(n) {
    var res[3] = approxSqrt(n);
    if (res[1] * res[1] > n) {
        res[1] = res[1] - 1;
    }
    return res[1];
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

// NOTE: the following constrains the approxDiv to ensure quotient * divisor <= dividend
  signal approxNumerator1 <== quotient * divisor; // maxBits: 126 (maxNum: 58_831_302_400_000_000_000_000_000_000_000_000_000)
  
  component lessThan = LessEqThan(64); // forceXnum; // maxBits: 64
  lessThan.in[0] <== approxNumerator1;
  lessThan.in[1] <== dividend;
  lessThan.out === 1;
}

template Sqrt(unboundDistanceSquaredMax) {
  signal input squaredValue;
  signal output root;

  var distanceResults[3] = approxSqrt(unboundDistanceSquaredMax);
  var distanceMax = distanceResults[1]; // maxNum = 1_414_213
  var distanceMaxDoubleMax = distanceMax * 2; // maxNum: 2_828_426
  var distanceMaxSquaredMaxBits = maxBits(distanceMaxDoubleMax); // maxBits: 22

  root <-- floorSqrt(squaredValue);

  // Verify root = floor(sqrt(squaredValue)) by checking: 0 <= squaredValue - root^2 <= root*2
  // This single range check proves both:
  //   squaredValue >= root^2  (if root is too large, squaredValue - root^2 underflows in the
  //                            field to a huge value, failing the LessEqThan range check)
  //   squaredValue < (root+1)^2  (since squaredValue - root^2 <= 2*root < 2*root+1 = (root+1)^2 - root^2)
  signal rootSquared <== root * root; // maxBits: 42 (maxNum: 2_000_000_000_000)
  signal diff <== squaredValue - rootSquared; // maxBits: 22 (maxNum: 2*root <= 2_828_426)

  component lessThan = LessEqThan(distanceMaxSquaredMaxBits);
  lessThan.in[0] <== diff;
  lessThan.in[1] <== root * 2; // maxBits: 22 (maxNum: 2_828_426)
  lessThan.out === 1;
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

    // If in[0] < in[1]: out = in[1] - in[0]
    // If in[0] >= in[1]: out = in[0] - in[1]
    component myMux = Mux1();
    myMux.c[0] <== in[0] - in[1];
    myMux.c[1] <== in[1] - in[0];
    myMux.s <== lessThan.out;
    out <== myMux.out;
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

