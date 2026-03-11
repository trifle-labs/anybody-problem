// Approximate math functions: sqrt and division
// These mirror the Circom approxMath.circom patterns using unconstrained hints + constraints

unconstrained fn sqrt_hint(n: u64) -> u64 {
    if n == 0 {
        0
    } else {
        let mut lo: u64 = 1;
        let mut hi: u64 = n >> 1;
        if hi == 0 {
            1
        } else {
            let mut result: u64 = 0;
            let mut found = false;
            while (lo <= hi) & !found {
                let mid = (lo + hi) >> 1;
                let mid_sq = mid as u128 * mid as u128;
                let n128 = n as u128;
                if mid_sq == n128 {
                    result = mid;
                    found = true;
                } else if mid_sq < n128 {
                    lo = mid + 1;
                } else {
                    hi = mid - 1;
                }
            }
            if found { result } else { hi }
        }
    }
}

/// Constrained approximate square root.
/// Guarantees: root * root <= squared_value < (root + 1) * (root + 1)
/// Also: diff <= root * 2 (matching Circom's margin of error check)
pub fn sqrt(squared_value: u64) -> u64 {
    if squared_value == 0 {
        0
    } else {
        // Safety: sqrt_hint computes floor(sqrt(squared_value)) which is constrained below
        let root = unsafe { sqrt_hint(squared_value) };

        let root_u128 = root as u128;
        let sq_u128 = squared_value as u128;
        let root_sq = root_u128 * root_u128;
        let next_sq = (root_u128 + 1) * (root_u128 + 1);

        // Constrain: root^2 <= squared_value < (root+1)^2
        assert(root_sq <= sq_u128);
        assert(sq_u128 < next_sq);

        // Match Circom's margin of error: diff <= root * 2
        let diff = sq_u128 - root_sq;
        assert(diff <= root_u128 * 2);

        root
    }
}

unconstrained fn div_hint(dividend: u128, divisor: u128) -> u128 {
    if dividend == 0 {
        0
    } else {
        dividend / divisor
    }
}

/// Constrained integer division (floor).
/// Guarantees: quotient * divisor <= dividend < (quotient + 1) * divisor
pub fn div(dividend: u128, divisor: u128) -> u128 {
    if dividend == 0 {
        0
    } else {
        // Safety: div_hint computes floor(dividend/divisor) which is constrained below
        let quotient = unsafe { div_hint(dividend, divisor) };

        let product = quotient * divisor;
        // quotient * divisor <= dividend
        assert(product <= dividend);
        // remainder < divisor
        let remainder = dividend - product;
        assert(remainder < divisor);

        quotient
    }
}

/// Absolute value of subtraction: |a - b|
pub fn abs_diff(a: u64, b: u64) -> u64 {
    if a > b { a - b } else { b - a }
}
