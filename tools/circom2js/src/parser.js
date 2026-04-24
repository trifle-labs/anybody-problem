// Recursive-descent parser for a Circom 2.x subset.
//
// Scope: templates, functions, pragmas, includes, signal/var/component decls,
// for/while/if/else, return, expressions with full precedence, and all
// circom assignment operators. Does NOT cover: bus, parallel components,
// custom templates-as-values, tag attributes, anonymous components.
//
// AST nodes are plain objects with a `type` field; see the switch in
// emitter.js for the shape of each node.

import { tokenize, T } from './tokenizer.js'

export function parse(src, filename = '<anon>') {
  const toks = tokenize(src, filename)
  const p = new Parser(toks, filename)
  return p.parseFile()
}

class Parser {
  constructor(toks, filename) {
    this.toks = toks
    this.filename = filename
    this.pos = 0
  }

  peek(offset = 0) {
    return this.toks[this.pos + offset]
  }

  eat(type, value) {
    const t = this.peek()
    if (t.type !== type || (value !== undefined && t.value !== value)) {
      this.fail(
        `expected ${type}${value ? ` '${value}'` : ''} got ${t.type}('${t.value}')`
      )
    }
    this.pos++
    return t
  }

  match(type, value) {
    const t = this.peek()
    if (t.type === type && (value === undefined || t.value === value)) {
      this.pos++
      return t
    }
    return null
  }

  is(type, value) {
    const t = this.peek()
    return t.type === type && (value === undefined || t.value === value)
  }

  fail(msg) {
    const t = this.peek()
    throw new Error(`${t.filename}:${t.line}:${t.col}: ${msg}`)
  }

  // -------- file --------

  parseFile() {
    const out = {
      type: 'File',
      filename: this.filename,
      pragmas: [],
      includes: [],
      templates: [],
      functions: [],
      main: null,
    }
    while (!this.is(T.EOF)) {
      if (this.is(T.KEYWORD, 'pragma')) out.pragmas.push(this.parsePragma())
      else if (this.is(T.KEYWORD, 'include')) out.includes.push(this.parseInclude())
      else if (this.is(T.KEYWORD, 'template')) out.templates.push(this.parseTemplate())
      else if (this.is(T.KEYWORD, 'function')) out.functions.push(this.parseFunction())
      else if (this.is(T.KEYWORD, 'component')) {
        // top-level: component main { public [ ... ] } = Foo(...);
        out.main = this.parseMain()
      } else {
        this.fail(`unexpected top-level token '${this.peek().value}'`)
      }
    }
    return out
  }

  parsePragma() {
    this.eat(T.KEYWORD, 'pragma')
    const parts = []
    while (!this.is(T.PUNCT, ';')) {
      parts.push(this.peek().value)
      this.pos++
    }
    this.eat(T.PUNCT, ';')
    return { type: 'Pragma', text: parts.join(' ') }
  }

  parseInclude() {
    this.eat(T.KEYWORD, 'include')
    const path = this.eat(T.STRING).value
    this.eat(T.PUNCT, ';')
    return { type: 'Include', path }
  }

  parseMain() {
    this.eat(T.KEYWORD, 'component')
    this.eat(T.KEYWORD, 'main')
    let publicSignals = []
    if (this.match(T.PUNCT, '{')) {
      if (this.match(T.KEYWORD, 'public')) {
        this.eat(T.PUNCT, '[')
        while (!this.is(T.PUNCT, ']')) {
          publicSignals.push(this.eat(T.IDENT).value)
          if (!this.match(T.PUNCT, ',')) break
        }
        this.eat(T.PUNCT, ']')
      }
      this.eat(T.PUNCT, '}')
    }
    this.eat(T.OP, '=')
    const call = this.parseCallExpr()
    this.eat(T.PUNCT, ';')
    return { type: 'Main', publicSignals, call }
  }

  // -------- templates and functions --------

