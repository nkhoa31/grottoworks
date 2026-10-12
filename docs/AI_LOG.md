# AI Development Log

Ghi lại các thay đổi phi tầm thường: ngày, yêu cầu, file đã đổi, tóm tắt, lỗi gặp phải, cách xử lý và kiểm thử.
Không ghi thay đổi chỉnh định dạng thuần, log lệnh thành công thông thường, hay thông tin nhạy cảm.

---

### 2026-10-12 — Landing page công khai + trang đăng ký đồng hành + khung QR tải app

**Yêu cầu**
Đưa artifact `docs/combo_1.html` vào dự án: thêm animation cho trang trọng, sửa nội dung (form → text) cho đúng GrottoWorks, tách một trang đăng ký riêng và một khối trên landing để đặt QR tải ứng dụng mobile.

**Quyết định (đã hỏi người dùng)**
- Bảng màu: dùng **Golden Winter** của dự án (pine `#0A5C36` + gold `#EEB902`) thay vì đỏ/xanh của combo_1.
- Route: `/` là landing công khai cho khách; đã đăng nhập → dashboard theo role; thêm `/register`.
- Đăng ký: thêm endpoint MSW `/api/registrations` (lưu trong mock DB).
- QR: chỉ dựng khung + ảnh placeholder trong `public/pic/`, thay QR thật sau.

**Files changed**

- `src/types/index.ts` — thêm `RegistrationKind`, `RegistrationStatus`, `Registration`.
- `src/mocks/seed.ts` — thêm key `registrations: []`.
- `src/mocks/handlers.ts` — PREFIX `registrations: 'reg'`, LABEL, tự gắn `createdAt`/`status: PENDING` khi POST, `...crud('registrations')`.
- `src/features/landing/LandingPage.tsx` — landing mới (header, hero, stats, about, 5 khu vực Z-pattern, khối QR, CTA, footer) dùng i18n + token Golden Winter.
- `src/features/landing/RegisterPage.tsx` — form RHF + zod, chọn giáo khu/khu vực/hình thức/kỹ năng, gửi qua `useCreateRegistration`.
- `src/features/landing/api.ts` — `useCreateRegistration()` (POST `/registrations`).
- `src/features/landing/components/Reveal.tsx` — scroll-reveal (IntersectionObserver, fallback hiện ngay).
- `src/features/landing/components/CountUp.tsx` — đếm số rAF, tôn trọng reduced-motion.
- `src/components/ui/textarea.tsx` — primitive Textarea (shadcn-style).
- `src/index.css` — keyframe `g-rise-in`, `.landing-reveal`, override reduced-motion, `scroll-behavior: smooth` khi cho phép.
- `src/locales/{vi,en}.json` — khối key `landing.*` và `register.*`.
- `src/App.tsx` — lazy `Landing`/`Register`, `RootRedirect` trả landing cho khách, route `/register`.
- `public/pic/qr-download-app.svg` — ảnh QR placeholder (kèm chú thích thay QR thật).
- `src/App.test.tsx`, `src/pages/Login.test.tsx` — cập nhật theo hành vi `/` mới.
- `src/features/landing/LandingPage.test.tsx`, `RegisterPage.test.tsx`, `src/mocks/handlers.test.ts` — test mới.
- `api-contracts.md` — thêm `/registrations` + schema `Registration`.

**Thay đổi hành vi quan trọng**
`/` trước đây chuyển hướng khách về `/login`; nay render landing công khai (khách bấm "Đăng nhập" hoặc "Đăng ký đồng hành"). Hai test cũ phụ thuộc hành vi cũ đã được cập nhật.

**Kiểm thử / xác minh**
- `npm run test` → **92 passed / 30 file** (gồm cáo test mới: `LandingPage.test.tsx`, `RegisterPage.test.tsx`, ca `POST /registrations` trong `handlers.test.ts`, và 2 test cũ đã cập nhật).
- `npm run build` (`tsc -b && vite build`) → thành công; `LandingPage` (15.6 kB) và `RegisterPage` (8.8 kB) tách chunk lazy riêng.
- Kiểm tra trong trình duyệt (Vite dev): hero + dải stats (count-up kết thúc ở `5 · 4 · 7 · 100%`), 5 dải khu vực Z-pattern (scroll-reveal thêm `.is-in`, opacity → 1), khối QR, và trang `/register` (nạp giáo khu + kỹ năng từ MSW, deep-link `?area=LIGHTING` điền sẵn "Ánh sáng", radio hình thức + chips kỹ năng hoạt động).
- Lưu ý môi trường: công cụ terminal thường gặp lỗi khởi tạo sandbox trong phiên này; đã chạy lệnh qua task runner (`create_and_run_task`).

