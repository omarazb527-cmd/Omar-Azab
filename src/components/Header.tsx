import React, { useRef } from 'react';
import { 
  ShieldCheck, 
  Download, 
  FileSpreadsheet, 
  Upload, 
  RefreshCw, 
  Clock, 
  Cloud, 
  User, 
  KeyRound, 
  LogOut, 
  Crown,
  ShieldAlert
} from 'lucide-react';
import { getCurrentShift } from '../utils/sync';
import { UserAccount } from '../types';

interface HeaderProps {
  isCloudConnected: boolean;
  isSyncing: boolean;
  currentUser: UserAccount | null;
  onManualSync: () => void;
  onExportJson: () => void;
  onExportExcel: () => void;
  onImportJson: (file: File) => void;
  onOpenLogin: () => void;
  onOpenChangePassword: () => void;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  isCloudConnected,
  isSyncing,
  currentUser,
  onManualSync,
  onExportJson,
  onExportExcel,
  onImportJson,
  onOpenLogin,
  onOpenChangePassword,
  onLogout
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const currentShift = getCurrentShift();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImportJson(file);
      e.target.value = '';
    }
  };

  return (
    <header className="bg-gradient-to-r from-slate-900 via-sky-950 to-indigo-950 text-white shadow-md border-b border-sky-800/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          
          {/* Brand & Official Hospital Logo */}
          <div className="flex items-center gap-3.5">
            <div className="bg-white p-1.5 rounded-xl shadow-xs border border-white/30 shrink-0 flex items-center justify-center">
              <img
                src="/assets/aistudio/logo4_4e162ca5.png"
                alt="Al-Nas Hospital Logo"
                className="h-10 sm:h-12 w-auto object-contain"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white font-sans">
                  مستشفى الناس
                </h1>
                <span className="text-xs bg-sky-900/80 text-sky-200 px-2.5 py-0.5 rounded-md border border-sky-600/40 font-semibold">
                  إدارة السلامة والصحة المهنية والبيئة (EHS)
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-sky-200/80 mt-0.5 font-medium">
                Al-Nas Hospital Safety & EOC Management System — معايير GAHAR 2025 / ISO 45001
              </p>
            </div>
          </div>

          {/* Right Section: User Session & Actions */}
          <div className="flex items-center flex-wrap gap-2.5 no-print">
            
            {/* Shift Badge */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900/80 border border-sky-700/50 text-xs text-sky-200">
              <Clock className="w-3.5 h-3.5 text-sky-400" />
              <span>الوردية: <strong>{currentShift.includes('نهاري') ? 'Day (12h)' : 'Night (12h)'}</strong></span>
            </div>

            {/* Cloud Status */}
            <div 
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors ${
                isCloudConnected 
                  ? 'bg-emerald-950/80 border-emerald-500/40 text-emerald-200' 
                  : 'bg-amber-950/80 border-amber-500/40 text-amber-200'
              }`}
              title={isCloudConnected ? 'متصل بالسحابة المركزية والبيانات مزامنة' : 'حفظ محلي آمن في المتصفح'}
            >
              <span className={`w-2 h-2 rounded-full ${isCloudConnected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
              <Cloud className="w-3.5 h-3.5" />
              <span>{isCloudConnected ? 'سحابة البيانات: متصل' : 'سحابة: حفظ محلي'}</span>
            </div>

            {/* Manual Sync */}
            <button
              onClick={onManualSync}
              disabled={isSyncing}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-900/80 hover:bg-sky-800 text-sky-100 text-xs font-semibold border border-sky-600/50 transition-all cursor-pointer disabled:opacity-50"
              title="مزامنة فورية واسترجاع البيانات"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? 'مزامنة...' : 'تحديث حي'}</span>
            </button>

            {/* Excel Export */}
            <button
              onClick={onExportExcel}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-all cursor-pointer"
              title="تصدير شيت Excel بصيغة CSV تدعم اللغة العربية"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>تصدير Excel</span>
            </button>

            {/* JSON Backup */}
            <button
              onClick={onExportJson}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-100 text-xs font-medium border border-slate-600/40 transition-all cursor-pointer"
              title="تحميل نسخة احتياطية بصيغة JSON"
            >
              <Download className="w-3.5 h-3.5" />
              <span>نسخة JSON</span>
            </button>

            {/* Import Backup */}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-slate-200 text-xs border border-slate-700/60 transition-all cursor-pointer"
              title="استعادة أو استيراد ملف نسخة احتياطية"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>استيراد</span>
            </button>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              accept=".json" 
              className="hidden" 
            />

            {/* User Account Capsule */}
            <div className="flex items-center gap-2 pr-2 border-r border-sky-800">
              {currentUser ? (
                <div className="flex items-center gap-2 bg-slate-900/90 border border-sky-700/60 px-3 py-1 rounded-xl">
                  <div className="w-7 h-7 rounded-lg bg-sky-600 text-white flex items-center justify-center font-bold text-xs">
                    {currentUser.name[0]}
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1">
                      <span className="font-bold text-xs text-white leading-tight">
                        {currentUser.name}
                      </span>
                      {currentUser.role === 'ADMIN' && (
                        <span className="text-[10px] bg-red-600/80 text-white px-1 rounded font-mono font-bold">Admin</span>
                      )}
                      {currentUser.role === 'TEAM_LEADER' && (
                        <Crown className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                      )}
                    </div>
                    <span className="text-[10px] text-sky-300 block leading-none">
                      {currentUser.roleTitle}
                    </span>
                  </div>

                  {/* Account actions dropdown/buttons */}
                  <div className="flex items-center gap-1 mr-1">
                    <button
                      onClick={onOpenChangePassword}
                      className="p-1 text-sky-300 hover:text-white hover:bg-sky-800 rounded transition-colors"
                      title="تغيير كلمة المرور الخاصة بك"
                    >
                      <KeyRound className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={onLogout}
                      className="p-1 text-rose-300 hover:text-rose-100 hover:bg-rose-900/50 rounded transition-colors"
                      title="تسجيل الخروج أو تبديل الحساب"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={onOpenLogin}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-xs shadow-xs transition-all cursor-pointer"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>تسجيل الدخول</span>
                </button>
              )}
            </div>

          </div>
        </div>
      </div>
    </header>
  );
};
