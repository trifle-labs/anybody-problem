import EventEmitter from './events'
import Sound from './sound.js'
import { Visuals } from './visuals.js'
import { Calculations, _copy } from './calculations.js'
import { utils } from 'ethers'
import { bodyThemes } from './colors.js'
import { loadFonts } from './fonts.js'
import { Buttons } from './buttons.js'
import { Intro } from './intro.js'
import PAUSE_BODY_DATA from './pauseBodies'
import { genwit } from '../scripts/genwit.js'
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
    Object.assign(this, Intro)

    this.setOptions(options)

    // Add other constructor logic here
    this.p = p
    !this.util && loadFonts(this.p)
    // this.p.blendMode(this.p.DIFFERENCE)

    this.introStage = -1
    this.clearValues()
    !this.util && this.prepareP5()
    this.sound = new Sound(this)
    this.init()
    !this.util && this.start()
    this.checkIfDone()
    this.saveData = {}
  }

  checkIfDone() {
    if (this.level == 5 && this.levelSpeeds.length == 5 && !this.opensea) {
      this.bodies?.map((b, i) => {
        return (b.radius = i == 0 ? b.radius : 0)
      })
      this.skipAhead = true
      this.paused = false
      this.gameOver = true
      this.won = true
      this.hasStarted = true
      this.handledGameOver = true
    }
  }

  proverTickIndex(i) {
    return proverTickIndex[i]
  }

  setOptions(options = {}) {
    const defaultOptions = {
      day: currentDay(),
      level: 0,
      skip0: false,
      todaysRecords: {},
      levelSpeeds: [],
      bodyData: null,
      // debug: false,
      // Add default properties and their initial values here
      startingBodies: 1,
      opensea: false,
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
      mute: false,
      freeze: false,
      test: false,
      util: false,
      paused: true,
      globalStyle: 'default', // 'default', 'psycho'
      aimHelper: false,
      target: 'inside', // 'outside' or 'inside'
      faceRotation: 'mania', // 'time' or 'hitcycle' or 'mania'
      sfx: 'space', // 'space' or 'bubble'
      address: undefined,
      playerName: undefined,
      bestTimes: null,
      popup: null
    }
    // Merge the default options with the provided options
    const mergedOptions = { ...defaultOptions, ...options }
    // Assign the merged options to the instance properties
    Object.assign(this, mergedOptions)
    if (this.day % SECONDS_IN_A_DAY !== 0) {
      console.error(
        `Anybody using an invalid "day" (${this.day}) which wont be possible to submit to the contract`
      )
    }
  }
  setPlayer({ name = undefined, address = undefined } = {}) {
    this.playerName = name
    this.address = address
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
    if (this.level <= 1) this.levelSpeeds = []
    if (this.skip0 && this.level == 0) {
      this.level = 1
    }
    this.totalIntroStages = 3
    this.bridgeMissile = false
    this.speedFactor = 2
    this.speedLimit = 10
    this.framesTook = 0
    this.missileSpeed = 15
    this.shownStatScreen = false
    this.G = NORMAL_GRAVITY
    this.vectorLimit = this.speedLimit * this.speedFactor
    this.missileVectorLimit = this.missileSpeed * this.speedFactor
    this.missileVectorLimitSum = 42426 // 30_000√2
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
    this.missile = null
    this.stillVisibleMissiles = []
    this.missileInits = []
    this.bodies = []
    this.witheringBodies = []
    this.bodyInits = []
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
    this.date = new Date(this.day * 1000).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
    this.framesTook = false
    this.showProblemRankingsScreenAt = -1
    this.saveStatus = 'unsaved' // 'unsaved' -> 'validating' -> 'validated' -> 'saving' -> 'saved' | 'error'
    this.shareCanvasBlob = undefined
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

    // try to fetch muted state from session storage
    if (!this.opensea && !this.util) {
      try {
        this.mute = JSON.parse(sessionStorage.getItem('muted')) || false
      } catch (_) {
        this.mute = false
        sessionStorage.removeItem('muted')
      }
    }
    this.sound?.setMuted(this.mute)
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
    this.sound?.stop()
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
      } else {
        const results = this.step(this.bodies, this.missile)
        this.frames++
        this.bodies = results.bodies
        this.missile = results.missile
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
    this.p.keyPressed = this.handleKeyPressed
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

    const duringIntro = this.introStage < this.totalIntroStages - 1
    if (duringIntro && !this.paused && this.level < 1) {
      this.introStage++
      return
    }

    this.missileClick(x, y)
  }

  handleNFTClick = () => {
    this.setPause()
  }

  handleKeyPressed = (e) => {
    if (this.gameOver && this.won) {
      this.skipAhead = true
    }
    const modifierKeyActive = e.shiftKey || e.altKey || e.ctrlKey || e.metaKey
    if (modifierKeyActive) return
    switch (e.code) {
      case 'Space':
        if (this.mouseX || this.mouseY) {
          e.preventDefault()
          this.missileClick(this.mouseX, this.mouseY)
        }
        if (this.shownStatScreen && this.level < 5) {
          this.level++
          this.restart(null, false)
        }
        break
      case 'KeyR':
        if (this.level < 1) return
        this.hasUsedRedoShortcut = true
        if (this.loseScreenTipIndex) {
          this.loseScreenTipIndex++
        }
        this.restart(null, false)
        break
      case 'KeyP':
        if (!this.gameOver) this.setPause()
        break
      case 'KeyM':
        this.mute = !this.mute
        this.sound?.setMuted(this.mute)
        break
    }
  }

  handleGameOver = ({ won }) => {
    if (this.handledGameOver) return
    this.handledGameOver = true
    this.gameoverTickerX = 0
    if (this.level !== 0) {
      this.sound?.playGameOver({ won }) // TDDO: improve audio
    }
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

    const stats = this.calculateStats()
    this.framesTook = stats.framesTook
    if (won) {
      this.finish()
    }
  }

  restart = (options, beginPaused = true) => {
    const lastLevel = this.level - 1
    if (this.levelSpeeds.length >= lastLevel && this.level > 1) {
      this.emitLevel(lastLevel)
    }

    const levelIndex = this.level - 1
    this.levelSpeeds[levelIndex] = []

    if (options) {
      this.setOptions(options)
    }
    this.clearValues()
    if (this.level !== this.lastLevel && this.level !== 1 && this.level !== 0) {
      this.sound?.stop()
      this.sound?.playStart()
      this.sound?.advanceToNextLevelSong()
      this.sound?.resume()
    }
    if (this.sound?.playbackRate !== 'normal') {
      this.sound?.playCurrentSong()
    }
    this.init()
    this.draw()
    if (beginPaused) {
      this.setPause(true)
    }
    this.addCSS()
  }

  async emitLevel(level) {
    console.log('emitLevel', { level })

    // check first
    const levelIndex = level - 1
    let lastChunk = null
    for (let i = 0; i < this.levelSpeeds[levelIndex].length; i++) {
      const levelData = this.levelSpeeds[levelIndex][i]
      const { uid, sampleInput, sampleOutput } = levelData
      try {
        compareData(
          uid,
          level,
          null,
          sampleInput,
          sampleOutput,
          lastChunk?.sampleOutput
        )
      } catch (error) {
        console.error({ uid, levelData, levelIndex, i })
        console.error(error)
      }
      lastChunk =
        this.levelSpeeds[levelIndex][i][
          this.levelSpeeds[levelIndex][i].length - 1
        ]
      if (process.env.force_circuit_check == 'true' && level > 0) {
        if (sampleInput.address == 0 || !sampleInput.address) {
          sampleInput.address =
            '0x1000000000000000000000000000000000000000000001'
        }

        const witnessResults = await genwit(sampleInput)
        const bodies = level + 1 <= 4 ? 4 : 6
        const totalSignals =
          1 + // idk why but circom puts an empoty signal here
          5 +
          bodies * 5 +
          1 + // timeTook
          1 + // address
          bodies * 5 +
          5
        // console.log({ witnessResults })
        console.log({ witnessResults })
        const signals = witnessResults.slice(0, totalSignals)
        console.log({ signals })
        try {
          compareData(uid, level, signals, sampleInput, sampleOutput)
        } catch (error) {
          console.error({ uid, levelData, levelIndex, i })
          console.error(error)
        }
      }
    }

    if (this.levelSpeeds.length < level - 1)
      throw new Error('cant submit unplayed level')
    const levelData = this.levelSpeeds[levelIndex]
    this.emit('chunk', levelData)
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
      // preview other bodies
      // this.pauseBodies[0].c = this.getBodyColor(this.day + 13, 0)
      this.paused = newPauseState
      this.willUnpause = false
      delete this.beganUnpauseAt
    } else {
      this.justPaused = true
      this.willUnpause = true
    }

    this.emit('paused', newPauseState)
    if (newPauseState) {
      if (!mute) {
        this.sound?.pause()
      }
    } else {
      if (!mute) {
        this.sound?.resume()
      }
    }

    if (!newPauseState && this.introStage < 0) {
      this.introStage = 0
    }
  }

  step(bodies = this.bodies, missile = this.missile) {
    // this.steps ||= 0
    // console.log({ steps: this.steps })
    // this.steps++
    // console.dir(
    //   { bodies: this.bodies, missile: this.missile },
    //   { depth: null }
    // )
    if (this.gameOver && missile) {
      missile = null
    }
    if (!missile && this.bridgeMissile) {
      // NOTE: this maybe should be after the step logic
      console.log('BRIDGEMISSILE = FALSE')
      this.bridgeMissile = false
    }
    bodies = this.forceAccumulator(bodies)
    var results = this.detectCollision(bodies, missile)
    bodies = results.bodies
    missile = results.missile
    if (missile) {
      const missileCopy = _copy(missile)
      this.stillVisibleMissiles.push(missileCopy)
    }
    if (missile && missile.radius == 0) {
      missile = null
    }
    return { bodies, missile }
  }

  started() {
    this.emit('started', {
      day: this.day,
      level: this.level,
      bodyInits: _copy(this.bodyInits)
    })
  }

  processMissileInit(b_) {
    const b = _copy(b_)
    const radius = 10
    const processedMissileInit = {
      step: b.step,
      x: this.convertFloatToScaledBigInt(b.position.x).toString(),
      y: this.convertFloatToScaledBigInt(b.position.y).toString(),
      vx: this.convertFloatToScaledBigInt(b.velocity.x).toString(),
      vy: this.convertFloatToScaledBigInt(b.velocity.y).toString(),
      radius: radius.toString()
    }
    return processedMissileInit
  }

  finish() {
    const { day, level, framesTook } = this
    if (level == 0 && !this.util) return
    if (this.finalBatchSent) return

    const maxY = (this.windowWidth * parseInt(this.scalingFactor)).toString()
    const m = _copy(this.missile)
    const sampleOutput = {
      bodyFinal: this.calculateBodyFinal(this.bodies),
      time: framesTook,
      outflightMissile: m
        ? [m.px, m.py, m.vx, -m.vy, m.radius]
        : ['0', maxY, '0', '0', '0']
    }
    const sampleInput = {
      bodies: _copy(this.bodyInits),
      // add one more because missileInits contains one extra for circuit
      missiles: new Array(this.stopEvery + 1).fill(['0', '0', '0']),
      inflightMissile: ['0', maxY, '0', '0', '0'],
      address: this.address
    }
    for (const missileInit of this.missileInits) {
      const index = (missileInit.step - this.startingFrame) % this.stopEvery
      sampleInput.missiles[index] = [
        missileInit.vx,
        -missileInit.vy,
        missileInit.radius
      ]
    }

    // inflightMissile is empty unless the first frame contains a missile
    if (sampleInput.missiles[0][2] !== '0') {
      const m = this.missileInits[0]
      if (m.step !== this.alreadyRun)
        throw new Error('first frame missile error')
      sampleInput.inflightMissile = [m.x, m.y, m.vx, -m.vy, m.radius]
    }
    const uid = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER)
    const results = {
      uid,
      sampleInput,
      sampleOutput,
      day,
      level
    }

    if (level !== 0) {
      if (this.levelSpeeds.length < level) {
        this.levelSpeeds.push([results])
      } else {
        this.levelSpeeds[level - 1].push(results)
      }
    }

    if (
      this.bodies
        .slice(this.level == 0 ? 0 : 1)
        .reduce((a, c) => a + c.radius, 0) == 0
    ) {
      console.log('level completed')
      this.finalBatchSent = true
      return results
    }

    // prepare for next level
    this.bodyInits = _copy(sampleOutput.bodyFinal)
    this.alreadyRun = this.frames
    this.missileInits = []

    // this.missileInits is initialized with the currently in flight missile
    if (this.missile) {
      console.log('finish, convert missile to missileInit')
      const missileInit = this.processMissileInit(this.missile)
      missileInit.step = this.frames
      this.missileInits.push(missileInit)

      console.log('BRIDGEMISSILE = TRUE')
      this.bridgeMissile = true
    }
    return results
  }

  removeBridgeMissile() {
    const lastChunk =
      this.levelSpeeds[this.level - 1][
        this.levelSpeeds[this.level - 1].length - 1
      ]
    const outflightMissile = lastChunk.sampleOutput.outflightMissile
    if (outflightMissile[4] == 0) {
      console.error({ outflightMissile })
      throw new Error('removeBridgeMissile called, no outgoing missile')
    }
    if (outflightMissile[2] !== this.missile.vx) {
      console.error({ outflightMissile, missile: this.missile })
      throw new Error(
        'removeBridgeMissile called, outgoing missile velocity x mismatch'
      )
    }
    if (-outflightMissile[3] !== this.missile.vy) {
      console.error({ outflightMissile, missile: this.missile })
      throw new Error(
        'removeBridgeMissile called, outgoing missile velocity y mismatch'
      )
    }
    lastChunk.sampleOutput.outflightMissile = ['0', '1000000', '0', '0', '0']
    if (
      this.levelSpeeds[this.level - 1][
        this.levelSpeeds[this.level - 1].length - 1
      ].sampleOutput.outflightMissile.join() !==
      lastChunk.sampleOutput.outflightMissile.join()
    ) {
      throw new Error('referenced array not updated, modify code')
    }

    const lastMissileIndex = lastChunk.sampleInput.missiles.reduceRight(
      (acc, curr, i) => {
        if (acc < 0 && curr[2] != '0') return i
        return acc
      },
      -1
    )
    const lastMissile = lastChunk.sampleInput.missiles[lastMissileIndex]
    if (BigInt(lastMissile[0]) !== this.missile.vx) {
      console.error({ lastMissile, missile: this.missile })
      throw new Error(
        'removeBridgeMissile called, last missile velocity x mismatch'
      )
    }
    if (BigInt(-lastMissile[1]) !== this.missile.vy) {
      console.error({ lastMissile, missile: _copy(this.missile) })
      throw new Error(
        'removeBridgeMissile called, last missile velocity y mismatch'
      )
    }

    lastChunk.sampleInput.missiles[lastMissileIndex] = ['0', '0', '0']
  }

  generateLevelData(day, level) {
    if (!day) throw new Error('day is undefined')
    if (typeof level == 'undefined') throw new Error('level is undefined')
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
    body.radius = this.genRadius(index)

    if (level == 0) {
      body.radius = parseInt(56n * this.scalingFactor)
      body.px = parseInt((BigInt(this.windowWidth) * this.scalingFactor) / 2n)
      body.py = parseInt((BigInt(this.windowWidth) * this.scalingFactor) / 2n)
      body.vx = parseInt(maxVectorScaled)
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

  genRadius(index) {
    const radii = [36n, 27n, 24n, 21n, 18n, 15n] // n * 4 + 2
    let size = radii[index % radii.length]
    return parseInt(size * BigInt(this.scalingFactor))
  }

  randomRange(minBigInt, maxBigInt, seed, day = this.day) {
    const fuckup = day == 1723766400 ? 0n : 1n
    if (minBigInt == maxBigInt) return minBigInt
    minBigInt = typeof minBigInt === 'bigint' ? minBigInt : BigInt(minBigInt)
    maxBigInt = typeof maxBigInt === 'bigint' ? maxBigInt : BigInt(maxBigInt)
    seed = typeof seed === 'bigint' ? seed : BigInt(seed)
    if (minBigInt > maxBigInt) {
      const range = 359n - (minBigInt - maxBigInt + fuckup)
      const output = seed % range
      if (output < maxBigInt) {
        return parseInt(output)
      } else {
        return parseInt(minBigInt - maxBigInt + output)
      }
    } else {
      return parseInt((seed % (maxBigInt - minBigInt + fuckup)) + minBigInt)
    }
  }

  generateBodies() {
    const bodyData =
      this.bodyData || this.generateLevelData(this.day, this.level)
    this.bodies = bodyData.map((b) => this.bodyDataToBodies.call(this, b))
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
    // let baddieSeed = utils.solidityKeccak256(
    //   ['uint256', 'uint256'],
    //   [day, bodyIndex]
    // )
    // const baddieHue = this.randomRange(0, 359, baddieSeed)
    // baddieSeed = utils.solidityKeccak256(['bytes32'], [baddieSeed])
    // const baddieSaturation = this.randomRange(90, 100, baddieSeed)
    // baddieSeed = utils.solidityKeccak256(['bytes32'], [baddieSeed])
    // const baddieLightness = this.randomRange(55, 60, baddieSeed)

    // hero body info
    const themes = Object.keys(bodyThemes)
    const numberOfThemes = themes.length
    const extraSeed = day == 1723766400 ? 19 : 0
    // 8, 11, 14, 19
    // good ones: 2, 8, 10, 11, 13
    let rand = utils.solidityKeccak256(['uint256', 'uint256'], [day, extraSeed])
    // let rand = utils.solidityKeccak256(['uint256'], [day])
    const faceOptions = 14
    const bgOptions = 10
    const fgOptions = 10
    const coreOptions = 1
    const fIndex = this.randomRange(0, faceOptions - 1, rand, day)
    rand = utils.solidityKeccak256(['bytes32'], [rand])
    const bgIndex = this.randomRange(0, bgOptions - 1, rand, day)
    rand = utils.solidityKeccak256(['bytes32'], [rand])
    const fgIndex = this.randomRange(0, fgOptions - 1, rand, day)
    rand = utils.solidityKeccak256(['bytes32'], [rand])
    const coreIndex = this.randomRange(0, coreOptions - 1, rand, day)

    rand = utils.solidityKeccak256(['bytes32'], [rand])
    const dailyThemeIndex = this.randomRange(0, numberOfThemes - 1, rand, day)

    const themeName = themes[dailyThemeIndex]
    const theme = bodyThemes[themeName]

    rand = utils.solidityKeccak256(['bytes32'], [rand])
    const bgHueRange = theme.bg[0] ? theme.bg[0].split('-') : [0, 359]
    const bgHue = this.randomRange(bgHueRange[0], bgHueRange[1], rand, day)
    rand = utils.solidityKeccak256(['bytes32'], [rand])
    const bgSaturationRange = theme.bg[1].split('-')
    const bgSaturation = this.randomRange(
      bgSaturationRange[0],
      bgSaturationRange[1],
      rand,
      day
    )
    rand = utils.solidityKeccak256(['bytes32'], [rand])
    const bgLightnessRange = theme.bg[2].split('-')
    const bgLightness = this.randomRange(
      bgLightnessRange[0],
      bgLightnessRange[1],
      rand,
      day
    )

    rand = utils.solidityKeccak256(['bytes32'], [rand])
    const coreHueRange = theme.bg[0] ? theme.cr[0].split('-') : [0, 359]
    const coreHue = this.randomRange(
      coreHueRange[0],
      coreHueRange[1],
      rand,
      day
    )
    rand = utils.solidityKeccak256(['bytes32'], [rand])
    const coreSaturationRange = theme.cr[1].split('-')
    const coreSaturation = this.randomRange(
      coreSaturationRange[0],
      coreSaturationRange[1],
      rand,
      day
    )
    rand = utils.solidityKeccak256(['bytes32'], [rand])
    const coreLightnessRange = theme.cr[2].split('-')
    const coreLightness = this.randomRange(
      coreLightnessRange[0],
      coreLightnessRange[1],
      rand,
      day
    )

    rand = utils.solidityKeccak256(['bytes32'], [rand])
    const fgHueRange = theme.bg[0] ? theme.fg[0].split('-') : [0, 359]
    const fgHue = this.randomRange(fgHueRange[0], fgHueRange[1], rand, day)
    rand = utils.solidityKeccak256(['bytes32'], [rand])
    const fgSaturationRange = theme.fg[1].split('-')
    const fgSaturation = this.randomRange(
      fgSaturationRange[0],
      fgSaturationRange[1],
      rand,
      day
    )
    rand = utils.solidityKeccak256(['bytes32'], [rand])
    const fgLightnessRange = theme.fg[2].split('-')
    const fgLightness = this.randomRange(
      fgLightnessRange[0],
      fgLightnessRange[1],
      rand,
      day
    )

    const baddieColors = [
      [342, 100, 48], // intro baddie?
      [342, 100, 48],
      [260, 94, 62],
      [151, 100, 63],
      [11, 100, 62],
      [58, 100, 54]
    ]
    const info = {
      fIndex,
      bgIndex,
      fgIndex,
      coreIndex,
      bg: `hsl(${bgHue},${bgSaturation}%,${bgLightness}%`,
      core: `hsl(${coreHue},${coreSaturation}%,${coreLightness}%`,
      fg: `hsl(${fgHue},${fgSaturation}%,${fgLightness}%`,
      baddie: baddieColors[bodyIndex]
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
    this.resizeObserver.observe(this.p.canvas)
  }
  missileClick(x, y) {
    this.missileEvent = { x, y }
  }
  processMissileClick(x, y) {
    if (this.gameOver || this.paused || this.missilesDisabled) return
    if (
      this.bodies.reduce((a, c) => a + c.radius, 0) == 0 ||
      this.frames - this.startingFrame >= this.timer
    ) {
      return
    }
    console.log('processMissileClick', { x, y })

    if (this.frames % this.stopEvery == 0) {
      console.log({ frames: this.frames, stopEvery: this.stopEvery })
      console.log('MISSILE CANT BE FIRED ON EDGE ATM')
      this.shootMissileNextFrame = { x, y }
      return
    } else {
      this.shootMissileNextFrame = null
    }

    // already a missile in flight, needs to be removed from current and previous chunk
    if (this.missile) {
      const missileCopy = this.processMissileInit(this.missile)
      const abortedMissile = this.missileInits.pop()
      if (abortedMissile.vx !== missileCopy.vx) {
        console.error({ abortedMissile, missileCopy })
        throw new Error('aborted missile velocity mismatch')
      }
      if (abortedMissile.vy !== missileCopy.vy) {
        console.error({ abortedMissile, missileCopy })
        throw new Error('aborted missile velocity mismatch')
      }
      if (this.bridgeMissile) {
        this.removeBridgeMissile()
        this.bridgeMissile = false
        console.log('BRIDGEMISSILE = FALSE')
        if (this.missileInits.length !== 0) {
          throw new Error('missileInits should be empty')
        }
      }
    } else if (this.bridgeMissile) {
      console.error('bridgeMissile should have been modified in step() alredy')
      this.bridgeMissile = false
    }

    const radius = 10
    const b = {
      step: this.frames,
      position: this.p.createVector(0, this.windowWidth),
      velocity: this.p.createVector(x, y - this.windowWidth),
      radius
    }
    // b.velocity.setMag(this.missileSpeed * this.speedFactor)
    b.velocity.limit(this.missileSpeed * this.speedFactor)
    if (b.velocity.x <= 0) {
      b.velocity.x = 1
    }
    if (b.velocity.y >= 0) {
      b.velocity.y = -1
    }
    let sum = b.velocity.x - b.velocity.y
    const max = this.missileVectorLimitSum / 1000
    if (sum > max) {
      b.velocity.limit(this.missileSpeed * this.speedFactor * 0.999)
      sum = b.velocity.x - b.velocity.y
      if (sum > max) {
        console.error({
          x: b.velocity.x,
          y: b.velocity.y,
          max: this.missileVectorLimitSum / 1000
        })
        console.error('still too fast')
        return
      }
    }
    this.missile = b

    const missileVectorMagnitude = x ** 2 + (y - this.windowWidth) ** 2
    this.sound?.playMissile(missileVectorMagnitude)
    this.missileInits.push(this.processMissileInit(b))
    this.drawMissileStart()
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

// BigInt.prototype.toJSON = function () {
//   return this.toString() + 'n'
// }
export const compareData = (
  uid,
  level,
  signals,
  sampleInput,
  sampleOutput,
  prevSampleOutput
) => {
  console.log('compareData func', {
    uid,
    level,
    signals,
    sampleInput,
    sampleOutput,
    prevSampleOutput
  })
  // confirm this chunk has inputs that match the previous chunk's outputs
  if (prevSampleOutput) {
    // emsure inflight missile == outflight missile
    const outflightMissile = prevSampleOutput.outflightMissile?.map((v) =>
      parseInt(v)
    )
    const inflightMissile = sampleInput.inflightMissile?.map((v) => parseInt(v))
    if (!outflightMissile || !inflightMissile) {
      console.error({ sampleInput, prevSampleOutput })
      throw new Error('inflight or outflight not set')
    }
    for (let i = 0; i < 5; i++) {
      if (outflightMissile[i] !== inflightMissile[i]) {
        console.error({
          i,
          sampleInput,
          prevSampleOutput,
          outflightMissile,
          inflightMissile
        })
        throw new Error('Missile mismatch on index ' + i)
      }
    }
    // ensure bodyFinal == bodies
    for (let i = 0; i < prevSampleOutput.bodyFinal.length; i++) {
      const lastBody = prevSampleOutput.bodyFinal[i]
      const currentBody = sampleInput.bodies[i]
      if (lastBody.length !== currentBody.length || lastBody.length == 0) {
        console.error({ prevSampleOutput, sampleInput })
        console.error({ lastBody, currentBody })
        throw new Error('body count doesnt match')
      }
      for (let j = 0; j < 4; j++) {
        if (lastBody[j] !== currentBody[j]) {
          console.error({ prevSampleOutput, sampleInput })
          console.error({ lastBody, currentBody })
          throw new Error(`Body mismatch at index i:${i} j:${j}`)
        }
      }
    }
  }

  if (signals) {
    signals = signals.map((v) => BigInt(v))
    const bodies = level + 1 <= 4 ? 4 : 6
    const frameLength = proverTickIndex[level + 1]

    for (let i = 0; i < signals.length; i++) {
      const signal = signals[i]
      const isLevelCleared =
        sampleOutput.bodyFinal.slice(1).reduce((pv, cv) => {
          return pv + parseInt(cv[4])
        }, 0) == 0
      const isLevelLost = sampleOutput.bodyFinal[0][4] == '0'
      if (isLevelLost) {
        throw new Error('why is compareData being run on a lost game?')
      }

      const isFinalChunk = isLevelCleared || isLevelLost
      if (i < 1) {
        // dont know what this signal is
      } else if (i < 1 + 5) {
        const offset = 1
        // outflight missile
        if (signal !== BigInt(sampleOutput.outflightMissile[i - offset])) {
          console.error({
            uid,
            i,
            offset,
            signal,
            outflightMissile: sampleOutput.outflightMissile[i - offset]
          })
          throw new Error(
            'outflightMissile mismatch at index i:' + i + ' uid:' + uid
          )
        }
      } else if (i < 1 + 5 + bodies * 5) {
        // body outputs don't matter in final chunk
        if (isFinalChunk) continue
        const offset = 1 + 5
        const bodyIndex = Math.floor((i - offset) / 5)
        const attrIndex = (i - offset) % 5
        // bodyIndex may be more because bodyFinal isn't padded to 4 or 6
        if (bodyIndex > sampleOutput.bodyFinal.length - 1) continue
        if (BigInt(sampleOutput.bodyFinal[bodyIndex][attrIndex]) !== signal) {
          console.error({
            i,
            bodyIndex,
            attrIndex,
            uid,
            signal,
            body: sampleOutput.bodyFinal[bodyIndex][attrIndex]
          })
          throw new Error('bodyFinal mismatch i:' + i + ' uid:' + uid)
        }
      } else if (i < 1 + 5 + bodies * 5 + 1) {
        const time =
          (sampleOutput.time && sampleOutput.time % frameLength) || frameLength
        if (BigInt(time) !== signal) {
          console.error({ uid, time, signal })
          throw new Error('time mismatch i:' + i + ' uid:' + uid)
        }
      } else if (i < 1 + 5 + bodies * 5 + 1 + 1) {
        if (BigInt(sampleInput.address) !== signal) {
          console.error({
            uid,
            address: sampleInput.address,
            signal
          })
          throw new Error('address mismatch i:' + i + ' uid:' + uid)
        }
      } else if (i < 1 + 5 + bodies * 5 + 1 + 1 + bodies * 5) {
        const offset = 5 + bodies * 5 + 1 + 1 + 1
        const bodyIndex = Math.floor((i - offset) / 5)
        if (bodyIndex > sampleInput.bodies.length - 1) {
          continue
        }
        const attrIndex = (i - offset) % 5
        if (BigInt(sampleInput.bodies[bodyIndex][attrIndex]) !== signal) {
          console.error({
            uid,
            bodyIndex,
            attrIndex,
            signal,
            body: sampleInput.bodies[bodyIndex][attrIndex]
          })
          throw new Error('bodies mismatch i:' + i + ' uid:' + uid)
        }
      } else if (i < signals.length) {
        const offset = 5 + bodies * 5 + 1 + 1 + 1 + bodies * 5
        const missileIndex = i - offset
        if (BigInt(sampleInput.inflightMissile[missileIndex]) !== signal) {
          console.error({ signal, missileIndex, offset })
          throw new Error('inflightMissile mismatch i:' + i + ' uid:' + uid)
        }
      } else {
        console.error({ uid, i, signal })
        throw new Error('shouldnt be here i:' + i + ' uid:' + uid)
      }
    }
  }
}
