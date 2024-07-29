pragma circom 2.1.6;


/*
Notes on CalculateMissile()

This function calculates the movement of one missile using the following inputs:
  in_missile[0] = position_x using 10^8 decimals
  in_missile[1] = position_y using 10^8 decimals
  in_missile[2] = vector_x using 10^8 decimals
  in_missile[3] = vector_y using 10^8 decimals
  in_missile[4] = radius using 10^8 decimals

The calculation is a simple addition of the x vector with the x position and the 
y vector with the y position.

The missile is shot from position (0, windowWidthScaled) and x vector is always positive
and y vector is always negative. If the missile reaches the edge of the screen it
will either be in the X direction at windowWidthScaled or in the Y direction at 0.

If the missile reaches the edge of the screen in either direction it will be removed 
and the radius is reduced to 0.

*/

template CalculateMissile() {
  signal input in_missile[5];
  // log("in_missile[0]", in_missile[0]);
  // log("in_missile[1]", in_missile[1]);
  // log("in_missile[2]", in_missile[2]);
  // log("in_missile[3]", in_missile[3]);
  // log("in_missile[4]", in_missile[4]);
  signal output out_missile[5];


  // NOTE: scalingFactorFactor appears in calculateForce, forceAccumulator as well
  var scalingFactorFactor = 3; // maxBits: 2
  var scalingFactor = 10**scalingFactorFactor; // maxBits: 10 (maxNum: 1_000)


  // NOTE: windowWidthScaled appears in forceAccumulator, calculateForce as well and needs to match
  var windowWidth = 1000; // maxBits: 10
  var windowWidthScaled = windowWidth * scalingFactor; // maxBits: 20 (maxNum: 1_000_000)

  var time = 2;
  var maxMissileVector = time * 15; // maxBits: 5
  var maxMissileVectorScaled = maxMissileVector * scalingFactor; // maxBits: 15 (maxNum: 30_000)
  // log("maxMissileVectorScaled", maxMissileVectorScaled);

  signal new_pos[2];
   // position_x + vector_x
  new_pos[0] <== in_missile[0] + in_missile[2]; // maxBits: 20 (maxNum: 1_030_000)
   // position_y + vector_y
  new_pos[1] <== in_missile[1] + in_missile[3]; // maxBits: 20 (maxNum: 1_030_000)

  // log("new_pos[0]", new_pos[0]);
  // log("new_pos[1]", new_pos[1]);
  // position X is only going to increase from 0 to windowWidthScaled
  // it needs to be kept less than windowWidthScaled
  // can return 0 if it exceeds and use this information to remove the missile
  // log("positionLimiterX in", new_pos[0] + maxMissileVectorScaled);
  // log("positionLimiterX limit", windowWidthScaled + maxMissileVectorScaled);
  component calcMissilePositionLimiterX = Limiter(20);
  calcMissilePositionLimiterX.in <== new_pos[0] + maxMissileVectorScaled; // maxBits: 20 (maxNum: 1_030_000)
  calcMissilePositionLimiterX.limit <== windowWidthScaled + maxMissileVectorScaled; // maxBits: 20 (maxNum: 1_030_000)
  calcMissilePositionLimiterX.rather <== 0;
  // log("positionLimiterX out", calcMissilePositionLimiterX.out);

  // This is for the radius of the missile
  // If it went off screen in the x direction the radius should go to 0
  // if not then we want to use the real radius until it's checked
  // on the y dimension
  component calcMissileIsZeroX = IsZero();
  calcMissileIsZeroX.in <== calcMissilePositionLimiterX.out;
  component muxXDecidesRadius = Mux1();
  muxXDecidesRadius.c[0] <== in_missile[4];
  muxXDecidesRadius.c[1] <== 0;
  muxXDecidesRadius.s <== calcMissileIsZeroX.out;

  // Since the plane goes from 0 to windowWidthScaled on the y axis from top to bottom
  // the missile will approach 0 after starting at windowWidthScaled
  // check whether it goes below 0 by using the maxMissileVectorScaled as a buffer
  // return 0 if it is below maxMissileVectorScaled to remove the missile
  // TODO: this assumes a missile removal at less than or equal to 0
  // make sure the JS also is <= 0 and not just < 0 for the missile removal

  // log("new_pos[1]", new_pos[1]);
  // log("positionLowerLimiterY in", new_pos[1]);
  // log("positionLowerLimiterY limit", maxMissileVectorScaled);
  // also check the general overboard logic. Would be an edge case but possible.
  component positionLowerLimiterY = LowerLimiter(20); // TODO: confirm type matches bit limit
  positionLowerLimiterY.in <== new_pos[1]; // maxBits: 20 (maxNum: 1_030_000)
  positionLowerLimiterY.limit <== maxMissileVectorScaled; // maxBits: 15 (maxNum: 30_000)
  positionLowerLimiterY.rather <== 0;
  // log("positionLowerLimiterY out", positionLowerLimiterY.out);

  component isZeroY = IsZero();
  isZeroY.in <== positionLowerLimiterY.out;
  component muxY = Mux1();
  muxY.c[0] <== muxXDecidesRadius.out;
  muxY.c[1] <== 0;
  muxY.s <== isZeroY.out;

  out_missile[0] <== new_pos[0] - maxMissileVectorScaled; // maxBits: 20 (maxNum: 1_000_000)
  out_missile[1] <== new_pos[1] - maxMissileVectorScaled; // maxBits: 20 (maxNum: 1_000_000)
  out_missile[2] <== in_missile[2]; // maxBits: 15 (maxNum: 30_000)
  out_missile[3] <== in_missile[3]; // maxBits: 15 (maxNum: 30_000)
  out_missile[4] <== muxY.out;

  // log("out_missile[0]", out_missile[0]);
  // log("out_missile[1]", out_missile[1]);
  // log("out_missile[2]", out_missile[2]);
  // log("out_missile[3]", out_missile[3]);
  // log("out_missile[4]", out_missile[4]);
}