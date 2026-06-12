import { useState } from 'react'
import type { AppState, FactKey, GameMode } from '../lib/types'
import { ADD_MAX, addKey, FACTS_FOR_MODE, factKey, MAX_FACTOR, MIN_FACTOR, subKey } from '../lib/facts'
import { currentStreak, defaultState, getFactStat, saveState } from '../lib/storage'
import { Icon } from '../components/Icon'

interface StatsProps {
  state: AppState
  onBack: () => void
  onReset: () => void
}

const MULT_RANGE = Array.from({ length: MAX_FACTOR - MIN_FACTOR + 1 }, (_, i) => MIN_FACTOR + i)
const ADD_RANGE = Array.from({ length: ADD_MAX }, (_, i) => i + 1)

// Strength 0..5 → red to green.
const STRENGTH_COLORS = ['#fecaca', '#fdba74', '#fde68a', '#d9f99d', '#86efac', '#4ade80']

function Cell({ state, factK, label, title }: { state: AppState; factK: FactKey; label: number; title: string }) {
  const stat = getFactStat(state, factK)
  const seen = stat.lastSeen > 0
  return (
    <td
      style={{ background: seen ? STRENGTH_COLORS[stat.strength] : '#f1f5f9' }}
      title={`${title} · nivel ${stat.strength}/5 · ${stat.correct}✓ ${stat.wrong}✗`}
    >
      {label}
    </td>
  )
}

export function Stats({ state, onBack, onReset }: StatsProps) {
  const [mode, setMode] = useState<GameMode>('mult')
  const { answered, correct, sessions } = state.totals
  const accuracy = answered > 0 ? Math.round((correct / answered) * 100) : 0
  const streak = currentStreak(state)

  const pool = FACTS_FOR_MODE[mode].map((f) => getFactStat(state, f.key))
  const masteredCount = pool.filter((s) => s.strength >= 4).length

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
          <Icon name="sparkle" /> Dominadas: {masteredCount} / {pool.length}
        </div>
      </div>

      <div className="stats-mode-toggle">
        <button className={`duration-btn ${mode === 'mult' ? 'selected' : ''}`} onClick={() => setMode('mult')}>
          × Tablas
        </button>
        <button className={`duration-btn ${mode === 'addsub' ? 'selected' : ''}`} onClick={() => setMode('addsub')}>
          ± Sumas y restas
        </button>
      </div>

      {mode === 'mult' ? (
        <div className="heatmap-wrap">
          <table className="heatmap">
            <thead>
              <tr>
                <th>×</th>
                {MULT_RANGE.map((b) => (
                  <th key={b}>{b}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {MULT_RANGE.map((a) => (
                <tr key={a}>
                  <th>{a}</th>
                  {MULT_RANGE.map((b) => (
                    <Cell key={b} state={state} factK={factKey(a, b)} label={a * b} title={`${a}×${b} = ${a * b}`} />
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <>
          <div className="heatmap-wrap">
            <h3 className="heatmap-title">Sumas</h3>
            <table className="heatmap">
              <thead>
                <tr>
                  <th>+</th>
                  {ADD_RANGE.map((b) => (
                    <th key={b}>{b}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ADD_RANGE.map((a) => (
                  <tr key={a}>
                    <th>{a}</th>
                    {ADD_RANGE.map((b) => (
                      <Cell key={b} state={state} factK={addKey(a, b)} label={a + b} title={`${a}+${b} = ${a + b}`} />
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="heatmap-wrap">
            <h3 className="heatmap-title">Restas</h3>
            <table className="heatmap">
              <thead>
                <tr>
                  <th>−</th>
                  {ADD_RANGE.map((s) => (
                    <th key={s}>{s}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ADD_RANGE.map((r) => (
                  <tr key={r}>
                    <th>={r}</th>
                    {ADD_RANGE.map((s) => (
                      <Cell
                        key={s}
                        state={state}
                        factK={subKey(r + s, s)}
                        label={r + s}
                        title={`${r + s}−${s} = ${r}`}
                      />
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="heatmap-caption">Cada casilla: el número de la casilla − la columna = la fila.</p>
          </div>
        </>
      )}

      <div className="legend">
        <span>Necesita práctica</span>
        <span className="legend-swatches">
          {STRENGTH_COLORS.map((c) => (
            <i key={c} style={{ background: c }} />
          ))}
        </span>
        <span>Dominada</span>
      </div>

      <button className="danger-btn" onClick={reset}>
        <Icon name="trash" /> Borrar progreso
      </button>
    </div>
  )
}
