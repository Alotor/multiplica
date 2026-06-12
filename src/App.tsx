import { useEffect, useState } from 'react'
import type { AppState, Duration, GameMode, SessionResult } from './lib/types'
import { getHighScore, loadState, saveState } from './lib/storage'
import { setMuted } from './lib/audio'
import { Background } from './components/Background'
import { Home } from './screens/Home'
import { Game } from './screens/Game'
import { Results } from './screens/Results'
import { Stats } from './screens/Stats'
import { History } from './screens/History'
import { Gallery } from './screens/Gallery'

type Screen = 'home' | 'game' | 'results' | 'stats' | 'history' | 'gallery'

export default function App() {
  const [state, setState] = useState<AppState>(loadState)
  const [screen, setScreen] = useState<Screen>('home')
  const [duration, setDuration] = useState<Duration>(state.settings.duration)
  const [mode, setMode] = useState<GameMode>('mult')
  const [result, setResult] = useState<SessionResult | null>(null)
  // Forces a remount of Game so each session starts fresh.
  const [sessionId, setSessionId] = useState(0)

  useEffect(() => {
    setMuted(!state.settings.sound)
  }, [state.settings.sound])

  const startGame = (d: Duration, m: GameMode) => {
    setDuration(d)
    setMode(m)
    setSessionId((v) => v + 1)
    setScreen('game')
  }

  const finishGame = (r: SessionResult) => {
    setResult(r)
    setState({ ...state }) // game mutated and saved `state`; refresh the UI
    setScreen('results')
  }

  const toggleSound = () => {
    const next = { ...state, settings: { ...state.settings, sound: !state.settings.sound } }
    saveState(next)
    setState(next)
  }

  return (
    <>
      <Background />
      {screen === 'home' && (
        <Home
          state={state}
          onPlay={startGame}
          onStats={() => setScreen('stats')}
          onHistory={() => setScreen('history')}
          onGallery={() => setScreen('gallery')}
          onToggleSound={toggleSound}
        />
      )}
      {screen === 'history' && <History state={state} onBack={() => setScreen('home')} />}
      {screen === 'gallery' && <Gallery state={state} onBack={() => setScreen('home')} />}
      {screen === 'game' && (
        <Game key={sessionId} state={state} duration={duration} mode={mode} onFinish={finishGame} />
      )}
      {screen === 'results' && result && (
        <Results
          state={state}
          result={result}
          highScore={getHighScore(state, result.mode, result.duration)}
          onPlayAgain={() => startGame(result.duration, result.mode)}
          onHome={() => setScreen('home')}
        />
      )}
      {screen === 'stats' && (
        <Stats
          state={state}
          onBack={() => setScreen('home')}
          onReset={() => {
            setState(loadState())
            setScreen('home')
          }}
        />
      )}
    </>
  )
}
