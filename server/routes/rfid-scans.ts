import { Router, Request, Response } from 'express'
import { requireAuth } from '../auth'

const router = Router()

router.post('/', requireAuth, async (req: Request, res: Response) => {
  try {
    const { roomId, cardId, method } = req.body

    if (!roomId || !cardId) {
      res.status(400).json({ error: 'Missing required fields: roomId, cardId' })
      return
    }

    const profile = await req.prisma.user.findUnique({ where: { authUid: req.user!.authUid } })
    if (!profile) { res.status(404).json({ error: 'User not found' }); return }

    const room = await req.prisma.room.findUnique({ where: { id: roomId } })
    if (!room) { res.status(404).json({ error: 'Room not found' }); return }

    const scan = await req.prisma.rfidScan.create({
      data: { userId: profile.id, roomId, cardId, method: method || 'rfid' },
      include: { user: { select: { fullName: true, rollNumber: true } }, room: { select: { name: true } } },
    })

    const todayStart = new Date()
    todayStart.setHours(0, 0, 0, 0)

    const rfidCountToday = await req.prisma.rfidScan.count({
      where: { roomId, timestamp: { gte: todayStart } },
    })

    const countResult = await checkAndNotifyCountMismatch(req.prisma, { roomId, rfidCount: rfidCountToday, roomCapacity: room.capacity })
    await notifyAttendanceMarked(req.prisma, profile.id, room.name, method || 'rfid')

    res.status(201).json({
      scan,
      countCheck: {
        rfidCount: rfidCountToday,
        roomCapacity: room.capacity,
        matched: countResult?.matched ?? false,
        notificationsSent: countResult?.notificationCount ?? 0,
      },
    })
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to log RFID scan' })
  }
})

router.get('/', requireAuth, async (req: Request, res: Response) => {
  try {
    const roomId = req.query.roomId as string | undefined
    const userId = req.query.userId as string | undefined
    const limit = parseInt((req.query.limit as string) || '50')

    const where: any = {}
    if (roomId) where.roomId = roomId
    if (userId) where.userId = userId

    const scans = await req.prisma.rfidScan.findMany({
      where,
      orderBy: { timestamp: 'desc' },
      take: limit,
      include: {
        user: { select: { fullName: true, rollNumber: true } },
        room: { select: { name: true, building: true } },
      },
    })

    res.json({ scans })
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
})

async function checkAndNotifyCountMismatch(prisma: any, { roomId, rfidCount, roomCapacity }: any) {
  const mismatch = rfidCount !== roomCapacity
  const difference = rfidCount - roomCapacity

  if (!mismatch) {
    const hodUsers = await prisma.user.findMany({ where: { role: 'hod', isApproved: true } })
    const advisorUsers = await prisma.user.findMany({ where: { role: 'advisor', isApproved: true } })
    const recipients = [...hodUsers, ...advisorUsers]

    for (const user of recipients) {
      await prisma.notification.create({
        data: {
          userId: user.id,
          title: 'Attendance Count Verified',
          message: `Room scan count (${rfidCount}) matches expected.`,
          type: 'attendance',
          severity: 'low',
        },
      })
    }
    return { matched: true, notificationCount: recipients.length }
  }

  const hodUsers = await prisma.user.findMany({ where: { role: 'hod', isApproved: true } })
  const advisorUsers = await prisma.user.findMany({ where: { role: 'advisor', isApproved: true } })
  const recipients = [...hodUsers, ...advisorUsers]

  for (const user of recipients) {
    await prisma.notification.create({
      data: {
        userId: user.id,
        title: 'Attendance Count Mismatch Alert',
        message: `Room: RFID count (${rfidCount}) differs from expected (${roomCapacity}) by ${Math.abs(difference)}.`,
        type: 'attendance',
        severity: Math.abs(difference) >= 10 ? 'critical' : 'high',
      },
    })
  }

  return { matched: false, notificationCount: recipients.length, difference }
}

async function notifyAttendanceMarked(prisma: any, userId: string, roomName: string, method: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } })
  if (!user) return

  const hodUsers = await prisma.user.findMany({ where: { role: 'hod', department: user.department, isApproved: true } })
  const recipients = [...hodUsers]

  for (const recipient of recipients) {
    await prisma.notification.create({
      data: {
        userId: recipient.id,
        title: 'Attendance Marked',
        message: `${user.fullName} (${user.rollNumber}) in ${roomName} via ${method.toUpperCase()}.`,
        type: 'attendance',
        severity: 'low',
      },
    })
  }
}

export default router
