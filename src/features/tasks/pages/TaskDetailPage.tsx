// Chi tiết việc (LEADER, route /leader/tasks/:id): 2 cột — trái info panel
// (mọi field + materials chips + StatusTag) + timeline (submittedNotes +
// status hiện tại); phải danh sách phân công (chip + badge trạng thái
// PENDING/ACCEPTED/DECLINED, X = gỡ), cảnh báo khi TNV từ chối (đổi người /
// mở YC hỗ trợ), dialog phân công TNV (sort khớp kỹ năng, hiện lịch rảnh) và
// các nút chuyển trạng thái.
// Mount dưới /committee/* → read-only (không nút thao tác).
import { useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ArrowLeft, Check, Plus, UserPlus, X } from 'lucide-react'
import { PageHeader } from '@/components/shared/PageHeader'
import { EmptyState } from '@/components/shared/EmptyState'
import { StatusTag } from '@/components/shared/StatusTag'
import { ConfirmDialog } from '@/components/shared/ConfirmDialog'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Dialog } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { useToast } from '@/components/ui/toast'
import { useAreas } from '@/features/areas/api'
import { useMaterials } from '@/features/materials/api'
import { useUsers } from '@/features/users/api'
import {
  assignmentStatus,
  taskAssignmentList,
  useApproveCompletion,
  useInviteVolunteer,
  useRemoveAssignment,
  useRequestRevision,
  useSubmitReview,
  useTask,
  useUpdateTask,
} from '../api'
import type { Task, User } from '@/types'
import { viDate } from '@/lib/format'

const TEXTAREA_CLS =
  'mt-1 w-full rounded-md border border-grotto-hair bg-grotto-panel px-3 py-2 text-sm text-grotto-ink transition-colors focus-visible:outline-none focus-visible:border-grotto-terra focus-visible:ring-2 focus-visible:ring-grotto-terra/30'

const CHIP_CLS =
  'inline-flex items-center gap-1.5 rounded-full border border-grotto-hair bg-grotto-panel px-2.5 py-0.5 text-xs font-semibold text-grotto-ink'

// 1 dòng TNV trong dialog phân công: tự dùng hook invite theo user đó.
// Hiện kỹ năng khớp + lịch rảnh để leader "chọn người phù hợp".
const WEEKDAY_SHORT: Record<string, string> = {
  T2: 'T2', T3: 'T3', T4: 'T4', T5: 'T5', T6: 'T6', T7: 'T7', CN: 'CN',
}

function VolunteerRow({ task, user }: { task: Task; user: User }) {
  const { t } = useTranslation()
  const toast = useToast()
  const invite = useInviteVolunteer(task.id, user.id)
  const status = assignmentStatus(task, user.id)
  const matched = user.skills.filter((s) => task.skills.includes(s)).length
  const onInvite = async () => {
    try {
      await invite.mutateAsync()
      toast(t('features.tasks.invited', { name: user.name }))
    } catch {
      toast(t('common.error'), 'alert')
    }
  }
  return (
    <div className="flex items-center justify-between gap-3 border-b border-grotto-hair/60 py-2 last:border-0">
      <div className="min-w-0">
        <p className="text-sm font-semibold text-grotto-ink">{user.name}</p>
        <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
          {matched > 0 && (
            <span className="lbl text-[11px] text-grotto-moss">
              {t('features.tasks.matchedSkills', { n: matched })}
            </span>
          )}
          {user.availability?.length ? (
            <span className="lbl text-[11px] text-grotto-soft">
              {t('features.tasks.availableOn', {
                days: user.availability.map((d) => WEEKDAY_SHORT[d] ?? d).join(' '),
              })}
            </span>
          ) : null}
        </div>
      </div>
      {/* Đã có phản hồi → hiện badge trạng thái thay cho nút mời. */}
      {status ? (
        <StatusTag status={status} />
      ) : (
        <Button size="sm" variant="outline" onClick={onInvite}>
          <Plus className="size-4" />
          {t('features.tasks.inviteVolunteer')}
        </Button>
      )}
    </div>
  )
}

// Dialog phân công: mọi user, khớp kỹ năng nhiều nhất đứng đầu.
function AssignDialog({ task, onClose }: { task: Task; onClose: () => void }) {
  const { t } = useTranslation()
  const { data: users = [] } = useUsers()
  const ranked = [...users].sort(
    (a, b) =>
      b.skills.filter((s) => task.skills.includes(s)).length -
      a.skills.filter((s) => task.skills.includes(s)).length,
  )
  return (
    <Dialog open onClose={onClose} title={t('features.tasks.assignTitle')}>
      <div className="max-h-80 overflow-y-auto">
        {ranked.map((u) => (
          <VolunteerRow key={u.id} task={task} user={u} />
        ))}
      </div>
    </Dialog>
  )
}

