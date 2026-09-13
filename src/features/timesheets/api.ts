// Timesheets domain — query key ['timesheets']. Task 6 tính tổng giờ công
// của TNV; feature chấm công của leader sau này import từ đây, không tự
// khai báo lại key.
import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import type { Timesheet } from '@/types'

export function useTimesheets() {
  return useQuery({
    queryKey: ['timesheets'],
    queryFn: () => api<Timesheet[]>('/timesheets'),
  })
}
