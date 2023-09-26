pragma circom 2.1.0;

include "approxMath.circom";

component main { public [ val1, val2, marginOfError ] } = AcceptableErrorOfMargin(60);