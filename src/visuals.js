const WITHERING_STEPS = 200
const FACE_PNGS = [
  new URL('../public/faces/face1.png', import.meta.url).href,
  // new URL('../public/faces/face2.png', import.meta.url).href,
  new URL('../public/faces/face3.png', import.meta.url).href,
  new URL('../public/faces/face4.png', import.meta.url).href,
  new URL('../public/faces/face5.png', import.meta.url).href,
  new URL('../public/faces/face6.png', import.meta.url).href,
  new URL('../public/faces/face7.png', import.meta.url).href,
  new URL('../public/faces/face8.png', import.meta.url).href,
  new URL('../public/faces/face9.png', import.meta.url).href,
  new URL('../public/faces/face10.png', import.meta.url).href,
  // new URL('../public/faces/face11.png', import.meta.url).href,
  new URL('../public/faces/face12.png', import.meta.url).href
]

export const Visuals = {
  async draw() {
    if (!this.showIt) return

    const enoughBodies =
      this.bodies.filter((b) => !b.life || b.life > 0).length >= 3

    // when there are 3 or more bodies, step the simulation
    if (enoughBodies) {
      this.frames++
      const results = this.step(this.bodies, this.missiles)
      this.bodies = results.bodies || []
      this.missiles = results.missiles || []
    } else {
      // if less than 3 just finish the withering animation
      // TODO: add some sort of instructional message to screen that new bodies are needed to progress the simulation
    }

    this.p.noFill()
    this.drawBg()
    this.drawTails()
    this.drawBodies()
    this.drawWitheringBodies()

    if (this.frames % 10 == 0) {
      this.sound?.render(this)
    }

    if (this.mode == 'game') {
      this.drawMissiles()
      this.drawExplosions()
      this.drawGun()
    }
    // this.drawBodyOutlines()

    this.drawPause()
    this.drawScore()

    const isNotFirstFrame = this.frames !== 0
    const notPaused = !this.paused
    const framesIsAtStopEveryInterval = this.frames % this.stopEvery == 0
    const didNotJustPause = !this.justPaused
    if (
      isNotFirstFrame &&
      notPaused &&
      framesIsAtStopEveryInterval &&
      didNotJustPause
    ) {
      if (didNotJustPause && enoughBodies) {
        this.finish()
      }
      // if (this.optimistic && enoughBodies) {
      //   this.started()
      // }
    } else {
      this.justPaused = false
    }
  },
  drawPause() {
    if (this.paused) {
      this.p.noStroke()
      this.p.strokeWeight(0)
      this.p.fill('rgba(0,0,0,0.4)')
      this.p.rect(0, 0, this.windowWidth, this.windowHeight)
      this.p.push()
      this.p.fill('white')
      this.p.translate(this.windowWidth / 2, this.windowHeight / 2)
      this.p.triangle(-100, -100, -100, 100, 100, 0)
      this.p.pop()
    }
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

  drawStarBg() {
    this.p.background('rgb(10,10,10)')
    // this.p.background('white')
    if (!this.starBG) {
      this.starBG = this.p.createGraphics(this.windowWidth, this.windowHeight)
      for (let i = 0; i < 200; i++) {
        // this.starBG.stroke('black')
        this.starBG.noStroke()
        // this.starBG.fill('rgba(255,255,255,0.6)')
        // this.starBG.fill('black')
        this.starBG.fill('white')
        this.starBG.textSize(20)
        const strings = [',', '.', '*']
        this.starBG.text(
          strings[this.random(0, strings.length - 1)],
          this.random(0, this.windowWidth),
          this.random(0, this.windowHeight)
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

    const basicX = ((this.frames / 50) * (this.frames / 50)) % this.windowWidth
    const basicY = ((this.frames / 50) * (this.frames / 50)) % this.windowHeight

    // const basicX = this.accumX % this.windowWidth
    // const basicY = this.accumY % this.windowHeight

    const Xleft = basicX - this.windowWidth
    const Xright = basicX + this.windowWidth

    const Ytop = basicY - this.windowHeight
    const Ybottom = basicY + this.windowHeight

    this.p.image(
      this.starBG,
      basicX,
      basicY,
      this.windowWidth,
      this.windowHeight
    )
    this.p.image(
      this.starBG,
      Xleft,
      basicY,
      this.windowWidth,
      this.windowHeight
    )
    this.p.image(
      this.starBG,
      Xright,
      basicY,
      this.windowWidth,
      this.windowHeight
    )
    this.p.image(this.starBG, basicX, Ytop, this.windowWidth, this.windowHeight)
    this.p.image(
      this.starBG,
      basicX,
      Ybottom,
      this.windowWidth,
      this.windowHeight
    )
    this.p.image(this.starBG, Xleft, Ytop, this.windowWidth, this.windowHeight)
    this.p.image(this.starBG, Xright, Ytop, this.windowWidth, this.windowHeight)
    this.p.image(
      this.starBG,
      Xleft,
      Ybottom,
      this.windowWidth,
      this.windowHeight
    )
    this.p.image(
      this.starBG,
      Xright,
      Ybottom,
      this.windowWidth,
      this.windowHeight
    )

    const totalLines = 6
    // this.p.stroke('black')
    this.p.stroke('white')
    for (let i = 0; i < totalLines; i++) {
      if (i % 5 == 5) {
        this.p.strokeWeight(1)
        // this.starBG.stroke(`hsl(${i * (360 / totalLines)}, 100%, 50%)`)
      } else {
        this.p.strokeWeight(1)
      }
      this.p.line(
        i * (this.windowWidth / totalLines),
        0,
        i * (this.windowWidth / totalLines),
        this.windowHeight
      )
      this.p.line(
        0,
        i * (this.windowHeight / totalLines),
        this.windowWidth,
        i * (this.windowHeight / totalLines)
      )
    }
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

  drawBg() {
    this.drawStarBg()
    // this.drawSolidBg()
    // this.drawStaticBg()
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
    this.p.noStroke()
    if (this.mode == 'nft') {
      // this.accumulateFrameRate += this.frameRate()
      // console.log(this.accumulateFrameRate, this.p.frameRate())
      // if (this.frames % 10 == 0) {
      //   this.averageFrameRate = this.accumulateFrameRate / 10
      //   this.accumulateFrameRate = 0
      // }
      this.p.fill('white')
      // this.p.rect(0, 0, 50, 20)
      // this.p.fill(this.getNotGrey())
      this.p.textSize(50)
      this.p.textAlign(this.p.LEFT) // Right-align the text
      this.p.text(`${this.frames} t`, 65, 50) // Adjust the x-coordinate to align the text
      this.p.text(`${this.frameRate().toFixed(2)} fps`, 65, 100)
    } else {
      this.p.fill('white')
      // this.p.rect(0, 0, 50, 20)
      // this.p.fill('black')
      // this.p.textAlign(this.p.RIGHT) // Right-align the text
      const secondsAsTime = new Date(this.totalSec * 1000)
        .toISOString()
        .substr(14, 5)
      const thisLevelSecondsAsTime = new Date(this.thisLevelSec * 1000)
        .toISOString()
        .substr(14, 5)
      this.p.text('Total Frames: ' + this.preRun + this.frames, 50, 10) // Adjust the x-coordinate to align the text
      this.p.text('Total Time: ' + secondsAsTime, 50, 20) // Adjust the x-coordinate to align the text
      this.p.text('Total Shots: ' + this.missileCount, 50, 30) // Adjust the x-coordinate to align the text
      this.p.text(
        'Lvl ' +
          (this.startingBodies - 2) +
          ' - ' +
          thisLevelSecondsAsTime +
          ' - ' +
          (this.startingBodies - this.bodies.length) +
          '/' +
          this.startingBodies +
          ' - ' +
          this.thisLevelMissileCount +
          ' shots',
        50,
        40
      ) // Adjust the x-coordinate to align the text
      for (let i = 0; i < this.allLevelSec.length; i++) {
        const prevLevel = this.allLevelSec[i]
        const prevLevelSecondsAsTime = new Date(prevLevel.thisLevelSec * 1000)
          .toISOString()
          .substr(14, 5)
        this.p.text(
          'Lvl ' +
            (this.allLevelSec.length - i) +
            ' - ' +
            prevLevelSecondsAsTime +
            ' - ' +
            prevLevel.thisLevelMissileCount +
            ' shots',
          50,
          i * 10 + 50
        ) // Adjust the x-coordinate to align the text
      }
    }
  },

  drawGun() {
    this.p.stroke('rgba(200,200,200,1)')
    this.p.strokeCap(this.p.SQUARE)
    this.p.strokeWeight(10)
    const canvas = document.querySelector('canvas')
    // Bottom left corner coordinates
    let startX = 0
    let startY = this.windowHeight

    const scaleX = (val) => {
      return (val / canvas.offsetWidth) * this.windowWidth
    }
    const scaleY = (val) => {
      return (val / canvas.offsetHeight) * this.windowHeight
    }
    // Calculate direction from bottom left to mouse
    let dirX = scaleX(this.p.mouseX) - startX
    let dirY = scaleY(this.p.mouseY) - startY

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
  },

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
  },

  drawMissiles() {
    this.p.fill('red')
    this.p.noStroke()
    this.p.strokeWeight(0)
    for (let i = 0; i < this.missiles.length; i++) {
      const body = this.missiles[i]
      this.p.ellipse(body.position.x, body.position.y, body.radius, body.radius)
      // this.p.textSize(40)
      // this.p.text(
      //   `${body.position.x}, ${body.position.y}`,
      //   body.position.x,
      //   body.position.y
      // )
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

  convertColor(c, isGrey = true) {
    const cc = c.replace('rgba(', '').replace(')', '')
    const r =
      parseInt(cc.split(',')[0]) +
      Math.floor((isGrey ? this.getGrey() : this.getNotGrey()) / 2)
    const g =
      parseInt(cc.split(',')[1]) +
      Math.floor((isGrey ? this.getGrey() : this.getNotGrey()) / 2)
    const b =
      parseInt(cc.split(',')[2]) +
      Math.floor((isGrey ? this.getGrey() : this.getNotGrey()) / 2)
    return [r, g, b]
    // this.bodiesGraphic.color(r, g, b)
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

  invertColor(c) {
    let [r, g, b] = c.replace('rgba(', '').split(',').slice(0, 3)
    const hexColor = this.rgbToHex(r, g, b)
    const invert = (parseInt(hexColor) ^ 0xffffff).toString(16).padStart(6, '0')
    const invertRGB = this.hexToRgb(invert)
    // r = r - 255
    // g = g - 255
    // b = b - 255
    const newColor = this.p.color(invertRGB.r, invertRGB.g, invertRGB.b)
    return newColor
  },

  ghostEyes(radius) {
    const eyeOffsetX = radius / 5
    const eyeOffsetY = radius / 12
    this.bodiesGraphic.fill('rgba(0,0,0,0.3)')
    this.bodiesGraphic.filter(this.p.BLUR)
    this.bodiesGraphic.ellipse(-eyeOffsetX, -eyeOffsetY, radius / 7, radius / 5)
    this.bodiesGraphic.ellipse(eyeOffsetX, -eyeOffsetY, radius / 7, radius / 5)
    this.bodiesGraphic.ellipse(0, +eyeOffsetY, radius / 7, radius / 7)
    // this.bodiesGraphic.fill(i % 2 == 0 ? 'white' : this.randomColor(0, 255))
  },

  drawStyleGhost(x, y, v, radius) {
    this.ghostEyes(radius)
  },

  drawPngFace(radius, body) {
    this.pngFaces ||= []
    const faceIdx = body.mintedBodyIndex || body.bodyIndex
    const face = this.pngFaces[faceIdx]
    if (!face) {
      const png = FACE_PNGS[faceIdx]
      this.p.loadImage(png, (img) => {
        this.pngFaces[faceIdx] = img
      })
    }
    if (face) {
      this.bodiesGraphic.image(
        face,
        -radius / 3,
        -radius / 3,
        radius / 1.5,
        radius / 1.5
      )
    }
  },

  drawGlyphFace(radius, body) {
    const eyeArray = [
      '≖',
      '✿',
      'ಠ',
      '◉',
      '۞',
      '◉',
      'ಡ',
      '˘',
      '❛',
      '⊚',
      '✖',
      'ᓀ',
      '◔',
      'ಠ',
      '⊡',
      '◑',
      '■',
      '↑',
      '༎',
      'ಥ',
      'ཀ',
      '╥',
      '☯'
    ]
    const mouthArray = [
      '益',
      '﹏',
      '෴',
      'ᗜ',
      'ω',
      '_',
      '‿',
      '‿‿',
      '‿‿‿',
      '‿‿‿‿',
      '‿‿‿‿‿',
      '‿‿‿‿‿‿',
      '‿‿‿‿‿‿‿',
      '‿‿‿‿‿‿‿‿',
      '‿‿‿‿‿‿‿‿‿'
    ]

    const c = body.c.replace(this.opac, '0.1')
    const i = this.bodies.indexOf(body) // TODO: change to bodyId

    this.bodiesGraphic.noStroke()
    this.bodiesGraphic.fill(c)
    this.bodiesGraphic.ellipse(0, 0, radius, radius)
    this.bodiesGraphic.textSize(radius / 2.2)
    const eyeIndex = i % eyeArray.length
    const mouthIndex = i % mouthArray.length
    const face =
      eyeArray[eyeIndex] + mouthArray[mouthIndex] + eyeArray[eyeIndex]

    this.bodiesGraphic.fill(c)
    this.bodiesGraphic.strokeWeight(10)
    this.bodiesGraphic.stroke(c)
    this.bodiesGraphic.text(face, -radius / 2.4, radius / 8)

    const invertedC = this.invertColor(c)
    this.bodiesGraphic.fill(invertedC)
    this.bodiesGraphic.noStroke()
    this.bodiesGraphic.text(face, -radius / 2.4, radius / 8)

    // hp in white text
    this.bodiesGraphic.fill('white')
    this.bodiesGraphic.textSize(radius / 4)
    this.bodiesGraphic.textAlign(this.p.CENTER, this.p.CENTER)
    this.bodiesGraphic.text(body.life, 0, radius)
  },

  drawBodyStyle1(radius, body) {
    const c = body.c.replace(this.opac, '0.1')
    this.bodiesGraphic.noStroke()
    this.bodiesGraphic.fill(c)
    this.bodiesGraphic.ellipse(0, 0, radius, radius)

    this.bodiesGraphic.fill('white')
    this.bodiesGraphic.textSize(50)
    this.bodiesGraphic.text(`${body.starLvl} / ${body.maxStarLvl}`, 0, radius)
  },

  moveAndRotate_PopAfter(graphic, x, y, v) {
    graphic.push()
    graphic.translate(x, y)
    const angle = v.heading() + this.p.PI / 2
    graphic.rotate(angle)
    // if (v.x > 0) {
    //   graphic.scale(-1, 1)
    // }
    // if (v.y > 0) {
    //   graphic.scale(1, -1)
    // }
  },

  drawBody(x, y, v, radius, body) {
    this.moveAndRotate_PopAfter(this.bodiesGraphic, x, y, v)

    switch (body.bodyStyle) {
      default:
        this.drawBodyStyle1(radius, body)
    }
    if ((body.mintedBodyIndex || body.bodyIndex) <= FACE_PNGS.length) {
      this.drawPngFace(radius, body)
    } else {
      this.drawGlyphFace(radius, body)
    }

    this.bodiesGraphic.pop()
  },

  drawBodiesLooped(body, drawFunction) {
    drawFunction = drawFunction.bind(this)
    const radius = body.radius * 4 + this.radiusMultiplyer
    drawFunction(body.position.x, body.position.y, body.velocity, radius, body)

    let loopedX = false,
      loopedY = false,
      loopX = body.position.x,
      loopY = body.position.y
    const loopGap = radius / 2

    // crosses right, draw on left
    if (body.position.x > this.windowWidth - loopGap) {
      loopedX = true
      loopX = body.position.x - this.windowWidth
      drawFunction(loopX, body.position.y, body.velocity, radius, body)
      // crosses left, draw on right
    } else if (body.position.x < loopGap) {
      loopedX = true
      loopX = body.position.x + this.windowWidth
      drawFunction(loopX, body.position.y, body.velocity, radius, body)
    }

    // crosses bottom, draw on top
    if (body.position.y > this.windowHeight - loopGap) {
      loopedY = true
      loopY = body.position.y - this.windowHeight
      drawFunction(body.position.x, loopY, body.velocity, radius, body)
      // crosses top, draw on bottom
    } else if (body.position.y < loopGap) {
      loopedY = true
      loopY = body.position.y + this.windowHeight
      drawFunction(body.position.x, loopY, body.velocity, radius, body)
    }

    // crosses corner, draw opposite corner
    if (loopedX && loopedY) {
      drawFunction(loopX, loopY, body.velocity, radius, body)
    }
  },

  drawWitheringBodies() {
    this.bodiesGraphic ||= this.p.createGraphics(
      this.windowWidth,
      this.windowHeight
    )
    this.bodiesGraphic.noStroke()
    for (const body of this.witheringBodies) {
      // the body should shrink to nothing as HP goes from 0 to -WITHERING_STEPS
      const witherMultiplier = 1 + body.life / WITHERING_STEPS
      const radius =
        (body.radius * 4 + this.radiusMultiplyer) * witherMultiplier

      // render as a white circle
      this.bodiesGraphic.fill('white')
      this.bodiesGraphic.ellipse(
        body.position.x,
        body.position.y,
        radius,
        radius
      )
    }
  },

  async drawBodies(attachToCanvas = true) {
    this.bodiesGraphic ||= this.p.createGraphics(
      this.windowWidth,
      this.windowHeight
    )
    this.bodiesGraphic.noStroke()

    // this.bodiesGraphic.blendMode(this.p.DIFFERENCE)
    // }
    // this.bodiesGraphic.clear()
    // if (this.mode == 'nft') this.drawBorder()
    // this.bodiesGraphic.strokeWeight(1)
    const bodyCopies = []
    for (let i = 0; i < this.bodies.length; i++) {
      // const body = this.bodies.sort((a, b) => b.radius - a.radius)[i]
      const body = this.bodies[i]
      if (body.life <= 0) continue
      let c = body.c
      // let finalColor
      // if (this.colorStyle == 'squiggle') {
      //   const hueColor = (parseInt(c.split(',')[1]) + this.frames) % 360
      //   finalColor = this.bodiesGraphic.color(hueColor, 60, 100) // Saturation and brightness at 100 for pure spectral colors
      // } else if (this.mode == 'nft') {
      //   // console.log(c)
      //   // finalColor = c

      //   finalColor = c.replace(this.opac, '1') //this.convertColor(c)
      // } else {
      //   finalColor = c
      // }

      if (this.mode == 'nft') {
        this.drawBodiesLooped(body, this.drawBody)
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
        // const radius = body.radius * 4 + this.radiusMultiplyer
        // this.drawBody(body.position.x, body.position.y, body.velocity, radius, finalColor, i)

        // if (!this.face) {
        //   this.face = await new Promise((resolve) => {
        //     this.p.loadImage('/2.png', (img) => {
        //       console.log('loaded')
        //       resolve(img)
        //     })
        //   })
        // }
        // this.bodiesGraphic.image(this.face, body.position.x - radius / 8, body.position.y - radius / 3, radius / 2, radius / 2)

        // const eyes = this.getAngledImage(body)
        // this.bodiesGraphic.image(eyes, 0, 0)
      } else {
        this.drawBodiesLooped(body, this.drawBody)
        // this.getAngledBody(body, finalColor)
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
    this.frames % this.tailMod == 0 && this.allCopiesOfBodies.push(bodyCopies)
    if (this.allCopiesOfBodies.length > this.tailLength) {
      this.allCopiesOfBodies.shift()
    }

    // this.bodiesGraphic.strokeWeight(0)
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

  drawTailStyle1(x, y, v, radius, finalColor) {
    // finalColor = finalColor.replace('50%', '75%')
    this.p.push()
    this.p.translate(x, y)
    // this.p.rotate(angle)
    this.p.fill(finalColor)
    this.p.noStroke()

    this.p.ellipse(0, 0, radius, radius)

    // this.p.image(this.drawTails[id], -radius / 2, -radius)
    this.p.pop()
  },

  drawTailStyleGhost(x, y, v, radius, finalColor) {
    // ghost version

    const id = radius + '-' + finalColor
    console.log()
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

  drawTails() {
    // this.p.blendMode(this.p.DIFFERENCE)

    // this.bodiesGraphic.filter(this.p.INVERT)
    // // this.bodiesGraphic.blendMode(this.p.SCREEN)
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
          finalColor = c //this.convertColor(c)
        }
        this.p.fill(finalColor)
        // if (this.mode == 'nft') {
        const radius = body.radius * 4 + this.radiusMultiplyer

        // this.p.ellipse(body.position.x, body.position.y, radius, radius)
        this.p.push()
        this.p.translate(body.position.x, body.position.y)
        this.p.rotate(body.velocity.heading() + this.p.PI / 2)
        // this.p.arc(0, 0, radius, radius, this.p.PI, 2 * this.p.PI)
        this.p.pop()

        switch (body.tailStyle) {
          case 1:
            this.drawTailStyle1(
              body.position.x,
              body.position.y,
              body.velocity,
              radius,
              finalColor
            )
            break
          case 'ghost':
            this.drawTailStyleGhost(
              body.position.x,
              body.position.y,
              body.velocity,
              radius,
              finalColor
            )
            break
          default:
            this.drawTailStyle1(
              body.position.x,
              body.position.y,
              body.velocity,
              radius,
              finalColor
            )
        }
        // } else {
        //   this.p.push()
        //   this.p.translate(body.position.x, body.position.y)
        //   var angle = body.velocity.heading() + this.p.PI / 2
        //   this.p.rotate(angle)
        //   let x1 = body.radius * 4 * this.p.cos(this.p.PI / 6)
        //   let y1 = body.radius * 4 * this.p.sin(this.p.PI / 6)

        //   let x2 =
        //     body.radius * 4 * this.p.cos(this.p.PI / 6 + this.p.TWO_PI / 3)
        //   let y2 =
        //     body.radius * 4 * this.p.sin(this.p.PI / 6 + this.p.TWO_PI / 3)

        //   let x3 =
        //     body.radius *
        //     4 *
        //     this.p.cos(this.p.PI / 6 + (2 * this.p.TWO_PI) / 3)
        //   let y3 =
        //     body.radius *
        //     4 *
        //     this.p.sin(this.p.PI / 6 + (2 * this.p.TWO_PI) / 3)
        //   this.p.triangle(x1, y1, x2, y2, x3, y3)
        //   this.p.pop()
        // }
      }
    }
    // this.p.blendMode(this.p.BLEND)
  },

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
  },

  colorArrayToTxt(cc) {
    // let cc = baseColor.map(c => c + start + (chunk * i))
    cc.push(this.opac)
    cc = `rgba(${cc.join(',')})`
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
  }
}
