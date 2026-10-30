import React from 'react';
import { X, CheckCircle, Info, Calculator, ShieldCheck } from 'lucide-react';

interface ReferenceViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ReferenceViewerModal: React.FC<ReferenceViewerModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="px-5 py-4 bg-slate-900 text-white flex justify-between items-center">
          <div className="flex items-center gap-2 font-bold text-sm">
            <Info className="w-4 h-4 text-blue-400" />
            <span>Official Salary Sheet Reference & Rules</span>
          </div>
          <button
            onClick={onClose}
            className="cursor-pointer p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-5 text-slate-700 text-sm">
          <div className="p-4 bg-blue-50/80 border border-blue-200 rounded-lg">
            <h3 className="font-extrabold text-blue-950 uppercase tracking-wide flex items-center gap-2 mb-2">
              <Calculator className="w-4 h-4 text-blue-600" />
              1. Team Leader Rules
            </h3>
            <ul className="list-disc pl-5 space-y-1.5 text-xs text-blue-900 font-medium">
              <li><strong>Conversion Rate:</strong> 1 Convert = 60 BDT</li>
              <li><strong>Balance Formula:</strong> Balance = Convert × 60 (auto-calculated, manually editable)</li>
              <li><strong>Target & Incentive Rule:</strong>
                <ul className="list-circle pl-4 mt-0.5 space-y-0.5 text-slate-800">
                  <li>Convert ≥ Target: Incentive স্বয়ংক্রিয়ভাবে <strong>৳১,০০০</strong> যোগ হবে।</li>
                  <li>Convert &lt; Target: Incentive স্বয়ংক্রিয়ভাবে <strong>Convert × ১০</strong> টাকা যোগ হবে।</li>
                </ul>
              </li>
              <li><strong>Total Formula:</strong> Balance + Bonus + Incentive - Fine</li>
              <li><strong>Header Style:</strong> Classic Corporate Deep Blue with peach name column</li>
            </ul>
          </div>

          <div className="p-4 bg-emerald-50/80 border border-emerald-200 rounded-lg">
            <h3 className="font-extrabold text-emerald-950 uppercase tracking-wide flex items-center gap-2 mb-2">
              <Calculator className="w-4 h-4 text-emerald-600" />
              2. Team Trainer Rules
            </h3>
            <ul className="list-disc pl-5 space-y-1.5 text-xs text-emerald-900 font-medium">
              <li><strong>Conversion Rate:</strong> 1 Convert = 50 BDT</li>
              <li><strong>Balance Formula:</strong> Balance = Convert × 50 (auto-calculated, manually editable)</li>
              <li><strong>Target & Incentive Rule:</strong>
                <ul className="list-circle pl-4 mt-0.5 space-y-0.5 text-slate-800">
                  <li>Convert ≥ Target: Incentive স্বয়ংক্রিয়ভাবে <strong>৳৫০০</strong> যোগ হবে।</li>
                  <li>Convert &lt; Target: Incentive স্বয়ংক্রিয়ভাবে <strong>Convert × ১০</strong> টাকা যোগ হবে।</li>
                </ul>
              </li>
              <li><strong>Total Formula:</strong> Balance + Bonus + Incentive - Fine</li>
              <li><strong>Header Style:</strong> Forest Green with soft mint green name column</li>
            </ul>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
            <h3 className="font-extrabold text-slate-900 uppercase tracking-wide flex items-center gap-2 mb-2">
              <ShieldCheck className="w-4 h-4 text-slate-700" />
              3. Verification & Deductions
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              <strong>Fine:</strong> Represents financial penalty/deduction subtracted directly from final payable amount.
              <br />
              <strong>Audit:</strong> Authorized by Admin <strong>JIHADUL ISLAM</strong> with automatic generation timestamp and official verification seal.
            </p>
          </div>
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="cursor-pointer px-5 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-xs"
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
};
