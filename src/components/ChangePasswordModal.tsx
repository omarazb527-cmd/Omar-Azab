import React, { useState } from 'react';
import { X, KeyRound, CheckCircle2, AlertCircle, Lock } from 'lucide-react';
import { UserAccount } from '../types';

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserAccount | null;
  onUpdatePassword: (userId: number, newPass: string) => void;
}

export const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onUpdatePassword
}) => {
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [error, setError] = useState('');

  if (!isOpen || !currentUser) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentUser.password && currentPass !== currentUser.password) {
      setError('كلمة المرور الحالية غير صحيحة');
      return;
    }

    if (newPass.length < 3) {
      setError('يجب أن تتكون كلمة المرور الجديدة من 3 أحرف/أرقام على الأقل');
      return;
    }

    if (newPass !== confirmPass) {
      setError('كلمة المرور الجديدة غير متطابقة مع التأكيد');
      return;
    }

    onUpdatePassword(currentUser.id, newPass);
    setCurrentPass('');
    setNewPass('');
    setConfirmPass('');
    setError('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2 text-sky-800">
            <KeyRound className="w-5 h-5 text-sky-600" />
            <h3 className="font-bold text-base text-slate-900">
              تغيير كلمة المرور الشخصية
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="my-3 p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs">
          <span className="text-slate-500 block">المستخدم الحالي:</span>
          <strong className="text-sky-950 text-sm block mt-0.5">{currentUser.name}</strong>
          <span className="text-[11px] text-sky-700">{currentUser.roleTitle}</span>
        </div>

        {error && (
          <div className="my-3 p-2.5 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-800 font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5 mt-4 text-xs">
          
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              كلمة المرور الحالية
            </label>
            <input
              type="password"
              value={currentPass}
              onChange={e => {
                setCurrentPass(e.target.value);
                setError('');
              }}
              required
              placeholder="أدخل كلمة المرور الحالية..."
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-600 focus:outline-none font-mono"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              كلمة المرور الجديدة
            </label>
            <input
              type="password"
              value={newPass}
              onChange={e => {
                setNewPass(e.target.value);
                setError('');
              }}
              required
              placeholder="أدخل كلمة المرور الجديدة..."
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-600 focus:outline-none font-mono"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              تأكيد كلمة المرور الجديدة
            </label>
            <input
              type="password"
              value={confirmPass}
              onChange={e => {
                setConfirmPass(e.target.value);
                setError('');
              }}
              required
              placeholder="أعد إدخال كلمة المرور الجديدة..."
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-600 focus:outline-none font-mono"
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
              className="px-5 py-2 bg-sky-800 hover:bg-sky-900 text-white font-bold rounded-lg shadow-sm transition-colors cursor-pointer"
            >
              💾 حفظ كلمة المرور الجديدة
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
