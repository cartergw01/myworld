'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { useStore } from '@/lib/store'
import { getWeekStartDate, formatWeekShort, getCategoryColor, getCategoryDim } from '@/lib/utils'
import type { Pick as PickType, Capsule } from '@/types'

// ─── Polar HUD Grid ─────────────────────────────────
function PolarGrid() {
  const rings = [55, 105, 160, 220, 290]
  const radials = Array.from({ length: 12 }, (_, i) => i * 30)
  return (
    <svg
      className="absolute inset-0 w-full h-full"
      viewBox="0 0 375 700"
      preserveAspectRatio="xMidYMid slice"
      style={{ animation: 'orbitGridSpin 120s linear infinite', transformOrigin: '50% 30%', opacity: 0.38 }}
    >
      {rings.map(r => (
        <circle key={r} cx={187} cy={210} r={r}
          fill="none" stroke="rgba(60,100,220,0.28)" strokeWidth="0.6"
          strokeDasharray={r > 160 ? '3 8' : '2 6'} />
      ))}
      {radials.map(a => {
        const rad = a * Math.PI / 180
        return (
          <line key={a}
            x1={187} y1={210}
            x2={187 + Math.cos(rad) * 300} y2={210 + Math.sin(rad) * 300}
            stroke="rgba(60,100,220,0.12)" strokeWidth="0.5" />
        )
      })}
      <line x1={187} y1={190} x2={187} y2={230} stroke="rgba(60,100,220,0.22)" strokeWidth="0.5" />
      <line x1={167} y1={210} x2={207} y2={210} stroke="rgba(60,100,220,0.22)" strokeWidth="0.5" />
      <circle cx={187} cy={210} r={4} fill="none" stroke="rgba(60,100,220,0.3)" strokeWidth="0.7" />
    </svg>
  )
}

// ─── Star field ──────────────────────────────────────
function StarField() {
  const stars = Array.from({ length: 55 }, (_, i) => ({
    cx: ((i * 137.508 + 23) % 369) + 3,
    cy: ((i * 97.301 + 41) % 800) + 4,
    r:  (i % 5) * 0.18 + 0.12,
    o:  (i % 8) * 0.025 + 0.06,
  }))
  return (
    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 375 800" preserveAspectRatio="xMidYMid slice">
      {stars.map((s, i) => (
        <circle key={i} cx={s.cx} cy={s.cy} r={s.r} fill={`rgba(200,210,255,${s.o})`} />
      ))}
    </svg>
  )
}

// ─── Category SVG icons ──────────────────────────────
function CategoryIcon({ category, size = 13 }: { category: string; size?: number }) {
  const s = { width: size, height: size }
  if (category === 'Read') return (
    <svg viewBox="0 0 14 14" {...s} fill="none">
      <path d="M2 3a1 1 0 011-1h4.5v10H3a1 1 0 01-1-1V3z" stroke="currentColor" strokeWidth="1.3"/>
      <path d="M7.5 2H11a1 1 0 011 1v8a1 1 0 01-1 1H7.5V2z" stroke="currentColor" strokeWidth="1.3"/>
      <path d="M4.5 6h2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
    </svg>
  )
  if (category === 'Watch') return (
    <svg viewBox="0 0 14 14" {...s} fill="none">
      <circle cx="7" cy="7" r="5.3" stroke="currentColor" strokeWidth="1.3"/>
      <path d="M5.5 5.2l4 1.8-4 1.8V5.2z" fill="currentColor" opacity="0.75"/>
    </svg>
  )
  if (category === 'Listen') return (
    <svg viewBox="0 0 14 14" {...s} fill="none">
      <path d="M9.5 2.5v7" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
      <path d="M9.5 2.5L5.5 4v7" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="4" cy="11" r="1.5" stroke="currentColor" strokeWidth="1.3"/>
      <circle cx="8" cy="10" r="1.5" stroke="currentColor" strokeWidth="1.3"/>
    </svg>
  )
  if (category === 'Idea') return (
    <svg viewBox="0 0 14 14" {...s} fill="none">
      <path d="M3 3.5A.5.5 0 013.5 3h7a.5.5 0 01.5.5v5a.5.5 0 01-.5.5H7.5L5 11V9H3.5a.5.5 0 01-.5-.5v-5z"
        stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
    </svg>
  )
  return (
    <svg viewBox="0 0 14 14" {...s} fill="none">
      <path d="M7 2l1.2 3.5H12l-3 2.1 1.2 3.5L7 9.1 3.8 11.1 5 7.6 2 5.5h3.8z"
        stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/>
    </svg>
  )
}