// Assignee chip + nút X gỡ phân công (ẩn X khi readOnly) + badge trạng thái.
function AssigneeChip({ task, user, readOnly }: { task: Task; user: User; readOnly?: boolean }) {
  const { t } = useTranslation()
  const toast = useToast()











    const remove = useRemoveAssignment(task.id, user.id)
  const status = assignmentStatus(task, user.id) ?? 'ACCEPTED'
  const onRemove = async () => {
    try {
      await remove.mutateAsync()
      toast(t('features.tasks.unassigned', { name: user.name }))
    } catch {
      toast(t('common.error'), 'alert')
    }
  }
  return (
    <span className={CHIP_CLS}>
      {user.name}
      <StatusTag status={status} />
      {!readOnly && (
        <button
          type="button"
          aria-label={t('features.tasks.unassign', { name: user.name })}
          onClick={onRemove}
          className="text-grotto-soft transition-colors hover:text-grotto-brick"
        >
          <X className="size-3.5" />
        </button>
      )}
    </span>
  )
}

// Dialog 1 textarea (note nộp duyệt / lý do sửa) — controlled state, không
// cần RHF cho 1 field.
function NoteDialog({
  title,
  label,
  requiredMsg,
  submitLabel,
  onSubmit,
  onClose,
}: {
  title: string
  label: string
  requiredMsg: string
  submitLabel: string
  onSubmit: (note: string) => void
  onClose: () => void
}) {
  const { t } = useTranslation()
  const [note, setNote] = useState('')
  const [error, setError] = useState(false)
  return (
    <Dialog
      open
      onClose={onClose}
      title={title}
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            {t('common.cancel')}
          </Button>
          <Button
            onClick={() => {
              if (!note.trim()) {
                setError(true)
                return
              }
              onSubmit(note.trim())
            }}
          >
            {submitLabel}
          </Button>
        </>
      }
    >
      <div>
        <Label htmlFor="task-note">{label}</Label>
        <textarea
          id="task-note"
          rows={3}
          className={TEXTAREA_CLS}
          value={note}
          onChange={(e) => {
            setNote(e.target.value)
            setError(false)
          }}
        />
        {error && <p className="mt-1 text-xs font-semibold text-grotto-brick">{requiredMsg}</p>}
      </div>
    </Dialog>
  )
}

