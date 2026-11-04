import React, { useState } from 'react';
import { 
  Printer, 
  FileText, 
  ShieldCheck, 
  Calendar, 
  Download,
  CalendarDays,
  Building2,
  Settings,
  CheckCircle2,
  FileSpreadsheet,
  Eye,
  AlertTriangle,
  Award,
  HeartPulse
} from 'lucide-react';
import { AppState, SignersConfig, UserAccount, ReportType } from '../types';
import { canModifyMasterConfig } from '../utils/permissions';
import { OfficialReportDocument } from './OfficialReportDocument';

interface ReportsTabProps {
  state: AppState;
  currentUser?: UserAccount | null;
  onUpdateSigners?: (newSigners: SignersConfig) => void;
}

export const ReportsTab: React.FC<ReportsTabProps> = ({ 
  state, 
  currentUser, 
  onUpdateSigners 
}) => {
  const [reportType, setReportType] = useState<ReportType>('master');
  const [isA4Preview, setIsA4Preview] = useState(false);
  const [isSignersModalOpen, setIsSignersModalOpen] = useState(false);

  const signers: SignersConfig = state.signers || {
    teamLeader: { name: 'م/ أحمد نبيه', title: 'Team Leader السلامة الميدانية' },
    safetyDirector: { name: 'م/ عمر فريد العزب', title: 'مدير إدارة السلامة والصحة المهنية' },
    opsDirector: { name: '', title: 'مدير التشغيل' },
    ceoDirector: { name: '', title: 'المدير التنفيذي للمستشفى' }
  };

  const [editSignersState, setEditSignersState] = useState<SignersConfig>(signers);

  const handlePrint = () => {
    try {
      window.print();
    } catch (e) {
      console.warn('Native print call error:', e);
    }
  };

  const handleSaveSigners = (e: React.FormEvent) => {
    e.preventDefault();
    if (onUpdateSigners) {
      onUpdateSigners(editSignersState);
    }
    setIsSignersModalOpen(false);
  };

  // Standalone HTML/PDF export that opens full page or triggers system print dialog
  const handleDownloadStandalonePdfHtml = () => {
    const printAreaEl = document.getElementById('printArea');
    if (!printAreaEl) return;

    const reportTitle = 
      reportType === 'master' ? 'التقرير التنفيذي الشامل للسلامة وبيئة الرعاية' :
      reportType === 'units' ? 'بيان أماكن الفحص وقوائم التحقق المعتمدة' :
      reportType === 'weekly_matrix' ? 'تقرير وخطة المرور الأسبوعي لورديات 12 ساعة' :
      reportType === 'incidents' ? 'سجل حوادث وإصابات العمل المعتمد' :
      reportType === 'ncrs' ? 'تقرير حالات عدم المطابقة والإنذارات' :
      reportType === 'inspections' ? 'تقرير سجل جولات المرور الميداني الأسبوعي' :
      'تقرير مؤشرات أداء فريق السلامة';

    const fullHtml = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <title>${reportTitle} - مستشفى الناس</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
  <style>
    @page { size: A4 portrait; margin: 10mm 12mm; }
    * { box-sizing: border-box; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
    body { font-family: 'Cairo', system-ui, sans-serif; background: #ffffff; color: #0f172a; margin: 0; padding: 20px; font-size: 11pt; direction: rtl; }
    table { width: 100%; border-collapse: collapse; margin-top: 10px; margin-bottom: 15px; }
    th { background-color: #f1f5f9; color: #0f172a; font-weight: bold; padding: 8px; border: 1px solid #cbd5e1; text-align: right; font-size: 9.5pt; }
    td { padding: 8px; border: 1px solid #cbd5e1; text-align: right; font-size: 9pt; }
    .header-box { border-bottom: 3px solid #0369a1; padding-bottom: 12px; margin-bottom: 16px; }
    .signatures { margin-top: 30px; border-top: 2px solid #94a3b8; padding-top: 15px; page-break-inside: avoid; }
    .sig-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; text-align: center; }
    .sig-box { border: 1px solid #cbd5e1; border-radius: 8px; padding: 10px; background: #f8fafc; }
    .no-print { display: none !important; }
    @media print { .no-print-btn { display: none !important; } body { padding: 0; } }
  </style>
</head>
<body>
  <div class="no-print-btn" style="text-align: center; margin-bottom: 20px;">
    <button onclick="window.print()" style="background: #0284c7; color: white; border: none; padding: 10px 24px; font-size: 14px; font-weight: bold; border-radius: 8px; cursor: pointer; font-family: Cairo;">
      🖨️ طباعة التقرير الآن / حفظ كـ PDF
    </button>
  </div>
  ${printAreaEl.innerHTML}
  <script>
    window.onload = function() {
      setTimeout(function() {
        window.print();
      }, 500);
    };
  </script>
</body>
</html>`;

    const blob = new Blob([fullHtml], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Alnas_Hospital_${reportType}_Report_${new Date().toISOString().split('T')[0]}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const reportButtons: { key: ReportType; label: string; icon: string }[] = [
    { key: 'master', label: 'التقرير التنفيذي الشامل', icon: '🏛️' },
    { key: 'incidents', label: 'تقرير حوادث العمل (Zero Harm)', icon: '🩹' },
    { key: 'ncrs', label: 'تقرير عدم المطابقة (NCRs)', icon: '⚠️' },
    { key: 'units', label: 'تقرير أماكن الفحص (Inspection Places)', icon: '🏥' },
    { key: 'weekly_matrix', label: 'تقرير خطة المرور الأسبوعي', icon: '🗓️' },
    { key: 'inspections', label: 'تقرير سجل الجولات الميدانية', icon: '📋' },
    { key: 'kpis', label: 'تقرير مؤشرات الأداء (KPIs)', icon: '📊' },
  ];

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-4 sm:p-6 mb-6">
      
      {/* Control Bar (Hidden during print) */}
      <div className="no-print pb-5 border-b border-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-sky-50 text-sky-800 rounded-lg border border-sky-100">
              <Printer className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                مركز طباعة وتصدير التقارير الرسمية المعتمدة
              </h2>
              <p className="text-xs text-slate-500">
                تقارير مستقلة لكل قسم (حوادث العمل، الـ NCRs، أماكن الفحص، الخطة، وسجل الجولات) مع التوقيعات الرباعية واللوجو
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Toggle A4 View */}
            <button
              type="button"
              onClick={() => setIsA4Preview(!isA4Preview)}
              className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold border transition-all cursor-pointer whitespace-nowrap ${
                isA4Preview
                  ? 'bg-sky-100 text-sky-900 border-sky-400 font-bold'
                  : 'bg-slate-50 text-slate-700 border-slate-300 hover:bg-slate-100'
              }`}
              title="معاينة شكل ورقة الطباعة A4 المعتمدة بهوامشها وتوقيعاتها"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>{isA4Preview ? 'إلغاء وضع A4' : 'معاينة ورقة A4'}</span>
            </button>

            {/* Signers Config Button (Restricted to Leaders) */}
            {canModifyMasterConfig(currentUser || null) && (
              <button
                type="button"
                onClick={() => {
                  setEditSignersState(signers);
                  setIsSignersModalOpen(true);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-semibold border border-slate-300 transition-all cursor-pointer whitespace-nowrap"
                title="تعديل مسميات وأسماء أصحاب التوقيع والاعتماد"
              >
                <Settings className="w-3.5 h-3.5 text-slate-600" />
                <span>تعديل التوقيعات</span>
              </button>
            )}

            {/* Download Standalone Printable PDF/HTML */}
            <button
              onClick={handleDownloadStandalonePdfHtml}
              className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-bold shadow-xs transition-all cursor-pointer whitespace-nowrap"
              title="تصدير نسخة تقرير HTML/PDF مستقلة جاهزة للطباعة الفورية بجودة فيكتور A4"
            >
              <Download className="w-3.5 h-3.5" />
              <span>تصدير PDF / ملف مستقل</span>
            </button>

            {/* Print directly */}
            <button
              onClick={handlePrint}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-xs font-bold shadow-sm transition-all cursor-pointer whitespace-nowrap"
              title="إرسال أمر الطباعة المباشر إلى الطابعة أو حفظ كـ PDF"
            >
              <Printer className="w-4 h-4" />
              <span>طباعة هذا التقرير</span>
            </button>
          </div>
        </div>

        {/* Visual Report Selection Tabs Ribbon */}
        <div className="mt-4 pt-4 border-t border-slate-100 flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          <span className="font-bold text-slate-600 shrink-0 ml-1">اختر التقرير المستقل:</span>
          {reportButtons.map(btn => (
            <button
              key={btn.key}
              onClick={() => setReportType(btn.key)}
              className={`px-3 py-1.5 rounded-lg font-bold shrink-0 flex items-center gap-1.5 transition-all cursor-pointer border ${
                reportType === btn.key
                  ? 'bg-sky-700 text-white border-sky-800 shadow-xs'
                  : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border-slate-200'
              }`}
            >
              <span>{btn.icon}</span>
              <span>{btn.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Official Document Sheet */}
      <div className="mt-4">
        <OfficialReportDocument
          reportType={reportType}
          state={state}
          isA4Preview={isA4Preview}
        />
      </div>

      {/* Signers Edit Modal */}
      {isSignersModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 overflow-y-auto no-print">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                <Settings className="w-4 h-4 text-sky-700" />
                <span>تعديل وتخصيص أصحاب التوقيع والاعتماد بالتقارير</span>
              </h3>
              <button
                onClick={() => setIsSignersModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveSigners} className="space-y-4 my-4 text-xs">
              
              {/* Signer 1: Team Leader */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="font-bold text-sky-950 block mb-2">1. التيم ليدر (Team Leader)</span>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={editSignersState.teamLeader.name}
                    onChange={e => setEditSignersState({
                      ...editSignersState,
                      teamLeader: { ...editSignersState.teamLeader, name: e.target.value }
                    })}
                    placeholder="الاسم: م/ أحمد نبيه"
                    className="p-2 border border-slate-300 rounded-lg font-bold"
                  />
                  <input
                    type="text"
                    value={editSignersState.teamLeader.title}
                    onChange={e => setEditSignersState({
                      ...editSignersState,
                      teamLeader: { ...editSignersState.teamLeader, title: e.target.value }
                    })}
                    placeholder="المسمى الوظيفي"
                    className="p-2 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              {/* Signer 2: Safety Director */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="font-bold text-sky-950 block mb-2">2. مدير إدارة السلامة والصحة المهنية</span>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={editSignersState.safetyDirector.name}
                    onChange={e => setEditSignersState({
                      ...editSignersState,
                      safetyDirector: { ...editSignersState.safetyDirector, name: e.target.value }
                    })}
                    placeholder="الاسم: م/ عمر فريد العزب"
                    className="p-2 border border-slate-300 rounded-lg font-bold"
                  />
                  <input
                    type="text"
                    value={editSignersState.safetyDirector.title}
                    onChange={e => setEditSignersState({
                      ...editSignersState,
                      safetyDirector: { ...editSignersState.safetyDirector, title: e.target.value }
                    })}
                    placeholder="المسمى الوظيفي"
                    className="p-2 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              {/* Signer 3: Operations Director */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="font-bold text-sky-950 block mb-2">3. مدير التشغيل</span>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={editSignersState.opsDirector.name}
                    onChange={e => setEditSignersState({
                      ...editSignersState,
                      opsDirector: { ...editSignersState.opsDirector, name: e.target.value }
                    })}
                    placeholder="اسم مدير التشغيل (أو اتركه فارغاً للتوقيع اليدوي)"
                    className="p-2 border border-slate-300 rounded-lg font-bold"
                  />
                  <input
                    type="text"
                    value={editSignersState.opsDirector.title}
                    onChange={e => setEditSignersState({
                      ...editSignersState,
                      opsDirector: { ...editSignersState.opsDirector, title: e.target.value }
                    })}
                    placeholder="المسمى: مدير التشغيل"
                    className="p-2 border border-slate-300 rounded-lg font-semibold"
                  />
                </div>
              </div>

              {/* Signer 4: CEO / General Director */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="font-bold text-sky-950 block mb-2">4. المدير التنفيذي للمستشفى</span>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={editSignersState.ceoDirector.name}
                    onChange={e => setEditSignersState({
                      ...editSignersState,
                      ceoDirector: { ...editSignersState.ceoDirector, name: e.target.value }
                    })}
                    placeholder="اسم المدير التنفيذي (أو اتركه فارغاً للختم والتوقيع)"
                    className="p-2 border border-slate-300 rounded-lg font-bold"
                  />
                  <input
                    type="text"
                    value={editSignersState.ceoDirector.title}
                    onChange={e => setEditSignersState({
                      ...editSignersState,
                      ceoDirector: { ...editSignersState.ceoDirector, title: e.target.value }
                    })}
                    placeholder="المسمى: المدير التنفيذي للمستشفى"
                    className="p-2 border border-slate-300 rounded-lg font-semibold"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsSignersModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 font-medium hover:bg-slate-50"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-sky-700 hover:bg-sky-800 text-white font-bold rounded-lg shadow-sm"
                >
                  حفظ وتطبيق التوقيعات فوراً
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
