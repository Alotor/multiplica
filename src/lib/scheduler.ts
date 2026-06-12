import type { AppState, Fact, FactKey, FactStat } from './types'
import { ALL_FACTS } from './facts'
import { getFactStat, newFactStat } from './storage'

const DAY = 24 * 60 * 60 * 1000

// Review intervals (Leitner): how long a fact "rests" after a correct answer
// at each strength level. Wrong answers make it due immediately.
const INTERVALS_BY_STRENGTH = [0, 1 * DAY, 2 * DAY, 4 * DAY, 8 * DAY, 16 * DAY]

export const MAX_STRENGTH = 5

export function applyCorrect(stat: FactStat, now: number): FactStat {
  const strength = Math.min(MAX_STRENGTH, stat.strength + 1)
  return {
    ...stat,
    strength,
    dueAt: now + INTERVALS_BY_STRENGTH[strength],
    lastSeen: now,
    correct: stat.correct + 1,
  }
}

/**
 * Correct but slow: the answer counts, but strength doesn't grow — the kid
 * hasn't really got it yet, so the fact stays due and comes back soon.
 */
export function applySlowCorrect(stat: FactStat, now: number): FactStat {
  return {
    ...stat,
    dueAt: now,
    lastSeen: now,
    correct: stat.correct + 1,
  }
}

export function applyWrong(stat: FactStat, now: number): FactStat {
  return {
    ...stat,
    strength: Math.max(0, stat.strength - 2),
    dueAt: now,
    lastSeen: now,
    wrong: stat.wrong + 1,
  }
}

export type Phase = 'warmup' | 'core' | 'cooldown'

/** Session curve: start gentle, work hard in the middle, end on a win. */
export function phaseFor(elapsedFraction: number): Phase {
  if (elapsedFraction < 0.2) return 'warmup'
  if (elapsedFraction < 0.8) return 'core'
  return 'cooldown'
}

interface Candidate {
  fact: Fact
  stat: FactStat
  priority: number
}

function isEasyForKid(fact: Fact, stat: FactStat): boolean {
  return fact.difficulty === 1 || stat.strength >= 4
}

function isHardForKid(fact: Fact, stat: FactStat): boolean {
  return fact.difficulty === 3 || stat.strength <= 1
}

/**
 * Pick the next fact to ask.
 * - Never repeats any of the last `recent` facts.
 * - Prefers facts matching the current phase (easy in warmup/cooldown, hard in core).
 * - Within the pool, prefers overdue and weak facts, with randomness for variety.
 */
export function pickNextFact(
  state: AppState,
  elapsedFraction: number,
  recent: FactKey[],
  now: number
): Fact {
  const phase = phaseFor(elapsedFraction)
  const recentSet = new Set(recent.slice(-4))

  const candidates: Candidate[] = ALL_FACTS.filter((f) => !recentSet.has(f.key)).map((fact) => {
    const stat = state.facts[fact.key] ?? newFactStat()
    let priority = Math.random() * 2 // variety

    const overdueDays = stat.dueAt <= now ? Math.min(5, (now - stat.dueAt) / DAY) : -3
    priority += overdueDays

    priority += (MAX_STRENGTH - stat.strength) * 0.8 // weak facts first
    if (stat.lastSeen === 0) priority += 1.5 // never seen: introduce it

    const phaseMatch =
      phase === 'core' ? isHardForKid(fact, stat) : isEasyForKid(fact, stat)
    if (phaseMatch) priority += 6

    return { fact, stat, priority }
  })

  candidates.sort((x, y) => y.priority - x.priority)
  // Weighted pick among the top few so sessions don't feel scripted.
  const top = candidates.slice(0, 4)
  const r = Math.random()
  const idx = r < 0.55 ? 0 : r < 0.8 ? 1 : r < 0.95 ? 2 : 3
  return (top[Math.min(idx, top.length - 1)] ?? candidates[0]).fact
}

export type AnswerResult = 'correct' | 'slow' | 'wrong'

/** Record an answer into app state (mutates state.facts). */
export function recordAnswer(state: AppState, key: FactKey, result: AnswerResult, now: number): void {
  const stat = getFactStat(state, key)
  state.facts[key] =
    result === 'correct'
      ? applyCorrect(stat, now)
      : result === 'slow'
        ? applySlowCorrect(stat, now)
        : applyWrong(stat, now)
}
