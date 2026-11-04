import React, { useState, useMemo } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Trash2, 
  Edit3, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  FileText,
  Printer
} from 'lucide-react';
import { InspectionItem, AppState } from '../types';
import { PrintReportModal } from './PrintReportModal';

interface InspectionsTabProps {
  inspections: InspectionItem[];
  state?: AppState;
  onAddClick: () => void;
  onEditClick: (item: InspectionItem) => void;
  onDeleteClick: (id: number) => void;
  onStatusChange: (id: number, newStatus: InspectionItem['status']) => void;
}

export const InspectionsTab: React.FC<InspectionsTabProps> = ({
  inspections,
  state,
  onAddClick,
  onEditClick,
  onDeleteClick,
  onStatusChange
}) => {
  const [search, setSearch] = useState('');
  const [shiftFilter, setShiftFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);

  const filteredItems = useMemo(() => {
    return inspections.filter(item => {
      const matchSearch =
        item.location.toLowerCase().includes(search.toLowerCase()) ||
        item.inspector.toLowerCase().includes(search.toLowerCase()) ||
        item.notes.toLowerCase().includes(search.toLowerCase()) ||
        item.type.toLowerCase().includes(search.toLowerCase());

      const matchShift =
        shiftFilter === 'ALL' ||
        (shiftFilter === 'DAY' && item.shift.includes('نهاري')) ||
        (shiftFilter === 'NIGHT' && item.shift.includes('ليلي'));

      const matchStatus =
        statusFilter === 'ALL' || item.status === statusFilter;

      const matchType =
        typeFilter === 'ALL' || item.type.includes(typeFilter);

      return matchSearch && matchShift && matchStatus && matchType;
    });
  }, [inspections, search, shiftFilter, statusFilter, typeFilter]);

  const getStatusBadge = (status: InspectionItem['status']) => {
    switch (status) {
      case 'مكتمل وممتثل':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
            <CheckCircle className="w-3 h-3 text-emerald-600" />
            {status}
          </span>
        );
      case 'تم الرصد وتوجد ملاحظات':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
            <AlertCircle className="w-3 h-3 text-amber-600" />
            {status}
          </span>
        );
      case 'قيد المتابعة والتنفيذ':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-sky-50 text-sky-800 border border-sky-200">
            <Clock className="w-3 h-3 text-sky-600" />
            {status}
          </span>
        );
      default:
        return <span>{status}</span>;
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-4 sm:p-6 mb-6">
      
      {/* Title & Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-5 border-b border-slate-100">
        <div>
          <h2 className="text-lg font-bold text-slate-950">
            سجل جولات المرور الميداني (Inspection Log)
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            توثيق الجولات الميدانية، فحص بنود بيئة الرعاية، أنظمة السلامة من الحريق، والمواد الخطرة
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setIsPrintModalOpen(true)}
            className="inline-flex items-center justify-center gap-2 px-3.5 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-sm font-semibold shadow-xs transition-all cursor-pointer whitespace-nowrap"
            title="طباعة وتصدير سجل جولات المرور الميداني المعتمد (Inspection Log)"
          >
            <Printer className="w-4 h-4 text-sky-400" />
            <span>طباعة سجل الجولات</span>
          </button>

          <button
            onClick={onAddClick}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-sm font-semibold shadow-xs transition-all cursor-pointer whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span>إضافة جولة تفتيش جديدة</span>
          </button>
        </div>
      </div>

      {/* Filters & Search Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 my-4 no-print">
        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="بحث بالقسم، المفتش، أو الملاحظة..."
            className="w-full pr-9 pl-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-sky-600 focus:bg-white text-slate-800"
          />
        </div>

        {/* Shift Filter */}
        <div>
          <select
            value={shiftFilter}
            onChange={e => setShiftFilter(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-sky-600 text-slate-700"
          >
            <option value="ALL">جميع الورديات (12 ساعة)</option>
            <option value="DAY">وردية نهاري (08:00 AM - 08:00 PM)</option>
            <option value="NIGHT">وردية ليلي (08:00 PM - 08:00 AM)</option>
          </select>
        </div>

        {/* Status Filter */}
        <div>
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-sky-600 text-slate-700"
          >
            <option value="ALL">جميع حالات الجولات</option>
            <option value="مكتمل وممتثل">مكتمل وممتثل</option>
            <option value="تم الرصد وتوجد ملاحظات">تم الرصد وتوجد ملاحظات</option>
            <option value="قيد المتابعة والتنفيذ">قيد المتابعة والتنفيذ</option>
          </select>
        </div>

        {/* Type Filter */}
        <div>
          <select
            value={typeFilter}
            onChange={e => setTypeFilter(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-sky-600 text-slate-700"
          >
            <option value="ALL">جميع أنواع الجولات</option>
            <option value="بيئة الرعاية">مرور بيئة الرعاية (EOC)</option>
            <option value="الحريق">فحص السلامة من الحريق</option>
            <option value="المواد الخطرة">إدارة المواد الخطرة والنفايات</option>
            <option value="الإنشائية">فحص السلامة الإنشائية ومواقع العمل</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-slate-200 mt-2">
        <table className="w-full text-right text-xs border-collapse">
          <thead>
            <tr className="bg-slate-100/80 text-slate-700 border-b border-slate-200 font-bold">
              <th className="py-3 px-3">التاريخ</th>
              <th className="py-3 px-3">الوردية</th>
              <th className="py-3 px-3">الموقع / القسم</th>
              <th className="py-3 px-3">المفتش المسؤول</th>
              <th className="py-3 px-3">نوع الجولة</th>
              <th className="py-3 px-3">حالة المرور</th>
              <th className="py-3 px-3 min-w-[200px]">الملاحظات والتوصيات</th>
              <th className="py-3 px-3 text-center no-print">الإجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 text-slate-800">
            {filteredItems.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-8 text-center text-slate-400">
                  <FileText className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <span>لا توجد جولات تفتيش مطابقة لمعايير البحث الحالية</span>
                </td>
              </tr>
            ) : (
              filteredItems.map(item => (
                <tr key={item.id} className="hover:bg-sky-50/30 transition-colors">
                  <td className="py-3 px-3 font-semibold text-slate-900 whitespace-nowrap tabular-nums">
                    {item.date}
                  </td>
                  <td className="py-3 px-3 whitespace-nowrap">
                    <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-medium ${
                      item.shift.includes('نهاري')
                        ? 'bg-sky-50 text-sky-800 border border-sky-200'
                        : 'bg-indigo-50 text-indigo-800 border border-indigo-200'
                    }`}>
                      {item.shift.includes('نهاري') ? 'نهار (12س)' : 'ليل (12س)'}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-medium text-slate-900">{item.location}</td>
                  <td className="py-3 px-3 text-slate-700 whitespace-nowrap">{item.inspector}</td>
                  <td className="py-3 px-3 text-slate-600 whitespace-nowrap">{item.type}</td>
                  <td className="py-3 px-3 whitespace-nowrap">
                    <div className="flex items-center gap-1.5">
                      {getStatusBadge(item.status)}
                      <select
                        aria-label="تغيير حالة المرور"
                        value={item.status}
                        onChange={e => onStatusChange(item.id, e.target.value as InspectionItem['status'])}
                        className="no-print text-[10px] bg-slate-50 border border-slate-200 rounded px-1 py-0.5 text-slate-500 cursor-pointer hover:bg-slate-100"
                        title="تغيير سريع لحالة الجولة"
                      >
                        <option value="مكتمل وممتثل">مكتمل وممتثل</option>
                        <option value="تم الرصد وتوجد ملاحظات">توجد ملاحظات</option>
                        <option value="قيد المتابعة والتنفيذ">قيد المتابعة</option>
                      </select>
                    </div>
                  </td>
                  <td className="py-3 px-3 text-slate-600 leading-relaxed">{item.notes || '—'}</td>
                  <td className="py-3 px-3 text-center whitespace-nowrap no-print">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => onEditClick(item)}
                        className="p-1.5 text-slate-600 hover:text-sky-700 hover:bg-slate-100 rounded-md transition-colors"
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

      <div className="flex items-center justify-between text-xs text-slate-500 mt-3 pt-2">
        <span>إجمالي النتائج المعروضة: {filteredItems.length} جولة تفتيش</span>
        <span>مرجعية التفتيش: جدول التفتيش الأسبوعي المعتمد</span>
      </div>

      {state && (
        <PrintReportModal
          isOpen={isPrintModalOpen}
          onClose={() => setIsPrintModalOpen(false)}
          reportType="inspections"
          state={state}
          customTitle="تقرير سجل جولات المرور الميداني الأسبوعي (Inspection Log)"
        />
      )}

    </div>
  );
};
