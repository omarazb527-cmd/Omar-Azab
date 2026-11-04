import React from 'react';
import { X, Printer, AlertTriangle, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { NcrItem } from '../types';

interface NcrFormalDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  ncr: NcrItem | null;
}

export const NcrFormalDocumentModal: React.FC<NcrFormalDocumentModalProps> = ({
  isOpen,
  onClose,
  ncr
}) => {
  if (!isOpen || !ncr) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-4xl w-full p-4 sm:p-8 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150 max-h-[92vh] overflow-y-auto print-clean">
        
        {/* Modal Top Actions (Hidden in print) */}
        <div className="no-print flex items-center justify-between pb-4 mb-4 border-b border-slate-200">
          <div className="flex items-center gap-2 text-amber-800">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
            <h3 className="font-bold text-sm sm:text-base text-slate-900">
              نموذج إشعار عدم مطابقة معتمد رسمي (Official NCR Document)
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-sky-800 hover:bg-sky-900 text-white rounded-lg text-xs font-bold shadow-xs cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>طباعة هذا النموذج وتصدير PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* The Printable Official Document Sheet */}
        <div className="border-2 border-slate-900 p-6 sm:p-8 rounded-xl bg-white text-slate-900">
          
          {/* Header */}
          <div className="border-b-2 border-slate-900 pb-4 mb-5">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="p-1 bg-white border border-slate-300 rounded-xl">
                  <img
                    src="/assets/aistudio/logo4_4e162ca5.png"
                    alt="شعار مستشفى الناس"
                    className="h-12 w-auto object-contain"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                </div>
                <div>
                  <h1 className="text-xl font-extrabold text-sky-950 font-sans">
                    مستشفى الناس للأطفال وأمراض القلب
                  </h1>
                  <p className="text-xs font-bold text-sky-800">
                    إدارة السلامة والصحة المهنية وحماية البيئة (EHS)
                  </p>
                  <p className="text-[11px] text-slate-500">
                    المرجعية: متطلبات الاعتماد الوطني GAHAR 2025 / شهادة ISO 45001:2018
                  </p>
                </div>
              </div>

              <div className="text-left text-xs text-slate-800 sm:border-r-2 sm:border-slate-800 sm:pr-4">
                <p className="font-bold text-base text-rose-800 font-mono">
                  {ncr.code}
                </p>
                <p className="font-semibold text-slate-600 mt-0.5">
                  نموذج تقرير عدم مطابقة ميداني
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  تاريخ الرصد: <strong>{new Date().toLocaleDateString('ar-EG')}</strong>
                </p>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-300 flex flex-wrap justify-between items-center text-xs gap-2">
              <div>
                <span className="text-slate-500 ml-1">حالة التقرير:</span>
                <span className={`font-bold px-2.5 py-0.5 rounded ${
                  ncr.status === 'مغلق' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                }`}>
                  {ncr.status === 'مغلق' ? 'مغلق ومستوفى الإجراءات' : 'مفتوح وقيد المتابعة والتنفيذ'}
                </span>
              </div>
              <div>
                <span className="text-slate-500 ml-1">مستوى الخطورة:</span>
                <span className="font-bold text-amber-900 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                  {ncr.severity}
                </span>
              </div>
              <div>
                <span className="text-slate-500 ml-1">المهلة المقررة للإغلاق:</span>
                <span className="font-bold font-mono text-slate-900">{ncr.deadline || 'فوري'}</span>
              </div>
            </div>
          </div>

          {/* Details Table */}
          <table className="w-full text-right text-xs border border-slate-900 mb-5 border-collapse">
            <tbody>
              <tr className="border-b border-slate-900">
                <td className="w-1/4 p-2.5 bg-slate-100 font-bold border-l border-slate-900">الموقع / القسم المخالف:</td>
                <td className="p-2.5 font-bold text-slate-900">{ncr.location}</td>
                <td className="w-1/6 p-2.5 bg-slate-100 font-bold border-r border-l border-slate-900">الإدارة المعنية:</td>
                <td className="p-2.5 font-medium">{ncr.targetDept || 'الإدارة المسؤولة'}</td>
              </tr>
              <tr>
                <td className="p-2.5 bg-slate-100 font-bold border-l border-slate-900">المحرر ومفتش السلامة:</td>
                <td className="p-2.5">{ncr.issuerName || 'فني السلامة والصحة المهنية'}</td>
                <td className="p-2.5 bg-slate-100 font-bold border-r border-l border-slate-900">تاريخ الإغلاق:</td>
                <td className="p-2.5 font-mono">{ncr.closureDate || (ncr.status === 'مغلق' ? 'معتمد' : 'قيد المتابعة')}</td>
              </tr>
            </tbody>
          </table>

          {/* Section 1: Non-conformance description */}
          <div className="mb-4">
            <h4 className="text-xs font-bold text-slate-900 bg-slate-100 p-2 border-r-4 border-slate-900 mb-2">
              1. تفاصيل ووصف حالة عدم المطابقة (Non-Conformance Description & Evidence):
            </h4>
            <div className="p-3 border border-slate-300 rounded bg-slate-50/50 text-xs leading-relaxed text-slate-800">
              {ncr.desc}
            </div>
          </div>

          {/* Section 2: Immediate Containment Action */}
          <div className="mb-4">
            <h4 className="text-xs font-bold text-slate-900 bg-slate-100 p-2 border-r-4 border-amber-600 mb-2">
              2. الإجراء الفوري لاحتواء الخطر (Immediate Containment Action):
            </h4>
            <div className="p-3 border border-slate-300 rounded bg-slate-50/50 text-xs leading-relaxed text-slate-800">
              {ncr.immediateAction || 'تم إبلاغ مشرف المنطقة وتوجيه تعليمات السلامة الفورية لمنع أي حادث وشيك.'}
            </div>
          </div>

          {/* Section 3: Root Cause Analysis (RCA) */}
          <div className="mb-4">
            <h4 className="text-xs font-bold text-slate-900 bg-slate-100 p-2 border-r-4 border-rose-600 mb-2">
              3. تحليل السبب الجذري للخلل (Root Cause Analysis - RCA):
            </h4>
            <div className="p-3 border border-slate-300 rounded bg-slate-50/50 text-xs leading-relaxed text-slate-800">
              {ncr.rootCause || 'عدم الالتزام ببروتوكول التخزين القياسي وضغط العمل، مع الحاجة لتدريب توعوي إضافي للعاملين.'}
            </div>
          </div>

          {/* Section 4: Corrective and Preventive Action Plan (CAPA) */}
          <div className="mb-5">
            <h4 className="text-xs font-bold text-slate-900 bg-slate-100 p-2 border-r-4 border-emerald-600 mb-2">
              4. خطة العمل التصحيحية والوقائية لمنع التكرار (CAPA Plan):
            </h4>
            <div className="p-3 border border-slate-300 rounded bg-slate-50/50 text-xs leading-relaxed text-slate-800">
              {ncr.capaPlan || 'تعديل مسارات العمل، وضع علامات إرشادية وتدريب الفريق مع جدولة مرور متابعة كل 48 ساعة.'}
            </div>
          </div>

          {/* Verification section if closed */}
          {ncr.status === 'مغلق' && (
            <div className="mb-5 p-3 border border-emerald-300 bg-emerald-50 rounded-lg text-xs">
              <div className="flex items-center gap-1.5 font-bold text-emerald-900 mb-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                <span>شهادة التحقق الميداني والإغلاق (Closure Verification):</span>
              </div>
              <p className="text-emerald-800">
                {ncr.verificationNotes || 'تمت المعاينة الميدانية من قِبل إدارة السلامة والصحة المهنية والتأكد من استيفاء كافة متطلبات السلامة وإغلاق الملاحظة نهائياً.'}
              </p>
              <p className="text-[11px] text-emerald-700 mt-1">
                معتمد الإغلاق: <strong>{ncr.closedBy || 'مدير إدارة السلامة والصحة المهنية'}</strong>
              </p>
            </div>
          )}

          {/* Signatures */}
          <div className="mt-8 pt-4 border-t-2 border-slate-900">
            <div className="grid grid-cols-3 gap-4 text-center text-xs">
              
              <div className="border border-dashed border-slate-400 p-3 rounded">
                <p className="font-bold text-slate-800">محرر التقرير (مفتش السلامة)</p>
                <p className="text-[11px] text-slate-500 mt-0.5">{ncr.issuerName || 'فني السلامة'}</p>
                <div className="w-3/4 mx-auto border-b border-slate-400 my-6"></div>
                <span className="text-[10px] text-slate-400">التوقيع والتاريخ</span>
              </div>

              <div className="border border-dashed border-slate-400 p-3 rounded">
                <p className="font-bold text-slate-800">مسؤول الإدارة / القسم المخالف</p>
                <p className="text-[11px] text-slate-500 mt-0.5">{ncr.targetDept || 'رئيس القسم المعني'}</p>
                <div className="w-3/4 mx-auto border-b border-slate-400 my-6"></div>
                <span className="text-[10px] text-slate-400">التوقيع بالاستلام والتعهد</span>
              </div>

              <div className="border border-dashed border-slate-400 p-3 rounded">
                <p className="font-bold text-slate-800">اعتماد إدارة السلامة والبيئة</p>
                <p className="text-[11px] text-slate-500 mt-0.5">مدير إدارة السلامة والصحة المهنية</p>
                <div className="w-3/4 mx-auto border-b border-slate-400 my-6"></div>
                <span className="text-[10px] text-slate-400">الختم الرسمي والاعتماد</span>
              </div>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
