pragma circom 2.1.0;

function approxDiv(dividend, divisor) {
  // log("dividend", dividend);
  // log("divisor", divisor);
  // signal input dividend;
  // signal input divisor;
  // signal output quotient;

  // Create internal signals for our binary search
  var lowerBound, upperBound, midPoint, testProduct;

  // Initialize our search space
  lowerBound = 0;
  upperBound = dividend;  // Assuming worst case where divisor = 1

  for (var i = 0; i < 128; i++) {  // 32 iterations for 32-bit numbers as an example
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
  // quotient <== midPoint;
  return midPoint;
}