import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';

interface ClearAllModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const ClearAllModal: React.FC<ClearAllModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-md w-full overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-rose-600 px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2 font-black text-base tracking-wide uppercase">
            <Trash2 className="w-5 h-5 text-rose-200" />
            <span>All Clear Confirmation</span>
          </div>
          <button
            onClick={onClose}
            className="cursor-pointer p-1 rounded-md text-rose-200 hover:text-white hover:bg-rose-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="flex items-start gap-3.5 p-3.5 bg-rose-50 border border-rose-200 rounded-xl">
            <AlertTriangle className="w-6 h-6 text-rose-600 shrink-0 mt-0.5" />
            <div className="text-xs text-rose-900 leading-relaxed">
              <p className="font-extrabold text-sm text-rose-950 mb-1">
                পুরো ফর্মটি খালি (All Clear) করতে চান?
              </p>
              <p>
                This will clear all current employee rows from both{' '}
                <strong>Team Leaders</strong> and <strong>Team Trainers</strong>,
                allowing you to input fresh payroll data from scratch.
              </p>
            </div>
          </div>

          <p className="text-xs text-slate-500">
            Note: You can always restore the original demo reference data from{' '}
            <strong className="text-slate-700">Edit Info &gt; Reset</strong> if needed.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-2.5">
          <button
            onClick={onClose}
            className="cursor-pointer px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-800 hover:bg-slate-200 rounded-lg transition-colors"
          >
            Cancel (বাতিল)
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="cursor-pointer inline-flex items-center gap-1.5 px-4 py-2 text-xs font-extrabold text-white bg-rose-600 hover:bg-rose-700 active:bg-rose-800 rounded-lg shadow-sm transition-all"
          >
            <Trash2 className="w-4 h-4" />
            <span>Yes, All Clear (সব মুছুন)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
