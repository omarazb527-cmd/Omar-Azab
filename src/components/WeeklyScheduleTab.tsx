import React, { useState, useMemo } from 'react';
import { 
  CalendarDays, 
  Plus, 
  Clock, 
  MapPin, 
  UserCheck, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  Sun, 
  Moon, 
  Filter,
  Printer
} from 'lucide-react';
import { WeeklyScheduleSlot, UserAccount, AppState } from '../types';
import { canModifyMasterConfig } from '../utils/permissions';
import { PrintReportModal } from './PrintReportModal';

interface WeeklyScheduleTabProps {
  schedule: WeeklyScheduleSlot[];
  currentUser: UserAccount | null;
  state?: AppState;
  onAddSlot: () => void;
  onEditSlot: (slot: WeeklyScheduleSlot) => void;
  onDeleteSlot: (id: number) => void;
  onExecuteAsInspection: (slot: WeeklyScheduleSlot) => void;
}

export const WeeklyScheduleTab: React.FC<WeeklyScheduleTabProps> = ({
  schedule,
  currentUser,
  state,
  onAddSlot,
  onEditSlot,
  onDeleteSlot,
  onExecuteAsInspection
}) => {
  const [selectedDay, setSelectedDay] = useState<string>('ALL');
  const [selectedShift, setSelectedShift] = useState<string>('ALL');
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);

  const canEdit = canModifyMasterConfig(currentUser);

  const daysList = ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  const filteredSlots = useMemo(() => {
    return schedule.filter(slot => {
      const matchDay = selectedDay === 'ALL' || slot.dayOfWeek === selectedDay;
      const matchShift = 
        selectedShift === 'ALL' ||
        (selectedShift === 'DAY' && slot.shift.includes('نهاري')) ||
        (selectedShift === 'NIGHT' && slot.shift.includes('ليلي'));
      return matchDay && matchShift;
    });
  }, [schedule, selectedDay, selectedShift]);

  const dayShiftCount = schedule.filter(s => s.shift.includes('نهاري')).length;
  const nightShiftCount = schedule.filter(s => s.shift.includes('ليلي')).length;

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-5 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-sky-900">
                مصفوفة وخطة المرور الأسبوعي (Weekly Checklists & Matrix)
              </h2>
              <span className="text-xs bg-sky-50 text-sky-800 font-semibold px-2.5 py-0.5 rounded-full border border-sky-200">
                شفتات 12 ساعة (Day & Night)
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              جدول المرور الأسبوعي المستخرج من شيت الإكسيل بالوحدات المعتمدة (English Units)، مع مرونة تعديل وتغيير الأماكن وتعيين المفتش المسؤول
            </p>
          </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setIsPrintModalOpen(true)}
            className="inline-flex items-center justify-center gap-2 px-3.5 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-bold shadow-xs transition-all cursor-pointer whitespace-nowrap"
            title="طباعة وتصدير خطة ومصفوفة المرور الأسبوعي (Weekly Schedule Matrix)"
          >
            <Printer className="w-4 h-4 text-sky-400" />
            <span>طباعة خطة الأسبوع</span>
          </button>

          {canEdit ? (
            <button
              onClick={onAddSlot}
              className="inline-flex items-center gap-2 px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-xs font-bold shadow-xs transition-all cursor-pointer whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              <span>إضافة / تعديل موعد مرور بالجدول</span>
            </button>
          ) : (
            <div className="text-xs text-slate-400 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
              🔒 تعديل الجدول مقتصر على م/ عمر فريد وم/ أحمد نبيه
            </div>
          )}
        </div>
      </div>

        {/* Days of Week Filter Strip */}
        <div className="mt-4 flex flex-wrap items-center gap-1.5 pb-2 border-b border-slate-100">
          <span className="text-xs font-semibold text-slate-600 ml-2 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" />
            <span>اليوم:</span>
          </span>
          <button
            onClick={() => setSelectedDay('ALL')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              selectedDay === 'ALL'
                ? 'bg-sky-800 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            All Week ({schedule.length})
          </button>
          {daysList.map(day => {
            const count = schedule.filter(s => s.dayOfWeek === day).length;
            return (
              <button
                key={day}
                onClick={() => setSelectedDay(day)}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                  selectedDay === day
                    ? 'bg-sky-800 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {day} ({count})
              </button>
            );
          })}
        </div>

        {/* Shift Filter & Stats */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-4 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-500 font-medium">الوردية (Shift):</span>
            <div className="inline-flex rounded-lg border border-slate-200 p-0.5 bg-slate-50">
              <button
                onClick={() => setSelectedShift('ALL')}
                className={`px-3 py-1 rounded-md font-semibold transition-all cursor-pointer ${
                  selectedShift === 'ALL' ? 'bg-white shadow-xs text-sky-900' : 'text-slate-600'
                }`}
              >
                الكل
              </button>
              <button
                onClick={() => setSelectedShift('DAY')}
                className={`px-3 py-1 rounded-md font-semibold transition-all cursor-pointer flex items-center gap-1 ${
                  selectedShift === 'DAY' ? 'bg-sky-500 text-white shadow-xs' : 'text-slate-600'
                }`}
              >
                <Sun className="w-3.5 h-3.5" />
                <span>نهاري (Day 12h)</span>
              </button>
              <button
                onClick={() => setSelectedShift('NIGHT')}
                className={`px-3 py-1 rounded-md font-semibold transition-all cursor-pointer flex items-center gap-1 ${
                  selectedShift === 'NIGHT' ? 'bg-indigo-700 text-white shadow-xs' : 'text-slate-600'
                }`}
              >
                <Moon className="w-3.5 h-3.5" />
                <span>ليلي (Night 12h)</span>
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3 text-slate-500">
            <span>Day Shift Slots: <strong>{dayShiftCount}</strong></span>
            <span>·</span>
            <span>Night Shift Slots: <strong>{nightShiftCount}</strong></span>
          </div>
        </div>

        {/* Schedule Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
          {filteredSlots.length === 0 ? (
            <div className="col-span-full py-12 text-center text-slate-400">
              <CalendarDays className="w-10 h-10 mx-auto mb-2 opacity-50" />
              <span>لا توجد جولات مرور مجدولة لليوم أو الوردية المحددة</span>
            </div>
          ) : (
            filteredSlots.map(slot => (
              <div
                key={slot.id}
                className="bg-white border border-slate-200 hover:border-sky-300 rounded-xl p-4 shadow-xs transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <span className="font-bold text-sm text-sky-950 flex items-center gap-1.5">
                      <CalendarDays className="w-4 h-4 text-sky-700" />
                      <span>{slot.dayOfWeek}</span>
                    </span>

                    <span className={`px-2 py-0.5 rounded text-[11px] font-bold flex items-center gap-1 ${
                      slot.shift.includes('نهاري')
                        ? 'bg-sky-50 text-sky-800 border border-sky-200'
                        : 'bg-indigo-50 text-indigo-800 border border-indigo-200'
                    }`}>
                      {slot.shift.includes('نهاري') ? (
                        <>
                          <Sun className="w-3 h-3 text-sky-600" />
                          <span>Day (08 AM - 08 PM)</span>
                        </>
                      ) : (
                        <>
                          <Moon className="w-3 h-3 text-indigo-600" />
                          <span>Night (08 PM - 08 AM)</span>
                        </>
                      )}
                    </span>
                  </div>

                  {/* Department & Inspector */}
                  <div className="mt-3 space-y-2 text-xs">
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                      <div>
                        <span className="text-[11px] text-slate-400 block">Unit / Location:</span>
                        <strong className="text-slate-900 font-extrabold text-sm">{slot.departmentName}</strong>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <UserCheck className="w-4 h-4 text-sky-600 shrink-0" />
                      <div>
                        <span className="text-[11px] text-slate-400 block">المفتش المكلف:</span>
                        <span className="font-bold text-sky-900">{slot.inspectorName}</span>
                      </div>
                    </div>

                    <div className="p-2 rounded bg-slate-50 border border-slate-100 text-[11px] text-slate-600">
                      <span className="font-semibold text-slate-700 block mb-0.5">نوع الجولة:</span>
                      <span>{slot.roundType}</span>
                    </div>

                    {slot.notes && (
                      <p className="text-[11px] text-slate-500 italic mt-1">
                        توجيه: {slot.notes}
                      </p>
                    )}
                  </div>
                </div>

                {/* Card Actions */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <button
                    onClick={() => onExecuteAsInspection(slot)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded text-[11px] font-bold shadow-xs transition-colors cursor-pointer"
                    title="تسجيل هذه الجولة كمنفذة فوراً وتوثيقها باسمك"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>تفتيش وتنفيذ الآن</span>
                  </button>

                  <div className="flex items-center gap-1">
                    {canEdit ? (
                      <>
                        <button
                          onClick={() => onEditSlot(slot)}
                          className="p-1.5 text-slate-500 hover:text-sky-700 hover:bg-slate-100 rounded cursor-pointer"
                          title="تعديل الموعد أو تغيير المكان / المفتش"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onDeleteSlot(slot.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded cursor-pointer"
                          title="حذف هذا الموعد من الجدول الأسبوعي"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </>
                    ) : (
                      <span className="text-[10px] text-slate-400">🔒 للقادة فقط</span>
                    )}
                  </div>
                </div>

              </div>
            ))
          )}
        </div>

      </div>

      {state && (
        <PrintReportModal
          isOpen={isPrintModalOpen}
          onClose={() => setIsPrintModalOpen(false)}
          reportType="weekly_matrix"
          state={state}
          customTitle="مصفوفة وخطة المرور الأسبوعي لورديات 12 ساعة (Weekly Schedule Matrix)"
        />
      )}

    </div>
  );
};
