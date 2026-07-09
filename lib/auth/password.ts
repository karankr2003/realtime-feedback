import bcryptjs from 'bcryptjs';
import logger from '../logger/logger';

const SALT_ROUNDS = 10;

export async function hashPassword(password: string): Promise<string> {
  try {
    return await bcryptjs.hash(password, SALT_ROUNDS);
  } catch (error) {
    logger.error('Failed to hash password', { error });
    throw error;
  }
}

export async function comparePassword(
  password: string,
  passwordHash: string
): Promise<boolean> {
  try {
    return await bcryptjs.compare(password, passwordHash);
  } catch (error) {
    logger.error('Failed to compare password', { error });
    throw error;
  }
}
