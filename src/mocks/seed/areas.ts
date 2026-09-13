import type { Season, WorkArea } from '../../types';

export const season: Season = {
  id: 's1', year: 2026, startDate: '2026-09-15', endDate: '2026-12-24',
  status: 'ACTIVE', budget: 120_000_000,
};

export const areas: WorkArea[] = [
  { id: 'a1', name: 'Hang đá Bê-lem', type: 'GROTTO', level: 'PARISH', leaderId: 'u3', officerId: 'u4', progress: 35, volunteerCount: 12, taskCount: 8, status: 'AT_RISK' },
  { id: 'a2', name: 'Cây thông lớn', type: 'TREE', level: 'PARISH', leaderId: 'u5', officerId: 'u6', progress: 45, volunteerCount: 10, taskCount: 8, status: 'ON_TRACK' },
  { id: 'a3', name: 'Ánh sáng & đèn', type: 'LIGHTING', level: 'PARISH', leaderId: 'u7', officerId: 'u8', progress: 60, volunteerCount: 8, taskCount: 8, status: 'ON_TRACK' },
  { id: 'a4', name: 'Sân khấu', type: 'STAGE', level: 'COMMUNITY', communityId: 'c1', leaderId: 'u9', officerId: 'u10', progress: 25, volunteerCount: 6, taskCount: 8, status: 'LATE' },
  { id: 'a5', name: 'Sân nhà thờ', type: 'YARD', level: 'COMMUNITY', communityId: 'c2', leaderId: 'u11', officerId: 'u12', progress: 85, volunteerCount: 9, taskCount: 8, status: 'ON_TRACK' },
];
