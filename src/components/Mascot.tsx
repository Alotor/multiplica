import type { Animal } from '../lib/animals'

export type Mood = 'neutral' | 'happy' | 'sad' | 'cheer'

const INK = '#3b2f2f'

interface Palette {
  body: string
  inner: string
  cheek: string
}

const COLORS: Record<Animal, Palette> = {
  hamster: { body: '#f5b971', inner: '#fde8cd', cheek: '#f79892' },
  quokka: { body: '#b08358', inner: '#e8cdb0', cheek: '#e89a8f' },
  axolotl: { body: '#f8a8c2', inner: '#fdd9e5', cheek: '#f06d96' },
  capybara: { body: '#a9805b', inner: '#d9bb98', cheek: '#e0907f' },
  bunny: { body: '#eceff1', inner: '#ffffff', cheek: '#f6b6c2' },
  mouse: { body: '#b9c0cb', inner: '#e8e4e6', cheek: '#f1b3bb' },
  cat: { body: '#e8927c', inner: '#fbe0d4', cheek: '#ef8b8b' },
  frog: { body: '#8ed081', inner: '#e3f6da', cheek: '#f0a8a8' },
  chicken: { body: '#fbd66f', inner: '#fdeebc', cheek: '#f5a886' },
  pig: { body: '#f5a8bc', inner: '#fac4d2', cheek: '#ef7f9a' },
  sheep: { body: '#d9b692', inner: '#f0ddc4', cheek: '#e89a8f' },
  cow: { body: '#f7f3ec', inner: '#f3c6c0', cheek: '#e9a89e' },
  goat: { body: '#cbb6a0', inner: '#ece0d0', cheek: '#e0907f' },
  monkey: { body: '#a9805b', inner: '#e8cdb0', cheek: '#e89a8f' },
  lion: { body: '#f6ad55', inner: '#fde4c0', cheek: '#ee8f6e' },
  tiger: { body: '#fb923c', inner: '#fde4c0', cheek: '#f08080' },
  shark: { body: '#9db4c0', inner: '#eef4f7', cheek: '#aebfd4' },
  dragon: { body: '#66c9ae', inner: '#d9f7ec', cheek: '#f49a9a' },
}

function Eyes({ mood }: { mood: Mood }) {
  if (mood === 'happy' || mood === 'cheer') {
    return (
      <g stroke={INK} strokeWidth="4" strokeLinecap="round" fill="none">
        <path d="M 36 52 q 7 -9 14 0" />
        <path d="M 70 52 q 7 -9 14 0" />
      </g>
    )
  }
  if (mood === 'sad') {
    return (
      <g fill={INK}>
        <circle cx="43" cy="54" r="4.5" />
        <circle cx="77" cy="54" r="4.5" />
        <g stroke={INK} strokeWidth="3" strokeLinecap="round">
          <path d="M 34 44 l 14 4" fill="none" />
          <path d="M 86 44 l -14 4" fill="none" />
        </g>
      </g>
    )
  }
  return (
    <g fill={INK}>
      <circle cx="43" cy="52" r="5" />
      <circle cx="77" cy="52" r="5" />
      <circle cx="44.5" cy="50.5" r="1.6" fill="#fff" />
      <circle cx="78.5" cy="50.5" r="1.6" fill="#fff" />
    </g>
  )
}

function Mouth({ mood, wide }: { mood: Mood; wide?: boolean }) {
  if (wide) {
    // Frog-style mouth: much bigger, spanning most of the face.
    if (mood === 'cheer') {
      return <path d="M 36 66 q 24 26 48 0 z" fill="#7a4242" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
    }
    if (mood === 'happy') {
      return <path d="M 34 66 q 26 22 52 0" fill="none" stroke={INK} strokeWidth="4" strokeLinecap="round" />
    }
    if (mood === 'sad') {
      return <path d="M 42 78 q 18 -14 36 0" fill="none" stroke={INK} strokeWidth="4" strokeLinecap="round" />
    }
    return <path d="M 38 68 q 22 16 44 0" fill="none" stroke={INK} strokeWidth="4" strokeLinecap="round" />
  }
  if (mood === 'cheer') {
    return <path d="M 48 70 q 12 16 24 0 z" fill="#7a4242" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
  }
  if (mood === 'happy') {
    return <path d="M 46 70 q 14 12 28 0" fill="none" stroke={INK} strokeWidth="4" strokeLinecap="round" />
  }
  if (mood === 'sad') {
    return <path d="M 50 76 q 10 -8 20 0" fill="none" stroke={INK} strokeWidth="4" strokeLinecap="round" />
  }
  return <path d="M 50 71 q 10 7 20 0" fill="none" stroke={INK} strokeWidth="4" strokeLinecap="round" />
}

