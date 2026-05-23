use crate::step_state::step_state;

#[test]
fn test_no_missile_gravity_only() {
    let address: Field = 1;
    let bodies: [[u64; 5]; 5] = [
        [126000, 32000, 22000, 12000, 8000],
        [226000, 42000, 21000, 11000, 7000],
        [0, 0, 20000, 20000, 0],
        [0, 0, 20000, 20000, 0],
        [0, 0, 20000, 20000, 0],
    ];
    let inflight_missile: [u64; 5] = [0, 1000000, 0, 0, 0];
    let missiles: [[u64; 3]; 21] = [[0, 0, 0]; 21];

    let result = step_state::<5, 20, 21>(address, bodies, missiles, inflight_missile);

    // Validated against JS simulation
    assert(result.out_bodies[0] == [179774, 880036, 23198, 11958, 8000]);
    assert(result.out_bodies[1] == [232226, 864964, 19802, 11042, 7000]);
    assert(result.out_bodies[2] == [0, 0, 20000, 20000, 0]);
    assert(result.out_bodies[3] == [0, 0, 20000, 20000, 0]);
    assert(result.out_bodies[4] == [0, 0, 20000, 20000, 0]);
    assert(result.time == 20);
}

#[test]
fn test_missile_hits_body() {
    let address: Field = 1;
    let bodies: [[u64; 5]; 5] = [
        [126000, 32000, 22000, 12000, 8000],
        [226000, 42000, 21000, 11000, 7000],
        [0, 0, 20000, 20000, 0],
        [0, 0, 20000, 20000, 0],
        [0, 0, 20000, 20000, 0],
    ];
    let inflight_missile: [u64; 5] = [226000, 42000, 1000, 9000, 10000];
    let mut missiles: [[u64; 3]; 21] = [[0, 0, 0]; 21];
    missiles[0] = [1000, 9000, 10000];

    let result = step_state::<5, 20, 21>(address, bodies, missiles, inflight_missile);

    // Body 1 should be destroyed (radius = 0)
    assert(result.out_bodies[1][4] == 0);
    // Validated against JS simulation
    assert(result.out_bodies[0] == [167480, 880090, 22074, 12006, 8000]);
    assert(result.out_bodies[1] == [244520, 864910, 20926, 10994, 0]);
    assert(result.time == 0);
}
