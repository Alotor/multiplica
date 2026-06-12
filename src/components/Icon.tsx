// Thematic icons drawn in the same style as the mascots:
// thick dark outlines (#3b2f2f), warm rounded fills.

export type IconName =
  | 'trophy'
  | 'flame'
  | 'play'
  | 'star'
  | 'timer'
  | 'sound-on'
  | 'sound-off'
  | 'chart'
  | 'check'
  | 'bolt'
  | 'replay'
  | 'home'
  | 'target'
  | 'paw'
  | 'gamepad'
  | 'sparkle'
  | 'trash'
  | 'backspace'

const INK = '#3b2f2f'

const outline = { stroke: INK, strokeWidth: 1.6, strokeLinejoin: 'round' as const }

function paths(name: IconName, color?: string) {
  switch (name) {
    case 'trophy':
      return (
        <g {...outline}>
          <path d="M 7 6.5 H 3.2 c 0 3.2 1.6 5 3.8 5.4" fill="none" strokeLinecap="round" />
          <path d="M 17 6.5 h 3.8 c 0 3.2 -1.6 5 -3.8 5.4" fill="none" strokeLinecap="round" />
          <path d="M 7 4 h 10 v 5.5 a 5 5 0 0 1 -10 0 z" fill="#fbbf24" />
          <rect x="10.8" y="13.8" width="2.4" height="3" fill="#f59e0b" />
          <rect x="7.5" y="16.8" width="9" height="3" rx="1.2" fill="#f59e0b" />
        </g>
      )
    case 'flame':
      return (
        <g {...outline}>
          <path
            d="M 12 2.5 C 12.5 5.5 10 7 8 9.5 C 6.5 11.5 6 13 6 14.5 a 6 6 0 0 0 12 0 c 0 -2.5 -1.2 -4.5 -2.5 -6.5 c -0.4 1.2 -1.2 2 -2 2.4 c 0 -2.5 -0.5 -5.5 -1.5 -7.9 z"
            fill="#fb923c"
          />
          <path d="M 12 12.5 c 1.8 1.6 2.5 2.8 2.5 4.2 a 2.5 2.5 0 0 1 -5 0 c 0 -1.4 0.7 -2.6 2.5 -4.2 z" fill="#fde047" />
        </g>
      )
    case 'play':
      return <path d="M 7.5 4.5 L 19.5 12 L 7.5 19.5 z" fill={color ?? '#fff'} {...outline} stroke={color ?? '#fff'} strokeWidth={2.5} />
    case 'star':
      return (
        <path
          d="M 12 2.5 L 14.7 8.3 L 21 9.2 L 16.4 13.5 L 17.5 19.8 L 12 16.7 L 6.5 19.8 L 7.6 13.5 L 3 9.2 L 9.3 8.3 z"
          fill="#fde047"
          {...outline}
        />
      )
    case 'timer':
      return (
        <g {...outline}>
          <rect x="10.4" y="1.8" width="3.2" height="2.6" rx="1" fill="#fb923c" />
          <circle cx="12" cy="13.2" r="7.5" fill="#fff" />
          <path d="M 12 13.2 L 12 8.7" fill="none" strokeWidth="2" strokeLinecap="round" />
          <path d="M 12 13.2 L 15 14.8" fill="none" strokeWidth="2" strokeLinecap="round" />
        </g>
      )
    case 'sound-on':
      return (
        <g {...outline}>
          <path d="M 3.5 9.5 v 5 h 3.2 l 4.3 4 V 5.5 l -4.3 4 z" fill="#f5b971" />
          <path d="M 14.5 9.3 a 4 4 0 0 1 0 5.4" fill="none" strokeWidth="2" strokeLinecap="round" />
          <path d="M 17.3 7 a 7.5 7.5 0 0 1 0 10" fill="none" strokeWidth="2" strokeLinecap="round" />
        </g>
      )
    case 'sound-off':
      return (
        <g {...outline}>
          <path d="M 3.5 9.5 v 5 h 3.2 l 4.3 4 V 5.5 l -4.3 4 z" fill="#d6c9c2" />
          <path d="M 14.5 9.5 l 5.5 5.5 M 20 9.5 l -5.5 5.5" fill="none" stroke="#e11d48" strokeWidth="2.4" strokeLinecap="round" />
        </g>
      )
    case 'chart':
      return (
        <g {...outline}>
          <rect x="3.5" y="12.5" width="4.6" height="8" rx="1.2" fill="#60a5fa" />
          <rect x="9.7" y="8" width="4.6" height="12.5" rx="1.2" fill="#4ade80" />
          <rect x="15.9" y="3.5" width="4.6" height="17" rx="1.2" fill="#fb923c" />
        </g>
      )
    case 'check':
      return (
        <path
          d="M 4.5 12.5 L 10 18 L 19.5 6.5"
          fill="none"
          stroke={color ?? '#4ade80'}
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )
    case 'bolt':
      return <path d="M 13.5 2 L 5.5 13.5 H 11 L 9.5 22 L 18.5 9.5 H 12.5 z" fill="#fde047" {...outline} />
    case 'replay':
      return (
        <g>
          <path
            d="M 18.8 8 a 7.5 7.5 0 1 0 1 5.5"
            fill="none"
            stroke={color ?? INK}
            strokeWidth="2.8"
            strokeLinecap="round"
          />
          <path d="M 20.5 2.5 L 20 9 L 14 7 z" fill={color ?? INK} />
        </g>
      )
    case 'home':
      return (
        <g {...outline}>
          <path d="M 3.5 11.5 L 12 4 L 20.5 11.5 V 19 a 1.5 1.5 0 0 1 -1.5 1.5 H 5 A 1.5 1.5 0 0 1 3.5 19 z" fill="#f5b971" />
          <rect x="9.8" y="13" width="4.4" height="7.5" rx="1" fill="#7a4242" />
        </g>
      )
    case 'target':
      return (
        <g {...outline}>
          <circle cx="12" cy="12" r="8.5" fill="#fff" />
          <circle cx="12" cy="12" r="5.3" fill="#fb7185" />
          <circle cx="12" cy="12" r="2" fill="#fff" />
        </g>
      )
    case 'paw':
      return (
        <g {...outline}>
          <ellipse cx="5.5" cy="10.5" rx="2.2" ry="2.6" fill="#f5b971" />
          <ellipse cx="9.8" cy="6.5" rx="2.3" ry="2.7" fill="#f5b971" />
          <ellipse cx="15.2" cy="6.5" rx="2.3" ry="2.7" fill="#f5b971" />
          <ellipse cx="19.5" cy="10.5" rx="2.2" ry="2.6" fill="#f5b971" />
          <path d="M 12.5 11 c 3.5 0 6 2.3 6 5 a 4.5 4.5 0 0 1 -4.5 4.5 h -3 A 4.5 4.5 0 0 1 6.5 16 c 0 -2.7 2.5 -5 6 -5 z" fill="#f5b971" />
        </g>
      )
    case 'gamepad':
      return (
        <g {...outline}>
          <rect x="2.5" y="7.5" width="19" height="10" rx="5" fill="#93c5fd" />
          <path d="M 7.5 10.5 v 4 M 5.5 12.5 h 4" fill="none" strokeWidth="2" strokeLinecap="round" />
          <circle cx="15.5" cy="11" r="1.5" fill="#fb7185" stroke="none" />
          <circle cx="18" cy="13.8" r="1.5" fill="#4ade80" stroke="none" />
        </g>
      )
    case 'sparkle':
      return (
        <g {...outline}>
          <path d="M 11 3 L 12.7 9.3 L 19 11 L 12.7 12.7 L 11 19 L 9.3 12.7 L 3 11 L 9.3 9.3 z" fill="#fde047" />
          <path d="M 18.5 15.5 L 19.4 18.6 L 22.5 19.5 L 19.4 20.4 L 18.5 23.5 L 17.6 20.4 L 14.5 19.5 L 17.6 18.6 z" fill="#fbbf24" stroke="none" />
        </g>
      )
    case 'trash':
      return (
        <g {...outline}>
          <rect x="9.8" y="2.5" width="4.4" height="2.5" rx="1" fill="#fda4af" />
          <rect x="4.5" y="5" width="15" height="2.8" rx="1.2" fill="#fb7185" />
          <path d="M 6.5 7.8 h 11 l -0.9 10.7 a 2 2 0 0 1 -2 1.8 h -5.2 a 2 2 0 0 1 -2 -1.8 z" fill="#fb7185" />
          <path d="M 10 11 v 5.5 M 14 11 v 5.5" fill="none" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" />
        </g>
      )
    case 'backspace':
      return (
        <g {...outline}>
          <path d="M 9 5 h 11 a 1.8 1.8 0 0 1 1.8 1.8 v 10.4 a 1.8 1.8 0 0 1 -1.8 1.8 H 9 L 2.2 12 z" fill="#fff" />
          <path d="M 10.8 9.2 L 16.4 14.8 M 16.4 9.2 L 10.8 14.8" fill="none" strokeWidth="2.2" strokeLinecap="round" />
        </g>
      )
  }
}

export function Icon({ name, size = '1.2em', color }: { name: IconName; size?: number | string; color?: string }) {
  return (
    <svg className="icon" width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      {paths(name, color)}
    </svg>
  )
}
