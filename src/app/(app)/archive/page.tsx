'use client'

import { useStore } from '@/lib/store'
import { CapsuleCard } from '@/components/capsule/CapsuleCard'

export default function ArchivePage() {
  const { capsules } = useStore()

  const published = capsules
    .filter(c => c.status === 'published')
    .sort((a, b) => b.weekStartDate.localeCompare(a.weekStartDate))

  return (
    <div className="min-h-screen pb-safe">
      {/* Header */}
      <div className="px-4 pt-12 pb-6">
        <div className="max-w-lg mx-auto">
          <h1 className="text-2xl font-semibold mb-1" style={{ color: '#F0EBE1' }}>
            Archive
          </h1>
          <p className="text-sm" style={{ color: '#5A5A5A' }}>
            {published.length} week{published.length !== 1 ? 's' : ''} of Orbit
          </p>
        </div>
      </div>

      <div className="px-4 max-w-lg mx-auto space-y-3">
        {published.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-sm" style={{ color: '#3A3A3A' }}>
              No capsules yet. Start with this week.
            </p>
          </div>
        ) : (
          published.map((capsule, i) => (
            <CapsuleCard key={capsule.id} capsule={capsule} index={i} />
          ))
        )}
      </div>
    </div>
  )
}
