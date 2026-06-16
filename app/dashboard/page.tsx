import { redirect } from 'next/navigation'
import { CmsError, getAdminConfig } from '@/lib/cms-client'
import { getSessionToken } from '@/lib/session'
import { ensureSubsidiariesInitialized } from '@/lib/subsidiaries-init'
import { ConfigEditor } from '@/components/config-editor'
import { Alert } from '@/components/ui/alert'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const token = await getSessionToken()
  if (!token) redirect('/login')

  let initial
  try {
    initial = await getAdminConfig(token)
    // Ensure subsidiaries are initialized with default data on first load
    ensureSubsidiariesInitialized(initial.payload)
  } catch (err) {
    if (err instanceof CmsError && err.status === 401) redirect('/login')
    if (err instanceof CmsError && err.status === 503) {
      return (
        <Alert variant="warning" className="max-w-2xl">
          {err.message}
        </Alert>
      )
    }
    throw err
  }

  return <ConfigEditor initial={initial} />
}
