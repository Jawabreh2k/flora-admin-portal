import { redirect } from 'next/navigation'
import { CmsError, getAdminConfig } from '@/lib/cms-client'
import { getSessionToken } from '@/lib/session'
import { ConfigEditor } from '@/components/config-editor'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const token = await getSessionToken()
  if (!token) redirect('/login')

  let initial
  try {
    initial = await getAdminConfig(token)
  } catch (err) {
    // Expired / invalid token → back to login.
    if (err instanceof CmsError && err.status === 401) redirect('/login')
    throw err
  }

  return <ConfigEditor initial={initial} />
}
