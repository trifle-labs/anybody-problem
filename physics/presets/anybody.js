// anybody-problem: 6 bodies under pairwise gravity in a wrapping world.
// This preset reproduces the existing circuits/*.circom configuration.

import { defineGame } from '../schema.js'

export const anybody = defineGame({
  name: 'anybody-problem',
  world: {
    dimensions: 2,
    extent: { x: 1000, y: 1000 },
    boundary: { x: 'wrap', y: 'wrap' },
    coordinates: 'screen',
  },
  time: {
    fps: 25,
    stepsPerProof: 250,
    dt: 2,
  },
  precision: {
    scalingFactor: 1000,
    // Note: the actual compiled circuit comes in around 625K constraints.
    // Our estimator (budget.js) is intentionally conservative — its per-pair
    // gravity cost overcounts vs. circomlib's tighter Div/Sqrt
    // implementations — so we set a budget that matches what the estimator
    // sees, not what the compiled circuit ends up using.
    constraintBudget: 2_000_000,
  },
  forces: [
    {
      kind: 'gravity-pairwise',
      G: 100,
      minDistance: 200,
      appliesTo: ['body'],
    },
  ],
  objects: {
    body: {
      kind: 'dynamic',
      maxCount: 6,
      maxSpeed: 10,
      maxRadius: 13,
      mass: 13, // mass derived from radius in this game
    },
    missile: {
      kind: 'kinematic',
      maxCount: 1,
      velocity: [15, 15],
      maxRadius: 10,
    },
  },
  collisions: [
    { a: 'body', b: 'missile', response: 'destroy-a' },
  ],
  termination: [
    { kind: 'allDestroyed', target: 'body', outcome: 'win' },
    { kind: 'timeout' },
  ],
})
