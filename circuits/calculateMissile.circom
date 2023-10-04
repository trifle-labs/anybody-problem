pragma circom 2.1.3;


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

The missile is shot from position (0, windowWidth) and x vector is always positive
and y vector is always negative. If the missile reaches the edge of the screen it
will either be in the X direction at windowWidth or in the Y direction at 0.

If the missile reaches the edge of the screen in either direction it will be removed 
and the radius is reduced to 0.

*/

template CalculateMissile() {
  signal input in_missile[5];

  signal output out_missile[5];

  // TODO: confirm the max vector of missiles (may change frequently)
  var maxVector = 1000000000; // using 10^8 decimals
  log("maxVector", maxVector);
  // NOTE: windowWidth appears in forceAccumulator as well and needs to match
  var windowWidth = 100000000000; // using 10^8 decimals

  signal new_pos[2];
  new_pos[0] <== in_missile[0] + in_missile[2]; // position_x + vector_x
  new_pos[1] <== in_missile[1] + in_missile[3]; // position_y + vector_y

  // position X is only going to increase from 0 to windowWidth
  // it needs to be kept less than windowWidth
  // can return 0 if it exceeds and use this information to remove the missile
  component positionLimiterX = Limiter(37); // TODO: confirm type matches bit limit
  positionLimiterX.in <== new_pos[0] + maxVector;
  positionLimiterX.limit <== windowWidth + maxVector;
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

  // Since the plane goes from 0 to windowWidth on the y axis from top to bottom
  // the missile will approach 0 after starting at windowWidth
  // check whether it goes below 0 by using the maxVector as a buffer
  // return 0 if it is below maxVector to remove the missile
  // TODO: this assumes a missile removal at less than or equal to 0
  // make sure the JS also is <= 0 and not just < 0 for the missile removal
  // also check the general overboard logic. Would be an edge case but possible.
  component positionLowerLimiterY = LowerLimiter(37); // TODO: confirm type matches bit limit
  positionLowerLimiterY.in <== new_pos[1] + maxVector;
  positionLowerLimiterY.limit <== maxVector;
  positionLowerLimiterY.rather <== 0;

  component isZeroY = IsZero();
  isZeroY.in <== positionLowerLimiterY.out;
  component muxY = Mux1();
  muxY.c[0] <== muxX.out;
  muxY.c[1] <== 0;
  muxY.s <== isZeroY.out;

  out_missile[0] <== new_pos[0]; // position_x + vector_x
  out_missile[1] <== new_pos[1]; // position_y + vector_y
  out_missile[2] <== in_missile[2];
  out_missile[3] <== in_missile[3];
  out_missile[4] <== muxY.out; // will have the update radius
}