import { createSupabaseContext } from '@supabase/server'
import type { SupabaseContext, WithSupabaseConfig } from '@supabase/server'
import { NextRequest, NextResponse } from 'next/server'

type RouteHandler = (req: NextRequest, ctx: SupabaseContext) => Promise<NextResponse>

export function withSupabaseRoute(config: WithSupabaseConfig, handler: RouteHandler) {
  return async (req: NextRequest): Promise<NextResponse> => {
    const { data: ctx, error } = await createSupabaseContext(req, config)
    if (error) {
      return NextResponse.json(
        { message: error.message },
        { status: typeof error.status === 'number' ? error.status : 401 },
      )
    }
    return handler(req, ctx)
  }
}

export { type SupabaseContext, type WithSupabaseConfig }

