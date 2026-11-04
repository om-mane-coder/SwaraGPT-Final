'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { 
  Sparkles, Mic, Activity, Clock, Award, Shield, Music, ArrowRight 
} from 'lucide-react';
import { useSwaraStore } from '@/lib/store';
import { progressApi } from '@/lib/api';

export default function DashboardPage() {
  const { user } = useSwaraStore();

  const [summary, setSummary] = useState<any>(null);
  const [recentSessions, setRecentSessions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (user) {
      setIsLoading(true);
      Promise.all([
        progressApi.getSummary(),
        progressApi.getHistory()
      ])
        .then(([summaryRes, historyRes]) => {
          if (summaryRes?.data) setSummary(summaryRes.data);
          if (historyRes?.data && Array.isArray(historyRes.data)) {
            setRecentSessions(historyRes.data.slice(0, 5));
          }
        })
        .catch((err) => {
          console.warn("Failed to fetch dashboard progress:", err);
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setSummary(null);
      setRecentSessions([]);
      setIsLoading(false);
    }
  }, [user]);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5]">
      <Navbar />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        
        {/* Clean Page Title Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-serif tracking-tight">
              {user ? `Namaste, ${user.name}` : "Sadhana Progress"}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              {user ? (
                <>
                  Streak: <strong className="text-amber-800 font-semibold">{summary?.current_streak_days ?? user?.profile?.current_streak_days ?? 0} days unbroken</strong> • Target: <strong className="text-slate-800">{summary?.target_raga || user?.profile?.target_ragas?.[0] || 'Raga Yaman'}</strong>
                </>
              ) : (
                "Vocal intonation statistics, practice streaks, and longitudinal session history."
              )}
            </p>
          </div>

          <Link
            href="/practice"
            className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-sm transition flex items-center gap-2 w-fit shrink-0"
          >
            <Mic className="w-4 h-4" />
            <span>Start Riyaz Practice</span>
          </Link>
        </div>

        {/* Top Stat Cards: Simple, Focused, Uncluttered */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white/90 p-5 rounded-2xl border border-amber-200/80 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-mono text-slate-500 font-semibold">Today&apos;s Riyaz</span>
              <Clock className="w-4 h-4 text-amber-600" />
            </div>
            <div className="text-2xl font-bold font-mono text-slate-900">
              {user ? `${summary?.today_minutes ?? summary?.total_practice_minutes ?? 0} mins` : '0 mins'}
            </div>
            <div className="text-[10px] text-emerald-700 font-medium mt-1">
              {user ? `Goal: ${user?.profile?.daily_goal_minutes || 30} mins` : 'Sign in to track'}
            </div>
          </div>

          <div className="bg-white/90 p-5 rounded-2xl border border-amber-200/80 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-mono text-slate-500 font-semibold">Current Streak</span>
              <Award className="w-4 h-4 text-rose-600" />
            </div>
            <div className="text-2xl font-bold font-mono text-rose-600">
              {user ? `${summary?.current_streak_days ?? user?.profile?.current_streak_days ?? 0} Days` : '0 Days'}
            </div>
            <div className="text-[10px] text-slate-500 mt-1">
              {user ? (summary?.current_streak_days ? 'Active sadhana streak' : 'Start your streak today') : 'Sign in to track'}
            </div>
          </div>

          <div className="bg-white/90 p-5 rounded-2xl border border-amber-200/80 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-mono text-slate-500 font-semibold">Avg Pitch Accuracy</span>
              <Activity className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-bold font-mono text-emerald-700">
              {user && summary?.average_pitch_accuracy ? `${summary.average_pitch_accuracy.toFixed(1)}%` : '--%'}
            </div>
            <div className="text-[10px] text-emerald-700 font-medium mt-1">
              {user && summary?.overall_improvement_pct ? `+${summary.overall_improvement_pct}% overall` : user ? 'Longitudinal score' : 'Sign in to track'}
            </div>
          </div>

          <div className="bg-white/90 p-5 rounded-2xl border border-amber-200/80 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-mono text-slate-500 font-semibold">Latest Performance</span>
              <Sparkles className="w-4 h-4 text-amber-600" />
            </div>
            <div className="text-2xl font-bold font-mono text-amber-800">
              {user && recentSessions.length > 0 ? `${Math.round(recentSessions[0].overall_score || recentSessions[0].pitch_accuracy || 0)}%` : '--'}
            </div>
            <div className="text-[10px] text-slate-500 mt-1">
              {user && recentSessions.length > 0 ? `Raga ${recentSessions[0].target_raga || recentSessions[0].raga_name || 'Classical'}` : user ? 'No sessions yet' : 'Guest mode'}
            </div>
          </div>
        </div>

        {/* Past Practice History */}
        <div className="bg-white/90 rounded-2xl border border-amber-200/80 shadow-xs overflow-hidden">
          <div className="p-4 sm:p-5 bg-amber-50/70 border-b border-amber-200/80 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <Music className="w-4 h-4 text-amber-700" />
              <span className="font-bold text-slate-900 text-sm">Past Practice History</span>
            </div>
            {user && recentSessions.length > 0 && (
              <Link href="/history" className="text-amber-800 hover:underline font-mono font-semibold flex items-center gap-1">
                <span>View All History</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            )}
          </div>

          {user ? (
            recentSessions.length > 0 ? (
              <div className="divide-y divide-amber-100">
                {recentSessions.map((s, idx) => (
                  <div key={s.id || idx} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs hover:bg-amber-50/40 transition-colors">
                    <div>
                      <div className="font-bold text-slate-900 font-serif text-sm">Raga {s.target_raga || s.raga_name || 'Classical'}</div>
                      <div className="text-slate-500 font-mono text-[11px] mt-0.5">
                        {s.created_at ? new Date(s.created_at).toLocaleString() : 'Recent session'} • {Math.round(s.duration_seconds || 0)}s
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="font-mono text-right">
                        <span className="text-slate-500 text-[11px]">Score: </span>
                        <strong className="text-emerald-700 text-sm font-bold">{Math.round(s.overall_score || s.pitch_accuracy || 0)}%</strong>
                      </div>
                      <Link
                        href={`/analyze/${s.id}`}
                        className="px-3.5 py-1.5 rounded-lg bg-white border border-amber-300 text-amber-900 font-medium text-xs hover:bg-amber-50 transition shadow-2xs"
                      >
                        View Report
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 sm:p-12 text-center space-y-3">
                <div className="w-12 h-12 mx-auto rounded-full bg-amber-100 border border-amber-200 flex items-center justify-center text-amber-700 shadow-2xs">
                  <Music className="w-6 h-6" />
                </div>
                <h3 className="font-serif text-slate-800 font-bold text-base">No Riyaz Sessions Recorded Yet</h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                  Start your first vocal practice session in the Vocal Practice studio or record in the Analyzer to build your practice history.
                </p>
                <div className="pt-2">
                  <Link
                    href="/practice"
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-600 text-white font-bold text-xs shadow-sm hover:bg-amber-700 transition"
                  >
                    <Mic className="w-4 h-4" />
                    <span>Start Practice</span>
                  </Link>
                </div>
              </div>
            )
          ) : (
            <div className="p-8 sm:p-12 text-center space-y-3">
              <div className="w-12 h-12 mx-auto rounded-full bg-amber-100 border border-amber-200 flex items-center justify-center text-amber-700 shadow-2xs">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-slate-800 font-bold text-base">Personalized Practice History</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                Every student has their own private Riyaz history, pitch accuracy trajectories, and 22-shruti intonation tracking. Sign in or create an account to view and save your sessions.
              </p>
              <div className="flex items-center justify-center gap-3 pt-2">
                <Link
                  href="/login"
                  className="px-5 py-2.5 rounded-xl bg-amber-600 text-white font-bold text-xs shadow-sm hover:bg-amber-700 transition"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="px-5 py-2.5 rounded-xl bg-amber-100 text-amber-950 border border-amber-300 font-bold text-xs hover:bg-amber-200 transition"
                >
                  Create Account
                </Link>
              </div>
            </div>
          )}
        </div>

      </main>

      <Footer />
    </div>
  );
}
