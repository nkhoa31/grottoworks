// Cấu hình sidebar theo role — label là i18n key (phẳng, dạng nav.<role>.<mục>).
// Route con khai báo ở đây được App.tsx sinh tự động thành lazy placeholder;
// Task 4+ thay dần bằng page thật (giữ nguyên `to`).
import type { Role } from '@/types'

export interface NavItem {
  label: string // i18n key
  to: string
  badge?: 'support' | 'purchases'
  icon?: string // key trong ICONS của AppShell
}

export interface NavGroup {
  section: string // i18n key, '' = không có tiêu đề nhóm
  items: NavItem[]
}

export const NAV: Record<Role, NavGroup[]> = {
  COMMITTEE: [
    {
      section: 'nav.section.overview',
      items: [
        { label: 'nav.committee.dashboard', to: '/committee', icon: 'dashboard' },
        { label: 'nav.committee.seasons', to: '/committee/seasons', icon: 'calendar' },
      ],
    },
    {
      section: 'nav.section.coordination',
      items: [
        { label: 'nav.committee.areas', to: '/committee/areas', icon: 'areas' },
        { label: 'nav.committee.volunteers', to: '/committee/volunteers', icon: 'users' },
        {
          label: 'nav.committee.purchases',
          to: '/committee/purchases',
          icon: 'cart',
          badge: 'purchases',
        },
        {
          label: 'nav.committee.support',
          to: '/committee/support',
          icon: 'lifebuoy',
          badge: 'support',
        },
      ],
    },
    {
      section: 'nav.section.wrapup',
      items: [
        { label: 'nav.committee.checklist', to: '/committee/checklist', icon: 'checklist' },
        { label: 'nav.committee.reports', to: '/committee/reports', icon: 'reports' },
      ],
    },
  ],
  LEADER: [
    {
      section: '',
      items: [
                { label: 'nav.leader.dashboard', to: '/leader', icon: 'dashboard' },
        { label: 'nav.leader.tasks', to: '/leader/tasks', icon: 'tasks' },
        { label: 'nav.leader.regs', to: '/leader/regs', icon: 'inbox', badge: 'support' },
        { label: 'nav.leader.support', to: '/leader/support', icon: 'lifebuoy' },
        { label: 'nav.leader.volunteers', to: '/leader/volunteers', icon: 'users' },
        { label: 'nav.leader.timesheets', to: '/leader/timesheets', icon: 'clock' },
        { label: 'nav.leader.checklist', to: '/leader/checklist', icon: 'checklist' },
      ],
    },
  ],
  OFFICER: [
    {
      section: '',
      items: [
        { label: 'nav.officer.dashboard', to: '/officer', icon: 'dashboard' },
        { label: 'nav.officer.materials', to: '/officer/materials', icon: 'materials' },
        {
          label: 'nav.officer.purchases',
          to: '/officer/purchases',
          icon: 'cart',
          badge: 'purchases',
        },
        { label: 'nav.officer.purchases-confirm', to: '/officer/purchases-confirm', icon: 'confirm' },
        { label: 'nav.officer.donations', to: '/officer/donations', icon: 'gift' },
        { label: 'nav.officer.borrowed', to: '/officer/borrowed', icon: 'borrowed' },
        { label: 'nav.officer.allocations', to: '/officer/allocations', icon: 'boxes' },
      ],
    },
  ],
  ADMIN: [
    {
      section: '',
      items: [
        { label: 'nav.admin.dashboard', to: '/admin', icon: 'dashboard' },
        { label: 'nav.admin.accounts', to: '/admin/accounts', icon: 'accounts' },
        { label: 'nav.admin.communities', to: '/admin/communities', icon: 'church' },
        { label: 'nav.admin.categories', to: '/admin/categories', icon: 'tags' },
        { label: 'nav.admin.point-rules', to: '/admin/point-rules', icon: 'star' },
        { label: 'nav.admin.notifications', to: '/admin/notifications', icon: 'bell' },
        { label: 'nav.admin.activity', to: '/admin/activity', icon: 'history' },
        { label: 'nav.admin.backup', to: '/admin/backup', icon: 'backup' },
      ],
    },
  ],
}
