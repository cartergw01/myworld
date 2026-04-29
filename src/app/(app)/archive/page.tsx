'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { useStore } from '@/lib/store'
import { formatWeekLabel, formatWeekShort, getCategoryColor } from '@/lib/utils'

export default function ArchivePage() {
  const { capsules } = useStore()

  const published = capsules
    .filter(c => c.status === 'published')
    .sort((a, b) => b.weekStartDate.localeCompare(a.weekStartDate))

  return (
    <div style={{
      minHeight: '100svh',
      background: 'linear-gradient(160deg,#0b0820 0%,#06091a 50%,#03060e 100%)',
      padding: '56px 24px 120px',
      position: 'relative',
    }}>
      {/* Header */}
      <div style={{ maxWidth: 512, margin: '0 auto 36px' }}>
        <span style={{
          fontFamily: "'Space Mono',monospace",
          fontSize: 9, letterSpacing: '0.18em', textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.22)',
        }}>
          archive
        </span>
      </div>

      {/* Capsule list */}
      <div style={{ maxWidth: 512, margin: '0 auto', display: 'flex', flexDirection: 'column' }}>
        {published.length === 0 && (
          <p style={{
            fontFamily: "'Instrument Serif',serif",
            fontSize: 22, fontStyle: 'italic',
            color: 'rgba(240,235,225,0.28)', lineHeight: 1.4,
          }}>
            Nothing shared yet.
          </p>
        )}
        {published.map((capsule, i) => (
          <motion.div
            key={capsule.id}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.04, duration: 0.4 }}
          >
            <Link href={`/capsule/${capsule.id}`} style={{ textDecoration: 'none', display: 'block' }}>
              <div style={{
                padding: '16px 0 16px 16px',
                borderLeft: '2px solid rgba(255,255,255,0.07)',
                display: 'flex', alignItems: 'center', gap: 16,
              }}>
                <div style={{ flexShrink: 0, minWidth: 60 }}>
                  <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 8, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.2)' }}>
                    {formatWeekShort(capsule.weekStartDate)}
                  </div>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontFamily: "'Instrument Serif',serif", fontSize: 16,
                    color: 'rgba(240,235,225,0.65)',
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    marginBottom: 4,
                  }}>
                    {formatWeekLabel(capsule.weekStartDate)}
                  </div>
                  <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 8, letterSpacing: '0.1em', color: 'rgba(255,255,255,0.2)' }}>
                    {capsule.picks.length} items
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 5, flexShrink: 0 }}>
                  {capsule.picks.map(p => (
                    <div key={p.id} style={{
                      width: 5, height: 5, borderRadius: '50%',
                      background: getCategoryColor(p.category), opacity: 0.6,
                    }} />
                  ))}
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
