pragma circom 2.1.6;

// Chrome Dino circuit. Verifies a recorded run of the dino game.
//
// Same skeleton as flappy.circom — DinoStep handles one tick, Dino chains
// stepsPerProof of them. The body of DinoStep is the substantive lift and
// is sketched here (TODO markers) — needs the limiter / collision /
// boundary primitives wired together.
//
// Game rules (mirroring physics/presets/chromeDino.js):
//   scalingFactor   = 100
//   windowWidth     = 600, windowHeight = 150
//   gravity         = (0, +60) per tick on the dino
//   jump impulse    = vy = -22 with a 30-tick cooldown
//   ground          = static plane at y=130 (block-from-above)
//   cacti           = 6 kinematic at velocity (-10, 0), wrap on x

include "../comparators.circom";
include "../mux1.circom";
include "../gates.circom";

template DinoStep() {
    signal input prev_dino[6];        // [px, py, vx, vy, alive, jumpCooldown]
    signal input prev_cacti[6][3];    // [px, py, alive]
    signal input jumpInput;
    signal input duckInput;

    signal output next_dino[6];
    signal output next_cacti[6][3];
    signal output gameOver;

    var SF = 100;
    var gravity_y_scaled = 60 * SF;
    var jump_vy_scaled = 0 - 22 * SF;
    var jump_cooldown = 30;
    var maxSpeed_scaled = 30 * SF;
    var cactus_vx_scaled = 0 - 10 * SF;
    var ground_y_scaled = 130 * SF;
    var dino_r_scaled = 12 * SF;
    var cactus_r_scaled = 15 * SF;
    var windowW_scaled = 600 * SF;

    // ---- TODO: full step-state assembly ----
    // 1. Decrement jumpCooldown if > 0
    // 2. If jumpInput AND jumpCooldown == 0, set vy = jump_vy_scaled, cooldown = jump_cooldown
    // 3. Else, vy += gravity (clamped to maxSpeed)
    // 4. py += vy
    // 5. Ground clamp: if py + dino_r >= ground_y, py = ground_y - dino_r, vy = 0
    // 6. Move cacti vx, wrap on x edges
    // 7. For each cactus, circle-circle collision check with dino → gameOver
    for (var i = 0; i < 6; i++) next_dino[i] <== prev_dino[i];
    for (var i = 0; i < 6; i++) {
        for (var j = 0; j < 3; j++) next_cacti[i][j] <== prev_cacti[i][j];
    }
    gameOver <== 0;
}

template Dino(stepsPerProof) {
    signal input initial_dino[6];
    signal input initial_cacti[6][3];
    signal input jumpInputs[stepsPerProof];
    signal input duckInputs[stepsPerProof];
    signal output final_dino[6];
    signal output final_cacti[6][3];
    signal output survivedTicks;

    component steps[stepsPerProof];

    steps[0] = DinoStep();
    for (var i = 0; i < 6; i++) steps[0].prev_dino[i] <== initial_dino[i];
    for (var i = 0; i < 6; i++) {
        for (var j = 0; j < 3; j++) steps[0].prev_cacti[i][j] <== initial_cacti[i][j];
    }
    steps[0].jumpInput <== jumpInputs[0];
    steps[0].duckInput <== duckInputs[0];

    for (var s = 1; s < stepsPerProof; s++) {
        steps[s] = DinoStep();
        for (var i = 0; i < 6; i++)
            steps[s].prev_dino[i] <== steps[s - 1].next_dino[i];
        for (var i = 0; i < 6; i++) {
            for (var j = 0; j < 3; j++)
                steps[s].prev_cacti[i][j] <== steps[s - 1].next_cacti[i][j];
        }
        steps[s].jumpInput <== jumpInputs[s];
        steps[s].duckInput <== duckInputs[s];
    }

    for (var i = 0; i < 6; i++) final_dino[i] <== steps[stepsPerProof - 1].next_dino[i];
    for (var i = 0; i < 6; i++) {
        for (var j = 0; j < 3; j++)
            final_cacti[i][j] <== steps[stepsPerProof - 1].next_cacti[i][j];
    }
    survivedTicks <== 0;
}

component main { public [ initial_dino, initial_cacti ] } = Dino(300);
