import type { AppState } from '../lib/types'
import { ANIMAL_INFO, bestScore, isUnlocked } from '../lib/animals'
import { Mascot } from '../components/Mascot'
import { Icon } from '../components/Icon'

interface GalleryProps {
  state: AppState
  onBack: () => void
}

export function Gallery({ state, onBack }: GalleryProps) {
  const best = bestScore(state)
  const unlockedCount = ANIMAL_INFO.filter((a) => isUnlocked(a, state)).length

  return (
    <div className="screen gallery">
      <header className="stats-top">
        <button className="chip" onClick={onBack}>
          ← Volver
        </button>
        <h2>Mis animales</h2>
      </header>

      <div className="results-stats">
        <div className="stat-pill">
          <Icon name="trophy" /> Tu récord: {best}
        </div>
        <div className="stat-pill">
          <Icon name="paw" /> {unlockedCount} / {ANIMAL_INFO.length}
        </div>
      </div>

      <div className="gallery-grid">
        {ANIMAL_INFO.map((a) => {
          const unlocked = isUnlocked(a, state)
          return (
            <div key={a.id} className={`gallery-card ${unlocked ? '' : 'locked'}`}>
              <div className="gallery-mascot">
                <Mascot animal={a.id} mood={unlocked ? 'happy' : 'neutral'} size={76} />
              </div>
              {unlocked ? (
                <span className="gallery-name">{a.name}</span>
              ) : (
                <span className="gallery-goal">
                  <Icon name="trophy" size="1em" /> {a.score}
                </span>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
