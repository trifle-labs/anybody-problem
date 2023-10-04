pragma circom 2.1.1;

include "forceAccumulator.circom";
include "calculateMissile.circom";
include "detectCollision.circom";
include "../node_modules/circomlib/circuits/mux1.circom";
include "../node_modules/circomlib/circuits/comparators.circom";

template StepState(totalBodies, steps) {
  signal input bodies[totalBodies][5];
  signal input missiles[steps + 1][5];

  signal output out_bodies[totalBodies][5];

  component forceAccumulator[steps];
  component calculateMissile[steps];
  component detectCollision[steps];
  signal tmp_bodies[steps + 1][totalBodies][5];
  tmp_bodies[0] <== bodies;
  

  signal tmp_missile[steps + 1][5];
  tmp_missile[0] <== missiles[0];

  component mux[steps];
  component isZero[steps];

  for (var i = 0; i < steps; i++) {
    forceAccumulator[i] = ForceAccumulator(totalBodies);
    forceAccumulator[i].bodies <== tmp_bodies[i];

    // TODO: check whether constraints can be reduced by only calculating position since 
    // velocity is constant
    calculateMissile[i] = CalculateMissile();
    calculateMissile[i].in_missile <== tmp_missile[i];

    // TODO: Ask WEI whether it's possible to skip this calculation if the radius is 0, 
    // meaning there is no missile (or at least reduce the constraints needed?)
    detectCollision[i] = DetectCollision(totalBodies);
    detectCollision[i].bodies <== forceAccumulator[i].out_bodies;
    detectCollision[i].missile <== calculateMissile[i].out_missile;

    // Some bodies may have lost radius due to collision, so we need to update the bodies
    // TODO: check whether it's possible to reduce constraint by removing velocity here
    tmp_bodies[i + 1] <== detectCollision[i].out_bodies;

    // NOTE: Check whether the missile radius is now 0 meaning that it has collided with a
    // body
    isZero[i] = IsZero();
    isZero[i].in <== detectCollision[i].out_missile[4];

    // NOTE: If the missile has collided with a body or gone off screen, then the next 
    // missile should come from the missiles input instead of the current missile.
    // This implies that some of the missiles will get skipped from the missiles array.
    // That's OK tho because you shouldn't be allowed to shoot more than 1 missile at a 
    // time. Any missiles added before the previous one is destroyed are ignored in the
    // game as well.
    // TODO: check whether it's possible to reduce constraints by removing velocity here
    mux[i] = MultiMux1(5);
    for (var j = 0; j < 5; j++) {
      mux[i].c[j][0] <== detectCollision[i].out_missile[j];
      mux[i].c[j][1] <== missiles[i + 1][j];
    }
    mux[i].s <== isZero[i].out;

    for (var j = 0; j < 5; j++) {
      tmp_missile[i + 1][j] <== mux[i].out[j];
    }
  }
  out_bodies <== tmp_bodies[steps - 1];
}