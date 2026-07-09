import { NextRequest, NextResponse } from 'next/server';
import { query, ensureSchemaInitialized } from '@/lib/db/connection';
import { hashPassword } from '@/lib/auth/password';
import { generateToken } from '@/lib/auth/jwt';
import { registerSchema } from '@/lib/validation/schemas';
import logger from '@/lib/logger/logger';
import { ApiResponse, User } from '@/types';
import { RegisterResponse } from '@/lib/types/api';
import { withValidation } from '@/lib/api/withValidation';

export const POST = withValidation(
  registerSchema,
  async (req, validatedBody) => {
    try {
      const { email, password, fullName } = validatedBody;

      await ensureSchemaInitialized();

    // Check if user already exists
    const existingUser = await query('SELECT id FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: 'User with this email already exists' },
        { status: 409 }
      );
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    // Create user
    const result = await query<User>(
      `INSERT INTO users (email, password_hash, full_name, is_admin)
       VALUES ($1, $2, $3, false)
       RETURNING id, email, full_name, is_admin, created_at, updated_at`,
      [email, passwordHash, fullName]
    );

    const user = result.rows[0];
    const token = generateToken({
      userId: user.id,
      email: user.email,
      isAdmin: user.is_admin,
    });

    logger.info('User registered successfully', { userId: user.id, email });

    return NextResponse.json<ApiResponse<RegisterResponse>>(
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
      },
      { status: 201 }
    );
  } catch (error) {
    logger.error('Register endpoint error', { error });
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
);
