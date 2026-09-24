# DESIGN_SYSTEM.md — Hệ thống UI/UX & Design Tokens

**Dự án:** Hệ thống Quản lý & Điều phối Chuẩn bị Giáng Sinh Giáo xứ
**Phiên bản:** 1.0
**Design Theme:** Golden Winter
**Phong cách:** Trang nghiêm · Ấm áp · Sáng dịu · Quản lý hiện đại

---

# 1. Tổng quan Design System

Design System này quy định các nguyên tắc chung về **UI, UX, Layout, Typography, Color, Component và Responsive Design** cho toàn bộ hệ thống.

Hệ thống gồm hai nền tảng:

- **Web System:** dành cho Admin, Committee, Work Area Leader và Material Officer.
- **Mobile App:** dành cho Volunteer và Contributor.

Mục tiêu thiết kế:

1. Đồng nhất giao diện trên toàn hệ thống.
2. Dễ sử dụng cho nhiều độ tuổi.
3. Ưu tiên khả năng đọc dữ liệu và thao tác nghiệp vụ.
4. Giảm số bước khi thực hiện các thao tác thường xuyên.
5. Phân biệt rõ dữ liệu, trạng thái và hành động.
6. Giữ được không khí Giáng Sinh nhưng không biến giao diện thành giao diện trang trí lễ hội.
7. Các màn hình quản lý phải mang tính **Management Dashboard** thay vì giao diện mạng xã hội.

---

# 2. Design Principles

## 2.1. Management First

Hệ thống phục vụ quản lý và điều phối công việc nên:

- Ưu tiên thông tin nghiệp vụ.
- Ưu tiên trạng thái và tiến độ.
- Ưu tiên khả năng theo dõi.
- Hạn chế các thành phần trang trí không phục vụ thao tác.
- Không sử dụng quá nhiều hiệu ứng animation.

---

## 2.2. Clear Hierarchy

Mỗi màn hình phải có thứ bậc thông tin rõ ràng:

```text
Page Title
    ↓
Page Description / Context
    ↓
Primary Actions
    ↓
Summary / KPI
    ↓
Main Data
    ↓
Secondary Information
```

Không để nhiều thành phần cùng có mức độ nổi bật như nhau.

---

## 2.3. Role-based Interface

Sidebar và nội dung hiển thị phải phụ thuộc vào vai trò.

Không đưa mọi functional action thành một menu/resource riêng.

Ví dụ:

```text
Volunteers
 ├── Danh sách tình nguyện viên
 ├── Phân công
 ├── Kỹ năng
 └── Yêu cầu hỗ trợ
```

Thay vì:

```text
Volunteers
Support Requests
Skills
Assignments
```

Nguyên tắc:

> Sidebar đại diện cho **resource/domain chính**, không đại diện cho mọi action trong hệ thống.

---

## 2.4. Action Inside Resource

Các chức năng liên quan đến một resource phải được đặt trong:

- Body Content.
- Tab.
- Section.
- Detail page.
- Modal / Drawer.
- Bottom Sheet trên Mobile.

Không tạo sidebar item riêng nếu chức năng đó chỉ là một phần của resource.

---

## 2.5. One Primary Action

Mỗi màn hình nên có một hành động chính.

Ví dụ:

```text
Work Area
    → Primary: Quản lý công việc

Materials
    → Primary: Tạo yêu cầu vật tư

Volunteers
    → Primary: Phân công tình nguyện viên

Purchase Request
    → Primary: Tạo yêu cầu mua
```

Các action phụ sử dụng:

- Secondary Button.
- Dropdown.
- Overflow Menu.
- Row Action.

---

# 3. Visual Tone & Color Palette

Hệ thống sử dụng nguyên tắc **60-30-10**.

## 3.1. 60% — Canvas

```text
#F8F9FA
```

Màu nền tổng thể.

Mục đích:

- Tạo khoảng thở.
- Không gây lóa.
- Giúp card nổi bật.
- Phù hợp với dashboard quản lý.

---

## 3.2. 30% — Cards & Typography

### Card

```text
#FFFFFF
```

### Main Text

```text
#2B2D42
```

Sử dụng cho:

- Heading.
- Nội dung chính.
- Dữ liệu quan trọng.
- Label.

---

## 3.3. 10% — Festive Accent

### Primary — Royal Pine Green

```text
#0A5C36
```

Sử dụng cho:

- Primary Button.
- Active Sidebar.
- Navigation.
- Link quan trọng.
- Progress.
- Success state.
- Heading có emphasis.

### Primary Hover

```text
#0D7344
```

### Champagne Gold

```text
#EEB902
```

Sử dụng cho:

