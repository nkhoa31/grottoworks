// Dialog tạo/sửa việc — RHF + zod: title, area (leader khóa về khu của mình
// qua fixedAreaId; committee/admin tự chọn), skills (checkbox group
// /api/skills), estimateHours, volunteersNeeded, materialIds (checkbox group
// vật tư của khu đang chọn), dueDate. Select native + style trùng Input.
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { Dialog } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/components/ui/toast'
import { useAreas } from '@/features/areas/api'
import { useMaterials } from '@/features/materials/api'
import { useCreateTask, useSkills, useUpdateTask } from '../api'
import type { Task } from '@/types'

export const SELECT_CLS =
  'flex h-8 w-full rounded-md border border-grotto-hair bg-grotto-panel px-3.5 text-sm text-grotto-ink transition-colors focus-visible:outline-none focus-visible:border-grotto-terra focus-visible:ring-2 focus-visible:ring-grotto-terra/30'

// Checkbox group: label + hàng ô vuông, chữ nhỏ.
const CHECK_CLS =
  'size-4 rounded border border-grotto-hair bg-grotto-panel accent-grotto-terra'

// Trống → undefined để báo lỗi thay vì coerce 0 (pattern SeasonFormDialog);
// ràng buộc min/int nằm trong schema con vì preprocess trả ZodEffects.
const num = (inner: z.ZodNumber) =>
  z.preprocess((v) => (v === '' || v == null ? undefined : v), inner)

const schema = z.object({
  title: z.string().trim().min(1, 'features.tasks.nameRequired'),
  description: z.string(),
  areaId: z.string().min(1, 'features.tasks.areaRequired'),
  skills: z.array(z.string()),
  estimateHours: num(
    z.coerce
      .number({ invalid_type_error: 'features.tasks.hoursInvalid' })
      .min(0, 'features.tasks.hoursInvalid'),
  ),
  volunteersNeeded: num(
    z.coerce
      .number({ invalid_type_error: 'features.tasks.neededInvalid' })
      .min(1, 'features.tasks.neededInvalid')
      .int('features.tasks.neededInvalid'),
  ),
  materialIds: z.array(z.string()),
  dueDate: z.string().min(1, 'features.tasks.dueDateRequired'),
  completionCriteria: z.string().trim().min(1, 'features.tasks.criteriaRequired'),
})

type FormData = z.infer<typeof schema>

const TEXTAREA_CLS =
  'mt-1 w-full rounded-md border border-grotto-hair bg-grotto-panel px-3.5 py-2 text-sm text-grotto-ink transition-colors focus-visible:outline-none focus-visible:border-grotto-terra focus-visible:ring-2 focus-visible:ring-grotto-terra/30'

