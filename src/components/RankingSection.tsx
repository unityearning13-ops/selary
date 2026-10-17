import React, { useState, useMemo } from 'react';
import { Employee, SalarySheetMetadata, RankingFrameRatio } from '../types/salary';
import { parseRawPortalData } from '../utils/rawParser';
import {
  Trophy,
  Medal,
  Award,
  Crown,
  Download,
  FileText,
  Printer,
  Plus,
  Trash2,
  Edit2,
  RefreshCw,
  CheckCircle2,
  Users,
  Sparkles,
  ClipboardPaste,
  ChevronRight,
  ChevronDown,
  Sliders,
  X,
  Save,
  Check,
} from 'lucide-react';
import { downloadRankingPosterImage, downloadRankingPosterPDF } from '../utils/exportUtils';

export interface RankingMemberItem {
  id: string;
  name: string;
  emailOrPhone?: string;
  balance: number;
  convert: number;
  role: 'leader' | 'trainer';
  isCustom?: boolean;
}

interface RankingSectionProps {
  teamLeaders: Employee[];
  teamTrainers: Employee[];
  metadata: SalarySheetMetadata;
  currentDateTime: { date: string; time: string };
  onSyncWithSheet?: () => void;
}

/**
 * Reusable Official Ranking Card Poster Component.
 * Guaranteed 100% explicit hex styles for lossless image & PDF export.
 * NOTE: As explicitly requested, ABSOLUTELY NO BALANCE is displayed. Only "CONVERT" (কনভার্ট সংখ্যা)!
 */
const toEnglishDigitsAndText = (val: string): string => {
  if (!val) return '';
  const map: Record<string, string> = {
    '০': '0', '১': '1', '২': '2', '৩': '3', '৪': '4',
    '৫': '5', '৬': '6', '৭': '7', '৮': '8', '৯': '9',
    'জানুয়ারি': 'January', 'ফেব্রুয়ারি': 'February', 'মার্চ': 'March',
    'এপ্রিল': 'April', 'মে': 'May', 'জুন': 'June', 'জুলাই': 'July',
    'আগস্ট': 'August', 'সেপ্টেম্বর': 'September', 'অক্টোবর': 'October',
    'নভেম্বর': 'November', 'ডিসেম্বর': 'December',
    'পূর্বাহ্ণ': 'AM', 'অপরাহ্ন': 'PM', 'সকাল': 'AM', 'দুপুর': 'PM',
    'বিকাল': 'PM', 'সন্ধ্যা': 'PM', 'রাত': 'PM',
  };
  let res = String(val);
  for (const [bn, en] of Object.entries(map)) {
    res = res.replaceAll(bn, en);
  }
  return res;
};

/**
 * Reusable Official Ranking Card Poster Component.
 * Guaranteed 100% explicit hex styles for lossless image & PDF export.
 * NOTE:
 * - NO highlighted Top 1, 2, 3 podium at the top (as requested: "টপ ওয়ান টু থ্রি লিখছো এটা বাদ দাও").
 * - ALL ENGLISH text (as requested: "পুরো সবগুলো লেখা ইংরেজিতে হবে। কোন বাংলা লেখা যেন না থাকে").
 * - NO formula or "ভাগ ৬০" (as requested: "ভাগ সাইট লেখা লাগবে না").
 * - ABSOLUTELY NO BALANCE displayed. Only "CONVERT"!
 */
