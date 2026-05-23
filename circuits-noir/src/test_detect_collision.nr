use crate::detect_collision::detect_collision;

// Test from detectCollisionMain.test.js with expected values from Circom witness

#[test]
fn test_detect_collision_no_hit() {
    // Missile at (26000, 22000) is far from all bodies - no collision
    let bodies: [[u64; 3]; 3] = [
        [226000, 42000, 100000],
        [363000, 658000, 75000],
        [679000, 500000, 50000],
    ];
    let missile: [u64; 3] = [26000, 22000, 100000];

    let (out_bodies, out_missile) = detect_collision(bodies, missile);

    // No collisions - everything unchanged
    assert(out_bodies[0] == [226000, 42000, 100000]);
    assert(out_bodies[1] == [363000, 658000, 75000]);
    assert(out_bodies[2] == [679000, 500000, 50000]);
    assert(out_missile == [26000, 22000, 100000]);
}

#[test]
fn test_detect_collision_direct_hit() {
    // Missile at same position as body 0 - should collide
    let bodies: [[u64; 3]; 3] = [
        [100000, 100000, 10000],
        [500000, 500000, 10000],
        [800000, 800000, 10000],
    ];
    let missile: [u64; 3] = [100000, 100000, 10000];

    let (out_bodies, out_missile) = detect_collision(bodies, missile);

    // Body 0 radius should go to 0
    assert(out_bodies[0][2] == 0);
    // Missile radius should go to 0
    assert(out_missile[2] == 0);
    // Other bodies unaffected
    assert(out_bodies[1][2] == 10000);
    assert(out_bodies[2][2] == 10000);
}

#[test]
fn test_detect_collision_missile_inactive() {
    // Missile with radius 0 should not collide even at same position
    let bodies: [[u64; 3]; 3] = [
        [100000, 100000, 10000],
        [500000, 500000, 10000],
        [800000, 800000, 10000],
    ];
    let missile: [u64; 3] = [100000, 100000, 0]; // radius = 0

    let (out_bodies, out_missile) = detect_collision(bodies, missile);

    // Nothing should change
    assert(out_bodies[0][2] == 10000);
    assert(out_bodies[1][2] == 10000);
    assert(out_bodies[2][2] == 10000);
    assert(out_missile[2] == 0);
}