export default function TaskDetailPage() {
  const { t } = useTranslation()
  const toast = useToast()
  const { id = '' } = useParams()
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const readOnly = pathname.startsWith('/committee/')

  const { data: task, isPending } = useTask(id)
  const { data: areas = [] } = useAreas()
  const { data: users = [] } = useUsers()
  const { data: materials = [] } = useMaterials(task?.areaId)

  const update = useUpdateTask()
  const submitReview = useSubmitReview(id)
  const requestRevision = useRequestRevision(id)
  const approve = useApproveCompletion(id)

  const [assigning, setAssigning] = useState(false)
  const [reviewing, setReviewing] = useState(false)
  const [approving, setApproving] = useState(false)
  const [revising, setRevising] = useState(false)

  const run = async (fn: () => Promise<unknown>, msg: string) => {
    try {
      await fn()
      toast(msg)
    } catch {
      toast(t('common.error'), 'alert')
    }
  }

  if (isPending) return <p className="lbl">{t('common.loading')}</p>
  if (!task) {
    return (
      <div>
        <PageHeader title={t('features.tasks.title')} actions={
          <Button variant="outline" onClick={() => navigate('/leader/tasks')}>
            <ArrowLeft className="size-4" />
            {t('common.back')}
          </Button>
        } />
        <EmptyState text={t('features.tasks.notFound')} />
      </div>
    )
  }

      const area = areas.find((a) => a.id === task.areaId)
  const taskMaterials = materials.filter((m) => task.materialIds.includes(m.id))
  const assignments = taskAssignmentList(task)
  const assignees = assignments
    .map((a) => ({ ...a, user: users.find((u) => u.id === a.volunteerId) }))
    .filter((a): a is typeof a & { user: User } => Boolean(a.user))
  const acceptedCount = assignments.filter((a) => a.status === 'ACCEPTED').length
  const declinedList = assignees.filter((a) => a.status === 'DECLINED')
  const pendingCount = assignments.filter((a) => a.status === 'PENDING').length
  const isDraft = task.status === 'DRAFT'

  // Info panel: label mono + giá trị, 2 cột cho field ngắn.
  const field = (label: string, value: string) => (
    <div>
      <p className="lbl">{label}</p>
      <p className="mt-0.5 text-sm font-semibold text-grotto-ink">{value}</p>
    </div>
  )

  return (
    <div>
      <PageHeader
        title={task.title}
        sub={`${area?.name ?? '—'} · ${viDate(task.dueDate)}`}
        actions={
          <Button variant="outline" onClick={() => navigate('/leader/tasks')}>
            <ArrowLeft className="size-4" />
            {t('common.back')}
          </Button>
        }
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Trái: info + timeline. */}
        <div className="space-y-6 lg:col-span-2">
          <Card className="p-6">
            <div className="flex items-start justify-between gap-4">
              <p className="text-sm text-grotto-soft">{task.description}</p>
              <StatusTag status={task.status} />
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {field(t('features.tasks.area'), area?.name ?? '—')}
              {field(t('features.tasks.estimateHours'), `${task.estimateHours} ${t('features.tasks.hours')}`)}
              {field(t('features.tasks.volunteersNeeded'), String(task.volunteersNeeded))}
              {field(t('features.tasks.dueDate'), viDate(task.dueDate))}
            </div>
                        <div className="mt-4 space-y-3">
              <div>
                <p className="lbl">{t('features.tasks.completionCriteria')}</p>
                {task.completionCriteria ? (
                  <p className="mt-0.5 whitespace-pre-line text-sm text-grotto-ink">
                    {task.completionCriteria}
                  </p>
                ) : (
                  <p className="mt-0.5 text-sm text-grotto-soft">
                    {t('features.tasks.criteriaNone')}
                  </p>
                )}
              </div>
              <div>
                <p className="lbl">{t('features.tasks.skills')}</p>
                <div className="mt-1 flex flex-wrap gap-1.5">
                  {task.skills.length ? (
                    task.skills.map((s) => (
                      <span key={s} className={CHIP_CLS}>
                        {s}
                      </span>
                    ))
                  ) : (
                    <span className="text-sm text-grotto-soft">—</span>
                  )}
                </div>
              </div>
                            <div>
                <p className="lbl">{t('features.tasks.materials')}</p>
                <div className="mt-1 flex flex-wrap gap-1.5">
                  {taskMaterials.length ? (
                    taskMaterials.map((m) => {
                      const qty = task.materialNeeds?.[m.id]
                      return (
                        <span key={m.id} className={CHIP_CLS}>
                          {m.name}
                          {typeof qty === 'number' && qty > 0 ? (
                            <span className="tabular text-grotto-terra">
                              ×{qty} {m.unit}
                            </span>
                          ) : null}
                        </span>
                      )
                    })
                  ) : (
                    <span className="text-sm text-grotto-soft">{t('features.tasks.materialNone')}</span>
                  )}
                </div>
              </div>
              <div>
                <p className="lbl">{t('features.tasks.photos')}</p>
                <div className="mt-1 flex items-center gap-1.5">
                  <span className="tabular text-sm font-semibold text-grotto-ink">
                    {task.submittedPhotos}
                  </span>
                  {Array.from({ length: Math.min(task.submittedPhotos, 8) }).map((_, i) => (
                    <div
                      key={i}
                      aria-hidden
                      className="size-8 rounded-grotto border border-grotto-hair bg-grotto-hair/40"
                    />
                  ))}
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <p className="lbl">{t('features.tasks.timeline')}</p>
            <div className="mt-2 space-y-2">
              <div className="flex items-center gap-2">
                <StatusTag status={task.status} />
                <span className="text-sm text-grotto-soft">{viDate(task.dueDate)}</span>
              </div>
              {task.submittedNotes && (
                <p className="rounded-grotto border border-grotto-hair bg-grotto-panel p-3 text-sm text-grotto-ink">
                  <span className="lbl mr-2">{t('features.tasks.notes')}</span>
                  {task.submittedNotes}
                </p>
              )}
            </div>
          </Card>
        </div>

        {/* Phải: assignees + thao tác leader. */}
        <div className="space-y-6">
                    <Card className="p-6">
            <div className="flex items-center justify-between gap-3">
              <p className="lbl">
                {t('features.tasks.assignees')}{' '}
                <span className="tabular">
                  {acceptedCount}/{task.volunteersNeeded}
                </span>
              </p>
              {!readOnly && (
                <Button size="sm" onClick={() => setAssigning(true)}>
                  <UserPlus className="size-4" />
                  {t('features.tasks.assign')}
                </Button>
              )}
            </div>

            {/* Tổng hợp phản hồi: số đã nhận / chờ xác nhận. */}
            {assignments.length ? (
              <p className="mt-2 text-xs text-grotto-soft">
                {t('features.tasks.assignmentSummary', {
                  accepted: acceptedCount,
                  pending: pendingCount,
                })}
              </p>
            ) : null}

            <div className="mt-3 flex flex-wrap gap-2">
              {assignees.length ? (
                assignees.map((a) => (
                  <AssigneeChip
                    key={a.volunteerId}
                    task={task}
                    user={a.user}
                    readOnly={readOnly}
                  />
                ))
              ) : (
                <p className="text-sm text-grotto-soft">{t('features.tasks.assignNone')}</p>
              )}
            </div>

            {/* Cảnh báo TNV từ chối → leader gợi ý chọn người khác / mở YC hỗ trợ. */}
            {!readOnly && declinedList.length > 0 && (
              <div className="mt-3 rounded-grotto border border-grotto-brick/40 bg-grotto-brick/8 p-3">
                <p className="text-xs font-semibold text-grotto-brick">
                  {t('features.tasks.declinedAlert', { n: declinedList.length })}
                </p>
                <ul className="mt-1 space-y-0.5">
                  {declinedList.map((a) => (
                    <li key={a.volunteerId} className="text-xs text-grotto-ink">
                      <span className="font-semibold">{a.user.name}</span>
                      {a.note ? ` — ${a.note}` : ''}
                    </li>
                  ))}
                </ul>
                <div className="mt-2 flex flex-wrap gap-2">
                  <Button size="sm" variant="outline" onClick={() => setAssigning(true)}>
                    {t('features.tasks.pickAnother')}
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => navigate('/leader/support')}
                  >
                    {t('features.tasks.openSupport')}
                  </Button>
                </div>
              </div>
            )}

            {/* Gợi ý khi chưa đủ người nhưng đã mời — chờ TNV xác nhận. */}
            {!readOnly && pendingCount > 0 && acceptedCount < task.volunteersNeeded && (
              <p className="mt-3 text-xs text-grotto-straw">
                {t('features.tasks.awaitingResponse', { n: pendingCount })}
              </p>
            )}
          </Card>

                    {!readOnly && (
            <Card className="space-y-2 p-6">
              <p className="lbl">{t('common.actions')}</p>
              {isDraft ? (
                <>
                  <Button
                    className="w-full"
                    onClick={() =>
                      run(
                        () => update.mutateAsync({ id: task.id, status: 'TODO' }),
                        t('features.tasks.published', { name: task.title }),
                      )
                    }
                  >
                    {t('features.tasks.publish')}
                  </Button>
                  <p className="text-xs text-grotto-soft">{t('features.tasks.publishHint')}</p>
                </>
              ) : null}
              {task.status === 'TODO' && (
                <>
                  <Button
                    className="w-full"
                    onClick={() =>
                      run(
                        () => update.mutateAsync({ id: task.id, status: 'DOING' }),
                        t('features.tasks.started', { name: task.title }),
                      )
                    }
                  >
                    {t('features.tasks.start')}
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() =>
                      run(
                        () => update.mutateAsync({ id: task.id, status: 'DRAFT' }),
                        t('features.tasks.unpublished', { name: task.title }),
                      )
                    }
                  >
                    {t('features.tasks.unpublish')}
                  </Button>
                </>
              )}
              {task.status === 'DOING' && (
                <Button className="w-full" onClick={() => setReviewing(true)}>
                  {t('features.tasks.submitReview')}
                </Button>
              )}
              {task.status === 'REVIEW' && (
                <>
                  <Button className="w-full" onClick={() => setApproving(true)}>
                    <Check className="size-4" />
                    {t('features.tasks.approve')}
                  </Button>
                  <Button variant="outline" className="w-full" onClick={() => setRevising(true)}>
                    {t('features.tasks.requestRevision')}
                  </Button>
                </>
              )}
            </Card>
          )}
        </div>
      </div>

      {assigning && <AssignDialog task={task} onClose={() => setAssigning(false)} />}
      {reviewing && (
        <NoteDialog
          title={t('features.tasks.reviewTitle')}
          label={t('features.tasks.reviewNote')}
          requiredMsg={t('features.tasks.noteRequired')}
          submitLabel={t('features.tasks.submitReview')}
          onSubmit={(n) => {
            void run(
              () => submitReview.mutateAsync(n),
              t('features.tasks.reviewSubmitted', { name: task.title }),
            )
            setReviewing(false)
          }}
          onClose={() => setReviewing(false)}
        />
      )}
      {revising && (
        <NoteDialog
          title={t('features.tasks.revisionTitle')}
          label={t('features.tasks.revisionNote')}
          requiredMsg={t('features.tasks.reasonRequired')}
          submitLabel={t('features.tasks.requestRevision')}
          onSubmit={(n) => {
            void run(
              () => requestRevision.mutateAsync(n),
              t('features.tasks.revisionRequested', { name: task.title }),
            )
            setRevising(false)
          }}
          onClose={() => setRevising(false)}
        />
      )}
      <ConfirmDialog
        open={approving}
        title={t('features.tasks.approveTitle')}
        description={t('features.tasks.approveConfirm', { name: task.title })}
        confirmLabel={t('features.tasks.approve')}
        onConfirm={() =>
          run(() => approve.mutateAsync(), t('features.tasks.approved', { name: task.title }))
        }
        onClose={() => setApproving(false)}
      />
    </div>
  )
}
