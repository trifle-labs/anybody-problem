pragma circom 2.1.6;

include "approxMath.circom";

template GetDistance(n) {
  signal input x1; // maxBits: 20 (maxNum: 1_000_000) = windowWidthScaled
  signal input y1; // maxBits: 20 (maxNum: 1_000_000) = windowWidthScaled
  signal input x2; // maxBits: 20 (maxNum: 1_000_000) = windowWidthScaled
  signal input y2; // maxBits: 20 (maxNum: 1_000_000) = windowWidthScaled
  signal output distance;

  // signal dx <== x2 - x1;
  component absoluteValueSubtraction = AbsoluteValueSubtraction(n);
  absoluteValueSubtraction.in[0] <== x1; // maxBits: 20 (maxNum: 1_000_000) = windowWidthScaled
  absoluteValueSubtraction.in[1] <== x2; // maxBits: 20 (maxNum: 1_000_000) = windowWidthScaled
  signal dxAbs <== absoluteValueSubtraction.out; // maxBits: 20 (maxNum: 1_000_000) = windowWidthScaled

  // signal dy <== y2 - y1;
  component absoluteValueSubtraction2 = AbsoluteValueSubtraction(n);
  absoluteValueSubtraction2.in[0] <== y1; // maxBits: 20 (maxNum: 1_000_000) = windowWidthScaled
  absoluteValueSubtraction2.in[1] <== y2; // maxBits: 20 (maxNum: 1_000_000) = windowWidthScaled
  signal dyAbs <== absoluteValueSubtraction2.out; // maxBits: 20 (maxNum: 1_000_000) = windowWidthScaled

  signal dxs <== dxAbs * dxAbs; // maxBits: 40 = 20 * 2 (maxNum: 1_000_000_000_000)
  signal dys <== dyAbs * dyAbs; // maxBits: 40 = 20 * 2 (maxNum: 1_000_000_000_000)
  signal distanceSquared <== dxs + dys; // maxBits: 41 = 40 + 1 (maxNum: 2_000_000_000_000)

  // NOTE: confirm this is correct
  distance <-- approxSqrt(distanceSquared); // maxBits: 21 (maxNum: 1_414_214) ~= 41 / 2 + 2
  component acceptableMarginOfError = AcceptableMarginOfError((2 * n) + 1);
  acceptableMarginOfError.expected <== distance ** 2; // maxBits: 41 (maxNum: 2_000_001_237_796) ~= 21 * 2
  acceptableMarginOfError.actual <== distanceSquared; // maxBits: 41
  // margin of error should be midpoint between squares
  acceptableMarginOfError.marginOfError <== distance * 2; // maxBits: 22 (maxNum: 2_828_428)
  acceptableMarginOfError.out === 1;
}