import type { ReactNode } from 'react'
import { Inbox } from 'lucide-react'
import { cn } from '@/lib/utils'

export function EmptyState({
  text,
  action,
  className,
}: {
  text: string
  action?: ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        'grid place-items-center gap-3 px-4 py-12 text-center',
        className,
      )}
    >
      <Inbox className="size-8 text-grotto-soft" aria-hidden />
      <p className="text-sm text-grotto-soft">{text}</p>
      {action}
    </div>
  )
}
