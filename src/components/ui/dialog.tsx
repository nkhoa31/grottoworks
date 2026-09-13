import { useEffect } from 'react'
import type { ReactNode } from 'react'
import { X } from 'lucide-react'

// Dialog tự viết (không Radix): overlay + card grotto, đóng bằng Escape
// hoặc click overlay. ConfirmDialog (shared) bọc component này.
export function Dialog({
  open,
  onClose,
  title,
  children,
  footer,
}: {
  open: boolean
  onClose: () => void
  title: string
  children?: ReactNode
  footer?: ReactNode
}) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null
  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-grotto-ink/40 p-4"
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onClick={onClose}
    >
      <div
        className="g-item w-full max-w-sm rounded-grotto border border-grotto-hair bg-grotto-panel p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <h2 className="text-lg font-bold text-grotto-ink">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Đóng"
            className="text-grotto-soft transition-colors hover:text-grotto-ink"
          >
            <X className="size-4" />
          </button>
        </div>
        {children && <div className="mt-3 text-sm text-grotto-soft">{children}</div>}
        {footer && <div className="mt-6 flex justify-end gap-2">{footer}</div>}
      </div>
    </div>
  )
}
