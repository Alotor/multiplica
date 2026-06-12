import type { Fact, FactKey } from './types'

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

function buildFacts(): Fact[] {
  const facts: Fact[] = []
  for (let a = MIN_FACTOR; a <= MAX_FACTOR; a++) {
    for (let b = a; b <= MAX_FACTOR; b++) {
      facts.push({
        key: factKey(a, b),
        a,
        b,
        difficulty: Math.max(FACTOR_DIFFICULTY[a], FACTOR_DIFFICULTY[b]) as 1 | 2 | 3,
      })
    }
  }
  return facts
}

/** All 36 unordered facts of the 2..9 tables. */
export const ALL_FACTS: Fact[] = buildFacts()

export const FACTS_BY_KEY: Record<FactKey, Fact> = Object.fromEntries(
  ALL_FACTS.map((f) => [f.key, f])
)

/** Random presentation order: «3×7» or «7×3», both map to the same fact. */
export function presentFact(fact: Fact): { left: number; right: number } {
  if (fact.a === fact.b || Math.random() < 0.5) return { left: fact.a, right: fact.b }
  return { left: fact.b, right: fact.a }
}
