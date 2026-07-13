import { Router, Request, Response } from 'express'
import { requireAuth } from '../auth'

const router = Router()

router.get('/', requireAuth, async (req: Request, res: Response) => {
  try {
    const rooms = await req.prisma.room.findMany({
      include: {
        devices: { select: { id: true, name: true, type: true, status: true } },
        occupancy: { orderBy: { timestamp: 'desc' }, take: 1 },
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

    res.json({ rooms: roomsWithOccupancy })
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
})

router.get('/:id', requireAuth, async (req: Request, res: Response) => {
  try {
    const { id } = req.params

    const room = await req.prisma.room.findUnique({
      where: { id },
      include: {
        devices: { select: { id: true, name: true, type: true, status: true, lastChanged: true } },
        occupancy: { orderBy: { timestamp: 'desc' }, take: 1 },
        scans: {
          orderBy: { timestamp: 'desc' },
          take: 20,
          include: { user: { select: { fullName: true, rollNumber: true } } },
        },
      },
    })

    if (!room) {
      res.status(404).json({ error: 'Room not found' })
      return
    }

    res.json({
      room: {
        id: room.id,
        name: room.name,
        building: room.building,
        capacity: room.capacity,
        currentOccupancy: room.occupancy[0]?.count || 0,
        devices: room.devices,
        recentScans: room.scans.map(s => ({
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
    res.status(500).json({ error: error.message })
  }
})

router.get('/:id/occupancy', requireAuth, async (req: Request, res: Response) => {
  try {
    const { id } = req.params

    const room = await req.prisma.room.findUnique({
      where: { id },
      include: {
        occupancy: { orderBy: { timestamp: 'desc' }, take: 5 },
        devices: true,
      },
    })

    if (!room) {
      res.status(404).json({ error: 'Room not found' })
      return
    }

    const currentOccupancy = room.occupancy[0]?.count || 0
    const occupancyHistory = room.occupancy.map(o => ({
      count: o.count,
      capacity: o.capacity,
      timestamp: o.timestamp,
    }))

    const lightsOn = room.devices.filter(d => d.type === 'light' && d.status === 'on').length
    const fansOn = room.devices.filter(d => d.type === 'fan' && d.status === 'on').length
    const totalLights = room.devices.filter(d => d.type === 'light').length
    const totalFans = room.devices.filter(d => d.type === 'fan').length

    res.json({
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
    res.status(500).json({ error: error.message })
  }
})

export default router
