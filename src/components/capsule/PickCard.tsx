'use client'

import { motion } from 'framer-motion'
import type { Pick } from '@/types'
import { getCategoryColor, getCategoryDim } from '@/lib/utils'

interface PickCardProps {
  pick: Pick
  index?: number
}

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

export function PickCard({ pick, index = 0 }: PickCardProps) {
  const color = getCategoryColor(pick.category)
  const dim   = getCategoryDim(pick.category)

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
        width: 2, background: `${color}35`, borderRadius: 1,
      }} />

      <div style={{ paddingLeft: 20, paddingTop: 4, paddingBottom: 24 }}>

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

        {/* Category */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 14, color }}>
          <CategoryIcon category={pick.category} />
          <span style={{
            fontFamily: "'Space Mono',monospace",
            fontSize: 9, letterSpacing: '0.16em', textTransform: 'uppercase',
          }}>
            {pick.category}
          </span>
        </div>

        {/* Color bloom */}
        <div style={{
          position: 'absolute', top: '30%', left: '40%',
          width: 200, height: 200, borderRadius: '50%',
          background: dim, filter: 'blur(50px)',
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
            marginBottom: pick.source ? 8 : 0,
          }}>
            {pick.title}
          </h3>

          {/* Source */}
          {pick.source && (
            <p style={{
              fontFamily: "'Instrument Serif',serif",
              fontSize: 13, fontStyle: 'italic',
              color: 'rgba(240,235,225,0.38)',
              marginBottom: pick.note ? 16 : 0,
            }}>
              {pick.source}
            </p>
          )}

          {/* Note */}
          {pick.note && (
            <p style={{
              fontFamily: "'Instrument Serif',serif",
              fontSize: 14, fontStyle: 'italic', lineHeight: 1.7,
              color: 'rgba(240,235,225,0.5)',
              marginBottom: 16,
            }}>
              &ldquo;{pick.note}&rdquo;
            </p>
          )}

          {/* Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
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
                  style={{
                    fontFamily: "'Space Mono',monospace", fontSize: 9,
                    letterSpacing: '0.14em', textTransform: 'uppercase',
                    color: 'rgba(255,255,255,0.2)', textDecoration: 'none',
                  }}>
                  ↗&nbsp;&nbsp;open
                </a>
              </>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
