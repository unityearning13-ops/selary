import React from 'react';
import { Employee } from '../types/salary';
import {
  RATE_TEAM_LEADER,
  RATE_TEAM_TRAINER,
  getEmployeeBalance,
  getEmployeeTotalAmount,
  formatBDT,
  parseNumber,
} from '../utils/calculations';
import { AdminVerification } from './AdminVerification';
import { Calendar, Hash, CheckCircle2, DollarSign, Award, BookOpen } from 'lucide-react';

interface OfficialSalaryDocumentProps {
  id?: string;
  teamLeaders: Employee[];
  teamTrainers: Employee[];
  companyName?: string;
  documentTitle?: string;
  periodMonth?: string;
  adminName?: string;
  adminRole?: string;
  generatedDate?: string;
  generatedTime?: string;
  sectionFilter?: 'all' | 'leaders' | 'trainers';
}

export const OfficialSalaryDocument: React.FC<OfficialSalaryDocumentProps> = ({
  id = 'salary-sheet-document',
  teamLeaders,
  teamTrainers,
  companyName = 'UNITY EARNING E-LEARNING PLATFORM',
  documentTitle = 'SALARY SHEET',
  periodMonth = 'September 2026',
  adminName = 'JIHADUL ISLAM',
  adminRole = 'Admin',
  generatedDate,
  generatedTime,
  sectionFilter = 'all',
}) => {
  return (
    <div
      id={id}
      className="bg-white text-slate-900 mx-auto p-6 md:p-10 shadow-lg border border-slate-300 print-container"
      style={{
        maxWidth: '1080px',
        width: '100%',
        minHeight: 'auto',
        fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
      }}
    >
      {/* Top Corporate Accent Bar */}
      <div
        className="h-2 w-full rounded-t-sm mb-6"
        style={{
          background: 'linear-gradient(to right, #1e3a8a, #4338ca, #059669)',
        }}
      ></div>

      {/* ========================================================
          EXECUTIVE DOCUMENT HEADER - PRESTIGIOUS CORPORATE IDENTITY
         ======================================================== */}
      <div className="border-b-2 border-[#cbd5e1] pb-6 mb-7">
        {/* Top Header Row: Emblem + Company Name + Official Status */}
        <div className="flex flex-col items-center text-center">
          {/* Corporate Crest / Emblem */}
          <div className="flex items-center gap-3 mb-2">
            <div
              className="w-12 h-12 rounded-xl text-white flex items-center justify-center shadow-md border border-[#334155]"
              style={{
                background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0a1128 100%)',
              }}
            >
              <BookOpen className="w-6 h-6 text-[#38bdf8]" />
            </div>
            <div className="text-left">
              <div className="text-[10px] font-black tracking-widest text-[#1d4ed8] uppercase">
                ESTD. 2026 • OFFICIAL GOVERNMENT AUDIT COMPLIANT
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight uppercase text-[#020617] leading-tight">
                UNITY EARNING <span className="text-[#1d4ed8]">E-LEARNING</span> <span className="text-[#047857]">PLATFORM</span>
              </h1>
            </div>
          </div>

          <p className="text-xs sm:text-sm font-semibold tracking-wider text-[#475569] uppercase mt-0.5">
            Department of Human Resources, Payroll & Financial Accounts
          </p>

          {/* Official Document Title Ribbon */}
          <div className="mt-4 mb-4">
            <div
              className="px-8 py-2.5 text-white font-black text-base sm:text-lg tracking-widest rounded-md uppercase shadow-sm border border-[#1e293b] flex items-center gap-3"
              style={{
                background: 'linear-gradient(to right, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)',
              }}
            >
              <span className="w-2 h-2 rounded-full bg-[#34d399]"></span>
              <span>
                {sectionFilter === 'leaders'
                  ? 'SALARY SHEET — TEAM LEADERS'
                  : sectionFilter === 'trainers'
                  ? 'SALARY SHEET — TEAM TRAINERS'
                  : documentTitle}
              </span>
              <span className="text-[#94a3b8] font-normal">|</span>
              <span className="text-xs font-bold tracking-wider text-[#cbd5e1]">
                DISBURSEMENT LEDGER
              </span>
              <span className="w-2 h-2 rounded-full bg-[#34d399]"></span>
            </div>
          </div>

          {/* Structured 4-Column Official Metadata Grid */}
          <div className="w-full max-w-3xl grid grid-cols-2 sm:grid-cols-4 gap-2 text-left mt-1">
            <div
              className="rounded p-2.5 border"
              style={{ backgroundColor: '#f8fafc', borderColor: '#cbd5e1' }}
            >
              <span className="flex items-center gap-1 text-[10px] font-bold text-[#64748b] uppercase tracking-wider">
                <Calendar className="w-3 h-3 text-[#2563eb]" />
                Disbursement Period
              </span>
              <strong className="block text-xs font-black text-[#0f172a] mt-0.5 font-mono">
                {periodMonth}
              </strong>
            </div>

            <div
              className="rounded p-2.5 border"
              style={{ backgroundColor: '#f8fafc', borderColor: '#cbd5e1' }}
            >
              <span className="flex items-center gap-1 text-[10px] font-bold text-[#64748b] uppercase tracking-wider">
                <Hash className="w-3 h-3 text-[#4f46e5]" />
                Ledger Ref No.
              </span>
              <strong className="block text-xs font-black text-[#0f172a] mt-0.5 font-mono">
                UEP-PR-2026/09
              </strong>
            </div>

            <div
              className="rounded p-2.5 border"
              style={{ backgroundColor: '#f8fafc', borderColor: '#cbd5e1' }}
            >
              <span className="flex items-center gap-1 text-[10px] font-bold text-[#64748b] uppercase tracking-wider">
                <DollarSign className="w-3 h-3 text-[#059669]" />
                Disbursement Currency
              </span>
              <strong className="block text-xs font-black text-[#0f172a] mt-0.5">
                BDT (Taka - ৳)
              </strong>
            </div>

            <div
              className="rounded p-2.5 border"
              style={{ backgroundColor: '#ecfdf5', borderColor: '#6ee7b7' }}
            >
              <span className="flex items-center gap-1 text-[10px] font-bold text-[#047857] uppercase tracking-wider">
                <CheckCircle2 className="w-3 h-3 text-[#059669]" />
                Verification Status
              </span>
              <strong className="block text-xs font-black text-[#064e3b] mt-0.5">
                Approved & Validated
              </strong>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================
          1. TEAM LEADERS SECTION - EXCEL-STYLE UNIFORM GRID
         ======================================================== */}
      {(sectionFilter === 'all' || sectionFilter === 'leaders') && (
        <div className="mb-8">
          {/* Section Header Banner with Excel Sheet Tab Style */}
          <div className="bg-[#1e4b85] text-white py-2 px-4 font-black text-sm tracking-wider uppercase border border-[#1e4b85] flex items-center justify-between shadow-xs">
          <span className="text-[11px] bg-white/20 px-2 py-0.5 rounded font-mono font-bold tracking-normal">
            TAB 01: LEADERS
          </span>
          <span className="tracking-widest font-black">SALARY SHEET — TEAM LEADERS</span>
          <span className="text-[11px] bg-white/20 px-2 py-0.5 rounded font-mono font-bold tracking-normal">
            CONVERSION RATE: 60 BDT
          </span>
        </div>

        <div className="overflow-x-auto">
          {/* Authentic Excel Table with Uniform 1px Clean Borders Across All Cells */}
          <table className="w-full text-xs text-left border-collapse border border-slate-300">
            <thead>
              <tr className="text-[11px] font-bold uppercase tracking-wider text-center">
                <th className="py-2.5 px-2 border border-slate-300 w-12 bg-[#334155] text-white">NO</th>
                <th className="py-2.5 px-3 border border-slate-300 text-left bg-[#1e293b] text-white min-w-[190px]">EMPLOYEE NAME</th>
                <th className="py-2.5 px-2 border border-slate-300 w-24 bg-[#1d4ed8] text-white">CONVERT</th>
                <th className="py-2.5 px-3 border border-slate-300 w-28 bg-[#0284c7] text-white">BALANCE</th>
                <th className="py-2.5 px-2 border border-slate-300 w-20 bg-[#64748b] text-white">TARGET</th>
                <th className="py-2.5 px-2 border border-slate-300 w-20 bg-[#d97706] text-white">BONUS</th>
                <th className="py-2.5 px-3 border border-slate-300 w-24 bg-[#7c3aed] text-white">INCENTIVE</th>
                <th className="py-2.5 px-2 border border-slate-300 w-20 bg-[#dc2626] text-white font-black">FINE</th>
                <th className="py-2.5 px-4 border border-slate-300 w-32 bg-[#059669] text-white font-black">TOTAL AMOUNT</th>
              </tr>
            </thead>
            <tbody>
              {teamLeaders.map((emp, index) => {
                const balance = getEmployeeBalance(emp, RATE_TEAM_LEADER);
                const totalAmount = getEmployeeTotalAmount(emp, RATE_TEAM_LEADER);
                const bonusVal = parseNumber(emp.bonus);
                const fineVal = parseNumber(emp.fine);

                return (
                  <tr
                    key={emp.id || index}
                    className="hover:bg-slate-100/60 transition-colors font-medium text-slate-800"
                  >
                    {/* NO - Crisp Gray Excel Box (Uniform 1px border) */}
                    <td className="py-2 px-2 text-center border border-slate-300 font-bold text-slate-700 bg-[#f1f5f9]">
                      {index + 1}
                    </td>

                    {/* NAME - Distinct Peach Box (Uniform 1px border) */}
                    <td className="py-2 px-3 border border-slate-300 bg-[#fffbf2] text-slate-950 font-extrabold tracking-wide uppercase">
                      {emp.name || <span className="text-slate-400 italic font-normal">Empty</span>}
                    </td>

                    {/* CONVERT - Ice Blue Box (Uniform 1px border) */}
                    <td className="py-2 px-2 text-center border border-slate-300 font-bold text-blue-950 tabular-nums bg-[#eff6ff]">
                      {emp.convert === '' ? 0 : emp.convert}
                    </td>

                    {/* BALANCE - Sky Cyan Box (Uniform 1px border) */}
                    <td className="py-2 px-3 text-right border border-slate-300 tabular-nums font-extrabold text-sky-950 bg-[#e0f2fe]">
                      {formatBDT(balance)}
                    </td>

                    {/* TARGET - Clean Slate Box (Uniform 1px border) */}
                    <td className="py-2 px-2 text-center border border-slate-300 tabular-nums text-slate-700 bg-[#f8fafc]">
                      {emp.target === '' ? '-' : emp.target}
                    </td>

                    {/* BONUS - Golden Amber Box (Uniform 1px border) */}
                    <td className="py-2 px-2 text-center border border-slate-300 tabular-nums font-bold text-amber-950 bg-[#fef3c7]">
                      {bonusVal > 0 ? (
                        <span>{formatBDT(bonusVal)}</span>
                      ) : (
                        <span className="text-amber-700/60 font-medium">NO</span>
                      )}
                    </td>

                    {/* INCENTIVE - Violet Box (Uniform 1px border) */}
                    <td className="py-2 px-3 text-right border border-slate-300 tabular-nums font-bold text-purple-950 bg-[#f3e8ff]">
                      {emp.incentive === '' || parseNumber(emp.incentive) === 0
                        ? '-'
                        : formatBDT(emp.incentive)}
                    </td>

                    {/* FINE - Soft Red Cell Box (Uniform 1px border, similar to all cells) */}
                    <td className="py-2 px-2 text-center border border-slate-300 tabular-nums font-black text-red-700 bg-[#fee2e2]">
                      {fineVal > 0 ? (
                        <span>-{formatBDT(fineVal)}</span>
                      ) : (
                        <span className="text-red-400 font-semibold">0</span>
                      )}
                    </td>

                    {/* TOTAL AMOUNT - Soft Emerald Box (Uniform 1px border, similar to all cells) */}
                    <td className="py-2 px-4 text-right font-black text-emerald-950 tabular-nums bg-[#dcfce7] border border-slate-300 text-sm">
                      ৳ {formatBDT(totalAmount)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      )}

      {/* ========================================================
          2. TEAM TRAINERS SECTION - EXCEL-STYLE UNIFORM GRID
         ======================================================== */}
      {(sectionFilter === 'all' || sectionFilter === 'trainers') && (
        <div className="mb-8">
          {/* Section Header Banner with Excel Sheet Tab Style */}
          <div className="bg-[#1f6834] text-white py-2 px-4 font-black text-sm tracking-wider uppercase border border-[#1f6834] flex items-center justify-between shadow-xs">
          <span className="text-[11px] bg-white/20 px-2 py-0.5 rounded font-mono font-bold tracking-normal">
            TAB 02: TRAINERS
          </span>
          <span className="tracking-widest font-black">SALARY SHEET — TEAM TRAINERS</span>
          <span className="text-[11px] bg-white/20 px-2 py-0.5 rounded font-mono font-bold tracking-normal">
            CONVERSION RATE: 50 BDT
          </span>
        </div>

        <div className="overflow-x-auto">
          {/* Authentic Excel Table with Uniform 1px Clean Borders Across All Cells */}
          <table className="w-full text-xs text-left border-collapse border border-slate-300">
            <thead>
              <tr className="text-[11px] font-bold uppercase tracking-wider text-center">
                <th className="py-2.5 px-2 border border-slate-300 w-12 bg-[#334155] text-white">NO</th>
                <th className="py-2.5 px-3 border border-slate-300 text-left bg-[#1e293b] text-white min-w-[190px]">EMPLOYEE NAME</th>
                <th className="py-2.5 px-2 border border-slate-300 w-24 bg-[#1d4ed8] text-white">CONVERT</th>
                <th className="py-2.5 px-3 border border-slate-300 w-28 bg-[#0284c7] text-white">BALANCE</th>
                <th className="py-2.5 px-2 border border-slate-300 w-20 bg-[#64748b] text-white">TARGET</th>
                <th className="py-2.5 px-2 border border-slate-300 w-20 bg-[#d97706] text-white">BONUS</th>
                <th className="py-2.5 px-3 border border-slate-300 w-24 bg-[#7c3aed] text-white">INCENTIVE</th>
                <th className="py-2.5 px-2 border border-slate-300 w-20 bg-[#dc2626] text-white font-black">FINE</th>
                <th className="py-2.5 px-4 border border-slate-300 w-32 bg-[#059669] text-white font-black">TOTAL AMOUNT</th>
              </tr>
            </thead>
            <tbody>
              {teamTrainers.map((emp, index) => {
                const balance = getEmployeeBalance(emp, RATE_TEAM_TRAINER);
                const totalAmount = getEmployeeTotalAmount(emp, RATE_TEAM_TRAINER);
                const bonusVal = parseNumber(emp.bonus);
                const fineVal = parseNumber(emp.fine);

                return (
                  <tr
                    key={emp.id || index}
                    className="hover:bg-slate-100/60 transition-colors font-medium text-slate-800"
                  >
                    {/* NO - Crisp Gray Excel Box (Uniform 1px border) */}
                    <td className="py-2 px-2 text-center border border-slate-300 font-bold text-slate-700 bg-[#f1f5f9]">
                      {index + 1}
                    </td>

                    {/* NAME - Distinct Mint Box (Uniform 1px border) */}
                    <td className="py-2 px-3 border border-slate-300 bg-[#f0fdf4] text-slate-950 font-extrabold tracking-wide uppercase">
                      {emp.name || <span className="text-slate-400 italic font-normal">Empty</span>}
                    </td>

                    {/* CONVERT - Ice Blue Box (Uniform 1px border) */}
                    <td className="py-2 px-2 text-center border border-slate-300 font-bold text-blue-950 tabular-nums bg-[#eff6ff]">
                      {emp.convert === '' ? 0 : emp.convert}
                    </td>

                    {/* BALANCE - Sky Cyan Box (Uniform 1px border) */}
                    <td className="py-2 px-3 text-right border border-slate-300 tabular-nums font-extrabold text-sky-950 bg-[#e0f2fe]">
                      {formatBDT(balance)}
                    </td>

                    {/* TARGET - Clean Slate Box (Uniform 1px border) */}
                    <td className="py-2 px-2 text-center border border-slate-300 tabular-nums text-slate-700 bg-[#f8fafc]">
                      {emp.target === '' ? '-' : emp.target}
                    </td>

                    {/* BONUS - Golden Amber Box (Uniform 1px border) */}
                    <td className="py-2 px-2 text-center border border-slate-300 tabular-nums font-bold text-amber-950 bg-[#fef3c7]">
                      {bonusVal > 0 ? (
                        <span>{formatBDT(bonusVal)}</span>
                      ) : (
                        <span className="text-amber-700/60 font-medium">NO</span>
                      )}
                    </td>

                    {/* INCENTIVE - Violet Box (Uniform 1px border) */}
                    <td className="py-2 px-3 text-right border border-slate-300 tabular-nums font-bold text-purple-950 bg-[#f3e8ff]">
                      {emp.incentive === '' || parseNumber(emp.incentive) === 0
                        ? '-'
                        : formatBDT(emp.incentive)}
                    </td>

                    {/* FINE - Soft Red Cell Box (Uniform 1px border, similar to all cells) */}
                    <td className="py-2 px-2 text-center border border-slate-300 tabular-nums font-black text-red-700 bg-[#fee2e2]">
                      {fineVal > 0 ? (
                        <span>-{formatBDT(fineVal)}</span>
                      ) : (
                        <span className="text-red-400 font-semibold">0</span>
                      )}
                    </td>

                    {/* TOTAL AMOUNT - Soft Emerald Box (Uniform 1px border, similar to all cells) */}
                    <td className="py-2 px-4 text-right font-black text-emerald-950 tabular-nums bg-[#dcfce7] border border-slate-300 text-sm">
                      ৳ {formatBDT(totalAmount)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      )}

      {/* ========================================================
          3. EXECUTIVE ADMIN VERIFICATION & SIGNATURE
         ======================================================== */}
      <AdminVerification
        generatedDate={generatedDate}
        generatedTime={generatedTime}
        adminName={adminName}
        adminRole={adminRole}
      />
    </div>
  );
};
