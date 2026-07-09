import jwt from 'jsonwebtoken';
import { AuthPayload } from '@/types';
import logger from '../logger/logger';

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRATION = process.env.JWT_EXPIRATION || '7d';

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is not set');
}

export function generateToken(payload: AuthPayload): string {
  try {
    return jwt.sign(payload, JWT_SECRET as string, {
      expiresIn: JWT_EXPIRATION as any,
    });
  } catch (error) {
    logger.error('Failed to generate token', { error });
    throw error;
  }
}

export function verifyToken(token: string): AuthPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET as string) as unknown as AuthPayload;
    return decoded;
  } catch (error) {
    logger.debug('Token verification failed', { error });
    return null;
  }
}

export function extractTokenFromHeader(authHeader?: string): string | null {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.slice(7);
}
