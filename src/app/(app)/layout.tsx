import { StoreProvider } from '@/lib/store'
import { BottomNav } from '@/components/layout/BottomNav'
import { CosmicBackdrop } from '@/components/layout/CosmicBackdrop'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <StoreProvider>
      <div className="relative min-h-screen overflow-x-hidden bg-cosmic">
        <CosmicBackdrop />
        <div className="relative z-10">
          {children}
        </div>
        <BottomNav />
      </div>
    </StoreProvider>
  )
}
