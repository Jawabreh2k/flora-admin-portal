'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, Lock, Shield } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input, Label, FormError } from '@/components/ui/input'
import { Alert } from '@/components/ui/alert'

export default function LoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const res = await fetch('/api/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        setError(data.error ?? 'Invalid credentials. Please try again.')
        return
      }
      router.replace('/dashboard')
      router.refresh()
    } catch {
      setError('Unable to connect. Is the portal running?')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="grid min-h-screen lg:grid-cols-2">
      {/* Brand panel */}
      <div className="relative hidden flex-col justify-between overflow-hidden bg-brand p-12 text-white lg:flex">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--color-gold)_0%,_transparent_50%)] opacity-20" />
        <div className="absolute -end-24 -top-24 size-96 rounded-full bg-gold/10 blur-3xl" />
        <div className="absolute -bottom-32 -start-32 size-80 rounded-full bg-white/5 blur-2xl" />

        <div className="relative">
          <span className="grid size-12 place-items-center rounded-xl bg-white/15 text-lg font-bold backdrop-blur-sm">
            F
          </span>
        </div>

        <div className="relative space-y-6">
          <h1 className="text-4xl font-semibold leading-tight tracking-tight">
            Manage your website
            <br />
            <span className="text-gold">with confidence.</span>
          </h1>
          <p className="max-w-md text-base leading-relaxed text-white/70">
            Update content, customize your brand, and manage job postings — all from one
            centralized admin portal.
          </p>
          <div className="flex items-center gap-3 text-sm text-white/60">
            <Shield className="size-4" />
            Secure admin access for Flora Group
          </div>
        </div>

        <p className="relative text-xs text-white/40">© Flora Group. All rights reserved.</p>
      </div>

      {/* Form panel */}
      <div className="flex items-center justify-center bg-surface-sunken p-6 sm:p-12">
        <div className="w-full max-w-[400px]">
          <div className="mb-8 lg:hidden">
            <span className="grid size-10 place-items-center rounded-xl bg-brand text-sm font-bold text-white">
              F
            </span>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-semibold tracking-tight text-foreground">Welcome back</h2>
            <p className="mt-1.5 text-sm text-muted">Sign in to the Flora CMS admin portal.</p>
          </div>

          <form onSubmit={onSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
            </div>

            {error && (
              <Alert variant="danger">
                <Lock className="mt-0.5 size-4 shrink-0" />
                {error}
              </Alert>
            )}

            <Button type="submit" className="w-full" size="lg" disabled={loading}>
              {loading && <Loader2 className="size-4 animate-spin" />}
              {loading ? 'Signing in…' : 'Sign in'}
            </Button>
          </form>
        </div>
      </div>
    </main>
  )
}
