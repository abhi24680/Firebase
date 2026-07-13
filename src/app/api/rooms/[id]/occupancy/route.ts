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
        occupancy: {
          orderBy: { timestamp: 'desc' },
          take: 5,
        },
        devices: true,
      },
    })

    if (!room) {
      return NextResponse.json({ error: 'Room not found' }, { status: 404 })
    }

    const currentOccupancy = room.occupancy[0]?.count || 0
    const occupancyHistory = room.occupancy.map((o: any) => ({
      count: o.count,
      capacity: o.capacity,
      timestamp: o.timestamp,
    }))

    const lightsOn = room.devices.filter((d: any) => d.type === 'light' && d.status === 'on').length
    const fansOn = room.devices.filter((d: any) => d.type === 'fan' && d.status === 'on').length
    const totalLights = room.devices.filter((d: any) => d.type === 'light').length
    const totalFans = room.devices.filter((d: any) => d.type === 'fan').length

    return NextResponse.json({
      roomId: room.id,
      roomName: room.name,
      building: room.building,
      capacity: room.capacity,
      currentOccupancy,
      isOccupied: currentOccupancy > 0,
      occupancyHistory,
      energy: {
        lightsOn,
        totalLights,
        fansOn,
        totalFans,
        autoPowerEnabled: currentOccupancy === 0,
      },
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
})
