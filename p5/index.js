
let body1, body2, body3, body4, c1, c2, c3, c4, s1, s2, s3, s4, bg
const radius = 50;
const G = 100; // Gravitational constant
const friction = 1; // Damping factor for friction
const speedLimit = 10
const vectorLimit = 10
const minDistance = 200 // was 200 * 200
const minDistanceSquared = minDistance * minDistance
const windowWidth = 1000
const boundaryRadius = windowWidth / 2
let n = 0, img1
const fps = 300
const preRun = 0
const p = 21888242871839275222246405745257275088548364400416034343698204186575808495617n;

const minRadius = 50
const maxRadius = 100
const position = "!static"
const colorStyle = "!squiggle"
const totalBodies = 3
console.log({ totalBodies })
const outlines = true
const clearBG = false


let cs = [], ss = [], bs = [], bodies = []

var showIt = false
var keepSimulating = true
var runIndex = 0

function go() {
  while (keepSimulating) {
    runIndex++
    runComputation()

    if (runIndex > preRun) {
      keepSimulating = false
      showIt = true
      console.log(`${preRun.toLocaleString()} runs`)
    }
  }
}

function setup() {
  const seed = 32146.231332324038//random(0, 100000)
  console.log({ seed })
  randomSeed(seed)

  const opac = 1
  for (let i = 0; i < totalBodies; i++) {
    let cc = randomColor()
    cc.push(opac)
    cc = `rgba(${cc.join(",")})`
    cs.push(cc)
  }

  frameRate(fps)
  createCanvas(windowWidth, windowWidth);
  background(0);
  for (let i = 0; i < totalBodies; i++) {
    let s = randomPosition()
    ss.push(s)
  }
  for (let i = 0; i < totalBodies; i++) {
    const body = {
      position: createVector(ss[i][0], ss[i][1]),
      velocity: createVector(0, 0),
      radius: i * 25 + 50,//random(minRadius, maxRadius),
    }
    bs.push(body)
    bodies.push({ body, c: cs[i] })
  }
  bodies = bodies
    .sort((a, b) => b.body.radius - a.body.radius)
  console.log({ bodies })
  background("white")
  colorMode(HSB, 360, 100, 100); // Use HSB color mode
  line(0, 0, width, width)
  line(width, 0, 0, width)
  stroke("white")
  if (!outlines) {
    noStroke();
  }
  go()
}


function runComputation() {

  let accumulativeForces = [];

  for (let i = 0; i < totalBodies; i++) {
    const body = bodies[i].body
    let accumulativeForce = createVector(0, 0);
    for (let j = 0; j < totalBodies; j++) {
      if (i == j) continue
      const otherBody = bodies[j].body
      const force = calculateForce(body, otherBody)
      accumulativeForce.add(createVector(force[0], force[1]))
    }
    // console.log({ accumulativeForce })
    accumulativeForces[i] = accumulativeForce;
    // body.velocity.add(accumulativeForce)//.mult(friction);
    // if (Math.abs(body.velocity.x) > speedLimit) {
    //   body.velocity.x = Math.abs(body.velocity.x) * body.velocity.x * speedLimit
    // }
    // if (Math.abs(body.velocity.y) > speedLimit) {
    //   body.velocity.y = Math.abs(body.velocity.y) * body.velocity.y * speedLimit
    // }
    // body.velocity.limit(speedLimit);
    // body.position.add(body.velocity);
    // // Check for collisions with other bodies
    // for (let j = 0; j < totalBodies; j++) {
    //   if (i === j) continue;
    //   const otherBody = bodies[j].body;
    //   // checkCollision(body, otherBody);
    // }
  }
  for (let i = 0; i < totalBodies; i++) {
    const body = bodies[i].body

    body.velocity.add(accumulativeForces[i])//.mult(friction);
    if (Math.abs(body.velocity.x) > vectorLimit) {
      body.velocity.x = (Math.abs(body.velocity.x) / body.velocity.x) * vectorLimit
    }
    if (Math.abs(body.velocity.y) > vectorLimit) {
      body.velocity.y = (Math.abs(body.velocity.y) / body.velocity.y) * vectorLimit
    }
    // body.velocity.limit(speedLimit);
    body.position.add(body.velocity);
  }

  const xOffset = bodies[bodies.length - 1].body.position.x
  const yOffset = bodies[bodies.length - 1].body.position.y

  let rightEdge = windowWidth, topEdge = 0, leftEdge = 0, bottomEdge = windowWidth

  for (let i = 0; i < bodies.length; i++) {
    const body = bodies[i].body
    if (position == "static") {
      body.position.set(body.position.x - xOffset + windowWidth / 2, body.position.y - yOffset + windowWidth / 2)
    }
    if (body.position.x > rightEdge) {
      body.position.set(leftEdge, body.position.y)
    } else if (body.position.x < leftEdge) {
      body.position.set(rightEdge, body.position.y)
    }
    if (body.position.y > bottomEdge) {
      body.position.set(body.position.x, topEdge)
    } else if (body.position.y < topEdge) {
      body.position.set(body.position.x, bottomEdge)
    }
  }
}

