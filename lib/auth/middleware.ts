import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from './jwt';
import { ApiResponse } from '@/types';

interface AuthCheckResult {
  valid: boolean;
  response?: NextResponse;
  userId?: string;
  isAdmin?: boolean;
}

export async function verifyAdminAuth(req: NextRequest): Promise<AuthCheckResult> {
  try {
    const authHeader = req.headers.get('authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return {
        valid: false,
        response: NextResponse.json<ApiResponse<null>>(
          { success: false, error: 'Unauthorized: Missing or invalid token' },
          { status: 401 }
        ),
      };
    }

    const token = authHeader.slice(7); // Remove 'Bearer ' prefix

    const payload = verifyToken(token);

    if (!payload || !payload.isAdmin) {
      return {
        valid: false,
        response: NextResponse.json<ApiResponse<null>>(
          { success: false, error: 'Forbidden: Admin access required' },
          { status: 403 }
        ),
      };
    }

    return {
      valid: true,
      userId: payload.userId,
      isAdmin: payload.isAdmin,
    };
  } catch (error) {
    return {
      valid: false,
      response: NextResponse.json<ApiResponse<null>>(
        { success: false, error: 'Unauthorized: Invalid token' },
        { status: 401 }
      ),
    };
  }
}
