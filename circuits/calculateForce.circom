pragma circom 2.1.6;

include "approxMath.circom";

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
  var scalingFactorFactor = 8; // maxBits: 4
  var scalingFactor = 10**scalingFactorFactor; // maxBits: 27
  
  var Gravity = 100; // maxBits: 7
  var minDistance = 200; // maxBits: 8


  // NOTE: windowWidth appears in calculateMissile, forceAccumulator as well and needs to match
  var windowWidth = 1000; // maxBits: 10
  var windowWidthScaled = windowWidth * scalingFactor; // maxBits: 37


   // TODO: these could be constrained, do they need to be?
  var GScaled =  Gravity * scalingFactor; // maxBits: 34
  // log("GScaled", GScaled);

  signal input in_bodies[2][5];
  signal output out_forces[2];

 // NOTE: this is 200**2 so we have to square the scaling factor too
  signal minDistanceScaled <== (minDistance ** 2) * (scalingFactor ** 2); // maxBits: 69
  // NOTE: minDistanceScaled is maximum of 
  // log("minDistanceScaled", minDistanceScaled);
  var body1_position_x = in_bodies[0][0]; // maxBits: 37 = windowWidthScaled
  // log("body1_position_x", body1_position_x);
  var body1_position_y = in_bodies[0][1]; // maxBits: 37 = windowWidthScaled
  // log("body1_position_y", body1_position_y);

  // NOTE: maximum radius currently 13
  var body1_radius = in_bodies[0][4]; // maxBits: 31 = numBits(13 * scalingFactor)

  var body2_position_x = in_bodies[1][0]; // maxBits: 37 = windowWidthScaled
  // log("body2_position_x", body2_position_x);
  var body2_position_y = in_bodies[1][1]; // maxBits: 37 = windowWidthScaled
  // log("body2_position_y", body2_position_y);
  
  // NOTE: maximum radius currently 13
  var body2_radius = in_bodies[1][4]; // maxBits: 31 = numBits(13 * scalingFactor)

  signal dx <== body2_position_x - body1_position_x; // maxBits: 254 because it can be negative

  component absoluteValueSubtraction = AbsoluteValueSubtraction(37);
  absoluteValueSubtraction.in[0] <== body1_position_x;
  absoluteValueSubtraction.in[1] <== body2_position_x;
  signal dxAbs <== absoluteValueSubtraction.out; // maxBits: 37

  signal dy <== body2_position_y - body1_position_y; // maxBits: 254 because it can be negative
  component absoluteValueSubtraction2 = AbsoluteValueSubtraction(37);
  absoluteValueSubtraction2.in[0] <== body1_position_y;
  absoluteValueSubtraction2.in[1] <== body2_position_y;
  signal dyAbs <== absoluteValueSubtraction2.out; // maxBits: 37

  // log("dx", dx);
  // log("dy", dy);


  // log("dxAbs", dxAbs);
  // log("dyAbs", dyAbs);

  signal dxs <== dxAbs * dxAbs; // maxBits: 74 = 37 * 2
  // log("dxs", dxs);
  signal dys <== dyAbs * dyAbs; // maxBits: 74 = 37 * 2
  // log("dys", dys);
  signal unboundDistanceSquared <== dxs + dys; // maxBits: 75 = 74 + 1
  // log("unboundDistanceSquared", unboundDistanceSquared);

  component lessThan = LessThan(75); // NOTE: also because unboundDistanceSquared is 75
  // NOTE: max distance should be corner to corner of max grid size
  // max grid is 1000_00000000 which means 1000_00000000 * sqrt(2) = 1414_21356237
  // 1414_21356237**2 is 19,999,999,999,912,458,800,169
  // 19,999,999,999,912,460,800,000 in bits is 76
  // max number using 75 bits is 2**75 - 1 = 75,557,863,725,914,323,419,135
  lessThan.in[0] <== unboundDistanceSquared; // maxBits: 75
  lessThan.in[1] <== minDistanceScaled; // maxBits: 69

  // distanceSquared <== is_below_minimum ? minDistanceScaled : unboundDistanceSquared;
  component myMux = Mux1();
  myMux.c[0] <== unboundDistanceSquared; // maxBits: 75
  myMux.c[1] <== minDistanceScaled; // maxBits: 69
  myMux.s <== lessThan.out;
  signal distanceSquared <== myMux.out; // maxBits: 75

  // NOTE: confirm this is correct
  // NOTE: squre root should require half as many bits as the input
  // TODO: confirm that 2 bit more is enough for the margin of error of distance * 2
  signal distance <-- approxSqrt(distanceSquared); // maxBits: 39 = 75 / 2 + 2
  // log("distance", distance);
  // log("distanceSquared", distanceSquared);
  // bits should be maximum of the vectorLimiter which would be (10 * 10 ** 8) * (10 * 10 ** 8) which is under 60 bits
  component acceptableMarginOfError = AcceptableMarginOfError(78);  // TODO: test the limits of this. 
  acceptableMarginOfError.expected <== distance ** 2; // maxBits: 78 = 39 * 2
  acceptableMarginOfError.actual <== distanceSquared; // maxBits: 75
  // margin of error should be midpoint between squares
  acceptableMarginOfError.marginOfError <== distance * 2; // TODO: confrim if (distance * 2) +1 is needed
  acceptableMarginOfError.out === 1;


 // NOTE: this could be tweaked as a variable for "liveliness" of bodies
  signal bodies_sum_tmp <== (body1_radius + body2_radius) * 4; // maxBits: 34 = 31 + 1 + 2

  // bodies_sum is 0 if either body1_radius or body2_radius is 0
  component isZero = IsZero();
  isZero.in <== body1_radius;

  component myMux2 = Mux1();
  myMux2.c[0] <== bodies_sum_tmp; // maxBits: 34
  myMux2.c[1] <== 0; // maxBits: 0
  myMux2.s <== isZero.out;

  component isZero2 = IsZero();
  isZero2.in <== body2_radius; // maxBits: 31

  component myMux3 = Mux1();
  myMux3.c[0] <== myMux2.out; // maxBits: 34
  myMux3.c[1] <== 0; // maxBits: 0
  myMux3.s <== isZero2.out;
  signal bodies_sum <== myMux3.out; // maxBits: 34

  // log("bodies_sum", bodies_sum);

 // NOTE: this is a result of moving division to end of calculation to preserve precision
  signal distanceSquared_with_avg_denom <== distanceSquared * 2; // maxBits: 76 = 75 + 1
  // log("distanceSquared_with_avg_denom", distanceSquared_with_avg_denom);

   // NOTE: distance should be divided by scaling factor, but we can multiply GScaled by scaling factor instead to prevent division rounding errors
  signal forceMag_numerator <== GScaled * bodies_sum * scalingFactor; // maxBits: 95 = 34 + 34 + 27
  // log("forceMag_numerator", forceMag_numerator);

  signal forceDenom <== distanceSquared_with_avg_denom * distance; // maxBits: 115 = 76 + 39
  // log("forceDenom", forceDenom);

  signal forceXnum <== dxAbs * forceMag_numerator; // maxBits: 132 = 37 + 95
  // log("forceXnum", forceXnum);
  signal forceXunsigned <-- approxDiv(forceXnum, forceDenom); // maxBits: 132 = forceXnum
  // log("forceXunsigned", forceXunsigned);
