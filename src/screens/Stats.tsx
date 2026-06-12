import type { AppState } from '../lib/types'
import { factKey, MAX_FACTOR, MIN_FACTOR } from '../lib/facts'
import { currentStreak, defaultState, getFactStat, saveState } from '../lib/storage'
import { Icon } from '../components/Icon'

interface StatsProps {
  state: AppState
  onBack: () => void
  onReset: () => void
}

const RANGE = Array.from({ length: MAX_FACTOR - MIN_FACTOR + 1 }, (_, i) => MIN_FACTOR + i)

// Strength 0..5 → red to green.
const STRENGTH_COLORS = ['#fecaca', '#fdba74', '#fde68a', '#d9f99d', '#86efac', '#4ade80']

export function Stats({ state, onBack, onReset }: StatsProps) {
  const { answered, correct, sessions } = state.totals
  const accuracy = answered > 0 ? Math.round((correct / answered) * 100) : 0
  const streak = currentStreak(state)

  const mastered = RANGE.flatMap((a) => RANGE.filter((b) => b >= a).map((b) => getFactStat(state, factKey(a, b))))
  const masteredCount = mastered.filter((s) => s.strength >= 4).length

  const reset = () => {
    if (window.confirm('¿Seguro que quieres borrar todo el progreso? Esto no se puede deshacer.')) {
      saveState(defaultState())
      onReset()
    }
  }

  return (
    <div className="screen stats">
      <header className="stats-top">
        <button className="chip" onClick={onBack}>
          ← Volver
        </button>
        <h2>Progreso</h2>
      </header>

      <div className="results-stats">
        <div className="stat-pill">
          <Icon name="target" /> Acierto: {accuracy}%
        </div>
        <div className="stat-pill">
          <Icon name="paw" /> {answered} {answered === 1 ? 'respuesta' : 'respuestas'}
        </div>
        <div className="stat-pill">
          <Icon name="gamepad" /> {sessions} {sessions === 1 ? 'partida' : 'partidas'}
        </div>
        <div className="stat-pill">
          <Icon name="flame" /> Racha: {streak} {streak === 1 ? 'día' : 'días'}
        </div>
        <div className="stat-pill">
          <Icon name="sparkle" /> Dominadas: {masteredCount} / {mastered.length}
        </div>
      </div>

      <div className="heatmap-wrap">
        <table className="heatmap">
          <thead>
            <tr>
              <th>×</th>
              {RANGE.map((b) => (
                <th key={b}>{b}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {RANGE.map((a) => (
              <tr key={a}>
                <th>{a}</th>
                {RANGE.map((b) => {
                  const stat = getFactStat(state, factKey(a, b))
                  const seen = stat.lastSeen > 0
                  return (
                    <td
                      key={b}
                      style={{ background: seen ? STRENGTH_COLORS[stat.strength] : '#f1f5f9' }}
                      title={`${a}×${b} = ${a * b} · nivel ${stat.strength}/5 · ${stat.correct}✓ ${stat.wrong}✗`}
                    >
                      {a * b}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
        <div className="legend">
          <span>Necesita práctica</span>
          <span className="legend-swatches">
            {STRENGTH_COLORS.map((c) => (
              <i key={c} style={{ background: c }} />
            ))}
          </span>
          <span>Dominada</span>
        </div>
      </div>

      <button className="danger-btn" onClick={reset}>
        <Icon name="trash" /> Borrar progreso
      </button>
    </div>
  )
}
