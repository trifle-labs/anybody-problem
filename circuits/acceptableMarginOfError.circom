pragma circom 2.1.6;

include "approxMath.circom";

component main { public [ expected, actual, marginOfError ] } = AcceptableMarginOfError(60);