'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { CosmicBackdrop } from '@/components/layout/CosmicBackdrop'

export default function AuthPage() {
  const router = useRouter()
  const [mode, setMode] = useState<'signin' | 'signup'>('signup')
  const [loading, setLoading] = useState(false)

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => router.push('/home'), 600)
  }

  return (
    <div
      className="relative flex min-h-screen flex-col overflow-hidden bg-cosmic px-6 py-5"
    >
      <CosmicBackdrop />
      {/* Back */}
      <Link
        href="/"
        className="relative z-10 mb-8 flex h-9 w-9 items-center justify-center rounded-[6px] transition-colors"
        style={{
          background: 'rgba(255,255,255,0.035)',
          border: '1px solid rgba(255,255,255,0.07)',
          color: 'rgba(255,255,255,0.4)',
        }}
      >
        <ArrowLeft size={18} />
      </Link>

      <div className="relative z-10 mx-auto flex w-full max-w-sm flex-1 flex-col justify-center">
        {/* Title */}
        <h1
          className="font-serif-orbit mb-1 text-[2.35rem] leading-none"
          style={{ color: '#F0EBE1' }}
        >
          {mode === 'signup' ? 'Create your account' : 'Welcome back'}
        </h1>
        <p className="font-serif-orbit mb-8 text-base italic" style={{ color: 'rgba(240,235,225,0.42)' }}>
          {mode === 'signup'
            ? 'Save what is worth coming back to.'
            : 'Sign in to continue to Orbit.'}
        </p>

        {/* Mode toggle */}
        <div
          className="mb-6 flex rounded-[8px] p-1"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}
        >
          {(['signup', 'signin'] as const).map(m => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className="font-mono-orbit flex-1 rounded-[5px] py-2 text-[9px] uppercase tracking-[0.14em] transition-all duration-200"
              style={{
                background: mode === m ? 'rgba(255,255,255,0.07)' : 'transparent',
                color: mode === m ? '#F0EBE1' : 'rgba(255,255,255,0.3)',
              }}
            >
              {m === 'signup' ? 'Sign up' : 'Sign in'}
            </button>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={submit} className="space-y-3">
          {mode === 'signup' && (
            <input
              type="text"
              placeholder="Your name"
              required
              className="w-full rounded-[6px] px-4 py-3.5 text-sm outline-none placeholder:text-white/20 transition-colors"
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                color: '#F0EBE1',
              }}
            />
          )}
          <input
            type="email"
            placeholder="Email"
            required
            className="w-full rounded-[6px] px-4 py-3.5 text-sm outline-none placeholder:text-white/20"
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              color: '#F0EBE1',
            }}
          />
          <input
            type="password"
            placeholder="Password"
            required
            className="w-full rounded-[6px] px-4 py-3.5 text-sm outline-none placeholder:text-white/20"
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              color: '#F0EBE1',
            }}
          />

          <button
            type="submit"
            disabled={loading}
            className="font-mono-orbit w-full rounded-[6px] py-4 text-[10px] font-bold uppercase tracking-[0.14em] transition-all duration-200 disabled:opacity-60"
            style={{ background: '#C8A882', color: '#0A0A0A' }}
          >
            {loading ? '…' : mode === 'signup' ? 'Create account' : 'Sign in'}
          </button>
        </form>

        <p
          className="font-mono-orbit mt-8 text-center text-[9px] uppercase tracking-[0.12em]"
          style={{ color: 'rgba(255,255,255,0.15)' }}
        >
          By continuing, you agree to the terms and privacy policy.
        </p>
      </div>
    </div>
  )
}
