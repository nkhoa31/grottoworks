// Trang khu vực công tác (COMMITTEE): grid AreaCard + DataTable (toggle),
// tạo/sửa qua AreaFormDialog, xoá qua ConfirmDialog.
// Click card/row: Task 5 sẽ nối sang trang chi tiết khu — tạm no-op.
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { LayoutGrid, Table2, Pencil, Trash2, Plus } from 'lucide-react'
import { PageHeader } from '@/components/shared/PageHeader'
import { DataTable } from '@/components/shared/DataTable'
import { EmptyState } from '@/components/shared/EmptyState'
import { StatusTag } from '@/components/shared/StatusTag'
import { ConfirmDialog } from '@/components/shared/ConfirmDialog'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/toast'
import { cn } from '@/lib/utils'
import { useAreas, useUsers, useDeleteArea } from '../api'
import { AreaCard } from '../components/AreaCard'
import { AreaFormDialog } from './AreaFormDialog'
import type { WorkArea } from '@/types'

type View = 'grid' | 'table'

export default function AreaListPage() {
  const { t } = useTranslation()
  const toast = useToast()
  const { data: areas = [], isPending } = useAreas()
  const { data: users = [] } = useUsers()
  const deleteArea = useDeleteArea()

  const [view, setView] = useState<View>('grid')
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<WorkArea | null>(null)
  const [deleting, setDeleting] = useState<WorkArea | null>(null)

  const nameOf = (id: string) => users.find((u) => u.id === id)?.name ?? '—'

  const columns = useMemo(
    () => [
      { key: 'name', header: t('features.areas.name'), render: (a: WorkArea) => <span className="font-semibold">{a.name}</span> },
      { key: 'type', header: t('features.areas.type'), render: (a: WorkArea) => t(`features.areas.areaType.${a.type}`) },
      { key: 'level', header: t('features.areas.level'), render: (a: WorkArea) => t(`features.areas.level.${a.level}`) },
      { key: 'leaderId', header: t('features.areas.leader'), render: (a: WorkArea) => nameOf(a.leaderId) },
      { key: 'officerId', header: t('features.areas.officer'), render: (a: WorkArea) => nameOf(a.officerId) },
      { key: 'progress', header: t('features.areas.progress'), align: 'right' as const, render: (a: WorkArea) => <span className="tabular">{a.progress}%</span> },
      {
        key: 'people',
        header: t('features.areas.people'),
        align: 'right' as const,
        render: (a: WorkArea) => (
          <span className="tabular">
            {a.volunteerCount}/{a.taskCount}
          </span>
        ),
      },
      { key: 'status', header: t('common.status'), render: (a: WorkArea) => <StatusTag status={a.status} /> },
      {
        key: 'actions',
        header: t('common.actions'),
        render: (a: WorkArea) => (
          <div className="flex justify-end gap-1">
            <Button
              variant="ghost"
              size="icon"
              aria-label={t('common.edit')}
              onClick={() => {
                setEditing(a)
                setFormOpen(true)
              }}
            >
              <Pencil className="size-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              aria-label={t('common.delete')}
              onClick={() => setDeleting(a)}
            >
              <Trash2 className="size-4" />
            </Button>
          </div>
        ),
      },
    ],
    [t, users],
  )

  const onDelete = async (a: WorkArea) => {
    try {
      await deleteArea.mutateAsync(a.id)
      toast(t('features.areas.deleted', { name: a.name }))
    } catch {
      toast(t('common.error'), 'alert')
    }
  }

  return (
    <div>
      <PageHeader
        title={t('features.areas.title')}
        sub={t('features.areas.sub')}
        actions={
          <>
            <div
              role="group"
              aria-label={t('features.areas.view')}
              className="flex overflow-hidden rounded-md border border-grotto-hair"
            >
              {(
                [
                  ['grid', LayoutGrid, t('features.areas.viewGrid')],
                  ['table', Table2, t('features.areas.viewTable')],
                ] as const
              ).map(([v, Icon, label]) => (
                <button
                  key={v}
                  type="button"
                  aria-label={label}
                  aria-pressed={view === v}
                  onClick={() => setView(v)}
                  className={cn(
                    'grid size-10 place-items-center transition-colors',
                    view === v
                      ? 'bg-grotto-terra text-grotto-panel'
                      : 'bg-grotto-panel text-grotto-soft hover:text-grotto-terra',
                  )}
                >
                  <Icon className="size-4" />
                </button>
              ))}
            </div>
            <Button
              onClick={() => {
                setEditing(null)
                setFormOpen(true)
              }}
            >
              <Plus className="size-4" />
              {t('features.areas.create')}
            </Button>
          </>
        }
      />

      {isPending ? (
        <p className="lbl-mono">{t('common.loading')}</p>
      ) : view === 'grid' ? (
        areas.length ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5">
            {areas.map((a, i) => (
              <AreaCard key={a.id} area={a} index={i} />
            ))}
          </div>
        ) : (
          <EmptyState text={t('features.areas.empty')} />
        )
      ) : (
        <DataTable
          rows={areas}
          columns={columns}
          searchKeys={['name']}
          pageSize={8}
          emptyText={t('features.areas.empty')}
        />
      )}

      {formOpen && <AreaFormDialog area={editing} onClose={() => setFormOpen(false)} />}
      <ConfirmDialog
        open={Boolean(deleting)}
        title={t('features.areas.deleteTitle')}
        description={deleting ? t('features.areas.deleteConfirm', { name: deleting.name }) : undefined}
        confirmLabel={t('common.delete')}
        tone="destructive"
        onConfirm={() => deleting && onDelete(deleting)}
        onClose={() => setDeleting(null)}
      />
    </div>
  )
}
