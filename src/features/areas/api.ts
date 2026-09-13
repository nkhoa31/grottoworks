// Work-area API hooks — cùng pattern season: query key <resource>, api()
// wrapper, invalidate sau mutation. Kèm useUsers/useCommunities cho các
// select trong form (lọc theo role ở nơi dùng).
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import type { Community, User, WorkArea } from '@/types'

export const areaKeys = {
  all: ['areas'] as const,
}

export function useAreas() {
  return useQuery({
    queryKey: areaKeys.all,
    queryFn: () => api<WorkArea[]>('/areas'),
  })
}

export function useUsers() {
  return useQuery({
    queryKey: ['users'],
    queryFn: () => api<User[]>('/users'),
  })
}

export function useCommunities() {
  return useQuery({
    queryKey: ['communities'],
    queryFn: () => api<Community[]>('/communities'),
  })
}

function useAreaMutation<TVars>(fn: (vars: TVars) => Promise<unknown>) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: fn,
    onSuccess: () => qc.invalidateQueries({ queryKey: areaKeys.all }),
  })
}

export function useCreateArea() {
  return useAreaMutation((data: Omit<WorkArea, 'id'>) =>
    api<WorkArea>('/areas', { method: 'POST', body: JSON.stringify(data) }),
  )
}

export function useUpdateArea() {
  return useAreaMutation(({ id, ...data }: Partial<WorkArea> & { id: string }) =>
    api<WorkArea>(`/areas/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  )
}

export function useDeleteArea() {
  return useAreaMutation((id: string) => api<void>(`/areas/${id}`, { method: 'DELETE' }))
}
