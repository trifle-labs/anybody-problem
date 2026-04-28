// Tiny platformer: player with horizontal movement + jump, walls and a
// floor, optional moving enemies. This is the most demanding of the
// "simple" preset templates — full collision matrix, multiple input kinds.

import { defineGame } from '../schema.js'

export const platformer = defineGame({
  name: 'platformer',
  world: {
    dimensions: 2,
    extent: { x: 800, y: 600 },
    boundary: { x: 'clamp', y: 'clamp' },
    coordinates: 'screen',
  },
  time: {
    fps: 30,
    stepsPerProof: 240, // 8 seconds per proof
  },
  precision: {
    scalingFactor: 100,
    constraintBudget: 1_000_000,
  },
  forces: [
    {
      kind: 'gravity-constant',
      vec: [0, 50],
      appliesTo: ['player', 'enemy'],
    },
    {
      // ground friction modeled as light linear drag on player
      kind: 'drag-linear',
      coeff: 0.05,
      appliesTo: ['player'],
    },
  ],
  objects: {
    player: {
      kind: 'dynamic',
      maxCount: 1,
      maxSpeed: 25,
      maxRadius: 16,
      mass: 1,
      inputs: [
        {
          name: 'left',
          kind: 'discrete',
          // While held, set horizontal velocity to a constant
          // (overrides drag for the held direction)
          setVelocity: { vx: -15 },
        },
        {
          name: 'right',
          kind: 'discrete',
          setVelocity: { vx: 15 },
        },
        {
          name: 'jump',
          kind: 'discrete',
          impulse: { vy: -30 },
          cooldownTicks: 20, // prevents air-jumping
        },
      ],
    },
    enemy: {
      kind: 'dynamic',
      maxCount: 4,
      maxSpeed: 10,
      maxRadius: 14,
      mass: 1,
    },
    platform: {
      kind: 'static',
      maxCount: 8,
      maxRadius: 0,
      shape: { kind: 'box' },
    },
  },
  collisions: [
    { a: 'player', b: 'enemy', response: 'gameOver' },
    { a: 'player', b: 'platform', response: 'block' },
    { a: 'enemy', b: 'platform', response: 'block' },
  ],
  termination: [
    { kind: 'destroyed', target: 'player', outcome: 'lose' },
    { kind: 'allDestroyed', target: 'enemy', outcome: 'win' },
  ],
})
