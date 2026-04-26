'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import type { Capsule } from '@/types'
import { formatWeekLabel, getCategoryColor, getCategoryIcon } from '@/lib/utils'

interface CapsuleCardProps {
  capsule: Capsule
  index?: number
}

export function CapsuleCard({ capsule, index = 0 }: CapsuleCardProps) {
  const firstPick = capsule.picks[0]

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.06, ease: [0.25, 0.1, 0.25, 1] }}
    >
      <Link href={`/capsule/${capsule.id}`} className="block group">
        <div
          className="rounded-2xl p-4 transition-all duration-200 group-hover:border-white/10"
          style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.06)',
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <span
              className="text-xs font-medium tracking-wider uppercase"
              style={{ color: '#5A5A5A' }}
            >
              {formatWeekLabel(capsule.weekStartDate)}
            </span>
            <span
              className="text-xs"
              style={{ color: 'rgba(255,255,255,0.15)' }}
            >
              {capsule.picks.length} picks →
            </span>
          </div>

          {/* First pick preview */}
          {firstPick && (
            <div className="mb-4">
              <p
                className="text-base font-semibold leading-snug mb-0.5"
                style={{ color: '#F0EBE1' }}
              >
                {firstPick.title}
              </p>
              <p className="text-xs" style={{ color: '#5A5A5A' }}>
                {firstPick.source}
              </p>
            </div>
          )}

          {/* Category pills */}
          <div className="flex flex-wrap gap-2">
            {capsule.picks.map(pick => {
              const color = getCategoryColor(pick.category)
              const icon = getCategoryIcon(pick.category)
              return (
                <span
                  key={pick.id}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs"
                  style={{
                    background: `${color}12`,
                    color,
                    border: `1px solid ${color}20`,
                  }}
                >
                  <span className="text-[10px]">{icon}</span>
                  {pick.category}
                </span>
              )
            })}
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
