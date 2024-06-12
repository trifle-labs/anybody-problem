pragma circom 2.1.1;

include "forceAccumulator.circom";
include "calculateMissile.circom";
include "detectCollision.circom";
include "../node_modules/circomlib/circuits/mux1.circom";
include "../node_modules/circomlib/circuits/comparators.circom";
include "../node_modules/circomlib/circuits/gates.circom";

template StepState(totalBodies, steps) {
  signal input address;
  signal input bodies[totalBodies][5];
  signal input missiles[steps + 1][3]; // just vx, vy, radius (which is 0 or 1 essentially)
  signal input inflightMissile[5];
  signal output outflightMissile[5];

  // ensure that inflight missile is same as first missile.
  // if inflight missile is not 0, then first missile is allowed to start at a non-corner position.
  // this offers no security at the circuit level but allows the smart contract to enforce
  // when inflightMissile is allowed to be non-zero.
  missiles[0][0] === inflightMissile[2];
  missiles[0][1] === inflightMissile[3];
  missiles[0][2] === inflightMissile[4];

  var tmp_missile[5];

    // NOTE: scalingFactorFactor appears in getDistance, forceAccumulator, calculateMissile, calculateForce as well
  var scalingFactorFactor = 3; // maxBits: 2
  var scalingFactor = 10**scalingFactorFactor; // maxBits: 10 (maxNum: 1_000)
    // NOTE: windowWidth appears in calculateForce, calculateMissile, forceAccumulator as well and needs to match
  var windowWidth = 1000; // maxBits: 10
  var windowWidthScaled = windowWidth * scalingFactor; // maxBits: 20 (maxNum: 1_000_000)

  // NOTE: if there's an inflight missile, then the starting position should match
  // If there is not an inflight missile, then the starting position should be the corner
  component whatShouldStartingMissilePositionBe = MultiMux1(2);
  whatShouldStartingMissilePositionBe.c[0][0] <== inflightMissile[0];
  whatShouldStartingMissilePositionBe.c[0][1] <== 0;

  whatShouldStartingMissilePositionBe.c[1][0] <==  inflightMissile[1];
  whatShouldStartingMissilePositionBe.c[1][1] <== windowWidthScaled;
  component isMissileZero = IsZero();
  isMissileZero.in <== inflightMissile[4];

  whatShouldStartingMissilePositionBe.s <== isMissileZero.out; // If inflight missile radius == 0, then starting position should equal corner

  tmp_missile[0] = whatShouldStartingMissilePositionBe.out[0];
  tmp_missile[1] = whatShouldStartingMissilePositionBe.out[1];
  tmp_missile[2] = inflightMissile[2];
  tmp_missile[3] = inflightMissile[3];
  tmp_missile[4] = inflightMissile[4];


  signal preventReplay <== address * address;

  signal output out_bodies[totalBodies][5];
  var time_tmp = 0;
  signal output time;

  component forceAccumulator[steps];
  component calculateMissile[steps];
  component detectCollision[steps];
  
  var tmp_body[totalBodies][5] = bodies;

  component mux[steps];
  component isZero[steps];

  component isZeroStep[steps][totalBodies];
  component isZeroDone[steps];

  component andMissiles[steps];

  for (var i = 0; i < steps; i++) {
    // for (var j = 0; j < totalBodies; j++) {
    //   log("step", i);
    //   log("body", j);
    //   log("tmp_body[j][0]", tmp_body[j][0]);
    //   log("tmp_body[j][1]", tmp_body[j][1]);
    //   log("tmp_body[j][2]", tmp_body[j][2]);
    //   log("tmp_body[j][3]", tmp_body[j][3]);
    //   log("tmp_body[j][4]", tmp_body[j][4]);
    // }

    forceAccumulator[i] = ForceAccumulator(totalBodies);
    forceAccumulator[i].bodies <== tmp_body;
    // TODO: check whether constraints can be reduced by only calculating position since 
    // velocity is constant
    calculateMissile[i] = CalculateMissile();
    calculateMissile[i].in_missile <== tmp_missile;


    // TODO: Ask WEI whether it's possible to skip this calculation if the radius is 0, 
    // meaning there is no missile (or at least reduce the constraints needed?)
    detectCollision[i] = DetectCollision(totalBodies);
    detectCollision[i].missile[0] <== calculateMissile[i].out_missile[0]; // x
    detectCollision[i].missile[1] <== calculateMissile[i].out_missile[1]; // y
    detectCollision[i].missile[2] <== calculateMissile[i].out_missile[4]; // radius
    for  (var j = 0; j < totalBodies; j++) {
      detectCollision[i].bodies[j][0] <== forceAccumulator[i].out_bodies[j][0]; // x
      detectCollision[i].bodies[j][1] <== forceAccumulator[i].out_bodies[j][1]; // y
      detectCollision[i].bodies[j][2] <== forceAccumulator[i].out_bodies[j][4]; // radius
    }


    // Some bodies may have lost radius due to collision, so we need to update the bodies
    // TODO: check whether it's possible to reduce constraint by removing velocity here
    // tmp_bodies[i + 1] <== detectCollision[i].out_bodies;
    // ALSO check whether each radius == 0, if so then the totalRadius of all of them is 0
    for (var j = 0; j < totalBodies; j++) {
      tmp_body[j][0] = detectCollision[i].out_bodies[j][0]; // x
      tmp_body[j][1] = detectCollision[i].out_bodies[j][1]; // y
      tmp_body[j][2] = forceAccumulator[i].out_bodies[j][2]; // xv
      tmp_body[j][3] = forceAccumulator[i].out_bodies[j][3]; // yv
      tmp_body[j][4] = detectCollision[i].out_bodies[j][2]; // radius
    }

    var totalRadius = 0;
    // j = 1 if the first body needs to stay protected
    for (var j = 1; j < totalBodies; j++) {
      isZeroStep[i][j] = IsZero();
      isZeroStep[i][j].in <== detectCollision[i].out_bodies[j][2]; // radius
      totalRadius = totalRadius + isZeroStep[i][j].out;
    }
    // log("totalRadius", totalRadius);
    // If the total Radius of all the bodies is 0, begin counting how many steps.
    // This time_tmp will be the number of seconds since the game ended and can be 
    // subgracted from total time to understand how long the game lasted.
    isZeroDone[i] = IsZero();
    isZeroDone[i].in <== totalBodies - 1 - totalRadius;
    time_tmp = time_tmp + isZeroDone[i].out;
    // log("time_tmp", time_tmp);

    // NOTE: Check whether the missile radius is now 0 meaning that it has collided with a
    // body
    isZero[i] = IsZero();
    isZero[i].in <== detectCollision[i].out_missile[2];

    // NOTE: If the missile has collided with a body or gone off screen, then the next 
    // missile should come from the missiles input instead of the current missile.
    // This implies that some of the missiles will get skipped from the missiles array.
    // That's OK tho because you shouldn't be allowed to shoot more than 1 missile at a 
    // time. Any missiles added before the previous one is destroyed are ignored in the
    // game as well.
    // TODO: check whether it's possible to reduce constraints by removing velocity here
    mux[i] = MultiMux1(5);

    // NOTE: new missiles are hardcoded to start in x,y of the corner
    mux[i].c[0][0] <== detectCollision[i].out_missile[0];
    mux[i].c[0][1] <== 0; //missiles[i + 1][0];

    mux[i].c[1][0] <== detectCollision[i].out_missile[1];
    mux[i].c[1][1] <== windowWidthScaled; //missiles[i + 1][1];

    mux[i].c[2][0] <== calculateMissile[i].out_missile[2]; 
    mux[i].c[2][1] <== missiles[i + 1][0];

    mux[i].c[3][0] <== calculateMissile[i].out_missile[3]; 
    mux[i].c[3][1] <== missiles[i + 1][1];

    mux[i].c[4][0] <== detectCollision[i].out_missile[2];
    mux[i].c[4][1] <== missiles[i + 1][2];
    mux[i].s <== isZero[i].out;
    // log("if this is 1, then current missile is done (radius == 0)", isZero[i].out, 
    // 0, 
    // windowWidthScaled,
    // missiles[i + 1][0],
    // missiles[i + 1][1],
    // missiles[i + 1][2]
    // );
    // log("if this is 0, then current missile is continued (radius !== 0)", isZero[i].out, 
    // detectCollision[i].out_missile[0], 
    // detectCollision[i].out_missile[1], 
    // calculateMissile[i].out_missile[2], 
    // calculateMissile[i].out_missile[3], 
    // detectCollision[i].out_missile[2]
    // );

    tmp_missile[0] = mux[i].out[0];
    tmp_missile[1] = mux[i].out[1];
    tmp_missile[2] = mux[i].out[2];
    tmp_missile[3] = mux[i].out[3];
    tmp_missile[4] = mux[i].out[4];

  }
  time <== steps - time_tmp;
  out_bodies <== tmp_body;
  outflightMissile <== tmp_missile;

  // log("time", time);
  // for (var j = 0; j < totalBodies; j++) {
  //   log("final tmp_body[j][0]", tmp_body[j][0]);
  //   log("final tmp_body[j][1]", tmp_body[j][1]);
  //   log("final tmp_body[j][2]", tmp_body[j][2]);
  //   log("final tmp_body[j][3]", tmp_body[j][3]);
  //   log("final tmp_body[j][4]", tmp_body[j][4]);
  // }
  // log("outflightMissile[0]", outflightMissile[0]);
  // log("outflightMissile[1]", outflightMissile[1]);
  // log("outflightMissile[2]", outflightMissile[2]);
  // log("outflightMissile[3]", outflightMissile[3]);
  // log("outflightMissile[4]", outflightMissile[4]);

}