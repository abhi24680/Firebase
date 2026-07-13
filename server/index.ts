import express from 'express'
import cors from 'cors'
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import usersRouter from './routes/users'
import roomsRouter from './routes/rooms'
import rfidScansRouter from './routes/rfid-scans'
import notificationsRouter from './routes/notifications'
import leaveRequestsRouter from './routes/leave-requests'

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.json())

const adapter = new PrismaPg(process.env.DATABASE_URL!)
const prisma = new PrismaClient({ adapter })

app.use((req, _res, next) => {
  req.prisma = prisma
  next()
})

app.use('/api/users', usersRouter)
app.use('/api/rooms', roomsRouter)
app.use('/api/rfid-scans', rfidScansRouter)
app.use('/api/notifications', notificationsRouter)
app.use('/api/leave-requests', leaveRequestsRouter)

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' })
})

app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`)
})
