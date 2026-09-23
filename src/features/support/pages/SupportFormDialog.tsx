// Dialog tạo yêu cầu hỗ trợ (leader): kind select, detail textarea, khu vực
// khóa về khu leader lãnh (1 khu → ẩn select, nhiều khu → chọn trong list).
// Kèm số người, kỹ năng (kind SKILL), thời gian — phục vụ luồng hỗ trợ nhân lực
// liên cộng đoàn. RHF + zod, message = i18n key. Create POST status 'OPEN'.
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { Dialog } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { useToast } from '@/components/ui/toast'
import { useSkills } from '@/features/tasks/api'
import { useCreateSupportRequest } from '../api'
import type { SupportRequest, WorkArea } from '@/types'

export const SELECT_CLS =
  'mt-1 flex h-8 w-full rounded-md border border-grotto-hair bg-grotto-panel px-3.5 text-sm text-grotto-ink transition-colors focus-visible:outline-none focus-visible:border-grotto-terra focus-visible:ring-2 focus-visible:ring-grotto-terra/30'

export const TEXTAREA_CLS =
  'mt-1 w-full rounded-md border border-grotto-hair bg-grotto-panel px-3.5 text-sm text-grotto-ink transition-colors focus-visible:outline-none focus-visible:border-grotto-terra focus-visible:ring-2 focus-visible:ring-grotto-terra/30'

const INPUT_CLS = SELECT_CLS

const KINDS: SupportRequest['kind'][] = ['PEOPLE', 'SKILL', 'MATERIAL']

// kind là string trong form (option '' placeholder), ép về enum lúc submit.
// volunteersNeeded coerce: '' → 0 (khu không cần thêm người).
const schema = z.object({
  areaId: z.string().min(1, 'features.support.areaRequired'),
  kind: z.string().min(1, 'features.support.kindRequired'),
  detail: z.string().trim().min(1, 'features.support.detailRequired'),
  volunteersNeeded: z.coerce.number().int().min(0).max(999),
  supportTime: z.string().trim().optional(),
})
type FormData = z.infer<typeof schema>

export function SupportFormDialog({
  myAreas,
  onClose,
}: {
  myAreas: WorkArea[] // khu leader lãnh — tối thiểu 1 (page đã chặn)
  onClose: () => void
}) {
    const { t } = useTranslation()
  const toast = useToast()
  const create = useCreateSupportRequest()
  const { data: skills = [] } = useSkills()
  const [selectedSkills, setSelectedSkills] = useState<string[]>([])
  const fixedAreaId = myAreas.length === 1 ? myAreas[0].id : undefined

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    // Cha mount có điều kiện → defaultValues theo prop là đủ.
    defaultValues: { areaId: fixedAreaId ?? '', kind: '', detail: '', volunteersNeeded: 1 },
  })

  // Kỹ năng chỉ có ý nghĩa với kind = SKILL; số người hiện khi kind ≠ MATERIAL.
  const kind = watch('kind')
  const showPeople = kind === 'PEOPLE' || kind === 'SKILL'
  const showSkills = kind === 'SKILL'

  const onSubmit = async (data: FormData) => {
    try {
      const area = myAreas.find((a) => a.id === data.areaId)
      await create.mutateAsync({
        areaId: data.areaId,
        communityId: area?.communityId,
        kind: data.kind as SupportRequest['kind'],
        detail: data.detail,
        status: 'OPEN',
        volunteersNeeded: showPeople ? data.volunteersNeeded : 0,
        skills: showSkills ? selectedSkills : [],
        supportTime: data.supportTime?.trim() || undefined,
        taskAreaId: data.areaId,
        fulfill: showPeople ? 'OPEN' : 'FULFILLED',
      })
      toast(t('features.support.created'))
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
      title={t('features.support.createTitle')}
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            {t('common.cancel')}
          </Button>
          <Button type="submit" form="support-form" disabled={isSubmitting}>
            {t('common.save')}
          </Button>
        </>
      }
    >
      <form id="support-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        {fixedAreaId ? null : (
          <div>
            <Label htmlFor="support-area">{t('features.support.area')}</Label>
            <select id="support-area" className={SELECT_CLS} {...register('areaId')}>
              <option value="">{t('features.tasks.selectPlaceholder')}</option>
              {myAreas.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name}
                </option>
              ))}
            </select>
            {err(errors.areaId?.message)}
          </div>
        )}
        <div>
          <Label htmlFor="support-kind">{t('features.support.kind')}</Label>
          <select id="support-kind" className={SELECT_CLS} {...register('kind')}>
            <option value="">{t('features.tasks.selectPlaceholder')}</option>
            {KINDS.map((k) => (
              <option key={k} value={k}>
                {t(`features.support.kind.${k}`)}
              </option>
            ))}
          </select>
                    {err(errors.kind?.message)}
        </div>
        {showPeople && (
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="support-people">{t('features.support.volunteersNeeded')}</Label>
              <input
                id="support-people"
                type="number"
                min={1}
                className={INPUT_CLS}
                {...register('volunteersNeeded')}
              />
              {err(errors.volunteersNeeded?.message)}
            </div>
            <div>
              <Label htmlFor="support-time">{t('features.support.supportTime')}</Label>
              <input
                id="support-time"
                className={INPUT_CLS}
                placeholder={t('features.support.supportTimePlaceholder')}
                {...register('supportTime')}
              />
            </div>
          </div>
        )}
        {showSkills && (
          <div>
            <Label>{t('features.support.skills')}</Label>
            <div className="mt-1 flex flex-wrap gap-1.5">
              {skills.map((s) => {
                const on = selectedSkills.includes(s)
                return (
                  <button
                    key={s}
                    type="button"
                    onClick={() =>
                      setSelectedSkills(
                        on ? selectedSkills.filter((x) => x !== s) : [...selectedSkills, s],
                      )
                    }
                    className={
                      on
                        ? 'rounded-full border border-grotto-terra bg-grotto-terra px-2.5 py-1 text-xs font-semibold text-grotto-panel'
                        : 'rounded-full border border-grotto-hair bg-grotto-panel px-2.5 py-1 text-xs font-semibold text-grotto-soft hover:border-grotto-terra hover:text-grotto-terra'
                    }
                  >
                    {s}
                  </button>
                )
              })}
            </div>
          </div>
        )}
        <div>
          <Label htmlFor="support-detail">{t('features.support.detail')}</Label>
          <textarea id="support-detail" rows={3} className={TEXTAREA_CLS} {...register('detail')} />
          {err(errors.detail?.message)}
        </div>
      </form>
    </Dialog>
  )
}

