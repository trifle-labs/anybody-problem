pragma circom 2.1.6;

include "approxMath.circom";
include "helpers.circom";

template CalculateForce() {
/* 
    // ORIGINAL JS VERSION

    // To preserve precision in the actual circuit
    // this calculation is rearranged with all multiplication first
    // and division at the end

    const position1 = body1.position
    const position2 = body2.position
    let dx = position2.x - position1.x;
    let dy = position2.y - position1.y;
    let distanceSq = dx * dx + dy * dy; // split this over two lines
    let minDistanceSquared = minDistance * minDistance
    if (distanceSq < minDistanceSquared) {
        distanceSq = minDistanceSquared
    }
    let distance = sqrt(distanceSq);

    // NOTE: we're not using classic newtonian physics but rather simplified version
    let forceMagnitude = (GScaled * (body1.radius + body2.radius) / 2) / distanceSq;
    let forceX = forceMagnitude * (dx / distance);
    let forceY = forceMagnitude * (dy / distance);
    return createVector(forceX, forceY);
*/


  // NOTE: scalingFactorFactor appears in calculateMissile, forceAccumulator as well
  var scalingFactorFactor = 3; // maxBits: 2
  var scalingFactor = 10**scalingFactorFactor; // maxBits: 10 (maxNum: 1_000)
  var scalingFactorMaxBits = maxBits(scalingFactor);

  var Gravity = 100; // maxBits: 7
  var GScaled =  Gravity * scalingFactor; // maxBits: 17 (maxNum: 100_000)
  var GScaledMaxBits = maxBits(GScaled);

  var maxRadius = 13;
  var maxRadiusScaled = 13 * scalingFactor; // maxBits: 14 (maxNum: 13_000)
  var maxRadiusScaledMaxBits = maxBits(maxRadiusScaled);

  var minDistance = 200; // maxBits: 8
  var minDistanceMaxBits = maxBits(minDistance);


  // NOTE: windowWidth appears in calculateMissile, forceAccumulator as well and needs to match
  var windowWidth = 1000; // maxBits: 10
  var windowWidthScaled = windowWidth * scalingFactor; // maxBits: 20 (maxNum: 1_000_000)
  var windowWidthScaledMaxBits = maxBits(windowWidthScaled);

  // log("GScaled", GScaled);

  signal input in_bodies[2][5];
  var in_bodiesPositionXMaxBits = windowWidthScaledMaxBits;
  signal output out_forces[2][2]; // maxBit: 64 (maxNum: 10_400_000_000_000_000_000)
  // type is an array where [n][v] such that n is whether the vector is negative or not 
  // (0 not negative, 1 is negative) and v is the absolute value of the vector

 // NOTE: this is 200**2 so we have to square the scaling factor too
  signal minDistanceScaled <== (minDistance ** 2) * (scalingFactor ** 2); // maxBits: 36 (maxNum: 40_000_000_000)
  var minDistanceScaledMax = (minDistance**2) * (scalingFactor**2);
  var minDistanceScaledMaxBits = maxBits(minDistanceScaledMax);
  // NOTE: minDistanceScaled is maximum of 
  // log("minDistanceScaled", minDistanceScaled);
  var body1_position_x = getX(in_bodies[0]); // maxBits: 20 (maxNum: 1_000_000) = windowWidthScaled
  var body1_position_xMaxBits = windowWidthScaledMaxBits;
  // log("body1_position_x", body1_position_x);
  var body1_position_y = getY(in_bodies[0]); // maxBits: 20 (maxNum: 1_000_000) = windowWidthScaled
  var body1_position_yMaxBits = windowWidthScaledMaxBits;
  // log("body1_position_y", body1_position_y);

  // NOTE: maximum radius currently 13
  var body1_radius = getMass(in_bodies[0]); // maxBits: 14 = numBits(13 * scalingFactor) (maxNum: 13_000)
  var body1_radiusMaxBits = maxRadiusScaledMaxBits;
  var body2_position_x = getX(in_bodies[1]); // maxBits: 20 (maxNum: 1_000_000) = windowWidthScaled
  var body2_position_xMaxBits = windowWidthScaledMaxBits;
  // log("body2_position_x", body2_position_x);
  var body2_position_y = getY(in_bodies[1]); // maxBits: 20 (maxNum: 1_000_000) = windowWidthScaled
  var body2_position_yMaxBits = windowWidthScaledMaxBits;
  // log("body2_position_y", body2_position_y);
  
  // NOTE: maximum radius currently 13
  var body2_radius = getMass(in_bodies[1]); // maxBits: 14 = numBits(13 * scalingFactor) (maxNum: 13_000)
  var body2_radiusMaxBits = maxRadiusScaledMaxBits;

  signal dx <== body2_position_x - body1_position_x; // maxBits: 254 because it can be negative

  var max = getBiggest([body1_position_xMaxBits, body2_position_xMaxBits], 2);
  component absoluteValueSubtraction = AbsoluteValueSubtraction(max);
  absoluteValueSubtraction.in[0] <== body1_position_x; // maxBits: 20 (maxNum: 1_000_000)
  absoluteValueSubtraction.in[1] <== body2_position_x; // maxBits: 20 (maxNum: 1_000_000)
  signal dxAbs <== absoluteValueSubtraction.out; // maxBits: 20 (maxNum: 1_000_000)
  var dxAbsMax = windowWidthScaled;

  signal dy <== body2_position_y - body1_position_y; // maxBits: 254 because it can be negative
  var max2 = getBiggest([body1_position_yMaxBits, body2_position_yMaxBits], 2);
  component absoluteValueSubtraction2 = AbsoluteValueSubtraction(max2);
  absoluteValueSubtraction2.in[0] <== body1_position_y; // maxBits: 20 (maxNum: 1_000_000)
  absoluteValueSubtraction2.in[1] <== body2_position_y; // maxBits: 20 (maxNum: 1_000_000)
  signal dyAbs <== absoluteValueSubtraction2.out; // maxBits: 20 (maxNum: 1_000_000)
  var dyAbsMax = windowWidthScaled;
  // log("dx", dx);
  // log("dy", dy);


  // log("dxAbs", dxAbs);
  // log("dyAbs", dyAbs);

  signal dxs <== dxAbs * dxAbs; // maxBits: 40 = 20 * 2 (maxNum: 1_000_000_000_000)
  var dxsMax = dxAbsMax * dxAbsMax;
  var dxsMaxBits = maxBits(dxsMax);

  // log("dxs", dxs);
  signal dys <== dyAbs * dyAbs; // maxBits: 40 = 20 * 2 (maxNum: 1_000_000_000_000)
  var dysMax = dyAbsMax * dyAbsMax;
  var dysMaxBits = maxBits(dysMax);

  // log("dys", dys);
  signal unboundDistanceSquared <== dxs + dys; // maxBits: 41 = 40 + 1 (maxNum: 2_000_000_000_000)
  var unboundDistanceSquaredMax = dxsMax + dysMax;
  var unboundDistanceSquaredMaxBits = maxBits(unboundDistanceSquaredMax);
  // log("unboundDistanceSquared", unboundDistanceSquared);

  var max3 = getBiggest([unboundDistanceSquaredMaxBits, minDistanceScaledMaxBits], 2);
  component lessThan = LessThan(max3);
  lessThan.in[0] <== unboundDistanceSquared; // maxBits: 41: (maxNum: 2_000_000_000_000)
  lessThan.in[1] <== minDistanceScaled; // maxBits: 36 (maxNum: 40_000_000_000)

  component myMux = Mux1();
  myMux.c[0] <== unboundDistanceSquared; // maxBits: 41 (maxNum: 2_000_000_000_000)
  myMux.c[1] <== minDistanceScaled; // maxBits: 36 (maxNum: 40_000_000_000)
  myMux.s <== lessThan.out;
  signal distanceSquared <== myMux.out; // maxBits: 41 (maxNum: 2_000_000_000_000)
  
  signal approxSqrtResults[3];
  approxSqrtResults <-- approxSqrt(distanceSquared);
  // approxSqrtResults[0] = lo
  // approxSqrtResults[1] = mid
  // approxSqrtResults[2] = hi
  signal distance <-- approxSqrtResults[1];
  var distanceResults[3];
  distanceResults = approxSqrt(unboundDistanceSquaredMax);
  var distanceMax = distanceResults[1];
  var distanceMaxBits = maxBits(distanceMax);

  component isPerfect = IsZero();
  isPerfect.in <== (distance**2) - distanceSquared;
  signal perfectSquare <== isPerfect.out;
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

  // one must be true;
  isZeroDiff2.out + isZeroDiff3.out === 1;

  component diffMux = Mux1();
  diffMux.c[0] <== (approxSqrtResults[1] ** 2) - distanceSquared; // mid**2 - actual
  diffMux.c[1] <== distanceSquared - (approxSqrtResults[1] ** 2); // actual - mid**2
  diffMux.s <== isZeroDiff2.out;
  signal imperfectDiff <== diffMux.out;

  // difference is 0 if perfect square is true
  component diffMux2 = Mux1();
  diffMux2.c[0] <== imperfectDiff;
  diffMux2.c[1] <== 0;
  diffMux2.s <== perfectSquare;
  signal diff <== diffMux2.out;

  var distanceMaxSquaredMax = distanceMax**2;
  var distanceMaxSquaredMaxBits = maxBits(distanceMaxSquaredMax);
  log(distanceMaxSquaredMaxBits, " is 22 (distanceMaxSquaredMaxBits)");
  component lessThan2 = LessEqThan(distanceMaxSquaredMaxBits);
  lessThan2.in[0] <== diff;
  lessThan2.in[1] <== distance*2; // maxBits: 22 (maxNum: 2_828_428)
  // diff must be less than distance*2 as the acceptable margin of error
  lessThan2.out === 1;

 // NOTE: this could be tweaked as a variable for "liveliness" of bodies
  signal bodies_sum_tmp <== (body1_radius + body2_radius) * 4; // maxBits: 17 (maxNum: 104_000)

  // bodies_sum is 0 if either body1_radius or body2_radius is 0
  component isZero = IsZero();
  isZero.in <== body1_radius; // maxBits: 14

  component myMux2 = Mux1();
  myMux2.c[0] <== bodies_sum_tmp; // maxBits: 17 (maxNum: 104_000)
  myMux2.c[1] <== 0; // maxBits: 0
  myMux2.s <== isZero.out;

  component isZero2 = IsZero();
  isZero2.in <== body2_radius; // maxBits: 14

  component myMux3 = Mux1();
  myMux3.c[0] <== myMux2.out; // maxBits: 17 (maxNum: 104_000)
  myMux3.c[1] <== 0; // maxBits: 0
  myMux3.s <== isZero2.out;
  signal bodies_sum <== myMux3.out; // maxBits: 17 (maxNum: 104_000)

  // log("bodies_sum", bodies_sum);

 // NOTE: this is a result of moving division to end of calculation to preserve precision
  signal distanceSquared_with_avg_denom <== distanceSquared * 2; // maxBits: 42 (maxNum: 4_000_000_000_000)
  // log("distanceSquared_with_avg_denom", distanceSquared_with_avg_denom);

   // NOTE: distance should be divided by scaling factor, but we can multiply GScaled by scaling factor instead to prevent division rounding errors
  signal forceMag_numerator <== GScaled * bodies_sum * scalingFactor; // maxBits: 44 (maxNum: 10_400_000_000_000)
  // log("forceMag_numerator", forceMag_numerator);

  signal forceDenom <== distanceSquared_with_avg_denom * distance; // maxBits: 63 (maxNum: 5_656_856_000_000_000_000)
  // log("forceDenom", forceDenom);

  signal forceXnum <== dxAbs * forceMag_numerator; // maxBits: 64 (maxNum: 10_400_000_000_000_000_000)
  // log("forceXnum", forceXnum);
  signal forceXunsigned <-- approxDiv(forceXnum, forceDenom); // maxBits: 64 (maxNum: 10_400_000_000_000_000_000)
  // log("forceXunsigned", forceXunsigned);
// NOTE: the following constraints the approxDiv to ensure it's within the acceptable error of margin
  signal approxNumerator1 <== forceXunsigned * forceDenom; // maxBits: 126 (maxNum: 58_831_302_400_000_000_000_000_000_000_000_000_000)
  component acceptableMarginOfErrorDiv1 = AcceptableMarginOfError(126);
  acceptableMarginOfErrorDiv1.expected <== forceXnum; // maxBits: 64
  acceptableMarginOfErrorDiv1.actual <== approxNumerator1; // maxBits: 126
  acceptableMarginOfErrorDiv1.marginOfError <== forceDenom; // TODO: actually could be further reduced to (realDenom / 2) + 1 but then we're using division again
  acceptableMarginOfErrorDiv1.out === 1;

  // if dxAbs + dx is 0, then forceX should be negative
  component isZero3 = IsZero();
  // NOTE: isZero handles overflow bit values correctly
  isZero3.in <== dxAbs + dx; // maxBits:  maxBits: 21 (maxNum: 2_000_000)
  // log("isZero3", dxAbs + dx, isZero3.out);
  out_forces[0][0] <== isZero3.out; // isZero is 1 when dx is negative
  out_forces[0][1] <== forceXunsigned; // maxBits 64 (maxNum: 10_400_000_000_000_000_000)

  signal forceYnum <== dyAbs * forceMag_numerator; // maxBits:64 (maxNum: 10_400_000_000_000_000_000)
  // log("forceYnum", forceYnum);
  signal forceYunsigned <-- approxDiv(forceYnum, forceDenom); // maxBits: 64 (maxNum: 10_400_000_000_000_000_000)
  // log("forceYunsigned", forceYunsigned);
  // NOTE: the following constraints the approxDiv to ensure it's within the acceptable error of margin
  signal approxNumerator2 <== forceYunsigned * forceDenom; // maxBits: 126 (maxNum: 58_831_302_400_000_000_000_000_000_000_000_000_000)
  component acceptableMarginOfErrorDiv2 = AcceptableMarginOfError(126);
  acceptableMarginOfErrorDiv2.expected <== forceYnum; // maxBits: 64
  acceptableMarginOfErrorDiv2.actual <== approxNumerator2; // maxBits: 126
  acceptableMarginOfErrorDiv2.marginOfError <== forceDenom; // TODO: actually could be further reduced to (realDenom / 2) + 1 but then we're using division again
  acceptableMarginOfErrorDiv2.out === 1;

  // if dyAbs + dy is 0, then forceY should be negative
  component isZero4 = IsZero();
    // NOTE: isZero handles overflow bit values correctly
  isZero4.in <== dyAbs + dy; // maxBits: 255 = max(37, 254) + 1

  // log("forceY", forceY);
  out_forces[1][0] <== isZero4.out;
  out_forces[1][1] <== forceYunsigned; // maxBits 64 (maxNum: 10_400_000_000_000_000_000)
}