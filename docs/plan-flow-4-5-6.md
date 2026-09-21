# Plan Flow 4-5-6 — GrottoWorks (Coordinator Plan)

> Coordinator = Claude Code (chỉ điều phối, không code). Dev = omp, Tester = codex (sau đó Claude-tester nếu cần). Toàn bộ làm trên `feature/grottoworks-fe`, mock data (MSW + seed), không đụng BE thật.

## 1. Phân tích ảnh chụp (8 flows) — scope lần này: 4,5,6

| Flow | Mô tả gốc | Thực trạng code | Gap |
|------|-----------|-----------------|-----|
| **4. Tạo mùa Giáng sinh** | Committee tạo Season → nhập thời gian, mô tả, ngân sách → chọn Community tham gia → lưu ở `PLANNED` | `Season` hiện có `year/startDate/endDate/budget/status` nhưng THIẾU `description` + `communityIds` (chọn Community tham gia). Dialog chỉ có 4 field, không có multi-select cộng đoàn. | Thêm field + UI |
| **5. Phân chia khu vực & chỉ định người phụ trách** | Committee tạo Work area thuộc Season → giao cho Community hoặc giữ cấp giáo xứ → chỉ định 1 Leader + 1 Material Officer + đặt thời hạn → thông báo | `WorkArea` có `level/communityId/leaderId/officerId` nhưng THIẾU `seasonId` + `deadline` + `description`. Chưa gắn WorkArea với Season, chưa có deadline. | Thêm field + UI + filter theo mùa |
| **6. Kích hoạt mùa** | Committee kiểm tra → hệ thống validate thời gian/khu vực/người phụ trách → Committee kích hoạt → status `PLANNED→ACTIVE` → các bên triển khai | `useCloseSeason` (ACTIVE→CLOSED) đã có, nhưng chưa có `useActivateSeason` (PLANNED→ACTIVE) + checklist validate. Nút "Kích hoạt" chưa có. | Thêm activation + validation dialog |

Flow 1-3,7,8 **không đụng** lần này.

## 2. Thay đổi dữ liệu (types + seed + MSW)

### types/src/types/index.ts
```ts
Season: thêm description?: string; communityIds?: string[]  // tham gia
WorkArea: thêm seasonId: string; deadline?: string; description?: string
```
- Giữ backward compat: `seasonId` default = `s1` cho seed cũ, `communityIds` default = [].
- Không thêm entity mới, không thêm bảng.

### seed
- `src/mocks/seed/areas.ts`: seasons thêm description + communityIds (VD s1: 3 cộng đoàn), areas thêm seasonId + deadline + description.
- `src/mocks/seed/users.ts` giữ nguyên.

### handlers (MSW)
- Không cần endpoint mới — CRUD generic đã cover. Chỉ cần `refresh` không đổi. Activation là PATCH status như close.

## 3. UI/UX — yêu cầu dùng skill

> Dev BẮT BUỘC gọi skill theo thứ tự trước khi code, để đảm bảo visual đúng design system "Hang Đá & Rơm".

**Skill chỉ định:**
1. `impeccable` (hoặc `impeccable:design-brief` nếu có) — lấy direction, token màu `#EFE4CC/#FBF6E9/#3E2F23/#B96A3B` và grotto-arch card.
2. `ui-ux-pro-max` — review information architecture, form layout, validation UX.
3. `design-taste-frontend` (alias `taste-design`) — polish micro-interaction, spacing, typography.

Nếu skill không có sẵn thì fallback: đọc `PRODUCT.md#Brand Commitments` + `src/index.css` token và tự áp y hệt.

### 3a. Flow 4 — SeasonFormDialog + SeasonListPage

**SeasonFormDialog:**
- Thêm: `description` (textarea 3 dòng, placeholder "Mô tả mục tiêu, chủ đề hang đá năm nay…"), `communityIds` (checkbox group 3 cộng đoàn từ `useCommunities`, chọn ít nhất 1).
- Giữ RHF+zod, thêm `description: z.string().max(500).optional()`, `communityIds: z.array(z.string()).min(1, 'features.season.communityRequired')`.
- Khi edit: prefill description + communityIds.

**SeasonListPage:**
- StatCards giữ nguyên, DataTable thêm cột "Cộng đoàn" (render badge số lượng + tooltip tên), cột "Mô tả" (truncate 40 chars).
- Thêm nút `Kích hoạt` (icon `Rocket`) cho row status=PLANNED, và `ConfirmDialog` activation (dùng chung pattern `closeSeason`).
- Nút "Tạo mùa" → mở dialog đã nâng cấp.
- i18n: thêm ~12 key `features.season.description / communityIds / activate / activateConfirm / activateSuccess / communityRequired / validationFailed ...`

### 3b. Flow 5 — AreaFormDialog + AreaListPage + AreaAssignDialog

**AreaFormDialog:**
- Thêm: `seasonId` (select từ `useSeasons`, default season PLANNED/ACTIVE đầu tiên), `deadline` (input type=date, validate >= season.startDate), `description` (textarea).
- Giữ level/community/leader/officer logic, chỉ thêm 3 field.
- Zod: `seasonId: z.string().min(1)`, `deadline: z.string().optional()`, `description: z.string().max(300).optional()`.

