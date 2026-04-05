import { Router } from 'express'
import { authenticate } from '../middleware/auth.js'
import { validate } from '../middleware/validate.js'
import { getRoles, createRole, updateRole, deleteRole, roleValidation } from '../controllers/roles.js'

const router = Router()

router.use(authenticate)

/**
 * @swagger
 * /api/roles:
 *   get:
 *     tags: [Roles]
 *     summary: Get all roles
 *     security:
 *       - bearerAuth: []
 */
router.get('/', getRoles)

/**
 * @swagger
 * /api/roles:
 *   post:
 *     tags: [Roles]
 *     summary: Create a role
 *     security:
 *       - bearerAuth: []
 */
router.post('/', roleValidation, validate, createRole)

/**
 * @swagger
 * /api/roles/{id}:
 *   patch:
 *     tags: [Roles]
 *     summary: Update a role
 *     security:
 *       - bearerAuth: []
 */
router.patch('/:id', updateRole)

/**
 * @swagger
 * /api/roles/{id}:
 *   delete:
 *     tags: [Roles]
 *     summary: Delete a role
 *     security:
 *       - bearerAuth: []
 */
router.delete('/:id', deleteRole)

export default router
