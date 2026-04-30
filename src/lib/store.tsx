'use client'

import { createContext, useContext, useState, type ReactNode } from 'react'
import type { Capsule, User, SavedItem } from '@/types'
import { currentUser as seedUser, mockCapsules as seedCapsules, mockUsers as seedUsers } from '@/data/mock'

interface StoreContextValue {
  currentUser: User
  users: User[]
  capsules: Capsule[]
  savedItems: SavedItem[]
  following: string[]
  resonated: ReadonlySet<string>
  addCapsule: (capsule: Capsule) => void
  updateCapsule: (capsule: Capsule) => void
  getCapsuleById: (id: string) => Capsule | undefined
  getUserById: (id: string) => User | undefined
  saveItem: (pickId: string) => void
  unsaveItem: (pickId: string) => void
  isItemSaved: (pickId: string) => boolean
  follow: (userId: string) => void
  unfollow: (userId: string) => void
  isFollowing: (userId: string) => boolean
  resonate: (pickId: string) => void
  unresonate: (pickId: string) => void
  isResonated: (pickId: string) => boolean
}

const StoreContext = createContext<StoreContextValue | null>(null)

export function StoreProvider({ children }: { children: ReactNode }) {
  const [capsules, setCapsules] = useState<Capsule[]>(seedCapsules)
  const [savedItems, setSavedItems] = useState<SavedItem[]>([])
  const [following, setFollowing] = useState<string[]>(['user_maya', 'user_jules', 'user_leo', 'user_nia', 'user_priya'])
  const [resonated, setResonated] = useState<ReadonlySet<string>>(new Set())

  const addCapsule = (capsule: Capsule) => {
    setCapsules(prev => [capsule, ...prev])
  }

  const updateCapsule = (updated: Capsule) => {
    setCapsules(prev => prev.map(c => c.id === updated.id ? updated : c))
  }

  const getCapsuleById = (id: string) => capsules.find(c => c.id === id)
  const getUserById = (id: string) => seedUsers.find(u => u.id === id)

  const saveItem = (pickId: string) => {
    setSavedItems(prev => [...prev, {
      id: Math.random().toString(36).slice(2, 10),
      userId: seedUser.id,
      pickId,
      savedAt: new Date().toISOString(),
    }])
  }

  const unsaveItem = (pickId: string) => {
    setSavedItems(prev => prev.filter(s => s.pickId !== pickId))
  }

  const isItemSaved = (pickId: string) => savedItems.some(s => s.pickId === pickId)

  const follow = (userId: string) => {
    setFollowing(prev => prev.includes(userId) ? prev : [...prev, userId])
  }

  const unfollow = (userId: string) => {
    setFollowing(prev => prev.filter(id => id !== userId))
  }

  const isFollowing = (userId: string) => following.includes(userId)

  const resonate = (pickId: string) => {
    setResonated(prev => new Set([...prev, pickId]))
  }

  const unresonate = (pickId: string) => {
    setResonated(prev => {
      const next = new Set(prev)
      next.delete(pickId)
      return next
    })
  }

  const isResonated = (pickId: string) => resonated.has(pickId)

  return (
    <StoreContext.Provider value={{
      currentUser: seedUser,
      users: seedUsers,
      capsules,
      savedItems,
      following,
      resonated,
      addCapsule,
      updateCapsule,
      getCapsuleById,
      getUserById,
      saveItem,
      unsaveItem,
      isItemSaved,
      follow,
      unfollow,
      isFollowing,
      resonate,
      unresonate,
      isResonated,
    }}>
      {children}
    </StoreContext.Provider>
  )
}

export function useStore() {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore must be used within StoreProvider')
  return ctx
}
