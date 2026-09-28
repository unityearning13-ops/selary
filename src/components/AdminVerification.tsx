import React from 'react';
import { CheckCircle2 } from 'lucide-react';

interface AdminVerificationProps {
  generatedDate?: string;
  generatedTime?: string;
  adminName?: string;
  adminRole?: string;
}

export const AdminVerification: React.FC<AdminVerificationProps> = ({
  generatedDate = '22 October 2026',
  generatedTime = '11:45:00 AM',
  adminName = 'JIHADUL ISLAM',
  adminRole = 'Admin',
}) => {
  return (
    <div className="mt-8 pt-5 border-t border-slate-300 page-break-inside-avoid">
      <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6 px-2">
        
        {/* Left Side: Verified & Approved by Admin (Clean, slim & elegant) */}
        <div className="space-y-1.5 text-left">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>Verified & Approved by Admin</span>
          </div>

          <div className="text-[11px] text-slate-500 font-medium">
            <span>Date: <strong className="text-slate-700 font-semibold">{generatedDate}</strong></span>
            <span className="mx-2">•</span>
            <span>Time: <strong className="text-slate-700 font-semibold">{generatedTime}</strong></span>
          </div>

          <div className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">
            Unity Earning E-Learning Platform
          </div>
        </div>

        {/* Right Side: Admin Signature & Name in English (Slim, thin line, no bulk) */}
        <div className="flex flex-col items-start sm:items-center text-left sm:text-center min-w-[210px]">
          {/* Fluid calligraphic signature */}
          <div className="h-10 flex items-center justify-center select-none">
            <svg
              className="w-44 h-10 text-slate-800"
              viewBox="0 0 220 50"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M15 38C12 32 15 14 22 10C27 6 30 16 31 26C32 35 29 44 24 46C20 48 18 41 22 31C28 16 38 11 43 13C47 15 41 26 40 31C44 24 50 18 55 22C59 26 53 33 50 35C56 28 63 20 68 23C72 25 67 33 64 36C69 29 75 23 80 25C84 27 78 36 76 38C82 30 90 24 95 26C99 28 92 38 90 40C96 32 106 18 114 20C120 22 115 33 112 39C120 24 132 9 144 13C154 17 142 33 138 39C146 28 156 20 165 22C172 24 166 35 163 39C172 29 182 22 192 24C200 26 195 35 190 40"
                stroke="#1e293b"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M12 40C45 38 100 42 150 39C175 37 205 35 212 37"
                stroke="#2563eb"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </div>

          {/* Thin clean signature line */}
          <div className="w-48 h-px bg-slate-400 mt-1 mb-1.5"></div>

          {/* Admin Name & Designation */}
          <div className="text-xs font-black text-slate-900 tracking-wider uppercase">
            {adminName}
          </div>
          <div className="text-[11px] font-semibold text-slate-600">
            {adminRole || 'Admin'}
          </div>
        </div>

      </div>
    </div>
  );
};
