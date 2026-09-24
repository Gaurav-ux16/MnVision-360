import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, ArrowLeft, Lock, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface AccessDeniedProps {
  requiredPath?: string;
}

export const AccessDenied: React.FC<AccessDeniedProps> = ({ requiredPath }) => {
  const { user, getDefaultDashboard } = useAuth();
  const navigate = useNavigate();

  const userRole = user?.role || 'Unauthenticated Guest';
  const targetDashboard = getDefaultDashboard();

  return (
    <div className="min-h-[70vh] w-full flex items-center justify-center p-6 bg-blue-50 font-sans">
      <div className="max-w-lg w-full bg-white border-2 border-red-500 rounded-2xl shadow-xl p-8 space-y-6 text-center relative overflow-hidden">
        {/* Top Decorative Alert Stripe */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-red-600 via-orange-500 to-red-600" />

        <div className="w-20 h-20 rounded-full bg-red-100 border-2 border-red-400 text-red-600 mx-auto flex items-center justify-center shadow-inner">
          <ShieldAlert className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <div className="inline-flex items-center gap-1 bg-red-50 text-red-700 text-xs px-3 py-1 rounded-full font-bold border border-red-200 uppercase tracking-wider">
            <Lock className="w-3.5 h-3.5" />
            <span>HTTP 403 • ACCESS FORBIDDEN</span>
          </div>

          <h1 className="text-2xl font-black text-[#0B4F8A] font-serif">
            Restricted Government Resource
          </h1>

          <p className="text-xs text-slate-600 font-medium">
            Your active role clearance <span className="font-bold text-red-700 bg-red-50 px-2 py-0.5 rounded border border-red-200">[{userRole}]</span> does not have authorization to access the requested module <code className="bg-slate-100 text-slate-800 font-mono px-1.5 py-0.5 rounded">{requiredPath || 'this route'}</code>.
          </p>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-left space-y-2 text-xs">
          <div className="flex items-center gap-1.5 font-bold text-[#0B4F8A]">
            <ShieldCheck className="w-4 h-4 text-[#F28C28]" />
            <span>MOIL RBAC Security Policy Notice:</span>
          </div>
          <p className="text-slate-600 leading-relaxed text-[11px]">
            Access privileges are restricted based on Ministry of Steel operational clearance levels. All unauthorized route attempts are logged to the Security & Compliance Audit Stream with timestamp, client IP, and account credentials.
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => navigate(targetDashboard)}
            className="w-full sm:w-auto px-6 py-2.5 bg-[#0B4F8A] hover:bg-[#1769AA] text-white font-bold text-xs rounded-lg shadow-md transition flex items-center justify-center gap-2 border border-[#F28C28]"
          >
            <ArrowLeft className="w-4 h-4 text-orange-300" />
            <span>RETURN TO AUTHORIZED DASHBOARD ({targetDashboard})</span>
          </button>
        </div>
      </div>
    </div>
  );
};
