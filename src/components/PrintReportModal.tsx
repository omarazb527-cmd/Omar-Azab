import React, { useState } from 'react';
import { 
  X, 
  Printer, 
  Download, 
  Eye, 
  ShieldCheck,
  FileText
} from 'lucide-react';
import { AppState, ReportType } from '../types';
import { OfficialReportDocument } from './OfficialReportDocument';

interface PrintReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  reportType: ReportType;
  state: AppState;
  customTitle?: string;
}

export const PrintReportModal: React.FC<PrintReportModalProps> = ({
  isOpen,
  onClose,
  reportType,
  state,
  customTitle
}) => {
  const [isA4Preview, setIsA4Preview] = useState(false);

  if (!isOpen) return null;

  const handlePrint = () => {
    try {
      window.print();
    } catch (e) {
      console.warn('Native print call error:', e);
    }
  };

  const handleDownloadStandalonePdfHtml = () => {
    const printAreaEl = document.getElementById('printAreaModal') || document.getElementById('printArea');
    if (!printAreaEl) return;

    const reportTitle = customTitle || (
      reportType === 'master' ? 'التقرير التنفيذي الشامل للسلامة وبيئة الرعاية' :
      reportType === 'units' ? 'بيان أماكن الفحص وقوائم التحقق المعتمدة' :
      reportType === 'weekly_matrix' ? 'تقرير وخطة المرور الأسبوعي لورديات 12 ساعة' :
      reportType === 'incidents' ? 'سجل حوادث وإصابات العمل المعتمد' :
      reportType === 'ncrs' ? 'تقرير متابعة وتصحيح حالات عدم المطابقة' :
      reportType === 'inspections' ? 'تقرير سجل جولات المرور الميداني الأسبوعي' :
      'تقرير مؤشرات أداء فريق السلامة'
    );

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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-5xl w-full p-4 sm:p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150 max-h-[95vh] overflow-y-auto flex flex-col justify-between">
        
        {/* Top Control Bar in Modal */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-slate-200 no-print">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-sky-50 text-sky-700 rounded-lg border border-sky-100">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900">
                {customTitle || 'التقرير الرسمي المعتمد'}
              </h3>
              <p className="text-xs text-slate-500">
                مستند رسمي معتمد بالترويسة وشعار المستشفى والتوقيعات الرباعية للإدارة
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => setIsA4Preview(!isA4Preview)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                isA4Preview
                  ? 'bg-sky-100 text-sky-900 border-sky-400 font-bold'
                  : 'bg-slate-50 text-slate-700 border-slate-300 hover:bg-slate-100'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>{isA4Preview ? 'إلغاء وضع A4' : 'معاينة ورقة A4'}</span>
            </button>

            <button
              onClick={handleDownloadStandalonePdfHtml}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-bold shadow-xs transition-all cursor-pointer"
              title="تصدير ملف مستقل عالي الدقة جاهز للطباعة"
            >
              <Download className="w-3.5 h-3.5" />
              <span>تصدير PDF / ملف مستقل</span>
            </button>

            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-xs font-bold shadow-xs transition-all cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>طباعة فورية</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Sheet */}
        <div id="printAreaModal" className="my-4 overflow-y-auto">
          <OfficialReportDocument
            reportType={reportType}
            state={state}
            isA4Preview={isA4Preview}
          />
        </div>

        {/* Modal Footer */}
        <div className="pt-3 border-t border-slate-100 flex justify-end gap-2 no-print">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
          >
            إغلاق
          </button>
        </div>

      </div>
    </div>
  );
};
