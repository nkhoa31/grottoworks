// Giải quyết yêu cầu hỗ trợ end-to-end qua hook (msw + renderHook):
// PATCH status RESOLVED + activity log tự ghi dòng "cập nhật yêu cầu hỗ trợ".
import { afterAll, beforeAll, beforeEach, expect, test } from 'vitest'
import { act, renderHook } from '@testing-library/react'
import type { ReactNode } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { setupServer } from 'msw/node'
import { resetDb } from '@/lib/db'
import { handlers } from '@/mocks/handlers'
import { fulfillOf, useApproveSupportReg, useUpdateSupportRequest } from './api'
import type { ActivityLog, SupportReg, SupportRequest } from '@/types'

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

test('fulfillOf: 0→OPEN, <cần→PARTIAL, ≥cần→FULFILLED, không cần người→FULFILLED', () => {
  expect(fulfillOf(3, 0)).toBe('OPEN')
  expect(fulfillOf(3, 1)).toBe('PARTIAL')
  expect(fulfillOf(3, 3)).toBe('FULFILLED')
  expect(fulfillOf(0, 0)).toBe('FULFILLED')
})

test('approve support reg: srg5 (sr6, PENDING) → APPROVED + fulfill recalc', async () => {
  // sr6 seed: volunteersNeeded 2, fulfill OPEN, srg5 PENDING + srg6 PENDING.
  const { result } = renderHook(() => useApproveSupportReg(), { wrapper })
  await act(async () => {
    await result.current.mutateAsync({
      id: 'srg5', requestId: 'sr6', volunteerId: 'u25', status: 'PENDING',
    })
  })

  const regs = await (await fetch(`${base}/api/supportRegs`)).json() as SupportReg[]
  expect(regs.find((g) => g.id === 'srg5')!.status).toBe('APPROVED')

  const sr = await (await fetch(`${base}/api/supportRequests/sr6`)).json() as SupportRequest
  expect(sr.fulfill).toBe('PARTIAL') // 1/2 đã duyệt
  expect(sr.status).toBe('OPEN')
})

test('approve đủ người → fulfill FULFILLED + status COORDINATED', async () => {
    // sr3 seed: volunteersNeeded 1, srg1 APPROVED; srg7 REJECTED. Tạo 1 đơn mới chờ
  // duyệt qua POST (id do handler sinh), rồi duyệt → đủ 1 người.
  const created = await (
    await fetch(`${base}/api/supportRegs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ requestId: 'sr3', volunteerId: 'u23', status: 'PENDING' }),
    })
  ).json() as SupportReg
  const { result } = renderHook(() => useApproveSupportReg(), { wrapper })
  await act(async () => {
    await result.current.mutateAsync(created)
  })

  const sr = await (await fetch(`${base}/api/supportRequests/sr3`)).json() as SupportRequest
  expect(sr.fulfill).toBe('FULFILLED')
  expect(sr.status).toBe('COORDINATED')
})
