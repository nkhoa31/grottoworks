// Thẻ khu vực dạng vòm hang đá: dải terra trên với mái vòm panel (pattern
// Login), icon theo type, StatusTag, thanh tiến độ moss vươn từ 0 (.g-bar).
import type { CSSProperties } from 'react'
import { useTranslation } from 'react-i18next'
import { Landmark, TreePine, Lightbulb, Trees, Theater } from 'lucide-react'
import { StatusTag } from '@/components/shared/StatusTag'
import { cn } from '@/lib/utils'
import type { AreaType, WorkArea } from '@/types'

// Icon theo type khu (brief: GROTTO→Landmark, TREE→TreePine, LIGHTING→
// Lightbulb, YARD→Trees, STAGE→Theater).
export const AREA_ICONS: Record<AreaType, typeof Landmark> = {
  GROTTO: Landmark,
  TREE: TreePine,
  LIGHTING: Lightbulb,
  YARD: Trees,
  STAGE: Theater,
}

export function AreaCard({
  area,
  index,
  onClick,
}: {
  area: WorkArea
  index: number
  onClick?: (area: WorkArea) => void
}) {
  const { t } = useTranslation()
  const Icon = AREA_ICONS[area.type]
  const style = { '--d': index } as CSSProperties
  return (
    <div
      data-area-id={area.id}
      style={style}
      onClick={onClick ? () => onClick(area) : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={
        onClick
          ? (e) => {
              if (e.key === 'Enter') onClick(area)
            }
          : undefined
      }
      className={cn(
        'g-item overflow-hidden rounded-grotto border border-grotto-hair bg-grotto-panel shadow-sm',
        onClick && 'cursor-pointer transition-transform hover:-translate-y-0.5 hover:shadow-md',
      )}
    >
      {/* Vòm hang: dải terra + mái vòm panel cắt lên trên, icon ở giữa. */}
      <div className="relative h-24 bg-grotto-terra">
        <div className="absolute inset-x-0 bottom-0 mx-auto h-7 w-20 rounded-t-full bg-grotto-panel" />
        <div className="grid h-full place-items-center">
          <div className="grid size-11 place-items-center rounded-[14px_14px_4px_4px] bg-grotto-terraDark text-grotto-panel">
            <Icon className="size-5" aria-hidden />
          </div>
        </div>
      </div>
      <div className="p-5">
        <p className="lbl-mono">
          {t(`features.areas.areaType.${area.type}`)} · {t(`features.areas.level.${area.level}`)}
        </p>
        <h3 className="mt-1 text-lg font-bold leading-tight text-grotto-ink">{area.name}</h3>
        <div className="mt-2">
          <StatusTag status={area.status} />
        </div>
        <div className="mt-4">
          <div className="flex items-baseline justify-between">
            <span className="lbl-mono">{t('features.areas.progress')}</span>
            <span className="tabular text-sm font-extrabold text-grotto-ink">{area.progress}%</span>
          </div>
          <div
            role="progressbar"
            aria-valuenow={area.progress}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={t('features.areas.progress')}
            className="mt-1.5 h-2 overflow-hidden rounded-full bg-grotto-hair"
          >
            <div
              className={cn('g-bar h-full rounded-full bg-grotto-moss')}
              style={{ width: `${area.progress}%`, ...style }}
            />
          </div>
        </div>
        <p className="tabular mt-4 text-xs font-semibold text-grotto-soft">
          {area.volunteerCount} {t('features.areas.volunteers')} · {area.taskCount}{' '}
          {t('features.areas.tasks')}
        </p>
      </div>
    </div>
  )
}