- Icon nổi bật.
- Điểm thưởng.
- Highlight.
- Badge đặc biệt.
- Secondary emphasis.

### Warm Gold

```text
#F4A261
```

Sử dụng cho:

- Cảnh báo nhẹ.
- Thiếu hụt.
- Pending.
- Progress warning.

---

# 4. Typography System

Font chính:

```text
Be Vietnam Pro
```

Fallback:

```text
Inter
-apple-system
BlinkMacSystemFont
"Segoe UI"
Roboto
sans-serif
```

Ưu tiên `Be Vietnam Pro` vì hệ thống sử dụng nhiều nội dung tiếng Việt.

---

## 4.1. Typography Scale

| Component     |  Web | Mobile | Weight | Line Height |
| ------------- | ---: | -----: | -----: | ----------: |
| Display KPI   | 32px |   28px |    700 |         1.2 |
| H1 Page Title | 24px |   20px |    700 |         1.3 |
| H2 Section    | 18px |   16px |    600 |         1.4 |
| H3 Card Title | 15px |   15px |    600 |         1.4 |
| Body          | 14px |   14px |    400 |         1.5 |
| Body Small    | 13px |   12px |    400 |         1.5 |
| Button        | 14px |   15px |    500 |         1.0 |
| Status Badge  | 11px |   11px |    600 |         1.0 |

---

## 4.2. Typography Rules

### Không sử dụng toàn bộ chữ in hoa

Không dùng:

```text
DUYỆT YÊU CẦU
```

Ưu tiên:

```text
Duyệt yêu cầu
```

---

### Button sử dụng Sentence Case

Ví dụ:

```text
Tạo yêu cầu
Duyệt mua vật tư
Đăng ký tham gia
Cập nhật tiến độ
```

---

### Numeric Data

Đối với:

- Số lượng.
- Tiền.
- Phần trăm.
- Thời gian.
- KPI.

Sử dụng:

```css
font-variant-numeric: tabular-nums;
```

Mục đích giúp các con số thẳng hàng khi hiển thị trong bảng.

---

# 5. Layout System

# 5.1. Web System

Đối tượng:

- Admin.
- Committee.
- Work Area Leader.
- Material Officer.

Cấu trúc tổng thể:

```text
+--------------------------------------------------------------------------------+
| HEADER                                                                         |
| Page Context                    Season Selector                 Profile       |
+----------------------+---------------------------------------------------------+
|                      |                                                         |
|                      | PAGE HEADER                                              |
|                      | Title + Description + Primary Actions                    |
|                      |                                                         |
| SIDEBAR              +---------------------------------------------------------+
|                      |                                                         |
| Brand / Role         | KPI / Summary                                           |
|                      |                                                         |
| Overview             +---------------------------------------------------------+
| Work Areas           |                                                         |
| Tasks                | MAIN CONTENT                                            |
| Materials            |                                                         |
| Volunteers           | Data Table / Cards / Charts / Forms                    |
| Reports              |                                                         |
|                      |                                                         |
|                      +---------------------------------------------------------+
|                      | Secondary Information / Activity / Readiness            |
+----------------------+---------------------------------------------------------+
```

---

# 5.2. Web Header

Header nằm cố định phía trên.

Cấu trúc:

```text
+--------------------------------------------------------------------------+
| Page Title / Breadcrumb              Season Selector       User Profile |
+--------------------------------------------------------------------------+
```

## Thành phần

### Left

Hiển thị:

- Tên màn hình.
- Breadcrumb nếu cần.

Ví dụ:

```text
Quản lý Vật tư
```

hoặc:

```text
Work Areas / Main Grotto
```

---

### Center / Right

Season Selector:

```text
Mùa Giáng Sinh 2026 ▼
```

Cho phép chuyển đổi mùa Giáng Sinh đang quản lý.

---

### Far Right

User Profile:

```text
[Avatar] Nguyễn Văn A
         Committee
```

Click mở Popover:

```text
Thông tin cá nhân
Cài đặt
Đăng xuất
```

---

## Không sử dụng Search trong Header

Search chỉ xuất hiện trong những màn hình thực sự cần tìm kiếm dữ liệu.

Ví dụ:

```text
Volunteers
[ 🔍 Tìm tình nguyện viên... ]
```

Không đặt Search cố định trong Header toàn hệ thống.

---

# 5.3. Web Sidebar

Sidebar mặc định:

```text
260px
```

Collapsed:

```text
72px
```

Sidebar gồm:

```text
Brand Block
Navigation
Optional Bottom Utility
```

---

## Brand Block

Brand thay đổi theo role.

Ví dụ:

```text
Christmas Management
Committee
```

hoặc:

```text
Christmas Management
Material Officer
```

---

## Sidebar Principles

