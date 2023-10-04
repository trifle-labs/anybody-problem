pragma circom 2.1.3;

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

  var scalingFactor = 10**8;
  var GScaled =  100 * scalingFactor; // TODO: these could be constrained, do they need to be?
  // log("GScaled", GScaled);

    var divisionBits = 120; // TODO: test the limits of this. 


  signal input in_bodies[2][5];
  signal output out_forces[2];

  signal minDistanceScaled <== 200 * 200 * scalingFactor * scalingFactor; // NOTE: this is 200**2 so we have to square the scaling factor too
  // log("minDistanceScaled", minDistanceScaled);
  var body1_position_x = in_bodies[0][0];
  // log("body1_position_x", body1_position_x);
  var body1_position_y = in_bodies[0][1];
  // log("body1_position_y", body1_position_y);
  var body1_radius = in_bodies[0][4];

  var body2_position_x = in_bodies[1][0];
  // log("body2_position_x", body2_position_x);
  var body2_position_y = in_bodies[1][1];
  // log("body2_position_y", body2_position_y);
  var body2_radius = in_bodies[1][4];

  signal dx <== body2_position_x - body1_position_x;

  component absoluteValueSubtraction = AbsoluteValueSubtraction(60); // TODO: test limit
  absoluteValueSubtraction.in[0] <== body1_position_x;
  absoluteValueSubtraction.in[1] <== body2_position_x;
  signal dxAbs <== absoluteValueSubtraction.out;

  signal dy <== body2_position_y - body1_position_y;
  component absoluteValueSubtraction2 = AbsoluteValueSubtraction(60); // TODO: test limit
  absoluteValueSubtraction2.in[0] <== body1_position_y;
  absoluteValueSubtraction2.in[1] <== body2_position_y;
  signal dyAbs <== absoluteValueSubtraction2.out;

  // log("dx", dx);
  // log("dy", dy);


  // log("dxAbs", dxAbs);
  // log("dyAbs", dyAbs);

  signal dxs <== dxAbs * dxAbs;
  // log("dxs", dxs);
  signal dys <== dyAbs * dyAbs;
  // log("dys", dys);
  signal unboundDistanceSquared <== dxs + dys;
  // log("unboundDistanceSquared", unboundDistanceSquared);

  component lessThan = LessThan(75); // NOTE: max distance should be corner to corner of max grid size
  // max grid is 1000_00000000 which means 1000_00000000 * sqrt(2) = 1414_21356237
  // 1414_21356237**2 is 19,999,999,999,912,458,800,169
  // 19,999,999,999,912,460,800,000 in bits is 76
  // max number using 75 bits is 2**75 - 1 = 75,557,863,725,914,323,419,135
  lessThan.in[0] <== unboundDistanceSquared;
  lessThan.in[1] <== minDistanceScaled;

  // distanceSquared <== is_below_minimum ? minDistanceScaled : unboundDistanceSquared;
  component myMux = Mux1();
  myMux.c[0] <== unboundDistanceSquared;
  myMux.c[1] <== minDistanceScaled;
  myMux.s <== lessThan.out;
  signal distanceSquared <== myMux.out;

  // NOTE: confirm this is correct
  signal distance <-- approxSqrt(distanceSquared);
  // log("distance", distance);
  // log("distanceSquared", distanceSquared);
  // bits should be maximum of the vectorLimiter which would be (10 * 10 ** 8) * (10 * 10 ** 8) which is under 60 bits
  component acceptableMarginOfError = AcceptableMarginOfError(60);  // TODO: test the limits of this. 
  acceptableMarginOfError.val1 <== distanceSquared;
  acceptableMarginOfError.val2 <== distance ** 2;
  // margin of error should be midpoint between squares
  acceptableMarginOfError.marginOfError <== distance * 2; // TODO: confrim if (distance * 2) +1 is needed
  acceptableMarginOfError.out === 1;


  signal bodies_sum_tmp <== (body1_radius + body2_radius) * 4; // NOTE: this could be tweaked as a variable for "liveliness" of bodies

  // bodies_sum is 0 if either body1_radius or body2_radius is 0
  component isZero = IsZero();
  isZero.in <== body1_radius;

  component myMux2 = Mux1();
  myMux2.c[0] <== bodies_sum_tmp;
  myMux2.c[1] <== 0;
  myMux2.s <== isZero.out;

  component isZero2 = IsZero();
  isZero2.in <== body2_radius;

  component myMux3 = Mux1();
  myMux3.c[0] <== myMux2.out;
  myMux3.c[1] <== 0;
  myMux3.s <== isZero2.out;
  signal bodies_sum <== myMux3.out;

  // log("bodies_sum", bodies_sum);

  signal distanceSquared_with_avg_denom <== distanceSquared * 2; // NOTE: this is a result of moving division to end of calculation to preserve precision
  // log("distanceSquared_with_avg_denom", distanceSquared_with_avg_denom);
  signal forceMag_numerator <== GScaled * bodies_sum * scalingFactor; // NOTE: distance should be divided by scaling factor, but we can multiply GScaled by scaling factor instead to prevent division rounding errors
  // log("forceMag_numerator", forceMag_numerator);

  signal forceDenom <== distanceSquared_with_avg_denom * distance;
  // log("forceDenom", forceDenom);

  signal forceXnum <== dxAbs * forceMag_numerator;
  // log("forceXnum", forceXnum);
  signal forceXunsigned <-- approxDiv(forceXnum, forceDenom);
  // log("forceXunsigned", forceXunsigned);
