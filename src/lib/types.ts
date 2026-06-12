// A "fact" is a single thing to memorize, identified by its key:
//  - multiplication: unordered pair {a, b}, key "axb" with a <= b
//    (e.g. "3x7" covers both 3×7 and 7×3)
//  - addition: unordered pair {a, b}, key "a+b" with a <= b
//  - subtraction: ordered "m-s" (m is always the minuend)
export type FactKey = string

export type Op = 'x' | '+' | '-'

/** Each game mode has its own fact pool, ranking and heatmap. */
export type GameMode = 'mult' | 'addsub'

export interface Fact {
  key: FactKey
  /** First operand; for subtraction, the minuend. */
  a: number
  /** Second operand; for subtraction, the subtrahend. */
  b: number
  op: Op
  /** 1 = easy, 2 = medium, 3 = hard */
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
  mode: GameMode
  correct: number
  answered: number
}

export interface AppState {
  version: 2
  facts: Record<FactKey, FactStat>
  highScores: Record<GameMode, Partial<Record<Duration, number>>>
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
  mode: GameMode
  /** Animals unlocked by this game's score */
  unlockedNow: import('./animals').Animal[]
}
