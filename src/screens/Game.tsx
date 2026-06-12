import { useEffect, useMemo, useRef, useState } from 'react'
import type { AppState, Duration, FactKey, SessionResult } from '../lib/types'
import { FACTS_BY_KEY, presentFact } from '../lib/facts'
import { pickNextFact, recordAnswer } from '../lib/scheduler'
import { pointsFor } from '../lib/score'
import { bumpStreak, getHighScore, HISTORY_LIMIT, saveState } from '../lib/storage'
import { playCorrect, playWrong } from '../lib/audio'
import { Keypad } from '../components/Keypad'
import { Icon } from '../components/Icon'
import { Mascot, type Mood } from '../components/Mascot'
import { bestScore, newlyUnlocked, randomUnlocked, type Animal } from '../lib/animals'

interface GameProps {
  state: AppState
  duration: Duration
  onFinish: (result: SessionResult) => void
}

interface Question {
  key: FactKey
  left: number
  right: number
  isRetry: boolean
}

interface Retry {
  key: FactKey
  afterAnswered: number
}

const WRONG_FEEDBACK_MS = 2000
const CORRECT_FEEDBACK_MS = 650
const RETRY_GAP = 3
// Answers slower than this earn half points and don't raise SRS strength.
const SLOW_ANSWER_MS = 10000

