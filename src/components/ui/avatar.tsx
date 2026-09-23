import { cn } from '@/lib/utils'

const SIZES = {
  sm: 'size-8 text-xs',
  md: 'size-8 text-sm',
  lg: 'size-10 text-lg',
} as const

/** Chip chữ cái đầu — nền pastel sinh từ avatarHue của user. */
export function Avatar({
  name,
  hue,
  size = 'md',
  className,
}: {
  name: string
  hue?: number
  size?: keyof typeof SIZES
  className?: string
}) {
  const initials = name
    .split(' ')
    .filter(Boolean)
    .slice(-2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()
  return (
    <span
      aria-hidden
      className={cn(
        'grid shrink-0 select-none place-items-center rounded-[80px] font-bold text-grotto-ink border border-2 border-red-500',
        SIZES[size],
        className,
      )}
      style={{ backgroundColor: `hsl(${hue ?? 30} 42% 86%)` }}
    >
      {initials}
    </span>
  )
}
