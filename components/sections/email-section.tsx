'use client'

import { Mail } from 'lucide-react'
import type { EditableContent, Locale, UiConfigPayload } from '@/lib/types'
import { LOCALES, LOCALE_LABELS } from '@/lib/types'
import { Card, Field, TextInput } from '../editor/inputs'
import { EmailDeliveryCard } from './email-delivery-card'
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

      <EmailDeliveryCard />

      <div className="flex items-center gap-2 text-xs text-subtle">
        <Mail className="size-3.5" />
        Recipient &amp; display addresses save with the main Save button. Email delivery has its own Save above.
      </div>
    </div>
  )
}
