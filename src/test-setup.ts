// Setup chung cho vitest: i18n (useTranslation cần instance đã init) + cleanup RTL.
import { afterEach } from 'vitest'
import '@/lib/i18n'
import { cleanup } from '@testing-library/react'

// jsdom chưa có ResizeObserver — recharts ResponsiveContainer cần (dashboard
// BarChart/PieChart trong test). Stub tức thì: kích thước 0 → chart vẫn vẽ
// SVG, count-up/tooltip không crash.
class ResizeObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
}
window.ResizeObserver = window.ResizeObserver ?? (ResizeObserverStub as unknown as typeof ResizeObserver)

afterEach(() => cleanup())
