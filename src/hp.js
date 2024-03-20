export const MAX_HP = 500
export const WITHERING_STEPS = 200

export function stepLife(bodies) {
  const live = []
  const withering = []
  for (const body of bodies) {
    if (typeof body.hp !== 'number') {
      body.hp = MAX_HP
    } else {
      body.hp -= 1
    }
    if (body.hp > 0) {
      live.push(body)
    } else if (body.hp > -WITHERING_STEPS) {
      withering.push(body)
    }
  }

  return { live, withering }
}

export function stepWithering(witheringBodies) {
  const withering = []
  for (const body of witheringBodies) {
    body.hp -= 1
    if (body.hp > -WITHERING_STEPS) {
      withering.push(body)
    }
  }
  return withering
}
