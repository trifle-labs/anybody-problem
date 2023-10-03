pragma circom 2.1.0;

include "forceAccumulator.circom";

template NFT(totalBodies, steps) {
  signal input bodies[totalBodies][5];
  signal output out_bodies[totalBodies][5];
  
  component forceAccumulator[steps];
  signal tmp_bodies[steps + 1][totalBodies][5]; // TODO: check savings if radius is removed from signal
  tmp_bodies[0] <== bodies;

  for (var i = 0; i < steps; i++) {
    forceAccumulator[i] = ForceAccumulator(totalBodies);
    forceAccumulator[i].bodies <== tmp_bodies[i];
    tmp_bodies[i + 1] <== forceAccumulator[i].out_bodies;
  }
  out_bodies <== tmp_bodies[steps];
}

component main { public [ bodies ]} = NFT(3, 10);