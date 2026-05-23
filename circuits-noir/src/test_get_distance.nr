use crate::get_distance::get_distance;

#[test]
fn test_get_distance_basic() {
    // From Circom test: x1=13000, y1=7000, x2=4000, y2=2000
    // dx=9000, dy=5000, dist = sqrt(81000000+25000000) = sqrt(106000000) ~= 10295
    let dist = get_distance(13000, 7000, 4000, 2000);
    assert(dist == 10295);
}

#[test]
fn test_get_distance_same_point() {
    let dist = get_distance(500000, 500000, 500000, 500000);
    assert(dist == 0);
}

#[test]
fn test_get_distance_symmetric() {
    let d1 = get_distance(13000, 7000, 4000, 2000);
    let d2 = get_distance(4000, 2000, 13000, 7000);
    assert(d1 == d2);
}

#[test]
fn test_get_distance_horizontal() {
    // Pure horizontal: (0, 0) to (1000000, 0) = 1000000
    let dist = get_distance(0, 0, 1000000, 0);
    assert(dist == 1000000);
}

#[test]
fn test_get_distance_diagonal() {
    // (0, 0) to (1000000, 1000000) = sqrt(2)*1000000 ~= 1414213
    let dist = get_distance(0, 0, 1000000, 1000000);
    // sqrt(2_000_000_000_000) = 1414213
    assert(dist == 1414213);
}
