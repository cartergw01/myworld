'use client'

import Link from 'next/link'
import { useStore } from '@/lib/store'
import { CapsuleCard } from '@/components/capsule/CapsuleCard'
import { getWeekStartDate, formatWeekLabel, getCategoryColor, getCategoryIcon } from '@/lib/utils'
import { Plus } from 'lucide-react'

export default function HomePage() {
  const { currentUser, capsules } = useStore()

  const thisWeek = getWeekStartDate()
  const thisWeekCapsule = capsules.find(
    c => c.weekStartDate === thisWeek && c.userId === currentUser.id
  )
  const pastCapsules = capsules
    .filter(c => c.weekStartDate !== thisWeek && c.status === 'published')
    .sort((a, b) => b.weekStartDate.localeCompare(a.weekStartDate))
    .slice(0, 4)

  return (
    <div className="min-h-screen pb-safe">
      {/* Header */}
      <div className="px-4 pt-12 pb-6">
        <div className="max-w-lg mx-auto">
          <p className="text-xs font-medium tracking-wider uppercase mb-1" style={{ color: '#5A5A5A' }}>
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
          <h1 className="text-2xl font-semibold" style={{ color: '#F0EBE1' }}>
            This week
          </h1>
        </div>
      </div>

      <div className="px-4 max-w-lg mx-auto space-y-3">
        {/* This week status */}
        {thisWeekCapsule ? (
          <Link href={`/capsule/${thisWeekCapsule.id}`} className="block group">
            <div
              className="rounded-2xl p-4 transition-all duration-200"
              style={{
                background: 'rgba(200,168,130,0.06)',
                border: '1px solid rgba(200,168,130,0.15)',
              }}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium" style={{ color: '#C8A882' }}>
                  ✓ This week's capsule
                </span>
                <span className="text-xs" style={{ color: 'rgba(200,168,130,0.5)' }}>
                  {thisWeekCapsule.picks.length} picks →
                </span>
              </div>
              <p className="text-sm font-semibold" style={{ color: '#F0EBE1' }}>
                {thisWeekCapsule.picks[0]?.title}
              </p>
              <div className="flex gap-1.5 mt-3">
                {thisWeekCapsule.picks.map(pick => {
                  const color = getCategoryColor(pick.category)
                  return (
                    <span
                      key={pick.id}
                      className="text-sm w-7 h-7 rounded-lg flex items-center justify-center"
                      style={{ background: `${color}15` }}
                    >
                      {getCategoryIcon(pick.category)}
                    </span>
                  )
                })}
              </div>
            </div>
          </Link>
        ) : (
          <Link href="/create" className="block group">
            <div
              className="rounded-2xl p-5 text-center transition-all duration-200 group-hover:border-white/10"
              style={{
                background: 'rgba(255,255,255,0.02)',
                border: '1px dashed rgba(255,255,255,0.08)',
              }}
            >
              <div
                className="w-10 h-10 rounded-2xl flex items-center justify-center mx-auto mb-3"
                style={{ background: 'rgba(200,168,130,0.1)' }}
              >
                <Plus size={18} style={{ color: '#C8A882' }} />
              </div>
              <p className="text-sm font-medium mb-1" style={{ color: '#F0EBE1' }}>
                Start this week's capsule
              </p>
              <p className="text-xs" style={{ color: '#3A3A3A' }}>
                What captured your attention?
              </p>
            </div>
          </Link>
        )}

        {/* Divider */}
        {pastCapsules.length > 0 && (
          <div className="pt-4 pb-1">
            <p className="text-xs font-medium tracking-wider uppercase" style={{ color: '#3A3A3A' }}>
              Recent
            </p>
          </div>
        )}

        {/* Past capsules */}
        {pastCapsules.map((capsule, i) => (
          <CapsuleCard key={capsule.id} capsule={capsule} index={i} />
        ))}
      </div>
    </div>
  )
}