  parseTemplate() {
    this.eat(T.KEYWORD, 'template')
    const name = this.eat(T.IDENT).value
    this.eat(T.PUNCT, '(')
    const params = this.parseParamList()
    this.eat(T.PUNCT, ')')
    const body = this.parseBlock()
    return { type: 'Template', name, params, body }
  }

  parseFunction() {
    this.eat(T.KEYWORD, 'function')
    const name = this.eat(T.IDENT).value
    this.eat(T.PUNCT, '(')
    const params = this.parseParamList()
    this.eat(T.PUNCT, ')')
    const body = this.parseBlock()
    return { type: 'Function', name, params, body }
  }

  parseParamList() {
    const ps = []
    if (this.is(T.PUNCT, ')')) return ps
    ps.push(this.eat(T.IDENT).value)
    while (this.match(T.PUNCT, ',')) ps.push(this.eat(T.IDENT).value)
    return ps
  }

  // -------- statements --------

  parseBlock() {
    this.eat(T.PUNCT, '{')
    const stmts = []
    while (!this.is(T.PUNCT, '}')) stmts.push(this.parseStmt())
    this.eat(T.PUNCT, '}')
    return { type: 'Block', body: stmts }
  }

  parseStmt() {
    if (this.is(T.PUNCT, '{')) return this.parseBlock()
    if (this.is(T.KEYWORD, 'signal')) return this.parseSignalDecl()
    if (this.is(T.KEYWORD, 'var')) return this.parseVarDecl()
    if (this.is(T.KEYWORD, 'component')) return this.parseComponentDecl()
    if (this.is(T.KEYWORD, 'for')) return this.parseFor()
    if (this.is(T.KEYWORD, 'while')) return this.parseWhile()
    if (this.is(T.KEYWORD, 'if')) return this.parseIf()
    if (this.is(T.KEYWORD, 'return')) return this.parseReturn()
    // expression or assignment statement
    return this.parseExprStmt()
  }

  parseSignalDecl() {
    this.eat(T.KEYWORD, 'signal')
    let direction = null
    if (this.match(T.KEYWORD, 'input')) direction = 'input'
    else if (this.match(T.KEYWORD, 'output')) direction = 'output'
    const names = []
    do {
      const name = this.eat(T.IDENT).value
      const dims = []
      while (this.match(T.PUNCT, '[')) {
        dims.push(this.parseExpr())
        this.eat(T.PUNCT, ']')
      }
      let init = null
      if (this.match(T.OP, '<==')) {
        init = { op: '<==', rhs: this.parseExpr() }
      } else if (this.match(T.OP, '<--')) {
        init = { op: '<--', rhs: this.parseExpr() }
      }
      names.push({ name, dims, init })
    } while (this.match(T.PUNCT, ','))
    this.eat(T.PUNCT, ';')
    return { type: 'SignalDecl', direction, decls: names }
  }

  parseVarDecl() {
    this.eat(T.KEYWORD, 'var')
    const names = []
    do {
      const name = this.eat(T.IDENT).value
      const dims = []
      while (this.match(T.PUNCT, '[')) {
        dims.push(this.parseExpr())
        this.eat(T.PUNCT, ']')
      }
      let init = null
      if (this.match(T.OP, '=')) init = this.parseExpr()
      names.push({ name, dims, init })
    } while (this.match(T.PUNCT, ','))
    this.eat(T.PUNCT, ';')
    return { type: 'VarDecl', decls: names }
  }

  parseComponentDecl() {
    this.eat(T.KEYWORD, 'component')
    const name = this.eat(T.IDENT).value
    const dims = []
    while (this.match(T.PUNCT, '[')) {
      dims.push(this.parseExpr())
      this.eat(T.PUNCT, ']')
    }
    let call = null
    if (this.match(T.OP, '=')) {
      call = this.parseCallExpr()
    }
    this.eat(T.PUNCT, ';')
    return { type: 'ComponentDecl', name, dims, call }
  }

