import { Router } from 'express'
import { authenticate, requireAdmin } from '../middleware/auth.js'
import { validate } from '../middleware/validate.js'
import { getProfile, updateProfile, getAllUsers, updateProfileValidation } from '../controllers/users.js'

const router = Router()

router.use(authenticate)

/**
 * @swagger
 * /api/users/me:
 *   get:
 *     tags: [Users]
 *     summary: Get profile
 *     security:
 *       - bearerAuth: []
 */
router.get('/me', getProfile)

/**
 * @swagger
 * /api/users/me:
 *   patch:
 *     tags: [Users]
 *     summary: Update profile
 *     security:
 *       - bearerAuth: []
 */
router.patch('/me', updateProfileValidation, validate, updateProfile)

/**
 * @swagger
 * /api/users:
 *   get:
 *     tags: [Users]
 *     summary: List all users (admin)
 *     security:
 *       - bearerAuth: []
 */
router.get('/', requireAdmin, getAllUsers)

export default router