export function Game({ state, duration, onFinish }: GameProps) {
  const totalMs = duration * 1000
  const endAtRef = useRef(Date.now() + totalMs)
  const [timeLeft, setTimeLeft] = useState(totalMs)

  const [score, setScore] = useState(0)
  const [answer, setAnswer] = useState('')
  const [feedback, setFeedback] = useState<'idle' | 'correct' | 'wrong'>('idle')
  const [lastPoints, setLastPoints] = useState(0)
  const [skipped, setSkipped] = useState(false)

  const [animal, setAnimal] = useState<Animal>(() => randomUnlocked(state))
  const questionStartRef = useRef(Date.now())

  // Source of truth for session bookkeeping: timeouts and the timer callback
  // read from here, so they never see stale React state.
  const session = useRef({
    score: 0,
    answered: 0,
    correct: 0,
    streak: 0,
    bestStreak: 0,
    recent: [] as FactKey[],
    retries: [] as Retry[],
    finished: false,
  })

  const makeQuestion = (): Question => {
    const s = session.current
    const elapsedFraction = 1 - Math.max(0, endAtRef.current - Date.now()) / totalMs
    const retryIdx = s.retries.findIndex((r) => r.afterAnswered <= s.answered)
    if (retryIdx >= 0) {
      const [retry] = s.retries.splice(retryIdx, 1)
      const fact = FACTS_BY_KEY[retry.key]
      const { left, right } = presentFact(fact)
      return { key: fact.key, left, right, isRetry: true }
    }
    const fact = pickNextFact(state, elapsedFraction, s.recent, Date.now())
    const { left, right } = presentFact(fact)
    return { key: fact.key, left, right, isRetry: false }
  }

  const [question, setQuestion] = useState<Question>(makeQuestion)
  const correctAnswer = useMemo(() => question.left * question.right, [question])

  const finish = () => {
    const s = session.current
    if (s.finished) return
    s.finished = true
    const prevHigh = getHighScore(state, duration)
    const prevBest = bestScore(state)
    const isNewHighScore = s.answered > 0 && s.score > prevHigh
    if (isNewHighScore) state.highScores[duration] = s.score
    const unlockedNow = newlyUnlocked(prevBest, bestScore(state))
    state.settings.duration = duration
    state.totals.sessions += 1
    state.history = [
      { at: Date.now(), score: s.score, duration, correct: s.correct, answered: s.answered },
      ...state.history,
    ].slice(0, HISTORY_LIMIT)
    bumpStreak(state)
    saveState(state)
    onFinish({
      score: s.score,
      answered: s.answered,
      correct: s.correct,
      bestStreak: s.bestStreak,
      isNewHighScore,
      duration,
      unlockedNow,
    })
  }

  // Timer tick. When time runs out we finish, unless the kid is mid-feedback
  // (the feedback timeout will finish for us).
  useEffect(() => {
    const id = setInterval(() => {
      const left = Math.max(0, endAtRef.current - Date.now())
      setTimeLeft(left)
      if (left <= 0) {
        clearInterval(id)
        if (feedback === 'idle') finish()
      }
    }, 200)
    return () => clearInterval(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [feedback, score])

  const nextQuestion = () => {
    if (Date.now() >= endAtRef.current) {
      finish()
      return
    }
    setAnswer('')
    setFeedback('idle')
    setSkipped(false)
    setAnimal((a) => randomUnlocked(state, a))
    setQuestion(makeQuestion())
    questionStartRef.current = Date.now()
  }

  const fail = (wasSkipped: boolean) => {
    const s = session.current
    s.answered += 1
    s.recent = [...s.recent.slice(-3), question.key]
    recordAnswer(state, question.key, 'wrong', Date.now())
    state.totals.answered += 1
    s.streak = 0
    s.retries.push({ key: question.key, afterAnswered: s.answered + RETRY_GAP })
    setSkipped(wasSkipped)
    setFeedback('wrong')
    playWrong()
    setTimeout(nextQuestion, WRONG_FEEDBACK_MS)
    saveState(state)
  }

  const skip = () => {
    if (feedback !== 'idle') return
    fail(true)
  }

  const submit = () => {
    if (feedback !== 'idle' || answer === '') return
    if (parseInt(answer, 10) !== correctAnswer) {
      fail(false)
      return
    }
    const s = session.current
    const slow = Date.now() - questionStartRef.current > SLOW_ANSWER_MS
    s.answered += 1
    s.recent = [...s.recent.slice(-3), question.key]
    recordAnswer(state, question.key, slow ? 'slow' : 'correct', Date.now())
    state.totals.answered += 1
    s.correct += 1
    state.totals.correct += 1
    s.streak += 1
    s.bestStreak = Math.max(s.bestStreak, s.streak)
    const base = pointsFor(FACTS_BY_KEY[question.key], s.streak - 1)
    const pts = slow ? Math.ceil(base / 2) : base
    s.score += pts
    setLastPoints(pts)
    setScore(s.score)
    setFeedback('correct')
    playCorrect()
    setTimeout(nextQuestion, CORRECT_FEEDBACK_MS)
    saveState(state)
  }

  const onDigit = (d: number) => {
    if (feedback !== 'idle') return
    setAnswer((v) => (v.length >= 2 ? v : v === '0' ? String(d) : v + d))
  }
  const onDelete = () => setAnswer((v) => v.slice(0, -1))

  // Physical keyboard support (handy on desktop).
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key >= '0' && e.key <= '9') onDigit(parseInt(e.key, 10))
      else if (e.key === 'Backspace') onDelete()
      else if (e.key === 'Enter') submit()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  })

  const mood: Mood = feedback === 'correct' ? 'cheer' : feedback === 'wrong' ? 'sad' : 'neutral'
  const timeFraction = timeLeft / totalMs
  const seconds = Math.ceil(timeLeft / 1000)
  const mm = Math.floor(seconds / 60)
  const ss = String(seconds % 60).padStart(2, '0')

  return (
    <div className={`screen game ${feedback}`}>
      <header className="game-top">
        <div className="timer">
          <div className="timer-bar">
            <div
              className={`timer-fill ${timeFraction < 0.15 ? 'urgent' : ''}`}
              style={{ width: `${timeFraction * 100}%` }}
            />
          </div>
          <span className="timer-text">
            {mm}:{ss}
          </span>
        </div>
        <div className="score">
          <Icon name="star" /> {score}
        </div>
      </header>

      <main className="game-main">
        <div className="mascot-row">
          <span key={animal} className="mascot-swap">
            <Mascot animal={animal} mood={mood} size={96} />
          </span>
          {feedback === 'correct' && <div className="points-pop">+{lastPoints}</div>}
        </div>

        <div className="question">
          {question.left} × {question.right}
        </div>

        {feedback === 'wrong' ? (
          <div className="solution">
            <span className="solution-msg">{skipped ? 'La respuesta es...' : '¡Casi! Es...'}</span>
            <span className="solution-eq">
              {question.left} × {question.right} = <strong>{correctAnswer}</strong>
            </span>
          </div>
        ) : (
          <div className={`answer-box ${feedback === 'correct' ? 'answer-ok' : ''}`}>
            {answer || ' '}
          </div>
        )}

        <button className="skip-btn" onPointerDown={skip} disabled={feedback !== 'idle'}>
          Pasar <Icon name="play" color="#8d7b72" size="0.9em" />
        </button>
      </main>

      <Keypad
        onDigit={onDigit}
        onDelete={onDelete}
        onSubmit={submit}
        disabled={feedback !== 'idle'}
        canSubmit={answer !== ''}
      />
    </div>
  )
}
