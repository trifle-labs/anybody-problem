const Prando = require('prando').default
const EventEmitter = require('events')

// eslint-disable-next-line no-unused-vars
// window.p5 = require('p5')
// window.p5sound = require('p5/lib/addons/p5.sound')

class Anybody extends EventEmitter {
  constructor(p, options = {}) {
    super()
    const defaultOptions = {
      inputData: null,
      bodyData: null,
      // Add default properties and their initial values here
      totalBodies: 3,
      seed: null,
      windowWidth: 1000,
      windowHeight: 1000,
      vectorLimit: 10,
      scalingFactor: 10n ** 3n,
      minDistanceSquared: 200 * 200,
      G: 100, // Gravitational constant
      mode: 'nft', // game or nft
      admin: false,
      clearBG: true,
      colorStyle: '!squiggle', // squiggle or !squiggle
      preRun: 0,
      paintSteps: 0,
      chunk: 1,
      mute: true,
      freeze: false,
      stopEvery: 0,
      util: false
    }

    // Merge the default options with the provided options
    const mergedOptions = { ...defaultOptions, ...options }

    // Assign the merged options to the instance properties
    this.inputData = mergedOptions.inputData
    this.bodyData = mergedOptions.bodyData
    this.startingBodies = mergedOptions.totalBodies
    this.seed = mergedOptions.seed
    this.windowWidth = mergedOptions.windowWidth
    this.windowHeight = mergedOptions.windowHeight
    this.vectorLimit = mergedOptions.vectorLimit
    this.scalingFactor = mergedOptions.scalingFactor
    this.G = mergedOptions.G
    this.minDistanceSquared = mergedOptions.minDistanceSquared
    this.mode = mergedOptions.mode
    this.admin = mergedOptions.admin
    this.clearBG = mergedOptions.clearBG
    this.colorStyle = mergedOptions.colorStyle
    this.preRun = mergedOptions.preRun
    this.paintSteps = mergedOptions.paintSteps
    this.chunk = mergedOptions.chunk
    this.mute = mergedOptions.mute
    this.freeze = mergedOptions.freeze
    this.stopEvery = mergedOptions.stopEvery
    this.util = mergedOptions.util

    // Add other constructor logic here
    this.p = p
    !this.util && this.prepareP5()
    this.clearValues()
    this.init()
    !this.util && this.start()
    !this.util && this.audio()
  }

  // run whenever the class should be reset
  clearValues() {
    this.thisLevelMissileCount = 0
    this.thisLevelSec = 0
    this.totalSec = 0
    this.allLevelSec = []
    this.explosions = []
    this.missiles = []
    this.missileInits = []
    this.bodies = []
    this.bodyInits = []
    this.bodyFinal = []
    this.allCopiesOfBodies = []
    this.missileCount = 0
    this.frames = 0
    this.showIt = true
    this.paused = false
    this.justStopped = false
    this.bgColor = null
  }

  // run once at initilization
  init() {
    if (this.seed == undefined) {
      this.seed = BigInt(Math.floor(Math.random() * 10000))
      console.log({ seed: this.seed })
    }
    _validateSeed(this.seed)
    this.rng = new Prando(this.seed.toString(16))
    this.generateBodies()
    // const vectorLimitScaled = this.convertFloatToScaledBigInt(this.vectorLimit)
    this.storeInits()
  }

  start() {
    this.addListener()
    this.startTick()
    this.runSteps(this.preRun)
    this.paintAtOnce(this.paintSteps)
    if (this.freeze) {
      this.paused = true
    }
  }

  storeInits() {
    // console.log('storeInits')
    // console.dir({ bodies: this.bodies }, { depth: null })
    this.bodyInits = this.convertBodiesToBigInts(this.bodies).map(b => {
      // console.log({ b1: b })
      b = this.convertScaledBigIntBodyToArray(b)
      // console.log({ b2: b })
      b[2] = (BigInt(b[2])).toString()
      b[3] = (BigInt(b[3])).toString()
      // console.log({ vy_b: b[3] })
      return b
    })
    // console.dir({ bodyInits: this.bodyInits }, { depth: null })
  }

  audio() {
    if (this.mute) return
    // tone
    this.envelopes = []
    this.oscillators = []
    this.noises = []
    for (let i = 0; i < this.bodies.length; i++) {
      this.noises[i] = new window.p5.Noise('pink')
      // this.noises[i].start()

      this.envelopes[i] = new window.p5.Envelope()
      this.envelopes[i].setADSR(0.1, .1, .1, .1)
      this.envelopes[i].setRange(1, 0)
      this.oscillators[i] = new window.p5.Oscillator('sine')
      this.oscillators[i].amp(this.envelopes[i])
      this.oscillators[i].start()
    }
  }

  runSteps(n = this.preRun) {

    let runIndex = 0
    let keepSimulating = true
    this.showIt = false
    while (keepSimulating) {
      runIndex++
      if (runIndex > n) {
        keepSimulating = false
        this.showIt = true
        // n > 0 && console.log(`${n.toLocaleString()} runs`)
      } else {
        const results = this.step(this.bodies, this.missiles)
        this.bodies = results.bodies
        this.missiles = results.missiles || []
      }
    }
  }

  startTick() {
    if (this.mode == 'game') {
      this.tickInterval && clearInterval(this.tickInterval)
      this.tickInterval = setInterval(this.tick.bind(this), 1000)
    }
  }

  tick() {
    this.thisLevelSec++
    this.totalSec++
  }

  addListener() {
    const body = document.getElementsByClassName('p5Canvas')[0]
    if (typeof window !== 'undefined' && this.mode == 'game') {
      body.removeEventListener('click', this.setPause)
      body.removeEventListener('click', this.missileClick)
      body.addEventListener('click', this.missileClick.bind(this))
    } else {
      body.removeEventListener('click', this.missileClick)
      body.removeEventListener('click', this.setPause)
      body.addEventListener('click', this.setPause.bind(this))
    }
  }

  setPause(newPauseState = !this.paused) {
    if (typeof newPauseState !== 'boolean') {
      newPauseState = !this.paused
    }
    console.log('pause clicked', newPauseState)
    this.paused = newPauseState
    this.justPaused = true
    if (newPauseState) {
      this.emit('paused', this.paused)
    }
  }


