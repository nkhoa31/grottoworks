# LEADER & MATERIAL_OFFICER UI/UX Overhaul (22 Flows) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Overhaul the visual UI/UX and interaction design across 22 functional flows for LEADER and MATERIAL_OFFICER roles according to Golden Winter / Hang Đá & Rơm standards (`#F8F9FA`, `#FFFFFF`, `#0A5C36`, `#EEB902`, `#F4A261`, `#991B1B`), Impeccable Taste Design, and UI/UX Pro Max principles.

**Architecture:** Component-level visual elevation and interaction refinement across React pages and dialogs, preserving React Query cache invalidations, MSW handlers, and TypeScript types while elevating visual hierarchy, typography (`Be Vietnam Pro`, `tabular-nums`), responsive cards, micro-animations, and accessible touch targets (48px+).

**Tech Stack:** React 19, TypeScript 5.7, Tailwind CSS 3, Lucide Icons, React Hook Form + Zod, Vitest + Testing Library, MSW.

**Spec:** `docs/superpowers/specs/2026-09-27-leader-material-officer-ui-upgrade-design.md`

## Global Constraints

- Retain strict backward compatibility with existing data schemas in `src/types/index.ts` and MSW handlers in `src/mocks/handlers.ts`.
- Adhere strictly to Golden Winter palette tokens: `--primary` (#0A5C36), `--accent` (#EEB902), `--gw-canvas` (#F8F9FA), `--gw-card` (#FFFFFF), and status colors.
- Use `font-variant-numeric: tabular-nums` for all quantities, hours, dates, percentages, and currencies.
- Ensure all interactive elements meet the minimum 48px touch target standard.
- Use flat i18n translation keys in `src/locales/{vi,en}.json`.
- Every task ends with clean passing tests and an atomic Git commit on branch `khoa`.

## Review Focus

- Task status transition integrity (`TODO` -> `DOING` -> `REVISE` -> `DONE`) ensuring no UI lockups.
- Shortage calculation and real-time inventory ledger synchronization upon purchase/donation receipt.
- Registration approval seamlessly updating assignee roster without full page reload.
- Correction request approvals cleanly mutating timesheet hours and updating volunteer point tallies.
- Allocation slider respecting maximum available unallocated stock with zero over-allocation.

---

### Task 1: Leader Dashboard, Task List & Task Creation (LEAD-01, LEAD-02, LEAD-03)

**Files:**
- Modify: `src/features/dashboards/LeaderDashboard.tsx`
- Modify: `src/features/tasks/pages/TaskListPage.tsx`
- Modify: `src/features/tasks/pages/TaskFormDialog.tsx`
- Modify: `src/locales/vi.json`, `src/locales/en.json`
- Test: `src/features/tasks/pages/TaskListPage.test.tsx`, `src/features/dashboards/dashboards.test.tsx`

- [ ] **Step 1: Write/update tests for Task List visual filters & Leader Dashboard**
  - Verify status chips with counter badges filter rows correctly.
  - Verify skill tags and staffing ratio render properly.

- [ ] **Step 2: Run tests to verify baseline**
  - Run: `npx vitest run src/features/tasks/pages/TaskListPage.test.tsx src/features/dashboards/dashboards.test.tsx`

- [ ] **Step 3: Implement UI upgrades**
  - In `LeaderDashboard.tsx`: Enhance 4 KPI stat cards with count-up animations, urgent tasks radar with urgency badges, and quick-action buttons.
  - In `TaskListPage.tsx`: Add dynamic status tabs with counter badges (`Tất cả`, `Cần làm`, `Đang làm`, `Cần sửa`, `Hoàn thành`), staffing progress bars (`x/y TNV`), and skill badges.
  - In `TaskFormDialog.tsx`: Multi-select skill badges, headcount counter, and refined form layout.

- [ ] **Step 4: Verify test suite passes**
  - Run: `npx vitest run src/features/tasks/pages/TaskListPage.test.tsx src/features/dashboards/dashboards.test.tsx`

- [ ] **Step 5: Commit Task 1**
  - Commit: `git commit -m "feat(leader): upgrade UI for dashboard, task list & task form dialog (LEAD-01..03)"`

---

### Task 2: Task Detail, Volunteer Assigning & Completion/Revision Workflow (LEAD-04, LEAD-05, LEAD-06, LEAD-07)

**Files:**
- Modify: `src/features/tasks/pages/TaskDetailPage.tsx`
- Modify: `src/features/volunteerRegs/pages/RegsApprovalPage.tsx`
- Test: `src/features/tasks/pages/TaskDetailPage.test.tsx`, `src/features/volunteers/api.test.tsx`

- [ ] **Step 1: Write/update tests for Task Detail & Registration Approval**
  - Verify completion approval and revision modal flows.
  - Verify 1-click volunteer application approval.

- [ ] **Step 2: Run tests to verify baseline**
  - Run: `npx vitest run src/features/tasks/pages/TaskDetailPage.test.tsx src/features/volunteers/api.test.tsx`

- [ ] **Step 3: Implement UI upgrades**
  - In `TaskDetailPage.tsx`: Hero header, assignee roster with skill matching indicators, allocated materials checklist, field progress photo viewer modal, completion modal with `approvedBy` feedback, revision request modal, and "Mở lại việc" button.
  - In `RegsApprovalPage.tsx`: Profile cards for applicants (skills, completed hours, avatar), 1-click Approve (Pine green) and Reject (Slate) actions.

- [ ] **Step 4: Verify test suite passes**
  - Run: `npx vitest run src/features/tasks/pages/TaskDetailPage.test.tsx src/features/volunteers/api.test.tsx`

- [ ] **Step 5: Commit Task 2**
  - Commit: `git commit -m "feat(leader): upgrade task details, regs approval & revision workflow (LEAD-04..07)"`

---

### Task 3: Support Requests, Volunteer Roster, Timesheets & Readiness Checklist (LEAD-08, LEAD-09, LEAD-10, LEAD-11)

**Files:**
- Modify: `src/features/support/pages/SupportListPage.tsx`, `src/features/support/pages/SupportFormDialog.tsx`
- Modify: `src/features/volunteers/pages/VolunteerListPage.tsx`, `src/features/volunteers/pages/VolunteerDetailPage.tsx`
- Modify: `src/features/timesheets/pages/TimesheetPage.tsx`, `src/features/timesheets/components/CorrectionDialog.tsx`
- Modify: `src/features/checklist/pages/ChecklistPage.tsx`
- Test: `src/features/support/api.test.tsx`, `src/features/timesheets/api.test.tsx`, `src/features/checklist/api.test.tsx`

- [ ] **Step 1: Write/update tests for Support, Timesheets and Checklist**
  - Verify timesheet correction approval and checklist completion calculation.

- [ ] **Step 2: Run tests to verify baseline**
  - Run: `npx vitest run src/features/support/api.test.tsx src/features/timesheets/api.test.tsx src/features/checklist/api.test.tsx`

- [ ] **Step 3: Implement UI upgrades**
  - In `SupportListPage.tsx` & `SupportFormDialog.tsx`: Urgent callout cards with type badges (Nhân lực vs Dụng cụ) and status pipeline.
  - In `VolunteerListPage.tsx` & `VolunteerDetailPage.tsx`: Talent roster directory with skill chips and service hours.
  - In `TimesheetPage.tsx` & `CorrectionDialog.tsx`: Shift table with check-in/out timestamps, correction request delta hours highlight.
  - In `ChecklistPage.tsx`: Circular completion progress meter (% Readiness) with categorized safety groups.

- [ ] **Step 4: Verify test suite passes**
  - Run: `npx vitest run src/features/support/api.test.tsx src/features/timesheets/api.test.tsx src/features/checklist/api.test.tsx`

- [ ] **Step 5: Commit Task 3**
  - Commit: `git commit -m "feat(leader): upgrade support, volunteer roster, timesheets & checklist (LEAD-08..11)"`

---

### Task 4: Material Officer Dashboard, Shortage Ledger & Material Config (MAT-01, MAT-02, MAT-03)

**Files:**
- Modify: `src/features/dashboards/OfficerDashboard.tsx`
- Modify: `src/features/materials/pages/MaterialListPage.tsx`
- Modify: `src/features/materials/pages/MaterialFormDialog.tsx`
- Test: `src/features/materials/pages/MaterialFormDialog.test.tsx`, `src/features/dashboards/dashboards.test.tsx`

- [ ] **Step 1: Write/update tests for Material Ledger & Shortage calculation**
  - Verify shortage column highlighting and material creation.

- [ ] **Step 2: Run tests to verify baseline**
  - Run: `npx vitest run src/features/materials/pages/MaterialFormDialog.test.tsx src/features/dashboards/dashboards.test.tsx`

- [ ] **Step 3: Implement UI upgrades**
  - In `OfficerDashboard.tsx`: Critical shortage alert banners, stock formula widget, quick-action purchase/allocation links.
  - In `MaterialListPage.tsx`: Modern ledger table with crimson shortage badges and emerald check `✓ 0`, multi-season badges, and 1-click purchase request button.
  - In `MaterialFormDialog.tsx`: Reusable toggle switch, initial stock, and standardized unit selector.

- [ ] **Step 4: Verify test suite passes**
  - Run: `npx vitest run src/features/materials/pages/MaterialFormDialog.test.tsx src/features/dashboards/dashboards.test.tsx`

- [ ] **Step 5: Commit Task 4**
  - Commit: `git commit -m "feat(officer): upgrade inventory dashboard, shortage ledger & material dialog (MAT-01..03)"`

---

### Task 5: Purchase Workflow & Multi-Tier Donation Management (MAT-04, MAT-05, MAT-06, MAT-07)

**Files:**
- Modify: `src/features/purchases/pages/PurchaseListPage.tsx`, `src/features/purchases/pages/PurchaseFormDialog.tsx`
- Modify: `src/features/purchases/pages/PurchaseConfirmPage.tsx`
- Modify: `src/features/donations/pages/DonationListPage.tsx`, `src/features/donations/pages/DonationFormDialog.tsx`
- Test: `src/features/purchases/api.test.tsx`, `src/features/donations/api.test.tsx`

- [ ] **Step 1: Write/update tests for Purchase and Donation state transitions**
  - Verify purchase confirmation increments `received` and donation intake mutates pledged/received counters.

- [ ] **Step 2: Run tests to verify baseline**
  - Run: `npx vitest run src/features/purchases/api.test.tsx src/features/donations/api.test.tsx`

- [ ] **Step 3: Implement UI upgrades**
  - In `PurchaseListPage.tsx` & `PurchaseFormDialog.tsx`: Purchase tracking pipeline (`Draft` -> `Pending` -> `Buyer Assigned` -> `Recorded`), auto-fill shortage quantity, buyer assignment modal.
  - In `PurchaseConfirmPage.tsx`: Expenditure input, receipt photo zoom lightbox, supplier tags.
  - In `DonationListPage.tsx` & `DonationFormDialog.tsx`: 4-tier pledge cards (`PLEDGED`, `FULL`, `PARTIAL`, `UNUSABLE`) with donor contact cards.

- [ ] **Step 4: Verify test suite passes**
  - Run: `npx vitest run src/features/purchases/api.test.tsx src/features/donations/api.test.tsx`

- [ ] **Step 5: Commit Task 5**
  - Commit: `git commit -m "feat(officer): upgrade purchase tracking & donation management (MAT-04..07)"`

---

### Task 6: Borrowed Equipment Tracking & Material Task Allocations (MAT-08, MAT-09, MAT-10, MAT-11)

**Files:**
- Modify: `src/features/borrowed/pages/BorrowedListPage.tsx`, `src/features/borrowed/pages/BorrowFormDialog.tsx`
- Modify: `src/features/allocations/pages/AllocationPage.tsx`
- Test: `src/features/allocations/pages/AllocationPage.test.tsx`

- [ ] **Step 1: Write/update tests for Borrowed items & Allocation constraints**
  - Verify return confirmation and allocation validation preventing exceeding available stock.

- [ ] **Step 2: Run tests to verify baseline**
  - Run: `npx vitest run src/features/allocations/pages/AllocationPage.test.tsx`

- [ ] **Step 3: Implement UI upgrades**
  - In `BorrowedListPage.tsx` & `BorrowFormDialog.tsx`: Borrowed tool ledger with countdown badges (amber for ≤2 days, pulsing red for overdue), and return verification modal with condition grading.
  - In `AllocationPage.tsx`: Visual allocation progress bar showing allocated vs remaining stock per task, instant real-time constraint validation.

- [ ] **Step 4: Verify test suite passes**
  - Run: `npx vitest run src/features/allocations/pages/AllocationPage.test.tsx`

- [ ] **Step 5: Commit Task 6**
  - Commit: `git commit -m "feat(officer): upgrade borrowed tools tracking & material allocations (MAT-08..11)"`

---

### Task 7: Full Test Suite & E2E Verification

**Files:**
- Run complete test suite across all 28 test files.

- [ ] **Step 1: Run full Vitest test suite**
  - Run: `npm run test`
  - Expected: 28 test files passed, 87+ tests passed.

- [ ] **Step 2: Run project build check**
  - Run: `npm run build`
  - Expected: Clean TypeScript & Vite production build with 0 errors.

- [ ] **Step 3: Verify and document all 22 flows**
  - Verify full navigation and interactions for LEADER (`/leader/*`) and MATERIAL_OFFICER (`/material-officer/*`).
