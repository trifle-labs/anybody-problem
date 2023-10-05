pragma circom 2.1.6;

include "stepState.circom";

template Main(totalBodies, steps) {
  signal input bodies[totalBodies][5];
  signal input keypress[steps][2]; // each keypress has a missile direction (x,y), need to ignore keypress if missile radius !== 0
  signal input index;

  component stepState = StepState(totalBodies, steps);

}

component main { public [ seed, keypress, limit ]} = Main();