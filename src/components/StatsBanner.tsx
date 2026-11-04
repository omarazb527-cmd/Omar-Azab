import React from 'react';
import { 
  ClipboardCheck, 
  AlertTriangle, 
  HeartPulse, 
  Award, 
  CheckCircle2 
} from 'lucide-react';
import { AppState } from '../types';

interface StatsBannerProps {
  state: AppState;
}

export const StatsBanner: React.FC<StatsBannerProps> = ({ state }) => {
  const totalInspections = state.inspections.length;
  const compliantInspections = state.inspections.filter(i => i.status === 'مكتمل وممتثل').length;
  
  const totalNcrs = state.ncrs.length;
  const openNcrs = state.ncrs.filter(n => n.status === 'مفتوح').length;
  const criticalNcrs = state.ncrs.filter(n => n.status === 'مفتوح' && n.severity.includes('حرج')).length;

  const totalIncidents = state.incidents.length;
  const totalLostDays = state.incidents.reduce((sum, item) => sum + (item.lostDays || 0), 0);
  const ltiIncidents = state.incidents.filter(i => i.type.includes('هدر وقت')).length;

  // Average KPI compliance
  const avgCompliance = state.kpis.length > 0
    ? Math.round(
        state.kpis.reduce((acc, curr) => acc + (parseFloat(curr.compliance) || 90), 0) / state.kpis.length
      )
    : 95;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 my-5 no-print">
      
      {/* Stat 1: Inspections */}
      <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-slate-500">جولات المرور المنجزة</p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold text-sky-800 tabular-nums">{totalInspections}</span>
            <span className="text-xs text-emerald-600 font-medium">({compliantInspections} ممتثلة)</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">سجل جولات المرور الميداني</p>
        </div>
        <div className="w-10 h-10 rounded-lg bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-600">
          <ClipboardCheck className="w-5 h-5" />
        </div>
      </div>

      {/* Stat 2: NCRs */}
      <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-slate-500">تقارير عدم المطابقة (NCRs)</p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold text-amber-700 tabular-nums">{openNcrs}</span>
            <span className="text-xs text-slate-500 font-normal">من أصل {totalNcrs}</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            {criticalNcrs > 0 ? (
              <span className="text-rose-600 font-medium">{criticalNcrs} تقرير حرج مفتوح</span>
            ) : (
              <span className="text-emerald-600 font-medium">لا توجد حالات حرجة مفتوحة</span>
            )}
          </p>
        </div>
        <div className="w-10 h-10 rounded-lg bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-700">
          <AlertTriangle className="w-5 h-5" />
        </div>
      </div>

      {/* Stat 3: Incidents & Lost Days */}
      <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-slate-500">حوادث وإصابات العمل</p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold text-rose-700 tabular-nums">{totalIncidents}</span>
            <span className="text-xs text-slate-500">({totalLostDays} يوم غياب)</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            {ltiIncidents === 0 ? 'معدل LTI: صفر إصابات هدر' : `${ltiIncidents} إصابة هدر وقت`}
          </p>
        </div>
        <div className="w-10 h-10 rounded-lg bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-700">
          <HeartPulse className="w-5 h-5" />
        </div>
      </div>

      {/* Stat 4: Zero Accidents & Compliance */}
      <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-slate-500">مؤشر الامتثال والسلامة</p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold text-emerald-700 tabular-nums">{avgCompliance}%</span>
            <span className="text-xs text-emerald-600 font-medium">ممتاز</span>
          </div>
          <p className="text-[11px] text-emerald-700 mt-1 flex items-center gap-1 font-medium">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            <span>بيئة عمل آمنة (Zero Harm)</span>
          </p>
        </div>
        <div className="w-10 h-10 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-700">
          <Award className="w-5 h-5" />
        </div>
      </div>

    </div>
  );
};
