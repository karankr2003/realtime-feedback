import { NextRequest, NextResponse } from 'next/server';
import { query, ensureSchemaInitialized } from '@/lib/db/connection';
import { verifyAdminAuth } from '@/lib/auth/middleware';
import logger from '@/lib/logger/logger';
import { ApiResponse } from '@/types';
import { AnalyticsStatsResponse } from '@/lib/types/api';

export async function GET(req: NextRequest) {
  try {
    await ensureSchemaInitialized();

    // Verify admin authentication
    const authCheck = await verifyAdminAuth(req);
    if (!authCheck.valid) {
      return authCheck.response!;
    }

    // Total feedback
    const totalResult = await query('SELECT COUNT(*) as count FROM feedback');
    const totalFeedback = parseInt(totalResult.rows[0].count);

    // Pending feedback
    const pendingResult = await query(
      "SELECT COUNT(*) as count FROM feedback WHERE status = 'pending'"
    );
    const pendingFeedback = parseInt(pendingResult.rows[0].count);

    // In progress feedback
    const inProgressResult = await query(
      "SELECT COUNT(*) as count FROM feedback WHERE status = 'in_progress' OR status = 'in-progress'"
    );
    const inProgressFeedback = parseInt(inProgressResult.rows[0].count);

    // Resolved feedback
    const resolvedResult = await query(
      "SELECT COUNT(*) as count FROM feedback WHERE status = 'resolved'"
    );
    const resolvedFeedback = parseInt(resolvedResult.rows[0].count);

    // Average rating
    const ratingResult = await query(
      'SELECT AVG(rating) as avg FROM feedback WHERE rating IS NOT NULL'
    );
    const averageRating = ratingResult.rows[0].avg ? parseFloat(ratingResult.rows[0].avg).toFixed(2) : 0;

    // Feedback by category
    const categoryResult = await query(
      `SELECT c.name, COUNT(f.id) as count 
       FROM categories c 
       LEFT JOIN feedback f ON c.id = f.category_id 
       GROUP BY c.name 
       ORDER BY count DESC`
    );
    const feedbackByCategory = categoryResult.rows.map((row: any) => ({
      categoryName: row.name,
      count: parseInt(row.count),
    }));

    // Feedback by status
    const statusResult = await query(
      `SELECT status, COUNT(*) as count 
       FROM feedback 
       GROUP BY status 
       ORDER BY count DESC`
    );
    const feedbackByStatus = statusResult.rows.map((row: any) => ({
      status: row.status,
      count: parseInt(row.count),
    }));

    // Last 7 days trend
    const trendResult = await query(
      `SELECT DATE(created_at) as date, COUNT(*) as count 
       FROM feedback 
       WHERE created_at >= NOW() - INTERVAL '7 days'
       GROUP BY DATE(created_at) 
       ORDER BY date ASC`
    );
    const lastSevenDaysTrend = trendResult.rows.map((row: any) => ({
      date: row.date,
      count: parseInt(row.count),
    }));

    const stats: AnalyticsStatsResponse = {
      totalFeedback,
      pendingFeedback,
      inProgressFeedback,
      resolvedFeedback,
      averageRating: parseFloat(averageRating as string),
      feedbackByCategory,
      feedbackByStatus,
      lastSevenDaysTrend,
    };

    logger.debug('Analytics stats retrieved');

    return NextResponse.json<ApiResponse<AnalyticsStatsResponse>>(
      {
        success: true,
        data: stats,
      }
    );
  } catch (error) {
    logger.error('Analytics endpoint error', { error });
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
