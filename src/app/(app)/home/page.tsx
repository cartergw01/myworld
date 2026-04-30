'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '@/lib/store'
import { formatWeekShort, getCategoryColor, getWeekStartDate } from '@/lib/utils'
import { CategoryGlyph } from '@/components/capsule/CategoryGlyph'
import type { Category, Pick as PickType, Capsule, User } from '@/types'

// ─── Author bar inside capsule viewer (first pick) ───────────────────────────
function CapsuleAuthorBar({ capsule, author, color, currentUserId }: {
  capsule: Capsule; author: User; color: string; currentUserId: string
}) {
  return (
    <div style={{
      position: 'absolute', top: 20, left: 24, right: 24, zIndex: 2,
      display: 'flex', alignItems: 'center', gap: 11,
    }}>
      <Link
        href={author.id === currentUserId ? '/profile' : `/profile?person=${author.id}`}
        style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 11, flex: 1, minWidth: 0 }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={author.avatar} alt={author.name}
          style={{
            width: 34, height: 34, borderRadius: '50%', flexShrink: 0,
            border: `1.5px solid ${color}55`,
            boxShadow: `0 0 14px ${color}28`,
          }}
        />
        <div style={{ minWidth: 0 }}>
          <p style={{
            fontFamily: "'Instrument Serif',serif",
            fontSize: 17, color: '#F0EBE1', lineHeight: 1,
            marginBottom: 4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          }}>
            {author.name}
          </p>
          <p style={{
            fontFamily: "'Space Mono',monospace",
            fontSize: 8, letterSpacing: '0.1em', textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.48)',
          }}>
            {formatWeekShort(capsule.weekStartDate)}&nbsp;&nbsp;·&nbsp;&nbsp;{capsule.picks.length}&nbsp;pick{capsule.picks.length !== 1 ? 's' : ''}
          </p>
        </div>
      </Link>
    </div>
  )
}

