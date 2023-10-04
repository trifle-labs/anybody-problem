pragma circom 2.1.3;

include "detectCollision.circom";

component main { public [ bodies, missile ]} = DetectCollision(3);