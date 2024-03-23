export const MAX_LIFE = 500
export const WITHERING_STEPS = 200

export function stepLife(bodies) {
  const live = []
  const withering = []
  for (const body of bodies) {
    if (typeof body.life !== 'number') {
      body.life = MAX_LIFE
    } else {
      body.life -= 1
    }
    if (body.life > 0) {
      live.push(body)
    } else if (body.life > -WITHERING_STEPS) {
      withering.push(body)
    }
  }

  return { live, withering }
}

export function stepWithering(witheringBodies) {
  const withering = []
  for (const body of witheringBodies) {
    body.life -= 1
    if (body.life > -WITHERING_STEPS) {
      withering.push(body)
    }
  }
  return withering
}