Sidebar chỉ chứa resource/domain chính.

Ví dụ:

```text
Overview
Work Areas
Tasks
Materials
Volunteers
Reports
```

Không tạo:

```text
Support Requests
Assignments
Skills
Donation
Purchase
```

thành các menu riêng nếu chúng là chức năng thuộc resource khác.

---

# 5.4. Page Header

Mỗi màn hình quản lý phải có:

```text
H1
Short Description
Primary Action
Secondary Actions
```

Ví dụ:

```text
Quản lý Vật tư

Theo dõi vật tư cần thiết, đã nhận và còn thiếu
cho các khu vực chuẩn bị Giáng Sinh.

[+ Tạo yêu cầu vật tư] [Xuất báo cáo]
```

---

# 5.5. Grid System

Web sử dụng:

```text
12-column grid
```

Page padding:

```text
32px
```

Khoảng cách:

```text
16px
20px
24px
32px
```

---

## Grid Rules

### KPI

```text
4 columns
```

Ví dụ:

```text
[ Tổng công việc ]
[ Hoàn thành ]
[ Vật tư thiếu ]
[ Readiness ]
```

### Main Content

Thông thường:

```text
8 columns + 4 columns
```

hoặc:

```text
7 columns + 5 columns
```

Không bắt buộc phải luôn sử dụng Side Panel.

Side Panel chỉ xuất hiện khi thực sự có thông tin bổ trợ.

---

# 6. Card System

Card:

```text
background: #FFFFFF
border: 1px solid #E9ECEF
border-radius: 12px
```

Shadow:

```text
0 4px 16px rgba(10, 92, 54, 0.04)
```

---

## Card Padding

Thông thường:

```text
20px
```

Compact:

```text
16px
```

Large:

```text
24px
```

---

## Card Structure

```text
Card Header
    Title
    Optional Action

Card Body
    Main Content

Card Footer
    Metadata
    Secondary Action
```

---

# 7. Mobile App Layout

Đối tượng:

- Volunteer.
- Contributor.

Mobile ưu tiên:

- Thao tác nhanh.
- Một tay.
- Card.
- Bottom Sheet.
- Bottom Navigation.
- Camera.
- Check-in.
- Báo cáo tiến độ.

---

## 7.1. Mobile Structure

```text
+----------------------------------------------+
| HEADER                                       |
| Avatar + Greeting              Notification |
+----------------------------------------------+
|                                              |
| CONTEXT / TODAY                              |
| Công việc hôm nay                            |
|                                              |
+----------------------------------------------+
|                                              |
| CARD FEED                                    |
|                                              |
| Task Card                                    |
| Material Shortage Card                      |
| Support Request Card                         |
|                                              |
+----------------------------------------------+
|                                              |
|                                              |
+----------------------------------------------+
| Trang chủ | Nhiệm vụ | Đóng góp | Hồ sơ     |
+----------------------------------------------+
```

---

# 7.2. Bottom Navigation

Cố định phía dưới:

```text
64px
```

Có 4 tab:

```text
Trang chủ
Nhiệm vụ
Đóng góp
Hồ sơ
```

Mỗi item phải có:

```text
Icon
Label
```

Không dùng icon đơn độc cho navigation chính.

---

# 7.3. Touch Target

Kích thước tối thiểu:

```text
48 × 48px
```

Các action quan trọng nên:

```text
52 × 52px
```

hoặc:

```text
56 × 56px
```

---

# 8. Responsive Rules

## Desktop

```text
≥ 1200px
```

Sử dụng:

- Sidebar.
- 12-column grid.
- Multi-column cards.
- Data tables.
- Side panels.

---

## Tablet

```text
768px – 1199px
```

Có thể:

- Thu nhỏ Sidebar.
- Chuyển một số Side Panel xuống dưới.
- Giảm số lượng KPI trên một hàng.
- Table có horizontal scroll.

---

## Mobile

```text
< 768px
```

Không sử dụng:

- Data table quá rộng.
- Side panel cố định.
- Sidebar desktop.

Thay bằng:

- Card.
- Accordion.
- Bottom Sheet.
- Tabs.
- Horizontal scroll.
- Bottom Navigation.

---

# 9. Data Table

Data Table dành cho Web.

## Header

```text
Background: #F1F5F2
Color: #0A5C36
Font Size: 13px
Font Weight: 600
```

---

## Row

Minimum:

```text
52px
```

Hover:

```text
#F8F9FA
```

---

## Table Actions

Không đặt quá nhiều button trong một row.

Ưu tiên:

```text
[View]
[Edit]
[More ▼]
```

Các action ít sử dụng đưa vào:

```text
More Menu
```

---

## Mobile Table

