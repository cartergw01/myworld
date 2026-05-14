'use client'

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import type { Capsule, Notification, User, SavedItem } from '@/types'
import { currentUser as seedUser, mockCapsules as seedCapsules, mockUsers as seedUsers, mockNotifications as seedNotifications } from '@/data/mock'

interface StoreContextValue {
  currentUser: User
  users: User[]
  capsules: Capsule[]
  savedItems: SavedItem[]
  following: string[]
  resonated: ReadonlySet<string>
  notifications: Notification[]
  openedCapsuleIds: ReadonlySet<string>
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
  markCapsuleOpened: (capsuleId: string) => void
  addNotification: (n: Notification) => void
}

const StoreContext = createContext<StoreContextValue | null>(null)

function loadStorage<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback
  try {
    const v = localStorage.getItem(key)
    return v !== null ? (JSON.parse(v) as T) : fallback
  } catch {
    return fallback
  }
}

function saveStorage<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return
  try { localStorage.setItem(key, JSON.stringify(value)) } catch {}
}

const DEFAULT_FOLLOWING = ['user_maya', 'user_jules', 'user_leo', 'user_nia', 'user_priya']

export function StoreProvider({ children }: { children: ReactNode }) {
  const [userCapsules, setUserCapsules] = useState<Capsule[]>(() =>
    loadStorage('mw_userCapsules', [])
  )
  const [savedItems, setSavedItems] = useState<SavedItem[]>(() =>
    loadStorage('mw_savedItems', [])
  )
  const [following, setFollowing] = useState<string[]>(() =>
    loadStorage('mw_following', DEFAULT_FOLLOWING)
  )
  const [resonated, setResonated] = useState<ReadonlySet<string>>(() =>
    new Set(loadStorage<string[]>('mw_resonated', []))
  )
  const [openedCapsuleIds, setOpenedCapsuleIds] = useState<ReadonlySet<string>>(() =>
    new Set(loadStorage<string[]>('mw_openedIds', []))
  )
  const [notifications, setNotifications] = useState<Notification[]>(() =>
    loadStorage('mw_notifications', seedNotifications)
  )

  useEffect(() => { saveStorage('mw_userCapsules', userCapsules) }, [userCapsules])
  useEffect(() => { saveStorage('mw_savedItems', savedItems) }, [savedItems])
  useEffect(() => { saveStorage('mw_following', following) }, [following])
  useEffect(() => { saveStorage('mw_resonated', [...resonated]) }, [resonated])
  useEffect(() => { saveStorage('mw_openedIds', [...openedCapsuleIds]) }, [openedCapsuleIds])
  useEffect(() => { saveStorage('mw_notifications', notifications) }, [notifications])

  const capsules = [...seedCapsules, ...userCapsules]

  const addCapsule = (capsule: Capsule) => {
    setUserCapsules(prev => [capsule, ...prev.filter(c => c.id !== capsule.id)])
  }

  const updateCapsule = (updated: Capsule) => {
    setUserCapsules(prev => prev.map(c => c.id === updated.id ? updated : c))
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

  const markCapsuleOpened = (capsuleId: string) => {
    setOpenedCapsuleIds(prev => new Set([...prev, capsuleId]))
  }

  const addNotification = (n: Notification) => {
    setNotifications(prev => [n, ...prev])
  }

  return (
    <StoreContext.Provider value={{
      currentUser: seedUser,
      users: seedUsers,
      capsules,
      savedItems,
      following,
      resonated,
      notifications,
      openedCapsuleIds,
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
      markCapsuleOpened,
      addNotification,
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