// ─── Single pick — full-screen snap section ──────────
function PickSection({ pick, index, total }: { pick: PickType; index: number; total: number }) {
  const color = getCategoryColor(pick.category)
  const dim   = getCategoryDim(pick.category)

  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, margin: '-12%' }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      style={{
        height: 'calc(100svh - 80px)',
        scrollSnapAlign: 'start',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '0 24px',
        position: 'relative',
        zIndex: 1,
        maxWidth: 512,
        margin: '0 auto',
        width: '100%',
      }}
    >
      {/* Color bloom */}
      <div style={{
        position: 'absolute', top: '42%', left: '50%',
        transform: 'translate(-50%,-50%)',
        width: 300, height: 300, borderRadius: '50%',
        background: dim, filter: 'blur(64px)',
        pointerEvents: 'none', zIndex: 0,
      }} />

      <div style={{ position: 'relative', zIndex: 1 }}>
        {/* Category */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 22, color }}>
          <CategoryIcon category={pick.category} />
          <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 9, letterSpacing: '0.16em', textTransform: 'uppercase' }}>
            {pick.category}
          </span>
        </div>

        {/* Title */}
        <h2 style={{
          fontFamily: "'Instrument Serif',serif",
          fontSize: pick.title.length > 32 ? 30 : 38,
          lineHeight: 1.05,
          color: '#F0EBE1',
          letterSpacing: '-0.01em',
          marginBottom: pick.source ? 12 : 0,
        }}>
          {pick.title}
        </h2>

        {/* Source */}
        {pick.source && (
          <p style={{ fontFamily: "'Instrument Serif',serif", fontSize: 14, fontStyle: 'italic', color: 'rgba(240,235,225,0.42)' }}>
            {pick.source}
          </p>
        )}

        {/* Divider */}
        <div style={{ height: 1, background: 'rgba(255,255,255,0.07)', margin: '18px 0' }} />

        {/* Note */}
        {pick.note && (
          <p style={{
            fontFamily: "'Instrument Serif',serif",
            fontSize: 15, fontStyle: 'italic', lineHeight: 1.7,
            color: 'rgba(240,235,225,0.48)',
            marginBottom: 20,
            display: '-webkit-box',
            WebkitLineClamp: 5,
            WebkitBoxOrient: 'vertical' as const,
            overflow: 'hidden',
          }}>
            &ldquo;{pick.note}&rdquo;
          </p>
        )}

        {/* Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          {['✦  resonate', '◎  save'].map((label, i) => (
            <span key={i} style={{
              fontFamily: "'Space Mono',monospace", fontSize: 9,
              letterSpacing: '0.14em', textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.2)', cursor: 'default',
            }}>{label}</span>
          ))}
          {pick.url && (
            <>
              <div style={{ width: 1, height: 10, background: 'rgba(255,255,255,0.1)' }} />
              <a href={pick.url} target="_blank" rel="noopener noreferrer"
                onClick={e => e.stopPropagation()}
                style={{
                  fontFamily: "'Space Mono',monospace", fontSize: 9,
                  letterSpacing: '0.14em', textTransform: 'uppercase',
                  color: 'rgba(255,255,255,0.2)', textDecoration: 'none',
                }}>
                ↗  open
              </a>
            </>
          )}
        </div>
      </div>

      {/* Progress dots */}
      <div style={{
        position: 'absolute', bottom: 22, left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex', gap: 7, zIndex: 2,
      }}>
        {Array.from({ length: total }).map((_, i) => (
          <div key={i} style={{
            width: i === index ? 16 : 4, height: 4, borderRadius: 2,
            background: i === index ? 'rgba(240,235,225,0.6)' : 'rgba(255,255,255,0.15)',
            transition: 'width 0.3s ease',
          }} />
        ))}
      </div>
    </motion.section>
  )
}

