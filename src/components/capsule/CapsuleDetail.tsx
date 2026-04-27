'use client'

import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import type { Capsule } from '@/types'
import { PickCard } from './PickCard'
import { formatWeekLabel, formatWeekShort, getCategoryColor } from '@/lib/utils'

interface CapsuleDetailProps {
  capsule: Capsule
}

function PolarGrid() {
  const rings = [55, 105, 160, 220]
  const radials = Array.from({ length: 12 }, (_, i) => i * 30)
  return (
    <svg
      style={{
        position: 'fixed', inset: 0, width: '100%', height: '100%',
        zIndex: 0, pointerEvents: 'none', opacity: 0.28,
        animation: 'orbitGridSpin 120s linear infinite',
        transformOrigin: '50% 30%',
      }}
      viewBox="0 0 375 700" preserveAspectRatio="xMidYMid slice"
    >
      {rings.map(r => (
        <circle key={r} cx={187} cy={210} r={r}
          fill="none" stroke="rgba(60,100,220,0.3)" strokeWidth="0.6"
          strokeDasharray={r > 130 ? '3 8' : '2 6'} />
      ))}
      {radials.map(a => {
        const rad = a * Math.PI / 180
        return (
          <line key={a} x1={187} y1={210}
            x2={187 + Math.cos(rad) * 250} y2={210 + Math.sin(rad) * 250}
            stroke="rgba(60,100,220,0.1)" strokeWidth="0.5" />
        )
      })}
    </svg>
  )
}

function StarField() {
  const stars = Array.from({ length: 40 }, (_, i) => ({
    cx: ((i * 137.508 + 23) % 369) + 3,
    cy: ((i * 97.301 + 41) % 700) + 4,
    r:  (i % 5) * 0.18 + 0.1,
    o:  (i % 8) * 0.022 + 0.05,
  }))
  return (
    <svg style={{ position: 'fixed', inset: 0, width: '100%', height: '100%', zIndex: 0, pointerEvents: 'none' }}
      viewBox="0 0 375 700" preserveAspectRatio="xMidYMid slice">
      {stars.map((s, i) => (
        <circle key={i} cx={s.cx} cy={s.cy} r={s.r} fill={`rgba(200,210,255,${s.o})`} />
      ))}
    </svg>
  )
}

export function CapsuleDetail({ capsule }: CapsuleDetailProps) {
  const router = useRouter()
  const sorted = [...capsule.picks].sort((a, b) => a.order - b.order)

  return (
    <div style={{
      minHeight: '100svh',
      background: 'linear-gradient(160deg,#0b0820 0%,#06091a 50%,#03060e 100%)',
      position: 'relative',
    }}>
      <StarField />
      <PolarGrid />

      {/* Sticky header */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 10,
        padding: '14px 24px 12px',
        background: 'rgba(4,6,16,0.88)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
      }}>
        <div style={{ maxWidth: 512, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 14 }}>
          <button
            onClick={() => router.back()}
            style={{
              width: 28, height: 28, display: 'flex', alignItems: 'center',
              justifyContent: 'center', background: 'none', border: 'none',
              cursor: 'pointer', color: 'rgba(255,255,255,0.35)', padding: 0,
              flexShrink: 0,
            }}
          >
            <svg viewBox="0 0 14 14" width={14} height={14} fill="none">
              <path d="M9 2L4 7l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>

          <div style={{ flex: 1 }}>
            <div style={{
              fontFamily: "'Space Mono',monospace",
              fontSize: 9, letterSpacing: '0.16em', textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.22)',
            }}>
              {formatWeekLabel(capsule.weekStartDate)}
            </div>
          </div>

          {/* Category dots */}
          <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
            {sorted.map(p => (
              <div key={p.id} style={{
                width: 5, height: 5, borderRadius: '50%',
                background: getCategoryColor(p.category), opacity: 0.6,
              }} />
            ))}
          </div>
        </div>
      </div>

      {/* Week hero */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        style={{ padding: '36px 24px 28px', maxWidth: 512, margin: '0 auto', position: 'relative', zIndex: 1 }}
      >
        <div style={{
          fontFamily: "'Instrument Serif',serif",
          fontSize: 38, lineHeight: 1.05,
          color: '#F0EBE1', letterSpacing: '-0.01em',
          marginBottom: 10,
        }}>
          {formatWeekShort(capsule.weekStartDate)}
        </div>
        <div style={{
          fontFamily: "'Space Mono',monospace",
          fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.2)',
        }}>
          {sorted.length} picks
          {capsule.publishedAt && (
            <span style={{ marginLeft: 12 }}>
              · published {new Date(capsule.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </span>
          )}
        </div>
      </motion.div>

      {/* Divider */}
      <div style={{
        height: 1, background: 'rgba(255,255,255,0.06)',
        maxWidth: 512, margin: '0 auto 8px',
        position: 'relative', zIndex: 1,
      }} />

      {/* Picks */}
      <div style={{
        padding: '8px 24px 120px',
        maxWidth: 512, margin: '0 auto',
        position: 'relative', zIndex: 1,
        display: 'flex', flexDirection: 'column', gap: 0,
      }}>
        {sorted.map((pick, i) => (
          <PickCard key={pick.id} pick={pick} index={i} />
        ))}
      </div>
    </div>
  )
}
