pragma circom 2.1.0;
include "../node_modules/circomlib/circuits/mux1.circom";
include "../node_modules/circomlib/circuits/comparators.circom";

template AbsoluteValueSubtraction (n) {
    signal input in[2];
    signal output out;

    // p = 21888242871839275222246405745257275088548364400416034343698204186575808495617;
    // p_minus_one = 21888242871839275222246405745257275088548364400416034343698204186575808495616;
    // most_positive_number = 10944121435919637611123202872628637544274182200208017171849102093287904247808;

    component lessThan = LessThan(n); // TODO: test limits of squares
    lessThan.in[0] <== in[0];
    lessThan.in[1] <== in[1];
    signal lessThanResult <== lessThan.out;

    component myMux = Mux1();
    myMux.c[0] <== in[0];
    myMux.c[1] <== in[1];
    myMux.s <== lessThanResult;
    signal greaterValue <== myMux.out;

    component isZero = IsZero();
    isZero.in <== greaterValue - in[0];

    component myMux2 = Mux1();
    myMux2.c[0] <== in[0];
    myMux2.c[1] <== in[1];
    myMux2.s <== isZero.out;
    signal lesserValue <== myMux2.out;

    out <== greaterValue - lesserValue;
}

// component main { public [ in ] } = AbsoluteValueSubtraction(252);


/* INPUT = {
    "in": ["-100","-10"]
} */

