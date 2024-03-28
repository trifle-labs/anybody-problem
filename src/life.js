export const WITHERING_STEPS = 200

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
