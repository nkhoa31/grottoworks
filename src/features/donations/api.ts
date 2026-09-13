// Donations domain — query key ['donations']. Task 6 đối chiếu đóng góp của
// TNV theo donorName; feature quà tặng của officer sau này import từ đây.
import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import type { Donation } from '@/types'

export function useDonations() {
  return useQuery({
    queryKey: ['donations'],
    queryFn: () => api<Donation[]>('/donations'),
  })
}
