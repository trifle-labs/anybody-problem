use crate::force_accumulator::{limiter, lower_limiter};

// Limiter tests from limiterMain.test.js
#[test]
fn test_limiter_in_exceeds_limit() {
    // in > limit -> return rather
    let result = limiter(1300000000, 700000000, 400000000);
    assert(result == 400000000);
}

#[test]
fn test_limiter_in_below_limit() {
    // in < limit -> return in
    let result = limiter(1300000000, 1300000001, 400000000);
    assert(result == 1300000000);
}

#[test]
fn test_limiter_rather_larger_than_limit() {
    // in > limit -> return rather (even if rather > limit)
    let result = limiter(1300000000, 700000000, 1400000000);
    assert(result == 1400000000);
}

// LowerLimiter tests from lowerLimiterMain.test.js
#[test]
fn test_lower_limiter_in_above_limit() {
    // in > limit -> return in
    let result = lower_limiter(1300000000, 700000000, 400000000);
    assert(result == 1300000000);
}

#[test]
fn test_lower_limiter_in_below_limit() {
    // in < limit -> return rather
    let result = lower_limiter(1300000000, 1300000001, 400000000);
    assert(result == 400000000);
}

#[test]
fn test_lower_limiter_in_well_below_limit() {
    // in < limit -> return rather
    let result = lower_limiter(600000000, 700000000, 1400000000);
    assert(result == 1400000000);
}
