pragma circom 2.1.6;

include "getDistance.circom";
include "../node_modules/circomlib/circuits/mux1.circom";

template DetectCollision(totalBodies) {
  signal input bodies[totalBodies][3]; // only storing x, y and radius as 0, 1, 2
  signal input missile[3]; // only storing x, y and radius as 0, 1, 2
  signal output out_bodies[totalBodies][3]; // only storing x, y and radius as 0, 1, 2
  signal output out_missile[3]; // only storing x, y and radius as 0, 1, 2

  signal tmp_missiles[totalBodies + 1][3]; // only storing x, y and radius as 0, 1, 2
  tmp_missiles[0][0] <== missile[0];
  tmp_missiles[0][1] <== missile[1];
  tmp_missiles[0][2] <== missile[2];

  component getDistance[totalBodies];
  component isZero[totalBodies];
  component distanceMinMux[totalBodies];
  component lessThan[totalBodies];
  component mux[totalBodies];
  component mux2[totalBodies];
  component mux3[totalBodies];

  // loop through all bodies and get distance between missile and body
  for (var i = 0; i < totalBodies; i++) {
  //  log("body x1", bodies[i][0]);
  //  log("body y1", bodies[i][1]);
  //  log("missile x2", tmp_missiles[i][0]);
  //  log("missile y2", tmp_missiles[i][1]);
    getDistance[i] = GetDistance(20); // n = 20 but inside GetDistance n = 2 * n + 1 and returns maxBits 21
    getDistance[i].x1 <== bodies[i][0]; // maxBits: 20 (maxNum: 1_000_000) = windowWidthScaled
    getDistance[i].y1 <== bodies[i][1]; // maxBits: 20 (maxNum: 1_000_000) = windowWidthScaled
    getDistance[i].x2 <== tmp_missiles[i][0]; // maxBits: 20 (maxNum: 1_000_000) = windowWidthScaled
    getDistance[i].y2 <== tmp_missiles[i][1]; // maxBits: 20 (maxNum: 1_000_000) = windowWidthScaled

    // check whether the radius of the missile is 0, this means there is currently no missile
    isZero[i] = IsZero();
    isZero[i].in <== tmp_missiles[i][2];

    // if there is no missile (isZeroOut == 1), then set distanceMin to 0. Even if they are exact same coordinates the distance will be 0 and 0 < 0 is false
    distanceMinMux[i] = Mux1();
    // NOTE: distance is 2 x radius
    distanceMinMux[i].c[0] <== bodies[i][2] * 2; // maxBits: 15 = numBits(2 * 13 * scalingFactor) (maxNum: 26_000)
    distanceMinMux[i].c[1] <== 0;
    distanceMinMux[i].s <== isZero[i].out;

    // NOTE: this just checks whether the missile is within the radius of the body.
    // the radius of the missile doesn't matter as long as it's not 0.
    lessThan[i] = LessThan(21);
    lessThan[i].in[0] <== getDistance[i].distance; // maxBits: 21 (maxNum: 1_414_214) = approxSqrt(distanceSquared) = approxSqrt(2_000_000_000_000)
    lessThan[i].in[1] <== distanceMinMux[i].out; // maxBits: 15 (maxNum: 26_000)
    // log("distance is ", getDistance[i].distance);
    // log("max distance is ", distanceMinMux[i].out);
    // log("lessThan[i].out", lessThan[i].out);
    mux[i] = Mux1();
    mux[i].c[0] <== bodies[i][2]; // maxBits: 14 = numBits(13 * scalingFactor) (maxNum: 13_000)
    mux[i].c[1] <== 0;
    mux[i].s <== lessThan[i].out;
    // log("output radius, mux[i].out", mux[i].out);
    out_bodies[i][0] <== bodies[i][0];
    out_bodies[i][1] <== bodies[i][1];
    out_bodies[i][2] <== mux[i].out;
    // log("out_bodies[i][0]", out_bodies[i][0]);
    // log("out_bodies[i][1]", out_bodies[i][1]);
    // log("out_bodies[i][2]", out_bodies[i][2]);


    // what is the purpose here?
    // less than refers to the distance
    // if lessThan is true (1) (missile hit), then the output should be 0
    // if lessThan is false (0) (missile missed), then the output should be the previous radius of the missile
    // log("tmp_missiles[i][2];", tmp_missiles[i][2]);
    mux2[i] = Mux1();
    mux2[i].c[0] <== tmp_missiles[i][2];
    mux2[i].c[1] <== 0;
    mux2[i].s <== lessThan[i].out;
    // log("mux2[i].out", mux2[i].out);

    tmp_missiles[i + 1][0] <== missile[0];
    tmp_missiles[i + 1][1] <== missile[1];
    tmp_missiles[i + 1][2] <== mux2[i].out;
  }

  out_missile[0] <== tmp_missiles[totalBodies][0]; // last iteration's x
  out_missile[1] <== tmp_missiles[totalBodies][1]; // last iteration's y
  out_missile[2] <== tmp_missiles[totalBodies][2]; // last iteration's radius
}