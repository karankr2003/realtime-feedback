'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/useAuth';
import { FeedbackTable } from '@/components/dashboard/FeedbackTable';
import { AnalyticsDashboard } from '@/components/dashboard/AnalyticsDashboard';

const navItems = [
  { id: 'overview', label: 'Overview' },
  { id: 'feedback', label: 'Feedback List' },
];

export default function DashboardPage() {
  const { isAuthenticated, isAdmin, logout, user } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [refreshKey, setRefreshKey] = useState(0);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && (!isAuthenticated || !isAdmin)) {
      router.push('/auth/login');
    }
  }, [mounted, isAuthenticated, isAdmin, router]);

  if (!mounted) {
    return (
      <main className="min-h-screen bg-slate-950 text-slate-100">
        <div className="container mx-auto px-4 py-10">
          <div className="text-center py-20">
            <p className="text-slate-400">Loading dashboard...</p>
          </div>
        </div>
      </main>
    );
  }

  if (!isAuthenticated || !isAdmin) {
    return null;
  }

  const handleLogout = () => {
    setShowLogoutConfirm(true);
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-6 xl:grid-cols-[280px_1fr]">
          <aside className="rounded-[32px] border border-white/10 bg-slate-900/90 p-6 shadow-2xl shadow-black/40 backdrop-blur-xl">
            <div className="mb-8">
              <p className="text-sm uppercase tracking-[0.25em] text-indigo-300/70">Admin Console</p>
              <h1 className="mt-4 text-3xl font-semibold text-white">Acowale Insights</h1>
              <p className="mt-3 text-sm leading-6 text-slate-400">
                Real-time summary of customer feedback and operational status.
              </p>
            </div>

            <div className="space-y-3 rounded-3xl bg-slate-950/80 p-4 ring-1 ring-white/5">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-400">Account</span>
                <span className="text-xs uppercase tracking-[0.25em] text-indigo-300/80">Admin</span>
              </div>
              <p className="mt-3 font-semibold text-white">{user?.email}</p>
              <Button variant="secondary" size="sm" className="mt-4 w-full" onClick={handleLogout}>
                Logout
              </Button>
            </div>

            <nav className="mt-8 space-y-2">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full rounded-3xl px-4 py-3 text-left text-sm font-medium transition ${
                    activeTab === item.id
                      ? 'bg-indigo-500/15 text-white ring-1 ring-indigo-400/30'
                      : 'text-slate-300 hover:bg-white/5'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </nav>

            <div className="mt-10 rounded-3xl bg-slate-950/90 p-5 ring-1 ring-white/5">
              <p className="text-sm uppercase tracking-[0.25em] text-slate-500">Status</p>
              <div className="mt-3 space-y-3">
                <div className="flex items-center justify-between rounded-2xl bg-slate-900/70 px-4 py-3">
                  <span className="text-sm text-slate-300">Live feedback</span>
                  <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs text-emerald-200">
                    Active
                  </span>
                </div>
                <div className="flex items-center justify-between rounded-2xl bg-slate-900/70 px-4 py-3">
                  <span className="text-sm text-slate-300">Data refresh</span>
                  <span className="rounded-full bg-indigo-500/10 px-3 py-1 text-xs text-indigo-200">
                    Every 30s
                  </span>
                </div>
              </div>
            </div>
          </aside>

          <section className="space-y-6">
            {activeTab === 'overview' ? (
              <AnalyticsDashboard key={refreshKey} />
            ) : (
              <>
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-semibold text-white">Feedback Records</h2>
                    <p className="mt-1 text-sm text-slate-400">Search, filter, and manage recent submissions.</p>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => setRefreshKey((k) => k + 1)}>
                    Refresh
                  </Button>
                </div>
                <FeedbackTable key={refreshKey} />
              </>
            )}
          </section>
        </div>
      </div>
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md">
          <div className="w-full max-w-sm rounded-[32px] border border-white/10 bg-slate-900 p-8 shadow-2xl shadow-black/80 animate-in fade-in-0 zoom-in-95 duration-200">
            <h3 className="text-xl font-semibold text-white">Confirm Logout</h3>
            <p className="mt-3 text-sm text-slate-300 leading-relaxed">
              Are you sure you want to end your session?
            </p>
            <div className="mt-6 flex gap-3">
              <Button 
                variant="secondary" 
                className="flex-1 rounded-2xl" 
                onClick={() => setShowLogoutConfirm(false)}
              >
                Cancel
              </Button>
              <Button 
                className="flex-1 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white" 
                onClick={() => {
                  setShowLogoutConfirm(false);
                  logout();
                  router.push('/');
                }}
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
