// Soft pastel circles drifting slowly behind every screen.

const CIRCLES = [
  { size: 150, top: '8%', left: '-6%', color: '#ffedd5', dur: 17, delay: 0 },
  { size: 90, top: '4%', left: '82%', color: '#fef3c7', dur: 14, delay: -4 },
  { size: 130, top: '74%', left: '78%', color: '#ffe4e6', dur: 19, delay: -9 },
  { size: 100, top: '70%', left: '-8%', color: '#dbeafe', dur: 16, delay: -6 },
  { size: 60, top: '42%', left: '88%', color: '#dcfce7', dur: 13, delay: -2 },
  { size: 45, top: '38%', left: '4%', color: '#fde9d4', dur: 15, delay: -11 },
]

export function Background() {
  return (
    <div className="bg-circles" aria-hidden="true">
      {CIRCLES.map((c, i) => (
        <span
          key={i}
          className="bg-circle"
          style={{
            width: c.size,
            height: c.size,
            top: c.top,
            left: c.left,
            background: c.color,
            animationDuration: `${c.dur}s`,
            animationDelay: `${c.delay}s`,
          }}
        />
      ))}
    </div>
  )
}
