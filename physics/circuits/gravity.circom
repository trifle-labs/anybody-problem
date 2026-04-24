pragma circom 2.1.6;

// Gravity(cfg) — parameterized gravitational pair-force.
//
// This is the library version of circuits/calculateForce.circom, with every
// bit width, scaling factor, and physical constant driven by template
// parameters. The caller passes in the values that deriveBounds() returned.
//
// Wiring: use `physics/bounds.js` to compute the bit widths that go into
// LessThan(...) and Sqrt(...) — don't hardcode them.
//
// Signal encoding:
//   in_bodies[i] = [positionX, positionY, _, _, radius]   (scaled)
//   out_forces[axis] = [signBit, magnitude]
//     signBit == 0 means positive component, == 1 means negative
//
// Template params (all bigint-compatible small numbers at compile time):
//   scalingFactor       e.g. 1000
//   windowWidth         e.g. 1000 (unscaled)
//   gravity             e.g. 100 (unscaled)
//   maxRadius           e.g. 13 (unscaled)
//   minDistance         e.g. 200 (unscaled)
//   distanceBits        from bounds.position.deltaAbs.bits       (e.g. 20)
//   distanceSquaredBits from bounds.position.distanceSquared.bits (e.g. 41)
//   distanceSquaredMax  from bounds.position.distanceSquared.max  (for Sqrt)
//   forceNumeratorBits  from bounds.force.componentNumerator.bits (e.g. 64)

include "../../circuits/approxMath.circom";
include "../../circuits/helpers.circom";

template Gravity(
    scalingFactor,
    windowWidth,
    gravity,
    maxRadius,
    minDistance,
    distanceBits,
    distanceSquaredBits,
    distanceSquaredMax,
    forceNumeratorBits
) {
  signal input in_bodies[2][5];
  signal output out_forces[2][2];

  var windowWidthScaled = windowWidth * scalingFactor;
  var GScaled = gravity * scalingFactor;
  var minDistanceScaledSq = (minDistance ** 2) * (scalingFactor ** 2);

  signal minDistanceScaled <== minDistanceScaledSq;

  var body1_x = getX(in_bodies[0]);
  var body1_y = getY(in_bodies[0]);
  var body1_r = getMass(in_bodies[0]);
  var body2_x = getX(in_bodies[1]);
  var body2_y = getY(in_bodies[1]);
  var body2_r = getMass(in_bodies[1]);

  // |dx|, |dy|
  component absDX = AbsoluteValueSubtraction(distanceBits);
  absDX.in[0] <== body1_x;
  absDX.in[1] <== body2_x;
  signal dxAbs <== absDX.out;

  component absDY = AbsoluteValueSubtraction(distanceBits);
  absDY.in[0] <== body1_y;
  absDY.in[1] <== body2_y;
  signal dyAbs <== absDY.out;

  // distSq = dx² + dy²
  signal dxs <== dxAbs * dxAbs;
  signal dys <== dyAbs * dyAbs;
  signal unboundDistanceSquared <== dxs + dys;

  // Clamp distSq to minDistSqScaled
  component lt = LessThan(distanceSquaredBits);
  lt.in[0] <== unboundDistanceSquared;
  lt.in[1] <== minDistanceScaled;

  component distMux = Mux1();
  distMux.c[0] <== unboundDistanceSquared;
  distMux.c[1] <== minDistanceScaled;
  distMux.s <== lt.out;
  signal distanceSquared <== distMux.out;

  component sqrt = Sqrt(distanceSquaredMax);
  sqrt.squaredValue <== distanceSquared;
  signal distance <== sqrt.root;

  // massSum with the "liveliness" ×4 factor kept from the original
  signal bodies_sum_tmp <== (body1_r + body2_r) * 4;

  component isZ1 = IsZero();
  isZ1.in <== body1_r;
  component m1 = Mux1();
  m1.c[0] <== bodies_sum_tmp;
  m1.c[1] <== 0;
  m1.s <== isZ1.out;

  component isZ2 = IsZero();
  isZ2.in <== body2_r;
  component m2 = Mux1();
  m2.c[0] <== m1.out;
  m2.c[1] <== 0;
  m2.s <== isZ2.out;
  signal bodies_sum <== m2.out;

  signal distanceSquared_with_avg_denom <== distanceSquared * 2;
  signal forceMag_numerator <== GScaled * bodies_sum * scalingFactor;
  signal forceDenom <== distanceSquared_with_avg_denom * distance;

  // X axis
  signal forceXnum <== dxAbs * forceMag_numerator;
  component divX = Div();
  divX.dividend <== forceXnum;
  divX.divisor <== forceDenom;

  signal dx_signed <== body2_x - body1_x;
  component isZ3 = IsZero();
  isZ3.in <== dxAbs + dx_signed;
  out_forces[0][0] <== isZ3.out;
  out_forces[0][1] <== divX.quotient;

  // Y axis
  signal forceYnum <== dyAbs * forceMag_numerator;
  component divY = Div();
  divY.dividend <== forceYnum;
  divY.divisor <== forceDenom;

  signal dy_signed <== body2_y - body1_y;
  component isZ4 = IsZero();
  isZ4.in <== dyAbs + dy_signed;
  out_forces[1][0] <== isZ4.out;
  out_forces[1][1] <== divY.quotient;
}
