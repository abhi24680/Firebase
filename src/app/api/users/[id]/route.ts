import { withSupabaseRoute } from '@/lib/with-supabase-route'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { NextRequest, NextResponse } from 'next/server'

export const PATCH = withSupabaseRoute({ auth: 'user' }, async (req) => {
  try {
    const id = req.nextUrl.pathname.split('/').pop()
    if (!id) return NextResponse.json({ error: 'Missing user id' }, { status: 400 })

    const body = await req.json()
    const { password, ...rest } = body

    const data: any = { ...rest }
    if (password) {
      data.passwordHash = await bcrypt.hash(password, 12)
    }

    const user = await prisma.user.update({
      where: { id },
      data,
    })
    const { passwordHash, ...userWithoutPassword } = user
    return NextResponse.json({ user: userWithoutPassword })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
})
