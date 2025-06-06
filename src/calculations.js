import { BigNumber } from 'ethers'

export const Calculations = {
  forceAccumulator(bodies_ = this.bodies) {
    let bodies = _copy(bodies_)
    bodies = this.convertBodiesToBigInts(bodies)
    bodies = this.forceAccumulatorBigInts(bodies)
    bodies = this.convertBigIntsToBodies(bodies)
    return bodies
  },

  forceAccumulatorBigInts(bodies_) {
    let bodies = _copy(bodies_)
    const vectorLimitScaled = this.convertFloatToScaledBigInt(this.vectorLimit)
    let accumulativeForces = []
    for (let i = 0; i < bodies.length; i++) {
      accumulativeForces.push([0n, 0n])
    }
    const time = BigInt(this.speedFactor)
    for (let i = 0; i < bodies.length; i++) {
      const body = bodies[i]
      for (let j = i + 1; j < bodies.length; j++) {
        const otherBody = bodies[j]
        const force = this.calculateForceBigInt(body, otherBody)
        const bodyVelocity = [time * force[0], time * force[1]]
        const otherBodyVelocity = [time * -force[0], time * -force[1]]

        accumulativeForces[i] = _addVectors(accumulativeForces[i], bodyVelocity)
        accumulativeForces[j] = _addVectors(
          accumulativeForces[j],
          otherBodyVelocity
        )
      }
    }

    for (let i = 0; i < bodies.length; i++) {
      const body = bodies[i]
      const body_velocity = _addVectors(
        [body.velocity.x, body.velocity.y],
        accumulativeForces[i]
      )
      body.velocity.x = body_velocity[0]
      body.velocity.y = body_velocity[1]
      const body_velocity_x_abs =
        body.velocity.x > 0n ? body.velocity.x : -1n * body.velocity.x
      if (body_velocity_x_abs > vectorLimitScaled) {
        body.velocity.x =
          (body_velocity_x_abs / body.velocity.x) * vectorLimitScaled
      }
      const body_velocity_y_abs =
        body.velocity.y > 0n ? body.velocity.y : -1n * body.velocity.y
      if (body_velocity_y_abs > vectorLimitScaled) {
        body.velocity.y =
          (body_velocity_y_abs / body.velocity.y) * vectorLimitScaled
      }

      const body_position = _addVectors(
        [body.position.x, body.position.y],
        [body.velocity.x, body.velocity.y]
      )

      body.position.x = body_position[0]
      body.position.y = body_position[1]
    }

    const scaledWindowWidth = this.convertFloatToScaledBigInt(this.windowWidth)
    for (let i = 0; i < bodies.length; i++) {
      const body = bodies[i]

      if (body.position.x >= scaledWindowWidth) {
        body.position.x = 0n
      } else if (body.position.x <= 0n) {
        body.position.x = scaledWindowWidth
      }
      if (body.position.y >= scaledWindowWidth) {
        body.position.y = 0n
      } else if (body.position.y <= 0n) {
        body.position.y = scaledWindowWidth
      }
    }
    return bodies
  },

  calculateBodyFinal(bodies_) {
    const bodies = _copy(bodies_)
    bodies.sort((a, b) => a.bodyIndex - b.bodyIndex)
    const bodiesAsBigInts = this.convertBodiesToBigInts(bodies)
    return bodiesAsBigInts.map((b) => {
      b = this.convertScaledBigIntBodyToArray(b)
      b[2] = BigInt(b[2]).toString()
      b[3] = BigInt(b[3]).toString()
      return b
    })
  },

  // Calculate the gravitational force between two bodies
  calculateForceBigInt(body1_, body2_) {
    const body1 = _copy(body1_)
    const body2 = _copy(body2_)
    const GScaled = BigInt(Math.floor(this.G * parseInt(this.scalingFactor)))

    let minDistanceScaled =
      BigInt(this.minDistanceSquared) * this.scalingFactor ** 2n // when the original gets squared, the scaling factor gets squared

    const position1 = body1.position

    const body1_position_x = position1.x
    const body1_position_y = position1.y
    const body1_radius = body1.radius

    const position2 = body2.position
    const body2_position_x = position2.x
    const body2_position_y = position2.y
    const body2_radius = body2.radius

    let dx = body2_position_x - body1_position_x
    let dy = body2_position_y - body1_position_y
    const dxAbs = dx > 0n ? dx : -1n * dx
    const dyAbs = dy > 0n ? dy : -1n * dy

    const dxs = dx * dx
    const dys = dy * dy

    let distanceSquared
    const unboundDistanceSquared = dxs + dys
    if (unboundDistanceSquared < minDistanceScaled) {
      distanceSquared = minDistanceScaled
    } else {
      distanceSquared = unboundDistanceSquared
    }
    let distance = _approxSqrt(distanceSquared)

    const bodies_sum =
      body1_radius == 0n || body2_radius == 0n
        ? 0n
        : (body1_radius + body2_radius) * 4n // NOTE: this could be tweaked as a variable for "liveliness" of bodies

    const distanceSquared_with_avg_denom = distanceSquared * 2n // NOTE: this is a result of moving division to the end of the calculation
    const forceMag_numerator = GScaled * bodies_sum * this.scalingFactor // distance should be divided by scaling factor but this preserves rounding with integer error

    const forceDenom = distanceSquared_with_avg_denom * distance

    const forceXnum = dxAbs * forceMag_numerator
    const forceXunsigned = _approxDiv(forceXnum, forceDenom)
    const forceX = dx < 0n ? -forceXunsigned : forceXunsigned

    const forceYnum = dyAbs * forceMag_numerator
    const forceYunsigned = _approxDiv(forceYnum, forceDenom)
    const forceY = dy < 0n ? -forceYunsigned : forceYunsigned
    return [forceX, forceY]
  },

  convertScaledStringArrayToMissile(missile_) {
    const missile = _copy(missile_)
    return this.convertScaledStringArrayToBody(missile, 0)
  },

  convertScaledStringArrayToBody(body_, vectorLimit = this.vectorLimit) {
    const body = _copy(body_)
    const maxVectorScaled = this.convertFloatToScaledBigInt(vectorLimit)
    return {
      position: {
        x: BigInt(body[0]),
        y: BigInt(body[1])
      },
      velocity: {
        x: BigInt(body[2]) - maxVectorScaled,
        y: BigInt(body[3]) - maxVectorScaled
      },
      radius: BigInt(body[4])
    }
  },

  convertScaledBigIntMissileToArray(m_) {
    const m = _copy(m_)
    return this.convertScaledBigIntBodyToArray(m, 0)
  },
  convertScaledBigIntBodyToArray(b_, vectorLimit = this.vectorLimit) {
    let b = _copy(b_)
    const maxVectorScaled = this.convertFloatToScaledBigInt(vectorLimit)
    const bodyArray = []
    const noNegativeVelocityX = b.velocity.x + maxVectorScaled
    const noNegativeVelocityY = b.velocity.y + maxVectorScaled
    bodyArray.push(
      _convertBigIntToModP(b.position.x),
      _convertBigIntToModP(b.position.y),
      _convertBigIntToModP(noNegativeVelocityX),
      _convertBigIntToModP(noNegativeVelocityY),
      _convertBigIntToModP(b.radius)
    )
    return bodyArray.map((b) => b.toString())
  },

  convertScaledStringToBigInt(value) {
    return BigInt(value)
  },

  convertMissileScaledStringArrayToFloat(missile_) {
    let missile = _copy(missile_)
    // const maxMissileVectorScaled = this.convertFloatToScaledBigInt(
    //   this.missileVectorLimit
    // )
    missile = missile.map(this.convertScaledStringToBigInt.bind(this))
    return {
      position: {
        x: 0,
        y: this.windowWidth
      },
      velocity: {
        x: this.convertScaledBigIntToFloat(missile[0]),
        y: -this.convertScaledBigIntToFloat(missile[1])
      },
      radius: parseInt(missile[2])
    }
  },

  convertScaledStringArrayToFloat(body_) {
    let body = _copy(body_)
    const maxVectorScaled = this.convertFloatToScaledBigInt(this.vectorLimit)
    body = body.map(this.convertScaledStringToBigInt.bind(this))
    return {
      position: {
        x: this.convertScaledBigIntToFloat(body[0]),
        y: this.convertScaledBigIntToFloat(body[1])
      },
      velocity: {
        x: this.convertScaledBigIntToFloat(body[2] - maxVectorScaled),
        y: this.convertScaledBigIntToFloat(body[3] - maxVectorScaled)
      },
      radius: this.convertScaledBigIntToFloat(body[4])
    }
  },
  convertBigIntsToBodies(bigBodies_) {
    const bigBodies = _copy(bigBodies_)
    const bodies = []
    for (let i = 0; i < bigBodies.length; i++) {
      const body = bigBodies[i]
      const newBody = { bodyIndex: i, position: {}, velocity: {}, radius: null }
      newBody.px = body.position.x
      newBody.position.x = this.convertScaledBigIntToFloat(body.position.x)
      newBody.py = body.position.y
      newBody.position.y = this.convertScaledBigIntToFloat(body.position.y)
      newBody.position = this.createVector(
        newBody.position.x,
        newBody.position.y
      )

      newBody.vx = body.velocity.x
      newBody.velocity.x = this.convertScaledBigIntToFloat(body.velocity.x)
      newBody.vy = body.velocity.y
      newBody.velocity.y = this.convertScaledBigIntToFloat(body.velocity.y)
      newBody.velocity = this.createVector(
        newBody.velocity.x,
        newBody.velocity.y
      )

      if (!this.accumX) {
        this.accumX = 0
        this.accumY = 0
      }
      this.accumX += newBody.velocity.x
      this.accumY += newBody.velocity.y
      newBody.radius = this.convertScaledBigIntToFloat(body.radius)
      if (body.c) {
        newBody.c = body.c
      }
      newBody.seed = body.seed
      newBody.bodyIndex = body.bodyIndex
      // newBody.faceIndex = body.faceIndex
      bodies.push(newBody)
    }
    return bodies
  },

  convertFloatToScaledBigInt(value) {
    if (value.type == 'BigNumber') {
      value = BigNumber.from(value.hex).toNumber()
    }
    // changed from Math.floor to Math.round, TODO: look here in case there's rounding error
    return BigInt(Math.round(value * parseInt(this.scalingFactor)))
    // let maybeNegative = BigInt(Math.floor(value * parseInt(scalingFactor))) % p
    // while (maybeNegative < 0n) {
    //   maybeNegative += p
    // }
    // return maybeNegative
  },
  convertScaledBigIntToFloat(value) {
    return parseFloat(value) / parseFloat(this.scalingFactor)
  },

  convertBodiesToBigInts(bodies_) {
    const bodies = _copy(bodies_)
    const bigBodies = []

    const skipCopying = ['px', 'py', 'vx', 'vy']
    for (let i = 0; i < bodies.length; i++) {
      const body = bodies[i]
      const newBody = { position: {}, velocity: {} }
      newBody.position.x =
        body.px || this.convertFloatToScaledBigInt(body.position.x)
      newBody.position.y =
        body.py || this.convertFloatToScaledBigInt(body.position.y)
      newBody.velocity.x =
        body.vx || this.convertFloatToScaledBigInt(body.velocity.x)
      newBody.velocity.y =
        body.vy || this.convertFloatToScaledBigInt(body.velocity.y)
      newBody.radius = this.convertFloatToScaledBigInt(body.radius)

      // copy over any other properties on body
      for (const key in body) {
        if (typeof newBody[key] !== 'undefined' || skipCopying.includes(key))
          continue
        const value = body[key]
        newBody[key] = value
      }

      bigBodies.push(newBody)
    }
    return bigBodies
  },

  detectCollision(bodies_ = this.bodies, missile_ = this.missile) {
    let bodies = _copy(bodies_)
    let missile = _copy(missile_)
    let bigBodies = this.convertBodiesToBigInts(bodies)
    const bigMissile = missile && this.convertBodiesToBigInts([missile])[0]
    const { bodies: newBigBodies, missile: newBigMissile } =
      this.detectCollisionBigInt(bigBodies, bigMissile)
    bodies = this.convertBigIntsToBodies(newBigBodies)
    missile = newBigMissile && this.convertBigIntsToBodies([newBigMissile])[0]
    // console.dir(
    //   { bodies_out: bodies, missile_out: missile },
    //   { depth: null }
    // )
    return { bodies, missile }
  },

  detectCollisionBigInt(bodies_, missile_) {
    let bodies = _copy(bodies_)
    let missile = _copy(missile_)
    if (!missile) {
      return { bodies, missile }
    }
    const scaledMissileVectorLimit = this.convertFloatToScaledBigInt(
      this.missileVectorLimit
    )
    if (missile.velocity.y > 0n) {
      throw new Error(
        `Missile velocity.y ${missile.velocity.y} should be negative`
      )
    }
    if (missile.velocity.y < -scaledMissileVectorLimit) {
      throw new Error(
        `Missile velocity.y ${missile.velocity.y} should be greater than ${-scaledMissileVectorLimit}`
      )
    }
    if (missile.velocity.x < 0n) {
      throw new Error(
        `Missile velocity.x ${missile.velocity.x} should be positive`
      )
    }
    if (missile.velocity.x > scaledMissileVectorLimit) {
      throw new Error(
        `Missile velocity.x ${missile.velocity.x} should be less than ${scaledMissileVectorLimit}`
      )
    }
    const missileAbsSum = BigInt(
      Math.abs(parseInt(missile.velocity.x)) +
        Math.abs(parseInt(missile.velocity.y))
    )
    if (missileAbsSum > this.missileVectorLimitSum) {
      console.log({ missileAbsSum })
      throw new Error('Missile is too fast')
    }
    missile.position.x += missile.velocity.x
    missile.position.y += missile.velocity.y

    // NOTE: Missile Limiter() circuit is lt and gt NOT lte or gte
    // NOTE: Body is lte and gte
    if (
      missile.position.x > BigInt(this.windowWidth) * this.scalingFactor ||
      missile.position.y < 0n
    ) {
      missile.radius = 0n
    }

    for (let j = 0; j < bodies.length; j++) {
      const body = bodies[j]
      const distance = _approxDist(
        missile.position.x,
        missile.position.y,
        body.position.x,
        body.position.y
      )
      // console.log({
      //   p_x: body.position.x,
      //   p_y: body.position.y,
      //   m_x: missile.position.x,
      //   m_y: missile.position.y
      // })
      // console.log({ distance })
      // NOTE: this is to match the circuit. If the missile is gone, set minDist to 0
      // Need to make sure comparison of distance is < and not <= for this to work
      // because they may by chance be at the exact same coordinates and should still
      // not trigger an _explosion since the missile is already gone.
      const minDist = missile.radius == 0n ? 0n : body.radius * 2n
      // console.log({ minDist })
      if (distance < minDist) {
        missile.radius = 0n
        const x = this.convertScaledBigIntToFloat(body.position.x)
        const y = this.convertScaledBigIntToFloat(body.position.y)
        this.explosions.push(...this.convertBigIntsToBodies([_copy(body)]))
        if (!this.util) {
          this.makeExplosionStart(x, y)
          this.shakeScreen()
          this.sound?.playExplosion(x, y)
        }

        bodies[j].radius = 0n
      }
    }
    return { bodies, missile }
  }
}

