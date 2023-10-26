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
  
  var tmp_body[totalBodies][5] = bodies;
  var tmp_missile[5] = missiles[0];

  component mux[steps];
  component isZero[steps];

  for (var i = 0; i < steps; i++) {
    // log("tmp_body[0][0]", tmp_body[0][0]);
    // log("tmp_body[0][1]", tmp_body[0][1]);
    // log("tmp_body[0][2]", tmp_body[0][2]);
    // log("tmp_body[0][3]", tmp_body[0][3]);
    // log("tmp_body[0][4]", tmp_body[0][4]);

    forceAccumulator[i] = ForceAccumulator(totalBodies);
    forceAccumulator[i].bodies <== tmp_body;
    // TODO: check whether constraints can be reduced by only calculating position since 
    // velocity is constant
    calculateMissile[i] = CalculateMissile();
    calculateMissile[i].in_missile <== tmp_missile;

    // TODO: Ask WEI whether it's possible to skip this calculation if the radius is 0, 
    // meaning there is no missile (or at least reduce the constraints needed?)
    detectCollision[i] = DetectCollision(totalBodies);
    detectCollision[i].missile[0] <== calculateMissile[i].out_missile[0]; // x
    detectCollision[i].missile[1] <== calculateMissile[i].out_missile[1]; // y
    detectCollision[i].missile[2] <== calculateMissile[i].out_missile[4]; // radius
    for  (var j = 0; j < totalBodies; j++) {
      detectCollision[i].bodies[j][0] <== forceAccumulator[i].out_bodies[j][0]; // x
      detectCollision[i].bodies[j][1] <== forceAccumulator[i].out_bodies[j][1]; // y
      detectCollision[i].bodies[j][2] <== forceAccumulator[i].out_bodies[j][4]; // radius
    }

    // Some bodies may have lost radius due to collision, so we need to update the bodies
    // TODO: check whether it's possible to reduce constraint by removing velocity here
    // tmp_bodies[i + 1] <== detectCollision[i].out_bodies;
    for (var j = 0; j < totalBodies; j++) {
      tmp_body[j][0] = detectCollision[i].out_bodies[j][0];
      tmp_body[j][1] = detectCollision[i].out_bodies[j][1];
      tmp_body[j][2] = forceAccumulator[i].out_bodies[j][2];
      tmp_body[j][3] = forceAccumulator[i].out_bodies[j][3];
      tmp_body[j][4] = detectCollision[i].out_bodies[j][2];
    }

    // NOTE: Check whether the missile radius is now 0 meaning that it has collided with a
    // body
    isZero[i] = IsZero();
    isZero[i].in <== detectCollision[i].out_missile[2];

    // NOTE: If the missile has collided with a body or gone off screen, then the next 
    // missile should come from the missiles input instead of the current missile.
    // This implies that some of the missiles will get skipped from the missiles array.
    // That's OK tho because you shouldn't be allowed to shoot more than 1 missile at a 
    // time. Any missiles added before the previous one is destroyed are ignored in the
    // game as well.
    // TODO: check whether it's possible to reduce constraints by removing velocity here
    mux[i] = MultiMux1(5);

    mux[i].c[0][0] <== detectCollision[i].out_missile[0];
    mux[i].c[0][1] <== missiles[i + 1][0];

    mux[i].c[1][0] <== detectCollision[i].out_missile[1];
    mux[i].c[1][1] <== missiles[i + 1][1];

    mux[i].c[2][0] <== missiles[i][2];
    mux[i].c[2][1] <== missiles[i + 1][2];

    mux[i].c[3][0] <== missiles[i][3];
    mux[i].c[3][1] <== missiles[i + 1][3];

    mux[i].c[4][0] <== detectCollision[i].out_missile[2];
    mux[i].c[4][1] <== missiles[i + 1][4];
    mux[i].s <== isZero[i].out;

    tmp_missile[0] = mux[i].out[0];
    tmp_missile[1] = mux[i].out[1];
    tmp_missile[2] = mux[i].out[2];
    tmp_missile[3] = mux[i].out[3];
    tmp_missile[4] = mux[i].out[4];

  }
  out_bodies <== tmp_body;
}