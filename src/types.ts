export type ShiftType = 'نهاري (08:00 AM - 08:00 PM)' | 'ليلي (08:00 PM - 08:00 AM)';

export type DayOfWeek = 'Saturday' | 'Sunday' | 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'السبت' | 'الأحد' | 'الإثنين' | 'الثلاثاء' | 'الأربعاء' | 'الخميس' | 'الجمعة';

export type UserRole = 'ADMIN' | 'TEAM_LEADER' | 'INSPECTOR';

export interface UserAccount {
  id: number;
  name: string;
  username: string;
  password: string; // Stored securely in state & localStorage
  role: UserRole;
  roleTitle: string;
  phone?: string;
  assignedUnits?: string[];
  avatar?: string;
}

export interface ChecklistItem {
  id: string;
  text: string;
  category?: string;
  required?: boolean;
}

export interface HospitalUnit {
  id: number;
  name: string; // In English as requested: "Lab", "Main OR", "CCU", etc.
  code: string;
  buildingFloor: string;
  riskLevel: 'High Risk' | 'Medium Risk' | 'Low Risk';
  defaultShift: 'Day' | 'Night' | 'Both';
  assignedInspector: string;
  backupInspector?: string;
  scheduledDays: string[];
  checklist: ChecklistItem[];
}

export interface ChecklistResult {
  itemId: string;
  text: string;
  passed: boolean;
  notes?: string;
}

export interface InspectionItem {
  id: number;
  date: string;
  dayOfWeek?: string;
  shift: string;
  location: string; // Unit name in English e.g. "Main OR", "CCU"
  inspector: string;
  type: string;
  status: 'مكتمل وممتثل' | 'تم الرصد وتوجد ملاحظات' | 'قيد المتابعة والتنفيذ';
  notes: string;
  riskRating?: 'منخفض' | 'متوسط' | 'مرتفع';
  createdBy?: string;
  createdById?: number;
  createdTimestamp?: string;
  checklistResults?: ChecklistResult[];
}

export type IncidentCategory = 
  | 'إسعافات أولية (First Aid)'
  | 'حادث وشيك (Near Miss)'
  | 'إصابة عمل مع هدر وقت (Lost Time Injury)'
  | 'وخز إبرة وأدوات حادة (Sharps Injury)';

export interface IncidentItem {
  id: number;
  datetime: string;
  shift: string;
  name: string;
  dept: string;
  location: string;
  type: IncidentCategory;
  lostDays: number;
  desc: string;
  rootCause?: string;
  preventiveAction?: string;
  createdBy?: string;
  createdById?: number;
}

export type NcrSeverity = 'حرج (Critical)' | 'متوسط (Major)' | 'بسيط (Minor)';
export type NcrStatus = 'مفتوح' | 'مغلق';

export interface NcrItem {
  id: number;
  code: string;
  location: string;
  targetDept?: string;
  desc: string;
  severity: NcrSeverity;
  deadline: string;
  status: NcrStatus;
  issuerName?: string;
  immediateAction?: string;
  rootCause?: string;
  capaPlan?: string;
  closedBy?: string;
  closureDate?: string;
  verificationNotes?: string;
  createdBy?: string;
  createdById?: number;
}

export interface KpiItem {
  id?: number;
  inspector: string;
  inspectionsDone: number;
  ncrsRaised: number;
  responseTime: string;
  compliance: string;
  score: 'ممتاز' | 'جيد جداً' | 'جيد' | 'مقبول';
}

export interface WeeklyScheduleSlot {
  id: number;
  dayOfWeek: string;
  shift: 'نهاري (08:00 AM - 08:00 PM)' | 'ليلي (08:00 PM - 08:00 AM)';
  departmentName: string; // In English e.g. "Chiller room"
  inspectorName: string;
  roundType: string;
  notes?: string;
  createdBy?: string;
}

export interface SignersConfig {
  teamLeader: { name: string; title: string };
  safetyDirector: { name: string; title: string };
  opsDirector: { name: string; title: string };
  ceoDirector: { name: string; title: string };
}

export interface ActivityLogItem {
  id: string;
  userName: string;
  action: string;
  target: string;
  timestamp: string;
  type: 'INSPECTION' | 'NCR' | 'INCIDENT' | 'CONFIG' | 'AUTH';
}

export interface AppState {
  users: UserAccount[];
  units: HospitalUnit[];
  weeklySchedule: WeeklyScheduleSlot[];
  inspections: InspectionItem[];
  ncrs: NcrItem[];
  incidents: IncidentItem[];
  kpis: KpiItem[];
  signers: SignersConfig;
  activityLog: ActivityLogItem[];
  lastUpdated?: string;
}

export type TabKey = 
  | 'inspections' 
  | 'units' 
  | 'weekly_schedule' 
  | 'ncrs' 
  | 'incidents' 
  | 'users' 
  | 'kpis' 
  | 'reports';

export type ReportType = 'master' | 'units' | 'weekly_matrix' | 'ncrs' | 'incidents' | 'inspections' | 'kpis';
