import { AppState, ShiftType, UserAccount } from '../types';
import { initialAppState } from '../data/initialData';

const LOCAL_STORAGE_KEY = 'alnas_safety_management_state_v4';
const CURRENT_USER_KEY = 'alnas_safety_active_user_v4';
export const FIREBASE_ENDPOINT = 'https://safety-alnas-hospital-default-rtdb.firebaseio.com/alnas_safety_master_data.json';

export function getCurrentShift(): ShiftType {
  const hour = new Date().getHours();
  return hour >= 8 && hour < 20
    ? 'نهاري (08:00 AM - 08:00 PM)'
    : 'ليلي (08:00 PM - 08:00 AM)';
}

export function loadSavedUser(): UserAccount | null {
  try {
    const raw = localStorage.getItem(CURRENT_USER_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function saveCurrentActiveUser(user: UserAccount | null): void {
  try {
    if (!user) {
      localStorage.removeItem(CURRENT_USER_KEY);
    } else {
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    }
  } catch (e) {
    console.error('Error saving active user:', e);
  }
}

export function loadStateFromLocalStorage(): AppState {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) return initialAppState;
    const parsed = JSON.parse(raw);
    return {
      users: Array.isArray(parsed.users) && parsed.users.length > 0 ? parsed.users : initialAppState.users,
      units: Array.isArray(parsed.units) && parsed.units.length > 0 ? parsed.units : initialAppState.units,
      weeklySchedule: Array.isArray(parsed.weeklySchedule) ? parsed.weeklySchedule : initialAppState.weeklySchedule,
      inspections: Array.isArray(parsed.inspections) ? parsed.inspections : initialAppState.inspections,
      ncrs: Array.isArray(parsed.ncrs) ? parsed.ncrs : initialAppState.ncrs,
      incidents: Array.isArray(parsed.incidents) ? parsed.incidents : initialAppState.incidents,
      kpis: Array.isArray(parsed.kpis) ? parsed.kpis : initialAppState.kpis,
      signers: parsed.signers || initialAppState.signers,
      activityLog: Array.isArray(parsed.activityLog) ? parsed.activityLog : initialAppState.activityLog,
      lastUpdated: parsed.lastUpdated || new Date().toISOString()
    };
  } catch (e) {
    console.error('Error loading state from localStorage:', e);
    return initialAppState;
  }
}

export function saveStateToLocalStorage(state: AppState): void {
  try {
    const dataWithTimestamp = {
      ...state,
      lastUpdated: new Date().toISOString()
    };
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(dataWithTimestamp));
  } catch (e) {
    console.error('Error saving state to localStorage:', e);
  }
}

export async function fetchStateFromCloud(): Promise<{ data: AppState | null; success: boolean; error?: string }> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000);
    const res = await fetch(FIREBASE_ENDPOINT, {
      signal: controller.signal
    });
    clearTimeout(timeout);

    if (!res.ok) {
      return { data: null, success: false, error: `HTTP ${res.status}` };
    }

    const json = await res.json();
    if (json && typeof json === 'object') {
      const merged: AppState = {
        users: Array.isArray(json.users) && json.users.length > 0 ? json.users : initialAppState.users,
        units: Array.isArray(json.units) && json.units.length > 0 ? json.units : initialAppState.units,
        weeklySchedule: Array.isArray(json.weeklySchedule) ? json.weeklySchedule : initialAppState.weeklySchedule,
        inspections: Array.isArray(json.inspections) ? json.inspections : initialAppState.inspections,
        ncrs: Array.isArray(json.ncrs) ? json.ncrs : initialAppState.ncrs,
        incidents: Array.isArray(json.incidents) ? json.incidents : initialAppState.incidents,
        kpis: Array.isArray(json.kpis) ? json.kpis : initialAppState.kpis,
        signers: json.signers || initialAppState.signers,
        activityLog: Array.isArray(json.activityLog) ? json.activityLog : initialAppState.activityLog,
        lastUpdated: json.lastUpdated || new Date().toISOString()
      };
      return { data: merged, success: true };
    }
    return { data: null, success: true };
  } catch (err: any) {
    return { data: null, success: false, error: err?.message || 'Network error' };
  }
}

export async function pushStateToCloud(state: AppState): Promise<boolean> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000);
    const res = await fetch(FIREBASE_ENDPOINT, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...state,
        lastUpdated: new Date().toISOString()
      }),
      signal: controller.signal
    });
    clearTimeout(timeout);
    return res.ok;
  } catch (err) {
    console.warn('Could not push to Firebase RTDB endpoint:', err);
    return false;
  }
}

