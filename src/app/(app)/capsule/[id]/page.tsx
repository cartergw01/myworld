'use client'

import { use } from 'react'
import { useStore } from '@/lib/store'
import { CapsuleDetail } from '@/components/capsule/CapsuleDetail'

export default function CapsulePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { getCapsuleById } = useStore()
  const capsule = getCapsuleById(id)

  if (!capsule) {
    return (
      <div className="min-h-screen flex items-center justify-center pb-safe">
        <p className="font-serif-orbit text-lg italic" style={{ color: 'rgba(240,235,225,0.32)' }}>
          This share could not be found.
        </p>
      </div>
    )
  }

  return <CapsuleDetail capsule={capsule} />
}
