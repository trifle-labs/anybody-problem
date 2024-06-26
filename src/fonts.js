const bodyFontURL = new URL(
  '/public/fonts/Space-Notorious-rounded.otf',
  import.meta.url
).href

// n.b. to make this font load, I had to remove the leading numbers from the filename
const dotFontURL = new URL(
  '/public/fonts/A000-Dots-edited.ttf',
  import.meta.url
).href

export const fonts = { body: null, dot: null }

export function loadFonts(p) {
  const toLoad = { body: bodyFontURL, dot: dotFontURL }

  for (const fontName in toLoad) {
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