**Cập nhật (theo góp ý) — đồng bộ thiết kế trang đăng ký với trang đăng nhập**

`/register` được thiết kế lại theo đúng ngôn ngữ của `src/pages/Login.tsx`: `min-h-screen grid place-items-center` + `WinterBackdrop` + `Snowfall`, một `Card` căn giữa (`max-w-md`) với khối header gradient chứa logo `Logo_GrottoWorks.png` + tiêu đề; trạng thái thành công nằm trong cùng Card; thêm chân Card "Về trang chủ". Trường form giữ nguyên (SĐT/Email và Giáo khu/Khu vực xếp 2 cột, radio hình thức 1→3 cột). Bỏ import `ArrowLeft`/`Heart`, thêm `Snowfall`/`WinterBackdrop`. (Key `register.eyebrow` không còn dùng nhưng giữ lại vô hại.)
Kiểm thử lại: `npm run test` → 92 passed/30 file; `npm run build` → OK (`RegisterPage` 8.06 kB, dùng chung chunk `WinterBackdrop` với Login).

**Cập nhật 2 (theo góp ý) — form đăng ký 2 cột, không tràn xuống**

Form `/register` được xếp lại thành **lưới 2 cột** (`sm:grid-cols-2`, dưới `sm` tự xếp 1 cột): cột trái = Họ tên · SĐT · Email · Giáo khu; cột phải = Khu vực · Hình thức (radio dọc, hiện nút radio + `accent-primary`) · Lời nhắn; hàng full-width = Kỹ năng; cuối = nút Gửi + ghi chú. Card nới lên `max-w-2xl`, giảm `py-6 → py-5` ở header và bỏ nhãn "Thông tin đăng ký" trùng lặp. `main` đổi sang `overflow-x-hidden ... sm:py-8` để trang **cuộn được** thay vì cắt nội dung. Kết quả đo: card 672×912 trên viewport 1280×900 (gần như vừa một màn hình; trước đó ~950 cao, form 1 cột ~700), 420px không tràn ngang (`scrollWidth == clientWidth`).
Kiểm thử lại: `npm run test` → 92 passed/30 file; `npm run build` → OK.

**Cập nhật 3 (theo góp ý) — lưới 3 cột, vừa trọn một màn hình**

Nâng từ 2 lên **lưới 1 → 2 → 3 cột** (`sm:grid-cols-2 md:grid-cols-3`): cột 1 = Họ tên · SĐT · Email; cột 2 = Giáo khu · Khu vực · Hình thức; cột 3 = Kỹ năng · Lời nhắn (`sm:col-span-2 md:col-span-1`). Card nới `max-w-2xl → max-w-4xl`; gộp dòng privacy + lời mời đăng nhập về **một hàng**; radio hình thức `py-2 → py-1.5`. Kết quả đo (cửa sổ cao 900px): cao card **728px** và `scrollHeight == clientHeight` → **không cần cuộn** ở mọi bề rộng ≥ 768px (820/1024/1280/1440); 420px không tràn ngang.
Kiểm thử lại: `npm run test` → 92 passed/30 file; `npm run build` → OK (`RegisterPage` 8.26 kB).

**Cập nhật 4 (theo góp ý) — đưa "Về trang chủ" lên trên**

Bỏ chân Card chứa link "Về trang chủ"; thay `<main>` sang `flex min-h-screen flex-col items-center justify-center` và đặt `Link` "← Về trang chủ" (`w-full max-w-4xl`) **phía trên Card**, cùng bề rộng nên mép trái thẳng hàng với Card. Thêm lại icon `ArrowLeft`. Cao card giảm còn **679px**, vẫn không cần cuộn ở 1280×900.
Kiểm thử lại: `npm run test` → 92 passed/30 file; `npm run build` → OK (`RegisterPage` 8.33 kB).

---

### 2026-10-12 — Rà soát form input trong các role (dialog bị cắt nội dung)

**Yêu cầu**
"Kiểm tra luôn các form input phía bên trong các role" — kiểm tra các form trong dashboard/role có bị tràn/cắt như trang đăng ký không.

