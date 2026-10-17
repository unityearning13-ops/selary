import React, { useState } from 'react';
import { Employee } from '../types/salary';
import { parseRawPortalData, ParseResult } from '../utils/rawParser';
import {
  FileText,
  Sparkles,
  ArrowDownCircle,
  PlusCircle,
  Trash2,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface RawDataImportSectionProps {
  onImportTeamLeaders: (newEmployees: Employee[], mode: 'replace' | 'append') => void;
  onImportTeamTrainers: (newEmployees: Employee[], mode: 'replace' | 'append') => void;
}

// User-provided sample raw data for instant testing
const SAMPLE_RAW_DATA = `	Shimu Akter	shimuakter121@gmail.com	-01980217934	0.00	Debit
Credit	
Active
  
2	Tasfiha Riya	tasfihariya211@gmail.com	01709455654	1860.00	Debit
Credit	
Active
  
3	Dolna Sharma	dolnashil2121@gmail.com	01759156167	1130.00	Debit
Credit	
Active
  
4	Md Shomik	shomikulamin1122@gmail.com	01898220171	1920.00	Debit
Credit	
Active
  
5	Rafi Ahmed	rafiahmed233@gmail.com	-01978740789	1020.00	Debit
Credit	
Active
  
6	Hafiza Akter	hafizaakter12@gmail.com	8801706013492	1080.00	Debit
Credit	
Active
  
7	Ayesa Alo	ayeshaalo123@gmail.com	8801825108749	1440.00	Debit
Credit	
Active
  
8	Lamiya Islam	lamiyaislam212@gmail.com	-01908645101	400.00	Debit
Credit	
Active
  
9	ɪʙʀᴀʜɪᴍ ɪʙʀᴀʜɪᴍ	ibrahimhossain@gmail.com	-01340835152	2040.00	Debit
Credit	
Active
  
10	Jannat Jahan	jannatjahan211@gmail.com	01752272811	1960.00	Debit
Credit	
Active
  
11	Rocky Hasan	rockyhasan233@gmail.com	01854140785	2100.00	Debit
Credit	
Active
  
12	Sanjida Alam	sanjidaalam12@gmail.com	-01306715143	2820.00	Debit
Credit	
Active
  
13	Tabassum Suchi	tabassumsuchi233@gmail.com	-01847714667	960.00	Debit
Credit	
Active
  
14	Tanha Islam	jihadul@gmail.com	01919012424	0.00	Debit
Credit	
Active
  
15	Farhana Kakoli	farhanakakoli@gmail.com	01774871779	0.00	Debit
Credit	
Active
  
16	Shayla Setu	shaylasetu11@gmail.com	-01965492267	1200.00	Debit
Credit	
Active
  
17	Tasnia Moni	tasniamoni123@gmail.com	8801839199334	3660.00	Debit
Credit	
Active
  
18	Tahsin Akter	tahsinakter123@gmail.com	-01342645204	720.00	Debit
Credit	
Active
  
19	Jihadul Islam	jihaddd@gmail.com	01919012424	0.00	Debit
Credit	
Active
  
Showing 1 to 19 of 19 entries
Previous
1
Next`;

export const RawDataImportSection: React.FC<RawDataImportSectionProps> = ({
  onImportTeamLeaders,
  onImportTeamTrainers,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [leaderRawText, setLeaderRawText] = useState('');
  const [trainerRawText, setTrainerRawText] = useState('');

  const [leaderResult, setLeaderResult] = useState<ParseResult | null>(null);
  const [trainerResult, setTrainerResult] = useState<ParseResult | null>(null);

  const [showLeaderPreview, setShowLeaderPreview] = useState(false);
  const [showTrainerPreview, setShowTrainerPreview] = useState(false);

  const [toast, setToast] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 4000);
  };

  // Re-parse when text changes
  const handleLeaderTextChange = (text: string) => {
    setLeaderRawText(text);
    if (!text.trim()) {
      setLeaderResult(null);
      return;
    }
    const res = parseRawPortalData(text, 'leader', 60);
    setLeaderResult(res);
  };

  const handleTrainerTextChange = (text: string) => {
    setTrainerRawText(text);
    if (!text.trim()) {
      setTrainerResult(null);
      return;
    }
    const res = parseRawPortalData(text, 'trainer', 50);
    setTrainerResult(res);
  };

  const handleApplyLeader = (mode: 'replace' | 'append') => {
    if (!leaderResult || leaderResult.validCount === 0) {
      triggerToast('কোনো বৈধ ডাটা পাওয়া যায়নি!');
      return;
    }
    onImportTeamLeaders(leaderResult.activeEmployees, mode);
    triggerToast(
      `✓ টিম লিডার টেবিলে ${leaderResult.validCount} জনের ডাটা সফলভাবে ${
        mode === 'replace' ? 'প্রতিস্থাপন' : 'সংযুক্ত'
      } করা হয়েছে (০.০০ ব্যালেন্সের ${leaderResult.zeroCount} জন স্বয়ংক্রিয়ভাবে বাদ)!`
    );
  };

  const handleApplyTrainer = (mode: 'replace' | 'append') => {
    if (!trainerResult || trainerResult.validCount === 0) {
      triggerToast('কোনো বৈধ ডাটা পাওয়া যায়নি!');
      return;
    }
    onImportTeamTrainers(trainerResult.activeEmployees, mode);
    triggerToast(
      `✓ টিম ট্রেইনার টেবিলে ${trainerResult.validCount} জনের ডাটা সফলভাবে ${
        mode === 'replace' ? 'প্রতিস্থাপন' : 'সংযুক্ত'
      } করা হয়েছে (০.০০ ব্যালেন্সের ${trainerResult.zeroCount} জন স্বয়ংক্রিয়ভাবে বাদ)!`
    );
  };

  return (
    <div className="bg-gradient-to-r from-blue-900 via-slate-900 to-emerald-950 rounded-xl shadow-lg border-2 border-blue-500/40 text-white overflow-hidden mb-8 transition-all">
      {/* Header bar */}
      <div className="px-5 py-3.5 flex flex-wrap items-center justify-between gap-3 border-b border-white/15 bg-black/20">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-blue-500/20 text-cyan-400 flex items-center justify-center shrink-0 border border-cyan-400/30">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-black tracking-wide text-white">
                স্মার্ট র-ডাটা অটো-ইমপোর্ট ও কনভার্ট ক্যালকুলেটর
              </h2>
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-cyan-500/30 text-cyan-200 border border-cyan-400/30">
                Auto Detect & Zero Filter
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              ওয়েবসাইট বা পোর্টাল থেকে কপি করা টেবিল এখানে পেস্ট করুন। ব্যালেন্স থেকে অটোমেটিক কনভার্ট হিসাব হবে এবং <strong>০.০০ ব্যালেন্স থাকলে অটোমেটিক বাদ যাবে</strong>।
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {toast && (
            <span className="inline-flex items-center gap-1.5 text-xs font-bold bg-emerald-500 text-white px-3 py-1 rounded shadow-md animate-pulse">
              <CheckCircle2 className="w-3.5 h-3.5" />
              {toast}
            </span>
          )}
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="cursor-pointer text-xs font-bold bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-lg border border-white/20 flex items-center gap-1 transition-colors"
          >
            {isExpanded ? (
              <>
                <ChevronUp className="w-4 h-4" />
                <span>বক্স লুকান</span>
              </>
            ) : (
              <>
                <ChevronDown className="w-4 h-4" />
                <span>বক্স খুলুন</span>
              </>
            )}
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="p-4 sm:p-5 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* BOX 1: TEAM LEADER RAW INPUT */}
            <div className="bg-slate-900/80 rounded-xl border border-blue-400/40 p-4 shadow-inner flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                    <h3 className="font-extrabold text-sm text-blue-200 uppercase tracking-wide">
                      ১. টিম লিডার র-ডাটা বক্স
                    </h3>
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-blue-900/80 text-blue-300 border border-blue-600">
                      ভাগ: ৬০ (Convert = Balance ÷ 60)
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleLeaderTextChange(SAMPLE_RAW_DATA)}
                    className="cursor-pointer text-[11px] font-bold text-cyan-300 hover:text-cyan-100 underline"
                    title="ইউজারের দেওয়া ১৯ জনের নমুনা ডাটা বসিয়ে টেস্ট করুন"
                  >
                    নমুনা ডাটা পেস্ট করুন
                  </button>
                </div>

                <p className="text-[11px] text-slate-300 mb-2">
                  টিম লিডারের তালিকা এখানে পেস্ট করুন। ব্যালেন্সকে ৬০ দিয়ে ভাগ করে কনভার্ট বসবে।
                </p>

                <textarea
                  rows={6}
                  value={leaderRawText}
                  onChange={(e) => handleLeaderTextChange(e.target.value)}
                  placeholder="টিম লিডারদের পোর্টাল কপি ডাটা এখানে পেস্ট করুন..."
                  className="w-full p-2.5 text-xs font-mono rounded-lg bg-black/50 border border-blue-500/50 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent resize-y"
                />

                {/* Parsed Metrics Bar for Leader */}
                {leaderResult && (
                  <div className="mt-3 p-2.5 rounded-lg bg-blue-950/60 border border-blue-500/30 text-xs space-y-2">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center gap-3">
                        <span className="text-slate-300">
                          মোট শনাক্ত: <strong className="text-white">{leaderResult.parsedItems.length}</strong> জন
                        </span>
                        <span className="text-emerald-400 font-bold">
                          ✓ সক্রিয়: <strong>{leaderResult.validCount}</strong> জন
                        </span>
                        {leaderResult.zeroCount > 0 && (
                          <span className="text-rose-300 bg-rose-950/70 px-2 py-0.5 rounded text-[11px] font-semibold border border-rose-500/40">
                            ✕ ০.০০ ব্যালেন্স বাদ: <strong>{leaderResult.zeroCount}</strong> জন
                          </span>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowLeaderPreview(!showLeaderPreview)}
                        className="cursor-pointer text-[11px] text-cyan-300 hover:text-cyan-100 underline font-bold"
                      >
                        {showLeaderPreview ? 'প্রিভিউ লুকান' : 'প্রিভিউ দেখুন'}
                      </button>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-300 pt-1 border-t border-blue-800/40">
                      <span>
                        মোট কনভার্ট: <strong className="text-cyan-300 font-mono">{leaderResult.totalConvert}</strong>
                      </span>
                      <span>
                        মোট ব্যালেন্স: <strong className="text-emerald-300 font-mono">৳{leaderResult.totalBalance.toLocaleString()}</strong>
                      </span>
                    </div>

                    {showLeaderPreview && (
                      <div className="max-h-48 overflow-y-auto mt-2 border border-blue-800 rounded bg-black/60 p-1">
                        <table className="w-full text-[11px] text-left">
                          <thead className="text-slate-400 border-b border-slate-700 font-bold">
                            <tr>
                              <th className="p-1">#</th>
                              <th className="p-1">নাম</th>
                              <th className="p-1 text-center">ব্যালেন্স</th>
                              <th className="p-1 text-center">কনভার্ট (÷৬০)</th>
                              <th className="p-1 text-right">স্ট্যাটাস</th>
                            </tr>
                          </thead>
                          <tbody>
                            {leaderResult.parsedItems.map((item, idx) => (
                              <tr
                                key={idx}
                                className={`border-b border-slate-800/60 ${
                                  item.isZero ? 'opacity-40 bg-rose-950/20' : 'hover:bg-blue-900/30'
                                }`}
                              >
                                <td className="p-1 font-mono">{idx + 1}</td>
                                <td className="p-1 font-semibold text-slate-200">{item.name}</td>
                                <td className="p-1 text-center font-mono">৳{item.balance}</td>
                                <td className="p-1 text-center font-mono font-bold text-cyan-300">
                                  {item.convert}
                                </td>
                                <td className="p-1 text-right">
                                  {item.isZero ? (
                                    <span className="text-[10px] text-rose-400 font-bold">বাদ (০.০০)</span>
                                  ) : (
                                    <span className="text-[10px] text-emerald-400 font-bold">যোগ হবে</span>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Action buttons for Box 1 */}
              <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between gap-2 flex-wrap">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleApplyLeader('replace')}
                    disabled={!leaderResult || leaderResult.validCount === 0}
                    className="cursor-pointer inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-extrabold text-xs shadow-md transition-colors"
                  >
                    <ArrowDownCircle className="w-4 h-4" />
                    <span>টিম লিডারে বসান (Replace)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleApplyLeader('append')}
                    disabled={!leaderResult || leaderResult.validCount === 0}
                    className="cursor-pointer inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed text-blue-200 border border-blue-500/30 font-bold text-xs transition-colors"
                    title="বর্তমান তালিকার নিচে এই নামগুলো যোগ করুন"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>+ নিচে যোগ করুন</span>
                  </button>
                </div>
                {leaderRawText && (
                  <button
                    type="button"
                    onClick={() => {
                      setLeaderRawText('');
                      setLeaderResult(null);
                    }}
                    className="cursor-pointer text-slate-400 hover:text-rose-400 text-xs flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>মুছুন</span>
                  </button>
                )}
              </div>
            </div>

            {/* BOX 2: TEAM TRAINER RAW INPUT */}
            <div className="bg-slate-900/80 rounded-xl border border-emerald-400/40 p-4 shadow-inner flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                    <h3 className="font-extrabold text-sm text-emerald-200 uppercase tracking-wide">
                      ২. টিম ট্রেইনার র-ডাটা বক্স
                    </h3>
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-emerald-900/80 text-emerald-300 border border-emerald-600">
                      ভাগ: ৫০ (Convert = Balance ÷ 50)
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleTrainerTextChange(SAMPLE_RAW_DATA)}
                    className="cursor-pointer text-[11px] font-bold text-emerald-300 hover:text-emerald-100 underline"
                    title="ইউজারের দেওয়া ১৯ জনের নমুনা ডাটা বসিয়ে টেস্ট করুন"
                  >
                    নমুনা ডাটা পেস্ট করুন
                  </button>
                </div>

                <p className="text-[11px] text-slate-300 mb-2">
                  টিম ট্রেইনারদের তালিকা এখানে পেস্ট করুন। ব্যালেন্সকে ৫০ দিয়ে ভাগ করে কনভার্ট বসবে।
                </p>

                <textarea
                  rows={6}
                  value={trainerRawText}
                  onChange={(e) => handleTrainerTextChange(e.target.value)}
                  placeholder="টিম ট্রেইনারদের পোর্টাল কপি ডাটা এখানে পেস্ট করুন..."
                  className="w-full p-2.5 text-xs font-mono rounded-lg bg-black/50 border border-emerald-500/50 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent resize-y"
                />

                {/* Parsed Metrics Bar for Trainer */}
                {trainerResult && (
                  <div className="mt-3 p-2.5 rounded-lg bg-emerald-950/60 border border-emerald-500/30 text-xs space-y-2">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center gap-3">
                        <span className="text-slate-300">
                          মোট শনাক্ত: <strong className="text-white">{trainerResult.parsedItems.length}</strong> জন
                        </span>
                        <span className="text-emerald-400 font-bold">
                          ✓ সক্রিয়: <strong>{trainerResult.validCount}</strong> জন
                        </span>
                        {trainerResult.zeroCount > 0 && (
                          <span className="text-rose-300 bg-rose-950/70 px-2 py-0.5 rounded text-[11px] font-semibold border border-rose-500/40">
                            ✕ ০.০০ ব্যালেন্স বাদ: <strong>{trainerResult.zeroCount}</strong> জন
                          </span>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowTrainerPreview(!showTrainerPreview)}
                        className="cursor-pointer text-[11px] text-emerald-300 hover:text-emerald-100 underline font-bold"
                      >
                        {showTrainerPreview ? 'প্রিভিউ লুকান' : 'প্রিভিউ দেখুন'}
                      </button>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-300 pt-1 border-t border-emerald-800/40">
                      <span>
                        মোট কনভার্ট: <strong className="text-emerald-300 font-mono">{trainerResult.totalConvert}</strong>
                      </span>
                      <span>
                        মোট ব্যালেন্স: <strong className="text-cyan-300 font-mono">৳{trainerResult.totalBalance.toLocaleString()}</strong>
                      </span>
                    </div>

                    {showTrainerPreview && (
                      <div className="max-h-48 overflow-y-auto mt-2 border border-emerald-800 rounded bg-black/60 p-1">
                        <table className="w-full text-[11px] text-left">
                          <thead className="text-slate-400 border-b border-slate-700 font-bold">
                            <tr>
                              <th className="p-1">#</th>
                              <th className="p-1">নাম</th>
                              <th className="p-1 text-center">ব্যালেন্স</th>
                              <th className="p-1 text-center">কনভার্ট (÷৫০)</th>
                              <th className="p-1 text-right">স্ট্যাটাস</th>
                            </tr>
                          </thead>
                          <tbody>
                            {trainerResult.parsedItems.map((item, idx) => (
                              <tr
                                key={idx}
                                className={`border-b border-slate-800/60 ${
                                  item.isZero ? 'opacity-40 bg-rose-950/20' : 'hover:bg-emerald-900/30'
                                }`}
                              >
                                <td className="p-1 font-mono">{idx + 1}</td>
                                <td className="p-1 font-semibold text-slate-200">{item.name}</td>
                                <td className="p-1 text-center font-mono">৳{item.balance}</td>
                                <td className="p-1 text-center font-mono font-bold text-emerald-300">
                                  {item.convert}
                                </td>
                                <td className="p-1 text-right">
                                  {item.isZero ? (
                                    <span className="text-[10px] text-rose-400 font-bold">বাদ (০.০০)</span>
                                  ) : (
                                    <span className="text-[10px] text-emerald-400 font-bold">যোগ হবে</span>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Action buttons for Box 2 */}
              <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between gap-2 flex-wrap">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleApplyTrainer('replace')}
                    disabled={!trainerResult || trainerResult.validCount === 0}
                    className="cursor-pointer inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-extrabold text-xs shadow-md transition-colors"
                  >
                    <ArrowDownCircle className="w-4 h-4" />
                    <span>টিম ট্রেইনারে বসান (Replace)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleApplyTrainer('append')}
                    disabled={!trainerResult || trainerResult.validCount === 0}
                    className="cursor-pointer inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed text-emerald-200 border border-emerald-500/30 font-bold text-xs transition-colors"
                    title="বর্তমান তালিকার নিচে এই নামগুলো যোগ করুন"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>+ নিচে যোগ করুন</span>
                  </button>
                </div>
                {trainerRawText && (
                  <button
                    type="button"
                    onClick={() => {
                      setTrainerRawText('');
                      setTrainerResult(null);
                    }}
                    className="cursor-pointer text-slate-400 hover:text-rose-400 text-xs flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>মুছুন</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