const scalingFactor = 10n ** 8n

// Calculate the gravitational force between two bodies
function calculateForce(body1, body2) {

  console.log({ p })
  const GScaled = BigInt(Math.floor(G * parseInt(scalingFactor)))
  console.log({ GScaled })

  let minDistanceScaled = BigInt(minDistanceSquared) * scalingFactor ** 2n // when the original gets squared, the scaling factor gets squared
  console.log({ minDistanceScaled })

  const position1 = body1.position
  const body1_position_x = BigInt(Math.floor(position1.x * parseInt(scalingFactor)))
  console.log({ body1_position_x })
  const body1_position_y = BigInt(Math.floor(position1.y * parseInt(scalingFactor)))
  console.log({ body1_position_y })
  const body1_radius = BigInt(Math.floor(body1.radius * parseInt(scalingFactor)))


  const position2 = body2.position
  const body2_position_x = BigInt(Math.floor(position2.x * parseInt(scalingFactor)))
  console.log({ body2_position_x })
  const body2_position_y = BigInt(Math.floor(position2.y * parseInt(scalingFactor)))
  console.log({ body2_position_y })
  const body2_radius = BigInt(Math.floor(body2.radius * parseInt(scalingFactor)))


  let dx = body2_position_x - body1_position_x
  let dy = body2_position_y - body1_position_y
  const dxAbs = BigInt(Math.abs(parseInt(dx)))
  const dyAbs = BigInt(Math.abs(parseInt(dy)))

  console.log({ dx, dy })
  console.log({ dxAbs, dyAbs })

  const dxs = dx * dx
  const dys = dy * dy
  console.log({ dxs, dys })


  let distanceSquared
  const unboundDistanceSquared = dxs + dys;
  console.log({ unboundDistanceSquared })
  if (unboundDistanceSquared < minDistanceScaled) {
    distanceSquared = minDistanceScaled
  } else {
    distanceSquared = unboundDistanceSquared
  }
  let distance = sqrtApprox(distanceSquared)
  console.log({ distance })
  console.log({ distanceSquared })


  const bodies_sum = body1_radius + body2_radius
  console.log({ bodies_sum })


  const distanceSquared_with_avg_denom = distanceSquared * 2n // NOTE: this is a result of moving division to the end of the calculation
  console.log({ distanceSquared_with_avg_denom })
  const forceMag_numerator = GScaled * bodies_sum * scalingFactor // distancec should be divided by scaling factor but this preserves rounding with integer error
  console.log({ forceMag_numerator })


  // const numerator = G * ((body1.radius + body2.radius) / 2)
  // let forceMagnituden = forceMag_numerator / distanceSquared_with_avg_denom; // this is part of the denominator from radius average
  // console.log({ forceMagnituden })

  // const forceMagnitude = numerator / distanceSq;
  // const dx_mul_force = forceMagnituden * dx
  // const dy_mul_force = forceMagnituden * dy

  // if (dx_mul_force < 0n) {
  //   console.log('dx_mul_force', dx_mul_force + p)
  // }

  // console.log({ dx_mul_force })
  // console.log({ dy_mul_force })

  // let forceXn = dx_mul_force / distance;
  // let forceYn = dy_mul_force / distance;
  // console.log({ forceXn, forceYn })

  const forceDenom = distanceSquared_with_avg_denom * distance
  console.log({ forceDenom })

  const forceXnum = dxAbs * forceMag_numerator
  console.log({ forceXnum })
  const forceXunsigned = approxDiv(forceXnum, forceDenom)
  console.log({ forceXunsigned })
  const forceX = dx < 0n ? -forceXunsigned : forceXunsigned

  const forceYnum = dyAbs * forceMag_numerator
  console.log({ forceYnum })
  const forceYunsigned = approxDiv(forceYnum, forceDenom)
  console.log({ forceYunsigned })
  const forceY = dy < 0n ? -forceYunsigned : forceYunsigned
  console.log({ forceY })

  const forcen = [parseInt(forceX) / parseInt(scalingFactor), parseInt(forceY) / parseInt(scalingFactor)]

  // if (!firstForce) {
  //   checkNow--;
  //   if (checkNow < 0) {
  //     firstForce = true
  //   }
  // }
  return forcen
}

