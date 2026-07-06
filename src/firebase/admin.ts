import { initializeApp, getApps, cert, getApp } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'
import { getFirestore } from 'firebase-admin/firestore'

function initAdmin() {
  if (getApps().length > 0) return getApp()

  const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_KEY
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'demo-project'

  if (process.env.FIREBASE_EMULATOR_HOST) {
    process.env.FIRESTORE_EMULATOR_HOST = process.env.FIREBASE_EMULATOR_HOST
    process.env.FIREBASE_AUTH_EMULATOR_HOST = process.env.FIREBASE_EMULATOR_HOST
  }

  if (serviceAccount) {
    try {
      const credentials = JSON.parse(
        Buffer.from(serviceAccount, 'base64').toString('utf-8')
      )
      return initializeApp({ credential: cert(credentials) })
    } catch {
      try {
        const credentials = JSON.parse(serviceAccount)
        return initializeApp({ credential: cert(credentials) })
      } catch {
        throw new Error('FIREBASE_SERVICE_ACCOUNT_KEY is invalid. Provide a valid service account JSON (raw or base64).')
      }
    }
  }

  return initializeApp({ projectId })
}

const adminApp = initAdmin()
export const adminAuth = getAuth(adminApp)
export const adminDb = getFirestore(adminApp)
