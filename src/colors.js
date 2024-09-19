const iris_30 = 'rgba(163, 140, 222, 1)'
const iris_60 = 'rgba(88, 59, 209, 1)'
const iris_50 = 'rgba(121, 88, 255, 1)'
const iris_75 = 'rgba(23, 12, 67, 1)'
const iris_100 = 'rgba(25, 15, 66, 1)'
const teal_50 = 'rgba(137, 255, 248, 1)'
const teal_60 = '#4CB1AB'
const teal_75 = '#0A3330'
const teal_90 = '#062927'
const flame_50 = 'rgba(255, 88, 88, 1)'
const flame_75 = 'rgba(70, 12, 12, 1)'
const pink_50 = 'rgba(255, 105, 177, 1)'
const pink_60 = 'rgba(106, 16, 59, 1)'
const pink_75 = 'rgba(59, 29, 43, 1)'
const green_50 = 'rgba(125, 241, 115, 1)'
const green_75 = 'rgba(4, 53, 0, 1)'
const yellow_50 = 'rgba(252, 255, 105, 1)'
const yellow_75 = 'rgba(58, 59, 29, 1)'
const violet_25 = 'rgba(236, 205, 255, 1)'
const violet_50 = 'rgba(155, 67, 232, 1)'

export const THEME = {
  bg: 'rgb(20,20,20)',
  fg: 'white',
  bodiesTheme: 'blues',
  border: iris_50,
  borderWt: 2,
  // colors
  lime: 'rgba(125, 241, 115, 1)',
  lime_40: 'rgba(125, 241, 115, 0.4)',
  fuschia: 'rgba(155, 67, 232, 1)',
  red: 'rgba(255, 88, 88, 1)',
  maroon: 'rgba(53, 20, 20, 1)',
  textFg: iris_50,
  textBg: iris_100,
  iris_30,
  iris_50,
  iris_60,
  iris_75,
  teal_50,
  teal_60,
  teal_75,
  teal_90,
  flame_50,
  flame_75,
  pink: 'rgba(236, 205, 255, 1)',
  pink_40: 'rgba(219, 115, 255, 1)',
  pink_50,
  pink_60,
  pink_75,
  green_50,
  green_75,
  yellow_50,
  violet_25,
  violet_50
}

// [hue, saturation, lightness]
export const themes = {
  bodies: {
    // random hues
    default: {
      'saturated-exclude-darks': {
        bg: [undefined, '80-100', '32-100'], // undefined = 0—359
        cr: [undefined, '80-100', '32-100'],
        fg: [undefined, '80-100', '32-100']
      },
      pastel_highlighter_marker: {
        bg: [undefined, '80-100', '85-95'],
        cr: [undefined, '100-100', '55-60'],
        fg: [undefined, '70-90', '67-67']
      },
      marker_pastel_highlighter: {
        bg: [undefined, '100-100', '60-60'],
        cr: [undefined, '100-100', '90-95'],
        fg: [undefined, '100-100', '55-60']
      },
      shadow_highlighter_marker: {
        bg: [undefined, '80-100', '32-32'],
        cr: [undefined, '100-100', '55-60'],
        fg: [undefined, '70-90', '67-67']
      },
      berlin: {
        bg: [undefined, '100-100', '32-32'],
        cr: [undefined, '100-100', '45-45'],
        fg: [undefined, '100-100', '36-36']
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
    },
    // blues / BASE
    blues: {
      blues_bg_dark: {
        bg: ['175-270', '95-100', '50-55'],
        cr: ['135-105', '100-100', '85-90'],
        fg: ['135-105', '95-100', '55-60']
      },
      blues_bg_light: {
        bg: ['180-250', '100-100', '55-95'],
        cr: ['135-105', '95-100', '50-60'],
        fg: ['135-105', '95-100', '50-60']
      }
    }
  },
  buttons: {
    teal: {
      fg: teal_50,
      bg: teal_75
    },
    flame: {
      fg: flame_50,
      bg: flame_75
    },
    pink: {
      fg: pink_50,
      bg: pink_75
    },
    green: {
      fg: green_50,
      bg: green_75
    },
    yellow: {
      fg: yellow_50,
      bg: yellow_75
    }
  }
}

export const bodyThemes = themes.bodies[THEME.bodiesTheme]

// helpers

export function hslToRgb(values, alpha = 1, asArray = false) {
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

  if (asArray) {
    return [r, g, b]
  }

  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

function randInt(min, max, rng, offset) {
  if (rng) {
    return rng(min, max, offset)
  } else {
    // min and max included
    return Math.floor(Math.random() * (max - min + 1)) + min
  }
}

export function randHSL(ranges, asArray = false, rng, offset = 0) {
  let hues = ranges[0] ?? '0-359'
  let sats = ranges[1] ?? '0-100'
  let lights = ranges[2] ?? '0-100'

  // NOTE: hue:360 = black
  hues = hues.split('-').map((s) => Number(s))
  sats = sats.split('-').map((s) => Number(s))
  lights = lights.split('-').map((s) => Number(s))

  // if hue range loops (350-10), randomly select a position from the two sections (0-10, 350-359)
  if (hues[0] > hues[1]) {
    hues = [
      randInt(0, hues[1], rng, offset + 0),
      randInt(hues[0], '359', rng, offset + 1)
    ][randInt(0, 1, rng, offset + 2)]
    hues = [hues]
  }

  // generate in ranges
  const h = randInt(hues[0], hues[1] || hues[0], rng, offset + 3)
  const s = randInt(sats[0], sats[1] || sats[0], rng, offset + 4)
  const l = randInt(lights[0], lights[1] || lights[0], rng, offset + 5)
  if (asArray) {
    return [h, s, l]
  }
  return `hsl(${h},${s}%,${l}%)`
}

export function rgbaOpacity(color, opacity) {
  const [r, g, b] = color.split(',').map((s) => Number(s.replace(/\D/g, '')))
  return `rgba(${r}, ${g}, ${b}, ${opacity})`
}