// NOTE: the following constraints the approxDiv to ensure it's within the acceptable error of margin
  signal approxNumerator1 <== forceXunsigned * forceDenom;
  component acceptableErrorOfMarginDiv1 = AcceptableMarginOfError(divisionBits);  // TODO: test the limits of this. 
  acceptableErrorOfMarginDiv1.val1 <== forceXnum;
  acceptableErrorOfMarginDiv1.val2 <== approxNumerator1;
  acceptableErrorOfMarginDiv1.marginOfError <== forceDenom; // TODO: actually could be further reduced to (realDenom / 2) + 1 but then we're using division again
  acceptableErrorOfMarginDiv1.out === 1;

  component isZero3 = IsZero();
  isZero3.in <== dyAbs + dy;
  component myMux4 = Mux1();
  myMux4.c[0] <== forceXunsigned * -1;
  myMux4.c[1] <== forceXunsigned;
  myMux4.s <== isZero3.out;
  signal forceX <== myMux4.out;
  // log("forceX", forceX);

  signal forceYnum <== dyAbs * forceMag_numerator;
  // log("forceYnum", forceYnum);
  signal forceYunsigned <-- approxDiv(forceYnum, forceDenom);
  // log("forceYunsigned", forceYunsigned);
  // NOTE: the following constraints the approxDiv to ensure it's within the acceptable error of margin
  signal approxNumerator2 <== forceYunsigned * forceDenom;
  component acceptableErrorOfMarginDiv2 = AcceptableMarginOfError(divisionBits);  // TODO: test the limits of this. 
  acceptableErrorOfMarginDiv2.val1 <== forceYnum;
  acceptableErrorOfMarginDiv2.val2 <== approxNumerator2;
  acceptableErrorOfMarginDiv2.marginOfError <== forceDenom; // TODO: actually could be further reduced to (realDenom / 2) + 1 but then we're using division again
  acceptableErrorOfMarginDiv2.out === 1;

  component isZero4 = IsZero();
  isZero4.in <== dxAbs + dx;
  component myMux5 = Mux1();
  myMux5.c[0] <== forceYunsigned * -1;
  myMux5.c[1] <== forceYunsigned ;
  myMux5.s <== isZero4.out;
  signal forceY <== myMux5.out;
  // log("forceY", forceY);

  out_forces[0] <== forceX;
  out_forces[1] <== forceY;
}


/* INPUT = {
    "in_bodies": [ ["82600000000", "4200000000", "-133000000", "-629000000", "10000000000"], ["36300000000", "65800000000", "-332000000", "374000000", "7500000000"] ]
} */