import React, { useState, useEffect } from 'react';
import { X, ClipboardCheck, ListChecks, CheckCircle2, AlertOctagon, UserCheck } from 'lucide-react';
import { InspectionItem, HospitalUnit, UserAccount, ChecklistResult } from '../types';
import { getCurrentShift } from '../utils/sync';

interface InspectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: Omit<InspectionItem, 'id'> & { id?: number }) => void;
  initialItem?: InspectionItem | null;
  units: HospitalUnit[];
  users: UserAccount[];
  currentUser: UserAccount | null;
}

export const InspectionModal: React.FC<InspectionModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialItem,
  units,
  users,
  currentUser
}) => {
  const [date, setDate] = useState('');
  const [shift, setShift] = useState<string>('');
  const [location, setLocation] = useState('');
  const [inspector, setInspector] = useState('');
  const [type, setType] = useState('مرور بيئة الرعاية (EOC)');
  const [status, setStatus] = useState<InspectionItem['status']>('مكتمل وممتثل');
  const [notes, setNotes] = useState('');
  const [checklistResults, setChecklistResults] = useState<ChecklistResult[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialItem) {
      setDate(initialItem.date);
      setShift(initialItem.shift);
      setLocation(initialItem.location);
      setInspector(initialItem.inspector);
      setType(initialItem.type);
      setStatus(initialItem.status);
      setNotes(initialItem.notes);
      setChecklistResults(initialItem.checklistResults || []);
    } else {
      setDate(new Date().toISOString().split('T')[0]);
      setShift(getCurrentShift());
      const defaultUnit = units[0]?.name || 'Lab';
      setLocation(defaultUnit);
      
      const matchedUnit = units.find(u => u.name === defaultUnit);
      setInspector(currentUser?.name || matchedUnit?.assignedInspector || users[0]?.name || 'Ali Mohamed');
      setType('مرور بيئة الرعاية (EOC)');
      setStatus('مكتمل وممتثل');
      setNotes('');

      if (matchedUnit?.checklist) {
        setChecklistResults(
          matchedUnit.checklist.map(c => ({
            itemId: c.id,
            text: c.text,
            passed: true,
            notes: ''
          }))
        );
      }
    }
    setError('');
  }, [initialItem, isOpen, units, users, currentUser]);

  if (!isOpen) return null;

  const handleUnitSelect = (unitName: string) => {
    setLocation(unitName);
    const matched = units.find(u => u.name === unitName);
    if (matched) {
      if (!initialItem && !currentUser) {
        setInspector(matched.assignedInspector);
      }
      if (matched.checklist) {
        setChecklistResults(
          matched.checklist.map(c => ({
            itemId: c.id,
            text: c.text,
            passed: true,
            notes: ''
          }))
        );
      }
    }
  };

  const toggleChecklistResult = (index: number) => {
    const updated = [...checklistResults];
    updated[index].passed = !updated[index].passed;
    setChecklistResults(updated);

    const hasFailed = updated.some(r => !r.passed);
    if (hasFailed) {
      setStatus('تم الرصد وتوجد ملاحظات');
    } else {
      setStatus('مكتمل وممتثل');
    }
  };

  const handleChecklistNoteChange = (index: number, val: string) => {
    const updated = [...checklistResults];
    updated[index].notes = val;
    setChecklistResults(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!location.trim()) {
      setError('يرجى تحديد مكان الفحص');
      return;
    }
    if (!inspector.trim()) {
      setError('يرجى كتابة اسم المفتش المسؤول');
      return;
    }

    const failedItems = checklistResults.filter(r => !r.passed);
    let finalNotes = notes.trim();
    if (failedItems.length > 0 && !finalNotes) {
      finalNotes = `تم رصد عدم مطابقة في: ${failedItems.map(f => f.text).join(' ؛ ')}`;
    }

    const now = new Date();
    const timestampStr = `${now.toISOString().split('T')[0]} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

    onSave({
      id: initialItem ? initialItem.id : undefined,
      date,
      shift,
      location: location.trim(),
      inspector: inspector.trim(),
      type,
      status,
      notes: finalNotes,
      createdBy: currentUser?.name || inspector.trim(),
      createdById: currentUser?.id,
      createdTimestamp: initialItem?.createdTimestamp || timestampStr,
      checklistResults
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150 max-h-[92vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2 text-sky-800">
            <ClipboardCheck className="w-5 h-5 text-sky-600" />
            <div>
              <h3 className="font-bold text-base text-slate-900">
                {initialItem ? 'تعديل جولة تفتيش بيئة الرعاية' : 'تسجيل جولة تفتيش بيئة الرعاية (EOC Round)'}
              </h3>
              <p className="text-[11px] text-slate-500">
                تسجيل ومطابقة بنود الفحص الميداني للمكان مع التوثيق باسم المفتش
              </p>
            </div>
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
                تاريخ الجولة
              </label>
              <input
                type="date"
                value={date}
                onChange={e => setDate(e.target.value)}
                required
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                الوردية (الشفت المحدد 12 ساعة)
              </label>
              <select
                value={shift}
                onChange={e => setShift(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-600 focus:outline-none"
              >
                <option value="نهاري (08:00 AM - 08:00 PM)">نهاري (08:00 AM - 08:00 PM)</option>
                <option value="ليلي (08:00 PM - 08:00 AM)">ليلي (08:00 PM - 08:00 AM)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-800 mb-1">
                مكان الفحص / الوحدة (Unit in English) *
              </label>
              <select
                value={location}
                onChange={e => handleUnitSelect(e.target.value)}
                required
                className="w-full px-3 py-2 border border-sky-300 rounded-lg bg-sky-50/40 font-bold text-slate-900 focus:ring-2 focus:ring-sky-600 focus:outline-none"
              >
                {units.map(u => (
                  <option key={u.id} value={u.name}>
                    {u.name} ({u.buildingFloor} - {u.riskLevel})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-800 mb-1">
                المفتش القائم بالفحص *
              </label>
              <select
                value={inspector}
                onChange={e => setInspector(e.target.value)}
                required
                className="w-full px-3 py-2 border border-slate-300 rounded-lg font-bold text-sky-900 focus:ring-2 focus:ring-sky-600 focus:outline-none"
              >
                {users.map(u => (
                  <option key={u.id} value={u.name}>
                    {u.name} ({u.roleTitle})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                نوع الجولة
              </label>
              <select
                value={type}
                onChange={e => setType(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-600 focus:outline-none"
              >
                <option value="مرور بيئة الرعاية (EOC)">مرور بيئة الرعاية (EOC)</option>
                <option value="فحص السلامة من الحريق (Fire Safety)">فحص السلامة من الحريق (Fire Safety)</option>
                <option value="إدارة المواد الخطرة والنفايات (HazMat)">إدارة المواد الخطرة والنفايات (HazMat)</option>
                <option value="فحص السلامة الإنشائية ومواقع العمل">فحص السلامة الإنشائية ومواقع العمل</option>
                <option value="فحص السلامة الإشعاعية والبيئية">فحص السلامة الإشعاعية والبيئية</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                حالة الامتثال الكلية للجولة
              </label>
              <select
                value={status}
                onChange={e => setStatus(e.target.value as any)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-600 focus:outline-none font-bold"
              >
                <option value="مكتمل وممتثل">مكتمل وممتثل (All Compliant)</option>
                <option value="تم الرصد وتوجد ملاحظات">تم الرصد وتوجد ملاحظات (Findings)</option>
                <option value="قيد المتابعة والتنفيذ">قيد المتابعة والتنفيذ (Pending CAPA)</option>
              </select>
            </div>
          </div>

          {/* Interactive Unit Checklist Inspection Section */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-200">
              <span className="font-bold text-slate-900 flex items-center gap-1.5 text-xs">
                <ListChecks className="w-4 h-4 text-sky-700" />
                <span>قائمة بنود الفحص الميداني الخاصة بـ ({location})</span>
              </span>
              <span className="text-[11px] text-sky-800 font-semibold">
                اضغط لتحديد (ممتثل / غير مطابق)
              </span>
            </div>

            {checklistResults.length === 0 ? (
              <p className="text-slate-400 italic py-2 text-center">
                لا توجد بنود فحص مسبقة لهذا المكان، يمكنك كتابة الملاحظات أدناه مباشرة
              </p>
            ) : (
              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {checklistResults.map((item, idx) => (
                  <div
                    key={item.itemId || idx}
                    className={`p-2.5 rounded-lg border transition-all ${
                      item.passed
                        ? 'bg-white border-slate-200'
                        : 'bg-rose-50/70 border-rose-300 shadow-xs'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start gap-2 flex-1">
                        <span className="font-mono font-bold text-sky-800 text-[10px] mt-0.5">
                          {idx + 1}.
                        </span>
                        <span className={`text-xs leading-snug ${item.passed ? 'text-slate-800 font-medium' : 'text-rose-900 font-bold'}`}>
                          {item.text}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => toggleChecklistResult(idx)}
                        className={`px-2.5 py-1 rounded text-[11px] font-bold cursor-pointer transition-colors whitespace-nowrap ${
                          item.passed
                            ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                            : 'bg-rose-600 text-white hover:bg-rose-700'
                        }`}
                      >
                        {item.passed ? '✓ ممتثل' : '✗ غير مطابق'}
                      </button>
                    </div>

                    {!item.passed && (
                      <div className="mt-2 pt-2 border-t border-rose-200">
                        <input
                          type="text"
                          value={item.notes || ''}
                          onChange={e => handleChecklistNoteChange(idx, e.target.value)}
                          placeholder="اكتب ملاحظة الخلل أو الإجراء الفوري المتخذ..."
                          className="w-full px-2 py-1 bg-white border border-rose-300 rounded text-[11px] text-rose-900 focus:outline-none focus:ring-1 focus:ring-rose-500"
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              ملاحظات وتوصيات إضافية للجولة
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="اكتب الملاحظات العامة، توصيات الصيانة الوقائية، ومسارات الهروب..."
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-600 focus:outline-none"
            />
          </div>

          {currentUser && (
            <div className="p-2.5 bg-sky-50/70 border border-sky-200 rounded-lg text-[11px] text-sky-900 flex items-center justify-between">
              <span>سيتم توثيق هذا الإجراء باسم: <strong>{currentUser.name}</strong></span>
              <span className="font-mono text-slate-500">سجل مركزي معتمد</span>
            </div>
          )}

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
              className="px-5 py-2 bg-sky-800 hover:bg-sky-900 text-white font-bold rounded-lg shadow-sm transition-colors cursor-pointer"
            >
              💾 حفظ الجولة وإرسالها للـ Data Center
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
