import { NextRequest, NextResponse } from 'next/server'
import { adminAuth, adminDb } from '@/firebase/admin'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password, fullName, role, department, rollNumber, semester, subject, designation, assignedBatch } = body

    if (!email || !password || !fullName || !role) {
      return NextResponse.json(
        { error: 'Missing required fields: email, password, fullName, role' },
        { status: 400 }
      )
    }

    const userRecord = await adminAuth.createUser({
      email,
      password,
      displayName: fullName,
    })

    const userData = {
      uid: userRecord.uid,
      fullName,
      email,
      role,
      department: department || '',
      isApproved: role === 'student' || role === 'admin',
      collegeName: 'Providence College of Engineering',
      rollNumber: rollNumber || '',
      semester: semester || '',
      subject: subject || '',
      designation: designation || '',
      assignedBatch: assignedBatch || '',
      createdAt: new Date().toISOString(),
    }

    await adminDb.collection('users').doc(userRecord.uid).set(userData)

    return NextResponse.json({ success: true, uid: userRecord.uid }, { status: 201 })
  } catch (error: any) {
    console.error('Registration API Error:', error)

    if (error.code === 'auth/email-already-exists') {
      return NextResponse.json({ error: 'This email is already registered.' }, { status: 409 })
    }

    return NextResponse.json(
      { error: error.message || 'Registration failed' },
      { status: 500 }
    )
  }
}