export function exportBackupJSON(state: AppState): void {
  const jsonStr = JSON.stringify(state, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const dateStr = new Date().toISOString().split('T')[0];
  const a = document.createElement('a');
  a.href = url;
  a.download = `Alnas_Hospital_Safety_MasterBackup_${dateStr}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function exportBackupExcelCSV(state: AppState): void {
  let csv = '\uFEFF';
  const now = new Date().toISOString().split('T')[0];

  csv += '=== مستشفى الناس - إدارة السلامة والصحة المهنية وحماية البيئة ===\n';
  csv += `تاريخ الاستخراج: ${now}\n`;
  csv += 'المرجعية الرقابية: معايير GAHAR 2025 / ISO 45001\n\n';

  // 1. Weekly Schedule
  csv += '--- 1. جدول وخطة المرور الأسبوعي (Weekly Schedule) ---\n';
  csv += 'Day,Shift,Unit (Department),Inspector,Round Type,Notes,Created By\n';
  (state.weeklySchedule || []).forEach(slot => {
    csv += `"${slot.dayOfWeek}","${slot.shift}","${slot.departmentName}","${slot.inspectorName}","${slot.roundType}","${(slot.notes || '').replace(/"/g, '""')}","${slot.createdBy || '-'}"\n`;
  });
  csv += '\n';

  // 2. Units & Checklists
  csv += '--- 2. دليل أماكن الفحص وقوائم التحقق (Units & Checklists) ---\n';
  csv += 'Unit Name,Code,Floor/Location,Risk Level,Default Shift,Assigned Inspector,Scheduled Days,Checklist Items Count\n';
  (state.units || []).forEach(u => {
    csv += `"${u.name}","${u.code}","${u.buildingFloor}","${u.riskLevel}","${u.defaultShift}","${u.assignedInspector}","${(u.scheduledDays || []).join(' - ')}","${(u.checklist || []).length}"\n`;
  });
  csv += '\n';

  // 3. Inspections
  csv += '--- 3. سجل جولات المرور المنجزة (Completed Inspections) ---\n';
  csv += 'Date,Shift,Unit Location,Inspector,Status,Notes,Created By,Timestamp\n';
  (state.inspections || []).forEach(item => {
    const cleanNotes = (item.notes || '').replace(/"/g, '""');
    csv += `"${item.date}","${item.shift || '-'}","${item.location}","${item.inspector}","${item.status}","${cleanNotes}","${item.createdBy || '-'}","${item.createdTimestamp || '-'}"\n`;
  });
  csv += '\n';

  // 4. NCRs
  csv += '--- 4. تقارير عدم المطابقة (NCRs & CAPA) ---\n';
  csv += 'NCR Code,Unit Location,Target Dept,Description,Severity,Deadline,Status,Issuer,Root Cause,CAPA Plan,Created By\n';
  (state.ncrs || []).forEach(n => {
    const cleanDesc = (n.desc || '').replace(/"/g, '""');
    const cleanRCA = (n.rootCause || '').replace(/"/g, '""');
    const cleanCAPA = (n.capaPlan || '').replace(/"/g, '""');
    csv += `"${n.code}","${n.location}","${n.targetDept || '-'}","${cleanDesc}","${n.severity}","${n.deadline}","${n.status}","${n.issuerName || '-'}","${cleanRCA}","${cleanCAPA}","${n.createdBy || '-'}"\n`;
  });
  csv += '\n';

  // 5. Incidents
  csv += '--- 5. سجل حوادث وإصابات العمل (Incidents) ---\n';
  csv += 'DateTime,Shift,Injured Name,Dept,Unit Location,Injury Type,Lost Days,Description,Created By\n';
  (state.incidents || []).forEach(inc => {
    const cleanDesc = (inc.desc || '').replace(/"/g, '""');
    csv += `"${inc.datetime}","${inc.shift || '-'}","${inc.name}","${inc.dept || '-'}","${inc.location}","${inc.type}","${inc.lostDays}","${cleanDesc}","${inc.createdBy || '-'}"\n`;
  });

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Alnas_Safety_Comprehensive_Excel_${now}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function parseImportedJSON(fileContent: string): AppState {
  const parsed = JSON.parse(fileContent);
  if (!parsed || typeof parsed !== 'object') {
    throw new Error('الملف غير صالح');
  }
  return {
    users: Array.isArray(parsed.users) ? parsed.users : initialAppState.users,
    units: Array.isArray(parsed.units) ? parsed.units : initialAppState.units,
    weeklySchedule: Array.isArray(parsed.weeklySchedule) ? parsed.weeklySchedule : initialAppState.weeklySchedule,
    inspections: Array.isArray(parsed.inspections) ? parsed.inspections : [],
    ncrs: Array.isArray(parsed.ncrs) ? parsed.ncrs : [],
    incidents: Array.isArray(parsed.incidents) ? parsed.incidents : [],
    kpis: Array.isArray(parsed.kpis) ? parsed.kpis : [],
    signers: parsed.signers || initialAppState.signers,
    activityLog: Array.isArray(parsed.activityLog) ? parsed.activityLog : [],
    lastUpdated: new Date().toISOString()
  };
}
