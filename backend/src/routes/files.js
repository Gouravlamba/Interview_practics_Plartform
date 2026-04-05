import { Router } from 'express'
import { authenticate } from '../middleware/auth.js'
import { validate } from '../middleware/validate.js'
import { upload } from '../middleware/upload.js'
import { uploadFile, getUserFiles, deleteFile } from '../controllers/files.js'

const router = Router()

router.use(authenticate)

/**
 * @swagger
 * /api/files:
 *   post:
 *     tags: [Files]
 *     summary: Upload a file
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *               purpose:
 *                 type: string
 *                 enum: [resume, other]
 */
router.post('/', upload.single('file'), uploadFile)

/**
 * @swagger
 * /api/files:
 *   get:
 *     tags: [Files]
 *     summary: Get user files
 *     security:
 *       - bearerAuth: []
 */
router.get('/', getUserFiles)

/**
 * @swagger
 * /api/files/{id}:
 *   delete:
 *     tags: [Files]
 *     summary: Delete a file
 *     security:
 *       - bearerAuth: []
 */
router.delete('/:id', deleteFile)

export default router
