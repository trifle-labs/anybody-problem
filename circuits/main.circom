pragma circom 2.1.0;

include "bodyMaker.circom";
include "bodyUpdater.circom";

template Main() {
  signal input seed;
  signal input keypress[10000];
  signal input limit;

  component bodyMaker = BodyMaker();
  bodyMaker.seed <== seed;
  signal initial_bodies <== bodyMaker.bodies;

  component bodyUpdater = BodyUpdater();
  bodyUpdater.bodies <== initial_bodies;
  bodyUpdater.keypress <== keypress;
  bodyUpdater.limit <== limit;
  signal updated_bodies <== bodyUpdater.bodies;

  for(i = 0; i < 10; i++) {
    updated_bodies[i][4] === 0;
  }
}

component main { public [ seed, keypress, limit ]} = Main();