'use client'

import { Info, Mail } from 'lucide-react'
import type { EditableContent, Locale, UiConfigPayload } from '@/lib/types'
import { LOCALES, LOCALE_LABELS } from '@/lib/types'
import { Card, Field, TextInput } from '../editor/inputs'
import { cn } from '@/lib/utils'

type ContentSetter = (
  locale: Locale,
  group: keyof EditableContent,
  key: string,
  value: string,
) => void

export function EmailSection({
  payload,
  locale,
  onLocaleChange,
  setContent,
}: {
  payload: UiConfigPayload
  locale: Locale
  onLocaleChange: (locale: Locale) => void
  setContent: ContentSetter
}) {
  const contact = payload.content[locale].contact
  const footer = payload.content[locale].footer
  const careersCta = payload.content[locale].careersCta

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {LOCALES.map((loc) => (
          <button
            key={loc}
            type="button"
            onClick={() => onLocaleChange(loc)}
            className={cn(
              'rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors',
              locale === loc
                ? 'border-brand bg-brand text-white'
                : 'border-border bg-surface text-muted hover:text-foreground',
            )}
          >
            {LOCALE_LABELS[loc]}
          </button>
        ))}
      </div>

      <Card
        title="Contact form delivery"
        description="Inquiries are sent to this inbox. The server reads this from published CMS config — visitors cannot override it."
      >
        <Field
          label="Recipient inbox"
          hint="Used when someone submits the contact form on the public site."
        >
          <TextInput
            value={contact.formRecipientEmail}
            onChange={(v) => setContent(locale, 'contact', 'formRecipientEmail', v)}
            placeholder="info@floragroup.net"
          />
        </Field>
      </Card>

      <Card
        title="Public display addresses"
        description="Shown on the site for mailto links — not used for form delivery."
      >
        <Field label="Footer email" hint="Displayed in the site footer.">
          <TextInput
            value={footer.email}
            onChange={(v) => setContent(locale, 'footer', 'email', v)}
            placeholder="info@floragroup.net"
          />
        </Field>
        <Field label="Careers HR email" hint="mailto link on the careers page CTA.">
          <TextInput
            value={careersCta.email}
            onChange={(v) => setContent(locale, 'careersCta', 'email', v)}
            placeholder="careers@floragroup.net"
          />
        </Field>
      </Card>

      <div className="flex gap-3 rounded-xl border border-border bg-surface-sunken/60 px-4 py-3.5">
        <Info className="mt-0.5 size-4 shrink-0 text-muted" />
        <div className="text-sm text-muted">
          <p className="font-medium text-foreground">Email delivery (server configuration)</p>
          <p className="mt-1 leading-relaxed">
            Resend API keys and SMTP credentials are configured by your hosting team in{' '}
            <code className="rounded bg-surface px-1 py-0.5 text-xs">appsettings.json</code> or user
            secrets — never stored in the CMS. If delivery fails, check{' '}
            <code className="rounded bg-surface px-1 py-0.5 text-xs">Contact:ResendApiKey</code> or{' '}
            <code className="rounded bg-surface px-1 py-0.5 text-xs">Contact:SmtpHost</code> on the API
            server.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 text-xs text-subtle">
        <Mail className="size-3.5" />
        Save &amp; publish for changes to take effect on the public site.
      </div>
    </div>
  )
}
