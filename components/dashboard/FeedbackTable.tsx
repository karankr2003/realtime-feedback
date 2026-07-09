'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { apiClient } from '@/lib/api/client';
import { useAuth } from '@/useAuth';

interface Feedback {
  id: string;
  email: string;
  title: string;
  description: string;
  category_id: string;
  rating: number | null;
  status: 'pending' | 'in_progress' | 'resolved' | 'rejected';
  created_at: string;
  updated_at: string;
}

interface FeedbackWithCategory extends Feedback {
  category: {
    id: string;
    name: string;
    description: string;
    created_at: string;
  };
}

interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

interface FeedbackTableProps {
  onRefresh?: () => void;
}

export function FeedbackTable({ onRefresh }: FeedbackTableProps) {
  const [feedbackList, setFeedbackList] = useState<FeedbackWithCategory[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  type StatusFilter = '' | 'pending' | 'in_progress' | 'resolved' | 'rejected';

  const [filters, setFilters] = useState({
    status: '' as StatusFilter,
    search: '',
  });
  const { token } = useAuth();

  useEffect(() => {
    loadFeedback();
  }, [page, pageSize, filters, token]);

  const loadFeedback = async () => {
    if (!token) return;

    setIsLoading(true);
    setError(null);

    const response = await apiClient.listFeedback(
      page,
      pageSize,
      filters.status || undefined,
      undefined,
      filters.search || undefined,
      token
    );

    if (!response.success) {
      setError(response.error || 'Failed to load feedback');
      setIsLoading(false);
      return;
    }

    const data = response.data as PaginatedResponse<FeedbackWithCategory>;
    setFeedbackList(data.data);
    setTotal(data.total);
    setTotalPages(data.totalPages);
    setIsLoading(false);
  };

  const handleStatusChange = async (feedbackId: string, newStatus: Feedback['status']) => {
    if (!token) return;

    setError(null);
    setSuccessMessage(null);
    const response = await apiClient.updateFeedbackStatus(feedbackId, newStatus, token);

    if (!response.success) {
      setError(response.error || 'Failed to update status');
      return;
    }

    setSuccessMessage('Feedback status updated successfully!');
    setTimeout(() => setSuccessMessage(null), 3000);

    setFeedbackList((prev) =>
      prev.map((f) => (f.id === feedbackId ? { ...f, status: newStatus } : f))
    );
  };

  const handleFilterChange = (field: 'status' | 'search', value: string | null) => {
    setFilters((prev) => ({ ...prev, [field]: value ?? '' }));
    setPage(1);
  };

  const handleSearch = (value: string) => {
    handleFilterChange('search', value);
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-col gap-4 rounded-[28px] border border-white/10 bg-slate-900/90 p-4 shadow-lg shadow-black/20 md:flex-row md:items-center">
        <Input
          placeholder="Search feedback..."
          value={filters.search}
          onChange={(e) => handleSearch(e.target.value)}
          className="flex-1"
          disabled={isLoading}
        />
        <Select
          value={filters.status}
          onValueChange={(value) => handleFilterChange('status', value)}
          disabled={isLoading}
        >
          <SelectTrigger className="md:w-56">
            <SelectValue placeholder="All statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Statuses</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="in_progress">In Progress</SelectItem>
            <SelectItem value="resolved">Resolved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Error Message */}
      {error && (
        <div className="rounded-[24px] bg-red-950/80 border border-red-500/20 p-4 text-sm text-red-200">
          {error}
        </div>
      )}

      {/* Success Message */}
      {successMessage && (
        <div className="rounded-[24px] bg-emerald-950/80 border border-emerald-500/20 p-4 text-sm text-emerald-200">
          {successMessage}
        </div>
      )}

      {/* Table */}
      <div className="overflow-hidden rounded-[32px] border border-white/10 bg-slate-900/90 shadow-lg shadow-black/20">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px]">
            <thead className="bg-slate-950/90 text-left text-sm uppercase tracking-[0.18em] text-slate-400">
              <tr>
                <th className="px-4 py-4">Email</th>
                <th className="px-4 py-4">Title</th>
                <th className="px-4 py-4">Category</th>
                <th className="px-4 py-4">Status</th>
                <th className="px-4 py-4">Rating</th>
                <th className="px-4 py-4">Date</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-slate-400">
                    Loading...
                  </td>
                </tr>
              ) : feedbackList.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-slate-400">
                    No feedback found
                  </td>
                </tr>
              ) : (
                feedbackList.map((feedback) => (
                  <tr key={feedback.id} className="border-t border-white/5 transition hover:bg-slate-950/80">
                    <td className="px-4 py-4 text-sm text-slate-200">{feedback.email}</td>
                    <td className="px-4 py-4 text-sm font-medium text-white">{feedback.title}</td>
                    <td className="px-4 py-4 text-sm text-slate-300">{feedback.category.name}</td>
                    <td className="px-4 py-4 text-sm">
                      <div className="flex items-center gap-2">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] ${
                            feedback.status === 'resolved'
                              ? 'bg-emerald-500/15 text-emerald-200'
                              : feedback.status === 'in_progress'
                              ? 'bg-amber-500/15 text-amber-200'
                              : feedback.status === 'rejected'
                              ? 'bg-rose-500/15 text-rose-200'
                              : 'bg-slate-500/15 text-slate-200'
                          }`}
                        >
                          {feedback.status.replace('_', ' ')}
                        </span>
                        <Select
                          value={feedback.status}
                          onValueChange={(value) => handleStatusChange(feedback.id, value as Feedback['status'])}
                          disabled={isLoading}
                        >
                          <SelectTrigger className="w-32 h-9 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="in_progress">In Progress</SelectItem>
                            <SelectItem value="resolved">Resolved</SelectItem>
                            <SelectItem value="rejected">Rejected</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm text-slate-200">
                      {feedback.rating ? `${feedback.rating}/5` : '—'}
                    </td>
                    <td className="px-4 py-4 text-sm text-slate-400">
                      {new Date(feedback.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex flex-col gap-3 rounded-[28px] border border-white/10 bg-slate-900/90 p-4 shadow-lg shadow-black/20 md:flex-row md:items-center md:justify-between">
        <div className="text-sm text-slate-400">
          Showing {feedbackList.length === 0 ? 0 : (page - 1) * pageSize + 1} to {Math.min(page * pageSize, total)} of {total} results
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1 || isLoading}
          >
            Previous
          </Button>
          <span className="flex items-center px-3 text-sm font-medium text-slate-200">
            {page} / {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages || isLoading}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
