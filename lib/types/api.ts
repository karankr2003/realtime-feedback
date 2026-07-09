import { User, Feedback, Category } from '@/types';

// Auth API Contracts
export interface LoginRequest {
  email: string;
  password?: string; // Optional for response typing purposes if passed around, but required for request
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface RegisterRequest {
  email: string;
  password?: string;
  fullName: string;
}

export interface RegisterResponse {
  token: string;
  user: User;
}

// Feedback API Contracts
export interface FeedbackSubmitRequest {
  categoryId: number;
  title: string;
  description: string;
  email: string;
  rating?: number;
}

export interface FeedbackSubmitResponse {
  feedbackId: number;
}

export interface FeedbackWithCategory extends Feedback {
  category: Category;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface FeedbackListResponse extends PaginatedResponse<FeedbackWithCategory> {}

export interface UpdateFeedbackStatusRequest {
  status: 'pending' | 'in-progress' | 'resolved' | 'rejected' | 'in_progress';
}

// Analytics API Contracts
export interface AnalyticsStatsResponse {
  totalFeedback: number;
  pendingFeedback: number;
  inProgressFeedback: number;
  resolvedFeedback: number;
  averageRating: number;
  feedbackByCategory: Array<{ categoryName: string; count: number }>;
  feedbackByStatus: Array<{ status: string; count: number }>;
  lastSevenDaysTrend: Array<{ date: string; count: number }>;
}
