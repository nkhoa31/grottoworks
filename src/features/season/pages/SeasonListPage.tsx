// Trang danh sách mùa (COMMITTEE): PageHeader + StatCards + DataTable,
// tạo/sửa qua SeasonFormDialog, chốt mùa qua ConfirmDialog.
import { useMemo, useState } from 'react'
import type { CSSProperties } from 'react'
import { useTranslation } from 'react-i18next'
import { CalendarPlus, Pencil, LockKeyhole } from 'lucide-react'
import { PageHeader } from '@/components/shared/PageHeader'
import { DataTable } from '@/components/shared/DataTable'
import { StatusTag } from '@/components/shared/StatusTag'
import { StatCard } from '@/components/shared/StatCard'
import { ConfirmDialog } from '@/components/shared/ConfirmDialog'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/toast'
import { useSeasons, useCloseSeason } from '../api'
import { SeasonFormDialog } from './SeasonFormDialog'
import type { Season } from '@/types'
import i18n from '@/lib/i18n'

const d = (n: number) => ({ '--d': n }) as CSSProperties

// ISO yyyy-mm-dd → dd/MM/yyyy.
const viDate = (iso: string) =>
  iso.length >= 10 ? `${iso.slice(8, 10)}/${iso.slice(5, 7)}/${iso.slice(0, 4)}` : iso

export default function SeasonListPage() {
  const { t } = useTranslation()
  const toast = useToast()
  const { data: seasons = [], isPending } = useSeasons()
  const closeSeason = useCloseSeason()

  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<Season | null>(null)
  const [closing, setClosing] = useState<Season | null>(null)

  const active = seasons.filter((s) => s.status === 'ACTIVE')
  const locale = i18n.language === 'en' ? 'en-US' : 'vi-VN'
  const columns = useMemo(() => [
    { key: 'year', header: t('features.season.year'), render: (s: Season) => <span className="tabular font-semibold">{s.year}</span> },
    { key: 'period', header: t('features.season.period'), render: (s: Season) => <span className="tabular">{viDate(s.startDate)} → {viDate(s.endDate)}</span> },
    { key: 'budget', header: t('features.season.budget'), align: 'right' as const, render: (s: Season) => <span className="tabular">{s.budget.toLocaleString(locale)}</span> },
    { key: 'status', header: t('common.status'), render: (s: Season) => <StatusTag status={s.status} /> },
    {
      key: 'actions',
      header: t('common.actions'),
      render: (s: Season) => (
        <div className="flex justify-end gap-1">
          <Button
            variant="ghost"
            size="icon"
            aria-label={t('common.edit')}
            onClick={() => {
              setEditing(s)
              setFormOpen(true)
            }}
          >
            <Pencil className="size-4" />
          </Button>
          {s.status !== 'CLOSED' && (
            <Button
              variant="ghost"
              size="icon"
              aria-label={t('features.season.close')}
              onClick={() => setClosing(s)}
            >
              <LockKeyhole className="size-4" />
            </Button>
          )}
        </div>
      ),
    },
  ], [t, locale])

  const onCloseSeason = async (s: Season) => {
    try {
      await closeSeason.mutateAsync(s.id)
      toast(t('features.season.closed', { year: s.year }))
    } catch {
      toast(t('common.error'), 'alert')
    }
  }

  return (
    <div>
      <PageHeader
        title={t('features.season.title')}
        sub={t('features.season.sub')}
        actions={
          <Button
            onClick={() => {
              setEditing(null)
              setFormOpen(true)
            }}
          >
            <CalendarPlus className="size-4" />
            {t('features.season.create')}
          </Button>
        }
      />

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3 stagger">
        <div style={d(0)}>
          <StatCard label={t('features.season.stats.total')} value={seasons.length} />
        </div>
        <div style={d(1)}>
          <StatCard label={t('features.season.stats.active')} value={active.length} tone="warn" />
        </div>
        <div style={d(2)}>
          <StatCard
            label={t('features.season.stats.activeBudget')}
            value={active.reduce((sum, s) => sum + s.budget, 0)}
            unit="₫"
          />
        </div>
      </div>

      {isPending ? (
        <p className="lbl-mono">{t('common.loading')}</p>
      ) : (
        <DataTable rows={seasons} columns={columns} pageSize={8} emptyText={t('features.season.empty')} />
      )}

      {formOpen && (
        <SeasonFormDialog season={editing} onClose={() => setFormOpen(false)} />
      )}
      <ConfirmDialog
        open={Boolean(closing)}
        title={t('features.season.closeTitle')}
        description={
          closing ? t('features.season.closeConfirm', { year: closing.year }) : undefined
        }
        confirmLabel={t('features.season.close')}
        onConfirm={() => closing && onCloseSeason(closing)}
        onClose={() => setClosing(null)}
      />
    </div>
  )
}
