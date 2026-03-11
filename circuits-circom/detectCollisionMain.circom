pragma circom 2.1.6;

include "detectCollision.circom";

component main { public [ bodies, missile ]} = DetectCollision(3);