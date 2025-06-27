import { hslToRgb, rgbaOpacity, THEME, themes, randHSL } from './colors.js'
import { fonts, drawKernedText } from './fonts.js'
import { utils } from 'ethers'

const BODY_SCALE = 4 // match to calculations.js !!
const GAME_LENGTH_BY_LEVEL_INDEX = [30, 60]
const LEVELS = GAME_LENGTH_BY_LEVEL_INDEX.length - 1

const rot = {
  fg: {
    direction: 1,
    speed: 25
  },
  bg: {
    direction: -1,
    speed: 35
  },
  core: {
    direction: 1,
    speed: 100
  }
}

const rotOverride = {
  fg: {
    1: {
      speed: 0
    },
    8: {
      speed: 0
    },
    9: {
      direction: -1
    }
  }
}

import BG_SVG_1 from 'bundle-text:/public/bodies/bgs/bg1.svg'
import BG_SVG_2 from 'bundle-text:/public/bodies/bgs/bg2.svg'
import BG_SVG_3 from 'bundle-text:/public/bodies/bgs/bg3.svg'
import BG_SVG_4 from 'bundle-text:/public/bodies/bgs/bg4.svg'
import BG_SVG_5 from 'bundle-text:/public/bodies/bgs/bg5.svg'
import BG_SVG_6 from 'bundle-text:/public/bodies/bgs/bg6.svg'
import BG_SVG_7 from 'bundle-text:/public/bodies/bgs/bg7.svg'
import BG_SVG_8 from 'bundle-text:/public/bodies/bgs/bg8.svg'
import BG_SVG_9 from 'bundle-text:/public/bodies/bgs/bg9.svg'
import BG_SVG_10 from 'bundle-text:/public/bodies/bgs/bg10.svg'
const BG_SVGS = [
  BG_SVG_1,
  BG_SVG_2,
  BG_SVG_3,
  BG_SVG_4,
  BG_SVG_5,
  BG_SVG_6,
  BG_SVG_7,
  BG_SVG_8,
  BG_SVG_9,
  BG_SVG_10
]

import FG_SVG_1 from 'bundle-text:/public/bodies/fgs/fg1.svg'
import FG_SVG_2 from 'bundle-text:/public/bodies/fgs/fg2.svg'
import FG_SVG_3 from 'bundle-text:/public/bodies/fgs/fg3.svg'
import FG_SVG_4 from 'bundle-text:/public/bodies/fgs/fg4.svg'
import FG_SVG_5 from 'bundle-text:/public/bodies/fgs/fg5.svg'
import FG_SVG_6 from 'bundle-text:/public/bodies/fgs/fg6.svg'
import FG_SVG_7 from 'bundle-text:/public/bodies/fgs/fg7.svg'
import FG_SVG_8 from 'bundle-text:/public/bodies/fgs/fg8.svg'
import FG_SVG_9 from 'bundle-text:/public/bodies/fgs/fg9.svg'
import FG_SVG_10 from 'bundle-text:/public/bodies/fgs/fg10.svg'
const FG_SVGS = [
  FG_SVG_1,
  FG_SVG_2,
  FG_SVG_3,
  FG_SVG_4,
  FG_SVG_5,
  FG_SVG_6,
  FG_SVG_7,
  FG_SVG_8,
  FG_SVG_9,
  FG_SVG_10
]

import FACE_SVG_1 from 'bundle-text:/public/bodies/faces/1.svg'
import FACE_SVG_2 from 'bundle-text:/public/bodies/faces/2.svg'
import FACE_SVG_3 from 'bundle-text:/public/bodies/faces/3.svg'
import FACE_SVG_4 from 'bundle-text:/public/bodies/faces/4.svg'
import FACE_SVG_5 from 'bundle-text:/public/bodies/faces/5.svg'
import FACE_SVG_6 from 'bundle-text:/public/bodies/faces/6.svg'
import FACE_SVG_7 from 'bundle-text:/public/bodies/faces/7.svg'
import FACE_SVG_8 from 'bundle-text:/public/bodies/faces/8.svg'
import FACE_SVG_9 from 'bundle-text:/public/bodies/faces/9.svg'
import FACE_SVG_10 from 'bundle-text:/public/bodies/faces/10.svg'
import FACE_SVG_11 from 'bundle-text:/public/bodies/faces/11.svg'
import FACE_SVG_12 from 'bundle-text:/public/bodies/faces/12.svg'
import FACE_SVG_13 from 'bundle-text:/public/bodies/faces/13.svg'
import FACE_SVG_14 from 'bundle-text:/public/bodies/faces/14.svg'
const FACE_SVGS = [
  FACE_SVG_1,
  FACE_SVG_2,
  FACE_SVG_3,
  FACE_SVG_4,
  FACE_SVG_5,
  FACE_SVG_6,
  FACE_SVG_7,
  FACE_SVG_8,
  FACE_SVG_9,
  FACE_SVG_10,
  FACE_SVG_11,
  FACE_SVG_12,
  FACE_SVG_13,
  FACE_SVG_14
]

import FACE_BLINK_SVG_1 from 'bundle-text:/public/bodies/faces_blink/1.svg'
import FACE_BLINK_SVG_2 from 'bundle-text:/public/bodies/faces_blink/2.svg'
import FACE_BLINK_SVG_3 from 'bundle-text:/public/bodies/faces_blink/3.svg'
import FACE_BLINK_SVG_4 from 'bundle-text:/public/bodies/faces_blink/4.svg'
import FACE_BLINK_SVG_5 from 'bundle-text:/public/bodies/faces_blink/5.svg'
import FACE_BLINK_SVG_6 from 'bundle-text:/public/bodies/faces_blink/6.svg'
import FACE_BLINK_SVG_7 from 'bundle-text:/public/bodies/faces_blink/7.svg'
import FACE_BLINK_SVG_8 from 'bundle-text:/public/bodies/faces_blink/8.svg'
import FACE_BLINK_SVG_9 from 'bundle-text:/public/bodies/faces_blink/9.svg'
import FACE_BLINK_SVG_10 from 'bundle-text:/public/bodies/faces_blink/10.svg'
import FACE_BLINK_SVG_11 from 'bundle-text:/public/bodies/faces_blink/11.svg'
import FACE_BLINK_SVG_12 from 'bundle-text:/public/bodies/faces_blink/12.svg'
import FACE_BLINK_SVG_13 from 'bundle-text:/public/bodies/faces_blink/13.svg'
import FACE_BLINK_SVG_14 from 'bundle-text:/public/bodies/faces_blink/14.svg'
const FACE_BLINK_SVGS = [
  FACE_BLINK_SVG_1,
  FACE_BLINK_SVG_2,
  FACE_BLINK_SVG_3,
  FACE_BLINK_SVG_4,
  FACE_BLINK_SVG_5,
  FACE_BLINK_SVG_6,
  FACE_BLINK_SVG_7,
  FACE_BLINK_SVG_8,
  FACE_BLINK_SVG_9,
  FACE_BLINK_SVG_10,
  FACE_BLINK_SVG_11,
  FACE_BLINK_SVG_12,
  FACE_BLINK_SVG_13,
  FACE_BLINK_SVG_14
]

import FACE_SHOT_SVG_1 from 'bundle-text:/public/bodies/faces_shot/1.svg'
import FACE_SHOT_SVG_2 from 'bundle-text:/public/bodies/faces_shot/2.svg'
import FACE_SHOT_SVG_3 from 'bundle-text:/public/bodies/faces_shot/3.svg'
import FACE_SHOT_SVG_4 from 'bundle-text:/public/bodies/faces_shot/4.svg'
import FACE_SHOT_SVG_5 from 'bundle-text:/public/bodies/faces_shot/5.svg'
import FACE_SHOT_SVG_6 from 'bundle-text:/public/bodies/faces_shot/6.svg'
import FACE_SHOT_SVG_7 from 'bundle-text:/public/bodies/faces_shot/7.svg'
import FACE_SHOT_SVG_8 from 'bundle-text:/public/bodies/faces_shot/8.svg'
import FACE_SHOT_SVG_9 from 'bundle-text:/public/bodies/faces_shot/9.svg'
import FACE_SHOT_SVG_10 from 'bundle-text:/public/bodies/faces_shot/10.svg'
import FACE_SHOT_SVG_11 from 'bundle-text:/public/bodies/faces_shot/11.svg'
import FACE_SHOT_SVG_12 from 'bundle-text:/public/bodies/faces_shot/12.svg'
import FACE_SHOT_SVG_13 from 'bundle-text:/public/bodies/faces_shot/13.svg'
import FACE_SHOT_SVG_14 from 'bundle-text:/public/bodies/faces_shot/14.svg'

const FACE_SHOT_SVGS = [
  FACE_SHOT_SVG_1,
  FACE_SHOT_SVG_2,
  FACE_SHOT_SVG_3,
  FACE_SHOT_SVG_4,
  FACE_SHOT_SVG_5,
  FACE_SHOT_SVG_6,
  FACE_SHOT_SVG_7,
  FACE_SHOT_SVG_8,
  FACE_SHOT_SVG_9,
  FACE_SHOT_SVG_10,
  FACE_SHOT_SVG_11,
  FACE_SHOT_SVG_12,
  FACE_SHOT_SVG_13,
  FACE_SHOT_SVG_14
]

import CORE_SVG from 'bundle-text:/public/bodies/cores/core-zigzag-lg.svg'
const CORE_SVGS = [CORE_SVG]

import BADDIE_BG_SVG from 'bundle-text:/public/baddies/baddie-bg.svg'
import BADDIE_CORE_SVG from 'bundle-text:/public/baddies/baddie-core.svg'
import BADDIE_FACE_SVG from 'bundle-text:/public/baddies/baddie-face.svg'
import PAUSE_BODY_DATA from './pauseBodies.js'
const BADDIE_SVG = {
  bg: BADDIE_BG_SVG,
  core: BADDIE_CORE_SVG,
  face: BADDIE_FACE_SVG
}

const svgs = {
  BADDIE_SVG,
  BG_SVGS,
  CORE_SVGS,
  FACE_BLINK_SVGS,
  FACE_SHOT_SVGS,
  FACE_SVGS,
  FG_SVGS
}

const replaceAttribute = (string, key, color) =>
  string.replaceAll(
    new RegExp(`(?<=\\s|^)${key}="(?!none)([^"]+)"`, 'g'),
    `${key}="${color}"`
  )

