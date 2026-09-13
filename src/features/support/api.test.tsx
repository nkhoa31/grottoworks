// Giải quyết yêu cầu hỗ trợ end-to-end qua hook (msw + renderHook):
// PATCH status RESOLVED + activity log tự ghi dòng "cập nhật yêu cầu hỗ trợ".
import { afterAll, beforeAll, beforeEach, expect, test } from 'vitest'
import { act, renderHook } from '@testing-library/react'
import type { ReactNode } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { setupServer } from 'msw/node'
import { resetDb } from '@/lib/db'
import { handlers } from '@/mocks/handlers'
import { useUpdateSupportRequest } from './api'
import type { ActivityLog, SupportRequest } from '@/types'

const base = location.origin

const server = setupServer(...handlers)
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
beforeEach(() => resetDb())
afterAll(() => server.close())

const client = new QueryClient({
  defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
})
const wrapper = ({ children }: { children: ReactNode }) => (
  <QueryClientProvider client={client}>{children}</QueryClientProvider>
)

test('resolve support request: status RESOLVED + activity log', async () => {
  const { result } = renderHook(() => useUpdateSupportRequest(), { wrapper })
  // sr1 seed: OPEN.
  await act(async () => {
    await result.current.mutateAsync({ id: 'sr1', status: 'RESOLVED' })
  })

  const sr = await (await fetch(`${base}/api/supportRequests/sr1`)).json() as SupportRequest
  expect(sr.status).toBe('RESOLVED')

  const logs = await (await fetch(`${base}/api/activity`)).json() as ActivityLog[]
  expect(logs.some((l) => l.action.includes('cập nhật yêu cầu hỗ trợ') && l.target === 'sr1')).toBe(true)
})

test('coordinate support request: status COORDINATED + assigneeId persisted', async () => {
  const { result } = renderHook(() => useUpdateSupportRequest(), { wrapper })
  // sr1 seed: OPEN. PATCH 1 lần gửi cả status + assigneeId.
  await act(async () => {
    await result.current.mutateAsync({ id: 'sr1', status: 'COORDINATED', assigneeId: 'u10' })
  })

  const sr = await (await fetch(`${base}/api/supportRequests/sr1`)).json() as SupportRequest
  expect(sr.status).toBe('COORDINATED')
  expect(sr.assigneeId).toBe('u10')
})