  parseFor() {
    this.eat(T.KEYWORD, 'for')
    this.eat(T.PUNCT, '(')
    const init = this.is(T.KEYWORD, 'var')
      ? this.parseVarDecl() // consumes the ';' inside
      : this.parseExprStmt()
    const cond = this.parseExpr()
    this.eat(T.PUNCT, ';')
    const update = this.parseExprNoSemi()
    this.eat(T.PUNCT, ')')
    const body = this.parseStmt()
    return { type: 'For', init, cond, update, body }
  }

  parseWhile() {
    this.eat(T.KEYWORD, 'while')
    this.eat(T.PUNCT, '(')
    const cond = this.parseExpr()
    this.eat(T.PUNCT, ')')
    const body = this.parseStmt()
    return { type: 'While', cond, body }
  }

  parseIf() {
    this.eat(T.KEYWORD, 'if')
    this.eat(T.PUNCT, '(')
    const cond = this.parseExpr()
    this.eat(T.PUNCT, ')')
    const cons = this.parseStmt()
    let alt = null
    if (this.match(T.KEYWORD, 'else')) alt = this.parseStmt()
    return { type: 'If', cond, cons, alt }
  }

  parseReturn() {
    this.eat(T.KEYWORD, 'return')
    const value = this.is(T.PUNCT, ';') ? null : this.parseExpr()
    this.eat(T.PUNCT, ';')
    return { type: 'Return', value }
  }

  parseExprStmt() {
    // Might be: lhs <== rhs ;
    //          lhs <-- rhs ;
    //          lhs === rhs ;
    //          lhs = rhs ;
    //          lhs += rhs ;  (and other compound assigns)
    //          lhs ==> rhs ; (routing — treat like lhs <== rhs reversed: rhs <== lhs)
    //          lhs ++ ;
    //          lhs -- ;
    //          expr ;
    const lhs = this.parseExpr()
    const t = this.peek()
    const assignOps = new Set([
      '<==',
      '<--',
      '===',
      '=',
      '==>',
      '-->',
      '+=',
      '-=',
      '*=',
      '/=',
    ])
    if (t.type === T.OP && assignOps.has(t.value)) {
      const op = t.value
      this.pos++
      const rhs = this.parseExpr()
      this.eat(T.PUNCT, ';')
      if (op === '==>' || op === '-->') {
        // routing: lhs ==> rhs means rhs <== lhs
        return {
          type: 'Assign',
          op: op === '==>' ? '<==' : '<--',
          lhs: rhs,
          rhs: lhs,
        }
      }
      return { type: 'Assign', op, lhs, rhs }
    }
    if (t.type === T.OP && (t.value === '++' || t.value === '--')) {
      const op = t.value
      this.pos++
      this.eat(T.PUNCT, ';')
      return { type: 'Update', op, arg: lhs, prefix: false }
    }
    this.eat(T.PUNCT, ';')
    return { type: 'ExprStmt', expr: lhs }
  }

  // For the update clause of a for-loop: an expression statement without ';'
  parseExprNoSemi() {
    const lhs = this.parseExpr()
    const t = this.peek()
    const compound = new Set(['=', '+=', '-=', '*=', '/='])
    if (t.type === T.OP && compound.has(t.value)) {
      const op = t.value
      this.pos++
      const rhs = this.parseExpr()
      return { type: 'Assign', op, lhs, rhs }
    }
    if (t.type === T.OP && (t.value === '++' || t.value === '--')) {
      const op = t.value
      this.pos++
      return { type: 'Update', op, arg: lhs, prefix: false }
    }
    return { type: 'ExprStmt', expr: lhs }
  }

  // -------- expressions (precedence-climbing) --------

  parseExpr() {
    return this.parseTernary()
  }

  parseTernary() {
    const cond = this.parseLogicalOr()
    if (this.match(T.OP, '?')) {
      const cons = this.parseExpr()
      this.eat(T.OP, ':')
      const alt = this.parseExpr()
      return { type: 'Ternary', cond, cons, alt }
    }
    return cond
  }

