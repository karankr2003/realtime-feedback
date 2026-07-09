import { NextRequest, NextResponse } from 'next/server';
import { query, ensureSchemaInitialized } from '@/lib/db/connection';
import logger from '@/lib/logger/logger';
import { ApiResponse, Category } from '@/types';

export async function GET(req: NextRequest) {
  try {
    await ensureSchemaInitialized();

    const result = await query<Category>(
      'SELECT id, name, description, created_at FROM categories ORDER BY name ASC'
    );

    logger.debug('Categories retrieved', { count: result.rows.length });

    return NextResponse.json<ApiResponse<Category[]>>(
      {
        success: true,
        data: result.rows,
      }
    );
  } catch (error) {
    logger.error('Categories endpoint error', { error });
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
