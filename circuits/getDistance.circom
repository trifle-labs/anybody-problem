pragma circom 2.1.6;

include "approxMath.circom";

template GetDistance(n) {
  signal input x1;
  signal input y1;
  signal input x2;
  signal input y2;
  signal output distance;

  // signal dx <== x2 - x1;
  component absoluteValueSubtraction = AbsoluteValueSubtraction(n); // TODO: test limit
  absoluteValueSubtraction.in[0] <== x1;
  absoluteValueSubtraction.in[1] <== x2;
  signal dxAbs <== absoluteValueSubtraction.out;

  // signal dy <== y2 - y1;
  component absoluteValueSubtraction2 = AbsoluteValueSubtraction(n); // TODO: test limit
  absoluteValueSubtraction2.in[0] <== y1;
  absoluteValueSubtraction2.in[1] <== y2;
  signal dyAbs <== absoluteValueSubtraction2.out;

  signal dxs <== dxAbs * dxAbs;
  signal dys <== dyAbs * dyAbs;
  signal distanceSquared <== dxs + dys;

  // NOTE: confirm this is correct
  distance <-- approxSqrt(distanceSquared);
  // bits should be maximum of the vectorLimiter which would be (10 * 10 ** 8) * (10 * 10 ** 8) which is under 60 bits
  component acceptableMarginOfError = AcceptableMarginOfError(n);  // TODO: test the limits of this. 
  acceptableMarginOfError.val1 <== distanceSquared;
  acceptableMarginOfError.val2 <== distance ** 2;
  // margin of error should be midpoint between squares
  acceptableMarginOfError.marginOfError <== distance * 2; // TODO: confrim if (distance * 2) +1 is needed
  acceptableMarginOfError.out === 1;
}