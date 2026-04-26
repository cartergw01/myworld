'use client'

import { motion } from 'framer-motion'
import { ExternalLink } from 'lucide-react'
import type { Pick } from '@/types'
import { getCategoryColor, getCategoryDim, getCategoryIcon } from '@/lib/utils'

interface PickCardProps {
  pick: Pick
  index?: number
}

export function PickCard({ pick, index = 0 }: PickCardProps) {
  const color = getCategoryColor(pick.category)
  const dim = getCategoryDim(pick.category)
  const icon = getCategoryIcon(pick.category)

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.07, ease: [0.25, 0.1, 0.25, 1] }}
      className="rounded-2xl overflow-hidden"
      style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      {/* Thumbnail */}
      {pick.thumbnail && (
        <div className="relative w-full h-44 overflow-hidden">
          <img
            src={pick.thumbnail}
            alt={pick.title}
            className="w-full h-full object-cover"
          />
          <div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(to bottom, transparent 50%, rgba(10,10,10,0.9) 100%)',
            }}
          />
          {/* Category badge over image */}
          <div className="absolute top-3 left-3">
            <span
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
              style={{
                background: 'rgba(10,10,10,0.7)',
                backdropFilter: 'blur(8px)',
                color,
                border: `1px solid ${color}30`,
              }}
            >
              <span>{icon}</span>
              {pick.category}
            </span>
          </div>
        </div>
      )}

      <div className="p-4">
        {/* Category badge (no thumbnail) */}
        {!pick.thumbnail && (
          <div className="mb-3">
            <span
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
              style={{ background: dim, color, border: `1px solid ${color}25` }}
            >
              <span>{icon}</span>
              {pick.category}
            </span>
          </div>
        )}

        {/* Title */}
        <h3
          className="text-base font-semibold leading-snug mb-1"
          style={{ color: '#F0EBE1' }}
        >
          {pick.title}
        </h3>

        {/* Source */}
        <p className="text-xs mb-3" style={{ color: '#5A5A5A' }}>
          {pick.source}
        </p>

        {/* Note */}
        <p
          className="text-sm leading-relaxed"
          style={{ color: '#9A9A9A' }}
        >
          {pick.note}
        </p>

        {/* Link */}
        {pick.url && (
          <a
            href={pick.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 mt-4 text-xs font-medium transition-opacity hover:opacity-80"
            style={{ color }}
          >
            Open link
            <ExternalLink size={12} />
          </a>
        )}
      </div>
    </motion.div>
  )
}
