import { fonts } from './fonts'

export const Buttons = {
  drawButton({ text, x, y, height, width, onClick }) {
    const { p } = this
    this.p.textFont(fonts.dot)

    // register the button if it's not registered
    const key = `${x}-${y}-${height}-${width}`
    let button = this.buttons[key]
    if (!button) {
      this.buttons[key] = { x, y, height, width, onClick }
      button = this.buttons[key]
    }

    p.push()
    p.stroke('white')
    p.textSize(48)
    p.strokeWeight(button.active ? 1 : 4)
    if (button.hover) {
      p.fill('rgba(255,255,255,0.5)')
    } else {
      p.noFill()
    }
    p.rect(x, y, width, height, height / 2)
    p.noStroke()
    p.fill('white')
    p.textAlign(p.CENTER, p.CENTER)
    p.text(text, x + width / 2, y + height / 2)
    p.pop()
  }
}
