import { withSupabaseRoute } from '@/lib/with-supabase-route'
import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export const GET = withSupabaseRoute({ auth: 'user' }, async (req) => {
  try {
    const { searchParams } = new URL(req.url)
    const type = searchParams.get('type')
    const unreadOnly = searchParams.get('unread') === 'true'
    const limit = parseInt(searchParams.get('limit') || '50')

    const profile = await prisma.user.findUnique({ where: { authUid: (req as any).ctx?.userClaims?.id } })
    if (!profile) return NextResponse.json({ error: 'User not found' }, { status: 404 })

    const where: any = { userId: profile.id }
    if (type) where.type = type
    if (unreadOnly) where.read = false

    const [notifications, unreadCount] = await Promise.all([
      prisma.notification.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: limit,
      }),
      prisma.notification.count({
        where: { userId: profile.id, read: false },
      }),
    ])

    return NextResponse.json({ notifications, unreadCount })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
})

export const POST = withSupabaseRoute({ auth: 'user' }, async (req) => {
  try {
    const body = await req.json()
    const { userId, title, message, type, severity, metadata } = body

    if (!userId || !title || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const notification = await prisma.notification.create({
      data: {
        userId,
        title,
        message,
        type: type || 'info',
        severity: severity || 'low',
        metadata: metadata ? JSON.stringify(metadata) : null,
      },
    })

    return NextResponse.json({ notification }, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to create notification' }, { status: 500 })
  }
})

export const PATCH = withSupabaseRoute({ auth: 'user' }, async (req) => {
  try {
    const body = await req.json()
    const { id, readAll } = body

    if (readAll) {
      const profile = await prisma.user.findUnique({ where: { authUid: (req as any).ctx?.userClaims?.id } })
      if (!profile) return NextResponse.json({ error: 'User not found' }, { status: 404 })

      await prisma.notification.updateMany({
        where: { userId: profile.id, read: false },
        data: { read: true },
      })
      return NextResponse.json({ success: true })
    }

    if (!id) {
      return NextResponse.json({ error: 'Missing notification id' }, { status: 400 })
    }

    const notification = await prisma.notification.update({
      where: { id },
      data: { read: true },
    })

    return NextResponse.json({ notification })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
})
