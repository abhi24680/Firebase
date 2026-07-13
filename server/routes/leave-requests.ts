import { Router, Request, Response } from 'express'
import { requireAuth } from '../auth'

const router = Router()

router.post('/', requireAuth, async (req: Request, res: Response) => {
  try {
    const { startDate, endDate, reason } = req.body

    if (!startDate || !endDate || !reason) {
      res.status(400).json({ error: 'Missing required fields' })
      return
    }

    const profile = await req.prisma.user.findUnique({ where: { authUid: req.user!.authUid } })
    if (!profile) { res.status(404).json({ error: 'User not found' }); return }

    const leaveRequest = await req.prisma.leaveRequest.create({
      data: {
        userId: profile.id,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        reason,
        status: 'pending',
      },
    })

    res.status(201).json({ leaveRequest })
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to create leave request' })
  }
})

router.get('/', requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = req.query.userId as string | undefined

    if (userId) {
      const leaveRequests = await req.prisma.leaveRequest.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
      })
      res.json({ leaveRequests })
      return
    }

    const profile = await req.prisma.user.findUnique({ where: { authUid: req.user!.authUid } })
    if (!profile) { res.status(404).json({ error: 'User not found' }); return }

    const leaveRequests = await req.prisma.leaveRequest.findMany({
      where: { userId: profile.id },
      orderBy: { createdAt: 'desc' },
    })
    res.json({ leaveRequests })
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
})

export default router
