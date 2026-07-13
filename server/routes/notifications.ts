import { Router, Request, Response } from 'express'
import { requireAuth } from '../auth'

const router = Router()

router.get('/', requireAuth, async (req: Request, res: Response) => {
  try {
    const type = req.query.type as string | undefined
    const unreadOnly = req.query.unread === 'true'
    const limit = parseInt((req.query.limit as string) || '50')

    const profile = await req.prisma.user.findUnique({ where: { authUid: req.user!.authUid } })
    if (!profile) { res.status(404).json({ error: 'User not found' }); return }

    const where: any = { userId: profile.id }
    if (type) where.type = type
    if (unreadOnly) where.read = false

    const [notifications, unreadCount] = await Promise.all([
      req.prisma.notification.findMany({ where, orderBy: { createdAt: 'desc' }, take: limit }),
      req.prisma.notification.count({ where: { userId: profile.id, read: false } }),
    ])

    res.json({ notifications, unreadCount })
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
})

router.post('/', requireAuth, async (req: Request, res: Response) => {
  try {
    const { userId, title, message, type, severity, metadata } = req.body

    if (!userId || !title || !message) {
      res.status(400).json({ error: 'Missing required fields' })
      return
    }

    const notification = await req.prisma.notification.create({
      data: {
        userId,
        title,
        message,
        type: type || 'info',
        severity: severity || 'low',
        metadata: metadata ? JSON.stringify(metadata) : null,
      },
    })

    res.status(201).json({ notification })
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to create notification' })
  }
})

router.patch('/', requireAuth, async (req: Request, res: Response) => {
  try {
    const { id, readAll } = req.body

    if (readAll) {
      const profile = await req.prisma.user.findUnique({ where: { authUid: req.user!.authUid } })
      if (!profile) { res.status(404).json({ error: 'User not found' }); return }

      await req.prisma.notification.updateMany({
        where: { userId: profile.id, read: false },
        data: { read: true },
      })
      res.json({ success: true })
      return
    }

    if (!id) {
      res.status(400).json({ error: 'Missing notification id' })
      return
    }

    const notification = await req.prisma.notification.update({ where: { id }, data: { read: true } })
    res.json({ notification })
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
})

export default router
