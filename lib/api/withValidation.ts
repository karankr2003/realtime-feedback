import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { ApiResponse } from '@/types';

export function withValidation<T extends z.ZodTypeAny, Context = any>(
  schema: T,
  handler: (
    req: NextRequest,
    validatedBody: z.infer<T>,
    context: Context
  ) => Promise<NextResponse>
) {
  return async (req: NextRequest, context: Context) => {
    try {
      const body = await req.json();
      const validation = schema.safeParse(body);

      if (!validation.success) {
        return NextResponse.json<ApiResponse<null>>(
          { 
            success: false, 
            error: validation.error.issues[0].message 
          },
          { status: 400 }
        );
      }

      return await handler(req, validation.data, context);
    } catch (error) {
      return NextResponse.json<ApiResponse<null>>(
        { 
          success: false, 
          error: error instanceof Error ? error.message : 'Invalid JSON body' 
        },
        { status: 400 }
      );
    }
  };
}
