'use client'

import { COLOR_GROUPS, type Theme, type UiConfigPayload } from '@/lib/types'
import { ColorField } from '../color-field'
import { Card, Field, TextInput } from '../editor/inputs'

export function AppearanceSection({
  payload,
  setTheme,
}: {
  payload: UiConfigPayload
  setTheme: (key: keyof Theme, value: string) => void
}) {
  return (
    <div className="space-y-6">
      {COLOR_GROUPS.map((group) => (
        <Card key={group.label} title={`${group.label} colours`}>
          <div className="divide-y divide-neutral-100">
            {group.keys.map((key) => (
              <ColorField key={key} name={key} value={payload.theme[key]} onChange={(v) => setTheme(key, v)} />
            ))}
          </div>
        </Card>
      ))}

      <Card title="Shape & typography">
        <div className="space-y-3">
          <Field label="Corner radius (CSS length)">
            <TextInput mono value={payload.theme.radius} onChange={(v) => setTheme('radius', v)} />
          </Field>
          <Field label="Heading font">
            <TextInput value={payload.theme.fontHeading} onChange={(v) => setTheme('fontHeading', v)} />
          </Field>
          <Field label="Body font">
            <TextInput value={payload.theme.fontSans} onChange={(v) => setTheme('fontSans', v)} />
          </Field>
        </div>
      </Card>
    </div>
  )
}
