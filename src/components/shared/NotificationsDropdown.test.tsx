// NotificationsDropdown: mở panel → 10 activity mới nhất từ GET /api/activity
// (log31–log40 seed, log40 đứng đầu); dot unread tắt khi mở (đánh dấu đã đọc).
import { afterAll, beforeAll, beforeEach, expect, test } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { setupServer } from 'msw/node'
import { resetDb } from '@/lib/db'
import { handlers } from '@/mocks/handlers'
import { NotificationsDropdown } from './NotificationsDropdown'

const server = setupServer(...handlers)
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
beforeEach(() => {
  resetDb()
  localStorage.removeItem('grotto-notif-read')
})
afterAll(() => server.close())

function mount() {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return render(
    <QueryClientProvider client={client}>
      <NotificationsDropdown />
    </QueryClientProvider>,
  )
}

test('mở panel → 10 hoạt động mới nhất, dot unread tắt sau khi mở', async () => {
  mount()

  // Activity về sau: có log mới hơn timestamp 0 → dot đỏ xuất hiện.
  expect(await screen.findByTestId('unread-dot')).toBeDefined()

  fireEvent.click(screen.getByRole('button', { name: 'Thông báo' }))

  // 10 dòng mới nhất (log31–log40 seed); log40 = u2 xác nhận hóa đơn pc4.
  expect(await screen.findAllByRole('listitem')).toHaveLength(10)
  expect(screen.getByText('Giuse Trần Văn Bình')).toBeDefined() // actor u2
  expect(screen.getByText('xác nhận hóa đơn')).toBeDefined()
  expect(screen.getByText('pc4')).toBeDefined()
  // Mở panel = đánh dấu đã đọc → dot biến mất.
  expect(screen.queryByTestId('unread-dot')).toBeNull()
})