/** Drawn behind the face: ears, horns, manes, fins... */
function DecorBack({ animal, c }: { animal: Animal; c: Palette }) {
  switch (animal) {
    case 'hamster':
      return (
        <g>
          <circle cx="30" cy="22" r="14" fill={c.body} />
          <circle cx="90" cy="22" r="14" fill={c.body} />
          <circle cx="30" cy="22" r="7" fill={c.inner} />
          <circle cx="90" cy="22" r="7" fill={c.inner} />
        </g>
      )
    case 'quokka':
    case 'goat':
      return (
        <g>
          <ellipse cx="26" cy="24" rx="11" ry="14" fill={c.body} />
          <ellipse cx="94" cy="24" rx="11" ry="14" fill={c.body} />
          <ellipse cx="26" cy="26" rx="5" ry="8" fill={c.inner} />
          <ellipse cx="94" cy="26" rx="5" ry="8" fill={c.inner} />
          {animal === 'goat' && (
            <g fill="#8f7355">
              <path d="M 42 20 Q 28 16 24 2 Q 40 4 47 16 z" />
              <path d="M 78 20 Q 92 16 96 2 Q 80 4 73 16 z" />
            </g>
          )}
        </g>
      )
    case 'axolotl': {
      const frond = (x: number, y: number, flip: boolean) => (
        <ellipse key={`${x}-${y}`} cx={x} cy={y} rx="13" ry="5" fill="#f06d96" transform={`rotate(${flip ? 30 : -30} ${x} ${y})`} />
      )
      return (
        <g>
          {frond(14, 30, false)}
          {frond(10, 48, false)}
          {frond(14, 66, false)}
          {frond(106, 30, true)}
          {frond(110, 48, true)}
          {frond(106, 66, true)}
        </g>
      )
    }
    case 'capybara':
      return (
        <g>
          <ellipse cx="32" cy="18" rx="9" ry="11" fill={c.body} />
          <ellipse cx="88" cy="18" rx="9" ry="11" fill={c.body} />
          <ellipse cx="32" cy="19" rx="4" ry="6" fill={c.inner} />
          <ellipse cx="88" cy="19" rx="4" ry="6" fill={c.inner} />
        </g>
      )
    case 'bunny':
      return (
        <g>
          <ellipse cx="36" cy="8" rx="11" ry="25" fill={c.body} transform="rotate(-18 36 8)" />
          <ellipse cx="84" cy="8" rx="11" ry="25" fill={c.body} transform="rotate(18 84 8)" />
          <ellipse cx="36" cy="9" rx="5" ry="17" fill="#f6c9d4" transform="rotate(-18 36 9)" />
          <ellipse cx="84" cy="9" rx="5" ry="17" fill="#f6c9d4" transform="rotate(18 84 9)" />
        </g>
      )
    case 'mouse':
      return (
        <g>
          <circle cx="26" cy="22" r="16" fill={c.body} />
          <circle cx="94" cy="22" r="16" fill={c.body} />
          <circle cx="26" cy="22" r="8.5" fill="#f1c8cf" />
          <circle cx="94" cy="22" r="8.5" fill="#f1c8cf" />
        </g>
      )
    case 'cat':
    case 'tiger':
      return (
        <g>
          <path d="M 22 38 L 30 8 L 52 24 z" fill={c.body} />
          <path d="M 98 38 L 90 8 L 68 24 z" fill={c.body} />
          <path d="M 29 30 L 33 16 L 44 24 z" fill={c.inner} />
          <path d="M 91 30 L 87 16 L 76 24 z" fill={c.inner} />
        </g>
      )
    case 'frog':
      // Eye bumps on top of the head; the eyes render inside them.
      return (
        <g>
          <circle cx="43" cy="26" r="14" fill={c.body} />
          <circle cx="77" cy="26" r="14" fill={c.body} />
        </g>
      )
    case 'chicken':
      return (
        <g fill="#ef4444">
          <circle cx="49" cy="11" r="6.5" />
          <circle cx="60" cy="7" r="7" />
          <circle cx="71" cy="11" r="6.5" />
        </g>
      )
    case 'pig':
      return (
        <g fill={c.body}>
          <path d="M 24 36 Q 16 12 36 14 Q 44 22 42 34 z" />
          <path d="M 96 36 Q 104 12 84 14 Q 76 22 78 34 z" />
        </g>
      )
    case 'sheep':
      return (
        <g fill="#fcf3e3">
          <circle cx="24" cy="32" r="14" />
          <circle cx="38" cy="18" r="14" />
          <circle cx="60" cy="12" r="15" />
          <circle cx="82" cy="18" r="14" />
          <circle cx="96" cy="32" r="14" />
          <circle cx="14" cy="50" r="12" />
          <circle cx="106" cy="50" r="12" />
        </g>
      )
    case 'cow':
      return (
        <g>
          <path d="M 38 18 Q 24 4 12 10 Q 22 22 40 24 z" fill="#e9d8b0" />
          <path d="M 82 18 Q 96 4 108 10 Q 98 22 80 24 z" fill="#e9d8b0" />
        </g>
      )
    case 'monkey':
      return (
        <g>
          <circle cx="13" cy="50" r="12" fill={c.body} />
          <circle cx="107" cy="50" r="12" fill={c.body} />
          <circle cx="13" cy="50" r="6" fill={c.inner} />
          <circle cx="107" cy="50" r="6" fill={c.inner} />
        </g>
      )
    case 'lion': {
      const petals = Array.from({ length: 10 }, (_, i) => {
        const ang = (i / 10) * Math.PI * 2 - Math.PI / 2
        return <circle key={i} cx={60 + Math.cos(ang) * 47} cy={58 + Math.sin(ang) * 44} r="14" fill="#dd8a2f" />
      })
      return (
        <g>
          {petals}
          <circle cx="60" cy="58" r="50" fill="#dd8a2f" />
        </g>
      )
    }
    case 'shark':
      return <path d="M 60 0 L 74 17 Q 60 10 46 17 z" fill={c.body} />
    case 'dragon':
      return (
        <g>
          <path d="M 42 18 L 34 2 L 50 10 z" fill="#fdf0d5" />
          <path d="M 78 18 L 86 2 L 70 10 z" fill="#fdf0d5" />
          <path d="M 53 12 L 60 1 L 67 12 z" fill="#4cb89e" />
        </g>
      )
    default:
      return null
  }
}

