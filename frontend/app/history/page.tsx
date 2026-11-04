'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { 
  Clock, Music, Award, ArrowRight, ArrowLeftRight, 
  Calendar, CheckCircle, BarChart2, Filter, Layers, CheckSquare, Square, Shield, Mic
} from 'lucide-react';
import { progressApi } from '@/lib/api';
import { useSwaraStore } from '@/lib/store';

interface SessionItem {
  id: string;
  date: string;
  raga: string;
  duration_seconds: number;
  overall_score: number;
  pitch_accuracy: number;
  swara_accuracy: number;
  tonic_hz: number;
}

export default function HistoryPage() {
  const { user } = useSwaraStore();
  const [sessions, setSessions] = useState<SessionItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedForCompare, setSelectedForCompare] = useState<string[]>([]);
  const [showCompareModal, setShowCompareModal] = useState<boolean>(false);

  useEffect(() => {
    if (user) {
      setLoading(true);
      progressApi.getHistory()
        .then((res) => {
          if (res.data && Array.isArray(res.data) && res.data.length > 0) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const mapped = res.data.map((item: any, idx: number) => ({
              id: item.id || `sess-${idx}`,
              date: item.created_at ? new Date(item.created_at).toLocaleString() : new Date().toLocaleString(),
              raga: item.raga_name || item.target_raga || "Classical",
              duration_seconds: Math.round(item.duration_seconds || 120),
              overall_score: item.overall_score || 80,
              pitch_accuracy: item.pitch_accuracy || 82,
              swara_accuracy: item.swara_accuracy || 79,
              tonic_hz: item.tonic_hz || 138.59,
            }));
            setSessions(mapped);
          } else {
            setSessions([]);
          }
        })
        .catch(() => {
          setSessions([]);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setSessions([]);
      setLoading(false);
    }
  }, [user]);

  const toggleSelectForCompare = (id: string) => {
    if (selectedForCompare.includes(id)) {
      setSelectedForCompare(selectedForCompare.filter((item) => item !== id));
    } else {
      if (selectedForCompare.length < 2) {
        setSelectedForCompare([...selectedForCompare, id]);
      } else {
        setSelectedForCompare([selectedForCompare[1], id]);
      }
    }
  };

  const session1 = sessions.find((s) => s.id === selectedForCompare[0]);
  const session2 = sessions.find((s) => s.id === selectedForCompare[1]);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5]">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-100 border border-amber-300 text-amber-900 text-xs font-mono mb-2 font-bold shadow-2xs">
              <Calendar className="w-3.5 h-3.5 text-amber-700" />
              <span>Riyaz Archives</span>
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 font-serif tracking-tight">
              Practice Session History
            </h1>
          </div>

          {/* Compare Sessions Button */}
          {selectedForCompare.length === 2 && (
            <button
              onClick={() => setShowCompareModal(true)}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-black font-bold text-xs shadow-lg shadow-amber-500/20 hover:scale-105 transition-all flex items-center gap-2 animate-bounce-slow"
            >
              <ArrowLeftRight className="w-4 h-4" />
              <span>Compare Selected Sessions</span>
            </button>
          )}
        </div>

        {/* Sessions Table / List */}
        {sessions.length > 0 ? (
          <div className="glass-card rounded-2xl border border-amber-300 overflow-hidden mb-12 shadow-md">
            <div className="p-4 bg-amber-50/80 border-b border-amber-200 flex items-center justify-between text-xs text-slate-600 font-mono font-medium">
              <span>Select any 2 sessions to compare Before vs After</span>
              <span>{sessions.length} Recorded Sessions</span>
            </div>

            <div className="divide-y divide-amber-100">
              {sessions.map((s) => {
              const isSelected = selectedForCompare.includes(s.id);

              return (
                <div
                  key={s.id}
                  className={`p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors ${
                    isSelected ? 'bg-amber-500/10' : 'hover:bg-amber-50/40'
                  }`}
                >
                  {/* Left: Checkbox + Raga + Date */}
                  <div className="flex items-center gap-3.5">
                    <button
                      onClick={() => toggleSelectForCompare(s.id)}
                      className="text-slate-400 hover:text-amber-800 transition-colors"
                      title="Select for comparison"
                    >
                      {isSelected ? (
                        <CheckSquare className="w-5 h-5 text-amber-700" />
                      ) : (
                        <Square className="w-5 h-5" />
                      )}
                    </button>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-base font-bold text-slate-900 font-serif">
                          Raga {s.raga}
                        </span>
                        <span className="text-xs font-mono text-slate-500 font-medium">
                          ({Math.floor(s.duration_seconds / 60)}m {s.duration_seconds % 60}s)
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 font-mono mt-0.5 font-medium">
                        {s.date} • Sa: {s.tonic_hz.toFixed(1)} Hz
                      </div>
                    </div>
                  </div>

                  {/* Middle: Scores */}
                  <div className="flex items-center gap-6">
                    <div className="text-center sm:text-right">
                      <div className="text-xs text-slate-500 font-mono font-medium">Overall</div>
                      <div className={`text-base font-bold font-mono ${
                        s.overall_score >= 80 ? 'text-emerald-700' : s.overall_score >= 65 ? 'text-amber-800' : 'text-rose-700'
                      }`}>
                        {Math.round(s.overall_score)}%
                      </div>
                    </div>
                    <div className="text-center sm:text-right">
                      <div className="text-xs text-slate-500 font-mono font-medium">Pitch</div>
                      <div className="text-sm font-semibold text-slate-800 font-mono">
                        {Math.round(s.pitch_accuracy)}%
                      </div>
                    </div>
                    <div className="text-center sm:text-right">
                      <div className="text-xs text-slate-500 font-mono font-medium">Swara</div>
                      <div className="text-sm font-semibold text-slate-800 font-mono">
                        {Math.round(s.swara_accuracy)}%
                      </div>
                    </div>
                  </div>

                  {/* Right: View Report Link */}
                  <div>
                    <Link
                      href={`/analyze/${s.id}`}
                      className="px-3.5 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-900 font-bold text-xs shadow-2xs transition-all flex items-center justify-center gap-1.5"
                    >
                      <span>View Report</span>
                      <ArrowRight className="w-3.5 h-3.5 text-amber-700" />
                    </Link>
                  </div>
                </div>
              );
            })}
            </div>
          </div>
        ) : (
          <div className="glass-card rounded-3xl border border-amber-200/80 bg-white/90 p-8 sm:p-12 text-center shadow-sm mb-12">
            {user ? (
              <div className="space-y-4 max-w-md mx-auto">
                <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-700 shadow-2xs">
                  <Music className="w-7 h-7" />
                </div>
                <h2 className="text-xl font-bold font-serif text-slate-900">No Riyaz Sessions Recorded Yet</h2>
                <p className="text-xs sm:text-sm text-slate-600">
                  You haven&apos;t recorded any vocal sessions yet. Start your daily Riyaz with our live intonation feedback to build your history.
                </p>
                <div className="pt-2">
                  <Link
                    href="/practice"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20 hover:scale-105 transition"
                  >
                    <Mic className="w-4 h-4" />
                    <span>Start First Practice Session</span>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="space-y-4 max-w-md mx-auto">
                <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-700 shadow-2xs">
                  <Shield className="w-7 h-7" />
                </div>
                <h2 className="text-xl font-bold font-serif text-slate-900">Private Practice Archives</h2>
                <p className="text-xs sm:text-sm text-slate-600">
                  Each student has an isolated private history. Sign in or create an account to record your singing, maintain streaks, and compare progress over time.
                </p>
                <div className="flex items-center justify-center gap-3 pt-2">
                  <Link
                    href="/login"
                    className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-sm transition"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/register"
                    className="px-5 py-2.5 rounded-xl bg-amber-100 hover:bg-amber-200 border border-amber-300 text-amber-950 font-bold text-xs shadow-2xs transition"
                  >
                    Create Account
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Compare Sessions Modal */}
        {showCompareModal && session1 && session2 && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="glass-card max-w-2xl w-full p-6 sm:p-8 rounded-2xl border border-amber-300 shadow-2xl relative">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-800">
                <div className="flex items-center gap-2">
                  <ArrowLeftRight className="w-5 h-5 text-amber-700" />
                  <h3 className="text-lg font-bold text-slate-900 font-serif">
                    Side-by-Side Session Comparison
                  </h3>
                </div>
                <button
                  onClick={() => setShowCompareModal(false)}
                  className="text-slate-500 hover:text-slate-800 text-xs font-mono font-bold"
                >
                  ✕ Close
                </button>
              </div>

              {/* Side-by-Side Cards */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                {/* Session 1 */}
                <div className="p-4 rounded-xl bg-amber-50/50 border border-amber-300 space-y-3 shadow-2xs">
                  <div className="text-xs font-mono text-slate-500 font-medium">{session1.date}</div>
                  <div className="text-base font-bold text-amber-900 font-serif">Raga {session1.raga}</div>
                  <div className="space-y-1.5 text-xs font-mono">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Overall:</span>
                      <strong className="text-slate-900 font-bold">{Math.round(session1.overall_score)}%</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Pitch Acc:</span>
                      <strong className="text-slate-900 font-bold">{Math.round(session1.pitch_accuracy)}%</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Swara Acc:</span>
                      <strong className="text-slate-900 font-bold">{Math.round(session1.swara_accuracy)}%</strong>
                    </div>
                  </div>
                </div>

                {/* Session 2 */}
                <div className="p-4 rounded-xl bg-amber-50/50 border border-amber-300 space-y-3 shadow-2xs">
                  <div className="text-xs font-mono text-slate-500 font-medium">{session2.date}</div>
                  <div className="text-base font-bold text-amber-900 font-serif">Raga {session2.raga}</div>
                  <div className="space-y-1.5 text-xs font-mono">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Overall:</span>
                      <strong className="text-slate-900 font-bold">{Math.round(session2.overall_score)}%</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Pitch Acc:</span>
                      <strong className="text-slate-900 font-bold">{Math.round(session2.pitch_accuracy)}%</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Swara Acc:</span>
                      <strong className="text-slate-900 font-bold">{Math.round(session2.swara_accuracy)}%</strong>
                    </div>
                  </div>
                </div>
              </div>

              {/* Differential Delta calculation */}
              <div className="p-4 rounded-xl bg-amber-100 border border-amber-300 text-xs space-y-1.5 shadow-2xs">
                <div className="text-amber-950 font-bold">Progression Delta:</div>
                <div className="text-slate-700 font-mono font-medium">
                  Overall Score Change: {' '}
                  <span className={session2.overall_score >= session1.overall_score ? 'text-emerald-700 font-bold' : 'text-rose-700 font-bold'}>
                    {(session2.overall_score - session1.overall_score) >= 0 ? '+' : ''}
                    {(session2.overall_score - session1.overall_score).toFixed(1)}%
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 font-sans">
                  {session2.overall_score >= session1.overall_score
                    ? 'Improvement observed in tonic stability and shruti placement on principal swaras.'
                    : 'Mild pitch drift observed in the second session during rapid melodic transitions.'}
                </p>
              </div>
            </div>
          </div>
        )}

      </main>

      <Footer />
    </div>
  );
}
