'use client'

import { ChevronDown, Trash2 } from 'lucide-react'
import { useState } from 'react'
import type { Category, Pick } from '@/types'
import { getCategoryColor, getCategoryIcon } from '@/lib/utils'

const CATEGORIES: Category[] = ['Read', 'Watch', 'Listen', 'Idea', 'Wild Card']

interface PickEditorProps {
  pick: Partial<Pick>
  index: number
  onChange: (pick: Partial<Pick>) => void
  onRemove: () => void
  canRemove: boolean
}

export function PickEditor({ pick, index, onChange, onRemove, canRemove }: PickEditorProps) {
  const [catOpen, setCatOpen] = useState(!pick.category)

  const update = (field: keyof Pick, value: string | number) => {
    onChange({ ...pick, [field]: value })
  }

  const selectedColor = pick.category ? getCategoryColor(pick.category) : 'rgba(255,255,255,0.3)'

  return (
    <div
      className="rounded-2xl p-4 space-y-3"
      style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.07)',
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium" style={{ color: '#5A5A5A' }}>
          Pick {index + 1}
        </span>
        {canRemove && (
          <button
            onClick={onRemove}
            className="w-6 h-6 flex items-center justify-center rounded-full transition-colors"
            style={{ color: 'rgba(255,255,255,0.2)' }}
          >
            <Trash2 size={13} />
          </button>
        )}
      </div>

      {/* Category selector */}
      <div>
        <button
          onClick={() => setCatOpen(!catOpen)}
          className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm transition-colors"
          style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
            color: pick.category ? selectedColor : 'rgba(255,255,255,0.3)',
          }}
        >
          <span className="flex items-center gap-2">
            {pick.category && <span>{getCategoryIcon(pick.category)}</span>}
            {pick.category || 'Select category'}
          </span>
          <ChevronDown
            size={14}
            className={`transition-transform duration-200 ${catOpen ? 'rotate-180' : ''}`}
            style={{ color: 'rgba(255,255,255,0.2)' }}
          />
        </button>

        {catOpen && (
          <div
            className="mt-2 rounded-xl overflow-hidden"
            style={{ border: '1px solid rgba(255,255,255,0.07)', background: '#111' }}
          >
            {CATEGORIES.map(cat => {
              const color = getCategoryColor(cat)
              const icon = getCategoryIcon(cat)
              return (
                <button
                  key={cat}
                  onClick={() => {
                    update('category', cat)
                    setCatOpen(false)
                  }}
                  className="w-full flex items-center gap-2.5 px-4 py-3 text-sm text-left transition-colors hover:bg-white/5"
                  style={{
                    color: pick.category === cat ? color : 'rgba(255,255,255,0.6)',
                    borderBottom: '1px solid rgba(255,255,255,0.04)',
                  }}
                >
                  <span>{icon}</span>
                  {cat}
                  {pick.category === cat && (
                    <span className="ml-auto text-xs" style={{ color }}>✓</span>
                  )}
                </button>
              )
            })}
          </div>
        )}
      </div>

      {/* Title */}
      <input
        type="text"
        placeholder="Title"
        value={pick.title || ''}
        onChange={e => update('title', e.target.value)}
        className="w-full px-3 py-2.5 rounded-xl text-sm outline-none transition-colors placeholder:text-white/20"
        style={{
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.08)',
          color: '#F0EBE1',
        }}
      />

      {/* Source */}
      <input
        type="text"
        placeholder="Source (author, publication, platform…)"
        value={pick.source || ''}
        onChange={e => update('source', e.target.value)}
        className="w-full px-3 py-2.5 rounded-xl text-sm outline-none placeholder:text-white/20"
        style={{
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.08)',
          color: '#F0EBE1',
        }}
      />

      {/* URL */}
      <input
        type="url"
        placeholder="Link (optional)"
        value={pick.url || ''}
        onChange={e => update('url', e.target.value)}
        className="w-full px-3 py-2.5 rounded-xl text-sm outline-none placeholder:text-white/20"
        style={{
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.08)',
          color: '#F0EBE1',
        }}
      />

      {/* Note */}
      <textarea
        placeholder="Why did this matter to you?"
        value={pick.note || ''}
        onChange={e => update('note', e.target.value)}
        rows={3}
        className="w-full px-3 py-2.5 rounded-xl text-sm outline-none resize-none placeholder:text-white/20"
        style={{
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.08)',
          color: '#F0EBE1',
        }}
      />
    </div>
  )
}