// ─── Single pick inside CapsuleViewer ─────────────────────────────────────────
function PickSection({
  pick, author, capsule, index, total, isFirstInCapsule, onFocus,
}: {
  pick: PickType; author: User; capsule: Capsule
  index: number; total: number; isFirstInCapsule: boolean
  onFocus: (category: Category) => void
}) {
  const color = getCategoryColor(pick.category)
  const { isItemSaved, saveItem, unsaveItem, isResonated, resonate, unresonate, currentUser } = useStore()
  const resonated = isResonated(pick.id)
  const saved = isItemSaved(pick.id)
  const titleSize = pick.title.length < 18 ? 44 : pick.title.length < 34 ? 36 : 27

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, margin: '-20%' }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      onViewportEnter={() => onFocus(pick.category)}
      style={{
        height: '100svh',
        scrollSnapAlign: 'start',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: isFirstInCapsule ? '80px 24px 0' : '0 24px',
        position: 'relative',
        zIndex: 1,
        maxWidth: 512,
        margin: '0 auto',
        width: '100%',
      }}
    >
      {isFirstInCapsule && (
        <CapsuleAuthorBar
          capsule={capsule} author={author}
          color={color} currentUserId={currentUser.id}
        />
      )}

      {/* Depth bloom */}
      <div style={{
        position: 'absolute', top: '44%', left: '50%',
        transform: 'translate(-50%,-50%)',
        width: 440, height: 440, borderRadius: '50%',
        backgroundColor: color, opacity: 0.09,
        filter: 'blur(90px)',
        pointerEvents: 'none', zIndex: 0,
      }} />

      <div style={{ position: 'relative', zIndex: 1 }}>
        {/* Category badge */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 7,
          color, marginBottom: 20,
          padding: '5px 10px 5px 8px',
          border: `1px solid ${color}28`,
          borderRadius: 3,
          background: `${color}0a`,
        }}>
          <CategoryGlyph category={pick.category} size={13} />
          <span style={{
            fontFamily: "'Space Mono',monospace",
            fontSize: 8, letterSpacing: '0.2em', textTransform: 'uppercase',
          }}>
            {pick.category}
          </span>
        </div>

        {/* Title */}
        <h2 style={{
          fontFamily: "'Instrument Serif',serif",
          fontSize: titleSize,
          lineHeight: 1.03,
          color: '#F0EBE1',
          letterSpacing: titleSize > 36 ? '-0.02em' : '-0.01em',
          marginBottom: pick.source ? 10 : 0,
        }}>
          {pick.title}
        </h2>

        {/* Source */}
        {pick.source && (
          <p style={{
            fontFamily: "'Instrument Serif',serif",
            fontSize: 14, fontStyle: 'italic',
            color: 'rgba(240,235,225,0.60)',
          }}>
            —&nbsp;{pick.source}
          </p>
        )}

        {/* Divider */}
        <div style={{
          height: 1,
          background: `linear-gradient(to right, ${color}35, transparent 80%)`,
          margin: '20px 0',
        }} />

        {/* Note */}
        {pick.note && (
          <div style={{ position: 'relative', marginBottom: 24 }}>
            <span
              aria-hidden
              style={{
                position: 'absolute',
                top: -18, left: -6,
                fontFamily: "'Instrument Serif',serif",
                fontSize: 80, lineHeight: 1,
                color, opacity: 0.15,
                userSelect: 'none', pointerEvents: 'none',
                letterSpacing: '-0.04em',
              }}
            >
              &ldquo;
            </span>
            <p style={{
              fontFamily: "'Instrument Serif',serif",
              fontSize: 17, fontStyle: 'italic', lineHeight: 1.7,
              color: 'rgba(240,235,225,0.84)',
              display: '-webkit-box',
              WebkitLineClamp: 5,
              WebkitBoxOrient: 'vertical' as const,
              overflow: 'hidden',
            }}>
              {pick.note}
            </p>
          </div>
        )}

        {/* Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <button
            type="button"
            onClick={() => resonated ? unresonate(pick.id) : resonate(pick.id)}
            style={{
              fontFamily: "'Space Mono',monospace", fontSize: 9,
              letterSpacing: '0.14em', textTransform: 'uppercase',
              color: resonated ? color : 'rgba(255,255,255,0.22)',
              background: 'none', border: 'none', cursor: 'pointer',
              minHeight: 44, minWidth: 44,
              padding: '0 12px 0 0',
              display: 'flex', alignItems: 'center',
              transition: 'color 0.25s ease',
              textShadow: resonated ? `0 0 24px ${color}90` : 'none',
            }}
          >
            ✦&nbsp;&nbsp;resonate
          </button>
          <button
            type="button"
            onClick={() => saved ? unsaveItem(pick.id) : saveItem(pick.id)}
            style={{
              fontFamily: "'Space Mono',monospace", fontSize: 9,
              letterSpacing: '0.14em', textTransform: 'uppercase',
              color: saved ? 'rgba(200,168,130,0.9)' : 'rgba(255,255,255,0.22)',
              background: 'none', border: 'none', cursor: 'pointer',
              minHeight: 44, minWidth: 44,
              padding: '0 12px 0 0',
              display: 'flex', alignItems: 'center',
              transition: 'color 0.25s ease',
            }}
          >
            ◎&nbsp;&nbsp;save
          </button>
          {pick.url && (
            <>
              <div style={{ width: 1, height: 10, background: 'rgba(255,255,255,0.07)', margin: '0 4px' }} />
              <a
                href={pick.url} target="_blank" rel="noopener noreferrer"
                onClick={e => e.stopPropagation()}
                style={{
                  fontFamily: "'Space Mono',monospace", fontSize: 9,
                  letterSpacing: '0.14em', textTransform: 'uppercase',
                  color: 'rgba(255,255,255,0.42)', textDecoration: 'none',
                  minHeight: 44, padding: '0 4px',
                  display: 'flex', alignItems: 'center',
                }}
              >
                ↗&nbsp;&nbsp;open
              </a>
            </>
          )}
        </div>
      </div>

      {/* Progress dots */}
      <div style={{
        position: 'absolute', bottom: 28, left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex', gap: 6, zIndex: 2,
        alignItems: 'center',
      }}>
        {Array.from({ length: total }).map((_, i) => (
          <div key={i} style={{
            width: i === index ? 20 : 4,
            height: 4, borderRadius: 2,
            backgroundColor: i === index ? color : 'rgba(255,255,255,0.12)',
            boxShadow: i === index ? `0 0 10px ${color}80` : 'none',
            transition: 'width 0.35s ease, background-color 0.35s ease',
          }} />
        ))}
      </div>
    </motion.section>
  )
}

