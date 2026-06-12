// Cheerful sound effects generated with WebAudio — no audio files needed.

let ctx: AudioContext | null = null
let muted = false

export function setMuted(value: boolean): void {
  muted = value
}

function getCtx(): AudioContext | null {
  if (typeof AudioContext === 'undefined') return null
  if (!ctx) ctx = new AudioContext()
  if (ctx.state === 'suspended') void ctx.resume()
  return ctx
}

function note(
  freq: number,
  startIn: number,
  duration: number,
  type: OscillatorType = 'sine',
  volume = 0.18
): void {
  const ac = getCtx()
  if (!ac || muted) return
  const t0 = ac.currentTime + startIn
  const osc = ac.createOscillator()
  const gain = ac.createGain()
  osc.type = type
  osc.frequency.value = freq
  gain.gain.setValueAtTime(0, t0)
  gain.gain.linearRampToValueAtTime(volume, t0 + 0.015)
  gain.gain.exponentialRampToValueAtTime(0.001, t0 + duration)
  osc.connect(gain).connect(ac.destination)
  osc.start(t0)
  osc.stop(t0 + duration + 0.05)
}

export function playTap(): void {
  note(600, 0, 0.06, 'sine', 0.06)
}

export function playCorrect(): void {
  note(523.25, 0, 0.15, 'triangle') // C5
  note(659.25, 0.09, 0.2, 'triangle') // E5
}

export function playWrong(): void {
  note(220, 0, 0.25, 'sine', 0.12)
  note(185, 0.12, 0.3, 'sine', 0.1)
}

export function playSessionEnd(): void {
  note(523.25, 0, 0.15, 'triangle')
  note(659.25, 0.12, 0.15, 'triangle')
  note(783.99, 0.24, 0.3, 'triangle')
}

export function playHighScore(): void {
  const melody = [523.25, 659.25, 783.99, 1046.5, 783.99, 1046.5]
  melody.forEach((f, i) => note(f, i * 0.12, 0.22, 'triangle', 0.2))
}