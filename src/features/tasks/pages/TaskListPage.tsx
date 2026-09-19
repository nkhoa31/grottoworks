// Danh sách nhiệm vụ. Mount ở 4 nơi, phân biệt theo route:
// - /leader/tasks: leader thấy việc các khu mình lãnh (nhiều khu → select khu),
//   committee/parish thấy tất cả (route committee tương lai).
// - /leader/assignments: chỉ việc chưa đủ assignees.
// - /community/areas/:id/tasks: read-only (ẩn tạo/sửa/xoá), khoá theo :id.
// Status tabs = chip filter của DataTable (client-side trên key 'status').
import { useMemo, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Pencil, Plus, Trash2 } from 'lucide-react'
import { PageHeader } from '@/components/shared/PageHeader'
import { DataTable } from '@/components/shared/DataTable'
import { EmptyState } from '@/components/shared/EmptyState'
import { StatusTag } from '@/components/shared/StatusTag'
import { ConfirmDialog } from '@/components/shared/ConfirmDialog'
import { Button, buttonBase, buttonSizes, buttonVariants } from '@/components/ui/button'
import { useToast } from '@/components/ui/toast'
import { cn } from '@/lib/utils'
import { useAreas } from '@/features/areas/api'
import { useAuth } from '@/lib/auth'
import { viDate } from '@/lib/format'
import { useDeleteTask, useTasks } from '../api'
import { SELECT_CLS, TaskFormDialog } from './TaskFormDialog'
import type { Task } from '@/types'

export default function TaskListPage() {
  const { t } = useTranslation()
  const toast = useToast()
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const { id: areaParam } = useParams()
  const { user } = useAuth()

  const readOnly = pathname.startsWith('/community/') || pathname.startsWith('/parish/')
  const assignments = pathname.startsWith('/leader/assignments')

  const { data: areas = [] } = useAreas()
  const deleteTask = useDeleteTask()

  // Khu của leader: 1 khu → cố định; nhiều khu → select (default khu đầu).
  const myAreas = areas.filter((a) => a.leaderId === user?.id)
  const [selectedArea, setSelectedArea] = useState('')
  const leaderAreaId =
    myAreas.length === 1 ? myAreas[0].id : myAreas.length > 1 ? selectedArea || myAreas[0].id : ''
  const areaId = (readOnly ? areaParam : undefined) ?? (leaderAreaId || undefined)

  const { data: allTasks = [], isPending } = useTasks(areaId)
  // /leader/assignments: chỉ việc chưa đủ người (tab "Cần phân công" mặc định).
  const tasks = assignments
    ? allTasks.filter((x) => x.assignees.length < x.volunteersNeeded)
    : allTasks

  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<Task | null>(null)
  const [deleting, setDeleting] = useState<Task | null>(null)

  const areaName = (id: string) => areas.find((a) => a.id === id)?.name ?? '—'

  const columns = useMemo(
    () => [
      {
        key: 'title',
        header: t('features.tasks.name'),
        render: (x: Task) => <span className="font-semibold">{x.title}</span>,
      },
      {
        key: 'area',
        header: t('features.tasks.area'),
        render: (x: Task) => areaName(x.areaId),
      },
      {
        key: 'dueDate',
        header: t('features.tasks.dueDate'),
        render: (x: Task) => <span className="tabular">{viDate(x.dueDate)}</span>,
      },
      {
        key: 'assignees',
        header: t('features.tasks.assignees'),
        align: 'right' as const,
        render: (x: Task) => (
          <span className="tabular">
            {x.assignees.length}/{x.volunteersNeeded}
          </span>
        ),
      },
      { key: 'status', header: t('common.status'), render: (x: Task) => <StatusTag status={x.status} /> },
      ...(readOnly
        ? []
        : [
            {
              key: 'actions',
              header: t('common.actions'),
              render: (x: Task) => (
                <div className="flex justify-end gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label={t('common.edit')}
                    onClick={(e) => {
                      e.stopPropagation()
                      setEditing(x)
                      setFormOpen(true)
                    }}
                  >
                    <Pencil className="size-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label={t('common.delete')}
                    onClick={(e) => {
                      e.stopPropagation()
                      setDeleting(x)
                    }}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              ),
            },
          ]),
    ],
    [t, areas, readOnly],
  )

  const onDelete = async (x: Task) => {
    try {
      await deleteTask.mutateAsync(x.id)
      toast(t('features.tasks.deleted', { name: x.title }))
    } catch {
      toast(t('common.error'), 'alert')
    }
  }

  return (
    <div>
      <PageHeader
        title={assignments ? t('features.tasks.assignmentsTitle') : t('features.tasks.title')}
        sub={
          assignments
            ? t('features.tasks.assignmentsSub')
            : areaId
              ? `${t('features.tasks.area')}: ${areaName(areaId)}`
              : t('features.tasks.sub')
        }
        actions={
          !readOnly &&
          areaId && (
            <>
              {myAreas.length > 1 && (
                <select
                  aria-label={t('features.tasks.area')}
                  className={`${SELECT_CLS} w-48`}
                  value={leaderAreaId}
                  onChange={(e) => setSelectedArea(e.target.value)}
                >
                  {myAreas.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.name}
                    </option>
                  ))}
                </select>
              )}
              <Button
                onClick={() => {
                  setEditing(null)
                  setFormOpen(true)
                }}
              >
                <Plus className="size-4" />
                {t('features.tasks.create')}
              </Button>
            </>
          )
        }
      />

      {isPending ? (
        <p className="lbl-mono">{t('common.loading')}</p>
      ) : user?.role === 'LEADER' && myAreas.length === 0 ? (
        // Leader chưa lãnh khu nào (cả nhánh /leader/assignments) — không
        // đổ toàn bộ tasks, hướng liên hệ committee.
        <EmptyState
          text={t('features.tasks.noArea')}
          action={
            <a
              href="mailto:committee@grottoworks.vn"
              className={cn(buttonBase, buttonVariants.default, buttonSizes.default)}
            >
              {t('features.tasks.contactCommittee')}
            </a>
          }
        />
      ) : (
        <DataTable
          rows={tasks}
          columns={columns}
          searchKeys={['title']}
          filters={[{ key: 'status', options: ['TODO', 'DOING', 'REVIEW', 'DONE', 'REVISE'] }]}
          pageSize={8}
          emptyText={t('features.tasks.empty')}
          onRowClick={readOnly ? undefined : (x) => navigate(`/leader/tasks/${x.id}`)}
        />
      )}

      {formOpen && (
        <TaskFormDialog
          task={editing}
          fixedAreaId={areaId}
          onClose={() => setFormOpen(false)}
        />
      )}
      <ConfirmDialog
        open={Boolean(deleting)}
        title={t('features.tasks.deleteTitle')}
        description={deleting ? t('features.tasks.deleteConfirm', { name: deleting.title }) : undefined}
        confirmLabel={t('common.delete')}
        tone="destructive"
        onConfirm={() => deleting && onDelete(deleting)}
        onClose={() => setDeleting(null)}
      />
    </div>
  )
}
