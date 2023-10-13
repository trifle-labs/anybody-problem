pragma circom 2.1.6;

include "getDistance.circom";
include "../node_modules/circomlib/circuits/mux1.circom";

template DetectCollision(totalBodies) {
  signal input bodies[totalBodies][5];
  // log("bodies[0][0]", bodies[0][0]);
  // log("bodies[0][1]", bodies[0][1]);
  // log("-133000000  ", -133000000);
  // log("-1 (p-1)    ", -1);
  // log("bodies[0][2]", bodies[0][2]);
  // log("bodies[0][3]", bodies[0][3]);
  // log("bodies[0][4]", bodies[0][4]);
  signal input missile[5];
  signal output out_bodies[totalBodies][5];
  signal output out_missile[5];


  signal tmp_missiles[totalBodies + 1][3]; // only storing x, y and radius as 0, 1, 2
  tmp_missiles[0][0] <== missile[0];
  tmp_missiles[0][1] <== missile[1];
  tmp_missiles[0][2] <== missile[4];

  component getDistance[totalBodies];
  component isZero[totalBodies];
  component distanceMinMux[totalBodies];
  component lessThan[totalBodies];
  component mux[totalBodies];
  component mux2[totalBodies];
  component mux3[totalBodies];

  // loop through all bodies and get distance between missile and body
  for (var i = 0; i < totalBodies; i++) {
    getDistance[i] = GetDistance(60); // TODO: check bit limit size
    getDistance[i].x1 <== bodies[i][0];
    getDistance[i].y1 <== bodies[i][1];
    getDistance[i].x2 <== tmp_missiles[i][0];
    getDistance[i].y2 <== tmp_missiles[i][1];

    // check whether the radius of the missile is 0, this means there is currently no missile
    isZero[i] = IsZero();
    isZero[i].in <== tmp_missiles[i][2];

    // if there is no missile (isZeroOut == 1), then set distanceMin to 0. Even if they are exact same coordinates the distance will be 0 and 0 < 0 is false
    distanceMinMux[i] = Mux1();
    distanceMinMux[i].c[0] <== bodies[i][4] * 2;
    distanceMinMux[i].c[1] <== 0;
    distanceMinMux[i].s <== isZero[i].out;

    lessThan[i] = LessThan(252); // TODO: check bit limit size
    lessThan[i].in[0] <== getDistance[i].distance;
    lessThan[i].in[1] <== distanceMinMux[i].out;

    mux[i] = Mux1();
    mux[i].c[0] <== bodies[i][4];
    mux[i].c[1] <== 0;
    mux[i].s <== lessThan[i].out;
    out_bodies[i][0] <== bodies[i][0];
    out_bodies[i][1] <== bodies[i][1];
    out_bodies[i][2] <== bodies[i][2];
    out_bodies[i][3] <== bodies[i][3];
    out_bodies[i][4] <== mux[i].out;
    // log("out_bodies[i][0]", out_bodies[i][0]);
    // log("out_bodies[i][1]", out_bodies[i][1]);
    // log("out_bodies[i][2]", out_bodies[i][2]);
    // log("out_bodies[i][3]", out_bodies[i][3]);
    // log("out_bodies[i][4]", out_bodies[i][4]);

    mux2[i] = Mux1();
    mux2[i].c[0] <== tmp_missiles[i][2];
    mux2[i].c[1] <== 0;
    mux2[i].s <== lessThan[i].out;

    tmp_missiles[i + 1][0] <== missile[0];
    tmp_missiles[i + 1][1] <== missile[1];
    tmp_missiles[i + 1][2] <== mux2[i].out;
  }

  out_missile[0] <== tmp_missiles[totalBodies - 1][0]; // last iteration's x
  out_missile[1] <== tmp_missiles[totalBodies - 1][1]; // last iteration's y
  out_missile[2] <== missile[2]; // original x velocity
  out_missile[3] <== missile[3]; // original y velocity
  out_missile[4] <== tmp_missiles[totalBodies - 1][2]; // last iteration's radius
}