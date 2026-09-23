// SeasonSelector — chọn mùa Giáng sinh đang quản lý (DESIGN_SYSTEM.md mục 5.2).
// Nằm ở Header Web: "Mùa Giáng Sinh 2026 ▼". Hiển thị mùa ACTIVE mặc định;
// nếu chưa có mùa nào thì hiển thị placeholder nhẹ (không phá layout Header).
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ChevronDown, Check } from 'lucide-react'
import { useSeasons } from '@/features/season/api'
import { cn } from '@/lib/utils'
import type { Season } from '@/types'

const STATUS_TONE: Record<Season['status'], string> = {
  ACTIVE: 'text-grotto-moss',
  PLANNED: 'text-grotto-straw',
  CLOSED: 'text-grotto-soft',
}

export function SeasonSelector() {
  const { t } = useTranslation()
  const { data: seasons = [] } = useSeasons()
  const [open, setOpen] = useState(false)
  const [selectedId, setSelectedId] = useState<string | undefined>(undefined)
  const ref = useRef<HTMLDivElement>(null)

  // Mặc định chọn mùa ACTIVE đầu tiên khi dữ liệu về.
  useEffect(() => {
    if (selectedId) return
    const active = seasons.find((s) => s.status === 'ACTIVE') ?? seasons[0]
    if (active) setSelectedId(active.id)
  }, [seasons, selectedId])

  // Đóng khi click ra ngoài / nhấn Esc.
  useEffect(() => {
    if (!open) return
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('mousedown', onClick)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onClick)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  const selected = seasons.find((s) => s.id === selectedId) ?? seasons[0]

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={cn(
          'flex h-9 items-center gap-2 rounded-md border border-grotto-hair bg-grotto-panel',
          'px-3 text-sm font-semibold text-grotto-ink transition-colors hover:bg-grotto-ground',
        )}
      >
        {/* Chấm trạng thái: màu KHÔNG là tín hiệu duy nhất — kèm nhãn trạng thái text. */}
        <span
          aria-hidden
          className={cn('size-2 rounded-full bg-current', selected ? STATUS_TONE[selected.status] : 'text-grotto-soft')}
        />
        <span className="tabular">
          {selected
            ? t('features.dashboards.seasonTitle', { year: selected.year })
            : t('common.empty')}
        </span>
        <ChevronDown className="size-4 text-grotto-soft" aria-hidden />
      </button>

      {open && seasons.length > 0 && (
        <ul
          role="listbox"
          aria-label={t('features.dashboards.seasonProgress')}
          className="absolute right-0 z-30 mt-1.5 min-w-56 overflow-hidden rounded-card border border-grotto-hair bg-grotto-panel py-1 shadow-hover"
        >
          {seasons.map((s) => {
            const isSel = s.id === selected?.id
            return (
              <li key={s.id} role="option" aria-selected={isSel}>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedId(s.id)
                    setOpen(false)
                  }}
                  className={cn(
                    'flex w-full items-center gap-2 px-3 py-2 text-left text-sm transition-colors hover:bg-grotto-ground',
                    isSel ? 'font-semibold text-grotto-ink' : 'text-grotto-soft',
                  )}
                >
                  <Check
                    className={cn('size-4 shrink-0', isSel ? 'text-grotto-moss' : 'opacity-0')}
                    aria-hidden
                  />
                  <span className="tabular flex-1 truncate">
                    {t('features.dashboards.seasonTitle', { year: s.year })}
                  </span>
                  <span className={cn('text-xs font-semibold', STATUS_TONE[s.status])}>
                    {t(`status.${s.status}`, { defaultValue: s.status })}
                  </span>
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
