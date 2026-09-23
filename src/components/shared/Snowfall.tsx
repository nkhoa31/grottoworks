// Snowfall — lớp phủ tuyết rơi cho trang Login (Golden Winter).
// Tạo N hạt tuyết với vị trí/kích thước/tốc độ ngẫu nhiên (một lần, memoized
// để không đổi giữa các re-render). Thuần CSS animation (keyframes snow-fall)
// nên không tốn JS mỗi frame; tôn trọng prefers-reduced-motion qua index.css.
import { useMemo } from 'react'

interface Flake {
  id: number
  x: number // % vị trí ngang
  size: number // px
  duration: number // s
  delay: number // s
  drift: number // px trôi ngang khi rơi
  opacity: number
}

export function Snowfall({ count = 60 }: { count?: number }) {
  const flakes = useMemo<Flake[]>(
    () =>
      Array.from({ length: count }, (_, id) => ({
        id,
        x: Math.random() * 100,
        size: 3 + Math.random() * 6,
        duration: 8 + Math.random() * 12,
        delay: Math.random() * -20, // âm → nhiều hạt đã rơi sẵn khi tải trang
        drift: (Math.random() - 0.5) * 120,
        opacity: 0.4 + Math.random() * 0.6,
      })),
    [count],
  )

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      {flakes.map((f) => (
        <span
          key={f.id}
          className="snowflake"
          style={
            {
              '--x': `${f.x}%`,
              '--size': `${f.size}px`,
              '--dur': `${f.duration}s`,
              '--delay': `${f.delay}s`,
              '--drift': `${f.drift}px`,
              '--opacity': f.opacity,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  )
}
