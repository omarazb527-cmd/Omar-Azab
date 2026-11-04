import React, { useState, useMemo } from 'react';
import { 
  Building2, 
  Plus, 
  Search, 
  ListChecks, 
  UserCheck, 
  Calendar, 
  Clock, 
  Edit3, 
  Trash2, 
  AlertTriangle,
  ClipboardCheck,
  CheckCircle2,
  ShieldAlert,
  Printer
} from 'lucide-react';
import { HospitalUnit, UserAccount, AppState } from '../types';
import { canModifyMasterConfig } from '../utils/permissions';
import { PrintReportModal } from './PrintReportModal';

interface UnitsTabProps {
  units: HospitalUnit[];
  currentUser: UserAccount | null;
  state?: AppState;
  onAddUnit: () => void;
  onEditUnit: (unit: HospitalUnit) => void;
  onDeleteUnit: (id: number) => void;
  onStartInspectionForUnit: (unit: HospitalUnit) => void;
}

export const UnitsTab: React.FC<UnitsTabProps> = ({
  units,
  currentUser,
  state,
  onAddUnit,
  onEditUnit,
  onDeleteUnit,
  onStartInspectionForUnit
}) => {
  const [search, setSearch] = useState('');
  const [riskFilter, setRiskFilter] = useState('ALL');
  const [selectedUnitForChecklist, setSelectedUnitForChecklist] = useState<HospitalUnit | null>(null);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);

  const canEdit = canModifyMasterConfig(currentUser);

  const filteredUnits = useMemo(() => {
    return units.filter(u => {
      const matchSearch =
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.code.toLowerCase().includes(search.toLowerCase()) ||
        u.assignedInspector.toLowerCase().includes(search.toLowerCase()) ||
        u.buildingFloor.toLowerCase().includes(search.toLowerCase());

      const matchRisk = riskFilter === 'ALL' || u.riskLevel.includes(riskFilter);
      return matchSearch && matchRisk;
    });
  }, [units, search, riskFilter]);

  const highRiskCount = units.filter(u => u.riskLevel.includes('High')).length;
  const mediumRiskCount = units.filter(u => u.riskLevel.includes('Medium')).length;

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-5 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-900">
                قائمة أماكن الفحص والوحدات وقوائم التفتيش (Units & Checklists)
              </h2>
              <span className="text-xs bg-sky-50 text-sky-800 font-semibold px-2.5 py-0.5 rounded-full border border-sky-200">
                {units.length} وحدة معتمدة بالإنجليزي
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              مسميات الأماكن والوحدات بالإنجليزي كما وردت بشيت الإكسيل، مع قوائم بنود الفحص الخاصة بكل مكان وإمكانية إضافة وتحديث وحذف الأماكن
            </p>
          </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setIsPrintModalOpen(true)}
            className="inline-flex items-center justify-center gap-2 px-3.5 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-bold shadow-xs transition-all cursor-pointer whitespace-nowrap"
            title="طباعة وتصدير تقرير أماكن الفحص وقوائم التحقق المعتمدة (Units Directory)"
          >
            <Printer className="w-4 h-4 text-sky-400" />
            <span>طباعة تقرير أماكن الفحص</span>
          </button>

          {canEdit ? (
            <button
              onClick={onAddUnit}
              className="inline-flex items-center gap-2 px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-xs font-bold shadow-xs transition-all cursor-pointer whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              <span>إضافة مكان فحص جديد</span>
            </button>
          ) : (
            <div className="text-xs text-slate-400 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
              🔒 إضافة وحذف الأماكن مقتصر على م/ عمر فريد وم/ أحمد نبيه
            </div>
          )}
        </div>
      </div>

        {/* Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-4">
          <div className="relative sm:col-span-2">
            <Search className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by Unit name (e.g. Lab, Main OR, CCU, Boilers Room), Inspector..."
              className="w-full pr-9 pl-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-sky-600 focus:bg-white text-slate-800"
            />
          </div>

          <div>
            <select
              value={riskFilter}
              onChange={e => setRiskFilter(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-sky-600 text-slate-700"
            >
              <option value="ALL">جميع مستويات الخطورة (All Risk Levels)</option>
              <option value="High">عالي الخطورة (High Risk)</option>
              <option value="Medium">متوسط الخطورة (Medium Risk)</option>
              <option value="Low">منخفض الخطورة (Low Risk)</option>
            </select>
          </div>
        </div>

        {/* Counter Strip */}
        <div className="flex flex-wrap items-center gap-4 my-3 bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs">
          <div>
            <span className="text-slate-500">إجمالي أماكن الفحص المعتمدة:</span>
            <span className="font-bold text-slate-800 mr-1.5 tabular-nums">{units.length} Unit</span>
          </div>
          <div className="border-r border-slate-300 pr-4">
            <span className="text-slate-500">وحدات عالية الخطورة:</span>
            <span className="font-bold text-rose-700 mr-1.5 tabular-nums">{highRiskCount}</span>
          </div>
          <div className="border-r border-slate-300 pr-4">
            <span className="text-slate-500">وحدات متوسطة الخطورة:</span>
            <span className="font-bold text-amber-700 mr-1.5 tabular-nums">{mediumRiskCount}</span>
          </div>
          <div className="border-r border-slate-300 pr-4">
            <span className="text-slate-500">صلاحية التعديل والحذف:</span>
            <span className="font-bold text-sky-800 mr-1.5">م/ عمر فريد وم/ أحمد نبيه فقط</span>
          </div>
        </div>

        {/* Units Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
          {filteredUnits.length === 0 ? (
            <div className="col-span-full py-12 text-center text-slate-400">
              <Building2 className="w-10 h-10 mx-auto mb-2 opacity-50" />
              <span>لا توجد وحدات أو أماكن فحص مطابقة للبحث</span>
            </div>
          ) : (
            filteredUnits.map(unit => (
              <div
                key={unit.id}
                className="bg-white border border-slate-200 hover:border-sky-400 rounded-xl p-4 shadow-xs transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between pb-3 border-b border-slate-100 gap-2">
                    <div>
                      <span className="text-[10px] font-mono text-sky-800 font-bold bg-sky-50 px-2 py-0.5 rounded border border-sky-200 inline-block mb-1">
                        {unit.code}
                      </span>
                      <h3 className="font-extrabold text-base text-slate-900 tracking-tight">
                        {unit.name}
                      </h3>
                      <p className="text-[11px] text-slate-500 mt-0.5">{unit.buildingFloor}</p>
                    </div>

                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold shrink-0 ${
                      unit.riskLevel.includes('High')
                        ? 'bg-rose-100 text-rose-800 border border-rose-200'
                        : unit.riskLevel.includes('Medium')
                        ? 'bg-amber-100 text-amber-800 border border-amber-200'
                        : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                    }`}>
                      {unit.riskLevel}
                    </span>
                  </div>

                  {/* Inspector Assignments & Checklists */}
                  <div className="mt-3 space-y-2 text-xs">
                    <div className="p-2.5 rounded-lg bg-sky-50/60 border border-sky-100">
                      <div className="flex items-center gap-1.5 text-sky-900 font-bold mb-1">
                        <UserCheck className="w-4 h-4 text-sky-700" />
                        <span>المفتش المختص بالوحدة:</span>
                      </div>
                      <p className="text-sky-950 font-bold pr-5 text-sm">
                        {unit.assignedInspector}
                      </p>
                      {unit.backupInspector && (
                        <p className="text-[11px] text-slate-500 pr-5 mt-0.5">
                          المفتش البديل: {unit.backupInspector}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2 text-slate-600">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>يوم الفحص: <strong>{(unit.scheduledDays || []).join('، ')}</strong></span>
                    </div>

                    <div className="flex items-center gap-2 text-slate-600">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>الوردية: <strong>{unit.defaultShift} Shift</strong></span>
                    </div>

                    {/* Checklist Preview Button */}
                    <div className="pt-1">
                      <button
                        type="button"
                        onClick={() => setSelectedUnitForChecklist(unit)}
                        className="w-full py-1.5 px-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <ListChecks className="w-3.5 h-3.5 text-sky-700" />
                        <span>عرض قائمة بنود الفحص الخاصة بالوحدة ({unit.checklist?.length || 0} بنود)</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <button
                    onClick={() => onStartInspectionForUnit(unit)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-sky-700 hover:bg-sky-800 text-white rounded text-[11px] font-bold shadow-xs transition-colors cursor-pointer"
                    title="بدء تنفيذ جولة تفتيش وقائمة التحقق لهذا المكان"
                  >
                    <ClipboardCheck className="w-3.5 h-3.5" />
                    <span>تفتيش هذا المكان</span>
                  </button>

                  <div className="flex items-center gap-1">
                    {canEdit ? (
                      <>
                        <button
                          onClick={() => onEditUnit(unit)}
                          className="p-1.5 text-slate-500 hover:text-sky-700 hover:bg-slate-100 rounded cursor-pointer"
                          title="تعديل المكان وقائمة الفحص والمفتش المختص"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onDeleteUnit(unit.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded cursor-pointer"
                          title="حذف هذا المكان"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </>
                    ) : (
                      <span className="text-[10px] text-slate-400" title="التعديل مقتصر على م/ عمر وم/ أحمد">
                        🔒 للقادة فقط
                      </span>
                    )}
                  </div>
                </div>

              </div>
            ))
          )}
        </div>

      </div>

      {/* Checklist View Modal */}
      {selectedUnitForChecklist && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-extrabold text-base text-sky-950 flex items-center gap-2">
                  <ListChecks className="w-5 h-5 text-sky-700" />
                  <span>قائمة بنود فحص: {selectedUnitForChecklist.name}</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  المفتش المختص: {selectedUnitForChecklist.assignedInspector} · كود: {selectedUnitForChecklist.code}
                </p>
              </div>
              <button
                onClick={() => setSelectedUnitForChecklist(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="my-4 space-y-2 max-h-80 overflow-y-auto pr-1 text-xs">
              {selectedUnitForChecklist.checklist?.map((item, idx) => (
                <div key={item.id} className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex items-start gap-2.5">
                  <span className="font-mono font-bold text-sky-800 bg-sky-100/60 rounded px-1.5 py-0.5 text-[10px]">
                    0{idx + 1}
                  </span>
                  <span className="text-slate-800 leading-relaxed font-medium">{item.text}</span>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center pt-3 border-t border-slate-100">
              <button
                onClick={() => {
                  const target = selectedUnitForChecklist;
                  setSelectedUnitForChecklist(null);
                  onStartInspectionForUnit(target);
                }}
                className="px-4 py-2 bg-sky-700 hover:bg-sky-800 text-white font-bold rounded-lg text-xs flex items-center gap-1.5 cursor-pointer"
              >
                <ClipboardCheck className="w-4 h-4" />
                <span>بدء فحص هذه القائمة ميدانياً</span>
              </button>
              <button
                onClick={() => setSelectedUnitForChecklist(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg text-xs cursor-pointer"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}

      {state && (
        <PrintReportModal
          isOpen={isPrintModalOpen}
          onClose={() => setIsPrintModalOpen(false)}
          reportType="units"
          state={state}
          customTitle="دليل أماكن الفحص وقوائم التحقق المعتمدة (Units Directory)"
        />
      )}

    </div>
  );
};
