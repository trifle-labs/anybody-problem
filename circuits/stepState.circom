pragma circom 2.1.3;

include "forceAccumulator.circom";
include "calculateMissile.circom";
include "detectCollision.circom";
include "../node_modules/circomlib/circuits/mux1.circom";
include "../node_modules/circomlib/circuits/comparators.circom";

template StepState(totalBodies, steps) {
  signal input bodies[totalBodies][5];
  signal input missile[steps + 1][5];

  signal output out_bodies[totalBodies][5];

  component forceAccumulator[steps];
  component calculateMissile[steps];
  component detectCollision[steps];
  signal tmp_bodies[steps + 1][totalBodies][5];
  tmp_bodies[0] <== bodies;
  

  signal tmp_missile[steps + 1][5];
  tmp_missile[0] <== missile[0];

  component mux[steps];
  component isZero[steps];

  for (var i = 0; i < steps; i++) {
    forceAccumulator[i] = ForceAccumulator(totalBodies);
    forceAccumulator[i].bodies <== tmp_bodies[i];

    calculateMissile[i] = CalculateMissile();
    calculateMissile[i].missile <== tmp_missile[i];

    detectCollision[i] = DetectCollision(totalBodies);
    detectCollision[i].bodies <== forceAccumulator[i].out_bodies;
    detectCollision[i].missile <== calculateMissile[i].out_missile;

    tmp_bodies[i + 1] <== detectCollision[i].out_bodies;

    isZero[i] = IsZero();
    isZero[i].in <== detectCollision[i].out_missile[4];

    log("detectCollision[i].out_missile", detectCollision[i].out_missile[0]);
    // mux[i] = Mux1();
    // mux[i].c[0] <== detectCollision[i].out_missile; // detectCollision.out_missile = x[5];
    // mux[i].c[1] <== missile[i + 1]; // missile[i + 1] = x[5]
    // mux[i].s <== isZero[i].out;

    tmp_missile[i + 1] <== missile[i + 1];//mux[i].out; // tmp_missile[i] = x[5];
  }
  out_bodies <== tmp_bodies[steps - 1];
}