  step() {
    this.bodies = this.forceAccumulator(this.bodies)
    var results = this.detectCollision(this.bodies, this.missiles)
    this.bodies = results.bodies
    this.missiles = results.missiles || []

    if (this.missiles.length > 0 && this.missiles[0].radius == 0) {
      this.missiles.splice(0, 1)
    }

    if (this.mode == 'game' && this.bodies.reduce((a, c) => a + c.radius, 0) == 0) {
      // this.nextLevel()
      // this.paused = true
      if (!this.finished) {
        this.finish()
      }
    }
    return { bodies: this.bodies, missiles: this.missiles }
  }


  // stepBigInt(bodies, missiles) {
  //   // console.dir({ 'bodies': bodies }, { depth: null })
  //   bodies = this.forceAccumulatorBigInts(bodies)
  //   // console.dir({ 'bodies': bodies }, { depth: null })
  //   return this.detectCollisionBigInt(bodies, missiles)
  //   // bodies = results.bodies
  //   // missiles = results.missiles

  //   // TODO: need to confirm missile array logic is consistent between circuit and js
  //   // if (missiles.length > 0 && missiles[0].radius == 0n) {
  //   //   missiles.splice(0, 1)
  //   // }

  //   // TODO: in future may need to include changing level in big int testing
  //   // if (bodies.reduce((a, c) => a + c.radius, 0n) == 0n) {
  //   //   const level = {
  //   //     thisLevelMissileCount,
  //   //     thisLevelSec
  //   //   }
  //   //   allLevelSec.unshift(level)
  //   //   thisLevelSec = 0
  //   //   thisLevelMissileCount = 0
  //   //   totalBodies += 1

  //   //   bodies = prepBodies()
  //   // }
  //   // return { bodies, missiles }
  // }


  nextLevel() {

    const level = {
      thisLevelMissileCount: this.thisLevelMissileCount,
      thisLevelSec: this.thisLevelSec
    }
    this.allLevelSec.unshift(level)
    this.thisLevelSec = 0
    this.thisLevelMissileCount = 0
    this.startingBodies += 1
    this.missiles = []
    this.bodies = []
    this.generateBodies()
  }

  forceAccumulator(bodies = this.bodies) {
    bodies = this.convertBodiesToBigInts(bodies)
    bodies = this.forceAccumulatorBigInts(bodies)
    bodies = this.convertBigIntsToBodies(bodies)
    return bodies
  }