export function TaskFormDialog({
  onClose,
  task,
  fixedAreaId,
}: {
  onClose: () => void
  task?: Task | null // null/undefined = create
  fixedAreaId?: string // leader: khóa khu (không hiện select khu)
}) {
  const { t } = useTranslation()
  const toast = useToast()
  const { data: areas = [] } = useAreas()
  const { data: skills = [] } = useSkills()
  const create = useCreateTask()
  const update = useUpdateTask()
  const editing = Boolean(task)

    const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    // Cha mount dialog có điều kiện → mỗi lần mở là form mới create/edit.
    defaultValues: task
      ? {
          title: task.title,
          description: task.description,
          areaId: task.areaId,
          skills: task.skills,
          estimateHours: task.estimateHours,
          volunteersNeeded: task.volunteersNeeded,
          materialIds: task.materialIds,
          dueDate: task.dueDate,
          completionCriteria: task.completionCriteria ?? '',
        }
      : {
          title: '',
          description: '',
          areaId: fixedAreaId ?? '',
          skills: [],
          estimateHours: 0,
          volunteersNeeded: 1,
          materialIds: [],
          dueDate: '',
          completionCriteria: '',
        },
  })

    const areaId = watch('areaId')
  const { data: materials = [] } = useMaterials(areaId || undefined)
  const pickedMaterials = watch('materialIds')

  // Nhu cầu vật tư định lượng: materialId → số lượng cần cho task.
  const [materialNeeds, setMaterialNeeds] = useState<Record<string, number>>(
    task?.materialNeeds ?? {},
  )

  // Trạng thái đích khi lưu: giữ nguyên task đang sửa, còn tạo mới thì do nút
  // "Lưu nháp" (DRAFT) hay "Lưu & công bố" (TODO = đã công bố) quyết định.
  const onSubmit = async (data: FormData, publish: boolean) => {
    try {
      const materialNeedsOut = Object.fromEntries(
        data.materialIds.map((id) => [id, materialNeeds[id] ?? 0]),
      )
      if (editing && task) {
        await update.mutateAsync({
          id: task.id,
          ...data,
          materialNeeds: materialNeedsOut,
          // Sửa task đang nháp: nút công bố nâng lên TODO, nút nháp giữ DRAFT.
          status: task.status === 'DRAFT' && publish ? 'TODO' : task.status,
        })
        toast(t('features.tasks.updated', { name: data.title }))
      } else {
        await create.mutateAsync({
          ...data,
          materialNeeds: materialNeedsOut,
          assignees: [],
          status: publish ? 'TODO' : 'DRAFT',
          submittedPhotos: 0,
        })
        toast(
          publish
            ? t('features.tasks.published', { name: data.title })
            : t('features.tasks.created', { name: data.title }),
        )
      }
      onClose()
    } catch {
      toast(t('common.error'), 'alert')
    }
  }

  const err = (msg?: string) =>
    msg ? <p className="mt-1 text-xs font-semibold text-grotto-brick">{t(msg)}</p> : null

        return (
    <Dialog
      open
      onClose={onClose}
      size="lg"
      title={editing ? t('features.tasks.edit') : t('features.tasks.create')}
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            {t('common.cancel')}
          </Button>
          <Button
            type="button"
            variant="outline"
            disabled={isSubmitting}
            onClick={handleSubmit((d) => void onSubmit(d, false))}
          >
            {t('features.tasks.saveDraft')}
          </Button>
          <Button type="submit" form="task-form" disabled={isSubmitting}>
            {t('features.tasks.saveAndPublish')}
          </Button>
        </>
      }
    >
      {/* 2 cột: TRÁI = ô text dài (tên, mô tả, tiêu chí); PHẢI = field ngắn
          (khu/số/ngày/kỹ năng/vật tư) → giảm chiều cao dialog đáng kể. */}
      <form
        id="task-form"
        onSubmit={handleSubmit((d) => void onSubmit(d, true))}
        className="grid grid-cols-1 gap-x-6 gap-y-4 md:grid-cols-2"
        noValidate
      >
                {/* ── Cột trái: các ô nhập text ─────────────────────────────── */}
        <div className="space-y-4">
          <div>
            <Label htmlFor="task-title">{t('features.tasks.name')}</Label>
            <Input id="task-title" {...register('title')} />
            {err(errors.title?.message)}
          </div>
          <div>
            <Label htmlFor="task-description">{t('features.tasks.description')}</Label>
            <textarea
              id="task-description"
              rows={2}
              className={TEXTAREA_CLS}
              {...register('description')}
            />
          </div>
          <div>
            <Label htmlFor="task-criteria">{t('features.tasks.completionCriteria')}</Label>
            <textarea
              id="task-criteria"
              rows={4}
              className={TEXTAREA_CLS}
              placeholder={t('features.tasks.completionCriteriaHint')}
              {...register('completionCriteria')}
            />
            {err(errors.completionCriteria?.message)}
          </div>
        </div>

        {/* ── Cột phải: select, số, ngày, checkbox ──────────────────── */}
        <div className="space-y-4">
          {fixedAreaId ? null : (
            <div>
              <Label htmlFor="task-area">{t('features.tasks.area')}</Label>
              <select id="task-area" className={SELECT_CLS} {...register('areaId')}>
                <option value="">{t('features.tasks.selectPlaceholder')}</option>
                {areas.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name}
                  </option>
                ))}
              </select>
              {err(errors.areaId?.message)}
            </div>
          )}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="task-hours">{t('features.tasks.estimateHours')}</Label>
              <Input id="task-hours" type="number" min={0} step="0.5" {...register('estimateHours')} />
              {err(errors.estimateHours?.message)}
            </div>
            <div>
              <Label htmlFor="task-needed">{t('features.tasks.volunteersNeeded')}</Label>
              <Input id="task-needed" type="number" min={1} step="1" {...register('volunteersNeeded')} />
              {err(errors.volunteersNeeded?.message)}
            </div>
          </div>
          <div>
            <Label htmlFor="task-due">{t('features.tasks.dueDate')}</Label>
            <Input id="task-due" type="date" {...register('dueDate')} />
            {err(errors.dueDate?.message)}
          </div>
          <div>
            <Label>{t('features.tasks.skills')}</Label>
            <div className="flex flex-wrap gap-x-4 gap-y-1.5 pt-1">
              {skills.map((s) => (
                <label key={s} className="flex items-center gap-1.5 text-sm text-grotto-ink">
                  <input type="checkbox" value={s} className={CHECK_CLS} {...register('skills')} />
                  {s}
                </label>
              ))}
            </div>
          </div>
          <div>
            <Label>{t('features.tasks.materials')}</Label>
            {materials.length ? (
              <div className="space-y-1.5 pt-1">
                {materials.map((m) => {
                  const checked = (pickedMaterials ?? []).includes(m.id)
                  return (
                    <div key={m.id} className="flex items-center gap-2">
                      <label className="flex flex-1 items-center gap-1.5 text-sm text-grotto-ink">
                        <input
                          type="checkbox"
                          value={m.id}
                          className={CHECK_CLS}
                          {...register('materialIds')}
                        />
                        {m.name} ({m.unit})
                      </label>
                      {checked && (
                        <Input
                          type="number"
                          min={0}
                          step={1}
                          aria-label={`${t('features.tasks.materialQty')} — ${m.name}`}
                          className="h-8 w-24"
                          value={materialNeeds[m.id] ?? ''}
                          onChange={(e) =>
                            setMaterialNeeds({
                              ...materialNeeds,
                              [m.id]: Number(e.target.value) || 0,
                            })
                          }
                        />
                      )}
                    </div>
                  )
                })}
              </div>
            ) : (
              <p className="pt-1 text-sm text-grotto-soft">{t('features.tasks.materialNone')}</p>
            )}
          </div>
        </div>
      </form>
    </Dialog>
  )
}
