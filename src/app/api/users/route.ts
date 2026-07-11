import { withSupabaseRoute } from '@/lib/with-supabase-route'
import { prisma } from '@/lib/prisma'
import { supabaseAdmin } from '@/lib/supabase-admin'
import bcrypt from 'bcryptjs'
import { NextRequest, NextResponse } from 'next/server'

export const POST = withSupabaseRoute({ auth: 'user' }, async (req) => {
  try {
    const body = await req.json()
    const { fullName, email, password, role, department, rollNumber, semester, subject, designation, assignedBatch } = body

    if (!fullName || !email || !role) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    if (!password || password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 })
    }

    // Step 1: Create Supabase auth user
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirm since admin is creating
      user_metadata: {
        full_name: fullName,
        role,
      },
    })

    if (authError) {
      console.error('Supabase auth error:', authError)
      return NextResponse.json({ error: authError.message || 'Failed to create auth user' }, { status: 400 })
    }

    if (!authData.user) {
      return NextResponse.json({ error: 'Failed to create auth user' }, { status: 500 })
    }

    const authUid = authData.user.id

    // Step 2: Create Prisma user with authUid
    const passwordHash = await bcrypt.hash(password, 12)

    const user = await prisma.user.create({
      data: {
        authUid,
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

    return NextResponse.json({ success: true, user }, { status: 201 })
  } catch (error: any) {
    console.error('Create user error:', error)
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'User already exists' }, { status: 409 })
    }
    return NextResponse.json({ error: error.message || 'Failed to create user' }, { status: 500 })
  }
})

export const GET = withSupabaseRoute({ auth: 'user' }, async (req, ctx) => {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    const role = searchParams.get('role')

    if (id) {
      const user = await prisma.user.findUnique({ where: { id } })
      if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })
      const { passwordHash, ...userWithoutPassword } = user
      return NextResponse.json({ user: userWithoutPassword })
    }

    if (role) {
      const users = await prisma.user.findMany({ where: { role }, orderBy: { fullName: 'asc' } })
      const sanitized = users.map(({ passwordHash, ...u }) => u)
      return NextResponse.json({ users: sanitized })
    }

    const user = await prisma.user.findUnique({ where: { authUid: ctx.userClaims!.id } })
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })
    const { passwordHash, ...userWithoutPassword } = user
    return NextResponse.json({ user: userWithoutPassword })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
})

export const PATCH = withSupabaseRoute({ auth: 'user' }, async (req, ctx) => {
  try {
    const body = await req.json()
    const { password, ...rest } = body

    const data: any = { ...rest }
    if (password) {
      data.passwordHash = await bcrypt.hash(password, 12)
    }

    const user = await prisma.user.update({
      where: { authUid: ctx.userClaims!.id },
      data,
    })
    const { passwordHash, ...userWithoutPassword } = user
    return NextResponse.json({ user: userWithoutPassword })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
})
