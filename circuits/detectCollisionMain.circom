pragma circom 2.1.0;

include "detectCollision.circom";

component main { public [ bodies, missile ]} = DetectCollision(3);