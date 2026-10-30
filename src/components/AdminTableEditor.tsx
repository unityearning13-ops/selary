import React, { useState, useRef } from 'react';
import { Employee } from '../types/salary';
import {
  RATE_TEAM_LEADER,
  RATE_TEAM_TRAINER,
  calculateSectionTotals,
  getEmployeeBalance,
  getEmployeeTotalAmount,
  formatBDT,
  parseNumber,
} from '../utils/calculations';
import { Plus, Trash2, RotateCcw, Search, Table2, Check } from 'lucide-react';

interface AdminTableEditorProps {
  role: 'leader' | 'trainer';
  employees: Employee[];
  onUpdateEmployees: (updated: Employee[]) => void;
  sectionTitle?: string;
  rate?: number;
  rateLabel?: string;
}

export const AdminTableEditor: React.FC<AdminTableEditorProps> = ({
  role,
  employees,
  onUpdateEmployees,
  sectionTitle,
  rate,
  rateLabel,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [bottomNewName, setBottomNewName] = useState('');
  const [addedToast, setAddedToast] = useState<string | null>(null);
  const [deletedHistory, setDeletedHistory] = useState<{ emp: Employee; index: number } | null>(null);
  const tableRef = useRef<HTMLTableElement>(null);

  const isLeader = role === 'leader';
  const effectiveSectionTitle = sectionTitle || (isLeader ? 'TEAM LEADERS' : 'TEAM TRAINERS');
  const effectiveRate = rate ?? (isLeader ? RATE_TEAM_LEADER : RATE_TEAM_TRAINER);
  const effectiveRateLabel = rateLabel || (isLeader ? 'Convert × 60' : 'Convert × 50');

  const handleFieldChange = (
    index: number,
    field: keyof Employee,
    value: string | number
  ) => {
    const updated = [...employees];
    const currentEmp = { ...updated[index] };

    if (field === 'name') {
      currentEmp.name = String(value);
    } else if (field === 'convert') {
      currentEmp.convert = value === '' ? '' : Math.max(0, Number(value));
      // Auto-update balance if not manually overridden
      if (!currentEmp.isBalanceOverridden) {
        const conv = parseNumber(currentEmp.convert);
        currentEmp.balance = conv === 0 ? '' : conv * effectiveRate;
      }
    } else if (field === 'balance') {
      if (value === '') {
        currentEmp.balance = '';
        currentEmp.isBalanceOverridden = false;
      } else {
        currentEmp.balance = Math.max(0, Number(value));
        currentEmp.isBalanceOverridden = true;
      }
    } else if (field === 'target') {
      currentEmp.target = value === '' ? '' : Math.max(0, Number(value));
    } else if (field === 'bonus') {
      currentEmp.bonus = value === '' ? '' : Math.max(0, Number(value));
    } else if (field === 'incentive') {
      currentEmp.incentive = value === '' ? '' : Math.max(0, Number(value));
    } else if (field === 'fine') {
      currentEmp.fine = value === '' ? '' : Math.max(0, Number(value));
    }

    updated[index] = currentEmp;
    onUpdateEmployees(updated);
  };

  const handleResetBalanceToAuto = (index: number) => {
    const updated = [...employees];
    const currentEmp = { ...updated[index] };
    const conv = parseNumber(currentEmp.convert);
    currentEmp.balance = conv * effectiveRate;
    currentEmp.isBalanceOverridden = false;
    updated[index] = currentEmp;
    onUpdateEmployees(updated);
  };

  const handleAddEmployee = (nameToAdd?: string) => {
    // 1. Always clear search term so the newly added row is guaranteed to be visible!
    setSearchTerm('');

    // 2. Check if name was provided via input or fallback
    const rawName = typeof nameToAdd === 'string' && nameToAdd.trim().length > 0
      ? nameToAdd.trim().toUpperCase()
      : (bottomNewName.trim().length > 0 ? bottomNewName.trim().toUpperCase() : '');

    const newId = `${role}-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
    const newEmp: Employee = {
      id: newId,
      name: rawName,
      convert: '',
      balance: '',
      isBalanceOverridden: false,
      target: '',
      bonus: '',
      incentive: '',
      fine: '',
    };

    onUpdateEmployees([...employees, newEmp]);
    setBottomNewName('');

    // Visual confirmation toast
    const toastLabel = rawName ? `"${rawName}" added!` : 'New row added at the bottom!';
    setAddedToast(toastLabel);
    setTimeout(() => setAddedToast(null), 3000);

    // Smooth scroll down to the new row
    setTimeout(() => {
      const tableEl = tableRef.current;
      if (tableEl) {
        const lastRow = tableEl.querySelector('tbody tr:last-child');
        if (lastRow) {
          lastRow.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          const nameInput = lastRow.querySelector('input') as HTMLInputElement;
          if (nameInput && !rawName) {
            nameInput.focus();
          }
        }
      }
    }, 120);
  };

  const handleDeleteEmployee = (empToDelete: Employee, targetIndex: number) => {
    // Delete immediately without window.confirm (which browsers block inside iframes)
    const updated = employees.filter((emp, i) => {
      if (empToDelete.id && emp.id) {
        return emp.id !== empToDelete.id;
      }
      return i !== targetIndex;
    });

    onUpdateEmployees(updated);
    setDeletedHistory({ emp: empToDelete, index: targetIndex });

    const confirmName = empToDelete.name ? `"${empToDelete.name}"` : `Row #${targetIndex + 1}`;
    setAddedToast(`${confirmName} deleted.`);
    setTimeout(() => {
      setAddedToast(null);
    }, 4500);
  };

  const handleUndoDelete = () => {
    if (!deletedHistory) return;
    const { emp, index } = deletedHistory;
    const restored = [...employees];
    restored.splice(Math.min(index, restored.length), 0, emp);
    onUpdateEmployees(restored);
    setDeletedHistory(null);
    const label = emp.name ? `"${emp.name}"` : `Row`;
    setAddedToast(`Restored ${label}!`);
    setTimeout(() => setAddedToast(null), 3000);
  };

  // Filtered list for search preview
  const filteredIndices = employees
    .map((emp, index) => ({ emp, index }))
    .filter(({ emp }) =>
      emp.name.toLowerCase().includes(searchTerm.toLowerCase().trim())
    );

  // Sorted list for display and rank numbering
  const sortedRows = [...filteredIndices].sort((a, b) => {
    const convA = parseNumber(a.emp.convert);
    const convB = parseNumber(b.emp.convert);
    return convB - convA;
  });

  return (
    <div className="bg-white rounded-xl shadow-md border-2 border-slate-400 overflow-hidden mb-8">
      {/* Top Banner with Excel Workbook Feel */}
      <div
        className={`px-5 py-3.5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b-2 ${
          isLeader
            ? 'bg-[#1e4b85] text-white border-blue-900'
            : 'bg-[#1f6834] text-white border-emerald-900'
        }`}
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-white shrink-0">
            <Table2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-base sm:text-lg font-black tracking-wide uppercase">
                {effectiveSectionTitle}
              </span>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-white/20 text-white font-mono">
                {employees.length} ROWS
              </span>
              {addedToast && (
                <span className="inline-flex items-center gap-1 text-[11px] font-extrabold bg-emerald-500 text-white px-2 py-0.5 rounded shadow-xs animate-bounce">
                  <Check className="w-3 h-3" />
                  {addedToast}
                </span>
              )}
            </div>
            <p className="text-xs text-slate-200 mt-0.5">
              Formula: <code className="font-mono bg-black/20 px-1 py-0.5 rounded">Total = Balance + Bonus + Incentive - Fine</code> • Rate: <strong>{effectiveRateLabel}</strong>
            </p>
          </div>
        </div>

        {/* Top Search & Add Buttons */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-56">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-300" />
            <input
              type="text"
              placeholder={`Search name...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-7 py-1.5 text-xs rounded bg-white/15 text-white placeholder-slate-300 border border-white/30 focus:outline-none focus:bg-white/25 focus:ring-1 focus:ring-white"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-300 hover:text-white text-xs font-bold"
                title="Clear search filter"
              >
                ✕
              </button>
            )}
          </div>
          <button
            type="button"
            onClick={() => handleAddEmployee(searchTerm)}
            className="cursor-pointer inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded font-black text-xs uppercase tracking-wider bg-white text-slate-900 hover:bg-slate-100 active:bg-slate-200 transition-all shadow-sm shrink-0"
            title="Add a new row (will use typed text if any)"
          >
            <Plus className="w-4 h-4 text-emerald-600 font-bold" />
            <span>+ Add Row</span>
          </button>
        </div>
      </div>

      {/* Search Filter Notification Bar (if filtering) */}
      {searchTerm && (
        <div className="bg-amber-50 border-b border-amber-200 px-4 py-1.5 text-xs text-amber-900 flex items-center justify-between">
          <span>
            Filtering by: <strong>"{searchTerm}"</strong> ({filteredIndices.length} matches found)
          </span>
          <button
            type="button"
            onClick={() => setSearchTerm('')}
            className="cursor-pointer text-blue-700 underline font-bold hover:text-blue-900"
          >
            Clear Filter (Show All {employees.length} Rows)
          </button>
        </div>
      )}

      {/* Undo Delete Notification Bar */}
      {deletedHistory && (
        <div className="bg-rose-50 border-b border-rose-200 px-4 py-2 text-xs text-rose-950 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-rose-500"></span>
            <span>
              Removed <strong>{deletedHistory.emp.name || 'Row'}</strong> from {effectiveSectionTitle}.
            </span>
          </div>
          <button
            type="button"
            onClick={handleUndoDelete}
            className="cursor-pointer font-bold text-rose-700 hover:text-rose-900 bg-white hover:bg-rose-100 border border-rose-300 px-2.5 py-1 rounded shadow-2xs transition-colors flex items-center gap-1 text-xs"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Undo Delete</span>
          </button>
        </div>
      )}

      {/* Spreadsheet Grid Table with 4-Sided Cell Boxes */}
      <div className="overflow-x-auto">
        <table ref={tableRef} className="w-full text-left border-collapse border-2 border-slate-500 min-w-[1020px]">
          <thead>
            {/* Column Category & Letter Row (Like Excel Columns A, B, C...) */}
            <tr className="text-[10px] font-mono font-bold text-center border-b border-slate-400 bg-slate-200 text-slate-600">
              <th className="py-1 px-1 border-r border-slate-400 w-12">A</th>
              <th className="py-1 px-2 border-r border-slate-400 text-left">B</th>
              <th className="py-1 px-2 border-r border-slate-400 w-28">C</th>
              <th className="py-1 px-2 border-r border-slate-400 w-36">D</th>
              <th className="py-1 px-2 border-r border-slate-400 w-24">E</th>
              <th className="py-1 px-2 border-r border-slate-400 w-24">F</th>
              <th className="py-1 px-2 border-r border-slate-400 w-28">G</th>
              <th className="py-1 px-2 border-r border-slate-400 w-24 text-rose-700 font-black">H</th>
              <th className="py-1 px-3 border-r border-slate-400 w-36 text-emerald-900 font-black">I</th>
              <th className="py-1 px-1 w-14"></th>
            </tr>

            {/* Main Header Row with Distinct Background Colors */}
            <tr className="text-xs font-bold uppercase tracking-wider text-center border-b-2 border-slate-500">
              <th className="py-2.5 px-2 text-center w-12 border border-slate-500 bg-[#334155] text-white">
                NO
              </th>
              <th className="py-2.5 px-3 min-w-[190px] border border-slate-500 text-left bg-[#1e293b] text-white">
                EMPLOYEE NAME
              </th>
              <th className="py-2.5 px-2 w-28 text-center border border-slate-500 bg-[#1d4ed8] text-white">
                CONVERT <span className="block text-[10px] font-normal text-blue-200">(Input)</span>
              </th>
              <th className="py-2.5 px-3 w-36 text-center border border-slate-500 bg-[#0284c7] text-white">
                BALANCE <span className="block text-[10px] font-normal text-sky-200">(Auto / Edit)</span>
              </th>
              <th className="py-2.5 px-2 w-24 text-center border border-slate-500 bg-[#64748b] text-white">
                TARGET <span className="block text-[10px] font-normal text-slate-200">(Input)</span>
              </th>
              <th className="py-2.5 px-2 w-24 text-center border border-slate-500 bg-[#d97706] text-white">
                BONUS <span className="block text-[10px] font-normal text-amber-200">(Input)</span>
              </th>
              <th className="py-2.5 px-3 w-28 text-center border border-slate-500 bg-[#7c3aed] text-white">
                INCENTIVE <span className="block text-[10px] font-normal text-purple-200">(Input)</span>
              </th>
              <th className="py-2.5 px-2 w-24 text-center border border-slate-500 bg-[#dc2626] text-white font-black">
                FINE <span className="block text-[10px] font-normal text-rose-200">(- Penalty)</span>
              </th>
              <th className="py-2.5 px-3 w-36 text-right border border-slate-500 bg-[#059669] text-white font-black">
                TOTAL AMOUNT
              </th>
              <th className="py-2.5 px-1 w-14 text-center border border-slate-500 bg-[#0f172a] text-white">
                DEL
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedRows.length === 0 ? (
              <tr>
                <td colSpan={10} className="py-12 text-center text-slate-500 bg-slate-50">
                  {searchTerm ? (
                    <div className="space-y-3">
                      <p className="text-slate-700 font-semibold">No employee matches "{searchTerm}".</p>
                      <div className="flex justify-center items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleAddEmployee(searchTerm)}
                          className="cursor-pointer px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-bold shadow-sm"
                        >
                          + Add "{searchTerm}" as New Row
                        </button>
                        <button
                          type="button"
                          onClick={() => setSearchTerm('')}
                          className="cursor-pointer px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded text-xs font-bold"
                        >
                          Clear Filter
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <p className="font-semibold text-slate-700">No staff rows in this section.</p>
                      <button
                        type="button"
                        onClick={() => handleAddEmployee()}
                        className="cursor-pointer mt-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-bold shadow-sm"
                      >
                        + Add First Staff Row
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ) : (
              sortedRows.map(({ emp, index }, displayIdx) => {
                const autoBalance = parseNumber(emp.convert) * effectiveRate;
                const totalAmount = getEmployeeTotalAmount(emp, effectiveRate);

                return (
                  <tr
                    key={emp.id || `emp-${index}`}
                    className="hover:bg-slate-100/70 transition-colors"
                  >
                    {/* NO - Cell Box (Actual Rank) */}
                    <td className="py-2 px-2 text-center border border-slate-400 font-bold text-slate-700 bg-[#f1f5f9]">
                      {displayIdx + 1}
                    </td>

                    {/* NAME - Cell Box with Input */}
                    <td className={`p-1.5 border border-slate-400 ${isLeader ? 'bg-[#fff8ee]' : 'bg-[#f0fdf4]'}`}>
                      <input
                        type="text"
                        value={emp.name}
                        onChange={(e) => handleFieldChange(index, 'name', e.target.value)}
                        placeholder="Full Employee Name"
                        className={`w-full px-2.5 py-1.5 text-xs font-extrabold rounded border uppercase transition-colors ${
                          isLeader
                            ? 'border-orange-300 bg-white text-slate-950 focus:border-orange-600 focus:ring-1 focus:ring-orange-500'
                            : 'border-emerald-300 bg-white text-slate-950 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-500'
                        }`}
                      />
                    </td>

                    {/* CONVERT - Cell Box with Input */}
                    <td className="p-1.5 border border-slate-400 bg-[#eff6ff]">
                      <input
                        type="number"
                        min="0"
                        value={emp.convert === 0 || emp.convert === '' ? '' : emp.convert}
                        onFocus={(e) => e.target.select()}
                        onChange={(e) => handleFieldChange(index, 'convert', e.target.value)}
                        placeholder=""
                        className="w-full px-2 py-1.5 text-xs font-bold text-center rounded border border-blue-300 bg-white text-blue-950 focus:border-blue-600 focus:ring-1 focus:ring-blue-500"
                      />
                    </td>

                    {/* BALANCE - Cell Box with Auto/Manual Input */}
                    <td className="p-1.5 border border-slate-400 bg-[#e0f2fe]">
                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          min="0"
                          value={emp.balance === 0 || emp.balance === '' ? '' : emp.balance}
                          onFocus={(e) => e.target.select()}
                          onChange={(e) => handleFieldChange(index, 'balance', e.target.value)}
                          placeholder={autoBalance > 0 ? String(autoBalance) : ''}
                          className={`w-full px-2 py-1.5 text-xs font-black text-right rounded border transition-colors ${
                            emp.isBalanceOverridden
                              ? 'border-amber-400 bg-amber-50 text-amber-950 focus:ring-1 focus:ring-amber-500'
                              : 'border-sky-300 bg-white text-sky-950 focus:border-sky-600 focus:ring-1 focus:ring-sky-500'
                          }`}
                        />
                        {emp.isBalanceOverridden && (
                          <button
                            type="button"
                            title="Reset to automatic calculation (Convert × Rate)"
                            onClick={() => handleResetBalanceToAuto(index)}
                            className="cursor-pointer p-1 text-amber-700 hover:text-amber-900 hover:bg-amber-100 rounded"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                      <div className="flex items-center justify-between text-[10px] text-sky-800 mt-0.5 px-1 font-semibold">
                        <span>{emp.isBalanceOverridden ? 'Manual' : (autoBalance > 0 ? `Auto: ৳${autoBalance}` : 'Auto')}</span>
                      </div>
                    </td>

                    {/* TARGET - Cell Box with Input */}
                    <td className="p-1.5 border border-slate-400 bg-[#f8fafc]">
                      <input
                        type="number"
                        min="0"
                        value={emp.target === 0 || emp.target === '' ? '' : emp.target}
                        onFocus={(e) => e.target.select()}
                        onChange={(e) => handleFieldChange(index, 'target', e.target.value)}
                        placeholder=""
                        className="w-full px-2 py-1.5 text-xs text-center rounded border border-slate-300 bg-white text-slate-800 focus:border-slate-500 focus:ring-1 focus:ring-slate-400"
                      />
                    </td>

                    {/* BONUS - Cell Box with Input */}
                    <td className="p-1.5 border border-slate-400 bg-[#fef3c7]">
                      <input
                        type="number"
                        min="0"
                        value={emp.bonus === 0 || emp.bonus === '' ? '' : emp.bonus}
                        onFocus={(e) => e.target.select()}
                        onChange={(e) => handleFieldChange(index, 'bonus', e.target.value)}
                        placeholder=""
                        className="w-full px-2 py-1.5 text-xs text-center font-bold rounded border border-amber-300 bg-white text-amber-950 focus:border-amber-600 focus:ring-1 focus:ring-amber-500"
                      />
                    </td>

                    {/* INCENTIVE - Cell Box with Input */}
                    <td className="p-1.5 border border-slate-400 bg-[#ede9fe]">
                      <input
                        type="number"
                        min="0"
                        value={emp.incentive === 0 || emp.incentive === '' ? '' : emp.incentive}
                        onFocus={(e) => e.target.select()}
                        onChange={(e) => handleFieldChange(index, 'incentive', e.target.value)}
                        placeholder=""
                        className="w-full px-2 py-1.5 text-xs text-right font-bold rounded border border-purple-300 bg-white text-purple-950 focus:border-purple-600 focus:ring-1 focus:ring-purple-500"
                      />
                    </td>

                    {/* FINE - Distinct Red Cell Box with Input */}
                    <td className="p-1.5 border border-slate-400 bg-[#fee2e2]">
                      <input
                        type="number"
                        min="0"
                        value={emp.fine === 0 || emp.fine === '' ? '' : emp.fine}
                        onFocus={(e) => e.target.select()}
                        onChange={(e) => handleFieldChange(index, 'fine', e.target.value)}
                        placeholder=""
                        className="w-full px-2 py-1.5 text-xs text-center font-black rounded border border-red-400 bg-[#fff5f5] text-rose-700 placeholder-red-300 focus:border-red-600 focus:ring-1 focus:ring-red-400"
                      />
                    </td>

                    {/* TOTAL AMOUNT - Prominent Emerald Box (Uniform 1px border) */}
                    <td className="py-2 px-3 text-right border border-slate-400 font-black text-emerald-950 tabular-nums bg-[#dcfce7] text-sm">
                      ৳ {formatBDT(totalAmount)}
                    </td>

                    {/* DELETE ACTION - Cell Box */}
                    <td className="py-2 px-1 text-center border border-slate-400 bg-slate-50">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteEmployee(emp, index);
                        }}
                        className="cursor-pointer p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-100 active:bg-rose-200 rounded transition-colors"
                        title={`Delete ${emp.name || 'this row'}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Bottom Control & Add Row Bar */}
      <div className="p-3.5 bg-slate-100 border-t-2 border-slate-400 flex flex-col md:flex-row justify-between items-stretch md:items-center gap-3">
        {/* Left Side: Conversion rate and row count */}
        <div className="text-xs text-slate-700 flex items-center gap-2">
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
          <span>
            Rate: <strong className="text-slate-900 font-black">{effectiveRate} BDT</strong>/conv • Total: <strong className="text-slate-900">{employees.length}</strong> staff rows
          </span>
        </div>

        {/* Right Side: Type Name Directly + Add Row Button */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-72">
            <input
              type="text"
              value={bottomNewName}
              onChange={(e) => setBottomNewName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddEmployee(bottomNewName);
                }
              }}
              placeholder={`Type ${isLeader ? 'Leader' : 'Trainer'} name here...`}
              className="w-full px-3 py-2 text-xs font-bold rounded border border-slate-300 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 uppercase shadow-2xs"
            />
          </div>

          <button
            type="button"
            onClick={() => handleAddEmployee(bottomNewName)}
            className={`cursor-pointer shrink-0 inline-flex items-center justify-center gap-2 px-5 py-2 rounded font-black text-xs uppercase tracking-wider shadow-sm transition-all text-white ${
              isLeader
                ? 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800'
                : 'bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800'
            }`}
          >
            <Plus className="w-4 h-4" />
            <span>+ ADD ROW ({isLeader ? 'LEADER' : 'TRAINER'})</span>
          </button>
        </div>
      </div>
    </div>
  );
};
