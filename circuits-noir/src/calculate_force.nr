use crate::approx_math::{abs_diff, sqrt, div};
use crate::types::{
    SCALING_FACTOR, G_SCALED, MIN_DISTANCE_SQ_SCALED,
};

/// Force output for each axis: direction + magnitude
pub struct ForceResult {
    pub x_negative: bool,
    pub x_magnitude: u128,
    pub y_negative: bool,
    pub y_magnitude: u128,
}

/// Calculate gravitational force between two bodies.
/// Bodies are [x, y, vx, vy, radius].
///
/// Physics: F = G * (r1 + r2) * 4 * scalingFactor / (2 * d^2 * d) * delta
/// (rearranged to minimize division for precision)
pub fn calculate_force(body1: [u64; 5], body2: [u64; 5]) -> ForceResult {
    let b1x = body1[0];
    let b1y = body1[1];
    let b1r = body1[4];
    let b2x = body2[0];
    let b2y = body2[1];
    let b2r = body2[4];

    let dx_abs = abs_diff(b1x, b2x);
    let dy_abs = abs_diff(b1y, b2y);

    // Direction tracking: negative when b2 < b1
    let x_negative = b2x < b1x;
    let y_negative = b2y < b1y;

    // Distance squared
    let dxs = dx_abs as u128 * dx_abs as u128;
    let dys = dy_abs as u128 * dy_abs as u128;
    let unbound_distance_squared = dxs + dys;

    // Clamp to minimum distance
    let min_dist_sq = MIN_DISTANCE_SQ_SCALED as u128;
    let distance_squared = if unbound_distance_squared < min_dist_sq {
        min_dist_sq
    } else {
        unbound_distance_squared
    };

    // Distance (approximate sqrt)
    let distance = sqrt(distance_squared as u64) as u128;

    // bodies_sum = (r1 + r2) * 4, but 0 if either radius is 0
    let bodies_sum: u128 = if (b1r == 0) | (b2r == 0) {
        0
    } else {
        (b1r as u128 + b2r as u128) * 4
    };

    // Force calculation:
    // forceMag_numerator = GScaled * bodies_sum * scalingFactor
    // forceDenom = distanceSquared * 2 * distance
    // forceX = dx_abs * forceMag_numerator / forceDenom
    let force_mag_numerator = G_SCALED as u128 * bodies_sum * SCALING_FACTOR as u128;
    let force_denom = distance_squared * 2 * distance;

    let force_x_num = dx_abs as u128 * force_mag_numerator;
    let force_y_num = dy_abs as u128 * force_mag_numerator;

    let force_x = if force_denom == 0 { 0 } else { div(force_x_num, force_denom) };
    let force_y = if force_denom == 0 { 0 } else { div(force_y_num, force_denom) };

    ForceResult { x_negative, x_magnitude: force_x, y_negative, y_magnitude: force_y }
}
