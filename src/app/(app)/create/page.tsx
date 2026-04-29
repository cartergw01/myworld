import { CreateStepper } from '@/components/create/CreateStepper'

export default function CreatePage() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <div
        className="pointer-events-none fixed left-0 right-0 top-0 z-20 px-5 pt-12"
        style={{
          background: 'linear-gradient(to bottom, rgba(4,6,16,0.88), rgba(4,6,16,0))',
        }}
      >
        <div className="max-w-lg mx-auto">
          <h1 className="font-mono-orbit text-[9px] uppercase tracking-[0.18em]" style={{ color: 'rgba(240,235,225,0.58)' }}>
            Share
          </h1>
        </div>
      </div>
      <CreateStepper />
    </div>
  )
}
