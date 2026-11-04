import React from 'react';
import { 
  Plus, 
  Award, 
  TrendingUp, 
  CheckCircle, 
  Edit3, 
  Trash2, 
  Target 
} from 'lucide-react';
import { KpiItem } from '../types';

interface KpisTabProps {
  kpis: KpiItem[];
  onAddClick: () => void;
  onEditClick: (item: KpiItem) => void;
  onDeleteClick: (inspector: string) => void;
}

export const KpisTab: React.FC<KpisTabProps> = ({
  kpis,
  onAddClick,
  onEditClick,
  onDeleteClick
}) => {
  const getScoreBadge = (score: string) => {
    switch (score) {
      case 'ممتاز':
        return (
          <span className="inline-block px-2.5 py-1 rounded text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
            {score}
          </span>
        );
      case 'جيد جداً':
        return (
          <span className="inline-block px-2.5 py-1 rounded text-xs font-semibold bg-sky-100 text-sky-800 border border-sky-300">
            {score}
          </span>
        );
      default:
        return (
          <span className="inline-block px-2.5 py-1 rounded text-xs font-medium bg-slate-100 text-slate-800 border border-slate-300">
            {score}
          </span>
        );
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-4 sm:p-6 mb-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-5 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-sky-900">
              مصفوفة تقييم أداء مفتشي السلامة والصحة المهنية (KPIs)
            </h2>
            <span className="text-xs bg-sky-50 text-sky-700 font-semibold px-2.5 py-0.5 rounded-full border border-sky-200">
              Quarterly EHS Matrix
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            مؤشرات أداء الجولات الميدانية، سرعة الاستجابة لمعالجة عدم المطابقة، ومعدل الامتثال التراكمي
          </p>
        </div>

        <button
          onClick={onAddClick}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-sky-700 hover:bg-sky-800 text-white rounded-lg text-sm font-semibold shadow-xs transition-all cursor-pointer whitespace-nowrap"
        >
          <Plus className="w-4 h-4" />
          <span>إضافة / تحديث تقييم</span>
        </button>
      </div>

      {/* Cards summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-4">
        <div className="p-4 bg-sky-50/50 rounded-xl border border-sky-100 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-sky-600 text-white flex items-center justify-center">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">المفتش الأعلى إنجازاً</p>
            <p className="text-sm font-bold text-sky-950 mt-0.5">
              {kpis[0]?.inspector || 'مفتش السلامة الميداني'}
            </p>
          </div>
        </div>

        <div className="p-4 bg-sky-50/50 rounded-xl border border-sky-100 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-sky-600 text-white flex items-center justify-center">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">إجمالي الجولات المنجزة</p>
            <p className="text-sm font-bold text-sky-950 mt-0.5 tabular-nums">
              {kpis.reduce((acc, curr) => acc + (curr.inspectionsDone || 0), 0)} جولة ميدانية
            </p>
          </div>
        </div>

        <div className="p-4 bg-emerald-50/50 rounded-xl border border-emerald-100 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-600 text-white flex items-center justify-center">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">متوسط زمن الاستجابة</p>
            <p className="text-sm font-bold text-emerald-950 mt-0.5">
              1.4 يوم عمل
            </p>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-slate-200 mt-2">
        <table className="w-full text-right text-xs border-collapse">
          <thead>
            <tr className="bg-slate-100/80 text-slate-700 border-b border-slate-200 font-bold">
              <th className="py-3 px-3">اسم المفتش / العضو</th>
              <th className="py-3 px-3 text-center">عدد الجولات المنجزة</th>
              <th className="py-3 px-3 text-center">تقارير الـ NCR المرفوعة</th>
              <th className="py-3 px-3 text-center">زمن الاستجابة والمتابعة</th>
              <th className="py-3 px-3 text-center">نسبة الامتثال الكلية</th>
              <th className="py-3 px-3 text-center">التقييم التراكمي</th>
              <th className="py-3 px-3 text-center no-print">الإجراء</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 text-slate-800">
            {kpis.map((item, idx) => (
              <tr key={idx} className="hover:bg-sky-50/20 transition-colors">
                <td className="py-3 px-3 font-bold text-slate-900 whitespace-nowrap">
                  {item.inspector}
                </td>
                <td className="py-3 px-3 text-center tabular-nums font-semibold text-sky-800">
                  {item.inspectionsDone} جولة
                </td>
                <td className="py-3 px-3 text-center tabular-nums text-slate-700">
                  {item.ncrsRaised} تقرير
                </td>
                <td className="py-3 px-3 text-center text-slate-600">
                  {item.responseTime}
                </td>
                <td className="py-3 px-3 text-center tabular-nums">
                  <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    {item.compliance}
                  </span>
                </td>
                <td className="py-3 px-3 text-center whitespace-nowrap">
                  {getScoreBadge(item.score)}
                </td>
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
                      onClick={() => onDeleteClick(item.inspector)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                      title="حذف السجل"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
};