// ------
/// functional utils
// ------

function _convertBigIntToModP(v) {
  const prime =
    21888242871839275222246405745257275088548364400416034343698204186575808495617n
  let vmp = v % prime
  while (vmp < 0n) {
    vmp += prime
  }
  return vmp
}
function _approxDist(x1, y1, x2, y2) {
  const absX = x1 > x2 ? x1 - x2 : x2 - x1
  const absY = y1 > y2 ? y1 - y2 : y2 - y1
  const dxs = absX * absX
  const dys = absY * absY
  const distanceSquared = dxs + dys
  const distance = _approxSqrt(distanceSquared)
  return distance
}
function _approxSqrt(n) {
  if (n == 0n) {
    return 0n
  }
  var lo = 0n
  var hi = n >> 1n
  var mid, midSquared

  while (lo <= hi) {
    mid = (lo + hi) >> 1n // multiplication by multiplicative inverse is not what we want so we use >>

    // TODO: Make more accurate by checking if lo + hi is odd or even before bit shifting
    midSquared = mid * mid
    if (midSquared == n) {
      return mid // Exact square root found
    } else if (midSquared < n) {
      lo = mid + 1n // Adjust lower bound
    } else {
      hi = mid - 1n // Adjust upper bound
    }
  }
  // If we reach here, no exact square root was found.
  // return the closest approximation
  // console.log(`final approx`, { lo, mid, hi })
  return mid
}
function _approxDiv(dividend, divisor) {
  if (dividend == 0n) {
    return 0n
  }
  // Create internal signals for our binary search
  var lo, hi, mid, testProduct

  // Initialize our search space
  lo = 0n
  hi = dividend // Assuming worst case where divisor = 1

  while (lo < hi) {
    // 32 iterations for 32-bit numbers as an example
    mid = (hi + lo + 1n) >> 1n
    testProduct = mid * divisor

    // Adjust our bounds based on the test product
    if (testProduct > dividend) {
      hi = mid - 1n
    } else {
      lo = mid
    }
  }
  // console.log({ lo, mid, hi })
  // Output the lo as our approximated quotient after iterations
  // quotient <== lo;
  return lo
}
// function _calculateTime(constraints, steps = 1) {
//   const totalSteps = (steps * 1_000_000) / constraints
//   const fps = 25
//   const sec = totalSteps / fps
//   return Math.round(sec * 100) / 100
// }

