import { useState } from 'react'
import type { AppState, Duration, GameMode } from '../lib/types'
import { currentStreak, getHighScore } from '../lib/storage'
import { Mascot } from '../components/Mascot'
import { randomUnlocked, type Animal } from '../lib/animals'
import { Icon } from '../components/Icon'
import { playTap } from '../lib/audio'

interface HomeProps {
  state: AppState
  onPlay: (duration: Duration, mode: GameMode) => void
  onStats: () => void
  onHistory: () => void
  onGallery: () => void
  onToggleSound: () => void
}

export function Home({ state, onPlay, onStats, onHistory, onGallery, onToggleSound }: HomeProps) {
  const [animal] = useState<Animal>(() => randomUnlocked(state))
  const [duration, setDuration] = useState<Duration>(state.settings.duration)
  const streak = currentStreak(state)
  const highMult = getHighScore(state, 'mult', duration)
  const highAddSub = getHighScore(state, 'addsub', duration)

  const pick = (d: Duration) => {
    playTap()
    setDuration(d)
  }

  return (
    <div className="screen home">
      <header className="home-top">
        <button className="chip" onClick={onToggleSound} aria-label="Sonido">
          <Icon name={state.settings.sound ? 'sound-on' : 'sound-off'} />
        </button>
        {streak > 0 && (
          <span className="chip streak-chip" title="Días seguidos jugando">
            <Icon name="flame" /> {streak} {streak === 1 ? 'día' : 'días'}
          </span>
        )}
        <span className="home-top-right">
          <button className="chip" onClick={onGallery} aria-label="Mis animales">
            <Icon name="paw" />
          </button>
          <button className="chip" onClick={onHistory} aria-label="Últimas partidas">
            <Icon name="trophy" />
          </button>
          <button className="chip" onClick={onStats} aria-label="Progreso">
            <Icon name="chart" />
          </button>
        </span>
      </header>

      <h1 className="title">
        ¡Multiplica!
        <span className="title-sub">Tablas, sumas y restas</span>
      </h1>

      <Mascot animal={animal} mood="happy" size={110} />

      <div className="duration-picker">
        <button className={`duration-btn ${duration === 120 ? 'selected' : ''}`} onClick={() => pick(120)}>
          <Icon name="timer" /> 2 min
        </button>
        <button className={`duration-btn ${duration === 300 ? 'selected' : ''}`} onClick={() => pick(300)}>
          <Icon name="timer" /> 5 min
        </button>
      </div>

      <div className="highscore-box">
        <Icon name="trophy" />
        {highMult > 0 || highAddSub > 0 ? (
          <span>
            Récords: × <strong>{highMult}</strong> · ± <strong>{highAddSub}</strong>
          </span>
        ) : (
          <span>¡Consigue tu primer récord!</span>
        )}
      </div>

      <div className="mode-buttons">
        <button className="play-btn mode-btn" onClick={() => onPlay(duration, 'mult')}>
          <span className="mode-op">×</span> ¡Multiplicar!
        </button>
        <button className="play-btn mode-btn mode-btn-addsub" onClick={() => onPlay(duration, 'addsub')}>
          <span className="mode-op">±</span> ¡Sumar y restar!
        </button>
      </div>
    </div>
  )
}
