import React, { useState, useEffect } from 'react';
import { X, CalendarDays } from 'lucide-react';
import { WeeklyScheduleSlot, HospitalUnit, UserAccount } from '../types';

interface WeeklyScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (slot: Omit<WeeklyScheduleSlot, 'id'> & { id?: number }) => void;
  initialSlot?: WeeklyScheduleSlot | null;
  units: HospitalUnit[];
  users: UserAccount[];
}

export const WeeklyScheduleModal: React.FC<WeeklyScheduleModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialSlot,
  units,
  users
}) => {
  const [dayOfWeek, setDayOfWeek] = useState<string>('Saturday');
  const [shift, setShift] = useState<WeeklyScheduleSlot['shift']>('نهاري (08:00 AM - 08:00 PM)');
  const [departmentName, setDepartmentName] = useState('');
  const [inspectorName, setInspectorName] = useState('');
  const [roundType, setRoundType] = useState('مرور بيئة الرعاية (EOC)');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  const daysList = ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  useEffect(() => {
    if (initialSlot) {
      setDayOfWeek(initialSlot.dayOfWeek);
      setShift(initialSlot.shift);
      setDepartmentName(initialSlot.departmentName);
      setInspectorName(initialSlot.inspectorName);
      setRoundType(initialSlot.roundType);
      setNotes(initialSlot.notes || '');
    } else {
      setDayOfWeek('Saturday');
      setShift('نهاري (08:00 AM - 08:00 PM)');
      const defaultUnit = units[0]?.name || 'Lab';
      setDepartmentName(defaultUnit);
      const matched = units.find(u => u.name === defaultUnit);
      setInspectorName(matched?.assignedInspector || users[0]?.name || 'Ali Mohamed');
      setRoundType('مرور بيئة الرعاية (EOC)');
      setNotes('');
    }
    setError('');
  }, [initialSlot, isOpen, units, users]);

  if (!isOpen) return null;

  const handleUnitChange = (name: string) => {
    setDepartmentName(name);
    const matched = units.find(u => u.name === name);
    if (matched?.assignedInspector) {
      setInspectorName(matched.assignedInspector);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!departmentName.trim() || !inspectorName.trim()) {
      setError('يرجى تحديد المكان والمفتش المسؤول');
      return;
    }

    onSave({
      id: initialSlot ? initialSlot.id : undefined,
      dayOfWeek,
      shift,
      departmentName: departmentName.trim(),
      inspectorName: inspectorName.trim(),
      roundType,
      notes: notes.trim()
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2 text-sky-800">
            <CalendarDays className="w-5 h-5 text-sky-600" />
            <h3 className="font-bold text-base text-slate-900">
              {initialSlot ? 'تعديل موعد مرور في الخطة الأسبوعية' : 'إضافة موعد مرور في الخطة الأسبوعية'}
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
                اليوم (Day of Week)
              </label>
              <select
                value={dayOfWeek}
                onChange={e => setDayOfWeek(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-600 focus:outline-none font-bold"
              >
                {daysList.map(day => (
                  <option key={day} value={day}>{day}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                الوردية (الشفت المحدد 12 ساعة)
              </label>
              <select
                value={shift}
                onChange={e => setShift(e.target.value as any)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-600 focus:outline-none"
              >
                <option value="نهاري (08:00 AM - 08:00 PM)">نهاري (08:00 AM - 08:00 PM)</option>
                <option value="ليلي (08:00 PM - 08:00 AM)">ليلي (08:00 PM - 08:00 AM)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                مكان الفحص (Unit in English) *
              </label>
              <select
                value={departmentName}
                onChange={e => handleUnitChange(e.target.value)}
                required
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-600 focus:outline-none font-bold text-slate-900"
              >
                <option value="">-- اختر مكان الفحص --</option>
                {units.map(u => (
                  <option key={u.id} value={u.name}>
                    {u.name} ({u.buildingFloor})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                المفتش المسؤول (Inspector) *
              </label>
              <select
                value={inspectorName}
                onChange={e => setInspectorName(e.target.value)}
                required
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-600 focus:outline-none font-semibold text-sky-900"
              >
                <option value="">-- اختر المفتش --</option>
                {users.map(u => (
                  <option key={u.id} value={u.name}>
                    {u.name} ({u.roleTitle})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              نوع الجولة
            </label>
            <select
              value={roundType}
              onChange={e => setRoundType(e.target.value)}
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
              توجيهات أو ملاحظات خاصة بالموعد
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="مثال: التأكد من مانومترات الغاز والتهوية..."
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-600 focus:outline-none"
            />
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
              className="px-5 py-2 bg-sky-800 hover:bg-sky-900 text-white font-bold rounded-lg shadow-sm transition-colors cursor-pointer"
            >
              💾 تثبيت في الجدول الأسبوعي
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
