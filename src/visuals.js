import { hslToRgb, THEME } from './colors.js'
import { fonts, drawKernedText } from './fonts.js'

const BODY_SCALE = 4 // match to calculations.js !!
const WITHERING_STEPS = 3000
const GAME_LENGTH_BY_LEVEL_INDEX = [10, 20, 30, 40, 50]

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

const BG_SVGS = [
  new URL('/public/bodies/bgs/bg1.svg', import.meta.url).href,
  new URL('/public/bodies/bgs/bg2.svg', import.meta.url).href,
  new URL('/public/bodies/bgs/bg3.svg', import.meta.url).href,
  new URL('/public/bodies/bgs/bg4.svg', import.meta.url).href,
  new URL('/public/bodies/bgs/bg5.svg', import.meta.url).href,
  new URL('/public/bodies/bgs/bg6.svg', import.meta.url).href,
  new URL('/public/bodies/bgs/bg7.svg', import.meta.url).href,
  new URL('/public/bodies/bgs/bg8.svg', import.meta.url).href,
  new URL('/public/bodies/bgs/bg9.svg', import.meta.url).href,
  new URL('/public/bodies/bgs/bg10.svg', import.meta.url).href
]

const FG_SVGS = [
  new URL('/public/bodies/fgs/fg1.svg', import.meta.url).href,
  new URL('/public/bodies/fgs/fg2.svg', import.meta.url).href,
  new URL('/public/bodies/fgs/fg3.svg', import.meta.url).href,
  new URL('/public/bodies/fgs/fg4.svg', import.meta.url).href,
  new URL('/public/bodies/fgs/fg5.svg', import.meta.url).href,
  new URL('/public/bodies/fgs/fg6.svg', import.meta.url).href,
  new URL('/public/bodies/fgs/fg7.svg', import.meta.url).href,
  new URL('/public/bodies/fgs/fg8.svg', import.meta.url).href,
  new URL('/public/bodies/fgs/fg9.svg', import.meta.url).href,
  new URL('/public/bodies/fgs/fg10.svg', import.meta.url).href
]

const FACE_SVGS = [
  new URL('/public/bodies/faces/face1.svg', import.meta.url).href,
  new URL('/public/bodies/faces/face2.svg', import.meta.url).href,
  new URL('/public/bodies/faces/face3.svg', import.meta.url).href,
  new URL('/public/bodies/faces/face4.svg', import.meta.url).href,
  new URL('/public/bodies/faces/face5.svg', import.meta.url).href,
  new URL('/public/bodies/faces/face6.svg', import.meta.url).href,
  new URL('/public/bodies/faces/face7.svg', import.meta.url).href,
  new URL('/public/bodies/faces/face8.svg', import.meta.url).href,
  new URL('/public/bodies/faces/face9.svg', import.meta.url).href,
  new URL('/public/bodies/faces/face10.svg', import.meta.url).href,
  new URL('/public/bodies/faces/face11.svg', import.meta.url).href,
  new URL('/public/bodies/faces/face12.svg', import.meta.url).href,
  new URL('/public/bodies/faces/face13.svg', import.meta.url).href,
  new URL('/public/bodies/faces/face14.svg', import.meta.url).href
]

// const FACE_DISTRESS_SVGS = [
//   new URL('/public/bodies/faces_distress/1.svg', import.meta.url).href,
//   new URL('/public/bodies/faces_distress/2.svg', import.meta.url).href,
//   new URL('/public/bodies/faces_distress/3.svg', import.meta.url).href
// ]

// const FACE_CRY_SVGS = [
//   new URL('/public/bodies/faces_cry/1.svg', import.meta.url).href,
//   new URL('/public/bodies/faces_cry/2.svg', import.meta.url).href,
//   new URL('/public/bodies/faces_cry/3.svg', import.meta.url).href
// ]

const FACE_BLINK_SVGS = [
  new URL('/public/bodies/faces_blink/1.svg', import.meta.url).href,
  new URL('/public/bodies/faces_blink/2.svg', import.meta.url).href,
  new URL('/public/bodies/faces_blink/3.svg', import.meta.url).href,
  new URL('/public/bodies/faces_blink/4.svg', import.meta.url).href,
  new URL('/public/bodies/faces_blink/5.svg', import.meta.url).href,
  new URL('/public/bodies/faces_blink/6.svg', import.meta.url).href,
  new URL('/public/bodies/faces_blink/7.svg', import.meta.url).href,
  new URL('/public/bodies/faces_blink/8.svg', import.meta.url).href,
  new URL('/public/bodies/faces_blink/9.svg', import.meta.url).href,
  new URL('/public/bodies/faces_blink/10.svg', import.meta.url).href,
  new URL('/public/bodies/faces_blink/11.svg', import.meta.url).href,
  new URL('/public/bodies/faces_blink/12.svg', import.meta.url).href,
  new URL('/public/bodies/faces_blink/13.svg', import.meta.url).href,
  new URL('/public/bodies/faces_blink/14.svg', import.meta.url).href
]
const FACE_SHOT_SVGS = [
  new URL('/public/bodies/faces_shot/1.svg', import.meta.url).href,
  new URL('/public/bodies/faces_shot/2.svg', import.meta.url).href,
  new URL('/public/bodies/faces_shot/3.svg', import.meta.url).href,
  new URL('/public/bodies/faces_shot/4.svg', import.meta.url).href,
  new URL('/public/bodies/faces_shot/5.svg', import.meta.url).href,
  new URL('/public/bodies/faces_shot/6.svg', import.meta.url).href,
  new URL('/public/bodies/faces_shot/7.svg', import.meta.url).href,
  new URL('/public/bodies/faces_shot/8.svg', import.meta.url).href,
  new URL('/public/bodies/faces_shot/9.svg', import.meta.url).href,
  new URL('/public/bodies/faces_shot/10.svg', import.meta.url).href,
  new URL('/public/bodies/faces_shot/11.svg', import.meta.url).href,
  new URL('/public/bodies/faces_shot/12.svg', import.meta.url).href,
  new URL('/public/bodies/faces_shot/13.svg', import.meta.url).href,
  new URL('/public/bodies/faces_shot/14.svg', import.meta.url).href
]

const CORE_SVGS = [
  new URL('/public/bodies/cores/core-zigzag-lg.svg', import.meta.url).href
]

const BADDIE_SVG = {
  bg: new URL('/public/baddies/baddie-bg.svg', import.meta.url).href,
  core: new URL('/public/baddies/baddie-core.svg', import.meta.url).href,
  face: new URL('/public/baddies/baddie-face.svg', import.meta.url).href
}

const replaceAttribute = (string, key, color) =>
  string.replaceAll(
    new RegExp(`${key}="(?!none)([^"]+)"`, 'g'),
    `${key}="${color}"`
  )

