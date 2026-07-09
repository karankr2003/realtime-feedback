import { NextRequest, NextResponse } from 'next/server';
import { query, ensureSchemaInitialized } from '@/lib/db/connection';
import { feedbackSchema } from '@/lib/validation/schemas';
import { extractTokenFromHeader, verifyToken } from '@/lib/auth/jwt';
import logger from '@/lib/logger/logger';
import { ApiResponse, Feedback } from '@/types';
import { FeedbackSubmitResponse } from '@/lib/types/api';
import { withValidation } from '@/lib/api/withValidation';

export const POST = withValidation(
  feedbackSchema,
  async (req, validatedBody) => {
    try {
      const { categoryId, title, description, email, rating } = validatedBody;

      await ensureSchemaInitialized();

    // Verify category exists
    const categoryResult = await query('SELECT id FROM categories WHERE id = $1', [categoryId]);
    if (categoryResult.rows.length === 0) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: 'Invalid category' },
        { status: 400 }
      );
    }

    // Get user ID if authenticated
    let userId: string | null = null;
    const authHeader = req.headers.get('authorization');
    if (authHeader) {
      const token = extractTokenFromHeader(authHeader);
      if (token) {
        const payload = verifyToken(token);
        if (payload) {
          userId = payload.userId;
        }
      }
    }

    // Insert feedback
    const result = await query<Feedback>(
      `INSERT INTO feedback (user_id, category_id, title, description, email, rating, status)
       VALUES ($1, $2, $3, $4, $5, $6, 'pending')
       RETURNING id, user_id, category_id, title, description, email, rating, status, created_at, updated_at`,
      [userId, categoryId, title, description, email, rating || null]
    );

    const feedback = result.rows[0];

    logger.info('Feedback submitted', {
      feedbackId: feedback.id,
      categoryId,
      userId,
      email,
    });

    return NextResponse.json<ApiResponse<FeedbackSubmitResponse>>(
      {
        success: true,
        data: { feedbackId: Number(feedback.id) },
        message: 'Feedback submitted successfully',
      },
      { status: 201 }
    );
  } catch (error) {
    logger.error('Feedback submit endpoint error', { error });
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
);
