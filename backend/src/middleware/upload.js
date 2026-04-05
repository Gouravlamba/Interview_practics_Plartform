import multer from 'multer'
import path from 'path'
import fs from 'fs'
import { config } from '../config/index.js'
import { AppError } from './error.js'

const ALLOWED_MIMETYPES = [
  'application/pdf',
  'text/plain',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
]

const uploadDir = path.resolve(config.upload.dir)
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true })
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase()
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`
    cb(null, unique)
  },
})

const fileFilter = (_req, file, cb) => {
  if (ALLOWED_MIMETYPES.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(new AppError('Only PDF, TXT, DOC, and DOCX files are allowed', 400), false)
  }
}

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: config.upload.maxFileSizeMB * 1024 * 1024 },
})
