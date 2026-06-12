import { useEffect, useState } from 'react'
import type { AppState, SessionResult } from '../lib/types'
import { ANIMAL_INFO, randomUnlockedSample } from '../lib/animals'
import { Mascot } from '../components/Mascot'
import { Icon } from '../components/Icon'
import { playHighScore, playSessionEnd } from '../lib/audio'

interface ResultsProps {
  state: AppState
  result: SessionResult
  highScore: number
  onPlayAgain: () => void
  onHome: () => void
}

const PRAISE = ['¡Genial!', '¡Muy bien!', '¡Fantástico!', '¡Eres un crack!', '¡Súper!']

export function Results({ state, result, highScore, onPlayAgain, onHome }: ResultsProps) {
  useEffect(() => {
    if (result.isNewHighScore) playHighScore()
    else playSessionEnd()
  }, [result.isNewHighScore])

  const [praise] = useState(() => PRAISE[Math.floor(Math.random() * PRAISE.length)])
  const [parade] = useState(() => randomUnlockedSample(state, 4))
  const nameOf = (id: string) => ANIMAL_INFO.find((a) => a.id === id)?.name ?? id

  return (
    <div className="screen results">
      {result.isNewHighScore && (
        <div className="confetti" aria-hidden="true">
          {Array.from({ length: 24 }, (_, i) => (
            <span key={i} className="confetti-piece" style={{ ['--i' as string]: i }} />
          ))}
        </div>
      )}

      <h2 className="results-title">
        {result.isNewHighScore ? (
          <>
            <Icon name="trophy" /> ¡NUEVO RÉCORD!
          </>
        ) : (
          praise
        )}
      </h2>

      {result.unlockedNow.length > 0 ? (
        <div className="unlock-banner">
          <span className="unlock-title">
            <Icon name="sparkle" /> ¡{result.unlockedNow.length === 1 ? 'Nuevo amigo' : 'Nuevos amigos'}!
          </span>
          <div className="unlock-row">
            {result.unlockedNow.map((a) => (
              <div key={a} className="unlock-card">
                <Mascot animal={a} mood="cheer" size={84} />
                <span>{nameOf(a)}</span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="mascot-parade">
          {parade.map((a) => (
            <Mascot key={a} animal={a} mood="cheer" size={72} />
          ))}
        </div>
      )}

      <div className="results-score">
        <span className="results-score-num">{result.score}</span>
        <span className="results-score-label">puntos</span>
      </div>

      <div className="results-stats">
        <div className="stat-pill">
          <Icon name="check" /> {result.correct} de {result.answered}
        </div>
        <div className="stat-pill">
          <Icon name="bolt" /> Mejor racha: {result.bestStreak}
        </div>
        {!result.isNewHighScore && highScore > 0 && (
          <div className="stat-pill">
            <Icon name="trophy" /> Récord: {highScore}
          </div>
        )}
      </div>

      <button className="play-btn" onClick={onPlayAgain}>
        <Icon name="replay" color="#fff" /> ¡Otra vez!
      </button>
      <button className="secondary-btn" onClick={onHome}>
        <Icon name="home" /> Inicio
      </button>
    </div>
  )
}
