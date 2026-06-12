import type { AppState, GameRecord } from '../lib/types'
import { Icon } from '../components/Icon'

interface HistoryProps {
  state: AppState
  onBack: () => void
}

function formatDate(at: number): string {
  const d = new Date(at)
  const today = new Date()
  const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000)
  const sameDay = (x: Date, y: Date) =>
    x.getFullYear() === y.getFullYear() && x.getMonth() === y.getMonth() && x.getDate() === y.getDate()

  const time = d.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
  if (sameDay(d, today)) return `Hoy, ${time}`
  if (sameDay(d, yesterday)) return `Ayer, ${time}`
  return `${d.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}, ${time}`
}

export function History({ state, onBack }: HistoryProps) {
  const isRecord = (g: GameRecord) => g.score > 0 && g.score === state.highScores[g.mode][g.duration]

  return (
    <div className="screen history">
      <header className="stats-top">
        <button className="chip" onClick={onBack}>
          ← Volver
        </button>
        <h2>Últimas partidas</h2>
      </header>

      {state.history.length === 0 ? (
        <div className="history-empty">
          <Icon name="gamepad" size="3em" />
          <p>Todavía no hay partidas.</p>
          <p>¡Juega una y aparecerá aquí!</p>
        </div>
      ) : (
        <ul className="history-list">
          {state.history.map((g) => (
            <li key={g.at} className={`history-item ${isRecord(g) ? 'is-record' : ''}`}>
              <div className="history-left">
                <span className="history-date">{formatDate(g.at)}</span>
                <span className="history-meta">
                  <span className="history-mode">{g.mode === 'mult' ? '×' : '±'}</span> ·{' '}
                  <Icon name="timer" size="1em" /> {g.duration / 60} min · {g.correct} de {g.answered}
                </span>
              </div>
              <div className="history-score">
                {isRecord(g) ? <Icon name="trophy" /> : <Icon name="star" />}
                {g.score}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
