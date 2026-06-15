'use client'

import type { Sections, UiConfigPayload } from '@/lib/types'
import { Card, Toggle } from '../editor/inputs'

const LABELS: Record<keyof Sections, { title: string; desc: string }> = {
  showStats: { title: 'Stats band', desc: 'The "Established / Verticals / Certified / Countries" strip.' },
  showSubsidiaries: { title: 'Subsidiaries grid', desc: 'The six-company matrix section.' },
  showSpotlight: { title: 'Spotlight', desc: 'Technology & Security flagship divisions.' },
}

export function LayoutSection({
  payload,
  toggleSection,
}: {
  payload: UiConfigPayload
  toggleSection: (key: keyof Sections) => void
}) {
  return (
    <Card title="Homepage sections" description="Show or hide entire sections of the homepage.">
      <div className="space-y-4">
        {(Object.keys(payload.sections) as (keyof Sections)[]).map((key) => (
          <div key={key} className="flex items-center justify-between gap-4 border-b border-neutral-100 pb-3 last:border-0 last:pb-0">
            <div>
              <p className="text-sm font-medium text-neutral-800">{LABELS[key].title}</p>
              <p className="text-xs text-neutral-500">{LABELS[key].desc}</p>
            </div>
            <Toggle checked={payload.sections[key]} onChange={() => toggleSection(key)} label="" />
          </div>
        ))}
      </div>
    </Card>
  )
}
