use crate::calculate_force::calculate_force;

// Test cases from calculateForceMain.test.js with expected values from Circom witness

#[test]
fn test_force_case_1() {
    // Bodies close together, body2 is left and below body1
    let body1: [u64; 5] = [326000, 62000, 8670, 3710, 100000];
    let body2: [u64; 5] = [263000, 158000, 6680, 6260, 75000];
    let result = calculate_force(body1, body2);
    // Circom: out_forces[0][0]=1 (x negative), out_forces[0][1]=275
    assert(result.x_negative == true);
    assert(result.x_magnitude == 275);
    // Circom: out_forces[1][0]=0 (y positive), out_forces[1][1]=420
    assert(result.y_negative == false);
    assert(result.y_magnitude == 420);
}

#[test]
fn test_force_case_2() {
    let body1: [u64; 5] = [363000, 658000, 10000, 10000, 75000];
    let body2: [u64; 5] = [679000, 500000, 10000, 10000, 50000];
    let result = calculate_force(body1, body2);
    // Circom: out_forces[0][0]=0 (x positive), out_forces[0][1]=179
    assert(result.x_negative == false);
    assert(result.x_magnitude == 179);
    // Circom: out_forces[1][0]=1 (y negative), out_forces[1][1]=89
    assert(result.y_negative == true);
    assert(result.y_magnitude == 89);
}

#[test]
fn test_force_case_3() {
    let body1: [u64; 5] = [226000, 42000, 10000, 10000, 100000];
    let body2: [u64; 5] = [363000, 658000, 10000, 10000, 75000];
    let result = calculate_force(body1, body2);
    // Circom: x_neg=0, x_mag=19, y_neg=0, y_mag=85
    assert(result.x_negative == false);
    assert(result.x_magnitude == 19);
    assert(result.y_negative == false);
    assert(result.y_magnitude == 85);
}

#[test]
fn test_force_case_4() {
    let body1: [u64; 5] = [226000, 42000, 8670, 3710, 100000];
    let body2: [u64; 5] = [363000, 658000, 6680, 13740, 75000];
    let result = calculate_force(body1, body2);
    // Circom: x_neg=0, x_mag=19, y_neg=0, y_mag=85
    assert(result.x_negative == false);
    assert(result.x_magnitude == 19);
    assert(result.y_negative == false);
    assert(result.y_magnitude == 85);
}

#[test]
fn test_force_zero_radius() {
    // If either body has radius 0, force should be 0
    let body1: [u64; 5] = [226000, 42000, 10000, 10000, 0];
    let body2: [u64; 5] = [363000, 658000, 10000, 10000, 75000];
    let result = calculate_force(body1, body2);
    assert(result.x_magnitude == 0);
    assert(result.y_magnitude == 0);
}