**Phát hiện**
`src/components/ui/dialog.tsx` không chặn chiều cao và không cho cuộn: overlay `fixed inset-0 grid place-items-center`, panel `max-w-sm` không `max-h`. Vì overlay là `fixed`, khi form cao hơn viewport thì phần trên/dưới bị **cắt và không thể cuộn tới** → không bấm được nút Lưu/Huỷ. `AreaFormDialog` (9 trường) và `TaskFormDialog` (7 trường + chips) vượt ~800px nên dễ vượt viewport laptop.

**Thay đổi (một sửa, ăn cho mọi dialog)**
- `Dialog`: overlay `overflow-y-auto`, thêm `min-h-full` + `items-center`; panel `flex max-h-[calc(100vh-2rem)] flex-col`; header/footer ghim, phần thân `min-h-0 flex-1 overflow-y-auto`. Thêm prop `size: 'sm' | 'md' | 'lg'` (`max-w-sm/lg/2xl`, mặc định `sm` giữ nguyên hộp thoại xác nhận).
- 13 dialog form nhiều trường đặt `size` rộng hơn: `lg` cho `AreaFormDialog`, `TaskFormDialog`; `md` cho `SeasonFormDialog`, `AccountFormDialog`, `MaterialFormDialog`, `SupportFormDialog`, `PurchaseFormDialog`, `DonationFormDialog`, `BorrowFormDialog`, `TimesheetFormDialog`, `PurchaseConfirmPage`, `DonationListPage`, `AreaAssignDialog`.
- Gom lại thành 2–3 cột cho 2 form cao nhất: `AreaFormDialog` (Mùa+Tên, Loại+Cấp, Trưởng khu+TBHG, Hạn+Mô tả) và `TaskFormDialog` (Tên+Mô tả, Giờ+Số TNV+Hạn).

**Kiểm thử / xác minh**
- `npm run test` → **92 passed/30 file**; `npm run build` → OK.
- Trình duyệt (viewport 1000×620): panel `Tạo khu vực` cao 584px, khớp `max-h` (588), **không cần cuộn**, trang không cuộn.
- Ở 1000×420 (cực ngắn): panel 388px, thân cuộn nội bộ (`scrollHeight 442 > clientHeight 246`) và nút **Lưu vẫn hiện** → không còn nội dung không thể tới.

---

### 2026-10-12 — Design Review 2D (L1 nền tảng + L2 trang review 2D)

**Yêu cầu**
Triển khai chức năng 2D/3D Review theo `grottoworks-2d-3d-review-ai-agent-prompt.md`, không dùng Meshy/API tạo 3D trả phí, giữ nguyên kiến trúc. Người dùng đã chốt: route động `/{role}/areas/:id/design`; 3D chỉ dùng `three` (để dành L3); file lưu IndexedDB + metadata qua mock DB; **đợt này chỉ làm L1 + L2 (2D)**.

**Khảo sát (Giai đoạn 1)**
- Stack: React 19 + Vite 6 + TS 5.7 + Tailwind 3 + RR7 + React Query 5 + RHF/zod + i18next. Không có `three`/`@react-three/*`/`react-zoom-pan-pinch`.
- Backend là **MSW + localStorage** (`grotto-db-v1`); **không có server thật**, handler CRUD **không enforce RBAC** (chỉ `RequireRole` ở client).
- Chưa có entity Design/Comment/Attachment. Tiền lệ upload: `PurchaseConfirmPage` chỉ giữ objectURL trong phiên.
- Không có SKILL.md phù hợp với 2D/3D review.

**Đã triển khai**
- Types: `Design`, `DesignVersion`, `DesignComment` + union `DesignType`, `DesignVersionStatus`, `DesignCommentStatus`, `DesignCommentPriority`, `DesignPositionType`.
- Mock: seed 3 key rỗng; PREFIX `dg`/`dv`/`dc` + LABEL tiếng Việt + `crud()` cho 3 resource.
- `lib/blobStore.ts`: IndexedDB (`grotto-blobs-v1`) + fallback Map khi không có indexedDB (jsdom).
- `features/designs/`: `config.ts` (giới hạn dung lượng/định dạng tập trung), `coords.ts` (chuẩn hoá toạ độ), `api.ts` (hooks), 3 component + 1 page.
- 2D Review: KHÔNG dùng thư viện — zoom/pan bằng CSS transform + Pointer Events; marker đặt bằng % trong hộp ảnh nên bám đúng khi zoom/pan/resize; toạ độ lưu **chuẩn hoá 0..1**; khi click lấy `img.getBoundingClientRect()` (đã tính transform) chia tỉ lệ.
- Luồng: tạo hồ sơ → tải phiên bản (blob → IndexedDB, metadata → API) → gắn yêu cầu theo vị trí hoặc góp ý chung → lọc/đồng bộ marker ⇄ danh sách → lịch sử phiên bản → duyệt / yêu cầu chỉnh sửa.
- Route `areas/:id/design` cho LEADER/COMMUNITY/PARISH (`DYNAMIC` trong `App.tsx`); entry point: nút trong `AreaCard` + icon ở cột thao tác bảng của `AreaListPage`.
- i18n vi/en: khối `features.design.*` + status mới `IN_REVIEW`, `CHANGES_REQUESTED`, `IN_PROGRESS`.

