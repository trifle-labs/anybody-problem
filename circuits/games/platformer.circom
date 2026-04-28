pragma circom 2.1.6;

// Platformer circuit (1 player + 4 enemies + 8 static platforms).
//
// Substantially more involved than flappy/dino because:
//   - Two dynamic kinds (player + enemy), gravity + drag on both
//   - Three input kinds (left, right, jump with cooldown)
//   - Collision matrix has 3 entries (player-enemy gameOver, player-platform
//     block, enemy-platform block)
//
// Same skeleton: PlatformerStep handles one tick, Platformer chains them.

include "../comparators.circom";
include "../mux1.circom";
include "../gates.circom";

template PlatformerStep() {
    signal input prev_player[6];        // [px, py, vx, vy, alive, jumpCooldown]
    signal input prev_enemies[4][5];    // [px, py, vx, vy, alive]
    signal input platforms[8][3];       // [px, py, r]   (static — pass through unchanged)
    signal input leftInput;
    signal input rightInput;
    signal input jumpInput;

    signal output next_player[6];
    signal output next_enemies[4][5];
    signal output gameOver;

    var SF = 100;
    var gravity_y_scaled = 50 * SF;
    var drag_num = 500;             // 0.05 * 10000
    var drag_denom = 10000;
    var move_speed_scaled = 15 * SF;
    var jump_vy_scaled = 0 - 30 * SF;
    var jump_cooldown = 20;
    var maxSpeed_scaled = 25 * SF;
    var player_r_scaled = 16 * SF;
    var enemy_r_scaled = 14 * SF;
    var windowW_scaled = 800 * SF;
    var windowH_scaled = 600 * SF;

    // ---- TODO: full step-state assembly ----
    // 1. If leftInput, vx = -move_speed; if rightInput, vx = +move_speed (else apply drag)
    // 2. If jumpInput AND cooldown == 0, vy = jump_vy, cooldown = jump_cooldown
    // 3. vy += gravity, clamp to maxSpeed
    // 4. px += vx, py += vy
    // 5. Window clamp on x and y
    // 6. For each platform, check player-platform collision → block
    // 7. Apply gravity + drag-free integration to enemies
    // 8. For each platform, check enemy-platform collision → block
    // 9. For each enemy, check player-enemy collision → gameOver
    for (var i = 0; i < 6; i++) next_player[i] <== prev_player[i];
    for (var i = 0; i < 4; i++) {
        for (var j = 0; j < 5; j++) next_enemies[i][j] <== prev_enemies[i][j];
    }
    gameOver <== 0;
}

template Platformer(stepsPerProof) {
    signal input initial_player[6];
    signal input initial_enemies[4][5];
    signal input platforms[8][3];
    signal input leftInputs[stepsPerProof];
    signal input rightInputs[stepsPerProof];
    signal input jumpInputs[stepsPerProof];
    signal output final_player[6];
    signal output final_enemies[4][5];
    signal output enemiesAlive;

    component steps[stepsPerProof];

    steps[0] = PlatformerStep();
    for (var i = 0; i < 6; i++) steps[0].prev_player[i] <== initial_player[i];
    for (var i = 0; i < 4; i++) {
        for (var j = 0; j < 5; j++) steps[0].prev_enemies[i][j] <== initial_enemies[i][j];
    }
    for (var i = 0; i < 8; i++) {
        for (var j = 0; j < 3; j++) steps[0].platforms[i][j] <== platforms[i][j];
    }
    steps[0].leftInput <== leftInputs[0];
    steps[0].rightInput <== rightInputs[0];
    steps[0].jumpInput <== jumpInputs[0];

    for (var s = 1; s < stepsPerProof; s++) {
        steps[s] = PlatformerStep();
        for (var i = 0; i < 6; i++)
            steps[s].prev_player[i] <== steps[s - 1].next_player[i];
        for (var i = 0; i < 4; i++) {
            for (var j = 0; j < 5; j++)
                steps[s].prev_enemies[i][j] <== steps[s - 1].next_enemies[i][j];
        }
        for (var i = 0; i < 8; i++) {
            for (var j = 0; j < 3; j++) steps[s].platforms[i][j] <== platforms[i][j];
        }
        steps[s].leftInput <== leftInputs[s];
        steps[s].rightInput <== rightInputs[s];
        steps[s].jumpInput <== jumpInputs[s];
    }

    for (var i = 0; i < 6; i++) final_player[i] <== steps[stepsPerProof - 1].next_player[i];
    for (var i = 0; i < 4; i++) {
        for (var j = 0; j < 5; j++)
            final_enemies[i][j] <== steps[stepsPerProof - 1].next_enemies[i][j];
    }
    enemiesAlive <== 0;
}

component main { public [ initial_player, initial_enemies, platforms ] } = Platformer(240);
