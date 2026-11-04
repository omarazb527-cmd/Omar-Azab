import React, { useState, useEffect, useCallback } from 'react';
import { 
  AppState, 
  TabKey, 
  InspectionItem, 
  IncidentItem, 
  NcrItem, 
  KpiItem,
  HospitalUnit,
  WeeklyScheduleSlot,
  UserAccount,
  SignersConfig,
  ActivityLogItem
} from './types';
import { initialAppState } from './data/initialData';
import { 
  loadStateFromLocalStorage, 
  saveStateToLocalStorage, 
  fetchStateFromCloud, 
  pushStateToCloud,
  exportBackupJSON, 
  exportBackupExcelCSV, 
  parseImportedJSON,
  loadSavedUser,
  saveCurrentActiveUser
} from './utils/sync';
import { canModifyMasterConfig } from './utils/permissions';
import { Header } from './components/Header';
import { StatsBanner } from './components/StatsBanner';
import { TabsNav } from './components/TabsNav';
import { InspectionsTab } from './components/InspectionsTab';
import { UnitsTab } from './components/UnitsTab';
import { WeeklyScheduleTab } from './components/WeeklyScheduleTab';
import { NcrsTab } from './components/NcrsTab';
import { IncidentsTab } from './components/IncidentsTab';
import { UsersTab } from './components/UsersTab';
import { KpisTab } from './components/KpisTab';
import { ReportsTab } from './components/ReportsTab';
import { InspectionModal } from './components/InspectionModal';
import { UnitEditModal } from './components/UnitEditModal';
import { WeeklyScheduleModal } from './components/WeeklyScheduleModal';
import { IncidentModal } from './components/IncidentModal';
import { NcrModal } from './components/NcrModal';
import { UserEditModal } from './components/UserEditModal';
import { KpiModal } from './components/KpiModal';
import { LoginModal } from './components/LoginModal';
import { ChangePasswordModal } from './components/ChangePasswordModal';
import { CheckCircle2, AlertCircle, Info, Lock } from 'lucide-react';

