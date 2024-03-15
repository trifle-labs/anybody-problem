// create a button with a label that will be drawn by p5.js
export function createButton(options) {
  const { label, x, y, width, height, onClick } = options;

  let pressed = false;
  let hovered = false;

  const intersect = (mouseX, mouseY) => {
    return mouseX >= x && mouseX <= x + width && mouseY >= y && mouseY <= y + height;
  }

  const handleMouseMoved = (mouseX, mouseY) => {
    hovered = intersect(mouseX, mouseY);
  }
  
  const handleMousePressed = (clickX, clickY) => {
    console.log('mouse down', clickX, clickY, intersect(clickX, clickY), x, y, width, height)
    pressed = intersect(clickX, clickY);
    if (pressed) {
      if (onClick) onClick();
      return true;
    }
    return false;
  }

  const handleMouseReleased = () => {
    console.log('mouse up')
    pressed = false;
  }

  const draw = (p) => {
    p.rectMode(p.CORNER);
    if (pressed) {
      console.log('pressed')
      p.fill('pink');
      p.rect(x, y, width, height);
    } else if (hovered) {
      console.log('hovered')
      p.fill('rgba(0, 0, 0, 0.2)');
      p.rect(x, y, width, height);
    } else {
      p.fill('rgba(0, 0, 0, 0)');
      p.rect(x, y, width, height);
    }

    p.textSize(12);
    p.textStyle(p.NORMAL);
    p.fill('white');
    p.textAlign(p.CENTER);
    p.text(label, x + width / 2, y + height / 2);
  }

  return {
    handleMouseMoved,
    handleMousePressed,
    handleMouseReleased,
    draw,
  }
}
