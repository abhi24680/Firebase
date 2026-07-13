import { PrismaClient } from '@prisma/client'
import { Request } from 'express'

declare global {
  namespace Express {
    interface Request {
      prisma: PrismaClient
      user?: {
        uid: string
        email: string
        role: string
        authUid: string
      }
    }
  }
}
