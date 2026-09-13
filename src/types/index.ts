// GrottoWorks domain types — phiên bản chữ là bản thật, mọi task sau phụ thuộc file này.
export type Role = 'ADMIN' | 'COMMITTEE' | 'LEADER' | 'OFFICER';

export interface Parish { id: string; name: string }
export interface Community { id: string; name: string; parishId: string }

export interface User {
  id: string; name: string; email: string; role: Role; communityId?: string;
  locked?: boolean; skills: string[]; points: number; avatarHue: number;
}

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
  status: 'TODO' | 'DOING' | 'REVIEW' | 'DONE' | 'REVISE'; dueDate: string;
  submittedPhotos: number; submittedNotes?: string;
}

export interface VolunteerReg { id: string; taskId: string; volunteerId: string; status: 'PENDING' | 'APPROVED' | 'REJECTED' }

export interface Material {
  id: string; areaId: string; name: string; unit: string;
  required: number; existing: number; purchased: number;
  donatedPledged: number; donatedReceived: number; received: number;
  buyerId?: string; status: 'SHORTAGE' | 'INCOMING' | 'ENOUGH';
}

/** Thiếu hụt = nhu cầu - đã về kho (existing + purchased + donatedReceived). */
export function shortage(m: Pick<Material, 'required' | 'received'>): number {
  return m.required - m.received;
}

export interface PurchaseRequest {
  id: string; materialIds: string[]; total: number;
  status: 'DRAFT' | 'PENDING' | 'APPROVED' | 'REJECTED'; createdBy: string; note?: string;
}

export interface PurchaseRecord {
  id: string; requestId: string; materialId: string; qty: number; cost: number;
  supplier: string; date: string; receiptPhoto?: string; confirmed: boolean; buyerId: string;
}

export interface Donation {
  id: string; materialId?: string; monetary?: number; donorName: string;
  status: 'PLEDGED' | 'RECEIVED_FULL' | 'RECEIVED_PARTIAL' | 'UNUSABLE' | 'CANCELED';
  promisedQty?: number; receivedQty?: number;
}

export interface BorrowedItem {
  id: string; name: string; owner: string; expectedReturn: string;
  returnedCondition?: 'GOOD' | 'DAMAGED' | 'LOST'; areaId: string;
}

export interface Timesheet {
  id: string; volunteerId: string; date: string; checkIn: string; checkOut?: string;
  hours: number; correctionRequest?: string; status: 'OPEN' | 'CLOSED' | 'PENDING_FIX';
}

export interface SupportRequest {
  id: string; areaId: string; kind: 'PEOPLE' | 'SKILL' | 'MATERIAL';
  detail: string; status: 'OPEN' | 'COORDINATED' | 'RESOLVED'; assigneeId?: string;
}

export interface ChecklistItem { id: string; areaId: string; label: string; done: boolean; note?: string }

export interface ActivityLog { id: string; at: string; actor: string; action: string; target: string }

// Danh mục kỹ năng dùng chung (Admin — Task 12 quản trị danh mục).
export const SKILLS = ['Điện', 'Mộc', 'Hàn', 'Trang trí', 'Vận chuyển', 'Logistics', 'Sơn'] as const;
