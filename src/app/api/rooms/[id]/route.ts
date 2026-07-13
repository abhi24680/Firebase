import { withSupabaseRoute } from '@/lib/with-supabase-route'
import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export const GET = withSupabaseRoute({ auth: 'user' }, async (req) => {
  try {
    const segments = req.nextUrl.pathname.split('/').filter(Boolean)
    const id = segments[segments.length - 2]
    if (!id) return NextResponse.json({ error: 'Missing room id' }, { status: 400 })

    const room = await prisma.room.findUnique({
      where: { id },
      include: {
        devices: { select: { id: true, name: true, type: true, status: true, lastChanged: true } },
        occupancy: {
          orderBy: { timestamp: 'desc' },
          take: 1,
        },
        scans: {
          orderBy: { timestamp: 'desc' },
          take: 20,
          include: { user: { select: { fullName: true, rollNumber: true } } },
        },
      },
    })

    if (!room) {
      return NextResponse.json({ error: 'Room not found' }, { status: 404 })
    }

    return NextResponse.json({
      room: {
        id: room.id,
        name: room.name,
        building: room.building,
        capacity: room.capacity,
        currentOccupancy: room.occupancy[0]?.count || 0,
        devices: room.devices,
        recentScans: room.scans.map((s: any) => ({
          id: s.id,
          studentName: s.user.fullName,
          rollNo: s.user.rollNumber,
          cardId: s.cardId,
          method: s.method,
          timestamp: s.timestamp,
        })),
      },
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
})
