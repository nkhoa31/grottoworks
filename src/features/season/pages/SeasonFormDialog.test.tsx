// Validation SeasonFormDialog: zod refine start < end — end <= start bị chặn.
import { describe, expect, it } from 'vitest'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ToastProvider } from '@/components/ui/toast'
import { SeasonFormDialog } from './SeasonFormDialog'

function setup() {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return render(
    <QueryClientProvider client={client}>
      <ToastProvider>
        <SeasonFormDialog onClose={() => {}} />
      </ToastProvider>
    </QueryClientProvider>,
  )
}

// jsdom không gõ được từng ký tự vào input[type=date] → fireEvent.change.
const setDate = (label: string, value: string) => {
  fireEvent.change(screen.getByLabelText(label), { target: { value } })
}

const submit = () => {
  fireEvent.submit(document.getElementById('season-form')!)
}

describe('SeasonFormDialog validation', () => {
  it('end trước start → hiện lỗi "Ngày kết thúc phải sau ngày mở"', async () => {
    setup()
    setDate('Ngày mở', '2026-12-24')
    setDate('Ngày kết thúc', '2026-09-15')
    submit()
    expect(await screen.findByText('Ngày kết thúc phải sau ngày mở')).toBeDefined()
  })

  it('end bằng start cũng bị chặn (start ≥ end)', async () => {
    setup()
    setDate('Ngày mở', '2026-09-15')
    setDate('Ngày kết thúc', '2026-09-15')
    submit()
    expect(await screen.findByText('Ngày kết thúc phải sau ngày mở')).toBeDefined()
  })

  it('end sau start → không hiện lỗi refine', async () => {
    setup()
    setDate('Ngày mở', '2026-09-15')
    setDate('Ngày kết thúc', '2026-12-24')
    submit()
    // validation chạy async — đợi handler chạy xong rồi mới khẳng định
    // message refine không xuất hiện (submit hợp lệ → isSubmitting bật).
    await waitFor(() =>
      expect((screen.getByRole('button', { name: 'Lưu' }) as HTMLButtonElement).disabled).toBe(
        true,
      ),
    )
    expect(screen.queryByText('Ngày kết thúc phải sau ngày mở')).toBeNull()
  })
})