Không cố gắng ép toàn bộ table vào màn hình nhỏ.

Có thể chuyển thành:

```text
Data Card
```

Ví dụ:

```text
Main Grotto

Tiến độ        90%
Tình trạng     Ready
Leader         Nguyễn Văn A

[ Xem chi tiết ]
```

---

# 10. Progress System

Progress Bar dùng để biểu diễn:

- Tiến độ task.
- Tiến độ work area.
- Vật tư đã nhận.
- Mức độ hoàn thành.

---

## Standard Progress

```text
Track:
#E9ECEF

Completed:
#0A5C36
```

---

## Material Progress

Dùng hai trạng thái:

```text
Received:
#0A5C36

Shortage:
#F4A261
```

Ví dụ:

```text
Vật tư: 80 / 100

████████████████░░░░
Received          Shortage
```

Không dùng màu đỏ cho mọi trường hợp thiếu nhẹ.

---

# 11. Readiness Checklist

Readiness dùng để kiểm tra khả năng sẵn sàng của Work Area.

Ví dụ:

```text
Readiness
--------------------------------
▼ Điện
   ✓ Nguồn điện
   ✓ Dây điện
   ! Ổ cắm

▼ Kết cấu
   ✓ Khung
   ✓ Mái che

▼ Trang trí
   ✓ Cây thông
   ! Đèn trang trí

▼ Vệ sinh
   ✓ Khu vực sạch
```

---

## Status

### Passed

```text
#E8F5E9
#0A5C36
```

### Failed

```text
#FEE2E2
#991B1B
```

Khi Failed:

```text
Failed
    ↓
Hiển thị lý do
    ↓
[ Tạo Task khắc phục ]
```

Không bắt buộc người dùng rời khỏi Readiness page để tạo task.

---

# 12. Status Badge System

Công thức:

```text
Pastel Background
+
Dark Text
+
Icon
+
Label
```

| Trạng thái           | Background | Text/Icon | Sử dụng                     |
| -------------------- | ---------- | --------- | --------------------------- |
| Hoàn thành / Passed  | `#E8F5E9`  | `#0A5C36` | Task, Readiness, Approval   |
| Đang xử lý / Pending | `#FEF3C7`  | `#B45309` | Chờ duyệt, chờ xác nhận     |
| Cần sửa / Revision   | `#FFEEDD`  | `#D97706` | Cần chỉnh sửa               |
| Cảnh báo / Shortage  | `#FEE2E2`  | `#991B1B` | Thiếu nghiêm trọng, quá hạn |
| Trung tính / Draft   | `#F1F3F5`  | `#495057` | Draft, chưa kích hoạt       |

---

## Badge Rules

Badge không sử dụng để thay thế nội dung.

Không:

```text
[Đỏ]
```

Ưu tiên:

```text
[! Cần bổ sung vật tư]
```

---

# 13. Button System

## Primary Button

```text
Background: #0A5C36
Text: #FFFFFF
```

Dùng cho:

- Tạo.
- Xác nhận.
- Lưu.
- Duyệt.
- Gửi.

---

## Primary Hover

```text
#0D7344
```

---

## Secondary Button

```text
Background: #FFFFFF
Border: #E9ECEF
Text: #2B2D42
```

---

## Gold Button

Chỉ sử dụng khi action có tính chất đặc biệt hoặc highlight.

```text
Background: #EEB902
Text: #2B2D42
```

Không sử dụng Gold cho toàn bộ primary actions.

---

## Danger Button

```text
Background: #991B1B
Text: #FFFFFF
```

Chỉ sử dụng cho:

- Xóa.
- Hủy.
- Từ chối.
- Các hành động không thể hoàn tác.

---

# 14. Icon Rules

Không sử dụng icon đơn độc cho các action quan trọng.

Ưu tiên:

```text
[ + ] Tạo yêu cầu
[ ✓ ] Duyệt
[ ↑ ] Tải ảnh
[ ! ] Cảnh báo
```

Icon-only được phép đối với:

- Close.
- Back.
- More.
- Navigation icon khi đã có tooltip hoặc label rõ ràng.
- Các action phụ.

---

# 15. Modal, Drawer & Bottom Sheet

## Web

Sử dụng:

- Modal.
- Drawer.
- Confirmation Dialog.

Cho:

- Form ngắn.
- Xác nhận.
- Chi tiết nhanh.
- Action phụ.

---

## Mobile

Ưu tiên:

```text
Bottom Sheet
```

thay vì modal giữa màn hình.

Ví dụ:

