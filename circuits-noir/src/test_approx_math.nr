use crate::approx_math::{sqrt, div, abs_diff};

#[test]
fn test_sqrt_perfect_square() {
    assert(sqrt(0) == 0);
    assert(sqrt(1) == 1);
    assert(sqrt(4) == 2);
    assert(sqrt(9) == 3);
    assert(sqrt(16) == 4);
    assert(sqrt(100) == 10);
    assert(sqrt(10000) == 100);
    assert(sqrt(1000000) == 1000);
}

#[test]
fn test_sqrt_imperfect() {
    // sqrt(2) ~= 1.414, floor = 1
    assert(sqrt(2) == 1);
    // sqrt(10) ~= 3.162, floor = 3
    assert(sqrt(10) == 3);
    // sqrt(50) ~= 7.07, floor = 7
    assert(sqrt(50) == 7);
}

#[test]
fn test_sqrt_large_values() {
    // sqrt(2_000_000_000_000) ~= 1_414_213, used in distance calculation
    let result = sqrt(2000000000000);
    // Should be floor(sqrt)
    let r128 = result as u128;
    assert(r128 * r128 <= 2000000000000);
    assert((r128 + 1) * (r128 + 1) > 2000000000000);
}

#[test]
fn test_div_exact() {
    assert(div(10, 2) == 5);
    assert(div(100, 10) == 10);
    assert(div(1000000, 1000) == 1000);
    assert(div(0, 5) == 0);
}

#[test]
fn test_div_floor() {
    assert(div(10, 3) == 3);
    assert(div(7, 2) == 3);
    assert(div(1, 3) == 0);
}

#[test]
fn test_div_large_values() {
    // Simulating force calculation: forceXnum / forceDenom
    let result = div(25600000000000000000, 5656856000000000000);
    // 25.6e18 / 5.656e18 ~= 4.52
    assert(result == 4);
}

#[test]
fn test_abs_diff() {
    assert(abs_diff(10, 3) == 7);
    assert(abs_diff(3, 10) == 7);
    assert(abs_diff(5, 5) == 0);
    assert(abs_diff(1000000, 0) == 1000000);
    assert(abs_diff(0, 1000000) == 1000000);
}
