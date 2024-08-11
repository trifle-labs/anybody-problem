import EventEmitter from './events'
import Sound from './sound.js'
import { Visuals } from './visuals.js'
import { Calculations } from './calculations.js'
import { utils } from 'ethers'
import { bodyThemes } from './colors.js'
import { loadFonts } from './fonts.js'
import { Buttons } from './buttons.js'

const GAME_LENGTH_BY_LEVEL_INDEX = [30, 10, 20, 30, 40, 50]
const NORMAL_GRAVITY = 100
const proverTickIndex = {
  2: 250,
  3: 250,
  4: 250,
  5: 125,
  6: 125
}
function intersectsButton(button, x, y) {
  return (
    x > button.x &&
    x < button.x + button.width &&
    y > button.y &&
    y < button.y + button.height
  )
}

const PAUSE_BODY_DATA = [
  {
    bodyIndex: 0,
    radius: 36000,
    px: 149311,
    py: 901865,
    vx: 0,
    vy: 0
  },
  {
    bodyIndex: 1,
    radius: 32000,
    px: 309311,
    py: 121865,
    vx: 0,
    vy: 0
  },
  {
    bodyIndex: 2,
    radius: 30000,
    px: 850311,
    py: 811865,
    vx: 0,
    vy: 0
  },
  {
    bodyIndex: 3,
    radius: 7000,
    px: 833406,
    py: 103029,
    vx: 0,
    vy: 0
  },
  {
    bodyIndex: 4,
    radius: 20000,
    px: 705620,
    py: 178711,
    vx: -100000,
    vy: -1111000
  },
  {
    bodyIndex: 5,
    radius: 17000,
    px: 139878,
    py: 454946,
    vx: 0,
    vy: 0
  },
  {
    bodyIndex: 6,
    radius: 9000,
    px: 289878,
    py: 694946,
    vx: 0,
    vy: 0
  },
  {
    bodyIndex: 7,
    radius: 14000,
    px: 589878,
    py: 694946,
    vx: -100000,
    vy: -1111000
  }
]

const SECONDS_IN_A_DAY = 86400
const currentDay = () =>
  Math.floor(Date.now() / 1000) -
  (Math.floor(Date.now() / 1000) % SECONDS_IN_A_DAY)

export class Anybody extends EventEmitter {
  constructor(p, options = {}) {
    super()
    Object.assign(this, Visuals)
    Object.assign(this, Calculations)
    Object.assign(this, Buttons)

    this.setOptions(options)

    // Add other constructor logic here
    this.p = p
    !this.util && loadFonts(this.p)
    // this.p.blendMode(this.p.DIFFERENCE)

    this.levelSpeeds = new Array(5)
    this.clearValues()
    !this.util && this.prepareP5()
    this.sound = new Sound(this)
    this.init()
    !this.util && this.start()
  }

  proverTickIndex(i) {
    return proverTickIndex[i]
  }

  setOptions(options = {}) {
    const defaultOptions = {
      day: currentDay(),
      level: 0,
      skip0: false,
      bodyData: null,
      todaysRecords: {},
      // debug: false,
      // Add default properties and their initial values here
      startingBodies: 1,
      windowWidth: 1000,
      windowHeight: 1000,
      pixelDensity: 1,
      scalingFactor: 10n ** 3n,
      minDistanceSquared: 200 * 200,
      G: NORMAL_GRAVITY, // Gravitational constant
      mode: 'game', // game or nft
      admin: false,
      solved: false,
      clearBG: true,
      colorStyle: '!squiggle', // squiggle or !squiggle
      preRun: 0,
      alreadyRun: 0,
      paintSteps: 0,
      chunk: 1,
      mute: true,
      freeze: false,
      test: false,
      util: false,
      paused: true,
      globalStyle: 'default', // 'default', 'psycho'
      aimHelper: false,
      target: 'inside', // 'outside' or 'inside'
      faceRotation: 'mania', // 'time' or 'hitcycle' or 'mania'
      sfx: 'space', // 'space' or 'bubble'
      playerName: undefined,
      practiceMode: false,
      bestTimes: null,
      popup: null
    }
    // Merge the default options with the provided options
    const mergedOptions = { ...defaultOptions, ...options }
    // Assign the merged options to the instance properties
    Object.assign(this, mergedOptions)
  }
  setPlayer(name = undefined) {
    this.playerName = name
  }
  removeCSS() {
    if (typeof document === 'undefined') return
    const style = document.getElementById('canvas-cursor')
    style && document.head.removeChild(style)
  }
  addCSS() {
    if (typeof document === 'undefined') return
    if (document.getElementById('canvas-cursor')) return
    const style = document.createElement('style')
    style.id = 'canvas-cursor' // Add an id to the style element

    style.innerHTML = `
      #canvas, canvas {
        cursor: none;
      }
    `
    document.head.appendChild(style)
  }