// ─── Full-screen capsule viewer (slides in over inbox) ────────────────────────
function CapsuleViewer({ capsule, author, onBack }: {
  capsule: Capsule; author: User; onBack: () => void
}) {
  const [activeCategory, setActiveCategory] = useState<Category | null>(null)
  const picks = [...capsule.picks].sort((a, b) => a.order - b.order)
  const glowColor = activeCategory ? getCategoryColor(activeCategory) : '#7BB3FF'

  return (
    <motion.div
      initial={{ opacity: 0, x: '30%' }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: '30%' }}
      transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
      style={{
        position: 'fixed', inset: 0, zIndex: 100,
        backgroundColor: 'rgb(4,6,16)',
        overflowY: 'scroll',
        scrollSnapType: 'y mandatory',
      }}
    >
      {/* Atmospheric glow */}
      <div
        aria-hidden
        style={{
          position: 'fixed',
          top: '-10%', left: '50%',
          transform: 'translateX(-50%)',
          width: '110vw', height: '65vh',
          borderRadius: '50%',
          backgroundColor: glowColor,
          opacity: activeCategory ? 0.13 : 0,
          filter: 'blur(110px)',
          transition: 'background-color 0.75s ease, opacity 0.6s ease',
          pointerEvents: 'none', zIndex: 0,
          willChange: 'background-color',
        }}
      />

      {/* Back button — fixed top right */}
      <button
        type="button"
        onClick={onBack}
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
          color: 'rgba(240,235,225,0.65)',
          cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: 8,
          minHeight: 44,
        }}
      >
        ✕
      </button>

      {/* Picks */}
      {picks.map((pick, i) => (
        <PickSection
          key={pick.id}
          pick={pick} capsule={capsule} author={author}
          index={i} total={picks.length}
          isFirstInCapsule={i === 0}
          onFocus={setActiveCategory}
        />
      ))}
    </motion.div>
  )
}

