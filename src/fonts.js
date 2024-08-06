import dot from 'data-url:/public/fonts/A000-Dots-edited-subsetAlphaNumPuncSimple.ttf'
import body from 'data-url:/public/fonts/Space-Notorious-rounded.otf'
// n.b. to make this font load, I had to remove the leading numbers from the filename
export const fonts = { body: null, dot: null }
export async function loadFonts(p) {
  const toLoad = { body: body, dot: dot }

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
