import React from 'react';
import { 
  ClipboardList, 
  Building2, 
  CalendarDays, 
  AlertOctagon, 
  Bandage, 
  Users, 
  BarChart3, 
  Printer 
} from 'lucide-react';
import { TabKey } from '../types';

interface TabsNavProps {
  activeTab: TabKey;
  onTabChange: (tab: TabKey) => void;
  counts: {
    inspections: number;
    units: number;
    weeklySchedule: number;
    ncrsOpen: number;
    incidents: number;
    users: number;
    kpis: number;
  };
}

export const TabsNav: React.FC<TabsNavProps> = ({ activeTab, onTabChange, counts }) => {
  const tabs = [
    {
      id: 'inspections' as TabKey,
      label: 'سجل جولات المرور (EOC)',
      icon: ClipboardList,
      badge: counts.inspections
    },
    {
      id: 'units' as TabKey,
      label: 'أماكن وقوائم الفحص (Units)',
      icon: Building2,
      badge: counts.units,
      badgeColor: 'bg-sky-100 text-sky-800'
    },
    {
      id: 'weekly_schedule' as TabKey,
      label: 'مصفوفة وخطة الأسبوع',
      icon: CalendarDays,
      badge: counts.weeklySchedule
    },
    {
      id: 'ncrs' as TabKey,
      label: 'تقارير عدم المطابقة (NCRs)',
      icon: AlertOctagon,
      badge: counts.ncrsOpen > 0 ? `${counts.ncrsOpen} مفتوح` : undefined,
      badgeColor: 'bg-amber-100 text-amber-800'
    },
    {
      id: 'incidents' as TabKey,
      label: 'سجل حوادث العمل (Zero Harm)',
      icon: Bandage,
      badge: counts.incidents,
      badgeColor: 'bg-rose-100 text-rose-800'
    },
    {
      id: 'users' as TabKey,
      label: 'حسابات الأفراد والنشاط',
      icon: Users,
      badge: counts.users
    },
    {
      id: 'kpis' as TabKey,
      label: 'مؤشرات الأداء (KPIs)',
      icon: BarChart3
    },
    {
      id: 'reports' as TabKey,
      label: 'طباعة التقارير والاعتمادات',
      icon: Printer
    }
  ];

  return (
    <div className="border-b border-slate-200 mb-6 no-print overflow-x-auto">
      <div className="flex gap-1.5 min-w-max pb-1">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex items-center gap-2 px-3.5 py-2.5 font-semibold text-xs rounded-t-xl transition-all cursor-pointer border-b-2 whitespace-nowrap ${
                isActive
                  ? 'border-sky-600 text-sky-950 bg-white shadow-xs font-bold'
                  : 'border-transparent text-slate-500 hover:text-sky-700 hover:bg-slate-100/70'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-sky-600' : 'text-slate-400'}`} />
              <span>{tab.label}</span>
              {tab.badge !== undefined && (
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                    tab.badgeColor || (isActive ? 'bg-sky-100 text-sky-900' : 'bg-slate-200 text-slate-700')
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