// function _explosion(x, y, radius) {
//   let bombs = []
//   for (let i = 0; i < 100; i++) {
//     bombs.push({
//       x,
//       y,
//       i,
//       radius
//     })
//   }
//   return bombs
// }

function _addVectors(v1, v2) {
  return [v1[0] + v2[0], v1[1] + v2[1]]
}

function _customStringify(obj) {
  return JSON.stringify(obj, (key, value) => {
    if (typeof value === 'bigint') {
      return value.toString() + 'n'
    }
    return value
  })
}

function _customParse(json) {
  try {
    return JSON.parse(json, (key, value) => {
      if (
        typeof value === 'string' &&
        value.endsWith('n') &&
        /^-?\d+$/.test(value.slice(0, -1)) // check if the value is all digits plus optional negative sign
      ) {
        return BigInt(value.slice(0, -1))
      }
      return value
    })
  } catch (e) {
    console.error({ json, e })
    return json
  }
}

function _copy(obj) {
  if (typeof obj !== 'object' || obj === null) {
    return obj // Return primitives and null directly
  }

  if (obj instanceof Date) {
    return new Date(obj.getTime()) // Handle Date objects
  }

  if (obj instanceof Map) {
    const newMap = new Map()
    for (const [key, value] of obj.entries()) {
      newMap.set(_copy(key), _copy(value)) // Recursively copy map entries
    }
    return newMap
  }

  if (obj instanceof Set) {
    const newSet = new Set()
    for (const value of obj.values()) {
      newSet.add(_copy(value)) // Recursively copy set values
    }
    return newSet
  }

  if (Array.isArray(obj)) {
    // Handle arrays
    return obj.map(_copy) // Recursively copy array elements
  }

  // Handle plain objects
  const newObj = {}
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      newObj[key] = _copy(obj[key]) // Recursively copy object properties
    }
  }
  return newObj
}

