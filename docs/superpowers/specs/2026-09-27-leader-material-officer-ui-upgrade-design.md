# Design Spec: LEADER & MATERIAL_OFFICER UI/UX Overhaul (22 Flows)

**Project:** GrottoWorks (Hệ thống Quản lý & Điều phối Chuẩn bị Giáng Sinh Giáo xứ)  
**Date:** 2026-09-27  
**Branch:** `khoa`  
**Standard:** Golden Winter / Hang Đá & Rơm (`#F8F9FA`, `#FFFFFF`, `#0A5C36`, `#EEB902`, `#F4A261`, `#991B1B`), Impeccable Taste Design, UI/UX Pro Max.

---

## 1. Scope & Objective

Overhaul and elevate the visual aesthetics, usability, feedback mechanisms, and accessibility for 22 core functional flows across **LEADER** (11 flows) and **MATERIAL_OFFICER** (11 flows). Every flow must provide delightful micro-interactions, responsive card layouts, high-contrast typography in `Be Vietnam Pro`, tabular numbers, clear Vietnamese terminology, and accessible touch targets (48px+).

---

## 2. Design System Tokens & Foundations

- **Canvas & Surfaces:**
  - Background Canvas: `#F8F9FA` (`gw.canvas` / `bg-background`)
  - Card & Modal Surfaces: `#FFFFFF` (`gw.card` / `bg-card`) with subtle shadow `0 4px 16px rgba(10, 92, 54, 0.04)` and `border-border/80`.
- **Accents & States:**
  - Primary / Success: Royal Pine Green `#0A5C36` (`brand.pine`)
  - Accent / Gold: Champagne Gold `#EEB902` (`brand.gold`) for badges, points, star contributors.
  - Warning / Shortage: Warm Gold `#F4A261` (`brand.warm`) for pending items and shortage warnings.
  - Alert / Overdue: Crimson `#991B1B` (`destructive`) for overdue borrow items, task rejections, and critical shortage.
- **Typography & Motion:**
  - Font: `Be Vietnam Pro` with semantic weights (Bold 700 headings, Semibold 600 card titles, Medium 500 buttons).
  - Numeric alignment: `font-variant-numeric: tabular-nums` for all quantities, dates, hours, and currency amounts.
  - CSS animations: `g-rise` (stagger entrance 0.7s cubic-bezier) and `g-bar` (progress bar fill animation).

---

## 3. Flow Specification: LEADER (11 Flows)

### `LEAD-01` — Leader Dashboard
- **Route:** `/leader` (`LeaderDashboard.tsx`)
- **Enhancements:**
  - 4 Key StatCards with animated count-up: Total tasks, In progress, Revision required, Readiness progress.
  - Priority task radar: 3 most urgent tasks due today with badge urgency.
  - Quick actions widget for instant navigation to task creation, registration review, and timesheets.

### `LEAD-02` — Task Creation & Editing Dialog
- **Component:** `TaskFormDialog.tsx`
- **Enhancements:**
  - Multi-select skill badges with gold visual tags (Mộc, Điện, Sơn, Trang trí, Khuân vác...).
  - Volunteer headcount counter with visual +/- controls.
  - Estimated hours and due date picker with validation against season bounds.

### `LEAD-03` — Task Management & Filtering
- **Route:** `/leader/tasks` (`TaskListPage.tsx`)
- **Enhancements:**
  - Dynamic status tabs with counter badges: `Tất cả`, `Cần làm`, `Đang làm`, `Cần sửa (REVISE)`, `Hoàn thành (DONE)`.
  - Inline volunteer staffing progress meter (`3/5 TNV`).
  - Required skills visual chip list per task row/card.

### `LEAD-04` — Task Details & Field Progress
- **Route:** `/leader/tasks/:id` (`TaskDetailPage.tsx`)
- **Enhancements:**
  - Hero header with task status, assignee roster, and allocated materials checklist.
  - Progress photos gallery preview with full-size modal viewer.

### `LEAD-05` — Volunteer Assignment & Reallocation
- **Component:** `TaskDetailPage.tsx`
- **Enhancements:**
  - Skill-matching indicator (shows matching score or skill tag highlights).
  - 1-click assign/unassign with instant optimistic UI update.

### `LEAD-06` — Volunteer Task Registration Approval
- **Route:** `/leader/regs` (`RegsApprovalPage.tsx`)
- **Enhancements:**
  - Profile-rich application cards: Volunteer Avatar, name, declared skills, total service hours.
  - 1-click `Duyệt nhận` (Pine Green) and `Từ chối` (Slate) with instant assignee synchronization.

### `LEAD-07` — Task Completion Approval, Revision Request & Reopening
- **Component:** `TaskDetailPage.tsx`
- **Enhancements:**
  - Completion modal with signature `approvedBy` record.
  - Revision request modal with dedicated reason textarea.
  - `Mở lại việc` button to immediately transition `REVISE` -> `DOING`.

