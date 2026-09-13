// Danh sách yêu cầu hỗ trợ (route /leader/support + /committee/support).
// - Leader: thấy yêu cầu khu mình lãnh + nút "Tạo yêu cầu hỗ trợ" (dialog
//   form ở SupportFormDialog, khu khóa về khu mình).
// - Committee: view điều phối — click row mở detail dialog: chọn TNV rồi
//   "Điều phối" (PATCH COORDINATED) hoặc "Đánh dấu đã giải quyết" (RESOLVED).
// Urgent tone: OPEN straw (StatusTag OPEN→warn), COORDINATED ◐, RESOLVED ✓.
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Plus } from 'lucide-react'
import { PageHeader } from '@/components/shared/PageHeader'
import { DataTable } from '@/components/shared/DataTable'
import { StatusTag } from '@/components/shared/StatusTag'
import { Button } from '@/components/ui/button'
import { Dialog } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { useToast } from '@/components/ui/toast'
import { useAreas } from '@/features/areas/api'
import { useUsers } from '@/features/users/api'
import { useAuth } from '@/lib/auth'
import { useSupportRequests, useUpdateSupportRequest } from '../api'
import { SELECT_CLS, SupportFormDialog } from './SupportFormDialog'
import type { SupportRequest } from '@/types'

// Detail dialog (committee): info yêu cầu + điều phối (chọn TNV) / giải quyết.
function SupportDetailDialog({ item, onClose }: { item: SupportRequest; onClose: () => void }) {
  const { t } = useTranslation()
  const toast = useToast()
  const { data: areas = [] } = useAreas()
  const { data: users = [] } = useUsers()
  const update = useUpdateSupportRequest()
  const [volunteerId, setVolunteerId] = useState('')
  const [missing, setMissing] = useState(false)

  const area = areas.find((a) => a.id === item.areaId)
  const volunteerName = users.find((u) => u.id === volunteerId)?.name

  const act = async (patch: Partial<SupportRequest>, msg: string) => {
    try {
      await update.mutateAsync({ id: item.id, ...patch })
      toast(msg)
      onClose()
    } catch {
      toast(t('common.error'), 'alert')
    }
  }

  return (
    <Dialog
      open
      onClose={onClose}
      title={t('features.support.detailTitle')}
      footer={
        item.status === 'RESOLVED' ? (
          <Button variant="outline" onClick={onClose}>
            {t('common.close')}
          </Button>
        ) : (
          <>
            {item.status === 'OPEN' && (
              <Button
                onClick={() => {
                  if (!volunteerId) {
                    setMissing(true)
                    return
                  }
                  void act(
                    { status: 'COORDINATED' },
                    t('features.support.coordinated', { name: volunteerName ?? '' }),
                  )
                }}
              >
                {t('features.support.coordinate')}
              </Button>
            )}
            <Button
              variant="outline"
              onClick={() => void act({ status: 'RESOLVED' }, t('features.support.resolved'))}
            >
              {t('features.support.resolve')}
            </Button>
          </>
        )
      }
    >
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <StatusTag status={item.status} />
          <span className="text-sm font-semibold text-grotto-ink">
            {area?.name ?? '—'} · {t(`features.support.kind.${item.kind}`)}
          </span>
        </div>
        <p className="text-sm text-grotto-ink">{item.detail}</p>
        {item.status === 'OPEN' && (
          <div>
            <Label htmlFor="support-volunteer">{t('features.support.volunteer')}</Label>
            <select
              id="support-volunteer"
              className={SELECT_CLS}
              value={volunteerId}
              onChange={(e) => {
                setVolunteerId(e.target.value)
                setMissing(false)
              }}
            >
              <option value="">{t('features.tasks.selectPlaceholder')}</option>
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name}
                </option>
              ))}
            </select>
            {missing && (
              <p className="mt-1 text-xs font-semibold text-grotto-brick">
                {t('features.support.volunteerRequired')}
              </p>
            )}
          </div>
        )}
      </div>
    </Dialog>
  )
}

export default function SupportListPage() {
  const { t } = useTranslation()
  const { user } = useAuth()
  const { data: areas = [] } = useAreas()
  const { data: requests = [], isPending } = useSupportRequests()

  const isLeader = user?.role === 'LEADER'
  const myAreas = areas.filter((a) => a.leaderId === user?.id)
  const myAreaIds = new Set(myAreas.map((a) => a.id))
  const areaName = (id: string) => areas.find((a) => a.id === id)?.name ?? '—'

  // Leader: yêu cầu của khu mình lãnh; committee/admin: tất cả.
  const rows = isLeader ? requests.filter((r) => myAreaIds.has(r.areaId)) : requests

  const [creating, setCreating] = useState(false)
  const [viewingId, setViewingId] = useState<string | null>(null)
  // Theo id (không giữ object) — data luôn tươi sau mutation.
  const viewing = viewingId ? (requests.find((r) => r.id === viewingId) ?? null) : null

  const columns = useMemo(
    () => [
      {
        key: 'area',
        header: t('features.support.area'),
        render: (r: SupportRequest) => areaName(r.areaId),
      },
      {
        key: 'kind',
        header: t('features.support.kind'),
        render: (r: SupportRequest) => t(`features.support.kind.${r.kind}`),
      },
      {
        key: 'detail',
        header: t('features.support.detail'),
        render: (r: SupportRequest) => <span className="text-grotto-soft">{r.detail}</span>,
      },
      {
        key: 'status',
        header: t('common.status'),
        render: (r: SupportRequest) => <StatusTag status={r.status} />,
      },
    ],
    [t, areas],
  )

  return (
    <div>
      <PageHeader
        title={t('features.support.title')}
        sub={t('features.support.sub')}
        actions={
          isLeader &&
          myAreas.length > 0 && (
            <Button onClick={() => setCreating(true)}>
              <Plus className="size-4" />
              {t('features.support.create')}
            </Button>
          )
        }
      />

      {isPending ? (
        <p className="lbl-mono">{t('common.loading')}</p>
      ) : (
        <DataTable
          rows={rows}
          columns={columns}
          emptyText={t('features.support.empty')}
          // Committee click row để điều phối; leader chỉ xem.
          onRowClick={isLeader ? undefined : (r) => setViewingId(r.id)}
        />
      )}

      {creating && <SupportFormDialog myAreas={myAreas} onClose={() => setCreating(false)} />}
      {viewing && <SupportDetailDialog item={viewing} onClose={() => setViewingId(null)} />}
    </div>
  )
}
