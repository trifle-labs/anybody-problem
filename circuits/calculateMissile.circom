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
  signal output out_missile[5];


  // NOTE: scalingFactorFactor appears in calculateForce, forceAccumulator as well
  var scalingFactorFactor = 8; // maxBits: 4
  var scalingFactor = 10**scalingFactorFactor; // maxBits: 27


  // NOTE: windowWidthScaled appears in forceAccumulator, calculateForce as well and needs to match
  var windowWidth = 1000; // maxBits: 10
  var windowWidthScaled = windowWidth * scalingFactor; // maxBits: 37

  // TODO: confirm the max vector of missiles (may change frequently)
  var maxVector = 10; // maxBits: 4
  var maxVectorScaled = maxVector * scalingFactor; // maxBits: 27
  // log("maxVectorScaled", maxVectorScaled);

  signal new_pos[2];
   // position_x + vector_x
  new_pos[0] <== in_missile[0] + in_missile[2]; // maxBits: 38 = 37 + 1 = windowWidthScaled + 1
   // position_y + vector_y
  new_pos[1] <== in_missile[1] + in_missile[3]; // maxBits: 38 = 37 + 1 = windowWidthScaled + 1

  // position X is only going to increase from 0 to windowWidthScaled
  // it needs to be kept less than windowWidthScaled
  // can return 0 if it exceeds and use this information to remove the missile
  component positionLimiterX = Limiter(37); // TODO: confirm type matches bit limit
  positionLimiterX.in <== new_pos[0] + maxVectorScaled; // maxBits: 39 = max(38, 27) + 1
  positionLimiterX.limit <== windowWidthScaled + maxVectorScaled; // maxBits: 38 = max(37, 27) + 1
  positionLimiterX.rather <== 0;

  // This is for the radius of the missile
  // If it went off screen in the x direction the radius should go to 0
  // if not then we want to use the real radius until it's checked
  // on the y dimension
  component isZeroX = IsZero();
  isZeroX.in <== positionLimiterX.out;
  component muxX = Mux1();
  muxX.c[0] <== in_missile[4];
  muxX.c[1] <== 0;
  muxX.s <== isZeroX.out;

  // Since the plane goes from 0 to windowWidthScaled on the y axis from top to bottom
  // the missile will approach 0 after starting at windowWidthScaled
  // check whether it goes below 0 by using the maxVectorScaled as a buffer
  // return 0 if it is below maxVectorScaled to remove the missile
  // TODO: this assumes a missile removal at less than or equal to 0
  // make sure the JS also is <= 0 and not just < 0 for the missile removal
  // also check the general overboard logic. Would be an edge case but possible.
  component positionLowerLimiterY = LowerLimiter(39); // TODO: confirm type matches bit limit
  positionLowerLimiterY.in <== new_pos[1] + maxVectorScaled; // maxBits: 39 = max(38, 27) + 1
  positionLowerLimiterY.limit <== maxVectorScaled; // maxBits: 27
  positionLowerLimiterY.rather <== 0;

  component isZeroY = IsZero();
  isZeroY.in <== positionLowerLimiterY.out;
  component muxY = Mux1();
  muxY.c[0] <== muxX.out;
  muxY.c[1] <== 0;
  muxY.s <== isZeroY.out;

  out_missile[0] <== new_pos[0]; // maxBits: 38
  out_missile[1] <== new_pos[1]; // maxBits: 38
  out_missile[2] <== in_missile[2];
  out_missile[3] <== in_missile[3];
  out_missile[4] <== muxY.out; // will have the update radius
}