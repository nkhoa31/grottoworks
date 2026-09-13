// AreaListPage render 5 AreaCard từ msw GET /api/areas (db seed localStorage).
import { afterAll, beforeAll, beforeEach, expect, test } from 'vitest'
import { render, screen } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { setupServer } from 'msw/node'
import { ToastProvider } from '@/components/ui/toast'
import AreaListPage from './AreaListPage'
import { handlers } from '@/mocks/handlers'
import { resetDb } from '@/lib/db'

const server = setupServer(...handlers)
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
beforeEach(() => resetDb())
afterAll(() => server.close())

test('hiện 5 thẻ khu vực (grid mặc định) từ seed', async () => {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  render(
    <QueryClientProvider client={client}>
      <ToastProvider>
        <AreaListPage />
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
