// Core types used throughout the circuits
// Body: [pos_x, pos_y, vel_x, vel_y, radius]
// All positions are scaled by scalingFactor (10^3)
// Velocities are offset by maxVectorScaled (20_000) so they're never negative

pub global SCALING_FACTOR: u64 = 1000;
pub global WINDOW_WIDTH: u64 = 1000;
pub global WINDOW_WIDTH_SCALED: u64 = 1_000_000; // WINDOW_WIDTH * SCALING_FACTOR
pub global TIME: u64 = 2;
pub global MAX_VECTOR: u64 = 20; // 10 * TIME
pub global MAX_VECTOR_SCALED: u64 = 20_000; // MAX_VECTOR * SCALING_FACTOR
pub global GRAVITY: u64 = 100;
pub global G_SCALED: u64 = 100_000; // GRAVITY * SCALING_FACTOR
pub global MIN_DISTANCE: u64 = 200;
pub global MIN_DISTANCE_SQ_SCALED: u64 = 40_000_000_000; // (MIN_DISTANCE^2) * (SCALING_FACTOR^2)
pub global MAX_MISSILE_VECTOR: u64 = 30; // TIME * 15
pub global MAX_MISSILE_VECTOR_SCALED: u64 = 30_000; // MAX_MISSILE_VECTOR * SCALING_FACTOR
pub global MISSILE_LIMIT: u64 = 42426; // 30_000 * sqrt(2) ~= 42,426

// The offset used in forceAccumulator to keep accumulated forces positive.
pub global MAX_ACCUMULATED: u128 = 468000000000000000000;
