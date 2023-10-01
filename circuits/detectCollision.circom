pragme circom 2.1.0

include "getDistance.circom";

template DetectCollision(n) {
  signal input bodies[n][5];
  signal input missile[5];
  signal output out_bodies[n][5];
  signal output out_missile[5];

  var veryLargeNumberOffOfGrid = (1000 * 10**8) * 10;

  out_missile === missile;

  // loop through all bodies and get distance between missile and body
  for (var i = 0; i < n; i++) {
    component getDistance = GetDistance(60); // TODO: check bit limit size
    getDistance.x1 <== bodies[i][0];
    getDistance.y1 <== bodies[i][1];
    getDistance.x2 <== out_missile[0];
    getDistance.y2 <== out_missile[1];
    signal distance <== getDistance.distance;

    // check whether the radius of the missile is 0, this means there is currently no missile
    component isZero = IsZero();
    isZero.in <== out_missile[4];
    signal isZeroOut <== isZero.out;

    // if there is no missile (isZeroOut == 1), then set distanceMin to 0 so that collision will only occur if missile and body are at exact same position
    component distanceMinMux = Mux1;
    distanceMinMux.in[0] <== bodies[i][4] + out_missile[4]; // TODO: confirm this is the same as p5
    distanceMinMux.in[1] <== 0;
    distanceMinMux.sel <== isZeroOut;
    signal distanceMin <== distanceMinMux.out;

    component lessThan <== LessThan(252); // TODO: check bit limit size
    lessThan.a <== distance;
    lessThan.b <== distanceMin;
    signal hit <== lessThan.out;

    component mux = Mux1;
    mux.in[0] <== bodies[i][4];
    mux.in[1] <== 0;
    mux.sel <== hit;
    out_bodies[i][4] <== mux.out;

    component mux2 = Mux1;
    mux2.in[0] <== out_missile[4];
    mux2.in[1] <== 0;
    mux2.sel <== hit;
    out_missile[4] <== mux2.out;

    componsnet mux3 = Mux1;
    mux3.in[0] <== missile[0];
    mux3.in[1] <== veryLargeNumberOffOfGrid;
  }

}