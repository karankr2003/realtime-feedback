import { NextRequest, NextResponse } from 'next/server';
import { query, ensureSchemaInitialized } from '@/lib/db/connection';
import { verifyAdminAuth } from '@/lib/auth/middleware';
import { updateFeedbackStatusSchema } from '@/lib/validation/schemas';
import logger from '@/lib/logger/logger';
import { ApiResponse, Feedback } from '@/types';
import { withValidation } from '@/lib/api/withValidation';

export const PATCH = withValidation(
  updateFeedbackStatusSchema,
  async (req, validatedBody, { params }: { params: Promise<{ id: string }> }) => {
    try {
      await ensureSchemaInitialized();

      // Verify admin authentication
      const authCheck = await verifyAdminAuth(req);
      if (!authCheck.valid) {
        return authCheck.response!;
      }

      const resolvedParams = await params;
      const feedbackId = parseInt(resolvedParams.id);
      if (isNaN(feedbackId)) {
        return NextResponse.json<ApiResponse<null>>(
          { success: false, error: 'Invalid feedback ID' },
          { status: 400 }
        );
      }

      const { status } = validatedBody;

    // Check if feedback exists
    const checkResult = await query('SELECT id FROM feedback WHERE id = $1', [feedbackId]);
    if (checkResult.rows.length === 0) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: 'Feedback not found' },
        { status: 404 }
      );
    }

    // Update feedback status
    const result = await query<Feedback>(
      `UPDATE feedback 
       SET status = $1, updated_at = CURRENT_TIMESTAMP 
       WHERE id = $2 
       RETURNING id, user_id, category_id, title, description, email, rating, status, created_at, updated_at`,
      [status, feedbackId]
    );

    const updatedFeedback = result.rows[0];

    logger.info('Feedback status updated', {
      feedbackId,
      newStatus: status,
    });

    return NextResponse.json<ApiResponse<Feedback>>(
      {
        success: true,
        data: updatedFeedback,
        message: 'Feedback status updated successfully',
      }
    );
  } catch (error) {
    logger.error('Feedback update endpoint error', { error });
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
);

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await ensureSchemaInitialized();

    // Verify admin authentication
    const authCheck = await verifyAdminAuth(req);
    if (!authCheck.valid) {
      return authCheck.response!;
    }

    const resolvedParams = await params;
    const feedbackId = parseInt(resolvedParams.id);
    if (isNaN(feedbackId)) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: 'Invalid feedback ID' },
        { status: 400 }
      );
    }

    const result = await query<any>(
      `SELECT f.*, c.name as category_name, c.description as category_description
       FROM feedback f
       JOIN categories c ON f.category_id = c.id
       WHERE f.id = $1`,
      [feedbackId]
    );

    if (result.rows.length === 0) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: 'Feedback not found' },
        { status: 404 }
      );
    }

    const row = result.rows[0];
    const feedback = {
      id: row.id,
      user_id: row.user_id,
      category_id: row.category_id,
      title: row.title,
      description: row.description,
      email: row.email,
      rating: row.rating,
      status: row.status,
      created_at: row.created_at,
      updated_at: row.updated_at,
      category: {
        id: row.category_id,
        name: row.category_name,
        description: row.category_description,
        created_at: row.created_at,
      },
    };

    return NextResponse.json<ApiResponse<any>>(
      {
        success: true,
        data: feedback,
      }
    );
  } catch (error) {
    logger.error('Feedback get endpoint error', { error });
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
