pragma circom 2.1.0;

include "limiter.circom";
include "calculateForce.circom";

// TODO:
// √ confirm why circom interprets negative input differently than p-n (https://github.com/0xPARC/zkrepl/issues/11)
// √ go through and make sure approximate square root is working ok
// √ go through and make sure that decimals of 10^8 are properly accounted for in exponential equations
// √ change js implementation to use square root approx function
// analyze risk here: initial thought is that valid proofs can be generated for slight variations of position. seems acceptable.
// use inverse square root instead of division
// √ make change input array variable of n
// √ make change in body variable of n
  // make sure max n is used to bound the number of bits
// generate and test prover for step of 1
// configure as recursive proof, generate and test prover for step of n
// define "types" for all the values and make sure they're within the acceptable ranges attached to those types.
  // This will help us restrict bits needed for each type
  // maybe can streamline the square root and division

template ForceAccumulator(totalBodies) {
    // signal totalBodies <== 3;
    // var totalBodies = 3;
    signal input bodies[3][5];
    signal output new_bodies[3][5];
    // [0] = position_x using 10^8 decimals
    // [1] = position_y using 10^8 decimals
    // [2] = vector_x using 10^8 decimals
    // [3] = vector_y using 10^8 decimals
    // [4] = radius using 10^8 decimals

    var maxVector = 1000000000; // using 10^8 decimals
    var windowWidth = 100000000000; // using 10^8 decimals

    signal accumulated_body_forces[3][2];

    for (var i = 0; i < totalBodies; i++) {
      // radius of body doesn't change
      new_bodies[i][4] <== bodies[i][4];
      for (var j  = i+1; j < totalBodies; j++) {
        // calculate the force between i and j
        component calculateForceComponent = CalculateForce();
        calculateForceComponent.in_bodies[0] <== bodies[i];
        calculateForceComponent.in_bodies[1] <== bodies[j];
        signal force_x <== calculateForceComponent.out_forces[0];
        signal force_y <== calculateForceComponent.out_forces[1];
        // accumulate the value of the force on body i and body j

        accumulated_body_forces[i][0] += force_x;
        accumulated_body_forces[i][1] += force_y;
        accumulated_body_forces[j][0] += force_x;
        accumulated_body_forces[j][1] += force_y;
      }
    }

    for (var i = 0; i < totalBodies; i++) {
      // calculate the new vector for body i
      signal new_vector_x <== bodies[i][2] + accumulated_body_forces[i][0];
      signal new_vector_y <== bodies[i][3] + accumulated_body_forces[i][1];

      // limit the magnitude of the vector
      component vectorLimiterX = Limiter(252); // TODO: confirm bits limit
      vectorLimiterX.in <== new_vector_x;
      vectorLimiterX.limit <== maxVector; // speedLimit
      vectorLimiterX.rather <== maxVector;
      new_bodies[i][2] <== vectorLimiterX.out;
      component vectorLimiterY = Limiter(252); // TODO: confirm bits limit
      vectorLimiterY.in <== new_vector_y;
      vectorLimiterY.limit <== maxVector; // speedLimit
      vectorLimiterY.rather <== maxVector;
      new_bodies[i][3] <== vectorLimiterY.out;

      // need to limit position so plane loops off edges
      component positionLimiterX = Limiter(37); // NOTE: position is limited to maxWidth + (2*maxVector) which should be under 37 bits
      // positionLimiter.x <== bodies[0][0] + vectorLimiter.limitedX;
      positionLimiterX.in <== bodies[i][0] + vectorLimiterX.out + maxVector; // NOTE: adding maxVector ensures it is never negative
      positionLimiterX.limit <== windowWidth + maxVector; // windowWidth
      positionLimiterX.rather <== maxVector;
      // NOTE: maxVector is still included, needs to be removed at end of calculation
      component positionLowerLimiterX = LowerLimiter(37); // NOTE: position is limited to maxWidth + (2*maxVector) which should be under 37 bits
      positionLowerLimiterX.in <== positionLimiterX.out;
      positionLowerLimiterX.limit <== maxVector;
      positionLowerLimiterX.rather <== windowWidth + maxVector;
      new_bodies[i][0] <== positionLowerLimiterX.out - maxVector;

      component positionLimiterY = Limiter(37);  // NOTE: position is limited to maxWidth + (2*maxVector) which should be under 37 bits
      positionLimiterY.in <== bodies[i][1] + vectorLimiterY.out + maxVector; // NOTE: adding maxVector ensures it is never negative
      positionLimiterY.limit <== windowWidth + maxVector; // windowWidth
      positionLimiterY.rather <== maxVector;
      // NOTE: maxVector is still included, needs to be removed at end of calculation
      component positionLowerLimiterY = LowerLimiter(37); // NOTE: position is limited to maxWidth + (2*maxVector) which should be under 37 bits
      positionLowerLimiterY.in <== positionLimiterY.out;
      positionLowerLimiterY.limit <== maxVector;
      positionLowerLimiterY.rather <== windowWidth + maxVector;
      new_bodies[i][1] <== positionLowerLimiterY.out - maxVector;
    }
}

component main { public [ bodies ]} = ForceAccumulator(3);

/* INPUT = {
    "bodies": [
      ["22600000000", "4200000000", "-133000000", "-629000000", "10000000000"],
      ["36300000000", "65800000000", "-332000000", "374000000", "7500000000"],
      ["67900000000", "50000000000", "229000000", "252000000", "5000000000"] ]
} */