BigInt.prototype.toJSON = function () {
  return this.toString() + 'n'
}

// function _validateSeed(seed) {
//   const error = 'Seed must be a 32-byte value'
//   // ensure that the seed is a 32-byte value
//   if (typeof seed === 'string') {
//     if (seed.length !== 66) {
//       throw new Error(error + ' (1)')
//     }
//     // confirm that all characters are hex characters
//     if (seed.substring(2, 66).match(/[^0-9A-Fa-f]/)) {
//       throw new Error(error + ' (2)')
//     }
//     if (seed.substring(0, 2) !== '0x') {
//       throw new Error(error + ' (3)')
//     }
//     seed = BigInt(seed)
//   }
//   if (typeof seed === 'bigint') {
//     if (seed < 0n) {
//       throw new Error(error + ' (4)')
//     }
//     if (
//       seed > 0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffn
//     ) {
//       // if (seed > 115792089237316195423570985008687907853269984665640564039457584007913129639935n) {
//       throw new Error(error + ' (5)')
//     }
//   } else {
//     throw new Error(error + ' (6)')
//   }
// }

// function checkCollision(body1, body2) {
//   const distance = dist(body1.position.x, body1.position.y, body2.position.x, body2.position.y);
//   const minDist = (body1.radius + body2.radius) / 4;

//   if (distance < minDist) {
//     // Calculate collision response
//     const angle = atan2(body2.position.y - body1.position.y, body2.position.x - body1.position.x);
//     const overlap = minDist - distance;

//     const totalMass = body1.radius ** 2 + body2.radius ** 2;
//     const overlapRatio1 = body2.radius / totalMass;
//     const overlapRatio2 = body1.radius / totalMass;

//     const deltaX = -cos(angle) * overlap;
//     const deltaY = -sin(angle) * overlap;

//     body1.position.x -= deltaX * overlapRatio1;
//     body1.position.y -= deltaY * overlapRatio1;
//     body2.position.x += deltaX * overlapRatio2;
//     body2.position.y += deltaY * overlapRatio2;

//     // Update velocities
//     const angle1 = atan2(body1.velocity.y, body1.velocity.x);
//     const angle2 = atan2(body2.velocity.y, body2.velocity.x);
//     const speed1 = body1.velocity.mag();
//     const speed2 = body2.velocity.mag();

//     const newVelX1 = cos(angle1) * speed2;
//     const newVelY1 = sin(angle1) * speed2;
//     const newVelX2 = cos(angle2) * speed1;
//     const newVelY2 = sin(angle2) * speed1;

//     body1.velocity.set(newVelX1, newVelY1);
//     body2.velocity.set(newVelX2, newVelY2);
//   }
// }

const SECONDS_IN_DAY = 86400
const apr_14_25 = 1744588800 // TODO: Consider making this configurable or naming it more descriptively
const newMiddyStart = apr_14_25

// Helper Functions for calculateRecords

function _getTournamentConfig(chains, appChainId) {
  const tournamentData = chains[appChainId]?.data?.tournament
  if (!tournamentData) {
    throw new Error(`Tournament data not found for appChainId: ${appChainId}`)
  }
  return {
    daysInContest: tournamentData.daysInWeek,
    minimumDaysPlayed: tournamentData.minDays,
    earlyMonday: tournamentData.startDate
  }
}

function _weekNumber(day, earlyMonday, daysInContest) {
  return Math.floor((day - earlyMonday) / SECONDS_IN_DAY / daysInContest)
}

function _weekNumberToDay(week, earlyMonday, daysInContest) {
  return earlyMonday + week * SECONDS_IN_DAY * daysInContest
}

