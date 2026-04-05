import { Router } from 'express'
import rateLimit from 'express-rate-limit'
import { authenticate } from '../middleware/auth.js'
import { validate } from '../middleware/validate.js'
import { getInsight, saveUserMessage, aiInsightValidation } from '../controllers/ai.js'
import { config } from '../config/index.js'

const router = Router()

const aiLimiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.aiMax,
  message: { success: false, message: 'Too many AI requests, please slow down.' },
})

router.use(authenticate)

/**
 * @swagger
 * /api/ai/insight:
 *   post:
 *     tags: [AI]
 *     summary: Get AI insight for a message
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [message]
 *             properties:
 *               message: { type: string }
 *               sessionId: { type: string }
 */
router.post('/insight', aiLimiter, aiInsightValidation, validate, getInsight)

/**
 * @swagger
 * /api/ai/message:
 *   post:
 *     tags: [AI]
 *     summary: Save a user message to a session
 *     security:
 *       - bearerAuth: []
 */
router.post('/message', aiInsightValidation, validate, saveUserMessage)

export default router
