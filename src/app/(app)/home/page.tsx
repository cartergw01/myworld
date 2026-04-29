'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { useStore } from '@/lib/store'
import { formatWeekShort, getCategoryColor, getCategoryDim } from '@/lib/utils'
import { CategoryGlyph } from '@/components/capsule/CategoryGlyph'
import type { Pick as PickType, Capsule, User } from '@/types'

function trustLabel(author: User) {
  const strength = author.relationshipStrength ?? 0.5
  if (author.id === 'user_carter') return 'you'
  if (strength >= 0.9) return 'close friend'
  if (strength >= 0.7) return 'trusted source'
  return 'following'
}

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
        const x2 = Number((187 + Math.cos(rad) * 300).toFixed(3))
        const y2 = Number((210 + Math.sin(rad) * 300).toFixed(3))
        return (
          <line key={a}
            x1={187} y1={210}
            x2={x2} y2={y2}
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

// ─── Single pick — full-screen snap section ──────────
function PickSection({ pick, author, capsule, index, total }: { pick: PickType; author: User; capsule: Capsule; index: number; total: number }) {
  const color = getCategoryColor(pick.category)
  const dim   = getCategoryDim(pick.category)
  const progressPercent = `${((index + 1) / total) * 100}%`

  return (
    <motion.section
      className="orbit-feed-section"
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, margin: '-12%' }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      style={{
        minHeight: 'calc(100svh - 80px)',
        scrollSnapAlign: 'start',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '0 24px',
        position: 'relative',
        zIndex: 1,
        maxWidth: 600,
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

      <div className="orbit-feed-body" style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 18, marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color }}>
            <CategoryGlyph category={pick.category} size={13} />
            <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 9, letterSpacing: '0.16em', textTransform: 'uppercase' }}>
              {pick.category}
            </span>
          </div>
          <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 8, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(240,235,225,0.26)' }}>
            {index + 1} / {total}
          </span>
        </div>

        <Link
          className="orbit-author-link"
          href={author.id === 'user_carter' ? '/profile' : `/profile?person=${author.id}`}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 11,
            textDecoration: 'none',
            marginBottom: 18,
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={author.avatar}
            alt={author.name}
            style={{
              width: 30,
              height: 30,
              borderRadius: '50%',
              opacity: 0.9,
              border: '1px solid rgba(255,255,255,0.08)',
            }}
          />
          <div style={{ minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, flexWrap: 'wrap' }}>
              <span style={{ fontFamily: "'Instrument Serif',serif", fontSize: 20, color: 'rgba(240,235,225,0.78)', lineHeight: 1 }}>
                {author.name}
              </span>
              <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 8, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(240,235,225,0.32)' }}>
                {trustLabel(author)}
              </span>
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 5, overflow: 'hidden' }}>
              {(author.orbit ?? []).slice(0, 3).map(tag => (
                <span key={tag} style={{ fontFamily: "'Space Mono',monospace", fontSize: 8, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(200,168,130,0.58)' }}>
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </Link>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr auto',
          gap: 14,
          alignItems: 'end',
          marginBottom: pick.source ? 12 : 0,
        }}>
          <div style={{ minWidth: 0 }}>
            <h2 className="orbit-feed-title" style={{
              fontFamily: "'Instrument Serif',serif",
              fontSize: pick.title.length > 32 ? 34 : 42,
              lineHeight: 1.05,
              color: '#F0EBE1',
              letterSpacing: '-0.01em',
            }}>
              {pick.title}
            </h2>
            {pick.source && (
              <p style={{ fontFamily: "'Instrument Serif',serif", fontSize: 14, fontStyle: 'italic', color: 'rgba(240,235,225,0.42)', marginTop: 10 }}>
                {pick.source}
              </p>
            )}
          </div>
          {pick.url && (
            <a href={pick.url} target="_blank" rel="noopener noreferrer"
              onClick={e => e.stopPropagation()}
              style={{
                fontFamily: "'Space Mono',monospace",
                fontSize: 9,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: 'rgba(200,168,130,0.58)',
                textDecoration: 'none',
                borderBottom: '1px solid rgba(200,168,130,0.28)',
                paddingBottom: 3,
              }}>
              open
            </a>
          )}
        </div>

        <div className="orbit-context-grid" style={{
          margin: '19px 0 18px',
          paddingTop: 18,
          borderTop: '1px solid rgba(255,255,255,0.07)',
        }}>
          {pick.note && (
            <div>
              <p className="orbit-feed-note" style={{
                fontFamily: "'Instrument Serif',serif",
                fontSize: 17,
                fontStyle: 'italic',
                lineHeight: 1.62,
                color: 'rgba(240,235,225,0.58)',
                display: '-webkit-box',
                WebkitLineClamp: 5,
                WebkitBoxOrient: 'vertical' as const,
                overflow: 'hidden',
              }}>
                &ldquo;{pick.note}&rdquo;
              </p>
            </div>
          )}
        </div>

        <div className="orbit-week-mark" style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 8, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.18)' }}>
            {formatWeekShort(capsule.weekStartDate)}
          </span>
        </div>
      </div>

      <div className="orbit-progress" aria-label={`Item ${index + 1} of ${total}`}>
        <div className="orbit-progress-track">
          <div style={{ width: progressPercent }} />
        </div>
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
          No one has shared yet.<br />Start with yours.
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
          ✦&nbsp;&nbsp;share something
        </div>
      </Link>
    </section>
  )
}

// ─── Past row ────────────────────────────────────────
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
  const { currentUser, users, capsules, getUserById } = useStore()

  const feedCapsules = capsules
    .filter(c => c.status === 'published')
    .sort((a, b) => {
      const recency = (Date.parse(b.publishedAt ?? b.weekStartDate) - Date.parse(a.publishedAt ?? a.weekStartDate))
      if (recency !== 0) return recency
      const aTrust = getUserById(a.userId)?.relationshipStrength ?? 0
      const bTrust = getUserById(b.userId)?.relationshipStrength ?? 0
      return bTrust - aTrust
    })

  const pastCapsules = capsules
    .filter(c => c.status === 'published')
    .sort((a, b) => b.weekStartDate.localeCompare(a.weekStartDate))
    .slice(0, 6)

  const feedItems = feedCapsules.flatMap(capsule => {
    const author = getUserById(capsule.userId) ?? users[0]
    return [...capsule.picks]
      .sort((a, b) => a.order - b.order)
      .map(pick => ({ pick, capsule, author }))
  })

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
      <div style={{ padding: '56px 24px 16px', position: 'relative', zIndex: 1, maxWidth: 600, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 9, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.22)' }}>
            New from people you follow
          </span>
          <Link href="/profile">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={currentUser.avatar} alt={currentUser.name}
              style={{ width: 26, height: 26, borderRadius: '50%', opacity: 0.8 }} />
          </Link>
        </div>
      </div>

      {/* Trusted feed or empty state */}
      {feedItems.length > 0
        ? feedItems.map(({ pick, capsule, author }, i) => (
            <PickSection key={pick.id} pick={pick} capsule={capsule} author={author} index={i} total={feedItems.length} />
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
          maxWidth: 600, margin: '0 auto',
          width: '100%',
        }}>
          <div style={{ marginBottom: 22 }}>
            <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 9, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.18)' }}>
              recent shares
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
