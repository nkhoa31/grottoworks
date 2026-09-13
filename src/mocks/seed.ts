// Seed dữ liệu mẫu giáo xứ Tân Định — hoàn toàn deterministic, không random.
import { communities, parish, users } from './seed/users';
import { areas, season } from './seed/areas';
import { materials } from './seed/materials';
import { tasks } from './seed/tasks';
import { donations } from './seed/donations';
import { purchaseRecords, purchaseRequests } from './seed/purchases';
import { timesheets } from './seed/timesheets';
import { activityLogs, borrowedItems, checklistItems, supportRequests, volunteerRegs } from './seed/misc';
import { SKILLS, EXPENSE_CATEGORIES } from '../types';

export const seed = {
  parish,
  communities,
  users,
  season,
  areas,
  tasks,
  volunteerRegs,
  materials,
  purchaseRequests,
  purchaseRecords,
  donations,
  borrowedItems,
  timesheets,
  supportRequests,
  checklists: checklistItems,
  activityLogs,
  skills: [...SKILLS],
  categories: [...EXPENSE_CATEGORIES],
};

export type Seed = typeof seed;
