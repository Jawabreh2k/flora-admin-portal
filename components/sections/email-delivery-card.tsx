'use client'

import { useEffect, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Check, Loader2, Save, Send, ShieldCheck, TriangleAlert } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Alert } from '@/components/ui/alert'
import { Card, Field, RadioGroup, Switch, TextInput } from '../editor/inputs'
import type {
  EmailProvider,
  EmailSettings,
  TestEmailResult,
  UpdateEmailSettingsInput,
} from '@/lib/email-settings/types'

async function fetchSettings(): Promise<EmailSettings> {
  const res = await fetch('/api/email-settings')
  if (!res.ok) throw new Error('Failed to load email settings')
  return res.json()
}

async function saveSettings(input: UpdateEmailSettingsInput): Promise<EmailSettings> {
  const res = await fetch('/api/email-settings', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  })
  if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error ?? 'Failed to save')
  return res.json()
}

async function sendTest(to: string): Promise<TestEmailResult> {
  const res = await fetch('/api/email-settings/test', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ to }),
  })
  if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error ?? 'Failed to send test')
  return res.json()
}

type FormState = {
  provider: EmailProvider
  fromAddress: string
  smtpHost: string
  smtpPort: number
  smtpUseSsl: boolean
  smtpUser: string
  smtpPassword: string
  resendApiKey: string
}

function toForm(s: EmailSettings): FormState {
  return {
    provider: s.provider,
    fromAddress: s.fromAddress,
    smtpHost: s.smtpHost ?? '',
    smtpPort: s.smtpPort,
    smtpUseSsl: s.smtpUseSsl,
    smtpUser: s.smtpUser ?? '',
    smtpPassword: '',
    resendApiKey: '',
  }
}

const PROVIDER_OPTIONS: { value: EmailProvider; label: string; hint: string }[] = [
  { value: 'LOG', label: 'Log only', hint: 'Writes the email to server logs — safe for local testing, sends nothing.' },
  { value: 'SMTP', label: 'SMTP', hint: 'Mailtrap, Gmail, or a corporate relay.' },
  { value: 'RESEND', label: 'Resend', hint: 'Deliver via the Resend HTTP API.' },
]

