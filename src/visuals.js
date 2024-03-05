
const eyeArray = ['≖', '✿', 'ಠ', '◉', '۞', '◉', 'ಡ', '˘', '❛', '⊚', '✖', 'ᓀ', '◔', 'ಠ', '⊡', '◑', '■', '↑', '༎', 'ಥ', 'ཀ', '╥', '☯']
const mouthArray = ['益', '﹏', '෴', 'ᗜ', 'ω']//'_', '‿', '‿‿', '‿‿‿', '‿‿‿‿', '‿‿‿‿‿', '‿‿‿‿‿‿', '‿‿‿‿‿‿‿', '‿‿‿‿‿‿‿‿', '‿‿‿‿‿‿‿‿‿']

export const Visuals = {


  async draw() {
    const isNotFirstFrame = this.frames !== 0
    const notPaused = !this.paused
    const framesIsAtStopEveryInterval = this.frames % this.stopEvery == 0
    const didNotJustPause = !this.justPaused
    if (isNotFirstFrame && notPaused && framesIsAtStopEveryInterval && didNotJustPause) {
      if (didNotJustPause) {
        this.finish()
      }
      if (this.optimistic) {
        this.started()
      }
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

    // this.playSounds()
    await this.drawBg()
    this.drawBodyTrails()
    this.drawBodies()


    if (this.mode == 'game') {
      this.drawMissiles()
      this.drawExplosions()
      this.drawGun()
    }
    // this.drawBodyOutlines()

    this.drawScore()
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
  async drawBg() {
    if (this.mode == 'nft') {

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
          this.starBG.text(strings[this.random(0, strings.length - 1)], this.random(0, this.windowWidth), this.random(0, this.windowHeight))
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

      const basicX = (this.frames / 50) * (this.frames / 50) % this.windowWidth
      const basicY = (this.frames / 50) * (this.frames / 50) % this.windowHeight

      // const basicX = this.accumX % this.windowWidth
      // const basicY = this.accumY % this.windowHeight

      const Xleft = basicX - this.windowWidth
      const Xright = basicX + this.windowWidth

      const Ytop = basicY - this.windowHeight
      const Ybottom = basicY + this.windowHeight

      this.p.image(this.starBG, basicX, basicY, this.windowWidth, this.windowHeight)
      this.p.image(this.starBG, Xleft, basicY, this.windowWidth, this.windowHeight)
      this.p.image(this.starBG, Xright, basicY, this.windowWidth, this.windowHeight)
      this.p.image(this.starBG, basicX, Ytop, this.windowWidth, this.windowHeight)
      this.p.image(this.starBG, basicX, Ybottom, this.windowWidth, this.windowHeight)
      this.p.image(this.starBG, Xleft, Ytop, this.windowWidth, this.windowHeight)
      this.p.image(this.starBG, Xright, Ytop, this.windowWidth, this.windowHeight)
      this.p.image(this.starBG, Xleft, Ybottom, this.windowWidth, this.windowHeight)
      this.p.image(this.starBG, Xright, Ybottom, this.windowWidth, this.windowHeight)


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
        this.p.line(i * (this.windowWidth / totalLines), 0, i * (this.windowWidth / totalLines), this.windowHeight)
        this.p.line(0, i * (this.windowHeight / totalLines), this.windowWidth, i * (this.windowHeight / totalLines))
      }

      /*
            if (!this.bgGenerated) {
              console.log('again')
      
              // bg gradient
      
              this.bgGenerated = this.p.createGraphics(this.windowWidth, this.windowHeight)
              // this.bgGenerated.background(this.bgColor)
      
              // this.img = this.p.createGraphics(this.windowWidth, this.windowHeight)
              // this.img.fill('red')
              // this.img.ellipse(this.windowWidth / 2, this.windowHeight / 2, this.windowWidth, this.windowHeight)
      
              this.img = await new Promise((resolve) => {
                this.p.loadImage('/bg-2-blur.png', (img) => {
                  resolve(img)
                })
              })
              // console.log('promise returned')
              this.bgGenerated.image(this.img, 0, 0, this.windowWidth, this.windowHeight)
      
              for (let r = this.windowWidth; r > 0; r -= 20) {
                // let gradient = this.p.map(r, 0, this.windowWidth * 3, 0.01, 0)
                // console.log({ gradient })
                // this.bgGenerated.fill('rgba(0,0,0,0.01)')
                // this.bgGenerated.noStroke()
                // this.bgGenerated.ellipse(this.windowWidth / 2, this.windowHeight / 2, r, r)
              }
              // for (let r = this.windowWidth; r > 0; r--) {
              //   let gradient = this.p.map(r, 0, this.windowWidth, 0, 255)
              //   this.bgGenerated.fill(gradient)
              //   this.bgGenerated.noStroke()
              //   this.bgGenerated.ellipse(this.windowWidth / 2, this.windowHeight / 2, r * 2, r * 2)
              // }
      
      
      
      
            }
            // this.p.filter(this.p.BLUR, false)
            this.p.image(this.bgGenerated, 0, 0, this.windowWidth, this.windowHeight)
            // this.p.background(this.bgColor)
            return
          }
          */
      // this.p.background(this.bgColor)
      // this.p.background('white')
      // this.p.stroke('rgba(0,0,0,1)')
      // this.p.stroke('white')
      // this.p.strokeWeight(1)
      // const totalLines = 6
      // for (let i = 1; i < totalLines; i++) {
      //   if (i % 5 == 0) {
      //     this.p.strokeWeight(2)
      //     // this.p.stroke(`hsl(${i * (360 / totalLines)}, 100%, 50%)`)
      //   } else {
      //     this.p.strokeWeight(1)
      //     // this.p.stroke('rgba(0,0,0,0.1)')
      //   }
      //   this.p.line(i * (this.windowWidth / totalLines), 0, i * (this.windowWidth / totalLines), this.windowHeight)
      //   this.p.line(0, i * (this.windowHeight / totalLines), this.windowWidth, i * (this.windowHeight / totalLines))
      // }
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
  },

  getColorDir(chunk) {
    return Math.floor(this.frames / (255 * chunk)) % 2 == 0
  },

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
    if (this.mode == 'nft') {
      // this.accumulateFrameRate += this.frameRate()
      // console.log(this.accumulateFrameRate, this.p.frameRate())
      // if (this.frames % 10 == 0) {
      //   this.averageFrameRate = this.accumulateFrameRate / 10
      //   this.accumulateFrameRate = 0
      // }
      this.p.noStroke()
      this.p.fill('white')
      // this.p.rect(0, 0, 50, 20)
      // this.p.fill(this.getNotGrey())
      this.p.textAlign(this.p.RIGHT) // Right-align the text
      this.p.text(this.preRun + this.frames, 45, 15) // Adjust the x-coordinate to align the text
      this.p.text(this.frameRate().toFixed(2), 45, 35)
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
  },

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
    this.p.fill('black')
    for (let i = 0; i < this.missiles.length; i++) {
      const body = this.missiles[i]
      this.p.strokeWeight(0)
      this.p.ellipse(body.position.x, body.position.y, body.radius / 2, body.radius / 2)
    }
  },


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
  },

  convertColor(c, isGrey = true) {
    const cc = c.replace('rgba(', '').replace(')', '')
    const r = parseInt(cc.split(',')[0]) + Math.floor((isGrey ? this.getGrey() : this.getNotGrey()) / 2)
    const g = parseInt(cc.split(',')[1]) + Math.floor((isGrey ? this.getGrey() : this.getNotGrey()) / 2)
    const b = parseInt(cc.split(',')[2]) + Math.floor((isGrey ? this.getGrey() : this.getNotGrey()) / 2)
    return [r, g, b]
    // this.bodiesGraphic.color(r, g, b)
  },
  componentToHex(c) {
    var hex = parseInt(c).toString(16)
    return hex.length == 1 ? '0' + hex : hex
  },

  rgbToHex(r, g, b) {
    return '0x' + this.componentToHex(r) + this.componentToHex(g) + this.componentToHex(b)
  },
  hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null
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

  async drawBody(x, y, v, radius, c, i) {
    this.bodiesGraphic.fill(c)
    this.bodiesGraphic.noStroke()
    this.bodiesGraphic.ellipse(x, y, radius, radius)
    this.bodiesGraphic.push()
    this.bodiesGraphic.translate(x, y)
    var angle = v.heading() + this.p.PI / 2
    this.bodiesGraphic.rotate(angle)
    // const eyeOffsetX = radius / 5
    // const eyeOffsetY = radius / 12
    // this.bodiesGraphic.fill('rgba(0,0,0,0.3)')
    // this.bodiesGraphic.filter(this.p.BLUR)
    // this.bodiesGraphic.ellipse(- eyeOffsetX, - eyeOffsetY, radius / 7, radius / 5)
    // this.bodiesGraphic.ellipse(eyeOffsetX, - eyeOffsetY, radius / 7, radius / 5)
    // this.bodiesGraphic.ellipse(0, + eyeOffsetY, radius / 7, radius / 7)
    // this.bodiesGraphic.fill(i % 2 == 0 ? 'white' : this.randomColor(0, 255))
    this.bodiesGraphic.textSize(radius / 2.2)
    // this.bodiesGraphic.blendMode(this.p.BLEND)

    const eyeIndex = i % eyeArray.length
    const mouthIndex = i % mouthArray.length
    const face = eyeArray[eyeIndex] + mouthArray[mouthIndex] + eyeArray[eyeIndex]
    this.bodiesGraphic.push()

    if (v.x > 0) {
      this.bodiesGraphic.scale(-1, 1)
    }
    if (v.y > 0) {
      this.bodiesGraphic.scale(1, -1)
    }
    // this.bodiesGraphic.blendMode(this.p.BLEND)
    const invertedC = this.invertColor(c)
    // const solidColor = c.replace('0.1', '1')
    this.bodiesGraphic.fill(c)//'grey')
    this.bodiesGraphic.strokeWeight(10)
    this.bodiesGraphic.stroke(c)
    this.bodiesGraphic.text(face, -radius / 2.4, radius / 8)

    this.bodiesGraphic.fill(invertedC)//'grey')
    this.bodiesGraphic.noStroke()
    this.bodiesGraphic.text(face, -radius / 2.4, radius / 8)
    // this.bodiesGraphic.blendMode(this.p.DIFFERENCE)
    this.bodiesGraphic.pop()
    // this.bodiesGraphic.blendMode(this.p.DIFFERENCE)

    // this.bodiesGraphic.fill(c)
    // this.bodiesGraphic.ellipse(0, 0, radius, radius)

    // if (!this.face) {

    //   this.face = ''
    //   console.log('load face')
    //   this.face = await new Promise((resolve) => {
    //     this.p.loadImage('/3.png', (img) => {
    //       resolve(img)
    //     })
    //   })

    // }
    // // this.bodiesGraphic.blendMode(this.p.BLEND)
    // this.bodiesGraphic.image(this.face, 0, - radius / 3, radius / 3, radius / 3)
    // // this.bodiesGraphic.blendMode(this.p.DIFFERENCE)

    this.bodiesGraphic.pop()



  },

  async drawBodies(attachToCanvas = true) {
    // if (!this.bodiesGraphic) {
    this.bodiesGraphic = this.p.createGraphics(this.windowWidth, this.windowHeight)
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
      let c = body.c
      let finalColor
      if (this.colorStyle == 'squiggle') {
        const hueColor = (parseInt(c.split(',')[1]) + this.frames) % 360
        finalColor = this.bodiesGraphic.color(hueColor, 60, 100) // Saturation and brightness at 100 for pure spectral colors
      } else if (this.mode == 'nft') {
        // console.log(c)
        // finalColor = c

        finalColor = c.replace(this.opac, '0.1')//this.convertColor(c)

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
        await this.drawBody(body.position.x, body.position.y, body.velocity, radius, finalColor, i)

        let loopedX = false, loopedY = false, loopX = body.position.x, loopY = body.position.y
        const loopGap = radius
        if (body.position.x > this.windowWidth - loopGap) {
          loopedX = true
          loopX = body.position.x - this.windowWidth
          // this.bodiesGraphic.ellipse(loopX, body.position.y, radius, radius)
          await this.drawBody(loopX, body.position.y, body.velocity, radius, finalColor, i)
        } else if (body.position.x < loopGap) {
          loopedX = true
          loopX = body.position.x + this.windowWidth
          await this.drawBody(loopX, body.position.y, body.velocity, radius, finalColor, i)

          // this.bodiesGraphic.ellipse(loopX, body.position.y, radius, radius)
        }
        if (body.position.y < this.windowHeight - loopGap) {
          loopedY = true
          loopY = body.position.y + this.windowHeight
          // this.bodiesGraphic.ellipse(body.position.x, loopY, radius, radius)
          await this.drawBody(body.position.x, loopY, body.velocity, radius, finalColor, i)

        } else if (body.position.y > loopGap) {
          loopedY = true
          loopY = body.position.y - this.windowHeight
          // this.bodiesGraphic.ellipse(body.position.x, loopY, radius, radius)
          await this.drawBody(body.position.x, loopY, body.velocity, radius, finalColor, i)
        }
        if (loopedX && loopedY) {
          await this.drawBody(loopX, loopY, body.velocity, radius, finalColor, i)
          // this.bodiesGraphic.ellipse(loopX, loopY, body.velocity, radius, radius)
        }


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
    this.frames % this.tailMod == 0 && this.allCopiesOfBodies.push(bodyCopies)
    if (this.allCopiesOfBodies.length > this.tailLength) {
      this.allCopiesOfBodies.shift()
    }


    // this.bodiesGraphic.strokeWeight(0)
    if (attachToCanvas) {
      this.p.image(this.bodiesGraphic, 0, 0)
    }
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
    graphic.image(this.eyes, -body.radius * (size / 2), -body.radius * (size / 2), body.radius * size, body.radius * size)

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
  },


  drawTail(x, y, v, radius, finalColor) {
    // console.log({ finalColor })
    // finalColor = finalColor.replace('50%', '75%')
    this.p.push()
    this.p.translate(x, y)
    // this.p.rotate(angle)
    this.p.fill(finalColor)
    this.p.noStroke()

    this.p.ellipse(0, 0, radius, radius)

    // this.p.image(this.drawTails[id], -radius / 2, -radius)
    this.p.pop()

    // ghost version

    // const id = radius + '-' + finalColor
    // console.log()
    // if (!this.drawTails) {
    //   this.drawTails = {}
    // }
    // if (!this.drawTails || this.drawTails[id] == undefined) {
    //   this.drawTails[id] = this.p.createGraphics(this.windowWidth, this.windowHeight)
    //   this.drawTails[id].noStroke()
    //   this.drawTails[id].fill(finalColor)

    //   this.drawTails[id].beginShape()
    //   // this.drawTails[id].vertex(radius, 0)
    //   // this.drawTails[id].vertex(0, 0)

    //   // this.p.arc(0, 0, radius, radius, this.p.PI, 2 * this.p.PI)
    //   const arcResolution = 20

    //   for (let j = 0; j < arcResolution; j++) {
    //     const ang = this.p.map(j, 0, arcResolution, 0, this.p.PI)
    //     const ax = radius / 2 + this.p.cos(ang) * radius / 2
    //     const ay = (2 * radius / 2 + -1 * this.p.sin(ang) * radius / 2)
    //     this.drawTails[id].vertex(ax, ay)
    //   }



    //   // this.drawTails[id].fill('red')
    //   // this.drawTails[id].rect(0, 0, radius, radius / 2)

    //   const bumps = 7
    //   let bumpHeight = radius / 6
    //   // let heightChanger = radius / 10
    //   // const bumpHeightMax = radius / 5
    //   // const bumpHeightMin = radius / 8
    //   const startY = radius * 1
    //   // this.drawTails[id].push()
    //   let remaindingWidth = radius
    //   for (let i = 0; i < bumps; i++) {
    //     let bumpWidth = radius / bumps
    //     // bumpHeight += heightChanger
    //     // if (bumpHeight > bumpHeightMax || bumpHeight < bumpHeightMin) {
    //     //   heightChanger *= -1
    //     // }
    //     let x = radius - remaindingWidth
    //     if (i % 2 == 1) {
    //       // this.drawTails[id].arc(x + bumpWidth / 2, startY, bumpWidth, bumpHeight, this.drawTails[id].PI, 0, this.drawTails[id].OPEN)
    //       for (let j = 0; j < arcResolution; j++) {
    //         const ang = this.p.map(j, 0, arcResolution, this.p.PI, 0)
    //         const ax = x + bumpWidth / 2 + this.p.cos(ang) * bumpWidth / 2
    //         const ay = startY + bumpHeight + -1 * this.p.sin(ang) * bumpHeight / 2
    //         this.drawTails[id].vertex(ax, ay)
    //       }
    //     } else {
    //       for (let j = 0; j < arcResolution; j++) {
    //         const ang = this.p.map(j, 0, arcResolution, this.p.PI, 0)
    //         const ax = x + bumpWidth / 2 + this.p.cos(ang) * bumpWidth / 2
    //         const ay = startY + bumpHeight + this.p.sin(ang) * bumpHeight / 2
    //         this.drawTails[id].vertex(ax, ay)
    //       }
    //       // this.drawTails[id].arc(x + bumpWidth / 2, startY + bumpWidth, bumpWidth, bumpHeight, 0, this.drawTails[id].PI, this.drawTails[id].OPEN)
    //     }
    //     remaindingWidth -= bumpWidth
    //   }
    //   this.drawTails[id].endShape(this.drawTails[id].CLOSE)
    //   // this.drawTails[id].pop()

    // }

    // // this.drawTails[id].push()
    // // this.drawTails[id].translate(x, y)
    // var angle = v.heading() + this.p.PI / 2
    // // this.drawTails[id].rotate(angle)
    // // this.drawTails[id].fill(finalColor)
    // // this.drawTails[id].fill('rgba(255,0,0,1)')
    // // this.drawTails[id].rect(0, 0, radius, radius / 4)
    // // this.drawTails[id].pop()
    // this.p.push()
    // this.p.translate(x, y)
    // this.p.rotate(angle)
    // this.p.image(this.drawTails[id], -radius / 2, -radius)
    // this.p.pop()



  },

  drawBodyTrails() {
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
          finalColor = c//this.convertColor(c)
        }
        this.p.fill(finalColor)
        if (this.mode == 'nft') {
          const radius = body.radius * 4 + this.radiusMultiplyer

          // this.p.ellipse(body.position.x, body.position.y, radius, radius)
          this.p.push()
          this.p.translate(body.position.x, body.position.y)
          this.p.rotate(body.velocity.heading() + this.p.PI / 2)
          // this.p.arc(0, 0, radius, radius, this.p.PI, 2 * this.p.PI)
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
  }
}