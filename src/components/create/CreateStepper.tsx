'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, ArrowUp, ArrowDown } from 'lucide-react'
import { PickEditor } from './PickEditor'
import { useStore } from '@/lib/store'
import { getWeekStartDate } from '@/lib/utils'
import type { Pick, Capsule } from '@/types'

function makeId() {
  return Math.random().toString(36).slice(2, 10)
}

function emptyPick(capsuleId: string, order: number): Partial<Pick> {
  return { id: makeId(), capsuleId, order }
}

export function CreateStepper() {
  const router = useRouter()
  const { addCapsule } = useStore()
  const capsuleId = makeId()

  const [picks, setPicks] = useState<Partial<Pick>[]>([emptyPick(capsuleId, 0)])
  const [error, setError] = useState<string | null>(null)
  const [publishing, setPublishing] = useState(false)

  const addPick = () => {
    if (picks.length >= 5) return
    setPicks(p => [...p, emptyPick(capsuleId, p.length)])
  }

  const removePick = (idx: number) => {
    setPicks(p => p.filter((_, i) => i !== idx).map((pick, i) => ({ ...pick, order: i })))
  }

  const updatePick = (idx: number, updated: Partial<Pick>) => {
    setPicks(p => p.map((pick, i) => i === idx ? updated : pick))
  }

  const movePick = (idx: number, dir: -1 | 1) => {
    const next = idx + dir
    if (next < 0 || next >= picks.length) return
    setPicks(p => {
      const arr = [...p]
      ;[arr[idx], arr[next]] = [arr[next], arr[idx]]
      return arr.map((pick, i) => ({ ...pick, order: i }))
    })
  }

  const validate = (): string | null => {
    if (picks.length < 3) return 'Add at least 3 picks.'
    for (let i = 0; i < picks.length; i++) {
      const p = picks[i]
      if (!p.category) return `Pick ${i + 1} needs a category.`
      if (!p.title?.trim()) return `Pick ${i + 1} needs a title.`
      if (!p.source?.trim()) return `Pick ${i + 1} needs a source.`
      if (!p.note?.trim()) return `Pick ${i + 1} needs a note.`
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
    setTimeout(() => router.push('/home'), 300)
  }

  return (
    <div className="px-4 pb-safe max-w-lg mx-auto">
      {/* Prompt */}
      <div className="pt-6 pb-5">
        <h1
          className="text-xl font-semibold leading-snug mb-1"
          style={{ color: '#F0EBE1' }}
        >
          What actually captured your attention this week?
        </h1>
        <p className="text-sm" style={{ color: '#5A5A5A' }}>
          Add 3 to 5 picks — the things worth remembering.
        </p>
      </div>

      {/* Pick count indicator */}
      <div className="flex items-center gap-1.5 mb-4">
        {[0, 1, 2, 3, 4].map(i => (
          <div
            key={i}
            className="h-1 rounded-full flex-1 transition-all duration-300"
            style={{
              background: i < picks.length
                ? '#C8A882'
                : 'rgba(255,255,255,0.08)',
            }}
          />
        ))}
        <span className="ml-2 text-xs" style={{ color: '#5A5A5A' }}>
          {picks.length}/5
        </span>
      </div>

      {/* Picks */}
      <div className="space-y-3">
        {picks.map((pick, idx) => (
          <div key={pick.id} className="relative">
            <PickEditor
              pick={pick}
              index={idx}
              onChange={updated => updatePick(idx, updated)}
              onRemove={() => removePick(idx)}
              canRemove={picks.length > 1}
            />
            {/* Reorder */}
            {picks.length > 1 && (
              <div className="absolute right-[-32px] top-1/2 -translate-y-1/2 flex flex-col gap-1">
                <button
                  onClick={() => movePick(idx, -1)}
                  disabled={idx === 0}
                  className="w-6 h-6 flex items-center justify-center rounded-lg disabled:opacity-20"
                  style={{ color: 'rgba(255,255,255,0.3)' }}
                >
                  <ArrowUp size={12} />
                </button>
                <button
                  onClick={() => movePick(idx, 1)}
                  disabled={idx === picks.length - 1}
                  className="w-6 h-6 flex items-center justify-center rounded-lg disabled:opacity-20"
                  style={{ color: 'rgba(255,255,255,0.3)' }}
                >
                  <ArrowDown size={12} />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add pick */}
      {picks.length < 5 && (
        <button
          onClick={addPick}
          className="w-full mt-3 py-3 rounded-2xl flex items-center justify-center gap-2 text-sm font-medium transition-all duration-200"
          style={{
            background: 'rgba(200,168,130,0.06)',
            border: '1px dashed rgba(200,168,130,0.25)',
            color: 'rgba(200,168,130,0.7)',
          }}
        >
          <Plus size={16} />
          Add pick ({picks.length}/5)
        </button>
      )}

      {/* Error */}
      {error && (
        <div
          className="mt-4 px-4 py-3 rounded-xl text-sm"
          style={{
            background: 'rgba(255,100,100,0.08)',
            border: '1px solid rgba(255,100,100,0.15)',
            color: '#FF8A7B',
          }}
        >
          {error}
        </div>
      )}

      {/* Publish */}
      <button
        onClick={publish}
        disabled={publishing}
        className="w-full mt-5 py-4 rounded-2xl text-sm font-semibold tracking-wide transition-all duration-200 disabled:opacity-50"
        style={{
          background: picks.length >= 3 ? '#C8A882' : 'rgba(200,168,130,0.15)',
          color: picks.length >= 3 ? '#0A0A0A' : 'rgba(200,168,130,0.5)',
        }}
      >
        {publishing ? 'Publishing…' : 'Publish Capsule'}
      </button>

      <p
        className="text-center text-xs mt-3 mb-8"
        style={{ color: '#3A3A3A' }}
      >
        Minimum 3 picks · Maximum 5 picks
      </p>
    </div>
  )
}
