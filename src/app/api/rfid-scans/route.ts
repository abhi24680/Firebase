import { withSupabaseRoute } from '@/lib/with-supabase-route'
import { prisma } from '@/lib/prisma'
import { checkAndNotifyCountMismatch, notifyAttendanceMarked } from '@/lib/notify'
import { NextRequest, NextResponse } from 'next/server'

export const POST = withSupabaseRoute({ auth: 'user' }, async (req, ctx) => {
  try {
    const body = await req.json()
    const { roomId, cardId, method } = body

    if (!roomId || !cardId) {
      return NextResponse.json({ error: 'Missing required fields: roomId, cardId' }, { status: 400 })
    }

    const profile = await prisma.user.findUnique({ where: { authUid: ctx.userClaims!.id } })
    if (!profile) return NextResponse.json({ error: 'User not found' }, { status: 404 })

    const room = await prisma.room.findUnique({ where: { id: roomId } })
    if (!room) return NextResponse.json({ error: 'Room not found' }, { status: 404 })

    const scan = await prisma.rfidScan.create({
      data: {
        userId: profile.id,
        roomId,
        cardId,
        method: method || 'rfid',
      },
      include: { user: { select: { fullName: true, rollNumber: true } }, room: { select: { name: true } } },
    })

    const todayStart = new Date()
    todayStart.setHours(0, 0, 0, 0)

    const rfidCountToday = await prisma.rfidScan.count({
      where: {
        roomId,
        timestamp: { gte: todayStart },
      },
    })

    const countResult = await checkAndNotifyCountMismatch({
      roomId,
      rfidCount: rfidCountToday,
      roomCapacity: room.capacity,
    })

    await notifyAttendanceMarked(profile.id, room.name, method || 'rfid')

    return NextResponse.json({
      scan,
      countCheck: {
        rfidCount: rfidCountToday,
        roomCapacity: room.capacity,
        matched: countResult?.matched ?? false,
        notificationsSent: countResult?.notificationCount ?? 0,
      },
    }, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to log RFID scan' }, { status: 500 })
  }
})

export const GET = withSupabaseRoute({ auth: 'user' }, async (req, ctx) => {
  try {
    const { searchParams } = new URL(req.url)
    const roomId = searchParams.get('roomId')
    const userId = searchParams.get('userId')
    const limit = parseInt(searchParams.get('limit') || '50')

    const where: any = {}
    if (roomId) where.roomId = roomId
    if (userId) where.userId = userId

    const scans = await prisma.rfidScan.findMany({
      where,
      orderBy: { timestamp: 'desc' },
      take: limit,
      include: {
        user: { select: { fullName: true, rollNumber: true } },
        room: { select: { name: true, building: true } },
      },
    })

    return NextResponse.json({ scans })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
})
