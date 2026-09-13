// Dialog xử lý yêu cầu chỉnh giờ (row PENDING_FIX): hiện yêu cầu sửa +
// input giờ đã chỉnh → Duyệt (PATCH hours + CLOSED + xoá yêu cầu) hoặc
// Từ chối (chỉ xoá yêu cầu, giữ trạng thái). 1 field số nên dùng state
// tay thay RHF (pattern SupportDetailDialog).
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { Dialog } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/components/ui/toast'
import { viDate } from '@/lib/format'
import { useApproveCorrection, useRejectCorrection } from '../api'
import type { Timesheet } from '@/types'

export function CorrectionDialog({
  item,
  volunteerName,
  onClose,
}: {
  item: Timesheet
  volunteerName: string
  onClose: () => void
}) {
  const { t } = useTranslation()
  const toast = useToast()
  const approve = useApproveCorrection()
  const reject = useRejectCorrection()
  const [hours, setHours] = useState(String(item.hours))
  const [error, setError] = useState(false)

  const onApprove = async () => {
    const n = Number(hours)
    if (hours.trim() === '' || Number.isNaN(n) || n < 0) {
      setError(true)
      return
    }
    try {
      await approve.mutateAsync({ id: item.id, correctedHours: n })
      toast(t('features.timesheets.approved', { name: volunteerName, n }))
      onClose()
    } catch {
      toast(t('common.error'), 'alert')
    }
  }

  const onReject = async () => {
    try {
      await reject.mutateAsync(item.id)
      toast(t('features.timesheets.rejected', { name: volunteerName }))
      onClose()
    } catch {
      toast(t('common.error'), 'alert')
    }
  }

  return (
    <Dialog
      open
      onClose={onClose}
      title={t('features.timesheets.correctionTitle')}
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            {t('common.cancel')}
          </Button>
          <Button variant="outline" onClick={() => void onReject()} disabled={reject.isPending}>
            {t('features.timesheets.reject')}
          </Button>
          <Button onClick={() => void onApprove()} disabled={approve.isPending}>
            {t('features.timesheets.approve')}
          </Button>
        </>
      }
    >
      <div className="space-y-3">
        <p className="text-sm font-semibold text-grotto-ink">
          {volunteerName} · <span className="tabular">{viDate(item.date)}</span>
        </p>
        <p>
          <span className="font-semibold text-grotto-ink">
            {t('features.timesheets.correctionRequest')}:
          </span>{' '}
          {item.correctionRequest}
        </p>
        <p className="tabular">
          {t('features.timesheets.hours')}: {item.hours}
        </p>
        <div>
          <Label htmlFor="ts-corrected">{t('features.timesheets.correctedHours')}</Label>
          <Input
            id="ts-corrected"
            type="number"
            min={0}
            step="0.5"
            value={hours}
            aria-invalid={error}
            onChange={(e) => {
              setHours(e.target.value)
              setError(false)
            }}
          />
          {error && (
            <p className="mt-1 text-xs font-semibold text-grotto-brick">
              {t('features.timesheets.hoursRequired')}
            </p>
          )}
        </div>
      </div>
    </Dialog>
  )
}
