// Authentication types
export interface User {
  id: string;
  email: string;
  full_name: string;
  is_admin: boolean;
  created_at: string;
  updated_at: string;
}

export interface JWTPayload {
  userId: string;
  email: string;
  isAdmin: boolean;
  iat: number;
  exp: number;
}

// Used for token generation/verification
export interface AuthPayload {
  userId: string;
  email: string;
  isAdmin: boolean;
}

// Feedback types
export interface Feedback {
  id: string;
  user_id?: string | null;
  category_id: string;
  title: string;
  description: string;
  email: string;
  rating: number | null;
  status: 'pending' | 'in_progress' | 'resolved' | 'rejected' | 'in-progress';
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  created_at: string;
}

// API Response wrapper
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
