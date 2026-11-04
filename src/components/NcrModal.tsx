import React, { useState, useEffect } from 'react';
import { X, AlertTriangle } from 'lucide-react';
import { NcrItem, NcrSeverity, NcrStatus } from '../types';

interface NcrModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: Omit<NcrItem, 'id'> & { id?: number }) => void;
  initialItem?: NcrItem | null;
}

export const NcrModal: React.FC<NcrModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialItem
}) => {
  const [code, setCode] = useState('');
  const [location, setLocation] = useState('');
  const [targetDept, setTargetDept] = useState('');
  const [desc, setDesc] = useState('');
  const [severity, setSeverity] = useState<NcrSeverity>('متوسط (Major)');
  const [deadline, setDeadline] = useState('');
  const [status, setStatus] = useState<NcrStatus>('مفتوح');
  const [issuerName, setIssuerName] = useState('فني السلامة الميداني');
  const [immediateAction, setImmediateAction] = useState('');
  const [rootCause, setRootCause] = useState('');
  const [capaPlan, setCapaPlan] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialItem) {
      setCode(initialItem.code);
      setLocation(initialItem.location);
      setTargetDept(initialItem.targetDept || '');
      setDesc(initialItem.desc);
      setSeverity(initialItem.severity);
      setDeadline(initialItem.deadline);
      setStatus(initialItem.status);
      setIssuerName(initialItem.issuerName || 'فني السلامة الميداني');
      setImmediateAction(initialItem.immediateAction || '');
      setRootCause(initialItem.rootCause || '');
      setCapaPlan(initialItem.capaPlan || '');
    } else {
      const randomNum = Math.floor(100 + Math.random() * 900);
      setCode(`NCR-2026-${randomNum}`);
      setLocation('');
      setTargetDept('');
      setDesc('');
      setSeverity('متوسط (Major)');
      const in3Days = new Date();
      in3Days.setDate(in3Days.getDate() + 3);
      setDeadline(in3Days.toISOString().split('T')[0]);
      setStatus('مفتوح');
      setIssuerName('فني السلامة الميداني');
      setImmediateAction('');
      setRootCause('');
      setCapaPlan('');
    }
    setError('');
  }, [initialItem, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim() || !location.trim() || !desc.trim()) {
      setError('يرجى استكمال كود التقرير، الموقع، ووصف عدم المطابقة');
      return;
    }

    onSave({
      id: initialItem ? initialItem.id : undefined,
      code: code.trim(),
      location: location.trim(),
      targetDept: targetDept.trim(),
      desc: desc.trim(),
      severity,
      deadline,
      status,
      issuerName: issuerName.trim(),
      immediateAction: immediateAction.trim(),
      rootCause: rootCause.trim(),
      capaPlan: capaPlan.trim(),
      closureDate: status === 'مغلق' ? new Date().toISOString().split('T')[0] : undefined
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150 max-h-[92vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2 text-amber-800">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
            <h3 className="font-bold text-base text-slate-900">
              {initialItem ? 'تعديل تقرير عدم مطابقة (NCR & CAPA)' : 'تسجيل تقرير عدم مطابقة رسمي (NCR & CAPA)'}
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
                كود التقرير (NCR Code)
              </label>
              <input
                type="text"
                value={code}
                onChange={e => setCode(e.target.value)}
                placeholder="NCR-2026-..."
                required
                className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono focus:ring-2 focus:ring-amber-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                المحرر ومفتش السلامة
              </label>
              <input
                type="text"
                value={issuerName}
                onChange={e => setIssuerName(e.target.value)}
                placeholder="اسم المفتش أو التيم ليدر"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-600 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                الموقع / القسم المخالف
              </label>
              <input
                type="text"
                value={location}
                onChange={e => setLocation(e.target.value)}
                placeholder="مثال: المطبخ المركزي / مخزن الأدوية"
                required
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                الإدارة المعنية بالتصحيح
              </label>
              <input
                type="text"
                value={targetDept}
                onChange={e => setTargetDept(e.target.value)}
                placeholder="مثال: إدارة الخدمات / الصيانة / التمريض"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-600 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              وصف عدم المطابقة بدقة (Non-Conformance Evidence)
            </label>
            <textarea
              rows={2}
              value={desc}
              onChange={e => setDesc(e.target.value)}
              placeholder="وصف المخالفة بدقة، أثرها على سلامة المرضى والعاملين..."
              required
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-600 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                مستوى الخطورة
              </label>
              <select
                value={severity}
                onChange={e => setSeverity(e.target.value as NcrSeverity)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-600 focus:outline-none"
              >
                <option value="حرج (Critical)">حرج (Critical) - تهديد مباشر للسلامة</option>
                <option value="متوسط (Major)">متوسط (Major) - انحراف تشغيلي هام</option>
                <option value="بسيط (Minor)">بسيط (Minor) - ملاحظة توجيهية</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                المهلة المقررة للإغلاق
              </label>
              <input
                type="date"
                value={deadline}
                onChange={e => setDeadline(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-600 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              الإجراء الفوري لاحتواء الخطر (Immediate Containment)
            </label>
            <input
              type="text"
              value={immediateAction}
              onChange={e => setImmediateAction(e.target.value)}
              placeholder="مثال: إخلاء الممر فوراً وإبلاغ مشرف الوردية"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-600 focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              تحليل السبب الجذري للخلل (Root Cause Analysis - RCA)
            </label>
            <input
              type="text"
              value={rootCause}
              onChange={e => setRootCause(e.target.value)}
              placeholder="مثال: عدم وجود مساحات تخزين كافية وضغط توريدات دون تنسيق مسبق"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-600 focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              خطة العمل التصحيحية والوقائية (CAPA Plan)
            </label>
            <textarea
              rows={2}
              value={capaPlan}
              onChange={e => setCapaPlan(e.target.value)}
              placeholder="الإجراءات الجذرية المعتمدة لمنع تكرار المخالفة..."
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-600 focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              حالة التقرير
            </label>
            <select
              value={status}
              onChange={e => setStatus(e.target.value as NcrStatus)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-600 focus:outline-none"
            >
              <option value="مفتوح">مفتوح وقيد المتابعة والتنفيذ</option>
              <option value="مغلق">مغلق ومستوفى الإجراءات والتحقق الميداني</option>
            </select>
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
              className="px-5 py-2 bg-amber-800 hover:bg-amber-900 text-white font-bold rounded-lg shadow-sm transition-colors cursor-pointer"
            >
              💾 حفظ التقرير وإدراجه في سجل الـ Data Center
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