  // run whenever the class should be reset
  clearValues() {
    if (this.level <= 1) this.levelSpeeds = new Array(5)
    if (this.skip0 && this.level == 0) {
      this.level = 1
    }
    this.lastMissileCantBeUndone = false
    this.speedFactor = 2
    this.speedLimit = 10
    this.missileSpeed = 15
    this.shownStatScreen = false
    this.G = NORMAL_GRAVITY
    this.vectorLimit = this.speedLimit * this.speedFactor
    this.missileVectorLimit = this.missileSpeed * this.speedFactor
    this.FPS = 25
    this.P5_FPS_MULTIPLIER = 3
    this.P5_FPS = this.FPS * this.P5_FPS_MULTIPLIER
    this.p?.frameRate(this.P5_FPS)
    this.timer =
      (this.level > 5 ? 60 : GAME_LENGTH_BY_LEVEL_INDEX[this.level]) * this.FPS
    this.deadOpacity = '0.9'
    this.initialScoreSize = 120
    this.scoreSize = this.initialScoreSize
    this.opac = this.globalStyle == 'psycho' ? 1 : 1
    this.tailLength = 1
    this.tailMod = this.globalStyle == 'psycho' ? 2 : 1
    this.explosions = []
    this.missiles = []
    this.stillVisibleMissiles = []
    this.missileInits = []
    this.bodies = []
    this.witheringBodies = []
    this.bodyInits = []
    this.bodyFinal = []
    this.missileCount = 0
    this.frames = 0
    this.p5Frames = 0
    this.showIt = true
    this.justStopped = false
    this.gameOver = false
    this.firstFrame = true
    this.loaded = false
    this.showPlayAgain = false
    this.handledGameOver = false
    this.statsText = ''
    this.hasStarted = false
    this.buttons = {}
    this.won = false
    this.finalBatchSent = false
    this.solved = false
    this.shaking = 0
    this.explosionSmoke = []
    this.gunSmoke = []
    this.date = new Date(this.day * 1000)
      .toISOString()
      .split('T')[0]
      .replace(/-/g, '.')
    this.framesTook = false
    this.showProblemRankingsScreenAt = -1
    this.saveStatus = 'unsaved' // 'unsaved' -> 'validating' -> 'validated' -> 'saving' -> 'saved' | 'error'
    delete this.validatedAt
    delete this.validatingAt
    delete this.savingAt
    delete this.savedAt

    // uncomment to work on the game over screen
    // setTimeout(() => {
    //   this.handleGameOver({ won: true })
    // }, 500)

    // uncomment to work on the problem-ranking screen
    // setTimeout(() => {
    //   this.showProblemRankingsScreenAt = this.p5Frames
    // }, 500)
  }

  // run once at initilization
  init() {
    this.skipAhead = false
    this.winScreenBaddies = undefined
    this.seed = utils.solidityKeccak256(['uint256'], [this.day])
    this.generateBodies()
    this.frames = this.alreadyRun
    this.startingFrame = this.alreadyRun
    this.stopEvery = this.test ? 20 : this.proverTickIndex(this.level + 1)
    this.lastLevel = this.level
    // const vectorLimitScaled = this.convertFloatToScaledBigInt(this.vectorLimit)
    this.setPause(this.paused, true)
    this.storeInits()
    // this.prepareWitness()
  }

