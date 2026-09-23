import type { Config } from 'tailwindcss'

// ============================================================================
// GOLDEN WINTER — Design Tokens (theo DESIGN_SYSTEM.md mục 37)
// ----------------------------------------------------------------------------
// Quy ước 60-30-10:
//   60%  Canvas        → #F8F9FA
//   30%  Card + Text    → #FFFFFF / #2B2D42
//   10%  Festive Accent → Pine #0A5C36 + Gold #EEB902 + Warm #F4A261
//
// Tương thích ngược: các key `grotto-*` cũ được map sang giá trị Golden
// Winter mới, nên code đang dùng `bg-grotto-panel`, `text-grotto-ink`…
// tự đổi tông mà không cần sửa từng file.
// ============================================================================
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // ---- Brand tokens (tên chuẩn Golden Winter) -----------------------
        pine: {
          DEFAULT: '#0A5C36', // Primary
          hover: '#0D7344', // Primary Hover
          light: '#E8F5E9', // Success / Passed BG
        },
        gold: {
          DEFAULT: '#EEB902', // Champagne Gold
          light: '#FEF9C3',
        },
        warm: '#F4A261', // Warm Gold (cảnh báo nhẹ / shortage)

        // ---- Semantic surface / text --------------------------------------
        canvas: '#F8F9FA',
        panel: '#FFFFFF',
        'table-header': '#F1F5F2',
        ink: '#2B2D42',
        muted: '#6C757D',
        faint: '#ADB5BD',
        hairline: '#E9ECEF',

        // ---- Status (mục 12) ----------------------------------------------
        'st-passed-bg': '#E8F5E9',
        'st-passed-fg': '#0A5C36',
        'st-pending-bg': '#FEF3C7',
        'st-pending-fg': '#B45309',
        'st-revision-bg': '#FFEEDD',
        'st-revision-fg': '#D97706',
        'st-danger-bg': '#FEE2E2',
        'st-danger-fg': '#991B1B',
        'st-neutral-bg': '#F1F3F5',
        'st-neutral-fg': '#495057',

        // ---- Tương thích ngược với theme "grotto" cũ ----------------------
        // Map sang Golden Winter để mọi class grotto-* cũ đổi tông an toàn.
        grotto: {
          ground: '#F8F9FA', // canvas
          panel: '#FFFFFF', // card
          ink: '#2B2D42', // text.main
          soft: '#6C757D', // text.muted
          hair: '#E9ECEF', // border.light
          terra: '#0A5C36', // primary (sidebar/active)
          terraDark: '#0D7344', // primary hover (active state)
          moss: '#0A5C36', // success/progress
          straw: '#EEB902', // gold accent
          brick: '#991B1B', // danger
        },

        // ---- shadcn bridge (HSL vars set trong index.css) -----------------
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
      },
      fontFamily: {
        sans: ['"Be Vietnam Pro"', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
      borderRadius: {
        // Golden Winter radius scale (mục 26)
        sm: '6px', // input / small control
        md: '10px', // button / card nhỏ
        card: '12px', // desktop card
        lg: '16px', // mobile card / bottom sheet
        // giữ alias cũ để không vỡ layout dùng rounded-grotto
        grotto: '12px',
      },
      boxShadow: {
        // Golden Winter elevation (mục 27)
        card: '0 4px 16px rgba(10, 92, 54, 0.04)',
        hover: '0 8px 24px rgba(10, 92, 54, 0.08)',
      },
      spacing: {
        // bổ sung cho spacing scale mục 25 (đã có sẵn 4..16 của Tailwind)
        5: '20px',
        6: '24px',
        7: '32px',
        8: '40px',
        9: '48px',
        10: '64px',
      },
      fontSize: {
        // Golden Winter type scale — WEB (mục 4.1)
        'web-display': ['32px', { lineHeight: '1.2', fontWeight: '700' }],
        'web-h1': ['24px', { lineHeight: '1.3', fontWeight: '700' }],
        'web-h2': ['18px', { lineHeight: '1.4', fontWeight: '600' }],
        'web-h3': ['15px', { lineHeight: '1.4', fontWeight: '600' }],
        'web-body': ['14px', { lineHeight: '1.5', fontWeight: '400' }],
        'web-sub': ['13px', { lineHeight: '1.5', fontWeight: '400' }],
        'web-badge': ['11px', { lineHeight: '1', fontWeight: '600' }],
        // MOBILE (mục 4.1)
        'mb-display': ['28px', { lineHeight: '1.2', fontWeight: '700' }],
        'mb-h1': ['20px', { lineHeight: '1.3', fontWeight: '700' }],
        'mb-h2': ['16px', { lineHeight: '1.4', fontWeight: '600' }],
        'mb-body': ['14px', { lineHeight: '1.5', fontWeight: '400' }],
        'mb-sub': ['12px', { lineHeight: '1.5', fontWeight: '400' }],
      },
      transitionDuration: {
        fast: '150ms',
        normal: '250ms',
      },
      height: {
        header: '64px',
        'bottom-nav': '64px',
      },
      width: {
        sidebar: '260px',
        'sidebar-collapsed': '72px',
      },
    },
  },
  plugins: [],
} satisfies Config