function _dayOfTheWeek(earlyMonday, day, daysInContest) {
  return ((day - earlyMonday) / SECONDS_IN_DAY) % daysInContest
}

function _mustHavePlayedByNowFunc(
  today,
  earlyMonday,
  daysInContest,
  minimumDaysPlayed
) {
  const dow = _dayOfTheWeek(earlyMonday, today, daysInContest)
  const daysLeft = daysInContest - dow
  return daysLeft > minimumDaysPlayed ? 0 : minimumDaysPlayed - daysLeft
}

function _divRound(a, b) {
  if (typeof a !== 'bigint') a = BigInt(a)
  if (typeof b !== 'bigint') b = BigInt(b)
  if (b === 0n) return 0 // Avoid division by zero
  let result = a / b
  if ((a % b) * 2n >= b) result++
  // Use BigNumber for results exceeding MAX_SAFE_INTEGER if BigNumber is available/required
  // Assuming standard JS numbers for now as BigNumber is not imported here
  // if (result > BigInt(Number.MAX_SAFE_INTEGER)) {
  //   return BigNumber.from(result); // Requires BigNumber import
  // }
  return parseInt(result.toString()) // Convert BigInt back to Number safely if within limits
}

function _initializeWeeklyData(recordsByWeek, players, week, run) {
  if (!recordsByWeek[week]) recordsByWeek[week] = {}
  if (!recordsByWeek[week][run.day]) recordsByWeek[week][run.day] = {}
  if (!recordsByWeek[week][run.day][run.player])
    recordsByWeek[week][run.day][run.player] = []

  if (!players[week]) players[week] = {}
  if (!players[week][run.player]) {
    players[week][run.player] = {
      uniqueDays: new Set(),
      fastestDays: {}, // Stores fastest run time for each day { day: time }
      slowestDays: {}, // Stores slowest run time for each day { day: time }
      average: { totalTime: 0, totalRuns: 0, average: 0 },
      allRuns: [],
      lastPlayed: null
    }
  }
}

function _updatePlayerStats(players, week, run) {
  const playerWeekData = players[week][run.player]
  playerWeekData.uniqueDays.add(run.day)
  playerWeekData.allRuns.push(run)
  playerWeekData.lastPlayed = run.block_num

  // Update average
  playerWeekData.average.totalTime += run.time
  playerWeekData.average.totalRuns += 1
  playerWeekData.average.average = _divRound(
    playerWeekData.average.totalTime,
    playerWeekData.average.totalRuns
  )

  // Update fastest time for the specific day
  if (
    !playerWeekData.fastestDays[run.day] ||
    run.time < playerWeekData.fastestDays[run.day]
  ) {
    playerWeekData.fastestDays[run.day] = run.time
  }

  // Update slowest time for the specific day
  if (
    !playerWeekData.slowestDays[run.day] ||
    run.time > playerWeekData.slowestDays[run.day]
  ) {
    playerWeekData.slowestDays[run.day] = run.time
  }
}

function _updateDailyRecords(dailyRecordsBroken, day, week, run) {
  if (!dailyRecordsBroken[day]) {
    dailyRecordsBroken[day] = {
      week: week,
      fastest: { runid: null, player: null, speed: null, records: [] },
      slowest: { runid: null, player: null, speed: null, records: [] }
    }
  }

  // Update daily fastest
  if (
    !dailyRecordsBroken[day].fastest.speed ||
    run.time < dailyRecordsBroken[day].fastest.speed
  ) {
    dailyRecordsBroken[day].fastest = {
      speed: run.time,
      player: run.player,
      runid: run.runid,
      records: [
        ...(dailyRecordsBroken[day].fastest.records || []),
        { week, ...run }
      ] // Append record
    }
  }

  // Update daily slowest
  if (
    !dailyRecordsBroken[day].slowest.speed ||
    run.time > dailyRecordsBroken[day].slowest.speed
  ) {
    dailyRecordsBroken[day].slowest = {
      speed: run.time,
      player: run.player,
      runid: run.runid,
      records: [
        ...(dailyRecordsBroken[day].slowest.records || []),
        { week, ...run }
      ] // Append record
    }
  }
}

