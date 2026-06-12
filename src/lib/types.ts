// A "fact" is an unordered pair {a, b} with 2 <= a <= b <= 9.
// Its key is "axb" with a <= b (e.g. "3x7" covers both 3×7 and 7×3).
export type FactKey = string

export interface Fact {
  key: FactKey
  a: number
  b: number
  /** 1 = easy (2,5,9), 2 = medium (4,6), 3 = hard (3,7,8) */
  difficulty: 1 | 2 | 3
}

export interface FactStat {
  /** Leitner-style strength, 0 (new/forgotten) to 5 (mastered) */
  strength: number
  /** Timestamp (ms) when this fact is due for review again */
  dueAt: number
  /** Timestamp (ms) of the last time it was asked */
  lastSeen: number
  correct: number
  wrong: number
}

export type Duration = 120 | 300

export interface GameRecord {
  /** Timestamp (ms) when the game finished */
  at: number
  score: number
  duration: Duration
  correct: number
  answered: number
}

export interface AppState {
  version: 1
  facts: Record<FactKey, FactStat>
  highScores: Partial<Record<Duration, number>>
  streak: { lastDay: string; count: number }
  settings: { sound: boolean; duration: Duration }
  totals: { sessions: number; answered: number; correct: number }
  /** Most recent games first, capped at HISTORY_LIMIT */
  history: GameRecord[]
}

export interface SessionResult {
  score: number
  answered: number
  correct: number
  bestStreak: number
  isNewHighScore: boolean
  duration: Duration
  /** Animals unlocked by this game's score */
  unlockedNow: import('./animals').Animal[]
}
