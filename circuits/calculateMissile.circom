pragma circom 2.1.0;

template CalculateMissile() {
  signal input missile[5];
  // [0] = position_x using 10^8 decimals
  // [1] = position_y using 10^8 decimals
  // [2] = vector_x using 10^8 decimals
  // [3] = vector_y using 10^8 decimals
  // [4] = radius using 10^8 decimals
  signal output out_missile[5];

  out_missile[0] <== missile[0] + missile[2];
  out_missile[1] <== missile[1] + missile[3];
  out_missile[2] <== missile[2];
  out_missile[3] <== missile[3];
  out_missile[4] <== missile[4];
}