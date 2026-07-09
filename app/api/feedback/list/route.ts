import { NextRequest, NextResponse } from 'next/server';
import { query, ensureSchemaInitialized } from '@/lib/db/connection';
import { verifyAdminAuth } from '@/lib/auth/middleware';
import logger from '@/lib/logger/logger';
import { ApiResponse } from '@/types';
import { FeedbackListResponse, FeedbackWithCategory } from '@/lib/types/api';

export async function GET(req: NextRequest) {
  try {
    await ensureSchemaInitialized();

    // Verify admin authentication
    const authCheck = await verifyAdminAuth(req);
    if (!authCheck.valid) {
      return authCheck.response!;
    }

    // Get query parameters
    const { searchParams } = new URL(req.url);
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const pageSize = Math.min(50, parseInt(searchParams.get('pageSize') || '10'));
    const status = searchParams.get('status');
    const categoryId = searchParams.get('categoryId');
    const search = searchParams.get('search');

    let countQuery = 'SELECT COUNT(*) FROM feedback WHERE 1=1';
    let dataQuery = `SELECT f.*, c.name as category_name, c.description as category_description 
                     FROM feedback f 
                     JOIN categories c ON f.category_id = c.id 
                     WHERE 1=1`;
    const params: (string | number)[] = [];
    let paramCount = 1;

    // Apply filters
    if (status) {
      countQuery += ` AND status = $${paramCount}`;
      dataQuery += ` AND f.status = $${paramCount}`;
      params.push(status);
      paramCount++;
    }

    if (categoryId) {
      countQuery += ` AND category_id = $${paramCount}`;
      dataQuery += ` AND f.category_id = $${paramCount}`;
      params.push(parseInt(categoryId));
      paramCount++;
    }

    if (search) {
      countQuery += ` AND (title ILIKE $${paramCount} OR description ILIKE $${paramCount} OR email ILIKE $${paramCount})`;
      dataQuery += ` AND (f.title ILIKE $${paramCount} OR f.description ILIKE $${paramCount} OR f.email ILIKE $${paramCount})`;
      params.push(`%${search}%`);
      paramCount++;
    }

    // Get total count
    const countResult = await query(countQuery, params.slice(0, paramCount - 1));
    const total = parseInt(countResult.rows[0].count);
    const totalPages = Math.ceil(total / pageSize);

    // Get paginated data
    const offset = (page - 1) * pageSize;
    dataQuery += ` ORDER BY f.created_at DESC LIMIT $${paramCount} OFFSET $${paramCount + 1}`;

    const result = await query<FeedbackWithCategory>(
      dataQuery,
      [...params.slice(0, paramCount - 1), pageSize, offset]
    );

    const feedbackList = result.rows.map((row: any) => ({
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
    }));

    logger.info('Feedback list retrieved', { page, pageSize, total });

    return NextResponse.json<ApiResponse<FeedbackListResponse>>(
      {
        success: true,
        data: {
          data: feedbackList,
          total,
          page,
          pageSize,
          totalPages,
        },
      }
    );
  } catch (error) {
    logger.error('Feedback list endpoint error', { error });
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