**AreaListPage:**
- Thêm filter bar: `Season` select (All / từng mùa) — lọc areas theo seasonId.
- Card/Table hiển thị thêm `deadline` (viDate) + `season` badge.
- Khi tạo Area từ context Season (query param `?season=s1`) thì preselect.
- Thông báo (toast) khi gán leader/officer: đã có.

### 3c. Flow 6 — Kích hoạt mùa

**Logic validate (FE, trước khi gọi API):**
```
canActivate(season, areasOfSeason):
  - season.startDate < season.endDate
  - season.communityIds.length > 0
  - areasOfSeason.length > 0
  - every area: leaderId && officerId && deadline
```
- Nếu fail → mở `ActivationCheckDialog` liệt kê thiếu gì (dấu X đỏ / tick xanh), nút Kích hoạt disabled.
- Nếu pass → ConfirmDialog "Kích hoạt mùa {{year}}? Các khu vực sẽ chuyển sang triển khai." → PATCH status PLANNED→ACTIVE → toast + invalidate.

**Hook mới:** `useActivateSeason()` trong `src/features/season/api.ts` (copy pattern `useCloseSeason` đổi body thành `{status:'ACTIVE'}`).

## 4. Chia việc cho dev

### OMP — Dev 1 (UI chính, Flow 4 + 6 + hook)
- Nhánh: `feature/grottoworks-fe`
- Files đụng:
  - `src/types/index.ts`
  - `src/mocks/seed/areas.ts`
  - `src/features/season/api.ts` (thêm useActivateSeason)
  - `src/features/season/pages/SeasonFormDialog.tsx`
  - `src/features/season/pages/SeasonListPage.tsx`
  - `src/locales/vi.json`, `src/locales/en.json`
  - (tạo mới nếu cần) `src/features/season/pages/SeasonActivateDialog.tsx` — tách riêng dialog check
- Skill: `impeccable`, `ui-ux-pro-max`, `design-taste-frontend`
- Xong phải: `npx tsc --noEmit` pass, `npx vitest run` pass, `git diff --stat` gọn.

### AGY/Codex Dev 2 — Flow 5 (Area theo mùa)
> Hiện Orca chưa có `agy`, dùng `codex` làm Dev 2 trước; nếu coordinator mở được `agy` thì chuyển phần này cho `agy` và để `codex` chuyên test.
- Files:
  - `src/features/areas/api.ts` (không đổi nhiều, chỉ re-export useSeasons nếu cần)
  - `src/features/areas/pages/AreaFormDialog.tsx`
  - `src/features/areas/pages/AreaListPage.tsx`
  - `src/features/areas/pages/AreaAssignDialog.tsx` (thêm hiển thị deadline nếu có)
  - `src/locales/vi.json`, `src/locales/en.json`
- Skill: `impeccable`, `ui-ux-pro-max`
- Lưu ý: không tự ý sửa Season files của OMP — nếu conflict thì báo coordinator.

### Thứ tự
1. OMP làm types + seed trước (để AGY có seasonId để dùng).
2. Song song sau đó: OMP → Season UI, AGY → Area UI.
3. Cả hai xong → báo coordinator qua Orca (kèm log tsc/vitest).

## 5. Tester — Codex (e2e + unit)

**Chỉ nhận việc từ coordinator sau khi cả 2 dev báo xong. CẤM dev nhắn trực tiếp cho tester.**

Nhiệm vụ:
- `npx vitest run` toàn bộ, note fail.
- E2E bằng MCP `browser-jev` (hoặc Playwright): chạy `npm run dev`, chụp màn:
  1. `/parish/seasons` — list + dialog tạo mùa (có mô tả + chọn cộng đoàn) + dialog kích hoạt (checklist)
  2. `/parish/areas` — filter mùa + dialog tạo khu (có season + deadline) + card grid
  3. Flow kích hoạt: tạo mùa PLANNED → tạo 1 area thiếu officer → bấm Kích hoạt → thấy checklist báo thiếu → bổ sung → kích hoạt thành công (toast + status ACTIVE)
- Chụp ảnh lưu `docs/e2e-flow-4-5-6-*.png`, báo lại coordinator (pass/fail + ảnh).

## 6. Tiêu chí nghiệm thu
- [ ] Season có description + communityIds, Area có seasonId + deadline, seed mock đủ dữ liệu.
- [ ] Tạo/sửa Season với chọn cộng đoàn hoạt động, validate.
- [ ] Tạo/sửa Area gắn mùa + deadline, filter theo mùa hoạt động.
- [ ] Kích hoạt mùa: validate đủ điều kiện mới cho Active, toast + status đổi.
- [ ] Không vỡ layout, đúng token Hang Đá & Rơm, responsive.
- [ ] `tsc` + `vitest` pass.

## 7. Không làm
- Không thêm BE, không thêm dependency mới, không đụng Flow 1-3,7,8, không sửa auth/nav ngoài scope.
