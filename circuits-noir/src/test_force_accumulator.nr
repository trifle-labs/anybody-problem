use crate::force_accumulator::force_accumulator;

// Test from forceAccumulator.test.js with expected values from Circom witness

#[test]
fn test_force_accumulator_3_bodies() {
    let bodies: [[u64; 5]; 3] = [
        [226000, 42000, 8670, 3710, 100000],
        [363000, 658000, 6680, 13740, 75000],
        [679000, 500000, 12290, 12520, 50000],
    ];
    let result = force_accumulator(bodies);

    // Validated against Circom witness output
    assert(result[0] == [214808, 25982, 8808, 3982, 100000]);
    assert(result[1] == [350000, 651392, 7000, 13392, 75000]);
    assert(result[2] == [670832, 492596, 11832, 12596, 50000]);
}

#[test]
fn test_force_accumulator_with_dummy_bodies() {
    // Dummy bodies (radius=0) should not affect physics of real bodies.
    // Note: dummy bodies at (0,0) with vel (20000,20000) will have their
    // position wrapped to (1000000, 1000000) due to boundary handling,
    // but this doesn't affect real bodies since force=0 when radius=0.
    let bodies: [[u64; 5]; 5] = [
        [226000, 42000, 8670, 3710, 100000],
        [363000, 658000, 6680, 13740, 75000],
        [679000, 500000, 12290, 12520, 50000],
        [0, 0, 20000, 20000, 0],
        [0, 0, 20000, 20000, 0],
    ];
    let result = force_accumulator(bodies);

    // First 3 bodies should match the 3-body test exactly
    assert(result[0] == [214808, 25982, 8808, 3982, 100000]);
    assert(result[1] == [350000, 651392, 7000, 13392, 75000]);
    assert(result[2] == [670832, 492596, 11832, 12596, 50000]);
    // Dummy bodies: position wraps from 0 to window edge, radius stays 0
    assert(result[3][4] == 0);
    assert(result[4][4] == 0);
}
