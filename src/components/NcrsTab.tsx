import React, { useState, useMemo } from 'react';
import { 
  Plus, 
  Search, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Edit3, 
  Trash2, 
  CheckSquare, 
  RotateCcw,
  FileText,
  Printer
} from 'lucide-react';
import { NcrItem, NcrSeverity, AppState } from '../types';
import { NcrFormalDocumentModal } from './NcrFormalDocumentModal';
import { PrintReportModal } from './PrintReportModal';

interface NcrsTabProps {
  ncrs: NcrItem[];
  state?: AppState;
  onAddClick: () => void;
  onEditClick: (item: NcrItem) => void;
  onDeleteClick: (id: number) => void;
  onToggleStatus: (id: number) => void;
}

export const NcrsTab: React.FC<NcrsTabProps> = ({
  ncrs,
  state,
  onAddClick,
  onEditClick,
  onDeleteClick,
  onToggleStatus
}) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'OPEN' | 'CLOSED'>('ALL');
  const [severityFilter, setSeverityFilter] = useState('ALL');
  const [selectedNcrForDoc, setSelectedNcrForDoc] = useState<NcrItem | null>(null);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);

  const filteredItems = useMemo(() => {
    return ncrs.filter(item => {
      const matchSearch =
        item.code.toLowerCase().includes(search.toLowerCase()) ||
        item.location.toLowerCase().includes(search.toLowerCase()) ||
        (item.targetDept || '').toLowerCase().includes(search.toLowerCase()) ||
        item.desc.toLowerCase().includes(search.toLowerCase());

      const matchStatus =
        statusFilter === 'ALL' ||
        (statusFilter === 'OPEN' && item.status === 'مفتوح') ||
        (statusFilter === 'CLOSED' && item.status === 'مغلق');

      const matchSeverity =
        severityFilter === 'ALL' || item.severity.includes(severityFilter);

      return matchSearch && matchStatus && matchSeverity;
    });
  }, [ncrs, search, statusFilter, severityFilter]);

  const openCount = ncrs.filter(n => n.status === 'مفتوح').length;
  const closedCount = ncrs.filter(n => n.status === 'مغلق').length;

  const getSeverityBadge = (severity: NcrSeverity) => {
    if (severity.includes('حرج')) {
      return (
        <span className="inline-block px-2.5 py-0.5 rounded text-[11px] font-bold bg-rose-100 text-rose-800 border border-rose-300">
          {severity}
        </span>
      );
    }
    if (severity.includes('متوسط')) {
      return (
        <span className="inline-block px-2.5 py-0.5 rounded text-[11px] font-semibold bg-amber-100 text-amber-800 border border-amber-300">
          {severity}
        </span>
      );
    }
    return (
      <span className="inline-block px-2.5 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-700 border border-slate-300">
        {severity}
      </span>
    );
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-4 sm:p-6 mb-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-5 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-amber-900">
              سجل تقارير عدم المطابقة الميدانية (NCRs) والنموذج الرسمي
            </h2>
            <span className="text-xs bg-amber-50 text-amber-800 font-semibold px-2.5 py-0.5 rounded-full border border-amber-200">
              CAPA & RCA Ready
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            إدارة المخالفات الرقابية، تحليل السبب الجذري، متابعة خطط العمل التصحيحية، وعرض وطباعة استمارة الـ NCR المعتمدة
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setIsPrintModalOpen(true)}
            className="inline-flex items-center justify-center gap-2 px-3.5 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-sm font-semibold shadow-xs transition-all cursor-pointer whitespace-nowrap"
            title="طباعة وتصدير تقرير حالات عدم المطابقة والإنذارات المعتمد"
          >
            <Printer className="w-4 h-4 text-amber-400" />
            <span>طباعة تقرير الـ NCRs</span>
          </button>

          <button
            onClick={onAddClick}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-amber-700 hover:bg-amber-800 text-white rounded-lg text-sm font-semibold shadow-xs transition-all cursor-pointer whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span>تسجيل تقرير عدم مطابقة (NCR)</span>
          </button>
        </div>
      </div>

      {/* Quick Summary Pill Bar */}
      <div className="flex flex-wrap items-center gap-4 my-4 bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs">
        <div>
          <span className="text-slate-500">إجمالي التقارير:</span>
          <span className="font-bold text-slate-800 mr-1.5 tabular-nums">{ncrs.length}</span>
        </div>
        <div className="border-r border-slate-300 pr-4">
          <span className="text-slate-500">مفتوح وقيد المتابعة:</span>
          <span className="font-bold text-amber-700 mr-1.5 tabular-nums">{openCount}</span>
        </div>
        <div className="border-r border-slate-300 pr-4">
          <span className="text-slate-500">تم الإغلاق والاعتماد:</span>
          <span className="font-bold text-emerald-700 mr-1.5 tabular-nums">{closedCount}</span>
        </div>
        <div className="border-r border-slate-300 pr-4">
          <span className="text-slate-500">النماذج الرسمية:</span>
          <span className="font-semibold text-sky-800 mr-1.5">متاحة للطباعة الفردية الفورية لكل تقرير 🖨️</span>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-4 no-print">
        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="بحث بالكود، الموقع، الإدارة، أو الوصف..."
            className="w-full pr-9 pl-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-amber-600 focus:bg-white text-slate-800"
          />
        </div>

        {/* Status Filter */}
        <div>
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value as any)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-amber-600 text-slate-700"
          >
            <option value="ALL">جميع الحالات</option>
            <option value="OPEN">مفتوح فقط</option>
            <option value="CLOSED">مغلق ومستوفى فقط</option>
          </select>
        </div>

        {/* Severity Filter */}
        <div>
          <select
            value={severityFilter}
            onChange={e => setSeverityFilter(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-amber-600 text-slate-700"
          >
            <option value="ALL">جميع مستويات الخطورة</option>
            <option value="حرج">حرج (Critical)</option>
            <option value="متوسط">متوسط (Major)</option>
            <option value="بسيط">بسيط (Minor)</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-slate-200 mt-2">
        <table className="w-full text-right text-xs border-collapse">
          <thead>
            <tr className="bg-slate-100/80 text-slate-700 border-b border-slate-200 font-bold">
              <th className="py-3 px-3">كود NCR</th>
              <th className="py-3 px-3">الموقع / القسم</th>
              <th className="py-3 px-3 min-w-[200px]">وصف عدم المطابقة</th>
              <th className="py-3 px-3">مستوى الخطورة</th>
              <th className="py-3 px-3">المهلة المحددة</th>
              <th className="py-3 px-3 text-center">الحالة</th>
              <th className="py-3 px-3 text-center no-print">النموذج الرسمي</th>
              <th className="py-3 px-3 text-center no-print">الإجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 text-slate-800">
            {filteredItems.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-8 text-center text-slate-400">
                  <AlertTriangle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <span>لا توجد تقارير عدم مطابقة مطابقة لمعايير البحث</span>
                </td>
              </tr>
            ) : (
              filteredItems.map(item => (
                <tr key={item.id} className="hover:bg-amber-50/20 transition-colors">
                  <td className="py-3 px-3 font-bold text-slate-900 whitespace-nowrap tabular-nums">
                    {item.code}
                  </td>
                  <td className="py-3 px-3 font-semibold text-slate-800">
                    <div>{item.location}</div>
                    {item.targetDept && (
                      <span className="text-[10px] text-slate-400 font-normal block">{item.targetDept}</span>
                    )}
                  </td>
                  <td className="py-3 px-3 text-slate-600 leading-relaxed">
                    <p>{item.desc}</p>
                    {item.capaPlan && (
                      <p className="text-[10px] text-sky-800 font-medium mt-1">
                        خطة CAPA: {item.capaPlan}
                      </p>
                    )}
                  </td>
                  <td className="py-3 px-3 whitespace-nowrap">{getSeverityBadge(item.severity)}</td>
                  <td className="py-3 px-3 whitespace-nowrap text-slate-700 tabular-nums">
                    {item.deadline || 'غير محدد'}
                  </td>
                  <td className="py-3 px-3 text-center whitespace-nowrap">
                    {item.status === 'مغلق' ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        مغلق
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-rose-50 text-rose-800 border border-rose-200">
                        <Clock className="w-3 h-3 text-rose-600" />
                        مفتوح
                      </span>
                    )}
                  </td>

                  {/* Form Document Button */}
                  <td className="py-3 px-3 text-center whitespace-nowrap no-print">
                    <button
                      onClick={() => setSelectedNcrForDoc(item)}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-slate-100 hover:bg-sky-50 text-sky-800 rounded font-semibold text-[11px] border border-slate-200 hover:border-sky-300 transition-colors cursor-pointer"
                      title="عرض واستخراج النموذج الرسمي للتقرير وطباعته"
                    >
                      <FileText className="w-3.5 h-3.5 text-sky-700" />
                      <span>استمارة NCR</span>
                    </button>
                  </td>

                  {/* Actions */}
                  <td className="py-3 px-3 text-center whitespace-nowrap no-print">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => onToggleStatus(item.id)}
                        className={`p-1.5 rounded-md transition-colors ${
                          item.status === 'مفتوح'
                            ? 'text-emerald-700 hover:bg-emerald-50'
                            : 'text-amber-700 hover:bg-amber-50'
                        }`}
                        title={item.status === 'مفتوح' ? 'إغلاق التقرير واستيفاؤه' : 'إعادة فتح التقرير'}
                      >
                        {item.status === 'مفتوح' ? (
                          <CheckSquare className="w-4 h-4" />
                        ) : (
                          <RotateCcw className="w-4 h-4" />
                        )}
                      </button>
                      <button
                        onClick={() => onEditClick(item)}
                        className="p-1.5 text-slate-600 hover:text-amber-700 hover:bg-slate-100 rounded-md transition-colors"
                        title="تعديل السجل"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onDeleteClick(item.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                        title="حذف السجل"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Official Single NCR Printable Document Modal */}
      <NcrFormalDocumentModal
        isOpen={selectedNcrForDoc !== null}
        onClose={() => setSelectedNcrForDoc(null)}
        ncr={selectedNcrForDoc}
      />

      {state && (
        <PrintReportModal
          isOpen={isPrintModalOpen}
          onClose={() => setIsPrintModalOpen(false)}
          reportType="ncrs"
          state={state}
          customTitle="تقرير حالات عدم المطابقة والإنذارات المعتمد (NCRs Report)"
        />
      )}

    </div>
  );
};
