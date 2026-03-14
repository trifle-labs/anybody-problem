pragma circom 2.1.6;

include "comparators.circom";
include "mux1.circom";

template DetectCollision(totalBodies) {
  signal input bodies[totalBodies][3]; // only storing x, y and radius as 0, 1, 2
  signal input missile[3]; // only storing x, y and radius as 0, 1, 2
  signal output out_bodies[totalBodies][3]; // only storing x, y and radius as 0, 1, 2
  signal output out_missile[3]; // only storing x, y and radius as 0, 1, 2

  signal tmp_missiles[totalBodies + 1][3]; // only storing x, y and radius as 0, 1, 2
  tmp_missiles[0][0] <== missile[0];
  tmp_missiles[0][1] <== missile[1];
  tmp_missiles[0][2] <== missile[2];

  component isZero[totalBodies];
  component thresholdSquaredMux[totalBodies];
  component lessThan[totalBodies];
  component mux[totalBodies];
  component mux2[totalBodies];

  // Squared-distance collision: dist < threshold  iff  dist² < threshold²
  // dx = bodies[i][0] - missile[0], but as a field element it may be huge when negative.
  // However (a-b)² == (b-a)² in any field, so dx*dx always gives |dx|² correctly.
  // This eliminates GetDistance (2×AbsoluteValueSubtraction + Sqrt), saving ~70 constraints/body.
  signal dx[totalBodies];
  signal dy[totalBodies];
  signal dxSquared[totalBodies]; // maxBits: 40 (maxNum: ~1_000_000_000_000)
  signal dySquared[totalBodies]; // maxBits: 40 (maxNum: ~1_000_000_000_000)
  signal distanceSquared[totalBodies]; // maxBits: 41 (maxNum: ~2_000_000_000_000)
  signal bodyRadiusSquared[totalBodies]; // (maxRadiusScaled)² maxBits: 28 (maxNum: 169_000_000 = (13*scalingFactor)²)

  // loop through all bodies and check distance between missile and body
  for (var i = 0; i < totalBodies; i++) {
    dx[i] <== bodies[i][0] - tmp_missiles[i][0]; // may wrap in field; squaring corrects it
    dy[i] <== bodies[i][1] - tmp_missiles[i][1];
    dxSquared[i] <== dx[i] * dx[i]; // maxBits: 40 (maxNum: 1_000_000_000_000)
    dySquared[i] <== dy[i] * dy[i]; // maxBits: 40 (maxNum: 1_000_000_000_000)
    distanceSquared[i] <== dxSquared[i] + dySquared[i]; // maxBits: 41 (maxNum: 2_000_000_000_000)
    bodyRadiusSquared[i] <== bodies[i][2] * bodies[i][2]; // radius² maxBits: 28 (maxNum: 169_000_000)

    // check whether the radius of the missile is 0, this means there is currently no missile
    isZero[i] = IsZero();
    isZero[i].in <== tmp_missiles[i][2];

    // if there is no missile, set the threshold to 0 so distanceSquared < 0 is always false
    // NOTE: collision threshold is distance < 2*radius, squared: distance² < (2*radius)² = 4*radius²
    thresholdSquaredMux[i] = Mux1();
    thresholdSquaredMux[i].c[0] <== bodyRadiusSquared[i] * 4; // (2*radius)² maxBits: 30 (maxNum: 676_000_000)
    thresholdSquaredMux[i].c[1] <== 0;
    thresholdSquaredMux[i].s <== isZero[i].out;

    // NOTE: this just checks whether the missile is within the radius of the body.
    // the radius of the missile doesn't matter as long as it's not 0.
    lessThan[i] = LessThan(41); // maxBits for distanceSquared: 41
    lessThan[i].in[0] <== distanceSquared[i]; // maxBits: 41 (maxNum: 2_000_000_000_000)
    lessThan[i].in[1] <== thresholdSquaredMux[i].out; // maxBits: 30 (maxNum: 676_000_000)
    mux[i] = Mux1();
    mux[i].c[0] <== bodies[i][2]; // maxBits: 14 = numBits(13 * scalingFactor) (maxNum: 13_000)
    mux[i].c[1] <== 0;
    mux[i].s <== lessThan[i].out;
    out_bodies[i][0] <== bodies[i][0];
    out_bodies[i][1] <== bodies[i][1];
    out_bodies[i][2] <== mux[i].out;

    mux2[i] = Mux1();
    mux2[i].c[0] <== tmp_missiles[i][2];
    mux2[i].c[1] <== 0;
    mux2[i].s <== lessThan[i].out;

    tmp_missiles[i + 1][0] <== missile[0];
    tmp_missiles[i + 1][1] <== missile[1];
    tmp_missiles[i + 1][2] <== mux2[i].out;
  }

  out_missile[0] <== tmp_missiles[totalBodies][0]; // last iteration's x
  out_missile[1] <== tmp_missiles[totalBodies][1]; // last iteration's y
  out_missile[2] <== tmp_missiles[totalBodies][2]; // last iteration's radius
}