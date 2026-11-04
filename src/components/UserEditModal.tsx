import React, { useState, useEffect } from 'react';
import { X, UserPlus, Shield } from 'lucide-react';
import { UserAccount, UserRole } from '../types';

interface UserEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (user: Omit<UserAccount, 'id'> & { id?: number }) => void;
  initialUser?: UserAccount | null;
}

export const UserEditModal: React.FC<UserEditModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialUser
}) => {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('123');
  const [role, setRole] = useState<UserRole>('INSPECTOR');
  const [roleTitle, setRoleTitle] = useState('فني سلامة وصحة مهنية (Inspector)');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialUser) {
      setName(initialUser.name);
      setUsername(initialUser.username);
      setPassword(initialUser.password || '123');
      setRole(initialUser.role);
      setRoleTitle(initialUser.roleTitle);
      setPhone(initialUser.phone || '');
    } else {
      setName('');
      setUsername('');
      setPassword('123');
      setRole('INSPECTOR');
      setRoleTitle('فني سلامة وصحة مهنية (Inspector)');
      setPhone('');
    }
    setError('');
  }, [initialUser, isOpen]);

  if (!isOpen) return null;

  const handleRoleChange = (selectedRole: UserRole) => {
    setRole(selectedRole);
    if (selectedRole === 'ADMIN') {
      setRoleTitle('مدير إدارة السلامة والصحة المهنية (Admin)');
    } else if (selectedRole === 'TEAM_LEADER') {
      setRoleTitle('Team Leader السلامة الميدانية');
    } else {
      setRoleTitle('فني سلامة وصحة مهنية (Inspector)');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('يرجى كتابة اسم المستخدم');
      return;
    }
    const finalUsername = username.trim() || name.trim().toLowerCase().replace(/\s+/g, '.');

    onSave({
      id: initialUser ? initialUser.id : undefined,
      name: name.trim(),
      username: finalUsername,
      password: password.trim() || '123',
      role,
      roleTitle: roleTitle.trim(),
      phone: phone.trim()
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2 text-sky-800">
            <UserPlus className="w-5 h-5 text-sky-600" />
            <h3 className="font-bold text-base text-slate-900">
              {initialUser ? 'تعديل بيانات المستخدم والصلاحيات' : 'إضافة مستخدم جديد للنظام'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="my-3 p-2.5 bg-rose-50 text-rose-800 border border-rose-200 rounded-lg text-xs font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5 mt-4 text-xs">
          
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              اسم المسؤول / المفتش
            </label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="مثال: حسام الدين محمود"
              required
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-600 focus:outline-none font-bold"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                اسم المستخدم (Username)
              </label>
              <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="hosam.mahmoud"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono focus:ring-2 focus:ring-sky-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                كلمة المرور الابتدائية
              </label>
              <input
                type="text"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="123"
                required
                className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono focus:ring-2 focus:ring-sky-600 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                مستوى الصلاحية
              </label>
              <select
                value={role}
                onChange={e => handleRoleChange(e.target.value as UserRole)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-600 focus:outline-none font-bold text-sky-900"
              >
                <option value="INSPECTOR">مفتش سلامة (Inspector)</option>
                <option value="TEAM_LEADER">تيم ليدر (Team Leader)</option>
                <option value="ADMIN">مدير النظام (Admin)</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                رقم الهاتف
              </label>
              <input
                type="text"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="010..."
                className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono focus:ring-2 focus:ring-sky-600 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              المسمى الوظيفي الرسمي
            </label>
            <input
              type="text"
              value={roleTitle}
              onChange={e => setRoleTitle(e.target.value)}
              placeholder="فني سلامة وصحة مهنية"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-600 focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 font-medium hover:bg-slate-50 transition-colors cursor-pointer"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-sky-700 hover:bg-sky-800 text-white font-bold rounded-lg shadow-sm transition-colors cursor-pointer"
            >
              💾 حفظ المستخدم
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