**Files**
`src/types/index.ts`, `src/mocks/seed.ts`, `src/mocks/handlers.ts`, `src/lib/blobStore.ts`, `src/features/designs/**`, `src/features/areas/components/AreaCard.tsx`, `src/features/areas/pages/AreaListPage.tsx`, `src/components/shared/StatusTag.tsx`, `src/App.tsx`, `src/locales/{vi,en}.json`.

**Dependency**
Không thêm package nào. `three` để dành cho L3.

**Kiểm thử / xác minh**
- `npm run test` → **103 passed / 32 file** (mới: `designs/api.test.ts` 4 test CRUD + lịch sử phiên bản; `designs/coords.test.ts` 7 test toạ độ/zoom/clamp).
- `npm run build` (`tsc -b && vite build`) → OK; `DesignReviewPage` 28.96 kB (lazy chunk).
- Trình duyệt (leader, `/leader/areas/a1/design`): tạo hồ sơ → tải phiên bản → ảnh hiển thị đúng tỉ lệ, zoom 106%, marker "1" ở 50%/25% đúng vị trí; bấm marker → dòng tương ứng sáng lên; lọc ưu tiên `HIGH` → còn 1/2 yêu cầu; **marker giữ đúng vị trí sau reload**; đã sửa cảnh báo `src=""` của thẻ `img`.

**Cập nhật (theo góp ý) — lối vào cho LEADER + nút "Quay lại"**
- LEADER không có trang khu vực (`/community/areas`, `/parish/areas` mới có) nên trước đó **không có lối vào** trang thiết kế. Đã thêm nút "Bản thiết kế" vào header `LeaderDashboard` (`/leader`) và vào header `TaskListPage` (hiện cho mọi role khi có `areaId` trong ngữ cảnh; nút "Tạo việc" vẫn chỉ LEADER).
- Nút "Quay lại" trong `DesignReviewPage` trỏ tới `/{prefix}/areas/:id/tasks` — route này **không tồn tại ở LEADER** → rơi vào 404. Đã sửa: LEADER quay về `/leader/tasks`, COMMUNITY/PARISH vẫn về trang nhiệm vụ của khu.
- Files: `src/features/dashboards/LeaderDashboard.tsx`, `src/features/tasks/pages/TaskListPage.tsx`, `src/features/designs/pages/DesignReviewPage.tsx`.
- Xác minh trên trình duyệt: nút có mặt ở `/leader`, `/leader/tasks`, card khu ở `/community/areas`; bấm vào đi đúng `/leader/areas/a1/design` và `/community/areas/a4/design`; bấm "Quay lại" → `/leader/tasks` (khu Hang đá Bê-lem) và `/community/areas/a4/tasks` (read-only) — không còn 404.
- Kiểm thử lại: `npm run test` → 103 passed/32 file; `npm run build` → OK.

**Giới hạn còn lại (bắt buộc biết)**
1. **Không có backend/storage thật**: file nằm trong IndexedDB của **một trình duyệt**, không đồng bộ giữa máy/người dùng; xoá dữ liệu trang là mất file (marker vẫn còn nhưng ảnh không hiển thị → có cảnh báo). Production phải thay bằng endpoint upload + object storage của dự án.
2. **RBAC chỉ ở client**: UI readOnly theo tiền tố `/community/`; một LEADER vẫn mở được bằng URL khu vực không phải của mình — backend thật phải kiểm lại.
3. **Chưa có**: 3D Review (L3), chuyển yêu cầu thành Task (L4), thumbnail phiên bản, comment dạng thread nhiều lượt.
