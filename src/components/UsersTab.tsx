import React, { useState } from 'react';
import { 
  Users, 
  UserPlus, 
  ShieldCheck, 
  Crown, 
  KeyRound, 
  Trash2, 
  Edit3, 
  Activity, 
  CheckCircle2, 
  Clock, 
  FileText 
} from 'lucide-react';
import { UserAccount, ActivityLogItem } from '../types';
import { canModifyMasterConfig } from '../utils/permissions';

interface UsersTabProps {
  users: UserAccount[];
  currentUser: UserAccount | null;
  activityLog: ActivityLogItem[];
  onAddUser: () => void;
  onEditUser: (user: UserAccount) => void;
  onDeleteUser: (id: number) => void;
  onOpenChangePasswordForUser: (user: UserAccount) => void;
}

export const UsersTab: React.FC<UsersTabProps> = ({
  users,
  currentUser,
  activityLog,
  onAddUser,
  onEditUser,
  onDeleteUser,
  onOpenChangePasswordForUser
}) => {
  const canEdit = canModifyMasterConfig(currentUser);

  return (
    <div className="space-y-6">
      
      {/* Users Management Card */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-5 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-sky-950">
                حسابات الأفراد والصلاحيات وخصوصية كلمات المرور
              </h2>
              <span className="text-xs bg-sky-50 text-sky-800 font-semibold px-2.5 py-0.5 rounded-full border border-sky-200">
                فريق ومفتشو السلامة الميدانية
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              إدارة أعضاء الفريق والمفتشين: إضافة مفتشين جدد، تعديل وتحديث بيانات وحسابات الزملاء، وتغيير كلمات المرور بخصوصية
            </p>
          </div>

          {canEdit && (
            <button
              onClick={onAddUser}
              className="inline-flex items-center gap-2 px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-xs font-bold shadow-xs transition-all cursor-pointer whitespace-nowrap"
            >
              <UserPlus className="w-4 h-4" />
              <span>إضافة مفتش / عضو جديد بالفريق</span>
            </button>
          )}
        </div>

        {/* Permissions Rule Note */}
        <div className="my-4 p-3.5 bg-amber-50/70 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-start gap-2.5">
          <ShieldCheck className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <strong className="block font-bold mb-0.5 text-amber-950">قواعد الصلاحيات المعتمدة:</strong>
            صلاحيات الحذف والتعديل العام للأماكن والخطة وإعدادات التوقيعات محصورة بالإدارة العليا: 
            <strong> م/ عمر فريد العزب (مدير الإدارة)</strong> و <strong>م/ أحمد نبيه (Team Leader)</strong>.
            بينما يقوم باقي الزملاء المفتشين بتسجيل الجولات والحوادث وتوثيق أسمائهم وحساباتهم بدقة ومزامنتها لحظياً للجميع.
          </div>
        </div>

        {/* Users Table */}
        <div className="overflow-x-auto rounded-lg border border-slate-200 mt-4">
          <table className="w-full text-right text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100 text-slate-700 border-b border-slate-200 font-bold">
                <th className="p-3">اسم المسؤول / المفتش</th>
                <th className="p-3">اسم المستخدم (Username)</th>
                <th className="p-3">المستوى والصلاحية</th>
                <th className="p-3">المسمى الوظيفي</th>
                <th className="p-3">رقم الهاتف</th>
                <th className="p-3 text-center">كلمة المرور</th>
                <th className="p-3 text-center no-print">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-slate-800">
              {users.map(u => {
                const isMe = currentUser?.id === u.id;
                return (
                  <tr key={u.id} className={`hover:bg-sky-50/20 transition-colors ${isMe ? 'bg-sky-50/40 font-semibold' : ''}`}>
                    <td className="p-3 font-bold text-slate-900 flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-sky-800 text-white flex items-center justify-center text-xs">
                        {u.name[0]}
                      </div>
                      <span>{u.name}</span>
                      {isMe && <span className="text-[10px] bg-sky-700 text-white px-1.5 py-0.2 rounded">حسابك</span>}
                    </td>
                    <td className="p-3 font-mono text-slate-600">{u.username}</td>
                    <td className="p-3">
                      {u.role === 'ADMIN' ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                          <Crown className="w-3 h-3 text-emerald-700 fill-emerald-600" />
                          <span>مدير عام (Admin)</span>
                        </span>
                      ) : u.role === 'TEAM_LEADER' ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                          <Crown className="w-3 h-3 text-amber-700 fill-amber-600" />
                          <span>Team Leader</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-700 border border-slate-300">
                          <span>مفتش سلامة (Inspector)</span>
                        </span>
                      )}
                    </td>
                    <td className="p-3 text-slate-700">{u.roleTitle}</td>
                    <td className="p-3 font-mono text-slate-600">{u.phone || '—'}</td>
                    <td className="p-3 text-center">
                      {(isMe || canEdit) ? (
                        <button
                          onClick={() => onOpenChangePasswordForUser(u)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 hover:bg-sky-100 text-sky-800 rounded font-semibold text-[11px] border border-slate-300 transition-colors cursor-pointer"
                        >
                          <KeyRound className="w-3 h-3 text-sky-700" />
                          <span>تغيير الباسورد</span>
                        </button>
                      ) : (
                        <span className="text-slate-400 font-mono">•••••• (خاص)</span>
                      )}
                    </td>
                    <td className="p-3 text-center no-print">
                      {canEdit ? (
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => onEditUser(u)}
                            className="p-1.5 text-slate-600 hover:text-sky-700 hover:bg-slate-100 rounded cursor-pointer"
                            title="تعديل بيانات المستخدم"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          {u.role !== 'ADMIN' && (
                            <button
                              onClick={() => onDeleteUser(u.id)}
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded cursor-pointer"
                              title="حذف المستخدم"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      ) : (
                        <span className="text-slate-300">—</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Live Activity Feed Card */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-4 sm:p-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-sky-700" />
            <h3 className="font-bold text-base text-sky-950">
              سجل النشاط الميداني اللحظي (Live Activity Stream)
            </h3>
          </div>
          <span className="text-xs text-slate-500 font-medium">
            محدث ولحظي · الشغل يظهر لجميع الأفراد والقيادات فور تسجيله
          </span>
        </div>

        <div className="mt-4 space-y-2.5 max-h-72 overflow-y-auto pr-1">
          {activityLog.length === 0 ? (
            <p className="text-slate-400 text-xs italic py-4 text-center">لا توجد أنشطة مسجلة حديثاً</p>
          ) : (
            activityLog.map(item => (
              <div
                key={item.id}
                className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3 text-xs hover:bg-sky-50/30 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${
                    item.type === 'INSPECTION'
                      ? 'bg-sky-100 text-sky-800'
                      : item.type === 'NCR'
                      ? 'bg-amber-100 text-amber-800'
                      : item.type === 'INCIDENT'
                      ? 'bg-rose-100 text-rose-800'
                      : 'bg-slate-200 text-slate-800'
                  }`}>
                    {item.userName[0]}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <strong className="text-slate-900 font-bold">{item.userName}</strong>
                      <span className="text-slate-500">{item.action}</span>
                      <span className="font-bold text-sky-900 font-mono">[{item.target}]</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-[11px] text-slate-400 font-mono tabular-nums">
                  <Clock className="w-3 h-3" />
                  <span>{item.timestamp}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

    </div>
  );
};
