'use client'

import { createContext, useContext, useState, type ReactNode } from 'react'
import type { Capsule, User } from '@/types'
import { currentUser as seedUser, mockCapsules as seedCapsules } from '@/data/mock'

interface StoreContextValue {
  currentUser: User
  capsules: Capsule[]
  addCapsule: (capsule: Capsule) => void
  updateCapsule: (capsule: Capsule) => void
  getCapsuleById: (id: string) => Capsule | undefined
}

const StoreContext = createContext<StoreContextValue | null>(null)

export function StoreProvider({ children }: { children: ReactNode }) {
  const [capsules, setCapsules] = useState<Capsule[]>(seedCapsules)

  const addCapsule = (capsule: Capsule) => {
    setCapsules(prev => [capsule, ...prev])
  }

  const updateCapsule = (updated: Capsule) => {
    setCapsules(prev => prev.map(c => c.id === updated.id ? updated : c))
  }

  const getCapsuleById = (id: string) => capsules.find(c => c.id === id)

  return (
    <StoreContext.Provider value={{ currentUser: seedUser, capsules, addCapsule, updateCapsule, getCapsuleById }}>
      {children}
    </StoreContext.Provider>
  )
}

export function useStore() {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore must be used within StoreProvider')
  return ctx
}
