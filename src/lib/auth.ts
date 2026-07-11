import { NextRequest } from 'next/server'
import { verifyAuth as supabaseVerifyAuth } from '@supabase/server/core'
import { prisma } from '@/lib/prisma'

interface AuthPayload {
  uid: string
  email: string
  role: string
}

export async function verifyAuth(request: NextRequest): Promise<AuthPayload | null> {
  const { data: result, error } = await supabaseVerifyAuth(request, { auth: 'user' })
  if (error || !result?.userClaims) return null

  const profile = await prisma.user.findUnique({ where: { authUid: result.userClaims.id } })
  return {
    uid: profile?.id || result.userClaims.id,
    email: result.userClaims.email || '',
    role: profile?.role || result.userClaims.role || '',
  }
}
