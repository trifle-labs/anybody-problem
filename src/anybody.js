import EventEmitter from './events'
import Sound from './sound.js'
import { Visuals } from './visuals.js'
import { Calculations } from './calculations.js'
import { utils } from 'ethers'
import { bodyThemes } from './colors.js'
import { loadFonts } from './fonts.js'
import { Buttons } from './buttons.js'
import { Intro } from './intro.js'
import PAUSE_BODY_DATA from './pauseBodies'

const GAME_LENGTH_BY_LEVEL_INDEX = [30, 60]
const NORMAL_GRAVITY = 50
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
      MAX_BODIES: 8,
      gameMode: 'score',
      // debug: false,
      // Add default properties and their initial values here
      startingBodies: 1,
      opensea: false,
      gameWidth: 800,
      gameHeight: 1200,
      windowWidth: 800,
      windowHeight: 1200,
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
    // CSS is now handled in HTML
  }

  // run whenever the class should be reset
  clearValues() {
    if (this.level <= 1) this.levelSpeeds = []
    if (this.skip0 && this.level == 0) {
      this.level = 1
    }
    this.totalIntroStages = 3
    this.lastMissileCantBeUndone = false
    this.speedFactor = 2
    this.speedLimit = 10
    this.missileSpeed = 22
    this.shownStatScreen = false
    this.G = NORMAL_GRAVITY
    this.vectorLimit = this.speedLimit * this.speedFactor
    this.missileVectorLimit = this.missileSpeed * this.speedFactor
    this.missileVectorLimitSum = Math.floor(
      this.missileSpeed * this.speedFactor * 1000 * Math.sqrt(2)
    )
    console.log({ missileVectorLimitSum: this.missileVectorLimitSum })
    // this.missileVectorLimitSum = 42426 // 30_000√2
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

    // Auto fire properties
    this.rapidFireRate = 20 // frames between shots (rapid manual firing rate)
    this.autoFireRate = this.FPS * 2 // frames between auto shots (once per 2 seconds)
    this.lastRapidFireFrame = 0
    this.lastAutoFireFrame = 0
    this.maxMissilesInFlight = 8 // limit concurrent missiles for performance

    // Mouse/touch state for hold-to-fire
    this.isMousePressed = false
    this.isTouchPressed = false

    // Aim control
    this.aimAngle = 0 // -1 to 1, where 0 is straight up
    this.targetPosition = null // Store where user clicked/touched

    this.pressStartTime = 0
    this.isDragging = false

    // Game area positioning (centered in full screen)
    this.gameOffsetX = 0 //(this.windowWidth - this.gameWidth) / 2
    this.gameOffsetY = 0 //(this.windowHeight - this.gameHeight) / 2

    // Calculate effective bottom boundary based on barrel max reach
    const barrelLength = 280
    const maxBarrelHeight = barrelLength * Math.cos(0) // When barrel is straight up (280px)
    this.effectiveGameHeight = this.gameHeight - maxBarrelHeight

    // Point system
    this.currentPoints = 1000 // Start with 1000 points
    this.missilesFired = 0 // Track missiles fired for point deduction

    // Body size meters system
    this.bodyMeters = {
      // bodyIndex: { meter: 0-100, bonusUntil: frameNumber or null, maxMeter: 100 }
      1: { meter: 0, bonusUntil: null, maxMeter: 10 },
      2: { meter: 0, bonusUntil: null, maxMeter: 10 },
      3: { meter: 0, bonusUntil: null, maxMeter: 10 },
      4: { meter: 0, bonusUntil: null, maxMeter: 10 },
      5: { meter: 0, bonusUntil: null, maxMeter: 10 }
    }
    this.bonusDuration = 10 * this.FPS // 10 seconds in frames

    // Animated balls for point visualization
    this.animatedBalls = [] // balls moving to show point changes

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
    this.hits = []
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
    this.p.touchMoved = this.handleTouchMove

    // Add window-level listeners for clicks outside canvas
    if (typeof window !== 'undefined') {
      window.addEventListener('mousedown', this.handleWindowMouseDown)
      window.addEventListener('mouseup', this.handleWindowMouseUp)
      window.addEventListener('mousemove', this.handleWindowMouseMove)
      window.addEventListener('touchstart', this.handleWindowTouchStart, {
        passive: false
      })
      window.addEventListener('touchend', this.handleWindowTouchEnd, {
        passive: false
      })
      window.addEventListener('touchmove', this.handleWindowTouchMove, {
        passive: false
      })
    }

    // Mouse press/release for hold-to-fire
    this.p.mousePressed = (e) => {
      if (!this.hasTouched) {
        this.isMousePressed = true
        this.pressStartTime = Date.now()
        this.isDragging = false

        const { gameX, gameY } = this.getXY(e)

        // Handle targeting based on click position
        if (
          gameX >= 0 &&
          gameX <= this.gameWidth &&
          gameY >= 0 &&
          gameY <= this.gameHeight
        ) {
          this.handleClickTargeting(gameX, gameY)
        }

        this.handleUIClick(e) // Handle UI interactions

        // Fire immediately on click if we have a target
        if (this.targetPosition) {
          this.missileClick(this.targetPosition.x, this.targetPosition.y)
          this.lastRapidFireFrame = this.p5Frames
        }
      }
    }
    this.p.mouseReleased = () => {
      if (!this.hasTouched) {
        this.isMousePressed = false
        this.pressStartTime = 0
        this.isDragging = false
      }
    }

    // Touch press/release for hold-to-fire
    this.p.touchStarted = (e) => {
      this.hasTouched = true
      this.isTouchPressed = true
      this.pressStartTime = Date.now()
      this.isDragging = false

      const { gameX, gameY } = this.getXY(e)

      // Handle targeting based on touch position
      if (
        gameX >= 0 &&
        gameX <= this.gameWidth &&
        gameY >= 0 &&
        gameY <= this.gameHeight
      ) {
        this.handleClickTargeting(gameX, gameY)
      }

      this.handleUIClick(e)

      // Fire immediately on touch if we have a target
      if (this.targetPosition) {
        this.missileClick(this.targetPosition.x, this.targetPosition.y)
        this.lastRapidFireFrame = this.p5Frames
      }

      // Prevent default to avoid triggering mouse events
      e.preventDefault()
      return false
    }
    this.p.touchEnded = (e) => {
      this.isTouchPressed = false
      this.pressStartTime = 0
      this.isDragging = false
      e.preventDefault()
      return false
    }

    this.p.keyPressed = this.handleKeyPressed
  }

  removeListener() {
    if (typeof window !== 'undefined') {
      window.removeEventListener('mousedown', this.handleWindowMouseDown)
      window.removeEventListener('mouseup', this.handleWindowMouseUp)
      window.removeEventListener('mousemove', this.handleWindowMouseMove)
      window.removeEventListener('touchstart', this.handleWindowTouchStart)
      window.removeEventListener('touchend', this.handleWindowTouchEnd)
      window.removeEventListener('touchmove', this.handleWindowTouchMove)
    }
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

    // Convert to game area coordinates for UI elements that are within the game area
    // For buttons in pause screen, we need to account for the translation
    return { x, y, gameX: x - this.gameOffsetX, gameY: y - this.gameOffsetY }
  }

  getWindowXY(e) {
    let x, y
    if (e.touches) {
      x = e.touches[0].pageX - this.canvasRect.left
      y = e.touches[0].pageY - this.canvasRect.top
    } else {
      x = e.pageX - this.canvasRect.left
      y = e.pageY - this.canvasRect.top
    }
    x = (x * this.windowWidth) / this.canvasRect.width
    y = (y * this.windowHeight) / this.canvasRect.height

    // Convert to game area coordinates
    return { x, y, gameX: x - this.gameOffsetX, gameY: y - this.gameOffsetY }
  }

  handleMouseMove = (e) => {
    const { x, y, gameX, gameY } = this.getXY(e)
    this.mouseX = x
    this.mouseY = y

    // Check for drag mode switch if holding down and moving
    if (this.isMousePressed && this.pressStartTime > 0) {
      const holdTime = Date.now() - this.pressStartTime
      if (holdTime > 200 && !this.isDragging) {
        // 200ms to enter drag mode
        this.isDragging = true
        console.log('Dragging detected - using proportional positioning')
      }
    }

    // Handle aiming based on current position
    if (
      gameX >= 0 &&
      gameX <= this.gameWidth &&
      gameY >= 0 &&
      gameY <= this.gameHeight
    ) {
      if (this.isDragging) {
        // When dragging, use proportional horizontal position for aiming
        this.handleProportionalAiming(x)
      } else if (this.isMousePressed) {
        // When pressing and moving (but not yet dragging), update click targeting
        this.handleClickTargeting(gameX, gameY)
      } else if (!this.isMousePressed) {
        // When just hovering (not pressing), update targeting for visual feedback
        this.handleClickTargeting(gameX, gameY)
      }
    }

    // check if mouse is inside any of the buttons
    for (const key in this.buttons) {
      const button = this.buttons[key]
      const checkX = button.gameArea ? gameX : x
      const checkY = button.gameArea ? gameY : y
      button.hover = intersectsButton(button, checkX, checkY)
    }
  }

  handleTouchMove = (e) => {
    const { x, y, gameX, gameY } = this.getXY(e)
    this.mouseX = x
    this.mouseY = y

    // Check for drag mode switch if holding down and moving
    if (this.isTouchPressed && this.pressStartTime > 0) {
      const holdTime = Date.now() - this.pressStartTime
      if (holdTime > 200 && !this.isDragging) {
        // 200ms to enter drag mode
        this.isDragging = true
        console.log('Touch dragging detected - using proportional positioning')
      }
    }

    // Handle aiming based on current position
    if (
      gameX >= 0 &&
      gameX <= this.gameWidth &&
      gameY >= 0 &&
      gameY <= this.gameHeight
    ) {
      if (this.isDragging) {
        // When dragging, use proportional horizontal position for aiming
        this.handleProportionalAiming(x)
      } else if (this.isTouchPressed) {
        // When pressing and moving (but not yet dragging), update click targeting
        this.handleClickTargeting(gameX, gameY)
      } else if (!this.isTouchPressed) {
        // When just hovering (not pressing), update targeting for visual feedback
        this.handleClickTargeting(gameX, gameY)
      }
    }

    // check if touch is inside any of the buttons
    for (const key in this.buttons) {
      const button = this.buttons[key]
      const checkX = button.gameArea ? gameX : x
      const checkY = button.gameArea ? gameY : y
      button.hover = intersectsButton(button, checkX, checkY)
    }
    // Prevent default to avoid triggering mouse events
    e.preventDefault()
    return false
  }

  handleUIClick = (e) => {
    // Handle UI interactions only (no missile firing)
    if (this.gameOver && this.won) {
      this.skipAhead = true
    }
    const { x, y, gameX, gameY } = this.getXY(e)

    // if mouse is inside of a button, call the button's handler
    for (const key in this.buttons) {
      const button = this.buttons[key]
      if (button.visible && !button.disabled) {
        // Use game coordinates for buttons within the game area (pause screen, etc.)
        // Use full screen coordinates for buttons outside game area (like slider)
        const checkX = button.gameArea ? gameX : x
        const checkY = button.gameArea ? gameY : y

        if (intersectsButton(button, checkX, checkY)) {
          button.onClick()
          return
        }
      }
    }

    const duringIntro = this.introStage < this.totalIntroStages - 1
    if (duringIntro && !this.paused && this.level < 1) {
      this.introStage++
      return
    }

    // Note: No missile firing here - that's handled automatically now
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
        if (this.shownStatScreen && this.level < 5) {
          // this.level++
          this.restart(null, false)
        }
        break
      case 'KeyR':
        if (this.level < 1) return
        this.skipRedoPopupTip = true
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
      this.finish()
    }
  }

  restart = (options, beginPaused = true) => {
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

  step(bodies = this.bodies, missiles = this.missiles) {
    if (this.gameOver && missiles.length !== 0) {
      missiles = []
    }
    // this.steps ||= 0
    // console.log({ steps: this.steps })
    // this.steps++
    // console.dir(
    //   { bodies: this.bodies, missiles: this.missiles[0] },
    //   { depth: null }
    // )
    if (missiles.length == 0 && this.lastMissileCantBeUndone) {
      // NOTE: this maybe should be after the step logic
      console.log('LASTMISSILECANTBEUNDONE = FALSE')
      this.lastMissileCantBeUndone = false
    }
    if (this.gameOver) {
      this.missiles = []
    }
    bodies = this.forceAccumulator(bodies)

    // Process missiles one at a time to maintain game logic compatibility
    const processedMissiles = []
    for (let i = 0; i < missiles.length; i++) {
      const singleMissileArray = [missiles[i]]
      const results = this.detectCollision(bodies, singleMissileArray)
      bodies = results.bodies

      if (results.missiles && results.missiles.length > 0) {
        const processedMissile = results.missiles[0]
        const missileCopy = JSON.parse(JSON.stringify(processedMissile))
        this.stillVisibleMissiles.push(missileCopy)

        // Only keep missile if it still has radius (hasn't been destroyed)
        if (processedMissile.radius > 0) {
          processedMissiles.push(processedMissile)
        }
      }
    }

    missiles = processedMissiles
    return { bodies, missiles }
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
      // const maxMissileVectorScaled = this.convertFloatToScaledBigInt(
      //   this.missileVectorLimit
      // )
      return {
        step: b.step,
        x: this.convertFloatToScaledBigInt(b.position.x).toString(),
        y: this.convertFloatToScaledBigInt(b.position.y).toString(),
        vx: this.convertFloatToScaledBigInt(b.velocity.x).toString(),
        vy: this.convertFloatToScaledBigInt(b.velocity.y).toString(),
        radius: radius.toString()
      }
    })
  }

  finish() {
    if (this.finalBatchSent) return
    // this.finished = true
    // this.setPause(true)
    // const maxMissileVectorScaled = parseInt(
    //   this.convertFloatToScaledBigInt(this.missileVectorLimit)
    // ).toString()

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
          missileInputs.push([missile.vx, -missile.vy, missile.radius])
          missileIndex++
        } else {
          missileInputs.push(['0', '0', '0'])
        }
      }
      // add one more because missileInits contains one extra for circuit
      missileInputs.push(['0', '0', '0'])
    }

    // define the inflightMissile for the proof from the first missile shot during this chunk
    // if the first missile shot was shot at step == alreadyRun (start of this chunk)
    // add it as an inflightMissile otherwise add a dummy missile
    let inflightMissile =
      this.missileInits[0]?.step == this.alreadyRun
        ? this.missileInits[0]
        : {
            x: '0',
            y: (
              this.effectiveGameHeight * parseInt(this.scalingFactor)
            ).toString(),
            vx: '0',
            vy: '0',
            radius: '0'
          }
    inflightMissile = [
      inflightMissile.x,
      inflightMissile.y,
      inflightMissile.vx,
      -inflightMissile.vy,
      inflightMissile.radius
    ]

    // defind outflightMissile for the proof from the currently flying missiles
    // if there is no missile flying, add a dummy missile
    const outflightMissileTmp = this.missiles[0] || {
      px: '0',
      py: (this.effectiveGameHeight * parseInt(this.scalingFactor)).toString(),
      vx: '0',
      vy: '0',
      radius: '0'
    }
    const outflightMissile = [
      outflightMissileTmp.px,
      outflightMissileTmp.py,
      outflightMissileTmp.vx,
      -outflightMissileTmp.vy,
      outflightMissileTmp.radius
    ]

    const { address, day, level, bodyInits, bodyFinal, framesTook } = this
    const points = this.calculatePoints()

    const results = JSON.parse(
      JSON.stringify({
        points,
        day,
        level,
        inflightMissile,
        missiles: missileInputs,
        bodyInits,
        bodyFinal,
        framesTook,
        outflightMissile,
        address
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
      if (this.levelSpeeds.length < level) {
        this.levelSpeeds.push(results)
      } else {
        this.levelSpeeds[level - 1] = results
      }
    }
    return results
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
      body.px = parseInt((BigInt(this.gameWidth) * this.scalingFactor) / 2n)
      body.py = parseInt(
        (BigInt(this.effectiveGameHeight) * this.scalingFactor) / 2n
      )
      body.vx = parseInt(maxVectorScaled)
      body.vy = parseInt(maxVectorScaled)
      return body
    }

    let rand = utils.solidityKeccak256(['bytes32'], [dayLevelIndexSeed])
    body.px = this.randomRange(
      0,
      BigInt(this.gameWidth) * this.scalingFactor,
      rand
    )

    rand = utils.solidityKeccak256(['bytes32'], [rand])
    body.py = this.randomRange(
      0,
      BigInt(this.effectiveGameHeight) * this.scalingFactor,
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
    const radii = [38n, 33n, 28n, 23n, 18n, 13n] // n * 5 + 3
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
    this.p.createCanvas(this.windowWidth, this.windowHeight)
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

    if (this.bodies.reduce((a, c) => a + c.radius, 0) == 0) {
      return
    }

    // Check if player has points to fire a missile (points = missiles available)
    if (this.currentPoints <= 0) {
      console.log('Not enough points to fire missile!')
      return
    }

    if (this.frames % this.stopEvery == 0) {
      console.log({ frames: this.frames, stopEvery: this.stopEvery })
      console.log('MISSILE CANT BE FIRED ON EDGE ATM')
      this.shootMissileNextFrame = { x, y }
      return
    } else {
      this.shootMissileNextFrame = null
    }

    // Limit the number of missiles in flight for performance
    if (this.missiles.length >= this.maxMissilesInFlight) {
      return
    }

    // Remove the single missile restriction - allow multiple missiles
    // if (this.missiles.length > 0) {
    //   if (this.lastMissileCantBeUndone) {
    //     this.emit('remove-last-missile')
    //     this.lastMissileCantBeUndone = false
    //     console.log('LASTMISSILECANTBEUNDONE = FALSE')
    //   }
    //   this.missileInits.pop()
    //   this.missileCount--
    // }

    this.missileCount++

    // Deduct 1 point for firing a missile
    this.missilesFired++
    this.currentPoints = Math.max(0, this.currentPoints - 1)
    const radius = 10

    // Get barrel tip position as starting point
    const barrelTip = this.getBarrelTipPosition()
    const b = {
      step: this.frames,
      position: this.p.createVector(barrelTip.x, barrelTip.y),
      velocity: this.p.createVector(x - barrelTip.x, y - barrelTip.y),
      radius
    }
    b.velocity.setMag(this.missileSpeed * this.speedFactor)
    // b.velocity.limit(this.missileSpeed * this.speedFactor)
    // if (b.velocity.x <= 0) {
    //   b.velocity.x = 1
    // }
    if (b.velocity.y >= 0) {
      b.velocity.y = -1
    }
    let sum = Math.abs(b.velocity.x) + Math.abs(b.velocity.y)
    const max = this.missileVectorLimitSum / 1000
    if (sum > max) {
      b.velocity.limit(this.missileSpeed * this.speedFactor * 0.999)
      console.log({
        x: b.velocity.x,
        y: b.velocity.y,
        max: this.missileVectorLimitSum / 1000
      })
      sum = b.velocity.x - b.velocity.y
      if (sum > max) {
        console.error('still too fast')
        return
      }
    }
    // Allow multiple missiles in flight
    this.missiles.push(b)

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

  // Handle body hit for meter system and points
  handleBodyHit(bodyIndex, hitPosition = null) {
    if (bodyIndex === 0) {
      // Hero body hit - subtract points (reduces available missiles)
      const pointsLost = 10
      this.currentPoints = Math.max(0, this.currentPoints - pointsLost)

      // Create animated balls leaving bottom left corner going to top left
      if (hitPosition) {
        this.createAnimatedBalls(
          pointsLost,
          { x: 20, y: this.windowHeight - 40 },
          { x: 20, y: 40 },
          'negative'
        )
      }
      return
    }

    if (!this.bodyMeters[bodyIndex]) return

    const meter = this.bodyMeters[bodyIndex]
    meter.meter = Math.min(meter.meter + 1, meter.maxMeter)

    // Calculate points for hitting this body type
    let basePoints = 0
    switch (bodyIndex) {
      case 1:
      case 2:
        basePoints = 1
        break
      case 3:
        basePoints = 2
        break
      case 4:
      case 5:
        basePoints = 10
        break
    }

    // Apply 2x bonus if body type is in bonus mode
    if (this.isBodyInBonusMode(bodyIndex)) {
      basePoints *= 2
    }

    // Add points (increases available missiles)
    this.currentPoints += basePoints

    // Create animated balls moving from hit position to bottom left corner
    if (hitPosition && basePoints > 0) {
      this.createAnimatedBalls(
        basePoints,
        hitPosition,
        { x: 20, y: this.windowHeight - 40 },
        'positive'
      )
    }

    // Check if meter is full and not already in bonus mode
    if (meter.meter >= meter.maxMeter && !meter.bonusUntil) {
      meter.bonusUntil = this.frames + this.bonusDuration
      meter.meter = 0 // Reset meter after bonus activation
      console.log(`Body type ${bodyIndex} entered bonus mode!`)
    }
  }

  // Check if a body type is in bonus mode
  isBodyInBonusMode(bodyIndex) {
    if (!this.bodyMeters[bodyIndex]) return false
    const meter = this.bodyMeters[bodyIndex]

    if (meter.bonusUntil && this.frames >= meter.bonusUntil) {
      meter.bonusUntil = null // Clear expired bonus
      console.log(`Body type ${bodyIndex} bonus mode expired`)
      return false
    }

    return meter.bonusUntil !== null
  }

  // Create animated balls for point visualization
  createAnimatedBalls(count, startPos, endPos, type) {
    const delay = 5 // frames between each ball release
    for (let i = 0; i < count; i++) {
      const ball = {
        startPos: { ...startPos },
        endPos: { ...endPos },
        currentPos: { ...startPos },
        progress: 0,
        speed: 0.05, // 5% progress per frame
        delay: i * delay, // stagger release
        type: type, // 'positive' or 'negative'
        active: false
      }
      this.animatedBalls.push(ball)
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

  handleClickTargeting(gameX, gameY) {
    const barrelBaseX = this.gameWidth / 2
    const barrelBaseY = this.gameHeight

    // Calculate the angle from barrel base to click point (anywhere on screen)
    const deltaX = gameX - barrelBaseX
    const deltaY = gameY - barrelBaseY
    const clickAngle = Math.atan2(deltaX, -deltaY)
    const maxAngle = Math.PI / 3 // 60 degrees max angle

    // Clamp angle to barrel's maximum range
    const clampedAngle = Math.max(-maxAngle, Math.min(maxAngle, clickAngle))

    // Calculate target position in the direction of the click with fixed distance
    const barrelLength = 280
    const targetDistance = barrelLength * 3 // Fixed distance for target
    const targetX = barrelBaseX + Math.sin(clampedAngle) * targetDistance
    const targetY = barrelBaseY - Math.cos(clampedAngle) * targetDistance

    this.targetPosition = { x: targetX, y: targetY }

    // Update aim angle for barrel display
    this.aimAngle = Math.max(-1, Math.min(1, clampedAngle / maxAngle))
  }

  handleProportionalAiming(screenX) {
    // Convert screen X position to aim angle for proportional aiming (drag mode)
    const screenCenterX = this.windowWidth / 2
    const maxAimDistance = this.windowWidth / 3 // How far from center to get max aim angle
    const relativeX = (screenX - screenCenterX) / maxAimDistance
    this.aimAngle = Math.max(-1, Math.min(1, relativeX))

    // Update target position based on aim angle
    const maxAngle = Math.PI / 3 // 60 degrees max angle
    const angle = this.aimAngle * maxAngle
    const barrelBaseX = this.gameWidth / 2
    const barrelBaseY = this.gameHeight
    const barrelLength = 280
    const targetDistance = barrelLength * 3 // Fixed distance for target

    this.targetPosition = {
      x: barrelBaseX + Math.sin(angle) * targetDistance,
      y: barrelBaseY - Math.cos(angle) * targetDistance
    }
  }

  // Helper method to get barrel tip position
  getBarrelTipPosition() {
    const barrelLength = 280
    const maxAngle = Math.PI / 3 // 60 degrees max angle
    const angle = this.aimAngle * maxAngle

    const tipX = this.gameWidth / 2 + Math.sin(angle) * barrelLength
    const tipY = this.gameHeight - Math.cos(angle) * barrelLength

    return { x: tipX, y: tipY }
  }

  // Window-level event handlers
  handleWindowMouseDown = (e) => {
    if (!this.hasTouched && !this.p.canvas.contains(e.target)) {
      this.isMousePressed = true
      this.pressStartTime = Date.now()
      this.isDragging = false

      const { gameX, gameY } = this.getWindowXY(e)

      // Handle targeting for clicks outside canvas
      if (
        gameX >= 0 &&
        gameX <= this.gameWidth &&
        gameY >= 0 &&
        gameY <= this.gameHeight
      ) {
        this.handleClickTargeting(gameX, gameY)

        // Fire immediately on click if we have a target
        if (this.targetPosition) {
          this.missileClick(this.targetPosition.x, this.targetPosition.y)
          this.lastRapidFireFrame = this.p5Frames
        }
      }
    }
  }

  handleWindowMouseUp = () => {
    if (!this.hasTouched) {
      this.isMousePressed = false
      this.pressStartTime = 0
      this.isDragging = false
    }
  }

  handleWindowMouseMove = (e) => {
    if (!this.hasTouched) {
      const { x, gameX, gameY } = this.getWindowXY(e)
      this.mouseX = x
      this.mouseY = gameY

      // Check for drag mode switch if holding down and moving
      if (this.isMousePressed && this.pressStartTime > 0) {
        const holdTime = Date.now() - this.pressStartTime
        if (holdTime > 200 && !this.isDragging) {
          // 200ms to enter drag mode
          this.isDragging = true
          console.log(
            'Window dragging detected - using proportional positioning'
          )
        }
      }

      // Handle aiming based on current position
      if (
        gameX >= 0 &&
        gameX <= this.gameWidth &&
        gameY >= 0 &&
        gameY <= this.gameHeight
      ) {
        if (this.isDragging) {
          // When dragging, use proportional horizontal position for aiming
          this.handleProportionalAiming(x)
        } else if (this.isMousePressed) {
          // When pressing and moving (but not yet dragging), update click targeting
          this.handleClickTargeting(gameX, gameY)
        } else if (!this.isMousePressed) {
          // When just hovering (not pressing), update targeting for visual feedback
          this.handleClickTargeting(gameX, gameY)
        }
      }
    }
  }

  handleWindowTouchStart = (e) => {
    if (!this.p.canvas.contains(e.target)) {
      this.hasTouched = true
      this.isTouchPressed = true
      this.pressStartTime = Date.now()
      this.isDragging = false

      const { gameX, gameY } = this.getWindowXY(e)

      // Handle targeting for touches outside canvas
      if (
        gameX >= 0 &&
        gameX <= this.gameWidth &&
        gameY >= 0 &&
        gameY <= this.gameHeight
      ) {
        this.handleClickTargeting(gameX, gameY)

        // Fire immediately on touch if we have a target
        if (this.targetPosition) {
          this.missileClick(this.targetPosition.x, this.targetPosition.y)
          this.lastRapidFireFrame = this.p5Frames
        }
      }

      e.preventDefault()
      return false
    }
  }

  handleWindowTouchEnd = (e) => {
    this.isTouchPressed = false
    this.pressStartTime = 0
    this.isDragging = false
    e.preventDefault()
    return false
  }

  handleWindowTouchMove = (e) => {
    const { x, gameX, gameY } = this.getWindowXY(e)
    this.mouseX = x
    this.mouseY = gameY

    // Check for drag mode switch if holding down and moving
    if (this.isTouchPressed && this.pressStartTime > 0) {
      const holdTime = Date.now() - this.pressStartTime
      if (holdTime > 200 && !this.isDragging) {
        // 200ms to enter drag mode
        this.isDragging = true
        console.log(
          'Window touch dragging detected - using proportional positioning'
        )
      }
    }

    // Handle aiming based on current position
    if (
      gameX >= 0 &&
      gameX <= this.gameWidth &&
      gameY >= 0 &&
      gameY <= this.gameHeight
    ) {
      if (this.isDragging) {
        // When dragging, use proportional horizontal position for aiming
        this.handleProportionalAiming(x)
      } else if (this.isTouchPressed) {
        // When pressing and moving (but not yet dragging), update click targeting
        this.handleClickTargeting(gameX, gameY)
      } else if (!this.isTouchPressed) {
        // When just hovering (not pressing), update targeting for visual feedback
        this.handleClickTargeting(gameX, gameY)
      }
    }

    e.preventDefault()
    return false
  }

  // Helper method to check if a point is above the barrel firing line
  isAboveBarrelLine(x, y) {
    const barrelLength = 280
    const maxAngle = Math.PI / 3 // 60 degrees max angle
    const barrelBaseX = this.gameWidth / 2
    const barrelBaseY = this.gameHeight

    // Calculate the maximum reachable height at this X position
    const deltaX = Math.abs(x - barrelBaseX)
    const maxReachableAngle = maxAngle

    // If X is beyond barrel's horizontal reach, it's not fireable
    const maxHorizontalReach = barrelLength * Math.sin(maxReachableAngle)
    if (deltaX > maxHorizontalReach) {
      return false
    }

    // Calculate the barrel tip Y position if aimed at this X
    const angleToX = Math.asin(deltaX / barrelLength)
    const barrelTipY = barrelBaseY - barrelLength * Math.cos(angleToX)

    // Point is above barrel line if Y is less than (above) the barrel tip Y
    return y < barrelTipY
  }
}

if (typeof window !== 'undefined') {
  window.Anybody = Anybody
}

BigInt.prototype.toJSON = function () {
  return this.toString()
}
