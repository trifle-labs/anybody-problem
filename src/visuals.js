import { hslToRgb, rgbaOpacity, THEME, themes, randHSL } from './colors.js'
import { fonts, drawKernedText } from './fonts.js'
import { utils } from 'ethers'

const BODY_SCALE = 4 // match to calculations.js !!
const GAME_LENGTH_BY_LEVEL_INDEX = [30, 10, 20, 30, 40, 50]
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
    if (this.shaking && this.shaking > 0) {
      this.shakeScreen()
    } else {
      this.shaking = null
    }
    for (const key in this.buttons) {
      const button = this.buttons[key]
      button.visible = false
    }
    if (!this.showIt) return
    if (!this.firstFrame && !this.hasStarted) {
      this.hasStarted = true
      this.started()
    }

    if (
      (this.introStage >= this.totalIntroStages || this.level > 0) &&
      !this.paused &&
      this.p5Frames % this.P5_FPS_MULTIPLIER == 0
    ) {
      this.firstFrame = false
      this.frames++
      const results = this.step(this.bodies, this.missiles)
      this.bodies = results.bodies || []
      this.missiles = results.missiles || []
    }

    this.p.noFill()
    this.drawBg()

    this.p5Frames++
    this.drawExplosions()

    if (this.introStage >= this.totalIntroStages || this.level > 0) {
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
    this.drawPopup()
    if (!this.renderingCanvasToShare) this.drawGun()
    this.drawGunSmoke()
    this.drawExplosionSmoke()

    if (
      this.frames - this.startingFrame + this.FPS < this.timer &&
      this.bodies.reduce((a, c) => a + c.radius, 0) != 0
    ) {
      this.drawMissiles()
    }

    const notPaused = !this.paused
    const framesIsAtStopEveryInterval =
      (this.frames - this.startingFrame) % this.stopEvery == 0 &&
      this.p5Frames % this.P5_FPS_MULTIPLIER == 0
    const didNotJustPause = !this.justPaused

    const ranOutOfTime =
      this.frames - this.startingFrame + this.FPS >= this.timer
    const hitHeroBody = this.bodies[0].radius == 0 && this.level !== 0

    if ((ranOutOfTime || hitHeroBody) && !this.handledGameOver) {
      this.handleGameOver({ won: false, ranOutOfTime, hitHeroBody })
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
      !ranOutOfTime &&
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

    this.drawTips()
  },
  drawIntro() {
    switch (this.introStage) {
      case 0:
        this.drawIntroStage0()
        break
      case 1:
        this.drawIntroStage1()
        break
      case 2:
        this.drawIntroStage2()
        break
      case 3:
        this.drawIntroStage3()
        break
      default:
    }
  },

  drawIntroStage2() {
    if (!this.playedStage2Sound) {
      this.playedStage2Sound = true
      this.sound?.floop()
    }

    this.levelCounting ||= 0
    this.levelCounting += 1

    this.introBodies ||= [
      (() => {
        const b = JSON.parse(JSON.stringify(this.bodies[0]))
        b.velocity.x = -6.5
        b.velocity.y = 6.5
        return b
      })(),
      {
        position: { x: this.windowWidth - 100, y: 100 },
        velocity: { x: 0, y: 0 },
        radius: 42,
        c: { baddie: this.bodies[0].c.baddie }
      }
    ]
    this.introBodies.forEach((body) => {
      this.drawBody(body)
    })
    if (this.p5Frames % this.P5_FPS_MULTIPLIER == 0) {
      const results = this.step(this.introBodies, this.missiles)

      this.introBodies = results.bodies
      this.missiles = results.missiles
    }

    let w,
      text,
      fg = THEME.iris_30,
      stroke = THEME.iris_30

    const chunk_1 = 1.5 * this.P5_FPS
    const chunk_2 = 2.5 * this.P5_FPS
    const chunk_3 = 2 * this.P5_FPS
    const levelMaxTime = chunk_1 + chunk_2 + chunk_3
    if (this.levelCounting < chunk_1) {
      w = 180
      text = 'oh no !!'
    } else if (this.levelCounting < chunk_1 + chunk_2) {
      w = 523
      text = 'a BADDIE came into orbit !!'
    } else {
      w = 268
      text = 'BLAST IT !!!'
      fg = THEME.pink_50
      stroke = THEME.pink_50
    }

    if (this.introBodies[0].radius == 0 && this.introBodies[1].radius !== 0) {
      const w = 368
      const y = 780
      if (this.levelCounting > levelMaxTime) {
        this.drawTextBubble({
          text: 'oops, try again !!',
          w,
          x: this.windowWidth / 2 - w / 2,
          y,
          fg,
          stroke,
          bg: THEME.bg
        })
      }

      this.timeout ||= setTimeout(() => {
        const b = this.introBodies[0]
        b.radius = 56
        b.position = {
          x: this.windowWidth / 2,
          y: this.windowHeight / 2
        }
        b.velocity = { x: 0, y: 0 }
        b.vx = null
        b.vy = null
        b.px = null
        b.py = null
        this.explosions = []
        clearTimeout(this.timeout)
        this.timeout = null
      }, 3000)
    }

    if (this.levelCounting < levelMaxTime && this.introBodies[0].radius > 0) {
      const y = 780
      this.drawTextBubble({
        text,
        w,
        x: this.windowWidth / 2 - w / 2,
        y,
        fg,
        stroke,
        bg: THEME.bg
      })
    } else if (this.introBodies[1].radius == 0) {
      const w = 330
      const y = 780
      const text = "NICE - let's go !"
      this.drawTextBubble({
        text,
        w,
        x: this.windowWidth / 2 - w / 2,
        y,
        fg: THEME.iris_30,
        stroke: THEME.iris_30,
        bg: THEME.bg
      })

      this.timeout ||= setTimeout(() => {
        this.introStage++
        clearTimeout(this.timeout)
        this.timeout = null
        this.skipAhead = true
        this.handleGameOver({ won: true })
        this.playedIntro = true
      }, 3000)
    }
  },

  drawIntroStage1() {
    if (!this.playedStage1Sound) {
      this.playedStage1Sound = true
      this.sound?.twinkle()
    }
    this.levelCountdown ||= 250
    this.levelCountdown -= 1
    const baddie = {
      position: {
        x: this.windowWidth / 2,
        y: this.windowHeight / 2
      },
      velocity: this.createVector(0, 0),
      radius: 80,
      backgroundOnly: true,
      c: { baddie: [0, 0, 120, 1] }
    }
    this.p.push()
    this.p.translate(baddie.position.x, baddie.position.y)
    this.drawBaddie(baddie)
    this.p.pop()

    const body = this.bodies[0]
    this.drawBody(body)

    const w = 268
    const y = 780
    // const rateCheck = 50
    // const rate = this.p5Frames % rateCheck
    // const numberOfDots =
    // rate < rateCheck / 3 ? '.' : rate < rateCheck * (2 / 3) ? '..' : '...'
    this.drawTextBubble({
      text: 'a new BODY !',
      w,
      x: this.windowWidth / 2 - w / 2,
      y,
      fg: THEME.iris_30,
      stroke: THEME.iris_30,
      bg: THEME.bg
    })
    if (this.levelCountdown <= 0) {
      this.introStage++
    }
  },
  drawIntroStage0() {
    this.levelCountdown ||= 300
    this.levelCountdown -= 1
    if (this.levelCountdown > 250) return
    const maxBaddieSize = 40
    const growingSize = 84 - this.levelCountdown / 3
    const currentSize =
      growingSize > maxBaddieSize ? maxBaddieSize : growingSize
    const baddie = {
      position: { x: this.windowWidth / 2, y: this.windowHeight / 2 },
      velocity: this.createVector(0, 0),
      radius: currentSize,
      maxRadius: 40,
      c: { baddie: [0, 0, 0, 0], strokeColor: '#FFF', strokeWidth: 1.5 },
      backgroundOnly: true,
      rotationSpeedOffset: 2
    }
    const baddie2 = JSON.parse(JSON.stringify(baddie))
    baddie2.radius = currentSize * 0.74
    baddie2.rotationSpeedOffset = -1

    const baddie3 = JSON.parse(JSON.stringify(baddie))
    baddie3.radius = currentSize * 0.47
    baddie3.c.baddie = [0, 0, 120]
    baddie3.rotationSpeedOffset = 0

    this.p.push()
    this.p.translate(baddie.position.x, baddie.position.y)

    this.p.push()
    this.p.rotate(11.92)
    this.drawBaddie(baddie)
    this.p.pop()

    this.p.push()
    this.p.rotate(-13.28)
    this.drawBaddie(baddie2)
    this.p.pop()

    this.drawBaddie(baddie3)

    this.p.pop()

    // this.drawButton({
    //   text: 'a new day...',
    //   x: this.windowWidth / 2,
    //   y: 780,
    //   onClick: () => {},
    //   height: 73,
    //   width: 268,
    //   fg: [0, 0, 0, 0],
    //   bg: [0, 0, 100, 0],
    //   stroke: THEME.iris_60,
    //   disabled: true,
    //   p: this.p
    // })

    const w = 268
    const y = 780
    // const rateCheck = 50
    // const rate = this.p5Frames % rateCheck
    // const numberOfDots =
    // rate < rateCheck / 3 ? '.' : rate < rateCheck * (2 / 3) ? '..' : '...'
    if (this.levelCountdown < 125) {
      this.drawTextBubble({
        text: 'a new day...',
        w,
        x: this.windowWidth / 2 - w / 2,
        y,
        fg: THEME.iris_30,
        stroke: THEME.iris_30,
        bg: THEME.bg
        // align: [this.p.LEFT, this.p.TOP]
      })
    }
    if (this.levelCountdown <= 0) {
      this.introStage++
    }
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
    p.text(text, x + w / 2, y + (h - fz) / 2)
    p.pop()
  },

  drawTips() {
    if (
      this.introStage == this.totalIntroStages - 1 &&
      this.levelCounting >= 6 * this.P5_FPS &&
      !(this.paused || this.won || this.gameOver)
    ) {
      // how to shoot
      const { h } = this.drawTextBubble({})
      const gttr = 24
      let w = this.hasTouched ? 300 : 520
      let y = this.windowHeight - h - gttr
      this.drawTextBubble({
        text: this.hasTouched ? 'TAP to Shoot' : 'CLICK or {SPACE} to shoot',
        w,
        x: this.windowWidth / 2 - w / 2,
        y,
        fg: THEME.pink_50,
        stroke: 'transparent'
      })

      // how to reset
      // w = this.hasTouched ? 700 : 570
      // y = this.windowHeight - (h + 32)
      // this.drawTextBubble({
      //   text: this.hasTouched ? 'Tap the TIMER to restart the level'
      //   : 'Press {R} to restart the level',
      //   w,
      //   x: this.windowWidth / 2 - w / 2,
      //   y,
      //   fg: THEME.teal_50,
      //   stroke: 'transparent'
      // })
    }
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

    const unpauseDuration = this.level == 0 ? 1 : 0
    const unpauseFrames = unpauseDuration * this.P5_FPS
    if (this.willUnpause && !this.beganUnpauseAt) {
      this.willUnpause = true
      this.beganUnpauseAt = this.p5Frames
    }

    // pause and return when unpause finished
    if (this.beganUnpauseAt + unpauseFrames < this.p5Frames) {
      this.paused = false
      this.willUnpause = false
      return
    } else if (this.willUnpause) {
      // fade text out
      const fadeOutFrames = (unpauseFrames / 4) * 3
      const fadeOutStart = this.beganUnpauseAt
      const fadeOutProgress = this.p5Frames - fadeOutStart
      const fadeOut = this.p.map(fadeOutProgress, 0, fadeOutFrames, 1, 0)
      p.fill(rgbaOpacity(THEME.pink, fadeOut))
    } else {
      // draw box
      p.stroke(THEME.iris_60)
      p.strokeWeight(THEME.borderWt)
      p.noFill()
      p.rect(40, 60, 920, 860, 32, 32, 32, 32)

      // date
      p.textFont(fonts.body)
      p.textSize(52)
      const dateWidth = p.textWidth(this.date)
      const dateBgWidth = dateWidth + 48
      p.fill('black')
      p.stroke(THEME.iris_60)
      p.strokeWeight(THEME.borderWt)
      p.rect(80, 30, dateBgWidth, 60, 80)
      p.textAlign(p.LEFT, p.CENTER)
      p.fill(THEME.violet_25)
      p.noStroke()
      p.text(this.date, 80 + 48 / 2, 30 + 60 / 2)

      p.fill(THEME.pink)
    }
    // draw logo
    p.textFont(fonts.dot)
    p.textSize(180)
    p.textAlign(p.LEFT, p.TOP)
    p.noStroke()
    const titleY = 480 // this.windowHeight / 2 - 270
    drawKernedText(p, 'Anybody', 92, titleY, 0.8)
    drawKernedText(p, 'Problem', 92, titleY + 183, 2)

    this.drawPauseBodies()

    if (!this.willUnpause) {
      // play button
      this.drawButton({
        text: 'PLAY',
        onClick: () => {
          if (this.popup !== null) return
          if (!this.playerName) {
            // open connect wallet popup
            this.popup = {
              header: 'Play Onchain',
              body: [
                'Free to play!  ...or practice!',
                'Connect a wallet to validate your wins.'
              ],
              buttons: [
                {
                  text: 'PRACTICE',
                  fg: THEME.violet_50,
                  bg: THEME.violet_25,
                  stroke: THEME.violet_50,
                  onClick: () => {
                    // start practice mode
                    this.popup = null
                    this.sound?.playStart()
                    this.setPause(false)
                    this.practiceMode = true
                  }
                },
                {
                  text: 'CONNECT',
                  fg: THEME.violet_25,
                  bg: THEME.violet_50,
                  stroke: THEME.violet_50,
                  onClick: () => {
                    this.emit('connect-wallet')
                  }
                }
              ]
            }
            return
          }
          // start play
          this.sound?.playStart()
          this.setPause(false)
          this.practiceMode = false
        },
        fg: THEME.violet_50,
        bg: THEME.pink,
        width: 410,
        height: 108,
        textSize: 78,
        x: 508,
        y: 862,
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
          width: 410,
          height: 108,
          textSize: 78,
          x: 82,
          y: 862,
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
    this.p.background(THEME.bg)

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
      this.starBG = this.p.createGraphics(this.windowWidth, this.windowHeight)
      this.starBG.pixelDensity(this.pixelDensity)

      for (let i = 0; i < 200; i++) {
        this.starBG.noStroke()
        this.starBG.fill(THEME.fg)
        this.starBG.textSize(15)
        const strings = [',', '.', '*']
        this.starBG.text(
          strings[Math.floor(Math.random() * strings.length)],
          Math.floor(Math.random() * this.windowWidth),
          Math.floor(Math.random() * this.windowHeight)
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

    this.p.image(
      this.starBG,
      basicX,
      basicY,
      this.windowWidth,
      this.windowHeight
    )
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

  drawScore() {
    if (this.paused) return
    const { p } = this
    p.push()
    p.fill('white')
    p.noStroke()
    p.textAlign(p.LEFT, p.TOP)

    this.drawProblemRankingsScreen()

    const runningFrames = this.frames - this.startingFrame
    const seconds = (this.framesTook || runningFrames) / this.FPS
    const secondsLeft =
      (this.level > 5 ? 60 : GAME_LENGTH_BY_LEVEL_INDEX[this.level]) - seconds
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
      if (this.won) {
        p.textSize(this.scoreSize * 2)
        p.text(seconds.toFixed(2) + 's', 20, 0)
      } else {
        p.text(secondsLeft.toFixed(2), 20, 0)
        p.textAlign(p.RIGHT, p.TOP)
        if (this.hasTouched) {
          // draw mobile reset button over the countdown
          this.buttons['touch-timer-reset'] = {
            x: 0,
            y: 0,
            width: 200,
            height: 110,
            disabled: false,
            visible: true,
            onClick: () => {
              this.hasQuickReset = true
              this.restart(null, false)
            }
          }
        }
        // lvl
        p.text('Lvl ' + this.level, this.windowWidth - 20, 0)
        // draw mute btn in bottom right corner
        p.push()
        p.noStroke()
        p.fill('white')
        const xOffset = this.windowWidth - (this.hasTouched ? 108 : 81)
        const yOfffset = this.windowWidth - (this.hasTouched ? 116 : 87)
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
      .map((result) => result?.framesTook / this.FPS)
      .filter((l) => l !== undefined)
    const bestTimes =
      this.todaysRecords?.levels?.map((l) => l.events[0].time / this.FPS) ?? []

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
    p.text('time', timeColX, midHeadY)
    if (showBestAndDiff) {
      p.text('best', col2X, midHeadY)
      p.text('diff', col3X, midHeadY)
    }

    // middle box text - values
    const problemComplete = levelTimes.length >= LEVELS
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
      const time = i < levelTimes.length ? levelTimes[i].toFixed(2) : '-'
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
          const sign = Number(diff.toFixed(2)) > 0 ? '+' : '-'
          return sign + Math.abs(diff).toFixed(2)
        })
        .filter(Boolean)
      // best times
      for (let i = 0; i < LEVELS; i++) {
        const best = i < bestTimes.length ? bestTimes[i].toFixed(2) : '-'
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
        p.fill(/^-/.test(diff) ? THEME.lime : THEME.flame_50)
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
      const sumLine = [levelTimeSum.toFixed(2)]

      if (showBestAndDiff) {
        const bestTime = bestTimes
          .slice(0, levelTimes.length)
          .reduce((a, b) => a + b, 0)
        let diff = Number((levelTimeSum - bestTime).toFixed(2))
        sumLine[1] = bestTime.toFixed(2)
        sumLine[2] = `${diff > 0 ? '+' : '-'}${Math.abs(diff).toFixed(2)}`
      }

      const sumLineY = middleBoxY + rowHeight * Math.min(5, LEVELS)
      const sumLineHeight = 80
      const sumLineYText = sumLineY + sumLineHeight / 2
      p.textAlign(p.LEFT, p.CENTER)
      p.fill(THEME.iris_50)
      p.text(problemComplete ? 'solved in' : 'total time', 44, sumLineYText)
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
    p.text(
      this.level == 5
        ? 'YOU WON !!   save your score to the leaderboard !!'
        : `BOOM !! ... just ${5 - this.level} more levels to solve this problem !!`,
      gutter + boxW / 2,
      805,
      boxW - gutter / 2
    )

    // bottom buttons
    this.showRestart = this.level >= 2
    this.showShare = this.level >= 5
    let buttonCount = 2 + Number(this.showRestart) + Number(this.showShare)
    this.drawBottomButton({
      text: 'REDO',
      onClick: () => {
        if (this.popup !== null) return
        if (!this.hasQuickReset) {
          this.popup = {
            bg: THEME.teal_75,
            fg: THEME.teal_50,
            stroke: THEME.teal_50,
            header: 'Redo Level?',
            body: [
              'PRO TIP !!',
              this.hasTouched
                ? 'Tap the TIMER to quickly restart a level'
                : 'Press {R} to quickly restart a level'
            ],
            buttons: [
              {
                text: 'CLOSE',
                onClick: () => {
                  this.popup = null
                }
              },
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
      ...themes.buttons.teal,
      columns: buttonCount,
      column: 0
    })
    if (this.showRestart) {
      this.drawBottomButton({
        text: 'EXIT',
        onClick: () => {
          // confirm in popup
          if (this.popup !== null) return
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
      this.drawBottomButton({
        text: 'NEXT',
        onClick: () => {
          this.level++
          if (this.level > 5) {
            this.showProblemRankingsScreenAt = this.p5Frames
          } else {
            this.restart(null, false)
          }
        },
        ...themes.buttons.green,
        columns: buttonCount,
        column: buttonCount - 1
      })
    } else {
      // parent app should handle waiting to save
      this.drawBottomButton({
        text: 'SAVE',
        onClick: () => {
          if (this.practiceMode) {
            if (this.popup !== null) return
            this.popup = {
              header: 'Nice Job!',
              body: ['Next time connect a wallet to', 'mint your win!'],
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
                    this.level = 0
                    this.restart(undefined, true)
                  },
                  fg: THEME.green_75,
                  bg: THEME.green_50
                }
              ]
            }
          } else {
            this.emit('save')
          }
        },
        ...themes.buttons.green,
        columns: buttonCount,
        column: buttonCount - 1
      })
    }
    p.pop()
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
        onClick: () => this.restart(null, false),
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
          if (this.popup !== null) return
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
        onClick: () => this.restart(null, false),
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
    this.p.stroke('rgba(200,200,200,1)')
    this.p.strokeCap(this.p.SQUARE)

    if (this.p.mouseX <= 0 && this.p.mouseY <= 0) return

    // Bottom left corner coordinates
    let startX = 0
    let startY = this.windowHeight
    this.p.strokeWeight(THEME.borderWt)

    const crossHairSize = 25

    // Calculate direction from bottom left to mouse
    let dirX = this.scaleX(this.p.mouseX) - startX
    let dirY = this.scaleY(this.p.mouseY) - startY
    this.p.line(
      this.scaleX(this.p.mouseX) - crossHairSize,
      this.scaleX(this.p.mouseY),
      this.scaleX(this.p.mouseX) + crossHairSize,
      this.scaleX(this.p.mouseY)
    )
    this.p.line(
      this.scaleX(this.p.mouseX),
      this.scaleX(this.p.mouseY) - crossHairSize,
      this.scaleX(this.p.mouseX),
      this.scaleX(this.p.mouseY) + crossHairSize
    )

    if (
      (this.introStage !== this.totalIntroStages - 1 &&
        this.introStage < this.totalIntroStages &&
        this.level < 1) ||
      this.paused ||
      this.gameOver
    )
      return

    // Draw the line
    const drawingContext = this.p.canvas.getContext('2d')
    const chunk = this.windowWidth / 100
    drawingContext.setLineDash([chunk])
    if (this.aimHelper) {
      drawingContext.lineDashOffset = -(this.frames * 10)
    }

    this.p.line(startX, startY, startX + dirX, startY + dirY)
    drawingContext.setLineDash([])
    drawingContext.lineDashOffset = 0
    this.p.strokeWeight(0)
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

      this.drawBody(_explosion)
    }
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
    const starRadius = 10
    const maxLife = 60
    for (let i = 0; i < this.stillVisibleMissiles.length; i++) {
      const body = this.stillVisibleMissiles[i]
      if (!body.phase) {
        const life = 0

        const color = randHSL(
          themes.bodies.default['pastel_highlighter_marker'].cr
        )
        const rotateBy = (this.p5Frames / this.P5_FPS_MULTIPLIER) % 360
        body.phase = {
          color,
          life,
          rotateBy
        }
      } else if (!this.paused || this.introStage == this.totalIntroStages - 1) {
        body.phase.life++
        if (body.phase.life >= maxLife) {
          this.stillVisibleMissiles.splice(i, 1)
          i--
          continue
        }
      }
      this.stillVisibleMissiles[i] = body
      const rainbowColor =
        i == this.stillVisibleMissiles.length - 1 ? 'white' : body.phase.color //`rgba(${body.phase.color},${alpha})`
      const thisRadius =
        starRadius / 1.5 +
        starRadius * (((body.phase.life / 25) * body.phase.life) / 25)

      this.p.push()
      this.p.translate(body.position.x, body.position.y)
      this.star(
        0,
        0,
        thisRadius,
        thisRadius / 2,
        5,
        rainbowColor,
        body.phase.rotateBy,
        body.phase.life
      )

      this.p.pop()
    }
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

  drawBody(body) {
    if (body.radius == 0) {
      return
    }
    this.p.push()
    this.p.translate(body.position.x, body.position.y)
    if (body.bodyIndex === 0 || body.hero) {
      // draw hero
      const size = Math.floor(body.radius * BODY_SCALE * 2.66)

      this.drawStarBackgroundSvg(size, body)
      if (!body.backgroundOnly) {
        this.drawCoreSvg(body.radius * BODY_SCALE, body)
      }
      this.drawStarForegroundSvg(size, body)

      if (!body.backgroundOnly) {
        this.drawFaceSvg(body, size)
      }
    } else {
      this.drawBaddie(body)
    }
    this.p.pop()
  },

  async drawBodies() {
    if (this.won && (!this.celebrating || this.skipAhead)) return
    if (this.paused) return
    for (let i = 0; i < this.bodies.length; i++) {
      const body = this.bodies[i]
      if (body.radius == 0) continue
      this.drawBody(body)
    }
  },

  drawPauseBodies() {
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

      // if not paused, bodies should flee to the nearest side of the screen
      const fleeDuration = 1.5 // seconds
      const xFlee =
        this.willUnpause && this.beganUnpauseAt
          ? this.p.map(
              this.p5Frames - this.beganUnpauseAt,
              0,
              this.P5_FPS * fleeDuration,
              0,
              body.position.x > this.windowWidth / 2
                ? this.windowWidth + 300
                : -300
            )
          : 0
      const yFlee =
        this.willUnpause && this.beganUnpauseAt
          ? this.p.map(
              this.p5Frames - this.beganUnpauseAt,
              0,
              this.P5_FPS * fleeDuration,
              0,
              body.position.y > this.windowHeight / 2
                ? this.windowHeight + 300
                : -300
            )
          : 0

      const bodyCopy = {
        bodyIndex: body.bodyIndex,
        hero: !i,
        c: body.c,
        radius: body.radius,
        velocity: this.p.createVector(body.velocity.x, body.velocity.y),
        position: this.p.createVector(
          body.position.x + xWobble + xFlee,
          body.position.y + yWobble + yFlee
        )
      }
      this.drawBody(bodyCopy)
    }
  },

  replaceOpacity(c, opacity) {
    const isHSLA = c.includes('hsla')
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
    const cc = [...c]
    cc[2] = cc[2] + amount
    cc[1] = cc[1] + '%'
    cc[2] = cc[2] + '%'
    return `hsla(${cc.join(',')})`
  },

  drawBaddie(body) {
    const colorHSL = body.c.baddie
    const coreWidth = body.radius * BODY_SCALE
    const maxWidth = (body.maxRadius || body.radius) * BODY_SCALE
    let bgColor = this.brighten(colorHSL, -20)
    const coreColor = `hsl(${colorHSL[0]},${colorHSL[1]}%,${colorHSL[2]}%)`
    this.p.push()
    const rotationSpeedOffset = body.rotationSpeedOffset || 1
    const rotate =
      (this.p5Frames / this.P5_FPS_MULTIPLIER / (30 / rotationSpeedOffset)) %
      360
    this.p.rotate(rotate)
    let strokeColor = body.c.strokeColor
    let strokeWidth = body.c.strokeWidth
    this.drawImageAsset(
      'BADDIE_SVG',
      'bg',
      Math.floor(coreWidth * (310 / 111.2)),
      {
        fill: bgColor,
        strokeColor,
        strokeWidth,
        maxWidth: Math.floor(maxWidth * (310 / 111.2))
      }
    )
    this.p.push()
    const heading = this.level == 0 ? -this.p.PI / 2 : body.velocity.heading()
    this.p.rotate(-rotate + heading + this.p.PI / 2)
    if (!body.backgroundOnly) {
      this.drawImageAsset('BADDIE_SVG', 'core', coreWidth, { fill: coreColor })

      // pupils always looking at missile, if no missile, look at mouse
      const target =
        this.missiles.length > 0
          ? this.missiles[0].position
          : { x: this.scaleX(this.p.mouseX), y: this.scaleY(this.p.mouseY) }

      const bx = body.position.x
      const by = body.position.y

      const leftEye = [-body.radius * 0.6, -body.radius * 0.15]
      const rightEye = [body.radius * 0.6, -body.radius * 0.15]

      this.p.fill('white')
      this.p.strokeWeight(1)
      this.p.stroke('black')
      this.p.circle(leftEye[0], leftEye[1], body.radius)
      this.p.circle(rightEye[0], rightEye[1], body.radius)

      const angle =
        Math.atan2(target.y - by, target.x - bx) - heading - this.p.PI / 2

      const distance = body.radius * 0.2
      const leftX = distance * Math.cos(angle)
      const leftY = distance * Math.sin(angle)

      this.p.fill('black')
      this.p.circle(leftX + leftEye[0], leftY + leftEye[1], body.radius * 0.5)
      this.p.circle(leftX + rightEye[0], leftY + rightEye[1], body.radius * 0.5)
    }

    this.p.pop()
    this.p.pop()
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

  shareCanvas(showPopup = true) {
    const canvas = this.p.canvas

    // draw the canvas without croshair before rendering
    this.renderingCanvasToShare = true
    this.draw()

    return new Promise((resolve, reject) => {
      canvas.toBlob(async (blob) => {
        const file = new File([blob], 'p5canvas.png', { type: 'image/png' })

        if (navigator.share) {
          console.log('sharing canvas...')
          await navigator
            .share({
              files: [file]
            })
            .catch((error) => {
              console.error('Error sharing:', error)
              reject(error)
            })
          this.renderingCanvasToShare = false
          resolve()
        } else if (navigator.clipboard && navigator.clipboard.write) {
          try {
            console.log('writing canvas to clipboard...')
            await navigator.clipboard.write([
              new ClipboardItem({ 'image/png': blob })
            ])
            const msg = 'Copied results to your clipboard.'
            if (showPopup) {
              this.popup = {
                header: 'Go Share!',
                body: [msg],
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
            this.renderingCanvasToShare = false
            resolve(msg)
          } catch (error) {
            console.error('Error copying to clipboard:', error)
            this.popup = {
              header: 'Hmmm',
              body: ['Couldn’t copy results to your clipboard.'],
              buttons: [
                {
                  text: 'CLOSE',
                  onClick: () => {
                    this.popup = null
                  }
                }
              ]
            }
            this.renderingCanvasToShare = false
            reject(error)
          }
        } else {
          const error = new Error('no options to share canvas!')
          console.error(error)
          this.renderingCanvasToShare = false
          reject(error)
        }
      }, 'image/png')
    })
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
    const particles = this.makeParticles(0, this.windowHeight)
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
  }
}
