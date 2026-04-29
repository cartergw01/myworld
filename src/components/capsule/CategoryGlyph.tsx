import type { Category } from '@/types'

interface CategoryGlyphProps {
  category: Category
  size?: number
}

export function CategoryGlyph({ category, size = 14 }: CategoryGlyphProps) {
  const s = { width: size, height: size }

  if (category === 'Read') {
    return (
      <svg viewBox="0 0 14 14" {...s} fill="none" aria-hidden="true">
        <path d="M2 3a1 1 0 0 1 1-1h4.5v10H3a1 1 0 0 1-1-1V3z" stroke="currentColor" strokeWidth="1.3" />
        <path d="M7.5 2H11a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H7.5V2z" stroke="currentColor" strokeWidth="1.3" />
        <path d="M4.5 6h2" stroke="currentColor" strokeLinecap="round" strokeWidth="1.3" />
      </svg>
    )
  }

  if (category === 'Watch') {
    return (
      <svg viewBox="0 0 14 14" {...s} fill="none" aria-hidden="true">
        <circle cx="7" cy="7" r="5.3" stroke="currentColor" strokeWidth="1.3" />
        <path d="m5.5 5.2 4 1.8-4 1.8V5.2z" fill="currentColor" opacity="0.75" />
      </svg>
    )
  }

  if (category === 'Listen') {
    return (
      <svg viewBox="0 0 14 14" {...s} fill="none" aria-hidden="true">
        <path d="M9.5 2.5v7" stroke="currentColor" strokeLinecap="round" strokeWidth="1.3" />
        <path d="M9.5 2.5 5.5 4v7" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.3" />
        <circle cx="4" cy="11" r="1.5" stroke="currentColor" strokeWidth="1.3" />
        <circle cx="8" cy="10" r="1.5" stroke="currentColor" strokeWidth="1.3" />
      </svg>
    )
  }

  if (category === 'Idea') {
    return (
      <svg viewBox="0 0 14 14" {...s} fill="none" aria-hidden="true">
        <path
          d="M3 3.5A.5.5 0 0 1 3.5 3h7a.5.5 0 0 1 .5.5v5a.5.5 0 0 1-.5.5H7.5L5 11V9H3.5a.5.5 0 0 1-.5-.5v-5z"
          stroke="currentColor"
          strokeLinejoin="round"
          strokeWidth="1.3"
        />
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 14 14" {...s} fill="none" aria-hidden="true">
      <path d="m7 2 1.2 3.5H12L9 7.6l1.2 3.5L7 9.1l-3.2 2L5 7.6 2 5.5h3.8L7 2z" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.2" />
    </svg>
  )
}
