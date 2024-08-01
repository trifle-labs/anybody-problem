import { space, dots } from './files.js'

// n.b. to make this font load, I had to remove the leading numbers from the filename
export const fonts = { body: null, dot: null }
export async function loadFonts(p) {
  const spaceArray = Uint8Array.from(atob(space), (e) => e.charCodeAt(0))
  const dotArray = Uint8Array.from(atob(dots), (e) => e.charCodeAt(0))
  const toLoad = { body: spaceArray, dot: dotArray }

  for (const fontName in toLoad) {
    if (fonts[fontName]) continue

    const url = toLoad[fontName]
    const handleError = (err) => {
      console.log('font load error', err)
      // fall back to sans
      fonts[fontName] = 'sans-serif'
    }
    p.loadFont(
      url,
      (font) => {
        fonts[fontName] = font
      },
      handleError
    )
  }
}

export function drawKernedText(p, text, x, y, kerning) {
  let start = x
  for (const char of text.split('')) {
    p.text(char, start, y)
    start += p.textWidth(char) + kerning
  }
}
