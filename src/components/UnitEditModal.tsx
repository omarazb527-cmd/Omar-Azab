import React, { useState, useEffect } from 'react';
import { X, Building2, Plus, Trash2, ListChecks } from 'lucide-react';
import { HospitalUnit, UserAccount, ChecklistItem } from '../types';

interface UnitEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (unit: Omit<HospitalUnit, 'id'> & { id?: number }) => void;
  initialUnit?: HospitalUnit | null;
  users: UserAccount[];
}

export const UnitEditModal: React.FC<UnitEditModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialUnit,
  users
}) => {
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [buildingFloor, setBuildingFloor] = useState('');
  const [riskLevel, setRiskLevel] = useState<HospitalUnit['riskLevel']>('Medium Risk');
  const [defaultShift, setDefaultShift] = useState<HospitalUnit['defaultShift']>('Day');
  const [assignedInspector, setAssignedInspector] = useState('');
  const [backupInspector, setBackupInspector] = useState('');
  const [scheduledDays, setScheduledDays] = useState<string[]>(['Saturday']);
  const [checklist, setChecklist] = useState<ChecklistItem[]>([]);
  const [newChecklistText, setNewChecklistText] = useState('');
  const [error, setError] = useState('');

  const daysList = ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  useEffect(() => {
    if (initialUnit) {
      setName(initialUnit.name);
      setCode(initialUnit.code);
      setBuildingFloor(initialUnit.buildingFloor);
      setRiskLevel(initialUnit.riskLevel);
      setDefaultShift(initialUnit.defaultShift);
      setAssignedInspector(initialUnit.assignedInspector);
      setBackupInspector(initialUnit.backupInspector || '');
      setScheduledDays(initialUnit.scheduledDays || ['Saturday']);
      setChecklist(initialUnit.checklist || []);
    } else {
      setName('');
      setCode(`UNIT-${Math.floor(100 + Math.random() * 900)}`);
      setBuildingFloor('Building A - Floor 1');
      setRiskLevel('Medium Risk');
      setDefaultShift('Day');
      setAssignedInspector(users[0]?.name || 'Ali Mohamed');
      setBackupInspector('');
      setScheduledDays(['Saturday']);
      setChecklist([
        { id: 'c1', text: 'Emergency exit doors clear and unobstructed' },
        { id: 'c2', text: 'Fire extinguisher inspected, tagged, and in green zone' },
        { id: 'c3', text: 'Electrical panels closed with danger high-voltage warning' }
      ]);
    }
    setError('');
    setNewChecklistText('');
  }, [initialUnit, isOpen, users]);

  if (!isOpen) return null;

  const toggleDay = (day: string) => {
    if (scheduledDays.includes(day)) {
      setScheduledDays(scheduledDays.filter(d => d !== day));
    } else {
      setScheduledDays([...scheduledDays, day]);
    }
  };

  const handleAddChecklistItem = () => {
    if (!newChecklistText.trim()) return;
    const newItem: ChecklistItem = {
      id: `c_${Date.now()}`,
      text: newChecklistText.trim()
    };
    setChecklist([...checklist, newItem]);
    setNewChecklistText('');
  };

  const handleRemoveChecklistItem = (id: string) => {
    setChecklist(checklist.filter(c => c.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !code.trim()) {
      setError('يرجى إدخال اسم المكان بالإنجليزي والكود التعريفي');
      return;
    }
    if (!assignedInspector) {
      setError('يرجى تحديد المفتش المختص بالقسم');
      return;
    }

    onSave({
      id: initialUnit ? initialUnit.id : undefined,
      name: name.trim(),
      code: code.trim(),
      buildingFloor: buildingFloor.trim(),
      riskLevel,
      defaultShift,
      assignedInspector,
      backupInspector: backupInspector.trim(),
      scheduledDays,
      checklist
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150 max-h-[92vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2 text-sky-800">
            <Building2 className="w-5 h-5 text-sky-600" />
            <h3 className="font-bold text-base text-slate-900">
              {initialUnit ? `تعديل المكان وقائمة الفحص: ${initialUnit.name}` : 'إضافة مكان فحص جديد (New Unit)'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="my-3 p-2.5 bg-rose-50 text-rose-800 border border-rose-200 rounded-lg text-xs font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 mt-4 text-xs">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                اسم المكان / الوحدة (English Name) *
              </label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="e.g. Lab, Main OR, CCU, Chiller room..."
                required
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-600 focus:outline-none font-bold"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                كود المكان (Unit Code) *
              </label>
              <input
                type="text"
                value={code}
                onChange={e => setCode(e.target.value)}
                placeholder="UNIT-..."
                required
                className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono focus:ring-2 focus:ring-sky-600 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                الموقع / الطابق (Building & Floor)
              </label>
              <input
                type="text"
                value={buildingFloor}
                onChange={e => setBuildingFloor(e.target.value)}
                placeholder="Building A - Floor 2"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                مستوى الخطورة (Risk Level)
              </label>
              <select
                value={riskLevel}
                onChange={e => setRiskLevel(e.target.value as any)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-600 focus:outline-none font-semibold"
              >
                <option value="High Risk">عالي الخطورة (High Risk)</option>
                <option value="Medium Risk">متوسط الخطورة (Medium Risk)</option>
                <option value="Low Risk">منخفض الخطورة (Low Risk)</option>
              </select>
            </div>
          </div>

          {/* Inspectors Assignment */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-sky-50/60 rounded-xl border border-sky-200">
            <div>
              <label className="block font-bold text-sky-950 mb-1">
                المفتش المختص بالوحدة *
              </label>
              <select
                value={assignedInspector}
                onChange={e => setAssignedInspector(e.target.value)}
                required
                className="w-full px-3 py-2 border border-sky-300 rounded-lg bg-white font-bold text-sky-900 focus:ring-2 focus:ring-sky-600 focus:outline-none"
              >
                <option value="">-- اختر المفتش المختص --</option>
                {users.map(u => (
                  <option key={u.id} value={u.name}>
                    {u.name} ({u.roleTitle})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                المفتش البديل (Backup)
              </label>
              <select
                value={backupInspector}
                onChange={e => setBackupInspector(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-sky-600 focus:outline-none text-slate-700"
              >
                <option value="">-- اختياري --</option>
                {users.map(u => (
                  <option key={u.id} value={u.name}>
                    {u.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                الوردية الافتراضية (Default Shift)
              </label>
              <select
                value={defaultShift}
                onChange={e => setDefaultShift(e.target.value as any)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-600 focus:outline-none"
              >
                <option value="Day">نهاري (Day Shift 12h)</option>
                <option value="Night">ليلي (Night Shift 12h)</option>
                <option value="Both">كلاهما (Both)</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                أيام الفحص الأسبوعية (Scheduled Days)
              </label>
              <div className="flex flex-wrap gap-1 p-2 bg-slate-50 border border-slate-200 rounded-lg">
                {daysList.map(d => {
                  const checked = scheduledDays.includes(d);
                  return (
                    <button
                      key={d}
                      type="button"
                      onClick={() => toggleDay(d)}
                      className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-all cursor-pointer ${
                        checked ? 'bg-sky-700 text-white' : 'bg-white border text-slate-600'
                      }`}
                    >
                      {d.slice(0, 3)}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Checklist Items Management */}
          <div className="pt-2 border-t border-slate-200">
            <label className="block font-bold text-slate-900 mb-2 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <ListChecks className="w-4 h-4 text-sky-700" />
                <span>قائمة بنود الفحص الخاصة بهذا المكان ({checklist.length} بنود)</span>
              </span>
            </label>

            <div className="space-y-1.5 max-h-48 overflow-y-auto mb-3 pr-1">
              {checklist.length === 0 ? (
                <p className="text-slate-400 italic py-2">لا توجد بنود مسجلة بعد، أضف بنوداً أدناه</p>
              ) : (
                checklist.map((item, idx) => (
                  <div key={item.id} className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-200 text-xs gap-2">
                    <span className="font-mono text-sky-800 font-bold">{idx + 1}.</span>
                    <span className="flex-1 text-slate-800 leading-snug">{item.text}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveChecklistItem(item.id)}
                      className="p-1 text-slate-400 hover:text-rose-600"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))
              )}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={newChecklistText}
                onChange={e => setNewChecklistText(e.target.value)}
                placeholder="أدخل بند فحص جديد للمكان..."
                className="flex-1 px-3 py-1.5 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-sky-600 focus:outline-none"
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddChecklistItem();
                  }
                }}
              />
              <button
                type="button"
                onClick={handleAddChecklistItem}
                className="px-3 py-1.5 bg-sky-700 hover:bg-sky-800 text-white rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>إضافة بند</span>
              </button>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 font-medium hover:bg-slate-50 transition-colors cursor-pointer"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-sky-700 hover:bg-sky-800 text-white font-bold rounded-lg shadow-sm transition-colors cursor-pointer"
            >
              💾 حفظ المكان وتثبيت قائمة الفحص
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
