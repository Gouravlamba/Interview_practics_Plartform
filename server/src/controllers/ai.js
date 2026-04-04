import { body } from 'express-validator'
import mongoose from 'mongoose'
import { getAIInsight } from '../services/aiService.js'
import InterviewSession from '../models/InterviewSession.js'
import { AppError } from '../middleware/error.js'

export const aiInsightValidation = [
  body('message').trim().notEmpty().withMessage('Message is required'),
  body('sessionId').optional().isMongoId().withMessage('Invalid session ID'),
]

export async function getInsight(req, res, next) {
  try {
    const { message, sessionId, context } = req.body

    let sessionContext = context || {}
    if (sessionId) {
      const safeId = new mongoose.Types.ObjectId(sessionId)
      const session = await InterviewSession.findOne({
        _id: safeId,
        userId: req.user._id,
      }).select('persona difficulty')
      if (session) {
        sessionContext = { persona: session.persona, difficulty: session.difficulty, ...sessionContext }
      }
    }

    const result = await getAIInsight(message, sessionContext)

    if (sessionId) {
      const safeId = new mongoose.Types.ObjectId(sessionId)
      await InterviewSession.findByIdAndUpdate(safeId, {
        $push: {
          messages: {
            sender: 'ai',
            text: result.text,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        },
      })
    }

    res.json({ success: true, data: result })
  } catch (err) {
    next(err)
  }
}

export async function saveUserMessage(req, res, next) {
  try {
    const { message, sessionId } = req.body
    if (!sessionId) throw new AppError('sessionId is required', 400)

    const safeId = new mongoose.Types.ObjectId(sessionId)
    const session = await InterviewSession.findOne({
      _id: safeId,
      userId: req.user._id,
    })
    if (!session) throw new AppError('Session not found', 404)

    session.messages.push({
      sender: 'user',
      text: message,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    })
    await session.save()

    res.json({ success: true, data: { saved: true } })
  } catch (err) {
    next(err)
  }
}
