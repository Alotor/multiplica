import type { AppState } from './types'

export type Animal =
  | 'hamster'
  | 'quokka'
  | 'axolotl'
  | 'capybara'
  | 'bunny'
  | 'mouse'
  | 'cat'
  | 'frog'
  | 'chicken'
  | 'pig'
  | 'sheep'
  | 'cow'
  | 'goat'
  | 'monkey'
  | 'lion'
  | 'tiger'
  | 'shark'
  | 'dragon'

export interface AnimalInfo {
  id: Animal
  name: string
  /** Best score (any duration) needed to unlock. 0 = available from the start. */
  score: number
}

export const ANIMAL_INFO: AnimalInfo[] = [
  { id: 'hamster', name: 'Hámster', score: 0 },
  { id: 'quokka', name: 'Quokka', score: 0 },
  { id: 'axolotl', name: 'Ajolote', score: 0 },
  { id: 'capybara', name: 'Capibara', score: 0 },
  { id: 'bunny', name: 'Conejo', score: 50 },
  { id: 'mouse', name: 'Ratón', score: 100 },
  { id: 'cat', name: 'Gato', score: 150 },
  { id: 'frog', name: 'Rana', score: 200 },
  { id: 'chicken', name: 'Pollito', score: 250 },
  { id: 'pig', name: 'Cerdito', score: 300 },
  { id: 'sheep', name: 'Oveja', score: 350 },
  { id: 'cow', name: 'Vaca', score: 400 },
  { id: 'goat', name: 'Cabra', score: 450 },
  { id: 'monkey', name: 'Mono', score: 500 },
  { id: 'lion', name: 'León', score: 600 },
  { id: 'tiger', name: 'Tigre', score: 700 },
  { id: 'shark', name: 'Tiburón', score: 850 },
  { id: 'dragon', name: 'Dragón', score: 1000 },
]

export const ANIMALS: Animal[] = ANIMAL_INFO.map((a) => a.id)

/** Visiting the app with ?demo in the URL unlocks every animal for previewing. */
export const DEMO_ALL =
  typeof location !== 'undefined' && new URLSearchParams(location.search).has('demo')

/** Best score the kid has achieved in any duration. */
export function bestScore(state: AppState): number {
  return Math.max(0, ...Object.values(state.highScores))
}

export function isUnlocked(info: AnimalInfo, state: AppState): boolean {
  return DEMO_ALL || info.score <= bestScore(state)
}

export function unlockedAnimals(state: AppState): Animal[] {
  return ANIMAL_INFO.filter((a) => isUnlocked(a, state)).map((a) => a.id)
}

/** Animals whose threshold falls strictly inside (prevBest, newBest]. */
export function newlyUnlocked(prevBest: number, newBest: number): Animal[] {
  return ANIMAL_INFO.filter((a) => a.score > prevBest && a.score <= newBest).map((a) => a.id)
}

export function randomUnlocked(state: AppState, except?: Animal): Animal {
  const unlocked = unlockedAnimals(state)
  const pool = unlocked.filter((a) => a !== except)
  const source = pool.length > 0 ? pool : unlocked
  return source[Math.floor(Math.random() * source.length)]
}

/** Up to `n` distinct random unlocked animals (for the results parade). */
export function randomUnlockedSample(state: AppState, n: number): Animal[] {
  const pool = [...unlockedAnimals(state)]
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[pool[i], pool[j]] = [pool[j], pool[i]]
  }
  return pool.slice(0, n)
}