function approxDiv(dividend, divisor) {
  // log("dividend", dividend);
  // log("divisor", divisor);
  // signal input dividend;
  // signal input divisor;
  // signal output quotient;

  // Create internal signals for our binary search
  var lowerBound, upperBound, midPoint, testProduct;

  // Initialize our search space
  lowerBound = 0n;
  upperBound = dividend;  // Assuming worst case where divisor = 1

  for (var i = 0; i < 128; i++) {  // 32 iterations for 32-bit numbers as an example
    midPoint = (upperBound + lowerBound) >> 1n;
    testProduct = midPoint * divisor;

    // Adjust our bounds based on the test product
    if (testProduct > dividend) {
      upperBound = midPoint;
    } else {
      lowerBound = midPoint;
    }
  }

  // Output the midpoint as our approximated quotient after iterations
  // quotient <== midPoint;
  return midPoint;
}

function sqrtApprox(n) {
  // console.log({ n })
  if (n == 0n) {
    return 0n;
  }
  var lo = 0n;
  var hi = n >> 1n;
  var mid, midSquared;

  while (lo <= hi) {
    mid = (lo + hi) >> 1n; // multiplication by multiplicative inverse is not what we want so we use >>
    // TODO: Make more accurate by checking if lo + hi is odd or even before bit shifting
    midSquared = (mid * mid);
    if (midSquared == n) {
      return mid; // Exact square root found
    } else if (midSquared < n) {
      lo = mid + 1n; // Adjust lower bound
    } else {
      hi = mid - 1n; // Adjust upper bound
    }
  }
  // If we reach here, no exact square root was found.
  // return the closest approximation
  return mid;
}


function checkCollision(body1, body2) {
  const distance = dist(body1.position.x, body1.position.y, body2.position.x, body2.position.y);
  const minDist = (body1.radius + body2.radius) / 4;

  if (distance < minDist) {
    // Calculate collision response
    const angle = atan2(body2.position.y - body1.position.y, body2.position.x - body1.position.x);
    const overlap = minDist - distance;

    const totalMass = body1.radius ** 2 + body2.radius ** 2;
    const overlapRatio1 = body2.radius / totalMass;
    const overlapRatio2 = body1.radius / totalMass;

    const deltaX = -cos(angle) * overlap;
    const deltaY = -sin(angle) * overlap;

    body1.position.x -= deltaX * overlapRatio1;
    body1.position.y -= deltaY * overlapRatio1;
    body2.position.x += deltaX * overlapRatio2;
    body2.position.y += deltaY * overlapRatio2;

    // Update velocities
    const angle1 = atan2(body1.velocity.y, body1.velocity.x);
    const angle2 = atan2(body2.velocity.y, body2.velocity.x);
    const speed1 = body1.velocity.mag();
    const speed2 = body2.velocity.mag();

    const newVelX1 = cos(angle1) * speed2;
    const newVelY1 = sin(angle1) * speed2;
    const newVelX2 = cos(angle2) * speed1;
    const newVelY2 = sin(angle2) * speed1;

    body1.velocity.set(newVelX1, newVelY1);
    body2.velocity.set(newVelX2, newVelY2);
  }
}



function draw() {
  if (!showIt) return
  n++
  if (n % 100 == 0) {
    // console.log({ bodies })
  }
  noFill()
  // Set the background color with low opacity to create trails
  if (clearBG == "fade") {
    background(255, 0.1)
  } else if (clearBG) {
    background(255)
    // background("white")
  }

  runComputation()

  for (let i = 0; i < bodies.length; i++) {
    const body = bodies[i].body
    const c = bodies[i].c
    let finalColor
    if (colorStyle == "squiggle") {
      const hueColor = (parseInt(c.split(",")[1]) + n) % 360
      finalColor = color(hueColor, 60, 100); // Saturation and brightness at 100 for pure spectral colors
    } else {
      finalColor = c
    }
    fill(finalColor)
    ellipse(body.position.x, body.position.y, body.radius / 2, body.radius / 2);
  }
  // noStroke()
  fill("white")
  // stroke("black")
  rect(0, 0, 50, 20);
  // stroke("black");
  fill("black")
  text(preRun + n, 0, 10)
  // noStroke();
}

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
  const radiusDist = random(windowWidth / 4, windowWidth / 2)
  const randomDir = random(0, 360)
  const x = (radiusDist * Math.cos(randomDir)) + (width / 2)
  const y = radiusDist * Math.sin(randomDir) + (height / 2)
  return [x, y]
}
if (module) {
  module.exports = {
    calculateForce,
    sqrtApprox,
    scalingFactor
  }
}