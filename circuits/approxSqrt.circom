pragma circom 2.1.0;
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

template AcceptableErrorOfMargin () {
    signal input squared;
    signal input calculatedRoot;
    signal output result;

    signal calculatedSquared <== calculatedRoot * calculatedRoot;

  // The following is to ensure diff = Abs(calculatedSquared - squared)

  // "lessThanResult" = "calculatedSquared" is less than "squared"
    component lessThan = LessThan(60); // TODO: test limits of squares
    lessThan.in[0] <== calculatedSquared;
    lessThan.in[1] <== squared;
    signal lessThanResult <== lessThan.out; // lessThanResult = 1 if 

    // "greaterValue" is "squared" if "calculatedSquared" is less than "squared" (lessThanResult)
    component myMux = Mux1();
    myMux.c[0] <== squared;
    myMux.c[1] <== calculatedSquared;
    myMux.s <== lessThanResult;
    signal greaterValue <== myMux.out;

    // "lesserValue" is "calculatedSquared" if "calculatedSquared" is less than "squared" (lessThanResult)
    component myMux2 = Mux1();
    myMux2.c[0] <== calculatedSquared;
    myMux2.c[1] <== squared;
    myMux2.s <== lessThanResult;
    signal lesserValue <== myMux2.out;

    // Now ensure that the diff is less than the margin of error
    signal diff <== greaterValue - lesserValue;
    // margin of error should be midpoint between squares, so root + 1
    signal marginOfError <== calculatedRoot + 1;

    // Should be maximum of the vectorLimiter squared which would be (10 * 10 ** 8) * (10 * 10 ** 8)
    component lessThan2  = LessThan(60); // TODO: test the limits of this. 
    lessThan2.in[0] <== diff;
    lessThan2.in[1] <== marginOfError;
    result <== lessThan2.out;
}

// component main { public [ squared, calculatedRoot ] } = AcceptableErrorOfMargin();
