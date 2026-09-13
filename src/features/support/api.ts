// Support requests — query key ['supportRequests']. Leader tạo (POST),
// committee điều phối (PATCH status COORDINATED) / giải quyết (RESOLVED).
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import type { SupportRequest } from '@/types'

export const supportKeys = { all: ['supportRequests'] as const }

export function useSupportRequests() {
  return useQuery({
    queryKey: supportKeys.all,
    queryFn: () => api<SupportRequest[]>('/supportRequests'),
  })
}

function useSupportMutation<TVars>(fn: (vars: TVars) => Promise<unknown>) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: fn,
    onSuccess: () => qc.invalidateQueries({ queryKey: supportKeys.all }),
  })
}

export function useCreateSupportRequest() {
  return useSupportMutation((data: Omit<SupportRequest, 'id'>) =>
    api<SupportRequest>('/supportRequests', { method: 'POST', body: JSON.stringify(data) }))
}

export function useUpdateSupportRequest() {
  return useSupportMutation(
    ({ id, ...data }: Partial<Omit<SupportRequest, 'id'>> & { id: string }) =>
      api<SupportRequest>(`/supportRequests/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      }),
  )
}
