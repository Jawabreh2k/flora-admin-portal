import { cn } from '@/lib/utils'

export function Button({
  className,
  variant = 'default',
  size = 'default',
  type = 'button',
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'default' | 'outline' | 'ghost' | 'destructive' | 'secondary'
  size?: 'default' | 'sm' | 'lg' | 'icon'
}) {
  return (
    <button
      type={type}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-lg text-sm font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/30 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
        variant === 'default' &&
          'bg-brand text-white shadow-sm hover:bg-brand-deep active:scale-[0.98]',
        variant === 'outline' &&
          'border border-border bg-surface text-foreground hover:bg-surface-sunken',
        variant === 'ghost' && 'text-muted hover:bg-surface-sunken hover:text-foreground',
        variant === 'destructive' &&
          'bg-danger text-white shadow-sm hover:bg-red-700 active:scale-[0.98]',
        variant === 'secondary' &&
          'bg-surface-sunken text-foreground hover:bg-border',
        size === 'default' && 'h-10 px-4 py-2',
        size === 'sm' && 'h-8 px-3 text-xs',
        size === 'lg' && 'h-11 px-6',
        size === 'icon' && 'size-9',
        className,
      )}
      {...props}
    />
  )
}
