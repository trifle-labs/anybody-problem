use crate::calculate_missile::calculate_missile;
use crate::types::WINDOW_WIDTH_SCALED;

#[test]
fn test_missile_normal_movement() {
    // Missile moving right and up
    let m: [u64; 5] = [100000, 500000, 5000, 3000, 10000];
    let result = calculate_missile(m);
    assert(result[0] == 105000); // x += vx
    assert(result[1] == 497000); // y -= vy
    assert(result[4] == 10000);  // still alive
}

#[test]
fn test_missile_goes_off_right() {
    // Missile near right edge
    let m: [u64; 5] = [999000, 500000, 5000, 3000, 10000];
    let result = calculate_missile(m);
    // x = 999000 + 5000 = 1004000 > WINDOW_WIDTH_SCALED (1000000)
    // So clamped to 0, and since new_x != 0, radius -> 0
    assert(result[4] == 0);
}

#[test]
fn test_missile_goes_off_top() {
    // Missile near top (y approaching 0), vy will push it past 0
    // y = 2000, vy = 3000 -> new_y would be -1000 -> underflow -> clamped to 0
    let m: [u64; 5] = [100000, 2000, 5000, 3000, 10000];
    let result = calculate_missile(m);
    // new_y = 0 (clamped from underflow)
    // y_offset = 0 + 30000 = 30000, y_in_bounds = 30000 > 30000? No -> clamped_y = 0
    assert(result[4] == 0);
}

#[test]
fn test_missile_at_y_boundary() {
    // Missile exactly at y = vy (result would be 0)
    let m: [u64; 5] = [100000, 5000, 5000, 5000, 10000];
    let result = calculate_missile(m);
    // new_y = 5000 - 5000 = 0
    // y_offset = 0 + 30000 = 30000, y_in_bounds = 30000 > 30000? No -> off screen
    assert(result[4] == 0);
}

#[test]
fn test_missile_inactive_passes() {
    // Missile with radius 0 should still work (no crash)
    let m: [u64; 5] = [0, WINDOW_WIDTH_SCALED, 0, 0, 0];
    let result = calculate_missile(m);
    assert(result[4] == 0);
}

#[test]
fn test_missile_speed_limit() {
    // At max speed: vx + vy <= 42426
    let m: [u64; 5] = [100000, 500000, 30000, 12426, 10000];
    let result = calculate_missile(m);
    assert(result[4] == 10000); // should pass speed check
}
