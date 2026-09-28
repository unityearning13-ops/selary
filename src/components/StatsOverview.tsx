import React from 'react';
import { SectionTotals } from '../types/salary';
import { formatBDT } from '../utils/calculations';
import { DollarSign, Users, Award, ShieldAlert, ArrowUpRight, TrendingUp } from 'lucide-react';

interface StatsOverviewProps {
  leaderTotals: SectionTotals;
  trainerTotals: SectionTotals;
  leaderCount: number;
  trainerCount: number;
}

export const StatsOverview: React.FC<StatsOverviewProps> = ({
  leaderTotals,
  trainerTotals,
  leaderCount,
  trainerCount,
}) => {
  const totalEmployees = leaderCount + trainerCount;
  const grandTotalPayout = leaderTotals.totalAmount + trainerTotals.totalAmount;
  const grandTotalConverts = leaderTotals.totalConvert + trainerTotals.totalConvert;
  const grandTotalBonusIncentive =
    leaderTotals.totalBonus +
    leaderTotals.totalIncentive +
    trainerTotals.totalBonus +
    trainerTotals.totalIncentive;
  const grandTotalFine = leaderTotals.totalFine + trainerTotals.totalFine;

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6 no-print">
      {/* 1. Grand Total Payout */}
      <div className="bg-slate-900 text-white p-4 rounded-xl shadow-xs border border-slate-800 col-span-2 sm:col-span-1 lg:col-span-2">
        <div className="flex items-center justify-between text-xs text-slate-400 font-semibold uppercase">
          <span>Net Payroll Budget</span>
          <div className="p-1 rounded bg-emerald-500/20 text-emerald-400">
            <DollarSign className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-1">
          <span className="text-2xl sm:text-3xl font-black text-emerald-400 tracking-tight">
            ৳ {formatBDT(grandTotalPayout)}
          </span>
        </div>
        <div className="mt-1 text-[11px] text-slate-400 flex items-center gap-1.5">
          <span className="text-emerald-400 font-bold">100% Calculated</span>
          <span>• Leaders & Trainers Combined</span>
        </div>
      </div>

      {/* 2. Team Leaders Subtotal */}
      <div className="bg-white p-3.5 rounded-xl shadow-2xs border border-slate-200">
        <div className="flex items-center justify-between text-[11px] text-slate-500 font-bold uppercase">
          <span>Team Leaders</span>
          <span className="text-xs font-black text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded">
            {leaderCount}
          </span>
        </div>
        <div className="mt-2 text-xl font-bold text-blue-950">
          ৳ {formatBDT(leaderTotals.totalAmount)}
        </div>
        <div className="mt-1 text-[11px] text-slate-500">
          Rate: <span className="font-semibold text-slate-700">60 BDT / conv</span>
        </div>
      </div>

      {/* 3. Team Trainers Subtotal */}
      <div className="bg-white p-3.5 rounded-xl shadow-2xs border border-slate-200">
        <div className="flex items-center justify-between text-[11px] text-slate-500 font-bold uppercase">
          <span>Team Trainers</span>
          <span className="text-xs font-black text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
            {trainerCount}
          </span>
        </div>
        <div className="mt-2 text-xl font-bold text-emerald-950">
          ৳ {formatBDT(trainerTotals.totalAmount)}
        </div>
        <div className="mt-1 text-[11px] text-slate-500">
          Rate: <span className="font-semibold text-slate-700">50 BDT / conv</span>
        </div>
      </div>

      {/* 4. Total Conversions */}
      <div className="bg-white p-3.5 rounded-xl shadow-2xs border border-slate-200">
        <div className="flex items-center justify-between text-[11px] text-slate-500 font-bold uppercase">
          <span>Conversions</span>
          <TrendingUp className="w-3.5 h-3.5 text-indigo-500" />
        </div>
        <div className="mt-2 text-xl font-bold text-indigo-950">
          {grandTotalConverts}
        </div>
        <div className="mt-1 text-[11px] text-slate-500">
          Across <span className="font-semibold text-slate-700">{totalEmployees} staff</span>
        </div>
      </div>

      {/* 5. Deductions / Fine */}
      <div className="bg-white p-3.5 rounded-xl shadow-2xs border border-slate-200">
        <div className="flex items-center justify-between text-[11px] text-slate-500 font-bold uppercase">
          <span>Penalties (Fine)</span>
          <ShieldAlert className="w-3.5 h-3.5 text-rose-500" />
        </div>
        <div className="mt-2 text-xl font-bold text-rose-700">
          {grandTotalFine > 0 ? `-৳${formatBDT(grandTotalFine)}` : '৳0'}
        </div>
        <div className="mt-1 text-[11px] text-slate-500">
          Deducted from gross
        </div>
      </div>
    </div>
  );
};
