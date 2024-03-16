export const MAX_HP = 100000
export const WITHERING_STEPS = 2000

export function stepHP(bodies, witheringBodies) {
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
    } else if (body.hp > -WITHERING_STEPS){
      withering.push(body)
    }

  }

  for (const body of witheringBodies) {
    body.hp -= 1

    if (body.hp > -WITHERING_STEPS) {
      withering.push(body)
    }
  }

  return { live, withering }
}
