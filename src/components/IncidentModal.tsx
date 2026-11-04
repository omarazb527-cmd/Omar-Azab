import React, { useState, useEffect } from 'react';
import { X, HeartPulse } from 'lucide-react';
import { IncidentItem, IncidentCategory } from '../types';
import { getCurrentShift } from '../utils/sync';

interface IncidentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: Omit<IncidentItem, 'id'> & { id?: number }) => void;
  initialItem?: IncidentItem | null;
}

export const IncidentModal: React.FC<IncidentModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialItem
}) => {
  const [datetime, setDatetime] = useState('');
  const [shift, setShift] = useState('');
  const [name, setName] = useState('');
  const [dept, setDept] = useState('');
  const [location, setLocation] = useState('');
  const [type, setType] = useState<IncidentCategory>('إسعافات أولية (First Aid)');
  const [lostDays, setLostDays] = useState<number>(0);
  const [desc, setDesc] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialItem) {
      setDatetime(initialItem.datetime);
      setShift(initialItem.shift);
      setName(initialItem.name);
      setDept(initialItem.dept);
      setLocation(initialItem.location);
      setType(initialItem.type);
      setLostDays(initialItem.lostDays);
      setDesc(initialItem.desc);
    } else {
      const now = new Date();
      const str = now.toISOString().split('T')[0] + ' ' + 
        now.getHours().toString().padStart(2, '0') + ':' + 
        now.getMinutes().toString().padStart(2, '0');
      setDatetime(str);
      setShift(getCurrentShift());
      setName('');
      setDept('');
      setLocation('');
      setType('إسعافات أولية (First Aid)');
      setLostDays(0);
      setDesc('');
    }
    setError('');
  }, [initialItem, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('يرجى إدخال اسم المصاب ثلاثي');
      return;
    }
    if (!location.trim()) {
      setError('يرجى تحديد الموقع الدقيق للحادث');
      return;
    }
    if (!desc.trim()) {
      setError('يرجى كتابة تفاصيل الحادث والإجراء التصحيحي المتخذ');
      return;
    }

    onSave({
      id: initialItem ? initialItem.id : undefined,
      datetime,
      shift,
      name: name.trim(),
      dept: dept.trim() || 'عام',
      location: location.trim(),
      type,
      lostDays: Number(lostDays) || 0,
      desc: desc.trim()
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2 text-rose-800">
            <HeartPulse className="w-5 h-5 text-rose-600" />
            <h3 className="font-bold text-base text-slate-900">
              {initialItem ? 'تعديل سجل حادث / إصابة عمل' : 'تسجيل حادث / إصابة عمل جديدة'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
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
                التاريخ والوقت
              </label>
              <input
                type="text"
                value={datetime}
                onChange={e => setDatetime(e.target.value)}
                placeholder="2026-11-04 14:30"
                required
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                الوردية (الشفت)
              </label>
              <select
                value={shift}
                onChange={e => setShift(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-600 focus:outline-none"
              >
                <option value="نهاري (08:00 AM - 08:00 PM)">نهاري (08:00 AM - 08:00 PM)</option>
                <option value="ليلي (08:00 PM - 08:00 AM)">ليلي (08:00 PM - 08:00 AM)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                اسم المصاب
              </label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="الاسم ثلاثي"
                required
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                الإدارة / الوظيفة
              </label>
              <input
                type="text"
                value={dept}
                onChange={e => setDept(e.target.value)}
                placeholder="مثال: تمريض / خدمات مساندة / صيانة"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-600 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                الموقع الدقيق لوقوع الحادث
              </label>
              <input
                type="text"
                value={location}
                onChange={e => setLocation(e.target.value)}
                placeholder="مثال: المغسلة المركزية / قسم العمليات"
                required
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                أيام الغياب المقدرة (إن وجدت)
              </label>
              <input
                type="number"
                min="0"
                value={lostDays}
                onChange={e => setLostDays(parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-600 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              نوع الإصابة وتصنيف الخطورة
            </label>
            <select
              value={type}
              onChange={e => setType(e.target.value as any)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-600 focus:outline-none"
            >
              <option value="إسعافات أولية (First Aid)">إسعافات أولية (First Aid)</option>
              <option value="حادث وشيك (Near Miss)">حادث وشيك (Near Miss)</option>
              <option value="إصابة عمل مع هدر وقت (Lost Time Injury)">إصابة عمل مع هدر وقت (Lost Time Injury)</option>
              <option value="وخز إبرة وأدوات حادة (Sharps Injury)">وخز إبرة وأدوات حادة (Sharps Injury)</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              ملابسات وتفاصيل الحادث والإجراء التصحيحي
            </label>
            <textarea
              rows={3}
              value={desc}
              onChange={e => setDesc(e.target.value)}
              placeholder="شرح ما حدث بدقة، السبب الجذري، والإجراء المتخذ فوراً لمنع التكرار..."
              required
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-600 focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 font-medium hover:bg-slate-50 transition-colors"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-rose-800 hover:bg-rose-900 text-white font-bold rounded-lg shadow-sm transition-colors cursor-pointer"
            >
              💾 حفظ وإرسال للـ Data Center
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
