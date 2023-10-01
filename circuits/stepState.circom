pragma circom 2.1.0;

include "forceAccumulator.circom";
include "calculateMissile.circom";
include "detectCollision.circom";

template StepState(n, steps) {
  signal input bodies[n][5];
  signal input missile[5];
  signal output out_missile[5];
  signal output out_bodies[n][5];

  out_bodies <== bodies;

  for (var i = 0; i < steps; i++) {
    component forceAccumulator = ForceAccumulator(n);
    forceAccumulator.bodies <== out_bodies;
    out_bodies <== forceAccumulator.out_bodies;
  }

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