  async start() {
    this.addCSS()
    this.addListeners()
    this.runSteps(this.preRun)
    // this.paintAtOnce(this.paintSteps)
    if (this.freeze) {
      this.setPause(true, true)
    }
  }

  destroy() {
    this.resizeObserver.disconnect(this.p.canvas)
    this.setPause(true)
    this.p.noLoop()
    this.removeListener()
    this.sound.stop()
    this.sound = null
    this.p.remove()
  }

  storeInits() {
    this.bodyInits = this.processInits(this.bodies)
  }

  processInits(bodies) {
    return this.convertBodiesToBigInts(bodies).map((b) => {
      b = this.convertScaledBigIntBodyToArray(b)
      b[2] = BigInt(b[2]).toString()
      b[3] = BigInt(b[3]).toString()
      return b
    })
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
        this.frames++
        this.bodies = results.bodies
        this.missiles = results.missiles || []
      }
    }
  }

  addListeners() {
    this.p.mouseMoved = this.handleMouseMove
    this.p.touchStarted = (e) => {
      this.hasTouched = true
      this.handleGameClick(e)
    }
    this.p.mouseClicked = this.handleGameClick
    this.p.keyPressed = this.handleGameKeyDown
  }

  removeListener() {
    this.p.remove()
  }

  getXY(e) {
    let x, y
    if (e.touches) {
      x = e.touches[0].pageX - this.canvasRect.left
      y = e.touches[0].pageY - this.canvasRect.top
    } else {
      x = e.offsetX || e.layerX
      y = e.offsetY || e.layerY
    }
    x = (x * this.windowWidth) / this.canvasRect.width
    y = (y * this.windowHeight) / this.canvasRect.height
    return { x, y }
  }

  handleMouseMove = (e) => {
    const { x, y } = this.getXY(e)
    this.mouseX = x
    this.mouseY = y
    // check if mouse is inside any of the buttons
    for (const key in this.buttons) {
      const button = this.buttons[key]
      button.hover = intersectsButton(button, x, y)
    }
  }

  handleGameClick = (e) => {
    if (this.gameOver && this.won) {
      this.skipAhead = true
    }
    const { x, y } = this.getXY(e)
    // if mouse is inside of a button, call the button's handler
    for (const key in this.buttons) {
      const button = this.buttons[key]
      if (
        button.visible &&
        intersectsButton(button, x, y) &&
        !button.disabled
      ) {
        button.onClick()
        return
      }
    }

    // const debugZone = { x: this.windowWidth - 100, y: this.windowHeight - 100 }
    // if (x > debugZone.x && y > debugZone.y) {
    //   this.debug = !this.debug
    // }

    if (this.paused || this.gameOver) return
    this.missileClick(x, y)
  }

  handleNFTClick = () => {
    this.setPause()
  }

  handleGameKeyDown = (e) => {
    if (this.gameOver && this.won) {
      this.skipAhead = true
    }
    const modifierKeyActive = e.shiftKey && e.altKey && e.ctrlKey && e.metaKey
    if (modifierKeyActive) return
    switch (e.code) {
      case 'Space':
        if (this.mouseX || this.mouseY) {
          e.preventDefault()
          this.missileClick(this.mouseX, this.mouseY)
        }
        break
      case 'KeyR':
        this.restart(null, false)
        break
      case 'KeyP':
        if (!this.gameOver) this.setPause()
        break
    }
  }

  handleGameOver = ({ won }) => {
    if (this.handledGameOver) return
    this.handledGameOver = true
    this.gameoverTickerX = 0
    // this.sound?.playGameOver({ won }) // TDDO: improve audio
    this.gameOver = true
    this.won = won
    if (this.level !== 0 && !this.won) {
      const gravityIndex = this.bodies
        .slice(1)
        .filter((b) => b.radius !== 0n).length
      const newBodies = this.generateLevelData(
        this.day,
        6 - gravityIndex
      ).slice(1)
      this.bodies.push(
        ...newBodies
          .map((b) => this.bodyDataToBodies.call(this, b))
          .map((b) => {
            b.position.x = 0
            b.position.y = 0
            b.py = 0n
            b.px = 0n
            return b
          })
      )
    }
    this.P5_FPS *= 2
    this.p.frameRate(this.P5_FPS)
    var timeTook = 0

    const stats = this.calculateStats()
    timeTook = stats.timeTook
    this.framesTook = stats.framesTook
    this.emit('done', {
      level: this.level,
      won,
      ticks: this.frames - this.startingFrame,
      timeTook,
      framesTook: this.framesTook
    })
    if (won) {
      this.bodyData = null
      this.finish()
    }
  }

  restart = (options, beginPaused = true) => {
    if (options) {
      this.setOptions(options)
    }
    if (this.level !== this.lastLevel) {
      // this.starBG = null
    }
    this.clearValues()
    this.sound?.stop()
    this.sound?.playStart()
    this.sound?.setSong()
    this.init()
    this.draw()
    if (beginPaused) {
      this.setPause(true)
    }
    this.addCSS()
  }

  doubleTextInverted(text) {
    return text.slice(0, -1) + text.split('').reverse().join('')
  }

  setPause(newPauseState = !this.paused, mute = false) {
    if (typeof newPauseState !== 'boolean') {
      newPauseState = !this.paused
    }

    if (newPauseState) {
      this.pauseBodies = PAUSE_BODY_DATA.map((b) =>
        this.bodyDataToBodies.call(this, b)
      )
      this.pauseBodies[1].c = this.getBodyColor(this.day + 1, 0)
      this.pauseBodies[2].c = this.getBodyColor(this.day + 2, 0)
      this.paused = newPauseState
      this.willUnpause = false
      delete this.beganUnpauseAt
    } else {
      this.justPaused = true
      this.willUnpause = true
    }

    this.emit('paused', newPauseState)
    if (newPauseState) {
      if (!mute) this.sound?.pause()
    } else {
      if (!mute) this.sound?.resume()
    }
  }

  step() {
    // this.steps ||= 0
    // console.log({ steps: this.steps })
    // this.steps++
    // console.dir(
    //   { bodies: this.bodies, missiles: this.missiles[0] },
    //   { depth: null }
    // )
    if (this.missiles.length == 0 && this.lastMissileCantBeUndone) {
      console.log('LASTMISSILECANTBEUNDONE = FALSE')
      this.lastMissileCantBeUndone = false
    }
    this.bodies = this.forceAccumulator(this.bodies)
    var results = this.detectCollision(this.bodies, this.missiles)
    this.bodies = results.bodies
    this.missiles = results.missiles || []
    if (this.missiles.length > 0) {
      const missileCopy = JSON.parse(JSON.stringify(this.missiles[0]))
      this.stillVisibleMissiles.push(missileCopy)
    }
    if (this.missiles.length > 0 && this.missiles[0].radius == 0) {
      this.missiles.splice(0, 1)
    } else if (this.missiles.length > 1 && this.missiles[0].radius !== 0) {
      // NOTE: follows logic of circuit
      const newMissile = this.missiles.splice(0, 1)
      this.missiles.splice(0, 1, newMissile[0])
    }
    return { bodies: this.bodies, missiles: this.missiles }
  }

  started() {
    this.emit('started', {
      day: this.day,
      level: this.level,
      bodyInits: JSON.parse(JSON.stringify(this.bodyInits))
    })
  }

  processMissileInits(missiles) {
    const radius = 10
    return missiles.map((b) => {
      const maxMissileVectorScaled = this.convertFloatToScaledBigInt(
        this.missileVectorLimit
      )
      return {
        step: b.step,
        x: this.convertFloatToScaledBigInt(b.position.x).toString(),
        y: this.convertFloatToScaledBigInt(b.position.y).toString(),
        vx: (
          this.convertFloatToScaledBigInt(b.velocity.x) + maxMissileVectorScaled
        ).toString(),
        vy: (
          this.convertFloatToScaledBigInt(b.velocity.y) + maxMissileVectorScaled
        ).toString(),
        radius: radius.toString()
      }
    })
  }

  finish() {
    if (this.finalBatchSent) return
    // this.finished = true
    // this.setPause(true)
    const maxMissileVectorScaled = parseInt(
      this.convertFloatToScaledBigInt(this.missileVectorLimit)
    ).toString()

    this.calculateBodyFinal()
    const missileInputs = []
    if (this.mode == 'game') {
      let missileIndex = 0
      // loop through all the steps that were just played since the last chunk
      for (let i = this.alreadyRun; i < this.alreadyRun + this.stopEvery; i++) {
        // if the step index matches the step where a missile was shot, add the missile to the missileInputs
        // otherwise fill the missileInit array with an empty missile
        if (this.missileInits[missileIndex]?.step == i) {
          const missile = this.missileInits[missileIndex]
          missileInputs.push([missile.vx, missile.vy, missile.radius])
          missileIndex++
        } else {
          missileInputs.push([
            maxMissileVectorScaled,
            maxMissileVectorScaled,
            '0'
          ])
        }
      }
      // add one more because missileInits contains one extra for circuit
      missileInputs.push([maxMissileVectorScaled, maxMissileVectorScaled, '0'])
    }

    // define the inflightMissile for the proof from the first missile shot during this chunk
    // if the first missile shot was shot at step == alreadyRun (start of this chunk)
    // add it as an inflightMissile otherwise add a dummy missile
    let inflightMissile =
      this.missileInits[0]?.step == this.alreadyRun
        ? this.missileInits[0]
        : {
            x: '0',
            y: (this.windowWidth * parseInt(this.scalingFactor)).toString(),
            vx: maxMissileVectorScaled,
            vy: maxMissileVectorScaled,
            radius: '0'
          }
    inflightMissile = [
      inflightMissile.x,
      inflightMissile.y,
      inflightMissile.vx,
      inflightMissile.vy,
      inflightMissile.radius
    ]

    // defind outflightMissile for the proof from the currently flying missiles
    // if there is no missile flying, add a dummy missile
    const outflightMissileTmp = this.missiles[0] || {
      px: '0',
      py: (this.windowWidth * parseInt(this.scalingFactor)).toString(),
      vx: maxMissileVectorScaled,
      vy: maxMissileVectorScaled,
      radius: '0'
    }
    const outflightMissile = [
      outflightMissileTmp.px,
      outflightMissileTmp.py,
      outflightMissileTmp.vx,
      outflightMissileTmp.vy,
      outflightMissileTmp.radius
    ]

    const { day, level, bodyInits, bodyFinal, framesTook } = this

    const results = JSON.parse(
      JSON.stringify({
        day,
        level,
        inflightMissile,
        missiles: missileInputs,
        bodyInits,
        bodyFinal,
        framesTook,
        outflightMissile
      })
    )

    this.bodyInits = JSON.parse(JSON.stringify(this.bodyFinal))
    this.alreadyRun = this.frames

    // this.missileInits is initialized with the currently in flight missiles
    this.missileInits = this.processMissileInits(this.missiles).map((m) => {
      m.step = this.frames
      return m
    })
    this.emit('chunk', results)
    this.bodyFinal = []
    // this.setPause(false)
    if (
      this.mode == 'game' &&
      this.bodies
        .slice(this.level == 0 ? 0 : 1)
        .reduce((a, c) => a + c.radius, 0) == 0
    ) {
      this.finalBatchSent = true
    }
    // if missiles.length > 0 that means that there is currently a missile in flight
    // and so you can't add a new missile until the current missile has been finished.
    // it is finished when this.missiles.length == 0, as checked in step() and missileClick()
    // If a missile is shot while lastMissileCantBeUndone is true, then an event is emittied
    // to notify the proving system to remove the last shot from the last chunk and the missile
    // is removed from the missileInits array to prevent it from being used as incoming missile
    // during the next chunk.
    if (this.missiles.length > 0) {
      console.log('LASTMISSILECANTBEUNDONE = TRUE')
      this.lastMissileCantBeUndone = true
    }
    if (level !== 0) {
      this.levelSpeeds[level - 1] = results
    }
    return results
  }

  generateLevelData(day, level) {
    const bodyData = []
    for (let i = 0; i <= level; i++) {
      const dayLevelIndexSeed = utils.solidityKeccak256(
        ['uint256', 'uint256', 'uint256'],
        [day, level, i]
      )
      bodyData.push(this.getRandomValues(dayLevelIndexSeed, i, level))
    }
    return bodyData
  }

  getRandomValues(dayLevelIndexSeed, index, level = this.level) {
    const maxVectorScaled = this.convertFloatToScaledBigInt(this.vectorLimit)

    const body = {}
    body.bodyIndex = index
    body.seed = dayLevelIndexSeed
    body.radius = this.genRadius(index, level)

    if (level == 0) {
      body.px = parseInt((BigInt(this.windowWidth) * this.scalingFactor) / 2n)
      body.py = parseInt((BigInt(this.windowWidth) * this.scalingFactor) / 2n)
      body.vx = parseInt(maxVectorScaled) - 5000
      body.vy = parseInt(maxVectorScaled)
      return body
    }

    let rand = utils.solidityKeccak256(['bytes32'], [dayLevelIndexSeed])
    body.px = this.randomRange(
      0,
      BigInt(this.windowWidth) * this.scalingFactor,
      rand
    )

    rand = utils.solidityKeccak256(['bytes32'], [rand])
    body.py = this.randomRange(
      0,
      BigInt(this.windowWidth) * this.scalingFactor,
      rand
    )

    rand = utils.solidityKeccak256(['bytes32'], [rand])
    body.vx = this.randomRange(
      maxVectorScaled / 2n,
      (maxVectorScaled * 3n) / 2n,
      rand
    )

    rand = utils.solidityKeccak256(['bytes32'], [rand])
    body.vy = this.randomRange(
      maxVectorScaled / 2n,
      (maxVectorScaled * 3n) / 2n,
      rand
    )

    return body
  }

  genRadius(index, level = this.level) {
    // const radii = [36n, 27n, 23n, 19n, 15n, 11n] // n * 4 + 2 TODO: switch to this on next deployment
    const radii = [36n, 27n, 22n, 17n, 12n, 7n] // n * 5 + 2
    let size = level == 0 ? 27n : radii[index % radii.length]
    return parseInt(size * BigInt(this.scalingFactor))
  }

  randomRange(minBigInt, maxBigInt, seed) {
    if (minBigInt == maxBigInt) return minBigInt
    minBigInt = typeof minBigInt === 'bigint' ? minBigInt : BigInt(minBigInt)
    maxBigInt = typeof maxBigInt === 'bigint' ? maxBigInt : BigInt(maxBigInt)
    seed = typeof seed === 'bigint' ? seed : BigInt(seed)
    return parseInt((seed % (maxBigInt - minBigInt)) + minBigInt)
  }

  generateBodies() {
    this.bodyData =
      this.bodyData || this.generateLevelData(this.day, this.level)
    this.bodies = this.bodyData.map((b) => this.bodyDataToBodies.call(this, b))
    this.startingBodies = this.bodies.length
  }

  bodyDataToBodies(b, day = this.day) {
    const bodyIndex = b.bodyIndex
    const px = b.px / parseInt(this.scalingFactor)
    const py = b.py / parseInt(this.scalingFactor)
    const vx =
      (b.vx - this.vectorLimit * parseInt(this.scalingFactor)) /
      parseInt(this.scalingFactor)
    const vy =
      (b.vy - this.vectorLimit * parseInt(this.scalingFactor)) /
      parseInt(this.scalingFactor)
    const radius = b.radius / parseInt(this.scalingFactor)
    // const faceIndex = this.getFaceIdx(b.seed)
    return {
      seed: b.seed,
      // faceIndex,
      bodyIndex: bodyIndex,
      position: this.createVector(px, py),
      velocity: this.createVector(vx, vy),
      radius: radius,
      c: this.getBodyColor(day, bodyIndex)
    }
  }

  getBodyColor(day, bodyIndex = 0) {
    let baddieSeed = utils.solidityKeccak256(
      ['uint256', 'uint256'],
      [day, bodyIndex]
    )
    const baddieHue = this.randomRange(0, 359, baddieSeed)
    baddieSeed = utils.solidityKeccak256(['bytes32'], [baddieSeed])
    const baddieSaturation = this.randomRange(90, 100, baddieSeed)
    baddieSeed = utils.solidityKeccak256(['bytes32'], [baddieSeed])
    const baddieLightness = this.randomRange(55, 60, baddieSeed)

    // hero body info
    const themes = Object.keys(bodyThemes)
    const numberOfThemes = themes.length
    let rand = utils.solidityKeccak256(['uint256'], [day])
    const faceOptions = 14
    const bgOptions = 10
    const fgOptions = 10
    const coreOptions = 1
    const fIndex = this.randomRange(0, faceOptions - 1, rand)
    rand = utils.solidityKeccak256(['bytes32'], [rand])
    const bgIndex = this.randomRange(0, bgOptions - 1, rand)
    rand = utils.solidityKeccak256(['bytes32'], [rand])
    const fgIndex = this.randomRange(0, fgOptions - 1, rand)
    rand = utils.solidityKeccak256(['bytes32'], [rand])
    const coreIndex = this.randomRange(0, coreOptions - 1, rand)

    rand = utils.solidityKeccak256(['bytes32'], [rand])
    const dailyThemeIndex = this.randomRange(0, numberOfThemes - 1, rand)

    const themeName = themes[dailyThemeIndex]
    const theme = bodyThemes[themeName]

    rand = utils.solidityKeccak256(['bytes32'], [rand])
    const bgHue = this.randomRange(0, 359, rand)
    rand = utils.solidityKeccak256(['bytes32'], [rand])
    const bgSaturationRange = theme.bg[1].split('-')
    const bgSaturation = this.randomRange(
      bgSaturationRange[0],
      bgSaturationRange[1],
      rand
    )
    rand = utils.solidityKeccak256(['bytes32'], [rand])
    const bgLightnessRange = theme.bg[2].split('-')
    const bgLightness = this.randomRange(
      bgLightnessRange[0],
      bgLightnessRange[1],
      rand
    )

    rand = utils.solidityKeccak256(['bytes32'], [rand])
    const coreHue = this.randomRange(0, 359, rand)
    rand = utils.solidityKeccak256(['bytes32'], [rand])
    const coreSaturationRange = theme.cr[1].split('-')
    const coreSaturation = this.randomRange(
      coreSaturationRange[0],
      coreSaturationRange[1],
      rand
    )
    rand = utils.solidityKeccak256(['bytes32'], [rand])
    const coreLightnessRange = theme.cr[2].split('-')
    const coreLightness = this.randomRange(
      coreLightnessRange[0],
      coreLightnessRange[1],
      rand
    )

    rand = utils.solidityKeccak256(['bytes32'], [rand])
    const fgHue = this.randomRange(0, 359, rand)
    rand = utils.solidityKeccak256(['bytes32'], [rand])
    const fgSaturationRange = theme.fg[1].split('-')
    const fgSaturation = this.randomRange(
      fgSaturationRange[0],
      fgSaturationRange[1],
      rand
    )
    rand = utils.solidityKeccak256(['bytes32'], [rand])
    const fgLightnessRange = theme.fg[2].split('-')
    const fgLightness = this.randomRange(
      fgLightnessRange[0],
      fgLightnessRange[1],
      rand
    )

    const info = {
      fIndex,
      bgIndex,
      fgIndex,
      coreIndex,
      bg: `hsl(${bgHue},${bgSaturation}%,${bgLightness}%`,
      core: `hsl(${coreHue},${coreSaturation}%,${coreLightness}%`,
      fg: `hsl(${fgHue},${fgSaturation}%,${fgLightness}%`,
      baddie: [baddieHue, baddieSaturation, baddieLightness]
    }
    return info
  }

  setPixelDensity(density) {
    this.p.pixelDensity(density)
  }

  prepareP5() {
    this.p.frameRate(this.P5_FPS)
    this.p.createCanvas(this.windowWidth, this.windowWidth)
    this.setPixelDensity(this.pixelDensity)
    this.p.background('white')
    
    // cache canvas rect, update on changes
    this.canvasRect = this.p.canvas.getBoundingClientRect()
    this.resizeObserver = new ResizeObserver(() => { 
      this.canvasRect = this.p.canvas.getBoundingClientRect()
    })
    this.resizeObserver.observe(this.p.canvas);
  }

  missileClick(x, y) {
    if (this.gameOver) return
    if (this.paused) return
    if (
      this.bodies.reduce((a, c) => a + c.radius, 0) == 0 ||
      this.frames - this.startingFrame >= this.timer
    ) {
      return
    }
    // if (this.missiles.length > 0 && !this.admin) {
    //   // this is a hack to prevent multiple missiles from being fired
    //   this.missiles = []
    //   // remove latest missile from missileInits
    //   this.missileInits.pop()
    // }

    if (this.missiles.length > 0) {
      if (this.lastMissileCantBeUndone) {
        this.emit('remove-last-missile')
        this.lastMissileCantBeUndone = false
        console.log('LASTMISSILECANTBEUNDONE = FALSE')
      }
      this.missileInits.pop()
      this.missileCount--
    }

    this.missileCount++
    const radius = 10

    const b = {
      step: this.frames,
      position: this.p.createVector(0, this.windowWidth),
      velocity: this.p.createVector(x, y - this.windowWidth),
      radius
    }
    // b.velocity.setMag(this.speedLimit * this.speedFactor)
    b.velocity.limit(this.missileSpeed * this.speedFactor)
    // const bodyCount = this.bodies.filter((b) => b.radius !== 0).length - 1
    // this.missiles = this.missiles.slice(0, bodyCount)
    // this.missiles = this.missiles.slice(-bodyCount)

    // NOTE: this is stupid
    this.missiles.push(b)
    this.missiles = this.missiles.slice(-1)

    const missileVectorMagnitude = x ** 2 + (y - this.windowWidth) ** 2
    this.sound?.playMissile(missileVectorMagnitude)
    this.missileInits.push(...this.processMissileInits([b]))
    this.makeMissileStart()
  }

  calculateStats = () => {
    const bodiesIncluded = this.bodies.length
    const { startingFrame, frames } = this
    const framesTook = frames - startingFrame - 1 // -1 because the first frame is the starting frame
    const timeTook = framesTook / this.FPS

    const missilesShot = this.missileInits.reduce(
      (p, c) => (c[0] == 0 ? p : p + 1),
      0
    )

    return {
      missilesShot,
      bodiesIncluded,
      timeTook,
      framesTook
    }
  }

  handleSave = () => {
    // mock for testing visuals

    if (this.saveStatus == 'unsaved') {
      this.saveStatus = 'validating'
      setTimeout(() => {
        this.saveStatus = 'validated'
      }, 2000)
    } else if (this.saveStatus == 'validated') {
      this.saveStatus = 'saving'
      setTimeout(() => {
        this.saveStatus = 'saved'
      }, 2000)
    }
  }
}

if (typeof window !== 'undefined') {
  window.Anybody = Anybody
}

BigInt.prototype.toJSON = function () {
  return this.toString()
}
