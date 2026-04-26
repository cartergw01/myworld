import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { Category } from "@/types"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatWeekLabel(weekStartDate: string): string {
  const date = new Date(weekStartDate + 'T00:00:00')
  const month = date.toLocaleDateString('en-US', { month: 'short' })
  const day = date.getDate()
  return `Week of ${month} ${day}`
}

export function formatWeekShort(weekStartDate: string): string {
  const date = new Date(weekStartDate + 'T00:00:00')
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export function getWeekStartDate(date: Date = new Date()): string {
  const d = new Date(date)
  const day = d.getDay()
  const diff = d.getDate() - day + (day === 0 ? -6 : 1)
  d.setDate(diff)
  return d.toISOString().split('T')[0]
}

export function getCategoryColor(category: Category): string {
  const colors: Record<Category, string> = {
    'Read': '#7BB3FF',
    'Watch': '#FF8A7B',
    'Listen': '#B07BFF',
    'Idea': '#7BFFB3',
    'Wild Card': '#FFD07B',
  }
  return colors[category]
}

export function getCategoryDim(category: Category): string {
  const colors: Record<Category, string> = {
    'Read': 'rgba(123,179,255,0.1)',
    'Watch': 'rgba(255,138,123,0.1)',
    'Listen': 'rgba(176,123,255,0.1)',
    'Idea': 'rgba(123,255,179,0.1)',
    'Wild Card': 'rgba(255,208,123,0.1)',
  }
  return colors[category]
}

export function getCategoryIcon(category: Category): string {
  const icons: Record<Category, string> = {
    'Read': '📖',
    'Watch': '🎬',
    'Listen': '🎧',
    'Idea': '💡',
    'Wild Card': '✦',
  }
  return icons[category]
}
