'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const tabs = [
  {
    href: '/home',
    label: 'home',
    icon: (active: boolean) => (
      <svg viewBox="0 0 20 20" width={20} height={20} fill="none">
        <circle cx="10" cy="10" r="7.5" stroke="currentColor" strokeWidth={active ? 1.5 : 1.2} />
        <circle cx="10" cy="10" r="2.5" fill="currentColor" opacity={active ? 0.9 : 0.5} />
      </svg>
    ),
  },
  {
    href: '/create',
    label: 'add',
    icon: (active: boolean) => (
      <svg viewBox="0 0 20 20" width={20} height={20} fill="none">
        <circle cx="10" cy="10" r="7.5" stroke="currentColor" strokeWidth={active ? 1.5 : 1.2} />
        <path d="M10 7v6M7 10h6" stroke="currentColor" strokeWidth={active ? 1.6 : 1.3} strokeLinecap="round" />
      </svg>
    ),
  },
  {
    href: '/profile',
    label: 'me',
    icon: (active: boolean) => (
      <svg viewBox="0 0 20 20" width={20} height={20} fill="none">
        <circle cx="10" cy="7.5" r="3" stroke="currentColor" strokeWidth={active ? 1.5 : 1.2} />
        <path d="M3.5 18c0-3.59 2.91-6.5 6.5-6.5s6.5 2.91 6.5 6.5"
          stroke="currentColor" strokeWidth={active ? 1.5 : 1.2} strokeLinecap="round" />
      </svg>
    ),
  },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50"
      style={{
        background: 'rgba(4,6,16,0.94)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
      }}
    >
      <div className="flex items-stretch max-w-lg mx-auto">
        {tabs.map(({ href, label, icon }) => {
          const isActive = pathname === href || pathname.startsWith(href + '/')
          return (
            <Link
              key={href}
              href={href}
              className="flex-1 flex flex-col items-center justify-center gap-1.5 py-3 transition-colors duration-200"
              style={{ color: isActive ? 'rgba(240,235,225,0.85)' : 'rgba(255,255,255,0.22)' }}
            >
              {icon(isActive)}
              <span style={{
                fontFamily: "'Space Mono',monospace",
                fontSize: 8, letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: isActive ? 'rgba(240,235,225,0.6)' : 'rgba(255,255,255,0.18)',
              }}>
                {label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