// NOTE: the following constraints the approxDiv to ensure it's within the acceptable error of margin
  signal approxNumerator1 <== forceXunsigned * forceDenom; // maxBits: 247 = 132 + 115
  component acceptableErrorOfMarginDiv1 = AcceptableMarginOfError(247);
  acceptableErrorOfMarginDiv1.expected <== forceXnum; // maxBits: 132
  acceptableErrorOfMarginDiv1.actual <== approxNumerator1; // maxBits: 247
  acceptableErrorOfMarginDiv1.marginOfError <== forceDenom; // TODO: actually could be further reduced to (realDenom / 2) + 1 but then we're using division again
  acceptableErrorOfMarginDiv1.out === 1;

  // if dxAbs + dx is 0, then forceX should be negative
  component isZero3 = IsZero();
  // NOTE: isZero handles overflow bit values correctly
  isZero3.in <== dxAbs + dx; // maxBits: 255 = max(37, 254) + 1
  // log("isZero3", dxAbs + dx, isZero3.out);
  component myMux4 = Mux1();
  myMux4.c[0] <== forceXunsigned; // maxBits: 132
  myMux4.c[1] <== forceXunsigned * -1; // maxBits: 254
  myMux4.s <== isZero3.out;
  signal forceX <== myMux4.out; // maxBits: 254
  // log("forceX", forceX);

  signal forceYnum <== dyAbs * forceMag_numerator; // maxBits: 132 = 37 + 95
  // log("forceYnum", forceYnum);
  signal forceYunsigned <-- approxDiv(forceYnum, forceDenom); // maxBits: 132 = forceYnum
  // log("forceYunsigned", forceYunsigned);
  // NOTE: the following constraints the approxDiv to ensure it's within the acceptable error of margin
  signal approxNumerator2 <== forceYunsigned * forceDenom; // maxBits: 247 = 132 + 115
  component acceptableErrorOfMarginDiv2 = AcceptableMarginOfError(247);
  acceptableErrorOfMarginDiv2.expected <== forceYnum; // maxBits: 132
  acceptableErrorOfMarginDiv2.actual <== approxNumerator2; // maxBits: 247
  acceptableErrorOfMarginDiv2.marginOfError <== forceDenom; // TODO: actually could be further reduced to (realDenom / 2) + 1 but then we're using division again
  acceptableErrorOfMarginDiv2.out === 1;

  // if dyAbs + dy is 0, then forceY should be negative
  component isZero4 = IsZero();
    // NOTE: isZero handles overflow bit values correctly
  isZero4.in <== dyAbs + dy; // maxBits: 255 = max(37, 254) + 1
  component myMux5 = Mux1();
  myMux5.c[0] <== forceYunsigned; // maxBits: 132
  myMux5.c[1] <== forceYunsigned * -1; // maxBits: 254
  myMux5.s <== isZero4.out;
  signal forceY <== myMux5.out; // maxBits: 254
  // log("forceY", forceY);

  out_forces[0] <== forceX; // maxBits: 254
  out_forces[1] <== forceY; // maxBits: 254
}


/* INPUT = {
    "in_bodies": [ ["82600000000", "4200000000", "-133000000", "-629000000", "10000000000"], ["36300000000", "65800000000", "-332000000", "374000000", "7500000000"] ]
} */