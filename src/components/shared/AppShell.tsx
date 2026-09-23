import { useMemo } from 'react'
import type { CSSProperties } from 'react'
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useQuery } from '@tanstack/react-query'
import {
  LogOut, LayoutDashboard, Calendar, MapPin, Users, ShoppingCart, LifeBuoy,
  ListChecks, FileText, ClipboardList, ClipboardCheck, UserPlus, Inbox, Clock,
  Package, Gift, Backpack, Boxes, UserCog, Church, Tags, Star, History, Database,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { api } from '@/lib/api'
import { useAuth } from '@/lib/auth'
import { useSupportRequests } from '@/features/support/api'
import { NAV } from './nav-config'
import { NotificationsDropdown } from './NotificationsDropdown'
import { SeasonSelector } from './SeasonSelector'
import { Avatar } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { PurchaseRequest, Role } from '@/types'

// Icon lucide theo key `icon` trong nav-config.
const ICONS: Record<string, LucideIcon> = {
  dashboard: LayoutDashboard, calendar: Calendar, areas: MapPin, users: Users,
  cart: ShoppingCart, lifebuoy: LifeBuoy, checklist: ListChecks, reports: FileText,
  tasks: ClipboardList, inbox: Inbox, clock: Clock, materials: Package,
  gift: Gift, borrowed: Backpack, boxes: Boxes, accounts: UserCog,
  church: Church, tags: Tags, star: Star, history: History, backup: Database,
  assign: UserPlus, confirm: ClipboardCheck,
}

export function AppShell({ role }: { role?: Role }) {
  const { user, logout } = useAuth()
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const r: Role = role ?? user?.role ?? 'COMMITTEE'
  const groups = NAV[r]

  // Badge: hỗ trợ khẩn cấp đang mở + đề nghị mua chờ duyệt (dùng chung cache key qua hook).
  const { data: support } = useSupportRequests()
  const { data: purchases } = useQuery({
    queryKey: ['purchaseRequests'],
    queryFn: () => api<PurchaseRequest[]>('/purchaseRequests'),
  })
  const badgeCount = (kind: 'support' | 'purchases') =>
    kind === 'support'
      ? (support?.filter((x) => x.status === 'OPEN').length ?? 0)
      : (purchases?.filter((x) => x.status === 'PENDING').length ?? 0)

  // Crumb: mục nav khớp pathname dài nhất (prefix-match), không có → tên app.
  const crumb = useMemo(() => {
    const hit = groups
      .flatMap((g) => g.items)
      .filter((i) => pathname === i.to || pathname.startsWith(i.to + '/'))
      .sort((a, b) => b.to.length - a.to.length)[0]
    return hit ? t(hit.label) : t('app.name')
  }, [groups, pathname, t])

  const flat = groups.flatMap((g) => g.items)
  const delayOf = (to: string) => Math.min(flat.findIndex((i) => i.to === to), 14)

  return (
    <div className="flex h-screen overflow-hidden">
            {/* Sidebar (DESIGN_SYSTEM.md mục 5.3): nền trắng, resource-first.
          Active = viền trái pine + nền pine-light + chữ pine — không tô đậm
          toàn sidebar để giữ tính "management dashboard" trang nghiêm. */}
      <aside className="flex w-sidebar shrink-0 flex-col border-r border-grotto-hair bg-grotto-panel">
        <div className="flex items-center gap-3 border-b border-grotto-hair px-5 py-5">
          <div className="grid size-11 shrink-0 place-items-center rounded-md bg-grotto-terra text-lg font-extrabold text-grotto-panel">
            G
          </div>
          <div className="min-w-0">
            <p className="truncate text-base font-extrabold leading-tight tracking-tight text-grotto-ink">
              {t('app.name')}
            </p>
            {/* Brand phụ đề theo role (mục 5.3 Brand Block). */}
            <p className="truncate text-xs text-grotto-soft">{user ? t(`role.${user.role}`) : t('app.parish')}</p>
          </div>
        </div>
        <nav className="flex-1 space-y-5 overflow-y-auto px-3 py-4">
          {groups.map((g) => (
            <div key={g.section || 'main'}>
              {g.section && (
                <p className="lbl !mb-1.5 !px-3">{t(g.section)}</p>
              )}
              <div className="space-y-1">
                {g.items.map((item) => {
                  const n = item.badge ? badgeCount(item.badge) : 0
                  const Icon = item.icon ? ICONS[item.icon] : undefined
                  return (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      end={item.to === `/${r.toLowerCase()}`}
                      style={{ '--d': delayOf(item.to) } as CSSProperties}
                      className={({ isActive }) =>
                        cn(
                          'g-item relative flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-semibold transition-colors',
                          isActive
                            ? 'bg-grotto-moss/10 text-grotto-moss'
                            : 'text-grotto-ink hover:bg-grotto-ground',
                        )
                      }
                    >
                      {({ isActive }) => (
                        <>
                          {isActive && (
                            <span
                              aria-hidden
                              className="absolute inset-y-1.5 left-0 w-0.5 rounded-full bg-grotto-moss"
                            />
                          )}
                          {Icon && <Icon className="size-4 shrink-0" aria-hidden />}
                          <span className="flex-1 truncate">{t(item.label)}</span>
                          {n > 0 && (
                            <span className="rounded-full bg-grotto-straw px-1.5 py-0.5 text-[10px] font-bold text-grotto-ink tabular">
                              {n}
                            </span>
                          )}
                        </>
                      )}
                    </NavLink>
                  )
                })}
              </div>
            </div>
          ))}
        </nav>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
                {/* Header (mục 5.2): Page Context (trái) — Season Selector (phải) — Profile (far right).
            Không có global search ở Header. */}
        <header className="flex h-header shrink-0 items-center justify-between gap-4 border-b border-grotto-hair bg-grotto-panel px-6">
          <div className="flex min-w-0 items-center gap-2 text-sm font-semibold text-grotto-soft">
            <span className="truncate text-grotto-moss">{t('app.name')}</span>
            <span aria-hidden className="text-grotto-hair">/</span>
            <span className="truncate text-grotto-ink">{crumb}</span>
          </div>
          <div className="flex items-center gap-2">
            <SeasonSelector />
            <NotificationsDropdown />
            <Link
              to="/profile"
              className="flex items-center gap-2.5 rounded-md py-1 pl-1 pr-2.5 transition-colors hover:bg-grotto-ground"
            >
              <Avatar name={user?.name ?? ''} hue={user?.avatarHue} />
              <span className="hidden text-left md:block">
                <span className="block max-w-40 truncate text-sm font-semibold leading-tight text-grotto-ink">
                  {user?.name}
                </span>
                <span className="block text-xs text-grotto-soft">
                  {user ? t(`role.${user.role}`) : ''}
                </span>
              </span>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              aria-label={t('common.logout')}
              title={t('common.logout')}
              onClick={() => {
                void logout()
                navigate('/login', { replace: true })
              }}
            >
              <LogOut className="size-4 text-grotto-soft" />
            </Button>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
