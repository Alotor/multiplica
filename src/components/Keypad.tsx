import { playTap } from '../lib/audio'
import { Icon } from './Icon'

interface KeypadProps {
  onDigit: (d: number) => void
  onDelete: () => void
  onSubmit: () => void
  disabled?: boolean
  canSubmit?: boolean
}

const KEYS = [1, 2, 3, 4, 5, 6, 7, 8, 9] as const

export function Keypad({ onDigit, onDelete, onSubmit, disabled, canSubmit }: KeypadProps) {
  const press = (fn: () => void) => () => {
    if (disabled) return
    playTap()
    fn()
  }

  return (
    <div className="keypad">
      {KEYS.map((k) => (
        <button key={k} className="key" onPointerDown={press(() => onDigit(k))} disabled={disabled}>
          {k}
        </button>
      ))}
      <button className="key key-delete" onPointerDown={press(onDelete)} disabled={disabled} aria-label="Borrar">
        <Icon name="backspace" size="1.1em" />
      </button>
      <button className="key" onPointerDown={press(() => onDigit(0))} disabled={disabled}>
        0
      </button>
      <button
        className="key key-ok"
        onPointerDown={press(onSubmit)}
        disabled={disabled || !canSubmit}
        aria-label="Comprobar"
      >
        <Icon name="check" color="#fff" size="1.1em" />
      </button>
    </div>
  )
}
