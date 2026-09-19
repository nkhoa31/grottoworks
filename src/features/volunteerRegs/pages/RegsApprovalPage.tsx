// Duyệt đăng ký TNV (route /leader/regs, committee cũng mở được qua URL).
// Leader chỉ thấy reg của nhiệm vụ thuộc khu mình lãnh (area leaderId);
// committee/parish thấy tất cả. Nút Duyệt/Từ chối từng row — duyệt chạy
// 2 bước trong useApproveReg (reg APPROVED + volunteer vào assignees).
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Check, X } from 'lucide-react'
import { PageHeader } from '@/components/shared/PageHeader'
import { DataTable } from '@/components/shared/DataTable'
import { StatusTag } from '@/components/shared/StatusTag'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/toast'
import { useAreas } from '@/features/areas/api'
import { useTasks } from '@/features/tasks/api'
import { useUsers } from '@/features/users/api'
import { useAuth } from '@/lib/auth'
import { viDate } from '@/lib/format'
import { useApproveReg, useRejectReg, useVolunteerRegs } from '../../volunteers/api'
import type { VolunteerReg } from '@/types'

export default function RegsApprovalPage() {
  const { t } = useTranslation()
  const toast = useToast()
  const { user } = useAuth()
  const { data: regs = [], isPending } = useVolunteerRegs()
  const { data: tasks = [] } = useTasks()
  const { data: areas = [] } = useAreas()
  const { data: users = [] } = useUsers()
  const approve = useApproveReg()
  const reject = useRejectReg()

  const myAreaIds = new Set(areas.filter((a) => a.leaderId === user?.id).map((a) => a.id))
  const taskOf = (taskId: string) => tasks.find((x) => x.id === taskId)
  const volunteerName = (id: string) => users.find((u) => u.id === id)?.name ?? '—'
  const areaName = (id: string) => areas.find((a) => a.id === id)?.name ?? '—'

  // Leader: chỉ reg của task thuộc khu mình lãnh; committee/parish: tất cả.
  const rows = regs.filter((r) =>
    user?.role === 'LEADER' ? myAreaIds.has(taskOf(r.taskId)?.areaId ?? '') : true,
  )

  const act = async (reg: VolunteerReg, fn: { mutateAsync: (r: VolunteerReg) => Promise<unknown> }, msg: string) => {
    try {
      await fn.mutateAsync(reg)
      toast(msg)
    } catch {
      toast(t('common.error'), 'alert')
    }
  }

  const columns = useMemo(
    () => [
      {
        key: 'volunteer',
        header: t('features.volunteers.regVolunteer'),
        render: (r: VolunteerReg) => (
          <span className="font-semibold text-grotto-ink">{volunteerName(r.volunteerId)}</span>
        ),
      },
      {
        key: 'task',
        header: t('features.volunteers.regTask'),
        render: (r: VolunteerReg) => taskOf(r.taskId)?.title ?? '—',
      },
      {
        key: 'area',
        header: t('features.volunteers.regArea'),
        render: (r: VolunteerReg) => areaName(taskOf(r.taskId)?.areaId ?? ''),
      },
      {
        key: 'dueDate',
        header: t('features.volunteers.dueDate'),
        render: (r: VolunteerReg) => {
          const due = taskOf(r.taskId)?.dueDate
          return <span className="tabular">{due ? viDate(due) : '—'}</span>
        },
      },
      { key: 'status', header: t('common.status'), render: (r: VolunteerReg) => <StatusTag status={r.status} /> },
      {
        key: 'actions',
        header: t('common.actions'),
        render: (r: VolunteerReg) =>
          r.status === 'PENDING' ? (
            <div className="flex justify-end gap-1.5">
              <Button
                size="sm"
                aria-label={t('features.volunteers.approve')}
                onClick={(e) => {
                  e.stopPropagation()
                  void act(r, approve, t('features.volunteers.approved', { name: volunteerName(r.volunteerId) }))
                }}
              >
                <Check className="size-4" />
                {t('features.volunteers.approve')}
              </Button>
              <Button
                size="sm"
                variant="destructive"
                aria-label={t('features.volunteers.reject')}
                onClick={(e) => {
                  e.stopPropagation()
                  void act(r, reject, t('features.volunteers.rejected', { name: volunteerName(r.volunteerId) }))
                }}
              >
                <X className="size-4" />
                {t('features.volunteers.reject')}
              </Button>
            </div>
          ) : (
            <span className="text-grotto-soft">—</span>
          ),
      },
    ],
    [t, users, tasks, areas],
  )

  return (
    <div>
      <PageHeader
        title={t('features.volunteers.regsTitle')}
        sub={t('features.volunteers.regsSub')}
      />
      {isPending ? (
        <p className="lbl-mono">{t('common.loading')}</p>
      ) : (
        <DataTable
          rows={rows}
          columns={columns}
          filters={[{ key: 'status', options: ['PENDING', 'APPROVED', 'REJECTED'] }]}
          // Mặc định hiện reg chờ duyệt — bấm "Tất cả" để xem hết.
          defaultFilters={{ status: 'PENDING' }}
          emptyText={t('features.volunteers.regsEmpty')}
        />
      )}
    </div>
  )
}
