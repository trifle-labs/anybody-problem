pragma circom 2.1.6;

include "approxMath.circom";

component main { public [ val1, val2, marginOfError ] } = AcceptableMarginOfError(60);