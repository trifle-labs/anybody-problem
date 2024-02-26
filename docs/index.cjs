let body1, body2, body3, body4, c1, c2, c3, c4, s1, s2, s3, s4, bg
const radius = 50
const G = 100 // Gravitational constant
const friction = 1 // Damping factor for friction
const speedLimit = 10
const vectorLimit = 10
const minDistance = 200 // was 200 * 200
const minDistanceSquared = minDistance * minDistance
const windowWidth = 1000
const rightEdge = windowWidth, topEdge = 0, leftEdge = 0, bottomEdge = windowWidth

const boundaryRadius = windowWidth / 2
let n = 0, img1
const fps = 30
const preRun = 0
const prime = 21888242871839275222246405745257275088548364400416034343698204186575808495617n
const admin = false
const minRadius = 50
const maxRadius = 100
const position = '!static'
const colorStyle = '!squiggle'
let totalBodies = 3
// const initialBodies = totalBodies
// console.log({ totalBodies })
const outlines = false
const clearBG = true


let cs = [], ss = [], bodies = []

var showIt = false
var keepSimulating = true
var runIndex = 0
function go() {
  while (keepSimulating) {
    runIndex++
    const results = runComputation(bodies, missiles)
    bodies = results.bodies
    missiles = results.missiles

    if (runIndex > preRun) {
      keepSimulating = false
      showIt = true
      console.log(`${preRun.toLocaleString()} runs`)
    }
  }
}

function setup() {
  const seed = random(0, 100000)
  console.log({ seed })
  randomSeed(seed)


  // ellipseMode(CENTER);
  // rectMode(CENTER);

  frameRate(fps)
  createCanvas(windowWidth, windowWidth)
  background(0)
  bodies = prepBodies()
  background('white')
  colorMode(HSB, 360, 100, 100) // Use HSB color mode
  line(0, 0, windowWidth, windowWidth)
  line(windowWidth, 0, 0, windowWidth)
  stroke('white')
  if (!outlines) {
    noStroke()
  }
  go()
  window.initialBodies = convertBodiesToBigInts(bodies).map(convertScaledBigIntBodyToArray)
  addListener()
}

function prepBodies() {
  ss = []
  cs = []
  bodies = []
  const opac = 1
  for (let i = 0; i < totalBodies; i++) {
    let cc = randomColor()
    cc.push(opac)
    cc = `rgba(${cc.join(',')})`
    cs.push(cc)
  }
  for (let i = 0; i < totalBodies; i++) {
    let s = randomPosition()
    ss.push(s)
  }
  // if (totalBodies.length > 10) {
  //   alert("didn't account for this many bodies")
  //   throw new Error("too many bodies")
  // }
  let maxSize = totalBodies < 10 ? 10 : totalBodies
  for (let i = 0; i < maxSize; i++) {
    if (i >= totalBodies) break
    const body = {
      position: createVector(ss[i][0], ss[i][1]),
      velocity: createVector(0, 0),
      radius: (maxSize - i) + 3,
      c: cs[i]
    }
    bodies.push(body)
  }
  bodies = bodies
    .sort((a, b) => b.radius - a.radius)
  return bodies
}

function addVectors(v1, v2) {
  return [v1[0] + v2[0], v1[1] + v2[1]]
}

function forceAccumulator(bodies) {
  bodies = convertBodiesToBigInts(bodies)
  bodies = forceAccumulatorBigInts(bodies)
  bodies = convertBigIntsToBodies(bodies)
  return bodies
}

