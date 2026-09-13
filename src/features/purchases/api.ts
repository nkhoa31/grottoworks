// Purchase records domain — query key ['purchaseRecords'] (hồ sơ mua).
// Task 6 tra mua hộ theo buyerId; feature mua sắm sau import từ đây.
import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import type { PurchaseRecord } from '@/types'

export function usePurchaseRecords() {
  return useQuery({
    queryKey: ['purchaseRecords'],
    queryFn: () => api<PurchaseRecord[]>('/purchaseRecords'),
  })
}
