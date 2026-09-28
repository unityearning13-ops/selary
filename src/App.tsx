import React, { useState, useEffect } from 'react';
import { Employee, SalarySheetMetadata } from './types/salary';
import {
  INITIAL_TEAM_LEADERS,
  INITIAL_TEAM_TRAINERS,
  INITIAL_METADATA,
} from './data/initialData';
import {
  RATE_TEAM_LEADER,
  RATE_TEAM_TRAINER,
  calculateSectionTotals,
} from './utils/calculations';
import {
  downloadSalarySheetImage,
  downloadSalarySheetPDF,
  printSalarySheet,
} from './utils/exportUtils';
import { Navbar, ViewMode } from './components/Navbar';
import { StatsOverview } from './components/StatsOverview';
import { OfficialSalaryDocument } from './components/OfficialSalaryDocument';
import { AdminTableEditor } from './components/AdminTableEditor';
import { DocumentSettingsModal } from './components/DocumentSettingsModal';
import { ReferenceViewerModal } from './components/ReferenceViewerModal';
import { ClearAllModal } from './components/ClearAllModal';
import {
  Eye,
  Edit3,
  CheckCircle2,
  FileDown,
  Info,
  Layers,
  Settings,
  AlertTriangle,
  RotateCcw,
  Trash2,
  Maximize2,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';

export default function App() {
  // 1. Data State with LocalStorage Persistence
  const [teamLeaders, setTeamLeaders] = useState<Employee[]>(() => {
    try {
      const saved = localStorage.getItem('uep_salary_team_leaders');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_TEAM_LEADERS;
  });

  const [teamTrainers, setTeamTrainers] = useState<Employee[]>(() => {
    try {
      const saved = localStorage.getItem('uep_salary_team_trainers');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_TEAM_TRAINERS;
  });

  const [metadata, setMetadata] = useState<SalarySheetMetadata>(() => {
    try {
      const saved = localStorage.getItem('uep_salary_metadata');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.companyName === 'UNITY EARNING PLATFORM' || !parsed.companyName) {
          parsed.companyName = 'UNITY EARNING E-LEARNING PLATFORM';
        }
        return parsed;
      }
    } catch (e) {
      console.error(e);
    }
    return INITIAL_METADATA;
  });

  // 2. View & UI State
  const [viewMode, setViewMode] = useState<ViewMode>('preview');
  const [previewScale, setPreviewScale] = useState<number>(100);
  const [editorScale, setEditorScale] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('uep_editor_scale');
      return saved ? Math.min(130, Math.max(50, Number(saved))) : 100;
    } catch {
      return 100;
    }
  });
  const [isDownloadingPDF, setIsDownloadingPDF] = useState(false);
  const [isDownloadingImage, setIsDownloadingImage] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isRulesOpen, setIsRulesOpen] = useState(false);
  const [isAllClearOpen, setIsAllClearOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // 3. System Date & Time (Automatically generated and kept current)
  const [currentDateTime, setCurrentDateTime] = useState({
    date: new Date().toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    }),
    time: new Date().toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    }),
  });

  // Keep date & time updated every 10 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentDateTime({
        date: now.toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'long',
          year: 'numeric',
        }),
        time: now.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
        }),
      });
    }, 10000);
    return () => clearInterval(timer);
  }, []);

  // Save to localStorage whenever data changes
  useEffect(() => {
    try {
      localStorage.setItem('uep_salary_team_leaders', JSON.stringify(teamLeaders));
    } catch (e) {
      console.error(e);
    }
  }, [teamLeaders]);

  useEffect(() => {
    try {
      localStorage.setItem('uep_salary_team_trainers', JSON.stringify(teamTrainers));
    } catch (e) {
      console.error(e);
    }
  }, [teamTrainers]);

  useEffect(() => {
    try {
      localStorage.setItem('uep_salary_metadata', JSON.stringify(metadata));
    } catch (e) {
      console.error(e);
    }
  }, [metadata]);

  useEffect(() => {
    try {
      localStorage.setItem('uep_editor_scale', String(editorScale));
    } catch (e) {
      console.error(e);
    }
  }, [editorScale]);

  const handleFitEditorToScreen = () => {
    const containerWidth = typeof window !== 'undefined' ? window.innerWidth - 64 : 1050;
    const optimalScale = Math.min(100, Math.max(50, Math.floor((containerWidth / 1060) * 100)));
    setEditorScale(optimalScale);
    showToast(`স্ক্রিন অনুযায়ী ${optimalScale}% এ ফিট করা হয়েছে`);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // 4. Download Handlers
  const handleDownloadPDF = async () => {
    try {
      setIsDownloadingPDF(true);
      showToast('Generating official salary sheet PDF...');
      const cleanPeriod = metadata.periodMonth.replace(/\s+/g, '_');
      await downloadSalarySheetPDF(
        'salary-sheet-document-export',
        `Unity_Earning_Platform_Salary_Sheet_${cleanPeriod}.pdf`
      );
      showToast('PDF downloaded successfully!');
    } catch (err) {
      console.error('PDF Generation Error:', err);
      showToast('Failed to generate PDF. Please try again.');
    } finally {
      setIsDownloadingPDF(false);
    }
  };

  const handleDownloadImage = async () => {
    try {
      setIsDownloadingImage(true);
      showToast('Capturing high-resolution salary sheet image...');
      const cleanPeriod = metadata.periodMonth.replace(/\s+/g, '_');
      await downloadSalarySheetImage(
        'salary-sheet-document-export',
        `Unity_Earning_Platform_Salary_Sheet_${cleanPeriod}.png`
      );
      showToast('Salary sheet image downloaded successfully!');
    } catch (err) {
      console.error('Image Generation Error:', err);
      showToast('Failed to generate image. Please try again.');
    } finally {
      setIsDownloadingImage(false);
    }
  };

  const handlePrint = () => {
    printSalarySheet();
  };

  const handleResetAllData = () => {
    setTeamLeaders(INITIAL_TEAM_LEADERS);
    setTeamTrainers(INITIAL_TEAM_TRAINERS);
    setMetadata(INITIAL_METADATA);
    localStorage.removeItem('uep_salary_team_leaders');
    localStorage.removeItem('uep_salary_team_trainers');
    localStorage.removeItem('uep_salary_metadata');
    showToast('Reset to original reference data from uploaded sheet');
  };

  const handleConfirmAllClear = () => {
    const blankLeader: Employee = {
      id: `leader-${Date.now()}-1`,
      name: '',
      convert: '',
      balance: '',
      target: 40,
      bonus: '',
      incentive: '',
      fine: '',
      isBalanceOverridden: false,
    };
    const blankTrainer: Employee = {
      id: `trainer-${Date.now()}-1`,
      name: '',
      convert: '',
      balance: '',
      target: 20,
      bonus: '',
      incentive: '',
      fine: '',
      isBalanceOverridden: false,
    };
    setTeamLeaders([blankLeader]);
    setTeamTrainers([blankTrainer]);
    localStorage.setItem('uep_salary_team_leaders', JSON.stringify([blankLeader]));
    localStorage.setItem('uep_salary_team_trainers', JSON.stringify([blankTrainer]));
    setViewMode('editor');
    showToast('All cleared! Ready for new payroll data.');
  };

  // Section totals for quick stats
  const leaderTotals = calculateSectionTotals(teamLeaders, RATE_TEAM_LEADER);
  const trainerTotals = calculateSectionTotals(teamTrainers, RATE_TEAM_TRAINER);

  return (
    <div className="min-h-screen bg-slate-100/90 text-slate-800 flex flex-col font-sans">
      {/* Top Navbar */}
      <Navbar
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onDownloadPDF={handleDownloadPDF}
        onDownloadImage={handleDownloadImage}
        onPrint={handlePrint}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onAllClear={() => setIsAllClearOpen(true)}
        isDownloadingPDF={isDownloadingPDF}
        isDownloadingImage={isDownloadingImage}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-6">
        {/* Top Control & Notification Banner */}
        <div className="mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 no-print bg-white p-4 rounded-xl border border-slate-300 shadow-2xs">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-xl sm:text-2xl font-black tracking-tight uppercase text-slate-950">
                UNITY EARNING <span className="text-blue-700">E-LEARNING</span> <span className="text-emerald-700">PLATFORM</span>
              </h2>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500 mt-1 flex-wrap">
              <span className="font-bold text-slate-800">{metadata.documentTitle}</span>
              <span>•</span>
              <span className="font-semibold text-slate-700">Period: {metadata.periodMonth}</span>
              <span>•</span>
              <span className="text-emerald-700 font-bold">Admin: {metadata.adminName}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* ALL CLEAR BUTTON */}
            <button
              onClick={() => setIsAllClearOpen(true)}
              className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-black text-rose-700 hover:text-white bg-rose-50 hover:bg-rose-600 border border-rose-300 hover:border-rose-600 shadow-2xs transition-all"
              title="Clear all data to enter new salary records"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>ALL CLEAR (সব মুছুন)</span>
            </button>

            <button
              onClick={() => setIsRulesOpen(true)}
              className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-300 shadow-2xs transition-colors"
            >
              <Info className="w-3.5 h-3.5 text-blue-600" />
              <span>Calculation Rules</span>
            </button>

            <button
              onClick={() => setIsSettingsOpen(true)}
              className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-300 shadow-2xs transition-colors"
            >
              <Settings className="w-3.5 h-3.5" />
              <span>Edit Info</span>
            </button>
          </div>
        </div>

        {/* Live Executive KPI Stats */}
        <StatsOverview
          leaderTotals={leaderTotals}
          trainerTotals={trainerTotals}
          leaderCount={teamLeaders.length}
          trainerCount={teamTrainers.length}
        />

        {/* View Layouts */}
        {viewMode === 'preview' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-white px-4 py-3 rounded-lg border border-slate-200 shadow-2xs no-print gap-3 text-xs">
              <div className="flex items-center gap-2 text-slate-600">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="font-extrabold text-slate-900">Official Salary Sheet Preview</span>
                <span className="text-slate-300">|</span>
                <span className="text-slate-500 hidden md:inline">Ready for Official Records & Distribution</span>
              </div>

              <div className="flex items-center gap-2 flex-wrap justify-between sm:justify-end">
                {/* Zoom Controls */}
                <div className="flex items-center bg-slate-100 rounded-md p-0.5 border border-slate-200">
                  <button
                    onClick={() => setPreviewScale(Math.max(60, previewScale - 10))}
                    className="cursor-pointer px-2 py-1 text-slate-600 hover:text-slate-900 font-bold"
                    title="Zoom Out"
                  >
                    -
                  </button>
                  <span className="px-1.5 text-[11px] font-semibold text-slate-700 min-w-[40px] text-center">
                    {previewScale}%
                  </span>
                  <button
                    onClick={() => setPreviewScale(Math.min(130, previewScale + 10))}
                    className="cursor-pointer px-2 py-1 text-slate-600 hover:text-slate-900 font-bold"
                    title="Zoom In"
                  >
                    +
                  </button>
                  <button
                    onClick={() => setPreviewScale(100)}
                    className="cursor-pointer px-1.5 py-1 text-[10px] text-slate-500 hover:text-slate-800 border-l border-slate-200"
                    title="Reset Zoom"
                  >
                    100%
                  </button>
                </div>

                {/* Edit Button */}
                <button
                  onClick={() => setViewMode('editor')}
                  className="cursor-pointer inline-flex items-center gap-1 font-bold text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-md border border-blue-200 transition-colors"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Admin Editor</span>
                </button>
              </div>
            </div>

            {/* Official Salary Document Layout */}
            <div className="overflow-x-auto pb-8 flex justify-center print:hidden">
              <div
                style={{
                  transform: previewScale !== 100 ? `scale(${previewScale / 100})` : 'none',
                  transformOrigin: 'top center',
                  transition: 'transform 0.15s ease-out',
                }}
              >
                <OfficialSalaryDocument
                  teamLeaders={teamLeaders}
                  teamTrainers={teamTrainers}
                  companyName={metadata.companyName}
                  documentTitle={metadata.documentTitle}
                  periodMonth={metadata.periodMonth}
                  adminName={metadata.adminName}
                  adminRole={metadata.adminRole}
                  generatedDate={currentDateTime.date}
                  generatedTime={currentDateTime.time}
                />
              </div>
            </div>
          </div>
        )}

        {viewMode === 'editor' && (
          <div className="space-y-6">
            {/* Top Zoom & Editor Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-white px-4 py-3 rounded-lg border border-slate-200 shadow-2xs gap-3 text-xs">
              <div className="flex items-center gap-2.5 text-slate-700">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                  <Edit3 className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-slate-900 text-sm">Admin Live Spreadsheet Editor</span>
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 font-mono">
                      Scale: {editorScale}%
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    স্ক্রিন বড় বা চওড়া মনে হলে জুম আউট (-) করে পুরো টেবিল স্ক্রিনে একসাথে দেখুন
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-wrap justify-between sm:justify-end">
                {/* Zoom Controller */}
                <div className="flex items-center bg-slate-100 rounded-lg p-0.5 border border-slate-200 shadow-2xs">
                  <button
                    type="button"
                    onClick={() => setEditorScale((prev) => Math.max(50, prev - 5))}
                    className="cursor-pointer px-2.5 py-1 text-slate-700 hover:text-slate-950 hover:bg-slate-200 rounded font-black text-sm transition-colors flex items-center justify-center"
                    title="Zoom Out (স্ক্রিন অনুযায়ী ছোট করুন)"
                  >
                    <ZoomOut className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-2 text-xs font-black text-slate-800 min-w-[44px] text-center font-mono">
                    {editorScale}%
                  </span>
                  <button
                    type="button"
                    onClick={() => setEditorScale((prev) => Math.min(130, prev + 5))}
                    className="cursor-pointer px-2.5 py-1 text-slate-700 hover:text-slate-950 hover:bg-slate-200 rounded font-black text-sm transition-colors flex items-center justify-center"
                    title="Zoom In (বড় করুন)"
                  >
                    <ZoomIn className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Preset Chips */}
                <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs">
                  <button
                    type="button"
                    onClick={handleFitEditorToScreen}
                    className="cursor-pointer px-2.5 py-1 rounded font-bold text-blue-700 hover:bg-blue-200/70 transition-colors flex items-center gap-1 shadow-2xs bg-white/70"
                    title="স্বয়ংক্রিয়ভাবে স্ক্রিনের সাইজ অনুযায়ী ফিট করুন"
                  >
                    <Maximize2 className="w-3 h-3" />
                    <span>Fit Screen</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditorScale(75)}
                    className={`cursor-pointer px-2 py-1 rounded font-bold transition-colors ${
                      editorScale === 75 ? 'bg-blue-600 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                    }`}
                  >
                    75%
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditorScale(85)}
                    className={`cursor-pointer px-2 py-1 rounded font-bold transition-colors ${
                      editorScale === 85 ? 'bg-blue-600 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                    }`}
                  >
                    85%
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditorScale(100)}
                    className={`cursor-pointer px-2 py-1 rounded font-bold transition-colors ${
                      editorScale === 100 ? 'bg-slate-800 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                    }`}
                  >
                    100%
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setViewMode('preview')}
                  className="cursor-pointer inline-flex items-center gap-1.5 font-bold text-xs text-white bg-slate-900 hover:bg-slate-800 px-3.5 py-1.5 rounded-lg shadow-2xs transition-colors shrink-0"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>View Document</span>
                </button>
              </div>
            </div>

            {/* Scaled Editor Container */}
            <div className="overflow-x-auto pb-6">
              <div
                style={{
                  transform: editorScale !== 100 ? `scale(${editorScale / 100})` : 'none',
                  transformOrigin: 'top left',
                  width: editorScale !== 100 ? `${10000 / editorScale}%` : '100%',
                  transition: 'transform 0.15s ease-out',
                }}
                className="space-y-6"
              >
                {/* 1. Team Leader Table Editor */}
                <AdminTableEditor
                  role="leader"
                  employees={teamLeaders}
                  onUpdateEmployees={setTeamLeaders}
                />

                {/* 2. Team Trainer Table Editor */}
                <AdminTableEditor
                  role="trainer"
                  employees={teamTrainers}
                  onUpdateEmployees={setTeamTrainers}
                />
              </div>
            </div>
          </div>
        )}

        {viewMode === 'both' && (
          <div className="space-y-10">
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
                  <h3 className="font-black text-sm uppercase tracking-wider text-slate-700">
                    Step 1: Admin Data Entry & Calculations
                  </h3>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 font-mono">
                    {editorScale}%
                  </span>
                </div>

                {/* Quick Zoom for Step 1 in Both View */}
                <div className="flex items-center gap-1.5">
                  <div className="flex items-center bg-slate-100 rounded-md p-0.5 border border-slate-200">
                    <button
                      type="button"
                      onClick={() => setEditorScale((prev) => Math.max(50, prev - 5))}
                      className="cursor-pointer px-2 py-1 text-slate-600 hover:text-slate-900 font-bold text-xs"
                      title="Zoom Out"
                    >
                      -
                    </button>
                    <span className="px-1.5 text-xs font-bold text-slate-800 font-mono">
                      {editorScale}%
                    </span>
                    <button
                      type="button"
                      onClick={() => setEditorScale((prev) => Math.min(130, prev + 5))}
                      className="cursor-pointer px-2 py-1 text-slate-600 hover:text-slate-900 font-bold text-xs"
                      title="Zoom In"
                    >
                      +
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={handleFitEditorToScreen}
                    className="cursor-pointer px-2 py-1 bg-white border border-slate-200 rounded text-xs font-bold text-blue-700 hover:bg-blue-50"
                  >
                    Fit Screen
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto pb-4">
                <div
                  style={{
                    transform: editorScale !== 100 ? `scale(${editorScale / 100})` : 'none',
                    transformOrigin: 'top left',
                    width: editorScale !== 100 ? `${10000 / editorScale}%` : '100%',
                    transition: 'transform 0.15s ease-out',
                  }}
                  className="space-y-6"
                >
                  <AdminTableEditor
                    role="leader"
                    employees={teamLeaders}
                    onUpdateEmployees={setTeamLeaders}
                  />
                  <AdminTableEditor
                    role="trainer"
                    employees={teamTrainers}
                    onUpdateEmployees={setTeamTrainers}
                  />
                </div>
              </div>
            </div>

            <div className="pt-6 border-t-2 border-slate-300">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
                  <h3 className="font-black text-sm uppercase tracking-wider text-slate-700">
                    Step 2: Real-time Official Document Preview
                  </h3>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleDownloadPDF}
                    disabled={isDownloadingPDF}
                    className="cursor-pointer px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded text-xs font-bold"
                  >
                    Download PDF
                  </button>
                  <button
                    onClick={handleDownloadImage}
                    disabled={isDownloadingImage}
                    className="cursor-pointer px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-bold"
                  >
                    Download Image
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto pb-8 print:hidden">
                <OfficialSalaryDocument
                  teamLeaders={teamLeaders}
                  teamTrainers={teamTrainers}
                  companyName={metadata.companyName}
                  documentTitle={metadata.documentTitle}
                  periodMonth={metadata.periodMonth}
                  adminName={metadata.adminName}
                  adminRole={metadata.adminRole}
                  generatedDate={currentDateTime.date}
                  generatedTime={currentDateTime.time}
                />
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Pristine Document Container for High-Res PDF/Image Export & Native Printing */}
      <div
        id="official-export-wrapper"
        className="fixed top-0 left-0 -z-[9999] pointer-events-none print:static print:z-auto print:pointer-events-auto"
        style={{ width: '1080px' }}
        aria-hidden="true"
      >
        <OfficialSalaryDocument
          id="salary-sheet-document-export"
          teamLeaders={teamLeaders}
          teamTrainers={teamTrainers}
          companyName={metadata.companyName}
          documentTitle={metadata.documentTitle}
          periodMonth={metadata.periodMonth}
          adminName={metadata.adminName}
          adminRole={metadata.adminRole}
          generatedDate={currentDateTime.date}
          generatedTime={currentDateTime.time}
        />
      </div>

      {/* Toast Feedback */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-lg shadow-xl border border-slate-700 text-xs font-bold flex items-center gap-2 animate-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Modals */}
      <DocumentSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        metadata={metadata}
        onSaveMetadata={(updated) => {
          setMetadata(updated);
          showToast('Settings saved successfully');
        }}
        onResetAllData={handleResetAllData}
      />

      <ReferenceViewerModal
        isOpen={isRulesOpen}
        onClose={() => setIsRulesOpen(false)}
      />

      <ClearAllModal
        isOpen={isAllClearOpen}
        onClose={() => setIsAllClearOpen(false)}
        onConfirm={handleConfirmAllClear}
      />
    </div>
  );
}
