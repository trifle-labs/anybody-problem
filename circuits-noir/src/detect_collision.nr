use crate::get_distance::get_distance;

/// Detect collisions between a missile and bodies.
/// If the missile is within 2 * body_radius distance of a body,
/// both the body's radius and missile's radius become 0.
///
/// N: number of bodies
/// bodies: [x, y, radius] per body (only position and radius needed)
/// missile: [x, y, radius]
/// Returns: (updated_bodies, updated_missile)
pub fn detect_collision<let N: u32>(
    bodies: [[u64; 3]; N],
    missile: [u64; 3],
) -> ([[u64; 3]; N], [u64; 3]) {
    let mut missile_radius = missile[2];
    let mut out_bodies: [[u64; 3]; N] = [[0; 3]; N];

    for i in 0..N {
        let body_x = bodies[i][0];
        let body_y = bodies[i][1];
        let body_radius = bodies[i][2];

        // Get distance between missile and body
        let distance = get_distance(body_x, body_y, missile[0], missile[1]);

        // Collision threshold is 2 * body_radius
        // But only if missile is active (radius != 0)
        let distance_min = if missile_radius == 0 {
            0 // No missile active, so distance_min = 0 means no collision possible
        } else {
            body_radius * 2
        };

        // Collision occurs if distance < distance_min
        let hit = distance < distance_min;

        // If hit: body radius -> 0, missile radius -> 0
        out_bodies[i][0] = body_x;
        out_bodies[i][1] = body_y;
        out_bodies[i][2] = if hit { 0 } else { body_radius };

        if hit {
            missile_radius = 0;
        }
    }

    let out_missile = [missile[0], missile[1], missile_radius];
    (out_bodies, out_missile)
}
