import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'

// Count-up rAF, cubic ease-out ~700ms (bỏ qua khi reduced-motion — index.css).
function useCountUp(target: number, duration = 700): number {
  const [val, setVal] = useState(0)
  useEffect(() => {
    let raf = 0
    const t0 = performance.now()
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / duration)
      setVal(Math.round(target * (1 - Math.pow(1 - p, 3))))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [target, duration])
  return val
}

const BAR = { ok: 'bg-grotto-moss', warn: 'bg-grotto-straw', alert: 'bg-grotto-brick' } as const

export function StatCard({
  label,
  value,
  unit,
  delta,
  tone = 'ok',
  className,
}: {
  label: string
  value: number
  unit?: string
  delta?: { dir: 'up' | 'down'; text: string }
  tone?: 'ok' | 'warn' | 'alert'
  className?: string
}) {
  const v = useCountUp(value)
  return (
    <Card className={cn('relative overflow-hidden p-5', className)}>
      <div className={cn('absolute inset-x-0 top-0 h-1.5', BAR[tone])} aria-hidden />
      <p className="lbl-mono">{label}</p>
      <p className="tabular mt-2 text-3xl font-extrabold text-grotto-ink">
        {v.toLocaleString('vi-VN')}
        {unit && <span className="ml-1.5 text-sm font-semibold text-grotto-soft">{unit}</span>}
      </p>
      {delta && (
        <p
          className={cn(
            'mt-1 text-xs font-semibold',
            delta.dir === 'up' ? 'text-grotto-moss' : 'text-grotto-brick',
          )}
        >
          {delta.dir === 'up' ? '▲' : '▼'} {delta.text}
        </p>
      )}
    </Card>
  )
}
