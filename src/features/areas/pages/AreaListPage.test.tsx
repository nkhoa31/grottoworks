import { afterAll, beforeAll, beforeEach, expect, test } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter } from 'react-router-dom'
import { setupServer } from 'msw/node'
import { ToastProvider } from '@/components/ui/toast'
import { AuthProvider } from '@/lib/auth'
import AreaListPage from './AreaListPage'
import { AreaFormDialog } from './AreaFormDialog'
import { handlers } from '@/mocks/handlers'
import { resetDb } from '@/lib/db'

const server = setupServer(...handlers)
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
beforeEach(() => {
  resetDb()
  localStorage.removeItem('grotto-token')
})
afterAll(() => server.close())

test('hiện 5 thẻ khu vực (grid mặc định) từ seed khi chưa đăng nhập', async () => {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  render(
    <QueryClientProvider client={client}>
      <ToastProvider>
        <AuthProvider>
          <MemoryRouter>
            <AreaListPage />
          </MemoryRouter>
        </AuthProvider>
      </ToastProvider>
    </QueryClientProvider>,
  )
  for (const name of [
    'Hang đá Bê-lem',
    'Cây thông lớn',
    'Ánh sáng & đèn',
    'Sân khấu',
    'Sân nhà thờ',
  ]) {
    expect(await screen.findByText(name)).toBeDefined()
  }
})

test('COMMUNITY chỉ thấy khu vực thuộc giáo khu của mình', async () => {
  // u2 có role COMMUNITY và communityId = 'c1'. Trong seed, chỉ có a4 ('Sân khấu') thuộc 'c1'.
  localStorage.setItem('grotto-token', 'demo-u2')
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  render(
    <QueryClientProvider client={client}>
      <ToastProvider>
        <AuthProvider>
          <MemoryRouter>
            <AreaListPage />
          </MemoryRouter>
        </AuthProvider>
      </ToastProvider>
    </QueryClientProvider>,
  )
  expect(await screen.findByText('Sân khấu')).toBeDefined()
  expect(screen.queryByText('Hang đá Bê-lem')).toBeNull()
  expect(screen.queryByText('Cây thông lớn')).toBeNull()
  expect(screen.queryByText('Ánh sáng & đèn')).toBeNull()
  expect(screen.queryByText('Sân nhà thờ')).toBeNull()
})

test('AreaFormDialog: COMMUNITY khóa select communityId', async () => {
  localStorage.setItem('grotto-token', 'demo-u2')
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  render(
    <QueryClientProvider client={client}>
      <ToastProvider>
        <AuthProvider>
          <AreaFormDialog onClose={() => {}} />
        </AuthProvider>
      </ToastProvider>
    </QueryClientProvider>,
  )
  const selectComm = (await screen.findByLabelText(/Giáo khu/i)) as HTMLSelectElement
  expect(selectComm.disabled).toBe(true)
  expect(selectComm.value).toBe('c1')
})

test('AreaFormDialog: PARISH được chọn giáo khu khác', async () => {
  localStorage.setItem('grotto-token', 'demo-u1')
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  render(
    <QueryClientProvider client={client}>
      <ToastProvider>
        <AuthProvider>
          <AreaFormDialog onClose={() => {}} />
        </AuthProvider>
      </ToastProvider>
    </QueryClientProvider>,
  )
  const levelSelect = (await screen.findByLabelText(/^Cấp/i)) as HTMLSelectElement
  await userEvent.selectOptions(levelSelect, 'COMMUNITY')
  const parishCommSelect = (await screen.findByLabelText(/Giáo khu/i)) as HTMLSelectElement
  expect(parishCommSelect.disabled).toBe(false)
})
