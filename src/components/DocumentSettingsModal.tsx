import React from 'react';
import { SalarySheetMetadata } from '../types/salary';
import { X, Save, RotateCcw, Building2, Calendar, User, Shield } from 'lucide-react';

interface DocumentSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  metadata: SalarySheetMetadata;
  onSaveMetadata: (updated: SalarySheetMetadata) => void;
  onResetAllData: () => void;
}

export const DocumentSettingsModal: React.FC<DocumentSettingsModalProps> = ({
  isOpen,
  onClose,
  metadata,
  onSaveMetadata,
  onResetAllData,
}) => {
  const [formData, setFormData] = React.useState<SalarySheetMetadata>(metadata);
  const [showResetConfirm, setShowResetConfirm] = React.useState(false);

  React.useEffect(() => {
    setFormData(metadata);
    setShowResetConfirm(false);
  }, [metadata, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveMetadata(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="px-6 py-4 bg-slate-900 text-white flex justify-between items-center">
          <div className="flex items-center gap-2 font-bold text-base">
            <Shield className="w-5 h-5 text-blue-400" />
            <span>Document & Admin Settings</span>
          </div>
          <button
            onClick={onClose}
            className="cursor-pointer p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
              Company Name
            </label>
            <div className="relative">
              <Building2 className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={formData.companyName}
                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-bold uppercase"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
              Document Title
            </label>
            <input
              type="text"
              value={formData.documentTitle}
              onChange={(e) => setFormData({ ...formData, documentTitle: e.target.value })}
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-bold uppercase"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                Disbursement Period / Month
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={formData.periodMonth}
                  onChange={(e) => setFormData({ ...formData, periodMonth: e.target.value })}
                  placeholder="e.g. September 2026"
                  className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-semibold"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                Admin Role Designation
              </label>
              <input
                type="text"
                value={formData.adminRole}
                onChange={(e) => setFormData({ ...formData, adminRole: e.target.value })}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 font-bold uppercase"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
              Authorized Administrator Name
            </label>
            <div className="relative">
              <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={formData.adminName}
                onChange={(e) => setFormData({ ...formData, adminName: e.target.value })}
                className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 font-bold uppercase"
              />
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Used in the official verification section and signature block at the bottom of the document.
            </p>
          </div>

          <div className="pt-4 border-t border-slate-200 flex flex-wrap justify-between items-center gap-3">
            {showResetConfirm ? (
              <div className="flex items-center gap-2">
                <span className="text-xs text-rose-700 font-bold">Reset all data?</span>
                <button
                  type="button"
                  onClick={() => {
                    onResetAllData();
                    setShowResetConfirm(false);
                    onClose();
                  }}
                  className="cursor-pointer text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 px-2.5 py-1 rounded shadow-xs"
                >
                  Yes, Reset
                </button>
                <button
                  type="button"
                  onClick={() => setShowResetConfirm(false)}
                  className="cursor-pointer text-xs text-slate-600 hover:text-slate-800 px-2 py-1"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setShowResetConfirm(true)}
                className="cursor-pointer text-xs font-semibold text-rose-600 hover:text-rose-800 flex items-center gap-1.5 px-3 py-1.5 rounded hover:bg-rose-50 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Reference Data</span>
              </button>
            )}

            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="cursor-pointer px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="cursor-pointer px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Changes</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
