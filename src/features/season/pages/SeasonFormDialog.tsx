// Dialog tạo/sửa mùa — RHF + zod: year 2026–2035, start < end, budget ≥ 0.
// Error message là i18n key (pattern của Login).
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { Dialog } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/components/ui/toast'
import { useCreateSeason, useUpdateSeason } from '../api'
import type { Season } from '@/types'

const schema = z
  .object({
    year: z.coerce
      .number({ invalid_type_error: 'features.season.yearRange' })
      .int()
      .min(2026, 'features.season.yearRange')
      .max(2035, 'features.season.yearRange'),
    startDate: z.string().min(1, 'common.required'),
    endDate: z.string().min(1, 'common.required'),
    budget: z.coerce
      .number({ invalid_type_error: 'features.season.budgetInvalid' })
      .min(0, 'features.season.budgetInvalid'),
  })
  .refine((d) => !d.startDate || !d.endDate || d.startDate < d.endDate, {
    path: ['endDate'],
    message: 'features.season.endAfterStart',
  })

type FormData = z.infer<typeof schema>

export function SeasonFormDialog({
  onClose,
  season,
}: {
  onClose: () => void
  season?: Season | null // null/undefined = create
}) {
  const { t } = useTranslation()
  const toast = useToast()
  const create = useCreateSeason()
  const update = useUpdateSeason()
  const editing = Boolean(season)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    // Cha mount dialog có điều kiện (formOpen && …) → mỗi lần mở là một
    // form mới với giá trị đúng create/edit — không cần reset thủ công.
    defaultValues: season
      ? {
          year: season.year,
          startDate: season.startDate,
          endDate: season.endDate,
          budget: season.budget,
        }
      : { year: 2026, startDate: '', endDate: '', budget: 0 },
  })

  const onSubmit = async (data: FormData) => {
    try {
      if (editing && season) {
        await update.mutateAsync({ id: season.id, ...data })
        toast(t('features.season.updated', { year: data.year }))
      } else {
        await create.mutateAsync({ ...data, status: 'PLANNED' })
        toast(t('features.season.created', { year: data.year }))
      }
      onClose()
    } catch {
      toast(t('common.error'), 'alert')
    }
  }

  return (
    <Dialog
      open
      onClose={onClose}
      title={editing ? t('features.season.edit') : t('features.season.create')}
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            {t('common.cancel')}
          </Button>
          <Button type="submit" form="season-form" disabled={isSubmitting}>
            {t('common.save')}
          </Button>
        </>
      }
    >
      <form id="season-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <div>
          <Label htmlFor="season-year">{t('features.season.year')}</Label>
          <Input id="season-year" type="number" inputMode="numeric" {...register('year')} />
          {errors.year && (
            <p className="mt-1 text-xs font-semibold text-grotto-brick">
              {t(errors.year.message ?? '')}
            </p>
          )}
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="season-start">{t('features.season.startDate')}</Label>
            <Input id="season-start" type="date" {...register('startDate')} />
            {errors.startDate && (
              <p className="mt-1 text-xs font-semibold text-grotto-brick">
                {t(errors.startDate.message ?? '')}
              </p>
            )}
          </div>
          <div>
            <Label htmlFor="season-end">{t('features.season.endDate')}</Label>
            <Input id="season-end" type="date" {...register('endDate')} />
            {errors.endDate && (
              <p className="mt-1 text-xs font-semibold text-grotto-brick">
                {t(errors.endDate.message ?? '')}
              </p>
            )}
          </div>
        </div>
        <div>
          <Label htmlFor="season-budget">{t('features.season.budget')}</Label>
          <Input id="season-budget" type="number" inputMode="numeric" min={0} {...register('budget')} />
          {errors.budget && (
            <p className="mt-1 text-xs font-semibold text-grotto-brick">
              {t(errors.budget.message ?? '')}
            </p>
          )}
        </div>
      </form>
    </Dialog>
  )
}
