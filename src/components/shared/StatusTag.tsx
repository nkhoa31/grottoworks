import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'

// Map status → tone; nhóm ngoài brief mặc định ◇ soft (label vẫn dịch đúng).
const TONE: Record<string, 'ok' | 'warn' | 'alert' | 'soft'> = {
  DONE: 'ok', ENOUGH: 'ok', APPROVED: 'ok', RESOLVED: 'ok', CLOSED: 'ok',
  ON_TRACK: 'ok', RECEIVED_FULL: 'ok',
  DOING: 'warn', INCOMING: 'warn', PENDING: 'warn', REVIEW: 'warn',
  COORDINATED: 'warn', PENDING_FIX: 'warn', RECEIVED_PARTIAL: 'warn', ACTIVE: 'warn',
  PLEDGED: 'warn',
  LATE: 'alert', REVISE: 'alert', REJECTED: 'alert', SHORTAGE: 'alert',
  AT_RISK: 'alert', UNUSABLE: 'alert', DAMAGED: 'alert', LOST: 'alert',
  OPEN: 'warn', // yêu cầu hỗ trợ đang chờ điều phối — tone straw urgent
  NOT_RETURNED: 'soft', // đồ mượn chưa trả
}

const STYLE = {
  ok: 'bg-grotto-moss/12 text-grotto-moss',
  warn: 'bg-grotto-straw/15 text-grotto-straw',
  alert: 'bg-grotto-brick/12 text-grotto-brick',
  soft: 'bg-grotto-soft/12 text-grotto-soft',
} as const

const GLYPH = { ok: '✓', warn: '◐', alert: '✕', soft: '◇' } as const

export function StatusTag({ status, className }: { status: string; className?: string }) {
  const { t } = useTranslation()
  const tone = TONE[status] ?? 'soft'
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-0.5 font-mono text-[11px] font-semibold uppercase tracking-wide',
        STYLE[tone],
        className,
      )}
    >
      <span aria-hidden>{GLYPH[tone]}</span>
      {t(`status.${status}`, { defaultValue: status })}
    </span>
  )
}
