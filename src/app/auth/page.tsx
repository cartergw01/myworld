'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'

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
      className="min-h-screen flex flex-col px-6 py-5"
      style={{ background: '#0A0A0A' }}
    >
      {/* Back */}
      <Link
        href="/"
        className="w-9 h-9 rounded-full flex items-center justify-center mb-8 transition-colors"
        style={{ color: 'rgba(255,255,255,0.4)' }}
      >
        <ArrowLeft size={18} />
      </Link>

      <div className="flex-1 flex flex-col justify-center max-w-sm w-full mx-auto">
        {/* Title */}
        <h1
          className="text-2xl font-semibold mb-1"
          style={{ color: '#F0EBE1' }}
        >
          {mode === 'signup' ? 'Create your account' : 'Welcome back'}
        </h1>
        <p className="text-sm mb-8" style={{ color: '#5A5A5A' }}>
          {mode === 'signup'
            ? 'Start your weekly ritual.'
            : 'Sign in to continue to Orbit.'}
        </p>

        {/* Mode toggle */}
        <div
          className="flex rounded-xl p-1 mb-6"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}
        >
          {(['signup', 'signin'] as const).map(m => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className="flex-1 py-2 rounded-lg text-sm font-medium transition-all duration-200"
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
              className="w-full px-4 py-3.5 rounded-xl text-sm outline-none placeholder:text-white/20 transition-colors"
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
            className="w-full px-4 py-3.5 rounded-xl text-sm outline-none placeholder:text-white/20"
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
            className="w-full px-4 py-3.5 rounded-xl text-sm outline-none placeholder:text-white/20"
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              color: '#F0EBE1',
            }}
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-2xl text-sm font-semibold transition-all duration-200 disabled:opacity-60"
            style={{ background: '#C8A882', color: '#0A0A0A' }}
          >
            {loading ? '…' : mode === 'signup' ? 'Create account' : 'Sign in'}
          </button>
        </form>

        <p
          className="text-center text-xs mt-8"
          style={{ color: 'rgba(255,255,255,0.15)' }}
        >
          By continuing you agree to the terms and privacy policy.
        </p>
      </div>
    </div>
  )
}
