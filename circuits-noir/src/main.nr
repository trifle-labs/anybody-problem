mod approx_math;
mod types;
mod get_distance;
mod calculate_force;
mod force_accumulator;
mod calculate_missile;
mod detect_collision;
mod step_state;
mod nft;
mod test_approx_math;
mod test_get_distance;
mod test_limiter;
mod test_calculate_force;
mod test_force_accumulator;
mod test_detect_collision;
mod test_calculate_missile;
mod test_step_state;

use step_state::step_state;

// Circuit: 5 bodies, 20 steps (test size)
// For production, change the generic parameters and recompile.
fn main(
    address: pub Field,
    bodies: pub [[u64; 5]; 5],
    missiles: [[u64; 3]; 21],
    inflight_missile: pub [u64; 5],
) -> pub ([u64; 5], [u64; 5], [u64; 5], [u64; 5], [u64; 5], [u64; 5], u64) {
    let result = step_state::<5, 20, 21>(address, bodies, missiles, inflight_missile);

    (
        result.out_bodies[0],
        result.out_bodies[1],
        result.out_bodies[2],
        result.out_bodies[3],
        result.out_bodies[4],
        result.out_missile,
        result.time,
    )
}
