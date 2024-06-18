// [hue, saturation, lightness]
export const themes = {
  bodies: {
    // random hues
    default: {
      'saturated-exclude-darks': {
        bg: [undefined, '80-100', '18-100'],
        cr: [undefined, '80-100', '18-100'],
        fg: [undefined, '80-100', '18-100']
      },
      'bg:pastel__core:highlighter__fg:marker': {
        bg: [undefined, '80-100', '85-95'],
        cr: [undefined, '100', '55-60'],
        fg: [undefined, '70-90', '67']
      },
      'bg:marker__core:pastel__fg:highlighter': {
        bg: [undefined, '100', '60'],
        cr: [undefined, '100', '90-95'],
        fg: [undefined, '100', '55-60']
      },
      'bg:shadow__core:highlighter__fg:marker': {
        bg: [undefined, '80-100', '18-25'],
        cr: [undefined, '100', '55-60'],
        fg: [undefined, '70-90', '67']
      },
      // "berlin"
      'bg:dark__core:burnt__fg:crayon': {
        bg: [undefined, '100', '18'],
        cr: [undefined, '100', '45'],
        fg: [undefined, '100', '30']
      }
    },
    // reds / OPTIMISM
    reds: {
      'bg:red-wide': {
        bg: ['300-20', '90', '50'],
        cr: [undefined, '80', '90'],
        fg: [undefined, '80', '60']
      }
    },
    // yellows / BLAST
    yellows: {
      'bg:yellow-narrow': {
        bg: ['40-60', '95-100', '50-60'],
        cr: [undefined, '90-100', '85-95'],
        fg: [undefined, '90', '60']
      }
    }
  }
}

// helpers

export function hslToRgb(values) {
  let [h, s, l] = values

  s /= 100
  l /= 100

  let c = (1 - Math.abs(2 * l - 1)) * s
  let x = c * (1 - Math.abs(((h / 60) % 2) - 1))
  let m = l - c / 2
  let r = 0,
    g = 0,
    b = 0

  if (0 <= h && h < 60) {
    r = c
    g = x
    b = 0
  } else if (60 <= h && h < 120) {
    r = x
    g = c
    b = 0
  } else if (120 <= h && h < 180) {
    r = 0
    g = c
    b = x
  } else if (180 <= h && h < 240) {
    r = 0
    g = x
    b = c
  } else if (240 <= h && h < 300) {
    r = x
    g = 0
    b = c
  } else if (300 <= h && h < 360) {
    r = c
    g = 0
    b = x
  }

  r = Math.round((r + m) * 255)
  g = Math.round((g + m) * 255)
  b = Math.round((b + m) * 255)

  return `rgb(${r}, ${g}, ${b})`
}

function randInt(min, max) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min)
}

export function randHSL(ranges) {
  let hues = ranges[0] ?? '0-359'
  let sats = ranges[1] ?? '0-100'
  let lights = ranges[2] ?? '0-100'

  // NOTE: hue:360 = black
  hues = hues.split('-').map((s) => Number(s))
  sats = sats.split('-').map((s) => Number(s))
  lights = lights.split('-').map((s) => Number(s))

  // if hue range loops (350-10), randomly select a position from the two sections (0-10, 350-359)
  if (hues[0] > hues[1]) {
    hues = [randInt(0, hues[1]), randInt(hues[0], '359')][randInt(0, 1)]
    hues = [hues]
  }

  // generate in ranges
  const h = randInt(hues[0], hues[1] || hues[0])
  const s = randInt(sats[0], sats[1] || sats[0])
  const l = randInt(lights[0], lights[1] || lights[0])

  return [h, s, l]
}