export default function App() {
  const [state, setState] = useState<AppState>(() => loadStateFromLocalStorage());
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() => {
    const saved = loadSavedUser();
    if (saved) return saved;
    // Default initial user: Eng. Omar Farid El-Azab (Admin)
    return initialAppState.users[0] || null;
  });

  const [activeTab, setActiveTab] = useState<TabKey>('inspections');
  const [isCloudConnected, setIsCloudConnected] = useState<boolean>(false);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);

  // Modals state
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [changePasswordModalOpen, setChangePasswordModalOpen] = useState(false);
  const [userForPasswordChange, setUserForPasswordChange] = useState<UserAccount | null>(null);

  const [inspectionModalOpen, setInspectionModalOpen] = useState(false);
  const [editingInspection, setEditingInspection] = useState<InspectionItem | null>(null);

  const [unitModalOpen, setUnitModalOpen] = useState(false);
  const [editingUnit, setEditingUnit] = useState<HospitalUnit | null>(null);

  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [editingScheduleSlot, setEditingScheduleSlot] = useState<WeeklyScheduleSlot | null>(null);

  const [incidentModalOpen, setIncidentModalOpen] = useState(false);
  const [editingIncident, setEditingIncident] = useState<IncidentItem | null>(null);

  const [ncrModalOpen, setNcrModalOpen] = useState(false);
  const [editingNcr, setEditingNcr] = useState<NcrItem | null>(null);

  const [userModalOpen, setUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserAccount | null>(null);

  const [kpiModalOpen, setKpiModalOpen] = useState(false);
  const [editingKpi, setEditingKpi] = useState<KpiItem | null>(null);

  const showToast = useCallback((message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  }, []);

  // Update State helper with persistence to both LocalStorage and Cloud
  const updateStateAndPersist = useCallback((updater: (prev: AppState) => AppState, successMsg?: string) => {
    setState(prev => {
      const next = updater(prev);
      saveStateToLocalStorage(next);
      pushStateToCloud(next).then(success => {
        if (success) setIsCloudConnected(true);
      });
      return next;
    });
    if (successMsg) showToast(successMsg, 'success');
  }, [showToast]);

  // Log activity helper
  const logActivity = useCallback((action: string, target: string, type: ActivityLogItem['type']) => {
    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    const dateStr = `${now.getMonth() + 1}/${now.getDate()}`;
    const newLogItem: ActivityLogItem = {
      id: `act_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      userName: currentUser?.name || 'م/ عمر فريد العزب',
      action,
      target,
      timestamp: `${dateStr} ${timeStr}`,
      type
    };

    updateStateAndPersist(prev => ({
      ...prev,
      activityLog: [newLogItem, ...(prev.activityLog || [])].slice(0, 50)
    }));
  }, [currentUser, updateStateAndPersist]);

  // Initial cloud fetch
  useEffect(() => {
    let mounted = true;
    async function initCloud() {
      setIsSyncing(true);
      const res = await fetchStateFromCloud();
      if (!mounted) return;
      setIsSyncing(false);

      if (res.success && res.data) {
        setIsCloudConnected(true);
        setState(res.data);
        saveStateToLocalStorage(res.data);
      } else {
        setIsCloudConnected(false);
      }
    }
    initCloud();
    return () => {
      mounted = false;
    };
  }, []);

  // Sync currentUser with state.users if updated
  useEffect(() => {
    if (currentUser) {
      const freshUser = state.users.find(u => u.id === currentUser.id);
      if (freshUser && (freshUser.password !== currentUser.password || freshUser.role !== currentUser.role)) {
        setCurrentUser(freshUser);
        saveCurrentActiveUser(freshUser);
      }
    }
  }, [state.users, currentUser]);

  // Manual Cloud Sync
  const handleManualSync = async () => {
    setIsSyncing(true);
    const res = await fetchStateFromCloud();
    setIsSyncing(false);

    if (res.success && res.data) {
      setIsCloudConnected(true);
      setState(res.data);
      saveStateToLocalStorage(res.data);
      showToast('✅ تم استرجاع ومزامنة أحدث البيانات من سحابة مستشفى الناس المركزية!', 'success');
    } else {
      setIsCloudConnected(false);
      showToast('تم الحفظ بالذاكرة المحلية للمتصفح (Offline Cache)', 'info');
    }
  };

  // Export & Import Handlers
  const handleExportJson = () => {
    exportBackupJSON(state);
    showToast('تم تنزيل النسخة الاحتياطية JSON بنجاح', 'success');
  };

  const handleExportExcel = () => {
    exportBackupExcelCSV(state);
    showToast('تم تصدير ملف شيت Excel (CSV معتمد عربي) بنجاح', 'success');
  };

  const handleImportJson = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const importedState = parseImportedJSON(text);
        updateStateAndPersist(() => importedState, 'تم استيراد واسترجاع النسخة الاحتياطية بنجاح!');
        logActivity('استيراد قاعدة بيانات من ملف احتياطي', 'System Backup', 'CONFIG');
      } catch (err) {
        showToast('فشل قراءة الملف. تأكد من صحة ملف JSON.', 'error');
      }
    };
    reader.readAsText(file);
  };

  // User Authentication & Password Actions
  const handleLoginSuccess = (user: UserAccount) => {
    setCurrentUser(user);
    saveCurrentActiveUser(user);
    showToast(`مرحباً بك، ${user.name} (${user.roleTitle})`, 'success');
    logActivity('تسجيل دخول إلى النظام', user.roleTitle, 'AUTH');
  };

  const handleLogout = () => {
    saveCurrentActiveUser(null);
    setCurrentUser(null);
    setLoginModalOpen(true);
    showToast('تم تسجيل الخروج. يرجى اختيار حساب للدخول.', 'info');
  };

  const handleUpdatePassword = (userId: number, newPass: string) => {
    const targetUser = state.users.find(u => u.id === userId);
    updateStateAndPersist(prev => ({
      ...prev,
      users: prev.users.map(u => u.id === userId ? { ...u, password: newPass } : u)
    }), 'تم تغيير كلمة المرور بنجاح وحفظها بحسابك!');

    if (currentUser?.id === userId) {
      const updated = { ...currentUser, password: newPass };
      setCurrentUser(updated);
      saveCurrentActiveUser(updated);
    }
    logActivity('قام بتحديث كلمة المرور الشخصية', targetUser?.name || 'User Account', 'AUTH');
  };

  // Inspections Actions
  const handleSaveInspection = (itemData: Omit<InspectionItem, 'id'> & { id?: number }) => {
    const inspectorName = currentUser?.name || itemData.inspector;
    if (itemData.id) {
      updateStateAndPersist(prev => ({
        ...prev,
        inspections: prev.inspections.map(i => i.id === itemData.id ? { ...i, ...itemData } as InspectionItem : i)
      }), 'تم تعديل جولة التفتيش بنجاح');
      logActivity('قام بتعديل جولة مرور ميداني', itemData.location, 'INSPECTION');
    } else {
      const newItem: InspectionItem = {
        ...itemData,
        id: Date.now(),
        createdBy: inspectorName,
        createdById: currentUser?.id
      };
      updateStateAndPersist(prev => ({
        ...prev,
        inspections: [newItem, ...prev.inspections]
      }), 'تم تسجيل جولة التفتيش بالـ Data Center وتوثيقها باسمك');
      logActivity('سجل جولة مرور بيئة الرعاية EOC', itemData.location, 'INSPECTION');
    }
  };

  const handleDeleteInspection = (id: number) => {
    const item = state.inspections.find(i => i.id === id);
    if (!canModifyMasterConfig(currentUser) && item?.createdBy !== currentUser?.name) {
      showToast('حذف جولات التفتيش مقتصر على م/ عمر فريد وم/ أحمد نبيه', 'error');
      return;
    }

    if (window.confirm('هل أنت متأكد من حذف سجل جولة التفتيش؟')) {
      updateStateAndPersist(prev => ({
        ...prev,
        inspections: prev.inspections.filter(i => i.id !== id)
      }), 'تم حذف جولة التفتيش');
      logActivity('حذف سجل جولة مرور', item?.location || 'Unknown', 'INSPECTION');
    }
  };

  const handleStatusChangeInspection = (id: number, newStatus: InspectionItem['status']) => {
    const item = state.inspections.find(i => i.id === id);
    updateStateAndPersist(prev => ({
      ...prev,
      inspections: prev.inspections.map(i => i.id === id ? { ...i, status: newStatus } : i)
    }), `تم تحديث حالة الجولة إلى: ${newStatus}`);
    logActivity(`غيّر حالة جولة المرور إلى (${newStatus})`, item?.location || 'Inspection', 'INSPECTION');
  };

  // Units Management Actions (Strictly Restricted to Eng. Omar & Eng. Ahmed)
  const handleSaveUnit = (unitData: Omit<HospitalUnit, 'id'> & { id?: number }) => {
    if (!canModifyMasterConfig(currentUser)) {
      showToast('صلاحية إضافة وتعديل أماكن الفحص مقتصرة على م/ عمر فريد وم/ أحمد نبيه فقط!', 'error');
      return;
    }

    if (unitData.id) {
      updateStateAndPersist(prev => ({
        ...prev,
        units: prev.units.map(u => u.id === unitData.id ? { ...u, ...unitData } as HospitalUnit : u)
      }), `تم تحديث مكان الفحص (${unitData.name}) وقائمته بنجاح`);
      logActivity('قام بتحديث بيانات وقائمة فحص مكان', unitData.name, 'CONFIG');
    } else {
      const newUnit: HospitalUnit = {
        ...unitData,
        id: Date.now()
      };
      updateStateAndPersist(prev => ({
        ...prev,
        units: [...prev.units, newUnit]
      }), `تمت إضافة مكان الفحص الجديد (${unitData.name}) بنجاح`);
      logActivity('أضاف مكان فحص ووحدة جديدة', unitData.name, 'CONFIG');
    }
  };

  const handleDeleteUnit = (id: number) => {
    if (!canModifyMasterConfig(currentUser)) {
      showToast('صلاحية حذف أماكن الفحص مقتصرة على م/ عمر فريد وم/ أحمد نبيه فقط!', 'error');
      return;
    }

    const unit = state.units.find(u => u.id === id);
    if (window.confirm(`هل أنت متأكد من حذف مكان الفحص (${unit?.name}) وجميع بنود قائمته؟`)) {
      updateStateAndPersist(prev => ({
        ...prev,
        units: prev.units.filter(u => u.id !== id)
      }), 'تم حذف مكان الفحص بنجاح');
      logActivity('قام بحذف مكان فحص من النظام', unit?.name || 'Unit', 'CONFIG');
    }
  };

  const handleStartInspectionForUnit = (unit: HospitalUnit) => {
    setEditingInspection({
      id: 0,
      date: new Date().toISOString().split('T')[0],
      shift: 'نهاري (08:00 AM - 08:00 PM)',
      location: unit.name,
      inspector: currentUser?.name || unit.assignedInspector,
      type: 'مرور بيئة الرعاية (EOC)',
      status: 'مكتمل وممتثل',
      notes: '',
      checklistResults: unit.checklist.map(c => ({
        itemId: c.id,
        text: c.text,
        passed: true,
        notes: ''
      }))
    });
    setInspectionModalOpen(true);
  };

  // Weekly Schedule Actions (Strictly Restricted to Eng. Omar & Eng. Ahmed)
  const handleSaveScheduleSlot = (slotData: Omit<WeeklyScheduleSlot, 'id'> & { id?: number }) => {
    if (!canModifyMasterConfig(currentUser)) {
      showToast('صلاحية تعديل خطة الأسبوع مقتصرة على م/ عمر فريد وم/ أحمد نبيه فقط!', 'error');
      return;
    }

    if (slotData.id) {
      updateStateAndPersist(prev => ({
        ...prev,
        weeklySchedule: prev.weeklySchedule.map(s => s.id === slotData.id ? { ...s, ...slotData } as WeeklyScheduleSlot : s)
      }), 'تم تعديل الموعد في الخطة الأسبوعية');
      logActivity('عدّل موعد بالخطة الأسبوعية', `${slotData.departmentName} (${slotData.dayOfWeek})`, 'CONFIG');
    } else {
      const newSlot: WeeklyScheduleSlot = {
        ...slotData,
        id: Date.now(),
        createdBy: currentUser?.name
      };
      updateStateAndPersist(prev => ({
        ...prev,
        weeklySchedule: [...prev.weeklySchedule, newSlot]
      }), 'تمت إضافة الموعد إلى خطة المرور الأسبوعية');
      logActivity('أضاف موعد جديد بجدول الأسبوع', `${slotData.departmentName} (${slotData.dayOfWeek})`, 'CONFIG');
    }
  };

  const handleDeleteScheduleSlot = (id: number) => {
    if (!canModifyMasterConfig(currentUser)) {
      showToast('صلاحية حذف المواعيد من الخطة مقتصرة على م/ عمر فريد وم/ أحمد نبيه فقط!', 'error');
      return;
    }

    const slot = state.weeklySchedule.find(s => s.id === id);
    if (window.confirm('هل تريد حذف هذا الموعد من خطة الأسبوع؟')) {
      updateStateAndPersist(prev => ({
        ...prev,
        weeklySchedule: prev.weeklySchedule.filter(s => s.id !== id)
      }), 'تم حذف الموعد من الخطة الأسبوعية');
      logActivity('حذف موعد من خطة الأسبوع', `${slot?.departmentName} (${slot?.dayOfWeek})`, 'CONFIG');
    }
  };

  const handleExecuteAsInspection = (slot: WeeklyScheduleSlot) => {
    const today = new Date().toISOString().split('T')[0];
    const newInspection: InspectionItem = {
      id: Date.now(),
      date: today,
      dayOfWeek: slot.dayOfWeek,
      shift: slot.shift,
      location: slot.departmentName,
      inspector: currentUser?.name || slot.inspectorName,
      type: slot.roundType,
      status: 'مكتمل وممتثل',
      notes: slot.notes ? `منفذ وفق الخطة الأسبوعية المعتمدة: ${slot.notes}` : 'تم تنفيذ المرور المجدول بنجاح ومطابقة البنود',
      createdBy: currentUser?.name || slot.inspectorName,
      createdById: currentUser?.id,
      createdTimestamp: `${today} ${new Date().getHours().toString().padStart(2, '0')}:${new Date().getMinutes().toString().padStart(2, '0')}`
    };

    updateStateAndPersist(prev => ({
      ...prev,
      inspections: [newInspection, ...prev.inspections]
    }), `✅ تم تنفيذ وتسجيل جولة مرور لـ (${slot.departmentName}) وتوثيقها باسمك!`);
    logActivity('نفذ مرور فوري مجدول بالخطة الأسبوعية', slot.departmentName, 'INSPECTION');
    setActiveTab('inspections');
  };

  // Incidents Actions
  const handleSaveIncident = (itemData: Omit<IncidentItem, 'id'> & { id?: number }) => {
    if (itemData.id) {
      updateStateAndPersist(prev => ({
        ...prev,
        incidents: prev.incidents.map(i => i.id === itemData.id ? { ...i, ...itemData } as IncidentItem : i)
      }), 'تم تعديل سجل الحادث بنجاح');
      logActivity('عدل سجل حادث/إصابة عمل', itemData.name, 'INCIDENT');
    } else {
      const newItem: IncidentItem = {
        ...itemData,
        id: Date.now(),
        createdBy: currentUser?.name || 'مفتش السلامة',
        createdById: currentUser?.id
      };
      updateStateAndPersist(prev => ({
        ...prev,
        incidents: [newItem, ...prev.incidents]
      }), 'تم تسجيل الحادث والإجراء التصحيحي بالـ Data Center');
      logActivity('سجل إصابة عمل جديدة', `${itemData.name} (${itemData.type})`, 'INCIDENT');
    }
  };

  const handleDeleteIncident = (id: number) => {
    if (!canModifyMasterConfig(currentUser)) {
      showToast('حذف سجلات الحوادث مقتصر على م/ عمر فريد وم/ أحمد نبيه', 'error');
      return;
    }

    const inc = state.incidents.find(i => i.id === id);
    if (window.confirm('هل أنت متأكد من حذف سجل الحادث؟')) {
      updateStateAndPersist(prev => ({
        ...prev,
        incidents: prev.incidents.filter(i => i.id !== id)
      }), 'تم حذف سجل الحادث');
      logActivity('حذف سجل حادث عمل', inc?.name || 'Incident', 'INCIDENT');
    }
  };

  // NCRs Actions
  const handleSaveNcr = (itemData: Omit<NcrItem, 'id'> & { id?: number }) => {
    if (itemData.id) {
      updateStateAndPersist(prev => ({
        ...prev,
        ncrs: prev.ncrs.map(n => n.id === itemData.id ? { ...n, ...itemData } as NcrItem : n)
      }), 'تم تعديل تقرير عدم المطابقة بنجاح');
      logActivity('عدل تقرير عدم مطابقة', itemData.code, 'NCR');
    } else {
      const newItem: NcrItem = {
        ...itemData,
        id: Date.now(),
        createdBy: currentUser?.name || itemData.issuerName,
        createdById: currentUser?.id
      };
      updateStateAndPersist(prev => ({
        ...prev,
        ncrs: [newItem, ...prev.ncrs]
      }), 'تم تسجيل تقرير عدم المطابقة بالـ Data Center');
      logActivity('سجل تقرير عدم مطابقة جديد', `${itemData.code} (${itemData.location})`, 'NCR');
    }
  };

  const handleDeleteNcr = (id: number) => {
    if (!canModifyMasterConfig(currentUser)) {
      showToast('حذف تقارير عدم المطابقة مقتصر على م/ عمر فريد وم/ أحمد نبيه', 'error');
      return;
    }

    const ncr = state.ncrs.find(n => n.id === id);
    if (window.confirm('هل أنت متأكد من حذف تقرير عدم المطابقة؟')) {
      updateStateAndPersist(prev => ({
        ...prev,
        ncrs: prev.ncrs.filter(n => n.id !== id)
      }), 'تم حذف تقرير عدم المطابقة');
      logActivity('حذف تقرير عدم مطابقة', ncr?.code || 'NCR', 'NCR');
    }
  };

  const handleToggleNcrStatus = (id: number) => {
    const target = state.ncrs.find(n => n.id === id);
    const newStatus = target?.status === 'مفتوح' ? 'مغلق' : 'مفتوح';
    updateStateAndPersist(prev => ({
      ...prev,
      ncrs: prev.ncrs.map(n => {
        if (n.id === id) {
          return {
            ...n,
            status: newStatus,
            closedBy: newStatus === 'مغلق' ? currentUser?.name : undefined,
            closureDate: newStatus === 'مغلق' ? new Date().toISOString().split('T')[0] : undefined
          };
        }
        return n;
      })
    }), `تم تغيير حالة تقرير عدم المطابقة إلى: ${newStatus}`);
    logActivity(`قام بتغيير حالة NCR إلى (${newStatus})`, target?.code || 'NCR', 'NCR');
  };

  // User Accounts Management Actions
  const handleSaveUser = (userData: Omit<UserAccount, 'id'> & { id?: number }) => {
    if (!canModifyMasterConfig(currentUser)) {
      showToast('صلاحية إدارة المستخدمين مقتصرة على م/ عمر فريد وم/ أحمد نبيه فقط!', 'error');
      return;
    }

    if (userData.id) {
      updateStateAndPersist(prev => ({
        ...prev,
        users: prev.users.map(u => u.id === userData.id ? { ...u, ...userData } as UserAccount : u)
      }), 'تم تعديل بيانات المستخدم بنجاح');
      logActivity('عدل بيانات حساب مستخدم', userData.name, 'CONFIG');
    } else {
      const newUser: UserAccount = {
        ...userData,
        id: Date.now()
      };
      updateStateAndPersist(prev => ({
        ...prev,
        users: [...prev.users, newUser]
      }), 'تمت إضافة حساب المستخدم الجديد بنجاح');
      logActivity('أنشأ حساب مستخدم جديد', userData.name, 'CONFIG');
    }
  };

  const handleDeleteUser = (id: number) => {
    if (!canModifyMasterConfig(currentUser)) {
      showToast('صلاحية حذف المستخدمين مقتصرة على الإدارة العليا فقط!', 'error');
      return;
    }

    const u = state.users.find(item => item.id === id);
    if (u?.role === 'ADMIN') {
      showToast('لا يمكن حذف حساب مدير النظام الرئيسي', 'error');
      return;
    }

    if (window.confirm(`هل أنت متأكد من حذف حساب (${u?.name})؟`)) {
      updateStateAndPersist(prev => ({
        ...prev,
        users: prev.users.filter(item => item.id !== id)
      }), 'تم حذف المستخدم من النظام');
      logActivity('حذف حساب مستخدم من المنظومة', u?.name || 'User', 'CONFIG');
    }
  };

  // KPIs Actions
  const handleSaveKpi = (kpiData: KpiItem) => {
    updateStateAndPersist(prev => {
      const existsIndex = prev.kpis.findIndex(k => k.inspector === kpiData.inspector);
      if (existsIndex >= 0) {
        const nextList = [...prev.kpis];
        nextList[existsIndex] = kpiData;
        return { ...prev, kpis: nextList };
      } else {
        return { ...prev, kpis: [...prev.kpis, kpiData] };
      }
    }), 'تم حفظ تقييم المفتش بنجاح';
    logActivity('حدث تقييم أداء المفتش (KPI)', kpiData.inspector, 'CONFIG');
  };

  const handleDeleteKpi = (inspector: string) => {
    if (!canModifyMasterConfig(currentUser)) {
      showToast('حذف مؤشرات الأداء مقتصر على القيادة', 'error');
      return;
    }
    if (window.confirm(`هل أنت متأكد من حذف تقييم المفتش (${inspector})؟`)) {
      updateStateAndPersist(prev => ({
        ...prev,
        kpis: prev.kpis.filter(k => k.inspector !== inspector)
      }), 'تم حذف تقييم المفتش');
    }
  };

  const handleUpdateSigners = (newSigners: SignersConfig) => {
    if (!canModifyMasterConfig(currentUser)) {
      showToast('صلاحية تعديل التوقيعات والاعتمادات مقتصرة على م/ عمر فريد وم/ أحمد نبيه', 'error');
      return;
    }
    updateStateAndPersist(prev => ({
      ...prev,
      signers: newSigners
    }), 'تم تحديث واعتماد بيانات أصحاب التوقيع في التقارير الرسمية');
    logActivity('قام بتحديث بيانات أصحاب التوقيع والاعتماد', 'Signers Config', 'CONFIG');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-12 font-sans selection:bg-sky-700 selection:text-white">
      
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-5 left-5 z-50 animate-in slide-in-from-bottom-5 duration-200 no-print">
          <div className={`flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-lg border text-xs font-semibold ${
            toast.type === 'success' 
              ? 'bg-sky-900 text-sky-100 border-sky-700' 
              : toast.type === 'error'
              ? 'bg-rose-900 text-rose-100 border-rose-700'
              : 'bg-slate-900 text-slate-100 border-slate-700'
          }`}>
            {toast.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
            {toast.type === 'error' && <AlertCircle className="w-4 h-4 text-rose-400" />}
            {toast.type === 'info' && <Info className="w-4 h-4 text-sky-400" />}
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      {/* Main Header with Logo & Authentication Bar */}
      <Header
        isCloudConnected={isCloudConnected}
        isSyncing={isSyncing}
        currentUser={currentUser}
        onManualSync={handleManualSync}
        onExportJson={handleExportJson}
        onExportExcel={handleExportExcel}
        onImportJson={handleImportJson}
        onOpenLogin={() => setLoginModalOpen(true)}
        onOpenChangePassword={() => {
          setUserForPasswordChange(currentUser);
          setChangePasswordModalOpen(true);
        }}
        onLogout={handleLogout}
      />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-2">
        
        {/* Executive Stats Strip */}
        <StatsBanner state={state} />

        {/* Tab Navigation */}
        <TabsNav
          activeTab={activeTab}
          onTabChange={setActiveTab}
          counts={{
            inspections: state.inspections.length,
            units: state.units.length,
            weeklySchedule: state.weeklySchedule.length,
            ncrsOpen: state.ncrs.filter(n => n.status === 'مفتوح').length,
            incidents: state.incidents.length,
            users: state.users.length,
            kpis: state.kpis.length
          }}
        />

        {/* Active Tab Content */}
        {activeTab === 'inspections' && (
          <InspectionsTab
            inspections={state.inspections}
            state={state}
            onAddClick={() => {
              setEditingInspection(null);
              setInspectionModalOpen(true);
            }}
            onEditClick={(item) => {
              setEditingInspection(item);
              setInspectionModalOpen(true);
            }}
            onDeleteClick={handleDeleteInspection}
            onStatusChange={handleStatusChangeInspection}
          />
        )}

        {activeTab === 'units' && (
          <UnitsTab
            units={state.units}
            currentUser={currentUser}
            state={state}
            onAddUnit={() => {
              setEditingUnit(null);
              setUnitModalOpen(true);
            }}
            onEditUnit={(unit) => {
              setEditingUnit(unit);
              setUnitModalOpen(true);
            }}
            onDeleteUnit={handleDeleteUnit}
            onStartInspectionForUnit={handleStartInspectionForUnit}
          />
        )}

        {activeTab === 'weekly_schedule' && (
          <WeeklyScheduleTab
            schedule={state.weeklySchedule}
            currentUser={currentUser}
            state={state}
            onAddSlot={() => {
              setEditingScheduleSlot(null);
              setScheduleModalOpen(true);
            }}
            onEditSlot={(slot) => {
              setEditingScheduleSlot(slot);
              setScheduleModalOpen(true);
            }}
            onDeleteSlot={handleDeleteScheduleSlot}
            onExecuteAsInspection={handleExecuteAsInspection}
          />
        )}

        {activeTab === 'ncrs' && (
          <NcrsTab
            ncrs={state.ncrs}
            state={state}
            onAddClick={() => {
              setEditingNcr(null);
              setNcrModalOpen(true);
            }}
            onEditClick={(item) => {
              setEditingNcr(item);
              setNcrModalOpen(true);
            }}
            onDeleteClick={handleDeleteNcr}
            onToggleStatus={handleToggleNcrStatus}
          />
        )}

        {activeTab === 'incidents' && (
          <IncidentsTab
            incidents={state.incidents}
            state={state}
            onAddClick={() => {
              setEditingIncident(null);
              setIncidentModalOpen(true);
            }}
            onEditClick={(item) => {
              setEditingIncident(item);
              setIncidentModalOpen(true);
            }}
            onDeleteClick={handleDeleteIncident}
          />
        )}

        {activeTab === 'users' && (
          <UsersTab
            users={state.users}
            currentUser={currentUser}
            activityLog={state.activityLog || []}
            onAddUser={() => {
              setEditingUser(null);
              setUserModalOpen(true);
            }}
            onEditUser={(user) => {
              setEditingUser(user);
              setUserModalOpen(true);
            }}
            onDeleteUser={handleDeleteUser}
            onOpenChangePasswordForUser={(user) => {
              setUserForPasswordChange(user);
              setChangePasswordModalOpen(true);
            }}
          />
        )}

        {activeTab === 'kpis' && (
          <KpisTab
            kpis={state.kpis}
            onAddClick={() => {
              setEditingKpi(null);
              setKpiModalOpen(true);
            }}
            onEditClick={(item) => {
              setEditingKpi(item);
              setKpiModalOpen(true);
            }}
            onDeleteClick={handleDeleteKpi}
          />
        )}

        {activeTab === 'reports' && (
          <ReportsTab 
            state={state} 
            currentUser={currentUser} 
            onUpdateSigners={handleUpdateSigners} 
          />
        )}

      </main>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-6 border-t border-slate-200 text-center text-xs text-slate-500 no-print">
        <p className="font-semibold text-slate-700">
          مستشفى الناس للأطفال وأمراض القلب — إدارة السلامة والصحة المهنية وحماية البيئة
        </p>
        <p className="mt-1 text-[11px] text-slate-400">
          نظام التفتيش والامتثال المعتمد وفق متطلبات الهيئة العامة للاعتماد والرقابة الصحية (GAHAR 2025) ومعيار ISO 45001:2018
        </p>
      </footer>

      {/* Modals */}
      <InspectionModal
        isOpen={inspectionModalOpen}
        onClose={() => {
          setInspectionModalOpen(false);
          setEditingInspection(null);
        }}
        onSave={handleSaveInspection}
        initialItem={editingInspection}
        units={state.units}
        users={state.users}
        currentUser={currentUser}
      />

      <UnitEditModal
        isOpen={unitModalOpen}
        onClose={() => {
          setUnitModalOpen(false);
          setEditingUnit(null);
        }}
        onSave={handleSaveUnit}
        initialUnit={editingUnit}
        users={state.users}
      />

      <WeeklyScheduleModal
        isOpen={scheduleModalOpen}
        onClose={() => {
          setScheduleModalOpen(false);
          setEditingScheduleSlot(null);
        }}
        onSave={handleSaveScheduleSlot}
        initialSlot={editingScheduleSlot}
        units={state.units}
        users={state.users}
      />

      <IncidentModal
        isOpen={incidentModalOpen}
        onClose={() => {
          setIncidentModalOpen(false);
          setEditingIncident(null);
        }}
        onSave={handleSaveIncident}
        initialItem={editingIncident}
      />

      <NcrModal
        isOpen={ncrModalOpen}
        onClose={() => {
          setNcrModalOpen(false);
          setEditingNcr(null);
        }}
        onSave={handleSaveNcr}
        initialItem={editingNcr}
      />

      <UserEditModal
        isOpen={userModalOpen}
        onClose={() => {
          setUserModalOpen(false);
          setEditingUser(null);
        }}
        onSave={handleSaveUser}
        initialUser={editingUser}
      />

      <KpiModal
        isOpen={kpiModalOpen}
        onClose={() => {
          setKpiModalOpen(false);
          setEditingKpi(null);
        }}
        onSave={handleSaveKpi}
        initialItem={editingKpi}
      />

      <LoginModal
        isOpen={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
        users={state.users}
        currentUser={currentUser}
        onLoginSuccess={handleLoginSuccess}
      />

      <ChangePasswordModal
        isOpen={changePasswordModalOpen}
        onClose={() => {
          setChangePasswordModalOpen(false);
          setUserForPasswordChange(null);
        }}
        currentUser={userForPasswordChange || currentUser}
        onUpdatePassword={handleUpdatePassword}
      />

    </div>
  );
}
