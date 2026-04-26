import { CreateStepper } from '@/components/create/CreateStepper'

export default function CreatePage() {
  return (
    <div className="min-h-screen" style={{ background: '#0A0A0A' }}>
      {/* Header */}
      <div
        className="sticky top-0 z-10 px-4 pt-12 pb-3"
        style={{
          background: 'rgba(10,10,10,0.92)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255,255,255,0.05)',
        }}
      >
        <div className="max-w-lg mx-auto">
          <h1 className="text-sm font-semibold" style={{ color: '#F0EBE1' }}>New capsule</h1>
        </div>
      </div>
      <CreateStepper />
    </div>
  )
}
