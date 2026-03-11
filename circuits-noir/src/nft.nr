use crate::force_accumulator::force_accumulator;

/// NFT simulation: bodies-only physics (no missiles, no collisions).
/// Just runs the gravitational force accumulator for N steps.
pub fn nft<let N: u32, let STEPS: u32>(bodies: [[u64; 5]; N]) -> [[u64; 5]; N] {
    let mut current_bodies = bodies;
    for _ in 0..STEPS {
        current_bodies = force_accumulator(current_bodies);
    }
    current_bodies
}
