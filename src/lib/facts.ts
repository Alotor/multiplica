import type { Fact, FactKey, GameMode, Op } from './types'

// ---------- Multiplication: the 2..9 tables ----------

// Per-factor difficulty: 2, 5 and 9 have easy tricks; 4 and 6 are middling;
// 3, 7 and 8 are the ones kids struggle with the most.
const FACTOR_DIFFICULTY: Record<number, 1 | 2 | 3> = {
  2: 1, 5: 1, 9: 1,
  4: 2, 6: 2,
  3: 3, 7: 3, 8: 3,
}

export const MIN_FACTOR = 2
export const MAX_FACTOR = 9

export function factKey(a: number, b: number): FactKey {
  return a <= b ? `${a}x${b}` : `${b}x${a}`
}

function buildMultFacts(): Fact[] {
  const facts: Fact[] = []
  for (let a = MIN_FACTOR; a <= MAX_FACTOR; a++) {
    for (let b = a; b <= MAX_FACTOR; b++) {
      facts.push({
        key: factKey(a, b),
        a,
        b,
        op: 'x',
        difficulty: Math.max(FACTOR_DIFFICULTY[a], FACTOR_DIFFICULTY[b]) as 1 | 2 | 3,
      })
    }
  }
  return facts
}

/** All 36 unordered facts of the 2..9 tables. */
export const MULT_FACTS: Fact[] = buildMultFacts()

// ---------- Addition & subtraction within 20 ----------

/** Operands go 1..10, so sums reach 20 and nothing is ever negative. */
export const ADD_MAX = 10

export function addKey(a: number, b: number): FactKey {
  return a <= b ? `${a}+${b}` : `${b}+${a}`
}

export function subKey(m: number, s: number): FactKey {
  return `${m}-${s}`
}

// Easy: everything within 10, or +10 itself. Medium: doubles and the
// "almost 10" tricks (9). Hard: crossing the ten with a carry.
function addDifficulty(a: number, b: number): 1 | 2 | 3 {
  const sum = a + b
  if (sum <= 10 || a === 10 || b === 10) return 1
  if (a === b || a === 9 || b === 9) return 2
  return 3
}

// Easy: within 10, or taking away 10 / landing on 10. Medium: small steps
// or no borrowing needed. Hard: crossing the ten with a borrow.
function subDifficulty(m: number, s: number): 1 | 2 | 3 {
  const r = m - s
  if (m <= 10 || s === 10 || r === 10) return 1
  if (s <= 2 || m % 10 >= s) return 2
  return 3
}

function buildAddSubFacts(): Fact[] {
  const facts: Fact[] = []
  for (let a = 1; a <= ADD_MAX; a++) {
    for (let b = a; b <= ADD_MAX; b++) {
      facts.push({ key: addKey(a, b), a, b, op: '+', difficulty: addDifficulty(a, b) })
    }
  }
  // Subtractions are the inverses: m - s = r with s and r both in 1..10.
  for (let s = 1; s <= ADD_MAX; s++) {
    for (let r = 1; r <= ADD_MAX; r++) {
      const m = s + r
      facts.push({ key: subKey(m, s), a: m, b: s, op: '-', difficulty: subDifficulty(m, s) })
    }
  }
  return facts
}

export const ADDSUB_FACTS: Fact[] = buildAddSubFacts()

// ---------- Shared lookups ----------

export const FACTS_FOR_MODE: Record<GameMode, Fact[]> = {
  mult: MULT_FACTS,
  addsub: ADDSUB_FACTS,
}

export const FACTS_BY_KEY: Record<FactKey, Fact> = Object.fromEntries(
  [...MULT_FACTS, ...ADDSUB_FACTS].map((f) => [f.key, f])
)

export const OP_SYMBOL: Record<Op, string> = { x: '×', '+': '+', '-': '−' }

export function answerFor(fact: Fact): number {
  if (fact.op === 'x') return fact.a * fact.b
  if (fact.op === '+') return fact.a + fact.b
  return fact.a - fact.b
}

/**
 * Random presentation order for commutative ops: «3×7» or «7×3» both map to
 * the same fact. Subtraction never swaps (a is always the minuend).
 */
export function presentFact(fact: Fact): { left: number; right: number } {
  if (fact.op === '-' || fact.a === fact.b || Math.random() < 0.5) {
    return { left: fact.a, right: fact.b }
  }
  return { left: fact.b, right: fact.a }
}
