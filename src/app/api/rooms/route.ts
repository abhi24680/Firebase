import { withSupabaseRoute } from '@/lib/with-supabase-route'
import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export const GET = withSupabaseRoute({ auth: 'user' }, async (req, ctx) => {
  try {
    const rooms = await prisma.room.findMany({
      include: {
        devices: { select: { id: true, name: true, type: true, status: true } },
        occupancy: {
          orderBy: { timestamp: 'desc' },
          take: 1,
        },
        _count: { select: { scans: true } },
      },
      orderBy: { name: 'asc' },
    })

    const roomsWithOccupancy = rooms.map(room => ({
      id: room.id,
      name: room.name,
      building: room.building,
      capacity: room.capacity,
      currentOccupancy: room.occupancy[0]?.count || 0,
      devices: room.devices,
      totalScans: room._count.scans,
    }))

    return NextResponse.json({ rooms: roomsWithOccupancy })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
})