export const Visuals = {
  async draw() {
    if (this.missileEvent) {
      const { x, y } = this.missileEvent
      this.missileEvent = false
      this.processMissileClick(x, y)
    }

    if (this.shaking && this.shaking > 0) {
      this.shakeScreen()
    } else {
      this.shaking = null
    }
    for (const key in this.buttons) {
      const button = this.buttons[key]
      button.visible = false
    }

    // Set up full screen background
    this.p.background(THEME.bg)

    // Translate to center the game area
    this.p.push()
    this.p.translate(this.gameOffsetX, this.gameOffsetY)
    if (!this.showIt) return
    if (!this.firstFrame && !this.hasStarted) {
      this.hasStarted = true
      this.started()
    }
    const pastIntro = this.introStage >= this.totalIntroStages
    if (
      (pastIntro || this.level > 0) &&
      !this.paused &&
      this.p5Frames % this.P5_FPS_MULTIPLIER == 0
    ) {
      this.firstFrame = false
      this.frames++
      const results = this.step(this.bodies, this.missiles)
      this.bodies = results.bodies || []
      this.missiles = results.missiles || []
    }

    if (this.shootMissileNextFrame) {
      const { x, y } = this.shootMissileNextFrame
      console.log('trigger missile click from draw', { x, y })
      this.shootMissileNextFrame = null
      this.missileClick(x, y)
    }

    this.p.noFill()
    this.drawBg()

    this.p5Frames++

    // Handle rapid manual firing (only while mouse/touch is held down)
    if (
      this.p5Frames - this.lastRapidFireFrame >= this.rapidFireRate &&
      !this.paused &&
      !this.gameOver &&
      (this.isMousePressed || this.isTouchPressed) &&
      this.targetPosition
    ) {
      // Fire towards the current target position (which updates as user moves)
      this.missileClick(this.targetPosition.x, this.targetPosition.y)
      this.lastRapidFireFrame = this.p5Frames
    }

    // Handle autofire when dragging (fires automatically when holding and dragging)
    if (
      this.isDragging &&
      this.p5Frames - this.lastAutoFireFrame >= this.autoFireRate &&
      !this.paused &&
      !this.gameOver &&
      (this.isMousePressed || this.isTouchPressed) &&
      this.targetPosition
    ) {
      this.missileClick(this.targetPosition.x, this.targetPosition.y)
      this.lastAutoFireFrame = this.p5Frames
    }

    this.drawExplosions()

    if (pastIntro || this.level > 0) {
      this.drawPause()
      this.drawBodies()
    } else {
      if (this.paused) {
        this.drawPause()
      } else {
        this.drawIntro()
      }
    }
    this.drawScore()
    this.drawMuteButton()
    this.drawPopup()
    this.drawGun() // draw after score so cursor isnt in share img
    this.drawGunSmoke()
    this.drawExplosionSmoke()
    this.drawPoints()
    this.drawBodyMeters() // draw meters in top right
    this.drawMissileBarrel() // draw missile launcher barrel

    if (this.bodies.reduce((a, c) => a + c.radius, 0) != 0) {
      this.drawMissiles()
    }

    this.drawBonusModeOverlay() // draw bonus mode overlay
    this.drawAnimatedBalls() // draw animated balls for point visualization

    // End game area translation
    this.p.pop()

    // Draw UI elements outside game area (no translation)
    this.drawAimSlider() // draw aim control slider outside game area
    this.drawBallsCounter() // show balls counter in bottom left

    const notPaused = !this.paused
    const framesIsAtStopEveryInterval =
      (this.frames - this.startingFrame) % this.stopEvery == 0 &&
      this.p5Frames % this.P5_FPS_MULTIPLIER == 0
    const didNotJustPause = !this.justPaused

    const hitHeroBody = this.bodies[0].radius == 0 && this.level !== 0

    if (hitHeroBody && !this.handledGameOver) {
      this.handleGameOver({ won: true, hitHeroBody })
    }
    if (
      !this.won &&
      this.mode == 'game' &&
      this.bodies
        .slice(this.level == 0 ? 0 : 1)
        .reduce((a, c) => a + c.radius, 0) == 0 &&
      !this.handledGameOver
    ) {
      this.handleGameOver({ won: true })
    }

    if (
      !this.firstFrame &&
      notPaused &&
      framesIsAtStopEveryInterval &&
      didNotJustPause &&
      !this.handledGameOver
    ) {
      this.finish()
    } else {
      this.justPaused = false
    }

    // if (this.debug) {
    //   this.drawDebug()
    // } else {
    //   this.drawDebugPrompt()
    // }
  },

  drawTextBubble({
    text = '',
    x = 0,
    y = 0,
    w = 240,
    h = 56,
    fz = 48,
    fg,
    bg,
    stroke,
    align = [this.p.CENTER, this.p.TOP]
  }) {
    // return defaults for local calcs
    if (!text) return { x, y, h, w, fz }
    const { p } = this
    p.fill(bg ?? 'black')
    p.stroke(stroke ?? THEME.iris_60)
    p.rect(x, y, w, h, 16, 16, 16, 16)

    if (align[0] === p.LEFT) {
      x -= w / 2
    }
    p.textFont(fonts.body)
    p.textAlign(...align)
    p.textSize(fz)
    p.fill(fg ?? THEME.iris_30)
    p.noStroke()
    p.text(text, x + w / 2, y + (h - fz) / 2 - 1)
    p.pop()
  },

  // drawDebugPrompt() {
  //   this.p.noStroke()
  //   this.p.fill('white')
  //   this.p.textSize(12)
  //   this.p.text('?', this.windowWidth - 20, this.windowHeight - 20)
  // },

  // drawDebug() {
  //   const rows = 5
  //   const rowHeight = 15
  //   const leftMargin = 5
  //   const avgRate = this.p.avgRate().toFixed(2)
  //   const currRate = this.p.currRate().toFixed(2)
  //   const boxWidth = 100
  //   const boxHeight = rows * rowHeight + 20

  //   this.p.noStroke()
  //   this.p.fill('rgba(0,0,0,0.8)')
  //   this.p.rect(
  //     this.windowWidth - boxWidth,
  //     this.windowHeight - boxHeight,
  //     boxWidth,
  //     boxHeight
  //   )
  //   this.p.fill('white')
  //   this.p.text(
  //     'cur fps: ' + currRate,
  //     this.windowWidth - boxWidth + leftMargin,
  //     this.windowHeight - boxHeight + rowHeight * 1,
  //     boxWidth,
  //     boxHeight
  //   )
  //   this.p.text(
  //     'avg fps: ' + avgRate,
  //     this.windowWidth - boxWidth + leftMargin,
  //     this.windowHeight - boxHeight + rowHeight * 2,
  //     boxWidth,
  //     boxHeight
  //   )

  //   const cores = navigator.hardwareConcurrency
  //   this.p.text(
  //     '~' + cores + ' cores',
  //     this.windowWidth - boxWidth + leftMargin,
  //     this.windowHeight - boxHeight + +rowHeight * 3,
  //     boxWidth,
  //     boxHeight
  //   )
  //   const ram = navigator.deviceMemory || 'N/A'
  //   this.p.text(
  //     '~' + ram + ' GB RAM',
  //     this.windowWidth - boxWidth + leftMargin,
  //     this.windowHeight - boxHeight + rowHeight * 4,
  //     boxWidth,
  //     boxHeight
  //   )
  //   const isIntel = navigator.userAgent.includes('Intel')
  //   this.p.text(
  //     (isIntel ? 'Intel' : 'AMD') + ' inside',
  //     this.windowWidth - boxWidth + leftMargin,
  //     this.windowHeight - boxHeight + rowHeight * 5,
  //     boxWidth,
  //     boxHeight
  //   )
  //   const pixelDensity = window.devicePixelRatio || 1
  //   this.p.text(
  //     pixelDensity + 'x pxl density',
  //     this.windowWidth - boxWidth + leftMargin,
  //     this.windowHeight - boxHeight + rowHeight * 6,
  //     boxWidth,
  //     boxHeight
  //   )
  // },

  drawPause() {
    if (!fonts.dot || !this.paused || this.showProblemRankingsScreenAt !== -1)
      return

    const p = this.p

    const unpauseDuration = this.level == 0 ? 0.7 : 0
    const unpauseFrames = unpauseDuration * this.P5_FPS

    if (this.willUnpause && !this.beganUnpauseAt) {
      this.beganUnpauseAt = unpauseFrames ? this.p5Frames : 0
    }

    // pause and return when unpause finished
    if (this.beganUnpauseAt + unpauseFrames < this.p5Frames) {
      this.paused = false
      this.willUnpause = false
      return
    } else if (this.willUnpause) {
      // fade text out
      const fadeOutFrames = unpauseFrames / 3
      const fadeOutProgress = this.p5Frames - this.beganUnpauseAt
      const fadeOut = this.p.map(fadeOutProgress, 0, fadeOutFrames, 1, 0)
      p.fill(rgbaOpacity(THEME.pink, fadeOut))
    } else {
      // draw box - responsive to game dimensions
      const boxMargin = 30
      const boxWidth = this.gameWidth - boxMargin * 2
      const boxHeight = this.gameHeight - 120
      p.stroke(THEME.iris_60)
      p.strokeWeight(THEME.borderWt)
      p.noFill()
      p.rect(boxMargin, 60, boxWidth, boxHeight, 32, 32, 32, 32)

      // date
      p.textFont(fonts.body)
      p.textSize(52)
      const dateWidth = p.textWidth(this.date)
      const dateBgWidth = dateWidth + 48
      p.fill('black')
      p.stroke(THEME.iris_60)
      p.strokeWeight(THEME.borderWt)
      p.rect(60, 25, dateBgWidth, 60, 80)
      p.textAlign(p.LEFT, p.CENTER)
      p.fill(THEME.violet_25)
      p.noStroke()
      p.text(this.date, 60 + 48 / 2, 25 + 60 / 2)

      p.fill(THEME.pink)
    }

    // draw logo
    p.textFont(fonts.dot)
    p.textSize(180)
    p.textAlign(p.LEFT, p.TOP)
    p.noStroke()
    const titleY = this.gameHeight / 2 - 180 // Responsive positioning
    const titleX = (this.gameWidth - 540) / 2 // Center horizontally
    drawKernedText(p, 'Anybody', titleX, titleY, 0.8)
    drawKernedText(p, 'Problem', titleX, titleY + 183, 2)

    this.drawPauseBodies({ fleeDuration: unpauseDuration })

    if (!this.willUnpause) {
      const buttonWidth = Math.min(350, this.gameWidth - 100)
      const buttonHeight = 108
      const buttonY = this.gameHeight - buttonHeight - 30
      const buttonSpacing = 20

      // play button
      this.drawButton({
        text: 'PLAY',
        onClick: () => {
          if (this.popup) return
          // start play
          this.sound?.playStart()
          this.setPause(false)
        },
        fg: THEME.violet_50,
        bg: THEME.pink,
        width: buttonWidth,
        height: buttonHeight,
        textSize: 78,
        x: !this.opensea
          ? this.gameWidth / 2 + buttonSpacing / 2
          : this.gameWidth / 2 - buttonWidth / 2,
        y: buttonY,
        gameArea: true, // Mark as game area button
        p
      })

      // mint button
      if (this.opensea !== true) {
        this.drawButton({
          text: 'MINT',
          onClick: () => {
            this.emit('mint')
          },
          fg: THEME.violet_25,
          bg: '#241465', // THEME.iris_75,
          width: buttonWidth,
          height: buttonHeight,
          textSize: 78,
          x: this.gameWidth / 2 - buttonWidth - buttonSpacing / 2,
          y: buttonY,
          gameArea: true, // Mark as game area button
          p
        })
      }

      p.pop()
    }
  },

  drawBodyOutlines() {
    for (let i = 0; i < this.bodies.length; i++) {
      const body = this.bodies[i]
      const radius = body.radius * 4

      this.p.stroke(this.getGrey())
      this.p.stroke('black')
      this.p.strokeWeight(1)
      this.p.color('rgba(0,0,0,0)')
      this.p.ellipse(body.position.x, body.position.y, radius, radius)
    }
  },

  drawBg() {
    // Background is now handled at the start of draw() for full screen
    // This just handles the game area background elements

    const drawCluster = (graphic, x, y, c) => {
      const range = 250
      for (let i = 0; i < 5000; i++) {
        const angle = graphic.random(0, graphic.TWO_PI)
        const radius = graphic.random(-range / 2, range)
        const xOffset = radius * graphic.cos(angle)
        const yOffset = radius * graphic.sin(angle)

        let variation = graphic.lerpColor(
          graphic.color(c),
          graphic.color(
            graphic.random(150),
            graphic.random(150),
            graphic.random(150)
          ),
          0.65
        )
        variation.setAlpha(100)
        graphic.fill(variation)
        // graphic.fill(graphic.color(c))
        graphic.ellipse(x + xOffset, y + yOffset, 2, 2)
      }
    }

    const quadraticPoint = (a, b, c, t) => {
      return (1 - t) * (1 - t) * a + 2 * (1 - t) * t * b + t * t * c
    }

    const drawMilky = (graphic) => {
      const rand = (min, max, offset = 0) => {
        let rand = utils.solidityKeccak256(['bytes32'], [this.seed])
        if (offset !== 0) {
          rand = utils.solidityKeccak256(['bytes32', 'uint256'], [rand, offset])
        }
        return this.randomRange(min, max, rand)
      }

      graphic.colorMode(graphic.RGB)
      const startColor = graphic.color(
        ...hslToRgb(
          randHSL(themes.bodies.default['berlin'].bg, true, rand.bind(this), 0),
          1,
          true
        )
      )
      const endColor = graphic.color(
        ...hslToRgb(
          randHSL(
            themes.bodies.default['berlin'].bg,
            true,
            rand.bind(this),
            100
          ),
          1,
          true
        )
      )
      const r = rand(0, 1, 0)
      const startXLeft = r == 0
      const startYLeft = rand(0, 1, 1) == 0
      // Define control points for the Bézier curve
      let x1 = startXLeft ? -100 : this.windowWidth + 100,
        y1 = startYLeft ? this.windowHeight + 100 : 0
      let x2 = startXLeft ? 0 : this.windowWidth,
        y2 = startYLeft ? 0 : this.windowHeight
      let x3 = startXLeft ? this.windowWidth : -100,
        y3 = startYLeft ? -100 : this.windowHeight + 100
      // Get points along the curve
      for (let t = 0; t <= 1; t += 0.01) {
        let x = quadraticPoint(x1, x2, x3, t)
        let y = quadraticPoint(y1, y2, y3, t)

        let inter = graphic.map(y, 50, 250, 0, 1)
        let c = graphic.lerpColor(startColor, endColor, inter)
        graphic.noStroke()
        drawCluster(graphic, x, y, c)
      }
      graphic.colorMode(graphic.RGB)
    }

    if (!this.starBG) {
      this.starBG = this.p.createGraphics(this.gameWidth, this.gameHeight)
      this.starBG.pixelDensity(this.pixelDensity)

      for (let i = 0; i < 200; i++) {
        this.starBG.noStroke()
        this.starBG.fill(THEME.fg)
        this.starBG.textSize(15)
        const strings = [',', '.', '*']
        this.starBG.text(
          strings[Math.floor(Math.random() * strings.length)],
          Math.floor(Math.random() * this.gameWidth),
          Math.floor(Math.random() * this.gameHeight)
        )
      }
      // this.milkyBG ||= this.p.createGraphics(
      //   this.windowWidth,
      //   this.windowHeight
      // )
      drawMilky(this.starBG)
    }
    const basicX = 0
    const basicY = 0

    this.p.image(this.starBG, basicX, basicY, this.gameWidth, this.gameHeight)
    // switch (this.level) {
    //   case 0:
    //   case 1:
    //     this.p.image(
    //       this.milkyBG,
    //       basicX,
    //       basicY,
    //       this.windowWidth,
    //       this.windowHeight
    //     )
    //     break
    //   case 2:
    //     if (!this.milkyBG2) {
    //       console.log('rotate milkyBG')
    //       this.milkyBG2 = true //this.milkyBG
    //       console.log({ milkyBG: this.milkyBG })
    //       // this.milkyBG.clear()
    //     }
    //     this.p.push()
    //     this.p.rotate(this.p.PI / 2)
    //     this.p.translate(0, -this.windowHeight)
    //     this.p.image(
    //       this.milkyBG,
    //       basicX,
    //       basicY,
    //       this.windowWidth,
    //       this.windowHeight
    //     )
    //     this.p.pop()
    //     break
    //   case 3:
    //     if (!this.milkyBG3) {
    //       this.milkyBG3 = this.milkyBG2
    //       this.milkyBG3.rotata(this.p.PI)
    //       this.milkyBG2.clear()
    //     }
    //     this.p.image(
    //       this.milkyBG3,
    //       basicX,
    //       basicY,
    //       this.windowWidth,
    //       this.windowHeight
    //     )
    //     break
    // }
  },

  drawPopup() {
    if (!this.popup) return
    const { p, popup } = this

    // animate in
    const animDuration = 0.2 // seconds

    const justEntered = popup.lastVisibleFrame !== this.p5Frames - 1
    if (justEntered) {
      popup.visibleForFrames = 0
    }
    popup.visibleForFrames++
    popup.lastVisibleFrame = this.p5Frames

    const alpha = Math.min(
      0.8,
      popup.visibleForFrames / (animDuration * this.P5_FPS)
    )

    p.fill(`rgba(20, 4, 32, ${alpha})`)
    p.noStroke()
    p.rect(0, 0, this.windowWidth, this.windowHeight)

    const w = 840
    const x = (this.windowWidth - w) / 2
    const pad = [40, 48, 140, 48]
    const fz = [90, 44]
    const bg = popup.bg ?? THEME.violet_25
    const fg = popup.fg ?? THEME.violet_50
    const stroke = popup.stroke ?? fg

    const h = pad[0] + fz[0] + fz[1] * popup.body.length + pad[2]
    const animY = Math.max(
      0,
      50 - (50 / (animDuration * this.P5_FPS)) * popup.visibleForFrames
    )
    const y = (this.windowHeight - h) / 2 + animY

    // modal
    p.fill(bg)
    p.stroke(stroke)
    p.strokeWeight(3)
    p.rect(x, y, w, h, 24, 24, 24, 24)

    // heading
    if (!fonts.dot) return
    p.textFont(fonts.dot)
    p.fill(popup.fg ?? fg)
    p.textSize(fz[0])
    p.textAlign(p.CENTER, p.TOP)
    p.noStroke()
    p.text(popup.header, x + w / 2, y + pad[0])

    // body
    if (!fonts.body) return
    p.textFont(fonts.body)
    p.textSize(fz[1])
    p.textAlign(p.CENTER, p.TOP)
    for (let i = 0; i < popup.body.length; i++) {
      const text = popup.body[i]
      const lineGap = parseInt(fz[1] * 0.25)
      const y1 =
        y + pad[0] + fz[0] + fz[1] * (i + 1) + lineGap * (i + 1) - fz[1] * 0.5
      p.text(text, x + w / 2, y1)
    }

    // buttons (max 2)
    const buttons = popup.buttons.slice(0, 2)
    const btnGutter = 10
    const btnW =
      buttons.length === 1 ? w / 2 : w / 2 - pad[1] / 2 - btnGutter / 2
    const btnH = 104
    const defaultOptions = {
      height: btnH,
      textSize: 60,
      width: btnW,
      y: y + h - btnH / 2,
      fg,
      bg,
      stroke
    }
    for (let i = 0; i < buttons.length; i++) {
      const options = buttons[i]
      this.drawButton({
        x:
          popup.buttons.length > 1
            ? x + pad[1] / 2 + (btnW + btnGutter) * i
            : x + w / 2 - btnW / 2, // centered
        ...defaultOptions,
        ...options
      })
    }

    p.pop()
  },

  handleRedoButtonClick(showCloseButton = true) {
    if (!this.skipRedoPopupTip) {
      this.popup = {
        bg: THEME.teal_75,
        fg: THEME.teal_50,
        stroke: THEME.teal_50,
        header: 'Tip',
        body: [
          this.hasTouched
            ? 'Tap the TIMER to restart levels'
            : 'Press {R} to restart levels'
        ],
        buttons: [
          ...(showCloseButton
            ? [
                {
                  text: 'CLOSE',
                  onClick: () => {
                    this.popup = null
                  }
                }
              ]
            : []),
          {
            text: 'REDO',
            bg: THEME.teal_50,
            fg: THEME.teal_75,
            stroke: THEME.teal_50,
            onClick: () => {
              this.popup = null
              this.restart(null, false)
            }
          }
        ]
      }
    } else {
      this.restart(null, false)
    }
  },

  getColorDir(chunk) {
    return Math.floor(this.frames / (255 * chunk)) % 2 == 0
  },

  getGrey() {
    if (this.getColorDir(this.chunk)) {
      return 255 - (Math.floor(this.frames / this.chunk) % 255)
    } else {
      return Math.floor(this.frames / this.chunk) % 255
    }
  },

  drawMuteButton() {
    if (
      this.paused ||
      this.gameOver ||
      (this.introStage === 0 && !(this.levelCountdown < 200))
    )
      return
    const { p } = this
    // draw mute btn in bottom right corner
    p.push()
    p.noStroke()
    p.fill('white')
    const xOffset = this.windowWidth - (this.hasTouched ? 108 : 80)
    const yOfffset = this.windowHeight - (this.hasTouched ? 116 : 84)
    p.translate(xOffset, yOfffset) // move 0,0 to bottom right corner
    // Scale factor based on the input width
    const scale = this.hasTouched ? Math.floor(48 / 6) : Math.floor(36 / 6)
    // Draw speaker body
    this.drawMuteIconRect(0, 3, 1, 4, scale)
    this.drawMuteIconRect(2, 3, 1, 4, scale)
    this.drawMuteIconRect(3, 2, 1, 6, scale)
    this.drawMuteIconRect(4, 1, 1, 8, scale)
    this.drawMuteIconRect(5, 0, 1, 10, scale)
    this.drawMuteIconRect(1, 3, 1, 4, scale)

    if (this.mute) {
      // NO SOUND rectangles (DISPLAY ON MUTE)
      this.drawMuteIconRect(7, 4.5, 2.5, 1, scale)
    } else {
      // SOUNDWAVE rectangles (DISPLAY ON SOUND)
      this.drawMuteIconRect(6.5, 4, 1, 2, scale)
      this.drawMuteIconRect(8, 3, 1, 4, scale)
    }

    // button tap area a bit margin around icon
    const muteBtnTapArea = {
      x: this.hasTouched ? -20 : -6,
      y: this.hasTouched ? -20 : -6,
      w: 200
    }
    // p.stroke('white')
    // p.noFill()
    // p.rect(muteBtnTapArea.x, muteBtnTapArea.y, muteBtnTapArea.w, muteBtnTapArea.w)

    let muteButton = this.buttons['mute-button']
    if (!muteButton) {
      this.buttons['mute-button'] = {
        x: xOffset + muteBtnTapArea.x,
        y: yOfffset + muteBtnTapArea.y,
        width: muteBtnTapArea.w,
        height: muteBtnTapArea.w,
        onClick: () => {
          this.mute = !this.mute
          this.sound?.setMuted(this.mute)
        }
      }
      muteButton = this.buttons['mute-button']
      muteButton.disabled = false
    }
    muteButton.visible = true

    // ADD BUTTON
    p.pop()
  },

  calculatePoint(body) {
    const { position, velocity, radius, bodyIndex } = body
    let basePoints
    switch (bodyIndex) {
      case 0:
        basePoints = [-20, 0, 0]
        break
      case 1:
        basePoints = [1, 0, 0]
        break
      case 2:
        basePoints = [1, 0, 0]
        break
      case 3:
        basePoints = [2, 0, 0]
        break
      case 4:
        basePoints = [10, 0, 0]
        break
      case 5:
        basePoints = [10, 0, 0]
        break
      default: {
        const bb = bodyIndex == 0
        const maxDist = this.p.dist(0, 0, this.windowWidth, this.windowHeight)
        const dist = this.p.dist(position.x, position.y, 0, this.windowHeight)
        const distPoints = Math.floor(this.p.map(dist, 0, maxDist, 0, 100))
        const velocityVector = this.p.createVector(velocity.x, velocity.y)
        const maxVector = this.missileSpeed * this.speedFactor
        const velPoints = Math.floor(
          this.p.map(velocityVector.mag(), 0, maxVector, 0, 100)
        )
        const radiusPoints =
          this.introStage < this.totalIntroStages
            ? 50
            : Math.floor(this.p.map(radius, bb ? 11 : 36, bb ? 36 : 11, 0, 100))

        basePoints = [distPoints, velPoints, radiusPoints].map((point) =>
          bb ? point * -1 : point
        )
        break
      }
    }

    // Apply 2x bonus if body type is in bonus mode
    if (
      bodyIndex !== 0 &&
      this.isBodyInBonusMode &&
      this.isBodyInBonusMode(bodyIndex)
    ) {
      basePoints = basePoints.map((point) => point * 2)
    }

    return basePoints
  },

  calculatePoints() {
    // Points are now calculated immediately when bodies are hit
    // This method just returns current points for display
    return this.currentPoints
  },

  drawScore() {
    if (this.paused) return
    const { p } = this
    p.push()
    p.fill('white')
    p.noStroke()
    p.textAlign(p.LEFT, p.TOP)

    this.drawProblemRankingsScreen()

    const runningFrames = this.frames - this.startingFrame
    if (this.gameOver) {
      this.scoreSize = this.initialScoreSize
      p.pop()
      this.won ? this.drawWinScreen() : this.drawLoseScreen()
      if (!this.celebrating) return
    }

    // flash the score red and white
    if (this.won) {
      const flash = Math.floor(this.frames / 10) % 2 == 0
      p.fill(flash ? THEME.red : 'white')
    }

    p.textFont(fonts.body)
    p.textSize(this.scoreSize)
    if (
      runningFrames > 2 &&
      (!this.gameOver || (this.gameOver && this.won && !this.skipAhead))
    ) {
      const points = this.calculatePoints() + 'pts'
      if (this.won) {
        p.textSize(this.scoreSize * 2)
        p.text(points, 20, 0)
      } else {
        p.textAlign(p.CENTER, p.TOP)
        p.text(points, this.windowWidth / 2, 0)
      }
    }

    p.pop()
  },

  drawMuteIconRect(x, y, w, h, scale) {
    this.p.rect(x * scale, y * scale, w * scale, h * scale, 1)
  },

  drawWinScreen() {
    if (this.showProblemRankingsScreenAt >= 0) return

    const justEntered = this.winScreenLastVisibleFrame !== this.p5Frames - 1
    if (justEntered) {
      this.winScreenVisibleForFrames = 0
    }
    this.winScreenVisibleForFrames++
    this.winScreenLastVisibleFrame = this.p5Frames

    const celebrationTime = 2.5 // seconds
    this.celebrating =
      this.winScreenVisibleForFrames / this.P5_FPS < celebrationTime

    if (this.celebrating && !this.skipAhead) {
      this.drawGameOverTicker({
        text: '                 YES  YES  YES  YES  YES  YES  YES  YES',
        bottom: true,
        fg: THEME.iris_30
      })
    } else {
      if (this.level == 0) {
        this.level++
        this.restart(null, false)
      } else {
        if (this.sound?.playbackRate !== 'normal') {
          this.sound?.playCurrentSong()
        }
        this.drawStatsScreen()
      }
    }
  },

  drawStatsScreen() {
    if (!this.shownStatScreen) {
      this.shownStatScreen = true
    }
    const { p } = this
    const borderWeight = 1
    const showCumulativeTimeRow = this.level > 1

    // animation
    const justEntered = this.statsScreenLastVisibleFrame !== this.p5Frames - 1
    if (justEntered) {
      this.statsScreenVisibleForFrames = 0
      this.P5_FPS = this.FPS * this.P5_FPS_MULTIPLIER
      this.p.frameRate(this.P5_FPS)
    }
    this.statsScreenVisibleForFrames++
    this.statsScreenLastVisibleFrame = this.p5Frames

    const entranceTime = 0.4 // seconds

    const scale = Math.min(
      1,
      this.statsScreenVisibleForFrames / (entranceTime * this.P5_FPS)
    )

    p.push()
    p.noStroke()
    p.fill('white')

    // logo at top
    if (!fonts.dot) return
    p.textFont(fonts.dot)
    p.fill(THEME.pink)
    p.textSize(64)
    p.textAlign(p.LEFT, p.TOP)
    const logoY = p.map(scale, 0, 1, -100, 19)
    drawKernedText(p, 'Anybody', 340, logoY, 0.8)
    drawKernedText(p, 'Problem', 662, logoY, 2)

    // bordered boxes
    p.fill('black')
    p.stroke(THEME.border)
    p.strokeWeight(borderWeight)
    const gutter = 20
    const boxW = this.windowWidth - gutter * 2
    const middleBoxY = 320
    const middleBoxH = showCumulativeTimeRow ? 444 : 364
    p.rect(gutter, 104, boxW, 144, 24)
    p.rect(gutter, middleBoxY, boxW, middleBoxH, 24)
    p.rect(gutter, 796, boxW, 64, 24)

    // upper box text
    p.textSize(36)
    p.noStroke()
    if (!fonts.body) return
    p.textFont(fonts.body)
    p.fill(THEME.iris_50)

    // upper box text - labels
    p.text('player', 341, 128)
    p.text('problem', 341, 188)

    // upper box text - values
    p.textSize(54)
    p.fill(THEME.iris_30)
    const formattedDate = new Date(this.date)
      .toLocaleDateString('en-US', {
        month: 'short',
        day: '2-digit',
        year: 'numeric'
      })
      .toUpperCase()
    p.text(this.playerName ?? 'YOU', 495, 114)
    p.text(formattedDate, 495, 174)
    // end upper box text

    // middle box text
    const levelTimes = this.levelSpeeds
      .map((result) => result?.points)
      .filter((l) => l !== undefined)
    const bestTimes =
      this.todaysRecords?.levels?.map((l) => l.events[0].points) ?? []

    const showBestAndDiff = bestTimes.length

    p.textSize(48)
    const midHeadY = 264
    p.fill(THEME.iris_30)
    p.textAlign(p.RIGHT, p.TOP)
    const col1X = 580
    const col2X = 780
    const col3X = 964
    const timeColX = showBestAndDiff ? col1X : col3X

    // middle box text - labels
    p.text('score', timeColX, midHeadY)
    if (showBestAndDiff) {
      p.text('best', col2X, midHeadY)
      p.text('diff', col3X, midHeadY)
    }

    // middle box text - values
    // const problemComplete = levelTimes.length >= LEVELS
    const rowHeight = 72

    // middle box text - highlight current row (blink via opacity)
    p.fill(
      `rgba(146, 118, 255, ${Math.floor(p.frameCount / 18) % 2 ? '0.2' : '0'})`
    )
    p.rect(
      gutter,
      middleBoxY + (levelTimes.length - 1) * rowHeight,
      this.windowWidth - gutter * 2,
      rowHeight,
      this.level === 1 ? 24 : 0, // round top corners when first row
      this.level === 1 ? 24 : 0, // round top corners when first row
      0,
      0
    )

    // middle box text - value text
    p.push()
    p.textAlign(p.RIGHT, p.CENTER)
    p.textSize(56)
    // const middleBoxPadding = 12
    // p.translate(0, middleBoxPadding)
    // times
    for (let i = 0; i < LEVELS; i++) {
      const time = i < levelTimes.length ? levelTimes[i] : '-'
      p.fill(THEME.iris_30)
      p.text(
        time,
        timeColX,
        middleBoxY + rowHeight * i + rowHeight / 2,
        150,
        rowHeight
      )
    }
    if (showBestAndDiff) {
      // calc diffs
      const plusMinus = bestTimes
        .map((best, i) => {
          if (i >= levelTimes.length) return ''
          const time = levelTimes[i]
          const diff = time - best
          const sign = Number(diff) > 0 ? '+' : '-'
          return sign + Math.abs(diff)
        })
        .filter(Boolean)
      // best times
      for (let i = 0; i < LEVELS; i++) {
        const best = i < bestTimes.length ? bestTimes[i] : '-'
        p.fill(THEME.iris_50)
        p.text(
          best,
          col2X,
          middleBoxY + rowHeight * i + rowHeight / 2,
          150,
          rowHeight
        )
      }
      // diff values
      for (let i = 0; i < LEVELS; i++) {
        const diff = plusMinus[i] || '-'
        p.fill(
          diff === '-'
            ? THEME.iris_30
            : /^-/.test(diff)
              ? THEME.lime
              : THEME.flame_50
        )
        p.text(
          diff,
          col3X,
          middleBoxY + rowHeight * i + rowHeight / 2,
          150,
          rowHeight
        )
      }
    }
    p.textSize(64)

    // middle box text - sum line
    if (showCumulativeTimeRow) {
      const levelTimeSum = levelTimes.reduce((a, b) => a + b, 0)
      const sumLine = [levelTimeSum]

      if (showBestAndDiff) {
        const bestTime = bestTimes
          .slice(0, levelTimes.length)
          .reduce((a, b) => a + b, 0)
        let diff = Number(levelTimeSum - bestTime)
        sumLine[1] = bestTime
        sumLine[2] = `${diff > 0 ? '+' : '-'}${Math.abs(diff)}`
      }

      const sumLineY = middleBoxY + rowHeight * Math.min(5, LEVELS)
      const sumLineHeight = 80
      const sumLineYText = sumLineY + sumLineHeight / 2
      p.textAlign(p.LEFT, p.CENTER)
      p.fill(THEME.iris_50)
      p.text('total points', 44, sumLineYText)
      p.textAlign(p.RIGHT, p.CENTER)
      const columns = showBestAndDiff ? [col1X, col2X, col3X] : [timeColX]
      for (const [i, col] of columns.entries()) {
        if (i == 0) p.fill(THEME.iris_30)
        else if (i == 1) p.fill(THEME.iris_60)
        else p.fill(/^-/.test(sumLine[i]) ? THEME.lime : THEME.flame_50)
        p.text(sumLine[i], col, sumLineYText, 150, sumLineHeight)
      }
      // top border line
      p.strokeWeight(borderWeight)
      p.stroke(THEME.iris_60)
      p.line(gutter, sumLineY, boxW + gutter, sumLineY)
      p.noStroke()
    }

    p.pop()
    // end middle box text

    // draw hero this.bodies[0]
    const body = this.getDisplayHero()
    const xWobble = p.sin(p.frameCount / this.P5_FPS) * (5 + body.bodyIndex)
    const yWobble =
      p.cos(p.frameCount / this.P5_FPS + body.bodyIndex * 3) *
      (6 + body.bodyIndex)

    body.position = {
      x: p.map(scale, 0, 1, -140, 170) + xWobble,
      y: 180 + yWobble
    }
    this.drawBody(body)

    // begin middle box baddie body pyramid
    this.winScreenBaddies ||= this.getDisplayBaddies()
    const baddies = this.winScreenBaddies
    for (let i = 0; i < baddies.length; i++) {
      const row = baddies[i]
      for (let j = 0; j < row.length; j++) {
        const body = row[row.length - 1 - j]
        body.position = this.createVector(
          64 + j * 72,
          middleBoxY + i * rowHeight + rowHeight / 2
        )
        body.velocity = this.createVector(0, 1)
        body.radius = 6.5
        this.drawBody(body)
      }
    }

    // overlay transparent black box to dim past last levelTimes
    p.fill('rgba(0,0,0,0.6)')
    p.rect(
      gutter + borderWeight,
      middleBoxY + rowHeight * levelTimes.length - borderWeight,
      this.windowWidth - gutter * 2 - borderWeight * 2,
      rowHeight * (LEVELS - levelTimes.length),
      0,
      0,
      !showCumulativeTimeRow ? 24 : 0,
      !showCumulativeTimeRow ? 24 : 0
    )

    // bottom box ticker text
    this.winTickerGraphic ||= this.p.createGraphics(
      this.windowWidth,
      this.windowHeight
    )
    p.textAlign(p.CENTER, p.TOP)
    p.textSize(44)
    // blink text on complete
    const blinkText =
      this.levels === LEVELS && Math.floor(p.frameCount / 25) % 2
    p.fill(blinkText ? THEME.iris_60 : THEME.iris_30)
    // p.text(
    //   this.level == 5
    //     ? 'YOU WON !!   save your score to the leaderboard !!'
    //     : `BOOM !! ... just ${5 - this.level} more levels to solve this problem !!`,
    //   gutter + boxW / 2,
    //   805,
    //   boxW - gutter / 2
    // )

    // bottom buttons
    this.showRestart = this.level >= 2
    this.showShare = this.level >= 5
    let buttonCount = 2 + Number(this.showRestart) + Number(this.showShare)
    this.drawBottomButton({
      text: 'REDO',
      onClick: () => {
        if (this.popup) return
        this.handleRedoButtonClick()
      },
      ...themes.buttons.teal,
      columns: buttonCount,
      column: 0
    })
    if (this.showRestart) {
      this.drawBottomButton({
        text: 'EXIT',
        onClick: () => {
          // confirm in popup
          if (this.popup) return
          this.popup = {
            bg: THEME.flame_75,
            fg: THEME.flame_50,
            stroke: THEME.flame_50,
            header: 'Start Over?',
            body: ['Any progress will be lost!'],
            buttons: [
              {
                text: 'CLOSE',
                fg: THEME.flame_50,
                bg: THEME.flame_75,
                stroke: THEME.flame_50,
                onClick: () => {
                  this.popup = null
                }
              },
              {
                text: 'EXIT',
                fg: THEME.flame_75,
                bg: THEME.flame_50,
                stroke: THEME.flame_50,
                onClick: () => {
                  this.popup = null
                  this.level = 1
                  this.restart(undefined, true)
                }
              }
            ]
          }
        },
        ...themes.buttons.flame,
        columns: buttonCount,
        column: 1
      })
    }
    if (this.showShare) {
      this.drawBottomButton({
        text: 'SHARE',
        onClick: () => {
          // TODO: hide bottom btns / paint a promo-message over them
          if (this.popup !== null) {
            return
          }
          this.shareCanvas()
        },
        ...themes.buttons.pink,
        columns: buttonCount,
        column: 2
      })
    }
    if (this.level < 5) {
      // this.drawBottomButton({
      //   text: 'NEXT',
      //   onClick: () => {
      //     this.level++
      //     if (this.level > 5) {
      //       this.showProblemRankingsScreenAt = this.p5Frames
      //     } else {
      //       this.restart(null, false)
      //     }
      //   },
      //   ...themes.buttons.green,
      //   columns: buttonCount,
      //   column: buttonCount - 1
      // })
    } else {
      // parent app should handle waiting to save
      this.drawBottomButton({
        text: 'SAVE',
        onClick: () => {
          if (this.popup) return
          if (this.opensea) {
            this.popup = {
              header: 'Nice Job!',
              body: [
                'Next time play on ANYBODY.gg to save',
                'your win to the leaderboard !!'
              ],
              fg: THEME.green_50,
              bg: THEME.green_75,
              buttons: [
                {
                  text: 'CLOSE',
                  onClick: () => {
                    this.popup = null
                  }
                },
                {
                  text: 'NEW GAME',
                  onClick: () => {
                    this.popup = null
                    this.level = 1
                    this.restart(undefined, true)
                  },
                  fg: THEME.green_75,
                  bg: THEME.green_50
                }
              ]
            }
            return
          }
          //
          this.emit('save')
        },
        ...themes.buttons.green,
        columns: buttonCount,
        column: buttonCount - 1
      })
    }

    p.pop()

    // save canvas for sharing later (so minting doesn't update DIFF col)
    if (this.showShare) {
      if (scale === 1 && !this.shareCanvasBlob) {
        p.canvas.toBlob((blob) => {
          this.shareCanvasBlob = new File([blob], 'MyWin.png', {
            type: 'image/png'
          })
        }, 'image/png')
      }
    } else {
      this.shareCanvasBlob = undefined
    }
  },

  drawProblemRankingsScreen() {
    if (this.showProblemRankingsScreenAt === -1) return

    const { p } = this

    const entranceTime = 1.5 // seconds

    const scale = Math.min(
      1,
      (this.p5Frames - this.showProblemRankingsScreenAt) /
        (entranceTime * this.P5_FPS)
    )

    p.push()
    p.noStroke()
    p.fill('white')

    // bordered boxes
    p.fill('black')
    p.stroke(THEME.border)
    p.strokeWeight(1)
    const gutter = 22
    const middleBoxY = 155
    const rowHeight = 72
    const rows = 3
    p.rect(gutter, 28, this.windowWidth - gutter * 2, 103, 24)
    p.rect(
      gutter,
      middleBoxY,
      this.windowWidth - gutter * 2,
      rows * rowHeight,
      24
    )
    p.rect(
      gutter,
      24 + 155 + rows * rowHeight,
      this.windowWidth - gutter * 2,
      rowHeight,
      24
    )

    // logo at top
    if (!fonts.dot) return
    p.textFont(fonts.dot)
    const logoOpacity = p.map(scale, 0, 1, 0, 1)
    p.fill(rgbaOpacity(THEME.pink, logoOpacity))
    p.textSize(60)
    p.textAlign(p.LEFT, p.TOP)
    drawKernedText(p, 'Anybody', 46, 44, 0.8)
    drawKernedText(p, 'Problem', 356, 44, 2)

    // upper box text - date
    p.textSize(56)
    p.noStroke()
    if (!fonts.body) return
    p.textFont(fonts.body)
    p.fill(THEME.iris_30)
    p.textAlign(p.RIGHT, p.TOP)
    p.text(this.date, this.windowWidth - 42, 48)

    // middle box text
    p.textSize(44)
    p.textAlign(p.RIGHT, p.TOP)
    const col1X = 42
    const col2X = 187
    const col3X = this.windowWidth - col1X // right aligned

    // middle box text - values
    const scores = [
      {
        rank: 1,
        name: '0xABCD-1234',
        time: 188.889192912
      },
      {
        rank: 2,
        name: 'longassensnamethatgoesofftherowalllllllls',
        time: 189.889192912
      },
      {
        rank: 3,
        name: '0xABCD-1234',
        time: 198.889192912
      },
      {
        rank: 999998,
        name: 'petersugihara.eth',
        time: 260.889192912
      }
    ]

    // middle box text - value text
    for (const [rowNumber, score] of scores.entries()) {
      const rowY =
        rowHeight * rowNumber + rowHeight / 2 + (rowNumber === 3 ? 24 : 0)

      p.textAlign(p.LEFT, p.CENTER)
      p.fill(THEME.iris_60)
      const rankText =
        score.rank === 1
          ? '1st'
          : score.rank === 2
            ? '2nd'
            : score.rank === 3
              ? '3rd'
              : `${score.rank.toLocaleString()}`
      p.text(rankText, col1X, middleBoxY + rowY)

      p.fill(THEME.iris_30)
      let nameText = score.name // truncate to fit
      while (p.textWidth(nameText) > 656) {
        nameText = `${nameText.replaceAll(/\.\.\.$/g, '').slice(0, -1)}...`
      }
      p.text(nameText, col2X, middleBoxY + rowY)

      p.textAlign(p.RIGHT, p.CENTER)
      p.fill(THEME.iris_60)
      p.text(score.time.toFixed(2), col3X, middleBoxY + rowY)

      // bottom divider line
      if (rowNumber < 2) {
        p.fill(THEME.iris_60)
        p.rect(
          gutter,
          middleBoxY + rowHeight * (rowNumber + 1),
          this.windowWidth - gutter * 2,
          1
        )
      }
    }
    // end middle box text

    // draw hero body
    const body = this.getDisplayHero({ radius: 33 })
    const xWobble = p.sin(p.frameCount / this.P5_FPS) * (5 + body.bodyIndex)
    const yWobble =
      p.cos(p.frameCount / this.P5_FPS + body.bodyIndex * 3) *
      (6 + body.bodyIndex)
    body.position = {
      x: p.map(scale ** 3, 0, 1, -140, 180) + xWobble,
      y: 670 + yWobble
    }
    this.drawBody(body)

    this.drawMessageBox ||= ({ lines, x, y, color, start, textWidth }) => {
      if (start !== -1 && this.p5Frames < start) return
      const padding = 20
      const paddingLeft = 24
      p.textSize(32)
      p.textAlign(p.LEFT, p.TOP)
      p.textLeading(36)
      p.fill('black')
      p.stroke(color)
      p.strokeWeight(1)
      const joined = lines.join('\n')
      const messageText = joined.slice(
        0,
        Math.floor((this.p5Frames - start) / 2)
      )
      if (
        this.p5Frames % Math.floor(this.P5_FPS / 8) === 0 &&
        joined.length > messageText.length
      ) {
        this.sound?.playStart()
      }
      const longestLine = lines.sort((a, b) => b.length - a.length)[0]
      p.rect(
        x,
        y,
        (textWidth || p.textWidth(longestLine)) + paddingLeft + padding,
        lines.length * 36 + padding * 2,
        20
      )
      // console.log({ h: lines.length * 36 + padding * 2 })
      p.fill(color)

      p.text(messageText, x + paddingLeft, y + padding)
    }

    if (this.saveStatus === 'unsaved') {
      // draw messages from hero that
      const message1Entrance = 1.5
      const message1 = ['wOwOwoWwwww ! ! ! !', 'you solved the daily problem !']

      const message1Frame =
        this.showProblemRankingsScreenAt + message1Entrance * this.P5_FPS

      const message2Entrance = 3
      const message2 = [
        'SAVE your score to the leaderboard',
        "and receive today's celestial body !"
      ]
      const message2Frame =
        this.showProblemRankingsScreenAt + message2Entrance * this.P5_FPS

      const message3Entrance = 5.5
      const message3 = [
        "replay as many times as you'd like",
        "before tomorrow's problem..."
      ]
      const message3Frame =
        this.showProblemRankingsScreenAt + message3Entrance * this.P5_FPS

      this.drawMessageBox({
        lines: message1,
        x: 344,
        y: 504,
        color: THEME.iris_30,
        start: message1Frame
      })

      this.drawMessageBox({
        lines: message3,
        x: 370,
        y: 704,
        color: THEME.pink,
        start: message3Frame
      })

      this.drawMessageBox({
        lines: message2,
        x: 484,
        y: 604,
        color: THEME.green_50,
        start: message2Frame,
        textWidth: 451
      })
    }

    if (this.saveStatus === 'validating') {
      this.validatingAt ||= this.p5Frames
      this.drawMessageBox({
        lines: ['validating your score...'],
        x: 344,
        y: 504,
        color: THEME.iris_30,
        start: this.validatingAt
      })
    }

    if (
      this.saveStatus === 'validated' ||
      this.saveStatus === 'saved' ||
      this.saveStatus === 'saving'
    ) {
      this.validatedAt ||= this.p5Frames
      this.drawMessageBox({
        lines: ['score validated!'],
        x: 344,
        y: 504,
        color: THEME.iris_30,
        start: -1
      })
    }

    if (this.saveStatus === 'validated' && this.validatedAt) {
      const message2Frame = this.validatedAt + 1 * this.P5_FPS
      this.drawMessageBox({
        lines: ['you can now save your score'],
        x: 484,
        y: 566,
        color: THEME.green_50,
        start: message2Frame
      })
    } else if (this.saveStatus === 'saving') {
      this.savingAt ||= this.p5Frames
      this.drawMessageBox({
        lines: ['saving your score...'],
        x: 484,
        y: 566,
        color: THEME.green_50,
        start: this.savingAt
      })
    } else if (this.saveStatus === 'saved') {
      this.savedAt ||= this.p5Frames
      this.drawMessageBox({
        lines: ['score SAVED!'],
        x: 478,
        y: 566,
        color: THEME.green_50,
        start: this.savedAt
      })

      const message2Frame = this.savedAt + 1 * this.P5_FPS
      this.drawMessageBox({
        lines: ['this body is now in your wallet !'],
        x: 414,
        y: 653,
        color: THEME.pink_40,
        start: message2Frame
      })

      const message3Frame = this.savedAt + 2 * this.P5_FPS
      this.drawMessageBox({
        lines: ['but, maybe you can do better ??'],
        x: 545,
        y: 757,
        color: THEME.yellow_50,
        start: message3Frame
      })
    }

    if (this.saveStatus !== 'saved') {
      // bottom buttons
      const buttonCount = 2
      this.drawBottomButton({
        text: 'BACK',
        onClick: () => {
          this.restart(null, false)
        },
        ...themes.buttons.teal,
        columns: buttonCount,
        column: 0
      })
      this.drawBottomButton({
        text:
          this.saveStatus === 'unsaved'
            ? 'SAVE'
            : this.saveStatus === 'validated'
              ? 'SAVE' // TODO: is it confusing that this label doesn't change?
              : `${this.saveStatus.toUpperCase()}...`,
        onClick: () => {
          this.handleSave()
        },
        ...themes.buttons.green,
        disabled:
          this.saveStatus !== 'unsaved' && this.saveStatus !== 'validated',
        columns: buttonCount,
        column: 1,
        key: 'problem-save'
      })
    } else {
      this.drawBottomButton({
        text: 'NEW GAME',
        onClick: () => {
          this.restart()
        },
        ...themes.buttons.yellow,
        columns: 1,
        column: 0
      })
    }
    p.pop()
  },

  getDisplayHero({ radius } = { radius: 33 }) {
    const body = this.bodies[0]
    const bodyCopy = JSON.parse(
      JSON.stringify(
        body,
        (key, value) => (typeof value === 'bigint' ? value.toString() : value) // return everything else unchanged
      )
    )
    bodyCopy.position = this.p.createVector(body.position.x, body.position.y)
    bodyCopy.velocity = this.p.createVector(body.velocity.x, body.velocity.y)
    bodyCopy.radius = radius
    return bodyCopy
  },

  getDisplayBaddies() {
    const baddies = []
    const bodyData = this.generateLevelData(this.day, 5)
    const bodies = bodyData.map((b) =>
      this.bodyDataToBodies.call(this, b, this.day)
    )

    const fallbackBody = bodies[bodies.length - 1]
    if (!fallbackBody) return []
    // const str = JSON.stringify(fallbackBody)
    for (let i = 0; i < LEVELS; i++) {
      baddies.push([])
      for (let j = 0; j < i + 1; j++) {
        baddies[i].push(JSON.parse(JSON.stringify(bodies[j + 1])))
      }
    }
    return baddies
  },

  drawGameOverTicker({ text, bottom = false, fg }) {
    const doubleText = `${text} ${text} `

    const { p } = this
    p.noStroke()
    p.fill(fg)
    p.textSize(200)
    p.textAlign(p.LEFT, p.TOP)
    p.textFont(fonts.body)
    const tickerSpeed = -600 / this.P5_FPS
    const textWidth = p.textWidth(doubleText)
    if (
      !this.gameoverTickerX ||
      this.gameoverTickerX + tickerSpeed < -textWidth / 2
    ) {
      this.gameoverTickerX = 0
    }
    this.gameoverTickerX += tickerSpeed
    p.text(
      doubleText,
      this.gameoverTickerX,
      bottom ? this.windowHeight - 80 - 120 : 80
    )
  },

  drawLoseScreen() {
    const { p } = this
    p.push()
    p.noStroke()
    const text =
      this.bodies[0].radius == 0
        ? 'NOOO, BLAST BADDIES NOT BODIES!!'
        : 'TIME IS UP   TIME IS UP  TIME IS UP'
    this.drawGameOverTicker({
      text: '                 ' + text,
      fg: THEME.red
    })
    const buttonWidth = 200

    if (this.level > 1) {
      const x = this.windowWidth / 2 - (4 * buttonWidth) / 2 + 20
      this.drawFatButton({
        text: 'REDO',
        onClick: () => {
          this.handleRedoButtonClick()
        },
        x,
        bg: THEME.teal_75,
        fg: THEME.teal_50
      })

      this.drawFatButton({
        text: 'EXIT',
        x: this.windowWidth / 2 + buttonWidth / 2 - 20,
        bg: THEME.flame_75,
        fg: THEME.flame_50,
        onClick: () => {
          // confirm in popup
          if (this.popup) return
          this.popup = {
            bg: THEME.flame_75,
            fg: THEME.flame_50,
            stroke: THEME.flame_50,
            header: 'Leave game?',
            body: ['Any progress will be lost!'],
            buttons: [
              {
                text: 'CLOSE',
                fg: THEME.flame_50,
                bg: THEME.flame_75,
                stroke: THEME.flame_50,
                onClick: () => {
                  this.popup = null
                }
              },
              {
                text: 'EXIT',
                fg: THEME.flame_75,
                bg: THEME.flame_50,
                stroke: THEME.flame_50,
                onClick: () => {
                  this.popup = null
                  this.level = 1
                  this.restart(undefined, true)
                }
              }
            ]
          }
        }
      })
    } else {
      this.drawFatButton({
        text: 'REDO',
        onClick: () => this.handleRedoButtonClick(false),
        bg: THEME.teal_75,
        fg: THEME.teal_50
      })
    }

    p.pop()
  },

  scaleX(val) {
    const { canvas } = this.p
    return (val / canvas.offsetWidth) * this.windowWidth
  },

  scaleY(val) {
    const { canvas } = this.p
    return (val / canvas.offsetHeight) * this.windowHeight
  },

  drawGun() {
    // Gun drawing is now handled by drawMissileBarrel()
    // This method is kept for compatibility but does nothing
  },

  hslToGrayscale(hslArray) {
    if (typeof hslArray == 'string') {
      hslArray = hslArray.split(',')
      hslArray[0] = parseInt(hslArray[0].split('(')[1])
      hslArray[1] = parseInt(hslArray[1])
      hslArray[2] = parseInt(hslArray[2].split(')')[0])
      return `hsl(${hslArray[0]},0%,${hslArray[2]}%)`
    }
    return [hslArray[0], 0, hslArray[2]]
  },

  rgbaToGrayscale(rgba, split = 3) {
    const rgbaArray = rgba.split(',')
    const r = parseInt(rgbaArray[0].split('(')[1])
    const g = parseInt(rgbaArray[1])
    const b = parseInt(rgbaArray[2])
    const a = parseFloat(rgbaArray[3].split(')')[0])
    const avg = Math.min(Math.floor((r + g + b) / split), 255)
    return `rgba(${avg},${avg},${avg},${a})`
  },

  drawExplosions() {
    if (
      this.paused ||
      (this.gameOver && (!this.celebrating || this.skipAhead) && this.won)
    )
      return
    const { explosions } = this

    for (let i = 0; i < explosions.length; i++) {
      const v = explosions[i].velocity
      const _explosion = JSON.parse(JSON.stringify(explosions[i]))
      _explosion.velocity = v
      if (_explosion.bodyIndex == 0) {
        _explosion.cry = true
        _explosion.c.bg = this.hslToGrayscale(explosions[i].c.bg, 1.5)
        _explosion.c.fg = this.hslToGrayscale(explosions[i].c.fg)
        _explosion.c.core = this.hslToGrayscale(explosions[i].c.core)
      } else {
        _explosion.c.baddie = this.hslToGrayscale(explosions[i].c.baddie)
      }
      // this.drawPoint(_explosion)
      // this.drawBody(_explosion, true)
    }
  },

  drawPoints() {
    this.p.textFont(fonts.body)

    if (this.paused || this.gameOver) return
    for (let i = 0; i < this.explosions.length; i++) {
      const explosion = this.explosions[i]
      this.drawPoint(explosion)

      // Trigger animated balls for this explosion if not already triggered
      if (!explosion.ballsTriggered) {
        explosion.ballsTriggered = true
        this.handleBodyHit(explosion.bodyIndex, {
          x: explosion.position.x,
          y: explosion.position.y
        })
      }
    }
  },

  drawPoint(body) {
    const timeSince = this.frames - body.frame
    const maxFrames = 75
    if (timeSince > maxFrames) return
    this.p.textAlign(this.p.RIGHT, this.p.CENTER)
    let points = this.calculatePoint(body)
    const textSize = 50
    const xMargin = 100
    const yMargin = (points.length + 1) * textSize
    const x =
      body.position.x + xMargin > this.windowWidth
        ? this.windowWidth - xMargin
        : body.position.x
    const y =
      body.position.y + yMargin > this.windowHeight
        ? this.windowHeight - yMargin
        : body.position.y
    this.p.strokeWeight(2)
    this.p.textSize(textSize)
    // for (let i = 0; i < points.length; i++) {
    // let point = points[i]

    // const kind = i == 0 ? 'd' : i == 1 ? 'v' : 'r'
    // point = `${point}`
    // if (point > 0) {
    //   point = `+${point}`
    //   this.p.fill(THEME.teal_50)
    //   this.p.stroke(THEME.teal_50)
    // } else {
    //   this.p.fill(THEME.flame_50)
    //   this.p.stroke(THEME.flame_50)
    // }

    // this.p.text(point, x, y + i * textSize)
    // this.p.textAlign(this.p.LEFT, this.p.CENTER)
    // this.p.text(` ${kind}:pts`, x, y + i * textSize)
    // this.p.textAlign(this.p.RIGHT, this.p.CENTER)
    // }
    let totalPoints = points.reduce((a, b) => a + b, 0)
    if (totalPoints > 0) {
      totalPoints = `+${totalPoints}`
      const colorHSL = body.c.baddie
      let coreColor = `hsl(${colorHSL[0]},${colorHSL[1]}%,${colorHSL[2]}%)`
      const darker = `hsl(${colorHSL[0]},${colorHSL[1]}%,${colorHSL[2] - 10}%)`
      this.p.fill(coreColor)
      this.p.stroke(darker)
    } else {
      this.p.fill(THEME.flame_50)
      this.p.stroke(THEME.flame_50)
    }
    this.p.text(totalPoints, x, y)
  },

  star(x, y, radius1, radius2, npoints, color, rotateBy, index) {
    const { p } = this
    let angle = p.TWO_PI / npoints
    let halfAngle = angle / 2.0
    p.beginShape()
    if (index == 0) {
      p.fill(color)
    } else {
      p.noFill()
      p.strokeWeight(THEME.borderWt)
      p.stroke(color)
    }
    for (let a = rotateBy; a < p.TWO_PI + rotateBy; a += angle) {
      let sx = x + p.cos(a) * radius2
      let sy = y + p.sin(a) * radius2
      p.vertex(sx, sy)
      sx = x + p.cos(a + halfAngle) * radius1
      sy = y + p.sin(a + halfAngle) * radius1
      p.vertex(sx, sy)
    }
    p.endShape(p.CLOSE)
    return p
  },

  drawMissiles() {
    if (
      this.introStage !== this.totalIntroStages - 1 &&
      (this.paused || this.gameOver)
    )
      return
    this.p.noStroke()
    this.p.strokeWeight(0)

    // Draw current active missiles as 3D silver balls
    for (let i = 0; i < this.missiles.length; i++) {
      const missile = this.missiles[i]
      if (missile.radius > 0) {
        this.p.push()
        this.p.translate(missile.position.x, missile.position.y)
        this.draw3DSilverBall(missile.radius)
        this.p.pop()
      }
    }

    // Remove trailing stars - no longer drawing fading trail missiles
  },

  isMissileClose(body) {
    const minDistance = 300
    let closeEnough = false
    for (let i = 0; i < this.missiles.length; i++) {
      const missile = this.missiles[i]
      const distance = this.p.dist(
        body.position.x,
        body.position.y,
        missile.position.x,
        missile.position.y
      )
      if (distance < minDistance) {
        closeEnough = true
        break
      }
    }
    return closeEnough
  },

  drawImageAsset(
    cat,
    id,
    width,
    { fill, strokeColor, strokeWidth, maxWidth } = {}
  ) {
    maxWidth = maxWidth || width
    const ref = cat + id + fill + maxWidth
    this.imgAssets ||= {}
    const loaded = this.imgAssets[ref]
    if (!loaded) {
      let svg = svgs[cat][id]
      this.imgAssets[ref] = 'loading'
      svg = fill ? replaceAttribute(svg, 'fill', fill) : svg
      svg = strokeColor ? replaceAttribute(svg, 'stroke', strokeColor) : svg
      svg = replaceAttribute(svg, 'width', maxWidth * this.pixelDensity)
      svg = replaceAttribute(svg, 'height', maxWidth * this.pixelDensity)
      svg = strokeWidth
        ? replaceAttribute(svg, 'stroke-width', strokeWidth)
        : svg
      svg = 'data:image/svg+xml,' + encodeURIComponent(svg)
      try {
        this.p.loadImage(svg, (img) => {
          // const width = img.width
          // const height = img.height

          // const foo = this.p.createGraphics(width, height)
          // foo.pixelDensity(this.pixelDensity)

          // foo.image(img, 0, 0, width, height)
          this.imgAssets[ref] = img
        })
      } catch (e) {
        console.error(e)
        this.imgAssets[ref] = undefined
      }
    }

    if (loaded && loaded !== 'loading') {
      this.p.image(loaded, -width / 2, -width / 2, width, width)
    }
  },
  closeTo(body) {
    const bodies =
      this.introStage < this.totalIntroStages && this.introBodies
        ? this.introBodies
        : this.bodies
    let isClose = false
    const minDistance = body.radius * 2
    for (let i = 1; i < bodies.length; i++) {
      const other = bodies[i]
      if (other.radius == 0) continue
      const specificDistance = minDistance + other.radius * 4
      const distance = this.p.dist(
        body.position.x,
        body.position.y,
        other.position.x,
        other.position.y
      )
      if (distance <= specificDistance) {
        isClose = true
        break
      }
    }
    return isClose
  },

  drawFaceSvg(body, width) {
    const baddiesNear = this.closeTo(body)
    if (
      (baddiesNear && !this.paused) ||
      (this.gameOver && !this.won && !this.skipAhead) ||
      body.cry
    ) {
      this.drawImageAsset('FACE_SHOT_SVGS', body.c.fIndex, width)
      return
    }

    const x = 5 // every 5 seconds it blinks
    const m = this.P5_FPS // for 25 frames (1 second)
    // uncomment the following line to rotate face
    // this.p.push()
    // this.p.rotate(body.velocity.heading() + this.p.PI / 2)
    if (
      Math.floor(this.p5Frames / x) % m == 0 ||
      Math.floor(this.p5Frames / x) % m == 2
    ) {
      this.drawImageAsset('FACE_BLINK_SVGS', body.c.fIndex, width)
    } else {
      this.drawImageAsset('FACE_SVGS', body.c.fIndex, width)
    }
    // this.p.pop()
  },

  drawStarForegroundSvg(width, body) {
    this.p.push()
    const r = {
      ...rot.fg,
      ...(rotOverride?.fg?.[body.c.fgIndex] ?? {})
    }
    const rotateBy =
      r.speed == 0
        ? 0
        : (this.p5Frames / this.P5_FPS_MULTIPLIER / r.speed) % 360
    this.p.rotate(r.direction * rotateBy)
    this.drawImageAsset('FG_SVGS', body.c.fgIndex, width, { fill: body.c.fg })
    this.p.pop()
  },

  drawCoreSvg(width, body) {
    this.p.push()
    const r = {
      ...rot.core,
      ...(rotOverride?.core?.[0] ?? {})
    }
    const rotateBy =
      r.speed == 0
        ? 0
        : (this.p5Frames / this.P5_FPS_MULTIPLIER / r.speed) % 360
    this.p.rotate(r.direction * rotateBy)
    this.drawImageAsset('CORE_SVGS', 0, width, { fill: body.c.core })
    this.p.pop()
  },

  drawStarBackgroundSvg(width, body) {
    this.p.push()
    const r = {
      ...rot.bg,
      ...(rotOverride?.bg?.[body.c.bgIndex] ?? {})
    }
    const rotateBy =
      r.speed == 0
        ? 0
        : (this.p5Frames / this.P5_FPS_MULTIPLIER / r.speed) % 360
    this.p.rotate(r.direction * rotateBy)
    this.drawImageAsset('BG_SVGS', body.c.bgIndex, width, { fill: body.c.bg })
    this.p.pop()
  },

  exportBody(
    day,
    shouldRotate = true,
    width = this.windowWidth,
    height = this.windowHeight
  ) {
    // const graphic = this.p.createGraphics(width, height)
    // if (!this.starBG) {
    //   throw new Error('no starbg')
    // }

    // const starBGpixelData = this.starBG.drawingContext.getImageData(
    //   0,
    //   0,
    //   width,
    //   height
    // ).data

    const bodyData = this.generateLevelData(day, 1)
    const bodies = bodyData.map((b) => this.bodyDataToBodies.call(this, b, day))
    const heroBody = bodies[0]

    // create an SVG element with a black background
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    svg.setAttribute('width', width)
    svg.setAttribute('height', height)
    svg.setAttribute('day', day)
    svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg')
    svg.setAttribute('xmlns:xlink', 'http://www.w3.org/1999/xlink')
    svg.setAttribute('viewBox', `0 0 ${width} ${height}`)
    svg.setAttribute('version', '1.1')
    // make svg have a black background
    // const bgRect = document.createElementNS(
    //   'http://www.w3.org/2000/svg',
    //   'rect'
    // )
    // bgRect.setAttribute('x', 0)
    // bgRect.setAttribute('y', 0)
    // bgRect.setAttribute('width', width)
    // bgRect.setAttribute('height', height)
    // bgRect.setAttribute('fill', 'black')
    // svg.appendChild(bgRect)

    // add starBGpixelData as PNG to the SVG
    // const starBG = document.createElementNS(
    //   'http://www.w3.org/2000/svg',
    //   'image'
    // )
    // starBG.setAttribute('x', 0)
    // starBG.setAttribute('y', 0)
    // starBG.setAttribute('width', width)
    // starBG.setAttribute('height', height)
    // starBG.setAttribute('href', this.starBG.canvas.toDataURL('image/png'))
    // svg.appendChild(starBG)

    // add hero body to the SVG
    const bgIndex = heroBody.c.bgIndex
    const coreIndex = heroBody.c.coreIndex
    const fgIndex = heroBody.c.fgIndex
    const faceIndex = heroBody.c.fIndex
    const prefix = (svg) => `data:image/svg+xml;base64,${btoa(svg)}`

    const bgSVG = prefix(
      replaceAttribute(BG_SVGS[bgIndex], 'fill', heroBody.c.bg)
    )
    const coreSVG = prefix(
      replaceAttribute(CORE_SVGS[coreIndex], 'fill', heroBody.c.core)
    )

    const fgSVG = prefix(
      replaceAttribute(FG_SVGS[fgIndex], 'fill', heroBody.c.fg)
    )
    const faceSVG = prefix(FACE_SVGS[faceIndex])

    const uuid = () => Math.random().toString(36).substr(2, 9)
    const bgId = `bg-${bgIndex}-${uuid()}`
    const coreId = `core-${coreIndex}-${uuid()}`
    const fgId = `fg-${fgIndex}-${uuid()}`
    const faceId = `f-${faceIndex}-${uuid()}`

    const bgRatio = 1
    const coreRatio = 0.375
    const fgRatio = 1
    const faceRatio = 1

    // add the svg elements to the parent svg
    const bg = document.createElementNS('http://www.w3.org/2000/svg', 'image')
    const bgWidth = width * bgRatio
    const bgHeight = height * bgRatio
    const bgOffset = (width - bgWidth) / 2
    const bgYOffset = (height - bgHeight) / 2
    bg.setAttribute('id', bgId)
    bg.setAttribute('x', bgOffset)
    bg.setAttribute('y', bgYOffset)
    bg.setAttribute('width', bgWidth)
    bg.setAttribute('height', bgHeight)
    bg.setAttribute('href', bgSVG)
    svg.appendChild(bg)

    const core = document.createElementNS('http://www.w3.org/2000/svg', 'image')
    const coreWidth = width * coreRatio
    const coreHeight = height * coreRatio
    const coreOffset = (width - coreWidth) / 2
    const coreYOffset = (height - coreHeight) / 2
    core.setAttribute('id', coreId)
    core.setAttribute('x', coreOffset)
    core.setAttribute('y', coreYOffset)
    core.setAttribute('width', coreWidth)
    core.setAttribute('height', coreHeight)
    core.setAttribute('href', coreSVG)
    svg.appendChild(core)

    const fg = document.createElementNS('http://www.w3.org/2000/svg', 'image')
    const fgWidth = width * fgRatio
    const fgHeight = height * fgRatio
    const fgOffset = (width - fgWidth) / 2
    const fgYOffset = (height - fgHeight) / 2
    fg.setAttribute('id', fgId)
    fg.setAttribute('x', fgOffset)
    fg.setAttribute('y', fgYOffset)
    fg.setAttribute('width', fgWidth)
    fg.setAttribute('height', fgHeight)
    fg.setAttribute('href', fgSVG)
    svg.appendChild(fg)

    const face = document.createElementNS('http://www.w3.org/2000/svg', 'image')
    const faceWidth = width * faceRatio
    const faceHeight = height * faceRatio
    const faceOffset = (width - faceWidth) / 2
    const faceYOffset = (height - faceHeight) / 2
    face.setAttribute('id', faceId)
    face.setAttribute('x', faceOffset)
    face.setAttribute('y', faceYOffset)
    face.setAttribute('width', faceWidth)
    face.setAttribute('height', faceHeight)
    face.setAttribute('href', faceSVG)
    svg.appendChild(face)
    if (shouldRotate) {
      const fgSpin = {
        ...rot.fg,
        ...(rotOverride?.fg?.[fgIndex] ?? {})
      }
      const fgAnimation = fgSpin.direction < 0 ? 'fullRotateR' : 'fullRotate'
      const fgSpeed = (fgSpin.speed / 3).toFixed(2)

      const bgSpin = {
        ...rot.bg,
        ...(rotOverride?.bg?.[bgIndex] ?? {})
      }
      const bgAnimation = bgSpin.direction < 0 ? 'fullRotateR' : 'fullRotate'
      const bgSpeed = (bgSpin.speed / 3).toFixed(2)

      const coreSpin = {
        ...rot.core
      }
      const coreAnimation = 'fullRotate'
      const coreSpeed = (coreSpin.speed / 3).toFixed(2)
      // add css to the svg that makes each element rotate
      const css = document.createElement('style')
      css.innerHTML = `
@keyframes fullRotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@keyframes fullRotateR {
  from {
    transform: rotate(360deg);
  }
  to {
    transform: rotate(0deg);
  }
}
#${bgId} {
  animation: ${bgAnimation} ${bgSpeed}s linear infinite;
  transform-origin: center center; 
}
#${coreId} {
  animation: ${coreAnimation} ${coreSpeed}s linear infinite;
  transform-origin: center center; 
}
#${fgId} {
  animation: ${fgAnimation} ${fgSpeed}s linear infinite;
  transform-origin: center center; 
}`
      svg.appendChild(css)
    }
    return svg
  },

  drawBody(body, isGhost = false) {
    if (body.radius == 0) {
      return
    }
    this.p.push()
    this.p.translate(body.position.x, body.position.y)
    if (body.bodyIndex === 0 || body.hero) {
      // draw hero
      const size = Math.floor(body.radius * BODY_SCALE * 2.66)

      // this.drawStarBackgroundSvg(size, body)
      if (!body.backgroundOnly) {
        this.drawCoreSvg(body.radius * BODY_SCALE, body)
      }
      this.drawStarForegroundSvg(size, body)

      if (!body.backgroundOnly) {
        this.drawFaceSvg(body, size)
      }
    } else {
      this.drawBaddie(body, isGhost)
    }
    this.p.pop()
  },

  async drawBodies() {
    if (this.won && (!this.celebrating || this.skipAhead)) return
    if (this.paused) return

    // Draw baddies first (bodyIndex > 0)
    for (let i = 0; i < this.bodies.length; i++) {
      const body = this.bodies[i]
      if (body.radius == 0 || body.bodyIndex === 0) continue
      this.drawBody(body)
    }

    // Draw hero body last (bodyIndex === 0) so it appears in front
    for (let i = 0; i < this.bodies.length; i++) {
      const body = this.bodies[i]
      if (body.radius == 0 || body.bodyIndex !== 0) continue
      this.drawBody(body)
    }
  },

  drawPauseBodies({ fleeDuration = 1 }) {
    for (let i = 0; i < this.pauseBodies.length; i++) {
      const body = this.pauseBodies[i]
      // after final proof is sent, don't draw upgradable bodies
      if (body.radius == 0) continue

      // calculate x and y wobble factors based on this.p5Frames to make the pause bodies look like they're bobbing around
      const xWobble =
        this.p.sin(this.p.frameCount / this.P5_FPS) * (10 + body.bodyIndex)
      const yWobble =
        this.p.cos(this.p.frameCount / this.P5_FPS + body.bodyIndex * 3) *
        (16 + body.bodyIndex)

      // Scale positions from original 1000x1000 to new game dimensions
      const scaleX = this.gameWidth / 1000
      const scaleY = this.gameHeight / 1000
      const scaledX = body.position.x * scaleX
      const scaledY = body.position.y * scaleY

      // if not paused, bodies flee (using vx/vy values additively)
      const xFlee =
        this.willUnpause && this.beganUnpauseAt
          ? this.p.map(
              this.p5Frames - this.beganUnpauseAt,
              0,
              this.P5_FPS * fleeDuration,
              0,
              PAUSE_BODY_DATA[i].exitX * scaleX
            )
          : 0
      const yFlee =
        this.willUnpause && this.beganUnpauseAt
          ? this.p.map(
              this.p5Frames - this.beganUnpauseAt,
              0,
              this.P5_FPS * fleeDuration,
              0,
              PAUSE_BODY_DATA[i].exitY * scaleY
            )
          : 0

      const bodyCopy = {
        bodyIndex: body.bodyIndex,
        hero: !i,
        c: body.c,
        radius: body.radius,
        velocity: this.p.createVector(body.velocity.x, body.velocity.y),
        position: this.p.createVector(
          scaledX + xWobble + xFlee,
          scaledY + yWobble + yFlee
        )
      }

      this.drawBody(bodyCopy)
    }
  },

  replaceOpacity(c, opacity) {
    const isHSLA = c.includes('hsla')
    const isHSL = c.includes('hsl')
    if (isHSL && !isHSLA) {
      let cc = c.replace('hsl', 'hsla')
      cc = cc.replace(')', `,${opacity})`)
      console.log({ c, cc })
      return cc
    }
    const prefix = isHSLA ? 'hsla' : 'rgba'
    let cc = c
      .split(',')
      .map((c) => parseFloat(c.replace(')', '').replace(prefix + '(', '')))
    if (cc.length !== 4) {
      throw new Error('Color must have alpha value format, instead it has ' + c)
    }
    cc[3] = opacity
    if (isHSLA) {
      cc[1] = cc[1] + '%'
      cc[2] = cc[2] + '%'
    }
    return `${prefix}(${cc.join(',')})`
  },

  brighten(c, amount = 20) {
    const prefix = c.length == 4 ? 'hsla' : 'hsl'
    const cc = [...c]
    cc[2] = cc[2] + amount
    cc[1] = cc[1] + '%'
    cc[2] = cc[2] + '%'
    return `${prefix}(${cc.join(',')})`
  },

  drawBaddie(body, isGhost = false) {
    const colorHSL = body.c.baddie
    const ballRadius = (body.radius / 2) * BODY_SCALE // Use radius directly, not divided by 2

    this.p.push()

    if (isGhost) {
      this.p.tint(255, 64) // Make ghost baddies semi-transparent
    }

    // Draw colored 3D ball instead of baddie sprite
    this.draw3DColoredBall(ballRadius, colorHSL, isGhost)

    this.p.pop()
  },

  draw3DColoredBall(radius, colorHSL, isGhost = false, isFlashing = false) {
    const { p } = this
    const ballRadius = radius // This should match the hitbox exactly
    let baseColor = `hsl(${colorHSL[0]},${colorHSL[1]}%,${colorHSL[2]}%)`
    let highlightColor = `hsl(${colorHSL[0]},${Math.min(100, colorHSL[1] + 20)}%,${Math.min(100, colorHSL[2] + 30)}%)`
    let shineColor = `hsl(${colorHSL[0]},${Math.max(0, colorHSL[1] - 30)}%,${Math.min(100, colorHSL[2] + 60)}%)`

    // Apply flashing effect if needed
    if (isFlashing) {
      const flash = Math.floor(this.p5Frames / 10) % 2 === 0
      if (flash) {
        baseColor = 'white'
        highlightColor = '#EEEEEE'
        shineColor = '#FFFFFF'
      }
    }

    p.push()

    // Main ball body - outer circle matches hitbox radius exactly
    p.fill(baseColor)
    p.noStroke()
    if (isGhost) {
      p.fill(baseColor.replace(')', ', 0.25)').replace('hsl', 'hsla'))
    }
    p.circle(0, 0, ballRadius * 2) // diameter = radius * 2, so outer edge is at ballRadius

    // Highlight for 3D effect - smaller circle within the main ball
    p.fill(highlightColor)
    if (isGhost) {
      p.fill(highlightColor.replace(')', ', 0.25)').replace('hsl', 'hsla'))
    }
    p.circle(-ballRadius * 0.3, -ballRadius * 0.3, ballRadius * 1.2) // Still within main ball

    // Small bright highlight for shininess - smallest circle
    p.fill(shineColor)
    if (isGhost) {
      p.fill(shineColor.replace(')', ', 0.25)').replace('hsl', 'hsla'))
    }
    p.circle(-ballRadius * 0.4, -ballRadius * 0.4, ballRadius * 0.6) // Smallest highlight

    p.pop()
  },

  colorArrayToTxt(cc) {
    // let cc = baseColor.map(c => c + start + (chunk * i))
    cc.push(this.opac)
    cc = `hsla(${cc.join(',')})`
    return cc
  },

  createVector(x, y) {
    if (this.p) {
      return this.p.createVector(x, y)
    } else {
      return { x, y }
    }
  },

  frameRate() {
    this.lastFrameRateCheckAt ||= { frames: this.frames, time: Date.now() }
    this.lastFrameRate ||= 0

    if (this.frames - this.lastFrameRateCheckAt.frames > 30) {
      const diff = Date.now() - this.lastFrameRateCheckAt.time
      this.lastFrameRate =
        ((this.frames - this.lastFrameRateCheckAt.frames) / diff) * 1000
      this.lastFrameRateCheckAt = { frames: this.frames, time: Date.now() }
    }

    return this.lastFrameRate
  },

  async shareCanvas(showPopup = true) {
    const file = this.shareCanvasBlob
    if (!file) throw new Error('Nothing available to share!')
    let copySuccess = false
    if (navigator.clipboard && navigator.clipboard.write) {
      try {
        console.log('trying to copy canvas to clipboard...')
        await navigator.clipboard.write([
          new ClipboardItem({ 'image/png': file })
        ])
        const msg = 'Copied results to your clipboard.'
        copySuccess = true
        if (showPopup) {
          this.popup = {
            header: 'Go Share!',
            body: ['Copied results to your clipboard.'],
            fg: THEME.pink_50,
            bg: THEME.pink_75,
            buttons: [
              {
                text: 'CLOSE',
                onClick: () => {
                  this.popup = null
                }
              }
            ]
          }
        }
        return msg
      } catch (error) {
        console.error('Error copying to clipboard:', error)
        throw new Error("Couldn't copy to clipboard. Blocked by browser?")
      }
    }

    if (navigator.share && !copySuccess) {
      console.log('sharing canvas...')
      try {
        await navigator.share({ files: [file] })
        return undefined
      } catch (e) {
        // ignore user aborting
        if (e?.name === 'AbortError') return undefined
        console.error('Couldnt share via navigator', e)
        // don't throw error, try clipboard
      }
    }

    if (!showPopup) return
    this.popup = {
      header: 'Hmmm',
      body: ["Couldn't share or copy to clipboard.", 'Try again?'],
      buttons: [
        {
          text: 'CLOSE',
          onClick: () => {
            this.popup = null
          }
        }
      ]
    }
  },
  shakeScreen() {
    this.shaking ||= this.P5_FPS / 2
    this.shaking--
    const shakingAmount = 10
    const shakeX = this.p.random(-shakingAmount, shakingAmount)
    const shakeY = this.p.random(-shakingAmount, shakingAmount)
    if (this.shaking <= 0) {
      this.p.translate(0, 0)
    } else {
      this.p.translate(shakeX, shakeY)
    }
  },
  makeParticles(x, y) {
    const array = []
    const maxSpeed = 10

    const life = 25
    for (let i = 0; i < 100; i++) {
      const angle = this.p.random(0, this.p.PI / 2) - this.p.PI / 2
      const radius = this.p.random(0, maxSpeed)
      const vx = radius * this.p.cos(angle)
      const vy = radius * this.p.sin(angle)
      const px = this.p.random(-1, maxSpeed) + x
      const py = this.p.random(-maxSpeed, 1) + y
      const color = randHSL(
        themes.bodies.default['pastel_highlighter_marker'].cr
      )
      array.push({ x: px, y: py, vx, vy, life, color })
    }
    return array
  },
  drawParticles(particles) {
    for (let i = 0; i < particles.length; i++) {
      const particle = particles[i]
      if (particle.life <= 0) {
        particles.splice(i, 1)
        continue
      }
      particle.x += particle.vx
      particle.vx *= this.p.random(1, 1.01)
      particle.y += particle.vy
      particle.vy *= this.p.random(1, 1.01)
      particle.life--
      this.p.noStroke()
      const color = particle.color.replace(
        ')',
        `, ${(particle.life / 50) * 2})`
      )
      this.star(particle.x, particle.y, 6, 4, 5, color, 0, 0)
    }
    return particles
  },
  makeExplosionStart(x, y) {
    this.explosionSmoke ||= []
    const particles = this.makeParticles(x, y)
    this.explosionSmoke.push(...particles)
  },
  makeMissileStart() {
    this.gunSmoke ||= []
    const particles = this.makeParticles(this.gameWidth / 2, this.gameHeight)
    this.gunSmoke.push(...particles)
  },
  drawGunSmoke() {
    if (!this.gunSmoke) return
    if (this.gunSmoke.length == 0) return
    this.drawParticles(this.gunSmoke)
  },
  drawExplosionSmoke() {
    if (!this.explosionSmoke) return
    if (this.explosionSmoke.length == 0) return
    this.drawParticles(this.explosionSmoke)
  },

  draw3DSilverBall(radius) {
    const { p } = this
    const ballRadius = radius * 2

    // Create gradient effect for 3D appearance
    p.push()

    // Main ball body (dark silver)
    p.fill('#A0A0A0')
    p.noStroke()
    p.circle(0, 0, ballRadius * 2)

    // Highlight (bright silver)
    p.fill('#E8E8E8')
    p.circle(-ballRadius * 0.3, -ballRadius * 0.3, ballRadius * 0.8)

    // Small bright highlight for shininess
    p.fill('#FFFFFF')
    p.circle(-ballRadius * 0.4, -ballRadius * 0.4, ballRadius * 0.3)

    p.pop()
  },

  drawMissileBarrel() {
    const { p } = this
    const barrelWidth = 40 // Same as ball diameter (2 * radius 20)
    const barrelLength = 280 // Made longer (was 225)
    const maxAngle = Math.PI / 3 // 60 degrees max angle
    const angle = this.aimAngle * maxAngle

    p.push()
    // Position barrel pivot point at center bottom where missiles depart
    p.translate(this.gameWidth / 2, this.gameHeight)
    // Rotate around the bottom tip (pivot point)
    p.rotate(angle)

    // Barrel (drawn upward from pivot point at bottom)
    p.fill('#666666')
    p.stroke('#333333')
    p.strokeWeight(2)
    p.rect(-barrelWidth / 2, -barrelLength, barrelWidth, barrelLength, 5)

    // Barrel tip (at the top of the barrel)
    p.fill('#444444')
    p.rect(-barrelWidth / 2 + 2, -barrelLength, barrelWidth - 4, 8, 2)

    p.pop()
  },

  // Helper method to get barrel tip position
  getBarrelTipPosition() {
    const barrelLength = 280
    const maxAngle = Math.PI / 3 // 60 degrees max angle
    const angle = this.aimAngle * maxAngle

    const tipX = this.gameWidth / 2 + Math.sin(angle) * barrelLength
    const tipY = this.gameHeight - Math.cos(angle) * barrelLength

    return { x: tipX, y: tipY }
  },

  drawAimSlider() {
    if (this.paused || this.gameOver) return

    const { p } = this
    const sliderY = this.windowHeight - 50 // Bottom of full screen
    const sliderWidth = Math.min(400, this.windowWidth * 0.6)
    const sliderX = (this.windowWidth - sliderWidth) / 2
    const sliderHeight = 30

    p.push()

    // Slider track
    p.fill('#333333')
    p.stroke('#555555')
    p.strokeWeight(2)
    p.rect(sliderX, sliderY, sliderWidth, sliderHeight, 15)

    // Slider handle
    const handleX = sliderX + ((this.aimAngle + 1) * sliderWidth) / 2
    p.fill('#CCCCCC')
    p.stroke('#888888')
    p.strokeWeight(3)
    p.circle(handleX, sliderY + sliderHeight / 2, 40)

    // Center mark
    p.stroke('#666666')
    p.strokeWeight(2)
    p.line(
      this.windowWidth / 2,
      sliderY,
      this.windowWidth / 2,
      sliderY + sliderHeight
    )

    // Label
    p.fill('white')
    p.noStroke()
    p.textAlign(p.CENTER, p.CENTER)
    p.textSize(16)
    p.text('AIM', this.windowWidth / 2, sliderY - 20)

    p.pop()

    // Note: Mouse movement now controls aiming, so no click handler needed
  },

  drawBodyMeters() {
    if (this.paused || this.gameOver || !this.bodyMeters) return

    const { p } = this
    const meterWidth = 30
    const meterHeight = 150
    const meterSpacing = 35
    const startX = 20 // Top left instead of top right
    const startY = 20

    p.push()

    // Draw meters for body types 1-5
    for (let bodyIndex = 1; bodyIndex <= 5; bodyIndex++) {
      const meter = this.bodyMeters[bodyIndex]
      if (!meter) continue

      const x = startX + (bodyIndex - 1) * meterSpacing
      const y = startY

      // Get body color for this body type
      const bodyColor = this.getBodyColor(this.day, bodyIndex)
      const fillColor = bodyColor.baddie
        ? `hsl(${bodyColor.baddie[0]},${bodyColor.baddie[1]}%,${bodyColor.baddie[2]}%)`
        : 'white'

      // Draw meter background
      p.noFill()
      p.stroke('white')
      p.strokeWeight(2)
      p.rect(x, y, meterWidth, meterHeight)

      // Draw meter fill
      const fillHeight = (meter.meter / meter.maxMeter) * meterHeight
      if (fillHeight > 0) {
        p.noStroke()

        // Check if in bonus mode
        const inBonusMode =
          this.isBodyInBonusMode && this.isBodyInBonusMode(bodyIndex)
        if (inBonusMode) {
          // Flash between colors when in bonus mode
          const flash = Math.floor(this.p5Frames / 10) % 2 == 0
          p.fill(flash ? 'gold' : fillColor)
        } else {
          p.fill(fillColor)
        }

        p.rect(x, y + meterHeight - fillHeight, meterWidth, fillHeight)
      }

      // Draw bonus mode indicator
      if (this.isBodyInBonusMode && this.isBodyInBonusMode(bodyIndex)) {
        p.noStroke()
        p.fill('gold')
        p.textAlign(p.CENTER, p.CENTER)
        p.textFont(fonts.body)
        p.textSize(12)
        p.text('2X', x + meterWidth / 2, y - 15)
      }

      // Draw meter value text
      p.noStroke()
      p.fill('white')
      p.textAlign(p.CENTER, p.CENTER)
      p.textFont(fonts.body)
      p.textSize(10)
      p.text(meter.meter, x + meterWidth / 2, y + meterHeight + 10)
    }

    p.pop()
  },

  drawBonusModeOverlay() {
    if (this.paused || this.gameOver || !this.bodyMeters) return

    const { p } = this
    const bonusTexts = []

    // Check all body types for bonus mode and collect them
    for (let bodyIndex = 1; bodyIndex <= 5; bodyIndex++) {
      if (this.isBodyInBonusMode && this.isBodyInBonusMode(bodyIndex)) {
        // Get the color for this body type
        const bodyColor = this.getBodyColor(this.day, bodyIndex)
        const fillColor = bodyColor.baddie

        if (fillColor && fillColor.length >= 3) {
          const colorName = this.getColorName(fillColor)
          bonusTexts.push({
            text: colorName.toUpperCase(),
            color: `hsl(${fillColor[0]}, ${fillColor[1]}%, ${fillColor[2]}%)`
          })
        }
      }
    }

    // Draw bonus text indicators in top right
    if (bonusTexts.length > 0) {
      p.push()
      p.textFont(fonts.body)
      p.textSize(64) // Much bigger text
      p.textAlign(p.RIGHT, p.TOP)
      p.strokeWeight(3)

      const startX = this.gameWidth - 20
      const startY = 20
      const lineHeight = 80

      bonusTexts.forEach((bonus, index) => {
        const y = startY + index * lineHeight

        // Create flashing effect
        const flashSpeed = 10 // frames per flash
        const isFlashing = Math.floor(this.p5Frames / flashSpeed) % 2 === 0

        if (isFlashing) {
          // Draw outline for visibility
          p.stroke('black')
          p.fill('white')
          p.text(bonus.text, startX, y)

          // Draw colored text on top
          p.noStroke()
          p.fill(bonus.color)
          p.text(bonus.text, startX, y)
        }
      })

      p.pop()
    }
  },

  // Helper method to get a readable color name from HSL values
  getColorName(hslArray) {
    const hue = hslArray[0]

    if (hue >= 0 && hue < 30) return 'red'
    if (hue >= 30 && hue < 60) return 'orange'
    if (hue >= 60 && hue < 90) return 'yellow'
    if (hue >= 90 && hue < 150) return 'green'
    if (hue >= 150 && hue < 210) return 'cyan'
    if (hue >= 210 && hue < 270) return 'blue'
    if (hue >= 270 && hue < 330) return 'purple'
    if (hue >= 330 && hue <= 360) return 'red'

    return 'colored' // fallback
  },

  drawAnimatedBalls() {
    if (!this.animatedBalls || this.animatedBalls.length === 0) return

    const { p } = this
    p.push()

    // Update and draw each animated ball
    for (let i = this.animatedBalls.length - 1; i >= 0; i--) {
      const ball = this.animatedBalls[i]

      // Handle delay before ball becomes active
      if (!ball.active) {
        ball.delay--
        if (ball.delay <= 0) {
          ball.active = true
        }
        continue
      }

      // Update ball position
      ball.progress += ball.speed
      if (ball.progress >= 1) {
        // Ball reached destination, remove it
        this.animatedBalls.splice(i, 1)
        continue
      }

      // Interpolate position
      ball.currentPos.x =
        ball.startPos.x + (ball.endPos.x - ball.startPos.x) * ball.progress
      ball.currentPos.y =
        ball.startPos.y + (ball.endPos.y - ball.startPos.y) * ball.progress

      // Draw the ball
      p.push()
      p.translate(ball.currentPos.x, ball.currentPos.y)

      // Color based on type
      if (ball.type === 'positive') {
        this.draw3DSilverBall(8) // Small silver balls for positive points
      } else {
        // Red balls for negative points
        p.fill('#FF4444')
        p.stroke('#CC0000')
        p.strokeWeight(2)
        p.circle(0, 0, 16)

        // Add highlight for 3D effect
        p.fill('#FF8888')
        p.noStroke()
        p.circle(-3, -3, 8)
      }

      p.pop()
    }

    p.pop()
  },

  drawBallsCounter() {
    if (this.paused || this.gameOver) return

    const { p } = this
    p.push()

    // Draw balls counter in bottom left
    p.fill('white')
    p.noStroke()
    p.textAlign(p.LEFT, p.BOTTOM)
    p.textSize(24)

    const ballsText = `${this.currentPoints} BALLS`
    p.text(ballsText, 20, this.windowHeight - 20)

    p.pop()
  }
}
