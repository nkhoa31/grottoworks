import { Suspense, lazy, useEffect } from 'react'
import type { ComponentType } from 'react'
import { BrowserRouter, Navigate, Route, Routes, useNavigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { AppShell } from '@/components/shared/AppShell'
import { NAV } from '@/components/shared/nav-config'
import { RequireRole } from '@/routes/RequireRole'
import { AuthProvider, useAuth } from '@/lib/auth'
import { ToastProvider } from '@/components/ui/toast'
import { Card } from '@/components/ui/card'
import type { Role } from '@/types'

const Login = lazy(() => import('@/pages/Login'))
const NotFound = lazy(() => import('@/pages/NotFound'))
const Profile = lazy(() => import('@/pages/Profile'))
const SeasonListPage = lazy(() => import('@/features/season/pages/SeasonListPage'))
const AreaListPage = lazy(() => import('@/features/areas/pages/AreaListPage'))
const TaskListPage = lazy(() => import('@/features/tasks/pages/TaskListPage'))
const TaskDetailPage = lazy(() => import('@/features/tasks/pages/TaskDetailPage'))
const VolunteerListPage = lazy(() => import('@/features/volunteers/pages/VolunteerListPage'))
const VolunteerDetailPage = lazy(() => import('@/features/volunteers/pages/VolunteerDetailPage'))
const RegsApprovalPage = lazy(() => import('@/features/volunteerRegs/pages/RegsApprovalPage'))
const SupportListPage = lazy(() => import('@/features/support/pages/SupportListPage'))
const MaterialListPage = lazy(() => import('@/features/materials/pages/MaterialListPage'))
const PurchaseListPage = lazy(() => import('@/features/purchases/pages/PurchaseListPage'))
const PurchaseConfirmPage = lazy(() => import('@/features/purchases/pages/PurchaseConfirmPage'))
const CommitteeApprovalPage = lazy(() => import('@/features/purchases/pages/CommitteeApprovalPage'))
const DonationListPage = lazy(() => import('@/features/donations/pages/DonationListPage'))
const BorrowedListPage = lazy(() => import('@/features/borrowed/pages/BorrowedListPage'))
const AllocationPage = lazy(() => import('@/features/allocations/pages/AllocationPage'))

// Trang thật theo route `to` của nav-config; mục chưa có → Placeholder.
// Task 5+ thêm dần vào map này (pattern lazy page).
const PAGES: Record<string, ComponentType> = {
  '/committee/seasons': SeasonListPage,
  '/committee/areas': AreaListPage,
  '/leader/tasks': TaskListPage,
  '/leader/assignments': TaskListPage,
  '/leader/volunteers': VolunteerListPage,
  '/committee/volunteers': VolunteerListPage,
  '/leader/regs': RegsApprovalPage,
  '/leader/support': SupportListPage,
  '/committee/support': SupportListPage,
  '/officer/materials': MaterialListPage,
  '/officer/purchases': PurchaseListPage,
  '/officer/purchases-confirm': PurchaseConfirmPage,
  '/officer/donations': DonationListPage,
  '/officer/borrowed': BorrowedListPage,
  '/officer/allocations': AllocationPage,
  '/committee/purchases': CommitteeApprovalPage,
}

// Route có param — nav-config không mô tả được, khai báo tường minh theo role
// (page tự đọc useParams/useLocation để biết ngữ cảnh mount).
const DYNAMIC: Partial<Record<Role, { path: string; Page: ComponentType }[]>> = {
  LEADER: [{ path: 'tasks/:id', Page: TaskDetailPage }, { path: 'volunteers/:id', Page: VolunteerDetailPage }],
  COMMITTEE: [
    { path: 'areas/:id/tasks', Page: TaskListPage },
    { path: 'volunteers/:id', Page: VolunteerDetailPage },
  ],
}

const queryClient = new QueryClient()
const ROLES: Role[] = ['COMMITTEE', 'LEADER', 'OFFICER', 'ADMIN']

// Placeholder lazy cho mọi route con — Task 4+ thay bằng page thật.
function Placeholder({ label }: { label: string }) {
  const { t } = useTranslation()
  return (
    <Card className="grid h-64 place-items-center border-dashed bg-grotto-panel/60">
      <p className="lbl-mono px-6 text-center">
        {t('common.building')} — {t(label)}
      </p>
    </Card>
  )
}

// / → dashboard theo role, hoặc /login khi chưa đăng nhập.
function RootRedirect() {
  const { user, isPending } = useAuth()
  if (isPending) return null
  return <Navigate to={user ? `/${user.role.toLowerCase()}` : '/login'} replace />
}

// /login khi đã có phiên → thẳng dashboard role, không hiện form lần nữa.
function LoginGate() {
  const { user, isPending } = useAuth()
  if (isPending) return null
  if (user) return <Navigate to={`/${user.role.toLowerCase()}`} replace />
  return <Login />
}

// 401 giữa phiên (api.ts dispatch 'grotto:unauthorized') → logout + về /login.
function SessionWatch() {
  const { logout } = useAuth()
  const navigate = useNavigate()
  useEffect(() => {
    const onExpired = () => {
      void logout()
      navigate('/login', { replace: true })
    }
    window.addEventListener('grotto:unauthorized', onExpired)
    return () => window.removeEventListener('grotto:unauthorized', onExpired)
  }, [logout, navigate])
  return null
}

// Mỗi role prefix một layout route: RequireRole + AppShell, route con sinh
// từ nav-config (index = mục dashboard của role đó).
function roleRoutes(role: Role) {
  const prefix = `/${role.toLowerCase()}`
  const items = NAV[role].flatMap((g) => g.items)
  return (
    <Route
      key={role}
      path={prefix}
      element={
        <RequireRole roles={[role]}>
          <AppShell role={role} />
        </RequireRole>
      }
    >
      <Route index element={<Placeholder label={items[0].label} />} />
      {items
        .filter((i) => i.to !== prefix)
        .map((i) => {
          const Page = PAGES[i.to]
          return (
            <Route
              key={i.to}
              path={i.to.slice(prefix.length + 1)}
              element={Page ? <Page /> : <Placeholder label={i.label} />}
            />
          )
        })}
      {(DYNAMIC[role] ?? []).map(({ path, Page }) => (
        <Route key={path} path={path} element={<Page />} />
      ))}
    </Route>
  )
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <AuthProvider>
          <BrowserRouter>
            <SessionWatch />
            <Suspense fallback={null}>
              <Routes>
                <Route path="/" element={<RootRedirect />} />
                <Route path="/login" element={<LoginGate />} />
                <Route
                  path="/profile"
                  element={
                    <RequireRole roles={ROLES}>
                      <AppShell />
                    </RequireRole>
                  }
                >
                  <Route index element={<Profile />} />
                </Route>
                {ROLES.map(roleRoutes)}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </AuthProvider>
      </ToastProvider>
    </QueryClientProvider>
  )
}
