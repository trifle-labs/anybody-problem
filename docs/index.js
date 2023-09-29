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
const admin = false
const minRadius = 50
const maxRadius = 100
const position = "!static"
const colorStyle = "!squiggle"
let totalBodies = 3
console.log({ totalBodies })
const outlines = false
const clearBG = true


let cs = [], ss = [], bs = [], bodies = []

var showIt = false
var keepSimulating = true
var runIndex = 0

function go() {
  while (keepSimulating) {
    runIndex++
    bodies = runComputation(bodies)

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


  frameRate(fps)
  createCanvas(windowWidth, windowWidth);
  background(0);
  prepBodies();
  background("white")
  colorMode(HSB, 360, 100, 100); // Use HSB color mode
  line(0, 0, windowWidth, windowWidth)
  line(windowWidth, 0, 0, windowWidth)
  stroke("white")
  if (!outlines) {
    noStroke();
  }
  go()
}

function prepBodies() {
  const opac = 1
  for (let i = 0; i < totalBodies; i++) {
    let cc = randomColor()
    cc.push(opac)
    cc = `rgba(${cc.join(",")})`
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
  let maxSize = totalBodies < 10 ? 10 : totalBodies;
  for (let i = 0; i < maxSize; i++) {
    if (i >= totalBodies) break
    const body = {
      position: createVector(ss[i][0], ss[i][1]),
      velocity: createVector(0, 0),
      radius: (maxSize - i) * 10 + 10,//random(minRadius, maxRadius),
    }
    bs.push(body)
    bodies.push({ body, c: cs[i] })
  }
  bodies = bodies
    .sort((a, b) => b.body.radius - a.body.radius)
  console.log({ bodies })
}


function runComputation(bodies, p5) {
  if (p5) {
    createVector = p5.createVector.bind(this)
  }

  let accumulativeForces = [];

  for (let i = 0; i < bodies.length; i++) {
    const body = bodies[i].body
    let accumulativeForce = createVector(0, 0);
    for (let j = 0; j < bodies.length; j++) {
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
  for (let i = 0; i < bodies.length; i++) {
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

  for (let i = 0; i < missiles.length; i++) {
    const missile = missiles[i]
    missile.position.add(missile.velocity);
    if (missile.position.x > rightEdge || missile.position.y < 0) {
      missiles.splice(i, 1);
    }
    for (let j = 0; j < bodies.length; j++) {
      const body = bodies[j].body
      const distance = dist(missile.position.x, missile.position.y, body.position.x, body.position.y);
      const minDist = (missile.radius + body.radius) / 4;
      if (distance <= minDist) {
        bodies.splice(j, 1)
        // for (k = 0; k < allCopiesOfBodies.length; k++) {
        //   const copyOfBodies = allCopiesOfBodies[k]
        //   copyOfBodies.splice(j, 1)
        // }
        missiles.splice(i, 1);
        explosions.push(explosion(body.position.x, body.position.y))

      }
    }
  }

  if (bodies.length == 0) {
    const level = {
      thisLevelMissileCount,
      thisLevelSec
    }
    allLevelSec.unshift(level)
    thisLevelSec = 0
    thisLevelMissileCount = 0
    totalBodies += 1

    prepBodies()
  }
  return bodies
}

function explosion(x, y) {
  let bombs = []
  for (let i = 0; i < 50; i++) {
    bombs.push({
      x, y, i
    })
  }
  return bombs
}

const scalingFactor = 10n ** 8n

// Calculate the gravitational force between two bodies
function calculateForce(body1, body2) {
  // console.log({ p })
  const GScaled = BigInt(Math.floor(G * parseInt(scalingFactor)))
  // console.log({ GScaled })

  let minDistanceScaled = BigInt(minDistanceSquared) * scalingFactor ** 2n // when the original gets squared, the scaling factor gets squared
  // console.log({ minDistanceScaled })

  const position1 = body1.position
  const body1_position_x = BigInt(Math.floor(position1.x * parseInt(scalingFactor)))
  // console.log({ body1_position_x })
  const body1_position_y = BigInt(Math.floor(position1.y * parseInt(scalingFactor)))
  // console.log({ body1_position_y })
  const body1_radius = BigInt(Math.floor(body1.radius * parseInt(scalingFactor)))


  const position2 = body2.position
  const body2_position_x = BigInt(Math.floor(position2.x * parseInt(scalingFactor)))
  // console.log({ body2_position_x })
  const body2_position_y = BigInt(Math.floor(position2.y * parseInt(scalingFactor)))
  // console.log({ body2_position_y })
  const body2_radius = BigInt(Math.floor(body2.radius * parseInt(scalingFactor)))


  let dx = body2_position_x - body1_position_x
  let dy = body2_position_y - body1_position_y
  const dxAbs = BigInt(Math.abs(parseInt(dx)))
  const dyAbs = BigInt(Math.abs(parseInt(dy)))

  // console.log({ dx, dy })
  // console.log({ dxAbs, dyAbs })

  const dxs = dx * dx
  const dys = dy * dy
  // console.log({ dxs, dys })


  let distanceSquared
  const unboundDistanceSquared = dxs + dys;
  // console.log({ unboundDistanceSquared })
  if (unboundDistanceSquared < minDistanceScaled) {
    distanceSquared = minDistanceScaled
  } else {
    distanceSquared = unboundDistanceSquared
  }
  let distance = sqrtApprox(distanceSquared)
  // console.log({ distance })
  // console.log({ distanceSquared })


  const bodies_sum = body1_radius + body2_radius
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

  const forceYnum = dyAbs * forceMag_numerator
  // console.log({ forceYnum })
  const forceYunsigned = approxDiv(forceYnum, forceDenom)
  // console.log({ forceYunsigned })
  const forceY = dy < 0n ? -forceYunsigned : forceYunsigned
  // console.log({ forceY })

  return [parseInt(forceX) / parseInt(scalingFactor), parseInt(forceY) / parseInt(scalingFactor)]
}

function approxDiv(dividend, divisor) {

  var bitsDivident = 0n;
  var dividendCopy = dividend;
  while (dividendCopy > 0n) {
    bitsDivident++;
    dividendCopy = dividendCopy >> 1n;
  }

  // Create internal signals for our binary search
  var lowerBound, upperBound, midPoint, testProduct;

  // Initialize our search space
  lowerBound = 0n;
  upperBound = dividend;  // Assuming worst case where divisor = 1

  for (var i = 0; i < bitsDivident; i++) {  // 32 iterations for 32-bit numbers as an example
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

let missiles = []
let missileCount = 0
let thisLevelMissileCount = 0
let explosions = []
if (typeof window !== "undefined") {
  const body = document.getElementById("main")
  console.log({ document, body })
  body.addEventListener("click", function (e) {
    if (missiles.length > 0 && !admin) return
    thisLevelMissileCount++
    missileCount++
    const x = e.clientX
    const y = windowWidth - e.clientY
    console.log({ x, y })
    const body = {
      position: createVector(0, windowWidth),
      velocity: createVector(x, -y),
      radius: 10,
    }
    body.velocity.limit(5);
    missiles.push(body)
  })
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
  if (clearBG == "fade") {
    background(255, 0.3)
  } else if (clearBG) {
    background(255)
    // background("white")
  }

  bodies = runComputation(bodies)


  for (let i = 0; i < allCopiesOfBodies.length; i++) {
    const copyOfBodies = allCopiesOfBodies[i]
    for (let j = 0; j < copyOfBodies.length; j++) {
      const body = copyOfBodies[j].body
      const c = copyOfBodies[j].c
      let finalColor
      if (colorStyle == "squiggle") {
        const hueColor = (parseInt(c.split(",")[1]) + n) % 360
        finalColor = color(hueColor, 60, 100); // Saturation and brightness at 100 for pure spectral colors
      } else {
        finalColor = c
      }
      fill(finalColor)
      push()
      var angle = body.velocity.heading() + PI / 2;
      var scalar = 0.3 * body.radius;
      translate(body.position.x, body.position.y);
      rotate(angle);
      // rect(-scalar, -scalar, scalar * 2, scalar * 2);
      triangle(-scalar, scalar, scalar, scalar, 0, -scalar);

      pop()
    }
  }

  const bodyCopies = []
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

    // ellipse(body.position.x, body.position.y, body.radius / 2, body.radius / 2);
    // rotate by velocity
    push()
    stroke("white");
    strokeWeight(1);
    fill(finalColor)
    var angle = body.velocity.heading() + PI / 2;
    var scalar = 0.3 * body.radius;
    translate(body.position.x, body.position.y);
    rotate(angle);
    triangle(-scalar, scalar, scalar, scalar, 0, -scalar);
    pop()

    const bodyCopy = {
      body:
      {
        position: createVector(body.position.x, body.position.y),
        velocity: createVector(body.velocity.x, body.velocity.y),
        radius: body.radius
      },
      c: c
    }
    bodyCopies.push(bodyCopy)
  }
  allCopiesOfBodies.push(bodyCopies)
  if (allCopiesOfBodies.length > 50) {
    allCopiesOfBodies.shift()
  }

  fill("black")
  for (let i = 0; i < missiles.length; i++) {
    const body = missiles[i]
    ellipse(body.position.x, body.position.y, body.radius / 2, body.radius / 2);
  }

  for (let i = 0; i < explosions.length; i++) {
    const explosion = explosions[i]
    const bomb = explosion[0]
    fill("rgba(255,0,0,0.5)")
    ellipse(bomb.x, bomb.y, bomb.i * 2, bomb.i * 2);
    explosion.shift()
    if (explosion.length == 0) {
      explosions.splice(i, 1)
    }
  }

  // draw line between bottom left corner and direction towards mouse
  stroke("rgba(200,200,200,0.5)");
  strokeCap(SQUARE);
  strokeWeight(10);

  // Bottom left corner coordinates
  let startX = 0;
  let startY = height;

  // Calculate direction from bottom left to mouse
  let dirX = mouseX - startX;
  let dirY = mouseY - startY;

  // Calculate the length of the direction
  let len = sqrt(dirX * dirX + dirY * dirY);

  // If the length is not zero, scale the direction to have a length of 100
  if (len != 0) {
    dirX = (dirX / len) * 100;
    dirY = (dirY / len) * 100;
  }

  // Draw the line
  line(startX, startY, startX + dirX, startY + dirY);
  strokeWeight(0);


  // noStroke()
  fill("white")
  // stroke("black")
  rect(0, 0, 50, 20);
  // stroke("black");
  fill("black")
  // convert totalSec to time
  const secondsAsTime = new Date(totalSec * 1000).toISOString().substr(14, 5)
  const thisLevelSecondsAsTime = new Date(thisLevelSec * 1000).toISOString().substr(14, 5)
  text("Total Frames: " + preRun + n, 0, 10)
  text("Total Time: " + secondsAsTime, 0, 20)
  text("Total Shots: " + missileCount, 0, 30)
  text("Lvl " + (totalBodies - 2) + " - " + thisLevelSecondsAsTime + " - " + (totalBodies - bodies.length) + "/" + totalBodies + " - " + thisLevelMissileCount + " shots", 0, 40)
  for (let i = 0; i < allLevelSec.length; i++) {
    const prevLevel = allLevelSec[i]
    const prevLevelSecondsAsTime = new Date(prevLevel.thisLevelSec * 1000).toISOString().substr(14, 5)
    text("Lvl " + (allLevelSec.length - i) + " - " + prevLevelSecondsAsTime + " - " + prevLevel.thisLevelMissileCount + " shots", 0, (i * 10) + 50)
  }
  // noStroke();
}
let allLevelSec = []
let totalSec = 0
let thisLevelSec = 0
setInterval(() => {
  thisLevelSec++
  totalSec++
}, 1000);

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
  const radiusDist = random(windowWidth / 2.1, windowWidth / 2)
  const randomDir = random(0, 360)
  const x = (radiusDist * Math.cos(randomDir)) + (windowWidth / 2)
  const y = radiusDist * Math.sin(randomDir) + (windowWidth / 2)
  return [x, y]
}
if (module) {
  module.exports = {
    calculateForce,
    sqrtApprox,
    scalingFactor,
    runComputation
  }
}