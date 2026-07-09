import { ApiResponse, Category, Feedback } from '@/types';
import { 
  LoginRequest, LoginResponse, 
  RegisterRequest, RegisterResponse,
  FeedbackSubmitRequest, FeedbackSubmitResponse,
  FeedbackListResponse,
  AnalyticsStatsResponse 
} from '@/lib/types/api';
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

interface RequestOptions extends RequestInit {
  token?: string;
}

async function request<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<ApiResponse<T>> {
  const url = `${BASE_URL}${endpoint}`;
  const headers = new Headers(options.headers);

  if (!headers.has('Content-Type') && options.body) {
    headers.set('Content-Type', 'application/json');
  }

  if (options.token) {
    headers.set('Authorization', `Bearer ${options.token}`);
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.error || `HTTP ${response.status}`,
      };
    }

    return data;
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

export const apiClient = {
  // Auth endpoints
  register: (email: string, password: string, fullName: string, token?: string) =>
    request<RegisterResponse>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, fullName } as RegisterRequest),
      token,
    }),

  login: (email: string, password: string) =>
    request<LoginResponse>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password } as LoginRequest),
    }),

  // Feedback endpoints
  submitFeedback: (
    categoryId: number,
    title: string,
    description: string,
    email: string,
    rating?: number,
    token?: string
  ) =>
    request<FeedbackSubmitResponse>('/api/feedback/submit', {
      method: 'POST',
      body: JSON.stringify({ categoryId, title, description, email, rating } as FeedbackSubmitRequest),
      token,
    }),

  listFeedback: (
    page: number = 1,
    pageSize: number = 10,
    status?: string,
    categoryId?: number,
    search?: string,
    token?: string
  ) => {
    const params = new URLSearchParams({
      page: page.toString(),
      pageSize: pageSize.toString(),
      ...(status && { status }),
      ...(categoryId && { categoryId: categoryId.toString() }),
      ...(search && { search }),
    });
    return request<FeedbackListResponse>(`/api/feedback/list?${params}`, { token });
  },

  getFeedback: (id: string | number, token?: string) =>
    request<Feedback>(`/api/feedback/${id}`, { token }),

  updateFeedbackStatus: (id: string | number, status: string, token?: string) =>
    request<Feedback>(`/api/feedback/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
      token,
    }),

  getCategories: () =>
    request<Category[]>('/api/feedback/categories', { method: 'GET' }),

  // Analytics endpoints
  getAnalytics: (token?: string) =>
    request<AnalyticsStatsResponse>('/api/analytics/stats', { token }),

  // Health check
  healthCheck: () =>
    request('/api/health', { method: 'GET' }),
};
