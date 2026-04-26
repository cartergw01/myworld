'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, PlusCircle, Archive, User } from 'lucide-react'
import { cn } from '@/lib/utils'

const tabs = [
  { href: '/home', label: 'Home', icon: Home },
  { href: '/create', label: 'Create', icon: PlusCircle },
  { href: '/archive', label: 'Archive', icon: Archive },
  { href: '/profile', label: 'Profile', icon: User },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50"
      style={{
        background: 'rgba(10,10,10,0.92)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
      }}
    >
      <div className="flex items-stretch max-w-lg mx-auto">
        {tabs.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href || pathname.startsWith(href + '/')
          const isCreate = href === '/create'

          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex-1 flex flex-col items-center justify-center gap-1 py-3 transition-all duration-200',
                isCreate && 'relative',
              )}
            >
              {isCreate ? (
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-200"
                  style={{
                    background: isActive
                      ? '#C8A882'
                      : 'rgba(200,168,130,0.15)',
                    border: '1px solid rgba(200,168,130,0.3)',
                  }}
                >
                  <Icon
                    size={22}
                    style={{ color: isActive ? '#0A0A0A' : '#C8A882' }}
                    strokeWidth={isActive ? 2.5 : 2}
                  />
                </div>
              ) : (
                <>
                  <Icon
                    size={22}
                    style={{
                      color: isActive ? '#C8A882' : 'rgba(255,255,255,0.35)',
                    }}
                    strokeWidth={isActive ? 2 : 1.5}
                  />
                  <span
                    className="text-[10px] font-medium tracking-wide"
                    style={{
                      color: isActive ? '#C8A882' : 'rgba(255,255,255,0.3)',
                    }}
                  >
                    {label}
                  </span>
                </>
              )}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
