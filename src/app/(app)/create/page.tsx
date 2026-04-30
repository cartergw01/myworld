'use client'

import { Suspense, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { useStore } from '@/lib/store'
import { getWeekStartDate, formatWeekShort } from '@/lib/utils'
import { CreateStepper } from '@/components/create/CreateStepper'
import type { Capsule } from '@/types'

function DraftPrompt({ draft, onDismiss }: { draft: Capsule; onDismiss: () => void }) {
  const router = useRouter()
  const firstTitle = draft.picks[0]?.title

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      style={{
        minHeight: 'calc(100svh - 80px)',
        display: 'flex', flexDirection: 'column',
        justifyContent: 'center',
        padding: '0 28px',
        maxWidth: 512, margin: '0 auto', width: '100%',
        position: 'relative', zIndex: 1,
      }}
    >
      {/* Bloom */}
      <div style={{
        position: 'fixed', top: '-10%', left: '50%',
        transform: 'translateX(-50%)',
        width: '90vw', height: '60vh', borderRadius: '50%',
        backgroundColor: '#C8A882', opacity: 0.08,
        filter: 'blur(100px)', pointerEvents: 'none', zIndex: 0,
      }} />

      <div style={{ position: 'relative', zIndex: 1 }}>
        <p style={{
          fontFamily: "'Space Mono',monospace",
          fontSize: 8, letterSpacing: '0.18em', textTransform: 'uppercase',
          color: 'rgba(200,168,130,0.55)', marginBottom: 20,
        }}>
          draft · {formatWeekShort(draft.weekStartDate)}
        </p>

        <h2 style={{
          fontFamily: "'Instrument Serif',serif",
          fontSize: 36, lineHeight: 1.06, letterSpacing: '-0.01em',
          color: '#F0EBE1', marginBottom: 10,
        }}>
          You have a draft in progress.
        </h2>

        {firstTitle && (
          <p style={{
            fontFamily: "'Instrument Serif',serif",
            fontSize: 16, fontStyle: 'italic',
            color: 'rgba(240,235,225,0.4)', marginBottom: 6,
          }}>
            —&nbsp;{firstTitle}
            {draft.picks.length > 1 && ` and ${draft.picks.length - 1} more`}
          </p>
        )}

        <div style={{
          height: 1,
          background: 'linear-gradient(to right, rgba(200,168,130,0.2), transparent)',
          margin: '28px 0',
        }} />

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <button
            type="button"
            onClick={() => router.push(`/create?draft=${draft.id}`)}
            style={{
              fontFamily: "'Space Mono',monospace",
              fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase',
              background: '#C8A882', color: '#0A0A0A',
              border: 'none', borderRadius: 999,
              padding: '14px 28px',
              cursor: 'pointer', width: '100%',
              fontWeight: 700,
            }}
          >
            Continue draft
          </button>
          <button
            type="button"
            onClick={onDismiss}
            style={{
              fontFamily: "'Space Mono',monospace",
              fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase',
              background: 'none', color: 'rgba(255,255,255,0.28)',
              border: '1px solid rgba(255,255,255,0.1)', borderRadius: 999,
              padding: '13px 28px',
              cursor: 'pointer', width: '100%',
            }}
          >
            Start fresh
          </button>
        </div>
      </div>
    </motion.div>
  )
}

function CreateContent() {
  const searchParams = useSearchParams()
  const draftId = searchParams.get('draft')
  const { getCapsuleById, capsules, currentUser } = useStore()
  const [dismissed, setDismissed] = useState(false)

  const draft = draftId ? getCapsuleById(draftId) : undefined

  const thisWeekDraft = !draftId
    ? capsules.find(c =>
        c.status === 'draft' &&
        c.userId === currentUser.id &&
        c.weekStartDate === getWeekStartDate()
      )
    : undefined

  if (thisWeekDraft && !dismissed) {
    return <DraftPrompt draft={thisWeekDraft} onDismiss={() => setDismissed(true)} />
  }

  return <CreateStepper initialCapsule={draft} />
}

export default function CreatePage() {
  return (
    <div className="min-h-screen">
      <div
        className="pointer-events-none fixed left-0 right-0 top-0 z-20 px-6 pt-14"
        style={{ background: 'linear-gradient(to bottom, rgba(4,6,16,0.92) 0%, rgba(4,6,16,0.7) 60%, rgba(4,6,16,0) 100%)' }}
      >
        <div className="max-w-lg mx-auto pb-6">
          <p className="font-mono-orbit text-[8px] uppercase tracking-[0.2em]" style={{ color: 'rgba(240,235,225,0.35)' }}>
            This week
          </p>
        </div>
      </div>
      <Suspense fallback={null}>
        <CreateContent />
      </Suspense>
    </div>
  )
}
