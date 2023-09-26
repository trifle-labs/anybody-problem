pragma circom 2.1.0;
include "../node_modules/circomlib/circuits/mux1.circom";
include "../node_modules/circomlib/circuits/comparators.circom";
include "absoluteValueSubtraction.circom";
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

template AcceptableErrorOfMargin (n) {
    signal input val1;
    signal input val2;
    signal input marginOfError;
    signal output out;

  // The following is to ensure diff = Abs(val2 - val1)
    component absoluteValueSubtraction = AbsoluteValueSubtraction(60);
    absoluteValueSubtraction.in[0] <== val1;
    absoluteValueSubtraction.in[1] <== val2;

    signal diff <== absoluteValueSubtraction.out;
    // Now ensure that the diff is less than the margin of error
    component lessThan2  = LessThan(n);
    lessThan2.in[0] <== diff;
    lessThan2.in[1] <== marginOfError;
    out <== lessThan2.out;
}

// component main { public [ val1, val2 ] } = AcceptableErrorOfMargin();
