use crate::types::{
    WINDOW_WIDTH_SCALED, MAX_MISSILE_VECTOR_SCALED, MISSILE_LIMIT,
};

/// Calculate new missile position and determine if it's still alive.
/// Missile: [x, y, vx, vy, radius]
///   - x increases (moves right), y decreases (moves up)
///   - vy is stored as positive but treated as negative
///   - If missile goes off screen, radius becomes 0
pub fn calculate_missile(in_missile: [u64; 5]) -> [u64; 5] {
    let mx = in_missile[0];
    let my = in_missile[1];
    let mvx = in_missile[2];
    let mvy = in_missile[3];
    let mradius = in_missile[4];

    // Enforce missile speed limit
    let speed_sum = mvx + mvy;
    assert(speed_sum <= MISSILE_LIMIT);

    // Enforce vy is within bounds (y velocity is always "negative" direction)
    assert(mvy <= MAX_MISSILE_VECTOR_SCALED);
    // Enforce vx is within bounds (x velocity is always positive)
    assert(mvx <= MAX_MISSILE_VECTOR_SCALED);

    // New position X: always increases
    let new_x = mx + mvx;

    // Check X bounds: if new_x >= windowWidthScaled, missile goes off screen
    let clamped_x = if new_x < WINDOW_WIDTH_SCALED { new_x } else { 0 };

    // Determine if missile went off screen in X direction
    // Off screen if: clamped_x == 0 AND new_x != 0
    let x_off_screen = (clamped_x == 0) & (new_x != 0);

    // Radius after X check
    let radius_after_x = if x_off_screen { 0 } else { mradius };

    // New position Y: decreases (vy treated as negative)
    // Use offset trick to avoid underflow: add maxMissileVectorScaled as buffer
    // Circom: positionLowerLimiterY.in <== new_pos[1] + maxMissileVectorScaled
    // If my >= mvy: new_y = my - mvy (positive, missile still on screen if > 0)
    // If my < mvy: missile went off screen (past y=0)
    let new_y: u64 = if my >= mvy {
        my - mvy
    } else {
        0 // Went past y=0
    };

    // Y bounds check using same offset approach as Circom
    // new_y + maxMissileVectorScaled, then check if > maxMissileVectorScaled
    // This means new_y > 0 (missile still on screen)
    let y_offset = new_y + MAX_MISSILE_VECTOR_SCALED;
    let y_in_bounds = y_offset > MAX_MISSILE_VECTOR_SCALED;
    let clamped_y = if y_in_bounds { y_offset } else { 0 };

    // If y went off screen (clamped_y == 0), radius becomes 0
    let final_radius = if clamped_y == 0 { 0 } else { radius_after_x };

    [new_x, new_y, mvx, mvy, final_radius]
}
