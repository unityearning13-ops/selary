import React, { useState } from 'react';
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
  Trophy,
  ChevronDown,
  Crown,
  Award,
  Users,
} from 'lucide-react';

export type ViewMode = 'both' | 'editor' | 'preview' | 'ranking';

interface NavbarProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  onDownloadPDF: () => void;
  onDownloadImage: () => void;
  onDownloadSalarySheet?: (target: 'all' | 'leaders' | 'trainers', format: 'pdf' | 'image') => void;
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
  onDownloadSalarySheet,
  onPrint,
  onOpenSettings,
  onAllClear,
  isDownloadingPDF,
  isDownloadingImage,
}) => {
  const [isPdfMenuOpen, setIsPdfMenuOpen] = useState(false);
  const [isImageMenuOpen, setIsImageMenuOpen] = useState(false);

  const handleSalaryExport = (target: 'all' | 'leaders' | 'trainers', format: 'pdf' | 'image') => {
    if (onDownloadSalarySheet) {
      onDownloadSalarySheet(target, format);
    } else {
      if (format === 'pdf') onDownloadPDF();
      else onDownloadImage();
    }
    setIsPdfMenuOpen(false);
    setIsImageMenuOpen(false);
  };

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

            <button
              onClick={() => onViewModeChange('ranking')}
              className={`cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all ${
                viewMode === 'ranking'
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black shadow-md shadow-amber-500/20'
                  : 'text-amber-400 hover:text-amber-300 hover:bg-amber-950/40 font-bold'
              }`}
            >
              <Trophy className="w-3.5 h-3.5 fill-current" />
              <span>🏆 র‍্যাঙ্কিং</span>
            </button>
          </div>

          {/* Primary Action Buttons: ALL CLEAR, DOWNLOAD PDF (Separate & Combined), DOWNLOAD IMAGE, PRINT */}
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

            {/* DOWNLOAD PDF with Dropdown */}
            <div className="relative">
              <div className="inline-flex rounded-lg shadow-sm">
                <button
                  onClick={onDownloadPDF}
                  disabled={isDownloadingPDF}
                  className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-2 rounded-l-lg text-xs font-extrabold uppercase tracking-wider bg-rose-600 hover:bg-rose-500 active:bg-rose-700 text-white transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                  title="Download PDF"
                >
                  {isDownloadingPDF ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Generating...</span>
                    </>
                  ) : (
                    <>
                      <FileText className="w-3.5 h-3.5 text-rose-200" />
                      <span>DOWNLOAD PDF</span>
                    </>
                  )}
                </button>
                <button
                  onClick={() => setIsPdfMenuOpen(!isPdfMenuOpen)}
                  disabled={isDownloadingPDF}
                  className="cursor-pointer px-2 py-2 bg-rose-700 hover:bg-rose-800 text-white rounded-r-lg border-l border-rose-500/50 transition-colors"
                  title="PDF Download Options (আলাদা ও একসাথে)"
                >
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>
              </div>

              {isPdfMenuOpen && (
                <div className="absolute right-0 top-full mt-1.5 w-60 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-2 z-50 text-white space-y-1 text-xs animate-in fade-in zoom-in-95 duration-100">
                  <div className="text-[10px] uppercase font-bold text-slate-400 px-2 py-1 border-b border-slate-800">
                    PDF ডাউনলোড অপশন
                  </div>
                  <button
                    onClick={() => handleSalaryExport('all', 'pdf')}
                    className="w-full text-left px-2.5 py-2 rounded-lg hover:bg-slate-800 font-bold flex items-center gap-2 text-white"
                  >
                    <Users className="w-3.5 h-3.5 text-purple-400" />
                    <span>🌐 উভয় একসাথে (সম্পূর্ণ শিট)</span>
                  </button>
                  <button
                    onClick={() => handleSalaryExport('leaders', 'pdf')}
                    className="w-full text-left px-2.5 py-2 rounded-lg hover:bg-slate-800 font-bold flex items-center gap-2 text-blue-300"
                  >
                    <Crown className="w-3.5 h-3.5 text-amber-300" />
                    <span>👑 শুধু টিম লিডার শিট</span>
                  </button>
                  <button
                    onClick={() => handleSalaryExport('trainers', 'pdf')}
                    className="w-full text-left px-2.5 py-2 rounded-lg hover:bg-slate-800 font-bold flex items-center gap-2 text-emerald-300"
                  >
                    <Award className="w-3.5 h-3.5 text-emerald-300" />
                    <span>⚡ শুধু টিম ট্রেইনার শিট</span>
                  </button>
                </div>
              )}
            </div>

            {/* DOWNLOAD IMAGE with Dropdown */}
            <div className="relative">
              <div className="inline-flex rounded-lg shadow-sm">
                <button
                  onClick={onDownloadImage}
                  disabled={isDownloadingImage}
                  className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-2 rounded-l-lg text-xs font-extrabold uppercase tracking-wider bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                  title="Download Image"
                >
                  {isDownloadingImage ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Capturing...</span>
                    </>
                  ) : (
                    <>
                      <ImageIcon className="w-3.5 h-3.5 text-emerald-200" />
                      <span>DOWNLOAD IMAGE</span>
                    </>
                  )}
                </button>
                <button
                  onClick={() => setIsImageMenuOpen(!isImageMenuOpen)}
                  disabled={isDownloadingImage}
                  className="cursor-pointer px-2 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-r-lg border-l border-emerald-500/50 transition-colors"
                  title="Image Download Options (আলাদা ও একসাথে)"
                >
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>
              </div>

              {isImageMenuOpen && (
                <div className="absolute right-0 top-full mt-1.5 w-60 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-2 z-50 text-white space-y-1 text-xs animate-in fade-in zoom-in-95 duration-100">
                  <div className="text-[10px] uppercase font-bold text-slate-400 px-2 py-1 border-b border-slate-800">
                    ইমেজ (PNG) ডাউনলোড অপশন
                  </div>
                  <button
                    onClick={() => handleSalaryExport('all', 'image')}
                    className="w-full text-left px-2.5 py-2 rounded-lg hover:bg-slate-800 font-bold flex items-center gap-2 text-white"
                  >
                    <Users className="w-3.5 h-3.5 text-purple-400" />
                    <span>🌐 উভয় একসাথে (সম্পূর্ণ শিট)</span>
                  </button>
                  <button
                    onClick={() => handleSalaryExport('leaders', 'image')}
                    className="w-full text-left px-2.5 py-2 rounded-lg hover:bg-slate-800 font-bold flex items-center gap-2 text-blue-300"
                  >
                    <Crown className="w-3.5 h-3.5 text-amber-300" />
                    <span>👑 শুধু টিম লিডার শিট</span>
                  </button>
                  <button
                    onClick={() => handleSalaryExport('trainers', 'image')}
                    className="w-full text-left px-2.5 py-2 rounded-lg hover:bg-slate-800 font-bold flex items-center gap-2 text-emerald-300"
                  >
                    <Award className="w-3.5 h-3.5 text-emerald-300" />
                    <span>⚡ শুধু টিম ট্রেইনার শিট</span>
                  </button>
                </div>
              )}
            </div>

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
