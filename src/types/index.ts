export type Category = 'Read' | 'Watch' | 'Listen' | 'Idea' | 'Wild Card'

export interface User {
  id: string
  name: string
  username: string
  bio: string
  avatar: string
}

export interface Pick {
  id: string
  capsuleId: string
  category: Category
  title: string
  source: string
  url?: string
  thumbnail?: string
  note: string
  order: number
}

export interface Capsule {
  id: string
  userId: string
  weekStartDate: string // ISO date string, Monday of the week
  publishedAt?: string
  status: 'draft' | 'published'
  picks: Pick[]
}

export interface SavedItem {
  id: string
  userId: string
  pickId: string
  savedAt: string
}
