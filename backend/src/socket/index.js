import jwt from 'jsonwebtoken'
import { config } from '../config/index.js'
import InterviewSession from '../models/InterviewSession.js'
import { getAIInsight } from '../services/aiService.js'

export function setupSocket(io) {
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth?.token || socket.handshake.query?.token
      if (!token) return next(new Error('Authentication required'))

      const decoded = jwt.verify(token, config.jwt.secret)
      socket.userId = decoded.userId
      next()
    } catch {
      next(new Error('Invalid token'))
    }
  })

  io.on('connection', (socket) => {
    console.log(`[Socket] User connected: ${socket.userId} (${socket.id})`)

    socket.on('join-room', async ({ roomId, sessionId }) => {
      socket.join(roomId)
      socket.roomId = roomId
      socket.sessionId = sessionId

      socket.to(roomId).emit('user-joined', { userId: socket.userId, socketId: socket.id })
      console.log(`[Socket] User ${socket.userId} joined room ${roomId}`)

      if (sessionId) {
        try {
          const session = await InterviewSession.findById(sessionId).select('messages').lean()
          if (session) {
            socket.emit('session-history', { messages: session.messages.slice(-20) })
          }
        } catch (err) {
          console.error('[Socket] Error fetching session history:', err.message)
        }
      }
    })

    socket.on('leave-room', ({ roomId }) => {
      socket.leave(roomId)
      socket.to(roomId).emit('user-left', { userId: socket.userId })
      console.log(`[Socket] User ${socket.userId} left room ${roomId}`)
    })

    socket.on('send-message', async ({ roomId, sessionId, message }) => {
      const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      const msgObj = {
        id: Date.now(),
        sender: 'user',
        text: message,
        time,
      }

      io.to(roomId).emit('receive-message', msgObj)

      if (sessionId) {
        try {
          await InterviewSession.findByIdAndUpdate(sessionId, {
            $push: { messages: { sender: 'user', text: message, time } },
          })
        } catch (err) {
          console.error('[Socket] Error saving message:', err.message)
        }
      }
    })

    socket.on('ai-request', async ({ roomId, sessionId, message, context }) => {
      try {
        socket.emit('ai-thinking', { roomId })

        let sessionContext = context || {}
        if (sessionId) {
          const session = await InterviewSession.findById(sessionId).select('persona difficulty').lean()
          if (session) sessionContext = { ...sessionContext, persona: session.persona, difficulty: session.difficulty }
        }

        const result = await getAIInsight(message, sessionContext)
        const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

        const aiMsg = {
          id: Date.now() + 1,
          sender: 'ai',
          text: result.text,
          time,
        }

        io.to(roomId).emit('ai-response', aiMsg)

        if (sessionId) {
          await InterviewSession.findByIdAndUpdate(sessionId, {
            $push: { messages: { sender: 'ai', text: result.text, time } },
          })
        }
      } catch (err) {
        console.error('[Socket] AI request error:', err.message)
        socket.emit('ai-error', { message: 'AI service temporarily unavailable' })
      }
    })

    socket.on('code-update', ({ roomId, code, language }) => {
      socket.to(roomId).emit('code-sync', { code, language, from: socket.userId })
    })

    socket.on('code-save', async ({ sessionId, code, language }) => {
      if (!sessionId) return
      try {
        await InterviewSession.findByIdAndUpdate(sessionId, {
          code,
          codeLanguage: language || 'python',
        })
      } catch (err) {
        console.error('[Socket] Error saving code:', err.message)
      }
    })

    socket.on('session-status', async ({ sessionId, status }) => {
      if (!sessionId || !socket.roomId) return
      io.to(socket.roomId).emit('session-updated', { sessionId, status })
    })

    socket.on('disconnect', () => {
      if (socket.roomId) {
        socket.to(socket.roomId).emit('user-left', { userId: socket.userId })
      }
      console.log(`[Socket] User disconnected: ${socket.userId} (${socket.id})`)
    })
  })
}
