import React, { useState } from 'react';
import { Lock, User, KeyRound, ShieldCheck, CheckCircle2, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { UserAccount } from '../types';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  users: UserAccount[];
  onLoginSuccess: (user: UserAccount) => void;
  currentUser: UserAccount | null;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  users,
  onLoginSuccess,
  currentUser
}) => {
  const [selectedUserId, setSelectedUserId] = useState<number>(users[0]?.id || 1);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const user = users.find(u => u.id === Number(selectedUserId));
    if (!user) {
      setError('المستخدم غير موجود');
      return;
    }

    if (user.password && user.password !== password) {
      setError('كلمة المرور غير صحيحة. يرجى التأكد والمحاولة مرة أخرى');
      return;
    }

    setError('');
    setPassword('');
    onLoginSuccess(user);
    onClose();
  };

  const handleQuickLogin = (user: UserAccount) => {
    onLoginSuccess(user);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
        
        {/* Hospital Brand & Logo */}
        <div className="text-center pb-5 border-b border-slate-100">
          <div className="flex justify-center mb-3">
            <img 
              src="/assets/aistudio/logo4_4e162ca5.png" 
              alt="شعار مستشفى الناس" 
              className="h-16 w-auto object-contain drop-shadow-xs"
              onError={(e) => {
                // Fallback badge if image path differs
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          </div>
          <h2 className="text-lg font-extrabold text-sky-950">
            مستشفى الناس - إدارة السلامة والصحة المهنية
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            تسجيل دخول الأفراد ومسؤولي التفتيش والقيادات
          </p>
        </div>

        {error && (
          <div className="my-3 p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4 mt-4 text-xs">
          
          <div>
            <label className="block font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-sky-700" />
              <span>اسم العضو / المسؤول</span>
            </label>
            <select
              value={selectedUserId}
              onChange={e => {
                setSelectedUserId(Number(e.target.value));
                setError('');
              }}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-800 text-xs focus:ring-2 focus:ring-sky-600 focus:outline-none"
            >
              {users.map(u => (
                <option key={u.id} value={u.id}>
                  {u.name} — {u.roleTitle}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1.5 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-sky-700" />
                <span>كلمة المرور الخاصة بك</span>
              </span>
              <span className="text-[11px] text-slate-400 font-normal">
                (كلمة المرور الافتراضية: 123)
              </span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => {
                  setPassword(e.target.value);
                  setError('');
                }}
                placeholder="أدخل كلمة المرور..."
                required
                className="w-full pr-3 pl-10 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-mono text-xs focus:ring-2 focus:ring-sky-600 focus:outline-none text-slate-900"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-sky-800 hover:bg-sky-900 text-white font-bold rounded-xl shadow-sm transition-all cursor-pointer text-xs flex items-center justify-center gap-2 mt-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>تسجيل الدخول للمنظومة</span>
          </button>

          {/* Quick Login Shortcuts */}
          <div className="pt-3 border-t border-slate-100">
            <p className="text-[11px] font-semibold text-slate-500 mb-2 text-center">
              اختيار سريع للحساب:
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  const admin = users.find(u => u.role === 'ADMIN');
                  if (admin) handleQuickLogin(admin);
                }}
                className="p-2 rounded-lg bg-sky-50 hover:bg-sky-100 border border-sky-200 text-sky-900 font-bold text-[11px] text-center transition-colors cursor-pointer"
              >
                م/ عمر فريد العزب (مدير)
              </button>
              <button
                type="button"
                onClick={() => {
                  const tl = users.find(u => u.role === 'TEAM_LEADER');
                  if (tl) handleQuickLogin(tl);
                }}
                className="p-2 rounded-lg bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-900 font-bold text-[11px] text-center transition-colors cursor-pointer"
              >
                م/ أحمد نبيه (Team Leader)
              </button>
            </div>
          </div>

        </form>

      </div>
    </div>
  );
};
