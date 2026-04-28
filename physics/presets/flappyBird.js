// Flappy Bird: one player under constant downward gravity, jump impulses on
// tap, scrolling pipes that destroy the player on contact.

import { defineGame } from '../schema.js'

export const flappyBird = defineGame({
  name: 'flappy-bird',
  world: {
    dimensions: 2,
    extent: { x: 400, y: 600 },
    // x doesn't matter for the player (it's stationary, the world scrolls)
    // but pipes wrap (off the left edge respawns on the right)
    boundary: { x: 'wrap', y: 'destroy' },
    coordinates: 'screen', // y points down
  },
  time: {
    fps: 30,
    stepsPerProof: 300, // 10 seconds of gameplay per proof
  },
  precision: {
    scalingFactor: 100,
    constraintBudget: 1_000_000,
  },
  forces: [
    {
      kind: 'gravity-constant',
      vec: [0, 80], // y-down, ~80 units/tick² at this scale
      appliesTo: ['player'],
    },
  ],
  objects: {
    player: {
      kind: 'dynamic',
      maxCount: 1,
      maxSpeed: 30,
      maxRadius: 8,
      mass: 1,
      inputs: [
        {
          name: 'flap',
          kind: 'discrete',
          // Tap → set vy to a fixed upward value (negative in screen coords)
          impulse: { vy: -25 },
          cooldownTicks: 0,
        },
      ],
    },
    pipe: {
      kind: 'kinematic',
      maxCount: 8,
      velocity: [-8, 0], // scrolls left; respawn handles wraparound
      maxRadius: 30, // half-width of the pipe
      respawn: { side: 'right', interval: 60 },
    },
  },
  collisions: [{ a: 'player', b: 'pipe', response: 'gameOver' }],
  termination: [
    { kind: 'destroyed', target: 'player', outcome: 'lose' },
    // Score is "ticks survived"; no timeout proof granularity is enough.
  ],
})
