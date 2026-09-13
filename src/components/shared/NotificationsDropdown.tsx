// Dropdown thông báo từ AppShell: chuông mở panel 10 activity mới nhất
// (GET /api/activity). Dot đỏ khi có activity mới hơn timestamp đã đọc
// (localStorage 'grotto-notif-read') — mở panel = đánh dấu đã đọc.
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useQuery } from '@tanstack/react-query'
import { Activity as ActivityIcon, Bell, CheckCircle2, Plus, Trash2 } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { api } from '@/lib/api'
import { relTime } from '@/lib/format'
import { useUsers } from '@/features/users/api'
import { EmptyState } from './EmptyState'
import type { ActivityLog } from '@/types'

const READ_KEY = 'grotto-notif-read'

// Icon theo động từ trong action (seed/logMutation là chuỗi tiếng Việt).
const ICON_RULES: [string, LucideIcon][] = [
  ['hoàn thành', CheckCircle2],
  ['tạo', Plus],
  ['thêm', Plus],
  ['đăng ký', Plus],
  ['mở', Plus],
  ['duyệt', CheckCircle2],
  ['xoá', Trash2],
  ['từ chối', Trash2],
]
const iconOf = (action: string) => ICON_RULES.find(([k]) => action.includes(k))?.[1] ?? ActivityIcon

export function NotificationsDropdown() {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)
  const [readAt, setReadAt] = useState(() => Number(localStorage.getItem(READ_KEY) ?? 0))
  const { data: logs = [] } = useQuery({
    queryKey: ['activity'],
    queryFn: () => api<ActivityLog[]>('/activity'),
  })
  const { data: users = [] } = useUsers()

  const items = logs.slice(0, 10)
  const hasUnread = items.some((x) => new Date(x.at).getTime() > readAt)
  const nameOf = (id: string) => users.find((u) => u.id === id)?.name ?? id

  const toggle = () => {
    if (!open) {
      // Đánh dấu đã đọc lúc mở panel: lưu timestamp của activity mới nhất
      // (dùng Date.now() sẽ sai khi seed có mốc tương lai — dot không bao giờ tắt).
      const now = items.length ? new Date(items[0].at).getTime() : Date.now()
      localStorage.setItem(READ_KEY, String(now))
      setReadAt(now)
    }
    setOpen(!open)
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={toggle}
        aria-expanded={open}
        aria-haspopup="dialog"
        title={t('shell.notifications')}
        aria-label={t('shell.notifications')}
        className="relative grid size-10 place-items-center rounded-md text-grotto-soft transition-colors hover:bg-grotto-ground hover:text-grotto-ink"
      >
        <Bell className="size-5" />
        {hasUnread && (
          <span className="absolute right-2.5 top-2.5 size-2 rounded-full bg-grotto-brick" aria-hidden />
        )}
      </button>
      {open && (
        <div
          role="dialog"
          aria-label={t('shell.notifications')}
          className="absolute right-0 top-12 z-50 w-96 rounded-grotto border border-grotto-hair bg-grotto-panel shadow-lg"
        >
          <p className="lbl-mono border-b border-grotto-hair px-4 py-3">
            {t('shell.notifications')}
          </p>
          {items.length ? (
            <ul className="max-h-96 overflow-y-auto">
              {items.map((x) => {
                const Icon = iconOf(x.action)
                return (
                  <li
                    key={x.id}
                    className="flex items-start gap-3 border-b border-grotto-hair/60 px-4 py-3 last:border-0"
                  >
                    <Icon className="mt-0.5 size-4 shrink-0 text-grotto-terra" aria-hidden />
                    <div className="min-w-0">
                      <p className="text-sm text-grotto-ink">
                        <span className="font-semibold">{nameOf(x.actor)}</span> {x.action}{' '}
                        <span className="font-semibold">{x.target}</span>
                      </p>
                      <p className="lbl-mono mt-0.5">{relTime(x.at, t)}</p>
                    </div>
                  </li>
                )
              })}
            </ul>
          ) : (
            <EmptyState text={t('notifications.empty')} />
          )}
        </div>
      )}
    </div>
  )
}
