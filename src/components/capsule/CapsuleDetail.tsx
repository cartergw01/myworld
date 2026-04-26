'use client'

import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import type { Capsule } from '@/types'
import { PickCard } from './PickCard'
import { formatWeekLabel } from '@/lib/utils'

interface CapsuleDetailProps {
  capsule: Capsule
}

export function CapsuleDetail({ capsule }: CapsuleDetailProps) {
  const router = useRouter()
  const sorted = [...capsule.picks].sort((a, b) => a.order - b.order)

  return (
    <div className="min-h-screen pb-safe">
      {/* Header */}
      <div
        className="sticky top-0 z-10 px-4 pt-4 pb-3"
        style={{
          background: 'rgba(10,10,10,0.92)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255,255,255,0.05)',
        }}
      >
        <div className="max-w-lg mx-auto flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="w-8 h-8 rounded-full flex items-center justify-center transition-colors"
            style={{ color: 'rgba(255,255,255,0.5)' }}
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-sm font-semibold" style={{ color: '#F0EBE1' }}>
              {formatWeekLabel(capsule.weekStartDate)}
            </h1>
            <p className="text-xs" style={{ color: '#5A5A5A' }}>
              {capsule.picks.length} picks
            </p>
          </div>
        </div>
      </div>

      {/* Picks */}
      <div className="px-4 pt-4 max-w-lg mx-auto space-y-3">
        {sorted.map((pick, i) => (
          <PickCard key={pick.id} pick={pick} index={i} />
        ))}
      </div>

      {/* Footer space */}
      <div className="h-6" />
    </div>
  )
}
