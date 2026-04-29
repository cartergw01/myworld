import Link from 'next/link'
import { ProductPreview } from '@/components/landing/ProductPreview'
import { CosmicBackdrop } from '@/components/layout/CosmicBackdrop'

export default function LandingPage() {
  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-cosmic">
      <CosmicBackdrop density="dense" />
      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-5">
        <span
          className="font-mono-orbit text-[10px] font-bold uppercase tracking-[0.2em]"
          style={{ color: '#F0EBE1' }}
        >
          Orbit
        </span>
        <Link
          href="/auth"
          className="font-mono-orbit text-[9px] uppercase tracking-[0.16em] transition-opacity hover:opacity-70"
          style={{ color: 'rgba(255,255,255,0.32)' }}
        >
          Sign in
        </Link>
      </nav>

      {/* Hero */}
      <main className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 pb-16 pt-8">
        <div className="w-full max-w-md text-center">
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 mb-6">
            <div
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: '#C8A882' }}
            />
            <span
              className="text-xs font-medium tracking-widest uppercase"
              style={{ color: 'rgba(200,168,130,0.7)' }}
            >
              Shared weekly
            </span>
          </div>

          {/* Headline */}
          <h1
            className="font-serif-orbit mb-4 text-[3rem] leading-[0.98]"
            style={{ color: '#F0EBE1' }}
          >
            Share the best things that shaped your week.
          </h1>

          {/* Subheadline */}
          <p
            className="font-serif-orbit mx-auto mb-8 max-w-sm text-lg italic leading-relaxed"
            style={{ color: 'rgba(240,235,225,0.46)' }}
          >
            Orbit helps you keep track of what you read, watched, heard, and could not stop thinking about.
          </p>

          {/* CTAs */}
          <div className="flex flex-col gap-3 w-full max-w-xs mx-auto mb-12">
            <Link
              href="/auth"
              className="font-mono-orbit w-full rounded-[6px] py-4 text-center text-[10px] font-bold uppercase tracking-[0.14em] transition-all duration-200 hover:opacity-90 active:scale-[0.98]"
              style={{
                background: '#C8A882',
                color: '#0A0A0A',
              }}
            >
              Get started
            </Link>
            <Link
              href="/home"
              className="font-mono-orbit w-full rounded-[6px] py-4 text-center text-[10px] uppercase tracking-[0.14em] transition-all duration-200"
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                color: 'rgba(255,255,255,0.5)',
              }}
            >
              Preview the app
            </Link>
          </div>

          {/* Product preview */}
          <div className="relative">
            <div
              className="absolute inset-0 rounded-3xl blur-2xl opacity-20 scale-90"
              style={{ background: 'radial-gradient(circle, #C8A882 0%, transparent 70%)' }}
            />
            <ProductPreview />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer
        className="font-mono-orbit relative z-10 px-6 py-6 text-center text-[9px] uppercase tracking-[0.18em]"
        style={{ color: 'rgba(255,255,255,0.15)', borderTop: '1px solid rgba(255,255,255,0.04)' }}
      >
        Orbit / attention over volume
      </footer>
    </div>
  )
}
