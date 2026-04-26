import Link from 'next/link'
import { ProductPreview } from '@/components/landing/ProductPreview'

export default function LandingPage() {
  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: '#0A0A0A' }}
    >
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-5">
        <span
          className="text-lg font-semibold tracking-tight"
          style={{ color: '#F0EBE1' }}
        >
          Orbit
        </span>
        <Link
          href="/auth"
          className="text-sm font-medium transition-opacity hover:opacity-70"
          style={{ color: 'rgba(255,255,255,0.4)' }}
        >
          Sign in
        </Link>
      </nav>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 pt-8 pb-16">
        <div className="max-w-md w-full text-center">
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
              Weekly ritual
            </span>
          </div>

          {/* Headline */}
          <h1
            className="text-[2.2rem] font-semibold leading-[1.1] tracking-tight mb-4"
            style={{ color: '#F0EBE1' }}
          >
            Share the best things that shaped your week.
          </h1>

          {/* Subheadline */}
          <p
            className="text-base leading-relaxed mb-8 max-w-sm mx-auto"
            style={{ color: '#6B6B6B' }}
          >
            Orbit is a weekly ritual for tracking what you read, watched, heard, and couldn't stop thinking about.
          </p>

          {/* CTAs */}
          <div className="flex flex-col gap-3 w-full max-w-xs mx-auto mb-12">
            <Link
              href="/auth"
              className="w-full py-4 rounded-2xl text-sm font-semibold text-center transition-all duration-200 hover:opacity-90 active:scale-[0.98]"
              style={{
                background: '#C8A882',
                color: '#0A0A0A',
              }}
            >
              Get started
            </Link>
            <Link
              href="/home"
              className="w-full py-4 rounded-2xl text-sm font-medium text-center transition-all duration-200"
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                color: 'rgba(255,255,255,0.5)',
              }}
            >
              Preview the app →
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
        className="py-6 px-6 text-center text-xs"
        style={{ color: 'rgba(255,255,255,0.15)', borderTop: '1px solid rgba(255,255,255,0.04)' }}
      >
        Orbit — taste over volume
      </footer>
    </div>
  )
}
