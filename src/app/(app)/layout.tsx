import { StoreProvider } from '@/lib/store'
import { BottomNav } from '@/components/layout/BottomNav'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <StoreProvider>
      <div className="min-h-screen" style={{ background: '#0A0A0A' }}>
        {children}
        <BottomNav />
      </div>
    </StoreProvider>
  )
}
