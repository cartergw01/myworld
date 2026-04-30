'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { CategoryGlyph } from '@/components/capsule/CategoryGlyph'
import { useStore } from '@/lib/store'
import { getCategoryColor, getWeekStartDate } from '@/lib/utils'
import type { Category, Pick, Capsule } from '@/types'

const CATEGORIES: Category[] = ['Read', 'Watch', 'Listen', 'Idea', 'Other']

function makeId() {
  return Math.random().toString(36).slice(2, 10)
}

function emptyPick(capsuleId: string, order: number): Partial<Pick> {
  return { id: makeId(), capsuleId, order }
}

interface CreateStepperProps {
  initialCapsule?: Capsule
}

export function CreateStepper({ initialCapsule }: CreateStepperProps) {
  const router = useRouter()
  const { addCapsule, updateCapsule, currentUser } = useStore()

  const capsuleIdRef = useRef<string>(initialCapsule?.id ?? makeId())
  const capsuleId = capsuleIdRef.current

  const [picks, setPicks] = useState<Partial<Pick>[]>(() =>
    initialCapsule?.picks?.length ? [...initialCapsule.picks] : [emptyPick(capsuleId, 0)]
  )
  const [activeIndex, setActiveIndex] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [publishing, setPublishing] = useState(false)
  const [draftSaved, setDraftSaved] = useState(false)
  const [isEditing, setIsEditing] = useState(!!initialCapsule)

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  }, [])

  const addPick = () => {
    if (picks.length >= 5) return
    setPicks(p => [...p, emptyPick(capsuleId, p.length)])
    setActiveIndex(picks.length)
  }

  const removePick = (idx: number) => {
    setPicks(p => p.filter((_, i) => i !== idx).map((pick, i) => ({ ...pick, order: i })))
    setActiveIndex(i => Math.max(0, Math.min(i, picks.length - 2)))
  }

  const updatePick = (idx: number, updated: Partial<Pick>) => {
    setPicks(p => p.map((pick, i) => i === idx ? { ...pick, ...updated } : pick))
  }

  const clearCategory = (idx: number) => {
    setPicks(p => p.map((pick, i) => {
      if (i !== idx) return pick
      const { category: _, ...rest } = pick
      return rest
    }))
  }

  const validate = (): string | null => {
    if (picks.length < 1) return 'Add something first.'
    for (let i = 0; i < picks.length; i++) {
      const p = picks[i]
      if (!p.category) return 'Choose a type.'
      if (!p.title?.trim()) return 'Give it a title.'
      if (!p.note?.trim()) return 'Add your note.'
    }
    return null
  }

  const saveDraft = () => {
    const capsule: Capsule = {
      id: capsuleId,
      userId: currentUser.id,
      weekStartDate: getWeekStartDate(),
      status: 'draft',
      picks: picks.filter(p => p.title?.trim()) as Pick[],
    }
    if (isEditing) {
      updateCapsule(capsule)
    } else {
      addCapsule(capsule)
      setIsEditing(true)
    }
    setError(null)
    setDraftSaved(true)
    setTimeout(() => setDraftSaved(false), 2200)
  }

  const publish = () => {
    const err = validate()
    if (err) { setError(err); return }
    setError(null)
    setPublishing(true)

    const capsule: Capsule = {
      id: capsuleId,
      userId: currentUser.id,
      weekStartDate: getWeekStartDate(),
      publishedAt: new Date().toISOString(),
      status: 'published',
      picks: picks as Pick[],
    }

    if (isEditing) {
      updateCapsule(capsule)
    } else {
      addCapsule(capsule)
    }
    setTimeout(() => router.push('/home'), 650)
  }

  const activePick = picks[activeIndex] ?? picks[0]
  const selectedColor = activePick.category ? getCategoryColor(activePick.category) : '#C8A882'
  const completed = picks.filter(p => p.category && p.title?.trim() && p.note?.trim()).length
  const readyToPublish = picks.length > 0 && completed === picks.length

  return (
    <div
      className="no-scrollbar"
      style={{
        position: 'relative',
        maxWidth: 512,
        margin: '0 auto',
        minHeight: 'calc(100svh - 80px)',
        overflowY: 'auto',
        padding: '0 24px',
      }}
    >
      {/* Atmospheric bloom */}
      <div style={{
        position: 'fixed',
        top: '-8%', left: '50%',
        transform: 'translateX(-50%)',
        width: '90vw', height: '55vh',
        borderRadius: '50%',
        backgroundColor: selectedColor,
        opacity: activePick.category ? 0.09 : 0.03,
        filter: 'blur(100px)',
        pointerEvents: 'none', zIndex: 0,
        transition: 'background-color 0.7s ease, opacity 0.6s ease',
      }} />

      <div style={{ position: 'relative', zIndex: 1, paddingTop: 88, paddingBottom: 120 }}>

        {/* Heading */}
        <div style={{ marginBottom: 32 }}>
          <h2 style={{
            fontFamily: "'Instrument Serif',serif",
            fontStyle: 'italic',
            fontSize: 40, lineHeight: 1.0, letterSpacing: '-0.015em',
            color: '#F0EBE1',
            marginBottom: picks.length > 1 ? 16 : 0,
          }}>
            {initialCapsule ? 'Continue editing.' : 'What stayed with you?'}
          </h2>

          {/* Multi-pick navigator */}
          {picks.length > 1 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              {picks.map((pick, idx) => {
                const color = pick.category ? getCategoryColor(pick.category) : 'rgba(255,255,255,0.16)'
                return (
                  <button
                    type="button"
                    key={pick.id}
                    onClick={() => setActiveIndex(idx)}
                    aria-label={`Edit pick ${idx + 1}`}
                    style={{
                      width: idx === activeIndex ? 28 : 8,
                      height: 4, borderRadius: 999,
                      background: idx === activeIndex ? color : 'rgba(255,255,255,0.13)',
                      border: 'none', cursor: 'pointer',
                      transition: 'all 0.3s ease',
                    }}
                  />
                )
              })}
              <span style={{
                fontFamily: "'Space Mono',monospace",
                fontSize: 8, letterSpacing: '0.14em', textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.22)',
                marginLeft: 4,
              }}>
                {activeIndex + 1} / {picks.length}
              </span>
            </div>
          )}
        </div>

        {/* Category — collapses to badge once picked */}
        <div style={{ marginBottom: 20 }}>
          <AnimatePresence mode="wait">
            {!activePick.category ? (
              <motion.div
                key="picker"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.15 }}
                style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}
              >
                {CATEGORIES.map(category => {
                  const color = getCategoryColor(category)
                  return (
                    <motion.button
                      type="button"
                      key={category}
                      onClick={() => updatePick(activeIndex, { category })}
                      whileTap={{ scale: 0.95 }}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 7,
                        padding: '7px 12px',
                        borderRadius: 4,
                        border: '1px solid rgba(255,255,255,0.09)',
                        background: 'transparent',
                        color: 'rgba(255,255,255,0.4)',
                        fontFamily: "'Space Mono',monospace",
                        fontSize: 8, letterSpacing: '0.14em', textTransform: 'uppercase',
                        cursor: 'pointer',
                        transition: 'border-color 0.2s ease, color 0.2s ease',
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.borderColor = `${color}50`
                        e.currentTarget.style.color = color
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.09)'
                        e.currentTarget.style.color = 'rgba(255,255,255,0.4)'
                      }}
                    >
                      <CategoryGlyph category={category} size={11} />
                      {category}
                    </motion.button>
                  )
                })}
              </motion.div>
            ) : (
              <motion.div
                key="badge"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.18 }}
                style={{ display: 'flex', alignItems: 'center', gap: 10 }}
              >
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: 7,
                  padding: '6px 12px',
                  borderRadius: 4,
                  border: `1px solid ${selectedColor}38`,
                  background: `${selectedColor}0e`,
                  color: selectedColor,
                  fontFamily: "'Space Mono',monospace",
                  fontSize: 8, letterSpacing: '0.14em', textTransform: 'uppercase',
                }}>
                  <CategoryGlyph category={activePick.category as Category} size={11} />
                  {activePick.category}
                </div>
                <button
                  type="button"
                  onClick={() => clearCategory(activeIndex)}
                  style={{
                    fontFamily: "'Space Mono',monospace",
                    fontSize: 8, letterSpacing: '0.12em', textTransform: 'uppercase',
                    color: 'rgba(255,255,255,0.2)',
                    background: 'none', border: 'none', cursor: 'pointer',
                    padding: 0,
                  }}
                >
                  change
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Divider */}
        <div style={{
          height: 1,
          background: `linear-gradient(to right, ${selectedColor}35, rgba(255,255,255,0.06), transparent)`,
          marginBottom: 28,
          transition: 'background 0.7s ease',
        }} />

        {/* Form — animates between picks */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activePick.id}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -8 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
          >
            {/* Title */}
            <input
              value={activePick.title || ''}
              onChange={e => updatePick(activeIndex, { title: e.target.value })}
              placeholder="Title or idea"
              className="placeholder:text-[rgba(240,235,225,0.28)]"
              style={{
                width: '100%', background: 'transparent', border: 'none', outline: 'none',
                fontFamily: "'Instrument Serif',serif",
                fontSize: 36, lineHeight: 1.08, letterSpacing: '-0.01em',
                color: '#F0EBE1',
                display: 'block',
                marginBottom: 8,
              }}
            />

            {/* Source */}
            <input
              value={activePick.source || ''}
              onChange={e => updatePick(activeIndex, { source: e.target.value })}
              placeholder="— source or author"
              className="placeholder:text-[rgba(240,235,225,0.2)]"
              style={{
                width: '100%', background: 'transparent', border: 'none', outline: 'none',
                fontFamily: "'Instrument Serif',serif",
                fontSize: 14, fontStyle: 'italic',
                color: 'rgba(240,235,225,0.42)',
                display: 'block',
                marginBottom: 32,
              }}
            />

            {/* Note */}
            <textarea
              value={activePick.note || ''}
              onChange={e => {
                updatePick(activeIndex, { note: e.target.value })
                e.target.style.height = 'auto'
                e.target.style.height = e.target.scrollHeight + 'px'
              }}
              placeholder="Why will you remember this?"
              rows={3}
              className="placeholder:text-[rgba(240,235,225,0.22)]"
              style={{
                width: '100%', background: 'transparent', resize: 'none',
                border: 'none', outline: 'none',
                fontFamily: "'Instrument Serif',serif",
                fontSize: 18, fontStyle: 'italic', lineHeight: 1.75,
                color: 'rgba(240,235,225,0.7)',
                display: 'block',
                marginBottom: 28,
              }}
            />

            {/* Link */}
            <input
              type="url"
              value={activePick.url || ''}
              onChange={e => updatePick(activeIndex, { url: e.target.value })}
              placeholder="Link (optional)"
              className="placeholder:text-[rgba(255,255,255,0.16)]"
              style={{
                width: '100%', background: 'transparent', border: 'none', outline: 'none',
                fontFamily: "'Space Mono',monospace",
                fontSize: 9, letterSpacing: '0.08em',
                color: 'rgba(255,255,255,0.35)',
                display: 'block',
              }}
            />
          </motion.div>
        </AnimatePresence>

      </div>

      {/* Fixed action bar */}
      <div style={{
        position: 'fixed',
        bottom: 80,
        left: 0, right: 0,
        zIndex: 40,
        background: 'linear-gradient(to bottom, transparent, rgba(4,6,16,0.97) 30%)',
        paddingTop: 24,
      }}>
        <div style={{ maxWidth: 512, margin: '0 auto', padding: '0 24px 12px' }}>

          {/* Feedback */}
          <div aria-live="polite" style={{ minHeight: 22, marginBottom: 10 }}>
            <AnimatePresence mode="wait">
              {error && (
                <motion.p
                  key="error"
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  style={{
                    fontFamily: "'Instrument Serif',serif",
                    fontSize: 14, fontStyle: 'italic',
                    color: '#FF8A7B',
                  }}
                >
                  {error}
                </motion.p>
              )}
              {draftSaved && !error && (
                <motion.p
                  key="draft"
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  style={{
                    fontFamily: "'Space Mono',monospace",
                    fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase',
                    color: 'rgba(200,168,130,0.6)',
                  }}
                >
                  ✓&nbsp;&nbsp;Draft saved
                </motion.p>
              )}
              {publishing && (
                <motion.p
                  key="published"
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{
                    fontFamily: "'Instrument Serif',serif",
                    fontSize: 14, fontStyle: 'italic',
                    color: 'rgba(240,235,225,0.5)',
                  }}
                >
                  Added to your sky.
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          {/* Actions row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>

            {/* Secondary: add / remove */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              {picks.length < 5 && (
                <button
                  type="button"
                  onClick={addPick}
                  style={{
                    fontFamily: "'Space Mono',monospace",
                    fontSize: 9, letterSpacing: '0.13em', textTransform: 'uppercase',
                    color: 'rgba(200,168,130,0.45)',
                    background: 'none', border: 'none', cursor: 'pointer', padding: 0,
                    whiteSpace: 'nowrap', minHeight: 44, display: 'flex', alignItems: 'center',
                  }}
                >
                  + add
                </button>
              )}
              {picks.length > 1 && (
                <button
                  type="button"
                  onClick={() => removePick(activeIndex)}
                  style={{
                    fontFamily: "'Space Mono',monospace",
                    fontSize: 9, letterSpacing: '0.13em', textTransform: 'uppercase',
                    color: 'rgba(255,255,255,0.18)',
                    background: 'none', border: 'none', cursor: 'pointer', padding: 0,
                    whiteSpace: 'nowrap', minHeight: 44, display: 'flex', alignItems: 'center',
                  }}
                >
                  remove
                </button>
              )}
            </div>

            <div style={{ flex: 1 }} />

            {/* Save draft — plain text, no border */}
            <button
              type="button"
              onClick={saveDraft}
              disabled={publishing}
              style={{
                fontFamily: "'Space Mono',monospace",
                fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase',
                color: draftSaved ? 'rgba(200,168,130,0.85)' : 'rgba(255,255,255,0.25)',
                background: 'none', border: 'none',
                padding: '0 16px',
                minHeight: 44,
                display: 'flex', alignItems: 'center',
                cursor: 'pointer',
                transition: 'color 0.25s ease',
                opacity: publishing ? 0.3 : 1,
                whiteSpace: 'nowrap',
              }}
            >
              {draftSaved ? '✓ saved' : 'save'}
            </button>

            {/* Share */}
            <button
              type="button"
              onClick={publish}
              disabled={publishing}
              style={{
                fontFamily: "'Space Mono',monospace",
                fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase',
                fontWeight: 700,
                background: readyToPublish ? '#C8A882' : 'rgba(200,168,130,0.1)',
                color: readyToPublish ? '#0A0A0A' : 'rgba(200,168,130,0.32)',
                border: 'none', borderRadius: 999,
                padding: '0 28px',
                minHeight: 44,
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: readyToPublish ? '0 4px 24px rgba(200,168,130,0.28)' : 'none',
                opacity: publishing ? 0.6 : 1,
                whiteSpace: 'nowrap',
              }}
            >
              {publishing ? 'Shared' : 'Share'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
