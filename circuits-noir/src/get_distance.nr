use crate::approx_math::{abs_diff, sqrt};

/// Compute the Euclidean distance between two points.
/// Returns an approximate integer distance (floor of actual distance).
pub fn get_distance(x1: u64, y1: u64, x2: u64, y2: u64) -> u64 {
    let dx = abs_diff(x1, x2);
    let dy = abs_diff(y1, y2);
    let dxs = dx as u128 * dx as u128;
    let dys = dy as u128 * dy as u128;
    let distance_squared = (dxs + dys) as u64;
    sqrt(distance_squared)
}
