// Chrome Dino: 1D runner. Player bounded to a horizontal line, jumps over
// scrolling cacti. Effectively 2D physics, but x is locked.

import { defineGame } from '../schema.js'

export const chromeDino = defineGame({
  name: 'chrome-dino',
  world: {
    dimensions: 2,
    extent: { x: 600, y: 150 },
    boundary: { x: 'wrap', y: 'clamp' }, // clamp y so dino lands on ground
    coordinates: 'screen',
  },
  time: {
    fps: 60, // browser-game-feel framerate
    stepsPerProof: 300, // 5 seconds per proof
  },
  precision: {
    scalingFactor: 100,
    constraintBudget: 1_000_000,
  },
  forces: [
    {
      kind: 'gravity-constant',
      vec: [0, 60],
      appliesTo: ['dino'],
    },
  ],
  objects: {
    dino: {
      kind: 'dynamic',
      maxCount: 1,
      maxSpeed: 30,
      maxRadius: 12,
      mass: 1,
      inputs: [
        {
          name: 'jump',
          kind: 'discrete',
          impulse: { vy: -22 },
          // Cooldown the length of a typical jump so you can't double-jump.
          cooldownTicks: 30,
        },
        {
          name: 'duck',
          kind: 'discrete',
          // Modeled as halving radius while held; not a force impulse.
        },
      ],
    },
    cactus: {
      kind: 'kinematic',
      maxCount: 6,
      velocity: [-10, 0], // scroll-left at the running speed
      maxRadius: 15,
      respawn: { side: 'right', interval: 90 },
    },
    ground: {
      kind: 'static',
      maxCount: 1,
      maxRadius: 0, // not collidable as a circle; uses plane shape
      shape: { kind: 'plane', y: 130 },
    },
  },
  collisions: [
    { a: 'dino', b: 'cactus', response: 'gameOver' },
    { a: 'dino', b: 'ground', response: 'block-from-above' },
  ],
  termination: [
    { kind: 'destroyed', target: 'dino', outcome: 'lose' },
  ],
})
