'use client'

import Link from 'next/link'
import { useStore } from '@/lib/store'
import { formatWeekLabel, getCategoryColor, getCategoryIcon, getWeekStartDate } from '@/lib/utils'

export default function ProfilePage() {
  const { currentUser, capsules } = useStore()

  const published = capsules.filter(c => c.status === 'published' && c.userId === currentUser.id)
  const totalPicks = published.reduce((acc, c) => acc + c.picks.length, 0)

  const thisWeek = getWeekStartDate()
  const thisWeekCapsule = capsules.find(c => c.weekStartDate === thisWeek)

  // Streak: consecutive weeks with published capsules
  let streak = 0
  const sorted = [...published].sort((a, b) => b.weekStartDate.localeCompare(a.weekStartDate))
  if (sorted.length > 0) {
    streak = 1
    for (let i = 1; i < sorted.length; i++) {
      const prev = new Date(sorted[i - 1].weekStartDate)
      const curr = new Date(sorted[i].weekStartDate)
      const diff = (prev.getTime() - curr.getTime()) / (1000 * 60 * 60 * 24)
      if (diff === 7) streak++
      else break
    }
  }

  const recentCapsules = sorted.slice(0, 3)

  return (
    <div className="min-h-screen pb-safe">
      {/* Header */}
      <div className="px-4 pt-12 pb-6">
        <div className="max-w-lg mx-auto">
          <h1 className="text-2xl font-semibold" style={{ color: '#F0EBE1' }}>
            Profile
          </h1>
        </div>
      </div>

      <div className="px-4 max-w-lg mx-auto space-y-5">
        {/* User card */}
        <div
          className="rounded-2xl p-5"
          style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.06)',
          }}
        >
          <div className="flex items-center gap-4 mb-4">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-14 h-14 rounded-2xl"
              style={{ border: '1px solid rgba(255,255,255,0.08)' }}
            />
            <div>
              <h2 className="text-lg font-semibold" style={{ color: '#F0EBE1' }}>
                {currentUser.name}
              </h2>
              <p className="text-sm" style={{ color: '#5A5A5A' }}>
                @{currentUser.username}
              </p>
            </div>
          </div>
          <p className="text-sm leading-relaxed" style={{ color: '#6B6B6B' }}>
            {currentUser.bio}
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: 'Capsules', value: published.length },
            { label: 'Total picks', value: totalPicks },
            { label: 'Week streak', value: streak },
          ].map(stat => (
            <div
              key={stat.label}
              className="rounded-2xl p-4 text-center"
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.06)',
              }}
            >
              <p
                className="text-2xl font-semibold mb-0.5"
                style={{ color: '#C8A882' }}
              >
                {stat.value}
              </p>
              <p className="text-xs" style={{ color: '#3A3A3A' }}>
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        {/* This week */}
        <div>
          <p className="text-xs font-medium tracking-wider uppercase mb-2" style={{ color: '#3A3A3A' }}>
            This week
          </p>
          {thisWeekCapsule ? (
            <Link href={`/capsule/${thisWeekCapsule.id}`} className="block">
              <div
                className="rounded-2xl p-4"
                style={{
                  background: 'rgba(200,168,130,0.06)',
                  border: '1px solid rgba(200,168,130,0.12)',
                }}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium" style={{ color: '#C8A882' }}>
                    ✓ Published
                  </span>
                  <span className="text-xs" style={{ color: 'rgba(200,168,130,0.4)' }}>
                    {thisWeekCapsule.picks.length} picks →
                  </span>
                </div>
                <div className="flex gap-1.5 mt-3">
                  {thisWeekCapsule.picks.map(pick => (
                    <span
                      key={pick.id}
                      className="text-xs w-7 h-7 rounded-lg flex items-center justify-center"
                      style={{ background: `${getCategoryColor(pick.category)}15` }}
                    >
                      {getCategoryIcon(pick.category)}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          ) : (
            <Link href="/create" className="block">
              <div
                className="rounded-2xl p-4 text-center"
                style={{
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px dashed rgba(255,255,255,0.07)',
                }}
              >
                <p className="text-sm" style={{ color: '#3A3A3A' }}>
                  No capsule yet this week. Start one →
                </p>
              </div>
            </Link>
          )}
        </div>

        {/* Recent capsules */}
        {recentCapsules.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-medium tracking-wider uppercase" style={{ color: '#3A3A3A' }}>
                Recent
              </p>
              <Link href="/archive" className="text-xs" style={{ color: '#5A5A5A' }}>
                View all →
              </Link>
            </div>
            <div className="space-y-2">
              {recentCapsules.map(capsule => (
                <Link key={capsule.id} href={`/capsule/${capsule.id}`} className="block">
                  <div
                    className="flex items-center justify-between px-4 py-3 rounded-xl"
                    style={{
                      background: 'rgba(255,255,255,0.02)',
                      border: '1px solid rgba(255,255,255,0.05)',
                    }}
                  >
                    <span className="text-sm" style={{ color: '#9A9A9A' }}>
                      {formatWeekLabel(capsule.weekStartDate)}
                    </span>
                    <div className="flex gap-1">
                      {capsule.picks.slice(0, 3).map(pick => (
                        <span key={pick.id} className="text-xs">
                          {getCategoryIcon(pick.category)}
                        </span>
                      ))}
                      {capsule.picks.length > 3 && (
                        <span className="text-xs" style={{ color: '#3A3A3A' }}>
                          +{capsule.picks.length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
