import type { AppState, Duration, FactStat } from './types'
import { ALL_FACTS } from './facts'

const STORAGE_KEY = 'multiplica-state-v1'

export function newFactStat(): FactStat {
  return { strength: 0, dueAt: 0, lastSeen: 0, correct: 0, wrong: 0 }
}

export const HISTORY_LIMIT = 20

export function defaultState(): AppState {
  return {
    version: 1,
    facts: {},
    highScores: {},
    streak: { lastDay: '', count: 0 },
    settings: { sound: true, duration: 120 },
    totals: { sessions: 0, answered: 0, correct: 0 },
    history: [],
  }
}

export function loadState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return defaultState()
    const parsed = JSON.parse(raw)
    if (parsed?.version !== 1) return defaultState()
    return { ...defaultState(), ...parsed }
  } catch {
    return defaultState()
  }
}

export function saveState(state: AppState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // Storage full or unavailable: the game still works, progress just won't persist.
  }
}

export function getFactStat(state: AppState, key: string): FactStat {
  return state.facts[key] ?? newFactStat()
}

export function todayKey(now = new Date()): string {
  const y = now.getFullYear()
  const m = String(now.getMonth() + 1).padStart(2, '0')
  const d = String(now.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

/** Update the daily streak after completing a session. Mutates and returns state. */
export function bumpStreak(state: AppState, now = new Date()): AppState {
  const today = todayKey(now)
  if (state.streak.lastDay === today) return state
  const yesterday = todayKey(new Date(now.getTime() - 24 * 60 * 60 * 1000))
  const count = state.streak.lastDay === yesterday ? state.streak.count + 1 : 1
  state.streak = { lastDay: today, count }
  return state
}

/** Streak shown on screen: 0 if the chain is already broken. */
export function currentStreak(state: AppState, now = new Date()): number {
  const today = todayKey(now)
  const yesterday = todayKey(new Date(now.getTime() - 24 * 60 * 60 * 1000))
  if (state.streak.lastDay === today || state.streak.lastDay === yesterday) {
    return state.streak.count
  }
  return 0
}

export function getHighScore(state: AppState, duration: Duration): number {
  return state.highScores[duration] ?? 0
}

/** Sanity check that the 36-fact pool is what stats iterate over. */
export const TOTAL_FACTS = ALL_FACTS.length