const RankingCardPoster: React.FC<{
  id: string;
  items: RankingMemberItem[];
  title?: string;
  subTitle?: string;
  periodMonth?: string;
  adminName?: string;
  adminRole?: string;
  currentDateTime: { date: string; time: string };
  frameClasses?: string;
  frameStyle?: React.CSSProperties;
  showRoleBadge?: boolean;
}> = ({
  id,
  items,
  title,
  subTitle,
  periodMonth,
  adminName,
  adminRole,
  currentDateTime,
  frameClasses = '',
  frameStyle = {},
  showRoleBadge = false,
}) => {
  const totalConverts = useMemo(
    () => items.reduce((sum, item) => sum + (item.convert || 0), 0),
    [items]
  );

  const highestConvert = items.length > 0 ? items[0].convert : 0;
  const englishPeriod = toEnglishDigitsAndText(periodMonth || 'OCTOBER 2026').toUpperCase();
  const englishDate = toEnglishDigitsAndText(currentDateTime?.date || new Date().toLocaleDateString('en-GB'));
  const englishTime = toEnglishDigitsAndText(currentDateTime?.time || new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }));

  const resolvedTitle =
    title ||
    (showRoleBadge
      ? 'TEAM LEADER & TEAM TRAINER RANKING'
      : 'OFFICIAL PERFORMANCE RANKING');

  return (
    <div
      id={id}
      className={`${frameClasses} transition-all duration-300 relative overflow-hidden`}
      style={{
        backgroundColor: '#ffffff',
        border: '2px solid #e2e8f0',
        fontFamily:
          'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        ...frameStyle,
      }}
    >
      {/* Top Elegant Gold & Navy Accent Stripe */}
      <div
        className="h-2 w-full"
        style={{
          background: 'linear-gradient(90deg, #0f172a 0%, #1e3a8a 30%, #f59e0b 60%, #10b981 100%)',
        }}
      />

      {/* Poster Header (100% English, Corporate Executive Design) */}
      <div
        className="px-6 py-5 text-center relative"
        style={{
          backgroundColor: '#0f172a',
          color: '#ffffff',
          borderBottom: '2px solid #1e293b',
        }}
      >
        {/* Golden Glow Corporate Badge */}
        <div
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-2 shadow-xs"
          style={{
            backgroundColor: '#fffbeb',
            color: '#b45309',
            border: '1px solid #fde68a',
          }}
        >
          <Trophy className="w-3.5 h-3.5 text-[#d97706] fill-current" />
          <span>OFFICIAL PERFORMANCE LEADERBOARD</span>
        </div>

        {/* Platform Name */}
        <h1
          className="text-lg sm:text-2xl font-black tracking-wider uppercase text-white"
          style={{ color: '#ffffff', letterSpacing: '0.04em' }}
        >
          UNITY EARNING & LEARNING PLATFORM
        </h1>

        {/* Dynamic Ranking Title */}
        <h2
          className="text-sm sm:text-lg font-black mt-1 uppercase tracking-wide"
          style={{ color: '#fbbf24' }}
        >
          {resolvedTitle}
        </h2>

        {/* Subtitle & Evaluation Period */}
        <div
          className="text-[11px] font-semibold mt-2 flex items-center justify-center gap-2 flex-wrap uppercase tracking-wider"
          style={{ color: '#94a3b8' }}
        >
          <span>{subTitle || 'Performance Evaluation'}</span>
          <span>•</span>
          <span>SESSION: {englishPeriod}</span>
        </div>
      </div>

      {/* Metric Summary Ribbon */}
      <div
        className="px-4 py-2.5 flex items-center justify-around text-center text-xs border-b shadow-2xs"
        style={{
          backgroundColor: '#f8fafc',
          borderColor: '#e2e8f0',
        }}
      >
        <div className="flex flex-col items-center">
          <span className="text-[10px] font-extrabold uppercase tracking-wider" style={{ color: '#64748b' }}>
            TOTAL PARTICIPANTS
          </span>
          <span className="text-sm font-black" style={{ color: '#0f172a' }}>
            {items.length}
          </span>
        </div>
        <div className="h-6 w-px" style={{ backgroundColor: '#cbd5e1' }} />
        <div className="flex flex-col items-center">
          <span className="text-[10px] font-extrabold uppercase tracking-wider" style={{ color: '#64748b' }}>
            TOTAL CONVERTS
          </span>
          <span className="text-sm font-black" style={{ color: '#2563eb' }}>
            {totalConverts}
          </span>
        </div>
        <div className="h-6 w-px" style={{ backgroundColor: '#cbd5e1' }} />
        <div className="flex flex-col items-center">
          <span className="text-[10px] font-extrabold uppercase tracking-wider" style={{ color: '#64748b' }}>
            HIGHEST CONVERT
          </span>
          <span className="text-sm font-black" style={{ color: '#d97706' }}>
            {highestConvert}
          </span>
        </div>
      </div>

      {/* Ranking List Table (CONVERT ONLY, ZERO BALANCE, 100% ENGLISH) */}
      <div className="p-4 sm:p-5">
        <div
          className="rounded-xl overflow-hidden shadow-xs"
          style={{
            border: '1.5px solid #cbd5e1',
            backgroundColor: '#ffffff',
          }}
        >
          {/* Table Header: Pure English */}
          <div
            className="grid grid-cols-12 px-4 py-3 text-[11px] font-black tracking-wider uppercase items-center"
            style={{
              backgroundColor: '#0f172a',
              color: '#ffffff',
            }}
          >
            <div className="col-span-2 text-center">RANK</div>
            <div className="col-span-7 text-left">NAME & DESIGNATION</div>
            <div className="col-span-3 text-right">CONVERT</div>
          </div>

          {/* Table Rows */}
          {items.length === 0 ? (
            <div
              className="p-10 text-center text-xs font-bold uppercase tracking-wider"
              style={{ color: '#64748b' }}
            >
              No active convert data found for this evaluation period.
            </div>
          ) : (
            items.map((item, index) => {
              const rankNumber = index + 1;
              const isTop1 = rankNumber === 1;
              const isTop2 = rankNumber === 2;
              const isTop3 = rankNumber === 3;
              const rowBg = index % 2 === 0 ? '#ffffff' : '#f8fafc';

              return (
                <div
                  key={`item-${item.id}-${index}`}
                  className="grid grid-cols-12 px-4 py-2.5 items-center text-xs transition-colors"
                  style={{
                    backgroundColor: isTop1
                      ? '#fffdf0'
                      : isTop2
                      ? '#f8fafc'
                      : isTop3
                      ? '#fffaf5'
                      : rowBg,
                    borderBottom: '1px solid #f1f5f9',
                    borderLeft: isTop1
                      ? '4px solid #f59e0b'
                      : isTop2
                      ? '4px solid #94a3b8'
                      : isTop3
                      ? '4px solid #d97706'
                      : '4px solid transparent',
                  }}
                >
                  {/* Rank Badge */}
                  <div className="col-span-2 flex items-center justify-center">
                    {isTop1 ? (
                      <span
                        className="inline-flex items-center justify-center gap-0.5 px-2.5 py-0.5 rounded-full text-xs font-black shadow-xs"
                        style={{
                          backgroundColor: '#f59e0b',
                          color: '#ffffff',
                        }}
                      >
                        🥇 1
                      </span>
                    ) : isTop2 ? (
                      <span
                        className="inline-flex items-center justify-center gap-0.5 px-2.5 py-0.5 rounded-full text-xs font-black shadow-xs"
                        style={{
                          backgroundColor: '#94a3b8',
                          color: '#ffffff',
                        }}
                      >
                        🥈 2
                      </span>
                    ) : isTop3 ? (
                      <span
                        className="inline-flex items-center justify-center gap-0.5 px-2.5 py-0.5 rounded-full text-xs font-black shadow-xs"
                        style={{
                          backgroundColor: '#d97706',
                          color: '#ffffff',
                        }}
                      >
                        🥉 3
                      </span>
                    ) : (
                      <span
                        className="inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold"
                        style={{
                          backgroundColor: '#f1f5f9',
                          color: '#475569',
                          border: '1px solid #e2e8f0',
                        }}
                      >
                        {rankNumber}
                      </span>
                    )}
                  </div>

                  {/* Name & Designation */}
                  <div className="col-span-7 pr-2">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span
                        className={`text-xs sm:text-sm font-bold uppercase truncate ${
                          isTop1 ? 'text-[#0f172a] font-black' : 'text-[#1e293b]'
                        }`}
                        style={{ color: '#0f172a' }}
                      >
                        {item.name}
                      </span>
                      {showRoleBadge && (
                        <span
                          className="text-[9px] px-2 py-0.5 rounded-sm font-extrabold uppercase shrink-0"
                          style={{
                            backgroundColor: item.role === 'leader' ? '#dbeafe' : '#dcfce7',
                            color: item.role === 'leader' ? '#1e40af' : '#166534',
                            border: `1px solid ${
                              item.role === 'leader' ? '#bfdbfe' : '#bbf7d0'
                            }`,
                          }}
                        >
                          {item.role === 'leader' ? 'TEAM LEADER' : 'TEAM TRAINER'}
                        </span>
                      )}
                    </div>

                    {item.emailOrPhone && (
                      <div
                        className="text-[10px] truncate mt-0.5 font-medium"
                        style={{ color: '#64748b' }}
                      >
                        {item.emailOrPhone}
                      </div>
                    )}
                  </div>

                  {/* Convert Count Badge (CONVERT ONLY, NO BALANCE) */}
                  <div className="col-span-3 text-right flex items-center justify-end">
                    <span
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-black shadow-2xs"
                      style={{
                        backgroundColor: isTop1
                          ? '#fef3c7'
                          : isTop2
                          ? '#f1f5f9'
                          : isTop3
                          ? '#ffedd5'
                          : '#f8fafc',
                        color: isTop1
                          ? '#92400e'
                          : isTop2
                          ? '#1e293b'
                          : isTop3
                          ? '#9a3412'
                          : '#0f172a',
                        border: `1.5px solid ${
                          isTop1 ? '#fde68a' : isTop2 ? '#cbd5e1' : isTop3 ? '#fed7aa' : '#e2e8f0'
                        }`,
                      }}
                    >
                      <span className="text-xs sm:text-sm">{item.convert}</span>
                      <span className="text-[9px] font-extrabold uppercase opacity-80">
                        CONVERT
                      </span>
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Official Admin Verification & Signature (100% English) */}
      <div
        className="p-5 mt-auto"
        style={{
          backgroundColor: '#f8fafc',
          borderTop: '1px solid #e2e8f0',
        }}
      >
        <div className="flex items-end justify-between gap-4">
          {/* Left Side: Verification Badge & Stamp */}
          <div className="space-y-1.5 text-left">
            <div
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold shadow-2xs"
              style={{
                backgroundColor: '#ecfdf5',
                color: '#065f46',
                border: '1px solid #a7f3d0',
              }}
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-[#059669] shrink-0" />
              <span>Verified & Approved by Executive Admin</span>
            </div>

            <div className="text-[11px] font-medium" style={{ color: '#64748b' }}>
              <span>
                DATE: <strong style={{ color: '#0f172a' }}>{englishDate}</strong>
              </span>
              <span className="mx-2">•</span>
              <span>
                TIME: <strong style={{ color: '#0f172a' }}>{englishTime}</strong>
              </span>
            </div>

            <div
              className="text-[9px] font-black uppercase tracking-widest"
              style={{ color: '#94a3b8' }}
            >
              UNITY EARNING & LEARNING PLATFORM
            </div>
          </div>

          {/* Right Side: Admin Signature */}
          <div className="flex flex-col items-center text-center min-w-[170px]">
            <div className="h-8 flex items-center justify-center select-none">
              <svg
                className="w-36 h-8"
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

            <div
              className="w-36 h-px mt-0.5 mb-1"
              style={{ backgroundColor: '#94a3b8' }}
            />

            <div
              className="text-[11px] font-black tracking-wider uppercase"
              style={{ color: '#0f172a' }}
            >
              {adminName || 'JIHADUL ISLAM'}
            </div>
            <div
              className="text-[10px] font-semibold"
              style={{ color: '#475569' }}
            >
              {adminRole || 'Executive Admin & Managing Director'}
            </div>
          </div>
        </div>

        {/* Bottom Bar Authenticity Stamp */}
        <div
          className="mt-4 pt-2 border-t text-center text-[9px] font-black tracking-widest uppercase"
          style={{
            borderColor: '#e2e8f0',
            color: '#94a3b8',
          }}
        >
          OFFICIAL PERFORMANCE DOCUMENT • AUTHENTIC & SECURE RECORD
        </div>
      </div>
    </div>
  );
};

export const RankingSection: React.FC<RankingSectionProps> = ({
  teamLeaders,
  teamTrainers,
  metadata,
  currentDateTime,
}) => {
  // 1. Sub-tab: 'leader' | 'trainer' | 'both'
  const [activeTab, setActiveTab] = useState<'leader' | 'trainer' | 'both'>('leader');

  // 2. Aspect Ratio: '9:16' (TikTok/Story) | '4:5' (Social Post) | 'a4' (Standard)
  const [frameRatio, setFrameRatio] = useState<RankingFrameRatio>('9:16');

  // 3. Custom / Overridden ranking lists
  const [customLeaders, setCustomLeaders] = useState<RankingMemberItem[] | null>(null);
  const [customTrainers, setCustomTrainers] = useState<RankingMemberItem[] | null>(null);

  // 4. Modals & Raw Import Drawer state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<RankingMemberItem | null>(null);
  const [isRawPasteOpen, setIsRawPasteOpen] = useState(false);
  const [rawPasteText, setRawPasteText] = useState('');
  const [rawPasteRole, setRawPasteRole] = useState<'leader' | 'trainer'>('leader');

  // 5. Download States & Menu Popover
  const [isDownloadingImage, setIsDownloadingImage] = useState(false);
  const [isDownloadingPDF, setIsDownloadingPDF] = useState(false);
  const [isDownloadMenuOpen, setIsDownloadMenuOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Compute Base Leader list from props if not custom
  const effectiveLeaders: RankingMemberItem[] = useMemo(() => {
    if (customLeaders !== null) return customLeaders;
    return teamLeaders
      .map((emp) => {
        const bal = typeof emp.balance === 'number' ? emp.balance : 0;
        let conv = typeof emp.convert === 'number' ? emp.convert : 0;
        // If convert was empty or 0, calculate from balance / 60
        if (!conv && bal > 0) {
          conv = Math.round(bal / 60);
        }
        return {
          id: emp.id,
          name: emp.name,
          emailOrPhone: '',
          balance: bal,
          convert: conv,
          role: 'leader' as const,
        };
      })
      // Filter out zero converts as explicitly requested: "যার কনভার্ট জিরো থাকবে তাকে লিস্ট থেকে বাদ দিবা"
      .filter((item) => item.convert > 0 && item.name.trim() !== '')
      .sort((a, b) => b.convert - a.convert);
  }, [teamLeaders, customLeaders]);

  // Compute Base Trainer list from props if not custom
  const effectiveTrainers: RankingMemberItem[] = useMemo(() => {
    if (customTrainers !== null) return customTrainers;
    return teamTrainers
      .map((emp) => {
        const bal = typeof emp.balance === 'number' ? emp.balance : 0;
        let conv = typeof emp.convert === 'number' ? emp.convert : 0;
        // If convert was empty or 0, calculate from balance / 50
        if (!conv && bal > 0) {
          conv = Math.round(bal / 50);
        }
        return {
          id: emp.id,
          name: emp.name,
          emailOrPhone: '',
          balance: bal,
          convert: conv,
          role: 'trainer' as const,
        };
      })
      // Filter out zero converts as explicitly requested
      .filter((item) => item.convert > 0 && item.name.trim() !== '')
      .sort((a, b) => b.convert - a.convert);
  }, [teamTrainers, customTrainers]);

  // Combined both items
  const displayBothItems = useMemo(() => {
    return [...effectiveLeaders, ...effectiveTrainers].sort(
      (a, b) => b.convert - a.convert
    );
  }, [effectiveLeaders, effectiveTrainers]);

  // Active items based on current tab
  const displayItems = useMemo(() => {
    if (activeTab === 'leader') return effectiveLeaders;
    if (activeTab === 'trainer') return effectiveTrainers;
    return displayBothItems;
  }, [activeTab, effectiveLeaders, effectiveTrainers, displayBothItems]);

  // Reset to auto-sync with main sheet
  const handleResetToSheet = () => {
    if (activeTab === 'leader') {
      setCustomLeaders(null);
      showToast('টিম লিডার র‍্যাঙ্কিং মেইন শিট থেকে পুনরায় সিঙ্ক করা হয়েছে');
    } else if (activeTab === 'trainer') {
      setCustomTrainers(null);
      showToast('টিম ট্রেইনার র‍্যাঙ্কিং মেইন শিট থেকে পুনরায় সিঙ্ক করা হয়েছে');
    } else {
      setCustomLeaders(null);
      setCustomTrainers(null);
      showToast('উভয় র‍্যাঙ্কিং মেইন শিটের সাথে সফলভাবে সিঙ্ক হয়েছে');
    }
  };

  // Add new item
  const handleSaveNewItem = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = (formData.get('name') as string)?.trim() || 'New Member';
    const emailOrPhone = (formData.get('emailOrPhone') as string)?.trim() || '';
    const balance = Number(formData.get('balance')) || 0;
    let convert = Number(formData.get('convert'));

    const role = (formData.get('role') as 'leader' | 'trainer') || (activeTab === 'trainer' ? 'trainer' : 'leader');

    // Auto-calculate convert if left empty or 0
    if (!convert && balance > 0) {
      convert = Math.round(balance / (role === 'leader' ? 60 : 50));
    }

    if (convert <= 0) {
      alert('র‍্যাঙ্কিংয়ে যুক্ত করতে কনভার্ট সংখ্যা শূন্যের বেশি ( > 0 ) হতে হবে!');
      return;
    }

    const newItem: RankingMemberItem = {
      id: `custom-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      name,
      emailOrPhone,
      balance,
      convert,
      role,
      isCustom: true,
    };

    if (role === 'leader') {
      const updated = [...effectiveLeaders, newItem]
        .filter((i) => i.convert > 0)
        .sort((a, b) => b.convert - a.convert);
      setCustomLeaders(updated);
      showToast(`টিম লিডার "${name}" (${convert} কনভার্ট) যুক্ত হয়েছে!`);
    } else {
      const updated = [...effectiveTrainers, newItem]
        .filter((i) => i.convert > 0)
        .sort((a, b) => b.convert - a.convert);
      setCustomTrainers(updated);
      showToast(`টিম ট্রেইনার "${name}" (${convert} কনভার্ট) যুক্ত হয়েছে!`);
    }

    setIsAddModalOpen(false);
  };

  // Update existing item
  const handleUpdateItem = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingItem) return;

    const formData = new FormData(e.currentTarget);
    const name = (formData.get('name') as string)?.trim() || editingItem.name;
    const emailOrPhone = (formData.get('emailOrPhone') as string)?.trim() || '';
    let convert = Number(formData.get('convert'));
    const balance = Number(formData.get('balance')) || 0;

    if (!convert && balance > 0) {
      convert = Math.round(balance / (editingItem.role === 'leader' ? 60 : 50));
    }

    if (convert <= 0) {
      alert('কনভার্ট সংখ্যা শূন্যের বেশি ( > 0 ) হতে হবে। শূন্য কনভার্টের সদস্য র‍্যাঙ্কিংয়ে রাখা যাবে না।');
      return;
    }

    const updatedItem: RankingMemberItem = {
      ...editingItem,
      name,
      emailOrPhone,
      balance,
      convert,
    };

    if (editingItem.role === 'leader') {
      const list = effectiveLeaders.map((i) => (i.id === editingItem.id ? updatedItem : i));
      const sorted = list.sort((a, b) => b.convert - a.convert);
      setCustomLeaders(sorted);
    } else {
      const list = effectiveTrainers.map((i) => (i.id === editingItem.id ? updatedItem : i));
      const sorted = list.sort((a, b) => b.convert - a.convert);
      setCustomTrainers(sorted);
    }

    setEditingItem(null);
    showToast(`"${name}" এর র‍্যাঙ্কিং কনভার্ট (${convert}) আপডেট হয়েছে!`);
  };

  // Delete item from ranking
  const handleDeleteItem = (id: string, role: 'leader' | 'trainer', name: string) => {
    if (!confirm(`আপনি কি "${name}" কে র‍্যাঙ্কিং লিস্ট থেকে বাদ দিতে চান?`)) return;

    if (role === 'leader') {
      const updated = effectiveLeaders.filter((i) => i.id !== id);
      setCustomLeaders(updated);
    } else {
      const updated = effectiveTrainers.filter((i) => i.id !== id);
      setCustomTrainers(updated);
    }
    showToast(`"${name}" কে র‍্যাঙ্কিং লিস্ট থেকে বাদ দেওয়া হয়েছে`);
  };

  // Raw portal paste import inside Ranking section
  const handleProcessRawPaste = () => {
    if (!rawPasteText.trim()) return;

    const rate = rawPasteRole === 'leader' ? 60 : 50;
    const result = parseRawPortalData(rawPasteText, rawPasteRole, rate);

    if (result.parsedItems.length === 0) {
      alert('কোনো ভ্যালিড ডাটা পাওয়া যায়নি। অনুগ্রহ করে পোর্টাল থেকে কপি করা টেবিল টেক্সট পেস্ট করুন।');
      return;
    }

    const newRankingItems: RankingMemberItem[] = result.parsedItems
      .filter((p) => p.convert > 0 && !p.isZero)
      .map((p, idx) => ({
        id: `raw-${Date.now()}-${idx}`,
        name: p.name,
        emailOrPhone: p.email || p.phone || '',
        balance: p.balance,
        convert: p.convert,
        role: rawPasteRole,
        isCustom: true,
      }))
      .sort((a, b) => b.convert - a.convert);

    if (rawPasteRole === 'leader') {
      setCustomLeaders(newRankingItems);
      setActiveTab('leader');
      showToast(`${newRankingItems.length} জন টিম লিডারের র‍্যাঙ্কিং তৈরি হয়েছে (ভাগ ৬০)!`);
    } else {
      setCustomTrainers(newRankingItems);
      setActiveTab('trainer');
      showToast(`${newRankingItems.length} জন টিম ট্রেইনারের র‍্যাঙ্কিং তৈরি হয়েছে (ভাগ ৫০)!`);
    }

    setIsRawPasteOpen(false);
    setRawPasteText('');
  };

  /**
   * Unified Download Handler:
   * Supports exporting:
   * 1. 'leader' (Team Leader only)
   * 2. 'trainer' (Team Trainer only)
   * 3. 'both' (Both Combined)
   * In either 'pdf' or 'image' format!
   */
  const handleExportRanking = async (
    targetRole: 'leader' | 'trainer' | 'both',
    format: 'pdf' | 'image'
  ) => {
    try {
      if (format === 'pdf') setIsDownloadingPDF(true);
      else setIsDownloadingImage(true);

      const elementId =
        targetRole === 'leader'
          ? 'ranking-poster-export-leader'
          : targetRole === 'trainer'
          ? 'ranking-poster-export-trainer'
          : 'ranking-poster-export-both';

      const label =
        targetRole === 'leader'
          ? 'টিম লিডার'
          : targetRole === 'trainer'
          ? 'টিম ট্রেইনার'
          : 'উভয় একসাথে (কম্বাইন্ড)';

      showToast(`${label} র‍্যাঙ্কিং ${format === 'pdf' ? 'PDF' : 'ইমেজ'} তৈরি হচ্ছে...`);
      const dateStr = new Date().toISOString().slice(0, 10);
      const filename = `UEP_Ranking_${targetRole.toUpperCase()}_${dateStr}`;

      if (format === 'pdf') {
        await downloadRankingPosterPDF(elementId, `${filename}.pdf`);
      } else {
        await downloadRankingPosterImage(elementId, `${filename}.png`);
      }

      showToast(`${label} র‍্যাঙ্কিং (${format === 'pdf' ? 'PDF' : 'PNG'}) সফলভাবে ডাউনলোড হয়েছে!`);
      setIsDownloadMenuOpen(false);
    } catch (err) {
      console.error(err);
      alert('র‍্যাঙ্কিং ডাউনলোডে সমস্যা হয়েছে। আবার চেষ্টা করুন।');
    } finally {
      setIsDownloadingPDF(false);
      setIsDownloadingImage(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  // Title labels (Pure English, no division/formula notes)
  const getSubTitleText = () => {
    if (activeTab === 'leader') return 'Official Team Leader Ranking';
    if (activeTab === 'trainer') return 'Official Team Trainer Ranking';
    return 'Combined Team Leader & Trainer Ranking';
  };

  const getMainTitleText = () => {
    if (activeTab === 'leader') return 'TEAM LEADER RANKING';
    if (activeTab === 'trainer') return 'TEAM TRAINER RANKING';
    return 'TEAM LEADER & TEAM TRAINER RANKING';
  };

  // Aspect ratio styling classes
  const getContainerFrameClasses = () => {
    switch (frameRatio) {
      case '9:16':
        return 'w-full max-w-[500px] min-h-[880px] shadow-2xl rounded-2xl'; // TikTok / FB story vertical frame
      case '4:5':
        return 'w-full max-w-[580px] min-h-[725px] shadow-2xl rounded-2xl'; // Social post frame
      case 'a4':
      default:
        return 'w-full max-w-[760px] min-h-[1050px] shadow-2xl rounded-xl'; // A4
    }
  };

  const getExportFrameWidth = () => {
    switch (frameRatio) {
      case '9:16':
        return '720px';
      case '4:5':
        return '800px';
      case 'a4':
      default:
        return '900px';
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-emerald-600 text-white px-5 py-3 rounded-xl shadow-xl flex items-center gap-2.5 font-bold text-sm animate-bounce no-print">
          <CheckCircle2 className="w-5 h-5 text-emerald-200" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Control Bar & Navigation Tabs (No-Print) */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl text-white no-print">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          {/* Section Heading & Mode Switcher */}
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-yellow-300 text-slate-950 flex items-center justify-center font-black shadow-md shadow-amber-500/20">
                <Trophy className="w-5 h-5 text-slate-950 fill-current" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-black tracking-wide text-white flex items-center gap-2">
                  <span>ইউনিটি আর্নিং লার্নিং প্ল্যাটফর্ম</span>
                  <span className="text-amber-400 font-extrabold text-xs uppercase px-2 py-0.5 rounded bg-amber-500/20 border border-amber-500/30">
                    র‍্যাঙ্কিং বোর্ড
                  </span>
                </h2>
                <p className="text-xs text-slate-400 font-medium">
                  শুধুমাত্র কনভার্ট প্রদর্শিত (ব্যালেন্স গোপন) • টিম লিডার ÷৬০, টিম ট্রেইনার ÷৫০ • জিরো ফিল্টার্ড
                </p>
              </div>
            </div>
          </div>

          {/* Role Sub-tabs: Leader vs Trainer vs Both */}
          <div className="flex flex-wrap items-center bg-slate-800/90 p-1 rounded-xl border border-slate-700/80 gap-1 text-xs font-bold">
            <button
              onClick={() => setActiveTab('leader')}
              className={`cursor-pointer inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg transition-all ${
                activeTab === 'leader'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Crown className="w-4 h-4 text-amber-300" />
              <span>টিম লিডার র‍্যাঙ্কিং</span>
              <span className="ml-1 text-[10px] px-1.5 py-0.2 rounded-full bg-blue-900/60 text-blue-200">
                {effectiveLeaders.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('trainer')}
              className={`cursor-pointer inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg transition-all ${
                activeTab === 'trainer'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Award className="w-4 h-4 text-emerald-200" />
              <span>টিম ট্রেইনার র‍্যাঙ্কিং</span>
              <span className="ml-1 text-[10px] px-1.5 py-0.2 rounded-full bg-emerald-900/60 text-emerald-200">
                {effectiveTrainers.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('both')}
              className={`cursor-pointer inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg transition-all ${
                activeTab === 'both'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Users className="w-4 h-4 text-purple-200" />
              <span>উভয় একসাথে (কম্বাইন্ড)</span>
              <span className="ml-1 text-[10px] px-1.5 py-0.2 rounded-full bg-purple-900/60 text-purple-200">
                {effectiveLeaders.length + effectiveTrainers.length}
              </span>
            </button>
          </div>

          {/* Action buttons: Add Member, Paste Raw Data, Sync */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
              title="Add person directly to ranking"
            >
              <Plus className="w-4 h-4 text-amber-400" />
              <span>+ সদস্য যুক্ত করুন</span>
            </button>

            <button
              onClick={() => setIsRawPasteOpen(!isRawPasteOpen)}
              className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold bg-indigo-950/60 hover:bg-indigo-900/80 text-indigo-200 border border-indigo-700/60 transition-colors"
              title="Paste raw portal table data directly to rank"
            >
              <ClipboardPaste className="w-4 h-4 text-indigo-400" />
              <span>র ডাটা পেস্ট বক্স</span>
            </button>

            <button
              onClick={handleResetToSheet}
              className="cursor-pointer inline-flex items-center gap-1 px-2.5 py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="Sync from current salary sheet rows"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>শিট থেকে সিঙ্ক</span>
            </button>
          </div>
        </div>

        {/* Frame Format Selector & Export Row */}
        <div className="mt-4 pt-3.5 border-t border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          {/* Ratio Selector (TikTok / FB Story vs Social Post vs A4) */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-bold flex items-center gap-1">
              <Sliders className="w-3.5 h-3.5 text-amber-400" />
              <span>ফ্রেম সাইজ:</span>
            </span>

            <div className="flex items-center bg-slate-800 p-0.5 rounded-lg border border-slate-700 text-xs">
              <button
                onClick={() => setFrameRatio('9:16')}
                className={`cursor-pointer px-2.5 py-1 rounded font-bold transition-all ${
                  frameRatio === '9:16'
                    ? 'bg-amber-500 text-slate-950 font-black shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Mobile 9:16 Vertical Story (TikTok, Facebook Story, Reels)"
              >
                📱 9:16 মোবাইল ফ্রেম
              </button>

              <button
                onClick={() => setFrameRatio('4:5')}
                className={`cursor-pointer px-2.5 py-1 rounded font-bold transition-all ${
                  frameRatio === '4:5'
                    ? 'bg-amber-500 text-slate-950 font-black shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Social Media 4:5 Portrait Post"
              >
                📲 4:5 পোস্ট
              </button>

              <button
                onClick={() => setFrameRatio('a4')}
                className={`cursor-pointer px-2.5 py-1 rounded font-bold transition-all ${
                  frameRatio === 'a4'
                    ? 'bg-amber-500 text-slate-950 font-black shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Full A4 Sheet Format"
              >
                📄 A4
              </button>
            </div>
          </div>

          {/* Download Buttons with Separate & Combined Options */}
          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end relative">
            {/* Quick Active Tab PDF */}
            <button
              onClick={() => handleExportRanking(activeTab, 'pdf')}
              disabled={isDownloadingPDF}
              className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-extrabold uppercase bg-rose-600 hover:bg-rose-500 active:bg-rose-700 text-white transition-all shadow-md hover:shadow-rose-600/30 disabled:opacity-60"
              title="Download currently active ranking tab as PDF"
            >
              <FileText className="w-3.5 h-3.5 text-rose-200" />
              <span>
                {isDownloadingPDF
                  ? 'পিডিএফ হচ্ছে...'
                  : `ডাউনলোড PDF (${
                      activeTab === 'leader'
                        ? 'টিম লিডার'
                        : activeTab === 'trainer'
                        ? 'টিম ট্রেইনার'
                        : 'উভয়'
                    })`}
              </span>
            </button>

            {/* Quick Active Tab PNG Image */}
            <button
              onClick={() => handleExportRanking(activeTab, 'image')}
              disabled={isDownloadingImage}
              className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-extrabold uppercase bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white transition-all shadow-md hover:shadow-emerald-600/30 disabled:opacity-60"
              title="Download currently active ranking tab as PNG image"
            >
              <Download className="w-3.5 h-3.5 text-emerald-200" />
              <span>
                {isDownloadingImage
                  ? 'ইমেজ হচ্ছে...'
                  : `ডাউনলোড ইমেজ (${
                      activeTab === 'leader'
                        ? 'টিম লিডার'
                        : activeTab === 'trainer'
                        ? 'টিম ট্রেইনার'
                        : 'উভয়'
                    })`}
              </span>
            </button>

            {/* Comprehensive Separate & Combined Download Menu */}
            <div className="relative">
              <button
                onClick={() => setIsDownloadMenuOpen(!isDownloadMenuOpen)}
                className="cursor-pointer inline-flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-extrabold bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 transition-all shadow-md shadow-amber-500/20"
                title="Download Team Leader only, Team Trainer only, or Both Together"
              >
                <span>ডাউনলোড মেনু</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>

              {/* Dropdown Menu */}
              {isDownloadMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-72 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-3 z-50 text-white space-y-2.5 animate-in fade-in zoom-in-95 duration-150">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-xs font-bold text-amber-400">
                    <span className="flex items-center gap-1.5">
                      <Download className="w-3.5 h-3.5" />
                      <span>র‍্যাঙ্কিং ডাউনলোড অপশনসমূহ</span>
                    </span>
                    <button
                      onClick={() => setIsDownloadMenuOpen(false)}
                      className="text-slate-400 hover:text-white"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* 1. Leader Only */}
                  <div className="bg-slate-800/80 p-2 rounded-lg border border-slate-700/60">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-bold text-blue-300 flex items-center gap-1">
                        <Crown className="w-3.5 h-3.5 text-amber-300" />
                        <span>👑 শুধু টিম লিডার</span>
                      </span>
                      <span className="text-[10px] text-slate-400">({effectiveLeaders.length} জন)</span>
                    </div>
                    <div className="grid grid-cols-2 gap-1.5">
                      <button
                        onClick={() => handleExportRanking('leader', 'pdf')}
                        className="cursor-pointer px-2 py-1 bg-rose-600 hover:bg-rose-500 text-white rounded text-[11px] font-bold text-center flex items-center justify-center gap-1"
                      >
                        <FileText className="w-3 h-3" />
                        <span>PDF</span>
                      </button>
                      <button
                        onClick={() => handleExportRanking('leader', 'image')}
                        className="cursor-pointer px-2 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-[11px] font-bold text-center flex items-center justify-center gap-1"
                      >
                        <Download className="w-3 h-3" />
                        <span>ইমেজ (PNG)</span>
                      </button>
                    </div>
                  </div>

                  {/* 2. Trainer Only */}
                  <div className="bg-slate-800/80 p-2 rounded-lg border border-slate-700/60">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-bold text-emerald-300 flex items-center gap-1">
                        <Award className="w-3.5 h-3.5 text-emerald-300" />
                        <span>⚡ শুধু টিম ট্রেইনার</span>
                      </span>
                      <span className="text-[10px] text-slate-400">({effectiveTrainers.length} জন)</span>
                    </div>
                    <div className="grid grid-cols-2 gap-1.5">
                      <button
                        onClick={() => handleExportRanking('trainer', 'pdf')}
                        className="cursor-pointer px-2 py-1 bg-rose-600 hover:bg-rose-500 text-white rounded text-[11px] font-bold text-center flex items-center justify-center gap-1"
                      >
                        <FileText className="w-3 h-3" />
                        <span>PDF</span>
                      </button>
                      <button
                        onClick={() => handleExportRanking('trainer', 'image')}
                        className="cursor-pointer px-2 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-[11px] font-bold text-center flex items-center justify-center gap-1"
                      >
                        <Download className="w-3 h-3" />
                        <span>ইমেজ (PNG)</span>
                      </button>
                    </div>
                  </div>

                  {/* 3. Both Together Combined */}
                  <div className="bg-slate-800/80 p-2 rounded-lg border border-purple-500/50">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-bold text-purple-300 flex items-center gap-1">
                        <Users className="w-3.5 h-3.5 text-purple-300" />
                        <span>🌟 উভয় একসাথে (কম্বাইন্ড)</span>
                      </span>
                      <span className="text-[10px] text-purple-300">
                        ({effectiveLeaders.length + effectiveTrainers.length} জন)
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-1.5">
                      <button
                        onClick={() => handleExportRanking('both', 'pdf')}
                        className="cursor-pointer px-2 py-1 bg-rose-600 hover:bg-rose-500 text-white rounded text-[11px] font-bold text-center flex items-center justify-center gap-1"
                      >
                        <FileText className="w-3 h-3" />
                        <span>PDF</span>
                      </button>
                      <button
                        onClick={() => handleExportRanking('both', 'image')}
                        className="cursor-pointer px-2 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-[11px] font-bold text-center flex items-center justify-center gap-1"
                      >
                        <Download className="w-3 h-3" />
                        <span>ইমেজ (PNG)</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={handlePrint}
              className="cursor-pointer hidden sm:inline-flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-bold text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-700 transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>প্রিন্ট</span>
            </button>
          </div>
        </div>

        {/* Collapsible Raw Data Paste Box */}
        {isRawPasteOpen && (
          <div className="mt-4 p-4 rounded-xl bg-slate-950/80 border border-indigo-500/40 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ClipboardPaste className="w-4 h-4 text-indigo-400" />
                <h4 className="text-xs font-bold text-indigo-300">
                  র ডাটা পেস্ট বক্স (পোর্টাল থেকে কপি করা টেবিল টেক্সট এখানে দিন)
                </h4>
              </div>
              <button
                onClick={() => setIsRawPasteOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center gap-4 text-xs font-semibold text-slate-300">
              <span>কার জন্য পেস্ট করছেন?</span>
              <label className="inline-flex items-center gap-1.5 cursor-pointer">
                <input
                  type="radio"
                  name="pasteTargetRole"
                  checked={rawPasteRole === 'leader'}
                  onChange={() => setRawPasteRole('leader')}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span>👑 টিম লিডার (ব্যালেন্স ÷ ৬০ = কনভার্ট)</span>
              </label>

              <label className="inline-flex items-center gap-1.5 cursor-pointer">
                <input
                  type="radio"
                  name="pasteTargetRole"
                  checked={rawPasteRole === 'trainer'}
                  onChange={() => setRawPasteRole('trainer')}
                  className="text-emerald-600 focus:ring-emerald-500"
                />
                <span>⚡ টিম ট্রেইনার (ব্যালেন্স ÷ ৫০ = কনভার্ট)</span>
              </label>
            </div>

            <textarea
              value={rawPasteText}
              onChange={(e) => setRawPasteText(e.target.value)}
              placeholder={`উদাহরণস্বরূপ পোর্টালের রো কপি করে এখানে পেস্ট করুন:\n1\tShimu Akter\tshimuakter121@gmail.com\t-01980217934\t0.00\tDebit\n2\tTasfiha Riya\ttasfihariya211@gmail.com\t01709455654\t1860.00\tDebit`}
              className="w-full h-24 p-2.5 rounded-lg bg-slate-900 border border-slate-700 text-xs font-mono text-slate-200 focus:outline-hidden focus:border-indigo-500"
            />

            <div className="flex items-center justify-between">
              <span className="text-[11px] text-slate-400">
                * যাদের ব্যালেন্স বা কনভার্ট ০ থাকবে তাদেরকে স্বয়ংক্রিয়ভাবে বাদ দেওয়া হবে।
              </span>
              <button
                onClick={handleProcessRawPaste}
                disabled={!rawPasteText.trim()}
                className="cursor-pointer px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs disabled:opacity-50 transition-all shadow-md"
              >
                স্বয়ংক্রিয় র‍্যাঙ্কিং তৈরি করুন
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Main Ranking Layout: Center the Card Poster for Screen View */}
      <div className="flex flex-col items-center justify-center p-2 sm:p-4">
        {/* On-screen view poster */}
        <RankingCardPoster
          id="ranking-poster-view"
          items={displayItems}
          title={getMainTitleText()}
          subTitle={getSubTitleText()}
          periodMonth={metadata.periodMonth}
          adminName={metadata.adminName}
          adminRole={metadata.adminRole}
          currentDateTime={currentDateTime}
          frameClasses={getContainerFrameClasses()}
          showRoleBadge={activeTab === 'both'}
        />
      </div>

      {/* =========================================================================
          HIDDEN UNCONSTRAINED EXPORT CLONE CONTAINERS (For pristine high-res exports)
          Renders 3 dedicated templates (Leader, Trainer, Both Combined)
          Guaranteeing separate & combined downloads at any time without flicker!
         ========================================================================= */}
      <div
        id="ranking-export-wrapper"
        className="pointer-events-none print:static print:z-auto print:pointer-events-auto"
        style={{
          position: 'fixed',
          left: '-99999px',
          top: '0',
          zIndex: 1,
          opacity: 1,
          visibility: 'visible',
        }}
      >
        {/* 1. Team Leader Poster Export */}
        <RankingCardPoster
          id="ranking-poster-export-leader"
          items={effectiveLeaders}
          title="TEAM LEADER RANKING"
          subTitle="Official Performance Leaderboard"
          periodMonth={metadata.periodMonth}
          adminName={metadata.adminName}
          adminRole={metadata.adminRole}
          currentDateTime={currentDateTime}
          frameStyle={{ width: getExportFrameWidth() }}
          showRoleBadge={false}
        />

        {/* 2. Team Trainer Poster Export */}
        <RankingCardPoster
          id="ranking-poster-export-trainer"
          items={effectiveTrainers}
          title="TEAM TRAINER RANKING"
          subTitle="Official Performance Leaderboard"
          periodMonth={metadata.periodMonth}
          adminName={metadata.adminName}
          adminRole={metadata.adminRole}
          currentDateTime={currentDateTime}
          frameStyle={{ width: getExportFrameWidth() }}
          showRoleBadge={false}
        />

        {/* 3. Both Together Combined Poster Export */}
        <RankingCardPoster
          id="ranking-poster-export-both"
          items={displayBothItems}
          title="TEAM LEADER & TEAM TRAINER RANKING"
          subTitle="Combined Performance Leaderboard"
          periodMonth={metadata.periodMonth}
          adminName={metadata.adminName}
          adminRole={metadata.adminRole}
          currentDateTime={currentDateTime}
          frameStyle={{ width: getExportFrameWidth() }}
          showRoleBadge={true}
        />

        {/* 4. Active Tab alias for default download calls */}
        <RankingCardPoster
          id="ranking-poster-export"
          items={displayItems}
          title={getMainTitleText()}
          subTitle={getSubTitleText()}
          periodMonth={metadata.periodMonth}
          adminName={metadata.adminName}
          adminRole={metadata.adminRole}
          currentDateTime={currentDateTime}
          frameStyle={{ width: getExportFrameWidth() }}
          showRoleBadge={activeTab === 'both'}
        />
      </div>

      {/* =========================================================
          MANAGEMENT / EDIT TABLE FOR ADMIN (Direct manipulation)
          Only Name, Role, Convert & Action (No Balance Displayed)
         ========================================================= */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl text-white no-print">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-bold text-slate-200">
              র‍্যাঙ্কিং টেবিল ডাটা এডিটর ও সদস্য তালিকা ({displayItems.length} জন)
            </h3>
          </div>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 transition-colors shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>নতুন সদস্য যোগ করুন</span>
          </button>
        </div>

        <div className="mt-3 overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-bold uppercase text-[10px]">
                <th className="py-2.5 px-3">র‍্যাঙ্ক</th>
                <th className="py-2.5 px-3">নাম</th>
                <th className="py-2.5 px-3">রোল</th>
                <th className="py-2.5 px-3">কনভার্ট সংখ্যা</th>
                <th className="py-2.5 px-3 text-right">অ্যাকশন</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium">
              {displayItems.map((item, idx) => (
                <tr key={`manage-${item.id}`} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-2.5 px-3 font-bold text-amber-400">#{idx + 1}</td>
                  <td className="py-2.5 px-3 font-bold text-white">
                    {item.name}
                    {item.emailOrPhone && (
                      <span className="block text-[10px] text-slate-400 font-normal">
                        {item.emailOrPhone}
                      </span>
                    )}
                  </td>
                  <td className="py-2.5 px-3">
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded font-extrabold uppercase ${
                        item.role === 'leader'
                          ? 'bg-blue-900/60 text-blue-300 border border-blue-700/50'
                          : 'bg-emerald-900/60 text-emerald-300 border border-emerald-700/50'
                      }`}
                    >
                      {item.role === 'leader' ? 'টিম লিডার' : 'টিম ট্রেইনার'}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 font-mono font-black text-emerald-400 text-sm">
                    {item.convert}
                  </td>
                  <td className="py-2.5 px-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => setEditingItem(item)}
                        className="cursor-pointer p-1.5 rounded hover:bg-slate-800 text-sky-400 hover:text-sky-300"
                        title="Edit convert or details"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteItem(item.id, item.role, item.name)}
                        className="cursor-pointer p-1.5 rounded hover:bg-slate-800 text-rose-400 hover:text-rose-300"
                        title="Remove from ranking"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* =========================================================
          ADD MEMBER MODAL
         ========================================================= */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs no-print">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl text-white space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-amber-400 flex items-center gap-2">
                <Plus className="w-4 h-4" />
                <span>র‍্যাঙ্কিংয়ে নতুন সদস্য যুক্ত করুন</span>
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveNewItem} className="space-y-4 text-xs font-semibold">
              <div>
                <label className="block text-slate-300 mb-1">সদস্যের নাম *</label>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="যেমন: Shimu Akter"
                  className="w-full p-2.5 rounded-lg bg-slate-800 border border-slate-700 text-white focus:outline-hidden focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1">ইমেইল বা ফোন (ঐচ্ছিক)</label>
                <input
                  type="text"
                  name="emailOrPhone"
                  placeholder="যেমন: 01700000000 বা test@gmail.com"
                  className="w-full p-2.5 rounded-lg bg-slate-800 border border-slate-700 text-white focus:outline-hidden focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1">পদবী / রোল *</label>
                <select
                  name="role"
                  defaultValue={activeTab === 'trainer' ? 'trainer' : 'leader'}
                  className="w-full p-2.5 rounded-lg bg-slate-800 border border-slate-700 text-white focus:outline-hidden focus:border-amber-400"
                >
                  <option value="leader">👑 টিম লিডার</option>
                  <option value="trainer">⚡ টিম ট্রেইনার</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 mb-1">
                  মোট কনভার্ট সংখ্যা (সরাসরি কনভার্ট লিখুন) *
                </label>
                <input
                  type="number"
                  name="convert"
                  required
                  min="1"
                  placeholder="যেমন: 31"
                  className="w-full p-2.5 rounded-lg bg-slate-800 border border-slate-700 text-emerald-400 font-mono font-bold text-sm focus:outline-hidden focus:border-emerald-500"
                />
                <p className="text-[10px] text-slate-400 mt-1">
                  * র‍্যাঙ্কিংয়ে শুধুমাত্র এই কনভার্ট সংখ্যাটি প্রদর্শিত হবে।
                </p>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold shadow-md"
                >
                  যোগ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================
          EDIT MEMBER MODAL
         ========================================================= */}
      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs no-print">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl text-white space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-sky-400 flex items-center gap-2">
                <Edit2 className="w-4 h-4" />
                <span>র‍্যাঙ্কিং তথ্য এডিট করুন</span>
              </h3>
              <button
                onClick={() => setEditingItem(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateItem} className="space-y-4 text-xs font-semibold">
              <div>
                <label className="block text-slate-300 mb-1">নাম</label>
                <input
                  type="text"
                  name="name"
                  defaultValue={editingItem.name}
                  required
                  className="w-full p-2.5 rounded-lg bg-slate-800 border border-slate-700 text-white focus:outline-hidden focus:border-sky-400"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1">ইমেইল বা ফোন</label>
                <input
                  type="text"
                  name="emailOrPhone"
                  defaultValue={editingItem.emailOrPhone || ''}
                  className="w-full p-2.5 rounded-lg bg-slate-800 border border-slate-700 text-white focus:outline-hidden focus:border-sky-400"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1">
                  কনভার্ট সংখ্যা (সরাসরি পরিবর্তন করুন)
                </label>
                <input
                  type="number"
                  name="convert"
                  defaultValue={editingItem.convert}
                  required
                  min="1"
                  className="w-full p-2.5 rounded-lg bg-slate-800 border border-slate-700 text-emerald-400 font-mono font-bold text-sm focus:outline-hidden focus:border-emerald-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold shadow-md"
                >
                  আপডেট করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
