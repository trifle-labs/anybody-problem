import { THEME } from './colors.js'

const msgY = 824

export const Intro = {
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
      default:
    }

    if (this.introStage === 0 && this.levelCountdown > 200) return
    this.drawSkipButton()
  },

  drawIntroStage0() {
    this.missilesDisabled = true
    const duration = 250
    this.levelCountdown ||= duration
    this.levelCountdown -= 1

    const maxBaddieSize = 50
    const currentSize =
      0 + (maxBaddieSize / duration) * (duration - this.levelCountdown)

    // use baddie bg graphic to draw animating star "birth" bg
    const baddie = {
      position: { x: this.windowWidth / 2, y: this.windowHeight / 2 },
      velocity: this.createVector(0, 0),
      radius: currentSize,
      maxRadius: 40,
      c: { baddie: [0, 0, 0, 1], strokeColor: '#FFF', strokeWidth: 1.5 },
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

    const w = 254
    // const rateCheck = 50
    // const rate = this.p5Frames % rateCheck
    // const numberOfDots =
    // rate < rateCheck / 3 ? '.' : rate < rateCheck * (2 / 3) ? '..' : '...'
    if (this.levelCountdown < 125) {
      this.drawTextBubble({
        text: 'a new day...',
        w,
        x: this.windowWidth / 2 - w / 2,
        y: msgY,
        fg: THEME.iris_30,
        stroke: THEME.iris_60,
        bg: 'black'
      })
    }
    if (this.levelCountdown <= 0) {
      this.introStage++
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
      radius: 110,
      backgroundOnly: true,
      c: { baddie: [0, 0, 120, 1], strokeColor: '#FFF', strokeWidth: 0 },
      rotationSpeedOffset: 0.85
    }
    const baddie2 = JSON.parse(JSON.stringify(baddie))
    baddie2.radius = baddie.radius * 0.85

    this.p.push()
    this.p.translate(baddie.position.x, baddie.position.y)
    this.drawBaddie(baddie)

    this.p.rotate(0.2554326)
    this.drawBaddie(baddie2)
    this.p.pop()

    const body = this.bodies[0]
    this.drawBody(body)

    const w = 275
    // const rateCheck = 50
    // const rate = this.p5Frames % rateCheck
    // const numberOfDots =
    // rate < rateCheck / 3 ? '.' : rate < rateCheck * (2 / 3) ? '..' : '...'
    this.drawTextBubble({
      text: 'a new BODY !',
      w,
      x: this.windowWidth / 2 - w / 2,
      y: msgY,
      fg: THEME.iris_30,
      stroke: THEME.iris_60,
      bg: 'black'
    })
    if (this.levelCountdown <= 0) {
      this.introStage++
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
        b.velocity.x = 6.5
        b.velocity.y = 4
        return b
      })(),
      {
        position: { x: 100, y: 100 },
        velocity: { x: 0, y: 0 },
        radius: 42,
        c: { baddie: this.bodies[0].c.baddie }
      }
    ]

    this.introBodies.forEach((body) => this.drawBody(body))

    if (this.p5Frames % this.P5_FPS_MULTIPLIER == 0) {
      const results = this.step(this.introBodies, this.missiles)

      this.introBodies = results.bodies
      this.missiles = results.missiles
    }

    let w,
      text,
      fg = THEME.iris_30,
      stroke = THEME.iris_60

    const chunk_1 = 1.5 * this.P5_FPS
    const chunk_2 = 2.5 * this.P5_FPS
    const chunk_3 = 2 * this.P5_FPS
    const levelMaxTime = chunk_1 + chunk_2 + chunk_3
    if (this.levelCounting < chunk_1) {
      w = 180
      text = 'oh no !!'
    } else if (this.levelCounting < chunk_1 + chunk_2) {
      w = 530
      text = 'a BADDIE came into orbit !!'
    } else {
      this.missilesDisabled = false
      w = 268
      text = 'BLAST IT !!!'
      fg = THEME.pink_50
      stroke = THEME.pink_60
    }

    // hit hero
    if (this.introBodies[0].radius == 0 && this.introBodies[1].radius !== 0) {
      const w = 532
      if (this.levelCounting > levelMaxTime) {
        this.drawTextBubble({
          text: 'NOOO blast the other one !!',
          w,
          x: this.windowWidth / 2 - w / 2,
          y: msgY,
          fg,
          stroke,
          bg: 'black'
        })
      }

      // reset intro
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
      }, 2500)
    } else if (
      this.levelCounting < levelMaxTime &&
      this.introBodies[0].radius > 0
    ) {
      // chunk msgs...
      this.drawTextBubble({
        text,
        w,
        x: this.windowWidth / 2 - w / 2,
        y: msgY,
        fg,
        stroke,
        bg: 'black'
      })
    } else if (this.introBodies[1].radius == 0) {
      // hit baddie
      const w = 320
      const text = "BOOM!!  let's go..."
      this.drawTextBubble({
        text,
        w,
        x: this.windowWidth / 2 - w / 2,
        y: msgY,
        fg: THEME.green_50,
        stroke: THEME.green_75,
        bg: 'black'
      })

      this.timeout ||= setTimeout(() => {
        this.introStage++
        clearTimeout(this.timeout)
        this.timeout = null
        this.skipAhead = true
        this.handleGameOver({ won: true })
        this.playedIntro = true
      }, 3000)
    } else {
      // tip
      const { h } = this.drawTextBubble({})
      const gttr = 24
      const w = this.hasTouched ? 300 : 520
      const y = this.windowHeight - h - gttr

      this.drawTextBubble({
        text: this.hasTouched ? 'TAP to Shoot' : 'CLICK or {SPACE} to shoot',
        w,
        x: this.windowWidth / 2 - w / 2,
        y,
        fg: THEME.pink_50,
        stroke: THEME.pink_60
      })
    }
  },
  skipIntro() {
    this.missilesDisabled = false
    this.introStage = 3
    this.levelCounting = 99999
    this.skipAhead = true
    this.handleGameOver({ won: true })
    this.playedIntro = true
  },
  drawSkipButton() {
    const width = 180
    const pad = 12
    this.drawButton({
      text: 'SKIP',
      onClick: () => {
        this.skipIntro()
      },
      bg: THEME.teal_75,
      fg: THEME.teal_50,
      width,
      height: 58,
      stroke: THEME.teal_75,
      x: this.windowWidth - pad - width,
      y: pad,
      p: this.p
    })
  }
}
