'use client'

import { Plus, Trash2 } from 'lucide-react'
import type { Social, SocialLink, SocialPlatform, UiConfigPayload } from '@/lib/types'
import { SOCIAL_PLATFORMS } from '@/lib/types'
import { Card, Field, TextInput } from '../editor/inputs'
import { Button } from '../ui/button'

const DEFAULT_SOCIAL: Social = { enabled: false, links: [] }

export function SocialSection({
  payload,
  setSocial,
}: {
  payload: UiConfigPayload
  setSocial: (social: Social) => void
}) {
  const social = payload.social ?? DEFAULT_SOCIAL

  const update = (patch: Partial<Social>) => setSocial({ ...social, ...patch })

  const updateLink = (index: number, patch: Partial<SocialLink>) => {
    const links = social.links.map((link, i) => (i === index ? { ...link, ...patch } : link))
    update({ links })
  }

  const addLink = () => {
    update({
      links: [...social.links, { platform: 'linkedin', url: '' }],
    })
  }

  const removeLink = (index: number) => {
    update({ links: social.links.filter((_, i) => i !== index) })
  }

  return (
    <div className="space-y-6">
      <Card title="Social media" description="Links shown in the site footer when enabled.">
        <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-border bg-surface-sunken/50 px-4 py-3">
          <input
            type="checkbox"
            checked={social.enabled}
            onChange={(e) => update({ enabled: e.target.checked })}
            className="size-4 rounded border-border text-brand focus:ring-brand"
          />
          <span className="text-sm font-medium text-foreground">Show social links in footer</span>
        </label>

        <div className="mt-6 space-y-4">
          {social.links.length === 0 ? (
            <p className="text-sm text-muted">No links yet. Add one below.</p>
          ) : (
            social.links.map((link, index) => (
              <div
                key={index}
                className="rounded-xl border border-border bg-surface-sunken/40 p-4"
              >
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-sm font-medium text-foreground">Link {index + 1}</p>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeLink(index)}
                    aria-label="Remove link"
                  >
                    <Trash2 className="size-4 text-danger" />
                  </Button>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <Field label="Platform">
                    <select
                      value={link.platform}
                      onChange={(e) =>
                        updateLink(index, { platform: e.target.value as SocialPlatform })
                      }
                      className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm"
                    >
                      {SOCIAL_PLATFORMS.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.label}
                        </option>
                      ))}
                    </select>
                  </Field>
                  <Field label="URL" hint="Full https:// profile URL">
                    <TextInput
                      value={link.url}
                      onChange={(v) => updateLink(index, { url: v })}
                      placeholder="https://linkedin.com/company/..."
                    />
                  </Field>
                </div>
              </div>
            ))
          )}

          <Button type="button" variant="outline" size="sm" onClick={addLink}>
            <Plus className="size-3.5" />
            Add link
          </Button>
        </div>
      </Card>
    </div>
  )
}
