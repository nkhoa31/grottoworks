# 🎄 GrottoWorks — Hệ Thống Điều Phối Chuẩn Bị Giáng Sinh Giáo Xứ

<div align="center">

[![React](https://img.shields.io/badge/React-19.0.0-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6.0.0-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![MSW](https://img.shields.io/badge/MSW-2.6.0-FF6A00?logo=mockservice-worker&logoColor=white)](https://mswjs.io/)
[![Vitest](https://img.shields.io/badge/Vitest-3.0-729B1B?logo=vitest&logoColor=white)](https://vitest.dev/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

*Nền tảng số hóa quản trị công tác Mùa Vọng và Đại Lễ Giáng Sinh — Kết nối Giáo Xứ, Giáo Khu, Trưởng Khu và Ban Vật Tư trên một nhịp cầu phụng vụ ấm áp.*

[Giới Thiệu](#-giới-thiệu-dự-án) • [Vai Trò Hệ Thống](#-vai-trò-và-phân-quyền-người-dùng) • [Công Nghệ](#-tech-stack) • [Cài Đặt & Khởi Chạy](#-cài-đặt--khởi-chạy) • [Cấu Trúc Thư Mục](#-cấu-trúc-thư-mục) • [Lưu Ý Kỹ Thuật](#-lưu-ý-kỹ-thuật-quan-trọng)

</div>

---

## 📖 Giới Thiệu Dự Án

Mỗi mùa Giáng Sinh về, các giáo xứ trên khắp Việt Nam bước vào giai đoạn chuẩn bị đại lễ nhộn nhịp: dựng **Hang đá Bê-lem**, dựng **Cây thông lớn**, lắp đặt **Ánh sáng & Đèn**, trang hoàng **Sân khấu** và chỉnh trang **Sân nhà thờ**. 

Trước đây, công tác điều phối thường diễn ra phân tán qua tin nhắn mạng xã hội, thông báo miệng và các bảng tính thủ công. Việc này dễ dẫn đến thất lạc vật tư, chồng chéo nhân sự, thiếu hụt ngân sách và khó khăn khi tổng kết công ơn đóng góp của bà con giáo dân.

**GrottoWorks** ra đời nhằm giải quyết triệt để những bất cập trên:
- **Rõ ràng, minh bạch**: Nắm bắt ngay "vật tư nào còn thiếu, ai đang đi mua, khâu nào trễ tiến độ".
- **Gần gũi, dễ dùng**: Giao diện mang tinh thần *"Hang Đá & Rơm"* (tông màu rơm ấm, đất nung terracotta, xanh rêu moss), cỡ chữ và nút bấm tối ưu cho mọi lứa tuổi giáo dân.
- **Truy xuất đến từng giờ công & đồng kinh phí**: Ghi nhận chính xác giờ công tình nguyện viên, hóa đơn vật tư và những món quà quyên góp thân thương.

---

## 🖼️ Hình Ảnh Giao Diện (Screenshots)

> *Giao diện web ứng dụng phong cách thiết kế đặc trưng "Hang Đá & Rơm", mang nét truyền thống phụng vụ nhưng hiện đại và mượt mà.*

| Dashboard Ban Điều Phối | Quản Lý Khu Vực Công Tác |
|:---:|:---:|
| ![Dashboard](https://via.placeholder.com/600x340/FBF6E9/3E2F23?text=GrottoWorks+Season+Dashboard) | ![Work Areas](https://via.placeholder.com/600x340/FBF6E9/3E2F23?text=Bethlehem+Grotto+Work+Areas) |
| *Theo dõi tiến độ Mùa Vọng, giờ công và việc cần chú ý* | *Quản lý 5 khu vực: Hang đá, Cây thông, Đèn, Sân khấu, Sân* |

| Kho Vật Tư & Đề Nghị Mua Sắm | Báo Cáo & Vinh Danh Đóng Góp |
|:---:|:---:|
| ![Materials](https://via.placeholder.com/600x340/FBF6E9/3E2F23?text=Materials+Ledger+%26+Purchases) | ![Reports](https://via.placeholder.com/600x340/FBF6E9/3E2F23?text=Final+Reports+%26+Recognition) |
| *Bảng cân đối thiếu hụt vật tư & duyệt hồ sơ mua sắm* | *Bảng vinh danh điểm thưởng và xuất báo cáo CSV chi phí* |

---

## 👥 Vai Trò Và Phân Quyền Người Dùng

GrottoWorks thiết kế trải nghiệm chuyên biệt cho **4 vai trò trên Web** và kết nối với **1 ứng dụng Mobile dành cho Tình nguyện viên**:

```
                       ┌─────────────────────────────────┐
                       │   PARISH (Ban Hành Giáo Xứ)     │
                       │   Tạo mùa, chia khu, duyệt mua  │
                       └────────────────┬────────────────┘
                                        │
             ┌──────────────────────────┴──────────────────────────┐
             ▼                                                     ▼
┌─────────────────────────┐                               ┌─────────────────────────┐
│ COMMUNITY (Giáo Khu)    │                               │ MATERIAL_OFFICER        │
│ Điều phối khu của mình  │                               │ (Ban Vật Tư & Tài trợ)  │
└────────────┬────────────┘                               └────────────┬────────────┘
             │                                                         │
             └──────────────────────────┬──────────────────────────────┘
                                        ▼
                       ┌─────────────────────────────────┐
                       │   LEADER (Trưởng Khu Vực)       │
                       │   Chia việc, duyệt công việc    │
                       └────────────────┬────────────────┘
                                        │
                                        ▼
                       ┌─────────────────────────────────┐
                       │   VOLUNTEER (Tình nguyện viên)  │
                       │   Mobile App (Check-in, Làm)    │
                       └─────────────────────────────────┘
```

### 1. ⛪ PARISH (Ban Hành Giáo / Giáo Xứ) — `Route: /parish/*`
- Khởi tạo mùa chuẩn bị Giáng Sinh mới (`/parish/seasons`), đặt hạn mức ngân sách và khoảng thời gian.
- Phân bổ các khu vực công tác cho các Giáo khu phụ trách (`/parish/areas`).
- Phê duyệt các đề nghị mua sắm lớn từ Ban Vật Tư (`/parish/purchases`).
- Quản trị tài khoản, cộng đoàn giáo khu, danh mục, quy tắc tích lũy điểm thưởng vinh danh và sao lưu dữ liệu.

### 2. 🏘️ COMMUNITY (Ban Đại Diện Giáo Khu) — `Route: /community/*`
- Giám sát các khu vực công tác thuộc phạm vi giáo khu của mình.
- Quản lý danh sách tình nguyện viên thuộc giáo khu (`/community/volunteers`).
- Tiếp nhận và phát động hỗ trợ khẩn cấp liên giáo khu (`/community/support`).
- Kiểm tra danh mục checklist sẵn sàng đón lễ (`/community/checklist`) và xuất báo cáo tổng kết (`/community/reports`).

### 3. 🔨 LEADER (Trưởng Khu Vực Công Tác) — `Route: /leader/*`
- Quản lý trực tiếp một khu vực công tác (Hang đá Bê-lem, Cây thông, Ánh sáng, Sân khấu, Sân nhà thờ).
- Phân tách hạng mục công việc (Tasks), chỉ định kỹ năng cần có (mộc, hàn, điện, sơn, trang trí, vận chuyển).
- Chỉ định và phê duyệt đăng ký tham gia của tình nguyện viên (`/leader/regs`).
- Đánh giá chất lượng công việc, duyệt ảnh nghiệm thu hoặc yêu cầu làm lại (`REVISE`).
- Chấm công, duyệt điều chỉnh giờ công (`/leader/timesheets`).

### 4. 📦 MATERIAL_OFFICER (Phụ Trách Vật Tư) — `Route: /material-officer/*`
- Quản lý định mức vật tư theo từng khu vực: *Cần thiết - Tồn kho - Đã mua - Được tặng - Còn thiếu*.
- Lập đề nghị mua sắm gửi lên cấp duyệt (`/material-officer/purchases`).
- Xác nhận vật tư mua về kèm ảnh chụp hóa đơn chứng từ (`/material-officer/purchases-confirm`).
- Tiếp nhận và theo dõi các khoản quyên góp hiện vật (`/material-officer/donations`) và đồ mượn (`/material-officer/borrowed`).
- Phân bổ vật tư cho từng đầu việc cụ thể (`/material-officer/allocations`).

### 5. 📱 Volunteer Mobile App *(Ngoài phạm vi Web SPA)*
- Dành cho bà con giáo dân và tình nguyện viên trẻ dùng trực tiếp trên điện thoại thông minh:
  - Điểm danh quét mã check-in / check-out ghi nhận giờ công.
  - Đăng ký kỹ năng sở trường (điện, mộc, trang trí...).
  - Nhận nhiệm vụ, chụp ảnh báo cáo tiến độ hiện trường.
  - Tải lên hóa đơn sau khi đi mua vật tư hỗ trợ giáo xứ.
  - Đăng ký quyên góp vật tư hoặc đại diện quyên góp.
- *Web SPA GrottoWorks đóng vai trò là đầu mối tiếp nhận, xét duyệt và tổng hợp toàn bộ các hành động từ mobile app.*

---

## 🛠️ Tech Stack

Dự án áp dụng kiến trúc Single Page Application (SPA) hiện đại với bộ công cụ tối ưu:

| Thành phần | Công nghệ sử dụng | Mục đích |
|---|---|---|
| **Core Framework** | React 19 + TypeScript 5.7 | Giao diện tương tác cao, kiểu dữ liệu an toàn |
| **Bundler & Tooling** | Vite 6 | Tốc độ HMR cực nhanh, build production tối ưu |
| **Routing** | React Router 7 | Điều hướng theo vai trò (Role-based layout routes) |
| **UI Components** | Tailwind CSS + Lucide Icons | Thiết kế theo theme "Hang Đá & Rơm", icon trực quan |
| **Server State** | TanStack React Query 5 | Quản lý cache API, tự động làm mới khi mutate |
| **Forms & Validation** | React Hook Form + Zod | Xử lý biểu mẫu tinh gọn, validation mạnh mẽ |
| **Biểu Đồ** | Recharts | Trực quan hóa tiến độ Mùa Vọng và biểu đồ giờ công |
| **Mock Database** | MSW 2 + localStorage | Giả lập backend hoàn chỉnh không phụ thuộc máy chủ |
| **Đa ngôn ngữ (i18n)** | react-i18next | Tiếng Việt mặc định, hỗ trợ tiếng Anh dự phòng |
| **Kiểm thử tự động** | Vitest + Testing Library + jsdom | Kiểm thử Unit & Integration test toàn diện |

---

## 🚀 Cài Đặt & Khởi Chạy

### Yêu cầu hệ thống
- **Node.js**: Phiên bản `20.x` trở lên
- **npm**: Phiên bản `10.x` trở lên

### Các bước thực hiện

1. **Clone mã nguồn dự án:**
   ```bash
   git clone https://github.com/nkhoa31/grottoworks.git
   cd grottoworks
   ```

2. **Cài đặt các gói phụ thuộc:**
   ```bash
   npm install
   ```

3. **Khởi chạy môi trường phát triển (Development Server):**
   ```bash
   npm run dev
   ```
   Ứng dụng sẽ chạy tại địa chỉ: `http://localhost:5173`

4. **Kiểm tra kiểu dữ liệu TypeScript:**
   ```bash
   npx tsc --noEmit
   ```

5. **Chạy toàn bộ bài kiểm thử tự động (Vitest):**
   ```bash
   npm run test
   ```

6. **Build sản phẩm đóng gói (Production Build):**
   ```bash
   npm run build
   npm run preview
   ```

---

## 🔑 Tài Khoản Demo Sẵn Có

Hệ thống tích hợp sẵn dữ liệu mẫu (mock seed) gồm 4 tài khoản demo cho 4 vai trò. Mật khẩu chung là: `grotto`

| Vai trò | Email đăng nhập | Mật khẩu | Phạm vi truy cập |
|---|---|:---:|---|
| **PARISH** | `admin@grottoworks.vn` | `grotto` | Toàn quyền Giáo xứ (`/parish/*`) |
| **COMMUNITY** | `committee@grottoworks.vn` | `grotto` | Giáo khu Thánh Tâm (`/community/*`) |
| **LEADER** | `leader@grottoworks.vn` | `grotto` | Trưởng khu Hang đá Bê-lem (`/leader/*`) |
| **MATERIAL_OFFICER** | `officer@grottoworks.vn` | `grotto` | Ban Vật Tư Hang đá (`/material-officer/*`) |

---

## 📂 Cấu Trúc Thư Mục

```text
grottoworks-fe/
├── public/                     # Tài nguyên tĩnh & Service Worker của MSW
│   └── mockServiceWorker.js
├── src/
│   ├── components/
│   │   ├── shared/             # UI dùng chung nghiệp vụ (AppShell, DataTable, PageHeader...)
│   │   │   ├── nav-config.ts   # Cấu hình thanh điều hướng theo từng vai trò
│   │   │   └── ...
│   │   └── ui/                 # Nguyên tử UI cơ bản (Button, Dialog, Input, Card, Toast...)
│   ├── features/               # Module hóa theo miền nghiệp vụ (Domain Features)
│   │   ├── areas/              # Quản lý khu vực công tác (Hang đá, Cây thông...)
│   │   ├── checklist/          # Danh mục kiểm tra mức độ sẵn sàng đón lễ
│   │   ├── dashboards/         # Bảng điều khiển riêng cho từng vai trò
│   │   ├── donations/          # Quản lý đóng góp, quà tặng hiện vật
│   │   ├── materials/          # Bảng kê khai và theo dõi tồn kho vật tư
│   │   ├── parish/             # Tính năng quản trị giáo xứ, tài khoản, cấu hình
│   │   ├── purchases/          # Đề xuất mua sắm & xác nhận hóa đơn chứng từ
│   │   ├── reports/            # Báo cáo chi phí, giờ công & bảng vinh danh
│   │   ├── season/             # Quản lý mùa chuẩn bị Giáng Sinh
│   │   ├── support/            # Yêu cầu cứu trợ khẩn cấp liên giáo khu
│   │   ├── tasks/              # Phân chia nhiệm vụ, gán TNV và nghiệm thu
│   │   ├── timesheets/         # Bảng chấm công tình nguyện viên
│   │   └── volunteers/         # Danh sách và hồ sơ chi tiết tình nguyện viên
│   ├── lib/                    # Thư viện tiện ích (api wrapper, auth, db, format, utils)
│   ├── locales/                # Từ điển i18n phẳng (vi.json, en.json)
│   ├── mocks/                  # MSW setup, API handlers & dữ liệu seed giáo xứ
│   │   ├── handlers.ts         # REST API mock handlers & logic tính toán dẫn xuất
│   │   └── seed/               # Dữ liệu mẫu (Giáo xứ Tân Định, 3 giáo khu, 30 giáo dân)
│   ├── pages/                  # Trang dùng chung (Login, Profile, NotFound, Forbidden)
│   ├── routes/                 # Bảo vệ route theo vai trò (RequireRole.tsx)
│   ├── types/                  # Định nghĩa TypeScript Domain Models (index.ts)
│   ├── App.tsx                 # Cấu hình tuyến đường (Routes), providers & Lazy Pages
│   └── main.tsx                # Khởi động MSW Worker và mount ứng dụng React
├── tailwind.config.ts          # Bảng màu "Hang Đá & Rơm", bo góc grotto-arch
├── vite.config.ts              # Cấu hình Vite & Vitest
└── tsconfig.json               # Cấu hình trình biên dịch TypeScript
```

---

## 📌 Lưu Ý Kỹ Thuật Quan Trọng

> [!IMPORTANT]
> ### Quy ước đường dẫn cho `MATERIAL_OFFICER`
> Để đảm bảo tính chuẩn hóa của URL web theo tiêu chuẩn RESTful kebab-case, role `MATERIAL_OFFICER` sử dụng prefix đường dẫn là:
> ```ts
> /material-officer/*
> ```
> *(Thay vì `/material_officer/*` như định danh enum).*
> Hàm tiện ích `rolePrefix(role)` trong [`src/App.tsx`](src/App.tsx) tự động chuyển đổi:
> - `PARISH` ➔ `/parish`
> - `COMMUNITY` ➔ `/community`
> - `LEADER` ➔ `/leader`
> - `MATERIAL_OFFICER` ➔ `/material-officer`

> [!TIP]
> ### Cơ chế cơ sở dữ liệu Mock cục bộ
> - Toàn bộ dữ liệu của GrottoWorks hoạt động dựa trên Mock Service Worker (MSW) và lưu trữ cục bộ tại `localStorage['grotto-db-v1']`.
> - Dữ liệu tự động đồng bộ sau mỗi thao tác tạo/sửa/xóa mà không cần backend thực tế.
> - Để reset dữ liệu về trạng thái ban đầu, bạn chỉ cần xóa mục `grotto-db-v1` trong LocalStorage hoặc đăng xuất và đăng nhập lại.

---

## 📜 Giấy Phép (License)

Dự án được phát hành theo giấy phép mã nguồn mở **MIT License**. Mọi đóng góp nhằm phục vụ công tác phụng vụ và thiện nguyện tại các giáo xứ đều được hoan nghênh.

---

<div align="center">
  <sub>Phát triển với trọn vẹn tâm tình phục vụ cộng đoàn Mùa Giáng Sinh.</sub>
</div>