```text
+----------------------------------+
|                                  |
|                                  |
|        Current Screen            |
|                                  |
+----------------------------------+
| Đăng ký quyên góp                |
|                                  |
| Vật tư: Đèn LED                  |
| Số lượng: [-] 10 [+]            |
|                                  |
| [ Xác nhận quyên góp ]           |
+----------------------------------+
```

---

# 16. Mobile Quick Actions

## Check-in / Check-out

Action quan trọng nên nằm ở vị trí dễ chạm.

Có thể sử dụng:

```text
FAB
```

hoặc:

```text
Full-width Sticky Button
```

Ví dụ:

```text
[ ● Check-in công việc ]
```

Kích thước:

```text
56px
```

---

# 17. Photo Upload

Photo Upload sử dụng cho:

- Báo cáo tiến độ.
- Bill mua vật tư.
- Chứng từ.
- Hình ảnh nghiệm thu.

Flow:

```text
Chọn Task
    ↓
Chụp ảnh / Chọn ảnh
    ↓
Preview
    ↓
Thêm mô tả
    ↓
Upload
    ↓
Xác nhận
```

Không tự động thêm watermark lên ảnh gốc nếu chưa có yêu cầu nghiệp vụ rõ ràng.

Nếu cần xác thực thời gian/chứng từ, thông tin ngày giờ nên được lưu trong metadata hoặc hiển thị ở phần thông tin chứng từ.

---

# 18. Quick Pledge

Đăng ký quyên góp vật tư hoặc tài chính trên Mobile sử dụng Bottom Sheet.

Ví dụ:

```text
Quyên góp vật tư

Vật tư
[ Đèn LED              ▼ ]

Số lượng
[ - ]       10       [ + ]

Ghi chú
[________________________]

[ Xác nhận quyên góp ]
```

Quy tắc:

- Control lớn.
- Dễ chạm.
- Không yêu cầu nhập liệu phức tạp.
- Hiển thị rõ đơn vị.
- Hiển thị tổng số trước khi xác nhận.

---

# 19. Form Design

Form phải chia thành các nhóm logic.

Ví dụ:

```text
Thông tin cơ bản

Tên công việc
Mô tả
Work Area


Phân công

Leader
Tình nguyện viên
Thời gian


Vật tư

Danh sách vật tư
Số lượng


Xác nhận

[ Hủy ] [ Tạo công việc ]
```

---

## Form Rules

- Label luôn hiển thị.
- Placeholder không thay thế Label.
- Required field có dấu `*`.
- Error hiển thị ngay dưới field.
- Không chỉ dùng màu đỏ để biểu diễn lỗi.
- Error message phải nói rõ cách sửa.

Không:

```text
Dữ liệu không hợp lệ.
```

Ưu tiên:

```text
Số lượng phải lớn hơn 0.
```

---

# 20. Empty State

Khi chưa có dữ liệu, không để màn hình trắng.

Ví dụ:

```text
Không có yêu cầu vật tư

Hiện chưa có yêu cầu vật tư nào
cho mùa Giáng Sinh này.

[ + Tạo yêu cầu vật tư ]
```

Empty State gồm:

```text
Icon / Illustration
Title
Description
Primary Action
```

---

# 21. Loading State

Không sử dụng spinner cho mọi thành phần.

Ưu tiên:

- Skeleton loading cho card.
- Skeleton loading cho table.
- Spinner cho action ngắn.

Ví dụ:

```text
┌──────────────────────────────┐
│ ██████████████               │
│ ████████████████████         │
│ ███████████                  │
└──────────────────────────────┘
```

---

# 22. Toast & Feedback

Toast dùng cho thao tác đã hoàn thành.

Ví dụ:

```text
✓ Đã cập nhật tiến độ.
```

```text
✓ Đã gửi yêu cầu vật tư.
```

```text
! Không thể cập nhật. Vui lòng thử lại.
```

Toast:

- Không che action quan trọng.
- Có thể tự biến mất.
- Không chứa quá nhiều nội dung.
- Error quan trọng không chỉ dùng Toast; cần hiển thị inline nếu người dùng cần sửa dữ liệu.

---

# 23. Confirmation & Forgiving UX

Các action nguy hiểm:

```text
Xóa
Hủy
Từ chối
Hủy phân công
```

phải yêu cầu xác nhận.

Ví dụ:

```text
Từ chối yêu cầu?

Yêu cầu này sẽ được trả lại cho người tạo.

Lý do
[________________________]

[ Hủy ] [ Từ chối yêu cầu ]
```

Không sử dụng:

```text
Bạn có chắc không?
```

mà không cung cấp context.

---

# 24. Accessibility

## Contrast

Text phải có độ tương phản đủ cao với background.

Không sử dụng:

```text
Light Gray text
trên
White background
```

cho nội dung chính.

---

## Touch Target

Mobile:

