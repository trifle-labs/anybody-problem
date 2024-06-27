import bodyFontURL from 'data-url:../public/fonts/Space-Notorious-rounded.otf'
import dotFontURL from 'data-url:../public/fonts/A000-Dots-edited.ttf'

export const fonts = { body: null, dot: null }

export function loadFonts(p) {
  const toLoad = { body: bodyFontURL, dot: dotFontURL }

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
      fontName,
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