  forceAccumulatorBigInts(bodies) {
    // console.dir({ bodies: bodies.map(this.convertScaledBigIntBodyToArray.bind(this)) }, { depth: null })
    const vectorLimitScaled = this.convertFloatToScaledBigInt(this.vectorLimit)
    let accumulativeForces = []
    for (let i = 0; i < bodies.length; i++) {
      accumulativeForces.push([0n, 0n])
    }
    for (let i = 0; i < bodies.length; i++) {
      const body = bodies[i]
      for (let j = i + 1; j < bodies.length; j++) {
        const otherBody = bodies[j]
        const force = this.calculateForceBigInt(body, otherBody)
        accumulativeForces[i] = _addVectors(accumulativeForces[i], force)
        accumulativeForces[j] = _addVectors(accumulativeForces[j], [-force[0], -force[1]])
      }
    }
    // console.log({ vectorLimitScaled })
    for (let i = 0; i < bodies.length; i++) {
      const body = bodies[i]
      const body_velocity = _addVectors([body.velocity.x, body.velocity.y], accumulativeForces[i])//.mult(friction);
      // console.log('body.velocity.x', body.velocity.x)
      // console.log('accumulativeForces[i][0]', accumulativeForces[i][0])
      // console.log('body_velocity[0]', body_velocity[0])
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
      const body_position = _addVectors([body.position.x, body.position.y], [body.velocity.x, body.velocity.y])
      // console.log('unlimited new position of x = ', body.position.x)
      // console.log('body.position.x', body.position.x)
      // console.log('body.velocity.x', body.velocity.x)
      // console.log('body_position[0]', body_position[0])
      body.position.x = body_position[0]
      body.position.y = body_position[1]
    }

    // console.log('before limiter')
    // console.dir({ bodies_0: convertScaledBigIntBodyToArray(bodies[0]) }, { depth: null })

    // const xOffset = bodies[bodies.length - 1].position.x
    // const yOffset = bodies[bodies.length - 1].position.y
    const scaledWindowWidth = this.convertFloatToScaledBigInt(this.windowWidth)
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


  // Calculate the gravitational force between two bodies
  calculateForceBigInt(body1, body2) {
    // console.log({ p })
    const GScaled = BigInt(Math.floor(this.G * parseInt(this.scalingFactor)))
    // console.log({ GScaled })

    let minDistanceScaled = BigInt(this.minDistanceSquared) * this.scalingFactor ** 2n // when the original gets squared, the scaling factor gets squared
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
    let distance = _approxSqrt(distanceSquared)
    // console.log({ distance })
    // console.log({ distanceSquared })

    const bodies_sum = body1_radius == 0n || body2_radius == 0n ? 0n : (body1_radius + body2_radius) * 4n // NOTE: this could be tweaked as a variable for "liveliness" of bodies
    // console.log({ bodies_sum })

    const distanceSquared_with_avg_denom = distanceSquared * 2n // NOTE: this is a result of moving division to the end of the calculation
    // console.log({ distanceSquared_with_avg_denom })
    const forceMag_numerator = GScaled * bodies_sum * this.scalingFactor // distancec should be divided by scaling factor but this preserves rounding with integer error
    // console.log({ forceMag_numerator })

    const forceDenom = distanceSquared_with_avg_denom * distance
    // console.log({ forceDenom })

    const forceXnum = dxAbs * forceMag_numerator
    // console.log({ forceXnum })
    const forceXunsigned = _approxDiv(forceXnum, forceDenom)
    // console.log({ forceXunsigned })
    const forceX = dx < 0n ? -forceXunsigned : forceXunsigned
    // console.log({ forceX })

    const forceYnum = dyAbs * forceMag_numerator
    // console.log({ forceYnum })
    const forceYunsigned = _approxDiv(forceYnum, forceDenom)
    // console.log({ forceYunsigned })
    const forceY = dy < 0n ? -forceYunsigned : forceYunsigned
    // console.log({ forceY })
    return [forceX, forceY]
  }


  convertScaledStringArrayToBody(body) {
    const maxVectorScaled = this.convertFloatToScaledBigInt(this.vectorLimit)
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
  convertScaledBigIntBodyToArray(b) {
    const maxVectorScaled = this.convertFloatToScaledBigInt(this.vectorLimit)
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
    return bodyArray.map(b => b.toString())
  }

  convertScaledStringArrayToFloat(body) {
    const maxVectorScaled = this.convertFloatToScaledBigInt(this.vectorLimit)
    return {
      position: {
        x: this.convertScaledBigIntToFloat(body[0]),
        y: this.convertScaledBigIntToFloat(body[1])
      },
      velocity: {
        x: this.convertScaledBigIntToFloat(body[2]) - maxVectorScaled,
        y: this.convertScaledBigIntToFloat(body[3]) - maxVectorScaled
      },
      radius: this.convertScaledBigIntToFloat(body[4])
    }
  }
  convertBigIntsToBodies(bigBodies) {
    const bodies = []
    for (let i = 0; i < bigBodies.length; i++) {
      const body = bigBodies[i]
      const newBody = { bodyIndex: i, position: {}, velocity: {}, radius: null }
      newBody.px = body.position.x
      newBody.position.x = this.convertScaledBigIntToFloat(body.position.x)
      newBody.py = body.position.y
      newBody.position.y = this.convertScaledBigIntToFloat(body.position.y)
      newBody.position = this.createVector(newBody.position.x, newBody.position.y)

      newBody.vx = body.velocity.x
      newBody.velocity.x = this.convertScaledBigIntToFloat(body.velocity.x)
      newBody.vy = body.velocity.y
      newBody.velocity.y = this.convertScaledBigIntToFloat(body.velocity.y)
      newBody.velocity = this.createVector(newBody.velocity.x, newBody.velocity.y)

      newBody.radius = this.convertScaledBigIntToFloat(body.radius)
      if (body.c) {
        newBody.c = body.c
      }
      bodies.push(newBody)
    }
    return bodies
  }


  convertFloatToScaledBigInt(value) {
    // changed from Math.floor to Math.round, TODO: look here in case there's rounding error
    return BigInt(Math.round(value * parseInt(this.scalingFactor)))
    // let maybeNegative = BigInt(Math.floor(value * parseInt(scalingFactor))) % p
    // while (maybeNegative < 0n) {
    //   maybeNegative += p
    // }
    // return maybeNegative
  }
  convertScaledBigIntToFloat(value) {
    return parseFloat(value) / parseFloat(this.scalingFactor)
  }

  convertBodiesToBigInts(bodies) {
    // console.log('convertBodiesToBigInts')
    const bigBodies = []
    // const maxVectorScaled = this.convertFloatToScaledBigInt(this.vectorLimit)
    for (let i = 0; i < bodies.length; i++) {
      const body = bodies[i]
      // console.log({ body })
      const newBody = { position: {}, velocity: {}, radius: null }

      newBody.position.x = body.px || this.convertFloatToScaledBigInt(body.position.x)
      newBody.position.y = body.py || this.convertFloatToScaledBigInt(body.position.y)
      newBody.velocity.x = body.vx || this.convertFloatToScaledBigInt(body.velocity.x)
      newBody.velocity.y = body.vy || this.convertFloatToScaledBigInt(body.velocity.y)
      newBody.radius = this.convertFloatToScaledBigInt(body.radius)
      if (body.c) {
        newBody.c = body.c
      }
      if (body.bodyIndex) {
        newBody.bodyIndex = body.bodyIndex
      }
      // console.log({ newBody })
      bigBodies.push(newBody)
    }
    return bigBodies
  }



  detectCollision(bodies = this.bodies, missiles = this.missiles) {
    let bigBodies = this.convertBodiesToBigInts(bodies)
    const bigMissiles = this.convertBodiesToBigInts(missiles)
    const { bodies: newBigBodies, missiles: newBigMissiles } = this.detectCollisionBigInt(bigBodies, bigMissiles)
    bodies = this.convertBigIntsToBodies(newBigBodies)
    missiles = this.convertBigIntsToBodies(newBigMissiles)
    return { bodies, missiles }
  }
  detectCollisionBigInt(bodies, missiles) {
    if (missiles.length == 0) {
      return { bodies, missiles }
    }
    const missile = missiles[0]
    missile.position.x += missile.velocity.x
    missile.position.y += missile.velocity.y

    if (missile.position.x > BigInt(this.windowWidth) * this.scalingFactor || missile.position.y < 0n) {
      missile.radius = 0n
    }

    for (let j = 0; j < bodies.length; j++) {
      const body = bodies[j]
      const distance = _approxDist(missile.position.x, missile.position.y, body.position.x, body.position.y)
      // NOTE: this is to match the circuit. If the missile is gone, set minDist to 0
      // Need to make sure comparison of distance is < and not <= for this to work
      // because they may by chance be at the exact same coordinates and should still
      // not trigger an _explosion since the missile is already gone.
      const minDist = missile.radius == 0n ? 0n : body.radius * 2n
      if (distance < minDist) {
        missile.radius = 0n
        // console.log('missile hit')
        this.explosions.push(
          _explosion(
            this.convertScaledBigIntToFloat(body.position.x),
            this.convertScaledBigIntToFloat(body.position.y),
            this.convertScaledBigIntToFloat(body.radius)
          )
        )
        bodies[j].radius = 0n
      }
    }
    missiles[0] = missile
    return { bodies, missiles }
  }
  finish() {
    // this.finished = true
    // this.setPause(true)
    this.calculateBodyFinal()
    this.emit('finished', { bodyInits: JSON.parse(JSON.stringify(this.bodyInits)), bodyFinal: JSON.parse(JSON.stringify(this.bodyFinal)) })
    // console.log('FINISH????????????????????????????????????????')
    this.bodyInits = JSON.parse(JSON.stringify(this.bodyFinal))
    this.bodyFinal = []
    // this.setPause(false)
  }

  calculateBodyFinal() {
    // const maxVectorScaled = this.convertFloatToScaledBigInt(this.vectorLimit)
    this.bodies.sort((a, b) => a.bodyIndex - b.bodyIndex)
    const bodiesAsBigInts = this.convertBodiesToBigInts(this.bodies)
    this.bodyFinal = bodiesAsBigInts.map(b => {
      b = this.convertScaledBigIntBodyToArray(b)
      b[2] = (BigInt(b[2])).toString()
      b[3] = (BigInt(b[3])).toString()
      return b
    })
  }

  draw() {
    if (!this.paused && this.frames % this.stopEvery == 0 && !this.justPaused && this.frames !== 0) {
      this.finish()
    } else {
      this.justPaused = false
    }
    if (this.paused) return
    if (!this.showIt) return
    this.frames++
    if (this.frames % 100 == 0) {
      // console.log({ bodies })
    }
    this.p.noFill()


    const results = this.step(this.bodies, this.missiles)
    this.bodies = results.bodies || []
    this.missiles = results.missiles || []

    this.playSounds()
    this.drawBg()
    this.drawBodyTrails()
    this.drawBodies()

    if (this.mode == 'game') {
      this.drawMissiles()
      this.drawExplosions()
      this.drawGun()
    }
    // this.drawBodyOutlines()

    this.drawScore()
  }
  drawBodyOutlines() {
    for (let i = 0; i < this.bodies.length; i++) {
      const body = this.bodies[i]
      const radius = body.radius * 4 + this.radiusMultiplyer

      this.p.stroke(this.getGrey())
      this.p.stroke('black')
      this.p.strokeWeight(1)
      this.p.color('rgba(0,0,0,0)')
      this.p.ellipse(body.position.x, body.position.y, radius, radius)
    }
  }
  drawBg() {
    if (this.mode == 'nft') {
      this.p.background(this.bgColor)
      // this.p.background(this.convertColor(this.bgColor, false))
      // this.p.background(this.getGrey())
      return
    }
    // Set the background color with low opacity to create trails
    if (this.clearBG == 'fade') {
      this.p.background(255, 0.3)
    } else if (this.clearBG) {
      this.p.background(255)
    } else {
      this.p.background(this.getGrey())
      // // Fill the background with static noise
      // if (this.bg) {
      //   this.p.image(this.bg, 0, 0)
      // } else {
      //   this.bg = this.p.createGraphics(this.windowWidth, this.windowHeight)
      //   this.bg.loadPixels()
      //   for (let x = 0; x < this.bg.width; x++) {
      //     for (let y = 0; y < this.bg.height; y++) {
      //       const noiseValue = this.bg.noise(x * 0.01, y * 0.01)
      //       const colorValue = this.bg.map(noiseValue, 0, 1, 0, 255)
      //       this.bg.set(x, y, this.bg.color(colorValue))
      //     }
      //   }
      //   this.bg.updatePixels()
      // }
    }
  }

  getColorDir(chunk) {
    return Math.floor(this.frames / (255 * chunk)) % 2 == 0
  }

  getBW() {
    const dir = this.getColorDir(this.chunk)
    const lowerHalf = (Math.floor(this.frames / this.chunk) % 255) < (255 / 2)
    if (dir && lowerHalf) {
      return 'white'
    } else if (!dir && !lowerHalf) {
      return 'white'
    } else if (!dir && lowerHalf) {
      return 'black'
    } else if (dir && !lowerHalf) {
      return 'black'
    }
    // return  ? 'white' : 'black'
  }

  getGrey() {
    if (this.getColorDir(this.chunk)) {
      return 255 - (Math.floor(this.frames / this.chunk) % 255)
    } else {
      return Math.floor(this.frames / this.chunk) % 255
    }
  }

  getNotGrey() {
    if (!this.getColorDir(this.chunk)) {
      return 255 - (Math.floor(this.frames / this.chunk) % 255)
    } else {
      return Math.floor(this.frames / this.chunk) % 255
    }
  }

  playSounds() {
    if (this.mute) return
    for (let i = 0; i < this.bodies.length; i++) {
      const body = this.bodies[i]
      const speed = body.velocity.mag()
      // const mass = body.radius
      const freq = this.p.map(speed, 0, 5, 100, 300)
      const amp = this.p.map(speed, 0, 5, 100, 200)
      this.oscillators[i].amp(amp)
      this.oscillators[i].freq(freq)
      this.envelopes[i].volume(freq)
      this.envelopes[i].play()

      this.envelopes[i].play(this.noises[i])
      // this.noises[i].pan(this.p.map(speed, 0, this.vectorLimit, -1, 1))
      // this.noises[i].amp(this.p.map(speed, 0, this.vectorLimit + 100, 0, 10))
    }
  }

  drawScore() {
    if (this.mode == 'nft') {
      this.p.noStroke()
      this.p.fill('white')
      // this.p.rect(0, 0, 50, 20)
      this.p.fill(this.getGrey())
      this.p.textAlign(this.p.RIGHT) // Right-align the text
      this.p.text(this.preRun + this.frames, 45, 15) // Adjust the x-coordinate to align the text
    } else {
      this.p.fill('white')
      this.p.rect(0, 0, 50, 20)
      this.p.fill('black')
      // this.p.textAlign(this.p.RIGHT) // Right-align the text
      const secondsAsTime = new Date(this.totalSec * 1000).toISOString().substr(14, 5)
      const thisLevelSecondsAsTime = new Date(this.thisLevelSec * 1000).toISOString().substr(14, 5)
      this.p.text('Total Frames: ' + this.preRun + this.frames, 50, 10) // Adjust the x-coordinate to align the text
      this.p.text('Total Time: ' + secondsAsTime, 50, 20) // Adjust the x-coordinate to align the text
      this.p.text('Total Shots: ' + this.missileCount, 50, 30) // Adjust the x-coordinate to align the text
      this.p.text('Lvl ' + (this.startingBodies - 2) + ' - ' + thisLevelSecondsAsTime + ' - ' + (this.startingBodies - this.bodies.length) + '/' + this.startingBodies + ' - ' + this.thisLevelMissileCount + ' shots', 50, 40) // Adjust the x-coordinate to align the text
      for (let i = 0; i < this.allLevelSec.length; i++) {
        const prevLevel = this.allLevelSec[i]
        const prevLevelSecondsAsTime = new Date(prevLevel.thisLevelSec * 1000).toISOString().substr(14, 5)
        this.p.text('Lvl ' + (this.allLevelSec.length - i) + ' - ' + prevLevelSecondsAsTime + ' - ' + prevLevel.thisLevelMissileCount + ' shots', 50, (i * 10) + 50) // Adjust the x-coordinate to align the text
      }
    }
  }

  drawGun() {
    this.p.stroke('rgba(200,200,200,1)')
    this.p.strokeCap(this.p.SQUARE)
    this.p.strokeWeight(10)

    // Bottom left corner coordinates
    let startX = 0
    let startY = this.windowHeight

    // Calculate direction from bottom left to mouse
    let dirX = this.p.mouseX - startX
    let dirY = this.p.mouseY - startY

    // Calculate the length of the direction
    let len = this.p.sqrt(dirX * dirX + dirY * dirY)

    // If the length is not zero, scale the direction to have a length of 100
    if (len != 0) {
      dirX = (dirX / len) * 100
      dirY = (dirY / len) * 100
    }

    // Draw the line
    this.p.line(startX, startY, startX + dirX, startY + dirY)
    this.p.strokeWeight(0)
  }

  drawExplosions() {
    if (this.explosions.length > 0) {
      for (let i = 0; i < this.explosions.length; i++) {
        const bomb = this.explosions[i][0]
        this.drawCenter(bomb.x, bomb.y, bomb.radius)
      }
    }

    for (let i = 0; i < this.explosions.length; i++) {
      const _explosion = this.explosions[i]
      const bomb = _explosion[0]
      this.p.fill('red')
      this.p.ellipse(bomb.x, bomb.y, bomb.i * 2, bomb.i * 2)
      _explosion.shift()
      if (_explosion.length == 0) {
        this.explosions.splice(i, 1)
      }
    }
  }

  drawMissiles() {
    this.p.fill('black')
    for (let i = 0; i < this.missiles.length; i++) {
      const body = this.missiles[i]
      this.p.strokeWeight(0)
      this.p.ellipse(body.position.x, body.position.y, body.radius / 2, body.radius / 2)
    }
  }


  paintAtOnce(n = this.paintSteps) {
    if (!this.bodiesGraphic) {
      this.bodiesGraphic = this.p.createGraphics(this.windowWidth, this.windowHeight)
    }
    for (let i = 0; i < n; i++) {
      const results = this.step(this.bodies, this.missiles)
      this.bodies = results.bodies
      this.missiles = results.missiles || []
      this.drawBodies(false)
      this.frames++
    }

    this.p.image(this.bodiesGraphic, 0, 0)
  }

  convertColor(c, isGrey = true) {
    const cc = c.replace('rgba(', '').replace(')', '')
    const r = parseInt(cc.split(',')[0]) + Math.floor((isGrey ? this.getGrey() : this.getNotGrey()) / 2)
    const g = parseInt(cc.split(',')[1]) + Math.floor((isGrey ? this.getGrey() : this.getNotGrey()) / 2)
    const b = parseInt(cc.split(',')[2]) + Math.floor((isGrey ? this.getGrey() : this.getNotGrey()) / 2)
    return [r, g, b]
    // this.bodiesGraphic.color(r, g, b)
  }

  drawBody(x, y, v, radius, c) {

    this.bodiesGraphic.fill(c)
    this.bodiesGraphic.ellipse(x, y, radius, radius)

    this.bodiesGraphic.push()
    this.bodiesGraphic.translate(x, y)
    var angle = v.heading() + this.p.PI / 2
    this.bodiesGraphic.rotate(angle)
    const eyeOffsetX = radius / 5
    const eyeOffsetY = radius / 8
    this.bodiesGraphic.fill('black')
    this.bodiesGraphic.ellipse(- eyeOffsetX, - eyeOffsetY, radius / 7, radius / 5)
    this.bodiesGraphic.ellipse(eyeOffsetX, - eyeOffsetY, radius / 7, radius / 5)
    this.bodiesGraphic.ellipse(0, + eyeOffsetY, radius / 7, radius / 7)
    this.bodiesGraphic.pop()



  }

  drawBodies(attachToCanvas = true) {
    // if (!this.bodiesGraphic) {
    this.bodiesGraphic = this.p//.createGraphics(this.windowWidth, this.windowHeight)
    // }
    // this.bodiesGraphic.clear()
    // if (this.mode == 'nft') this.drawBorder()
    this.bodiesGraphic.strokeWeight(1)
    const bodyCopies = []
    for (let i = 0; i < this.bodies.length; i++) {
      // const body = this.bodies.sort((a, b) => b.radius - a.radius)[i]
      const body = this.bodies[i]
      let c = body.c
      let finalColor
      if (this.colorStyle == 'squiggle') {
        const hueColor = (parseInt(c.split(',')[1]) + this.frames) % 360
        finalColor = this.bodiesGraphic.color(hueColor, 60, 100) // Saturation and brightness at 100 for pure spectral colors
      } else if (this.mode == 'nft') {
        // console.log(c)
        // finalColor = c

        finalColor = c.replace('0.5', '1')//this.convertColor(c)

      } else {
        finalColor = c
      }

      if (this.mode == 'nft') {
        // if (i % 3 == 0) {
        //   this.bodiesGraphic.stroke('black')
        // } else if (i % 2 == 0) {
        //   this.bodiesGraphic.stroke('white')
        // } else {
        //   this.bodiesGraphic.noStroke()
        // }
        // this.bodiesGraphic.noStroke()
        // this.bodiesGraphic.stroke(this.getBW())
        // this.bodiesGraphic.stroke('white')
        // this.bodiesGraphic.fill(finalColor)
        // this.bodiesGraphic.ellipse(body.position.x, body.position.y, radius, radius)
        const radius = body.radius * 4 + this.radiusMultiplyer
        this.drawBody(body.position.x, body.position.y, body.velocity, radius, finalColor)

        let loopedX = false, loopedY = false, loopX = body.position.x, loopY = body.position.y
        const loopGap = radius
        if (body.position.x > this.windowWidth - loopGap) {
          loopedX = true
          loopX = body.position.x - this.windowWidth
          // this.bodiesGraphic.ellipse(loopX, body.position.y, radius, radius)
          this.drawBody(loopX, body.position.y, body.velocity, radius, finalColor)
        } else if (body.position.x < loopGap) {
          loopedX = true
          loopX = body.position.x + this.windowWidth
          this.drawBody(loopX, body.position.y, body.velocity, radius, finalColor)

          // this.bodiesGraphic.ellipse(loopX, body.position.y, radius, radius)
        }
        if (body.position.y < this.windowHeight - loopGap) {
          loopedY = true
          loopY = body.position.y + this.windowHeight
          // this.bodiesGraphic.ellipse(body.position.x, loopY, radius, radius)
          this.drawBody(body.position.x, loopY, body.velocity, radius, finalColor)

        } else if (body.position.y > loopGap) {
          loopedY = true
          loopY = body.position.y - this.windowHeight
          // this.bodiesGraphic.ellipse(body.position.x, loopY, radius, radius)
          this.drawBody(body.position.x, loopY, body.velocity, radius, finalColor)
        }
        if (loopedX && loopedY) {
          this.drawBody(loopX, loopY, body.velocity, radius, finalColor)
          // this.bodiesGraphic.ellipse(loopX, loopY, body.velocity, radius, radius)
        }

        // const eyes = this.getAngledImage(body)
        // this.bodiesGraphic.image(eyes, 0, 0)
      } else {
        this.getAngledBody(body, finalColor)
        this.drawCenter(body.position.x, body.position.y, body.radius)
      }
      const bodyCopy = {
        position: this.p.createVector(body.position.x, body.position.y),
        velocity: this.p.createVector(body.velocity.x, body.velocity.y),
        radius: body.radius,
        c: c
      }
      bodyCopies.push(bodyCopy)
    }
    this.allCopiesOfBodies.push(bodyCopies)
    if (this.allCopiesOfBodies.length > 40) {
      this.allCopiesOfBodies.shift()
    }


    // this.bodiesGraphic.strokeWeight(0)
    if (attachToCanvas) {
      // this.p.image(this.bodiesGraphic, 0, 0)
    }
  }

  drawBorder() {

    // drawClock
    const clockCenter = this.windowWidth / 2

    // const radialStep1 = (this.frames / (this.chunk * 1) / 255) * 180 + 270 % 360
    // const clockRadius = this.windowWidth
    // const clockX = clockCenter + clockRadius * Math.cos(radialStep1 * Math.PI / 180)
    // const clockY = clockCenter + clockRadius * Math.sin(radialStep1 * Math.PI / 180)
    // this.bodiesGraphic.stroke(this.getBW())
    // this.bodiesGraphic.noStroke()
    // this.bodiesGraphic.fill(this.getNotGrey())
    // this.bodiesGraphic.ellipse(clockX, clockY, 100, 100)

    let size = this.windowWidth / Math.PI
    const radialStep2 = (this.frames / (this.chunk * 1) / 255) * 360 + 270 % 360
    const clockRadius2 = (this.windowWidth / 2) + size / 4

    const clockX2 = clockCenter + clockRadius2 * Math.cos(radialStep2 * Math.PI / 180)
    const clockY2 = clockCenter + clockRadius2 * Math.sin(radialStep2 * Math.PI / 180)
    // this.bodiesGraphic.stroke(this.getBW())
    this.bodiesGraphic.noStroke()
    // this.bodiesGraphic.stroke('white')
    this.bodiesGraphic.fill(this.getGrey())
    // if (size < 0) {
    //   size = 0
    // }
    this.bodiesGraphic.ellipse(clockX2, clockY2, size, size)

  }

  getAngledImage(body) {
    const graphic = this.p.createGraphics(this.windowWidth, this.windowHeight)
    graphic.push()
    graphic.translate(body.position.x, body.position.y)
    var angle = body.velocity.heading() + graphic.PI / 2
    graphic.rotate(angle)

    if (!this.eyes) {
      this.eyes = this.p.loadImage('/eyes-3.png')
    }
    const size = 6
    graphic.image(this.eyes, -body.radius * (size / 2), -body.radius * (size / 2), body.radius * size, body.radius * size)

    graphic.pop()
    graphic.push()
    graphic.translate(body.position.x, body.position.y)
    var angle2 = body.velocity.heading() + graphic.PI / 2
    graphic.rotate(angle2)
    graphic.pop()
    return graphic
  }

  getAngledBody(body, finalColor) {
    // rotate by velocity
    this.p.push()
    this.p.translate(body.position.x, body.position.y)
    var angle = body.velocity.heading() + this.p.PI / 2
    this.p.rotate(angle)

    this.p.strokeWeight(0)
    // stroke("white")
    this.p.fill(finalColor)
    // Calculate the vertices of the equilateral triangle
    let x1 = body.radius * 4 * this.p.cos(this.p.PI / 6)
    let y1 = body.radius * 4 * this.p.sin(this.p.PI / 6)

    let x2 = body.radius * 4 * this.p.cos(this.p.PI / 6 + this.p.TWO_PI / 3)
    let y2 = body.radius * 4 * this.p.sin(this.p.PI / 6 + this.p.TWO_PI / 3)

    let x3 = body.radius * 4 * this.p.cos(this.p.PI / 6 + 2 * this.p.TWO_PI / 3)
    let y3 = body.radius * 4 * this.p.sin(this.p.PI / 6 + 2 * this.p.TWO_PI / 3)

    this.p.triangle(x1, y1, x2, y2, x3, y3)
    this.p.pop()

    this.p.stroke('white')
    this.p.strokeWeight(1)
    this.p.push()
    this.p.translate(body.position.x, body.position.y)
    var angle2 = body.velocity.heading() + this.p.PI / 2
    this.p.rotate(angle2)
    this.p.pop()
  }


  drawTail(x, y, v, radius, finalColor) {
    const id = radius + '-' + finalColor
    console.log()
    if (!this.drawTails) {
      this.drawTails = {}
    }
    if (!this.drawTails || this.drawTails[id] == undefined) {
      this.drawTails[id] = this.p.createGraphics(this.windowWidth, this.windowHeight)
      this.drawTails[id].noStroke()
      this.drawTails[id].fill(finalColor)

      this.drawTails[id].beginShape()
      this.drawTails[id].vertex(radius, 0)
      this.drawTails[id].vertex(0, 0)





      // this.drawTails[id].fill('red')
      // this.drawTails[id].rect(0, 0, radius, radius / 2)

      const bumps = 7
      let bumpHeight = radius / 6
      // let heightChanger = radius / 10
      // const bumpHeightMax = radius / 5
      // const bumpHeightMin = radius / 8
      const startY = 0//radius / 4
      // this.drawTails[id].push()
      let remaindingWidth = radius
      const arcResolution = 10
      for (let i = 0; i < bumps; i++) {
        let bumpWidth = radius / bumps
        // bumpHeight += heightChanger
        // if (bumpHeight > bumpHeightMax || bumpHeight < bumpHeightMin) {
        //   heightChanger *= -1
        // }
        let x = radius - remaindingWidth
        if (i % 2 == 1) {
          // this.drawTails[id].arc(x + bumpWidth / 2, startY, bumpWidth, bumpHeight, this.drawTails[id].PI, 0, this.drawTails[id].OPEN)
          for (let j = 0; j < arcResolution; j++) {
            const ang = this.p.map(j, 0, arcResolution, this.p.PI, 0)
            const ax = x + bumpWidth / 2 + this.p.cos(ang) * bumpWidth / 2
            const ay = startY + bumpHeight + -1 * this.p.sin(ang) * bumpHeight / 2
            this.drawTails[id].vertex(ax, ay)
          }
        } else {
          for (let j = 0; j < arcResolution; j++) {
            const ang = this.p.map(j, 0, arcResolution, this.p.PI, 0)
            const ax = x + bumpWidth / 2 + this.p.cos(ang) * bumpWidth / 2
            const ay = startY + bumpHeight + this.p.sin(ang) * bumpHeight / 2
            this.drawTails[id].vertex(ax, ay)
          }
          // this.drawTails[id].arc(x + bumpWidth / 2, startY + bumpWidth, bumpWidth, bumpHeight, 0, this.drawTails[id].PI, this.drawTails[id].OPEN)
        }
        remaindingWidth -= bumpWidth
      }
      this.drawTails[id].endShape(this.drawTails[id].CLOSE)
      // this.drawTails[id].pop()

    }

    // this.drawTails[id].push()
    // this.drawTails[id].translate(x, y)
    var angle = v.heading() + this.drawTails[id].PI / 2
    // this.drawTails[id].rotate(angle)
    // this.drawTails[id].fill(finalColor)
    // this.drawTails[id].fill('rgba(255,0,0,1)')
    // this.drawTails[id].rect(0, 0, radius, radius / 4)
    // this.drawTails[id].pop()
    this.p.push()
    this.p.translate(x, y)
    this.p.rotate(angle)
    this.p.image(this.drawTails[id], -radius / 2, 0)
    this.p.pop()



  }

  drawBodyTrails() {
    // if (this.mode == 'nft') return
    for (let i = 0; i < this.allCopiesOfBodies.length; i++) {
      const copyOfBodies = this.allCopiesOfBodies[i]
      for (let j = 0; j < copyOfBodies.length; j++) {
        const body = copyOfBodies[j]
        const c = body.c
        let finalColor
        if (this.colorStyle == 'squiggle') {
          const hueColor = (parseInt(c.split(',')[1]) + this.frames) % 360
          finalColor = this.p.color(hueColor, 60, 100) // Saturation and brightness at 100 for pure spectral colors
        } else {
          finalColor = c
        }
        this.p.fill(finalColor)
        if (this.mode == 'nft') {
          const radius = body.radius * 4 + this.radiusMultiplyer

          // this.p.ellipse(body.position.x, body.position.y, radius, radius)
          this.p.push()
          this.p.translate(body.position.x, body.position.y)
          this.p.rotate(body.velocity.heading() + this.p.PI / 2)
          this.p.arc(0, 0, radius, radius, this.p.PI, 2 * this.p.PI)
          this.p.pop()
          // if (i == 0) {
          this.drawTail(body.position.x, body.position.y, body.velocity, radius, finalColor)
          // }
        } else {
          this.p.push()
          this.p.translate(body.position.x, body.position.y)
          var angle = body.velocity.heading() + this.p.PI / 2
          this.p.rotate(angle)
          let x1 = body.radius * 4 * this.p.cos(this.p.PI / 6)
          let y1 = body.radius * 4 * this.p.sin(this.p.PI / 6)

          let x2 = body.radius * 4 * this.p.cos(this.p.PI / 6 + this.p.TWO_PI / 3)
          let y2 = body.radius * 4 * this.p.sin(this.p.PI / 6 + this.p.TWO_PI / 3)

          let x3 = body.radius * 4 * this.p.cos(this.p.PI / 6 + 2 * this.p.TWO_PI / 3)
          let y3 = body.radius * 4 * this.p.sin(this.p.PI / 6 + 2 * this.p.TWO_PI / 3)
          this.p.triangle(x1, y1, x2, y2, x3, y3)
          this.p.pop()
        }
      }
    }
  }


  drawCenter(x, y, r) {
    this.p.strokeWeight(0)
    const max = 4
    for (var i = 0; i < max; i++) {
      if (i % 2 == 0) {
        this.p.fill('white')
      } else {
        this.p.fill('red')
      }
      this.p.ellipse(x, y, r * (max - i))
    }
  }

  colorArrayToTxt(cc) {
    const opac = 0.5
    // let cc = baseColor.map(c => c + start + (chunk * i))
    cc.push(opac)
    cc = `rgba(${cc.join(',')})`
    return cc
  }

  generateBodies() {

    if (this.inputData) {
      // console.dir({ inputData: this.inputData }, { depth: null })
      const step1 = this.inputData.map(this.convertScaledStringArrayToBody.bind(this))
      // console.dir({ step1 }, { depth: null })
      this.bodies = this.convertBigIntsToBodies(step1)
      // console.dir({ bodies: this.bodies })
      this.bgColor = this.colorArrayToTxt([0, 0, 0,])//this.randomColor(0, 20))
      this.radiusMultiplyer = this.random(10, 200)
      for (let i = 0; i < this.startingBodies; i++) {
        this.bodies[i].c = this.colorArrayToTxt(this.randomColor(200, 250))
        this.bodies[i].bodyIndex = i
      }
      return
    }
    if (this.bodyData) {
      this.bgColor = this.colorArrayToTxt(this.randomColor(0, 200))
      this.radiusMultiplyer = this.random(10, 200)
      this.bodies = this.bodyData.map(b => {
        const seed = b.seed
        const bodyRNG = new Prando(seed.toString(16))
        const px = b.px.toNumber() / parseInt(this.scalingFactor)
        const py = b.py.toNumber() / parseInt(this.scalingFactor)
        const vx = (b.vx.toNumber() - this.vectorLimit * parseInt(this.scalingFactor)) / parseInt(this.scalingFactor)
        const vy = (b.vy.toNumber() - this.vectorLimit * parseInt(this.scalingFactor)) / parseInt(this.scalingFactor)
        const radius = b.radius.toNumber() / parseInt(this.scalingFactor)
        return {
          index: b.bodyIndex,
          position: this.createVector(px, py),
          velocity: this.createVector(vx, vy),
          radius: radius,
          c: this.colorArrayToTxt(this.randomColor(0, 200, bodyRNG))
        }
      })
      this.startingBodies = this.bodies.length
      return
    }
    const ss = []
    const cs = []
    const bodies = []

    this.radiusMultiplyer = this.random(10, 200)

    const startingRadius = 10//this.random(20, 40)

    // const baseColor = this.randomColor(0, 200)

    // const range = 100
    // const midRange = range / 2
    // const start = 0 - midRange
    // const totalChunks = this.startingBodies
    // const chunk = range / totalChunks

    this.bgColor = this.colorArrayToTxt(this.randomColor(0, 10))

    for (let i = 0; i < this.startingBodies; i++) {
      cs.push(this.colorArrayToTxt(this.randomColor(100, 200)))
    }

    for (let i = 0; i < this.startingBodies; i++) {
      let s = this.randomPosition()
      ss.push(s)
    }
    if (this.startingBodies.length > 10) {
      throw new Error('too many bodies')
    }
    let maxSize = this.startingBodies < 10 ? 10 : this.startingBodies
    for (let i = 0; i < maxSize; i++) {
      if (i >= this.startingBodies) break
      const radius = (maxSize - i * 5) + startingRadius
      const body = {
        bodyIndex: i,
        position: this.createVector(ss[i][0], ss[i][1]),
        velocity: this.createVector(0, 0),
        radius,
        c: cs[i]
      }
      bodies.push(body)
    }

    this.bodies = bodies
    // .sort((a, b) => b.radius - a.radius)
  }

  createVector(x, y) {
    if (this.p) {
      return this.p.createVector(x, y)
    } else {
      return { x, y }
    }
  }

  random(min, max, rng = this.rng) {
    return rng.nextInt(min, max)
    // return Math.floor(Math.random() * (upper - lower + 1)) + lower;
  }

  randomColor(min = 0, max = 255, rng = this.rng) {
    const color = []
    let c = Math.floor(this.random(min, max, rng))
    for (let i = 0; i < 3; i++) {
      // let c = this.random(min, max, rng)
      color.push(c)
    }
    return color
  }
  randomPosition() {
    const radiusDist = this.random(_smolr(this.windowWidth, this.windowHeight) * .37, _smolr(this.windowWidth, this.windowHeight) * .47)
    const randomDir = this.random(0, 360)
    const x = (radiusDist * Math.cos(randomDir)) + (this.windowWidth / 2)
    const y = radiusDist * Math.sin(randomDir) + (this.windowWidth / 2)
    return [x, y]
  }

  prepareP5() {
    this.p.frameRate(60)
    this.p.createCanvas(this.windowWidth, this.windowWidth)
    this.p.background('white')
  }

  missileClick(e) {
    if (this.missiles.length > 0 && !this.admin) return
    const body = document.getElementsByClassName('p5Canvas')[0]
    this.thisLevelMissileCount++
    this.missileCount++
    const actualWidth = body.offsetWidth
    const x = e.offsetX * this.windowWidth / actualWidth
    const y = e.offsetY * this.windowWidth / actualWidth
    const radius = 10

    const b = {
      position: this.p.createVector(0, this.windowWidth),
      velocity: this.p.createVector(x, y - this.windowWidth),
      radius,
    }
    b.velocity.limit(20)
    this.missiles.push(b)
    const maxVectorScaled = this.convertFloatToScaledBigInt(this.vectorLimit)
    this.missileInits.push({
      step: this.frames,
      x: '0',
      y: (BigInt(this.windowWidth) * this.scalingFactor).toString(),
      vx: (this.convertFloatToScaledBigInt(b.velocity.x) + maxVectorScaled).toString(),
      vy: (this.convertFloatToScaledBigInt(b.velocity.y) + maxVectorScaled).toString(),
      radius: radius.toString()
    })
  }

  // Add methods here
}





// const preRun = 0
// const colorStyle = "!squiggle"
// let totalBodies = 6
// const clearBG = true
// const bodies = []
// var showIt = false








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

(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    // Node.js environment
    module.exports = factory()
  } else if (typeof define === 'function' && define.amd) {
    // AMD module
    define(factory)
  } else {
    // Browser environment
    root.AnybodyUtils = factory()
  }
}(typeof self !== 'undefined' ? self : this, function () {
  return {
    Anybody,
    _smolr,
    _convertBigIntToModP,
    _approxDist,
    _approxSqrt,
    _approxDiv,
    _calculateTime,
    _explosion,
    _addVectors,
    _validateSeed,
  }
}))

