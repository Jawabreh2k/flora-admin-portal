import { QueryProvider } from '@/components/providers/query-provider'
import { AppShell } from '@/components/app-shell'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <AppShell>{children}</AppShell>
    </QueryProvider>
  )
}
