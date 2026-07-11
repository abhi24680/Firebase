import { prisma } from '@/lib/prisma'

interface NotifyCountMismatchParams {
  roomId: string
  rfidCount: number
  roomCapacity: number
}

export async function checkAndNotifyCountMismatch({ roomId, rfidCount, roomCapacity }: NotifyCountMismatchParams) {
  const room = await prisma.room.findUnique({ where: { id: roomId } })
  if (!room) return

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
          message: `Room ${room.name} (${room.building}): RFID count (${rfidCount}) matches room capacity (${roomCapacity}). All present.`,
          type: 'attendance',
          severity: 'low',
          metadata: JSON.stringify({ roomId, rfidCount, roomCapacity, status: 'matched' }),
        },
      })
    }
    return { matched: true, notificationCount: recipients.length }
  }

  const severity = Math.abs(difference) >= 10 ? 'critical' : Math.abs(difference) >= 5 ? 'high' : 'medium'
  const direction = difference > 0 ? 'more' : 'fewer'

  const hodUsers = await prisma.user.findMany({ where: { role: 'hod', isApproved: true } })
  const advisorUsers = await prisma.user.findMany({ where: { role: 'advisor', isApproved: true } })
  const recipients = [...hodUsers, ...advisorUsers]

  for (const user of recipients) {
    await prisma.notification.create({
      data: {
        userId: user.id,
        title: 'Attendance Count Mismatch Alert',
        message: `Room ${room.name} (${room.building}): RFID count (${rfidCount}) is ${Math.abs(difference)} ${direction} than expected capacity (${roomCapacity}). Review required.`,
        type: 'attendance',
        severity,
        metadata: JSON.stringify({ roomId, rfidCount, roomCapacity, difference, status: 'mismatch' }),
      },
    })
  }

  return { matched: false, notificationCount: recipients.length, severity, difference }
}

export async function notifyAttendanceMarked(userId: string, roomName: string, method: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } })
  if (!user) return

  const hodUsers = await prisma.user.findMany({ where: { role: 'hod', department: user.department, isApproved: true } })
  const advisorUsers = await prisma.user.findMany({ where: { role: 'advisor', assignedBatch: user.assignedBatch, isApproved: true } })
  const recipients = [...hodUsers, ...advisorUsers]

  for (const recipient of recipients) {
    await prisma.notification.create({
      data: {
        userId: recipient.id,
        title: 'Attendance Marked',
        message: `${user.fullName} (${user.rollNumber}) marked attendance in ${roomName} via ${method.toUpperCase()}.`,
        type: 'attendance',
        severity: 'low',
        metadata: JSON.stringify({ studentId: userId, roomName, method }),
      },
    })
  }

  return { notificationCount: recipients.length }
}