### `LEAD-08` — Urgent Support Request
- **Route:** `/leader/support` (`SupportListPage.tsx`, `SupportFormDialog.tsx`)
- **Enhancements:**
  - Urgent callout cards with type badges (Nhân lực kỹ năng vs Mượn dụng cụ).
  - Status pipeline: `OPEN` -> `COORDINATED` -> `RESOLVED` -> `CLOSED`.

### `LEAD-09` — Volunteer Roster & Skill Profile
- **Route:** `/leader/volunteers`, `/leader/volunteers/:id` (`VolunteerListPage.tsx`, `VolunteerDetailPage.tsx`)
- **Enhancements:**
  - Volunteer talent directory with skill filters and cumulative hours badge.

### `LEAD-10` — Timesheets & Correction Requests
- **Route:** `/leader/timesheets` (`TimesheetPage.tsx`, `CorrectionDialog.tsx`)
- **Enhancements:**
  - Daily shift ledger with check-in/check-out timestamps.
  - Correction request banner highlighting requested delta hours with Approve/Reject actions.

### `LEAD-11` — Pre-Celebration Readiness Checklist
- **Route:** `/leader/checklist` (`ChecklistPage.tsx`)
- **Enhancements:**
  - Circular readiness meter (% completion).
  - Categorized safety checklists (Electrical Safety, Grotto Structural Rigidity, Fire Prevention, Aesthetics).

---

## 4. Flow Specification: MATERIAL_OFFICER (11 Flows)

### `MAT-01` — Officer Inventory Dashboard
- **Route:** `/material-officer` (`OfficerDashboard.tsx`)
- **Enhancements:**
  - Critical Shortage Banner highlighting materials with zero available stock.
  - Stock formula widget: $Tồn\ kho = Đã\ mua + Được\ tặng$.

### `MAT-02` — Materials Ledger & Shortage Monitor
- **Route:** `/material-officer/materials` (`MaterialListPage.tsx`)
- **Enhancements:**
  - Clean ledger columns: Required, Existing, Purchased, Donated, Received, Shortage.
  - Shortage column highlights: prominent Crimson badge for deficits, Emerald check `✓ 0` when sufficient.
  - 1-click action to create Purchase Request for short materials.

### `MAT-03` — Material Entry & Specification Configuration
- **Component:** `MaterialFormDialog.tsx`
- **Enhancements:**
  - Unit selector (Cái, Bộ, Mét, Bao, Thùng...), initial stock input, and multi-season reusable switch.

### `MAT-04` — Purchase Request Formulation
- **Route:** `/material-officer/purchases` (`PurchaseListPage.tsx`, `PurchaseFormDialog.tsx`)
- **Enhancements:**
  - Auto-fill remaining shortage quantity.
  - Unit price estimation and total cost calculation with instant formatting.

### `MAT-05` — Assign Buyer Volunteer
- **Component:** `PurchaseListPage.tsx`
- **Enhancements:**
  - Buyer selector modal with buyer contact number and purchase deadline.

### `MAT-06` — Purchase Confirmation & Receipt Recording
- **Route:** `/material-officer/purchases-confirm` (`PurchaseConfirmPage.tsx`)
- **Enhancements:**
  - Actual expenditure input, supplier name, date.
  - Receipt image preview with zoom lightbox and auto-increment of inventory `received`.

### `MAT-07` — Donation Intake & 4-Tier State Management
- **Route:** `/material-officer/donations` (`DonationListPage.tsx`, `DonationFormDialog.tsx`)
- **Enhancements:**
  - 4-Tier status chips: `PLEDGED` (Đã hứa), `RECEIVED_FULL` (Nhận đủ), `RECEIVED_PARTIAL` (Nhận một phần), `UNUSABLE` (Không dùng được).
  - Donor contact card with phone and address notes.

### `MAT-08` — Borrow Request Creation
- **Route:** `/material-officer/borrowed` (`BorrowedListPage.tsx`, `BorrowFormDialog.tsx`)
- **Enhancements:**
  - Tool/equipment description, quantity, lender name/community, expected return date.

### `MAT-09` — Borrowed Items Ledger & Overdue Alerts
- **Route:** `/material-officer/borrowed` (`BorrowedListPage.tsx`)
- **Enhancements:**
  - Return countdown indicator (e.g. "Còn 2 ngày" in amber, "Quá hạn 3 ngày" in pulsing red).

### `MAT-10` — Return Confirmation & Condition Verification
- **Component:** `BorrowedListPage.tsx`
- **Enhancements:**
  - Return verification dialog assessing returned tool condition (Tốt, Cần sửa, Hư hỏng) and closing record.

### `MAT-11` — Material Allocation to Tasks
- **Route:** `/material-officer/allocations` (`AllocationPage.tsx`)
- **Enhancements:**
  - Visual allocation bar indicating available vs allocated stock.
  - Real-time constraint checking preventing over-allocation.

---

## 5. Testing & Verification

- **Unit/Integration Tests:** Run `npm run test` (all 28 test suites must pass).
- **E2E & Visual Verification:** Verify page rendering, interaction feedback, dialog operations, and design consistency.
- **Git Commit Strategy:** Clean atomic commits on branch `khoa` for each major flow/feature.