```text
≥ 48 × 48px
```

---

## Color Independence

Không chỉ dùng màu để truyền tải trạng thái.

Không:

```text
🟢
```

Ưu tiên:

```text
✓ Hoàn thành
```

hoặc:

```text
! Cần xử lý
```

---

# 25. Spacing System

Sử dụng spacing scale:

```text
4px
8px
12px
16px
20px
24px
32px
40px
48px
64px
```

Quy tắc:

```text
4px  → micro spacing
8px  → icon / label
12px → field
16px → component
20px → card
24px → section
32px → page section
48px → major separation
64px → layout separation
```

---

# 26. Border Radius

```text
Small:
6px

Medium:
10px

Large:
16px
```

Sử dụng:

```text
6px  → Input / small control
10px → Button / Card nhỏ
12px → Desktop Card
16px → Mobile Card / Bottom Sheet
```

---

# 27. Elevation

## Card

```css
0 4px 16px rgba(10, 92, 54, 0.04)
```

## Hover

```css
0 8px 24px rgba(10, 92, 54, 0.08)
```

Không sử dụng shadow quá đậm.

Dashboard phải giữ cảm giác nhẹ và sạch.

---

# 28. Navigation Rules

Navigation phải phản ánh phạm vi quyền của user.

Ví dụ:

```text
Committee

Overview
Work Areas
Tasks
Materials
Volunteers
Reports
```

---

## Functional Grouping

Các chức năng liên quan được nhóm trong resource.

Ví dụ:

```text
Volunteers
├── All Volunteers
├── Assignments
├── Skills
└── Support Requests
```

Không cần:

```text
Volunteers
Assignments
Skills
Support Requests
```

trên Sidebar nếu tất cả đều thuộc cùng domain.

---

# 29. Page Structure Standard

Mọi trang Web nên tuân theo:

```text
Page
│
├── Page Header
│   ├── Breadcrumb
│   ├── H1
│   ├── Description
│   └── Actions
│
├── Summary / KPI
│
├── Filter / Tab
│
├── Main Content
│
└── Secondary Content
```

---

# 30. Detail Page Standard

Ví dụ Work Area Detail:

```text
Work Areas / Main Grotto

Main Grotto
Christmas Grotto
Leader: Nguyễn Văn A

[ Edit ] [ Manage Tasks ]

--------------------------------

Overview
Progress: 90%
Readiness: Ready

--------------------------------

Tasks

Task List

--------------------------------

Materials

Material Status

--------------------------------

Volunteers

Assigned Volunteers

--------------------------------

Readiness

Checklist
```

Không tạo quá nhiều page nhỏ nếu thông tin có thể được quản lý trong cùng một detail page.

---

# 31. Dashboard Rules

Dashboard không hiển thị tất cả dữ liệu.

Dashboard chỉ trả lời:

```text
Có chuyện gì đang xảy ra?
Có gì cần xử lý?
Tiến độ hiện tại thế nào?
Có vấn đề nào không?
```

Ưu tiên:

```text
KPI
↓
Alerts
↓
Progress
↓
Pending Actions
↓
Recent Activity
```

---

# 32. Notification Rules

Notification được chia thành:

```text
Information
Success
Warning
Action Required
```

Không gửi notification cho mọi thay đổi nhỏ.

Notification nên xuất hiện khi:

- Có task được giao.
- Có yêu cầu cần duyệt.
- Có yêu cầu hỗ trợ.
- Có vật tư thiếu nghiêm trọng.
- Có task quá hạn.
- Có thay đổi quan trọng liên quan đến user.

---

# 33. Web vs Mobile Responsibility

| Function             | Web       | Mobile            |
| -------------------- | --------- | ----------------- |
| Dashboard            | Primary   | Simplified        |
| Data Management      | Primary   | Limited           |
| Data Table           | Primary   | Card              |
| Task Management      | Primary   | Primary           |
| Check-in             | Secondary | Primary           |
| Check-out            | Secondary | Primary           |
| Photo Upload         | Supported | Primary           |
| Material Management  | Primary   | Quick View        |
| Donation             | Supported | Primary           |
| Volunteer Assignment | Primary   | View              |
| Reports              | Primary   | Summary           |
| Readiness            | Primary   | View / Update     |
| Profile              | Header    | Bottom Navigation |

---

# 34. Mobile Information Priority

Mobile không phải bản Web thu nhỏ.

Thứ tự ưu tiên:

```text
1. Việc cần làm ngay
2. Công việc hôm nay
3. Task được giao
4. Cảnh báo
5. Đóng góp
6. Thông tin bổ sung
```

---

# 35. Animation

Animation phải phục vụ usability.

Được phép:

