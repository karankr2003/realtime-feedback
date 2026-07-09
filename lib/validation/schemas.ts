import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  fullName: z.string().min(1, 'Full name is required'),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const feedbackSchema = z.object({
  categoryId: z.number().int().positive('Category ID must be a positive integer'),
  title: z.string().min(5, 'Title must be at least 5 characters').max(255, 'Title must not exceed 255 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters').max(5000, 'Description must not exceed 5000 characters'),
  email: z.string().email('Invalid email address'),
  rating: z.number().int().min(1, 'Rating must be between 1 and 5').max(5, 'Rating must be between 1 and 5').optional(),
});

export const updateFeedbackStatusSchema = z.object({
  status: z.enum(['pending', 'in-progress', 'resolved', 'rejected', 'in_progress']),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type FeedbackInput = z.infer<typeof feedbackSchema>;
export type UpdateFeedbackStatusInput = z.infer<typeof updateFeedbackStatusSchema>;
