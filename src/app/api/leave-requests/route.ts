import { withSupabaseRoute } from '@/lib/with-supabase-route'
import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export const POST = withSupabaseRoute({ auth: 'user' }, async (req, ctx) => {
  try {
    const body = await req.json()
    const { startDate, endDate, reason } = body

    if (!startDate || !endDate || !reason) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const profile = await prisma.user.findUnique({ where: { authUid: ctx.userClaims!.id } })
    if (!profile) return NextResponse.json({ error: 'User not found' }, { status: 404 })

    const leaveRequest = await prisma.leaveRequest.create({
      data: {
        userId: profile.id,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        reason,
        status: 'pending',
      },
    })

    return NextResponse.json({ leaveRequest }, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to create leave request' }, { status: 500 })
  }
})

export const GET = withSupabaseRoute({ auth: 'user' }, async (req, ctx) => {
  try {
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get('userId')

    if (userId) {
      const leaveRequests = await prisma.leaveRequest.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
      })
      return NextResponse.json({ leaveRequests })
    }

    const profile = await prisma.user.findUnique({ where: { authUid: ctx.userClaims!.id } })
    if (!profile) return NextResponse.json({ error: 'User not found' }, { status: 404 })

    const leaveRequests = await prisma.leaveRequest.findMany({
      where: { userId: profile.id },
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json({ leaveRequests })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
})
