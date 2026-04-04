import { Router } from 'express'
import { authenticate } from '../middleware/auth.js'
import { getDashboardAnalytics, getPerformanceTrend, getInsights } from '../controllers/analytics.js'

const router = Router()

router.use(authenticate)

/**
 * @swagger
 * /api/analytics/dashboard:
 *   get:
 *     tags: [Analytics]
 *     summary: Get dashboard analytics
 *     security:
 *       - bearerAuth: []
 */
router.get('/dashboard', getDashboardAnalytics)

/**
 * @swagger
 * /api/analytics/trend:
 *   get:
 *     tags: [Analytics]
 *     summary: Get performance trend
 *     security:
 *       - bearerAuth: []
 */
router.get('/trend', getPerformanceTrend)

/**
 * @swagger
 * /api/analytics/insights:
 *   get:
 *     tags: [Analytics]
 *     summary: Get AI insights
 *     security:
 *       - bearerAuth: []
 */
router.get('/insights', getInsights)

export default router
