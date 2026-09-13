import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

/** Chip nhỏ (kỹ năng, tag) — pill viền hair nền panel. */
export function Badge({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 whitespace-nowrap rounded-full border border-grotto-hair bg-grotto-panel px-2.5 py-0.5 text-xs font-semibold text-grotto-ink',
        className,
      )}
    >
      {children}
    </span>
  )
}
