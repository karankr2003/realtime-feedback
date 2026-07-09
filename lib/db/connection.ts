import { Pool, QueryResult, QueryResultRow } from 'pg';
import logger from '../logger/logger';

let pool: Pool | null = null;
let schemaInitialized = false;

export function getPool(): Pool {
  if (!pool) {
    const connectionString = process.env.DATABASE_URL;

    if (!connectionString) {
      throw new Error('DATABASE_URL environment variable is not set');
    }

    pool = new Pool({
      connectionString,
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    });

    pool.on('error', (err) => {
      logger.error('Unexpected error on idle client', { error: err });
    });
  }

  return pool;
}

export async function query<T extends QueryResultRow = any>(
  text: string,
  params?: (string | number | boolean | null)[]
): Promise<QueryResult<T>> {
  const client = await getPool().connect();
  try {
    return await client.query<T>(text, params);
  } finally {
    client.release();
  }
}

export async function closePool(): Promise<void> {
  if (pool) {
    await pool.end();
    pool = null;
    logger.info('Database pool closed');
  }
}

export async function ensureSchemaInitialized(): Promise<void> {
  if (schemaInitialized) {
    return;
  }

  const { initializeSchema } = await import('./schema');
  await initializeSchema();
  schemaInitialized = true;
}

export async function healthCheck(): Promise<boolean> {
  try {
    await query('SELECT NOW()');
    return true;
  } catch (error) {
    logger.error('Health check failed', { error });
    return false;
  }
}
