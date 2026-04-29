'use client'

import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import type { Capsule } from '@/types'
import { CosmicBackdrop } from '@/components/layout/CosmicBackdrop'
import { PickCard } from './PickCard'
import { formatWeekLabel, formatWeekShort, getCategoryColor } from '@/lib/utils'

interface CapsuleDetailProps {
  capsule: Capsule
}

export function CapsuleDetail({ capsule }: CapsuleDetailProps) {
  const router = useRouter()
  const sorted = [...capsule.picks].sort((a, b) => a.order - b.order)

  return (
    <div style={{
      minHeight: '100svh',
      background: 'linear-gradient(160deg,#0b0820 0%,#06091a 50%,#03060e 100%)',
      position: 'relative',
    }}>
      <CosmicBackdrop density="dense" />

      {/* Sticky header */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 10,
        padding: '14px 24px 12px',
        background: 'rgba(4,6,16,0.88)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
      }}>
        <div style={{ maxWidth: 512, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 14 }}>
          <button
            type="button"
            onClick={() => router.back()}
            style={{
              width: 28, height: 28, display: 'flex', alignItems: 'center',
              justifyContent: 'center', background: 'none', border: 'none',
              cursor: 'pointer', color: 'rgba(255,255,255,0.35)', padding: 0,
              flexShrink: 0,
            }}
          >
            <svg viewBox="0 0 14 14" width={14} height={14} fill="none">
              <path d="M9 2L4 7l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>

          <div style={{ flex: 1 }}>
            <div style={{
              fontFamily: "'Space Mono',monospace",
              fontSize: 9, letterSpacing: '0.16em', textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.22)',
            }}>
              {formatWeekLabel(capsule.weekStartDate)}
            </div>
          </div>

          {/* Category dots */}
          <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
            {sorted.map(p => (
              <div key={p.id} style={{
                width: 5, height: 5, borderRadius: '50%',
                background: getCategoryColor(p.category), opacity: 0.6,
              }} />
            ))}
          </div>
        </div>
      </div>

      {/* Week hero */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        style={{ padding: '36px 24px 28px', maxWidth: 512, margin: '0 auto', position: 'relative', zIndex: 1 }}
      >
        <div style={{
          fontFamily: "'Instrument Serif',serif",
          fontSize: 38, lineHeight: 1.05,
          color: '#F0EBE1', letterSpacing: '-0.01em',
          marginBottom: 10,
        }}>
          {formatWeekShort(capsule.weekStartDate)}
        </div>
        <div style={{
          fontFamily: "'Space Mono',monospace",
          fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.2)',
        }}>
          {sorted.length} items
          {capsule.publishedAt && (
            <span style={{ marginLeft: 12 }}>
              · shared {new Date(capsule.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </span>
          )}
        </div>
      </motion.div>

      {/* Divider */}
      <div style={{
        height: 1, background: 'rgba(255,255,255,0.06)',
        maxWidth: 512, margin: '0 auto 8px',
        position: 'relative', zIndex: 1,
      }} />

      {/* Items */}
      <div style={{
        padding: '8px 24px 120px',
        maxWidth: 512, margin: '0 auto',
        position: 'relative', zIndex: 1,
        display: 'flex', flexDirection: 'column', gap: 0,
      }}>
        {sorted.map((pick, i) => (
          <PickCard key={pick.id} pick={pick} index={i} />
        ))}
      </div>
    </div>
  )
}
