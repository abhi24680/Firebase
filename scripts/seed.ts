import { initializeApp, cert } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'
import { getFirestore } from 'firebase-admin/firestore'

const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_KEY
const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'demo-project'

process.env.FIRESTORE_EMULATOR_HOST = 'localhost:8080'
process.env.FIREBASE_AUTH_EMULATOR_HOST = 'localhost:9099'

const app = initializeApp({
  projectId,
  ...(serviceAccount ? { credential: cert(JSON.parse(serviceAccount)) } : {}),
})

const auth = getAuth(app)
const db = getFirestore(app)

const SEED_USERS = [
  { fullName: 'Admin User', email: 'admin@providence.edu.in', password: 'admin123', role: 'admin', department: 'CSE', isApproved: true },
  { fullName: 'HOD User', email: 'hod@providence.edu.in', password: 'hod123', role: 'hod', department: 'CSE', isApproved: false },
  { fullName: 'Faculty One', email: 'faculty@providence.edu.in', password: 'faculty123', role: 'faculty', department: 'CSE', isApproved: false },
  { fullName: 'Student One', email: 'student@providence.edu.in', password: 'student123', role: 'student', department: 'CSE', isApproved: true, rollNumber: 'CSE-23-01', semester: '3' },
  { fullName: 'Advisor User', email: 'advisor@providence.edu.in', password: 'advisor123', role: 'advisor', department: 'CSE', isApproved: false },
]

async function seed() {
  console.log('Seeding Firebase emulators...')

  for (const u of SEED_USERS) {
    try {
      const userRecord = await auth.createUser({
        email: u.email,
        password: u.password,
        displayName: u.fullName,
      })

      await db.collection('users').doc(userRecord.uid).set({
        uid: userRecord.uid,
        fullName: u.fullName,
        email: u.email,
        role: u.role,
        department: u.department,
        isApproved: u.isApproved,
        collegeName: 'Providence College of Engineering',
        rollNumber: (u as any).rollNumber || '',
        semester: (u as any).semester || '',
        subject: '',
        designation: '',
        assignedBatch: '',
        createdAt: new Date().toISOString(),
      })

      console.log(`  ✓ Created ${u.role}: ${u.email}`)
    } catch (err: any) {
      console.error(`  ✗ Failed ${u.email}:`, err.message)
    }
  }

  console.log('Seed complete.')
  process.exit(0)
}

seed()
