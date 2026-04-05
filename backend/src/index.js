import 'dotenv/config'
import express from 'express'
import { createServer } from 'http'
import { Server as SocketIOServer } from 'socket.io'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import rateLimit from 'express-rate-limit'
import swaggerUi from 'swagger-ui-express'
import mongoose from 'mongoose'
import path from 'path'
import { fileURLToPath } from 'url'

import { config } from './config/index.js'
import { swaggerSpec } from './swagger.js'
import { setupSocket } from './socket/index.js'
import { errorHandler, notFound } from './middleware/error.js'
import { seedDefaultRoles } from './controllers/roles.js'

import authRoutes from './routes/auth.js'
import userRoutes from './routes/users.js'
import roleRoutes from './routes/roles.js'
import questionRoutes from './routes/questions.js'
import sessionRoutes from './routes/sessions.js'
import analyticsRoutes from './routes/analytics.js'
import fileRoutes from './routes/files.js'
import aiRoutes from './routes/ai.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const app = express()
const httpServer = createServer(app)

const io = new SocketIOServer(httpServer, {
  cors: {
    origin: config.clientUrl,
    methods: ['GET', 'POST'],
    credentials: true,
  },
})

app.set('trust proxy', 1)

app.use(helmet())
app.use(
  cors({
    origin: config.clientUrl,
    credentials: true,
  })
)
app.use(morgan(config.env === 'production' ? 'combined' : 'dev'))
app.use(express.json({ limit: '2mb' }))
app.use(express.urlencoded({ extended: true }))

const globalLimiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.max,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests, please try again later.' },
})
app.use('/api', globalLimiter)

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))
app.use('/uploads', express.static(path.resolve(config.upload.dir)))

app.get('/api/health', (_req, res) => {
  res.json({
    success: true,
    status: 'ok',
    env: config.env,
    timestamp: new Date().toISOString(),
  })
})

app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/roles', roleRoutes)
app.use('/api/questions', questionRoutes)
app.use('/api/sessions', sessionRoutes)
app.use('/api/analytics', analyticsRoutes)
app.use('/api/files', fileRoutes)
app.use('/api/ai', aiRoutes)

setupSocket(io)

app.use(notFound)
app.use(errorHandler)

async function start() {
  try {
    await mongoose.connect(config.mongoUri)
    console.log('[DB] MongoDB connected')

    await seedDefaultRoles()
    console.log('[DB] Default roles seeded')

    httpServer.listen(config.port, () => {
      console.log(`[Server] Running on http://localhost:${config.port}`)
      console.log(`[Docs]   Swagger UI at http://localhost:${config.port}/api-docs`)
    })
  } catch (err) {
    console.error('[Server] Failed to start:', err.message)
    process.exit(1)
  }
}

start()

export { app, io }
