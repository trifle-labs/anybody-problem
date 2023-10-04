pragma circom 2.1.3;

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
    signal input bodies[totalBodies][5];
    signal output out_bodies[totalBodies][5];
    // [0] = position_x using 10^8 decimals
    // [1] = position_y using 10^8 decimals
    // [2] = vector_x using 10^8 decimals
    // [3] = vector_y using 10^8 decimals
    // [4] = radius using 10^8 decimals

    var maxVector = 1000000000; // using 10^8 decimals
    var windowWidth = 100000000000; // using 10^8 decimals

    var accumulated_body_forces[totalBodies][2];

    var totalIterations = totalBodies * (totalBodies - 1) / 2;
    component calculateForceComponent[totalIterations];
    signal force_x[totalIterations];
    signal force_y[totalIterations];

    var ii = 0;
    for (var i = 0; i < totalBodies; i++) {
      // radius of body doesn't change
      out_bodies[i][4] <== bodies[i][4];
      for (var j  = i+1; j < totalBodies; j++) {
        // var ii = i + j - 1;
        // calculate the force between i and j
        calculateForceComponent[ii] = CalculateForce();
        calculateForceComponent[ii].in_bodies[0] <== bodies[i];
        calculateForceComponent[ii].in_bodies[1] <== bodies[j];
        force_x[ii] <== calculateForceComponent[ii].out_forces[0];
        force_y[ii] <== calculateForceComponent[ii].out_forces[1];
        // accumulate the value of the force on body i and body j

        accumulated_body_forces[i][0] = accumulated_body_forces[i][0] + force_x[ii];
        accumulated_body_forces[i][1] = accumulated_body_forces[i][1] + force_y[ii];
        accumulated_body_forces[j][0] = accumulated_body_forces[j][0] + force_x[ii];
        accumulated_body_forces[j][1] = accumulated_body_forces[j][1] + force_y[ii];
        ii = ii + 1;
      }
    }

    signal new_vector_x[totalBodies];
    signal new_vector_y[totalBodies];
    component vectorLimiterX[totalBodies];
    component vectorLimiterY[totalBodies];
    component positionLimiterX[totalBodies];
    component positionLowerLimiterX[totalBodies];
    component positionLimiterY[totalBodies];
    component positionLowerLimiterY[totalBodies];

    for (var i = 0; i < totalBodies; i++) {
      // calculate the new vector for body i
      new_vector_x[i] <== bodies[i][2] + accumulated_body_forces[i][0];
      new_vector_y[i] <== bodies[i][3] + accumulated_body_forces[i][1];

      // limit the magnitude of the vector
      vectorLimiterX[i] = Limiter(252); // TODO: confirm bits limit
      vectorLimiterX[i].in <== new_vector_x[i];
      vectorLimiterX[i].limit <== maxVector; // speedLimit
      vectorLimiterX[i].rather <== maxVector;
      out_bodies[i][2] <== vectorLimiterX[i].out;
      vectorLimiterY[i] = Limiter(252); // TODO: confirm bits limit
      vectorLimiterY[i].in <== new_vector_y[i];
      vectorLimiterY[i].limit <== maxVector; // speedLimit
      vectorLimiterY[i].rather <== maxVector;
      out_bodies[i][3] <== vectorLimiterY[i].out;

      // need to limit position so plane loops off edges
      positionLimiterX[i] = Limiter(37); // NOTE: position is limited to maxWidth + (2*maxVector) which should be under 37 bits
      // positionLimiter.x <== bodies[0][0] + vectorLimiter.limitedX;
      positionLimiterX[i].in <== bodies[i][0] + vectorLimiterX[i].out + maxVector; // NOTE: adding maxVector ensures it is never negative
      positionLimiterX[i].limit <== windowWidth + maxVector; // windowWidth
      positionLimiterX[i].rather <== maxVector;
      // NOTE: maxVector is still included, needs to be removed at end of calculation
      positionLowerLimiterX[i] = LowerLimiter(37); // NOTE: position is limited to maxWidth + (2*maxVector) which should be under 37 bits
      positionLowerLimiterX[i].in <== positionLimiterX[i].out;
      positionLowerLimiterX[i].limit <== maxVector;
      positionLowerLimiterX[i].rather <== windowWidth + maxVector;
      out_bodies[i][0] <== positionLowerLimiterX[i].out - maxVector;

      positionLimiterY[i] = Limiter(37);  // NOTE: position is limited to maxWidth + (2*maxVector) which should be under 37 bits
      positionLimiterY[i].in <== bodies[i][1] + vectorLimiterY[i].out + maxVector; // NOTE: adding maxVector ensures it is never negative
      positionLimiterY[i].limit <== windowWidth + maxVector; // windowWidth
      positionLimiterY[i].rather <== maxVector;
      // NOTE: maxVector is still included, needs to be removed at end of calculation
      positionLowerLimiterY[i] = LowerLimiter(37); // NOTE: position is limited to maxWidth + (2*maxVector) which should be under 37 bits
      positionLowerLimiterY[i].in <== positionLimiterY[i].out;
      positionLowerLimiterY[i].limit <== maxVector;
      positionLowerLimiterY[i].rather <== windowWidth + maxVector;
      out_bodies[i][1] <== positionLowerLimiterY[i].out - maxVector;
    }
}


/* INPUT = {
    "bodies": [
      ["22600000000", "4200000000", "-133000000", "-629000000", "10000000000"],
      ["36300000000", "65800000000", "-332000000", "374000000", "7500000000"],
      ["67900000000", "50000000000", "229000000", "252000000", "5000000000"] ]
} */