export function EmailDeliveryCard() {
  const queryClient = useQueryClient()
  const query = useQuery({ queryKey: ['email-settings'], queryFn: fetchSettings })
  const [form, setForm] = useState<FormState | null>(null)
  const [dirty, setDirty] = useState(false)
  const [testTo, setTestTo] = useState('')

  useEffect(() => {
    if (query.data) setForm(toForm(query.data))
  }, [query.data])

  const save = useMutation({
    mutationFn: (input: UpdateEmailSettingsInput) => saveSettings(input),
    onSuccess: (updated) => {
      queryClient.setQueryData(['email-settings'], updated)
      setDirty(false)
    },
  })

  const test = useMutation({ mutationFn: (to: string) => sendTest(to) })

  if (query.isLoading || !form) {
    return (
      <Card title="Email delivery" description="How notification emails are sent.">
        <div className="flex items-center gap-2 py-4 text-sm text-muted">
          <Loader2 className="size-4 animate-spin" />
          Loading…
        </div>
      </Card>
    )
  }

  if (query.isError) {
    return (
      <Card title="Email delivery" description="How notification emails are sent.">
        <Alert variant="danger">Couldn’t load email settings. Please refresh.</Alert>
      </Card>
    )
  }

  const data = query.data!
  const update = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((f) => (f ? { ...f, [key]: value } : f))
    setDirty(true)
  }

  function onSave() {
    if (!form) return
    save.mutate({
      provider: form.provider,
      fromAddress: form.fromAddress,
      smtpHost: form.smtpHost,
      smtpPort: form.smtpPort,
      smtpUseSsl: form.smtpUseSsl,
      smtpUser: form.smtpUser,
      // Empty = keep the stored secret (backend honours leave-blank-to-keep).
      smtpPassword: form.smtpPassword,
      resendApiKey: form.resendApiKey,
    })
  }

  return (
    <Card
      title="Email delivery"
      description="Controls how the server sends notification emails (contact inquiries, alerts). Secrets are encrypted and never shown again."
    >
      <div className="space-y-5">
        <Field label="Provider">
          <RadioGroup
            value={form.provider}
            onChange={(v) => update('provider', v as EmailProvider)}
            options={PROVIDER_OPTIONS}
          />
        </Field>

        <Field label="From address" hint="The sender shown on outgoing emails, e.g. Flora Group &lt;noreply@floragroup.net&gt;.">
          <TextInput
            value={form.fromAddress}
            onChange={(v) => update('fromAddress', v)}
            placeholder="Flora Group <noreply@floragroup.net>"
          />
        </Field>

        {form.provider === 'LOG' && (
          <Alert variant="info">
            Log mode writes each email to the API server logs instead of delivering it. Switch to SMTP or Resend to
            send for real.
          </Alert>
        )}

        {form.provider === 'SMTP' && (
          <div className="space-y-4 rounded-xl border border-border bg-surface-sunken/40 p-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="SMTP host">
                <TextInput value={form.smtpHost} onChange={(v) => update('smtpHost', v)} placeholder="sandbox.smtp.mailtrap.io" />
              </Field>
              <Field label="Port">
                <TextInput
                  type="number"
                  value={String(form.smtpPort)}
                  onChange={(v) => update('smtpPort', Number(v) || 0)}
                  placeholder="587"
                />
              </Field>
            </div>
            <Field label="Username">
              <TextInput value={form.smtpUser} onChange={(v) => update('smtpUser', v)} autoComplete="off" />
            </Field>
            <Field
              label="Password"
              hint={data.smtpPasswordSet ? 'A password is saved — leave blank to keep it.' : undefined}
            >
              <TextInput
                type="password"
                value={form.smtpPassword}
                onChange={(v) => update('smtpPassword', v)}
                autoComplete="new-password"
                placeholder={data.smtpPasswordSet ? '•••••••• (unchanged)' : ''}
              />
            </Field>
            <label className="flex cursor-pointer items-center justify-between gap-3 rounded-lg border border-border bg-surface px-4 py-2.5">
              <span className="text-sm text-foreground">Use SSL/TLS</span>
              <Switch checked={form.smtpUseSsl} onChange={() => update('smtpUseSsl', !form.smtpUseSsl)} aria-label="Use SSL/TLS" />
            </label>
          </div>
        )}

        {form.provider === 'RESEND' && (
          <div className="space-y-4 rounded-xl border border-border bg-surface-sunken/40 p-4">
            <Field
              label="Resend API key"
              hint={data.resendApiKeySet ? 'A key is saved — leave blank to keep it.' : 'Starts with re_…'}
            >
              <TextInput
                type="password"
                value={form.resendApiKey}
                onChange={(v) => update('resendApiKey', v)}
                autoComplete="new-password"
                placeholder={data.resendApiKeySet ? '•••••••• (unchanged)' : 're_…'}
              />
            </Field>
          </div>
        )}

        <div className="flex flex-wrap items-center gap-3 border-t border-border pt-4">
          <Button onClick={onSave} disabled={!dirty || save.isPending}>
            {save.isPending ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
            Save delivery settings
          </Button>
          {save.isSuccess && !dirty && (
            <span className="inline-flex items-center gap-1.5 text-sm text-success">
              <Check className="size-4" /> Saved
            </span>
          )}
          {save.isError && (
            <span className="inline-flex items-center gap-1.5 text-sm text-danger">
              <TriangleAlert className="size-4" /> {(save.error as Error).message}
            </span>
          )}
          {data.updatedBy && !save.isSuccess && (
            <span className="text-xs text-subtle">Last updated by {data.updatedBy}</span>
          )}
        </div>

        {/* Send a test */}
        <div className="rounded-xl border border-border bg-surface px-4 py-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="size-4 text-brand" />
            <p className="text-sm font-medium text-foreground">Send a test email</p>
          </div>
          <p className="mt-1 text-xs text-muted">
            Uses the saved settings. {dirty && 'Save your changes first.'}
          </p>
          <div className="mt-3 flex flex-col gap-2 sm:flex-row">
            <input
              type="email"
              value={testTo}
              onChange={(e) => setTestTo(e.target.value)}
              placeholder="you@example.com"
              autoComplete="off"
              className="h-10 flex-1 rounded-lg border border-border bg-surface px-3 text-sm shadow-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/15"
            />
            <Button
              variant="outline"
              onClick={() => test.mutate(testTo.trim())}
              disabled={dirty || test.isPending || !testTo.trim()}
            >
              {test.isPending ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
              Send test
            </Button>
          </div>

          {test.isError && (
            <Alert variant="danger" className="mt-3">
              {(test.error as Error).message}
            </Alert>
          )}
          {test.data && (
            <Alert variant={test.data.success ? 'success' : 'danger'} className="mt-3">
              {test.data.success
                ? test.data.provider === 'LOG'
                  ? 'Sent in Log mode — written to the API server logs (not delivered). Switch provider to deliver for real.'
                  : `Test email sent via ${test.data.provider}. Check the inbox.`
                : `Delivery failed: ${test.data.error ?? 'unknown error'}`}
            </Alert>
          )}
        </div>
      </div>
    </Card>
  )
}
