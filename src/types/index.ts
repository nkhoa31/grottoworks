// GrottoWorks domain types — phiên bản chữ là bản thật, mọi task sau phụ thuộc file này.
export type Role = 'ADMIN' | 'COMMITTEE' | 'LEADER' | 'OFFICER';

export interface Parish { id: string; name: string }
export interface Community { id: string; name: string; parishId: string }

export interface User {
  id: string; name: string; email: string; role: Role; communityId?: string;
  locked?: boolean; skills: string[]; points: number; avatarHue: number;
  /** Lịch rảnh trong tuần (T2…CN) — leader đối chiếu khi phân công trực tiếp. */
  availability?: Weekday[];
}

// Ngày trong tuần cho lịch rảnh của tình nguyện viên.
export const WEEKDAYS = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'] as const;
export type Weekday = (typeof WEEKDAYS)[number];

export interface Season {
  id: string; year: number; startDate: string; endDate: string;
  status: 'ACTIVE' | 'CLOSED' | 'PLANNED'; budget: number;
}

export type AreaType = 'GROTTO' | 'TREE' | 'LIGHTING' | 'YARD' | 'STAGE';

export interface WorkArea {
  id: string; name: string; type: AreaType; level: 'PARISH' | 'COMMUNITY'; communityId?: string;
  leaderId: string; officerId: string; progress: number; volunteerCount: number;
  taskCount: number; status: 'ON_TRACK' | 'AT_RISK' | 'LATE';
}

export interface Task {
  id: string; areaId: string; title: string; description: string; skills: string[];
  estimateHours: number; volunteersNeeded: number; assignees: string[]; materialIds: string[];
  status: 'DRAFT' | 'TODO' | 'DOING' | 'REVIEW' | 'DONE' | 'REVISE'; dueDate: string;
  submittedPhotos: number; submittedNotes?: string;
  /** Tiêu chí hoàn thành — leader khai báo để hướng dẫn nghiệm thu. */
  completionCriteria?: string;
    /** Nhu cầu vật tư định lượng cho task (key = materialId → số lượng). */
  materialNeeds?: Record<string, number>;
  /**
   * Phân công trực tiếp: theo dõi phản hồi từng TNV. TNV có status ACCEPTED
   * cũng nằm trong `assignees` (nguồn dữ liệu cũ, đại diện cho đã được nhận).
   */
  assignments?: TaskAssignment[];
}

/** Phân công trực tiếp leader → TNV, kèm trạng thái phản hồi của TNV. */
export interface TaskAssignment {
  volunteerId: string;
  status: 'PENDING' | 'ACCEPTED' | 'DECLINED';
  /** Ghi chú lý do từ chối (hiển thị cho leader). */
  note?: string;
}

export interface VolunteerReg { id: string; taskId: string; volunteerId: string; status: 'PENDING' | 'APPROVED' | 'REJECTED' }

export interface Material {
  id: string; areaId: string; name: string; unit: string;
  required: number; existing: number; purchased: number;
  donatedPledged: number; donatedReceived: number; received: number;
  buyerId?: string; status: 'SHORTAGE' | 'INCOMING' | 'ENOUGH';
  /** Đơn giá dự kiến (VNĐ) — tính tổng đề nghị mua = qty × estUnitPrice. */
  estUnitPrice: number;
}

/** Thiếu hụt = nhu cầu - đã về kho (existing + purchased + donatedReceived). */
export function shortage(m: Pick<Material, 'required' | 'received'>): number {
  return m.required - m.received;
}

export interface PurchaseRequest {
  id: string; materialIds: string[]; total: number;
  status: 'DRAFT' | 'PENDING' | 'APPROVED' | 'REJECTED'; createdBy: string; note?: string;
  /** Lý do committee từ chối — tách riêng, không đè note gốc. */
  rejectReason?: string;
  /** Số lượng đề nghị mua từng vật tư (key = materialId) — default lúc xác nhận. */
  qtys?: Record<string, number>;
}

export interface PurchaseRecord {
  id: string; requestId: string; materialId: string; qty: number; cost: number;
  supplier: string; date: string; receiptPhoto?: string; confirmed: boolean; buyerId: string;
}

export interface Donation {
  id: string; materialId?: string; monetary?: number; donorName: string;
  status: 'PLEDGED' | 'RECEIVED_FULL' | 'RECEIVED_PARTIAL' | 'UNUSABLE' | 'CANCELED';
  promisedQty?: number; receivedQty?: number; note?: string;
}

export interface BorrowedItem {
  id: string; name: string; owner: string; expectedReturn: string;
  returnedCondition?: 'GOOD' | 'DAMAGED' | 'LOST'; areaId: string;
}

/** Phân bổ vật tư đã nhận cho nhiệm vụ/khu (đích: task hoặc khu khác). */
export interface Allocation {
  id: string; materialId: string; targetTaskId?: string; targetAreaId?: string;
  qty: number; date: string; byUserId: string;
}

export interface Timesheet {
  id: string; volunteerId: string; date: string; checkIn: string; checkOut?: string;
  hours: number; correctionRequest?: string; status: 'OPEN' | 'CLOSED' | 'PENDING_FIX';
}

// ── Yêu cầu hỗ trợ nhân lực giữa các cộng đoàn ─────────────────────────────
// Leader khu thiếu người/kỹ năng → tạo `SupportRequest` cấp giáo xứ → TNV cộng
// đoàn khác gửi `SupportReg` → leader duyệt → hệ thống tạo phân công → TNV vào
// task. `fulfill` phản ánh mức đáp ứng theo nhân lực đã được xác nhận.
export type SupportFulfill = 'OPEN' | 'PARTIAL' | 'FULFILLED';

export interface SupportRequest {
  id: string; areaId: string; kind: 'PEOPLE' | 'SKILL' | 'MATERIAL';
  detail: string; status: 'OPEN' | 'COORDINATED' | 'RESOLVED'; assigneeId?: string;
  /** Cộng đoàn của khu cần hỗ trợ — TNV cộng đoàn khác mới thấy để đăng ký. */
  communityId?: string;
  /** Số người cần hỗ trợ (0 = không cần thêm người). */
  volunteersNeeded?: number;
  /** Kỹ năng cần cho yêu cầu (kind = SKILL). */
  skills?: string[];
  /** Thời gian cần hỗ trợ — mô tả tự do (vd "T6 19h–21h", "Sáng 18/11"). */
  supportTime?: string;
  /** Khu vực/task trong khu để TNV tham gia sau khi được duyệt. */
  taskAreaId?: string;
  /** Mức đáp ứng theo nhân lực đã được xác nhận. */
  fulfill?: SupportFulfill;
}

/** Đơn TNV (cộng đoàn khác) đăng ký tham gia yêu cầu hỗ trợ. */
export interface SupportReg {
  id: string; requestId: string; volunteerId: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  note?: string;
  /** Lý do leader từ chối — hiển thị cho TNV. */
  rejectReason?: string;
  /** ISO thời điểm gửi đăng ký. */
  at?: string;
}

export interface ChecklistItem { id: string; areaId: string; label: string; done: boolean; note?: string }

export interface ActivityLog { id: string; at: string; actor: string; action: string; target: string }

// Danh mục kỹ năng dùng chung (Admin — Task 12 quản trị danh mục).
export const SKILLS = ['Điện', 'Mộc', 'Hàn', 'Trang trí', 'Vận chuyển', 'Logistics', 'Sơn'] as const;