function forceAccumulatorBigInts(bodies) {
  // console.dir({ bodies: bodies.map(convertScaledBigIntBodyToArray) }, { depth: null })
  const vectorLimitScaled = convertFloatToScaledBigInt(vectorLimit)
  let accumulativeForces = []
  for (let i = 0; i < bodies.length; i++) {
    accumulativeForces.push([0n, 0n])
  }
  let ii = 0
  for (let i = 0; i < bodies.length; i++) {
    const body = bodies[i]
    for (let j = i + 1; j < bodies.length; j++) {
      const otherBody = bodies[j]
      const force = calculateForceBigInt(body, otherBody)
      accumulativeForces[i] = addVectors(accumulativeForces[i], force)
      accumulativeForces[j] = addVectors(accumulativeForces[j], [-force[0], -force[1]])
      ii++
    }
  }
  for (let i = 0; i < bodies.length; i++) {
    const body = bodies[i]
    const body_velocity = addVectors([body.velocity.x, body.velocity.y], accumulativeForces[i])//.mult(friction);
    body.velocity.x = body_velocity[0]
    body.velocity.y = body_velocity[1]
    const body_velocity_x_abs = body.velocity.x > 0n ? body.velocity.x : -1n * body.velocity.x
    if (body_velocity_x_abs > vectorLimitScaled) {
      body.velocity.x = (body_velocity_x_abs / body.velocity.x) * vectorLimitScaled
    }
    const body_velocity_y_abs = body.velocity.y > 0n ? body.velocity.y : -1n * body.velocity.y
    if (body_velocity_y_abs > vectorLimitScaled) {
      body.velocity.y = (body_velocity_y_abs / body.velocity.y) * vectorLimitScaled
    }
    // body.velocity.limit(speedLimit);
    const body_position = addVectors([body.position.x, body.position.y], [body.velocity.x, body.velocity.y])
    body.position.x = body_position[0]
    body.position.y = body_position[1]
  }

  // console.log('before limiter')
  // console.dir({ bodies_0: convertScaledBigIntBodyToArray(bodies[0]) }, { depth: null })

  // const xOffset = bodies[bodies.length - 1].position.x
  // const yOffset = bodies[bodies.length - 1].position.y
  const scaledWindowWidth = convertFloatToScaledBigInt(windowWidth)
  for (let i = 0; i < bodies.length; i++) {
    const body = bodies[i]
    // if (position == "static") {
    //   body.position = [body.position.x - xOffset + scaledWindowWidth / 2, body.position.y - yOffset + scaledWindowWidth / 2]
    // }
    if (body.position.x > scaledWindowWidth) {
      body.position.x = 0n
    } else if (body.position.x < 0n) {
      body.position.x = scaledWindowWidth
    }
    if (body.position.y > scaledWindowWidth) {
      body.position.y = 0n
    } else if (body.position.y < 0n) {
      body.position.y = scaledWindowWidth
    }
  }
  return bodies
}

function runComputationBigInt(bodies, missiles) {
  // console.dir({ 'bodies': bodies }, { depth: null })
  bodies = forceAccumulatorBigInts(bodies)
  // console.dir({ 'bodies': bodies }, { depth: null })
  return detectCollisionBigInt(bodies, missiles)
  // bodies = results.bodies
  // missiles = results.missiles

  // TODO: need to confirm missile array logic is consistent between circuit and js
  // if (missiles.length > 0 && missiles[0].radius == 0n) {
  //   missiles.splice(0, 1)
  // }

  // TODO: in future may need to include changing level in big int testing
  // if (bodies.reduce((a, c) => a + c.radius, 0n) == 0n) {
  //   const level = {
  //     thisLevelMissileCount,
  //     thisLevelSec
  //   }
  //   allLevelSec.unshift(level)
  //   thisLevelSec = 0
  //   thisLevelMissileCount = 0
  //   totalBodies += 1

  //   bodies = prepBodies()
  // }
  // return { bodies, missiles }

}

function runComputation(bodies, missiles) {

  bodies = forceAccumulator(bodies)
  var results = detectCollision(bodies, missiles)
  bodies = results.bodies
  missiles = results.missiles

  if (missiles.length > 0 && missiles[0].radius == 0) {
    missiles.splice(0, 1)
  }

  if (bodies.reduce((a, c) => a + c.radius, 0) == 0) {
    const level = {
      thisLevelMissileCount,
      thisLevelSec
    }
    allLevelSec.unshift(level)
    thisLevelSec = 0
    thisLevelMissileCount = 0
    totalBodies += 1

    bodies = prepBodies()
  }
  return { bodies, missiles }
}


