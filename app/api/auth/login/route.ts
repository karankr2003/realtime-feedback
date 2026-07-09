import { NextRequest, NextResponse } from 'next/server';
import { query, ensureSchemaInitialized } from '@/lib/db/connection';
import { comparePassword } from '@/lib/auth/password';
import { generateToken } from '@/lib/auth/jwt';
import { loginSchema } from '@/lib/validation/schemas';
import logger from '@/lib/logger/logger';
import { ApiResponse, User } from '@/types';
import { LoginResponse } from '@/lib/types/api';
import { withValidation } from '@/lib/api/withValidation';

export const POST = withValidation(
  loginSchema,
  async (req, validatedBody) => {
    try {
      const { email, password } = validatedBody;

      await ensureSchemaInitialized();

    // Find user
    const result = await query<User & { password_hash: string }>(
      'SELECT id, email, password_hash, full_name, is_admin, created_at, updated_at FROM users WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      logger.warn('Login attempt with non-existent email', { email });
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    const user = result.rows[0];

    // Verify password
    const passwordMatch = await comparePassword(password, user.password_hash);
    if (!passwordMatch) {
      logger.warn('Login attempt with incorrect password', { email });
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Generate token
    const token = generateToken({
      userId: user.id,
      email: user.email,
      isAdmin: user.is_admin,
    });

    logger.info('User logged in successfully', { userId: user.id, email });

    return NextResponse.json<ApiResponse<LoginResponse>>(
      {
        success: true,
        data: {
          token,
          user: {
            id: user.id,
            email: user.email,
            full_name: user.full_name,
            is_admin: user.is_admin,
            created_at: user.created_at,
            updated_at: user.updated_at,
          },
        },
      }
    );
  } catch (error) {
    logger.error('Login endpoint error', { error });
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
);
