'use client'

import { Suspense, useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { useSearchParams } from 'next/navigation'
import { useStore } from '@/lib/store'
import { formatWeekLabel, formatWeekShort, getCategoryColor, getWeekStartDate } from '@/lib/utils'
import { CategoryGlyph } from '@/components/capsule/CategoryGlyph'
import { CreateStepper } from '@/components/create/CreateStepper'
import type { Capsule, Category, Pick } from '@/types'

function CapsuleArchiveRow({ capsule, index }: { capsule: Capsule; index: number }) {
  return (
    <Link href={`/capsule/${capsule.id}`} style={{ textDecoration: 'none', display: 'block' }}>
      <div style={{
        padding: '13px 0 13px 16px',
        borderLeft: `2px solid rgba(255,255,255,${index === 0 ? '0.12' : '0.06'})`,
        display: 'flex', alignItems: 'center', gap: 14,
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

function SavedPickRow({ pick, capsule }: { pick: Pick; capsule: Capsule }) {
  const color = getCategoryColor(pick.category)
  return (
    <Link href={`/capsule/${capsule.id}`} style={{ textDecoration: 'none', display: 'block' }}>
      <div style={{
        padding: '14px 0 14px 16px',
        borderLeft: `2px solid ${color}45`,
        display: 'flex', alignItems: 'flex-start', gap: 14,
        marginBottom: 2,
      }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{
            fontFamily: "'Instrument Serif',serif",
            fontSize: 17, color: '#F0EBE1',
            marginBottom: 6, lineHeight: 1.15,
          }}>
            {pick.title}
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <CategoryGlyph category={pick.category} size={11} />
            <span style={{
              fontFamily: "'Space Mono',monospace", fontSize: 8,
              letterSpacing: '0.1em', textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.25)',
            }}>
              {pick.source || formatWeekShort(capsule.weekStartDate)}
            </span>
          </div>
        </div>
        <div style={{ color, opacity: 0.45, flexShrink: 0, paddingTop: 2 }}>
          <CategoryGlyph category={pick.category} size={14} />
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
      <div style={{ display: 'flex', gap: 2, height: 3, borderRadius: 3, overflow: 'hidden', marginBottom: 10 }}>
        {CATEGORIES.filter(cat => counts[cat]).map(cat => (
          <div key={cat} style={{
            flex: counts[cat],
            background: getCategoryColor(cat),
            opacity: 0.75,
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

function ProfileContent() {
  const { currentUser, capsules, savedItems, getUserById, isFollowing, follow, unfollow } = useStore()
  const searchParams = useSearchParams()

  const activeTab = searchParams.get('tab') === 'archive'
    ? 'archive'
    : searchParams.get('tab') === 'saved'
    ? 'saved'
    : 'overview'

  const personId = searchParams.get('person')
  const viewedUser = personId ? getUserById(personId) ?? currentUser : currentUser
  const isCurrentUser = viewedUser.id === currentUser.id
  const baseProfileHref = isCurrentUser ? '/profile' : `/profile?person=${viewedUser.id}`
  const archiveHref = isCurrentUser ? '/profile?tab=archive' : `/profile?person=${viewedUser.id}&tab=archive`
  const savedHref = '/profile?tab=saved'

  const following = isFollowing(viewedUser.id)

  const [showCreate, setShowCreate] = useState(false)
  const [createDraft, setCreateDraft] = useState<Capsule | undefined>()
  const openCreate = (draft?: Capsule) => { setCreateDraft(draft); setShowCreate(true) }

  const published = capsules.filter(c => c.status === 'published' && c.userId === viewedUser.id)
  const totalPicks = published.reduce((acc, c) => acc + c.picks.length, 0)

  const thisWeek = getWeekStartDate()
  const thisWeekCapsule = capsules.find(c => c.weekStartDate === thisWeek && c.userId === viewedUser.id && c.status === 'published')
  const thisWeekDraft = isCurrentUser
    ? capsules.find(c => c.weekStartDate === thisWeek && c.userId === currentUser.id && c.status === 'draft')
    : undefined

  const sorted = [...published].sort((a, b) => b.weekStartDate.localeCompare(a.weekStartDate))

  const profileSummary = sorted[0]
    ? `${published.length} weeks · ${totalPicks} items · latest ${formatWeekShort(sorted[0].weekStartDate)}`
    : 'Nothing shared yet'

  // Resolve saved pick objects
  const savedPicks = savedItems
    .map(s => {
      for (const c of capsules) {
        const p = c.picks.find(pick => pick.id === s.pickId)
        if (p) return { pick: p, capsule: c }
      }
      return null
    })
    .filter((x): x is { pick: Pick; capsule: Capsule } => x !== null)
    .reverse()

  return (
    <>
    <div style={{ minHeight: '100svh', position: 'relative', paddingBottom: 100 }}>
      <div style={{ position: 'relative', zIndex: 1, maxWidth: 512, margin: '0 auto', padding: '52px 24px 0' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 36 }}>
          {activeTab !== 'overview' ? (
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
          {activeTab === 'overview' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              {isCurrentUser && (
                <Link href={savedHref} style={{
                  fontFamily: "'Space Mono',monospace", fontSize: 9,
                  letterSpacing: '0.14em', textTransform: 'uppercase',
                  color: 'rgba(255,255,255,0.25)', textDecoration: 'none',
                  borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: 2,
                }}>
                  saved
                </Link>
              )}
              <Link href={archiveHref} style={{
                fontFamily: "'Space Mono',monospace", fontSize: 9,
                letterSpacing: '0.14em', textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.25)', textDecoration: 'none',
                borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: 2,
              }}>
                archive
              </Link>
            </div>
          )}
        </div>

        {activeTab === 'overview' && (
          <>
            {/* Avatar + identity */}
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
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '4px 12px', marginBottom: !isCurrentUser ? 20 : 0 }}>
                  {viewedUser.orbit?.map(tag => (
                    <span key={tag} style={{ fontFamily: "'Space Mono',monospace", fontSize: 8, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(200,168,130,0.55)' }}>
                      {tag}
                    </span>
                  ))}
                </div>

                {!isCurrentUser && (
                  <motion.button
                    type="button"
                    onClick={() => following ? unfollow(viewedUser.id) : follow(viewedUser.id)}
                    whileTap={{ scale: 0.96 }}
                    style={{
                      fontFamily: "'Space Mono',monospace",
                      fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase',
                      background: 'none', border: 'none', cursor: 'pointer',
                      padding: '10px 20px', borderRadius: 4,
                      transition: 'all 0.25s ease',
                      outline: `1px solid ${following ? 'rgba(200,168,130,0.3)' : 'rgba(255,255,255,0.12)'}`,
                      color: following ? 'rgba(200,168,130,0.8)' : 'rgba(255,255,255,0.35)',
                      minHeight: 44,
                    }}
                  >
                    <AnimatePresence mode="wait">
                      <motion.span
                        key={following ? 'following' : 'follow'}
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        transition={{ duration: 0.15 }}
                        style={{ display: 'block' }}
                      >
                        {following ? '✓ in your orbit' : '+ add to orbit'}
                      </motion.span>
                    </AnimatePresence>
                  </motion.button>
                )}
              </div>
            </div>

            <p style={{ fontFamily: "'Space Mono',monospace", fontSize: 8, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.2)', textAlign: 'center', marginBottom: 32 }}>
              {profileSummary}
            </p>

            <TypeDistributionBar capsules={published} />

            <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', marginBottom: 24 }} />

            <div style={{ marginBottom: 8 }}>
              <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 9, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.18)' }}>
                this week
              </span>
            </div>

            {thisWeekCapsule ? (
              <CapsuleArchiveRow capsule={thisWeekCapsule} index={0} />
            ) : thisWeekDraft ? (
              <button type="button" onClick={() => openCreate(thisWeekDraft)} style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer', padding: 0, textAlign: 'left' }}>
                <div style={{
                  padding: '12px 16px 12px 16px',
                  borderLeft: '2px dashed rgba(200,168,130,0.3)',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
                }}>
                  <div>
                    <p style={{ fontFamily: "'Instrument Serif',serif", fontSize: 18, color: '#F0EBE1', marginBottom: 4 }}>
                      {thisWeekDraft.picks[0]?.title || 'Draft in progress'}
                    </p>
                    <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 8, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(200,168,130,0.5)' }}>
                      {thisWeekDraft.picks.length} {thisWeekDraft.picks.length === 1 ? 'item' : 'items'} · draft
                    </span>
                  </div>
                  <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 8, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(200,168,130,0.4)', flexShrink: 0 }}>
                    continue →
                  </span>
                </div>
              </button>
            ) : isCurrentUser ? (
              <button type="button" onClick={() => openCreate()} style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer', padding: '12px 0 12px 16px', borderLeft: '2px solid rgba(200,168,130,0.25)', textAlign: 'left' }}>
                <p style={{ fontFamily: "'Instrument Serif',serif", fontSize: 22, color: '#F0EBE1', marginBottom: 6 }}>
                  Share this week
                </p>
                <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(200,168,130,0.55)' }}>
                  ✦ add something
                </span>
              </button>
            ) : (
              <div style={{ padding: '12px 0 12px 16px', borderLeft: '2px solid rgba(255,255,255,0.06)' }}>
                <p style={{ fontFamily: "'Instrument Serif',serif", fontSize: 18, fontStyle: 'italic', color: 'rgba(240,235,225,0.3)' }}>
                  Nothing shared yet this week.
                </p>
              </div>
            )}

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
        )}

        {activeTab === 'archive' && (
          <>
            <h2 style={{ fontFamily: "'Instrument Serif',serif", fontSize: 34, lineHeight: 1.05, letterSpacing: '-0.01em', color: '#F0EBE1', marginBottom: 6 }}>
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

        {activeTab === 'saved' && (
          <>
            <h2 style={{ fontFamily: "'Instrument Serif',serif", fontSize: 34, lineHeight: 1.05, letterSpacing: '-0.01em', color: '#F0EBE1', marginBottom: 6 }}>
              Saved
            </h2>
            <p style={{ fontFamily: "'Space Mono',monospace", fontSize: 8, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.2)', marginBottom: 28 }}>
              {savedPicks.length} {savedPicks.length === 1 ? 'item' : 'items'}
            </p>
            {savedPicks.length === 0 ? (
              <p style={{ fontFamily: "'Instrument Serif',serif", fontSize: 20, fontStyle: 'italic', color: 'rgba(240,235,225,0.28)', lineHeight: 1.4 }}>
                Nothing saved yet.<br />Tap ◎ on any pick to save it.
              </p>
            ) : (
              savedPicks.map(({ pick, capsule }) => (
                <SavedPickRow key={pick.id} pick={pick} capsule={capsule} />
              ))
            )}
          </>
        )}
      </div>
    </div>
    <AnimatePresence>
      {showCreate && (
        <motion.div
          key="create-overlay"
          initial={{ opacity: 0, x: '30%' }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: '30%' }}
          transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
          style={{
            position: 'fixed', inset: 0, zIndex: 100,
            backgroundColor: 'rgb(4,6,16)',
            overflowY: 'scroll',
          }}
        >
          <button
            type="button"
            onClick={() => setShowCreate(false)}
            style={{
              position: 'fixed', top: 52, right: 20, zIndex: 110,
              background: 'rgba(4,6,16,0.75)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              border: '1px solid rgba(255,255,255,0.09)',
              borderRadius: 999,
              padding: '9px 16px',
              fontFamily: "'Space Mono',monospace",
              fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase',
              color: 'rgba(240,235,225,0.45)',
              cursor: 'pointer',
              display: 'flex', alignItems: 'center',
              minHeight: 44,
            }}
          >
            ✕
          </button>
          <CreateStepper initialCapsule={createDraft} onDone={() => setShowCreate(false)} />
        </motion.div>
      )}
    </AnimatePresence>
    </>
  )
}

export default function ProfilePage() {
  return (
    <Suspense fallback={null}>
      <ProfileContent />
    </Suspense>
  )
}
