// Tokenizer for a subset of Circom 2.x.
//
// Handles the token classes used by the anybody-problem circuits:
//   - keywords: pragma, include, template, function, signal, input, output,
//     component, var, for, while, if, else, return, main, public, parallel
//   - identifiers and numeric literals (ints)
//   - string literals (for include/pragma)
//   - operators: arithmetic, comparison, logical, bitwise, shifts
//   - circom-specific: <==, <--, ===, ==>, -->
//   - punctuation: (), [], {}, ;, ,, .

const KEYWORDS = new Set([
  'pragma',
  'include',
  'template',
  'function',
  'signal',
  'input',
  'output',
  'component',
  'var',
  'for',
  'while',
  'if',
  'else',
  'return',
  'main',
  'public',
  'parallel',
])

/** Token types. */
export const T = {
  KEYWORD: 'KEYWORD',
  IDENT: 'IDENT',
  NUMBER: 'NUMBER',
  STRING: 'STRING',
  OP: 'OP',
  PUNCT: 'PUNCT',
  EOF: 'EOF',
}

/** Longest-match operator table, order matters. */
const OPS = [
  '<==',
  '<--',
  '===',
  '==>',
  '-->',
  '**', // circom power
  '<=',
  '>=',
  '==',
  '!=',
  '&&',
  '||',
  '<<',
  '>>',
  '+=',
  '-=',
  '*=',
  '/=',
  '++',
  '--',
  '+',
  '-',
  '*',
  '/',
  '\\', // circom integer division (vs. / which is field division)
  '%',
  '=',
  '<',
  '>',
  '!',
  '&',
  '|',
  '^',
  '~',
  '?',
  ':',
]

const PUNCTS = new Set(['(', ')', '[', ']', '{', '}', ';', ',', '.'])

export function tokenize(src, filename = '<anon>') {
  const tokens = []
  let i = 0
  let line = 1
  let col = 1

  const push = (type, value) => {
    tokens.push({ type, value, line, col, filename })
  }

  const advance = (n = 1) => {
    for (let k = 0; k < n; k++) {
      if (src[i] === '\n') {
        line++
        col = 1
      } else {
        col++
      }
      i++
    }
  }

  while (i < src.length) {
    const ch = src[i]

    // Whitespace
    if (ch === ' ' || ch === '\t' || ch === '\n' || ch === '\r') {
      advance()
      continue
    }

    // Line comment //
    if (ch === '/' && src[i + 1] === '/') {
      while (i < src.length && src[i] !== '\n') advance()
      continue
    }
    // Block comment /* ... */
    if (ch === '/' && src[i + 1] === '*') {
      advance(2)
      while (i < src.length && !(src[i] === '*' && src[i + 1] === '/')) advance()
      if (i < src.length) advance(2)
      continue
    }

    // String literal (double-quoted only; used for pragma/include paths)
    if (ch === '"') {
      advance()
      let s = ''
      while (i < src.length && src[i] !== '"') {
        s += src[i]
        advance()
      }
      if (src[i] !== '"') {
        throw new Error(`${filename}:${line}:${col}: unterminated string`)
      }
      advance()
      push(T.STRING, s)
      continue
    }

    // Number
    if (ch >= '0' && ch <= '9') {
      let s = ''
      while (i < src.length && src[i] >= '0' && src[i] <= '9') {
        s += src[i]
        advance()
      }
      push(T.NUMBER, s)
      continue
    }

    // Identifier / keyword
    if (isIdentStart(ch)) {
      let s = ''
      while (i < src.length && isIdentPart(src[i])) {
        s += src[i]
        advance()
      }
      if (KEYWORDS.has(s)) push(T.KEYWORD, s)
      else push(T.IDENT, s)
      continue
    }

    // Operator (longest-match)
    let matched = false
    for (const op of OPS) {
      if (src.startsWith(op, i)) {
        push(T.OP, op)
        advance(op.length)
        matched = true
        break
      }
    }
    if (matched) continue

    // Punctuation
    if (PUNCTS.has(ch)) {
      push(T.PUNCT, ch)
      advance()
      continue
    }

    throw new Error(
      `${filename}:${line}:${col}: unexpected character '${ch}'`
    )
  }

  push(T.EOF, null)
  return tokens
}

function isIdentStart(c) {
  return (
    (c >= 'a' && c <= 'z') ||
    (c >= 'A' && c <= 'Z') ||
    c === '_' ||
    c === '$'
  )
}

function isIdentPart(c) {
  return isIdentStart(c) || (c >= '0' && c <= '9')
}
