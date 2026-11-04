import React, { useState, useMemo } from 'react';
import { 
  Plus, 
  Search, 
  HeartPulse, 
  ShieldAlert, 
  Trash2, 
  Edit3, 
  AlertTriangle,
  FileSpreadsheet,
  Printer
} from 'lucide-react';
import { IncidentItem, IncidentCategory, AppState } from '../types';
import { PrintReportModal } from './PrintReportModal';

interface IncidentsTabProps {
  incidents: IncidentItem[];
  state?: AppState;
  onAddClick: () => void;
  onEditClick: (item: IncidentItem) => void;
  onDeleteClick: (id: number) => void;
}

export const IncidentsTab: React.FC<IncidentsTabProps> = ({
  incidents,
  state,
  onAddClick,
  onEditClick,
  onDeleteClick
}) => {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [shiftFilter, setShiftFilter] = useState('ALL');
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);

  const filteredItems = useMemo(() => {
    return incidents.filter(item => {
      const matchSearch =
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.dept.toLowerCase().includes(search.toLowerCase()) ||
        item.location.toLowerCase().includes(search.toLowerCase()) ||
        item.desc.toLowerCase().includes(search.toLowerCase());

      const matchType = typeFilter === 'ALL' || item.type === typeFilter;
      const matchShift =
        shiftFilter === 'ALL' ||
        (shiftFilter === 'DAY' && item.shift.includes('نهاري')) ||
        (shiftFilter === 'NIGHT' && item.shift.includes('ليلي'));

      return matchSearch && matchType && matchShift;
    });
  }, [incidents, search, typeFilter, shiftFilter]);

  const totalLostDays = incidents.reduce((sum, i) => sum + (i.lostDays || 0), 0);
  const sharpsCount = incidents.filter(i => i.type.includes('وخز إبرة')).length;
  const ltiCount = incidents.filter(i => i.type.includes('هدر وقت')).length;
  const nearMissCount = incidents.filter(i => i.type.includes('حادث وشيك')).length;

  const getTypeBadge = (type: IncidentCategory) => {
    if (type.includes('هدر وقت')) {
      return (
        <span className="inline-block px-2 py-0.5 rounded text-[11px] font-bold bg-rose-100 text-rose-800 border border-rose-300">
          {type}
        </span>
      );
    }
    if (type.includes('وخز إبرة')) {
      return (
        <span className="inline-block px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-100 text-amber-800 border border-amber-300">
          {type}
        </span>
      );
    }
    if (type.includes('حادث وشيك')) {
      return (
        <span className="inline-block px-2 py-0.5 rounded text-[11px] font-semibold bg-sky-100 text-sky-800 border border-sky-300">
          {type}
        </span>
      );
    }
    return (
      <span className="inline-block px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-100 text-emerald-800 border border-emerald-300">
        {type}
      </span>
    );
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-4 sm:p-6 mb-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-5 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-rose-900">
              سجل حوادث وإصابات العمل (Zero Accidents Log)
            </h2>
            <span className="text-xs bg-rose-50 text-rose-700 font-semibold px-2.5 py-0.5 rounded-full border border-rose-200">
              GAHAR & OSHA Standard
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            توثيق الإصابات المهنية، التحقيق في الأسباب الجذرية، وتحديد التدابير التصحيحية الفورية
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setIsPrintModalOpen(true)}
            className="inline-flex items-center justify-center gap-2 px-3.5 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-sm font-semibold shadow-xs transition-all cursor-pointer whitespace-nowrap"
            title="طباعة وتصدير تقرير حوادث وإصابات العمل المستقل (Zero Harm Certified)"
          >
            <Printer className="w-4 h-4 text-sky-400" />
            <span>طباعة تقرير الحوادث</span>
          </button>

          <button
            onClick={onAddClick}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-rose-700 hover:bg-rose-800 text-white rounded-lg text-sm font-semibold shadow-xs transition-all cursor-pointer whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span>تسجيل حادث / إصابة عمل</span>
          </button>
        </div>
      </div>

      {/* Quick Summary Pill Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-4 bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs">
        <div>
          <span className="text-slate-500">إجمالي الحالات:</span>
          <span className="font-bold text-slate-800 mr-1.5 tabular-nums">{incidents.length}</span>
        </div>
        <div>
          <span className="text-slate-500">أيام الغياب المهدورة:</span>
          <span className="font-bold text-rose-700 mr-1.5 tabular-nums">{totalLostDays} يوم</span>
        </div>
        <div>
          <span className="text-slate-500">وخز الأدوات الحادة:</span>
          <span className="font-bold text-amber-700 mr-1.5 tabular-nums">{sharpsCount}</span>
        </div>
        <div>
          <span className="text-slate-500">حوادث وشيكة (Near Miss):</span>
          <span className="font-bold text-sky-700 mr-1.5 tabular-nums">{nearMissCount}</span>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-4 no-print">
        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="بحث بالاسم، الإدارة، الموقع، أو التفاصيل..."
            className="w-full pr-9 pl-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-rose-600 focus:bg-white text-slate-800"
          />
        </div>

        {/* Injury Type Filter */}
        <div>
          <select
            value={typeFilter}
            onChange={e => setTypeFilter(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-rose-600 text-slate-700"
          >
            <option value="ALL">جميع تصنيفات الإصابات</option>
            <option value="إسعافات أولية (First Aid)">إسعافات أولية (First Aid)</option>
            <option value="حادث وشيك (Near Miss)">حادث وشيك (Near Miss)</option>
            <option value="إصابة عمل مع هدر وقت (Lost Time Injury)">إصابة عمل مع هدر وقت (LTI)</option>
            <option value="وخز إبرة وأدوات حادة (Sharps Injury)">وخز إبرة وأدوات حادة (Sharps)</option>
          </select>
        </div>

        {/* Shift Filter */}
        <div>
          <select
            value={shiftFilter}
            onChange={e => setShiftFilter(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-rose-600 text-slate-700"
          >
            <option value="ALL">جميع الورديات</option>
            <option value="DAY">وردية نهاري (08:00 AM - 08:00 PM)</option>
            <option value="NIGHT">وردية ليلي (08:00 PM - 08:00 AM)</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-slate-200 mt-2">
        <table className="w-full text-right text-xs border-collapse">
          <thead>
            <tr className="bg-slate-100/80 text-slate-700 border-b border-slate-200 font-bold">
              <th className="py-3 px-3">التاريخ والساعة</th>
              <th className="py-3 px-3">الوردية</th>
              <th className="py-3 px-3">اسم المصاب</th>
              <th className="py-3 px-3">الإدارة / الوظيفة</th>
              <th className="py-3 px-3">الموقع الدقيق</th>
              <th className="py-3 px-3">نوع الإصابة</th>
              <th className="py-3 px-3 text-center">أيام الغياب</th>
              <th className="py-3 px-3 min-w-[220px]">ملابسات الحادث والإجراء التصحيحي</th>
              <th className="py-3 px-3 text-center no-print">الإجراء</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 text-slate-800">
            {filteredItems.length === 0 ? (
              <tr>
                <td colSpan={9} className="py-8 text-center text-slate-400">
                  <ShieldAlert className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <span>لا توجد حوادث مسجلة مطابقة لمعايير البحث</span>
                </td>
              </tr>
            ) : (
              filteredItems.map(item => (
                <tr key={item.id} className="hover:bg-rose-50/20 transition-colors">
                  <td className="py-3 px-3 font-semibold text-slate-900 whitespace-nowrap tabular-nums">
                    {item.datetime}
                  </td>
                  <td className="py-3 px-3 whitespace-nowrap">
                    <span className="text-[11px] text-slate-600">
                      {item.shift.includes('نهاري') ? 'نهار' : 'ليل'}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-bold text-slate-900 whitespace-nowrap">{item.name}</td>
                  <td className="py-3 px-3 text-slate-700">{item.dept}</td>
                  <td className="py-3 px-3 text-slate-800 font-medium">{item.location}</td>
                  <td className="py-3 px-3 whitespace-nowrap">{getTypeBadge(item.type)}</td>
                  <td className="py-3 px-3 text-center whitespace-nowrap tabular-nums">
                    {item.lostDays > 0 ? (
                      <span className="font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded">
                        {item.lostDays} يوم
                      </span>
                    ) : (
                      <span className="text-emerald-700 font-medium">0</span>
                    )}
                  </td>
                  <td className="py-3 px-3 text-slate-600 leading-relaxed">{item.desc}</td>
                  <td className="py-3 px-3 text-center whitespace-nowrap no-print">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => onEditClick(item)}
                        className="p-1.5 text-slate-600 hover:text-rose-700 hover:bg-slate-100 rounded-md transition-colors"
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

      {state && (
        <PrintReportModal
          isOpen={isPrintModalOpen}
          onClose={() => setIsPrintModalOpen(false)}
          reportType="incidents"
          state={state}
          customTitle="تقرير حوادث وإصابات العمل المعتمد (Zero Harm Certified)"
        />
      )}

    </div>
  );
};
