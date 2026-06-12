import type { Fact } from './types'

const BASE_POINTS: Record<1 | 2 | 3, number> = { 1: 5, 2: 10, 3: 15 }

/**
 * Points for a correct answer: harder facts are worth more,
 * plus a bonus that grows with the in-session streak (capped at +10).
 */
export function pointsFor(fact: Fact, streak: number): number {
  return BASE_POINTS[fact.difficulty] + Math.min(10, streak)
}
