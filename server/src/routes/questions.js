import { Router } from 'express'
import { authenticate } from '../middleware/auth.js'
import { validate } from '../middleware/validate.js'
import { getQuestions, createQuestion, updateQuestion, deleteQuestion, questionValidation } from '../controllers/questions.js'

const router = Router()

router.use(authenticate)

/**
 * @swagger
 * /api/questions:
 *   get:
 *     tags: [Questions]
 *     summary: Get questions
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: category
 *         schema: { type: string }
 *       - in: query
 *         name: difficulty
 *         schema: { type: string }
 */
router.get('/', getQuestions)
router.post('/', questionValidation, validate, createQuestion)
router.patch('/:id', questionValidation, validate, updateQuestion)
router.delete('/:id', deleteQuestion)

export default router
