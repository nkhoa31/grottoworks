// Materials domain — query key ['materials']. Lọc theo khu ở client
// (select) — mock trả nguyên mảng, không cần endpoint theo khu.
import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import type { Material } from '@/types'

export const materialKeys = {
  all: ['materials'] as const,
}

export function useMaterials(areaId?: string) {
  return useQuery({
    queryKey: materialKeys.all,
    queryFn: () => api<Material[]>('/materials'),
    select: areaId ? (ms) => ms.filter((m) => m.areaId === areaId) : undefined,
  })
}
