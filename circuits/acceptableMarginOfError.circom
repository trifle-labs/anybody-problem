pragma circom 2.1.3;

include "approxMath.circom";

component main { public [ val1, val2, marginOfError ] } = AcceptableMarginOfError(60);