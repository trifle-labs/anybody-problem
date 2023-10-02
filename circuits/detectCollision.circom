pragma circom 2.1.0;

include "getDistance.circom";
include "../node_modules/circomlib/circuits/mux1.circom";

template DetectCollision(n) {
  signal input bodies[n][5];
  signal input missile[5];
  signal output out_bodies[n][5];
  signal output out_missile[5];

  var veryLargeNumberOffOfGrid = (1000 * 10**8) * 10;

  out_missile === missile;

  component getDistance[n];
  component isZero[n];
  component distanceMinMux[n];
  component lessThan[n];
  component mux[n];
  component mux2[n];
  component mux3[n];

  // loop through all bodies and get distance between missile and body
  for (var i = 0; i < n; i++) {
    getDistance[i] = GetDistance(60); // TODO: check bit limit size
    getDistance[i].x1 <== bodies[i][0];
    getDistance[i].y1 <== bodies[i][1];
    getDistance[i].x2 <== out_missile[0];
    getDistance[i].y2 <== out_missile[1];

    // check whether the radius of the missile is 0, this means there is currently no missile
    isZero[i] = IsZero();
    isZero[i].in <== out_missile[4];

    // if there is no missile (isZeroOut == 1), then set distanceMin to 0 so that collision will only occur if missile and body are at exact same position
    distanceMinMux[i] = Mux1();
    distanceMinMux[i].in[0] <== bodies[i][4] + out_missile[4]; // TODO: confirm this is the same as p5
    distanceMinMux[i].in[1] <== 0;
    distanceMinMux[i].sel <== isZero[i].out;

    lessThan[i] = LessThan(252); // TODO: check bit limit size
    lessThan[i].a <== getDistance[i].distance;
    lessThan[i].b <== distanceMinMux[i].out;

    mux[i] = Mux1();
    mux[i].in[0] <== bodies[i][4];
    mux[i].in[1] <== 0;
    mux[i].sel <== lessThan[i].out;
    out_bodies[i][4] <== mux[i].out;

    mux2[i] = Mux1();
    mux2[i].in[0] <== out_missile[4];
    mux2[i].in[1] <== 0;
    mux2[i].sel <== lessThan[i].out;
    out_missile[4] <== mux2[i].out;

    mux3[i] = Mux1();
    mux3[i].in[0] <== missile[0];
    mux3[i].in[1] <== veryLargeNumberOffOfGrid;
  }

}