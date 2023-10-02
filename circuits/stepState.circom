pragma circom 2.1.0;

include "forceAccumulator.circom";
include "calculateMissile.circom";
include "detectCollision.circom";

template StepState(n, steps) {
  signal input bodies[n][5];
  signal input missile[5];
  signal output out_missile[5];
  signal output out_bodies[n][5];

  component forceAccumulator[steps];
  var tmp_bodies[n][5] = bodies;

  for (var i = 0; i < steps; i++) {
    forceAccumulator[i] = ForceAccumulator(n);
    forceAccumulator[i].bodies <== tmp_bodies;
    tmp_bodies = forceAccumulator[i].out_bodies;
  }
  out_bodies <== tmp_bodies;

  component calculateMissile = CalculateMissile();
  calculateMissile.missile <== missile;
  out_missile <== calculateMissile.out_missile;

  component detectCollision = DetectCollision(n);
  detectCollision.bodies <== out_bodies;
  detectCollision.missile <== out_missile;
  out_bodies <== detectCollision.out_bodies;
  out_missile <== detectCollision.out_missile;

}

component main { public [ bodies ]} = StepState(3, 1000);