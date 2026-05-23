use crate::calculate_force::calculate_force;
use crate::types::{
    TIME, MAX_VECTOR_SCALED, WINDOW_WIDTH_SCALED, MAX_ACCUMULATED,
};

/// Limiter: if value < limit, return value; else return rather
pub fn limiter(value: u128, limit: u128, rather: u128) -> u128 {
    if value < limit { value } else { rather }
}

/// LowerLimiter: if value > limit, return value; else return rather
pub fn lower_limiter(value: u128, limit: u128, rather: u128) -> u128 {
    if value > limit { value } else { rather }
}

/// Apply gravitational forces to all bodies for one simulation step.
/// This is the core physics engine.
///
/// N: number of bodies (compile-time constant)
/// bodies: array of [x, y, vx, vy, radius] per body
/// Returns updated bodies with new positions and velocities.
pub fn force_accumulator<let N: u32>(bodies: [[u64; 5]; N]) -> [[u64; 5]; N] {
    let time = TIME as u128;
    let max_vec_scaled = MAX_VECTOR_SCALED as u128;
    let window_scaled = WINDOW_WIDTH_SCALED as u128;
    let max_accum = MAX_ACCUMULATED;

    // Initialize accumulated forces with the offset (to avoid negative numbers)
    let mut accum_x: [u128; N] = [max_accum; N];
    let mut accum_y: [u128; N] = [max_accum; N];

    // Calculate forces between all pairs
    for i in 0..N {
        for j in (i + 1)..N {
            let force = calculate_force(bodies[i], bodies[j]);

            // Accumulate x forces
            // If x_negative (b2 is left of b1): body_i moves left (-), body_j moves right (+)
            // Circom uses mux with force_x[0] as selector:
            //   force_x[0]=0 (not negative): i += force, j -= force
            //   force_x[0]=1 (negative): i -= force, j += force
            if force.x_negative {
                accum_x[i] = accum_x[i] - time * force.x_magnitude;
                accum_x[j] = accum_x[j] + time * force.x_magnitude;
            } else {
                accum_x[i] = accum_x[i] + time * force.x_magnitude;
                accum_x[j] = accum_x[j] - time * force.x_magnitude;
            }

            // Accumulate y forces (same pattern)
            if force.y_negative {
                accum_y[i] = accum_y[i] - time * force.y_magnitude;
                accum_y[j] = accum_y[j] + time * force.y_magnitude;
            } else {
                accum_y[i] = accum_y[i] + time * force.y_magnitude;
                accum_y[j] = accum_y[j] - time * force.y_magnitude;
            }
        }
    }

    let mut out_bodies: [[u64; 5]; N] = [[0; 5]; N];

    for i in 0..N {
        // Radius doesn't change in force accumulation
        out_bodies[i][4] = bodies[i][4];

        // Calculate new velocity
        // new_vector = current_vector + accumulated_forces
        // Both are offset: vector by maxVectorScaled, accumulated by MAX_ACCUMULATED
        let new_vec_x = bodies[i][2] as u128 + accum_x[i];
        let new_vec_y = bodies[i][3] as u128 + accum_y[i];

        // Limit velocity magnitude (upper limit)
        // limit = 2 * maxVectorScaled + MAX_ACCUMULATED
        let vec_upper_limit = 2 * max_vec_scaled + max_accum;
        let clamped_vx = limiter(new_vec_x, vec_upper_limit, vec_upper_limit);
        let clamped_vy = limiter(new_vec_y, vec_upper_limit, vec_upper_limit);

        // Remove MAX_ACCUMULATED offset, add maxVectorScaled for lower limit check
        let vx_for_lower = clamped_vx - max_accum + max_vec_scaled;
        let vy_for_lower = clamped_vy - max_accum + max_vec_scaled;

        // Lower limit velocity
        let final_vx = lower_limiter(vx_for_lower, max_vec_scaled, max_vec_scaled);
        let final_vy = lower_limiter(vy_for_lower, max_vec_scaled, max_vec_scaled);

        // Remove the extra maxVectorScaled we added
        // Result is velocity offset by maxVectorScaled (as stored in body format)
        out_bodies[i][2] = (final_vx - max_vec_scaled) as u64;
        out_bodies[i][3] = (final_vy - max_vec_scaled) as u64;

        // Calculate new position
        // position + velocity (velocity already has maxVectorScaled offset)
        let pos_plus_vel_x = bodies[i][0] as u128 + out_bodies[i][2] as u128;
        let pos_plus_vel_y = bodies[i][1] as u128 + out_bodies[i][3] as u128;

        // Position wrapping (toroidal boundary)
        // If position >= windowWidthScaled + maxVectorScaled, wrap to near 0
        // If position <= maxVectorScaled, wrap to near windowWidthScaled
        let pos_upper_x = limiter(pos_plus_vel_x, window_scaled + max_vec_scaled, max_vec_scaled);
        let pos_lower_x = lower_limiter(pos_plus_vel_x, max_vec_scaled, window_scaled + max_vec_scaled);

        let pos_upper_y = limiter(pos_plus_vel_y, window_scaled + max_vec_scaled, max_vec_scaled);
        let pos_lower_y = lower_limiter(pos_plus_vel_y, max_vec_scaled, window_scaled + max_vec_scaled);

        // If upper limiter changed the value (went over), use upper result
        // Otherwise use lower result (handles going under)
        // Circom: isZero(positionLimiterX.in - positionLimiterX.out)
        // If input == output (no clamping happened), use lower limiter result
        // If input != output (clamped), use upper limiter result
        let upper_clamped_x = pos_plus_vel_x != pos_upper_x;
        let upper_clamped_y = pos_plus_vel_y != pos_upper_y;

        let final_pos_x = if upper_clamped_x {
            pos_upper_x - max_vec_scaled
        } else {
            pos_lower_x - max_vec_scaled
        };

        let final_pos_y = if upper_clamped_y {
            pos_upper_y - max_vec_scaled
        } else {
            pos_lower_y - max_vec_scaled
        };

        out_bodies[i][0] = final_pos_x as u64;
        out_bodies[i][1] = final_pos_y as u64;
    }

    out_bodies
}
