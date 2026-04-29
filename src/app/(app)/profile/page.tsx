'use client'

import { Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useStore } from '@/lib/store'
import { formatWeekShort, getCategoryColor, getWeekStartDate } from '@/lib/utils'
import type { Capsule, Category } from '@/types'

function CapsuleArchiveRow({ capsule, index }: { capsule: Capsule; index: number }) {
  return (
    <Link href={`/capsule/${capsule.id}`} style={{ textDecoration: 'none', display: 'block' }}>
      <div style={{
        padding: '13px 0 13px 16px',
        borderLeft: `2px solid rgba(255,255,255,${index === 0 ? '0.12' : '0.06'})`,
        display: 'flex', alignItems: 'center', gap: 14,
        transition: 'border-color 0.2s',
      }}>
        <span style={{
          fontFamily: "'Space Mono',monospace", fontSize: 8,
          letterSpacing: '0.1em', textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.2)', flexShrink: 0, minWidth: 52,
        }}>
          {formatWeekShort(capsule.weekStartDate)}
        </span>
        <span style={{
          fontFamily: "'Instrument Serif',serif", fontSize: 15,
          color: 'rgba(240,235,225,0.55)', flex: 1,
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>
          {capsule.picks[0]?.title ?? formatWeekLabel(capsule.weekStartDate)}
        </span>
        <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
          {capsule.picks.map(p => (
            <div key={p.id} style={{
              width: 5, height: 5, borderRadius: '50%',
              background: getCategoryColor(p.category), opacity: 0.6,
            }} />
          ))}
        </div>
      </div>
    </Link>
  )
}

const CATEGORIES: Category[] = ['Read', 'Watch', 'Listen', 'Idea', 'Other']

function TypeDistributionBar({ capsules }: { capsules: Capsule[] }) {
  const counts: Record<string, number> = {}
  let total = 0
  for (const c of capsules) {
    for (const p of c.picks) {
      counts[p.category] = (counts[p.category] ?? 0) + 1
      total++
    }
  }
  if (total === 0) return null

  return (
    <div style={{ marginBottom: 28 }}>
      <div style={{ display: 'flex', gap: 2, height: 2, borderRadius: 2, overflow: 'hidden', marginBottom: 10 }}>
        {CATEGORIES.filter(cat => counts[cat]).map(cat => (
          <div key={cat} style={{
            flex: counts[cat],
            background: getCategoryColor(cat),
            opacity: 0.7,
          }} />
        ))}
      </div>
      <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
        {CATEGORIES.filter(cat => counts[cat]).map(cat => (
          <span key={cat} style={{
            fontFamily: "'Space Mono',monospace", fontSize: 8,
            letterSpacing: '0.12em', textTransform: 'uppercase',
            color: getCategoryColor(cat), opacity: 0.65,
          }}>
            {counts[cat]} {cat.toLowerCase()}
          </span>
        ))}
      </div>
    </div>
  )
}

function StarField() {
  const stars = Array.from({ length: 45 }, (_, i) => ({
    cx: ((i * 137.508 + 23) % 369) + 3,
    cy: ((i * 97.301 + 41) % 800) + 4,
    r:  (i % 5) * 0.18 + 0.1,
    o:  (i % 8) * 0.022 + 0.05,
  }))
  return (
    <svg style={{ position: 'fixed', inset: 0, width: '100%', height: '100%', zIndex: 0, pointerEvents: 'none' }}
      viewBox="0 0 375 800" preserveAspectRatio="xMidYMid slice">
      {stars.map((s, i) => (
        <circle key={i} cx={s.cx} cy={s.cy} r={s.r} fill={`rgba(200,210,255,${s.o})`} />
      ))}
    </svg>
  )
}

function PolarGrid() {
  const rings = [55, 105, 160, 220]
  const radials = Array.from({ length: 12 }, (_, i) => i * 30)
  return (
    <svg
      style={{
        position: 'fixed', inset: 0, width: '100%', height: '100%',
        zIndex: 0, pointerEvents: 'none', opacity: 0.25,
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

function ProfileContent() {
  const { currentUser, capsules, getUserById } = useStore()
  const searchParams = useSearchParams()
  const activeTab = searchParams.get('tab') === 'archive' ? 'archive' : 'overview'
  const personId = searchParams.get('person')
  const viewedUser = personId ? getUserById(personId) ?? currentUser : currentUser
  const isCurrentUser = viewedUser.id === currentUser.id
  const baseProfileHref = isCurrentUser ? '/profile' : `/profile?person=${viewedUser.id}`
  const archiveHref = isCurrentUser ? '/profile?tab=archive' : `/profile?person=${viewedUser.id}&tab=archive`

  const published = capsules.filter(c => c.status === 'published' && c.userId === viewedUser.id)
  const totalPicks = published.reduce((acc, c) => acc + c.picks.length, 0)

  const thisWeek = getWeekStartDate()
  const thisWeekCapsule = capsules.find(c => c.weekStartDate === thisWeek && c.userId === viewedUser.id)

  const sorted = [...published].sort((a, b) => b.weekStartDate.localeCompare(a.weekStartDate))

  const profileSummary = sorted[0]
    ? `${published.length} weeks · ${totalPicks} items · latest ${formatWeekShort(sorted[0].weekStartDate)}`
    : 'Nothing shared yet'

  return (
    <div style={{
      minHeight: '100svh',
      background: 'linear-gradient(160deg,#0b0820 0%,#06091a 50%,#03060e 100%)',
      position: 'relative',
      paddingBottom: 100,
    }}>
      <StarField />
      <PolarGrid />

      <div style={{ position: 'relative', zIndex: 1, maxWidth: 512, margin: '0 auto', padding: '52px 24px 0' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 36 }}>
          {activeTab === 'archive' ? (
            <Link href={baseProfileHref} style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8, color: 'rgba(255,255,255,0.35)' }}>
              <svg viewBox="0 0 14 14" width={14} height={14} fill="none">
                <path d="M9 2L4 7l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase' }}>back</span>
            </Link>
          ) : (
            <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 9, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.22)' }}>
              orbit
            </span>
          )}
          {activeTab !== 'archive' && (
            <Link href={archiveHref} style={{
              fontFamily: "'Space Mono',monospace", fontSize: 9,
              letterSpacing: '0.14em', textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.25)', textDecoration: 'none',
              borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: 2,
            }}>
              archive
            </Link>
          )}
        </div>

        {activeTab === 'overview' ? (
          <>
            {/* Avatar + name */}
            <div style={{ textAlign: 'center', marginBottom: 32, position: 'relative' }}>
              <div style={{
                position: 'absolute', top: '30%', left: '50%',
                transform: 'translate(-50%,-50%)',
                width: 260, height: 260, borderRadius: '50%',
                background: 'rgba(200,168,130,0.07)', filter: 'blur(60px)',
                pointerEvents: 'none',
              }} />
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'relative', display: 'inline-block', marginBottom: 20 }}>
                  <div style={{ position: 'absolute', inset: -18, borderRadius: '50%', border: '1px dashed rgba(200,168,130,0.16)' }} />
                  <div style={{ position: 'absolute', inset: -36, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.05)' }} />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={viewedUser.avatar} alt={viewedUser.name}
                    style={{ width: 80, height: 80, borderRadius: '50%', display: 'block',
                      border: '1px solid rgba(200,168,130,0.38)', boxShadow: '0 0 36px rgba(200,168,130,0.14)' }} />
                </div>
                <h2 style={{
                  fontFamily: "'Instrument Serif',serif",
                  fontSize: 38, lineHeight: 1, letterSpacing: '-0.02em',
                  color: '#F0EBE1', marginBottom: 6,
                }}>
                  {viewedUser.name}
                </h2>
                <p style={{ fontFamily: "'Space Mono',monospace", fontSize: 9, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)', marginBottom: 14 }}>
                  @{viewedUser.username}
                </p>
                {viewedUser.bio && (
                  <p style={{ fontFamily: "'Instrument Serif',serif", fontSize: 15, fontStyle: 'italic', lineHeight: 1.6, color: 'rgba(240,235,225,0.44)', marginBottom: 14, maxWidth: 260, margin: '0 auto 14px' }}>
                    {viewedUser.bio}
                  </p>
                )}
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '4px 12px' }}>
                  {viewedUser.orbit?.map(tag => (
                    <span key={tag} style={{ fontFamily: "'Space Mono',monospace", fontSize: 8, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(200,168,130,0.55)' }}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Stats */}
            <p style={{ fontFamily: "'Space Mono',monospace", fontSize: 8, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.2)', textAlign: 'center', marginBottom: 32 }}>
              {profileSummary}
            </p>

            {/* Type distribution */}
            <TypeDistributionBar capsules={published} />

            {/* Divider */}
            <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', marginBottom: 24 }} />

            {/* This week */}
            <div style={{ marginBottom: 8 }}>
              <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 9, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.18)' }}>
                this week
              </span>
            </div>

            {thisWeekCapsule ? (
              <CapsuleArchiveRow capsule={thisWeekCapsule} index={0} />
            ) : isCurrentUser ? (
              <Link href="/create" style={{ textDecoration: 'none', display: 'block', padding: '12px 0 12px 16px', borderLeft: '2px solid rgba(200,168,130,0.25)' }}>
                <p style={{ fontFamily: "'Instrument Serif',serif", fontSize: 22, color: '#F0EBE1', marginBottom: 6 }}>
                  Share this week
                </p>
                <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(200,168,130,0.55)' }}>
                  ✦ add something
                </span>
              </Link>
            ) : (
              <div style={{ padding: '12px 0 12px 16px', borderLeft: '2px solid rgba(255,255,255,0.06)' }}>
                <p style={{ fontFamily: "'Instrument Serif',serif", fontSize: 18, fontStyle: 'italic', color: 'rgba(240,235,225,0.3)' }}>
                  Nothing shared yet this week.
                </p>
              </div>
            )}

            {/* Recent past weeks */}
            {sorted.length > 0 && (
              <>
                <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', margin: '24px 0 16px' }} />
                <div style={{ marginBottom: 8 }}>
                  <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 9, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.18)' }}>
                    recent
                  </span>
                </div>
                {sorted.slice(0, 4).map((c, i) => (
                  <CapsuleArchiveRow key={c.id} capsule={c} index={i + 1} />
                ))}
                {sorted.length > 4 && (
                  <Link href={archiveHref} style={{
                    display: 'block', paddingLeft: 16, marginTop: 8,
                    fontFamily: "'Space Mono',monospace", fontSize: 9,
                    letterSpacing: '0.14em', textTransform: 'uppercase',
                    color: 'rgba(255,255,255,0.22)', textDecoration: 'none',
                  }}>
                    + {sorted.length - 4} more weeks
                  </Link>
                )}
              </>
            )}
          </>
        ) : (
          <>
            <h2 style={{
              fontFamily: "'Instrument Serif',serif",
              fontSize: 34, lineHeight: 1.05, letterSpacing: '-0.01em',
              color: '#F0EBE1', marginBottom: 6,
            }}>
              Archive
            </h2>
            <p style={{ fontFamily: "'Space Mono',monospace", fontSize: 8, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.2)', marginBottom: 28 }}>
              {totalPicks} items across {published.length} weeks
            </p>

            <TypeDistributionBar capsules={published} />

            {sorted.length === 0 ? (
              <p style={{ fontFamily: "'Instrument Serif',serif", fontSize: 20, fontStyle: 'italic', color: 'rgba(240,235,225,0.28)' }}>
                Nothing here yet.
              </p>
            ) : (
              sorted.map((c, i) => <CapsuleArchiveRow key={c.id} capsule={c} index={i} />)
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default function ProfilePage() {
  return (
    <Suspense fallback={null}>
      <ProfileContent />
    </Suspense>
  )
}
