'use client';

import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api/client';
import { useAuth } from '@/useAuth';

interface AnalyticsStats {
  totalFeedback: number;
  pendingFeedback: number;
  inProgressFeedback: number;
  resolvedFeedback: number;
  averageRating: number;
  feedbackByCategory: Array<{ categoryName: string; count: number }>;
  feedbackByStatus: Array<{ status: string; count: number }>;
  lastSevenDaysTrend: Array<{ date: string; count: number }>;
}

export function AnalyticsDashboard() {
  const [stats, setStats] = useState<AnalyticsStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { token } = useAuth();

  useEffect(() => {
    loadAnalytics();
  }, [token]);

  const loadAnalytics = async () => {
    if (!token) return;

    setIsLoading(true);
    setError(null);

    const response = await apiClient.getAnalytics(token);

    if (!response.success) {
      setError(response.error || 'Failed to load analytics');
      setIsLoading(false);
      return;
    }

    setStats(response.data as AnalyticsStats);
    setIsLoading(false);
  };

  if (isLoading) {
    return <div className="rounded-[32px] border border-white/10 bg-slate-900/90 p-8 text-center text-slate-400">Loading analytics...</div>;
  }

  if (error) {
    return (
      <div className="rounded-[32px] border border-red-500/20 bg-red-950/60 p-6 text-red-200">
        <p>{error}</p>
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-[28px] border border-white/10 bg-slate-900/90 p-6 shadow-lg shadow-black/20">
          <p className="text-sm uppercase tracking-[0.25em] text-slate-400">Total feedback</p>
          <p className="mt-4 text-3xl font-semibold text-white">{stats.totalFeedback}</p>
        </div>
        <div className="rounded-[28px] border border-white/10 bg-slate-900/90 p-6 shadow-lg shadow-black/20">
          <p className="text-sm uppercase tracking-[0.25em] text-slate-400">Resolved</p>
          <p className="mt-4 text-3xl font-semibold text-white">{stats.resolvedFeedback}</p>
        </div>
        <div className="rounded-[28px] border border-white/10 bg-slate-900/90 p-6 shadow-lg shadow-black/20">
          <p className="text-sm uppercase tracking-[0.25em] text-slate-400">In progress</p>
          <p className="mt-4 text-3xl font-semibold text-white">{stats.inProgressFeedback}</p>
        </div>
        <div className="rounded-[28px] border border-white/10 bg-slate-900/90 p-6 shadow-lg shadow-black/20">
          <p className="text-sm uppercase tracking-[0.25em] text-slate-400">Avg rating</p>
          <p className="mt-4 text-3xl font-semibold text-white">{stats.averageRating.toFixed(1)}</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_0.8fr]">
        <div className="space-y-6">
          <div className="rounded-[28px] border border-white/10 bg-slate-900/90 p-6 shadow-lg shadow-black/20">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold text-white">Category distribution</h2>
                <p className="mt-1 text-sm text-slate-400">Feedback count per category.</p>
              </div>
            </div>
            <div className="mt-6 space-y-4">
              {stats.feedbackByCategory.map((item) => (
                <div key={item.categoryName} className="grid grid-cols-[1.2fr_1fr_3fr] items-center gap-4">
                  <div className="text-sm text-slate-200">{item.categoryName}</div>
                  <div className="text-sm font-semibold text-white">{item.count}</div>
                  <div className="flex items-center">
                    <progress
                      className="w-full h-2 rounded-full bg-slate-800 accent-indigo-500"
                      value={item.count}
                      max={Math.max(...stats.feedbackByCategory.map((c) => c.count), 1)}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-slate-900/90 p-6 shadow-lg shadow-black/20">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold text-white">Feedback trend</h2>
                <p className="mt-1 text-sm text-slate-400">The last 7 days of submissions.</p>
              </div>
            </div>
            <div className="mt-6 space-y-3">
              {stats.lastSevenDaysTrend.map((item) => (
                <div key={item.date} className="grid grid-cols-[1.1fr_0.9fr_2.5fr] items-center gap-4">
                  <span className="text-sm text-slate-300">{new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                  <span className="text-sm font-semibold text-white">{item.count}</span>
                  <div className="flex items-center">
                    <progress
                      className="w-full h-2 rounded-full bg-slate-800 accent-emerald-400"
                      value={item.count}
                      max={Math.max(...stats.lastSevenDaysTrend.map((t) => t.count), 1)}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-[28px] border border-white/10 bg-slate-900/90 p-6 shadow-lg shadow-black/20">
            <h2 className="text-xl font-semibold text-white">Status overview</h2>
            <div className="mt-6 space-y-4">
              {stats.feedbackByStatus.map((item) => (
                <div key={item.status} className="rounded-3xl bg-slate-950/80 p-4">
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-sm capitalize text-slate-300">{item.status}</span>
                    <span className="text-sm font-semibold text-white">{item.count}</span>
                  </div>
                  <div className="flex items-center mt-3">
                    <progress
                      className="w-full h-2 rounded-full bg-slate-800 accent-cyan-500"
                      value={item.count}
                      max={Math.max(...stats.feedbackByStatus.map((s) => s.count), 1)}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-slate-900/90 p-6 shadow-lg shadow-black/20">
            <h2 className="text-xl font-semibold text-white">Operational notes</h2>
            <ul className="mt-4 space-y-3 text-sm text-slate-300">
              <li className="rounded-3xl bg-slate-950/80 p-4">Keep feedback categories updated as priorities shift.</li>
              <li className="rounded-3xl bg-slate-950/80 p-4">Monitor open items labeled “pending” daily.</li>
              <li className="rounded-3xl bg-slate-950/80 p-4">Identify feature demand trends from user suggestions.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