- Bottom Sheet transition.
- Modal transition.
- Progress animation.
- Skeleton.
- Button feedback.

Không nên:

- Background animation liên tục.
- Tuyết rơi liên tục.
- Flashing effect.
- Animation làm chậm thao tác.

Không biến hệ thống quản lý thành landing page Giáng Sinh.

---

# 36. Christmas Visual Elements

Có thể sử dụng các visual element nhẹ:

```text
Pine Green
Gold
Snow / Winter motif
Christmas icon
Star
Pine branch
```

Nhưng chỉ nên dùng ở:

- Login.
- Empty State.
- Dashboard Header.
- Seasonal Banner.
- Illustration.

Không sử dụng Christmas decoration dày đặc trong:

- Data Table.
- Form.
- Modal.
- Report.
- Management Screen.

---

# 37. Design Tokens — CSS Variables

```css
@import url("https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700&display=swap");

:root {
  /* =========================================================
     FONT
     ========================================================= */

  --font-family-base:
    "Be Vietnam Pro", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    sans-serif;

  /* =========================================================
     TYPOGRAPHY — WEB
     ========================================================= */

  --web-fs-display: 32px;
  --web-fs-h1: 24px;
  --web-fs-h2: 18px;
  --web-fs-h3: 15px;
  --web-fs-body: 14px;
  --web-fs-sub: 13px;
  --web-fs-button: 14px;
  --web-fs-badge: 11px;

  /* =========================================================
     TYPOGRAPHY — MOBILE
     ========================================================= */

  --mobile-fs-display: 28px;
  --mobile-fs-h1: 20px;
  --mobile-fs-h2: 16px;
  --mobile-fs-h3: 15px;
  --mobile-fs-body: 14px;
  --mobile-fs-sub: 12px;
  --mobile-fs-button: 15px;
  --mobile-fs-badge: 11px;

  /* =========================================================
     BRAND COLORS
     ========================================================= */

  --color-primary: #0a5c36;
  --color-primary-hover: #0d7344;
  --color-primary-light: #e8f5e9;

  --color-accent-gold: #eeb902;
  --color-accent-gold-light: #fef9c3;

  --color-accent-warm: #f4a261;

  /* =========================================================
     BACKGROUND
     ========================================================= */

  --bg-canvas: #f8f9fa;
  --bg-card: #ffffff;
  --bg-table-header: #f1f5f2;
  --bg-hover: #f8f9fa;

  /* =========================================================
     TEXT
     ========================================================= */

  --text-main: #2b2d42;
  --text-muted: #6c757d;
  --text-light: #adb5bd;
  --text-on-primary: #ffffff;

  /* =========================================================
     BORDER
     ========================================================= */

  --border-light: #e9ecef;
  --border-accent: #e8f0ec;

  /* =========================================================
     STATUS COLORS
     ========================================================= */

  --status-success-bg: #e8f5e9;
  --status-success-text: #0a5c36;

  --status-pending-bg: #fef3c7;
  --status-pending-text: #b45309;

  --status-revision-bg: #ffeedd;
  --status-revision-text: #d97706;

  --status-danger-bg: #fee2e2;
  --status-danger-text: #991b1b;

  --status-neutral-bg: #f1f3f5;
  --status-neutral-text: #495057;

  /* =========================================================
     SPACING
     ========================================================= */

  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 20px;
  --space-6: 24px;
  --space-7: 32px;
  --space-8: 40px;
  --space-9: 48px;
  --space-10: 64px;

  /* =========================================================
     RADIUS
     ========================================================= */

  --radius-sm: 6px;
  --radius-md: 10px;
  --radius-card: 12px;
  --radius-lg: 16px;

  /* =========================================================
     LAYOUT
     ========================================================= */

  --sidebar-width: 260px;
  --sidebar-collapsed-width: 72px;

  --header-height: 64px;

  --page-padding-desktop: 32px;
  --page-padding-tablet: 24px;
  --page-padding-mobile: 16px;

  /* =========================================================
     MOBILE
     ========================================================= */

  --mobile-bottom-nav-height: 64px;
  --mobile-touch-target: 48px;
  --mobile-fab-size: 56px;

  /* =========================================================
     SHADOW
     ========================================================= */

  --shadow-card: 0 4px 16px rgba(10, 92, 54, 0.04);

  --shadow-hover: 0 8px 24px rgba(10, 92, 54, 0.08);

  /* =========================================================
     TRANSITION
     ========================================================= */

  --transition-fast: 150ms ease;
  --transition-normal: 250ms ease;
}

/* =========================================================
   UTILITY
   ========================================================= */

.tabular-nums {
  font-variant-numeric: tabular-nums;
}
```

---

# 38. CSS Base Rules

