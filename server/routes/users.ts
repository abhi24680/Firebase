import { Router, Request, Response } from 'express'
import { createClient } from '@supabase/supabase-js'
import bcrypt from 'bcryptjs'
import { requireAuth } from '../auth'

const supabaseUrl = process.env.VITE_SUPABASE_URL || ''
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

const router = Router()

router.post('/', async (req: Request, res: Response) => {
  try {
    const { fullName, email, password, role, department, rollNumber, semester, subject, designation, assignedBatch } = req.body

    if (!fullName || !email || !role) {
      res.status(400).json({ error: 'Missing required fields' })
      return
    }

    if (!password || password.length < 6) {
      res.status(400).json({ error: 'Password must be at least 6 characters' })
      return
    }

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    })

    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name: fullName, role },
    })

    if (authError || !authData?.user) {
      res.status(400).json({ error: authError?.message || 'Failed to create auth user' })
      return
    }

    const passwordHash = await bcrypt.hash(password, 12)

    const user = await req.prisma.user.create({
      data: {
        authUid: authData.user.id,
        fullName,
        email,
        passwordHash,
        role,
        department: department || '',
        isApproved: role === 'student' || role === 'admin',
        rollNumber: rollNumber || '',
        semester: semester || '',
        subject: subject || '',
        designation: designation || '',
        assignedBatch: assignedBatch || '',
      },
    })

    res.status(201).json({ success: true, user })
  } catch (error: any) {
    console.error('Create user error:', error)
    if (error.code === 'P2002') {
      res.status(409).json({ error: 'User already exists' })
      return
    }
    res.status(500).json({ error: error.message || 'Failed to create user' })
  }
})

router.get('/', requireAuth, async (req: Request, res: Response) => {
  try {
    const id = req.query.id as string | undefined
    const role = req.query.role as string | undefined

    if (id) {
      const user = await req.prisma.user.findUnique({ where: { id } })
      if (!user) { res.status(404).json({ error: 'User not found' }); return }
      const { passwordHash, ...userWithoutPassword } = user
      res.json({ user: userWithoutPassword })
      return
    }

    if (role) {
      const users = await req.prisma.user.findMany({ where: { role }, orderBy: { fullName: 'asc' } })
      const sanitized = users.map(({ passwordHash, ...u }) => u)
      res.json({ users: sanitized })
      return
    }

    const user = await req.prisma.user.findUnique({ where: { authUid: req.user!.authUid } })
    if (!user) { res.status(404).json({ error: 'User not found' }); return }
    const { passwordHash, ...userWithoutPassword } = user
    res.json({ user: userWithoutPassword })
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
})

router.patch('/', requireAuth, async (req: Request, res: Response) => {
  try {
    const { password, ...rest } = req.body
    const data: any = { ...rest }
    if (password) {
      data.passwordHash = await bcrypt.hash(password, 12)
    }

    const user = await req.prisma.user.update({
      where: { authUid: req.user!.authUid },
      data,
    })
    const { passwordHash, ...userWithoutPassword } = user
    res.json({ user: userWithoutPassword })
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
})

router.patch('/:id', requireAuth, async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const { password, ...rest } = req.body
    const data: any = { ...rest }
    if (password) {
      data.passwordHash = await bcrypt.hash(password, 12)
    }

    const user = await req.prisma.user.update({ where: { id }, data })
    const { passwordHash, ...userWithoutPassword } = user
    res.json({ user: userWithoutPassword })
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
})

export default router
