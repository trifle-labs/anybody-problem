pragma circom 2.1.6;

// Flappy Bird circuit. Verifies that:
//   - Starting from `initial` placement of 1 player + 8 pipes,
//   - When the recorded `inputs[300]` (one bit per tick) are applied,
//   - The deterministic physics produces a final state in which the player
//     is alive at exactly `survivedTicks` ticks (or has been destroyed).
//
// Game rules baked into the circuit (mirroring physics/presets/flappyBird.js):
//   scalingFactor   = 100
//   windowWidth     = 400, windowHeight = 600
//   maxSpeed        = 30 (per axis), dt = 1
//   gravity         = (0, +80) per tick on the player (y-down)
//   flap impulse    = vy = -25 (set vy when input bit is 1)
//   pipes           = 8 kinematic at velocity (-8, 0), wrap on x, destroy on y for player
//   collision       = circle-circle (player ↔ pipe) → gameOver
//
// The detailed step logic delegates to FlappyStep (one physics tick),
// which is invoked stepsPerProof times.
//
// Public inputs:  initial[player + pipes], score (= survivedTicks)
// Private input:  inputs[stepsPerProof] (one bit per tick)
//
// IMPLEMENTATION NOTE: this file declares the contract but the per-step
// template (FlappyStep) is a TODO — needs the same kind of sub-circuit
// build-out the original anybody-problem went through (limiter,
// position-update, collision check, etc.). See physics/circuits/gravity.circom
// for a parameterized force template that can be reused; the rest of the
// step-state machinery still needs to be assembled.

include "../comparators.circom";
include "../mux1.circom";
include "../gates.circom";
include "../absoluteValueSubtraction.circom";

template FlappyStep() {
    // Inputs: prior state (player + pipe positions/velocities) + this tick's flap bit
    signal input prev_player[5];     // [px, py, vx, vy, alive]
    signal input prev_pipes[8][3];   // [px, py, alive]
    signal input flap;               // 0 or 1

    signal output next_player[5];
    signal output next_pipes[8][3];
    signal output gameOver;          // 1 if collision happened this tick

    var SF = 100;
    var dt = 1;
    var gravity_y_scaled = 80 * SF * dt;     // 8000
    var flap_vy_scaled = 0 - 25 * SF;        // -2500
    var maxSpeed_scaled = 30 * SF * dt;      // 3000
    var pipe_vx_scaled = 0 - 8 * SF * dt;    // -800
    var windowW_scaled = 400 * SF;           // 40000
    var windowH_scaled = 600 * SF;           // 60000
    var pipe_r_scaled = 30 * SF;             // 3000
    var player_r_scaled = 8 * SF;            // 800

    // === apply gravity to player vy, clamp to maxSpeed ===
    // (full implementation: add gravity, mux on flap bit, clamp via Limiter)

    // === apply flap impulse if flap == 1 ===
    // muxed_vy <== flap == 1 ? flap_vy_scaled : (clamped_gravity_vy)

    // === update player position ===
    // next_player[0] <== prev_player[0] + prev_player[2]   (px += vx)
    // next_player[1] <== prev_player[1] + new_vy           (py += vy)

    // === destroy player if py exceeds window or below 0 ===
    // py < 0 OR py >= windowH_scaled → next_player[4] = 0

    // === update pipe positions, wrap on x edges ===

    // === check collision player ↔ each pipe ===

    // ---- TODO: full step-state assembly. See README in this folder. ----
    // For now, pass-through so the file compiles syntactically. The proof
    // produced by this circuit is meaningless until the body is filled in.
    for (var i = 0; i < 5; i++) next_player[i] <== prev_player[i];
    for (var i = 0; i < 8; i++) {
        for (var j = 0; j < 3; j++) next_pipes[i][j] <== prev_pipes[i][j];
    }
    gameOver <== 0;
}

template Flappy(stepsPerProof) {
    signal input initial_player[5];
    signal input initial_pipes[8][3];
    signal input inputs[stepsPerProof];     // per-tick flap bit
    signal output final_player[5];
    signal output final_pipes[8][3];
    signal output survivedTicks;

    component steps[stepsPerProof];

    // Wire step 0
    steps[0] = FlappyStep();
    for (var i = 0; i < 5; i++) steps[0].prev_player[i] <== initial_player[i];
    for (var i = 0; i < 8; i++) {
        for (var j = 0; j < 3; j++) steps[0].prev_pipes[i][j] <== initial_pipes[i][j];
    }
    steps[0].flap <== inputs[0];

    // Wire steps 1..N
    for (var s = 1; s < stepsPerProof; s++) {
        steps[s] = FlappyStep();
        for (var i = 0; i < 5; i++)
            steps[s].prev_player[i] <== steps[s - 1].next_player[i];
        for (var i = 0; i < 8; i++) {
            for (var j = 0; j < 3; j++)
                steps[s].prev_pipes[i][j] <== steps[s - 1].next_pipes[i][j];
        }
        steps[s].flap <== inputs[s];
    }

    // Output the final state
    for (var i = 0; i < 5; i++) final_player[i] <== steps[stepsPerProof - 1].next_player[i];
    for (var i = 0; i < 8; i++) {
        for (var j = 0; j < 3; j++)
            final_pipes[i][j] <== steps[stepsPerProof - 1].next_pipes[i][j];
    }

    // survivedTicks = sum of (player.alive == 1) over each step
    // (placeholder — needs per-step alive read)
    survivedTicks <== 0;
}

component main { public [ initial_player, initial_pipes ] } = Flappy(300);