function _updateWeeklyRecords(
  recordsBroken,
  currentFastest,
  currentSlowest,
  currentAverage,
  players,
  week,
  run,
  mustHavePlayedByNow,
  minimumDaysPlayed,
  globalAverage,
  isNewMiddy
) {
  const player = run.player
  const playerWeekData = players[week][player]
  const canRecord = playerWeekData.uniqueDays.size >= mustHavePlayedByNow

  // --- Update Average Record ---
  let averageRecordChanged = false
  let newAverageRecord = {}

  if (isNewMiddy) {
    // New Middy Logic: Closest run to global average wins
    const allRunsPerWeek = Object.values(players[week]).flatMap(
      (pData) => pData.allRuns
    )
    const closestRun = _stableSort(allRunsPerWeek, (a, b) => {
      const diffA = Math.abs(a.time - globalAverage)
      const diffB = Math.abs(b.time - globalAverage)
      if (diffA === diffB) return a.block_num - b.block_num
      return diffA - diffB
    })[0]

    if (
      !currentAverage[week] ||
      currentAverage[week].runid !== closestRun.runid
    ) {
      averageRecordChanged = true
      newAverageRecord = {
        runid: closestRun.runid,
        player: closestRun.player,
        time: closestRun.time, // Store the actual run time
        recordType: 'average'
      }
      currentAverage[week] = {
        // Update state for next iteration
        ...currentAverage[week], // Keep totalTime, totalRuns, average
        runid: closestRun.runid,
        player: closestRun.player
      }
    }
  } else {
    // Old Middy Logic: Player whose average is closest to global average wins
    const weekSortedByAverage = _stableSort(
      Object.entries(players[week]),
      (a, b) => {
        const diffA = Math.abs(a[1].average.average - globalAverage)
        const diffB = Math.abs(b[1].average.average - globalAverage)
        if (diffA === diffB) return a[1].lastPlayed - b[1].lastPlayed
        return diffA - diffB
      }
    )

    const winningPlayer = weekSortedByAverage[0][0]
    if (
      !currentAverage[week] ||
      currentAverage[week].player !== winningPlayer
    ) {
      // Check qualification only when setting the record
      if (players[week][winningPlayer].uniqueDays.size >= mustHavePlayedByNow) {
        averageRecordChanged = true
        newAverageRecord = {
          player: winningPlayer,
          time: players[week][winningPlayer].average.average, // Store the player's average time
          recordType: 'average'
        }
        currentAverage[week] = {
          // Update state for next iteration
          ...currentAverage[week], // Keep totalTime, totalRuns, average
          player: winningPlayer,
          runid: null // runid not applicable for old middy average
        }
      }
    }
  }

  if (averageRecordChanged) {
    if (!recordsBroken[week]) recordsBroken[week] = []
    recordsBroken[week].push({
      week,
      day: run.day, // Day the record *could* have been broken (might not be exact day for old middy)
      block_num: run.block_num, // Block num the record *could* have been broken
      globalAverage,
      ...newAverageRecord
    })
  }

  // --- Update Slowest Record ---
  const slowestDaysSorted = _stableSort(
    Object.entries(playerWeekData.slowestDays),
    (a, b) => b[1] - a[1]
  )
  const slowestDaysSliced = slowestDaysSorted.slice(0, minimumDaysPlayed)
  const currentTimeSlow = _divRound(
    slowestDaysSliced.reduce((acc, [, time]) => acc + time, 0),
    slowestDaysSliced.length
  )

  if (!currentSlowest[week] || currentTimeSlow > currentSlowest[week].time) {
    const difference = currentSlowest[week]
      ? Math.abs(currentTimeSlow - currentSlowest[week].time)
      : null
    currentSlowest[week] = { player, time: currentTimeSlow }
    if (canRecord) {
      if (!recordsBroken[week]) recordsBroken[week] = []
      recordsBroken[week].push({
        week,
        day: run.day,
        block_num: run.block_num,
        player,
        time: currentTimeSlow,
        difference,
        recordType: 'slowest'
      })
    }
  }

  // --- Update Fastest Record ---
  const fastestDaysSorted = _stableSort(
    Object.entries(playerWeekData.fastestDays),
    (a, b) => a[1] - b[1]
  )
  const fastestDaysSliced = fastestDaysSorted.slice(0, minimumDaysPlayed)
  const currentTimeFast = parseFloat(
    fastestDaysSliced.reduce((acc, [, time]) => acc + time, 0) /
      fastestDaysSliced.length
  )

  if (!currentFastest[week] || currentTimeFast < currentFastest[week].time) {
    const difference = currentFastest[week]
      ? Math.abs(currentTimeFast - currentFastest[week].time)
      : null
    currentFastest[week] = { player, time: currentTimeFast }
    if (canRecord) {
      if (!recordsBroken[week]) recordsBroken[week] = []
      recordsBroken[week].push({
        week,
        day: run.day,
        block_num: run.block_num,
        player,
        time: currentTimeFast,
        difference,
        recordType: 'fastest'
      })
    }
  }
}