```css
*,
*::before,
*::after {
  box-sizing: border-box;
}

html,
body {
  margin: 0;
  padding: 0;
  font-family: var(--font-family-base);
  background: var(--bg-canvas);
  color: var(--text-main);
}

button,
input,
textarea,
select {
  font-family: inherit;
}

button {
  cursor: pointer;
}

img {
  max-width: 100%;
  display: block;
}
```

---

# 39. Component Naming Convention

Component nên được đặt tên theo:

```text
[Domain][Component]
```

Ví dụ:

```text
WorkAreaCard
TaskCard
MaterialTable
VolunteerList
ReadinessChecklist
SeasonSelector
UserProfileMenu
SupportRequestCard
```

Không đặt tên chung chung:

```text
Box
Item
Data
Component1
```

---

# 40. UI Consistency Checklist

Trước khi hoàn thành một màn hình, kiểm tra:

### Layout

- [ ] Có Page Header.
- [ ] Có H1 rõ ràng.
- [ ] Có Description nếu cần.
- [ ] Primary Action rõ ràng.
- [ ] Spacing đúng system.
- [ ] Không có layout thừa.

### Navigation

- [ ] Sidebar đúng role.
- [ ] Functional không bị biến thành resource riêng.
- [ ] Header có Season Selector.
- [ ] Profile nằm trong Header.
- [ ] Không có Search global nếu không cần.

### Typography

- [ ] Dùng Be Vietnam Pro.
- [ ] H1/H2/H3 đúng hierarchy.
- [ ] Button dùng Sentence Case.
- [ ] Numeric data dùng tabular numbers.

### Components

- [ ] Button đúng hierarchy.
- [ ] Badge có icon + label.
- [ ] Card đúng radius.
- [ ] Table đúng row height.
- [ ] Form có validation.

### UX

- [ ] Action quan trọng dễ tìm.
- [ ] Touch target ≥ 48px trên Mobile.
- [ ] Không dùng màu làm tín hiệu duy nhất.
- [ ] Có Empty State.
- [ ] Có Loading State.
- [ ] Có Error State.
- [ ] Action nguy hiểm có Confirmation.

### Responsive

- [ ] Desktop hoạt động tốt.
- [ ] Tablet không vỡ layout.
- [ ] Mobile chuyển sang Card khi cần.
- [ ] Bottom Navigation không che nội dung.
- [ ] Bottom Sheet sử dụng đúng trường hợp.

---

# 41. Final Design Rules

Toàn bộ hệ thống phải tuân thủ các nguyên tắc cốt lõi sau:

```text
1. Resource trước, Functional sau.

2. Sidebar chỉ chứa Domain/Resource chính.

3. Functional action nằm bên trong Resource Detail,
   Tab, Section, Modal hoặc Bottom Sheet.

4. Header luôn chứa:
   Page Context + Season Selector + User Profile.

5. Không sử dụng Global Search nếu không cần thiết.

6. Web ưu tiên:
   Dashboard + Data Table + Management.

7. Mobile ưu tiên:
   Task + Quick Action + Check-in + Photo + Donation.

8. Không dùng Icon đơn độc cho Action quan trọng.

9. Không dùng màu làm tín hiệu duy nhất.

10. Mọi trạng thái phải có Label rõ ràng.

11. Action nguy hiểm phải có Confirmation.

12. Mobile Touch Target tối thiểu 48 × 48px.

13. Christmas visual chỉ đóng vai trò Accent,
    không lấn át Management UI.

14. Ưu tiên Readability, Consistency và Efficiency
    hơn Decorative Design.
```

---

# 42. Design System Summary

```text
                    GOLDEN WINTER
                          │
          ┌───────────────┴───────────────┐
          │                               │
       WEB SYSTEM                    MOBILE APP
          │                               │
    Management                    Quick Operations
          │                               │
    ┌─────┼─────┐                 ┌───────┼───────┐
    │     │     │                 │       │       │@
 Sidebar Header Content          Tasks   Check-in Donation
    │     │     │                 │       │       │
 Resource Season Data            Photo   Report  Pledge
         Selector Table
          │
     Role-based UI
          │
     Resource-first
          │
     Functional inside
        Resource
```

**Design Goal:**

> Một hệ thống quản lý chuẩn bị Giáng Sinh có giao diện trang nghiêm, ấm áp và hiện đại; trong đó người dùng có thể nhanh chóng nhìn thấy **công việc cần làm, tiến độ, nguồn lực, vật tư, tình nguyện viên và các vấn đề cần xử lý**, đồng thời vẫn giữ được bản sắc Giáng Sinh thông qua hệ thống màu Golden Winter và các visual accent được sử dụng có kiểm soát.