/** Drawn on the face, under eyes and muzzle details: patches, stripes, spots. */
function DecorUnder({ animal, c }: { animal: Animal; c: Palette }) {
  switch (animal) {
    case 'monkey':
      return <ellipse cx="60" cy="56" rx="30" ry="26" fill={c.inner} />
    case 'sheep':
      return (
        <g fill="#fcf3e3">
          <circle cx="46" cy="24" r="10" />
          <circle cx="60" cy="20" r="12" />
          <circle cx="74" cy="24" r="10" />
        </g>
      )
    case 'tiger':
      return (
        <g stroke={INK} strokeWidth="5" strokeLinecap="round">
          <path d="M 47 17 v 9" />
          <path d="M 60 14 v 11" />
          <path d="M 73 17 v 9" />
          <path d="M 16 52 h 9" />
          <path d="M 95 52 h 9" />
        </g>
      )
    case 'cow':
      return (
        <g fill="#8a7468">
          <ellipse cx="30" cy="33" rx="9" ry="7" transform="rotate(-18 30 33)" />
          <ellipse cx="88" cy="28" rx="8" ry="6" transform="rotate(14 88 28)" />
        </g>
      )
    default:
      return null
  }
}

function Teeth() {
  return (
    <g fill="#fff" stroke={INK} strokeWidth="2">
      <rect x="53.5" y="72" width="6.5" height="8" rx="1.5" />
      <rect x="60" y="72" width="6.5" height="8" rx="1.5" />
    </g>
  )
}