  parseLogicalOr() {
    return this.parseBinary(['||'], () => this.parseLogicalAnd())
  }
  parseLogicalAnd() {
    return this.parseBinary(['&&'], () => this.parseBitOr())
  }
  parseBitOr() {
    return this.parseBinary(['|'], () => this.parseBitXor())
  }
  parseBitXor() {
    return this.parseBinary(['^'], () => this.parseBitAnd())
  }
  parseBitAnd() {
    return this.parseBinary(['&'], () => this.parseEquality())
  }
  parseEquality() {
    return this.parseBinary(['==', '!='], () => this.parseRelational())
  }
  parseRelational() {
    return this.parseBinary(['<', '>', '<=', '>='], () => this.parseShift())
  }
  parseShift() {
    return this.parseBinary(['<<', '>>'], () => this.parseAdditive())
  }
  parseAdditive() {
    return this.parseBinary(['+', '-'], () => this.parseMultiplicative())
  }
  parseMultiplicative() {
    return this.parseBinary(['*', '/', '\\', '%'], () => this.parsePower())
  }
  parsePower() {
    // right-associative
    const lhs = this.parseUnary()
    if (this.match(T.OP, '**')) {
      return { type: 'Binary', op: '**', lhs, rhs: this.parsePower() }
    }
    return lhs
  }

  parseBinary(ops, nextFn) {
    let lhs = nextFn()
    for (;;) {
      const t = this.peek()
      if (t.type !== T.OP || !ops.includes(t.value)) break
      const op = t.value
      this.pos++
      const rhs = nextFn()
      lhs = { type: 'Binary', op, lhs, rhs }
    }
    return lhs
  }

  parseUnary() {
    if (this.match(T.OP, '-')) return { type: 'Unary', op: '-', arg: this.parseUnary() }
    if (this.match(T.OP, '+')) return this.parseUnary()
    if (this.match(T.OP, '!')) return { type: 'Unary', op: '!', arg: this.parseUnary() }
    if (this.match(T.OP, '~')) return { type: 'Unary', op: '~', arg: this.parseUnary() }
    return this.parsePostfix()
  }

  parsePostfix() {
    let node = this.parsePrimary()
    for (;;) {
      if (this.match(T.PUNCT, '.')) {
        const field = this.eat(T.IDENT).value
        node = { type: 'Member', object: node, field }
      } else if (this.match(T.PUNCT, '[')) {
        const index = this.parseExpr()
        this.eat(T.PUNCT, ']')
        node = { type: 'Index', object: node, index }
      } else if (this.is(T.PUNCT, '(')) {
        // call
        node = this.parseCallTrailing(node)
      } else {
        break
      }
    }
    return node
  }

  // Parse a call expression when we know it starts with an identifier
  // (used for component rhs and main call).
  parseCallExpr() {
    const name = this.eat(T.IDENT).value
    return this.parseCallTrailing({ type: 'Ident', name })
  }

  parseCallTrailing(callee) {
    this.eat(T.PUNCT, '(')
    const args = []
    if (!this.is(T.PUNCT, ')')) {
      args.push(this.parseExpr())
      while (this.match(T.PUNCT, ',')) args.push(this.parseExpr())
    }
    this.eat(T.PUNCT, ')')
    return { type: 'Call', callee, args }
  }

  parsePrimary() {
    const t = this.peek()
    if (t.type === T.NUMBER) {
      this.pos++
      return { type: 'Number', value: t.value }
    }
    if (t.type === T.IDENT) {
      this.pos++
      return { type: 'Ident', name: t.value }
    }
    if (t.type === T.PUNCT && t.value === '(') {
      this.pos++
      const e = this.parseExpr()
      this.eat(T.PUNCT, ')')
      return e
    }
    if (t.type === T.PUNCT && t.value === '[') {
      // array literal — used for var distanceResults[3]; distanceResults = approxSqrt(...) etc.
      this.pos++
      const elems = []
      if (!this.is(T.PUNCT, ']')) {
        elems.push(this.parseExpr())
        while (this.match(T.PUNCT, ',')) elems.push(this.parseExpr())
      }
      this.eat(T.PUNCT, ']')
      return { type: 'Array', elements: elems }
    }
    this.fail(`unexpected token in expression: ${t.type}('${t.value}')`)
  }
}