// ------
/// functional utils
// ------

function _smolr(a, b) {
  return a < b ? a : b
}
function _convertBigIntToModP(v) {
  const prime = 21888242871839275222246405745257275088548364400416034343698204186575808495617n
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
function _approxDiv(dividend, divisor) {
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
function _calculateTime(constraints, steps = 1) {
  const totalSteps = steps * 1_000_000 / constraints
  const fps = 25
  const sec = totalSteps / fps
  return Math.round(sec * 100) / 100
}

function _explosion(x, y, radius) {
  let bombs = []
  for (let i = 0; i < 100; i++) {
    bombs.push({
      x, y, i, radius
    })
  }
  return bombs
}

function _addVectors(v1, v2) {
  return [v1[0] + v2[0], v1[1] + v2[1]]
}


function _validateSeed(seed) {
  const error = 'Seed must be a 32-byte value'
  // ensure that the seed is a 32-byte value
  if (typeof seed === 'string') {
    if (seed.length !== 66) {
      throw new Error(error + ' (1)')
    }
    // confirm that all characters are hex characters
    if (seed.substring(2, 66).match(/[^0-9A-Fa-f]/)) {
      throw new Error(error + ' (2)')
    }
    if (seed.substring(0, 2) !== '0x') {
      throw new Error(error + ' (3)')
    }
    seed = BigInt(seed)
  }
  if (typeof seed === 'bigint') {
    if (seed < 0n) {
      throw new Error(error + ' (4)')
    }
    if (seed > 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFn) {
      // if (seed > 115792089237316195423570985008687907853269984665640564039457584007913129639935n) {
      throw new Error(error + ' (5)')
    }
  } else {
    throw new Error(error + ' (6)')
  }
}