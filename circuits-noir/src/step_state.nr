use crate::force_accumulator::force_accumulator;
use crate::calculate_missile::calculate_missile;
use crate::detect_collision::detect_collision;
use crate::types::WINDOW_WIDTH_SCALED;

/// Result of running the step state simulation
pub struct StepStateResult<let N: u32> {
    pub out_bodies: [[u64; 5]; N],
    pub out_missile: [u64; 5],
    pub time: u64,
}

/// Run the n-body physics simulation for a given number of steps.
///
/// N: number of bodies (compile-time constant)
/// STEPS: number of simulation steps (compile-time constant)
///
/// address: player address (for replay prevention)
/// bodies: initial body states [x, y, vx, vy, radius]
/// missiles: per-step missile inputs [vx, vy, radius] (STEPS + 1 entries)
/// inflight_missile: the currently active missile [x, y, vx, vy, radius]
///
/// Returns: final body states, final missile state, and time taken
pub fn step_state<let N: u32, let STEPS: u32, let MISSILES_LEN: u32>(
    address: Field,
    bodies: [[u64; 5]; N],
    missiles: [[u64; 3]; MISSILES_LEN],
    inflight_missile: [u64; 5],
) -> StepStateResult<N> {
    // Replay prevention (matches Circom: preventReplay <== address * address)
    let _prevent_replay = address * address;

    // Ensure inflight missile matches first missile entry
    assert(missiles[0][0] == inflight_missile[2]); // vx
    assert(missiles[0][1] == inflight_missile[3]); // vy
    assert(missiles[0][2] == inflight_missile[4]); // radius

    // Determine starting missile position
    // If inflight missile radius == 0, start from corner (0, windowWidthScaled)
    // Otherwise use inflight missile's position
    let mut current_missile: [u64; 5] = if inflight_missile[4] == 0 {
        [0, WINDOW_WIDTH_SCALED, inflight_missile[2], inflight_missile[3], inflight_missile[4]]
    } else {
        inflight_missile
    };

    let mut current_bodies: [[u64; 5]; N] = bodies;
    let mut time_remaining: u64 = 0;

    for i in 0..STEPS {
        // 1. Apply gravitational forces to all bodies
        let force_result = force_accumulator(current_bodies);

        // 2. Update missile position
        let missile_result = calculate_missile(current_missile);

        // 3. Detect collisions between missile and bodies
        // Build collision input: [x, y, radius] for each body (from force result)
        let mut collision_bodies: [[u64; 3]; N] = [[0; 3]; N];
        for j in 0..N {
            collision_bodies[j][0] = force_result[j][0]; // x
            collision_bodies[j][1] = force_result[j][1]; // y
            collision_bodies[j][2] = force_result[j][4]; // radius
        }

        let collision_missile: [u64; 3] = [
            missile_result[0], // x
            missile_result[1], // y
            missile_result[4], // radius
        ];

        let (collision_out_bodies, collision_out_missile) =
            detect_collision(collision_bodies, collision_missile);

        // 4. Update bodies: position and radius from collision, velocity from force
        for j in 0..N {
            current_bodies[j][0] = collision_out_bodies[j][0]; // x
            current_bodies[j][1] = collision_out_bodies[j][1]; // y
            current_bodies[j][2] = force_result[j][2]; // vx (from force, not collision)
            current_bodies[j][3] = force_result[j][3]; // vy (from force, not collision)
            current_bodies[j][4] = collision_out_bodies[j][2]; // radius (from collision)
        }

        // 5. Check if all target bodies are destroyed (skip body 0 which is protected)
        let mut total_destroyed: u64 = 0;
        for j in 1..N {
            if current_bodies[j][4] == 0 {
                total_destroyed += 1;
            }
        }
        // If all non-protected bodies destroyed, start counting remaining time
        if total_destroyed == (N as u64 - 1) {
            time_remaining += 1;
        }

        // 6. Handle missile lifecycle
        // If missile radius is now 0 (hit body or went off-screen), load next missile
        if collision_out_missile[2] == 0 {
            // New missile starts from corner
            current_missile = [
                0,
                WINDOW_WIDTH_SCALED,
                missiles[i + 1][0], // vx
                missiles[i + 1][1], // vy
                missiles[i + 1][2], // radius
            ];
        } else {
            // Continue with current missile
            current_missile = [
                collision_out_missile[0], // x (from collision)
                collision_out_missile[1], // y (from collision)
                missile_result[2],        // vx (preserved from calculate_missile)
                missile_result[3],        // vy (preserved from calculate_missile)
                collision_out_missile[2], // radius (from collision)
            ];
        }
    }

    let time = STEPS as u64 - time_remaining;

    StepStateResult {
        out_bodies: current_bodies,
        out_missile: current_missile,
        time,
    }
}
