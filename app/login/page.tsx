'use client'

import { type FormEvent, useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { ArrowRight, Loader2, Lock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input, Label } from '@/components/ui/input'
import { Alert } from '@/components/ui/alert'

function FloraMark() {
  return (
    <div className="flex justify-center">
      <Image
        src="/images/flora-group-logo.png"
        alt="Flora Group W.L.L."
        width={280}
        height={84}
        priority
        className="max-h-24 w-auto object-contain"
      />
    </div>
  )
}

export default function LoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function onSubmit(e: FormEvent) {
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
    <main className="relative flex min-h-screen flex-col overflow-hidden bg-[#f8f3ec] px-4 py-8 text-foreground sm:px-6 lg:px-8">
      <div className="absolute inset-0 bg-[linear-gradient(115deg,#fffaf4_0%,#f8f3ec_42%,#f3e9df_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgb(74_14_23_/_0.055)_1px,transparent_1px),linear-gradient(to_bottom,rgb(74_14_23_/_0.055)_1px,transparent_1px)] [background-size:72px_72px] [mask-image:radial-gradient(ellipse_at_center,black_0%,transparent_72%)]" />
      <div className="absolute left-[10%] top-[12%] h-72 w-72 rounded-full bg-gold/20 blur-[90px]" />
      <div className="absolute bottom-[8%] right-[12%] h-80 w-80 rounded-full bg-brand/12 blur-[110px]" />
      <div className="absolute left-1/2 top-1/2 h-[32rem] w-[32rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/50" />

      <section className="relative mx-auto flex w-full max-w-[440px] flex-1 flex-col items-center justify-center">
        <div className="mb-10 w-full">
          <FloraMark />
        </div>

        <div className="relative w-full">
            <div className="absolute -inset-8 rounded-[3rem] bg-[radial-gradient(circle_at_50%_0%,rgb(255_255_255_/_0.82),transparent_58%)] blur-2xl" />
            <div className="relative overflow-hidden rounded-[2rem] border border-white/75 bg-white/58 p-px shadow-[0_30px_90px_-45px_rgb(74_14_23_/_0.55)] backdrop-blur-2xl">
              <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-white to-transparent" />
              <div className="relative rounded-[calc(2rem-1px)] bg-white/72 px-6 py-7 sm:px-8 sm:py-8">
                <div className="mb-8">
                  <h2 className="text-3xl font-semibold tracking-[-0.04em] text-foreground">
                    Welcome back
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-muted">
                    Sign in to continue managing the Flora CMS.
                  </p>
                </div>

                <form onSubmit={onSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="username" className="text-xs uppercase tracking-[0.18em] text-muted">
                      Username
                    </Label>
                    <Input
                      id="username"
                      type="text"
                      autoComplete="username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Enter your username"
                      className="h-12 rounded-2xl border-border-strong bg-white px-4 shadow-sm placeholder:text-subtle focus:border-brand focus:bg-white focus:ring-brand/20"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-xs uppercase tracking-[0.18em] text-muted">
                      Password
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      autoComplete="current-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="h-12 rounded-2xl border-border-strong bg-white px-4 shadow-sm placeholder:text-subtle focus:border-brand focus:bg-white focus:ring-brand/20"
                      required
                    />
                  </div>

                  {error && (
                    <Alert variant="danger" className="rounded-2xl">
                      <Lock className="mt-0.5 size-4 shrink-0" />
                      {error}
                    </Alert>
                  )}

                  <Button
                    type="submit"
                    className="mt-2 h-12 w-full rounded-2xl shadow-[0_16px_34px_-20px_rgb(74_14_23_/_0.75)]"
                    size="lg"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="size-4 animate-spin" />
                        Signing in
                      </>
                    ) : (
                      <>
                        Sign in
                        <ArrowRight className="size-4" />
                      </>
                    )}
                  </Button>
                </form>
              </div>
            </div>
          </div>
      </section>

      <p className="relative mt-8 w-full text-center text-xs text-subtle">
        © Flora Group. All rights reserved.
      </p>
    </main>
  )
}
