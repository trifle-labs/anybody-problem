pragma circom 2.1.6;

include "limiter.circom";
include "calculateForce.circom";
include "helpers.circom";

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

template ForceAccumulator(totalBodies) { // max 10 = maxBits: 4
    signal input bodies[totalBodies][7];
    signal output out_bodies[totalBodies][7];
    // [0] = position_x       | maxBits: 37 = windowWidthScaled
    // [1] = position_y       | maxBits: 37 = windowWidthScaled
    // [[2],[3]] = vector_x   | maxBits: 133= 2 * maxVectorScaled = 1 + 132
    // [[4],[5]] = vector_y   | maxBits: 133 = 2 * maxVectorScaled = 1 + 132
    // [6] = radius           | maxBits: 31 = numBits(13 * scalingFactor)

    // NOTE: scalingFactorFactor appears in calculateMissile, calculateForce as well
    var scalingFactorFactor = 8; // maxBits: 4
    var scalingFactor = 10**scalingFactorFactor; // maxBits: 27

    var maxVector = 10; // maxBits: 4
    var maxVectorScaled = 10 * scalingFactor; // maxBits: 31

    // NOTE: windowWidth appears in calculateMissile, calculateForce, forceAccumulator as well and needs to match
    var windowWidth = 1000; // maxBits: 10
    var windowWidthScaled = windowWidth * scalingFactor; // maxBits: 37


    var totalIterations = totalBodies * (totalBodies - 1) / 2; // maxBits: 7
    component calculateForceComponent[totalIterations];
    signal force_x[totalIterations][2]; // maxBits: 132
    signal force_y[totalIterations][2]; // maxBits: 132
    signal accumulated_body_forces[totalIterations + 1][totalBodies][2];
    component mux[totalIterations * 2];

    var ii = 0;
    for (var i = 0; i < totalBodies; i++) {
      // radius of body doesn't change
      out_bodies[i][6] <== getMass(bodies[i]);
      for (var j  = i+1; j < totalBodies; j++) {
        // var ii = i + j - 1;
        // calculate the force between i and j
        calculateForceComponent[ii] = CalculateForce();
        calculateForceComponent[ii].in_bodies[0] <== bodies[i];
        calculateForceComponent[ii].in_bodies[1] <== bodies[j];
        force_x[ii] <== calculateForceComponent[ii].out_forces[0]; // maxBits: 132
        force_y[ii] <== calculateForceComponent[ii].out_forces[1]; // maxBits: 132
        // accumulate the value of the force on body i and body j
        // log("j", j, "force_x[ii]", force_x[ii]);

        mux[ii] = MultiMux1(2);
        mux[ii].c[0][0] <== accumulated_body_forces[ii][i][0] + force_x[ii][1];
        mux[ii].c[0][1] <== accumulated_body_forces[ii][i][0] - force_x[ii][1];
        mux[ii].c[1][0] <== accumulated_body_forces[ii][j][0] - force_x[ii][1];
        mux[ii].c[1][1] <== accumulated_body_forces[ii][j][0] + force_x[ii][1];
        mux[ii].s <== force_x[ii][0];
        accumulated_body_forces[ii + 1][i][0] <== mux[ii].out[0];
        accumulated_body_forces[ii + 1][j][0] <== mux[ii].out[1];

        mux[totalIterations + ii] = MultiMux1(2);
        mux[ii].c[0][0] <== accumulated_body_forces[ii][i][1] + force_y[ii][1];
        mux[ii].c[0][1] <== accumulated_body_forces[ii][i][1] - force_y[ii][1];
        mux[ii].c[1][0] <== accumulated_body_forces[ii][j][1] - force_y[ii][1];
        mux[ii].c[1][1] <== accumulated_body_forces[ii][j][1] + force_y[ii][1];
        mux[ii].s <== force_y[ii][0];
        accumulated_body_forces[ii + 1][i][1] <== mux[ii].out[0];
        accumulated_body_forces[ii + 1][j][1] <== mux[ii].out[1];

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
      // log(i, "accumulated_body_forces[i][0]", accumulated_body_forces[i][0]);
      // log(i, "new_vector_x[i][2]", new_vector_x[i]);

      // limit the magnitude of the vector
      vectorLimiterX[i] = Limiter(252); // TODO: confirm bits limit
      vectorLimiterX[i].in <== new_vector_x[i];
      vectorLimiterX[i].limit <== maxVectorScaled; // speedLimit
      vectorLimiterX[i].rather <== maxVectorScaled;
      out_bodies[i][2] <== vectorLimiterX[i].out;
      vectorLimiterY[i] = Limiter(252); // TODO: confirm bits limit
      vectorLimiterY[i].in <== new_vector_y[i];
      vectorLimiterY[i].limit <== maxVectorScaled; // speedLimit
      vectorLimiterY[i].rather <== maxVectorScaled;
      out_bodies[i][3] <== vectorLimiterY[i].out;

      // need to limit position so plane loops off edges
      positionLimiterX[i] = Limiter(37); // NOTE: position is limited to maxWidth + (2*maxVectorScaled) which should be under 37 bits
      // positionLimiter.x <== bodies[0][0] + vectorLimiter.limitedX;
      positionLimiterX[i].in <== bodies[i][0] + vectorLimiterX[i].out + maxVectorScaled; // NOTE: adding maxVectorScaled ensures it is never negative
      positionLimiterX[i].limit <== windowWidthScaled + maxVectorScaled; // windowWidthScaled
      positionLimiterX[i].rather <== maxVectorScaled;
      // NOTE: maxVectorScaled is still included, needs to be removed at end of calculation
      positionLowerLimiterX[i] = LowerLimiter(37); // NOTE: position is limited to maxWidth + (2*maxVectorScaled) which should be under 37 bits
      positionLowerLimiterX[i].in <== positionLimiterX[i].out;
      positionLowerLimiterX[i].limit <== maxVectorScaled;
      positionLowerLimiterX[i].rather <== windowWidthScaled + maxVectorScaled;
      out_bodies[i][0] <== positionLowerLimiterX[i].out - maxVectorScaled;

      positionLimiterY[i] = Limiter(37);  // NOTE: position is limited to maxWidth + (2*maxVectorScaled) which should be under 37 bits
      positionLimiterY[i].in <== bodies[i][1] + vectorLimiterY[i].out + maxVectorScaled; // NOTE: adding maxVectorScaled ensures it is never negative
      positionLimiterY[i].limit <== windowWidthScaled + maxVectorScaled; // windowWidthScaled
      positionLimiterY[i].rather <== maxVectorScaled;
      // NOTE: maxVectorScaled is still included, needs to be removed at end of calculation
      positionLowerLimiterY[i] = LowerLimiter(37); // NOTE: position is limited to maxWidth + (2*maxVectorScaled) which should be under 37 bits
      positionLowerLimiterY[i].in <== positionLimiterY[i].out;
      positionLowerLimiterY[i].limit <== maxVectorScaled;
      positionLowerLimiterY[i].rather <== windowWidthScaled + maxVectorScaled;
      out_bodies[i][1] <== positionLowerLimiterY[i].out - maxVectorScaled;
      // log(i, "out_bodies[i][2]", out_bodies[i][2]);
    }
    // log("out_bodies[0][0]", out_bodies[0][0]);
    // log("out_bodies[0][1]", out_bodies[0][1]);
    // log("out_bodies[0][2]", out_bodies[0][2]);
    // log("out_bodies[0][3]", out_bodies[0][3]);
    // log("out_bodies[0][4]", out_bodies[0][4]);
    // log("out_bodies[1][0]", out_bodies[1][0]);
    // log("out_bodies[1][1]", out_bodies[1][1]);
    // log("out_bodies[1][2]", out_bodies[1][2]);
    // log("out_bodies[1][3]", out_bodies[1][3]);
    // log("out_bodies[1][4]", out_bodies[1][4]);
    // log("out_bodies[2][0]", out_bodies[2][0]);
    // log("out_bodies[2][1]", out_bodies[2][1]);
    // log("out_bodies[2][2]", out_bodies[2][2]);
    // log("out_bodies[2][3]", out_bodies[2][3]);
    // log("out_bodies[2][4]", out_bodies[2][4]);

}


/* INPUT = {
    "bodies": [
      ["22600000000", "4200000000", "-133000000", "-629000000", "10000000000"],
      ["36300000000", "65800000000", "-332000000", "374000000", "7500000000"],
      ["67900000000", "50000000000", "229000000", "252000000", "5000000000"] ]
} */