function approxDist(x1, y1, x2, y2) {
  const absX = x1 > x2 ? x1 - x2 : x2 - x1
  const absY = y1 > y2 ? y1 - y2 : y2 - y1
  const dxs = absX * absX
  const dys = absY * absY
  const distanceSquared = dxs + dys
  const distance = approxSqrt(distanceSquared)
  return distance
}

function detectCollisionBigInt(bodies, missiles) {
  if (missiles.length == 0) {
    return { bodies, missiles }
  }
  const missile = missiles[0]
  missile.position.x += missile.velocity.x
  missile.position.y += missile.velocity.y

  if (missile.position.x > BigInt(rightEdge) * scalingFactor || missile.position.y < 0n) {
    console.log('missile is off screen')
    missile.radius = 0n
  }

  for (let j = 0; j < bodies.length; j++) {
    const body = bodies[j]
    const distance = approxDist(missile.position.x, missile.position.y, body.position.x, body.position.y)
    // NOTE: this is to match the circuit. If the missile is gone, set minDist to 0
    // Need to make sure comparison of distance is < and not <= for this to work
    // because they may by chance be at the exact same coordinates and should still
    // not trigger an explosion since the missile is already gone.
    const minDist = missile.radius == 0n ? 0n : body.radius * 2n
    if (distance < minDist) {
      missile.radius = 0n
      // console.log('missile hit')
      explosions.push(explosion(convertScaledBigIntToFloat(body.position.x), convertScaledBigIntToFloat(body.position.y), convertScaledBigIntToFloat(body.radius)))
      bodies[j].radius = 0n
    }
  }

  missiles[0] = missile
  return { bodies, missiles }
}

function detectCollision(bodies, missiles) {
  let bigBodies = convertBodiesToBigInts(bodies)
  const bigMissiles = convertBodiesToBigInts(missiles)

  const { bodies: newBigBodies, missiles: newBigMissiles } = detectCollisionBigInt(bigBodies, bigMissiles)

  bodies = convertBigIntsToBodies(newBigBodies)
  missiles = convertBigIntsToBodies(newBigMissiles)

  return { bodies, missiles }
}


function explosion(x, y, radius) {
  let bombs = []
  for (let i = 0; i < 100; i++) {
    bombs.push({
      x, y, i, radius
    })
  }
  return bombs
}

const scalingFactor = 10n ** 3n

function calculateForce(body1, body2) {
  const bodies = convertBodiesToBigInts([body1, body1])
  body1 = bodies[0]
  body2 = bodies[1]
  const forces = calculateForceBigInt(body1, body2)
  return [parseInt(forces[0]) / parseInt(scalingFactor), parseInt(forces[1]) / parseInt(scalingFactor)]
}

// Calculate the gravitational force between two bodies
function calculateForceBigInt(body1, body2) {
  // console.log({ p })
  const GScaled = BigInt(Math.floor(G * parseInt(scalingFactor)))
  // console.log({ GScaled })

  let minDistanceScaled = BigInt(minDistanceSquared) * scalingFactor ** 2n // when the original gets squared, the scaling factor gets squared
  // console.log({ minDistanceScaled })

  const position1 = body1.position

  const body1_position_x = position1.x
  // console.log({ body1_position_x })
  const body1_position_y = position1.y
  // console.log({ body1_position_y })
  const body1_radius = body1.radius


  const position2 = body2.position
  const body2_position_x = position2.x
  // console.log({ body2_position_x })
  const body2_position_y = position2.y
  // console.log({ body2_position_y })
  const body2_radius = body2.radius


  let dx = body2_position_x - body1_position_x
  let dy = body2_position_y - body1_position_y
  const dxAbs = dx > 0n ? dx : -1n * dx
  const dyAbs = dy > 0n ? dy : -1n * dy

  // console.log({ dx, dy })
  // console.log({ dxAbs, dyAbs })

  const dxs = dx * dx
  const dys = dy * dy
  // console.log({ dxs, dys })


  let distanceSquared
  const unboundDistanceSquared = dxs + dys
  // console.log({ unboundDistanceSquared })
  if (unboundDistanceSquared < minDistanceScaled) {
    distanceSquared = minDistanceScaled
  } else {
    distanceSquared = unboundDistanceSquared
  }
  let distance = approxSqrt(distanceSquared)
  // console.log({ distance })
  // console.log({ distanceSquared })

  const bodies_sum = body1_radius == 0n || body2_radius == 0n ? 0n : (body1_radius + body2_radius) * 4n // NOTE: this could be tweaked as a variable for "liveliness" of bodies
  // console.log({ bodies_sum })

  const distanceSquared_with_avg_denom = distanceSquared * 2n // NOTE: this is a result of moving division to the end of the calculation
  // console.log({ distanceSquared_with_avg_denom })
  const forceMag_numerator = GScaled * bodies_sum * scalingFactor // distancec should be divided by scaling factor but this preserves rounding with integer error
  // console.log({ forceMag_numerator })

  const forceDenom = distanceSquared_with_avg_denom * distance
  // console.log({ forceDenom })

  const forceXnum = dxAbs * forceMag_numerator
  // console.log({ forceXnum })
  const forceXunsigned = approxDiv(forceXnum, forceDenom)
  // console.log({ forceXunsigned })
  const forceX = dx < 0n ? -forceXunsigned : forceXunsigned
  // console.log({ forceX })

  const forceYnum = dyAbs * forceMag_numerator
  // console.log({ forceYnum })
  const forceYunsigned = approxDiv(forceYnum, forceDenom)
  // console.log({ forceYunsigned })
  const forceY = dy < 0n ? -forceYunsigned : forceYunsigned
  // console.log({ forceY })
  return [forceX, forceY]
}


