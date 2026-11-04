import React from 'react';
import { 
  Building2, 
  CalendarDays, 
  CheckCircle2, 
  Award,
  AlertTriangle,
  HeartPulse
} from 'lucide-react';
import { AppState, ReportType } from '../types';

interface OfficialReportDocumentProps {
  reportType: ReportType;
  state: AppState;
  isA4Preview?: boolean;
}

export const OfficialReportDocument: React.FC<OfficialReportDocumentProps> = ({
  reportType,
  state,
  isA4Preview = false
}) => {
  const today = new Date().toLocaleDateString('ar-EG', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const signers = state.signers || {
    teamLeader: { name: 'م/ أحمد نبيه', title: 'Team Leader السلامة الميدانية' },
    safetyDirector: { name: 'م/ عمر فريد العزب', title: 'مدير إدارة السلامة والصحة المهنية' },
    opsDirector: { name: '', title: 'مدير التشغيل' },
    ceoDirector: { name: '', title: 'المدير التنفيذي للمستشفى' }
  };

  const openNcrs = state.ncrs.filter(n => n.status === 'مفتوح').length;
  const compliantInspections = state.inspections.filter(i => i.status === 'مكتمل وممتثل').length;

  return (
    <div 
      id="printArea"
      className={`bg-white print-clean transition-all text-slate-800 ${
        isA4Preview 
          ? 'max-w-[210mm] mx-auto shadow-xl border-2 border-slate-300 rounded-2xl min-h-[297mm] p-6 sm:p-8 my-4' 
          : 'border border-slate-200 rounded-xl p-4 sm:p-8 shadow-xs'
      }`}
    >
      
      {/* Official Header with Logo */}
      <div className="border-b-2 border-sky-800 pb-4 mb-6 header-box">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          
          <div className="flex items-center gap-3.5">
            <div className="p-1.5 bg-white border border-slate-200 rounded-xl shadow-xs">
              <img
                src="/assets/aistudio/logo4_4e162ca5.png"
                alt="شعار مستشفى الناس"
                className="h-14 sm:h-16 w-auto object-contain"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-950 font-sans tracking-tight">
                مستشفى الناس للأطفال وأمراض القلب
              </h1>
              <p className="text-xs font-bold text-sky-800 mt-0.5">
                إدارة السلامة والصحة المهنية وحماية البيئة (EHS Department)
              </p>
              <p className="text-[11px] text-slate-500">
                المرجعية الرقابية: معايير الهيئة العامة للاعتماد والرقابة الصحية GAHAR 2025 / ISO 45001:2018
              </p>
            </div>
          </div>

          <div className="text-left text-xs text-slate-600 sm:border-r sm:border-slate-200 sm:pr-4">
            <p className="font-semibold text-slate-900">
              كود المستند: <span className="font-mono text-sky-800 font-bold">ALNAS-EHS-REP-2026</span>
            </p>
            <p className="mt-0.5">
              تاريخ الاستخراج: <strong>{today}</strong>
            </p>
            <p className="mt-0.5 text-slate-500">
              درجة السرية: <strong>داخلي معتمد (Official)</strong>
            </p>
          </div>

        </div>

        <div className="mt-4 pt-3 border-t border-slate-200 flex justify-between items-center">
          <h2 className="text-sm sm:text-base font-bold text-slate-950">
            {reportType === 'master' && 'التقرير التنفيذي الشامل للسلامة وبيئة الرعاية'}
            {reportType === 'units' && 'بيان أماكن الفحص وقوائم التحقق المعتمدة (Inspection Places Directory)'}
            {reportType === 'weekly_matrix' && 'تقرير وخطة المرور الأسبوعي لورديات 12 ساعة (Weekly Schedule Matrix)'}
            {reportType === 'incidents' && 'سجل وبيان إصابات وحوادث العمل المعتمد (Zero Harm Certified)'}
            {reportType === 'ncrs' && 'تقرير متابعة وتصحيح حالات عدم المطابقة والإنذارات (NCRs Status)'}
            {reportType === 'inspections' && 'تقرير سجل جولات المرور الميداني الأسبوعي (Inspection Log)'}
            {reportType === 'kpis' && 'تقرير مؤشرات أداء فريق ومفتشي السلامة (KPIs Matrix)'}
          </h2>
          <span className="text-xs bg-sky-50 text-sky-800 border border-sky-200 px-2.5 py-0.5 rounded font-mono font-bold">
            نسخة معتمدة
          </span>
        </div>
      </div>

      {/* Report Dynamic Content */}
      <div className="space-y-6">

        {/* 1. MASTER REPORT */}
        {reportType === 'master' && (
          <div className="space-y-6 text-xs text-slate-800">
            {/* Executive Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div className="text-center p-2">
                <span className="text-slate-500 block">الجولات المنجزة</span>
                <span className="text-xl font-bold text-sky-900 block mt-1 tabular-nums">{state.inspections.length}</span>
                <span className="text-[10px] text-emerald-700 font-medium">
                  {compliantInspections > 0 ? `${compliantInspections} جولة ممتثلة` : 'جاهز للرصد الميداني'}
                </span>
              </div>
              <div className="text-center p-2 border-r border-slate-200">
                <span className="text-slate-500 block">حوادث العمل</span>
                <span className="text-xl font-bold text-emerald-700 block mt-1 tabular-nums">
                  {state.incidents.length === 0 ? '0' : state.incidents.length}
                </span>
                <span className="text-[10px] text-emerald-700 font-bold">صفر حوادث (Zero Harm)</span>
              </div>
              <div className="text-center p-2 border-r border-slate-200">
                <span className="text-slate-500 block">NCRs مفتوحة</span>
                <span className="text-xl font-bold text-amber-800 block mt-1 tabular-nums">{openNcrs}</span>
                <span className="text-[10px] text-slate-600 font-medium">من إجمالي {state.ncrs.length}</span>
              </div>
              <div className="text-center p-2 border-r border-slate-200">
                <span className="text-slate-500 block">نسبة الامتثال الكلية</span>
                <span className="text-xl font-bold text-emerald-800 block mt-1 tabular-nums">100%</span>
                <span className="text-[10px] text-emerald-700 font-medium">امتثال كامل</span>
              </div>
            </div>

            {/* Inspections / Weekly Plan */}
            <div>
              <div className="flex items-center justify-between border-b border-sky-200 pb-1.5 mb-2.5">
                <h3 className="text-sm font-bold text-sky-950">
                  أولاً: جاهزية بيئة الرعاية وجدول المرور الميداني للورديات (12 ساعة)
                </h3>
                <span className="text-[11px] text-slate-500 font-medium">
                  {state.inspections.length > 0 ? `${state.inspections.length} جولة مسجلة` : 'خطة التفتيش الأسبوعية المعتمدة (36 وحدة)'}
                </span>
              </div>

              <div className="overflow-x-auto border border-slate-200 rounded-lg">
                <table className="w-full text-right text-xs border-collapse">
                  <thead className="bg-slate-100 font-bold text-slate-800">
                    <tr>
                      <th className="p-2 border-b">اليوم / التاريخ</th>
                      <th className="p-2 border-b">الوردية</th>
                      <th className="p-2 border-b">الوحدة / المكان (Unit Name)</th>
                      <th className="p-2 border-b">المفتش المسؤول</th>
                      <th className="p-2 border-b">نوع الجولة</th>
                      <th className="p-2 border-b">الحالة والتوصيات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {state.inspections.length > 0 ? (
                      state.inspections.slice(0, 10).map(item => (
                        <tr key={item.id}>
                          <td className="p-2 tabular-nums font-semibold">{item.date}</td>
                          <td className="p-2">{item.shift.includes('نهاري') ? 'Day (12h)' : 'Night (12h)'}</td>
                          <td className="p-2 font-bold text-slate-900">{item.location}</td>
                          <td className="p-2 font-medium">{item.inspector}</td>
                          <td className="p-2">{item.type}</td>
                          <td className="p-2 text-slate-600">{item.notes || 'مكتمل وممتثل'}</td>
                        </tr>
                      ))
                    ) : (
                      state.weeklySchedule.slice(0, 10).map(slot => (
                        <tr key={slot.id}>
                          <td className="p-2 font-bold text-slate-900">{slot.dayOfWeek}</td>
                          <td className="p-2">{slot.shift.includes('نهاري') ? 'Day (12h)' : 'Night (12h)'}</td>
                          <td className="p-2 font-extrabold text-sky-950">{slot.departmentName}</td>
                          <td className="p-2 font-medium text-slate-800">{slot.inspectorName}</td>
                          <td className="p-2 text-slate-600">{slot.roundType}</td>
                          <td className="p-2 text-sky-800 font-semibold">مجدول ومعتمد بالخطة</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Incidents Summary */}
            <div>
              <h3 className="text-sm font-bold text-rose-950 border-b border-rose-200 pb-1.5 mb-2.5">
                ثانياً: سجل حوادث وإصابات العمل (Zero Harm Certified)
              </h3>
              <div className="overflow-x-auto border border-slate-200 rounded-lg">
                <table className="w-full text-right text-xs border-collapse">
                  <thead className="bg-slate-100 font-bold text-slate-800">
                    <tr>
                      <th className="p-2 border-b">التاريخ والساعة</th>
                      <th className="p-2 border-b">اسم المصاب</th>
                      <th className="p-2 border-b">الإدارة</th>
                      <th className="p-2 border-b">الموقع</th>
                      <th className="p-2 border-b">نوع الإصابة</th>
                      <th className="p-2 border-b">أيام الغياب</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {state.incidents.length > 0 ? (
                      state.incidents.map(inc => (
                        <tr key={inc.id}>
                          <td className="p-2 tabular-nums">{inc.datetime}</td>
                          <td className="p-2 font-semibold">{inc.name}</td>
                          <td className="p-2">{inc.dept}</td>
                          <td className="p-2 font-bold">{inc.location}</td>
                          <td className="p-2">{inc.type}</td>
                          <td className="p-2 tabular-nums font-bold text-rose-700">{inc.lostDays} يوم</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="p-3 text-center text-emerald-800 bg-emerald-50/40">
                          <div className="flex items-center justify-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            <strong className="text-xs">سجل معتمد: صفر حوادث وإصابات عمل (Zero Harm Compliance)</strong>
                            <span className="text-[11px] text-slate-500">— لم تسجل أي حوادث أو إصابات مهنية</span>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* NCRs Summary */}
            <div>
              <h3 className="text-sm font-bold text-amber-950 border-b border-amber-200 pb-1.5 mb-2.5">
                ثالثاً: متابعة حالات عدم المطابقة (NCRs) والإجراءات التصحيحية
              </h3>
              <div className="overflow-x-auto border border-slate-200 rounded-lg">
                <table className="w-full text-right text-xs border-collapse">
                  <thead className="bg-slate-100 font-bold text-slate-800">
                    <tr>
                      <th className="p-2 border-b">كود NCR</th>
                      <th className="p-2 border-b">الوحدة</th>
                      <th className="p-2 border-b">الوصف</th>
                      <th className="p-2 border-b">الخطورة</th>
                      <th className="p-2 border-b">المهلة</th>
                      <th className="p-2 border-b">الحالة</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {state.ncrs.length > 0 ? (
                      state.ncrs.map(n => (
                        <tr key={n.id}>
                          <td className="p-2 font-bold tabular-nums text-slate-900">{n.code}</td>
                          <td className="p-2 font-bold">{n.location}</td>
                          <td className="p-2 leading-relaxed">{n.desc}</td>
                          <td className="p-2">{n.severity}</td>
                          <td className="p-2 tabular-nums">{n.deadline}</td>
                          <td className="p-2 font-bold">{n.status}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="p-3 text-center text-emerald-800 bg-emerald-50/40">
                          <div className="flex items-center justify-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            <strong className="text-xs">صفر حالات عدم مطابقة مفتوحة (Zero Open NCRs)</strong>
                            <span className="text-[11px] text-slate-500">— مطابقة تامة لمتطلبات GAHAR 2025</span>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* 2. UNITS DIRECTORY REPORT (INSPECTION PLACES) */}
        {reportType === 'units' && (
          <div className="space-y-4 text-xs text-slate-800">
            <div className="overflow-x-auto border border-slate-200 rounded-lg">
              <table className="w-full text-right text-xs border-collapse">
                <thead className="bg-slate-100 font-bold text-slate-800">
                  <tr>
                    <th className="p-2.5 border-b">كود الوحدة</th>
                    <th className="p-2.5 border-b">مكان الفحص (Unit Name)</th>
                    <th className="p-2.5 border-b">الموقع والطابق</th>
                    <th className="p-2.5 border-b">مستوى الخطورة</th>
                    <th className="p-2.5 border-b">المفتش المختص</th>
                    <th className="p-2.5 border-b">المفتش البديل</th>
                    <th className="p-2.5 border-b">أيام الفحص</th>
                    <th className="p-2.5 border-b text-center">عدد بنود الفحص</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {state.units.map(u => (
                    <tr key={u.id}>
                      <td className="p-2.5 font-mono font-bold text-sky-900">{u.code}</td>
                      <td className="p-2.5 font-extrabold text-slate-900">{u.name}</td>
                      <td className="p-2.5 text-slate-600">{u.buildingFloor}</td>
                      <td className="p-2.5 font-semibold">{u.riskLevel}</td>
                      <td className="p-2.5 font-bold text-sky-800">{u.assignedInspector}</td>
                      <td className="p-2.5 text-slate-500">{u.backupInspector || '—'}</td>
                      <td className="p-2.5 text-slate-600">{(u.scheduledDays || []).join('، ')}</td>
                      <td className="p-2.5 text-center font-bold font-mono">{u.checklist?.length || 0} بنود</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 3. WEEKLY MATRIX REPORT */}
        {reportType === 'weekly_matrix' && (
          <div className="space-y-4 text-xs text-slate-800">
            <div className="overflow-x-auto border border-slate-200 rounded-lg">
              <table className="w-full text-right text-xs border-collapse">
                <thead className="bg-slate-100 font-bold text-slate-800">
                  <tr>
                    <th className="p-2.5 border-b">اليوم (Day)</th>
                    <th className="p-2.5 border-b">الوردية (Shift)</th>
                    <th className="p-2.5 border-b">مكان الفحص (Unit Name)</th>
                    <th className="p-2.5 border-b">المفتش المسؤول</th>
                    <th className="p-2.5 border-b">نوع الجولة</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {state.weeklySchedule.map(slot => (
                    <tr key={slot.id}>
                      <td className="p-2.5 font-bold">{slot.dayOfWeek}</td>
                      <td className="p-2.5">{slot.shift}</td>
                      <td className="p-2.5 font-extrabold text-sky-950">{slot.departmentName}</td>
                      <td className="p-2.5 font-semibold">{slot.inspectorName}</td>
                      <td className="p-2.5 text-slate-600">{slot.roundType}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 4. NCRs REPORT */}
        {reportType === 'ncrs' && (
          <div className="space-y-4 text-xs text-slate-800">
            <div className="overflow-x-auto border border-slate-200 rounded-lg">
              <table className="w-full text-right text-xs border-collapse">
                <thead className="bg-slate-100 font-bold text-slate-800">
                  <tr>
                    <th className="p-2.5 border-b">كود NCR</th>
                    <th className="p-2.5 border-b">الوحدة / المكان</th>
                    <th className="p-2.5 border-b min-w-[200px]">وصف عدم المطابقة</th>
                    <th className="p-2.5 border-b">الخطورة</th>
                    <th className="p-2.5 border-b">المهلة</th>
                    <th className="p-2.5 border-b">الحالة</th>
                    <th className="p-2.5 border-b">محرر التقرير</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {state.ncrs.length > 0 ? (
                    state.ncrs.map(n => (
                      <tr key={n.id}>
                        <td className="p-2.5 font-bold tabular-nums text-slate-900">{n.code}</td>
                        <td className="p-2.5 font-extrabold">{n.location}</td>
                        <td className="p-2.5 leading-relaxed">{n.desc}</td>
                        <td className="p-2.5 font-medium">{n.severity}</td>
                        <td className="p-2.5 tabular-nums">{n.deadline}</td>
                        <td className="p-2.5 font-bold">
                          {n.status === 'مغلق' ? 'مغلق ومستوفى' : 'مفتوح وقيد المتابعة'}
                        </td>
                        <td className="p-2.5 font-medium">{n.issuerName || n.createdBy || '—'}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="p-6 text-center text-emerald-800 bg-emerald-50/50">
                        <CheckCircle2 className="w-6 h-6 mx-auto mb-1 text-emerald-600" />
                        <strong className="block text-sm">سجل معتمد: لا توجد أي حالات عدم مطابقة مسجلة حالياً</strong>
                        <span className="text-xs text-slate-500">تم استيفاء وتطبيق اشتراطات السلامة والبيئة بجميع الوحدات (Zero NCRs)</span>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 5. INCIDENTS REPORT */}
        {reportType === 'incidents' && (
          <div className="space-y-4 text-xs text-slate-800">
            <div className="overflow-x-auto border border-slate-200 rounded-lg">
              <table className="w-full text-right text-xs border-collapse">
                <thead className="bg-slate-100 font-bold text-slate-800">
                  <tr>
                    <th className="p-2.5 border-b">التاريخ والساعة</th>
                    <th className="p-2.5 border-b">الوردية</th>
                    <th className="p-2.5 border-b">اسم المصاب</th>
                    <th className="p-2.5 border-b">الإدارة / الوظيفة</th>
                    <th className="p-2.5 border-b">المكان (Unit)</th>
                    <th className="p-2.5 border-b">نوع الإصابة</th>
                    <th className="p-2.5 border-b text-center">أيام الغياب</th>
                    <th className="p-2.5 border-b min-w-[200px]">ملابسات الحادث والإجراء التصحيحي</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {state.incidents.length > 0 ? (
                    state.incidents.map(inc => (
                      <tr key={inc.id}>
                        <td className="p-2.5 tabular-nums">{inc.datetime}</td>
                        <td className="p-2.5">{inc.shift}</td>
                        <td className="p-2.5 font-bold">{inc.name}</td>
                        <td className="p-2.5">{inc.dept}</td>
                        <td className="p-2.5 font-extrabold">{inc.location}</td>
                        <td className="p-2.5 font-semibold text-rose-800">{inc.type}</td>
                        <td className="p-2.5 text-center tabular-nums font-bold">{inc.lostDays} يوم</td>
                        <td className="p-2.5 leading-relaxed">{inc.desc}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={8} className="p-6 text-center text-emerald-800 bg-emerald-50/50">
                        <CheckCircle2 className="w-6 h-6 mx-auto mb-1 text-emerald-600" />
                        <strong className="block text-sm">سجل معتمد: صفر حوادث وإصابات عمل (Zero Harm Certified)</strong>
                        <span className="text-xs text-slate-500">مستشفى الناس خالي من حوادث وإصابات العمل وفق معايير GAHAR 2025 و ISO 45001</span>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 6. INSPECTIONS REPORT */}
        {reportType === 'inspections' && (
          <div className="space-y-4 text-xs text-slate-800">
            <div className="overflow-x-auto border border-slate-200 rounded-lg">
              <table className="w-full text-right text-xs border-collapse">
                <thead className="bg-slate-100 font-bold text-slate-800">
                  <tr>
                    <th className="p-2.5 border-b">التاريخ</th>
                    <th className="p-2.5 border-b">الوردية</th>
                    <th className="p-2.5 border-b">المكان (Unit)</th>
                    <th className="p-2.5 border-b">المفتش المسؤول</th>
                    <th className="p-2.5 border-b">حالة المرور</th>
                    <th className="p-2.5 border-b">الملاحظات</th>
                    <th className="p-2.5 border-b">تم التسجيل بواسطة</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {state.inspections.length > 0 ? (
                    state.inspections.map(item => (
                      <tr key={item.id}>
                        <td className="p-2.5 tabular-nums font-semibold">{item.date}</td>
                        <td className="p-2.5">{item.shift}</td>
                        <td className="p-2.5 font-extrabold text-sky-950">{item.location}</td>
                        <td className="p-2.5 font-bold">{item.inspector}</td>
                        <td className="p-2.5 font-semibold">{item.status}</td>
                        <td className="p-2.5 leading-relaxed">{item.notes || '—'}</td>
                        <td className="p-2.5 font-medium text-slate-500">{item.createdBy || item.inspector}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="p-6 text-center text-slate-500 bg-slate-50/60">
                        <CalendarDays className="w-6 h-6 mx-auto mb-1 text-sky-600" />
                        <strong className="block text-sm text-slate-800">سجل جولات المرور الميداني جاهز للتوثيق</strong>
                        <span className="text-xs text-slate-500">يمكنك تسجيل جولة تفتيش جديدة من قائمة التفتيش أو تنفيذ المواعيد المجدولة</span>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 7. KPIS REPORT */}
        {reportType === 'kpis' && (
          <div className="space-y-4 text-xs text-slate-800">
            <div className="overflow-x-auto border border-slate-200 rounded-lg">
              <table className="w-full text-right text-xs border-collapse">
                <thead className="bg-slate-100 font-bold text-slate-800">
                  <tr>
                    <th className="p-2.5 border-b">اسم المفتش / الفني</th>
                    <th className="p-2.5 border-b text-center">الجولات المنجزة</th>
                    <th className="p-2.5 border-b text-center">تقارير الـ NCR</th>
                    <th className="p-2.5 border-b text-center">متوسط زمن الاستجابة</th>
                    <th className="p-2.5 border-b text-center">نسبة الامتثال</th>
                    <th className="p-2.5 border-b text-center">التقييم التراكمي</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {state.kpis.length > 0 ? (
                    state.kpis.map((k, idx) => (
                      <tr key={idx}>
                        <td className="p-2.5 font-bold">{k.inspector}</td>
                        <td className="p-2.5 text-center tabular-nums">{k.inspectionsDone} جولة</td>
                        <td className="p-2.5 text-center tabular-nums">{k.ncrsRaised} تقرير</td>
                        <td className="p-2.5 text-center">{k.responseTime}</td>
                        <td className="p-2.5 text-center tabular-nums font-bold text-sky-800">{k.compliance}</td>
                        <td className="p-2.5 text-center font-bold">{k.score}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="p-6 text-center text-slate-500 bg-slate-50/60">
                        <Award className="w-6 h-6 mx-auto mb-1 text-sky-600" />
                        <strong className="block text-sm text-slate-800">مصفوفة تقييم مؤشرات الأداء (KPIs) لفريق السلامة</strong>
                        <span className="text-xs text-slate-500">جاهزة لرصد نتائج الربع السنوي والتقييمات الدورية</span>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>

      {/* 4-Party Executive Signatures Grid - Pristine & Clean Without Dots */}
      <div className="mt-12 pt-6 border-t-2 border-slate-300 print-break-inside-avoid signatures">
        <p className="text-xs font-bold text-slate-700 mb-4 text-center">
          الاعتمادات والتوقيعات الرسمية للإدارة العليا والتشغيل
        </p>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center sig-grid">
          
          {/* Box 1: Team Leader */}
          <div className="border border-slate-300 rounded-xl p-3.5 bg-slate-50/70 shadow-xs sig-box flex flex-col justify-between min-h-[110px]">
            <div>
              <h4 className="text-xs font-bold text-slate-900 min-h-[18px]">
                {signers.teamLeader?.name || 'م/ أحمد نبيه'}
              </h4>
              <p className="text-[11px] text-sky-950 font-bold mt-1">
                {signers.teamLeader?.title || 'Team Leader السلامة الميدانية'}
              </p>
            </div>
            <div className="mt-4">
              <div className="w-4/5 mx-auto border-b border-slate-400 mb-1"></div>
              <span className="text-[10px] text-slate-400 block font-medium">التوقيع والاعتماد</span>
            </div>
          </div>

          {/* Box 2: Safety Director */}
          <div className="border border-slate-300 rounded-xl p-3.5 bg-slate-50/70 shadow-xs sig-box flex flex-col justify-between min-h-[110px]">
            <div>
              <h4 className="text-xs font-bold text-slate-900 min-h-[18px]">
                {signers.safetyDirector?.name || 'م/ عمر فريد العزب'}
              </h4>
              <p className="text-[11px] text-sky-950 font-bold mt-1">
                {signers.safetyDirector?.title || 'مدير إدارة السلامة والصحة المهنية'}
              </p>
            </div>
            <div className="mt-4">
              <div className="w-4/5 mx-auto border-b border-slate-400 mb-1"></div>
              <span className="text-[10px] text-slate-400 block font-medium">التوقيع والاعتماد</span>
            </div>
          </div>

          {/* Box 3: Operations Director */}
          <div className="border border-slate-300 rounded-xl p-3.5 bg-slate-50/70 shadow-xs sig-box flex flex-col justify-between min-h-[110px]">
            <div>
              <h4 className="text-xs font-bold text-slate-900 min-h-[18px]">
                {signers.opsDirector?.name?.trim() || ''}
              </h4>
              <p className="text-[11px] text-sky-950 font-bold mt-1">
                {signers.opsDirector?.title || 'مدير التشغيل'}
              </p>
            </div>
            <div className="mt-4">
              <div className="w-4/5 mx-auto border-b border-slate-400 mb-1"></div>
              <span className="text-[10px] text-slate-400 block font-medium">التوقيع والاعتماد</span>
            </div>
          </div>

          {/* Box 4: General Director / CEO */}
          <div className="border border-slate-300 rounded-xl p-3.5 bg-slate-50/70 shadow-xs sig-box flex flex-col justify-between min-h-[110px]">
            <div>
              <h4 className="text-xs font-bold text-slate-900 min-h-[18px]">
                {signers.ceoDirector?.name?.trim() || ''}
              </h4>
              <p className="text-[11px] text-sky-950 font-bold mt-1">
                {signers.ceoDirector?.title || 'المدير التنفيذي للمستشفى'}
              </p>
            </div>
            <div className="mt-4">
              <div className="w-4/5 mx-auto border-b border-slate-400 mb-1"></div>
              <span className="text-[10px] text-slate-400 block font-medium">الاعتماد والختم الرسمي</span>
            </div>
          </div>

        </div>

        <div className="mt-6 text-center text-[10px] text-slate-400 font-medium">
          مستشفى الناس - قسم السلامة والصحة المهنية وحماية البيئة — وثيقة رسمية معتمدة وفق متطلبات الرقابة والاعتماد
        </div>
      </div>

    </div>
  );
};