function _calculateWeeklyLeaderboards(
  weeklyData,
  minimumDaysPlayed,
  globalAverage,
  isNewMiddy,
  daysLeftInWeek
) {
  const playerWeekly = {}
  const allRunsOfWeek = []

  // Aggregate player data for the week
  for (const _day in weeklyData) {
    for (const player in weeklyData[_day]) {
      if (!playerWeekly[player]) {
        playerWeekly[player] = {
          fastestDaysRuns: [], // Store actual run objects for the fastest time each day
          slowestDaysRuns: [], // Store actual run objects for the slowest time each day
          allDaysRuns: [], // Store all run objects for the player in the week
          uniqueDays: new Set(),
          average: 0,
          lastPlayed: 0,
          minimumDaysReached: false,
          canStillCompleteWeek: false
        }
      }

      const playerDayData = weeklyData[_day][player]
      const lastPlayedBlock = Math.max(...playerDayData.map((r) => r.block_num)) // Find max block_num for the day

      playerWeekly[player].lastPlayed = Math.max(
        playerWeekly[player].lastPlayed,
        lastPlayedBlock
      )
      playerWeekly[player].uniqueDays.add(_day)
      playerWeekly[player].allDaysRuns.push(...playerDayData)

      // Find the single fastest run for the day
      const fastestRunOfDay = _stableSort(
        playerDayData,
        (a, b) => a.time - b.time || a.block_num - b.block_num
      )[0]
      playerWeekly[player].fastestDaysRuns.push(fastestRunOfDay)

      // Find the single slowest run for the day
      const slowestRunOfDay = _stableSort(
        playerDayData,
        (a, b) => b.time - a.time || a.block_num - b.block_num
      )[0]
      playerWeekly[player].slowestDaysRuns.push(slowestRunOfDay)

      allRunsOfWeek.push(...playerDayData)
    }
  }

  // Calculate final weekly stats and leaderboard rankings
  const leaderboardPlayers = Object.entries(playerWeekly).map(
    ([player, data]) => {
      data.minimumDaysReached = data.uniqueDays.size >= minimumDaysPlayed
      data.canStillCompleteWeek =
        data.uniqueDays.size + daysLeftInWeek >= minimumDaysPlayed

      // Sort and slice fastest/slowest runs for the week
      data.fastestDaysRuns = _stableSort(
        data.fastestDaysRuns,
        (a, b) => a.time - b.time || a.block_num - b.block_num
      ).slice(0, minimumDaysPlayed)
      // if the fastestDaysRuns is less than minimumDaysPlayed, remove it from the array
      data.slowestDaysRuns = _stableSort(
        data.slowestDaysRuns,
        (a, b) => b.time - a.time || a.block_num - b.block_num
      ).slice(0, minimumDaysPlayed)

      // const fastTime = _divRound(
      //   data.fastestDaysRuns.reduce((acc, run) => acc + run.time, 0),
      //   data.fastestDaysRuns.length
      // )
      const fastTime = data.fastestDaysRuns.reduce(
        (acc, run) => acc + run.time,
        0
      )
      const fastTimeAvg = parseFloat(
        fastTime / data.fastestDaysRuns.length
      ).toFixed(3)
      const slowTime = data.slowestDaysRuns.reduce(
        (acc, run) => acc + run.time,
        0
      )

      const userTotalTime = data.allDaysRuns.reduce(
        (acc, run) => acc + run.time,
        0
      )
      data.average = _divRound(userTotalTime, data.allDaysRuns.length)

      // Determine the block number when the score was set (latest block_num among contributing runs)
      const fastestScoreSetBlockNum = data.fastestDaysRuns.reduce(
        (max, run) => Math.max(max, run.block_num),
        0
      )
      const slowestScoreSetBlockNum = data.slowestDaysRuns.reduce(
        (max, run) => Math.max(max, run.block_num),
        0
      )

      return {
        player,
        fastestDays: data.fastestDaysRuns, // Keep the run objects
        slowestDays: data.slowestDaysRuns, // Keep the run objects
        lastPlayed: data.lastPlayed, // Keep overall last played block_num
        fastTime,
        fastTimeAvg,
        slowTime,
        average: data.average,
        minimumDaysMet: data.minimumDaysReached,
        canStillCompleteWeek: data.canStillCompleteWeek,
        fastestScoreSetBlockNum,
        slowestScoreSetBlockNum,
        uniqueDays: data.uniqueDays,
        allDaysRuns: data.allDaysRuns // Needed for average calculation tiebreaker (old middy)
      }
    }
  )

  // --- Sort Leaderboards ---
  // Fastest Leaderboard
  const fastest = _stableSort(
    leaderboardPlayers.filter(
      (p) => p.canStillCompleteWeek || p.minimumDaysMet
    ),
    (a, b) => {
      if (a.fastTimeAvg === b.fastTimeAvg) {
        // Tie-breaker: Lower block number when score was set wins
        return a.fastestScoreSetBlockNum - b.fastestScoreSetBlockNum
      }
      // Primary sort: Lower average time wins
      return Number(a.fastTimeAvg) - Number(b.fastTimeAvg)
    }
  )

  // Slowest Leaderboard
  const slowest = _stableSort(
    leaderboardPlayers.filter(
      (p) => p.canStillCompleteWeek || p.minimumDaysMet
    ),
    (a, b) => {
      if (a.slowTime === b.slowTime) {
        // Tie-breaker: Lower block number when score was set wins
        return a.slowestScoreSetBlockNum - b.slowestScoreSetBlockNum
      }
      // Primary sort: Higher average time wins
      return b.slowTime - a.slowTime
    }
  )

  // Average Leaderboard
  let mostAverage
  if (isNewMiddy) {
    // New Middy: Sort all individual runs by distance to global average
    mostAverage = _stableSort(allRunsOfWeek, (a, b) => {
      const diffA = Math.abs(a.time - globalAverage)
      const diffB = Math.abs(b.time - globalAverage)
      if (diffA === diffB) return a.block_num - b.block_num
      return diffA - diffB
    })
  } else {
    // Old Middy: Sort players by distance of their *average* to global average
    mostAverage = _stableSort(
      leaderboardPlayers.filter(
        (p) => p.canStillCompleteWeek || p.minimumDaysMet
      ),
      (a, b) => {
        const diffA = Math.abs(a.average - globalAverage)
        const diffB = Math.abs(b.average - globalAverage)
        if (diffA === diffB) {
          // Tie-breaker: Player who last played earlier wins
          return a.lastPlayed - b.lastPlayed
        }
        return diffA - diffB
      }
    )
  }

  return { fastest, slowest, mostAverage, globalAverage }
}