// ─── Inbox capsule row ────────────────────────────────────────────────────────
function CapsuleRow({ capsule, author, isUnread, isSelf, index, onOpen }: {
  capsule: Capsule; author: User; isUnread: boolean; isSelf: boolean
  index: number; onOpen: () => void
}) {
  const primaryColor = getCategoryColor(capsule.picks[0]?.category ?? 'Other')

  return (
    <motion.button
      type="button"
      onClick={onOpen}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      whileTap={{ scale: 0.985 }}
      style={{
        width: '100%', display: 'flex', alignItems: 'center', gap: 14,
        padding: '17px 0',
        background: 'none', border: 'none',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        cursor: 'pointer', textAlign: 'left',
        position: 'relative',
      }}
    >
      {/* Avatar + unread dot */}
      <div style={{ position: 'relative', flexShrink: 0 }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={author.avatar} alt={author.name}
          style={{
            width: 42, height: 42, borderRadius: '50%',
            border: `1.5px solid ${isUnread ? primaryColor + '55' : 'rgba(255,255,255,0.06)'}`,
            boxShadow: isUnread ? `0 0 18px ${primaryColor}22` : 'none',
            opacity: isUnread ? 0.95 : 0.38,
            transition: 'opacity 0.4s ease, border-color 0.4s ease, box-shadow 0.4s ease',
          }}
        />
        {isUnread && (
          <div style={{
            position: 'absolute', top: -1, right: -1,
            width: 9, height: 9, borderRadius: '50%',
            backgroundColor: primaryColor,
            border: '2px solid rgb(4,6,16)',
            boxShadow: `0 0 10px ${primaryColor}cc`,
          }} />
        )}
      </div>

      {/* Name + picks preview */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{
          fontFamily: "'Instrument Serif',serif",
          fontSize: 19,
          color: isUnread ? '#F0EBE1' : 'rgba(240,235,225,0.52)',
          lineHeight: 1.0, marginBottom: 7,
          transition: 'color 0.4s ease',
        }}>
          {isSelf ? 'Your capsule' : author.name}
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          {capsule.picks.map(p => (
            <div key={p.id} style={{
              width: 5, height: 5, borderRadius: '50%',
              backgroundColor: getCategoryColor(p.category),
              opacity: isUnread ? 0.72 : 0.22,
            }} />
          ))}
          <span style={{
            fontFamily: "'Space Mono',monospace",
            fontSize: 8, letterSpacing: '0.1em', textTransform: 'uppercase',
            color: isUnread ? 'rgba(255,255,255,0.40)' : 'rgba(255,255,255,0.22)',
            marginLeft: 4,
          }}>
            {capsule.picks.length} pick{capsule.picks.length !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      {/* Chevron */}
      <svg viewBox="0 0 16 16" width={12} height={12} fill="none" style={{ flexShrink: 0 }}>
        <path
          d="M6 3l5 5-5 5"
          stroke={isUnread ? `${primaryColor}70` : 'rgba(255,255,255,0.1)'}
          strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"
        />
      </svg>
    </motion.button>
  )
}

// ─── Past week row (archive section) ─────────────────────────────────────────
function PastRow({ capsule, author, index }: { capsule: Capsule; author: User; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -6 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05, duration: 0.38 }}
    >
      <Link href={`/capsule/${capsule.id}`} style={{ textDecoration: 'none', display: 'block' }}>
        <div style={{
          padding: '12px 0 12px 14px',
          borderLeft: '2px solid rgba(255,255,255,0.06)',
          display: 'flex', alignItems: 'center', gap: 14,
        }}>
          <span style={{
            fontFamily: "'Space Mono',monospace", fontSize: 8,
            letterSpacing: '0.1em', textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.36)', flexShrink: 0, minWidth: 48,
          }}>
            {formatWeekShort(capsule.weekStartDate)}
          </span>
          <span style={{
            fontFamily: "'Instrument Serif',serif", fontSize: 14,
            color: 'rgba(240,235,225,0.60)', flex: 1,
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>
            {capsule.picks[0]?.title}
          </span>
          <div style={{ display: 'flex', gap: 5, flexShrink: 0 }}>
            {capsule.picks.map(p => (
              <div key={p.id} style={{
                width: 5, height: 5, borderRadius: '50%',
                backgroundColor: getCategoryColor(p.category), opacity: 0.5,
              }} />
            ))}
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

// ─── Empty state ──────────────────────────────────────────────────────────────
function EmptyState() {
  return (
    <div style={{ padding: '48px 0 32px', textAlign: 'center' }}>
      <Link href="/create" style={{ textDecoration: 'none' }}>
        <p style={{
          fontFamily: "'Instrument Serif',serif",
          fontSize: 22, fontStyle: 'italic',
          color: 'rgba(240,235,225,0.40)', lineHeight: 1.45, marginBottom: 24,
        }}>
          Your orbit is quiet.<br />Start with yours.
        </p>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          padding: '10px 24px',
          border: '1px solid rgba(255,255,255,0.09)', borderRadius: 4,
          fontFamily: "'Space Mono',monospace",
          fontSize: 9, letterSpacing: '0.16em', textTransform: 'uppercase',
          color: 'rgba(240,235,225,0.50)',
        }}>
          ✦&nbsp;&nbsp;share something
        </div>
      </Link>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function HomePage() {
  const { currentUser, users, capsules, getUserById, isFollowing } = useStore()
  const [openedIds, setOpenedIds] = useState<Set<string>>(new Set())
  const [viewingCapsuleId, setViewingCapsuleId] = useState<string | null>(null)

  const thisWeek = getWeekStartDate()

  const allGroups = capsules
    .filter(c => c.status === 'published')
    .filter(c => c.userId === currentUser.id || isFollowing(c.userId))
    .sort((a, b) => {
      const recency = Date.parse(b.publishedAt ?? b.weekStartDate) - Date.parse(a.publishedAt ?? a.weekStartDate)
      if (recency !== 0) return recency
      const aTrust = getUserById(a.userId)?.relationshipStrength ?? 0
      const bTrust = getUserById(b.userId)?.relationshipStrength ?? 0
      return bTrust - aTrust
    })
    .map(capsule => ({
      capsule,
      author: getUserById(capsule.userId) ?? users[0],
    }))

  const thisWeekGroups = allGroups.filter(g => g.capsule.weekStartDate === thisWeek)
  const pastGroups = allGroups
    .filter(g => g.capsule.weekStartDate !== thisWeek && g.capsule.userId === currentUser.id)
    .slice(0, 6)

  const unreadCount = thisWeekGroups.filter(g => !openedIds.has(g.capsule.id)).length
  const caughtUp = thisWeekGroups.length > 0 && unreadCount === 0

  const openCapsule = (id: string) => {
    setOpenedIds(prev => new Set([...prev, id]))
    setViewingCapsuleId(id)
  }

  const viewingGroup = viewingCapsuleId
    ? allGroups.find(g => g.capsule.id === viewingCapsuleId)
    : null

  return (
    <>
      {/* Subtle ambient glow on inbox when there are unread capsules */}
      <div
        aria-hidden
        style={{
          position: 'fixed',
          top: '-10%', left: '50%',
          transform: 'translateX(-50%)',
          width: '80vw', height: '55vh',
          borderRadius: '50%',
          backgroundColor: '#C8A882',
          opacity: unreadCount > 0 ? 0.055 : 0,
          filter: 'blur(100px)',
          transition: 'opacity 0.8s ease',
          pointerEvents: 'none', zIndex: 0,
        }}
      />

      {/* Fixed header */}
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 20,
        background: 'linear-gradient(to bottom, rgba(4,6,16,0.97) 0%, rgba(4,6,16,0.8) 65%, transparent 100%)',
        paddingTop: 52, paddingBottom: 28,
        paddingLeft: 24, paddingRight: 24,
        pointerEvents: 'none',
      }}>
        <div style={{
          maxWidth: 512, margin: '0 auto',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          pointerEvents: 'auto',
        }}>
          <span style={{
            fontFamily: "'Space Mono',monospace",
            fontSize: 9, letterSpacing: '0.18em', textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.42)',
          }}>
            orbit
          </span>
          <span style={{
            fontFamily: "'Space Mono',monospace",
            fontSize: 9, letterSpacing: '0.12em',
            color: 'rgba(255,255,255,0.32)',
          }}>
            {formatWeekShort(thisWeek)}
          </span>
          <Link href="/profile" style={{ display: 'block' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={currentUser.avatar} alt={currentUser.name}
              style={{ width: 28, height: 28, borderRadius: '50%', opacity: 0.8, display: 'block' }}
            />
          </Link>
        </div>
      </div>

      {/* Inbox scroll container */}
      <div style={{ minHeight: '100svh', paddingBottom: 100, position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: 512, margin: '0 auto', padding: '120px 24px 0' }}>

          {/* "This week" heading + unread count */}
          <div style={{
            display: 'flex', alignItems: 'baseline', justifyContent: 'space-between',
            marginBottom: 6,
          }}>
            <h1 style={{
              fontFamily: "'Instrument Serif',serif",
              fontSize: 34, fontStyle: 'italic',
              color: '#F0EBE1', letterSpacing: '-0.01em', lineHeight: 1,
            }}>
              This week
            </h1>
            <AnimatePresence>
              {unreadCount > 0 && (
                <motion.span
                  initial={{ opacity: 0, x: 6 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 6 }}
                  style={{
                    fontFamily: "'Space Mono',monospace",
                    fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase',
                    color: '#C8A882',
                    display: 'flex', alignItems: 'center', gap: 7,
                  }}
                >
                  <div style={{
                    width: 5, height: 5, borderRadius: '50%',
                    backgroundColor: '#C8A882',
                    boxShadow: '0 0 8px #C8A882bb',
                  }} />
                  {unreadCount} new
                </motion.span>
              )}
            </AnimatePresence>
          </div>

          {/* Divider */}
          <div style={{
            height: 1,
            background: 'linear-gradient(to right, rgba(200,168,130,0.18), rgba(255,255,255,0.04), transparent)',
            marginBottom: 4,
          }} />

          {/* This week's capsule rows */}
          {thisWeekGroups.length > 0
            ? thisWeekGroups.map(({ capsule, author }, i) => (
                <CapsuleRow
                  key={capsule.id}
                  capsule={capsule} author={author}
                  isUnread={!openedIds.has(capsule.id)}
                  isSelf={capsule.userId === currentUser.id}
                  index={i}
                  onOpen={() => openCapsule(capsule.id)}
                />
              ))
            : <EmptyState />
          }

          {/* Caught up state */}
          <AnimatePresence>
            {caughtUp && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ marginTop: 36, marginBottom: 8, textAlign: 'center' }}
              >
                <p style={{
                  fontFamily: "'Instrument Serif',serif",
                  fontSize: 19, fontStyle: 'italic',
                  color: 'rgba(240,235,225,0.40)', lineHeight: 1.4,
                }}>
                  You&rsquo;re caught up.
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Past weeks — your own archive */}
          {pastGroups.length > 0 && (
            <div style={{ marginTop: caughtUp ? 48 : 56 }}>
              <div style={{ marginBottom: 16 }}>
                <span style={{
                  fontFamily: "'Space Mono',monospace",
                  fontSize: 8, letterSpacing: '0.16em', textTransform: 'uppercase',
                  color: 'rgba(255,255,255,0.32)',
                }}>
                  your past weeks
                </span>
              </div>
              {pastGroups.map(({ capsule, author }, i) => (
                <PastRow key={capsule.id} capsule={capsule} author={author} index={i} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Capsule viewer overlay */}
      <AnimatePresence>
        {viewingGroup && (
          <CapsuleViewer
            key={viewingGroup.capsule.id}
            capsule={viewingGroup.capsule}
            author={viewingGroup.author}
            onBack={() => setViewingCapsuleId(null)}
          />
        )}
      </AnimatePresence>
    </>
  )
}
