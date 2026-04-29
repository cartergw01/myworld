'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Trash2 } from 'lucide-react'
import { motion } from 'framer-motion'
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

export function CreateStepper() {
  const router = useRouter()
  const { addCapsule } = useStore()
  const [capsuleId] = useState(makeId)

  const [picks, setPicks] = useState<Partial<Pick>[]>([emptyPick(capsuleId, 0)])
  const [activeIndex, setActiveIndex] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [publishing, setPublishing] = useState(false)

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

  const validate = (): string | null => {
    if (picks.length < 1) return 'Add something first.'
    for (let i = 0; i < picks.length; i++) {
      const p = picks[i]
      if (!p.category) return 'Choose what kind of thing this is.'
      if (!p.title?.trim()) return 'Add a title.'
      if (!p.note?.trim()) return 'Add a short note.'
    }
    return null
  }

  const publish = () => {
    const err = validate()
    if (err) { setError(err); return }
    setError(null)
    setPublishing(true)

    const capsule: Capsule = {
      id: capsuleId,
      userId: 'user_carter',
      weekStartDate: getWeekStartDate(),
      publishedAt: new Date().toISOString(),
      status: 'published',
      picks: picks as Pick[],
    }

    addCapsule(capsule)
    setTimeout(() => router.push('/home'), 650)
  }

  const activePick = picks[activeIndex] ?? picks[0]
  const selectedColor = activePick.category ? getCategoryColor(activePick.category) : '#C8A882'
  const completed = picks.filter(p => p.category && p.title?.trim() && p.note?.trim()).length
  const readyToPublish = picks.length > 0 && completed === picks.length

  return (
    <div className="share-shell relative mx-auto min-h-[calc(100svh-80px)] max-w-lg overflow-y-auto px-5 no-scrollbar">
      <div
        className="pointer-events-none absolute left-1/2 top-[42%] h-72 w-72 -translate-x-1/2 rounded-full blur-[76px] transition-colors duration-500"
        style={{ background: `${selectedColor}18` }}
      />

      <div className="share-content relative z-10 flex min-h-[calc(100svh-80px)] flex-col pt-20 pb-5">
        <div className="mb-5 flex items-start justify-between">
          <div>
            <h2 className="share-title font-serif-orbit text-[2.45rem] leading-[0.96]" style={{ color: '#F0EBE1' }}>
              Share one thing worth keeping.
            </h2>
          </div>
          <div className="flex flex-col items-center gap-2">
            {picks.map((pick, idx) => {
              const color = pick.category ? getCategoryColor(pick.category) : 'rgba(255,255,255,0.2)'
              return (
                <button
                  type="button"
                  key={pick.id}
                  onClick={() => setActiveIndex(idx)}
                  className="transition-all duration-300"
                  style={{
                    width: idx === activeIndex ? 22 : 7,
                    height: 7,
                    borderRadius: 999,
                    background: idx === activeIndex ? color : 'rgba(255,255,255,0.16)',
                  }}
                  aria-label={`Edit pick ${idx + 1}`}
                />
              )
            })}
          </div>
        </div>

        <div key={activePick.id} className="share-form-body relative flex-1">
          <div className="mb-5 flex flex-wrap gap-2">
            {CATEGORIES.map(category => {
              const color = getCategoryColor(category)
              const active = activePick.category === category
              return (
                <motion.button
                  type="button"
                  key={category}
                  onClick={() => updatePick(activeIndex, { category })}
                  whileTap={{ scale: 0.96 }}
                  data-active={active}
                  className="share-category font-mono-orbit flex items-center gap-2 border-b py-2 pr-3 text-[9px] uppercase tracking-[0.14em] transition-all duration-200"
                  style={{
                    borderColor: active ? color : 'rgba(255,255,255,0.16)',
                    color: active ? color : 'rgba(255,255,255,0.42)',
                  }}
                >
                  <CategoryGlyph category={category} size={13} />
                  {category}
                </motion.button>
              )
            })}
          </div>

          <label className="block border-l pl-5" style={{ borderColor: `${selectedColor}66` }}>
            <span className="font-mono-orbit text-[8px] uppercase tracking-[0.16em]" style={{ color: 'rgba(255,255,255,0.34)' }}>
              Share
            </span>
            <input
              value={activePick.title || ''}
              onChange={e => updatePick(activeIndex, { title: e.target.value })}
              placeholder="Title or idea"
              className="share-input-title font-serif-orbit mt-1 w-full bg-transparent text-[2.35rem] leading-[0.98] outline-none placeholder:text-[rgba(240,235,225,0.48)]"
              style={{ color: '#F0EBE1' }}
            />
          </label>

          <label className="mt-5 block">
            <span className="font-mono-orbit text-[8px] uppercase tracking-[0.16em]" style={{ color: 'rgba(255,255,255,0.34)' }}>
              Your note
            </span>
            <textarea
              value={activePick.note || ''}
              onChange={e => updatePick(activeIndex, { note: e.target.value })}
              placeholder="One sentence about why it stayed with you."
              rows={3}
              className="font-serif-orbit mt-1 w-full resize-none border-b bg-transparent pb-3 text-lg italic leading-relaxed outline-none placeholder:text-[rgba(240,235,225,0.36)]"
              style={{ borderColor: 'rgba(255,255,255,0.16)', color: 'rgba(240,235,225,0.62)' }}
            />
          </label>

          <label className="mt-3 block">
            <span className="font-mono-orbit text-[8px] uppercase tracking-[0.16em]" style={{ color: 'rgba(255,255,255,0.28)' }}>
              Link
            </span>
            <input
              type="url"
              value={activePick.url || ''}
              onChange={e => updatePick(activeIndex, { url: e.target.value })}
              placeholder="https://..."
              className="font-mono-orbit mt-1 w-full border-b bg-transparent py-2 text-[10px] tracking-[0.08em] outline-none placeholder:text-[rgba(255,255,255,0.28)]"
              style={{ borderColor: 'rgba(255,255,255,0.14)', color: 'rgba(255,255,255,0.42)' }}
            />
          </label>
        </div>

        <div aria-live="polite">
          {error && (
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="font-serif-orbit mt-3 text-base italic"
              style={{ color: '#FF8A7B' }}
            >
              {error}
            </motion.p>
          )}
          {publishing && (
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="share-success-note font-serif-orbit mt-3 text-base italic"
              style={{ color: 'rgba(240,235,225,0.56)' }}
            >
              Added to your sky.
            </motion.p>
          )}
        </div>

        <div className="share-actions mt-4 flex items-center gap-3">
          {picks.length < 5 && (
            <button
              type="button"
              onClick={addPick}
              className="font-mono-orbit flex h-12 w-12 items-center justify-center rounded-full transition-transform duration-200 active:scale-95"
              style={{
                background: 'rgba(200,168,130,0.1)',
                border: '1px solid rgba(200,168,130,0.3)',
                color: '#C8A882',
              }}
              aria-label="Add another item"
            >
              <Plus size={18} />
            </button>
          )}
          {picks.length > 1 && (
            <button
              type="button"
              onClick={() => removePick(activeIndex)}
              className="flex h-12 w-12 items-center justify-center rounded-full transition-transform duration-200 active:scale-95"
              style={{
                border: '1px solid rgba(255,255,255,0.08)',
                color: 'rgba(255,255,255,0.26)',
              }}
              aria-label="Remove this item"
            >
              <Trash2 size={16} />
            </button>
          )}
          <button
            type="button"
            onClick={publish}
            disabled={publishing}
            data-ready={readyToPublish}
            className="share-submit font-mono-orbit min-h-12 flex-1 rounded-full px-5 text-[10px] font-bold uppercase tracking-[0.14em] transition-all duration-200 disabled:opacity-50"
            style={{
              background: readyToPublish ? '#C8A882' : 'rgba(200,168,130,0.15)',
              color: readyToPublish ? '#0A0A0A' : 'rgba(200,168,130,0.5)',
            }}
          >
            <span>{publishing ? 'Shared' : 'Share'}</span>
          </button>
        </div>
      </div>
    </div>
  )
}