// Main Function
const calculateRecords = (days, chains, appChainId) => {
  const { daysInContest, minimumDaysPlayed, earlyMonday } =
    _getTournamentConfig(chains, appChainId)

  const recordsByWeek = {}
  const players = {} // { [week]: { [player]: playerData } }
  const currentFastest = {} // { [week]: { player, time } }
  const currentSlowest = {} // { [week]: { player, time } }
  const currentAverage = {} // { [week]: { player?, runid?, totalTime, totalRuns, average } } - structure varies slightly by middy version
  const recordsBroken = {} // { [week]: [recordEvent] }
  const dailyRecordsBroken = {} // { [day]: { week, fastest: {...}, slowest: {...} } }

  // --- Phase 1: Process Runs Day by Day ---
  const sortedDays = Object.keys(days).sort((a, b) => parseInt(a) - parseInt(b))
  let lastRun = null // For checking sort order within a day

  for (const day of sortedDays) {
    const dayInt = parseInt(day)
    const runs = days[day].runs
    if (!runs || runs.length === 0) continue // Skip empty days

    const week = _weekNumber(dayInt, earlyMonday, daysInContest)
    if (week < 0) continue // Skip runs before the tournament starts

    const mustHavePlayedByNow = _mustHavePlayedByNowFunc(
      dayInt,
      earlyMonday,
      daysInContest,
      minimumDaysPlayed
    )
    const isNewMiddy = dayInt >= newMiddyStart

    // Initialize weekly average state if not present
    if (!currentAverage[week]) {
      currentAverage[week] = { totalTime: 0, totalRuns: 0, average: 0 } // Initial state needed for global avg calc
    }

    // Process each run within the day
    const sortedRuns = _stableSort(runs, (a, b) => a.runid - b.runid) // Ensure runs are sorted by runid
    for (const run of sortedRuns) {
      // Basic validation (optional, but good practice)
      if (lastRun && run.runid < lastRun.runid && run.day === lastRun.day) {
        console.error(
          `Runs out of order: Day ${day}, Run ${run.runid} after ${lastRun.runid}`
        )
        // Decide whether to throw error or just log
      }
      lastRun = run // Update lastRun for the next iteration

      _initializeWeeklyData(recordsByWeek, players, week, run)
      recordsByWeek[week][run.day][run.player].push(run) // Store raw run data grouped by week/day/player

      _updatePlayerStats(players, week, run)
      _updateDailyRecords(dailyRecordsBroken, dayInt, week, run)

      // Update weekly running totals for average calculation *before* updating records
      currentAverage[week].totalTime += run.time
      currentAverage[week].totalRuns += 1
      const globalAverage = _divRound(
        currentAverage[week].totalTime,
        currentAverage[week].totalRuns
      )
      currentAverage[week].average = globalAverage // Update the running global average

      _updateWeeklyRecords(
        recordsBroken,
        currentFastest,
        currentSlowest,
        currentAverage,
        players,
        week,
        run,
        mustHavePlayedByNow,
        minimumDaysPlayed,
        globalAverage, // Pass calculated global average
        isNewMiddy
      )
    }
  }

  // --- Phase 2: Calculate Final Weekly Leaderboards ---
  const finalRecordsByWeek = {}
  const sortedWeeks = Object.keys(recordsByWeek)
    .map(Number)
    .sort((a, b) => a - b)

  for (const [index, week] of sortedWeeks.entries()) {
    if (week < 0) continue // Should already be filtered, but double-check

    const weeklyData = recordsByWeek[week] // Raw run data grouped by day/player
    const startOfWeek = _weekNumberToDay(week, earlyMonday, daysInContest)
    const isNewMiddy = startOfWeek >= newMiddyStart // Use start of week for consistency

    const globalAverageForWeek = currentAverage[week]?.average ?? 0 // Get final global average for the week
    let daysLeftInWeek = 7 - Object.keys(weeklyData).length + 1
    const nextWeekExists = index < sortedWeeks.length - 1
    if (nextWeekExists) {
      daysLeftInWeek -= 1
    }
    const leaderboards = _calculateWeeklyLeaderboards(
      weeklyData,
      minimumDaysPlayed,
      globalAverageForWeek,
      isNewMiddy,
      daysLeftInWeek
    )

    const dailyRecordsForWeek = Object.entries(dailyRecordsBroken)
      .filter(([, record]) => record.week === week)
      .map(([day, record]) => ({ day: parseInt(day), ...record })) // Add day key

    finalRecordsByWeek[week] = {
      dailyRecords: dailyRecordsForWeek,
      currentFastest: currentFastest[week], // Store the final winning record state
      recordsBroken: recordsBroken[week] || [], // Ensure array exists
      ...leaderboards // Includes fastest, slowest, mostAverage, globalAverage
    }
  }

  return finalRecordsByWeek
}

const _stableSort = function (array, compare) {
  const stabilizedThis = array.map((el, index) => [el, index])
  stabilizedThis.sort((a, b) => {
    const order = compare(a[0], b[0])
    if (order !== 0) return order
    return a[1] - b[1]
  })
  return stabilizedThis.map((el) => el[0])
}

const convertData_LevelsToRuns = (data) => {
  if (!data) return { runs: [], levels: [] }
  // const data = [
  //   ['player', 'day', 'runid', 'level', 'time', 'accumulativetime'],
  //   ['0x12e57746915157cdac8e5948caef9bc032fef10b', '1729296000', '964', '2', '51', '359']
  // ]
  const columns = data[0]
  const records = data.slice(1)

  const days = records.reduce((pV, cV) => {
    const levelObj = {}
    columns.forEach((col, index) => {
      levelObj[col] =
        index !== 0 ? parseInt(cV[index]) : cV[index]?.toLowerCase()
    })
    levelObj.date = new Date(levelObj.day * 1000).toISOString().split('T')[0]
    const { runid, day, player, date, level, time, block_num } = levelObj

    if (!pV[day]) {
      pV[day] = {
        levels: [],
        runs: {}
      }
    }

    pV[day].levels.push(levelObj)

    if (!pV[day].runs[runid]) {
      pV[day].runs[runid] = {
        player,
        day,
        runid,
        date,
        time,
        block_num,
        levels: []
      }
    } else {
      pV[day].runs[runid].time += time
    }
    pV[day].runs[runid].levels.push({
      level,
      time
    })
    return pV
  }, {})
  Object.keys(days).forEach((day) => {
    days[day].runs = Object.values(days[day].runs)
  })
  return days

  // const formattedData = records.map((record) => {
  //   let obj = {}
  //   columns.forEach((col, index) => {
  //     obj[col] = record[index]
  //   })
  //   return obj
  // })

  // console.log(formattedData)
}

const foo = () => {
  console.log('foo')
}

const SECONDS_IN_A_DAY = 86400
const currentDay = () =>
  Math.floor(Date.now() / 1000) -
  (Math.floor(Date.now() / 1000) % SECONDS_IN_A_DAY)

const GAME_LENGTH_BY_LEVEL_INDEX = [30, 10, 20, 30, 40]
const LEVELS = GAME_LENGTH_BY_LEVEL_INDEX.length - 1

export {
  LEVELS,
  GAME_LENGTH_BY_LEVEL_INDEX,
  SECONDS_IN_A_DAY,
  currentDay,
  foo,
  convertData_LevelsToRuns,
  calculateRecords,
  _convertBigIntToModP,
  _approxDist,
  _approxSqrt,
  _approxDiv,
  _customParse,
  _customStringify,
  _copy,
  // _calculateTime,
  // _explosion,
  _addVectors,
  _stableSort
  // _validateSeed
}