/** Drawn on top of the nose/mouth area: snouts, beaks, whiskers, beards, teeth. */
function DecorOver({ animal, c, mood }: { animal: Animal; c: Palette; mood: Mood }) {
  switch (animal) {
    case 'pig':
      return (
        <g>
          <ellipse cx="60" cy="62" rx="13" ry="8.5" fill="#ee8fab" stroke={INK} strokeWidth="2.5" />
          <circle cx="55.5" cy="62" r="2" fill={INK} />
          <circle cx="64.5" cy="62" r="2" fill={INK} />
        </g>
      )
    case 'chicken': {
      // The smile lives inside the beak.
      const beakSmile =
        mood === 'sad'
          ? 'M 54 68 Q 60 63 66 68'
          : mood === 'neutral'
            ? 'M 54 64 Q 60 69 66 64'
            : 'M 52 63 Q 60 71 68 63'
      return (
        <g>
          <path d="M 60 54 L 71 63 L 60 72 L 49 63 z" fill="#f97316" stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />
          <path d={beakSmile} fill="none" stroke={INK} strokeWidth="2.5" strokeLinecap="round" />
        </g>
      )
    }
    case 'bunny':
    case 'mouse':
      return <Teeth />
    case 'cat':
      return (
        <g stroke={INK} strokeWidth="2.5" strokeLinecap="round">
          <path d="M 14 60 L 32 62" />
          <path d="M 15 71 L 32 68" />
          <path d="M 106 60 L 88 62" />
          <path d="M 105 71 L 88 68" />
        </g>
      )
    case 'goat':
      return <path d="M 53 100 L 60 111 L 67 100 z" fill={c.body} stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />
    default:
      return null
  }
}

const NO_NOSE: Animal[] = ['pig', 'chicken', 'axolotl', 'frog']
const NO_MUZZLE: Animal[] = ['frog', 'chicken']
const NO_MOUTH: Animal[] = ['chicken'] // the chicken's smile is drawn inside its beak

function Face({ animal, c }: { animal: Animal; c: Palette }) {
  if (animal === 'capybara') return <rect x="14" y="20" width="92" height="80" rx="34" fill={c.body} />
  if (animal === 'frog') return <ellipse cx="60" cy="64" rx="49" ry="40" fill={c.body} />
  return <circle cx="60" cy="60" r="46" fill={c.body} />
}

export function Mascot({ animal, mood, size = 110 }: { animal: Animal; mood: Mood; size?: number }) {
  const c = COLORS[animal]
  const faceClass = mood === 'cheer' ? 'mascot bounce' : mood === 'happy' ? 'mascot wiggle' : 'mascot'
  return (
    <svg className={faceClass} width={size} height={size} viewBox="0 -14 120 124" aria-hidden="true">
      <DecorBack animal={animal} c={c} />
      <Face animal={animal} c={c} />
      <DecorUnder animal={animal} c={c} />
      {!NO_MUZZLE.includes(animal) && <ellipse cx="60" cy="74" rx="24" ry="18" fill={c.inner} />}
      {/* The frog's eyes sit up inside its head bumps */}
      <g transform={animal === 'frog' ? 'translate(0 -26)' : undefined}>
        <Eyes mood={mood} />
      </g>
      {!NO_NOSE.includes(animal) && <ellipse cx="60" cy="63" rx="5.5" ry="4" fill={INK} />}
      {!NO_MOUTH.includes(animal) && <Mouth mood={mood} wide={animal === 'frog'} />}
      <DecorOver animal={animal} c={c} mood={mood} />
      <circle cx="28" cy="66" r="7" fill={c.cheek} opacity="0.7" />
      <circle cx="92" cy="66" r="7" fill={c.cheek} opacity="0.7" />
    </svg>
  )
}
