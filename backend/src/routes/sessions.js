import { Router } from 'express'
import { authenticate } from '../middleware/auth.js'
import { validate } from '../middleware/validate.js'
import {
  createSession,
  getSession,
  getUserSessions,
  updateSession,
  getUpcomingInterviews,
  getPastRecordings,
  sessionValidation,
} from '../controllers/sessions.js'

const router = Router()

router.use(authenticate)

/**
 * @swagger
 * /api/sessions:
 *   get:
 *     tags: [Sessions]
 *     summary: Get user sessions
 *     security:
 *       - bearerAuth: []
 */
router.get('/', getUserSessions)

/**
 * @swagger
 * /api/sessions/upcoming:
 *   get:
 *     tags: [Sessions]
 *     summary: Get upcoming interviews
 *     security:
 *       - bearerAuth: []
 */
router.get('/upcoming', getUpcomingInterviews)

/**
 * @swagger
 * /api/sessions/recordings:
 *   get:
 *     tags: [Sessions]
 *     summary: Get past recordings
 *     security:
 *       - bearerAuth: []
 */
router.get('/recordings', getPastRecordings)

/**
 * @swagger
 * /api/sessions:
 *   post:
 *     tags: [Sessions]
 *     summary: Create a new session
 *     security:
 *       - bearerAuth: []
 */
router.post('/', sessionValidation, validate, createSession)

/**
 * @swagger
 * /api/sessions/{id}:
 *   get:
 *     tags: [Sessions]
 *     summary: Get session by ID
 *     security:
 *       - bearerAuth: []
 */
router.get('/:id', getSession)

/**
 * @swagger
 * /api/sessions/{id}:
 *   patch:
 *     tags: [Sessions]
 *     summary: Update session
 *     security:
 *       - bearerAuth: []
 */
router.patch('/:id', updateSession)

export default router
