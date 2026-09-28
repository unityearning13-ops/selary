import React from 'react';
import {
  FileText,
  Image as ImageIcon,
  Printer,
  Settings,
  Eye,
  Edit3,
  CheckCircle2,
  Layers,
  Loader2,
  Trash2,
} from 'lucide-react';

export type ViewMode = 'both' | 'editor' | 'preview';

interface NavbarProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  onDownloadPDF: () => void;
  onDownloadImage: () => void;
  onPrint: () => void;
  onOpenSettings: () => void;
  onAllClear: () => void;
  isDownloadingPDF: boolean;
  isDownloadingImage: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  viewMode,
  onViewModeChange,
  onDownloadPDF,
  onDownloadImage,
  onPrint,
  onOpenSettings,
  onAllClear,
  isDownloadingPDF,
  isDownloadingImage,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-900 border-b border-slate-800 text-white shadow-md no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between py-3 gap-3">
          {/* Brand & Title */}
          <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-emerald-500 flex items-center justify-center shadow-md shadow-blue-500/20 text-white font-black text-lg">
                U
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-sm sm:text-base tracking-wider text-white">
                    UNITY EARNING <span className="text-sky-400">E-LEARNING</span> PLATFORM
                  </span>
                  <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    LIVE CALCULATOR
                  </span>
                </div>
                <div className="text-xs text-slate-400 font-medium">
                  Official Salary Sheet Generator • Admin: JIHADUL ISLAM
                </div>
              </div>
            </div>

            {/* Mobile Actions */}
            <div className="flex items-center gap-1.5 md:hidden">
              <button
                onClick={onAllClear}
                className="p-2 text-rose-300 hover:text-white rounded-lg hover:bg-rose-900/40"
                title="All Clear Form"
              >
                <Trash2 className="w-5 h-5" />
              </button>
              <button
                onClick={onOpenSettings}
                className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
                title="Settings"
              >
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center bg-slate-800/80 p-1 rounded-lg border border-slate-700/80 text-xs font-semibold">
            <button
              onClick={() => onViewModeChange('preview')}
              className={`cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all ${
                viewMode === 'preview'
                  ? 'bg-blue-600 text-white shadow-xs font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Document Preview</span>
            </button>

            <button
              onClick={() => onViewModeChange('editor')}
              className={`cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all ${
                viewMode === 'editor'
                  ? 'bg-blue-600 text-white shadow-xs font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Admin Editor</span>
            </button>

            <button
              onClick={() => onViewModeChange('both')}
              className={`cursor-pointer hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all ${
                viewMode === 'both'
                  ? 'bg-blue-600 text-white shadow-xs font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Split View</span>
            </button>
          </div>

          {/* Primary Action Buttons: ALL CLEAR, DOWNLOAD PDF, DOWNLOAD IMAGE, PRINT */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            {/* ALL CLEAR BUTTON */}
            <button
              onClick={onAllClear}
              className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold text-rose-300 hover:text-white bg-rose-950/40 hover:bg-rose-900/80 border border-rose-800/60 transition-all shadow-xs"
              title="Clear all rows to enter fresh salary data (All Clear)"
            >
              <Trash2 className="w-3.5 h-3.5 text-rose-400" />
              <span>ALL CLEAR</span>
            </button>

            {/* DOWNLOAD PDF */}
            <button
              onClick={onDownloadPDF}
              disabled={isDownloadingPDF}
              className="cursor-pointer inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-extrabold uppercase tracking-wider bg-rose-600 hover:bg-rose-500 active:bg-rose-700 text-white transition-all shadow-sm hover:shadow-rose-600/30 disabled:opacity-60 disabled:cursor-not-allowed"
              title="Download high-resolution official PDF document"
            >
              {isDownloadingPDF ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <FileText className="w-4 h-4 text-rose-200" />
                  <span>DOWNLOAD PDF</span>
                </>
              )}
            </button>

            {/* DOWNLOAD IMAGE */}
            <button
              onClick={onDownloadImage}
              disabled={isDownloadingImage}
              className="cursor-pointer inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-extrabold uppercase tracking-wider bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white transition-all shadow-sm hover:shadow-emerald-600/30 disabled:opacity-60 disabled:cursor-not-allowed"
              title="Download high-resolution PNG image"
            >
              {isDownloadingImage ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Capturing...</span>
                </>
              ) : (
                <>
                  <ImageIcon className="w-4 h-4 text-emerald-200" />
                  <span>DOWNLOAD IMAGE</span>
                </>
              )}
            </button>

            {/* PRINT */}
            <button
              onClick={onPrint}
              className="cursor-pointer hidden sm:inline-flex items-center gap-1 px-3 py-2 rounded-lg text-xs font-bold text-slate-300 hover:text-white hover:bg-slate-800 transition-colors border border-slate-700"
              title="Print document or Save via Browser Print"
            >
              <Printer className="w-4 h-4" />
              <span>PRINT</span>
            </button>

            {/* SETTINGS */}
            <button
              onClick={onOpenSettings}
              className="cursor-pointer hidden md:inline-flex items-center p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors border border-slate-700/80"
              title="Document & Admin Settings"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
