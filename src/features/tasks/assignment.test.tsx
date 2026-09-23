// Phân công trực tiếp (hướng 2): lời mời PENDING, gỡ phân công, và phản hồi
// của TNV (mobile) ACCEPTED/DECLINED — kiểm tra cả `assignments` lẫn `assignees`
// giữ nhất quán (assignees chỉ chứa người đã nhận). Dùng msw + renderHook.
import { afterAll, beforeAll, beforeEach, expect, test } from 'vitest'
import { act, renderHook } from '@testing-library/react'
import type { ReactNode } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { setupServer } from 'msw/node'
import { resetDb } from '@/lib/db'
import { handlers } from '@/mocks/handlers'
import {
  assignmentStatus,
  taskAssignmentList,
  useInviteVolunteer,
  useRemoveAssignment,
  useRespondAssignment,
} from './api'
import type { Task } from '@/types'

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

const getTask = async (id: string): Promise<Task> =>
  (await (await fetch(`${base}/api/tasks/${id}`)).json()) as Task

// ── Helper thuần (không cần msw) ─────────────────────────────────────────────
test('taskAssignmentList: assignees cũ = ACCEPTED, assignments ghi đè/ thêm', () => {
  const task = {
    assignees: ['u1', 'u2'],
    assignments: [
      { volunteerId: 'u2', status: 'DECLINED' as const, note: 'bận' },
      { volunteerId: 'u3', status: 'PENDING' as const },
    ],
  }
  const list = taskAssignmentList(task)
  expect(list.find((a) => a.volunteerId === 'u1')?.status).toBe('ACCEPTED')
  expect(list.find((a) => a.volunteerId === 'u2')?.status).toBe('DECLINED')
  expect(list.find((a) => a.volunteerId === 'u3')?.status).toBe('PENDING')
  expect(assignmentStatus(task, 'u3')).toBe('PENDING')
  expect(assignmentStatus(task, 'u9')).toBeUndefined()
})

// ── Hook qua msw ─────────────────────────────────────────────────────────────
test('mời TNV: tạo bản ghi PENDING, KHÔNG thêm vào assignees', async () => {
  // t3 seed: chưa có assignee; mời u25.
  const { result } = renderHook(() => useInviteVolunteer('t3', 'u25'), { wrapper })
  await act(async () => {
    await result.current.mutateAsync()
  })
  const task = await getTask('t3')
  expect(assignmentStatus(task, 'u25')).toBe('PENDING')
  expect(task.assignees).not.toContain('u25')
})

test('TNV chấp nhận: ACCEPTED + vào assignees', async () => {
  const { result } = renderHook(() => useRespondAssignment('t3', 'u25'), { wrapper })
  await act(async () => {
    await result.current.mutateAsync({ status: 'ACCEPTED' })
  })
  const task = await getTask('t3')
  expect(assignmentStatus(task, 'u25')).toBe('ACCEPTED')
  expect(task.assignees).toContain('u25')
})

test('TNV từ chối: DECLINED + kèm lý do + KHÔNG trong assignees', async () => {
  // t2 seed có u19 DECLINED. Phản hồi lại với lý do mới.
  const { result } = renderHook(() => useRespondAssignment('t2', 'u19'), { wrapper })
  await act(async () => {
    await result.current.mutateAsync({ status: 'DECLINED', note: 'Vẫn bận' })
  })
  const task = await getTask('t2')
  const rec = taskAssignmentList(task).find((a) => a.volunteerId === 'u19')
  expect(rec?.status).toBe('DECLINED')
  expect(rec?.note).toBe('Vẫn bận')
  expect(task.assignees).not.toContain('u19')
})

test('gỡ phân công: xoá khỏi assignments lẫn assignees', async () => {
  // t2 seed: u13 ACCEPTED (trong assignees) + u25 PENDING.
  const { result } = renderHook(() => useRemoveAssignment('t2', 'u13'), { wrapper })
  await act(async () => {
    await result.current.mutateAsync()
  })
  const task = await getTask('t2')
  expect(task.assignees).not.toContain('u13')
  expect(assignmentStatus(task, 'u13')).toBeUndefined()
})
