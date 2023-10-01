pragma circom 2.1.0;

include 

template BodyMaker() {
  signal input seed;
  signal output bodies[10][5];


}

component main { public [ seed ]} = BodyMaker();