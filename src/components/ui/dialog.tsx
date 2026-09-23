import { useEffect, useRef } from 'react'
import type { ReactNode } from 'react'
import { X } from 'lucide-react'
import i18n from '@/lib/i18n'
import { cn } from '@/lib/utils'

// Dialog tự viết (không Radix): overlay + card grotto. Esc + click overlay đóng,
// mở dialog focus nút close (focus trap đầy đủ hoãn — demo 1 vòng Tab là đủ).
export function Dialog({
  open,
  onClose,
  title,
  children,
  footer,
  size = 'sm',
}: {
  open: boolean
  onClose: () => void
  title: string
  children?: ReactNode
  footer?: ReactNode
  /** sm: dialog hẹp mặc định; lg: cho form 2 cột. */
  size?: 'sm' | 'lg'
}) {
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) return
    closeRef.current?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null
  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-grotto-ink/40 p-4"
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onClick={onClose}
    >
      <div
        className={cn(
          // max-h + flex: header/footer đứng yên, chỉ phần thân cuộn khi dài
          // → dialog không bao giờ dính/chạm cạnh màn hình.
          'g-item flex max-h-[calc(100vh-2rem)] w-full flex-col rounded-grotto border border-grotto-hair bg-grotto-panel p-6 shadow-xl',
          size === 'lg' ? 'max-w-2xl' : 'max-w-sm',
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <h2 className="text-lg font-bold text-grotto-ink">{title}</h2>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label={i18n.t('common.close')}
            className="rounded-md text-grotto-soft transition-colors hover:text-grotto-ink"
          >
            <X className="size-4" />
          </button>
        </div>
        {children && (
          <div className="mt-3 min-h-0 flex-1 overflow-y-auto text-sm text-grotto-soft">
            {children}
          </div>
        )}
        {footer && <div className="mt-6 flex justify-end gap-2">{footer}</div>}
      </div>
    </div>
  )
}