function approxDiv(dividend, divisor) {
  if (dividend == 0n) {
    return 0n
  }

  // Create internal signals for our binary search
  var lo, hi, mid, testProduct

  // Initialize our search space
  lo = 0n
  hi = dividend  // Assuming worst case where divisor = 1

  while (lo < hi) {  // 32 iterations for 32-bit numbers as an example
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


function approxSqrt(n) {
  // console.log({ n })
  if (n == 0n) {
    return 0n
  }
  var lo = 0n
  var hi = n >> 1n
  var mid, midSquared
  // console.log({ lo, hi })
  while (lo <= hi) {
    mid = (lo + hi) >> 1n // multiplication by multiplicative inverse is not what we want so we use >>
    // console.log({ lo, mid, hi })
    // TODO: Make more accurate by checking if lo + hi is odd or even before bit shifting
    midSquared = (mid * mid)
    if (midSquared == n) {
      // console.log(`final perfect`, { lo, mid, hi })
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


function checkCollision(body1, body2) {
  const distance = dist(body1.position.x, body1.position.y, body2.position.x, body2.position.y)
  const minDist = (body1.radius + body2.radius) / 4

  if (distance < minDist) {
    // Calculate collision response
    const angle = atan2(body2.position.y - body1.position.y, body2.position.x - body1.position.x)
    const overlap = minDist - distance

    const totalMass = body1.radius ** 2 + body2.radius ** 2
    const overlapRatio1 = body2.radius / totalMass
    const overlapRatio2 = body1.radius / totalMass

    const deltaX = -cos(angle) * overlap
    const deltaY = -sin(angle) * overlap

    body1.position.x -= deltaX * overlapRatio1
    body1.position.y -= deltaY * overlapRatio1
    body2.position.x += deltaX * overlapRatio2
    body2.position.y += deltaY * overlapRatio2

    // Update velocities
    const angle1 = atan2(body1.velocity.y, body1.velocity.x)
    const angle2 = atan2(body2.velocity.y, body2.velocity.x)
    const speed1 = body1.velocity.mag()
    const speed2 = body2.velocity.mag()

    const newVelX1 = cos(angle1) * speed2
    const newVelY1 = sin(angle1) * speed2
    const newVelX2 = cos(angle2) * speed1
    const newVelY2 = sin(angle2) * speed1

    body1.velocity.set(newVelX1, newVelY1)
    body2.velocity.set(newVelX2, newVelY2)
  }
}

let missiles = []
let missileCount = 0
let thisLevelMissileCount = 0
let explosions = []
function addListener() {
  if (typeof window !== 'undefined') {
    const body = document.getElementsByClassName('p5Canvas')[0]
    body.addEventListener('click', function (e) {
      if (missiles.length > 0 && !admin) return
      thisLevelMissileCount++
      missileCount++
      const actualWidth = body.offsetWidth
      const x = e.offsetX * windowWidth / actualWidth
      const y = e.offsetY * windowWidth / actualWidth
      console.log({ x, y })
      const b = {
        position: createVector(0, windowWidth),
        velocity: createVector(x, y - windowWidth),
        radius: 10,
      }
      b.velocity.limit(10)
      missiles.push(b)
    })
  }
}

let allCopiesOfBodies = []

function draw() {
  if (!showIt) return
  n++
  if (n % 100 == 0) {
    // console.log({ bodies })
  }
  noFill()
  // Set the background color with low opacity to create trails
  if (clearBG == 'fade') {
    background(255, 0.3)
  } else if (clearBG) {
    background(255)
    // background("white")
  }

  const results = runComputation(bodies, missiles)
  bodies = results.bodies
  missiles = results.missiles

  for (let i = 0; i < allCopiesOfBodies.length; i++) {
    const copyOfBodies = allCopiesOfBodies[i]
    for (let j = 0; j < copyOfBodies.length; j++) {
      const body = copyOfBodies[j]
      const c = body.c
      let finalColor
      if (colorStyle == 'squiggle') {
        const hueColor = (parseInt(c.split(',')[1]) + n) % 360
        finalColor = color(hueColor, 60, 100) // Saturation and brightness at 100 for pure spectral colors
      } else {
        finalColor = c
      }
      fill(finalColor)
      push()
      translate(body.position.x, body.position.y)
      var angle = body.velocity.heading() + PI / 2
      rotate(angle)
      let x1 = body.radius * 4 * cos(PI / 6)
      let y1 = body.radius * 4 * sin(PI / 6)

      let x2 = body.radius * 4 * cos(PI / 6 + TWO_PI / 3)
      let y2 = body.radius * 4 * sin(PI / 6 + TWO_PI / 3)

      let x3 = body.radius * 4 * cos(PI / 6 + 2 * TWO_PI / 3)
      let y3 = body.radius * 4 * sin(PI / 6 + 2 * TWO_PI / 3)
      triangle(x1, y1, x2, y2, x3, y3)
      pop()
    }
  }

  const bodyCopies = []
  for (let i = 0; i < bodies.length; i++) {
    const body = bodies[i]
    const c = body.c
    let finalColor
    if (colorStyle == 'squiggle') {
      const hueColor = (parseInt(c.split(',')[1]) + n) % 360
      finalColor = color(hueColor, 60, 100) // Saturation and brightness at 100 for pure spectral colors
    } else {
      finalColor = c
    }


    // rotate by velocity
    push()
    translate(body.position.x, body.position.y)
    var angle = body.velocity.heading() + PI / 2
    rotate(angle)

    strokeWeight(0)
    // stroke("white")
    fill(finalColor)
    // Calculate the vertices of the equilateral triangle
    let x1 = body.radius * 4 * cos(PI / 6)
    let y1 = body.radius * 4 * sin(PI / 6)

    let x2 = body.radius * 4 * cos(PI / 6 + TWO_PI / 3)
    let y2 = body.radius * 4 * sin(PI / 6 + TWO_PI / 3)

    let x3 = body.radius * 4 * cos(PI / 6 + 2 * TWO_PI / 3)
    let y3 = body.radius * 4 * sin(PI / 6 + 2 * TWO_PI / 3)

    triangle(x1, y1, x2, y2, x3, y3)
    pop()

    stroke('white')
    strokeWeight(1)
    // fill("white")
    // ellipse(body.position.x, body.position.y, body.radius * 4, body.radius * 4);
    push()
    translate(body.position.x, body.position.y)
    var angle = body.velocity.heading() + PI / 2
    rotate(angle)

    drawCenter(0, 0, body.radius)
    pop()
    const bodyCopy = {
      position: createVector(body.position.x, body.position.y),
      velocity: createVector(body.velocity.x, body.velocity.y),
      radius: body.radius,
      c: c
    }
    bodyCopies.push(bodyCopy)
  }
  allCopiesOfBodies.push(bodyCopies)
  if (allCopiesOfBodies.length > 50) {
    allCopiesOfBodies.shift()
  }

  fill('black')
  for (let i = 0; i < missiles.length; i++) {
    const body = missiles[i]
    strokeWeight(0)
    ellipse(body.position.x, body.position.y, body.radius / 2, body.radius / 2)
  }
  if (explosions.length > 0) {
    for (let i = 0; i < explosions.length; i++) {
      const bomb = explosions[i][0]
      drawCenter(bomb.x, bomb.y, bomb.radius)
    }
  }

  for (let i = 0; i < explosions.length; i++) {
    const explosion = explosions[i]
    const bomb = explosion[0]
    fill('red')
    ellipse(bomb.x, bomb.y, bomb.i * 2, bomb.i * 2)
    explosion.shift()
    if (explosion.length == 0) {
      explosions.splice(i, 1)
    }
  }

  // draw line between bottom left corner and direction towards mouse
  stroke('rgba(200,200,200,1)')
  strokeCap(SQUARE)
  strokeWeight(10)

  // Bottom left corner coordinates
  let startX = 0
  let startY = height

  // Calculate direction from bottom left to mouse
  let dirX = mouseX - startX
  let dirY = mouseY - startY

  // Calculate the length of the direction
  let len = sqrt(dirX * dirX + dirY * dirY)

  // If the length is not zero, scale the direction to have a length of 100
  if (len != 0) {
    dirX = (dirX / len) * 100
    dirY = (dirY / len) * 100
  }

  // Draw the line
  line(startX, startY, startX + dirX, startY + dirY)
  strokeWeight(0)


  // noStroke()
  fill('white')
  // stroke("black")
  rect(0, 0, 50, 20)
  // stroke("black");
  fill('black')
  // convert totalSec to time
  const secondsAsTime = new Date(totalSec * 1000).toISOString().substr(14, 5)
  const thisLevelSecondsAsTime = new Date(thisLevelSec * 1000).toISOString().substr(14, 5)
  text('Total Frames: ' + preRun + n, 0, 10)
  text('Total Time: ' + secondsAsTime, 0, 20)
  text('Total Shots: ' + missileCount, 0, 30)
  text('Lvl ' + (totalBodies - 2) + ' - ' + thisLevelSecondsAsTime + ' - ' + (totalBodies - bodies.length) + '/' + totalBodies + ' - ' + thisLevelMissileCount + ' shots', 0, 40)
  for (let i = 0; i < allLevelSec.length; i++) {
    const prevLevel = allLevelSec[i]
    const prevLevelSecondsAsTime = new Date(prevLevel.thisLevelSec * 1000).toISOString().substr(14, 5)
    text('Lvl ' + (allLevelSec.length - i) + ' - ' + prevLevelSecondsAsTime + ' - ' + prevLevel.thisLevelMissileCount + ' shots', 0, (i * 10) + 50)
  }
  // noStroke();
}

function drawCenter(x, y, r) {
  strokeWeight(0)
  const max = 4
  for (var i = 0; i < max; i++) {
    if (i % 2 == 0) {
      fill('white')
    } else {
      fill('red')
    }
    ellipse(x, y, r * (max - i))
  }
}
let allLevelSec = []
let totalSec = 0
let thisLevelSec = 0
setInterval(() => {
  thisLevelSec++
  totalSec++
}, 1000)

function randomColor() {
  const color = []
  // let c = Math.floor(random(0, 255))

  for (let i = 0; i < 3; i++) {
    let c = Math.floor(random(0, 255))
    color.push(c)
  }
  return color
}

function randomPosition() {
  const radiusDist = random(windowWidth * .47, windowWidth * .5)
  const randomDir = random(0, 360)
  const x = (radiusDist * Math.cos(randomDir)) + (windowWidth / 2)
  const y = radiusDist * Math.sin(randomDir) + (windowWidth / 2)
  return [x, y]
}

function convertScaledStringArrayToFloat(body) {
  const maxVectorScaled = convertFloatToScaledBigInt(vectorLimit)
  return {
    position: {
      x: convertScaledBigIntToFloat(body[0]),
      y: convertScaledBigIntToFloat(body[1])
    },
    velocity: {
      x: convertScaledBigIntToFloat(body[2]) - maxVectorScaled,
      y: convertScaledBigIntToFloat(body[3]) - maxVectorScaled
    },
    radius: convertScaledBigIntToFloat(body[4])
  }
}

function convertScaledStringArrayToBody(body) {
  const maxVectorScaled = convertFloatToScaledBigInt(vectorLimit)
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
}

function convertScaledBigIntBodyToArray(b) {
  const maxVectorScaled = convertFloatToScaledBigInt(vectorLimit)
  const bodyArray = []
  bodyArray.push(
    convertBigIntToModP(b.position.x),
    convertBigIntToModP(b.position.y),
    convertBigIntToModP(b.velocity.x + maxVectorScaled),
    convertBigIntToModP(b.velocity.y + maxVectorScaled),
    convertBigIntToModP(b.radius)
  )
  return bodyArray.map(b => b.toString())
}

function convertBigIntToModP(v) {
  let vmp = v % prime
  while (vmp < 0n) {
    vmp += prime
  }
  return vmp
}


function convertBodiesToBigInts(bodies) {
  const bigBodies = []
  const maxVectorScaled = convertFloatToScaledBigInt(vectorLimit)
  for (let i = 0; i < bodies.length; i++) {
    const body = bodies[i]
    const newBody = { position: {}, velocity: {}, radius: null }
    newBody.position.x = convertFloatToScaledBigInt(body.position.x)
    newBody.position.y = convertFloatToScaledBigInt(body.position.y)
    newBody.velocity.x = convertFloatToScaledBigInt(body.velocity.x)// + maxVectorScaled
    newBody.velocity.y = convertFloatToScaledBigInt(body.velocity.y)// + maxVectorScaled
    newBody.radius = convertFloatToScaledBigInt(body.radius)
    if (body.c) {
      newBody.c = body.c
    }
    bigBodies.push(newBody)
  }
  return bigBodies
}

function convertBigIntsToBodies(bigBodies) {
  const bodies = []
  for (let i = 0; i < bigBodies.length; i++) {
    const body = bigBodies[i]
    const newBody = { position: {}, velocity: {}, radius: null }
    newBody.position.x = convertScaledBigIntToFloat(body.position.x)
    newBody.position.y = convertScaledBigIntToFloat(body.position.y)
    newBody.position = createVector(newBody.position.x, newBody.position.y)

    newBody.velocity.x = convertScaledBigIntToFloat(body.velocity.x)
    newBody.velocity.y = convertScaledBigIntToFloat(body.velocity.y)
    newBody.velocity = createVector(newBody.velocity.x, newBody.velocity.y)

    newBody.radius = convertScaledBigIntToFloat(body.radius)
    if (body.c) {
      newBody.c = body.c
    }
    bodies.push(newBody)
  }
  return bodies
}

function convertFloatToScaledBigInt(value) {
  return BigInt(Math.floor(value * parseInt(scalingFactor)))
  // let maybeNegative = BigInt(Math.floor(value * parseInt(scalingFactor))) % p
  // while (maybeNegative < 0n) {
  //   maybeNegative += p
  // }
  // return maybeNegative
}

function convertScaledBigIntToFloat(value) {
  return parseFloat(value) / parseFloat(scalingFactor)
}


function calculateTime(constraints, steps = 1) {
  const totalSteps = steps * 1_000_000 / constraints
  const fps = 25
  const sec = totalSteps / fps
  return Math.round(sec * 100) / 100
}

const exported = {
  convertScaledStringArrayToBody,
  convertScaledStringArrayToFloat,
  convertScaledBigIntBodyToArray,
  calculateForce,
  approxSqrt,
  approxDiv,
  calculateTime,
  vectorLimit,
  scalingFactor,
  runComputation,
  runComputationBigInt,
  detectCollision,
  detectCollisionBigInt,
  convertBigIntsToBodies,
  convertBodiesToBigInts,
  convertFloatToScaledBigInt,
  convertScaledBigIntToFloat,
  forceAccumulatorBigInts,
  calculateForceBigInt,
  convertBigIntToModP
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = exported
}