export const Visuals = {
  async draw() {
    if (!this.showIt) return
    if (this.bodies.length < 1) {
      this.p.textSize(40)
      this.p.text('Use the panel to the right to add Bodies -> -> ->', 100, 400)
      this.p.text('(You need minimum 1 Bodies in your Problem)', 100, 500)
      this.setPause(true)
      return
    }
    if (!this.firstFrame && !this.hasStarted) {
      this.hasStarted = true
      this.started()
    }

    if (!this.paused) {
      this.frames++
      const results = this.step(this.bodies, this.missiles)
      this.bodies = results.bodies || []
      this.missiles = results.missiles || []
    }

    this.p.noFill()
    // this.p.textFont('Instrument Serif, serif')
    this.drawBg()
    if (this.globalStyle == 'psycho') {
      this.p.blendMode(this.p.DIFFERENCE)
    }
    // this.drawTails()

    if (this.globalStyle == 'psycho') {
      this.p.blendMode(this.p.BLEND)
    }

    // if (
    //   this.mode == 'game' &&
    //   this.target == 'inside' &&
    //   !this.firstFrame &&
    //   this.globalStyle !== 'psycho'
    // ) {
    //   for (let i = 0; i < this.bodies.length; i++) {
    //     const body = this.bodies[i]
    //     this.drawCenter(body)
    //   }
    // }

    if (!this.firstFrame && !this.paused) {
      this.drawBodies()
    }

    if (
      this.mode == 'game' &&
      this.target == 'outside' &&
      !this.firstFrame &&
      this.globalStyle !== 'psycho'
    ) {
      for (let i = 0; i < this.bodies.length; i++) {
        const body = this.bodies[i]
        this.drawCenter(body)
      }
    }
    this.drawWitheringBodies()

    if (this.frames % 10 == 0) {
      this.sound?.render(this)
    }

    if (
      this.mode == 'game' &&
      this.frames - this.startingFrame + this.FPS < this.timer &&
      this.bodies.reduce((a, c) => a + c.radius, 0) != 0
    ) {
      this.drawGun()
      this.drawMissiles()
    }
    this.drawExplosions()
    // this.drawBodyOutlines()

    this.drawPause()
    this.drawScore()

    const notPaused = !this.paused
    const framesIsAtStopEveryInterval =
      (this.frames - this.startingFrame) % this.stopEvery == 0
    const didNotJustPause = !this.justPaused
    // console.log({
    //   stopEvery: this.stopEvery,
    //   alreadyRun: this.alreadyRun,
    //   frames: this.frames,
    //   framesIsAtStopEveryInterval,
    //   frames_lt_timer: this.frames < this.timer
    // })

    const ranOutOfTime =
      this.frames - this.startingFrame + this.FPS >= this.timer
    const hitHeroBody = this.bodies[0].radius == 0

    if ((ranOutOfTime || hitHeroBody) && !this.handledGameOver) {
      this.handleGameOver({ won: false, ranOutOfTime, hitHeroBody })
    }

    // const timeHasntRunOut = this.frames - this.startingFrame <= this.timer
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
    if (
      !this.won &&
      this.mode == 'game' &&
      this.bodies.slice(1).reduce((a, c) => a + c.radius, 0) == 0 &&
      !this.handledGameOver
    ) {
      this.handleGameOver({ won: true })
    }
    this.firstFrame = false
  },
  drawPause() {
    if (!(this.paused && fonts.dot)) return
    this.p.textFont(fonts.dot)
    this.p.fill(THEME.pink)
    this.p.textSize(200)
    this.p.textAlign(this.p.LEFT, this.p.TOP)

    // draw logo
    const titleY = this.windowHeight / 2 - 270
    drawKernedText(this.p, 'Anybody', 46, titleY, 1)
    drawKernedText(this.p, 'Problem', 46, titleY + 240, 6.5)

    this.drawFatButton({
      text: 'PLAY',
      onClick: () => this.setPause(false),
      fg: THEME.fuschia,
      bg: THEME.pink
    })
  },
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
  },

  drawBg() {
    if (this.lastMissileCantBeUndone) {
      this.p.background('rgb(150,150,150)')
      this.p.textSize(100)
      this.p.textAlign(this.p.CENTER, this.p.CENTER)
      this.p.text('YOUR GUN\nIS BROKEN!', this.windowWidth / 2, 100)
    } else {
      this.p.background(THEME.bg)
    }

    if (!this.starBG) {
      this.starBG = this.p.createGraphics(this.windowWidth, this.windowHeight)
      this.starBG.pixelDensity(this.pixelDensity)

      for (let i = 0; i < 200; i++) {
        // this.starBG.stroke('black')
        this.starBG.noStroke()
        // this.starBG.fill('rgba(255,255,255,0.6)')
        // this.starBG.fill('black')
        this.starBG.fill(THEME.fg)
        this.starBG.textSize(15)
        const strings = [',', '.', '*']
        this.starBG.text(
          strings[Math.floor(Math.random() * strings.length)],
          Math.floor(Math.random() * this.windowWidth),
          Math.floor(Math.random() * this.windowHeight)
        )
      }
      //   const totalLines = 6
      //   for (let i = 0; i < totalLines; i++) {
      //     if (i % 5 == 5) {
      //       this.starBG.strokeWeight(1)
      //       // this.starBG.stroke(`hsl(${i * (360 / totalLines)}, 100%, 50%)`)
      //     } else {
      //       this.starBG.strokeWeight(1)
      //       // this.starBG.stroke('rgba(0,0,0,0.1)')
      //     }
      //     this.starBG.line(i * (this.windowWidth / totalLines), 0, i * (this.windowWidth / totalLines), this.windowHeight)
      //     this.starBG.line(0, i * (this.windowHeight / totalLines), this.windowWidth, i * (this.windowHeight / totalLines))
      //   }
      // }
    }
    const basicX = 0
    // Math.floor((this.frames / FPS) * (this.frames / FPS)) % this.windowWidth
    const basicY = 0
    // Math.floor((this.frames / FPS) * (this.frames / FPS)) % this.windowHeight

    // const basicX = this.accumX % this.windowWidth
    // const basicY = this.accumY % this.windowHeight

    // const Xleft = basicX - this.windowWidth
    // const Xright = basicX + this.windowWidth

    // const Ytop = basicY - this.windowHeight
    // const Ybottom = basicY + this.windowHeight

    // this.confirmedStarPositions ||= []
    // for (let i = 0; i < this.starPositions?.length; i++) {
    //   if (i < this.confirmedStarPositions.length) continue
    //   const starBody = this.starPositions[i]
    //   const radius = starBody.radius * 4
    //   if (Xleft < 10) {
    //     this.drawBodiesLooped(starBody, radius, this.drawStarOnBG)
    //     if (this.loaded) {
    //       this.confirmedStarPositions.push(this.starPositions[i])
    //     }
    //   } else {
    //     this.drawBodiesLooped(starBody, radius, this.drawStarOnTopOfBG)
    //   }
    // }

    this.p.image(
      this.starBG,
      basicX,
      basicY,
      this.windowWidth,
      this.windowHeight
    )
    // this.p.image(
    //   this.starBG,
    //   Xleft,
    //   basicY,
    //   this.windowWidth,
    //   this.windowHeight
    // )
    // this.p.image(
    //   this.starBG,
    //   Xright,
    //   basicY,
    //   this.windowWidth,
    //   this.windowHeight
    // )
    // this.p.image(this.starBG, basicX, Ytop, this.windowWidth, this.windowHeight)
    // this.p.image(
    //   this.starBG,
    //   basicX,
    //   Ybottom,
    //   this.windowWidth,
    //   this.windowHeight
    // )
    // this.p.image(this.starBG, Xleft, Ytop, this.windowWidth, this.windowHeight)
    // this.p.image(this.starBG, Xright, Ytop, this.windowWidth, this.windowHeight)
    // this.p.image(
    //   this.starBG,
    //   Xleft,
    //   Ybottom,
    //   this.windowWidth,
    //   this.windowHeight
    // )
    // this.p.image(
    //   this.starBG,
    //   Xright,
    //   Ybottom,
    //   this.windowWidth,
    //   this.windowHeight
    // )

    // // Grid lines
    // const boxCount = 6
    // // this.p.stroke('black')
    // this.p.stroke('white')
    // for (let i = 1; i < boxCount; i++) {
    //   if (i % 5 == 5) {
    //     this.p.strokeWeight(1)
    //     // this.starBG.stroke(`hsl(${i * (360 / totalLines)}, 100%, 50%)`)
    //   } else {
    //     this.p.strokeWeight(1)
    //   }
    //   this.p.line(
    //     i * (this.windowWidth / boxCount),
    //     0,
    //     i * (this.windowWidth / boxCount),
    //     this.windowHeight
    //   )
    //   this.p.line(
    //     0,
    //     i * (this.windowHeight / boxCount),
    //     this.windowWidth,
    //     i * (this.windowHeight / boxCount)
    //   )
    // }
  },

  tintImage(img, color) {
    const g = this.p.createGraphics(img.width, img.height)
    const cc = this.getTintFromColor(color)
    g.tint(cc[0], cc[1], cc[2], cc[3] * 255)
    g.image(img, 0, 0)
    return g
  },

  drawStaticBg() {
    const bw = true

    // Fill the background with static noise
    if (!this.staticBg) {
      this.staticBg = this.p.createGraphics(this.windowWidth, this.windowHeight)
      this.staticBg.loadPixels()
      for (let x = 0; x < this.staticBg.width; x++) {
        for (let y = 0; y < this.staticBg.height; y++) {
          let colorValue
          if (bw) {
            const noiseValue = this.staticBg.noise(x * 0.01, y * 0.01)
            colorValue = this.staticBg.map(noiseValue, 0, 1, 0, 255)
            colorValue = this.staticBg.color(colorValue)
          } else {
            // const noiseValue = this.staticBg.noise(x * 0.01, y * 0.01)
            const rNoise = this.staticBg.noise(x * 0.01, y * 0.01) // * 255
            const gNoise = this.staticBg.noise(x * 0.02, y * 0.02) // * 255 // Different scale for variation
            const bNoise = this.staticBg.noise(x * 0.03, y * 0.03) // * 255 // Different scale for variation
            const rColorValue = this.staticBg.map(rNoise, 0, 1.01, 0, 255)
            const gColorValue = this.staticBg.map(gNoise, 0, 1.02, 0, 255)
            const bColorValue = this.staticBg.map(bNoise, 0, 1.03, 0, 255)
            colorValue = this.staticBg.color(
              rColorValue,
              gColorValue,
              bColorValue
            )
          }
          this.staticBg.set(x, y, this.staticBg.color(colorValue))
        }
      }
      this.staticBg.updatePixels()
    }
    this.p.image(this.staticBg, 0, 0)
  },
  drawSolidBg() {
    this.p.background(255)
  },

  getColorDir(chunk) {
    return Math.floor(this.frames / (255 * chunk)) % 2 == 0
  },

  getBW() {
    const dir = this.getColorDir(this.chunk)
    const lowerHalf = Math.floor(this.frames / this.chunk) % 255 < 255 / 2
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
  },

  getGrey() {
    if (this.getColorDir(this.chunk)) {
      return 255 - (Math.floor(this.frames / this.chunk) % 255)
    } else {
      return Math.floor(this.frames / this.chunk) % 255
    }
  },

  getNotGrey() {
    if (!this.getColorDir(this.chunk)) {
      return 255 - (Math.floor(this.frames / this.chunk) % 255)
    } else {
      return Math.floor(this.frames / this.chunk) % 255
    }
  },

  drawScore() {
    const { p } = this
    p.push()
    p.fill('white')
    p.noStroke()
    p.textAlign(p.LEFT, p.TOP)

    const runningFrames = this.frames - this.startingFrame
    const seconds = runningFrames / this.FPS
    const secondsLeft =
      (this.level > 5 ? 60 : GAME_LENGTH_BY_LEVEL_INDEX[this.level - 1]) -
      seconds
    if (this.gameOver) {
      this.scoreSize = this.initialScoreSize
      p.pop()
      this.won ? this.drawWinScreen() : this.drawLoseScreen()
      return
    }

    // make the timer bigger as time runs out
    if (seconds >= 51 && this.scoreSize < 420) {
      this.scoreSize += 5
      p.fill(255, 255, 255, 150)
    } else if (seconds > 30 && this.scoreSize < 160) {
      this.scoreSize += 2
      p.fill(255, 255, 255, 150)
    } else if (seconds > 50 && this.scoreSize < 80) {
      this.scoreSize += 1
      p.fill(255, 255, 255, 150)
    }
    p.textFont(fonts.body)
    p.textSize(this.scoreSize)
    if (runningFrames > 2) {
      p.text(secondsLeft.toFixed(2) + 's', 20, 10)
    }

    p.pop()
  },

  drawWinScreen() {
    const { p } = this
    p.push()
    p.noStroke()
    p.fill('white')

    p.textSize(128)
    p.textAlign(p.CENTER, p.TOP)
    p.text('SUCCESS', this.windowWidth / 2 - 8, 190) // adjust by 8 to center SF Pro weirdness

    // draw a white box behind the stats, with border radius
    p.fill('white')
    p.rect(this.windowWidth / 2 - 320, 340, 640, 350, 20, 20, 20, 20)

    // draw stats
    p.textSize(48)
    p.textStyle(p.BOLD)
    p.fill('black')
    for (const [i, line] of this.statsText.split('\n').entries()) {
      // print each stat line with left aligned label, right aligned stat
      if (line.match(/1x/)) {
        // gray text if 1x multiplier
        p.fill('rgba(0,0,0,0.3)')
        p.fill('black')
      } else {
        p.fill('black')
      }
      // last line has a bar on top
      const leading = 64
      let barPadding = 0
      const xLeft = this.windowWidth / 2 - 300
      const xRight = this.windowWidth / 2 + 300
      const y = 374 + leading * i
      // if (i === 3) {
      //   p.stroke('black')
      //   p.strokeWeight(4)
      //   p.line(xLeft, y, xRight, y)
      //   p.noStroke()
      //   barPadding = 20
      // }
      for (const [j, stat] of line.split(':').entries()) {
        if (j === 0) {
          p.textAlign(p.LEFT, p.TOP)
          p.text(stat, xLeft, y + barPadding)
        } else {
          p.textAlign(p.RIGHT, p.TOP)
          p.text(stat, xRight, y + barPadding)
        }
      }
    }

    // play again button
    if (this.showPlayAgain) {
      this.drawFatButton({
        text: 'RETRY',
        onClick: () => this.restart(null, false),
        fg: 'black',
        bg: 'white'
      })
    }

    p.pop()
  },

  drawTicker({ text, bottom = false }) {
    const doubleText = `${text} ${text} `

    const { p } = this

    p.textSize(200)
    p.textAlign(p.LEFT, p.TOP)
    p.textFont(fonts.dot)
    const tickerSpeed = this.FPS / 2
    const textWidth = p.textWidth(doubleText)
    if (!this.gameoverTickerX || this.gameoverTickerX + tickerSpeed >= 0) {
      this.gameoverTickerX = -textWidth / 2
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
    p.fill(this.randomColor(100))

    this.drawTicker({ text: 'GAME OVER' })

    if (this.showPlayAgain) {
      this.drawFatButton({
        text: 'RETRY',
        onClick: () => {
          console.log('retry')
          this.restart(null, false)
        },
        fg: THEME.fuschia,
        bg: THEME.pink
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
    this.p.strokeWeight(2)

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
    // // Calculate the length of the direction
    // let len = this.p.sqrt(dirX * dirX + dirY * dirY)

    // // If the length is not zero, scale the direction to have a length of 100
    // if (len != 0) {
    //   dirX = (dirX / len) * 100
    //   dirY = (dirY / len) * 100
    // }

    if (this.paused) return

    // Draw the line
    // this.p.setLineDash([5, 15])
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

  drawExplosions() {
    const { p, explosions } = this

    for (let i = 0; i < explosions.length; i++) {
      const _explosion = explosions[i]
      const bomb = _explosion[0]
      p.fill('rgba(255,255,255,0.5)')
      p.stroke('white')
      p.strokeWeight(2)
      p.ellipse(bomb.x, bomb.y, bomb.i * 2, bomb.i * 2)
      p.ellipse(bomb.x, bomb.y, bomb.i * 1.8, bomb.i * 1.8)
      p.ellipse(bomb.x, bomb.y, bomb.i * 1.6, bomb.i * 1.6)
      p.ellipse(bomb.x, bomb.y, bomb.i * 1.4, bomb.i * 1.4)
      p.ellipse(bomb.x, bomb.y, bomb.i * 1.6, bomb.i * 1.6)
      p.fill('rgba(255,255,255,0.9)')
      p.ellipse(bomb.x, bomb.y, bomb.i * 1.4, bomb.i * 1.4)
      _explosion.shift()
      if (_explosion.length == 0) {
        explosions.splice(i, 1)
      }
    }
  },

  drawMissiles() {
    this.p.noStroke()
    this.p.strokeWeight(0)

    const missileReverbLevels = 10
    const green = '2,247,123'
    // const yellow = '255,255,0'
    const color = green
    const c =
      Math.floor(this.frames / missileReverbLevels) % 2 == 0
        ? `rgb(${color})`
        : 'white'

    for (let i = 0; i < this.missiles.length; i++) {
      const body = this.missiles[i]
      this.p.noStroke()
      this.p.fill(c)
      this.p.ellipse(body.position.x, body.position.y, body.radius, body.radius)

      this.p.noFill()
      this.p.strokeWeight(10)
      for (let i = 0; i < missileReverbLevels; i++) {
        const c =
          Math.floor((this.frames - i) / missileReverbLevels) % 2 == 0
            ? `rgba(${color},${(missileReverbLevels - i) / missileReverbLevels})`
            : `rgba(255,255,255,${(missileReverbLevels - i) / missileReverbLevels})`
        this.p.stroke(c)
        const reverb = body.radius * (i + 1)
        this.p.ellipse(body.position.x, body.position.y, reverb, reverb)
      }
    }
  },

  paintAtOnce(n = this.paintSteps) {
    this.bodiesGraphic ||= this.p.createGraphics(
      this.windowWidth,
      this.windowHeight
    )

    for (let i = 0; i < n; i++) {
      const results = this.step(this.bodies, this.missiles)
      this.bodies = results.bodies
      this.missiles = results.missiles || []
      this.drawBodies(false)
      this.drawWitheringBodies()
      this.frames++
    }

    this.p.image(this.bodiesGraphic, 0, 0)
    this.bodiesGraphic.clear()
  },
  componentToHex(c) {
    var hex = parseInt(c).toString(16)
    return hex.length == 1 ? '0' + hex : hex
  },

  rgbToHex(r, g, b) {
    return (
      '0x' +
      this.componentToHex(r) +
      this.componentToHex(g) +
      this.componentToHex(b)
    )
  },
  hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16)
        }
      : null
  },

  invertColorRGB(c) {
    throw new Error(`invert color is not meant for HSL colors (${c})`)
    // let [r, g, b] = c.replace('rgba(', '').split(',').slice(0, 3)
    // const hexColor = this.rgbToHex(r, g, b)
    // const invert = (parseInt(hexColor) ^ 0xffffff).toString(16).padStart(6, '0')
    // const invertRGB = this.hexToRgb(invert)
    // // r = r - 255
    // // g = g - 255
    // // b = b - 255
    // const newColor = this.p.color(invertRGB.r, invertRGB.g, invertRGB.b)
    // return newColor
  },

  // Function to apply mask color to the image
  maskImage(img, maskColor) {
    img.loadPixels() // Load the image's pixel data

    for (let i = 0; i < img.pixels.length; i += 4) {
      if (img.pixels[i + 3] == 0) continue // Skip transparent pixels (alpha = 0
      // Replace RGB values with the mask color's RGB, preserve the original alpha
      img.pixels[i] = maskColor[0] // R
      img.pixels[i + 1] = maskColor[1] // G
      img.pixels[i + 2] = maskColor[2] // B
      img.pixels[i + 3] = 255 // TODO: could be 100% or 1
      // Alpha remains unchanged to preserve transparency
    }

    img.updatePixels() // Update the image with the new pixel values
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

  drawImageAsset(assetUrl, width, fill, myP = this.bodiesGraphic) {
    this.imgAssets ||= {}
    // TODO: remove width from ID when colors aren't temp-random
    const id = assetUrl + width + fill
    const loaded = this.imgAssets[id]

    if (!loaded) {
      this.imgAssets[id] = 'loading'
      fetch(assetUrl)
        .then((resp) => resp.text())
        .then((svg) => {
          svg = fill ? replaceAttribute(svg, 'fill', fill) : svg
          // svg = replaceAttribute(svg, 'stroke-width', '0')
          svg = 'data:image/svg+xml,' + encodeURIComponent(svg)

          this.p.loadImage(svg, (img) => {
            const width = img.width * this.pixelDensity
            const height = img.height * this.pixelDensity

            const foo = this.p.createGraphics(width, height)
            foo.pixelDensity(this.pixelDensity)

            foo.image(img, 0, 0, width, height)

            this.imgAssets[id] = foo
          })
        })
        .catch((e) => {
          console.error(e)
          this.imgAssets[id] = undefined
        })
    }

    if (loaded && loaded !== 'loading') {
      myP.image(loaded, -width / 2, -width / 2, width, width)
    }
  },
  closeTo(body) {
    let isClose = false
    const minDistance = body.radius * 2
    for (let i = 1; i < this.bodies.length; i++) {
      const other = this.bodies[i]
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
    this.fIndex ||= Math.floor(Math.random() * 14)

    const baddiesNear = this.closeTo(body)
    if (baddiesNear) {
      this.drawImageAsset(FACE_SHOT_SVGS[this.fIndex], width)
      return
    }

    const x = 5 // every 5 seconds it blinks
    const m = 25 // for 25 frames (1 second)
    // uncomment the following line to rotate face
    // this.bodiesGraphic.push()
    // this.bodiesGraphic.rotate(body.velocity.heading() + this.p.PI / 2)
    if (
      Math.floor(this.frames / x) % m == 0 ||
      Math.floor(this.frames / x) % m == 2
    ) {
      this.drawImageAsset(FACE_BLINK_SVGS[this.fIndex], width)
    } else {
      this.drawImageAsset(FACE_SVGS[this.fIndex], width)
    }
    // this.bodiesGraphic.pop()
  },

  drawStarForegroundSvg(width, body) {
    const fill = body.c.fg
    this.bodiesGraphic.push()
    this.fgIndex ||= Math.floor(Math.random() * 10)
    const r = {
      ...rot.fg,
      ...(rotOverride?.fg?.[this.fgIndex] ?? {})
    }
    const rotateBy = r.speed == 0 ? 0 : (this.frames / r.speed) % 360
    this.bodiesGraphic.rotate(r.direction * rotateBy)
    this.drawImageAsset(FG_SVGS[this.fgIndex], width, fill)
    this.bodiesGraphic.pop()
  },

  drawCoreSvg(width, body) {
    const fill = body.c.core
    this.bodiesGraphic.push()
    const r = {
      ...rot.core,
      ...(rotOverride?.core?.[0] ?? {})
    }
    const rotateBy = r.speed == 0 ? 0 : (this.frames / r.speed) % 360
    this.bodiesGraphic.rotate(r.direction * rotateBy)
    this.drawImageAsset(CORE_SVGS[0], width, fill)
    this.bodiesGraphic.pop()
  },

  drawStarBackgroundSvg(width, body) {
    const fill = body.c.bg
    this.bodiesGraphic.push()
    this.bgIndex ||= Math.floor(Math.random() * 10)
    const r = {
      ...rot.bg,
      ...(rotOverride?.bg?.[this.bgIndex] ?? {})
    }
    const rotateBy = r.speed == 0 ? 0 : (this.frames / r.speed) % 360
    this.bodiesGraphic.rotate(r.direction * rotateBy)
    this.drawImageAsset(BG_SVGS[this.bgIndex], width, fill)
    this.bodiesGraphic.pop()
  },

  getTintFromColor(c) {
    const cc = c
      .split(',')
      .map((c) => parseFloat(c.replace(')', '').replace('hsla(', '')))
    return [cc[0], cc[1], cc[2], cc[2]]
  },

  drawBodyStyle1(radius, body, offset) {
    this.bodiesGraphic.noStroke()
    let c =
      body.radius !== 0 ? body.c : this.replaceOpacity(body.c, this.deadOpacity)
    // if (body.bodyIndex == 0) {
    //   c = 'white'
    // }
    this.bodiesGraphic.fill(c)
    // const scale = 1
    // const foo = this.p.createGraphics(radius / scale, radius / scale)
    // foo.noStroke()
    // foo.fill(c)
    // foo.ellipse(
    //   radius / scale / 2,
    //   radius / scale / 2,
    //   radius / scale,
    //   radius / scale
    // )
    // this.bodiesGraphic.image(
    //   foo,
    //   -radius / 2,
    //   -radius / 2 - offset,
    //   radius,
    //   radius
    // )
    this.bodiesGraphic.ellipse(0, offset, radius)
  },

  moveAndRotate_PopAfter(graphic, x, y /*v*/) {
    graphic.push()
    graphic.translate(x, y)

    // rotate body in vector direction
    // const angle = v.heading() + this.p.PI / 2
    // graphic.rotate(angle)

    // if (v.x > 0) {
    //   graphic.scale(-1, 1)
    // }
    // if (v.y > 0) {
    //   graphic.scale(1, -1)
    // }
  },

  drawBody(x, y, v, radius, body) {
    this.moveAndRotate_PopAfter(this.bodiesGraphic, x, y, v)

    // y-offset of face relative to center
    // const offset = this.getOffset(radius)

    if (body.bodyIndex === 0) {
      const size = Math.floor(body.radius * BODY_SCALE * 2.66)

      this.drawStarBackgroundSvg(size, body)
      this.drawCoreSvg(body.radius * BODY_SCALE, body)
      this.drawStarForegroundSvg(size, body)
      this.drawFaceSvg(body, size)
    } else {
      this.drawBaddie(body)
    }

    this.bodiesGraphic.pop()

    // if (this.showLevels) {
    //   this.drawLevels(radius, body, offset)
    // }
  },

  getBodyRadius(actualRadius) {
    return actualRadius * 4 + this.radiusMultiplyer
  },

  drawBodiesLooped(body, radius, drawFunction) {
    drawFunction = drawFunction.bind(this)
    drawFunction(body.position.x, body.position.y, body.velocity, radius, body)

    // let loopedX = false,
    //   loopedY = false,
    //   loopX = body.position.x,
    //   loopY = body.position.y
    // const loopGap = radius / 2

    // // crosses right, draw on left
    // if (body.position.x > this.windowWidth - loopGap) {
    //   loopedX = true
    //   loopX = body.position.x - this.windowWidth
    //   drawFunction(loopX, body.position.y, body.velocity, radius, body, true)
    //   // crosses left, draw on right
    // } else if (body.position.x < loopGap) {
    //   loopedX = true
    //   loopX = body.position.x + this.windowWidth
    //   drawFunction(loopX, body.position.y, body.velocity, radius, body, true)
    // }

    // // crosses bottom, draw on top
    // if (body.position.y > this.windowHeight - loopGap) {
    //   loopedY = true
    //   loopY = body.position.y - this.windowHeight
    //   drawFunction(body.position.x, loopY, body.velocity, radius, body, true)
    //   // crosses top, draw on bottom
    // } else if (body.position.y < loopGap) {
    //   loopedY = true
    //   loopY = body.position.y + this.windowHeight
    //   drawFunction(body.position.x, loopY, body.velocity, radius, body, true)
    // }

    // // crosses corner, draw opposite corner
    // if (loopedX && loopedY) {
    //   drawFunction(loopX, loopY, body.velocity, radius, body, true)
    // }
  },

  // TODO: add this back as part of a end game animation
  drawWitheringBodies() {
    if (this.gameOver) {
      return
    }
    const { p } = this

    // draw a fake withering body for development
    // if (this.witheringBodies.length === 0) {
    //   this.witheringBodies = [{ position: p.createVector(100, 100) }]
    // }

    this.bodiesGraphic ||= p.createGraphics(this.windowWidth, this.windowHeight)

    this.bodiesGraphic.drawingContext.msImageSmoothingEnabled = false
    this.bodiesGraphic.drawingContext.mozImageSmoothingEnabled = false
    this.bodiesGraphic.drawingContext.webkitImageSmoothingEnabled = false
    this.bodiesGraphic.drawingContext.imageSmoothingEnabled = false
    // this.bodiesGraphic.pixelDensity(0.2)

    this.bodiesGraphic.drawingContext.msImageSmoothingEnabled = false
    this.bodiesGraphic.drawingContext.mozImageSmoothingEnabled = false
    this.bodiesGraphic.drawingContext.webkitImageSmoothingEnabled = false
    this.bodiesGraphic.drawingContext.imageSmoothingEnabled = false
    this.bodiesGraphic.noStroke()
    for (const body of this.witheringBodies) {
      p.push()
      p.translate(body.position.x, body.position.y)
      body.witherSteps ||= 0
      body.witherSteps++
      if (body.witherSteps > WITHERING_STEPS) {
        this.witheringBodies = this.witheringBodies.filter((b) => b !== body)
        p.pop()
        continue
      }

      // the body should shrink to nothing over WITHERING_STEPS
      const radius = p.map(
        WITHERING_STEPS - body.witherSteps,
        0,
        WITHERING_STEPS,
        1,
        30 // start radius
      )

      // the ghost body pulses a little bit, isn't totally round
      body.zoff ||= 0
      p.stroke(255)
      p.noFill()
      p.fill(255, 255, 255, 230)
      p.beginShape()
      for (let a = 0; a < p.TWO_PI; a += 0.02) {
        let xoff = p.map(p.cos(a), -1, 1, 0, 2)
        let yoff = p.map(p.sin(a), -1, 1, 0, 2)
        const r = p.map(
          p.noise(xoff, yoff, body.zoff),
          0,
          1,
          radius - 10,
          radius
        )
        let x = r * p.cos(a)
        let y = r * p.sin(a)
        p.vertex(x, y)
      }
      p.endShape(p.CLOSE)
      body.zoff += 0.01

      p.pop()
    }
  },

  async drawBodies(attachToCanvas = true) {
    this.bodiesGraphic ||= this.p.createGraphics(
      this.windowWidth,
      this.windowHeight
    )
    this.bodiesGraphic.noStroke()

    const bodyCopies = []
    for (let i = 0; i < this.bodies.length; i++) {
      // const body = this.bodies.sort((a, b) => b.radius - a.radius)[i]
      const body = this.bodies[i]
      // after final proof is sent, don't draw upgradable bodies
      if (body.radius == 0) continue
      const bodyRadius = this.bodyCopies.filter(
        (b) => b.bodyIndex == body.bodyIndex
      )[0]?.radius
      const radius = this.getBodyRadius(bodyRadius)
      this.drawBodiesLooped(body, radius, this.drawBody)

      const bodyCopy = JSON.parse(
        JSON.stringify(
          body,
          (key, value) => (typeof value === 'bigint' ? value.toString() : value) // return everything else unchanged
        )
      )
      bodyCopy.position = this.p.createVector(body.position.x, body.position.y)
      bodyCopy.velocity = this.p.createVector(body.velocity.x, body.velocity.y)
      bodyCopies.push(bodyCopy)
    }
    this.frames % this.tailMod == 0 && this.allCopiesOfBodies.push(bodyCopies)
    if (this.allCopiesOfBodies.length > this.tailLength) {
      this.allCopiesOfBodies.shift()
    }
    if (attachToCanvas) {
      this.p.image(this.bodiesGraphic, 0, 0)
    }
    this.bodiesGraphic.clear()
  },

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
    const radialStep2 =
      (this.frames / (this.chunk * 1) / 255) * 360 + (270 % 360)
    const clockRadius2 = this.windowWidth / 2 + size / 4

    const clockX2 =
      clockCenter + clockRadius2 * Math.cos((radialStep2 * Math.PI) / 180)
    const clockY2 =
      clockCenter + clockRadius2 * Math.sin((radialStep2 * Math.PI) / 180)
    // this.bodiesGraphic.stroke(this.getBW())
    this.bodiesGraphic.noStroke()
    // this.bodiesGraphic.stroke('white')
    this.bodiesGraphic.fill(this.getGrey())
    // if (size < 0) {
    //   size = 0
    // }
    this.bodiesGraphic.ellipse(clockX2, clockY2, size, size)
  },

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
    graphic.image(
      this.eyes,
      -body.radius * (size / 2),
      -body.radius * (size / 2),
      body.radius * size,
      body.radius * size
    )

    graphic.pop()
    graphic.push()
    graphic.translate(body.position.x, body.position.y)
    var angle2 = body.velocity.heading() + graphic.PI / 2
    graphic.rotate(angle2)
    graphic.pop()
    return graphic
  },

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

    let x3 =
      body.radius * 4 * this.p.cos(this.p.PI / 6 + (2 * this.p.TWO_PI) / 3)
    let y3 =
      body.radius * 4 * this.p.sin(this.p.PI / 6 + (2 * this.p.TWO_PI) / 3)

    this.p.triangle(x1, y1, x2, y2, x3, y3)
    this.p.pop()

    this.p.stroke('white')
    this.p.strokeWeight(1)
    this.p.push()
    this.p.translate(body.position.x, body.position.y)
    var angle2 = body.velocity.heading() + this.p.PI / 2
    this.p.rotate(angle2)
    this.p.pop()
  },

  drawTailStyle1(/*x, y, v, radius, finalColor, offset*/) {
    return
    // finalColor = finalColor.replace(this.opac, '1')
    // this.p.push()
    // this.p.translate(x, y)
    // this.p.rotate(v.heading() + this.p.PI / 2)

    // // this.p.rotate(angle)
    // this.p.fill(finalColor)
    // this.p.stroke(finalColor)
    // // this.p.strokeWeight(10)
    // // this.p.noFill()
    // this.p.ellipse(0, offset, radius * 1.2)

    // // this.p.image(this.drawTails[id], -radius / 2, -radius)
    // this.p.pop()
  },

  drawTailStyleGhost(x, y, v, radius, finalColor) {
    // ghost version

    const id = radius + '-' + finalColor
    if (!this.tailGraphics) {
      this.tailGraphics = {}
    }
    if (!this.tailGraphics || this.tailGraphics[id] == undefined) {
      this.tailGraphics[id] = this.p.createGraphics(
        this.windowWidth,
        this.windowHeight
      )
      this.tailGraphics[id].noStroke()
      this.tailGraphics[id].fill(finalColor)

      this.tailGraphics[id].beginShape()
      // this.tailGraphics[id].vertex(radius, 0)
      // this.tailGraphics[id].vertex(0, 0)

      // this.p.arc(0, 0, radius, radius, this.p.PI, 2 * this.p.PI)
      const arcResolution = 20

      for (let j = 0; j < arcResolution; j++) {
        const ang = this.p.map(j, 0, arcResolution, 0, this.p.PI)
        const ax = radius / 2 + (this.p.cos(ang) * radius) / 2
        const ay = (2 * radius) / 2 + (-1 * this.p.sin(ang) * radius) / 2
        this.tailGraphics[id].vertex(ax, ay)
      }

      // this.tailGraphics[id].fill('red')
      // this.tailGraphics[id].rect(0, 0, radius, radius / 2)

      const bumps = 7
      let bumpHeight = radius / 6
      // let heightChanger = radius / 10
      // const bumpHeightMax = radius / 5
      // const bumpHeightMin = radius / 8
      const startY = radius * 1
      // this.tailGraphics[id].push()
      let remaindingWidth = radius
      for (let i = 0; i < bumps; i++) {
        let bumpWidth = radius / bumps
        // bumpHeight += heightChanger
        // if (bumpHeight > bumpHeightMax || bumpHeight < bumpHeightMin) {
        //   heightChanger *= -1
        // }
        let x = radius - remaindingWidth
        if (i % 2 == 1) {
          // this.tailGraphics[id].arc(x + bumpWidth / 2, startY, bumpWidth, bumpHeight, this.tailGraphics[id].PI, 0, this.tailGraphics[id].OPEN)
          for (let j = 0; j < arcResolution; j++) {
            const ang = this.p.map(j, 0, arcResolution, this.p.PI, 0)
            const ax = x + bumpWidth / 2 + (this.p.cos(ang) * bumpWidth) / 2
            const ay =
              startY + bumpHeight + (-1 * this.p.sin(ang) * bumpHeight) / 2
            this.tailGraphics[id].vertex(ax, ay)
          }
        } else {
          for (let j = 0; j < arcResolution; j++) {
            const ang = this.p.map(j, 0, arcResolution, this.p.PI, 0)
            const ax = x + bumpWidth / 2 + (this.p.cos(ang) * bumpWidth) / 2
            const ay = startY + bumpHeight + (this.p.sin(ang) * bumpHeight) / 2
            this.tailGraphics[id].vertex(ax, ay)
          }
          // this.tailGraphics[id].arc(x + bumpWidth / 2, startY + bumpWidth, bumpWidth, bumpHeight, 0, this.tailGraphics[id].PI, this.tailGraphics[id].OPEN)
        }
        remaindingWidth -= bumpWidth
      }
      this.tailGraphics[id].endShape(this.tailGraphics[id].CLOSE)
      // this.tailGraphics[id].pop()
    }

    // this.tailGraphics[id].push()
    // this.tailGraphics[id].translate(x, y)
    var angle = v.heading() + this.p.PI / 2
    // this.tailGraphics[id].rotate(angle)
    // this.tailGraphics[id].fill(finalColor)
    // this.tailGraphics[id].fill('rgba(255,0,0,1)')
    // this.tailGraphics[id].rect(0, 0, radius, radius / 4)
    // this.tailGraphics[id].pop()
    this.p.push()
    this.p.translate(x, y)
    this.p.rotate(angle)
    this.p.image(this.tailGraphics[id], -radius / 2, -radius)
    this.p.pop()
  },

  getOffset(radius) {
    return this.target == 'inside' ? 0 : radius / 1.5
  },

  drawTails() {
    // if (this.allCopiesOfBodies && this.allCopiesOfBodies.length > 0) {
    //   const allCopiesOfBodies =
    //     this.allCopiesOfBodies[this.allCopiesOfBodies.length - 1]
    //   const body = allCopiesOfBodies[0]
    //   if (body.bodyIndex == 0) {
    //     this.p.noFill()
    //     this.p.stroke('white')
    //     this.p.strokeWeight(10)
    //     this.p.ellipse(body.position.x, body.position.y, body.radius * 10)
    //   }
    // }
    for (let i = 0; i < this.allCopiesOfBodies.length; i++) {
      const copyOfBodies = this.allCopiesOfBodies[i]
      for (let j = 0; j < copyOfBodies.length; j++) {
        const body = copyOfBodies[j]
        if (body.bodyIndex == 0) continue
        if (this.gameOver || this.won) {
          if (
            this.witheringBodies.filter((b) => b.bodyIndex == body.bodyIndex)
              .length > 0
          )
            continue
        }
        if (body.radius == 0) continue
        let c =
          body.radius !== 0
            ? this.replaceOpacity(body.c, this.deadOpacity)
            : this.replaceOpacity(body.c, this.deadOpacity)
        this.p.fill(c)
        // if (this.mode == 'nft') {
        const bodyCopy = this.bodyCopies.filter(
          (b) => b.bodyIndex == body.bodyIndex
        )[0]
        const radius = this.getBodyRadius(bodyCopy.radius) * 1.1

        // this.p.ellipse(body.position.x, body.position.y, radius, radius)
        this.p.push()
        this.p.translate(body.position.x, body.position.y)
        this.p.rotate(body.velocity.heading() + this.p.PI / 2)
        // this.p.arc(0, 0, radius, radius, this.p.PI, 2 * this.p.PI)
        this.p.pop()
        const offset = this.getOffset(radius)

        switch (body.tailStyle) {
          case 1:
            this.drawTailStyle1(
              body.position.x,
              body.position.y,
              body.velocity,
              radius,
              c,
              offset
            )
            break
          case 'ghost':
            this.drawTailStyleGhost(
              body.position.x,
              body.position.y,
              body.velocity,
              radius,
              c,
              offset
            )
            break
          default:
            this.drawTailStyle1(
              body.position.x,
              body.position.y,
              body.velocity,
              radius,
              c,
              offset
            )
        }
      }
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
    let cc = c
      .split(',')
      .map((c) => parseFloat(c.replace(')', '').replace('hsla(', '')))
    cc[2] = cc[2] + amount
    cc[1] = cc[1] + '%'
    cc[2] = cc[2] + '%'
    return `hsla(${cc.join(',')})`
  },

  drawBaddie(body) {
    const colorHSL = body.c
    const coreWidth = body.radius * BODY_SCALE
    const bgColor = hslToRgb(colorHSL, 0.5)
    const coreColor = hslToRgb(colorHSL)
    this.bodiesGraphic.push()
    const rotate = (this.frames / 30) % 360
    this.bodiesGraphic.rotate(rotate)
    this.drawImageAsset(
      BADDIE_SVG.bg,
      Math.floor(coreWidth * (310 / 111.2)),
      bgColor
    )
    this.bodiesGraphic.push()
    this.bodiesGraphic.rotate(-rotate + body.velocity.heading() + this.p.PI / 2)
    this.drawImageAsset(BADDIE_SVG.core, coreWidth, coreColor)
    this.drawImageAsset(BADDIE_SVG.face, coreWidth, undefined)

    // pupils always looking at missile, if no missile, look at mouse
    const target =
      this.missiles.length > 0
        ? this.missiles[0].position
        : { x: this.scaleX(this.p.mouseX), y: this.scaleY(this.p.mouseY) }

    const bx = body.position.x
    const by = body.position.y

    const leftEye = [-body.radius * 0.6, -body.radius * 0.15]
    const rightEye = [body.radius * 0.6, -body.radius * 0.15]

    this.bodiesGraphic.fill('white')
    this.bodiesGraphic.circle(leftEye[0], leftEye[1], body.radius)
    this.bodiesGraphic.circle(rightEye[0], rightEye[1], body.radius)

    const angle =
      Math.atan2(target.y - by, target.x - bx) -
      body.velocity.heading() -
      this.p.PI / 2

    const distance = body.radius * 0.3
    const leftX = distance * Math.cos(angle)
    const leftY = distance * Math.sin(angle)

    this.bodiesGraphic.fill('black')
    this.bodiesGraphic.circle(
      leftX + leftEye[0],
      leftY + leftEye[1],
      body.radius * 0.4
    )
    this.bodiesGraphic.circle(
      leftX + rightEye[0],
      leftY + rightEye[1],
      body.radius * 0.4
    )

    const heroBody = this.bodies[0]
    const minDistance = heroBody.radius * 2 + body.radius * 4
    const currentDistance = this.p.dist(
      heroBody.position.x,
      heroBody.position.y,
      body.position.x,
      body.position.y
    )
    const closeToBody = currentDistance <= minDistance

    if (closeToBody) {
      this.bodiesGraphic.fill(coreColor)
      this.bodiesGraphic.triangle(
        0,
        -body.radius * 0.2,
        leftEye[0] * 2,
        -body.radius * 0.8,
        rightEye[0] * 2,
        -body.radius * 0.8
      )
    }

    this.bodiesGraphic.pop()
    this.bodiesGraphic.pop()
  },

  drawCenter(b, p = this.bodiesGraphic, x = 0, y = 0) {
    let closeEnough = false //this.isMissileClose(b)
    // this.p.blendMode(this.p.DIFFERENCE)
    p.noStroke()
    x = x == undefined ? b.position.x : x
    y = y == undefined ? b.position.y : y
    const r = b.radius * BODY_SCALE // b.radius * 4
    if (r == 0) return
    // let c = this.brighten(b.c).replace(this.opac, 1)
    let darker = this.brighten(b.c, -30).replace(this.opac, 1)

    p.fill(darker)
    p.ellipse(x, y, r)
    if (closeEnough) {
      // draw teeth
      const teeth = 10
      const toothSize = r / 4.5
      // if (closeEnough) {
      p.fill(darker)
      p.ellipse(x, y, r)
      for (let i = 0; i < teeth; i++) {
        if (i == Math.floor(teeth / 4)) continue
        if (i == Math.ceil(teeth / 4)) continue

        if (i == Math.floor((3 * teeth) / 4)) continue
        if (i == Math.ceil((3 * teeth) / 4)) continue
        p.fill('white')
        // draw each tooth
        const angle = (i * this.p.TWO_PI) / teeth
        // add some rotation depending on vector of body
        const rotatedAngle = angle + b.velocity.heading()
        const x1 = x + (r / 2.3) * this.p.cos(rotatedAngle)
        const y1 = y + (r / 2.3) * this.p.sin(rotatedAngle)
        p.ellipse(x1, y1, toothSize)
      }

      p.stroke(darker)
      p.strokeWeight(r / 12)
      p.noFill()
      p.ellipse(x, y, r)
    } else {
      /** DRAW TARGET */
      // const width = r / 2
      // const rotatedAngle = b.velocity.heading()
      // p.push()
      // p.translate(x, y)
      // p.rotate(rotatedAngle + p.PI / 2)
      // const teeth = 6
      // for (let i = 0; i < teeth; i++) {
      //   p.fill('white')
      //   const xx = 0 - width / (teeth / 2) + ((i % (teeth / 2)) * width) / 2
      //   const yy =
      //     -width / (teeth / 2) - ((i < teeth / 2 ? -1 : 1) * width) / 5
      //   p.ellipse(xx - width / teeth / 2, yy + width / 4, width / (teeth / 3))
      // }
      // p.fill(darker)
      // p.rect(0 - width / 1.5, 0 - width / 1.5, width * 1.5, width / 3)
      // p.rect(0 - width / 1.5, 0 + width / 4, width * 1.5, width / 3)
      // p.strokeWeight(15)
      // p.noFill()
      // p.stroke(darker)
      // p.ellipse(0, 0, r - 7)
      // p.pop()
      p.strokeWeight(0)
      const count = 3
      for (let i = 0; i < count; i++) {
        if (i % 2 == 1) {
          p.fill('white')
        } else {
          p.fill(darker)
        }
        p.ellipse(x, y, r - (i * r) / count)
      }
    }
    // p.blendMode(p.BLEND)
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
  async loadImages() {
    return
    // this.starSVG ||= {}
    // for (let i = 0; i < STAR_SVGS.length; i++) {
    //   const svg = STAR_SVGS[i]
    //   await new Promise((resolve) => {
    //     this.p.loadImage(svg, (img) => {
    //       this.starSVG[i + 1] = img
    //       resolve()
    //     })
    //   })
    // }
    // this.loaded = true
  }
}
