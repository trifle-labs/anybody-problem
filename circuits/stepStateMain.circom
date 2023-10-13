pragma circom 2.1.6;

include "stepState.circom";

component main { public [ bodies, missiles ]} = StepState(3, 10);