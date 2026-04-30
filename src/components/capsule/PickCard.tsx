'use client'

import { motion } from 'framer-motion'
import type { Pick } from '@/types'
import { getCategoryColor } from '@/lib/utils'
import { CategoryGlyph } from './CategoryGlyph'
import { useStore } from '@/lib/store'

interface PickCardProps {
  pick: Pick
  index?: number
}

export function PickCard({ pick, index = 0 }: PickCardProps) {
  const color = getCategoryColor(pick.category)
  const { isItemSaved, saveItem, unsaveItem, isResonated, resonate, unresonate } = useStore()
  const resonated = isResonated(pick.id)
  const saved = isItemSaved(pick.id)

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: index * 0.07, ease: [0.22, 1, 0.36, 1] }}
      style={{ position: 'relative' }}
    >
      {/* Left accent line */}
      <div style={{
        position: 'absolute', left: 0, top: 0, bottom: 0,
        width: 2,
        background: `linear-gradient(to bottom, ${color}90, ${color}18)`,
        borderRadius: 1,
        boxShadow: `2px 0 14px ${color}28`,
      }} />

      <div style={{ paddingLeft: 20, paddingTop: 4, paddingBottom: 28 }}>

        {/* Thumbnail */}
        {pick.thumbnail && (
          <div style={{
            width: '100%', height: 140, borderRadius: 6,
            overflow: 'hidden', marginBottom: 16, position: 'relative',
          }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={pick.thumbnail} alt={pick.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.6 }} />
            <div style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(to bottom, transparent 40%, rgba(4,6,14,0.95) 100%)',
            }} />
          </div>
        )}

        {/* Category badge */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 7,
          color, marginBottom: 14,
          padding: '4px 10px 4px 8px',
          border: `1px solid ${color}25`,
          borderRadius: 3,
          background: `${color}0a`,
        }}>
          <CategoryGlyph category={pick.category} size={12} />
          <span style={{
            fontFamily: "'Space Mono',monospace",
            fontSize: 8, letterSpacing: '0.18em', textTransform: 'uppercase',
          }}>
            {pick.category}
          </span>
        </div>

        {/* Color bloom */}
        <div style={{
          position: 'absolute', top: '35%', left: '40%',
          width: 260, height: 260, borderRadius: '50%',
          backgroundColor: color, opacity: 0.09,
          filter: 'blur(65px)',
          pointerEvents: 'none', zIndex: 0,
        }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          {/* Title */}
          <h3 style={{
            fontFamily: "'Instrument Serif',serif",
            fontSize: pick.title.length > 35 ? 22 : 26,
            lineHeight: 1.1,
            color: '#F0EBE1',
            letterSpacing: '-0.01em',
            marginBottom: pick.source ? 8 : 14,
          }}>
            {pick.title}
          </h3>

          {/* Source */}
          {pick.source && (
            <p style={{
              fontFamily: "'Instrument Serif',serif",
              fontSize: 13, fontStyle: 'italic',
              color: 'rgba(240,235,225,0.38)',
              marginBottom: 14,
            }}>
              —&nbsp;{pick.source}
            </p>
          )}

          {/* Note with decorative quote mark */}
          {pick.note && (
            <div style={{ position: 'relative', marginBottom: 20 }}>
              <span
                aria-hidden
                style={{
                  position: 'absolute',
                  top: -14, left: -4,
                  fontFamily: "'Instrument Serif',serif",
                  fontSize: 64, lineHeight: 1,
                  color, opacity: 0.14,
                  userSelect: 'none', pointerEvents: 'none',
                }}
              >
                &ldquo;
              </span>
              <p style={{
                fontFamily: "'Instrument Serif',serif",
                fontSize: 16, fontStyle: 'italic', lineHeight: 1.7,
                color: 'rgba(240,235,225,0.65)',
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
                minHeight: 44, padding: '0 12px 0 0',
                display: 'flex', alignItems: 'center',
                transition: 'color 0.25s ease',
                textShadow: resonated ? `0 0 20px ${color}80` : 'none',
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
                minHeight: 44, padding: '0 12px 0 0',
                display: 'flex', alignItems: 'center',
                transition: 'color 0.25s ease',
              }}
            >
              ◎&nbsp;&nbsp;save
            </button>
            {pick.url && (
              <a
                href={pick.url} target="_blank" rel="noopener noreferrer"
                style={{
                  fontFamily: "'Space Mono',monospace", fontSize: 9,
                  letterSpacing: '0.14em', textTransform: 'uppercase',
                  color: 'rgba(255,255,255,0.22)', textDecoration: 'none',
                  minHeight: 44, padding: '0 4px',
                  display: 'flex', alignItems: 'center',
                }}
              >
                ↗&nbsp;&nbsp;open
              </a>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
