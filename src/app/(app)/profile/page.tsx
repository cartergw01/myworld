'use client'

import { Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { CategoryGlyph } from '@/components/capsule/CategoryGlyph'
import { useStore } from '@/lib/store'
import { formatWeekLabel, formatWeekShort, getCategoryColor, getWeekStartDate } from '@/lib/utils'
import type { Capsule } from '@/types'

function CapsuleTimelineRow({ capsule }: { capsule: Capsule }) {
  const firstPick = capsule.picks[0]

  return (
    <div className="relative pl-8">
      <div
        className="absolute left-[7px] top-0 h-full w-px"
        style={{ background: 'linear-gradient(to bottom, rgba(200,168,130,0.32), rgba(255,255,255,0.04))' }}
      />
      <div
        className="absolute left-0 top-2 h-[15px] w-[15px] rounded-full"
        style={{
          background: 'rgba(200,168,130,0.14)',
          border: '1px solid rgba(200,168,130,0.5)',
          boxShadow: '0 0 28px rgba(200,168,130,0.16)',
        }}
      />
      <Link href={`/capsule/${capsule.id}`} className="group block pb-8">
        <div className="flex items-start justify-between gap-5">
          <div className="min-w-0">
            <p className="font-mono-orbit mb-2 text-[9px] uppercase tracking-[0.16em]" style={{ color: 'rgba(255,255,255,0.22)' }}>
              {formatWeekLabel(capsule.weekStartDate)}
            </p>
            <h3 className="font-serif-orbit text-[1.9rem] leading-[1.02] transition-colors duration-200 group-hover:text-[#C8A882]" style={{ color: '#F0EBE1' }}>
              {firstPick?.title ?? 'Untitled share'}
            </h3>
            {firstPick?.source && (
              <p className="font-serif-orbit mt-1 text-sm italic" style={{ color: 'rgba(240,235,225,0.36)' }}>
                {firstPick.source}
              </p>
            )}
          </div>
          <div className="flex shrink-0 flex-col items-end gap-2 pt-1">
            <span className="font-mono-orbit text-[9px] uppercase tracking-[0.12em]" style={{ color: 'rgba(255,255,255,0.18)' }}>
              {capsule.picks.length} items
            </span>
            <div className="flex gap-1.5">
              {capsule.picks.map(pick => (
                <span
                  key={pick.id}
                  className="flex h-5 w-5 items-center justify-center"
                  style={{ color: getCategoryColor(pick.category) }}
                >
                  <CategoryGlyph category={pick.category} size={11} />
                </span>
              ))}
            </div>
          </div>
        </div>
      </Link>
    </div>
  )
}

function ProfileContent() {
  const { currentUser, capsules, getUserById } = useStore()
  const searchParams = useSearchParams()
  const activeTab = searchParams.get('tab') === 'archive' ? 'archive' : 'overview'
  const personId = searchParams.get('person')
  const viewedUser = personId ? getUserById(personId) ?? currentUser : currentUser
  const isCurrentUser = viewedUser.id === currentUser.id
  const baseProfileHref = isCurrentUser ? '/profile' : `/profile?person=${viewedUser.id}`
  const profileHref = (tab: 'overview' | 'archive') => {
    if (tab === 'overview') return baseProfileHref
    return isCurrentUser ? '/profile?tab=archive' : `/profile?person=${viewedUser.id}&tab=archive`
  }

  const published = capsules.filter(c => c.status === 'published' && c.userId === viewedUser.id)
  const totalPicks = published.reduce((acc, c) => acc + c.picks.length, 0)

  const thisWeek = getWeekStartDate()
  const thisWeekCapsule = capsules.find(c => c.weekStartDate === thisWeek && c.userId === viewedUser.id)

  const sorted = [...published].sort((a, b) => b.weekStartDate.localeCompare(a.weekStartDate))

  const profileSummary = sorted[0]
    ? `${published.length} weeks · ${totalPicks} items · latest ${formatWeekShort(sorted[0].weekStartDate)}`
    : 'Nothing shared yet'
  const pageTitle = isCurrentUser ? 'My Orbit' : `${viewedUser.name}'s Orbit`

  return (
    <div className="min-h-screen pb-safe">
      <div className="mx-auto max-w-lg px-5 pt-12">
        <div className="mb-9 flex items-center justify-between">
          <h1 className="font-serif-orbit text-[2.9rem] leading-none tracking-[-0.02em]" style={{ color: '#F0EBE1' }}>
            {activeTab === 'archive' ? 'Archive' : pageTitle}
          </h1>
          <div className="flex gap-5">
            {activeTab !== 'archive' && (
              <Link
                href={profileHref('archive')}
                className="font-mono-orbit border-b pb-1 text-[9px] uppercase tracking-[0.16em] transition-colors duration-200"
                style={{
                  borderColor: 'rgba(200,168,130,0.35)',
                  color: '#C8A882',
                }}
              >
                archive
              </Link>
            )}
          </div>
        </div>

        {activeTab === 'overview' ? (
          <div>
            <section className="profile-overview relative pb-8">
              <div
                className="pointer-events-none absolute left-1/2 top-36 h-80 w-80 -translate-x-1/2 rounded-full blur-[86px]"
                style={{ background: 'rgba(200,168,130,0.1)' }}
              />
              <div className="profile-hero relative mx-auto flex min-h-[390px] max-w-[360px] flex-col items-center justify-center text-center">
                <div className="profile-ring-large absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full" style={{ border: '1px dashed rgba(200,168,130,0.18)' }} />
                <div className="profile-ring-small absolute left-1/2 top-1/2 h-48 w-48 -translate-x-1/2 -translate-y-1/2 rounded-full" style={{ border: '1px solid rgba(255,255,255,0.07)' }} />
                <div className="relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={viewedUser.avatar}
                    alt={viewedUser.name}
                    className="mx-auto mb-5 h-[88px] w-[88px] rounded-full"
                    style={{ border: '1px solid rgba(200,168,130,0.42)', boxShadow: '0 0 42px rgba(200,168,130,0.16)' }}
                  />
                  <h2 className="profile-name font-serif-orbit text-[2.65rem] leading-none tracking-[-0.02em]" style={{ color: '#F0EBE1' }}>
                    {viewedUser.name}
                  </h2>
                  <p className="font-mono-orbit mt-2 text-[9px] uppercase tracking-[0.18em]" style={{ color: 'rgba(255,255,255,0.28)' }}>
                    @{viewedUser.username}
                  </p>
                  <p className="font-serif-orbit mx-auto mt-5 max-w-[260px] text-[1.08rem] italic leading-relaxed" style={{ color: 'rgba(240,235,225,0.48)' }}>
                    {viewedUser.bio}
                  </p>
                  <div className="mt-5 flex flex-wrap justify-center gap-x-3 gap-y-1">
                    {viewedUser.orbit?.map(tag => (
                      <span key={tag} className="font-mono-orbit text-[8px] uppercase tracking-[0.14em]" style={{ color: 'rgba(200,168,130,0.6)' }}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <p className="font-mono-orbit mx-auto max-w-[360px] text-center text-[9px] uppercase tracking-[0.14em]" style={{ color: 'rgba(240,235,225,0.26)' }}>
                {profileSummary}
              </p>
            </section>

            <section className="mt-8">
              <p className="font-mono-orbit mb-6 text-[9px] uppercase tracking-[0.16em]" style={{ color: 'rgba(255,255,255,0.2)' }}>
                This week
              </p>

              {thisWeekCapsule ? (
                <CapsuleTimelineRow capsule={thisWeekCapsule} />
              ) : isCurrentUser ? (
                <Link href="/create" className="block border-l pl-6" style={{ borderColor: 'rgba(200,168,130,0.3)' }}>
                  <p className="font-serif-orbit text-[2rem] leading-none" style={{ color: '#F0EBE1' }}>
                    Share this week
                  </p>
                  <p className="font-mono-orbit mt-2 text-[9px] uppercase tracking-[0.14em]" style={{ color: 'rgba(200,168,130,0.65)' }}>
                    Share something
                  </p>
                </Link>
              ) : (
                <div className="border-l pl-6" style={{ borderColor: 'rgba(200,168,130,0.3)' }}>
                  <p className="font-serif-orbit text-[2rem] leading-none" style={{ color: '#F0EBE1' }}>
                    Waiting for something new.
                  </p>
                  <p className="font-mono-orbit mt-2 text-[9px] uppercase tracking-[0.14em]" style={{ color: 'rgba(200,168,130,0.65)' }}>
                    Nothing shared this week
                  </p>
                </div>
              )}
            </section>
          </div>
        ) : (
          <section>
            <div className="mb-10">
              <p className="font-mono-orbit mb-3 text-[9px] uppercase tracking-[0.18em]" style={{ color: 'rgba(255,255,255,0.22)' }}>
                {pageTitle}
              </p>
              <h2 className="font-serif-orbit text-[2.55rem] leading-[0.98]" style={{ color: '#F0EBE1' }}>
                A living record of what held your attention.
              </h2>
            </div>

            {sorted.length === 0 ? (
              isCurrentUser ? (
                <Link href="/create" className="block border-l pl-6" style={{ borderColor: 'rgba(200,168,130,0.3)' }}>
                  <p className="font-serif-orbit text-[2rem] leading-none" style={{ color: '#F0EBE1' }}>
                    Nothing here yet.
                  </p>
                  <p className="font-mono-orbit mt-2 text-[9px] uppercase tracking-[0.14em]" style={{ color: 'rgba(200,168,130,0.65)' }}>
                    Share something
                  </p>
                </Link>
              ) : (
                <div className="border-l pl-6" style={{ borderColor: 'rgba(200,168,130,0.3)' }}>
                  <p className="font-serif-orbit text-[2rem] leading-none" style={{ color: '#F0EBE1' }}>
                    Nothing here yet.
                  </p>
                  <p className="font-mono-orbit mt-2 text-[9px] uppercase tracking-[0.14em]" style={{ color: 'rgba(200,168,130,0.65)' }}>
                    Nothing shared yet
                  </p>
                </div>
              )
            ) : (
              sorted.map(capsule => (
                <CapsuleTimelineRow key={capsule.id} capsule={capsule} />
              ))
            )}
          </section>
        )}
      </div>
    </div>
  )
}

export default function ProfilePage() {
  return (
    <Suspense fallback={null}>
      <ProfileContent />
    </Suspense>
  )
}
