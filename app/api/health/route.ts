import { NextResponse } from 'next/server';
import { healthCheck } from '@/lib/db/connection';
import logger from '@/lib/logger/logger';

export async function GET() {
  try {
    const dbHealthy = await healthCheck();

    if (!dbHealthy) {
      logger.warn('Health check: Database unhealthy');
      return NextResponse.json(
        { status: 'unhealthy', database: 'unhealthy' },
        { status: 503 }
      );
    }

    return NextResponse.json({
      status: 'healthy',
      database: 'healthy',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    logger.error('Health check error', { error });
    return NextResponse.json(
      { status: 'unhealthy', error: 'Internal error' },
      { status: 503 }
    );
  }
}
