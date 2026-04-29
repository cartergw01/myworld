interface CosmicBackdropProps {
  density?: 'calm' | 'dense'
}

export function CosmicBackdrop({ density = 'calm' }: CosmicBackdropProps) {
  const starCount = density === 'dense' ? 56 : 38
  const rings = density === 'dense' ? [55, 105, 160, 220, 290] : [65, 125, 190, 265]
  const stars = Array.from({ length: starCount }, (_, i) => ({
    cx: ((i * 137.508 + 23) % 369) + 3,
    cy: ((i * 97.301 + 41) % 820) + 4,
    r: (i % 5) * 0.18 + 0.1,
    o: (i % 8) * 0.024 + 0.05,
  }))
  const radials = Array.from({ length: 12 }, (_, i) => i * 30)

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 375 820" preserveAspectRatio="xMidYMid slice">
        {stars.map((s, i) => (
          <circle key={i} cx={s.cx} cy={s.cy} r={s.r} fill={`rgba(200,210,255,${s.o})`} />
        ))}
      </svg>
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 375 720"
        preserveAspectRatio="xMidYMid slice"
        style={{
          animation: 'orbitGridSpin 120s linear infinite',
          opacity: density === 'dense' ? 0.34 : 0.22,
          transformOrigin: '50% 30%',
        }}
      >
        {rings.map(r => (
          <circle
            key={r}
            cx={187}
            cy={210}
            r={r}
            fill="none"
            stroke="rgba(60,100,220,0.26)"
            strokeDasharray={r > 150 ? '3 8' : '2 6'}
            strokeWidth="0.6"
          />
        ))}
        {radials.map(angle => {
          const rad = angle * Math.PI / 180
          return (
            <line
              key={angle}
              x1={187}
              y1={210}
              x2={187 + Math.cos(rad) * 300}
              y2={210 + Math.sin(rad) * 300}
              stroke="rgba(60,100,220,0.1)"
              strokeWidth="0.5"
            />
          )
        })}
      </svg>
    </div>
  )
}