// ─── Empty state ─────────────────────────────────────
function EmptyState() {
  return (
    <section style={{
      height: 'calc(100svh - 80px)',
      scrollSnapAlign: 'start',
      display: 'flex', flexDirection: 'column',
      justifyContent: 'center', alignItems: 'center',
      padding: '0 32px', position: 'relative', zIndex: 1, textAlign: 'center',
    }}>
      <Link href="/create" style={{ textDecoration: 'none' }}>
        <p style={{
          fontFamily: "'Instrument Serif',serif",
          fontSize: 30, fontStyle: 'italic',
          color: 'rgba(240,235,225,0.28)', lineHeight: 1.3, marginBottom: 28,
        }}>
          What has your mind<br />been orbiting?
        </p>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          padding: '10px 24px',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 4,
          fontFamily: "'Space Mono',monospace",
          fontSize: 9, letterSpacing: '0.16em', textTransform: 'uppercase',
          color: 'rgba(240,235,225,0.35)',
        }}>
          ✦&nbsp;&nbsp;start this week
        </div>
      </Link>
    </section>
  )
}

// ─── Past capsule row ────────────────────────────────
function PastCapsuleRow({ capsule, index }: { capsule: Capsule; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
    >
      <Link href={`/capsule/${capsule.id}`} style={{ textDecoration: 'none', display: 'block' }}>
        <div style={{
          padding: '12px 0 12px 14px',
          borderLeft: '2px solid rgba(255,255,255,0.07)',
          display: 'flex', alignItems: 'center', gap: 14,
          transition: 'border-color 0.2s',
        }}>
          <span style={{
            fontFamily: "'Space Mono',monospace", fontSize: 8,
            letterSpacing: '0.1em', textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.2)', flexShrink: 0, minWidth: 56,
          }}>
            {formatWeekShort(capsule.weekStartDate)}
          </span>
          <span style={{
            fontFamily: "'Instrument Serif',serif", fontSize: 14,
            color: 'rgba(240,235,225,0.48)', flex: 1,
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>
            {capsule.picks[0]?.title}
          </span>
          <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
            {capsule.picks.map(p => (
              <div key={p.id} style={{
                width: 5, height: 5, borderRadius: '50%',
                background: getCategoryColor(p.category), opacity: 0.55,
              }} />
            ))}
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

// ─── Page ────────────────────────────────────────────
export default function HomePage() {
  const { currentUser, capsules } = useStore()

  const thisWeek = getWeekStartDate()
  const thisWeekCapsule = capsules.find(
    c => c.weekStartDate === thisWeek && c.userId === currentUser.id
  )
  const pastCapsules = capsules
    .filter(c => c.weekStartDate !== thisWeek && c.status === 'published')
    .sort((a, b) => b.weekStartDate.localeCompare(a.weekStartDate))
    .slice(0, 6)

  const picks = thisWeekCapsule
    ? [...thisWeekCapsule.picks].sort((a, b) => a.order - b.order)
    : []

  return (
    <div style={{
      height: '100svh',
      overflowY: 'scroll',
      scrollSnapType: 'y mandatory',
      background: 'linear-gradient(160deg,#0b0820 0%,#06091a 50%,#03060e 100%)',
      position: 'relative',
    }}>
      {/* Fixed cosmic background */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', overflow: 'hidden' }}>
        <StarField />
        <PolarGrid />
      </div>

      {/* Top bar */}
      <div style={{ padding: '56px 24px 16px', position: 'relative', zIndex: 1, maxWidth: 512, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 9, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.22)' }}>
            orbit
          </span>
          <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 9, letterSpacing: '0.12em', color: 'rgba(255,255,255,0.18)' }}>
            {formatWeekShort(thisWeek)}
          </span>
          <Link href="/profile">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={currentUser.avatar} alt={currentUser.name}
              style={{ width: 26, height: 26, borderRadius: '50%', opacity: 0.8 }} />
          </Link>
        </div>
      </div>

      {/* Picks or empty state */}
      {picks.length > 0
        ? picks.map((pick, i) => (
            <PickSection key={pick.id} pick={pick} index={i} total={picks.length} />
          ))
        : <EmptyState />
      }

      {/* Past weeks */}
      {pastCapsules.length > 0 && (
        <section style={{
          scrollSnapAlign: 'start',
          minHeight: 'calc(100svh - 80px)',
          position: 'relative', zIndex: 1,
          padding: '36px 24px 120px',
          maxWidth: 512, margin: '0 auto',
          width: '100%',
        }}>
          <div style={{ marginBottom: 22 }}>
            <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 9, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.18)' }}>
              past weeks
            </span>
          </div>
          {pastCapsules.map((c, i) => (
            <PastCapsuleRow key={c.id} capsule={c} index={i} />
          ))}
        </section>
      )}
    </div>
  )
}
