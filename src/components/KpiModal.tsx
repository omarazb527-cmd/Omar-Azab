import React, { useState, useEffect } from 'react';
import { X, Award } from 'lucide-react';
import { KpiItem } from '../types';

interface KpiModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: KpiItem) => void;
  initialItem?: KpiItem | null;
}

export const KpiModal: React.FC<KpiModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialItem
}) => {
  const [inspector, setInspector] = useState('');
  const [inspectionsDone, setInspectionsDone] = useState<number>(20);
  const [ncrsRaised, setNcrsRaised] = useState<number>(5);
  const [responseTime, setResponseTime] = useState('1.5 يوم');
  const [compliance, setCompliance] = useState('95%');
  const [score, setScore] = useState<KpiItem['score']>('ممتاز');
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialItem) {
      setInspector(initialItem.inspector);
      setInspectionsDone(initialItem.inspectionsDone);
      setNcrsRaised(initialItem.ncrsRaised);
      setResponseTime(initialItem.responseTime);
      setCompliance(initialItem.compliance);
      setScore(initialItem.score);
    } else {
      setInspector('');
      setInspectionsDone(20);
      setNcrsRaised(4);
      setResponseTime('1.4 يوم');
      setCompliance('96%');
      setScore('ممتاز');
    }
    setError('');
  }, [initialItem, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inspector.trim()) {
      setError('يرجى إدخال اسم المفتش');
      return;
    }

    onSave({
      id: initialItem?.id,
      inspector: inspector.trim(),
      inspectionsDone: Number(inspectionsDone) || 0,
      ncrsRaised: Number(ncrsRaised) || 0,
      responseTime: responseTime.trim(),
      compliance: compliance.includes('%') ? compliance.trim() : `${compliance.trim()}%`,
      score
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2 text-sky-800">
            <Award className="w-5 h-5 text-sky-600" />
            <h3 className="font-bold text-base text-slate-900">
              {initialItem ? 'تعديل تقييم أداء مفتش' : 'إضافة تقييم أداء جديد (KPIs)'}
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
          
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              اسم المفتش / الفني
            </label>
            <input
              type="text"
              value={inspector}
              onChange={e => setInspector(e.target.value)}
              placeholder="مثال: حسام الدين محمود (فني سلامة)"
              required
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-600 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                عدد الجولات المنجزة
              </label>
              <input
                type="number"
                min="0"
                value={inspectionsDone}
                onChange={e => setInspectionsDone(parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                تقارير الـ NCR المرفوعة
              </label>
              <input
                type="number"
                min="0"
                value={ncrsRaised}
                onChange={e => setNcrsRaised(parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-600 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                متوسط زمن الاستجابة
              </label>
              <input
                type="text"
                value={responseTime}
                onChange={e => setResponseTime(e.target.value)}
                placeholder="1.4 يوم"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                نسبة الامتثال الكلية
              </label>
              <input
                type="text"
                value={compliance}
                onChange={e => setCompliance(e.target.value)}
                placeholder="97%"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-600 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              التقييم التراكمي
            </label>
            <select
              value={score}
              onChange={e => setScore(e.target.value as any)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-600 focus:outline-none"
            >
              <option value="ممتاز">ممتاز (Excellent)</option>
              <option value="جيد جداً">جيد جداً (Very Good)</option>
              <option value="جيد">جيد (Good)</option>
              <option value="مقبول">مقبول (Acceptable)</option>
            </select>
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
              className="px-5 py-2 bg-sky-800 hover:bg-sky-900 text-white font-bold rounded-lg shadow-sm transition-colors cursor-pointer"
            >
              💾 حفظ التقييم
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
